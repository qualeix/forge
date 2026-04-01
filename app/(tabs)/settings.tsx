import {
  View,
  Text,
  ScrollView,
  Switch,
  Pressable,
  Animated,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { theme } from "../../constants/theme";
import { useSettings } from "../../constants/SettingsContext";
import { useMenu } from "../../constants/MenuContext";
import { useProgram } from "../../constants/ProgramContext";
import { ScalePress } from "../../components/ScalePress";
import {
  requestPermission,
  getPermissionStatus,
  scheduleMealNotifications,
  scheduleWorkoutNotifications,
  cancelMealNotifications,
  cancelWorkoutNotifications,
} from "../../constants/notifications";

const TIME_RE_S = /^([01]\d|2[0-3]):([0-5]\d)$/;

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={{
      color: theme.colors.textSecondary,
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 8,
      marginTop: 20,
    }}>
      {children}
    </Text>
  );
}

function Accordion({
  title,
  subtitle,
  active,
  children,
  maxH = 500,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  children: ReactNode;
  maxH?: number;
}) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = open ? 0 : 1;
    Animated.timing(anim, { toValue, duration: 260, useNativeDriver: false }).start();
    Animated.timing(chevronAnim, { toValue, duration: 260, useNativeDriver: true }).start();
    setOpen((v) => !v);
  };

  const maxHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, maxH] });
  const chevronRotate = chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });

  return (
    <View style={{
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: active ? theme.colors.amberDim : theme.colors.border,
      marginBottom: 8,
      overflow: "hidden",
    }}>
      <Pressable
        onPress={toggle}
        style={{ flexDirection: "row", alignItems: "center", padding: theme.spacing.md, gap: 12 }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "700" }}>{title}</Text>
          <Text style={{ color: active ? theme.colors.amber : theme.colors.muted, fontSize: 11, marginTop: 2 }}>
            {active ? "Activé" : "Désactivé"}{subtitle ? ` · ${subtitle}` : ""}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Ionicons name="chevron-down" size={18} color={open ? theme.colors.amber : theme.colors.muted} />
        </Animated.View>
      </Pressable>

      <Animated.View style={{ maxHeight, overflow: "hidden" }}>
        <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />
        <View style={{ padding: theme.spacing.md }}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

export default function SettingsScreen() {
  const { db } = useSettings();
  const { menuData } = useMenu();
  const { schedule, workouts } = useProgram();

  const [permStatus, setPermStatus] = useState<"granted" | "denied" | "undetermined">("undetermined");
  const [mealsOn, setMealsOn] = useState(false);
  const [workoutsOn, setWorkoutsOn] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [mealsOffset, setMealsOffset] = useState(0);
  const [workoutsTime, setWorkoutsTime] = useState("08:00");
  const [workoutsBody, setWorkoutsBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const loaded = useRef(false);
  const savedRef = useRef({ mealsOn: false, workoutsOn: false, timerOn: false, mealsOffset: 0, workoutsTime: "08:00", workoutsBody: "" });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!db) return;
    async function load() {
      const rows = await db!.getAllAsync<{ key: string; value: string }>(
        "SELECT key, value FROM settings WHERE key IN ('notif_meals_on','notif_workouts_on','notif_timer_on','notif_meals_offset','notif_workouts_time','notif_workouts_body')"
      );
      const map: Record<string, string> = {};
      rows.forEach((r) => { map[r.key] = r.value; });
      const vals = {
        mealsOn: (map["notif_meals_on"] ?? "0") === "1",
        workoutsOn: (map["notif_workouts_on"] ?? "0") === "1",
        timerOn: (map["notif_timer_on"] ?? "0") === "1",
        mealsOffset: parseInt(map["notif_meals_offset"] ?? "0") || 0,
        workoutsTime: map["notif_workouts_time"] ?? "08:00",
        workoutsBody: map["notif_workouts_body"] ?? "",
      };
      savedRef.current = vals;
      setMealsOn(vals.mealsOn);
      setWorkoutsOn(vals.workoutsOn);
      setTimerOn(vals.timerOn);
      setMealsOffset(vals.mealsOffset);
      setWorkoutsTime(vals.workoutsTime);
      setWorkoutsBody(vals.workoutsBody);
      loaded.current = true;
    }
    load();
    getPermissionStatus().then(setPermStatus);
  }, [db]);

  useEffect(() => {
    if (!loaded.current) return;
    const s = savedRef.current;
    setDirty(
      mealsOn !== s.mealsOn || workoutsOn !== s.workoutsOn || timerOn !== s.timerOn ||
      mealsOffset !== s.mealsOffset || workoutsTime !== s.workoutsTime || workoutsBody !== s.workoutsBody
    );
  }, [mealsOn, workoutsOn, timerOn, mealsOffset, workoutsTime, workoutsBody]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    setPermStatus(granted ? "granted" : "denied");
  };

  const handleApply = async () => {
    if (!db || !dirty) return;
    setSaving(true);

    if ((mealsOn || workoutsOn || timerOn) && permStatus !== "granted") {
      const granted = await requestPermission();
      setPermStatus(granted ? "granted" : "denied");
      if (!granted) { setSaving(false); return; }
    }

    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('notif_meals_on', ?)", [mealsOn ? "1" : "0"]);
    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('notif_workouts_on', ?)", [workoutsOn ? "1" : "0"]);
    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('notif_timer_on', ?)", [timerOn ? "1" : "0"]);
    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('notif_meals_offset', ?)", [String(mealsOffset)]);
    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('notif_workouts_time', ?)", [workoutsTime]);
    await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('notif_workouts_body', ?)", [workoutsBody]);

    if (mealsOn) {
      await scheduleMealNotifications(menuData, mealsOffset);
    } else {
      await cancelMealNotifications();
    }
    if (workoutsOn) {
      await scheduleWorkoutNotifications(Array.from({ length: 7 }, (_, i) => schedule[i] ?? null), workouts, workoutsTime, workoutsBody);
    } else {
      await cancelWorkoutNotifications();
    }

    savedRef.current = { mealsOn, workoutsOn, timerOn, mealsOffset, workoutsTime, workoutsBody };
    setSaving(false);
    setDirty(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* En-tête */}
          <View style={{ marginBottom: theme.spacing.lg }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              Préférences
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800", letterSpacing: -0.5 }}>
              Réglages
            </Text>
          </View>

          {/* ── Bouton Appliquer (en haut) ── */}
          <View style={{ marginBottom: theme.spacing.lg }}>
            <Pressable
              onPress={dirty ? handleApply : undefined}
              style={{
                backgroundColor: dirty ? theme.colors.amber : theme.colors.cardElevated,
                borderRadius: theme.radius.md,
                paddingVertical: 15,
                alignItems: "center",
                borderWidth: 1,
                borderColor: dirty ? theme.colors.amber : theme.colors.border,
              }}
            >
              <Text style={{ color: dirty ? "#0D0D0D" : theme.colors.muted, fontWeight: "900", fontSize: 15 }}>
                {saving ? "Enregistrement…" : dirty ? "Appliquer" : "✓ À jour"}
              </Text>
            </Pressable>
          </View>

          {/* ── NOTIFICATIONS ── */}
          <SectionLabel>Notifications</SectionLabel>

          {/* Permission card */}
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: permStatus === "granted" ? theme.colors.amberDeep : theme.colors.border,
            padding: theme.spacing.md,
            marginBottom: 8,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{
                backgroundColor: permStatus === "granted" ? theme.colors.amberSubtle : theme.colors.cardElevated,
                borderRadius: theme.radius.sm,
                padding: 8,
                borderWidth: 1,
                borderColor: permStatus === "granted" ? theme.colors.amberDeep : theme.colors.border,
              }}>
                <Ionicons
                  name={permStatus === "granted" ? "notifications" : "notifications-outline"}
                  size={18}
                  color={permStatus === "granted" ? theme.colors.amber : theme.colors.muted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "700" }}>
                  Permission système
                </Text>
                <Text style={{ color: permStatus === "granted" ? theme.colors.amber : theme.colors.textSecondary, fontSize: 11, marginTop: 1 }}>
                  {permStatus === "granted"
                    ? "Autorisée"
                    : permStatus === "denied"
                    ? "Refusée — à modifier dans les réglages du téléphone"
                    : "Non demandée"}
                </Text>
              </View>
              {permStatus !== "granted" && permStatus !== "denied" && (
                <ScalePress onPress={handleRequestPermission} style={{
                  backgroundColor: theme.colors.amber,
                  borderRadius: theme.radius.sm,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}>
                  <Text style={{ color: "#0D0D0D", fontSize: 12, fontWeight: "800" }}>Activer</Text>
                </ScalePress>
              )}
            </View>
          </View>

          {/* Rappels Repas */}
          <Accordion title="Rappels repas" subtitle="" active={mealsOn} maxH={220}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: mealsOn ? 12 : 0 }}>
              <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "600", flex: 1, marginRight: 12 }}>
                Notification avant chaque repas
              </Text>
              <Switch
                value={mealsOn}
                onValueChange={setMealsOn}
                trackColor={{ false: theme.colors.border, true: theme.colors.amberDeep }}
                thumbColor={mealsOn ? theme.colors.amber : theme.colors.muted}
              />
            </View>
            {mealsOn && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
                <TextInput
                  value={mealsOffset === 0 ? "" : String(mealsOffset)}
                  onChangeText={(v) => setMealsOffset(parseInt(v.replace(/[^0-9]/g, "")) || 0)}
                  placeholder="0"
                  placeholderTextColor={theme.colors.muted}
                  keyboardType="number-pad"
                  maxLength={3}
                  style={{
                    backgroundColor: theme.colors.cardElevated,
                    color: theme.colors.text,
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: theme.colors.amberDim,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 15,
                    fontWeight: "700",
                    width: 68,
                    textAlign: "center",
                  }}
                />
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13, flex: 1 }}>
                  min avant (0 = à l'heure exacte)
                </Text>
              </View>
            )}
          </Accordion>

          {/* Rappels Séances */}
          <Accordion title="Rappels séances" subtitle="" active={workoutsOn} maxH={400}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: workoutsOn ? 14 : 0 }}>
              <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "600", flex: 1, marginRight: 12 }}>
                Rappel les jours d'entraînement
              </Text>
              <Switch
                value={workoutsOn}
                onValueChange={setWorkoutsOn}
                trackColor={{ false: theme.colors.border, true: theme.colors.amberDeep }}
                thumbColor={workoutsOn ? theme.colors.amber : theme.colors.muted}
              />
            </View>
            {workoutsOn && (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, flex: 1 }}>Heure du rappel</Text>
                  <TextInput
                    value={workoutsTime}
                    onChangeText={(raw) => {
                      const digits = raw.replace(/[^0-9]/g, "");
                      const formatted = digits.length <= 2 ? digits : digits.slice(0, 2) + ":" + digits.slice(2, 4);
                      setWorkoutsTime(formatted);
                    }}
                    placeholder="08:00"
                    placeholderTextColor={theme.colors.muted}
                    keyboardType="number-pad"
                    maxLength={5}
                    style={{
                      backgroundColor: theme.colors.cardElevated,
                      color: theme.colors.text,
                      borderRadius: theme.radius.md,
                      borderWidth: 1,
                      borderColor: workoutsTime.length > 0 && !TIME_RE_S.test(workoutsTime) ? "#EF4444" : theme.colors.amberDim,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      fontSize: 16,
                      fontWeight: "700",
                      width: 90,
                      textAlign: "center",
                    }}
                  />
                </View>
                <TextInput
                  value={workoutsBody}
                  onChangeText={setWorkoutsBody}
                  placeholder="C'est parti, on s'échauffe !"
                  placeholderTextColor={theme.colors.muted}
                  style={{
                    backgroundColor: theme.colors.cardElevated,
                    color: theme.colors.text,
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                />
              </>
            )}
          </Accordion>

          {/* Timer de repos */}
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: timerOn ? theme.colors.amberDim : theme.colors.border,
            marginBottom: 8,
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: theme.spacing.md, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "700" }}>Notification fin de repos</Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 11, marginTop: 2, lineHeight: 16 }}>
                  Alerte quand le timer atteint 0
                </Text>
              </View>
              <Switch
                value={timerOn}
                onValueChange={setTimerOn}
                trackColor={{ false: theme.colors.border, true: theme.colors.amberDeep }}
                thumbColor={timerOn ? theme.colors.amber : theme.colors.muted}
              />
            </View>
          </View>

          {/* ── APPLICATION ── */}
          <SectionLabel>Application</SectionLabel>
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: "hidden",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: theme.spacing.md }}>
              <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "700" }}>Version</Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>1.7.3</Text>
            </View>
            <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: theme.spacing.md }}>
              <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "700" }}>Développée par</Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>Qualeix</Text>
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
