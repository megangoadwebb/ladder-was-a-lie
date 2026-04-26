import { ensureSession, supabase, supabaseEnabled } from './supabase';
import { useStore, type State } from './store';
import type { StepKey } from '../theme/steps';
import { identifyUser } from '../util/analytics';

type RemoteRow = {
  user_id: string;
  answers: State['answers'];
  check_ins: State['checkIns'];
  history: State['history'];
  reminders: State['reminders'];
  card_order: StepKey[];
  has_onboarded: boolean;
  updated_at: string;
};

const SYNC_DEBOUNCE_MS = 600;

let userId: string | null = null;
let unsubscribeFromStore: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushedJSON: string | null = null;

function snapshot(s: State) {
  return {
    answers: s.answers,
    check_ins: s.checkIns,
    history: s.history,
    reminders: s.reminders,
    card_order: s.order,
    has_onboarded: s.hasOnboarded,
  };
}

async function pushNow() {
  if (!userId) return;
  const s = useStore.getState();
  const payload = { user_id: userId, ...snapshot(s) };
  const serialized = JSON.stringify(payload);
  if (serialized === lastPushedJSON) return;
  // eslint-disable-next-line no-console
  console.log('[sync] pushing', { user_id: userId, bytes: serialized.length });
  const { error } = await supabase.from('user_state').upsert(payload, {
    onConflict: 'user_id',
  });
  if (error) {
    // eslint-disable-next-line no-console
    console.error('[sync] push failed:', error);
    return;
  }
  // eslint-disable-next-line no-console
  console.log('[sync] push ok');
  lastPushedJSON = serialized;
}

function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void pushNow();
  }, SYNC_DEBOUNCE_MS);
}

// Pull from Supabase. If a remote row exists, replace the local store with it.
// If not, write the current local state up (covers the very-first launch).
async function pullAndAdopt(): Promise<void> {
  if (!userId) return;
  // eslint-disable-next-line no-console
  console.log('[sync] pulling user_state for', userId);
  const { data, error } = await supabase
    .from('user_state')
    .select('answers, check_ins, history, reminders, card_order, has_onboarded, updated_at')
    .eq('user_id', userId)
    .maybeSingle<Omit<RemoteRow, 'user_id'>>();

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[sync] pull failed:', error);
    return;
  }

  if (!data) {
    // eslint-disable-next-line no-console
    console.log('[sync] no remote row, pushing local state up');
    // Brand new user: push current local state up so we have a row.
    await pushNow();
    return;
  }
  // eslint-disable-next-line no-console
  console.log('[sync] pulled remote row, adopting');

  // Hydrate the local store with the remote row, then mark
  // it as the last-known-pushed state so we don't bounce it back immediately.
  useStore.setState({
    answers: data.answers ?? {},
    checkIns: data.check_ins ?? {},
    history: data.history ?? {},
    reminders: data.reminders ?? {},
    order: (data.card_order ?? []).length
      ? (data.card_order as StepKey[])
      : useStore.getState().order,
    hasOnboarded: !!data.has_onboarded,
  });
  lastPushedJSON = JSON.stringify({ user_id: userId, ...snapshot(useStore.getState()) });
}

export async function startSync(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[sync] startSync called, supabaseEnabled =', supabaseEnabled);
  if (!supabaseEnabled) return;
  const session = await ensureSession();
  if (!session) {
    // eslint-disable-next-line no-console
    console.error('[sync] no session — anonymous sign-in failed');
    return;
  }
  userId = session.user.id;
  // eslint-disable-next-line no-console
  console.log('[sync] session established, user_id =', userId);
  identifyUser(userId);
  // Expose supabase to the window for live debugging.
  if (typeof window !== 'undefined') {
    (window as unknown as { supabase: typeof supabase }).supabase = supabase;
  }

  await pullAndAdopt();

  // Subscribe to store changes and debounce-push them to Supabase.
  if (unsubscribeFromStore) unsubscribeFromStore();
  unsubscribeFromStore = useStore.subscribe(() => schedulePush());
}

export function stopSync(): void {
  if (unsubscribeFromStore) unsubscribeFromStore();
  unsubscribeFromStore = null;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
}
