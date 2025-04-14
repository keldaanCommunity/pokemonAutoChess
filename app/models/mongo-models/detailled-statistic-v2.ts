import { Schema, model } from "mongoose"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { GameMode } from "../../types/enum/Game"

export interface Pokemon {
  name: string
  avatar: string
  items: string[]
}

export interface IDetailledStatistic {
  playerId: string
  elo: number
  time: number
  name: string
  rank: number
  nbplayers: number
  avatar: string
  pokemons: Pokemon[]
  synergies: Map<Synergy, number>
  gameMode: GameMode
}

const pokemon = new Schema({
  name: {
    type: String,
    enum: Object.values(Pkm)
  },
  avatar: {
    type: String
  },
  items: [
    {
      type: String,
      enum: Item
    }
  ]
})

const statisticSchema = new Schema({
  playerId: {
    type: String
  },
  elo: {
    type: Number
  },
  time: {
    type: Number
  },
  name: {
    type: String
  },
  rank: {
    type: Number
  },
  nbplayers: {
    type: Number
  },
  avatar: {
    type: String
  },
  pokemons: [pokemon],
  synergies: {
    type: Map,
    of: Number
  },
  gameMode: {
    type: String
  }
})

export default model<IDetailledStatistic>(
  "DetailledStatisticV2",
  statisticSchema
)
