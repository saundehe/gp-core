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
    osc_messages:  (oscMessages ?? []).filter(m => m && typeof m === 'object').map(m => m._v >= 1 ? m : createOscMessage(m)),
    tempo_change:  tempoChange ? (tempoChange._v >= 1 ? tempoChange : createTempoChange(tempoChange)) : null,
    target_id:     targetId,
    note,
    ...rest,
  };
}

/**
 * Idempotent upgrade AND backfill for a raw or already-normalized ClockCue.
 * Mirrors normalizeRigCue's fix (see rig-track.js): P1-6 treats _v >= 1 as
 * current instead of exact-matching _v === 1 (never downgrades a newer cue),
 * and P1-5 backfills `osc_messages` to an array + `bar` to a number even on
 * the fast path — a truncated/hand-edited cue can decode to `{_v:1, bar:1}`
 * with no `osc_messages` key, and the Tauri sidecar's OSC-firing loop
 * iterates it unconditionally.
 */
export function normalizeClockCue(raw) {
  if (!raw) return null;
  if (raw._v >= 1) {
    return {
      ...raw,
      bar: typeof raw.bar === 'number' && !Number.isNaN(raw.bar) ? raw.bar : (Number(raw.bar) || 1),
      osc_messages: Array.isArray(raw.osc_messages)
        ? raw.osc_messages.map(m => (m && m._v >= 1) ? m : createOscMessage(m ?? {}))
        : [],
    };
  }
  return createClockCue({
    ...raw,
    bar:          raw.bar              ?? 1,
    oscMessages:  raw.osc_messages     ?? raw.oscMessages   ?? [],
    tempoChange:  raw.tempo_change     ?? raw.tempoChange   ?? null,
    targetId:     raw.target_id        ?? raw.targetId      ?? null,
    note:         raw.note             ?? '',
  });
}

/**
 * Build a sorted, backfilled ClockTrack (array of ClockCues) from raw or
 * normalized cues. Non-object entries are dropped (P2-1) rather than
 * crashing the decode.
 */
export function createClockTrack(cues = []) {
  return (cues ?? [])
    .filter(c => c && typeof c === 'object')
    .map(c => normalizeClockCue(c))
    .sort((a, b) => a.bar - b.bar);
}

/**
 * Upsert a cue at cue.bar in an existing ClockTrack. Returns a new sorted array.
 */
export function upsertClockCue(track, cue) {
  const c = normalizeClockCue(cue) ?? createClockCue();
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
