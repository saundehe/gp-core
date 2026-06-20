/**
 * A single song slot in a setlist.
 *
 * song_id:    references a Song stored in Supabase (or null for an unnamed slot)
 * song_title: denormalized for display — avoids loading the full song just to render the list
 * key:        null = use song's own key; string = override (e.g. 'Eb' for a different tuning night)
 * transpose:  semitones (positive = up, negative = down); 0 = no change
 * tempo_mult: playback tempo multiplier; 1.0 = song's original tempo, 0.5 = half-time, 2.0 = double
 * notes:      bandleader annotation ("start slow", "drop D", "skip solo")
 */
export function createSetlistEntry({
  songId = null,
  songTitle = '',
  key = null,
  transpose = 0,
  tempoMult = 1.0,
  notes = '',
  ...rest
} = {}) {
  return {
    _v: 1,
    song_id:    songId,
    song_title: songTitle,
    key,
    transpose,
    tempo_mult: tempoMult,
    notes,
    ...rest,
  };
}

export function normalizeSetlistEntry(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createSetlistEntry({
    songId:     raw.song_id    ?? raw.songId    ?? null,
    songTitle:  raw.song_title ?? raw.songTitle ?? '',
    key:        raw.key        ?? null,
    transpose:  raw.transpose  ?? 0,
    tempoMult:  raw.tempo_mult ?? raw.tempoMult ?? 1.0,
    notes:      raw.notes      ?? '',
  });
}

/**
 * An ordered list of song slots for a performance.
 *
 * id:      stable identifier (uuid); used for Supabase row key and sync
 * name:    display name ("Main Set", "Encore", "Rehearsal 2026-06-20")
 * entries: ordered SetlistEntry array
 * notes:   show-level notes (venue, load-in time, anything)
 */
export function createSetlist({
  id = '',
  name = 'Main Set',
  entries = [],
  notes = '',
  ...rest
} = {}) {
  return {
    _v: 1,
    id,
    name,
    entries: entries.map(e => e._v === 1 ? e : createSetlistEntry(e)),
    notes,
    ...rest,
  };
}

export function normalizeSetlist(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createSetlist({
    id:      raw.id      ?? '',
    name:    raw.name    ?? 'Main Set',
    entries: raw.entries ?? [],
    notes:   raw.notes   ?? '',
  });
}

/**
 * Insert or replace the entry at index `idx`. Returns a new entries array.
 * Append to end if idx >= entries.length or idx < 0.
 */
export function upsertSetlistEntry(entries, entry, idx = -1) {
  const e = entry._v === 1 ? entry : createSetlistEntry(entry);
  if (idx < 0 || idx >= entries.length) return [...entries, e];
  return [...entries.slice(0, idx), e, ...entries.slice(idx + 1)];
}

/**
 * Remove the entry at index `idx`. Returns a new entries array.
 */
export function removeSetlistEntry(entries, idx) {
  return entries.filter((_, i) => i !== idx);
}

/**
 * Move entry at `fromIdx` to `toIdx`. Returns a new entries array.
 */
export function moveSetlistEntry(entries, fromIdx, toIdx) {
  if (fromIdx === toIdx || fromIdx < 0 || fromIdx >= entries.length) return entries;
  const result = [...entries];
  const [moved] = result.splice(fromIdx, 1);
  result.splice(toIdx, 0, moved);
  return result;
}
