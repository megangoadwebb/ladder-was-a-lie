import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Wash } from '../state/nav';

type Props = {
  wash: NonNullable<Wash>;
  onDone: () => void;
};

// The wash circle starts at the tap origin and expands to cover the screen.
// We compute a final scale large enough that the circle's diameter exceeds
// the screen diagonal from the farthest corner.
function finalScale(originPx: { x: number; y: number }, baseDiameter: number) {
  const { width, height } = Dimensions.get('window');
  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height },
  ];
  let max = 0;
  for (const c of corners) {
    const dx = c.x - originPx.x;
    const dy = c.y - originPx.y;
    max = Math.max(max, Math.hypot(dx, dy));
  }
  // diameter of base / 2 = radius. We need scale such that radius * scale >= max.
  return (max * 2.05) / baseDiameter;
}

const BASE = 60;

export function ColorWash({ wash, onDone }: Props) {
  const { width, height } = Dimensions.get('window');
  const originPx = {
    x: wash.origin.x * width,
    y: wash.origin.y * height,
  };
  const scale = useSharedValue(0.1);

  useEffect(() => {
    const target = finalScale(originPx, BASE);
    scale.value = withTiming(
      target,
      {
        duration: 720,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      },
      (finished) => {
        if (finished) runOnJS(onDone)();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const colors = typeof wash.color === 'string'
    ? ([wash.color, wash.color] as [string, string])
    : (wash.color.colors as unknown as [string, string, ...string[]]);
  const start = typeof wash.color === 'string' ? { x: 0, y: 0 } : (wash.color.start ?? { x: 0, y: 0 });
  const end = typeof wash.color === 'string' ? { x: 1, y: 1 } : (wash.color.end ?? { x: 1, y: 1 });
  const locations = typeof wash.color === 'string'
    ? undefined
    : (wash.color.locations as unknown as [number, number, ...number[]] | undefined);

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden', zIndex: 50 }]}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: originPx.x - BASE / 2,
            top: originPx.y - BASE / 2,
            width: BASE,
            height: BASE,
            borderRadius: BASE / 2,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        <LinearGradient
          colors={colors}
          locations={locations}
          start={start}
          end={end}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
