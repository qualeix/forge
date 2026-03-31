import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useCallback, useRef } from "react";
import { theme } from "../../constants/theme";
import { useSettings } from "../../constants/SettingsContext";
import { useProgram } from "../../constants/ProgramContext";
import { ScalePress } from "../../components/ScalePress";

type WeightRow = { exercise_id: string; weight: number; date: string };

export default function ProgressScreen() {
  const { t, db } = useSettings();
  const { workouts, exercises, getWorkoutDisplayName } = useProgram();
  const getExName = (ex: any) => ex.name_fr || ex.name;
  const [weightMap, setWeightMap] = useState<Record<string, WeightRow>>({});
  const [activeExercise, setActiveExercise] = useState<{ id: string; name: string } | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [inputError, setInputError] = useState(false);

  const anims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(80,
      anims.map((a) =>
        Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true })
      )
    ).start();
  }, []);

  const animStyle = (i: number) => ({
    opacity: anims[Math.min(i, anims.length - 1)],
    transform: [{ translateY: anims[Math.min(i, anims.length - 1)].interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  });

  const today = new Date().toISOString().slice(0, 10);

  const loadData = useCallback(async (database: any) => {
    const rows = await database.getAllAsync(
      "SELECT exercise_id, weight, date FROM pr_entries"
    );
    const map: Record<string, WeightRow> = {};
    rows.forEach((r: WeightRow) => { map[r.exercise_id] = r; });
    setWeightMap(map);
  }, []);

  useEffect(() => {
    if (db) loadData(db);
  }, [db, loadData]);

  const saveWeight = async () => {
    if (!db || !activeExercise) return;
    const w = parseFloat(weightInput);
    if (!w || w <= 0) return;
    if (w > 250) {
      setInputError(true);
      return;
    }
    setInputError(false);
    await db.runAsync("DELETE FROM pr_entries WHERE exercise_id = ?", [activeExercise.id]);
    await db.runAsync(
      "INSERT INTO pr_entries (exercise_id, weight, date) VALUES (?, ?, ?)",
      [activeExercise.id, w, today]
    );
    setWeightInput("");
    setActiveExercise(null);
    await loadData(db);
  };

  const clearWeight = async () => {
    if (!db || !activeExercise) return;
    await db.runAsync("DELETE FROM pr_entries WHERE exercise_id = ?", [activeExercise.id]);
    setWeightInput("");
    setActiveExercise(null);
    await loadData(db);
  };

  // Groupes d'exercices dynamiques depuis ProgramContext (sans "home")
  const exerciseGroups = workouts
    .filter((w) => w.key !== "home")
    .map((w) => ({
      label: getWorkoutDisplayName(w.key),
      exercises: (exercises[w.key] ?? []).map((e) => ({
        id: e.id,
        name: e.name,
        name_fr: e.name_fr,
        sets: e.sets,
        reps: e.reps,
      })),
    }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* En-tête */}
        <Animated.View style={[{ marginBottom: theme.spacing.xl }, animStyle(0)]}>
          <Text style={{
            color: theme.colors.textSecondary,
            fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4,
          }}>
            {t.tracking}
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800", letterSpacing: -0.5 }}>
            {t.progress}
          </Text>
        </Animated.View>

        {exerciseGroups.map((group, gi) => (
          <Animated.View key={group.label + gi} style={[{ marginBottom: theme.spacing.md }, animStyle(gi + 1)]}>
            <Text style={{
              color: theme.colors.amber,
              fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase",
              marginBottom: 8,
            }}>
              {group.label}
            </Text>
            <View style={{
              backgroundColor: "rgba(245,158,11,0.08)",
              borderRadius: theme.radius.lg + 1,
              padding: 1,
            }}>
              <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.glowBorder,
                overflow: "hidden",
              }}>
                {group.exercises.length === 0 && (
                  <View style={{ padding: 16, alignItems: "center" }}>
                    <Text style={{ color: theme.colors.muted, fontSize: 13 }}>{t.program_no_exercises}</Text>
                  </View>
                )}
                {group.exercises.map((ex, i) => {
                  const entry = weightMap[ex.id];
                  const isActive = activeExercise?.id === ex.id;
                  const isToday = entry && entry.date === today;
                  return (
                    <View key={ex.id}>
                      {i > 0 && (
                        <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />
                      )}
                      <ScalePress
                        onPress={() => {
                          if (isActive) {
                            setActiveExercise(null);
                            setWeightInput("");
                            setInputError(false);
                          } else {
                            setActiveExercise({ id: ex.id, name: getExName(ex) });
                            setWeightInput("");
                            setInputError(false);
                          }
                        }}
                        style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 12 }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "600" }}>
                            {getExName(ex)}
                          </Text>
                          {entry && (
                            <Text style={{ color: theme.colors.muted, fontSize: 11, marginTop: 2 }}>
                              {entry.date.slice(5).replace("-", "/")} · {t.weight_current}{isToday ? ` · ${t.weight_today}` : ""}
                            </Text>
                          )}
                        </View>
                        <Text style={{
                          color: entry ? theme.colors.amber : theme.colors.muted,
                          fontSize: 17, fontWeight: "900", marginRight: 4,
                          shadowColor: entry ? theme.colors.amber : "transparent",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: entry ? 0.5 : 0,
                          shadowRadius: 8,
                        }}>
                          {entry ? `${entry.weight}kg` : "—"}
                        </Text>
                        <Ionicons
                          name={isActive ? "chevron-up" : entry ? "create-outline" : "add-circle-outline"}
                          size={20}
                          color={isActive ? theme.colors.amber : entry ? theme.colors.amber : theme.colors.muted}
                        />
                      </ScalePress>

                      {isActive && (
                        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
                          <View style={{ flexDirection: "row", gap: 8 }}>
                            <TextInput
                              value={weightInput}
                              onChangeText={(v) => { setWeightInput(v); setInputError(false); }}
                              placeholder={entry ? `${entry.weight} kg` : t.weight_placeholder}
                              placeholderTextColor={theme.colors.muted}
                              keyboardType="decimal-pad"
                              returnKeyType="done"
                              autoFocus
                              onSubmitEditing={saveWeight}
                              style={{
                                flex: 1,
                                backgroundColor: theme.colors.cardElevated,
                                borderRadius: theme.radius.sm,
                                paddingHorizontal: 12,
                                paddingVertical: 10,
                                color: theme.colors.text,
                                fontSize: 15, fontWeight: "700",
                                borderWidth: 1,
                                borderColor: inputError ? theme.colors.amber : theme.colors.amberDim,
                              }}
                            />
                            <ScalePress
                              onPress={saveWeight}
                              wrapperStyle={{ alignSelf: "stretch" }}
                              style={{
                                backgroundColor: theme.colors.amber,
                                borderRadius: theme.radius.sm,
                                paddingHorizontal: 16,
                                flex: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Text style={{ color: "#0D0D0D", fontWeight: "800", fontSize: 13 }}>{t.save}</Text>
                            </ScalePress>
                            {entry && (
                              <ScalePress
                                onPress={clearWeight}
                                wrapperStyle={{ alignSelf: "stretch" }}
                                style={{
                                  backgroundColor: theme.colors.cardElevated,
                                  borderRadius: theme.radius.sm,
                                  borderWidth: 1,
                                  borderColor: theme.colors.amberDeep,
                                  paddingHorizontal: 12,
                                  flex: 1,
                                  justifyContent: "center",
                                }}
                              >
                                <Ionicons name="close-circle-outline" size={16} color={theme.colors.muted} />
                              </ScalePress>
                            )}
                          </View>
                          {inputError && (
                            <Text style={{ color: theme.colors.amber, fontSize: 11, marginTop: 6 }}>
                              {t.weight_max_error}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
