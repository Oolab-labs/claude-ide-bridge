import { describe, expect, it } from "vitest";
import { categorize } from "../toolCategories.js";

describe("categorize", () => {
  it.each([
    ["goToDefinition", "lsp"],
    ["findReferences", "lsp"],
    ["getDiagnostics", "lsp"],
    ["gitCommit", "git"],
    ["getGitStatus", "git"],
    ["githubCreatePR", "github"],
    ["runInTerminal", "terminal"],
    ["createTerminal", "terminal"],
    ["editText", "editor"],
    ["openFile", "editor"],
    ["startDebugging", "debug"],
    ["captureScreenshot", "other"],
    ["unknownTool42", "other"],
  ])("%s -> %s", (name, expected) => {
    expect(categorize(name)).toBe(expected);
  });
});
