import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SCALE_INTERVALS, CHORD_INTERVALS, CHORD_QUALITIES, CHORD_SUFFIX,
  rootToIndex, indexToRoot, scalePitchClasses, isInScale, scaleNotesInRange, scaleDegree,
  chordNotes, chordName, detectChord,
  GUITAR_TUNINGS, fretPositions,
} from '../src/theory/index.js';

// ── Intervals ─────────────────────────────────────────────────────────────────

test('SCALE_INTERVALS natural_minor is correct', () => {
  assert.deepEqual(SCALE_INTERVALS.natural_minor, [0, 2, 3, 5, 7, 8, 10]);
});

test('SCALE_INTERVALS major is correct', () => {
  assert.deepEqual(SCALE_INTERVALS.major, [0, 2, 4, 5, 7, 9, 11]);
});

test('SCALE_INTERVALS dorian differs from natural_minor on 6th', () => {
  // Dorian raises the 6th: [0,2,3,5,7,9,10] vs [0,2,3,5,7,8,10]
  assert.equal(SCALE_INTERVALS.dorian[5], 9);
  assert.equal(SCALE_INTERVALS.natural_minor[5], 8);
});

test('CHORD_INTERVALS minor triad is [0,3,7]', () => {
  assert.deepEqual(CHORD_INTERVALS.minor, [0, 3, 7]);
});

test('CHORD_INTERVALS dom7 is [0,4,7,10]', () => {
  assert.deepEqual(CHORD_INTERVALS.dom7, [0, 4, 7, 10]);
});

test('CHORD_SUFFIX minor is "m"', () => {
  assert.equal(CHORD_SUFFIX.minor, 'm');
  assert.equal(CHORD_SUFFIX.major, '');
  assert.equal(CHORD_SUFFIX.dom7, '7');
});

// ── Scale helpers ─────────────────────────────────────────────────────────────

test('rootToIndex parses note names', () => {
  assert.equal(rootToIndex('C'),  0);
  assert.equal(rootToIndex('C#'), 1);
  assert.equal(rootToIndex('A'),  9);
  assert.equal(rootToIndex('B'),  11);
});

test('rootToIndex handles enharmonics', () => {
  assert.equal(rootToIndex('Db'), 1);
  assert.equal(rootToIndex('Eb'), 3);
  assert.equal(rootToIndex('Bb'), 10);
});

test('rootToIndex passes through integers', () => {
  assert.equal(rootToIndex(0),  0);
  assert.equal(rootToIndex(9),  9);
  assert.equal(rootToIndex(12), 0);  // wraps
});

test('rootToIndex returns null for unknown', () => {
  assert.equal(rootToIndex('X'), null);
});

test('indexToRoot returns correct names', () => {
  assert.equal(indexToRoot(0),  'C');
  assert.equal(indexToRoot(9),  'A');
  assert.equal(indexToRoot(11), 'B');
  assert.equal(indexToRoot(60), 'C');  // MIDI middle C
});

test('scalePitchClasses E natural_minor contains E G A B', () => {
  const pcs = scalePitchClasses('E', 'natural_minor');
  // E=4, F#=6, G=7, A=9, B=11, C=0, D=2
  assert.ok(pcs.has(4));   // E
  assert.ok(pcs.has(7));   // G
  assert.ok(pcs.has(9));   // A
  assert.ok(pcs.has(11));  // B
  assert.ok(!pcs.has(8));  // F (not in E minor)
  assert.equal(pcs.size, 7);
});

test('scalePitchClasses A major contains A B C# D E F# G#', () => {
  const pcs = scalePitchClasses('A', 'major');
  // A=9, B=11, C#=1, D=2, E=4, F#=6, G#=8
  assert.ok(pcs.has(9));  // A
  assert.ok(pcs.has(1));  // C#
  assert.ok(!pcs.has(0)); // C natural — not in A major
  assert.equal(pcs.size, 7);
});

test('isInScale E natural_minor: E4=64 is in, F4=65 is not', () => {
  assert.ok(isInScale(64, 'E', 'natural_minor'));   // E4
  assert.ok(!isInScale(65, 'E', 'natural_minor'));  // F4
});

test('scaleNotesInRange E natural_minor 60-72 returns correct MIDI set', () => {
  const notes = scaleNotesInRange('E', 'natural_minor', 60, 72);
  // E natural minor: E F# G A B C D
  assert.ok(notes.includes(64));  // E4
  assert.ok(notes.includes(66));  // F#4 (degree 1 of E minor)
  assert.ok(notes.includes(67));  // G4
  assert.ok(notes.includes(69));  // A4
  assert.ok(notes.includes(71));  // B4
  assert.ok(!notes.includes(65)); // F natural — not in E minor
  assert.ok(!notes.includes(68)); // G# — not in E natural minor
});

test('scaleNotesInRange pentatonic has 5 notes per octave', () => {
  // 45=A2, 56=G#3 (exclusive of A3=57 so range captures exactly one octave)
  const notes = scaleNotesInRange('A', 'pentatonic', 45, 56);
  assert.equal(notes.length, 5);  // A2 C3 D3 E3 G3
});

test('scaleDegree returns correct degree', () => {
  // E natural minor degrees: E=0, F#=1, G=2, A=3, B=4, C=5, D=6
  assert.equal(scaleDegree(64, 'E', 'natural_minor'), 0);  // E4 = root (degree 0)
  assert.equal(scaleDegree(67, 'E', 'natural_minor'), 2);  // G4 = minor 3rd (degree 2)
  assert.equal(scaleDegree(65, 'E', 'natural_minor'), -1); // F4 = not in scale
});

// ── Chord helpers ─────────────────────────────────────────────────────────────

test('chordNotes C major octave 4 returns [60,64,67]', () => {
  assert.deepEqual(chordNotes('C', 'major', 4), [60, 64, 67]);
});

test('chordNotes A minor octave 3 returns [57,60,64]', () => {
  // A3=57, C4=60, E4=64 (standard MIDI: A4=69)
  assert.deepEqual(chordNotes('A', 'minor', 3), [57, 60, 64]);
});

test('chordNotes G dom7 octave 3', () => {
  // G3=55, B3=59, D4=62, F4=65
  assert.deepEqual(chordNotes('G', 'dom7', 3), [55, 59, 62, 65]);
});

test('chordName formats correctly', () => {
  assert.equal(chordName('A', 'minor'),  'Am');
  assert.equal(chordName('C', 'major'),  'C');
  assert.equal(chordName('G', 'dom7'),   'G7');
  assert.equal(chordName('B', 'dim'),    'Bdim');
  assert.equal(chordName('F#', 'maj7'),  'F#maj7');
});

test('chordName works with pitch class index', () => {
  assert.equal(chordName(9, 'minor'), 'Am');
  assert.equal(chordName(0, 'major'), 'C');
});

test('detectChord identifies C major triad', () => {
  const result = detectChord([60, 64, 67]);  // C E G
  assert.ok(result !== null);
  assert.equal(result.rootName, 'C');
  assert.equal(result.quality, 'major');
  assert.equal(result.name, 'C');
});

test('detectChord identifies A minor triad', () => {
  const result = detectChord([57, 60, 64]);  // A C E
  assert.ok(result !== null);
  assert.equal(result.rootName, 'A');
  assert.equal(result.quality, 'minor');
  assert.equal(result.name, 'Am');
});

test('detectChord works across octaves', () => {
  // C major spread across octaves
  const result = detectChord([48, 52, 55, 60, 64]);  // C3 E3 G3 C4 E4
  assert.ok(result !== null);
  assert.equal(result.rootName, 'C');
  assert.equal(result.quality, 'major');
});

test('detectChord returns null for empty input', () => {
  assert.equal(detectChord([]), null);
  assert.equal(detectChord(null), null);
});

test('detectChord returns null below minMatch threshold', () => {
  // Two notes can match many chords; with default 0.75 threshold and a single
  // note, detection should be unreliable — test a genuinely ambiguous case
  // by raising the minMatch bar past 1.0 (impossible to satisfy)
  assert.equal(detectChord([60, 64, 67], 1.5), null);
});

// ── Fretboard ─────────────────────────────────────────────────────────────────

test('GUITAR_TUNINGS standard has 6 strings', () => {
  assert.equal(GUITAR_TUNINGS.standard.length, 6);
  assert.equal(GUITAR_TUNINGS.standard[0], 40); // low E
  assert.equal(GUITAR_TUNINGS.standard[5], 64); // high e
});

test('GUITAR_TUNINGS bass_standard has 4 strings starting at 28', () => {
  assert.equal(GUITAR_TUNINGS.bass_standard.length, 4);
  assert.equal(GUITAR_TUNINGS.bass_standard[0], 28); // low E
});

test('fretPositions finds E notes on E-standard 6-string (open + fret 12)', () => {
  const ePcs = new Set([4]);  // E = pitch class 4
  const positions = fretPositions(GUITAR_TUNINGS.standard, ePcs, 12, 4);
  // String 0 (low E, midi 40): fret 0 (E2), fret 12 (E3)
  const str0 = positions.filter(p => p.string === 0);
  assert.ok(str0.some(p => p.fret === 0 && p.isRoot));
  assert.ok(str0.some(p => p.fret === 12 && p.isRoot));
});

test('fretPositions E natural_minor scale on standard guitar', () => {
  const pcs = scalePitchClasses('E', 'natural_minor');
  const positions = fretPositions(GUITAR_TUNINGS.standard, pcs, 12, 4);
  // Should have many positions; spot-check fret 0 of string 0 is E (root)
  const openLowE = positions.find(p => p.string === 0 && p.fret === 0);
  assert.ok(openLowE);
  assert.ok(openLowE.isRoot);
  // Open A string (midi 45, A2, pc 9) is in E natural minor
  const openA = positions.find(p => p.string === 1 && p.fret === 0);
  assert.ok(openA);
  assert.ok(!openA.isRoot);  // A is not the root
});

test('fretPositions accepts array instead of Set', () => {
  const pcs = [0, 4, 7];  // C major triad pitch classes
  const positions = fretPositions(GUITAR_TUNINGS.standard, pcs, 5);
  assert.ok(positions.length > 0);
});
