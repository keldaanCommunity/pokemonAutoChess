const {STATE_TYPE, EFFECTS, ATTACK_TYPE, CLIMATE, ORIENTATION, ITEM} = require('../models/enum');
const PokemonState = require('./pokemon-state');

class AttackingState extends PokemonState {
  constructor() {
    super();
  }

  update(pokemon, dt, board, climate) {
    super.update(pokemon, dt, board, climate);
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = pokemon.getAttackDelay();
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
    pokemon.count.attackCount ++;
    pokemon.targetX = coordinates[0];
    pokemon.targetY = coordinates[1];
    const target = board.getValue(coordinates[0], coordinates[1]);
    if (target && !pokemon.status.sleep && !pokemon.status.freeze) {
      if (pokemon.items.has(ITEM.UPGRADE)) {
        pokemon.handleAttackSpeed(6);
      }

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
      let poisonChance = 0;
      if (pokemon.effects.includes(EFFECTS.POISON_GAS)) {
        poisonChance += 0.1;
      }
      if (pokemon.effects.includes(EFFECTS.TOXIC)) {
        poisonChance += 0.3;
      }
      if (poisonChance != 0) {
        if (Math.random() > poisonChance) {
          target.status.triggerPoison(2000, target);
        }
      }
      if (pokemon.effects.includes(EFFECTS.CURSE) || pokemon.effects.includes(EFFECTS.PHANTOM_FORCE)) {
        target.status.triggerSilence(3000);
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
      const attackType = pokemon.attackType;

      if (Math.random() * 100 < pokemon.critChance && target && target.items.has(ITEM.ROCKY_HELMET)) {
        if (pokemon.effects.includes(EFFECTS.FAIRY_WIND) || pokemon.effects.includes(EFFECTS.STRANGE_STEAM) || pokemon.effects.includes(EFFECTS.AROMATIC_MIST)) {
          let d = 0;
          if (pokemon.effects.includes(EFFECTS.AROMATIC_MIST)) {
            d = 15;
          } else if (pokemon.effects.includes(EFFECTS.FAIRY_WIND)) {
            d = 30;
          } else if (pokemon.effects.includes(EFFECTS.STRANGE_STEAM)) {
            d = 60;
          }
          const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

          cells.forEach((cell) => {
            if (cell.value && pokemon.team != cell.value.team) {
              cell.value.count.fairyCritCount ++;
              cell.value.handleDamage(d, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
          });
        }
        if (target.effects.includes(EFFECTS.FAIRY_WIND) || target.effects.includes(EFFECTS.STRANGE_STEAM) || target.effects.includes(EFFECTS.AROMATIC_MIST)) {
          let d = 0;
          if (target.effects.includes(EFFECTS.AROMATIC_MIST)) {
            d = 15;
          } else if (target.effects.includes(EFFECTS.FAIRY_WIND)) {
            d = 30;
          } else if (target.effects.includes(EFFECTS.STRANGE_STEAM)) {
            d = 60;
          }
          const cells = board.getAdjacentCells(target.positionX, target.positionY);

          cells.forEach((cell) => {
            if (cell.value && target.team != cell.value.team) {
              cell.value.count.fairyCritCount ++;
              cell.value.handleDamage(d, board, ATTACK_TYPE.SPECIAL, pokemon);
            }
          });
        }
        damage = Math.round(pokemon.atk * pokemon.critDamage);
        target.count.crit ++;
      } else {
        damage = pokemon.atk;
      }

      const victim = target.handleDamage(damage, board, attackType, pokemon);

      if (pokemon.items.has(ITEM.BLUE_ORB)) {
        pokemon.count.staticHolderCount ++;
        if (pokemon.count.staticHolderCount > 3) {
          pokemon.count.staticHolderCount = 0;
          let c = 4;
          board.forEach((x, y, tg) => {
            if (tg && pokemon.team != tg.team) {
              tg.count.staticCount ++;
              tg.handleDamage(8, board, ATTACK_TYPE.SPECIAL, pokemon);
              c --;
            }
          });
        }
      }

      if (target && target.items.has(ITEM.SMOKE_BALL)) {
        pokemon.status.triggerSmoke(5000, pokemon);
      }

      if (target && pokemon.items.has(ITEM.RAZOR_FANG)) {
        target.status.triggerArmorReduction(5000);
      }

      if (pokemon.items.has(ITEM.CHOICE_SCARF)) {
        const cells = board.getAdjacentCells(target.positionX, target.positionY);
        let targetCount = 1;
        cells.forEach((cell) => {
          if (cell.value && pokemon.team != cell.value.team && targetCount > 0) {
            cell.value.handleDamage(Math.ceil(0.75 * damage), board, attackType, pokemon);
            targetCount --;
          }
        });
      }

      if (pokemon.items.has(ITEM.LEFTOVERS)) {
        const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        pokemon.handleHeal(3);
        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.handleHeal(3);
          }
        });
      }

      if (pokemon.items.has(ITEM.MANA_SCARF)) {
        pokemon.setMana(pokemon.mana + 8);
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
