import { View, Text, ScrollView, Pressable, Modal, Animated, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { ScalePress } from "../../components/ScalePress";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { theme } from "../../constants/theme";
import { useSettings } from "../../constants/SettingsContext";
import { useProgram } from "../../constants/ProgramContext";
import { WEEK_DISPLAY_ORDER } from "../../constants/data";
import type { ExerciseRecord } from "../../constants/ProgramContext";
import { useStaggeredAnimation } from "../../hooks/useStaggeredAnimation";
import { WorkoutCard } from "../../components/program/WorkoutCard";
import { ExerciseEditor } from "../../components/program/ExerciseEditor";

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

  const [renameModal, setRenameModal] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renameRest, setRenameRest] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");

  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const [exerciseModal, setExerciseModal] = useState<{ workoutKey: string; exercise: ExerciseRecord | null } | null>(null);

  const expandAnims = useRef<Record<string, Animated.Value>>({});

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

  const animStyle = useStaggeredAnimation(3, 90);

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

          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.key}
              workout={workout}
              exercises={exercises[workout.key] ?? []}
              isExpanded={expandedWorkout === workout.key}
              expandAnim={getExpandAnim(workout.key)}
              onToggle={() => toggleWorkout(workout.key)}
              onRenamePress={(name, rest) => {
                setRenameName(name);
                setRenameRest(rest);
                setRenameModal(workout.key);
              }}
              onDeletePress={() => setDeleteModal(workout.key)}
              onAddExercise={() => setExerciseModal({ workoutKey: workout.key, exercise: null })}
              onEditExercise={(ex) => setExerciseModal({ workoutKey: workout.key, exercise: ex })}
              onRemoveExercise={(id) => removeExercise(workout.key, id)}
              onReorder={(ids) => reorderExercises(workout.key, ids)}
              getWorkoutDisplayName={getWorkoutDisplayName}
              t={t}
            />
          ))}

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

      {/* Modal - Assigner un programme au jour */}
      <Modal visible={assignModal !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setAssignModal(null)}>
        <Pressable onPress={() => setAssignModal(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%" }}>
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

      {/* Modal - Renommer la séance */}
      <Modal visible={renameModal !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setRenameModal(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)" }}>
        <Pressable onPress={() => setRenameModal(null)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", flex: 1 }}>{t.program_rename}</Text>
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

      {/* Modal - Créer une séance */}
      <Modal visible={showCreateModal} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setShowCreateModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)" }}>
        <Pressable onPress={() => setShowCreateModal(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", flex: 1 }}>{t.program_new_workout}</Text>
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
                  await createWorkout(createName.trim());
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

      {/* Modal - Confirmation suppression */}
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

      {/* Modal - Ajouter / Modifier un exercice */}
      <ExerciseEditor
        visible={exerciseModal !== null}
        exercise={exerciseModal?.exercise ?? null}
        onClose={() => setExerciseModal(null)}
        onSave={async (data) => {
          if (!exerciseModal) return;
          if (exerciseModal.exercise) {
            updateExercise(exerciseModal.workoutKey, exerciseModal.exercise.id, data);
          } else {
            const id = `ex_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
            await addExercise(exerciseModal.workoutKey, { id, ...data });
          }
          setExerciseModal(null);
        }}
        t={t}
      />
    </SafeAreaView>
  );
}
