import type { FieldCase } from "../corpus/types.js";

/**
 * Falsehoods exercised: a name does NOT require two parts, ASCII, a "last name",
 * Latin script, or a max of N characters. Names contain marks, apostrophes,
 * hyphens, spaces, and particles. The only hard rules: a name must contain at
 * least one letter and must not be absurdly long (abuse guard).
 */
export const nameCorpus: FieldCase[] = [
  { input: "Cher", valid: true, reason: "Mononym — names need not have two parts", normalized: "Cher", tags: ["mononym"] },
  { input: "José", valid: true, reason: "Accented Latin letters are valid", normalized: "José", tags: ["unicode"] },
  { input: "François", valid: true, reason: "Cedilla is a valid letter", normalized: "François", tags: ["unicode"] },
  { input: "Müller", valid: true, reason: "Umlaut is a valid letter", normalized: "Müller", tags: ["unicode"] },
  { input: "O'Brien", valid: true, reason: "Apostrophes occur in names", normalized: "O'Brien", tags: ["punctuation"] },
  { input: "D’Angelo", valid: true, reason: "Curly apostrophe is also valid", normalized: "D’Angelo", tags: ["punctuation"] },
  { input: "Anne-Marie", valid: true, reason: "Hyphenated names are valid", normalized: "Anne-Marie", tags: ["punctuation"] },
  { input: "van der Berg", valid: true, reason: "Particles and internal spaces are valid", normalized: "van der Berg", tags: ["particles"] },
  { input: "李", valid: true, reason: "A single CJK character is a full name", normalized: "李", tags: ["cjk"] },
  { input: "山田太郎", valid: true, reason: "CJK names have no spaces", normalized: "山田太郎", tags: ["cjk"] },
  { input: "علي", valid: true, reason: "Arabic script names are valid", normalized: "علي", tags: ["rtl"] },
  { input: "Владимир", valid: true, reason: "Cyrillic script names are valid", normalized: "Владимир", tags: ["unicode"] },
  { input: "Nguyễn", valid: true, reason: "Stacked diacritics are valid", normalized: "Nguyễn", tags: ["unicode"] },
  { input: "  José  ", valid: true, reason: "Surrounding whitespace is trimmed, not rejected", normalized: "José", tags: ["whitespace"] },
  { input: "Anne   Marie", valid: true, reason: "Internal whitespace runs collapse to one space", normalized: "Anne Marie", tags: ["whitespace"] },
  { input: "", valid: false, reason: "Empty input is not a name" },
  { input: "   ", valid: false, reason: "Whitespace-only input is not a name" },
  { input: "123", valid: false, reason: "A name must contain at least one letter" },
  { input: "!@#", valid: false, reason: "Punctuation-only input is not a name" },
];
