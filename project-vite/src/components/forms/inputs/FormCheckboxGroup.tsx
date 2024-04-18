import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { FormCheckboxGroupProps } from ".";

export const FormCheckboxGroup = <
  TFieldValues extends FieldValues = FieldValues
>({
  checkBoxes,
  control,
}: FormCheckboxGroupProps<TFieldValues>) => {
  return (
    // Custom checkbox group component that uses react-hook-form's Controller
    <FormControl component="fieldset" margin="normal">
      <FormGroup>
        {checkBoxes.map(({ name, label }, index) => (
          <Controller
            key={`${name}-${index}`}
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                control={<Checkbox checked={value} onChange={onChange} />}
                label={label}
              />
            )}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};
