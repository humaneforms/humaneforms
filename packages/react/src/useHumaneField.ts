import { useCallback, useMemo, useState } from "react";
import type { ValidationResult } from "@humaneforms/core";

export interface UseHumaneFieldOptions<T> {
  initialValue: T;
  validate: (value: T) => ValidationResult;
  /** When to surface messages: on every change, or only after blur (default). */
  validateOn?: "change" | "blur";
}

export interface HumaneFieldState<T> {
  value: T;
  setValue: (value: T) => void;
  onBlur: () => void;
  touched: boolean;
  result: ValidationResult;
  /** Whether the consumer should display messages right now. */
  showMessages: boolean;
}

/** Headless field state: owns value + touched, derives the validation result. */
export function useHumaneField<T>(options: UseHumaneFieldOptions<T>): HumaneFieldState<T> {
  const { initialValue, validate, validateOn = "blur" } = options;
  const [value, setValue] = useState<T>(initialValue);
  const [touched, setTouched] = useState(false);
  const result = useMemo(() => validate(value), [validate, value]);
  const onBlur = useCallback(() => setTouched(true), []);
  const showMessages = validateOn === "change" || touched;
  return { value, setValue, onBlur, touched, result, showMessages };
}
