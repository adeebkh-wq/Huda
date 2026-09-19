import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

interface BreathingAnimationProps {
  size?: number;
  active?: boolean;
}

export function BreathingAnimation({ size = 200, active = true }: BreathingAnimationProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);
  const phaseLabel = useSharedValue(0); // 0 = in, 1 = hold, 2 = out

  const start = useCallback(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.4, { duration: 2000 }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000 }),
        withTiming(0.9, { duration: 2000 }),
        withTiming(0.5, { duration: 4000 }),
        withTiming(0.5, { duration: 1000 }),
      ),
      -1,
      false,
    );
  }, [scale, opacity]);

  useEffect(() => {
    if (active) {
      start();
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(1);
      opacity.value = withTiming(0.6);
    }
  }, [active, start, scale, opacity]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.outerRing,
          circleStyle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
      <View style={[styles.innerCircle, { width: size * 0.55, height: size * 0.55, borderRadius: size }]}>
        <Text style={styles.breathText}>Breathe</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    backgroundColor: 'rgba(100, 200, 180, 0.35)',
    borderWidth: 2,
    borderColor: 'rgba(100, 200, 180, 0.6)',
  },
  innerCircle: {
    backgroundColor: 'rgba(42, 157, 143, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
});
