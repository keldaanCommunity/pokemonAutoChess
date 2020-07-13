const PokemonFactory = require("./pokemon-factory");

class Shop {

  static common = ["geodude", "azurill", "zubat","mareep","cleffa","igglybuff","caterpie","weedle","pidgey","hoppip","seedot","starly"];
  static uncommon = ["bulbasaur","charmander","squirtle","chikorita","cyndaquil","totodile","treecko","torchic","mudkip","turtwig","chimchar","piplup","nidoranF","nidoranM"];
  static rare = ["pichu","machop","horsea","trapinch","spheal","aron","magnemite","rhyhorn","togepi","duskull","lotad","shinx","poliwag"];
  static epic = ["abra","gastly","dratini","larvitar","slakoth","ralts","bagon","beldum","gible","elekid","magby"];
  static legendary = ["munchlax","growlithe","onix","scyther","riolu"];
  
  static probabilities = {
    1: [1, 0, 0, 0, 0],
    2: [1, 0, 0, 0, 0],
    3: [0.7, 0.3, 0, 0],
    4: [0.55, 0.3, 0.15, 0, 0],
    5: [0.4, 0.3, 0.25, 0.05, 0],
    6: [0.29, 0.295, 0.31, 0.1, 0.005],
    7: [0.24, 0.28, 0.31, 0.15, 0.02],
    8: [0.2, 0.24, 0.31, 0.2, 0.05],
    9: [0.1, 0.19, 0.31, 0.30, 0.1]
  }
  detachShop(player) {
    for (let id in player.shop) {
      delete player.shop[id];
    }
  }

  assignShop(player) {
    for (let i = 0; i < 5; i++) {  
      let pokemon = PokemonFactory.createPokemonFromName(this.pickPokemon(player));
      player.shop[pokemon.id] = pokemon;
    }
  }

  pickPokemon(player){
    let playerProbality = Shop.probabilities[player.experienceManager.level];
    let seed = Math.random();
    let pokemon = "";
    let threshold = 0;
    for (let i = 0; i < playerProbality.length; i++) {
      threshold += playerProbality[i];
      if(seed < threshold){
        switch (i) {
          case 0:
            pokemon = Shop.common[Math.floor(Math.random() * Shop.common.length)];
            break;
          case 1:
            pokemon = Shop.uncommon[Math.floor(Math.random() * Shop.uncommon.length)];
            break;
          case 2:
            pokemon = Shop.rare[Math.floor(Math.random() * Shop.rare.length)];
            break;
          case 3:
            pokemon = Shop.epic[Math.floor(Math.random() * Shop.epic.length)];
            break;
          case 4:
            pokemon = Shop.legendary[Math.floor(Math.random() * Shop.legendary.length)];
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