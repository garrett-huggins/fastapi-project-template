import {
  Text,
  Heading,
  SafeAreaView,
  LinkText,
  Box,
  VStack,
} from "@gluestack-ui/themed";
import { useAuth } from "../../components/context/AuthProvider";
import { Link } from "expo-router";

export default function Profile() {
  const { user } = useAuth();
  return (
    <SafeAreaView>
      <VStack gap="$4">
        <Heading textAlign="center">Welcome {user.first_name}!</Heading>
        <Text textAlign="center">This is the profile page</Text>
        <Box alignItems="center">
          <Link href="/">
            <LinkText>Home</LinkText>
          </Link>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
