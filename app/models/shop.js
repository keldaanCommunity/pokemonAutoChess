const PokemonFactory = require('./pokemon-factory');
const {PKM, PROBABILITY} = require('./enum');

const COMMON = [PKM.CHARMANDER, PKM.GEODUDE,
  PKM.AZURILL, PKM.ZUBAT,
  PKM.MAREEP, PKM.CLEFFA,
  PKM.CATERPIE, PKM.WEEDLE,
  PKM.PIDGEY, PKM.HOPPIP,
  PKM.SEEDOT, PKM.STARLY,
  PKM.TOTODILE, PKM.SWINUB];

const UNCOMMON = [PKM.SQUIRTLE, PKM.IGGLYBUFF, PKM.CHIKORITA,
  PKM.CYNDAQUIL, PKM.TREECKO, PKM.TORCHIC,
  PKM.MUDKIP, PKM.CHIMCHAR, PKM.PIPLUP,
  PKM.MACHOP, PKM.HORSEA, PKM.SPHEAL,
  PKM.MAGNEMITE, PKM.DUSKULL, PKM.EEVEE, PKM.SANDILE,
  PKM.VENIPEDE, PKM.PIKIPEK,
  PKM.FLABEBE, PKM.BELLSPROUT, PKM.SLOWPOKE];

const RARE = [PKM.BULBASAUR, PKM.TURTWIG, PKM.NIDORANF,
  PKM.NIDORANM, PKM.PICHU, PKM.TRAPINCH,
  PKM.ARON, PKM.RHYHORN, PKM.TOGEPI,
  PKM.LOTAD, PKM.SHINX, PKM.POLIWAG,
  PKM.DRATINI, PKM.MAGBY, PKM.VANILLITE,
  PKM.DEINO, PKM.SOLOSIS,
  PKM.AXEW, PKM.WHISMUR];

const EPIC = [PKM.ABRA, PKM.LARVITAR,
  PKM.SLAKOTH, PKM.RALTS,
  PKM.BAGON, PKM.BELDUM,
  PKM.GIBLE, PKM.ELEKID,
  PKM.LITWICK, PKM.SNORUNT, PKM.BUDEW,
  PKM.PORYGON,
  PKM.HONEDGE, PKM.CUBONE,
  PKM.TYMPOLE, PKM.SEWADDLE,
  PKM.JANGMOO];

const LEGENDARY = [PKM.GASTLY,
  PKM.ONIX, PKM.SCYTHER,
  PKM.RIOLU, PKM.MEDITITE,
  PKM.NUMEL, PKM.SNOVER,
  PKM.SWABLU, PKM.BUNEARY,
  PKM.ELECTRIKE, PKM.SHUPPET];

const MYTHICAL_1 = [PKM.VIRIZION, PKM.REGICE, PKM.REGISTEEL, PKM.REGIROCK, PKM.UXIE, PKM.MESPRIT, PKM.AZELF, PKM.LATIAS, PKM.LATIOS, PKM.ZAPDOS, PKM.MOLTRES, PKM.ARTICUNO, PKM.LAPRAS, PKM.ABSOL, PKM.SPIRITOMB, PKM.ROTOM, PKM.MANAPHY, PKM.COBALION, PKM.TERRAKION, PKM.KELDEO, PKM.TORNADUS, PKM.THUNDURUS, PKM.LANDORUS, PKM.VOLCARONA];
const MYTHICAL_2 = [PKM.MELOETTA, PKM.MEWTWO, PKM.ENTEI, PKM.SUICUNE, PKM.RAIKOU, PKM.KYUREM, PKM.RESHIRAM, PKM.ZEKROM, PKM.REGIGIGAS, PKM.CELEBI, PKM.VICTINI, PKM.JIRACHI, PKM.ARCEUS, PKM.DEOXYS, PKM.SHAYMIN, PKM.GIRATINA, PKM.DARKRAI, PKM.CRESSELIA, PKM.HEATRAN, PKM.LUGIA, PKM.HOOH, PKM.PALKIA, PKM.DIALGA, PKM.RAYQUAZA, PKM.KYOGRE, PKM.GROUDON];


class Shop {
  assignShop(player) {
    for (let i = 0; i < 6; i++) {
      let pokemon = this.pickPokemon(player);
      const seed = Math.random();
      if (seed > 0.994) {
        pokemon = PKM.DITTO;
      }
      player.shop[i] = pokemon;
    }
  }

  assignDittoShop(player) {
    player.shop[0] = PKM.DITTO;

    for (let i = 1; i < 6; i++) {
      const pokemon = this.pickPokemon(player);
      player.shop[i] = pokemon;
    }
  }

  assignFirstMythicalShop(player) {
    const mythicalCopy = JSON.parse(JSON.stringify(MYTHICAL_1));
    for (let i = 0; i < 6; i++) {
      const pkm = PokemonFactory.createPokemonFromName(mythicalCopy[Math.floor(Math.random() * mythicalCopy.length)]).name;
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1);
      player.shop[i] = pkm;
    }
  }

  assignSecondMythicalShop(player) {
    const mythicalCopy = JSON.parse(JSON.stringify(MYTHICAL_2));
    for (let i = 0; i < 6; i++) {
      const pkm = PokemonFactory.createPokemonFromName(mythicalCopy[Math.floor(Math.random() * mythicalCopy.length)]).name;
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1);
      player.shop[i] = pkm;
    }
  }

  pickPokemon(player) {
    const playerProbality = PROBABILITY[player.experienceManager.level];
    const seed = Math.random();
    let pokemon = '';
    let threshold = 0;
    const common = [];
    const uncommon = [];
    const rare = [];
    const epic = [];
    const legendary = [];
    const threeStars = [];

    player.board.forEach((pokemon, id) => {
      if (pokemon.stars == 3) {
        threeStars.push(PokemonFactory.getPokemonFamily(pokemon.name));
      }
    });

    COMMON.forEach((name) => {
      if (!threeStars.includes(name)) {
        common.push(name);
      }
    });
    UNCOMMON.forEach((name) => {
      if (!threeStars.includes(name)) {
        uncommon.push(name);
      }
    });
    RARE.forEach((name) => {
      if (!threeStars.includes(name)) {
        rare.push(name);
      }
    });
    EPIC.forEach((name) => {
      if (!threeStars.includes(name)) {
        epic.push(name);
      }
    });
    LEGENDARY.forEach((name) => {
      if (!threeStars.includes(name)) {
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
