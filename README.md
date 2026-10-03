# Cuneiform Name Converter

A web application that converts names to ancient Mesopotamian cuneiform script via phonetic transcription.

## Features

- **Hybrid G2P Engine**: Dictionary-based and rule-based grapheme-to-phoneme conversion
- **Cuneiform Mapping**: Converts phonetic transcriptions to cuneiform syllabary
- **WebAssembly Support**: Uses ONNX Runtime for neural network inference
- **Multi-language Support**: Handles English, European, Spanish/Latin names and more

## Live Demo

Visit the live site at: [https://sonder-solutions.github.io/name/](https://sonder-solutions.github.io/name/)

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

```bash
# Test G2P engine
node test-g2p.mjs

# Test full translation pipeline
node test-translate.mjs
```

## Architecture

- **src/g2p/**: Grapheme-to-phoneme conversion engine
- **src/cuneiform/**: Cuneiform syllabary mapping and translation
- **public/wasm/**: WebAssembly runtime files
- **public/models/**: ONNX model files

## Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

## License

MIT
