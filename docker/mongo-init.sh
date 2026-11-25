#!/bin/sh
(
  set -eu
  mongosh --quiet --host 127.0.0.1 dev --eval '
    const bots = EJSON.parse(require("fs").readFileSync("/seed/botv2.json", "utf8"));
    if (!Array.isArray(bots) || bots.length === 0) throw new Error("Bot seed is empty or invalid");
    db.botv2.insertMany(bots);
    print(`Imported ${bots.length} bots`);
  '
)
