import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { View, ScrollView } from "@gluestack-ui/themed";
import { ReactNode } from "react";

export default function FormContainer({ children }: { children: ReactNode }) {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <View flex={1} justifyContent="center" alignItems="center">
          <View w="100%" px={10}>
            <View
              sx={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                shadowColor: "black",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
                width: "100%",
              }}
            >
              {children}
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
