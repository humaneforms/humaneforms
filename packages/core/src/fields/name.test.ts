import { describe, it, expect } from "vitest";
import { normalizeName, validateName } from "./name.js";

describe("normalizeName", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeName("  José  ")).toBe("José");
  });
  it("collapses internal whitespace runs to a single space", () => {
    expect(normalizeName("Anne   Marie")).toBe("Anne Marie");
  });
  it("applies Unicode NFC normalization", () => {
    // "e" + combining acute accent (NFD) must normalize to single "é" (NFC).
    expect(normalizeName("José")).toBe("José");
  });
  it("preserves case (names are case-sensitive)", () => {
    expect(normalizeName("McDonald")).toBe("McDonald");
  });
});

describe("validateName", () => {
  it("accepts a mononym", () => {
    const r = validateName("Cher");
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe("Cher");
    expect(r.messages).toHaveLength(0);
  });
  it("rejects empty input with code name.empty", () => {
    const r = validateName("");
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("name.empty");
    expect(r.messages[0]?.severity).toBe("error");
  });
  it("rejects whitespace-only input as empty", () => {
    expect(validateName("   ").messages[0]?.code).toBe("name.empty");
  });
  it("rejects input with no letters with code name.no_letters", () => {
    const r = validateName("123");
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("name.no_letters");
  });
  it("rejects absurdly long input with code name.too_long", () => {
    const r = validateName("a".repeat(1001));
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("name.too_long");
  });
});
