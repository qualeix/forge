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
import * as SQLite from "expo-sqlite";
import { theme } from "../../constants/theme";
import { WORKOUT_DATA } from "../../constants/data";

type PRRow = { exercise_id: string; weight: number; date: string };

const EXERCISE_GROUPS = [
  { label: "Push Day", exercises: WORKOUT_DATA.tuesday.exercises },
  { label: "Pull Day", exercises: WORKOUT_DATA.friday.exercises },
  { label: "Leg Day", exercises: WORKOUT_DATA.sunday.exercises },
];

export default function ProgressScreen() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [prMap, setPrMap] = useState<Record<string, PRRow>>({});
  const [activePR, setActivePR] = useState<{ id: string; name: string } | null>(null);
  const [prInput, setPrInput] = useState("");

  // Staggered entrance: header + 3 groups
  const anims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(80,
      anims.map((a) =>
        Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true })
      )
    ).start();
  }, []);

  const animStyle = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  const today = new Date().toISOString().slice(0, 10);

  const loadData = useCallback(async (database: SQLite.SQLiteDatabase) => {
    const prs = await database.getAllAsync<PRRow>(
      "SELECT exercise_id, MAX(weight) as weight, date FROM pr_entries GROUP BY exercise_id"
    );
    const map: Record<string, PRRow> = {};
    prs.forEach((pr) => { map[pr.exercise_id] = pr; });
    setPrMap(map);
  }, []);

  useEffect(() => {
    async function init() {
      const database = await SQLite.openDatabaseAsync("forge.db");
      await database.runAsync(
        "CREATE TABLE IF NOT EXISTS pr_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_id TEXT NOT NULL, weight REAL NOT NULL, date TEXT NOT NULL)"
      );
      setDb(database);
      await loadData(database);
    }
    init();
  }, [loadData]);

  const logPR = async () => {
    if (!db || !activePR) return;
    const w = parseFloat(prInput);
    if (!w || w <= 0) return;
    await db.runAsync(
      "INSERT INTO pr_entries (exercise_id, weight, date) VALUES (?, ?, ?)",
      [activePR.id, w, today]
    );
    setPrInput("");
    setActivePR(null);
    await loadData(db);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View style={[{ marginBottom: theme.spacing.xl }, animStyle(0)]}>
          <Text style={{
            color: theme.colors.textSecondary,
            fontSize: 11, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 4,
          }}>
            Tracking
          </Text>
          <Text style={{
            color: theme.colors.text,
            fontSize: 32, fontWeight: "800", letterSpacing: -0.5,
          }}>
            Progress
          </Text>
        </Animated.View>

        {/* PR Section */}
        <Animated.View style={animStyle(0)}>
          <Text style={{
            color: theme.colors.textSecondary,
            fontSize: 11, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 12,
          }}>
            Personal Records
          </Text>
        </Animated.View>

        {EXERCISE_GROUPS.map((group, gi) => (
          <Animated.View key={group.label} style={[{ marginBottom: theme.spacing.md }, animStyle(gi + 1)]}>
            <Text style={{
              color: theme.colors.amber,
              fontSize: 11, fontWeight: "700",
              letterSpacing: 1.5, textTransform: "uppercase",
              marginBottom: 8,
            }}>
              {group.label}
            </Text>
            <View style={{
              ...theme.glow,
              borderRadius: theme.radius.lg,
            }}>
              <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.colors.glowBorder,
                overflow: "hidden",
              }}>
                {group.exercises.map((ex, i) => {
                  const pr = prMap[ex.id];
                  const isActive = activePR?.id === ex.id;
                  const isNew = pr && pr.date === today;
                  return (
                    <View key={ex.id}>
                      {i > 0 && (
                        <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />
                      )}
                      <Pressable
                        onPress={() => {
                          if (isActive) {
                            setActivePR(null);
                            setPrInput("");
                          } else {
                            setActivePR({ id: ex.id, name: ex.name });
                            setPrInput("");
                          }
                        }}
                        style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 12 }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "600" }}>
                            {ex.name}
                          </Text>
                          {pr && (
                            <Text style={{ color: theme.colors.muted, fontSize: 11, marginTop: 2 }}>
                              {pr.date.slice(5).replace("-", "/")} · best
                              {isNew ? " · today" : ""}
                            </Text>
                          )}
                        </View>
                        <Text style={{
                          color: pr ? theme.colors.amberBright : theme.colors.muted,
                          fontSize: 17, fontWeight: "900", marginRight: 4,
                          shadowColor: pr ? theme.colors.amber : "transparent",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: pr ? 0.5 : 0,
                          shadowRadius: 8,
                        }}>
                          {pr ? `${pr.weight}kg` : "—"}
                        </Text>
                        <Ionicons
                          name={isActive ? "chevron-up" : "add-circle-outline"}
                          size={20}
                          color={isActive ? theme.colors.amber : theme.colors.muted}
                        />
                      </Pressable>

                      {isActive && (
                        <View style={{
                          paddingHorizontal: 16,
                          paddingBottom: 14,
                          flexDirection: "row",
                          gap: 8,
                        }}>
                          <TextInput
                            value={prInput}
                            onChangeText={setPrInput}
                            placeholder={pr ? `Beat ${pr.weight}kg` : "weight in kg"}
                            placeholderTextColor={theme.colors.muted}
                            keyboardType="decimal-pad"
                            returnKeyType="done"
                            autoFocus
                            onSubmitEditing={logPR}
                            style={{
                              flex: 1,
                              backgroundColor: theme.colors.cardElevated,
                              borderRadius: theme.radius.sm,
                              paddingHorizontal: 12,
                              paddingVertical: 10,
                              color: theme.colors.text,
                              fontSize: 15,
                              fontWeight: "700",
                              borderWidth: 1,
                              borderColor: theme.colors.amberDim,
                            }}
                          />
                          <Pressable
                            onPress={logPR}
                            style={{
                              backgroundColor: theme.colors.amber,
                              borderRadius: theme.radius.sm,
                              paddingHorizontal: 16,
                              justifyContent: "center",
                              shadowColor: theme.colors.amber,
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.4,
                              shadowRadius: 8,
                            }}
                          >
                            <Text style={{ color: "#0D0D0D", fontWeight: "800", fontSize: 13 }}>SAVE</Text>
                          </Pressable>
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
