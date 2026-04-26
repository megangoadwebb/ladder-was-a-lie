import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';
import { useFonts } from 'expo-font';

import { Landing } from './src/screens/Landing';
import { Step } from './src/screens/Step';
import { Summary } from './src/screens/Summary';
import { Home } from './src/screens/Home';
import { ValueDetail } from './src/screens/ValueDetail';
import { ActionSheet } from './src/components/ActionSheet';
import { ColorWash } from './src/components/ColorWash';
import { useNav } from './src/state/nav';
import { useStore } from './src/state/store';
import { STEP_BY_KEY } from './src/theme/steps';
import { scheduleDailyReminder, cancelReminder } from './src/state/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
  });

  const hasOnboarded = useStore((s) => s.hasOnboarded);
  const hydrated = useStore((s) => s._hydrated);
  const setScreen = useNav((s) => s.setScreen);
  const screen = useNav((s) => s.screen);
  const wash = useNav((s) => s.wash);
  const setWash = useNav((s) => s.setWash);
  const detailKey = useNav((s) => s.detailKey);
  const menuKey = useNav((s) => s.menuKey);
  const openDetail = useNav((s) => s.openDetail);
  const openMenu = useNav((s) => s.openMenu);
  const reminders = useStore((s) => s.reminders);
  const setReminder = useStore((s) => s.setReminder);

  // Land returning users on Home; first-time users on Landing.
  // Wait for hydration so we don't briefly show Landing to a returning user.
  useEffect(() => {
    if (!hydrated) return;
    if (hasOnboarded) setScreen('home');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const onLayout = useCallback(async () => {
    if (fontsLoaded && hydrated) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, hydrated]);

  if (!fontsLoaded || !hydrated) return null;

  const menuStep = menuKey ? STEP_BY_KEY[menuKey] : null;

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayout}>
      <StatusBar style="light" />
      <View style={styles.root}>
        {screen === 'landing' && <Landing />}
        {screen === 'step' && <Step />}
        {screen === 'summary' && <Summary />}
        {screen === 'home' && <Home />}

        {detailKey && <ValueDetail valueKey={detailKey} />}

        {menuStep && menuKey && (
          <ActionSheet
            step={menuStep}
            reminder={!!reminders[menuKey]}
            onClose={() => openMenu(null)}
            onEdit={() => {
              const k = menuKey;
              openMenu(null);
              openDetail(k);
            }}
            onReminder={async () => {
              const next = !reminders[menuKey];
              setReminder(menuKey, next);
              if (next) await scheduleDailyReminder(menuKey, menuStep.label);
              else await cancelReminder(menuKey);
              openMenu(null);
            }}
            onRemove={() => openMenu(null)}
          />
        )}

        {wash && <ColorWash wash={wash} onDone={() => setWash(null)} />}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0E0C0A' },
});
