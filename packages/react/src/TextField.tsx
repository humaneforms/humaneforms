import { useEffect } from "react";
import type { InputHTMLAttributes } from "react";
import type { ValidationResult } from "@humaneforms/core";
import { useHumaneField } from "./useHumaneField.js";
import { FieldMessages } from "./FieldMessages.js";

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "defaultValue"> {
  /** Core validator for this field, e.g. validateName. */
  validate: (value: string) => ValidationResult;
  initialValue?: string;
  validateOn?: "change" | "blur";
  /** Called whenever the validation result changes. */
  onResult?: (result: ValidationResult) => void;
}

/** Unstyled text field: an <input> plus a severity-tagged message list. */
export function TextField({
  validate,
  initialValue = "",
  validateOn = "blur",
  onResult,
  ...inputProps
}: TextFieldProps) {
  const field = useHumaneField<string>({ initialValue, validate, validateOn });

  useEffect(() => {
    onResult?.(field.result);
  }, [field.result, onResult]);

  const invalid = field.showMessages && !field.result.valid;

  return (
    <>
      <input
        {...inputProps}
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
        onBlur={(e) => {
          field.onBlur();
          inputProps.onBlur?.(e);
        }}
        aria-invalid={invalid ? true : undefined}
      />
      {field.showMessages ? <FieldMessages messages={field.result.messages} /> : null}
    </>
  );
}
