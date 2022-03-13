import {Pokemon, Bulbasaur, Abomasnow, Abra, Absol, Aegislash, Aerodactyl, Aggron, Alakazam, AlolanMarowak, Altaria, Amaura, Ampharos, Anorith, Arcanine, Arceus, Archen, Archeops, Armaldo, Aron, Articuno, Aurorus, Axew, Azelf, Azumarill, Azurill, Bagon, Banette, Bastiodon, Bayleef, Beedrill, Beldum, Bellossom, Bellsprout, Blastoise, Blaziken, Budew, Buneary, Butterfree, Camerupt, Carracosta, Carvanha, Castform, CastformHail, CastformRain, CastformSun, Caterpie, Celebi, Chandelure, Charizard, Charmander, Charmeleon, Chikorita, Chimchar, Clefable, Clefairy, Cleffa, Cobalion, Combusken, Cradily, Cranidos, Cresselia, Crobat, Croconaw, Cubone, Cyndaquil, Darkrai, Deino, Deoxys, Dialga, Ditto, Doublade, Dragonair, Dragonite, Dratini, Duosion, Dusclops, Dusknoir, Duskull, Eevee, Electabuzz, Electivire, Electrike, Elekid, Empoleon, Entei, Espeon, Exploud, Fearow, Feraligatr, Flabebe, Flaffy, Flareon, Fletchinder, Fletchling, Floette, Florges, Flygon, Fraxure, Froslass, Gabite, Garchomp, Gardevoir, Gastly, Gengar, Geodude, Gible, Giratina, Glaceon, Glalie, Gloom, Golbat, Golem, Graveler, Grotle, Groudon, Grovyle, Growlithe, Gyarados, HakamoO, Haunter, Haxorus, Heatran, Herdier, Honedge, HooH, Hoppip, Horsea, Houndour, Hydreigon, Igglybuff, Infernape, Ivysaur, JangmoO, Jigglypuff, Jirachi, Jolteon, Jumpluff, Kabuto, Kabutops, Kadabra, Kakuna, Keldeo, Kingdra, Kirlia, Klang, Klink, Klinklang, KommoO, Krookodile, Krookorok, Kyogre, Kyurem, Lairon, Lampent, Landorus, Lapras, Larvitar, Latias, Latios, Leafeon, Leavanny, Lileep, Lillipup, Litwick, Lombre, Lopunny, Lotad, Loudred, Lucario, Ludicolo, Lugia, Luxio, Luxray, Machamp, Machoke, Machop, Magby, Magikarp, Magmar, Magmortar, Magnemite, Magneton, Magnezone, Mamoswine, Manaphy, Manectric, Mareep, Marill, Marowak, Marshtomp, Medicham, Meditite, MegaAbomasnow, MegaAltaria, MegaBanette, MegaCamerupt, MegaLopunny, MegaLucario, MegaManectric, MegaMedicham, Meganium, MegaRayquaza, MegaScizor, MegaSteelix, Meloetta, Meowth, Mesprit, Metagross, Metang, Metapod, Mewtwo, Moltres, Monferno, Mudkip, Munchlax, Nidoking, Nidoqueen, NidoranF, NidoranM, Nidorina, Nidorino, Numel, Nuzleaf, Oddish, Omanyte, Omastar, Onix, Palkia, Palpitoad, Persian, Pichu, Pidgeot, Pidgeotto, Pidgey, Pikachu, Pikipek, Piloswine, Piplup, Politoed, Poliwag, Poliwhirl, Porygon, Porygon2, PorygonZ, PrimalGroudon, PrimalKyogre, Prinplup, Pupitar, Quilava, Raichu, Raikou, Ralts, Rampardos, Raticate, Rattata, Rayquaza, Regice, Regigigas, Regirock, Registeel, Reshiram, Reuniclus, Rhydon, Rhyhorn, Rhyperior, Riolu, Roselia, Roserade, Rotom, Salamence, Sandile, Sandshrew, Sceptile, Scizor, Scolipede, Scyther, Seadra, Sealeo, Seedot, Seismitoad, Sewaddle, Shaymin, Shelgon, Shieldon, Shiftry, Shinx, Shuppet, Skiploom, Slaking, Slakoth, Slowbro, Slowking, Slowpoke, Snorlax, Snorunt, Snover, Solosis, Spearow, Spheal, Spiritomb, Squirtle, Staraptor, Staravia, Starly, Steelix, Stoutland, Suicune, Swablu, Swadloon, Swampert, Swinub, Sylveon, Talonflame, Terrakion, Thundurus, Tirtouga, Togekiss, Togepi, Togetic, Torchic, Tornadus, Torterra, Totodile, Toucannon, Trapinch, Treecko, Trumbeak, Turtwig, Tympole, Typhlosion, Tyranitar, Tyrantrum, Tyrunt, Umbreon, Uxie, Vanillish, Vanillite, Vanilluxe, Vaporeon, Venipede, Venusaur, Vibrava, Victini, Victreebel, Vigoroth, Vileplume, Virizion, Volcarona, Walrein, Wartortle, Weedle, Weepinbell, Whirlipede, Whismur, Wigglytuff, Zapdos, Zekrom, Zubat, Zweilous} from './colyseus-models/pokemon';
import {SPECIAL_SKILL, PKM, PRECOMPUTED_TYPE_POKEMONS, TYPE} from './enum';
import Board from '../core/board';
import {AttackStrategy, BiteStrategy, BlastBurnStrategy, BlazeKickStrategy, BonemerangStrategy, BugBuzzStrategy, BurnStrategy, CalmMindStrategy, ChargeStrategy, ClangorousSoulStrategy, ConfusionStrategy, DarkPulseStrategy, DisarmingVoiceStrategy, DischargeStrategy, DracoMeteorStrategy, DragonBreathStrategy, DragonTailStrategy, EchoStrategy, ExplosionStrategy, FireBlastStrategy, FreezeStrategy, GrassWhistleStrategy, GrowlStrategy, GuillotineStrategy, HappyHourStrategy, HeadSmashStrategy, HealBlockStrategy, HeatWaveStrategy, HighJumpKickStrategy, HurricaneStrategy, HydroPumpStrategy, HyperVoiceStrategy, IcicleCrashStrategy, IronDefenseStrategy, IronTailStrategy, KingShieldStrategy, LeechLifeStrategy, MeteorMashStrategy, MetronomeStrategy, NastyPlotStrategy, NightmareStrategy, NightSlashStrategy, OriginPulseStrategy, PetalDanceStrategy, PoisonStingStrategy, PoisonStrategy, ProtectStrategy, RelicSongStrategy, RoarOfTimeStrategy, RockSlideStrategy, RockSmashStrategy, RockTombStrategy, RootStrategy, SeedFlareStrategy, SeismicTossStrategy, ShadowCloneStrategy, SilenceStrategy, SleepStrategy, SoakStrategy, StompStrategy, StunSporeStrategy, TeleportStrategy, ThiefStrategy, ThunderStrategy, TormentStrategy, TriAttackStrategy, VoltSwitchStrategy, WheelOfFireStrategy, WishStrategy} from '../core/attack-strategy';
import {MapSchema} from  '@colyseus/schema';

export default class PokemonFactory {
  static getNeutralPokemonsByLevelStage(level: number) {
    const pokemons = new MapSchema<Pokemon>();
    switch (level) {
      case 1:
        const magikarp1 = PokemonFactory.createPokemonFromName(PKM.MAGIKARP);
        magikarp1.positionX = 3;
        magikarp1.positionY = 1;
        const magikarp2 = PokemonFactory.createPokemonFromName(PKM.MAGIKARP);
        magikarp2.positionX = 5;
        magikarp2.positionY = 1;
        pokemons.set(magikarp1.id, magikarp1);
        pokemons.set(magikarp2.id, magikarp2);
        break;

      case 2:
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

      case 3:
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

      case 10:
        const gyarados = PokemonFactory.createPokemonFromName(PKM.GYARADOS);
        gyarados.positionX = 4;
        gyarados.positionY = 2;
        pokemons.set(gyarados.id, gyarados);
        break;

      case 15:
        const lugia = PokemonFactory.createPokemonFromName(PKM.LUGIA);
        lugia.positionX = 4;
        lugia.positionY = 2;
        pokemons.set(lugia.id, lugia);
        break;

      case 20:
        const giratina = PokemonFactory.createPokemonFromName(PKM.GIRATINA);
        giratina.positionX = 4;
        giratina.positionY = 2;
        pokemons.set(giratina.id, giratina);
        break;

      case 25:
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

      case 30:
        const dialga = PokemonFactory.createPokemonFromName(PKM.DIALGA);
        dialga.positionX = 2;
        dialga.positionY = 2;
        pokemons.set(dialga.id, dialga);
        const palkia = PokemonFactory.createPokemonFromName(PKM.PALKIA);
        palkia.positionX = 6;
        palkia.positionY = 2;
        pokemons.set(palkia.id, palkia);
        break;

      case 35:
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

      case 40:
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

      default:
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
    return pokemons;
  }

  static createStrategyFromName(name: string) {
    switch (name) {
      case SPECIAL_SKILL.KING_SHIELD:
        return new KingShieldStrategy();

      case SPECIAL_SKILL.EXPLOSION:
        return new ExplosionStrategy();

      case SPECIAL_SKILL.NIGHTMARE:
        return new NightmareStrategy();

      case SPECIAL_SKILL.CLANGOROUS_SOUL:
        return new ClangorousSoulStrategy();

      case SPECIAL_SKILL.BONEMERANG:
        return new BonemerangStrategy();

      case SPECIAL_SKILL.GROWL:
        return new GrowlStrategy();

      case SPECIAL_SKILL.RELIC_SONG:
        return new RelicSongStrategy();

      case SPECIAL_SKILL.DISARMING_VOICE:
        return new DisarmingVoiceStrategy();

      case SPECIAL_SKILL.HIGH_JUMP_KICK:
        return new HighJumpKickStrategy();

      case SPECIAL_SKILL.GRASS_WHISTLE:
        return new GrassWhistleStrategy();

      case SPECIAL_SKILL.TRI_ATTACK:
        return new TriAttackStrategy();

      case SPECIAL_SKILL.ECHO:
        return new EchoStrategy();

      case SPECIAL_SKILL.PETAL_DANCE:
        return new PetalDanceStrategy();

      case SPECIAL_SKILL.HYPER_VOICE:
        return new HyperVoiceStrategy();

      case SPECIAL_SKILL.SHADOW_CLONE:
        return new ShadowCloneStrategy();

      case SPECIAL_SKILL.VOLT_SWITCH:
        return new VoltSwitchStrategy();

      case SPECIAL_SKILL.FIRE_BLAST:
        return new FireBlastStrategy();

      case SPECIAL_SKILL.WHEEL_OF_FIRE:
        return new WheelOfFireStrategy();

      case SPECIAL_SKILL.SEISMIC_TOSS:
        return new SeismicTossStrategy();

      case SPECIAL_SKILL.GUILLOTINE:
        return new GuillotineStrategy();

      case SPECIAL_SKILL.ROCK_SLIDE:
        return new RockSlideStrategy();

      case SPECIAL_SKILL.HEAT_WAVE:
        return new HeatWaveStrategy();

      case SPECIAL_SKILL.THUNDER:
        return new ThunderStrategy();

      case SPECIAL_SKILL.HYDRO_PUMP:
        return new HydroPumpStrategy();

      case SPECIAL_SKILL.DRACO_METEOR:
        return new DracoMeteorStrategy();

      case SPECIAL_SKILL.BLAZE_KICK:
        return new BlazeKickStrategy();

      case SPECIAL_SKILL.WISH:
        return new WishStrategy();

      case SPECIAL_SKILL.CALM_MIND:
        return new CalmMindStrategy();

      case SPECIAL_SKILL.IRON_DEFENSE:
        return new IronDefenseStrategy();

      case SPECIAL_SKILL.METRONOME:
        return new MetronomeStrategy();

      case SPECIAL_SKILL.SOAK:
        return new SoakStrategy();

      case SPECIAL_SKILL.IRON_TAIL:
        return new IronTailStrategy();

      case SPECIAL_SKILL.BLAST_BURN:
        return new BlastBurnStrategy();

      case SPECIAL_SKILL.CHARGE:
        return new ChargeStrategy();

      case SPECIAL_SKILL.DISCHARGE:
        return new DischargeStrategy();

      case SPECIAL_SKILL.BITE:
        return new BiteStrategy();

      case SPECIAL_SKILL.DRAGON_TAIL:
        return new DragonTailStrategy();

      case SPECIAL_SKILL.DRAGON_BREATH:
        return new DragonBreathStrategy();

      case SPECIAL_SKILL.ICICLE_CRASH:
        return new IcicleCrashStrategy();

      case SPECIAL_SKILL.ROOT:
        return new RootStrategy();

      case SPECIAL_SKILL.TORMENT:
        return new TormentStrategy();

      case SPECIAL_SKILL.STOMP:
        return new StompStrategy();

      case SPECIAL_SKILL.DARK_PULSE:
        return new DarkPulseStrategy();

      case SPECIAL_SKILL.NIGHT_SLASH:
        return new NightSlashStrategy();

      case SPECIAL_SKILL.BUG_BUZZ:
        return new BugBuzzStrategy();

      case SPECIAL_SKILL.POISON_STING:
        return new PoisonStingStrategy();

      case SPECIAL_SKILL.LEECH_LIFE:
        return new LeechLifeStrategy();

      case SPECIAL_SKILL.HAPPY_HOUR:
        return new HappyHourStrategy();

      case SPECIAL_SKILL.TELEPORT:
        return new TeleportStrategy();

      case SPECIAL_SKILL.NASTY_PLOT:
        return new NastyPlotStrategy();

      case SPECIAL_SKILL.THIEF:
        return new ThiefStrategy();

      case SPECIAL_SKILL.STUN_SPORE:
        return new StunSporeStrategy();

      case SPECIAL_SKILL.METEOR_MASH:
        return new MeteorMashStrategy();

      case SPECIAL_SKILL.HURRICANE:
        return new HurricaneStrategy();

      case SPECIAL_SKILL.BURN:
        return new BurnStrategy();

      case SPECIAL_SKILL.SLEEP:
        return new SleepStrategy();

      case SPECIAL_SKILL.SILENCE:
        return new SilenceStrategy();

      case SPECIAL_SKILL.CONFUSION:
        return new ConfusionStrategy();

      case SPECIAL_SKILL.FREEZE:
        return new FreezeStrategy();

      case SPECIAL_SKILL.PROTECT:
        return new ProtectStrategy();

      case SPECIAL_SKILL.POISON:
        return new PoisonStrategy();

      case SPECIAL_SKILL.ORIGIN_PULSE:
        return new OriginPulseStrategy();

      case SPECIAL_SKILL.SEED_FLARE:
        return new SeedFlareStrategy();

      case SPECIAL_SKILL.HEAL_BLOCK:
        return new HealBlockStrategy();

      case SPECIAL_SKILL.ROAR_OF_TIME:
        return new RoarOfTimeStrategy();

      case SPECIAL_SKILL.ROCK_TOMB:
        return new RockTombStrategy();

      case SPECIAL_SKILL.ROCK_SMASH:
        return new RockSmashStrategy();

      case SPECIAL_SKILL.HEAD_SMASH:
        return new HeadSmashStrategy();

      case SPECIAL_SKILL.DEFAULT:
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

  static createPokemonFromName(name: string) {
    switch (name) {
      case PKM.BULBASAUR:
        return new Bulbasaur();
      case PKM.IVYSAUR:
        return new Ivysaur();
      case PKM.VENUSAUR:
        return new Venusaur();
      case PKM.CHARMANDER:
        return new Charmander();
      case PKM.CHARMELEON:
        return new Charmeleon();
      case PKM.CHARIZARD:
        return new Charizard();
      case PKM.SQUIRTLE:
        return new Squirtle();
      case PKM.WARTORTLE:
        return new Wartortle();
      case PKM.BLASTOISE:
        return new Blastoise();
      case PKM.SLOWPOKE:
        return new Slowpoke();
      case PKM.SLOWBRO:
        return new Slowbro();
      case PKM.SLOWKING:
        return new Slowking();
      case PKM.GEODUDE:
        return new Geodude();
      case PKM.GRAVELER:
        return new Graveler();
      case PKM.GOLEM:
        return new Golem();
      case PKM.AZURILL:
        return new Azurill();
      case PKM.MARILL:
        return new Marill();
      case PKM.AZUMARILL:
        return new Azumarill();
      case PKM.ZUBAT:
        return new Zubat();
      case PKM.GOLBAT:
        return new Golbat();
      case PKM.CROBAT:
        return new Crobat();
      case PKM.AMPHAROS:
        return new Ampharos();
      case PKM.MAREEP:
        return new Mareep();
      case PKM.FLAFFY:
        return new Flaffy();
      case PKM.CLEFFA:
        return new Cleffa();
      case PKM.CLEFAIRY:
        return new Clefairy();
      case PKM.CLEFABLE:
        return new Clefable();
      case PKM.IGGLYBUFF:
        return new Igglybuff();
      case PKM.JIGGLYPUFF:
        return new Jigglypuff();
      case PKM.WIGGLYTUFF:
        return new Wigglytuff();
      case PKM.CATERPIE:
        return new Caterpie();
      case PKM.METAPOD:
        return new Metapod();
      case PKM.BUTTERFREE:
        return new Butterfree();
      case PKM.WEEDLE:
        return new Weedle();
      case PKM.KAKUNA:
        return new Kakuna();
      case PKM.BEEDRILL:
        return new Beedrill();
      case PKM.PIDGEY:
        return new Pidgey();
      case PKM.PIDGEOTTO:
        return new Pidgeotto();
      case PKM.PIDGEOT:
        return new Pidgeot();
      case PKM.HOPPIP:
        return new Hoppip();
      case PKM.SKIPLOOM:
        return new Skiploom();
      case PKM.JUMPLUFF:
        return new Jumpluff();
      case PKM.SEEDOT:
        return new Seedot();
      case PKM.NUZLEAF:
        return new Nuzleaf();
      case PKM.SHIFTRY:
        return new Shiftry();
      case PKM.STARLY:
        return new Starly();
      case PKM.STARAVIA:
        return new Staravia();
      case PKM.STARAPTOR:
        return new Staraptor();
      case PKM.CHIKORITA:
        return new Chikorita();
      case PKM.BAYLEEF:
        return new Bayleef();
      case PKM.MEGANIUM:
        return new Meganium();
      case PKM.CYNDAQUIL:
        return new Cyndaquil();
      case PKM.QUILAVA:
        return new Quilava();
      case PKM.TYPHLOSION:
        return new Typhlosion();
      case PKM.TOTODILE:
        return new Totodile();
      case PKM.CROCONAW:
        return new Croconaw();
      case PKM.FERALIGATR:
        return new Feraligatr();
      case PKM.TREECKO:
        return new Treecko();
      case PKM.GROVYLE:
        return new Grovyle();
      case PKM.SCEPTILE:
        return new Sceptile();
      case PKM.TORCHIC:
        return new Torchic();
      case PKM.COMBUSKEN:
        return new Combusken();
      case PKM.BLAZIKEN:
        return new Blaziken();
      case PKM.MUDKIP:
        return new Mudkip();
      case PKM.MARSHTOMP:
        return new Marshtomp();
      case PKM.SWAMPERT:
        return new Swampert();
      case PKM.TURTWIG:
        return new Turtwig();
      case PKM.GROTLE:
        return new Grotle();
      case PKM.TORTERRA:
        return new Torterra();
      case PKM.CHIMCHAR:
        return new Chimchar();
      case PKM.MONFERNO:
        return new Monferno();
      case PKM.INFERNAPE:
        return new Infernape();
      case PKM.PIPLUP:
        return new Piplup();
      case PKM.PRINPLUP:
        return new Prinplup();
      case PKM.EMPOLEON:
        return new Empoleon();
      case PKM.NIDORANF:
        return new NidoranF();
      case PKM.NIDORINA:
        return new Nidorina();
      case PKM.NIDOQUEEN:
        return new Nidoqueen();
      case PKM.NIDORANM:
        return new NidoranM();
      case PKM.NIDORINO:
        return new Nidorino();
      case PKM.NIDOKING:
        return new Nidoking();
      case PKM.PICHU:
        return new Pichu();
      case PKM.PIKACHU:
        return new Pikachu();
      case PKM.RAICHU:
        return new Raichu();
      case PKM.MACHOP:
        return new Machop();
      case PKM.MACHOKE:
        return new Machoke();
      case PKM.MACHAMP:
        return new Machamp();
      case PKM.HORSEA:
        return new Horsea();
      case PKM.SEADRA:
        return new Seadra();
      case PKM.KINGDRA:
        return new Kingdra();
      case PKM.TRAPINCH:
        return new Trapinch();
      case PKM.VIBRAVA:
        return new Vibrava();
      case PKM.FLYGON:
        return new Flygon();
      case PKM.SPHEAL:
        return new Spheal();
      case PKM.SEALEO:
        return new Sealeo();
      case PKM.WALREIN:
        return new Walrein();
      case PKM.ARON:
        return new Aron();
      case PKM.LAIRON:
        return new Lairon();
      case PKM.AGGRON:
        return new Aggron();
      case PKM.MAGNEMITE:
        return new Magnemite();
      case PKM.MAGNETON:
        return new Magneton();
      case PKM.MAGNEZONE:
        return new Magnezone();
      case PKM.RHYHORN:
        return new Rhyhorn();
      case PKM.RHYDON:
        return new Rhydon();
      case PKM.RHYPERIOR:
        return new Rhyperior();
      case PKM.TOGEPI:
        return new Togepi();
      case PKM.TOGETIC:
        return new Togetic();
      case PKM.TOGEKISS:
        return new Togekiss();
      case PKM.DUSKULL:
        return new Duskull();
      case PKM.DUSCLOPS:
        return new Dusclops();
      case PKM.DUSKNOIR:
        return new Dusknoir();
      case PKM.LOTAD:
        return new Lotad();
      case PKM.LOMBRE:
        return new Lombre();
      case PKM.LUDICOLO:
        return new Ludicolo();
      case PKM.SHINX:
        return new Shinx();
      case PKM.LUXIO:
        return new Luxio();
      case PKM.LUXRAY:
        return new Luxray();
      case PKM.POLIWAG:
        return new Poliwag();
      case PKM.POLIWHIRL:
        return new Poliwhirl();
      case PKM.POLITOED:
        return new Politoed();
      case PKM.ABRA:
        return new Abra();
      case PKM.KADABRA:
        return new Kadabra();
      case PKM.ALAKAZAM:
        return new Alakazam();
      case PKM.GASTLY:
        return new Gastly();
      case PKM.HAUNTER:
        return new Haunter();
      case PKM.GENGAR:
        return new Gengar();
      case PKM.DRATINI:
        return new Dratini();
      case PKM.DRAGONAIR:
        return new Dragonair();
      case PKM.DRAGONITE:
        return new Dragonite();
      case PKM.LARVITAR:
        return new Larvitar();
      case PKM.PUPITAR:
        return new Pupitar();
      case PKM.TYRANITAR:
        return new Tyranitar();
      case PKM.SLAKOTH:
        return new Slakoth();
      case PKM.VIGOROTH:
        return new Vigoroth();
      case PKM.SLAKING:
        return new Slaking();
      case PKM.RALTS:
        return new Ralts();
      case PKM.KIRLIA:
        return new Kirlia();
      case PKM.GARDEVOIR:
        return new Gardevoir();
      case PKM.BAGON:
        return new Bagon();
      case PKM.SHELGON:
        return new Shelgon();
      case PKM.SALAMENCE:
        return new Salamence();
      case PKM.BELDUM:
        return new Beldum();
      case PKM.METANG:
        return new Metang();
      case PKM.METAGROSS:
        return new Metagross();
      case PKM.GIBLE:
        return new Gible();
      case PKM.GABITE:
        return new Gabite();
      case PKM.GARCHOMP:
        return new Garchomp();
      case PKM.ELEKID:
        return new Elekid();
      case PKM.ELECTABUZZ:
        return new Electabuzz();
      case PKM.ELECTIVIRE:
        return new Electivire();
      case PKM.MAGBY:
        return new Magby();
      case PKM.MAGMAR:
        return new Magmar();
      case PKM.MAGMORTAR:
        return new Magmortar();
      case PKM.MUNCHLAX:
        return new Munchlax();
      case PKM.SNORLAX:
        return new Snorlax();
      case PKM.GROWLITHE:
        return new Growlithe();
      case PKM.ARCANINE:
        return new Arcanine();
      case PKM.ONIX:
        return new Onix();
      case PKM.STEELIX:
        return new Steelix();
      case PKM.MEGASTEELIX:
        return new MegaSteelix();
      case PKM.SCYTHER:
        return new Scyther();
      case PKM.SCIZOR:
        return new Scizor();
      case PKM.MEGASCIZOR:
        return new MegaScizor();
      case PKM.RIOLU:
        return new Riolu();
      case PKM.LUCARIO:
        return new Lucario();
      case PKM.MEGALUCARIO:
        return new MegaLucario();
      case PKM.MAGIKARP:
        return new Magikarp();
      case PKM.RATTATA:
        return new Rattata();
      case PKM.RATICATE:
        return new Raticate();
      case PKM.SPEAROW:
        return new Spearow();
      case PKM.FEAROW:
        return new Fearow();
      case PKM.GYARADOS:
        return new Gyarados();
      case PKM.LUGIA:
        return new Lugia();
      case PKM.ZAPDOS:
        return new Zapdos();
      case PKM.MOLTRES:
        return new Moltres();
      case PKM.ARTICUNO:
        return new Articuno();
      case PKM.DIALGA:
        return new Dialga();
      case PKM.PALKIA:
        return new Palkia();
      case PKM.SUICUNE:
        return new Suicune();
      case PKM.RAIKOU:
        return new Raikou();
      case PKM.ENTEI:
        return new Entei();
      case PKM.KYOGRE:
        return new Kyogre();
      case PKM.GROUDON:
        return new Groudon();
      case PKM.RAYQUAZA:
        return new Rayquaza();
      case PKM.MEGARAYQUAZA:
        return new MegaRayquaza();
      case PKM.REGICE:
        return new Regice();
      case PKM.REGIROCK:
        return new Regirock();
      case PKM.REGISTEEL:
        return new Registeel();
      case PKM.REGIGIGAS:
        return new Regigigas();
      case PKM.GIRATINA:
        return new Giratina();
      case PKM.EEVEE:
        return new Eevee();
      case PKM.VAPOREON:
        return new Vaporeon();
      case PKM.JOLTEON:
        return new Jolteon();
      case PKM.FLAREON:
        return new Flareon();
      case PKM.ESPEON:
        return new Espeon();
      case PKM.UMBREON:
        return new Umbreon();
      case PKM.LEAFEON:
        return new Leafeon();
      case PKM.SYLVEON:
        return new Sylveon();
      case PKM.GLACEON:
        return new Glaceon();
      case PKM.MEDITITE:
        return new Meditite();
      case PKM.MEDICHAM:
        return new Medicham();
      case PKM.MEGAMEDICHAM:
        return new MegaMedicham();
      case PKM.NUMEL:
        return new Numel();
      case PKM.CAMERUPT:
        return new Camerupt();
      case PKM.MEGACAMERUPT:
        return new MegaCamerupt();
      case PKM.DITTO:
        return new Ditto();
      case PKM.SANDSHREW:
        return new Sandshrew();
      case PKM.DARKRAI:
        return new Darkrai();
      case PKM.LITWICK:
        return new Litwick();
      case PKM.LAMPENT:
        return new Lampent();
      case PKM.CHANDELURE:
        return new Chandelure();
      case PKM.BELLSPROUT:
        return new Bellsprout();
      case PKM.WEEPINBELL:
        return new Weepinbell();
      case PKM.VICTREEBEL:
        return new Victreebel();
      case PKM.SWINUB:
        return new Swinub();
      case PKM.PILOSWINE:
        return new Piloswine();
      case PKM.MAMOSWINE:
        return new Mamoswine();
      case PKM.SNORUNT:
        return new Snorunt();
      case PKM.GLALIE:
        return new Glalie();
      case PKM.FROSLASS:
        return new Froslass();
      case PKM.SNOVER:
        return new Snover();
      case PKM.ABOMASNOW:
        return new Abomasnow();
      case PKM.MEGAABOMASNOW:
        return new MegaAbomasnow();
      case PKM.VANILLITE:
        return new Vanillite();
      case PKM.VANILLISH:
        return new Vanillish();
      case PKM.VANILLUXE:
        return new Vanilluxe();
      case PKM.VOLCARONA:
        return new Volcarona();
      case PKM.LANDORUS:
        return new Landorus();
      case PKM.THUNDURUS:
        return new Thundurus();
      case PKM.TORNADUS:
        return new Tornadus();
      case PKM.KELDEO:
        return new Keldeo();
      case PKM.TERRAKION:
        return new Terrakion();
      case PKM.VIRIZION:
        return new Virizion();
      case PKM.COBALION:
        return new Cobalion();
      case PKM.MANAPHY:
        return new Manaphy();
      case PKM.SPIRITOMB:
        return new Spiritomb();
      case PKM.ABSOL:
        return new Absol();
      case PKM.LAPRAS:
        return new Lapras();
      case PKM.LATIAS:
        return new Latias();
      case PKM.LATIOS:
        return new Latios();
      case PKM.MESPRIT:
        return new Mesprit();
      case PKM.AZELF:
        return new Azelf();
      case PKM.UXIE:
        return new Uxie();
      case PKM.MEWTWO:
        return new Mewtwo();
      case PKM.KYUREM:
        return new Kyurem();
      case PKM.RESHIRAM:
        return new Reshiram();
      case PKM.ZEKROM:
        return new Zekrom();
      case PKM.CELEBI:
        return new Celebi();
      case PKM.VICTINI:
        return new Victini();
      case PKM.JIRACHI:
        return new Jirachi();
      case PKM.ARCEUS:
        return new Arceus();
      case PKM.DEOXYS:
        return new Deoxys();
      case PKM.SHAYMIN:
        return new Shaymin();
      case PKM.CRESSELIA:
        return new Cresselia();
      case PKM.HEATRAN:
        return new Heatran();
      case PKM.HOOH:
        return new HooH();
      case PKM.ROTOM:
        return new Rotom();
      case PKM.AERODACTYL:
        return new Aerodactyl();
      case PKM.HOUNDOUR:
        return new Houndour();
      case PKM.SWABLU:
        return new Swablu();
      case PKM.CARVANHA:
        return new Carvanha();
      case PKM.PRIMALKYOGRE:
        return new PrimalKyogre();
      case PKM.PRIMALGROUDON:
        return new PrimalGroudon();
      case PKM.MEOWTH:
        return new Meowth();
      case PKM.PERSIAN:
        return new Persian();
      case PKM.DEINO:
        return new Deino();
      case PKM.ZWEILOUS:
        return new Zweilous();
      case PKM.HYDREIGON:
        return new Hydreigon();
      case PKM.SANDILE:
        return new Sandile();
      case PKM.KROKOROK:
        return new Krookorok();
      case PKM.KROOKODILE:
        return new Krookodile();
      case PKM.SOLOSIS:
        return new Solosis();
      case PKM.DUOSION:
        return new Duosion();
      case PKM.REUNICLUS:
        return new Reuniclus();
      case PKM.ODDISH:
        return new Oddish();
      case PKM.GLOOM:
        return new Gloom();
      case PKM.VILEPLUME:
        return new Vileplume();
      case PKM.BELLOSSOM:
        return new Bellossom();
      case PKM.AMAURA:
        return new Amaura();
      case PKM.AURORUS:
        return new Aurorus();
      case PKM.ANORITH:
        return new Anorith();
      case PKM.ARMALDO:
        return new Armaldo();
      case PKM.ARCHEN:
        return new Archen();
      case PKM.ARCHEOPS:
        return new Archeops();
      case PKM.SHIELDON:
        return new Shieldon();
      case PKM.BASTIODON:
        return new Bastiodon();
      case PKM.TIRTOUGA:
        return new Tirtouga();
      case PKM.CARRACOSTA:
        return new Carracosta();
      case PKM.LILEEP:
        return new Lileep();
      case PKM.CRADILY:
        return new Cradily();
      case PKM.OMANYTE:
        return new Omanyte();
      case PKM.OMASTAR:
        return new Omastar();
      case PKM.CRANIDOS:
        return new Cranidos();
      case PKM.RAMPARDOS:
        return new Rampardos();
      case PKM.TYRUNT:
        return new Tyrunt();
      case PKM.TYRANTRUM:
        return new Tyrantrum();
      case PKM.KABUTO:
        return new Kabuto();
      case PKM.KABUTOPS:
        return new Kabutops();
      case PKM.BUDEW:
        return new Budew();
      case PKM.ROSELIA:
        return new Roselia();
      case PKM.ROSERADE:
        return new Roserade();
      case PKM.BUNEARY:
        return new Buneary();
      case PKM.LOPUNNY:
        return new Lopunny();
      case PKM.MEGALOPUNNY:
        return new MegaLopunny();
      case PKM.AXEW:
        return new Axew();
      case PKM.FRAXURE:
        return new Fraxure();
      case PKM.HAXORUS:
        return new Haxorus();
      case PKM.VENIPEDE:
        return new Venipede();
      case PKM.WHIRLIPEDE:
        return new Whirlipede();
      case PKM.SCOLIPEDE:
        return new Scolipede();
      case PKM.PORYGON:
        return new Porygon();
      case PKM.PORYGON2:
        return new Porygon2();
      case PKM.PORYGONZ:
        return new PorygonZ();
      case PKM.KLINK:
        return new Klink();
      case PKM.KLANG:
        return new Klang();
      case PKM.KLINKLANG:
        return new Klinklang();
      case PKM.ELECTRIKE:
        return new Electrike();
      case PKM.MANECTRIC:
        return new Manectric();
      case PKM.MEGAMANECTRIC:
        return new MegaManectric();
      case PKM.SHUPPET:
        return new Shuppet();
      case PKM.BANETTE:
        return new Banette();
      case PKM.MEGABANETTE:
        return new MegaBanette();
      case PKM.HONEDGE:
        return new Honedge();
      case PKM.DOUBLADE:
        return new Doublade();
      case PKM.AEGISLASH:
        return new Aegislash();
      case PKM.CUBONE:
        return new Cubone();
      case PKM.MAROWAK:
        return new Marowak();
      case PKM.ALOLANMAROWAK:
        return new AlolanMarowak();
      case PKM.FLETCHLING:
        return new Fletchling();
      case PKM.FLETCHINDER:
        return new Fletchinder();
      case PKM.TALONFLAME:
        return new Talonflame();
      case PKM.WHISMUR:
        return new Whismur();
      case PKM.LOUDRED:
        return new Loudred();
      case PKM.EXPLOUD:
        return new Exploud();
      case PKM.TYMPOLE:
        return new Tympole();
      case PKM.PALPITOAD:
        return new Palpitoad();
      case PKM.SEISMITOAD:
        return new Seismitoad();
      case PKM.SEWADDLE:
        return new Sewaddle();
      case PKM.SWADLOON:
        return new Swadloon();
      case PKM.LEAVANNY:
        return new Leavanny();
      case PKM.PIKIPEK:
        return new Pikipek();
      case PKM.TRUMBEAK:
        return new Trumbeak();
      case PKM.TOUCANNON:
        return new Toucannon();
      case PKM.FLABEBE:
        return new Flabebe();
      case PKM.FLOETTE:
        return new Floette();
      case PKM.FLORGES:
        return new Florges();
      case PKM.JANGMOO:
        return new JangmoO();
      case PKM.HAKAMOO:
        return new HakamoO();
      case PKM.KOMMOO:
        return new KommoO();
      case PKM.MELOETTA:
        return new Meloetta();
      case PKM.ALTARIA:
        return new Altaria();
      case PKM.MEGAALTARIA:
        return new MegaAltaria();
      case PKM.LILLIPUP:
        return new Lillipup();
      case PKM.HERDIER:
        return new Herdier();
      case PKM.STOUTLAND:
        return new Stoutland();
      case PKM.CASTFORM:
        return new Castform();
      case PKM.CASTFORMSUN:
        return new CastformSun();
      case PKM.CASTFORMRAIN:
        return new CastformRain();
      case PKM.CASTFORMHAIL:
        return new CastformHail();
      default:
        console.log(`No pokemon with name "${name}" found, return magikarp`);
        return new Magikarp();
    }
  }

  static getPokemonRarityFromName(name: string) {
    const pokemon: Pokemon = PokemonFactory.createPokemonFromName(name);
    return pokemon.rarity;
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
