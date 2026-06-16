import { describe, it, expect } from "vitest";
import {
  validateName, normalizeName, nameCorpus, makeResult,
  validateEmail, normalizeEmail, emailCorpus,
  validatePhone, normalizePhone, phoneCorpus,
  validateAddress, normalizeAddress, addressCorpus,
  validateDob, normalizeDate, dobCorpus,
} from "./index.js";

describe("public API", () => {
  it("exports the name field", () => {
    expect(typeof validateName).toBe("function");
    expect(typeof normalizeName).toBe("function");
    expect(nameCorpus.length).toBeGreaterThan(0);
  });
  it("exports the email field", () => {
    expect(typeof validateEmail).toBe("function");
    expect(typeof normalizeEmail).toBe("function");
    expect(emailCorpus.length).toBeGreaterThan(0);
  });
  it("exports the phone field", () => {
    expect(typeof validatePhone).toBe("function");
    expect(typeof normalizePhone).toBe("function");
    expect(phoneCorpus.length).toBeGreaterThan(0);
  });
  it("exports the address field", () => {
    expect(typeof validateAddress).toBe("function");
    expect(typeof normalizeAddress).toBe("function");
    expect(addressCorpus.length).toBeGreaterThan(0);
  });
  it("exports the dob field", () => {
    expect(typeof validateDob).toBe("function");
    expect(typeof normalizeDate).toBe("function");
    expect(dobCorpus.length).toBeGreaterThan(0);
  });
  it("exports makeResult helper", () => {
    expect(makeResult([]).valid).toBe(true);
  });
});
