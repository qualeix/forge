import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { theme } from "../../constants/theme";
import { getTodayMenu, getTodayKey, MENU_DATA, type DayKey } from "../../constants/data";

const DAY_ORDER: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const EXPANDED_HEIGHT = 1200;

function ExpandableDay({ dayKey, isToday }: { dayKey: DayKey; isToday: boolean }) {
  const day = MENU_DATA[dayKey];
  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(anim, { toValue, duration: 280, useNativeDriver: false }).start();
    Animated.timing(chevronAnim, { toValue, duration: 280, useNativeDriver: true }).start();
    setIsOpen((v) => !v);
  };

  const maxHeight = anim.interpolate({ inputRange: [0, 1], outputRange: [0, EXPANDED_HEIGHT] });
  const chevronRotate = chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });

  return (
    <View style={{
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: isToday ? theme.colors.glowBorder : theme.colors.border,
      overflow: "hidden",
      ...(isToday ? theme.glow : {}),
    }}>
      <Pressable
        onPress={toggle}
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700" }}>{day.label}</Text>
            {isToday && (
              <View style={{
                backgroundColor: theme.colors.amberSubtle,
                borderRadius: theme.radius.full,
                paddingHorizontal: 7,
                paddingVertical: 2,
                borderWidth: 1,
                borderColor: theme.colors.amberDeep,
              }}>
                <Text style={{ color: theme.colors.amber, fontSize: 9, fontWeight: "700", letterSpacing: 1 }}>TODAY</Text>
              </View>
            )}
          </View>
          <Text style={{ color: isOpen ? theme.colors.amber : theme.colors.muted, fontSize: 11 }}>
            {day.type === "gym" ? "⚡ Gym Day" : "Rest Day"} · {day.totals.kcal} kcal · {day.totals.protein}g protein
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Ionicons name="chevron-down" size={18} color={isOpen ? theme.colors.amber : theme.colors.muted} />
        </Animated.View>
      </Pressable>

      <Animated.View style={{ maxHeight, overflow: "hidden" }}>
        <View style={{ paddingHorizontal: 12, paddingBottom: 12, gap: 8 }}>
          {day.meals.map((meal, i) => (
            <View key={i} style={{
              backgroundColor: theme.colors.cardElevated,
              borderRadius: theme.radius.md,
              padding: 12,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ color: theme.colors.text, fontWeight: "700", fontSize: 13, flex: 1, marginRight: 8 }}>
                  {meal.name}
                </Text>
                <Text style={{ color: theme.colors.amber, fontWeight: "800", fontSize: 13 }}>{meal.time}</Text>
              </View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, lineHeight: 17, marginBottom: 8 }}>
                {meal.details}
              </Text>
              <View style={{ flexDirection: "row", gap: 6 }}>
                {[
                  { label: "kcal", value: String(meal.kcal), color: theme.colors.amber },
                  { label: "pro", value: `${meal.protein}g`, color: theme.colors.text },
                  { label: "carbs", value: `${meal.carbs}g`, color: theme.colors.text },
                  { label: "fat", value: `${meal.fat}g`, color: theme.colors.text },
                ].map(({ label, value, color }) => (
                  <View key={label} style={{
                    flex: 1, backgroundColor: theme.colors.card,
                    borderRadius: theme.radius.sm, padding: 6, alignItems: "center",
                  }}>
                    <Text style={{ color, fontSize: 11, fontWeight: "800" }}>{value}</Text>
                    <Text style={{ color: theme.colors.muted, fontSize: 9, letterSpacing: 0.3, marginTop: 1 }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function WeeklyMenuModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const todayKey = getTodayKey();

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
        {/* Header */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
        }}>
          <View>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 }}>
              Planning
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 }}>
              Weekly Menu
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={{ padding: 8 }}
          >
            <Ionicons name="close" size={24} color={theme.colors.muted} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: theme.spacing.lg, paddingTop: theme.spacing.md, gap: 8, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          {DAY_ORDER.map((dayKey) => (
            <ExpandableDay key={dayKey} dayKey={dayKey} isToday={dayKey === todayKey} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function MealsScreen() {
  const todayMenu = getTodayMenu();
  const [weeklyVisible, setWeeklyVisible] = useState(false);

  // Entrance animations
  const anims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(80,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true }))
    ).start();
  }, []);
  const animStyle = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const nextMealIndex = todayMenu.meals.findIndex(
    (ml) => parseTime(ml.time) > currentMinutes
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <WeeklyMenuModal visible={weeklyVisible} onClose={() => setWeeklyVisible(false)} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[{ marginBottom: theme.spacing.xl }, animStyle(0)]}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            Nutrition
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800", letterSpacing: -0.5 }}>
            Today's Meals
          </Text>
        </Animated.View>

        {/* Daily totals bar */}
        <Animated.View style={animStyle(0)}>
          <View style={{
            backgroundColor: theme.colors.amberSubtle,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.amberDim,
            padding: theme.spacing.md,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: theme.spacing.lg,
          }}>
            {[
              { label: "Calories", value: `${todayMenu.totals.kcal}`, color: theme.colors.amber },
              { label: "Protein", value: `${todayMenu.totals.protein}g`, color: theme.colors.text },
              { label: "Carbs", value: `${todayMenu.totals.carbs}g`, color: theme.colors.text },
              { label: "Fat", value: `${todayMenu.totals.fat}g`, color: theme.colors.text },
            ].map(({ label, value, color }) => (
              <View key={label} style={{ alignItems: "center" }}>
                <Text style={{ color, fontSize: 16, fontWeight: "800" }}>{value}</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 10, marginTop: 1 }}>{label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Meal cards */}
        <Animated.View style={[{ gap: 12 }, animStyle(1)]}>
          {todayMenu.meals.map((meal, index) => {
            const mealMinutes = parseTime(meal.time);
            const isPast = mealMinutes < currentMinutes;
            const isNext = nextMealIndex === index;

            return (
              <View key={index} style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: isNext ? theme.colors.amberDim : theme.colors.border,
                overflow: "hidden",
                opacity: isPast ? 0.45 : 1,
              }}>
                {isNext && <View style={{ height: 2, backgroundColor: theme.colors.amber }} />}
                <View style={{ padding: theme.spacing.md }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700", flex: 1 }}>
                      {meal.name}
                    </Text>
                    <Text style={{ color: isNext ? theme.colors.amber : theme.colors.muted, fontSize: 13, fontWeight: "700" }}>
                      {meal.time}
                    </Text>
                  </View>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 12 }}>
                    {meal.details}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {[
                      { label: "KCAL", value: meal.kcal, color: theme.colors.amber },
                      { label: "PRO", value: `${meal.protein}g`, color: theme.colors.text },
                      { label: "CARBS", value: `${meal.carbs}g`, color: theme.colors.text },
                      { label: "FAT", value: `${meal.fat}g`, color: theme.colors.text },
                    ].map(({ label, value, color }) => (
                      <View key={label} style={{
                        flex: 1,
                        backgroundColor: theme.colors.cardElevated,
                        borderRadius: theme.radius.sm,
                        padding: 6,
                        alignItems: "center",
                      }}>
                        <Text style={{ color, fontSize: 12, fontWeight: "800" }}>{value}</Text>
                        <Text style={{ color: theme.colors.muted, fontSize: 9, letterSpacing: 0.5 }}>{label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Weekly Menu Button */}
        <Animated.View style={[{ marginTop: theme.spacing.xl }, animStyle(2)]}>
          <Pressable
            onPress={() => setWeeklyVisible(true)}
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: theme.spacing.md,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View style={{
                backgroundColor: theme.colors.amberSubtle,
                borderRadius: theme.radius.sm,
                padding: 8,
                borderWidth: 1,
                borderColor: theme.colors.amberDeep,
              }}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.amber} />
              </View>
              <View>
                <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: "700" }}>Weekly Menu</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 1 }}>Browse all 7 days · plan groceries</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
