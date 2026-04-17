# Contributing to claude-ide-bridge

## Quick Setup

Prerequisites: Node.js ≥20, npm, VS Code (for extension work)

```bash
git clone https://github.com/Oolab-labs/claude-ide-bridge
cd claude-ide-bridge
npm install
npm run build
```

For extension development:
```bash
cd vscode-extension
npm install
npm run build
```

## Running Locally

```bash
# Bridge (from root)
npm run dev                    # tsx watch mode
node dist/index.js --full      # production-like

# Tests
npm test                       # vitest run (all bridge tests)
npm run test:watch             # vitest watch
npm run test:coverage          # coverage report

# Lint + typecheck
npm run lint                   # biome check
npm run lint:fix               # biome check --write
npm run typecheck              # tsc --noEmit
```

## Before Submitting a PR

Run this checklist locally (CI will catch failures, but fix them before pushing):

1. **Biome** on all changed files:
   ```bash
   npx biome check --write src/path/to/changed.ts
   ```
   Watch for: `?.replace()` auto-conversion on prompt variables — restore `!.replace()` if biome changes it.

2. **Description length gate**:
   ```bash
   node scripts/audit-lsp-tools.mjs
   ```
   All tool descriptions must be ≤200 chars.

3. **Schema snapshot** (if you added/changed outputSchema):
   ```bash
   npm run schema:check
   # if adding a new tool with outputSchema:
   npm run schema:update
   ```

4. **Tests pass**:
   ```bash
   npm test
   ```

5. **Typecheck**:
   ```bash
   npm run typecheck
   ```

## Adding a New Tool

### 1. Create the file

Location: `src/tools/<toolName>.ts` (flat — no subdirectory unless joining an existing group like `src/tools/github/`). Factory pattern, one tool per exported function:

```typescript
import { successStructured, error } from "./utils.js";

export function createMyTool(workspace: string, deps: MyDeps) {
  return {
    schema: {
      name: "myTool",                       // camelCase, ^[a-zA-Z0-9_]+$
      description: "One-line summary…",     // ≤ 200 chars (CI-enforced)
      annotations: { readOnlyHint: true },  // omit for write tools
      extensionRequired: true,              // only if the VS Code extension is mandatory
      inputSchema: { type: "object", additionalProperties: false, properties: { … }, required: [] },
      outputSchema: { type: "object", properties: { … }, required: [] },  // MANDATORY
    },
    async handler(args: Record<string, unknown>, signal?: AbortSignal) {
      return successStructured({ /* must match outputSchema */ });
    },
  };
}
```

### 2. Schema rules

- **`name`** matches `/^[a-zA-Z0-9_]+$/`
- **`description`** ≤ 200 chars — `tools/list` is sent on every MCP request; short descriptions keep prompt-cache hits
- **`outputSchema` is mandatory** — `scripts/audit-lsp-tools.mjs` fails CI if missing (allowlist at `scripts/audit-output-schema-allowlist.json` is ratcheted; new entries rejected)
- **Return helpers** in `src/tools/utils.ts`:
  - `successStructured(data)` / `successStructuredLarge(data)` — auto-populates `structuredContent` (required when `outputSchema` declared)
  - `error(msg, code)` — auto-fills `suggestion` from `src/errors/messages.ts` when `code` matches a catalog entry; use codes from `ToolErrorCodes`
  - `extensionRequired(feature, alternatives?)` — standard message for disconnected-extension errors
- **Extension-dependent tools** set `extensionRequired: true`. Tools that work headless via fallback set `extensionFallback: true` instead

### 3. Register

- Import and add to the tools array in `src/tools/index.ts`
- Add to `SLIM_TOOL_NAMES` if it should be exposed when the bridge runs with `--slim`
- If LSP-backed, add to `availableTools.lsp` in `src/tools/getToolCapabilities.ts`
- New error codes go in `src/errors.ts` (`ToolErrorCodes`) and must have a catalog entry in `src/errors/messages.ts`

### 4. Tests

`src/tools/__tests__/<toolName>.test.ts`, at minimum:
- happy path with valid args (asserts `structuredContent` shape matches `outputSchema`)
- argument validation (missing/bad types → `invalid_args`)
- disconnected-extension path (if `extensionRequired: true`) → `isError: true, code: "extension_required"`

Coverage gates: 75% lines, 70% branches, 75% functions. Run with `npm run test:coverage`.

### 5. CI gates you must pass

```bash
npm run lint:fix            # biome auto-fix
npm run typecheck           # tsc --noEmit
npm test                    # vitest
node scripts/audit-lsp-tools.mjs      # registry + outputSchema + description-length
node scripts/audit-shape-safety.mjs   # no new proxy<T> usage
npm run schema:update       # regenerate documents/tool-schemas-snapshot.json if shape changed
npm run docs:tools          # regenerate docs/tool-reference.md
```

The last two are CI-enforced via drift checks — `schema:check` and `docs:tools:check`. If either fails locally, commit the regenerated file.

### 6. See also

- `documents/styleguide.md` — full output-format and naming conventions
- [`docs/tool-reference.md`](docs/tool-reference.md) — auto-generated catalog of every registered tool
- `docs/adr/0004-tool-errors-as-content.md` — `isError:true` vs JSON-RPC errors
- CLAUDE.md → **LSP Workflows** — discovery patterns when adding LSP-flavored tools

## Adding an Extension Handler

Extension handlers live in `vscode-extension/src/handlers/`.

1. Create the handler function in an appropriate file (or a new file)
2. Register it in `vscode-extension/src/handlers/index.ts`
3. Write tests in `vscode-extension/src/__tests__/handlers/`
4. **Critical**: before choosing `tryRequest` vs `validatedRequest` vs direct `requestOrNull`, read ALL return statements in the handler — success AND error paths. Test mocks lie; the handler file is ground truth. Never use `proxy<T>()` for new methods.

## Bug Fix Protocol

1. Write a failing test that reproduces the bug first
2. Fix the bug
3. Confirm the test passes
4. Only then submit the PR

This is enforced by project convention — do not submit bug fixes without a covering test.

## Commit Messages

Conventional Commits format:
```
feat(tools): add getSymbolHistory tool
fix(automation): prevent cascade on onDiagnosticsError
chore(release): bump to v2.30.0
docs: rewrite headless quickstart
```

- Subject ≤72 chars
- Imperative mood: "add", "fix", "remove" — not "added"
- No AI attribution in commit messages
- Body only when the why is non-obvious

## Architecture Overview

Key points for contributors:
- Bridge (`src/`) and VS Code extension (`vscode-extension/`) are separate packages with separate `package.json` files
- Tools communicate with the extension over WebSocket; the extension client lives in `src/extensionClient.ts`
- Tool factory pattern: `createXxxTool(deps)` returns `{ schema, handler }` — register in `src/tools/index.ts`
- MCP transport layer in `src/transport.ts` handles all wire protocol, rate limiting, and session management

## CI Pipeline

Three jobs run on every push:
- **ci** — lint + typecheck + build + test (Node 20 + 22 matrix) + schema audit + description length gate
- **smoke** — integration smoke suite (`needs: ci`)
- **publish-docker** — builds and pushes to ghcr.io on `v*` tags

Publish workflows (manual or tag-triggered):
- **publish-npm** — `workflow_dispatch` with bump type triggers version bump + npm publish
- **publish-extension** — `workflow_dispatch` or `v*` tag push triggers VS Code Marketplace + Open VSX release

## Project Structure

```
src/
  tools/              # MCP tool implementations (factory pattern)
  transport.ts        # MCP protocol layer, rate limiting, session management
  bridge.ts           # Main orchestrator
  extensionClient.ts  # VS Code extension proxy
  automation.ts       # Automation hooks engine
  oauth.ts            # OAuth 2.0 endpoints
vscode-extension/
  src/
    handlers/         # Extension message handlers
    extension.ts      # Extension entry point
documents/            # Feature reference docs (platform-docs, styleguide, roadmap)
docs/                 # Operational docs (deployment, ADRs, troubleshooting)
  adr/                # Architecture Decision Records — read before touching core systems
scripts/              # Build, audit, and smoke test scripts
deploy/               # VPS provisioning and service install scripts
templates/            # Automation policy presets and scheduled task templates
```

## Coverage Requirements

Tests must maintain:
- 75% line coverage
- 70% branch coverage
- 75% function coverage

CI fails below these thresholds. New tools and handlers require tests before the PR can merge.

## Getting Help

- Issues: https://github.com/Oolab-labs/claude-ide-bridge/issues
- Check `docs/troubleshooting.md` for common problems
- `getBridgeStatus` MCP tool reports bridge health, probe results, and extension connection state in a running session
