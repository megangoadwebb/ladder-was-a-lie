import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, {
  type RenderItemParams,
  ScaleDecorator,
  ShadowDecorator,
} from 'react-native-draggable-flatlist';
import Svg, { Circle, Path } from 'react-native-svg';
import { HOME, STEP_BY_KEY, STEPS, type StepKey } from '../theme/steps';
import { fonts, padding } from '../theme/tokens';
import { HamburgerGlyph } from '../components/HamburgerGlyph';
import { ValueCard } from '../components/ValueCard';
import { useStore } from '../state/store';
import { useNav } from '../state/nav';
import {
  daysInMonth as daysInMonthFn,
  monthKey as monthKeyFn,
  monthLabel,
  todayISO,
  currentDay,
} from '../util/dates';
import { computeStreak } from '../util/streak';

export function Home() {
  const answers = useStore((s) => s.answers);
  const checkIns = useStore((s) => s.checkIns);
  const order = useStore((s) => s.order);
  const reminders = useStore((s) => s.reminders);
  const setOrder = useStore((s) => s.setOrder);
  const logToday = useStore((s) => s.logToday);

  const setScreen = useNav((s) => s.setScreen);
  const setStepIdx = useNav((s) => s.setStepIdx);
  const openDetail = useNav((s) => s.openDetail);
  const openMenu = useNav((s) => s.openMenu);

  const dim = daysInMonthFn();
  const today = todayISO();
  const todayDay = currentDay();
  const month = monthKeyFn();

  const streak = useMemo(() => computeStreak(checkIns), [checkIns]);

  const orderedKeys: StepKey[] =
    order && order.length === STEPS.length ? order : STEPS.map((s) => s.key);

  const restartOnboarding = () => {
    setStepIdx(0);
    setScreen('landing');
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<StepKey>) => {
    const step = STEP_BY_KEY[item];
    const logs = checkIns[step.key] ?? {};
    const monthLogs: Record<string, true> = {};
    for (const iso of Object.keys(logs)) {
      if (iso.startsWith(month) && logs[iso]) monthLogs[iso] = true;
    }
    const count = Object.keys(monthLogs).length;
    const pct = Math.min(1, count / dim);
    const loggedToday = !!logs[today];

    return (
      <ScaleDecorator activeScale={1.02}>
        <ShadowDecorator
          color="#000"
          opacity={0.45}
          radius={20}
          elevation={8}
        >
          <View style={{ paddingVertical: 3 }}>
            <ValueCard
              step={step}
              answer={answers[step.key]}
              count={count}
              daysInMonth={dim}
              pct={pct}
              loggedToday={loggedToday}
              monthLogs={monthLogs}
              monthKey={month}
              today={todayDay}
              drag={drag}
              isDragActive={isActive}
              onTapAdd={() => logToday(step.key)}
              onTapCard={() => openDetail(step.key)}
              onOpenMenu={() => openMenu(step.key)}
              reminder={reminders[step.key]}
            />
          </View>
        </ShadowDecorator>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: HOME.bg }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: padding.topSafe,
          paddingHorizontal: 24,
          paddingBottom: 4,
        }}
      >
        <Pressable onPress={restartOnboarding} hitSlop={10}>
          <HamburgerGlyph color={HOME.ink} />
        </Pressable>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 10.5,
            letterSpacing: 0.18 * 10.5,
            color: HOME.ink,
            opacity: 0.55,
          }}
        >
          {monthLabel().toUpperCase()}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 24, paddingTop: 6, paddingBottom: 8 }}>
        <Text
          style={{
            fontFamily: fonts.serif,
            fontSize: 26,
            lineHeight: 30,
            letterSpacing: -0.015 * 26,
            color: HOME.ink,
          }}
        >
          <Text style={{ fontFamily: fonts.serifItalic }}>How are you</Text> living it?
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 6,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10.5,
              letterSpacing: 0.16 * 10.5,
              color: HOME.ink,
              opacity: 0.45,
            }}
          >
            TAP{'  '}
          </Text>
          <InlinePlus />
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10.5,
              letterSpacing: 0.16 * 10.5,
              color: HOME.ink,
              opacity: 0.45,
            }}
          >
            EACH DAY · {streak > 0 ? `${streak}-DAY STREAK` : 'START YOUR STREAK'}
          </Text>
        </View>
      </View>

      <DraggableFlatList
        data={orderedKeys}
        keyExtractor={(k) => k}
        onDragEnd={({ data }) => setOrder(data)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
        activationDistance={12}
      />
    </GestureHandlerRootView>
  );
}

function InlinePlus() {
  return (
    <Svg width={12} height={12} viewBox="0 0 10 10">
      <Circle cx={5} cy={5} r={4.5} stroke={HOME.ink} strokeWidth={0.8} fill="none" opacity={0.5} />
      <Path
        d="M5 2.8v4.4M2.8 5h4.4"
        stroke={HOME.ink}
        strokeWidth={0.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
