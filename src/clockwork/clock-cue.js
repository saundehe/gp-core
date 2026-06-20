import { createOscMessage } from './osc.js';
import { createTempoChange } from './click.js';

/**
 * A bar-anchored show-control cue.
 *
 * Parallel to @gp/song's RigCue but for sync/show-control outputs:
 * - OSC messages (fire to Notch, TD, MainStage, Ableton, etc.)
 * - Tempo / time-sig changes (re-clocks the sidecar's MIDI clock output)
 * - A free-text note for the bandleader / show caller
 *
 * The Tauri sidecar evaluates the ClockTrack alongside the RigTrack at each
 * bar advance. No MIDI CC — that lives in RigCue.
 */
export function createClockCue({
  bar = 1,
  oscMessages = [],
  tempoChange = null,
  targetId = null,      // which OscTarget to send oscMessages to (null = all)
  note = '',
  ...rest
} = {}) {
  return {
    _v: 1,
    bar,
    osc_messages:  oscMessages.map(m => m._v === 1 ? m : createOscMessage(m)),
    tempo_change:  tempoChange ? (tempoChange._v === 1 ? tempoChange : createTempoChange(tempoChange)) : null,
    target_id:     targetId,
    note,
    ...rest,
  };
}

export function normalizeClockCue(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createClockCue({
    bar:          raw.bar              ?? 1,
    oscMessages:  raw.osc_messages     ?? raw.oscMessages   ?? [],
    tempoChange:  raw.tempo_change     ?? raw.tempoChange   ?? null,
    targetId:     raw.target_id        ?? raw.targetId      ?? null,
    note:         raw.note             ?? '',
  });
}

/**
 * Build a sorted ClockTrack (array of ClockCues) from raw or normalized cues.
 */
export function createClockTrack(cues = []) {
  return cues
    .map(c => c._v === 1 ? c : createClockCue(c))
    .sort((a, b) => a.bar - b.bar);
}

/**
 * Upsert a cue at cue.bar in an existing ClockTrack. Returns a new sorted array.
 */
export function upsertClockCue(track, cue) {
  const c = cue._v === 1 ? cue : createClockCue(cue);
  return [...track.filter(x => x.bar !== c.bar), c].sort((a, b) => a.bar - b.bar);
}

/**
 * Remove the ClockCue at bar. Returns a new array.
 */
export function removeClockCue(track, bar) {
  return track.filter(c => c.bar !== bar);
}

/**
 * Return all ClockCues active at or before `bar`, in order.
 * Used by the sidecar to replay cues when scrubbing / jumping to a bar.
 */
export function clockCuesUpTo(track, bar) {
  return track.filter(c => c.bar <= bar);
}

/**
 * Return the resolved tempo at a given bar (walking tempo_change cues).
 * Falls back to `defaultTempo` if no tempo change has been encountered.
 */
export function resolveTempoAt(track, bar, defaultTempo = 120) {
  let tempo = defaultTempo;
  for (const cue of track) {
    if (cue.bar > bar) break;
    if (cue.tempo_change?.tempo != null) tempo = cue.tempo_change.tempo;
  }
  return tempo;
}
