// Standard instrument tunings as MIDI open-string values (low string → high string).
export const GUITAR_TUNINGS = Object.freeze({
  standard:      [40, 45, 50, 55, 59, 64],  // E A D G B e
  drop_d:        [38, 45, 50, 55, 59, 64],  // D A D G B e
  open_d:        [38, 45, 50, 54, 57, 62],  // D A D F# A d
  open_g:        [38, 43, 50, 55, 59, 62],  // D G D G B d
  dadgad:        [38, 45, 50, 55, 57, 62],  // D A D G A D
  bass_standard: [28, 33, 38, 43],           // E A D G
  bass_drop_d:   [26, 33, 38, 43],           // D A D G
  bass_5string:  [23, 28, 33, 38, 43],       // B E A D G
});

/**
 * Fret positions for every note in a scale/chord across the fretboard.
 *
 * @param {number[]} tuningMidis - open-string MIDI values (low to high)
 * @param {Set<number>|number[]} inScaleSet - pitch classes (0-11) that are in the scale or chord
 * @param {number} [maxFret=12]
 * @param {number|null} [rootPc=null] - pitch class of the root (marks isRoot on output)
 * @returns {Array<{string: number, fret: number, midi: number, isRoot: boolean}>}
 */
export function fretPositions(tuningMidis, inScaleSet, maxFret = 12, rootPc = null) {
  const pcs = inScaleSet instanceof Set ? inScaleSet : new Set(inScaleSet);
  const result = [];
  tuningMidis.forEach((openMidi, stringIdx) => {
    for (let fret = 0; fret <= maxFret; fret++) {
      const midi = openMidi + fret;
      const pc   = ((midi % 12) + 12) % 12;
      if (pcs.has(pc)) {
        result.push({ string: stringIdx, fret, midi, isRoot: rootPc !== null && pc === rootPc });
      }
    }
  });
  return result;
}
