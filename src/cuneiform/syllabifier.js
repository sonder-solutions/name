/**
 * Syllabifier - Breaks Akkadian phoneme sequences into CV/VC/CVC syllables
 *
 * Akkadian cuneiform is primarily a CV (consonant-vowel) syllabary.
 * This module takes a sequence of mapped phonemes and groups them into
 * syllables that can be looked up in the cuneiform syllabary.
 *
 * Syllabification rules:
 *   - A single consonant between vowels is an onset: V-CV → V + CV
 *   - Two consonants between vowels: first is coda, second is onset: V-CC-V → VC + CV
 *   - Word-initial vowel gets glottal stop: V → ʔV
 *   - Word-final consonant is a coda: CVC
 *   - Consonant clusters at word start: insert epenthetic vowel
 */

/**
 * Syllabify a sequence of Akkadian phonemes into syllables.
 *
 * @param {Array<{type: 'C'|'V', value: string}>} phonemes
 * @returns {Array<{pattern: string, value: string}>} Syllables with pattern type and value
 */
export function syllabify(phonemes) {
  if (!phonemes || phonemes.length === 0) return [];

  const syllables = [];
  let i = 0;

  while (i < phonemes.length) {
    const current = phonemes[i];

    if (current.type === 'V') {
      // Look ahead to determine syllable structure
      const next = phonemes[i + 1];
      const nextNext = phonemes[i + 2];

      if (!next) {
        // Final vowel
        if (syllables.length === 0) {
          // Word-initial and only vowel: ʔV
          syllables.push({
            pattern: 'CV',
            value: 'ʔ' + current.value,
            onset: 'ʔ',
            nucleus: current.value
          });
        } else {
          // Append to previous syllable or create new ʔV
          const lastSyllable = syllables[syllables.length - 1];
          if (lastSyllable.pattern === 'CV' && !lastSyllable.coda) {
            // Previous is CV, this vowel starts new syllable with glottal stop
            syllables.push({
              pattern: 'CV',
              value: 'ʔ' + current.value,
              onset: 'ʔ',
              nucleus: current.value
            });
          } else {
            // Create new ʔV syllable
            syllables.push({
              pattern: 'CV',
              value: 'ʔ' + current.value,
              onset: 'ʔ',
              nucleus: current.value
            });
          }
        }
        i++;

      } else if (next.type === 'C') {
        // V followed by consonant
        if (!nextNext) {
          // VC at end of word
          syllables.push({
            pattern: 'VC',
            value: current.value + next.value,
            onset: null,
            nucleus: current.value,
            coda: next.value
          });
          i += 2;

        } else if (nextNext.type === 'C') {
          // V-C-C: first consonant is coda, second starts new syllable
          // Example: e-n-r → en + r...
          syllables.push({
            pattern: 'VC',
            value: current.value + next.value,
            onset: null,
            nucleus: current.value,
            coda: next.value
          });
          i += 2;
          // Next iteration will handle the remaining consonant

        } else if (nextNext.type === 'V') {
          // V-C-V: consonant is onset of next syllable
          // Example: e-n-i → e + ni
          if (syllables.length === 0 && i === 0) {
            // Word-initial: add glottal stop
            syllables.push({
              pattern: 'CV',
              value: 'ʔ' + current.value,
              onset: 'ʔ',
              nucleus: current.value
            });
          } else {
            // Just the vowel as a syllable
            syllables.push({
              pattern: 'V',
              value: current.value,
              onset: null,
              nucleus: current.value
            });
          }
          i++;
        }

      } else if (next.type === 'V') {
        // V-V: two vowels in sequence
        // Treat as separate syllables or diphthong
        if (syllables.length === 0 && i === 0) {
          syllables.push({
            pattern: 'CV',
            value: 'ʔ' + current.value,
            onset: 'ʔ',
            nucleus: current.value
          });
        } else {
          syllables.push({
            pattern: 'V',
            value: current.value,
            onset: null,
            nucleus: current.value
          });
        }
        i++;
      }

    } else if (current.type === 'C') {
      const consonant = current.value;
      const next = phonemes[i + 1];
      const nextNext = phonemes[i + 2];

      if (!next) {
        // Final consonant: append as coda to previous syllable
        if (syllables.length > 0) {
          const lastSyllable = syllables[syllables.length - 1];
          if (lastSyllable.pattern === 'V' || lastSyllable.pattern === 'CV') {
            lastSyllable.pattern = lastSyllable.pattern === 'V' ? 'VC' : 'CVC';
            lastSyllable.value = lastSyllable.value + consonant;
            lastSyllable.coda = consonant;
          }
        } else {
          // No previous syllable, use with epenthetic vowel
          syllables.push({
            pattern: 'CV',
            value: consonant + 'a',
            onset: consonant,
            nucleus: 'a',
            epenthetic: true
          });
        }
        i++;

      } else if (next.type === 'V') {
        // C-V: check what follows
        if (!nextNext) {
          // CV at end of word
          syllables.push({
            pattern: 'CV',
            value: consonant + next.value,
            onset: consonant,
            nucleus: next.value
          });
          i += 2;

        } else if (nextNext.type === 'C') {
          // C-V-C: check if this is CVC or CV + C...
          const afterNext = phonemes[i + 3];
          if (!afterNext || afterNext.type === 'C') {
            // CVC syllable
            syllables.push({
              pattern: 'CVC',
              value: consonant + next.value + nextNext.value,
              onset: consonant,
              nucleus: next.value,
              coda: nextNext.value
            });
            i += 3;
          } else {
            // CV syllable, next consonant starts new syllable
            syllables.push({
              pattern: 'CV',
              value: consonant + next.value,
              onset: consonant,
              nucleus: next.value
            });
            i += 2;
          }

        } else if (nextNext.type === 'V') {
          // C-V-V: CV syllable
          syllables.push({
            pattern: 'CV',
            value: consonant + next.value,
            onset: consonant,
            nucleus: next.value
          });
          i += 2;
        }

      } else if (next.type === 'C') {
        // C-C: consonant cluster
        if (!nextNext) {
          // Final cluster: use first with epenthetic, second as coda
          syllables.push({
            pattern: 'CV',
            value: consonant + 'a',
            onset: consonant,
            nucleus: 'a',
            epenthetic: true
          });
          if (syllables.length > 0) {
            const lastSyllable = syllables[syllables.length - 1];
            lastSyllable.pattern = 'CVC';
            lastSyllable.value = lastSyllable.value + next.value;
            lastSyllable.coda = next.value;
          }
          i += 2;

        } else if (nextNext.type === 'V') {
          // C-C-V: split cluster, first gets epenthetic vowel
          syllables.push({
            pattern: 'CV',
            value: consonant + 'a',
            onset: consonant,
            nucleus: 'a',
            epenthetic: true
          });
          syllables.push({
            pattern: 'CV',
            value: next.value + nextNext.value,
            onset: next.value,
            nucleus: nextNext.value
          });
          i += 3;

        } else {
          // C-C-C or more: use first with epenthetic
          syllables.push({
            pattern: 'CV',
            value: consonant + 'a',
            onset: consonant,
            nucleus: 'a',
            epenthetic: true
          });
          i++;
        }
      }

    } else {
      // Unknown phoneme type, skip
      i++;
    }
  }

  return syllables;
}

/**
 * Convert syllables to lookup keys for the syllabary.
 * Returns an array of possible lookup keys for each syllable.
 *
 * @param {Array} syllables - Output from syllabify()
 * @returns {Array<string[]>} Array of lookup key arrays (first match wins)
 */
export function toLookupKeys(syllables) {
  return syllables.map(syllable => {
    const keys = [];

    // Primary key: full syllable value
    keys.push(syllable.value);

    // For CVC: try decomposition as CV + VC
    if (syllable.pattern === 'CVC') {
      const cv = syllable.onset + syllable.nucleus;
      const vc = syllable.nucleus + syllable.coda;
      keys.push(`decompose:${cv}+${vc}`);
    }

    // For VC: try as V + C (though this is less common)
    if (syllable.pattern === 'VC') {
      keys.push(syllable.nucleus); // just the vowel
    }

    return keys;
  });
}
