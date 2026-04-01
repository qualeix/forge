import { View, Text, ScrollView, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { theme } from "../../constants/theme";
import { useSettings } from "../../constants/SettingsContext";
import { useProgram } from "../../constants/ProgramContext";
import { useMenu } from "../../constants/MenuContext";
import { getTodayKey } from "../../constants/data";

export default function TodayScreen() {
  const router = useRouter();
  const { t, db } = useSettings();
  const { getTodayWorkout, schedule, getWorkoutDisplayName, loaded: programLoaded } = useProgram();
  const { menuData } = useMenu();
  const todayWorkout = getTodayWorkout();
  const todayWorkoutKey = schedule[new Date().getDay()];
  const workoutName = todayWorkoutKey ? getWorkoutDisplayName(todayWorkoutKey) : "";

  const [sessionDoneToday, setSessionDoneToday] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      const todayKey = new Date().toISOString().slice(0, 10);
      db.getFirstAsync<{ value: string }>(
        "SELECT value FROM settings WHERE key = ?",
        [`session_done_${todayKey}`]
      ).then((row) => {
        setSessionDoneToday(!!row);
      }).catch(() => {});
    }, [db])
  );

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const todayMeals = menuData[getTodayKey()] ?? [];
  const nextMeal = todayMeals.find((meal) => parseTime(meal.time) > currentTime);
  const dayName = t.days[now.getDay()];
  const dateStr = now.toLocaleDateString(t.date_locale, { day: "numeric", month: "long", year: "numeric" });

  // Animations d'entrée décalées
  const anims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const btnPressIn = () =>
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, tension: 220, friction: 7 }).start();
  const btnPressOut = () =>
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, tension: 220, friction: 7 }).start();

  useEffect(() => {
    Animated.stagger(90,
      anims.map((a) =>
        Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true })
      )
    ).start();
  }, []);

  const animStyle = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  });

  if (!programLoaded) return <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <Animated.View style={[{ marginBottom: theme.spacing.xl }, animStyle(0)]}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            {dateStr}
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800", letterSpacing: -0.5 }}>
            {dayName}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
            <View style={{
              backgroundColor: todayWorkout ? theme.colors.amberSubtle : "#111",
              borderWidth: 1,
              borderColor: todayWorkout ? theme.colors.amberDim : theme.colors.border,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: theme.radius.full,
            }}>
              <Text style={{
                color: todayWorkout ? theme.colors.amber : theme.colors.muted,
                fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase",
              }}>
                {todayWorkout ? `⚡ ${workoutName}` : t.rest_day}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Carte séance - jours d'entraînement uniquement */}
        {todayWorkout && (
          <Animated.View style={[{ marginBottom: theme.spacing.lg }, animStyle(1)]}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              {t.today_section}
            </Text>
            <View style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.xl,
              borderWidth: 1,
              borderColor: sessionDoneToday ? theme.colors.border : theme.colors.amberDim,
              overflow: "hidden",
              opacity: sessionDoneToday ? 0.6 : 1,
            }}>
              <View style={{ padding: theme.spacing.lg }}>
                <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800", marginBottom: 4 }}>
                  {workoutName}
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: theme.spacing.lg }}>
                  {t.exercises_rest(todayWorkout.exercises.length, (todayWorkout as any).restSeconds ?? 90)}
                </Text>
                <View style={{ gap: 8, marginBottom: theme.spacing.lg }}>
                  {todayWorkout.exercises.map((ex) => (
                    <View key={ex.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "600", flex: 1 }}>
                        {(ex as any).name_fr || ex.name}
                      </Text>
                      <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: "600" }}>
                        {ex.sets}×{ex.reps}
                      </Text>
                    </View>
                  ))}
                </View>

                {sessionDoneToday ? (
                  <View style={{
                    backgroundColor: theme.colors.cardElevated,
                    borderRadius: theme.radius.md,
                    paddingVertical: 14,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}>
                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.muted} />
                    <Text style={{ color: theme.colors.muted, fontSize: 15, fontWeight: "700" }}>
                      {t.session_already_done}
                    </Text>
                  </View>
                ) : (
                  <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                    <Pressable
                      onPress={() => router.push("/session")}
                      onPressIn={btnPressIn}
                      onPressOut={btnPressOut}
                      style={{
                        backgroundColor: theme.colors.amber,
                        borderRadius: theme.radius.md,
                        paddingVertical: 14,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons name="flash" size={18} color="#0D0D0D" />
                      <Text style={{ color: "#0D0D0D", fontSize: 15, fontWeight: "800", letterSpacing: 0.5 }}>
                        {t.start_session}
                      </Text>
                    </Pressable>
                  </Animated.View>
                )}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Jour de repos : carte récupération (en premier) */}
        {!todayWorkout && (
          <Animated.View style={[{ marginBottom: theme.spacing.lg }, animStyle(2)]}>
            <View style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.xl,
              borderWidth: 1,
              borderColor: theme.colors.amberDim,
              padding: theme.spacing.lg,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <View style={{
                  backgroundColor: theme.colors.amberSubtle,
                  borderRadius: theme.radius.sm,
                  padding: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.amberDeep,
                }}>
                  <Ionicons name="moon-outline" size={18} color={theme.colors.amber} />
                </View>
                <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700" }}>
                  {t.recovery_title}
                </Text>
              </View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 20 }}>
                {t.recovery_msg}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Carte prochain repas */}
        {nextMeal && (
          <Animated.View style={[{ marginBottom: theme.spacing.lg }, animStyle(3)]}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              {t.next_meal}
            </Text>
            <View style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.xl,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ color: theme.colors.text, fontSize: 17, fontWeight: "700", marginBottom: nextMeal.details.length > 0 ? 4 : 0 }}>
                    {nextMeal.name}
                  </Text>
                  {nextMeal.details.length > 0 && (
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                      {nextMeal.details}
                    </Text>
                  )}
                </View>
                <View style={{
                  backgroundColor: theme.colors.amberSubtle,
                  borderRadius: theme.radius.md,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 6,
                }}>
                  <Ionicons name="time-outline" size={13} color={theme.colors.amber} />
                  <Text style={{ color: theme.colors.amber, fontSize: 14, fontWeight: "800" }}>
                    {nextMeal.time}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
