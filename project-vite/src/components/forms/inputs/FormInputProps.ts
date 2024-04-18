import { AutocompleteProps, SelectProps, TextFieldProps } from "@mui/material";
import { DatePickerProps } from "@mui/x-date-pickers";
import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

// FormInputProps is a generic type that takes a FieldValues type as an argument
export type FormInputProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  rules?: RegisterOptions;
};

// FormTextFieldProps is a generic type that extends FormInputProps and TextFieldProps
export type FormTextFieldProps<TFieldValues extends FieldValues = FieldValues> =
  FormInputProps<TFieldValues> & TextFieldProps;

// FormSelectProps is a generic type that extends FormInputProps and SelectProps
export type FormSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  menuItems: { value: string | number; label: string }[];
} & FormInputProps<TFieldValues> &
  SelectProps;

// FormCheckboxGroupProps is a generic type that extends FormInputProps
export type FormCheckboxGroupProps<
  TFieldValues extends FieldValues = FieldValues
> = {
  checkBoxes: { name: Path<TFieldValues>; label: string }[];
} & Omit<FormInputProps<TFieldValues>, "name">;

// FormDatePickerProps is a generic type that extends FormInputProps and DatePickerProps
export type FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues
> = FormInputProps<TFieldValues> & DatePickerProps<Date>;

// FormAutoCompleteProps is a generic type that extends FormInputProps and AutocompleteProps
export type FormAutoCompleteProps<
  TFieldValues extends FieldValues = FieldValues,
  TOption = unknown
> = {
  isLoading: boolean;
} & FormInputProps<TFieldValues> &
  Omit<
    AutocompleteProps<TOption, boolean, boolean, boolean, "div">,
    "renderInput"
  >;