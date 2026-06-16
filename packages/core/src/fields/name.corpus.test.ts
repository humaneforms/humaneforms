import { describe, it, expect } from "vitest";
import { nameCorpus } from "./name.corpus.js";
import { validateName } from "./name.js";

describe("name corpus conformance", () => {
  for (const c of nameCorpus) {
    it(`${c.valid ? "accepts" : "rejects"} ${JSON.stringify(c.input)} — ${c.reason}`, () => {
      const r = validateName(c.input);
      expect(r.valid).toBe(c.valid);
      if (c.valid && c.normalized !== undefined) {
        expect(r.normalized).toBe(c.normalized);
      }
    });
  }
});
