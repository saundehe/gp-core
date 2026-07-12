import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPro } from '../dist/account.esm.js';

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
