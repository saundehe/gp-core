import { CHORD_INTERVALS, CHORD_SUFFIX, CHORD_QUALITIES } from './intervals.js';
import { rootToIndex, indexToRoot } from './scale.js';

/**
 * MIDI notes for a chord voicing (root position, one octave).
 * @param {number|string} root  - pitch class 0-11 or note name
 * @param {string} quality      - from CHORD_QUALITIES
 * @param {number} [octave=4]   - octave of the root (C4 = MIDI 60)
 * @returns {number[]}
 */
export function chordNotes(root, quality, octave = 4) {
  const rootIdx = rootToIndex(root);
  if (rootIdx === null) return [];
  const intervals = CHORD_INTERVALS[quality] ?? CHORD_INTERVALS[CHORD_QUALITIES.major];
  const rootMidi = rootIdx + (octave + 1) * 12;
  return intervals.map(iv => rootMidi + iv);
}

/**
 * Human-readable chord name string, e.g. 'Am', 'Gmaj7', 'Cdim'.
 * @param {number|string} root
 * @param {string} quality
 * @returns {string}
 */
export function chordName(root, quality) {
  const name = typeof root === 'string' ? root : indexToRoot(root);
  return name + (CHORD_SUFFIX[quality] ?? '');
}

/**
 * Detect the most likely chord from a set of MIDI notes.
 * Tests all 12 roots × all 11 qualities; picks the one where the greatest
 * fraction of chord tones appear among the input pitch classes.
 *
 * @param {number[]} midiNotes      - MIDI pitches (any octave)
 * @param {number}   [minMatch=0.75] - minimum coverage fraction required
 * @returns {{ root: number, rootName: string, quality: string, name: string } | null}
 */
export function detectChord(midiNotes, minMatch = 0.75) {
  if (!midiNotes || midiNotes.length === 0) return null;
  const pcs = new Set(midiNotes.map(m => ((m % 12) + 12) % 12));

  let best = null;
  let bestScore = -1;

  for (let r = 0; r < 12; r++) {
    for (const [quality, intervals] of Object.entries(CHORD_INTERVALS)) {
      const chordPcs = intervals.map(iv => (r + iv) % 12);
      const matched = chordPcs.filter(pc => pcs.has(pc)).length;
      const score = matched / chordPcs.length;
      // Prefer higher score; on tie prefer simpler chord (fewer tones)
      if (score > bestScore || (score === bestScore && best && intervals.length < CHORD_INTERVALS[best.quality].length)) {
        bestScore = score;
        best = { root: r, quality };
      }
    }
  }

  if (!best || bestScore < minMatch) return null;
  const rootName = indexToRoot(best.root);
  return { root: best.root, rootName, quality: best.quality, name: chordName(rootName, best.quality) };
}
