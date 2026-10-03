/**
 * Translator - Orchestrates the phoneme-to-cuneiform pipeline
 *
 * Pipeline: IPA string → parse → map to Akkadian → syllabify → lookup signs → Unicode string
 */

import { parseIPA, mapPhoneme } from './phoneme-map.js';
import { syllabify, toLookupKeys } from './syllabifier.js';
import { lookupSign, hasSign, SYLLABARY } from './syllabary.js';

// Person determinatives (prepended before names)
export const DETERMINATIVES = {
  male:   '\u{12079}',  // 𒁹 DISH (Personenkeil - single vertical wedge for male names)
  female: '\u{122A9}',  // 𒊩 MUNUS/SAL (woman determinative)
  deity:  '\u{1202D}',  // 𒀭 DINGIR (god/goddess)
};

/**
 * Translate an IPA transcription to a cuneiform Unicode string.
 *
 * @param {string} ipaString - IPA transcription of the name
 * @param {Object} options
 * @param {'male'|'female'|'none'} options.gender - Which person determinative to prepend
 * @param {boolean} options.useAlternates - Whether to use alternate sign forms
 * @returns {{ cuneiform: string, steps: Object }} Result with cuneiform string and intermediate steps
 */
export function translateToCuneiform(ipaString, options = {}) {
  const { gender = 'male', useAlternates = false } = options;

  // Step 1: Parse IPA string into individual phonemes
  const ipaPhonemes = parseIPA(ipaString);

  // Step 2: Map each phoneme to Akkadian equivalent
  const akkadianPhonemes = [];
  for (const phoneme of ipaPhonemes) {
    const mapped = mapPhoneme(phoneme);
    if (mapped) {
      akkadianPhonemes.push(mapped);
    }
  }

  // Step 3: Syllabify
  const syllables = syllabify(akkadianPhonemes);

  // Step 4: Look up cuneiform signs for each syllable
  const signResults = [];
  const lookupKeys = toLookupKeys(syllables);

  for (let i = 0; i < syllables.length; i++) {
    const keys = lookupKeys[i];
    let found = false;

    for (const key of keys) {
      if (key.startsWith('decompose:')) {
        // Decompose CVC into CV + VC
        const parts = key.replace('decompose:', '').split('+');
        const cvSign = lookupSign(parts[0], useAlternates);
        const vcSign = lookupSign(parts[1], useAlternates);
        if (cvSign && vcSign) {
          signResults.push({
            syllable: syllables[i],
            signs: [cvSign, vcSign],
            method: 'decomposed'
          });
          found = true;
          break;
        }
      } else {
        const sign = lookupSign(key, useAlternates);
        if (sign) {
          signResults.push({
            syllable: syllables[i],
            signs: [sign],
            method: 'direct'
          });
          found = true;
          break;
        }
      }
    }

    if (!found) {
      // Fallback: use closest available sign
      // Try just the CV part
      const cv = syllables[i].onset + syllables[i].nucleus;
      const cvSign = lookupSign(cv, useAlternates);
      if (cvSign) {
        signResults.push({
          syllable: syllables[i],
          signs: [cvSign],
          method: 'fallback-cv'
        });
      } else {
        // Last resort: just the vowel
        const vSign = lookupSign(syllables[i].nucleus, useAlternates);
        signResults.push({
          syllable: syllables[i],
          signs: vSign ? [vSign] : [],
          method: 'fallback-v'
        });
      }
    }
  }

  // Step 5: Build final cuneiform string
  let cuneiformString = '';

  // Add person determinative
  if (gender !== 'none' && DETERMINATIVES[gender]) {
    cuneiformString += DETERMINATIVES[gender];
  }

  // Add name signs
  for (const result of signResults) {
    cuneiformString += result.signs.join('');
  }

  return {
    cuneiform: cuneiformString,
    steps: {
      ipaPhonemes,
      akkadianPhonemes,
      syllables,
      signResults,
      determinative: gender !== 'none' ? DETERMINATIVES[gender] : null
    }
  };
}

/**
 * Get a list of all available syllabic values in the syllabary.
 * Useful for debugging and validation.
 */
export function getAvailableSyllables() {
  return Object.keys(SYLLABARY);
}
