/**
 * Phoneme Mapper - Maps English IPA phonemes to closest Akkadian phonemes
 *
 * English has many sounds that don't exist in Akkadian. This module provides
 * approximation rules based on phonetic similarity.
 *
 * Akkadian consonant inventory:
 *   Stops: p, b, t, d, k, g, ʔ (glottal stop)
 *   Nasals: m, n
 *   Fricatives: s, ṣ, š (ʃ), ṭ, ḫ (x), z
 *   Affricates: (t͡s → s, d͡z → z in simplified mapping)
 *   Approximants: l, r, y (j), w
 *
 * Akkadian vowel inventory: a, e, i, u (short and long)
 */

// IPA consonant → Akkadian phoneme mapping
const CONSONANT_MAP = {
  // Direct matches
  'p':  'p',
  'b':  'b',
  't':  't',
  'd':  'd',
  'k':  'k',
  'ɡ':  'g',   // IPA uses ɡ (U+0261) for voiced velar stop
  'g':  'g',   // ASCII 'g' as fallback
  'm':  'm',
  'n':  'n',
  'l':  'l',
  'r':  'r',
  's':  's',
  'z':  'z',
  'w':  'w',
  'j':  'y',   // IPA 'j' = palatal approximant (English 'y')

  // Approximations for sounds not in Akkadian
  'θ':  't',   // voiceless dental fricative (think) → t
  'ð':  'd',   // voiced dental fricative (this) → d
  'ʃ':  'š',   // voiceless postalveolar fricative (ship) → š
  'ʒ':  'š',   // voiced postalveolar fricative (measure) → š
  'ŋ':  'n',   // velar nasal (sing) → n
  'ʔ':  'ʔ',   // glottal stop → direct match
  'h':  'ḫ',   // glottal fricative → ḫ (Akkadian has no /h/)
  'f':  'p',   // labiodental fricative → p (no /f/ in Akkadian)
  'v':  'b',   // labiodental fricative → b (no /v/ in Akkadian)
  'ç':  's',   // voiceless postalveolar affricate → s
  'x':  'ḫ',   // velar fricative → ḫ
  'ɹ':  'r',   // alveolar approximant (English r) → r
  'ɾ':  'r',   // alveolar tap → r

  // Affricates → closest Akkadian equivalent
  // Use 'y' (yod) for affricates - more historically accurate for Semitic adaptation
  // (similar to how Hebrew adapted foreign "j" sounds to "y": Joshua → Yehoshua)
  'tʃ': 'y',   // voiceless postalveolar affricate → y
  'dʒ': 'y',   // voiced postalveolar affricate → y
  'ʧ':  'y',   // alternative IPA for tʃ
  'ʤ':  'y',   // alternative IPA for dʒ

  // Fallback for non-IPA characters (from simplified G2P)
  'c':  'k',   // Latin 'c' → k (hard c sound)
  'q':  'k',   // Latin 'q' → k
  'y':  'y',   // Latin 'y' → y (palatal approximant)

  // Emphatic/pharyngeal (not in English but for completeness)
  'ɪ':  null,  // near-close front vowel - handled as vowel
  'ʊ':  null,  // near-close back vowel - handled as vowel
};

// IPA vowel → Akkadian vowel mapping
const VOWEL_MAP = {
  // Direct matches
  'a':  'a',
  'e':  'e',
  'i':  'i',
  'u':  'u',

  // Approximations
  'ɑ':  'a',   // open back unrounded → a
  'æ':  'a',   // near-open front → a
  'ʌ':  'a',   // open-mid back → a (English 'uh')
  'ɛ':  'e',   // open-mid front → e
  'ɔ':  'u',   // open-mid back rounded → u (closest Akkadian vowel)
  'o':  'u',   // mid back rounded → u (no /o/ in Akkadian)
  'ɒ':  'a',   // open back rounded → a
  'ə':  'a',   // schwa → a (default vowel)
  'ɚ':  'a',   // r-colored schwa → a
  'ɝ':  'a',   // r-colored open-mid central → a

  // Long vowels (marked with ː in IPA, but we handle them separately)
  'aː': 'a',
  'eː': 'e',
  'iː': 'i',
  'uː': 'u',

  // Diphthongs → map to single Akkadian vowel
  'oʊ': 'u',   // English 'o' diphthong → u
  'aɪ': 'a',   // English 'i' diphthong → a
  'eɪ': 'e',   // English 'a' diphthong → e
  'ɔɪ': 'u',   // English 'oi' diphthong → u
  'aʊ': 'a',   // English 'ou' diphthong → a

  // Diphthong components
  'ɪ':  'i',   // near-close front → i
  'ʊ':  'u',   // near-close back → u
};

// Classify a phoneme as consonant or vowel
const CONSONANTS = new Set(Object.keys(CONSONANT_MAP).filter(k => CONSONANT_MAP[k] !== null));
const VOWELS = new Set(Object.keys(VOWEL_MAP));

/**
 * Check if an IPA symbol is a vowel
 * @param {string} phoneme
 * @returns {boolean}
 */
export function isVowel(phoneme) {
  return VOWELS.has(phoneme);
}

/**
 * Check if an IPA symbol is a consonant
 * @param {string} phoneme
 * @returns {boolean}
 */
export function isConsonant(phoneme) {
  return CONSONANTS.has(phoneme);
}

/**
 * Map an English IPA consonant to Akkadian phoneme
 * @param {string} phoneme - IPA consonant symbol
 * @returns {string|null} Akkadian phoneme or null
 */
export function mapConsonant(phoneme) {
  return CONSONANT_MAP[phoneme] || null;
}

/**
 * Map an English IPA vowel to Akkadian vowel
 * @param {string} phoneme - IPA vowel symbol
 * @returns {string|null} Akkadian vowel or null
 */
export function mapVowel(phoneme) {
  return VOWEL_MAP[phoneme] || null;
}

/**
 * Map a full IPA phoneme to Akkadian (auto-detect consonant/vowel)
 * @param {string} phoneme
 * @returns {{ type: 'C'|'V', value: string }|null}
 */
export function mapPhoneme(phoneme) {
  if (VOWELS.has(phoneme)) {
    return { type: 'V', value: VOWEL_MAP[phoneme] };
  }
  if (CONSONANTS.has(phoneme) && CONSONANT_MAP[phoneme] !== null) {
    return { type: 'C', value: CONSONANT_MAP[phoneme] };
  }
  return null;
}

/**
 * Parse an IPA string into individual phonemes.
 * Handles multi-character IPA symbols (tʃ, dʒ, etc.)
 * @param {string} ipa - IPA transcription string
 * @returns {string[]} Array of individual phoneme symbols
 */
export function parseIPA(ipa) {
  const phonemes = [];
  let i = 0;

  // Remove stress markers, syllable boundaries, length markers, and slashes
  const cleaned = ipa
    .replace(/[\/]/g, '')     // remove slashes
    .replace(/[ˈˌ]/g, '')     // remove stress markers
    .replace(/\./g, '')       // remove syllable boundaries
    .replace(/ː/g, '');       // remove length markers (we handle these separately)

  while (i < cleaned.length) {
    // Skip spaces
    if (cleaned[i] === ' ') {
      i++;
      continue;
    }

    // Try two-character sequences first (affricates, diphthongs)
    const twoChar = cleaned.substring(i, i + 2);
    if (CONSONANTS.has(twoChar) || VOWELS.has(twoChar)) {
      phonemes.push(twoChar);
      i += 2;
      continue;
    }

    // Single character
    const ch = cleaned[i];
    // Skip characters that aren't valid phonemes
    if (CONSONANTS.has(ch) || VOWELS.has(ch)) {
      phonemes.push(ch);
    }
    i++;
  }

  return phonemes;
}
