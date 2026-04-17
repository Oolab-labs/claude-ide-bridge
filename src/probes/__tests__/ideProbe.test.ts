import { describe, expect, it } from "vitest";
import {
  formatRecommendation,
  type IdeEnvironment,
  recommendMode,
} from "../ideProbe.js";

function env(partial: Partial<IdeEnvironment>): IdeEnvironment {
  return {
    editorBinary: null,
    hasExtension: false,
    isHeadless: false,
    isRemote: false,
    isContainer: false,
    isWsl: false,
    ...partial,
  };
}

describe("recommendMode", () => {
  it("recommends slim with VS Code + extension on desktop", () => {
    const rec = recommendMode(
      env({ editorBinary: "code", hasExtension: true }),
    );
    expect(rec.mode).toBe("slim");
    expect(rec.flag).toBe("--slim");
  });

  it("recommends full when extension missing", () => {
    const rec = recommendMode(
      env({ editorBinary: "code", hasExtension: false }),
    );
    expect(rec.mode).toBe("full");
  });

  it("recommends full in container even with editor + extension", () => {
    const rec = recommendMode(
      env({ editorBinary: "code", hasExtension: true, isContainer: true }),
    );
    expect(rec.mode).toBe("full");
    expect(rec.reason).toContain("container");
  });

  it("recommends full when headless", () => {
    const rec = recommendMode(
      env({ editorBinary: "code", hasExtension: true, isHeadless: true }),
    );
    expect(rec.mode).toBe("full");
  });

  it("recommends full with no editor on PATH", () => {
    const rec = recommendMode(env({}));
    expect(rec.mode).toBe("full");
    expect(rec.reason).toContain("no VS Code CLI");
  });
});

describe("formatRecommendation", () => {
  it("includes flag and reason", () => {
    const out = formatRecommendation({
      mode: "slim",
      flag: "--slim",
      reason: "test reason",
    });
    expect(out).toContain("--slim");
    expect(out).toContain("test reason");
  });
});
