import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SettingsProvider } from "../constants/SettingsContext";
import { ProgramProvider } from "../constants/ProgramContext";
import { MenuProvider } from "../constants/MenuContext";
import "../global.css";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <MenuProvider>
      <ProgramProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0D0D0D" } }}>
          <Stack.Screen name="session" options={{ gestureEnabled: false }} />
        </Stack>
      </ProgramProvider>
      </MenuProvider>
    </SettingsProvider>
  );
}
