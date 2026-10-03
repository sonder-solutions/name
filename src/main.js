/**
 * Cuneiform Name Translator - Main Application
 *
 * Connects the G2P engine with the cuneiform translator pipeline
 * and provides the UI interface.
 */

import { g2pEngine } from './g2p/g2p-engine.js';
import { translateToCuneiform } from './cuneiform/translator.js';

// DOM elements
const nameInput = document.getElementById('name-input');
const translateBtn = document.getElementById('translate-btn');
const outputArea = document.getElementById('output-area');
const statusBar = document.getElementById('status-bar');

// State
let modelInitialized = false;
let isProcessing = false;

/**
 * Initialize the application.
 */
async function init() {
  updateStatus('Initializing...');

  // Initialize the G2P engine (rule-based by default, neural optional)
  await g2pEngine.init({ useNeural: false });
  modelInitialized = true;

  const status = g2pEngine.getStatus();
  if (status.neural && status.loaded) {
    updateStatus('Ready (neural G2P)');
  } else {
    updateStatus('Ready (rule-based G2P)');
  }

  // Set up event listeners
  translateBtn.addEventListener('click', handleTranslate);
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleTranslate();
  });
}

/**
 * Handle the translate button click.
 */
async function handleTranslate() {
  const name = nameInput.value.trim();
  if (!name || isProcessing) return;

  isProcessing = true;
  translateBtn.disabled = true;
  showLoading();

  try {
    // Get selected gender
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // Step 1: Convert name to IPA using G2P
    const ipa = await g2pEngine.convert(name);
    console.log('[App] G2P result:', ipa);

    // Step 2: Translate IPA to cuneiform
    const result = translateToCuneiform(ipa, { gender, useAlternates: false });
    console.log('[App] Translation result:', result);

    // Step 3: Display result
    displayResult(name, ipa, result);

  } catch (err) {
    console.error('[App] Translation error:', err);
    showError(err.message);
  } finally {
    isProcessing = false;
    translateBtn.disabled = false;
  }
}

/**
 * Display the translation result.
 */
function displayResult(name, ipa, result) {
  const syllableBreakdown = result.steps.syllables
    .map(s => s.value)
    .join(' · ');

  outputArea.innerHTML = `
    <button class="copy-btn" id="copy-btn" title="Click to copy cuneiform, long-press to copy JSON">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
    <div class="cuneiform-output">${result.cuneiform}</div>
    <div class="details">
      <details>
        <summary>Show translation details</summary>
        <div class="details-content">
          <p><span class="label">Name:</span> ${name}</p>
          <p><span class="label">IPA:</span> ${ipa}</p>
          <p><span class="label">Akkadian phonemes:</span> ${
            result.steps.akkadianPhonemes.map(p => p.value).join('')
          }</p>
          <p><span class="label">Syllables:</span> ${syllableBreakdown}</p>
          <p><span class="label">Determinative:</span> ${
            result.steps.determinative
              ? `${result.steps.determinative} (${document.querySelector('input[name="gender"]:checked').value})`
              : 'none'
          }</p>
          <p><span class="label">Total signs:</span> ${
            [...result.cuneiform].length
          }</p>
        </div>
      </details>
    </div>
  `;

  // Attach copy button handlers
  setupCopyButton(name, ipa, result, syllableBreakdown);
}

/**
 * Set up copy button with short-click (cuneiform) and long-press (JSON) behavior.
 */
function setupCopyButton(name, ipa, result, syllableBreakdown) {
  const copyBtn = document.getElementById('copy-btn');
  if (!copyBtn) return;

  let pressTimer = null;
  let isLongPress = false;
  const LONG_PRESS_DURATION = 500; // ms

  const startPress = (e) => {
    e.preventDefault();
    isLongPress = false;
    pressTimer = setTimeout(() => {
      isLongPress = true;
      // Long press: copy JSON
      const jsonData = {
        name,
        cuneiform: result.cuneiform,
        ipa,
        akkadianPhonemes: result.steps.akkadianPhonemes.map(p => p.value).join(''),
        syllables: result.steps.syllables.map(s => s.value),
        determinative: result.steps.determinative || null,
        gender: document.querySelector('input[name="gender"]:checked').value,
        totalSigns: [...result.cuneiform].length
      };
      copyToClipboard(JSON.stringify(jsonData, null, 2), copyBtn);
    }, LONG_PRESS_DURATION);
  };

  const endPress = (e) => {
    e.preventDefault();
    clearTimeout(pressTimer);
    if (!isLongPress) {
      // Short click: copy cuneiform only
      copyToClipboard(result.cuneiform, copyBtn);
    }
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  // Mouse events
  copyBtn.addEventListener('mousedown', startPress);
  copyBtn.addEventListener('mouseup', endPress);
  copyBtn.addEventListener('mouseleave', cancelPress);

  // Touch events
  copyBtn.addEventListener('touchstart', startPress, { passive: false });
  copyBtn.addEventListener('touchend', endPress);
  copyBtn.addEventListener('touchcancel', cancelPress);
}

/**
 * Copy text to clipboard and show visual feedback.
 */
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    // Visual feedback
    const originalHTML = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = originalHTML;
    }, 1200);
  } catch (err) {
    console.error('[App] Copy failed:', err);
  }
}

/**
 * Show loading state.
 */
function showLoading() {
  outputArea.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <span>Translating...</span>
    </div>
  `;
}

/**
 * Show error message.
 */
function showError(message) {
  outputArea.innerHTML = `
    <span class="placeholder-text" style="color: #f66;">
      Error: ${message}
    </span>
  `;
}

/**
 * Update status bar text.
 */
function updateStatus(text) {
  statusBar.textContent = text;
}

// Start the app
init();
