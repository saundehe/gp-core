/**
 * A single CC-automation target within a RigCue.
 * ramp_bars > 0 = interpolate from the previous value over that many bars.
 */
export function createRigAutomation({
  cc,
  value,
  rampBars = 0,
  deviceId = null,
  ...rest
} = {}) {
  return { _v: 1, cc, value, ramp_bars: rampBars, device_id: deviceId, ...rest };
}

/**
 * A cue anchored to a bar number in the song timeline.
 * Can fire a preset, a scene, and/or bar-resolution CC automations.
 */
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
    bar:       raw.bar       ?? 1,
    presetId:  raw.preset_id ?? raw.presetId  ?? null,
    sceneId:   raw.scene_id  ?? raw.sceneId   ?? null,
    deviceId:  raw.device_id ?? raw.deviceId  ?? null,
    automations: raw.automations ?? [],
    note:      raw.note      ?? '',
  });
}

/** Normalize an array of raw cue objects into a sorted Rig track. */
export function createRigTrack(cues = []) {
  return cues
    .map(c => c._v === 1 ? c : createRigCue(c))
    .sort((a, b) => a.bar - b.bar);
}
