/**
 * A click track / MIDI clock configuration.
 *
 * The Tauri sidecar reads this to know what tempo, subdivision, and
 * MIDI clock output to produce. One ClickTrack per song; tempo changes
 * are embedded in the ClockTrack's cues.
 *
 * midi_clock: true → emit 24-ppq MIDI clock messages on the designated output port.
 * ltc: true → emit SMPTE LTC audio (requires an audio output channel — future).
 * mtc: true → emit MIDI Time Code (future).
 */
export function createClickTrack({
  tempo = 120,
  timeSig = '4/4',
  subdivision = 4,      // note value per click: 4 = quarter, 8 = eighth, etc.
  accentVel = 127,      // velocity for beat 1 of each bar
  beatVel = 80,         // velocity for other beats
  midiClock = true,     // emit 24-ppq MIDI clock
  midiPort = null,      // output port name (matches a midir port name from list_ports)
  countIn = 0,          // bars of count-in before bar 1
  ...rest
} = {}) {
  return {
    _v: 1,
    tempo,
    time_sig: timeSig,
    subdivision,
    accent_vel:  accentVel,
    beat_vel:    beatVel,
    midi_clock:  midiClock,
    midi_port:   midiPort,
    count_in:    countIn,
    ...rest,
  };
}

export function normalizeClickTrack(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createClickTrack({
    tempo:       raw.tempo        ?? 120,
    timeSig:     raw.time_sig     ?? raw.timeSig     ?? '4/4',
    subdivision: raw.subdivision  ?? 4,
    accentVel:   raw.accent_vel   ?? raw.accentVel   ?? 127,
    beatVel:     raw.beat_vel     ?? raw.beatVel     ?? 80,
    midiClock:   raw.midi_clock   ?? raw.midiClock   ?? true,
    midiPort:    raw.midi_port    ?? raw.midiPort     ?? null,
    countIn:     raw.count_in     ?? raw.countIn      ?? 0,
  });
}

/**
 * A tempo or time-sig change anchored to a bar number.
 * Embedded in a ClockCue so the sidecar knows to re-sync at that bar.
 */
export function createTempoChange({
  bar = 1,
  tempo = null,         // null = no change
  timeSig = null,       // null = no change
} = {}) {
  return { _v: 1, bar, tempo, time_sig: timeSig };
}
