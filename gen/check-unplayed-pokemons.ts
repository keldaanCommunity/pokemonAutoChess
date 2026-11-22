import { readFileSync } from "node:fs"
import { PkmAltForms } from "../app/config"
import { precomputedPokemonsImplemented } from "../app/models/precomputed/precomputed-pokemons"
import { NonPkm } from "../app/types/enum/Pokemon"

type CollectionItem = { id?: unknown; played?: unknown }

function toItem(value: unknown): CollectionItem {
  if (value === null || typeof value !== "object") {
    throw new Error("Invalid collection item: expected an object")
  }
  return value as CollectionItem
}

function addPlayedIndex(
  index: string,
  item: CollectionItem,
  playedIndexes: Set<string>
) {
  if (Number(item.played) > 0) {
    playedIndexes.add(typeof item.id === "string" ? item.id : index)
  }
}

function collectPlayedIndexes(
  input: unknown,
  playedIndexes: Set<string>
): void {
  if (Array.isArray(input)) {
    for (const value of input) {
      if (
        value !== null &&
        typeof value === "object" &&
        "pokemonCollection" in value
      ) {
        collectPlayedIndexes(
          (value as { pokemonCollection: unknown }).pokemonCollection,
          playedIndexes
        )
      } else if (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === "string"
      ) {
        addPlayedIndex(value[0], toItem(value[1]), playedIndexes)
      } else {
        const item = toItem(value)
        if (typeof item.id === "string") {
          addPlayedIndex(item.id, item, playedIndexes)
        }
      }
    }
    return
  }

  if (input === null || typeof input !== "object") {
    throw new Error("Invalid collection JSON: expected an object or an array")
  }

  if ("pokemonCollection" in input) {
    collectPlayedIndexes(
      (input as { pokemonCollection: unknown }).pokemonCollection,
      playedIndexes
    )
    return
  }

  for (const [index, item] of Object.entries(input)) {
    addPlayedIndex(index, toItem(item), playedIndexes)
  }
}

function readInput(): unknown {
  const filePath = process.argv[2]
  if (!filePath && process.stdin.isTTY) {
    console.error("Usage: tsx gen/unplayed-pokemons.ts <collection.json>")
    console.error("Collection JSON can also be piped to stdin.")
    process.exit(1)
  }
  const raw = readFileSync(filePath ? filePath : 0, "utf8")
  return JSON.parse(raw)
}

const playedIndexes = new Set<string>()
collectPlayedIndexes(readInput(), playedIndexes)

const listPokemons = precomputedPokemonsImplemented.filter(
  (pokemon) =>
    !PkmAltForms.includes(pokemon.name) && !NonPkm.includes(pokemon.name)
)
const unplayedPokemons = listPokemons.filter(
  (pokemon) => !playedIndexes.has(pokemon.index)
)

console.log(
  `${unplayedPokemons.length} pokemons not played (out of ${listPokemons.length}):`
)
console.log(unplayedPokemons.map((p) => `${p.index} ${p.name}`).join("; "))
