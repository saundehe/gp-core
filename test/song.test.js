import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SONG_KINDS, createSong, normalizeSong,
  SECTION_KINDS, createSection, normalizeSection,
  createRigAutomation, createRigCue, normalizeRigCue, createRigTrack,
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
  assert.deepEqual(s.sections,  []);
  assert.deepEqual(s.parts,     []);
  assert.deepEqual(s.rig_track, []);
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
