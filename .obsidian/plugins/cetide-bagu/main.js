var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// <define:process.argv>
var define_process_argv_default;
var init_define_process_argv = __esm({
  "<define:process.argv>"() {
    define_process_argv_default = [];
  }
});

// node-stub:node:fs
var require_node_fs = __commonJS({
  "node-stub:node:fs"(exports, module2) {
    init_define_process_argv();
    module2.exports = {};
  }
});

// node-stub:node:crypto
var require_node_crypto = __commonJS({
  "node-stub:node:crypto"(exports, module2) {
    init_define_process_argv();
    module2.exports = {};
  }
});

// node_modules/sql.js/dist/sql-wasm.js
var require_sql_wasm = __commonJS({
  "node_modules/sql.js/dist/sql-wasm.js"(exports, module2) {
    init_define_process_argv();
    var initSqlJsPromise = void 0;
    var initSqlJs2 = function(moduleConfig) {
      if (initSqlJsPromise) {
        return initSqlJsPromise;
      }
      initSqlJsPromise = new Promise(function(resolveModule, reject) {
        var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
        var originalOnAbortFunction = Module["onAbort"];
        Module["onAbort"] = function(errorThatCausedAbort) {
          reject(new Error(errorThatCausedAbort));
          if (originalOnAbortFunction) {
            originalOnAbortFunction(errorThatCausedAbort);
          }
        };
        Module["postRun"] = Module["postRun"] || [];
        Module["postRun"].push(function() {
          resolveModule(Module);
        });
        module2 = void 0;
        var k;
        k || (k = typeof Module != "undefined" ? Module : {});
        var aa = !!globalThis.window, ba = !!globalThis.WorkerGlobalScope, ca = globalThis.process?.versions?.node && "renderer" != globalThis.process?.type;
        k.onRuntimeInitialized = function() {
          function a(f, l) {
            switch (typeof l) {
              case "boolean":
                bc(f, l ? 1 : 0);
                break;
              case "number":
                cc(f, l);
                break;
              case "string":
                dc(f, l, -1, -1);
                break;
              case "object":
                if (null === l) lb(f);
                else if (null != l.length) {
                  var n = da(l.length);
                  m.set(l, n);
                  ec(f, n, l.length, -1);
                  ea(n);
                } else sa(f, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
                break;
              default:
                lb(f);
            }
          }
          function b(f, l) {
            for (var n = [], p = 0; p < f; p += 1) {
              var u = r(l + 4 * p, "i32"), v = fc(u);
              if (1 === v || 2 === v) u = gc(u);
              else if (3 === v) u = hc(u);
              else if (4 === v) {
                v = u;
                u = ic(v);
                v = jc(v);
                for (var K = new Uint8Array(u), I = 0; I < u; I += 1) K[I] = m[v + I];
                u = K;
              } else u = null;
              n.push(u);
            }
            return n;
          }
          function c(f, l) {
            this.Qa = f;
            this.db = l;
            this.Oa = 1;
            this.mb = [];
          }
          function d(f, l) {
            this.db = l;
            this.fb = fa(f);
            if (null === this.fb) throw Error("Unable to allocate memory for the SQL string");
            this.lb = this.fb;
            this.$a = this.sb = null;
          }
          function e(f) {
            this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
            if (null != f) {
              var l = this.filename, n = "/", p = l;
              n && (n = "string" == typeof n ? n : ha(n), p = l ? ia(n + "/" + l) : n);
              l = ja(true, true);
              p = ka(
                p,
                l
              );
              if (f) {
                if ("string" == typeof f) {
                  n = Array(f.length);
                  for (var u = 0, v = f.length; u < v; ++u) n[u] = f.charCodeAt(u);
                  f = n;
                }
                la(p, l | 146);
                n = ma(p, 577);
                na(n, f, 0, f.length, 0);
                oa(n);
                la(p, l);
              }
            }
            this.handleError(q(this.filename, g));
            this.db = r(g, "i32");
            ob(this.db);
            this.gb = {};
            this.Sa = {};
          }
          var g = y(4), h = k.cwrap, q = h("sqlite3_open", "number", ["string", "number"]), w = h("sqlite3_close_v2", "number", ["number"]), t = h("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), x = h("sqlite3_changes", "number", ["number"]), D = h(
            "sqlite3_prepare_v2",
            "number",
            ["number", "string", "number", "number", "number"]
          ), pb = h("sqlite3_sql", "string", ["number"]), lc = h("sqlite3_normalized_sql", "string", ["number"]), qb = h("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), mc = h("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), rb = h("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), nc = h("sqlite3_bind_double", "number", ["number", "number", "number"]), oc = h("sqlite3_bind_int", "number", [
            "number",
            "number",
            "number"
          ]), pc = h("sqlite3_bind_parameter_index", "number", ["number", "string"]), qc = h("sqlite3_step", "number", ["number"]), rc = h("sqlite3_errmsg", "string", ["number"]), sc = h("sqlite3_column_count", "number", ["number"]), tc = h("sqlite3_data_count", "number", ["number"]), uc = h("sqlite3_column_double", "number", ["number", "number"]), sb = h("sqlite3_column_text", "string", ["number", "number"]), vc = h("sqlite3_column_blob", "number", ["number", "number"]), wc = h("sqlite3_column_bytes", "number", ["number", "number"]), xc = h(
            "sqlite3_column_type",
            "number",
            ["number", "number"]
          ), yc = h("sqlite3_column_name", "string", ["number", "number"]), zc = h("sqlite3_reset", "number", ["number"]), Ac = h("sqlite3_clear_bindings", "number", ["number"]), Bc = h("sqlite3_finalize", "number", ["number"]), tb = h("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), fc = h("sqlite3_value_type", "number", ["number"]), ic = h("sqlite3_value_bytes", "number", ["number"]), hc = h("sqlite3_value_text", "string", ["number"]), jc = h(
            "sqlite3_value_blob",
            "number",
            ["number"]
          ), gc = h("sqlite3_value_double", "number", ["number"]), cc = h("sqlite3_result_double", "", ["number", "number"]), lb = h("sqlite3_result_null", "", ["number"]), dc = h("sqlite3_result_text", "", ["number", "string", "number", "number"]), ec = h("sqlite3_result_blob", "", ["number", "number", "number", "number"]), bc = h("sqlite3_result_int", "", ["number", "number"]), sa = h("sqlite3_result_error", "", ["number", "string", "number"]), ub = h("sqlite3_aggregate_context", "number", ["number", "number"]), ob = h(
            "RegisterExtensionFunctions",
            "number",
            ["number"]
          ), vb = h("sqlite3_update_hook", "number", ["number", "number", "number"]);
          c.prototype.bind = function(f) {
            if (!this.Qa) throw "Statement closed";
            this.reset();
            return Array.isArray(f) ? this.Gb(f) : null != f && "object" === typeof f ? this.Hb(f) : true;
          };
          c.prototype.step = function() {
            if (!this.Qa) throw "Statement closed";
            this.Oa = 1;
            var f = qc(this.Qa);
            switch (f) {
              case 100:
                return true;
              case 101:
                return false;
              default:
                throw this.db.handleError(f);
            }
          };
          c.prototype.Ab = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return uc(this.Qa, f);
          };
          c.prototype.Ob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            f = sb(this.Qa, f);
            if ("function" !== typeof BigInt) throw Error("BigInt is not supported");
            return BigInt(f);
          };
          c.prototype.Tb = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            return sb(this.Qa, f);
          };
          c.prototype.getBlob = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            var l = wc(this.Qa, f);
            f = vc(this.Qa, f);
            for (var n = new Uint8Array(l), p = 0; p < l; p += 1) n[p] = m[f + p];
            return n;
          };
          c.prototype.get = function(f, l) {
            l = l || {};
            null != f && this.bind(f) && this.step();
            f = [];
            for (var n = tc(this.Qa), p = 0; p < n; p += 1) switch (xc(this.Qa, p)) {
              case 1:
                var u = l.useBigInt ? this.Ob(p) : this.Ab(p);
                f.push(u);
                break;
              case 2:
                f.push(this.Ab(p));
                break;
              case 3:
                f.push(this.Tb(p));
                break;
              case 4:
                f.push(this.getBlob(p));
                break;
              default:
                f.push(null);
            }
            return f;
          };
          c.prototype.qb = function() {
            for (var f = [], l = sc(this.Qa), n = 0; n < l; n += 1) f.push(yc(this.Qa, n));
            return f;
          };
          c.prototype.zb = function(f, l) {
            f = this.get(f, l);
            l = this.qb();
            for (var n = {}, p = 0; p < l.length; p += 1) n[l[p]] = f[p];
            return n;
          };
          c.prototype.Sb = function() {
            return pb(this.Qa);
          };
          c.prototype.Pb = function() {
            return lc(this.Qa);
          };
          c.prototype.run = function(f) {
            null != f && this.bind(f);
            this.step();
            return this.reset();
          };
          c.prototype.wb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            f = fa(f);
            this.mb.push(f);
            this.db.handleError(mc(this.Qa, l, f, -1, 0));
          };
          c.prototype.Fb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            var n = da(f.length);
            m.set(f, n);
            this.mb.push(n);
            this.db.handleError(rb(this.Qa, l, n, f.length, 0));
          };
          c.prototype.vb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            this.db.handleError((f === (f | 0) ? oc : nc)(
              this.Qa,
              l,
              f
            ));
          };
          c.prototype.Ib = function(f) {
            null == f && (f = this.Oa, this.Oa += 1);
            rb(this.Qa, f, 0, 0, 0);
          };
          c.prototype.xb = function(f, l) {
            null == l && (l = this.Oa, this.Oa += 1);
            switch (typeof f) {
              case "string":
                this.wb(f, l);
                return;
              case "number":
                this.vb(f, l);
                return;
              case "bigint":
                this.wb(f.toString(), l);
                return;
              case "boolean":
                this.vb(f + 0, l);
                return;
              case "object":
                if (null === f) {
                  this.Ib(l);
                  return;
                }
                if (null != f.length) {
                  this.Fb(f, l);
                  return;
                }
            }
            throw "Wrong API use : tried to bind a value of an unknown type (" + f + ").";
          };
          c.prototype.Hb = function(f) {
            var l = this;
            Object.keys(f).forEach(function(n) {
              var p = pc(l.Qa, n);
              0 !== p && l.xb(f[n], p);
            });
            return true;
          };
          c.prototype.Gb = function(f) {
            for (var l = 0; l < f.length; l += 1) this.xb(f[l], l + 1);
            return true;
          };
          c.prototype.reset = function() {
            this.freemem();
            return 0 === Ac(this.Qa) && 0 === zc(this.Qa);
          };
          c.prototype.freemem = function() {
            for (var f; void 0 !== (f = this.mb.pop()); ) ea(f);
          };
          c.prototype.Ya = function() {
            this.freemem();
            var f = 0 === Bc(this.Qa);
            delete this.db.gb[this.Qa];
            this.Qa = 0;
            return f;
          };
          d.prototype.next = function() {
            if (null === this.fb) return { done: true };
            null !== this.$a && (this.$a.Ya(), this.$a = null);
            if (!this.db.db) throw this.ob(), Error("Database closed");
            var f = pa(), l = y(4);
            qa(g);
            qa(l);
            try {
              this.db.handleError(qb(this.db.db, this.lb, -1, g, l));
              this.lb = r(l, "i32");
              var n = r(g, "i32");
              if (0 === n) return this.ob(), { done: true };
              this.$a = new c(n, this.db);
              this.db.gb[n] = this.$a;
              return { value: this.$a, done: false };
            } catch (p) {
              throw this.sb = z(this.lb), this.ob(), p;
            } finally {
              ra(f);
            }
          };
          d.prototype.ob = function() {
            ea(this.fb);
            this.fb = null;
          };
          d.prototype.Qb = function() {
            return null !== this.sb ? this.sb : z(this.lb);
          };
          "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
            return this;
          });
          e.prototype.run = function(f, l) {
            if (!this.db) throw "Database closed";
            if (l) {
              f = this.tb(f, l);
              try {
                f.step();
              } finally {
                f.Ya();
              }
            } else this.handleError(t(this.db, f, 0, 0, g));
            return this;
          };
          e.prototype.exec = function(f, l, n) {
            if (!this.db) throw "Database closed";
            var p = null, u = null, v = null;
            try {
              v = u = fa(f);
              var K = y(4);
              for (f = []; 0 !== r(v, "i8"); ) {
                qa(g);
                qa(K);
                this.handleError(qb(this.db, v, -1, g, K));
                var I = r(
                  g,
                  "i32"
                );
                v = r(K, "i32");
                if (0 !== I) {
                  var H = null;
                  p = new c(I, this);
                  for (null != l && p.bind(l); p.step(); ) null === H && (H = { columns: p.qb(), values: [] }, f.push(H)), H.values.push(p.get(null, n));
                  p.Ya();
                }
              }
              return f;
            } catch (L) {
              throw p && p.Ya(), L;
            } finally {
              u && ea(u);
            }
          };
          e.prototype.Mb = function(f, l, n, p, u) {
            "function" === typeof l && (p = n, n = l, l = void 0);
            f = this.tb(f, l);
            try {
              for (; f.step(); ) n(f.zb(null, u));
            } finally {
              f.Ya();
            }
            if ("function" === typeof p) return p();
          };
          e.prototype.tb = function(f, l) {
            qa(g);
            this.handleError(D(this.db, f, -1, g, 0));
            f = r(g, "i32");
            if (0 === f) throw "Nothing to prepare";
            var n = new c(f, this);
            null != l && n.bind(l);
            return this.gb[f] = n;
          };
          e.prototype.Ub = function(f) {
            return new d(f, this);
          };
          e.prototype.Nb = function() {
            Object.values(this.gb).forEach(function(l) {
              l.Ya();
            });
            Object.values(this.Sa).forEach(A);
            this.Sa = {};
            this.handleError(w(this.db));
            var f = ta(this.filename);
            this.handleError(q(this.filename, g));
            this.db = r(g, "i32");
            ob(this.db);
            return f;
          };
          e.prototype.close = function() {
            null !== this.db && (Object.values(this.gb).forEach(function(f) {
              f.Ya();
            }), Object.values(this.Sa).forEach(A), this.Sa = {}, this.Za && (A(this.Za), this.Za = void 0), this.handleError(w(this.db)), ua("/" + this.filename), this.db = null);
          };
          e.prototype.handleError = function(f) {
            if (0 === f) return null;
            f = rc(this.db);
            throw Error(f);
          };
          e.prototype.Rb = function() {
            return x(this.db);
          };
          e.prototype.Kb = function(f, l) {
            Object.prototype.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            var n = va(function(p, u, v) {
              u = b(u, v);
              try {
                var K = l.apply(null, u);
              } catch (I) {
                sa(p, I, -1);
                return;
              }
              a(p, K);
            }, "viii");
            this.Sa[f] = n;
            this.handleError(tb(
              this.db,
              f,
              l.length,
              1,
              0,
              n,
              0,
              0,
              0
            ));
            return this;
          };
          e.prototype.Jb = function(f, l) {
            var n = l.init || function() {
              return null;
            }, p = l.finalize || function(H) {
              return H;
            }, u = l.step;
            if (!u) throw "An aggregate function must have a step function in " + f;
            var v = {};
            Object.hasOwnProperty.call(this.Sa, f) && (A(this.Sa[f]), delete this.Sa[f]);
            l = f + "__finalize";
            Object.hasOwnProperty.call(this.Sa, l) && (A(this.Sa[l]), delete this.Sa[l]);
            var K = va(function(H, L, Pa) {
              var V = ub(H, 1);
              Object.hasOwnProperty.call(v, V) || (v[V] = n());
              L = b(L, Pa);
              L = [v[V]].concat(L);
              try {
                v[V] = u.apply(null, L);
              } catch (Dc) {
                delete v[V], sa(H, Dc, -1);
              }
            }, "viii"), I = va(function(H) {
              var L = ub(H, 1);
              try {
                var Pa = p(v[L]);
              } catch (V) {
                delete v[L];
                sa(H, V, -1);
                return;
              }
              a(H, Pa);
              delete v[L];
            }, "vi");
            this.Sa[f] = K;
            this.Sa[l] = I;
            this.handleError(tb(this.db, f, u.length - 1, 1, 0, 0, K, I, 0));
            return this;
          };
          e.prototype.Zb = function(f) {
            this.Za && (vb(this.db, 0, 0), A(this.Za), this.Za = void 0);
            if (!f) return this;
            this.Za = va(function(l, n, p, u, v) {
              switch (n) {
                case 18:
                  l = "insert";
                  break;
                case 23:
                  l = "update";
                  break;
                case 9:
                  l = "delete";
                  break;
                default:
                  throw "unknown operationCode in updateHook callback: " + n;
              }
              p = z(p);
              u = z(u);
              if (v > Number.MAX_SAFE_INTEGER) throw "rowId too big to fit inside a Number";
              f(l, p, u, Number(v));
            }, "viiiij");
            vb(this.db, this.Za, 0);
            return this;
          };
          c.prototype.bind = c.prototype.bind;
          c.prototype.step = c.prototype.step;
          c.prototype.get = c.prototype.get;
          c.prototype.getColumnNames = c.prototype.qb;
          c.prototype.getAsObject = c.prototype.zb;
          c.prototype.getSQL = c.prototype.Sb;
          c.prototype.getNormalizedSQL = c.prototype.Pb;
          c.prototype.run = c.prototype.run;
          c.prototype.reset = c.prototype.reset;
          c.prototype.freemem = c.prototype.freemem;
          c.prototype.free = c.prototype.Ya;
          d.prototype.next = d.prototype.next;
          d.prototype.getRemainingSQL = d.prototype.Qb;
          e.prototype.run = e.prototype.run;
          e.prototype.exec = e.prototype.exec;
          e.prototype.each = e.prototype.Mb;
          e.prototype.prepare = e.prototype.tb;
          e.prototype.iterateStatements = e.prototype.Ub;
          e.prototype["export"] = e.prototype.Nb;
          e.prototype.close = e.prototype.close;
          e.prototype.handleError = e.prototype.handleError;
          e.prototype.getRowsModified = e.prototype.Rb;
          e.prototype.create_function = e.prototype.Kb;
          e.prototype.create_aggregate = e.prototype.Jb;
          e.prototype.updateHook = e.prototype.Zb;
          k.Database = e;
        };
        var wa = "./this.program", xa = (a, b) => {
          throw b;
        }, ya = globalThis.document?.currentScript?.src;
        "undefined" != typeof __filename ? ya = __filename : ba && (ya = self.location.href);
        var za = "", Aa, Ba;
        if (ca) {
          var fs = require_node_fs();
          za = __dirname + "/";
          Ba = (a) => {
            a = Ca(a) ? new URL(a) : a;
            return fs.readFileSync(a);
          };
          Aa = async (a) => {
            a = Ca(a) ? new URL(a) : a;
            return fs.readFileSync(a, void 0);
          };
          1 < define_process_argv_default.length && (wa = define_process_argv_default[1].replace(/\\/g, "/"));
          define_process_argv_default.slice(2);
          "undefined" != typeof module2 && (module2.exports = k);
          xa = (a, b) => {
            process.exitCode = a;
            throw b;
          };
        } else if (aa || ba) {
          try {
            za = new URL(".", ya).href;
          } catch {
          }
          ba && (Ba = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          });
          Aa = async (a) => {
            if (Ca(a)) return new Promise((c, d) => {
              var e = new XMLHttpRequest();
              e.open("GET", a, true);
              e.responseType = "arraybuffer";
              e.onload = () => {
                200 == e.status || 0 == e.status && e.response ? c(e.response) : d(e.status);
              };
              e.onerror = d;
              e.send(null);
            });
            var b = await fetch(a, { credentials: "same-origin" });
            if (b.ok) return b.arrayBuffer();
            throw Error(b.status + " : " + b.url);
          };
        }
        var Da = console.log.bind(console), B = console.error.bind(console), Ea, Fa = false, Ga, Ca = (a) => a.startsWith("file://"), m, C, Ha, E, F, Ia, Ja, G;
        function Ka() {
          var a = La.buffer;
          m = new Int8Array(a);
          Ha = new Int16Array(a);
          C = new Uint8Array(a);
          new Uint16Array(a);
          E = new Int32Array(a);
          F = new Uint32Array(a);
          Ia = new Float32Array(a);
          Ja = new Float64Array(a);
          G = new BigInt64Array(a);
          new BigUint64Array(a);
        }
        function Ma(a) {
          k.onAbort?.(a);
          a = "Aborted(" + a + ")";
          B(a);
          Fa = true;
          throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
        }
        var Na;
        async function Oa(a) {
          if (!Ea) try {
            var b = await Aa(a);
            return new Uint8Array(b);
          } catch {
          }
          if (a == Na && Ea) a = new Uint8Array(Ea);
          else if (Ba) a = Ba(a);
          else throw "both async and sync fetching of the wasm failed";
          return a;
        }
        async function Qa(a, b) {
          try {
            var c = await Oa(a);
            return await WebAssembly.instantiate(c, b);
          } catch (d) {
            B(`failed to asynchronously prepare wasm: ${d}`), Ma(d);
          }
        }
        async function Ra(a) {
          var b = Na;
          if (!Ea && !Ca(b) && !ca) try {
            var c = fetch(b, { credentials: "same-origin" });
            return await WebAssembly.instantiateStreaming(c, a);
          } catch (d) {
            B(`wasm streaming compile failed: ${d}`), B("falling back to ArrayBuffer instantiation");
          }
          return Qa(b, a);
        }
        class Sa {
          constructor(a) {
            __publicField(this, "name", "ExitStatus");
            this.message = `Program terminated with exit(${a})`;
            this.status = a;
          }
        }
        var Ta = (a) => {
          for (; 0 < a.length; ) a.shift()(k);
        }, Ua = [], Va = [], Wa = () => {
          var a = k.preRun.shift();
          Va.push(a);
        }, J = 0, Xa = null;
        function r(a, b = "i8") {
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              return m[a];
            case "i8":
              return m[a];
            case "i16":
              return Ha[a >> 1];
            case "i32":
              return E[a >> 2];
            case "i64":
              return G[a >> 3];
            case "float":
              return Ia[a >> 2];
            case "double":
              return Ja[a >> 3];
            case "*":
              return F[a >> 2];
            default:
              Ma(`invalid type for getValue: ${b}`);
          }
        }
        var Ya = true;
        function qa(a) {
          var b = "i32";
          b.endsWith("*") && (b = "*");
          switch (b) {
            case "i1":
              m[a] = 0;
              break;
            case "i8":
              m[a] = 0;
              break;
            case "i16":
              Ha[a >> 1] = 0;
              break;
            case "i32":
              E[a >> 2] = 0;
              break;
            case "i64":
              G[a >> 3] = BigInt(0);
              break;
            case "float":
              Ia[a >> 2] = 0;
              break;
            case "double":
              Ja[a >> 3] = 0;
              break;
            case "*":
              F[a >> 2] = 0;
              break;
            default:
              Ma(`invalid type for setValue: ${b}`);
          }
        }
        var Za = new TextDecoder(), $a = (a, b, c, d) => {
          c = b + c;
          if (d) return c;
          for (; a[b] && !(b >= c); ) ++b;
          return b;
        }, z = (a, b, c) => a ? Za.decode(C.subarray(a, $a(C, a, b, c))) : "", ab = (a, b) => {
          for (var c = 0, d = a.length - 1; 0 <= d; d--) {
            var e = a[d];
            "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
          }
          if (b) for (; c; c--) a.unshift("..");
          return a;
        }, ia = (a) => {
          var b = "/" === a.charAt(0), c = "/" === a.slice(-1);
          (a = ab(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
          a && c && (a += "/");
          return (b ? "/" : "") + a;
        }, bb = (a) => {
          var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
          a = b[0];
          b = b[1];
          if (!a && !b) return ".";
          b && (b = b.slice(0, -1));
          return a + b;
        }, cb = (a) => a && a.match(/([^\/]+|\/)\/*$/)[1], db = () => {
          if (ca) {
            var a = require_node_crypto();
            return (b) => a.randomFillSync(b);
          }
          return (b) => crypto.getRandomValues(b);
        }, eb = (a) => {
          (eb = db())(a);
        }, fb = (...a) => {
          for (var b = "", c = false, d = a.length - 1; -1 <= d && !c; d--) {
            c = 0 <= d ? a[d] : "/";
            if ("string" != typeof c) throw new TypeError("Arguments to path.resolve must be strings");
            if (!c) return "";
            b = c + "/" + b;
            c = "/" === c.charAt(0);
          }
          b = ab(b.split("/").filter((e) => !!e), !c).join("/");
          return (c ? "/" : "") + b || ".";
        }, gb = (a) => {
          var b = $a(a, 0);
          return Za.decode(a.buffer ? a.subarray(0, b) : new Uint8Array(a.slice(0, b)));
        }, hb = [], ib = (a) => {
          for (var b = 0, c = 0; c < a.length; ++c) {
            var d = a.charCodeAt(c);
            127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
          }
          return b;
        }, M = (a, b, c, d) => {
          if (!(0 < d)) return 0;
          var e = c;
          d = c + d - 1;
          for (var g = 0; g < a.length; ++g) {
            var h = a.codePointAt(g);
            if (127 >= h) {
              if (c >= d) break;
              b[c++] = h;
            } else if (2047 >= h) {
              if (c + 1 >= d) break;
              b[c++] = 192 | h >> 6;
              b[c++] = 128 | h & 63;
            } else if (65535 >= h) {
              if (c + 2 >= d) break;
              b[c++] = 224 | h >> 12;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
            } else {
              if (c + 3 >= d) break;
              b[c++] = 240 | h >> 18;
              b[c++] = 128 | h >> 12 & 63;
              b[c++] = 128 | h >> 6 & 63;
              b[c++] = 128 | h & 63;
              g++;
            }
          }
          b[c] = 0;
          return c - e;
        }, jb = [];
        function kb(a, b) {
          jb[a] = { input: [], output: [], eb: b };
          mb(a, nb);
        }
        var nb = { open(a) {
          var b = jb[a.node.rdev];
          if (!b) throw new N(43);
          a.tty = b;
          a.seekable = false;
        }, close(a) {
          a.tty.eb.fsync(a.tty);
        }, fsync(a) {
          a.tty.eb.fsync(a.tty);
        }, read(a, b, c, d) {
          if (!a.tty || !a.tty.eb.Bb) throw new N(60);
          for (var e = 0, g = 0; g < d; g++) {
            try {
              var h = a.tty.eb.Bb(a.tty);
            } catch (q) {
              throw new N(29);
            }
            if (void 0 === h && 0 === e) throw new N(6);
            if (null === h || void 0 === h) break;
            e++;
            b[c + g] = h;
          }
          e && (a.node.atime = Date.now());
          return e;
        }, write(a, b, c, d) {
          if (!a.tty || !a.tty.eb.ub) throw new N(60);
          try {
            for (var e = 0; e < d; e++) a.tty.eb.ub(a.tty, b[c + e]);
          } catch (g) {
            throw new N(29);
          }
          d && (a.node.mtime = a.node.ctime = Date.now());
          return e;
        } }, wb = { Bb() {
          a: {
            if (!hb.length) {
              var a = null;
              if (ca) {
                var b = Buffer.alloc(256), c = 0, d = process.stdin.fd;
                try {
                  c = fs.readSync(d, b, 0, 256);
                } catch (e) {
                  if (e.toString().includes("EOF")) c = 0;
                  else throw e;
                }
                0 < c && (a = b.slice(0, c).toString("utf-8"));
              } else globalThis.window?.prompt && (a = window.prompt("Input: "), null !== a && (a += "\n"));
              if (!a) {
                a = null;
                break a;
              }
              b = Array(ib(a) + 1);
              a = M(a, b, 0, b.length);
              b.length = a;
              hb = b;
            }
            a = hb.shift();
          }
          return a;
        }, ub(a, b) {
          null === b || 10 === b ? (Da(gb(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, fsync(a) {
          0 < a.output?.length && (Da(gb(a.output)), a.output = []);
        }, hc() {
          return { bc: 25856, dc: 5, ac: 191, cc: 35387, $b: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }, ic() {
          return 0;
        }, jc() {
          return [24, 80];
        } }, xb = { ub(a, b) {
          null === b || 10 === b ? (B(gb(a.output)), a.output = []) : 0 != b && a.output.push(b);
        }, fsync(a) {
          0 < a.output?.length && (B(gb(a.output)), a.output = []);
        } }, O = { Wa: null, Xa() {
          return O.createNode(null, "/", 16895, 0);
        }, createNode(a, b, c, d) {
          if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new N(63);
          O.Wa || (O.Wa = { dir: { node: { Ta: O.La.Ta, Ua: O.La.Ua, lookup: O.La.lookup, ib: O.La.ib, rename: O.La.rename, unlink: O.La.unlink, rmdir: O.La.rmdir, readdir: O.La.readdir, symlink: O.La.symlink }, stream: { Va: O.Ma.Va } }, file: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: { Va: O.Ma.Va, read: O.Ma.read, write: O.Ma.write, jb: O.Ma.jb, kb: O.Ma.kb } }, link: { node: { Ta: O.La.Ta, Ua: O.La.Ua, readlink: O.La.readlink }, stream: {} }, yb: { node: { Ta: O.La.Ta, Ua: O.La.Ua }, stream: yb } });
          c = zb(a, b, c, d);
          P(c.mode) ? (c.La = O.Wa.dir.node, c.Ma = O.Wa.dir.stream, c.Na = {}) : 32768 === (c.mode & 61440) ? (c.La = O.Wa.file.node, c.Ma = O.Wa.file.stream, c.Ra = 0, c.Na = null) : 40960 === (c.mode & 61440) ? (c.La = O.Wa.link.node, c.Ma = O.Wa.link.stream) : 8192 === (c.mode & 61440) && (c.La = O.Wa.yb.node, c.Ma = O.Wa.yb.stream);
          c.atime = c.mtime = c.ctime = Date.now();
          a && (a.Na[b] = c, a.atime = a.mtime = a.ctime = c.atime);
          return c;
        }, fc(a) {
          return a.Na ? a.Na.subarray ? a.Na.subarray(0, a.Ra) : new Uint8Array(a.Na) : new Uint8Array(0);
        }, La: {
          Ta(a) {
            var b = {};
            b.dev = 8192 === (a.mode & 61440) ? a.id : 1;
            b.ino = a.id;
            b.mode = a.mode;
            b.nlink = 1;
            b.uid = 0;
            b.gid = 0;
            b.rdev = a.rdev;
            P(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ra : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
            b.atime = new Date(a.atime);
            b.mtime = new Date(a.mtime);
            b.ctime = new Date(a.ctime);
            b.blksize = 4096;
            b.blocks = Math.ceil(b.size / b.blksize);
            return b;
          },
          Ua(a, b) {
            for (var c of ["mode", "atime", "mtime", "ctime"]) null != b[c] && (a[c] = b[c]);
            void 0 !== b.size && (b = b.size, a.Ra != b && (0 == b ? (a.Na = null, a.Ra = 0) : (c = a.Na, a.Na = new Uint8Array(b), c && a.Na.set(c.subarray(0, Math.min(b, a.Ra))), a.Ra = b)));
          },
          lookup() {
            O.nb || (O.nb = new N(44), O.nb.stack = "<generic error, no stack>");
            throw O.nb;
          },
          ib(a, b, c, d) {
            return O.createNode(a, b, c, d);
          },
          rename(a, b, c) {
            try {
              var d = Q(b, c);
            } catch (g) {
            }
            if (d) {
              if (P(a.mode)) for (var e in d.Na) throw new N(55);
              Ab(d);
            }
            delete a.parent.Na[a.name];
            b.Na[c] = a;
            a.name = c;
            b.ctime = b.mtime = a.parent.ctime = a.parent.mtime = Date.now();
          },
          unlink(a, b) {
            delete a.Na[b];
            a.ctime = a.mtime = Date.now();
          },
          rmdir(a, b) {
            var c = Q(a, b), d;
            for (d in c.Na) throw new N(55);
            delete a.Na[b];
            a.ctime = a.mtime = Date.now();
          },
          readdir(a) {
            return [".", "..", ...Object.keys(a.Na)];
          },
          symlink(a, b, c) {
            a = O.createNode(a, b, 41471, 0);
            a.link = c;
            return a;
          },
          readlink(a) {
            if (40960 !== (a.mode & 61440)) throw new N(28);
            return a.link;
          }
        }, Ma: { read(a, b, c, d, e) {
          var g = a.node.Na;
          if (e >= a.node.Ra) return 0;
          a = Math.min(a.node.Ra - e, d);
          if (8 < a && g.subarray) b.set(g.subarray(e, e + a), c);
          else for (d = 0; d < a; d++) b[c + d] = g[e + d];
          return a;
        }, write(a, b, c, d, e, g) {
          b.buffer === m.buffer && (g = false);
          if (!d) return 0;
          a = a.node;
          a.mtime = a.ctime = Date.now();
          if (b.subarray && (!a.Na || a.Na.subarray)) {
            if (g) return a.Na = b.subarray(c, c + d), a.Ra = d;
            if (0 === a.Ra && 0 === e) return a.Na = b.slice(c, c + d), a.Ra = d;
            if (e + d <= a.Ra) return a.Na.set(b.subarray(c, c + d), e), d;
          }
          g = e + d;
          var h = a.Na ? a.Na.length : 0;
          h >= g || (g = Math.max(g, h * (1048576 > h ? 2 : 1.125) >>> 0), 0 != h && (g = Math.max(g, 256)), h = a.Na, a.Na = new Uint8Array(g), 0 < a.Ra && a.Na.set(h.subarray(0, a.Ra), 0));
          if (a.Na.subarray && b.subarray) a.Na.set(b.subarray(c, c + d), e);
          else for (g = 0; g < d; g++) a.Na[e + g] = b[c + g];
          a.Ra = Math.max(a.Ra, e + d);
          return d;
        }, Va(a, b, c) {
          1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ra);
          if (0 > b) throw new N(28);
          return b;
        }, jb(a, b, c, d, e) {
          if (32768 !== (a.node.mode & 61440)) throw new N(43);
          a = a.node.Na;
          if (e & 2 || !a || a.buffer !== m.buffer) {
            e = true;
            d = 65536 * Math.ceil(b / 65536);
            var g = Bb(65536, d);
            g && C.fill(0, g, g + d);
            d = g;
            if (!d) throw new N(48);
            if (a) {
              if (0 < c || c + b < a.length) a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
              m.set(a, d);
            }
          } else e = false, d = a.byteOffset;
          return { Xb: d, Eb: e };
        }, kb(a, b, c, d) {
          O.Ma.write(a, b, 0, d, c, false);
          return 0;
        } } }, ja = (a, b) => {
          var c = 0;
          a && (c |= 365);
          b && (c |= 146);
          return c;
        }, Cb = null, Db = {}, Eb = [], Fb = 1, R = null, Gb = false, Hb = true, N = class {
          constructor(a) {
            __publicField(this, "name", "ErrnoError");
            this.Pa = a;
          }
        }, Ib = class {
          constructor() {
            __publicField(this, "hb", {});
            __publicField(this, "node", null);
          }
          get flags() {
            return this.hb.flags;
          }
          set flags(a) {
            this.hb.flags = a;
          }
          get position() {
            return this.hb.position;
          }
          set position(a) {
            this.hb.position = a;
          }
        }, Jb = class {
          constructor(a, b, c, d) {
            __publicField(this, "La", {});
            __publicField(this, "Ma", {});
            __publicField(this, "bb", null);
            a || (a = this);
            this.parent = a;
            this.Xa = a.Xa;
            this.id = Fb++;
            this.name = b;
            this.mode = c;
            this.rdev = d;
            this.atime = this.mtime = this.ctime = Date.now();
          }
          get read() {
            return 365 === (this.mode & 365);
          }
          set read(a) {
            a ? this.mode |= 365 : this.mode &= -366;
          }
          get write() {
            return 146 === (this.mode & 146);
          }
          set write(a) {
            a ? this.mode |= 146 : this.mode &= -147;
          }
        };
        function S(a, b = {}) {
          if (!a) throw new N(44);
          b.pb ?? (b.pb = true);
          "/" === a.charAt(0) || (a = "//" + a);
          var c = 0;
          a: for (; 40 > c; c++) {
            a = a.split("/").filter((q) => !!q);
            for (var d = Cb, e = "/", g = 0; g < a.length; g++) {
              var h = g === a.length - 1;
              if (h && b.parent) break;
              if ("." !== a[g]) if (".." === a[g]) if (e = bb(e), d === d.parent) {
                a = e + "/" + a.slice(g + 1).join("/");
                c--;
                continue a;
              } else d = d.parent;
              else {
                e = ia(e + "/" + a[g]);
                try {
                  d = Q(d, a[g]);
                } catch (q) {
                  if (44 === q?.Pa && h && b.Wb) return { path: e };
                  throw q;
                }
                !d.bb || h && !b.pb || (d = d.bb.root);
                if (40960 === (d.mode & 61440) && (!h || b.ab)) {
                  if (!d.La.readlink) throw new N(52);
                  d = d.La.readlink(d);
                  "/" === d.charAt(0) || (d = bb(e) + "/" + d);
                  a = d + "/" + a.slice(g + 1).join("/");
                  continue a;
                }
              }
            }
            return { path: e, node: d };
          }
          throw new N(32);
        }
        function ha(a) {
          for (var b; ; ) {
            if (a === a.parent) return a = a.Xa.Db, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
            b = b ? `${a.name}/${b}` : a.name;
            a = a.parent;
          }
        }
        function Kb(a, b) {
          for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
          return (a + c >>> 0) % R.length;
        }
        function Ab(a) {
          var b = Kb(a.parent.id, a.name);
          if (R[b] === a) R[b] = a.cb;
          else for (b = R[b]; b; ) {
            if (b.cb === a) {
              b.cb = a.cb;
              break;
            }
            b = b.cb;
          }
        }
        function Q(a, b) {
          var c = P(a.mode) ? (c = Lb(a, "x")) ? c : a.La.lookup ? 0 : 2 : 54;
          if (c) throw new N(c);
          for (c = R[Kb(a.id, b)]; c; c = c.cb) {
            var d = c.name;
            if (c.parent.id === a.id && d === b) return c;
          }
          return a.La.lookup(a, b);
        }
        function zb(a, b, c, d) {
          a = new Jb(a, b, c, d);
          b = Kb(a.parent.id, a.name);
          a.cb = R[b];
          return R[b] = a;
        }
        function P(a) {
          return 16384 === (a & 61440);
        }
        function Lb(a, b) {
          return Hb ? 0 : b.includes("r") && !(a.mode & 292) || b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73) ? 2 : 0;
        }
        function Mb(a, b) {
          if (!P(a.mode)) return 54;
          try {
            return Q(a, b), 20;
          } catch (c) {
          }
          return Lb(a, "wx");
        }
        function Nb(a, b, c) {
          try {
            var d = Q(a, b);
          } catch (e) {
            return e.Pa;
          }
          if (a = Lb(a, "wx")) return a;
          if (c) {
            if (!P(d.mode)) return 54;
            if (d === d.parent || "/" === ha(d)) return 10;
          } else if (P(d.mode)) return 31;
          return 0;
        }
        function Ob(a) {
          if (!a) throw new N(63);
          return a;
        }
        function T(a) {
          a = Eb[a];
          if (!a) throw new N(8);
          return a;
        }
        function Pb(a, b = -1) {
          a = Object.assign(new Ib(), a);
          if (-1 == b) a: {
            for (b = 0; 4096 >= b; b++) if (!Eb[b]) break a;
            throw new N(33);
          }
          a.fd = b;
          return Eb[b] = a;
        }
        function Qb(a, b = -1) {
          a = Pb(a, b);
          a.Ma?.ec?.(a);
          return a;
        }
        function Rb(a, b, c) {
          var d = a?.Ma.Ua;
          a = d ? a : b;
          d ?? (d = b.La.Ua);
          Ob(d);
          d(a, c);
        }
        var yb = { open(a) {
          a.Ma = Db[a.node.rdev].Ma;
          a.Ma.open?.(a);
        }, Va() {
          throw new N(70);
        } };
        function mb(a, b) {
          Db[a] = { Ma: b };
        }
        function Sb(a, b) {
          var c = "/" === b;
          if (c && Cb) throw new N(10);
          if (!c && b) {
            var d = S(b, { pb: false });
            b = d.path;
            d = d.node;
            if (d.bb) throw new N(10);
            if (!P(d.mode)) throw new N(54);
          }
          b = { type: a, kc: {}, Db: b, Vb: [] };
          a = a.Xa(b);
          a.Xa = b;
          b.root = a;
          c ? Cb = a : d && (d.bb = b, d.Xa && d.Xa.Vb.push(b));
        }
        function Tb(a, b, c) {
          var d = S(a, { parent: true }).node;
          a = cb(a);
          if (!a) throw new N(28);
          if ("." === a || ".." === a) throw new N(20);
          var e = Mb(d, a);
          if (e) throw new N(e);
          if (!d.La.ib) throw new N(63);
          return d.La.ib(d, a, b, c);
        }
        function ka(a, b = 438) {
          return Tb(a, b & 4095 | 32768, 0);
        }
        function U(a, b = 511) {
          return Tb(a, b & 1023 | 16384, 0);
        }
        function Ub(a, b, c) {
          "undefined" == typeof c && (c = b, b = 438);
          Tb(a, b | 8192, c);
        }
        function Vb(a, b) {
          if (!fb(a)) throw new N(44);
          var c = S(b, { parent: true }).node;
          if (!c) throw new N(44);
          b = cb(b);
          var d = Mb(c, b);
          if (d) throw new N(d);
          if (!c.La.symlink) throw new N(63);
          c.La.symlink(c, b, a);
        }
        function Wb(a) {
          var b = S(a, { parent: true }).node;
          a = cb(a);
          var c = Q(b, a), d = Nb(b, a, true);
          if (d) throw new N(d);
          if (!b.La.rmdir) throw new N(63);
          if (c.bb) throw new N(10);
          b.La.rmdir(b, a);
          Ab(c);
        }
        function ua(a) {
          var b = S(a, { parent: true }).node;
          if (!b) throw new N(44);
          a = cb(a);
          var c = Q(b, a), d = Nb(b, a, false);
          if (d) throw new N(d);
          if (!b.La.unlink) throw new N(63);
          if (c.bb) throw new N(10);
          b.La.unlink(b, a);
          Ab(c);
        }
        function Xb(a, b) {
          a = S(a, { ab: !b }).node;
          return Ob(a.La.Ta)(a);
        }
        function Yb(a, b, c, d) {
          Rb(a, b, { mode: c & 4095 | b.mode & -4096, ctime: Date.now(), Lb: d });
        }
        function la(a, b) {
          a = "string" == typeof a ? S(a, { ab: true }).node : a;
          Yb(null, a, b);
        }
        function Zb(a, b, c) {
          if (P(b.mode)) throw new N(31);
          if (32768 !== (b.mode & 61440)) throw new N(28);
          var d = Lb(b, "w");
          if (d) throw new N(d);
          Rb(a, b, { size: c, timestamp: Date.now() });
        }
        function ma(a, b, c = 438) {
          if ("" === a) throw new N(44);
          if ("string" == typeof b) {
            var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
            if ("undefined" == typeof d) throw Error(`Unknown file open mode: ${b}`);
            b = d;
          }
          c = b & 64 ? c & 4095 | 32768 : 0;
          if ("object" == typeof a) d = a;
          else {
            var e = a.endsWith("/");
            var g = S(a, { ab: !(b & 131072), Wb: true });
            d = g.node;
            a = g.path;
          }
          g = false;
          if (b & 64) if (d) {
            if (b & 128) throw new N(20);
          } else {
            if (e) throw new N(31);
            d = Tb(a, c | 511, 0);
            g = true;
          }
          if (!d) throw new N(44);
          8192 === (d.mode & 61440) && (b &= -513);
          if (b & 65536 && !P(d.mode)) throw new N(54);
          if (!g && (d ? 40960 === (d.mode & 61440) ? e = 32 : (e = ["r", "w", "rw"][b & 3], b & 512 && (e += "w"), e = P(d.mode) && ("r" !== e || b & 576) ? 31 : Lb(d, e)) : e = 44, e)) throw new N(e);
          b & 512 && !g && (e = d, e = "string" == typeof e ? S(e, { ab: true }).node : e, Zb(null, e, 0));
          b = Pb({ node: d, path: ha(d), flags: b & -131713, seekable: true, position: 0, Ma: d.Ma, Yb: [], error: false });
          b.Ma.open && b.Ma.open(b);
          g && la(d, c & 511);
          return b;
        }
        function oa(a) {
          if (null === a.fd) throw new N(8);
          a.rb && (a.rb = null);
          try {
            a.Ma.close && a.Ma.close(a);
          } catch (b) {
            throw b;
          } finally {
            Eb[a.fd] = null;
          }
          a.fd = null;
        }
        function $b(a, b, c) {
          if (null === a.fd) throw new N(8);
          if (!a.seekable || !a.Ma.Va) throw new N(70);
          if (0 != c && 1 != c && 2 != c) throw new N(28);
          a.position = a.Ma.Va(a, b, c);
          a.Yb = [];
        }
        function ac(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new N(28);
          if (null === a.fd) throw new N(8);
          if (1 === (a.flags & 2097155)) throw new N(8);
          if (P(a.node.mode)) throw new N(31);
          if (!a.Ma.read) throw new N(28);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new N(70);
          b = a.Ma.read(a, b, c, d, e);
          g || (a.position += b);
          return b;
        }
        function na(a, b, c, d, e) {
          if (0 > d || 0 > e) throw new N(28);
          if (null === a.fd) throw new N(8);
          if (0 === (a.flags & 2097155)) throw new N(8);
          if (P(a.node.mode)) throw new N(31);
          if (!a.Ma.write) throw new N(28);
          a.seekable && a.flags & 1024 && $b(a, 0, 2);
          var g = "undefined" != typeof e;
          if (!g) e = a.position;
          else if (!a.seekable) throw new N(70);
          b = a.Ma.write(a, b, c, d, e, void 0);
          g || (a.position += b);
          return b;
        }
        function ta(a) {
          var b = b || 0;
          var c = "binary";
          "utf8" !== c && "binary" !== c && Ma(`Invalid encoding type "${c}"`);
          b = ma(a, b);
          a = Xb(a).size;
          var d = new Uint8Array(a);
          ac(b, d, 0, a, 0);
          "utf8" === c && (d = gb(d));
          oa(b);
          return d;
        }
        function W(a, b, c) {
          a = ia("/dev/" + a);
          var d = ja(!!b, !!c);
          W.Cb ?? (W.Cb = 64);
          var e = W.Cb++ << 8 | 0;
          mb(e, { open(g) {
            g.seekable = false;
          }, close() {
            c?.buffer?.length && c(10);
          }, read(g, h, q, w) {
            for (var t = 0, x = 0; x < w; x++) {
              try {
                var D = b();
              } catch (pb) {
                throw new N(29);
              }
              if (void 0 === D && 0 === t) throw new N(6);
              if (null === D || void 0 === D) break;
              t++;
              h[q + x] = D;
            }
            t && (g.node.atime = Date.now());
            return t;
          }, write(g, h, q, w) {
            for (var t = 0; t < w; t++) try {
              c(h[q + t]);
            } catch (x) {
              throw new N(29);
            }
            w && (g.node.mtime = g.node.ctime = Date.now());
            return t;
          } });
          Ub(a, d, e);
        }
        var X = {};
        function Y(a, b, c) {
          if ("/" === b.charAt(0)) return b;
          a = -100 === a ? "/" : T(a).path;
          if (0 == b.length) {
            if (!c) throw new N(44);
            return a;
          }
          return a + "/" + b;
        }
        function kc(a, b) {
          F[a >> 2] = b.dev;
          F[a + 4 >> 2] = b.mode;
          F[a + 8 >> 2] = b.nlink;
          F[a + 12 >> 2] = b.uid;
          F[a + 16 >> 2] = b.gid;
          F[a + 20 >> 2] = b.rdev;
          G[a + 24 >> 3] = BigInt(b.size);
          E[a + 32 >> 2] = 4096;
          E[a + 36 >> 2] = b.blocks;
          var c = b.atime.getTime(), d = b.mtime.getTime(), e = b.ctime.getTime();
          G[a + 40 >> 3] = BigInt(Math.floor(c / 1e3));
          F[a + 48 >> 2] = c % 1e3 * 1e6;
          G[a + 56 >> 3] = BigInt(Math.floor(d / 1e3));
          F[a + 64 >> 2] = d % 1e3 * 1e6;
          G[a + 72 >> 3] = BigInt(Math.floor(e / 1e3));
          F[a + 80 >> 2] = e % 1e3 * 1e6;
          G[a + 88 >> 3] = BigInt(b.ino);
          return 0;
        }
        var Cc = void 0, Ec = () => {
          var a = E[+Cc >> 2];
          Cc += 4;
          return a;
        }, Fc = 0, Gc = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Hc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Ic = {}, Jc = (a) => {
          Ga = a;
          Ya || 0 < Fc || (k.onExit?.(a), Fa = true);
          xa(a, new Sa(a));
        }, Kc = (a) => {
          if (!Fa) try {
            a();
          } catch (b) {
            b instanceof Sa || "unwind" == b || xa(1, b);
          } finally {
            if (!(Ya || 0 < Fc)) try {
              Ga = a = Ga, Jc(a);
            } catch (b) {
              b instanceof Sa || "unwind" == b || xa(1, b);
            }
          }
        }, Lc = {}, Nc = () => {
          if (!Mc) {
            var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: wa || "./this.program" }, b;
            for (b in Lc) void 0 === Lc[b] ? delete a[b] : a[b] = Lc[b];
            var c = [];
            for (b in a) c.push(`${b}=${a[b]}`);
            Mc = c;
          }
          return Mc;
        }, Mc, Oc = (a, b, c, d) => {
          var e = { string: (t) => {
            var x = 0;
            if (null !== t && void 0 !== t && 0 !== t) {
              x = ib(t) + 1;
              var D = y(x);
              M(t, C, D, x);
              x = D;
            }
            return x;
          }, array: (t) => {
            var x = y(t.length);
            m.set(t, x);
            return x;
          } };
          a = k["_" + a];
          var g = [], h = 0;
          if (d) for (var q = 0; q < d.length; q++) {
            var w = e[c[q]];
            w ? (0 === h && (h = pa()), g[q] = w(d[q])) : g[q] = d[q];
          }
          c = a(...g);
          return c = (function(t) {
            0 !== h && ra(h);
            return "string" === b ? z(t) : "boolean" === b ? !!t : t;
          })(c);
        }, fa = (a) => {
          var b = ib(a) + 1, c = da(b);
          c && M(a, C, c, b);
          return c;
        }, Pc, Qc = [], A = (a) => {
          Pc.delete(Z.get(a));
          Z.set(a, null);
          Qc.push(a);
        }, Rc = (a) => {
          const b = a.length;
          return [b % 128 | 128, b >> 7, ...a];
        }, Sc = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, Tc = (a) => Rc(Array.from(a, (b) => Sc[b])), va = (a, b) => {
          if (!Pc) {
            Pc = /* @__PURE__ */ new WeakMap();
            var c = Z.length;
            if (Pc) for (var d = 0; d < 0 + c; d++) {
              var e = Z.get(d);
              e && Pc.set(e, d);
            }
          }
          if (c = Pc.get(a) || 0) return c;
          c = Qc.length ? Qc.pop() : Z.grow(1);
          try {
            Z.set(c, a);
          } catch (g) {
            if (!(g instanceof TypeError)) throw g;
            b = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Rc([1, 96, ...Tc(b.slice(1)), ...Tc("v" === b[0] ? "" : b[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
            b = new WebAssembly.Module(b);
            b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
            Z.set(c, b);
          }
          Pc.set(a, c);
          return c;
        };
        R = Array(4096);
        Sb(O, "/");
        U("/tmp");
        U("/home");
        U("/home/web_user");
        (function() {
          U("/dev");
          mb(259, { read: () => 0, write: (d, e, g, h) => h, Va: () => 0 });
          Ub("/dev/null", 259);
          kb(1280, wb);
          kb(1536, xb);
          Ub("/dev/tty", 1280);
          Ub("/dev/tty1", 1536);
          var a = new Uint8Array(1024), b = 0, c = () => {
            0 === b && (eb(a), b = a.byteLength);
            return a[--b];
          };
          W("random", c);
          W("urandom", c);
          U("/dev/shm");
          U("/dev/shm/tmp");
        })();
        (function() {
          U("/proc");
          var a = U("/proc/self");
          U("/proc/self/fd");
          Sb({ Xa() {
            var b = zb(a, "fd", 16895, 73);
            b.Ma = { Va: O.Ma.Va };
            b.La = { lookup(c, d) {
              c = +d;
              var e = T(c);
              c = { parent: null, Xa: { Db: "fake" }, La: { readlink: () => e.path }, id: c + 1 };
              return c.parent = c;
            }, readdir() {
              return Array.from(Eb.entries()).filter(([, c]) => c).map(([c]) => c.toString());
            } };
            return b;
          } }, "/proc/self/fd");
        })();
        k.noExitRuntime && (Ya = k.noExitRuntime);
        k.print && (Da = k.print);
        k.printErr && (B = k.printErr);
        k.wasmBinary && (Ea = k.wasmBinary);
        k.thisProgram && (wa = k.thisProgram);
        if (k.preInit) for ("function" == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.shift()();
        k.stackSave = () => pa();
        k.stackRestore = (a) => ra(a);
        k.stackAlloc = (a) => y(a);
        k.cwrap = (a, b, c, d) => {
          var e = !c || c.every((g) => "number" === g || "boolean" === g);
          return "string" !== b && e && !d ? k["_" + a] : (...g) => Oc(a, b, c, g);
        };
        k.addFunction = va;
        k.removeFunction = A;
        k.UTF8ToString = z;
        k.stringToNewUTF8 = fa;
        k.writeArrayToMemory = (a, b) => {
          m.set(a, b);
        };
        var da, ea, Bb, Uc, ra, y, pa, La, Z, Vc = {
          a: (a, b, c, d) => Ma(`Assertion failed: ${z(a)}, at: ` + [b ? z(b) : "unknown filename", c, d ? z(d) : "unknown function"]),
          i: function(a, b) {
            try {
              return a = z(a), la(a, b), 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          L: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c & -8) return -28;
              var d = S(b, { ab: true }).node;
              if (!d) return -44;
              a = "";
              c & 4 && (a += "r");
              c & 2 && (a += "w");
              c & 1 && (a += "x");
              return a && Lb(d, a) ? -2 : 0;
            } catch (e) {
              if ("undefined" == typeof X || "ErrnoError" !== e.name) throw e;
              return -e.Pa;
            }
          },
          j: function(a, b) {
            try {
              var c = T(a);
              Yb(c, c.node, b, false);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          h: function(a) {
            try {
              var b = T(a);
              Rb(b, b.node, { timestamp: Date.now(), Lb: false });
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          b: function(a, b, c) {
            Cc = c;
            try {
              var d = T(a);
              switch (b) {
                case 0:
                  var e = Ec();
                  if (0 > e) break;
                  for (; Eb[e]; ) e++;
                  return Qb(d, e).fd;
                case 1:
                case 2:
                  return 0;
                case 3:
                  return d.flags;
                case 4:
                  return e = Ec(), d.flags |= e, 0;
                case 12:
                  return e = Ec(), Ha[e + 0 >> 1] = 2, 0;
                case 13:
                case 14:
                  return 0;
              }
              return -28;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          g: function(a, b) {
            try {
              var c = T(a), d = c.node, e = c.Ma.Ta;
              a = e ? c : d;
              e ?? (e = d.La.Ta);
              Ob(e);
              var g = e(a);
              return kc(b, g);
            } catch (h) {
              if ("undefined" == typeof X || "ErrnoError" !== h.name) throw h;
              return -h.Pa;
            }
          },
          H: function(a, b) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return -61;
              var c = T(a);
              if (0 > b || 0 === (c.flags & 2097155)) throw new N(28);
              Zb(c, c.node, b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          G: function(a, b) {
            try {
              if (0 === b) return -28;
              var c = ib("/") + 1;
              if (b < c) return -68;
              M("/", C, a, b);
              return c;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          K: function(a, b) {
            try {
              return a = z(a), kc(b, Xb(a, true));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          C: function(a, b, c) {
            try {
              return b = z(b), b = Y(a, b), U(b, c), 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          J: function(a, b, c, d) {
            try {
              b = z(b);
              var e = d & 256;
              b = Y(a, b, d & 4096);
              return kc(c, e ? Xb(b, true) : Xb(b));
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          x: function(a, b, c, d) {
            Cc = d;
            try {
              b = z(b);
              b = Y(a, b);
              var e = d ? Ec() : 0;
              return ma(b, c, e).fd;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return -g.Pa;
            }
          },
          v: function(a, b, c, d) {
            try {
              b = z(b);
              b = Y(a, b);
              if (0 >= d) return -28;
              var e = S(b).node;
              if (!e) throw new N(44);
              if (!e.La.readlink) throw new N(28);
              var g = e.La.readlink(e);
              var h = Math.min(d, ib(g)), q = m[c + h];
              M(
                g,
                C,
                c,
                d + 1
              );
              m[c + h] = q;
              return h;
            } catch (w) {
              if ("undefined" == typeof X || "ErrnoError" !== w.name) throw w;
              return -w.Pa;
            }
          },
          u: function(a) {
            try {
              return a = z(a), Wb(a), 0;
            } catch (b) {
              if ("undefined" == typeof X || "ErrnoError" !== b.name) throw b;
              return -b.Pa;
            }
          },
          f: function(a, b) {
            try {
              return a = z(a), kc(b, Xb(a));
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return -c.Pa;
            }
          },
          r: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b);
              if (c) if (512 === c) Wb(b);
              else return -28;
              else ua(b);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return -d.Pa;
            }
          },
          q: function(a, b, c) {
            try {
              b = z(b);
              b = Y(a, b, true);
              var d = Date.now(), e, g;
              if (c) {
                var h = F[c >> 2] + 4294967296 * E[c + 4 >> 2], q = E[c + 8 >> 2];
                1073741823 == q ? e = d : 1073741822 == q ? e = null : e = 1e3 * h + q / 1e6;
                c += 16;
                h = F[c >> 2] + 4294967296 * E[c + 4 >> 2];
                q = E[c + 8 >> 2];
                1073741823 == q ? g = d : 1073741822 == q ? g = null : g = 1e3 * h + q / 1e6;
              } else g = e = d;
              if (null !== (g ?? e)) {
                a = e;
                var w = S(b, { ab: true }).node;
                Ob(w.La.Ua)(w, { atime: a, mtime: g });
              }
              return 0;
            } catch (t) {
              if ("undefined" == typeof X || "ErrnoError" !== t.name) throw t;
              return -t.Pa;
            }
          },
          m: () => Ma(""),
          l: () => {
            Ya = false;
            Fc = 0;
          },
          A: function(a, b) {
            a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
            a = new Date(1e3 * a);
            E[b >> 2] = a.getSeconds();
            E[b + 4 >> 2] = a.getMinutes();
            E[b + 8 >> 2] = a.getHours();
            E[b + 12 >> 2] = a.getDate();
            E[b + 16 >> 2] = a.getMonth();
            E[b + 20 >> 2] = a.getFullYear() - 1900;
            E[b + 24 >> 2] = a.getDay();
            var c = a.getFullYear();
            E[b + 28 >> 2] = (0 !== c % 4 || 0 === c % 100 && 0 !== c % 400 ? Hc : Gc)[a.getMonth()] + a.getDate() - 1 | 0;
            E[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
            c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
            var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
            E[b + 32 >> 2] = (c != d && a.getTimezoneOffset() == Math.min(d, c)) | 0;
          },
          y: function(a, b, c, d, e, g, h) {
            e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
            try {
              var q = T(d);
              if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (q.flags & 2097155)) throw new N(2);
              if (1 === (q.flags & 2097155)) throw new N(2);
              if (!q.Ma.jb) throw new N(43);
              if (!a) throw new N(28);
              var w = q.Ma.jb(q, a, e, b, c);
              var t = w.Xb;
              E[g >> 2] = w.Eb;
              F[h >> 2] = t;
              return 0;
            } catch (x) {
              if ("undefined" == typeof X || "ErrnoError" !== x.name) throw x;
              return -x.Pa;
            }
          },
          z: function(a, b, c, d, e, g) {
            g = -9007199254740992 > g || 9007199254740992 < g ? NaN : Number(g);
            try {
              var h = T(e);
              if (c & 2) {
                c = g;
                if (32768 !== (h.node.mode & 61440)) throw new N(43);
                if (!(d & 2)) {
                  var q = C.slice(a, a + b);
                  h.Ma.kb && h.Ma.kb(h, q, c, b, d);
                }
              }
            } catch (w) {
              if ("undefined" == typeof X || "ErrnoError" !== w.name) throw w;
              return -w.Pa;
            }
          },
          n: (a, b) => {
            Ic[a] && (clearTimeout(Ic[a].id), delete Ic[a]);
            if (!b) return 0;
            var c = setTimeout(() => {
              delete Ic[a];
              Kc(() => Uc(a, performance.now()));
            }, b);
            Ic[a] = { id: c, lc: b };
            return 0;
          },
          B: (a, b, c, d) => {
            var e = (/* @__PURE__ */ new Date()).getFullYear(), g = new Date(e, 0, 1).getTimezoneOffset();
            e = new Date(e, 6, 1).getTimezoneOffset();
            F[a >> 2] = 60 * Math.max(g, e);
            E[b >> 2] = Number(g != e);
            b = (h) => {
              var q = Math.abs(h);
              return `UTC${0 <= h ? "-" : "+"}${String(Math.floor(q / 60)).padStart(2, "0")}${String(q % 60).padStart(2, "0")}`;
            };
            a = b(g);
            b = b(e);
            e < g ? (M(a, C, c, 17), M(b, C, d, 17)) : (M(a, C, d, 17), M(b, C, c, 17));
          },
          d: () => Date.now(),
          s: () => 2147483648,
          c: () => performance.now(),
          o: (a) => {
            var b = C.length;
            a >>>= 0;
            if (2147483648 < a) return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, a + 100663296);
              a: {
                d = (Math.min(2147483648, 65536 * Math.ceil(Math.max(
                  a,
                  d
                ) / 65536)) - La.buffer.byteLength + 65535) / 65536 | 0;
                try {
                  La.grow(d);
                  Ka();
                  var e = 1;
                  break a;
                } catch (g) {
                }
                e = void 0;
              }
              if (e) return true;
            }
            return false;
          },
          E: (a, b) => {
            var c = 0, d = 0, e;
            for (e of Nc()) {
              var g = b + c;
              F[a + d >> 2] = g;
              c += M(e, C, g, Infinity) + 1;
              d += 4;
            }
            return 0;
          },
          F: (a, b) => {
            var c = Nc();
            F[a >> 2] = c.length;
            a = 0;
            for (var d of c) a += ib(d) + 1;
            F[b >> 2] = a;
            return 0;
          },
          e: function(a) {
            try {
              var b = T(a);
              oa(b);
              return 0;
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          p: function(a, b) {
            try {
              var c = T(a);
              m[b] = c.tty ? 2 : P(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
              Ha[b + 2 >> 1] = 0;
              G[b + 8 >> 3] = BigInt(0);
              G[b + 16 >> 3] = BigInt(0);
              return 0;
            } catch (d) {
              if ("undefined" == typeof X || "ErrnoError" !== d.name) throw d;
              return d.Pa;
            }
          },
          w: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], w = F[a + 4 >> 2];
                  a += 8;
                  var t = ac(e, m, q, w, g);
                  if (0 > t) {
                    var x = -1;
                    break a;
                  }
                  b += t;
                  if (t < w) break;
                  "undefined" != typeof g && (g += t);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          D: function(a, b, c, d) {
            b = -9007199254740992 > b || 9007199254740992 < b ? NaN : Number(b);
            try {
              if (isNaN(b)) return 61;
              var e = T(a);
              $b(e, b, c);
              G[d >> 3] = BigInt(e.position);
              e.rb && 0 === b && 0 === c && (e.rb = null);
              return 0;
            } catch (g) {
              if ("undefined" == typeof X || "ErrnoError" !== g.name) throw g;
              return g.Pa;
            }
          },
          I: function(a) {
            try {
              var b = T(a);
              return b.Ma?.fsync?.(b);
            } catch (c) {
              if ("undefined" == typeof X || "ErrnoError" !== c.name) throw c;
              return c.Pa;
            }
          },
          t: function(a, b, c, d) {
            try {
              a: {
                var e = T(a);
                a = b;
                for (var g, h = b = 0; h < c; h++) {
                  var q = F[a >> 2], w = F[a + 4 >> 2];
                  a += 8;
                  var t = na(e, m, q, w, g);
                  if (0 > t) {
                    var x = -1;
                    break a;
                  }
                  b += t;
                  if (t < w) break;
                  "undefined" != typeof g && (g += t);
                }
                x = b;
              }
              F[d >> 2] = x;
              return 0;
            } catch (D) {
              if ("undefined" == typeof X || "ErrnoError" !== D.name) throw D;
              return D.Pa;
            }
          },
          k: Jc
        };
        function Wc() {
          function a() {
            k.calledRun = true;
            if (!Fa) {
              if (!k.noFSInit && !Gb) {
                var b, c;
                Gb = true;
                b ?? (b = k.stdin);
                c ?? (c = k.stdout);
                d ?? (d = k.stderr);
                b ? W("stdin", b) : Vb("/dev/tty", "/dev/stdin");
                c ? W("stdout", null, c) : Vb("/dev/tty", "/dev/stdout");
                d ? W("stderr", null, d) : Vb("/dev/tty1", "/dev/stderr");
                ma("/dev/stdin", 0);
                ma("/dev/stdout", 1);
                ma("/dev/stderr", 1);
              }
              Xc.N();
              Hb = false;
              k.onRuntimeInitialized?.();
              if (k.postRun) for ("function" == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
                var d = k.postRun.shift();
                Ua.push(d);
              }
              Ta(Ua);
            }
          }
          if (0 < J) Xa = Wc;
          else {
            if (k.preRun) for ("function" == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) Wa();
            Ta(Va);
            0 < J ? Xa = Wc : k.setStatus ? (k.setStatus("Running..."), setTimeout(() => {
              setTimeout(() => k.setStatus(""), 1);
              a();
            }, 1)) : a();
          }
        }
        var Xc;
        (async function() {
          function a(c) {
            c = Xc = c.exports;
            k._sqlite3_free = c.P;
            k._sqlite3_value_text = c.Q;
            k._sqlite3_prepare_v2 = c.R;
            k._sqlite3_step = c.S;
            k._sqlite3_reset = c.T;
            k._sqlite3_exec = c.U;
            k._sqlite3_finalize = c.V;
            k._sqlite3_column_name = c.W;
            k._sqlite3_column_text = c.X;
            k._sqlite3_column_type = c.Y;
            k._sqlite3_errmsg = c.Z;
            k._sqlite3_clear_bindings = c._;
            k._sqlite3_value_blob = c.$;
            k._sqlite3_value_bytes = c.aa;
            k._sqlite3_value_double = c.ba;
            k._sqlite3_value_int = c.ca;
            k._sqlite3_value_type = c.da;
            k._sqlite3_result_blob = c.ea;
            k._sqlite3_result_double = c.fa;
            k._sqlite3_result_error = c.ga;
            k._sqlite3_result_int = c.ha;
            k._sqlite3_result_int64 = c.ia;
            k._sqlite3_result_null = c.ja;
            k._sqlite3_result_text = c.ka;
            k._sqlite3_aggregate_context = c.la;
            k._sqlite3_column_count = c.ma;
            k._sqlite3_data_count = c.na;
            k._sqlite3_column_blob = c.oa;
            k._sqlite3_column_bytes = c.pa;
            k._sqlite3_column_double = c.qa;
            k._sqlite3_bind_blob = c.ra;
            k._sqlite3_bind_double = c.sa;
            k._sqlite3_bind_int = c.ta;
            k._sqlite3_bind_text = c.ua;
            k._sqlite3_bind_parameter_index = c.va;
            k._sqlite3_sql = c.wa;
            k._sqlite3_normalized_sql = c.xa;
            k._sqlite3_changes = c.ya;
            k._sqlite3_close_v2 = c.za;
            k._sqlite3_create_function_v2 = c.Aa;
            k._sqlite3_update_hook = c.Ba;
            k._sqlite3_open = c.Ca;
            da = k._malloc = c.Da;
            ea = k._free = c.Ea;
            k._RegisterExtensionFunctions = c.Fa;
            Bb = c.Ga;
            Uc = c.Ha;
            ra = c.Ia;
            y = c.Ja;
            pa = c.Ka;
            La = c.M;
            Z = c.O;
            Ka();
            J--;
            k.monitorRunDependencies?.(J);
            0 == J && Xa && (c = Xa, Xa = null, c());
            return Xc;
          }
          J++;
          k.monitorRunDependencies?.(J);
          var b = { a: Vc };
          if (k.instantiateWasm) return new Promise((c) => {
            k.instantiateWasm(b, (d, e) => {
              c(a(d, e));
            });
          });
          Na ?? (Na = k.locateFile ? k.locateFile("sql-wasm.wasm", za) : za + "sql-wasm.wasm");
          return a((await Ra(b)).instance);
        })();
        Wc();
        return Module;
      });
      return initSqlJsPromise;
    };
    if (typeof exports === "object" && typeof module2 === "object") {
      module2.exports = initSqlJs2;
      module2.exports.default = initSqlJs2;
    } else if (typeof define === "function" && define["amd"]) {
      define([], function() {
        return initSqlJs2;
      });
    } else if (typeof exports === "object") {
      exports["Module"] = initSqlJs2;
    }
  }
});

// src/main.js
var main_exports = {};
__export(main_exports, {
  default: () => CetideBaguPlugin
});
module.exports = __toCommonJS(main_exports);
init_define_process_argv();
var import_obsidian2 = require("obsidian");

// src/constants.js
init_define_process_argv();
var VIEW_TYPE_BAGU = "cetide-bagu-view";
var DB_PATH = ".bagu/qiuzhao-bagu.db";
var EBBINGHAUS_DEFAULT = [1, 2, 4, 7, 15, 30, 60];
var DEFAULT_SETTINGS = {
  /** 只扫描该目录下的 Markdown 作为面试题（相对库根） */
  questionsRoot: "\u516B\u80A1",
  excludePatterns: ["00-\u77E5\u8BC6\u603B\u89C8", "\u9898\u5355\u603B\u7D22\u5F15"],
  writeRequireText: true,
  cooldownSize: 12,
  dailyTotalLimit: 15,
  /** 拷问任务抽题数 */
  quizCount: 15,
  /** 拷问及格线（计入准确率） */
  quizPassScore: 70,
  preferredModules: [],
  /** 拷问范围模块，空=全部 */
  quizModules: [],
  scheduler: "sm2",
  ebbinghausSteps: EBBINGHAUS_DEFAULT.slice(),
  remindOnOpen: true,
  ollamaBaseUrl: "http://127.0.0.1:11434",
  ollamaModel: "minimax-m3:cloud",
  ollamaTimeoutMs: 12e4,
  scoreThresholdAgain: 50,
  scoreThresholdHard: 70,
  scoreThresholdGood: 90,
  allowManualGrade: true,
  /** 语音识别：siliconflow | groq | openai-compatible | off */
  asrProvider: "openai-compatible",
  asrApiKey: "",
  asrBaseUrl: "http://127.0.0.1:9000",
  asrModel: "small",
  asrLang: "zh",
  asrTimeoutMs: 18e4,
  /** append=追加到已有草稿；replace=覆盖 */
  asrInsertMode: "append"
};

// src/db.js
init_define_process_argv();
var import_sql_wasm = __toESM(require_sql_wasm());

// src/util.js
init_define_process_argv();
function hashId(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
function todayKey(d = /* @__PURE__ */ new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function startOfDayMs(d = /* @__PURE__ */ new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}
function addDaysMs(fromMs, days) {
  const d = new Date(fromMs);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + Math.round(days));
  return d.getTime();
}
function parseQuestionsFromMarkdown(path, content, excludePatterns, questionsRoot = "") {
  const root = String(questionsRoot || "").replace(/^\/+|\/+$/g, "");
  let relPath = path;
  if (root) {
    const prefix = root + "/";
    if (path !== root && !path.startsWith(prefix)) return [];
    relPath = path === root ? "" : path.slice(prefix.length);
  }
  const base = path.split("/").pop() || path;
  const nameNoExt = base.replace(/\.md$/i, "");
  for (const p of excludePatterns || []) {
    if (!p) continue;
    if (nameNoExt.includes(p) || base.includes(p) || path.includes(p)) {
      return [];
    }
  }
  const parts = (relPath || path).split("/").filter(Boolean);
  const moduleName = parts.length > 1 ? parts[0] : parts[0] ? "\u6839\u76EE\u5F55" : "\u6839\u76EE\u5F55";
  const idPath = relPath || path;
  const lines = content.split(/\r?\n/);
  const headingRe = /^###\s+Q(\d+)\s*[\.、．]?\s*(.*)$/;
  const questions = [];
  let current = null;
  const flush = () => {
    if (!current) return;
    const answer = current.answerLines.join("\n").trim();
    const question = current.question.trim();
    if (question) {
      const rawId = `${idPath}#Q${current.num}:${question}`;
      questions.push({
        id: hashId(rawId),
        num: current.num,
        question,
        answer,
        path,
        heading: `Q${current.num}. ${question}`,
        module: moduleName
      });
    }
    current = null;
  };
  for (const line of lines) {
    const m = line.match(headingRe);
    if (m) {
      flush();
      current = {
        num: m[1],
        question: (m[2] || "").trim(),
        answerLines: []
      };
      continue;
    }
    if (!current) continue;
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) {
      flush();
      continue;
    }
    current.answerLines.push(line);
  }
  flush();
  return questions;
}

// src/db.js
function rowsFrom(stmt) {
  const cols = stmt.getColumnNames();
  const out = [];
  while (stmt.step()) {
    const values = stmt.get();
    const row = {};
    cols.forEach((c, i) => row[c] = values[i]);
    out.push(row);
  }
  stmt.free();
  return out;
}
var BaguDb = class {
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
    this.SQL = await (0, import_sql_wasm.default)({ locateFile });
    const adapter = this.app.vault.adapter;
    const exists = await adapter.exists(this.path);
    if (exists) {
      const bin = await adapter.readBinary(this.path);
      this.db = new this.SQL.Database(new Uint8Array(bin));
    } else {
      if (!await adapter.exists(".bagu")) {
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
      const cols = /* @__PURE__ */ new Set();
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
        if (!await adapter.exists(".bagu")) {
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
          now
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
      module: module2 = "",
      keyword = "",
      state = "",
      favoriteOnly = false,
      limit = 500,
      offset = 0
    } = opts;
    let sql = `
      SELECT q.id, q.module, q.path, q.num, q.question, q.heading,
             c.state, c.interval_days, c.reps, c.last_score, c.favorite, c.due_at
      FROM questions q
      JOIN cards c ON q.id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (module2) {
      sql += ` AND q.module = ?`;
      params.push(module2);
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
      module: module2 = "",
      keyword = "",
      state = "",
      favoriteOnly = false
    } = opts;
    let sql = `
      SELECT COUNT(*) AS c
      FROM questions q
      JOIN cards c ON q.id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (module2) {
      sql += ` AND q.module = ?`;
      params.push(module2);
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
        id
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
    user_answer
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
        user_answer || null
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
    const since = Date.now() - daysBack * 864e5;
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
      const stmt2 = this.db.prepare(`SELECT id FROM questions`);
      return rowsFrom(stmt2).map((r) => r.id);
    }
    const mods = [...moduleSet];
    const stmt = this.db.prepare(
      `SELECT id FROM questions WHERE module IN (${mods.map(() => "?").join(",")})`
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
      created_at: row.created_at
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
        JSON.stringify(plan.quiz_modules || [])
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
    const start = /* @__PURE__ */ new Date();
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
      modules
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
    let cursor = /* @__PURE__ */ new Date();
    cursor.setHours(0, 0, 0, 0);
    for (; ; ) {
      const key = todayKey(cursor);
      if (days.includes(key)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
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
    return rowsFrom(this.db.prepare(`SELECT COUNT(*) AS c FROM questions`))[0].c;
  }
};
function ensureDailyPlan(db, settings, moduleSet, quizModuleSet) {
  const dateKey = todayKey();
  const existing = db.getPlan(dateKey);
  if (existing) return existing;
  const now = Date.now();
  const quizN = settings.quizCount || settings.dailyTotalLimit || 15;
  const mods = moduleSet && moduleSet.size ? [...moduleSet].sort() : db.getModules().map((m) => m.module);
  const last = db.getMeta("last_focus_module");
  let focus = mods[0] || "";
  if (mods.length) {
    const idx = Math.max(0, mods.indexOf(last));
    focus = mods[(idx + 1) % mods.length];
  }
  db.setMeta("last_focus_module", focus);
  const specialty_ids = focus ? db.listIdsByModule(focus) : [];
  const qMods = quizModuleSet && quizModuleSet.size ? quizModuleSet : settings.quizModules && settings.quizModules.length ? new Set(settings.quizModules) : moduleSet && moduleSet.size ? moduleSet : null;
  const pool = db.listIdsByModules(qMods);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const quiz_ids = pool.slice(0, Math.min(quizN, pool.length));
  const plan = {
    plan_date: dateKey,
    new_ids: [],
    review_ids: specialty_ids.slice(),
    // 兼容旧 queue字段：专题走 review_ids
    done_ids: [],
    modules: mods,
    focus_module: focus,
    specialty_ids,
    quiz_ids,
    quiz_done_ids: [],
    quiz_scores: {},
    quiz_modules: qMods ? [...qMods] : [],
    created_at: now
  };
  db.savePlan(plan);
  return plan;
}
function planQueue(plan, mode = "specialty") {
  if (mode === "quiz") {
    const done2 = new Set(plan.quiz_done_ids || []);
    return (plan.quiz_ids || []).filter((id) => !done2.has(id));
  }
  const done = new Set(plan.done_ids || []);
  return (plan.specialty_ids || plan.review_ids || []).filter(
    (id) => !done.has(id)
  );
}
function planTaskStatus(plan, settings = {}) {
  const pass = settings.quizPassScore ?? 70;
  const specialty = plan.specialty_ids || [];
  const done = new Set(plan.done_ids || []);
  const specialtyDone = specialty.length === 0 ? true : specialty.every((id) => done.has(id));
  const quizIds = plan.quiz_ids || [];
  const quizDone = new Set(plan.quiz_done_ids || []);
  const quizDoneCount = quizIds.filter((id) => quizDone.has(id)).length;
  const quizComplete = quizIds.length === 0 ? true : quizIds.every((id) => quizDone.has(id));
  const scores = plan.quiz_scores || {};
  const scored = quizIds.filter((id) => quizDone.has(id) && scores[id] != null).map((id) => Number(scores[id]));
  const avgScore = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : null;
  const passCount = scored.filter((s) => s >= pass).length;
  const accuracy = scored.length === 0 ? null : Math.round(passCount / scored.length * 100);
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
    allDone: specialtyDone && quizComplete
  };
}

// src/view.js
init_define_process_argv();
var import_obsidian = require("obsidian");

// src/srs.js
init_define_process_argv();
function scheduleSm2(card, grade, now = Date.now()) {
  let ease = card.ease ?? 2.5;
  let reps = card.reps ?? 0;
  let lapses = card.lapses ?? 0;
  let interval = card.interval_days ?? 0;
  let state = card.state || "new";
  if (grade === "again") {
    lapses += 1;
    reps = 0;
    interval = 0;
    state = "relearning";
    ease = Math.max(1.3, ease - 0.2);
  } else if (grade === "hard") {
    if (reps === 0) {
      interval = 1;
    } else {
      interval = Math.max(1, interval * 1.2);
    }
    reps += 1;
    ease = Math.max(1.3, ease - 0.15);
    state = "review";
  } else if (grade === "good") {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 3;
    else interval = Math.max(1, Math.round(interval * ease));
    reps += 1;
    state = "review";
  } else if (grade === "easy") {
    if (reps === 0) interval = 3;
    else if (reps === 1) interval = 7;
    else interval = Math.max(1, Math.round(interval * ease * 1.3));
    reps += 1;
    ease = ease + 0.15;
    state = "review";
  }
  const due_at = grade === "again" ? now : addDaysMs(startOfDayMs(now), interval);
  return {
    ease,
    reps,
    lapses,
    interval_days: interval,
    state,
    due_at,
    last_grade: grade,
    last_reviewed_at: now
  };
}
function scheduleEbbinghaus(card, grade, steps, now = Date.now()) {
  const ladder = steps && steps.length ? steps : EBBINGHAUS_DEFAULT;
  let idx = card.reps ?? 0;
  let lapses = card.lapses ?? 0;
  let interval = 0;
  let state = "review";
  if (grade === "again") {
    lapses += 1;
    idx = 0;
    interval = 0;
    state = "relearning";
  } else if (grade === "hard") {
    interval = 1;
    idx = Math.max(0, idx);
  } else if (grade === "good") {
    interval = ladder[Math.min(idx, ladder.length - 1)];
    idx = Math.min(idx + 1, ladder.length);
  } else if (grade === "easy") {
    idx = Math.min(idx + 2, ladder.length);
    interval = ladder[Math.min(idx - 1, ladder.length - 1)];
  }
  const due_at = grade === "again" ? now : addDaysMs(startOfDayMs(now), interval);
  return {
    ease: card.ease ?? 2.5,
    reps: grade === "again" ? 0 : idx,
    lapses,
    interval_days: interval,
    state,
    due_at,
    last_grade: grade,
    last_reviewed_at: now
  };
}
function scheduleCard(card, grade, settings, now = Date.now()) {
  if (settings.scheduler === "ebbinghaus") {
    return scheduleEbbinghaus(card, grade, settings.ebbinghausSteps, now);
  }
  return scheduleSm2(card, grade, now);
}
function scheduleFromScore(card, score, settings, now = Date.now()) {
  const thresholds = {
    again: settings.scoreThresholdAgain ?? 50,
    hard: settings.scoreThresholdHard ?? 70,
    good: settings.scoreThresholdGood ?? 90
  };
  let grade = "again";
  if (score >= thresholds.good) grade = "easy";
  else if (score >= thresholds.hard) grade = "good";
  else if (score >= thresholds.again) grade = "hard";
  const next = scheduleCard(card, grade, settings, now);
  next.last_grade = `${grade}:${score}`;
  next.last_score = score;
  return { ...next, grade, score };
}

// src/ollama.js
init_define_process_argv();
var DEFAULT_SYSTEM = `\u4F60\u662F\u5BBD\u677E\u3001\u52A1\u5B9E\u7684\u79CB\u62DB\u516B\u80A1\u9762\u8BD5\u5B98\u3002\u76EE\u6807\u662F\u9F13\u52B1\u8868\u8FBE\u3001\u6309\u300C\u7406\u89E3\u7A0B\u5EA6\u300D\u7ED9\u5206\uFF0C\u800C\u4E0D\u662F\u6309\u53C2\u8003\u7B54\u6848\u9010\u6761\u62A0\u5B57\u3002

\u3010\u603B\u539F\u5219\u3011
- \u8003\u751F\u7528\u81EA\u5DF1\u7684\u8BDD\u7B54\u5BF9\u5927\u610F\u5373\u53EF\uFF0C\u4E0D\u8981\u6C42\u63AA\u8F9E\u4E0E\u53C2\u8003\u7B54\u6848\u4E00\u81F4\u3002
- \u5B81\u53EF\u7565\u504F\u9AD8\uFF0C\u4E5F\u4E0D\u8981\u56E0\u6F0F\u6389\u6B21\u8981\u70B9\u5C31\u6253\u5230\u4E0D\u53CA\u683C\u3002
- \u53C2\u8003\u7B54\u6848\u5F80\u5F80\u5F88\u957F\u3001\u5F88\u7EC6\uFF1B\u8003\u751F\u7B54\u5230\u300C\u4E3B\u5E72\u6846\u67B6 + \u5173\u952E\u7ED3\u8BBA\u300D\u5C31\u5E94\u7ED9\u5230\u826F\u597D\u53CA\u4EE5\u4E0A\u3002
- \u53EA\u6709\uFF1A\u7A7A\u767D/\u5B8C\u5168\u8DD1\u9898/\u5173\u952E\u6982\u5FF5\u4E25\u91CD\u9519\u8BEF\uFF0C\u624D\u7ED9\u4F4E\u5206\u3002

\u3010\u7ED9\u5206\u951A\u70B9\uFF08\u5FC5\u987B\u9075\u5B88\uFF09\u3011
- 90\u2013100\uFF1A\u4E3B\u5E72\u9F50\u5168\uFF0C\u8868\u8FF0\u6E05\u695A\uFF0C\u53EF\u6709\u5C0F\u9057\u6F0F\u6216\u8868\u8FF0\u4E0D\u4E25\u8C28
- 75\u201389\uFF1A\u5927\u65B9\u5411\u6B63\u786E\uFF0C\u8986\u76D6\u5927\u90E8\u5206\u6838\u5FC3\u70B9\uFF0C\u7F3A\u4E00\u4E9B\u5C55\u5F00/\u4F8B\u5B50
- 60\u201374\uFF1A\u8BF4\u5230\u4E86\u5173\u952E\u6982\u5FF5\uFF0C\u4F46\u7F3A\u4E00\u534A\u5DE6\u53F3\u8981\u70B9\uFF0C\u6216\u6761\u7406\u4E00\u822C
- 45\u201359\uFF1A\u4EC5\u6709\u96F6\u661F\u6B63\u786E\u70B9\uFF0C\u6216\u6982\u5FF5\u542B\u7CCA\u4F46\u4ECD\u6CBE\u8FB9
- 0\u201344\uFF1A\u7A7A\u767D\u3001\u660E\u663E\u8DD1\u9898\u3001\u6216\u6838\u5FC3\u7ED3\u8BBA\u5B8C\u5168\u9519\u8BEF

\u3010\u6263\u5206\u7EAA\u5F8B\u3011
- \u6F0F 1\uFF5E2 \u4E2A\u6B21\u8981\u70B9\uFF1A\u6700\u591A\u6263 5\uFF5E10 \u5206\uFF0C\u4E0D\u8981\u8170\u65A9\u3002
- \u6CA1\u5199\u4F8B\u5B50/\u6CA1\u753B\u5C42\u6B21/\u6CA1\u63D0\u7248\u672C\u5DEE\u5F02\uFF1A\u901A\u5E38\u4E0D\u6263\u5230\u6863\uFF0C\u6216\u53EA\u6263\u5F88\u5C11\u3002
- \u4E0D\u8981\u56E0\u4E3A\u300C\u6CA1\u80CC\u51FA\u53C2\u8003\u7B54\u6848\u91CC\u7684\u5168\u90E8\u5B50\u5F39\u300D\u5C31\u7ED9 40 \u5206\u4EE5\u4E0B\u3002
- \u6709\u660E\u663E\u6B63\u786E hits \u65F6\uFF0C\u5206\u6570\u901A\u5E38\u4E0D\u5E94\u4F4E\u4E8E 60\uFF08\u9664\u975E\u540C\u65F6\u6709\u4E25\u91CD\u9519\u8BEF\uFF09\u3002

\u3010\u8F93\u51FA\u3011
\u53EA\u8F93\u51FA JSON\uFF0C\u4E0D\u8981 Markdown \u56F4\u680F\uFF0C\u4E0D\u8981\u5176\u5B83\u89E3\u91CA\u3002
\u5B57\u6BB5\uFF1A
- score: \u6574\u6570 0-100\uFF08\u6309\u4E0A\u8FF0\u951A\u70B9\uFF09
- feedback: \u4E00\u4E24\u53E5\u4E2D\u6587\u8BC4\u8BED\uFF0C\u5148\u80AF\u5B9A\u518D\u8BF4\u8865\u5F3A
- missing: \u5B57\u7B26\u4E32\u6570\u7EC4\uFF0C\u771F\u6B63\u5173\u952E\u7684\u7F3A\u6F0F\uFF08\u6B21\u8981\u70B9\u53EF\u7701\u7565\uFF0C\u53EF\u7A7A\uFF09
- hits: \u5B57\u7B26\u4E32\u6570\u7EC4\uFF0C\u7B54\u5BF9\u7684\u5173\u952E\u70B9\uFF08\u53EF\u7A7A\uFF09`;
async function scoreWithOllama({
  baseUrl,
  model,
  question,
  reference,
  userAnswer,
  timeoutMs = 12e4
}) {
  const root = (baseUrl || "http://127.0.0.1:11434").replace(/\/$/, "");
  const userContent = [
    `\u9898\u76EE\uFF1A
${question || ""}`,
    `
\u53C2\u8003\u7B54\u6848\uFF08\u4EC5\u4F5C\u8981\u70B9\u5BF9\u7167\uFF0C\u52FF\u8981\u6C42\u8003\u751F\u590D\u8FF0\u5168\u6587\uFF09\uFF1A
${(reference || "").slice(0, 12e3)}`,
    `
\u8003\u751F\u4F5C\u7B54\uFF1A
${(userAnswer || "").trim() || "\uFF08\u7A7A\u767D\uFF09"}`,
    `
\u8BC4\u5206\u8981\u6C42\uFF1A\u6293\u4F4F\u4E3B\u5E72\u7ED9\u5206\uFF1B\u7F3A\u6B21\u8981\u70B9\u4E0D\u8981\u5927\u5E45\u6263\u5206\uFF1B\u6709\u7406\u89E3\u5C31\u5F80 75+ \u9760\u3002`,
    `
\u8BF7\u8F93\u51FA JSON\uFF1A{"score":0-100,"feedback":"...","missing":[],"hits":[]}`
  ].join("\n");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${root}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: model || "minimax-m3:cloud",
        stream: false,
        format: "json",
        messages: [
          { role: "system", content: DEFAULT_SYSTEM },
          { role: "user", content: userContent }
        ],
        options: {
          temperature: 0.35
        }
      })
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ollama HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    const raw = data.message && data.message.content || data.response || "";
    return parseScorePayload(raw);
  } finally {
    clearTimeout(timer);
  }
}
function parseScorePayload(raw) {
  let text = String(raw || "").trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  let obj;
  try {
    obj = JSON.parse(text);
  } catch (_) {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("\u6A21\u578B\u672A\u8FD4\u56DE\u53EF\u89E3\u6790 JSON");
    obj = JSON.parse(m[0]);
  }
  let score = Number(obj.score);
  if (Number.isNaN(score)) score = 0;
  score = Math.max(0, Math.min(100, Math.round(score)));
  const hits = Array.isArray(obj.hits) ? obj.hits.map(String) : [];
  const missing = Array.isArray(obj.missing) ? obj.missing.map(String) : [];
  if (hits.length >= 2 && score < 60) {
    score = Math.max(score, 62);
  } else if (hits.length >= 1 && score < 50 && score > 0) {
    score = Math.max(score, 55);
  }
  if (missing.length > 0 && missing.length <= 2 && hits.length >= 1 && score < 70) {
    score = Math.max(score, 72);
  }
  return {
    score,
    feedback: String(obj.feedback || obj.comment || "").trim(),
    missing,
    hits,
    raw: text
  };
}

// src/charts.js
init_define_process_argv();
function renderEbbinghausSvg(container, steps = [1, 2, 4, 7, 15, 30, 60]) {
  container.empty();
  container.createDiv({ cls: "bagu-chart-title", text: "\u827E\u5BBE\u6D69\u65AF\u8BB0\u5FC6\u66F2\u7EBF\uFF08\u793A\u610F\uFF09" });
  const W = 420;
  const H = 180;
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const maxDay = Math.max(30, ...steps.filter((d2) => d2 <= 60));
  const reviewSet = new Set(steps.filter((d2) => d2 > 0 && d2 <= maxDay));
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
  const xOf = (t) => pad.l + t / maxDay * innerW;
  const yOf = (r) => pad.t + (1 - r) * innerH;
  let d = "";
  curve.forEach((p, i) => {
    d += `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)},${yOf(p.r).toFixed(1)} `;
  });
  const marks = [...reviewSet].map((t) => {
    const p = curve.find((c) => c.t === t) || { r: 0.5 };
    return `<circle cx="${xOf(t)}" cy="${yOf(p.r)}" r="3.5" fill="var(--interactive-accent)"/>
        <text x="${xOf(t)}" y="${yOf(p.r) - 8}" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.65">${t}d</text>`;
  }).join("");
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "bagu-svg");
  svg.innerHTML = `
    <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t + innerH}" stroke="currentColor" opacity="0.25"/>
    <line x1="${pad.l}" y1="${pad.t + innerH}" x2="${pad.l + innerW}" y2="${pad.t + innerH}" stroke="currentColor" opacity="0.25"/>
    <text x="8" y="${pad.t + 8}" font-size="10" fill="currentColor" opacity="0.55">\u8BB0\u5FC6</text>
    <text x="${pad.l + innerW - 16}" y="${H - 8}" font-size="10" fill="currentColor" opacity="0.55">\u5929</text>
    <path d="${d}" fill="none" stroke="var(--interactive-accent)" stroke-width="2.2"/>
    ${marks}
  `;
  container.appendChild(svg);
  container.createDiv({
    cls: "bagu-tip",
    text: `\u590D\u4E60\u8282\u70B9\uFF1A${steps.join(" / ")} \u5929\u3002\u53CA\u65F6\u590D\u4E60\u53EF\u62AC\u5347\u66F2\u7EBF\u5E76\u62C9\u957F\u4FDD\u6301\u65F6\u95F4\u3002`
  });
}
function renderHeatmapSvg(container, dayCounts, weeks = 16) {
  container.empty();
  container.createDiv({ cls: "bagu-chart-title", text: "\u6BCF\u65E5\u6253\u5361\u70ED\u529B\u56FE" });
  const wrap = container.createDiv({ cls: "bagu-heatmap-wrap" });
  const tip = container.createDiv({ cls: "bagu-heat-tooltip" });
  tip.style.display = "none";
  const map = new Map((dayCounts || []).map((d) => [d.date, d.count]));
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay());
  const cell = 12;
  const gap = 3;
  const labelW = 28;
  const monthsH = 16;
  const cols = Math.ceil((today - start) / 864e5 / 7) + 1;
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
  const weekdays = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
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
      mt.textContent = `${cursor.getMonth() + 1}\u6708`;
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
        cnt ? `${key} \xB7 \u590D\u4E60 ${cnt} \u6B21` : `${key} \xB7 \u672A\u6253\u5361`
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
  const legendY = H - 6;
  const legend = document.createElementNS(ns, "g");
  const lt = document.createElementNS(ns, "text");
  lt.setAttribute("x", String(labelW));
  lt.setAttribute("y", String(legendY));
  lt.setAttribute("font-size", "9");
  lt.setAttribute("fill", "currentColor");
  lt.setAttribute("opacity", "0.5");
  lt.textContent = "\u5C11";
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
  lt2.textContent = "\u591A";
  legend.appendChild(lt2);
  svg.appendChild(legend);
  wrap.appendChild(svg);
}

// src/asr.js
init_define_process_argv();
function asrSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
var ASR_PRESETS = {
  siliconflow: {
    label: "\u7845\u57FA\u6D41\u52A8 SenseVoice\uFF08\u63A8\u8350\xB7\u56FD\u5185\u514D\u8D39\u989D\u5EA6\uFF09",
    baseUrl: "https://api.siliconflow.cn",
    model: "FunAudioLLM/SenseVoiceSmall",
    keyUrl: "https://cloud.siliconflow.cn/account/ak"
  },
  groq: {
    label: "Groq Whisper\uFF08\u6D77\u5916\uFF1B\u56FD\u5185\u6613 Forbidden\uFF09",
    baseUrl: "https://api.groq.com/openai",
    model: "whisper-large-v3-turbo",
    keyUrl: "https://console.groq.com/keys"
  },
  "openai-compatible": {
    label: "\u81EA\u5B9A\u4E49 / \u672C\u5730 Whisper",
    baseUrl: "http://127.0.0.1:9000",
    model: "small",
    keyUrl: ""
  }
};
function createRecorder() {
  let stream = null;
  let recorder = null;
  let chunks = [];
  let mimeType = "audio/webm";
  async function start() {
    if (recorder && recorder.state === "recording") return;
    chunks = [];
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    });
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus"
    ];
    mimeType = candidates.find(
      (t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)
    ) || "";
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    mimeType = recorder.mimeType || mimeType || "audio/webm";
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    recorder.start(250);
  }
  function stop() {
    return new Promise((resolve, reject) => {
      if (!recorder) {
        cleanup();
        resolve(null);
        return;
      }
      const rec = recorder;
      rec.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
          cleanup();
          resolve(blob.size ? blob : null);
        } catch (e) {
          cleanup();
          reject(e);
        }
      };
      rec.onerror = (e) => {
        cleanup();
        reject(e.error || new Error("\u5F55\u97F3\u5931\u8D25"));
      };
      if (rec.state !== "inactive") rec.stop();
      else {
        cleanup();
        resolve(null);
      }
    });
  }
  function cleanup() {
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch (_) {
      }
    }
    recorder = null;
    chunks = [];
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  }
  function isRecording() {
    return !!(recorder && recorder.state === "recording");
  }
  return { start, stop, cleanup, isRecording, getMimeType: () => mimeType };
}
function extForMime(mime) {
  if (!mime) return "webm";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  if (mime.includes("wav")) return "wav";
  return "webm";
}
function resolveEndpoint(settings) {
  const provider = settings.asrProvider || "siliconflow";
  const preset = ASR_PRESETS[provider];
  let base = (settings.asrBaseUrl || "").trim() || preset && preset.baseUrl || "https://api.siliconflow.cn";
  base = base.replace(/\/$/, "");
  if (!base.endsWith("/v1") && !base.endsWith("/openai")) {
  }
  let url;
  if (provider === "groq") {
    url = "https://api.groq.com/openai/v1/audio/transcriptions";
  } else if (base.includes("/v1")) {
    url = `${base.replace(/\/$/, "")}/audio/transcriptions`;
  } else {
    url = `${base}/v1/audio/transcriptions`;
  }
  const model = (settings.asrModel || "").trim() || preset && preset.model || "FunAudioLLM/SenseVoiceSmall";
  return { provider, url, model, preset };
}
async function transcribeBlob(blob, settings) {
  const provider = settings.asrProvider || "siliconflow";
  if (provider === "off" || provider === "none") {
    throw new Error("\u8BF7\u5148\u5728\u8BBE\u7F6E\u91CC\u542F\u7528\u8BED\u97F3\u8BC6\u522B\uFF08\u63A8\u8350\u7845\u57FA\u6D41\u52A8\uFF09");
  }
  const { url, model, preset } = resolveEndpoint(settings);
  const key = (settings.asrApiKey || "").trim();
  if (!key && provider !== "openai-compatible") {
    const hint = preset && preset.keyUrl || "";
    throw new Error(
      `\u672A\u914D\u7F6E API Key\u3002${hint ? "\u7533\u8BF7\uFF1A" + hint + " \uFF0C" : ""}\u586B\u5230\u63D2\u4EF6\u8BBE\u7F6E\u300CASR API Key\u300D`
    );
  }
  const lang = settings.asrLang || "zh";
  const form = new FormData();
  const ext = extForMime(blob.type);
  form.append("file", blob, `answer.${ext}`);
  form.append("model", model);
  if (lang && lang !== "auto" && (provider === "groq" || /whisper/i.test(model) || provider === "openai-compatible")) {
    form.append("language", lang);
  }
  form.append("response_format", "json");
  const headers = {};
  if (key) headers.Authorization = `Bearer ${key}`;
  const controller = new AbortController();
  const ms = settings.asrTimeoutMs || 12e4;
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: form,
      signal: controller.signal
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      if (res.status === 403 || /forbidden/i.test(t) || /Forbidden/.test(t)) {
        throw new Error(
          `${provider} \u8FD4\u56DE Forbidden\uFF08${res.status}\uFF09\u3002Groq \u5728\u56FD\u5185\u5E38\u88AB\u5899/\u62D2\uFF1B\u8BF7\u6539\u7528\u300C\u7845\u57FA\u6D41\u52A8\u300D\uFF1Ahttps://cloud.siliconflow.cn \u7533\u8BF7 Key\uFF0C\u8BBE\u7F6E\u91CC\u9009 siliconflow\u3002\u539F\u6587\uFF1A${t.slice(0, 120)}`
        );
      }
      throw new Error(`ASR HTTP ${res.status}: ${t.slice(0, 240)}`);
    }
    const data = await res.json();
    const text = String(data.text || data.transcription || "").trim();
    if (!text) throw new Error("\u672A\u8BC6\u522B\u5230\u6709\u6548\u8BED\u97F3\uFF0C\u8BF7\u9760\u8FD1\u9EA6\u514B\u98CE\u518D\u8BF4\u4E00\u904D");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

// src/view.js
var LogDetailModal = class extends import_obsidian.Modal {
  constructor(app, log) {
    super(app);
    this.log = log;
  }
  onOpen() {
    const { contentEl, log } = this;
    contentEl.empty();
    contentEl.addClass("bagu-log-modal");
    contentEl.createEl("h2", { text: "\u590D\u4E60\u8BE6\u60C5" });
    const meta = contentEl.createDiv({ cls: "bagu-meta" });
    meta.setText(
      `${log.module || "-"} \xB7 ${log.path || ""} \xB7 ${new Date(
        log.reviewed_at
      ).toLocaleString()}`
    );
    contentEl.createEl("h3", { text: "\u9898\u76EE" });
    contentEl.createDiv({ text: log.question || log.card_id || "" });
    contentEl.createEl("h3", { text: "\u8BC4\u5206" });
    contentEl.createDiv({
      text: `\u5206\u6570 ${log.score != null ? log.score : "-"} \xB7 \u6863\u4F4D ${log.grade || "-"} \xB7 \u95F4\u9694 ${log.scheduled_days != null ? log.scheduled_days : "-"} \u5929 \xB7 \u6A21\u5F0F ${log.mode || "-"}`
    });
    if (log.feedback) {
      contentEl.createEl("h3", { text: "\u8BC4\u8BED" });
      contentEl.createDiv({ text: log.feedback });
    }
    contentEl.createEl("h3", { text: "\u6211\u7684\u4F5C\u7B54" });
    contentEl.createDiv({
      cls: "bagu-mine",
      text: log.user_answer || "\uFF08\u672A\u8BB0\u5F55\uFF09"
    });
    contentEl.createEl("h3", { text: "\u53C2\u8003\u7B54\u6848" });
    const ans = contentEl.createDiv({ cls: "bagu-answer bagu-selectable" });
    ans.createEl("pre", { cls: "bagu-selectable", text: log.answer || "\uFF08\u65E0\uFF09" });
  }
};
var BaguView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.tab = "today";
    this.mode = "write";
    this.sessionMode = "specialty";
    this.modules = [];
    this.selectedModules = /* @__PURE__ */ new Set();
    this.quizModules = /* @__PURE__ */ new Set();
    this.current = null;
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null;
    this.aiLoading = false;
    this.cooldown = [];
    this.sessionQueue = [];
    this.plan = null;
    this._recorder = null;
    this._asrBusy = false;
    this.bankModule = "";
    this.bankKeyword = "";
    this.bankState = "";
    this.bankFavOnly = false;
    this.bankPicked = /* @__PURE__ */ new Set();
    this._onKey = this._onKey.bind(this);
  }
  getViewType() {
    return VIEW_TYPE_BAGU;
  }
  getDisplayText() {
    return "\u79CB\u62DB\u516B\u80A1";
  }
  getIcon() {
    return "calendar-check";
  }
  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass("bagu-view");
    await this.plugin.ensureDb();
    await this.plugin.syncIndex(false);
    this.loadModules();
    this.refreshPlan();
    this.render();
    window.addEventListener("keydown", this._onKey);
  }
  async onClose() {
    window.removeEventListener("keydown", this._onKey);
    this.stopAsr(true);
  }
  stopAsr(silent = false) {
    if (this._recorder) {
      try {
        this._recorder.cleanup();
      } catch (_) {
      }
      this._recorder = null;
    }
    this._asrBusy = false;
    if (!silent) this.render();
  }
  _onKey(e) {
    if (!this.leaf || this.leaf.view !== this) return;
    if (this.tab !== "drill") return;
    const tag = e.target && e.target.tagName || "";
    if (tag === "TEXTAREA" || tag === "INPUT") {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        this.runAiScore();
      }
      return;
    }
    const sel = window.getSelection && window.getSelection();
    if (sel && String(sel).length > 0) return;
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      if (!this.revealed) this.reveal();
      return;
    }
    if (!this.revealed || this.aiLoading) return;
    if (e.key === "Enter" && this.aiResult) {
      e.preventDefault();
      this.commitAiScore();
      return;
    }
    if (this.plugin.settings.allowManualGrade) {
      if (e.key === "1") this.grade("again");
      if (e.key === "2") this.grade("hard");
      if (e.key === "3") this.grade("good");
      if (e.key === "4") this.grade("easy");
    }
  }
  loadModules() {
    const rows = this.plugin.db.getModules();
    this.modules = rows.map((r) => r.module);
    const pref = this.plugin.settings.preferredModules || [];
    if (!this.selectedModules.size) {
      if (pref.length) pref.forEach((m) => this.selectedModules.add(m));
      else this.modules.forEach((m) => this.selectedModules.add(m));
    }
    const qpref = this.plugin.settings.quizModules || [];
    if (!this.quizModules.size) {
      if (qpref.length) qpref.forEach((m) => this.quizModules.add(m));
      else this.modules.forEach((m) => this.quizModules.add(m));
    }
  }
  moduleSet() {
    return this.selectedModules;
  }
  quizModuleSet() {
    return this.quizModules;
  }
  refreshPlan(force = false) {
    if (force) {
      const dateKey = todayKey();
      this.plugin.db.db.run(`DELETE FROM daily_plans WHERE plan_date = ?`, [
        dateKey
      ]);
    }
    this.plan = ensureDailyPlan(
      this.plugin.db,
      this.plugin.settings,
      this.moduleSet(),
      this.quizModuleSet()
    );
    this.sessionQueue = planQueue(this.plan, this.sessionMode);
  }
  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("bagu-view");
    const header = root.createDiv({ cls: "bagu-header" });
    const titleRow = header.createDiv({ cls: "bagu-header-left" });
    titleRow.createDiv({ cls: "bagu-title", text: "\u79CB\u62DB\u516B\u80A1\u590D\u4E60" });
    const syncTop = titleRow.createEl("button", {
      cls: "bagu-sync-btn",
      text: "\u540C\u6B65\u7B14\u8BB0",
      attr: { title: "\u4ECE Markdown \u91CD\u65B0\u5BFC\u5165\u9898\u76EE\u5230 SQLite" }
    });
    syncTop.onclick = () => this.syncFromNotes();
    this.statsEl = header.createDiv({ cls: "bagu-stats" });
    const tabs = root.createDiv({ cls: "bagu-tabs" });
    for (const [id, label] of [
      ["today", "\u4ECA\u65E5\u8BA1\u5212"],
      ["drill", "\u5F00\u59CB\u5237\u9898"],
      ["bank", "\u9898\u5E93"],
      ["fav", "\u6536\u85CF"],
      ["stats", "\u7EDF\u8BA1"],
      ["history", "\u5386\u53F2"]
    ]) {
      const b = tabs.createEl("button", {
        cls: "bagu-tab" + (this.tab === id ? " is-on" : ""),
        text: label
      });
      b.onclick = () => {
        this.tab = id;
        if (id === "drill" && !this.current) this.nextFromPlan();
        this.render();
      };
    }
    this.bodyEl = root.createDiv({ cls: "bagu-body" });
    this.updateHeaderStats();
    if (this.tab === "today") this.renderToday();
    else if (this.tab === "drill") await this.renderDrill();
    else if (this.tab === "bank") this.renderBank();
    else if (this.tab === "fav") this.renderFavorites();
    else if (this.tab === "stats") this.renderStats();
    else this.renderHistory();
  }
  updateHeaderStats() {
    if (!this.statsEl || !this.plan) return;
    const tasks = planTaskStatus(this.plan, this.plugin.settings);
    const ov = this.plugin.db.statsOverview();
    const favN = this.plugin.db.countFavorites();
    const acc = tasks.accuracy != null ? `\u51C6\u786E\u7387 ${tasks.accuracy}%` : "\u51C6\u786E\u7387 -";
    this.statsEl.setText(
      `\u4E13\u9898 ${tasks.specialtyDoneCount}/${tasks.specialtyTotal} \xB7 \u62F7\u95EE ${tasks.quizDoneCount}/${tasks.quizTotal} \xB7 ${acc} \xB7 \u6536\u85CF ${favN} \xB7 \u8FDE\u7EED ${ov.streak} \u5929`
    );
  }
  renderModuleChips(parent, targetSet, saveKey) {
    const wrap = parent.createDiv({ cls: "bagu-modules" });
    for (const m of this.modules) {
      const row = this.plugin.db.getModules().find((x) => x.module === m);
      const chip = wrap.createSpan({
        cls: "bagu-chip" + (targetSet.has(m) ? " is-on" : ""),
        text: `${m}${row ? ` (${row.cnt})` : ""}`
      });
      chip.onclick = () => {
        if (targetSet.has(m)) targetSet.delete(m);
        else targetSet.add(m);
        this.plugin.settings[saveKey] = [...targetSet];
        this.plugin.saveSettings();
        chip.toggleClass("is-on", targetSet.has(m));
      };
    }
  }
  renderToday() {
    const el = this.bodyEl;
    el.empty();
    const toolbar = el.createDiv({ cls: "bagu-toolbar" });
    const sync = toolbar.createEl("button", {
      cls: "mod-cta",
      text: "\u540C\u6B65\u7B14\u8BB0"
    });
    sync.onclick = () => this.syncFromNotes();
    const regen = toolbar.createEl("button", { text: "\u91CD\u6EDA\u4ECA\u65E5\u8BA1\u5212" });
    regen.onclick = () => {
      this.refreshPlan(true);
      new import_obsidian.Notice("\u5DF2\u91CD\u65B0\u751F\u6210\uFF1A\u6574\u4E13\u9898 + \u9650\u5B9A\u8303\u56F4\u62F7\u95EE");
      this.render();
    };
    el.createEl("h3", { text: "\u4E13\u9898\u8F6E\u6362\u8303\u56F4\uFF08\u4EFB\u52A1\u4E00\u4ECE\u4E2D\u9009\u6574\u5929\u4E13\u9898\uFF09" });
    this.renderModuleChips(el, this.selectedModules, "preferredModules");
    el.createEl("h3", { text: "\u62F7\u95EE\u62BD\u9898\u8303\u56F4\uFF08\u4EFB\u52A1\u4E8C\u4ECE\u6B64\u8303\u56F4\u968F\u673A\u62BD 15 \u9898\uFF09" });
    this.renderModuleChips(el, this.quizModules, "quizModules");
    el.createDiv({
      cls: "bagu-tip",
      text: "\u6539\u8303\u56F4\u540E\u8BF7\u70B9\u300C\u91CD\u6EDA\u4ECA\u65E5\u8BA1\u5212\u300D\u624D\u4F1A\u6309\u65B0\u8303\u56F4\u91CD\u65B0\u62BD\u9898\u3002"
    });
    const plan = this.plan;
    const tasks = planTaskStatus(plan, this.plugin.settings);
    const box = el.createDiv({ cls: "bagu-plan-card" });
    box.createEl("h3", { text: `\u4ECA\u65E5\u53CC\u4EFB\u52A1 \xB7 ${plan.plan_date}` });
    const t1 = box.createDiv({
      cls: "bagu-task" + (tasks.specialtyDone ? " is-done" : "")
    });
    t1.createDiv({
      cls: "bagu-task-title",
      text: `\u4EFB\u52A1\u4E00 \xB7 \u6E05\u5B8C\u4E13\u9898\u300C${tasks.focusModule || "-"}\u300D ${tasks.specialtyDoneCount}/${tasks.specialtyTotal}`
    });
    t1.createDiv({
      cls: "bagu-tip",
      text: tasks.specialtyDone ? "\u4E13\u9898\u5DF2\u5168\u90E8\u590D\u4E60\u5B8C" : "\u9700\u590D\u4E60\u5B8C\u8BE5\u4E13\u9898\u4E0B\u5168\u90E8\u9898\u76EE\uFF08\u975E\u6574\u65E5\u989D\u5EA6\uFF09"
    });
    const b1 = t1.createEl("button", {
      cls: "mod-cta",
      text: "\u5F00\u59CB\u4E13\u9898\u590D\u4E60"
    });
    b1.onclick = () => {
      this.sessionMode = "specialty";
      this.tab = "drill";
      this.nextFromPlan();
      this.render();
    };
    const t2 = box.createDiv({
      cls: "bagu-task" + (tasks.quizComplete ? " is-done" : "")
    });
    const accText = tasks.accuracy != null ? `\u51C6\u786E\u7387 ${tasks.accuracy}%\uFF08\u2265${tasks.passScore} \u5206\u7B97\u5BF9\uFF09` : "\u51C6\u786E\u7387\u5F85\u7EDF\u8BA1";
    const avgText = tasks.avgScore != null ? ` \xB7 \u5747\u5206 ${tasks.avgScore}` : "";
    t2.createDiv({
      cls: "bagu-task-title",
      text: `\u4EFB\u52A1\u4E8C \xB7 \u9650\u5B9A\u8303\u56F4\u62F7\u95EE ${tasks.quizDoneCount}/${tasks.quizTotal} \xB7 ${accText}${avgText}`
    });
    t2.createDiv({
      cls: "bagu-tip",
      text: `\u8303\u56F4\uFF1A${(tasks.quizModules && tasks.quizModules.length ? tasks.quizModules.join("\u3001") : "\u5168\u90E8") || "\u5168\u90E8"} \xB7 \u968F\u673A\u62BD ${this.plugin.settings.quizCount || 15} \u9898\u6D4B\u638C\u63E1`
    });
    const b2 = t2.createEl("button", {
      cls: "mod-cta",
      text: "\u5F00\u59CB\u62F7\u95EE\u62BD\u6D4B"
    });
    b2.onclick = () => {
      this.sessionMode = "quiz";
      this.tab = "drill";
      this.nextFromPlan();
      this.render();
    };
    const bar = box.createDiv({ cls: "bagu-progress" });
    const total = tasks.specialtyTotal + tasks.quizTotal || 1;
    const done = tasks.specialtyDoneCount + tasks.quizDoneCount;
    const pct = Math.round(done / total * 100);
    bar.createDiv({
      cls: "bagu-progress-fill",
      attr: { style: `width:${pct}%` }
    });
    const s = this.plugin.settings;
    el.createDiv({
      cls: "bagu-tip",
      text: `\u8C03\u5EA6\uFF1A${s.scheduler === "ebbinghaus" ? "\u827E\u5BBE\u6D69\u65AF" : "SM-2"} \xB7 \u6A21\u578B ${s.ollamaModel || "minimax-m3:cloud"}`
    });
    const charts = el.createDiv({ cls: "bagu-charts" });
    const heat = charts.createDiv({ cls: "bagu-chart-block" });
    renderHeatmapSvg(heat, this.plugin.db.dailyReviewCounts(130), 16);
    const curve = charts.createDiv({ cls: "bagu-chart-block" });
    renderEbbinghausSvg(curve, s.ebbinghausSteps || EBBINGHAUS_DEFAULT);
  }
  async syncFromNotes() {
    const n = await this.plugin.syncIndex(true);
    this.loadModules();
    if (this.current && this.current.id) {
      const fresh = this.plugin.db.getCardJoin(this.current.id);
      if (fresh) this.current = fresh;
      else {
        this.nextFromPlan();
      }
    }
    this.aiResult = null;
    this.revealed = false;
    this.writeDraft = "";
    this.render();
    return n;
  }
  nextFromPlan() {
    this.refreshPlan(false);
    if (this.sessionMode === "fav") {
      const favs = this.plugin.db.listFavorites(500).map((r) => r.id);
      this.sessionQueue = favs.filter((id2) => !this.cooldown.includes(id2));
      if (!this.sessionQueue.length && favs.length) {
        this.cooldown = [];
        this.sessionQueue = favs.slice();
      }
    } else if (this.sessionMode === "pick") {
      const picked = [...this.bankPicked];
      this.sessionQueue = picked.filter((id2) => !this.cooldown.includes(id2));
      if (!this.sessionQueue.length && picked.length) {
        this.cooldown = [];
        this.sessionQueue = picked.slice();
      }
    } else {
      this.sessionQueue = planQueue(this.plan, this.sessionMode);
    }
    let id = null;
    for (const x of this.sessionQueue) {
      if (!this.cooldown.includes(x)) {
        id = x;
        break;
      }
    }
    if (!id && this.sessionQueue.length) id = this.sessionQueue[0];
    if (!id) {
      this.current = null;
      this.revealed = false;
      this.writeDraft = "";
      this.aiResult = null;
      this.aiLoading = false;
      return;
    }
    this.current = this.plugin.db.getCardJoin(id);
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null;
    this.aiLoading = false;
  }
  nextRandom() {
    const rand = this.plugin.db.listRandom(
      this.moduleSet(),
      this.cooldown,
      1
    );
    const id = rand[0];
    this.current = id ? this.plugin.db.getCardJoin(id) : null;
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null;
    this.aiLoading = false;
  }
  async renderDrill() {
    const el = this.bodyEl;
    el.empty();
    const toolbar = el.createDiv({ cls: "bagu-toolbar" });
    const taskGroup = toolbar.createDiv({ cls: "bagu-mode-group" });
    const bSpec = taskGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.sessionMode === "specialty" ? " is-on" : ""),
      text: "\u4E13\u9898\u4EFB\u52A1"
    });
    const bQuiz = taskGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.sessionMode === "quiz" ? " is-on" : ""),
      text: "\u62F7\u95EE\u62BD\u6D4B"
    });
    const bFav = taskGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.sessionMode === "fav" ? " is-on" : ""),
      text: "\u6536\u85CF\u590D\u4E60"
    });
    const bPick = taskGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.sessionMode === "pick" ? " is-on" : ""),
      text: `\u81EA\u9009\u9898${this.bankPicked.size ? `(${this.bankPicked.size})` : ""}`
    });
    bSpec.onclick = () => {
      this.sessionMode = "specialty";
      this.nextFromPlan();
      this.render();
    };
    bQuiz.onclick = () => {
      this.sessionMode = "quiz";
      this.nextFromPlan();
      this.render();
    };
    bFav.onclick = () => {
      this.sessionMode = "fav";
      this.nextFromPlan();
      this.render();
    };
    bPick.onclick = () => {
      if (!this.bankPicked.size) {
        new import_obsidian.Notice("\u8BF7\u5148\u5230\u300C\u9898\u5E93\u300D\u52FE\u9009\u9898\u76EE");
        this.tab = "bank";
        this.render();
        return;
      }
      this.sessionMode = "pick";
      this.nextFromPlan();
      this.render();
    };
    const modeGroup = toolbar.createDiv({ cls: "bagu-mode-group" });
    const bCard = modeGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.mode === "card" ? " is-on" : ""),
      text: "\u95EA\u5361\u53E3\u8FF0"
    });
    const bWrite = modeGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.mode === "write" ? " is-on" : ""),
      text: "\u906E\u6321\u9ED8\u5199"
    });
    bCard.onclick = () => {
      this.mode = "card";
      this.revealed = false;
      this.aiResult = null;
      this.render();
    };
    bWrite.onclick = () => {
      this.mode = "write";
      this.revealed = false;
      this.aiResult = null;
      this.render();
    };
    toolbar.createEl("button", {
      cls: "mod-cta",
      text: "\u540C\u6B65\u7B14\u8BB0"
    }).onclick = () => this.syncFromNotes();
    toolbar.createEl("button", { text: "\u8BA1\u5212\u4E0B\u4E00\u9898" }).onclick = () => {
      this.nextFromPlan();
      this.render();
    };
    toolbar.createEl("button", { text: "\u968F\u673A\u4E00\u9898" }).onclick = () => {
      this.nextRandom();
      this.render();
    };
    const card = el.createDiv({ cls: "bagu-card" });
    const actions = el.createDiv({ cls: "bagu-actions" });
    if (!this.current) {
      const tasks = planTaskStatus(this.plan, this.plugin.settings);
      let msg;
      if (this.sessionMode === "fav") {
        msg = this.plugin.db.countFavorites() === 0 ? "\u8FD8\u6CA1\u6709\u6536\u85CF\u3002\u5237\u9898\u65F6\u70B9\u300C\u2606 \u6536\u85CF\u300D\u5373\u53EF\u52A0\u5165\u3002" : "\u6536\u85CF\u961F\u5217\u5DF2\u5237\u5B8C\uFF08\u6216\u90FD\u5728\u51B7\u5374\u4E2D\uFF09\uFF0C\u53EF\u56DE\u6536\u85CF\u9875\u67E5\u770B\uFF0C\u6216\u70B9\u968F\u673A/\u53D6\u6D88\u51B7\u5374\u3002";
      } else if (this.sessionMode === "pick") {
        msg = this.bankPicked.size ? "\u81EA\u9009\u961F\u5217\u5DF2\u5237\u5B8C\u3002\u53EF\u56DE\u9898\u5E93\u7EE7\u7EED\u52FE\u9009\uFF0C\u6216\u6E05\u7A7A\u540E\u91CD\u9009\u3002" : "\u8FD8\u6CA1\u6709\u81EA\u9009\u9898\uFF0C\u8BF7\u5230\u300C\u9898\u5E93\u300D\u52FE\u9009\u540E\u518D\u5F00\u59CB\u3002";
      } else if (this.sessionMode === "quiz") {
        msg = tasks.quizComplete ? `\u62F7\u95EE\u5DF2\u5B8C\u6210 \xB7 \u51C6\u786E\u7387 ${tasks.accuracy != null ? tasks.accuracy + "%" : "-"} \xB7 \u5747\u5206 ${tasks.avgScore != null ? tasks.avgScore : "-"}` : "\u62F7\u95EE\u961F\u5217\u4E3A\u7A7A\uFF0C\u8BF7\u56DE\u4ECA\u65E5\u8BA1\u5212\u91CD\u6EDA\u6216\u6269\u5927\u62F7\u95EE\u8303\u56F4\u3002";
      } else {
        msg = tasks.specialtyDone ? `\u4E13\u9898\u300C${tasks.focusModule}\u300D\u5DF2\u6E05\u5B8C` : "\u4E13\u9898\u961F\u5217\u4E3A\u7A7A\uFF0C\u8BF7\u540C\u6B65\u7B14\u8BB0\u6216\u91CD\u6EDA\u8BA1\u5212\u3002";
      }
      card.createDiv({ cls: "bagu-empty", text: msg });
      return;
    }
    const q = this.current;
    const favOn = !!q.favorite;
    const taskLabel = this.sessionMode === "quiz" ? "\u62F7\u95EE\u62BD\u6D4B" : this.sessionMode === "fav" ? "\u6536\u85CF\u590D\u4E60" : this.sessionMode === "pick" ? "\u81EA\u9009\u9898" : `\u4E13\u9898\xB7${q.module}`;
    const metaRow = card.createDiv({ cls: "bagu-meta-row" });
    metaRow.createDiv({
      cls: "bagu-meta",
      text: `${taskLabel} \xB7 ${q.path} \xB7 Q${q.num} \xB7 ${q.state || "new"} \xB7 \u95F4\u9694 ${q.interval_days || 0} \u5929`
    });
    const favBtn = metaRow.createEl("button", {
      cls: "bagu-fav-btn" + (favOn ? " is-on" : ""),
      text: favOn ? "\u2605 \u5DF2\u6536\u85CF" : "\u2606 \u6536\u85CF",
      attr: { title: favOn ? "\u53D6\u6D88\u6536\u85CF" : "\u6536\u85CF\u672C\u9898\uFF0C\u4FBF\u4E8E\u56DE\u5934\u4E13\u7EC3" }
    });
    favBtn.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const on = this.plugin.db.toggleFavorite(q.id);
      this.current = this.plugin.db.getCardJoin(q.id);
      new import_obsidian.Notice(on ? "\u5DF2\u6536\u85CF" : "\u5DF2\u53D6\u6D88\u6536\u85CF");
      this.render();
    };
    card.createDiv({ cls: "bagu-question", text: q.question });
    if (!this.revealed) {
      this.mountAnswerEditor(card);
    }
    if (!this.revealed) {
      const aiBtn = actions.createEl("button", {
        cls: "mod-cta",
        text: this.aiLoading ? "\u8BC4\u5206\u4E2D\u2026" : "Ollama \u8BC4\u5206"
      });
      aiBtn.disabled = !!this.aiLoading;
      aiBtn.onclick = () => this.runAiScore();
      const revealBtn = actions.createEl("button", {
        text: "\u63ED\u6653\u53C2\u8003\u7B54\u6848"
      });
      revealBtn.onclick = () => this.reveal();
    } else {
      await this.renderAnswerBlock(card, q);
      if (this.aiResult) this.renderAiPanel(card, this.aiResult);
      if (this.aiLoading) {
        actions.createDiv({
          cls: "bagu-hidden-hint",
          text: "\u6B63\u5728\u8C03\u7528\u672C\u5730 Ollama \u8BC4\u5206\uFF0C\u8BF7\u7A0D\u5019\u2026"
        });
      } else if (this.aiResult) {
        const commit = actions.createEl("button", {
          cls: "mod-cta",
          text: `\u786E\u8BA4 ${this.aiResult.score} \u5206\u5E76\u4E0B\u4E00\u9898`
        });
        commit.onclick = () => this.commitAiScore();
        const retry = actions.createEl("button", { text: "\u91CD\u65B0\u8BC4\u5206" });
        retry.onclick = () => this.runAiScore();
      } else {
        const aiBtn = actions.createEl("button", {
          cls: "mod-cta",
          text: "Ollama \u8BC4\u5206"
        });
        aiBtn.onclick = () => this.runAiScore();
      }
      if (this.plugin.settings.allowManualGrade && !this.aiLoading) {
        const grades = actions.createDiv({ cls: "bagu-grade-group" });
        const mk = (label, g, cta) => {
          const b = grades.createEl("button", {
            cls: cta ? "mod-cta" : "",
            text: label
          });
          b.onclick = () => this.grade(g);
        };
        mk("\u624B\u52A8\xB7\u4E0D\u4F1A", "again");
        mk("\u624B\u52A8\xB7\u6A21\u7CCA", "hard");
        mk("\u624B\u52A8\xB7\u4F1A\u4E86", "good");
        mk("\u624B\u52A8\xB7\u7B80\u5355", "easy");
      }
    }
    actions.createEl("button", { text: "\u8DF3\u8FC7" }).onclick = () => {
      if (this.current) this.pushCooldown(this.current.id);
      this.nextFromPlan();
      this.render();
    };
    actions.createEl("button", { text: "\u6253\u5F00\u539F\u6587" }).onclick = () => this.openSource();
  }
  renderAiPanel(card, result) {
    const box = card.createDiv({ cls: "bagu-ai-panel" });
    const scoreEl = box.createDiv({ cls: "bagu-ai-score" });
    scoreEl.setText(`${result.score} \u5206`);
    const band = result.score >= (this.plugin.settings.scoreThresholdGood ?? 90) ? "\u4F18\u79C0" : result.score >= (this.plugin.settings.scoreThresholdHard ?? 70) ? "\u826F\u597D" : result.score >= (this.plugin.settings.scoreThresholdAgain ?? 50) ? "\u52C9\u5F3A" : "\u9700\u52A0\u5F3A";
    box.createDiv({
      cls: "bagu-ai-band",
      text: `\u6863\u4F4D\uFF1A${band} \u2192 \u590D\u4E60\u6309\u300C${result.grade}\u300D\u8C03\u5EA6`
    });
    if (result.feedback) {
      box.createDiv({ cls: "bagu-ai-feedback", text: result.feedback });
    }
    if (result.hits && result.hits.length) {
      box.createDiv({
        cls: "bagu-tip",
        text: "\u547D\u4E2D\uFF1A" + result.hits.join("\uFF1B")
      });
    }
    if (result.missing && result.missing.length) {
      box.createDiv({
        cls: "bagu-tip",
        text: "\u7F3A\u6F0F\uFF1A" + result.missing.join("\uFF1B")
      });
    }
  }
  mountAnswerEditor(parent) {
    const wrap = parent.createDiv({ cls: "bagu-answer-editor" });
    const ta = wrap.createEl("textarea", { cls: "bagu-write-area" });
    ta.placeholder = "\u5199\u51FA\u53E3\u8FF0\u8981\u70B9 / \u5B8C\u6574\u7B54\u6848\u2026\uFF08Ctrl/Cmd+Enter \u8BC4\u5206\uFF1B\u53EF\u70B9\u9EA6\u514B\u98CE\u8BED\u97F3\u8F93\u5165\uFF09";
    ta.value = this.writeDraft || "";
    ta.addEventListener("input", () => this.writeDraft = ta.value);
    const row = wrap.createDiv({ cls: "bagu-asr-row" });
    const tip = row.createDiv({ cls: "bagu-tip bagu-asr-tip" });
    const provider = this.plugin.settings.asrProvider || "siliconflow";
    if (provider === "off" || provider === "none") {
      tip.setText("\u8BED\u97F3\u8F93\u5165\u672A\u542F\u7528\uFF08\u8BBE\u7F6E\u91CC\u63A8\u8350\u300C\u7845\u57FA\u6D41\u52A8\u300D\uFF09");
    } else if (!asrSupported()) {
      tip.setText("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u9EA6\u514B\u98CE");
    } else {
      const labels = {
        siliconflow: "\u8BED\u97F3\uFF1A\u7845\u57FA\u6D41\u52A8 SenseVoice \xB7 \u518D\u70B9\u7ED3\u675F\u5E76\u8F6C\u5199",
        groq: "\u8BED\u97F3\uFF1AGroq Whisper \xB7 \u518D\u70B9\u7ED3\u675F\u5E76\u8F6C\u5199",
        "openai-compatible": "\u8BED\u97F3\uFF1A\u81EA\u5B9A\u4E49/\u672C\u5730 Whisper \xB7 \u518D\u70B9\u7ED3\u675F\u5E76\u8F6C\u5199"
      };
      tip.setText(labels[provider] || "\u8BED\u97F3\u8F93\u5165 \xB7 \u518D\u70B9\u7ED3\u675F\u5E76\u8F6C\u5199");
    }
    const recording = this._recorder && this._recorder.isRecording();
    const mic = row.createEl("button", {
      cls: "bagu-mic-btn" + (recording ? " is-recording" : "") + (this._asrBusy ? " is-busy" : ""),
      text: this._asrBusy ? "\u8F6C\u5199\u4E2D\u2026" : recording ? "\u23F9 \u7ED3\u675F\u5F55\u97F3" : "\u{1F3A4} \u8BED\u97F3\u8F93\u5165",
      attr: {
        title: "\u514D\u8D39 ASR\uFF1A\u63A8\u8350\u7845\u57FA\u6D41\u52A8\uFF08\u56FD\u5185\uFF09\uFF1BGroq \u56FD\u5185\u5E38 Forbidden"
      }
    });
    mic.disabled = this._asrBusy || provider === "off" || provider === "none";
    mic.onclick = () => this.toggleAsr(ta);
    return ta;
  }
  async toggleAsr(textarea) {
    if (this._asrBusy) return;
    const s = this.plugin.settings;
    if ((s.asrProvider || "siliconflow") === "off") {
      new import_obsidian.Notice("\u8BF7\u5148\u5728\u8BBE\u7F6E\u542F\u7528\u8BED\u97F3\u8BC6\u522B\uFF08\u63A8\u8350\u7845\u57FA\u6D41\u52A8\uFF09");
      return;
    }
    if (!asrSupported()) {
      new import_obsidian.Notice("\u65E0\u6CD5\u8BBF\u95EE\u9EA6\u514B\u98CE\uFF0C\u8BF7\u5728\u7CFB\u7EDF\u8BBE\u7F6E\u91CC\u5141\u8BB8 Obsidian \u4F7F\u7528\u9EA6\u514B\u98CE");
      return;
    }
    if (this._recorder && this._recorder.isRecording()) {
      this._asrBusy = true;
      this.render();
      try {
        const blob = await this._recorder.stop();
        this._recorder = null;
        if (!blob) {
          new import_obsidian.Notice("\u6CA1\u6709\u5F55\u5230\u97F3\u9891");
          return;
        }
        new import_obsidian.Notice("\u6B63\u5728\u8F6C\u5199\u2026");
        const text = await transcribeBlob(blob, s);
        const mode = s.asrInsertMode || "append";
        if (mode === "replace" || !(this.writeDraft || "").trim()) {
          this.writeDraft = text;
        } else {
          const cur = (this.writeDraft || "").trimEnd();
          this.writeDraft = cur ? `${cur}
${text}` : text;
        }
        if (textarea && textarea.isConnected) {
          textarea.value = this.writeDraft;
        }
        new import_obsidian.Notice("\u8BED\u97F3\u5DF2\u5199\u5165\u7B54\u6848\u6846");
      } catch (e) {
        console.error(e);
        new import_obsidian.Notice(String(e && e.message || e));
      } finally {
        this._asrBusy = false;
        this.render();
      }
      return;
    }
    try {
      this._recorder = createRecorder();
      await this._recorder.start();
      new import_obsidian.Notice("\u5F00\u59CB\u5F55\u97F3\uFF0C\u518D\u8BF4\u4E00\u904D\u7B54\u6848\uFF0C\u7136\u540E\u70B9\u300C\u7ED3\u675F\u5F55\u97F3\u300D");
      this.render();
    } catch (e) {
      this._recorder = null;
      console.error(e);
      new import_obsidian.Notice(
        "\u65E0\u6CD5\u6253\u5F00\u9EA6\u514B\u98CE\uFF1A" + String(e && e.message || e) + "\uFF08macOS\uFF1A\u7CFB\u7EDF\u8BBE\u7F6E \u2192 \u9690\u79C1\u4E0E\u5B89\u5168\u6027 \u2192 \u9EA6\u514B\u98CE\uFF09"
      );
    }
  }
  async renderAnswerBlock(card, q) {
    const stack = card.createDiv({ cls: "bagu-compare-stack" });
    const myBox = stack.createDiv({ cls: "bagu-stack-block" });
    myBox.createDiv({ cls: "bagu-pane-title", text: "\u6211\u7684\u7B54\u6848" });
    if (!this.aiResult) {
      this.mountAnswerEditor(myBox);
    } else {
      myBox.createDiv({
        cls: "bagu-mine bagu-selectable",
        text: (this.writeDraft || "").trim() || "\uFF08\u672A\u586B\u5199\uFF09"
      });
    }
    const refBox = stack.createDiv({ cls: "bagu-stack-block" });
    const refTitle = refBox.createDiv({ cls: "bagu-pane-title-row" });
    refTitle.createDiv({ cls: "bagu-pane-title", text: "\u53C2\u8003\u7B54\u6848" });
    const copyBtn = refTitle.createEl("button", {
      cls: "bagu-copy-btn",
      text: "\u590D\u5236\u5168\u6587",
      attr: { title: "\u590D\u5236\u53C2\u8003\u7B54\u6848\u7EAF\u6587\u672C\u5230\u526A\u8D34\u677F" }
    });
    copyBtn.onclick = async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const text = q.answer || "";
      try {
        await navigator.clipboard.writeText(text);
        new import_obsidian.Notice("\u53C2\u8003\u7B54\u6848\u5DF2\u590D\u5236");
      } catch (_) {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        new import_obsidian.Notice("\u53C2\u8003\u7B54\u6848\u5DF2\u590D\u5236");
      }
    };
    const ans = refBox.createDiv({ cls: "bagu-answer bagu-selectable" });
    await this.renderMd(ans, q.answer || "_\uFF08\u65E0\u6B63\u6587\uFF09_", q.path);
  }
  openQuestion(id) {
    const card = this.plugin.db.getCardJoin(id);
    if (!card) {
      new import_obsidian.Notice("\u9898\u76EE\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u540C\u6B65\u7B14\u8BB0");
      return;
    }
    this.bankPicked.add(id);
    this.sessionMode = "pick";
    this.tab = "drill";
    this.current = card;
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null;
    this.aiLoading = false;
    this.render();
  }
  startPickedDrill() {
    if (!this.bankPicked.size) {
      new import_obsidian.Notice("\u8BF7\u5148\u52FE\u9009\u81F3\u5C11\u4E00\u9053\u9898");
      return;
    }
    this.sessionMode = "pick";
    this.tab = "drill";
    this.cooldown = [];
    this.nextFromPlan();
    this.render();
  }
  renderBank() {
    const el = this.bodyEl;
    el.empty();
    const filter = {
      module: this.bankModule || "",
      keyword: this.bankKeyword || "",
      state: this.bankState || "",
      favoriteOnly: !!this.bankFavOnly
    };
    const total = this.plugin.db.countQuestions(filter);
    const list = this.plugin.db.listQuestions({ ...filter, limit: 800 });
    el.createEl("h3", { text: `\u9898\u5E93 \xB7 ${total} \u9898` });
    el.createDiv({
      cls: "bagu-tip",
      text: "\u70B9\u9898\u76EE\u76F4\u63A5\u5237\uFF1B\u52FE\u9009\u540E\u53EF\u300C\u5237\u9009\u4E2D\u300D\u3002\u652F\u6301\u6309\u6A21\u5757 / \u5173\u952E\u8BCD / \u72B6\u6001\u7B5B\u9009\u3002"
    });
    const bar = el.createDiv({ cls: "bagu-toolbar bagu-bank-bar" });
    const search = bar.createEl("input", {
      cls: "bagu-bank-search",
      type: "search",
      attr: {
        placeholder: "\u641C\u7D22\u9898\u5E72 / \u8DEF\u5F84\u2026",
        value: this.bankKeyword || ""
      }
    });
    search.value = this.bankKeyword || "";
    search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.bankKeyword = search.value.trim();
        this.render();
      }
    });
    bar.createEl("button", { text: "\u641C\u7D22" }).onclick = () => {
      this.bankKeyword = search.value.trim();
      this.render();
    };
    bar.createEl("button", { text: "\u6E05\u7A7A\u7B5B\u9009" }).onclick = () => {
      this.bankModule = "";
      this.bankKeyword = "";
      this.bankState = "";
      this.bankFavOnly = false;
      this.render();
    };
    const stateSel = bar.createEl("select", { cls: "bagu-bank-select" });
    for (const [v, label] of [
      ["", "\u5168\u90E8\u72B6\u6001"],
      ["new", "\u65B0\u9898"],
      ["learning", "\u5B66\u4E60\u4E2D"],
      ["review", "\u590D\u4E60\u4E2D"],
      ["relearning", "\u91CD\u5B66"]
    ]) {
      const opt = stateSel.createEl("option", { text: label, attr: { value: v } });
      if (v === (this.bankState || "")) opt.selected = true;
    }
    stateSel.onchange = () => {
      this.bankState = stateSel.value;
      this.render();
    };
    const favChk = bar.createEl("label", { cls: "bagu-bank-check" });
    const favInput = favChk.createEl("input", { type: "checkbox" });
    favInput.checked = !!this.bankFavOnly;
    favChk.createSpan({ text: "\u4EC5\u6536\u85CF" });
    favInput.onchange = () => {
      this.bankFavOnly = favInput.checked;
      this.render();
    };
    const act = el.createDiv({ cls: "bagu-toolbar" });
    const pickN = this.bankPicked.size;
    act.createEl("button", {
      cls: "mod-cta bagu-bank-pick-btn",
      text: pickN ? `\u5237\u9009\u4E2D\uFF08${pickN}\uFF09` : "\u5237\u9009\u4E2D"
    }).onclick = () => this.startPickedDrill();
    act.createEl("button", { text: "\u5168\u9009\u5F53\u524D\u5217\u8868" }).onclick = () => {
      list.forEach((r) => this.bankPicked.add(r.id));
      new import_obsidian.Notice(`\u5DF2\u9009\u4E2D ${this.bankPicked.size} \u9898`);
      this.render();
    };
    act.createEl("button", { text: "\u6E05\u7A7A\u9009\u4E2D" }).onclick = () => {
      this.bankPicked.clear();
      this.render();
    };
    act.createEl("button", { text: "\u540C\u6B65\u7B14\u8BB0" }).onclick = () => this.syncFromNotes();
    el.createEl("h4", { text: "\u6A21\u5757\u7B5B\u9009" });
    const chips = el.createDiv({ cls: "bagu-modules" });
    const allChip = chips.createEl("button", {
      cls: "bagu-chip" + (!this.bankModule ? " is-on" : ""),
      text: "\u5168\u90E8"
    });
    allChip.onclick = () => {
      this.bankModule = "";
      this.render();
    };
    for (const m of this.modules) {
      const row = this.plugin.db.getModules().find((x) => x.module === m);
      const cnt = row ? row.cnt : 0;
      const chip = chips.createEl("button", {
        cls: "bagu-chip" + (this.bankModule === m ? " is-on" : ""),
        text: `${m} (${cnt})`
      });
      chip.onclick = () => {
        this.bankModule = this.bankModule === m ? "" : m;
        this.render();
      };
    }
    if (!list.length) {
      el.createDiv({
        cls: "bagu-empty",
        text: total === 0 && !this.bankKeyword && !this.bankModule ? "\u9898\u5E93\u4E3A\u7A7A\uFF0C\u8BF7\u5148\u70B9\u300C\u540C\u6B65\u7B14\u8BB0\u300D\u3002" : "\u5F53\u524D\u7B5B\u9009\u65E0\u7ED3\u679C\uFF0C\u8BD5\u8BD5\u6362\u6A21\u5757\u6216\u6E05\u7A7A\u7B5B\u9009\u3002"
      });
      return;
    }
    const table = el.createEl("table", { cls: "bagu-table bagu-table-click" });
    const head = table.createEl("tr");
    for (const h of ["\u9009", "\u6A21\u5757", "\u9898\u53F7", "\u9898\u76EE", "\u72B6\u6001", "\u95F4\u9694", "\u6536\u85CF"]) {
      head.createEl("th", { text: h });
    }
    for (const row of list) {
      const tr = table.createEl("tr");
      tr.addClass("bagu-row-click");
      if (this.bankPicked.has(row.id)) tr.addClass("is-picked");
      const tdCheck = tr.createEl("td");
      const cb = tdCheck.createEl("input", { type: "checkbox" });
      cb.checked = this.bankPicked.has(row.id);
      cb.onclick = (ev) => {
        ev.stopPropagation();
        if (cb.checked) this.bankPicked.add(row.id);
        else this.bankPicked.delete(row.id);
        tr.toggleClass("is-picked", cb.checked);
        const btn = el.querySelector(".bagu-bank-pick-btn");
        if (btn) {
          const n = this.bankPicked.size;
          btn.setText(n ? `\u5237\u9009\u4E2D\uFF08${n}\uFF09` : "\u5237\u9009\u4E2D");
        }
      };
      tr.createEl("td", { text: row.module || "-" });
      tr.createEl("td", { text: row.num != null ? `Q${row.num}` : "-" });
      tr.createEl("td", {
        text: (row.question || "").slice(0, 56),
        attr: { title: row.question || "" }
      });
      tr.createEl("td", { text: row.state || "-" });
      tr.createEl("td", {
        text: row.interval_days != null ? String(row.interval_days) : "-"
      });
      const tdFav = tr.createEl("td");
      const favBtn = tdFav.createEl("button", {
        cls: "bagu-fav-btn" + (row.favorite ? " is-on" : ""),
        text: row.favorite ? "\u2605" : "\u2606"
      });
      favBtn.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.plugin.db.toggleFavorite(row.id);
        this.render();
      };
      tr.onclick = () => this.openQuestion(row.id);
    }
    el.createDiv({
      cls: "bagu-tip",
      text: list.length < total ? `\u5F53\u524D\u5C55\u793A ${list.length} / ${total}\uFF08\u4E0A\u9650 800\uFF0C\u8BF7\u7528\u7B5B\u9009\u7F29\u5C0F\u8303\u56F4\uFF09` : `\u5171 ${total} \u9898`
    });
  }
  renderFavorites() {
    const el = this.bodyEl;
    el.empty();
    const n = this.plugin.db.countFavorites();
    el.createEl("h3", { text: `\u6536\u85CF\u5939 \xB7 ${n} \u9898` });
    el.createDiv({
      cls: "bagu-tip",
      text: "\u5237\u9898\u9875\u70B9\u300C\u2606 \u6536\u85CF\u300D\u3002\u70B9\u51FB\u9898\u76EE\u8FDB\u5165\u5237\u9898\uFF1B\u53EF\u4E00\u952E\u5F00\u59CB\u6536\u85CF\u590D\u4E60\u3002"
    });
    const bar = el.createDiv({ cls: "bagu-toolbar" });
    bar.createEl("button", { cls: "mod-cta", text: "\u5F00\u59CB\u6536\u85CF\u590D\u4E60" }).onclick = () => {
      this.sessionMode = "fav";
      this.tab = "drill";
      this.cooldown = [];
      this.nextFromPlan();
      this.render();
    };
    const list = this.plugin.db.listFavorites(300);
    if (!list.length) {
      el.createDiv({
        cls: "bagu-empty",
        text: "\u6682\u65E0\u6536\u85CF\u3002\u5728\u300C\u5F00\u59CB\u5237\u9898\u300D\u63ED\u6653\u524D/\u540E\u5747\u53EF\u70B9\u6536\u85CF\u3002"
      });
      return;
    }
    const table = el.createEl("table", { cls: "bagu-table bagu-table-click" });
    const head = table.createEl("tr");
    for (const h of ["\u6A21\u5757", "\u9898\u76EE", "\u72B6\u6001", "\u6536\u85CF\u65F6\u95F4", ""]) {
      head.createEl("th", { text: h });
    }
    for (const row of list) {
      const tr = table.createEl("tr");
      tr.addClass("bagu-row-click");
      tr.createEl("td", { text: row.module || "-" });
      tr.createEl("td", { text: (row.question || "").slice(0, 48) });
      tr.createEl("td", { text: row.state || "-" });
      tr.createEl("td", {
        text: row.favorited_at ? new Date(row.favorited_at).toLocaleString() : "-"
      });
      const tdAct = tr.createEl("td");
      const un = tdAct.createEl("button", {
        cls: "bagu-copy-btn",
        text: "\u53D6\u6D88"
      });
      un.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.plugin.db.setFavorite(row.id, false);
        new import_obsidian.Notice("\u5DF2\u53D6\u6D88\u6536\u85CF");
        this.render();
      };
      tr.onclick = () => {
        this.sessionMode = "fav";
        this.tab = "drill";
        this.current = this.plugin.db.getCardJoin(row.id);
        this.revealed = false;
        this.writeDraft = "";
        this.aiResult = null;
        this.render();
      };
    }
  }
  async renderMd(container, src, path) {
    try {
      if (typeof import_obsidian.MarkdownRenderer.render === "function") {
        await import_obsidian.MarkdownRenderer.render(
          this.app,
          src,
          container,
          path,
          this.plugin
        );
      } else {
        await import_obsidian.MarkdownRenderer.renderMarkdown(src, container, path, this.plugin);
      }
    } catch (e) {
      container.createEl("pre", { text: src });
    }
  }
  reveal() {
    this.revealed = true;
    this.render();
  }
  pushCooldown(id) {
    this.cooldown.push(id);
    const max = this.plugin.settings.cooldownSize || 12;
    while (this.cooldown.length > max) this.cooldown.shift();
  }
  async runAiScore() {
    if (!this.current || this.aiLoading) return;
    const answer = (this.writeDraft || "").trim();
    if (!answer) {
      new import_obsidian.Notice("\u8BF7\u5148\u5199\u4E0B\u4F60\u7684\u7B54\u6848\uFF0C\u518D\u8C03\u7528 Ollama \u8BC4\u5206");
      return;
    }
    this.aiLoading = true;
    this.aiResult = null;
    if (!this.revealed) this.revealed = true;
    this.render();
    try {
      const s = this.plugin.settings;
      const result = await scoreWithOllama({
        baseUrl: s.ollamaBaseUrl,
        model: s.ollamaModel || "minimax-m3:cloud",
        question: this.current.question,
        reference: this.current.answer,
        userAnswer: answer,
        timeoutMs: s.ollamaTimeoutMs || 12e4
      });
      const grade = scheduleFromScore(
        this.plugin.db.getCard(this.current.id) || this.current,
        result.score,
        s
      ).grade;
      this.aiResult = { ...result, grade };
      new import_obsidian.Notice(`Ollama \u8BC4\u5206\uFF1A${result.score} \u5206`);
    } catch (e) {
      console.error(e);
      new import_obsidian.Notice(
        `Ollama \u8BC4\u5206\u5931\u8D25\uFF1A${e.message || e}\uFF08\u8BF7\u786E\u8BA4 ollama serve \u4E14\u5DF2\u62C9\u53D6\u6A21\u578B\uFF09`
      );
    } finally {
      this.aiLoading = false;
      this.render();
    }
  }
  async commitAiScore() {
    if (!this.current || !this.aiResult) return;
    const id = this.current.id;
    const card = this.plugin.db.getCard(id) || this.current;
    const packed = scheduleFromScore(
      card,
      this.aiResult.score,
      this.plugin.settings
    );
    await this.plugin.db.updateCard(id, packed);
    await this.plugin.db.addLog({
      card_id: id,
      grade: packed.grade,
      reviewed_at: Date.now(),
      scheduled_days: packed.interval_days,
      mode: this.sessionMode === "quiz" ? "quiz:ollama" : "specialty:ollama",
      plan_date: todayKey(),
      score: this.aiResult.score,
      feedback: this.aiResult.feedback,
      user_answer: this.writeDraft || ""
    });
    if (this.sessionMode === "quiz") {
      await this.plugin.db.markQuizDone(
        todayKey(),
        id,
        this.aiResult.score
      );
    } else {
      await this.plugin.db.markSpecialtyDone(todayKey(), id);
    }
    this.plan = this.plugin.db.getPlan(todayKey());
    this.pushCooldown(id);
    this.nextFromPlan();
    this.render();
  }
  async grade(level) {
    if (!this.current || !this.revealed) return;
    const id = this.current.id;
    const card = this.plugin.db.getCard(id) || this.current;
    const next = scheduleCard(card, level, this.plugin.settings);
    await this.plugin.db.updateCard(id, next);
    await this.plugin.db.addLog({
      card_id: id,
      grade: level,
      reviewed_at: Date.now(),
      scheduled_days: next.interval_days,
      mode: (this.sessionMode === "quiz" ? "quiz" : "specialty") + ":manual",
      plan_date: todayKey(),
      score: null,
      feedback: null,
      user_answer: this.writeDraft || ""
    });
    if (this.sessionMode === "quiz") {
      const approx = level === "easy" ? 95 : level === "good" ? 80 : level === "hard" ? 60 : 30;
      await this.plugin.db.markQuizDone(todayKey(), id, approx);
    } else {
      await this.plugin.db.markSpecialtyDone(todayKey(), id);
    }
    this.plan = this.plugin.db.getPlan(todayKey());
    this.pushCooldown(id);
    this.nextFromPlan();
    this.render();
  }
  async openSource() {
    if (!this.current) return;
    const path = this.current.path;
    try {
      await this.app.workspace.openLinkText(
        `${path}#Q${this.current.num}`,
        path,
        false
      );
    } catch (e) {
      await this.app.workspace.openLinkText(path, "", false);
    }
  }
  renderStats() {
    const el = this.bodyEl;
    el.empty();
    const ov = this.plugin.db.statsOverview();
    const grid = el.createDiv({ cls: "bagu-stat-grid" });
    const cell = (k, v) => {
      const c = grid.createDiv({ cls: "bagu-stat-cell" });
      c.createDiv({ cls: "bagu-stat-v", text: String(v) });
      c.createDiv({ cls: "bagu-stat-k", text: k });
    };
    cell("\u9898\u5E93", ov.total);
    cell("\u65B0\u9898", ov.newCount);
    cell("\u5230\u671F", ov.dueCount);
    cell("\u4ECA\u65E5\u590D\u4E60", ov.todayReviews);
    cell("\u8FDE\u7EED\u5929\u6570", ov.streak);
    const charts = el.createDiv({ cls: "bagu-charts" });
    const heat = charts.createDiv({ cls: "bagu-chart-block" });
    renderHeatmapSvg(heat, this.plugin.db.dailyReviewCounts(130), 16);
    const curve = charts.createDiv({ cls: "bagu-chart-block" });
    renderEbbinghausSvg(
      curve,
      this.plugin.settings.ebbinghausSteps || EBBINGHAUS_DEFAULT
    );
    el.createEl("h3", { text: "\u5206\u6A21\u5757\u638C\u63E1" });
    const table = el.createEl("table", { cls: "bagu-table" });
    const head = table.createEl("tr");
    for (const h of ["\u6A21\u5757", "\u603B\u91CF", "\u65B0\u9898", "\u5230\u671F", "\u5747\u6B21\u6570"]) {
      head.createEl("th", { text: h });
    }
    for (const m of ov.modules) {
      const tr = table.createEl("tr");
      tr.createEl("td", { text: m.module });
      tr.createEl("td", { text: String(m.total) });
      tr.createEl("td", { text: String(m.new_cnt) });
      tr.createEl("td", { text: String(m.due_cnt) });
      tr.createEl("td", {
        text: m.avg_reps != null ? Number(m.avg_reps).toFixed(1) : "-"
      });
    }
  }
  renderHistory() {
    const el = this.bodyEl;
    el.empty();
    el.createEl("h3", { text: "\u6700\u8FD1\u590D\u4E60\u8BB0\u5F55" });
    el.createDiv({
      cls: "bagu-tip",
      text: "\u70B9\u51FB\u67D0\u4E00\u884C\u67E5\u770B\u4F5C\u7B54\u3001\u8BC4\u8BED\u4E0E\u53C2\u8003\u7B54\u6848\u8BE6\u60C5\u3002"
    });
    const logs = this.plugin.db.recentLogs(80);
    if (!logs.length) {
      el.createDiv({ cls: "bagu-empty", text: "\u6682\u65E0\u8BB0\u5F55\uFF0C\u53BB\u5237\u51E0\u9053\u9898\u5427\u3002" });
      return;
    }
    const table = el.createEl("table", { cls: "bagu-table bagu-table-click" });
    const head = table.createEl("tr");
    for (const h of ["\u65F6\u95F4", "\u6A21\u5757", "\u9898\u76EE", "\u5206\u6570", "\u6863\u4F4D", "\u95F4\u9694"]) {
      head.createEl("th", { text: h });
    }
    for (const l of logs) {
      const tr = table.createEl("tr");
      tr.addClass("bagu-row-click");
      tr.onclick = () => {
        const full = this.plugin.db.getLog(l.id) || l;
        new LogDetailModal(this.app, full).open();
      };
      const t = new Date(l.reviewed_at).toLocaleString();
      tr.createEl("td", { text: t });
      tr.createEl("td", { text: l.module || "-" });
      tr.createEl("td", {
        text: (l.question || l.card_id || "").slice(0, 36)
      });
      tr.createEl("td", {
        text: l.score != null ? String(l.score) : "-"
      });
      tr.createEl("td", { text: l.grade || "" });
      tr.createEl("td", {
        text: l.scheduled_days != null ? String(l.scheduled_days) : ""
      });
    }
  }
};
var BaguSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u79CB\u62DB\u516B\u80A1\u590D\u4E60 \xB7 \u8BBE\u7F6E" });
    containerEl.createEl("h3", { text: "Ollama \u8BC4\u5206" });
    new import_obsidian.Setting(containerEl).setName("Ollama Base URL").setDesc("\u672C\u5730\u9ED8\u8BA4 http://127.0.0.1:11434").addText(
      (t) => t.setValue(this.plugin.settings.ollamaBaseUrl || "http://127.0.0.1:11434").onChange(async (v) => {
        this.plugin.settings.ollamaBaseUrl = v.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u6A21\u578B\u540D").setDesc("\u4F8B\u5982 minimax-m3:cloud").addText(
      (t) => t.setValue(this.plugin.settings.ollamaModel || "minimax-m3:cloud").onChange(async (v) => {
        this.plugin.settings.ollamaModel = v.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u8BC4\u5206\u8D85\u65F6\uFF08\u6BEB\u79D2\uFF09").addText(
      (t) => t.setValue(String(this.plugin.settings.ollamaTimeoutMs || 12e4)).onChange(async (v) => {
        const n = parseInt(v, 10);
        if (!Number.isNaN(n) && n > 0) {
          this.plugin.settings.ollamaTimeoutMs = n;
          await this.plugin.saveSettings();
        }
      })
    );
    containerEl.createEl("h3", { text: "\u8BED\u97F3\u8F93\u5165\uFF08\u514D\u8D39 ASR\uFF09" });
    containerEl.createDiv({
      cls: "setting-item-description",
      text: "\u672C\u5730\u63A8\u8350\uFF1A\u5728\u7EC8\u7AEF\u8FD0\u884C\u63D2\u4EF6\u76EE\u5F55 asr-server/start.sh\uFF08faster-whisper\uFF09\u3002Groq \u56FD\u5185\u5E38 Forbidden\uFF1B\u7845\u57FA\u6D41\u52A8\u4E5F\u53EF\u3002"
    });
    new import_obsidian.Setting(containerEl).setName("ASR \u63D0\u4F9B\u65B9").setDesc("\u672C\u5730\u9009\u300C\u81EA\u5B9A\u4E49/\u672C\u5730 Whisper\u300D\uFF1B\u9700\u5148 ./start.sh \u8D77\u670D\u52A1").addDropdown(
      (d) => d.addOption("openai-compatible", "\u81EA\u5B9A\u4E49 / \u672C\u5730 Whisper\uFF08\u63A8\u8350\u672C\u673A\uFF09").addOption("siliconflow", "\u7845\u57FA\u6D41\u52A8 SenseVoice\uFF08\u4E91\u7AEF\u514D\u8D39\u989D\u5EA6\uFF09").addOption("groq", "Groq Whisper\uFF08\u6D77\u5916\uFF09").addOption("off", "\u5173\u95ED").setValue(this.plugin.settings.asrProvider || "openai-compatible").onChange(async (v) => {
        this.plugin.settings.asrProvider = v;
        const preset = ASR_PRESETS[v];
        if (preset) {
          this.plugin.settings.asrBaseUrl = preset.baseUrl;
          this.plugin.settings.asrModel = preset.model;
        }
        await this.plugin.saveSettings();
        this.display();
      })
    );
    new import_obsidian.Setting(containerEl).setName("ASR API Key").setDesc("\u672C\u5730\u7559\u7A7A\u3002\u7845\u57FA/Groq \u624D\u9700\u8981 Key\u3002").addText((t) => {
      t.inputEl.type = "password";
      t.inputEl.autocomplete = "off";
      t.setPlaceholder("\u672C\u5730\u53EF\u7A7A").setValue(this.plugin.settings.asrApiKey || "").onChange(async (v) => {
        this.plugin.settings.asrApiKey = v.trim();
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("ASR Base URL").setDesc("\u672C\u5730\u9ED8\u8BA4 http://127.0.0.1:9000").addText(
      (t) => t.setValue(
        this.plugin.settings.asrBaseUrl || "http://127.0.0.1:9000"
      ).onChange(async (v) => {
        this.plugin.settings.asrBaseUrl = v.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("ASR \u6A21\u578B").setDesc("\u672C\u5730\uFF1Atiny/base/small/medium\uFF08\u4E0E start.sh \u7684 WHISPER_MODEL \u4E00\u81F4\u66F4\u6E05\u6670\uFF09").addText(
      (t) => t.setValue(this.plugin.settings.asrModel || "small").onChange(async (v) => {
        this.plugin.settings.asrModel = v.trim();
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u8BC6\u522B\u8BED\u8A00").setDesc("zh / en / auto").addText(
      (t) => t.setValue(this.plugin.settings.asrLang || "zh").onChange(async (v) => {
        this.plugin.settings.asrLang = v.trim() || "zh";
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5199\u5165\u65B9\u5F0F").addDropdown(
      (d) => d.addOption("append", "\u8FFD\u52A0\u5230\u5DF2\u6709\u5185\u5BB9").addOption("replace", "\u8986\u76D6\u8349\u7A3F").setValue(this.plugin.settings.asrInsertMode || "append").onChange(async (v) => {
        this.plugin.settings.asrInsertMode = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5206\u6570\u6863\u4F4D\uFF1A\u4E0D\u53CA\u683C <").setDesc("\u4F4E\u4E8E\u6B64\u5206 \u2192 \u4E0D\u4F1A\uFF08\u5F53\u5929\u518D\u7EC3\uFF09").addSlider(
      (s) => s.setLimits(0, 100, 1).setValue(this.plugin.settings.scoreThresholdAgain ?? 50).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.scoreThresholdAgain = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5206\u6570\u6863\u4F4D\uFF1A\u6A21\u7CCA <").setDesc("\u4F4E\u4E8E\u6B64\u5206\u4E14 \u2265 \u4E0D\u53CA\u683C\u7EBF \u2192 \u6A21\u7CCA").addSlider(
      (s) => s.setLimits(0, 100, 1).setValue(this.plugin.settings.scoreThresholdHard ?? 70).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.scoreThresholdHard = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5206\u6570\u6863\u4F4D\uFF1A\u4F1A\u4E86 <").setDesc("\u4F4E\u4E8E\u6B64\u5206\u4E14 \u2265 \u6A21\u7CCA\u7EBF \u2192 \u4F1A\u4E86\uFF1B\u5426\u5219\u7B80\u5355").addSlider(
      (s) => s.setLimits(0, 100, 1).setValue(this.plugin.settings.scoreThresholdGood ?? 90).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.scoreThresholdGood = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5141\u8BB8\u624B\u52A8\u6863\u4F4D\u8BC4\u5206").setDesc("Ollama \u4E0D\u53EF\u7528\u65F6\u7684\u515C\u5E95").addToggle(
      (t) => t.setValue(this.plugin.settings.allowManualGrade !== false).onChange(async (v) => {
        this.plugin.settings.allowManualGrade = v;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "\u9898\u5E93\u4E0E\u8BA1\u5212" });
    new import_obsidian.Setting(containerEl).setName("\u9898\u5E93\u6839\u76EE\u5F55").setDesc("\u53EA\u626B\u63CF\u8BE5\u6587\u4EF6\u5939\u4E0B\u7684 Markdown\uFF08\u76F8\u5BF9\u5E93\u6839\uFF0C\u4F8B\u5982\u300C\u516B\u80A1\u300D\uFF09\u3002\u7A7A=\u626B\u63CF\u6574\u4E2A\u5E93\u3002").addText(
      (t) => t.setPlaceholder("\u516B\u80A1").setValue(this.plugin.settings.questionsRoot || "").onChange(async (v) => {
        this.plugin.settings.questionsRoot = v.trim().replace(/^\/+|\/+$/g, "");
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u6392\u9664\u6587\u4EF6\u540D\u5305\u542B").addText(
      (t) => t.setValue((this.plugin.settings.excludePatterns || []).join(", ")).onChange(async (v) => {
        this.plugin.settings.excludePatterns = v.split(/[,，]/).map((s) => s.trim()).filter(Boolean);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u8C03\u5EA6\u7B97\u6CD5").setDesc("SM-2 \u81EA\u9002\u5E94\uFF1B\u827E\u5BBE\u6D69\u65AF\u4E3A\u56FA\u5B9A 1/2/4/7/15/30/60 \u5929\u9636\u68AF\u3002").addDropdown(
      (d) => d.addOption("sm2", "SM-2").addOption("ebbinghaus", "\u827E\u5BBE\u6D69\u65AF\u9636\u68AF").setValue(this.plugin.settings.scheduler || "sm2").onChange(async (v) => {
        this.plugin.settings.scheduler = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u62F7\u95EE\u62BD\u9898\u6570\u91CF").setDesc("\u4EFB\u52A1\u4E8C\uFF1A\u5728\u9650\u5B9A\u8303\u56F4\u5185\u968F\u673A\u62BD\u53D6\u7684\u9898\u76EE\u6570\uFF08\u9ED8\u8BA4 15\uFF09").addSlider(
      (s) => s.setLimits(5, 40, 1).setValue(this.plugin.settings.quizCount ?? 15).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.quizCount = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u62F7\u95EE\u53CA\u683C\u5206\uFF08\u51C6\u786E\u7387\uFF09").setDesc("\u8FBE\u5230\u8BE5\u5206\u53CA\u4EE5\u4E0A\u8BA1\u4E3A\u7B54\u5BF9").addSlider(
      (s) => s.setLimits(50, 95, 5).setValue(this.plugin.settings.quizPassScore ?? 70).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.quizPassScore = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u6253\u5F00\u5E93\u65F6\u63D0\u9192\u672A\u5B8C\u6210\u6BCF\u65E5\u8BA1\u5212").addToggle(
      (t) => t.setValue(this.plugin.settings.remindOnOpen !== false).onChange(async (v) => {
        this.plugin.settings.remindOnOpen = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u9ED8\u5199\u5FC5\u987B\u975E\u7A7A\u624D\u80FD\u8BC4\u5206").addToggle(
      (t) => t.setValue(!!this.plugin.settings.writeRequireText).onChange(async (v) => {
        this.plugin.settings.writeRequireText = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u968F\u673A\u51B7\u5374\u9898\u6570").addSlider(
      (s) => s.setLimits(3, 40, 1).setValue(this.plugin.settings.cooldownSize || 12).setDynamicTooltip().onChange(async (v) => {
        this.plugin.settings.cooldownSize = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u827E\u5BBE\u6D69\u65AF\u9636\u68AF\uFF08\u5929\uFF0C\u9017\u53F7\u5206\u9694\uFF09").addText(
      (t) => t.setValue(
        (this.plugin.settings.ebbinghausSteps || EBBINGHAUS_DEFAULT).join(
          ","
        )
      ).onChange(async (v) => {
        this.plugin.settings.ebbinghausSteps = v.split(/[,，]/).map((x) => parseInt(x.trim(), 10)).filter((n) => !Number.isNaN(n) && n >= 0);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("SQLite \u8DEF\u5F84").setDesc("\u6570\u636E\u6587\u4EF6\u76F8\u5BF9\u5E93\u6839\uFF1A.bagu/qiuzhao-bagu.db\uFF08\u53EF\u968F\u5E93\u5907\u4EFD\uFF09").addButton(
      (b) => b.setButtonText("\u7ACB\u5373\u843D\u76D8").onClick(async () => {
        await this.plugin.db.persist(true);
        new import_obsidian.Notice("\u5DF2\u4FDD\u5B58 SQLite");
      })
    );
  }
};

// src/main.js
var CetideBaguPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    const raw = await this.loadData() || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, raw.settings || {});
    this.db = new BaguDb(this.app, this.manifest.dir);
    this._dbReady = null;
    this.registerView(VIEW_TYPE_BAGU, (leaf) => new BaguView(leaf, this));
    this.addRibbonIcon(
      "calendar-check",
      "\u79CB\u62DB\u516B\u80A1\u590D\u4E60",
      () => this.activateView()
    );
    this.addCommand({
      id: "open-bagu",
      name: "\u6253\u5F00\u79CB\u62DB\u516B\u80A1\u590D\u4E60",
      callback: () => this.activateView()
    });
    this.addCommand({
      id: "refresh-bagu-index",
      name: "\u540C\u6B65\u516B\u80A1\u9898\u76EE\u5230 SQLite",
      callback: async () => {
        await this.ensureDb();
        await this.syncIndex(true);
      }
    });
    this.addCommand({
      id: "regen-daily-plan",
      name: "\u91CD\u65B0\u751F\u6210\u4ECA\u65E5\u516B\u80A1\u8BA1\u5212",
      callback: async () => {
        await this.ensureDb();
        await this.syncIndex(false);
        this.db.db.run(`DELETE FROM daily_plans WHERE plan_date = ?`, [
          todayKey()
        ]);
        const mods = new Set(
          (this.settings.preferredModules || []).length ? this.settings.preferredModules : this.db.getModules().map((m) => m.module)
        );
        const qmods = new Set(
          (this.settings.quizModules || []).length ? this.settings.quizModules : this.db.getModules().map((m) => m.module)
        );
        const plan = ensureDailyPlan(this.db, this.settings, mods, qmods);
        new import_obsidian2.Notice(
          `\u4E13\u9898\u300C${plan.focus_module}\u300D${plan.specialty_ids.length} \u9898 \xB7 \u62F7\u95EE ${plan.quiz_ids.length} \u9898`
        );
      }
    });
    this.addSettingTab(new BaguSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(async () => {
      try {
        await this.ensureDb();
        await this.syncIndex(false);
        if (this.settings.remindOnOpen === false) return;
        const mods = new Set(
          (this.settings.preferredModules || []).length ? this.settings.preferredModules : this.db.getModules().map((m) => m.module)
        );
        const qmods = new Set(
          (this.settings.quizModules || []).length ? this.settings.quizModules : this.db.getModules().map((m) => m.module)
        );
        const plan = ensureDailyPlan(this.db, this.settings, mods, qmods);
        const tasks = planTaskStatus(plan, this.settings);
        const leftSpec = planQueue(plan, "specialty").length;
        const leftQuiz = planQueue(plan, "quiz").length;
        if (leftSpec > 0 || leftQuiz > 0) {
          new import_obsidian2.Notice(
            `\u79CB\u62DB\u516B\u80A1\uFF1A\u4E13\u9898\u5269 ${leftSpec} \xB7 \u62F7\u95EE\u5269 ${leftQuiz}${tasks.accuracy != null ? ` \xB7 \u51C6\u786E\u7387 ${tasks.accuracy}%` : ""}`,
            6e3
          );
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
  async onunload() {
    if (this.db) await this.db.persist(true);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_BAGU);
  }
  ensureDb() {
    if (!this._dbReady) {
      this._dbReady = this.db.init();
    }
    return this._dbReady;
  }
  async saveSettings() {
    await this.saveData({ settings: this.settings });
  }
  async syncIndex(notice) {
    await this.ensureDb();
    const files = this.app.vault.getMarkdownFiles();
    const exclude = this.settings.excludePatterns || [];
    const root = String(this.settings.questionsRoot || "\u516B\u80A1").replace(/^\/+|\/+$/g, "");
    const all = [];
    for (const f of files) {
      if (f.path.startsWith(".obsidian/") || f.path.startsWith(".bagu/"))
        continue;
      if (root) {
        const prefix = root + "/";
        if (f.path !== root && !f.path.startsWith(prefix)) continue;
      }
      try {
        const content = await this.app.vault.read(f);
        all.push(
          ...parseQuestionsFromMarkdown(f.path, content, exclude, root)
        );
      } catch (_) {
      }
    }
    await this.db.upsertQuestions(all);
    await this.db.persist(true);
    if (notice) {
      new import_obsidian2.Notice(
        root ? `\u5DF2\u4ECE\u300C${root}\u300D\u540C\u6B65 ${all.length} \u9898\u5230 SQLite` : `\u5DF2\u540C\u6B65 ${all.length} \u9898\u5230 SQLite`
      );
    }
    return all.length;
  }
  async activateView() {
    await this.ensureDb();
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_BAGU)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_BAGU, active: true });
    }
    workspace.revealLeaf(leaf);
  }
};
if(module.exports.default) module.exports = module.exports.default;
