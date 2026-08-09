export type CardType = 'CHARACTER' | 'TRACK' | 'RUNE' | 'EVENT' | 'EDIT';

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'RAIDO';

export type RightsStatus = 'owned' | 'licensed' | 'placeholder' | 'blocked';

export type ResonanceTier = 0 | 1 | 2 | 3 | 4 | 5;

export type EffectTrigger =
  | 'ON_PLAY'
  | 'ON_DEATH'
  | 'ON_ATTACK'
  | 'ON_DAMAGE'
  | 'TURN_START'
  | 'TURN_END'
  | 'ON_TRACK_PLAYED';

export type EffectTargetSelector =
  | 'SELF'
  | 'TRIGGER_SOURCE'
  | 'FRIENDLY_RANDOM'
  | 'FRIENDLY_ALL'
  | 'FRIENDLY_CHOSEN'
  | 'ENEMY_RANDOM'
  | 'ENEMY_ALL'
  | 'ENEMY_CHOSEN'
  | 'FRIENDLY_CONDUCTOR'
  | 'ENEMY_CONDUCTOR';

export type EffectConditionType =
  | 'RESONANCE_TIER_AT_LEAST'
  | 'HAS_TAG_ON_BOARD'
  | 'IS_FIRST_CARD_THIS_TURN'
  | 'ONCE_PER_TURN'
  | 'TARGET_HAS_TAG'
  | 'ALWAYS';

export interface EffectCondition {
  type: EffectConditionType;
  value?: number | string;
}

export type EffectActionType =
  | 'DAMAGE'
  | 'HEAL'
  | 'BUFF'
  | 'DEBUFF'
  | 'DRAW'
  | 'SHIELD'
  | 'SUMMON'
  | 'DESTROY'
  | 'COST_MODIFIER'
  | 'SILENCE'
  | 'GAIN_ENERGY'
  | 'ADD_STATUS';

export type StatusType = 'SHIELD' | 'IMPULSE' | 'HIDDEN' | 'CURSE' | 'SILENCED';

export interface EffectAction {
  type: EffectActionType;
  target?: EffectTargetSelector;
  attack?: number;
  health?: number;
  amount?: number;
  status?: StatusType;
  duration?: 'END_OF_TURN' | 'PERMANENT' | number;
  summonCardSlug?: string;
  /** Restricts ALL/RANDOM target selectors (and COST_MODIFIER) to units/cards carrying this tag. */
  tagFilter?: string;
}

export interface EffectDefinition {
  trigger: EffectTrigger;
  conditions?: EffectCondition[];
  effects: EffectAction[];
}

export interface CardBase {
  id: string;
  slug: string;
  name: string;
  type: CardType;
  rarity: Rarity;
  cost: number;
  tags: string[];
  artworkUrl: string;
  abilityText?: string;
  effects: EffectDefinition[];
  linkedTrackIds: string[];
  boostProfileId?: string;
  rightsStatus: RightsStatus;
  rightsNote?: string;
  source?: string;
  licenseExpiresAt?: string;
  isPlayable: boolean;
  active: boolean;
  isToken: boolean;
  resonanceTier: ResonanceTier;
}

export interface CharacterCard extends CardBase {
  type: 'CHARACTER';
  universe?: string;
  attack: number;
  health: number;
  voiceStingerUrl?: string;
}

export interface TrackCard extends CardBase {
  type: 'TRACK';
  coverUrl: string;
  audioPreviewUrl?: string;
  releaseUrl?: string;
  releaseDate?: string;
}

export interface RuneCard extends CardBase {
  type: 'RUNE';
}

export interface EventCard extends CardBase {
  type: 'EVENT';
}

export interface EditCard extends CardBase {
  type: 'EDIT';
  videoUrl?: string;
}

export type Card = CharacterCard | TrackCard | RuneCard | EventCard | EditCard;

export function deckLimitForRarity(rarity: Rarity): number {
  return rarity === 'LEGENDARY' || rarity === 'RAIDO' ? 1 : 2;
}
