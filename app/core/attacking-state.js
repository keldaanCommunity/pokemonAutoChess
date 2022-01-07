const {STATE_TYPE, EFFECTS, ITEMS, ATTACK_TYPE, CLIMATE, ORIENTATION, TYPE} = require('../models/enum');
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
      } else if (pokemon.status.confusion) {
        pokemon.toMovingState();
      } else {
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
    if (target && !pokemon.status.sleep && !pokemon.status.freeze) {
      if (climate == CLIMATE.SNOW) {
        let freezeChance = 0;
        if (pokemon.effects.includes(EFFECTS.SNOW)) {
          freezeChance += 0.1;
        }
        if (pokemon.effects.includes(EFFECTS.SHEER_COLD)) {
          freezeChance += 0.3;
        }
        if (Math.random() > 1 - freezeChance) {
          target.status.triggerFreeze(2000);
        }
      }
      if (pokemon.items.count(ITEMS.ICY_ROCK) != 0) {
        if (Math.random() > 0.9) {
          target.status.triggerFreeze(2000);
        }
      }
      let poisonChance = 0;
      if (pokemon.effects.includes(EFFECTS.POISON_GAS)) {
        poisonChance += 0.2;
      }
      if (pokemon.effects.includes(EFFECTS.TOXIC)) {
        poisonChance += 0.5;
      }
      if (poisonChance != 0 && !(target.types.includes(TYPE.METAL) || target.types.includes(TYPE.POISON))) {
        if (Math.random() > poisonChance) {
          target.status.triggerPoison(2000);
        }
      }
      if (pokemon.effects.includes(EFFECTS.CURSE)) {
        target.status.triggerSilence(2000);
      }
      if (pokemon.effects.includes(EFFECTS.REVENGE)) {
        pokemon.setMana(pokemon.mana + 5);
      }
      if (pokemon.effects.includes(EFFECTS.PUNISHMENT)) {
        pokemon.setMana(pokemon.mana + 15);
      }
      pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
      if (pokemon.orientation == ORIENTATION.UNCLEAR) {
        console.log(`error orientation, was attacking, name ${pokemon.name}`);
        pokemon.orientation = ORIENTATION.DOWNLEFT;
      }
      // console.log(`pokemon attack from (${pokemon.positionX},${pokemon.positionY}) to (${pokemon.targetX},${pokemon.targetY}), orientation: ${pokemon.orientation}`);
      let damage;
      let attackType = pokemon.attackType;

      if (Math.random() * 100 < pokemon.critChance) {
        damage = Math.round(pokemon.atk * pokemon.critDamage);
        target.count.crit ++;
        if (pokemon.items.count(ITEMS.RAZOR_CLAW) != 0) {
          attackType = ATTACK_TYPE.TRUE;
        }
      } else {
        damage = pokemon.atk;
      }

      if (pokemon.effects.includes(EFFECTS.PHANTOM_FORCE)) {
        attackType = ATTACK_TYPE.TRUE;
      }
      if (target.items.count(ITEMS.ROCKY_HELMET) != 0) {
        pokemon.handleDamage(Math.ceil(pokemon.hp * 0.04) * target.items.count(ITEMS.ROCKY_HELMET), board, ATTACK_TYPE.PHYSICAL, target);
      }

      if (pokemon.items.count(ITEMS.LIFE_ORB) != 0) {
        pokemon.handleDamage(Math.ceil(pokemon.hp * 0.05) * pokemon.items.count(ITEMS.LIFE_ORB), board, ATTACK_TYPE.TRUE, pokemon);
      }

      if (pokemon.items.count(ITEMS.SHELL_BELL) != 0) {
        pokemon.handleHeal(Math.ceil(damage / 10) * pokemon.items.count(ITEMS.SHELL_BELL));
      }

      const victim = target.handleDamage(damage, board, attackType, pokemon);

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
