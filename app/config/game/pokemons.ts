import { Pkm } from "../../types/enum/Pokemon"

export const EvolutionTime = {
  EGG_HATCH: 5,
  EVOLVE_HATCH: 5
}

export const UnownsStage1 = [
  Pkm.UNOWN_A,
  Pkm.UNOWN_C,
  Pkm.UNOWN_D,
  Pkm.UNOWN_E,
  Pkm.UNOWN_F,
  Pkm.UNOWN_G,
  Pkm.UNOWN_I,
  Pkm.UNOWN_O,
  Pkm.UNOWN_R,
  Pkm.UNOWN_T,
  Pkm.UNOWN_V,
  Pkm.UNOWN_W
]

export const UnownsStage2 = [
  Pkm.UNOWN_A,
  Pkm.UNOWN_B,
  Pkm.UNOWN_C,
  Pkm.UNOWN_D,
  Pkm.UNOWN_G,
  Pkm.UNOWN_H,
  Pkm.UNOWN_I,
  Pkm.UNOWN_J,
  Pkm.UNOWN_K,
  Pkm.UNOWN_L,
  Pkm.UNOWN_M,
  Pkm.UNOWN_N,
  Pkm.UNOWN_O,
  Pkm.UNOWN_P,
  Pkm.UNOWN_Q,
  Pkm.UNOWN_R,
  Pkm.UNOWN_S,
  Pkm.UNOWN_T,
  Pkm.UNOWN_U,
  Pkm.UNOWN_V,
  Pkm.UNOWN_W,
  Pkm.UNOWN_X,
  Pkm.UNOWN_Y,
  Pkm.UNOWN_Z,
  Pkm.UNOWN_QUESTION
]

export const UnownsStage3 = [
  Pkm.UNOWN_B,
  Pkm.UNOWN_H,
  Pkm.UNOWN_J,
  Pkm.UNOWN_K,
  Pkm.UNOWN_L,
  Pkm.UNOWN_M,
  Pkm.UNOWN_N,
  Pkm.UNOWN_O,
  Pkm.UNOWN_P,
  Pkm.UNOWN_R,
  Pkm.UNOWN_S,
  Pkm.UNOWN_U,
  Pkm.UNOWN_V,
  Pkm.UNOWN_W,
  Pkm.UNOWN_X,
  Pkm.UNOWN_Y,
  Pkm.UNOWN_Z,
  Pkm.UNOWN_QUESTION,
  Pkm.UNOWN_EXCLAMATION
]

export function getUnownsPoolPerStage(stageLevel: number) {
  if (stageLevel < 10) return UnownsStage1
  else if (stageLevel < 20) return UnownsStage2
  else return UnownsStage3
}
