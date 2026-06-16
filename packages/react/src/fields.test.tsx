import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NameField, EmailField, PhoneField, DobField } from "./fields.js";

function blurAfterTyping(value: string) {
  const input = screen.getByRole("textbox") as HTMLInputElement;
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
  return input;
}

describe("field wrappers", () => {
  it("NameField accepts a mononym with no messages", () => {
    render(<NameField />);
    blurAfterTyping("Cher");
    expect(screen.queryByRole("list")).toBeNull();
  });
  it("EmailField flags a missing @", () => {
    render(<EmailField />);
    blurAfterTyping("not-an-email");
    expect(screen.getByRole("list").textContent).toContain("@");
  });
  it("PhoneField accepts a national number given a default country", () => {
    render(<PhoneField defaultCountry="US" />);
    blurAfterTyping("(650) 253-0000");
    expect(screen.queryByRole("list")).toBeNull();
  });
  it("DobField rejects a future date of birth", () => {
    render(<DobField today="2026-06-13" />);
    blurAfterTyping("2030-01-01");
    expect(screen.getByRole("list").textContent?.toLowerCase()).toContain("future");
  });
});
