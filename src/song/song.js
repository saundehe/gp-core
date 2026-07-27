import { normalizeSection } from './section.js';
import { createRigTrack } from './rig-track.js';
import { createClockTrack } from '../clockwork/clock-cue.js';
import { normalizePart } from '../part/part.js';

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
  time_sig,        // absorbed only, prevents ...rest from clobbering the time_sig below
  bars = 0,
  sections = [],
  parts = [],
  rigTrack = [],
  rig_track,       // absorbed only, prevents ...rest from clobbering the rig_track below
  clockTrack = [],
  clock_track,     // absorbed only, prevents ...rest from clobbering the clock_track below
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
    time_sig:    timeSignature,
    bars,
    sections,
    parts,
    rig_track:   rigTrack,
    clock_track: clockTrack,
    ...rest,
  };
}

export function normalizeSong(raw) {
  if (!raw) return null;
  if (raw._v >= 1) {
    // Fresh shallow copy on the fast path too, matching normalizeLicense/normalizePart's
    // copy semantics — callers must not get back their own mutable reference.
    // P1-6: _v >= 1 (not === 1) so a future schema version is preserved
    // read-only instead of being downgraded by createSong.
    // P1-5/P2-1: still walk sections/parts/rig_track/clock_track through their
    // own normalizers on this fast path — a decoded Show File song can carry a
    // top-level _v:1 while its nested collections are legacy-shaped, truncated,
    // or corrupt. This is the same gap already closed for setlist entries, rig
    // cues, and clock cues (see rig-track.js/clock-cue.js P1-5 comments);
    // without it, interpolateRigTrack's `for (const auto of cue.automations)`
    // throws at show time instead of failing safe at decode time.
    return {
      ...raw,
      sections: Array.isArray(raw.sections)
        ? raw.sections.filter(s => s && typeof s === 'object').map(s => normalizeSection(s))
        : [],
      parts: Array.isArray(raw.parts)
        ? raw.parts.filter(p => p && typeof p === 'object').map(p => normalizePart(p))
        : [],
      rig_track:   Array.isArray(raw.rig_track)   ? createRigTrack(raw.rig_track)     : [],
      clock_track: Array.isArray(raw.clock_track) ? createClockTrack(raw.clock_track) : [],
    };
  }
  // LEGACY (pre-_v) path: mirror the _v >= 1 fast path above rather than
  // handing raw straight to createSong. createSong does not itself walk
  // sections/parts/rig_track/clock_track through their normalizers, so a bare
  // createSong(raw) let raw section/part objects and un-normalized rig/clock
  // tracks straight through, and (since createSong's destructure didn't
  // absorb the snake_case aliases) raw.time_sig/rig_track/clock_track fell
  // into createSong's own ...rest and clobbered the camelCase-mapped values
  // spread earlier in its return object (same class of bug as P1-5 in
  // clock-cue.js's createClockCue).
  return createSong({
    ...raw,
    title:         raw.title         ?? 'Untitled',
    artist:        raw.artist        ?? '',
    kind:          raw.kind          ?? SONG_KINDS.original,
    key:           raw.key           ?? 'C',
    scale:         raw.scale         ?? 'major',
    tempo:         raw.tempo         ?? 120,
    timeSignature: raw.time_sig      ?? raw.timeSignature ?? '4/4',
    bars:          raw.bars          ?? 0,
    sections: Array.isArray(raw.sections)
      ? raw.sections.filter(s => s && typeof s === 'object').map(s => normalizeSection(s))
      : [],
    parts: Array.isArray(raw.parts)
      ? raw.parts.filter(p => p && typeof p === 'object').map(p => normalizePart(p))
      : [],
    rigTrack:   createRigTrack(raw.rig_track ?? raw.rigTrack ?? []),
    clockTrack: createClockTrack(raw.clock_track ?? raw.clockTrack ?? []),
  });
}
