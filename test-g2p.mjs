import { g2pEngine } from './src/g2p/g2p-engine.js';

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
}

console.log('\n=== Testing Unknown Name ===');
const unknown = 'Magnus';
const unknownIPA = await g2pEngine.convert(unknown);
console.log(`${unknown} → ${unknownIPA}`);
