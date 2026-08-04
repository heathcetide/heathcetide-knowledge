/**
 * GitHub-style contribution heatmap.
 * @param {HTMLElement} container
 * @param {Array<{ date: string, count: number, day?: object|null }>} dayCounts
 * @param {number} weeks
 * @param {(item: object) => string} [tooltipFn]
 */
export function renderContribHeatmap (container, dayCounts, weeks = 53, tooltipFn) {
  container.empty();
  // 清掉上次挂在 body 上的 tip，避免刷新后残留
  document
    .querySelectorAll(".contrib-heat-tooltip")
    .forEach((el) => el.remove());

  container.createDiv({ cls: "contrib-chart-title", text: "写作贡献图谱" });

  const wrap = container.createDiv({ cls: "contrib-heatmap-wrap" });
  const tip = document.body.createDiv({ cls: "contrib-heat-tooltip" });
  tip.style.display = "none";

  const hideTip = () => {
    tip.style.display = "none";
  };
  const placeTip = (ev, text) => {
    tip.style.display = "block";
    tip.setText(text);
    tip.style.left = "0px";
    tip.style.top = "0px";
    const tw = tip.offsetWidth || 160;
    const th = tip.offsetHeight || 28;
    const pad = 10;
    let left = ev.clientX + 14;
    let top = ev.clientY + 16; // 光标下方，不挡格子
    if (left + tw + pad > window.innerWidth) {
      left = Math.max(pad, ev.clientX - tw - 12);
    }
    if (top + th + pad > window.innerHeight) {
      top = Math.max(pad, ev.clientY - th - 12);
    }
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  };

  const map = new Map((dayCounts || []).map((d) => [d.date, d]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const cell = 12;
  const gap = 3;
  const labelW = 28;
  const monthsH = 18;
  const cols = Math.ceil((today - start) / 86400000 / 7) + 1;
  const W = labelW + cols * (cell + gap) + 8;
  const H = monthsH + 7 * (cell + gap) + 24;

  const max = Math.max(1, ...[...map.values()].map((d) => d.count || 0));
  const levels = (n) => {
    if (!n) return 0;
    const r = n / max;
    if (r <= 0.15) return 1;
    if (r <= 0.35) return 2;
    if (r <= 0.65) return 3;
    return 4;
  };

  const defaultTip = (item) => {
    const day = item.day;
    if (!item.count) return `${item.date} · 无记录`;
    const edits = day?.edits || 0;
    const creates = day?.creates || 0;
    const delta = day?.charsDelta || 0;
    const git = day?.gitTouches || 0;
    const parts = [`${item.date}`];
    if (edits) parts.push(`编辑 ${edits} 次`);
    if (creates) parts.push(`新建 ${creates}`);
    if (delta) parts.push(`字数 ${delta > 0 ? "+" : ""}${delta}`);
    if (!edits && git) parts.push(`Git 触及 ${git} 文件`);
    if (day?.gitCommits) parts.push(`${day.gitCommits} commits`);
    return parts.join(" · ");
  };

  const tipText = tooltipFn || defaultTip;

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "contrib-svg contrib-heatmap");
  svg.style.overflow = "visible";

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  for (let r = 0; r < 7; r++) {
    if (r % 2 === 1) {
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", "0");
      t.setAttribute("y", String(monthsH + r * (cell + gap) + cell - 1));
      t.setAttribute("font-size", "9");
      t.setAttribute("fill", "currentColor");
      t.setAttribute("opacity", "0.45");
      t.textContent = weekdays[r];
      svg.appendChild(t);
    }
  }

  let col = 0;
  const cursor = new Date(start);
  let lastMonth = -1;
  let started = false;
  while (cursor <= today) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    const dow = cursor.getDay();
    if (dow === 0) {
      if (started) col++;
      started = true;
    }
    if (cursor.getMonth() !== lastMonth && (dow === 0 || col === 0)) {
      lastMonth = cursor.getMonth();
      const mt = document.createElementNS(ns, "text");
      mt.setAttribute("x", String(labelW + col * (cell + gap)));
      mt.setAttribute("y", "12");
      mt.setAttribute("font-size", "9");
      mt.setAttribute("fill", "currentColor");
      mt.setAttribute("opacity", "0.55");
      mt.textContent = `${cursor.getMonth() + 1}月`;
      svg.appendChild(mt);
    }
    const item = map.get(key) || { date: key, count: 0, day: null };
    const cnt = item.count || 0;
    const lv = levels(cnt);
    const x = labelW + col * (cell + gap);
    const yy = monthsH + dow * (cell + gap);
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("class", `contrib-heat-lv${lv}`);
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(yy));
    rect.setAttribute("width", String(cell));
    rect.setAttribute("height", String(cell));
    rect.setAttribute("rx", "2");
    rect.style.cursor = "pointer";
    rect.addEventListener("mouseenter", (ev) => placeTip(ev, tipText(item)));
    rect.addEventListener("mousemove", (ev) => placeTip(ev, tipText(item)));
    rect.addEventListener("mouseleave", hideTip);
    svg.appendChild(rect);
    cursor.setDate(cursor.getDate() + 1);
  }

  const legendY = H - 6;
  const legend = document.createElementNS(ns, "g");
  const lt = document.createElementNS(ns, "text");
  lt.setAttribute("x", String(labelW));
  lt.setAttribute("y", String(legendY));
  lt.setAttribute("font-size", "9");
  lt.setAttribute("fill", "currentColor");
  lt.setAttribute("opacity", "0.5");
  lt.textContent = "少";
  legend.appendChild(lt);
  for (let i = 0; i <= 4; i++) {
    const r = document.createElementNS(ns, "rect");
    r.setAttribute("class", `contrib-heat-lv${i}`);
    r.setAttribute("x", String(labelW + 18 + i * 14));
    r.setAttribute("y", String(legendY - 9));
    r.setAttribute("width", "11");
    r.setAttribute("height", "11");
    r.setAttribute("rx", "2");
    legend.appendChild(r);
  }
  const lt2 = document.createElementNS(ns, "text");
  lt2.setAttribute("x", String(labelW + 18 + 5 * 14));
  lt2.setAttribute("y", String(legendY));
  lt2.setAttribute("font-size", "9");
  lt2.setAttribute("fill", "currentColor");
  lt2.setAttribute("opacity", "0.5");
  lt2.textContent = "多";
  legend.appendChild(lt2);
  svg.appendChild(legend);

  wrap.appendChild(svg);
}
