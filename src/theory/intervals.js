// Semitone intervals from root (0) for scales and chord qualities.

export const SCALE_INTERVALS = Object.freeze({
  major:          [0, 2, 4, 5, 7, 9, 11],
  natural_minor:  [0, 2, 3, 5, 7, 8, 10],
  dorian:         [0, 2, 3, 5, 7, 9, 10],
  phrygian:       [0, 1, 3, 5, 7, 8, 10],
  lydian:         [0, 2, 4, 6, 7, 9, 11],
  mixolydian:     [0, 2, 4, 5, 7, 9, 10],
  locrian:        [0, 1, 3, 5, 6, 8, 10],
  harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
  pentatonic:     [0, 3, 5, 7, 10],         // minor pentatonic
  blues:          [0, 3, 5, 6, 7, 10],      // minor blues (adds b5)
});

export const CHORD_QUALITIES = Object.freeze({
  major: 'major',
  minor: 'minor',
  dim:   'dim',
  aug:   'aug',
  dom7:  'dom7',
  maj7:  'maj7',
  min7:  'min7',
  m7b5:  'm7b5',
  dim7:  'dim7',
  sus2:  'sus2',
  sus4:  'sus4',
});

export const CHORD_INTERVALS = Object.freeze({
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim:   [0, 3, 6],
  aug:   [0, 4, 8],
  dom7:  [0, 4, 7, 10],
  maj7:  [0, 4, 7, 11],
  min7:  [0, 3, 7, 10],
  m7b5:  [0, 3, 6, 10],
  dim7:  [0, 3, 6, 9],
  sus2:  [0, 2, 7],
  sus4:  [0, 5, 7],
});

// Display suffix for chord name strings (e.g. root='A' quality='minor' → 'Am').
export const CHORD_SUFFIX = Object.freeze({
  major: '',
  minor: 'm',
  dim:   'dim',
  aug:   'aug',
  dom7:  '7',
  maj7:  'maj7',
  min7:  'm7',
  m7b5:  'm7b5',
  dim7:  'dim7',
  sus2:  'sus2',
  sus4:  'sus4',
});
