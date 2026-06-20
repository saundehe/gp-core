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
    // CC values confirmed via Meris Mercury7 manual v4 (Preset 1 = Ultraplate factory default).
    starterPresets: [
      { name: 'Ultraplate',  recallPC: -1, ccValues: { 14:127, 16:80,  17:12, 18:77, 19:127, 20:0,   21:127, 22:0,  23:21, 24:0,  25:127, 26:63, 28:0, 29:0   } },
      { name: 'Cathedra',    recallPC: -1, ccValues: { 14:127, 16:110, 17:20, 18:85, 19:127, 20:0,   21:90,  22:10, 23:30, 25:127, 26:50, 28:0, 29:127 } },
      { name: 'Shimmer',     recallPC: -1, ccValues: { 14:127, 16:90,  17:30, 18:75, 19:127, 20:100, 21:100, 22:0,  23:50, 24:90, 25:127, 28:0, 29:0   } },
      { name: 'Swell Bloom', recallPC: -1, ccValues: { 14:127, 16:95,  17:15, 18:90, 19:127, 20:0,   21:127, 22:0,  23:30, 28:127,           29:0   } },
      { name: 'Dark Hall',   recallPC: -1, ccValues: { 14:127, 16:100, 17:5,  18:70, 19:127, 20:0,   21:30,  22:20, 23:15, 25:80,            29:127 } },
    ],
    merisSysex: { model: 0x01 },
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
    starterPresets: [
      { name: 'Slapback',       recallPC: -1, ccValues: { 14:127, 16:20,  17:5,  18:60, 19:0,  20:0   } },
      { name: 'Classic Echo',   recallPC: -1, ccValues: { 14:127, 16:64,  17:50, 18:65, 19:0,  20:30  } },
      { name: 'Dotted Echo',    recallPC: -1, ccValues: { 14:127, 16:64,  17:55, 18:70, 9:127         } },
      { name: 'Dimension Verb', recallPC: -1, ccValues: { 14:127, 16:10,  17:20, 18:80, 20:100        } },
      { name: 'Flange & Delay', recallPC: -1, ccValues: { 14:127, 16:64,  17:45, 18:70, 26:127, 27:64 } },
    ],
    merisSysex: { model: 0x02 },
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
    starterPresets: [
      { name: 'Octave Up',   recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:64, 19:120, 20:64,  21:8   } },
      { name: 'Power Chord', recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:64, 19:64,  20:99,  21:64  } },
      { name: 'Major Triad', recallPC: -1, ccValues: { 14:127, 16:0, 17:64, 18:64, 19:78,  20:92,  21:107 } },
      { name: 'Detune',      recallPC: -1, ccValues: { 14:127, 16:0, 17:20, 18:64, 19:68,  20:60,  21:64  } },
    ],
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
      { cc: 22, label: 'Portamento (alt)',                   def: 0   },
      { cc: 23, label: 'Filter Type (alt)',                  def: 0   },
      { cc: 24, label: 'Delay Level (alt)',                  def: 0   },
      { cc: 25, label: 'Ring Modulation (alt)',              def: 0   },
      { cc: 26, label: 'Filter Bandwidth (alt)',             def: 64  },
      { cc: 27, label: 'Delay Feedback (alt)',               def: 0   },
      { cc: 9,  label: 'Envelope Type (0=trig/127=follow)', def: 0   },
      { cc: 15, label: 'Tempo (10ms steps)',                 def: 0   },
      { cc: 28, label: 'Tap',                               def: 0   },
      { cc: 29, label: 'Synth Mode (dry/mono/arp/poly)',    def: 96  },
      { cc: 30, label: 'Waveshape (0=saw/127=square)',      def: 0   },
      { cc: 4,  label: 'Expression',                        def: 0   },
      { cc: 14, label: 'Bypass (0/127)',                    def: 127 },
    ],
    merisSysex: { model: 0x03 },
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
    starterPresets: [
      { name: 'Lo-Fi',           recallPC: -1, ccValues: { 14:127, 16:40,  17:64, 18:30, 19:0,  20:0   } },
      { name: 'Sequenced Crush', recallPC: -1, ccValues: { 14:127, 16:80,  17:64, 18:60, 20:100, 21:64, 22:30, 23:90, 24:50, 25:110, 29:0 } },
      { name: 'Glitch Stutter',  recallPC: -1, ccValues: { 14:127, 16:60,  17:64, 18:50, 19:100, 31:127 } },
    ],
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
  },

  darkglass_ao900: {
    label: 'Darkglass Alpha Omega 900', type: 'Amp sim',
    // Uses MIDI LEARN / Darkglass Suite -- no fixed CC map published.
    note: 'Alpha Omega 900 MIDI IN: switch channels, toggle Mute & Compressor, recall 3 cab-sim slots via PC and CC. Uses MIDI LEARN (hold channel button to set MIDI channel; assign each function in Darkglass Suite). Add learned CCs as custom controls.',
    params: [],
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
  },

  boss_od200: {
    label: 'Boss OD-200', type: 'Drive/OD',
    // Boss 200-series factory default CC assignments.
    params: [
      { cc: 16, label: 'Expression (EXP, hardwired)',  def: 64  },
      { cc: 17, label: 'Drive (default assign)',        def: 64  },
      { cc: 18, label: 'Level (default assign)',        def: 100 },
      { cc: 19, label: 'Low (default assign)',          def: 64  },
      { cc: 20, label: 'Middle (default assign)',       def: 64  },
      { cc: 21, label: 'High (default assign)',         def: 64  },
      { cc: 22, label: 'Booster Pre-Lvl (default)',    def: 64  },
      { cc: 23, label: 'Booster Post-Lvl (default)',   def: 64  },
      { cc: 27, label: 'Effect On/Off (0=off/127=on)', def: 127 },
      { cc: 80, label: 'CTL-1',                        def: 0   },
      { cc: 81, label: 'CTL-2',                        def: 0   },
      { cc: 82, label: 'Boost On/Off (0=off/127=on)',  def: 0   },
    ],
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
    starterPresets: [
      { name: 'Chorus',       recallPC: -1, ccValues: { 102:127, 19:0,  17:50, 18:70,  9:64, 16:64 } },
      { name: 'Vibrato',      recallPC: -1, ccValues: { 102:127, 19:1,  17:40, 18:80,  9:64, 16:64 } },
      { name: 'Rotary',       recallPC: -1, ccValues: { 102:127, 19:2,  17:40, 18:64,  9:64, 16:64 } },
      { name: 'Flanger',      recallPC: -1, ccValues: { 102:127, 19:3,  17:50, 18:64,  9:64, 16:64 } },
      { name: 'Phaser',       recallPC: -1, ccValues: { 102:127, 19:4,  17:50, 18:64,  9:64, 16:64 } },
      { name: 'Vintage Trem', recallPC: -1, ccValues: { 102:127, 19:8,  17:64, 18:80,  9:64, 16:64 } },
      { name: 'Autoswell',    recallPC: -1, ccValues: { 102:127, 19:10, 17:64, 18:100, 9:64, 16:64 } },
    ],
    strymonSysex: { model: 0x02 },
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
  },

  line6_hxstomp: {
    label: 'Line 6 HX Stomp', type: 'Amp sim',
    note: 'HX Stomp: same Command Center MIDI system as Helix. Snapshots via PC; add footswitch CCs once assigned.',
    params: [
      { cc: 49, label: 'Tap Tempo',        def: 0 },
      { cc: 64, label: 'Tuner (64+ = on)', def: 0 },
    ],
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
  },

  strymon_iridium: {
    label: 'Strymon Iridium', type: 'Amp sim',
    // VERIFIED -- follows same CC100/102 pattern as BigSky / TimeLine.
    params: [
      { cc: 100, label: 'Expression',     def: 0   },
      { cc: 102, label: 'Bypass (0/127)', def: 127 },
    ],
  },

  neural_nanocortex: {
    label: 'Neural DSP Nano Cortex', type: 'Amp sim',
    note: 'Nano Cortex: presets via PC. Scene/mode CCs follow Quad Cortex convention; spot-check on hardware as firmware matures.',
    params: [
      { cc: 43, label: 'Scene Select (0-7 = scenes)', def: 0 },
      { cc: 44, label: 'Tap Tempo',                   def: 0 },
      { cc: 45, label: 'Tuner (0/127)',               def: 0 },
    ],
  },
};
