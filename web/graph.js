/**
 * Obsidian 风格力导向知识图谱（自研 canvas，无 CDN 依赖）
 */

const FOLDER_COLORS = [
  "#0b6e57",
  "#1f6f8b",
  "#b45309",
  "#be123c",
  "#0f766e",
  "#0369a1",
  "#a16207",
  "#4d7c0f",
  "#c2410c",
  "#155e75",
];

function colorForFolder(folder, map) {
  if (!map.has(folder)) {
    map.set(folder, FOLDER_COLORS[map.size % FOLDER_COLORS.length]);
  }
  return map.get(folder);
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export class KnowledgeGraph {
  /**
   * @param {HTMLElement} el
   * @param {{ onOpen: (path: string) => void }} opts
   */
  constructor(el, opts) {
    this.el = el;
    this.onOpen = opts.onOpen;
    this.raw = null;
    this.folderColors = new Map();
    this.mode = "global";
    this.focusPath = null;

    this.canvas = null;
    this.ctx = null;
    this._ro = null;
    this._raf = 0;
    this._running = false;

    this.nodes = [];
    this.links = [];
    this.nodeById = new Map();

    this.w = 0;
    this.h = 0;
    this.dpr = 1;
    this.scale = 1;
    this.tx = 0;
    this.ty = 0;

    this.drag = null;
    this.hover = null;
    this.panning = null;
    this._moved = false;
    this.alpha = 1;
  }

  async load() {
    const res = await fetch(new URL("./graph.json", location.href).href, {
      cache: "no-cache",
    });
    if (!res.ok) throw new Error(`graph.json 加载失败 (${res.status})`);
    this.raw = await res.json();
    for (const n of this.raw.nodes) {
      colorForFolder(n.folder, this.folderColors);
    }
  }

  mount() {
    this.el.replaceChildren();
    const host = document.createElement("div");
    host.className = "graph-canvas";
    const canvas = document.createElement("canvas");
    host.appendChild(canvas);
    this.el.appendChild(host);
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this._bindPointer(host);
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(this.el);
    this.resize();
    this.render();
    this._start();
  }

  get mounted() {
    return Boolean(this.canvas);
  }

  _bindPointer(host) {
    host.addEventListener("wheel", (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const before = this._screenToWorld(mx, my);
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      this.scale = clamp(this.scale * factor, 0.15, 4);
      const after = this._screenToWorld(mx, my);
      this.tx += (after.x - before.x) * this.scale;
      this.ty += (after.y - before.y) * this.scale;
      this._paint();
    }, { passive: false });

    host.addEventListener("pointerdown", (e) => {
      host.setPointerCapture(e.pointerId);
      this._moved = false;
      const { x, y } = this._eventWorld(e);
      const hit = this._hitNode(x, y);
      if (hit) {
        this.drag = {
          id: hit.id,
          dx: hit.x - x,
          dy: hit.y - y,
          sx: e.clientX,
          sy: e.clientY,
        };
        hit.fx = hit.x;
        hit.fy = hit.y;
        this.alpha = Math.max(this.alpha, 0.4);
      } else {
        this.panning = { x: e.clientX, y: e.clientY, tx: this.tx, ty: this.ty };
      }
    });

    host.addEventListener("pointermove", (e) => {
      if (this.drag) {
        if (Math.hypot(e.clientX - this.drag.sx, e.clientY - this.drag.sy) > 3) {
          this._moved = true;
        }
        const { x, y } = this._eventWorld(e);
        const n = this.nodeById.get(this.drag.id);
        if (n) {
          n.fx = x + this.drag.dx;
          n.fy = y + this.drag.dy;
          n.x = n.fx;
          n.y = n.fy;
          this.alpha = Math.max(this.alpha, 0.25);
        }
        return;
      }
      if (this.panning) {
        if (Math.hypot(e.clientX - this.panning.x, e.clientY - this.panning.y) > 3) {
          this._moved = true;
        }
        this.tx = this.panning.tx + (e.clientX - this.panning.x);
        this.ty = this.panning.ty + (e.clientY - this.panning.y);
        this._paint();
        return;
      }
      const { x, y } = this._eventWorld(e);
      const hit = this._hitNode(x, y);
      this.hover = hit;
      host.style.cursor = hit ? "pointer" : "grab";
      this._paint();
    });

    const end = (e) => {
      const draggedId = this.drag?.id;
      if (this.drag) {
        const n = this.nodeById.get(this.drag.id);
        if (n) {
          n.fx = null;
          n.fy = null;
        }
        this.drag = null;
      }
      this.panning = null;
      try {
        host.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (!this._moved && draggedId) this.onOpen(draggedId);
    };
    host.addEventListener("pointerup", end);
    host.addEventListener("pointercancel", end);
  }

  _eventWorld(e) {
    const rect = this.canvas.getBoundingClientRect();
    return this._screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
  }

  _screenToWorld(sx, sy) {
    return {
      x: (sx - this.tx) / this.scale,
      y: (sy - this.ty) / this.scale,
    };
  }

  _hitNode(x, y) {
    let best = null;
    let bestD = Infinity;
    for (const n of this.nodes) {
      const r = n.r + 3 / this.scale;
      const d = (n.x - x) ** 2 + (n.y - y) ** 2;
      if (d <= r * r && d < bestD) {
        best = n;
        bestD = d;
      }
    }
    return best;
  }

  resize() {
    if (!this.canvas) return;
    const { width, height } = this.el.getBoundingClientRect();
    if (width < 2 || height < 2) return;
    this.w = width;
    this.h = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (!this.tx && !this.ty) {
      this.tx = width / 2;
      this.ty = height / 2;
    }
    this._paint();
  }

  setMode(mode) {
    this.mode = mode === "local" ? "local" : "global";
    this.render();
  }

  setFocus(path) {
    this.focusPath = path;
    this.render();
  }

  _subset() {
    const degree = new Map();
    for (const n of this.raw.nodes) degree.set(n.id, 0);
    for (const l of this.raw.links) {
      degree.set(l.source, (degree.get(l.source) || 0) + 1);
      degree.set(l.target, (degree.get(l.target) || 0) + 1);
    }

    if (this.mode !== "local" || !this.focusPath) {
      return {
        nodes: this.raw.nodes.map((n) => ({
          ...n,
          degree: degree.get(n.id) || 0,
        })),
        links: this.raw.links.map((l) => ({ ...l })),
      };
    }

    const focus = this.focusPath;
    const neigh = new Set([focus]);
    const localLinks = [];
    for (const l of this.raw.links) {
      if (l.source === focus || l.target === focus) {
        neigh.add(l.source);
        neigh.add(l.target);
        localLinks.push({ ...l, highlight: true });
      }
    }
    return {
      nodes: this.raw.nodes
        .filter((n) => neigh.has(n.id))
        .map((n) => ({
          ...n,
          degree: degree.get(n.id) || 0,
          highlight: n.id !== focus,
        })),
      links: localLinks,
    };
  }

  render() {
    if (!this.raw || !this.canvas) return;
    const data = this._subset();
    const prev = this.nodeById;
    this.nodeById = new Map();
    this.nodes = data.nodes.map((n, i) => {
      const old = prev.get(n.id);
      const angle = (i / Math.max(1, data.nodes.length)) * Math.PI * 2;
      const radius = 40 + Math.sqrt(data.nodes.length) * 18;
      const node = {
        id: n.id,
        label: n.label,
        folder: n.folder,
        degree: n.degree || 0,
        highlight: Boolean(n.highlight),
        x: old?.x ?? Math.cos(angle) * radius,
        y: old?.y ?? Math.sin(angle) * radius,
        vx: old?.vx ?? 0,
        vy: old?.vy ?? 0,
        fx: null,
        fy: null,
        r: 3.5 + Math.min(8, n.degree || 0) * 0.45,
      };
      this.nodeById.set(node.id, node);
      return node;
    });
    this.links = data.links
      .map((l) => ({
        source: this.nodeById.get(l.source),
        target: this.nodeById.get(l.target),
        highlight: Boolean(l.highlight),
      }))
      .filter((l) => l.source && l.target);

    this.alpha = 1;
    this._paint();
  }

  _tick() {
    if (this.alpha < 0.02) return;
    const nodes = this.nodes;
    const links = this.links;
    const n = nodes.length || 1;

    // repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist2 = dx * dx + dy * dy || 0.01;
        const dist = Math.sqrt(dist2);
        const force = 900 / dist2;
        dx = (dx / dist) * force;
        dy = (dy / dist) * force;
        a.vx += dx;
        a.vy += dy;
        b.vx -= dx;
        b.vy -= dy;
      }
    }

    // springs
    for (const l of links) {
      const a = l.source;
      const b = l.target;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const ideal = 70;
      const k = 0.03;
      const f = (dist - ideal) * k;
      dx = (dx / dist) * f;
      dy = (dy / dist) * f;
      a.vx += dx;
      a.vy += dy;
      b.vx -= dx;
      b.vy -= dy;
    }

    // center gravity
    for (const node of nodes) {
      node.vx -= node.x * 0.005;
      node.vy -= node.y * 0.005;
      if (node.fx != null) {
        node.x = node.fx;
        node.y = node.fy;
        node.vx = 0;
        node.vy = 0;
        continue;
      }
      node.vx *= 0.85;
      node.vy *= 0.85;
      node.x += node.vx * this.alpha;
      node.y += node.vy * this.alpha;
    }

    // mild cooling scaled by graph size
    this.alpha *= n > 180 ? 0.96 : 0.985;
  }

  _paint() {
    if (!this.ctx || !this.w) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.translate(this.tx, this.ty);
    ctx.scale(this.scale, this.scale);

    for (const l of this.links) {
      ctx.beginPath();
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
      ctx.strokeStyle = l.highlight
        ? "rgba(11, 110, 87, 0.55)"
        : "rgba(16, 36, 31, 0.16)";
      ctx.lineWidth = (l.highlight ? 2 : 1) / this.scale;
      ctx.stroke();
    }

    for (const n of this.nodes) {
      const isFocus = n.id === this.focusPath;
      const isHover = this.hover && this.hover.id === n.id;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = isFocus
        ? "#d97706"
        : n.highlight
          ? "#0b6e57"
          : colorForFolder(n.folder, this.folderColors);
      ctx.fill();
      if (isFocus || isHover) {
        ctx.lineWidth = 2 / this.scale;
        ctx.strokeStyle = "rgba(16,36,31,0.55)";
        ctx.stroke();
      }
    }

    // labels for local / hover / high-degree
    ctx.font = `${12 / this.scale}px "IBM Plex Sans", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (const n of this.nodes) {
      const show =
        this.mode === "local" ||
        n.id === this.focusPath ||
        (this.hover && this.hover.id === n.id) ||
        (n.degree >= 6 && this.scale > 0.7);
      if (!show) continue;
      ctx.fillStyle = "rgba(16, 36, 31, 0.8)";
      ctx.fillText(n.label, n.x, n.y + n.r + 3 / this.scale);
    }

    ctx.restore();
  }

  _start() {
    if (this._running) return;
    this._running = true;
    const loop = () => {
      if (!this._running) return;
      this._tick();
      this._paint();
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  destroy() {
    this._running = false;
    cancelAnimationFrame(this._raf);
    this._ro?.disconnect();
    this._ro = null;
    this.canvas = null;
    this.ctx = null;
    this.el.replaceChildren();
  }
}
