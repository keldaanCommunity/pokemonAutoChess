import Pokemon from './Pokemon';

export default class BoardManager
{
    constructor(scene, group, player)
    {
        this.group = group;
        this.scene = scene;
        this.player = player;
    }

    addPokemon(pokemon)
    {
        let pokemonUI = new Pokemon(this.scene, pokemon.positionX * 100 + 330, 790 - 80 * pokemon.positionY, pokemon);
        pokemonUI.setScale(3,3);
        this.scene.add.existing(pokemonUI);
        if(window.sessionId == this.player.id)
        {
            pokemonUI.setInteractive();
            this.scene.input.setDraggable(pokemonUI);
        }
        window.animationManager.displayEntity(pokemonUI);
        this.group.add(pokemonUI);
    }

    clear(){
        this.group.clear(false,true);
    }

    removePokemon(id)
    {
        this.group.getChildren().forEach(pokemon => {
            if(pokemon.id == id)
            {
                pokemon.destroy();
            }
        });
    }

    buildPokemons()
    {   
        for (let id in this.player.board) 
        {
            let pokemon = this.player.board[id];
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
        for (let id in this.player.board) 
        {
          let pokemon = this.player.board[id];
          
          let found = false;
          this.group.getChildren().forEach(pokemonUI=>{
              if(pokemon.id == pokemonUI.id){
                found = true;

                if(pokemonUI.positionX != pokemon.positionX || pokemonUI.positionY != pokemon.positionY)
                {
                    pokemonUI.positionX = pokemon.positionX;
                    pokemonUI.x = pokemon.positionX * 100 + 330;
                    pokemonUI.y = 790 - 80 * pokemon.positionY;
                }
              }
          });
          if(!found)
          {
            this.addPokemon(pokemon);
          }
        }
        let ids = [];
        this.group.getChildren().forEach(pokemonUI=>{
            if (!(pokemonUI.id in this.player.board))
            {
                ids.push(pokemonUI.id);
            }
        })
        ids.forEach(id=>{
            this.removePokemon(id);
        })
    }
}