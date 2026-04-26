import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STEPS, type StepKey } from '../theme/steps';
import { todayISO } from '../util/dates';

export type Screen = 'landing' | 'step' | 'summary' | 'home';

export type WashConfig = {
  colors: readonly string[];
  origin: { x: number; y: number };
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: readonly number[];
};

export type State = {
  // Persisted
  answers: Partial<Record<StepKey, string>>;
  checkIns: Partial<Record<StepKey, Record<string, true>>>;
  history: Partial<Record<StepKey, number[]>>;
  reminders: Partial<Record<StepKey, boolean>>;
  order: StepKey[];
  hasOnboarded: boolean;
  // Transient (not persisted)
  _hydrated: boolean;
};

export type Actions = {
  setAnswer: (key: StepKey, value: string) => void;
  toggleDay: (key: StepKey, iso: string) => void;
  logToday: (key: StepKey) => void;
  setReminder: (key: StepKey, value: boolean) => void;
  setOrder: (order: StepKey[]) => void;
  finishOnboarding: () => void;
  resetAll: () => void;
};

const defaultOrder: StepKey[] = STEPS.map((s) => s.key);

const defaultHistory: Record<StepKey, number[]> = {
  why: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  energy: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  strength: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  'north-star': [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  growth: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  freedom: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  bonus: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      answers: {},
      checkIns: {},
      history: defaultHistory,
      reminders: {},
      order: defaultOrder,
      hasOnboarded: false,
      _hydrated: false,

      setAnswer: (key, value) =>
        set((s) => ({ answers: { ...s.answers, [key]: value } })),

      toggleDay: (key, iso) =>
        set((s) => {
          const next = { ...(s.checkIns[key] ?? {}) };
          if (next[iso]) delete next[iso];
          else next[iso] = true;
          return { checkIns: { ...s.checkIns, [key]: next } };
        }),

      logToday: (key) => {
        const iso = todayISO();
        const existing = get().checkIns[key]?.[iso];
        if (!existing) get().toggleDay(key, iso);
      },

      setReminder: (key, value) =>
        set((s) => ({ reminders: { ...s.reminders, [key]: value } })),

      setOrder: (order) => set({ order }),

      finishOnboarding: () => set({ hasOnboarded: true }),

      resetAll: () =>
        set({
          answers: {},
          checkIns: {},
          history: defaultHistory,
          reminders: {},
          order: defaultOrder,
          hasOnboarded: false,
        }),
    }),
    {
      name: 'ladder-app-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        answers: s.answers,
        checkIns: s.checkIns,
        history: s.history,
        reminders: s.reminders,
        order: s.order,
        hasOnboarded: s.hasOnboarded,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    },
  ),
);
