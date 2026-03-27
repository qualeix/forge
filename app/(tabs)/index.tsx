import { View, Text, ScrollView, Pressable, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { theme } from "../../constants/theme";
import { getTodayMenu, getTodayWorkout, getTodayKey } from "../../constants/data";

export default function TodayScreen() {
  const router = useRouter();
  const todayMenu = getTodayMenu();
  const todayWorkout = getTodayWorkout();
  const todayKey = getTodayKey();

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const nextMeal = todayMenu.meals.find(
    (meal) => parseTime(meal.time) > currentTime
  );

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[new Date().getDay()];
  const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  // Staggered entrance animations
  const anims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const btnPressIn = () => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, tension: 220, friction: 7 }).start();
  const btnPressOut = () => Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, tension: 220, friction: 7 }).start();

  useEffect(() => {
    Animated.stagger(90,
      anims.map((a) =>
        Animated.parallel([
          Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  const animStyle = (i: number) => ({
    opacity: anims[i],
    transform: [{
      translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [22, 0] }),
    }],
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
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 }}>
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
                fontSize: 11, fontWeight: "700",
                letterSpacing: 1.5, textTransform: "uppercase",
              }}>
                {todayWorkout ? `⚡ ${todayWorkout.name}` : "Rest Day"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Workout Card */}
        {todayWorkout && (
          <Animated.View style={[{ marginBottom: theme.spacing.lg }, animStyle(1)]}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Today's Session
            </Text>
            <View style={{ ...theme.glow, borderRadius: theme.radius.xl }}>
              <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.xl,
                borderWidth: 1,
                borderColor: theme.colors.glowBorder,
                overflow: "hidden",
              }}>
                <View style={{ padding: theme.spacing.lg }}>
                  <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800", marginBottom: 4 }}>
                    {todayWorkout.name}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: theme.spacing.lg }}>
                    {todayWorkout.exercises.length} exercises · 90s rest
                  </Text>
                  <View style={{ gap: 8, marginBottom: theme.spacing.lg }}>
                    {todayWorkout.exercises.map((ex, i) => (
                      <View key={ex.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Text style={{ color: theme.colors.amberDim, fontSize: 12, fontWeight: "700", width: 20 }}>
                          {String(i + 1).padStart(2, "0")}
                        </Text>
                        <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "600", flex: 1 }}>
                          {ex.name}
                        </Text>
                        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                          {ex.sets}×{ex.reps}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <Animated.View style={{ ...theme.glow, borderRadius: theme.radius.md, transform: [{ scale: btnScale }] }}>
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
                        START SESSION
                      </Text>
                    </Pressable>
                  </Animated.View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Next Meal Card */}
        {nextMeal && (
          <Animated.View style={[{ marginBottom: theme.spacing.lg }, animStyle(2)]}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Next Meal
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
                    {nextMeal.name}
                  </Text>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                    {nextMeal.details}
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
                  { label: "KCAL", value: nextMeal.kcal, color: theme.colors.amber },
                  { label: "PRO", value: `${nextMeal.protein}g`, color: theme.colors.text },
                  { label: "CARBS", value: `${nextMeal.carbs}g`, color: theme.colors.text },
                  { label: "FAT", value: `${nextMeal.fat}g`, color: theme.colors.text },
                ].map(({ label, value, color }) => (
                  <View key={label} style={{
                    flex: 1,
                    backgroundColor: theme.colors.cardElevated,
                    borderRadius: theme.radius.sm,
                    padding: 8,
                    alignItems: "center",
                  }}>
                    <Text style={{ color, fontSize: 13, fontWeight: "800" }}>{value}</Text>
                    <Text style={{ color: theme.colors.muted, fontSize: 10, letterSpacing: 0.5, marginTop: 1 }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Daily totals */}
        <Animated.View style={animStyle(3)}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            Daily Totals
          </Text>
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.xl,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg,
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
            {[
              { label: "Calories", value: `${todayMenu.totals.kcal}`, color: theme.colors.amber },
              { label: "Protein", value: `${todayMenu.totals.protein}`, color: theme.colors.text },
              { label: "Carbs", value: `${todayMenu.totals.carbs}`, color: theme.colors.text },
              { label: "Fat", value: `${todayMenu.totals.fat}`, color: theme.colors.text },
            ].map(({ label, value, color }) => (
              <View key={label} style={{ alignItems: "center" }}>
                <Text style={{ color, fontSize: 20, fontWeight: "800" }}>{value}</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 11, marginTop: 2 }}>{label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
