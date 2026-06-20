import { createUser } from './schema.js';
import {
  isPro, isTrialing, midiDeviceCap, cloudSongCap,
  trialDaysRemaining, getTierLabel,
} from './license.js';

/**
 * Account state for a logged-out or unlicensed user.
 * Products copy this via spread — the object itself is frozen.
 */
export const FREE_STATE = Object.freeze({
  user:      null,
  license:   null,
  isPro:     false,
  isTrial:   false,
  daysLeft:  null,
  tierLabel: 'Free',
  midiCap:   2,
  songCap:   5,
});

/**
 * Find the best active license for a product from the `licenses` table rows.
 * Priority: active > trialing > past_due > cancelled.
 * Returns null if no matching row.
 *
 * @param {object[]} licenseRows - all rows for this user from Supabase `licenses`
 * @param {string}   product     - from PRODUCTS ('riffwork' | 'rigwork')
 */
export function sessionToLicense(licenseRows, product) {
  if (!licenseRows?.length) return null;
  const rows = licenseRows.filter(r => r.product === product);
  if (!rows.length) return null;
  const ORDER = { active: 0, trialing: 1, past_due: 2, cancelled: 3 };
  return [...rows].sort((a, b) => (ORDER[a.status] ?? 99) - (ORDER[b.status] ?? 99))[0];
}

/**
 * Resolve the full account state object from Supabase auth.
 * Call after getUser() + fetching the licenses table; pass through to product state.
 *
 * @param {object|null} supabaseUser  - from supabase.auth.getUser().data.user
 * @param {object[]}    licenseRows   - rows from `licenses` (all products for this user)
 * @param {string}      product       - from PRODUCTS
 * @param {number}      [nowMs]       - injectable clock for testing
 * @returns {{ user, license, isPro, isTrial, daysLeft, tierLabel, midiCap, songCap }}
 */
export function resolveAccountState(supabaseUser, licenseRows, product, nowMs = Date.now()) {
  if (!supabaseUser) return { ...FREE_STATE };
  const user    = createUser({ id: supabaseUser.id, email: supabaseUser.email });
  const license = sessionToLicense(licenseRows ?? [], product);
  const pro     = isPro(license);
  return {
    user,
    license,
    isPro:     pro,
    isTrial:   isTrialing(license),
    daysLeft:  trialDaysRemaining(license, nowMs),
    tierLabel: getTierLabel(license?.tier),
    midiCap:   midiDeviceCap(license),
    songCap:   cloudSongCap(license),
  };
}
