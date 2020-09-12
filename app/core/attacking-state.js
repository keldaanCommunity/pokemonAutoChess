const {STATE_TYPE, EFFECTS, ITEMS} = require('../models/enum');
const PokemonState = require('./pokemon-state');

class AttackingState extends PokemonState {
  constructor() {
    super();
  }

  update(pokemon, dt, board, climate) {
    super.update(pokemon, dt, board, climate);
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = pokemon.atkSpeed;
      const targetCoordinate = this.getNearestTargetCoordinate(pokemon, board);
      // no target case
      if (targetCoordinate[0] === undefined || targetCoordinate[1] === undefined) {
        pokemon.toMovingState();
      } else if (board.distance(pokemon.positionX, pokemon.positionY, targetCoordinate[0], targetCoordinate[1]) > pokemon.range) {
        pokemon.toMovingState();
      } else {
        this.attack(pokemon, board, targetCoordinate);
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt);
    }
  }

  attack(pokemon, board, coordinates) {
    pokemon.targetX = coordinates[0];
    pokemon.targetY = coordinates[1];
    const target = board.getValue(coordinates[0], coordinates[1]);
    if (target) {
      pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
      // console.log(`pokemon attack from (${pokemon.positionX},${pokemon.positionY}) to (${pokemon.targetX},${pokemon.targetY}), orientation: ${pokemon.orientation}`);
      if (target.effects.includes(EFFECTS.ATTRACT)) {
        if (Math.random() > 0.75) {
          pokemon.cooldown = 3000;
        }
        if (target.effects.includes(EFFECTS.BABY_DOLL_EYES)) {
          if (Math.random() > 0.8) {
            pokemon.atk -= Math.ceil(pokemon.baseAtk * 0.2);
          }
        }
      }
      let damage = pokemon.atk;


      if (pokemon.effects.includes(EFFECTS.PURSUIT) && target.life/target.hp < 0.25) {
        damage = target.hp;
      }
      const victim = target.handleDamage(damage, board, pokemon.attackType);

      for (let key in target.items) {
        if(target.items[key].name == ITEMS.ROCKY_HELMET){
          pokemon.life -= Math.ceil(pokemon.hp * 0.12);
        }
      }

      for (let key in pokemon.items){
        if(pokemon.items[key].name == ITEMS.LIFE_ORB){
          pokemon.life -= Math.ceil(pokemon.hp * 0.05);
        }
        else if(pokemon.items[key].name == ITEMS.SHELL_BELL){
          pokemon.life+= Math.ceil(damage / 10);
        }
      }

      if (victim && pokemon.effects.includes(EFFECTS.BRUTAL_SWING)) {
        pokemon.life = Math.min(pokemon.hp, Math.ceil(pokemon.life + 0.4 * pokemon.hp));
      }
      if (victim && pokemon.effects.includes(EFFECTS.POWER_TRIP)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.25);
      }
    } else {
      console.log('warning, no target detected at given coordinates');
    }
  }

  onEnter(pokemon) {
    super.onEnter(pokemon);
    pokemon.action = STATE_TYPE.ATTACKING;
  }

  onExit(pokemon) {
    pokemon.targetX = -1;
    pokemon.targetY = -1;
    super.onExit(pokemon);
  }
}

module.exports = AttackingState;
