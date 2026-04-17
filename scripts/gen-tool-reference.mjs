#!/usr/bin/env node
/**
 * Generate docs/tool-reference.md from tool source files.
 *
 * Extracts every tool's name, description, slim membership, and extension
 * requirement. Groups by category (LSP, Git, GitHub, Terminal, Editor, Debug,
 * Other). Writes a stable, alphabetized markdown table.
 *
 * Usage:
 *   node scripts/gen-tool-reference.mjs          # write docs/tool-reference.md
 *   node scripts/gen-tool-reference.mjs --check  # exit 1 if committed file is stale
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const toolsDir = path.join(root, "src", "tools");
const outPath = path.join(root, "docs", "tool-reference.md");

const EXPLICIT_CATEGORY = {
  runInTerminal: "Terminal",
  getTerminalOutput: "Terminal",
  createTerminal: "Terminal",
  disposeTerminal: "Terminal",
  listTerminals: "Terminal",
  sendTerminalCommand: "Terminal",
  waitForTerminalOutput: "Terminal",
  openFile: "Editor",
  editText: "Editor",
  saveDocument: "Editor",
  formatDocument: "Editor",
  formatRange: "Editor",
  formatAndSave: "Editor",
  searchAndReplace: "Editor",
  createFile: "Editor",
  deleteFile: "Editor",
  renameFile: "Editor",
  replaceBlock: "Editor",
  organizeImports: "Editor",
  fixAllLintErrors: "Editor",
  openDiff: "Editor",
  closeTab: "Editor",
  closeAllDiffTabs: "Editor",
  getBufferContent: "Editor",
  getOpenEditors: "Editor",
  getCurrentSelection: "Editor",
  getLatestSelection: "Editor",
  setEditorDecorations: "Editor",
  clearEditorDecorations: "Editor",
};

function categorize(name) {
  if (EXPLICIT_CATEGORY[name]) return EXPLICIT_CATEGORY[name];
  if (name.startsWith("github")) return "GitHub";
  if (name.startsWith("git") || /Git/.test(name)) return "Git";
  if (name.startsWith("debug") || /Debug/.test(name)) return "Debug";
  if (
    /^(goTo|findReferences|findImplementations|batchGoToDefinition|batchFindImplementations|batchGetHover|getHover|getCallHierarchy|getTypeHierarchy|getDocumentSymbols|searchWorkspaceSymbols|navigateToSymbolByName|explainSymbol|getInlayHints|signatureHelp|prepareRename|renameSymbol|getSemanticTokens|foldingRanges|selectionRanges|getCodeActions|getCodeLens|getDiagnostics|getImportedSignatures|getImportTree|getTypeSignature|getDocumentLinks|previewCodeAction|applyCodeAction|jumpToFirstError|explainDiagnostic)/.test(
      name,
    )
  )
    return "LSP";
  return "Other";
}

function extractStringSet(src, varName) {
  const re = new RegExp(
    `${varName}\\s*=\\s*new Set[^(]*\\(\\s*\\[([\\s\\S]*?)\\]\\s*\\)`,
  );
  const m = src.match(re);
  if (!m) return new Set();
  return new Set([...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
}

function extractSchemaBlocks(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const schemaIdx = src.indexOf("schema: {", i);
    if (schemaIdx === -1) break;
    let depth = 0;
    let blockStart = -1;
    for (let j = schemaIdx + 8; j < src.length; j++) {
      if (src[j] === "{") {
        depth++;
        if (depth === 1) blockStart = j;
      } else if (src[j] === "}") {
        if (depth === 1) {
          const block = src.slice(blockStart, j + 1);
          const nameMatch = block.match(/\bname:\s*"([a-zA-Z][a-zA-Z0-9_]+)"/);
          if (nameMatch) {
            // Extract description (handles double-quoted, single-quoted,
            // and concatenated string literals spanning multiple lines).
            let description = "";
            const descMatch = block.match(
              /\bdescription:\s*((?:(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\+?\s*)+)/,
            );
            if (descMatch) {
              const literals = [
                ...descMatch[1].matchAll(
                  /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g,
                ),
              ];
              description = literals
                .map((m) =>
                  (m[1] ?? m[2] ?? "")
                    .replace(/\\n/g, " ")
                    .replace(/\\"/g, '"')
                    .replace(/\\'/g, "'"),
                )
                .join("")
                .trim();
            }
            const extensionRequired = /extensionRequired:\s*true\b/.test(block);
            out.push({
              name: nameMatch[1],
              description,
              extensionRequired,
            });
          }
          break;
        }
        depth--;
      }
    }
    i = schemaIdx + 9;
  }
  return out;
}

// ── collect ──────────────────────────────────────────────────────────────────

function collectTools(dir) {
  const results = [];
  const files = readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    if (f.isDirectory()) {
      results.push(...collectTools(path.join(dir, f.name)));
      continue;
    }
    if (!f.name.endsWith(".ts") || f.name.endsWith(".d.ts")) continue;
    if (f.name.includes("__tests__")) continue;
    const full = path.join(dir, f.name);
    if (full.includes("__tests__")) continue;
    const src = readFileSync(full, "utf8");
    const entries = extractSchemaBlocks(src);
    for (const e of entries) {
      results.push({ ...e, file: path.relative(root, full) });
    }
  }
  return results;
}

const indexSrc = readFileSync(path.join(toolsDir, "index.ts"), "utf8");
const slimNames = extractStringSet(indexSrc, "SLIM_TOOL_NAMES");

const tools = collectTools(toolsDir);
for (const t of tools) {
  t.category = categorize(t.name);
  t.slim = slimNames.has(t.name);
}
tools.sort((a, b) => a.name.localeCompare(b.name));

// ── render ───────────────────────────────────────────────────────────────────

const byCategory = {};
for (const t of tools) {
  (byCategory[t.category] ??= []).push(t);
}

const CATEGORY_ORDER = [
  "LSP",
  "Git",
  "GitHub",
  "Editor",
  "Terminal",
  "Debug",
  "Other",
];

const lines = [];
lines.push("# Tool Reference");
lines.push("");
lines.push(
  "Auto-generated from tool source schemas by `scripts/gen-tool-reference.mjs`. Do not edit by hand.",
);
lines.push("");
lines.push(`**Total tools:** ${tools.length}`);
lines.push("");
lines.push("## Contents");
lines.push("");
for (const cat of CATEGORY_ORDER) {
  const list = byCategory[cat];
  if (!list || list.length === 0) continue;
  lines.push(`- [${cat}](#${cat.toLowerCase()}) — ${list.length} tools`);
}
lines.push("");

const esc = (s) => s.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();

for (const cat of CATEGORY_ORDER) {
  const list = byCategory[cat];
  if (!list || list.length === 0) continue;
  lines.push(`## ${cat}`);
  lines.push("");
  lines.push("| Tool | Slim | Ext req | Description |");
  lines.push("| --- | :---: | :---: | --- |");
  for (const t of list) {
    const slim = t.slim ? "✓" : "";
    const ext = t.extensionRequired ? "✓" : "";
    const desc = t.description
      ? esc(t.description).slice(0, 180)
      : "_(no description)_";
    lines.push(`| \`${t.name}\` | ${slim} | ${ext} | ${desc} |`);
  }
  lines.push("");
}

lines.push(
  "> **Slim** = available when bridge started with `--slim`. **Ext req** = requires the VS Code extension to be connected.",
);
lines.push("");

const content = lines.join("\n");

// ── write or check ──────────────────────────────────────────────────────────

const checkMode = process.argv.includes("--check");

if (checkMode) {
  let existing = "";
  try {
    existing = readFileSync(outPath, "utf8");
  } catch {}
  if (existing !== content) {
    console.error(
      "docs/tool-reference.md is out of date. Run: node scripts/gen-tool-reference.mjs",
    );
    process.exit(1);
  }
  console.log(`docs/tool-reference.md is up to date (${tools.length} tools).`);
} else {
  writeFileSync(outPath, content);
  console.log(
    `Wrote ${path.relative(root, outPath)} (${tools.length} tools across ${Object.keys(byCategory).length} categories).`,
  );
}
