import type { Card, EffectAction, StatusType } from './types/card.js';

export interface ResonanceTierExplanation {
  tier: number;
  descriptions: string[];
}

export interface CardResonanceExplanation {
  /** False if the card has no RESONANCE_TIER_AT_LEAST condition anywhere - Resonance is purely visual for it. */
  isReactive: boolean;
  /** Ascending by tier. Empty when isReactive is false. */
  tiers: ResonanceTierExplanation[];
}

const STATUS_LABEL: Record<StatusType, string> = {
  SHIELD: 'Щит',
  IMPULSE: 'Импульс',
  HIDDEN: 'Скрытый',
  CURSE: 'Проклятие',
  SILENCED: 'Заглушение',
};

/** Turns one DSL action into a short human phrase. Keyed on EffectActionType only - never on cardId. */
function describeAction(action: EffectAction): string {
  switch (action.type) {
    case 'DAMAGE':
      return `${action.amount ?? 0} урона`;
    case 'HEAL':
      return `лечение ${action.amount ?? 0}`;
    case 'BUFF':
      return `+${action.attack ?? 0}/+${action.health ?? 0}`;
    case 'DEBUFF':
      return `−${action.attack ?? 0}/−${action.health ?? 0}`;
    case 'DRAW':
      return `добор ${action.amount ?? 1} карт(ы)`;
    case 'SHIELD':
      return 'Щит';
    case 'SUMMON':
      return 'призыв существа';
    case 'DESTROY':
      return 'уничтожение цели';
    case 'COST_MODIFIER':
      return 'скидка на стоимость карты';
    case 'SILENCE':
      return 'Заглушение';
    case 'GAIN_ENERGY':
      return `+${action.amount ?? 0} Энергии`;
    case 'ADD_STATUS':
      return action.status ? STATUS_LABEL[action.status] : 'дополнительный статус';
    case 'CLEANSE':
      return 'снятие Проклятия/Заглушения';
    case 'REVIVE_FROM_DISCARD':
      return 'возвращение существа из сброса';
    case 'REORDER_TOP':
      return 'просмотр и перестановка карт колоды';
    case 'REPEAT_LAST_TRACK':
      return 'повтор эффекта последнего Трека';
    case 'CHOOSE_ONE': {
      const parts: string[] = [];
      for (const inner of action.ifFriendlyTarget ?? []) parts.push(describeAction(inner));
      for (const inner of action.ifEnemyTarget ?? []) parts.push(describeAction(inner));
      return parts.length > 0 ? `выбор: ${parts.join(' или ')}` : 'дополнительный выбор эффекта';
    }
    default:
      return 'дополнительный эффект';
  }
}

/**
 * True if any of the card's own effect definitions carry a `RESONANCE_TIER_AT_LEAST`
 * condition - i.e. its ability actually changes at some Resonance tier. Purely a DSL scan,
 * never a slug/id/name list, so it stays correct for any card in any future content pack.
 * The single source of truth for "is this card Resonance-reactive" - `explainCardResonance`
 * below reuses the same scan for its `isReactive` field.
 */
export function cardUsesResonance(card: Card): boolean {
  return card.effects.some((def) => def.conditions?.some((c) => c.type === 'RESONANCE_TIER_AT_LEAST'));
}

/**
 * Derives a per-Tier explanation of what changes on a card's ability, purely
 * from its own DSL (`RESONANCE_TIER_AT_LEAST` conditions). No cardId-specific
 * branching - works unmodified for any card in any future content pack.
 */
export function explainCardResonance(card: Card): CardResonanceExplanation {
  const byTier = new Map<number, string[]>();

  for (const def of card.effects) {
    const tierCondition = def.conditions?.find((c) => c.type === 'RESONANCE_TIER_AT_LEAST');
    if (!tierCondition || typeof tierCondition.value !== 'number') continue;

    const tier = tierCondition.value;
    const descriptions = byTier.get(tier) ?? [];
    for (const action of def.effects) descriptions.push(describeAction(action));
    byTier.set(tier, descriptions);
  }

  const tiers = Array.from(byTier.entries())
    .sort(([a], [b]) => a - b)
    .map(([tier, descriptions]) => ({ tier, descriptions }));

  return { isReactive: tiers.length > 0, tiers };
}
