export const OSC_ARG_TYPES = Object.freeze({
  float:   'f',
  int:     'i',
  string:  's',
  bool:    'T', // OSC true
  false:   'F', // OSC false
});

/**
 * A single OSC argument.
 * type is one of OSC_ARG_TYPES values ('f', 'i', 's', 'T', 'F').
 */
export function createOscArg({ type = 'f', value = 0 } = {}) {
  return { _v: 1, type, value };
}

/**
 * An OSC message to fire at a ClockCue bar.
 * address: OSC address pattern, e.g. '/notch/scene/1'
 * args: array of OscArg objects
 */
export function createOscMessage({ address = '/', args = [] } = {}) {
  return {
    _v: 1,
    address,
    args: args.map(a => a._v === 1 ? a : createOscArg(a)),
  };
}

/**
 * An OSC target (destination host + port).
 * The Tauri sidecar maintains a registry of these and routes messages by targetId.
 */
export function createOscTarget({
  id = '',
  host = '127.0.0.1',
  port = 8000,
  label = '',
  ...rest
} = {}) {
  return { _v: 1, id, host, port, label, ...rest };
}

export function normalizeOscTarget(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createOscTarget(raw);
}

/** Common OSC target presets — starting points, not locked in. */
export const OSC_TARGET_PRESETS = Object.freeze({
  notchLocal:  { id: 'notch-local',  host: '127.0.0.1', port: 8000,  label: 'Notch (local)' },
  tdLocal:     { id: 'td-local',     host: '127.0.0.1', port: 9000,  label: 'TouchDesigner (local)' },
  mainstage:   { id: 'mainstage',    host: '127.0.0.1', port: 9010,  label: 'MainStage (local)' },
  ableton:     { id: 'ableton',      host: '127.0.0.1', port: 11000, label: 'Ableton Live (local)' },
});
