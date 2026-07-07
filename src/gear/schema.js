// @gp/gear schema factories.
// Every stored object has _v: 1. Consumers must spread-merge on write — see SCHEMA_RULES.md.

let _idSeed = 0;
function uid() {
  _idSeed++;
  return _idSeed.toString(36) + Math.floor(Math.random() * 1e6).toString(36);
}

// A MIDI Program Change data byte is 7-bit. Anything above this cannot be sent as a raw PC;
// programs beyond the first bank require Bank Select (CC0 MSB / CC32 LSB) plus PC.
export const PROGRAM_CHANGE_MAX = 127;

/**
 * @typedef {object} Bank
 * @property {number} msb - Bank Select MSB, sent on CC0 (0-127)
 * @property {number} lsb - Bank Select LSB, sent on CC32 (0-127)
 */

/**
 * @typedef {object} StarterPreset
 * @property {string} name        - display name
 * @property {number} recallPC    - Program Change byte to send (0-127), or -1 for none
 * @property {object} ccValues    - { [cc]: value } snapshot applied on recall
 * @property {Bank}   [bank]      - optional Bank Select for multi-bank devices; when present the
 *                                  consumer emits Bank Select MSB (CC0) then LSB (CC32) before the PC.
 *                                  Lets recallPC stay a valid 0-127 byte while still reaching high programs.
 */

/**
 * True when b is a well-formed Bank: integer msb and lsb each within 0-127.
 * Shared so data-integrity checks and consumers agree on what a valid bank is.
 * @param {any} b
 * @returns {boolean}
 */
export function isValidBank(b) {
  return !!b
    && Number.isInteger(b.msb) && b.msb >= 0 && b.msb <= 127
    && Number.isInteger(b.lsb) && b.lsb >= 0 && b.lsb <= 127;
}

/**
 * A single device instance on a rig. This is the canonical GearItem type — shared between
 * the Tools pedalboard, RigWork's gear list, and any future consumer.
 *
 * All fields except id, _v, name are optional — clients must preserve unknown fields on write.
 *
 * @param {object} props
 * @param {string} [props.id]       - stable id (auto-generated if omitted)
 * @param {string} props.name       - display name
 * @param {string} [props.defKey]   - key into pedalLib (null = custom block)
 * @param {string} [props.devKey]   - key into deviceDefs (null = no MIDI template)
 * @param {string} [props.cat]      - category from pedalLib
 * @param {string} [props.type]     - MIDI device type from deviceDefs
 * @param {string} [props.kind]     - 'pedal' | 'snake' | 'patchbay' | 'amp' | 'rack' | 'other'
 * @param {number} [props.mA]       - power draw in mA
 * @param {number} [props.v]        - supply voltage
 * @param {number} [props.w]        - width in inches
 * @param {number} [props.d]        - depth in inches
 * @param {string} [props.inJ]      - input jack side (left/right/top/bottom)
 * @param {string} [props.outJ]     - output jack side
 * @param {string} [props.pwrJ]     - power jack side
 * @param {boolean} [props.midi]    - has MIDI
 * @param {number} [props.channel]  - MIDI channel (1-16)
 * @param {number} [props.pcCount]  - program change count
 * @param {boolean} [props.stereo]
 * @param {boolean} [props.hasFxLoop]
 * @param {boolean} [props.hasExpression]
 * @param {boolean} [props.sendsOnly]
 * @param {string} [props.notes]
 * @param {string} [props.chainNote]
 * @param {object} [props.bypass]   - { type:'cc'|'pc', cc?, off?, on?, pc? }
 * @param {boolean} [props.public]  - show in public Rig Rundown
 * @param {Array}  [props.customParams] - user-added { cc, label, def } controls
 * @param {Array}  [props.presets]  - device-level presets { id, name, recallPC, ccValues, bank? } (see StarterPreset)
 * @param {string[]} [props.boardIds]  - pedalboard IDs this device belongs to
 * @returns {object} GearItem with _v:1
 */
export function createGearItem(props = {}) {
  return {
    ...props,
    _v: 1,
    id: props.id || uid(),
    name: props.name || 'New Device',
    boardIds: props.boardIds || [],
    boardId: props.boardId ?? props.boardIds?.[0] ?? null,
    customParams: props.customParams || [],
    presets: props.presets || [],
  };
}

/**
 * A pedalboard / rig — contains an array of GearItems plus layout info.
 *
 * @param {object} props
 * @param {string} [props.id]
 * @param {string} props.name
 * @param {Array}  [props.devices]     - GearItem[]
 * @param {Array}  [props.pedalboards] - physical sub-boards within the rig
 * @returns {object} Board with _v:1
 */
export function createBoard(props = {}) {
  return {
    ...props,
    _v: 1,
    id: props.id || uid(),
    name: props.name || 'New Rig',
    devices: props.devices || [],
    pedalboards: props.pedalboards || [],
  };
}

/**
 * Ensure a loaded GearItem has _v AND the array/id invariants createGearItem
 * guarantees (boardIds, boardId, customParams, presets). Idempotent; does NOT
 * increment _v. Runs the backfill even when _v is already present — a legacy
 * or hand-synced item can carry _v:1 without ever having passed through
 * createGearItem, and consumers do `item.presets.map` / `item.boardIds.includes`
 * unconditionally.
 * Consumers call this on data loaded from localStorage / Supabase before using it.
 */
export function normalizeGearItem(item) {
  if (!item) return item;
  return {
    ...item,
    _v: 1,
    boardIds: item.boardIds || [],
    boardId: item.boardId ?? item.boardIds?.[0] ?? null,
    customParams: item.customParams || [],
    presets: item.presets || [],
  };
}

/**
 * Ensure a loaded Board has _v. Idempotent.
 */
export function normalizeBoard(board) {
  if (!board || board._v) return board;
  return {
    ...board,
    _v: 1,
    devices: (board.devices || []).map(normalizeGearItem),
  };
}
