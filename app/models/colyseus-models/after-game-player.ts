import { ArraySchema, Schema, type } from "@colyseus/schema"
import type { IAfterGamePlayer, Role, Title } from "../../types"
import type { Synergy } from "../../types/enum/Synergy"
import type { GameStats } from "../../types/interfaces/GameStats"
import { type IPokemonRecord, PokemonRecord } from "./game-record"
import { GameStatsSchema } from "./game-stats"

export class SampleSynergy extends Schema {
  @type("string") name: Synergy
  @type("number") value: number

  constructor(name: Synergy, value: number) {
    super()
    this.name = name
    this.value = value
  }
}

export default class AfterGamePlayer
  extends Schema
  implements IAfterGamePlayer
{
  @type("string") id: string
  @type("string") name: string
  @type("string") avatar: string
  @type("uint8") rank: number
  @type([PokemonRecord]) pokemons = new ArraySchema<IPokemonRecord>()
  @type("uint16") elo: number
  @type("uint16") games: number
  @type("string") title: Title | ""
  @type("string") role: Role
  @type([SampleSynergy]) synergies = new ArraySchema<{
    name: Synergy
    value: number
  }>()
  @type(GameStatsSchema) gameStats = new GameStatsSchema()

  constructor(
    id: string,
    name: string,
    avatar: string,
    rank: number,
    pokemons: IPokemonRecord[] | ArraySchema<IPokemonRecord>,
    title: Title | "",
    role: Role,
    synergies:
      | Array<{ name: Synergy; value: number }>
      | ArraySchema<{ name: Synergy; value: number }>,
    elo: number,
    games: number,
    gameStats: GameStats
  ) {
    super()
    this.id = id
    this.name = name
    this.avatar = avatar
    this.rank = rank
    this.title = title
    this.role = role
    this.elo = elo
    this.games = games
    this.gameStats = new GameStatsSchema(gameStats)
    pokemons.forEach((pkm) => {
      this.pokemons.push(new PokemonRecord(pkm))
    })
    synergies.forEach((s) => {
      this.synergies.push(new SampleSynergy(s.name, s.value))
    })
  }
}
