export const TIERS = Object.freeze({
  monthly:      'monthly',
  annual:       'annual',
  perpetual_v1: 'perpetual_v1',
});

export const TRIAL_DURATION_DAYS = 14;

/**
 * Free-tier caps — the single source of truth for both the logged-out path
 * (session.js's FREE_STATE) and the logged-in path (midiDeviceCap/cloudSongCap
 * below). Edit a pricing change here; nothing else should hardcode 2 or 5.
 */
export const FREE_CAPS = Object.freeze({
  midi:  2,
  songs: 5,
});

export const PRODUCTS = Object.freeze({
  riffwork: 'riffwork',
  rigwork:  'rigwork',
});

export const STATUS = Object.freeze({
  active:    'active',
  cancelled: 'cancelled',
  past_due:  'past_due',
  trialing:  'trialing',
});

const TIER_LABELS = {
  [TIERS.monthly]:      'Pro (monthly)',
  [TIERS.annual]:       'Pro (annual)',
  [TIERS.perpetual_v1]: 'Pro (lifetime)',
};

export function getTierLabel(tier) {
  return TIER_LABELS[tier] ?? 'Free';
}

/**
 * True if the license row represents an active or trialing subscription.
 * A 'trialing' license whose trial window has closed is no longer active.
 * @param {object|null} license
 * @param {number} [nowMs] - injectable clock for testing
 */
export function isActive(license, nowMs = Date.now()) {
  if (!license) return false;
  if (license.status === STATUS.trialing) {
    // A trial is active only until its trial_ends_at timestamp passes.
    return !license.trial_ends_at || license.trial_ends_at > nowMs;
  }
  return license.status === STATUS.active;
}

/**
 * True when the user has a non-free Pro entitlement.
 * An active subscription past its current_period_end (see isExpired) is not Pro;
 * perpetual licenses have no period end and stay Pro.
 * @param {object|null} license
 * @param {number} [nowMs] - injectable clock for testing
 */
export function isPro(license, nowMs = Date.now()) {
  if (isExpired(license, nowMs)) return false;
  return isActive(license, nowMs) && !!license.tier;
}

/**
 * Max MIDI devices for RigWork.
 * Returns null (unlimited) for Pro, 2 for free.
 * @param {object|null} license
 * @param {number} [nowMs] - injectable clock for testing
 */
export function midiDeviceCap(license, nowMs = Date.now()) {
  return isPro(license, nowMs) ? null : FREE_CAPS.midi;
}

/**
 * Max cloud songs for Riffwork.
 * Returns null (unlimited) for Pro, 5 for free.
 * @param {object|null} license
 * @param {number} [nowMs] - injectable clock for testing
 */
export function cloudSongCap(license, nowMs = Date.now()) {
  return isPro(license, nowMs) ? null : FREE_CAPS.songs;
}

/** True if the license is in the trial period (not yet converted to a paid sub). */
export function isTrialing(license) {
  return !!license && license.status === STATUS.trialing;
}

/** True if the license tier is a perpetual one-time purchase. */
export function isPerpetual(license) {
  return !!license && license.tier === TIERS.perpetual_v1;
}

/**
 * True if the license belongs to the given product AND is Pro-active.
 * Useful when a caller holds multiple licenses (one per product).
 * @param {object|null} license
 * @param {string} product - from PRODUCTS
 * @param {number} [nowMs] - injectable clock for testing
 */
export function isProFor(license, product, nowMs = Date.now()) {
  return isPro(license, nowMs) && license.product === product;
}

/**
 * Days remaining in a trial. Returns null if not trialing or no end date.
 * Returns 0 if the trial has expired. Accept nowMs for testability.
 * @param {object|null} license
 * @param {number} [nowMs]
 */
export function trialDaysRemaining(license, nowMs = Date.now()) {
  if (!isTrialing(license) || !license.trial_ends_at) return null;
  const ms = license.trial_ends_at - nowMs;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * True if a subscription's current_period_end is in the past.
 * Returns false if the license has no period end (e.g. perpetual).
 * @param {object|null} license
 * @param {number} [nowMs]
 */
export function isExpired(license, nowMs = Date.now()) {
  if (!license || !license.current_period_end) return false;
  return license.current_period_end < nowMs;
}

/**
 * True if a perpetual owner's major_version_owned is older than currentMajor.
 * Their frozen desktop still works; they get the evergreen web seat but won't
 * auto-receive major desktop updates without paying the update fee.
 * @param {object|null} license
 * @param {number} currentMajor - current app major version (integer)
 */
export function isVersionLocked(license, currentMajor) {
  if (!isPerpetual(license)) return false;
  if (!license.major_version_owned) return false;
  return license.major_version_owned < currentMajor;
}

/**
 * True if the perpetual license covers currentMajor (owner can run this version's desktop).
 * @param {object|null} license
 * @param {number} currentMajor
 */
export function ownsVersion(license, currentMajor) {
  if (!isPerpetual(license) || !isActive(license)) return false;
  return !!license.major_version_owned && license.major_version_owned >= currentMajor;
}
