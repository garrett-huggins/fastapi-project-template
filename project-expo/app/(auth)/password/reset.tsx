import {
  Text,
  Heading,
  FormControl,
  VStack,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Input,
  InputField,
  Button,
  ButtonText,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@gluestack-ui/themed";
import FormContainer from "../../../components/forms/container";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { useAsync } from "@react-hookz/web";
import { resetPassword } from "../../../api/auth";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  reset_token: string;
  password: string;
  confirmPassword: string;
}

export default function PasswordReset() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [resetPasswordRequest, resetPasswordActions] = useAsync(resetPassword);
  const toast = useToast();
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit((data: FormData) => {
    resetPasswordActions.execute({
      token: data.reset_token,
      new_password: data.password,
    });
  });

  useEffect(() => {
    if (token) {
      setValue("reset_token", token);
    }
  }, [token]);

  useEffect(() => {
    if (resetPasswordRequest.status === "success") {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="success" variant="accent">
              <VStack space="xs">
                <ToastTitle>Password Reset!</ToastTitle>
                <ToastDescription>
                  Your password has been reset successfully.
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
      router.replace("login");
    }
    if (resetPasswordRequest.status === "error") {
      toast.show({
        placement: "bottom",
        render: ({ id }) => {
          const toastId = "toast-" + id;
          return (
            <Toast nativeID={toastId} action="error" variant="accent">
              <VStack space="xs">
                <ToastTitle>Error</ToastTitle>
                <ToastDescription>
                  There was an error resetting your password. Please check your
                  reset token and try again.
                </ToastDescription>
              </VStack>
            </Toast>
          );
        },
      });
    }
  }, [resetPasswordRequest.status]);

  return (
    <FormContainer>
      <Heading>Password Reset</Heading>
      <Text fontSize="$sm">
        Please {!token && "paste your reset token and"} enter your new password
        below.
      </Text>
      <VStack gap="$4" my="$4">
        {!token && (
          <Controller
            name="reset_token"
            control={control}
            rules={{ required: "Reset token is required" }}
            render={({ field: { onChange } }) => (
              <FormControl isRequired isInvalid={!!errors.reset_token}>
                <FormControlLabel>
                  <FormControlLabelText>Reset Token</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Paste your reset token here"
                    onChangeText={onChange}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {errors.reset_token?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
        )}
        <Controller
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          render={({ field: { onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="********"
                  onChangeText={onChange}
                  secureTextEntry
                  type="password"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {errors.password?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
        {/* PASSWORD CONFIRMATION */}
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          }}
          render={({ field: { onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.confirmPassword}>
              <FormControlLabel>
                <FormControlLabelText>Confirm Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="********"
                  onChangeText={onChange}
                  secureTextEntry
                  type="password"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {errors.confirmPassword?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
        <Button onPress={onSubmit}>
          <ButtonText>Reset Password</ButtonText>
        </Button>
      </VStack>
    </FormContainer>
  );
}
