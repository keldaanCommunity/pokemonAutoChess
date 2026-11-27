import PokemonFactory from "../app/models/pokemon-factory"
import {
  DEFAULT_POKEMON_ANIMATION_CONFIG,
  PokemonAnimations
} from "../app/public/src/game/components/pokemon-animations"
import { Pkm } from "../app/types/enum/Pokemon"

const mismatches: string[] = []

for (const pkm of Object.values(Pkm)) {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
  const attackSprite =
    PokemonAnimations[pkm]?.attackSprite ??
    DEFAULT_POKEMON_ANIMATION_CONFIG.attackSprite

  if (
    (pokemon.range === 1 && attackSprite.endsWith("/range")) ||
    (pokemon.range > 2 && attackSprite.endsWith("/melee"))
  ) {
    mismatches.push(`${pkm}: range ${pokemon.range} uses ${attackSprite}`)
  }
}

if (mismatches.length > 0) {
  console.error("Attack sprite range mismatches found:")
  for (const mismatch of mismatches) console.error(`  ${mismatch}`)
  process.exitCode = 1
} else {
  console.log("All attack sprites match their Pokémon attack ranges.")
}
