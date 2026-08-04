import { countText, isMarkdownPath, shouldIgnore, topFolder } from "./util.js";

/**
 * Full-vault markdown scan → snapshot + fileChars.
 * @param {import('obsidian').App} app
 * @param {string[]} ignorePrefixes
 */
export async function scanVault (app, ignorePrefixes = []) {
  const files = app.vault.getMarkdownFiles();
  const fileChars = {};
  const byFolder = {};
  let docs = 0;
  let chars = 0;
  let words = 0;

  for (const file of files) {
    const path = file.path;
    if (!isMarkdownPath(path) || shouldIgnore(path, ignorePrefixes)) continue;
    let text = "";
    try {
      text = await app.vault.cachedRead(file);
    } catch {
      continue;
    }
    const c = countText(text);
    fileChars[path] = c.chars;
    docs++;
    chars += c.chars;
    words += c.words;
    const folder = topFolder(path);
    if (!byFolder[folder]) byFolder[folder] = { docs: 0, chars: 0 };
    byFolder[folder].docs++;
    byFolder[folder].chars += c.chars;
  }

  return {
    snapshot: {
      docs,
      chars,
      words,
      scannedAt: new Date().toISOString(),
      byFolder,
    },
    fileChars,
  };
}

/**
 * Recount a single file; returns chars or 0 if missing/ignored.
 */
export async function recountFile (app, path, ignorePrefixes = []) {
  if (!isMarkdownPath(path) || shouldIgnore(path, ignorePrefixes)) return null;
  const file = app.vault.getAbstractFileByPath(path);
  if (!file || !("extension" in file)) return null;
  try {
    const text = await app.vault.cachedRead(file);
    return countText(text).chars;
  } catch {
    return null;
  }
}
