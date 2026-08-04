import esbuild from "esbuild";
import process from "process";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "main.js",
  format: "cjs",
  platform: "browser",
  target: "es2020",
  external: ["obsidian", "electron"],
  logLevel: "info",
  sourcemap: false,
  treeShaking: true,
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
  console.log("build ok → main.js");
}
