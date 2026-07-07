import { createSong, normalizeSong } from './song.js';
import { createSetlist, normalizeSetlist } from './setlist.js';
import { encodeB64url, decodeB64url } from '../codec.js';

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
  if (raw._v === 1) {
    // Fresh shallow copy, and still walk the nested song/rw/sections through
    // their own normalizers — a decoded/hand-edited entry can carry a
    // top-level _v:1 while its nested fields are stale or legacy-shaped.
    return {
      ...raw,
      song:     raw.song ? normalizeSong(raw.song) : createSong(),
      rw:       raw.rw   ? normalizeShowFileRw(raw.rw) : createShowFileRw(),
      sections: (raw.sections || []).map(s => normalizeShowFileSection(s) ?? createShowFileSection()),
    };
  }
  return createShowFileSongEntry({
    song:     raw.song     ?? null,
    rw:       raw.rw       ?? null,
    sections: raw.sections ?? [],
    loopwork: raw.loopwork ?? null,
  });
}

// Used by createShowFile: builds fresh entries for raw (non-_v) input, and
// preserves already-normalized entries as-is (createShowFile is a "create",
// not a "normalize", call — see normalizeShowFileSongsMapDeep below for the
// re-normalize case, which additionally walks already-_v:1 entries).
function normalizeShowFileSongsMap(songs) {
  const out = {};
  for (const [songId, entry] of Object.entries(songs || {})) {
    out[songId] = (entry && entry._v === 1) ? entry : createShowFileSongEntry(entry);
  }
  return out;
}

// Used by normalizeShowFile's _v:1 fast path: every entry — even one already
// carrying _v:1 — is routed through normalizeShowFileSongEntry, which copies
// and walks its nested song/rw/sections rather than trusting them as-is.
function normalizeShowFileSongsMapDeep(songs) {
  const out = {};
  for (const [songId, entry] of Object.entries(songs || {})) {
    out[songId] = normalizeShowFileSongEntry(entry) ?? createShowFileSongEntry();
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
  if (raw._v === 1) {
    // Fresh shallow copy, and still walk the setlist + songs map through their
    // own normalizers — a decoded payload (decodeShowFile accepts arbitrary
    // base64 from a URL hash) carrying a top-level _v:1 must not bypass
    // nested normalization, and must not hand back the caller's own object.
    return {
      ...raw,
      setlist: raw.setlist ? normalizeSetlist(raw.setlist) : createSetlist(),
      songs:   normalizeShowFileSongsMapDeep(raw.songs),
    };
  }
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
 * Encoding itself lives in ../codec.js — shared with @gp/part and encodeRigTrack.
 */
export function encodeShowFile(showFile) {
  return encodeB64url(showFile);
}

/**
 * Decode a base64url Show File string. Returns a normalized Show File, or
 * `null` on parse failure (unlike decodeRigTrack, there is no meaningful
 * "empty" Show File to fall back to).
 */
export function decodeShowFile(str) {
  try {
    return normalizeShowFile(decodeB64url(str));
  } catch {
    return null;
  }
}
