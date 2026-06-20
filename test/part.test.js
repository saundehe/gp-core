import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PPQ, NOTE_NAMES, midiToNoteName, midiToOctave,
  createNote, normalizeNote,
  PART_KINDS, SCALE_NAMES, SCALE_NAME_MAP,
  createPart, normalizePart,
  createPartSet, normalizePartSet, conjureJamToPartSet,
  DRUM_VOICES,
  encodePart, decodePart,
} from '../src/part/index.js';

// ── Note ──────────────────────────────────────────────────────────────────────

test('DEFAULT_PPQ is 4', () => {
  assert.equal(DEFAULT_PPQ, 4);
});

test('NOTE_NAMES has 12 entries', () => {
  assert.equal(NOTE_NAMES.length, 12);
  assert.equal(NOTE_NAMES[0], 'C');
  assert.equal(NOTE_NAMES[11], 'B');
});

test('midiToNoteName wraps correctly', () => {
  assert.equal(midiToNoteName(60), 'C');   // middle C
  assert.equal(midiToNoteName(61), 'C#');
  assert.equal(midiToNoteName(69), 'A');   // A4 = 440 Hz
  assert.equal(midiToNoteName(72), 'C');   // C5
});

test('midiToOctave', () => {
  assert.equal(midiToOctave(60), 4);   // C4
  assert.equal(midiToOctave(48), 3);   // C3
  assert.equal(midiToOctave(21), 0);   // A0 (lowest piano key)
});

test('createNote defaults', () => {
  const n = createNote();
  assert.equal(n._v, 1);
  assert.equal(n.pitch, 60);
  assert.equal(n.onset, 0);
  assert.equal(n.dur, DEFAULT_PPQ);
  assert.equal(n.vel, 80);
});

test('createNote with props', () => {
  const n = createNote({ pitch: 69, onset: 8, dur: 4, vel: 100 });
  assert.equal(n._v, 1);
  assert.equal(n.pitch, 69);
  assert.equal(n.onset, 8);
  assert.equal(n.dur, 4);
  assert.equal(n.vel, 100);
});

test('createNote preserve-unknown fields', () => {
  const n = createNote({ string: 2, fret: 5 });
  assert.equal(n._v, 1);
  assert.equal(n.string, 2);
  assert.equal(n.fret, 5);
});

test('normalizeNote - already _v:1', () => {
  const n = createNote({ pitch: 64, onset: 4 });
  const r = normalizeNote(n);
  assert.equal(r._v, 1);
  assert.equal(r.pitch, 64);
});

test('normalizeNote - Conjure format {t, midi, dur, vel}', () => {
  const conjureNote = { t: 8, midi: 55, dur: 4, vel: 90 };
  const r = normalizeNote(conjureNote);
  assert.equal(r._v, 1);
  assert.equal(r.pitch, 55);
  assert.equal(r.onset, 8);
  assert.equal(r.dur, 4);
  assert.equal(r.vel, 90);
});

test('normalizeNote - null returns null', () => {
  assert.equal(normalizeNote(null), null);
});

// ── Part ──────────────────────────────────────────────────────────────────────

test('PART_KINDS has expected values', () => {
  assert.equal(PART_KINDS.melodic,  'melodic');
  assert.equal(PART_KINDS.bass,     'bass');
  assert.equal(PART_KINDS.chord,    'chord');
  assert.equal(PART_KINDS.rhythmic, 'rhythmic');
});

test('SCALE_NAMES has expected values', () => {
  assert.equal(SCALE_NAMES.major,         'major');
  assert.equal(SCALE_NAMES.natural_minor, 'natural_minor');
  assert.equal(SCALE_NAMES.dorian,        'dorian');
});

test('SCALE_NAME_MAP maps Conjure display names', () => {
  assert.equal(SCALE_NAME_MAP['Natural Minor'], SCALE_NAMES.natural_minor);
  assert.equal(SCALE_NAME_MAP['Major'],         SCALE_NAMES.major);
  assert.equal(SCALE_NAME_MAP['Dorian'],        SCALE_NAMES.dorian);
});

test('createPart defaults', () => {
  const p = createPart();
  assert.equal(p._v, 1);
  assert.ok(p.id);
  assert.equal(p.kind, PART_KINDS.melodic);
  assert.equal(p.tempo, 120);
  assert.equal(p.key, 'C');
  assert.equal(p.scale, SCALE_NAMES.natural_minor);
  assert.deepEqual(p.timeSignature, [4, 4]);
  assert.equal(p.bars, 4);
  assert.equal(p.ppq, DEFAULT_PPQ);
  assert.deepEqual(p.notes, []);
});

test('createPart with notes round-trip', () => {
  const notes = [createNote({ pitch: 60, onset: 0, dur: 4 })];
  const p = createPart({ kind: PART_KINDS.bass, tempo: 95, key: 'G', notes });
  assert.equal(p._v, 1);
  assert.equal(p.kind, PART_KINDS.bass);
  assert.equal(p.tempo, 95);
  assert.equal(p.key, 'G');
  assert.equal(p.notes.length, 1);
  assert.equal(p.notes[0].pitch, 60);
});

test('createPart preserve-unknown fields', () => {
  const p = createPart({ feel: 'Doom', swing: 0.2 });
  assert.equal(p._v, 1);
  assert.equal(p.feel, 'Doom');
  assert.equal(p.swing, 0.2);
});

test('normalizePart - already _v:1 normalizes nested notes', () => {
  const p = createPart({ notes: [createNote({ pitch: 55 })] });
  const r = normalizePart(p);
  assert.equal(r._v, 1);
  assert.equal(r.notes[0]._v, 1);
  assert.equal(r.notes[0].pitch, 55);
});

test('normalizePart - Conjure layer format', () => {
  const layer = {
    type: 'bass',
    _notes: [
      { t: 0, midi: 43, dur: 4, vel: 90 },
      { t: 4, midi: 41, dur: 4, vel: 85 },
    ],
  };
  const ctx = { rootIndex: 7, scaleName: 'Natural Minor', tempo: 95, bars: 4 };
  const r = normalizePart(layer, ctx);
  assert.equal(r._v, 1);
  assert.equal(r.kind, PART_KINDS.bass);
  assert.equal(r.key, 'G');
  assert.equal(r.scale, SCALE_NAMES.natural_minor);
  assert.equal(r.tempo, 95);
  assert.equal(r.bars, 4);
  assert.equal(r.notes.length, 2);
  assert.equal(r.notes[0].pitch, 43);
  assert.equal(r.notes[0].onset, 0);
});

test('normalizePart - Conjure arp type → melodic kind', () => {
  const layer = { type: 'arp', _notes: [] };
  const r = normalizePart(layer, {});
  assert.equal(r.kind, PART_KINDS.melodic);
});

test('normalizePart - Conjure percussion type → rhythmic kind', () => {
  const layer = { type: 'percussion', _notes: [] };
  const r = normalizePart(layer, {});
  assert.equal(r.kind, PART_KINDS.rhythmic);
});

test('normalizePart - null returns null', () => {
  assert.equal(normalizePart(null), null);
});

// ── PartSet ───────────────────────────────────────────────────────────────────

test('createPartSet defaults', () => {
  const ps = createPartSet();
  assert.equal(ps._v, 1);
  assert.ok(ps.id);
  assert.equal(ps.source, null);
  assert.deepEqual(ps.parts, []);
});

test('createPartSet with parts', () => {
  const parts = [createPart({ kind: PART_KINDS.bass }), createPart({ kind: PART_KINDS.melodic })];
  const ps = createPartSet({ name: 'test jam', source: 'conjure', parts });
  assert.equal(ps._v, 1);
  assert.equal(ps.name, 'test jam');
  assert.equal(ps.source, 'conjure');
  assert.equal(ps.parts.length, 2);
});

test('normalizePartSet - already _v:1', () => {
  const ps = createPartSet({ parts: [createPart()] });
  const r = normalizePartSet(ps);
  assert.equal(r._v, 1);
  assert.equal(r.parts.length, 1);
  assert.equal(r.parts[0]._v, 1);
});

test('normalizePartSet - null returns null', () => {
  assert.equal(normalizePartSet(null), null);
});

test('conjureJamToPartSet produces a PartSet', () => {
  const jam = {
    bass: [{ t: 0, midi: 43, dur: 4, vel: 90 }],
    lead: [{ t: 0, midi: 67, dur: 2, vel: 80 }],
  };
  const ctx = { rootIndex: 7, scaleName: 'Natural Minor', tempo: 95, bars: 4 };
  const ps = conjureJamToPartSet(jam, ctx);
  assert.equal(ps._v, 1);
  assert.equal(ps.source, 'conjure');
  assert.equal(ps.parts.length, 2);
  const bassP = ps.parts.find(p => p.kind === PART_KINDS.bass);
  assert.ok(bassP);
  assert.equal(bassP.notes[0].pitch, 43);
  assert.equal(bassP.key, 'G');
});

// ── DRUM_VOICES ───────────────────────────────────────────────────────────────

test('DRUM_VOICES has GM-standard pitches', () => {
  assert.equal(DRUM_VOICES.kick.midi, 36);
  assert.equal(DRUM_VOICES.snare.midi, 38);
  assert.equal(DRUM_VOICES.hat_closed.midi, 42);
  assert.equal(DRUM_VOICES.hat_open.midi, 46);
  assert.ok(typeof DRUM_VOICES.kick.label === 'string');
  assert.ok(Object.keys(DRUM_VOICES).length >= 10);
});

// ── Codec ─────────────────────────────────────────────────────────────────────

test('encodePart / decodePart round-trips a Part', () => {
  const part = createPart({
    key: 'E', scale: SCALE_NAMES.natural_minor, tempo: 85, bars: 4,
    kind: PART_KINDS.bass,
    notes: [
      createNote({ pitch: 40, onset: 0, dur: 4 }),
      createNote({ pitch: 43, onset: 4, dur: 4, vel: 95 }),
    ],
  });

  const encoded = encodePart(part);
  assert.ok(typeof encoded === 'string' && encoded.length > 0);
  assert.ok(!/[+/=]/.test(encoded), 'should be base64url (no +, /, =)');

  const decoded = decodePart(encoded);
  assert.equal(decoded.key, 'E');
  assert.equal(decoded.tempo, 85);
  assert.equal(decoded.notes.length, 2);
  assert.equal(decoded.notes[0].pitch, 40);
  assert.equal(decoded.notes[1].onset, 4);
  assert.equal(decoded.notes[1].vel, 95);
});

test('encodePart handles unicode in name', () => {
  const part = createPart({ name: 'Grey Pilgrim - Intro' });
  const decoded = decodePart(encodePart(part));
  assert.equal(decoded.name, 'Grey Pilgrim - Intro');
});

test('decodePart returns null on garbage input', () => {
  assert.equal(decodePart('not!!valid'), null);
  assert.equal(decodePart(''), null);
});
