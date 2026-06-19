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
