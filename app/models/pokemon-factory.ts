import {Pokemon, Bulbasaur, Abomasnow, Abra, Absol, Aegislash, Aerodactyl, Aggron, Alakazam, AlolanMarowak, Altaria, Amaura, Ampharos, Anorith, Arcanine, Arceus, Archen, Archeops, Armaldo, Aron, Articuno, Aurorus, Axew, Azelf, Azumarill, Azurill, Bagon, Banette, Bastiodon, Bayleef, Beedrill, Beldum, Bellossom, Bellsprout, Blastoise, Blaziken, Budew, Buneary, Butterfree, Camerupt, Carracosta, Carvanha, Castform, CastformHail, CastformRain, CastformSun, Caterpie, Celebi, Chandelure, Charizard, Charmander, Charmeleon, Chikorita, Chimchar, Clefable, Clefairy, Cleffa, Cobalion, Combusken, Cradily, Cranidos, Cresselia, Crobat, Croconaw, Cubone, Cyndaquil, Darkrai, Deino, Deoxys, Dialga, Ditto, Doublade, Dragonair, Dragonite, Dratini, Duosion, Dusclops, Dusknoir, Duskull, Eevee, Electabuzz, Electivire, Electrike, Elekid, Empoleon, Entei, Espeon, Exploud, Fearow, Feraligatr, Flabebe, Flaffy, Flareon, Fletchinder, Fletchling, Floette, Florges, Flygon, Fraxure, Froslass, Gabite, Garchomp, Gardevoir, Gastly, Gengar, Geodude, Gible, Giratina, Glaceon, Glalie, Gloom, Golbat, Golem, Graveler, Grotle, Groudon, Grovyle, Growlithe, Gyarados, HakamoO, Haunter, Haxorus, Heatran, Herdier, Honedge, HooH, Hoppip, Horsea, Houndour, Hydreigon, Igglybuff, Infernape, Ivysaur, JangmoO, Jigglypuff, Jirachi, Jolteon, Jumpluff, Kabuto, Kabutops, Kadabra, Kakuna, Keldeo, Kingdra, Kirlia, Klang, Klink, Klinklang, KommoO, Krookodile, Krookorok, Kyogre, Kyurem, Lairon, Lampent, Landorus, Lapras, Larvitar, Latias, Latios, Leafeon, Leavanny, Lileep, Lillipup, Litwick, Lombre, Lopunny, Lotad, Loudred, Lucario, Ludicolo, Lugia, Luxio, Luxray, Machamp, Machoke, Machop, Magby, Magikarp, Magmar, Magmortar, Magnemite, Magneton, Magnezone, Mamoswine, Manaphy, Manectric, Mareep, Marill, Marowak, Marshtomp, Medicham, Meditite, MegaAbomasnow, MegaAltaria, MegaBanette, MegaCamerupt, MegaLopunny, MegaLucario, MegaManectric, MegaMedicham, Meganium, MegaRayquaza, MegaScizor, MegaSteelix, Meloetta, Meowth, Mesprit, Metagross, Metang, Metapod, Mewtwo, Moltres, Monferno, Mudkip, Munchlax, Nidoking, Nidoqueen, NidoranF, NidoranM, Nidorina, Nidorino, Numel, Nuzleaf, Oddish, Omanyte, Omastar, Onix, Palkia, Palpitoad, Persian, Pichu, Pidgeot, Pidgeotto, Pidgey, Pikachu, Pikipek, Piloswine, Piplup, Politoed, Poliwag, Poliwhirl, Porygon, Porygon2, PorygonZ, PrimalGroudon, PrimalKyogre, Prinplup, Pupitar, Quilava, Raichu, Raikou, Ralts, Rampardos, Raticate, Rattata, Rayquaza, Regice, Regigigas, Regirock, Registeel, Reshiram, Reuniclus, Rhydon, Rhyhorn, Rhyperior, Riolu, Roselia, Roserade, Rotom, Salamence, Sandile, Sandshrew, Sceptile, Scizor, Scolipede, Scyther, Seadra, Sealeo, Seedot, Seismitoad, Sewaddle, Shaymin, Shelgon, Shieldon, Shiftry, Shinx, Shuppet, Skiploom, Slaking, Slakoth, Slowbro, Slowking, Slowpoke, Snorlax, Snorunt, Snover, Solosis, Spearow, Spheal, Spiritomb, Squirtle, Staraptor, Staravia, Starly, Steelix, Stoutland, Suicune, Swablu, Swadloon, Swampert, Swinub, Sylveon, Talonflame, Terrakion, Thundurus, Tirtouga, Togekiss, Togepi, Togetic, Torchic, Tornadus, Torterra, Totodile, Toucannon, Trapinch, Treecko, Trumbeak, Turtwig, Tympole, Typhlosion, Tyranitar, Tyrantrum, Tyrunt, Umbreon, Uxie, Vanillish, Vanillite, Vanilluxe, Vaporeon, Venipede, Venusaur, Vibrava, Victini, Victreebel, Vigoroth, Vileplume, Virizion, Volcarona, Walrein, Wartortle, Weedle, Weepinbell, Whirlipede, Whismur, Wigglytuff, Zapdos, Zekrom, Zubat, Zweilous} from './colyseus-models/pokemon';
import {PKM, TYPE} from './enum';
import Board from '../core/board';
import {AttackStrategy, BiteStrategy, BlastBurnStrategy, BlazeKickStrategy, BonemerangStrategy, BugBuzzStrategy, BurnStrategy, CalmMindStrategy, ChargeStrategy, ClangorousSoulStrategy, ConfusionStrategy, DarkPulseStrategy, DisarmingVoiceStrategy, DischargeStrategy, DracoMeteorStrategy, DragonBreathStrategy, DragonTailStrategy, EchoStrategy, ExplosionStrategy, FireBlastStrategy, FreezeStrategy, GrassWhistleStrategy, GrowlStrategy, GuillotineStrategy, HappyHourStrategy, HeadSmashStrategy, HealBlockStrategy, HeatWaveStrategy, HighJumpKickStrategy, HurricaneStrategy, HydroPumpStrategy, HyperVoiceStrategy, IcicleCrashStrategy, IronDefenseStrategy, IronTailStrategy, KingShieldStrategy, LeechLifeStrategy, MeteorMashStrategy, MetronomeStrategy, NastyPlotStrategy, NightmareStrategy, NightSlashStrategy, OriginPulseStrategy, PetalDanceStrategy, PoisonStingStrategy, PoisonStrategy, ProtectStrategy, RelicSongStrategy, RoarOfTimeStrategy, RockSlideStrategy, RockSmashStrategy, RockTombStrategy, RootStrategy, SeedFlareStrategy, SeismicTossStrategy, ShadowCloneStrategy, SilenceStrategy, SleepStrategy, SoakStrategy, StompStrategy, StunSporeStrategy, TeleportStrategy, ThiefStrategy, ThunderStrategy, TormentStrategy, TriAttackStrategy, VoltSwitchStrategy, WheelOfFireStrategy, WishStrategy} from '../core/attack-strategy';
import {MapSchema} from  '@colyseus/schema';
import {IPokemon, Emotion} from '../types';
import { IPokemonConfig } from './mongo-models/user-metadata';
import PRECOMPUTED_TYPE_POKEMONS from './precomputed/type-pokemons.json';
import { Ability } from '../types/enum/Ability'


export default class PokemonFactory {
  static getNeutralPokemonsByLevelStage(level: number): MapSchema<IPokemon> {
    const pokemons = new MapSchema<IPokemon>();
    switch (level) {
      case 1:{
        const magikarp1 = PokemonFactory.createPokemonFromName(PKM.MAGIKARP);
        magikarp1.positionX = 3;
        magikarp1.positionY = 1;
        const magikarp2 = PokemonFactory.createPokemonFromName(PKM.MAGIKARP);
        magikarp2.positionX = 5;
        magikarp2.positionY = 1;
        pokemons.set(magikarp1.id, magikarp1);
        pokemons.set(magikarp2.id, magikarp2);
        break;
      }

      case 2: {
        const rattata1 = PokemonFactory.createPokemonFromName(PKM.RATTATA);
        rattata1.positionX = 3;
        rattata1.positionY = 1;
        const rattata2 = PokemonFactory.createPokemonFromName(PKM.RATTATA);
        rattata2.positionX = 5;
        rattata2.positionY = 1;
        const raticate = PokemonFactory.createPokemonFromName(PKM.RATICATE);
        raticate.positionX = 4;
        raticate.positionY = 2;
        pokemons.set(rattata1.id, rattata1);
        pokemons.set(rattata2.id, rattata2);
        pokemons.set(raticate.id, raticate);
        break;
      }

      case 3: {
        const spearow1 = PokemonFactory.createPokemonFromName(PKM.SPEAROW);
        spearow1.positionX = 3;
        spearow1.positionY = 1;
        const spearow2 = PokemonFactory.createPokemonFromName(PKM.SPEAROW);
        spearow2.positionX = 5;
        spearow2.positionY = 1;
        const spearow3 = PokemonFactory.createPokemonFromName(PKM.SPEAROW);
        spearow3.positionX = 4;
        spearow3.positionY = 1;
        const fearow = PokemonFactory.createPokemonFromName(PKM.FEAROW);
        fearow.positionX = 4;
        fearow.positionY = 2;
        pokemons.set(spearow1.id, spearow1);
        pokemons.set(spearow2.id, spearow2);
        pokemons.set(spearow3.id, spearow3);
        pokemons.set(fearow.id, fearow);
        break;
      }

      case 10: {
        const gyarados = PokemonFactory.createPokemonFromName(PKM.GYARADOS);
        gyarados.positionX = 4;
        gyarados.positionY = 2;
        pokemons.set(gyarados.id, gyarados);
        break;
      }

      case 15: {
        const lugia = PokemonFactory.createPokemonFromName(PKM.LUGIA);
        lugia.positionX = 4;
        lugia.positionY = 2;
        pokemons.set(lugia.id, lugia);
        break;
      }


      case 20: {
        const giratina = PokemonFactory.createPokemonFromName(PKM.GIRATINA);
        giratina.positionX = 4;
        giratina.positionY = 2;
        pokemons.set(giratina.id, giratina);
        break;
      }


      case 25: {
        const zapdos = PokemonFactory.createPokemonFromName(PKM.ZAPDOS);
        zapdos.positionX = 2;
        zapdos.positionY = 2;
        pokemons.set(zapdos.id, zapdos);
        const moltres = PokemonFactory.createPokemonFromName(PKM.MOLTRES);
        moltres.positionX = 4;
        moltres.positionY = 2;
        pokemons.set(moltres.id, moltres);
        const articuno = PokemonFactory.createPokemonFromName(PKM.ARTICUNO);
        articuno.positionX = 6;
        articuno.positionY = 2;
        pokemons.set(articuno.id, articuno);
        break;
      }


      case 30: {
        const dialga = PokemonFactory.createPokemonFromName(PKM.DIALGA);
        dialga.positionX = 2;
        dialga.positionY = 2;
        pokemons.set(dialga.id, dialga);
        const palkia = PokemonFactory.createPokemonFromName(PKM.PALKIA);
        palkia.positionX = 6;
        palkia.positionY = 2;
        pokemons.set(palkia.id, palkia);
        break;
      }


      case 35: {
        const suicune = PokemonFactory.createPokemonFromName(PKM.SUICUNE);
        suicune.positionX = 2;
        suicune.positionY = 2;
        pokemons.set(suicune.id, suicune);
        const raikou = PokemonFactory.createPokemonFromName(PKM.RAIKOU);
        raikou.positionX = 4;
        raikou.positionY = 2;
        pokemons.set(raikou.id, raikou);
        const entei = PokemonFactory.createPokemonFromName(PKM.ENTEI);
        entei.positionX = 6;
        entei.positionY = 2;
        pokemons.set(entei.id, entei);
        break;
      }


      case 40: {
        const regice = PokemonFactory.createPokemonFromName(PKM.REGICE);
        regice.positionX = 2;
        regice.positionY = 3;
        pokemons.set(regice.id, regice);
        const regirock = PokemonFactory.createPokemonFromName(PKM.REGIROCK);
        regirock.positionX = 4;
        regirock.positionY = 3;
        pokemons.set(regirock.id, regirock);
        const registeel = PokemonFactory.createPokemonFromName(PKM.REGISTEEL);
        registeel.positionX = 6;
        registeel.positionY = 3;
        pokemons.set(registeel.id, registeel);
        const regigigas = PokemonFactory.createPokemonFromName(PKM.REGIGIGAS);
        regigigas.positionX = 4;
        regigigas.positionY = 1;
        pokemons.set(regigigas.id, regigigas);
        break;
      }


      default: {
        const kyogre = PokemonFactory.createPokemonFromName(PKM.KYOGRE);
        kyogre.positionX = 2;
        kyogre.positionY = 2;
        pokemons.set(kyogre.id, kyogre);
        const groudon = PokemonFactory.createPokemonFromName(PKM.GROUDON);
        groudon.positionX = 4;
        groudon.positionY = 2;
        pokemons.set(groudon.id, groudon);
        const rayquaza = PokemonFactory.createPokemonFromName(PKM.RAYQUAZA);
        rayquaza.positionX = 6;
        rayquaza.positionY = 2;
        pokemons.set(rayquaza.id, rayquaza);
        break;
      }
    }
    return pokemons;
  }

  static createStrategyFromName(name: Ability) {
    switch (name) {
      case Ability.KING_SHIELD:
        return new KingShieldStrategy();

      case Ability.EXPLOSION:
        return new ExplosionStrategy();

      case Ability.NIGHTMARE:
        return new NightmareStrategy();

      case Ability.CLANGOROUS_SOUL:
        return new ClangorousSoulStrategy();

      case Ability.BONEMERANG:
        return new BonemerangStrategy();

      case Ability.GROWL:
        return new GrowlStrategy();

      case Ability.RELIC_SONG:
        return new RelicSongStrategy();

      case Ability.DISARMING_VOICE:
        return new DisarmingVoiceStrategy();

      case Ability.HIGH_JUMP_KICK:
        return new HighJumpKickStrategy();

      case Ability.GRASS_WHISTLE:
        return new GrassWhistleStrategy();

      case Ability.TRI_ATTACK:
        return new TriAttackStrategy();

      case Ability.ECHO:
        return new EchoStrategy();

      case Ability.PETAL_DANCE:
        return new PetalDanceStrategy();

      case Ability.HYPER_VOICE:
        return new HyperVoiceStrategy();

      case Ability.SHADOW_CLONE:
        return new ShadowCloneStrategy();

      case Ability.VOLT_SWITCH:
        return new VoltSwitchStrategy();

      case Ability.FIRE_BLAST:
        return new FireBlastStrategy();

      case Ability.WHEEL_OF_FIRE:
        return new WheelOfFireStrategy();

      case Ability.SEISMIC_TOSS:
        return new SeismicTossStrategy();

      case Ability.GUILLOTINE:
        return new GuillotineStrategy();

      case Ability.ROCK_SLIDE:
        return new RockSlideStrategy();

      case Ability.HEAT_WAVE:
        return new HeatWaveStrategy();

      case Ability.THUNDER:
        return new ThunderStrategy();

      case Ability.HYDRO_PUMP:
        return new HydroPumpStrategy();

      case Ability.DRACO_METEOR:
        return new DracoMeteorStrategy();

      case Ability.BLAZE_KICK:
        return new BlazeKickStrategy();

      case Ability.WISH:
        return new WishStrategy();

      case Ability.CALM_MIND:
        return new CalmMindStrategy();

      case Ability.IRON_DEFENSE:
        return new IronDefenseStrategy();

      case Ability.METRONOME:
        return new MetronomeStrategy();

      case Ability.SOAK:
        return new SoakStrategy();

      case Ability.IRON_TAIL:
        return new IronTailStrategy();

      case Ability.BLAST_BURN:
        return new BlastBurnStrategy();

      case Ability.CHARGE:
        return new ChargeStrategy();

      case Ability.DISCHARGE:
        return new DischargeStrategy();

      case Ability.BITE:
        return new BiteStrategy();

      case Ability.DRAGON_TAIL:
        return new DragonTailStrategy();

      case Ability.DRAGON_BREATH:
        return new DragonBreathStrategy();

      case Ability.ICICLE_CRASH:
        return new IcicleCrashStrategy();

      case Ability.ROOT:
        return new RootStrategy();

      case Ability.TORMENT:
        return new TormentStrategy();

      case Ability.STOMP:
        return new StompStrategy();

      case Ability.DARK_PULSE:
        return new DarkPulseStrategy();

      case Ability.NIGHT_SLASH:
        return new NightSlashStrategy();

      case Ability.BUG_BUZZ:
        return new BugBuzzStrategy();

      case Ability.POISON_STING:
        return new PoisonStingStrategy();

      case Ability.LEECH_LIFE:
        return new LeechLifeStrategy();

      case Ability.HAPPY_HOUR:
        return new HappyHourStrategy();

      case Ability.TELEPORT:
        return new TeleportStrategy();

      case Ability.NASTY_PLOT:
        return new NastyPlotStrategy();

      case Ability.THIEF:
        return new ThiefStrategy();

      case Ability.STUN_SPORE:
        return new StunSporeStrategy();

      case Ability.METEOR_MASH:
        return new MeteorMashStrategy();

      case Ability.HURRICANE:
        return new HurricaneStrategy();

      case Ability.BURN:
        return new BurnStrategy();

      case Ability.SLEEP:
        return new SleepStrategy();

      case Ability.SILENCE:
        return new SilenceStrategy();

      case Ability.CONFUSION:
        return new ConfusionStrategy();

      case Ability.FREEZE:
        return new FreezeStrategy();

      case Ability.PROTECT:
        return new ProtectStrategy();

      case Ability.POISON:
        return new PoisonStrategy();

      case Ability.ORIGIN_PULSE:
        return new OriginPulseStrategy();

      case Ability.SEED_FLARE:
        return new SeedFlareStrategy();

      case Ability.HEAL_BLOCK:
        return new HealBlockStrategy();

      case Ability.ROAR_OF_TIME:
        return new RoarOfTimeStrategy();

      case Ability.ROCK_TOMB:
        return new RockTombStrategy();

      case Ability.ROCK_SMASH:
        return new RockSmashStrategy();

      case Ability.HEAD_SMASH:
        return new HeadSmashStrategy();

      case Ability.DEFAULT:
        return new AttackStrategy();

      default:
        return new AttackStrategy();
    }
  }

  // transforms a pokemon into another pokemon,
  // transferring its items and position to
  // the new pokemon
  static transformPokemon(before: Pokemon, afterName: string) {
    const transformation = this.createPokemonFromName(afterName);
    transformation.positionX = before.positionX;
    transformation.positionY = before.positionY;
    transformation.items = before.items;
    return transformation;
  }

  static getPokemonBaseEvolution(name: string) {
    switch (name) {
      case PKM.VAPOREON:
        return PKM.EEVEE;
      case PKM.JOLTEON:
        return PKM.EEVEE;
      case PKM.FLAREON:
        return PKM.EEVEE;
      case PKM.ESPEON:
        return PKM.EEVEE;
      case PKM.UMBREON:
        return PKM.EEVEE;
      case PKM.LEAFEON:
        return PKM.EEVEE;
      case PKM.SYLVEON:
        return PKM.EEVEE;
      case PKM.GLACEON:
        return PKM.EEVEE;
      default:
        return this.getPokemonFamily(name);
    }
  }

  static getPokemonFamily(name: string) {
    switch (name) {
      case PKM.BULBASAUR:
        return PKM.BULBASAUR;
      case PKM.IVYSAUR:
        return PKM.BULBASAUR;
      case PKM.VENUSAUR:
        return PKM.BULBASAUR;
      case PKM.CHARMANDER:
        return PKM.CHARMANDER;
      case PKM.CHARMELEON:
        return PKM.CHARMANDER;
      case PKM.CHARIZARD:
        return PKM.CHARMANDER;
      case PKM.SQUIRTLE:
        return PKM.SQUIRTLE;
      case PKM.WARTORTLE:
        return PKM.SQUIRTLE;
      case PKM.BLASTOISE:
        return PKM.SQUIRTLE;
      case PKM.SLOWPOKE:
        return PKM.SLOWPOKE;
      case PKM.SLOWBRO:
        return PKM.SLOWPOKE;
      case PKM.SLOWKING:
        return PKM.SLOWPOKE;
      case PKM.GEODUDE:
        return PKM.GEODUDE;
      case PKM.GRAVELER:
        return PKM.GEODUDE;
      case PKM.GOLEM:
        return PKM.GEODUDE;
      case PKM.AZURILL:
        return PKM.AZURILL;
      case PKM.MARILL:
        return PKM.AZURILL;
      case PKM.AZUMARILL:
        return PKM.AZURILL;
      case PKM.ZUBAT:
        return PKM.ZUBAT;
      case PKM.GOLBAT:
        return PKM.ZUBAT;
      case PKM.CROBAT:
        return PKM.ZUBAT;
      case PKM.AMPHAROS:
        return PKM.MAREEP;
      case PKM.MAREEP:
        return PKM.MAREEP;
      case PKM.FLAFFY:
        return PKM.MAREEP;
      case PKM.CLEFFA:
        return PKM.CLEFFA;
      case PKM.CLEFAIRY:
        return PKM.CLEFFA;
      case PKM.CLEFABLE:
        return PKM.CLEFFA;
      case PKM.IGGLYBUFF:
        return PKM.IGGLYBUFF;
      case PKM.JIGGLYPUFF:
        return PKM.IGGLYBUFF;
      case PKM.WIGGLYTUFF:
        return PKM.IGGLYBUFF;
      case PKM.CATERPIE:
        return PKM.CATERPIE;
      case PKM.METAPOD:
        return PKM.CATERPIE;
      case PKM.BUTTERFREE:
        return PKM.CATERPIE;
      case PKM.WEEDLE:
        return PKM.WEEDLE;
      case PKM.KAKUNA:
        return PKM.WEEDLE;
      case PKM.BEEDRILL:
        return PKM.WEEDLE;
      case PKM.PIDGEY:
        return PKM.PIDGEY;
      case PKM.PIDGEOTTO:
        return PKM.PIDGEY;
      case PKM.PIDGEOT:
        return PKM.PIDGEY;
      case PKM.HOPPIP:
        return PKM.HOPPIP;
      case PKM.SKIPLOOM:
        return PKM.HOPPIP;
      case PKM.JUMPLUFF:
        return PKM.HOPPIP;
      case PKM.SEEDOT:
        return PKM.SEEDOT;
      case PKM.NUZLEAF:
        return PKM.SEEDOT;
      case PKM.SHIFTRY:
        return PKM.SEEDOT;
      case PKM.STARLY:
        return PKM.STARLY;
      case PKM.STARAVIA:
        return PKM.STARLY;
      case PKM.STARAPTOR:
        return PKM.STARLY;
      case PKM.CHIKORITA:
        return PKM.CHIKORITA;
      case PKM.BAYLEEF:
        return PKM.CHIKORITA;
      case PKM.MEGANIUM:
        return PKM.CHIKORITA;
      case PKM.CYNDAQUIL:
        return PKM.CYNDAQUIL;
      case PKM.QUILAVA:
        return PKM.CYNDAQUIL;
      case PKM.TYPHLOSION:
        return PKM.CYNDAQUIL;
      case PKM.TOTODILE:
        return PKM.TOTODILE;
      case PKM.CROCONAW:
        return PKM.TOTODILE;
      case PKM.FERALIGATR:
        return PKM.TOTODILE;
      case PKM.TREECKO:
        return PKM.TREECKO;
      case PKM.GROVYLE:
        return PKM.TREECKO;
      case PKM.SCEPTILE:
        return PKM.TREECKO;
      case PKM.TORCHIC:
        return PKM.TORCHIC;
      case PKM.COMBUSKEN:
        return PKM.TORCHIC;
      case PKM.BLAZIKEN:
        return PKM.TORCHIC;
      case PKM.MUDKIP:
        return PKM.MUDKIP;
      case PKM.MARSHTOMP:
        return PKM.MUDKIP;
      case PKM.SWAMPERT:
        return PKM.MUDKIP;
      case PKM.TURTWIG:
        return PKM.TURTWIG;
      case PKM.GROTLE:
        return PKM.TURTWIG;
      case PKM.TORTERRA:
        return PKM.TURTWIG;
      case PKM.CHIMCHAR:
        return PKM.CHIMCHAR;
      case PKM.MONFERNO:
        return PKM.CHIMCHAR;
      case PKM.INFERNAPE:
        return PKM.CHIMCHAR;
      case PKM.PIPLUP:
        return PKM.PIPLUP;
      case PKM.PRINPLUP:
        return PKM.PIPLUP;
      case PKM.EMPOLEON:
        return PKM.PIPLUP;
      case PKM.NIDORANF:
        return PKM.NIDORANF;
      case PKM.NIDORINA:
        return PKM.NIDORANF;
      case PKM.NIDOQUEEN:
        return PKM.NIDORANF;
      case PKM.NIDORANM:
        return PKM.NIDORANM;
      case PKM.NIDORINO:
        return PKM.NIDORANM;
      case PKM.NIDOKING:
        return PKM.NIDORANM;
      case PKM.PICHU:
        return PKM.PICHU;
      case PKM.PIKACHU:
        return PKM.PICHU;
      case PKM.RAICHU:
        return PKM.PICHU;
      case PKM.MACHOP:
        return PKM.MACHOP;
      case PKM.MACHOKE:
        return PKM.MACHOP;
      case PKM.MACHAMP:
        return PKM.MACHOP;
      case PKM.HORSEA:
        return PKM.HORSEA;
      case PKM.SEADRA:
        return PKM.HORSEA;
      case PKM.KINGDRA:
        return PKM.HORSEA;
      case PKM.TRAPINCH:
        return PKM.TRAPINCH;
      case PKM.VIBRAVA:
        return PKM.TRAPINCH;
      case PKM.FLYGON:
        return PKM.TRAPINCH;
      case PKM.SPHEAL:
        return PKM.SPHEAL;
      case PKM.SEALEO:
        return PKM.SPHEAL;
      case PKM.WALREIN:
        return PKM.SPHEAL;
      case PKM.ARON:
        return PKM.ARON;
      case PKM.LAIRON:
        return PKM.ARON;
      case PKM.AGGRON:
        return PKM.ARON;
      case PKM.MAGNEMITE:
        return PKM.MAGNEMITE;
      case PKM.MAGNETON:
        return PKM.MAGNEMITE;
      case PKM.MAGNEZONE:
        return PKM.MAGNEMITE;
      case PKM.RHYHORN:
        return PKM.RHYHORN;
      case PKM.RHYDON:
        return PKM.RHYHORN;
      case PKM.RHYPERIOR:
        return PKM.RHYHORN;
      case PKM.TOGEPI:
        return PKM.TOGEPI;
      case PKM.TOGETIC:
        return PKM.TOGEPI;
      case PKM.TOGEKISS:
        return PKM.TOGEPI;
      case PKM.DUSKULL:
        return PKM.DUSKULL;
      case PKM.DUSCLOPS:
        return PKM.DUSKULL;
      case PKM.DUSKNOIR:
        return PKM.DUSKULL;
      case PKM.LOTAD:
        return PKM.LOTAD;
      case PKM.LOMBRE:
        return PKM.LOTAD;
      case PKM.LUDICOLO:
        return PKM.LOTAD;
      case PKM.SHINX:
        return PKM.SHINX;
      case PKM.LUXIO:
        return PKM.SHINX;
      case PKM.LUXRAY:
        return PKM.SHINX;
      case PKM.POLIWAG:
        return PKM.POLIWAG;
      case PKM.POLIWHIRL:
        return PKM.POLIWAG;
      case PKM.POLITOED:
        return PKM.POLIWAG;
      case PKM.ABRA:
        return PKM.ABRA;
      case PKM.KADABRA:
        return PKM.ABRA;
      case PKM.ALAKAZAM:
        return PKM.ABRA;
      case PKM.GASTLY:
        return PKM.GASTLY;
      case PKM.HAUNTER:
        return PKM.GASTLY;
      case PKM.GENGAR:
        return PKM.GASTLY;
      case PKM.DRATINI:
        return PKM.DRATINI;
      case PKM.DRAGONAIR:
        return PKM.DRATINI;
      case PKM.DRAGONITE:
        return PKM.DRATINI;
      case PKM.LARVITAR:
        return PKM.LARVITAR;
      case PKM.PUPITAR:
        return PKM.LARVITAR;
      case PKM.TYRANITAR:
        return PKM.LARVITAR;
      case PKM.SLAKOTH:
        return PKM.SLAKOTH;
      case PKM.VIGOROTH:
        return PKM.SLAKOTH;
      case PKM.SLAKING:
        return PKM.SLAKOTH;
      case PKM.RALTS:
        return PKM.RALTS;
      case PKM.KIRLIA:
        return PKM.RALTS;
      case PKM.GARDEVOIR:
        return PKM.RALTS;
      case PKM.BAGON:
        return PKM.BAGON;
      case PKM.SHELGON:
        return PKM.BAGON;
      case PKM.SALAMENCE:
        return PKM.BAGON;
      case PKM.BELDUM:
        return PKM.BELDUM;
      case PKM.METANG:
        return PKM.BELDUM;
      case PKM.METAGROSS:
        return PKM.BELDUM;
      case PKM.GIBLE:
        return PKM.GIBLE;
      case PKM.GABITE:
        return PKM.GIBLE;
      case PKM.GARCHOMP:
        return PKM.GIBLE;
      case PKM.ELEKID:
        return PKM.ELEKID;
      case PKM.ELECTABUZZ:
        return PKM.ELEKID;
      case PKM.ELECTIVIRE:
        return PKM.ELEKID;
      case PKM.MAGBY:
        return PKM.MAGBY;
      case PKM.MAGMAR:
        return PKM.MAGBY;
      case PKM.MAGMORTAR:
        return PKM.MAGBY;
      case PKM.MUNCHLAX:
        return PKM.MUNCHLAX;
      case PKM.SNORLAX:
        return PKM.MUNCHLAX;
      case PKM.GROWLITHE:
        return PKM.GROWLITHE;
      case PKM.ARCANINE:
        return PKM.GROWLITHE;
      case PKM.ONIX:
        return PKM.ONIX;
      case PKM.STEELIX:
        return PKM.ONIX;
      case PKM.MEGASTEELIX:
        return PKM.ONIX;
      case PKM.SCYTHER:
        return PKM.SCYTHER;
      case PKM.SCIZOR:
        return PKM.SCYTHER;
      case PKM.MEGASCIZOR:
        return PKM.SCYTHER;
      case PKM.RIOLU:
        return PKM.RIOLU;
      case PKM.LUCARIO:
        return PKM.RIOLU;
      case PKM.MEGALUCARIO:
        return PKM.RIOLU;
      case PKM.EEVEE:
        return PKM.EEVEE;
      case PKM.VAPOREON:
        return PKM.VAPOREON;
      case PKM.JOLTEON:
        return PKM.JOLTEON;
      case PKM.FLAREON:
        return PKM.FLAREON;
      case PKM.ESPEON:
        return PKM.ESPEON;
      case PKM.UMBREON:
        return PKM.UMBREON;
      case PKM.LEAFEON:
        return PKM.LEAFEON;
      case PKM.SYLVEON:
        return PKM.SYLVEON;
      case PKM.GLACEON:
        return PKM.GLACEON;
      case PKM.MEDITITE:
        return PKM.MEDITITE;
      case PKM.MEDICHAM:
        return PKM.MEDITITE;
      case PKM.MEGAMEDICHAM:
        return PKM.MEDITITE;
      case PKM.NUMEL:
        return PKM.NUMEL;
      case PKM.CAMERUPT:
        return PKM.NUMEL;
      case PKM.MEGACAMERUPT:
        return PKM.NUMEL;
      case PKM.DITTO:
        return PKM.DITTO;
      case PKM.SANDSHREW:
        return PKM.SANDSHREW;
      case PKM.DARKRAI:
        return PKM.DARKRAI;
      case PKM.LITWICK:
        return PKM.LITWICK;
      case PKM.LAMPENT:
        return PKM.LITWICK;
      case PKM.CHANDELURE:
        return PKM.LITWICK;
      case PKM.BELLSPROUT:
        return PKM.BELLSPROUT;
      case PKM.WEEPINBELL:
        return PKM.BELLSPROUT;
      case PKM.VICTREEBEL:
        return PKM.BELLSPROUT;
      case PKM.SWINUB:
        return PKM.SWINUB;
      case PKM.PILOSWINE:
        return PKM.SWINUB;
      case PKM.MAMOSWINE:
        return PKM.SWINUB;
      case PKM.SNORUNT:
        return PKM.SNORUNT;
      case PKM.GLALIE:
        return PKM.SNORUNT;
      case PKM.FROSLASS:
        return PKM.SNORUNT;
      case PKM.SNOVER:
        return PKM.SNOVER;
      case PKM.ABOMASNOW:
        return PKM.SNOVER;
      case PKM.MEGAABOMASNOW:
        return PKM.SNOVER;
      case PKM.VANILLITE:
        return PKM.VANILLITE;
      case PKM.VANILLISH:
        return PKM.VANILLITE;
      case PKM.VANILLUXE:
        return PKM.VANILLITE;
      case PKM.VOLCARONA:
        return PKM.VOLCARONA;
      case PKM.LANDORUS:
        return PKM.LANDORUS;
      case PKM.TORNADUS:
        return PKM.TORNADUS;
      case PKM.THUNDURUS:
        return PKM.THUNDURUS;
      case PKM.KELDEO:
        return PKM.KELDEO;
      case PKM.TERRAKION:
        return PKM.TERRAKION;
      case PKM.VIRIZION:
        return PKM.VIRIZION;
      case PKM.COBALION:
        return PKM.COBALION;
      case PKM.MANAPHY:
        return PKM.MANAPHY;
      case PKM.ROTOM:
        return PKM.ROTOM;
      case PKM.SPIRITOMB:
        return PKM.SPIRITOMB;
      case PKM.ABSOL:
        return PKM.ABSOL;
      case PKM.LAPRAS:
        return PKM.LAPRAS;
      case PKM.LATIAS:
        return PKM.LATIAS;
      case PKM.LATIOS:
        return PKM.LATIOS;
      case PKM.MESPRIT:
        return PKM.MESPRIT;
      case PKM.AZELF:
        return PKM.AZELF;
      case PKM.UXIE:
        return PKM.UXIE;
      case PKM.MEWTWO:
        return PKM.MEWTWO;
      case PKM.KYUREM:
        return PKM.KYUREM;
      case PKM.RESHIRAM:
        return PKM.RESHIRAM;
      case PKM.ZEKROM:
        return PKM.ZEKROM;
      case PKM.CELEBI:
        return PKM.CELEBI;
      case PKM.VICTINI:
        return PKM.VICTINI;
      case PKM.JIRACHI:
        return PKM.JIRACHI;
      case PKM.ARCEUS:
        return PKM.ARCEUS;
      case PKM.DEOXYS:
        return PKM.DEOXYS;
      case PKM.SHAYMIN:
        return PKM.SHAYMIN;
      case PKM.CRESSELIA:
        return PKM.CRESSELIA;
      case PKM.HEATRAN:
        return PKM.HEATRAN;
      case PKM.HOOH:
        return PKM.HOOH;
      case PKM.REGICE:
        return PKM.REGICE;
      case PKM.REGISTEEL:
        return PKM.REGISTEEL;
      case PKM.REGIROCK:
        return PKM.REGIROCK;
      case PKM.ARTICUNO:
        return PKM.ARTICUNO;
      case PKM.ZAPDOS:
        return PKM.ZAPDOS;
      case PKM.MOLTRES:
        return PKM.MOLTRES;
      case PKM.AERODACTYL:
        return PKM.AERODACTYL;
      case PKM.GROUDON:
        return PKM.GROUDON;
      case PKM.KYOGRE:
        return PKM.KYOGRE;
      case PKM.RAYQUAZA:
        return PKM.RAYQUAZA;
      case PKM.MEGARAYQUAZA:
        return PKM.MEGARAYQUAZA;
      case PKM.PALKIA:
        return PKM.PALKIA;
      case PKM.DIALGA:
        return PKM.DIALGA;
      case PKM.GIRATINA:
        return PKM.GIRATINA;
      case PKM.SUICUNE:
        return PKM.SUICUNE;
      case PKM.ENTEI:
        return PKM.ENTEI;
      case PKM.RAIKOU:
        return PKM.RAIKOU;
      case PKM.REGIGIGAS:
        return PKM.REGIGIGAS;
      case PKM.MAGIKARP:
        return PKM.MAGIKARP;
      case PKM.GYARADOS:
        return PKM.GYARADOS;
      case PKM.RATTATA:
        return PKM.RATTATA;
      case PKM.RATICATE:
        return PKM.RATTATA;
      case PKM.LUGIA:
        return PKM.LUGIA;
      case PKM.CARVANHA:
        return PKM.CARVANHA;
      case PKM.HOUNDOUR:
        return PKM.HOUNDOUR;
      case PKM.SWABLU:
        return PKM.SWABLU;
      case PKM.PRIMALGROUDON:
        return PKM.GROUDON;
      case PKM.PRIMALKYOGRE:
        return PKM.KYOGRE;
      case PKM.FEAROW:
        return PKM.SPEAROW;
      case PKM.SPEAROW:
        return PKM.SPEAROW;
      case PKM.MEOWTH:
        return PKM.MEOWTH;
      case PKM.PERSIAN:
        return PKM.MEOWTH;
      case PKM.DEINO:
        return PKM.DEINO;
      case PKM.ZWEILOUS:
        return PKM.DEINO;
      case PKM.HYDREIGON:
        return PKM.DEINO;
      case PKM.SANDILE:
        return PKM.SANDILE;
      case PKM.KROKOROK:
        return PKM.SANDILE;
      case PKM.KROOKODILE:
        return PKM.SANDILE;
      case PKM.SOLOSIS:
        return PKM.SOLOSIS;
      case PKM.DUOSION:
        return PKM.SOLOSIS;
      case PKM.REUNICLUS:
        return PKM.SOLOSIS;
      case PKM.ODDISH:
        return PKM.ODDISH;
      case PKM.GLOOM:
        return PKM.ODDISH;
      case PKM.VILEPLUME:
        return PKM.ODDISH;
      case PKM.BELLOSSOM:
        return PKM.ODDISH;
      case PKM.AMAURA:
        return PKM.AMAURA;
      case PKM.AURORUS:
        return PKM.AMAURA;
      case PKM.ANORITH:
        return PKM.ANORITH;
      case PKM.ARMALDO:
        return PKM.ANORITH;
      case PKM.ARCHEN:
        return PKM.ARCHEN;
      case PKM.ARCHEOPS:
        return PKM.ARCHEN;
      case PKM.SHIELDON:
        return PKM.SHIELDON;
      case PKM.BASTIODON:
        return PKM.SHIELDON;
      case PKM.TIRTOUGA:
        return PKM.TIRTOUGA;
      case PKM.CARRACOSTA:
        return PKM.TIRTOUGA;
      case PKM.LILEEP:
        return PKM.LILEEP;
      case PKM.CRADILY:
        return PKM.LILEEP;
      case PKM.KABUTO:
        return PKM.KABUTO;
      case PKM.KABUTOPS:
        return PKM.KABUTO;
      case PKM.OMANYTE:
        return PKM.OMANYTE;
      case PKM.OMASTAR:
        return PKM.OMANYTE;
      case PKM.CRANIDOS:
        return PKM.CRANIDOS;
      case PKM.RAMPARDOS:
        return PKM.CRANIDOS;
      case PKM.TYRUNT:
        return PKM.TYRUNT;
      case PKM.TYRANTRUM:
        return PKM.TYRUNT;
      case PKM.BUDEW:
        return PKM.BUDEW;
      case PKM.ROSELIA:
        return PKM.BUDEW;
      case PKM.ROSERADE:
        return PKM.BUDEW;
      case PKM.BUNEARY:
        return PKM.BUNEARY;
      case PKM.LOPUNNY:
        return PKM.BUNEARY;
      case PKM.MEGALOPUNNY:
        return PKM.BUNEARY;
      case PKM.AXEW:
        return PKM.AXEW;
      case PKM.FRAXURE:
        return PKM.AXEW;
      case PKM.HAXORUS:
        return PKM.AXEW;
      case PKM.VENIPEDE:
        return PKM.VENIPEDE;
      case PKM.WHIRLIPEDE:
        return PKM.VENIPEDE;
      case PKM.SCOLIPEDE:
        return PKM.VENIPEDE;
      case PKM.PORYGON:
        return PKM.PORYGON;
      case PKM.PORYGON2:
        return PKM.PORYGON;
      case PKM.PORYGONZ:
        return PKM.PORYGON;
      case PKM.KLINK:
        return PKM.KLINK;
      case PKM.KLANG:
        return PKM.KLINK;
      case PKM.KLINKLANG:
        return PKM.KLINK;
      case PKM.ELECTRIKE:
        return PKM.ELECTRIKE;
      case PKM.MANECTRIC:
        return PKM.ELECTRIKE;
      case PKM.MEGAMANECTRIC:
        return PKM.ELECTRIKE;
      case PKM.SHUPPET:
        return PKM.SHUPPET;
      case PKM.BANETTE:
        return PKM.SHUPPET;
      case PKM.MEGABANETTE:
        return PKM.SHUPPET;
      case PKM.HONEDGE:
        return PKM.HONEDGE;
      case PKM.DOUBLADE:
        return PKM.HONEDGE;
      case PKM.AEGISLASH:
        return PKM.HONEDGE;
      case PKM.CUBONE:
        return PKM.CUBONE;
      case PKM.MAROWAK:
        return PKM.CUBONE;
      case PKM.ALOLANMAROWAK:
        return PKM.CUBONE;
      case PKM.FLETCHLING:
        return PKM.FLETCHLING;
      case PKM.FLETCHINDER:
        return PKM.FLETCHLING;
      case PKM.TALONFLAME:
        return PKM.FLETCHLING;
      case PKM.WHISMUR:
        return PKM.WHISMUR;
      case PKM.LOUDRED:
        return PKM.WHISMUR;
      case PKM.EXPLOUD:
        return PKM.WHISMUR;
      case PKM.TYMPOLE:
        return PKM.TYMPOLE;
      case PKM.PALPITOAD:
        return PKM.TYMPOLE;
      case PKM.SEISMITOAD:
        return PKM.TYMPOLE;
      case PKM.SEWADDLE:
        return PKM.SEWADDLE;
      case PKM.SWADLOON:
        return PKM.SEWADDLE;
      case PKM.LEAVANNY:
        return PKM.SEWADDLE;
      case PKM.PIKIPEK:
        return PKM.PIKIPEK;
      case PKM.TRUMBEAK:
        return PKM.PIKIPEK;
      case PKM.TOUCANNON:
        return PKM.PIKIPEK;
      case PKM.FLABEBE:
        return PKM.FLABEBE;
      case PKM.FLOETTE:
        return PKM.FLABEBE;
      case PKM.FLORGES:
        return PKM.FLABEBE;
      case PKM.JANGMOO:
        return PKM.JANGMOO;
      case PKM.HAKAMOO:
        return PKM.JANGMOO;
      case PKM.KOMMOO:
        return PKM.JANGMOO;
      case PKM.MELOETTA:
        return PKM.MELOETTA;
      case PKM.ALTARIA:
        return PKM.SWABLU;
      case PKM.MEGAALTARIA:
        return PKM.SWABLU;
      case PKM.LILLIPUP:
        return PKM.LILLIPUP;
      case PKM.HERDIER:
        return PKM.LILLIPUP;
      case PKM.STOUTLAND:
        return PKM.LILLIPUP;
      case PKM.CASTFORM:
        return PKM.CASTFORM;
      case PKM.CASTFORMSUN:
        return PKM.CASTFORMSUN;
      case PKM.CASTFORMRAIN:
        return PKM.CASTFORMRAIN;
      case PKM.CASTFORMHAIL:
        return PKM.CASTFORMHAIL;
      default:
        console.log(`No pokemon with name "${name}" found`);
        break;
    }
  }

  static createPokemonFromName(name: string, config?: IPokemonConfig) {
    const s = config && config.selectedShiny ? true: false;
    const e = config && config.selectedEmotion ? config.selectedEmotion: Emotion.NORMAL;
    switch (name) {
      case PKM.BULBASAUR:
        return new Bulbasaur(s,e);
      case PKM.IVYSAUR:
        return new Ivysaur(s,e);
      case PKM.VENUSAUR:
        return new Venusaur(s,e);
      case PKM.CHARMANDER:
        return new Charmander(s,e);
      case PKM.CHARMELEON:
        return new Charmeleon(s,e);
      case PKM.CHARIZARD:
        return new Charizard(s,e);
      case PKM.SQUIRTLE:
        return new Squirtle(s,e);
      case PKM.WARTORTLE:
        return new Wartortle(s,e);
      case PKM.BLASTOISE:
        return new Blastoise(s,e);
      case PKM.SLOWPOKE:
        return new Slowpoke(s,e);
      case PKM.SLOWBRO:
        return new Slowbro(s,e);
      case PKM.SLOWKING:
        return new Slowking(s,e);
      case PKM.GEODUDE:
        return new Geodude(s,e);
      case PKM.GRAVELER:
        return new Graveler(s,e);
      case PKM.GOLEM:
        return new Golem(s,e);
      case PKM.AZURILL:
        return new Azurill(s,e);
      case PKM.MARILL:
        return new Marill(s,e);
      case PKM.AZUMARILL:
        return new Azumarill(s,e);
      case PKM.ZUBAT:
        return new Zubat(s,e);
      case PKM.GOLBAT:
        return new Golbat(s,e);
      case PKM.CROBAT:
        return new Crobat(s,e);
      case PKM.AMPHAROS:
        return new Ampharos(s,e);
      case PKM.MAREEP:
        return new Mareep(s,e);
      case PKM.FLAFFY:
        return new Flaffy(s,e);
      case PKM.CLEFFA:
        return new Cleffa(s,e);
      case PKM.CLEFAIRY:
        return new Clefairy(s,e);
      case PKM.CLEFABLE:
        return new Clefable(s,e);
      case PKM.IGGLYBUFF:
        return new Igglybuff(s,e);
      case PKM.JIGGLYPUFF:
        return new Jigglypuff(s,e);
      case PKM.WIGGLYTUFF:
        return new Wigglytuff(s,e);
      case PKM.CATERPIE:
        return new Caterpie(s,e);
      case PKM.METAPOD:
        return new Metapod(s,e);
      case PKM.BUTTERFREE:
        return new Butterfree(s,e);
      case PKM.WEEDLE:
        return new Weedle(s,e);
      case PKM.KAKUNA:
        return new Kakuna(s,e);
      case PKM.BEEDRILL:
        return new Beedrill(s,e);
      case PKM.PIDGEY:
        return new Pidgey(s,e);
      case PKM.PIDGEOTTO:
        return new Pidgeotto(s,e);
      case PKM.PIDGEOT:
        return new Pidgeot(s,e);
      case PKM.HOPPIP:
        return new Hoppip(s,e);
      case PKM.SKIPLOOM:
        return new Skiploom(s,e);
      case PKM.JUMPLUFF:
        return new Jumpluff(s,e);
      case PKM.SEEDOT:
        return new Seedot(s,e);
      case PKM.NUZLEAF:
        return new Nuzleaf(s,e);
      case PKM.SHIFTRY:
        return new Shiftry(s,e);
      case PKM.STARLY:
        return new Starly(s,e);
      case PKM.STARAVIA:
        return new Staravia(s,e);
      case PKM.STARAPTOR:
        return new Staraptor(s,e);
      case PKM.CHIKORITA:
        return new Chikorita(s,e);
      case PKM.BAYLEEF:
        return new Bayleef(s,e);
      case PKM.MEGANIUM:
        return new Meganium(s,e);
      case PKM.CYNDAQUIL:
        return new Cyndaquil(s,e);
      case PKM.QUILAVA:
        return new Quilava(s,e);
      case PKM.TYPHLOSION:
        return new Typhlosion(s,e);
      case PKM.TOTODILE:
        return new Totodile(s,e);
      case PKM.CROCONAW:
        return new Croconaw(s,e);
      case PKM.FERALIGATR:
        return new Feraligatr(s,e);
      case PKM.TREECKO:
        return new Treecko(s,e);
      case PKM.GROVYLE:
        return new Grovyle(s,e);
      case PKM.SCEPTILE:
        return new Sceptile(s,e);
      case PKM.TORCHIC:
        return new Torchic(s,e);
      case PKM.COMBUSKEN:
        return new Combusken(s,e);
      case PKM.BLAZIKEN:
        return new Blaziken(s,e);
      case PKM.MUDKIP:
        return new Mudkip(s,e);
      case PKM.MARSHTOMP:
        return new Marshtomp(s,e);
      case PKM.SWAMPERT:
        return new Swampert(s,e);
      case PKM.TURTWIG:
        return new Turtwig(s,e);
      case PKM.GROTLE:
        return new Grotle(s,e);
      case PKM.TORTERRA:
        return new Torterra(s,e);
      case PKM.CHIMCHAR:
        return new Chimchar(s,e);
      case PKM.MONFERNO:
        return new Monferno(s,e);
      case PKM.INFERNAPE:
        return new Infernape(s,e);
      case PKM.PIPLUP:
        return new Piplup(s,e);
      case PKM.PRINPLUP:
        return new Prinplup(s,e);
      case PKM.EMPOLEON:
        return new Empoleon(s,e);
      case PKM.NIDORANF:
        return new NidoranF(s,e);
      case PKM.NIDORINA:
        return new Nidorina(s,e);
      case PKM.NIDOQUEEN:
        return new Nidoqueen(s,e);
      case PKM.NIDORANM:
        return new NidoranM(s,e);
      case PKM.NIDORINO:
        return new Nidorino(s,e);
      case PKM.NIDOKING:
        return new Nidoking(s,e);
      case PKM.PICHU:
        return new Pichu(s,e);
      case PKM.PIKACHU:
        return new Pikachu(s,e);
      case PKM.RAICHU:
        return new Raichu(s,e);
      case PKM.MACHOP:
        return new Machop(s,e);
      case PKM.MACHOKE:
        return new Machoke(s,e);
      case PKM.MACHAMP:
        return new Machamp(s,e);
      case PKM.HORSEA:
        return new Horsea(s,e);
      case PKM.SEADRA:
        return new Seadra(s,e);
      case PKM.KINGDRA:
        return new Kingdra(s,e);
      case PKM.TRAPINCH:
        return new Trapinch(s,e);
      case PKM.VIBRAVA:
        return new Vibrava(s,e);
      case PKM.FLYGON:
        return new Flygon(s,e);
      case PKM.SPHEAL:
        return new Spheal(s,e);
      case PKM.SEALEO:
        return new Sealeo(s,e);
      case PKM.WALREIN:
        return new Walrein(s,e);
      case PKM.ARON:
        return new Aron(s,e);
      case PKM.LAIRON:
        return new Lairon(s,e);
      case PKM.AGGRON:
        return new Aggron(s,e);
      case PKM.MAGNEMITE:
        return new Magnemite(s,e);
      case PKM.MAGNETON:
        return new Magneton(s,e);
      case PKM.MAGNEZONE:
        return new Magnezone(s,e);
      case PKM.RHYHORN:
        return new Rhyhorn(s,e);
      case PKM.RHYDON:
        return new Rhydon(s,e);
      case PKM.RHYPERIOR:
        return new Rhyperior(s,e);
      case PKM.TOGEPI:
        return new Togepi(s,e);
      case PKM.TOGETIC:
        return new Togetic(s,e);
      case PKM.TOGEKISS:
        return new Togekiss(s,e);
      case PKM.DUSKULL:
        return new Duskull(s,e);
      case PKM.DUSCLOPS:
        return new Dusclops(s,e);
      case PKM.DUSKNOIR:
        return new Dusknoir(s,e);
      case PKM.LOTAD:
        return new Lotad(s,e);
      case PKM.LOMBRE:
        return new Lombre(s,e);
      case PKM.LUDICOLO:
        return new Ludicolo(s,e);
      case PKM.SHINX:
        return new Shinx(s,e);
      case PKM.LUXIO:
        return new Luxio(s,e);
      case PKM.LUXRAY:
        return new Luxray(s,e);
      case PKM.POLIWAG:
        return new Poliwag(s,e);
      case PKM.POLIWHIRL:
        return new Poliwhirl(s,e);
      case PKM.POLITOED:
        return new Politoed(s,e);
      case PKM.ABRA:
        return new Abra(s,e);
      case PKM.KADABRA:
        return new Kadabra(s,e);
      case PKM.ALAKAZAM:
        return new Alakazam(s,e);
      case PKM.GASTLY:
        return new Gastly(s,e);
      case PKM.HAUNTER:
        return new Haunter(s,e);
      case PKM.GENGAR:
        return new Gengar(s,e);
      case PKM.DRATINI:
        return new Dratini(s,e);
      case PKM.DRAGONAIR:
        return new Dragonair(s,e);
      case PKM.DRAGONITE:
        return new Dragonite(s,e);
      case PKM.LARVITAR:
        return new Larvitar(s,e);
      case PKM.PUPITAR:
        return new Pupitar(s,e);
      case PKM.TYRANITAR:
        return new Tyranitar(s,e);
      case PKM.SLAKOTH:
        return new Slakoth(s,e);
      case PKM.VIGOROTH:
        return new Vigoroth(s,e);
      case PKM.SLAKING:
        return new Slaking(s,e);
      case PKM.RALTS:
        return new Ralts(s,e);
      case PKM.KIRLIA:
        return new Kirlia(s,e);
      case PKM.GARDEVOIR:
        return new Gardevoir(s,e);
      case PKM.BAGON:
        return new Bagon(s,e);
      case PKM.SHELGON:
        return new Shelgon(s,e);
      case PKM.SALAMENCE:
        return new Salamence(s,e);
      case PKM.BELDUM:
        return new Beldum(s,e);
      case PKM.METANG:
        return new Metang(s,e);
      case PKM.METAGROSS:
        return new Metagross(s,e);
      case PKM.GIBLE:
        return new Gible(s,e);
      case PKM.GABITE:
        return new Gabite(s,e);
      case PKM.GARCHOMP:
        return new Garchomp(s,e);
      case PKM.ELEKID:
        return new Elekid(s,e);
      case PKM.ELECTABUZZ:
        return new Electabuzz(s,e);
      case PKM.ELECTIVIRE:
        return new Electivire(s,e);
      case PKM.MAGBY:
        return new Magby(s,e);
      case PKM.MAGMAR:
        return new Magmar(s,e);
      case PKM.MAGMORTAR:
        return new Magmortar(s,e);
      case PKM.MUNCHLAX:
        return new Munchlax(s,e);
      case PKM.SNORLAX:
        return new Snorlax(s,e);
      case PKM.GROWLITHE:
        return new Growlithe(s,e);
      case PKM.ARCANINE:
        return new Arcanine(s,e);
      case PKM.ONIX:
        return new Onix(s,e);
      case PKM.STEELIX:
        return new Steelix(s,e);
      case PKM.MEGASTEELIX:
        return new MegaSteelix(s,e);
      case PKM.SCYTHER:
        return new Scyther(s,e);
      case PKM.SCIZOR:
        return new Scizor(s,e);
      case PKM.MEGASCIZOR:
        return new MegaScizor(s,e);
      case PKM.RIOLU:
        return new Riolu(s,e);
      case PKM.LUCARIO:
        return new Lucario(s,e);
      case PKM.MEGALUCARIO:
        return new MegaLucario(s,e);
      case PKM.MAGIKARP:
        return new Magikarp(s,e);
      case PKM.RATTATA:
        return new Rattata(s,e);
      case PKM.RATICATE:
        return new Raticate(s,e);
      case PKM.SPEAROW:
        return new Spearow(s,e);
      case PKM.FEAROW:
        return new Fearow(s,e);
      case PKM.GYARADOS:
        return new Gyarados(s,e);
      case PKM.LUGIA:
        return new Lugia(s,e);
      case PKM.ZAPDOS:
        return new Zapdos(s,e);
      case PKM.MOLTRES:
        return new Moltres(s,e);
      case PKM.ARTICUNO:
        return new Articuno(s,e);
      case PKM.DIALGA:
        return new Dialga(s,e);
      case PKM.PALKIA:
        return new Palkia(s,e);
      case PKM.SUICUNE:
        return new Suicune(s,e);
      case PKM.RAIKOU:
        return new Raikou(s,e);
      case PKM.ENTEI:
        return new Entei(s,e);
      case PKM.KYOGRE:
        return new Kyogre(s,e);
      case PKM.GROUDON:
        return new Groudon(s,e);
      case PKM.RAYQUAZA:
        return new Rayquaza(s,e);
      case PKM.MEGARAYQUAZA:
        return new MegaRayquaza(s,e);
      case PKM.REGICE:
        return new Regice(s,e);
      case PKM.REGIROCK:
        return new Regirock(s,e);
      case PKM.REGISTEEL:
        return new Registeel(s,e);
      case PKM.REGIGIGAS:
        return new Regigigas(s,e);
      case PKM.GIRATINA:
        return new Giratina(s,e);
      case PKM.EEVEE:
        return new Eevee(s,e);
      case PKM.VAPOREON:
        return new Vaporeon(s,e);
      case PKM.JOLTEON:
        return new Jolteon(s,e);
      case PKM.FLAREON:
        return new Flareon(s,e);
      case PKM.ESPEON:
        return new Espeon(s,e);
      case PKM.UMBREON:
        return new Umbreon(s,e);
      case PKM.LEAFEON:
        return new Leafeon(s,e);
      case PKM.SYLVEON:
        return new Sylveon(s,e);
      case PKM.GLACEON:
        return new Glaceon(s,e);
      case PKM.MEDITITE:
        return new Meditite(s,e);
      case PKM.MEDICHAM:
        return new Medicham(s,e);
      case PKM.MEGAMEDICHAM:
        return new MegaMedicham(s,e);
      case PKM.NUMEL:
        return new Numel(s,e);
      case PKM.CAMERUPT:
        return new Camerupt(s,e);
      case PKM.MEGACAMERUPT:
        return new MegaCamerupt(s,e);
      case PKM.DITTO:
        return new Ditto(s,e);
      case PKM.SANDSHREW:
        return new Sandshrew(s,e);
      case PKM.DARKRAI:
        return new Darkrai(s,e);
      case PKM.LITWICK:
        return new Litwick(s,e);
      case PKM.LAMPENT:
        return new Lampent(s,e);
      case PKM.CHANDELURE:
        return new Chandelure(s,e);
      case PKM.BELLSPROUT:
        return new Bellsprout(s,e);
      case PKM.WEEPINBELL:
        return new Weepinbell(s,e);
      case PKM.VICTREEBEL:
        return new Victreebel(s,e);
      case PKM.SWINUB:
        return new Swinub(s,e);
      case PKM.PILOSWINE:
        return new Piloswine(s,e);
      case PKM.MAMOSWINE:
        return new Mamoswine(s,e);
      case PKM.SNORUNT:
        return new Snorunt(s,e);
      case PKM.GLALIE:
        return new Glalie(s,e);
      case PKM.FROSLASS:
        return new Froslass(s,e);
      case PKM.SNOVER:
        return new Snover(s,e);
      case PKM.ABOMASNOW:
        return new Abomasnow(s,e);
      case PKM.MEGAABOMASNOW:
        return new MegaAbomasnow(s,e);
      case PKM.VANILLITE:
        return new Vanillite(s,e);
      case PKM.VANILLISH:
        return new Vanillish(s,e);
      case PKM.VANILLUXE:
        return new Vanilluxe(s,e);
      case PKM.VOLCARONA:
        return new Volcarona(s,e);
      case PKM.LANDORUS:
        return new Landorus(s,e);
      case PKM.THUNDURUS:
        return new Thundurus(s,e);
      case PKM.TORNADUS:
        return new Tornadus(s,e);
      case PKM.KELDEO:
        return new Keldeo(s,e);
      case PKM.TERRAKION:
        return new Terrakion(s,e);
      case PKM.VIRIZION:
        return new Virizion(s,e);
      case PKM.COBALION:
        return new Cobalion(s,e);
      case PKM.MANAPHY:
        return new Manaphy(s,e);
      case PKM.SPIRITOMB:
        return new Spiritomb(s,e);
      case PKM.ABSOL:
        return new Absol(s,e);
      case PKM.LAPRAS:
        return new Lapras(s,e);
      case PKM.LATIAS:
        return new Latias(s,e);
      case PKM.LATIOS:
        return new Latios(s,e);
      case PKM.MESPRIT:
        return new Mesprit(s,e);
      case PKM.AZELF:
        return new Azelf(s,e);
      case PKM.UXIE:
        return new Uxie(s,e);
      case PKM.MEWTWO:
        return new Mewtwo(s,e);
      case PKM.KYUREM:
        return new Kyurem(s,e);
      case PKM.RESHIRAM:
        return new Reshiram(s,e);
      case PKM.ZEKROM:
        return new Zekrom(s,e);
      case PKM.CELEBI:
        return new Celebi(s,e);
      case PKM.VICTINI:
        return new Victini(s,e);
      case PKM.JIRACHI:
        return new Jirachi(s,e);
      case PKM.ARCEUS:
        return new Arceus(s,e);
      case PKM.DEOXYS:
        return new Deoxys(s,e);
      case PKM.SHAYMIN:
        return new Shaymin(s,e);
      case PKM.CRESSELIA:
        return new Cresselia(s,e);
      case PKM.HEATRAN:
        return new Heatran(s,e);
      case PKM.HOOH:
        return new HooH(s,e);
      case PKM.ROTOM:
        return new Rotom(s,e);
      case PKM.AERODACTYL:
        return new Aerodactyl(s,e);
      case PKM.HOUNDOUR:
        return new Houndour(s,e);
      case PKM.SWABLU:
        return new Swablu(s,e);
      case PKM.CARVANHA:
        return new Carvanha(s,e);
      case PKM.PRIMALKYOGRE:
        return new PrimalKyogre(s,e);
      case PKM.PRIMALGROUDON:
        return new PrimalGroudon(s,e);
      case PKM.MEOWTH:
        return new Meowth(s,e);
      case PKM.PERSIAN:
        return new Persian(s,e);
      case PKM.DEINO:
        return new Deino(s,e);
      case PKM.ZWEILOUS:
        return new Zweilous(s,e);
      case PKM.HYDREIGON:
        return new Hydreigon(s,e);
      case PKM.SANDILE:
        return new Sandile(s,e);
      case PKM.KROKOROK:
        return new Krookorok(s,e);
      case PKM.KROOKODILE:
        return new Krookodile(s,e);
      case PKM.SOLOSIS:
        return new Solosis(s,e);
      case PKM.DUOSION:
        return new Duosion(s,e);
      case PKM.REUNICLUS:
        return new Reuniclus(s,e);
      case PKM.ODDISH:
        return new Oddish(s,e);
      case PKM.GLOOM:
        return new Gloom(s,e);
      case PKM.VILEPLUME:
        return new Vileplume(s,e);
      case PKM.BELLOSSOM:
        return new Bellossom(s,e);
      case PKM.AMAURA:
        return new Amaura(s,e);
      case PKM.AURORUS:
        return new Aurorus(s,e);
      case PKM.ANORITH:
        return new Anorith(s,e);
      case PKM.ARMALDO:
        return new Armaldo(s,e);
      case PKM.ARCHEN:
        return new Archen(s,e);
      case PKM.ARCHEOPS:
        return new Archeops(s,e);
      case PKM.SHIELDON:
        return new Shieldon(s,e);
      case PKM.BASTIODON:
        return new Bastiodon(s,e);
      case PKM.TIRTOUGA:
        return new Tirtouga(s,e);
      case PKM.CARRACOSTA:
        return new Carracosta(s,e);
      case PKM.LILEEP:
        return new Lileep(s,e);
      case PKM.CRADILY:
        return new Cradily(s,e);
      case PKM.OMANYTE:
        return new Omanyte(s,e);
      case PKM.OMASTAR:
        return new Omastar(s,e);
      case PKM.CRANIDOS:
        return new Cranidos(s,e);
      case PKM.RAMPARDOS:
        return new Rampardos(s,e);
      case PKM.TYRUNT:
        return new Tyrunt(s,e);
      case PKM.TYRANTRUM:
        return new Tyrantrum(s,e);
      case PKM.KABUTO:
        return new Kabuto(s,e);
      case PKM.KABUTOPS:
        return new Kabutops(s,e);
      case PKM.BUDEW:
        return new Budew(s,e);
      case PKM.ROSELIA:
        return new Roselia(s,e);
      case PKM.ROSERADE:
        return new Roserade(s,e);
      case PKM.BUNEARY:
        return new Buneary(s,e);
      case PKM.LOPUNNY:
        return new Lopunny(s,e);
      case PKM.MEGALOPUNNY:
        return new MegaLopunny(s,e);
      case PKM.AXEW:
        return new Axew(s,e);
      case PKM.FRAXURE:
        return new Fraxure(s,e);
      case PKM.HAXORUS:
        return new Haxorus(s,e);
      case PKM.VENIPEDE:
        return new Venipede(s,e);
      case PKM.WHIRLIPEDE:
        return new Whirlipede(s,e);
      case PKM.SCOLIPEDE:
        return new Scolipede(s,e);
      case PKM.PORYGON:
        return new Porygon(s,e);
      case PKM.PORYGON2:
        return new Porygon2(s,e);
      case PKM.PORYGONZ:
        return new PorygonZ(s,e);
      case PKM.KLINK:
        return new Klink(s,e);
      case PKM.KLANG:
        return new Klang(s,e);
      case PKM.KLINKLANG:
        return new Klinklang(s,e);
      case PKM.ELECTRIKE:
        return new Electrike(s,e);
      case PKM.MANECTRIC:
        return new Manectric(s,e);
      case PKM.MEGAMANECTRIC:
        return new MegaManectric(s,e);
      case PKM.SHUPPET:
        return new Shuppet(s,e);
      case PKM.BANETTE:
        return new Banette(s,e);
      case PKM.MEGABANETTE:
        return new MegaBanette(s,e);
      case PKM.HONEDGE:
        return new Honedge(s,e);
      case PKM.DOUBLADE:
        return new Doublade(s,e);
      case PKM.AEGISLASH:
        return new Aegislash(s,e);
      case PKM.CUBONE:
        return new Cubone(s,e);
      case PKM.MAROWAK:
        return new Marowak(s,e);
      case PKM.ALOLANMAROWAK:
        return new AlolanMarowak(s,e);
      case PKM.FLETCHLING:
        return new Fletchling(s,e);
      case PKM.FLETCHINDER:
        return new Fletchinder(s,e);
      case PKM.TALONFLAME:
        return new Talonflame(s,e);
      case PKM.WHISMUR:
        return new Whismur(s,e);
      case PKM.LOUDRED:
        return new Loudred(s,e);
      case PKM.EXPLOUD:
        return new Exploud(s,e);
      case PKM.TYMPOLE:
        return new Tympole(s,e);
      case PKM.PALPITOAD:
        return new Palpitoad(s,e);
      case PKM.SEISMITOAD:
        return new Seismitoad(s,e);
      case PKM.SEWADDLE:
        return new Sewaddle(s,e);
      case PKM.SWADLOON:
        return new Swadloon(s,e);
      case PKM.LEAVANNY:
        return new Leavanny(s,e);
      case PKM.PIKIPEK:
        return new Pikipek(s,e);
      case PKM.TRUMBEAK:
        return new Trumbeak(s,e);
      case PKM.TOUCANNON:
        return new Toucannon(s,e);
      case PKM.FLABEBE:
        return new Flabebe(s,e);
      case PKM.FLOETTE:
        return new Floette(s,e);
      case PKM.FLORGES:
        return new Florges(s,e);
      case PKM.JANGMOO:
        return new JangmoO(s,e);
      case PKM.HAKAMOO:
        return new HakamoO(s,e);
      case PKM.KOMMOO:
        return new KommoO(s,e);
      case PKM.MELOETTA:
        return new Meloetta(s,e);
      case PKM.ALTARIA:
        return new Altaria(s,e);
      case PKM.MEGAALTARIA:
        return new MegaAltaria(s,e);
      case PKM.LILLIPUP:
        return new Lillipup(s,e);
      case PKM.HERDIER:
        return new Herdier(s,e);
      case PKM.STOUTLAND:
        return new Stoutland(s,e);
      case PKM.CASTFORM:
        return new Castform(s,e);
      case PKM.CASTFORMSUN:
        return new CastformSun(s,e);
      case PKM.CASTFORMRAIN:
        return new CastformRain(s,e);
      case PKM.CASTFORMHAIL:
        return new CastformHail(s,e);
      default:
        // console.log(`No pokemon with name "${name}" found, return magikarp`);
        return new Magikarp(s,e);
    }
  }

  static getPokemonRarityFromName(name: string) {
    const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name);
    return pokemon.rarity;
  }

  static getPokemonIndexFromName(name: string) {
      const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name);
      return pokemon.index;
  }

  static getRandomFossil(board: Board) {
    const currentFossils = [];
    board.forEach( (p) =>{
      if (p.types.includes(TYPE.FOSSIL)) {
        currentFossils.push(p.name);
      }
    });
    const possibleFossils = [];
    PRECOMPUTED_TYPE_POKEMONS[TYPE.FOSSIL].pokemons.forEach((p)=>{
      if (!currentFossils.includes(p)) {
        possibleFossils.push(p);
      }
    });
    if (possibleFossils.length > 0) {
      return possibleFossils[Math.floor(Math.random() * possibleFossils.length)];
    } else {
      return PKM.AERODACTYL;
    }
  }
}
