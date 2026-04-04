import { useRef, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Anime count éléments en entrée avec un décalage progressif.
 * Retourne animStyle(i) : style opacity + translateY à passer à Animated.View.
 */
export function useStaggeredAnimation(count: number, stagger = 90) {
  const anims = useRef(Array.from({ length: count }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      stagger,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 380, useNativeDriver: true }))
    ).start();
  }, []);

  const animStyle = (i: number) => {
    const anim = anims[Math.min(i, anims.length - 1)];
    return {
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
    };
  };

  return animStyle;
}
