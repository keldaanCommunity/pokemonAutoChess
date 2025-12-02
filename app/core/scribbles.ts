import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory, {
  getColorVariantForPlayer,
  PkmColorVariantsByPkm
} from "../models/pokemon-factory"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../models/precomputed/precomputed-rarity"
import { getRegularsTier1 } from "../models/shop"
import GameState from "../rooms/states/game-state"
import { Rarity } from "../types/enum/Game"
import { Pkm, PkmRegionalVariants } from "../types/enum/Pokemon"
import { getPokemonCustomFromAvatar } from "../utils/avatar"
import { getFirstAvailablePositionInBench } from "../utils/board"
import { min } from "../utils/number"
import { pickRandomIn, simpleHashSeededCoinFlip } from "../utils/random"
import { getUnitPowerScore } from "./bot-logic"
import { createRandomEgg } from "./eggs"

export function spawnDIAYAvatar(player: Player): Pokemon {
  const {
    name,
    emotion,
    shiny = false
  } = getPokemonCustomFromAvatar(player.avatar)
  player.firstPartner = name
  let powerScore = getUnitPowerScore(name)

  switch (player.firstPartner) {
    case Pkm.AEGISLASH_BLADE:
      player.firstPartner = Pkm.AEGISLASH
      break

    case Pkm.HOOPA_UNBOUND:
      player.firstPartner = Pkm.HOOPA
      break

    case Pkm.MINIOR_KERNEL_BLUE:
    case Pkm.MINIOR_KERNEL_GREEN:
    case Pkm.MINIOR_KERNEL_ORANGE:
    case Pkm.MINIOR_KERNEL_RED:
      player.firstPartner = Pkm.MINIOR
      break

    case Pkm.MORPEKO_HANGRY:
      player.firstPartner = Pkm.MORPEKO
      break

    case Pkm.DARMANITAN_ZEN:
      player.firstPartner = Pkm.DARMANITAN
      break

    case Pkm.COSMOG:
    case Pkm.POIPOLE:
    case Pkm.CHIMECHO:
    case Pkm.GIMMIGHOUL:
      powerScore = 5
      break

    case Pkm.COSMOEM:
      powerScore = 6
      break

    case Pkm.NAGANADEL:
    case Pkm.GHOLDENGO:
      powerScore = 8
      break
  }

  let avatar: Pokemon
  if (player.firstPartner === Pkm.EGG) {
    avatar = createRandomEgg(player, false)
    powerScore = 5
  } else {
    avatar = PokemonFactory.createPokemonFromName(player.firstPartner, {
      emotion,
      shiny
    })
  }

  avatar.positionX = getFirstAvailablePositionInBench(player.board) ?? 0
  avatar.positionY = 0

  if (avatar.name === Pkm.EGG) {
    powerScore = 5
    if (avatar.shiny) {
      player.money = 1
    }
  }
  if (avatar.rarity === Rarity.HATCH) {
    powerScore = [5, 6, 7][avatar.stars] ?? 7
  }
  if (avatar.rarity === Rarity.SPECIAL) {
    powerScore = [1, 3, 7, 7][avatar.stars] ?? 7
  }
  if (powerScore < 5) {
    player.money += 55 - Math.round(10 * powerScore)
  } else {
    avatar.ap = min(-100)(avatar.ap - (powerScore - 5) * 10)
    avatar.addAttack(-Math.round(avatar.atk * (powerScore - 5) * 0.1))
  }
  const bonusHP = Math.round(150 - powerScore * 30)
  avatar.hp = min(10)(avatar.hp + bonusHP)
  return avatar
}

export function pickFirstPartners(player: Player, state: GameState): Pkm[] {
  const coinFlip = simpleHashSeededCoinFlip(state.preparationId)
  const rarityPartner = coinFlip ? Rarity.COMMON : Rarity.UNCOMMON
  return getRegularsTier1(PRECOMPUTED_POKEMONS_PER_RARITY[rarityPartner])
    .filter((p) => getPokemonData(p).stages === 3)
    .map((pkm) => {
      if (pkm in PkmRegionalVariants) {
        const regionalVariants = PkmRegionalVariants[pkm]!.filter((p) =>
          player.regionalPokemons.includes(p)
        )
        if (regionalVariants.length > 0) pkm = pickRandomIn(regionalVariants)
      }
      if (pkm in PkmColorVariantsByPkm) {
        pkm = getColorVariantForPlayer(pkm, player)
      }
      return pkm
    })
}
