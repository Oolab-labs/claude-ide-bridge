# Tool Reference

Auto-generated from tool source schemas by `scripts/gen-tool-reference.mjs`. Do not edit by hand.

**Total tools:** 170

## Contents

- [LSP](#lsp) — 34 tools
- [Git](#git) — 16 tools
- [GitHub](#github) — 11 tools
- [Editor](#editor) — 22 tools
- [Terminal](#terminal) — 7 tools
- [Debug](#debug) — 5 tools
- [Other](#other) — 75 tools

## LSP

| Tool | Slim | Ext req | Description |
| --- | :---: | :---: | --- |
| `applyCodeAction` | ✓ | ✓ | Apply code action by title. Use getCodeActions first to see options. |
| `batchFindImplementations` | ✓ | ✓ | Find implementations for up to 10 symbols. Prefer over repeated findImplementations. |
| `batchGetHover` | ✓ | ✓ | Hover info (type signatures, docs) for up to 10 positions. Prefer over repeated getHover. |
| `batchGoToDefinition` | ✓ | ✓ | Go to definition for up to 10 symbols. Prefer over repeated goToDefinition. |
| `explainDiagnostic` |  | ✓ | Bundle diagnostic details + code context (±10 lines) + go-to-definition + callers (up to 5) for a file/line/character position. |
| `explainSymbol` | ✓ | ✓ | Get comprehensive symbol info in one call: type signature, docs, definition location, call hierarchy, and reference count. |
| `findImplementations` | ✓ | ✓ | Find implementations of interface, abstract method, or abstract class. |
| `findReferences` | ✓ |  | Find all references to a symbol at a given position using VS Code LSP. |
| `foldingRanges` | ✓ | ✓ | Foldable regions in a file (functions, classes, imports, comments). Returns {startLine, endLine, kind}. |
| `getCallHierarchy` | ✓ | ✓ | Get the call hierarchy for a function or method. Use direction="incoming" to find callers, "outgoing" to see everything it calls, or "both" (default). |
| `getCodeActions` | ✓ | ✓ | Get available code actions (quick fixes, refactorings) for a range in a file. |
| `getCodeLens` | ✓ | ✓ | Code lens items for a file: ref counts, Run/Debug buttons, impl counts from language server. |
| `getDiagnostics` | ✓ |  | Errors/warnings from TS, ESLint, Pyright, Ruff, Cargo, Go vet, Biome. Real-time LSP when ext connected. |
| `getDocumentLinks` | ✓ | ✓ | Get file references and URLs in a document. File links are workspace-relative. |
| `getDocumentSymbols` | ✓ |  | List symbols (fns, classes, interfaces, methods) in a file: names, kinds, lines, parents. |
| `getHover` | ✓ | ✓ | Get hover information (type info, documentation) for a symbol at a given position. |
| `getHoverAtCursor` | ✓ | ✓ | Hover docs for symbol at current cursor. Zero-input wrapper around getHover. |
| `getImportedSignatures` | ✓ | ✓ | Resolve imported symbols → type signatures. Use before calling unfamiliar functions. |
| `getImportTree` | ✓ |  | Tree of local imports for a file. Useful for understanding deps and finding circular imports. |
| `getInlayHints` | ✓ | ✓ | Inlay hints (inline type annotations, param names) for a line range. e.g. TS types, Rust lifetimes. |
| `getSemanticTokens` | ✓ | ✓ | Semantic token types and modifiers for a file from the language server. |
| `getTypeHierarchy` | ✓ | ✓ | Type hierarchy: supertypes (parents) and subtypes (impls/subclasses). Requires LSP support. |
| `getTypeSignature` |  |  | Type signature for symbol at position via LSP hover. Returns clean signature from hover markdown. |
| `goToDeclaration` | ✓ | ✓ | Go to the declaration of a symbol (header file in C/C++, .d.ts entry in TypeScript). Unlike goToDefinition, navigates to the 'declare' statement rather than the implementation. |
| `goToDefinition` | ✓ |  | Go to the definition of a symbol at a given position using VS Code LSP. |
| `goToTypeDefinition` | ✓ | ✓ | Go to the type definition of a symbol. Unlike goToDefinition (navigates to declaration), this navigates to where the type itself is defined. |
| `jumpToFirstError` |  |  | Jump to first workspace error (getDiagnostics→openFile→decoration). Returns {found:false} if none. |
| `navigateToSymbolByName` |  |  | Find symbol by name and jump to definition. Replaces searchSymbols→goToDefinition pattern. |
| `prepareRename` | ✓ | ✓ | Check if symbol can be renamed. Returns canRename:false with reason if not. Use before renameSymbol. |
| `previewCodeAction` | ✓ | ✓ | Preview edits a code action would make without applying. Use before applyCodeAction. |
| `renameSymbol` | ✓ | ✓ | Rename symbol across all files via LSP. Returns affected files and edit counts. |
| `searchWorkspaceSymbols` | ✓ |  | Search workspace symbols (classes, fns, vars, interfaces) by name via LSP. |
| `selectionRanges` | ✓ | ✓ | Hierarchical selection ranges at position: identifier→expression→block→function→class. |
| `signatureHelp` | ✓ | ✓ | Function signature and param info at a call site. Returns active sig, param index, overloads. |

## Git

| Tool | Slim | Ext req | Description |
| --- | :---: | :---: | --- |
| `createGithubIssueFromAIComment` |  |  | Create GitHub issue from AI comment. Call getAIComments first to populate cache. |
| `getGitDiff` |  |  | Get the git diff output for the workspace or a specific file |
| `getGitHotspots` |  |  | Most frequently changed files in git history. High frequency → active dev or instability. |
| `getGitLog` |  |  | Get recent git log entries for the workspace or a specific file |
| `getGitStatus` |  |  | Git status: branch, staged/unstaged/untracked files, ahead/behind counts. |
| `gitAdd` |  |  | Stage files for commit. Omit to stage all tracked (git add -u). addUntracked:true for new files. |
| `gitBlame` |  |  | Per-line last modifier and commit. Trace why code was written or find the introducing commit. |
| `gitCheckout` |  |  | Switch to a branch, or create and switch to a new branch. Use create: true to create from HEAD or a specified base. |
| `gitCommit` |  |  | Commit staged changes. Pass files to stage-and-commit in one step. Returns hash, branch, files. |
| `gitFetch` |  |  | Fetch updates from a remote without merging. Updates remote-tracking branches so gitListBranches and gitCheckout see the latest state. Use gitPull to fetch and merge in one step. |
| `gitListBranches` |  |  | List git branches. Returns local branches with the current branch marked. Pass includeRemote: true for remote-tracking branches. |
| `gitPull` |  |  | Pull changes from a remote into the current branch. Defaults to origin with merge. Use rebase: true for linear history. |
| `gitPush` |  |  | Push the current branch to a remote. Use setUpstream: true on the first push. Force push uses --force-with-lease. Blocked on main/master. |
| `gitStash` |  |  | Stash current changes to get a clean working tree. Required before switching branches with uncommitted changes. Use gitStashPop to restore. Pass includeUntracked: true to also stas |
| `gitStashList` |  |  | List all stash entries in the repository. Returns each entry's index, branch it was stashed from, message, and age. Use before gitStashPop to identify the right entry to restore. |
| `gitStashPop` |  |  | Restore stashed changes to the working tree. Pops the most recent stash by default, or a specific entry by index (from gitStashList). |

## GitHub

| Tool | Slim | Ext req | Description |
| --- | :---: | :---: | --- |
| `githubCommentIssue` |  |  | Add a comment to a GitHub issue using the GitHub CLI (gh). Requires gh to be installed and authenticated. Returns the comment URL. |
| `githubCreateIssue` |  |  | Create a GitHub issue using the GitHub CLI (gh). Requires gh to be installed and authenticated. Returns the issue URL and number. |
| `githubCreatePR` |  |  | Create a GitHub pull request using gh CLI. Uses commit messages as description if body is omitted (--fill). Returns the PR URL and number. |
| `githubGetIssue` |  |  | View full details of a GitHub issue including body and comments. Requires gh to be installed and authenticated. |
| `githubGetPRDiff` |  |  | Fetch the full diff and metadata for a GitHub pull request. Returns title, branch info, per-file diffs, and unified diff text. Diffs over 256 KB are truncated. |
| `githubGetRunLogs` |  |  | Get logs from a GitHub Actions workflow run. By default returns only the failed steps' logs. Pass the databaseId from githubListRuns as the runId. |
| `githubListIssues` |  |  | List issues for the current GitHub repository using the GitHub CLI (gh). Requires gh to be installed and authenticated. |
| `githubListPRs` |  |  | List pull requests for the current GitHub repository using the GitHub CLI (gh). Requires gh to be installed and authenticated. |
| `githubListRuns` |  |  | List GitHub Actions workflow runs. Use to check CI status after a push. Pass the run ID (databaseId) to githubGetRunLogs to retrieve failure details. |
| `githubPostPRReview` |  |  | Post a code review on a GitHub pull request. Inline comments MUST target lines in the diff (use githubGetPRDiff first). event: COMMENT (non-blocking), REQUEST_CHANGES. Approving PR |
| `githubViewPR` |  |  | View details of a GitHub pull request using the GitHub CLI (gh). Omit number to view the PR for the current branch. Requires gh to be installed and authenticated. |

## Editor

| Tool | Slim | Ext req | Description |
| --- | :---: | :---: | --- |
| `clearEditorDecorations` | ✓ | ✓ | Clear editor decorations by ID, or omit id to clear all Claude-managed decorations. |
| `closeAllDiffTabs` |  |  | Close all diff tabs and clean up temp diff directories. |
| `closeTab` | ✓ | ✓ | Close editor tab by file path. Prompts to save if dirty. Requires ext. |
| `createFile` |  |  | Create file or directory within workspace. Uses VS Code when connected, native fs fallback. |
| `deleteFile` |  |  | Delete workspace file or directory. VS Code (with trash) when connected, native fs fallback. |
| `editText` |  |  | Insert/delete/replace text at 1-based line/col. Atomic multi-edit. Uses VS Code or native fs. Workspace files only. |
| `fixAllLintErrors` |  |  | Auto-fix lint errors. VS Code source.fixAll when connected, falls back to eslint/biome/ruff. |
| `formatAndSave` |  |  | Format a file and save it in one call (formatDocument + saveDocument). Formatter errors propagate; save is not attempted on format failure. |
| `formatDocument` |  |  | Format file via VS Code formatter or CLI fallback (prettier/biome/black/gofmt/rustfmt). |
| `formatRange` |  | ✓ | Format a line range via LSP formatter. Faster than full formatDocument for large files. |
| `getBufferContent` |  |  | Read workspace file from VS Code buffer including unsaved changes. Use before editText. Returns isDirty flag. Workspace files only. |
| `getCurrentSelection` | ✓ |  | Get the current text selection in the editor |
| `getLatestSelection` | ✓ |  | Get the most recent text selection (even if not in the active editor) |
| `getOpenEditors` | ✓ |  | Open files/tabs with isDirty, isActive when ext connected. Fallback: session-opened files only. |
| `openDiff` |  |  | Open a diff view comparing old file content with new file content. Creates temporary files on disk. |
| `openFile` | ✓ |  | Open a file in the editor and optionally select a range of text |
| `organizeImports` |  |  | Organize/sort imports in workspace file. Uses VS Code ext when connected; falls back to Biome or Prettier. |
| `renameFile` |  |  | Rename or move workspace file/directory. Uses VS Code when connected, native fs fallback. |
| `replaceBlock` |  |  | Replace exact text block in a workspace file by content match, no line numbers. Fails clearly if not found or ambiguous. |
| `saveDocument` | ✓ |  | Save workspace document via VS Code buffer when ext connected. No-op otherwise (editText writes to disk). |
| `searchAndReplace` |  |  | Find and replace across workspace files. Supports regex with capture groups. Returns modified files. |
| `setEditorDecorations` | ✓ | ✓ | Place visual decorations (highlights, inline text) on file lines. Grouped by ID; replaces on each call. |

## Terminal

| Tool | Slim | Ext req | Description |
| --- | :---: | :---: | --- |
| `createTerminal` |  | ✓ | Create VS Code integrated terminal. Options: name, cwd, env vars, shell. |
| `disposeTerminal` |  | ✓ | Close a VS Code terminal by name or index. |
| `getTerminalOutput` |  | ✓ | Get recent output from a VS Code integrated terminal. Identify by name or index (from listTerminals). Returns last N lines. On headless VPS/SSH, use runInTerminal instead. |
| `listTerminals` |  | ✓ | List active VS Code terminals: names, indices, output capture availability. |
| `runInTerminal` |  |  | Execute command and wait for completion. Returns exit code and output. Prefer over runCommand. |
| `sendTerminalCommand` |  | ✓ | Send text/command to VS Code terminal. Fire-and-forget; use getTerminalOutput to check results. |
| `waitForTerminalOutput` |  | ✓ | Block until regex matches terminal output. Returns {matched, matchedLine, elapsed} or timedOut. |

## Debug

| Tool | Slim | Ext req | Description |
| --- | :---: | :---: | --- |
| `evaluateInDebugger` | ✓ | ✓ | Evaluate expression in active debug session. Session must be paused at a breakpoint. |
| `getDebugState` | ✓ | ✓ | VS Code debugger state: session info, paused location, call stack, locals. hasActiveSession=false if idle. |
| `setDebugBreakpoints` | ✓ | ✓ | Set breakpoints in a file (replaces existing). Supports conditions, logpoints, hit counts. |
| `startDebugging` | ✓ | ✓ | Start debug session from .vscode/launch.json. Pass configName to select configuration. |
| `stopDebugging` | ✓ | ✓ | Stop active debug session. No-op if none running. |

## Other

| Tool | Slim | Ext req | Description |
| --- | :---: | :---: | --- |
| `auditDependencies` |  |  | Detect outdated packages (current vs latest). Supports npm, yarn, pnpm, cargo, pip. Complement to getSecurityAdvisories. |
| `beginTransaction` |  |  | Start a new multi-file edit transaction. Returns a transactionId for subsequent stageEdit calls. |
| `bridgeDoctor` | ✓ |  | Health check: extension, git, linters, test runners, GitHub CLI. Use when tools misbehave. |
| `cancelClaudeTask` |  |  | Cancel a pending or running Claude task. |
| `captureScreenshot` | ✓ | ✓ | Capture screenshot → base64 PNG. macOS/Linux with display only. Not available on headless servers. |
| `checkDocumentDirty` | ✓ |  | Check if file has unsaved changes. Uses VS Code buffer when ext connected; heuristic otherwise. |
| `commitTransaction` |  |  | Write all staged edits atomically. All files are written; on partial failure, written files are NOT rolled back (use rollbackTransaction before commitTransaction to verify). |
| `contextBundle` | ✓ |  | Collect IDE context in one call: active file, diagnostics, diff, editors, handoff note, git status. |
| `createPlan` |  |  | Create .claude-plan.md in workspace root. Markdown with sections and task checklists. |
| `deletePlan` |  |  | Delete a plan file from the workspace root. |
| `detectUnusedCode` |  |  | Find unused exports, locals, parameters via tsc --noUnusedLocals or ts-prune. |
| `executeVSCodeCommand` | ✓ | ✓ | Execute VS Code command by ID. Use listVSCodeCommands to discover IDs. |
| `findFiles` |  |  | Find files by name/glob pattern in the workspace. Respects .gitignore. |
| `findRelatedTests` |  |  | Find test files that cover a source file via import search + name patterns. Optionally includes coverage pct per test file. |
| `generateAPIDocumentation` |  |  | Generate API docs (markdown/JSON) for TS/JS exported symbols. Extracts fns, classes, interfaces, JSDoc. |
| `generateTests` |  |  | Generate test scaffold from exported fns/classes. Returns describe/it content; does not write file. |
| `getActivityLog` |  |  | Query recent tool call log: names, timing, status, percentiles, co-occurrence. |
| `getAIComments` |  | ✓ | Scan open docs for AI-tagged comments (// AI: <severity>: <msg>). Severity: fix/todo/question/warn/task. |
| `getAnalyticsReport` | ✓ |  | Session analytics: top tools by call count, hook events, recent automation tasks. |
| `getArchitectureContext` |  |  | Architectural overview via codebase-memory graph: module boundaries, dependencies, ADRs, hotspot files. Returns structured query plan. Requires codebase-memory connected. |
| `getBridgeStatus` | ✓ |  | IDE bridge status: ext connection, circuit breaker, uptime, tool availability. |
| `getChangeImpact` | ✓ | ✓ | Blast radius after editing a file: diagnostics + reference counts for changed symbols. |
| `getClaudeTaskStatus` |  |  | Get the status and output of a Claude task enqueued with runClaudeTask. |
| `getCodeCoverage` |  |  | Parse coverage report (lcov/coverage-summary.json/clover.xml) → per-file line/branch/fn %. Does not run tests. |
| `getCommitDetails` |  |  | Full commit details: author, date, message, changed files, optional diff patch. |
| `getDependencyTree` |  |  | Dependency tree (npm/cargo/go/pip). Auto-detects package manager. Returns names and versions. |
| `getDiffBetweenRefs` |  |  | Diff between two git refs (branches/tags/commits). statOnly for file-level summary only. |
| `getDiffFromHandoff` |  | ✓ | Compute what changed since the handoff note was written: git diff summary + new/resolved diagnostics. |
| `getFileTree` |  |  | Workspace file tree. Respects .gitignore. Skips node_modules, .git, dist, build, coverage. |
| `getHandoffNote` |  |  | Retrieve handoff note from prior session (Desktop or CLI). Call at session start to resume. |
| `getPerformanceReport` | ✓ |  | Live performance assessment: per-tool latency percentiles, throughput, extension health, session counts, and overall health score. |
| `getPlan` |  |  | Read plan file. Returns title, sections, tasks, and completion status. |
| `getProjectContext` | ✓ |  | Cached session-start brief: active file, errors, recent commits, modules. Skips cold-start re-exploration. |
| `getProjectInfo` |  |  | Project overview: name/version, languages, pkg manager, scripts, deps, config, git. Call at session start. |
| `getPRTemplate` |  |  | PR description from commits and diff stats vs base branch. Returns markdown → pass to githubCreatePR. |
| `getSecurityAdvisories` |  |  | Security audit: CVEs with severity and remediation. Auto-detects npm/yarn/pnpm/cargo/pip-audit. |
| `getSessionUsage` | ✓ |  | Token usage estimate for this session: schema size, call counts, largest tool results. |
| `getSymbolHistory` |  |  | Symbol evolution: LSP definition + git blame on definition site + file commit history. Answers 'why does this exist?' and 'who changed it last?' |
| `getToolCapabilities` | ✓ |  | Available CLI tools, ext connection state, and which features are functional vs stub-only. |
| `getWorkspaceFolders` |  |  | Get all workspace folders currently open in the IDE |
| `getWorkspaceSettings` |  | ✓ | Read VS Code workspace settings. Filter by section (e.g. 'editor', 'typescript'). Returns source scope. |
| `launchQuickTask` |  |  | Launch context-aware Claude task from named preset. Same dispatch path as sidebar + CLI. 5s cooldown per preset. |
| `listClaudeTasks` |  |  | List your Claude tasks, optionally filtered by status. |
| `listPlans` |  |  | List all plan files in the workspace root. Returns filenames with titles from frontmatter. |
| `listVSCodeCommands` |  | ✓ | List all registered VS Code commands (up to 2000). Filter by substring to find IDs. |
| `listVSCodeTasks` |  | ✓ | List VS Code tasks from tasks.json and extensions. Returns name, type, group, source. |
| `openInBrowser` |  |  | Write HTML to temp file and open in default browser. For visual reports and dashboards. |
| `parseHttpFile` |  |  | Parse VS Code REST Client file (.http/.rest). Returns method, URL, headers, body per request. |
| `previewEdit` |  |  | Preview what editText or searchAndReplace would do as a unified diff, without writing to disk. |
| `readClipboard` |  |  | Read system clipboard. Returns up to 100 KB of text. |
| `refactorAnalyze` | ✓ | ✓ | Refactor impact: rename safety, ref/caller counts, risk level (low/medium/high). Use before renameSymbol. |
| `refactorExtractFunction` | ✓ | ✓ | Extract lines into a named function. Uses VS Code Extract Function when available. |
| `refactorPreview` | ✓ | ✓ | Preview refactoring edits across files without applying. Use getCodeActions first. |
| `resumeClaudeTask` |  |  | Re-run a failed, cancelled, or completed Claude task with same prompt. Returns new taskId. |
| `rollbackTransaction` |  |  | Discard all staged edits for a transaction without writing anything to disk. |
| `runClaudeTask` |  |  | Enqueue Claude subprocess task. Returns taskId for getClaudeTaskStatus, or stream=true to block. |
| `runCommand` |  |  | Execute allowlisted command. Returns stdout, stderr, exit code, timing. No shell for security. |
| `runTests` |  |  | Run tests (Vitest/Jest/Pytest/Cargo/Go). Returns pass/fail, failures, file:line. Cached 30s. |
| `runVSCodeTask` |  | ✓ | Run VS Code task by name. Waits for completion, returns exit code. For build/test/lint tasks. |
| `screenshotAndAnnotate` |  |  | Correlate browser state with IDE state: dev server URL, diagnostics, git diff summary, and Playwright steps to capture screenshot. |
| `searchTools` | ✓ |  | Find available tools by keyword or category. Use before browsing tools/list to avoid loading all schemas. |
| `searchWorkspace` |  |  | Search workspace files via ripgrep. Returns matching lines with file paths and line numbers. |
| `sendHttpRequest` |  |  | HTTP/HTTPS request → status, headers, body. Body truncated at maxResponseBytes (default 50 KB). |
| `setActiveWorkspaceFolder` |  |  | Set active workspace folder for file ops. Useful in multi-root workspaces. |
| `setHandoffNote` |  |  | Save context note that persists across sessions. Use when switching between CLI and Desktop. |
| `setWorkspaceSetting` |  | ✓ | Write VS Code workspace setting (dot notation e.g. editor.tabSize). security.* writes blocked. |
| `spawnWorkspace` |  |  | Spawn claude-ide-bridge for a workspace dir. Returns pid/port/authToken once lock appears; optionally waits for extension handshake. |
| `stageEdit` |  |  | Stage a file edit inside a transaction. Supports lineRange and searchReplace operations (same params as previewEdit). Does NOT write to disk. |
| `testTraceToSource` |  |  | Map a test pattern to covered source lines from lcov.info or coverage-summary.json — no instrumentation needed. Without per-test coverage, returns whole-suite coverage filtered by  |
| `unwatchFiles` |  |  | Stop watching files for a previously registered watcher by ID. |
| `updatePlan` |  |  | Update plan file: mark tasks done/undone, add tasks or sections. |
| `watchActivityLog` | ✓ |  | Long-poll for new activity log entries. Pass lastId as sinceId on next call. |
| `watchDiagnostics` | ✓ |  | Long-poll for diagnostic changes. Use after edits to wait for LSP re-validation. |
| `watchFiles` |  |  | Watch glob pattern for file changes (created/modified/deleted). Use unwatchFiles to stop. |
| `writeClipboard` |  |  | Write text to system clipboard. Max 1 MB. |

> **Slim** = available when bridge started with `--slim`. **Ext req** = requires the VS Code extension to be connected.
