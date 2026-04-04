import { Modal, View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { ScalePress } from "../ScalePress";
import { theme } from "../../constants/theme";
import type { ExerciseRecord } from "../../constants/ProgramContext";
import type { AppStrings } from "../../constants/strings";

type ExerciseSaveData = {
  name: string;
  sets: number;
  reps: string;
  cue: string;
  technique: string;
};

type ExerciseEditorProps = {
  visible: boolean;
  exercise: ExerciseRecord | null;
  onClose: () => void;
  onSave: (data: ExerciseSaveData) => Promise<void>;
  t: AppStrings;
};

export function ExerciseEditor({ visible, exercise, onClose, onSave, t }: ExerciseEditorProps) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [cue, setCue] = useState("");
  const [technique, setTechnique] = useState("");

  useEffect(() => {
    if (!visible) return;
    if (exercise) {
      setName(exercise.name);
      setSets(String(exercise.sets));
      setReps(exercise.reps);
      setCue(exercise.cue);
      setTechnique(exercise.technique);
    } else {
      setName("");
      setSets("3");
      setReps("10");
      setCue("");
      setTechnique("");
    }
  }, [visible]);

  const handleSave = async () => {
    if (!name.trim()) return;
    await onSave({
      name: name.trim(),
      sets: parseInt(sets) || 3,
      reps: reps.trim() || "10",
      cue: cue.trim(),
      technique: technique.trim(),
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)" }}>
        <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: theme.spacing.lg }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: theme.colors.card, borderRadius: theme.radius.xl, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.xl, width: "100%", maxHeight: "85%" }}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingRight: 2 }} keyboardDismissMode="on-drag">

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "900", flex: 1 }}>
                  {exercise ? t.program_edit_exercise : t.program_add_exercise}
                </Text>
                <ScalePress onPress={onClose} hitSlop={8} style={{ padding: 4 }}>
                  <Ionicons name="close" size={26} color={theme.colors.amber} />
                </ScalePress>
              </View>

              <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.program_exercise_name}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t.program_exercise_name}
                placeholderTextColor={theme.colors.muted}
                autoFocus={!exercise}
                style={{
                  backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.amberDim,
                  paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 15, fontWeight: "700", marginBottom: 10,
                }}
              />

              <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.colors.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.program_sets}</Text>
                  <TextInput
                    value={sets}
                    onChangeText={setSets}
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
                    value={reps}
                    onChangeText={setReps}
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
                value={cue}
                onChangeText={setCue}
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
                value={technique}
                onChangeText={setTechnique}
                placeholder={t.program_technique_label}
                placeholderTextColor={theme.colors.muted}
                multiline
                style={{
                  backgroundColor: theme.colors.cardElevated, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border,
                  paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 14, marginBottom: 16, minHeight: 64,
                }}
              />

              <ScalePress
                onPress={handleSave}
                style={{ backgroundColor: theme.colors.amber, borderRadius: theme.radius.md, paddingVertical: 14, alignItems: "center" }}
              >
                <Text style={{ color: "#0D0D0D", fontWeight: "900", fontSize: 15 }}>
                  {exercise ? t.program_save : t.program_add}
                </Text>
              </ScalePress>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
