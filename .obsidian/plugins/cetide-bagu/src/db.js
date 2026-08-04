import initSqlJs from "sql.js/dist/sql-wasm.js";
import { DB_PATH } from "./constants.js";
import { todayKey } from "./util.js";

function rowsFrom(stmt) {
  const cols = stmt.getColumnNames();
  const out = [];
  while (stmt.step()) {
    const values = stmt.get();
    const row = {};
    cols.forEach((c, i) => (row[c] = values[i]));
    out.push(row);
  }
  stmt.free();
  return out;
}

export class BaguDb {
  constructor(app, pluginDir) {
    this.app = app;
    this.pluginDir = pluginDir || ".obsidian/plugins/cetide-bagu";
    this.db = null;
    this.SQL = null;
    this.path = DB_PATH;
    this._saveTimer = null;
  }

  async init() {
    const locateFile = (file) => {
      const rel = `${this.pluginDir}/${file}`.replace(/\\/g, "/");
      try {
        return this.app.vault.adapter.getResourcePath(rel);
      } catch (_) {
        return rel;
      }
    };
    this.SQL = await initSqlJs({ locateFile });
    const adapter = this.app.vault.adapter;
    const exists = await adapter.exists(this.path);
    if (exists) {
      const bin = await adapter.readBinary(this.path);
      this.db = new this.SQL.Database(new Uint8Array(bin));
    } else {
      if (!(await adapter.exists(".bagu"))) {
        await adapter.mkdir(".bagu");
      }
      this.db = new this.SQL.Database();
    }
    this.migrate();
    await this.persist(true);
  }

  migrate() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        path TEXT NOT NULL,
        module TEXT NOT NULL,
        num TEXT,
        question TEXT NOT NULL,
        answer TEXT,
        heading TEXT,
        updated_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        ease REAL DEFAULT 2.5,
        interval_days REAL DEFAULT 0,
        reps INTEGER DEFAULT 0,
        lapses INTEGER DEFAULT 0,
        due_at INTEGER,
        state TEXT DEFAULT 'new',
        last_grade TEXT,
        last_reviewed_at INTEGER,
        created_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS review_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_id TEXT NOT NULL,
        grade TEXT,
        reviewed_at INTEGER,
        scheduled_days REAL,
        mode TEXT,
        plan_date TEXT
      );
      CREATE TABLE IF NOT EXISTS daily_plans (
        plan_date TEXT PRIMARY KEY,
        new_ids TEXT,
        review_ids TEXT,
        done_ids TEXT,
        created_at INTEGER,
        modules TEXT
      );
      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(due_at);
      CREATE INDEX IF NOT EXISTS idx_logs_time ON review_logs(reviewed_at);
      CREATE INDEX IF NOT EXISTS idx_q_module ON questions(module);
    `);
    // migrations
    this.ensureColumn("review_logs", "score", "REAL");
    this.ensureColumn("review_logs", "feedback", "TEXT");
    this.ensureColumn("review_logs", "user_answer", "TEXT");
    this.ensureColumn("cards", "last_score", "REAL");
    this.ensureColumn("daily_plans", "focus_module", "TEXT");
    this.ensureColumn("daily_plans", "specialty_ids", "TEXT");
    this.ensureColumn("daily_plans", "quiz_ids", "TEXT");
    this.ensureColumn("daily_plans", "quiz_done_ids", "TEXT");
    this.ensureColumn("daily_plans", "quiz_scores", "TEXT");
    this.ensureColumn("daily_plans", "quiz_modules", "TEXT");
    this.ensureColumn("cards", "favorite", "INTEGER DEFAULT 0");
    this.ensureColumn("cards", "favorited_at", "INTEGER");
  }

  ensureColumn(table, column, type) {
    try {
      const info = this.db.exec(`PRAGMA table_info(${table})`);
      const cols = new Set();
      if (info[0] && info[0].values) {
        for (const row of info[0].values) cols.add(row[1]);
      }
      if (!cols.has(column)) {
        this.db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
      }
    } catch (e) {
      console.warn("ensureColumn", table, column, e);
    }
  }

  persist(immediate = false) {
    const doSave = async () => {
      try {
        const data = this.db.export();
        const adapter = this.app.vault.adapter;
        if (!(await adapter.exists(".bagu"))) {
          await adapter.mkdir(".bagu");
        }
        await adapter.writeBinary(this.path, data);
      } catch (e) {
        console.error("bagu db save failed", e);
      }
    };
    if (immediate) return doSave();
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(doSave, 400);
    return Promise.resolve();
  }

  upsertQuestions(list) {
    const now = Date.now();
    const upsert = this.db.prepare(`
      INSERT INTO questions (id, path, module, num, question, answer, heading, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        path=excluded.path,
        module=excluded.module,
        num=excluded.num,
        question=excluded.question,
        answer=excluded.answer,
        heading=excluded.heading,
        updated_at=excluded.updated_at
    `);
    const ensureCard = this.db.prepare(`
      INSERT OR IGNORE INTO cards (id, ease, interval_days, reps, lapses, due_at, state, created_at)
      VALUES (?, 2.5, 0, 0, 0, ?, 'new', ?)
    `);
    this.db.run("BEGIN");
    try {
      for (const q of list) {
        upsert.run([
          q.id,
          q.path,
          q.module,
          String(q.num),
          q.question,
          q.answer || "",
          q.heading || "",
          now,
        ]);
        ensureCard.run([q.id, now, now]);
      }
      this.db.run("COMMIT");
    } catch (e) {
      this.db.run("ROLLBACK");
      throw e;
    }
    upsert.free();
    ensureCard.free();
    return this.persist();
  }

  getModules() {
    const stmt = this.db.prepare(
      `SELECT module, COUNT(*) AS cnt FROM questions GROUP BY module ORDER BY module`
    );
    return rowsFrom(stmt);
  }

  getQuestion(id) {
    const stmt = this.db.prepare(`SELECT * FROM questions WHERE id = ?`);
    stmt.bind([id]);
    const rows = rowsFrom(stmt);
    return rows[0] || null;
  }

  getCard(id) {
    const stmt = this.db.prepare(`SELECT * FROM cards WHERE id = ?`);
    stmt.bind([id]);
    return rowsFrom(stmt)[0] || null;
  }

  getCardJoin(id) {
    const stmt = this.db.prepare(`
      SELECT q.*, c.ease, c.interval_days, c.reps, c.lapses, c.due_at, c.state,
             c.last_grade, c.last_reviewed_at, c.favorite, c.favorited_at
      FROM questions q JOIN cards c ON q.id = c.id
      WHERE q.id = ?
    `);
    stmt.bind([id]);
    return rowsFrom(stmt)[0] || null;
  }

  isFavorite(id) {
    const c = this.getCard(id);
    return !!(c && c.favorite);
  }

  /** @returns {boolean} 收藏后为 true */
  toggleFavorite(id) {
    const c = this.getCard(id);
    if (!c) return false;
    const next = c.favorite ? 0 : 1;
    this.db.run(
      `UPDATE cards SET favorite = ?, favorited_at = ? WHERE id = ?`,
      [next, next ? Date.now() : null, id]
    );
    this.persist();
    return !!next;
  }

  setFavorite(id, on) {
    this.db.run(
      `UPDATE cards SET favorite = ?, favorited_at = ? WHERE id = ?`,
      [on ? 1 : 0, on ? Date.now() : null, id]
    );
    this.persist();
  }

  listFavorites(limit = 200) {
    const stmt = this.db.prepare(`
      SELECT q.id, q.module, q.path, q.num, q.question, c.favorited_at, c.state,
             c.interval_days, c.last_score
      FROM questions q
      JOIN cards c ON q.id = c.id
      WHERE c.favorite = 1
      ORDER BY c.favorited_at DESC
      LIMIT ?
    `);
    stmt.bind([limit]);
    return rowsFrom(stmt);
  }

  countFavorites() {
    const rows = rowsFrom(
      this.db.prepare(`SELECT COUNT(*) AS c FROM cards WHERE favorite = 1`)
    );
    return rows[0] ? rows[0].c : 0;
  }

  /**
   * 题库浏览：按模块 / 关键词 / 状态 / 收藏筛选
   * @param {{ module?: string, keyword?: string, state?: string, favoriteOnly?: boolean, limit?: number, offset?: number }} opts
   */
  listQuestions(opts = {}) {
    const {
      module = "",
      keyword = "",
      state = "",
      favoriteOnly = false,
      limit = 500,
      offset = 0,
    } = opts;
    let sql = `
      SELECT q.id, q.module, q.path, q.num, q.question, q.heading,
             c.state, c.interval_days, c.reps, c.last_score, c.favorite, c.due_at
      FROM questions q
      JOIN cards c ON q.id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (module) {
      sql += ` AND q.module = ?`;
      params.push(module);
    }
    if (keyword) {
      sql += ` AND (q.question LIKE ? OR q.path LIKE ? OR q.heading LIKE ?)`;
      const like = `%${keyword}%`;
      params.push(like, like, like);
    }
    if (state) {
      sql += ` AND c.state = ?`;
      params.push(state);
    }
    if (favoriteOnly) {
      sql += ` AND c.favorite = 1`;
    }
    sql += ` ORDER BY q.module, q.path, CAST(q.num AS INTEGER), q.num LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    return rowsFrom(stmt);
  }

  countQuestions(opts = {}) {
    const {
      module = "",
      keyword = "",
      state = "",
      favoriteOnly = false,
    } = opts;
    let sql = `
      SELECT COUNT(*) AS c
      FROM questions q
      JOIN cards c ON q.id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (module) {
      sql += ` AND q.module = ?`;
      params.push(module);
    }
    if (keyword) {
      sql += ` AND (q.question LIKE ? OR q.path LIKE ? OR q.heading LIKE ?)`;
      const like = `%${keyword}%`;
      params.push(like, like, like);
    }
    if (state) {
      sql += ` AND c.state = ?`;
      params.push(state);
    }
    if (favoriteOnly) {
      sql += ` AND c.favorite = 1`;
    }
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const rows = rowsFrom(stmt);
    return rows[0] ? rows[0].c : 0;
  }

  listDue(moduleSet, now, limit) {
    let sql = `
      SELECT q.id FROM questions q
      JOIN cards c ON q.id = c.id
      WHERE c.due_at <= ? AND c.state != 'new'
    `;
    const params = [now];
    if (moduleSet && moduleSet.size) {
      const mods = [...moduleSet];
      sql += ` AND q.module IN (${mods.map(() => "?").join(",")})`;
      params.push(...mods);
    }
    sql += ` ORDER BY c.due_at ASC LIMIT ?`;
    params.push(limit);
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    return rowsFrom(stmt).map((r) => r.id);
  }

  listNew(moduleSet, limit) {
    let sql = `
      SELECT q.id FROM questions q
      JOIN cards c ON q.id = c.id
      WHERE c.state = 'new'
    `;
    const params = [];
    if (moduleSet && moduleSet.size) {
      const mods = [...moduleSet];
      sql += ` AND q.module IN (${mods.map(() => "?").join(",")})`;
      params.push(...mods);
    }
    sql += ` ORDER BY q.module, q.path, q.num LIMIT ?`;
    params.push(limit);
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    return rowsFrom(stmt).map((r) => r.id);
  }

  listRandom(moduleSet, excludeIds, limit) {
    let sql = `SELECT q.id FROM questions q WHERE 1=1`;
    const params = [];
    if (moduleSet && moduleSet.size) {
      const mods = [...moduleSet];
      sql += ` AND q.module IN (${mods.map(() => "?").join(",")})`;
      params.push(...mods);
    }
    if (excludeIds && excludeIds.length) {
      sql += ` AND q.id NOT IN (${excludeIds.map(() => "?").join(",")})`;
      params.push(...excludeIds);
    }
    sql += ` ORDER BY RANDOM() LIMIT ?`;
    params.push(limit);
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    return rowsFrom(stmt).map((r) => r.id);
  }

  updateCard(id, fields) {
    this.db.run(
      `UPDATE cards SET
        ease = ?, interval_days = ?, reps = ?, lapses = ?,
        due_at = ?, state = ?, last_grade = ?, last_reviewed_at = ?,
        last_score = ?
       WHERE id = ?`,
      [
        fields.ease,
        fields.interval_days,
        fields.reps,
        fields.lapses,
        fields.due_at,
        fields.state,
        fields.last_grade,
        fields.last_reviewed_at,
        fields.last_score != null ? fields.last_score : null,
        id,
      ]
    );
    return this.persist();
  }

  addLog({
    card_id,
    grade,
    reviewed_at,
    scheduled_days,
    mode,
    plan_date,
    score,
    feedback,
    user_answer,
  }) {
    this.db.run(
      `INSERT INTO review_logs (card_id, grade, reviewed_at, scheduled_days, mode, plan_date, score, feedback, user_answer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        card_id,
        grade,
        reviewed_at,
        scheduled_days,
        mode,
        plan_date,
        score != null ? score : null,
        feedback || null,
        user_answer || null,
      ]
    );
    return this.persist();
  }

  getLog(id) {
    const stmt = this.db.prepare(`
      SELECT l.*, q.question, q.answer, q.module, q.path, q.num, q.heading
      FROM review_logs l
      LEFT JOIN questions q ON q.id = l.card_id
      WHERE l.id = ?
    `);
    stmt.bind([id]);
    return rowsFrom(stmt)[0] || null;
  }

  /** daily review counts for heatmap */
  dailyReviewCounts(daysBack = 120) {
    const since = Date.now() - daysBack * 86400000;
    const stmt = this.db.prepare(`
      SELECT date(reviewed_at / 1000, 'unixepoch', 'localtime') AS d,
             COUNT(*) AS c
      FROM review_logs
      WHERE reviewed_at >= ?
      GROUP BY d
      ORDER BY d
    `);
    stmt.bind([since]);
    return rowsFrom(stmt).map((r) => ({ date: r.d, count: r.c }));
  }

  getMeta(key) {
    const stmt = this.db.prepare(`SELECT value FROM meta WHERE key = ?`);
    stmt.bind([key]);
    const row = rowsFrom(stmt)[0];
    return row ? row.value : null;
  }

  setMeta(key, value) {
    this.db.run(
      `INSERT INTO meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, String(value)]
    );
    return this.persist();
  }

  listIdsByModule(moduleName) {
    const stmt = this.db.prepare(
      `SELECT id FROM questions WHERE module = ? ORDER BY path, num`
    );
    stmt.bind([moduleName]);
    return rowsFrom(stmt).map((r) => r.id);
  }

  listIdsByModules(moduleSet) {
    if (!moduleSet || !moduleSet.size) {
      const stmt = this.db.prepare(`SELECT id FROM questions`);
      return rowsFrom(stmt).map((r) => r.id);
    }
    const mods = [...moduleSet];
    const stmt = this.db.prepare(
      `SELECT id FROM questions WHERE module IN (${mods
        .map(() => "?")
        .join(",")})`
    );
    stmt.bind(mods);
    return rowsFrom(stmt).map((r) => r.id);
  }

  getPlan(dateKey) {
    const stmt = this.db.prepare(
      `SELECT * FROM daily_plans WHERE plan_date = ?`
    );
    stmt.bind([dateKey]);
    const row = rowsFrom(stmt)[0];
    if (!row) return null;
    return {
      plan_date: row.plan_date,
      new_ids: JSON.parse(row.new_ids || "[]"),
      review_ids: JSON.parse(row.review_ids || "[]"),
      done_ids: JSON.parse(row.done_ids || "[]"),
      modules: JSON.parse(row.modules || "[]"),
      focus_module: row.focus_module || "",
      specialty_ids: JSON.parse(row.specialty_ids || "[]"),
      quiz_ids: JSON.parse(row.quiz_ids || "[]"),
      quiz_done_ids: JSON.parse(row.quiz_done_ids || "[]"),
      quiz_scores: JSON.parse(row.quiz_scores || "{}"),
      quiz_modules: JSON.parse(row.quiz_modules || "[]"),
      created_at: row.created_at,
    };
  }

  savePlan(plan) {
    this.db.run(
      `INSERT INTO daily_plans (plan_date, new_ids, review_ids, done_ids, created_at, modules, focus_module, specialty_ids, quiz_ids, quiz_done_ids, quiz_scores, quiz_modules)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(plan_date) DO UPDATE SET
         new_ids=excluded.new_ids,
         review_ids=excluded.review_ids,
         done_ids=excluded.done_ids,
         modules=excluded.modules,
         focus_module=excluded.focus_module,
         specialty_ids=excluded.specialty_ids,
         quiz_ids=excluded.quiz_ids,
         quiz_done_ids=excluded.quiz_done_ids,
         quiz_scores=excluded.quiz_scores,
         quiz_modules=excluded.quiz_modules`,
      [
        plan.plan_date,
        JSON.stringify(plan.new_ids || []),
        JSON.stringify(plan.review_ids || []),
        JSON.stringify(plan.done_ids || []),
        plan.created_at || Date.now(),
        JSON.stringify(plan.modules || []),
        plan.focus_module || "",
        JSON.stringify(plan.specialty_ids || []),
        JSON.stringify(plan.quiz_ids || []),
        JSON.stringify(plan.quiz_done_ids || []),
        JSON.stringify(plan.quiz_scores || {}),
        JSON.stringify(plan.quiz_modules || []),
      ]
    );
    return this.persist();
  }

  markSpecialtyDone(dateKey, cardId) {
    const plan = this.getPlan(dateKey);
    if (!plan) return Promise.resolve();
    if (!plan.done_ids.includes(cardId)) {
      plan.done_ids.push(cardId);
      return this.savePlan(plan);
    }
    return Promise.resolve();
  }

  markQuizDone(dateKey, cardId, score) {
    const plan = this.getPlan(dateKey);
    if (!plan) return Promise.resolve();
    if (!plan.quiz_done_ids.includes(cardId)) {
      plan.quiz_done_ids.push(cardId);
    }
    plan.quiz_scores = plan.quiz_scores || {};
    if (score != null) plan.quiz_scores[cardId] = score;
    return this.savePlan(plan);
  }

  /** @deprecated use markSpecialtyDone / markQuizDone */
  markPlanDone(dateKey, cardId) {
    return this.markSpecialtyDone(dateKey, cardId);
  }

  statsOverview() {
    const total = rowsFrom(
      this.db.prepare(`SELECT COUNT(*) AS c FROM questions`)
    )[0].c;
    const newC = rowsFrom(
      this.db.prepare(`SELECT COUNT(*) AS c FROM cards WHERE state = 'new'`)
    )[0].c;
    const stmt = this.db.prepare(
      `SELECT COUNT(*) AS c FROM cards WHERE due_at <= ? AND state != 'new'`
    );
    stmt.bind([Date.now()]);
    const dueC = rowsFrom(stmt)[0].c;

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const stmt2 = this.db.prepare(
      `SELECT COUNT(*) AS c FROM review_logs WHERE reviewed_at >= ?`
    );
    stmt2.bind([start.getTime()]);
    const todayReviews = rowsFrom(stmt2)[0].c;

    const streak = this.computeStreak();

    const stmt3 = this.db.prepare(`
      SELECT q.module,
        COUNT(*) AS total,
        SUM(CASE WHEN c.state = 'new' THEN 1 ELSE 0 END) AS new_cnt,
        SUM(CASE WHEN c.state != 'new' AND c.due_at <= ? THEN 1 ELSE 0 END) AS due_cnt,
        AVG(c.reps) AS avg_reps
      FROM questions q JOIN cards c ON q.id = c.id
      GROUP BY q.module
      ORDER BY q.module
    `);
    stmt3.bind([Date.now()]);
    const modules = rowsFrom(stmt3);

    return {
      total,
      newCount: newC,
      dueCount: dueC,
      todayReviews,
      streak,
      modules,
    };
  }

  computeStreak() {
    const stmt = this.db.prepare(`
      SELECT DISTINCT date(reviewed_at / 1000, 'unixepoch', 'localtime') AS d
      FROM review_logs
      ORDER BY d DESC
      LIMIT 400
    `);
    const days = rowsFrom(stmt).map((r) => r.d);
    if (!days.length) return 0;
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (;;) {
      const key = todayKey(cursor);
      if (days.includes(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        // allow today empty if no review yet today — streak from yesterday
        if (streak === 0 && key === todayKey()) {
          cursor.setDate(cursor.getDate() - 1);
          continue;
        }
        break;
      }
      if (streak > 365) break;
    }
    return streak;
  }

  recentLogs(limit = 50) {
    const stmt = this.db.prepare(`
      SELECT l.*, q.question, q.module, q.path
      FROM review_logs l
      LEFT JOIN questions q ON q.id = l.card_id
      ORDER BY l.reviewed_at DESC
      LIMIT ?
    `);
    stmt.bind([limit]);
    return rowsFrom(stmt);
  }

  questionCount() {
    return rowsFrom(this.db.prepare(`SELECT COUNT(*) AS c FROM questions`))[0]
      .c;
  }
}

/** 任务一：清完整个专题；任务二：限定范围随机拷问 N 题 */
export function ensureDailyPlan(db, settings, moduleSet, quizModuleSet) {
  const dateKey = todayKey();
  const existing = db.getPlan(dateKey);
  if (existing) return existing;

  const now = Date.now();
  const quizN = settings.quizCount || settings.dailyTotalLimit || 15;
  const mods =
    moduleSet && moduleSet.size
      ? [...moduleSet].sort()
      : db.getModules().map((m) => m.module);

  const last = db.getMeta("last_focus_module");
  let focus = mods[0] || "";
  if (mods.length) {
    const idx = Math.max(0, mods.indexOf(last));
    focus = mods[(idx + 1) % mods.length];
  }
  db.setMeta("last_focus_module", focus);

  // 任务一：整个专题全部题目
  const specialty_ids = focus ? db.listIdsByModule(focus) : [];

  // 任务二：限定范围随机抽题
  const qMods =
    quizModuleSet && quizModuleSet.size
      ? quizModuleSet
      : settings.quizModules && settings.quizModules.length
        ? new Set(settings.quizModules)
        : moduleSet && moduleSet.size
          ? moduleSet
          : null;
  const pool = db.listIdsByModules(qMods);
  // shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const quiz_ids = pool.slice(0, Math.min(quizN, pool.length));

  const plan = {
    plan_date: dateKey,
    new_ids: [],
    review_ids: specialty_ids.slice(), // 兼容旧 queue字段：专题走 review_ids
    done_ids: [],
    modules: mods,
    focus_module: focus,
    specialty_ids,
    quiz_ids,
    quiz_done_ids: [],
    quiz_scores: {},
    quiz_modules: qMods ? [...qMods] : [],
    created_at: now,
  };
  db.savePlan(plan);
  return plan;
}

export function planQueue(plan, mode = "specialty") {
  if (mode === "quiz") {
    const done = new Set(plan.quiz_done_ids || []);
    return (plan.quiz_ids || []).filter((id) => !done.has(id));
  }
  const done = new Set(plan.done_ids || []);
  return (plan.specialty_ids || plan.review_ids || []).filter(
    (id) => !done.has(id)
  );
}

export function planTaskStatus(plan, settings = {}) {
  const pass = settings.quizPassScore ?? 70;
  const specialty = plan.specialty_ids || [];
  const done = new Set(plan.done_ids || []);
  const specialtyDone =
    specialty.length === 0 ? true : specialty.every((id) => done.has(id));

  const quizIds = plan.quiz_ids || [];
  const quizDone = new Set(plan.quiz_done_ids || []);
  const quizDoneCount = quizIds.filter((id) => quizDone.has(id)).length;
  const quizComplete =
    quizIds.length === 0 ? true : quizIds.every((id) => quizDone.has(id));

  const scores = plan.quiz_scores || {};
  const scored = quizIds
    .filter((id) => quizDone.has(id) && scores[id] != null)
    .map((id) => Number(scores[id]));
  const avgScore = scored.length
    ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
    : null;
  const passCount = scored.filter((s) => s >= pass).length;
  const accuracy =
    scored.length === 0 ? null : Math.round((passCount / scored.length) * 100);

  return {
    focusModule: plan.focus_module || "",
    specialtyTotal: specialty.length,
    specialtyDoneCount: specialty.filter((id) => done.has(id)).length,
    specialtyDone,
    quizTotal: quizIds.length,
    quizDoneCount,
    quizComplete,
    quizModules: plan.quiz_modules || [],
    avgScore,
    accuracy,
    passScore: pass,
    allDone: specialtyDone && quizComplete,
  };
}
