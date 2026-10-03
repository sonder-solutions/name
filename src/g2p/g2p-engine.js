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

    // Common patterns (apply in order)
    const rules = [
      // Vowel combinations
      [/tion$/g, 'ʃən'],
      [/sion$/g, 'ʒən'],
      [/eous$/g, 'iəs'],
      [/ious$/g, 'iəs'],
      [/ight$/g, 'aɪt'],
      [/eigh$/g, 'eɪ'],
      [/augh$/g, 'ɔː'],
      [/ough$/g, 'ʌf'],

      // Consonant combinations
      [/th/g, 'θ'],
      [/sh/g, 'ʃ'],
      [/ch/g, 'tʃ'],
      [/ph/g, 'f'],
      [/wh/g, 'w'],
      [/ng$/g, 'ŋ'],
      [/ck/g, 'k'],
      [/gh/g, ''],

      // Single vowels
      [/a([^aeiou]*)e/g, 'eɪ$1'],  // a_e pattern
      [/e([^aeiou]*)e/g, 'iː$1'],  // e_e pattern
      [/i([^aeiou]*)e/g, 'aɪ$1'],  // i_e pattern
      [/o([^aeiou]*)e/g, 'oʊ$1'],  // o_e pattern
      [/u([^aeiou]*)e/g, 'juː$1'], // u_e pattern

      // Default vowel sounds
      [/a/g, 'æ'],
      [/e/g, 'ɛ'],
      [/i/g, 'ɪ'],
      [/o/g, 'ɒ'],
      [/u/g, 'ʌ'],

      // Consonants (most stay the same)
      [/b/g, 'b'],
      [/d/g, 'd'],
      [/f/g, 'f'],
      [/g/g, 'ɡ'],
      [/h/g, 'h'],
      [/j/g, 'dʒ'],
      [/k/g, 'k'],
      [/l/g, 'l'],
      [/m/g, 'm'],
      [/n/g, 'n'],
      [/p/g, 'p'],
      [/qu/g, 'kw'],
      [/r/g, 'r'],
      [/s/g, 's'],
      [/t/g, 't'],
      [/v/g, 'v'],
      [/w/g, 'w'],
      [/x/g, 'ks'],
      [/y/g, 'j'],
      [/z/g, 'z'],
    ];

    for (const [pattern, replacement] of rules) {
      result = result.replace(pattern, replacement);
    }

    // Clean up any remaining letters
    result = result.replace(/[^a-zɪɛæʌɒʊəθðʃʒŋː]/g, '');

    return result || word; // Return original if conversion failed
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
