import { describe, expect, it } from "vitest";
import { ErrorCodes, ToolErrorCodes } from "../../errors.js";
import { ERROR_CATALOG, lookupErrorCatalog } from "../messages.js";

describe("ERROR_CATALOG", () => {
  it("covers every ToolErrorCode", () => {
    for (const code of Object.values(ToolErrorCodes)) {
      expect(
        ERROR_CATALOG[code],
        `missing catalog entry for ${code}`,
      ).toBeTruthy();
      expect(ERROR_CATALOG[code]?.title.length).toBeGreaterThan(0);
      expect(ERROR_CATALOG[code]?.suggestion.length).toBeGreaterThan(0);
    }
  });

  it("covers every JSON-RPC ErrorCode", () => {
    for (const num of Object.values(ErrorCodes)) {
      const entry = lookupErrorCatalog(num);
      expect(entry, `missing catalog entry for ${num}`).toBeTruthy();
      expect(entry?.title.length).toBeGreaterThan(0);
    }
  });

  it("lookupErrorCatalog returns undefined for unknown codes", () => {
    expect(lookupErrorCatalog("nope")).toBeUndefined();
    expect(lookupErrorCatalog(-9999)).toBeUndefined();
  });

  it("lookupErrorCatalog accepts string or number keys", () => {
    expect(lookupErrorCatalog(-32700)?.title).toContain("JSON");
    expect(lookupErrorCatalog("-32700")?.title).toContain("JSON");
  });
});
