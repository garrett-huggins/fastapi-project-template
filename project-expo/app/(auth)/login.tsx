import { useAuth } from "../../components/context/AuthProvider";
import { useAsync } from "@react-hookz/web";
import { login } from "../../api/auth";
import { useState } from "react";
import { Redirect, Link } from "expo-router";
import {
  Text,
  Heading,
  Input,
  InputField,
  InputSlot,
  InputIcon,
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  EyeIcon,
  EyeOffIcon,
  LinkText,
} from "@gluestack-ui/themed";
import FormContainer from "../../components/forms/container";
import Button from "../../components/ui/button";

export default function Login() {
  const { session, authenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  const [sessionStatus, setSessionStatus] = useState<"not-started" | "loading">(
    "not-started"
  );

  const [loginRequest, loginActions] = useAsync(async () => {
    const response = await login(email, password);
    return response;
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
        <FormControl isRequired>
          <FormControlLabel>
            <FormControlLabelText>Email</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              onChangeText={setEmail}
              value={email}
              placeholder="email@example.com"
            />
          </Input>
        </FormControl>
        <FormControl isRequired>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              placeholder="********"
              type={showPassword ? "text" : "password"}
              onChangeText={setPassword}
            />
            <InputSlot pr="$3" onPress={handleState}>
              {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                color="$darkBlue500"
              />
            </InputSlot>
          </Input>
        </FormControl>
        <Button
          text="Login"
          loading={
            loginRequest.status === "loading" || sessionStatus === "loading"
          }
          onPress={() => {
            loginActions.execute();
          }}
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
