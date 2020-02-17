const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const Pokemon = require('../type/Pokemon').Pokemon;
const PokemonFactory = require('../type/PokemonFactory');

class SimulationState extends Schema 
{
  constructor () 
  {
      super();
      this.redTeam = new MapSchema();
      this.blueTeam = new MapSchema();
  }

  setBlueTeam(blueBoard)
  {
    for (let id in blueBoard)
    {
        let pokemon = blueBoard[id];
        if(pokemon.positionY != 0)
        {
            let simulationPokemon = PokemonFactory.createPokemonFromName(pokemon.name);
            simulationPokemon.positionX = pokemon.positionX;
            simulationPokemon.positionY = pokemon.positionY;
            this.blueTeam[simulationPokemon.id] = simulationPokemon;
        }
    }
  }

  setRedTeam(redBoard)
  {
    for (let id in redBoard)
    {
        let pokemon = redBoard[id];
        if(pokemon.positionY != 0)
        {
            let simulationPokemon = PokemonFactory.createPokemonFromName(pokemon.name);
            simulationPokemon.positionX = pokemon.positionX;
            simulationPokemon.positionY = 5 - pokemon.positionY;
            this.redTeam[simulationPokemon.id] = simulationPokemon;
        }
    }
  }

  clearTeams()
  {
      for (let id in this.redTeam) 
      {
          delete this.redTeam[id];    
      }
      for (let id in this.blueTeam) 
      {
          delete this.blueTeam[id];    
      }
  }
}

schema.defineTypes(SimulationState,
  {
    redTeam: {map: Pokemon},
    blueTeam: {map: Pokemon}
  }
);

module.exports = SimulationState;