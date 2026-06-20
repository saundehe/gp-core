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
    ...props,
  };
}

/** Idempotent upgrade for legacy license rows that predate _v. */
export function normalizeLicense(raw) {
  if (!raw) return null;
  if (raw._v >= 1) return { ...raw };
  return { _v: 1, current_period_end: null, major_version_owned: null, ...raw };
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
