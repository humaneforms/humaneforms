/** Per-country rules. Absent fields fall back to DEFAULT_RULE (lenient). */
export interface CountryRule {
  /** Does this country use postal codes at all? (Hong Kong does not.) */
  usesPostalCode: boolean;
  /** Is a state/region/province a normal part of the address here? */
  requiresRegion: boolean;
  /** Expected postal-code shape, tested only when a code is supplied. */
  postalPattern?: RegExp;
  /** Postal codes are conventionally uppercased here (alphanumeric systems). */
  uppercasePostal?: boolean;
}

const RULES: Record<string, CountryRule> = {
  US: { usesPostalCode: true, requiresRegion: true, postalPattern: /^\d{5}(-\d{4})?$/ },
  CA: { usesPostalCode: true, requiresRegion: true, postalPattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/, uppercasePostal: true },
  GB: { usesPostalCode: true, requiresRegion: false, postalPattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/, uppercasePostal: true },
  FR: { usesPostalCode: true, requiresRegion: false, postalPattern: /^\d{5}$/ },
  DE: { usesPostalCode: true, requiresRegion: false, postalPattern: /^\d{5}$/ },
  AU: { usesPostalCode: true, requiresRegion: true, postalPattern: /^\d{4}$/ },
  IN: { usesPostalCode: true, requiresRegion: true, postalPattern: /^\d{6}$/ },
  JP: { usesPostalCode: true, requiresRegion: true, postalPattern: /^\d{3}-?\d{4}$/ },
  IE: { usesPostalCode: false, requiresRegion: false }, // Eircode exists but is optional; many addresses lack one
  HK: { usesPostalCode: false, requiresRegion: false }, // Hong Kong has no postal code system at all
};

/** Lenient fallback for any country not in the table. */
export const DEFAULT_RULE: CountryRule = { usesPostalCode: true, requiresRegion: false };

/** Look up the rule for an ISO 3166-1 alpha-2 country code (already uppercased). */
export function ruleFor(country: string): CountryRule {
  return RULES[country] ?? DEFAULT_RULE;
}
