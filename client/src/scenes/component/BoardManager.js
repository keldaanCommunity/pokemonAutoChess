import Pokemon from './Pokemon';

export default class BoardManager
{
    constructor(scene, group)
    {
        this.group = group;
        this.scene = scene;
    }

    addPokemon(pokemon){
        this.group.add(new Pokemon(this.scene,this.group.getLength() * 100 +300, 775, pokemon));
    }

    buildPokemons(){
        let player = window.state.players[window.sessionId];
        let  i = 0;
        
        for (let id in player.board) 
        {
            let pokemon = player.board[id];
            this.addPokemon(pokemon);
        }
    }

    playSprites(){
       this.group.getChildren().forEach(pokemon => {
            this.scene.add.existing(pokemon.sprite);
           window.animationManager.displayEntity(pokemon.sprite);
       });
    }


    updatePokemons(){
        this.group.clear(true, true);
        this.buildPokemons();
        this.playSprites();
    }
}