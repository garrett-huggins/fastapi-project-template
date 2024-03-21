import { View, Text } from "@gluestack-ui/themed";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="password/forgot"
        options={{
          title: "Forgot Password",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="password/reset"
        options={{
          title: "Reset Password",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
