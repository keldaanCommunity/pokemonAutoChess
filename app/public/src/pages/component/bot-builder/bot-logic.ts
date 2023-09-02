import {
  IBot,
  IDetailledPokemon,
  IStep
} from "../../../../../models/mongo-models/bot-v2"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Rarity } from "../../../../../types/enum/Game"
import { BasicItems, Item } from "../../../../../types/enum/Item"
import { PkmIndex, Pkm, PkmDuos } from "../../../../../types/enum/Pokemon"
import { clamp, min } from "../../../../../utils/number"

export const DEFAULT_BOT_STATE = {
  steps: Array.from({ length: 31 }, () => ({
    roundsRequired: 1,
    board: []
  })) as IStep[],
  avatar: PkmIndex[Pkm.DITTO],
  author: "",
  elo: 1200,
  name: Pkm.DITTO,
  id: ""
}

export const POWER_SCORE_BY_CATEGORY = {
  "COMMON T1": 1,
  "COMMON 2S T2": 2.5,
  "COMMON 3S T2": 2,
  "COMMON 3S T3": 4,
  "UNCOMMON T1": 1.25,
  "UNCOMMON 2S T2": 3,
  "UNCOMMON 3S T2": 2.5,
  "UNCOMMON 3S T3": 5,
  "RARE T1": 1.5,
  "RARE 2S T2": 4,
  "RARE 3S T2": 3,
  "RARE 3S T3": 6,
  "HATCH T1": 1.5,
  "HATCH 3S T2": 3,
  "HATCH 3S T3": 5,
  "EPIC T1": 2,
  "EPIC 2S T2": 5,
  "EPIC 3S T2": 4,
  "EPIC 3S T3": 8,
  "ULTRA T1": 3,
  "ULTRA 3S T2": 6,
  "ULTRA 3S T3": 10,
  "UNIQUE T2": 3,
  "UNIQUE T3": 4,
  "UNIQUE T4": 5,
  "UNIQUE T3 DUO": 2.5,
  "LEGENDARY T3": 6,
  "LEGENDARY T4": 8,
  "LEGENDARY DUO": 3.5,
  "MYTHICAL T3": 6,
  "MYTHICAL T3 DUO": 5,
  "MYTHICAL T4": 8,
  "SPECIAL T1": 1.5,
  "SPECIAL T2": 3,
  "SPECIAL T3": 4.5,
  "SPECIAL T4": 6
}

export const POWER_AVERAGES = [
  2, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 11, 11.5, 12, 13, 14, 15, 16, 17, 18, 19,
  24, 25, 25.5, 26, 27, 27.5, 28, 28.5, 29, 29.5, 30
]

export function getCategory(pkm: Pkm): string {
  const p = PokemonFactory.createPokemonFromName(pkm)
  //= & " T"&'Raw Data'!D2 & IF('Raw Data'!V2=TRUE, " DUO", "")
  let category = p.rarity.toUpperCase()
  if (
    [Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.MYTHICAL, Rarity.SPECIAL].includes(
      p.rarity
    ) === false &&
    p.stars > 1
  ) {
    category += p.additional ? " 2S" : " 3S"
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
    console.warn(`Couldn't find power category for ${pkm}: ${c}`)
  }
})

export function getPowerScore(board: IDetailledPokemon[]): number {
  return board.reduce((sum, pkm) => {
    const category = getCategory(pkm.name)
    return sum + (POWER_SCORE_BY_CATEGORY[category] ?? 1)
  }, 0)
}

export function getPowerEvaluation(powerScore: number, stage: number) {
  return clamp(
    50 + (100 * (powerScore - POWER_AVERAGES[stage])) / POWER_AVERAGES[stage],
    0,
    100
  )
}

export function getMaxItemComponents(step: number): number {
  if (step === 0) return 0
  /*
  Stage 4 = 3 full items 
  Stage 11 = 4 full items 
  Stage 16 = 5 full items 
  Stage 21 = 6 full items 
  Stage 26 = 7 full items 
  Stage 31 = 8 full items 
  */
  return (step >= 4 ? 3 : step) * 2 + Math.floor(min(0)(step - 6) / 5) * 2
}

export function getNbComponentsOnBoard(board: IDetailledPokemon[]): number {
  return board
    .flatMap((pkm) => pkm.items)
    .reduce(
      (nbComponents: number, item: Item) =>
        nbComponents + (BasicItems.includes(item) ? 1 : 2),
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
  bot.steps = oneSteps
  return bot
}
