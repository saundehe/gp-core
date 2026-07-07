// Shared base64url codec: JSON -> UTF-8 -> base64url, and back.
// Used internally by @gp/part (part/codec.js), @gp/song's rig-track and
// showfile encoders. All three previously copy-pasted this exact routine with
// a per-byte `binary += String.fromCharCode(b)` loop, which is O(n^2) on
// large payloads (multi-song Show Files in a URL hash). This module builds
// the binary string in fixed-size chunks instead.
//
// Failure mode: decodeB64url throws on any parse/decode error. Each call site
// keeps its own fallback (decodePart -> null, decodeRigTrack -> [],
// decodeShowFile -> null) by wrapping the call in its own try/catch.

// Chunk size for String.fromCharCode.apply — comfortably under engine argument
// limits (V8's is ~65536-131072 depending on version) while still cutting the
// O(n) string-growth calls down from one-per-byte to one-per-32k-bytes.
const CHUNK_SIZE = 0x8000;

/**
 * Encode a JSON-serializable value to a base64url string (no +, /, or = padding).
 * @param {*} obj
 * @returns {string}
 */
export function encodeB64url(obj) {
  const json  = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a base64url string back to the original parsed JSON value.
 * Throws on any malformed input — callers should wrap this in try/catch and
 * map failure to their own fallback value.
 * @param {string} str
 * @returns {*}
 */
export function decodeB64url(str) {
  const b64    = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}
