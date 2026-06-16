import { describe, it, expect } from "vitest";
import { emailCorpus } from "./email.corpus.js";
import { validateEmail } from "./email.js";

describe("email corpus conformance", () => {
  for (const c of emailCorpus) {
    it(`${c.valid ? "accepts" : "rejects"} ${JSON.stringify(c.input)} — ${c.reason}`, () => {
      const r = validateEmail(c.input);
      expect(r.valid).toBe(c.valid);
      if (c.valid && c.normalized !== undefined) {
        expect(r.normalized).toBe(c.normalized);
      }
    });
  }
});
