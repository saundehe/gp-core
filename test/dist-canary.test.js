import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPro } from '../dist/account.esm.js';
import { normalizeNote, normalizePartSet } from '../dist/part.esm.js';
import { normalizeSection, moveSetlistEntry, createSetlistEntry } from '../dist/song.esm.js';
import { normalizeBoard } from '../dist/gear.esm.js';
import { createTempoChange } from '../dist/clockwork.esm.js';

// Guards against P0-1 (2026-07-11 sweep): the committed dist/ bundles had
// last been rebuilt in commit d75e997 (2026-06-20), predating the Pro-gate
// expiry fixes (42cd53f, 2026-07-07). Any script-tag consumer that imports
// dist/ directly instead of building from src/ (gpdoom-tools, per
// scripts/build.js's header comment) was silently shipping the
// expired-trial / lapsed-sub Pro leak that src/ had already fixed weeks
// earlier — because `npm run build` was never re-run and re-committed.
//
// If this test fails, dist/ is stale relative to src/: run `npm run build`
// and commit the result alongside whatever src/ change you just made.
test('dist/account.esm.js - isPro on a lapsed (expired) subscription is false, not stale', () => {
  const now = 1_700_000_000_000;
  const lapsedSub = {
    status: 'active',
    tier: 'monthly',
    current_period_end: now - 30 * 24 * 60 * 60 * 1000,
  };
  assert.equal(isPro(lapsedSub, now), false);
});

test('dist/account.esm.js - isPro on an expired trial is false, not stale', () => {
  const now = 1_700_000_000_000;
  const expiredTrial = {
    status: 'trialing',
    tier: 'monthly',
    trial_ends_at: now - 24 * 60 * 60 * 1000,
  };
  assert.equal(isPro(expiredTrial, now), false);
});

test('dist/account.esm.js - isPro on a live active subscription is still true', () => {
  // Sanity check alongside the two negative cases above — a dist bundle that
  // failed CLOSED on everything would also pass a naive "isPro is false"
  // canary without actually being correct.
  const now = 1_700_000_000_000;
  const liveSub = {
    status: 'active',
    tier: 'monthly',
    current_period_end: now + 10 * 24 * 60 * 60 * 1000,
  };
  assert.equal(isPro(liveSub, now), true);
});

// Guards against the fleet-audit finding (2026-07-26): commit 2aab353 changed
// src/part/note.js, src/part/part-set.js, and src/song/section.js, but
// `npm run build` was never re-run, so dist/ silently lagged src/ again,
// the exact class of bug this file exists to catch, just in a different set
// of bundles. One assertion per bundle touched by that commit (part, song),
// plus gear and clockwork since this hit-list session's own fixes land there
// too. Any future `npm run build` skip on a normalizer change should now
// fail here instead of shipping stale script-tag consumers a silently
// unfixed bug.

test('dist/part.esm.js - normalizeNote backfills onset/dur/vel on the _v:1 fast path', () => {
  const n = normalizeNote({ _v: 1, pitch: 90 });
  assert.equal(n.onset, 0);
  assert.equal(n.dur,   4);
  assert.equal(n.vel,   80);
});

test('dist/part.esm.js - normalizePartSet drops a null part instead of leaving it in the array', () => {
  const ps = normalizePartSet({ _v: 1, parts: [{ _v: 1, type: 'bass', notes: [] }, null] });
  assert.equal(ps.parts.length, 1);
});

test('dist/song.esm.js - normalizeSection returns a fresh copy, not the caller\'s own tags reference', () => {
  const raw = { _v: 1, name: 'Verse', tags: ['loud'] };
  const s = normalizeSection(raw);
  assert.notStrictEqual(s.tags, raw.tags);
  assert.deepEqual(s.tags, raw.tags);
});

test('dist/song.esm.js - moveSetlistEntry clamps an out-of-range toIdx instead of splicing unchecked', () => {
  const entries = ['a', 'b', 'c'].map(id => createSetlistEntry({ songId: id }));
  const updated = moveSetlistEntry(entries, 2, -1);
  assert.deepEqual(updated.map(e => e.song_id), ['c', 'a', 'b']);
});

test('dist/gear.esm.js - normalizeBoard drops null/corrupt devices instead of leaving them in the array', () => {
  const board = normalizeBoard({ id: 'b1', name: 'Rig', devices: [null, { id: 'd1', name: 'DS-1' }] });
  assert.equal(board.devices.length, 1);
  assert.equal(board.devices[0].name, 'DS-1');
});

test('dist/clockwork.esm.js - createTempoChange round-trips a stored time_sig instead of nulling it', () => {
  const tc = createTempoChange({ _v: 1, bar: 17, tempo: 160, time_sig: '5/4' });
  assert.equal(tc.time_sig, '5/4');
});
