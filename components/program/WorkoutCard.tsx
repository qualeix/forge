import { View, Text, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SortableList } from "../SortableList";
import { ScalePress } from "../ScalePress";
import { theme } from "../../constants/theme";
import type { WorkoutRecord, ExerciseRecord } from "../../constants/ProgramContext";
import type { AppStrings } from "../../constants/strings";

type WorkoutCardProps = {
  workout: WorkoutRecord;
  exercises: ExerciseRecord[];
  isExpanded: boolean;
  expandAnim: Animated.Value;
  onToggle: () => void;
  onRenamePress: (name: string, rest: string) => void;
  onDeletePress: () => void;
  onAddExercise: () => void;
  onEditExercise: (ex: ExerciseRecord) => void;
  onRemoveExercise: (id: string) => void;
  onReorder: (ids: string[]) => void;
  getWorkoutDisplayName: (key: string) => string;
  t: AppStrings;
};

export function WorkoutCard({
  workout,
  exercises,
  isExpanded,
  expandAnim,
  onToggle,
  onRenamePress,
  onDeletePress,
  onAddExercise,
  onEditExercise,
  onRemoveExercise,
  onReorder,
  getWorkoutDisplayName,
  t,
}: WorkoutCardProps) {
  const maxH = Math.max(exercises.length * 56 + 120, 200);

  return (
    <View style={{
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: isExpanded ? theme.colors.amberDim : theme.colors.border,
      marginBottom: theme.spacing.md,
      overflow: "hidden",
    }}>
      {/* En-tête séance */}
      <Pressable
        onPress={onToggle}
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
            {getWorkoutDisplayName(workout.key)}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
            {exercises.length > 0 ? t.program_exercises(exercises.length) : t.program_no_exercises}
          </Text>
        </View>
        {/* Renommer */}
        <ScalePress
          onPress={(e) => {
            e.stopPropagation();
            onRenamePress(workout.name, String(workout.restSeconds));
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
            onDeletePress();
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

        {exercises.length === 0 && (
          <View style={{ padding: 16, alignItems: "center" }}>
            <Text style={{ color: theme.colors.muted, fontSize: 13 }}>{t.program_no_exercises}</Text>
          </View>
        )}

        <SortableList
          data={exercises}
          onReorder={onReorder}
          renderRow={(ex, handle) => (
            <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 12, gap: 8 }}>
              {handle}
              <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "600", flex: 1 }}>
                {ex.name}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: "600", marginRight: 4 }}>
                {ex.sets}×{ex.reps}
              </Text>
              <ScalePress onPress={() => onEditExercise(ex)} hitSlop={8} style={{ padding: 2 }}>
                <Ionicons name="create-outline" size={16} color={theme.colors.amber} />
              </ScalePress>
              <ScalePress onPress={() => onRemoveExercise(ex.id)} hitSlop={8} style={{ padding: 2 }}>
                <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
              </ScalePress>
            </View>
          )}
        />

        {/* Bouton ajouter exercice */}
        <ScalePress
          onPress={onAddExercise}
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
}
