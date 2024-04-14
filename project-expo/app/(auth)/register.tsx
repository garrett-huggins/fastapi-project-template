import { Heading, VStack } from "@gluestack-ui/themed";
import { useAuth } from "../../components/context/AuthProvider";
import { useAsync } from "@react-hookz/web";
import { userRegister, login } from "../../api/auth";
import { useForm } from "react-hook-form";
import { Redirect } from "expo-router";
import FormContainer from "../../components/forms/container";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button";
import { ControlledInputField } from "../../components/forms/inputs";

interface FormData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
}

export default function Register() {
  const { session, authenticated } = useAuth();
  const { handleSubmit, watch, control } = useForm<FormData>();
  const [registerRequest, registerActions] = useAsync(userRegister);
  const [loginRequest, loginActions] = useAsync(login);
  const [sessionStatus, setSessionStatus] = useState<"not-started" | "loading">(
    "not-started"
  );
  const [newUser, setNewUser] = useState<{
    email: string;
    password: string;
  }>();

  const onSubmit = handleSubmit((data: FormData) => {
    registerActions.execute(
      data.email,
      data.password,
      data.first_name,
      data.last_name
    );
    setNewUser({
      email: data.email,
      password: data.password,
    });
  });

  useEffect(() => {
    if (registerRequest.status === "success" && newUser) {
      loginActions.execute(newUser.email, newUser.password);
    }
    if (loginRequest.status === "success" && loginRequest.result) {
      const { access_token, refresh_token } = loginRequest.result;
      if (sessionStatus === "not-started") {
        setSessionStatus("loading");
        session.create(access_token, refresh_token);
      }
    }
  }, [registerRequest.status, loginRequest.status, newUser]);

  if (authenticated) {
    return <Redirect href="/" />;
  }

  return (
    <FormContainer>
      <Heading>Create an account</Heading>
      <VStack gap="$4" my="$2">
        {/* FIRST NAME */}
        <ControlledInputField
          name="first_name"
          control={control}
          rules={{ required: "First name is required" }}
          labelText="First Name"
          isRequired
          placeholder="John"
        />
        {/* LAST NAME */}
        <ControlledInputField
          name="last_name"
          control={control}
          rules={{ required: "Last name is required" }}
          labelText="Last Name"
          isRequired
          placeholder="Doe"
        />
        {/* EMAIL */}
        <ControlledInputField
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address.",
            },
          }}
          labelText="Email"
          isRequired
          placeholder="email@example.com"
        />
        {/* PASSWORD */}
        <ControlledInputField
          name="password"
          control={control}
          rules={{ required: "Password is required" }}
          labelText="Password"
          isRequired
          placeholder="********"
          type="password"
        />
        {/* PASSWORD CONFIRMATION */}
        <ControlledInputField
          name="password_confirmation"
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value: string) =>
              value === watch("password") || "Passwords do not match",
          }}
          labelText="Confirm Password"
          isRequired
          placeholder="********"
          type="password"
        />
        <Button
          text="Register"
          loading={
            registerRequest.status === "loading" ||
            loginRequest.status === "loading" ||
            sessionStatus === "loading"
          }
          onPress={onSubmit}
        />
      </VStack>
    </FormContainer>
  );
}
