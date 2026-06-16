import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { validateName } from "@humaneforms/core";
import { useHumaneField } from "./useHumaneField.js";

describe("useHumaneField", () => {
  it("computes a result from the current value", () => {
    const { result } = renderHook(() => useHumaneField({ initialValue: "", validate: validateName }));
    expect(result.current.result.valid).toBe(false); // empty name is invalid
    act(() => result.current.setValue("Cher"));
    expect(result.current.result.valid).toBe(true);
  });
  it("hides messages until blurred in the default (blur) mode", () => {
    const { result } = renderHook(() => useHumaneField({ initialValue: "", validate: validateName }));
    expect(result.current.showMessages).toBe(false);
    act(() => result.current.onBlur());
    expect(result.current.touched).toBe(true);
    expect(result.current.showMessages).toBe(true);
  });
  it("shows messages immediately in change mode", () => {
    const { result } = renderHook(() => useHumaneField({ initialValue: "", validate: validateName, validateOn: "change" }));
    expect(result.current.showMessages).toBe(true);
  });
});
