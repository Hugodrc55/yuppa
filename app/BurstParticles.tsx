import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const colors = ['#5e00ff', '#8a2be2', '#00ffcc']; // Palette Yuppa

const TOTAL_PARTICLES = 12;

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const Circle = ({ index }: { index: number }) => {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const rotate = useSharedValue(0);

  const size = randomBetween(6, 12);

  useEffect(() => {
    const angle = (index / TOTAL_PARTICLES) * 2 * Math.PI + randomBetween(-0.2, 0.2);
    const radius = randomBetween(40, 70);

    translateX.value = withTiming(Math.cos(angle) * radius, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    translateY.value = withTiming(Math.sin(angle) * radius, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    scale.value = withTiming(1.3, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    rotate.value = withTiming(360, {
      duration: 800,
      easing: Easing.linear,
    });

    opacity.value = withTiming(0, { duration: 900 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.circle,
        style,
        {
          backgroundColor: colors[index % colors.length],
          width: size,
          height: size,
        },
      ]}
    />
  );
};

const BurstParticles = ({ x, y }: { x: number; y: number }) => {
  return (
    <View style={[styles.container, { left: x, top: y }]}>
      {[...Array(TOTAL_PARTICLES)].map((_, i) => (
        <Circle key={i} index={i} />
      ))}
    </View>
  );
};

export default BurstParticles;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
  },
});
