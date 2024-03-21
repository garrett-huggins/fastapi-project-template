import { forgotPassword } from "../../../api/auth";
import { useAsync } from "@react-hookz/web";
import { useState, useEffect } from "react";
import {
  Input,
  InputField,
  Text,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  Heading,
  VStack,
  Button,
  ButtonText,
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@gluestack-ui/themed";
import FormContainer from "../../../components/forms/container";
import { router } from "expo-router";

export default function PasswordForgot() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [forgotPasswordRequest, forgotPasswordActions] =
    useAsync(forgotPassword);

  const onSubmit = () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    forgotPasswordActions.execute(email);
    toast.show({
      placement: "bottom",
      render: ({ id }) => {
        const toastId = "toast-" + id;
        return (
          <Toast nativeID={toastId} action="success" variant="accent">
            <VStack space="xs">
              <ToastTitle>Email Sent!</ToastTitle>
              <ToastDescription>
                Please check your email for the reset link.
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
    router.replace("password/reset");
  };

  useEffect(() => {
    if (error && email) {
      setError("");
    }
  }, [email]);

  return (
    <FormContainer>
      <Heading>Forgot Password</Heading>
      <Text fontSize="$sm">
        Enter your email address and we will send you a link to reset your
        password.
      </Text>
      <VStack gap="$4" my="$4">
        <FormControl isRequired isInvalid={!!error}>
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>{error}</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <Button onPress={onSubmit}>
          <ButtonText>Send Reset Link</ButtonText>
        </Button>
      </VStack>
    </FormContainer>
  );
}
