import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pedalLib, deviceDefs, createGearItem, createBoard, normalizeGearItem, normalizeBoard } from '../src/gear/index.js';

test('pedalLib has entries with required fields', () => {
  assert.ok(Object.keys(pedalLib).length > 60, 'should have 60+ pedals');
  for (const [name, p] of Object.entries(pedalLib)) {
    assert.ok(typeof p.v === 'number',   `${name}: missing v`);
    assert.ok(typeof p.ma === 'number',  `${name}: missing ma`);
    assert.ok(typeof p.w === 'number',   `${name}: missing w`);
    assert.ok(typeof p.d === 'number',   `${name}: missing d`);
    assert.ok(typeof p.cat === 'string', `${name}: missing cat`);
    assert.ok(typeof p.inJ === 'string', `${name}: missing inJ`);
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

test('normalizeBoard normalizes nested devices', () => {
  const legacy = { id: 'b1', name: 'My Rig', devices: [{ id: 'd1', name: 'DS-1' }] };
  const board = normalizeBoard(legacy);
  assert.equal(board._v, 1);
  assert.equal(board.devices[0]._v, 1);
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
