#!/usr/bin/env bash
# check-extension-version-bump.sh
#
# Blocks the commit if files under vscode-extension/ changed but
# vscode-extension/package.json version did NOT bump.
#
# Why: Windsurf (and VS Code forks) cache .vsix by version. Repackaging at
# the same version silently reuses the stale bundle — user installs it and
# sees no change. See CLAUDE.md "Extension versioning rule".
#
# Runs against the staged diff. Exit 1 → commit rejected; exit 0 → allowed.

set -euo pipefail

staged=$(git diff --cached --name-only)

# Which extension source files changed (exclude package.json itself + docs)?
changed_src=$(printf '%s\n' "$staged" | grep -E '^vscode-extension/(src/|tsconfig|esbuild|biome)' || true)

if [[ -z "$changed_src" ]]; then
  # No extension source change — nothing to enforce.
  exit 0
fi

# Source files staged; require package.json version bump staged too.
pkg="vscode-extension/package.json"
if ! printf '%s\n' "$staged" | grep -qx "$pkg"; then
  cat >&2 <<EOF
  ✗ Extension source changed but ${pkg} is not staged.

  Windsurf caches .vsix by version number. Bump the version in ${pkg}
  (patch bump is fine, e.g. 1.4.8 → 1.4.9), stage it, and retry.

  To bypass intentionally (e.g. refactor without behavior change you won't
  repackage): SKIP=check-extension-version-bump git commit ...
EOF
  exit 1
fi

# Check the diff actually bumps "version".
version_diff=$(git diff --cached -- "$pkg" | grep -E '^[+-]\s*"version":' || true)
added=$(printf '%s\n' "$version_diff" | grep -E '^\+' || true)
removed=$(printf '%s\n' "$version_diff" | grep -E '^-' || true)

if [[ -z "$added" || -z "$removed" ]]; then
  cat >&2 <<EOF
  ✗ Extension source changed but ${pkg} version line is unchanged.

  The staged package.json modification does not touch the "version" field.
  Bump it (patch bump is fine) and re-stage ${pkg}.
EOF
  exit 1
fi

if [[ "$added" == "${removed/-/+}" ]]; then
  cat >&2 <<EOF
  ✗ Extension ${pkg} version before/after match — no actual bump.

  Old: $removed
  New: $added
EOF
  exit 1
fi

exit 0
