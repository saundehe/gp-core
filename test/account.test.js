import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TIERS, PRODUCTS, STATUS, TRIAL_DURATION_DAYS,
  isActive, isPro, isTrialing, isPerpetual, isProFor,
  midiDeviceCap, cloudSongCap, trialDaysRemaining, isExpired,
  isVersionLocked, ownsVersion, getTierLabel,
  createLicense, normalizeLicense, createUser, createTrial,
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

test('isActive - trialing license', () => {
  assert.ok(isActive(createLicense({ status: STATUS.trialing, tier: TIERS.annual })));
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
  const t = createTrial(PRODUCTS.riffwork, 1_700_000_000_000);
  assert.ok(isActive(t));
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
