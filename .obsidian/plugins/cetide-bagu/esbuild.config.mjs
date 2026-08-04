import esbuild from "esbuild";
import process from "process";
import fs from "fs";
import path from "path";

const watch = process.argv.includes("--watch");

/** Stub node builtins referenced by sql-asm (never used in browser path). */
const stubNode = {
  name: "stub-node-builtins",
  setup(build) {
    build.onResolve({ filter: /^node:/ }, (args) => ({
      path: args.path,
      namespace: "node-stub",
    }));
    build.onLoad({ filter: /.*/, namespace: "node-stub" }, () => ({
      contents: "module.exports = {};",
      loader: "js",
    }));
  },
};

const ctx = await esbuild.context({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "main.js",
  format: "cjs",
  platform: "browser",
  target: "es2020",
  external: ["obsidian"],
  logLevel: "info",
  sourcemap: false,
  treeShaking: true,
  plugins: [stubNode],
  define: {
    "process.argv": "[]",
  },
  footer: {
    js: "if(module.exports.default) module.exports = module.exports.default;",
  },
});

if (watch) {
  await ctx.watch();
  console.log("watching…");
} else {
  await ctx.rebuild();
  await ctx.dispose();
  // keep wasm available for future switch; asm build is self-contained
  const wasmSrc = path.join("node_modules", "sql.js", "dist", "sql-wasm.wasm");
  if (fs.existsSync(wasmSrc)) {
    fs.copyFileSync(wasmSrc, "sql-wasm.wasm");
  }
  console.log("build ok → main.js");
}
