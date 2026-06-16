import type { FieldCase } from "../corpus/types.js";

/**
 * Falsehoods exercised: a valid email is NOT "one @, no +, exactly one dot in a
 * domain that must have a dot". Emails allow subaddressing (+tags), multiple
 * dots, IDN (unicode) domains, and case-sensitive local parts. We normalize by
 * lowercasing ONLY the domain (local parts are case-sensitive per RFC). We never
 * hard-reject the unusual-but-legal; only structurally-broken input is invalid.
 */
export const emailCorpus: FieldCase[] = [
  { input: "user@example.com", valid: true, reason: "Ordinary address", normalized: "user@example.com" },
  { input: "user+tag@example.com", valid: true, reason: "Subaddressing with + is valid", normalized: "user+tag@example.com", tags: ["subaddressing"] },
  { input: "first.last@example.com", valid: true, reason: "Dots in the local part are valid", normalized: "first.last@example.com" },
  { input: "user@mail.example.co.uk", valid: true, reason: "Multiple subdomains are valid", normalized: "user@mail.example.co.uk" },
  { input: "USER@Example.COM", valid: true, reason: "Domain is case-insensitive (lowercased); local case is preserved", normalized: "USER@example.com", tags: ["case"] },
  { input: "  user@example.com  ", valid: true, reason: "Surrounding whitespace is trimmed", normalized: "user@example.com", tags: ["whitespace"] },
  { input: "test@münchen.de", valid: true, reason: "Internationalized (IDN) domains are valid", normalized: "test@münchen.de", tags: ["idn"] },
  { input: "user@localhost", valid: true, reason: "A dotless domain is unusual but valid (warns, not rejects)", normalized: "user@localhost", tags: ["warn"] },
  { input: "", valid: false, reason: "Empty input is not an email" },
  { input: "userexample.com", valid: false, reason: "An email must contain an @" },
  { input: "@example.com", valid: false, reason: "An email must have a local part before the @" },
  { input: "user@", valid: false, reason: "An email must have a domain after the @" },
];
