// Offline entitlement cache — lets a booted app keep a Pro session alive for a
// grace window with no network (G1, 2026-07-11 sweep). This is the gp-core
// half of the offline story: pure, clock-injectable cache creation +
// verification, no I/O, no persistence. Apps own storage (localStorage / a
// file on the Tauri sidecar's disk) and call createEntitlementCache on write,
// verifyEntitlementCache on read.
//
// SECURITY NOTE: this cache is NOT signed. A user with filesystem/localStorage
// access can hand-edit the cached blob (change the license row, push
// verifiedAt/maxSeenClock forward, raise graceDays) and grant themselves
// offline Pro indefinitely. That is an accepted, documented limitation for
// now — this module only protects against *accidental* staleness (a real Pro
// user losing entitlement because the venue has no wifi) and casual clock-back
// tampering, not a determined attacker. Server-side signing (HMAC'd or
// public-key signed blob, minted by the same backend that owns the `licenses`
// table) is required before this can gate a paid tier with real confidence —
// see G1/G4 in TODO_gp_core_fable_sweep_2026-07-11.md. Do not remove this
// note when that lands; update it instead.

import { normalizeLicense } from './schema.js';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Snapshot a license row into a cache blob at nowMs.
 * verifiedAt and maxSeenClock start equal — maxSeenClock only ever moves
 * forward (see verifyEntitlementCache's clock-rollback check) and is the
 * field apps should re-stamp forward on every successful online re-verify,
 * without necessarily refreshing verifiedAt/the license itself.
 * @param {object|null} license  - a resolved license row (e.g. sessionToLicense's output)
 * @param {number} [nowMs]
 * @returns {{_v:1, license:object|null, verifiedAt:number, maxSeenClock:number}}
 */
export function createEntitlementCache(license, nowMs = Date.now()) {
  return {
    _v: 1,
    license: normalizeLicense(license),
    verifiedAt: nowMs,
    maxSeenClock: nowMs,
  };
}

/**
 * Verify a cached entitlement blob for offline use. Fails CLOSED — every
 * ambiguous or suspicious case returns valid:false, never valid:true:
 *   - missing/malformed cache (no license, non-numeric verifiedAt/maxSeenClock)
 *   - clock rollback: nowMs < cached.maxSeenClock (the system clock moved
 *     backwards since the last time this cache saw it — the standard way to
 *     defeat a naive offline-grace window by setting the clock back)
 *   - grace expired: verifiedAt is more than graceDays in the past
 *
 * On success, returns the cached (already toMs-coerced by normalizeLicense)
 * license so the caller can feed it straight into resolveAccountState.
 *
 * @param {object|null} cached - createEntitlementCache's output, as loaded from disk
 * @param {object} [opts]
 * @param {number} [opts.nowMs]
 * @param {number} [opts.graceDays=30] - subs get a fixed grace window; callers
 *   wanting per-tier policy (perpetual: indefinite; trials: none/short — see
 *   G1) should branch on cached.license.tier before calling, or pass a
 *   caller-computed graceDays.
 * @returns {{valid:boolean, license:object|null, graceRemaining:number|null, reason:string|null}}
 */
export function verifyEntitlementCache(cached, { nowMs = Date.now(), graceDays = 30 } = {}) {
  if (
    !cached || typeof cached !== 'object' ||
    !cached.license || typeof cached.license !== 'object' ||
    typeof cached.verifiedAt !== 'number' || !Number.isFinite(cached.verifiedAt) ||
    typeof cached.maxSeenClock !== 'number' || !Number.isFinite(cached.maxSeenClock)
  ) {
    return { valid: false, license: null, graceRemaining: null, reason: 'malformed-cache' };
  }

  if (nowMs < cached.maxSeenClock) {
    return { valid: false, license: null, graceRemaining: null, reason: 'clock-rollback' };
  }

  const graceEndsAt = cached.verifiedAt + graceDays * MS_PER_DAY;
  if (nowMs >= graceEndsAt) {
    return { valid: false, license: null, graceRemaining: 0, reason: 'grace-expired' };
  }

  const graceRemaining = Math.max(0, Math.ceil((graceEndsAt - nowMs) / MS_PER_DAY));
  return { valid: true, license: cached.license, graceRemaining, reason: null };
}
