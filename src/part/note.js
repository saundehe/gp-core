// Tick unit: 1 tick = 1 sixteenth note (DEFAULT_PPQ = 4 ticks per quarter)
export const DEFAULT_PPQ = 4;

export const NOTE_NAMES = Object.freeze(
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
);

/** Convert MIDI semitone 0-127 to note name ('C', 'F#', etc.) */
export function midiToNoteName(midi) {
  return NOTE_NAMES[midi % 12];
}

/** Convert MIDI semitone to octave number (C4 = 60). */
export function midiToOctave(midi) {
  return Math.floor(midi / 12) - 1;
}

/**
 * Create a Note.
 * onset and dur are in ticks (DEFAULT_PPQ ticks per quarter note).
 * pitch is MIDI semitone 0-127. vel is 0-127 (default 80).
 */
export function createNote(props = {}) {
  return {
    _v: 1,
    pitch: 60,
    onset: 0,
    dur: DEFAULT_PPQ,     // one quarter note
    vel: 80,
    ...props,
  };
}

/** Idempotent upgrade for bare note objects (e.g. from Conjure's {t,dur,midi,vel}). */
export function normalizeNote(raw) {
  if (!raw) return null;
  if (raw._v >= 1) return { ...raw };
  // Map Conjure's field names: t→onset, midi→pitch
  return {
    _v: 1,
    pitch: raw.midi ?? raw.pitch ?? 60,
    onset: raw.t   ?? raw.onset ?? 0,
    dur:   raw.dur ?? DEFAULT_PPQ,
    vel:   raw.vel ?? 80,
  };
}
