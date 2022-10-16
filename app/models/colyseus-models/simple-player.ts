import {Schema, type, ArraySchema} from '@colyseus/schema'
import { Role } from '../../types'

export default class SimplePlayer extends Schema {
  @type('string') id: string
  @type('string') name: string
  @type('string') avatar: string
  @type('uint8') rank: number
  @type(['string']) pokemons = new ArraySchema<string>()
  @type('uint16') exp: number
  @type('string') title: string
  @type('string') role: Role


  constructor(id: string, name: string, avatar: string, rank:number, pokemons:string[], exp: number, title: string, role: Role) {
    super()
    this.id = id
    this.name = name
    this.avatar = avatar
    this.rank = rank
    this.exp = exp
    this.title = title
    this.role = role
    pokemons.forEach((pkm) => {
      this.pokemons.push(pkm)
    })
  }
}