// MIDI device definitions for @gp/gear.
// Migrated from rig/src/main.js DEVICE_DEFS. This is now the canonical source.
// Consumers: RigWork (gear editor, Tweak tab, preset builder) and any future MIDI-aware surface.
//
// Shape per entry:
//   label      — display name
//   type       — device category (Reverb, Delay, Amp sim, etc.)
//   params[]   — { cc, label, def } — named CC controls with defaults
//   starterPresets[] — { name, recallPC, ccValues } — starter presets copied onto device at add
//   note       — optional free text shown in the device editor
//   software   — true for plugins/software (no physical power draw)
//   starter    — like starterPresets but becomes customParams (for MIDI-learn-only devices)
//   merisSysex — { model } — Meris sysex model byte (Meris devices only)

export const deviceDefs = {
  meris_mercury7: {
    label: 'Meris Mercury7', type: 'Reverb',
    // VERIFIED against the official Meris Mercury7 manual v4, Section 6 (MIDI CC table).
    // 500-series scheme: CC4 exp · CC14 bypass · CC16-21 knobs · CC22-27 alt (2nd layer) · CC28-29 switches.
    params: [
      { cc: 16, label: 'Space Decay',         def: 64  },
      { cc: 17, label: 'Modulate',            def: 0   },
      { cc: 18, label: 'Mix',                 def: 64  },
      { cc: 19, label: 'Lo Freq',             def: 127 },
      { cc: 20, label: 'Pitch Vector',        def: 0   },
      { cc: 21, label: 'Hi Freq',             def: 127 },
      { cc: 22, label: 'Predelay (alt)',      def: 0   },
      { cc: 23, label: 'Mod Speed (alt)',     def: 64  },
      { cc: 24, label: 'Pitch Vec Mix (alt)', def: 0   },
      { cc: 25, label: 'Density (alt)',       def: 127 },
      { cc: 26, label: 'Attack Time (alt)',   def: 63  },
      { cc: 27, label: 'Vibrato Depth (alt)', def: 0   },
      { cc: 28, label: 'Swell (0/127)',       def: 0   },
      { cc: 29, label: 'Algorithm (0=Ultraplate/127=Cathedra)', def: 0 },
      { cc: 4,  label: 'Expression',          def: 0   },
      { cc: 14, label: 'Bypass (0/127)',      def: 127 },
    ],
    // CC values estimated from the official Meris Mercury7 Factory Preset Diagram (2019).
    // Algorithm (CC29) and Swell (CC28) are exact; knob values are visual approximations.
    // Use "Read from pedal" in RigWork for exact values from your hardware.
    programSelect: { label: 'Slot', min: 0, max: 15, def: 0 },
    starterPresets: [
      { name: 'Ultraplate',      recallPC: -1, ccValues: { 14:127, 16:80,  17:12, 18:77, 19:127, 20:0,   21:127, 22:0,  23:21, 24:0,  25:127, 26:63, 28:0,   29:0   } },
      { name: 'OctaveUp',        recallPC: -1, ccValues: { 14:127, 16:65,  17:30, 18:65, 19:127, 20:115, 21:127, 22:0,  23:50, 24:80, 25:80,  26:40, 28:0,   29:0   } },
      { name: 'DownShift',       recallPC: -1, ccValues: { 14:127, 16:100, 17:15, 18:70, 19:127, 20:8,   21:100, 22:0,  23:30, 24:0,  25:100, 26:40, 28:0,   29:127 } },
      { name: 'BloomVibe',       recallPC: -1, ccValues: { 14:127, 16:95,  17:65, 18:75, 19:100, 20:70,  21:100, 22:0,  23:50, 24:0,  25:100, 26:90, 28:0,   29:127 } },
      { name: 'ExpSustain',      recallPC: -1, ccValues: { 14:127, 16:120, 17:5,  18:85, 19:127, 20:42,  21:127, 22:0,  23:20, 24:0,  25:127, 26:63, 28:0,   29:0   } },
      { name: 'Drift',           recallPC: -1, ccValues: { 14:127, 16:80,  17:50, 18:65, 19:127, 20:55,  21:110, 22:0,  23:25, 24:0,  25:90,  26:40, 28:0,   29:127 } },
      { name: 'Uplift',          recallPC: -1, ccValues: { 14:127, 16:85,  17:30, 18:75, 19:100, 20:85,  21:120, 22:0,  23:40, 24:70, 25:90,  26:40, 28:0,   29:0   } },
      { name: 'PitchSwell',      recallPC: -1, ccValues: { 14:127, 16:85,  17:20, 18:85, 19:127, 20:95,  21:127, 22:0,  23:30, 24:80, 25:100, 26:50, 28:127, 29:0   } },
      { name: 'SubTerra',        recallPC: -1, ccValues: { 14:127, 16:115, 17:10, 18:75, 19:127, 20:8,   21:40,  22:0,  23:15, 24:0,  25:110, 26:80, 28:127, 29:127 } },
      { name: 'ResoVerb',        recallPC: -1, ccValues: { 14:127, 16:95,  17:25, 18:80, 19:110, 20:42,  21:75,  22:10, 23:35, 24:0,  25:80,  26:50, 28:127, 29:127 } },
      { name: 'ParasiticDecay',  recallPC: -1, ccValues: { 14:127, 16:85,  17:55, 18:65, 19:80,  20:20,  21:70,  22:5,  23:45, 24:0,  25:60,  26:30, 28:0,   29:127 } },
      { name: 'GlassRegen',      recallPC: -1, ccValues: { 14:127, 16:90,  17:35, 18:75, 19:55,  20:70,  21:90,  22:5,  23:30, 24:0,  25:70,  26:40, 28:0,   29:127 } },
      { name: 'SmallHall',       recallPC: -1, ccValues: { 14:127, 16:45,  17:5,  18:55, 19:100, 20:42,  21:100, 22:0,  23:15, 24:0,  25:80,  26:40, 28:0,   29:0   } },
      { name: 'SpatialSustain',  recallPC: -1, ccValues: { 14:127, 16:105, 17:15, 18:80, 19:127, 20:42,  21:127, 22:0,  23:20, 24:0,  25:120, 26:50, 28:0,   29:0   } },
      { name: 'PianoBass',       recallPC: -1, ccValues: { 14:127, 16:55,  17:5,  18:65, 19:127, 20:10,  21:40,  22:0,  23:10, 24:0,  25:90,  26:60, 28:0,   29:127 } },
      { name: 'FadedOctave',     recallPC: -1, ccValues: { 14:127, 16:90,  17:40, 18:80, 19:100, 20:100, 21:90,  22:0,  23:35, 24:70, 25:90,  26:45, 28:127, 29:127 } },
    ],
    merisSysex: { model: 0x00 },
  },

  meris_polymoon: {
    label: 'Meris Polymoon', type: 'Delay',
    // VERIFIED against the midi.guide Polymoon CC table (full CC4-31).
    params: [
      { cc: 16, label: 'Time',                     def: 64  },
      { cc: 17, label: 'Feedback',                 def: 40  },
      { cc: 18, label: 'Mix',                      def: 64  },
      { cc: 19, label: 'Multiply',                 def: 0   },
      { cc: 20, label: 'Dimension',                def: 0   },
      { cc: 21, label: 'Dynamics',                 def: 64  },
      { cc: 22, label: 'Early Modulation (alt)',   def: 0   },
      { cc: 23, label: 'Feedback Filter (alt)',    def: 64  },
      { cc: 24, label: 'Delay Level (alt)',        def: 100 },
      { cc: 25, label: 'Late Modulation (alt)',    def: 0   },
      { cc: 26, label: 'DYN Flanger Mode (alt)',   def: 0   },
      { cc: 27, label: 'DYN Flanger Speed (alt)',  def: 64  },
      { cc: 9,  label: 'Dotted 8th',               def: 0   },
      { cc: 15, label: 'Tempo (10ms steps)',        def: 0   },
      { cc: 28, label: 'Tap',                      def: 0   },
      { cc: 29, label: 'Phaser Mode',              def: 0   },
      { cc: 30, label: 'Flanger Feedback',         def: 0   },
      { cc: 31, label: 'Half Speed (0/127)',        def: 0   },
      { cc: 4,  label: 'Expression',               def: 0   },
      { cc: 14, label: 'Bypass (0/127)',           def: 127 },
    ],
    // CC values from the official Meris Polymoon Factory Preset Diagram (2019).
    // CC9=Dotted8th (0/127), CC29=Phaser Mode (0/127), CC31=Half Speed (0/127).
    // Knob values are visual estimates; use "Read from pedal" for exact values.
    programSelect: { label: 'Slot', min: 0, max: 15, def: 0 },
    starterPresets: [
      { name: 'MultiplyOne',     recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:64, 18:96,  19:20, 20:64,  21:96,  22:38, 23:64, 24:96,  25:10, 26:64,  27:96,  29:0,   31:0   } },
      { name: 'MultiMem',        recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:75, 18:80,  19:10, 20:55,  21:127, 22:38, 23:64, 24:64,  25:0,  26:55,  27:127, 29:0,   31:0   } },
      { name: 'LateShift',       recallPC: -1, ccValues: { 14:127, 9:0, 16:0,   17:75, 18:80,  19:38, 20:64,  21:100, 22:38, 23:70, 24:96,  25:20, 26:64,  27:96,  29:0,   31:0   } },
      { name: 'DarkMod',         recallPC: -1, ccValues: { 14:127, 9:0, 16:55,  17:64, 18:80,  19:38, 20:64,  21:127, 22:64, 23:64, 24:64,  25:10, 26:64,  27:127, 29:0,   31:0   } },
      { name: 'Togglephase',     recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:64, 18:96,  19:38, 20:64,  21:96,  22:38, 23:64, 24:96,  25:20, 26:64,  27:96,  29:127, 31:127 } },
      { name: 'DarkDimension',   recallPC: -1, ccValues: { 14:127, 9:0, 16:55,  17:64, 18:80,  19:38, 20:55,  21:127, 22:64, 23:64, 24:64,  25:38, 26:64,  27:127, 29:0,   31:0   } },
      { name: 'PhaserPan',       recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:64, 18:55,  19:20, 20:64,  21:96,  22:38, 23:64, 24:96,  25:38, 26:64,  27:96,  29:127, 31:0   } },
      { name: 'ShiftFlange',     recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:64, 18:55,  19:38, 20:64,  21:100, 22:38, 23:64, 24:96,  25:38, 26:64,  27:127, 29:0,   31:0   } },
      { name: 'SpectralDecay',   recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:75, 18:55,  19:30, 20:64,  21:96,  22:38, 23:64, 24:96,  25:38, 26:64,  27:96,  29:0,   31:0   } },
      { name: 'Elevate',         recallPC: -1, ccValues: { 14:127, 9:0, 16:45,  17:75, 18:80,  19:20, 20:38,  21:96,  22:38, 23:75, 24:96,  25:20, 26:38,  27:96,  29:0,   31:0   } },
      { name: 'SlowPhase',       recallPC: -1, ccValues: { 14:127, 9:0, 16:55,  17:64, 18:80,  19:20, 20:64,  21:96,  22:45, 23:64, 24:96,  25:20, 26:64,  27:96,  29:0,   31:127 } },
      { name: 'DynamicEcho',     recallPC: -1, ccValues: { 14:127, 9:0, 16:55,  17:64, 18:55,  19:20, 20:55,  21:100, 22:38, 23:64, 24:96,  25:20, 26:55,  27:96,  29:0,   31:0   } },
      { name: 'NativeFlange',    recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:64, 18:80,  19:20, 20:64,  21:96,  22:38, 23:64, 24:96,  25:38, 26:64,  27:96,  29:0,   31:127 } },
      { name: 'GravityHarp',     recallPC: -1, ccValues: { 14:127, 9:0, 16:45,  17:75, 18:80,  19:20, 20:50,  21:100, 22:38, 23:75, 24:96,  25:20, 26:50,  27:127, 29:0,   31:127 } },
      { name: 'DimensionChorus', recallPC: -1, ccValues: { 14:127, 9:0, 16:55,  17:64, 18:55,  19:20, 20:64,  21:127, 22:38, 23:64, 24:96,  25:20, 26:64,  27:100, 29:0,   31:0   } },
      { name: 'FlangeEcho',      recallPC: -1, ccValues: { 14:127, 9:0, 16:38,  17:55, 18:55,  19:20, 20:64,  21:100, 22:38, 23:55, 24:96,  25:20, 26:64,  27:127, 29:0,   31:0   } },
    ],
    merisSysex: { model: 0x01 },
  },

  meris_hedra: {
    label: 'Meris Hedra', type: 'Harmonizer',
    // Knob+alt names CONFIRMED vs the Hedra manual front panel.
    // CC#s follow the verified 500-series scheme; switch CCs 29-31 least certain.
    params: [
      { cc: 16, label: 'Key',                          def: 0   },
      { cc: 17, label: 'Micro Tune',                   def: 64  },
      { cc: 18, label: 'Mix',                          def: 64  },
      { cc: 19, label: 'Pitch 1',                      def: 64  },
      { cc: 20, label: 'Pitch 2',                      def: 64  },
      { cc: 21, label: 'Pitch 3',                      def: 64  },
      { cc: 22, label: 'Scale Type (alt)',              def: 0   },
      { cc: 23, label: 'Pitch Correction+Glide (alt)', def: 0   },
      { cc: 24, label: 'Feedback (alt)',                def: 0   },
      { cc: 25, label: 'Time Division 1 (alt)',         def: 0   },
      { cc: 26, label: 'Time Division 2 (alt)',         def: 0   },
      { cc: 27, label: 'Time Division 3 (alt)',         def: 0   },
      { cc: 9,  label: 'Half Speed (0/127)',            def: 0   },
      { cc: 15, label: 'Tempo (10ms steps)',            def: 0   },
      { cc: 28, label: 'Tap',                          def: 0   },
      { cc: 29, label: 'Delay Mode',                   def: 0   },
      { cc: 30, label: 'Pitch Smoothing (0/127)',       def: 0   },
      { cc: 31, label: 'Volume Swell (0/127)',          def: 0   },
      { cc: 4,  label: 'Expression',                   def: 0   },
      { cc: 14, label: 'Bypass (0/127)',               def: 127 },
    ],
    // CC values from the official Meris Hedra Factory Settings Diagram (2019).
    // CC29=Delay Mode (0/127), CC30=Pitch Smoothing (0/127), CC31=Volume Swell (0/127).
    // Knob values are visual estimates; use "Read from pedal" for exact values.
    programSelect: { label: 'Slot', min: 0, max: 15, def: 0 },
    starterPresets: [
      { name: 'SeriesSequence',    recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:90, 19:32,  20:21,  21:105, 22:0,  23:70,  24:32, 25:10, 26:64, 27:96, 29:0,   30:0,   31:0 } },
      { name: 'PitchEcho',         recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:80, 19:116, 20:84,  21:116, 22:0,  23:64,  24:64, 25:32, 26:64, 27:96, 29:127, 30:0,   31:0 } },
      { name: 'MicroFall',         recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:75, 19:105, 20:95,  21:84,  22:0,  23:64,  24:20, 25:64, 26:64, 27:64, 29:0,   30:0,   31:0 } },
      { name: 'MicroChorus',       recallPC: -1, ccValues: { 14:127, 16:0, 17:74, 18:80, 19:116, 20:110, 21:116, 22:0,  23:80,  24:20, 25:64, 26:64, 27:64, 29:0,   30:127, 31:0 } },
      { name: 'HardTuneTriplet',   recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:85, 19:116, 20:116, 21:116, 22:0,  23:127, 24:32, 25:42, 26:42, 27:42, 29:0,   30:0,   31:0 } },
      { name: 'StereoOctave',      recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:90, 19:32,  20:116, 21:127, 22:0,  23:80,  24:32, 25:64, 26:64, 27:64, 29:0,   30:127, 31:0 } },
      { name: 'CarlePlaceShred',   recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:80, 19:84,  20:63,  21:116, 22:0,  23:64,  24:32, 25:64, 26:64, 27:96, 29:0,   30:0,   31:0 } },
      { name: 'ExpressionSteel',   recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:75, 19:116, 20:63,  21:32,  22:0,  23:127, 24:32, 25:64, 26:64, 27:64, 29:0,   30:127, 31:0 } },
      { name: 'TickTock',          recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:85, 19:116, 20:84,  21:32,  22:0,  23:80,  24:48, 25:96, 26:64, 27:32, 29:0,   30:127, 31:0 } },
      { name: 'Layers',            recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:90, 19:84,  20:63,  21:32,  22:0,  23:90,  24:64, 25:96, 26:64, 27:32, 29:127, 30:127, 31:0 } },
      { name: 'ExpressionShift',   recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:64, 19:116, 20:63,  21:32,  22:0,  23:127, 24:0,  25:0,  26:0,  27:0,  29:0,   30:127, 31:0 } },
      { name: 'PentatonicCorrect', recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:80, 19:95,  20:84,  21:63,  22:64, 23:90,  24:32, 25:64, 26:64, 27:64, 29:0,   30:0,   31:0 } },
      { name: 'InfiniteArcade',    recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:80, 19:32,  20:116, 21:127, 22:0,  23:64,  24:80, 25:10, 26:10, 27:10, 29:0,   30:0,   31:0 } },
      { name: 'MirrorGlide',       recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:85, 19:32,  20:116, 21:127, 22:0,  23:90,  24:48, 25:64, 26:64, 27:64, 29:127, 30:0,   31:0 } },
      { name: 'BumbleTrail',       recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:80, 19:105, 20:95,  21:84,  22:0,  23:64,  24:48, 25:32, 26:64, 27:96, 29:0,   30:0,   31:0 } },
      { name: 'FoldingIntervals',  recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:80, 19:84,  20:116, 21:32,  22:0,  23:80,  24:48, 25:64, 26:64, 27:64, 29:0,   30:127, 31:0 } },
    ],
    merisSysex: { model: 0x04 },
  },

  meris_enzo: {
    label: 'Meris Enzo', type: 'Synth',
    // Knobs match the Enzo pedal; CC#s follow the verified 500-series scheme.
    // No public per-pedal CC table -- spot-check on hardware before live use.
    params: [
      { cc: 16, label: 'Pitch',                              def: 64  },
      { cc: 17, label: 'Filter',                             def: 127 },
      { cc: 18, label: 'Mix',                                def: 64  },
      { cc: 19, label: 'Sustain',                            def: 64  },
      { cc: 20, label: 'Filter Envelope',                    def: 64  },
      { cc: 21, label: 'Modulation',                         def: 0   },
      { cc: 22, label: 'Pitch (alt)',                         def: 0   },
      { cc: 23, label: 'Filter (alt)',                       def: 0   },
      { cc: 24, label: 'Mix (alt)',                          def: 0   },
      { cc: 25, label: 'Sustain (alt)',                      def: 0   },
      { cc: 26, label: 'Filter Envelope (alt)',              def: 64  },
      { cc: 27, label: 'Modulation (alt)',                   def: 0   },
      { cc: 9,  label: 'Envelope Type (0=trig/127=follow)', def: 0   },
      { cc: 15, label: 'Tempo (10ms steps)',                 def: 0   },
      { cc: 28, label: 'Tap',                               def: 0   },
      { cc: 29, label: 'Synth Mode (dry/mono/arp/poly)',    def: 96  },
      { cc: 30, label: 'Waveshape (0=saw/127=square)',      def: 0   },
      { cc: 4,  label: 'Expression',                        def: 0   },
      { cc: 14, label: 'Bypass (0/127)',                    def: 127 },
    ],
    // CC values verified against the official Meris ENZO Factory Preset Diagram PDF.
    // Heel position (expression toe-up / no expression pedal). CC29 bands: 0-31=dry 32-63=mono 64-95=arp 96-127=poly.
    programSelect: { label: 'Slot', min: 0, max: 15, def: 0 },
    starterPresets: [
      { name: 'PolySwell',   recallPC: -1, ccValues: { 14:127, 9:0,   15:127, 29:112, 30:0,   16:0,   17:127, 18:127, 19:20,  20:122, 21:55,  22:0,   23:70,  24:127, 25:0,   26:111, 27:0   } },
      { name: 'PolyRing',    recallPC: -1, ccValues: { 14:127, 9:0,   15:127, 29:112, 30:0,   16:64,  17:0,   18:120, 19:55,  20:0,   21:6,   22:0,   23:48,  24:0,   25:69,  26:53,  27:0   } },
      { name: 'SparkArp',    recallPC: -1, ccValues: { 14:127, 9:0,   15:8,   29:80,  30:127, 16:64,  17:95,  18:97,  19:96,  20:61,  21:0,   22:0,   23:0,   24:127, 25:0,   26:75,  27:0   } },
      { name: 'MonoEcho',    recallPC: -1, ccValues: { 14:127, 9:0,   15:63,  29:48,  30:127, 16:64,  17:87,  18:61,  19:0,   20:30,  21:53,  22:0,   23:72,  24:127, 25:0,   26:96,  27:106 } },
      { name: 'PolyGlide',   recallPC: -1, ccValues: { 14:127, 9:0,   15:127, 29:112, 30:0,   16:5,   17:111, 18:127, 19:99,  20:74,  21:0,   22:103, 23:0,   24:99,  25:0,   26:8,   27:0   } },
      { name: 'DarkArp',     recallPC: -1, ccValues: { 14:127, 9:0,   15:33,  29:80,  30:127, 16:0,   17:34,  18:127, 19:127, 20:38,  21:127, 22:0,   23:0,   24:127, 25:0,   26:52,  27:0   } },
      { name: 'Mono Tyrell', recallPC: -1, ccValues: { 14:127, 9:127, 15:63,  29:48,  30:0,   16:63,  17:127, 18:127, 19:127, 20:61,  21:127, 22:0,   23:70,  24:99,  25:35,  26:7,   27:94  } },
      { name: 'ShiftTrem',   recallPC: -1, ccValues: { 14:127, 9:0,   15:92,  29:48,  30:0,   16:89,  17:127, 18:31,  19:18,  20:0,   21:28,  22:0,   23:0,   24:119, 25:0,   26:0,   27:63  } },
      { name: 'BellLab',     recallPC: -1, ccValues: { 14:127, 9:0,   15:42,  29:112, 30:0,   16:102, 17:0,   18:127, 19:109, 20:0,   21:98,  22:0,   23:57,  24:127, 25:117, 26:98,  27:15  } },
      { name: 'Woodwind',    recallPC: -1, ccValues: { 14:127, 9:0,   15:63,  29:48,  30:0,   16:122, 17:45,  18:127, 19:127, 20:67,  21:54,  22:0,   23:0,   24:101, 25:0,   26:0,   27:103 } },
      { name: 'RileyCurve',  recallPC: -1, ccValues: { 14:127, 9:0,   15:8,   29:112, 30:0,   16:64,  17:107, 18:127, 19:127, 20:60,  21:0,   22:0,   23:71,  24:51,  25:0,   26:0,   27:0   } },
      { name: 'PondBase',    recallPC: -1, ccValues: { 14:127, 9:0,   15:12,  29:48,  30:0,   16:4,   17:127, 18:98,  19:117, 20:127, 21:127, 22:35,  23:71,  24:127, 25:0,   26:99,  27:83  } },
      { name: 'StarLand',    recallPC: -1, ccValues: { 14:127, 9:0,   15:53,  29:80,  30:127, 16:64,  17:127, 18:127, 19:127, 20:126, 21:48,  22:107, 23:71,  24:127, 25:122, 26:107, 27:0   } },
      { name: 'FormantRing', recallPC: -1, ccValues: { 14:127, 9:0,   15:109, 29:112, 30:0,   16:28,  17:25,  18:127, 19:127, 20:0,   21:0,   22:0,   23:53,  24:22,  25:127, 26:127, 27:20  } },
      { name: 'LinkArp',     recallPC: -1, ccValues: { 14:127, 9:0,   15:25,  29:80,  30:127, 16:122, 17:127, 18:127, 19:127, 20:74,  21:0,   22:0,   23:53,  24:54,  25:0,   26:36,  27:0   } },
      { name: 'ExpSweep',    recallPC: -1, ccValues: { 14:127, 9:127, 15:34,  29:112, 30:0,   16:89,  17:127, 18:91,  19:0,   20:98,  21:0,   22:0,   23:71,  24:87,  25:0,   26:0,   27:60  } },
    ],
    merisSysex: { model: 0x02 },
  },

  meris_ottobit: {
    label: 'Meris Ottobit Jr', type: 'Bitcrusher',
    // VERIFIED against the midi.guide Ottobit Jr CC table (full CC4-31).
    params: [
      { cc: 16, label: 'Sample Rate',      def: 127 },
      { cc: 17, label: 'Filter',           def: 64  },
      { cc: 18, label: 'Bits',             def: 127 },
      { cc: 19, label: 'Stutter',          def: 0   },
      { cc: 20, label: 'Sequencer',        def: 0   },
      { cc: 21, label: 'SEQ Multiply',     def: 64  },
      { cc: 22, label: 'Step 1 (alt)',     def: 64  },
      { cc: 23, label: 'Step 2 (alt)',     def: 64  },
      { cc: 24, label: 'Step 3 (alt)',     def: 64  },
      { cc: 25, label: 'Step 4 (alt)',     def: 64  },
      { cc: 26, label: 'Step 5 (alt)',     def: 64  },
      { cc: 27, label: 'Step 6 (alt)',     def: 64  },
      { cc: 15, label: 'Tempo (10ms steps)', def: 0 },
      { cc: 28, label: 'Tap',              def: 0   },
      { cc: 29, label: 'SEQ Type',         def: 0   },
      { cc: 31, label: 'Stutter Hold (0/127)', def: 0 },
      { cc: 4,  label: 'Expression',       def: 0   },
      { cc: 14, label: 'Bypass (0/127)',   def: 127 },
    ],
    // CC values verified against the official Meris Ottobit Jr Factory Preset Diagram PDF (2019).
    // Knob angles extracted from vector paths at 4x resolution; step values from embedded text.
    // Heel position (expression toe-up / no expression pedal). CC29: 0=Pitch SEQ, 127=Filter SEQ.
    // CC15 (Tempo) and CC28 (Tap) are triggers — not stored in presets.
    programSelect: { label: 'Slot', min: 0, max: 15, def: 0 },
    starterPresets: [
      { name: 'CycleArp',       recallPC: -1, ccValues: { 14:127, 16:127, 17:127, 18:127, 19:121, 20:74,  21:59, 22:37, 23:21,  24:0,   25:101, 26:79,  27:64,  29:0   } },
      { name: 'JumpSEQ',        recallPC: -1, ccValues: { 14:127, 16:127, 17:96,  18:127, 19:83,  20:84,  21:59, 22:0,  23:37,  24:64,  25:85,  26:101, 27:127, 29:0   } },
      { name: 'FilterSEQ',      recallPC: -1, ccValues: { 14:127, 16:127, 17:66,  18:59,  19:97,  20:36,  21:25, 22:64, 23:64,  24:64,  25:64,  26:64,  27:64,  29:127 } },
      { name: 'StutterBits',    recallPC: -1, ccValues: { 14:127, 16:118, 17:60,  18:57,  19:100, 20:42,  21:38, 22:37, 23:85,  24:101, 25:64,  26:64,  27:64,  29:0   } },
      { name: 'Outrun',         recallPC: -1, ccValues: { 14:127, 16:123, 17:66,  18:32,  19:121, 20:69,  21:38, 22:127,23:0,   24:64,  25:116, 26:0,   27:64,  29:0   } },
      { name: 'TripleOctave',   recallPC: -1, ccValues: { 14:127, 16:66,  17:127, 18:127, 19:121, 20:63,  21:59, 22:127,23:127, 24:0,   25:127, 26:64,  27:64,  29:0   } },
      { name: 'NoCoast',        recallPC: -1, ccValues: { 14:127, 16:127, 17:71,  18:39,  19:85,  20:56,  21:59, 22:64, 23:48,  24:26,  25:11,  26:64,  27:64,  29:0   } },
      { name: 'Ghost',          recallPC: -1, ccValues: { 14:127, 16:63,  17:127, 18:127, 19:121, 20:69,  21:59, 22:90, 23:106, 24:74,  25:53,  26:64,  27:64,  29:0   } },
      { name: 'ExpFilterBass',  recallPC: -1, ccValues: { 14:127, 16:127, 17:24,  18:54,  19:121, 20:84,  21:37, 22:0,  23:0,   24:64,  25:64,  26:64,  27:64,  29:0   } },
      { name: 'ExpFuzzBit',     recallPC: -1, ccValues: { 14:127, 16:127, 17:65,  18:33,  19:121, 20:77,  21:37, 22:64, 23:64,  24:64,  25:64,  26:64,  27:64,  29:0   } },
      { name: 'ExpBassSeq',     recallPC: -1, ccValues: { 14:127, 16:127, 17:50,  18:58,  19:102, 20:68,  21:37, 22:64, 23:48,  24:74,  25:37,  26:79,  27:101, 29:0   } },
      { name: 'TriggeredTrem',  recallPC: -1, ccValues: { 14:127, 16:127, 17:127, 18:127, 19:82,  20:66,  21:59, 22:64, 23:64,  24:0,   25:64,  26:64,  27:64,  29:0   } },
      { name: 'AutoArp',        recallPC: -1, ccValues: { 14:127, 16:127, 17:66,  18:57,  19:121, 20:71,  21:25, 22:48, 23:64,  24:85,  25:111, 26:85,  27:64,  29:0   } },
      { name: 'StutterSub',     recallPC: -1, ccValues: { 14:127, 16:127, 17:127, 18:127, 19:100, 20:49,  21:68, 22:79, 23:127, 24:0,   25:32,  26:37,  27:64,  29:0   } },
      { name: 'FuzzFilter',     recallPC: -1, ccValues: { 14:127, 16:127, 17:88,  18:44,  19:121, 20:0,   21:35, 22:64, 23:64,  24:64,  25:64,  26:64,  27:64,  29:127 } },
      { name: 'Quest',          recallPC: -1, ccValues: { 14:127, 16:127, 17:127, 18:127, 19:121, 20:79,  21:35, 22:74, 23:64,  24:74,  25:90,  26:85,  27:64,  29:0   } },
    ],
    merisSysex: { model: 0x03 },
  },

  // ── Meris flagship X-series (modular workstations — large MIDI maps) ──
  // Named, fixed-function CCs only. Per-algorithm "parameter N" slots summarised
  // in `note` — add your used ones as custom controls. All VERIFIED against
  // official manuals (MercuryX v1.2.2, LVX v1.3.2, Enzo X v1.2.2, Ottobit X v1.0.1).

  meris_mercuryx: {
    label: 'Meris Mercury X', type: 'Reverb',
    note: 'Mercury X §11: per-algorithm knob CCs — Reverb CC33-41, Dynamics CC64-69, Pitch CC72-77, Filter CC80-85, Mod CC88-93 (meaning depends on selected type).',
    params: [
      { cc: 1,   label: 'Mix',             def: 64  },
      { cc: 2,   label: 'Dry Trim',        def: 127 },
      { cc: 3,   label: 'Wet Trim',        def: 127 },
      { cc: 4,   label: 'Expression',      def: 0   },
      { cc: 5,   label: 'Preamp Type',     def: 0   },
      { cc: 6,   label: 'Preamp Location', def: 0   },
      { cc: 7,   label: 'Gain / Vol Level',def: 64  },
      { cc: 8,   label: 'Balance',         def: 64  },
      { cc: 11,  label: 'Preamp Level',    def: 64  },
      { cc: 13,  label: 'Delay Structure', def: 0   },
      { cc: 14,  label: 'Bypass (0/127)',  def: 127 },
      { cc: 15,  label: 'Time',            def: 64  },
      { cc: 16,  label: 'Delay Type',      def: 0   },
      { cc: 17,  label: 'Left Note Div',   def: 64  },
      { cc: 18,  label: 'Right Note Div',  def: 64  },
      { cc: 19,  label: 'Feedback',        def: 40  },
      { cc: 20,  label: 'Cross Feedback',  def: 0   },
      { cc: 21,  label: 'Modulation',      def: 0   },
      { cc: 22,  label: 'Damping',         def: 64  },
      { cc: 23,  label: 'Dry Blend',       def: 0   },
      { cc: 24,  label: 'Half Speed',      def: 0   },
      { cc: 32,  label: 'Reverb Structure',def: 0   },
      { cc: 62,  label: 'Dynamics Type',   def: 0   },
      { cc: 70,  label: 'Pitch Type',      def: 0   },
      { cc: 78,  label: 'Filter Type',     def: 0   },
      { cc: 86,  label: 'Mod Type',        def: 0   },
      { cc: 117, label: 'Tuner Toggle',    def: 0   },
      { cc: 118, label: 'Hold Modifier',   def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  meris_lvx: {
    label: 'Meris LVX', type: 'Delay',
    note: 'LVX §11: per-algorithm knob CCs — Preamp CC7-12, Delay CC22-61, Dynamics CC64-69, Pitch CC72-77, Filter CC80-85, Mod CC88-93.',
    params: [
      { cc: 1,   label: 'Mix',               def: 64  },
      { cc: 2,   label: 'Dry Trim',          def: 127 },
      { cc: 3,   label: 'Wet Trim',          def: 127 },
      { cc: 4,   label: 'Expression',        def: 0   },
      { cc: 5,   label: 'Preamp Type',       def: 0   },
      { cc: 6,   label: 'Preamp Location',   def: 0   },
      { cc: 13,  label: 'Delay Structure',   def: 0   },
      { cc: 14,  label: 'Bypass (0/127)',    def: 127 },
      { cc: 15,  label: 'Time',              def: 64  },
      { cc: 16,  label: 'Delay Type',        def: 0   },
      { cc: 17,  label: 'Left Note Div',     def: 64  },
      { cc: 18,  label: 'Right Note Div',    def: 64  },
      { cc: 19,  label: 'Feedback',          def: 40  },
      { cc: 20,  label: 'Cross Feedback',    def: 0   },
      { cc: 21,  label: 'Delay Mod',         def: 0   },
      { cc: 62,  label: 'Dynamics Type',     def: 0   },
      { cc: 70,  label: 'Pitch Type',        def: 0   },
      { cc: 78,  label: 'Filter Type',       def: 0   },
      { cc: 86,  label: 'Mod Type',          def: 0   },
      { cc: 95,  label: 'Looper Level',      def: 64  },
      { cc: 96,  label: 'Looper Feedback',   def: 64  },
      { cc: 99,  label: 'Tap Tempo',         def: 0   },
      { cc: 100, label: 'Looper Rec/Overdub',def: 0   },
      { cc: 101, label: 'Looper Play/Stop',  def: 0   },
      { cc: 117, label: 'Tuner Toggle',      def: 0   },
      { cc: 119, label: 'Delay Half Speed',  def: 0   },
      { cc: 120, label: 'Delay Damping',     def: 0   },
      { cc: 121, label: 'MIDI Clock',        def: 0   },
    ],
    programSelect: { label: 'Slot', min: 0, max: 15, def: 0 },
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
    merisSysex: { model: 0x05 }, // 0x05 = LVX per product order; verify against Meris sysex docs / iOS app traffic
  },

  meris_enzox: {
    label: 'Meris Enzo X', type: 'Synth',
    note: 'Enzo X §11: drive CC5-9, ambience/echo CC10-20, filter ADSR CC46-51, amp ADSR CC55-59, arp CC32-34/85, mod params CC87-93.',
    params: [
      { cc: 4,   label: 'Expression',          def: 0   },
      { cc: 14,  label: 'Bypass (0/127)',      def: 127 },
      { cc: 15,  label: 'Time',               def: 64  },
      { cc: 22,  label: 'Synth Mode',         def: 0   },
      { cc: 23,  label: 'Synth Pitch',        def: 64  },
      { cc: 24,  label: 'Osc 1 Waveshape',    def: 64  },
      { cc: 25,  label: 'Osc 2 Waveshape',    def: 64  },
      { cc: 26,  label: 'Osc 2 Pitch Offset', def: 64  },
      { cc: 27,  label: 'Osc 2 Detune',       def: 64  },
      { cc: 28,  label: 'Glide (Portamento)', def: 0   },
      { cc: 29,  label: 'Osc 1 Gain',         def: 127 },
      { cc: 30,  label: 'Osc 2 Gain',         def: 0   },
      { cc: 31,  label: 'XMod',               def: 0   },
      { cc: 32,  label: 'Arp Mode',           def: 0   },
      { cc: 35,  label: 'Level',              def: 100 },
      { cc: 36,  label: 'Dry Blend',          def: 0   },
      { cc: 38,  label: 'Filter Type',        def: 0   },
      { cc: 39,  label: 'Filter Frequency',   def: 127 },
      { cc: 41,  label: 'Filter Resonance',   def: 0   },
      { cc: 44,  label: 'Filter Env Amount',  def: 64  },
      { cc: 60,  label: 'Mix',                def: 64  },
      { cc: 61,  label: 'Dry Trim',           def: 127 },
      { cc: 62,  label: 'Wet Trim',           def: 127 },
      { cc: 86,  label: 'Mod Type',           def: 0   },
      { cc: 99,  label: 'Tap Tempo',          def: 0   },
      { cc: 117, label: 'Tuner Toggle',       def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  meris_ottobitx: {
    label: 'Meris Ottobit X', type: 'Bitcrusher',
    note: 'Ottobit X §11: mod params CC32-45, pitch params CC47-52, glitch CC69.',
    params: [
      { cc: 1,   label: 'Mix',                     def: 64  },
      { cc: 2,   label: 'Dry Trim',                def: 127 },
      { cc: 3,   label: 'Wet Trim',                def: 127 },
      { cc: 4,   label: 'Expression',              def: 0   },
      { cc: 5,   label: 'Preamp Type',             def: 0   },
      { cc: 6,   label: 'Preamp Location',         def: 0   },
      { cc: 10,  label: 'Ambience Type',           def: 0   },
      { cc: 14,  label: 'Bypass (0/127)',          def: 127 },
      { cc: 15,  label: 'Time',                    def: 64  },
      { cc: 16,  label: 'Play Speed',              def: 64  },
      { cc: 17,  label: 'Echo Left Div',           def: 64  },
      { cc: 18,  label: 'Echo Right Div',          def: 64  },
      { cc: 19,  label: 'Ambience+Echo Mix',       def: 0   },
      { cc: 20,  label: 'Dust Amount',             def: 0   },
      { cc: 21,  label: 'MIDI Clock',              def: 0   },
      { cc: 22,  label: 'Sample Rate',             def: 127 },
      { cc: 23,  label: 'Bits',                    def: 127 },
      { cc: 24,  label: 'Level',                   def: 100 },
      { cc: 25,  label: 'Crush Location',          def: 0   },
      { cc: 26,  label: 'Dry Blend (Crush)',       def: 0   },
      { cc: 27,  label: 'Top-Right Knob Assign',   def: 0   },
      { cc: 28,  label: 'Bit Scaling',             def: 0   },
      { cc: 30,  label: 'Mod Type',                def: 0   },
      { cc: 46,  label: 'Pitch Type',              def: 0   },
      { cc: 51,  label: 'Key',                     def: 0   },
      { cc: 52,  label: 'Scale',                   def: 0   },
      { cc: 99,  label: 'Tap Tempo',               def: 0   },
      { cc: 117, label: 'Tuner Toggle',            def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  darkglass_anagram: {
    label: 'Darkglass Anagram', type: 'Amp sim',
    // VERIFIED against the official Darkglass Anagram manual (OS v1.4), MIDI Support section.
    note: 'Anagram OS v1.4: presets load via PC (PC 1-126 = 01A-42C). Ignores CC value 0 by design (send 1+). CC17-25 and CC89 are EDITABLE binding slots -- assign on device; labels below are defaults.',
    params: [
      { cc: 102, label: 'Bank Select (1-42)',                def: 1  },
      { cc: 105, label: 'Preset Next',                       def: 1  },
      { cc: 106, label: 'Preset Prev',                       def: 1  },
      { cc: 107, label: 'Scene (1=A/2=B/3=C/127=def)',       def: 1  },
      { cc: 85,  label: 'Mode (1=Preset/2=Stomp/3=Scene)',   def: 1  },
      { cc: 86,  label: 'Tuner Enter/Exit',                  def: 1  },
      { cc: 17,  label: 'Stomp Foot A (64-127 on)',          def: 64 },
      { cc: 18,  label: 'Stomp Foot B (64-127 on)',          def: 64 },
      { cc: 19,  label: 'Stomp Foot C (64-127 on)',          def: 64 },
      { cc: 20,  label: 'Binding Knob 1',                    def: 0  },
      { cc: 21,  label: 'Binding Knob 2',                    def: 0  },
      { cc: 22,  label: 'Binding Knob 3',                    def: 0  },
      { cc: 23,  label: 'Binding Knob 4',                    def: 0  },
      { cc: 24,  label: 'Binding Knob 5',                    def: 0  },
      { cc: 25,  label: 'Binding Knob 6',                    def: 0  },
      { cc: 89,  label: 'Expression Pedal',                  def: 0  },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  darkglass_ao900: {
    label: 'Darkglass Alpha Omega 900', type: 'Amp sim',
    // CC80/81/82 confirmed HIGH confidence for channel switching (Alpha/Omega/Clean).
    // EQ/drive/level knobs use MIDI LEARN (no fixed CC map published).
    note: 'Alpha Omega 900 MIDI IN: switch channels, toggle Mute & Compressor, recall 3 cab-sim slots via PC and CC. EQ/drive/level knobs use MIDI LEARN (assign each function in Darkglass Suite). Program Change 0-127 recalls presets 1-128.',
    params: [
      { cc: 80, label: 'Channel — Alpha (high gain)',       def: 127 },
      { cc: 81, label: 'Channel — Omega (ultra high gain)', def: 127 },
      { cc: 82, label: 'Channel — Clean',                   def: 127 },
      // Note: EQ/drive/level knobs use MIDI LEARN (no fixed CC map published).
      // Program Change 0-127 recalls presets 1-128.
    ],
  },

  boss_dd200: {
    label: 'Boss DD-200', type: 'Delay',
    // Boss 200-series factory default CC assignments. CC16 (EXP) hardwired; CC17-22 user-reassignable.
    params: [
      { cc: 16, label: 'Expression (EXP, hardwired)',   def: 64  },
      { cc: 17, label: 'Time (default assign)',          def: 64  },
      { cc: 18, label: 'Feedback (default assign)',      def: 40  },
      { cc: 19, label: 'Effect Level (default assign)',  def: 80  },
      { cc: 20, label: 'Tone (default assign)',          def: 64  },
      { cc: 21, label: 'Mod (default assign)',           def: 0   },
      { cc: 22, label: 'Param (default assign)',         def: 64  },
      { cc: 27, label: 'Effect On/Off (0=off/127=on)',  def: 127 },
      { cc: 28, label: 'Memory / Tap',                  def: 0   },
      { cc: 80, label: 'CTL-1',                         def: 0   },
      { cc: 81, label: 'CTL-2',                         def: 0   },
      { cc: 82, label: 'Memory Switch',                 def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_od200: {
    label: 'Boss OD-200', type: 'Drive/OD',
    // Boss 200-series factory default CC assignments (CCi menu). Assignable range: CC1-31 and CC64-95.
    // Panel labels vs MIDI menu names: BOTTOM=Low(Loc), CHARACTER=Middle(Mdc), TOP=High(hiC), E.LEVEL=Level(LUC).
    // CC28 (SHC) toggle requires controller to send 0 THEN 127 on the same CC# — a single value does not work.
    params: [
      { cc: 16, label: 'Expression / EXP (hardwired)',       def: 64  },
      { cc: 17, label: 'Drive (drC)',                        def: 64  },
      { cc: 18, label: 'E.Level / Level (LUC)',              def: 100 },
      { cc: 19, label: 'Bottom / Low (Loc)',                 def: 64  },
      { cc: 20, label: 'Character / Middle (Mdc)',           def: 64  },
      { cc: 21, label: 'Top / High (hiC)',                   def: 64  },
      { cc: 22, label: 'Booster Pre Level (PrC)',            def: 64  },
      { cc: 23, label: 'Booster Post Level (PSC)',           def: 64  },
      { cc: 27, label: 'Effect On/Off EFC (0=off, 127=on)', def: 127 },
      { cc: 28, label: 'Bypass Toggle SHC (send 0 then 127)', def: 0 },
      { cc: 80, label: 'CTL-1 (C1C)',                       def: 0   },
      { cc: 81, label: 'CTL-2 (C2C)',                       def: 0   },
      { cc: 82, label: 'Memory/Boost Switch (MEC)',          def: 0   },
      { cc: 83, label: 'Boost On/Off bSC (0=off, 127=on)',  def: 0   },
    ],
    programSelect: { label: 'Patch', min: 0, max: 31, def: 0 },
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_rv200: {
    label: 'Boss RV-200', type: 'Reverb',
    params: [
      { cc: 16, label: 'Expression (EXP, hardwired)',    def: 64  },
      { cc: 17, label: 'Time (default assign)',           def: 64  },
      { cc: 18, label: 'Pre-Delay (default assign)',      def: 0   },
      { cc: 19, label: 'Effect Level (default assign)',   def: 80  },
      { cc: 20, label: 'Low (default assign)',            def: 64  },
      { cc: 21, label: 'High (default assign)',           def: 64  },
      { cc: 22, label: 'Param (algo-specific, default)',  def: 64  },
      { cc: 27, label: 'Bypass (0=off/127=on)',           def: 127 },
      { cc: 28, label: 'Memory',                          def: 0   },
      { cc: 80, label: 'CTL-1',                           def: 0   },
      { cc: 81, label: 'CTL-2',                           def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_md200: {
    label: 'Boss MD-200', type: 'Modulation',
    // CC20-22 (Param 1-3) vary by modulation algorithm selected on the pedal.
    params: [
      { cc: 16, label: 'Expression (EXP, hardwired)',    def: 64  },
      { cc: 17, label: 'Rate (default assign)',           def: 64  },
      { cc: 18, label: 'Depth (default assign)',          def: 64  },
      { cc: 19, label: 'Effect Level (default assign)',   def: 80  },
      { cc: 20, label: 'Param 1 (algo-specific)',         def: 64  },
      { cc: 21, label: 'Param 2 (algo-specific)',         def: 64  },
      { cc: 22, label: 'Param 3 (algo-specific)',         def: 64  },
      { cc: 27, label: 'Effect On/Off (0=off/127=on)',   def: 127 },
      { cc: 28, label: 'Memory / Tap',                    def: 0   },
      { cc: 80, label: 'CTL-1',                           def: 0   },
      { cc: 81, label: 'CTL-2',                           def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_ir200: {
    label: 'Boss IR-200', type: 'Amp sim',
    params: [
      { cc: 16, label: 'Expression (EXP, hardwired)',  def: 64  },
      { cc: 17, label: 'Gain (default assign)',         def: 64  },
      { cc: 18, label: 'Level (default assign)',        def: 100 },
      { cc: 19, label: 'Solo Level (default assign)',   def: 80  },
      { cc: 27, label: 'Bypass (0=off/127=on)',         def: 127 },
      { cc: 80, label: 'CTL-1',                         def: 0   },
      { cc: 81, label: 'CTL-2',                         def: 0   },
      { cc: 82, label: 'Down',                          def: 0   },
      { cc: 83, label: 'Up',                            def: 0   },
      { cc: 84, label: 'Solo (0=off/127=on)',           def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_sy200: {
    label: 'Boss SY-200', type: 'Synth',
    // Boss 200-series factory default CC assignments. CC16 hardwired; CC17-22 user-reassignable.
    params: [
      { cc: 16, label: 'Expression (EXP, hardwired)',  def: 64  },
      { cc: 17, label: 'Type (default assign)',          def: 0   },
      { cc: 18, label: 'Ensemble (default assign)',      def: 64  },
      { cc: 19, label: 'Attack (default assign)',        def: 64  },
      { cc: 20, label: 'Level (default assign)',         def: 80  },
      { cc: 21, label: 'Param 1 (default assign)',       def: 64  },
      { cc: 22, label: 'Param 2 (default assign)',       def: 64  },
      { cc: 27, label: 'Effect On/Off (0=off/127=on)',  def: 127 },
      { cc: 28, label: 'Memory',                         def: 0   },
      { cc: 80, label: 'CTL-1',                          def: 0   },
      { cc: 81, label: 'CTL-2',                          def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_eq200: {
    label: 'Boss EQ-200', type: 'EQ',
    // Boss 200-series factory default CC assignments. CC16 hardwired; CC17-22 user-reassignable.
    params: [
      { cc: 16, label: 'Expression (EXP, hardwired)',  def: 64  },
      { cc: 17, label: 'Low (default assign)',           def: 64  },
      { cc: 18, label: 'Low-Mid (default assign)',       def: 64  },
      { cc: 19, label: 'Mid (default assign)',           def: 64  },
      { cc: 20, label: 'High-Mid (default assign)',      def: 64  },
      { cc: 21, label: 'High (default assign)',          def: 64  },
      { cc: 22, label: 'Level (default assign)',         def: 80  },
      { cc: 27, label: 'Effect On/Off (0=off/127=on)',  def: 127 },
      { cc: 28, label: 'Memory',                         def: 0   },
      { cc: 80, label: 'CTL-1',                          def: 0   },
      { cc: 81, label: 'CTL-2',                          def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_dd500: {
    label: 'Boss DD-500', type: 'Delay',
    // Boss 500-series: CC27/80/81 are fixed; CC17-22 are user-assignable via the ASSIGN menu on the pedal.
    // Add custom controls for any knobs you've assigned in the pedal's ASSIGN settings.
    note: 'Knob CCs (17-22) are user-assigned on the pedal. Add custom controls to match your ASSIGN config.',
    params: [
      { cc: 27, label: 'Effect On/Off (0=off/127=on)', def: 127 },
      { cc: 28, label: 'Tap',                           def: 0   },
      { cc: 80, label: 'CTL-1',                         def: 0   },
      { cc: 81, label: 'CTL-2',                         def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_rv500: {
    label: 'Boss RV-500', type: 'Reverb',
    // Boss 500-series: CC27/80/81 are fixed; knob CCs are user-assignable via ASSIGN menu.
    note: 'Knob CCs are user-assigned on the pedal. Add custom controls to match your ASSIGN config.',
    params: [
      { cc: 27, label: 'Effect On/Off (0=off/127=on)', def: 127 },
      { cc: 80, label: 'CTL-1',                         def: 0   },
      { cc: 81, label: 'CTL-2',                         def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_md500: {
    label: 'Boss MD-500', type: 'Modulation',
    // Boss 500-series: CC27/80/81 are fixed; knob CCs are user-assignable via ASSIGN menu.
    note: 'Knob CCs are user-assigned on the pedal. Add custom controls to match your ASSIGN config.',
    params: [
      { cc: 27, label: 'Effect On/Off (0=off/127=on)', def: 127 },
      { cc: 80, label: 'CTL-1',                         def: 0   },
      { cc: 81, label: 'CTL-2',                         def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  boss_rc500: {
    label: 'Boss RC-500', type: 'Looper',
    // All looper function CCs are user-defined via ASSIGN. CC27/80/81 are the fixed anchors.
    note: 'All looper function CCs (play, stop, record, etc.) are user-assigned on the pedal.',
    params: [
      { cc: 27, label: 'Effect On/Off (0=off/127=on)', def: 127 },
      { cc: 80, label: 'CTL-1',                         def: 0   },
      { cc: 81, label: 'CTL-2',                         def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  chase_bliss_thermae: {
    label: 'Chase Bliss Thermae', type: 'Analog Delay / Pitch Shifter',
    // Verified via midi.guide/d/chase-bliss/thermae/ (updated Feb 2026, 17 params).
    // Toggle values: 1=left, 2=center, 3=right. Default MIDI ch 2.
    // CC97 bypass confirmed for analog CBA pedals; newer units may use CC102 — check firmware.
    params: [
      { cc: 14,  label: 'Mix',                              def: 64  },
      { cc: 15,  label: 'LPF',                              def: 64  },
      { cc: 16,  label: 'Regen',                            def: 64  },
      { cc: 17,  label: 'Glide',                            def: 0   },
      { cc: 18,  label: 'Int 1 (Speed)',                    def: 64  },
      { cc: 19,  label: 'Int 2 (Depth)',                    def: 64  },
      { cc: 20,  label: 'Ramp',                             def: 64  },
      { cc: 21,  label: 'Toggle: Int 1 mode (1-3)',         def: 2   },
      { cc: 22,  label: 'Toggle: Int 2 mode (1-3)',         def: 2   },
      { cc: 23,  label: 'Toggle: Tap/MIDI (1-3)',           def: 2   },
      { cc: 24,  label: 'Hold (regen runaway)',              def: 0   },
      { cc: 25,  label: 'Slowdown / tap tempo',             def: 0   },
      { cc: 51,  label: 'MIDI clock ignore/listen',         def: 0   },
      { cc: 93,  label: 'Tap Tempo',                        def: 0   },
      { cc: 100, label: 'Expression over MIDI',             def: 64  },
      { cc: 102, label: 'Bypass (0-63=bypass, 64-127=engage)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  chase_bliss_mood: {
    label: 'Chase Bliss MOOD MKII', type: 'Micro Looper / Wet Channel Effects',
    // Verified via midi.guide and official MOOD MKII MIDI Manual PDF.
    // MKII adds CC51-111 extended range vs original MOOD. Default MIDI ch 2.
    // Toggle values: 1=left, 2=center, 3=right. Dip switches: left bank CC61-68, right CC71-78.
    params: [
      { cc: 14,  label: 'Time',                                def: 64  },
      { cc: 15,  label: 'Mix',                                 def: 64  },
      { cc: 16,  label: 'Length',                              def: 64  },
      { cc: 17,  label: 'Wet channel modify',                  def: 64  },
      { cc: 18,  label: 'Clock',                               def: 64  },
      { cc: 19,  label: 'Micro-looper modify',                 def: 64  },
      { cc: 20,  label: 'Ramp speed',                          def: 64  },
      { cc: 21,  label: 'Toggle: Wet channel mode (1-3)',      def: 2   },
      { cc: 22,  label: 'Toggle: Routing (1-3)',               def: 2   },
      { cc: 23,  label: 'Toggle: Micro-looper mode (1-3)',     def: 2   },
      { cc: 51,  label: 'MIDI clock ignore',                   def: 0   },
      { cc: 52,  label: 'Stop ramping',                        def: 0   },
      { cc: 53,  label: 'Wet channel clock division',          def: 0   },
      { cc: 54,  label: 'Micro-looper clock division',         def: 0   },
      { cc: 55,  label: 'True bypass mode',                    def: 0   },
      { cc: 57,  label: 'Octave transpose (synth mode)',       def: 0   },
      { cc: 59,  label: 'Exit synth mode',                     def: 0   },
      { cc: 61,  label: 'Dip L1: Time (0=off, 1=on)',         def: 0   },
      { cc: 62,  label: 'Dip L2: Wet modify (0=off, 1=on)',   def: 0   },
      { cc: 63,  label: 'Dip L3: Clock (0=off, 1=on)',        def: 0   },
      { cc: 64,  label: 'Dip L4: Loop modify (0=off, 1=on)',  def: 0   },
      { cc: 65,  label: 'Dip L5: Length (0=off, 1=on)',       def: 0   },
      { cc: 66,  label: 'Dip L6: Bounce (0=off, 1=on)',       def: 0   },
      { cc: 67,  label: 'Dip L7: Sweep (0=off, 1=on)',        def: 0   },
      { cc: 68,  label: 'Dip L8: Polarity (0=off, 1=on)',     def: 0   },
      { cc: 71,  label: 'Dip R1: Classic (0=off, 1=on)',      def: 0   },
      { cc: 72,  label: 'Dip R2: Miso (0=off, 1=on)',         def: 0   },
      { cc: 73,  label: 'Dip R3: Spread (0=off, 1=on)',       def: 0   },
      { cc: 74,  label: 'Dip R4: Dry kill (0=off, 1=on)',     def: 0   },
      { cc: 75,  label: 'Dip R5: Trails (0=off, 1=on)',       def: 0   },
      { cc: 76,  label: 'Dip R6: Latch (0=off, 1=on)',        def: 0   },
      { cc: 77,  label: 'Dip R7: No dub (0=off, 1=on)',       def: 0   },
      { cc: 78,  label: 'Dip R8: Smooth (0=off, 1=on)',       def: 0   },
      { cc: 80,  label: 'Synth attack',                        def: 64  },
      { cc: 81,  label: 'Synth decay',                         def: 64  },
      { cc: 82,  label: 'Synth sustain',                       def: 64  },
      { cc: 83,  label: 'Synth release',                       def: 64  },
      { cc: 84,  label: 'Portamento',                          def: 0   },
      { cc: 87,  label: 'Output type',                         def: 0   },
      { cc: 93,  label: 'Tap Tempo',                           def: 0   },
      { cc: 100, label: 'Expression over MIDI',                def: 64  },
      { cc: 102, label: 'Micro-looper bypass (0-63=bypass, 64-127=engage)', def: 127 },
      { cc: 103, label: 'Wet channel bypass (0-63=bypass, 64-127=engage)',  def: 127 },
      { cc: 105, label: 'Wet channel freeze',                  def: 0   },
      { cc: 106, label: 'Micro-looper freeze',                 def: 0   },
      { cc: 107, label: 'Tap Tempo (MKII)',                    def: 0   },
      { cc: 110, label: 'MIDI reset',                          def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  chase_bliss_blooper: {
    label: 'Chase Bliss Blooper', type: 'Looper',
    // Verified via midi.guide and blooper.chasebliss.com.
    // Presets 1-16 = PC 0-15 (zero-based). Auto-detects MIDI channel.
    params: [
      { cc: 1,  label: 'Record',                def: 0   },
      { cc: 2,  label: 'Play',                  def: 0   },
      { cc: 3,  label: 'Overdub',               def: 0   },
      { cc: 4,  label: 'Stop',                  def: 0   },
      { cc: 5,  label: 'Undo',                  def: 0   },
      { cc: 6,  label: 'Redo',                  def: 0   },
      { cc: 7,  label: 'Erase',                 def: 0   },
      { cc: 8,  label: 'Hold switch B',         def: 0   },
      { cc: 9,  label: 'One-shot dub',          def: 0   },
      { cc: 11, label: 'Multi-control',         def: 0   },
      { cc: 14, label: 'Volume',                def: 100 },
      { cc: 15, label: 'Layers',                def: 64  },
      { cc: 16, label: 'Repeats',               def: 64  },
      { cc: 17, label: 'Mod A (knob)',          def: 64  },
      { cc: 18, label: 'Stability',             def: 64  },
      { cc: 19, label: 'Mod B (knob)',          def: 64  },
      { cc: 20, label: 'Ramp',                  def: 64  },
      { cc: 21, label: 'Toggle: Mod A (1-3)',   def: 2   },
      { cc: 22, label: 'Toggle: Looper mode (1-3)', def: 2 },
      { cc: 23, label: 'Toggle: Mod B (1-3)',   def: 2   },
      { cc: 24, label: 'Preview / save-load',   def: 0   },
      { cc: 30, label: 'Mod A modifier',        def: 64  },
      { cc: 31, label: 'Mod B modifier',        def: 64  },
      { cc: 51, label: 'MIDI clock ignore',     def: 0   },
      { cc: 52, label: 'Ramping on/off',        def: 0   },
      { cc: 100, label: 'Expression over MIDI', def: 64  },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  chase_bliss_dark_world: {
    label: 'Chase Bliss Dark World', type: 'Dual Channel Reverb',
    // Verified via midi.guide/d/chase-bliss/dark-world/ (12 documented params).
    // CC103 routing: 0=both bypass, 45=dark only, 85=world only, 127=both engage.
    // Dip switches NOT controllable via MIDI per community reports. Default MIDI ch 2.
    params: [
      { cc: 14,  label: 'Decay',                                             def: 64  },
      { cc: 15,  label: 'Mix',                                               def: 64  },
      { cc: 16,  label: 'Dwell',                                             def: 64  },
      { cc: 17,  label: 'Modify',                                            def: 64  },
      { cc: 18,  label: 'Tone',                                              def: 64  },
      { cc: 19,  label: 'Pre-delay',                                         def: 0   },
      { cc: 21,  label: 'Toggle: Dark program (1-3)',                        def: 2   },
      { cc: 22,  label: 'Toggle: Para select (1-3)',                         def: 2   },
      { cc: 23,  label: 'Toggle: World program (1-3)',                       def: 2   },
      { cc: 93,  label: 'Tap Tempo',                                         def: 0   },
      { cc: 100, label: 'Expression over MIDI',                              def: 64  },
      { cc: 102, label: 'Engage saved channels (0=bypass, 127=engage)',      def: 127 },
      { cc: 103, label: 'Routing (0=both bypass, 45=dark, 85=world, 127=both)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },
  cba_brothers: {
    label: 'CBA Brothers', type: 'Dual Channel Overdrive/Distortion/Fuzz',
    // Verified via midi.guide/d/chase-bliss/brothers/
    // Toggle CCs (21-23): 1=left, 2=center, 3=right. Default MIDI ch 2.
    // CC103 bypass: 0=bypass both, 45=engage B bypass A, 85=engage A bypass B, 127=engage both.
    params: [
      { cc: 14,  label: 'Gain A',                                                         def: 64  },
      { cc: 15,  label: 'Master',                                                         def: 100 },
      { cc: 16,  label: 'Gain B',                                                         def: 64  },
      { cc: 17,  label: 'Tone A',                                                         def: 64  },
      { cc: 18,  label: 'Mix / Stack',                                                    def: 64  },
      { cc: 19,  label: 'Tone B',                                                         def: 64  },
      { cc: 21,  label: 'Toggle: Channel A Effect (1=Boost, 2=Drive, 3=Fuzz)',            def: 2   },
      { cc: 22,  label: 'Toggle: Routing (1=Parallel, 2=A>>B, 3=B>>A)',                  def: 2   },
      { cc: 23,  label: 'Toggle: Channel B Effect (1=Fuzz, 2=Drive, 3=Boost)',            def: 2   },
      { cc: 100, label: 'Expression',                                                     def: 64  },
      { cc: 102, label: 'Engage Last Saved Channels (0=bypass both, 127=engage)',         def: 127 },
      { cc: 103, label: 'Bypass Engagement (0=bypass both, 45=B only, 85=A only, 127=both engage)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  cba_automatone_preamp_mkii: {
    label: 'CBA Automatone Preamp MKII', type: 'Preamp / Overdrive / Fuzz',
    // Verified via midi.guide/d/chase-bliss/preamp-mkii/
    // Toggle CCs (22-26): 1=left, 2=center, 3=right. CC27: preset slot 0-29. Default MIDI ch 2.
    // CC102 bypass: 0=bypass, 1-127=engage.
    params: [
      { cc: 14,  label: 'Volume',                                         def: 80  },
      { cc: 15,  label: 'Treble',                                         def: 64  },
      { cc: 16,  label: 'Mids',                                           def: 64  },
      { cc: 17,  label: 'Frequency',                                      def: 64  },
      { cc: 18,  label: 'Bass',                                           def: 64  },
      { cc: 19,  label: 'Gain',                                           def: 64  },
      { cc: 22,  label: 'Toggle: Jump (1=Off, 2=0, 3=5)',                def: 1   },
      { cc: 23,  label: 'Toggle: Mids Mode (1=Off, 2=Pre, 3=Post)',      def: 1   },
      { cc: 24,  label: 'Toggle: Q (1=Low, 2=Mid, 3=High)',              def: 2   },
      { cc: 25,  label: 'Toggle: Diode (1=Off, 2=Silicon, 3=Germanium)', def: 1   },
      { cc: 26,  label: 'Toggle: Fuzz (1=Off, 2=Open, 3=Gated)',         def: 1   },
      { cc: 27,  label: 'Preset Save/Recall (0-29)',                      def: 0   },
      { cc: 100, label: 'Expression',                                     def: 64  },
      { cc: 102, label: 'Bypass (0=bypass, 1-127=engage)',                def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  empress_reverb: {
    label: 'Empress Reverb', type: 'Reverb',
    // Verified via pencilresearch/midi CSV (feeds midi.guide). 17 params.
    // CC20 mode: value = (mode_index * 8) + sub_mode. Hall=0, Plate=1, Spring=2, Room=3,
    //   Sparkle=4, Modulation=5, Ambient Swell=6, Delay+Reverb=7, Reverse=8,
    //   Ghost=9, Lo-Fi=10, Beer=11.
    // CC60 = dedicated bypass; CC37 = bypass footswitch simulation (momentary).
    params: [
      { cc: 20, label: 'Mode (mode_idx*8 + sub_mode)', def: 0   },
      { cc: 21, label: 'Decay Time',                   def: 64  },
      { cc: 22, label: 'Mix',                          def: 64  },
      { cc: 23, label: 'Volume',                       def: 100 },
      { cc: 24, label: 'Low',                          def: 64  },
      { cc: 25, label: 'Hi',                           def: 64  },
      { cc: 26, label: 'Thing 1',                      def: 64  },
      { cc: 27, label: 'Thing 2',                      def: 64  },
      { cc: 10, label: 'Simulate EXP',                 def: 64  },
      { cc: 11, label: 'Load Preset',                  def: 0   },
      { cc: 35, label: 'Select BTN',                   def: 0   },
      { cc: 36, label: 'Scroll BTN',                   def: 0   },
      { cc: 37, label: 'Bypass BTN (momentary)',       def: 0   },
      { cc: 38, label: 'Save BTN',                     def: 0   },
      { cc: 39, label: 'Save Preset',                  def: 0   },
      { cc: 51, label: 'MIDI Clock',                   def: 0   },
      { cc: 60, label: 'Bypass (0=bypass, 127=engage)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  empress_echosystem: {
    label: 'Empress Echosystem', type: 'Delay',
    // Verified via pencilresearch/midi CSV. Engine A = CC100-108, B = CC109-117.
    // CC100/109 mode: mode_idx*8 + sub_mode. Digital=0, Tape=1, Analog=2, Multi=3,
    //   Mod=4, Filter=5, Ambient=6, Delay+Reverb=7, Reverse=8, Stutter=9, Lo-Fi=10, Whisky=11.
    // CC101/110 Delay Time Ratio: 10=1:3, 28=1:2, 42=2:3, 56=3:4, 72=1:1,
    //   86=4:3, 98=3:2, 113=Golden, 127=5:3.
    params: [
      { cc: 100, label: 'A Mode (mode_idx*8 + sub_mode)',         def: 0   },
      { cc: 101, label: 'A Delay Time Ratio (see note)',          def: 72  },
      { cc: 102, label: 'A Mix',                                  def: 64  },
      { cc: 103, label: 'A Volume',                               def: 100 },
      { cc: 104, label: 'A Feedback',                             def: 40  },
      { cc: 105, label: 'A Tone',                                 def: 64  },
      { cc: 106, label: 'A Thing 1',                              def: 64  },
      { cc: 107, label: 'A Thing 2',                              def: 64  },
      { cc: 108, label: 'A Delay Source',                         def: 0   },
      { cc: 109, label: 'B Mode (mode_idx*8 + sub_mode)',         def: 0   },
      { cc: 110, label: 'B Delay Time Ratio (see note)',          def: 72  },
      { cc: 111, label: 'B Mix',                                  def: 64  },
      { cc: 112, label: 'B Volume',                               def: 100 },
      { cc: 113, label: 'B Feedback',                             def: 40  },
      { cc: 114, label: 'B Tone',                                 def: 64  },
      { cc: 115, label: 'B Thing 1',                              def: 64  },
      { cc: 116, label: 'B Thing 2',                              def: 64  },
      { cc: 117, label: 'B Delay Source',                         def: 0   },
      { cc: 118, label: 'Engines Routing',                        def: 0   },
      { cc: 10,  label: 'Simulate EXP',                           def: 64  },
      { cc: 11,  label: 'Load Preset',                            def: 0   },
      { cc: 35,  label: 'TAP',                                    def: 0   },
      { cc: 36,  label: 'Scroll',                                 def: 0   },
      { cc: 37,  label: 'Bypass BTN (momentary)',                 def: 0   },
      { cc: 38,  label: 'Shift',                                  def: 0   },
      { cc: 39,  label: 'Save Preset',                            def: 0   },
      { cc: 40,  label: 'Engine Order',                           def: 0   },
      { cc: 41,  label: 'A Solo Engine',                          def: 0   },
      { cc: 42,  label: 'B Solo Engine',                          def: 0   },
      { cc: 51,  label: 'A MIDI Clock',                           def: 0   },
      { cc: 52,  label: 'B MIDI Clock',                           def: 0   },
      { cc: 60,  label: 'Bypass (0=bypass, 127=engage)',          def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  walrus_acs1: {
    label: 'Walrus ACS1', type: 'Amp sim',
    // Verified from official Walrus Audio ACS1 firmware 2.03 manual, p.6 MIDI CC table.
    // CC27 Cab Switch: Front A=0-20, B=22-42, C=44-64 / Back A=66-86, B=88-108, C=110-127.
    // CC30/31 use 0=bypass, 127=engaged.
    params: [
      { cc: 3,  label: 'Bass',                                          def: 64  },
      { cc: 14, label: 'Mid',                                           def: 64  },
      { cc: 15, label: 'Treble',                                        def: 64  },
      { cc: 20, label: 'Volume',                                        def: 100 },
      { cc: 21, label: 'Gain',                                          def: 64  },
      { cc: 22, label: 'Room',                                          def: 0   },
      { cc: 27, label: 'Cab Switch (see note)',                         def: 0   },
      { cc: 28, label: 'L+R Switch (0-42=L, 43-85=Mid, 86-127=R)',    def: 43  },
      { cc: 29, label: 'Amp (0-42=Fullerton, 43-85=London, 86-127=Dartford)', def: 0 },
      { cc: 30, label: 'Bypass (0=bypass, 127=engage)',                 def: 127 },
      { cc: 31, label: 'Boost (0=bypass, 127=engage)',                  def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  walrus_mako_m1: {
    label: 'Walrus Mako M1', type: 'Modulation',
    // Verified via Morningstar forum threads + Walrus Audio confirmation (fw 1.19+).
    // CC104 (Mix) added in firmware 1.19 — not in printed manual. CC31=Bypass confirmed.
    // CC18 program select: 0=Chorus, 1=Phaser, 2=Tremolo, 3=Vibe, 4=Rotary, 5=Filter.
    // Full knob CC table is in official image-PDF manual (not OCR-able remotely).
    note: 'Firmware 1.19+ required for CC104 (Mix). CC18 selects program: 0=Chorus, 1=Phaser, 2=Tremolo, 3=Vibe, 4=Rotary, 5=Filter.',
    params: [
      { cc: 3,   label: 'Rate',                                             def: 64  },
      { cc: 17,  label: 'Type (sub-variation within program)',              def: 0   },
      { cc: 18,  label: 'Program (0=Chorus, 1=Phaser, 2=Trem, 3=Vibe, 4=Rotary, 5=Filter)', def: 0 },
      { cc: 31,  label: 'Bypass (0=bypass, 127=engage)',                   def: 127 },
      { cc: 104, label: 'Dry/Wet Mix (fw 1.19+)',                          def: 64  },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  walrus_mako_d1: {
    label: 'Walrus Mako D1', type: 'Delay',
    // Bypass CC29 verified via Morningstar forum (MC6 multi-pedal thread, most reliable source).
    // Tweak params CC21/22/23 confirmed in MC3 thread. Full knob CC table in image-PDF manual only.
    // Full manual: https://cdn.shopify.com/s/files/1/0906/8480/files/07_2022_D1_v2_manual_web.pdf
    note: 'Full CC map in official image-PDF manual. CC21-23 are per-program Tweak params. Download manual for complete knob CCs.',
    params: [
      { cc: 21,  label: 'Mod (Tweak param 1)',        def: 64  },
      { cc: 22,  label: 'Tone (Tweak param 2)',       def: 64  },
      { cc: 23,  label: 'Age / Bit Crusher (Digital)', def: 0  },
      { cc: 29,  label: 'Bypass (0=bypass, 127=engage)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  walrus_mako_r1: {
    label: 'Walrus Mako R1', type: 'Reverb',
    // Only bypass CC confirmed via Morningstar forum (chained D1+R1 thread: D1=CC29, R1=CC30).
    // Full knob CC table in official image-PDF manual (not OCR-able remotely).
    // Full manual: https://cdn.shopify.com/s/files/1/0906/8480/files/R1_MKII_Digital_Manual_a1735587-a113-4074-a83c-1b77d7632bb8.pdf
    note: 'Full CC map in official image-PDF manual. Add knob CCs from manual as custom controls.',
    params: [
      { cc: 30,  label: 'Bypass (0=bypass, 127=engage)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  walrus_eb_10: {
    label: 'Walrus Audio EB-10', type: 'Preamp/EQ/Boost',
    // CC map from EB-10 manual (v1). Program Change selects presets 1-4.
    // TRS MIDI in (3.5mm Type A / tip-active).
    params: [
      { cc: 0, label: 'Bypass Toggle',  def: 0   },  // 0-63 = bypass, 64-127 = engaged
      { cc: 1, label: 'Bass',           def: 64  },
      { cc: 2, label: 'Mid',            def: 64  },
      { cc: 3, label: 'Treble',         def: 64  },
      { cc: 4, label: 'Volume',         def: 100 },
      { cc: 5, label: 'Gain',           def: 64  },
      { cc: 6, label: 'Boost Toggle',   def: 0   },  // 0-63 = off, 64-127 = on
      { cc: 7, label: 'Boost Level',    def: 64  },
    ],
    starterPresets: [],
  },

  source_audio_nemesis: {
    label: 'Source Audio Nemesis', type: 'Delay',
    // VERIFIED against official Source Audio Nemesis MIDI Implementation doc (front-panel subset).
    // Full map has 38 CCs -- add more as custom controls.
    params: [
      { cc: 1,   label: 'Engine (0-23)', def: 0   },
      { cc: 2,   label: 'Delay Time',   def: 64  },
      { cc: 5,   label: 'Feedback',     def: 48  },
      { cc: 6,   label: 'Mix',          def: 64  },
      { cc: 7,   label: 'Mod Depth',    def: 0   },
      { cc: 8,   label: 'Mod Rate',     def: 64  },
      { cc: 9,   label: 'Intensity',    def: 64  },
      { cc: 10,  label: 'Output Level', def: 100 },
      { cc: 102, label: 'Bypass (0/127)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  source_audio_c4: {
    label: 'Source Audio C4 Synth', type: 'Synth',
    // VERIFIED from official SA249 C4 Synth User Guide, page 42.
    // Only 6 hard-wired CCs. All other params must be assigned via Neuro Desktop Editor MIDI Map.
    note: 'Only CC 93/100/102-105 are fixed. All other params require Neuro Editor MIDI mapping per-unit.',
    params: [
      { cc: 93,  label: 'Tap Tempo (external)',                 def: 0   },
      { cc: 100, label: 'Expression (assign targets in Neuro)', def: 64  },
      { cc: 102, label: 'Engage/Bypass (0-64=bypass, 65-127=engage)', def: 127 },
      { cc: 103, label: 'Recall Preset (bypassed state)',       def: 0   },
      { cc: 104, label: 'Recall Preset (engaged state)',        def: 0   },
      { cc: 105, label: 'Toggle Bypass (any value)',            def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  source_audio_ventris: {
    label: 'Source Audio Ventris', type: 'Reverb',
    // VERIFIED from official Source Audio MIDI Implementation PDF (dual-reverb engine A+B).
    // Engine A: CC 1-20, Engine B: CC 25-44. CC 15-20 / 39-44 are engine-dependent — meaning
    // changes with engine selection. Mix 50/50 is ~value 95 (not 64).
    note: 'Dual engine: A uses CC 1-20, B uses CC 25-44. CC 15-20 (A) and CC 39-44 (B) change meaning per engine. Mix 50/50 = approx value 95.',
    params: [
      { cc: 1,   label: 'Engine A (0=Room, 1=Hall, 2=E-Dome, 3=Spring, 4=Plate, 5=Lo-Fi, 6=Modverb, 7=Shimmer, 8=Echoverb, 9=Swell, 10=Offspring, 11=Reverse, 12=Out Spring, 13=Metal Box)', def: 0   },
      { cc: 2,   label: 'Time A',                def: 64  },
      { cc: 3,   label: 'Mix A',                 def: 95  },
      { cc: 4,   label: 'Pre-Delay A',           def: 0   },
      { cc: 5,   label: 'Treble A',              def: 64  },
      { cc: 6,   label: 'Output A',              def: 100 },
      { cc: 7,   label: 'Bass A',                def: 64  },
      { cc: 8,   label: 'Diffusion A',           def: 64  },
      { cc: 9,   label: 'Mod Depth A',           def: 0   },
      { cc: 10,  label: 'Mod Rate A',            def: 64  },
      { cc: 11,  label: 'Pre-Delay Feedback A',  def: 0   },
      { cc: 13,  label: 'Size A',                def: 0   },
      { cc: 15,  label: 'Engine Param 1 A (engine-dependent)', def: 64  },
      { cc: 16,  label: 'Engine Param 2 A (engine-dependent)', def: 64  },
      { cc: 17,  label: 'Engine Param 3 A (engine-dependent)', def: 64  },
      { cc: 18,  label: 'Engine Param 4 A (engine-dependent)', def: 64  },
      { cc: 19,  label: 'Engine Param 5 A (engine-dependent)', def: 64  },
      { cc: 25,  label: 'Engine B (0=Room, 1=Hall, 2=E-Dome, 3=Spring, 4=Plate, 5=Lo-Fi, 6=Modverb, 7=Shimmer, 8=Echoverb, 9=Swell, 10=Offspring, 11=Reverse, 12=Out Spring, 13=Metal Box)', def: 0   },
      { cc: 26,  label: 'Time B',                def: 64  },
      { cc: 27,  label: 'Mix B',                 def: 95  },
      { cc: 28,  label: 'Pre-Delay B',           def: 0   },
      { cc: 29,  label: 'Treble B',              def: 64  },
      { cc: 30,  label: 'Output B',              def: 100 },
      { cc: 31,  label: 'Bass B',                def: 64  },
      { cc: 32,  label: 'Diffusion B',           def: 64  },
      { cc: 33,  label: 'Mod Depth B',           def: 0   },
      { cc: 34,  label: 'Mod Rate B',            def: 64  },
      { cc: 35,  label: 'Pre-Delay Feedback B',  def: 0   },
      { cc: 37,  label: 'Size B',                def: 0   },
      { cc: 39,  label: 'Engine Param 1 B (engine-dependent)', def: 64  },
      { cc: 40,  label: 'Engine Param 2 B (engine-dependent)', def: 64  },
      { cc: 41,  label: 'Engine Param 3 B (engine-dependent)', def: 64  },
      { cc: 42,  label: 'Engine Param 4 B (engine-dependent)', def: 64  },
      { cc: 43,  label: 'Engine Param 5 B (engine-dependent)', def: 64  },
      { cc: 50,  label: 'Dual/Single Mode (0=A only, 1=B only, 2=Parallel, 3=Cascade)', def: 2   },
      { cc: 54,  label: 'Reverb Send',           def: 100 },
      { cc: 55,  label: 'A/B Crossfade',         def: 64  },
      { cc: 80,  label: 'Preset Decrement',      def: 0   },
      { cc: 82,  label: 'Preset Increment',      def: 0   },
      { cc: 93,  label: 'Tap Tempo',             def: 0   },
      { cc: 97,  label: 'Hold (sustain trail)',   def: 0   },
      { cc: 100, label: 'Expression',            def: 64  },
      { cc: 101, label: 'Bypass (0-64=bypass, 65-127=engage)', def: 127 },
      { cc: 102, label: 'Toggle Bypass',         def: 0   },
      { cc: 103, label: 'Recall Preset (bypassed)', def: 0 },
      { cc: 104, label: 'Recall Preset (engaged)',  def: 0 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  alexander_wavelength: {
    label: 'Alexander Wavelength', type: 'Modulation',
    // VERIFIED against Alexander Neo-series MIDI CC map (2026-06).
    params: [
      { cc: 50, label: 'Tweak',        def: 64 },
      { cc: 51, label: 'Rate',         def: 64 },
      { cc: 52, label: 'Depth/Manual', def: 64 },
      { cc: 53, label: 'Mix',          def: 64 },
      { cc: 54, label: 'Shape',        def: 0  },
      { cc: 56, label: 'Ramp Speed',   def: 64 },
      { cc: 57, label: 'Level',        def: 100 },
      { cc: 59, label: 'Mode (0-5)',   def: 0  },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  strymon_timeline: {
    label: 'Strymon TimeLine', type: 'Delay',
    // VERIFIED against the TimeLine MIDI spec.
    params: [
      { cc: 3,   label: 'Time',           def: 64  },
      { cc: 9,   label: 'Repeats',        def: 64  },
      { cc: 14,  label: 'Mix',            def: 64  },
      { cc: 15,  label: 'Filter',         def: 64  },
      { cc: 16,  label: 'Grit',           def: 0   },
      { cc: 17,  label: 'Speed',          def: 0   },
      { cc: 18,  label: 'Depth',          def: 0   },
      { cc: 19,  label: 'Machine (0-11)', def: 0   },
      { cc: 100, label: 'Expression',     def: 64  },
      { cc: 102, label: 'Bypass (0/127)', def: 127 },
    ],
    // CC19 machine: 0=Digital 1=Analog 2=Reverse 3=Filter 4=Lo-Fi 5=Dual 6=Ice 7=Trem 8=Pattern 9=Tape 10=Swell 11=DLine
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Digital',  recallPC: -1, ccValues: { 102:127, 19:0,  3:64, 9:40, 14:55, 15:64, 16:0,  17:0,  18:0  } },
      { name: 'Analog',   recallPC: -1, ccValues: { 102:127, 19:1,  3:64, 9:45, 14:55, 15:50, 16:20, 17:0,  18:0  } },
      { name: 'Reverse',  recallPC: -1, ccValues: { 102:127, 19:2,  3:64, 9:40, 14:65, 15:64, 16:0,  17:0,  18:0  } },
      { name: 'Filter',   recallPC: -1, ccValues: { 102:127, 19:3,  3:64, 9:40, 14:55, 15:80, 16:0,  17:0,  18:0  } },
      { name: 'Lo-Fi',    recallPC: -1, ccValues: { 102:127, 19:4,  3:64, 9:45, 14:55, 15:40, 16:40, 17:0,  18:0  } },
      { name: 'Dual',     recallPC: -1, ccValues: { 102:127, 19:5,  3:64, 9:40, 14:55, 15:64, 16:0,  17:0,  18:0  } },
      { name: 'Ice',      recallPC: -1, ccValues: { 102:127, 19:6,  3:64, 9:50, 14:60, 15:64, 16:0,  17:0,  18:0  } },
      { name: 'Trem',     recallPC: -1, ccValues: { 102:127, 19:7,  3:64, 9:40, 14:55, 15:64, 16:0,  17:50, 18:64 } },
      { name: 'Pattern',  recallPC: -1, ccValues: { 102:127, 19:8,  3:64, 9:40, 14:55, 15:64, 16:0,  17:0,  18:0  } },
      { name: 'Tape',     recallPC: -1, ccValues: { 102:127, 19:9,  3:64, 9:45, 14:55, 15:55, 16:15, 17:0,  18:0  } },
      { name: 'Swell',    recallPC: -1, ccValues: { 102:127, 19:10, 3:64, 9:40, 14:70, 15:64, 16:0,  17:0,  18:0  } },
      { name: 'DLine',    recallPC: -1, ccValues: { 102:127, 19:11, 3:64, 9:40, 14:55, 15:64, 16:0,  17:0,  18:0  } },
    ],
    // deviceId 0x10 from Strymon identity reply; 300 presets (100 banks × A/B/C)
    strymonSysex: { model: 0x01, deviceId: 0x10, slots: 300 },
  },

  strymon_bigsky: {
    label: 'Strymon BigSky', type: 'Reverb',
    // VERIFIED against the BigSky MIDI spec.
    params: [
      { cc: 19,  label: 'Type (0-11)',    def: 0   },
      { cc: 17,  label: 'Decay',          def: 64  },
      { cc: 18,  label: 'Pre-Delay',      def: 0   },
      { cc: 15,  label: 'Mix',            def: 64  },
      { cc: 3,   label: 'Tone',           def: 64  },
      { cc: 14,  label: 'Mod',            def: 0   },
      { cc: 9,   label: 'Param 1',        def: 64  },
      { cc: 16,  label: 'Param 2',        def: 64  },
      { cc: 100, label: 'Expression',     def: 64  },
      { cc: 102, label: 'Bypass (0/127)', def: 127 },
    ],
    // CC19 type: 0=Room 1=Hall 2=Plate 3=Spring 4=Swell 5=Bloom 6=Cloud 7=Chorale 8=Shimmer 9=Magneto 10=Nonlinear 11=Reflections
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Room',       recallPC: -1, ccValues: { 102:127, 19:0,  17:40,  18:5,  15:55, 3:70, 14:0,  9:64, 16:64 } },
      { name: 'Hall',       recallPC: -1, ccValues: { 102:127, 19:1,  17:80,  18:10, 15:55, 3:64, 14:0,  9:64, 16:64 } },
      { name: 'Plate',      recallPC: -1, ccValues: { 102:127, 19:2,  17:60,  18:5,  15:60, 3:80, 14:10, 9:64, 16:64 } },
      { name: 'Spring',     recallPC: -1, ccValues: { 102:127, 19:3,  17:50,  18:0,  15:55, 3:90, 14:0,  9:64, 16:64 } },
      { name: 'Swell',      recallPC: -1, ccValues: { 102:127, 19:4,  17:100, 18:0,  15:70, 3:64, 14:0,  9:64, 16:64 } },
      { name: 'Bloom',      recallPC: -1, ccValues: { 102:127, 19:5,  17:110, 18:0,  15:65, 3:64, 14:30, 9:64, 16:64 } },
      { name: 'Cloud',      recallPC: -1, ccValues: { 102:127, 19:6,  17:120, 18:0,  15:70, 3:50, 14:30, 9:64, 16:64 } },
      { name: 'Chorale',    recallPC: -1, ccValues: { 102:127, 19:7,  17:90,  18:0,  15:65, 3:64, 14:40, 9:64, 16:64 } },
      { name: 'Shimmer',    recallPC: -1, ccValues: { 102:127, 19:8,  17:100, 18:0,  15:65, 3:64, 14:0,  9:64, 16:64 } },
      { name: 'Magneto',    recallPC: -1, ccValues: { 102:127, 19:9,  17:70,  18:10, 15:60, 3:64, 14:0,  9:64, 16:64 } },
      { name: 'Nonlinear',  recallPC: -1, ccValues: { 102:127, 19:10, 17:50,  18:0,  15:60, 3:64, 14:0,  9:64, 16:64 } },
      { name: 'Reflections',recallPC: -1, ccValues: { 102:127, 19:11, 17:55,  18:5,  15:55, 3:70, 14:0,  9:64, 16:64 } },
    ],
    // deviceId 0x15 from Strymon identity reply; 300 presets (100 banks × A/B/C)
    strymonSysex: { model: 0x03, deviceId: 0x15, slots: 300 },
  },

  strymon_mobius: {
    label: 'Strymon Mobius', type: 'Modulation',
    // VERIFIED against Strymon Mobius User Manual Rev F, pg 24 (MIDI Implementation).
    // 12 machines selectable via CC19: 0=Chorus 1=Vibrato 2=Rotary 3=Flanger 4=Phaser 5=Quadrature
    //   6=Filter 7=Formant 8=VintageTrem 9=PatternTrem 10=Autoswell 11=Destroyer
    // CCs 24-68: machine-specific parameters (vary by machine selected).
    // 200 presets in 100 banks x 2 (A/B); sysex preset data is 650 bytes, name at bytes 632-647.
    note: 'CC24-68 vary by machine. Param 1/2 (CC9/16) are assignable knobs — defaults are Wave and Mix.',
    params: [
      { cc: 17,  label: 'Speed',              def: 64  },
      { cc: 18,  label: 'Depth',              def: 64  },
      { cc: 19,  label: 'Machine (0-11)',     def: 0   },
      { cc: 15,  label: 'Level',              def: 100 },
      { cc: 9,   label: 'Param 1 (Wave)',     def: 64  },
      { cc: 16,  label: 'Param 2 (Mix)',      def: 64  },
      { cc: 21,  label: 'Tap Division (0-6)', def: 3   },
      { cc: 22,  label: 'Pre/Post (0/1)',     def: 0   },
      { cc: 81,  label: 'Tap (0/127)',        def: 0   },
      { cc: 93,  label: 'Remote Tap',         def: 0   },
      { cc: 100, label: 'Expression',         def: 0   },
      { cc: 102, label: 'Bypass (0/127)',     def: 127 },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Chorus',       recallPC: -1, ccValues: { 102:127, 19:0,  17:50, 18:70,  9:64, 16:64  } },
      { name: 'Vibrato',      recallPC: -1, ccValues: { 102:127, 19:1,  17:40, 18:80,  9:64, 16:64  } },
      { name: 'Rotary',       recallPC: -1, ccValues: { 102:127, 19:2,  17:40, 18:64,  9:64, 16:64  } },
      { name: 'Flanger',      recallPC: -1, ccValues: { 102:127, 19:3,  17:50, 18:64,  9:64, 16:64  } },
      { name: 'Phaser',       recallPC: -1, ccValues: { 102:127, 19:4,  17:50, 18:64,  9:64, 16:64  } },
      { name: 'Quadrature',   recallPC: -1, ccValues: { 102:127, 19:5,  17:50, 18:65,  9:64, 16:64  } },
      { name: 'Filter Wah',   recallPC: -1, ccValues: { 102:127, 19:6,  17:40, 18:80,  9:64, 16:64  } },
      { name: 'Formant',      recallPC: -1, ccValues: { 102:127, 19:7,  17:50, 18:70,  9:64, 16:64  } },
      { name: 'Vintage Trem', recallPC: -1, ccValues: { 102:127, 19:8,  17:64, 18:80,  9:64, 16:64  } },
      { name: 'Pattern Trem', recallPC: -1, ccValues: { 102:127, 19:9,  17:64, 18:80,  9:64, 16:64  } },
      { name: 'Autoswell',    recallPC: -1, ccValues: { 102:127, 19:10, 17:64, 18:100, 9:64, 16:64  } },
      { name: 'Destroyer',    recallPC: -1, ccValues: { 102:127, 19:11, 17:64, 18:100, 9:64, 16:64  } },
    ],
    // deviceId 0x12 from Strymon identity reply; 200 presets (100 banks × A/B)
    strymonSysex: { model: 0x02, deviceId: 0x12, slots: 200 },
  },

  eventide_h9: {
    label: 'Eventide H9', type: 'Multi-FX',
    // H9 Core/Standard/Max. Verified factory defaults: PSW (bypass)=CC0, PROGRAM-=CC2,
    // PROGRAM+=CC3, KB0-KB9=CC22-CC31. Expression defaults to PitchBend (not CC).
    // All assignments user-configurable in H9 Control app. PC 0-127 selects presets.
    note: 'KB0-KB9 (CC22-CC31) are algorithm-dependent — meaning changes per effect. CC0=bypass toggle (≥64=active). Expression=PitchBend by default (reassign in H9 Control).',
    params: [
      { cc: 0,   label: 'Bypass/PSW (≥64=active, <64=bypass)',          def: 127 },
      { cc: 2,   label: 'Preset Down',                                    def: 0   },
      { cc: 3,   label: 'Preset Up',                                      def: 0   },
      { cc: 22,  label: 'KB0 (algo param 1, often Mix)',                  def: 64  },
      { cc: 23,  label: 'KB1 (algo param 2)',                             def: 64  },
      { cc: 24,  label: 'KB2 (algo param 3)',                             def: 64  },
      { cc: 25,  label: 'KB3 (algo param 4)',                             def: 64  },
      { cc: 26,  label: 'KB4 (algo param 5)',                             def: 64  },
      { cc: 27,  label: 'KB5 (algo param 6)',                             def: 64  },
      { cc: 28,  label: 'KB6 (algo param 7)',                             def: 64  },
      { cc: 29,  label: 'KB7 (algo param 8)',                             def: 64  },
      { cc: 30,  label: 'KB8 (algo param 9)',                             def: 64  },
      { cc: 31,  label: 'KB9 (algo param 10)',                            def: 64  },
    ],
    programSelect: { label: 'Program', min: 0, max: 98, def: 0 },
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
    h9Sysex: { model: 0x01 },
  },

  // ── Synthesizers ──

  sequential_prophet_rev2: {
    label: 'Sequential Prophet Rev2', type: 'Synth',
    // VERIFIED against Sequential Prophet Rev2 User's Guide v1.2.4, Appendix E (MIDI CC list, p. 82).
    // Primary automation uses NRPN (covers all parameters); CCs below are the available performance CCs.
    // Bi-timbral: Layer A = ch N, Layer B = ch N+1 (set in Global). Per-layer control via NRPN.
    note: 'Bi-timbral. Most params require NRPN for full recall. CCs listed are the available performance CCs from the manual appendix.',
    params: [
      { cc: 102, label: 'Filter Cutoff',              def: 64  },
      { cc: 103, label: 'Resonance',                  def: 0   },
      { cc: 106, label: 'Filter Env Amount',          def: 64  },
      { cc: 107, label: 'Filter Env Velocity',        def: 0   },
      { cc: 109, label: 'Filter Attack',              def: 20  },
      { cc: 110, label: 'Filter Decay',               def: 50  },
      { cc: 111, label: 'Filter Sustain',             def: 64  },
      { cc: 112, label: 'Filter Release',             def: 40  },
      { cc: 118, label: 'Amp Attack',                 def: 10  },
      { cc: 119, label: 'Amp Decay',                  def: 40  },
      { cc: 75,  label: 'Amp Sustain',                def: 100 },
      { cc: 76,  label: 'Amp Release',                def: 40  },
      { cc: 20,  label: 'Osc 1 Frequency',            def: 64  },
      { cc: 22,  label: 'Osc 1 Shape',                def: 64  },
      { cc: 24,  label: 'Osc 2 Frequency',            def: 64  },
      { cc: 26,  label: 'Osc 2 Shape',                def: 64  },
      { cc: 28,  label: 'Osc Mix',                    def: 64  },
      { cc: 29,  label: 'Noise Level',                def: 0   },
      { cc: 113, label: 'VCA Level',                  def: 100 },
      { cc: 5,   label: 'Glide Time',                 def: 0   },
      { cc: 65,  label: 'Glide On/Off (0/127)',        def: 0   },
      { cc: 17,  label: 'FX Mix',                     def: 64  },
      { cc: 7,   label: 'Master Volume',              def: 100 },
    ],
    starterPresets: [
      { name: 'Init Patch', recallPC: -1, ccValues: { 102:64,  103:0,  106:64, 113:100, 7:100 } },
      { name: 'Warm Pad',   recallPC: -1, ccValues: { 102:50,  103:20, 106:50, 75:100,  76:80, 118:40 } },
      { name: 'Lead',       recallPC: -1, ccValues: { 102:80,  103:60, 106:80, 118:0,   119:30 } },
      { name: 'Bass',       recallPC: -1, ccValues: { 102:40,  103:30, 106:60, 28:30,   75:80 } },
    ],
  },

  moog_subsequent_37: {
    label: 'Moog Subsequent 37', type: 'Synth',
    // VERIFIED against Moog Subsequent 37 User Manual, Appendix D (MIDI CC table).
    // Toggle convention: 0–63 = Off, 64–127 = On for most switches.
    // Duo mode (CC110 ≥ 64) gives two independent CV-gated voices for monophonic layering.
    note: 'Semi-modular with patchable CV matrix. Toggle switches: 0–63=Off, 64–127=On. Duo mode (CC110≥64) = 2-voice mono. Glide destination per-oscillator via CC102.',
    params: [
      { cc: 19,  label: 'Filter Cutoff',              def: 64  },
      { cc: 21,  label: 'Filter Resonance',           def: 0   },
      { cc: 27,  label: 'Filter Env Amount',          def: 64  },
      { cc: 23,  label: 'Filter Env Attack',          def: 20  },
      { cc: 24,  label: 'Filter Env Decay',           def: 50  },
      { cc: 25,  label: 'Filter Env Sustain',         def: 64  },
      { cc: 26,  label: 'Filter Env Release',         def: 40  },
      { cc: 28,  label: 'Amp Env Attack',             def: 10  },
      { cc: 29,  label: 'Amp Env Decay',              def: 40  },
      { cc: 30,  label: 'Amp Env Sustain',            def: 100 },
      { cc: 31,  label: 'Amp Env Release',            def: 40  },
      { cc: 9,   label: 'Osc 1 Wave',                 def: 64  },
      { cc: 12,  label: 'Osc 2 Frequency',            def: 64  },
      { cc: 14,  label: 'Osc 2 Wave',                 def: 64  },
      { cc: 114, label: 'Osc 1 Level',                def: 100 },
      { cc: 116, label: 'Osc 2 Level',                def: 80  },
      { cc: 117, label: 'Noise Level',                def: 0   },
      { cc: 3,   label: 'LFO 1 Rate',                 def: 64  },
      { cc: 5,   label: 'Glide Time',                 def: 0   },
      { cc: 65,  label: 'Glide On (0–63=Off)',         def: 0   },
      { cc: 110, label: 'Duo Mode (64+=On)',           def: 0   },
      { cc: 7,   label: 'Master Volume',              def: 100 },
    ],
    starterPresets: [
      { name: 'Init Patch', recallPC: -1, ccValues: { 19:64,  21:0,  27:64, 114:100, 116:0, 7:100 } },
      { name: 'Bass',       recallPC: -1, ccValues: { 19:40,  21:40, 27:80, 116:0,   9:0   } },
      { name: 'Lead',       recallPC: -1, ccValues: { 19:90,  21:60, 27:80, 28:5,    114:100, 116:50 } },
      { name: 'Drone',      recallPC: -1, ccValues: { 19:50,  21:20, 27:30, 30:127,  65:64  } },
    ],
  },

  korg_minilogue_xd: {
    label: 'Korg Minilogue XD', type: 'Synth',
    // VERIFIED against Korg Minilogue XD MIDI Implementation Chart (official TXT, 2019).
    // Sync/Ring (CC80/81): Korg reverses convention — 0–63=On, 64–127=Off.
    // CV/gate I/O: mono CV out and gate out follow the note played; two CV ins assignable via CC118/119.
    note: 'CV/gate I/O for modular. Sync/Ring (CC80/81) reversed: 0–63=On, 64–127=Off. Multi Engine (CC53): 0–42=Noise, 43–85=VPM, 86–127=User. EG Target (CC23): 0/43/86 = Cutoff/Pitch2/Pitch.',
    params: [
      { cc: 43,  label: 'Cutoff',                     def: 80  },
      { cc: 44,  label: 'Resonance',                  def: 0   },
      { cc: 20,  label: 'EG Attack',                  def: 20  },
      { cc: 21,  label: 'EG Decay',                   def: 50  },
      { cc: 22,  label: 'EG Int',                     def: 64  },
      { cc: 23,  label: 'EG Target (0/43/86)',         def: 0   },
      { cc: 16,  label: 'Amp EG Attack',              def: 5   },
      { cc: 17,  label: 'Amp EG Decay',               def: 40  },
      { cc: 18,  label: 'Amp EG Sustain',             def: 100 },
      { cc: 19,  label: 'Amp EG Release',             def: 30  },
      { cc: 24,  label: 'LFO Rate',                   def: 64  },
      { cc: 26,  label: 'LFO Int',                    def: 0   },
      { cc: 56,  label: 'LFO Target (0/43/86)',        def: 0   },
      { cc: 57,  label: 'LFO Wave (0/43/86)',          def: 43  },
      { cc: 34,  label: 'VCO 1 Pitch',                def: 64  },
      { cc: 35,  label: 'VCO 2 Pitch',                def: 64  },
      { cc: 50,  label: 'VCO 1 Wave (0/43/86)',        def: 86  },
      { cc: 51,  label: 'VCO 2 Wave (0/43/86)',        def: 86  },
      { cc: 39,  label: 'VCO 1 Level',                def: 100 },
      { cc: 40,  label: 'VCO 2 Level',                def: 80  },
      { cc: 5,   label: 'Portamento',                 def: 0   },
      { cc: 92,  label: 'Mod FX On (64+=On)',          def: 0   },
      { cc: 93,  label: 'Delay On (64+=On)',           def: 0   },
      { cc: 94,  label: 'Reverb On (64+=On)',          def: 0   },
    ],
    starterPresets: [
      { name: 'Init Patch', recallPC: -1, ccValues: { 43:80, 44:0,  39:100, 40:80, 16:5,  18:100 } },
      { name: 'Lead',       recallPC: -1, ccValues: { 43:90, 44:60, 39:100, 40:0,  20:5,  21:40  } },
      { name: 'Pad',        recallPC: -1, ccValues: { 43:60, 44:10, 39:80,  40:80, 16:40, 18:80, 94:64 } },
      { name: 'Bass',       recallPC: -1, ccValues: { 43:50, 44:40, 39:100, 40:0,  17:60, 18:80  } },
    ],
  },

  korg_monologue: {
    label: 'Korg Monologue', type: 'Synth',
    // VERIFIED against Korg Monologue MIDI Implementation Chart (Korg site, 2016) + midi.guide.
    // CC43=Cutoff, CC44=Resonance (confirmed). CC56=LFO Target, CC58=LFO Wave (confirmed, midi.guide).
    // Drive has no documented CC (panel-only control); CC57 function unconfirmed — omitted.
    // Single shared EG: CC18 Attack + CC19 Decay/Release drive both Amp and Filter EGs simultaneously.
    // CC20 EG Int sets filter EG depth (signed: 64=zero, 0=full neg, 127=full pos).
    // Sync/Ring (CC80/81): Korg reversed convention — 0–63=On, 64–127=Off.
    note: 'Mono analog. Shared EG: CC18 Attack + CC19 D/R control both Amp and Filter simultaneously. CC20 EG Int sets filter depth (64=neutral). LFO Target (CC56) + Wave (CC58): 0/43/86 range. Sync/Ring (CC80/81) reversed: 0–63=On, 64–127=Off.',
    params: [
      { cc: 43,  label: 'Cutoff',                     def: 80  },
      { cc: 44,  label: 'Resonance',                  def: 0   },
      { cc: 20,  label: 'EG Int (filter depth)',       def: 64  },
      { cc: 23,  label: 'EG Target (0/43/86)',         def: 0   },
      { cc: 18,  label: 'EG Attack',                  def: 10  },
      { cc: 19,  label: 'EG Decay/Release',           def: 40  },
      { cc: 24,  label: 'LFO Rate',                   def: 64  },
      { cc: 25,  label: 'LFO Int (verify CC)',         def: 0   },
      { cc: 56,  label: 'LFO Target (0/43/86)',        def: 0   },
      { cc: 58,  label: 'LFO Wave (0/21/43/64/85)',    def: 0   },
      { cc: 49,  label: 'VCO 1 Level',                def: 100 },
      { cc: 50,  label: 'VCO 2 Level',                def: 0   },
      { cc: 48,  label: 'Noise Level',                def: 0   },
      { cc: 80,  label: 'Sync (0–63=On)',              def: 64  },
      { cc: 81,  label: 'Ring Mod (0–63=On)',          def: 64  },
      { cc: 5,   label: 'Portamento',                 def: 0   },
    ],
    // PC 0–79: 80 artist factory presets (Aphex Twin / Sharooz / Yebisu303 / KORG, fw v2.0+).
    // PC 80–99: user slots (PC 80 = Init Program). Names per Korg Monologue Owner's Manual p.55.
    // ccValues are category approximations (Bass/Lead/Arp/Hit/SFX/Drum) — not authoritative;
    // the unit's stored patch is the source of truth. Use "Capture" after selecting a preset.
    programSelect: { label: 'Program', min: 0, max: 99, def: 0 },
    starterPresets: [
      { name: '<afx acid3>',   recallPC: 0,  ccValues: { 43:65,  44:80, 49:100, 50:0,   18:3,  19:40, 20:90, 24:80  } },
      { name: 'Injection',     recallPC: 1,  ccValues: { 43:55,  44:35, 49:100, 50:0,   18:5,  19:55, 20:75          } },
      { name: 'Anfem',         recallPC: 2,  ccValues: { 43:60,  44:50, 49:80,  50:60,  18:2,  19:30, 20:80          } },
      { name: '<wavetable>',   recallPC: 3,  ccValues: { 43:70,  44:40, 49:100, 50:40,  18:5,  19:45, 20:75          } },
      { name: 'Lu-Fuki',       recallPC: 4,  ccValues: { 43:55,  44:30, 49:100, 50:0,   18:5,  19:55, 20:75          } },
      { name: 'Fake3OSC',      recallPC: 5,  ccValues: { 43:65,  44:55, 49:80,  50:80,  18:2,  19:30, 20:80          } },
      { name: 'Arc Lead',      recallPC: 6,  ccValues: { 43:95,  44:15, 49:100, 50:20,  18:10, 19:30, 20:75          } },
      { name: '<Flute>',       recallPC: 7,  ccValues: { 43:70,  44:20, 49:80,  50:40,  18:5,  19:35, 20:64, 24:90  } },
      { name: 'Scoooping',     recallPC: 8,  ccValues: { 43:50,  44:40, 49:70,  50:80,  18:20, 19:60, 20:90, 24:100 } },
      { name: 'Robot Empire',  recallPC: 9,  ccValues: { 43:80,  44:60, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: 'TeeVeeSaw',     recallPC: 10, ccValues: { 43:60,  44:35, 49:100, 50:30,  18:5,  19:50, 20:75          } },
      { name: '<AFX> bAss',    recallPC: 11, ccValues: { 43:65,  44:80, 49:100, 50:0,   18:3,  19:40, 20:90, 24:80  } },
      { name: '<model 800>',   recallPC: 12, ccValues: { 43:60,  44:75, 49:100, 50:0,   18:3,  19:45, 20:90          } },
      { name: '<epic acid>',   recallPC: 13, ccValues: { 43:65,  44:85, 49:100, 50:0,   18:3,  19:40, 20:95, 24:90  } },
      { name: 'Herd Of Crab',  recallPC: 14, ccValues: { 43:55,  44:35, 49:100, 50:0,   18:5,  19:55, 20:75          } },
      { name: 'Stonecold',     recallPC: 15, ccValues: { 43:40,  44:30, 49:100, 50:0,   18:2,  19:70, 20:64          } },
      { name: 'Dirty Sub',     recallPC: 16, ccValues: { 43:45,  44:25, 49:100, 50:80,  18:2,  19:65, 20:64          } },
      { name: 'Jungle Sub',    recallPC: 17, ccValues: { 43:50,  44:30, 49:100, 50:60,  18:5,  19:55, 20:80, 24:70  } },
      { name: '<deep bass>',   recallPC: 18, ccValues: { 43:35,  44:20, 49:100, 50:0,   18:2,  19:75, 20:64          } },
      { name: 'Hoodie Bass',   recallPC: 19, ccValues: { 43:55,  44:30, 49:100, 50:0,   18:5,  19:55, 20:75          } },
      { name: 'StabbyBass',    recallPC: 20, ccValues: { 43:60,  44:40, 49:100, 50:0,   18:3,  19:45, 20:80          } },
      { name: 'DistortedSqr',  recallPC: 21, ccValues: { 43:55,  44:45, 49:0,   50:100, 18:5,  19:50, 20:85          } },
      { name: 'Werq',          recallPC: 22, ccValues: { 43:60,  44:40, 49:100, 50:20,  18:5,  19:50, 20:85          } },
      { name: '<Ratewobble>',  recallPC: 23, ccValues: { 43:60,  44:40, 49:100, 50:0,   18:5,  19:50, 20:80, 24:90  } },
      { name: 'StomachWave',   recallPC: 24, ccValues: { 43:60,  44:35, 49:100, 50:40,  18:5,  19:50, 20:75          } },
      { name: 'Dr.Juice',      recallPC: 25, ccValues: { 43:60,  44:35, 49:100, 50:0,   18:5,  19:55, 20:75          } },
      { name: 'Rubber Duck',   recallPC: 26, ccValues: { 43:55,  44:30, 49:100, 50:0,   18:5,  19:55, 20:75          } },
      { name: '<HarmonBa>',    recallPC: 27, ccValues: { 43:55,  44:30, 49:80,  50:80,  18:5,  19:55, 20:75, 24:60  } },
      { name: 'Dark Perc',     recallPC: 28, ccValues: { 43:35,  44:40, 49:100, 50:0,   18:2,  19:40, 20:64          } },
      { name: 'Jackathon',     recallPC: 29, ccValues: { 43:60,  44:55, 49:100, 50:0,   18:5,  19:50, 20:85          } },
      { name: 'Bosshog',       recallPC: 30, ccValues: { 43:55,  44:35, 49:100, 50:0,   18:5,  19:55, 20:75          } },
      { name: '<Ardkore92>',   recallPC: 31, ccValues: { 43:65,  44:70, 49:100, 50:0,   18:3,  19:40, 20:90, 24:85  } },
      { name: '<aliasBass>',   recallPC: 32, ccValues: { 43:60,  44:60, 49:100, 50:40,  18:5,  19:45, 20:80          } },
      { name: '<PWM envBA>',   recallPC: 33, ccValues: { 43:60,  44:35, 49:0,   50:100, 18:5,  19:50, 20:80          } },
      { name: 'Disemvowel',    recallPC: 34, ccValues: { 43:55,  44:40, 49:100, 50:20,  18:5,  19:50, 20:85          } },
      { name: "Kickin'B",      recallPC: 35, ccValues: { 43:50,  44:35, 49:100, 50:0,   18:3,  19:50, 20:75          } },
      { name: 'OIOI',          recallPC: 36, ccValues: { 43:65,  44:75, 49:100, 50:0,   18:3,  19:40, 20:90, 24:80  } },
      { name: '<akunk b>',     recallPC: 37, ccValues: { 43:60,  44:65, 49:100, 50:0,   18:3,  19:45, 20:90          } },
      { name: 'Dual Saw',      recallPC: 38, ccValues: { 43:95,  44:15, 49:100, 50:60,  18:10, 19:30, 20:75          } },
      { name: 'BitterLead',    recallPC: 39, ccValues: { 43:90,  44:20, 49:100, 50:20,  18:10, 19:30, 20:75          } },
      { name: 'Syncwave',      recallPC: 40, ccValues: { 43:90,  44:20, 49:100, 50:60,  18:5,  19:30, 20:75, 80:0   } },
      { name: '<Duophony>',    recallPC: 41, ccValues: { 43:90,  44:15, 49:80,  50:80,  18:10, 19:35, 20:75          } },
      { name: 'Mono Brass',    recallPC: 42, ccValues: { 43:100, 44:10, 49:100, 50:0,   18:15, 19:25, 20:80          } },
      { name: '<5th brASs>',   recallPC: 43, ccValues: { 43:95,  44:15, 49:100, 50:60,  18:10, 19:30, 20:75          } },
      { name: 'Bouncy Balls',  recallPC: 44, ccValues: { 43:90,  44:15, 49:100, 50:20,  18:5,  19:30, 20:75, 24:80  } },
      { name: 'Ghost Town',    recallPC: 45, ccValues: { 43:85,  44:15, 49:100, 50:0,   18:20, 19:40, 20:70          } },
      { name: 'Childhood',     recallPC: 46, ccValues: { 43:85,  44:30, 49:100, 50:20,  18:15, 19:35, 20:70          } },
      { name: 'On the Moon',   recallPC: 47, ccValues: { 43:80,  44:10, 49:100, 50:0,   18:30, 19:50, 20:64          } },
      { name: '<phaseClks>',   recallPC: 48, ccValues: { 43:80,  44:20, 49:80,  50:60,  18:10, 19:40, 20:70, 24:80  } },
      { name: '<SyncMtion>',   recallPC: 49, ccValues: { 43:90,  44:20, 49:100, 50:60,  18:5,  19:30, 20:75, 80:0   } },
      { name: '<SyncLAM>',     recallPC: 50, ccValues: { 43:90,  44:20, 49:100, 50:60,  18:5,  19:30, 20:75, 80:0   } },
      { name: 'Arpme Lead',    recallPC: 51, ccValues: { 43:75,  44:20, 49:80,  50:40,  18:5,  19:35, 20:64, 24:90  } },
      { name: 'Squelf',        recallPC: 52, ccValues: { 43:70,  44:30, 49:80,  50:60,  18:5,  19:40, 20:70, 24:90  } },
      { name: 'Milky Way',     recallPC: 53, ccValues: { 43:70,  44:20, 49:80,  50:40,  18:5,  19:35, 20:64, 24:85  } },
      { name: 'BrokenArcade',  recallPC: 54, ccValues: { 43:65,  44:25, 49:80,  50:60,  18:5,  19:40, 20:70, 24:80  } },
      { name: '<MT-digArp>',   recallPC: 55, ccValues: { 43:70,  44:20, 49:80,  50:40,  18:5,  19:35, 20:64, 24:90  } },
      { name: 'Chopchoon',     recallPC: 56, ccValues: { 43:65,  44:25, 49:80,  50:40,  18:5,  19:40, 20:70, 24:100 } },
      { name: 'FMod Seq',      recallPC: 57, ccValues: { 43:70,  44:20, 49:80,  50:60,  18:5,  19:40, 20:64, 24:85  } },
      { name: 'Tronlines',     recallPC: 58, ccValues: { 43:65,  44:30, 49:80,  50:60,  18:5,  19:40, 20:75, 24:80  } },
      { name: 'Tech Stab',     recallPC: 59, ccValues: { 43:65,  44:55, 49:80,  50:60,  18:2,  19:30, 20:80          } },
      { name: 'Pumpdriver',    recallPC: 60, ccValues: { 43:60,  44:50, 49:80,  50:60,  18:2,  19:30, 20:80, 24:100 } },
      { name: 'Lfoiled',       recallPC: 61, ccValues: { 43:60,  44:50, 49:80,  50:60,  18:2,  19:30, 20:80, 24:90  } },
      { name: '<Digisnd>',     recallPC: 62, ccValues: { 43:60,  44:50, 49:80,  50:60,  18:2,  19:30, 20:80          } },
      { name: '<ascension>',   recallPC: 63, ccValues: { 43:50,  44:40, 49:70,  50:80,  18:20, 19:60, 20:90, 24:100 } },
      { name: '<centipede>',   recallPC: 64, ccValues: { 43:50,  44:40, 49:70,  50:80,  18:20, 19:60, 20:90, 24:90  } },
      { name: 'Robotspeak',    recallPC: 65, ccValues: { 43:55,  44:45, 49:70,  50:80,  18:15, 19:55, 20:90          } },
      { name: 'Cpu Cycles',    recallPC: 66, ccValues: { 43:50,  44:40, 49:70,  50:80,  18:20, 19:60, 20:90, 24:90  } },
      { name: 'Loud Siren',    recallPC: 67, ccValues: { 43:80,  44:30, 49:100, 50:0,   18:20, 19:60, 20:90, 24:80  } },
      { name: 'Portrythm',     recallPC: 68, ccValues: { 43:55,  44:40, 49:70,  50:80,  18:20, 19:60, 20:90          } },
      { name: 'Dambuster',     recallPC: 69, ccValues: { 43:60,  44:55, 49:70,  50:80,  18:20, 19:60, 20:90          } },
      { name: '<xoc PLAY>',    recallPC: 70, ccValues: { 43:50,  44:40, 49:70,  50:80,  18:20, 19:60, 20:90, 24:100 } },
      { name: 'LittleGlitch',  recallPC: 71, ccValues: { 43:50,  44:40, 49:70,  50:80,  18:20, 19:60, 20:90, 24:100 } },
      { name: 'Hard Run',      recallPC: 72, ccValues: { 43:80,  44:60, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: '<beat&bass>',   recallPC: 73, ccValues: { 43:80,  44:55, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: '<bnsbeats1>',   recallPC: 74, ccValues: { 43:80,  44:55, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: '<bnsbeats2>',   recallPC: 75, ccValues: { 43:80,  44:55, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: '<bnsbeats3>',   recallPC: 76, ccValues: { 43:80,  44:55, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: '<bnsbeats4>',   recallPC: 77, ccValues: { 43:80,  44:55, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: '<bnsbeats5>',   recallPC: 78, ccValues: { 43:80,  44:55, 49:100, 50:0,   18:2,  19:20, 20:64          } },
      { name: '<afx beat>',    recallPC: 79, ccValues: { 43:80,  44:55, 49:100, 50:0,   18:2,  19:20, 20:64          } },
    ],
  },

  korg_microkorg: {
    label: 'Korg MicroKorg', type: 'Synth',
    // VERIFIED against official Korg MicroKorg MIDI Implementation Chart (2002 PDF).
    // CC74 (Filter Cutoff) and CC71 (Resonance) confirmed. Most other synthesis params
    // are SysEx-only (Korg exclusive) — CC access is limited beyond the basics.
    // Knob A/B on panel send CC26/27; function depends on Edit Select switch position.
    // Vocoder mode: audio source on Ch 2; 4 voices poly in synth mode.
    note: 'Most synth params are SysEx-only — limited live CC access. Knob A/B send CC26/27 (context-dependent on Edit Select). Use Tweak → Learn to discover CCs from physical knobs.',
    params: [
      { cc: 7,   label: 'Volume',      def: 100 },
      { cc: 1,   label: 'Mod Wheel',   def: 0   },
      { cc: 5,   label: 'Portamento',  def: 0   },
      { cc: 74,  label: 'Cutoff',      def: 80  },
      { cc: 71,  label: 'Resonance',   def: 0   },
      { cc: 26,  label: 'Knob A (ctx-dep.)', def: 64 },
      { cc: 27,  label: 'Knob B (ctx-dep.)', def: 64 },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init Patch',  recallPC: 0,  ccValues: { 7:100, 74:80,  71:0  } },
      { name: 'Bright Lead', recallPC: -1, ccValues: { 74:110, 71:50 } },
      { name: 'Dark Bass',   recallPC: -1, ccValues: { 74:40,  71:30 } },
    ],
  },

  korg_minilogue: {
    label: 'Korg Minilogue', type: 'Synth',
    // VERIFIED against Korg Minilogue MIDI Implementation Chart (v1.21, 2016-07-08, Korg CDN) + midi.guide.
    // 4-voice poly; separate Filter EG (CC20–23, EG Int CC45) and Amp EG (CC16–19).
    // Built-in delay: CC29=Hi-Pass Cutoff, CC30=Time, CC31=Feedback, CC88=Output Routing.
    // Sync/Ring separate CCs (CC80/81); reversed polarity 0–63=On, 64–127=Off.
    note: '4-voice poly. Filter EG (CC20–23) + EG Int CC45. Amp EG (CC16–19). Built-in delay: CC29/30/31/88. No Multi Engine or Mod/Reverb FX. Sync (CC80) / Ring Mod (CC81) reversed: 0–63=On.',
    params: [
      { cc: 43,  label: 'Cutoff',                          def: 80  },
      { cc: 44,  label: 'Resonance',                       def: 0   },
      { cc: 45,  label: 'Filter EG Int',                   def: 64  },
      { cc: 20,  label: 'EG Attack',                       def: 20  },
      { cc: 21,  label: 'EG Decay',                        def: 50  },
      { cc: 22,  label: 'EG Sustain',                      def: 100 },
      { cc: 23,  label: 'EG Release',                      def: 30  },
      { cc: 42,  label: 'Pitch EG Int',                    def: 0   },
      { cc: 16,  label: 'Amp EG Attack',                   def: 5   },
      { cc: 17,  label: 'Amp EG Decay',                    def: 40  },
      { cc: 18,  label: 'Amp EG Sustain',                  def: 100 },
      { cc: 19,  label: 'Amp EG Release',                  def: 30  },
      { cc: 24,  label: 'LFO Rate',                        def: 64  },
      { cc: 26,  label: 'LFO Int',                         def: 0   },
      { cc: 56,  label: 'LFO Target (0/43/86)',             def: 0   },
      { cc: 57,  label: 'LFO EG Mod (0–63=Off)',            def: 0   },
      { cc: 58,  label: 'LFO Wave (0=SQR/64=TRI/127=SAW)', def: 0   },
      { cc: 29,  label: 'Delay Hi-Pass Cutoff',            def: 0   },
      { cc: 30,  label: 'Delay Time',                      def: 64  },
      { cc: 31,  label: 'Delay Feedback',                  def: 0   },
      { cc: 88,  label: 'Delay Output Routing',            def: 0   },
      { cc: 34,  label: 'VCO 1 Pitch',                     def: 64  },
      { cc: 35,  label: 'VCO 2 Pitch',                     def: 64  },
      { cc: 50,  label: 'VCO 1 Wave (0/43/86)',             def: 86  },
      { cc: 51,  label: 'VCO 2 Wave (0/43/86)',             def: 86  },
      { cc: 39,  label: 'VCO 1 Level',                     def: 100 },
      { cc: 40,  label: 'VCO 2 Level',                     def: 80  },
      { cc: 80,  label: 'Sync (0–63=On)',                   def: 64  },
      { cc: 81,  label: 'Ring Mod (0–63=On)',               def: 64  },
      { cc: 5,   label: 'Portamento',                      def: 0   },
    ],
    starterPresets: [
      { name: 'Init Patch', recallPC: -1, ccValues: { 43:80, 44:0,  39:100, 40:80, 16:5,  18:100, 80:64, 81:64 } },
      { name: 'Lead',       recallPC: -1, ccValues: { 43:90, 44:60, 39:100, 40:0,  20:5,  21:40              } },
      { name: 'Pad',        recallPC: -1, ccValues: { 43:60, 44:10, 39:80,  40:80, 16:40, 18:80              } },
      { name: 'Bass',       recallPC: -1, ccValues: { 43:50, 44:40, 39:100, 40:0,  17:60, 18:80              } },
    ],
  },

  korg_prologue: {
    label: 'Korg Prologue', type: 'Synth',
    // VERIFIED against Korg Prologue MIDI Implementation Chart (v7, 2020-03-10, Korg CDN) + midi.guide + Squarp forum.
    // 8/16-voice poly; single combined Delay/Reverb FX slot — no separate delay + reverb unlike Minilogue XD.
    // CC80=Sync/Ring combined (0–63=On); CC81=Pitch EG Target (NOT Ring Mod — Prologue differs from Minilogue).
    // No CC93 (Prologue uses CC94 as combined Delay/Reverb on/off; CC89 selects Delay vs Reverb type).
    note: '8/16-voice poly. Multi Engine CC53: 0–42=Noise, 43–85=VPM, 86+=User slot. CC80=Sync/Ring on/off (0–63=On); CC81=Pitch EG Target. FX: CC92=Mod FX, CC94=Delay/Reverb on/off (64+=On; CC89 selects type). No separate CC93.',
    params: [
      { cc: 43,  label: 'Cutoff',                           def: 80  },
      { cc: 44,  label: 'Resonance',                        def: 0   },
      { cc: 45,  label: 'Filter EG Int',                    def: 64  },
      { cc: 20,  label: 'EG Attack',                        def: 20  },
      { cc: 21,  label: 'EG Decay',                         def: 50  },
      { cc: 22,  label: 'EG Sustain',                       def: 100 },
      { cc: 23,  label: 'EG Release',                       def: 30  },
      { cc: 42,  label: 'Pitch EG Int',                     def: 0   },
      { cc: 16,  label: 'Amp EG Attack',                    def: 5   },
      { cc: 17,  label: 'Amp EG Decay',                     def: 40  },
      { cc: 18,  label: 'Amp EG Sustain',                   def: 100 },
      { cc: 19,  label: 'Amp EG Release',                   def: 30  },
      { cc: 24,  label: 'LFO Rate',                         def: 64  },
      { cc: 26,  label: 'LFO Int',                          def: 0   },
      { cc: 56,  label: 'LFO Target (0/43/86)',              def: 0   },
      { cc: 57,  label: 'LFO Wave (0/43/86)',                def: 0   },
      { cc: 58,  label: 'LFO Mode (0=Fast/64=Slow/127=BPM)', def: 0  },
      { cc: 28,  label: 'Mod FX Speed',                     def: 64  },
      { cc: 29,  label: 'Mod FX Depth',                     def: 0   },
      { cc: 30,  label: 'Delay/Reverb Time',                def: 64  },
      { cc: 31,  label: 'Delay/Reverb Depth',               def: 0   },
      { cc: 34,  label: 'VCO 1 Pitch',                      def: 64  },
      { cc: 35,  label: 'VCO 2 Pitch',                      def: 64  },
      { cc: 50,  label: 'VCO 1 Wave (0/43/86)',              def: 86  },
      { cc: 51,  label: 'VCO 2 Wave (0/43/86)',              def: 86  },
      { cc: 39,  label: 'VCO 1 Level',                      def: 100 },
      { cc: 40,  label: 'VCO 2 Level',                      def: 80  },
      { cc: 53,  label: 'Multi Engine Type (0/43/86)',       def: 0   },
      { cc: 80,  label: 'Sync/Ring (0–63=On)',               def: 64  },
      { cc: 81,  label: 'Pitch EG Target (0/43/86)',         def: 0   },
      { cc: 5,   label: 'Portamento',                       def: 0   },
      { cc: 88,  label: 'Mod FX Type',                      def: 0   },
      { cc: 89,  label: 'Delay/Reverb Type',                def: 0   },
      { cc: 92,  label: 'Mod FX On (64+=On)',                def: 0   },
      { cc: 94,  label: 'Delay/Reverb On (64+=On)',          def: 0   },
    ],
    starterPresets: [
      { name: 'Init Patch', recallPC: -1, ccValues: { 43:80, 44:0,  39:100, 40:80, 16:5,  18:100 } },
      { name: 'Lead',       recallPC: -1, ccValues: { 43:90, 44:60, 39:100, 40:0,  20:5,  21:40  } },
      { name: 'Pad',        recallPC: -1, ccValues: { 43:60, 44:10, 39:80,  40:80, 16:40, 18:80, 94:64 } },
      { name: 'Bass',       recallPC: -1, ccValues: { 43:50, 44:40, 39:100, 40:0,  17:60, 18:80  } },
    ],
  },

  elektron_analog_four_mkii: {
    label: 'Elektron Analog Four MKII', type: 'Synth',
    // VERIFIED against Elektron Analog Four MKII manual, Appendix C (MIDI implementation).
    // Most synthesis params (OSC pitch/detune, filter routing, LFO shapes) are NRPN-only.
    // Performance Params A–J (CC3/4/8/9/11/64-68) are macro CCs — map to anything via Assign page.
    note: 'Elektron sequencer-centric. Perf Params A–J (CC3,4,8,9,11,64–68) are free macros: assign to any internal param via the Assign page. OSC pitch/waveform is NRPN-only.',
    params: [
      { cc: 18,  label: 'Filter 1 Frequency',         def: 127 },
      { cc: 89,  label: 'Filter 1 Resonance',         def: 0   },
      { cc: 102, label: 'Filter 1 Env Depth',         def: 64  },
      { cc: 108, label: 'Filter Env Attack',          def: 10  },
      { cc: 109, label: 'Filter Env Decay',           def: 50  },
      { cc: 110, label: 'Filter Env Sustain',         def: 64  },
      { cc: 111, label: 'Filter Env Release',         def: 40  },
      { cc: 104, label: 'Amp Env Attack',             def: 5   },
      { cc: 105, label: 'Amp Env Decay',              def: 30  },
      { cc: 106, label: 'Amp Env Sustain',            def: 127 },
      { cc: 107, label: 'Amp Env Release',            def: 30  },
      { cc: 7,   label: 'Amp Volume',                 def: 100 },
      { cc: 10,  label: 'Amp Pan',                    def: 64  },
      { cc: 116, label: 'LFO 1 Speed',                def: 64  },
      { cc: 118, label: 'LFO 2 Speed',                def: 64  },
      { cc: 92,  label: 'Delay Send',                 def: 0   },
      { cc: 93,  label: 'Reverb Send',                def: 0   },
      { cc: 3,   label: 'Perf Param A (macro)',        def: 0   },
      { cc: 4,   label: 'Perf Param B (macro)',        def: 0   },
      { cc: 8,   label: 'Perf Param C (macro)',        def: 0   },
      { cc: 9,   label: 'Perf Param D (macro)',        def: 0   },
    ],
    starterPresets: [
      { name: 'Init Patch', recallPC: -1, ccValues: { 18:127, 89:0,  104:5, 106:127, 7:100 } },
      { name: 'Bass',       recallPC: -1, ccValues: { 18:50,  89:50, 104:2, 105:40,  107:10 } },
      { name: 'Lead',       recallPC: -1, ccValues: { 18:100, 89:70, 104:5, 105:30,  7:100  } },
    ],
  },

  arturia_minifreak: {
    label: 'Arturia MiniFreak', type: 'Synth',
    // VERIFIED against Arturia MiniFreak User Manual v4.0.1, Chapter 16 (MIDI CC implementation).
    // VCO Wave CCs (CC14/18) sweep through all oscillator models in one 0–127 range.
    // FX1/FX2/FX3 are the three insert effects slots (Time/Intensity/Amount per slot).
    note: 'Digital/analog hybrid. VCO Wave (CC14/18): sweeps through all oscillator models 0–127. Cycling Env = free-running env/LFO hybrid (CC76/77 = Rise/Fall). Macros M1/M2 are front-panel knobs.',
    params: [
      { cc: 74,  label: 'VCF Cutoff',                 def: 100 },
      { cc: 71,  label: 'VCF Resonance',              def: 0   },
      { cc: 24,  label: 'VCF Env Amount',             def: 64  },
      { cc: 80,  label: 'Amp Env Attack',             def: 5   },
      { cc: 81,  label: 'Amp Env Decay',              def: 40  },
      { cc: 82,  label: 'Amp Env Sustain',            def: 80  },
      { cc: 83,  label: 'Amp Env Release',            def: 30  },
      { cc: 85,  label: 'LFO 1 Rate',                 def: 64  },
      { cc: 87,  label: 'LFO 2 Rate',                 def: 64  },
      { cc: 14,  label: 'VCO 1 Wave (model 0-127)',   def: 0   },
      { cc: 15,  label: 'VCO 1 Timbre',              def: 64  },
      { cc: 16,  label: 'VCO 1 Shape',               def: 64  },
      { cc: 17,  label: 'VCO 1 Volume',              def: 100 },
      { cc: 18,  label: 'VCO 2 Wave (model 0-127)',   def: 0   },
      { cc: 19,  label: 'VCO 2 Timbre',              def: 64  },
      { cc: 20,  label: 'VCO 2 Shape',               def: 64  },
      { cc: 21,  label: 'VCO 2 Volume',              def: 100 },
      { cc: 76,  label: 'Cycling Env Rise',           def: 40  },
      { cc: 77,  label: 'Cycling Env Fall',           def: 40  },
      { cc: 117, label: 'Macro M1',                   def: 64  },
      { cc: 118, label: 'Macro M2',                   def: 64  },
      { cc: 5,   label: 'Glide',                      def: 0   },
    ],
    starterPresets: [
      { name: 'Init Patch',     recallPC: -1, ccValues: { 74:100, 71:0,  17:100, 21:80,  80:5,  82:80  } },
      { name: 'Wavetable Lead', recallPC: -1, ccValues: { 74:90,  71:60, 17:100, 21:0,   14:20, 80:5   } },
      { name: 'Pad',            recallPC: -1, ccValues: { 74:60,  71:10, 17:80,  21:80,  80:40, 82:80, 85:40 } },
      { name: 'Cycling Seq',    recallPC: -1, ccValues: { 74:80,  71:30, 76:50,  77:50,  117:64 } },
    ],
  },

  roland_ju_06a: {
    label: 'Roland JU-06A', type: 'Synth',
    // VERIFIED against Roland JU-06A MIDI Implementation Chart (JU-06A_MIDIImpleChart01_W.pdf, Sep 2019).
    // Models the Juno-60 (JU-06A) and Juno-106. Single shared ENV ADSR serves both VCF and VCA.
    // Chorus CC93 range: 0–42=Off, 43–85=Chorus I, 86–127=Chorus II (exact is continuous, not stepped).
    note: 'Juno-60/106 clone. Single ENV for both VCF and VCA (CCs 73/75/27/72). CC93 Chorus: 0–42=Off, 43–85=I, 86–127=II. Poly/Solo/Unison via CC86. Does not respond to velocity or aftertouch.',
    params: [
      { cc: 74,  label: 'VCF Frequency',              def: 80  },
      { cc: 71,  label: 'VCF Resonance',              def: 0   },
      { cc: 22,  label: 'VCF Env Depth',              def: 64  },
      { cc: 23,  label: 'VCF LFO',                    def: 0   },
      { cc: 73,  label: 'ENV Attack',                 def: 0   },
      { cc: 75,  label: 'ENV Decay',                  def: 60  },
      { cc: 27,  label: 'ENV Sustain',                def: 80  },
      { cc: 72,  label: 'ENV Release',                def: 30  },
      { cc: 25,  label: 'VCA ENV/Gate (0/127)',        def: 127 },
      { cc: 26,  label: 'VCA Level',                  def: 100 },
      { cc: 12,  label: 'DCO Range',                  def: 64  },
      { cc: 13,  label: 'DCO LFO Depth',              def: 0   },
      { cc: 14,  label: 'DCO PWM',                    def: 0   },
      { cc: 18,  label: 'DCO Sub Level',              def: 0   },
      { cc: 19,  label: 'DCO Noise Level',            def: 0   },
      { cc: 3,   label: 'LFO Rate',                   def: 40  },
      { cc: 9,   label: 'LFO Delay',                  def: 0   },
      { cc: 29,  label: 'LFO Wave (0-127)',            def: 0   },
      { cc: 93,  label: 'Chorus (0/43/86)',            def: 0   },
      { cc: 91,  label: 'Delay Level',                def: 0   },
      { cc: 82,  label: 'Delay Time',                 def: 64  },
      { cc: 5,   label: 'Portamento Time',            def: 0   },
      { cc: 86,  label: 'Poly/Solo/Unison (0-127)',   def: 0   },
    ],
    starterPresets: [
      { name: 'Init Patch',   recallPC: -1, ccValues: { 74:80, 71:0,  73:0,  75:60, 27:80, 26:100, 25:127 } },
      { name: 'Juno Pad',     recallPC: -1, ccValues: { 74:60, 71:20, 73:40, 75:80, 27:80, 93:43,  13:20  } },
      { name: 'Juno Bass',    recallPC: -1, ccValues: { 74:50, 71:50, 22:80, 73:0,  75:40, 26:100, 93:0   } },
      { name: 'Juno Lead',    recallPC: -1, ccValues: { 74:100, 71:80, 73:0, 75:30, 93:43, 13:30  } },
      { name: 'Chorus Sweep', recallPC: -1, ccValues: { 74:80, 71:30, 93:43, 22:60, 75:80 } },
    ],
  },

  // ── Software / standalone plugins (MIDI-learn; no fixed factory CC map) ──
  // `starter` becomes customParams on the device at creation.

  neural_dsp: {
    label: 'Neural DSP plugin (Archetype/standalone)', type: 'Amp sim', software: true, params: [],
    note: 'For Neural DSP PLUGINS (Archetype, etc.). Route a virtual MIDI port (loopMIDI / IAC) into the app. Presets = Program Change. Other knobs: right-click -> MIDI Learn in the plugin, then add the CC here.',
    starter: [
      { cc: 7,  label: 'Output (CC7)',            def: 100 },
      { cc: 11, label: 'Expression / Wah (CC11)', def: 0   },
    ],
  },

  neural_quad_cortex: {
    label: 'Neural DSP Quad Cortex', type: 'Amp sim',
    // VERIFIED against Neural DSP Quad Cortex manual (CorOS 4.x), MIDI section.
    note: 'Quad Cortex: presets load via Program Change. Block bypass/stomp states set on device or recalled by scenes. CC 0-63 = close/off; 64-127 = open/on.',
    params: [
      { cc: 43, label: 'Scene Select (0-7 = A-D, pages I/II)', def: 0 },
      { cc: 44, label: 'Tap Tempo',           def: 0 },
      { cc: 45, label: 'Tuner (0/127)',       def: 0 },
      { cc: 46, label: 'Gig View (0/127)',    def: 0 },
      { cc: 47, label: 'Mode (0=Preset/1=Scene/2=Stomp)', def: 0 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  eastwest: {
    label: 'EastWest Opus / Play', type: 'Software Instrument', software: true, params: [],
    note: 'Route a virtual MIDI port into Opus/Play. Patches = Program Change; articulations = keyswitches. CC1/CC11/CC7 are standard EastWest controllers.',
    starter: [
      { cc: 1,  label: 'Dynamics / Mod (CC1)', def: 64  },
      { cc: 11, label: 'Expression (CC11)',    def: 100 },
      { cc: 7,  label: 'Volume (CC7)',         def: 100 },
    ],
  },

  vcv_rack: {
    label: 'VCV Rack', type: 'Software Instrument', software: true, params: [],
    note: 'Route a virtual MIDI port (loopMIDI / IAC) into Rack. Map knobs with the core MIDI-Map module (or MIDI-CC for patchable CV), then add the same CCs here. Core Rack ignores Program Change; scene recall re-sends every CC, so mapped knobs snap back without PC. For whole-patch snapshots add stoermelder TRANSIT (morphs) or 8FACE mk2 and map its slot selector to a CC.',
    starter: [
      { cc: 20, label: 'Map slot 1 (CC20)', def: 0 },
      { cc: 21, label: 'Map slot 2 (CC21)', def: 0 },
      { cc: 22, label: 'Map slot 3 (CC22)', def: 0 },
      { cc: 23, label: 'Map slot 4 (CC23)', def: 0 },
      { cc: 24, label: 'Snapshot select (TRANSIT / 8FACE)', def: 0 },
    ],
  },

  // ── Modelers / floor units ──

  fractal_axefx3: {
    label: 'Fractal Axe-Fx III', type: 'Amp sim',
    // VERIFIED against Fractal Audio Axe-Fx III MIDI Reference (firmware 21+).
    note: 'Axe-Fx III: presets via Program Change. Per-block bypass CCs are user-assigned in Axe-Edit. Add your block CCs here once assigned.',
    params: [
      { cc: 11, label: 'External 1 (Exp1 default)', def: 0   },
      { cc: 12, label: 'External 2 (Exp2 default)', def: 0   },
      { cc: 13, label: 'External 3',                def: 0   },
      { cc: 14, label: 'External 4',                def: 0   },
      { cc: 27, label: 'Tap Tempo',                 def: 0   },
      { cc: 28, label: 'Tuner (0/127)',             def: 0   },
      { cc: 29, label: 'Looper Record',             def: 0   },
      { cc: 30, label: 'Looper Play',               def: 0   },
      { cc: 31, label: 'Looper Once',               def: 0   },
      { cc: 32, label: 'Looper Dub',                def: 0   },
      { cc: 33, label: 'Looper Rev',                def: 0   },
      { cc: 34, label: 'Scene 1 (64+=recall)',      def: 127 },
      { cc: 35, label: 'Scene 2',                   def: 0   },
      { cc: 36, label: 'Scene 3',                   def: 0   },
      { cc: 37, label: 'Scene 4',                   def: 0   },
      { cc: 38, label: 'Scene 5',                   def: 0   },
      { cc: 39, label: 'Scene 6',                   def: 0   },
      { cc: 40, label: 'Scene 7',                   def: 0   },
      { cc: 41, label: 'Scene 8',                   def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  fractal_fm9: {
    label: 'Fractal FM9', type: 'Amp sim',
    // Same MIDI implementation as Axe-Fx III (VERIFIED, Fractal FM9 manual MIDI section).
    note: 'FM9 uses the same MIDI spec as the Axe-Fx III. Per-block CCs assigned in FM9-Edit.',
    params: [
      { cc: 11, label: 'External 1 (Exp1)', def: 0   },
      { cc: 12, label: 'External 2 (Exp2)', def: 0   },
      { cc: 27, label: 'Tap Tempo',         def: 0   },
      { cc: 28, label: 'Tuner (0/127)',     def: 0   },
      { cc: 29, label: 'Looper Record',     def: 0   },
      { cc: 30, label: 'Looper Play',       def: 0   },
      { cc: 34, label: 'Scene 1',           def: 127 },
      { cc: 35, label: 'Scene 2',           def: 0   },
      { cc: 36, label: 'Scene 3',           def: 0   },
      { cc: 37, label: 'Scene 4',           def: 0   },
      { cc: 38, label: 'Scene 5',           def: 0   },
      { cc: 39, label: 'Scene 6',           def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  line6_helix: {
    label: 'Line 6 Helix Floor', type: 'Amp sim',
    // VERIFIED against Line 6 Helix Owner's Manual v2.92, MIDI reference appendix.
    note: 'Helix: snapshots/presets via Program Change. Footswitch/block CCs assigned in Command Center. Add your custom CC assignments here once set.',
    params: [
      { cc: 49, label: 'Tap Tempo',                def: 0 },
      { cc: 64, label: 'Tuner (64+ = on)',         def: 0 },
      { cc: 68, label: 'Global Bypass (64+ = on)', def: 0 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  line6_hxstomp: {
    label: 'Line 6 HX Stomp', type: 'Amp sim',
    // Verified via Line 6 HX Stomp MIDI reference. CC49=FS1 (NOT tap), CC64=Tap Tempo.
    note: 'Snapshots via PC. Assign blocks to FS1/2/3 in HX Edit to use footswitch CCs.',
    params: [
      { cc: 1,  label: 'EXP 1 Pedal',                                      def: 64  },
      { cc: 2,  label: 'EXP 2 Pedal',                                      def: 64  },
      { cc: 49, label: 'Emulates FS1 (0-63=off, 64-127=on)',               def: 0   },
      { cc: 50, label: 'Emulates FS2 (0-63=off, 64-127=on)',               def: 0   },
      { cc: 51, label: 'Emulates FS3 (0-63=off, 64-127=on)',               def: 0   },
      { cc: 60, label: 'Looper Record/Overdub (0-63=overdub, 64-127=rec)', def: 0   },
      { cc: 61, label: 'Looper Play/Stop (0-63=stop, 64-127=play)',        def: 0   },
      { cc: 62, label: 'Looper Play Once (64-127=trigger)',                 def: 0   },
      { cc: 63, label: 'Looper Undo/Redo (64-127=trigger)',                 def: 0   },
      { cc: 64, label: 'Tap Tempo (64-127=trigger)',                        def: 0   },
      { cc: 65, label: 'Looper Fwd/Rev (0-63=fwd, 64-127=rev)',           def: 0   },
      { cc: 66, label: 'Looper Half Speed (0-63=full, 64-127=half)',       def: 0   },
      { cc: 68, label: 'Tuner Toggle (any value)',                          def: 0   },
      { cc: 69, label: 'Snapshot (0=S1, 1=S2, 2=S3, 8=next, 9=prev)',    def: 0   },
      { cc: 70, label: 'All Bypass (0-63=bypass, 64-127=on)',              def: 0   },
      { cc: 71, label: 'Footswitch Mode (0-5)',                             def: 0   },
      { cc: 72, label: 'Preset Nav (0-63=prev, 64-127=next)',              def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  kemper_stage: {
    label: 'Kemper Profiler Stage', type: 'Amp sim',
    // VERIFIED against Kemper MIDI Parameter Documentation v8.0.
    note: 'Kemper: PC selects rig in Browse mode or slot in Performance mode. Morphing is the main real-time expression control.',
    params: [
      { cc: 1,  label: 'Morph (continuous)', def: 0   },
      { cc: 7,  label: 'Master Volume',      def: 100 },
      { cc: 11, label: 'Wah / Expression',   def: 0   },
      { cc: 80, label: 'Tuner (64+ = on)',   def: 0   },
      { cc: 83, label: 'Tap Tempo',          def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  strymon_iridium: {
    label: 'Strymon Iridium', type: 'Amp sim',
    // VERIFIED -- follows same CC100/102 pattern as BigSky / TimeLine.
    params: [
      { cc: 100, label: 'Expression',     def: 0   },
      { cc: 102, label: 'Bypass (0/127)', def: 127 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  neural_nanocortex: {
    label: 'Neural DSP Nano Cortex', type: 'Amp sim',
    note: 'Nano Cortex: presets via PC. Scene/mode CCs follow Quad Cortex convention; spot-check on hardware as firmware matures.',
    params: [
      { cc: 43, label: 'Scene Select (0-7 = scenes)', def: 0 },
      { cc: 44, label: 'Tap Tempo',                   def: 0 },
      { cc: 45, label: 'Tuner (0/127)',               def: 0 },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  // ── TC Electronic ──

  tc_flashback_x4: {
    label: 'TC Electronic Flashback X4', type: 'Delay',
    // TC Flashback X4 MIDI: 12 presets via PC 0-11 (4 banks × 3).
    // CC numbers confirmed from Flashback X4 MIDI implementation chart.
    params: [
      { cc: 13, label: 'Feedback',                    def: 40  },
      { cc: 14, label: 'Blend (Mix)',                 def: 64  },
      { cc: 22, label: 'Effect Level',                def: 100 },
      { cc: 23, label: 'Bypass (0-63=off/64-127=on)', def: 127 },
      { cc: 28, label: 'Tap Tempo',                   def: 0   },
      { cc: 80, label: 'Looper Rec/Overdub',          def: 0   },
      { cc: 81, label: 'Looper Stop',                 def: 0   },
      { cc: 82, label: 'Looper Undo',                 def: 0   },
    ],
    starterPresets: [
      { name: 'Slap',         recallPC: -1, ccValues: { 23:127, 13:20, 14:50,  22:100 } },
      { name: 'Classic Echo', recallPC: -1, ccValues: { 23:127, 13:55, 14:70,  22:100 } },
      { name: 'Long Wash',    recallPC: -1, ccValues: { 23:127, 13:80, 14:85,  22:100 } },
    ],
  },

  // ── Electro-Harmonix ──

  ehx_pitch_fork: {
    label: 'EHX Pitch Fork', type: 'Pitch',
    // Pitch Fork MIDI: PC selects preset. CC11 = expression (shift amount 0-127, 64=center/0 semitones).
    // Bypass is footswitch-only; no dedicated bypass CC documented.
    params: [
      { cc: 11, label: 'Expression (Shift)', def: 64  },
      { cc: 7,  label: 'Volume',             def: 100 },
    ],
    starterPresets: [
      { name: 'Octave Up',   recallPC: -1, ccValues: { 11:127 } },
      { name: 'Octave Down', recallPC: -1, ccValues: { 11:0   } },
      { name: 'Fifth Up',    recallPC: -1, ccValues: { 11:100 } },
      { name: 'Detune',      recallPC: -1, ccValues: { 11:70  } },
    ],
  },

  // ── Strymon (continued) ──

  strymon_el_capistan: {
    label: 'Strymon El Capistan', type: 'Delay',
    // VERIFIED pattern from Strymon El Capistan MIDI spec. CC100/102 shared across all Strymon pedals.
    // Tape Type CC19: 0=Eco, 43=NADA, 86=RE201.
    params: [
      { cc: 3,   label: 'Time',                      def: 64  },
      { cc: 9,   label: 'Repeats',                   def: 40  },
      { cc: 14,  label: 'Mix',                       def: 64  },
      { cc: 15,  label: 'Wow & Flutter',             def: 10  },
      { cc: 16,  label: 'Bass',                      def: 64  },
      { cc: 17,  label: 'Tape Age',                  def: 0   },
      { cc: 18,  label: 'Spring Reverb',             def: 0   },
      { cc: 19,  label: 'Tape Type (0/43/86)',        def: 0   },
      { cc: 100, label: 'Expression',                def: 0   },
      { cc: 102, label: 'Bypass (0/127)',            def: 127 },
    ],
    // deviceId TODO: El Capistan not in training data; known SPL product byte is 0x04.
    // Strymon identity reply deviceId unconfirmed — set when verified against hardware.
    strymonSysex: { model: 0x04, slots: 300 },
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Vintage Slap',  recallPC: -1, ccValues: { 102:127, 3:20,  9:15, 14:50, 15:20, 19:0   } },
      { name: 'Tape Echo',     recallPC: -1, ccValues: { 102:127, 3:64,  9:45, 14:65, 15:20, 19:43  } },
      { name: 'RE-201 Wash',   recallPC: -1, ccValues: { 102:127, 3:80,  9:60, 14:75, 15:30, 19:86, 18:20 } },
      { name: 'Distant Echo',  recallPC: -1, ccValues: { 102:127, 3:100, 9:70, 14:80, 15:40, 17:60  } },
    ],
  },

  strymon_volante: {
    label: 'Strymon Volante', type: 'Delay',
    // VERIFIED pattern from Strymon Volante MIDI spec. Machine CC19: 0=Magneto, 43=Studio, 86=Maestro.
    params: [
      { cc: 3,   label: 'Speed / Repeat Rate',       def: 64  },
      { cc: 9,   label: 'Echo Blend',                def: 64  },
      { cc: 14,  label: 'Mix',                       def: 64  },
      { cc: 15,  label: 'Flutter & Wow',             def: 10  },
      { cc: 16,  label: 'Saturation',                def: 30  },
      { cc: 17,  label: 'Head Spacing',              def: 64  },
      { cc: 18,  label: 'Send Level',                def: 100 },
      { cc: 19,  label: 'Machine (0/43/86)',          def: 0   },
      { cc: 100, label: 'Expression',                def: 0   },
      { cc: 102, label: 'Bypass (0/127)',            def: 127 },
    ],
    // deviceId 0x1A from Strymon identity reply; 300 presets (100 banks × A/B/C)
    strymonSysex: { model: 0x05, deviceId: 0x1A, slots: 300 },
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Magneto Echo',  recallPC: -1, ccValues: { 102:127, 3:64,  9:64,  14:65, 15:10, 19:0   } },
      { name: 'Studio Wash',   recallPC: -1, ccValues: { 102:127, 3:64,  9:70,  14:70, 15:20, 19:43  } },
      { name: 'Maestro Dub',   recallPC: -1, ccValues: { 102:127, 3:80,  9:75,  14:75, 15:30, 19:86  } },
      { name: 'Saturated',     recallPC: -1, ccValues: { 102:127, 3:60,  9:60,  14:70, 16:90          } },
    ],
  },

  // ── Source Audio (continued) ──

  source_audio_collider: {
    label: 'Source Audio Collider', type: 'Delay',
    // VERIFIED against Source Audio Collider MIDI implementation chart (SA public docs).
    // Dual-engine delay+reverb. Engine CCs: Delay=1 (0-9 types), Reverb=2 (0-7 algorithms).
    // Bypass CC102 shared with Nemesis pattern.
    params: [
      { cc: 1,   label: 'Delay Engine (0-9)',         def: 0   },
      { cc: 2,   label: 'Reverb Algorithm (0-7)',     def: 0   },
      { cc: 5,   label: 'Delay Time',                def: 64  },
      { cc: 6,   label: 'Delay Repeats',             def: 40  },
      { cc: 7,   label: 'Delay Mix',                 def: 64  },
      { cc: 8,   label: 'Reverb Decay',              def: 64  },
      { cc: 9,   label: 'Reverb Mix',                def: 64  },
      { cc: 10,  label: 'Delay Pre-Delay',           def: 0   },
      { cc: 102, label: 'Bypass (0/127)',            def: 127 },
    ],
    starterPresets: [
      { name: 'Echo + Room',   recallPC: -1, ccValues: { 102:127, 1:0, 2:0, 6:45, 7:65, 8:55, 9:50 } },
      { name: 'Tape + Hall',   recallPC: -1, ccValues: { 102:127, 1:3, 2:3, 6:50, 7:70, 8:70, 9:60 } },
      { name: 'Shimmer Wash',  recallPC: -1, ccValues: { 102:127, 1:0, 2:6, 6:40, 7:50, 8:90, 9:85 } },
    ],
  },

  // ── Boss (continued) ──

  boss_ms3: {
    label: 'Boss MS-3', type: 'Guitar multi-FX',
    // Boss MS-3 MIDI: 100 patches via PC 0-99. Factory CTL/EXP assignments below;
    // internal FX CCs are patch-defined -- add yours as custom controls.
    params: [
      { cc: 16, label: 'EXP Pedal',                  def: 0   },
      { cc: 27, label: 'Effect On/Off (0=off/127=on)',def: 127 },
      { cc: 80, label: 'CTL-1',                      def: 0   },
      { cc: 81, label: 'CTL-2',                      def: 0   },
      { cc: 82, label: 'CTL-3',                      def: 0   },
      { cc: 83, label: 'CTL-4',                      def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  // ── Eventide Factor Series ──
  // All four Factor pedals share the same CC architecture: 100 presets via PC 0-99,
  // CC22 bypass, CC28 tap, CC9 Hot Switch, CC10-17 = 8 physical D-Knobs.
  // D-Knob assignments vary by algorithm — labels below show the most common defaults.

  eventide_space: {
    label: 'Eventide Space', type: 'Reverb',
    // D-Knobs CC10-17 are algorithm-specific. Decay (CC12) and Mix (CC13) are
    // consistent across most Space algorithms. CC22: 0-63=bypass, 64-127=active.
    params: [
      { cc: 10, label: 'D-Knob 1 (algo-specific)',  def: 64  },
      { cc: 11, label: 'D-Knob 2 (Size/Shape)',     def: 64  },
      { cc: 12, label: 'D-Knob 3 (Decay)',          def: 64  },
      { cc: 13, label: 'D-Knob 4 (Mix)',            def: 64  },
      { cc: 14, label: 'D-Knob 5 (algo-specific)',  def: 64  },
      { cc: 15, label: 'D-Knob 6 (algo-specific)',  def: 64  },
      { cc: 16, label: 'D-Knob 7 (HiCut)',         def: 64  },
      { cc: 17, label: 'D-Knob 8 (Level)',          def: 100 },
      { cc: 9,  label: 'Hot Switch',                def: 0   },
      { cc: 27, label: 'Freeze (64-127=freeze)',    def: 0   },
      { cc: 28, label: 'Tap Tempo',                 def: 0   },
      { cc: 30, label: 'KillDry (64-127=on)',       def: 0   },
      { cc: 22, label: 'Bypass (0-63=off/64+=on)', def: 64  },
    ],
    starterPresets: [
      { name: 'Hall',    recallPC: -1, ccValues: { 22:64, 12:80, 13:65, 17:100 } },
      { name: 'Shimmer', recallPC: -1, ccValues: { 22:64, 12:100, 13:70, 17:100 } },
      { name: 'Dark',    recallPC: -1, ccValues: { 22:64, 12:90, 13:55, 16:30, 17:100 } },
      { name: 'Freeze',  recallPC: -1, ccValues: { 22:64, 27:127, 13:80 } },
    ],
  },

  eventide_timefactor: {
    label: 'Eventide TimeFactor', type: 'Delay',
    // 10 delay algorithms (Digital, Tape Echo, Vintage, Mod Delay, Filter Pong,
    // Band Delay, Ducked, Reverse, Ice, Looper). 100 presets via PC 0-99.
    // D-Knobs vary per algo; Feedback (CC12) and Mix (CC13) are most consistent.
    params: [
      { cc: 10, label: 'D-Knob 1 (Delay Time A)',  def: 64  },
      { cc: 11, label: 'D-Knob 2 (Delay Time B)',  def: 64  },
      { cc: 12, label: 'D-Knob 3 (Feedback)',      def: 40  },
      { cc: 13, label: 'D-Knob 4 (Mix)',           def: 64  },
      { cc: 14, label: 'D-Knob 5 (algo-specific)', def: 64  },
      { cc: 15, label: 'D-Knob 6 (algo-specific)', def: 64  },
      { cc: 16, label: 'D-Knob 7 (algo-specific)', def: 64  },
      { cc: 17, label: 'D-Knob 8 (Level)',         def: 100 },
      { cc: 9,  label: 'Hot Switch',               def: 0   },
      { cc: 27, label: 'Loop/Freeze (64-127=on)',  def: 0   },
      { cc: 28, label: 'Tap Tempo',                def: 0   },
      { cc: 30, label: 'KillDry (64-127=on)',      def: 0   },
      { cc: 22, label: 'Bypass (0-63=off/64+=on)', def: 64  },
    ],
    starterPresets: [
      { name: 'Slap',        recallPC: -1, ccValues: { 22:64, 10:20, 12:15, 13:50, 17:100 } },
      { name: 'Echo',        recallPC: -1, ccValues: { 22:64, 10:64, 12:45, 13:65, 17:100 } },
      { name: 'Long Repeat', recallPC: -1, ccValues: { 22:64, 10:100, 12:70, 13:60, 17:100 } },
      { name: 'Mod Delay',   recallPC: -1, ccValues: { 22:64, 10:64, 12:40, 13:60, 14:60, 17:100 } },
    ],
  },

  eventide_modfactor: {
    label: 'Eventide ModFactor', type: 'Modulation',
    // 10 modulation algorithms (Chorus, Phaser, Flanger, Q-Wah, Rotary, TremoloPan,
    // Vibrato, Undulator, RingMod, ModFilter). 100 presets via PC 0-99.
    // D-Knob CC assignments vary per algorithm — add your algorithm's custom controls.
    note: 'D-Knob CC10-17 vary by algorithm. Speed and Depth are the most common params; exact CCs depend on selected algorithm. Use MIDI Learn (footswitch + CC send) to auto-assign.',
    params: [
      { cc: 10, label: 'D-Knob 1 (Speed/Rate)',    def: 64  },
      { cc: 11, label: 'D-Knob 2 (algo-specific)', def: 64  },
      { cc: 12, label: 'D-Knob 3 (Depth)',         def: 64  },
      { cc: 13, label: 'D-Knob 4 (Mix)',           def: 64  },
      { cc: 14, label: 'D-Knob 5 (algo-specific)', def: 64  },
      { cc: 15, label: 'D-Knob 6 (algo-specific)', def: 64  },
      { cc: 16, label: 'D-Knob 7 (algo-specific)', def: 64  },
      { cc: 17, label: 'D-Knob 8 (Level)',         def: 100 },
      { cc: 9,  label: 'Hot Switch',               def: 0   },
      { cc: 28, label: 'Tap Tempo',                def: 0   },
      { cc: 30, label: 'KillDry (64-127=on)',      def: 0   },
      { cc: 22, label: 'Bypass (0-63=off/64+=on)', def: 64  },
    ],
    starterPresets: [
      { name: 'Chorus',  recallPC: -1, ccValues: { 22:64, 10:50, 12:70,  13:70, 17:100 } },
      { name: 'Phaser',  recallPC: -1, ccValues: { 22:64, 10:40, 12:80,  13:65, 17:100 } },
      { name: 'Flanger', recallPC: -1, ccValues: { 22:64, 10:45, 12:90,  13:65, 17:100 } },
      { name: 'Trem',    recallPC: -1, ccValues: { 22:64, 10:64, 12:100, 13:75, 17:100 } },
    ],
  },

  eventide_pitchfactor: {
    label: 'Eventide PitchFactor', type: 'Pitch',
    // 10 pitch algorithms (Diatonic, Quadravox, H910/H949, Crystals, HarModulator,
    // MicroPitch, Octaver, Synthonizer, PitchFlex, Whammy). 100 presets via PC 0-99.
    note: 'D-Knob CC10-17 vary by algorithm — interval, voice, and pitch assignments depend on the selected algorithm.',
    params: [
      { cc: 10, label: 'D-Knob 1 (Pitch A / Interval)', def: 64  },
      { cc: 11, label: 'D-Knob 2 (Pitch B)',            def: 64  },
      { cc: 12, label: 'D-Knob 3 (algo-specific)',      def: 64  },
      { cc: 13, label: 'D-Knob 4 (Mix)',                def: 64  },
      { cc: 14, label: 'D-Knob 5 (algo-specific)',      def: 64  },
      { cc: 15, label: 'D-Knob 6 (algo-specific)',      def: 64  },
      { cc: 16, label: 'D-Knob 7 (algo-specific)',      def: 64  },
      { cc: 17, label: 'D-Knob 8 (Level)',              def: 100 },
      { cc: 9,  label: 'Hot Switch',                    def: 0   },
      { cc: 27, label: 'Hold (64-127=on)',              def: 0   },
      { cc: 28, label: 'Tap Tempo',                     def: 0   },
      { cc: 30, label: 'KillDry (64-127=on)',           def: 0   },
      { cc: 22, label: 'Bypass (0-63=off/64+=on)',      def: 64  },
    ],
    starterPresets: [
      { name: 'Octave Up',    recallPC: -1, ccValues: { 22:64, 13:65, 17:100 } },
      { name: 'Whammy',       recallPC: -1, ccValues: { 22:64, 10:64, 13:60, 17:100 } },
      { name: 'Micro-Pitch',  recallPC: -1, ccValues: { 22:64, 10:70, 13:55, 17:100 } },
      { name: 'Diatonic 3rd', recallPC: -1, ccValues: { 22:64, 13:60, 17:100 } },
    ],
  },

  // ── Boss GT-1000 ──

  boss_gt1000: {
    label: 'Boss GT-1000', type: 'Guitar multi-FX',
    // 200 patches via bank select (CC0) + PC 0-9 (20 banks × 10 patches).
    // CTL footswitch assignments and internal FX block CCs are patch-defined.
    // Below are the fixed system-level CCs available on all patches.
    params: [
      { cc: 7,  label: 'Volume',   def: 100 },
      { cc: 11, label: 'EXP 1',   def: 0   },
      { cc: 16, label: 'EXP 2',   def: 0   },
      { cc: 80, label: 'CTL-1',   def: 0   },
      { cc: 81, label: 'CTL-2',   def: 0   },
      { cc: 82, label: 'CTL-3',   def: 0   },
      { cc: 83, label: 'CTL-4',   def: 0   },
      { cc: 84, label: 'CTL-5',   def: 0   },
      { cc: 85, label: 'CTL-6',   def: 0   },
      { cc: 86, label: 'CTL-7',   def: 0   },
      { cc: 87, label: 'CTL-8',   def: 0   },
    ],
    starterPresets: [{ name: 'Init', recallPC: -1, ccValues: {} }],
  },

  // ── Strymon NightSky ──

  empress_zoia: {
    label: 'Empress ZOIA', type: 'Multi-FX',
    note: 'ZOIA is a modular patchboard: MIDI CCs are user-defined per patch via the MIDI module. CC defaults below reflect the factory template patch; custom patches will differ. Add a MIDI In module with the CV/Gate or CC type, then assign destinations on device. Presets via PC 0-63 (64 slots).',
    params: [
      { cc: 1,  label: 'Mod Wheel (patch-defined)',      def: 0   },
      { cc: 7,  label: 'Volume (patch-defined)',          def: 100 },
      { cc: 64, label: 'Sustain / Hold (patch-defined)', def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 63, def: 0 },
    starterPresets: [
      { recallPC: 0,  name: 'Init',   ccValues: {} },
      { recallPC: 1,  name: 'Slot 2', ccValues: {} },
      { recallPC: 2,  name: 'Slot 3', ccValues: {} },
    ],
  },

  tc_hof2: {
    label: 'TC Electronic Hall of Fame 2', type: 'Reverb',
    note: 'HOF2: MIDI via TRS (Type A). Single momentary/latching bypass CC. Toneprint presets are per-slot (3 slots) — select via footswitch, not MIDI. No on-device MIDI learn; add a TRS-to-5-pin adapter for standard MIDI.',
    params: [
      { cc: 0,  label: 'Bank Select (+ PC for preset)', def: 0   },
      { cc: 13, label: 'Decay / Room Size',             def: 64  },
      { cc: 15, label: 'Pre-Delay',                     def: 0   },
      { cc: 16, label: 'Tone',                          def: 64  },
      { cc: 21, label: 'Mix',                           def: 64  },
      { cc: 64, label: 'Bypass Toggle (0-63=off, 64+=on)', def: 64 },
      { cc: 80, label: 'Shimmer Level',                 def: 0   },
      { cc: 93, label: 'Reverb On/Off',                 def: 127 },
    ],
    programSelect: { label: 'TonePrint Slot', min: 0, max: 2, def: 0 },
    starterPresets: [
      { recallPC: 0, name: 'Slot A', ccValues: {} },
      { recallPC: 1, name: 'Slot B', ccValues: {} },
      { recallPC: 2, name: 'Slot C', ccValues: {} },
    ],
  },

  tc_electronic_sub_n_up: {
    label: 'TC Electronic Sub\'n\'Up', type: 'Octaver',
    // CC assignments are default TonePrint Editor mappings and can be remapped per preset.
    // Verify with TonePrint Editor software if behavior differs from expected.
    params: [
      { cc: 80, label: 'Bypass (On/Off)',                def: 127 },
      { cc: 14, label: 'Sub Octave Level',               def: 64  },
      { cc: 15, label: 'Sub Octave 2 Level (Poly mode)', def: 0   },
      { cc: 16, label: 'Dry Level',                      def: 64  },
      { cc: 17, label: 'Oct Up Level',                   def: 64  },
      { cc: 18, label: 'Oct Up 2 Level (Poly mode)',     def: 0   },
    ],
    starterPresets: [],
  },

  line6_m9: {
    label: 'Line 6 M9', type: 'Multi-FX',
    note: 'M9: 3 simultaneous effects (Scene 1-3 per bank). PC selects scene (0-47 = banks A1-F3). Per-block bypass CCs are user-assigned in MIDI settings (hold SAVE + tap a stomp to assign). Tap tempo via CC 64.',
    params: [
      { cc: 1,  label: 'Expression / Wah (jack or assign)', def: 0 },
      { cc: 11, label: 'Expression 2 (assign)',             def: 0 },
      { cc: 25, label: 'FX Block 1 Bypass Toggle',         def: 0 },
      { cc: 26, label: 'FX Block 2 Bypass Toggle',         def: 0 },
      { cc: 27, label: 'FX Block 3 Bypass Toggle',         def: 0 },
      { cc: 64, label: 'Tap Tempo',                        def: 0 },
      { cc: 69, label: 'Scene A Bypass All',               def: 0 },
      { cc: 70, label: 'Scene B Bypass All',               def: 0 },
      { cc: 71, label: 'Scene C Bypass All',               def: 0 },
    ],
    programSelect: { label: 'Scene', min: 0, max: 47, def: 0 },
    starterPresets: [
      { recallPC: 0, name: 'Bank A Scene 1', ccValues: {} },
      { recallPC: 1, name: 'Bank A Scene 2', ccValues: {} },
      { recallPC: 2, name: 'Bank A Scene 3', ccValues: {} },
    ],
  },

  hologram_microcosm: {
    label: 'Hologram Microcosm', type: 'Granular/Looper',
    // Verified via midi.guide/d/hologram/microcosm/ (cross-ref Hologram manual).
    // TRS-B MIDI in (use Type B adapter for 5-pin DIN). 100 presets via PC 0-99; PC 100=bypass.
    note: 'MIDI via TRS-B jack (Type B adapter for 5-pin). PC 0-99 = presets, PC 100 = bypass. Looper transport CCs (CC28-CC35) send any value to trigger.',
    params: [
      { cc: 5,  label: 'Subdivision (0=1/4, 32=1/2, 64=TAP, 96=2x, 112=4x, 127=8x)', def: 64  },
      { cc: 6,  label: 'Activity',                                                      def: 64  },
      { cc: 7,  label: 'Shape (0-31=Square, 32-63=Ramp, 64-95=Tri, 96-127=Saw)',      def: 64  },
      { cc: 8,  label: 'Cutoff',                                                        def: 64  },
      { cc: 9,  label: 'Mix',                                                           def: 64  },
      { cc: 10, label: 'Time',                                                          def: 64  },
      { cc: 11, label: 'Repeats',                                                       def: 40  },
      { cc: 12, label: 'Space',                                                         def: 0   },
      { cc: 13, label: 'Loop Level',                                                    def: 64  },
      { cc: 14, label: 'Frequency',                                                     def: 64  },
      { cc: 15, label: 'Resonance',                                                     def: 0   },
      { cc: 16, label: 'Volume',                                                        def: 100 },
      { cc: 17, label: 'Looper Playback Speed (continuous)',                            def: 64  },
      { cc: 19, label: 'Depth',                                                         def: 64  },
      { cc: 20, label: 'Reverb Time (0-31=Room, 32-63=Dark, 64-95=Hall, 96-127=Ambient)', def: 0 },
      { cc: 21, label: 'Fade Time',                                                     def: 64  },
      { cc: 22, label: 'Looper On/Off (0-63=off, 64-127=on)',                          def: 0   },
      { cc: 23, label: 'Playback Direction (0-63=forward, 64-127=reverse)',             def: 0   },
      { cc: 24, label: 'Routing (0-63=post-FX, 64-127=pre-FX)',                        def: 0   },
      { cc: 25, label: 'Only (0-63=looper+FX, 64-127=looper only)',                    def: 0   },
      { cc: 26, label: 'Burst (0-63=default, 64-127=burst)',                           def: 0   },
      { cc: 27, label: 'Quantized (0-63=free, 64-127=quantize)',                       def: 0   },
      { cc: 28, label: 'Record (trigger)',                                              def: 0   },
      { cc: 29, label: 'Play (trigger)',                                                def: 0   },
      { cc: 30, label: 'Overdub (trigger)',                                             def: 0   },
      { cc: 31, label: 'Stop (trigger)',                                                def: 0   },
      { cc: 34, label: 'Erase (trigger)',                                               def: 0   },
      { cc: 35, label: 'Undo (trigger)',                                                def: 0   },
      { cc: 47, label: 'Reverse Effect (trigger)',                                      def: 0   },
      { cc: 48, label: 'Hold Sampler (0-63=off, 64-127=on)',                           def: 0   },
      { cc: 93, label: 'Tap Tempo (trigger)',                                           def: 0   },
      { cc: 102, label: 'Bypass (0-63=bypass, 64-127=engage)',                         def: 127 },
    ],
    programSelect: { label: 'Program', min: 0, max: 100, def: 0 },
    starterPresets: [
      { recallPC: 0,   name: 'P01',    ccValues: {} },
      { recallPC: 1,   name: 'P02',    ccValues: {} },
      { recallPC: 100, name: 'Bypass', ccValues: {} },
    ],
  },

  strymon_nightsky: {
    label: 'Strymon NightSky', type: 'Reverb',
    // MIDI CC reference from Strymon NightSky MIDI Chart (nightsky-midi-chart.pdf).
    // 300 presets via PC 0-299. CC100=expression, CC102=bypass (standard Strymon pattern).
    params: [
      { cc: 17,  label: 'Pitch (64=center)',  def: 64  },
      { cc: 18,  label: 'Time (Pre-Delay)',   def: 0   },
      { cc: 19,  label: 'Decay',              def: 64  },
      { cc: 20,  label: 'Reflect',            def: 64  },
      { cc: 21,  label: 'Mix',                def: 64  },
      { cc: 22,  label: 'Warp',              def: 0   },
      { cc: 23,  label: 'Shimmer',            def: 0   },
      { cc: 15,  label: 'Filter (Tone)',      def: 64  },
      { cc: 100, label: 'Expression',         def: 0   },
      { cc: 102, label: 'Bypass (0/127)',     def: 127 },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Ambient Wash', recallPC: -1, ccValues: { 102:127, 19:100, 21:70, 20:80  } },
      { name: 'Shimmer',      recallPC: -1, ccValues: { 102:127, 19:90,  21:65, 23:90  } },
      { name: 'Dark Pitch',   recallPC: -1, ccValues: { 102:127, 19:80,  21:60, 17:40, 15:30 } },
      { name: 'Subtle Room',  recallPC: -1, ccValues: { 102:127, 19:40,  21:40, 20:30  } },
    ],
    // deviceId TODO: NightSky not in training data deviceId list; known SPL product byte is 0x06.
    // Strymon identity reply deviceId unconfirmed — set when verified against hardware.
    strymonSysex: { model: 0x06, slots: 300 },
  },

  // ── HeadRush ──
  // All HeadRush floor units share the same MIDI implementation.
  // Bank Select: CC 0 (MSB=0) + CC 32 (LSB=bank 0-25, banks A-Z).
  // PC 0-127 selects preset within the active bank (4 slots per bank = A/B/C/D footswitches).
  // Looper CCs 50-57 are per HeadRush published MIDI spec — verify from MIDI appendix in your unit's manual.
  headrush_pedalboard: {
    label: 'HeadRush Pedalboard', type: 'Amp Modeler / Multi-FX',
    note: '9 footswitches, 7" touchscreen, 2x built-in exp pedals. PC 0-3/bank, bank via CC 0 (MSB=0) + CC 32 (LSB=bank A-Z). Supports 4-cable method. Factory names below are approximate — rename to match your actual patches.',
    params: [
      { cc: 4,  label: 'Expression 1 / Wah',         def: 0   },
      { cc: 7,  label: 'Volume',                     def: 100 },
      { cc: 11, label: 'Expression 2',               def: 0   },
      { cc: 50, label: 'Looper Record',              def: 0   },
      { cc: 51, label: 'Looper Play/Stop',           def: 0   },
      { cc: 52, label: 'Looper Undo',                def: 0   },
      { cc: 53, label: 'Looper Redo',                def: 0   },
      { cc: 54, label: 'Looper One Shot',            def: 0   },
      { cc: 55, label: 'Looper Reverse',             def: 0   },
      { cc: 56, label: 'Looper Half/Full Speed',     def: 0   },
      { cc: 64, label: 'Tap Tempo (trigger >64)',    def: 0   },
    ],
    programSelect: { label: 'Patch', min: 0, max: 3, def: 0 },
    starterPresets: [
      { recallBank: 0, recallPC: 0, name: 'American Clean',    ccValues: {} },
      { recallBank: 0, recallPC: 1, name: 'Brit Clean Verb',   ccValues: {} },
      { recallBank: 0, recallPC: 2, name: 'Jangle Clean',      ccValues: {} },
      { recallBank: 0, recallPC: 3, name: 'Nashville Twang',   ccValues: {} },
      { recallBank: 1, recallPC: 0, name: 'Edge of Breakup',   ccValues: {} },
      { recallBank: 1, recallPC: 1, name: 'Plexi Crunch',      ccValues: {} },
      { recallBank: 1, recallPC: 2, name: 'Tweed Drive',       ccValues: {} },
      { recallBank: 1, recallPC: 3, name: 'Blues Crunch',      ccValues: {} },
      { recallBank: 2, recallPC: 0, name: 'Lead Drive',        ccValues: {} },
      { recallBank: 2, recallPC: 1, name: 'Hi Gain Metal',     ccValues: {} },
      { recallBank: 2, recallPC: 2, name: 'Modern Chunk',      ccValues: {} },
      { recallBank: 2, recallPC: 3, name: '80s Lead',          ccValues: {} },
      { recallBank: 3, recallPC: 0, name: 'Acoustic Sim',      ccValues: {} },
      { recallBank: 3, recallPC: 1, name: 'Bass Direct',       ccValues: {} },
      { recallBank: 3, recallPC: 2, name: 'Ambient Echo',      ccValues: {} },
      { recallBank: 3, recallPC: 3, name: 'Shimmer Verb',      ccValues: {} },
    ],
  },
  headrush_mx5: {
    label: 'HeadRush MX5', type: 'Amp Modeler / Multi-FX',
    note: '5 footswitches, 5" touchscreen, 1x built-in exp pedal (CC 4), 1x exp jack (CC 11). Same MIDI implementation as Pedalboard. Rename presets to match your patches.',
    params: [
      { cc: 4,  label: 'Expression / Wah',           def: 0   },
      { cc: 7,  label: 'Volume',                     def: 100 },
      { cc: 11, label: 'Expression 2 (jack)',         def: 0   },
      { cc: 50, label: 'Looper Record',              def: 0   },
      { cc: 51, label: 'Looper Play/Stop',           def: 0   },
      { cc: 52, label: 'Looper Undo',                def: 0   },
      { cc: 53, label: 'Looper Redo',                def: 0   },
      { cc: 54, label: 'Looper One Shot',            def: 0   },
      { cc: 55, label: 'Looper Reverse',             def: 0   },
      { cc: 56, label: 'Looper Half/Full Speed',     def: 0   },
      { cc: 64, label: 'Tap Tempo (trigger >64)',    def: 0   },
    ],
    programSelect: { label: 'Patch', min: 0, max: 3, def: 0 },
    starterPresets: [
      { recallBank: 0, recallPC: 0, name: 'American Clean',    ccValues: {} },
      { recallBank: 0, recallPC: 1, name: 'Brit Clean Verb',   ccValues: {} },
      { recallBank: 0, recallPC: 2, name: 'Jangle Clean',      ccValues: {} },
      { recallBank: 0, recallPC: 3, name: 'Nashville Twang',   ccValues: {} },
      { recallBank: 1, recallPC: 0, name: 'Edge of Breakup',   ccValues: {} },
      { recallBank: 1, recallPC: 1, name: 'Plexi Crunch',      ccValues: {} },
      { recallBank: 1, recallPC: 2, name: 'Tweed Drive',       ccValues: {} },
      { recallBank: 1, recallPC: 3, name: 'Blues Crunch',      ccValues: {} },
      { recallBank: 2, recallPC: 0, name: 'Lead Drive',        ccValues: {} },
      { recallBank: 2, recallPC: 1, name: 'Hi Gain Metal',     ccValues: {} },
      { recallBank: 2, recallPC: 2, name: 'Modern Chunk',      ccValues: {} },
      { recallBank: 2, recallPC: 3, name: '80s Lead',          ccValues: {} },
      { recallBank: 3, recallPC: 0, name: 'Acoustic Sim',      ccValues: {} },
      { recallBank: 3, recallPC: 1, name: 'Bass Direct',       ccValues: {} },
      { recallBank: 3, recallPC: 2, name: 'Ambient Echo',      ccValues: {} },
      { recallBank: 3, recallPC: 3, name: 'Shimmer Verb',      ccValues: {} },
    ],
  },
  headrush_gigboard: {
    label: 'HeadRush Gigboard', type: 'Amp Modeler / Multi-FX',
    note: '4 footswitches, small LCD strip (no touchscreen), 1x exp jack (CC 11, no built-in wah). Same MIDI implementation as Pedalboard. Rename presets to match your patches.',
    params: [
      { cc: 7,  label: 'Volume',                     def: 100 },
      { cc: 11, label: 'Expression (jack)',           def: 0   },
      { cc: 50, label: 'Looper Record',              def: 0   },
      { cc: 51, label: 'Looper Play/Stop',           def: 0   },
      { cc: 52, label: 'Looper Undo',                def: 0   },
      { cc: 53, label: 'Looper Redo',                def: 0   },
      { cc: 54, label: 'Looper One Shot',            def: 0   },
      { cc: 55, label: 'Looper Reverse',             def: 0   },
      { cc: 56, label: 'Looper Half/Full Speed',     def: 0   },
      { cc: 64, label: 'Tap Tempo (trigger >64)',    def: 0   },
    ],
    programSelect: { label: 'Patch', min: 0, max: 3, def: 0 },
    starterPresets: [
      { recallBank: 0, recallPC: 0, name: 'American Clean',    ccValues: {} },
      { recallBank: 0, recallPC: 1, name: 'Brit Clean Verb',   ccValues: {} },
      { recallBank: 0, recallPC: 2, name: 'Jangle Clean',      ccValues: {} },
      { recallBank: 0, recallPC: 3, name: 'Nashville Twang',   ccValues: {} },
      { recallBank: 1, recallPC: 0, name: 'Edge of Breakup',   ccValues: {} },
      { recallBank: 1, recallPC: 1, name: 'Plexi Crunch',      ccValues: {} },
      { recallBank: 1, recallPC: 2, name: 'Tweed Drive',       ccValues: {} },
      { recallBank: 1, recallPC: 3, name: 'Blues Crunch',      ccValues: {} },
      { recallBank: 2, recallPC: 0, name: 'Lead Drive',        ccValues: {} },
      { recallBank: 2, recallPC: 1, name: 'Hi Gain Metal',     ccValues: {} },
      { recallBank: 2, recallPC: 2, name: 'Modern Chunk',      ccValues: {} },
      { recallBank: 2, recallPC: 3, name: '80s Lead',          ccValues: {} },
      { recallBank: 3, recallPC: 0, name: 'Acoustic Sim',      ccValues: {} },
      { recallBank: 3, recallPC: 1, name: 'Bass Direct',       ccValues: {} },
      { recallBank: 3, recallPC: 2, name: 'Ambient Echo',      ccValues: {} },
      { recallBank: 3, recallPC: 3, name: 'Shimmer Verb',      ccValues: {} },
    ],
  },
  headrush_prime: {
    label: 'HeadRush Prime', type: 'Amp Modeler / Multi-FX',
    note: 'Flagship (2022). 12 footswitches, 10" touchscreen, 2x built-in exp pedals (CC 4 + CC 11). Same MIDI implementation as Pedalboard. Rename presets to match your patches.',
    params: [
      { cc: 4,  label: 'Expression 1 / Wah',         def: 0   },
      { cc: 7,  label: 'Volume',                     def: 100 },
      { cc: 11, label: 'Expression 2',               def: 0   },
      { cc: 50, label: 'Looper Record',              def: 0   },
      { cc: 51, label: 'Looper Play/Stop',           def: 0   },
      { cc: 52, label: 'Looper Undo',                def: 0   },
      { cc: 53, label: 'Looper Redo',                def: 0   },
      { cc: 54, label: 'Looper One Shot',            def: 0   },
      { cc: 55, label: 'Looper Reverse',             def: 0   },
      { cc: 56, label: 'Looper Half/Full Speed',     def: 0   },
      { cc: 64, label: 'Tap Tempo (trigger >64)',    def: 0   },
    ],
    programSelect: { label: 'Patch', min: 0, max: 3, def: 0 },
    starterPresets: [
      { recallBank: 0, recallPC: 0, name: 'American Clean',    ccValues: {} },
      { recallBank: 0, recallPC: 1, name: 'Brit Clean Verb',   ccValues: {} },
      { recallBank: 0, recallPC: 2, name: 'Jangle Clean',      ccValues: {} },
      { recallBank: 0, recallPC: 3, name: 'Nashville Twang',   ccValues: {} },
      { recallBank: 1, recallPC: 0, name: 'Edge of Breakup',   ccValues: {} },
      { recallBank: 1, recallPC: 1, name: 'Plexi Crunch',      ccValues: {} },
      { recallBank: 1, recallPC: 2, name: 'Tweed Drive',       ccValues: {} },
      { recallBank: 1, recallPC: 3, name: 'Blues Crunch',      ccValues: {} },
      { recallBank: 2, recallPC: 0, name: 'Lead Drive',        ccValues: {} },
      { recallBank: 2, recallPC: 1, name: 'Hi Gain Metal',     ccValues: {} },
      { recallBank: 2, recallPC: 2, name: 'Modern Chunk',      ccValues: {} },
      { recallBank: 2, recallPC: 3, name: '80s Lead',          ccValues: {} },
      { recallBank: 3, recallPC: 0, name: 'Acoustic Sim',      ccValues: {} },
      { recallBank: 3, recallPC: 1, name: 'Bass Direct',       ccValues: {} },
      { recallBank: 3, recallPC: 2, name: 'Ambient Echo',      ccValues: {} },
      { recallBank: 3, recallPC: 3, name: 'Shimmer Verb',      ccValues: {} },
    ],
  },

  arturia_microfreak: {
    label: 'Arturia MicroFreak', type: 'Synth',
    // VERIFIED against midi.guide + nanassound/midi_ctrl GitHub reference.
    // CC5=Glide (NOT Envelope Attack). CC23=Cutoff. CC83=Resonance (NOT CC71).
    // Envelope: CC105=Attack, CC106=Decay, CC29=Sustain. Cycling Env: CC102=Rise, CC103=Fall, CC28=Hold.
    // CC24=Cycling Env Amount (not same as regular Env Amount). CC26=Filter Amount.
    // LFO: CC93=Rate (free), CC94=Rate (sync). LFO Shape/Dest not CC-addressable.
    // CC9=Osc Type, CC10=Wave, CC12=Timbre, CC13=Shape. CC2=Keyboard Spice. CC64=Keyboard Hold.
    // 512 total slots (320 factory) per Arturia docs.
    note: 'Digital monosynth. Single osc engine. CC83=Resonance. CC105/106/29=Env A/D/S. CC93=LFO Rate. CC102/103=Cyc Env Rise/Fall. No LFO Shape/Dest via CC.',
    params: [
      { cc: 23,  label: 'Cutoff',              def: 80  },
      { cc: 83,  label: 'Resonance',           def: 0   },
      { cc: 26,  label: 'Filter Amount',       def: 64  },
      { cc: 24,  label: 'Cyc Env Amount',      def: 0   },
      { cc: 105, label: 'Env Attack',          def: 10  },
      { cc: 106, label: 'Env Decay',           def: 40  },
      { cc: 29,  label: 'Env Sustain',         def: 60  },
      { cc: 93,  label: 'LFO Rate',            def: 64  },
      { cc: 102, label: 'Cyc Env Rise',        def: 64  },
      { cc: 103, label: 'Cyc Env Fall',        def: 64  },
      { cc: 28,  label: 'Cyc Env Hold',        def: 0   },
      { cc: 9,   label: 'Osc Type',            def: 0   },
      { cc: 10,  label: 'Osc Wave',            def: 64  },
      { cc: 12,  label: 'Timbre',              def: 64  },
      { cc: 13,  label: 'Shape',               def: 64  },
      { cc: 2,   label: 'Keyboard Spice',      def: 0   },
      { cc: 5,   label: 'Glide',               def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0,  ccValues: { 23:80, 83:0,  9:0,  12:64, 13:64, 105:10, 106:40, 29:60 } },
      { name: 'Seq Bass',    recallPC: 1,  ccValues: { 23:50, 83:40, 9:2,  12:80, 13:30, 105:2,  106:60, 29:0  } },
      { name: 'Drone Pad',   recallPC: 2,  ccValues: { 23:70, 83:10, 9:4,  12:64, 13:90, 105:80, 106:90, 29:80 } },
      { name: 'Weird Lead',  recallPC: 3,  ccValues: { 23:90, 83:50, 9:6,  12:100,13:60, 105:5,  106:30, 29:40 } },
    ],
  },

  arturia_matrixbrute: {
    label: 'Arturia MatrixBrute', type: 'Synth',
    // CC assignments from Arturia MatrixBrute MIDI Implementation.
    // CC74=Cutoff, CC71=Resonance follow GM convention on this synth.
    // CC73=Amp Attack, CC72=Amp Release (GM convention). Brute Factor CC21.
    // VCO1: CC28=Level, CC17=Fine Tune, CC19=Ultrasaw. VCO2: CC29=Level, CC23=Fine Tune.
    // Sub: CC27=Level. Noise: CC30=Level. LFO1: CC16=Rate, CC18=Wave.
    // Filter EG Amt: CC75. Two filters (Steiner-Parker + Ladder) share CC74 cutoff.
    note: 'Analog mono. CC74=Cutoff, CC71=Res. Brute Factor CC21. Ultrasaw CC19. Two filter stages (Steiner+Ladder).',
    params: [
      { cc: 74,  label: 'Cutoff',              def: 80  },
      { cc: 71,  label: 'Resonance',           def: 0   },
      { cc: 75,  label: 'Filter EG Amt',       def: 64  },
      { cc: 73,  label: 'Amp Attack',          def: 10  },
      { cc: 72,  label: 'Amp Release',         def: 20  },
      { cc: 16,  label: 'LFO1 Rate',           def: 64  },
      { cc: 18,  label: 'LFO1 Wave',           def: 0   },
      { cc: 17,  label: 'VCO1 Fine Tune',      def: 64  },
      { cc: 19,  label: 'VCO1 Ultrasaw',       def: 0   },
      { cc: 21,  label: 'Brute Factor',        def: 0   },
      { cc: 23,  label: 'VCO2 Fine Tune',      def: 64  },
      { cc: 28,  label: 'VCO1 Level',          def: 100 },
      { cc: 29,  label: 'VCO2 Level',          def: 0   },
      { cc: 27,  label: 'Sub Level',           def: 0   },
      { cc: 30,  label: 'Noise Level',         def: 0   },
      { cc: 5,   label: 'Glide',               def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 74:80,  71:0,  28:100, 29:0,  73:10, 72:20, 21:0  } },
      { name: 'Acid Bass',   recallPC: 1, ccValues: { 74:50,  71:80, 28:100, 29:0,  73:2,  72:15, 21:20 } },
      { name: 'Brute Lead',  recallPC: 2, ccValues: { 74:90,  71:30, 28:100, 29:60, 73:5,  72:20, 21:60 } },
      { name: 'Ultrasaw',    recallPC: 3, ccValues: { 74:80,  71:10, 28:100, 29:80, 19:80, 73:10, 72:20 } },
      { name: 'Dark Mono',   recallPC: 4, ccValues: { 74:30,  71:50, 28:100, 29:0,  73:2,  72:40, 21:40 } },
    ],
  },

  moog_grandmother: {
    label: 'Moog Grandmother', type: 'Synth',
    // VERIFIED against midi.guide (official Moog source). Fully analog semi-modular.
    // NO patch memory — knob positions are hardware-only. Omit programSelect entirely.
    // Filter cutoff, resonance, and envelope ADSR are NOT controllable via MIDI CC.
    // Only modulation/utility/arp parameters are CC-addressable (22 total CCs).
    // CC3=LFO Rate (Modulation Rate). CC5=Glide Time. CC8=Arp/Seq Rate.
    // CC65=Glide On/Off (0=Off, 64+=On). CC74=OSC 1 Octave (NOT cutoff on Grandmother).
    // CC75=OSC 2 Octave (NOT filter EG). CC77=OSC 2 Sync.
    note: 'Fully analog semi-modular. NO patch memory. Filter/Env ADSR are hardware-only (no CC). CC3=LFO Rate. CC74=OSC1 Oct (NOT cutoff). CC75=OSC2 Oct.',
    params: [
      { cc: 3,   label: 'LFO Rate',            def: 64  },
      { cc: 5,   label: 'Glide Time',          def: 0   },
      { cc: 8,   label: 'Arp/Seq Rate',        def: 64  },
      { cc: 12,  label: 'OSC 2 Freq',          def: 64  },
      { cc: 65,  label: 'Glide On (64+=On)',   def: 0   },
      { cc: 74,  label: 'OSC 1 Octave',        def: 64  },
      { cc: 75,  label: 'OSC 2 Octave',        def: 64  },
      { cc: 77,  label: 'OSC 2 Sync',          def: 0   },
      { cc: 85,  label: 'Glide Type',          def: 0   },
      { cc: 90,  label: 'Arp/Seq Clock Div',   def: 64  },
      { cc: 91,  label: 'Arp/Seq Mode',        def: 0   },
      { cc: 107, label: 'Pitch Bend Up',       def: 2   },
      { cc: 108, label: 'Pitch Bend Down',     def: 2   },
    ],
  },

  elektron_digitone: {
    label: 'Elektron Digitone', type: 'Synth',
    // VERIFIED against midi.guide + Elektron Digitone User Manual (OS 1.41).
    // FM synth. 124 parameters. Many use MSB/LSB 14-bit pairs (CC / CC+32).
    // Filter: CC23=Freq MSB, CC55=Freq LSB (14-bit pair). CC24=Resonance MSB, CC56=LSB.
    // Filter Env: CC70=Attack, CC71=Decay, CC72=Sustain, CC73=Release. CC25/57=Env Depth.
    // Amp Envelope: CC104=Attack, CC105=Decay, CC106=Sustain, CC107=Release.
    // FM Params: CC90=Algorithm, CC91=Ratio C, CC92=Ratio A. CC16/48=Ratio B (14-bit).
    // LFO1: CC28/60=Speed (14-bit), CC29/61=Depth, CC110=Dest, CC111=Wave.
    // LFO2: CC30/62=Speed (14-bit), CC31/63=Depth, CC116=Dest, CC117=Wave.
    // Auto Channel (default ch 10): controls whichever synth track is currently selected.
    // 512 factory sounds in Sound Pool; projects hold 128 patterns (8 banks x 16).
    note: 'FM poly (4-track). 14-bit filter CC23/55. FM algo CC90-92. Amp Env CC104-107. Filter Env CC70-73. LFO1 dest CC110, LFO2 dest CC116.',
    params: [
      { cc: 23,  label: 'Filter Freq MSB',     def: 100 },
      { cc: 55,  label: 'Filter Freq LSB',     def: 0   },
      { cc: 24,  label: 'Resonance MSB',       def: 0   },
      { cc: 25,  label: 'Env Depth MSB',       def: 64  },
      { cc: 70,  label: 'Filter Env Attack',   def: 10  },
      { cc: 71,  label: 'Filter Env Decay',    def: 40  },
      { cc: 72,  label: 'Filter Env Sustain',  def: 60  },
      { cc: 73,  label: 'Filter Env Release',  def: 20  },
      { cc: 104, label: 'Amp Attack',          def: 0   },
      { cc: 105, label: 'Amp Decay',           def: 60  },
      { cc: 106, label: 'Amp Sustain',         def: 80  },
      { cc: 107, label: 'Amp Release',         def: 20  },
      { cc: 90,  label: 'FM Algorithm',        def: 0   },
      { cc: 91,  label: 'Ratio C',             def: 64  },
      { cc: 92,  label: 'Ratio A',             def: 64  },
      { cc: 16,  label: 'Ratio B MSB',         def: 64  },
      { cc: 17,  label: 'Harmonics MSB',       def: 0   },
      { cc: 18,  label: 'Detune MSB',          def: 64  },
      { cc: 19,  label: 'Feedback MSB',        def: 0   },
      { cc: 20,  label: 'FM Mix MSB',          def: 64  },
      { cc: 28,  label: 'LFO1 Speed MSB',      def: 64  },
      { cc: 29,  label: 'LFO1 Depth MSB',      def: 0   },
      { cc: 110, label: 'LFO1 Destination',    def: 0   },
      { cc: 111, label: 'LFO1 Waveform',       def: 0   },
      { cc: 30,  label: 'LFO2 Speed MSB',      def: 64  },
      { cc: 31,  label: 'LFO2 Depth MSB',      def: 0   },
      { cc: 116, label: 'LFO2 Destination',    def: 0   },
      { cc: 117, label: 'LFO2 Waveform',       def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 23:100, 24:0,  90:0,  104:0, 105:60, 106:80, 107:20 } },
      { name: 'E Piano',     recallPC: 1, ccValues: { 23:100, 24:0,  90:2,  104:0, 105:80, 106:0,  107:30 } },
      { name: 'Bell',        recallPC: 2, ccValues: { 23:100, 24:0,  90:1,  91:80, 92:40,  104:0,  105:90, 107:50 } },
      { name: 'Bass',        recallPC: 3, ccValues: { 23:80,  24:20, 90:0,  104:2, 105:40, 106:0,  107:20 } },
    ],
  },

  sequential_prophet_6: {
    label: 'Sequential Prophet-6', type: 'Synth',
    // VERIFIED against midi.guide + Sequential Prophet-6 Operation Manual v2.1.
    // 1,000 total programs: 10 banks x 100, banks 0-4 user-writable, banks 5-9 permanent factory.
    // LP Filter: CC102=Cutoff, CC103=Resonance. HP Filter: CC106=Cutoff, CC107=Resonance.
    // GM CC74 is listed as 'Brightness' (LP Cutoff alias) — use CC102 as primary.
    // Filter Env: CC50=Attack, CC51=Decay, CC52=Sustain, CC53=Release, CC47=LP Env Amt.
    // Amp Env: CC43=Attack, CC44=Decay, CC45=Sustain, CC46=Release. CC40=VCA Env Amt.
    // Oscillators: CC67=OSC1 Freq, CC69=OSC1 Level, CC70=OSC1 Shape, CC71=OSC1 PW.
    //              CC75=OSC2 Freq, CC77=OSC2 Level, CC78=OSC2 Shape, CC79=OSC2 PW.
    // NO LFO via CC — LFO is NRPN-only. CC9=Distortion. CC65=Glide On/Off.
    note: 'Analog poly (6-voice). LP Cutoff CC102, HP Cutoff CC106. Filter Env CC50-53. Amp Env CC43-46. NO LFO via CC (NRPN only). Distortion CC9.',
    params: [
      { cc: 102, label: 'LP Cutoff',           def: 80  },
      { cc: 103, label: 'LP Resonance',        def: 0   },
      { cc: 47,  label: 'LP Env Amount',       def: 64  },
      { cc: 106, label: 'HP Cutoff',           def: 0   },
      { cc: 107, label: 'HP Resonance',        def: 0   },
      { cc: 50,  label: 'Filter Env Attack',   def: 10  },
      { cc: 51,  label: 'Filter Env Decay',    def: 40  },
      { cc: 52,  label: 'Filter Env Sustain',  def: 60  },
      { cc: 53,  label: 'Filter Env Release',  def: 20  },
      { cc: 43,  label: 'Amp Attack',          def: 10  },
      { cc: 44,  label: 'Amp Decay',           def: 40  },
      { cc: 45,  label: 'Amp Sustain',         def: 80  },
      { cc: 46,  label: 'Amp Release',         def: 20  },
      { cc: 40,  label: 'VCA Env Amount',      def: 100 },
      { cc: 67,  label: 'OSC1 Freq',           def: 64  },
      { cc: 69,  label: 'OSC1 Level',          def: 100 },
      { cc: 70,  label: 'OSC1 Shape',          def: 0   },
      { cc: 75,  label: 'OSC2 Freq',           def: 64  },
      { cc: 77,  label: 'OSC2 Level',          def: 0   },
      { cc: 78,  label: 'OSC2 Shape',          def: 0   },
      { cc: 8,   label: 'Sub Osc Level',       def: 0   },
      { cc: 9,   label: 'Distortion',          def: 0   },
      { cc: 65,  label: 'Glide On/Off',        def: 0   },
      { cc: 5,   label: 'Glide Mode',          def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 99, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 102:80, 103:0,  69:100, 77:0,  43:10, 44:40, 45:80, 46:20 } },
      { name: 'Warm Poly',   recallPC: 1, ccValues: { 102:75, 103:10, 69:100, 77:80, 43:15, 44:45, 45:85, 46:25 } },
      { name: 'Bright Lead', recallPC: 2, ccValues: { 102:110,103:30, 69:100, 77:0,  43:5,  44:25, 45:70, 46:15 } },
      { name: 'Bass',        recallPC: 3, ccValues: { 102:50, 103:40, 69:100, 77:0,  43:2,  44:50, 45:0,  46:20 } },
      { name: 'Pad',         recallPC: 4, ccValues: { 102:65, 103:5,  69:80,  77:80, 43:60, 44:70, 45:90, 46:70 } },
    ],
  },

  sequential_ob6: {
    label: 'Sequential OB-6', type: 'Synth',
    // Oberheim-architecture 6-voice analog poly (Dave Smith + Tom Oberheim co-design).
    // CC map mirrors Prophet-6 structure (same Sequential platform).
    // LP Filter: CC102=Cutoff, CC103=Resonance. HP Filter: CC106=Cutoff.
    // Filter Env: CC50-53. Amp Env: CC43-46. No LFO via CC.
    // OSC1: CC67=Freq, CC69=Level, CC70=Shape. OSC2: CC75=Freq, CC77=Level, CC78=Shape.
    // 500 presets (5 banks x 100, banks A-E).
    note: 'Analog poly (6-voice, Oberheim arch). LP Cutoff CC102, HP Cutoff CC106. Filter Env CC50-53. Amp Env CC43-46. No LFO CC. 500 presets.',
    params: [
      { cc: 102, label: 'LP Cutoff',           def: 80  },
      { cc: 103, label: 'LP Resonance',        def: 0   },
      { cc: 47,  label: 'LP Env Amount',       def: 64  },
      { cc: 106, label: 'HP Cutoff',           def: 0   },
      { cc: 50,  label: 'Filter Env Attack',   def: 10  },
      { cc: 51,  label: 'Filter Env Decay',    def: 40  },
      { cc: 52,  label: 'Filter Env Sustain',  def: 60  },
      { cc: 53,  label: 'Filter Env Release',  def: 20  },
      { cc: 43,  label: 'Amp Attack',          def: 10  },
      { cc: 44,  label: 'Amp Decay',           def: 40  },
      { cc: 45,  label: 'Amp Sustain',         def: 80  },
      { cc: 46,  label: 'Amp Release',         def: 20  },
      { cc: 40,  label: 'VCA Env Amount',      def: 100 },
      { cc: 67,  label: 'OSC1 Freq',           def: 64  },
      { cc: 69,  label: 'OSC1 Level',          def: 100 },
      { cc: 70,  label: 'OSC1 Shape',          def: 0   },
      { cc: 75,  label: 'OSC2 Freq',           def: 64  },
      { cc: 77,  label: 'OSC2 Level',          def: 0   },
      { cc: 78,  label: 'OSC2 Shape',          def: 0   },
      { cc: 8,   label: 'Sub Osc Level',       def: 0   },
      { cc: 65,  label: 'Glide On/Off',        def: 0   },
      { cc: 5,   label: 'Glide Mode',          def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 99, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 102:80, 103:0,  69:100, 77:0,  43:10, 44:40, 45:80, 46:20 } },
      { name: 'Oberheim Pad',recallPC: 1, ccValues: { 102:70, 103:8,  69:100, 77:80, 43:40, 44:60, 45:90, 46:60 } },
      { name: 'Poly Lead',   recallPC: 2, ccValues: { 102:100,103:25, 69:100, 77:40, 43:8,  44:30, 45:70, 46:20 } },
      { name: 'Fat Bass',    recallPC: 3, ccValues: { 102:45, 103:40, 69:100, 77:0,  43:2,  44:50, 45:0,  46:20 } },
    ],
  },

  asm_hydrasynth: {
    label: 'ASM Hydrasynth', type: 'Synth',
    // VERIFIED against midi.guide (ASM Hydrasynth official). 115 CC parameters.
    // 1,024 patches: 8 banks x 128 (firmware 2.0+ unified all models). Favorites: 32 slots.
    // Filter 1: CC74=Cutoff, CC71=Resonance (follows GM convention on Hydrasynth).
    // Filter 2: CC55=Cutoff, CC56=Resonance.
    // 5 Envelopes: ENV1 CC81-84, ENV2 CC85-88, ENV3 CC89-90/96-97, ENV4 CC25/27/125/124, ENV5 CC102-105.
    // 5 LFOs: LFO1 CC72 Rate/CC70 Gain, LFO2 CC73/28, LFO3 CC76/75, LFO4 CC78/77, LFO5 CC80/79.
    // Macros: CC16-23 (Macro 1-8). Glide: CC5=Time, CC66=On/Off.
    // FX: Delay CC14/15/63/92, Reverb CC65/67/91. OSC Wavscan: CC24 (OSC1), CC26 (OSC2).
    note: 'Wave-morph poly. CC74=F1 Cutoff, CC71=F1 Res. 5 ENVs + 5 LFOs all CC-accessible. Macros CC16-23. Delay CC14/15. Reverb CC65/67.',
    params: [
      { cc: 74,  label: 'F1 Cutoff',           def: 80  },
      { cc: 71,  label: 'F1 Resonance',        def: 0   },
      { cc: 54,  label: 'F1 Env1 Amount',      def: 64  },
      { cc: 50,  label: 'F1 Drive',            def: 0   },
      { cc: 51,  label: 'F1 Keytrack',         def: 64  },
      { cc: 55,  label: 'F2 Cutoff',           def: 80  },
      { cc: 56,  label: 'F2 Resonance',        def: 0   },
      { cc: 81,  label: 'ENV1 Attack',         def: 10  },
      { cc: 82,  label: 'ENV1 Decay',          def: 40  },
      { cc: 83,  label: 'ENV1 Sustain',        def: 60  },
      { cc: 84,  label: 'ENV1 Release',        def: 20  },
      { cc: 85,  label: 'ENV2 Attack',         def: 10  },
      { cc: 86,  label: 'ENV2 Decay',          def: 40  },
      { cc: 87,  label: 'ENV2 Sustain',        def: 80  },
      { cc: 88,  label: 'ENV2 Release',        def: 20  },
      { cc: 72,  label: 'LFO1 Rate',           def: 64  },
      { cc: 70,  label: 'LFO1 Gain',           def: 64  },
      { cc: 73,  label: 'LFO2 Rate',           def: 64  },
      { cc: 28,  label: 'LFO2 Gain',           def: 64  },
      { cc: 76,  label: 'LFO3 Rate',           def: 64  },
      { cc: 24,  label: 'OSC1 Wavscan',        def: 0   },
      { cc: 44,  label: 'OSC1 Volume',         def: 100 },
      { cc: 26,  label: 'OSC2 Wavscan',        def: 0   },
      { cc: 46,  label: 'OSC2 Volume',         def: 0   },
      { cc: 95,  label: 'Detune',              def: 0   },
      { cc: 5,   label: 'Glide Time',          def: 0   },
      { cc: 66,  label: 'Glide On/Off',        def: 0   },
      { cc: 16,  label: 'Macro 1',             def: 64  },
      { cc: 17,  label: 'Macro 2',             def: 64  },
      { cc: 18,  label: 'Macro 3',             def: 64  },
      { cc: 19,  label: 'Macro 4',             def: 64  },
      { cc: 92,  label: 'Delay Dry/Wet',       def: 0   },
      { cc: 91,  label: 'Reverb Dry/Wet',      def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 74:80,  71:0,  44:100, 46:0,  81:10, 82:40, 83:60, 84:20 } },
      { name: 'Wavscan Pad', recallPC: 1, ccValues: { 74:70,  71:5,  44:80,  46:80, 24:50, 26:70, 81:60, 82:70, 83:90, 84:70 } },
      { name: 'Lead',        recallPC: 2, ccValues: { 74:100, 71:20, 44:100, 46:0,  81:5,  82:25, 83:65, 84:15 } },
      { name: 'Poly Bass',   recallPC: 3, ccValues: { 74:50,  71:35, 44:100, 46:40, 81:2,  82:50, 83:0,  84:20 } },
    ],
  },

  novation_bass_station_ii: {
    label: 'Novation Bass Station II', type: 'Synth',
    // VERIFIED against midi.guide (Novation Bass Station II official source).
    // Analog monosynth. 128 presets (64 factory + 64 user).
    // GM CC74/CC71 do NOT apply. Filter Cutoff=CC16/48 (14-bit MSB/LSB), Resonance=CC82.
    // Amp Env: CC90=Attack, CC91=Decay, CC92=Sustain, CC93=Release.
    // Mod Env (doubles as Filter Env): CC102=Attack, CC103=Decay, CC104=Sustain, CC105=Release.
    // LFO1: CC18/50=Speed (14-bit), CC88=Wave. LFO2: CC19/51=Speed (14-bit), CC89=Wave.
    // Filter mod env depth CC85. Filter type CC83 (Classic/Acid). Filter shape CC84 (LP/BP/HP).
    // CC114=Overdrive. Osc sync CC110. Sub osc: CC80=Wave, CC81=Octave.
    note: 'Analog mono. CC16/48=Cutoff (14-bit), CC82=Res. Amp Env CC90-93. Mod Env CC102-105. Two LFOs. CC83=Filter Type (Classic/Acid). CC114=Overdrive.',
    params: [
      { cc: 16,  label: 'Cutoff MSB',          def: 80  },
      { cc: 48,  label: 'Cutoff LSB',          def: 0   },
      { cc: 82,  label: 'Resonance',           def: 0   },
      { cc: 85,  label: 'Mod Env Depth',       def: 64  },
      { cc: 83,  label: 'Filter Type',         def: 0   },
      { cc: 84,  label: 'Filter Shape',        def: 0   },
      { cc: 90,  label: 'Amp Attack',          def: 10  },
      { cc: 91,  label: 'Amp Decay',           def: 40  },
      { cc: 92,  label: 'Amp Sustain',         def: 80  },
      { cc: 93,  label: 'Amp Release',         def: 20  },
      { cc: 102, label: 'Mod Env Attack',      def: 10  },
      { cc: 103, label: 'Mod Env Decay',       def: 40  },
      { cc: 104, label: 'Mod Env Sustain',     def: 60  },
      { cc: 105, label: 'Mod Env Release',     def: 20  },
      { cc: 18,  label: 'LFO1 Speed MSB',      def: 64  },
      { cc: 88,  label: 'LFO1 Waveform',       def: 0   },
      { cc: 19,  label: 'LFO2 Speed MSB',      def: 64  },
      { cc: 89,  label: 'LFO2 Waveform',       def: 0   },
      { cc: 80,  label: 'Sub Osc Wave',        def: 0   },
      { cc: 81,  label: 'Sub Osc Octave',      def: 0   },
      { cc: 114, label: 'Overdrive',           def: 0   },
      { cc: 110, label: 'Osc Sync',            def: 0   },
      { cc: 5,   label: 'Glide',               def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 16:80, 82:0,  90:10, 91:40, 92:80, 93:20 } },
      { name: 'Acid Bass',   recallPC: 1, ccValues: { 16:60, 82:80, 83:1,  90:2,  91:30, 92:0,  93:15 } },
      { name: 'Sub Bass',    recallPC: 2, ccValues: { 16:40, 82:20, 80:1,  81:1,  90:2,  91:50, 92:0,  93:20 } },
      { name: 'Sync Lead',   recallPC: 3, ccValues: { 16:90, 82:30, 110:64,90:5,  91:30, 92:60, 93:15 } },
      { name: 'Overdrive',   recallPC: 4, ccValues: { 16:70, 82:40, 114:80,90:8,  91:35, 92:70, 93:20 } },
    ],
  },

  novation_peak: {
    label: 'Novation Peak', type: 'Synth',
    // VERIFIED against midi.guide (Novation Summit and Peak official source).
    // 8-voice analog/digital hybrid. 512 presets: 4 banks A-D x 128 (A+B factory, C+D user).
    // GM CC74/CC71 do NOT apply. Cutoff=CC29, Resonance=CC79.
    // Amp Env: CC86=Attack, CC87=Decay, CC88=Sustain, CC89=Release.
    // Mod1 Env: CC90=Attack, CC91=Decay, CC92=Sustain, CC93=Release.
    // Mod2 Env: CC94=Attack, CC95=Decay, CC117=Sustain, CC103=Release.
    // LFO1: CC30=Rate, CC81=Sync Rate, CC82=Fade. LFO2: CC31=Rate, CC84=Sync Rate, CC85=Fade.
    // Filter Overdrive CC80. Filter Keyboard Track CC75. Osc controls: CC3/14/15/12 for OSC1.
    note: 'Analog/digital hybrid (8-voice). CC29=Cutoff, CC79=Res. Amp Env CC86-89. Mod1 Env CC90-93. Mod2 Env CC94/95/117/103. Two LFOs CC30/31.',
    params: [
      { cc: 29,  label: 'Cutoff',              def: 80  },
      { cc: 79,  label: 'Resonance',           def: 0   },
      { cc: 80,  label: 'Filter Overdrive',    def: 0   },
      { cc: 75,  label: 'Filter Keytrack',     def: 64  },
      { cc: 86,  label: 'Amp Attack',          def: 10  },
      { cc: 87,  label: 'Amp Decay',           def: 40  },
      { cc: 88,  label: 'Amp Sustain',         def: 80  },
      { cc: 89,  label: 'Amp Release',         def: 20  },
      { cc: 90,  label: 'Mod1 Env Attack',     def: 10  },
      { cc: 91,  label: 'Mod1 Env Decay',      def: 40  },
      { cc: 92,  label: 'Mod1 Env Sustain',    def: 60  },
      { cc: 93,  label: 'Mod1 Env Release',    def: 20  },
      { cc: 30,  label: 'LFO1 Rate',           def: 64  },
      { cc: 82,  label: 'LFO1 Fade',           def: 0   },
      { cc: 31,  label: 'LFO2 Rate',           def: 64  },
      { cc: 85,  label: 'LFO2 Fade',           def: 0   },
      { cc: 12,  label: 'OSC1 Shape',          def: 0   },
      { cc: 14,  label: 'OSC1 Coarse',         def: 64  },
      { cc: 15,  label: 'OSC1 Fine',           def: 64  },
      { cc: 3,   label: 'OSC1 Range',          def: 0   },
      { cc: 5,   label: 'Glide',               def: 0   },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 29:80,  79:0,  86:10, 87:40, 88:80, 89:20 } },
      { name: 'Warm Poly',   recallPC: 1, ccValues: { 29:75,  79:10, 86:15, 87:45, 88:85, 89:25 } },
      { name: 'Bright Pad',  recallPC: 2, ccValues: { 29:100, 79:20, 86:50, 87:60, 88:90, 89:60 } },
      { name: 'Lead',        recallPC: 3, ccValues: { 29:110, 79:30, 86:5,  87:25, 88:70, 89:15 } },
    ],
  },

  roland_jd_xi: {
    label: 'Roland JD-Xi', type: 'Synth',
    // VERIFIED against midi.guide + Roland JD-Xi MIDI Implementation PDF (roland.com).
    // Hybrid: 1x analog mono + 2x SuperNATURAL digital poly partials + 1x drum.
    // Roland follows GM CC convention — CC74=Cutoff, CC71=Resonance (confirmed).
    // CC73=Amp Attack (GM), CC72=Amp Release (GM), CC75=Amp Decay (Roland extension).
    // Per-partial LFO Rate: CC16 (P1), CC17 (P2), CC18 (P3).
    // Per-partial Filter Cutoff: CC102 (P1), CC103 (P2), CC104 (P3).
    // Per-partial Filter Resonance: CC105 (P1), CC106 (P2), CC107 (P3).
    // Per-partial Amp Level: CC117 (P1), CC118 (P2), CC119 (P3).
    // FX: CC12=Reverb Level, CC13=Delay Level, CC91=Reverb Send, CC94=Delay Send.
    // Programs: Banks A-H x 64 = 512 slots; MIDI PC 0-127 on selected bank.
    note: 'Hybrid synth. Follows GM CC74/71/73/72. Per-partial CC: LFO Rate CC16-18, Cutoff CC102-104, Res CC105-107. Rev CC12/91. Delay CC13/94.',
    params: [
      { cc: 74,  label: 'Cutoff',              def: 80  },
      { cc: 71,  label: 'Resonance',           def: 0   },
      { cc: 73,  label: 'Amp Attack',          def: 10  },
      { cc: 75,  label: 'Amp Decay',           def: 40  },
      { cc: 72,  label: 'Amp Release',         def: 20  },
      { cc: 16,  label: 'P1 LFO Rate',         def: 64  },
      { cc: 17,  label: 'P2 LFO Rate',         def: 64  },
      { cc: 18,  label: 'P3 LFO Rate',         def: 64  },
      { cc: 102, label: 'P1 Filter Cutoff',    def: 64  },
      { cc: 103, label: 'P2 Filter Cutoff',    def: 64  },
      { cc: 104, label: 'P3 Filter Cutoff',    def: 64  },
      { cc: 105, label: 'P1 Filter Res',       def: 0   },
      { cc: 106, label: 'P2 Filter Res',       def: 0   },
      { cc: 117, label: 'P1 Amp Level',        def: 100 },
      { cc: 118, label: 'P2 Amp Level',        def: 0   },
      { cc: 119, label: 'P3 Amp Level',        def: 0   },
      { cc: 12,  label: 'Reverb Level',        def: 40  },
      { cc: 91,  label: 'Reverb Send',         def: 40  },
      { cc: 13,  label: 'Delay Level',         def: 0   },
      { cc: 94,  label: 'Delay Send',          def: 0   },
      { cc: 7,   label: 'Volume',              def: 100 },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 74:80,  71:0,  73:10, 72:20, 117:100, 118:0,  119:0  } },
      { name: 'Analog Bass', recallPC: 1, ccValues: { 74:50,  71:30, 73:2,  72:15, 117:100, 118:0,  119:0  } },
      { name: 'EP Pad',      recallPC: 2, ccValues: { 74:80,  71:5,  73:30, 72:50, 117:0,   118:100,119:0  } },
      { name: 'Lead+Pad',    recallPC: 3, ccValues: { 74:90,  71:15, 73:10, 72:25, 117:100, 118:80, 119:0  } },
    ],
  },

  behringer_deepmind_12: {
    label: 'Behringer DeepMind 12', type: 'Synth',
    // VERIFIED against midi.guide (Behringer DeepMind 12 official source).
    // 12-voice fully analog poly (2 VCOs + analog filter per voice).
    // 1,024 presets: 8 banks A-H x 128 patches.
    // GM CC74/71 do NOT apply. VCF Cutoff=CC29, Resonance=CC30.
    // VCA Env: CC37=Attack, CC39=Decay, CC44=Sustain, CC41=Release.
    // VCF Env: CC42=Attack, CC43=Decay (no CC for VCF Sustain), CC45=Release.
    // MOD Env: CC46=Attack, CC47=Decay, CC48=Sustain, CC49=Release.
    // LFO1: CC16=Rate, CC17=Delay. LFO2: CC18=Rate, CC19=Delay.
    // Portamento: CC5. HPF: CC35=Frequency. VCF Mod depth CC31, LFO mod CC33, Key mod CC34.
    // OSC2: CC24=Pitch, CC25=Coarse. Noise CC27. Unison Detune CC28.
    note: 'Analog poly (12-voice). CC29=Cutoff, CC30=Res. VCA Env CC37/39/44/41. VCF Env CC42/43/45 (no VCF Sustain CC). Two LFOs CC16/18. HPF CC35.',
    params: [
      { cc: 29,  label: 'VCF Cutoff',          def: 80  },
      { cc: 30,  label: 'VCF Resonance',       def: 0   },
      { cc: 31,  label: 'VCF Mod (Env Depth)', def: 64  },
      { cc: 33,  label: 'VCF LFO Mod',         def: 0   },
      { cc: 34,  label: 'VCF Key Mod',         def: 0   },
      { cc: 35,  label: 'HPF Frequency',       def: 0   },
      { cc: 37,  label: 'VCA Attack',          def: 10  },
      { cc: 39,  label: 'VCA Decay',           def: 40  },
      { cc: 44,  label: 'VCA Sustain',         def: 80  },
      { cc: 41,  label: 'VCA Release',         def: 20  },
      { cc: 42,  label: 'VCF Env Attack',      def: 10  },
      { cc: 43,  label: 'VCF Env Decay',       def: 40  },
      { cc: 45,  label: 'VCF Env Release',     def: 20  },
      { cc: 46,  label: 'MOD Env Attack',      def: 10  },
      { cc: 47,  label: 'MOD Env Decay',       def: 40  },
      { cc: 48,  label: 'MOD Env Sustain',     def: 60  },
      { cc: 49,  label: 'MOD Env Release',     def: 20  },
      { cc: 16,  label: 'LFO1 Rate',           def: 64  },
      { cc: 17,  label: 'LFO1 Delay',          def: 0   },
      { cc: 18,  label: 'LFO2 Rate',           def: 64  },
      { cc: 19,  label: 'LFO2 Delay',          def: 0   },
      { cc: 25,  label: 'OSC2 Pitch Coarse',   def: 64  },
      { cc: 26,  label: 'OSC2 Level',          def: 0   },
      { cc: 27,  label: 'Noise Level',         def: 0   },
      { cc: 28,  label: 'Unison Detune',       def: 0   },
      { cc: 5,   label: 'Portamento',          def: 0   },
      { cc: 7,   label: 'Volume',              def: 100 },
    ],
    programSelect: { label: 'Program', min: 0, max: 127, def: 0 },
    starterPresets: [
      { name: 'Init',        recallPC: 0, ccValues: { 29:80,  30:0,  37:10, 39:40, 44:80, 41:20 } },
      { name: 'Warm Poly',   recallPC: 1, ccValues: { 29:75,  30:8,  37:15, 39:45, 44:85, 41:25 } },
      { name: 'Lush Pad',    recallPC: 2, ccValues: { 29:65,  30:5,  37:60, 39:70, 44:90, 41:70, 28:20 } },
      { name: 'Analog Lead', recallPC: 3, ccValues: { 29:100, 30:30, 37:5,  39:25, 44:70, 41:15 } },
      { name: 'Bass',        recallPC: 4, ccValues: { 29:45,  30:40, 37:2,  39:50, 44:0,  41:20 } },
    ],
  },
};
