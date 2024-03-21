import { Slot, router } from "expo-router";
import { useAuth } from "../../components/context/AuthProvider";

export function AppLayout() {
  const { authenticated } = useAuth();

  if (!authenticated) {
    router.replace("/");
  }

  return <Slot />;
}
