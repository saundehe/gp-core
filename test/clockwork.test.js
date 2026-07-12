import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OSC_ARG_TYPES, createOscArg, createOscMessage, createOscTarget, normalizeOscTarget, OSC_TARGET_PRESETS,
  createClickTrack, normalizeClickTrack, createTempoChange,
  createClockCue, normalizeClockCue, createClockTrack,
  upsertClockCue, removeClockCue, clockCuesUpTo, resolveTempoAt,
} from '../src/clockwork/index.js';

// ── OSC ───────────────────────────────────────────────────────────────────────

test('OSC_ARG_TYPES has expected values', () => {
  assert.equal(OSC_ARG_TYPES.float,  'f');
  assert.equal(OSC_ARG_TYPES.int,    'i');
  assert.equal(OSC_ARG_TYPES.string, 's');
});

test('createOscArg defaults', () => {
  const a = createOscArg();
  assert.equal(a._v,   1);
  assert.equal(a.type, 'f');
  assert.equal(a.value, 0);
});

test('createOscArg with props', () => {
  const a = createOscArg({ type: 's', value: 'hello' });
  assert.equal(a.type,  's');
  assert.equal(a.value, 'hello');
});

test('createOscMessage defaults', () => {
  const m = createOscMessage();
  assert.equal(m._v, 1);
  assert.equal(m.address, '/');
  assert.deepEqual(m.args, []);
});

test('createOscMessage normalizes raw args', () => {
  const m = createOscMessage({ address: '/notch/scene', args: [{ type: 'i', value: 1 }] });
  assert.equal(m.address, '/notch/scene');
  assert.equal(m.args.length, 1);
  assert.equal(m.args[0]._v, 1);
  assert.equal(m.args[0].type, 'i');
});

test('createOscMessage preserves already-normalized args', () => {
  const arg = createOscArg({ type: 'f', value: 0.5 });
  const m = createOscMessage({ address: '/x', args: [arg] });
  assert.strictEqual(m.args[0], arg);
});

test('createOscTarget defaults', () => {
  const t = createOscTarget();
  assert.equal(t._v,   1);
  assert.equal(t.host, '127.0.0.1');
  assert.equal(t.port, 8000);
  assert.equal(t.id,   '');
});

test('createOscTarget with props', () => {
  const t = createOscTarget({ id: 'notch', host: '192.168.12.10', port: 8000, label: 'Notch' });
  assert.equal(t.id,    'notch');
  assert.equal(t.host,  '192.168.12.10');
  assert.equal(t.label, 'Notch');
});

test('normalizeOscTarget - already _v:1 returns a fresh, value-equal copy (P2-2)', () => {
  const t = createOscTarget({ id: 'x' });
  const n = normalizeOscTarget(t);
  assert.notStrictEqual(n, t);
  assert.deepEqual(n, t);
});

test('normalizeOscTarget - null returns null', () => {
  assert.equal(normalizeOscTarget(null), null);
});

test('OSC_TARGET_PRESETS has expected entries', () => {
  assert.ok(OSC_TARGET_PRESETS.notchLocal);
  assert.ok(OSC_TARGET_PRESETS.tdLocal);
  assert.equal(OSC_TARGET_PRESETS.notchLocal.port, 8000);
  assert.equal(OSC_TARGET_PRESETS.tdLocal.port,    9000);
});

// ── ClickTrack + TempoChange ──────────────────────────────────────────────────

test('createClickTrack defaults', () => {
  const ct = createClickTrack();
  assert.equal(ct._v,         1);
  assert.equal(ct.tempo,      120);
  assert.equal(ct.time_sig,   '4/4');
  assert.equal(ct.subdivision, 4);
  assert.equal(ct.accent_vel, 127);
  assert.equal(ct.beat_vel,   80);
  assert.equal(ct.midi_clock, true);
  assert.equal(ct.midi_port,  null);
  assert.equal(ct.count_in,   0);
});

test('createClickTrack with props', () => {
  const ct = createClickTrack({ tempo: 95, timeSig: '6/8', midiPort: 'gpD', countIn: 2 });
  assert.equal(ct.tempo,     95);
  assert.equal(ct.time_sig,  '6/8');
  assert.equal(ct.midi_port, 'gpD');
  assert.equal(ct.count_in,  2);
});

test('createClickTrack preserves unknown fields', () => {
  const ct = createClickTrack({ tempo: 100, humanize: 0.05 });
  assert.equal(ct.humanize, 0.05);
});

test('normalizeClickTrack - already _v:1 returns a fresh, value-equal copy (P2-2)', () => {
  const ct = createClickTrack({ tempo: 100 });
  const n = normalizeClickTrack(ct);
  assert.notStrictEqual(n, ct);
  assert.deepEqual(n, ct);
});

test('normalizeClickTrack - _v greater than current is preserved, not downgraded (P1-6)', () => {
  const futureRow = { _v: 2, tempo: 140, newField: 'x' };
  const n = normalizeClickTrack(futureRow);
  assert.equal(n._v, 2);
  assert.equal(n.newField, 'x');
});

test('normalizeClickTrack - null returns null', () => {
  assert.equal(normalizeClickTrack(null), null);
});

test('normalizeClickTrack - legacy snake_case fields', () => {
  const raw = { tempo: 140, time_sig: '3/4', accent_vel: 100, midi_clock: false };
  const ct = normalizeClickTrack(raw);
  assert.equal(ct._v,         1);
  assert.equal(ct.tempo,      140);
  assert.equal(ct.time_sig,   '3/4');
  assert.equal(ct.accent_vel, 100);
  assert.equal(ct.midi_clock, false);
});

test('createTempoChange defaults', () => {
  const tc = createTempoChange();
  assert.equal(tc._v,      1);
  assert.equal(tc.bar,     1);
  assert.equal(tc.tempo,   null);
  assert.equal(tc.time_sig, null);
});

test('createTempoChange with props', () => {
  const tc = createTempoChange({ bar: 17, tempo: 160, timeSig: '5/4' });
  assert.equal(tc.bar,      17);
  assert.equal(tc.tempo,    160);
  assert.equal(tc.time_sig, '5/4');
});

// ── ClockCue ──────────────────────────────────────────────────────────────────

test('createClockCue defaults', () => {
  const c = createClockCue();
  assert.equal(c._v,       1);
  assert.equal(c.bar,      1);
  assert.deepEqual(c.osc_messages, []);
  assert.equal(c.tempo_change, null);
  assert.equal(c.target_id,   null);
  assert.equal(c.note,        '');
});

test('createClockCue with OSC messages', () => {
  const c = createClockCue({
    bar: 9,
    oscMessages: [{ address: '/notch/scene/1', args: [{ type: 'i', value: 1 }] }],
    targetId: 'notch-local',
    note: 'chorus drop',
  });
  assert.equal(c.bar,                  9);
  assert.equal(c.osc_messages.length,  1);
  assert.equal(c.osc_messages[0]._v,   1);
  assert.equal(c.osc_messages[0].address, '/notch/scene/1');
  assert.equal(c.target_id, 'notch-local');
  assert.equal(c.note,      'chorus drop');
});

test('createClockCue with tempo change', () => {
  const tc = createTempoChange({ bar: 17, tempo: 160 });
  const c  = createClockCue({ bar: 17, tempoChange: tc });
  assert.equal(c.tempo_change._v,    1);
  assert.equal(c.tempo_change.tempo, 160);
});

test('createClockCue normalizes raw tempo change', () => {
  const c = createClockCue({ bar: 17, tempoChange: { bar: 17, tempo: 80, timeSig: '6/8' } });
  assert.equal(c.tempo_change._v,      1);
  assert.equal(c.tempo_change.time_sig, '6/8');
});

test('createClockCue preserves already-normalized osc messages', () => {
  const m = createOscMessage({ address: '/x' });
  const c = createClockCue({ oscMessages: [m] });
  assert.strictEqual(c.osc_messages[0], m);
});

test('normalizeClockCue - already _v:1 returns a fresh, value-equal copy (P2-2/P1-5)', () => {
  const c = createClockCue({ bar: 5 });
  const n = normalizeClockCue(c);
  assert.notStrictEqual(n, c);
  assert.deepEqual(n, c);
});

test('normalizeClockCue - backfills osc_messages array and numeric bar even when _v is already present (P1-5)', () => {
  const n = normalizeClockCue({ _v: 1, bar: '9' });
  assert.equal(n.bar, 9);
  assert.deepEqual(n.osc_messages, []);
});

test('normalizeClockCue - _v greater than current is preserved, not downgraded (P1-6)', () => {
  const futureRow = { _v: 2, bar: 5, osc_messages: [], newField: 'x' };
  const n = normalizeClockCue(futureRow);
  assert.equal(n._v, 2);
  assert.equal(n.newField, 'x');
});

test('normalizeClockCue - null returns null', () => {
  assert.equal(normalizeClockCue(null), null);
});

test('normalizeClockCue - snake_case source fields', () => {
  const raw = { bar: 9, osc_messages: [], target_id: 'td', note: 'hit' };
  const c = normalizeClockCue(raw);
  assert.equal(c._v,       1);
  assert.equal(c.target_id, 'td');
});

// ── ClockTrack ────────────────────────────────────────────────────────────────

test('createClockTrack returns sorted cues', () => {
  const track = createClockTrack([
    { bar: 17, osc_messages: [] },
    { bar:  1, osc_messages: [] },
    { bar:  9, osc_messages: [] },
  ]);
  assert.equal(track.length, 3);
  assert.equal(track[0].bar, 1);
  assert.equal(track[1].bar, 9);
  assert.equal(track[2].bar, 17);
});

test('createClockTrack empty', () => {
  assert.deepEqual(createClockTrack(),   []);
  assert.deepEqual(createClockTrack([]), []);
});

test('upsertClockCue - inserts and sorts', () => {
  const track   = createClockTrack([createClockCue({ bar: 1 }), createClockCue({ bar: 17 })]);
  const updated = upsertClockCue(track, createClockCue({ bar: 9, note: 'chorus' }));
  assert.equal(updated.length,      3);
  assert.equal(updated[1].bar,      9);
  assert.equal(updated[1].note,     'chorus');
});

test('upsertClockCue - replaces existing bar', () => {
  const track   = createClockTrack([createClockCue({ bar: 9, note: 'old' })]);
  const updated = upsertClockCue(track, createClockCue({ bar: 9, note: 'new' }));
  assert.equal(updated.length, 1);
  assert.equal(updated[0].note, 'new');
});

test('removeClockCue - removes cue at bar', () => {
  const track   = createClockTrack([createClockCue({ bar: 1 }), createClockCue({ bar: 9 })]);
  const updated = removeClockCue(track, 9);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].bar, 1);
});

test('removeClockCue - no-op when bar absent', () => {
  const track = createClockTrack([createClockCue({ bar: 1 })]);
  assert.equal(removeClockCue(track, 99).length, 1);
});

// ── P1-5: backfill prevents a truncated cue from crashing the sidecar's OSC loop ──

test('createClockTrack - a cue with no osc_messages key backfills to [] instead of crashing a consumer iterating it', () => {
  const track = createClockTrack([{ _v: 1, bar: 1 }]);
  assert.equal(track.length, 1);
  assert.deepEqual(track[0].osc_messages, []);
  assert.doesNotThrow(() => { for (const m of track[0].osc_messages) { /* sidecar-style iteration */ } });
});

// ── P2-1: salvage — one corrupt cue doesn't nuke the whole ClockTrack ────────

test('createClockTrack - drops a null/non-object cue entry and keeps the rest', () => {
  const track = createClockTrack([null, { bar: 9, note: 'chorus' }, 42]);
  assert.equal(track.length, 1);
  assert.equal(track[0].note, 'chorus');
});

test('createClockTrack - null cues array does not throw', () => {
  assert.deepEqual(createClockTrack(null), []);
});

// ── clockCuesUpTo + resolveTempoAt ────────────────────────────────────────────

test('clockCuesUpTo returns cues at or before bar', () => {
  const track = createClockTrack([
    createClockCue({ bar: 1 }),
    createClockCue({ bar: 9 }),
    createClockCue({ bar: 17 }),
  ]);
  const result = clockCuesUpTo(track, 9);
  assert.equal(result.length,  2);
  assert.equal(result[0].bar,  1);
  assert.equal(result[1].bar,  9);
});

test('clockCuesUpTo - empty track', () => {
  assert.deepEqual(clockCuesUpTo([], 10), []);
});

test('resolveTempoAt - returns defaultTempo when no changes', () => {
  const track = createClockTrack([createClockCue({ bar: 1, note: 'intro' })]);
  assert.equal(resolveTempoAt(track, 32, 120), 120);
});

test('resolveTempoAt - picks up tempo change at bar', () => {
  const track = createClockTrack([
    createClockCue({ bar:  1, tempoChange: createTempoChange({ bar:  1, tempo: 90 }) }),
    createClockCue({ bar: 17, tempoChange: createTempoChange({ bar: 17, tempo: 140 }) }),
  ]);
  assert.equal(resolveTempoAt(track, 1,  120), 90);
  assert.equal(resolveTempoAt(track, 16, 120), 90);
  assert.equal(resolveTempoAt(track, 17, 120), 140);
  assert.equal(resolveTempoAt(track, 32, 120), 140);
});

test('resolveTempoAt - cues after bar not included', () => {
  const track = createClockTrack([
    createClockCue({ bar: 17, tempoChange: createTempoChange({ bar: 17, tempo: 160 }) }),
  ]);
  assert.equal(resolveTempoAt(track, 8, 120), 120);
});
