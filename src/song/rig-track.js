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
    automations: automations.map(a => a._v === 1 ? a : createRigAutomation(a)),
    note,
    ...rest,
  };
}

export function normalizeRigCue(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createRigCue({
    bar:         raw.bar       ?? 1,
    presetId:    raw.preset_id ?? raw.presetId  ?? null,
    sceneId:     raw.scene_id  ?? raw.sceneId   ?? null,
    deviceId:    raw.device_id ?? raw.deviceId  ?? null,
    automations: raw.automations ?? [],
    note:        raw.note      ?? '',
  });
}

export function createRigTrack(cues = []) {
  return cues
    .map(c => c._v === 1 ? c : createRigCue(c))
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
      const key       = `${auto.device_id ?? ''}:${auto.cc}`;
      const fromValue = settled.get(key) ?? 0;

      if (auto.ramp_bars === 0) {
        settled.set(key, auto.value);
        ramps.delete(key);
      } else {
        const rampEndBar = cue.bar + auto.ramp_bars;
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
    const i        = key.indexOf(':');
    const deviceId = key.slice(0, i) || null;
    const cc       = Number(key.slice(i + 1));
    return { deviceId, cc, value };
  });
}

/**
 * Insert or replace the cue at `cue.bar`. Returns a new sorted array.
 */
export function upsertCue(track, cue) {
  const c = cue._v === 1 ? cue : createRigCue(cue);
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
