import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { theme } from "../../constants/theme";
import { getTodayKey, type DayKey } from "../../constants/data";
import { useSettings } from "../../constants/SettingsContext";
import { useMenu, type MenuMeal } from "../../constants/MenuContext";
import { useProgram } from "../../constants/ProgramContext";
import { ScalePress } from "../../components/ScalePress";

const DAY_ORDER: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const DAY_KEY_INDEX: Record<DayKey, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
};

const EXPANDED_HEIGHT = 1400;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

// ─── Edit Meal Modal (bottom sheet) ─────────────────────────────────────────

function EditMealModal({
  visible,
  meal,
  onClose,
  onSave,
}: {
  visible: boolean;
  meal: MenuMeal | null;
  onClose: () => void;
  onSave: (fields: { name: string; time: string; details: string }) => void;
}) {
  const { t } = useSettings();
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (visible) {
      setName(meal?.name ?? "");
      setTime(meal?.time ?? "");
      setDetails(meal?.details ?? "");
    }
  }, [visible, meal]);

  const isValidTime = TIME_RE.test(time.trim());
  const canSave = name.trim().length > 0 && isValidTime;

  const handleTimeChange = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (digits.length <= 2) {
      setTime(digits);
    } else {
      setTime(digits.slice(0, 2) + ":" + digits.slice(2, 4));
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)" }}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%", maxHeight: "85%" }}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingRight: 2 }} keyboardDismissMode="on-drag">
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", flex: 1 }}>
                {meal ? t.meals_edit_meal : t.meals_add_meal_title}
              </Text>
              <ScalePress onPress={onClose} hitSlop={8} style={{ padding: 4 }}>
                <Ionicons name="close" size={26} color={theme.colors.amber} />
              </ScalePress>
            </View>

            <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.meals_meal_name}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.meals_meal_name}
              placeholderTextColor={theme.colors.muted}
              style={{
                backgroundColor: theme.colors.cardElevated,
                color: theme.colors.text,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.amberDim,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 15,
                fontWeight: "700",
                marginBottom: 10,
              }}
            />

            <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.meals_meal_time}</Text>
            <TextInput
              value={time}
              onChangeText={handleTimeChange}
              placeholder="08:30"
              placeholderTextColor={theme.colors.muted}
              keyboardType="number-pad"
              maxLength={5}
              style={{
                backgroundColor: theme.colors.cardElevated,
                color: theme.colors.text,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: time.length > 0 && !isValidTime ? "#EF4444" : theme.colors.border,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 15,
                fontWeight: "700",
                marginBottom: time.length > 0 && !isValidTime ? 4 : 10,
              }}
            />
            {time.length > 0 && !isValidTime && (
              <Text style={{ color: "#EF4444", fontSize: 11, marginBottom: 10 }}>Format invalide, ex: 08:30, 23:45</Text>
            )}

            <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.meals_meal_details}</Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder={t.meals_meal_details}
              placeholderTextColor={theme.colors.muted}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: theme.colors.cardElevated,
                color: theme.colors.text,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 14,
                paddingVertical: 10,
                fontSize: 14,
                marginBottom: 16,
                minHeight: 72,
                textAlignVertical: "top",
              }}
            />

            <ScalePress
              onPress={() => canSave && onSave({ name: name.trim(), time: time.trim(), details: details.trim() })}
              style={{
                backgroundColor: canSave ? theme.colors.amber : theme.colors.cardElevated,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: canSave ? theme.colors.amber : theme.colors.border,
                paddingVertical: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: canSave ? "#0D0D0D" : theme.colors.muted, fontWeight: "900", fontSize: 15 }}>{t.save}</Text>
            </ScalePress>
          </ScrollView>
        </Pressable>
      </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Expandable Day ──────────────────────────────────────────────────────────

function ExpandableDay({ dayKey, isToday }: { dayKey: DayKey; isToday: boolean }) {
  const { menuData, addMeal, updateMeal, deleteMeal } = useMenu();
  const meals = menuData[dayKey] ?? [];
  const { t } = useSettings();
  const { schedule } = useProgram();
  const isGymDay = !!schedule[DAY_KEY_INDEX[dayKey]];

  const [isOpen, setIsOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(0)).current;
  const [editingMeal, setEditingMeal] = useState<MenuMeal | "new" | null>(null);

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
      {/* Header */}
      <Pressable
        onPress={toggle}
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700" }}>
              {t.days[DAY_KEY_INDEX[dayKey]]}
            </Text>
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
            {isGymDay ? `⚡ ${t.gym_day}` : t.rest_day}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Ionicons name="chevron-down" size={18} color={isOpen ? theme.colors.amber : theme.colors.muted} />
        </Animated.View>
      </Pressable>

      {/* Expanded content */}
      <Animated.View style={{ maxHeight, overflow: "hidden" }}>
        <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
          <View style={{
            backgroundColor: theme.colors.cardElevated,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: "hidden",
          }}>
            {meals.map((meal, i) => (
              <View key={meal.id}>
                {i > 0 && <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 12 }} />}
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 11, paddingLeft: 14, paddingRight: 8, gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: "700", fontSize: 13 }}>{meal.name}</Text>
                    {meal.details.length > 0 && (
                      <Text style={{ color: theme.colors.textSecondary, fontSize: 11, lineHeight: 16, marginTop: 2 }}>
                        {meal.details}
                      </Text>
                    )}
                  </View>
                  {meal.notif_enabled === 0 && (
                    <Ionicons name="notifications-off-outline" size={13} color={theme.colors.muted} />
                  )}
                  <Text style={{ color: theme.colors.amber, fontWeight: "800", fontSize: 13, marginRight: 4 }}>{meal.time}</Text>
                  <ScalePress onPress={() => setEditingMeal(meal)} hitSlop={6} style={{ padding: 6 }}>
                    <Ionicons name="create-outline" size={17} color={theme.colors.amber} />
                  </ScalePress>
                  <ScalePress onPress={() => deleteMeal(meal.id)} hitSlop={6} style={{ padding: 6 }}>
                    <Ionicons name="close-circle-outline" size={17} color="#EF4444" />
                  </ScalePress>
                </View>
              </View>
            ))}
            <ScalePress
              onPress={() => setEditingMeal("new")}
              style={{
                flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.colors.border,
              }}
            >
              <Ionicons name="add-circle-outline" size={16} color={theme.colors.amber} />
              <Text style={{ color: theme.colors.amber, fontSize: 12, fontWeight: "700" }}>{t.meals_add_meal_btn}</Text>
            </ScalePress>
          </View>
        </View>
      </Animated.View>

      <EditMealModal
        visible={editingMeal !== null}
        meal={editingMeal === "new" ? null : (editingMeal as MenuMeal | null)}
        onClose={() => setEditingMeal(null)}
        onSave={async (fields) => {
          if (editingMeal === "new") {
            await addMeal(dayKey, { ...fields, notif_enabled: 1 });
          } else if (editingMeal) {
            await updateMeal((editingMeal as MenuMeal).id, fields);
          }
          setEditingMeal(null);
        }}
      />
    </View>
  );
}

// ─── Weekly Menu Modal ───────────────────────────────────────────────────────

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
          <ScalePress onPress={onClose} style={{ padding: 8 }}>
            <Ionicons name="close" size={26} color={theme.colors.amber} />
          </ScalePress>
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

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function MealsScreen() {
  const { t } = useSettings();
  const { menuData } = useMenu();
  const todayKey = getTodayKey();
  const todayMeals = menuData[todayKey] ?? [];
  const [weeklyVisible, setWeeklyVisible] = useState(false);

  const anims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(80,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true }))
    ).start();
  }, []);
  const animStyle = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  });

  const parseTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextMealIndex = todayMeals.findIndex((ml) => parseTime(ml.time) > currentMinutes);

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

        {/* Cartes repas du jour */}
        <Animated.View style={[{ gap: 12 }, animStyle(1)]}>
          {todayMeals.map((meal, index) => {
            const mealMinutes = parseTime(meal.time);
            const isPast = mealMinutes < currentMinutes;
            const isNext = nextMealIndex === index;

            return (
              <View key={meal.id} style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: isNext ? theme.colors.amberDim : theme.colors.border,
                overflow: "hidden",
                opacity: isPast ? 0.45 : 1,
              }}>
                <View style={{ padding: theme.spacing.md }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: meal.details.length > 0 ? 8 : 0 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700", flex: 1 }}>
                      {meal.name}
                    </Text>
                    <Text style={{ color: isNext ? theme.colors.amber : theme.colors.muted, fontSize: 13, fontWeight: "700" }}>
                      {meal.time}
                    </Text>
                  </View>
                  {meal.details.length > 0 && (
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 13, lineHeight: 18 }}>
                      {meal.details}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Bouton menu de la semaine */}
        <Animated.View style={[{ marginTop: theme.spacing.xl }, animStyle(2)]}>
          <ScalePress
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
          </ScalePress>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
