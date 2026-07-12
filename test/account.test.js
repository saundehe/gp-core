import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TIERS, PRODUCTS, STATUS, TRIAL_DURATION_DAYS, FREE_CAPS,
  isActive, isPro, isTrialing, isPerpetual, isProFor,
  midiDeviceCap, cloudSongCap, trialDaysRemaining, isExpired,
  isVersionLocked, ownsVersion, getTierLabel, toMs,
  createLicense, normalizeLicense, createUser, createTrial,
  FREE_STATE, sessionToLicense, resolveAccountState,
  createEntitlementCache, verifyEntitlementCache,
} from '../src/account/index.js';

test('TIERS constants', () => {
  assert.equal(TIERS.monthly,      'monthly');
  assert.equal(TIERS.annual,       'annual');
  assert.equal(TIERS.perpetual_v1, 'perpetual_v1');
});

test('PRODUCTS constants', () => {
  assert.equal(PRODUCTS.riffwork, 'riffwork');
  assert.equal(PRODUCTS.rigwork,  'rigwork');
});

test('getTierLabel known tiers', () => {
  assert.equal(getTierLabel(TIERS.monthly),      'Pro (monthly)');
  assert.equal(getTierLabel(TIERS.annual),        'Pro (annual)');
  assert.equal(getTierLabel(TIERS.perpetual_v1),  'Pro (lifetime)');
});

test('getTierLabel unknown/null returns Free', () => {
  assert.equal(getTierLabel(null), 'Free');
  assert.equal(getTierLabel(undefined), 'Free');
  assert.equal(getTierLabel('legacy_tier'), 'Free');
});

test('isActive - active license', () => {
  assert.ok(isActive(createLicense({ status: STATUS.active, tier: TIERS.monthly })));
});

test('isActive - trialing license with a future trial_ends_at', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.trialing, tier: TIERS.annual, trial_ends_at: now + 1000 });
  assert.ok(isActive(lic, now));
});

// P1-2: a trialing license with no parseable trial_ends_at must fail CLOSED,
// not grant permanent Pro. This used to be the opposite (fails open) — a
// trial row with trial_ends_at missing/null/'' read as active forever.
test('isActive - trialing license with missing trial_ends_at fails closed (P1-2)', () => {
  assert.ok(!isActive(createLicense({ status: STATUS.trialing, tier: TIERS.annual })));
});

test('isActive - trialing license with null trial_ends_at fails closed (P1-2)', () => {
  const lic = createLicense({ status: STATUS.trialing, tier: TIERS.annual, trial_ends_at: null });
  assert.ok(!isActive(lic));
});

test('isActive - trialing license with empty-string trial_ends_at fails closed (P1-2)', () => {
  const lic = createLicense({ status: STATUS.trialing, tier: TIERS.annual, trial_ends_at: '' });
  assert.ok(!isActive(lic));
});

test('isPro - trialing license with missing trial_ends_at is not Pro (P1-2, tamper-resistant)', () => {
  assert.ok(!isPro(createLicense({ status: STATUS.trialing, tier: TIERS.monthly })));
});

test('isActive - cancelled license', () => {
  assert.ok(!isActive(createLicense({ status: STATUS.cancelled, tier: TIERS.monthly })));
});

test('isActive - null returns false', () => {
  assert.ok(!isActive(null));
});

test('isPro - active monthly', () => {
  assert.ok(isPro(createLicense({ status: STATUS.active, tier: TIERS.monthly })));
});

test('isPro - active perpetual', () => {
  assert.ok(isPro(createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1 })));
});

test('isPro - null license', () => {
  assert.ok(!isPro(null));
});

test('isPro - cancelled active-tier is not pro', () => {
  assert.ok(!isPro(createLicense({ status: STATUS.cancelled, tier: TIERS.annual })));
});

test('midiDeviceCap - Pro gets unlimited (null)', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  assert.equal(midiDeviceCap(lic), null);
});

test('midiDeviceCap - free gets 2', () => {
  assert.equal(midiDeviceCap(null), 2);
});

test('cloudSongCap - Pro gets unlimited (null)', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.annual });
  assert.equal(cloudSongCap(lic), null);
});

test('cloudSongCap - free gets 5', () => {
  assert.equal(cloudSongCap(null), 5);
});

test('createLicense _v:1 and defaults', () => {
  const lic = createLicense({ user_id: 'u1', tier: TIERS.perpetual_v1 });
  assert.equal(lic._v, 1);
  assert.equal(lic.user_id, 'u1');
  assert.equal(lic.tier, TIERS.perpetual_v1);
  assert.equal(lic.status, 'active');
  assert.equal(lic.current_period_end, null);
  assert.equal(lic.major_version_owned, null);
});

test('createLicense preserve-unknown fields', () => {
  const lic = createLicense({ future_field: 'x', nested: { a: 1 } });
  assert.equal(lic.future_field, 'x');
  assert.deepEqual(lic.nested, { a: 1 });
  assert.equal(lic._v, 1);
});

test('normalizeLicense - already _v:1 passes through', () => {
  const lic = createLicense({ user_id: 'u2', tier: TIERS.monthly });
  const n = normalizeLicense(lic);
  assert.equal(n._v, 1);
  assert.equal(n.user_id, 'u2');
});

test('normalizeLicense - legacy row without _v gets _v:1', () => {
  const legacy = { id: 'x', user_id: 'u3', tier: 'annual', status: 'active' };
  const n = normalizeLicense(legacy);
  assert.equal(n._v, 1);
  assert.equal(n.id, 'x');
  assert.equal(n.tier, 'annual');
});

test('normalizeLicense - null returns null', () => {
  assert.equal(normalizeLicense(null), null);
});

test('createUser _v:1 and fields', () => {
  const u = createUser({ id: 'abc123', email: 'heath@gp.com' });
  assert.equal(u._v, 1);
  assert.equal(u.id, 'abc123');
  assert.equal(u.email, 'heath@gp.com');
});

test('createUser preserve-unknown fields', () => {
  const u = createUser({ future_pref: true });
  assert.equal(u._v, 1);
  assert.equal(u.future_pref, true);
});

// ── Trial helpers ─────────────────────────────────────────────────────────────

test('TRIAL_DURATION_DAYS is 14', () => {
  assert.equal(TRIAL_DURATION_DAYS, 14);
});

test('createTrial produces a trialing license for the given product', () => {
  const now = 1_700_000_000_000;
  const t = createTrial(PRODUCTS.rigwork, now);
  assert.equal(t._v, 1);
  assert.equal(t.product, PRODUCTS.rigwork);
  assert.equal(t.status, STATUS.trialing);
  assert.equal(t.tier, TIERS.monthly);
  assert.equal(t.trial_ends_at, now + 14 * 24 * 60 * 60 * 1000);
});

test('isTrialing - trialing license returns true', () => {
  const t = createTrial(PRODUCTS.riffwork, 1_700_000_000_000);
  assert.ok(isTrialing(t));
});

test('isTrialing - active (paid) license returns false', () => {
  assert.ok(!isTrialing(createLicense({ status: STATUS.active, tier: TIERS.monthly })));
});

test('isTrialing - null returns false', () => {
  assert.ok(!isTrialing(null));
});

test('isActive - trialing counts as active', () => {
  const now = 1_700_000_000_000;
  const t   = createTrial(PRODUCTS.riffwork, now);
  assert.ok(isActive(t, now));
});

test('trialDaysRemaining - 7 days in returns ~7 remaining', () => {
  const now = 1_700_000_000_000;
  const t = createTrial(PRODUCTS.riffwork, now);
  const sevenDaysLater = now + 7 * 24 * 60 * 60 * 1000;
  const remaining = trialDaysRemaining(t, sevenDaysLater);
  assert.equal(remaining, 7);
});

test('trialDaysRemaining - expired trial returns 0', () => {
  const now = 1_700_000_000_000;
  const t = createTrial(PRODUCTS.riffwork, now);
  const afterExpiry = now + 15 * 24 * 60 * 60 * 1000;
  assert.equal(trialDaysRemaining(t, afterExpiry), 0);
});

test('trialDaysRemaining - non-trialing license returns null', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  assert.equal(trialDaysRemaining(lic), null);
  assert.equal(trialDaysRemaining(null), null);
});

// ── Product-scoped entitlements ───────────────────────────────────────────────

test('isProFor - matching product is pro', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.annual, product: PRODUCTS.rigwork });
  assert.ok(isProFor(lic, PRODUCTS.rigwork));
});

test('isProFor - wrong product returns false', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.annual, product: PRODUCTS.rigwork });
  assert.ok(!isProFor(lic, PRODUCTS.riffwork));
});

test('isProFor - null license returns false', () => {
  assert.ok(!isProFor(null, PRODUCTS.rigwork));
});

// ── Perpetual / version-lock ──────────────────────────────────────────────────

test('isPerpetual - perpetual_v1 tier returns true', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1 });
  assert.ok(isPerpetual(lic));
});

test('isPerpetual - monthly tier returns false', () => {
  assert.ok(!isPerpetual(createLicense({ tier: TIERS.monthly })));
});

test('isPerpetual - null returns false', () => {
  assert.ok(!isPerpetual(null));
});

test('ownsVersion - perpetual v1 owner can run major 1', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1, major_version_owned: 1 });
  assert.ok(ownsVersion(lic, 1));
});

test('ownsVersion - perpetual v1 owner cannot run major 2 without upgrade', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1, major_version_owned: 1 });
  assert.ok(!ownsVersion(lic, 2));
});

test('ownsVersion - monthly sub returns false (no major owned)', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  assert.ok(!ownsVersion(lic, 1));
});

test('isVersionLocked - perpetual v1 owner checking against major 2 is locked', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1, major_version_owned: 1 });
  assert.ok(isVersionLocked(lic, 2));
});

test('isVersionLocked - perpetual v1 owner checking against major 1 is not locked', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1, major_version_owned: 1 });
  assert.ok(!isVersionLocked(lic, 1));
});

test('isVersionLocked - monthly sub is never version-locked', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  assert.ok(!isVersionLocked(lic, 2));
});

// ── Expiry ────────────────────────────────────────────────────────────────────

test('isExpired - past current_period_end returns true', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly, current_period_end: now - 1000 });
  assert.ok(isExpired(lic, now));
});

test('isExpired - future current_period_end returns false', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly, current_period_end: now + 1000 });
  assert.ok(!isExpired(lic, now));
});

test('isExpired - no current_period_end (perpetual) returns false', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1 });
  assert.ok(!isExpired(lic, Date.now()));
});

test('isExpired - null license returns false', () => {
  assert.ok(!isExpired(null));
});

// ── FREE_STATE ────────────────────────────────────────────────────────────────

test('FREE_STATE shape', () => {
  assert.equal(FREE_STATE.user,      null);
  assert.equal(FREE_STATE.license,   null);
  assert.equal(FREE_STATE.isPro,     false);
  assert.equal(FREE_STATE.isTrial,   false);
  assert.equal(FREE_STATE.daysLeft,  null);
  assert.equal(FREE_STATE.tierLabel, 'Free');
  assert.equal(FREE_STATE.midiCap,   2);
  assert.equal(FREE_STATE.songCap,   5);
});

test('FREE_STATE is frozen', () => {
  assert.throws(() => { FREE_STATE.isPro = true; }, TypeError);
});

test('FREE_STATE caps match FREE_CAPS - single source of truth for free-tier limits', () => {
  assert.equal(FREE_STATE.midiCap, FREE_CAPS.midi);
  assert.equal(FREE_STATE.songCap, FREE_CAPS.songs);
  // and the logged-in free path (midiDeviceCap/cloudSongCap with no license) agrees too
  assert.equal(midiDeviceCap(null), FREE_CAPS.midi);
  assert.equal(cloudSongCap(null),  FREE_CAPS.songs);
});

// ── sessionToLicense ──────────────────────────────────────────────────────────

test('sessionToLicense - empty array returns null', () => {
  assert.equal(sessionToLicense([], PRODUCTS.rigwork), null);
});

test('sessionToLicense - null rows returns null', () => {
  assert.equal(sessionToLicense(null, PRODUCTS.rigwork), null);
});

test('sessionToLicense - product mismatch returns null', () => {
  const rows = [createLicense({ product: PRODUCTS.riffwork, status: STATUS.active, tier: TIERS.monthly })];
  assert.equal(sessionToLicense(rows, PRODUCTS.rigwork), null);
});

test('sessionToLicense - single matching row returned', () => {
  const lic = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly });
  assert.deepEqual(sessionToLicense([lic], PRODUCTS.rigwork), lic);
});

test('sessionToLicense - active beats trialing', () => {
  const trial  = createLicense({ product: PRODUCTS.rigwork, status: STATUS.trialing, tier: TIERS.monthly });
  const active = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active,   tier: TIERS.annual });
  const result = sessionToLicense([trial, active], PRODUCTS.rigwork);
  assert.equal(result.status, STATUS.active);
});

test('sessionToLicense - trialing beats cancelled', () => {
  const cancelled = createLicense({ product: PRODUCTS.rigwork, status: STATUS.cancelled, tier: TIERS.monthly });
  const trial     = createLicense({ product: PRODUCTS.rigwork, status: STATUS.trialing,  tier: TIERS.monthly });
  const result    = sessionToLicense([cancelled, trial], PRODUCTS.rigwork);
  assert.equal(result.status, STATUS.trialing);
});

test('sessionToLicense - filters cross-product rows', () => {
  const riffLic = createLicense({ product: PRODUCTS.riffwork, status: STATUS.active, tier: TIERS.monthly });
  const rigLic  = createLicense({ product: PRODUCTS.rigwork,  status: STATUS.trialing, tier: TIERS.monthly });
  assert.equal(sessionToLicense([riffLic, rigLic], PRODUCTS.riffwork).product, PRODUCTS.riffwork);
  assert.equal(sessionToLicense([riffLic, rigLic], PRODUCTS.rigwork).product,  PRODUCTS.rigwork);
});

// ── resolveAccountState ───────────────────────────────────────────────────────

test('resolveAccountState - null user returns FREE_STATE copy', () => {
  const state = resolveAccountState(null, [], PRODUCTS.rigwork);
  assert.equal(state.isPro,    false);
  assert.equal(state.user,     null);
  assert.equal(state.midiCap,  2);
});

test('resolveAccountState - logged in, no licenses = free', () => {
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const state = resolveAccountState(user, [], PRODUCTS.rigwork);
  assert.equal(state.user.id,  'u1');
  assert.equal(state.isPro,    false);
  assert.equal(state.license,  null);
  assert.equal(state.midiCap,  2);
  assert.equal(state.songCap,  5);
});

test('resolveAccountState - active Pro license', () => {
  const user    = { id: 'u1', email: 'heath@gp.com' };
  const rows    = [createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.annual })];
  const state   = resolveAccountState(user, rows, PRODUCTS.rigwork);
  assert.equal(state.isPro,     true);
  assert.equal(state.isTrial,   false);
  assert.equal(state.daysLeft,  null);
  assert.equal(state.tierLabel, 'Pro (annual)');
  assert.equal(state.midiCap,   null);
  assert.equal(state.songCap,   null);
});

test('resolveAccountState - trialing license', () => {
  const now   = 1_700_000_000_000;
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const trial = createTrial(PRODUCTS.riffwork, now);
  const state = resolveAccountState(user, [trial], PRODUCTS.riffwork, now);
  assert.equal(state.isPro,    true);
  assert.equal(state.isTrial,  true);
  assert.equal(state.daysLeft, 14);
  assert.equal(state.midiCap,  null);
});

test('resolveAccountState - 7 days into trial', () => {
  const start = 1_700_000_000_000;
  const now   = start + 7 * 24 * 60 * 60 * 1000;
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const trial = createTrial(PRODUCTS.rigwork, start);
  const state = resolveAccountState(user, [trial], PRODUCTS.rigwork, now);
  assert.equal(state.daysLeft, 7);
});

test('resolveAccountState - ignores other-product licenses', () => {
  const user     = { id: 'u1', email: 'heath@gp.com' };
  const riffLic  = createLicense({ product: PRODUCTS.riffwork, status: STATUS.active, tier: TIERS.monthly });
  const state    = resolveAccountState(user, [riffLic], PRODUCTS.rigwork);
  assert.equal(state.isPro,   false);
  assert.equal(state.license, null);
});

test('resolveAccountState - perpetual license sets tierLabel', () => {
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const lic   = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.perpetual_v1 });
  const state = resolveAccountState(user, [lic], PRODUCTS.rigwork);
  assert.equal(state.tierLabel, 'Pro (lifetime)');
  assert.equal(state.isPro,     true);
});

// ── Entitlement expiry gates (bugs 1-3) ───────────────────────────────────────

test('isActive - expired trial is not active', () => {
  const start = 1_700_000_000_000;
  const t     = createTrial(PRODUCTS.rigwork, start);
  const after = start + 20 * 24 * 60 * 60 * 1000;
  assert.ok(!isActive(t, after));
});

test('isActive - trial still inside window is active', () => {
  const start  = 1_700_000_000_000;
  const t      = createTrial(PRODUCTS.rigwork, start);
  const midway = start + 5 * 24 * 60 * 60 * 1000;
  assert.ok(isActive(t, midway));
});

test('isPro - expired trial is not Pro (bug 1)', () => {
  const start = 1_700_000_000_000;
  const t     = createTrial(PRODUCTS.rigwork, start);
  const after = start + 20 * 24 * 60 * 60 * 1000;
  assert.ok(!isPro(t, after));
});

test('isPro - valid trial (now) is still Pro', () => {
  const start = 1_700_000_000_000;
  const t     = createTrial(PRODUCTS.rigwork, start);
  assert.ok(isPro(t, start));
});

test('isPro - active-but-expired subscription is not Pro (bug 2)', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({
    status: STATUS.active, tier: TIERS.monthly,
    current_period_end: now - 30 * 24 * 60 * 60 * 1000,
  });
  assert.ok(!isPro(lic, now));
});

test('isPro - perpetual license (no period end) stays Pro', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1 });
  assert.ok(isPro(lic, now));
});

test('caps - expired trial falls back to free caps (2 / 5)', () => {
  const start = 1_700_000_000_000;
  const t     = createTrial(PRODUCTS.rigwork, start);
  const after = start + 20 * 24 * 60 * 60 * 1000;
  assert.equal(midiDeviceCap(t, after), 2);
  assert.equal(cloudSongCap(t, after),  5);
});

test('isProFor - expired trial for right product is not Pro', () => {
  const start = 1_700_000_000_000;
  const t     = createTrial(PRODUCTS.rigwork, start);
  const after = start + 20 * 24 * 60 * 60 * 1000;
  assert.ok(!isProFor(t, PRODUCTS.rigwork, after));
});

test('resolveAccountState - expired trial: not Pro, free caps, Free label', () => {
  const start = 1_700_000_000_000;
  const now   = start + 20 * 24 * 60 * 60 * 1000;
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const trial = createTrial(PRODUCTS.rigwork, start);
  const state = resolveAccountState(user, [trial], PRODUCTS.rigwork, now);
  assert.equal(state.isPro,     false);
  assert.equal(state.midiCap,   2);
  assert.equal(state.songCap,   5);
  assert.equal(state.daysLeft,  0);
  assert.equal(state.tierLabel, 'Free');
});

test('resolveAccountState - active-but-expired subscription is not Pro (bug 2)', () => {
  const now  = 1_700_000_000_000;
  const user = { id: 'u1', email: 'heath@gp.com' };
  const lic  = createLicense({
    product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly,
    current_period_end: now - 30 * 24 * 60 * 60 * 1000,
  });
  const state = resolveAccountState(user, [lic], PRODUCTS.rigwork, now);
  assert.equal(state.isPro,     false);
  assert.equal(state.midiCap,   2);
  assert.equal(state.songCap,   5);
  assert.equal(state.tierLabel, 'Free');
});

test('resolveAccountState - perpetual license stays Pro with a now clock', () => {
  const now  = 1_700_000_000_000;
  const user = { id: 'u1', email: 'heath@gp.com' };
  const lic  = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.perpetual_v1 });
  const state = resolveAccountState(user, [lic], PRODUCTS.rigwork, now);
  assert.equal(state.isPro,     true);
  assert.equal(state.midiCap,   null);
  assert.equal(state.tierLabel, 'Pro (lifetime)');
});

test('resolveAccountState - past_due license shows payment-issue label (bug 3)', () => {
  const now  = 1_700_000_000_000;
  const user = { id: 'u1', email: 'heath@gp.com' };
  const lic  = createLicense({ product: PRODUCTS.rigwork, status: STATUS.past_due, tier: TIERS.monthly });
  const state = resolveAccountState(user, [lic], PRODUCTS.rigwork, now);
  assert.equal(state.isPro,     false);
  assert.equal(state.tierLabel, 'Pro (monthly), payment issue');
});

// ── toMs (P1-1) ─────────────────────────────────────────────────────────────

test('toMs - number passes through', () => {
  assert.equal(toMs(1_700_000_000_000), 1_700_000_000_000);
});

test('toMs - ISO string parses to epoch ms', () => {
  assert.equal(toMs('2026-01-01T00:00:00.000Z'), Date.parse('2026-01-01T00:00:00.000Z'));
});

test('toMs - null/undefined/empty-string/malformed return null', () => {
  assert.equal(toMs(null), null);
  assert.equal(toMs(undefined), null);
  assert.equal(toMs(''), null);
  assert.equal(toMs('not-a-date'), null);
  assert.equal(toMs(NaN), null);
});

// ── ISO-string timestamps (P1-1) ──────────────────────────────────────────────
// Supabase timestamptz columns select as ISO strings. Every gate must coerce
// before comparing, or a lapsed sub reads as Pro forever (string vs number
// compare -> NaN -> every < / > is false) and a valid trial reads as Free.

test('isPro - ISO-string current_period_end in the past is expired, not Pro (P1-1)', () => {
  const now = 1_700_000_000_000; // 2023-11-14
  const lic = createLicense({
    status: STATUS.active, tier: TIERS.monthly,
    current_period_end: '2020-01-01T00:00:00.000Z', // well before `now`
  });
  assert.ok(!isPro(lic, now));
  assert.ok(isExpired(lic, now));
});

test('isPro - ISO-string trial_ends_at in the future is a valid trial (P1-1)', () => {
  const now = 1_700_000_000_000;
  const future = new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString();
  const lic = createLicense({ status: STATUS.trialing, tier: TIERS.monthly, trial_ends_at: future });
  assert.ok(isPro(lic, now));
  assert.ok(isActive(lic, now));
});

test('trialDaysRemaining - ISO-string trial_ends_at computes correctly (P1-1)', () => {
  const now = 1_700_000_000_000;
  const sevenDaysOut = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
  const lic = createLicense({ status: STATUS.trialing, tier: TIERS.monthly, trial_ends_at: sevenDaysOut });
  assert.equal(trialDaysRemaining(lic, now), 7);
});

test('normalizeLicense - coerces ISO-string timestamps to epoch ms', () => {
  const raw = createLicense({
    current_period_end: '2026-01-01T00:00:00.000Z',
    trial_ends_at: '2026-08-01T00:00:00.000Z',
  });
  const n = normalizeLicense(raw);
  assert.equal(n.current_period_end, Date.parse('2026-01-01T00:00:00.000Z'));
  assert.equal(n.trial_ends_at,      Date.parse('2026-08-01T00:00:00.000Z'));
});

// ── sessionToLicense best-row selection (P1-3) ────────────────────────────────

test('sessionToLicense - live trial beats a lapsed active row (P1-3)', () => {
  const now = 1_700_000_000_000;
  const lapsedActive = createLicense({
    product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly,
    current_period_end: now - 24 * 60 * 60 * 1000,
  });
  const liveTrial = createLicense({
    product: PRODUCTS.rigwork, status: STATUS.trialing, tier: TIERS.monthly,
    trial_ends_at: now + 7 * 24 * 60 * 60 * 1000,
  });
  const result = sessionToLicense([lapsedActive, liveTrial], PRODUCTS.rigwork, now);
  assert.equal(result.status, STATUS.trialing);
  assert.ok(isPro(result, now));
});

test('sessionToLicense - perpetual beats a lapsed monthly (tier tiebreak, P1-3)', () => {
  const now = 1_700_000_000_000;
  const lapsedMonthly = createLicense({
    product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly,
    current_period_end: now - 1000,
  });
  const perpetual = createLicense({
    product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.perpetual_v1,
  });
  const result = sessionToLicense([lapsedMonthly, perpetual], PRODUCTS.rigwork, now);
  assert.equal(result.tier, TIERS.perpetual_v1);
});

test('sessionToLicense - two active Pro rows: perpetual outranks annual outranks monthly', () => {
  const now = 1_700_000_000_000;
  const monthly   = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly });
  const annual    = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.annual });
  const perpetual = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.perpetual_v1 });
  assert.equal(sessionToLicense([monthly, annual, perpetual], PRODUCTS.rigwork, now).tier, TIERS.perpetual_v1);
  assert.equal(sessionToLicense([monthly, annual], PRODUCTS.rigwork, now).tier, TIERS.annual);
});

test('sessionToLicense - among two active-Pro same-tier rows, the later current_period_end wins', () => {
  const now = 1_700_000_000_000;
  const soonerEnd = createLicense({
    product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly,
    current_period_end: now + 5 * 24 * 60 * 60 * 1000,
  });
  const laterEnd = createLicense({
    product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly,
    current_period_end: now + 30 * 24 * 60 * 60 * 1000,
  });
  const result = sessionToLicense([soonerEnd, laterEnd], PRODUCTS.rigwork, now);
  assert.equal(result.current_period_end, now + 30 * 24 * 60 * 60 * 1000);
});

test('sessionToLicense - coerces ISO-string timestamps on the returned row (P1-1 x P1-3)', () => {
  const now = 1_700_000_000_000;
  const rows = [{
    product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly,
    current_period_end: '2026-01-01T00:00:00.000Z',
  }];
  const result = sessionToLicense(rows, PRODUCTS.rigwork, now);
  assert.equal(typeof result.current_period_end, 'number');
});

test('resolveAccountState - lapsed active row does not shadow a live trial (P1-3 integration)', () => {
  const now  = 1_700_000_000_000;
  const user = { id: 'u1', email: 'heath@gp.com' };
  const rows = [
    createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly, current_period_end: now - 1000 }),
    createLicense({ product: PRODUCTS.rigwork, status: STATUS.trialing, tier: TIERS.monthly, trial_ends_at: now + 7 * 24 * 60 * 60 * 1000 }),
  ];
  const state = resolveAccountState(user, rows, PRODUCTS.rigwork, now);
  assert.equal(state.isPro,   true);
  assert.equal(state.isTrial, true);
});

// ── ownsVersion / isVersionLocked clock injection (P2-4) ─────────────────────

test('ownsVersion - threads nowMs into isActive instead of reading the wall clock', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.trialing, tier: TIERS.perpetual_v1, major_version_owned: 2, trial_ends_at: now + 1000 });
  assert.ok(ownsVersion(lic, 2, now));
  assert.ok(!ownsVersion(lic, 2, now + 2000)); // trial window closed under the injected clock
});

test('isVersionLocked - accepts an (unused) nowMs param for symmetry with ownsVersion', () => {
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1, major_version_owned: 1 });
  assert.ok(isVersionLocked(lic, 2, 1_700_000_000_000));
  assert.ok(!isVersionLocked(lic, 1, 1_700_000_000_000));
});

// ── resolveAccountState.trialExpired (P2-5) ───────────────────────────────────

test('resolveAccountState - trialExpired is false during a live trial', () => {
  const now   = 1_700_000_000_000;
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const trial = createTrial(PRODUCTS.rigwork, now);
  const state = resolveAccountState(user, [trial], PRODUCTS.rigwork, now);
  assert.equal(state.isTrial,      true);
  assert.equal(state.trialExpired, false);
});

test('resolveAccountState - trialExpired is true once the trial window closes (P2-5)', () => {
  const start = 1_700_000_000_000;
  const now   = start + 20 * 24 * 60 * 60 * 1000;
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const trial = createTrial(PRODUCTS.rigwork, start);
  const state = resolveAccountState(user, [trial], PRODUCTS.rigwork, now);
  assert.equal(state.isTrial,      true, 'isTrial stays status-only, unchanged semantics');
  assert.equal(state.trialExpired, true);
  assert.equal(state.isPro,        false);
});

test('resolveAccountState - trialExpired is false for a non-trial license', () => {
  const now   = 1_700_000_000_000;
  const user  = { id: 'u1', email: 'heath@gp.com' };
  const lic   = createLicense({ product: PRODUCTS.rigwork, status: STATUS.active, tier: TIERS.monthly });
  const state = resolveAccountState(user, [lic], PRODUCTS.rigwork, now);
  assert.equal(state.trialExpired, false);
});

test('FREE_STATE includes trialExpired: false', () => {
  assert.equal(FREE_STATE.trialExpired, false);
});

// ── Offline entitlement cache (G1) ────────────────────────────────────────────

test('createEntitlementCache - shape and clock stamping', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  const cache = createEntitlementCache(lic, now);
  assert.equal(cache._v, 1);
  assert.equal(cache.verifiedAt, now);
  assert.equal(cache.maxSeenClock, now);
  assert.equal(cache.license.tier, TIERS.monthly);
});

test('createEntitlementCache - coerces ISO-string license timestamps via normalizeLicense', () => {
  const now = 1_700_000_000_000;
  const lic = { status: STATUS.active, tier: TIERS.monthly, current_period_end: '2026-01-01T00:00:00.000Z' };
  const cache = createEntitlementCache(lic, now);
  assert.equal(cache.license.current_period_end, Date.parse('2026-01-01T00:00:00.000Z'));
});

test('verifyEntitlementCache - valid within the grace window', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  const cache = createEntitlementCache(lic, now);
  const result = verifyEntitlementCache(cache, { nowMs: now + 5 * 24 * 60 * 60 * 1000, graceDays: 30 });
  assert.equal(result.valid, true);
  assert.equal(result.license.tier, TIERS.monthly);
  assert.equal(result.graceRemaining, 25);
  assert.equal(result.reason, null);
});

test('verifyEntitlementCache - fails closed on a missing/malformed cache', () => {
  assert.equal(verifyEntitlementCache(null).valid, false);
  assert.equal(verifyEntitlementCache(undefined).valid, false);
  assert.equal(verifyEntitlementCache({}).valid, false);
  assert.equal(verifyEntitlementCache({ license: {}, verifiedAt: 'nope', maxSeenClock: 1 }).valid, false);
  assert.equal(verifyEntitlementCache(null).reason, 'malformed-cache');
});

test('verifyEntitlementCache - fails closed on clock rollback', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  const cache = createEntitlementCache(lic, now);
  const result = verifyEntitlementCache(cache, { nowMs: now - 1000, graceDays: 30 });
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'clock-rollback');
  assert.equal(result.license, null);
});

test('verifyEntitlementCache - grace expiry boundary: exactly graceDays out fails closed', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  const cache = createEntitlementCache(lic, now);
  const exactlyAtBoundary = now + 30 * 24 * 60 * 60 * 1000;
  const result = verifyEntitlementCache(cache, { nowMs: exactlyAtBoundary, graceDays: 30 });
  assert.equal(result.valid, false);
  assert.equal(result.reason, 'grace-expired');
  assert.equal(result.graceRemaining, 0);
});

test('verifyEntitlementCache - grace expiry boundary: 1ms before the boundary still valid', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  const cache = createEntitlementCache(lic, now);
  const justBeforeBoundary = now + 30 * 24 * 60 * 60 * 1000 - 1;
  const result = verifyEntitlementCache(cache, { nowMs: justBeforeBoundary, graceDays: 30 });
  assert.equal(result.valid, true);
});

test('verifyEntitlementCache - default graceDays is 30 when omitted', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.monthly });
  const cache = createEntitlementCache(lic, now);
  assert.equal(verifyEntitlementCache(cache, { nowMs: now + 29 * 24 * 60 * 60 * 1000 }).valid, true);
  assert.equal(verifyEntitlementCache(cache, { nowMs: now + 31 * 24 * 60 * 60 * 1000 }).valid, false);
});

test('verifyEntitlementCache - a valid cached license feeds isPro correctly', () => {
  const now = 1_700_000_000_000;
  const lic = createLicense({ status: STATUS.active, tier: TIERS.perpetual_v1 });
  const cache = createEntitlementCache(lic, now);
  const { valid, license } = verifyEntitlementCache(cache, { nowMs: now + 100 * 24 * 60 * 60 * 1000, graceDays: 365 });
  assert.ok(valid);
  assert.ok(isPro(license, now + 100 * 24 * 60 * 60 * 1000));
});
