import type { FieldCase } from "../corpus/types.js";

/**
 * Falsehoods exercised: dates are NOT unambiguous strings (we refuse to guess
 * DD/MM vs MM/DD), an "impossible" date is not a real date, and ISO is the
 * canonical form. These cases are time-independent on purpose — future-date and
 * implausible-age behavior depends on "today" and is covered in dob.test.ts, so
 * this corpus never goes stale as the calendar advances.
 */
export const dobCorpus: FieldCase[] = [
  { input: "1990-05-15", valid: true, reason: "Ordinary ISO date", normalized: "1990-05-15" },
  { input: "1990-5-3", valid: true, reason: "Single-digit month/day are zero-padded", normalized: "1990-05-03" },
  { input: "  2000-12-31  ", valid: true, reason: "Surrounding whitespace is trimmed", normalized: "2000-12-31", tags: ["whitespace"] },
  { input: "2024-02-29", valid: true, reason: "Valid leap day", normalized: "2024-02-29", tags: ["leap"] },
  { input: "", valid: false, reason: "Empty input is not a date" },
  { input: "13/05/1990", valid: false, reason: "Ambiguous slash format is refused, not guessed" },
  { input: "1990/05/15", valid: false, reason: "Slash-separated dates are not ISO" },
  { input: "2020-02-30", valid: false, reason: "February 30th does not exist" },
  { input: "2023-02-29", valid: false, reason: "2023 is not a leap year" },
  { input: "not a date", valid: false, reason: "Free text is not a date" },
];
