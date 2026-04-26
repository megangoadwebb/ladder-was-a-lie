import { useEffect } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LANDING } from '../theme/steps';
import { fonts, padding } from '../theme/tokens';
import { HamburgerGlyph } from '../components/HamburgerGlyph';
import { useButtonOrigin } from '../util/origin';
import { useNav } from '../state/nav';
import { STEPS } from '../theme/steps';
import { events, track } from '../util/analytics';

export function Landing() {
  const { ref, measure } = useButtonOrigin();
  const setWash = useNav((s) => s.setWash);
  const setScreen = useNav((s) => s.setScreen);
  const setStepIdx = useNav((s) => s.setStepIdx);

  const onBegin = async () => {
    track(events.onboardingStarted);
    const origin = await measure();
    const first = STEPS[0]!;
    setWash({
      color: {
        colors: first.gradient.colors,
        locations: first.gradient.locations,
        start: first.gradient.start,
        end: first.gradient.end,
      },
      origin,
    });
    setTimeout(() => {
      setStepIdx(0);
      setScreen('step');
    }, 260);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: LANDING.bg,
        paddingTop: padding.topSafe,
        paddingHorizontal: padding.side,
        paddingBottom: padding.bottomSafe,
      }}
    >
      {/* Top bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <HamburgerGlyph color={LANDING.ink} />
        <Image
          source={require('../../assets/logo.png')}
          tintColor={LANDING.ink}
          style={{ width: 50, height: 18, opacity: 0.85 }}
          resizeMode="contain"
        />
      </View>

      {/* Hero */}
      <View style={{ flex: 1, justifyContent: 'center', gap: 28 }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            letterSpacing: 0.2 * 11,
            color: LANDING.ink,
            opacity: 0.5,
          }}
        >
          A 2-MINUTE REFLECTION
        </Text>

        <View style={{ marginTop: -4 }}>
          <Text
            style={{
              fontFamily: fonts.serif,
              fontSize: 68,
              lineHeight: 76,
              letterSpacing: -0.02 * 68,
              color: '#FFFFFF',
            }}
          >
            The ladder
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              marginTop: -10,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.serifItalic,
                fontSize: 68,
                lineHeight: 76,
                letterSpacing: -0.02 * 68,
                color: '#FFFFFF',
              }}
            >
              was a{' '}
            </Text>
            <Svg width={110} height={76}>
              <Defs>
                <SvgLinearGradient id="lieGrad" x1="0" y1="0.5" x2="1" y2="0.5">
                  {LANDING.accent.colors.map((c, i) => (
                    <Stop key={i} offset={LANDING.accent.locations[i]} stopColor={c} />
                  ))}
                </SvgLinearGradient>
              </Defs>
              <SvgText
                x={0}
                y={58}
                fontFamily={fonts.serifItalic}
                fontSize={68}
                fontStyle="italic"
                fill="url(#lieGrad)"
              >
                lie.
              </SvgText>
            </Svg>
          </View>
        </View>

        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 17,
            lineHeight: 17 * 1.5,
            color: LANDING.ink,
            opacity: 0.7,
            maxWidth: 300,
          }}
        >
          Seven questions. No right answers. Redefine what success actually looks like — for you.
        </Text>
      </View>

      {/* CTA */}
      <View style={{ gap: 16 }}>
        <Pressable ref={ref} onPress={onBegin}>
          {({ pressed }) => (
            <View
              style={{
                height: 64,
                borderRadius: 999,
                overflow: 'hidden',
                opacity: pressed ? 0.92 : 1,
              }}
            >
              <LinearGradient
                colors={LANDING.accent.colors as unknown as [string, string, ...string[]]}
                locations={LANDING.accent.locations as unknown as [number, number, ...number[]]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.sansSemibold,
                    fontSize: 17,
                    color: LANDING.bg,
                    letterSpacing: -0.01 * 17,
                  }}
                >
                  Begin
                </Text>
                <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 20, color: LANDING.bg }}>
                  →
                </Text>
              </LinearGradient>
              <Shine />
            </View>
          )}
        </Pressable>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 10.5,
            letterSpacing: 0.14 * 10.5,
            color: LANDING.ink,
            opacity: 0.38,
            textAlign: 'center',
          }}
        >
          ~ 2 MIN · NO SIGNUP
        </Text>
      </View>
    </View>
  );
}

function Shine() {
  const x = useSharedValue(-80);
  useEffect(() => {
    x.value = withRepeat(
      withTiming(360, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 80,
          pointerEvents: 'none',
        },
        style,
      ]}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}
