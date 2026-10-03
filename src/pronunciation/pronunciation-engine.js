/**
 * Pronunciation Engine - eSpeak NG WASM wrapper for browser
 *
 * Provides IPA-to-speech synthesis using eSpeak NG compiled to WebAssembly
 * Uses @echogarden/espeak-ng-emscripten - browser-compatible build with WebIDL bindings
 */

class PronunciationEngine {
  constructor() {
    this.module = null;
    this.worker = null;
    this.initialized = false;
  }

  /**
   * Initialize the eSpeak NG WASM module
   */
  async init() {
    if (this.initialized) return;

    try {
      // Import the eSpeak NG module (ES6 module)
      const basePath = window.location.pathname.includes('/name/') ? '/name' : '';
      const createModule = (await import(`${basePath}/espeak/espeak-ng.js`)).default;

      // Initialize the module
      this.module = await createModule({
        locateFile: (path, prefix) => {
          if (path === 'espeak-ng.data') {
            return `${basePath}/espeak/espeak-ng.data`;
          }
          return prefix + path;
        }
      });

      // Create a worker instance
      this.worker = new this.module.eSpeakNGWorker();

      this.initialized = true;
      console.log('[Pronunciation] eSpeak NG initialized successfully');
    } catch (err) {
      console.error('[Pronunciation] Failed to initialize eSpeak NG:', err);
      throw err;
    }
  }

  /**
   * Synthesize speech from IPA text
   * @param {string} ipaText - IPA transcription (e.g., "ʔu.bi")
   * @param {Object} options - Synthesis options
   * @returns {Promise<Uint8Array>} WAV audio data
   */
  async synthesize(ipaText, options = {}) {
    if (!this.initialized) {
      await this.init();
    }

    const {
      rate = 150,
      pitch = 50,
      volume = 100
    } = options;

    return new Promise((resolve, reject) => {
      try {
        // Configure the worker
        this.worker.set_rate(rate);
        this.worker.set_pitch(pitch);
        this.worker.set_volume(volume);

        // Collect audio chunks via callback
        const audioChunks = [];
        const callback = (audioData, events) => {
          console.log('[Pronunciation] Callback called, audioData length:', audioData ? audioData.length : 0);
          if (audioData && audioData.length > 0) {
            audioChunks.push(new Int16Array(audioData));
          }
          return 0; // Return 0 to continue synthesis
        };

        // Synthesize using callback
        console.log('[Pronunciation] Calling synthesize with text:', ipaText);
        this.worker.synthesize(ipaText, callback);
        console.log('[Pronunciation] Synthesize returned, chunks collected:', audioChunks.length);

        // Combine all chunks
        if (audioChunks.length === 0) {
          reject(new Error('No audio data generated'));
          return;
        }

        // Calculate total length
        const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const combined = new Int16Array(totalLength);

        // Copy chunks
        let offset = 0;
        for (const chunk of audioChunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }

        // Convert to WAV format
        const sampleRate = this.worker.get_samplerate();
        const wavData = this.createWav(combined, sampleRate);

        resolve(wavData);
      } catch (err) {
        console.error('[Pronunciation] Synthesis failed:', err);
        reject(err);
      }
    });
  }

  /**
   * Create WAV file from audio samples
   */
  createWav(samples, sampleRate) {
    const numSamples = samples.length;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // WAV header
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + numSamples * 2, true); // file size - 8
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // format chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true); // sample rate
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, numSamples * 2, true); // data size

    // Write samples
    for (let i = 0; i < numSamples; i++) {
      view.setInt16(44 + i * 2, samples[i], true);
    }

    return new Uint8Array(buffer);
  }

  /**
   * Synthesize and play audio from IPA text
   * @param {string} ipaText - IPA transcription
   * @param {Object} options - Synthesis options
   */
  async speak(ipaText, options = {}) {
    const wavData = await this.synthesize(ipaText, options);

    // Create a blob and play it
    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      audio.play().catch(reject);
    });
  }
}

// Export singleton instance
export const pronunciationEngine = new PronunciationEngine();
