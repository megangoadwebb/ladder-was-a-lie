import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  total: number;
  current: number;
  ink: string;
  soft: string;
};

export function ProgressDots({ total, current, ink, soft }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} index={i} current={current} ink={ink} soft={soft} />
      ))}
    </View>
  );
}

function Dot({
  index,
  current,
  ink,
  soft,
}: {
  index: number;
  current: number;
  ink: string;
  soft: string;
}) {
  const active = index === current;
  const done = index < current;

  const widthSV = useDerivedValue(() =>
    withTiming(active ? 22 : 6, { duration: 480, easing: Easing.bezier(0.22, 1, 0.36, 1) }),
  );
  const opacitySV = useDerivedValue(() =>
    withTiming(active ? 1 : done ? 0.55 : 0.28, {
      duration: 480,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }),
  );

  const style = useAnimatedStyle(() => ({
    width: widthSV.value,
    opacity: opacitySV.value,
  }));

  return (
    <Animated.View
      style={[
        {
          height: 6,
          borderRadius: 3,
          backgroundColor: active || done ? ink : soft,
        },
        style,
      ]}
    />
  );
}
