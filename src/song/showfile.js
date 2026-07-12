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

/**
 * Idempotent upgrade for a raw or already-normalized ShowFileRw.
 * P1-6: _v >= 1 is current (never downgrades a newer row). P2-2: always
 * returns a fresh object — no nested collections to walk here.
 */
export function normalizeShowFileRw(raw) {
  if (!raw) return null;
  if (raw._v >= 1) return { ...raw };
  return createShowFileRw({
    ...raw,
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

/**
 * Idempotent upgrade for a raw or already-normalized ShowFileSection.
 * P1-6: _v >= 1 is current. P2-2: always returns a fresh object (scene/preset
 * stay opaque per spec §3/§4 — this file only carries them through untouched,
 * so there is nothing further to walk).
 */
export function normalizeShowFileSection(raw) {
  if (!raw) return null;
  if (raw._v >= 1) return { ...raw };
  return createShowFileSection({
    ...raw,
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
    song:     song ? (song._v >= 1 ? song : createSong(song)) : createSong(),
    rw:       rw   ? (rw._v >= 1   ? rw   : createShowFileRw(rw)) : createShowFileRw(),
    // P2-1: filter non-object entries (a null/corrupt slot) instead of
    // throwing on `s._v` of null; `?? []` covers an explicit `sections: null`
    // (the parameter default only covers `undefined`).
    sections: (sections ?? [])
      .filter(s => s && typeof s === 'object')
      .map(s => s._v >= 1 ? s : createShowFileSection(s)),
    loopwork,
    ...rest,
  };
}

/**
 * Idempotent upgrade for a raw or already-normalized ShowFileSongEntry.
 * P1-6: _v >= 1 is current — never downgrades a newer entry. Still walks the
 * nested song/rw/sections through their own normalizers on that fast path: a
 * decoded/hand-edited entry can carry a top-level _v:1 while its nested
 * fields are stale, legacy-shaped, or corrupt (P2-1/P2-2).
 */
export function normalizeShowFileSongEntry(raw) {
  if (!raw) return null;
  if (raw._v >= 1) {
    return {
      ...raw,
      song:     raw.song ? normalizeSong(raw.song) : createSong(),
      rw:       raw.rw   ? normalizeShowFileRw(raw.rw) : createShowFileRw(),
      sections: (raw.sections ?? [])
        .filter(s => s === null || (s && typeof s === 'object'))
        .map(s => normalizeShowFileSection(s) ?? createShowFileSection()),
    };
  }
  return createShowFileSongEntry({
    ...raw,
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
    // P2-1: a null/non-object entry falls back to a fresh placeholder instead
    // of throwing inside createShowFileSongEntry's destructure.
    out[songId] = (entry && entry._v >= 1) ? entry : createShowFileSongEntry(entry ?? {});
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
    setlist: setlist ? (setlist._v >= 1 ? setlist : createSetlist(setlist)) : createSetlist(),
    songs:   normalizeShowFileSongsMap(songs),
    ...rest,
  };
}

/**
 * Current Show File schema version. This is the ONE place in gp-core that
 * uses the "refuse newer" forward-compat policy (P1-6, option b) rather than
 * "treat _v >= current as current" (option a, used for every row-level type
 * nested inside a Show File — setlist entries, sections, song entries, etc.).
 * A Show File is a durable, portable, whole-gig artifact a user hands between
 * machines running different gp-core versions; silently downgrading one to a
 * lossy legacy shape (dropping unknown top-level fields, stamping _v back
 * down) is worse than refusing to open it. Row-level types don't get their
 * own decode entry point, so "preserve read-only" is the safer default there.
 */
export const SHOWFILE_VERSION = 1;

/**
 * Idempotent upgrade for a raw or already-normalized Show File.
 *
 * P1-6 forward-compat: refuses (returns null) any payload whose top-level
 * `_v` is a number greater than SHOWFILE_VERSION — this code cannot safely
 * interpret a Show File from a newer gp-core, and the old exact-match
 * (`_v === 1`) behavior would silently route it through the LEGACY branch
 * below, which reconstructs the object from a fixed field list and drops
 * every field it doesn't know about (verified: a `_v:2` file with a new
 * top-level field loses that field and gets stamped back down to `_v:1`).
 * Use decodeShowFile's companion `describeShowFileDecodeError` if a caller
 * needs to distinguish "newer version" from "garbage/unparseable" instead of
 * just getting null back.
 *
 * P2-1/P2-2 (unchanged from before): fresh shallow copy, and still walk the
 * setlist + songs map through their own normalizers — a decoded payload
 * (decodeShowFile accepts arbitrary base64 from a URL hash) carrying a
 * top-level _v:1 must not bypass nested normalization, and must not hand back
 * the caller's own object.
 */
export function normalizeShowFile(raw) {
  if (!raw) return null;
  if (typeof raw._v === 'number' && raw._v > SHOWFILE_VERSION) return null;
  if (raw._v >= 1) {
    return {
      ...raw,
      setlist: raw.setlist ? normalizeSetlist(raw.setlist) : createSetlist(),
      songs:   normalizeShowFileSongsMapDeep(raw.songs),
    };
  }
  return createShowFile({
    ...raw,
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
 * `null` on ANY failure — parse error, malformed payload, OR a `_v` newer
 * than this code understands (P1-6). This keeps the existing null-check
 * contract every caller already relies on (e.g. rig's `main.js:7610`
 * `if (!decodeShowFile(...))`) rather than returning a truthy error object
 * that would silently pass those checks and crash later on missing fields.
 *
 * A caller that wants to tell "made with a newer version" apart from
 * "corrupt/garbage" for a friendlier error message can call
 * describeShowFileDecodeError with the same string — it's a separate, purely
 * additive export so it never changes what decodeShowFile itself returns.
 */
export function decodeShowFile(str) {
  try {
    return normalizeShowFile(decodeB64url(str));
  } catch {
    return null;
  }
}

/**
 * Pure diagnostic companion to decodeShowFile: explains WHY a string would
 * fail to decode, without changing decodeShowFile's own null-only contract.
 * @param {string} str
 * @returns {null|'newer-version'|'malformed'} null means it would decode fine.
 */
export function describeShowFileDecodeError(str) {
  let raw;
  try {
    raw = decodeB64url(str);
  } catch {
    return 'malformed';
  }
  if (raw && typeof raw === 'object' && typeof raw._v === 'number' && raw._v > SHOWFILE_VERSION) {
    return 'newer-version';
  }
  return null;
}
