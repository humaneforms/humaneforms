import { validateName, validateEmail, validatePhone, validateDob, type CountryCode } from "@humaneforms/core";
import { TextField, type TextFieldProps } from "./TextField.js";

type WrapperProps = Omit<TextFieldProps, "validate">;

export function NameField(props: WrapperProps) {
  return <TextField validate={validateName} {...props} />;
}

export function EmailField(props: WrapperProps) {
  return <TextField validate={validateEmail} {...props} />;
}

export interface PhoneFieldProps extends WrapperProps {
  defaultCountry?: CountryCode;
}
export function PhoneField({ defaultCountry, ...props }: PhoneFieldProps) {
  return <TextField validate={(v) => validatePhone(v, { defaultCountry })} {...props} />;
}

export interface DobFieldProps extends WrapperProps {
  today?: string;
  maxAgeYears?: number;
}
export function DobField({ today, maxAgeYears, ...props }: DobFieldProps) {
  return <TextField validate={(v) => validateDob(v, { today, maxAgeYears })} {...props} />;
}
