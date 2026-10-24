import { t } from "i18next"
import type PokemonNPC from "../../public/src/game/components/pokemon-npc"
import { Emotion } from "../../types"
import { DungeonMusic } from "../../types/enum/Dungeon"
import { Orientation, PokemonActionState } from "../../types/enum/Game"
import { Pkm } from "../../types/enum/Pokemon"
import {
  type TownEncounter,
  TownEncounters
} from "../../types/enum/TownEncounter"
import { randomWeighted } from "../../utils/random"

export const TownEncounterSellPrice: { [encounter in TownEncounter]?: number } =
  {
    [Pkm.CHANSEY]: 7,
    [Pkm.KECLEON]: 10,
    [Pkm.KANGASKHAN]: 10,
    [Pkm.ELECTIVIRE]: 10
  }

export const TownEncountersByStage: {
  [stageLevel: number]: { [encounter in TownEncounter]?: number }
} = {
  0: {
    [TownEncounters.AZURILL]: 1 / 5,
    [TownEncounters.BIDOOF]: 1 / 5,
    [TownEncounters.LOUDRED]: 1 / 5
  },
  4: {
    [TownEncounters.WIGGLYTUFF]: 1 / 20,
    [TownEncounters.CHANSEY]: 1 / 20,
    [TownEncounters.MEOWTH]: 1 / 20,
    [TownEncounters.DUSKULL]: 1 / 20,
    [TownEncounters.CINCCINO]: 1 / 20,
    [TownEncounters.MAROWAK]: 1 / 20,
    [TownEncounters.MAKUHITA]: 1 / 20,
    [TownEncounters.MAGNEZONE]: 1 / 20,
    [TownEncounters.LAPRAS]: 1 / 20,
    [TownEncounters.LUDICOLO]: 1 / 20,
    [TownEncounters.SPINDA]: 1 / 20
  },
  12: {
    [TownEncounters.KANGASKHAN]: 1 / 20,
    [TownEncounters.WOBBUFFET]: 1 / 20,
    [TownEncounters.KECLEON]: 1 / 20,
    [TownEncounters.ELECTIVIRE]: 1 / 20,
    [TownEncounters.XATU]: 1 / 20,
    [TownEncounters.LAPRAS]: 1 / 20,
    [TownEncounters.CINCCINO]: 1 / 20,
    [TownEncounters.MAROWAK]: 1 / 20,
    [TownEncounters.SABLEYE]: 1 / 20,
    [TownEncounters.MAKUHITA]: 1 / 20,
    [TownEncounters.OMANYTE]: 1 / 20,
    [TownEncounters.SPINDA]: 1 / 20
  },
  17: {
    [TownEncounters.WOBBUFFET]: 1 / 20,
    [TownEncounters.CROAGUNK]: 1 / 20,
    [TownEncounters.ELECTIVIRE]: 1 / 20,
    [TownEncounters.MAROWAK]: 1 / 20,
    [TownEncounters.SABLEYE]: 1 / 20,
    [TownEncounters.MAKUHITA]: 1 / 20,
    [TownEncounters.CHIMECHO]: 1 / 20,
    [TownEncounters.GROVYLE]: 1 / 20,
    [TownEncounters.KECLEON]: 1 / 20,
    [TownEncounters.REGIROCK]: 1 / 20,
    [TownEncounters.MUNCHLAX]: 1 / 20,
    [TownEncounters.KINGAMBIT]: 1 / 20
  },
  20: {
    [TownEncounters.AMPHAROS]: 1
  },
  22: {
    [TownEncounters.DUSKNOIR]: 1 / 10,
    [TownEncounters.CELEBI]: 1 / 10
  }
}

export const OUTLAW_GOLD_REWARD = 10

export const TREASURE_BOX_LIFE_THRESHOLD = 40
export type TreasureBoxReward =
  | "gold"
  | "mushrooms"
  | "sweets"
  | "componentsAndTickets"
  | "itemComponents"
  | "craftableItems"
  | "goldBow"

export function getTreasureBoxReward(): TreasureBoxReward {
  return (
    randomWeighted<TreasureBoxReward>({
      gold: 0.2,
      mushrooms: 0.1,
      sweets: 0.1,
      itemComponents: 0.1,
      componentsAndTickets: 0.1,
      craftableItems: 0.15,
      goldBow: 0.05
    }) ?? "itemComponents"
  )
}

export const MusicByTownEncounter: {
  [encounter in TownEncounter]?: DungeonMusic
} = {
  [TownEncounters.LUDICOLO]: DungeonMusic.CARNIVAL_LUDICOLO,
  [TownEncounters.MAGNEZONE]: DungeonMusic.TROUBLE_IN_TOWN,
  [TownEncounters.MAROWAK]: DungeonMusic.THE_TERRABLE_JUNGLE,
  [TownEncounters.WIGGLYTUFF]: DungeonMusic.SKY_PEAK_CAVE,
  [TownEncounters.SPINDA]: DungeonMusic.SPINDA_CAFE,
  [TownEncounters.WOBBUFFET]: DungeonMusic.SPINDA_CAFE
}

export type NPC = TownEncounter | "mareep"

type NpcConfig = {
  x: number
  y: number
  orientation: Orientation
  name: Pkm
  shiny?: boolean
  dialog?: string
  dialogTitle?: string
  emotion?: Emotion
  animation?:
    | PokemonActionState
    | ((isEncounter: boolean) => PokemonActionState)
  action?: (sprite: PokemonNPC) => void
}

export const NpcsConfig: {
  [npc in NPC]: NpcConfig | NpcConfig[]
} = {
  [TownEncounters.KECLEON]: [
    {
      x: 34 * 48,
      y: 5 * 48 + 4,
      name: Pkm.KECLEON,
      orientation: Orientation.DOWN
    },
    {
      x: 34 * 48,
      y: 5 * 48 + 4,
      name: Pkm.KECLEON_PURPLE,
      orientation: Orientation.DOWN
    }
  ],

  [TownEncounters.ELECTIVIRE]: {
    x: 6.5 * 48,
    y: 7.5 * 48,
    name: Pkm.ELECTIVIRE,
    orientation: Orientation.DOWN
  },

  [TownEncounters.CHANSEY]: {
    x: 2.5 * 48,
    y: 12 * 48,
    name: Pkm.CHANSEY,
    orientation: Orientation.DOWN
  },

  [TownEncounters.KANGASKHAN]: {
    x: 41 * 48,
    y: 6 * 48,
    name: Pkm.KANGASKHAN,
    orientation: Orientation.DOWN
  },

  [TownEncounters.XATU]: {
    x: 6 * 48,
    y: 21 * 48,
    name: Pkm.XATU,
    orientation: Orientation.DOWN
  },

  [TownEncounters.DUSKULL]: {
    x: 18 * 48,
    y: 21.5 * 48,
    name: Pkm.DUSKULL,
    orientation: Orientation.DOWN
  },

  [TownEncounters.MEOWTH]: {
    x: 35 * 48,
    y: 10 * 48,
    name: Pkm.MEOWTH,
    orientation: Orientation.DOWN
  },

  [TownEncounters.REGIROCK]: {
    x: 24 * 48,
    y: 22 * 48,
    name: Pkm.REGIROCK,
    orientation: Orientation.DOWN,
    dialog: t("thanks_for_playing"),
    dialogTitle: "Keldaan",
    emotion: Emotion.HAPPY
  },

  ["mareep"]: {
    x: 46 * 48,
    y: 2.5 * 48,
    name: Pkm.MAREEP,
    orientation: Orientation.DOWNLEFT,
    animation: PokemonActionState.EAT,
    dialog: t("thanks_for_playing"),
    dialogTitle: "Curry",
    emotion: Emotion.HAPPY
  },

  [TownEncounters.MAROWAK]: {
    x: 41 * 48,
    y: 12 * 48,
    name: Pkm.MAROWAK,
    orientation: Orientation.DOWN
  },

  [TownEncounters.CELEBI]: {
    x: 33 * 48,
    y: 23 * 48,
    name: Pkm.CELEBI,
    orientation: Orientation.DOWNLEFT,
    shiny: true
  },

  [TownEncounters.WOBBUFFET]: [
    {
      x: 44.5 * 48,
      y: 18 * 48,
      name: Pkm.WOBBUFFET,
      orientation: Orientation.DOWN
    },
    {
      x: 43.5 * 48,
      y: 18 * 48,
      name: Pkm.WYNAUT,
      orientation: Orientation.DOWN
    }
  ],

  [TownEncounters.SPINDA]: {
    x: 38 * 48,
    y: 18 * 48,
    name: Pkm.SPINDA,
    orientation: Orientation.DOWN
  },

  [TownEncounters.SABLEYE]: {
    x: 37.25 * 48,
    y: 5 * 48,
    name: Pkm.SABLEYE,
    orientation: Orientation.DOWNLEFT
  },

  [TownEncounters.MUNCHLAX]: {
    x: 34 * 48,
    y: 17 * 48,
    name: Pkm.MUNCHLAX,
    orientation: Orientation.DOWNLEFT,
    animation: (isEncounter) =>
      isEncounter ? PokemonActionState.EAT : PokemonActionState.SLEEP
  },

  [TownEncounters.MAKUHITA]: {
    x: 36 * 48,
    y: 8.25 * 48,
    name: Pkm.MAKUHITA,
    orientation: Orientation.DOWN
  },

  [TownEncounters.CROAGUNK]: {
    x: 11.5 * 48,
    y: 21.25 * 48,
    name: Pkm.CROAGUNK,
    orientation: Orientation.DOWN
  },

  [TownEncounters.WIGGLYTUFF]: {
    x: 2 * 48,
    y: 9 * 48,
    name: Pkm.WIGGLYTUFF,
    orientation: Orientation.DOWN
  },

  [TownEncounters.CINCCINO]: {
    x: 18 * 48,
    y: 23 * 48,
    name: Pkm.CINCCINO,
    orientation: Orientation.UP
  },

  [TownEncounters.LUDICOLO]: {
    x: 13.5 * 48,
    y: 25.5 * 48,
    name: Pkm.LUDICOLO,
    orientation: Orientation.DOWN,
    animation: PokemonActionState.ABILITY
  },

  [TownEncounters.MAGNEZONE]: {
    x: 41 * 48,
    y: 15 * 48,
    name: Pkm.MAGNEZONE,
    orientation: Orientation.DOWN
  },

  [TownEncounters.KINGAMBIT]: {
    x: 47.5 * 48,
    y: 10.5 * 48,
    name: Pkm.KINGAMBIT,
    orientation: Orientation.RIGHT,
    animation: PokemonActionState.ATTACK
  },

  [TownEncounters.LAPRAS]: {
    x: 0,
    y: 3.75 * 48,
    name: Pkm.LAPRAS,
    orientation: Orientation.RIGHT,
    animation: PokemonActionState.WALK,
    action(lapras: PokemonNPC) {
      lapras.moveManager.setSpeed(15)
      lapras.moveManager.moveTo(8 * 48, 4 * 48)
    }
  },

  [TownEncounters.CHIMECHO]: {
    x: 44.5 * 48,
    y: 7 * 48,
    name: Pkm.CHIMECHO,
    orientation: Orientation.DOWN
  },

  [TownEncounters.GROVYLE]: {
    x: 48 * 48,
    y: 25 * 48,
    name: Pkm.GROVYLE,
    orientation: Orientation.UPLEFT
  },

  [TownEncounters.DUSKNOIR]: {
    x: 21 * 48,
    y: 23 * 48,
    name: Pkm.DUSKNOIR,
    orientation: Orientation.DOWNRIGHT
  },

  [TownEncounters.LOUDRED]: {
    x: 1 * 48,
    y: 16 * 48,
    name: Pkm.LOUDRED,
    orientation: Orientation.DOWNRIGHT
  },

  [TownEncounters.BIDOOF]: {
    x: 1.5 * 48,
    y: 17 * 48,
    name: Pkm.BIDOOF,
    orientation: Orientation.UP
  },

  [TownEncounters.AZURILL]: [
    {
      x: 37 * 48,
      y: 13 * 48,
      name: Pkm.AZURILL,
      orientation: Orientation.RIGHT
    },
    {
      x: 38 * 48,
      y: 13 * 48,
      name: Pkm.MARILL,
      orientation: Orientation.DOWNLEFT
    }
  ],

  [TownEncounters.OMANYTE]: {
    x: 40.5 * 48,
    y: 26 * 48,
    name: Pkm.OMANYTE,
    orientation: Orientation.DOWNLEFT
  },

  [TownEncounters.AMPHAROS]: {
    x: 2.5 * 48,
    y: 30.5 * 48,
    name: Pkm.AMPHAROS,
    orientation: Orientation.DOWN
  }
}
