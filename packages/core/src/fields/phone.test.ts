import { describe, it, expect } from "vitest";
import { normalizePhone, validatePhone } from "./phone.js";

describe("normalizePhone", () => {
  it("converts a formatted international number to E.164", () => {
    expect(normalizePhone("+1 415 555 2671")).toBe("+14155552671");
  });
  it("uses the default country to parse a national-format number", () => {
    expect(normalizePhone("(415) 555-2671", { defaultCountry: "US" })).toBe("+14155552671");
  });
  it("returns the trimmed input unchanged when it cannot be parsed", () => {
    expect(normalizePhone("  not a phone  ")).toBe("not a phone");
  });
});

describe("validatePhone", () => {
  it("accepts a valid international number with no warnings", () => {
    const r = validatePhone("+1 650 253 0000"); // Google US main line
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe("+16502530000");
    expect(r.messages).toHaveLength(0);
  });
  it("accepts a national-format number given a default country", () => {
    const r = validatePhone("(650) 253-0000", { defaultCountry: "US" });
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe("+16502530000");
  });
  it("rejects empty input with code phone.empty", () => {
    expect(validatePhone("").messages[0]?.code).toBe("phone.empty");
  });
  it("rejects gibberish with code phone.invalid", () => {
    const r = validatePhone("not a phone");
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("phone.invalid");
  });
  it("rejects an impossible (too short) number with code phone.invalid", () => {
    expect(validatePhone("+1").messages[0]?.code).toBe("phone.invalid");
  });
  it("accepts a possible-but-unassigned number with a warning (never rejects)", () => {
    // +44 7700 900123 is the UK Ofcom-reserved fictional range (07700 900xxx,
    // used in TV/film): correct length (possible) but never assigned (not isValid).
    const r = validatePhone("+447700900123");
    expect(r.valid).toBe(true);
    expect(r.messages[0]?.code).toBe("phone.unverified");
    expect(r.messages[0]?.severity).toBe("warn");
  });
});
