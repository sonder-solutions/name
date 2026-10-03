/**
 * G2P Tokenizer - Input tokenization for the G2P model
 *
 * ByT5 models use byte-level tokenization: each character is encoded
 * as its UTF-8 byte value + offset.
 */

// ByT5 tokenization constants
const BYT5_OFFSET = 3;  // ByT5 uses offset of 3 for byte tokens

/**
 * Tokenize a word into ByT5 byte-level token IDs.
 *
 * @param {string} word - A single word to tokenize
 * @returns {number[]} Array of token IDs
 */
export function tokenizeByT5(word) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(word.toLowerCase());
  const tokenIds = [];

  for (const byte of bytes) {
    tokenIds.push(byte + BYT5_OFFSET);
  }

  return tokenIds;
}

/**
 * Decode token IDs back to text.
 *
 * @param {number[]} tokenIds - Array of token IDs
 * @returns {string} Decoded text
 */
export function decodeByT5(tokenIds) {
  const bytes = new Uint8Array(
    tokenIds
      .filter(id => id >= BYT5_OFFSET) // filter out special tokens
      .map(id => id - BYT5_OFFSET)
  );

  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/**
 * Prepare input for the G2P model.
 * Handles word splitting and normalization.
 *
 * @param {string} text - Input text (name)
 * @returns {{ words: string[], tokenizedInputs: number[][] }}
 */
export function prepareInput(text) {
  // Normalize: lowercase, strip non-essential punctuation
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, '')
    .trim();

  // Split into words
  const words = normalized.split(/\s+/).filter(w => w.length > 0);

  // Tokenize each word
  const tokenizedInputs = words.map(word => tokenizeByT5(word));

  return { words, tokenizedInputs };
}
