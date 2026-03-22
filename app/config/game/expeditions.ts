import { ExpeditionRank } from "../../types/enum/Expedition"

export const ExpPerExpeditionRank: {
  [key in ExpeditionRank]: number
} = {
  [ExpeditionRank.E]: 250,
  [ExpeditionRank.D]: 300,
  [ExpeditionRank.C]: 400,
  [ExpeditionRank.B]: 500,
  [ExpeditionRank.A]: 750,
  [ExpeditionRank.S]: 1000
}
