import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import { theme } from "../../constants/theme";
import { useSettings } from "../../constants/SettingsContext";
import type { Lang } from "../../constants/i18n";

function SettingRow({
  icon,
  label,
  sub,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: theme.spacing.md,
        gap: 14,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.amberSubtle,
          borderRadius: theme.radius.sm,
          padding: 8,
          borderWidth: 1,
          borderColor: theme.colors.amberDeep,
        }}
      >
        <Ionicons name={icon} size={18} color={theme.colors.amber} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: "600" }}>{label}</Text>
        {sub && (
          <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 2 }}>{sub}</Text>
        )}
      </View>
      {children}
    </View>
  );
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.colors.cardElevated,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: "hidden",
      }}
    >
      {(["en", "fr"] as Lang[]).map((l) => (
        <Pressable
          key={l}
          onPress={() => setLang(l)}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 8,
            backgroundColor: lang === l ? theme.colors.amber : "transparent",
          }}
        >
          <Text
            style={{
              color: lang === l ? "#0D0D0D" : theme.colors.muted,
              fontSize: 12,
              fontWeight: "800",
              letterSpacing: 0.5,
            }}
          >
            {l.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: theme.spacing.md }} />;
}

export default function SettingsScreen() {
  const { lang, setLang, t } = useSettings();

  const anims = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(80,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true }))
    ).start();
  }, []);
  const animStyle = (i: number) => ({
    opacity: anims[i],
    transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[{ marginBottom: theme.spacing.xl }, animStyle(0)]}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {t.preferences}
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: "800", letterSpacing: -0.5 }}>
            {t.settings}
          </Text>
        </Animated.View>

        {/* Preferences card */}
        <Animated.View style={[{ marginBottom: theme.spacing.md }, animStyle(1)]}>
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
            }}
          >
            <SettingRow icon="language-outline" label={t.language}>
              <LangToggle lang={lang} setLang={setLang} />
            </SettingRow>
          </View>
        </Animated.View>

        {/* About card */}
        <Animated.View style={animStyle(2)}>
          <View
            style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.radius.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
            }}
          >
            <SettingRow icon="flame-outline" label="FORGE" sub={lang === "fr" ? "Version 4.0" : "Version 4.0"}>
              <Text style={{ color: theme.colors.muted, fontSize: 12 }}>v4</Text>
            </SettingRow>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
