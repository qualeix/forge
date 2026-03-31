import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { SettingsProvider } from "../constants/SettingsContext";
import { ProgramProvider } from "../constants/ProgramContext";
import { MenuProvider } from "../constants/MenuContext";
import { useSettings } from "../constants/SettingsContext";
import { useMenu } from "../constants/MenuContext";
import { useProgram } from "../constants/ProgramContext";
import { setupNotificationChannel, rescheduleAll } from "../constants/notifications";

// Affiche les notifications même quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Replanifie les notifications au lancement (une seule fois par session)
function NotificationScheduler() {
  const { db } = useSettings();
  const { menuData } = useMenu();
  const { schedule, workouts, loaded: programLoaded } = useProgram();
  const done = useRef(false);

  useEffect(() => {
    if (!db || done.current || !programLoaded || Object.keys(menuData).length === 0) return;
    done.current = true;
    rescheduleAll(db, menuData, Array.from({ length: 7 }, (_, i) => schedule[i] ?? null), workouts);
  }, [db, programLoaded, menuData]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    setupNotificationChannel();
  }, []);

  return (
    <SettingsProvider>
      <MenuProvider>
        <ProgramProvider>
          <NotificationScheduler />
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0D0D0D" } }}>
            <Stack.Screen name="session" options={{ gestureEnabled: false }} />
          </Stack>
        </ProgramProvider>
      </MenuProvider>
    </SettingsProvider>
  );
}
