/**
 * Encodes ByteArray to base64.
 * @param {byte[]} input ByteArray to convert to Base64
 * @return {string} Base64 conversion of input
 */
export function base64Encode(input) {
  return btoa(input.reduce((str, byte) => str + String.fromCharCode(byte), ''));
}

/**
 * Decodes base64 to ByteArray.
 * @param {string} input Base64 to decode
 * @return {byte[]} ByteArray of decoded Base64
 */
export function base64Decode(input) {
  return new Uint8Array(atob(input).split('').reduce((arr, chr) => arr.concat([chr.charCodeAt(0)]), []));
}
