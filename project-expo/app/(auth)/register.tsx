import {
  Input,
  InputField,
  ButtonSpinner,
  Heading,
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";
import { useAuth } from "../../components/context/AuthProvider";
import { useAsync } from "@react-hookz/web";
import { userRegister, login } from "../../api/auth";
import { useForm, Controller } from "react-hook-form";
import { Redirect } from "expo-router";
import FormContainer from "../../components/forms/container";
import { useEffect, useState } from "react";
import Button from "../../components/ui/button";

interface FormData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
}

export default function Register() {
  const { session, authenticated } = useAuth();
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>();
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
        <Controller
          name="first_name"
          control={control}
          rules={{ required: "First name is required" }}
          render={({ field: { onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.first_name}>
              <FormControlLabel>
                <FormControlLabelText>First Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="John"
                  onChangeText={onChange}
                  type="text"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {errors.first_name?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
        {/* LAST NAME */}
        <Controller
          name="last_name"
          control={control}
          rules={{ required: "Last name is required" }}
          render={({ field: { onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.last_name}>
              <FormControlLabel>
                <FormControlLabelText>Last Name</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Doe"
                  onChangeText={onChange}
                  type="text"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {errors.last_name?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
        {/* EMAIL */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email address.",
            },
          }}
          render={({ field: { onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="email@example.com"
                  onChangeText={onChange}
                  type="text"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  {errors.email?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
        />
        {/* PASSWORD */}
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
          name="password_confirmation"
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          }}
          render={({ field: { onChange } }) => (
            <FormControl isRequired isInvalid={!!errors.password_confirmation}>
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
                  {errors.password_confirmation?.message}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          )}
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
