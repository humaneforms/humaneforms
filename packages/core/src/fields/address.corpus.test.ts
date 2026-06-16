import { describe, it, expect } from "vitest";
import { addressCorpus } from "./address.corpus.js";
import { validateAddress } from "./address.js";

describe("address corpus conformance", () => {
  for (const c of addressCorpus) {
    it(`${c.valid ? "accepts" : "rejects"} ${JSON.stringify(c.input)} — ${c.reason}`, () => {
      expect(validateAddress(c.input).valid).toBe(c.valid);
    });
  }
});
