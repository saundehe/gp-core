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
      // Array.isArray guards a truthy non-array (parts:{}), and filter(Boolean) drops
    // the nulls normalizePart returns for corrupt/falsy slots - otherwise a stored
    // {parts:[valid, null]} survives and every consumer doing parts.map(p => p.notes)
    // throws on null. Mirrors part.js, and the guard already applied to setlist
    // entries, rig cues, clock cues and showfile sections.
    parts: (Array.isArray(raw.parts) ? raw.parts : []).map(p => normalizePart(p, ctx)).filter(Boolean),
    };
  }

  return {
    _v: 1,
    id: uid(),
    name: raw.name ?? '',
    source: raw.source ?? null,
    // Array.isArray guards a truthy non-array (parts:{}), and filter(Boolean) drops
    // the nulls normalizePart returns for corrupt/falsy slots - otherwise a stored
    // {parts:[valid, null]} survives and every consumer doing parts.map(p => p.notes)
    // throws on null. Mirrors part.js, and the guard already applied to setlist
    // entries, rig cues, clock cues and showfile sections.
    parts: (Array.isArray(raw.parts) ? raw.parts : []).map(p => normalizePart(p, ctx)).filter(Boolean),
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
