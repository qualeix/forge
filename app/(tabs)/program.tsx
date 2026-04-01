import { View, Text, ScrollView, Pressable, Modal, Animated, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SortableList } from "../../components/SortableList";
import { ScalePress } from "../../components/ScalePress";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { theme } from "../../constants/theme";
import { useSettings } from "../../constants/SettingsContext";
import { useProgram } from "../../constants/ProgramContext";
import { WEEK_DISPLAY_ORDER } from "../../constants/data";
import type { ExerciseRecord } from "../../constants/ProgramContext";

export default function ProgramScreen() {
  const { t } = useSettings();
  const {
    schedule, workouts, exercises,
    setDayWorkout, getWorkoutDisplayName,
    createWorkout, deleteWorkout, updateWorkout,
    addExercise, removeExercise, updateExercise, reorderExercises,
  } = useProgram();

  const [assignModal, setAssignModal] = useState<number | null>(null);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  // Modal renommage
  const [renameModal, setRenameModal] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renameRest, setRenameRest] = useState("");

  // Modal création séance
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");

  // Modal suppression
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  // Modal ajout/édition exercice
  const [exerciseModal, setExerciseModal] = useState<{ workoutKey: string; exercise: ExerciseRecord | null } | null>(null);
  const [exName, setExNameInput] = useState("");
  const [exSets, setExSets] = useState("3");
  const [exReps, setExReps] = useState("10");
  const [exCue, setExCue] = useState("");
  const [exTechnique, setExTechnique] = useState("");

  const expandAnims = useRef<Record<string, Animated.Value>>({});

  const getExName = (ex: any) => ex.name_fr || ex.name;

  const getExpandAnim = (key: string) => {
    if (!expandAnims.current[key]) expandAnims.current[key] = new Animated.Value(0);
    return expandAnims.current[key];
  };

  const toggleWorkout = (key: string) => {
    const opening = expandedWorkout !== key;
    if (expandedWorkout) {
      Animated.timing(getExpandAnim(expandedWorkout), { toValue: 0, duration: 250, useNativeDriver: false }).start();
    }
    if (opening) {
      Animated.timing(getExpandAnim(key), { toValue: 1, duration: 280, useNativeDriver: false }).start();
    }
    setExpandedWorkout(opening ? key : null);
  };


  // Animations d'entrée décalées
  const anims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(90,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true }))
    ).start();
  }, []);
  const animStyle = (i: number) => ({
    opacity: anims[Math.min(i, anims.length - 1)],
    transform: [{ translateY: anims[Math.min(i, anims.length - 1)].interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  });

  const gymDays = WEEK_DISPLAY_ORDER.filter((d) => schedule[d] !== null).length;

  const openExerciseModal = (workoutKey: string, ex: ExerciseRecord | null) => {
    if (ex) {
      setExNameInput(ex.name_fr || ex.name);
      setExSets(String(ex.sets));
      setExReps(ex.reps);
      setExCue(ex.cue_fr || ex.cue);
      setExTechnique(ex.technique_fr || ex.technique);
    } else {
      setExNameInput("");
      setExSets("3");
      setExReps("10");
      setExCue("");
      setExTechnique("");
    }
    setExerciseModal({ workoutKey, exercise: ex });
  };

  const saveExercise = async () => {
    if (!exerciseModal || !exName.trim()) return;
    const { workoutKey, exercise } = exerciseModal;
    const name = exName.trim();
    const cue = exCue.trim();
    const technique = exTechnique.trim();
    if (exercise) {
      updateExercise(workoutKey, exercise.id, {
        name,
        name_fr: name,
        sets: parseInt(exSets) || 3,
        reps: exReps.trim() || "10",
        cue,
        cue_fr: cue,
        technique,
        technique_fr: technique,
      });
    } else {
      const id = `ex_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
      await addExercise(workoutKey, {
        id,
        name,
        name_fr: name,
        sets: parseInt(exSets) || 3,
        reps: exReps.trim() || "10",
        cue,
        cue_fr: cue,
        technique,
        technique_fr: technique,
      });
    }
    setExerciseModal(null);
  };

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
          <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            {t.tab_program}
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800", letterSpacing: -0.5 }}>
            Programme
          </Text>
        </Animated.View>

        {/* Planning Semaine */}
        <Animated.View style={[{ marginBottom: theme.spacing.xl }, animStyle(1)]}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            {t.program_week}
          </Text>
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.xl,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: "hidden",
          }}>
            {WEEK_DISPLAY_ORDER.map((dayIndex, i) => {
              const workoutKey = schedule[dayIndex];
              const isToday = new Date().getDay() === dayIndex;
              return (
                <View key={dayIndex}>
                  {i > 0 && <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: 16 }} />}
                  <ScalePress
                    onPress={() => setAssignModal(dayIndex)}
                    style={{
                      flexDirection: "row", alignItems: "center", padding: 16, gap: 12,
                      backgroundColor: isToday ? theme.colors.amberSubtle : "transparent",
                    }}
                  >
                    <View style={{ width: 36, alignItems: "center" }}>
                      <Text style={{
                        color: isToday ? theme.colors.amber : theme.colors.text,
                        fontSize: 13, fontWeight: "800", letterSpacing: 0.5,
                      }}>
                        {t.days[dayIndex].slice(0, 3).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      {workoutKey ? (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <Ionicons name="flash" size={14} color={theme.colors.amber} />
                          <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: "600" }}>
                            {getWorkoutDisplayName(workoutKey)}
                          </Text>
                        </View>
                      ) : (
                        <Text style={{ color: theme.colors.muted, fontSize: 14 }}>{t.program_rest}</Text>
                      )}
                    </View>
                    {isToday && (
                      <View style={{ backgroundColor: theme.colors.amberDeep, paddingHorizontal: 8, paddingVertical: 2, borderRadius: theme.radius.full }}>
                        <Text style={{ color: theme.colors.amber, fontSize: 9, fontWeight: "800", letterSpacing: 1 }}>{t.today_badge}</Text>
                      </View>
                    )}
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.muted} />
                  </ScalePress>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Section Séances */}
        <Animated.View style={animStyle(2)}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
            {t.program_workouts}
          </Text>

          {workouts.map((workout) => {
            const workoutKey = workout.key;
            const exs = exercises[workoutKey] ?? [];
            const isExpanded = expandedWorkout === workoutKey;
            const expandAnim = getExpandAnim(workoutKey);
            const maxH = Math.max(exs.length * 56 + 120, 200);

            return (
              <View key={workoutKey} style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: isExpanded ? theme.colors.amberDim : theme.colors.border,
                marginBottom: theme.spacing.md,
                overflow: "hidden",
              }}>
                {/* En-tête séance */}
                <Pressable
                  onPress={() => toggleWorkout(workoutKey)}
                  style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 12 }}
                >
                  <View style={{
                    backgroundColor: theme.colors.amberSubtle,
                    borderRadius: theme.radius.sm,
                    padding: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.amberDeep,
                  }}>
                    <Ionicons name="barbell-outline" size={18} color={theme.colors.amber} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "700" }}>
                      {getWorkoutDisplayName(workoutKey)}
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                      {exs.length > 0 ? t.program_exercises(exs.length) : t.program_no_exercises}
                    </Text>
                  </View>
                  {/* Renommer */}
                  <ScalePress
                    onPress={(e) => {
                      e.stopPropagation();
                      setRenameName(workout.name_fr || workout.name);
                      setRenameRest(String(workout.restSeconds));
                      setRenameModal(workoutKey);
                    }}
                    hitSlop={8}
                    style={{ padding: 4, marginRight: 4 }}
                  >
                    <Ionicons name="create-outline" size={16} color={theme.colors.amber} />
                  </ScalePress>
                  {/* Supprimer */}
                  <ScalePress
                    onPress={(e) => {
                      e.stopPropagation();
                      setDeleteModal(workoutKey);
                    }}
                    hitSlop={8}
                    style={{ padding: 4, marginRight: 4 }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </ScalePress>
                  <Animated.View style={{
                    transform: [{ rotate: expandAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }],
                  }}>
                    <Ionicons name="chevron-down" size={18} color={isExpanded ? theme.colors.amber : theme.colors.muted} />
                  </Animated.View>
                </Pressable>

                {/* Liste d'exercices extensible */}
                <Animated.View style={{
                  maxHeight: expandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, maxH] }),
                  overflow: "hidden",
                }}>
                  <View style={{ height: 1, backgroundColor: theme.colors.border }} />

                  {exs.length === 0 && (
                    <View style={{ padding: 16, alignItems: "center" }}>
                      <Text style={{ color: theme.colors.muted, fontSize: 13 }}>{t.program_no_exercises}</Text>
                    </View>
                  )}

                  <SortableList
                    data={exs}
                    onReorder={(ids) => reorderExercises(workoutKey, ids)}
                    renderRow={(ex, handle) => (
                      <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, gap: 8 }}>
                        {handle}
                        <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "600", flex: 1 }}>
                          {getExName(ex)}
                        </Text>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: "600", marginRight: 4 }}>
                          {ex.sets}×{ex.reps}
                        </Text>
                        <ScalePress onPress={() => openExerciseModal(workoutKey, ex)} hitSlop={8} style={{ padding: 2 }}>
                          <Ionicons name="create-outline" size={16} color={theme.colors.amber} />
                        </ScalePress>
                        <ScalePress onPress={() => removeExercise(workoutKey, ex.id)} hitSlop={8} style={{ padding: 2 }}>
                          <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                        </ScalePress>
                      </View>
                    )}
                  />

                  {/* Bouton ajouter exercice */}
                  <ScalePress
                    onPress={() => openExerciseModal(workoutKey, null)}
                    style={{
                      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
                      paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.colors.border,
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={16} color={theme.colors.amber} />
                    <Text style={{ color: theme.colors.amber, fontSize: 12, fontWeight: "700" }}>
                      {t.program_add_exercise}
                    </Text>
                  </ScalePress>
                </Animated.View>
              </View>
            );
          })}

          {/* Bouton nouvelle séance */}
          <ScalePress
            onPress={() => { setCreateName(""); setShowCreateModal(true); }}
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderStyle: "dashed",
              paddingVertical: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Ionicons name="add" size={20} color={theme.colors.amber} />
            <Text style={{ color: theme.colors.amber, fontSize: 14, fontWeight: "700" }}>
              {t.program_new_workout}
            </Text>
          </ScalePress>
        </Animated.View>
      </ScrollView>

      {/* Modal — Assigner un programme au jour */}
      <Modal visible={assignModal !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setAssignModal(null)}>
        <Pressable onPress={() => setAssignModal(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%" }}>
            {/* En-tête avec croix */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900" }}>
                  {assignModal !== null ? t.days[assignModal] : ""}
                </Text>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginTop: 4, marginBottom: 20 }}>
                  {t.program_assign_title}
                </Text>
              </View>
              <ScalePress onPress={() => setAssignModal(null)} hitSlop={8} style={{ padding: 4 }}>
                <Ionicons name="close" size={26} color={theme.colors.amber} />
              </ScalePress>
            </View>
            <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
              <View style={{ gap: 8 }}>
                {workouts.map((w) => {
                  const isSelected = assignModal !== null && schedule[assignModal] === w.key;
                  return (
                    <ScalePress
                      key={w.key}
                      onPress={() => { if (assignModal !== null) setDayWorkout(assignModal, w.key); setAssignModal(null); }}
                      style={{
                        flexDirection: "row", alignItems: "center",
                        backgroundColor: isSelected ? theme.colors.amberSubtle : theme.colors.cardElevated,
                        borderWidth: 1, borderColor: isSelected ? theme.colors.amberDim : theme.colors.border,
                        borderRadius: theme.radius.md, padding: 14, gap: 12,
                      }}
                    >
                      <Ionicons name="flash" size={16} color={isSelected ? theme.colors.amber : theme.colors.muted} />
                      <Text style={{ color: isSelected ? theme.colors.amber : theme.colors.text, fontSize: 15, fontWeight: "700", flex: 1 }}>
                        {getWorkoutDisplayName(w.key)}
                      </Text>
                      {isSelected && <Ionicons name="checkmark-circle" size={18} color={theme.colors.amber} />}
                    </ScalePress>
                  );
                })}
                {/* Option repos */}
                <ScalePress
                  onPress={() => { if (assignModal !== null) setDayWorkout(assignModal, null); setAssignModal(null); }}
                  style={{
                    flexDirection: "row", alignItems: "center",
                    backgroundColor: assignModal !== null && schedule[assignModal] === null ? theme.colors.amberSubtle : theme.colors.cardElevated,
                    borderWidth: 1, borderColor: assignModal !== null && schedule[assignModal] === null ? theme.colors.amberDim : theme.colors.border,
                    borderRadius: theme.radius.md, padding: 14, gap: 12, marginTop: 4,
                  }}
                >
                  <Ionicons name="moon-outline" size={16} color={assignModal !== null && schedule[assignModal] === null ? theme.colors.amber : theme.colors.muted} />
                  <Text style={{ color: assignModal !== null && schedule[assignModal] === null ? theme.colors.amber : theme.colors.text, fontSize: 15, fontWeight: "700", flex: 1 }}>
                    {t.program_set_rest}
                  </Text>
                  {assignModal !== null && schedule[assignModal] === null && <Ionicons name="checkmark-circle" size={18} color={theme.colors.amber} />}
                </ScalePress>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal — Renommer la séance */}
      <Modal visible={renameModal !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setRenameModal(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)" }}>
        <Pressable onPress={() => setRenameModal(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", flex: 1 }}>
                {t.program_rename}
              </Text>
              <ScalePress onPress={() => setRenameModal(null)} hitSlop={8} style={{ padding: 4 }}>
                <Ionicons name="close" size={26} color={theme.colors.amber} />
              </ScalePress>
            </View>
            <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
              {t.program_name_placeholder}
            </Text>
            <TextInput
              value={renameName}
              onChangeText={setRenameName}
              placeholder={t.program_name_placeholder}
              placeholderTextColor={theme.colors.muted}
              autoFocus
              style={{
                backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.amberDim,
                paddingHorizontal: 16, paddingVertical: 12, color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 12,
              }}
            />
            <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
              {t.program_rest_seconds}
            </Text>
            <TextInput
              value={renameRest}
              onChangeText={setRenameRest}
              keyboardType="number-pad"
              placeholderTextColor={theme.colors.muted}
              style={{
                backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
                paddingHorizontal: 16, paddingVertical: 12, color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 16,
              }}
            />
            <ScalePress
              onPress={() => {
                if (renameModal && renameName.trim()) {
                  updateWorkout(renameModal, {
                    name: renameName.trim(),
                    name_fr: renameName.trim(),
                    restSeconds: parseInt(renameRest) || 90,
                  });
                }
                setRenameModal(null);
              }}
              style={{ backgroundColor: theme.colors.amber, borderRadius: theme.radius.md, paddingVertical: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#0D0D0D", fontWeight: "900", fontSize: 15 }}>{t.program_rename_save}</Text>
            </ScalePress>
          </Pressable>
        </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal — Créer une séance */}
      <Modal visible={showCreateModal} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setShowCreateModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)" }}>
        <Pressable onPress={() => setShowCreateModal(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", flex: 1 }}>
                {t.program_new_workout}
              </Text>
              <ScalePress onPress={() => setShowCreateModal(false)} hitSlop={8} style={{ padding: 4 }}>
                <Ionicons name="close" size={26} color={theme.colors.amber} />
              </ScalePress>
            </View>
            <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
              {t.program_name_placeholder}
            </Text>
            <TextInput
              value={createName}
              onChangeText={setCreateName}
              placeholder={t.program_name_placeholder}
              placeholderTextColor={theme.colors.muted}
              autoFocus
              style={{
                backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.amberDim,
                paddingHorizontal: 16, paddingVertical: 12, color: theme.colors.text, fontSize: 16, fontWeight: "700", marginBottom: 16,
              }}
            />
            <ScalePress
              onPress={async () => {
                if (createName.trim()) {
                  await createWorkout(createName.trim(), createName.trim());
                  setShowCreateModal(false);
                }
              }}
              style={{ backgroundColor: theme.colors.amber, borderRadius: theme.radius.md, paddingVertical: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#0D0D0D", fontWeight: "900", fontSize: 15 }}>{t.program_create}</Text>
            </ScalePress>
          </Pressable>
        </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal — Confirmation suppression */}
      <Modal visible={deleteModal !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setDeleteModal(null)}>
        <Pressable onPress={() => setDeleteModal(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%" }}>
            <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", marginBottom: 8 }}>
              {t.program_delete_title}
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 24 }}>
              {deleteModal ? getWorkoutDisplayName(deleteModal) : ""}{"\n\n"}{t.program_delete_confirm}
            </Text>
            <View style={{ gap: 10 }}>
              <ScalePress
                onPress={async () => {
                  if (deleteModal) await deleteWorkout(deleteModal);
                  if (expandedWorkout === deleteModal) setExpandedWorkout(null);
                  setDeleteModal(null);
                }}
                style={{ backgroundColor: "#7F1D1D", borderRadius: theme.radius.md, paddingVertical: 14, alignItems: "center" }}
              >
                <Text style={{ color: "#FCA5A5", fontWeight: "900", fontSize: 15 }}>{t.program_delete}</Text>
              </ScalePress>
              <ScalePress
                onPress={() => setDeleteModal(null)}
                style={{ backgroundColor: theme.colors.cardElevated, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, paddingVertical: 14, alignItems: "center" }}
              >
                <Text style={{ color: theme.colors.textSecondary, fontWeight: "600", fontSize: 14 }}>{t.program_cancel}</Text>
              </ScalePress>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal — Ajouter / Modifier un exercice */}
      <Modal visible={exerciseModal !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setExerciseModal(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)" }}>
        <Pressable onPress={() => setExerciseModal(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%", maxHeight: "85%" }}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingRight: 2 }} keyboardDismissMode="on-drag">
              {/* En-tête avec croix */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", flex: 1 }}>
                  {exerciseModal?.exercise ? t.program_edit_exercise : t.program_add_exercise}
                </Text>
                <ScalePress onPress={() => setExerciseModal(null)} hitSlop={8} style={{ padding: 4 }}>
                  <Ionicons name="close" size={26} color={theme.colors.amber} />
                </ScalePress>
              </View>

              <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.program_exercise_name}</Text>
              <TextInput
                value={exName}
                onChangeText={setExNameInput}
                placeholder={t.program_exercise_name}
                placeholderTextColor={theme.colors.muted}
                autoFocus={!exerciseModal?.exercise}
                style={{
                  backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.amberDim,
                  paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 15, fontWeight: "700", marginBottom: 10,
                }}
              />

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.program_sets}</Text>
                  <TextInput
                    value={exSets}
                    onChangeText={setExSets}
                    keyboardType="number-pad"
                    placeholderTextColor={theme.colors.muted}
                    style={{
                      backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
                      paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 15, fontWeight: "700", textAlign: "center",
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.program_reps}</Text>
                  <TextInput
                    value={exReps}
                    onChangeText={setExReps}
                    placeholderTextColor={theme.colors.muted}
                    style={{
                      backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
                      paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 15, fontWeight: "700", textAlign: "center",
                    }}
                  />
                </View>
              </View>

              <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.program_cue}</Text>
              <TextInput
                value={exCue}
                onChangeText={setExCue}
                placeholder={t.program_cue}
                placeholderTextColor={theme.colors.muted}
                multiline
                style={{
                  backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
                  paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 14, marginBottom: 10, minHeight: 48,
                }}
              />

              <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.program_technique_label}</Text>
              <TextInput
                value={exTechnique}
                onChangeText={setExTechnique}
                placeholder={t.program_technique_label}
                placeholderTextColor={theme.colors.muted}
                multiline
                style={{
                  backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
                  paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 14, marginBottom: 16, minHeight: 64,
                }}
              />

              <ScalePress
                onPress={saveExercise}
                style={{ backgroundColor: theme.colors.amber, borderRadius: theme.radius.md, paddingVertical: 14, alignItems: "center" }}
              >
                <Text style={{ color: "#0D0D0D", fontWeight: "900", fontSize: 15 }}>
                  {exerciseModal?.exercise ? t.program_save : t.program_add}
                </Text>
              </ScalePress>
            </ScrollView>
          </Pressable>
        </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
