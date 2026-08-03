import { DEFAULT_PPQ, normalizeNote } from './note.js';

let _c = 0;
function uid() { return (++_c).toString(36) + Math.random().toString(36).slice(2, 6); }

export const PART_KINDS = Object.freeze({
  melodic:   'melodic',   // single-note line (lead, arp)
  bass:      'bass',      // bass line
  chord:     'chord',     // chord voicings (simultaneous notes share onset)
  rhythmic:  'rhythmic',  // drums / percussion (pitch = MIDI drum map)
});

// Canonical scale names (snake_case). Conjure names map via SCALE_NAME_MAP.
export const SCALE_NAMES = Object.freeze({
  major:          'major',
  natural_minor:  'natural_minor',
  dorian:         'dorian',
  phrygian:       'phrygian',
  lydian:         'lydian',
  mixolydian:     'mixolydian',
  locrian:        'locrian',
  harmonic_minor: 'harmonic_minor',
  pentatonic:     'pentatonic',
  blues:          'blues',
});

// Maps Conjure's display scale names → canonical SCALE_NAMES values
export const SCALE_NAME_MAP = {
  'Natural Minor':     SCALE_NAMES.natural_minor,
  'Major':             SCALE_NAMES.major,
  'Dorian':            SCALE_NAMES.dorian,
  'Phrygian':          SCALE_NAMES.phrygian,
  'Lydian':            SCALE_NAMES.lydian,
  'Mixolydian':        SCALE_NAMES.mixolydian,
  'Harmonic Minor':    SCALE_NAMES.harmonic_minor,
  'Pentatonic Minor':  SCALE_NAMES.pentatonic,
  'Blues':             SCALE_NAMES.blues,
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Create a Part — one musical voice (lead line, bass, chords, or drum pattern).
 *
 * @param {object} props
 * @param {'melodic'|'bass'|'chord'|'rhythmic'} [props.kind='melodic']
 * @param {number} [props.tempo=120] BPM
 * @param {string} [props.key='C'] root note name
 * @param {string} [props.scale='natural_minor'] from SCALE_NAMES
 * @param {[number,number]} [props.timeSignature=[4,4]]
 * @param {number} [props.bars=4]
 * @param {number} [props.ppq=DEFAULT_PPQ] ticks per quarter note
 * @param {object[]} [props.notes=[]]
 */
export function createPart(props = {}) {
  return {
    _v: 1,
    id: uid(),
    name: '',
    kind: PART_KINDS.melodic,
    tempo: 120,
    key: 'C',
    scale: SCALE_NAMES.natural_minor,
    timeSignature: [4, 4],
    bars: 4,
    ppq: DEFAULT_PPQ,
    notes: [],
    ...props,
  };
}

/**
 * Idempotent normalization.
 * Accepts Conjure's raw layer object { type, _notes, ... } or an already-normalized Part.
 *
 * @param {object} raw
 * @param {object} [ctx] extra context when converting from Conjure format
 * @param {number} [ctx.rootIndex] 0-11 key root (Conjure's `root` var)
 * @param {string} [ctx.scaleName] Conjure display scale name
 * @param {number} [ctx.tempo] BPM
 * @param {number} [ctx.bars] bar count
 */
export function normalizePart(raw, ctx = {}) {
  if (!raw) return null;

  if (raw._v >= 1) {
    // Already normalized — return a copy, normalizing any legacy notes.
    // Guard non-array `notes` (a hand-edited/truncated shared Part link can
    // decode to a non-array truthy value) and filter out nulls: normalizeNote
    // returns null for a falsy entry, and every other collection normalizer
    // in this repo drops corrupt slots (P2-1 pattern) instead of keeping them
    // — an un-filtered null poisons any consumer that reads `.pitch` off it.
    return {
      ...raw,
      notes: (Array.isArray(raw.notes) ? raw.notes : []).map(normalizeNote).filter(Boolean),
    };
  }

  // Convert from Conjure layer format { type, _notes }
  const kindMap = {
    lead: PART_KINDS.melodic,
    arp:  PART_KINDS.melodic,
    bass: PART_KINDS.bass,
    chords: PART_KINDS.chord,
    percussion: PART_KINDS.rhythmic,
    // conjureJamToPartSet's jam object keys the drum layer 'drums', not 'percussion',
    // so the lookup missed and drum layers fell through to melodic - MIDI 36/38/42
    // rendered as note names on a pitched staff instead of Kick/Snare/Hi-Hat.
    drums: PART_KINDS.rhythmic,
  };

  const rootIndex = ctx.rootIndex ?? 0;
  // Prefer the raw part's own fields over ctx/defaults: this branch also
  // catches a legacy (pre-_v) Part that already carries tempo/key/scale/bars/
  // ppq/timeSignature, and sourcing those from ctx/defaults destroyed them —
  // a ppq mismatch alone reinterprets every note's tick timing (e.g. a ppq:96
  // part forced to DEFAULT_PPQ plays 24x wrong). Conjure layers carry none of
  // these fields, so that path is unaffected.
  const key = raw.key ?? NOTE_NAMES[rootIndex % 12] ?? 'C';
  const scale = raw.scale ?? SCALE_NAME_MAP[ctx.scaleName] ?? SCALE_NAMES.natural_minor;

  return {
    _v: 1,
    id: raw.id ?? uid(),   // preserve an existing identity rather than minting an orphan
    name: raw.name ?? raw.type ?? '',
    kind: kindMap[raw.type] ?? PART_KINDS.melodic,
    tempo: raw.tempo ?? ctx.tempo ?? 120,
    key,
    scale,
    timeSignature: Array.isArray(raw.timeSignature) ? raw.timeSignature : [4, 4],
    bars: raw.bars ?? ctx.bars ?? 4,
    ppq: raw.ppq ?? DEFAULT_PPQ,
    notes: (Array.isArray(raw._notes) ? raw._notes : (Array.isArray(raw.notes) ? raw.notes : []))
      .map(normalizeNote)
      .filter(Boolean),
  };
}
