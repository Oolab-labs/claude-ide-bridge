export type ToolCategory =
  | "lsp"
  | "git"
  | "github"
  | "terminal"
  | "editor"
  | "debug"
  | "other";

const EXPLICIT: Record<string, ToolCategory> = {
  runInTerminal: "terminal",
  getTerminalOutput: "terminal",
  createTerminal: "terminal",
  disposeTerminal: "terminal",
  listTerminals: "terminal",
  sendTerminalCommand: "terminal",
  waitForTerminalOutput: "terminal",
  openFile: "editor",
  editText: "editor",
  saveDocument: "editor",
  formatDocument: "editor",
  formatRange: "editor",
  formatAndSave: "editor",
  searchAndReplace: "editor",
  createFile: "editor",
  deleteFile: "editor",
  renameFile: "editor",
  replaceBlock: "editor",
  organizeImports: "editor",
  fixAllLintErrors: "editor",
  openDiff: "editor",
  closeTab: "editor",
  closeAllDiffTabs: "editor",
  getBufferContent: "editor",
  getOpenEditors: "editor",
  getCurrentSelection: "editor",
  getLatestSelection: "editor",
  setEditorDecorations: "editor",
  clearEditorDecorations: "editor",
};

export function categorize(toolName: string): ToolCategory {
  const explicit = EXPLICIT[toolName];
  if (explicit) return explicit;
  if (toolName.startsWith("github")) return "github";
  if (toolName.startsWith("git") || /Git/.test(toolName)) return "git";
  if (toolName.startsWith("debug") || /Debug/.test(toolName)) return "debug";
  if (
    /^(goTo|findReferences|findImplementations|batchGoToDefinition|batchFindImplementations|batchGetHover|getHover|getCallHierarchy|getTypeHierarchy|getDocumentSymbols|searchWorkspaceSymbols|navigateToSymbolByName|explainSymbol|getInlayHints|signatureHelp|prepareRename|renameSymbol|getSemanticTokens|foldingRanges|selectionRanges|getCodeActions|getCodeLens|getDiagnostics|getImportedSignatures|getImportTree|getTypeSignature|getDocumentLinks|previewCodeAction|applyCodeAction|jumpToFirstError|explainDiagnostic)/.test(
      toolName,
    )
  )
    return "lsp";
  return "other";
}
