import { describe, it, expect } from "vitest";
import { phoneCorpus } from "./phone.corpus.js";
import { validatePhone } from "./phone.js";

describe("phone corpus conformance", () => {
  for (const c of phoneCorpus) {
    it(`${c.valid ? "accepts" : "rejects"} ${JSON.stringify(c.input)} — ${c.reason}`, () => {
      const r = validatePhone(c.input);
      expect(r.valid).toBe(c.valid);
      if (c.valid && c.normalized !== undefined) {
        expect(r.normalized).toBe(c.normalized);
      }
    });
  }
});
