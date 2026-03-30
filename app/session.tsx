import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  Animated,
  AppState,
  Vibration,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { theme } from "../constants/theme";
import { useSettings } from "../constants/SettingsContext";
import { useProgram } from "../constants/ProgramContext";

// Bouton animé réutilisable
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
  const { t, db } = useSettings();
  const { getTodayWorkout, getWorkoutDisplayName, schedule, loaded } = useProgram();
  const workout = getTodayWorkout();
  const goHome = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };
  const exName = (ex: any) => ex.name_fr || ex.name;
  const exCue = (ex: any) => ex.cue_fr || ex.cue;
  const exTechnique = (ex: any) => ex.technique_fr || ex.technique;
  const todayKey = schedule[new Date().getDay()];
  const workoutName = todayKey ? getWorkoutDisplayName(todayKey) : "";

  const [sessionExercises, setSessionExercises] = useState<any[]>(workout?.exercises ?? []);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [setProgress, setSetProgress] = useState<Record<string, number>>({});
  const [currentExerciseId, setCurrentExerciseId] = useState<string>(workout?.exercises?.[0]?.id ?? "");

  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(90);
  const [timerDone, setTimerDone] = useState(false);
  const [expandedCue, setExpandedCue] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const chevronAnim = useRef(new Animated.Value(0)).current;
  const [sessionDone, setSessionDone] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [prMap, setPrMap] = useState<Record<string, number>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const doneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restEndTimeRef = useRef<number>(0);
  const timerFiredRef = useRef(false);
  const restTypeRef = useRef<"set" | "exercise">("set");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const setDoneScale = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(1)).current;

  const exercises = sessionExercises;
  const currentExerciseIndex = exercises.findIndex((e: any) => e.id === currentExerciseId);
  const currentExercise = exercises[currentExerciseIndex];
  const totalSets = typeof currentExercise?.sets === "number" ? currentExercise.sets : 3;
  const currentSet = (setProgress[currentExerciseId] ?? 0) + 1;
  const completedCount = completedIds.size;

  const remainingExercises = exercises.filter(
    (e: any) => e.id !== currentExerciseId && !completedIds.has(e.id)
  );

  const isLastSet = currentSet === totalSets;
  const isLastExercise = completedCount === exercises.length - 1 && !completedIds.has(currentExerciseId);

  // Remettre un exercice non terminé à une autre position
  const moveSessionExercise = (absIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? absIndex - 1 : absIndex + 1;
    if (toIndex < 0 || toIndex >= exercises.length) return;
    if (completedIds.has(exercises[absIndex]?.id) || completedIds.has(exercises[toIndex]?.id)) return;
    setSessionExercises((prev: any[]) => {
      const next = [...prev];
      [next[absIndex], next[toIndex]] = [next[toIndex], next[absIndex]];
      return next;
    });
  };

  // Bloquer le bouton retour Android
  useEffect(() => {
    const handler = () => {
      if (!sessionDone) setShowExitModal(true);
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => sub.remove();
  }, [sessionDone]);

  // Charger les poids depuis la DB
  useEffect(() => {
    if (!db) return;
    async function loadWeights() {
      const rows = await db!.getAllAsync<{ exercise_id: string; weight: number }>(
        "SELECT exercise_id, weight FROM pr_entries"
      );
      const map: Record<string, number> = {};
      rows.forEach((r) => { map[r.exercise_id] = r.weight; });
      setPrMap(map);
    }
    loadWeights();
  }, [db]);

  // Enregistrer la séance terminée en DB
  useEffect(() => {
    if (sessionDone && db) {
      const today = new Date().toISOString().slice(0, 10);
      db.runAsync(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?, '1')",
        [`session_done_${today}`]
      ).catch(() => {});
    }
  }, [sessionDone, db]);

  // Animation entrée
  const animateIn = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 100, friction: 10 }),
    ]).start();
  };

  useEffect(() => { animateIn(); }, []);

  // Synchroniser avec ProgramContext une fois chargé
  useEffect(() => {
    if (loaded && workout?.exercises?.length && sessionExercises.length === 0) {
      setSessionExercises(workout.exercises);
      setCurrentExerciseId(workout.exercises[0].id);
    }
  }, [loaded]);

  // Lueur respiratoire sur SÉRIE TERMINÉE
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

  // Flash quand le timer est terminé
  useEffect(() => {
    if (!timerDone) {
      flashAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.15, duration: 300, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [timerDone]);

  const findNextExerciseId = (afterId: string): string | null => {
    const idx = exercises.findIndex((e: any) => e.id === afterId);
    for (let i = idx + 1; i < exercises.length; i++) {
      if (!completedIds.has(exercises[i].id)) return exercises[i].id;
    }
    for (let i = 0; i < idx; i++) {
      if (!completedIds.has(exercises[i].id)) return exercises[i].id;
    }
    return null;
  };

  const advanceAfterRest = () => {
    if (restTypeRef.current === "exercise") {
      const nextId = findNextExerciseId(currentExerciseId);
      if (nextId) {
        setCurrentExerciseId(nextId);
        setExpandedCue(false);
        expandAnim.setValue(0);
        chevronAnim.setValue(0);
      }
    }
  };

  // Timer sécurisé en arrière-plan (basé sur timestamp)
  useEffect(() => {
    if (!isResting) {
      setTimerDone(false);
      return;
    }

    const restDuration = workout?.restSeconds ?? 90;
    const endTime = Date.now() + restDuration * 1000;
    restEndTimeRef.current = endTime;
    timerFiredRef.current = false;
    setRestSecondsLeft(restDuration);
    setTimerDone(false);

    const handleTimerDone = () => {
      if (timerFiredRef.current) return;
      timerFiredRef.current = true;
      setRestSecondsLeft(0);
      setTimerDone(true);
      Vibration.vibrate([0, 500, 200, 500]);

      doneTimeoutRef.current = setTimeout(() => {
        advanceAfterRest();
        setIsResting(false);
        setTimerDone(false);
        animateIn();
      }, 3000);
    };

    const updateTimer = () => {
      if (timerFiredRef.current) return;
      const remaining = Math.max(0, Math.ceil((restEndTimeRef.current - Date.now()) / 1000));
      if (remaining <= 0) {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        handleTimerDone();
        return;
      }
      setRestSecondsLeft(remaining);
    };

    timerRef.current = setInterval(updateTimer, 500);

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") updateTimer();
    });

    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (doneTimeoutRef.current) { clearTimeout(doneTimeoutRef.current); doneTimeoutRef.current = null; }
      subscription.remove();
    };
  }, [isResting]);

  const handleSetDone = () => {
    if (isLastSet && isLastExercise) {
      setCompletedIds((prev) => new Set([...prev, currentExerciseId]));
      setSessionDone(true);
      return;
    }

    if (isLastSet) {
      setCompletedIds((prev) => new Set([...prev, currentExerciseId]));
      restTypeRef.current = "exercise";
    } else {
      setSetProgress((prev) => ({ ...prev, [currentExerciseId]: (prev[currentExerciseId] ?? 0) + 1 }));
      restTypeRef.current = "set";
    }
    setIsResting(true);
  };

  const skipRest = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (doneTimeoutRef.current) { clearTimeout(doneTimeoutRef.current); doneTimeoutRef.current = null; }
    timerFiredRef.current = true;
    setTimerDone(false);
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

  const restDuration = workout?.restSeconds ?? 90;

  // ── MODAL QUITTER ──
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
            {completedCount > 0
              ? t.session_exercises_done(completedCount, exercises.length)
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
              onPress={() => { setShowExitModal(false); goHome(); }}
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
          onPress={goHome}
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
          <ScalePress onPress={goHome}>
            <View style={{ backgroundColor: theme.colors.amber, borderRadius: theme.radius.md, paddingVertical: 16, paddingHorizontal: 56 }}>
              <Text style={{ color: "#0D0D0D", fontSize: 16, fontWeight: "900", letterSpacing: 1 }}>{t.session_done}</Text>
            </View>
          </ScalePress>
        </View>
      </SafeAreaView>
    );
  }

  if (workout && !currentExercise) return null;

  const restProgress = restSecondsLeft / restDuration;
  const restIsForExercise = restTypeRef.current === "exercise";
  const currentPR = prMap[currentExercise?.id ?? ""];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {ExitModal}

      {/* En-tête */}
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
          {completedCount} / {exercises.length}
        </Text>
      </View>

      {/* Barre de progression */}
      <View style={{ height: 2, backgroundColor: theme.colors.border, marginHorizontal: theme.spacing.lg, borderRadius: 1 }}>
        <View style={{
          height: 2,
          backgroundColor: theme.colors.amber,
          borderRadius: 1,
          width: `${(completedCount / exercises.length) * 100}%`,
        }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {isResting ? (
          /* ── ÉCRAN REPOS ── */
          <View style={{ alignItems: "center", paddingTop: 24 }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
              {timerDone ? t.session_times_up : t.session_rest}
            </Text>

            {/* Anneau timer */}
            <Animated.View style={{ width: 200, height: 200, alignItems: "center", justifyContent: "center", marginBottom: 36, opacity: flashAnim }}>
              <View style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, borderWidth: 6, borderColor: theme.colors.border }} />
              <View style={{
                position: "absolute", width: 200, height: 200,
                borderRadius: 100, borderWidth: 6,
                borderColor: timerDone ? theme.colors.amber : theme.colors.amber,
                opacity: timerDone ? 1 : Math.max(0.1, restProgress),
                shadowColor: theme.colors.amber,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: timerDone ? 0.8 : 0.55 * restProgress,
                shadowRadius: timerDone ? 24 : 16,
              }} />
              <Text style={{ color: timerDone ? theme.colors.amber : theme.colors.amber, fontSize: 76, fontWeight: "900", lineHeight: 84 }}>
                {restSecondsLeft}
              </Text>
              <Text style={{ color: theme.colors.muted, fontSize: 12, letterSpacing: 1 }}>{t.session_seconds}</Text>
            </Animated.View>

            <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 6 }}>{t.session_up_next}</Text>
            <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800", marginBottom: 6, textAlign: "center" }}>
              {restIsForExercise
                ? (() => {
                    const nextId = findNextExerciseId(currentExerciseId);
                    const nextEx = nextId ? exercises.find((e: any) => e.id === nextId) : null;
                    return nextEx ? exName(nextEx) : t.session_done;
                  })()
                : exName(currentExercise)}
            </Text>
            {!restIsForExercise && (
              <Text style={{ color: theme.colors.textSecondary, fontSize: 15, marginBottom: 36 }}>
                {t.session_set_of(currentSet, totalSets)}
              </Text>
            )}

            <ScalePress onPress={skipRest} style={{ marginTop: 16 }}>
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
          /* ── ÉCRAN EXERCICE ── */
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Points de progression séries */}
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
              color: theme.colors.amber,
              fontSize: 26, fontWeight: "800",
              marginBottom: currentPR ? theme.spacing.md : theme.spacing.xl,
              shadowColor: theme.colors.amber,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
            }}>
              {currentExercise.reps}{typeof currentExercise.reps === "number" ? t.session_reps : ""}
            </Text>

            {/* Carte poids */}
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
                    {t.session_weight_hint}
                  </Text>
                </View>
              </View>
            )}

            {/* Carte technique — masquée si ni conseil ni technique */}
            {(exCue(currentExercise) || exTechnique(currentExercise)) ? (
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
                {exCue(currentExercise) ? (
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 22, paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
                    {exCue(currentExercise)}
                  </Text>
                ) : null}
                {exTechnique(currentExercise) ? (
                  <Animated.View style={{
                    maxHeight: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }),
                    overflow: "hidden",
                  }}>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 22, paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.md }}>
                      {exTechnique(currentExercise)}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
            ) : null}

            {/* SÉRIE TERMINÉE — lueur + scale */}
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

            {/* À Suivre — exercices restants avec réorganisation */}
            {remainingExercises.length > 0 && (
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
                  {remainingExercises.map((ex: any, i: number) => {
                    const absIndex = exercises.findIndex((e: any) => e.id === ex.id);
                    const canMoveUp = absIndex > 0 && !completedIds.has(exercises[absIndex - 1]?.id);
                    const canMoveDown = absIndex < exercises.length - 1 && !completedIds.has(exercises[absIndex + 1]?.id);
                    return (
                      <View key={ex.id}>
                        {i > 0 && <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingLeft: 14, paddingRight: 8 }}>
                          <Text style={{ color: theme.colors.amberDim, fontSize: 11, fontWeight: "700", width: 24 }}>
                            {String(absIndex + 1).padStart(2, "0")}
                          </Text>
                          <Pressable
                            onPress={() => {
                              setSessionExercises((prev: any[]) => {
                                const next = [...prev];
                                const curIdx = next.findIndex((e: any) => e.id === currentExerciseId);
                                const tgtIdx = next.findIndex((e: any) => e.id === ex.id);
                                if (curIdx >= 0 && tgtIdx >= 0) {
                                  [next[curIdx], next[tgtIdx]] = [next[tgtIdx], next[curIdx]];
                                }
                                return next;
                              });
                              setCurrentExerciseId(ex.id);
                              setExpandedCue(false);
                              expandAnim.setValue(0);
                              chevronAnim.setValue(0);
                              animateIn();
                            }}
                            style={{ flex: 1 }}
                          >
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 14, fontWeight: "600" }}>
                              {exName(ex)}
                            </Text>
                          </Pressable>
                          <Text style={{ color: theme.colors.muted, fontSize: 11, marginRight: 4 }}>
                            {ex.sets}×{ex.reps}
                          </Text>
                          <Pressable onPress={() => moveSessionExercise(absIndex, "up")} hitSlop={6} style={{ opacity: canMoveUp ? 1 : 0.2, padding: 4 }} disabled={!canMoveUp}>
                            <Ionicons name="chevron-up" size={16} color={theme.colors.amber} />
                          </Pressable>
                          <Pressable onPress={() => moveSessionExercise(absIndex, "down")} hitSlop={6} style={{ opacity: canMoveDown ? 1 : 0.2, padding: 4 }} disabled={!canMoveDown}>
                            <Ionicons name="chevron-down" size={16} color={theme.colors.amber} />
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
