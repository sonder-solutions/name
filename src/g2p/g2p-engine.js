/**
 * G2P Engine - Grapheme-to-Phoneme conversion
 *
 * Uses a combination of:
 * 1. Dictionary lookup for common names
 * 2. Rule-based English G2P for unknown words
 * 3. Optional: ONNX neural model (if available)
 */

// Common name pronunciations (IPA)
const NAME_DICTIONARY = {
  // English names
  'john': 'dʒɒn',
  'james': 'dʒeɪmz',
  'mary': 'mɛəri',
  'sarah': 'sɛərə',
  'michael': 'maɪkəl',
  'david': 'deɪvɪd',
  'robert': 'rɒbərt',
  'william': 'wɪliəm',
  'elizabeth': 'ɪlɪzəbəθ',
  'jennifer': 'dʒɛnɪfər',
  'alexander': 'ælɪksændər',
  'alexandra': 'ælɪksændrə',
  'christopher': 'krɪstɒfər',
  'daniel': 'dæniəl',
  'matthew': 'mæθju',
  'andrew': 'ændru',
  'joseph': 'dʒoʊzɪf',
  'thomas': 'tɒməs',
  'charles': 'tʃɑrlz',

  // European names
  'enrico': 'ɛnriko',
  'marco': 'marko',
  'giuseppe': 'dʒuzɛppe',
  'francesco': 'frantʃɛsko',
  'giovanni': 'dʒovanni',
  'antonio': 'antoniо',
  'luigi': 'luidʒi',
  'carlo': 'karlo',
  'pierre': 'piɛr',
  'jean': 'ʒɑ̃',
  'jacques': 'ʒak',
  'hans': 'hans',
  'klaus': 'klaʊs',
  'dieter': 'diːtər',
  'wolfgang': 'vɒlfɡæŋ',

  // Spanish/Latin names
  'carlos': 'karlos',
  'jose': 'xoze',
  'miguel': 'migɛl',
  'juan': 'xwan',
  'pedro': 'pɛdro',
  'pablo': 'pablo',
  'diego': 'diego',
  'rafael': 'rafaɛl',
  'ricardo': 'rikardo',
  'alberto': 'albɛrto',

  // Other common names
  'mohammed': 'moʊ hæməd',
  'ali': 'æli',
  'wei': 'weɪ',
  'hiroshi': 'hiroʊʃi',
  'yuki': 'juki',
};

class G2PEngine {
  constructor() {
    this.useNeural = false;
    this.session = null;
  }

  /**
   * Initialize the G2P engine
   * @param {Object} options
   * @param {boolean} options.useNeural - Whether to attempt loading ONNX model
   * @returns {Promise<void>}
   */
  async init(options = {}) {
    this.useNeural = options.useNeural || false;

    if (this.useNeural) {
      try {
        // Lazy load ONNX runtime
        const ort = await import('onnxruntime-web');
        ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/';

        this.session = await ort.InferenceSession.create('/models/g2p-model.onnx', {
          executionProviders: ['wasm']
        });
        console.log('[G2P] Neural model loaded');
      } catch (err) {
        console.warn('[G2P] Neural model not available, using rule-based:', err.message);
        this.useNeural = false;
      }
    }
  }

  /**
   * Convert text to IPA phonemes
   * @param {string} text - English text to convert
   * @returns {Promise<string>} IPA transcription
   */
  async convert(text) {
    const words = text.toLowerCase().trim().split(/\s+/);
    const phonemes = words.map(word => this.convertWord(word));
    return phonemes.join(' ');
  }

  /**
   * Convert a single word to IPA
   * @param {string} word - Single word
   * @returns {string} IPA transcription
   */
  convertWord(word) {
    // Clean the word
    const clean = word.replace(/[^a-z]/g, '');
    if (!clean) return '';

    // Check dictionary first
    if (NAME_DICTIONARY[clean]) {
      return NAME_DICTIONARY[clean];
    }

    // Fall back to rule-based G2P
    return this.ruleBasedG2P(clean);
  }

  /**
   * Rule-based English G2P (simplified but functional)
   * @param {string} word - Word to convert
   * @returns {string} IPA transcription
   */
  ruleBasedG2P(word) {
    let result = word.toLowerCase();

    // Process character by character, checking for digraphs first
    let output = '';
    let i = 0;

    while (i < result.length) {
      let matched = false;

      // Check for 2-character digraphs first
      if (i < result.length - 1) {
        const twoChar = result.substring(i, i + 2);
        const digraphMap = {
          'ou': 'uː',
          'oo': 'uː',
          'ea': 'iː',
          'ee': 'iː',
          'ai': 'eɪ',
          'ay': 'eɪ',
          'ie': 'aɪ',
          'oa': 'oʊ',
          'th': 'θ',
          'sh': 'ʃ',
          'ch': 'tʃ',
          'ph': 'f',
          'wh': 'w',
          'ck': 'k',
          'ng': 'ŋ',
          'gh': '',
        };

        if (digraphMap[twoChar] !== undefined) {
          output += digraphMap[twoChar];
          i += 2;
          matched = true;
        }
      }

      // Check for magic-e patterns (vowel + consonant + e at word end)
      if (!matched && i < result.length - 2) {
        const vowel = result[i];
        const consonant = result[i + 1];
        const finalE = result[i + 2];

        if (finalE === 'e' && i + 2 === result.length - 1 && !'aeiou'.includes(consonant)) {
          const magicEMap = {
            'a': 'eɪ',
            'e': 'iː',
            'i': 'aɪ',
            'o': 'oʊ',
            'u': 'juː',
          };

          if (magicEMap[vowel]) {
            output += magicEMap[vowel] + consonant;
            i += 3; // Skip vowel + consonant + e
            matched = true;
          }
        }
      }

      // Single character fallback
      if (!matched) {
        const char = result[i];
        const singleMap = {
          'a': 'æ',
          'e': 'ɛ',
          'i': 'ɪ',
          'o': 'ɒ',
          'u': 'ʌ',
          'b': 'b',
          'd': 'd',
          'f': 'f',
          'g': 'ɡ',
          'h': 'h',
          'j': 'dʒ',
          'k': 'k',
          'l': 'l',
          'm': 'm',
          'n': 'n',
          'p': 'p',
          'r': 'r',
          's': 's',
          't': 't',
          'v': 'v',
          'w': 'w',
          'x': 'ks',
          'y': 'j',
          'z': 'z',
          'q': 'k',
        };

        if (singleMap[char] !== undefined) {
          output += singleMap[char];
        }
        i++;
      }
    }

    // Handle common suffixes
    output = output.replace(/ʃən$/, 'ʃən'); // tion
    output = output.replace(/ʒən$/, 'ʒən'); // sion

    return output || word;
  }

  /**
   * Get engine status
   * @returns {Object} Status object
   */
  getStatus() {
    return {
      neural: this.useNeural,
      loaded: this.useNeural && this.session !== null
    };
  }
}

// Singleton instance
export const g2pEngine = new G2PEngine();
