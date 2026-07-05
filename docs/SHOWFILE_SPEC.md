# Show File v1 — design spec (master)

**Author:** Fable, 2026-07-05. **Status:** approved direction (Heath: "setlist spine fuck yeah").
**Executors:** Opus/Sonnet sessions. Per-repo task lists: `rig/HANDOFF_SHOWFILE.md`, `riffwork/HANDOFF_SHOWFILE.md`. gp-core tasks are in this file (§6).

## 1. What this is

One durable, portable artifact that carries an entire gig: the setlist, and per song the
tab link (Riffwork), the rig scenes/presets per section (RigWork), tempo/click, and notes.
Songs are cues; advancing the show fires everything. grandMA cue-stack mental model.

This is NOT a new sync layer. RigWork Live Sync / Bandleader (v0.6.x) already ships the
runtime conductor over Supabase Realtime. The Show File is the missing **persistence +
cross-app** layer: what Live Sync broadcasts ephemerally, the Show File stores durably
and moves between apps/machines/people.

Competitive frame: BandHelper/OnSong do setlists + raw MIDI numbers. We win because the
Show File is **device-aware** (gp-core device-defs know what "Enzo preset 4" means) and
**editor-aware** (opens real tabs in Riffwork at the right bar). Keep that bar.

## 2. Locked design decisions

1. **Built on `@gp/core/song`, not a new format.** The schema already exists:
   `createSetlist`/`createSetlistEntry` (src/song/setlist.js:53,:11), `createSong` +
   sections (src/song/song.js:7, section.js:12), rig-track cues with base64url
   encode/decode (src/song/rig-track.js:11,:120). Show File composes these.
2. **RigWork = runtime authority.** It is already the conductor. RigWork imports/exports
   Show Files; Riffwork follows over the existing `rwbridge:<uid>` channel. gp-core owns
   schema + validation only. No new realtime channels.
3. **Riffwork linkage by name + bar anchor.** RigWork song items already carry `rwFile`
   and broadcast it in `bridgeBroadcastSection` (rig/src/main.js:9722). Riffwork matches
   `rwFile` against `library[].name` and uses the proven open-then-jump pattern
   (`_pendingJumpBar` + `openEntry`, riffwork/src/main.js:14554). Show File section
   entries MAY carry an explicit `rw_bar` anchor; if absent, follower opens the song and
   does not jump. Explicit anchors beat fragile section-name matching.
4. **Presets travel by payload + defKey, not by local id.** Scene/preset ids are local to
   one rig. The Show File embeds, per referenced scene/preset: name + per-device
   `{ defKey, recallPC, ccValues }` (the gp-core gear vocabulary,
   src/gear/device-defs.js:5). Import on another rig maps by defKey match ("map to my
   gear"), skips gracefully on miss. This is the device-aware moat — do not reduce it to
   raw PC numbers.
5. **Encoding:** plain JSON artifact, `_v:1`, with a base64url wrapper for hash/URL
   sharing (same pattern as `encodeRigTrack` and Riffwork `#t=`). File extension for
   downloads: `.gpshow.json`.
6. **Out of scope for v1** (do not build, note only): LoopWork hardware recall (schema
   reserves `loopwork` field), lead sheets, Riffwork multi-editor collab (ACTIVE OTHER
   LANE — stay out), OSC/Ableton-Link bridge completion (rig/bridge/ TODOs are a separate
   track), A/V streaming, remote (non-same-room) sessions.

## 3. Schema (v1)

```js
// @gp/core/song — new file: src/song/showfile.js
createShowFile({
  _v: 1,
  id, name, date, notes,
  setlist,                    // createSetlist shape: entries[] of createSetlistEntry
  songs: {                    // keyed by song_id referenced from setlist entries
    [song_id]: {
      song,                   // createSong shape (title, key, tempo, time_sig, sections)
      rw: { file, cloudId },  // Riffwork link: library entry name (+ optional share id)
      sections: [{            // ordered, mirrors song.sections
        name, bpm, beats, bars,
        scene,                // embedded scene payload or null (see decision 4)
        preset,               // embedded preset payload or null
        rw_bar,               // optional explicit Riffwork bar anchor (int) or null
        tracks: []            // reserved: backing-track refs (name only in v1)
      }],
      loopwork: null          // reserved for hardware recall
    }
  }
})
```

Embedded scene payload: `{ name, color, picks: [{ defKey, mode, preset: { name,
recallPC, ccValues } }] }`. Embedded preset payload: `{ name, midiPC, devices: [{
defKey, recallPC, ccValues }] }`. Both are translations OUT of RigWork's local id-based
shapes (rig/src/main.js:5899 firePreset consumes `ccValues[deviceId]`; :5986 scene shape)
INTO defKey-keyed portable form. The translators live in RigWork (it knows its boards),
NOT gp-core; gp-core only validates shapes.

## 4. Runtime flow (target)

Export: RigWork Show Mode → "Export Show File" → walks active setlist (`rigwork:
setlists:v2` items: { id, title, presetId, bpm, key, mode, len, notes, rwFile,
sections[] } — rig/src/main.js:6960) → resolves scenes/presets to portable payloads →
`createShowFile` → download + share-link (base64url).

Import: RigWork accepts a `.gpshow.json` / `#show=` hash → confirm modal (reuse the
`?setlist=` bridge UX, rig/src/main.js:7030) → creates a NEW setlist + maps embedded
scenes/presets onto matching gear by defKey → reports unmapped devices.

Live: unchanged — `activateSection` (rig/src/main.js:7374) keeps firing scenes/tracks and
broadcasting `bridgeBroadcastSection` + `syncBroadcast`. The only live-path addition:
include the section's `rw_bar` in the `rig:section` payload so Riffwork can jump.

Riffwork follow: `onRigSection` (riffwork/src/main.js:15286, currently toast-only) →
if payload.rwFile matches a library entry name and file not open: `_pendingJumpBar =
rw_bar; openEntry(id)`; if already open: `jumpToBarIndex(rw_bar)`. Follow mode is an
explicit user toggle (don't yank the editor around uninvited).

## 5. Phasing

- **P1 gp-core** (Sonnet): schema + validators + encode/decode + tests. §6.
- **P2 RigWork** (Sonnet, Opus if the setlist-model refactor gets hairy): export,
  import/mapping, `rw_bar` in section editor + broadcast. rig/HANDOFF_SHOWFILE.md.
- **P3 Riffwork** (Sonnet, SURGICAL — 15.5k-line main.js, check CLAUDE.md lanes):
  follow-mode toggle + open/jump wiring. riffwork/HANDOFF_SHOWFILE.md.
- **P4 dogfood** (Heath + any model): build the Grey Pilgrim drone set as the first real
  Show File; feeds the DOGFOOD GATE and the release roadmap.

P1 → P2 → P3 strictly ordered (each consumes the previous). P4 needs P2 only.

## 6. gp-core tasks (P1)

1. `src/song/showfile.js`: `createShowFile`, `normalizeShowFile`, `encodeShowFile`,
   `decodeShowFile` (follow rig-track.js:120 base64url pattern), `SHOWFILE_KINDS` if
   needed. Follow SCHEMA_RULES.md (`_v:1`, spread-merge normalize, no breaking fields).
2. Export from `src/song/index.js`; bump minor version; tests mirroring existing song
   package tests (round-trip encode/decode, normalize of partial objects, unknown-field
   preservation).
3. Do NOT add RigWork-specific translators here (decision 4).

## 7. Acceptance (whole feature)

- Round-trip: export a Show File from a rig with 2+ devices, import on a fresh
  browser profile, gear mapped by defKey, setlist playable, unmapped devices reported.
- Live: advancing a section in RigWork opens/jumps the right Riffwork tab via rw_bar
  with follow mode on; does nothing with it off.
- A Show File with zero rig data (tabs + tempo only) still imports and conducts click +
  Riffwork — the artifact degrades gracefully for players with no MIDI gear.
- No regression to Live Sync host/follow (rig/src/main.js:7798,:7810) or the
  tools-site `?setlist=` bridge (:7030).
