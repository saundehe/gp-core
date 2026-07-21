import { encodeB64url, decodeB64url } from '../codec.js';

export function createRigAutomation({
  cc,
  value,
  rampBars = 0,
  deviceId = null,
  ...rest
} = {}) {
  return { _v: 1, cc, value, ramp_bars: rampBars, device_id: deviceId, ...rest };
}

export function createRigCue({
  bar = 1,
  presetId = null,
  sceneId = null,
  deviceId = null,
  automations = [],
  note = '',
  ...rest
} = {}) {
  return {
    _v: 1,
    bar,
    preset_id:   presetId,
    scene_id:    sceneId,
    device_id:   deviceId,
    automations: (automations ?? []).filter(a => a && typeof a === 'object').map(a => a._v >= 1 ? a : createRigAutomation(a)),
    note,
    ...rest,
  };
}

/**
 * Idempotent upgrade AND backfill for a raw or already-normalized RigCue.
 *
 * Two fixes live here together:
 * - P1-6 (forward-compat): treats _v >= 1 as "already current" rather than
 *   exact-matching _v === 1, so a future-versioned cue (_v: 2+) is preserved
 *   read-only instead of being routed into createRigCue, which would stamp
 *   _v back down to 1 and silently destroy whatever the newer schema added.
 * - P1-5 (backfill): even on the _v >= 1 fast path, this always returns a
 *   fresh object with `automations` guaranteed to be an array and `bar`
 *   guaranteed numeric — mirroring normalizeGearItem's "backfill even when _v
 *   is already present" pattern (gear/schema.js). A hand-edited or truncated
 *   share payload can decode to `{ _v: 1, bar: 1 }` with no `automations` key
 *   at all; without this, interpolateRigTrack's `for (const auto of
 *   cue.automations)` throws at show time instead of failing at decode time.
 * @param {*} raw
 */
export function normalizeRigCue(raw) {
  if (!raw) return null;
  if (raw._v >= 1) {
    return {
      ...raw,
      bar: typeof raw.bar === 'number' && !Number.isNaN(raw.bar) ? raw.bar : (Number(raw.bar) || 1),
      automations: Array.isArray(raw.automations)
        ? raw.automations.map(a => (a && a._v >= 1) ? a : createRigAutomation(a ?? {}))
        : [],
    };
  }
  return createRigCue({
    ...raw,
    bar:         raw.bar       ?? 1,
    presetId:    raw.preset_id ?? raw.presetId  ?? null,
    sceneId:     raw.scene_id  ?? raw.sceneId   ?? null,
    deviceId:    raw.device_id ?? raw.deviceId  ?? null,
    automations: raw.automations ?? [],
    note:        raw.note      ?? '',
  });
}

/**
 * Build a sorted, backfilled RigTrack from raw or normalized cues.
 * Every cue is routed through normalizeRigCue (P1-5/P1-6), and non-object
 * entries (null, a stray string, etc.) are dropped rather than crashing the
 * whole decode — one corrupt slot in a shared/hand-edited payload salvages
 * the rest of the track instead of nuking it (P2-1).
 */
export function createRigTrack(cues = []) {
  return (cues ?? [])
    .filter(c => c && typeof c === 'object')
    .map(c => normalizeRigCue(c))
    .sort((a, b) => a.bar - b.bar);
}

/**
 * Compute the automation state at a given bar position.
 *
 * Walks the (pre-sorted) cue list up to and including `bar`, accumulates
 * settled CC values, and resolves any ramp that is still in progress.
 *
 * Returns: Array<{ deviceId: string|null, cc: number, value: number }>
 * One entry per unique (deviceId, cc) pair that has been touched by bar.
 *
 * Bar numbers are 1-based; half-bar positions are fine (e.g. 9.5).
 */
export function interpolateRigTrack(cues, bar) {
  const settled = new Map(); // key → number (last snapped value)
  const ramps   = new Map(); // key → { from, to, startBar, endBar }

  for (const cue of cues) {
    if (cue.bar > bar) break;
    for (const auto of cue.automations) {
      const key = `${auto.device_id ?? ''}:${auto.cc}`;
      let fromValue = settled.get(key) ?? 0;

      // P1-4: ramp-onto-ramp. If this key has a ramp already in flight (not
      // yet settled), resolve ITS interpolated value at this cue's bar first
      // and use that as `from` — otherwise fromValue falls back to the last
      // *settled* value (0 if none), and a new ramp starting mid-flight of an
      // old one snaps to that stale/zero value instead of continuing smoothly
      // (an audible pop on a live volume/mix ramp).
      const inFlight = ramps.get(key);
      if (inFlight) {
        const t = clamp01((cue.bar - inFlight.startBar) / (inFlight.endBar - inFlight.startBar));
        fromValue = Math.round(inFlight.from + (inFlight.to - inFlight.from) * t);
        settled.set(key, fromValue);
        ramps.delete(key);
      }

      // Guard against a hand-edited/truncated automation that already carries
      // _v:1 (so normalizeRigCue's fast-path map leaves it untouched) but has
      // a missing/non-numeric ramp_bars — without this, `cue.bar + undefined`
      // is NaN, every downstream comparison/interpolation involving it stays
      // NaN, and the resolved CC value handed to the MIDI send layer is NaN.
      const rampBars = Number.isFinite(auto.ramp_bars) ? auto.ramp_bars : 0;

      if (rampBars === 0) {
        settled.set(key, auto.value);
        ramps.delete(key);
      } else {
        const rampEndBar = cue.bar + rampBars;
        if (bar >= rampEndBar) {
          settled.set(key, auto.value);
          ramps.delete(key);
        } else {
          ramps.set(key, { from: fromValue, to: auto.value, startBar: cue.bar, endBar: rampEndBar });
        }
      }
    }
  }

  const result = new Map(settled);
  for (const [key, ramp] of ramps) {
    const t = (bar - ramp.startBar) / (ramp.endBar - ramp.startBar);
    result.set(key, Math.round(ramp.from + (ramp.to - ramp.from) * t));
  }

  return Array.from(result, ([key, value]) => {
    // P2-7: split on the LAST ':' — device_id itself may legally contain ':'
    // (e.g. a synced/hand-edited id like 'usb:port1'), and splitting on the
    // first ':' would parse the cc back out as NaN.
    const i        = key.lastIndexOf(':');
    const deviceId = key.slice(0, i) || null;
    const cc       = Number(key.slice(i + 1));
    return { deviceId, cc, value };
  });
}

function clamp01(t) {
  return Math.min(1, Math.max(0, t));
}

/**
 * Insert or replace the cue at `cue.bar`. Returns a new sorted array.
 */
export function upsertCue(track, cue) {
  const c = normalizeRigCue(cue) ?? createRigCue();
  return [...track.filter(x => x.bar !== c.bar), c].sort((a, b) => a.bar - b.bar);
}

/**
 * Remove the cue at bar `bar`. Returns a new array.
 */
export function removeCue(track, bar) {
  return track.filter(c => c.bar !== bar);
}

/**
 * Encode a rig track (sorted cue array) to a base64url string.
 * Same encoding as @gp/part's encodePart — JSON → UTF-8 → base64url (see ../codec.js).
 */
export function encodeRigTrack(cues) {
  return encodeB64url(cues);
}

/**
 * Decode a base64url rig track string.
 * Returns a sorted, normalized track; returns [] on parse failure.
 */
export function decodeRigTrack(str) {
  try {
    return createRigTrack(decodeB64url(str));
  } catch {
    return [];
  }
}
