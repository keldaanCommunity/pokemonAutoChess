const {STATE_TYPE, EFFECTS, ITEMS, ATTACK_TYPE, CLIMATE} = require('../models/enum');
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
      }
      else if(pokemon.confusion){
        pokemon.toMovingState();
      }
      else {
        this.attack(pokemon, board, targetCoordinate, climate);
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt);
    }
  }

  attack(pokemon, board, coordinates, climate) {
    pokemon.targetX = coordinates[0];
    pokemon.targetY = coordinates[1];
    const target = board.getValue(coordinates[0], coordinates[1]);
    if (target && !pokemon.sleep && !pokemon.freeze) {
      if(pokemon.effects.includes(EFFECTS.SNOW) && climate == CLIMATE.SNOW){
        if(Math.random() > 0.9){
          target.triggerFreeze(2000);
        }
      }
      if(pokemon.items.count(ITEMS.ICY_ROCK) != 0){
        if(Math.random() > 0.9){
          target.triggerFreeze(2000);
        }
      }
      if(pokemon.effects.includes(EFFECTS.MANA_HEAL)){
        pokemon.setMana(pokemon.mana + 5);
      }
      pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
      // console.log(`pokemon attack from (${pokemon.positionX},${pokemon.positionY}) to (${pokemon.targetX},${pokemon.targetY}), orientation: ${pokemon.orientation}`);
      if (target.effects.includes(EFFECTS.ATTRACT)) {
        if (Math.random() > 0.75) {
          pokemon.atkSpeed = Math.min(2000, Math.ceil(pokemon.atkSpeed * 1.1));
        }
        if (target.effects.includes(EFFECTS.BABY_DOLL_EYES)) {
          if (Math.random() > 0.75) {
            pokemon.atk = Math.max(Math.ceil(pokemon.baseAtk / 2), pokemon.atk - Math.ceil(pokemon.baseAtk * 0.1));
          }
        }
      }
      let damage = pokemon.atk;
      if (pokemon.effects.includes(EFFECTS.PURSUIT) && target.life/target.hp < 0.3) {
        damage = target.hp;
      }

      let attackType = pokemon.attackType;
      if(pokemon.effects.includes(EFFECTS.PHANTOM_FORCE)){
        attackType = ATTACK_TYPE.TRUE;
      }

      const victim = target.handleDamage(damage, board, attackType, pokemon);

      if(target.items.count(ITEMS.ROCKY_HELMET) != 0){
        pokemon.handleDamage(Math.ceil(pokemon.hp * 0.12) * target.items.count(ITEMS.ROCKY_HELMET), board, ATTACK_TYPE.TRUE, target);
      }

      if(pokemon.items.count(ITEMS.LIFE_ORB) != 0){
        pokemon.handleDamage(Math.ceil(pokemon.hp * 0.05) * pokemon.items.count(ITEMS.LIFE_ORB), board, ATTACK_TYPE.TRUE, pokemon);
      }

      if(pokemon.items.count(ITEMS.SHELL_BELL) != 0){
        pokemon.handleHeal(Math.ceil(damage / 10) * pokemon.items.count(ITEMS.SHELL_BELL));
      }

      if (victim && pokemon.effects.includes(EFFECTS.BRUTAL_SWING)) {
        pokemon.handleHeal(pokemon.hp);
      }
      if (victim && pokemon.effects.includes(EFFECTS.POWER_TRIP)) {
        pokemon.atk += pokemon.baseAtk;
      }
    }
  }

  onEnter(pokemon) {
    super.onEnter(pokemon);
    pokemon.action = STATE_TYPE.ATTACKING;
    pokemon.cooldown = 0;
  }

  onExit(pokemon) {
    pokemon.targetX = -1;
    pokemon.targetY = -1;
    super.onExit(pokemon);
  }
}

module.exports = AttackingState;
