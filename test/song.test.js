import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SONG_KINDS, createSong, normalizeSong,
  SECTION_KINDS, createSection, normalizeSection,
  createRigAutomation, createRigCue, normalizeRigCue, createRigTrack,
  interpolateRigTrack, upsertCue, removeCue, encodeRigTrack, decodeRigTrack,
  createSetlistEntry, normalizeSetlistEntry,
  createSetlist, normalizeSetlist,
  upsertSetlistEntry, removeSetlistEntry, moveSetlistEntry,
} from '../src/song/index.js';

// ── Song ──────────────────────────────────────────────────────────────────────

test('SONG_KINDS contains expected values', () => {
  assert.equal(SONG_KINDS.original,     'original');
  assert.equal(SONG_KINDS.cover,        'cover');
  assert.equal(SONG_KINDS.instrumental, 'instrumental');
});

test('createSong defaults', () => {
  const s = createSong();
  assert.equal(s._v,       1);
  assert.equal(s.title,    'Untitled');
  assert.equal(s.artist,   '');
  assert.equal(s.key,      'C');
  assert.equal(s.scale,    'major');
  assert.equal(s.tempo,    120);
  assert.equal(s.time_sig, '4/4');
  assert.equal(s.bars,     0);
  assert.deepEqual(s.sections,    []);
  assert.deepEqual(s.parts,       []);
  assert.deepEqual(s.rig_track,   []);
  assert.deepEqual(s.clock_track, []);
});

test('createSong with props', () => {
  const s = createSong({ title: 'Grey Pilgrim', artist: 'GP', key: 'E', scale: 'natural_minor', tempo: 95, timeSignature: '6/8', bars: 32 });
  assert.equal(s.title,    'Grey Pilgrim');
  assert.equal(s.key,      'E');
  assert.equal(s.scale,    'natural_minor');
  assert.equal(s.tempo,    95);
  assert.equal(s.time_sig, '6/8');
  assert.equal(s.bars,     32);
});

test('createSong preserves unknown fields', () => {
  const s = createSong({ title: 'Test', tuning: 'drop_d' });
  assert.equal(s.tuning, 'drop_d');
});

test('normalizeSong - already _v:1 passes through', () => {
  const s = createSong({ title: 'Doom' });
  assert.strictEqual(normalizeSong(s), s);
});

test('normalizeSong - null returns null', () => {
  assert.equal(normalizeSong(null), null);
});

test('normalizeSong - legacy object without _v gets upgraded', () => {
  const raw = { title: 'Old Song', key: 'D', tempo: 80 };
  const s = normalizeSong(raw);
  assert.equal(s._v,    1);
  assert.equal(s.title, 'Old Song');
  assert.equal(s.key,   'D');
  assert.equal(s.tempo, 80);
});

// ── Section ───────────────────────────────────────────────────────────────────

test('SECTION_KINDS contains expected values', () => {
  assert.equal(SECTION_KINDS.intro,  'intro');
  assert.equal(SECTION_KINDS.verse,  'verse');
  assert.equal(SECTION_KINDS.chorus, 'chorus');
  assert.equal(SECTION_KINDS.bridge, 'bridge');
  assert.equal(SECTION_KINDS.outro,  'outro');
});

test('createSection defaults', () => {
  const sec = createSection();
  assert.equal(sec._v,        1);
  assert.equal(sec.name,      '');
  assert.equal(sec.kind,      'verse');
  assert.equal(sec.start_bar, 1);
  assert.equal(sec.end_bar,   4);
  assert.deepEqual(sec.tags,  []);
});

test('createSection with props', () => {
  const sec = createSection({ name: 'Chorus 1', kind: 'chorus', startBar: 9, endBar: 16, tags: ['heavy'] });
  assert.equal(sec.name,      'Chorus 1');
  assert.equal(sec.kind,      'chorus');
  assert.equal(sec.start_bar, 9);
  assert.equal(sec.end_bar,   16);
  assert.deepEqual(sec.tags,  ['heavy']);
});

test('createSection preserves unknown fields', () => {
  const sec = createSection({ name: 'V1', color: '#f00' });
  assert.equal(sec.color, '#f00');
});

test('normalizeSection - already _v:1 passes through', () => {
  const sec = createSection({ name: 'Intro' });
  assert.strictEqual(normalizeSection(sec), sec);
});

test('normalizeSection - null returns null', () => {
  assert.equal(normalizeSection(null), null);
});

test('normalizeSection - snake_case fields', () => {
  const raw = { name: 'Verse 1', kind: 'verse', start_bar: 5, end_bar: 12, tags: ['quiet'] };
  const sec = normalizeSection(raw);
  assert.equal(sec._v,        1);
  assert.equal(sec.start_bar, 5);
  assert.equal(sec.end_bar,   12);
});

// ── RigAutomation ─────────────────────────────────────────────────────────────

test('createRigAutomation defaults', () => {
  const a = createRigAutomation({ cc: 74, value: 127 });
  assert.equal(a._v,       1);
  assert.equal(a.cc,       74);
  assert.equal(a.value,    127);
  assert.equal(a.ramp_bars, 0);
  assert.equal(a.device_id, null);
});

test('createRigAutomation with ramp', () => {
  const a = createRigAutomation({ cc: 11, value: 64, rampBars: 4, deviceId: 'strymon-timeline' });
  assert.equal(a.ramp_bars, 4);
  assert.equal(a.device_id, 'strymon-timeline');
});

// ── RigCue ────────────────────────────────────────────────────────────────────

test('createRigCue defaults', () => {
  const c = createRigCue();
  assert.equal(c._v,       1);
  assert.equal(c.bar,      1);
  assert.equal(c.preset_id, null);
  assert.equal(c.scene_id,  null);
  assert.equal(c.device_id, null);
  assert.deepEqual(c.automations, []);
  assert.equal(c.note, '');
});

test('createRigCue with preset and scene', () => {
  const c = createRigCue({ bar: 9, presetId: 'chorus-lead', sceneId: 'sc-chorus', note: 'hit drive' });
  assert.equal(c.bar,       9);
  assert.equal(c.preset_id, 'chorus-lead');
  assert.equal(c.scene_id,  'sc-chorus');
  assert.equal(c.note,      'hit drive');
});

test('createRigCue normalizes raw automations', () => {
  const c = createRigCue({
    bar: 1,
    automations: [{ cc: 74, value: 0 }],  // raw, no _v
  });
  assert.equal(c.automations.length, 1);
  assert.equal(c.automations[0]._v, 1);
  assert.equal(c.automations[0].cc, 74);
});

test('createRigCue preserves already-normalized automations', () => {
  const a = createRigAutomation({ cc: 11, value: 64 });
  const c = createRigCue({ automations: [a] });
  assert.strictEqual(c.automations[0], a);
});

test('normalizeRigCue - already _v:1 passes through', () => {
  const c = createRigCue({ bar: 3 });
  assert.strictEqual(normalizeRigCue(c), c);
});

test('normalizeRigCue - null returns null', () => {
  assert.equal(normalizeRigCue(null), null);
});

test('normalizeRigCue - snake_case source fields', () => {
  const raw = { bar: 5, preset_id: 'p1', scene_id: 's1', automations: [] };
  const c = normalizeRigCue(raw);
  assert.equal(c._v,       1);
  assert.equal(c.preset_id, 'p1');
});

// ── RigTrack ──────────────────────────────────────────────────────────────────

test('createRigTrack returns sorted cues', () => {
  const track = createRigTrack([
    { bar: 9,  preset_id: 'chorus' },
    { bar: 1,  preset_id: 'intro'  },
    { bar: 17, preset_id: 'outro'  },
  ]);
  assert.equal(track.length, 3);
  assert.equal(track[0].bar, 1);
  assert.equal(track[1].bar, 9);
  assert.equal(track[2].bar, 17);
});

test('createRigTrack passes through already-normalized cues', () => {
  const c = createRigCue({ bar: 1 });
  const track = createRigTrack([c]);
  assert.strictEqual(track[0], c);
});

test('createRigTrack empty input', () => {
  assert.deepEqual(createRigTrack([]), []);
  assert.deepEqual(createRigTrack(),   []);
});

// ── Song with sections + rig_track integration ────────────────────────────────

test('createSong embeds sections and rig_track', () => {
  const song = createSong({
    title: 'Doom Riff',
    key: 'E',
    scale: 'natural_minor',
    tempo: 80,
    bars: 32,
    sections: [
      createSection({ name: 'Intro', kind: 'intro', startBar: 1, endBar: 8 }),
      createSection({ name: 'Verse', kind: 'verse', startBar: 9, endBar: 24 }),
    ],
    rigTrack: createRigTrack([
      createRigCue({ bar: 1,  presetId: 'clean',  note: 'clean' }),
      createRigCue({ bar: 9,  presetId: 'drive',  note: 'add drive' }),
      createRigCue({ bar: 25, presetId: 'chorus-lead' }),
    ]),
  });

  assert.equal(song._v, 1);
  assert.equal(song.sections.length, 2);
  assert.equal(song.sections[0].name, 'Intro');
  assert.equal(song.rig_track.length, 3);
  assert.equal(song.rig_track[0].bar, 1);
  assert.equal(song.rig_track[1].preset_id, 'drive');
});

// ── interpolateRigTrack ───────────────────────────────────────────────────────

test('interpolateRigTrack - empty track returns []', () => {
  assert.deepEqual(interpolateRigTrack([], 1), []);
});

test('interpolateRigTrack - instant CC at or before bar', () => {
  const track = createRigTrack([
    createRigCue({ bar: 1, automations: [createRigAutomation({ cc: 74, value: 0 })] }),
  ]);
  const state = interpolateRigTrack(track, 1);
  assert.equal(state.length, 1);
  assert.equal(state[0].cc, 74);
  assert.equal(state[0].value, 0);
  assert.equal(state[0].deviceId, null);
});

test('interpolateRigTrack - cue after bar not included', () => {
  const track = createRigTrack([
    createRigCue({ bar: 9, automations: [createRigAutomation({ cc: 74, value: 127 })] }),
  ]);
  assert.deepEqual(interpolateRigTrack(track, 8), []);
});

test('interpolateRigTrack - later cue overrides earlier same CC', () => {
  const track = createRigTrack([
    createRigCue({ bar: 1, automations: [createRigAutomation({ cc: 74, value: 0 })] }),
    createRigCue({ bar: 9, automations: [createRigAutomation({ cc: 74, value: 127 })] }),
  ]);
  const state = interpolateRigTrack(track, 9);
  assert.equal(state.length, 1);
  assert.equal(state[0].value, 127);
});

test('interpolateRigTrack - ramp midpoint interpolates linearly', () => {
  const track = createRigTrack([
    createRigCue({ bar: 1, automations: [createRigAutomation({ cc: 11, value: 0 })] }),
    createRigCue({ bar: 9, automations: [createRigAutomation({ cc: 11, value: 127, rampBars: 4 })] }),
  ]);
  // at bar 11: t = (11-9)/4 = 0.5 → value = round(0 + 127*0.5) = 64
  const state = interpolateRigTrack(track, 11);
  const entry = state.find(e => e.cc === 11);
  assert.equal(entry.value, 64);
});

test('interpolateRigTrack - ramp completed gives target value', () => {
  const track = createRigTrack([
    createRigCue({ bar: 1, automations: [createRigAutomation({ cc: 11, value: 0 })] }),
    createRigCue({ bar: 9, automations: [createRigAutomation({ cc: 11, value: 127, rampBars: 4 })] }),
  ]);
  // bar 13 = rampEndBar; bar 15 > rampEndBar → settled at 127
  assert.equal(interpolateRigTrack(track, 13).find(e => e.cc === 11).value, 127);
  assert.equal(interpolateRigTrack(track, 15).find(e => e.cc === 11).value, 127);
});

test('interpolateRigTrack - deviceId is passed through', () => {
  const track = createRigTrack([
    createRigCue({ bar: 1, automations: [createRigAutomation({ cc: 19, value: 80, deviceId: 'mercury7' })] }),
  ]);
  const state = interpolateRigTrack(track, 1);
  assert.equal(state[0].deviceId, 'mercury7');
});

test('interpolateRigTrack - multiple CCs on same cue', () => {
  const track = createRigTrack([
    createRigCue({ bar: 1, automations: [
      createRigAutomation({ cc: 14, value: 0 }),
      createRigAutomation({ cc: 19, value: 127 }),
      createRigAutomation({ cc: 20, value: 80  }),
    ]}),
  ]);
  const state = interpolateRigTrack(track, 1);
  assert.equal(state.length, 3);
  const byCC = Object.fromEntries(state.map(e => [e.cc, e.value]));
  assert.equal(byCC[14],  0);
  assert.equal(byCC[19], 127);
  assert.equal(byCC[20],  80);
});

// ── upsertCue + removeCue ─────────────────────────────────────────────────────

test('upsertCue - inserts new cue and keeps sort order', () => {
  const track = createRigTrack([createRigCue({ bar: 1 }), createRigCue({ bar: 17 })]);
  const updated = upsertCue(track, createRigCue({ bar: 9, presetId: 'chorus' }));
  assert.equal(updated.length, 3);
  assert.equal(updated[1].bar, 9);
  assert.equal(updated[1].preset_id, 'chorus');
});

test('upsertCue - replaces existing cue at same bar', () => {
  const track = createRigTrack([createRigCue({ bar: 9, presetId: 'old' })]);
  const updated = upsertCue(track, createRigCue({ bar: 9, presetId: 'new' }));
  assert.equal(updated.length, 1);
  assert.equal(updated[0].preset_id, 'new');
});

test('removeCue - removes cue at given bar', () => {
  const track = createRigTrack([createRigCue({ bar: 1 }), createRigCue({ bar: 9 }), createRigCue({ bar: 17 })]);
  const updated = removeCue(track, 9);
  assert.equal(updated.length, 2);
  assert.ok(updated.every(c => c.bar !== 9));
});

test('removeCue - no-op when bar not found', () => {
  const track = createRigTrack([createRigCue({ bar: 1 })]);
  assert.equal(removeCue(track, 99).length, 1);
});

// ── encodeRigTrack / decodeRigTrack ───────────────────────────────────────────

test('encodeRigTrack + decodeRigTrack round-trip', () => {
  const track = createRigTrack([
    createRigCue({ bar: 1,  presetId: 'clean',  automations: [createRigAutomation({ cc: 14, value: 0 })] }),
    createRigCue({ bar: 9,  presetId: 'drive',  automations: [createRigAutomation({ cc: 14, value: 127, rampBars: 4 })] }),
    createRigCue({ bar: 17, presetId: 'chorus' }),
  ]);
  const encoded = encodeRigTrack(track);
  assert.equal(typeof encoded, 'string');
  assert.ok(!encoded.includes('='), 'no padding chars');
  const decoded = decodeRigTrack(encoded);
  assert.equal(decoded.length, 3);
  assert.equal(decoded[0].preset_id, 'clean');
  assert.equal(decoded[1].automations[0].ramp_bars, 4);
  assert.equal(decoded[2].bar, 17);
});

test('decodeRigTrack - returns [] on garbage input', () => {
  assert.deepEqual(decodeRigTrack('not-valid-base64!!!'), []);
});

// ── createSong with clock_track ───────────────────────────────────────────────

test('createSong accepts clockTrack and stores as clock_track', () => {
  const clockCue = { bar: 9, osc_messages: [], note: 'chorus drop' };
  const s = createSong({ title: 'Doom', clockTrack: [clockCue] });
  assert.equal(s.clock_track.length, 1);
  assert.equal(s.clock_track[0].bar, 9);
});

test('createSong with both rig_track and clock_track', () => {
  const song = createSong({
    title: 'Grey Pilgrim',
    key: 'E',
    tempo: 80,
    bars: 32,
    rigTrack: createRigTrack([
      createRigCue({ bar: 1, presetId: 'intro-clean' }),
      createRigCue({ bar: 9, presetId: 'verse-drive' }),
    ]),
    clockTrack: [
      { bar: 1,  note: 'count-in',    osc_messages: [{ address: '/notch/scene/intro', args: [] }] },
      { bar: 9,  note: 'verse',       osc_messages: [{ address: '/notch/scene/verse', args: [] }] },
    ],
  });
  assert.equal(song._v, 1);
  assert.equal(song.rig_track.length,   2);
  assert.equal(song.clock_track.length, 2);
  assert.equal(song.rig_track[0].preset_id,        'intro-clean');
  assert.equal(song.clock_track[0].osc_messages[0].address, '/notch/scene/intro');
  assert.equal(song.clock_track[1].bar,             9);
});

test('createSong preserves unknown fields after adding clock_track', () => {
  const s = createSong({ title: 'Test', liveNotes: 'check tuning' });
  assert.equal(s.liveNotes, 'check tuning');
  assert.deepEqual(s.clock_track, []);
});

// ── SetlistEntry ──────────────────────────────────────────────────────────────

test('createSetlistEntry defaults', () => {
  const e = createSetlistEntry();
  assert.equal(e._v,       1);
  assert.equal(e.song_id,  null);
  assert.equal(e.song_title, '');
  assert.equal(e.key,      null);
  assert.equal(e.transpose, 0);
  assert.equal(e.tempo_mult, 1.0);
  assert.equal(e.notes,    '');
});

test('createSetlistEntry with props', () => {
  const e = createSetlistEntry({ songId: 'abc', songTitle: 'Doom Riff', key: 'Eb', transpose: -1, tempoMult: 0.95, notes: 'drop D' });
  assert.equal(e.song_id,    'abc');
  assert.equal(e.song_title, 'Doom Riff');
  assert.equal(e.key,        'Eb');
  assert.equal(e.transpose,  -1);
  assert.equal(e.tempo_mult, 0.95);
  assert.equal(e.notes,      'drop D');
});

test('createSetlistEntry preserves unknown fields', () => {
  const e = createSetlistEntry({ songId: 'x', color: '#e8a020' });
  assert.equal(e.color, '#e8a020');
});

test('normalizeSetlistEntry - already _v:1 passes through', () => {
  const e = createSetlistEntry({ songId: 'x' });
  assert.strictEqual(normalizeSetlistEntry(e), e);
});

test('normalizeSetlistEntry - null returns null', () => {
  assert.equal(normalizeSetlistEntry(null), null);
});

test('normalizeSetlistEntry - snake_case source fields', () => {
  const raw = { song_id: 'abc', song_title: 'Riff', tempo_mult: 0.9, transpose: 2 };
  const e = normalizeSetlistEntry(raw);
  assert.equal(e._v,        1);
  assert.equal(e.song_id,   'abc');
  assert.equal(e.tempo_mult, 0.9);
  assert.equal(e.transpose,  2);
});

// ── Setlist ───────────────────────────────────────────────────────────────────

test('createSetlist defaults', () => {
  const sl = createSetlist();
  assert.equal(sl._v,    1);
  assert.equal(sl.id,    '');
  assert.equal(sl.name,  'Main Set');
  assert.deepEqual(sl.entries, []);
  assert.equal(sl.notes, '');
});

test('createSetlist with entries (raw)', () => {
  const sl = createSetlist({
    id: 'sl-1',
    name: 'Night 1',
    entries: [
      { songId: 'a', songTitle: 'Intro Doom' },
      { songId: 'b', songTitle: 'Verse Crush' },
    ],
  });
  assert.equal(sl.entries.length,         2);
  assert.equal(sl.entries[0]._v,          1);
  assert.equal(sl.entries[0].song_title,  'Intro Doom');
  assert.equal(sl.entries[1].song_id,     'b');
});

test('createSetlist preserves already-normalized entries', () => {
  const e = createSetlistEntry({ songId: 'x' });
  const sl = createSetlist({ entries: [e] });
  assert.strictEqual(sl.entries[0], e);
});

test('createSetlist preserves unknown fields', () => {
  const sl = createSetlist({ name: 'Test', venue: 'The Smell' });
  assert.equal(sl.venue, 'The Smell');
});

test('normalizeSetlist - already _v:1 passes through', () => {
  const sl = createSetlist({ name: 'Encore' });
  assert.strictEqual(normalizeSetlist(sl), sl);
});

test('normalizeSetlist - null returns null', () => {
  assert.equal(normalizeSetlist(null), null);
});

test('normalizeSetlist - raw object without _v gets upgraded', () => {
  const raw = { name: 'Main Set', entries: [{ song_id: 'z', song_title: 'Closer' }] };
  const sl = normalizeSetlist(raw);
  assert.equal(sl._v,              1);
  assert.equal(sl.name,            'Main Set');
  assert.equal(sl.entries[0]._v,   1);
  assert.equal(sl.entries[0].song_id, 'z');
});

// ── upsertSetlistEntry / removeSetlistEntry / moveSetlistEntry ────────────────

test('upsertSetlistEntry - appends when idx < 0', () => {
  const entries = [createSetlistEntry({ songId: 'a' }), createSetlistEntry({ songId: 'b' })];
  const updated = upsertSetlistEntry(entries, createSetlistEntry({ songId: 'c' }), -1);
  assert.equal(updated.length,        3);
  assert.equal(updated[2].song_id,    'c');
});

test('upsertSetlistEntry - replaces at specific index', () => {
  const entries = [createSetlistEntry({ songId: 'a' }), createSetlistEntry({ songId: 'b' })];
  const updated = upsertSetlistEntry(entries, createSetlistEntry({ songId: 'z' }), 0);
  assert.equal(updated.length,     2);
  assert.equal(updated[0].song_id, 'z');
  assert.equal(updated[1].song_id, 'b');
});

test('removeSetlistEntry - removes at given index', () => {
  const entries = [
    createSetlistEntry({ songId: 'a' }),
    createSetlistEntry({ songId: 'b' }),
    createSetlistEntry({ songId: 'c' }),
  ];
  const updated = removeSetlistEntry(entries, 1);
  assert.equal(updated.length,     2);
  assert.equal(updated[0].song_id, 'a');
  assert.equal(updated[1].song_id, 'c');
});

test('moveSetlistEntry - moves entry forward', () => {
  const entries = ['a', 'b', 'c', 'd'].map(id => createSetlistEntry({ songId: id }));
  const updated = moveSetlistEntry(entries, 0, 2);
  assert.deepEqual(updated.map(e => e.song_id), ['b', 'c', 'a', 'd']);
});

test('moveSetlistEntry - moves entry backward', () => {
  const entries = ['a', 'b', 'c', 'd'].map(id => createSetlistEntry({ songId: id }));
  const updated = moveSetlistEntry(entries, 3, 1);
  assert.deepEqual(updated.map(e => e.song_id), ['a', 'd', 'b', 'c']);
});

test('moveSetlistEntry - no-op when same index', () => {
  const entries = ['a', 'b'].map(id => createSetlistEntry({ songId: id }));
  const updated = moveSetlistEntry(entries, 0, 0);
  assert.deepEqual(updated.map(e => e.song_id), ['a', 'b']);
});
