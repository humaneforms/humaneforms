export type Severity = "warn" | "error";

export interface ValidationMessage {
  /** Stable machine code, e.g. "name.empty". */
  code: string;
  severity: Severity;
  /** Human-readable explanation. */
  message: string;
  /** Slug of the falsehood this message relates to, for linking to docs. */
  falsehood?: string;
}

export interface ValidationResult {
  /** false iff at least one message has severity "error". */
  valid: boolean;
  /** Normalized value when one can be produced (independent of validity level). */
  normalized?: string;
  messages: ValidationMessage[];
}

/** Build a ValidationResult, deriving `valid` from the presence of error messages. */
export function makeResult(
  messages: ValidationMessage[],
  normalized?: string,
): ValidationResult {
  const valid = !messages.some((m) => m.severity === "error");
  return { valid, normalized, messages };
}
