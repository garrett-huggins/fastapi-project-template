import { AuthProvider } from "../components/context/AuthProvider";
import { Slot } from "expo-router";
import { GluestackUIProvider, Text, Box } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config"; // Optional if you want to use default theme

export default function RootLayout() {
  return (
    <AuthProvider>
      <GluestackUIProvider config={config}>
        <Slot />
      </GluestackUIProvider>
    </AuthProvider>
  );
}
