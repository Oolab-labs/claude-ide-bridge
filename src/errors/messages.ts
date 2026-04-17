/**
 * User-friendly messages + suggestions for every bridge error code.
 *
 * Consumers: the tool error serializer in `src/tools/utils.ts` auto-fills
 * `suggestion` on `isError:true` responses when caller does not supply one.
 * JSON-RPC `ErrorCodes` entries are looked up by numeric code; tool error
 * codes are looked up by string.
 */

export interface ErrorCatalogEntry {
  title: string;
  suggestion: string;
}

export const ERROR_CATALOG: Record<string, ErrorCatalogEntry> = {
  // Tool error codes (isError: true responses)
  file_not_found: {
    title: "File not found at the requested path",
    suggestion:
      "Verify the path is relative to the workspace root. Use `findFiles` to search for it.",
  },
  permission_denied: {
    title: "Bridge blocked this operation",
    suggestion:
      "Check the command allowlist in config. Add permissions via `--allow-command` or `--vps`.",
  },
  workspace_escape: {
    title: "Path escapes workspace boundary",
    suggestion:
      "The resolved path must stay inside one of the configured workspaceFolders. Pass a relative path.",
  },
  extension_required: {
    title: "VS Code extension not connected",
    suggestion:
      "Install the claude-ide-bridge extension, or call `getBridgeStatus` to diagnose the connection.",
  },
  timeout: {
    title: "Operation exceeded its timeout",
    suggestion:
      "Retry the call. If a timeout parameter is supported, increase it, or split the request into smaller chunks.",
  },
  invalid_args: {
    title: "Arguments failed schema validation",
    suggestion:
      "Inspect the tool's inputSchema via `getToolCapabilities` and re-check required fields and types.",
  },
  git_error: {
    title: "Git command failed",
    suggestion:
      "Check `getGitStatus` for a clean working state and ensure the workspace is a git repository.",
  },
  external_command_failed: {
    title: "Spawned process exited with a non-zero status",
    suggestion:
      "Inspect logs via `getActivityLog`. Verify the binary is on PATH — `bridgeDoctor` reports missing probes.",
  },
  task_not_found: {
    title: "Claude task id not in registry",
    suggestion: "Call `listClaudeTasks` to enumerate active task ids.",
  },
  ambiguous_task_id: {
    title: "Task id prefix matches multiple tasks",
    suggestion: "Supply a longer id prefix to disambiguate.",
  },
  driver_not_configured: {
    title: "Claude driver is not configured",
    suggestion:
      "Start the bridge with `--claude-driver subprocess` (or `api`) to enable Claude task orchestration.",
  },
  cooldown_active: {
    title: "Cooldown window active for this event",
    suggestion:
      "Wait for the cooldown to elapse. Cooldowns prevent automation cascades — adjust `cooldownMs` in the policy if the interval is too strict.",
  },

  // JSON-RPC numeric codes (also keyed as strings for uniform lookup)
  "-32700": {
    title: "Malformed JSON payload",
    suggestion:
      "Ensure the transport is sending valid JSON. Check for truncation or mixed framing.",
  },
  "-32600": {
    title: "Invalid JSON-RPC request",
    suggestion:
      "Verify the envelope has `jsonrpc: '2.0'`, a valid `method`, and either `id` (request) or no id (notification).",
  },
  "-32601": {
    title: "Method not found",
    suggestion:
      "Call `tools/list` to enumerate available methods. Tool names may have changed between versions.",
  },
  "-32602": {
    title: "Invalid parameters",
    suggestion:
      "Check the tool's inputSchema. Required fields may be missing or mistyped.",
  },
  "-32001": {
    title: "Bridge not accepting requests",
    suggestion:
      "The bridge is still starting or reconnecting. Retry after a short back-off; see ADR-0002 for the generation guard.",
  },
  "-32003": {
    title: "Tool unknown to this bridge",
    suggestion:
      "The tool may be behind a flag or in `--slim` mode. Call `getToolCapabilities` to confirm availability.",
  },
  "-32004": {
    title: "Rate limit exceeded",
    suggestion:
      "Back off and retry. Raise `--tool-rate-limit` if the cap is too strict for your workload.",
  },
};

export function lookupErrorCatalog(
  code: string | number,
): ErrorCatalogEntry | undefined {
  const key = typeof code === "number" ? String(code) : code;
  return ERROR_CATALOG[key];
}
