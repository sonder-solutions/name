import { g2pEngine } from './src/g2p/g2p-engine.js';
import { translateToCuneiform } from './src/cuneiform/translator.js';

console.log('=== Testing Full Translation Pipeline ===\n');

await g2pEngine.init({ useNeural: false });

const testNames = [
  'Enrico',
  'John',
  'Sarah',
  'Alexander',
  'Marco'
];

for (const name of testNames) {
  const ipa = await g2pEngine.convert(name);
  const result = translateToCuneiform(ipa, { gender: 'male', useAlternates: false });
  console.log(`${name}:`);
  console.log(`  IPA: ${ipa}`);
  console.log(`  Cuneiform: ${result.cuneiform}`);
  console.log(`  Syllables: ${result.steps.syllables.map(s => s.value).join(' · ')}\n`);
}
