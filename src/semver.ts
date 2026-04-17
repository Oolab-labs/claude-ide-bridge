/**
 * Minimal, dep-free semver matcher for plugin compatibility checks.
 * Supports: exact ("1.2.3"), caret ("^1.2.3" — same major, ≥1.2.3),
 * tilde ("~1.2.3" — same major+minor, ≥1.2.3), and inequalities (">=1.2.3").
 *
 * Not RFC-complete. Scope is narrow: bridge protocol version gate.
 */

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
}

export function parse(v: string): SemVer | null {
  const m = v.trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
  };
}

function gte(a: SemVer, b: SemVer): boolean {
  if (a.major !== b.major) return a.major > b.major;
  if (a.minor !== b.minor) return a.minor > b.minor;
  return a.patch >= b.patch;
}

export function satisfies(version: string, range: string): boolean {
  const v = parse(version);
  if (!v) return false;
  const r = range.trim();
  if (r.startsWith("^")) {
    const b = parse(r.slice(1));
    if (!b) return false;
    return v.major === b.major && gte(v, b);
  }
  if (r.startsWith("~")) {
    const b = parse(r.slice(1));
    if (!b) return false;
    return v.major === b.major && v.minor === b.minor && gte(v, b);
  }
  if (r.startsWith(">=")) {
    const b = parse(r.slice(2));
    if (!b) return false;
    return gte(v, b);
  }
  // Exact match
  const b = parse(r);
  if (!b) return false;
  return v.major === b.major && v.minor === b.minor && v.patch === b.patch;
}

export function majorOf(v: string): number | null {
  const p = parse(v);
  return p ? p.major : null;
}
