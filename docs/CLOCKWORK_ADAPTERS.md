# Clockwork DAW Adapters — locator-driven section sync

Spec author: Fable 5, 2026-07-09. Status: DESIGN — Ableton adapter is the v1 target.
This is the "Clockwork" leg of the family (reserved name from the unification plan):
thin per-DAW adapters that feed named song sections into RigWork, so nobody programs
sections twice when the arrangement already has markers.

## Why adapters, not a plugin feature

VST3 / AU / AAX expose tempo, transport state, and playhead position to a plugin —
but NONE of them expose the marker/locator list. "The VST reads your locators" is not
portably buildable. So the architecture is:

- **One shared protocol** (below), carried over the existing Supabase Realtime bridge.
- **One thin adapter per DAW**, using whatever privileged API that DAW actually has.
- The future RigWork VST (wrapper #4) still makes sense for in-DAW UI + host-clock
  transport, but locator names come from the adapter, not the plugin API.

Division of labor with the rest of the stack (per RUNTIME_TOPOLOGY.md):
- **Clock/tempo** = MIDI clock chase (shipped on rig `topology/master-flip`). NOT this.
- **Sections** = this protocol. Network latency (~50-150ms Supabase RTT) is fine for
  section changes; it is NOT fine for clock, which is why clock stays on the MIDI wire.

## Per-DAW access matrix

| DAW | Marker access | Adapter form | Verdict |
|---|---|---|---|
| Ableton Live | Full (Live API: locator names, times, jump) | Max for Live device (needs Suite/M4L) | v1, best-in-class |
| Reaper | Full (ReaScript markers/regions; native OSC too) | Background ReaScript (Lua) | v2, easy |
| Pro Tools | Probable (official Scripting SDK, gRPC, 2022+; memory-location read needs a spike) | SDK client app | v3, spike first |
| Logic | None public (Scripter is per-track MIDI only) | No adapter — transport + PC-clip mode only | degraded mode, documented honestly |

## Shared protocol

Transport: the existing per-user Supabase Realtime broadcast channel model
(same pattern as `rwbridge:<userId>`, events `rw:section` / `rig:section`).
Adapters are a new INPUT-plane citizen (RUNTIME_TOPOLOGY.md: everything funnels
into `activateSection()`).

New events (channel: reuse `rwbridge:<userId>`; adapters are logically "another
Riffwork" — a section source):

- `daw:section` — DAW crossed a locator. Payload:
  `{ name, bar, beatsPerBar?, tempo?, songHint?, src: 'ableton'|'reaper'|'protools' }`
  - `name` = the locator name verbatim. RigWork matches it to a section.
  - `songHint` = optional; Ableton adapter sends the current Arrangement's set name
    or a user-set song field, for multi-song sets.
- `daw:transport` — `{ playing: bool, tempo }` on start/stop. RigWork MAY use this to
  mirror conductor start/stop when in External mode (same rules as extClockStart/Stop —
  no-op when nothing is cued, never when following a Bandleader).
- Downstream (two-way): adapters SHOULD subscribe to the existing `rig:section`
  broadcast and jump the DAW to the locator whose name matches. Ableton: jump only
  when transport is STOPPED (never yank a rolling arrangement) — same busy-guard
  philosophy as Riffwork's onRigSection toast.

### Name matching (RigWork side)

Match `daw:section.name` against section names in the active Show Mode song:
1. exact case-insensitive → 2. trimmed/normalized (collapse whitespace, strip
punctuation) → 3. prefix match ("Chorus 2" matches section "Chorus 2 (heavy)").
No match → toast once per unknown name per session ("Locator 'X' has no section"),
never spam per crossing. Match → `activateSection(si, xi)` — scene/preset firing,
heads, backing-track gating all come along for free.

Multi-song: if `songHint` present and matches a setlist song (same normalize),
constrain the search to it; else search the ACTIVE song only (do NOT wander the
whole setlist on bare names — "Chorus" exists in every song).

## Ableton adapter v1 — "Clockwork for Live" (M4L device)

One Max for Live device (audio-effect .amxd, sits on the master track), containing:

- **`live.observer` on the song's locators** + current song time. Detection: on each
  transport tick compare playhead against the sorted locator list; crossing a locator
  boundary fires `daw:section` with that locator's name. Also fire on user JUMP to a
  locator while stopped (programming workflow).
- **`node.script`** running `@supabase/supabase-js`, publishing to the bridge channel.
  Node for Max has full network access; no sidecar, no OSC, no C++ required.
- **Auth = the Bandleader join-code model, not stored credentials.** Device UI has a
  4-char code field: Heath opens RigWork, starts/joins the session, types the code
  into the device. The device joins as an input-plane participant. No Supabase keys
  or long-lived tokens live inside a .amxd that might get shared around.
  (Alternative considered and rejected: paste a service token into the device —
  leaks the moment a set file is shared.)
- **Device UI (keep it tiny, concise copy, no em-dashes):** code field, connect dot,
  last-sent section name, two toggles: "Send sections" (default on) and
  "Follow RigWork" (default off; the downstream jump).
- **Ships as:** `.amxd` + the node script dir. Repo home: `clockwork/ableton/` in the
  rig repo (it is RigWork's input-plane accessory; a separate repo is overkill at v1).

### Build phases

1. **Spike (1 short session, needs a machine with Live Suite + Max):** locator
   observation + crossing detection printing to the Max console. Risk to retire:
   locator-crossing granularity during playback (Live API observers can be laggy;
   fallback = poll `current_song_time` at ~30Hz inside node.script via the LOM,
   which is plenty for section boundaries).
2. **Publish leg:** node.script joins the Realtime channel by code, `daw:section` on
   crossing. RigWork side: name-match + activateSection (small delta in rig main.js,
   same seam as the existing bridge listener).
3. **Two-way leg:** subscribe `rig:section`, jump-when-stopped.
4. **Dogfood at a rehearsal** (feeds the DOGFOOD GATE): a real set with named
   locators, no PC clips programmed at all.

## Explicitly out of scope

- Clock/tempo over the network (MIDI chase owns it).
- Logic marker support (no API; revisit only if Apple ships one).
- The RigWork VST itself (wrapper #4; separate effort, host-clock + in-DAW UI).
- Auto-creating RigWork sections from locator names (tempting; decide after dogfood —
  it touches show-data ownership questions).
