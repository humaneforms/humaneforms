import { describe, it, expect } from "vitest";
import { normalizeDate, validateDob } from "./dob.js";

describe("normalizeDate", () => {
  it("zero-pads month and day to ISO YYYY-MM-DD", () => {
    expect(normalizeDate("1990-5-3")).toBe("1990-05-03");
  });
  it("trims surrounding whitespace", () => {
    expect(normalizeDate("  2000-12-31  ")).toBe("2000-12-31");
  });
  it("returns the trimmed input unchanged when it is not a valid ISO date", () => {
    expect(normalizeDate("13/05/1990")).toBe("13/05/1990");
  });
  it("returns the trimmed input unchanged for an impossible date", () => {
    expect(normalizeDate("2020-02-30")).toBe("2020-02-30");
  });
});

describe("validateDob", () => {
  const today = "2026-06-13";

  it("accepts a plausible past date with no messages", () => {
    const r = validateDob("1990-05-15", { today });
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe("1990-05-15");
    expect(r.messages).toHaveLength(0);
  });
  it("rejects empty input with code date.empty", () => {
    expect(validateDob("", { today }).messages[0]?.code).toBe("date.empty");
  });
  it("rejects an ambiguous slash format with code date.unparseable", () => {
    const r = validateDob("13/05/1990", { today });
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("date.unparseable");
  });
  it("rejects an impossible date with code date.unparseable", () => {
    expect(validateDob("2020-02-30", { today }).messages[0]?.code).toBe("date.unparseable");
  });
  it("rejects a future date of birth with code date.future", () => {
    const r = validateDob("2030-01-01", { today });
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("date.future");
  });
  it("warns (stays valid) on an implausible age over 130", () => {
    const r = validateDob("1850-01-01", { today });
    expect(r.valid).toBe(true);
    expect(r.messages[0]?.code).toBe("date.implausible_age");
    expect(r.messages[0]?.severity).toBe("warn");
  });
});
