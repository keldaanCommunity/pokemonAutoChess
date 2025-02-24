import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema"
import {
  ITournament,
  ITournamentBracket,
  ITournamentPlayer
} from "../../types/interfaces/Tournament"
import { resetArraySchema } from "../../utils/schemas"

export class TournamentPlayerSchema
  extends Schema
  implements ITournamentPlayer
{
  @type("string") name: string
  @type("string") avatar: string
  @type("number") elo: number
  @type(["number"]) ranks = new ArraySchema<number>()
  @type("boolean") eliminated: boolean

  constructor(
    name: string,
    avatar: string,
    elo: number,
    ranks: number[] | ArraySchema<number> = [],
    eliminated: boolean = false
  ) {
    super()
    this.name = name
    this.avatar = avatar
    this.elo = elo
    resetArraySchema(this.ranks, ranks)
    this.eliminated = eliminated
  }
}

export class TournamentBracketSchema
  extends Schema
  implements ITournamentBracket
{
  @type("string") name: string
  @type(["string"]) playersId = new ArraySchema<string>()
  @type("boolean") finished: boolean

  constructor(
    name: string,
    playersId: string[] | ArraySchema<string>,
    finished: boolean = false
  ) {
    super()
    this.name = name
    this.finished = finished
    resetArraySchema(this.playersId, playersId)
  }
}

export class TournamentSchema extends Schema implements ITournament {
  @type("string") id: string
  @type("string") name: string
  @type("string") startDate: string
  @type({ map: TournamentPlayerSchema }) players =
    new MapSchema<TournamentPlayerSchema>()
  @type({ map: TournamentBracketSchema }) brackets =
    new MapSchema<TournamentBracketSchema>()
  @type("boolean") finished: boolean
  pendingLobbiesCreation: boolean = false

  constructor(
    id: string,
    name: string,
    startDate: string,
    players: Map<string, ITournamentPlayer>,
    brackets: Map<string, ITournamentBracket>,
    finished: boolean = false
  ) {
    super()
    this.id = id
    this.name = name
    this.startDate = startDate
    this.finished = finished

    if (players && players.size) {
      players.forEach((p, key) => {
        this.players.set(
          key,
          new TournamentPlayerSchema(
            p.name,
            p.avatar,
            p.elo,
            p.ranks,
            p.eliminated
          )
        )
      })
    }

    if (brackets && brackets.size) {
      brackets.forEach((b, bracketId) => {
        this.brackets.set(
          bracketId,
          new TournamentBracketSchema(b.name, b.playersId, b.finished)
        )
      })
    }
  }
}
