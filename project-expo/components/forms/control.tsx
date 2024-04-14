import { FormControl as GFormControl } from "@gluestack-ui/themed";
import { ComponentProps } from "react";
import { ReactNode } from "react";

type IFormControl = ComponentProps<typeof GFormControl>;

export type ControlProps = {
  labelText: string;
  helperText?: string;
  errorText?: string;
};

interface FormControlProps extends IFormControl, ControlProps {
  children: ReactNode;
}

export function FormControl({
  children,
  labelText,
  helperText,
  errorText,
  ...props
}: FormControlProps) {
  return (
    <GFormControl isInvalid {...props}>
      <GFormControl.Label>
        <GFormControl.Label.Text>{labelText}</GFormControl.Label.Text>
      </GFormControl.Label>
      {children}
      {helperText && (
        <GFormControl.Helper.Text>
          <GFormControl.Helper.Text>{helperText}</GFormControl.Helper.Text>
        </GFormControl.Helper.Text>
      )}
      {errorText && (
        <GFormControl.Error>
          <GFormControl.Error.Text>{errorText}</GFormControl.Error.Text>
        </GFormControl.Error>
      )}
    </GFormControl>
  );
}
