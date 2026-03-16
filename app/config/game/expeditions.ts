import { ExpeditionRank } from "../../types/enum/Expedition"

export const ExpPerExpeditionRank: {
  [key in ExpeditionRank]: number
} = {
  [ExpeditionRank.E]: 100,
  [ExpeditionRank.D]: 150,
  [ExpeditionRank.C]: 250,
  [ExpeditionRank.B]: 400,
  [ExpeditionRank.A]: 500,
  [ExpeditionRank.S]: 1000
}
