import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeB64url, decodeB64url } from '../src/codec.js';

// Shared codec used by @gp/part (encodePart/decodePart), @gp/song's
// encodeRigTrack/decodeRigTrack, and @gp/song's encodeShowFile/decodeShowFile.
// Each call site keeps its own try/catch + fallback; this file tests the
// shared encode/decode round-trip itself, including the chunked-encode path
// that replaced the old per-byte O(n^2) `binary += String.fromCharCode(b)` loop.

test('encodeB64url / decodeB64url round-trips a simple object', () => {
  const obj = { a: 1, b: 'two', c: [1, 2, 3], d: null };
  const encoded = encodeB64url(obj);
  assert.equal(typeof encoded, 'string');
  assert.ok(!/[+/=]/.test(encoded), 'should be base64url (no +, /, =)');
  assert.deepEqual(decodeB64url(encoded), obj);
});

test('encodeB64url / decodeB64url round-trips unicode content byte-for-byte', () => {
  const obj = { name: 'Grey Pilgrim — Doom Set', emoji: '🎸🤘', accents: 'café naïve' };
  const decoded = decodeB64url(encodeB64url(obj));
  assert.deepEqual(decoded, obj);
});

test('encodeB64url / decodeB64url round-trips a large payload spanning multiple chunks', () => {
  // Exercise the chunked String.fromCharCode.apply path (CHUNK_SIZE = 0x8000 bytes) —
  // a naive per-byte string-concat loop is O(n^2) and was the original bug;
  // this payload's UTF-8 encoding is several times larger than one chunk.
  const notes = Array.from({ length: 20000 }, (_, i) => ({
    pitch: 40 + (i % 24), onset: i * 2, dur: 4, vel: 60 + (i % 60),
  }));
  const big = { title: 'Long Set', notes };
  const encoded = decodeB64url(encodeB64url(big));
  assert.equal(encoded.notes.length, 20000);
  assert.deepEqual(encoded.notes[0], notes[0]);
  assert.deepEqual(encoded.notes[19999], notes[19999]);
  assert.deepEqual(encoded, big);
});

test('decodeB64url throws on malformed input (callers map this to their own fallback)', () => {
  assert.throws(() => decodeB64url('not!!valid'));
  assert.throws(() => decodeB64url(''));
});

// ── P2-6: codec is a published subpath export ─────────────────────────────────
// riffwork and rig each hand-roll their own base64url encoder today and are
// already drifting from this shared one (see TODO_gp_core_fable_sweep). This
// pass only publishes "./codec" in package.json exports — it does NOT migrate
// either consumer; that's a follow-up.

test('package.json exports "./codec" pointing at src/codec.js', async () => {
  const { default: pkg } = await import('../package.json', { with: { type: 'json' } });
  assert.equal(pkg.exports['./codec'], './src/codec.js');
});
