import { TextField } from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { FormTextFieldProps } from ".";

export const FormTextField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  rules,
  ...props
}: FormTextFieldProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props} // spread TextFieldProps
          label={label}
          error={!!error}
          helperText={error && error.message}
        />
      )}
    />
  );
};
