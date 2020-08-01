import Pokemon from './pokemon';

export default class BattleManager {
  constructor(scene, group, player) {
    this.group = group;
    this.scene = scene;
    this.player = player;
  }

  buildPokemons() {
    for (const id in this.player.simulation.blueTeam) {
      this.addPokemon(this.player.id, this.player.simulation.blueTeam[id]);
    }
    for (const id in this.player.simulation.redTeam) {
      this.addPokemon(this.player.id, this.player.simulation.redTeam[id]);
    }
  }

  addPokemon(playerId, pokemon) {
    if (this.player.id == playerId) {
      const coordinates = window.transformAttackCoordinate(pokemon.positionX, pokemon.positionY);
      const pokemonUI = new Pokemon(this.scene, coordinates[0], coordinates[1], pokemon);
      window.animationManager.animatePokemon(pokemonUI);
      this.group.add(pokemonUI);
    }
  }

  clear() {
    this.group.clear(false, true);
  }

  removePokemon(playerId, pokemon) {
    if (this.player.id == playerId) {
      this.group.getChildren().forEach((pkm) => {
        if (pkm.id == pokemon.id) {
          pkm.destroy();
        }
      });
    }
  }

  changePokemon(playerId, change, pokemon) {
    if (this.player.id == playerId) {
      const children = this.group.getChildren();
      for (let i = 0; i < children.length; i++) {
        if (children[i].id == pokemon.id) {
          if (change.field =='positionX' || change.field == 'positionY') {
            // console.log(pokemon.positionX, pokemon.positionY);
            if (change.field == 'positionX') {
              children[i].positionX = pokemon.positionX;
            } else if (change.field == 'positionY') {
              children[i].positionY = pokemon.positionY;
            }
            const coordinates = window.transformAttackCoordinate(pokemon.positionX, pokemon.positionY);
            children[i].moveManager.moveTo(coordinates[0], coordinates[1]);
          } else if (change.field == 'orientation') {
            children[i].orientation = pokemon.orientation;
            window.animationManager.animatePokemon(children[i]);
          } else if (change.field =='action') {
            children[i].action = pokemon.action;
          } else if (change.field =='life') {
            children[i].life = pokemon.life;
            children[i].getFirst('objType', 'lifebar').setLife(children[i].life);
          } else if (change.field =='targetX') {
            if (pokemon.targetX >= 0) {
              children[i].targetX = pokemon.targetX;
            } else {
              children[i].targetX = null;
            }

            if (children[i].action == 'ATTACKING' && children[i].targetX !== null && children[i].targetY !== null) {
              window.animationManager.animatePokemon(children[i]);
              children[i].attackAnimation();
            }
          } else if (change.field =='targetY') {
            if (pokemon.targetY >= 0) {
              children[i].targetY = pokemon.targetY;
            } else {
              children[i].targetY = null;
            }

            if (children[i].action == 'ATTACKING' && children[i].targetX !== null && children[i].targetY !== null) {
              window.animationManager.animatePokemon(children[i]);
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
