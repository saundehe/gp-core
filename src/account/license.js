export const TIERS = Object.freeze({
  monthly:      'monthly',
  annual:       'annual',
  perpetual_v1: 'perpetual_v1',
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
