import type { StepKey } from '../theme/steps';

const FIRST_PERSON_STARTS = /^(i\s|i'm|i’m|im\s|my |our |we |we'?re |we’re )/i;
const CONNECTOR_STARTS = /^(because|cause|cuz|since|when|whenever|if|after|before|while)\b/i;
const TO_INFINITIVE = /^to\s+/i;
const VERB_ING = /^[a-z]+ing\b/i;
const COMMON_VERBS =
  /^(make|build|create|tell|help|love|teach|listen|hold|keep|find|grow|wander|write|read|run|walk|sit|rest|paint|sing|cook|raise|parent|garden|move|breathe|connect|lead|serve|fight|protect|notice|see|think|learn|try|give|share|show|push|sit)\b/i;

type Shape = 'empty' | 'iclause' | 'connector' | 'infinitive' | 'gerund' | 'verb' | 'noun';

function shapeOf(raw: string): Shape {
  const a = (raw || '').trim();
  if (!a) return 'empty';
  if (FIRST_PERSON_STARTS.test(a)) return 'iclause';
  if (CONNECTOR_STARTS.test(a)) return 'connector';
  if (TO_INFINITIVE.test(a)) return 'infinitive';
  if (VERB_ING.test(a)) return 'gerund';
  if (COMMON_VERBS.test(a)) return 'verb';
  return 'noun';
}

function normalizeAnswer(raw: string): string {
  const a = (raw || '').trim();
  if (!a) return a;
  const looksLikeName = /^[A-Z][a-z]+$/.test(a) && a.length <= 16;
  if (looksLikeName) return a;
  return a.charAt(0).toLowerCase() + a.slice(1);
}

export type SentenceParts = { pre: string; em: string; post: string };

type Builder = (a: string) => SentenceParts;
type ShapeMap = Partial<Record<Shape, Builder>> & { noun: Builder };

const TEMPLATES: Record<StepKey, ShapeMap> = {
  why: {
    iclause: (a) => ({ pre: '', em: a, post: ' — that’s why I’m here.' }),
    connector: (a) => ({ pre: 'I’m here ', em: a, post: '.' }),
    infinitive: (a) => ({ pre: 'I came here ', em: a, post: '.' }),
    gerund: (a) => ({ pre: 'I’m here for the ', em: a, post: '.' }),
    verb: (a) => ({ pre: 'I came here to ', em: a, post: '.' }),
    noun: (a) => ({ pre: 'My passion started with ', em: a, post: '.' }),
  },
  energy: {
    iclause: (a) => ({ pre: 'I come alive when ', em: a, post: '.' }),
    connector: (a) => ({ pre: 'I come alive ', em: a, post: '.' }),
    infinitive: (a) => ({ pre: 'I come alive ', em: a, post: '.' }),
    gerund: (a) => ({ pre: 'I come alive ', em: a, post: '.' }),
    verb: (a) => ({ pre: 'I come alive when I ', em: a, post: '.' }),
    noun: (a) => ({ pre: 'My energy sparks with ', em: a, post: '.' }),
  },
  strength: {
    iclause: (a) => ({ pre: '', em: a, post: ' — that’s a gift.' }),
    connector: (a) => ({ pre: 'It comes easy ', em: a, post: '.' }),
    infinitive: (a) => ({ pre: 'It comes easy ', em: a, post: '.' }),
    gerund: (a) => ({ pre: 'I’m good at ', em: a, post: '.' }),
    verb: (a) => ({ pre: 'I can ', em: a, post: '.' }),
    noun: (a) => ({ pre: 'My strength is ', em: a, post: '.' }),
  },
  'north-star': {
    iclause: (a) => ({ pre: 'Even if no one were watching, ', em: a, post: '.' }),
    connector: (a) => ({ pre: 'I’d still want to be here ', em: a, post: '.' }),
    infinitive: (a) => ({
      pre: 'Even if no one were watching, I’d still want ',
      em: a,
      post: '.',
    }),
    gerund: (a) => ({ pre: 'I want to be known for ', em: a, post: '.' }),
    verb: (a) => ({ pre: 'I want to be the one who can ', em: a, post: '.' }),
    noun: (a) => ({ pre: 'I want to be known for my ', em: a, post: '.' }),
  },
  growth: {
    iclause: (a) => ({ pre: '', em: a, post: ' — that’s where I’m headed.' }),
    connector: (a) => ({ pre: 'I’m growing ', em: a, post: '.' }),
    infinitive: (a) => ({ pre: 'I’m growing ', em: a, post: '.' }),
    gerund: (a) => ({ pre: 'I’m growing into ', em: a, post: '.' }),
    verb: (a) => ({ pre: 'I want to ', em: a, post: ' more.' }),
    noun: (a) => ({ pre: 'I’m growing in ', em: a, post: '.' }),
  },
  freedom: {
    iclause: (a) => ({ pre: 'Given an empty afternoon, ', em: a, post: '.' }),
    connector: (a) => ({ pre: 'Given an empty afternoon, ', em: a, post: '.' }),
    infinitive: (a) => ({ pre: 'Given an empty afternoon, I’d want ', em: a, post: '.' }),
    gerund: (a) => ({ pre: 'On a free afternoon: ', em: a, post: '.' }),
    verb: (a) => ({ pre: 'Given an empty afternoon, I’d ', em: a, post: '.' }),
    noun: (a) => ({ pre: 'My version of fun is ', em: a, post: '.' }),
  },
  bonus: {
    iclause: (a) => ({ pre: '', em: a, post: '.' }),
    connector: (a) => ({ pre: '', em: a, post: '.' }),
    infinitive: (a) => ({ pre: 'In a word: ', em: a, post: '.' }),
    gerund: (a) => ({ pre: 'In a word: ', em: a, post: '.' }),
    verb: (a) => ({ pre: 'In a word: ', em: a, post: '.' }),
    noun: (a) => ({ pre: 'To complete my brand… ', em: a, post: '.' }),
  },
};

export function buildSentence(stepKey: StepKey, raw: string): SentenceParts {
  const shape = shapeOf(raw);
  const a = normalizeAnswer(raw);
  if (shape === 'empty') return { pre: '', em: '', post: '' };
  const tpl = TEMPLATES[stepKey];
  const fn = tpl[shape] ?? tpl.noun;
  return fn(a);
}
