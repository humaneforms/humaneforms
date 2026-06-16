import { describe, it, expect } from "vitest";
import { dobCorpus } from "./dob.corpus.js";
import { validateDob } from "./dob.js";

describe("dob corpus conformance", () => {
  for (const c of dobCorpus) {
    it(`${c.valid ? "accepts" : "rejects"} ${JSON.stringify(c.input)} — ${c.reason}`, () => {
      const r = validateDob(c.input);
      expect(r.valid).toBe(c.valid);
      if (c.valid && c.normalized !== undefined) {
        expect(r.normalized).toBe(c.normalized);
      }
    });
  }
});
