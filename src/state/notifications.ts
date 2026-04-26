import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StepKey } from '../theme/steps';

const ID_PREFIX_KEY = 'reminder-ids:';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function getStoredId(key: StepKey): Promise<string | null> {
  return AsyncStorage.getItem(ID_PREFIX_KEY + key);
}
async function setStoredId(key: StepKey, id: string | null) {
  if (id === null) await AsyncStorage.removeItem(ID_PREFIX_KEY + key);
  else await AsyncStorage.setItem(ID_PREFIX_KEY + key, id);
}

async function ensurePermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  if (settings.canAskAgain === false) return false;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

export async function scheduleDailyReminder(key: StepKey, label: string): Promise<void> {
  const ok = await ensurePermission();
  if (!ok) return;
  await cancelReminder(key);
  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: 19,
    minute: 0,
  };
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to live your value',
      body: `Did you live your ${label.toLowerCase()} today?`,
    },
    trigger,
  });
  await setStoredId(key, id);
}

export async function cancelReminder(key: StepKey): Promise<void> {
  const id = await getStoredId(key);
  if (id) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // already gone
    }
  }
  await setStoredId(key, null);
}
