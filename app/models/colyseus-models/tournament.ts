import { Schema, type } from "@colyseus/schema"
import { ITournament } from "../mongo-models/tournament"

export default class TournamentSchema extends Schema implements ITournament {
  @type("string") id: string
  @type("string") name: string
  @type("string") startDate: string
  @type({ array: "string" }) registrations: string[]

  constructor(
    id: string,
    name: string,
    startDate: string,
    registrations: string[]
  ) {
    super()
    this.id = id
    this.name = name
    this.startDate = startDate
    this.registrations = registrations
  }
}
