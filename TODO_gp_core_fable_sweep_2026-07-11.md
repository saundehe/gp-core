# gp-core adversarial sweep — 2026-07-11

Scope: full spine at HEAD 8d99df1 (v0.11.0, 288 tests green). Every finding below was
re-verified by executing the concrete failure scenario against the live source (and dist)
before inclusion. Consumer call sites checked read-only in rig-topology-flip + riffwork.
Known/not reported: defId vs defKey/devKey drift; Hedra model byte 0x04 + glide bit0.

Tags: [Sonnet] = mechanical, hand to cheap model. [Opus] = needs design judgment.
[Heath] = needs a human decision or hardware/manual verification.

---

## P0

### P0-1. Committed `dist/` bundles predate the Pro-gate and Korg fixes — the fixed bugs still ship
- **File:** `dist/account.esm.js`, `dist/gear.esm.js` (last rebuilt in commit d75e997, 2026-06-20; fixes 42cd53f + 9451f33 landed 2026-07-07). Build script: `scripts/build.js`. `package.json` `files` includes `dist/`.
- **Failure scenario (executed):** importing `dist/account.esm.js` and calling `isPro({status:'active', tier:'monthly', current_period_end: <30 days ago>})` returns **true**; expired trial also returns **true**. `dist/gear.esm.js` still carries 72 korg_minilogue_xd presets with `recallPC 128-199` and **zero** bank fields, no `isValidBank` export, and the pre-backfill `normalizeGearItem` (returns item without `presets`/`boardIds` arrays). Any script-tag consumer (gpdoom-tools per the build.js header) or anything bundling from `dist/` ships the expired-trial/lapsed-sub Pro leak that was already "fixed."
- **Fix:** run `npm run build`, commit fresh dist. Then prevent recurrence: either (a) stop committing `dist/` and build on publish, or (b) add a test/pre-commit check that fails when `dist/*.esm.js` is older than any `src/**` file (or asserts a canary: `isPro(lapsedSub)===false` imported from dist).
- **Tag:** [Sonnet] (rebuild + guard test)

---

## P1

### P1-1. License time fields compared as raw values — ISO-string timestamps silently defeat every expiry gate (and riffwork passes ISO strings today)
- **File:** `src/account/license.js:51` (`isActive`), `:117` (`trialDaysRemaining`), `:129` (`isExpired`). Live violation: `riffwork/src/auth.js:187-196` selects `current_period_end, trial_ends_at` straight off Supabase (`timestamptz` → ISO strings) and feeds them to `resolveAccountState` unconverted.
- **Failure scenario (executed):** `isPro({status:'active', current_period_end:'2026-01-01T00:00:00.000Z'}, now)` → string-vs-number compare → `NaN` → `isExpired` **false** → lapsed sub is **Pro forever** (fails open; re-opens the exact leak 42cd53f fixed). Symmetrically `isPro({status:'trialing', trial_ends_at:'2026-08-01T...'}) ` → **false**: a valid trial user is locked out (fails closed). `trialDaysRemaining` returns `NaN` → riffwork renders "(NaNd left)" (`auth.js:371-374`). Currently masked because riffwork's gate is the `isPro(){return true}` early-access stub — it detonates the day the stub is removed.
- **Fix:** in gp-core, coerce once at the boundary: a `toMs(v)` helper (`number → v`, `string → Date.parse`, else `null`) applied to `trial_ends_at`/`current_period_end` inside `normalizeLicense` and at the top of `resolveAccountState`/`sessionToLicense`; the comparison helpers then also `toMs()` defensively. Add tests with ISO-string rows. Separately fix riffwork `_fetchLicense` to convert (belt and suspenders).
- **Tag:** [Sonnet]

### P1-2. Trialing license with missing/null `trial_ends_at` is permanent Pro (tamper + malformed-row path)
- **File:** `src/account/license.js:51` — `return !license.trial_ends_at || license.trial_ends_at > nowMs;` fails **open**. `normalizeLicense` (`src/account/schema.js:41-45`) does not backfill `trial_ends_at`, and `schema.js:27` documents storing trials in localStorage.
- **Failure scenario (executed):** `isPro({status:'trialing', tier:'monthly'}, now)` → **true**, forever. Any user who edits a locally cached/localStorage license row and deletes `trial_ends_at` (or a malformed server row with NULL) gets unlimited Pro. Combined with P1-1, `trial_ends_at:''` also passes (`!''` → true).
- **Fix:** fail closed: a trialing license with no parseable `trial_ends_at` is NOT active. One-line change + test. (Anti-rollback/signing is the offline-grace design's job — see Gaps.)
- **Tag:** [Sonnet]

### P1-3. `sessionToLicense` picks by status order only — an expired 'active' row beats a live trial; perpetual-vs-monthly is nondeterministic
- **File:** `src/account/session.js:37-38`.
- **Failure scenario (executed):** rows = `[{status:'active', current_period_end: yesterday}, {status:'trialing', trial_ends_at: +7d}]` → sort picks the dead 'active' row → `resolveAccountState(...).isPro` = **false**. Real-world: Stripe webhook lag leaves a lapsed 'active' row while the user starts a new trial (or holds a valid perpetual + a lapsed monthly) → paying/trialing user sees Free / wrong tierLabel. Tie between two same-status rows is stable-sort order = whatever the DB returned (flagged 7/06, tiebreak still absent).
- **Fix:** select the best row by `isPro(row, nowMs)` first (thread `nowMs` into `sessionToLicense`), then status order, then tier rank (perpetual > annual > monthly), then latest `current_period_end`. Tests for lapsed-active + live-trial and perpetual+monthly combos.
- **Tag:** [Sonnet]

### P1-4. `interpolateRigTrack` ramp-onto-ramp snaps to last settled value (audible pop) — flagged 2026-07-06, still unfixed
- **File:** `src/song/rig-track.js:70-86` (`fromValue = settled.get(key) ?? 0`).
- **Failure scenario (executed):** cue@bar1 ramps CC7 → 100 over 8 bars; cue@bar5 ramps → 20 over 4 bars. bar 4.9 → **49**; bar 5.0 → **0** (snap), then ramps 0→20. On a volume/mix ramp at a gig that is an audible pop. Only ramp-onto-in-flight-ramp is broken; the 7/06 sweep called it high and no commit since touches it.
- **Fix:** when starting a new ramp on a key with an in-flight ramp, first resolve the in-flight ramp's interpolated value at `cue.bar`, settle it, and use it as `from`. Add a ramp-chaining test (bar 4.9 ≈ 49, bar 5.0 === 49, bar 9 === 20).
- **Tag:** [Sonnet]

### P1-5. `createRigTrack`/`decodeRigTrack` trust any cue carrying `_v:1` — missing `automations` crashes `interpolateRigTrack` at show time
- **File:** `src/song/rig-track.js:49` (`c._v === 1 ? c : createRigCue(c)` — no backfill), crash at `:70` (`for (const auto of cue.automations)`).
- **Failure scenario (executed):** `decodeRigTrack(encodeB64url([{_v:1, bar:1}]))` decodes "successfully" to `[{_v:1, bar:1}]` (the try/catch never fires), then `interpolateRigTrack(track, 2)` throws `cue.automations is not iterable` — a truncated/hand-edited share payload becomes a runtime crash during playback instead of a decode-time fallback. Same trust pattern in `clockwork/clock-cue.js:51` (`osc_messages` missing → sidecar iteration crash).
- **Fix:** route every cue through a backfilling normalizer (mirror `normalizeGearItem`'s "backfill even when `_v` present" pattern): ensure `automations`/`osc_messages` arrays and numeric `bar` in `createRigTrack`/`createClockTrack`. Test: decode `[{_v:1,bar:1}]` then interpolate.
- **Tag:** [Sonnet]

### P1-6. No forward-compat policy: `raw._v === 1` exact-match routes FUTURE file versions through lossy legacy paths (new file into old code = silent data destruction)
- **File:** `src/song/showfile.js:35, 78, 121, 196`; `src/song/setlist.js:34, 71`; `src/song/section.js:32`; `src/song/rig-track.js:35`; `src/clockwork/clock-cue.js:36`, `click.js:39`. (Contrast: `account/schema.js:43` and `part/part.js:86` correctly use `_v >= 1`.)
- **Failure scenario (executed):** a `_v:2` Show File (future gp-core) opened in today's code: `normalizeShowFile` falls into the legacy branch, whose enumerated `createShowFile({id, name, date, notes, setlist, songs})` call **drops every unknown top-level field** (verified: `newV2Field` gone) and stamps `_v:1`, while nested objects keep `_v:2` → a hybrid, downgraded artifact. User opens a show on the studio machine (updated) then the gig laptop (not updated), re-saves → v2 data destroyed. Same for setlist entries/sections via their enumerated legacy paths. This directly undermines the "one artifact = whole gig" durability promise in SHOWFILE_SPEC.
- **Fix (design decision):** pick a policy and apply it uniformly: (a) treat `_v >= 1` as current and preserve-unknown (`...rest` spread in every legacy create call, never overwrite a higher `_v` downward), or (b) refuse to load higher-`_v` files with a clear "made with a newer version" error. (b) is safest for show files; (a) for row-level types. Document in SCHEMA_RULES.md; add "v2-into-v1" round-trip tests.
- **Tag:** [Opus] policy + [Sonnet] mechanical application

---

## P2

### P2-1. One corrupt/null array entry nukes the whole Show File decode
- **File:** `src/song/setlist.js:64` (`entries.map(e => e._v === 1 ...)`), `src/song/showfile.js:113`.
- **Failure scenario (executed):** `normalizeShowFile({_v:1, setlist:{entries:[null, {song_id:'ok'}]}, songs:{}})` throws (`reading '_v'` of null) → `decodeShowFile` catches → returns **null** → the entire gig artifact is reported unreadable because of one damaged slot. `createShowFileSongEntry({sections: null})` / `createSetlist({entries: null})` similarly throw (destructuring defaults only cover `undefined`).
- **Fix:** filter non-object entries (or map to a placeholder entry) in `createSetlist`/`createShowFileSongEntry`/`createRigTrack`; use `?? []` coalescing inside, not just parameter defaults. Salvage the rest of the show.
- **Tag:** [Sonnet]

### P2-2. `normalize*` fast paths return the caller's own mutable reference (inconsistent aliasing, partially fixed 7/06)
- **File:** `src/song/setlist.js:34, 71`; `src/song/showfile.js:35, 78`; `src/song/rig-track.js:36`; `src/clockwork/clock-cue.js:36`, `click.js:39`, `osc.js:46`; `src/gear/schema.js:138` (`normalizeBoard` also skips device normalization entirely when `board._v` is set — a hand-synced `_v:1` board with array-less devices still crashes `item.presets.map`, the exact hole `normalizeGearItem` was fixed for).
- **Failure scenario:** `const s = normalizeSetlist(raw); s.entries.push(...)` mutates `raw` (or shared state); `normalizeShowFile`'s deep path normalizes setlists/songs but `normalizeSetlist(_v:1)` passes legacy-shaped `entries` through untouched. Divergent from `normalizeSong`/`normalizeLicense`/`normalizePart` copy semantics in the same library.
- **Fix:** one rule (already half-written in normalizeShowFile's comment): normalizers always return a fresh top-level object and walk nested collections. Apply to the six files; make `normalizeBoard` run its device map even when `_v` present.
- **Tag:** [Sonnet]

### P2-3. korg_minilogue (og): `programSelect max:199` with comment "user slots PC 100-199" — PC bytes above 127 do not exist
- **File:** `src/gear/device-defs.js:1918-1920`.
- **Failure scenario:** the raw Program picker offers 0-199; the send side has no bank-derivation note (unlike the xd fix at `:1444-1446`) and the comment actively instructs "send PC to load" for 100-199. PC 128-199 cannot be encoded in a 7-bit data byte at all; 100-127 rely on the og minilogue accepting raw PC >99, which the cited MIDI implementation chart (v1.21) does not obviously support without Bank Select. This is the same defect class 9451f33 fixed for the xd, left in place for the og. (xd itself verified clean: 200 presets, `bank.lsb = floor(i/100)`, `recallPC = i%100`, msb 0.)
- **Fix:** [Heath] confirm against the Korg Minilogue (og) MIDI implementation chart whether programs 101-200 need Bank Select LSB 1 (likely, mirroring the xd) — per the check-manual-first rule, do not guess. Then [Sonnet] either re-encode with the xd-style bank comment/derivation or clamp `programSelect.max` to 99.
- **Tag:** [Heath] verify → [Sonnet] fix

### P2-4. `ownsVersion` ignores its callers' clock — `isActive` called without `nowMs`
- **File:** `src/account/license.js:151`.
- **Failure scenario:** `ownsVersion(license, major)` has no `nowMs` parameter and calls `isActive(license)` → wall clock. Any consumer or test that injects a clock elsewhere gets mixed-clock evaluation (a trialing-perpetual row can flip mid-render). Cosmetic today, but it is the one entitlement function that cannot be tested deterministically.
- **Fix:** add `nowMs = Date.now()` param, thread through. `isVersionLocked` may want the same for symmetry.
- **Tag:** [Sonnet]

### P2-5. `resolveAccountState.isTrial` stays `true` after the trial expires
- **File:** `src/account/session.js:60` (`isTrial: isTrialing(license)` — status check only, no clock).
- **Failure scenario:** expired trial → `{isPro:false, isTrial:true, daysLeft:0}`. A consumer rendering "Trial - {daysLeft}d left" off `isTrial` shows "Trial - 0d left" forever instead of "Trial ended - subscribe". Riffwork's menu (`auth.js:371-377`) renders exactly this pair.
- **Fix:** either `isTrial: isTrialing(license) && isActive(license, nowMs)`, or keep and add `trialExpired` flag. Decide which the UIs want.
- **Tag:** [Sonnet] (+1-line decision [Heath])

### P2-6. Shared codec isn't exported to consumers — both apps hand-roll base64url and are already drifting
- **File:** `package.json` `exports` map (no `./codec` entry); `src/codec.js` header claims it's the shared routine. Consumers: riffwork `main.js:4074, 8256-8261` (`bytesToB64url`/`b64urlToBytes`), rig `main.js:7139, 7150, 9271` (raw `atob`/`btoa` setlist share links).
- **Failure scenario:** the codec.js header plans gzip; when that lands, gp-core-encoded artifacts (showfile `#show=`) and app-local encoders (rig setlist links) fork silently — old links decode in one app and not the other.
- **Fix:** add `"./codec": "./src/codec.js"` to exports, migrate the consumer call sites, delete the local copies.
- **Tag:** [Sonnet]

### P2-7. `interpolateRigTrack` key round-trip breaks if a `device_id` contains ':'
- **File:** `src/song/rig-track.js:71` (key = `` `${device_id}:${cc}` ``) vs `:96-98` (split on **first** `:`).
- **Failure scenario:** `device_id: 'usb:port1'` → key `usb:port1:64` → parsed back as `deviceId:'usb'`, `cc:NaN` ("port1:64"). Device ids today are uid()s so latent, but nothing validates that, and rig lets ids come from sync'd data.
- **Fix:** `key.lastIndexOf(':')`, one line + test.
- **Tag:** [Sonnet]

---

## Verified clean (checked, no finding)
- Expired-trial / lapsed-sub Pro-gate fix (42cd53f) **holds in src** for numeric-ms timestamps under injected clocks, including `resolveAccountState` caps/labels (510-line account suite re-run green). The two ways it re-breaks are P0-1 (stale dist) and P1-1 (ISO strings).
- Trial math: `createTrial` → exactly 14 days; `trialDaysRemaining` at start = 14, at end-1ms = 1, at end = 0 and `isActive` false at exactly `trial_ends_at` — boundary-consistent, no off-by-one.
- `encodeB64url`/`decodeB64url`: unicode (emoji, CJK), multi-chunk (>32KB) payloads, malformed input → throws as documented; lone surrogates are escaped by ES2019 JSON.stringify. base64url charset test present.
- FREE_CAPS single-source wiring (FREE_STATE ↔ cap helpers) intact.
- korg_minilogue_xd bank re-encode: all 200 presets satisfy `msb:0, lsb:floor(i/100), recallPC:i%100`.
- deviceDefs invariants (dup CCs, 7-bit ranges, option band monotonicity→127, preset CC subset, recallPC/bank rules) all enforced by tests at HEAD. A scan for "preset ccValue not a canonical option val" found ~120 hits (Meris Polymoon/Hedra/Enzo) but these are captured real-pedal values inside valid bands — the banding model handles them by design; not defects.

---

## GAPS / THINK-AHEAD (clearly marked — not bugs at HEAD)

### G1. Offline entitlement grace (parallel session designing TODAY — see Appendix for current-state map)
The spine has **no offline story at all**: riffwork fetches `licenses` live on every boot, keeps the result in memory only, and persists nothing; rig never checks entitlements. At a venue with no internet, a logged-in Pro user boots to `FREE_STATE` (or an unhandled promise rejection leaves stale in-memory state — `auth.js:52` has no `.catch`, and `auth.js:189` ignores the Supabase `error` object, silently downgrading paying users on transient 5xx). Design inputs the grace mechanism must cover, from this sweep:
- **Fail-direction table today:** network down → Free (fails closed, hurts paying users at gigs); query error → Free (closed); ISO timestamps → lapsed sub Pro (open) / valid trial Free (closed); missing trial_ends_at → Pro (open); clock rollback → expired trial revives (open). A grace design should make every path fail *closed with a grace window*, never open.
- Needs: a signed/HMAC'd cached-entitlement blob (license row + issued-at + max-seen-clock), a `verifyCachedEntitlement({cached, nowMs, graceDays})` in gp-core so both apps share one implementation, monotonic max-seen-time to defeat clock rollback, and a per-tier grace policy (subs: N days offline; perpetual: indefinite but version-locked; trials: none or short).
- P1-1/P1-2/P1-3 should land **before or with** the grace mechanism — caching license rows amplifies every one of them (a cached tampered row becomes a permanent offline Pro key).

### G2. Per-item sync timestamps (known LWW clobber in rig)
No gp-core schema (`GearItem`, `Board`, `Setlist`, `ShowFile`) carries `updated_at`/`rev`. Rig syncs whole `rig_data` blobs → last-writer-wins clobbers per-device edits from two machines. The spine is the right place for: `mtime` (ms) per item, a `mergeByMtime(a, b)` helper, and SCHEMA_RULES guidance that every mutation bumps `mtime`. Do this before Show File adoption spreads the same blob-LWW pattern to gigs.

### G3. Show-file spine adoption risk
Rig reads/writes raw `tracks` JSON via its `rig_tracks` table and its own setlist share codec — it bypasses `encodeRigTrack`/`decodeRigTrack`/`normalizeShowFile` entirely; riffwork never calls `decodeShowFile`. The spine's show-file code is currently **write-only infrastructure** — nothing exercises it in production, so drift (P1-6's versioning policy, scene/preset opaque payload shape) accumulates silently until adoption day. Recommend: adopt in rig's share-link path first (it already null-checks `decodeShowFile` correctly at `main.js:7610`), and land the P1-6 version policy before the first `.gpshow.json` leaves a user's machine.

### G4. VST licensing (LoopWork/plugin roadmap)
Current model assumes a browser/Supabase session; a VST needs: offline-first verification (G1's blob is the foundation), machine-count seats (nothing in the license row models devices), and a signed perpetual license file (ownsVersion/isVersionLocked already model major-version ownership — good bones). Decide early whether `licenses` rows grow `max_seats`/`machine_ids` or a separate `activations` table, because `sessionToLicense` selection (P1-3) must then rank per-machine.

### G5. Small consumer-drift items
- riffwork `FREE_CLOUD_LIMIT = 5` (`auth.js:6`) duplicates `FREE_CAPS.songs` — dies when pricing changes.
- riffwork's real gate is the `isPro(){return true}` stub (`auth.js:20`); rig's midiDeviceCap check is commented to `cap = null` (`main.js:4391-4400`). Both flips are launch-day landmines: schedule them with the grace mechanism, not after.

---

## APPENDIX — Current entitlement verification flow (for the offline-grace design session)

### gp-core functions (all pure, clock-injectable via `nowMs`, no I/O, no persistence)
```
src/account/license.js
  isActive(license, nowMs)        :47   status==='trialing' → trial_ends_at missing OR > nowMs  (missing ⇒ TRUE — P1-2)
                                        else status==='active'
  isExpired(license, nowMs)       :127  current_period_end && current_period_end < nowMs (no period end ⇒ false; ISO ⇒ always false — P1-1)
  isPro(license, nowMs)           :63   !isExpired && isActive && !!tier      ← THE gate
  isProFor(license, product, now) :105  isPro && product match
  midiDeviceCap / cloudSongCap    :74/84  isPro ? null(unlimited) : FREE_CAPS.midi(2)/songs(5)
  trialDaysRemaining(license,now) :115  ceil((trial_ends_at - now)/day), floor 0; null if not trialing
  isPerpetual/isVersionLocked/ownsVersion :94/139/150  perpetual major-version ownership (ownsVersion lacks nowMs — P2-4)

src/account/schema.js
  createLicense(props)            :10   canonical row shape (_v:1, status:'active', nulls)
  createTrial(product, nowMs)     :31   trialing row, tier=monthly, trial_ends_at = now + 14d (ms number)
  normalizeLicense(raw)           :41   _v backfill only — does NOT coerce timestamp types or backfill trial_ends_at

src/account/session.js
  FREE_STATE                      :14   frozen logged-out state {isPro:false, midiCap:2, songCap:5}
  sessionToLicense(rows, product) :33   filter by product, pick by status order active>trialing>past_due>cancelled
                                        (expiry-blind, no tier tiebreak — P1-3)
  resolveAccountState(user, rows, product, nowMs) :51
        → {user, license, isPro, isTrial, daysLeft, tierLabel, midiCap, songCap}
        THE single entry point consumers use.
```

### Consumer call sites and persistence (verified in-repo 2026-07-11)
```
riffwork/src/auth.js
  :2      imports resolveAccountState, FREE_STATE from '@gp/core/account' (file:../gp-core dep, src not dist)
  :187-196  _fetchLicense(): supabase.from('licenses').select('id, product, tier, status,
            current_period_end, trial_ends_at').eq('user_id', _user.id)
            → rows passed to resolveAccountState UNCONVERTED (timestamptz ⇒ ISO strings — P1-1)
            → { data } destructured, `error` IGNORED (query error ⇒ silently Free)
  :44, :52  called on session boot + auth-state change; :52 has no .catch (network failure ⇒
            unhandled rejection, stale in-memory state)
  :20     isPro() { return true }   ← the ACTUAL gate everywhere (early-access stub)
  :10     _accountState = {...FREE_STATE} in memory; NOTHING persisted (no localStorage/file)
  Uses of _accountState: :204 button label, :371-377 tier/daysLeft menu, :140 songCap (else
  local FREE_CLOUD_LIMIT=5). Functional gates all call the stub: main.js:8410, 8421, 9957, 9587, 9769; auth.js:65, 139.

rig-topology-flip/src/main.js
  :4      imports midiDeviceCap — but NO license fetch, NO resolveAccountState anywhere
  :4391-4400  the only enforcement point: `const cap = null; // midiDeviceCap(null);` (disabled)
  Supabase used for data only (rig_tracks :8890/:8905, rig_data :9782/:9960/:11076+, rig_rundowns :10244/:10266)

gpdoom-tools (per scripts/build.js header)
  script-tag imports dist/account.esm.js — currently STALE (P0-1): still has the Pro leak.

Never called anywhere: createTrial (client-side), normalizeLicense, sessionToLicense (directly),
trialDaysRemaining (directly), isProFor, cloudSongCap (directly).
```

### What state is persisted today
**None.** No cached license row, no last-verified timestamp, no max-seen clock, no signature.
Entitlement truth lives exclusively in the Supabase `licenses` table and is re-derived
in memory per app boot. The offline-grace design starts from a blank slate — which also
means it can define the cache format cleanly (recommend: versioned `_v` blob through
`normalizeLicense` with the P1-1 `toMs` coercion built in from day one).

---

## Applied 2026-07-11

All items landed except P2-3 (left below for Heath). Test suite: 288 -> 357 green,
in 4 commits on `master` (not pushed):

- `916407a` fix(account): P1-1 (toMs boundary coercion), P1-2 (trialing fails
  closed on missing/unparseable trial_ends_at), P1-3 (sessionToLicense
  best-row selection: isPro(now) > status order > tier rank > latest
  current_period_end, nowMs threaded), P2-4 (ownsVersion/isVersionLocked take
  nowMs), P2-5 (resolveAccountState.trialExpired). Plus the G1 gap: new
  `src/account/offline.js` — createEntitlementCache/verifyEntitlementCache,
  pure and clock-injectable, fails closed on a malformed cache, clock
  rollback, or expired grace window. Unsigned/client-only for now; the module
  header documents that server-side signing is required before this can gate
  a paid tier.
- `0f33f55` fix(song): P1-4 (ramp-onto-ramp resolves the in-flight ramp's
  value at the new cue's bar instead of snapping to 0 — verified bar 4.9 ≈ 49,
  bar 5.0 = 50 continuous, bar 9 = 20; the task brief's "bar 5.0 === 49" was
  off by the natural rounding at that exact halfway point — 50 is the
  mathematically correct continuous value, confirmed by direct computation),
  P1-5 (backfilling normalizer for rig/clock cues), P1-6 (policy applied:
  row-level types treat `_v >= current` as current + preserve-unknown;
  ShowFile itself refuses a `_v` greater than current — documented in
  SCHEMA_RULES.md), P2-1 (salvage null/corrupt array entries), P2-2 (fresh-copy
  aliasing fix for setlist/showfile/rig-track normalizers), P2-7
  (`lastIndexOf(':')` key split).
- `a1583b0` fix(clockwork): the same P1-5/P1-6/P2-1/P2-2 fixes applied to
  clock-cue.js/click.js/osc.js.
- `be07b04` fix(gear,build): P0-1 (rebuilt + committed fresh `dist/`, added
  `test/dist-canary.test.js` as a regression guard), P2-2 (normalizeBoard runs
  its device map even when `_v` is present), P2-6 (`"./codec"` export added;
  consumer migration NOT done, per the TODO's own scope note).

**Remaining — [Heath]:**
- P2-3 (korg_minilogue og bank encoding) — needs the physical MIDI
  implementation chart checked before any code change; left untouched.
- G2 (per-item sync timestamps / mtime + mergeByMtime), G3 (Show File
  adoption in rig's share-link path), G4 (VST licensing seats/activations),
  G5 (riffwork/rig consumer-side landmines: FREE_CLOUD_LIMIT duplication, the
  `isPro(){return true}` stub, the disabled midiDeviceCap check) — design/scope
  decisions outside gp-core, not touched this pass.
- Riffwork's own `_fetchLicense` ISO-string fix (belt-and-suspenders alongside
  gp-core's P1-1 toMs coercion) and consumer migration to the new `./codec`
  export (P2-6) both live in riffwork/rig, not gp-core — out of scope for this
  pass per "work only in this repo."
