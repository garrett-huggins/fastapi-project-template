import { Text, Heading, SafeAreaView, LinkText } from "@gluestack-ui/themed";
import { useAuth } from "../../components/context/AuthProvider";
import { Link } from "expo-router";

export default function Profile() {
  const { user } = useAuth();
  return (
    <SafeAreaView>
      <Heading textAlign="center">Welcome {user.first_name}!</Heading>
      <Text textAlign="center">This is the profile page</Text>
      <Link href="/">
        <LinkText>Home</LinkText>
      </Link>
    </SafeAreaView>
  );
}
