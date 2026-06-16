import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { makeResult, type ValidationResult } from "../types.js";

export interface PhoneOptions {
  /** ISO 3166-1 alpha-2 country used to parse national-format numbers. */
  defaultCountry?: CountryCode;
}

/** Parse to E.164 when possible; otherwise return the trimmed input unchanged. */
export function normalizePhone(input: string, options: PhoneOptions = {}): string {
  const trimmed = input.trim();
  const parsed = parsePhoneNumberFromString(trimmed, options.defaultCountry);
  return parsed ? parsed.number : trimmed;
}

/**
 * Validate a phone number. Errors only when the input is empty or NOT a possible
 * number (wrong length/shape). A number that is possible but not recognized as
 * assigned stays VALID with a "phone.unverified" warning — numbering plans change,
 * so libphonenumber's metadata may simply be behind reality. Formatting is cosmetic.
 */
export function validatePhone(input: string, options: PhoneOptions = {}): ValidationResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return makeResult([
      { code: "phone.empty", severity: "error", message: "A phone number is required." },
    ]);
  }

  const parsed = parsePhoneNumberFromString(trimmed, options.defaultCountry);
  if (!parsed || !parsed.isPossible()) {
    return makeResult(
      [{ code: "phone.invalid", severity: "error", message: "This does not look like a valid phone number." }],
      trimmed,
    );
  }

  const normalized = parsed.number;
  if (parsed.isValid()) {
    return makeResult([], normalized);
  }
  return makeResult(
    [{
      code: "phone.unverified",
      severity: "warn",
      message: "This number has a valid length but isn't recognized as assigned. Numbering plans change, so it may still be real.",
      falsehood: "phone-metadata-is-complete",
    }],
    normalized,
  );
}
