import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, FieldValues } from "react-hook-form";
import { FormDatePickerProps } from "./FormInputProps";

export const FormDatePicker = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  control,
  rules,
  ...props
}: FormDatePickerProps<TFieldValues>) => {
  return (
    // Custom checkbox group component that uses react-hook-form's Controller
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          label={label}
          {...props}
          {...field}
          slotProps={{
            textField: {
              error: !!error,
              helperText: error && error.message,
            },
          }}
        />
      )}
    />
  );
};
