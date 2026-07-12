import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pedalLib, deviceDefs, createGearItem, createBoard, normalizeGearItem, normalizeBoard, isValidBank, PROGRAM_CHANGE_MAX } from '../src/gear/index.js';

// Categories without a pedalboard footprint — skip physical dimension checks for these.
// Amps, cabs, audio interfaces, and DI boxes get their layout dims from KIND_DIMS in the app.
const NON_PEDALBOARD_CATS = new Set(['Synthesizer', 'Drum machine', 'Outboard', 'DI box', 'Amp', 'Cab', 'Audio interface']);

test('pedalLib has entries with required fields', () => {
  assert.ok(Object.keys(pedalLib).length > 60, 'should have 60+ pedals');
  for (const [name, p] of Object.entries(pedalLib)) {
    assert.ok(typeof p.v === 'number',   `${name}: missing v`);
    assert.ok(typeof p.ma === 'number',  `${name}: missing ma`);
    assert.ok(typeof p.cat === 'string', `${name}: missing cat`);
    if (!NON_PEDALBOARD_CATS.has(p.cat) && !p.sw) {
      assert.ok(typeof p.w === 'number',   `${name}: missing w`);
      assert.ok(typeof p.d === 'number',   `${name}: missing d`);
      assert.ok(typeof p.inJ === 'string', `${name}: missing inJ`);
    }
  }
});

test('deviceDefs have params arrays', () => {
  assert.ok(Object.keys(deviceDefs).length > 20, 'should have 20+ device defs');
  for (const [key, def] of Object.entries(deviceDefs)) {
    assert.ok(typeof def.label === 'string', `${key}: missing label`);
    assert.ok(typeof def.type === 'string',  `${key}: missing type`);
    assert.ok(Array.isArray(def.params),     `${key}: params must be array`);
    for (const p of def.params) {
      assert.ok(typeof p.cc === 'number',    `${key}: param missing cc`);
      assert.ok(typeof p.label === 'string', `${key}: param missing label`);
      assert.ok(typeof p.def === 'number',   `${key}: param missing def`);
    }
  }
});

test('createGearItem round-trips with _v:1', () => {
  const item = createGearItem({ name: 'Boss DS-1', defKey: 'Boss DS-1 Distortion' });
  assert.equal(item._v, 1);
  assert.equal(item.name, 'Boss DS-1');
  assert.ok(typeof item.id === 'string');
  assert.deepEqual(item.boardIds, []);

  // Preserve-unknown: spread + re-save keeps extra fields
  const updated = { ...item, notes: 'added later', newField: 42 };
  assert.equal(updated._v, 1);
  assert.equal(updated.newField, 42);
  assert.equal(updated.name, 'Boss DS-1');
});

test('createBoard contains devices', () => {
  const item = createGearItem({ name: 'TC Polytune 3' });
  const board = createBoard({ name: 'Main Board', devices: [item] });
  assert.equal(board._v, 1);
  assert.equal(board.devices.length, 1);
  assert.equal(board.devices[0].name, 'TC Polytune 3');
});

test('normalizeGearItem is idempotent', () => {
  const legacy = { id: 'abc', name: 'Old Pedal' }; // no _v
  const normalized = normalizeGearItem(legacy);
  assert.equal(normalized._v, 1);
  assert.equal(normalized.name, 'Old Pedal');

  const again = normalizeGearItem(normalized);
  assert.equal(again._v, 1); // already has _v, untouched
});

test('normalizeGearItem backfills createGearItem invariants even when _v is already present', () => {
  // A legacy / hand-synced item can carry _v:1 without ever passing through
  // createGearItem — boardIds/customParams/presets/boardId must still land as arrays,
  // otherwise consumer code doing item.presets.map / item.boardIds.includes crashes.
  const legacy = { id: 'x', name: 'Hand-synced Pedal', _v: 1 };
  const normalized = normalizeGearItem(legacy);
  assert.equal(normalized._v, 1);
  assert.deepEqual(normalized.boardIds, []);
  assert.deepEqual(normalized.customParams, []);
  assert.deepEqual(normalized.presets, []);
  assert.equal(normalized.boardId, null);
  assert.doesNotThrow(() => normalized.presets.map((p) => p));
  assert.doesNotThrow(() => normalized.boardIds.includes('board-1'));
});

test('normalizeBoard normalizes nested devices', () => {
  const legacy = { id: 'b1', name: 'My Rig', devices: [{ id: 'd1', name: 'DS-1' }] };
  const board = normalizeBoard(legacy);
  assert.equal(board._v, 1);
  assert.equal(board.devices[0]._v, 1);
});

test('normalizeBoard runs the device map even when board._v is already present (P2-2)', () => {
  // Fix: used to skip normalization entirely once board._v was truthy — a
  // hand-synced _v:1 board with array-less devices would then crash
  // consumers doing item.presets.map / item.boardIds.includes, the exact
  // hole normalizeGearItem's own "backfill even when _v present" fix was for.
  const handSynced = { _v: 1, id: 'b1', name: 'My Rig', devices: [{ id: 'd1', name: 'DS-1', _v: 1 }] };
  const board = normalizeBoard(handSynced);
  assert.deepEqual(board.devices[0].presets, []);
  assert.deepEqual(board.devices[0].boardIds, []);
  assert.doesNotThrow(() => board.devices[0].presets.map(p => p));
  assert.doesNotThrow(() => board.devices[0].boardIds.includes('x'));
});

test('starterPresets have required fields', () => {
  for (const [key, def] of Object.entries(deviceDefs)) {
    for (const sp of (def.starterPresets || [])) {
      assert.ok(typeof sp.name === 'string',          `${key}: starterPreset missing name`);
      assert.ok(typeof sp.recallPC === 'number',      `${key}: starterPreset missing recallPC`);
      assert.ok(typeof sp.ccValues === 'object',      `${key}: starterPreset missing ccValues`);
    }
  }
});

// Data-integrity invariants over the hand-entered 96-device CC map. Type checks above are not enough:
// the header says "these fire at real pedals," so a single bad value sends garbage MIDI to hardware.
// This is the test that catches the Korg minilogue xd recallPC 128-199 defect and future community
// gear submissions. A raw MIDI data byte is 7-bit (0-127); programs beyond the first bank need a bank.
const in7bit = (v) => Number.isInteger(v) && v >= 0 && v <= PROGRAM_CHANGE_MAX;

test('deviceDefs: no duplicate CC within a device', () => {
  for (const [key, def] of Object.entries(deviceDefs)) {
    const seen = new Set();
    for (const p of (def.params || [])) {
      assert.ok(!seen.has(p.cc), `${key}: duplicate CC ${p.cc}`);
      seen.add(p.cc);
    }
  }
});

test('deviceDefs: every cc, default, option val and preset ccValue is a 7-bit value', () => {
  for (const [key, def] of Object.entries(deviceDefs)) {
    for (const p of (def.params || [])) {
      assert.ok(in7bit(p.cc),  `${key}: param cc ${p.cc} not 0-127`);
      assert.ok(in7bit(p.def), `${key}: cc${p.cc} default ${p.def} not 0-127`);
      for (const o of (p.options || [])) {
        assert.ok(in7bit(o.val), `${key}: cc${p.cc} option "${o.label}" val ${o.val} not 0-127`);
        assert.ok(in7bit(o.max), `${key}: cc${p.cc} option "${o.label}" max ${o.max} not 0-127`);
      }
    }
    for (const sp of (def.starterPresets || [])) {
      for (const [cc, v] of Object.entries(sp.ccValues || {})) {
        assert.ok(in7bit(v), `${key}: preset "${sp.name}" cc${cc} value ${v} not 0-127`);
      }
    }
  }
});

test('deviceDefs: option bands have strictly increasing max, ending at 127', () => {
  for (const [key, def] of Object.entries(deviceDefs)) {
    for (const p of (def.params || [])) {
      if (!Array.isArray(p.options) || !p.options.length) continue;
      let prev = -1;
      for (const o of p.options) {
        assert.ok(o.max > prev, `${key}: cc${p.cc} option "${o.label}" max ${o.max} not > previous ${prev}`);
        prev = o.max;
      }
      assert.equal(prev, 127, `${key}: cc${p.cc} last option band max is ${prev}, must cover to 127`);
    }
  }
});

test('deviceDefs: starterPreset ccValues keys are a subset of the device param CCs', () => {
  for (const [key, def] of Object.entries(deviceDefs)) {
    const paramCCs = new Set((def.params || []).map((p) => p.cc));
    for (const sp of (def.starterPresets || [])) {
      for (const cc of Object.keys(sp.ccValues || {})) {
        assert.ok(paramCCs.has(Number(cc)), `${key}: preset "${sp.name}" references undeclared cc${cc}`);
      }
    }
  }
});

test('deviceDefs: recallPC is -1 or in [programSelect.min, min(max,127)] unless a valid bank is present', () => {
  for (const [key, def] of Object.entries(deviceDefs)) {
    const ps = def.programSelect;
    const lo = ps ? ps.min : 0;
    const hi = ps ? Math.min(ps.max, PROGRAM_CHANGE_MAX) : PROGRAM_CHANGE_MAX;
    for (const sp of (def.starterPresets || [])) {
      if (sp.recallPC === -1) continue;
      // A recallPC is always sent as a raw 7-bit Program Change byte.
      assert.ok(in7bit(sp.recallPC), `${key}: preset "${sp.name}" recallPC ${sp.recallPC} is not a 7-bit PC byte`);
      if (sp.bank !== undefined) {
        assert.ok(isValidBank(sp.bank), `${key}: preset "${sp.name}" has an invalid bank ${JSON.stringify(sp.bank)}`);
        continue; // bank + a valid PC byte can reach any program; range check does not apply
      }
      assert.ok(
        sp.recallPC >= lo && sp.recallPC <= hi,
        `${key}: preset "${sp.name}" recallPC ${sp.recallPC} outside [${lo},${hi}] and has no bank`
      );
    }
  }
});
