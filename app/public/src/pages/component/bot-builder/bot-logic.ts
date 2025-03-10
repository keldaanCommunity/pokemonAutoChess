import {
  IBot,
  IDetailledPokemon,
  IStep
} from "../../../../../models/mongo-models/bot-v2"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import {
  AdditionalPicksStages,
  PortalCarouselStages
} from "../../../../../types/Config"
import { Rarity } from "../../../../../types/enum/Game"
import {
  CraftableItems,
  Item,
  ItemComponents
} from "../../../../../types/enum/Item"
import { Pkm, PkmDuos, PkmIndex } from "../../../../../types/enum/Pokemon"
import { logger } from "../../../../../utils/logger"
import { clamp, min } from "../../../../../utils/number"

export const MAX_BOTS_STAGE = 30

export const DEFAULT_BOT_STATE = {
  steps: Array.from({ length: MAX_BOTS_STAGE + 1 }, () => ({
    roundsRequired: 1,
    board: []
  })) as IStep[],
  avatar: PkmIndex[Pkm.DITTO] + "/Normal",
  author: "",
  elo: 1200,
  name: Pkm.DITTO,
  id: ""
}

export const POWER_SCORE_BY_CATEGORY = {
  "COMMON T1": 1,
  "COMMON 2S T2": 2.5,
  "COMMON 2S T3": 3.5,
  "COMMON 3S T2": 2,
  "COMMON 3S T3": 4,
  "COMMON 3S T4": 5,
  "UNCOMMON T1": 1.25,
  "UNCOMMON 2S T2": 3,
  "UNCOMMON 2S T3": 4,
  "UNCOMMON 3S T2": 2.5,
  "UNCOMMON 3S T3": 5,
  "UNCOMMON 3S T4": 7,
  "RARE T1": 1.5,
  "RARE 2S T2": 4,
  "RARE 2S T3": 7,
  "RARE 3S T2": 3,
  "RARE 3S T3": 6,
  "HATCH T1": 1.5,
  "HATCH 3S T2": 3,
  "HATCH 3S T3": 5,
  "EPIC T1": 2,
  "EPIC 2S T2": 5,
  "EPIC 2S T3": 7,
  "EPIC 3S T2": 4,
  "EPIC 3S T3": 8,
  "EPIC 2S T2 DUO": 4,
  "ULTRA T1": 3,
  "ULTRA 3S T2": 6,
  "ULTRA 3S T3": 10,
  "UNIQUE T1": 2,
  "UNIQUE T2": 3,
  "UNIQUE T3": 4,
  "UNIQUE T4": 5,
  "UNIQUE T3 DUO": 3,
  "LEGENDARY T3": 6,
  "LEGENDARY T4": 8,
  "LEGENDARY DUO": 4,
  "SPECIAL T1": 1.5,
  "SPECIAL T2": 3,
  "SPECIAL T3": 5,
  "SPECIAL T4": 7
}

export const POWER_AVERAGES = [
  2, 2, 3, 4, 4.5, 5, 6, 7, 8, 9, 11, 11.5, 12, 13, 14, 15, 16, 17, 18, 19, 24,
  25, 25.5, 26, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33,
  33.5, 34, 34.5, 35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40
]

export const BOT_SCORES = {
  INCOMPLETE: { label: "Incomplete", color: "#999" },
  VERY_EASY: { label: "Very Easy", color: "#109fff" },
  EASY: { label: "Easy", color: "#92cc41" },
  MEDIUM: { label: "Medium", color: "yellow" },
  HARD: { label: "Hard", color: "#f7d51d" },
  VERY_HARD: { label: "Very Hard", color: "#e76e55" },
  ILLEGAL: { label: "Illegal", color: "#761c1e" }
}

export function getBotScore(value: number) {
  let score = BOT_SCORES.INCOMPLETE
  if (value < 10) score = BOT_SCORES.INCOMPLETE
  else if (value < 26) score = BOT_SCORES.VERY_EASY
  else if (value < 42) score = BOT_SCORES.EASY
  else if (value < 58) score = BOT_SCORES.MEDIUM
  else if (value < 74) score = BOT_SCORES.HARD
  else if (value < 90) score = BOT_SCORES.VERY_HARD
  else score = BOT_SCORES.ILLEGAL
  return score
}

export function getCategory(pkm: Pkm): string {
  const p = getPokemonData(pkm)
  let category = p.rarity.toUpperCase()
  if (
    [Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.SPECIAL].includes(p.rarity) ===
      false &&
    p.stars > 1
  ) {
    category += p.stages === 2 ? " 2S" : " 3S"
  }
  category += ` T${p.stars}`
  if (Object.values(PkmDuos).some((duo) => duo.includes(pkm))) {
    category += " DUO"
  }
  return category
}

Object.values(Pkm).forEach((pkm) => {
  const c = getCategory(pkm)
  if (c in POWER_SCORE_BY_CATEGORY === false) {
    logger.warn(`Couldn't find power category for ${pkm}: ${c}`)
  }
})

export function getPowerScore(board: IDetailledPokemon[]): number {
  return board.reduce((sum, pkm) => sum + getUnitPowerScore(pkm.name), 0)
}

export function getUnitPowerScore(pkm: Pkm): number {
  return POWER_SCORE_BY_CATEGORY[getCategory(pkm)] ?? 1
}

export function getPowerEvaluation(powerScore: number, stage: number) {
  const powerAverage = POWER_AVERAGES[stage] ?? 40
  return clamp(50 + (100 * (powerScore - powerAverage)) / powerAverage, 0, 100)
}

export function getMaxItemComponents(stage: number): number {
  const nbComponentsPerStage = [
    0, 0, 1, 2, 4, 5, 6, 6, 6, 7, 8, 8, 9, 10, 10, 11, 12, 12, 13, 13, 14, 14,
    14, 16, 16, 16, 18, 18, 20, 20, 22, 22, 22, 22, 24, 26, 26, 28, 28, 28, 28,
    30
  ]
  return nbComponentsPerStage[stage] ?? 30
}

export function getNbComponentsOnBoard(board: IDetailledPokemon[]): number {
  return board
    .flatMap((pkm) => pkm.items)
    .reduce(
      (nbComponents: number, item: Item) =>
        nbComponents +
        (CraftableItems.includes(item)
          ? 2
          : ItemComponents.includes(item)
            ? 1
            : 0),
      0
    )
}

export function rewriteBotRoundsRequiredto1(bot: IBot) {
  /*
  Compatibility layer for old bots that use roundsRequired > 1 to skip some stages
  We just rewrite everything with 1 stage = 1 step because it's just so easier to reason about
  */
  const oneSteps: IStep[] = []
  bot.steps.forEach((step) => {
    for (let i = 0; i < min(1)(step.roundsRequired); i++) {
      oneSteps.push({ board: step.board, roundsRequired: 1 })
    }
  })
  bot = structuredClone(bot)
  bot.steps = oneSteps.slice(0, MAX_BOTS_STAGE + 1)
  return bot
}

export function estimateElo(bot: IBot): number {
  const scores = bot.steps
    .map((step, stage) => getPowerEvaluation(getPowerScore(step.board), stage))
    .slice(3)

  const averageScore =
    scores.reduce((total, score) => total + score, 0) / scores.length

  if (averageScore < 10) return 500
  if (averageScore < 20) return 600
  if (averageScore < 30) return 700
  if (averageScore < 40) return 800
  if (averageScore < 50) return 900
  if (averageScore < 60) return 1000
  if (averageScore < 70) return 1100
  if (averageScore < 80) return 1200
  if (averageScore < 90) return 1300
  return 1400
}

export function validateBot(bot: IBot) {
  const errors: string[] = []
  for (let stage = 0; stage < bot.steps.length; stage++) {
    try {
      validateBoard(bot.steps[stage].board, stage)
    } catch (err) {
      errors.push(`Stage ${stage}: ${err}`)
    }
  }
  return errors
}

export function validateBoard(board: IDetailledPokemon[], stage: number) {
  const team = board.map((p) => getPokemonData(p.name))
  const items = getNbComponentsOnBoard(board)
  const maxItems = getMaxItemComponents(stage)

  const duos = Object.values(PkmDuos)

  function removeDuoPartner(p, index, arr) {
    const duo = duos.find((duo) => duo.includes(p.name))
    if (duo != null) {
      const partnerName = duo.find((x) => x !== p.name)
      const partner = arr.find((x) => x.name === partnerName)
      if (partner && arr.indexOf(partner) < index) {
        return false // duo partner already found in list, we remove the second one
      }
    }
    return true
  }

  const uniques = team
    .filter((p) => p.rarity === Rarity.UNIQUE)
    .filter(removeDuoPartner)

  const legendaries = team
    .filter((p) => p.rarity === Rarity.LEGENDARY)
    .filter(removeDuoPartner)

  const additionalUncommon = team.filter(
    (p) =>
      p.additional &&
      (p.rarity === Rarity.UNCOMMON || p.rarity === Rarity.COMMON) // TEMP: common add picks should be moved to uncommon
  )
  const additionalRare = team.filter(
    (p) => p.additional && p.rarity === Rarity.RARE
  )

  const additionalEpic = team.filter(
    (p) => p.additional && p.rarity === Rarity.EPIC
  )

  if (stage < PortalCarouselStages[0] && uniques.length > 0) {
    throw new Error(
      `Unique Pokemons can't be played before stage ${PortalCarouselStages[1]}`
    )
  }
  if (stage < PortalCarouselStages[1] && legendaries.length > 0) {
    throw new Error(
      `Legendary Pokemons can't be played before stage ${PortalCarouselStages[2]}`
    )
  }

  if (stage < AdditionalPicksStages[0] && additionalUncommon.length > 0) {
    throw new Error(
      `Uncommon additional picks can't be played before stage ${AdditionalPicksStages[0]}`
    )
  }
  if (stage < AdditionalPicksStages[1] && additionalRare.length > 0) {
    throw new Error(
      `Rare additional picks can't be played before stage ${AdditionalPicksStages[1]}`
    )
  }
  if (stage < AdditionalPicksStages[2] && additionalEpic.length > 0) {
    throw new Error(
      `Epic additional picks can't be played before stage ${AdditionalPicksStages[2]}`
    )
  }
  if (uniques.length > 1) {
    throw new Error(`Only one Unique Pokemon can be played`)
  }
  if (legendaries.length > 1) {
    throw new Error(`Only one Legendary Pokemon can be played`)
  }
  if (team.length > 9) {
    throw new Error(`Maximum 9 Pokemon can be played in a team`)
  }
  if (items > maxItems) {
    throw new Error(`Too many item components are used at this stage`)
  }
}
