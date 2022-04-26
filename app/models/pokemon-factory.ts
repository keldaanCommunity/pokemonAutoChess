import {Pokemon, Bulbasaur, Abomasnow, Abra, Absol, Aegislash, Aerodactyl, Aggron, Alakazam, AlolanMarowak, Altaria, Amaura, Ampharos, Anorith, Arcanine, Arceus, Archen, Archeops, Armaldo, Aron, Articuno, Aurorus, Axew, Azelf, Azumarill, Azurill, Bagon, Banette, Bastiodon, Bayleef, Beedrill, Beldum, Bellossom, Bellsprout, Blastoise, Blaziken, Budew, Buneary, Butterfree, Camerupt, Carracosta, Carvanha, Castform, CastformHail, CastformRain, CastformSun, Caterpie, Celebi, Chandelure, Charizard, Charmander, Charmeleon, Chikorita, Chimchar, Clefable, Clefairy, Cleffa, Cobalion, Combusken, Cradily, Cranidos, Cresselia, Crobat, Croconaw, Cubone, Cyndaquil, Darkrai, Deino, Deoxys, Dialga, Ditto, Doublade, Dragonair, Dragonite, Dratini, Duosion, Dusclops, Dusknoir, Duskull, Eevee, Electabuzz, Electivire, Electrike, Elekid, Empoleon, Entei, Espeon, Exploud, Fearow, Feraligatr, Flabebe, Flaffy, Flareon, Fletchinder, Fletchling, Floette, Florges, Flygon, Fraxure, Froslass, Gabite, Garchomp, Gardevoir, Gastly, Gengar, Geodude, Gible, Giratina, Glaceon, Glalie, Gloom, Golbat, Golem, Graveler, Grotle, Groudon, Grovyle, Growlithe, Gyarados, HakamoO, Haunter, Haxorus, Heatran, Herdier, Honedge, HooH, Hoppip, Horsea, Houndour, Hydreigon, Igglybuff, Infernape, Ivysaur, JangmoO, Jigglypuff, Jirachi, Jolteon, Jumpluff, Kabuto, Kabutops, Kadabra, Kakuna, Keldeo, Kingdra, Kirlia, Klang, Klink, Klinklang, KommoO, Krookodile, Krookorok, Kyogre, Kyurem, Lairon, Lampent, Landorus, Lapras, Larvitar, Latias, Latios, Leafeon, Leavanny, Lileep, Lillipup, Litwick, Lombre, Lopunny, Lotad, Loudred, Lucario, Ludicolo, Lugia, Luxio, Luxray, Machamp, Machoke, Machop, Magby, Magikarp, Magmar, Magmortar, Magnemite, Magneton, Magnezone, Mamoswine, Manaphy, Manectric, Mareep, Marill, Marowak, Marshtomp, Medicham, Meditite, MegaAbomasnow, MegaAltaria, MegaBanette, MegaCamerupt, MegaLopunny, MegaLucario, MegaManectric, MegaMedicham, Meganium, MegaRayquaza, MegaScizor, MegaSteelix, Meloetta, Meowth, Mesprit, Metagross, Metang, Metapod, Mewtwo, Moltres, Monferno, Mudkip, Munchlax, Nidoking, Nidoqueen, NidoranF, NidoranM, Nidorina, Nidorino, Numel, Nuzleaf, Oddish, Omanyte, Omastar, Onix, Palkia, Palpitoad, Persian, Pichu, Pidgeot, Pidgeotto, Pidgey, Pikachu, Pikipek, Piloswine, Piplup, Politoed, Poliwag, Poliwhirl, Porygon, Porygon2, PorygonZ, PrimalGroudon, PrimalKyogre, Prinplup, Pupitar, Quilava, Raichu, Raikou, Ralts, Rampardos, Raticate, Rattata, Rayquaza, Regice, Regigigas, Regirock, Registeel, Reshiram, Reuniclus, Rhydon, Rhyhorn, Rhyperior, Riolu, Roselia, Roserade, Rotom, Salamence, Sandile, Sandshrew, Sceptile, Scizor, Scolipede, Scyther, Seadra, Sealeo, Seedot, Seismitoad, Sewaddle, Shaymin, Shelgon, Shieldon, Shiftry, Shinx, Shuppet, Skiploom, Slaking, Slakoth, Slowbro, Slowking, Slowpoke, Snorlax, Snorunt, Snover, Solosis, Spearow, Spheal, Spiritomb, Squirtle, Staraptor, Staravia, Starly, Steelix, Stoutland, Suicune, Swablu, Swadloon, Swampert, Swinub, Sylveon, Talonflame, Terrakion, Thundurus, Tirtouga, Togekiss, Togepi, Togetic, Torchic, Tornadus, Torterra, Totodile, Toucannon, Trapinch, Treecko, Trumbeak, Turtwig, Tympole, Typhlosion, Tyranitar, Tyrantrum, Tyrunt, Umbreon, Uxie, Vanillish, Vanillite, Vanilluxe, Vaporeon, Venipede, Venusaur, Vibrava, Victini, Victreebel, Vigoroth, Vileplume, Virizion, Volcarona, Walrein, Wartortle, Weedle, Weepinbell, Whirlipede, Whismur, Wigglytuff, Zapdos, Zekrom, Zubat, Zweilous} from './colyseus-models/pokemon';
import Board from '../core/board';
import {AttackStrategy, BiteStrategy, BlastBurnStrategy, BlazeKickStrategy, BonemerangStrategy, BugBuzzStrategy, BurnStrategy, CalmMindStrategy, ChargeStrategy, ClangorousSoulStrategy, ConfusionStrategy, DarkPulseStrategy, DisarmingVoiceStrategy, DischargeStrategy, DracoMeteorStrategy, DragonBreathStrategy, DragonTailStrategy, EchoStrategy, ExplosionStrategy, FireBlastStrategy, FreezeStrategy, GrassWhistleStrategy, GrowlStrategy, GuillotineStrategy, HappyHourStrategy, HeadSmashStrategy, HealBlockStrategy, HeatWaveStrategy, HighJumpKickStrategy, HurricaneStrategy, HydroPumpStrategy, HyperVoiceStrategy, IcicleCrashStrategy, IronDefenseStrategy, IronTailStrategy, KingShieldStrategy, LeechLifeStrategy, MeteorMashStrategy, MetronomeStrategy, NastyPlotStrategy, NightmareStrategy, NightSlashStrategy, OriginPulseStrategy, PetalDanceStrategy, PoisonStingStrategy, PoisonStrategy, ProtectStrategy, RelicSongStrategy, RoarOfTimeStrategy, RockSlideStrategy, RockSmashStrategy, RockTombStrategy, RootStrategy, SeedFlareStrategy, SeismicTossStrategy, ShadowCloneStrategy, SilenceStrategy, SleepStrategy, SoakStrategy, StompStrategy, StunSporeStrategy, TeleportStrategy, ThiefStrategy, ThunderStrategy, TormentStrategy, TriAttackStrategy, VoltSwitchStrategy, WheelOfFireStrategy, WishStrategy} from '../core/attack-strategy';
import {MapSchema} from  '@colyseus/schema';
import {IPokemon, Emotion} from '../types';
import { IPokemonConfig } from './mongo-models/user-metadata';
import PRECOMPUTED_TYPE_POKEMONS from './precomputed/type-pokemons.json';
import { Ability } from '../types/enum/Ability'
import { Synergy } from '../types/enum/Synergy';
import { Pkm } from '../types/enum/Pokemon';

export default class PokemonFactory {
  static getNeutralPokemonsByLevelStage(level: number): MapSchema<IPokemon> {
    const pokemons = new MapSchema<IPokemon>();
    switch (level) {
      case 1:{
        const magikarp1 = PokemonFactory.createPokemonFromName(Pkm.MAGIKARP);
        magikarp1.positionX = 3;
        magikarp1.positionY = 1;
        const magikarp2 = PokemonFactory.createPokemonFromName(Pkm.MAGIKARP);
        magikarp2.positionX = 5;
        magikarp2.positionY = 1;
        pokemons.set(magikarp1.id, magikarp1);
        pokemons.set(magikarp2.id, magikarp2);
        break;
      }

      case 2: {
        const rattata1 = PokemonFactory.createPokemonFromName(Pkm.RATTATA);
        rattata1.positionX = 3;
        rattata1.positionY = 1;
        const rattata2 = PokemonFactory.createPokemonFromName(Pkm.RATTATA);
        rattata2.positionX = 5;
        rattata2.positionY = 1;
        const raticate = PokemonFactory.createPokemonFromName(Pkm.RATICATE);
        raticate.positionX = 4;
        raticate.positionY = 2;
        pokemons.set(rattata1.id, rattata1);
        pokemons.set(rattata2.id, rattata2);
        pokemons.set(raticate.id, raticate);
        break;
      }

      case 3: {
        const spearow1 = PokemonFactory.createPokemonFromName(Pkm.SPEAROW);
        spearow1.positionX = 3;
        spearow1.positionY = 1;
        const spearow2 = PokemonFactory.createPokemonFromName(Pkm.SPEAROW);
        spearow2.positionX = 5;
        spearow2.positionY = 1;
        const spearow3 = PokemonFactory.createPokemonFromName(Pkm.SPEAROW);
        spearow3.positionX = 4;
        spearow3.positionY = 1;
        const fearow = PokemonFactory.createPokemonFromName(Pkm.FEAROW);
        fearow.positionX = 4;
        fearow.positionY = 2;
        pokemons.set(spearow1.id, spearow1);
        pokemons.set(spearow2.id, spearow2);
        pokemons.set(spearow3.id, spearow3);
        pokemons.set(fearow.id, fearow);
        break;
      }

      case 10: {
        const gyarados = PokemonFactory.createPokemonFromName(Pkm.GYARADOS);
        gyarados.positionX = 4;
        gyarados.positionY = 2;
        pokemons.set(gyarados.id, gyarados);
        break;
      }

      case 15: {
        const lugia = PokemonFactory.createPokemonFromName(Pkm.LUGIA);
        lugia.positionX = 4;
        lugia.positionY = 2;
        pokemons.set(lugia.id, lugia);
        break;
      }


      case 20: {
        const giratina = PokemonFactory.createPokemonFromName(Pkm.GIRATINA);
        giratina.positionX = 4;
        giratina.positionY = 2;
        pokemons.set(giratina.id, giratina);
        break;
      }


      case 25: {
        const zapdos = PokemonFactory.createPokemonFromName(Pkm.ZAPDOS);
        zapdos.positionX = 2;
        zapdos.positionY = 2;
        pokemons.set(zapdos.id, zapdos);
        const moltres = PokemonFactory.createPokemonFromName(Pkm.MOLTRES);
        moltres.positionX = 4;
        moltres.positionY = 2;
        pokemons.set(moltres.id, moltres);
        const articuno = PokemonFactory.createPokemonFromName(Pkm.ARTICUNO);
        articuno.positionX = 6;
        articuno.positionY = 2;
        pokemons.set(articuno.id, articuno);
        break;
      }


      case 30: {
        const dialga = PokemonFactory.createPokemonFromName(Pkm.DIALGA);
        dialga.positionX = 2;
        dialga.positionY = 2;
        pokemons.set(dialga.id, dialga);
        const palkia = PokemonFactory.createPokemonFromName(Pkm.PALKIA);
        palkia.positionX = 6;
        palkia.positionY = 2;
        pokemons.set(palkia.id, palkia);
        break;
      }


      case 35: {
        const suicune = PokemonFactory.createPokemonFromName(Pkm.SUICUNE);
        suicune.positionX = 2;
        suicune.positionY = 2;
        pokemons.set(suicune.id, suicune);
        const raikou = PokemonFactory.createPokemonFromName(Pkm.RAIKOU);
        raikou.positionX = 4;
        raikou.positionY = 2;
        pokemons.set(raikou.id, raikou);
        const entei = PokemonFactory.createPokemonFromName(Pkm.ENTEI);
        entei.positionX = 6;
        entei.positionY = 2;
        pokemons.set(entei.id, entei);
        break;
      }


      case 40: {
        const regice = PokemonFactory.createPokemonFromName(Pkm.REGICE);
        regice.positionX = 2;
        regice.positionY = 3;
        pokemons.set(regice.id, regice);
        const regirock = PokemonFactory.createPokemonFromName(Pkm.REGIROCK);
        regirock.positionX = 4;
        regirock.positionY = 3;
        pokemons.set(regirock.id, regirock);
        const registeel = PokemonFactory.createPokemonFromName(Pkm.REGISTEEL);
        registeel.positionX = 6;
        registeel.positionY = 3;
        pokemons.set(registeel.id, registeel);
        const regigigas = PokemonFactory.createPokemonFromName(Pkm.REGIGIGAS);
        regigigas.positionX = 4;
        regigigas.positionY = 1;
        pokemons.set(regigigas.id, regigigas);
        break;
      }


      default: {
        const kyogre = PokemonFactory.createPokemonFromName(Pkm.KYOGRE);
        kyogre.positionX = 2;
        kyogre.positionY = 2;
        pokemons.set(kyogre.id, kyogre);
        const groudon = PokemonFactory.createPokemonFromName(Pkm.GROUDON);
        groudon.positionX = 4;
        groudon.positionY = 2;
        pokemons.set(groudon.id, groudon);
        const rayquaza = PokemonFactory.createPokemonFromName(Pkm.RAYQUAZA);
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
      case Pkm.VAPOREON:
        return Pkm.EEVEE;
      case Pkm.JOLTEON:
        return Pkm.EEVEE;
      case Pkm.FLAREON:
        return Pkm.EEVEE;
      case Pkm.ESPEON:
        return Pkm.EEVEE;
      case Pkm.UMBREON:
        return Pkm.EEVEE;
      case Pkm.LEAFEON:
        return Pkm.EEVEE;
      case Pkm.SYLVEON:
        return Pkm.EEVEE;
      case Pkm.GLACEON:
        return Pkm.EEVEE;
      default:
        return this.getPokemonFamily(name);
    }
  }

  static getPokemonFamily(name: string) {
    switch (name) {
      case Pkm.BULBASAUR:
        return Pkm.BULBASAUR;
      case Pkm.IVYSAUR:
        return Pkm.BULBASAUR;
      case Pkm.VENUSAUR:
        return Pkm.BULBASAUR;
      case Pkm.CHARMANDER:
        return Pkm.CHARMANDER;
      case Pkm.CHARMELEON:
        return Pkm.CHARMANDER;
      case Pkm.CHARIZARD:
        return Pkm.CHARMANDER;
      case Pkm.SQUIRTLE:
        return Pkm.SQUIRTLE;
      case Pkm.WARTORTLE:
        return Pkm.SQUIRTLE;
      case Pkm.BLASTOISE:
        return Pkm.SQUIRTLE;
      case Pkm.SLOWPOKE:
        return Pkm.SLOWPOKE;
      case Pkm.SLOWBRO:
        return Pkm.SLOWPOKE;
      case Pkm.SLOWKING:
        return Pkm.SLOWPOKE;
      case Pkm.GEODUDE:
        return Pkm.GEODUDE;
      case Pkm.GRAVELER:
        return Pkm.GEODUDE;
      case Pkm.GOLEM:
        return Pkm.GEODUDE;
      case Pkm.AZURILL:
        return Pkm.AZURILL;
      case Pkm.MARILL:
        return Pkm.AZURILL;
      case Pkm.AZUMARILL:
        return Pkm.AZURILL;
      case Pkm.ZUBAT:
        return Pkm.ZUBAT;
      case Pkm.GOLBAT:
        return Pkm.ZUBAT;
      case Pkm.CROBAT:
        return Pkm.ZUBAT;
      case Pkm.AMPHAROS:
        return Pkm.MAREEP;
      case Pkm.MAREEP:
        return Pkm.MAREEP;
      case Pkm.FLAFFY:
        return Pkm.MAREEP;
      case Pkm.CLEFFA:
        return Pkm.CLEFFA;
      case Pkm.CLEFAIRY:
        return Pkm.CLEFFA;
      case Pkm.CLEFABLE:
        return Pkm.CLEFFA;
      case Pkm.IGGLYBUFF:
        return Pkm.IGGLYBUFF;
      case Pkm.JIGGLYPUFF:
        return Pkm.IGGLYBUFF;
      case Pkm.WIGGLYTUFF:
        return Pkm.IGGLYBUFF;
      case Pkm.CATERPIE:
        return Pkm.CATERPIE;
      case Pkm.METAPOD:
        return Pkm.CATERPIE;
      case Pkm.BUTTERFREE:
        return Pkm.CATERPIE;
      case Pkm.WEEDLE:
        return Pkm.WEEDLE;
      case Pkm.KAKUNA:
        return Pkm.WEEDLE;
      case Pkm.BEEDRILL:
        return Pkm.WEEDLE;
      case Pkm.PIDGEY:
        return Pkm.PIDGEY;
      case Pkm.PIDGEOTTO:
        return Pkm.PIDGEY;
      case Pkm.PIDGEOT:
        return Pkm.PIDGEY;
      case Pkm.HOPPIP:
        return Pkm.HOPPIP;
      case Pkm.SKIPLOOM:
        return Pkm.HOPPIP;
      case Pkm.JUMPLUFF:
        return Pkm.HOPPIP;
      case Pkm.SEEDOT:
        return Pkm.SEEDOT;
      case Pkm.NUZLEAF:
        return Pkm.SEEDOT;
      case Pkm.SHIFTRY:
        return Pkm.SEEDOT;
      case Pkm.STARLY:
        return Pkm.STARLY;
      case Pkm.STARAVIA:
        return Pkm.STARLY;
      case Pkm.STARAPTOR:
        return Pkm.STARLY;
      case Pkm.CHIKORITA:
        return Pkm.CHIKORITA;
      case Pkm.BAYLEEF:
        return Pkm.CHIKORITA;
      case Pkm.MEGANIUM:
        return Pkm.CHIKORITA;
      case Pkm.CYNDAQUIL:
        return Pkm.CYNDAQUIL;
      case Pkm.QUILAVA:
        return Pkm.CYNDAQUIL;
      case Pkm.TYPHLOSION:
        return Pkm.CYNDAQUIL;
      case Pkm.TOTODILE:
        return Pkm.TOTODILE;
      case Pkm.CROCONAW:
        return Pkm.TOTODILE;
      case Pkm.FERALIGATR:
        return Pkm.TOTODILE;
      case Pkm.TREECKO:
        return Pkm.TREECKO;
      case Pkm.GROVYLE:
        return Pkm.TREECKO;
      case Pkm.SCEPTILE:
        return Pkm.TREECKO;
      case Pkm.TORCHIC:
        return Pkm.TORCHIC;
      case Pkm.COMBUSKEN:
        return Pkm.TORCHIC;
      case Pkm.BLAZIKEN:
        return Pkm.TORCHIC;
      case Pkm.MUDKIP:
        return Pkm.MUDKIP;
      case Pkm.MARSHTOMP:
        return Pkm.MUDKIP;
      case Pkm.SWAMPERT:
        return Pkm.MUDKIP;
      case Pkm.TURTWIG:
        return Pkm.TURTWIG;
      case Pkm.GROTLE:
        return Pkm.TURTWIG;
      case Pkm.TORTERRA:
        return Pkm.TURTWIG;
      case Pkm.CHIMCHAR:
        return Pkm.CHIMCHAR;
      case Pkm.MONFERNO:
        return Pkm.CHIMCHAR;
      case Pkm.INFERNAPE:
        return Pkm.CHIMCHAR;
      case Pkm.PIPLUP:
        return Pkm.PIPLUP;
      case Pkm.PRINPLUP:
        return Pkm.PIPLUP;
      case Pkm.EMPOLEON:
        return Pkm.PIPLUP;
      case Pkm.NIDORANF:
        return Pkm.NIDORANF;
      case Pkm.NIDORINA:
        return Pkm.NIDORANF;
      case Pkm.NIDOQUEEN:
        return Pkm.NIDORANF;
      case Pkm.NIDORANM:
        return Pkm.NIDORANM;
      case Pkm.NIDORINO:
        return Pkm.NIDORANM;
      case Pkm.NIDOKING:
        return Pkm.NIDORANM;
      case Pkm.PICHU:
        return Pkm.PICHU;
      case Pkm.PIKACHU:
        return Pkm.PICHU;
      case Pkm.RAICHU:
        return Pkm.PICHU;
      case Pkm.MACHOP:
        return Pkm.MACHOP;
      case Pkm.MACHOKE:
        return Pkm.MACHOP;
      case Pkm.MACHAMP:
        return Pkm.MACHOP;
      case Pkm.HORSEA:
        return Pkm.HORSEA;
      case Pkm.SEADRA:
        return Pkm.HORSEA;
      case Pkm.KINGDRA:
        return Pkm.HORSEA;
      case Pkm.TRAPINCH:
        return Pkm.TRAPINCH;
      case Pkm.VIBRAVA:
        return Pkm.TRAPINCH;
      case Pkm.FLYGON:
        return Pkm.TRAPINCH;
      case Pkm.SPHEAL:
        return Pkm.SPHEAL;
      case Pkm.SEALEO:
        return Pkm.SPHEAL;
      case Pkm.WALREIN:
        return Pkm.SPHEAL;
      case Pkm.ARON:
        return Pkm.ARON;
      case Pkm.LAIRON:
        return Pkm.ARON;
      case Pkm.AGGRON:
        return Pkm.ARON;
      case Pkm.MAGNEMITE:
        return Pkm.MAGNEMITE;
      case Pkm.MAGNETON:
        return Pkm.MAGNEMITE;
      case Pkm.MAGNEZONE:
        return Pkm.MAGNEMITE;
      case Pkm.RHYHORN:
        return Pkm.RHYHORN;
      case Pkm.RHYDON:
        return Pkm.RHYHORN;
      case Pkm.RHYPERIOR:
        return Pkm.RHYHORN;
      case Pkm.TOGEPI:
        return Pkm.TOGEPI;
      case Pkm.TOGETIC:
        return Pkm.TOGEPI;
      case Pkm.TOGEKISS:
        return Pkm.TOGEPI;
      case Pkm.DUSKULL:
        return Pkm.DUSKULL;
      case Pkm.DUSCLOPS:
        return Pkm.DUSKULL;
      case Pkm.DUSKNOIR:
        return Pkm.DUSKULL;
      case Pkm.LOTAD:
        return Pkm.LOTAD;
      case Pkm.LOMBRE:
        return Pkm.LOTAD;
      case Pkm.LUDICOLO:
        return Pkm.LOTAD;
      case Pkm.SHINX:
        return Pkm.SHINX;
      case Pkm.LUXIO:
        return Pkm.SHINX;
      case Pkm.LUXRAY:
        return Pkm.SHINX;
      case Pkm.POLIWAG:
        return Pkm.POLIWAG;
      case Pkm.POLIWHIRL:
        return Pkm.POLIWAG;
      case Pkm.POLITOED:
        return Pkm.POLIWAG;
      case Pkm.ABRA:
        return Pkm.ABRA;
      case Pkm.KADABRA:
        return Pkm.ABRA;
      case Pkm.ALAKAZAM:
        return Pkm.ABRA;
      case Pkm.GASTLY:
        return Pkm.GASTLY;
      case Pkm.HAUNTER:
        return Pkm.GASTLY;
      case Pkm.GENGAR:
        return Pkm.GASTLY;
      case Pkm.DRATINI:
        return Pkm.DRATINI;
      case Pkm.DRAGONAIR:
        return Pkm.DRATINI;
      case Pkm.DRAGONITE:
        return Pkm.DRATINI;
      case Pkm.LARVITAR:
        return Pkm.LARVITAR;
      case Pkm.PUPITAR:
        return Pkm.LARVITAR;
      case Pkm.TYRANITAR:
        return Pkm.LARVITAR;
      case Pkm.SLAKOTH:
        return Pkm.SLAKOTH;
      case Pkm.VIGOROTH:
        return Pkm.SLAKOTH;
      case Pkm.SLAKING:
        return Pkm.SLAKOTH;
      case Pkm.RALTS:
        return Pkm.RALTS;
      case Pkm.KIRLIA:
        return Pkm.RALTS;
      case Pkm.GARDEVOIR:
        return Pkm.RALTS;
      case Pkm.BAGON:
        return Pkm.BAGON;
      case Pkm.SHELGON:
        return Pkm.BAGON;
      case Pkm.SALAMENCE:
        return Pkm.BAGON;
      case Pkm.BELDUM:
        return Pkm.BELDUM;
      case Pkm.METANG:
        return Pkm.BELDUM;
      case Pkm.METAGROSS:
        return Pkm.BELDUM;
      case Pkm.GIBLE:
        return Pkm.GIBLE;
      case Pkm.GABITE:
        return Pkm.GIBLE;
      case Pkm.GARCHOMP:
        return Pkm.GIBLE;
      case Pkm.ELEKID:
        return Pkm.ELEKID;
      case Pkm.ELECTABUZZ:
        return Pkm.ELEKID;
      case Pkm.ELECTIVIRE:
        return Pkm.ELEKID;
      case Pkm.MAGBY:
        return Pkm.MAGBY;
      case Pkm.MAGMAR:
        return Pkm.MAGBY;
      case Pkm.MAGMORTAR:
        return Pkm.MAGBY;
      case Pkm.MUNCHLAX:
        return Pkm.MUNCHLAX;
      case Pkm.SNORLAX:
        return Pkm.MUNCHLAX;
      case Pkm.GROWLITHE:
        return Pkm.GROWLITHE;
      case Pkm.ARCANINE:
        return Pkm.GROWLITHE;
      case Pkm.ONIX:
        return Pkm.ONIX;
      case Pkm.STEELIX:
        return Pkm.ONIX;
      case Pkm.MEGA_STEELIX:
        return Pkm.ONIX;
      case Pkm.SCYTHER:
        return Pkm.SCYTHER;
      case Pkm.SCIZOR:
        return Pkm.SCYTHER;
      case Pkm.MEGA_SCIZOR:
        return Pkm.SCYTHER;
      case Pkm.RIOLU:
        return Pkm.RIOLU;
      case Pkm.LUCARIO:
        return Pkm.RIOLU;
      case Pkm.MEGA_LUCARIO:
        return Pkm.RIOLU;
      case Pkm.EEVEE:
        return Pkm.EEVEE;
      case Pkm.VAPOREON:
        return Pkm.VAPOREON;
      case Pkm.JOLTEON:
        return Pkm.JOLTEON;
      case Pkm.FLAREON:
        return Pkm.FLAREON;
      case Pkm.ESPEON:
        return Pkm.ESPEON;
      case Pkm.UMBREON:
        return Pkm.UMBREON;
      case Pkm.LEAFEON:
        return Pkm.LEAFEON;
      case Pkm.SYLVEON:
        return Pkm.SYLVEON;
      case Pkm.GLACEON:
        return Pkm.GLACEON;
      case Pkm.MEDITITE:
        return Pkm.MEDITITE;
      case Pkm.MEDICHAM:
        return Pkm.MEDITITE;
      case Pkm.MEGA_MEDICHAM:
        return Pkm.MEDITITE;
      case Pkm.NUMEL:
        return Pkm.NUMEL;
      case Pkm.CAMERUPT:
        return Pkm.NUMEL;
      case Pkm.MEGA_CAMERUPT:
        return Pkm.NUMEL;
      case Pkm.DITTO:
        return Pkm.DITTO;
      case Pkm.SANDSHREW:
        return Pkm.SANDSHREW;
      case Pkm.DARKRAI:
        return Pkm.DARKRAI;
      case Pkm.LITWICK:
        return Pkm.LITWICK;
      case Pkm.LAMPENT:
        return Pkm.LITWICK;
      case Pkm.CHANDELURE:
        return Pkm.LITWICK;
      case Pkm.BELLSPROUT:
        return Pkm.BELLSPROUT;
      case Pkm.WEEPINBELL:
        return Pkm.BELLSPROUT;
      case Pkm.VICTREEBEL:
        return Pkm.BELLSPROUT;
      case Pkm.SWINUB:
        return Pkm.SWINUB;
      case Pkm.PILOSWINE:
        return Pkm.SWINUB;
      case Pkm.MAMOSWINE:
        return Pkm.SWINUB;
      case Pkm.SNORUNT:
        return Pkm.SNORUNT;
      case Pkm.GLALIE:
        return Pkm.SNORUNT;
      case Pkm.FROSLASS:
        return Pkm.SNORUNT;
      case Pkm.SNOVER:
        return Pkm.SNOVER;
      case Pkm.ABOMASNOW:
        return Pkm.SNOVER;
      case Pkm.MEGA_ABOMASNOW:
        return Pkm.SNOVER;
      case Pkm.VANILLITE:
        return Pkm.VANILLITE;
      case Pkm.VANILLISH:
        return Pkm.VANILLITE;
      case Pkm.VANILLUXE:
        return Pkm.VANILLITE;
      case Pkm.VOLCARONA:
        return Pkm.VOLCARONA;
      case Pkm.LANDORUS:
        return Pkm.LANDORUS;
      case Pkm.TORNADUS:
        return Pkm.TORNADUS;
      case Pkm.THUNDURUS:
        return Pkm.THUNDURUS;
      case Pkm.KELDEO:
        return Pkm.KELDEO;
      case Pkm.TERRAKION:
        return Pkm.TERRAKION;
      case Pkm.VIRIZION:
        return Pkm.VIRIZION;
      case Pkm.COBALION:
        return Pkm.COBALION;
      case Pkm.MANAPHY:
        return Pkm.MANAPHY;
      case Pkm.ROTOM:
        return Pkm.ROTOM;
      case Pkm.SPIRITOMB:
        return Pkm.SPIRITOMB;
      case Pkm.ABSOL:
        return Pkm.ABSOL;
      case Pkm.LAPRAS:
        return Pkm.LAPRAS;
      case Pkm.LATIAS:
        return Pkm.LATIAS;
      case Pkm.LATIOS:
        return Pkm.LATIOS;
      case Pkm.MESPRIT:
        return Pkm.MESPRIT;
      case Pkm.AZELF:
        return Pkm.AZELF;
      case Pkm.UXIE:
        return Pkm.UXIE;
      case Pkm.MEWTWO:
        return Pkm.MEWTWO;
      case Pkm.KYUREM:
        return Pkm.KYUREM;
      case Pkm.RESHIRAM:
        return Pkm.RESHIRAM;
      case Pkm.ZEKROM:
        return Pkm.ZEKROM;
      case Pkm.CELEBI:
        return Pkm.CELEBI;
      case Pkm.VICTINI:
        return Pkm.VICTINI;
      case Pkm.JIRACHI:
        return Pkm.JIRACHI;
      case Pkm.ARCEUS:
        return Pkm.ARCEUS;
      case Pkm.DEOXYS:
        return Pkm.DEOXYS;
      case Pkm.SHAYMIN:
        return Pkm.SHAYMIN;
      case Pkm.CRESSELIA:
        return Pkm.CRESSELIA;
      case Pkm.HEATRAN:
        return Pkm.HEATRAN;
      case Pkm.HO_OH:
        return Pkm.HO_OH;
      case Pkm.REGICE:
        return Pkm.REGICE;
      case Pkm.REGISTEEL:
        return Pkm.REGISTEEL;
      case Pkm.REGIROCK:
        return Pkm.REGIROCK;
      case Pkm.ARTICUNO:
        return Pkm.ARTICUNO;
      case Pkm.ZAPDOS:
        return Pkm.ZAPDOS;
      case Pkm.MOLTRES:
        return Pkm.MOLTRES;
      case Pkm.AERODACTYL:
        return Pkm.AERODACTYL;
      case Pkm.GROUDON:
        return Pkm.GROUDON;
      case Pkm.KYOGRE:
        return Pkm.KYOGRE;
      case Pkm.RAYQUAZA:
        return Pkm.RAYQUAZA;
      case Pkm.MEGA_RAYQUAZA:
        return Pkm.MEGA_RAYQUAZA;
      case Pkm.PALKIA:
        return Pkm.PALKIA;
      case Pkm.DIALGA:
        return Pkm.DIALGA;
      case Pkm.GIRATINA:
        return Pkm.GIRATINA;
      case Pkm.SUICUNE:
        return Pkm.SUICUNE;
      case Pkm.ENTEI:
        return Pkm.ENTEI;
      case Pkm.RAIKOU:
        return Pkm.RAIKOU;
      case Pkm.REGIGIGAS:
        return Pkm.REGIGIGAS;
      case Pkm.MAGIKARP:
        return Pkm.MAGIKARP;
      case Pkm.GYARADOS:
        return Pkm.GYARADOS;
      case Pkm.RATTATA:
        return Pkm.RATTATA;
      case Pkm.RATICATE:
        return Pkm.RATTATA;
      case Pkm.LUGIA:
        return Pkm.LUGIA;
      case Pkm.CARVANHA:
        return Pkm.CARVANHA;
      case Pkm.HOUNDOUR:
        return Pkm.HOUNDOUR;
      case Pkm.SWABLU:
        return Pkm.SWABLU;
      case Pkm.PRIMAL_GROUDON:
        return Pkm.GROUDON;
      case Pkm.PRIMAL_KYOGRE:
        return Pkm.KYOGRE;
      case Pkm.FEAROW:
        return Pkm.SPEAROW;
      case Pkm.SPEAROW:
        return Pkm.SPEAROW;
      case Pkm.MEOWTH:
        return Pkm.MEOWTH;
      case Pkm.PERSIAN:
        return Pkm.MEOWTH;
      case Pkm.DEINO:
        return Pkm.DEINO;
      case Pkm.ZWEILOUS:
        return Pkm.DEINO;
      case Pkm.HYDREIGON:
        return Pkm.DEINO;
      case Pkm.SANDILE:
        return Pkm.SANDILE;
      case Pkm.KROKOROK:
        return Pkm.SANDILE;
      case Pkm.KROOKODILE:
        return Pkm.SANDILE;
      case Pkm.SOLOSIS:
        return Pkm.SOLOSIS;
      case Pkm.DUOSION:
        return Pkm.SOLOSIS;
      case Pkm.REUNICLUS:
        return Pkm.SOLOSIS;
      case Pkm.ODDISH:
        return Pkm.ODDISH;
      case Pkm.GLOOM:
        return Pkm.ODDISH;
      case Pkm.VILEPLUME:
        return Pkm.ODDISH;
      case Pkm.BELLOSSOM:
        return Pkm.ODDISH;
      case Pkm.AMAURA:
        return Pkm.AMAURA;
      case Pkm.AURORUS:
        return Pkm.AMAURA;
      case Pkm.ANORITH:
        return Pkm.ANORITH;
      case Pkm.ARMALDO:
        return Pkm.ANORITH;
      case Pkm.ARCHEN:
        return Pkm.ARCHEN;
      case Pkm.ARCHEOPS:
        return Pkm.ARCHEN;
      case Pkm.SHIELDON:
        return Pkm.SHIELDON;
      case Pkm.BASTIODON:
        return Pkm.SHIELDON;
      case Pkm.TIRTOUGA:
        return Pkm.TIRTOUGA;
      case Pkm.CARRACOSTA:
        return Pkm.TIRTOUGA;
      case Pkm.LILEEP:
        return Pkm.LILEEP;
      case Pkm.CRADILY:
        return Pkm.LILEEP;
      case Pkm.KABUTO:
        return Pkm.KABUTO;
      case Pkm.KABUTOPS:
        return Pkm.KABUTO;
      case Pkm.OMANYTE:
        return Pkm.OMANYTE;
      case Pkm.OMASTAR:
        return Pkm.OMANYTE;
      case Pkm.CRANIDOS:
        return Pkm.CRANIDOS;
      case Pkm.RAMPARDOS:
        return Pkm.CRANIDOS;
      case Pkm.TYRUNT:
        return Pkm.TYRUNT;
      case Pkm.TYRANTRUM:
        return Pkm.TYRUNT;
      case Pkm.BUDEW:
        return Pkm.BUDEW;
      case Pkm.ROSELIA:
        return Pkm.BUDEW;
      case Pkm.ROSERADE:
        return Pkm.BUDEW;
      case Pkm.BUNEARY:
        return Pkm.BUNEARY;
      case Pkm.LOPUNNY:
        return Pkm.BUNEARY;
      case Pkm.MEGA_LOPUNNY:
        return Pkm.BUNEARY;
      case Pkm.AXEW:
        return Pkm.AXEW;
      case Pkm.FRAXURE:
        return Pkm.AXEW;
      case Pkm.HAXORUS:
        return Pkm.AXEW;
      case Pkm.VENIPEDE:
        return Pkm.VENIPEDE;
      case Pkm.WHIRLIPEDE:
        return Pkm.VENIPEDE;
      case Pkm.SCOLIPEDE:
        return Pkm.VENIPEDE;
      case Pkm.PORYGON:
        return Pkm.PORYGON;
      case Pkm.PORYGON_2:
        return Pkm.PORYGON;
      case Pkm.PORYGON_Z:
        return Pkm.PORYGON;
      case Pkm.KLINK:
        return Pkm.KLINK;
      case Pkm.KLANG:
        return Pkm.KLINK;
      case Pkm.KLINKLANG:
        return Pkm.KLINK;
      case Pkm.ELECTRIKE:
        return Pkm.ELECTRIKE;
      case Pkm.MANECTRIC:
        return Pkm.ELECTRIKE;
      case Pkm.MEGA_MANECTRIC:
        return Pkm.ELECTRIKE;
      case Pkm.SHUPPET:
        return Pkm.SHUPPET;
      case Pkm.BANETTE:
        return Pkm.SHUPPET;
      case Pkm.MEGA_BANETTE:
        return Pkm.SHUPPET;
      case Pkm.HONEDGE:
        return Pkm.HONEDGE;
      case Pkm.DOUBLADE:
        return Pkm.HONEDGE;
      case Pkm.AEGISLASH:
        return Pkm.HONEDGE;
      case Pkm.CUBONE:
        return Pkm.CUBONE;
      case Pkm.MAROWAK:
        return Pkm.CUBONE;
      case Pkm.ALOLAN_MAROWAK:
        return Pkm.CUBONE;
      case Pkm.FLETCHLING:
        return Pkm.FLETCHLING;
      case Pkm.FLETCHINDER:
        return Pkm.FLETCHLING;
      case Pkm.TALONFLAME:
        return Pkm.FLETCHLING;
      case Pkm.WHISMUR:
        return Pkm.WHISMUR;
      case Pkm.LOUDRED:
        return Pkm.WHISMUR;
      case Pkm.EXPLOUD:
        return Pkm.WHISMUR;
      case Pkm.TYMPOLE:
        return Pkm.TYMPOLE;
      case Pkm.PALPITOAD:
        return Pkm.TYMPOLE;
      case Pkm.SEISMITOAD:
        return Pkm.TYMPOLE;
      case Pkm.SEWADDLE:
        return Pkm.SEWADDLE;
      case Pkm.SWADLOON:
        return Pkm.SEWADDLE;
      case Pkm.LEAVANNY:
        return Pkm.SEWADDLE;
      case Pkm.PIKIPEK:
        return Pkm.PIKIPEK;
      case Pkm.TRUMBEAK:
        return Pkm.PIKIPEK;
      case Pkm.TOUCANNON:
        return Pkm.PIKIPEK;
      case Pkm.FLABEBE:
        return Pkm.FLABEBE;
      case Pkm.FLOETTE:
        return Pkm.FLABEBE;
      case Pkm.FLORGES:
        return Pkm.FLABEBE;
      case Pkm.JANGMO_O:
        return Pkm.JANGMO_O;
      case Pkm.HAKAMO_O:
        return Pkm.JANGMO_O;
      case Pkm.KOMMO_O:
        return Pkm.JANGMO_O;
      case Pkm.MELOETTA:
        return Pkm.MELOETTA;
      case Pkm.ALTARIA:
        return Pkm.SWABLU;
      case Pkm.MEGA_ALTARIA:
        return Pkm.SWABLU;
      case Pkm.LILLIPUP:
        return Pkm.LILLIPUP;
      case Pkm.HERDIER:
        return Pkm.LILLIPUP;
      case Pkm.STOUTLAND:
        return Pkm.LILLIPUP;
      case Pkm.CASTFORM:
        return Pkm.CASTFORM;
      case Pkm.CASTFORM_SUN:
        return Pkm.CASTFORM_SUN;
      case Pkm.CASTFORM_RAIN:
        return Pkm.CASTFORM_RAIN;
      case Pkm.CASTFORM_HAIL:
        return Pkm.CASTFORM_HAIL;
      default:
        console.log(`No pokemon with name "${name}" found`);
        break;
    }
  }

  static createPokemonFromName(name: string, config?: IPokemonConfig) {
    const s = config && config.selectedShiny ? true: false;
    const e = config && config.selectedEmotion ? config.selectedEmotion: Emotion.NORMAL;
    switch (name) {
      case Pkm.BULBASAUR:
        return new Bulbasaur(s,e);
      case Pkm.IVYSAUR:
        return new Ivysaur(s,e);
      case Pkm.VENUSAUR:
        return new Venusaur(s,e);
      case Pkm.CHARMANDER:
        return new Charmander(s,e);
      case Pkm.CHARMELEON:
        return new Charmeleon(s,e);
      case Pkm.CHARIZARD:
        return new Charizard(s,e);
      case Pkm.SQUIRTLE:
        return new Squirtle(s,e);
      case Pkm.WARTORTLE:
        return new Wartortle(s,e);
      case Pkm.BLASTOISE:
        return new Blastoise(s,e);
      case Pkm.SLOWPOKE:
        return new Slowpoke(s,e);
      case Pkm.SLOWBRO:
        return new Slowbro(s,e);
      case Pkm.SLOWKING:
        return new Slowking(s,e);
      case Pkm.GEODUDE:
        return new Geodude(s,e);
      case Pkm.GRAVELER:
        return new Graveler(s,e);
      case Pkm.GOLEM:
        return new Golem(s,e);
      case Pkm.AZURILL:
        return new Azurill(s,e);
      case Pkm.MARILL:
        return new Marill(s,e);
      case Pkm.AZUMARILL:
        return new Azumarill(s,e);
      case Pkm.ZUBAT:
        return new Zubat(s,e);
      case Pkm.GOLBAT:
        return new Golbat(s,e);
      case Pkm.CROBAT:
        return new Crobat(s,e);
      case Pkm.AMPHAROS:
        return new Ampharos(s,e);
      case Pkm.MAREEP:
        return new Mareep(s,e);
      case Pkm.FLAFFY:
        return new Flaffy(s,e);
      case Pkm.CLEFFA:
        return new Cleffa(s,e);
      case Pkm.CLEFAIRY:
        return new Clefairy(s,e);
      case Pkm.CLEFABLE:
        return new Clefable(s,e);
      case Pkm.IGGLYBUFF:
        return new Igglybuff(s,e);
      case Pkm.JIGGLYPUFF:
        return new Jigglypuff(s,e);
      case Pkm.WIGGLYTUFF:
        return new Wigglytuff(s,e);
      case Pkm.CATERPIE:
        return new Caterpie(s,e);
      case Pkm.METAPOD:
        return new Metapod(s,e);
      case Pkm.BUTTERFREE:
        return new Butterfree(s,e);
      case Pkm.WEEDLE:
        return new Weedle(s,e);
      case Pkm.KAKUNA:
        return new Kakuna(s,e);
      case Pkm.BEEDRILL:
        return new Beedrill(s,e);
      case Pkm.PIDGEY:
        return new Pidgey(s,e);
      case Pkm.PIDGEOTTO:
        return new Pidgeotto(s,e);
      case Pkm.PIDGEOT:
        return new Pidgeot(s,e);
      case Pkm.HOPPIP:
        return new Hoppip(s,e);
      case Pkm.SKIPLOOM:
        return new Skiploom(s,e);
      case Pkm.JUMPLUFF:
        return new Jumpluff(s,e);
      case Pkm.SEEDOT:
        return new Seedot(s,e);
      case Pkm.NUZLEAF:
        return new Nuzleaf(s,e);
      case Pkm.SHIFTRY:
        return new Shiftry(s,e);
      case Pkm.STARLY:
        return new Starly(s,e);
      case Pkm.STARAVIA:
        return new Staravia(s,e);
      case Pkm.STARAPTOR:
        return new Staraptor(s,e);
      case Pkm.CHIKORITA:
        return new Chikorita(s,e);
      case Pkm.BAYLEEF:
        return new Bayleef(s,e);
      case Pkm.MEGANIUM:
        return new Meganium(s,e);
      case Pkm.CYNDAQUIL:
        return new Cyndaquil(s,e);
      case Pkm.QUILAVA:
        return new Quilava(s,e);
      case Pkm.TYPHLOSION:
        return new Typhlosion(s,e);
      case Pkm.TOTODILE:
        return new Totodile(s,e);
      case Pkm.CROCONAW:
        return new Croconaw(s,e);
      case Pkm.FERALIGATR:
        return new Feraligatr(s,e);
      case Pkm.TREECKO:
        return new Treecko(s,e);
      case Pkm.GROVYLE:
        return new Grovyle(s,e);
      case Pkm.SCEPTILE:
        return new Sceptile(s,e);
      case Pkm.TORCHIC:
        return new Torchic(s,e);
      case Pkm.COMBUSKEN:
        return new Combusken(s,e);
      case Pkm.BLAZIKEN:
        return new Blaziken(s,e);
      case Pkm.MUDKIP:
        return new Mudkip(s,e);
      case Pkm.MARSHTOMP:
        return new Marshtomp(s,e);
      case Pkm.SWAMPERT:
        return new Swampert(s,e);
      case Pkm.TURTWIG:
        return new Turtwig(s,e);
      case Pkm.GROTLE:
        return new Grotle(s,e);
      case Pkm.TORTERRA:
        return new Torterra(s,e);
      case Pkm.CHIMCHAR:
        return new Chimchar(s,e);
      case Pkm.MONFERNO:
        return new Monferno(s,e);
      case Pkm.INFERNAPE:
        return new Infernape(s,e);
      case Pkm.PIPLUP:
        return new Piplup(s,e);
      case Pkm.PRINPLUP:
        return new Prinplup(s,e);
      case Pkm.EMPOLEON:
        return new Empoleon(s,e);
      case Pkm.NIDORANF:
        return new NidoranF(s,e);
      case Pkm.NIDORINA:
        return new Nidorina(s,e);
      case Pkm.NIDOQUEEN:
        return new Nidoqueen(s,e);
      case Pkm.NIDORANM:
        return new NidoranM(s,e);
      case Pkm.NIDORINO:
        return new Nidorino(s,e);
      case Pkm.NIDOKING:
        return new Nidoking(s,e);
      case Pkm.PICHU:
        return new Pichu(s,e);
      case Pkm.PIKACHU:
        return new Pikachu(s,e);
      case Pkm.RAICHU:
        return new Raichu(s,e);
      case Pkm.MACHOP:
        return new Machop(s,e);
      case Pkm.MACHOKE:
        return new Machoke(s,e);
      case Pkm.MACHAMP:
        return new Machamp(s,e);
      case Pkm.HORSEA:
        return new Horsea(s,e);
      case Pkm.SEADRA:
        return new Seadra(s,e);
      case Pkm.KINGDRA:
        return new Kingdra(s,e);
      case Pkm.TRAPINCH:
        return new Trapinch(s,e);
      case Pkm.VIBRAVA:
        return new Vibrava(s,e);
      case Pkm.FLYGON:
        return new Flygon(s,e);
      case Pkm.SPHEAL:
        return new Spheal(s,e);
      case Pkm.SEALEO:
        return new Sealeo(s,e);
      case Pkm.WALREIN:
        return new Walrein(s,e);
      case Pkm.ARON:
        return new Aron(s,e);
      case Pkm.LAIRON:
        return new Lairon(s,e);
      case Pkm.AGGRON:
        return new Aggron(s,e);
      case Pkm.MAGNEMITE:
        return new Magnemite(s,e);
      case Pkm.MAGNETON:
        return new Magneton(s,e);
      case Pkm.MAGNEZONE:
        return new Magnezone(s,e);
      case Pkm.RHYHORN:
        return new Rhyhorn(s,e);
      case Pkm.RHYDON:
        return new Rhydon(s,e);
      case Pkm.RHYPERIOR:
        return new Rhyperior(s,e);
      case Pkm.TOGEPI:
        return new Togepi(s,e);
      case Pkm.TOGETIC:
        return new Togetic(s,e);
      case Pkm.TOGEKISS:
        return new Togekiss(s,e);
      case Pkm.DUSKULL:
        return new Duskull(s,e);
      case Pkm.DUSCLOPS:
        return new Dusclops(s,e);
      case Pkm.DUSKNOIR:
        return new Dusknoir(s,e);
      case Pkm.LOTAD:
        return new Lotad(s,e);
      case Pkm.LOMBRE:
        return new Lombre(s,e);
      case Pkm.LUDICOLO:
        return new Ludicolo(s,e);
      case Pkm.SHINX:
        return new Shinx(s,e);
      case Pkm.LUXIO:
        return new Luxio(s,e);
      case Pkm.LUXRAY:
        return new Luxray(s,e);
      case Pkm.POLIWAG:
        return new Poliwag(s,e);
      case Pkm.POLIWHIRL:
        return new Poliwhirl(s,e);
      case Pkm.POLITOED:
        return new Politoed(s,e);
      case Pkm.ABRA:
        return new Abra(s,e);
      case Pkm.KADABRA:
        return new Kadabra(s,e);
      case Pkm.ALAKAZAM:
        return new Alakazam(s,e);
      case Pkm.GASTLY:
        return new Gastly(s,e);
      case Pkm.HAUNTER:
        return new Haunter(s,e);
      case Pkm.GENGAR:
        return new Gengar(s,e);
      case Pkm.DRATINI:
        return new Dratini(s,e);
      case Pkm.DRAGONAIR:
        return new Dragonair(s,e);
      case Pkm.DRAGONITE:
        return new Dragonite(s,e);
      case Pkm.LARVITAR:
        return new Larvitar(s,e);
      case Pkm.PUPITAR:
        return new Pupitar(s,e);
      case Pkm.TYRANITAR:
        return new Tyranitar(s,e);
      case Pkm.SLAKOTH:
        return new Slakoth(s,e);
      case Pkm.VIGOROTH:
        return new Vigoroth(s,e);
      case Pkm.SLAKING:
        return new Slaking(s,e);
      case Pkm.RALTS:
        return new Ralts(s,e);
      case Pkm.KIRLIA:
        return new Kirlia(s,e);
      case Pkm.GARDEVOIR:
        return new Gardevoir(s,e);
      case Pkm.BAGON:
        return new Bagon(s,e);
      case Pkm.SHELGON:
        return new Shelgon(s,e);
      case Pkm.SALAMENCE:
        return new Salamence(s,e);
      case Pkm.BELDUM:
        return new Beldum(s,e);
      case Pkm.METANG:
        return new Metang(s,e);
      case Pkm.METAGROSS:
        return new Metagross(s,e);
      case Pkm.GIBLE:
        return new Gible(s,e);
      case Pkm.GABITE:
        return new Gabite(s,e);
      case Pkm.GARCHOMP:
        return new Garchomp(s,e);
      case Pkm.ELEKID:
        return new Elekid(s,e);
      case Pkm.ELECTABUZZ:
        return new Electabuzz(s,e);
      case Pkm.ELECTIVIRE:
        return new Electivire(s,e);
      case Pkm.MAGBY:
        return new Magby(s,e);
      case Pkm.MAGMAR:
        return new Magmar(s,e);
      case Pkm.MAGMORTAR:
        return new Magmortar(s,e);
      case Pkm.MUNCHLAX:
        return new Munchlax(s,e);
      case Pkm.SNORLAX:
        return new Snorlax(s,e);
      case Pkm.GROWLITHE:
        return new Growlithe(s,e);
      case Pkm.ARCANINE:
        return new Arcanine(s,e);
      case Pkm.ONIX:
        return new Onix(s,e);
      case Pkm.STEELIX:
        return new Steelix(s,e);
      case Pkm.MEGA_STEELIX:
        return new MegaSteelix(s,e);
      case Pkm.SCYTHER:
        return new Scyther(s,e);
      case Pkm.SCIZOR:
        return new Scizor(s,e);
      case Pkm.MEGA_SCIZOR:
        return new MegaScizor(s,e);
      case Pkm.RIOLU:
        return new Riolu(s,e);
      case Pkm.LUCARIO:
        return new Lucario(s,e);
      case Pkm.MEGA_LUCARIO:
        return new MegaLucario(s,e);
      case Pkm.MAGIKARP:
        return new Magikarp(s,e);
      case Pkm.RATTATA:
        return new Rattata(s,e);
      case Pkm.RATICATE:
        return new Raticate(s,e);
      case Pkm.SPEAROW:
        return new Spearow(s,e);
      case Pkm.FEAROW:
        return new Fearow(s,e);
      case Pkm.GYARADOS:
        return new Gyarados(s,e);
      case Pkm.LUGIA:
        return new Lugia(s,e);
      case Pkm.ZAPDOS:
        return new Zapdos(s,e);
      case Pkm.MOLTRES:
        return new Moltres(s,e);
      case Pkm.ARTICUNO:
        return new Articuno(s,e);
      case Pkm.DIALGA:
        return new Dialga(s,e);
      case Pkm.PALKIA:
        return new Palkia(s,e);
      case Pkm.SUICUNE:
        return new Suicune(s,e);
      case Pkm.RAIKOU:
        return new Raikou(s,e);
      case Pkm.ENTEI:
        return new Entei(s,e);
      case Pkm.KYOGRE:
        return new Kyogre(s,e);
      case Pkm.GROUDON:
        return new Groudon(s,e);
      case Pkm.RAYQUAZA:
        return new Rayquaza(s,e);
      case Pkm.MEGA_RAYQUAZA:
        return new MegaRayquaza(s,e);
      case Pkm.REGICE:
        return new Regice(s,e);
      case Pkm.REGIROCK:
        return new Regirock(s,e);
      case Pkm.REGISTEEL:
        return new Registeel(s,e);
      case Pkm.REGIGIGAS:
        return new Regigigas(s,e);
      case Pkm.GIRATINA:
        return new Giratina(s,e);
      case Pkm.EEVEE:
        return new Eevee(s,e);
      case Pkm.VAPOREON:
        return new Vaporeon(s,e);
      case Pkm.JOLTEON:
        return new Jolteon(s,e);
      case Pkm.FLAREON:
        return new Flareon(s,e);
      case Pkm.ESPEON:
        return new Espeon(s,e);
      case Pkm.UMBREON:
        return new Umbreon(s,e);
      case Pkm.LEAFEON:
        return new Leafeon(s,e);
      case Pkm.SYLVEON:
        return new Sylveon(s,e);
      case Pkm.GLACEON:
        return new Glaceon(s,e);
      case Pkm.MEDITITE:
        return new Meditite(s,e);
      case Pkm.MEDICHAM:
        return new Medicham(s,e);
      case Pkm.MEGA_MEDICHAM:
        return new MegaMedicham(s,e);
      case Pkm.NUMEL:
        return new Numel(s,e);
      case Pkm.CAMERUPT:
        return new Camerupt(s,e);
      case Pkm.MEGA_CAMERUPT:
        return new MegaCamerupt(s,e);
      case Pkm.DITTO:
        return new Ditto(s,e);
      case Pkm.SANDSHREW:
        return new Sandshrew(s,e);
      case Pkm.DARKRAI:
        return new Darkrai(s,e);
      case Pkm.LITWICK:
        return new Litwick(s,e);
      case Pkm.LAMPENT:
        return new Lampent(s,e);
      case Pkm.CHANDELURE:
        return new Chandelure(s,e);
      case Pkm.BELLSPROUT:
        return new Bellsprout(s,e);
      case Pkm.WEEPINBELL:
        return new Weepinbell(s,e);
      case Pkm.VICTREEBEL:
        return new Victreebel(s,e);
      case Pkm.SWINUB:
        return new Swinub(s,e);
      case Pkm.PILOSWINE:
        return new Piloswine(s,e);
      case Pkm.MAMOSWINE:
        return new Mamoswine(s,e);
      case Pkm.SNORUNT:
        return new Snorunt(s,e);
      case Pkm.GLALIE:
        return new Glalie(s,e);
      case Pkm.FROSLASS:
        return new Froslass(s,e);
      case Pkm.SNOVER:
        return new Snover(s,e);
      case Pkm.ABOMASNOW:
        return new Abomasnow(s,e);
      case Pkm.MEGA_ABOMASNOW:
        return new MegaAbomasnow(s,e);
      case Pkm.VANILLITE:
        return new Vanillite(s,e);
      case Pkm.VANILLISH:
        return new Vanillish(s,e);
      case Pkm.VANILLUXE:
        return new Vanilluxe(s,e);
      case Pkm.VOLCARONA:
        return new Volcarona(s,e);
      case Pkm.LANDORUS:
        return new Landorus(s,e);
      case Pkm.THUNDURUS:
        return new Thundurus(s,e);
      case Pkm.TORNADUS:
        return new Tornadus(s,e);
      case Pkm.KELDEO:
        return new Keldeo(s,e);
      case Pkm.TERRAKION:
        return new Terrakion(s,e);
      case Pkm.VIRIZION:
        return new Virizion(s,e);
      case Pkm.COBALION:
        return new Cobalion(s,e);
      case Pkm.MANAPHY:
        return new Manaphy(s,e);
      case Pkm.SPIRITOMB:
        return new Spiritomb(s,e);
      case Pkm.ABSOL:
        return new Absol(s,e);
      case Pkm.LAPRAS:
        return new Lapras(s,e);
      case Pkm.LATIAS:
        return new Latias(s,e);
      case Pkm.LATIOS:
        return new Latios(s,e);
      case Pkm.MESPRIT:
        return new Mesprit(s,e);
      case Pkm.AZELF:
        return new Azelf(s,e);
      case Pkm.UXIE:
        return new Uxie(s,e);
      case Pkm.MEWTWO:
        return new Mewtwo(s,e);
      case Pkm.KYUREM:
        return new Kyurem(s,e);
      case Pkm.RESHIRAM:
        return new Reshiram(s,e);
      case Pkm.ZEKROM:
        return new Zekrom(s,e);
      case Pkm.CELEBI:
        return new Celebi(s,e);
      case Pkm.VICTINI:
        return new Victini(s,e);
      case Pkm.JIRACHI:
        return new Jirachi(s,e);
      case Pkm.ARCEUS:
        return new Arceus(s,e);
      case Pkm.DEOXYS:
        return new Deoxys(s,e);
      case Pkm.SHAYMIN:
        return new Shaymin(s,e);
      case Pkm.CRESSELIA:
        return new Cresselia(s,e);
      case Pkm.HEATRAN:
        return new Heatran(s,e);
      case Pkm.HO_OH:
        return new HooH(s,e);
      case Pkm.ROTOM:
        return new Rotom(s,e);
      case Pkm.AERODACTYL:
        return new Aerodactyl(s,e);
      case Pkm.HOUNDOUR:
        return new Houndour(s,e);
      case Pkm.SWABLU:
        return new Swablu(s,e);
      case Pkm.CARVANHA:
        return new Carvanha(s,e);
      case Pkm.PRIMAL_KYOGRE:
        return new PrimalKyogre(s,e);
      case Pkm.PRIMAL_GROUDON:
        return new PrimalGroudon(s,e);
      case Pkm.MEOWTH:
        return new Meowth(s,e);
      case Pkm.PERSIAN:
        return new Persian(s,e);
      case Pkm.DEINO:
        return new Deino(s,e);
      case Pkm.ZWEILOUS:
        return new Zweilous(s,e);
      case Pkm.HYDREIGON:
        return new Hydreigon(s,e);
      case Pkm.SANDILE:
        return new Sandile(s,e);
      case Pkm.KROKOROK:
        return new Krookorok(s,e);
      case Pkm.KROOKODILE:
        return new Krookodile(s,e);
      case Pkm.SOLOSIS:
        return new Solosis(s,e);
      case Pkm.DUOSION:
        return new Duosion(s,e);
      case Pkm.REUNICLUS:
        return new Reuniclus(s,e);
      case Pkm.ODDISH:
        return new Oddish(s,e);
      case Pkm.GLOOM:
        return new Gloom(s,e);
      case Pkm.VILEPLUME:
        return new Vileplume(s,e);
      case Pkm.BELLOSSOM:
        return new Bellossom(s,e);
      case Pkm.AMAURA:
        return new Amaura(s,e);
      case Pkm.AURORUS:
        return new Aurorus(s,e);
      case Pkm.ANORITH:
        return new Anorith(s,e);
      case Pkm.ARMALDO:
        return new Armaldo(s,e);
      case Pkm.ARCHEN:
        return new Archen(s,e);
      case Pkm.ARCHEOPS:
        return new Archeops(s,e);
      case Pkm.SHIELDON:
        return new Shieldon(s,e);
      case Pkm.BASTIODON:
        return new Bastiodon(s,e);
      case Pkm.TIRTOUGA:
        return new Tirtouga(s,e);
      case Pkm.CARRACOSTA:
        return new Carracosta(s,e);
      case Pkm.LILEEP:
        return new Lileep(s,e);
      case Pkm.CRADILY:
        return new Cradily(s,e);
      case Pkm.OMANYTE:
        return new Omanyte(s,e);
      case Pkm.OMASTAR:
        return new Omastar(s,e);
      case Pkm.CRANIDOS:
        return new Cranidos(s,e);
      case Pkm.RAMPARDOS:
        return new Rampardos(s,e);
      case Pkm.TYRUNT:
        return new Tyrunt(s,e);
      case Pkm.TYRANTRUM:
        return new Tyrantrum(s,e);
      case Pkm.KABUTO:
        return new Kabuto(s,e);
      case Pkm.KABUTOPS:
        return new Kabutops(s,e);
      case Pkm.BUDEW:
        return new Budew(s,e);
      case Pkm.ROSELIA:
        return new Roselia(s,e);
      case Pkm.ROSERADE:
        return new Roserade(s,e);
      case Pkm.BUNEARY:
        return new Buneary(s,e);
      case Pkm.LOPUNNY:
        return new Lopunny(s,e);
      case Pkm.MEGA_LOPUNNY:
        return new MegaLopunny(s,e);
      case Pkm.AXEW:
        return new Axew(s,e);
      case Pkm.FRAXURE:
        return new Fraxure(s,e);
      case Pkm.HAXORUS:
        return new Haxorus(s,e);
      case Pkm.VENIPEDE:
        return new Venipede(s,e);
      case Pkm.WHIRLIPEDE:
        return new Whirlipede(s,e);
      case Pkm.SCOLIPEDE:
        return new Scolipede(s,e);
      case Pkm.PORYGON:
        return new Porygon(s,e);
      case Pkm.PORYGON_2:
        return new Porygon2(s,e);
      case Pkm.PORYGON_Z:
        return new PorygonZ(s,e);
      case Pkm.KLINK:
        return new Klink(s,e);
      case Pkm.KLANG:
        return new Klang(s,e);
      case Pkm.KLINKLANG:
        return new Klinklang(s,e);
      case Pkm.ELECTRIKE:
        return new Electrike(s,e);
      case Pkm.MANECTRIC:
        return new Manectric(s,e);
      case Pkm.MEGA_MANECTRIC:
        return new MegaManectric(s,e);
      case Pkm.SHUPPET:
        return new Shuppet(s,e);
      case Pkm.BANETTE:
        return new Banette(s,e);
      case Pkm.MEGA_BANETTE:
        return new MegaBanette(s,e);
      case Pkm.HONEDGE:
        return new Honedge(s,e);
      case Pkm.DOUBLADE:
        return new Doublade(s,e);
      case Pkm.AEGISLASH:
        return new Aegislash(s,e);
      case Pkm.CUBONE:
        return new Cubone(s,e);
      case Pkm.MAROWAK:
        return new Marowak(s,e);
      case Pkm.ALOLAN_MAROWAK:
        return new AlolanMarowak(s,e);
      case Pkm.FLETCHLING:
        return new Fletchling(s,e);
      case Pkm.FLETCHINDER:
        return new Fletchinder(s,e);
      case Pkm.TALONFLAME:
        return new Talonflame(s,e);
      case Pkm.WHISMUR:
        return new Whismur(s,e);
      case Pkm.LOUDRED:
        return new Loudred(s,e);
      case Pkm.EXPLOUD:
        return new Exploud(s,e);
      case Pkm.TYMPOLE:
        return new Tympole(s,e);
      case Pkm.PALPITOAD:
        return new Palpitoad(s,e);
      case Pkm.SEISMITOAD:
        return new Seismitoad(s,e);
      case Pkm.SEWADDLE:
        return new Sewaddle(s,e);
      case Pkm.SWADLOON:
        return new Swadloon(s,e);
      case Pkm.LEAVANNY:
        return new Leavanny(s,e);
      case Pkm.PIKIPEK:
        return new Pikipek(s,e);
      case Pkm.TRUMBEAK:
        return new Trumbeak(s,e);
      case Pkm.TOUCANNON:
        return new Toucannon(s,e);
      case Pkm.FLABEBE:
        return new Flabebe(s,e);
      case Pkm.FLOETTE:
        return new Floette(s,e);
      case Pkm.FLORGES:
        return new Florges(s,e);
      case Pkm.JANGMO_O:
        return new JangmoO(s,e);
      case Pkm.HAKAMO_O:
        return new HakamoO(s,e);
      case Pkm.KOMMO_O:
        return new KommoO(s,e);
      case Pkm.MELOETTA:
        return new Meloetta(s,e);
      case Pkm.ALTARIA:
        return new Altaria(s,e);
      case Pkm.MEGA_ALTARIA:
        return new MegaAltaria(s,e);
      case Pkm.LILLIPUP:
        return new Lillipup(s,e);
      case Pkm.HERDIER:
        return new Herdier(s,e);
      case Pkm.STOUTLAND:
        return new Stoutland(s,e);
      case Pkm.CASTFORM:
        return new Castform(s,e);
      case Pkm.CASTFORM_SUN:
        return new CastformSun(s,e);
      case Pkm.CASTFORM_RAIN:
        return new CastformRain(s,e);
      case Pkm.CASTFORM_HAIL:
        return new CastformHail(s,e);
      case Pkm.DEFAULT:
        return new Magikarp(s,e);
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

  static getRandomFossil(board: MapSchema<IPokemon>) {
    const currentFossils = [];
    board.forEach( (p) =>{
      if (p.types.includes(Synergy.FOSSIL)) {
        currentFossils.push(p.name);
      }
    });
    const possibleFossils = [];
    PRECOMPUTED_TYPE_POKEMONS[Synergy.FOSSIL].pokemons.forEach((p)=>{
      if (!currentFossils.includes(p)) {
        possibleFossils.push(p);
      }
    });
    if (possibleFossils.length > 0) {
      return possibleFossils[Math.floor(Math.random() * possibleFossils.length)];
    } else {
      return Pkm.AERODACTYL;
    }
  }
}
