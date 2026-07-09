# GP Live Runtime Topology

How the GP stack (RigWork + Riffwork + Ableton + iPad + bandmates) actually runs at showtime. Resolved with Heath 2026-07-08. This is the canonical picture; per-feature detail lives in the app repos and `SHOWFILE_SPEC.md`.

## Core principle: RigWork is the center of the star

RigWork is always the hub. It is the ONE thing that:
1. emits pedal/synth MIDI (the only node cabled to hardware), and
2. publishes session state to every other device over Supabase Realtime.

Ableton is either **upstream** (master, feeding Rig) or **downstream** (slave, chasing Rig) — never the center. The head/iPad experience is designed once and never changes across gig modes.

## Three planes (keep them separate)

```
        INPUT PLANE  (any of these advance a section / set tempo)
   Ableton PC clip · manual tap (Rig/iPad) · Riffwork bar-tag · Bandleader
                         \        |        /
                          v       v       v
        ENGINE PLANE  +--------------------------+
   the ONE cabled box |         RigWork          |--MIDI--> pedals / synths
   (gpb studio /      |  - section state machine |
    gpa home)         |  - clock: Internal(lead) |<--clock-- Ableton (big gig)
                      |    or External(chase)    |--clock--> Ableton (small gig, opt)
                      |  - emits pedal MIDI       |
                      +------------+-------------+
                                   | publishes state (Supabase Realtime)
                                   v
        HEAD PLANE   iPad · 2nd screen · bandmate laptop · other accounts
        (no MIDI, pure network — view OR edit — identical in every gig mode)
```

1. **Input plane** — anything that advances a section / sets tempo. All funnel into RigWork's single existing `activateSection()` event. Sources: incoming Ableton PC, manual tap (Rig or iPad), Riffwork bar-tag, Bandleader broadcast. Rig doesn't care which fired it, so supporting several sources per song is nearly free.
2. **Engine plane** — the one box cabled to the iConnect (gpb studio / gpa home). Emits hardware MIDI. Clock source switch: Internal (conduct, shipped) or External (chase incoming MIDI clock, build delta).
3. **Head plane** — iPad, second screen, bandmate laptop, other accounts. Pure network over Supabase Realtime (Bandleader / Live-Sync model, shipped). Never touches MIDI. Join by 4-char code, cross-account, ephemeral. Identical in every gig mode.

**Key point:** it is NOT all MIDI. MIDI is only engine-to-gear and engine-to-Ableton (same box). The multi-device layer is a separate network plane. The two never touch — that is why the iPad "just works" without being a MIDI device.

## Ableton master-flip (per gig)

- **Big gig — Ableton master:** Ableton owns clock + backing audio; RigWork chases external MIDI clock through the iConnect loopback (no Clockwork bridge needed — the bridge is only for Ableton Link / OSC / networked gear). Sections fire from Ableton PC clips and/or manual tap ("both, per song").
- **Small gig — RigWork master, DAW-less:** Rig conducts (clock + backing + sections); Ableton optional or absent. Already shipped.
- **Redundancy guard:** in Ableton-master mode Ableton plays the backing audio, so Rig must NOT also fire its own section backing tracks (doubled audio). The master-mode toggle gates Rig's local audio.

## iPad modes

- **Companion** (joined to an active session as a head): viewer / tap-first by default; toggle INTO editor.
- **Solo** (the iPad is the only thing running, i.e. it is the engine head): full editor by default.

## Build deltas (the only new work)

1. **External-clock chase** in RigWork — follow Ableton's incoming MIDI clock. Optional auto-detect: clock present -> chase, else conduct.
2. **Incoming-PC -> `activateSection()` binding** — Rig already recalls a preset on PC; also fire the section move.
3. **Master-mode toggle** (Internal / External) + gate Rig local audio in External mode.
4. **iPad companion-vs-solo default** — viewer + toggle-editor when joining; full editor when solo.

Everything else (heads / Supabase mirror, manual tap, conductor-out, backing tracks, Riffwork bar-tags) is already shipped.
