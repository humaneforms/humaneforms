import { describe, it, expect } from "vitest";
import { normalizeAddress, validateAddress } from "./address.js";

describe("normalizeAddress", () => {
  it("uppercases the country and trims/collapses every field", () => {
    expect(
      normalizeAddress({ country: " us ", line1: "1600  Amphitheatre  Pkwy", city: " Mountain View " }),
    ).toEqual({ country: "US", line1: "1600 Amphitheatre Pkwy", line2: undefined, city: "Mountain View", region: undefined, postalCode: undefined });
  });
  it("uppercases postal codes for alphanumeric systems (UK/CA)", () => {
    expect(normalizeAddress({ country: "gb", line1: "10 Downing St", postalCode: "sw1a 2aa" }).postalCode).toBe("SW1A 2AA");
  });
  it("leaves numeric postal codes untouched", () => {
    expect(normalizeAddress({ country: "FR", line1: "x", postalCode: "75001" }).postalCode).toBe("75001");
  });
  it("turns empty optional fields into undefined", () => {
    expect(normalizeAddress({ country: "US", line1: "x", city: "   " }).city).toBeUndefined();
  });
});

describe("validateAddress", () => {
  const usFull = { country: "US", line1: "1600 Amphitheatre Pkwy", city: "Mountain View", region: "CA", postalCode: "94043" };

  it("accepts a complete US address with no messages", () => {
    const r = validateAddress(usFull);
    expect(r.valid).toBe(true);
    expect(r.messages).toHaveLength(0);
  });
  it("accepts a complete UK address even though it has no region", () => {
    const r = validateAddress({ country: "GB", line1: "10 Downing Street", city: "London", postalCode: "SW1A 2AA" });
    expect(r.valid).toBe(true);
    expect(r.messages).toHaveLength(0);
  });
  it("errors with address.country_missing when the country is blank", () => {
    const r = validateAddress({ country: "", line1: "x" });
    expect(r.valid).toBe(false);
    expect(r.messages[0]?.code).toBe("address.country_missing");
  });
  it("errors with address.country_missing for a non ISO-2 code", () => {
    expect(validateAddress({ country: "USA", line1: "x" }).messages[0]?.code).toBe("address.country_missing");
  });
  it("errors with address.line1_missing when the street line is blank", () => {
    const r = validateAddress({ country: "US", line1: "" });
    expect(r.valid).toBe(false);
    expect(r.messages.some((m) => m.code === "address.line1_missing")).toBe(true);
  });
  it("warns (stays valid) when a region-using country omits the region", () => {
    const r = validateAddress({ country: "US", line1: "123 Main St", city: "Anytown", postalCode: "12345" });
    expect(r.valid).toBe(true);
    expect(r.messages.some((m) => m.code === "address.region_missing" && m.severity === "warn")).toBe(true);
  });
  it("warns on a postal code that does not match the country format", () => {
    const r = validateAddress({ ...usFull, postalCode: "ABCDE" });
    expect(r.messages.some((m) => m.code === "address.postal_format" && m.severity === "warn")).toBe(true);
  });
  it("does NOT ask for a postal code in countries that have none (Hong Kong)", () => {
    const r = validateAddress({ country: "HK", line1: "8 Connaught Rd", city: "Central" });
    expect(r.valid).toBe(true);
    expect(r.messages.some((m) => m.code === "address.postal_missing")).toBe(false);
  });
});
