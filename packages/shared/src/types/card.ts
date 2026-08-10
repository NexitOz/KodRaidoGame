export type CardType = 'CHARACTER' | 'TRACK' | 'RUNE' | 'EVENT' | 'EDIT';

export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'RAIDO';

export type RightsStatus = 'owned' | 'licensed' | 'placeholder' | 'blocked';

export type ResonanceTier = 0 | 1 | 2 | 3 | 4 | 5;

export type EffectTrigger =
  | 'ON_PLAY'
  | 'ON_DEATH'
  | 'ON_ATTACK'
  | 'ON_DAMAGE'
  | 'ON_HEAL'
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
  | 'ONCE_PER_MATCH'
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
  | 'ADD_STATUS'
  | 'CLEANSE'
  | 'REVIVE_FROM_DISCARD'
  | 'REORDER_TOP'
  | 'REPEAT_LAST_TRACK'
  | 'CHOOSE_ONE';

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
  /**
   * Percentage scale applied by REVIVE_FROM_DISCARD (stat scaling, default 100) and
   * REPEAT_LAST_TRACK (effect magnitude scaling, default 50). Rounding is always
   * `Math.floor`, deterministically - a scaled amount may round down to 0 (no-op).
   */
  percent?: number;
  /** REORDER_TOP: which end of the deck the found card is moved to. Defaults to 'TOP'. */
  destination?: 'TOP' | 'BOTTOM';
  /** CHOOSE_ONE: branch executed when the resolved explicit target is the caster's own (conductor or unit). */
  ifFriendlyTarget?: EffectAction[];
  /** CHOOSE_ONE: branch executed when the resolved explicit target belongs to the opponent. */
  ifEnemyTarget?: EffectAction[];
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
  /** Mechanical faction id: 'NEUTRAL' or one of the six Content Pack 01 test factions. */
  faction: string;
  /** In-world house/order name(s) flavoring the faction. May be empty for neutral cards. */
  subFactions: string[];
  /** Mechanical archetype tags used for filtering/deckbuilding (e.g. "Summon", "DeathTrigger"). */
  archetypeTags: string[];
  isNeutral: boolean;
  /** Whether this card may be included in any faction's deck regardless of its own faction. */
  isCrossoverEligible: boolean;
  /**
   * Dev/reference-only content, gated by REFERENCE_CONTENT_ENABLED. Never seeded to
   * production, granted to users, exposed via the cards API, or shown in a collection
   * unless the flag is on. Content Pack 01's cards are all original IP and always false.
   */
  isReferenceContent: boolean;
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
