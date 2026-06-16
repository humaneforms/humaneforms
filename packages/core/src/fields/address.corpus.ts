import type { AddressInput } from "./address.js";

export interface AddressCase {
  input: AddressInput;
  /** Whether a correct validator must consider this valid (errors → false). */
  valid: boolean;
  reason: string;
  tags?: string[];
}

/**
 * Falsehoods exercised: addresses are NOT all US-shaped; not every country has
 * states (GB); not every address has a postal code (HK/IE); postal-code formats
 * differ per country. Only a missing country or street line makes an address
 * invalid — the rest are warnings that keep it valid.
 */
export const addressCorpus: AddressCase[] = [
  { input: { country: "US", line1: "1600 Amphitheatre Pkwy", city: "Mountain View", region: "CA", postalCode: "94043" }, valid: true, reason: "Complete US address", tags: ["us"] },
  { input: { country: "us", line1: "1 Infinite Loop", city: "Cupertino", region: "CA", postalCode: "95014" }, valid: true, reason: "Lowercase country code is normalized", tags: ["case"] },
  { input: { country: "GB", line1: "10 Downing Street", city: "London", postalCode: "SW1A 2AA" }, valid: true, reason: "UK address with no region is valid", tags: ["gb", "no-region"] },
  { input: { country: "HK", line1: "8 Connaught Road", city: "Central" }, valid: true, reason: "Hong Kong has no postal codes — still valid", tags: ["hk", "no-postal"] },
  { input: { country: "IE", line1: "1 Grafton Street", city: "Dublin" }, valid: true, reason: "Irish address without an Eircode is valid", tags: ["ie", "no-postal"] },
  { input: { country: "FR", line1: "5 Avenue Anatole France", city: "Paris", postalCode: "75007" }, valid: true, reason: "French address", tags: ["fr"] },
  { input: { country: "JP", line1: "2-1 Marunouchi", city: "Tokyo", region: "Tokyo", postalCode: "100-0005" }, valid: true, reason: "Japanese address with hyphenated postal code", tags: ["jp"] },
  { input: { country: "US", line1: "123 Main St", city: "Anytown", postalCode: "12345" }, valid: true, reason: "Missing region only warns — stays valid", tags: ["warn"] },
  { input: { country: "ZZ", line1: "1 Somewhere Rd", city: "Nowhere" }, valid: true, reason: "Unknown country uses the lenient default and stays valid", tags: ["unknown-country"] },
  { input: { country: "", line1: "1 Main St" }, valid: false, reason: "A country is required" },
  { input: { country: "USA", line1: "1 Main St" }, valid: false, reason: "Country must be a two-letter ISO code" },
  { input: { country: "US", line1: "" }, valid: false, reason: "A street line is required" },
];
