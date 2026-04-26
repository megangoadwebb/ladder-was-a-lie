import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Step } from '../theme/steps';
import { fonts } from '../theme/tokens';

type Props = {
  step: Step;
  reminder: boolean;
  onClose: () => void;
  onEdit: () => void;
  onReminder: () => void;
  onRemove: () => void;
};

export function ActionSheet({ step, reminder, onClose, onEdit, onReminder, onRemove }: Props) {
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
        zIndex: 200,
        justifyContent: 'flex-end',
      }}
    >
      <Pressable
        onPress={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      />
      <Animated.View
        entering={SlideInDown.duration(320).easing(Easing.bezier(0.22, 1, 0.36, 1))}
        exiting={SlideOutDown.duration(220)}
        style={{
          backgroundColor: '#1B1917',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 18,
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
            marginBottom: 16,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={step.gradient.colors as unknown as [string, string, ...string[]]}
              locations={step.gradient.locations as unknown as [number, number, ...number[]]}
              start={step.gradient.start}
              end={step.gradient.end}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <Text style={{ color: step.ink, fontFamily: fonts.serif, fontSize: 14 }}>
              {step.glyph}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              letterSpacing: 0.18 * 11,
              color: '#F5F1EA',
              opacity: 0.7,
            }}
          >
            {step.label}
          </Text>
        </View>

        <SheetItem label="Edit value statement" onPress={onEdit} />
        <SheetItem
          label={reminder ? 'Turn off reminder' : 'Turn on daily reminder'}
          onPress={onReminder}
        />
        <SheetItem label="Remove value" onPress={onRemove} danger />
      </Animated.View>
    </Animated.View>
  );
}

function SheetItem({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: fonts.sansMedium,
          fontSize: 15,
          color: danger ? '#FF7A7A' : '#F5F1EA',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
