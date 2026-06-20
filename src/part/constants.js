// @gp/part constants — additions not covered by note.js / part.js.

// GM Standard drum map entries used by the generators and drum adapter.
// voice key → { midi, label }
export const DRUM_VOICES = Object.freeze({
  kick:       { midi: 36, label: 'Kick' },
  snare:      { midi: 38, label: 'Snare' },
  rimshot:    { midi: 37, label: 'Rimshot' },
  hat_closed: { midi: 42, label: 'Hi-Hat (closed)' },
  hat_open:   { midi: 46, label: 'Hi-Hat (open)' },
  hat_pedal:  { midi: 44, label: 'Hi-Hat (pedal)' },
  ride:       { midi: 51, label: 'Ride' },
  crash:      { midi: 49, label: 'Crash' },
  tom_high:   { midi: 50, label: 'Tom (high)' },
  tom_mid:    { midi: 47, label: 'Tom (mid)' },
  tom_floor:  { midi: 43, label: 'Tom (floor)' },
});
