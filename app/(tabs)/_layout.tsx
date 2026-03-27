import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Pressable } from "react-native";
import { useRef } from "react";
import { theme } from "../../constants/theme";
import { useSettings } from "../SettingsContext";

function AnimatedTabButton(props: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.82, useNativeDriver: true, tension: 220, friction: 7 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 220, friction: 7 }).start();
  return (
    <Pressable
      {...props}
      onPressIn={(e) => { props.onPressIn?.(e); pressIn(); }}
      onPressOut={(e) => { props.onPressOut?.(e); pressOut(); }}
      style={props.style}
    >
      <Animated.View style={{ transform: [{ scale }], flex: 1, alignItems: "center", justifyContent: "center" }}>
        {props.children}
      </Animated.View>
    </Pressable>
  );
}

export default function TabLayout() {
  const { t } = useSettings();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <AnimatedTabButton {...props} />,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 18,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.amber,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tab_today,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: t.tab_meals,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="nutrition" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t.tab_progress,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tab_settings,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
