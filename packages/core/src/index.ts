export const VERSION = "0.0.1";

export type { Severity, ValidationMessage, ValidationResult } from "./types.js";
export { makeResult } from "./types.js";
export type { FieldCase } from "./corpus/types.js";

export { validateName, normalizeName } from "./fields/name.js";
export { nameCorpus } from "./fields/name.corpus.js";

export { validateEmail, normalizeEmail } from "./fields/email.js";
export { emailCorpus } from "./fields/email.corpus.js";

export { validatePhone, normalizePhone, type PhoneOptions } from "./fields/phone.js";
export { phoneCorpus } from "./fields/phone.corpus.js";
export type { CountryCode } from "libphonenumber-js";

export { validateAddress, normalizeAddress, type AddressInput } from "./fields/address.js";
export { addressCorpus, type AddressCase } from "./fields/address.corpus.js";

export { validateDob, normalizeDate, type DobOptions } from "./fields/dob.js";
export { dobCorpus } from "./fields/dob.corpus.js";
