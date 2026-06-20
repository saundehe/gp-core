import { SCALE_INTERVALS } from './intervals.js';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ENHARMONICS = { Db: 1, Eb: 3, Gb: 6, Ab: 8, Bb: 10 };

/**
 * Parse a root string ('C', 'C#', 'Db', etc.) or integer to pitch class 0-11.
 * Returns null on unknown input.
 * @param {number|string} root
 * @returns {number|null}
 */
export function rootToIndex(root) {
  if (typeof root === 'number') return ((root % 12) + 12) % 12;
  if (ENHARMONICS[root] !== undefined) return ENHARMONICS[root];
  const idx = NOTE_NAMES.indexOf(root);
  return idx >= 0 ? idx : null;
}

/** Pitch class name (sharp spelling) for a semitone 0-11 or MIDI note. */
export function indexToRoot(index) {
  return NOTE_NAMES[((index % 12) + 12) % 12];
}

/**
 * Set of pitch classes (0-11) that belong to the scale.
 * Falls back to natural_minor for unknown scale names.
 * @param {number|string} root
 * @param {string} scaleName - key from SCALE_INTERVALS
 * @returns {Set<number>}
 */
export function scalePitchClasses(root, scaleName) {
  const rootIdx = rootToIndex(root);
  if (rootIdx === null) return new Set();
  const intervals = SCALE_INTERVALS[scaleName] ?? SCALE_INTERVALS.natural_minor;
  return new Set(intervals.map(iv => (rootIdx + iv) % 12));
}

/**
 * True if a MIDI note belongs to the scale.
 * @param {number} midi
 * @param {number|string} root
 * @param {string} scaleName
 */
export function isInScale(midi, root, scaleName) {
  return scalePitchClasses(root, scaleName).has(((midi % 12) + 12) % 12);
}

/**
 * All MIDI notes in the scale within [minMidi, maxMidi] inclusive.
 * Useful for bass line generation, arp seeds, fretboard overlays.
 * @param {number|string} root
 * @param {string} scaleName
 * @param {number} [minMidi=36]
 * @param {number} [maxMidi=84]
 * @returns {number[]}
 */
export function scaleNotesInRange(root, scaleName, minMidi = 36, maxMidi = 84) {
  const pcs = scalePitchClasses(root, scaleName);
  const result = [];
  for (let midi = minMidi; midi <= maxMidi; midi++) {
    if (pcs.has(((midi % 12) + 12) % 12)) result.push(midi);
  }
  return result;
}

/**
 * Scale degree (0-indexed) of a MIDI note within the scale,
 * or -1 if the note is not in the scale.
 * @param {number} midi
 * @param {number|string} root
 * @param {string} scaleName
 * @returns {number}
 */
export function scaleDegree(midi, root, scaleName) {
  const rootIdx = rootToIndex(root);
  if (rootIdx === null) return -1;
  const intervals = SCALE_INTERVALS[scaleName] ?? SCALE_INTERVALS.natural_minor;
  const pc = ((midi % 12) - rootIdx + 12) % 12;
  return intervals.indexOf(pc);
}
