import { normalizePart } from './part.js';

let _c = 0;
function uid() { return (++_c).toString(36) + Math.random().toString(36).slice(2, 6); }

/**
 * A PartSet groups all Parts that belong together (e.g. all voices from one Conjure generation).
 * source records where it came from ('conjure', 'riffwork', 'user', etc.)
 */
export function createPartSet(props = {}) {
  return {
    _v: 1,
    id: uid(),
    name: '',
    source: null,
    parts: [],
    ...props,
  };
}

/** Idempotent upgrade. Normalizes all nested Parts. */
export function normalizePartSet(raw, ctx = {}) {
  if (!raw) return null;

  if (raw._v >= 1) {
    return {
      ...raw,
      parts: (raw.parts || []).map(p => normalizePart(p, ctx)),
    };
  }

  return {
    _v: 1,
    id: uid(),
    name: raw.name ?? '',
    source: raw.source ?? null,
    parts: (raw.parts || []).map(p => normalizePart(p, ctx)),
  };
}

/**
 * Build a PartSet from Conjure's jam object.
 * @param {object} jam - Conjure's `jam` object keyed by voice name (bass/lead/arp/chords/drums)
 * @param {object} ctx - { rootIndex, scaleName, tempo, bars }
 */
export function conjureJamToPartSet(jam, ctx = {}) {
  const parts = Object.entries(jam).map(([type, notes]) => {
    return normalizePart({ type, _notes: notes }, ctx);
  });
  return createPartSet({ source: 'conjure', parts });
}
