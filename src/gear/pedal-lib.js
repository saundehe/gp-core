// Unified pedal/gear library for @gp/gear.
// This is the canonical source — replaces gpdoom-tools/pedals.js (window.GP_PEDALS)
// and rig/src/pedals.js (PEDAL_LIB). Tools version is the superset (has jack layout).
// Dims in inches. Jack sides: top/bottom/left/right.
// Optional inJAt/outJAt/pwrJAt (0.0–1.0): precise jack position along the side.
//   left/right sides: 0=top edge, 1=bottom edge. top/bottom sides: 0=left, 1=right.
//   When absent, tools use a geometry heuristic: portrait (d>w) → 0.15, landscape (w>d) → 0.5.
//   Add measured values when you have the physical pedal in hand.
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
  "EHX MEL9":                  { v:9, ma:100, w:4.5,  d:3.4,  cat:"Synthesis",      inJ:"right", outJ:"left", pwrJ:"top" },

  // ── TC Electronic ──
  "TC Flashback 4":            { v:9, ma:160, w:2.85, d:4.8,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Flashback X4":           { v:9, ma:160, w:2.85, d:4.8,  cat:"Delay",          inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Hall of Fame 2":         { v:9, ma:100, w:2.85, d:4.8,  cat:"Reverb",         inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Sentry Noise Gate":      { v:9, ma:30,  w:2.75, d:3.5,  cat:"Noise Gate",     inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Sub'n'Up":               { v:9, ma:100, w:2.75, d:3.5,  cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Ditto+ Looper":          { v:9, ma:65,  w:2.75, d:3.5,  cat:"Other",          inJ:"right", outJ:"left", pwrJ:"top" },
  "TC Ditto X2":               { v:9, ma:100, w:4.57, d:2.75, cat:"Looper",         inJ:"right", outJ:"left", pwrJ:"top" },

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

  // ── Fuzzrocious ── (Portland doom/experimental builder; 1590BB-format enclosures; low-current silicon)
  "Fuzzrocious Bongripper":        { v:9, ma:10,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Fuzzrocious 420":               { v:9, ma:10,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Fuzzrocious Rat Tail":          { v:9, ma:12,  w:2.6,  d:4.4,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },
  "Fuzzrocious Demon King":        { v:9, ma:10,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Black Arts Toneworks ──
  "Black Arts Quantum Mystic":     { v:9, ma:20,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Black Arts Pharaoh":            { v:9, ma:20,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "Black Arts Ritual":             { v:9, ma:10,  w:2.6,  d:4.4,  cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Stone Deaf FX ──
  "Stone Deaf Trashy Blonde":      { v:9, ma:20,  w:4.72, d:2.38, cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },
  "Stone Deaf PDF-1x":             { v:9, ma:20,  w:4.72, d:2.38, cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },

  // ── JHS Pedals ──
  "JHS Legends Fuzz":              { v:9, ma:20,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "JHS Muffuletta":                { v:9, ma:30,  w:4.67, d:3.68, cat:"Fuzz",         inJ:"right", outJ:"left", pwrJ:"top" },
  "JHS Angry Charlie":             { v:9, ma:30,  w:2.6,  d:4.4,  cat:"Distortion",   inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Aguilar ──
  "Aguilar Octamizer":             { v:9, ma:15,  w:4.45, d:2.35, cat:"Pitch / Octave", inJ:"right", outJ:"left", pwrJ:"top" },
  "Aguilar TLC Compressor":        { v:9, ma:45,  w:4.45, d:2.35, cat:"Compressor",   inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Saturnworks ──
  "Saturnworks Looper":            { v:9, ma:30,  w:3.68, d:1.46, cat:"Looper",        inJ:"right", outJ:"left", pwrJ:"top" },
  "Saturnworks Micro Switch":      { v:9, ma:15,  w:2.5,  d:1.5,  cat:"Utility",       inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Behringer (pedals) ──
  "Behringer SF300":               { v:9, ma:20,  w:2.76, d:4.57, cat:"Fuzz",          inJ:"right", outJ:"left", pwrJ:"top" },

  // ── Laney ──
  "Laney Ironheart IRT-Pulse":     { v:9, ma:500, w:4.7,  d:2.6,  cat:"Preamp",        inJ:"right", outJ:"left", pwrJ:"top" },

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
  "Orange Crush Mini":              { v:9, ma:1000, cat:"Amp" },
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
};
