/** SVG charts: Ebbinghaus curve + contribution heatmap */

export function renderEbbinghausSvg(container, steps = [1, 2, 4, 7, 15, 30, 60]) {
  container.empty();
  container.createDiv({ cls: "bagu-chart-title", text: "艾宾浩斯记忆曲线（示意）" });

  const W = 420;
  const H = 180;
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const maxDay = Math.max(30, ...steps.filter((d) => d <= 60));
  const reviewSet = new Set(steps.filter((d) => d > 0 && d <= maxDay));

  let mem = 1;
  let S = 2;
  const curve = [{ t: 0, r: 1 }];
  for (let t = 1; t <= maxDay; t++) {
    mem = mem * Math.exp(-1 / (S * 3.2));
    if (reviewSet.has(t)) {
      mem = Math.min(1, mem + 0.5);
      S = Math.min(12, S * 1.7);
    }
    curve.push({ t, r: Math.max(0.05, mem) });
  }

  const xOf = (t) => pad.l + (t / maxDay) * innerW;
  const yOf = (r) => pad.t + (1 - r) * innerH;

  let d = "";
  curve.forEach((p, i) => {
    d += `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)},${yOf(p.r).toFixed(1)} `;
  });

  const marks = [...reviewSet]
    .map((t) => {
      const p = curve.find((c) => c.t === t) || { r: 0.5 };
      return `<circle cx="${xOf(t)}" cy="${yOf(p.r)}" r="3.5" fill="var(--interactive-accent)"/>
        <text x="${xOf(t)}" y="${yOf(p.r) - 8}" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.65">${t}d</text>`;
    })
    .join("");

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "bagu-svg");
  svg.innerHTML = `
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t + innerH}" stroke="currentColor" opacity="0.25"/>
    <line x1="${pad.l}" y1="${pad.t + innerH}" x2="${pad.l + innerW}" y2="${pad.t + innerH}" stroke="currentColor" opacity="0.25"/>
    <text x="8" y="${pad.t + 8}" font-size="10" fill="currentColor" opacity="0.55">记忆</text>
    <text x="${pad.l + innerW - 16}" y="${H - 8}" font-size="10" fill="currentColor" opacity="0.55">天</text>
    <path d="${d}" fill="none" stroke="var(--interactive-accent)" stroke-width="2.2"/>
    ${marks}
  `;
  container.appendChild(svg);
  container.createDiv({
    cls: "bagu-tip",
    text: `复习节点：${steps.join(" / ")} 天。及时复习可抬升曲线并拉长保持时间。`,
  });
}

/**
 * @param {HTMLElement} container
 * @param {Array<{date:string, count:number}>} dayCounts
 * @param {number} weeks
 */
export function renderHeatmapSvg(container, dayCounts, weeks = 16) {
  container.empty();
  container.createDiv({ cls: "bagu-chart-title", text: "每日打卡热力图" });

  const wrap = container.createDiv({ cls: "bagu-heatmap-wrap" });
  const tip = container.createDiv({ cls: "bagu-heat-tooltip" });
  tip.style.display = "none";

  const map = new Map((dayCounts || []).map((d) => [d.date, d.count]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay());

  const cell = 12;
  const gap = 3;
  const labelW = 28;
  const monthsH = 16;
  const cols = Math.ceil((today - start) / 86400000 / 7) + 1;
  const W = labelW + cols * (cell + gap) + 8;
  const H = monthsH + 7 * (cell + gap) + 22;

  const levels = (n) => {
    if (!n) return 0;
    if (n === 1) return 1;
    if (n <= 3) return 2;
    if (n <= 6) return 3;
    return 4;
  };

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "bagu-svg bagu-heatmap");
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
      mt.setAttribute("y", "10");
      mt.setAttribute("font-size", "9");
      mt.setAttribute("fill", "currentColor");
      mt.setAttribute("opacity", "0.55");
      mt.textContent = `${cursor.getMonth() + 1}月`;
      svg.appendChild(mt);
    }
    const cnt = map.get(key) || 0;
    const lv = levels(cnt);
    const x = labelW + col * (cell + gap);
    const yy = monthsH + dow * (cell + gap);
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("class", `bagu-heat-lv${lv}`);
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(yy));
    rect.setAttribute("width", String(cell));
    rect.setAttribute("height", String(cell));
    rect.setAttribute("rx", "2");
    rect.style.cursor = "pointer";
    rect.addEventListener("mouseenter", (ev) => {
      tip.style.display = "block";
      tip.setText(
        cnt
          ? `${key} · 复习 ${cnt} 次`
          : `${key} · 未打卡`
      );
      const wr = wrap.getBoundingClientRect();
      tip.style.left = `${ev.clientX - wr.left + 12}px`;
      tip.style.top = `${ev.clientY - wr.top - 28}px`;
    });
    rect.addEventListener("mousemove", (ev) => {
      const wr = wrap.getBoundingClientRect();
      tip.style.left = `${ev.clientX - wr.left + 12}px`;
      tip.style.top = `${ev.clientY - wr.top - 28}px`;
    });
    rect.addEventListener("mouseleave", () => {
      tip.style.display = "none";
    });
    svg.appendChild(rect);
    cursor.setDate(cursor.getDate() + 1);
  }

  // legend
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
    r.setAttribute("class", `bagu-heat-lv${i}`);
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
