import { makeResult, type ValidationResult } from "../types.js";

/** Trim, collapse internal whitespace, and apply NFC. Case is preserved. */
export function normalizeName(input: string): string {
  return input.trim().replace(/\s+/g, " ").normalize("NFC");
}

const MAX_NAME_LENGTH = 1000; // generous abuse guard, not a real-name limit
const HAS_LETTER = /\p{L}/u;

/**
 * Validate a personal name. Humane rules only: non-empty, contains at least one
 * letter, and within an abuse-guard length. Never rejects on script, length of
 * a real name, presence of spaces/apostrophes/hyphens/particles, or "needs two parts".
 */
export function validateName(input: string): ValidationResult {
  const normalized = normalizeName(input);

  if (normalized.length === 0) {
    return makeResult([
      { code: "name.empty", severity: "error", message: "A name is required." },
    ]);
  }
  if (normalized.length > MAX_NAME_LENGTH) {
    return makeResult(
      [{ code: "name.too_long", severity: "error", message: `A name must be at most ${MAX_NAME_LENGTH} characters.` }],
      normalized,
    );
  }
  if (!HAS_LETTER.test(normalized)) {
    return makeResult(
      [{
        code: "name.no_letters",
        severity: "error",
        message: "A name must contain at least one letter.",
        falsehood: "names-without-letters",
      }],
      normalized,
    );
  }
  return makeResult([], normalized);
}
