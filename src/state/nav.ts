import { create } from 'zustand';
import type { StepKey } from '../theme/steps';

export type Screen = 'landing' | 'step' | 'summary' | 'home';

export type WashColor =
  | string
  | {
      colors: readonly string[];
      locations?: readonly number[];
      start?: { x: number; y: number };
      end?: { x: number; y: number };
    };

export type Wash = {
  color: WashColor;
  origin: { x: number; y: number }; // 0..1 in screen coordinates
} | null;

type NavState = {
  screen: Screen;
  stepIdx: number;
  detailKey: StepKey | null;
  menuKey: StepKey | null;
  wash: Wash;
};

type NavActions = {
  setScreen: (s: Screen) => void;
  setStepIdx: (i: number) => void;
  openDetail: (key: StepKey | null) => void;
  openMenu: (key: StepKey | null) => void;
  setWash: (w: Wash) => void;
  reset: () => void;
};

export const useNav = create<NavState & NavActions>((set) => ({
  screen: 'landing',
  stepIdx: 0,
  detailKey: null,
  menuKey: null,
  wash: null,
  setScreen: (screen) => set({ screen }),
  setStepIdx: (stepIdx) => set({ stepIdx }),
  openDetail: (detailKey) => set({ detailKey }),
  openMenu: (menuKey) => set({ menuKey }),
  setWash: (wash) => set({ wash }),
  reset: () => set({ screen: 'landing', stepIdx: 0, detailKey: null, menuKey: null, wash: null }),
}));
