import React, { useRef } from "react";
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

interface ScalePressProps extends PressableProps {
  scaleTo?: number;
  wrapperStyle?: StyleProp<ViewStyle>;
}

export function ScalePress({
  scaleTo = 0.96,
  children,
  onPressIn,
  onPressOut,
  wrapperStyle,
  ...rest
}: ScalePressProps) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale }] }]}>
      <Pressable
        {...rest}
        onPressIn={(e) => {
          Animated.spring(scale, {
            toValue: scaleTo,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
          }).start();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
          }).start();
          onPressOut?.(e);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
