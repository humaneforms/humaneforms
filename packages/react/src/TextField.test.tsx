import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { validateName } from "@humaneforms/core";
import { TextField } from "./TextField.js";

describe("TextField", () => {
  it("hides messages until blur, then shows them and marks aria-invalid", () => {
    render(<TextField validate={validateName} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(screen.queryByRole("list")).toBeNull();
    fireEvent.blur(input); // value is "" (invalid) and now touched
    expect(screen.getByRole("list")).toBeTruthy();
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });
  it("clears messages once the value becomes valid", () => {
    render(<TextField validate={validateName} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.blur(input);
    fireEvent.change(input, { target: { value: "Cher" } });
    expect(input.value).toBe("Cher");
    expect(screen.queryByRole("list")).toBeNull();
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });
  it("calls onResult with the validation result", () => {
    const onResult = vi.fn();
    render(<TextField validate={validateName} onResult={onResult} />);
    expect(onResult).toHaveBeenCalled();
  });
});
