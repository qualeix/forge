import { View, Text, ScrollView, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { theme } from "../../constants/theme";
import { getTodayMenu } from "../../constants/data";
import { useSettings } from "../../constants/SettingsContext";
import { useProgram } from "../../constants/ProgramContext";

export default function TodayScreen() {
  const router = useRouter();
  const { t, lang } = useSettings();
  const { getTodayWorkout, schedule, getWorkoutDisplayName } = useProgram();
  const todayMenu = getTodayMenu();
  const todayWorkout = getTodayWorkout();
  const todayWorkoutKey = schedule[new Date().getDay()];
  const workoutName = todayWorkoutKey ? getWorkoutDisplayName(todayWorkoutKey) : "";
  const exName = (ex: any) => lang === "fr" && ex.name_fr ? ex.name_fr : ex.name;
  const mealName = (meal: any) => lang === "fr" && meal.name_fr ? meal.name_fr : meal.name;
  const mealDetails = (meal: any) => lang === "fr" && meal.details_fr ? meal.details_fr : meal.details;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const nextMeal = todayMenu.meals.find((meal) => parseTime(meal.time) > currentTime);
  const dayName = t.days[now.getDay()];
  const dateStr = now.toLocaleDateString(t.date_locale, { day: "numeric", month: "long", year: "numeric" });

  // Staggered entrance animations
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
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
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

        {/* Workout Card — training days only */}
        {todayWorkout && (
          <Animated.View style={[{ marginBottom: theme.spacing.lg }, animStyle(1)]}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              {t.today_section}
            </Text>
            <View style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.xl,
              borderWidth: 1,
              borderColor: theme.colors.amberDim,
              overflow: "hidden",
            }}>
                <View style={{ padding: theme.spacing.lg }}>
                  <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800", marginBottom: 4 }}>
                    {workoutName}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: theme.spacing.lg }}>
                    {t.exercises_rest(todayWorkout.exercises.length, (todayWorkout as any).restSeconds ?? 90)}
                  </Text>
                  <View style={{ gap: 8, marginBottom: theme.spacing.lg }}>
                    {todayWorkout.exercises.map((ex, i) => (
                      <View key={ex.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Text style={{ color: theme.colors.amberDim, fontSize: 12, fontWeight: "700", width: 20 }}>
                          {String(i + 1).padStart(2, "0")}
                        </Text>
                        <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "600", flex: 1 }}>
                          {exName(ex)}
                        </Text>
                        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                          {ex.sets}×{ex.reps}
                        </Text>
                      </View>
                    ))}
                  </View>
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
                </View>
            </View>
          </Animated.View>
        )}

        {/* Next Meal Card */}
        {nextMeal && (
          <Animated.View style={[{ marginBottom: theme.spacing.lg }, animStyle(2)]}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              {t.next_meal}
            </Text>
            <View style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.xl,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.lg,
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700", marginBottom: 4 }}>
                    {mealName(nextMeal)}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                    {mealDetails(nextMeal)}
                  </Text>
                </View>
                <View style={{
                  backgroundColor: theme.colors.amberSubtle,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.sm,
                  marginLeft: 12,
                  alignItems: "center",
                }}>
                  <Ionicons name="time-outline" size={14} color={theme.colors.amber} />
                  <Text style={{ color: theme.colors.amber, fontSize: 14, fontWeight: "800", marginTop: 2 }}>
                    {nextMeal.time}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[
                  { label: t.kcal, value: String(nextMeal.kcal), color: theme.colors.amber },
                  { label: t.pro, value: `${nextMeal.protein}g`, color: theme.colors.text },
                  { label: t.carbs_label, value: `${nextMeal.carbs}g`, color: theme.colors.text },
                  { label: t.fat_label, value: `${nextMeal.fat}g`, color: theme.colors.text },
                ].map(({ label, value, color }) => (
                  <View key={label} style={{
                    flex: 1, backgroundColor: theme.colors.cardElevated,
                    borderRadius: theme.radius.sm, padding: 8, alignItems: "center",
                  }}>
                    <Text style={{ color, fontSize: 13, fontWeight: "800" }}>{value}</Text>
                    <Text style={{ color: theme.colors.muted, fontSize: 10, letterSpacing: 0.5, marginTop: 1 }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Rest day: Recovery card with nutrition totals embedded */}
        {!todayWorkout && (
          <Animated.View style={animStyle(3)}>
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
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: theme.spacing.lg }}>
                  {t.recovery_msg}
                </Text>
                {/* Nutrition totals row */}
                <View style={{
                  backgroundColor: theme.colors.cardElevated,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.md,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                  {[
                    { label: t.calories, value: `${todayMenu.totals.kcal}`, color: theme.colors.amber },
                    { label: t.protein, value: `${todayMenu.totals.protein}g`, color: theme.colors.text },
                    { label: t.carbs, value: `${todayMenu.totals.carbs}g`, color: theme.colors.text },
                    { label: t.fat, value: `${todayMenu.totals.fat}g`, color: theme.colors.text },
                  ].map(({ label, value, color }) => (
                    <View key={label} style={{ alignItems: "center" }}>
                      <Text style={{ color, fontSize: 16, fontWeight: "800" }}>{value}</Text>
                      <Text style={{ color: theme.colors.muted, fontSize: 10, marginTop: 2 }}>{label}</Text>
                    </View>
                  ))}
                </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
