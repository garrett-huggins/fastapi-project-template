import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../components/context/AuthProvider";
import {
  Heading,
  Button,
  ButtonText,
  LinkText,
  Text,
} from "@gluestack-ui/themed";

export default function Home() {
  const { session, authenticated, user } = useAuth();

  return (
    <SafeAreaView>
      <Heading textAlign="center">Home Page</Heading>
      <Button
        onPress={() => {
          session.end();
        }}
        action="negative"
      >
        <ButtonText>Logout</ButtonText>
      </Button>
      {authenticated ? (
        <>
          <Text textAlign="center">Welcome {user.first_name}!</Text>
          <Link href="/profile">
            <LinkText>Profile</LinkText>
          </Link>
        </>
      ) : (
        <Link href="/login">
          <LinkText>Login</LinkText>
        </Link>
      )}
    </SafeAreaView>
  );
}
