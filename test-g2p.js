import { g2pEngine } from './src/g2p/g2p-engine.js';
import { translateToCuneiform } from './src/cuneiform/translator.js';

// Test the G2P engine
async function testG2P() {
  console.log('=== Testing G2P Engine ===\n');

  await g2pEngine.init({ useNeural: false });

  const testNames = [
    'Enrico',
    'John',
    'Sarah',
    'Alexander',
    'Marco',
    'Hans'
  ];

  for (const name of testNames) {
    const ipa = await g2pEngine.convert(name);
    console.log(`${name} → ${ipa}`);

    // Translate to cuneiform
    const result = translateToCuneiform(ipa, { gender: 'male', useAlternates: false });
    console.log(`  Cuneiform: ${result.cuneiform}`);
    console.log(`  Syllables: ${result.steps.syllables.map(s => s.value).join(' · ')}\n`);
  }
}

testG2P().catch(console.error);
