import { makeResult, type ValidationMessage, type ValidationResult } from "../types.js";

/** Trim, NFC, and lowercase ONLY the domain (local parts are case-sensitive). */
export function normalizeEmail(input: string): string {
  const trimmed = input.trim().normalize("NFC");
  const at = trimmed.lastIndexOf("@");
  if (at === -1) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1).toLowerCase();
  return `${local}@${domain}`;
}

const MAX_EMAIL_LENGTH = 254; // RFC 5321 maximum forward-path length

/**
 * Validate an email pragmatically. Error only on structurally-broken input
 * (empty, no @, empty local/domain, absurd length). Warn — but stay valid — on
 * the unusual-but-legal (a dotless domain). Subaddressing, multiple dots, IDN
 * domains, and case-sensitive local parts are all accepted.
 */
export function validateEmail(input: string): ValidationResult {
  const normalized = normalizeEmail(input);

  if (normalized.length === 0) {
    return makeResult([
      { code: "email.empty", severity: "error", message: "An email address is required." },
    ]);
  }
  if (normalized.length > MAX_EMAIL_LENGTH) {
    return makeResult(
      [{ code: "email.too_long", severity: "error", message: `An email address must be at most ${MAX_EMAIL_LENGTH} characters.` }],
      normalized,
    );
  }

  const at = normalized.lastIndexOf("@");
  if (at === -1) {
    return makeResult(
      [{ code: "email.no_at", severity: "error", message: "An email address must contain an @ sign.", falsehood: "email-without-at" }],
      normalized,
    );
  }

  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  if (local.length === 0) {
    return makeResult(
      [{ code: "email.empty_local", severity: "error", message: "An email address must have something before the @ sign." }],
      normalized,
    );
  }
  if (domain.length === 0) {
    return makeResult(
      [{ code: "email.empty_domain", severity: "error", message: "An email address must have a domain after the @ sign." }],
      normalized,
    );
  }

  const messages: ValidationMessage[] = [];
  if (!domain.includes(".")) {
    messages.push({
      code: "email.domain_no_dot",
      severity: "warn",
      message: "This domain has no dot. That is unusual, but valid for some internal addresses.",
      falsehood: "email-domain-needs-dot",
    });
  }
  return makeResult(messages, normalized);
}
