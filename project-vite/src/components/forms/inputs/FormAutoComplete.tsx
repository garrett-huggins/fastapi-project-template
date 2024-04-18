import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { FormAutoCompleteProps } from ".";

export const FormAutoComplete = <
  TFieldValues extends FieldValues = FieldValues,
  TOption = unknown
>({
  control,
  label,
  name,
  isLoading,
  ...props
}: FormAutoCompleteProps<TFieldValues, TOption>) => {
  return (
    // Custom checkbox group component that uses react-hook-form's Controller
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value, ..._field },
        fieldState: { error },
      }) => (
        <Autocomplete
          id={`${name}-autocomplete`}
          value={value}
          onChange={(_, data) => onChange(data)}
          {...props}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              margin="normal"
              sx={{ input: { textTransform: "capitalize" } }}
              error={!!error}
              helperText={error && error.message}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading && (
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          {..._field}
        />
      )}
    />
  );
};
