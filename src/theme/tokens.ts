export const fonts = {
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
  sansLight: 'SpaceGrotesk_300Light',
  sans: 'SpaceGrotesk_400Regular',
  sansMedium: 'SpaceGrotesk_500Medium',
  sansSemibold: 'SpaceGrotesk_600SemiBold',
  sansBold: 'SpaceGrotesk_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoSemibold: 'JetBrainsMono_600SemiBold',
};

export const motion = {
  decel: { duration: 480 } as const,
  wash: { duration: 720 } as const,
  fade: { duration: 420 } as const,
  cardSpring: { damping: 18, stiffness: 220, mass: 0.8 } as const,
};

export const radius = {
  pill: 999,
  card: 24,
  cardLg: 28,
};

export const padding = {
  topSafe: 64,
  bottomSafe: 32,
  side: 28,
};
