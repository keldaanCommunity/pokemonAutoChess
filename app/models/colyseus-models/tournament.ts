import { Schema, MapSchema, type } from "@colyseus/schema"
import { ITournament, ITournamentPlayer } from "../mongo-models/tournament"

export class TournamentPlayerSchema
  extends Schema
  implements ITournamentPlayer
{
  @type("string") name: string
  @type("string") avatar: string
  @type("number") elo: number
  @type("number") score: number
  @type({ array: "number" }) ranks: number[]
  @type("boolean") eliminated: boolean

  constructor(
    name: string,
    avatar: string,
    elo: number,
    score: number,
    ranks: number[],
    eliminated: boolean
  ) {
    super()
    this.name = name
    this.avatar = avatar
    this.elo = elo
    this.score = score
    this.ranks = ranks
    this.eliminated = eliminated
  }
}

export class TournamentSchema extends Schema implements ITournament {
  @type("string") id: string
  @type("string") name: string
  @type("string") startDate: string
  @type({ map: TournamentPlayerSchema }) players =
    new MapSchema<TournamentPlayerSchema>()
  @type({ array: "string" }) currentMatches: string[]

  constructor(
    id: string,
    name: string,
    startDate: string,
    players: Map<string, ITournamentPlayer>,
    currentMatches: string[]
  ) {
    super()
    this.id = id
    this.name = name
    this.startDate = startDate

    if (players && players.size) {
      players.forEach((p, key) => {
        this.players.set(
          key,
          new TournamentPlayerSchema(
            p.name,
            p.avatar,
            p.elo,
            p.score,
            p.ranks,
            p.eliminated
          )
        )
      })
    }

    this.currentMatches = currentMatches
  }
}
