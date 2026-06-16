import { ruleFor } from "./address.data.js";
import { makeResult, type ValidationMessage, type ValidationResult } from "../types.js";

export interface AddressInput {
  /** ISO 3166-1 alpha-2 country code (case-insensitive on input). */
  country: string;
  /** Street address / PO box — the only universally-required line. */
  line1: string;
  line2?: string;
  city?: string;
  /** State / province / prefecture, where applicable. */
  region?: string;
  postalCode?: string;
}

function clean(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Trim/collapse all fields, uppercase the country, and uppercase postal codes
 *  for alphanumeric systems. Empty optional fields become undefined. */
export function normalizeAddress(input: AddressInput): AddressInput {
  const country = (clean(input.country) ?? "").toUpperCase();
  const rule = ruleFor(country);
  let postalCode = clean(input.postalCode);
  if (postalCode && rule.uppercasePostal) postalCode = postalCode.toUpperCase();
  return {
    country,
    line1: clean(input.line1) ?? "",
    line2: clean(input.line2),
    city: clean(input.city),
    region: clean(input.region),
    postalCode,
  };
}

/**
 * Validate a structured address. Errors only on a missing country (must be ISO-2)
 * or a missing street line — the two things without which it is not an address.
 * Everything else is a WARNING that keeps the address valid: a missing region
 * (not every country has states), a missing postal code (not every address has
 * one — see Hong Kong), or a postal code that does not match the country format.
 */
export function validateAddress(input: AddressInput): ValidationResult {
  const n = normalizeAddress(input);

  if (!/^[A-Z]{2}$/.test(n.country)) {
    return makeResult([
      { code: "address.country_missing", severity: "error", message: "A two-letter (ISO) country code is required.", falsehood: "address-without-country" },
    ]);
  }

  const rule = ruleFor(n.country);
  const messages: ValidationMessage[] = [];

  if (n.line1.length === 0) {
    messages.push({ code: "address.line1_missing", severity: "error", message: "A street address (line 1) is required." });
  }
  if (!n.city) {
    messages.push({ code: "address.city_missing", severity: "warn", message: "Most addresses include a city or locality." });
  }
  if (rule.requiresRegion && !n.region) {
    messages.push({ code: "address.region_missing", severity: "warn", message: "Addresses in this country usually include a state or region.", falsehood: "every-country-has-states" });
  }
  if (rule.usesPostalCode) {
    if (!n.postalCode) {
      messages.push({ code: "address.postal_missing", severity: "warn", message: "Addresses in this country usually include a postal code." });
    } else if (rule.postalPattern && !rule.postalPattern.test(n.postalCode)) {
      messages.push({ code: "address.postal_format", severity: "warn", message: "This postal code does not match the usual format for this country.", falsehood: "postal-codes-have-one-format" });
    }
  }

  const formatted = [n.line1, n.line2, n.city, n.region, n.postalCode, n.country].filter(Boolean).join(", ");
  return makeResult(messages, formatted.length > 0 ? formatted : undefined);
}
