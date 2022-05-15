import {MapSchema} from '@colyseus/schema'
import {IPokemonConfig} from '../mongo-models/user-metadata'
import PokemonConfig from './pokemon-config'

export default class PokemonCollection extends MapSchema<IPokemonConfig> {

  constructor(pokemonCollection?: Map<string,IPokemonConfig>){
      super()
      if(pokemonCollection){
        pokemonCollection.forEach((value, key) => this.set(key, new PokemonConfig(key, value)))
      }
  }
}