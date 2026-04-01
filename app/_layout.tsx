import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform, View, Text, Animated } from "react-native";
import { ScalePress } from "../components/ScalePress";
import { checkForUpdate, downloadAndInstall, UpdateInfo } from "../constants/updater";
import { theme } from "../constants/theme";
import { SettingsProvider } from "../constants/SettingsContext";
import { ProgramProvider } from "../constants/ProgramContext";
import { MenuProvider } from "../constants/MenuContext";
import { useSettings } from "../constants/SettingsContext";
import { useMenu } from "../constants/MenuContext";
import { useProgram } from "../constants/ProgramContext";
import { setupNotificationChannel, scheduleMealNotifications, cancelMealNotifications, scheduleWorkoutNotifications, cancelWorkoutNotifications, requestIgnoreBatteryOptimizations } from "../constants/notifications";

// Affiche les notifications même quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function UpdateModal({ info, onDismiss }: { info: UpdateInfo; onDismiss: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleInstall = async () => {
    setDownloading(true);
    try {
      await downloadAndInstall(info.url, (p) => {
        setProgress(p);
        Animated.timing(progressAnim, { toValue: p, duration: 80, useNativeDriver: false }).start();
      });
    } catch {
      setDownloading(false);
    }
  };

  return (
    <View style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center",
      alignItems: "center", zIndex: 9999, padding: 24,
    }}>
      <View style={{
        backgroundColor: theme.colors.card, borderRadius: theme.radius.lg,
        borderWidth: 1, borderColor: theme.colors.amberDeep,
        padding: 24, width: "100%",
      }}>
        <Text style={{ color: theme.colors.amber, fontSize: 11, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          Mise à jour disponible
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", marginBottom: 4 }}>
          v{info.version}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 20 }}>
          Télécharge et installe la dernière version de Forge.
        </Text>

        {downloading && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ height: 4, backgroundColor: theme.colors.border, borderRadius: 2, overflow: "hidden" }}>
              <Animated.View style={{
                height: 4, borderRadius: 2, backgroundColor: theme.colors.amber,
                width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
              }} />
            </View>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, marginTop: 6, textAlign: "right" }}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        )}

        <ScalePress
          onPress={handleInstall}
          disabled={downloading}
          style={{
            backgroundColor: downloading ? theme.colors.amberDeep : theme.colors.amber,
            borderRadius: theme.radius.sm, paddingVertical: 14,
            alignItems: "center", marginBottom: 10,
          }}
        >
          <Text style={{ color: "#0D0D0D", fontWeight: "900", fontSize: 15 }}>
            {downloading ? "Téléchargement..." : "Installer"}
          </Text>
        </ScalePress>

        {!downloading && (
          <ScalePress onPress={onDismiss} style={{ alignItems: "center", paddingVertical: 8 }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>Plus tard</Text>
          </ScalePress>
        )}
      </View>
    </View>
  );
}

// Demande les permissions au premier lancement (notifs puis arrière-plan)
function FirstLaunchPermissions() {
  const { db } = useSettings();
  const done = useRef(false);

  useEffect(() => {
    if (!db || done.current) return;
    done.current = true;
    (async () => {
      const rows = await db.getAllAsync<{ key: string; value: string }>(
        "SELECT key, value FROM settings WHERE key IN ('notif_permission_asked', 'battery_opt_asked')"
      );
      const map: Record<string, string> = {};
      rows.forEach((r) => { map[r.key] = r.value; });

      if (!map["notif_permission_asked"]) {
        await Notifications.requestPermissionsAsync();
        await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('notif_permission_asked', '1')");
      }

      if (Platform.OS === "android" && !map["battery_opt_asked"]) {
        await requestIgnoreBatteryOptimizations();
        await db.runAsync(
          "INSERT OR REPLACE INTO settings (key, value) VALUES ('battery_opt_asked', '1'), ('battery_opt_granted', '1')"
        );
      }
    })();
  }, [db]);

  return null;
}

// Replanifie les notifications au lancement (une seule fois par session)
function NotificationScheduler() {
  const { db } = useSettings();
  const { menuData } = useMenu();
  const { schedule, workouts, loaded: programLoaded } = useProgram();
  const workoutsDone = useRef(false);
  const mealsDone = useRef(false);

  useEffect(() => {
    if (!db || !programLoaded || workoutsDone.current) return;
    workoutsDone.current = true;
    db.getAllAsync<{ key: string; value: string }>(
      "SELECT key, value FROM settings WHERE key IN ('notif_workouts_on','notif_workouts_time','notif_workouts_body')"
    ).then((rows) => {
      const map: Record<string, string> = {};
      rows.forEach((r) => { map[r.key] = r.value; });
      const sched = Array.from({ length: 7 }, (_, i) => schedule[i] ?? null);
      if ((map["notif_workouts_on"] ?? "1") === "1") {
        scheduleWorkoutNotifications(sched, workouts, map["notif_workouts_time"] ?? "16:15", map["notif_workouts_body"] ?? "");
      } else {
        cancelWorkoutNotifications();
      }
    }).catch(() => {});
  }, [db, programLoaded]);

  useEffect(() => {
    if (!db || Object.keys(menuData).length === 0 || mealsDone.current) return;
    mealsDone.current = true;
    db.getAllAsync<{ key: string; value: string }>(
      "SELECT key, value FROM settings WHERE key IN ('notif_meals_on','notif_meals_offset')"
    ).then((rows) => {
      const map: Record<string, string> = {};
      rows.forEach((r) => { map[r.key] = r.value; });
      if ((map["notif_meals_on"] ?? "1") === "1") {
        scheduleMealNotifications(menuData, parseInt(map["notif_meals_offset"] ?? "60") || 60);
      } else {
        cancelMealNotifications();
      }
    }).catch(() => {});
  }, [db, menuData]);

  return null;
}

export default function RootLayout() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    setupNotificationChannel();
    checkForUpdate().then((info) => { if (info) setUpdateInfo(info); });
  }, []);

  return (
    <SettingsProvider>
      <MenuProvider>
        <ProgramProvider>
          <FirstLaunchPermissions />
          <NotificationScheduler />
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0D0D0D" } }}>
            <Stack.Screen name="session" options={{ gestureEnabled: false }} />
          </Stack>
          {updateInfo && (
            <UpdateModal info={updateInfo} onDismiss={() => setUpdateInfo(null)} />
          )}
        </ProgramProvider>
      </MenuProvider>
    </SettingsProvider>
  );
}
