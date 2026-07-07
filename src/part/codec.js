// @gp/part codec — encode/decode a Part for URL share links.
// Format: JSON → UTF-8 → base64url. No external dependencies; works in browser + Node 16+.
// Future: swap in gzip for large multi-track parts when URL length becomes a concern.
// Encoding itself lives in ../codec.js — shared with @gp/song's rig-track/showfile codecs.

import { encodeB64url, decodeB64url } from '../codec.js';

/**
 * Encode a Part to a base64url string for use in share links.
 * @param {object} part
 * @returns {string}
 */
export function encodePart(part) {
  return encodeB64url(part);
}

/**
 * Decode a base64url string back to a raw Part object.
 * Returns null on any parse failure — caller should normalizePart() the result.
 * @param {string} encoded
 * @returns {object|null}
 */
export function decodePart(encoded) {
  try {
    return decodeB64url(encoded);
  } catch {
    return null;
  }
}
