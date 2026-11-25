#!/bin/sh
set -eu

if [ -f /firebase-data/export/firebase-export-metadata.json ]; then
  exec firebase emulators:start --only auth --project demo-pokemon-auto-chess \
    --import /firebase-data/export --export-on-exit=/firebase-data/export
fi

exec firebase emulators:start --only auth --project demo-pokemon-auto-chess \
  --export-on-exit=/firebase-data/export
