import { getBaseAltForm, PkmAltFormsByPkm } from "../config"
import GameState from "../rooms/states/game-state"
import { Scarves, Title } from "../types"
import { EffectEnum } from "../types/enum/Effect"
import { NonPkm, Pkm, PkmIndex } from "../types/enum/Pokemon"
import { IUserMetadataMongo } from "../types/interfaces/UserMetadata"
import { isIn } from "../utils/array"
import { values } from "../utils/schemas"
import Player from "./colyseus-models/player"

export function updatePlayerTitlesAfterFight(player: Player, state: GameState) {
  const simulation = state.simulations.get(player.simulationId)
  if (!simulation) return

  const effects = simulation?.getEffects(player.id)
  if (effects) {
    effects.forEach((effect) => {
      switch (effect) {
        case EffectEnum.PURE_POWER:
          player.titles.add(Title.POKEFAN)
          break
        case EffectEnum.OVERGROW:
          player.titles.add(Title.POKEMON_RANGER)
          break
        case EffectEnum.DESOLATE_LAND:
          player.titles.add(Title.KINDLER)
          break
        case EffectEnum.PRIMORDIAL_SEA:
          player.titles.add(Title.FIREFIGHTER)
          break
        case EffectEnum.POWER_SURGE:
          player.titles.add(Title.ELECTRICIAN)
          break
        case EffectEnum.JUSTIFIED:
          player.titles.add(Title.BLACK_BELT)
          break
        case EffectEnum.EERIE_SPELL:
          player.titles.add(Title.TELEKINESIST)
          break
        case EffectEnum.BEAT_UP:
          player.titles.add(Title.DELINQUENT)
          break
        case EffectEnum.MAX_MELTDOWN:
          player.titles.add(Title.ENGINEER)
          break
        case EffectEnum.DEEP_MINER:
          player.titles.add(Title.GEOLOGIST)
          break
        case EffectEnum.TOXIC:
          player.titles.add(Title.TEAM_ROCKET_GRUNT)
          break
        case EffectEnum.DRAGON_DANCE:
          player.titles.add(Title.DRAGON_TAMER)
          break
        case EffectEnum.ANGER_POINT:
          player.titles.add(Title.CAMPER)
          break
        case EffectEnum.MERCILESS:
          player.titles.add(Title.MYTH_TRAINER)
          break
        case EffectEnum.CALM_MIND:
          player.titles.add(Title.RIVAL)
          break
        case EffectEnum.SURGE_SURFER:
          player.titles.add(Title.SURFER)
          break
        case EffectEnum.HEART_OF_THE_SWARM:
          player.titles.add(Title.BUG_MANIAC)
          break
        case EffectEnum.SKYDIVE:
          player.titles.add(Title.BIRD_KEEPER)
          break
        case EffectEnum.FLOWER_POWER:
          player.titles.add(Title.GARDENER)
          break
        case EffectEnum.GOOGLE_SPECS:
          player.titles.add(Title.ALCHEMIST)
          break
        case EffectEnum.BERSERK:
          player.titles.add(Title.BERSERKER)
          break
        case EffectEnum.ETHEREAL:
          player.titles.add(Title.BLOB)
          break
        case EffectEnum.BANQUET:
          player.titles.add(Title.CHEF)
          break
        case EffectEnum.DIAMOND_STORM:
          player.titles.add(Title.HIKER)
          break
        case EffectEnum.CURSE_OF_FATE:
          player.titles.add(Title.HEX_MANIAC)
          break
        case EffectEnum.MOON_FORCE:
          player.titles.add(Title.CUTE_MANIAC)
          break
        case EffectEnum.SHEER_COLD:
          player.titles.add(Title.SKIER)
          break
        case EffectEnum.FORGOTTEN_POWER:
          player.titles.add(Title.MUSEUM_DIRECTOR)
          break
        case EffectEnum.PRESTO:
          player.titles.add(Title.MUSICIAN)
          break
        case EffectEnum.GOLDEN_EGGS:
          player.titles.add(Title.BABYSITTER)
          break
        case EffectEnum.MAX_ILLUMINATION:
          player.titles.add(Title.CHOSEN_ONE)
          break
        default:
          break
      }
    })
    if (effects.size >= 5) {
      player.titles.add(Title.HARLEQUIN)
    }
    if (effects.size >= 10) {
      player.titles.add(Title.TACTICIAN)
    }
    if (effects.size >= 15) {
      player.titles.add(Title.STRATEGIST)
    }
    let shield = 0
    let heal = 0
    const dpsMeter = simulation.getDpsMeter(player.id)

    if (dpsMeter) {
      dpsMeter.forEach((v) => {
        shield += v.shield
        heal += v.heal
      })
    }

    if (shield > 1000) {
      player.titles.add(Title.GARDIAN)
    }
    if (heal > 1000) {
      player.titles.add(Title.NURSE)
    }

    if (state.stageLevel >= 40) {
      player.titles.add(Title.ETERNAL)
    }

    const equippedItems = values(player.board).flatMap((p) => values(p.items))
    if (equippedItems.filter((i) => isIn(Scarves, i)).length >= 5) {
      player.titles.add(Title.SCOUT)
    }
  }
}

export function updatePlayerTitlesAfterGame(
  player: Player,
  usr: IUserMetadataMongo,
  rank: number
) {
  player.titles.add(Title.NOVICE)
  if (usr.level >= 10) {
    player.titles.add(Title.ROOKIE)
  }
  if (usr.level >= 20) {
    player.titles.add(Title.AMATEUR)
    player.titles.add(Title.BOT_BUILDER)
  }
  if (usr.level >= 30) {
    player.titles.add(Title.VETERAN)
  }
  if (usr.level >= 50) {
    player.titles.add(Title.PRO)
  }
  if (usr.level >= 100) {
    player.titles.add(Title.EXPERT)
  }
  if (usr.level >= 150) {
    player.titles.add(Title.ELITE)
  }
  if (usr.level >= 200) {
    player.titles.add(Title.MASTER)
  }
  if (usr.level >= 300) {
    player.titles.add(Title.GRAND_MASTER)
  }

  if (player.life >= 100 && rank === 1) {
    player.titles.add(Title.TYRANT)
  }
  if (player.life === 1 && rank === 1) {
    player.titles.add(Title.SURVIVOR)
  }

  if (player.rerollCount > 60) {
    player.titles.add(Title.GAMBLER)
  } else if (player.rerollCount < 20 && rank === 1) {
    player.titles.add(Title.NATURAL)
  }

  if (
    player.titles.has(Title.COLLECTOR) === false &&
    Object.values(Pkm)
      .filter((p) => NonPkm.includes(p) === false)
      .every((pkm) => {
        const baseForm = getBaseAltForm(pkm)
        const accepted: Pkm[] =
          baseForm in PkmAltFormsByPkm
            ? [
                baseForm,
                ...PkmAltFormsByPkm[baseForm as keyof typeof PkmAltFormsByPkm]
              ]
            : [baseForm]
        return accepted.some((form) => {
          const pokemonCollectionItem = usr.pokemonCollection.get(
            PkmIndex[form]
          )
          return pokemonCollectionItem && pokemonCollectionItem.played > 0
        })
      })
  ) {
    player.titles.add(Title.COLLECTOR)
  }

  if (usr.elo >= 1100) {
    player.titles.add(Title.GYM_TRAINER)
  }
  if (usr.elo >= 1200) {
    player.titles.add(Title.GYM_CHALLENGER)
  }
  if (usr.elo >= 1400) {
    player.titles.add(Title.GYM_LEADER)
  }
}
