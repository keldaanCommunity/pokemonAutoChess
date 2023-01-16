import { Schema, type, ArraySchema } from "@colyseus/schema"
import { ISimplePlayer, Role } from "../../types"
import { IPokemonRecord, PokemonRecord } from "./game-record"

export class SampleSynergy extends Schema {
  @type("string") name: string
  @type("number") value: number

  constructor(name: string, value: number) {
    super()
    this.name = name
    this.value = value
  }
}

export default class SimplePlayer extends Schema implements ISimplePlayer {
  @type("string") id: string
  @type("string") name: string
  @type("string") avatar: string
  @type("uint8") rank: number
  @type([PokemonRecord]) pokemons = new ArraySchema<IPokemonRecord>()
  @type("uint16") exp: number
  @type("string") title: string
  @type("string") role: Role
  @type([SampleSynergy]) synergies = new ArraySchema<{
    name: string
    value: number
  }>()

  constructor(
    id: string,
    name: string,
    avatar: string,
    rank: number,
    pokemons: IPokemonRecord[],
    exp: number,
    title: string,
    role: Role,
    synergies: Array<{ name: string; value: number }>
  ) {
    super()
    this.id = id
    this.name = name
    this.avatar = avatar
    this.rank = rank
    this.exp = exp
    this.title = title
    this.role = role
    pokemons.forEach((pkm) => {
      this.pokemons.push(new PokemonRecord(pkm))
    })
    synergies.forEach((s) => {
      this.synergies.push(new SampleSynergy(s.name, s.value))
    })
  }
}
