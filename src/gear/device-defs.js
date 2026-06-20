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
