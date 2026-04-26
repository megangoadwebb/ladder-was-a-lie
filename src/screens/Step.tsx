import { useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { STEPS, SUMMARY, type Step as StepData } from '../theme/steps';
import { fonts, padding } from '../theme/tokens';
import { HamburgerGlyph } from '../components/HamburgerGlyph';
import { ProgressDots } from '../components/ProgressDots';
import { useNav } from '../state/nav';
import { useStore } from '../state/store';
import { useButtonOrigin } from '../util/origin';

export function Step() {
  const stepIdx = useNav((s) => s.stepIdx);
  const setStepIdx = useNav((s) => s.setStepIdx);
  const setScreen = useNav((s) => s.setScreen);
  const setWash = useNav((s) => s.setWash);

  const step = STEPS[stepIdx]!;
  const value = useStore((s) => s.answers[step.key] ?? '');
  const setAnswer = useStore((s) => s.setAnswer);
  const finishOnboarding = useStore((s) => s.finishOnboarding);

  const inputRef = useRef<RNTextInput>(null);
  const { ref: nextRef, measure } = useButtonOrigin();

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, [step.key]);

  const canAdvance = value.trim().length > 0;

  const onNext = async () => {
    if (!canAdvance) return;
    const origin = await measure();
    if (stepIdx < STEPS.length - 1) {
      const next = STEPS[stepIdx + 1]!;
      setWash({
        color: {
          colors: next.gradient.colors,
          locations: next.gradient.locations,
          start: next.gradient.start,
          end: next.gradient.end,
        },
        origin,
      });
      setTimeout(() => setStepIdx(stepIdx + 1), 260);
    } else {
      setWash({ color: SUMMARY.bg, origin });
      finishOnboarding();
      setTimeout(() => setScreen('summary'), 260);
    }
  };

  const onBack = () => {
    if (stepIdx === 0) setScreen('landing');
    else setStepIdx(stepIdx - 1);
  };

  return (
    <Animated.View
      key={step.key}
      entering={FadeInDown.duration(520).springify()}
      style={{ flex: 1 }}
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
          style={{
            flex: 1,
            paddingTop: padding.topSafe,
            paddingHorizontal: padding.side,
            paddingBottom: 28,
          }}
        >
          {/* Top: menu + step number */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <HamburgerGlyph color={step.ink} />
            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={{
                  fontFamily: fonts.sansMedium,
                  fontSize: 72,
                  lineHeight: 78,
                  letterSpacing: -0.04 * 72,
                  color: step.ink,
                  includeFontPadding: false,
                }}
              >
                {step.num[1]}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: 0.18 * 10,
                  color: step.soft,
                  marginTop: 4,
                }}
              >
                OF 07
              </Text>
            </View>
          </View>

          {/* Label */}
          <View style={{ marginTop: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  letterSpacing: 0.24 * 12,
                  color: step.soft,
                }}
              >
                {step.label}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 14,
                  color: step.soft,
                }}
              >
                {step.glyph}
              </Text>
            </View>
          </View>

          {/* Prompt */}
          <View style={{ marginTop: 14 }}>
            <Text
              style={{
                fontFamily: fonts.serif,
                fontSize: 40,
                lineHeight: 40 * 1.04,
                letterSpacing: -0.015 * 40,
                color: step.ink,
              }}
            >
              {step.prompt}
            </Text>
            <Text
              style={{
                fontFamily: fonts.serifItalic,
                fontSize: 14,
                color: step.soft,
                lineHeight: 14 * 1.4,
                marginTop: 14,
              }}
            >
              {step.helper}
            </Text>
          </View>

          {/* Input zone */}
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 20,
            }}
          >
            <TextField
              ref={inputRef}
              step={step}
              value={value}
              onChange={(v) => setAnswer(step.key, v)}
              onSubmit={onNext}
            />
          </View>

          {/* Footer: progress + nav */}
          <View style={{ gap: 22 }}>
            <ProgressDots total={STEPS.length} current={stepIdx} ink={step.ink} soft={step.soft} />
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Pressable
                onPress={onBack}
                accessibilityLabel="Back"
                style={({ pressed }) => ({
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  borderWidth: 1.5,
                  borderColor: step.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text style={{ fontFamily: fonts.sans, fontSize: 20, color: step.ink }}>←</Text>
              </Pressable>
              <Pressable
                ref={nextRef}
                onPress={onNext}
                disabled={!canAdvance}
                style={({ pressed }) => ({
                  flex: 1,
                  height: 56,
                  borderRadius: 999,
                  backgroundColor: step.ink,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 10,
                  opacity: !canAdvance ? 0.35 : pressed ? 0.92 : 1,
                })}
              >
                <Text
                  style={{
                    fontFamily: fonts.sansSemibold,
                    fontSize: 16,
                    color: step.accent,
                    letterSpacing: -0.01 * 16,
                  }}
                >
                  {stepIdx === STEPS.length - 1 ? 'See what you made' : 'Next'}
                </Text>
                <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 18, color: step.accent }}>
                  →
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Animated.View>
  );
}

import { forwardRef } from 'react';

const TextField = forwardRef<
  RNTextInput,
  {
    step: StepData;
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
  }
>(function TextField({ step, value, onChange, onSubmit }, ref) {
  return (
    <View>
      <RNTextInput
        ref={ref}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        blurOnSubmit
        returnKeyType="done"
        placeholder={step.placeholder}
        placeholderTextColor={step.soft}
        maxLength={140}
        multiline
        scrollEnabled={false}
        style={{
          fontFamily: fonts.serif,
          fontSize: 30,
          lineHeight: 30 * 1.15,
          letterSpacing: -0.01 * 30,
          color: step.ink,
          paddingBottom: 10,
          borderBottomWidth: 1.5,
          borderBottomColor: step.soft,
          minHeight: 44,
        }}
      />
      <Text
        style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          letterSpacing: 0.14 * 10,
          color: step.soft,
          marginTop: 10,
        }}
      >
        ONE WORD THAT DESCRIBES THIS...
      </Text>
    </View>
  );
});
