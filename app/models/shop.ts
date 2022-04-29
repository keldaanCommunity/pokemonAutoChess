import PokemonFactory from './pokemon-factory';
import {Pkm, PkmFamily} from '../types/enum/Pokemon';
import Player from './colyseus-models/player';
import {IPokemon} from '../types';
import {PROBABILITY} from '../types/Config';

const COMMON = [Pkm.CHARMANDER, Pkm.GEODUDE,
  Pkm.AZURILL, Pkm.ZUBAT,
  Pkm.MAREEP, Pkm.CLEFFA,
  Pkm.CATERPIE, Pkm.WEEDLE,
  Pkm.PIDGEY, Pkm.HOPPIP,
  Pkm.SEEDOT, Pkm.STARLY,
  Pkm.TOTODILE, Pkm.SWINUB, Pkm.NOIBAT, Pkm.FENNEKIN, Pkm.HATENNA];

const UNCOMMON = [Pkm.SQUIRTLE, Pkm.IGGLYBUFF, Pkm.CHIKORITA,
  Pkm.CYNDAQUIL, Pkm.TREECKO, Pkm.TORCHIC,
  Pkm.MUDKIP, Pkm.CHIMCHAR, Pkm.PIPLUP,
  Pkm.MACHOP, Pkm.HORSEA, Pkm.SPHEAL,
  Pkm.MAGNEMITE, Pkm.DUSKULL, Pkm.EEVEE,
  Pkm.FLABEBE, Pkm.BELLSPROUT, Pkm.SLOWPOKE, Pkm.CORPHISH];

const RARE = [Pkm.BULBASAUR, Pkm.TURTWIG, Pkm.NIDORANF,
  Pkm.NIDORANM, Pkm.PICHU, Pkm.TRAPINCH,
  Pkm.ARON, Pkm.RHYHORN, Pkm.TOGEPI,
  Pkm.LOTAD, Pkm.SHINX, Pkm.POLIWAG,
  Pkm.DRATINI, Pkm.MAGBY, Pkm.WHISMUR, Pkm.PUMPKABOO, Pkm.MAKUHITA, Pkm.JOLTIK, Pkm.CACNEA];

const EPIC = [Pkm.ABRA, Pkm.LARVITAR,
  Pkm.SLAKOTH, Pkm.RALTS,
  Pkm.BAGON, Pkm.BELDUM,
  Pkm.GIBLE, Pkm.ELEKID,
  Pkm.LITWICK, Pkm.SNORUNT, Pkm.BUDEW,
  Pkm.PORYGON, Pkm.CUBONE, Pkm.PONYTA];

const LEGENDARY = [Pkm.GASTLY,
  Pkm.ONIX, Pkm.SCYTHER,
  Pkm.RIOLU, Pkm.MEDITITE,
  Pkm.NUMEL, Pkm.SNOVER,
  Pkm.SWABLU, Pkm.BUNEARY,
  Pkm.ELECTRIKE, Pkm.SHUPPET, Pkm.NINCADA];

const MYTHICAL_1 = [Pkm.REGIDRAGO, Pkm.REGIELEKI, Pkm.CASTFORM, Pkm.VIRIZION, Pkm.REGICE, Pkm.REGISTEEL, Pkm.REGIROCK, Pkm.UXIE, Pkm.MESPRIT, Pkm.AZELF, Pkm.LATIAS, Pkm.LATIOS, Pkm.ZAPDOS, Pkm.MOLTRES, Pkm.ARTICUNO, Pkm.LAPRAS, Pkm.ABSOL, Pkm.SPIRITOMB, Pkm.ROTOM, Pkm.MANAPHY, Pkm.COBALION, Pkm.TERRAKION, Pkm.KELDEO, Pkm.TORNADUS, Pkm.THUNDURUS, Pkm.LANDORUS, Pkm.VOLCARONA];
const MYTHICAL_2 = [Pkm.GUZZLORD, Pkm.ETERNATUS, Pkm.MELOETTA, Pkm.MEWTWO, Pkm.ENTEI, Pkm.SUICUNE, Pkm.RAIKOU, Pkm.KYUREM, Pkm.RESHIRAM, Pkm.ZEKROM, Pkm.REGIGIGAS, Pkm.CELEBI, Pkm.VICTINI, Pkm.JIRACHI, Pkm.ARCEUS, Pkm.DEOXYS, Pkm.SHAYMIN, Pkm.GIRATINA, Pkm.DARKRAI, Pkm.CRESSELIA, Pkm.HEATRAN, Pkm.LUGIA, Pkm.HO_OH, Pkm.PALKIA, Pkm.DIALGA, Pkm.RAYQUAZA, Pkm.KYOGRE, Pkm.GROUDON];


export default class Shop {

  assignShop(player: Player) {
    for (let i = 0; i < 6; i++) {
      let pokemon = this.pickPokemon(player);
      const seed = Math.random();
      if (seed > 0.994) {
        pokemon = Pkm.DITTO;
      }
      player.shop[i] = pokemon;
    }
  }

  assignDittoShop(player: Player) {
    player.shop[0] = Pkm.DITTO;

    for (let i = 1; i < 6; i++) {
      const pokemon = this.pickPokemon(player);
      player.shop[i] = pokemon;
    }
  }

  assignFirstMythicalShop(player: Player) {
    const mythicalCopy = JSON.parse(JSON.stringify(MYTHICAL_1));
    for (let i = 0; i < 6; i++) {
      const pkm = PokemonFactory.createPokemonFromName(mythicalCopy[Math.floor(Math.random() * mythicalCopy.length)]).name;
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1);
      player.shop[i] = pkm;
    }
  }

  assignSecondMythicalShop(player: Player) {
    const mythicalCopy = JSON.parse(JSON.stringify(MYTHICAL_2));
    for (let i = 0; i < 6; i++) {
      const pkm = PokemonFactory.createPokemonFromName(mythicalCopy[Math.floor(Math.random() * mythicalCopy.length)]).name;
      mythicalCopy.splice(mythicalCopy.indexOf(pkm), 1);
      player.shop[i] = pkm;
    }
  }

  pickPokemon(player: Player) {
    const playerProbality = PROBABILITY[player.experienceManager.level];
    const seed = Math.random();
    let pokemon: Pkm;
    let threshold = 0;
    const common = new Array<Pkm>();
    const uncommon = new Array<Pkm>();
    const rare = new Array<Pkm>();
    const epic = new Array<Pkm>();
    const legendary = new Array<Pkm>();
    const threeStars = new Array<Pkm>();

    player.board.forEach((pokemon: IPokemon) => {
      if (pokemon.stars == 3) {
        threeStars.push(PkmFamily[pokemon.name]);
      }
    });

    COMMON.forEach((name: Pkm) => {
      if (!threeStars.includes(name)) {
        common.push(name);
      }
    });
    UNCOMMON.forEach((name: Pkm) => {
      if (!threeStars.includes(name)) {
        uncommon.push(name);
      }
    });
    RARE.forEach((name: Pkm) => {
      if (!threeStars.includes(name)) {
        rare.push(name);
      }
    });
    EPIC.forEach((name: Pkm) => {
      if (!threeStars.includes(name)) {
        epic.push(name);
      }
    });
    LEGENDARY.forEach((name: Pkm) => {
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
