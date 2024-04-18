import { FormControl } from "../control";
import { Input, InputField as GInputField } from "@gluestack-ui/themed";
import {
  Controller,
  FieldError,
  Control,
  RegisterOptions,
} from "react-hook-form";
import { ComponentProps } from "react";
import { ControlProps } from "../control";

type IInputField = ComponentProps<typeof GInputField>;

interface InputFieldProps extends IInputField, ControlProps {
  isRequired?: boolean;
  isInvalid?: boolean;
  error?: FieldError | undefined;
}

/**
 * @component InputField extends FormControl
 * @property {string} labelText - Form label text
 * @property {string?} helperText - Form helper text
 * @property {string?} errorText - Form error text
 * @property {boolean?} isRequired - Form required field
 * @property {boolean?} isInvalid - Form field invalid
 * @property {FieldError | undefined?} error - Form field error
 * @example
 * <InputField
 *  labelText="First Name"
 *  helperText="Enter your first name"
 *  isRequired
 * />
 */
export function InputField({
  labelText,
  helperText,
  errorText,
  isRequired,
  isInvalid,
  error,
  ...props
}: InputFieldProps) {
  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!!error}
      labelText={labelText}
      helperText={helperText}
      errorText={error?.message}
    >
      <Input>
        <GInputField {...props} />
      </Input>
    </FormControl>
  );
}

interface ControlledInputFieldProps extends IInputField {
  labelText: string;
  helperText?: string;
  isRequired?: boolean;
  // removed errorText because it will be controlled by react-hook-form
  // todo: look into type this to form data
  control: Control<any, any> | undefined;
  name: string;
  rules: RegisterOptions;
}

/**
 * ControlledInputField - extends InputField
 * @property {string} labelText - Form label text
 * @property {string?} helperText - Form helper text
 * @property {boolean?} isRequired - Form required field
 * @property {Control<FormData, any>} control - React Hook Form control
 * @property {string} name - Form field name
 * @property {any} rules - Form field validation rules
 * @example
 * <ControlledInputField
 *  name="first_name"
 *  control={control}
 *  rules={{ required: "First name is required" }}
 *  labelText="First Name"
 *  isRequired
 *  placeholder="John"
 * />
 */
export function ControlledInputField({
  labelText,
  helperText,
  isRequired,
  control,
  name,
  rules,
  ...props
}: ControlledInputFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <InputField
          {...props}
          labelText={labelText}
          helperText={helperText}
          isRequired={isRequired}
          onChangeText={onChange}
          error={error}
        />
      )}
    />
  );
}
