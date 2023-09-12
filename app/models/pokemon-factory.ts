import { MapSchema } from "@colyseus/schema"
import { Emotion, IPlayer } from "../types"
import { EvolutionTime, HatchList, UniqueShop, PkmCost } from "../types/Config"
import { PokemonActionState, Rarity } from "../types/enum/Game"
import { Passive } from "../types/enum/Passive"
import {
  Pkm,
  PkmDuos,
  PkmFamily,
  PkmIndex,
  PkmProposition,
  Unowns
} from "../types/enum/Pokemon"
import { Synergy } from "../types/enum/Synergy"
import { logger } from "../utils/logger"
import { pickRandomIn } from "../utils/random"
import {
  Abomasnow,
  Abra,
  Absol,
  Aegislash,
  Aerodactyl,
  Aggron,
  Alakazam,
  AlolanGeodude,
  AlolanGolem,
  AlolanGraveler,
  AlolanGrimer,
  AlolanMarowak,
  AlolanMuk,
  AlolanNinetales,
  AlolanVulpix,
  Altaria,
  Amaura,
  Ampharos,
  Anorith,
  Appletun,
  Applin,
  Arbok,
  Arcanine,
  Arceus,
  Archen,
  Archeops,
  Armaldo,
  Aron,
  Articuno,
  Aurorus,
  Axew,
  Azelf,
  Azumarill,
  Azurill,
  Bagon,
  Banette,
  Bastiodon,
  Bayleef,
  Beautifly,
  Beedrill,
  Beldum,
  Bellossom,
  Bellsprout,
  Blacephalon,
  Blastoise,
  Blaziken,
  Blissey,
  Bonsley,
  Bounsweet,
  Braixen,
  Breloom,
  Brionne,
  Bronzong,
  Bronzor,
  Budew,
  Buizel,
  Bulbasaur,
  Buneary,
  Butterfree,
  Cacnea,
  Cacturne,
  Camerupt,
  Carbink,
  Carracosta,
  Carvanha,
  Cascoon,
  Castform,
  CastformHail,
  CastformRain,
  CastformSun,
  Caterpie,
  Celebi,
  Chandelure,
  Chansey,
  Charizard,
  Charmander,
  Charmeleon,
  Chatot,
  Chikorita,
  Chimchar,
  Chinchou,
  Cinderace,
  Clamperl,
  Clefable,
  Clefairy,
  Cleffa,
  Cloyster,
  Cobalion,
  Combee,
  Combusken,
  Corphish,
  Cradily,
  Cranidos,
  Crawdaunt,
  Cresselia,
  Croagunk,
  Crobat,
  Croconaw,
  Cubone,
  Cyndaquil,
  Darkrai,
  Dartix,
  Decidueye,
  Deino,
  Delphox,
  Deoxys,
  Dewgong,
  Dewott,
  Dialga,
  Diancie,
  Diglett,
  Ditto,
  Doublade,
  Dragapult,
  Dragonair,
  Dragonite,
  Drakloak,
  Dratini,
  Dreepy,
  Drifblim,
  Drifloon,
  Dugtrio,
  Duosion,
  Dusclops,
  Dusknoir,
  Duskull,
  Dustox,
  Eevee,
  Egg,
  Ekans,
  Electabuzz,
  Electivire,
  Electrike,
  Electrode,
  Elekid,
  Emboar,
  Empoleon,
  Entei,
  Espeon,
  Eternatus,
  Exploud,
  Farfetchd,
  Fearow,
  Fennekin,
  Feraligatr,
  Flabebe,
  Flaffy,
  Flareon,
  Floatzel,
  Floette,
  Florges,
  Flygon,
  Forretress,
  Fraxure,
  Froakie,
  Frogadier,
  Froslass,
  Frosmoth,
  Furret,
  Gabite,
  Galvantula,
  Garchomp,
  Gardevoir,
  Gastly,
  Genesect,
  Gengar,
  Geodude,
  Gible,
  Giratina,
  Glaceon,
  Glalie,
  Gligar,
  Gliscor,
  Gloom,
  Golbat,
  Golem,
  Goodra,
  Goomy,
  Gorebyss,
  Gothita,
  Gothitelle,
  Gothorita,
  Gourgeist,
  Granbull,
  Graveler,
  Greninja,
  Grimer,
  Grotle,
  Groudon,
  Grovyle,
  Growlithe,
  Guzzlord,
  Gyarados,
  HakamoO,
  Happiny,
  Hariyama,
  Hatenna,
  Hatterene,
  Hattrem,
  Haunter,
  Haxorus,
  Heatran,
  HisuiZoroark,
  HisuiZorua,
  Hitmonchan,
  Hitmonlee,
  Hitmontop,
  Honedge,
  HooH,
  Hoopa,
  HoopaUnbound,
  Hoothoot,
  Hoppip,
  Horsea,
  Houndoom,
  Houndour,
  Huntail,
  Hydreigon,
  Igglybuff,
  Infernape,
  Ivysaur,
  JangmoO,
  Jigglypuff,
  Jirachi,
  Jolteon,
  Joltik,
  Jumpluff,
  Jynx,
  Kabuto,
  Kabutops,
  Kadabra,
  Kakuna,
  Kecleon,
  Keldeo,
  Kingdra,
  Kirlia,
  KommoO,
  Krookodile,
  Krookorok,
  Kyogre,
  Kyurem,
  Lairon,
  Lampent,
  Landorus,
  Lanturn,
  Lapras,
  Larvitar,
  Latias,
  Latios,
  Leafeon,
  Leavanny,
  Lileep,
  Litwick,
  Lombre,
  Lopunny,
  Lotad,
  Loudred,
  Lucario,
  Ludicolo,
  Lugia,
  Lunatone,
  Luxio,
  Luxray,
  Machamp,
  Machoke,
  Machop,
  Magby,
  Magcargo,
  Magikarp,
  Magmar,
  Magmortar,
  Magnemite,
  Magneton,
  Magnezone,
  Makuhita,
  Mamoswine,
  Manaphy,
  Manectric,
  Mankey,
  Maractus,
  Mareep,
  Marill,
  Marowak,
  Marshadow,
  Marshtomp,
  Mawile,
  Medicham,
  Meditite,
  MegaAbomasnow,
  MegaAltaria,
  MegaBanette,
  MegaCamerupt,
  MegaHoundoom,
  MegaLopunny,
  MegaLucario,
  MegaManectric,
  MegaMedicham,
  MegaRayquaza,
  MegaScizor,
  MegaSteelix,
  Meganium,
  Melmetal,
  Meloetta,
  Meowth,
  Mesprit,
  Metagross,
  Metang,
  Metapod,
  Mew,
  Mewtwo,
  Mightyena,
  Miltank,
  MimeJr,
  Mimikyu,
  Minun,
  Moltres,
  Monferno,
  MrMime,
  Mudkip,
  Muk,
  Munchlax,
  Natu,
  Nidoking,
  Nidoqueen,
  NidoranF,
  NidoranM,
  Nidorina,
  Nidorino,
  Nincada,
  Ninetales,
  Ninjask,
  Noctowl,
  Noibat,
  Noivern,
  Numel,
  Nuzleaf,
  Oddish,
  Omanyte,
  Omastar,
  Onix,
  OriginGiratina,
  Oshawott,
  Palkia,
  Palpitoad,
  Paras,
  Parasect,
  Persian,
  Phione,
  Pichu,
  Pidgeot,
  Pidgeotto,
  Pidgey,
  Pignite,
  Pikachu,
  Pikipek,
  Piloswine,
  Pineco,
  Pinsir,
  Piplup,
  PirouetteMeloetta,
  Plusle,
  Pokemon,
  Politoed,
  Poliwag,
  Poliwhirl,
  Poliwrath,
  Ponyta,
  Poochyena,
  Popplio,
  Porygon,
  Porygon2,
  PorygonZ,
  PrimalGroudon,
  PrimalKyogre,
  Primarina,
  Primeape,
  Prinplup,
  Pumpkaboo,
  Pupitar,
  Quilava,
  Raboot,
  Raichu,
  Raikou,
  Ralts,
  Rampardos,
  Rapidash,
  Raticate,
  Rattata,
  Rayquaza,
  Regice,
  Regidrago,
  Regieleki,
  Regigigas,
  Regirock,
  Registeel,
  Relicanth,
  Reshiram,
  Reuniclus,
  Rhydon,
  Rhyhorn,
  Rhyperior,
  Riolu,
  Roselia,
  Roserade,
  Rotom,
  Rowlet,
  Salamence,
  Salandit,
  Salazzle,
  Samurott,
  Sandile,
  Sandshrew,
  Sandslash,
  Sceptile,
  Scizor,
  Scolipede,
  Scorbunny,
  Scyther,
  Seadra,
  Sealeo,
  Seedot,
  Seel,
  Seismitoad,
  Sentret,
  Serperior,
  Servine,
  Seviper,
  Sewaddle,
  Sharpedo,
  Shaymin,
  ShayminSky,
  Shedninja,
  Shelgon,
  Shellder,
  Shieldon,
  Shiftry,
  Shinx,
  Shroomish,
  Shuckle,
  Shuppet,
  Silcoon,
  Skiploom,
  Slaking,
  Slakoth,
  Sligoo,
  Slowbro,
  Slowking,
  Slowpoke,
  Slugma,
  Smoochum,
  Sneasel,
  Snivy,
  Snom,
  Snorlax,
  Snorunt,
  Snover,
  Snubull,
  Solosis,
  Solrock,
  Spearow,
  Spheal,
  Spectrier,
  Spiritomb,
  Squirtle,
  Stakataka,
  Staraptor,
  Staravia,
  Starly,
  Steelix,
  Steenee,
  Sudowoodo,
  Suicune,
  Sunflora,
  Sunkern,
  Swablu,
  Swadloon,
  Swampert,
  Swinub,
  Sylvally,
  Sylveon,
  TapuBulu,
  TapuFini,
  TapuKoko,
  TapuLele,
  Tauros,
  Tentacool,
  Tentacruel,
  Tepig,
  Terrakion,
  Thundurus,
  Tinkatink,
  Tinkaton,
  Tinkatuff,
  Tirtouga,
  Togekiss,
  Togepi,
  Togetic,
  Torchic,
  Tornadus,
  Torterra,
  Totodile,
  Toucannon,
  Toxicroak,
  Trapinch,
  Treecko,
  Trumbeak,
  Tsareena,
  Turtwig,
  Tympole,
  TypeNull,
  Typhlosion,
  Tyranitar,
  Tyrantrum,
  Tyrogue,
  Tyrunt,
  Umbreon,
  UnownA,
  UnownB,
  UnownC,
  UnownD,
  UnownE,
  UnownExclamation,
  UnownF,
  UnownG,
  UnownH,
  UnownI,
  UnownJ,
  UnownK,
  UnownL,
  UnownM,
  UnownN,
  UnownO,
  UnownP,
  UnownQ,
  UnownQuestion,
  UnownR,
  UnownS,
  UnownT,
  UnownU,
  UnownV,
  UnownW,
  UnownX,
  UnownY,
  UnownZ,
  Uxie,
  Vanillish,
  Vanillite,
  Vanilluxe,
  Vaporeon,
  Venipede,
  Venomoth,
  Venonat,
  Venusaur,
  Vespiqueen,
  Vibrava,
  Victini,
  Victreebel,
  Vigoroth,
  Vileplume,
  Virizion,
  Volcanion,
  Volcarona,
  Voltorb,
  Vulpix,
  Wailmer,
  Wailord,
  Walrein,
  Wartortle,
  Weavile,
  Weedle,
  Weepinbell,
  Whirlipede,
  Whismur,
  Wigglytuff,
  Wobbuffet,
  Wurmple,
  Wynaut,
  Xatu,
  Xerneas,
  Yveltal,
  Zapdos,
  Zekrom,
  Zeraora,
  Zoroark,
  Zorua,
  Zubat,
  Zweilous,
  Torkoal,
  Delibird,
  Larvesta,
  IronBundle,
  Kartana
} from "./colyseus-models/pokemon"
import { IPokemonConfig } from "./mongo-models/user-metadata"
import PRECOMPUTED_TYPE_POKEMONS from "./precomputed/type-pokemons.json"

export default class PokemonFactory {
  static getNeutralPokemonsByLevelStage(
    level: number,
    shinyEncounter: boolean
  ): MapSchema<Pokemon> {
    const pokemons = new MapSchema<Pokemon>()
    switch (level) {
      case 1: {
        const magikarp1 = PokemonFactory.createPokemonFromName(Pkm.MAGIKARP)
        magikarp1.positionX = 3
        magikarp1.positionY = 1
        const magikarp2 = PokemonFactory.createPokemonFromName(Pkm.MAGIKARP)
        magikarp2.positionX = 5
        magikarp2.positionY = 1
        pokemons.set(magikarp1.id, magikarp1)
        pokemons.set(magikarp2.id, magikarp2)
        break
      }

      case 2: {
        const rattata1 = PokemonFactory.createPokemonFromName(Pkm.RATTATA)
        rattata1.positionX = 3
        rattata1.positionY = 1
        const rattata2 = PokemonFactory.createPokemonFromName(Pkm.RATTATA)
        rattata2.positionX = 5
        rattata2.positionY = 1
        const raticate = PokemonFactory.createPokemonFromName(Pkm.RATICATE)
        raticate.positionX = 4
        raticate.positionY = 2
        pokemons.set(rattata1.id, rattata1)
        pokemons.set(rattata2.id, rattata2)
        pokemons.set(raticate.id, raticate)
        break
      }

      case 3: {
        const spearow1 = PokemonFactory.createPokemonFromName(Pkm.SPEAROW)
        spearow1.positionX = 3
        spearow1.positionY = 1
        const spearow2 = PokemonFactory.createPokemonFromName(Pkm.SPEAROW)
        spearow2.positionX = 5
        spearow2.positionY = 1
        const spearow3 = PokemonFactory.createPokemonFromName(Pkm.SPEAROW)
        spearow3.positionX = 4
        spearow3.positionY = 1
        const fearow = PokemonFactory.createPokemonFromName(Pkm.FEAROW)
        fearow.positionX = 4
        fearow.positionY = 2
        pokemons.set(spearow1.id, spearow1)
        pokemons.set(spearow2.id, spearow2)
        pokemons.set(spearow3.id, spearow3)
        pokemons.set(fearow.id, fearow)
        break
      }

      case 9: {
        const config = shinyEncounter
          ? { selectedShiny: true, selectedEmotion: Emotion.ANGRY }
          : undefined
        const gyarados = PokemonFactory.createPokemonFromName(
          Pkm.GYARADOS,
          config
        )
        gyarados.positionX = 4
        gyarados.positionY = 2
        pokemons.set(gyarados.id, gyarados)
        break
      }

      case 14: {
        const lugia = PokemonFactory.createPokemonFromName(Pkm.LUGIA)
        lugia.positionX = 4
        lugia.positionY = 2
        pokemons.set(lugia.id, lugia)
        break
      }

      case 19: {
        const giratina = PokemonFactory.createPokemonFromName(Pkm.GIRATINA)
        giratina.positionX = 4
        giratina.positionY = 2
        pokemons.set(giratina.id, giratina)
        break
      }

      case 24: {
        const zapdos = PokemonFactory.createPokemonFromName(Pkm.ZAPDOS)
        zapdos.positionX = 2
        zapdos.positionY = 2
        pokemons.set(zapdos.id, zapdos)
        const moltres = PokemonFactory.createPokemonFromName(Pkm.MOLTRES)
        moltres.positionX = 4
        moltres.positionY = 2
        pokemons.set(moltres.id, moltres)
        const articuno = PokemonFactory.createPokemonFromName(Pkm.ARTICUNO)
        articuno.positionX = 6
        articuno.positionY = 2
        pokemons.set(articuno.id, articuno)
        break
      }

      case 29: {
        const dialga = PokemonFactory.createPokemonFromName(Pkm.DIALGA)
        dialga.positionX = 2
        dialga.positionY = 2
        pokemons.set(dialga.id, dialga)
        const palkia = PokemonFactory.createPokemonFromName(Pkm.PALKIA)
        palkia.positionX = 6
        palkia.positionY = 2
        pokemons.set(palkia.id, palkia)
        break
      }

      case 34: {
        const suicune = PokemonFactory.createPokemonFromName(Pkm.SUICUNE)
        suicune.positionX = 2
        suicune.positionY = 2
        pokemons.set(suicune.id, suicune)
        const raikou = PokemonFactory.createPokemonFromName(Pkm.RAIKOU)
        raikou.positionX = 4
        raikou.positionY = 2
        pokemons.set(raikou.id, raikou)
        const entei = PokemonFactory.createPokemonFromName(Pkm.ENTEI)
        entei.positionX = 6
        entei.positionY = 2
        pokemons.set(entei.id, entei)
        break
      }

      case 39: {
        const regice = PokemonFactory.createPokemonFromName(Pkm.REGICE)
        regice.positionX = 2
        regice.positionY = 3
        pokemons.set(regice.id, regice)
        const regirock = PokemonFactory.createPokemonFromName(Pkm.REGIROCK)
        regirock.positionX = 4
        regirock.positionY = 3
        pokemons.set(regirock.id, regirock)
        const registeel = PokemonFactory.createPokemonFromName(Pkm.REGISTEEL)
        registeel.positionX = 6
        registeel.positionY = 3
        pokemons.set(registeel.id, registeel)
        const regigigas = PokemonFactory.createPokemonFromName(Pkm.REGIGIGAS)
        regigigas.positionX = 4
        regigigas.positionY = 1
        pokemons.set(regigigas.id, regigigas)
        break
      }

      default: {
        const kyogre = PokemonFactory.createPokemonFromName(Pkm.KYOGRE)
        kyogre.positionX = 2
        kyogre.positionY = 2
        pokemons.set(kyogre.id, kyogre)
        const groudon = PokemonFactory.createPokemonFromName(Pkm.GROUDON)
        groudon.positionX = 4
        groudon.positionY = 2
        pokemons.set(groudon.id, groudon)
        const rayquaza = PokemonFactory.createPokemonFromName(Pkm.RAYQUAZA)
        rayquaza.positionX = 6
        rayquaza.positionY = 2
        pokemons.set(rayquaza.id, rayquaza)
        break
      }
    }
    return pokemons
  }

  // transforms a pokemon into another pokemon,
  // transferring its items and position to
  // the new pokemon
  static transformPokemon(before: Pokemon, afterName: Pkm, player?: IPlayer) {
    const transformation = this.createPokemonFromName(afterName, player)
    transformation.positionX = before.positionX
    transformation.positionY = before.positionY
    transformation.items = before.items
    return transformation
  }

  static getPokemonBaseEvolution(name: Pkm) {
    switch (name) {
      case Pkm.VAPOREON:
        return Pkm.EEVEE
      case Pkm.JOLTEON:
        return Pkm.EEVEE
      case Pkm.FLAREON:
        return Pkm.EEVEE
      case Pkm.ESPEON:
        return Pkm.EEVEE
      case Pkm.UMBREON:
        return Pkm.EEVEE
      case Pkm.LEAFEON:
        return Pkm.EEVEE
      case Pkm.SYLVEON:
        return Pkm.EEVEE
      case Pkm.GLACEON:
        return Pkm.EEVEE
      default:
        return PkmFamily[name]
    }
  }

  static createPokemonFromName(
    name: Pkm,
    config?: IPlayer | { selectedShiny?: boolean; selectedEmotion?: Emotion }
  ): Pokemon {
    if (config && "pokemonCollection" in config) {
      config = config.pokemonCollection.get(PkmIndex[name])
    }
    const s = config && config.selectedShiny ? true : false
    const e =
      config && config.selectedEmotion ? config.selectedEmotion : Emotion.NORMAL
    switch (name) {
      case Pkm.BULBASAUR:
        return new Bulbasaur(s, e)
      case Pkm.IVYSAUR:
        return new Ivysaur(s, e)
      case Pkm.VENUSAUR:
        return new Venusaur(s, e)
      case Pkm.CHARMANDER:
        return new Charmander(s, e)
      case Pkm.CHARMELEON:
        return new Charmeleon(s, e)
      case Pkm.CHARIZARD:
        return new Charizard(s, e)
      case Pkm.SQUIRTLE:
        return new Squirtle(s, e)
      case Pkm.WARTORTLE:
        return new Wartortle(s, e)
      case Pkm.BLASTOISE:
        return new Blastoise(s, e)
      case Pkm.SLOWPOKE:
        return new Slowpoke(s, e)
      case Pkm.SLOWBRO:
        return new Slowbro(s, e)
      case Pkm.SLOWKING:
        return new Slowking(s, e)
      case Pkm.GEODUDE:
        return new Geodude(s, e)
      case Pkm.GRAVELER:
        return new Graveler(s, e)
      case Pkm.GOLEM:
        return new Golem(s, e)
      case Pkm.AZURILL:
        return new Azurill(s, e)
      case Pkm.MARILL:
        return new Marill(s, e)
      case Pkm.AZUMARILL:
        return new Azumarill(s, e)
      case Pkm.ZUBAT:
        return new Zubat(s, e)
      case Pkm.GOLBAT:
        return new Golbat(s, e)
      case Pkm.CROBAT:
        return new Crobat(s, e)
      case Pkm.AMPHAROS:
        return new Ampharos(s, e)
      case Pkm.MAREEP:
        return new Mareep(s, e)
      case Pkm.FLAFFY:
        return new Flaffy(s, e)
      case Pkm.CLEFFA:
        return new Cleffa(s, e)
      case Pkm.CLEFAIRY:
        return new Clefairy(s, e)
      case Pkm.CLEFABLE:
        return new Clefable(s, e)
      case Pkm.IGGLYBUFF:
        return new Igglybuff(s, e)
      case Pkm.JIGGLYPUFF:
        return new Jigglypuff(s, e)
      case Pkm.WIGGLYTUFF:
        return new Wigglytuff(s, e)
      case Pkm.CATERPIE:
        return new Caterpie(s, e)
      case Pkm.METAPOD:
        return new Metapod(s, e)
      case Pkm.BUTTERFREE:
        return new Butterfree(s, e)
      case Pkm.WEEDLE:
        return new Weedle(s, e)
      case Pkm.KAKUNA:
        return new Kakuna(s, e)
      case Pkm.BEEDRILL:
        return new Beedrill(s, e)
      case Pkm.PIDGEY:
        return new Pidgey(s, e)
      case Pkm.PIDGEOTTO:
        return new Pidgeotto(s, e)
      case Pkm.PIDGEOT:
        return new Pidgeot(s, e)
      case Pkm.HOPPIP:
        return new Hoppip(s, e)
      case Pkm.SKIPLOOM:
        return new Skiploom(s, e)
      case Pkm.JUMPLUFF:
        return new Jumpluff(s, e)
      case Pkm.SEEDOT:
        return new Seedot(s, e)
      case Pkm.NUZLEAF:
        return new Nuzleaf(s, e)
      case Pkm.SHIFTRY:
        return new Shiftry(s, e)
      case Pkm.STARLY:
        return new Starly(s, e)
      case Pkm.STARAVIA:
        return new Staravia(s, e)
      case Pkm.STARAPTOR:
        return new Staraptor(s, e)
      case Pkm.CHIKORITA:
        return new Chikorita(s, e)
      case Pkm.BAYLEEF:
        return new Bayleef(s, e)
      case Pkm.MEGANIUM:
        return new Meganium(s, e)
      case Pkm.CYNDAQUIL:
        return new Cyndaquil(s, e)
      case Pkm.QUILAVA:
        return new Quilava(s, e)
      case Pkm.TYPHLOSION:
        return new Typhlosion(s, e)
      case Pkm.TOTODILE:
        return new Totodile(s, e)
      case Pkm.CROCONAW:
        return new Croconaw(s, e)
      case Pkm.FERALIGATR:
        return new Feraligatr(s, e)
      case Pkm.TREECKO:
        return new Treecko(s, e)
      case Pkm.GROVYLE:
        return new Grovyle(s, e)
      case Pkm.SCEPTILE:
        return new Sceptile(s, e)
      case Pkm.TORCHIC:
        return new Torchic(s, e)
      case Pkm.COMBUSKEN:
        return new Combusken(s, e)
      case Pkm.BLAZIKEN:
        return new Blaziken(s, e)
      case Pkm.MUDKIP:
        return new Mudkip(s, e)
      case Pkm.MARSHTOMP:
        return new Marshtomp(s, e)
      case Pkm.SWAMPERT:
        return new Swampert(s, e)
      case Pkm.TURTWIG:
        return new Turtwig(s, e)
      case Pkm.GROTLE:
        return new Grotle(s, e)
      case Pkm.TORTERRA:
        return new Torterra(s, e)
      case Pkm.CHIMCHAR:
        return new Chimchar(s, e)
      case Pkm.MONFERNO:
        return new Monferno(s, e)
      case Pkm.INFERNAPE:
        return new Infernape(s, e)
      case Pkm.PIPLUP:
        return new Piplup(s, e)
      case Pkm.PRINPLUP:
        return new Prinplup(s, e)
      case Pkm.EMPOLEON:
        return new Empoleon(s, e)
      case Pkm.NIDORANF:
        return new NidoranF(s, e)
      case Pkm.NIDORINA:
        return new Nidorina(s, e)
      case Pkm.NIDOQUEEN:
        return new Nidoqueen(s, e)
      case Pkm.NIDORANM:
        return new NidoranM(s, e)
      case Pkm.NIDORINO:
        return new Nidorino(s, e)
      case Pkm.NIDOKING:
        return new Nidoking(s, e)
      case Pkm.PICHU:
        return new Pichu(s, e)
      case Pkm.PIKACHU:
        return new Pikachu(s, e)
      case Pkm.RAICHU:
        return new Raichu(s, e)
      case Pkm.MACHOP:
        return new Machop(s, e)
      case Pkm.MACHOKE:
        return new Machoke(s, e)
      case Pkm.MACHAMP:
        return new Machamp(s, e)
      case Pkm.HORSEA:
        return new Horsea(s, e)
      case Pkm.SEADRA:
        return new Seadra(s, e)
      case Pkm.KINGDRA:
        return new Kingdra(s, e)
      case Pkm.TRAPINCH:
        return new Trapinch(s, e)
      case Pkm.VIBRAVA:
        return new Vibrava(s, e)
      case Pkm.FLYGON:
        return new Flygon(s, e)
      case Pkm.SPHEAL:
        return new Spheal(s, e)
      case Pkm.SEALEO:
        return new Sealeo(s, e)
      case Pkm.WALREIN:
        return new Walrein(s, e)
      case Pkm.ARON:
        return new Aron(s, e)
      case Pkm.LAIRON:
        return new Lairon(s, e)
      case Pkm.AGGRON:
        return new Aggron(s, e)
      case Pkm.MAGNEMITE:
        return new Magnemite(s, e)
      case Pkm.MAGNETON:
        return new Magneton(s, e)
      case Pkm.MAGNEZONE:
        return new Magnezone(s, e)
      case Pkm.RHYHORN:
        return new Rhyhorn(s, e)
      case Pkm.RHYDON:
        return new Rhydon(s, e)
      case Pkm.RHYPERIOR:
        return new Rhyperior(s, e)
      case Pkm.TOGEPI:
        return new Togepi(s, e)
      case Pkm.TOGETIC:
        return new Togetic(s, e)
      case Pkm.TOGEKISS:
        return new Togekiss(s, e)
      case Pkm.DUSKULL:
        return new Duskull(s, e)
      case Pkm.DUSCLOPS:
        return new Dusclops(s, e)
      case Pkm.DUSKNOIR:
        return new Dusknoir(s, e)
      case Pkm.LOTAD:
        return new Lotad(s, e)
      case Pkm.LOMBRE:
        return new Lombre(s, e)
      case Pkm.LUDICOLO:
        return new Ludicolo(s, e)
      case Pkm.SHINX:
        return new Shinx(s, e)
      case Pkm.LUXIO:
        return new Luxio(s, e)
      case Pkm.LUXRAY:
        return new Luxray(s, e)
      case Pkm.POLIWAG:
        return new Poliwag(s, e)
      case Pkm.POLIWHIRL:
        return new Poliwhirl(s, e)
      case Pkm.POLITOED:
        return new Politoed(s, e)
      case Pkm.ABRA:
        return new Abra(s, e)
      case Pkm.KADABRA:
        return new Kadabra(s, e)
      case Pkm.ALAKAZAM:
        return new Alakazam(s, e)
      case Pkm.GASTLY:
        return new Gastly(s, e)
      case Pkm.HAUNTER:
        return new Haunter(s, e)
      case Pkm.GENGAR:
        return new Gengar(s, e)
      case Pkm.DRATINI:
        return new Dratini(s, e)
      case Pkm.DRAGONAIR:
        return new Dragonair(s, e)
      case Pkm.DRAGONITE:
        return new Dragonite(s, e)
      case Pkm.LARVITAR:
        return new Larvitar(s, e)
      case Pkm.PUPITAR:
        return new Pupitar(s, e)
      case Pkm.TYRANITAR:
        return new Tyranitar(s, e)
      case Pkm.SLAKOTH:
        return new Slakoth(s, e)
      case Pkm.VIGOROTH:
        return new Vigoroth(s, e)
      case Pkm.SLAKING:
        return new Slaking(s, e)
      case Pkm.RALTS:
        return new Ralts(s, e)
      case Pkm.KIRLIA:
        return new Kirlia(s, e)
      case Pkm.GARDEVOIR:
        return new Gardevoir(s, e)
      case Pkm.BAGON:
        return new Bagon(s, e)
      case Pkm.SHELGON:
        return new Shelgon(s, e)
      case Pkm.SALAMENCE:
        return new Salamence(s, e)
      case Pkm.BELDUM:
        return new Beldum(s, e)
      case Pkm.METANG:
        return new Metang(s, e)
      case Pkm.METAGROSS:
        return new Metagross(s, e)
      case Pkm.GIBLE:
        return new Gible(s, e)
      case Pkm.GABITE:
        return new Gabite(s, e)
      case Pkm.GARCHOMP:
        return new Garchomp(s, e)
      case Pkm.ELEKID:
        return new Elekid(s, e)
      case Pkm.ELECTABUZZ:
        return new Electabuzz(s, e)
      case Pkm.ELECTIVIRE:
        return new Electivire(s, e)
      case Pkm.MAGBY:
        return new Magby(s, e)
      case Pkm.MAGMAR:
        return new Magmar(s, e)
      case Pkm.MAGMORTAR:
        return new Magmortar(s, e)
      case Pkm.MUNCHLAX:
        return new Munchlax(s, e)
      case Pkm.SNORLAX:
        return new Snorlax(s, e)
      case Pkm.GROWLITHE:
        return new Growlithe(s, e)
      case Pkm.ARCANINE:
        return new Arcanine(s, e)
      case Pkm.ONIX:
        return new Onix(s, e)
      case Pkm.STEELIX:
        return new Steelix(s, e)
      case Pkm.MEGA_STEELIX:
        return new MegaSteelix(s, e)
      case Pkm.SCYTHER:
        return new Scyther(s, e)
      case Pkm.SCIZOR:
        return new Scizor(s, e)
      case Pkm.MEGA_SCIZOR:
        return new MegaScizor(s, e)
      case Pkm.RIOLU:
        return new Riolu(s, e)
      case Pkm.LUCARIO:
        return new Lucario(s, e)
      case Pkm.MEGA_LUCARIO:
        return new MegaLucario(s, e)
      case Pkm.MAGIKARP:
        return new Magikarp(s, e)
      case Pkm.RATTATA:
        return new Rattata(s, e)
      case Pkm.RATICATE:
        return new Raticate(s, e)
      case Pkm.SPEAROW:
        return new Spearow(s, e)
      case Pkm.FEAROW:
        return new Fearow(s, e)
      case Pkm.GYARADOS:
        return new Gyarados(s, e)
      case Pkm.LUGIA:
        return new Lugia(s, e)
      case Pkm.ZAPDOS:
        return new Zapdos(s, e)
      case Pkm.MOLTRES:
        return new Moltres(s, e)
      case Pkm.ARTICUNO:
        return new Articuno(s, e)
      case Pkm.DIALGA:
        return new Dialga(s, e)
      case Pkm.PALKIA:
        return new Palkia(s, e)
      case Pkm.SUICUNE:
        return new Suicune(s, e)
      case Pkm.RAIKOU:
        return new Raikou(s, e)
      case Pkm.ENTEI:
        return new Entei(s, e)
      case Pkm.KYOGRE:
        return new Kyogre(s, e)
      case Pkm.GROUDON:
        return new Groudon(s, e)
      case Pkm.RAYQUAZA:
        return new Rayquaza(s, e)
      case Pkm.MEGA_RAYQUAZA:
        return new MegaRayquaza(s, e)
      case Pkm.REGICE:
        return new Regice(s, e)
      case Pkm.REGIROCK:
        return new Regirock(s, e)
      case Pkm.REGISTEEL:
        return new Registeel(s, e)
      case Pkm.REGIGIGAS:
        return new Regigigas(s, e)
      case Pkm.GIRATINA:
        return new Giratina(s, e)
      case Pkm.EEVEE:
        return new Eevee(s, e)
      case Pkm.VAPOREON:
        return new Vaporeon(s, e)
      case Pkm.JOLTEON:
        return new Jolteon(s, e)
      case Pkm.FLAREON:
        return new Flareon(s, e)
      case Pkm.ESPEON:
        return new Espeon(s, e)
      case Pkm.UMBREON:
        return new Umbreon(s, e)
      case Pkm.LEAFEON:
        return new Leafeon(s, e)
      case Pkm.SYLVEON:
        return new Sylveon(s, e)
      case Pkm.GLACEON:
        return new Glaceon(s, e)
      case Pkm.MEDITITE:
        return new Meditite(s, e)
      case Pkm.MEDICHAM:
        return new Medicham(s, e)
      case Pkm.MEGA_MEDICHAM:
        return new MegaMedicham(s, e)
      case Pkm.NUMEL:
        return new Numel(s, e)
      case Pkm.CAMERUPT:
        return new Camerupt(s, e)
      case Pkm.MEGA_CAMERUPT:
        return new MegaCamerupt(s, e)
      case Pkm.DITTO:
        return new Ditto(s, e)
      case Pkm.DARKRAI:
        return new Darkrai(s, e)
      case Pkm.LITWICK:
        return new Litwick(s, e)
      case Pkm.LAMPENT:
        return new Lampent(s, e)
      case Pkm.CHANDELURE:
        return new Chandelure(s, e)
      case Pkm.BELLSPROUT:
        return new Bellsprout(s, e)
      case Pkm.WEEPINBELL:
        return new Weepinbell(s, e)
      case Pkm.VICTREEBEL:
        return new Victreebel(s, e)
      case Pkm.SWINUB:
        return new Swinub(s, e)
      case Pkm.PILOSWINE:
        return new Piloswine(s, e)
      case Pkm.MAMOSWINE:
        return new Mamoswine(s, e)
      case Pkm.SNORUNT:
        return new Snorunt(s, e)
      case Pkm.GLALIE:
        return new Glalie(s, e)
      case Pkm.FROSLASS:
        return new Froslass(s, e)
      case Pkm.SNOVER:
        return new Snover(s, e)
      case Pkm.ABOMASNOW:
        return new Abomasnow(s, e)
      case Pkm.MEGA_ABOMASNOW:
        return new MegaAbomasnow(s, e)
      case Pkm.VANILLITE:
        return new Vanillite(s, e)
      case Pkm.VANILLISH:
        return new Vanillish(s, e)
      case Pkm.VANILLUXE:
        return new Vanilluxe(s, e)
      case Pkm.LARVESTA:
        return new Larvesta(s, e)
      case Pkm.VOLCARONA:
        return new Volcarona(s, e)
      case Pkm.LANDORUS:
        return new Landorus(s, e)
      case Pkm.THUNDURUS:
        return new Thundurus(s, e)
      case Pkm.TORNADUS:
        return new Tornadus(s, e)
      case Pkm.KELDEO:
        return new Keldeo(s, e)
      case Pkm.TERRAKION:
        return new Terrakion(s, e)
      case Pkm.VIRIZION:
        return new Virizion(s, e)
      case Pkm.COBALION:
        return new Cobalion(s, e)
      case Pkm.MANAPHY:
        return new Manaphy(s, e)
      case Pkm.PHIONE:
        return new Phione(s, e)
      case Pkm.SPIRITOMB:
        return new Spiritomb(s, e)
      case Pkm.ABSOL:
        return new Absol(s, e)
      case Pkm.LAPRAS:
        return new Lapras(s, e)
      case Pkm.LATIAS:
        return new Latias(s, e)
      case Pkm.LATIOS:
        return new Latios(s, e)
      case Pkm.MESPRIT:
        return new Mesprit(s, e)
      case Pkm.AZELF:
        return new Azelf(s, e)
      case Pkm.UXIE:
        return new Uxie(s, e)
      case Pkm.MEWTWO:
        return new Mewtwo(s, e)
      case Pkm.KYUREM:
        return new Kyurem(s, e)
      case Pkm.RESHIRAM:
        return new Reshiram(s, e)
      case Pkm.ZEKROM:
        return new Zekrom(s, e)
      case Pkm.CELEBI:
        return new Celebi(s, e)
      case Pkm.VICTINI:
        return new Victini(s, e)
      case Pkm.JIRACHI:
        return new Jirachi(s, e)
      case Pkm.ARCEUS:
        return new Arceus(s, e)
      case Pkm.DEOXYS:
        return new Deoxys(s, e)
      case Pkm.SHAYMIN:
        return new Shaymin(s, e)
      case Pkm.SHAYMIN_SKY:
        return new ShayminSky(s, e)
      case Pkm.CRESSELIA:
        return new Cresselia(s, e)
      case Pkm.HEATRAN:
        return new Heatran(s, e)
      case Pkm.HO_OH:
        return new HooH(s, e)
      case Pkm.ROTOM:
        return new Rotom(s, e)
      case Pkm.AERODACTYL:
        return new Aerodactyl(s, e)
      case Pkm.SWABLU:
        return new Swablu(s, e)
      case Pkm.CARVANHA:
        return new Carvanha(s, e)
      case Pkm.PRIMAL_KYOGRE:
        return new PrimalKyogre(s, e)
      case Pkm.PRIMAL_GROUDON:
        return new PrimalGroudon(s, e)
      case Pkm.MEOWTH:
        return new Meowth(s, e)
      case Pkm.PERSIAN:
        return new Persian(s, e)
      case Pkm.DEINO:
        return new Deino(s, e)
      case Pkm.ZWEILOUS:
        return new Zweilous(s, e)
      case Pkm.HYDREIGON:
        return new Hydreigon(s, e)
      case Pkm.SANDILE:
        return new Sandile(s, e)
      case Pkm.KROKOROK:
        return new Krookorok(s, e)
      case Pkm.KROOKODILE:
        return new Krookodile(s, e)
      case Pkm.SOLOSIS:
        return new Solosis(s, e)
      case Pkm.DUOSION:
        return new Duosion(s, e)
      case Pkm.REUNICLUS:
        return new Reuniclus(s, e)
      case Pkm.ODDISH:
        return new Oddish(s, e)
      case Pkm.GLOOM:
        return new Gloom(s, e)
      case Pkm.VILEPLUME:
        return new Vileplume(s, e)
      case Pkm.BELLOSSOM:
        return new Bellossom(s, e)
      case Pkm.AMAURA:
        return new Amaura(s, e)
      case Pkm.AURORUS:
        return new Aurorus(s, e)
      case Pkm.ANORITH:
        return new Anorith(s, e)
      case Pkm.ARMALDO:
        return new Armaldo(s, e)
      case Pkm.ARCHEN:
        return new Archen(s, e)
      case Pkm.ARCHEOPS:
        return new Archeops(s, e)
      case Pkm.SHIELDON:
        return new Shieldon(s, e)
      case Pkm.BASTIODON:
        return new Bastiodon(s, e)
      case Pkm.TIRTOUGA:
        return new Tirtouga(s, e)
      case Pkm.CARRACOSTA:
        return new Carracosta(s, e)
      case Pkm.LILEEP:
        return new Lileep(s, e)
      case Pkm.CRADILY:
        return new Cradily(s, e)
      case Pkm.OMANYTE:
        return new Omanyte(s, e)
      case Pkm.OMASTAR:
        return new Omastar(s, e)
      case Pkm.CRANIDOS:
        return new Cranidos(s, e)
      case Pkm.RAMPARDOS:
        return new Rampardos(s, e)
      case Pkm.TYRUNT:
        return new Tyrunt(s, e)
      case Pkm.TYRANTRUM:
        return new Tyrantrum(s, e)
      case Pkm.KABUTO:
        return new Kabuto(s, e)
      case Pkm.KABUTOPS:
        return new Kabutops(s, e)
      case Pkm.BUDEW:
        return new Budew(s, e)
      case Pkm.ROSELIA:
        return new Roselia(s, e)
      case Pkm.ROSERADE:
        return new Roserade(s, e)
      case Pkm.BUNEARY:
        return new Buneary(s, e)
      case Pkm.LOPUNNY:
        return new Lopunny(s, e)
      case Pkm.MEGA_LOPUNNY:
        return new MegaLopunny(s, e)
      case Pkm.AXEW:
        return new Axew(s, e)
      case Pkm.FRAXURE:
        return new Fraxure(s, e)
      case Pkm.HAXORUS:
        return new Haxorus(s, e)
      case Pkm.VENIPEDE:
        return new Venipede(s, e)
      case Pkm.WHIRLIPEDE:
        return new Whirlipede(s, e)
      case Pkm.SCOLIPEDE:
        return new Scolipede(s, e)
      case Pkm.PORYGON:
        return new Porygon(s, e)
      case Pkm.PORYGON_2:
        return new Porygon2(s, e)
      case Pkm.PORYGON_Z:
        return new PorygonZ(s, e)
      case Pkm.ELECTRIKE:
        return new Electrike(s, e)
      case Pkm.MANECTRIC:
        return new Manectric(s, e)
      case Pkm.MEGA_MANECTRIC:
        return new MegaManectric(s, e)
      case Pkm.SHUPPET:
        return new Shuppet(s, e)
      case Pkm.BANETTE:
        return new Banette(s, e)
      case Pkm.MEGA_BANETTE:
        return new MegaBanette(s, e)
      case Pkm.HONEDGE:
        return new Honedge(s, e)
      case Pkm.DOUBLADE:
        return new Doublade(s, e)
      case Pkm.AEGISLASH:
        return new Aegislash(s, e)
      case Pkm.CUBONE:
        return new Cubone(s, e)
      case Pkm.MAROWAK:
        return new Marowak(s, e)
      case Pkm.ALOLAN_MAROWAK:
        return new AlolanMarowak(s, e)
      case Pkm.WHISMUR:
        return new Whismur(s, e)
      case Pkm.LOUDRED:
        return new Loudred(s, e)
      case Pkm.EXPLOUD:
        return new Exploud(s, e)
      case Pkm.TYMPOLE:
        return new Tympole(s, e)
      case Pkm.PALPITOAD:
        return new Palpitoad(s, e)
      case Pkm.SEISMITOAD:
        return new Seismitoad(s, e)
      case Pkm.SEWADDLE:
        return new Sewaddle(s, e)
      case Pkm.SWADLOON:
        return new Swadloon(s, e)
      case Pkm.LEAVANNY:
        return new Leavanny(s, e)
      case Pkm.PIKIPEK:
        return new Pikipek(s, e)
      case Pkm.TRUMBEAK:
        return new Trumbeak(s, e)
      case Pkm.TOUCANNON:
        return new Toucannon(s, e)
      case Pkm.FLABEBE:
        return new Flabebe(s, e)
      case Pkm.FLOETTE:
        return new Floette(s, e)
      case Pkm.FLORGES:
        return new Florges(s, e)
      case Pkm.JANGMO_O:
        return new JangmoO(s, e)
      case Pkm.HAKAMO_O:
        return new HakamoO(s, e)
      case Pkm.KOMMO_O:
        return new KommoO(s, e)
      case Pkm.MELOETTA:
        return new Meloetta(s, e)
      case Pkm.ALTARIA:
        return new Altaria(s, e)
      case Pkm.MEGA_ALTARIA:
        return new MegaAltaria(s, e)
      case Pkm.CASTFORM:
        return new Castform(s, e)
      case Pkm.CASTFORM_SUN:
        return new CastformSun(s, e)
      case Pkm.CASTFORM_RAIN:
        return new CastformRain(s, e)
      case Pkm.CASTFORM_HAIL:
        return new CastformHail(s, e)
      case Pkm.CORPHISH:
        return new Corphish(s, e)
      case Pkm.CRAWDAUNT:
        return new Crawdaunt(s, e)
      case Pkm.JOLTIK:
        return new Joltik(s, e)
      case Pkm.GALVANTULA:
        return new Galvantula(s, e)
      case Pkm.GENESECT:
        return new Genesect(s, e)
      case Pkm.DIANCIE:
        return new Diancie(s, e)
      case Pkm.HATENNA:
        return new Hatenna(s, e)
      case Pkm.HATTREM:
        return new Hattrem(s, e)
      case Pkm.HATTERENE:
        return new Hatterene(s, e)
      case Pkm.FENNEKIN:
        return new Fennekin(s, e)
      case Pkm.BRAIXEN:
        return new Braixen(s, e)
      case Pkm.DELPHOX:
        return new Delphox(s, e)
      case Pkm.MAKUHITA:
        return new Makuhita(s, e)
      case Pkm.HARIYAMA:
        return new Hariyama(s, e)
      case Pkm.REGIELEKI:
        return new Regieleki(s, e)
      case Pkm.REGIDRAGO:
        return new Regidrago(s, e)
      case Pkm.GUZZLORD:
        return new Guzzlord(s, e)
      case Pkm.ETERNATUS:
        return new Eternatus(s, e)
      case Pkm.PONYTA:
        return new Ponyta(s, e)
      case Pkm.RAPIDASH:
        return new Rapidash(s, e)
      case Pkm.NINCADA:
        return new Nincada(s, e)
      case Pkm.NINJASK:
        return new Ninjask(s, e)
      case Pkm.SHEDNINJA:
        return new Shedninja(s, e)
      case Pkm.NOIBAT:
        return new Noibat(s, e)
      case Pkm.NOIVERN:
        return new Noivern(s, e)
      case Pkm.PUMPKABOO:
        return new Pumpkaboo(s, e)
      case Pkm.GOURGEIST:
        return new Gourgeist(s, e)
      case Pkm.CACNEA:
        return new Cacnea(s, e)
      case Pkm.CACTURNE:
        return new Cacturne(s, e)
      case Pkm.RELICANTH:
        return new Relicanth(s, e)
      case Pkm.TAUROS:
        return new Tauros(s, e)
      case Pkm.HAPPINY:
        return new Happiny(s, e)
      case Pkm.CHANSEY:
        return new Chansey(s, e)
      case Pkm.BLISSEY:
        return new Blissey(s, e)
      case Pkm.TAPU_KOKO:
        return new TapuKoko(s, e)
      case Pkm.TAPU_LELE:
        return new TapuLele(s, e)
      case Pkm.STAKATAKA:
        return new Stakataka(s, e)
      case Pkm.BLACEPHALON:
        return new Blacephalon(s, e)
      case Pkm.HOUNDOUR:
        return new Houndour(s, e)
      case Pkm.HOUNDOOM:
        return new Houndoom(s, e)
      case Pkm.MEGA_HOUNDOOM:
        return new MegaHoundoom(s, e)
      case Pkm.CLAMPERL:
        return new Clamperl(s, e)
      case Pkm.HUNTAIL:
        return new Huntail(s, e)
      case Pkm.GOREBYSS:
        return new Gorebyss(s, e)
      case Pkm.SMOOCHUM:
        return new Smoochum(s, e)
      case Pkm.JYNX:
        return new Jynx(s, e)
      case Pkm.SALANDIT:
        return new Salandit(s, e)
      case Pkm.SALAZZLE:
        return new Salazzle(s, e)
      case Pkm.VENONAT:
        return new Venonat(s, e)
      case Pkm.VENOMOTH:
        return new Venomoth(s, e)
      case Pkm.VOLTORB:
        return new Voltorb(s, e)
      case Pkm.ELECTRODE:
        return new Electrode(s, e)
      case Pkm.SLUGMA:
        return new Slugma(s, e)
      case Pkm.MAGCARGO:
        return new Magcargo(s, e)
      case Pkm.SNEASEL:
        return new Sneasel(s, e)
      case Pkm.WEAVILE:
        return new Weavile(s, e)
      case Pkm.CROAGUNK:
        return new Croagunk(s, e)
      case Pkm.TOXICROAK:
        return new Toxicroak(s, e)
      case Pkm.CHINCHOU:
        return new Chinchou(s, e)
      case Pkm.LANTURN:
        return new Lanturn(s, e)
      case Pkm.POOCHYENA:
        return new Poochyena(s, e)
      case Pkm.MIGHTYENA:
        return new Mightyena(s, e)
      case Pkm.BRONZOR:
        return new Bronzor(s, e)
      case Pkm.BRONZONG:
        return new Bronzong(s, e)
      case Pkm.DRIFLOON:
        return new Drifloon(s, e)
      case Pkm.DRIFBLIM:
        return new Drifblim(s, e)
      case Pkm.SHROOMISH:
        return new Shroomish(s, e)
      case Pkm.BRELOOM:
        return new Breloom(s, e)
      case Pkm.TENTACOOL:
        return new Tentacool(s, e)
      case Pkm.TENTACRUEL:
        return new Tentacruel(s, e)
      case Pkm.SNUBULL:
        return new Snubull(s, e)
      case Pkm.GRANBULL:
        return new Granbull(s, e)
      case Pkm.SEVIPER:
        return new Seviper(s, e)
      case Pkm.VULPIX:
        return new Vulpix(s, e)
      case Pkm.NINETALES:
        return new Ninetales(s, e)
      case Pkm.ALOLAN_VULPIX:
        return new AlolanVulpix(s, e)
      case Pkm.ALOLAN_NINETALES:
        return new AlolanNinetales(s, e)
      case Pkm.MAWILE:
        return new Mawile(s, e)
      case Pkm.BUIZEL:
        return new Buizel(s, e)
      case Pkm.FLOATZEL:
        return new Floatzel(s, e)
      case Pkm.KECLEON:
        return new Kecleon(s, e)
      case Pkm.CARBINK:
        return new Carbink(s, e)
      case Pkm.CHATOT:
        return new Chatot(s, e)
      case Pkm.GOOMY:
        return new Goomy(s, e)
      case Pkm.SLIGOO:
        return new Sligoo(s, e)
      case Pkm.GOODRA:
        return new Goodra(s, e)
      case Pkm.MEW:
        return new Mew(s, e)
      case Pkm.BOUNSWEET:
        return new Bounsweet(s, e)
      case Pkm.STEENEE:
        return new Steenee(s, e)
      case Pkm.TSAREENA:
        return new Tsareena(s, e)
      case Pkm.VOLCANION:
        return new Volcanion(s, e)
      case Pkm.APPLIN:
        return new Applin(s, e)
      case Pkm.APPLETUN:
        return new Appletun(s, e)
      case Pkm.OSHAWOTT:
        return new Oshawott(s, e)
      case Pkm.DEWOTT:
        return new Dewott(s, e)
      case Pkm.SAMUROTT:
        return new Samurott(s, e)
      case Pkm.SNOM:
        return new Snom(s, e)
      case Pkm.FROSMOTH:
        return new Frosmoth(s, e)
      case Pkm.WAILMER:
        return new Wailmer(s, e)
      case Pkm.WAILORD:
        return new Wailord(s, e)
      case Pkm.DREEPY:
        return new Dreepy(s, e)
      case Pkm.DRAKLOAK:
        return new Drakloak(s, e)
      case Pkm.DRAGAPULT:
        return new Dragapult(s, e)
      case Pkm.SNIVY:
        return new Snivy(s, e)
      case Pkm.SERVINE:
        return new Servine(s, e)
      case Pkm.SERPERIOR:
        return new Serperior(s, e)
      case Pkm.POPPLIO:
        return new Popplio(s, e)
      case Pkm.BRIONNE:
        return new Brionne(s, e)
      case Pkm.PRIMARINA:
        return new Primarina(s, e)
      case Pkm.GOTHITA:
        return new Gothita(s, e)
      case Pkm.GOTHORITA:
        return new Gothorita(s, e)
      case Pkm.GOTHITELLE:
        return new Gothitelle(s, e)
      case Pkm.SCORBUNNY:
        return new Scorbunny(s, e)
      case Pkm.RABOOT:
        return new Raboot(s, e)
      case Pkm.CINDERACE:
        return new Cinderace(s, e)
      case Pkm.SANDSHREW:
        return new Sandshrew(s, e)
      case Pkm.SANDSLASH:
        return new Sandslash(s, e)
      case Pkm.FARFETCH_D:
        return new Farfetchd(s, e)
      case Pkm.UNOWN_A:
        return new UnownA(s, e)
      case Pkm.UNOWN_B:
        return new UnownB(s, e)
      case Pkm.UNOWN_C:
        return new UnownC(s, e)
      case Pkm.UNOWN_D:
        return new UnownD(s, e)
      case Pkm.UNOWN_E:
        return new UnownE(s, e)
      case Pkm.UNOWN_F:
        return new UnownF(s, e)
      case Pkm.UNOWN_G:
        return new UnownG(s, e)
      case Pkm.UNOWN_H:
        return new UnownH(s, e)
      case Pkm.UNOWN_I:
        return new UnownI(s, e)
      case Pkm.UNOWN_J:
        return new UnownJ(s, e)
      case Pkm.UNOWN_K:
        return new UnownK(s, e)
      case Pkm.UNOWN_L:
        return new UnownL(s, e)
      case Pkm.UNOWN_M:
        return new UnownM(s, e)
      case Pkm.UNOWN_N:
        return new UnownN(s, e)
      case Pkm.UNOWN_O:
        return new UnownO(s, e)
      case Pkm.UNOWN_P:
        return new UnownP(s, e)
      case Pkm.UNOWN_Q:
        return new UnownQ(s, e)
      case Pkm.UNOWN_R:
        return new UnownR(s, e)
      case Pkm.UNOWN_S:
        return new UnownS(s, e)
      case Pkm.UNOWN_T:
        return new UnownT(s, e)
      case Pkm.UNOWN_U:
        return new UnownU(s, e)
      case Pkm.UNOWN_V:
        return new UnownV(s, e)
      case Pkm.UNOWN_W:
        return new UnownW(s, e)
      case Pkm.UNOWN_X:
        return new UnownX(s, e)
      case Pkm.UNOWN_Y:
        return new UnownY(s, e)
      case Pkm.UNOWN_Z:
        return new UnownZ(s, e)
      case Pkm.UNOWN_QUESTION:
        return new UnownQuestion(s, e)
      case Pkm.UNOWN_EXCLAMATION:
        return new UnownExclamation(s, e)
      case Pkm.EGG:
        return new Egg(s, e)
      case Pkm.TAPU_FINI:
        return new TapuFini(s, e)
      case Pkm.TAPU_BULU:
        return new TapuBulu(s, e)
      case Pkm.DIGLETT:
        return new Diglett(s, e)
      case Pkm.DUGTRIO:
        return new Dugtrio(s, e)
      case Pkm.ROWLET:
        return new Rowlet(s, e)
      case Pkm.DARTIX:
        return new Dartix(s, e)
      case Pkm.DECIDUEYE:
        return new Decidueye(s, e)
      case Pkm.ZORUA:
        return new Zorua(s, e)
      case Pkm.ZOROARK:
        return new Zoroark(s, e)
      case Pkm.HISUI_ZORUA:
        return new HisuiZorua(s, e)
      case Pkm.HISUI_ZOROARK:
        return new HisuiZoroark(s, e)
      case Pkm.FROAKIE:
        return new Froakie(s, e)
      case Pkm.FROGADIER:
        return new Frogadier(s, e)
      case Pkm.GRENINJA:
        return new Greninja(s, e)
      case Pkm.TYROGUE:
        return new Tyrogue(s, e)
      case Pkm.HITMONLEE:
        return new Hitmonlee(s, e)
      case Pkm.HITMONCHAN:
        return new Hitmonchan(s, e)
      case Pkm.HITMONTOP:
        return new Hitmontop(s, e)
      case Pkm.MIMIKYU:
        return new Mimikyu(s, e)
      case Pkm.GRIMER:
        return new Grimer(s, e)
      case Pkm.MUK:
        return new Muk(s, e)
      case Pkm.ALOLAN_GRIMER:
        return new AlolanGrimer(s, e)
      case Pkm.ALOLAN_MUK:
        return new AlolanMuk(s, e)
      case Pkm.SHARPEDO:
        return new Sharpedo(s, e)
      case Pkm.PINECO:
        return new Pineco(s, e)
      case Pkm.FORRETRESS:
        return new Forretress(s, e)
      case Pkm.SEEL:
        return new Seel(s, e)
      case Pkm.DEWGONG:
        return new Dewgong(s, e)
      case Pkm.ALOLAN_GEODUDE:
        return new AlolanGeodude(s, e)
      case Pkm.ALOLAN_GRAVELER:
        return new AlolanGraveler(s, e)
      case Pkm.ALOLAN_GOLEM:
        return new AlolanGolem(s, e)
      case Pkm.EKANS:
        return new Ekans(s, e)
      case Pkm.ARBOK:
        return new Arbok(s, e)
      case Pkm.MIME_JR:
        return new MimeJr(s, e)
      case Pkm.MR_MIME:
        return new MrMime(s, e)
      case Pkm.ORIGIN_GIRATINA:
        return new OriginGiratina(s, e)
      case Pkm.PIROUETTE_MELOETTA:
        return new PirouetteMeloetta(s, e)
      case Pkm.MELMETAL:
        return new Melmetal(s, e)
      case Pkm.HOOPA:
        return new Hoopa(s, e)
      case Pkm.HOOPA_UNBOUND:
        return new HoopaUnbound(s, e)
      case Pkm.TYPE_NULL:
        return new TypeNull(s, e)
      case Pkm.SILVALLY:
        return new Sylvally(s, e)
      case Pkm.ZERAORA:
        return new Zeraora(s, e)
      case Pkm.XERNEAS:
        return new Xerneas(s, e)
      case Pkm.YVELTAL:
        return new Yveltal(s, e)
      case Pkm.MARSHADOW:
        return new Marshadow(s, e)
      case Pkm.HOOTHOOT:
        return new Hoothoot(s, e)
      case Pkm.NOCTOWL:
        return new Noctowl(s, e)
      case Pkm.BONSLEY:
        return new Bonsley(s, e)
      case Pkm.SUDOWOODO:
        return new Sudowoodo(s, e)
      case Pkm.COMBEE:
        return new Combee(s, e)
      case Pkm.VESPIQUEEN:
        return new Vespiqueen(s, e)
      case Pkm.SHUCKLE:
        return new Shuckle(s, e)
      case Pkm.TEPIG:
        return new Tepig(s, e)
      case Pkm.PIGNITE:
        return new Pignite(s, e)
      case Pkm.EMBOAR:
        return new Emboar(s, e)
      case Pkm.WYNAUT:
        return new Wynaut(s, e)
      case Pkm.WOBBUFFET:
        return new Wobbuffet(s, e)
      case Pkm.LUNATONE:
        return new Lunatone(s, e)
      case Pkm.SOLROCK:
        return new Solrock(s, e)
      case Pkm.POLIWRATH:
        return new Poliwrath(s, e)
      case Pkm.WURMPLE:
        return new Wurmple(s, e)
      case Pkm.SILCOON:
        return new Silcoon(s, e)
      case Pkm.BEAUTIFLY:
        return new Beautifly(s, e)
      case Pkm.CASCOON:
        return new Cascoon(s, e)
      case Pkm.DUSTOX:
        return new Dustox(s, e)
      case Pkm.TINKATINK:
        return new Tinkatink(s, e)
      case Pkm.TINKATUFF:
        return new Tinkatuff(s, e)
      case Pkm.TINKATON:
        return new Tinkaton(s, e)
      case Pkm.PARAS:
        return new Paras(s, e)
      case Pkm.PARASECT:
        return new Parasect(s, e)
      case Pkm.MILTANK:
        return new Miltank(s, e)
      case Pkm.MANKEY:
        return new Mankey(s, e)
      case Pkm.PRIMEAPE:
        return new Primeape(s, e)
      case Pkm.SUNKERN:
        return new Sunkern(s, e)
      case Pkm.SUNFLORA:
        return new Sunflora(s, e)
      case Pkm.MARACTUS:
        return new Maractus(s, e)
      case Pkm.PLUSLE:
        return new Plusle(s, e)
      case Pkm.MINUN:
        return new Minun(s, e)
      case Pkm.PINSIR:
        return new Pinsir(s, e)
      case Pkm.NATU:
        return new Natu(s, e)
      case Pkm.XATU:
        return new Xatu(s, e)
      case Pkm.GLIGAR:
        return new Gligar(s, e)
      case Pkm.GLISCOR:
        return new Gliscor(s, e)
      case Pkm.SHELLDER:
        return new Shellder(s, e)
      case Pkm.CLOYSTER:
        return new Cloyster(s, e)
      case Pkm.SENTRET:
        return new Sentret(s, e)
      case Pkm.FURRET:
        return new Furret(s, e)
      case Pkm.SPECTRIER:
        return new Spectrier(s, e)
      case Pkm.TORKOAL:
        return new Torkoal(s, e)
      case Pkm.DELIBIRD:
        return new Delibird(s, e)
      case Pkm.IRON_BUNDLE:
        return new IronBundle(s, e)
      case Pkm.KARTANA:
        return new Kartana(s, e)
      case Pkm.DEFAULT:
        return new Magikarp(s, e)
      default:
        logger.warn(`No pokemon with name "${name}" found, return magikarp`)
        return new Magikarp(s, e)
    }
  }

  static getPokemonRarityFromName(name: Pkm) {
    const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name)
    return pokemon.rarity
  }

  static createRandomEgg(): Pokemon {
    const egg = PokemonFactory.createPokemonFromName(Pkm.EGG)
    egg.action = PokemonActionState.SLEEP
    egg.evolution = pickRandomIn(HatchList)
    egg.evolutionTimer = EvolutionTime.EGG_HATCH
    return egg
  }

  static getRandomFossil(board: MapSchema<Pokemon>) {
    const currentFossils = new Array<Pkm>()
    board.forEach((p) => {
      if (p.types.includes(Synergy.FOSSIL)) {
        currentFossils.push(PkmFamily[p.name])
      }
    })
    const possibleFossils = (
      PRECOMPUTED_TYPE_POKEMONS[Synergy.FOSSIL].pokemons as Pkm[]
    ).filter((p) => {
      const pokemon = PokemonFactory.createPokemonFromName(p)
      return (
        currentFossils.includes(p) === false &&
        [Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.MYTHICAL].includes(
          pokemon.rarity
        ) === false
      )
    })

    if (possibleFossils.length > 0) {
      return pickRandomIn(possibleFossils)
    } else {
      return Pkm.CARBINK
    }
  }

  static getSellPrice(name: Pkm): number {
    const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name)
    if (name === Pkm.EGG) {
      return 2
    } else if (name === Pkm.MAGIKARP) {
      return 1
    } else if (pokemon.passive === Passive.UNOWN) {
      return 1
    } else if (pokemon.rarity === Rarity.HATCH) {
      return [3, 4, 5][pokemon.stars - 1]
    } else if (
      [Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.MYTHICAL].includes(
        pokemon.rarity
      )
    ) {
      const duo = Object.entries(PkmDuos).find(([key, duo]) =>
        duo.includes(pokemon.name)
      )
      return Math.ceil(
        (UniqueShop.includes(duo ? (duo[0] as PkmProposition) : name)
          ? 15
          : 20) * (duo ? 0.5 : 1)
      )
    } else if (PokemonFactory.getPokemonBaseEvolution(name) == Pkm.EEVEE) {
      return PkmCost[pokemon.rarity]
    } else {
      return PkmCost[pokemon.rarity] * pokemon.stars
    }
  }

  static getBuyPrice(name: Pkm): number {
    if (Unowns.includes(name)) {
      return 1
    } else {
      const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name)
      return PkmCost[pokemon.rarity]
    }
  }
}

export function isAdditionalPick(pkm: Pkm): boolean {
  const pokemon = PokemonFactory.createPokemonFromName(pkm)
  return pokemon.additional
}
