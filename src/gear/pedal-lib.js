// Unified pedal/gear library for @gp/gear.
// This is the canonical source — replaces gpdoom-tools/pedals.js (window.GP_PEDALS)
// and rig/src/pedals.js (PEDAL_LIB). Tools version is the superset (has jack layout).
// Dims in inches. Jack sides: top/bottom/left/right.
// Optional inJAt/outJAt/pwrJAt (0.0–1.0): precise jack position along the side.
//   left/right sides: 0=top edge (back of board), 1=bottom edge (front of board).
//   top/bottom sides: 0=left, 1=right.
//   When absent, tools use a geometry heuristic: portrait (d>w×1.1) → 0.15, landscape → 0.5.
//   Add measured values when you have the physical pedal in hand.
// hasFxLoop: true → pedal has an effects send/return loop.
// Optional sendJ/returnJ (side) + sendJAt/returnJAt (0.0–1.0): physical positions of FX loop jacks.
//   When sendJ/returnJ absent, tools default to outJ/inJ side respectively.
//   When sendJAt/returnJAt absent, tools use 0.65 (toward front of board) as placeholder.
// Community-grown via the suggest-gear form. Specs approximate — verify your own.

export const pedalLib = {
  // ── Common pedals ──
  "Boss DS-1 Distortion":      { v:9, ma:8,   w:2.9,  d:5.1,  cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Ibanez TS9 Tube Screamer":  { v:9, ma:8,   w:3.0,  d:4.9,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Big Muff Pi":           { v:9, ma:5,   w:5.75, d:4.75, cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Wampler Tumnus":            { v:9, ma:6,   w:3.7,  d:1.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Carbon Copy":           { v:9, ma:26,  w:2.5,  d:4.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR / Dunlop (standard)":   { v:9, ma:10,  w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Polytune 3":             { v:9, ma:45,  w:2.85, d:4.8,  cat:"Tuner",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss DD-8 Delay":           { v:9, ma:55,  w:2.9,  d:5.1,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss DM-2W":                { v:9, ma:30,  w:2.9,  d:5.1,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Walrus Audio Slö Reverb":   { v:9, ma:100, w:4.6,  d:2.7,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EHX POG2":                  { v:9, ma:100, w:5.75, d:4.75, cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Chase Bliss (typical)":     { v:9, ma:100, w:4.5,  d:2.6,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Boss RC-5 Looper":          { v:9, ma:170, w:2.9,  d:5.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Digitech Whammy V":         { v:9, ma:200, w:5.0,  d:5.5,  cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top" },
  "Strymon El Capistan":       { v:9, ma:250, w:4.0,  d:4.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Strymon BigSky":            { v:9, ma:300, w:6.75, d:5.1,  cat:"Reverb",        inJ:"left",  outJ:"right",pwrJ:"top", inJAt:0.20, outJAt:0.20 },
  "Strymon Mobius":            { v:9, ma:300, w:6.75, d:5.1,  cat:"Modulation",    inJ:"left",  outJ:"right",pwrJ:"top", inJAt:0.20, outJAt:0.20 },
  "Strymon Timeline":          { v:9, ma:300, w:6.75, d:5.1,  cat:"Delay",         inJ:"left",  outJ:"right",pwrJ:"top", inJAt:0.20, outJAt:0.20, hasFxLoop:true, returnJ:"top", returnJAt:0.70, sendJ:"top", sendJAt:0.78 },
  "Eventide H9":               { v:9, ma:400, w:4.9,  d:4.6,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Line 6 HX Stomp":          { v:9, ma:500, w:4.7,  d:3.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"left", sendJAt:0.55, returnJ:"left", returnJAt:0.70 },
  "Dunlop Cry Baby Wah":       { v:9, ma:5,   w:4.0,  d:10.0, cat:"Wah / Filter",  inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Meris ──
  "Meris Mercury 7":           { v:9, ma:165, w:4.55, d:2.85, cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Meris Hedra":               { v:9, ma:165, w:4.55, d:2.85, cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "Meris Otto Bit Jr":         { v:9, ma:165, w:4.55, d:2.85, cat:"Modulation",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Meris LVX":                 { v:9, ma:165, w:4.55, d:2.85, cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "Meris Enzo":                { v:9, ma:165, w:4.55, d:2.85, cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },
  "Meris Polymoon":            { v:9, ma:165, w:4.55, d:2.85, cat:"Modulation",     inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Boss 200 series + essentials ──
  "Boss OD-200":               { v:9, ma:200, w:2.9,  d:5.1,  cat:"Overdrive",      inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss DD-200":               { v:9, ma:200, w:2.9,  d:5.1,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss MD-200":               { v:9, ma:200, w:2.9,  d:5.1,  cat:"Modulation",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss RV-200":               { v:9, ma:200, w:2.9,  d:5.1,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss TU-3":                 { v:9, ma:85,  w:2.9,  d:5.1,  cat:"Tuner",          inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss CE-2W":                { v:9, ma:55,  w:2.9,  d:5.1,  cat:"Modulation",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss PS-6 Harmonist":       { v:9, ma:55,  w:2.9,  d:5.1,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss MS-3":                 { v:9, ma:500, w:4.2,  d:5.5,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, returnJ:"top", returnJAt:0.55, sendJ:"top", sendJAt:0.45 },

  // ── EarthQuaker Devices ──
  "EQD Zoar":                  { v:9, ma:35,  w:4.7,  d:2.6,  cat:"Distortion",     inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EQD Afterneath V3":         { v:9, ma:30,  w:4.7,  d:2.6,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EQD Avalanche Run V2":      { v:9, ma:130, w:4.7,  d:2.6,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EQD Astral Destiny":        { v:9, ma:150, w:4.7,  d:2.6,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EQD Data Corrupter":        { v:9, ma:100, w:4.7,  d:2.6,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EQD Plumes":                { v:9, ma:2,   w:3.7,  d:1.5,  cat:"Overdrive",      inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Hoof Reaper":           { v:9, ma:8,   w:4.7,  d:2.6,  cat:"Fuzz",           inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EQD Dispatch Master":       { v:9, ma:25,  w:4.7,  d:2.6,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Electro-Harmonix ──
  "EHX Silencer":              { v:9, ma:75,  w:2.75, d:3.6,  cat:"Noise Gate",     inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"right", sendJAt:0.60, returnJ:"left", returnJAt:0.60 },
  "EHX Pitchfork":             { v:9, ma:175, w:2.75, d:4.5,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX FreqOut":               { v:9, ma:107, w:2.75, d:4.5,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Oceans 11":             { v:9, ma:100, w:4.75, d:3.75, cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EHX Canyon":                { v:9, ma:100, w:2.75, d:4.5,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Nano POG":              { v:9, ma:55,  w:2.75, d:4.5,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Super Ego+":            { v:9, ma:100, w:4.75, d:3.75, cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "EHX Crayon":                { v:9, ma:26,  w:2.75, d:3.6,  cat:"Overdrive",      inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX MEL9":                  { v:9, ma:100, w:4.5,  d:3.4,  cat:"Synthesis",      inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── TC Electronic ──
  "TC Flashback 4":            { v:9, ma:160, w:2.85, d:4.8,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Flashback X4":           { v:9, ma:160, w:2.85, d:4.8,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Hall of Fame 2":         { v:9, ma:100, w:2.85, d:4.8,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Sentry Noise Gate":      { v:9, ma:30,  w:2.75, d:3.5,  cat:"Noise Gate",     inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Sub'n'Up":               { v:9, ma:100, w:2.75, d:3.5,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Ditto+ Looper":          { v:9, ma:65,  w:2.75, d:3.5,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Ditto X2":               { v:9, ma:100, w:4.57, d:2.75, cat:"Looper",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Alexander Pedals ──
  "Alexander Pedals Wavelength":    { v:9, ma:200, w:4.65, d:2.6,  cat:"Reverb",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Alexander Pedals Jubilee":       { v:9, ma:75,  w:4.65, d:2.6,  cat:"Overdrive", inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Alexander Pedals Syntax Error":  { v:9, ma:150, w:4.65, d:2.6,  cat:"Other",     inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Fowl Sounds ──
  "Fowl Sounds Lifer":         { v:9, ma:100, w:5.5,  d:2.6,  cat:"Fuzz",           inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40, hasFxLoop:true, sendJ:"right", sendJAt:0.65, returnJ:"left", returnJAt:0.65 },

  // ── Blackhawk Amplifiers — Portland doom/sludge builder ──
  // Dims: 1590B single / 1590BB dual enclosures (standard). mA estimated by circuit type (9V neg-tip). Verify your own.
  "Blackhawk Balrog (Dist)":       { v:9, ma:18,  w:2.6,  d:4.4,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Nazgul (Dist/Fuzz)":  { v:9, ma:20,  w:4.7,  d:3.7,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Blackhawk Basilisk (Fuzz)":     { v:9, ma:10,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Valhalla (Fuzz)":     { v:9, ma:10,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Valkyrie (Drive)":    { v:9, ma:15,  w:2.6,  d:4.4,  cat:"Overdrive",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Heimdall (OD/Bass)":  { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Overdrive",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Asgard (Bass Fuzz)":  { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Mithrandir (Oct Fz)": { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Gandalf (Oct Fuzz)":  { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Fellbeast (Fuzz)":    { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Svarog (Ge Fuzz)":    { v:9, ma:6,   w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Uruk-Hai (Dist/Fz)":  { v:9, ma:15,  w:2.6,  d:4.4,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Morgul Boost":        { v:9, ma:8,   w:2.6,  d:4.4,  cat:"Overdrive",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Odin (Preamp/Drv)":   { v:9, ma:18,  w:2.6,  d:4.4,  cat:"Overdrive",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Valknut (Wah/OD)":    { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Wah / Filter", inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Fuzzrocious ── (Portland doom/experimental builder; 1590BB-format enclosures; low-current silicon)
  "Fuzzrocious Bongripper":        { v:9, ma:10,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Fuzzrocious 420":               { v:9, ma:10,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Fuzzrocious Rat Tail":          { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },
  "Fuzzrocious Demon King":        { v:9, ma:10,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Black Arts Toneworks ──
  "Black Arts Quantum Mystic":     { v:9, ma:20,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Black Arts Pharaoh":            { v:9, ma:20,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Black Arts Ritual":             { v:9, ma:10,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Stone Deaf FX ──
  "Stone Deaf Trashy Blonde":      { v:9, ma:20,  w:4.72, d:2.38, cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Stone Deaf PDF-1x":             { v:9, ma:20,  w:4.72, d:2.38, cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── JHS Pedals ──
  "JHS Legends Fuzz":              { v:9, ma:20,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "JHS Muffuletta":                { v:9, ma:30,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "JHS Angry Charlie":             { v:9, ma:30,  w:2.6,  d:4.4,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Aguilar ──
  "Aguilar Octamizer":             { v:9, ma:15,  w:4.45, d:2.35, cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Aguilar TLC Compressor":        { v:9, ma:45,  w:4.45, d:2.35, cat:"Compressor",   inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Saturnworks ──
  "Saturnworks Looper":            { v:9, ma:30,  w:3.68, d:1.46, cat:"Looper",        inJ:"right", outJ:"left", pwrJ:"top" },
  "Saturnworks Micro Switch":      { v:9, ma:15,  w:2.5,  d:1.5,  cat:"Utility",       inJ:"right", outJ:"left", pwrJ:"top" },

  // ── MXR / Dunlop pedals ──
  "MXR Phase 90":                  { v:9, ma:3,   w:2.5,  d:4.5,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Phase 100":                 { v:9, ma:5,   w:2.5,  d:4.5,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Dyna Comp":                 { v:9, ma:3,   w:2.5,  d:4.5,  cat:"Compressor",    inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR EVH 5150 Overdrive":        { v:9, ma:50,  w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Bass Octave Deluxe":        { v:9, ma:18,  w:2.5,  d:4.5,  cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Micro Amp":                 { v:9, ma:2,   w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Zakk Wylde OD":            { v:9, ma:25,  w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Smart Gate":                { v:9, ma:25,  w:2.5,  d:4.5,  cat:"Noise Gate",    inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR 10-Band EQ":                { v:9, ma:5,   w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Reverb":                    { v:9, ma:100, w:4.5,  d:2.5,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Keeley ──
  "Keeley Compressor Plus":        { v:9, ma:50,  w:2.35, d:4.37, cat:"Compressor",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Keeley D&M Drive":              { v:9, ma:100, w:4.7,  d:3.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Keeley Filaments":              { v:9, ma:40,  w:2.35, d:4.37, cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Keeley Luna Reverb":            { v:9, ma:100, w:4.7,  d:3.5,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Keeley Halo Delay":             { v:9, ma:150, w:4.7,  d:3.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Keeley Hydra":                  { v:9, ma:150, w:4.7,  d:3.5,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Way Huge ──
  "Way Huge Swollen Pickle":       { v:9, ma:10,  w:4.5,  d:2.5,  cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Way Huge Pork Loin":            { v:9, ma:7,   w:2.4,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Way Huge Aqua-Puss":            { v:9, ma:35,  w:2.4,  d:4.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Way Huge Green Rhino":          { v:9, ma:8,   w:2.4,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Way Huge Purple Platypus":      { v:9, ma:20,  w:4.5,  d:2.5,  cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Walrus Audio ──
  "Walrus Audio ACS1":             { v:9, ma:170, w:4.75, d:3.0,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Audio Julia":            { v:9, ma:100, w:4.75, d:2.9,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Audio Ages":             { v:9, ma:60,  w:4.75, d:2.9,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Audio Kangra":           { v:9, ma:130, w:4.75, d:2.9,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Audio Fathom":           { v:9, ma:100, w:4.75, d:2.9,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Audio Eddy":             { v:9, ma:100, w:4.75, d:2.9,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Audio EB-10":            { v:9, ma:100, w:4.75, d:3.0,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Empress Effects ──
  "Empress Reverb":                { v:9, ma:250, w:4.8,  d:3.65, cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Empress Compressor MKII":       { v:9, ma:170, w:4.3,  d:2.8,  cat:"Compressor",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Empress ParaEQ MKII":           { v:9, ma:80,  w:4.3,  d:2.8,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Empress Echosystem":            { v:9, ma:250, w:4.8,  d:3.65, cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Fulltone ──
  "Fulltone OCD":                  { v:9, ma:3,   w:2.36, d:4.4,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Fulltone Full-Drive 2":         { v:9, ma:3,   w:2.36, d:4.4,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Boss compact classics ──
  "Boss SD-1 Super Overdrive":     { v:9, ma:8,   w:2.9,  d:5.1,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss BD-2 Blues Driver":        { v:9, ma:8,   w:2.9,  d:5.1,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss MT-2 Metal Zone":          { v:9, ma:8,   w:2.9,  d:5.1,  cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss BF-3 Flanger":             { v:9, ma:8,   w:2.9,  d:5.1,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss NS-2 Noise Suppressor":    { v:9, ma:7,   w:2.9,  d:5.1,  cat:"Noise Gate",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss GE-7 EQ":                  { v:9, ma:16,  w:2.9,  d:5.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss CS-3 Compression":         { v:9, ma:9,   w:2.9,  d:5.1,  cat:"Compressor",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss OC-5 Octave":              { v:9, ma:30,  w:2.9,  d:5.1,  cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss TR-2 Tremolo":             { v:9, ma:6,   w:2.9,  d:5.1,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss PH-3 Phase Shifter":       { v:9, ma:12,  w:2.9,  d:5.1,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss LS-2 Line Selector":       { v:9, ma:5,   w:2.9,  d:5.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss RE-20 Space Echo":         { v:9, ma:120, w:5.5,  d:5.0,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Ibanez ──
  "Ibanez TS808":                  { v:9, ma:8,   w:2.87, d:5.11, cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Ibanez TS Mini":                { v:9, ma:6,   w:2.0,  d:3.2,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Ibanez PD-7 Phat Hed":          { v:9, ma:10,  w:2.87, d:5.11, cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Chase Bliss Audio ──
  "CBA Blooper":                   { v:9, ma:200, w:4.5,  d:2.6,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "CBA Mood":                      { v:9, ma:200, w:4.5,  d:2.6,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "CBA Dark World":                { v:9, ma:200, w:4.5,  d:2.6,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "CBA Brothers":                  { v:9, ma:200, w:4.5,  d:2.6,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "CBA Thermae":                   { v:9, ma:200, w:4.5,  d:2.6,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "CBA Automatone Preamp MKII":    { v:9, ma:300, w:4.5,  d:2.6,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Source Audio ──
  "Source Audio Collider":         { v:9, ma:250, w:4.5,  d:3.0,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Source Audio EQ2":              { v:9, ma:100, w:3.5,  d:2.6,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Wampler ──
  "Wampler Plexi-Drive":           { v:9, ma:30,  w:2.25, d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Wampler Pinnacle":              { v:9, ma:25,  w:2.25, d:4.5,  cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Wampler Latitude Tremolo":      { v:9, ma:70,  w:4.4,  d:2.35, cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Wampler Terraform":             { v:9, ma:200, w:4.4,  d:2.35, cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Wampler Faux Spring Reverb":    { v:9, ma:50,  w:4.4,  d:2.35, cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Xotic ──
  "Xotic EP Booster":              { v:9, ma:5,   w:1.8,  d:3.7,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Xotic RC Booster":              { v:9, ma:5,   w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Xotic BB Preamp":               { v:9, ma:8,   w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Xotic SL Drive":                { v:9, ma:10,  w:2.5,  d:4.5,  cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Voodoo Lab ──
  "Voodoo Lab Sparkle Drive Mod":  { v:9, ma:6,   w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Voodoo Lab Giggity":            { v:9, ma:36,  w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "Voodoo Lab Proctavia":          { v:9, ma:3,   w:2.5,  d:4.5,  cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Digitech ──
  "Digitech Drop":                 { v:9, ma:135, w:3.1,  d:5.4,  cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top" },
  "Digitech FreqOut":              { v:9, ma:180, w:2.5,  d:4.5,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Caroline Guitar Company ──
  "Caroline Meteore":              { v:9, ma:100, w:4.7,  d:2.6,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Caroline Kilobyte":             { v:9, ma:70,  w:4.7,  d:2.6,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Caroline Wave Cannon":          { v:9, ma:20,  w:4.7,  d:2.6,  cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Old Blood Noise Endeavors ──
  "OBNE Rever":                    { v:9, ma:100, w:4.7,  d:2.6,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "OBNE Excess":                   { v:9, ma:100, w:4.7,  d:2.6,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "OBNE Procession":               { v:9, ma:100, w:4.7,  d:2.6,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "OBNE Dweller":                  { v:9, ma:100, w:4.7,  d:2.6,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Pigtronix ──
  "Pigtronix Infinity Looper":     { v:9, ma:300, w:6.5,  d:3.7,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Pigtronix Space Raver":         { v:9, ma:100, w:4.7,  d:2.6,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Catalinbread ──
  "Catalinbread Belle Epoch":      { v:9, ma:100, w:4.7,  d:2.6,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Catalinbread Echorec":          { v:9, ma:130, w:4.7,  d:2.6,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Catalinbread Montavillian":     { v:9, ma:100, w:4.7,  d:2.6,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Catalinbread Dreamcoat":        { v:9, ma:30,  w:4.7,  d:2.6,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Death By Audio ──
  "Death By Audio Apocalypse":     { v:9, ma:15,  w:4.7,  d:2.6,  cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Death By Audio Echo Dream":     { v:9, ma:100, w:4.7,  d:2.6,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Death By Audio Supersonic Fuzz": { v:9, ma:15, w:4.7,  d:2.6,  cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Behringer (pedals) ──
  "Behringer SF300":               { v:9, ma:20,  w:2.76, d:4.57, cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Laney ──
  "Laney Ironheart IRT-Pulse":     { v:9, ma:500, w:4.7,  d:2.6,  cat:"Preamp",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── HeadRush (amp modeler / multi-FX floor units; 12V proprietary supply; all support 4CM FX loop) ──
  "HeadRush Pedalboard":           { v:12, ma:2000, w:21.9, d:11.7, cat:"Multi-FX", inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"top", sendJAt:0.65, returnJ:"top", returnJAt:0.75 },
  "HeadRush MX5":                  { v:12, ma:1500, w:18.5, d:9.2,  cat:"Multi-FX", inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"top", sendJAt:0.65, returnJ:"top", returnJAt:0.75 },
  "HeadRush Gigboard":             { v:12, ma:1000, w:14.2, d:8.0,  cat:"Multi-FX", inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"top", sendJAt:0.65, returnJ:"top", returnJAt:0.75 },
  "HeadRush Prime":                { v:12, ma:2000, w:24.0, d:11.5, cat:"Multi-FX", inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"top", sendJAt:0.65, returnJ:"top", returnJAt:0.75 },

  // ── Synthesizers ──
  "Sequential Prophet Rev2":        { v:12, ma:1000, cat:"Synthesizer" },
  "Sequential OB-6":                { v:12, ma:1000, cat:"Synthesizer" },
  "Sequential Prophet-6":           { v:15, ma:1000, cat:"Synthesizer" },
  "Sequential Take 5":              { v:12, ma:500,  cat:"Synthesizer" },
  "Moog Subsequent 37":             { v:12, ma:1500, cat:"Synthesizer" },
  "Moog Sub 37":                    { v:12, ma:1500, cat:"Synthesizer" },
  "Moog Matriarch":                 { v:12, ma:1000, cat:"Synthesizer" },
  "Moog Sub Phatty":                { v:12, ma:500,  cat:"Synthesizer" },
  "Moog Minimoog Voyager":          { v:12, ma:1000, cat:"Synthesizer" },
  "Korg MicroKorg":                 { v:4,  ma:400,  cat:"Synthesizer" },
  "Korg MS-20 Mini":               { v:1,  ma:500,  cat:"Synthesizer" },
  "Korg Monologue":                 { v:1,  ma:300,  cat:"Synthesizer" },
  "Korg Minilogue XD":              { v:9,  ma:800,  cat:"Synthesizer" },
  "Korg Minilogue":                 { v:9,  ma:500,  cat:"Synthesizer" },
  "Korg Prologue":                  { v:12, ma:1500, cat:"Synthesizer" },
  "Korg Wavestate":                 { v:12, ma:500,  cat:"Synthesizer" },
  "Korg Opsix":                     { v:12, ma:500,  cat:"Synthesizer" },
  "Elektron Analog Four MKII":      { v:12, ma:2000, cat:"Synthesizer" },
  "Elektron Digitone":              { v:12, ma:2000, cat:"Synthesizer" },
  "Arturia MiniFreak":              { v:12, ma:1300, cat:"Synthesizer" },
  "Arturia PolyBrute":              { v:12, ma:2000, cat:"Synthesizer" },
  "Arturia MicroFreak":             { v:9,  ma:500,  cat:"Synthesizer" },
  "Roland JU-06A":                  { v:9,  ma:500,  cat:"Synthesizer" },
  "Roland System-8":                { v:9,  ma:900,  cat:"Synthesizer" },
  "Roland JD-XA":                   { v:12, ma:1500, cat:"Synthesizer" },
  "Nord Lead A1":                   { v:12, ma:1500, cat:"Synthesizer" },
  "Nord Stage 3":                   { v:12, ma:2000, cat:"Synthesizer" },

  // ── Drum machines / groove boxes ──
  "Roland TR-8S":                   { v:9,  ma:1000, cat:"Drum machine" },
  "Roland TR-06":                   { v:9,  ma:200,  cat:"Drum machine" },
  "Elektron Digitakt":              { v:12, ma:2000, cat:"Drum machine" },
  "Elektron Analog Rytm MKII":      { v:12, ma:2000, cat:"Drum machine" },
  "Teenage Engineering OP-1 Field": { v:5,  ma:1000, cat:"Drum machine" },

  // ── Outboard (rack: AC-powered; ma=0 = not tracked for pedalboard budget) ──
  "Neve 1073":                      { v:0, ma:0, cat:"Outboard" },
  "Neve 1073SPX":                   { v:0, ma:0, cat:"Outboard" },
  "Neve 1073DPX":                   { v:0, ma:0, cat:"Outboard" },
  "API 512c":                       { v:0, ma:0, cat:"Outboard" },
  "API 550A EQ":                    { v:0, ma:0, cat:"Outboard" },
  "API 2500":                       { v:0, ma:0, cat:"Outboard" },
  "SSL G-Bus Compressor":           { v:0, ma:0, cat:"Outboard" },
  "SSL XLogic G-Comp":              { v:0, ma:0, cat:"Outboard" },
  "dbx 160A":                       { v:0, ma:0, cat:"Outboard" },
  "dbx 160XT":                      { v:0, ma:0, cat:"Outboard" },
  "Universal Audio 1176LN":         { v:0, ma:0, cat:"Outboard" },
  "Universal Audio LA-2A":          { v:0, ma:0, cat:"Outboard" },
  "Empirical Labs EL8 Distressor":  { v:0, ma:0, cat:"Outboard" },
  "Rupert Neve Designs 5042":       { v:0, ma:0, cat:"Outboard" },
  "Rupert Neve Designs 5043":       { v:0, ma:0, cat:"Outboard" },
  "Manley VOXBOX":                  { v:0, ma:0, cat:"Outboard" },
  "Chandler Limited TG1":           { v:0, ma:0, cat:"Outboard" },
  "Focusrite ISA 428 MkII":         { v:0, ma:0, cat:"Outboard" },

  // ── DI boxes ──
  "Radial J48":                     { v:0, ma:0, cat:"DI box" },
  "Radial ProDI":                   { v:0, ma:0, cat:"DI box" },
  "Radial JDI":                     { v:0, ma:0, cat:"DI box" },
  "Rupert Neve RNDI":               { v:0, ma:0, cat:"DI box" },
  "Countryman Type 85":             { v:0, ma:0, cat:"DI box" },
  "Whirlwind IMP 2":                { v:0, ma:0, cat:"DI box" },
  "BSS AR-133":                     { v:0, ma:0, cat:"DI box" },
  "Behringer Ultra-DI Pro DI800":   { v:0, ma:0, cat:"DI box" },

  // ── Audio interfaces / converters (AC or bus powered; no pedal dims) ──
  "RME Babyface Pro":               { v:5,  ma:900,  cat:"Audio interface" },
  "RME Babyface":                   { v:5,  ma:900,  cat:"Audio interface" },
  "RME Hammerfall DSP Digiface":    { v:0,  ma:0,    cat:"Audio interface" },
  "TASCAM US-20x20":                { v:0,  ma:0,    cat:"Audio interface" },
  "MOTU 2408 mkI":                  { v:0,  ma:0,    cat:"Audio interface" },
  "Behringer ADA8200":              { v:12, ma:250,  cat:"Audio interface" },

  // ── Amps / cabs (AC-powered; dims intentionally omitted — use kind defaults in layout) ──
  "Orange CR120H":                  { v:0, ma:0, cat:"Amp" },
  "Orange Crush Mini":              { v:0, ma:0, cat:"Amp" },
  "Sunn Beta Lead":                 { v:0, ma:0, cat:"Amp" },
  "Laney Ironheart IRT120H":        { v:0, ma:0, cat:"Amp" },
  "Darkglass Element":              { v:0, ma:0, cat:"Amp" },
  "Positive Grid Spark 40":         { v:0, ma:0, cat:"Amp" },
  "Roland SR-70":                   { v:0, ma:0, cat:"Amp" },
  "Peavey XR mixer-amp":            { v:0, ma:0, cat:"Amp" },
  "Darkglass Microtubes 900":       { v:0, ma:0, cat:"Amp" },
  "SWR Henry 8x8":                  { v:0, ma:0, cat:"Cab" },
  "Randall R412JT":                 { v:0, ma:0, cat:"Cab" },
  "Acoustic G412A":                 { v:0, ma:0, cat:"Cab" },
  "Ampeg V412":                     { v:0, ma:0, cat:"Cab" },

  // ── Strymon (missing entries — match device-defs labels exactly) ──
  "Strymon Iridium":               { v:9, ma:250, w:4.0,  d:4.5,  cat:"Amp sim",       inJ:"right", outJ:"left", pwrJ:"top" },
  "Strymon Volante":               { v:9, ma:300, w:6.75, d:5.1,  cat:"Delay",         inJ:"left",  outJ:"right",pwrJ:"top", inJAt:0.20, outJAt:0.20 },
  "Strymon NightSky":              { v:9, ma:250, w:4.5,  d:3.5,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Eventide Factor series + Space ──
  "Eventide Space":                { v:9, ma:400, w:4.5,  d:3.75, cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Eventide TimeFactor":           { v:9, ma:400, w:4.5,  d:3.75, cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Eventide ModFactor":            { v:9, ma:400, w:4.5,  d:3.75, cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Eventide PitchFactor":          { v:9, ma:400, w:4.5,  d:3.75, cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Boss 200/500-series + GT (missing entries) ──
  "Boss IR-200":                   { v:9, ma:200, w:2.9,  d:5.1,  cat:"Amp sim",       inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss SY-200":                   { v:9, ma:70,  w:2.9,  d:5.1,  cat:"Synth",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss EQ-200":                   { v:9, ma:165, w:5.87, d:5.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss DD-500":                   { v:9, ma:500, w:7.25, d:5.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"top", sendJAt:0.60, returnJ:"top", returnJAt:0.70 },
  "Boss RV-500":                   { v:9, ma:500, w:7.25, d:5.5,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss MD-500":                   { v:9, ma:500, w:7.25, d:5.5,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss RC-500":                   { v:9, ma:600, w:5.87, d:5.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss GT-1000":                  { v:9, ma:2000,w:14.6, d:8.9,  cat:"Multi-FX",      inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"top", sendJAt:0.60, returnJ:"top", returnJAt:0.70 },

  // ── Chase Bliss Audio — full names matching device-defs (CBA aliases kept for back-compat) ──
  "Chase Bliss Thermae":           { v:9, ma:200, w:4.5,  d:2.6,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Chase Bliss MOOD MKII":         { v:9, ma:200, w:4.5,  d:2.6,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Chase Bliss Blooper":           { v:9, ma:200, w:4.5,  d:2.6,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Chase Bliss Dark World":        { v:9, ma:200, w:4.5,  d:2.6,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Walrus Audio — ACS1 + Mako series ──
  "Walrus ACS1":                   { v:9, ma:170, w:4.75, d:3.0,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Mako M1":                { v:9, ma:250, w:5.5,  d:4.5,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Mako D1":                { v:9, ma:250, w:5.5,  d:4.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Walrus Mako R1":                { v:9, ma:250, w:5.5,  d:4.5,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Source Audio ──
  "Source Audio Nemesis":          { v:9, ma:200, w:4.5,  d:3.0,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Source Audio C4 Synth":         { v:9, ma:150, w:3.7,  d:1.5,  cat:"Synth",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Source Audio Ventris":          { v:9, ma:200, w:4.5,  d:3.0,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Hologram Electronics ──
  "Hologram Microcosm":            { v:9, ma:300, w:5.5,  d:4.5,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Empress Effects ──
  "Empress ZOIA":                  { v:9, ma:500, w:4.65, d:3.5,  cat:"Multi-FX",      inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── Meris X-series ──
  "Meris Mercury X":               { v:9, ma:165, w:4.55, d:2.85, cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top" },
  "Meris Enzo X":                  { v:9, ma:165, w:4.55, d:2.85, cat:"Synth",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Meris Ottobit X":               { v:9, ma:165, w:4.55, d:2.85, cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Darkglass ──
  "Darkglass Anagram":             { v:9, ma:300, w:5.5,  d:4.5,  cat:"Multi-FX",      inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Darkglass Alpha Omega 900":     { v:0, ma:0, cat:"Amp" },

  // ── Alexander Pedals (full label match for device-defs template) ──
  "Alexander Wavelength":          { v:9, ma:200, w:4.65, d:2.6,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },

  // ── TC Electronic (full names matching device-defs) ──
  "TC Electronic Flashback X4":    { v:9, ma:160, w:7.4,  d:5.4,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Electronic Hall of Fame 2":  { v:9, ma:100, w:2.85, d:4.8,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Multi-FX floor units ──
  "Neural DSP Quad Cortex":        { v:12, ma:2000, w:12.25, d:8.8, cat:"Multi-FX",    inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true, sendJ:"top", sendJAt:0.60, returnJ:"top", returnJAt:0.70 },
  "Neural DSP Nano Cortex":        { v:9,  ma:500,  w:5.4,  d:4.5, cat:"Amp sim",      inJ:"right", outJ:"left", pwrJ:"top", inJAt:0.40, outJAt:0.40 },
  "Fractal Axe-Fx III":            { v:0,  ma:0,   w:19.0, d:14.25, cat:"Amp sim",      inJ:"top", outJ:"top", pwrJ:"top", hasFxLoop:true },
  "Fractal FM9":                   { v:0,  ma:0,   w:18.0, d:8.5, cat:"Amp sim",       inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true },
  "Line 6 Helix Floor":            { v:0,  ma:0,   w:22.3, d:10.3, cat:"Multi-FX",     inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true },
  "Line 6 M9":                     { v:9,  ma:500,  w:7.0,  d:4.75, cat:"Multi-FX",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Kemper Profiler Stage":         { v:0,  ma:0,   w:13.4, d:8.9, cat:"Amp sim",       inJ:"right", outJ:"left", pwrJ:"top", hasFxLoop:true },

  // ── Software / plugins (no physical dims) ──
  "Neural DSP plugin (Archetype/standalone)": { v:0, ma:0, cat:"Amp sim", sw:true },
  "EastWest Opus / Play":          { v:0, ma:0, cat:"Amp sim", sw:true },
};
