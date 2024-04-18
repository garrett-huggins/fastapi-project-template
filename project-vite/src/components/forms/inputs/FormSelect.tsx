import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { FormSelectProps } from ".";

export const FormSelect = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  rules,
  menuItems,
  ...props
}: FormSelectProps<TFieldValues>) => {
  // render menu items for select input
  const renderMenuItems = () => {
    return menuItems.map(({ value, label }, index) => (
      <MenuItem key={`${value}-${index}`} value={value}>
        {label}
      </MenuItem>
    ));
  };

  return (
    // Custom select component that uses react-hook-form's Controller
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          fullWidth={props.fullWidth}
          margin="normal"
          required={props.required}
          error={!!error}
        >
          <InputLabel>{label}</InputLabel>
          <Select {...field} {...props} label={label} error={!!error}>
            {renderMenuItems()}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};
