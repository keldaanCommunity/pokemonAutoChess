import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"

type OnEvolutionHook = (pokemonEvolved: Pokemon, player: Player) => void

const onEvolutionHooks: OnEvolutionHook[] = []

export function registerOnEvolutionHook(hook: OnEvolutionHook) {
  onEvolutionHooks.push(hook)
}

export function triggerOnEvolutionHooks(
  pokemonEvolved: Pokemon,
  player: Player
) {
  onEvolutionHooks.forEach((hook) => hook(pokemonEvolved, player))
}
