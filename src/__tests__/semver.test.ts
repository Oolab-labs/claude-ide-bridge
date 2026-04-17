import { describe, expect, it } from "vitest";
import { majorOf, parse, satisfies } from "../semver.js";

describe("parse", () => {
  it("parses x.y.z", () => {
    expect(parse("1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
  });
  it("ignores pre-release suffix", () => {
    expect(parse("2.0.0-rc.1")).toEqual({ major: 2, minor: 0, patch: 0 });
  });
  it("rejects non-semver", () => {
    expect(parse("abc")).toBeNull();
    expect(parse("1.2")).toBeNull();
  });
});

describe("satisfies", () => {
  it("exact match", () => {
    expect(satisfies("1.1.0", "1.1.0")).toBe(true);
    expect(satisfies("1.1.0", "1.2.0")).toBe(false);
  });
  it("caret same-major", () => {
    expect(satisfies("1.2.3", "^1.0.0")).toBe(true);
    expect(satisfies("1.0.0", "^1.2.3")).toBe(false);
    expect(satisfies("2.0.0", "^1.0.0")).toBe(false);
  });
  it("tilde same-major+minor", () => {
    expect(satisfies("1.2.9", "~1.2.3")).toBe(true);
    expect(satisfies("1.3.0", "~1.2.3")).toBe(false);
  });
  it(">= inequality", () => {
    expect(satisfies("1.1.0", ">=1.0.0")).toBe(true);
    expect(satisfies("2.0.0", ">=1.0.0")).toBe(true);
    expect(satisfies("0.9.0", ">=1.0.0")).toBe(false);
  });
});

describe("majorOf", () => {
  it("extracts major", () => {
    expect(majorOf("1.2.3")).toBe(1);
    expect(majorOf("nonsense")).toBeNull();
  });
});
