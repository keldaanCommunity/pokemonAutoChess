const PokemonFactory = require('./pokemon-factory');


const COMMON = ['geodude', 'azurill', 'zubat', 'mareep', 'cleffa', 'igglybuff', 'caterpie', 'weedle', 'pidgey', 'hoppip', 'seedot', 'starly'];
const UNCOMMON = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'treecko', 'torchic', 'mudkip', 'turtwig', 'chimchar', 'piplup', 'nidoranF', 'nidoranM'];
const RARE = ['pichu', 'machop', 'horsea', 'trapinch', 'spheal', 'aron', 'magnemite', 'rhyhorn', 'togepi', 'duskull', 'lotad', 'shinx', 'poliwag'];
const EPIC = ['abra', 'gastly', 'dratini', 'larvitar', 'slakoth', 'ralts', 'bagon', 'beldum', 'gible', 'elekid', 'magby'];
const LEGENDARY = ['munchlax', 'growlithe', 'onix', 'scyther', 'riolu'];

const PROBABILITY = {
  1: [1, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0],
  3: [0.7, 0.3, 0, 0],
  4: [0.55, 0.3, 0.15, 0, 0],
  5: [0.4, 0.3, 0.25, 0.05, 0],
  6: [0.29, 0.295, 0.31, 0.1, 0.005],
  7: [0.24, 0.28, 0.31, 0.15, 0.02],
  8: [0.2, 0.24, 0.31, 0.2, 0.05],
  9: [0.1, 0.19, 0.31, 0.30, 0.1]
};

class Shop {
  detachShop(player) {
    for (const id in player.shop) {
      delete player.shop[id];
    }
  }

  assignShop(player) {
    for (let i = 0; i < 5; i++) {
      const pokemon = PokemonFactory.createPokemonFromName(this.pickPokemon(player));
      player.shop[pokemon.id] = pokemon;
    }
  }

  pickPokemon(player) {
    const playerProbality = PROBABILITY[player.experienceManager.level];
    const seed = Math.random();
    let pokemon = '';
    let threshold = 0;
    for (let i = 0; i < playerProbality.length; i++) {
      threshold += playerProbality[i];
      if (seed < threshold) {
        switch (i) {
          case 0:
            pokemon = COMMON[Math.floor(Math.random() * COMMON.length)];
            break;
          case 1:
            pokemon = UNCOMMON[Math.floor(Math.random() * UNCOMMON.length)];
            break;
          case 2:
            pokemon = RARE[Math.floor(Math.random() * RARE.length)];
            break;
          case 3:
            pokemon = EPIC[Math.floor(Math.random() * EPIC.length)];
            break;
          case 4:
            pokemon = LEGENDARY[Math.floor(Math.random() * LEGENDARY.length)];
            break;
          default:
            console.log(`error in shop while picking seed = ${seed}, threshold = ${threshold}, index = ${i}`);
            break;
        }
        break;
      }
    }
    return pokemon;
  }
}

module.exports = Shop;
