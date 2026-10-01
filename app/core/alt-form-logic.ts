import { getBaseAltForm, VivillonFormPerSynergy } from "../config"
import { sortSynergies } from "../models/colyseus-models/synergies"
import { FlowerPot, type IPlayer } from "../types"
import { Pkm } from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"

export function getAltFormForPlayer(pkm: Pkm, player: IPlayer): Pkm {
  const basePkm = getBaseAltForm(pkm)
  switch (basePkm) {
    case Pkm.FLABEBE: {
      switch (player.flowerPotsSpawnOrder[0]) {
        case FlowerPot.YELLOW:
          return Pkm.FLABEBE_YELLOW
        case FlowerPot.ORANGE:
          return Pkm.FLABEBE_ORANGE
        case FlowerPot.BLUE:
          return Pkm.FLABEBE_BLUE
        case FlowerPot.WHITE:
          return Pkm.FLABEBE_WHITE
      }
      return Pkm.FLABEBE
    }
    case Pkm.FLOETTE: {
      switch (player.flowerPotsSpawnOrder[0]) {
        case FlowerPot.YELLOW:
          return Pkm.FLOETTE_YELLOW
        case FlowerPot.ORANGE:
          return Pkm.FLOETTE_ORANGE
        case FlowerPot.BLUE:
          return Pkm.FLOETTE_BLUE
        case FlowerPot.WHITE:
          return Pkm.FLOETTE_WHITE
      }
      return Pkm.FLOETTE
    }
    case Pkm.FLORGES: {
      switch (player.flowerPotsSpawnOrder[0]) {
        case FlowerPot.YELLOW:
          return Pkm.FLORGES_YELLOW
        case FlowerPot.ORANGE:
          return Pkm.FLORGES_ORANGE
        case FlowerPot.BLUE:
          return Pkm.FLORGES_BLUE
        case FlowerPot.WHITE:
          return Pkm.FLORGES_WHITE
      }
      return Pkm.FLORGES
    }

    case Pkm.VIVILLON: {
      const synergiesSorted = sortSynergies(player.synergies.toMap())
      const synergyVivillon =
        synergiesSorted
          .map(([type]) => type)
          .find((type) => type in VivillonFormPerSynergy) ?? Synergy.NORMAL
      return VivillonFormPerSynergy[synergyVivillon]
    }

    default:
      return basePkm
  }
}
