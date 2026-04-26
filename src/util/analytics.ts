import posthog from 'posthog-js';

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

let initialized = false;
let identified = false;

export function initAnalytics(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  if (!KEY) {
    // eslint-disable-next-line no-console
    console.warn('[analytics] PostHog key missing — analytics disabled');
    return;
  }
  posthog.init(KEY, {
    api_host: HOST,
    defaults: '2026-01-30',
    person_profiles: 'identified_only',
    // Capture clicks/pageviews automatically. Textareas are NOT captured by default.
    autocapture: true,
    capture_pageview: true,
  });
  initialized = true;
}

export function identifyUser(userId: string): void {
  if (!initialized || identified) return;
  posthog.identify(userId);
  identified = true;
}

export function track(
  event: string,
  props?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (!initialized) return;
  posthog.capture(event, props);
}

export const events = {
  onboardingStarted: 'onboarding_started',
  onboardingStepCompleted: 'onboarding_step_completed',
  onboardingCompleted: 'onboarding_completed',
  summaryToHome: 'summary_to_home',
  summaryShared: 'summary_shared',
  checkInLogged: 'check_in_logged',
  valueDetailOpened: 'value_detail_opened',
  reminderToggled: 'reminder_toggled',
  cardsReordered: 'cards_reordered',
} as const;
