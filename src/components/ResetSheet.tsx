import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { fonts } from '../theme/tokens';

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

export function ResetSheet({ onCancel, onConfirm }: Props) {
  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      exiting={FadeOut.duration(180)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 250,
        justifyContent: 'flex-end',
      }}
    >
      <Pressable
        onPress={onCancel}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
        }}
      />
      <Animated.View
        entering={SlideInDown.duration(320).easing(Easing.bezier(0.22, 1, 0.36, 1))}
        exiting={SlideOutDown.duration(220)}
        style={{
          backgroundColor: '#1B1917',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 22,
          paddingTop: 16,
          paddingBottom: 36,
        }}
      >
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignSelf: 'center',
            marginBottom: 18,
          }}
        />

        <Text
          style={{
            fontFamily: fonts.serifItalic,
            fontSize: 26,
            lineHeight: 30,
            color: '#F3F0EA',
            marginBottom: 10,
          }}
        >
          Start over?
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            lineHeight: 20,
            color: '#F3F0EA',
            opacity: 0.65,
            marginBottom: 22,
          }}
        >
          This will clear your current cards and take you back to the questionnaire.
          Your streaks and progress will be lost.
        </Text>

        <Pressable
          onPress={onConfirm}
          style={({ pressed }) => ({
            backgroundColor: '#F3F0EA',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
            marginBottom: 10,
          })}
        >
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              letterSpacing: 0.18 * 11,
              color: '#0E0C0A',
            }}
          >
            RESTART QUIZ
          </Text>
        </Pressable>

        <Pressable
          onPress={onCancel}
          style={({ pressed }) => ({
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              letterSpacing: 0.18 * 11,
              color: '#F3F0EA',
              opacity: 0.7,
            }}
          >
            CANCEL
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
