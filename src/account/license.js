export const TIERS = Object.freeze({
  monthly:      'monthly',
  annual:       'annual',
  perpetual_v1: 'perpetual_v1',
});

export const TRIAL_DURATION_DAYS = 14;

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

/** True if the license row represents an active or trialing subscription. */
export function isActive(license) {
  if (!license) return false;
  return license.status === STATUS.active || license.status === STATUS.trialing;
}

/** True when the user has a non-free Pro entitlement. */
export function isPro(license) {
  return isActive(license) && !!license.tier;
}

/**
 * Max MIDI devices for RigWork.
 * Returns null (unlimited) for Pro, 2 for free.
 */
export function midiDeviceCap(license) {
  return isPro(license) ? null : 2;
}

/**
 * Max cloud songs for Riffwork.
 * Returns null (unlimited) for Pro, 5 for free.
 */
export function cloudSongCap(license) {
  return isPro(license) ? null : 5;
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
 */
export function isProFor(license, product) {
  return isPro(license) && license.product === product;
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
