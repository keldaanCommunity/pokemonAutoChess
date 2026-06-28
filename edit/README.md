# Pokemon Auto Chess Sprite Processor

This directory contains a cross-platform TypeScript script for adding new Pokemon sprites to the game.

## Usage

```bash
# Using npm script (from project root)
npm run add-pokemon

# Or directly with ts-node (from edit/ directory)
ts-node add-pokemon.ts
```
You will be prompted to enter:

1. **SpriteCollab Path**: The local path to your SpriteCollab repository
2. **Pokemon Index**: A 4-digit index of the Pokemon to add (e.g., "0001"). Leave the index field empty to process all Pokemon at once (⚠️ may take several hours)

## Process Overview

The script performs these 5 steps in order:

1. **Split Sprites**: Extracts individual frames from sprite sheets, with durations and delays data
2. **Run TexturePacker**: Packs sprites into optimized sprite sheets
3. **Minify Sheets** : Removes metadata and updates index lists
4. **Move Files** : Copies files to the appropriate asset directories
5. **Track portraits available** : Updates the list of available portraits/emotions

## Requirements

### Software Dependencies:

- Node.js (>=20.16.0)
- TexturePacker (command-line version)
- ts-node (for TypeScript execution)

## Cross-Platform Support

- **Windows**: Uses `TexturePacker.exe`
- **Mac/Linux**: Uses `TexturePacker` command
- **Path handling**: Supports both forward/backward slashes and home directory expansion (`~`)
- **Shell compatibility**: Works with any shell (PowerShell, bash, zsh, etc.)

## Troubleshooting

### Common Issues:

1. **TexturePacker not found**
   - Ensure TexturePacker CLI is installed and in PATH
   - The script automatically detects your platform and uses the correct command

2. **Path not found errors**
   - Verify SpriteCollab repository path exists
   - Use absolute paths when possible
   - The script supports both forward slashes and backslashes

3. **Permission errors**
   - Ensure write permissions to `sheets/` and `../app/` directories
   - On Unix systems, may need to run with appropriate permissions

4. **Missing dependencies**
   - Run `npm install` from project root
   - Ensure all required dependencies are installed
