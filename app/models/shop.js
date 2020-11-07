const PokemonFactory = require('./pokemon-factory');

const COMMON = ['geodude', 'azurill', 'zubat', 'mareep', 'cleffa', 'igglybuff', 'caterpie', 'weedle', 'pidgey', 'hoppip', 'seedot', 'starly'];
const UNCOMMON = ['eevee','bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'treecko', 'torchic', 'mudkip', 'turtwig', 'chimchar', 'piplup', 'nidoranF', 'nidoranM'];
const RARE = ['pichu', 'machop', 'horsea', 'trapinch', 'spheal', 'aron', 'magnemite', 'rhyhorn', 'togepi', 'duskull', 'lotad', 'shinx', 'poliwag'];
const EPIC = ['abra', 'gastly', 'dratini', 'larvitar', 'slakoth', 'ralts', 'bagon', 'beldum', 'gible', 'elekid', 'magby', 'litwick'];
const LEGENDARY = ['meditite', 'numel', 'onix', 'scyther', 'riolu'];

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
    player.shop[0] = '';
    player.shop[1] = '';
    player.shop[2] = '';
    player.shop[3] = '';
    player.shop[4] = '';
  }

  assignShop(player) {
    for (let i = 0; i < 5; i++) {
      let pokemon = PokemonFactory.createPokemonFromName(this.pickPokemon(player));
      const seed = Math.random();
      if(seed > 0.993){
        pokemon = PokemonFactory.createPokemonFromName('ditto');
      }
      player.shop[i] = pokemon.name;
    }
  }

  pickPokemon(player) {
    const playerProbality = PROBABILITY[player.experienceManager.level];
    const seed = Math.random();
    let pokemon = '';
    let threshold = 0;
    let common = [];
    let uncommon = [];
    let rare = [];
    let epic = [];
    let legendary = [];
    let threeStars = [];

    player.board.forEach((pokemon, id) => {
      if(pokemon.stars == 3){
        threeStars.push(PokemonFactory.getPokemonFamily(pokemon.name));
      }
  });

    COMMON.forEach(name => {
      if(!threeStars.includes(name)){
        common.push(name);
      }
    });
    UNCOMMON.forEach(name => {
      if(!threeStars.includes(name)){
        uncommon.push(name);
      }
    });
    RARE.forEach(name => {
      if(!threeStars.includes(name)){
        rare.push(name);
      }
    });
    EPIC.forEach(name => {
      if(!threeStars.includes(name)){
        epic.push(name);
      }
    });
    LEGENDARY.forEach(name => {
      if(!threeStars.includes(name)){
        legendary.push(name);
      }
    });
    for (let i = 0; i < playerProbality.length; i++) {
      threshold += playerProbality[i];
      if (seed < threshold) {
        switch (i) {
          case 0:
            pokemon = common[Math.floor(Math.random() * common.length)];
            break;
          case 1:
            pokemon = uncommon[Math.floor(Math.random() * uncommon.length)];
            break;
          case 2:
            pokemon = rare[Math.floor(Math.random() * rare.length)];
            break;
          case 3:
            pokemon = epic[Math.floor(Math.random() * epic.length)];
            break;
          case 4:
            pokemon = legendary[Math.floor(Math.random() * legendary.length)];
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
