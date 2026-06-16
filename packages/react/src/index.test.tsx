import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  useHumaneField, FieldMessages, TextField,
  NameField, EmailField, PhoneField, DobField,
} from "./index.js";

describe("public API", () => {
  it("exports the hook and components", () => {
    expect(typeof useHumaneField).toBe("function");
    expect(typeof FieldMessages).toBe("function");
    expect(typeof TextField).toBe("function");
    expect(typeof NameField).toBe("function");
    expect(typeof EmailField).toBe("function");
    expect(typeof PhoneField).toBe("function");
    expect(typeof DobField).toBe("function");
  });
  it("renders a NameField input from the package entry", () => {
    render(<NameField />);
    expect(screen.getByRole("textbox")).toBeTruthy();
  });
});
