# gp-core Schema Rules

These rules govern every object type the spine defines. Every lane (Tools, Riffwork, RigWork)
inherits them. A version only ships when these rules are satisfied.

## The cardinal rule: preserve-unknown on write

Every client that saves a spine object must spread-merge, never reconstruct from scratch:

```js
// CORRECT — unknown fields survive
const saved = { ...loaded, name: newName };

// WRONG — unknown fields are destroyed
const saved = { _v: 1, id: loaded.id, name: newName, /* ... explicit list */ };
```

A 2-year-old pinned desktop client must never corrupt data written by a newer version.

## Version field

Every stored object has a `_v: number` integer field:

- `_v` is independent of the package semver — it tracks the schema revision, not the library release.
- `_v` starts at `1` and increments only on breaking change.
- Additive changes (new optional fields) do NOT increment `_v`.
- Unknown `_v` values: treat as "newer than me" — load read-only, never overwrite.

## Additive only

Schema changes must be backward-compatible:

- New fields are always **optional** (old clients that don't write them produce valid objects).
- **No field is ever removed** from a schema. Mark deprecated fields with `@deprecated` in JSDoc.
- Rename = add the new field (optional), keep the old field (deprecated), migrate lazily on read.

## Breaking changes (incrementing `_v`)

A breaking change is anything that would corrupt data if a v(N) client reads v(N+1) data:

- A field becoming required that was optional.
- A field changing its type.
- A field's semantic meaning changing incompatibly.

When a breaking change lands:

1. Increment `_v` on the schema factory.
2. Add a migration shim at `src/<package>/migrations/v<from>_to_v<to>.js`.
3. Each consumer calls the shim on load (lazy, non-destructive — original is untouched until save).
4. Tag the gp-core release **before** any product bot ships a consumer.

## Forward-compat: what a client does with a `_v` it doesn't recognize

Decided 2026-07-11 (see TODO_gp_core_fable_sweep_2026-07-11.md, P1-6). Before
this, most normalizers exact-matched `raw._v === 1` as their "already
normalized, trust it" check. A `_v: 2` row from a newer client fell through to
the LEGACY branch instead — which reconstructs the object from an explicit,
enumerated field list (`createX({ field: raw.field ?? default, ... })`) and
unconditionally stamps `_v: 1`. That silently **destroys every field the row
carried that this code doesn't know about, and downgrades its version marker**.
A user opening a v2 show on an unupdated gig laptop and re-saving would nuke
the v2 data. Two different policies now apply, split by whether the type has
its own top-level decode entry point (a "file") or only ever appears nested
inside one (a "row"):

**Row-level types** (SetlistEntry, Setlist, Section, ShowFileRw,
ShowFileSection, ShowFileSongEntry, RigCue/RigAutomation, ClockCue,
ClickTrack, OscTarget/OscMessage/OscArg, License, GearItem, Board, Part —
i.e. everything except ShowFile itself): **`_v >= current` is treated as
current.** The normalizer's fast path:

```js
export function normalizeX(raw) {
  if (!raw) return null;
  if (raw._v >= 1) return { ...raw };   // >=, not ===, and always a fresh copy
  return createX({ ...raw, /* explicit field mapping for pre-_v legacy data */ });
}
```

`raw._v >= 1` only falls through to the legacy/create branch for genuinely
versionless data (`_v` missing or `0`) — never for a future version. A row
with `_v: 2` is preserved read-only, unknown fields intact, `_v` never
overwritten downward. When a nested collection exists, walk it through its own
normalizer rather than trusting it as-is (a decoded payload can carry a
top-level `_v` matching current while a nested field is stale/legacy-shaped —
see normalizeShowFileSongEntry for the pattern).

**File-level types** (currently only ShowFile — the durable, portable,
whole-gig artifact with its own `encode`/`decode` pair): **refuse a `_v`
greater than current.** `normalizeShowFile`/`decodeShowFile` return `null`
rather than attempting to interpret a file this code doesn't understand — a
Show File gets handed between machines running different gp-core versions,
and "silently drop the fields you don't recognize" is worse than "refuse to
open, ask the user to update." `decodeShowFile` keeps its existing null-only
return contract (every current caller null-checks it); use the separate,
additive `describeShowFileDecodeError(str)` export if you need to tell "newer
version" apart from "malformed" for a user-facing message.

If gp-core ever grows a second file-level type with its own encode/decode
pair, give it the same refuse-if-newer treatment as ShowFile, not the
row-level `>=` treatment.

## Migration shim shape

```js
// src/gear/migrations/v1_to_v2.js
export function migrateGearItemV1toV2(item) {
  if (item._v !== 1) return item;          // only migrate the right version
  return { ...item, _v: 2, newField: null }; // spread — unknown fields survive
}
```

## Package versioning vs schema versioning

| Thing            | What it tracks                    | Who bumps it            |
|------------------|-----------------------------------|-------------------------|
| npm semver       | API surface (exports, function signatures) | Spine bot, on any change |
| Schema `_v`      | Stored object breaking changes    | Spine bot, breaking only |

Products pin by **npm tag**: `"@gp/core": "github:saundehe/gp-core#v0.1.0"`.
They bump the pin deliberately — never float (`#main`, `#latest` are banned in production).

## Acyclic dependency graph

Current internal deps (keep acyclic):

```
@gp/gear     — standalone
@gp/theory   — standalone
@gp/account  — standalone
@gp/part     — standalone
@gp/song     — depends on @gp/gear (Rig track CC automation needs device CC maps)
```

`@gp/song` may import from `@gp/gear`. No other cross-package imports within core.
