interface DateParts { y: number; m: number; d: number }

const pad = (n: number): string => String(n).padStart(2, "0");

/** Parse strict ISO YYYY-M-D (1–2 digit month/day allowed). Returns null on any
 *  non-ISO format or impossible calendar date (e.g. 2020-02-30, 2023-02-29). */
function parseIsoDate(value: string): DateParts | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { y, m: mo, d };
}

/** Normalize a date to ISO YYYY-MM-DD; return the trimmed input if unparseable. */
export function normalizeDate(input: string): string {
  const parsed = parseIsoDate(input);
  return parsed ? `${parsed.y}-${pad(parsed.m)}-${pad(parsed.d)}` : input.trim();
}

import { makeResult, type ValidationMessage, type ValidationResult } from "../types.js";

export interface DobOptions {
  /** ISO date treated as "today" (injected for deterministic tests). */
  today?: string;
  /** Ages above this only warn (never reject). Default 130. */
  maxAgeYears?: number;
}

/** Compare two DateParts: negative if a < b, positive if a > b, 0 if equal. */
function compareParts(a: DateParts, b: DateParts): number {
  if (a.y !== b.y) return a.y - b.y;
  if (a.m !== b.m) return a.m - b.m;
  return a.d - b.d;
}

function ageInYears(birth: DateParts, today: DateParts): number {
  let age = today.y - birth.y;
  if (today.m < birth.m || (today.m === birth.m && today.d < birth.d)) age -= 1;
  return age;
}

function todayParts(): DateParts {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

/**
 * Validate a date of birth. Errors on empty, unparseable (we do NOT guess
 * ambiguous formats like DD/MM vs MM/DD), or a future date. Warns — but stays
 * valid — on an implausible age (>130), so a real centenarian is never rejected.
 */
export function validateDob(input: string, options: DobOptions = {}): ValidationResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return makeResult([{ code: "date.empty", severity: "error", message: "A date is required." }]);
  }

  const parsed = parseIsoDate(trimmed);
  if (!parsed) {
    return makeResult(
      [{ code: "date.unparseable", severity: "error", message: "Enter the date as YYYY-MM-DD.", falsehood: "dates-are-unambiguous" }],
      trimmed,
    );
  }

  const normalized = `${parsed.y}-${pad(parsed.m)}-${pad(parsed.d)}`;
  const today = options.today ? parseIsoDate(options.today) ?? todayParts() : todayParts();

  if (compareParts(parsed, today) > 0) {
    return makeResult(
      [{ code: "date.future", severity: "error", message: "A date of birth cannot be in the future.", falsehood: "dob-cannot-be-future" }],
      normalized,
    );
  }

  const messages: ValidationMessage[] = [];
  const maxAge = options.maxAgeYears ?? 130;
  if (ageInYears(parsed, today) > maxAge) {
    messages.push({ code: "date.implausible_age", severity: "warn", message: `This implies an age over ${maxAge}, which is unusual — please double-check.` });
  }
  return makeResult(messages, normalized);
}
