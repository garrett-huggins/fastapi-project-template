import { useAuth } from "../../components/context/AuthProvider";
import { useAsync } from "@react-hookz/web";
import { login } from "../../api/auth";
import { useState } from "react";
import { Redirect, Link } from "expo-router";
import { Text, Heading, VStack, LinkText } from "@gluestack-ui/themed";
import FormContainer from "../../components/forms/container";
import Button from "../../components/ui/button";
import { ControlledInputField } from "../../components/forms/inputs";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const { session, authenticated } = useAuth();

  const { control, handleSubmit } = useForm<FormData>();

  const [sessionStatus, setSessionStatus] = useState<"not-started" | "loading">(
    "not-started"
  );

  const [loginRequest, loginActions] = useAsync(login);

  const onSubmit = handleSubmit((data: FormData) => {
    loginActions.execute(data.email, data.password);
  });

  const onLogin = async (access_token: string, refresh_token: string) => {
    setSessionStatus("loading");
    session.create(access_token, refresh_token);
  };

  if (loginRequest.status === "success" && loginRequest.result) {
    const { access_token, refresh_token } = loginRequest.result;
    // usestate to prevent multiple calls
    if (sessionStatus === "not-started") {
      onLogin(access_token, refresh_token);
    }
  }

  if (authenticated) {
    return <Redirect href="/" />;
  }

  return (
    <FormContainer>
      <Heading>Welcome back!</Heading>

      {loginRequest.error && loginRequest.status !== "loading" ? (
        <Text color="red">Invalid email or password</Text>
      ) : null}
      <VStack gap="$4" my="$2">
        <ControlledInputField
          labelText="Email"
          placeholder="email@example.com"
          type="text"
          control={control}
          name="email"
          isRequired
          rules={{ required: "Email is required" }}
        />
        <ControlledInputField
          labelText="Password"
          placeholder="********"
          type="password"
          control={control}
          name="password"
          isRequired
          rules={{ required: "Password is required" }}
        />
        <Button
          text="Login"
          loading={
            loginRequest.status === "loading" || sessionStatus === "loading"
          }
          onPress={onSubmit}
        />
      </VStack>
      <Link href="register">
        <LinkText>Register</LinkText>
      </Link>
      <Link href="/password/forgot">
        <LinkText>Forgot Password</LinkText>
      </Link>
    </FormContainer>
  );
}
