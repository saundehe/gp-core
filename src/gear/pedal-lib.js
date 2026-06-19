// Unified pedal/gear library for @gp/gear.
// This is the canonical source — replaces gpdoom-tools/pedals.js (window.GP_PEDALS)
// and rig/src/pedals.js (PEDAL_LIB). Tools version is the superset (has jack layout).
// Dims in inches. Jack sides: top/bottom/left/right.
// Community-grown via the suggest-gear form. Specs approximate — verify your own.

export const pedalLib = {
  // ── Common pedals ──
  "Boss DS-1 Distortion":      { v:9, ma:8,   w:2.9,  d:5.1,  cat:"Distortion",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Ibanez TS9 Tube Screamer":  { v:9, ma:8,   w:3.0,  d:4.9,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Big Muff Pi":           { v:9, ma:5,   w:5.75, d:4.75, cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top" },
  "Wampler Tumnus":            { v:9, ma:6,   w:3.7,  d:1.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR Carbon Copy":           { v:9, ma:26,  w:2.5,  d:4.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "MXR / Dunlop (standard)":   { v:9, ma:10,  w:2.5,  d:4.5,  cat:"Overdrive",     inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Polytune 3":             { v:9, ma:45,  w:2.85, d:4.8,  cat:"Tuner",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss DD-8 Delay":           { v:9, ma:55,  w:2.9,  d:5.1,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss DM-2W":                { v:9, ma:30,  w:2.9,  d:5.1,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Walrus Audio Slö Reverb":   { v:9, ma:100, w:4.6,  d:2.7,  cat:"Reverb",        inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX POG2":                  { v:9, ma:100, w:5.75, d:4.75, cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top" },
  "Chase Bliss (typical)":     { v:9, ma:100, w:4.5,  d:2.6,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Boss RC-5 Looper":          { v:9, ma:170, w:2.9,  d:5.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Digitech Whammy V":         { v:9, ma:200, w:5.0,  d:5.5,  cat:"Pitch / Octave",inJ:"right", outJ:"left", pwrJ:"top" },
  "Strymon El Capistan":       { v:9, ma:250, w:4.0,  d:4.5,  cat:"Delay",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Strymon BigSky":            { v:9, ma:300, w:6.75, d:5.1,  cat:"Reverb",        inJ:"left",  outJ:"right",pwrJ:"top" },
  "Strymon Timeline":          { v:9, ma:300, w:6.75, d:5.1,  cat:"Delay",         inJ:"left",  outJ:"right",pwrJ:"top" },
  "Eventide H9":               { v:9, ma:400, w:4.9,  d:4.6,  cat:"Modulation",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Line 6 HX Stomp":          { v:9, ma:500, w:4.7,  d:3.1,  cat:"Other",         inJ:"right", outJ:"left", pwrJ:"top" },
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
  "Boss MS-3":                 { v:9, ma:500, w:4.2,  d:5.5,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },

  // ── EarthQuaker Devices ──
  "EQD Zoar":                  { v:9, ma:35,  w:4.7,  d:2.6,  cat:"Distortion",     inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Afterneath V3":         { v:9, ma:30,  w:4.7,  d:2.6,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Avalanche Run V2":      { v:9, ma:130, w:4.7,  d:2.6,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Astral Destiny":        { v:9, ma:150, w:4.7,  d:2.6,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Data Corrupter":        { v:9, ma:100, w:4.7,  d:2.6,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Plumes":                { v:9, ma:2,   w:3.7,  d:1.5,  cat:"Overdrive",      inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Hoof Reaper":           { v:9, ma:8,   w:4.7,  d:2.6,  cat:"Fuzz",           inJ:"right", outJ:"left", pwrJ:"top" },
  "EQD Dispatch Master":       { v:9, ma:25,  w:4.7,  d:2.6,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Electro-Harmonix ──
  "EHX Silencer":              { v:9, ma:75,  w:2.75, d:3.6,  cat:"Noise Gate",     inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Pitchfork":             { v:9, ma:175, w:2.75, d:4.5,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX FreqOut":               { v:9, ma:107, w:2.75, d:4.5,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Oceans 11":             { v:9, ma:100, w:4.75, d:3.75, cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Canyon":                { v:9, ma:100, w:2.75, d:4.5,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Nano POG":              { v:9, ma:55,  w:2.75, d:4.5,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Super Ego+":            { v:9, ma:100, w:4.75, d:3.75, cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },
  "EHX Crayon":                { v:9, ma:26,  w:2.75, d:3.6,  cat:"Overdrive",      inJ:"right", outJ:"left", pwrJ:"top" },

  // ── TC Electronic ──
  "TC Flashback 4":            { v:9, ma:160, w:2.85, d:4.8,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Hall of Fame 2":         { v:9, ma:100, w:2.85, d:4.8,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Sentry Noise Gate":      { v:9, ma:30,  w:2.75, d:3.5,  cat:"Noise Gate",     inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Sub'n'Up":               { v:9, ma:100, w:2.75, d:3.5,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Ditto+ Looper":          { v:9, ma:65,  w:2.75, d:3.5,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Alexander Pedals ──
  "Alexander Pedals Wavelength":    { v:9, ma:200, w:4.65, d:2.6,  cat:"Reverb",    inJ:"right", outJ:"left", pwrJ:"top" },
  "Alexander Pedals Jubilee":       { v:9, ma:75,  w:4.65, d:2.6,  cat:"Overdrive", inJ:"right", outJ:"left", pwrJ:"top" },
  "Alexander Pedals Syntax Error":  { v:9, ma:150, w:4.65, d:2.6,  cat:"Other",     inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Fowl Sounds ──
  "Fowl Sounds Lifer":         { v:9, ma:100, w:5.5,  d:2.6,  cat:"Fuzz",           inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Blackhawk Amplifiers — Portland doom/sludge builder ──
  // Dims: 1590B single / 1590BB dual enclosures (standard). mA estimated by circuit type (9V neg-tip). Verify your own.
  "Blackhawk Balrog (Dist)":       { v:9, ma:18,  w:2.6,  d:4.4,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },
  "Blackhawk Nazgul (Dist/Fuzz)":  { v:9, ma:20,  w:4.7,  d:3.7,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },
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
};
