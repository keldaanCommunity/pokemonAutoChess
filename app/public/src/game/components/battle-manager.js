import Pokemon from "./pokemon";

export default class BattleManager {
  constructor(scene, group, player) {
    this.group = group;
    this.scene = scene;
    this.player = player;
  }

  addPokemon(playerId, pokemon) {
    if(this.player.id == playerId){
      let pokemonUI = new Pokemon(this.scene, pokemon.positionX * 100 + 330, 710 - 80 * pokemon.positionY, pokemon);
      window.animationManager.animatePokemon(pokemonUI);
      this.group.add(pokemonUI);
    }
  }

  clear() {
    this.group.clear(false, true);
  }

  removePokemon(playerId, pokemon) {
    if(this.player.id == playerId){
      this.group.getChildren().forEach(pkm => {
        if (pkm.id == pokemon.id) {
          pkm.destroy();
        }
      });
    }
  }

  changePokemon(playerId, change, pokemon){
    
    if(this.player.id == playerId){
      let children = this.group.getChildren();
      for (let i = 0; i < children.length; i++) {
        if(children[i].id == pokemon.id){
          if(change.field =="positionX" || change.field == "positionY"){
            //console.log(pokemon.positionX, pokemon.positionY);
            if(change.field == "positionX"){
              children[i].positionX = pokemon.positionX;
            }
            else if(change.field == "positionY"){
              children[i].positionY = pokemon.positionY;
            }
            children[i].moveManager.moveTo(pokemon.positionX * 100 +330, 710 - 80 * pokemon.positionY);
          }
          else if(change.field == "orientation"){
            children[i].orientation = pokemon.orientation;
            window.animationManager.animatePokemon(children[i]);
          }
          else if(change.field =="action"){
            children[i].action = pokemon.action;
            window.animationManager.animatePokemon(children[i]);
          }
          else if(change.field =="life"){
            children[i].life = pokemon.life;
            children[i].last.setLife(children[i].life);
          }
          
          else if(change.field =="targetX"){
            if(pokemon.targetX >= 0){
              children[i].targetX = pokemon.targetX;
            }
            else{
              children[i].targetX = null;
            }

            if(children[i].action == "ATTACKING" && children[i].targetX !== null && children[i].targetY !== null){
              children[i].attackAnimation();
            }
          }

          else if(change.field =="targetY"){
            if(pokemon.targetY >= 0){
              children[i].targetY = pokemon.targetY;
            }
            else{
              children[i].targetY = null;
            }

            if(children[i].action == "ATTACKING" && children[i].targetX !== null && children[i].targetY !== null){
              children[i].attackAnimation();
            }
          }

          break;
        }
        
      }
    }
  }

  setPlayer(player) {
    if (player.id != this.player.id) {
      this.player = player;
      this.group.clear(true, true);
      this.buildPokemons();
    }
  }
}