export const SONG_KINDS = Object.freeze({
  original:     'original',
  cover:        'cover',
  instrumental: 'instrumental',
});

export function createSong({
  title = 'Untitled',
  artist = '',
  kind = SONG_KINDS.original,
  key = 'C',
  scale = 'major',
  tempo = 120,
  timeSignature = '4/4',
  bars = 0,
  sections = [],
  parts = [],
  rigTrack = [],
  ...rest
} = {}) {
  return {
    _v: 1,
    title,
    artist,
    kind,
    key,
    scale,
    tempo,
    time_sig: timeSignature,
    bars,
    sections,
    parts,
    rig_track: rigTrack,
    ...rest,
  };
}

export function normalizeSong(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createSong(raw);
}
