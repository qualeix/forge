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
import { useSettings } from "../../constants/SettingsContext";

const DAY_ORDER: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const DAY_KEY_INDEX: Record<DayKey, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

const EXPANDED_HEIGHT = 900;

function ExpandableDay({ dayKey, isToday }: { dayKey: DayKey; isToday: boolean }) {
  const day = MENU_DATA[dayKey];
  const { t } = useSettings();
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
    }}>
      <Pressable
        onPress={toggle}
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700" }}>{t.days[DAY_KEY_INDEX[dayKey]]}</Text>
            {isToday && (
              <View style={{
                backgroundColor: theme.colors.amberSubtle,
                borderRadius: theme.radius.full,
                paddingHorizontal: 7,
                paddingVertical: 2,
                borderWidth: 1,
                borderColor: theme.colors.amberDeep,
              }}>
                <Text style={{ color: theme.colors.amber, fontSize: 9, fontWeight: "700", letterSpacing: 1 }}>
                  {t.today_badge}
                </Text>
              </View>
            )}
          </View>
          <Text style={{ color: isOpen ? theme.colors.amber : theme.colors.muted, fontSize: 11 }}>
            {day.type === "gym" ? `⚡ ${t.gym_day}` : t.rest_day}
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
                  {(meal as any).name_fr || meal.name}
                </Text>
                <Text style={{ color: theme.colors.amber, fontWeight: "800", fontSize: 13 }}>{meal.time}</Text>
              </View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, lineHeight: 17 }}>
                {(meal as any).details_fr || meal.details}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function WeeklyMenuModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const todayKey = getTodayKey();
  const { t } = useSettings();

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
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
              {t.planning}
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 }}>
              {t.weekly_menu}
            </Text>
          </View>
          <Pressable onPress={onClose} style={{ padding: 8 }}>
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
  const { t } = useSettings();
  const [weeklyVisible, setWeeklyVisible] = useState(false);

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

  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextMealIndex = todayMenu.meals.findIndex((ml) => parseTime(ml.time) > currentMinutes);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <WeeklyMenuModal visible={weeklyVisible} onClose={() => setWeeklyVisible(false)} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <Animated.View style={[{ marginBottom: theme.spacing.xl }, animStyle(0)]}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            {t.nutrition}
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800", letterSpacing: -0.5 }}>
            {t.todays_meals}
          </Text>
        </Animated.View>

        {/* Cartes repas */}
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
                <View style={{ padding: theme.spacing.md }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700", flex: 1 }}>
                      {(meal as any).name_fr || meal.name}
                    </Text>
                    <Text style={{ color: isNext ? theme.colors.amber : theme.colors.muted, fontSize: 13, fontWeight: "700" }}>
                      {meal.time}
                    </Text>
                  </View>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                    {(meal as any).details_fr || meal.details}
                  </Text>
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Bouton menu de la semaine */}
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
                <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: "700" }}>{t.weekly_menu}</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 1 }}>{t.weekly_menu_sub}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
