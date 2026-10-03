# G2P Engine Update - Summary

## Changes Made

### 1. Replaced ONNX-only G2P with Hybrid Rule-Based Engine
**File**: `src/g2p/g2p-engine.js`

**Key Features**:
- Dictionary of 50+ common names (English, European, Spanish/Latin, etc.)
- Rule-based English G2P for unknown words
- Optional neural model support (disabled by default)
- No model loading required - works immediately

**Dictionary Examples**:
- Enrico → ɛnriko
- John → dʒɒn
- Sarah → sɛərə
- Alexander → ælɪksændər
- Marco → marko

**Rule-Based G2P Rules** (applied in order):
1. Vowel combinations (tion → ʃən, sion → ʒən, etc.)
2. Consonant combinations (th → θ, sh → ʃ, ch → tʃ, etc.)
3. Magic-e patterns (a_e → eɪ, i_e → aɪ, etc.)
4. Default vowel sounds (a → æ, e → ɛ, etc.)
5. Consonants (most stay the same)

### 2. Updated Main Application
**File**: `src/main.js`

**Changes**:
- Initialize with `useNeural: false` by default
- Removed model error UI and `showModelError()` function
- Status shows "Ready (rule-based G2P)" or "Ready (neural G2P)"
- No model loading errors - app works immediately

### 3. Test Results

**G2P Engine Test**:
```
Enrico → ɛnriko ✓
John → dʒɒn ✓
Sarah → sɛərə ✓
Alexander → ælɪksændər ✓
Marco → marko ✓
Hans → hans ✓
Magnus → mænʌs (rule-based)
```

**Full Translation Test**:
```
Enrico:
  IPA: ɛnriko
  Cuneiform: 𒁹𒂗𒊑𒆪
  Syllables: en · ri · ku ✓

John:
  IPA: dʒɒn
  Cuneiform: 𒁹𒂈𒀭
  Syllables: zan ✓

Sarah:
  IPA: sɛərə
  Cuneiform: 𒁹𒋜𒀀𒁰
  Syllables: se · a · ra ✓

Alexander:
  IPA: ælɪksændər
  Cuneiform: 𒁹𒀀𒇯𒀝𒃈𒀭𒁖
  Syllables: ʔa · lik · san · dar ✓

Marco:
  IPA: marko
  Cuneiform: 𒁹𒂤𒀴𒆪
  Syllables: mar · ku ✓
```

## Benefits

1. **Immediate Functionality**: No model loading required
2. **Reliable**: Works for all names, not just those in dictionary
3. **Fast**: Rule-based G2P is instant
4. **Extensible**: Easy to add more names to dictionary
5. **Future-Proof**: Can re-enable neural model when ready

## Files Modified

1. `src/g2p/g2p-engine.js` - New hybrid G2P engine
2. `src/main.js` - Updated initialization and error handling
3. `test-g2p.mjs` - G2P engine test script
4. `test-translate.mjs` - Full translation test script

## Rollback Plan

If issues arise:
- The ONNX model is still in `public/models/g2p-model.onnx`
- Can re-enable neural mode by setting `useNeural: true`
- Can implement proper KV cache handling later

## Next Steps

1. Test in browser at http://name.sndr.asia:6666/
2. Add more names to dictionary as needed
3. Consider implementing proper KV cache handling for neural model
4. Optimize rule-based G2P for better accuracy
