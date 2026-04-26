export type StepKey =
  | 'why'
  | 'energy'
  | 'strength'
  | 'north-star'
  | 'growth'
  | 'freedom'
  | 'bonus';

type GradientPoint = { x: number; y: number };

export type StepGradient = {
  colors: [string, string, string];
  locations: [number, number, number];
  start: GradientPoint;
  end: GradientPoint;
};

export type Step = {
  key: StepKey;
  num: string;
  label: string;
  prompt: string;
  helper: string;
  placeholder: string;
  gradient: StepGradient;
  ink: string;
  soft: string;
  accent: string;
  emphasis: string;
  chips: string[];
  glyph: string;
};

const grad165 = (
  colors: [string, string, string],
  locations: [number, number, number],
): StepGradient => ({
  colors,
  locations,
  start: { x: 0.21, y: 0 },
  end: { x: 0.79, y: 1 },
});

export const STEPS: Step[] = [
  {
    key: 'why',
    num: '01',
    label: 'WHY',
    prompt: 'What drew you here in the first place?',
    helper: 'Before titles… what pulled you in?',
    placeholder: 'what pulled you in?',
    gradient: grad165(['#FFB15C', '#FF7A59', '#F05E4A'], [0, 0.55, 1]),
    ink: '#2A1403',
    soft: 'rgba(42, 20, 3, 0.55)',
    accent: '#FFE8C7',
    emphasis: '#F05E4A',
    chips: ['curiosity', 'restlessness', 'love', 'duty', 'anger', 'wonder', 'a nudge', 'survival'],
    glyph: '✷',
  },
  {
    key: 'energy',
    num: '02',
    label: 'ENERGY',
    prompt: 'What kind of work gives you energy?',
    helper: 'What leaves you feeling better after?',
    placeholder: 'what kind of work gives you energy?',
    gradient: grad165(['#FF7FA2', '#F04E74', '#D23257'], [0, 0.5, 1]),
    ink: '#2A0512',
    soft: 'rgba(42, 5, 18, 0.55)',
    accent: '#FFD9E3',
    emphasis: '#D23257',
    chips: ['building', 'teaching', 'listening', 'solving', 'making', 'moving', 'writing', 'leading'],
    glyph: '⚡',
  },
  {
    key: 'strength',
    num: '03',
    label: 'STRENGTH',
    prompt: 'What do you naturally do well?',
    helper: 'What do people come to you for?',
    placeholder: 'what do people come to you for?',
    gradient: grad165(['#7EE0D6', '#39C0C3', '#1E94A8'], [0, 0.5, 1]),
    ink: '#01282A',
    soft: 'rgba(1, 40, 42, 0.55)',
    accent: '#D6FAF5',
    emphasis: '#1E94A8',
    chips: [
      'patience',
      'seeing patterns',
      'holding space',
      'starting things',
      'finishing',
      'simplifying',
      'pushing back',
      'showing up',
    ],
    glyph: '◈',
  },
  {
    key: 'north-star',
    num: '04',
    label: 'NORTH STAR',
    prompt: 'What do you want to be known for?',
    helper: 'Long after your title is gone…',
    placeholder: 'what do you want to be known for?',
    gradient: grad165(['#FFE066', '#FFC940', '#F5A623'], [0, 0.55, 1]),
    ink: '#2B1D00',
    soft: 'rgba(43, 29, 0, 0.55)',
    accent: '#FFF4C2',
    emphasis: '#C79200',
    chips: [
      'make things',
      'help people',
      'learn',
      'wander',
      'parent',
      'tell stories',
      'tend a garden',
      'ask questions',
    ],
    glyph: '★',
  },
  {
    key: 'growth',
    num: '05',
    label: 'GROWTH',
    prompt: 'Where are you choosing to grow next?',
    helper: 'Not where you should—where you want to',
    placeholder: "what's your next challenge",
    gradient: grad165(['#D7EA5F', '#B5DA3C', '#83B52A'], [0, 0.5, 1]),
    ink: '#162800',
    soft: 'rgba(22, 40, 0, 0.55)',
    accent: '#F0F9C9',
    emphasis: '#6B9820',
    chips: ['braver', 'slower', 'softer', 'sharper', 'honest', 'rooted', 'open', 'free'],
    glyph: '↑',
  },
  {
    key: 'freedom',
    num: '06',
    label: 'TIME',
    prompt: 'How do you choose to spend your time?',
    helper: "When no one's telling you what to do…",
    placeholder: 'how do you spend YOUR time?',
    gradient: grad165(['#9FD0EA', '#63B0D8', '#3B8AB8'], [0, 0.5, 1]),
    ink: '#031E2E',
    soft: 'rgba(3, 30, 46, 0.55)',
    accent: '#DBEEF9',
    emphasis: '#3B8AB8',
    chips: [
      'my kids',
      'my partner',
      'old friends',
      'my parents',
      'myself',
      'strangers',
      'nature',
      'silence',
    ],
    glyph: '◐',
  },
  {
    key: 'bonus',
    num: '07',
    label: 'COMPLETE',
    prompt: "What's missing that aligns with your brand?",
    helper: 'What word would complete your brand?',
    placeholder: 'complete your brand',
    gradient: grad165(['#E4B8F5', '#C77DE8', '#9A4CCA'], [0, 0.5, 1]),
    ink: '#1F002E',
    soft: 'rgba(31, 0, 46, 0.55)',
    accent: '#F4E1FB',
    emphasis: '#9A4CCA',
    chips: [
      'less noise',
      'a real break',
      'one hard conversation',
      'a new craft',
      'fewer goals',
      'a trip',
      'a fresh start',
      'nothing at all',
    ],
    glyph: '✦',
  },
];

export const STEP_BY_KEY: Record<StepKey, Step> = STEPS.reduce(
  (acc, s) => {
    acc[s.key] = s;
    return acc;
  },
  {} as Record<StepKey, Step>,
);

export const LANDING = {
  bg: '#0E0C0A',
  ink: '#F5F1EA',
  accent: {
    colors: ['#FF8B5C', '#F04E74', '#C77DE8', '#63B0D8', '#FFC940'] as const,
    locations: [0, 0.25, 0.5, 0.75, 1] as const,
  },
};

export const HOME = {
  bg: '#0B0A09',
  ink: '#F5F1EA',
  soft: 'rgba(245, 241, 234, 0.55)',
};

export const SUMMARY = {
  bg: '#F5F1EA',
  ink: '#1A1816',
};

export const SPECTRUM = [
  '#FF8B5C',
  '#F04E74',
  '#7EE0D6',
  '#FFC940',
  '#B5DA3C',
  '#63B0D8',
  '#C77DE8',
];
