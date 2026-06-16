import { describe, it, expect } from "vitest";
import { normalizeEmail, validateEmail } from "./email.js";

describe("normalizeEmail", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeEmail("  user@example.com  ")).toBe("user@example.com");
  });
  it("lowercases only the domain, preserving local-part case", () => {
    expect(normalizeEmail("User@Example.COM")).toBe("User@example.com");
  });
  it("returns trimmed input unchanged when there is no @", () => {
    expect(normalizeEmail("  userexample.com ")).toBe("userexample.com");
  });
  it("splits on the LAST @ (quoted local parts may contain @)", () => {
    expect(normalizeEmail('"a@b"@Example.com')).toBe('"a@b"@example.com');
  });
});

describe("validateEmail", () => {
  it("accepts subaddressing with no warnings", () => {
    const r = validateEmail("user+tag@example.com");
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe("user+tag@example.com");
    expect(r.messages).toHaveLength(0);
  });
  it("rejects empty input with code email.empty", () => {
    const r = validateEmail("");
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("email.empty");
  });
  it("rejects input with no @ with code email.no_at", () => {
    expect(validateEmail("userexample.com").messages[0]?.code).toBe("email.no_at");
  });
  it("rejects a missing local part with code email.empty_local", () => {
    expect(validateEmail("@example.com").messages[0]?.code).toBe("email.empty_local");
  });
  it("rejects a missing domain with code email.empty_domain", () => {
    expect(validateEmail("user@").messages[0]?.code).toBe("email.empty_domain");
  });
  it("warns (but stays valid) on a dotless domain", () => {
    const r = validateEmail("user@localhost");
    expect(r.valid).toBe(true);
    expect(r.messages[0]?.code).toBe("email.domain_no_dot");
    expect(r.messages[0]?.severity).toBe("warn");
  });
  it("rejects absurdly long input with code email.too_long", () => {
    const r = validateEmail("a".repeat(250) + "@ex.com");
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("email.too_long");
  });
});
