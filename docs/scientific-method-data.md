# Scientific-method data extraction and experiment workflow

This project now supports a **phase-based science workflow**:

1. **Phase 1**: static extraction + normalization + claims + reproducible experiments
2. **Phase 2**: mechanics verification + baseline screening + constrained comp search
3. **Phase 3**: lobby-realistic policy evaluation (economy/shop/pool/contest dynamics)

## Phase 1 commands

```bash
npm run extract-science-data
npm run validate-science-data
npm run generate-claims
npm run run-experiments -- --claims app/models/precomputed/scientific-method/claims.jsonl --seed 42 --battles-per-condition 500 --run-id latest
```

## Phase 2 commands (verify → baseline → search → confirm)

```bash
npm run verify-mechanics -- --seed 42 --run-id latest
npm run run-baselines -- --stage singles --seed 42 --battles 200 --run-id latest
npm run run-baselines -- --stage pairs --seed 42 --battles 200 --run-id latest
npm run search-comps -- --mode beam --budget 5000 --seed 42 --run-id latest
```

## Phase 3 commands (realism + policy + lobby)

```bash
npm run simulate-lobby -- --players 8 --seed 42 --rounds 30 --policy policy.greedy-synergy --run-id latest
npm run validate-simulator -- --seed 42 --lobbies 200 --run-id latest
npm run generate-policy-claims
npm run run-policy-experiments -- --claims app/models/precomputed/scientific-method/policy-claims.jsonl --lobbies-per-condition 300 --seed 42 --run-id latest
npm run meta-report -- --seed 42 --lobbies 2000 --run-id latest
```

## One-button orchestrator

```bash
node gen/science/cli.js run --seed 42 --profile fast --run-id latest
```

The CLI executes the full ladder and writes:

- `results/<runId>/summary.json`
- `results/<runId>/summary.md`
- `results/<runId>/STATUS.txt` (`PASS`/`FAIL`)

Exit codes:

- `0`: PASS
- `1`: FAIL (goal criteria not met)
- `2`: pipeline error/crash

Goal criteria are read from `goals.json` next to the executable (or repo root fallback).

## Windows packaging

### Route A (recommended portable folder)

```bash
npm run win:dist
```

If you get Windows setup/script errors, run:

```bash
npm.cmd run win:doctor
```

Creates `dist/PokeChessScience/` with:

- `pokechess-science.cmd`
- `node/` (portable runtime placeholder or copied from `POKECHESS_PORTABLE_NODE_DIR`)
- `app/` (CLI + science scripts)
- `data/` (required data payload)
- `results/`

The CMD wrapper sets:

- `POKECHESS_HOME=%~dp0`
- `POKECHESS_DATA=%~dp0data`

so outputs are always written next to the executable folder.

### Route B (optional single EXE)

```bash
npm run build:win
```

Builds with `esbuild + pkg` targeting `node18-win-x64`.


## Windows troubleshooting

Common causes and fixes:

- `Missing script: "win:dist"`
  - You are likely in an outdated/wrong folder copy.
  - Run `npm run` and check that `win:dist` exists.
- `Cannot find module ... gen\science\build-windows-dist.js`
  - Your copy is missing new science scripts. Update to latest repository version.
- PowerShell blocks `npm.ps1`
  - Use `npm.cmd` (recommended): `npm.cmd run win:dist`
  - Or bypass for current shell only: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

Quick diagnostic:

```bash
npm.cmd run win:doctor
```

This checks scripts, required files, and Node/npm availability and prints actionable next steps.

## Merge conflict fast-path (generated science data)

If a merge/rebase produces many conflicts in precomputed files under
`app/models/precomputed/scientific-method/`, run:

```bash
npm run resolve-science-conflicts
```

What it does:

- prioritizes incoming (`--theirs`) versions for conflicted generated datasets and key source files,
- regenerates all scientific-method artifacts from source extractor,
- validates data integrity,
- stages regenerated datasets so you can finish merge/rebase quickly.

## Smoke test

```bash
npm run test:windows-smoke
```

Runs the CLI in a temporary `POKECHESS_HOME` and asserts `results/latest/STATUS.txt` exists.


## Validation report semantics (WRONG Ledger)

`validate-science-data` now emits `validation-report.json` with a paraconsistent “wrong-ledger” section:

- every proposition is denied-by-default,
- evidence can still add support,
- outputs are classified as `actionable`, `contested`, `denied`, or `unknown`.

This keeps contradictions from collapsing the pipeline and makes validation outcomes question-driven.

## Result schema checks

```bash
npm run validate-result-schemas -- --run-id latest
```

## Generated artifacts

Static datasets (`app/models/precomputed/scientific-method/`):

- `pokemon-scientific-dataset.json`
- `effect-registry.json`
- `synergy-dataset.json`
- `shop-pool.json`
- `item-registry.json`
- `item-drop-table.json`
- `fusion-rules.json`
- `economy-rules.json`
- `frequency-summary.json`
- `experiment-design-template.json`
- `mechanics-glossary.json`
- `effects-text-dataset.json` (all synergy/item/ability texts + extracted numbers)
- `claims.jsonl`
- `policy-claims.jsonl`

Dynamic results (`results/<runId>/`):

- `mechanics-verification/traces.jsonl`, `mechanics-verification/report.json`
- `baselines/singles.json`, `baselines/pairs.json`, `baselines/synergy-graph.json`
- `generated-claims.jsonl`
- `lobbies/lobby-seed*.json`
- `simulator-validation/report.json`
- `policy-experiment-results.json`
- `meta/meta-report.json`
- `summary.json`, `summary.md`, `STATUS.txt`
