import type { FieldCase } from "../corpus/types.js";

/**
 * Falsehoods exercised: phone numbers are NOT all 10 digits, NOT US-shaped, and
 * formatting (spaces, dashes, parens) is cosmetic. Valid inputs across countries
 * normalize to E.164. Inputs are given in international (+) form so they parse
 * without a default country; national-format parsing is covered in phone.test.ts.
 * Note: "valid" here means "accepted" — a number that is possible but not yet
 * recognized as assigned is still accepted (with a warning), so valid stays true.
 */
export const phoneCorpus: FieldCase[] = [
  { input: "+14155552671", valid: true, reason: "US number in E.164", normalized: "+14155552671", tags: ["us"] },
  { input: "+1 415 555 2671", valid: true, reason: "Spaces are cosmetic", normalized: "+14155552671", tags: ["us", "formatting"] },
  { input: "+442071838750", valid: true, reason: "UK number", normalized: "+442071838750", tags: ["uk"] },
  { input: "+44 20 7183 8750", valid: true, reason: "UK number with spacing", normalized: "+442071838750", tags: ["uk", "formatting"] },
  { input: "+33142685300", valid: true, reason: "French number (9 national digits)", normalized: "+33142685300", tags: ["fr"] },
  { input: "+33 1 42 68 53 00", valid: true, reason: "French number with spacing", normalized: "+33142685300", tags: ["fr", "formatting"] },
  { input: "+919876543210", valid: true, reason: "Indian mobile number", normalized: "+919876543210", tags: ["in"] },
  { input: "  +14155552671  ", valid: true, reason: "Surrounding whitespace is trimmed", normalized: "+14155552671", tags: ["whitespace"] },
  { input: "", valid: false, reason: "Empty input is not a phone number" },
  { input: "not a phone", valid: false, reason: "Non-numeric text is not a phone number" },
  { input: "+1", valid: false, reason: "Too short to be a possible number" },
  { input: "12345", valid: false, reason: "No country context and not a possible number" },
];
