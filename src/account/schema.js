import { STATUS, TIERS, TRIAL_DURATION_DAYS, toMs } from './license.js';

let _c = 0;
function uid() { return (++_c).toString(36) + Math.random().toString(36).slice(2, 6); }

/**
 * Canonical shape of a row from the `licenses` table.
 * Spread-merge on write — never reconstruct.
 */
export function createLicense(props = {}) {
  return {
    _v: 1,
    id: uid(),
    user_id: null,
    product: null,
    tier: null,
    status: 'active',
    current_period_end: null,
    major_version_owned: null,
    trial_ends_at: null,
    ...props,
  };
}

/**
 * Create an app-managed trial license (no card, 14-day window per product).
 * Apps store this in Supabase `licenses` or localStorage; check `trialDaysRemaining` on load.
 * @param {string} product - from PRODUCTS ('riffwork' | 'rigwork')
 * @param {number} [nowMs]  - injectable for testing; defaults to Date.now()
 */
export function createTrial(product, nowMs = Date.now()) {
  return createLicense({
    product,
    tier: TIERS.monthly,
    status: STATUS.trialing,
    trial_ends_at: nowMs + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000,
  });
}

/**
 * Idempotent upgrade for legacy license rows that predate _v.
 * Also coerces trial_ends_at/current_period_end to epoch ms (toMs) — the
 * boundary fix for P1-1: a Supabase `timestamptz` selects as an ISO string,
 * and every comparison in license.js needs a number. Coercing once here means
 * a caller who runs rows through normalizeLicense before resolveAccountState
 * never hits the ISO-string leak, even before the defensive toMs() calls
 * inside isActive/isExpired/trialDaysRemaining.
 */
export function normalizeLicense(raw) {
  if (!raw) return null;
  const base = raw._v >= 1 ? { ...raw } : { _v: 1, current_period_end: null, major_version_owned: null, ...raw };
  return {
    ...base,
    trial_ends_at:      toMs(base.trial_ends_at),
    current_period_end: toMs(base.current_period_end),
  };
}

/**
 * Thin normalized user record (from Supabase auth.session.user).
 * Apps pass the raw Supabase user through this before storing/diffing.
 */
export function createUser(props = {}) {
  return {
    _v: 1,
    id: null,
    email: null,
    ...props,
  };
}
