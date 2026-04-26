import { useRef } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { HOME, SPECTRUM, STEPS, SUMMARY } from '../theme/steps';
import { fonts, padding } from '../theme/tokens';
import { HamburgerGlyph } from '../components/HamburgerGlyph';
import { buildSentence } from '../util/sentence';
import { useStore } from '../state/store';
import { useNav } from '../state/nav';
import { useButtonOrigin } from '../util/origin';
import { events, track } from '../util/analytics';

export function Summary() {
  const answers = useStore((s) => s.answers);
  const setWash = useNav((s) => s.setWash);
  const setScreen = useNav((s) => s.setScreen);
  const { ref: ctaRef, measure } = useButtonOrigin();
  const cardRef = useRef<View>(null);

  const filled = STEPS.map((s) => ({ step: s, answer: (answers[s.key] ?? '').trim() })).filter(
    (x) => x.answer,
  );

  const goHome = async () => {
    track(events.summaryToHome);
    const origin = await measure();
    setWash({ color: HOME.bg, origin });
    setTimeout(() => setScreen('home'), 260);
  };

  const onShare = async () => {
    track(events.summaryShared);
    const lines = filled
      .map((f) => {
        const { pre, em, post } = buildSentence(f.step.key, f.answer);
        return `${pre}${em}${post}`;
      })
      .join('\n\n');
    const message = `My values\n\n${lines}\n\n— The Ladder Was a Lie`;
    try {
      await Share.share({ message });
    } catch {
      // user cancelled
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(700)}
      style={{ flex: 1, backgroundColor: SUMMARY.bg }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: padding.topSafe,
            paddingHorizontal: padding.side,
          }}
        >
          <HamburgerGlyph color={SUMMARY.ink} />
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              letterSpacing: 0.18 * 11,
              color: SUMMARY.ink,
              opacity: 0.5,
            }}
          >
            YOUR VALUES
          </Text>
        </View>

        <View style={{ padding: 20, paddingTop: 28, flex: 1 }} ref={cardRef}>
          <View
            style={{
              backgroundColor: '#FFFDF9',
              borderRadius: 20,
              padding: 26,
              paddingTop: 32,
              shadowColor: '#0E0C0A',
              shadowOpacity: 0.08,
              shadowRadius: 40,
              shadowOffset: { width: 0, height: 20 },
              overflow: 'hidden',
            }}
          >
            {/* rainbow stripe */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
              }}
            >
              <LinearGradient
                colors={SPECTRUM as unknown as [string, string, ...string[]]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ flex: 1 }}
              />
            </View>

            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                letterSpacing: 0.22 * 10,
                color: SUMMARY.ink,
                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              VALUES · {new Date().getFullYear()}
            </Text>

            <View style={{ gap: 12 }}>
              {filled.map((f, i) => {
                const { pre, em, post } = buildSentence(f.step.key, f.answer);
                return (
                  <Animated.View
                    key={f.step.key}
                    entering={FadeInUp.duration(700).delay(i * 140)}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.serif,
                        fontSize: 22,
                        lineHeight: 22 * 1.35,
                        color: '#1A1715',
                      }}
                    >
                      {pre}
                      <Text
                        style={{
                          fontFamily: fonts.sansMedium,
                          color: f.step.emphasis,
                        }}
                      >
                        {em}
                      </Text>
                      {post}
                    </Text>
                  </Animated.View>
                );
              })}
            </View>

            <View
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTopWidth: 1,
                borderTopColor: 'rgba(14,12,10,0.15)',
                borderStyle: 'dashed',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  letterSpacing: 0.18 * 10,
                  color: SUMMARY.ink,
                  opacity: 0.5,
                }}
              >
                THE LADDER WAS A LIE
              </Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {SPECTRUM.map((c) => (
                  <View
                    key={c}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: c,
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          <Text
            style={{
              fontFamily: fonts.serifItalic,
              fontSize: 16,
              textAlign: 'center',
              color: SUMMARY.ink,
              opacity: 0.55,
              marginTop: 28,
              marginHorizontal: 32,
              lineHeight: 16 * 1.4,
            }}
          >
            You didn't answer seven questions. You defined what means success to you.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 28, gap: 10 }}>
          <Pressable
            ref={ctaRef}
            onPress={goHome}
            style={({ pressed }) => ({
              height: 56,
              borderRadius: 999,
              backgroundColor: '#0E0C0A',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
              opacity: pressed ? 0.92 : 1,
            })}
          >
            <Text
              style={{ fontFamily: fonts.sansSemibold, fontSize: 15, color: '#F5F1EA' }}
            >
              Track your values
            </Text>
            <Text
              style={{ fontFamily: fonts.sansSemibold, fontSize: 17, color: '#F5F1EA' }}
            >
              →
            </Text>
          </Pressable>
          <Pressable
            onPress={onShare}
            style={({ pressed }) => ({
              height: 48,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: 'rgba(14,12,10,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path
                d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10"
                stroke="#0E0C0A"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={{ fontFamily: fonts.sansMedium, fontSize: 14, color: '#0E0C0A' }}
            >
              Save to phone
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

