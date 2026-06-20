// @gp/part codec — encode/decode a Part for URL share links.
// Format: JSON → UTF-8 → base64url. No external dependencies; works in browser + Node 16+.
// Future: swap in gzip for large multi-track parts when URL length becomes a concern.

/**
 * Encode a Part to a base64url string for use in share links.
 * @param {object} part
 * @returns {string}
 */
export function encodePart(part) {
  const json = JSON.stringify(part);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decode a base64url string back to a raw Part object.
 * Returns null on any parse failure — caller should normalizePart() the result.
 * @param {string} encoded
 * @returns {object|null}
 */
export function decodePart(encoded) {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
