import {
  ARCEUS_RATE,
  EEVEE_RATE,
  KECLEON_RATE,
  NB_STARTERS,
  NB_UNIQUE_PROPOSITIONS,
  PkmAltFormsByPkm,
  UniquePool
} from "../config"
import { STARTER_RARITY_WEIGHTS } from "../config/game/game"
import { NB_LEGENDARY_PROPOSITIONS } from "../config/game/pokemons"
import { LegendaryPool } from "../config/game/pools"
import type Player from "../models/colyseus-models/player"
import { PlayerChoice } from "../models/colyseus-models/player-choice"
import { PokemonClasses } from "../models/colyseus-models/pokemon"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import type GameState from "../rooms/states/game-state"
import { Item, ItemComponentsNoFossilOrScarf } from "../types"
import type { DungeonPMDO } from "../types/enum/Dungeon"
import { Rarity } from "../types/enum/Game"
import {
  isRegionalVariant,
  Pkm,
  PkmFamily,
  type PkmProposition,
  PkmRegionalVariants,
  pkmsFromProposition
} from "../types/enum/Pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import type { Synergy } from "../types/enum/Synergy"
import { removeFromArray } from "../utils/array"
import {
  chance,
  pickNRandomIn,
  pickRandomIn,
  randomWeighted
} from "../utils/random"
import { getAltFormForPlayer } from "./alt-form-logic"
import { pickFirstPartners } from "./scribbles"

function filterCandidates(
  proposition: PkmProposition,
  synergyWanted: Synergy | undefined,
  map: DungeonPMDO | "town",
  pokemonsProposed: PkmProposition[]
): boolean {
  const pkm: Pkm = pkmsFromProposition(proposition)[0]
  const { types, regional } = getPokemonData(pkm)

  const hasSynergyWanted =
    synergyWanted === undefined || types.includes(synergyWanted)

  if (!hasSynergyWanted) return false

  if (regional) {
    const pokemon = new PokemonClasses[pkm](pkm)
    if (!pokemon.isInRegion(map)) {
      // skip regional pokemons not in their region
      return false
    }
  }

  if (
    pokemonsProposed.some((prop) => {
      const p: Pkm = pkmsFromProposition(prop)[0]
      return PkmFamily[p] === PkmFamily[pkm] || isRegionalVariant(p, pkm)
    })
  ) {
    // avoid proposing two pokemons of the same family or regional variants
    return false
  }

  if (
    pkm in PkmRegionalVariants &&
    PkmRegionalVariants[pkm]?.some((p) => {
      const variant = new PokemonClasses[p](p)
      const lostTypes = types.filter((type) => !variant.hasSynergy(type))
      return (
        variant.isInRegion(map) &&
        synergyWanted &&
        lostTypes.includes(synergyWanted)
      )
    })
  ) {
    // avoid proposing pokemon whose regional variants would lose the wanted synergy
    return false
  }

  return true
}

export function assignStarters(
  player: Player,
  state: GameState,
  portalSynergies: Synergy[]
) {
  const starterRarity = randomWeighted(STARTER_RARITY_WEIGHTS) ?? Rarity.COMMON
  const starterPool = state.shop.getPool(starterRarity) ?? state.shop.commonPool
  let allCandidates: PkmProposition[] = [...starterPool]
  //TODO: pick uncommon and rare sometimes

  if (state.specialGameRule === SpecialGameRule.UNIQUE_STARTER) {
    allCandidates = [...UniquePool]
  } else if (state.specialGameRule === SpecialGameRule.FIRST_PARTNER) {
    allCandidates = pickFirstPartners(player, state)
  }

  // ensure we have at least one synergy per proposition
  if (portalSynergies.length > NB_UNIQUE_PROPOSITIONS) {
    portalSynergies = pickNRandomIn(portalSynergies, NB_UNIQUE_PROPOSITIONS)
  }

  const nbPropositions = NB_STARTERS
  const pokemonsProposed: PkmProposition[] = []
  const itemsProposed: Item[] = []

  for (let i = 0; i < nbPropositions; i++) {
    const synergyWanted: Synergy | undefined = portalSynergies[i]

    let candidates = allCandidates.filter((proposition) =>
      filterCandidates(proposition, synergyWanted, player.map, pokemonsProposed)
    )
    const initialCandidatesEmpty = candidates.length === 0
    if (initialCandidatesEmpty) {
      candidates = allCandidates.filter((proposition) =>
        filterCandidates(proposition, undefined, player.map, pokemonsProposed)
      )
    }
    let selected = pickRandomIn(candidates)

    if (selected in PkmRegionalVariants) {
      const regionalVariants = PkmRegionalVariants[selected]!.filter((p) =>
        new PokemonClasses[p](p).isInRegion(player.map)
      )
      if (regionalVariants.length > 0) selected = pickRandomIn(regionalVariants)
    }
    if (selected in PkmAltFormsByPkm) {
      selected = getAltFormForPlayer(selected as Pkm, player)
    }

    itemsProposed[i] = pickRandomIn(
      ItemComponentsNoFossilOrScarf.filter(
        (c) => itemsProposed.includes(c) === false
      )
    )

    if (
      pokemonsProposed.includes(Pkm.EEVEE) === false &&
      (chance(EEVEE_RATE) || initialCandidatesEmpty) &&
      state.specialGameRule !== SpecialGameRule.FIRST_PARTNER &&
      state.specialGameRule !== SpecialGameRule.UNIQUE_STARTER
    ) {
      selected = Pkm.EEVEE
      itemsProposed[i] = Item.FOSSIL_STONE
    }

    removeFromArray(allCandidates, selected)
    pokemonsProposed.push(selected)
  }

  player.choices.push(
    new PlayerChoice({
      type: "starter",
      pokemons: pokemonsProposed,
      items: itemsProposed
    })
  )
}

export function assignUniquePropositions(
  player: Player,
  portalSynergies: Synergy[]
) {
  const allCandidates: PkmProposition[] = [...UniquePool]

  // ensure we have at least one synergy per proposition
  if (portalSynergies.length > NB_UNIQUE_PROPOSITIONS) {
    portalSynergies = pickNRandomIn(portalSynergies, NB_UNIQUE_PROPOSITIONS)
  }

  const nbPropositions = NB_UNIQUE_PROPOSITIONS
  const pokemonsProposed: PkmProposition[] = []

  for (let i = 0; i < nbPropositions; i++) {
    const synergyWanted: Synergy | undefined = portalSynergies[i]

    let candidates = allCandidates.filter((proposition) =>
      filterCandidates(proposition, synergyWanted, player.map, pokemonsProposed)
    )
    const initialCandidatesEmpty = candidates.length === 0
    if (initialCandidatesEmpty) {
      candidates = allCandidates.filter((proposition) =>
        filterCandidates(proposition, undefined, player.map, pokemonsProposed)
      )
    }
    let selected = pickRandomIn(candidates)

    if (selected in PkmRegionalVariants) {
      const regionalVariants = PkmRegionalVariants[selected]!.filter((p) =>
        new PokemonClasses[p](p).isInRegion(player.map)
      )
      if (regionalVariants.length > 0) selected = pickRandomIn(regionalVariants)
    }
    if (selected in PkmAltFormsByPkm) {
      selected = getAltFormForPlayer(selected as Pkm, player)
    }

    if (
      pokemonsProposed.includes(Pkm.KECLEON) === false &&
      chance(KECLEON_RATE)
    ) {
      selected = Pkm.KECLEON
    }

    removeFromArray(allCandidates, selected)
    pokemonsProposed.push(selected)
  }

  player.choices.push(
    new PlayerChoice({
      type: "unique",
      pokemons: pokemonsProposed,
      items: []
    })
  )
}

export function assignLegendaries(
  player: Player,
  synergiesWanted: Synergy[]
): PkmProposition[] {
  const pokemonsProposed: PkmProposition[] = []
  const allCandidates = [...LegendaryPool]
  for (let i = 0; i < NB_LEGENDARY_PROPOSITIONS; i++) {
    const synergyWanted: Synergy | undefined = synergiesWanted[i]

    let candidates = allCandidates.filter((proposition) =>
      filterCandidates(proposition, synergyWanted, player.map, pokemonsProposed)
    )
    const initialCandidatesEmpty = candidates.length === 0
    if (initialCandidatesEmpty) {
      candidates = allCandidates.filter((proposition) =>
        filterCandidates(proposition, undefined, player.map, pokemonsProposed)
      )
    }
    let selected = pickRandomIn(candidates)

    if (selected in PkmRegionalVariants) {
      const regionalVariants = PkmRegionalVariants[selected]!.filter((p) =>
        new PokemonClasses[p](p).isInRegion(player.map)
      )
      if (regionalVariants.length > 0) selected = pickRandomIn(regionalVariants)
    }
    if (selected in PkmAltFormsByPkm) {
      selected = getAltFormForPlayer(selected as Pkm, player)
    }

    if (
      pokemonsProposed.includes(Pkm.ARCEUS) === false &&
      chance(ARCEUS_RATE)
    ) {
      selected = Pkm.ARCEUS
    }

    removeFromArray(allCandidates, selected)
    pokemonsProposed.push(selected)
  }

  return pokemonsProposed
}
