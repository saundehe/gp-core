import { createSong } from './song.js';
import { createSetlist } from './setlist.js';

/**
 * Show File v1 — the setlist spine artifact. See docs/SHOWFILE_SPEC.md.
 *
 * One durable, portable artifact carrying an entire gig: the setlist, and per
 * song the Riffwork tab link, the rig scenes/presets per section, and notes.
 *
 * gp-core owns schema + validation only (spec decision 2). The embedded
 * `scene` / `preset` payloads on a section (spec decision 4 — device-aware,
 * defKey-keyed portable form) are intentionally left opaque here: the
 * translators that produce them from a rig's local id-based shapes live in
 * RigWork, not gp-core. This file only carries them through untouched.
 */

// ── ShowFileRw (Riffwork linkage) ───────────────────────────────────────────

/**
 * file:    library entry name Riffwork matches against (library[].name)
 * cloudId: optional share/cloud id for the tab
 */
export function createShowFileRw({
  file = null,
  cloudId = null,
  ...rest
} = {}) {
  return { _v: 1, file, cloud_id: cloudId, ...rest };
}

export function normalizeShowFileRw(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createShowFileRw({
    file:    raw.file     ?? null,
    cloudId: raw.cloud_id ?? raw.cloudId ?? null,
  });
}

// ── ShowFileSection ──────────────────────────────────────────────────────────

/**
 * One section entry inside a Show File song, mirroring `song.sections` order.
 *
 * scene / preset: embedded portable payloads or null (spec §3/§4) — opaque
 * here, RigWork produces + consumes their internal shape.
 * rw_bar: optional explicit Riffwork bar anchor (int) or null.
 * tracks: reserved — backing-track refs (name only in v1).
 */
export function createShowFileSection({
  name = '',
  bpm = null,
  beats = null,
  bars = null,
  scene = null,
  preset = null,
  rwBar = null,
  tracks = [],
  ...rest
} = {}) {
  return {
    _v: 1,
    name,
    bpm,
    beats,
    bars,
    scene,
    preset,
    rw_bar: rwBar,
    tracks,
    ...rest,
  };
}

export function normalizeShowFileSection(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createShowFileSection({
    name:   raw.name   ?? '',
    bpm:    raw.bpm    ?? null,
    beats:  raw.beats  ?? null,
    bars:   raw.bars   ?? null,
    scene:  raw.scene  ?? null,
    preset: raw.preset ?? null,
    rwBar:  raw.rw_bar ?? raw.rwBar ?? null,
    tracks: raw.tracks ?? [],
  });
}

// ── ShowFileSongEntry ────────────────────────────────────────────────────────

/**
 * One entry in a Show File's `songs` map, keyed by song_id (referenced from
 * setlist entries).
 *
 * song:     createSong shape (title, key, tempo, time_sig, sections, ...)
 * rw:       ShowFileRw shape — Riffwork link
 * sections: ordered ShowFileSection array, mirrors song.sections
 * loopwork: reserved for hardware recall (spec decision 6 — out of scope v1)
 */
export function createShowFileSongEntry({
  song = null,
  rw = null,
  sections = [],
  loopwork = null,
  ...rest
} = {}) {
  return {
    _v: 1,
    song:     song ? (song._v === 1 ? song : createSong(song)) : createSong(),
    rw:       rw   ? (rw._v === 1   ? rw   : createShowFileRw(rw)) : createShowFileRw(),
    sections: sections.map(s => (s && s._v === 1) ? s : createShowFileSection(s)),
    loopwork,
    ...rest,
  };
}

export function normalizeShowFileSongEntry(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createShowFileSongEntry({
    song:     raw.song     ?? null,
    rw:       raw.rw       ?? null,
    sections: raw.sections ?? [],
    loopwork: raw.loopwork ?? null,
  });
}

function normalizeShowFileSongsMap(songs) {
  const out = {};
  for (const [songId, entry] of Object.entries(songs || {})) {
    out[songId] = (entry && entry._v === 1) ? entry : createShowFileSongEntry(entry);
  }
  return out;
}

// ── ShowFile ─────────────────────────────────────────────────────────────────

/**
 * id:      stable identifier (uuid)
 * name:    display name ("Main Set", "GP Drone Set 2026-07")
 * date:    ISO date string or null
 * notes:   show-level notes
 * setlist: createSetlist shape — entries[] of createSetlistEntry
 * songs:   map of song_id -> ShowFileSongEntry, referenced from setlist entries
 */
export function createShowFile({
  id = '',
  name = '',
  date = null,
  notes = '',
  setlist = null,
  songs = {},
  ...rest
} = {}) {
  return {
    _v: 1,
    id,
    name,
    date,
    notes,
    setlist: setlist ? (setlist._v === 1 ? setlist : createSetlist(setlist)) : createSetlist(),
    songs:   normalizeShowFileSongsMap(songs),
    ...rest,
  };
}

export function normalizeShowFile(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createShowFile({
    id:      raw.id      ?? '',
    name:    raw.name    ?? '',
    date:    raw.date    ?? null,
    notes:   raw.notes   ?? '',
    setlist: raw.setlist ?? null,
    songs:   raw.songs   ?? {},
  });
}

// ── encode / decode ──────────────────────────────────────────────────────────
// Same encoding as encodeRigTrack (rig-track.js) and Riffwork's `#t=`: JSON ->
// UTF-8 -> base64url. Download extension for a Show File artifact: .gpshow.json

/**
 * Encode a Show File to a base64url string, suitable for a `#show=` hash link.
 */
export function encodeShowFile(showFile) {
  const json   = JSON.stringify(showFile);
  const bytes  = new TextEncoder().encode(json);
  let binary   = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a base64url Show File string. Returns a normalized Show File, or
 * `null` on parse failure (unlike decodeRigTrack, there is no meaningful
 * "empty" Show File to fall back to).
 */
export function decodeShowFile(str) {
  try {
    const b64    = str.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(b64);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return normalizeShowFile(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}
