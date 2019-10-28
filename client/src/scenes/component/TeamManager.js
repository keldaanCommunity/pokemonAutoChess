import Pokemon from './Pokemon';

export default class TeamManager
{
    constructor(scene, group, player)
    {
        this.group = group;
        this.scene = scene;
        this.player = player;
    }

    addPokemon(pokemon)
    {
        let pokemonUI = new Pokemon(this.scene, pokemon.positionX * 100 + 330, 680 - 65 * pokemon.positionY, pokemon);
        pokemonUI.setScale(3,3);
        this.scene.add.existing(pokemonUI);
        pokemonUI.setInteractive();
        this.scene.input.setDraggable(pokemonUI);
        window.animationManager.displayEntity(pokemonUI);
        this.group.add(pokemonUI);
    }

    removePokemon(id)
    {
        this.group.getChildren().forEach(pokemon =>{
            if(pokemon.id == id)
            {
                pokemon.destroy();
            }
        });
    }

    buildPokemons()
    {   
        for (let id in this.player.team) 
        {
            let pokemon = this.player.team[id];
            this.addPokemon(pokemon);
        }
    }

    setPlayer(player)
    {
        if(player.id != this.player.id)
        {
            this.player = player;
            this.group.clear(true, true);
            this.buildPokemons();
        }
    }

    update()
    {
        for (let id in this.player.team) 
        {
          let pokemon = this.player.team[id];
          let found = false;
          this.group.getChildren().forEach(pokemonUI=>{
              if(pokemon.id == pokemonUI.id){
                found = true;

                if(pokemonUI.positionX != pokemon.positionX)
                {
                    pokemonUI.positionX = pokemon.positionX;
                    pokemonUI.positionY = pokemon.positionY;
                    pokemonUI.x = pokemon.positionX * 100 +330;
                    pokemonUI.y = 680 - 65 * pokemon.positionY;
                }
              }
          });
          if(!found)
          {
            this.addPokemon(pokemon);
          }
        }

        this.group.getChildren().forEach(pokemonUI=>{
            if (!(pokemonUI.id in this.player.team))
            {
                this.removePokemon(pokemonUI.id);
            }
        })
    }
}