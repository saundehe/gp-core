import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TIERS, PRODUCTS, STATUS,
  isActive, isPro, midiDeviceCap, cloudSongCap, getTierLabel,
  createLicense, normalizeLicense, createUser,
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
