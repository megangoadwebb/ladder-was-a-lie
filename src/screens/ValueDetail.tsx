import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { STEP_BY_KEY, type Step, type StepKey } from '../theme/steps';
import { fonts, padding } from '../theme/tokens';
import { useStore } from '../state/store';
import { useNav } from '../state/nav';
import {
  daysInMonth as daysInMonthFn,
  monthKey as monthKeyFn,
  monthLabel,
  currentDay,
  lastSixMonthLabels,
} from '../util/dates';
import { Sparkline } from '../components/Sparkline';
import { scheduleDailyReminder, cancelReminder } from '../state/notifications';

type Props = { valueKey: StepKey };

// Stable fallbacks — must be module-level so the zustand selector
// returns the same reference every call when underlying state is undefined.
const EMPTY_CHECKINS: Readonly<Record<string, true>> = Object.freeze({});
const DEFAULT_HISTORY: ReadonlyArray<number> = Object.freeze([
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
]);

export function ValueDetail({ valueKey }: Props) {
  const step = STEP_BY_KEY[valueKey];
  const answer = useStore((s) => s.answers[valueKey] ?? '');
  const setAnswer = useStore((s) => s.setAnswer);
  const checkIns = useStore((s) => s.checkIns[valueKey] ?? EMPTY_CHECKINS);
  const history = useStore((s) => s.history[valueKey] ?? DEFAULT_HISTORY);
  const reminder = useStore((s) => s.reminders[valueKey] ?? false);
  const setReminder = useStore((s) => s.setReminder);
  const toggleDay = useStore((s) => s.toggleDay);
  const closeDetail = useNav((s) => s.openDetail);

  const dim = daysInMonthFn();
  const today = currentDay();
  const month = monthKeyFn();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(answer);

  const monthLogsCount = Object.keys(checkIns).filter(
    (d) => d.startsWith(month) && checkIns[d],
  ).length;
  const pct = Math.round((monthLogsCount / dim) * 100);

  return (
    <Animated.View
      entering={SlideInDown.duration(420).easing(Easing.bezier(0.22, 1, 0.36, 1))}
      exiting={SlideOutDown.duration(320)}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}
    >
      <LinearGradient
        colors={step.gradient.colors as unknown as [string, string, ...string[]]}
        locations={step.gradient.locations as unknown as [number, number, ...number[]]}
        start={step.gradient.start}
        end={step.gradient.end}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 28 }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: padding.topSafe,
                paddingHorizontal: 24,
              }}
            >
              <Pressable onPress={() => closeDetail(null)} hitSlop={10}>
                <Text style={{ fontFamily: fonts.sans, fontSize: 22, color: step.ink }}>←</Text>
              </Pressable>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10.5,
                  letterSpacing: 0.18 * 10.5,
                  color: step.soft,
                }}
              >
                {step.num} · {step.label}
              </Text>
              <Text style={{ fontSize: 18, color: step.ink, fontFamily: fonts.serif }}>
                {step.glyph}
              </Text>
            </View>

            {/* Value statement */}
            <View style={{ paddingHorizontal: 24, paddingTop: 22, paddingBottom: 12 }}>
              {editing ? (
                <TextInput
                  value={draft}
                  autoFocus
                  multiline
                  onChangeText={setDraft}
                  onBlur={() => {
                    setAnswer(valueKey, draft);
                    setEditing(false);
                  }}
                  style={{
                    fontFamily: fonts.serif,
                    fontSize: 28,
                    lineHeight: 28 * 1.15,
                    letterSpacing: -0.01 * 28,
                    color: step.ink,
                    paddingBottom: 8,
                    borderBottomWidth: 1.5,
                    borderBottomColor: step.soft,
                  }}
                />
              ) : (
                <Pressable onPress={() => setEditing(true)}>
                  <Text
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 10,
                      letterSpacing: 0.2 * 10,
                      color: step.soft,
                      marginBottom: 6,
                    }}
                  >
                    YOUR VALUE <Text style={{ opacity: 0.6 }}>· TAP TO EDIT</Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.serif,
                      fontSize: 28,
                      lineHeight: 28 * 1.2,
                      letterSpacing: -0.01 * 28,
                      color: step.ink,
                    }}
                  >
                    {answer || 'set this value…'}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Stats */}
            <View
              style={{
                paddingHorizontal: 24,
                paddingTop: 16,
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.sansMedium,
                  fontSize: 64,
                  lineHeight: 64,
                  letterSpacing: -0.04 * 64,
                  color: step.ink,
                }}
              >
                {monthLogsCount}
                <Text style={{ fontSize: 24, color: step.ink, opacity: 0.5 }}>/{dim}</Text>
              </Text>
              <View style={{ flex: 1, paddingBottom: 6 }}>
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 10,
                    letterSpacing: 0.18 * 10,
                    color: step.soft,
                  }}
                >
                  THIS MONTH · {pct}%
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.serifItalic,
                    fontSize: 13,
                    color: step.soft,
                    marginTop: 4,
                  }}
                >
                  {pct >= 70
                    ? "You're showing up for this."
                    : pct >= 40
                      ? 'Steady — keep going.'
                      : 'Room to grow here.'}
                </Text>
              </View>
            </View>

            {/* Month grid */}
            <View style={{ paddingHorizontal: 24, paddingTop: 22 }}>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: 0.18 * 10,
                  color: step.soft,
                  marginBottom: 10,
                }}
              >
                {monthLabel().toUpperCase()}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {Array.from({ length: dim }).map((_, i) => {
                  const d = i + 1;
                  const iso = `${month}-${String(d).padStart(2, '0')}`;
                  const on = !!checkIns[iso];
                  const isToday = d === today;
                  const future = d > today;
                  return (
                    <Pressable
                      key={d}
                      onPress={() => !future && toggleDay(valueKey, iso)}
                      disabled={future}
                      style={{
                        width: `${100 / 7 - 1.5}%`,
                        height: 48,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: on ? step.ink : 'rgba(255,255,255,0.3)',
                        borderWidth: isToday ? 1.5 : 1,
                        borderColor: isToday ? step.ink : step.soft,
                        opacity: future ? 0.3 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.sansSemibold,
                          fontSize: 13,
                          lineHeight: 13,
                          includeFontPadding: false,
                          textAlign: 'center',
                          color: on ? step.accent : step.ink,
                        }}
                      >
                        {d}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Sparkline */}
            <View style={{ paddingHorizontal: 24, paddingTop: 26 }}>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: 0.18 * 10,
                  color: step.soft,
                  marginBottom: 10,
                }}
              >
                LAST 6 MONTHS
              </Text>
              <Sparkline values={history} ink={step.ink} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 6,
                }}
              >
                {lastSixMonthLabels().map((m, i) => (
                  <Text
                    key={i}
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 9,
                      letterSpacing: 0.14 * 9,
                      color: step.soft,
                    }}
                  >
                    {m}
                  </Text>
                ))}
              </View>
            </View>

            {/* Reminder */}
            <View style={{ paddingHorizontal: 24, paddingTop: 22 }}>
              <ReminderRow
                step={step}
                value={reminder}
                onToggle={async (next) => {
                  setReminder(valueKey, next);
                  if (next) await scheduleDailyReminder(valueKey, step.label);
                  else await cancelReminder(valueKey);
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Animated.View>
  );
}

function ReminderRow({
  step,
  value,
  onToggle,
}: {
  step: Step;
  value: boolean;
  onToggle: (next: boolean) => void;
}) {
  const tx = useSharedValue(value ? 16 : 0);
  useEffect(() => {
    tx.value = withTiming(value ? 16 : 0, {
      duration: 240,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [value, tx]);
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));
  return (
    <Pressable
      onPress={() => onToggle(!value)}
      style={({ pressed }) => ({
        height: 54,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderWidth: 1,
        borderColor: step.soft,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text style={{ fontSize: 14 }}>🔔</Text>
        <Text style={{ fontFamily: fonts.sansMedium, fontSize: 14, color: step.ink }}>
          Daily reminder
        </Text>
      </View>
      <View
        style={{
          width: 40,
          height: 24,
          borderRadius: 999,
          backgroundColor: value ? step.ink : 'rgba(0,0,0,0.15)',
          padding: 2,
        }}
      >
        <Animated.View
          style={[
            {
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: value ? step.accent : '#fff',
            },
            knobStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}
