import { View, Text, Animated } from "react-native";
import { ScalePress } from "../ScalePress";
import { theme } from "../../constants/theme";
import type { AppStrings } from "../../constants/strings";

type RestModalProps = {
  timerDone: boolean;
  restSecondsLeft: number;
  restProgress: number;
  restIsForExercise: boolean;
  flashAnim: Animated.Value;
  upNextName: string;
  currentSet: number;
  totalSets: number;
  onSkip: () => void;
  t: AppStrings;
};

export function RestModal({
  timerDone,
  restSecondsLeft,
  restProgress,
  restIsForExercise,
  flashAnim,
  upNextName,
  currentSet,
  totalSets,
  onSkip,
  t,
}: RestModalProps) {
  return (
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
          borderColor: theme.colors.amber,
          opacity: timerDone ? 1 : Math.max(0.1, restProgress),
          shadowColor: theme.colors.amber,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: timerDone ? 0.8 : 0.55 * restProgress,
          shadowRadius: timerDone ? 24 : 16,
        }} />
        <Text style={{ color: theme.colors.amber, fontSize: 76, fontWeight: "900", lineHeight: 84 }}>
          {restSecondsLeft}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 12, letterSpacing: 1 }}>{t.session_seconds}</Text>
      </Animated.View>

      <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 6 }}>{t.session_up_next}</Text>
      <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: "800", marginBottom: 6, textAlign: "center" }}>
        {upNextName}
      </Text>
      {!restIsForExercise && (
        <Text style={{ color: theme.colors.textSecondary, fontSize: 15, marginBottom: 36 }}>
          {t.session_set_of(currentSet, totalSets)}
        </Text>
      )}

      <ScalePress onPress={onSkip} style={{ marginTop: 16 }}>
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
  );
}
