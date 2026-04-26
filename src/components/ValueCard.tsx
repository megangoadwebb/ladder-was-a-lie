import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import type { Step } from '../theme/steps';
import { fonts } from '../theme/tokens';
import { MonthStrip } from './Sparkline';

type Props = {
  step: Step;
  answer: string | undefined;
  count: number;
  daysInMonth: number;
  pct: number;
  loggedToday: boolean;
  monthLogs: Record<string, true>;
  monthKey: string;
  today: number;
  drag?: () => void;
  isDragActive?: boolean;
  onTapAdd: () => void;
  onTapCard: () => void;
  onOpenMenu: () => void;
  reminder?: boolean;
};

export function ValueCard({
  step,
  answer,
  count,
  daysInMonth,
  pct,
  loggedToday,
  monthLogs,
  monthKey,
  today,
  drag,
  isDragActive,
  onTapAdd,
  onTapCard,
  onOpenMenu,
  reminder,
}: Props) {
  const [floats, setFloats] = useState<number[]>([]);
  const bump = useSharedValue(1);

  const dropFloat = (id: number) =>
    setFloats((prev) => prev.filter((f) => f !== id));

  const handleAdd = () => {
    if (loggedToday) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    cancelAnimation(bump);
    bump.value = withSequence(
      withTiming(1.015, { duration: 140, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 280, easing: Easing.bezier(0.22, 1, 0.36, 1) }),
    );
    const id = Date.now();
    setFloats((prev) => [...prev, id]);
    setTimeout(() => dropFloat(id), 900);
    onTapAdd();
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bump.value }],
  }));

  return (
    <Animated.View style={[{ borderRadius: 18, overflow: 'hidden' }, cardStyle]}>
      <Pressable
        onPress={onTapCard}
        onLongPress={drag}
        delayLongPress={250}
        disabled={isDragActive}
      >
        <LinearGradient
          colors={step.gradient.colors as unknown as [string, string, ...string[]]}
          locations={step.gradient.locations as unknown as [number, number, ...number[]]}
          start={step.gradient.start}
          end={step.gradient.end}
          style={{
            paddingHorizontal: 12,
            paddingTop: 10,
            paddingBottom: 10,
            gap: 6,
          }}
        >
          {/* top row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ opacity: 0.5, padding: 4 }}>
              <DragDots color={step.ink} />
            </View>

            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 9,
                  letterSpacing: 0.22 * 9,
                  color: step.soft,
                  marginBottom: 2,
                }}
              >
                {step.num} · {step.label}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: answer ? fonts.serif : fonts.serifItalic,
                  fontSize: 20,
                  lineHeight: 22,
                  letterSpacing: -0.01 * 20,
                  color: step.ink,
                  opacity: answer ? 1 : 0.55,
                }}
              >
                {answer || 'tap to set…'}
              </Text>
            </View>

            <Pressable
              onPress={handleAdd}
              hitSlop={6}
              accessibilityLabel="Log today"
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: loggedToday ? step.ink : 'rgba(255,255,255,0.32)',
                borderWidth: 1,
                borderColor: loggedToday ? step.ink : step.soft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {loggedToday ? (
                <Svg width={14} height={14} viewBox="0 0 14 14">
                  <Path
                    d="M2.5 7.5L5.5 10.5L11.5 3.5"
                    stroke={step.accent}
                    strokeWidth={1.8}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              ) : (
                <Svg width={16} height={16} viewBox="0 0 16 16">
                  <Path
                    d="M8 3v10M3 8h10"
                    stroke={step.ink}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  />
                </Svg>
              )}
              {floats.map((id) => (
                <PlusOne key={id} ink={step.ink} />
              ))}
            </Pressable>

            <Pressable
              onPress={onOpenMenu}
              hitSlop={8}
              accessibilityLabel="More"
              style={{
                width: 28,
                height: 38,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width={18} height={4} viewBox="0 0 18 4">
                <Circle cx={2} cy={2} r={1.6} fill={step.ink} opacity={0.75} />
                <Circle cx={9} cy={2} r={1.6} fill={step.ink} opacity={0.75} />
                <Circle cx={16} cy={2} r={1.6} fill={step.ink} opacity={0.75} />
              </Svg>
            </Pressable>
          </View>

          {/* progress bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingLeft: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.18)',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: 4,
                  width: `${pct * 100}%`,
                  backgroundColor: step.ink,
                  borderRadius: 2,
                }}
              />
            </View>
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                letterSpacing: 0.12 * 10,
                color: step.soft,
                minWidth: 40,
                textAlign: 'right',
              }}
            >
              {count}/{daysInMonth}
            </Text>
          </View>

          {/* month strip */}
          <View style={{ paddingLeft: 16, paddingRight: 4 }}>
            <MonthStrip
              daysInMonth={daysInMonth}
              today={today}
              logs={monthLogs}
              monthKey={monthKey}
              ink={step.ink}
              soft={step.soft}
            />
          </View>

          {reminder && (
            <Text
              style={{
                position: 'absolute',
                top: 10,
                right: 58,
                fontSize: 9,
                color: step.soft,
                fontFamily: fonts.mono,
              }}
            >
              🔔
            </Text>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

function DragDots({ color }: { color: string }) {
  return (
    <Svg width={8} height={14} viewBox="0 0 8 14">
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <Circle
            key={`${row}-${col}`}
            cx={1.5 + col * 5}
            cy={2 + row * 5}
            r={1.1}
            fill={color}
          />
        )),
      )}
    </Svg>
  );
}

function PlusOne({ ink }: { ink: string }) {
  const y = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    op.value = withSequence(
      withTiming(1, { duration: 160 }),
      withDelay(440, withTiming(0, { duration: 200 })),
    );
    y.value = withTiming(-26, { duration: 800, easing: Easing.bezier(0.22, 1, 0.36, 1) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateX: -6 }, { translateY: y.value }],
  }));
  return (
    <Animated.Text
      style={[
        {
          position: 'absolute',
          top: -4,
          left: '50%',
          fontFamily: fonts.monoSemibold,
          fontSize: 11,
          color: ink,
        },
        style,
      ]}
    >
      +1
    </Animated.Text>
  );
}
