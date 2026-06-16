export interface FieldCase {
  /** Raw input as a user might enter it. */
  input: string;
  /** Whether a correct ("humane") validator must consider this valid. */
  valid: boolean;
  /** Why — names the falsehood or rule this case exercises. */
  reason: string;
  /** Expected normalized output when `valid` is true. Omit if not asserted. */
  normalized?: string;
  /** Optional tags for filtering (e.g. "unicode", "mononym"). */
  tags?: string[];
}
