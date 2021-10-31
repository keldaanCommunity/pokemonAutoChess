const {POKEMON_BOT, ITEM_TYPE, BATTLE_RESULT} = require('../models/enum');
const SCENARIOS = require('../models/scenarios');
const PokemonFactory = require('../models/pokemon-factory');
class Bot {
  constructor(player) {
    this.player = player;
    this.step = 0;
    this.progress = 0;
    this.scenario = SCENARIOS[POKEMON_BOT[player.avatar]];
    this.updatePlayerTeam(0);
  }

  updateProgress() {
    if (this.player.getLastBattleResult() == BATTLE_RESULT.DEFEAT) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BATTLE_RESULT.DRAW) {
      this.progress += 1;
    } else if (this.player.getLastBattleResult() == BATTLE_RESULT.WIN) {
      this.progress += 1.5;
    }
    if (this.scenario.steps[this.step + 1] && this.progress >= this.scenario.steps[this.step + 1].roundsRequired) {
      this.step += 1;
      this.progress = 0;
      this.updatePlayerTeam();
    }
  }

  updatePlayerTeam() {
    this.player.board.forEach((pokemon, key) => {
      this.player.board.delete(key);
    });

    const stepTeam = this.scenario.steps[this.step];
    for (let i = 0; i < stepTeam.board.length; i++) {
      const pkm = PokemonFactory.createPokemonFromName(stepTeam.board[i].name);
      pkm.positionX = stepTeam.board[i].x;
      pkm.positionY = stepTeam.board[i].y;
      this.player.board[pkm.id] = pkm;
    }

    const items = this.player.stuff.getAllItems();
    const specificItems = Object.keys(ITEM_TYPE);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let itemAdded = false;
      if (specificItems.includes(item)) {
        this.player.board.forEach((pokemon, key) => {
          if (pokemon.types.includes(ITEM_TYPE[item])) {
            pokemon.items.add(item);
            itemAdded = true;
          }
        });
      }
      if (!itemAdded) {
        const pokemonIds = Array.from(this.player.board);
        const pokemon = this.player.board.get(pokemonIds[Math.floor(Math.random() * pokemonIds.length)][0]);
        pokemon.items.add(item);
      }
    }
    this.player.synergies.update(this.player.board);
    this.player.effects.update(this.player.synergies);
  }
}

module.exports = Bot;
