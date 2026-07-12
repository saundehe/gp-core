import { createUser } from './schema.js';
import {
  STATUS, TIERS, FREE_CAPS,
  isPro, isActive, isTrialing, midiDeviceCap, cloudSongCap,
  trialDaysRemaining, getTierLabel, toMs,
} from './license.js';

/**
 * Account state for a logged-out or unlicensed user.
 * Products copy this via spread — the object itself is frozen.
 * midiCap/songCap read from FREE_CAPS (license.js) — the single source of
 * truth shared with midiDeviceCap/cloudSongCap's own free-tier fallback.
 */
export const FREE_STATE = Object.freeze({
  user:         null,
  license:      null,
  isPro:        false,
  isTrial:      false,
  trialExpired: false,
  daysLeft:     null,
  tierLabel:    'Free',
  midiCap:      FREE_CAPS.midi,
  songCap:      FREE_CAPS.songs,
});

const STATUS_ORDER = { [STATUS.active]: 0, [STATUS.trialing]: 1, [STATUS.past_due]: 2, [STATUS.cancelled]: 3 };
const TIER_RANK     = { [TIERS.perpetual_v1]: 0, [TIERS.annual]: 1, [TIERS.monthly]: 2 };

/**
 * Order two license rows best-first for sessionToLicense's selection.
 * Priority: isPro(now) beats not-Pro, then status order (active > trialing >
 * past_due > cancelled), then tier rank (perpetual > annual > monthly), then
 * the later current_period_end (perpetual's null period end sorts as "latest").
 * Fixes P1-3: status-order-only selection let an expired 'active' row beat a
 * live trial, and left same-status ties (e.g. perpetual + lapsed monthly)
 * resolved by arbitrary DB row order.
 */
function compareLicenseRows(a, b, nowMs) {
  const aPro = isPro(a, nowMs), bPro = isPro(b, nowMs);
  if (aPro !== bPro) return aPro ? -1 : 1;

  const aStatus = STATUS_ORDER[a.status] ?? 99;
  const bStatus = STATUS_ORDER[b.status] ?? 99;
  if (aStatus !== bStatus) return aStatus - bStatus;

  const aTier = TIER_RANK[a.tier] ?? 99;
  const bTier = TIER_RANK[b.tier] ?? 99;
  if (aTier !== bTier) return aTier - bTier;

  const aEnd = toMs(a.current_period_end) ?? Infinity;
  const bEnd = toMs(b.current_period_end) ?? Infinity;
  return bEnd - aEnd; // later end date (or perpetual/null → Infinity) sorts first
}

/**
 * Find the best active license for a product from the `licenses` table rows.
 * See compareLicenseRows for the full selection order. Returns null if no
 * matching row. The returned row has trial_ends_at/current_period_end coerced
 * to epoch ms (toMs) — callers get numbers even if the source rows carried
 * Supabase's ISO-string timestamptz values (P1-1).
 *
 * @param {object[]} licenseRows - all rows for this user from Supabase `licenses`
 * @param {string}   product     - from PRODUCTS ('riffwork' | 'rigwork')
 * @param {number}   [nowMs]     - injectable clock for testing
 */
export function sessionToLicense(licenseRows, product, nowMs = Date.now()) {
  if (!licenseRows?.length) return null;
  const rows = licenseRows.filter(r => r.product === product);
  if (!rows.length) return null;
  const best = [...rows].sort((a, b) => compareLicenseRows(a, b, nowMs))[0];
  return {
    ...best,
    trial_ends_at:      toMs(best.trial_ends_at),
    current_period_end: toMs(best.current_period_end),
  };
}

/**
 * Resolve the full account state object from Supabase auth.
 * Call after getUser() + fetching the licenses table; pass through to product state.
 *
 * @param {object|null} supabaseUser  - from supabase.auth.getUser().data.user
 * @param {object[]}    licenseRows   - rows from `licenses` (all products for this user)
 * @param {string}      product       - from PRODUCTS
 * @param {number}      [nowMs]       - injectable clock for testing
 * @returns {{ user, license, isPro, isTrial, trialExpired, daysLeft, tierLabel, midiCap, songCap }}
 *   isTrial: status==='trialing', clock-independent (matches license.js's isTrialing).
 *   trialExpired: isTrial is true AND the trial window has closed (isActive is
 *     false) — lets a UI distinguish "Trial - 3d left" from "Trial ended -
 *     subscribe" instead of both reading isTrial:true forever (P2-5).
 */
export function resolveAccountState(supabaseUser, licenseRows, product, nowMs = Date.now()) {
  if (!supabaseUser) return { ...FREE_STATE };
  const user    = createUser({ id: supabaseUser.id, email: supabaseUser.email });
  const license = sessionToLicense(licenseRows ?? [], product, nowMs);
  const pro     = isPro(license, nowMs);
  const trial   = isTrialing(license);
  return {
    user,
    license,
    isPro:        pro,
    isTrial:      trial,
    trialExpired: trial && !isActive(license, nowMs),
    daysLeft:     trialDaysRemaining(license, nowMs),
    tierLabel:    accountTierLabel(license, pro),
    midiCap:      midiDeviceCap(license, nowMs),
    songCap:      cloudSongCap(license, nowMs),
  };
}

/**
 * Label for the resolved account state. Only a Pro state gets a Pro label.
 * A past_due license shows its tier plus a payment-issue note; any other
 * non-Pro state (cancelled, expired, lapsed trial) reads as 'Free'.
 * @param {object|null} license
 * @param {boolean}     pro - the already-resolved Pro flag for this state
 */
function accountTierLabel(license, pro) {
  if (pro) return getTierLabel(license?.tier);
  if (license?.status === STATUS.past_due) return `${getTierLabel(license.tier)}, payment issue`;
  return 'Free';
}
