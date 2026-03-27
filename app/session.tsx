import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import * as SQLite from "expo-sqlite";
import { theme } from "../constants/theme";
import { getTodayWorkout } from "../constants/data";
import { useSettings } from "./SettingsContext";

// Reusable animated press button
function ScalePress({
  onPress,
  children,
  style,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, tension: 220, friction: 7 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 220, friction: 7 }).start();
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function SessionScreen() {
  const router = useRouter();
  const { t, lang } = useSettings();
  const workout = getTodayWorkout();
  const exName = (ex: any) => lang === "fr" && ex.name_fr ? ex.name_fr : ex.name;
  const exCue = (ex: any) => lang === "fr" && ex.cue_fr ? ex.cue_fr : ex.cue;
  const exTechnique = (ex: any) => lang === "fr" && ex.technique_fr ? ex.technique_fr : ex.technique;
  const workoutName = workout
    ? (lang === "fr" && (workout as any).name_fr ? (workout as any).name_fr : workout.name)
    : "";

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(90);
  const [expandedCue, setExpandedCue] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(0)).current;
  const [sessionDone, setSessionDone] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [prMap, setPrMap] = useState<Record<string, number>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restTypeRef = useRef<"set" | "exercise">("set");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const setDoneScale = useRef(new Animated.Value(1)).current;

  const exercises = workout?.exercises ?? [];
  const currentExercise = exercises[currentExerciseIndex];
  const totalSets = typeof currentExercise?.sets === "number" ? currentExercise.sets : 3;
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const isLastSet = currentSet === totalSets;

  // Load PRs from SQLite
  useEffect(() => {
    async function loadPRs() {
      try {
        const db = await SQLite.openDatabaseAsync("forge.db");
        const rows = await db.getAllAsync<{ exercise_id: string; weight: number }>(
          "SELECT exercise_id, MAX(weight) as weight FROM pr_entries GROUP BY exercise_id"
        );
        const map: Record<string, number> = {};
        rows.forEach((r) => { map[r.exercise_id] = r.weight; });
        setPrMap(map);
      } catch { /* DB not initialized yet */ }
    }
    loadPRs();
  }, []);

  // Slide + fade in
  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 100, friction: 10 }),
    ]).start();
  };

  useEffect(() => { animateIn(); }, []);

  // Breathing glow on SET DONE
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const advanceAfterRest = () => {
    if (restTypeRef.current === "exercise") {
      setCurrentExerciseIndex((i) => i + 1);
      setCurrentSet(1);
      setExpandedCue(false);
      expandAnim.setValue(0);
      chevronAnim.setValue(0);
    } else {
      setCurrentSet((s) => s + 1);
    }
  };

  useEffect(() => {
    if (!isResting) return;
    setRestSecondsLeft(90);
    timerRef.current = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          advanceAfterRest();
          setIsResting(false);
          animateIn();
          return 90;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isResting]);

  const handleSetDone = () => {
    if (isLastSet && isLastExercise) {
      setSessionDone(true);
      return;
    }
    restTypeRef.current = isLastSet ? "exercise" : "set";
    setIsResting(true);
  };

  const skipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    advanceAfterRest();
    setIsResting(false);
    animateIn();
  };

  const toggleTechnique = () => {
    const toValue = expandedCue ? 0 : 1;
    Animated.timing(expandAnim, { toValue, duration: 280, useNativeDriver: false }).start();
    Animated.timing(chevronAnim, { toValue, duration: 280, useNativeDriver: true }).start();
    setExpandedCue((v) => !v);
  };

  const pressSetDoneIn = () =>
    Animated.spring(setDoneScale, { toValue: 0.95, useNativeDriver: true, tension: 220, friction: 7 }).start();
  const pressSetDoneOut = () =>
    Animated.spring(setDoneScale, { toValue: 1, useNativeDriver: true, tension: 220, friction: 7 }).start();

  // ── EXIT MODAL ──
  const ExitModal = (
    <Modal visible={showExitModal} transparent animationType="fade" statusBarTranslucent>
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.88)",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.lg,
      }}>
        <View style={{
          backgroundColor: theme.colors.card,
          borderRadius: theme.radius.xl,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.xl,
          width: "100%",
        }}>
          <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", marginBottom: 6 }}>
            {t.session_end_title}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 28 }}>
            {currentExerciseIndex > 0
              ? t.session_exercises_done(currentExerciseIndex, exercises.length)
              : t.session_just_started}{"\n"}{t.session_no_save}
          </Text>
          <View style={{ gap: 10 }}>
            <ScalePress
              onPress={() => setShowExitModal(false)}
              style={{ borderRadius: theme.radius.md }}
            >
              <View style={{ backgroundColor: theme.colors.amber, borderRadius: theme.radius.md, paddingVertical: 15, alignItems: "center" }}>
                <Text style={{ color: "#0D0D0D", fontWeight: "900", fontSize: 15 }}>{t.session_keep_going}</Text>
              </View>
            </ScalePress>
            <ScalePress
              onPress={() => { setShowExitModal(false); router.back(); }}
              style={{ borderRadius: theme.radius.md }}
            >
              <View style={{
                backgroundColor: theme.colors.cardElevated,
                borderWidth: 1,
                borderColor: theme.colors.amberDeep,
                borderRadius: theme.radius.md,
                paddingVertical: 15,
                alignItems: "center",
              }}>
                <Text style={{ color: theme.colors.amberDim, fontWeight: "700", fontSize: 15 }}>{t.session_end}</Text>
              </View>
            </ScalePress>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!workout) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700", marginBottom: 8 }}>{t.session_rest_day_title}</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 14, marginBottom: 32 }}>{t.session_no_session}</Text>
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.md, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: theme.colors.amber, fontWeight: "700" }}>{t.session_go_back}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (sessionDone) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
        <Text style={{ fontSize: 72, marginBottom: 16 }}>🔥</Text>
        <Text style={{ color: theme.colors.amber, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          {t.session_complete}
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 36, fontWeight: "900", textAlign: "center", marginBottom: 8 }}>
          {workoutName}
        </Text>
        <Text style={{ color: theme.colors.muted, fontSize: 15, marginBottom: 56 }}>
          {t.session_crushed(exercises.length)}
        </Text>
        <View style={{ ...theme.glow, borderRadius: theme.radius.md }}>
          <ScalePress onPress={() => router.back()}>
            <View style={{ backgroundColor: theme.colors.amber, borderRadius: theme.radius.md, paddingVertical: 16, paddingHorizontal: 56 }}>
              <Text style={{ color: "#0D0D0D", fontSize: 16, fontWeight: "900", letterSpacing: 1 }}>{t.session_done}</Text>
            </View>
          </ScalePress>
        </View>
      </SafeAreaView>
    );
  }

  const restProgress = restSecondsLeft / 90;
  const restIsForExercise = restTypeRef.current === "exercise";
  const currentPR = prMap[currentExercise?.id ?? ""];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {ExitModal}

      {/* Header */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
      }}>
        <Pressable onPress={() => setShowExitModal(true)}>
          <Ionicons name="close" size={24} color={theme.colors.muted} />
        </Pressable>
        <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "700", letterSpacing: 1.5 }}>
          {workoutName.toUpperCase()}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13, fontWeight: "600" }}>
          {currentExerciseIndex + 1} / {exercises.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={{ height: 2, backgroundColor: theme.colors.border, marginHorizontal: theme.spacing.lg, borderRadius: 1 }}>
        <View style={{
          height: 2,
          backgroundColor: theme.colors.amber,
          borderRadius: 1,
          width: `${(currentExerciseIndex / exercises.length) * 100}%`,
        }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {isResting ? (
          /* ── REST SCREEN ── */
          <View style={{ alignItems: "center", paddingTop: 24 }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
              {t.session_rest}
            </Text>

            {/* Timer ring */}
            <View style={{ width: 200, height: 200, alignItems: "center", justifyContent: "center", marginBottom: 36 }}>
              <View style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, borderWidth: 6, borderColor: theme.colors.border }} />
              <View style={{
                position: "absolute", width: 200, height: 200,
                borderRadius: 100, borderWidth: 6,
                borderColor: theme.colors.amber,
                opacity: Math.max(0.1, restProgress),
                shadowColor: theme.colors.amber,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.55 * restProgress,
                shadowRadius: 16,
              }} />
              <Text style={{ color: theme.colors.amber, fontSize: 76, fontWeight: "900", lineHeight: 84 }}>
                {restSecondsLeft}
              </Text>
              <Text style={{ color: theme.colors.muted, fontSize: 12, letterSpacing: 1 }}>{t.session_seconds}</Text>
            </View>

            <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 6 }}>{t.session_up_next}</Text>
            <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800", marginBottom: 6, textAlign: "center" }}>
              {restIsForExercise
                ? (exercises[currentExerciseIndex + 1] ? exName(exercises[currentExerciseIndex + 1]) : "You're done!")
                : exName(currentExercise)}
            </Text>
            {!restIsForExercise && (
              <Text style={{ color: theme.colors.textSecondary, fontSize: 15, marginBottom: 36 }}>
                {t.session_set_of(currentSet + 1, totalSets)}
              </Text>
            )}

            <ScalePress
              onPress={skipRest}
              style={{ marginTop: 16 }}
            >
              <View style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                paddingVertical: 12,
                paddingHorizontal: 32,
              }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14, fontWeight: "600" }}>{t.session_skip_rest}</Text>
              </View>
            </ScalePress>
          </View>
        ) : (
          /* ── EXERCISE SCREEN ── */
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Set progress dots */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: theme.spacing.xl }}>
              {Array.from({ length: totalSets }).map((_, i) => (
                <View key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  backgroundColor:
                    i < currentSet - 1 ? theme.colors.amber :
                    i === currentSet - 1 ? theme.colors.amberGlow :
                    theme.colors.border,
                  shadowColor: i < currentSet ? theme.colors.amber : "transparent",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: i < currentSet ? 0.6 : 0,
                  shadowRadius: 4,
                }} />
              ))}
            </View>

            <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              {t.session_set_of(currentSet, totalSets)}
            </Text>

            <Text style={{ color: theme.colors.text, fontSize: 40, fontWeight: "900", letterSpacing: -1, marginBottom: 4, lineHeight: 46 }}>
              {exName(currentExercise)}
            </Text>

            <Text style={{
              color: theme.colors.amberBright,
              fontSize: 26, fontWeight: "800",
              marginBottom: currentPR ? theme.spacing.md : theme.spacing.xl,
              shadowColor: theme.colors.amber,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
            }}>
              {currentExercise.reps}{typeof currentExercise.reps === "number" ? t.session_reps : ""}
            </Text>

            {/* PR Weight Card */}
            {currentPR != null && (
              <View style={{
                backgroundColor: theme.colors.amberSubtle,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.amberDeep,
                padding: 14,
                marginBottom: theme.spacing.xl,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}>
                <Ionicons name="barbell-outline" size={20} color={theme.colors.amber} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.amber, fontSize: 18, fontWeight: "900" }}>
                    {currentPR} kg
                  </Text>
                  <Text style={{ color: theme.colors.amberDim, fontSize: 11, marginTop: 1 }}>
                    {t.session_pr_hint}
                  </Text>
                </View>
              </View>
            )}

            {/* Technique card — smooth expand */}
            <View style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              marginBottom: theme.spacing.lg,
              overflow: "hidden",
            }}>
              <Pressable
                onPress={toggleTechnique}
                style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: theme.spacing.md }}
              >
                <Text style={{ color: theme.colors.amber, fontSize: 11, letterSpacing: 1.5, fontWeight: "700", textTransform: "uppercase" }}>
                  {t.session_technique}
                </Text>
                <Animated.View style={{ transform: [{ rotate: chevronAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }] }}>
                  <Ionicons name="chevron-down" size={16} color={theme.colors.muted} />
                </Animated.View>
              </Pressable>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 22, paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
                {exCue(currentExercise)}
              </Text>
              <Animated.View style={{
                maxHeight: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }),
                overflow: "hidden",
              }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 22, paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
                  {exTechnique(currentExercise)}
                </Text>
              </Animated.View>
            </View>

            {/* SET DONE — breathing glow + press scale */}
            <Animated.View style={{
              shadowColor: theme.colors.amber,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0.65] }),
              shadowRadius: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 24] }),
              elevation: 10,
              borderRadius: theme.radius.lg,
              marginBottom: theme.spacing.xl,
              transform: [{ scale: setDoneScale }],
            }}>
              <Pressable
                onPressIn={pressSetDoneIn}
                onPressOut={pressSetDoneOut}
                onPress={handleSetDone}
                style={{
                  backgroundColor: theme.colors.amber,
                  borderRadius: theme.radius.lg,
                  paddingVertical: 22,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                  <Text style={{ color: "#0D0D0D", fontSize: 18, fontWeight: "900", letterSpacing: 0.5 }}>
                  {isLastSet && isLastExercise ? t.session_finish : t.session_set_done}
                </Text>
              </Pressable>
            </Animated.View>

            {/* Coming Up */}
            {currentExerciseIndex < exercises.length - 1 && (
              <View>
                <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                  {t.session_coming_up}
                </Text>
                <View style={{
                  backgroundColor: theme.colors.card,
                  borderRadius: theme.radius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  overflow: "hidden",
                }}>
                  {exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 4).map((ex, i) => (
                    <View key={ex.id}>
                      {i > 0 && <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />}
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14, opacity: 1 - i * 0.2 }}>
                        <Text style={{ color: theme.colors.amberDim, fontSize: 11, fontWeight: "700", width: 24 }}>
                          {String(currentExerciseIndex + i + 2).padStart(2, "0")}
                        </Text>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 14, fontWeight: "600", flex: 1 }}>
                          {exName(ex)}
                        </Text>
                        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>
                          {ex.sets}×{ex.reps}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
