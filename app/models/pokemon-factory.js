const Pokemon = require('./pokemon');
const {SPECIAL_SKILL, PKM} = require('./enum');
const Strategy = require('../core/attack-strategy');

class PokemonFactory {
  static getNeutralPokemonsByLevelStage(level) {
    const pokemons = new Map();
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

  static createStrategyFromName(name) {
    switch (name) {
      case SPECIAL_SKILL.FIRE_BLAST:
        return new Strategy.FireBlastStrategy();

      case SPECIAL_SKILL.WHEEL_OF_FIRE:
        return new Strategy.WheelOfFireStrategy();

      case SPECIAL_SKILL.SEISMIC_TOSS:
        return new Strategy.SeismicTossStrategy();

      case SPECIAL_SKILL.GUILLOTINE:
        return new Strategy.GuillotineStrategy();

      case SPECIAL_SKILL.ROCK_SLIDE:
        return new Strategy.RockSlideStrategy();

      case SPECIAL_SKILL.HEAT_WAVE:
        return new Strategy.HeatWaveStrategy();

      case SPECIAL_SKILL.THUNDER:
        return new Strategy.ThunderStrategy();

      case SPECIAL_SKILL.HYDRO_PUMP:
        return new Strategy.HydroPumpStrategy();

      case SPECIAL_SKILL.DRACO_METEOR:
        return new Strategy.DracoMeteorStrategy();

      case SPECIAL_SKILL.BLAZE_KICK:
        return new Strategy.BlazeKickStrategy();

      case SPECIAL_SKILL.WISH:
        return new Strategy.WishStrategy();

      case SPECIAL_SKILL.CALM_MIND:
        return new Strategy.CalmMindStrategy();

      case SPECIAL_SKILL.IRON_DEFENSE:
        return new Strategy.IronDefenseStrategy();

      case SPECIAL_SKILL.METRONOME:
        return new Strategy.MetronomeStrategy();

      case SPECIAL_SKILL.SOAK:
        return new Strategy.SoakStrategy();

      case SPECIAL_SKILL.IRON_TAIL:
        return new Strategy.IronTailStrategy();

      case SPECIAL_SKILL.BLAST_BURN:
        return new Strategy.BlastBurnStrategy();

      case SPECIAL_SKILL.CHARGE:
        return new Strategy.ChargeStrategy();

      case SPECIAL_SKILL.DISCHARGE:
        return new Strategy.DischargeStrategy();

      case SPECIAL_SKILL.BITE:
        return new Strategy.BiteStrategy();

      case SPECIAL_SKILL.DRAGON_TAIL:
        return new Strategy.DragonTailStrategy();

      case SPECIAL_SKILL.DRAGON_BREATH:
        return new Strategy.DragonBreathStrategy();

      case SPECIAL_SKILL.ICICLE_CRASH:
        return new Strategy.IcicleCrashStrategy();

      case SPECIAL_SKILL.ROOT:
        return new Strategy.RootStrategy();

      case SPECIAL_SKILL.TORMENT:
        return new Strategy.TormentStrategy();

      case SPECIAL_SKILL.STOMP:
        return new Strategy.StompStrategy();

      case SPECIAL_SKILL.DARK_PULSE:
        return new Strategy.DarkPulseStrategy();

      case SPECIAL_SKILL.NIGHT_SLASH:
        return new Strategy.NightSlashStrategy();

      case SPECIAL_SKILL.BUG_BUZZ:
        return new Strategy.BugBuzzStrategy();

      case SPECIAL_SKILL.POISON_STING:
        return new Strategy.PoisonStingStrategy();

      case SPECIAL_SKILL.LEECH_LIFE:
        return new Strategy.LeechLifeStrategy();

      case SPECIAL_SKILL.HAPPY_HOUR:
        return new Strategy.HappyHourStrategy();

      case SPECIAL_SKILL.TELEPORT:
        return new Strategy.TeleportStrategy();

      case SPECIAL_SKILL.NASTY_PLOT:
        return new Strategy.NastyPlotStrategy();

      case SPECIAL_SKILL.THIEF:
        return new Strategy.ThiefStrategy();

      case SPECIAL_SKILL.STUN_SPORE:
        return new Strategy.StunSporeStrategy();

      case SPECIAL_SKILL.METEOR_MASH:
        return new Strategy.MeteorMashStrategy();

      case SPECIAL_SKILL.HURRICANE:
        return new Strategy.HurricaneStrategy();

      case SPECIAL_SKILL.BURN:
        return new Strategy.BurnStrategy();

      case SPECIAL_SKILL.SLEEP:
        return new Strategy.SleepStrategy();

      case SPECIAL_SKILL.SILENCE:
        return new Strategy.SilenceStrategy();

      case SPECIAL_SKILL.CONFUSION:
        return new Strategy.ConfusionStrategy();

      case SPECIAL_SKILL.FREEZE:
        return new Strategy.FreezeStrategy();

      case SPECIAL_SKILL.PROTECT:
        return new Strategy.ProtectStrategy();

      case SPECIAL_SKILL.POISON:
        return new Strategy.PoisonStrategy();

      case SPECIAL_SKILL.DEFAULT:
        return new Strategy.AttackStrategy();

      default:
        return new Strategy.AttackStrategy();
    }
  }

  static getPokemonFamily(name) {
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
      default:
        console.log(`No pokemon with name "${name}" found`);
        break;
    }
  }

  static createPokemonFromName(name) {
    switch (name) {
      case PKM.BULBASAUR:
        return new Pokemon.Bulbasaur();
      case PKM.IVYSAUR:
        return new Pokemon.Ivysaur();
      case PKM.VENUSAUR:
        return new Pokemon.Venusaur();
      case PKM.CHARMANDER:
        return new Pokemon.Charmander();
      case PKM.CHARMELEON:
        return new Pokemon.Charmeleon();
      case PKM.CHARIZARD:
        return new Pokemon.Charizard();
      case PKM.SQUIRTLE:
        return new Pokemon.Squirtle();
      case PKM.WARTORTLE:
        return new Pokemon.Wartortle();
      case PKM.BLASTOISE:
        return new Pokemon.Blastoise();
      case PKM.SLOWPOKE:
        return new Pokemon.Slowpoke();
      case PKM.SLOWBRO:
        return new Pokemon.Slowbro();
      case PKM.SLOWKING:
        return new Pokemon.Slowking();
      case PKM.GEODUDE:
        return new Pokemon.Geodude();
      case PKM.GRAVELER:
        return new Pokemon.Graveler();
      case PKM.GOLEM:
        return new Pokemon.Golem();
      case PKM.AZURILL:
        return new Pokemon.Azurill();
      case PKM.MARILL:
        return new Pokemon.Marill();
      case PKM.AZUMARILL:
        return new Pokemon.Azumarill();
      case PKM.ZUBAT:
        return new Pokemon.Zubat();
      case PKM.GOLBAT:
        return new Pokemon.Golbat();
      case PKM.CROBAT:
        return new Pokemon.Crobat();
      case PKM.AMPHAROS:
        return new Pokemon.Ampharos();
      case PKM.MAREEP:
        return new Pokemon.Mareep();
      case PKM.FLAFFY:
        return new Pokemon.Flaffy();
      case PKM.CLEFFA:
        return new Pokemon.Cleffa();
      case PKM.CLEFAIRY:
        return new Pokemon.Clefairy();
      case PKM.CLEFABLE:
        return new Pokemon.Clefable();
      case PKM.IGGLYBUFF:
        return new Pokemon.Igglybuff();
      case PKM.JIGGLYPUFF:
        return new Pokemon.Jigglypuff();
      case PKM.WIGGLYTUFF:
        return new Pokemon.Wigglytuff();
      case PKM.CATERPIE:
        return new Pokemon.Caterpie();
      case PKM.METAPOD:
        return new Pokemon.Metapod();
      case PKM.BUTTERFREE:
        return new Pokemon.Butterfree();
      case PKM.WEEDLE:
        return new Pokemon.Weedle();
      case PKM.KAKUNA:
        return new Pokemon.Kakuna();
      case PKM.BEEDRILL:
        return new Pokemon.Beedrill();
      case PKM.PIDGEY:
        return new Pokemon.Pidgey();
      case PKM.PIDGEOTTO:
        return new Pokemon.Pidgeotto();
      case PKM.PIDGEOT:
        return new Pokemon.Pidgeot();
      case PKM.HOPPIP:
        return new Pokemon.Hoppip();
      case PKM.SKIPLOOM:
        return new Pokemon.Skiploom();
      case PKM.JUMPLUFF:
        return new Pokemon.Jumpluff();
      case PKM.SEEDOT:
        return new Pokemon.Seedot();
      case PKM.NUZLEAF:
        return new Pokemon.Nuzleaf();
      case PKM.SHIFTRY:
        return new Pokemon.Shiftry();
      case PKM.STARLY:
        return new Pokemon.Starly();
      case PKM.STARAVIA:
        return new Pokemon.Staravia();
      case PKM.STARAPTOR:
        return new Pokemon.Staraptor();
      case PKM.CHIKORITA:
        return new Pokemon.Chikorita();
      case PKM.BAYLEEF:
        return new Pokemon.Bayleef();
      case PKM.MEGANIUM:
        return new Pokemon.Meganium();
      case PKM.CYNDAQUIL:
        return new Pokemon.Cyndaquil();
      case PKM.QUILAVA:
        return new Pokemon.Quilava();
      case PKM.TYPHLOSION:
        return new Pokemon.Typhlosion();
      case PKM.TOTODILE:
        return new Pokemon.Totodile();
      case PKM.CROCONAW:
        return new Pokemon.Croconaw();
      case PKM.FERALIGATR:
        return new Pokemon.Feraligatr();
      case PKM.TREECKO:
        return new Pokemon.Treecko();
      case PKM.GROVYLE:
        return new Pokemon.Grovyle();
      case PKM.SCEPTILE:
        return new Pokemon.Sceptile();
      case PKM.TORCHIC:
        return new Pokemon.Torchic();
      case PKM.COMBUSKEN:
        return new Pokemon.Combusken();
      case PKM.BLAZIKEN:
        return new Pokemon.Blaziken();
      case PKM.MUDKIP:
        return new Pokemon.Mudkip();
      case PKM.MARSHTOMP:
        return new Pokemon.Marshtomp();
      case PKM.SWAMPERT:
        return new Pokemon.Swampert();
      case PKM.TURTWIG:
        return new Pokemon.Turtwig();
      case PKM.GROTLE:
        return new Pokemon.Grotle();
      case PKM.TORTERRA:
        return new Pokemon.Torterra();
      case PKM.CHIMCHAR:
        return new Pokemon.Chimchar();
      case PKM.MONFERNO:
        return new Pokemon.Monferno();
      case PKM.INFERNAPE:
        return new Pokemon.Infernape();
      case PKM.PIPLUP:
        return new Pokemon.Piplup();
      case PKM.PRINPLUP:
        return new Pokemon.Prinplup();
      case PKM.EMPOLEON:
        return new Pokemon.Empoleon();
      case PKM.NIDORANF:
        return new Pokemon.NidoranF();
      case PKM.NIDORINA:
        return new Pokemon.Nidorina();
      case PKM.NIDOQUEEN:
        return new Pokemon.Nidoqueen();
      case PKM.NIDORANM:
        return new Pokemon.NidoranM();
      case PKM.NIDORINO:
        return new Pokemon.Nidorino();
      case PKM.NIDOKING:
        return new Pokemon.Nidoking();
      case PKM.PICHU:
        return new Pokemon.Pichu();
      case PKM.PIKACHU:
        return new Pokemon.Pikachu();
      case PKM.RAICHU:
        return new Pokemon.Raichu();
      case PKM.MACHOP:
        return new Pokemon.Machop();
      case PKM.MACHOKE:
        return new Pokemon.Machoke();
      case PKM.MACHAMP:
        return new Pokemon.Machamp();
      case PKM.HORSEA:
        return new Pokemon.Horsea();
      case PKM.SEADRA:
        return new Pokemon.Seadra();
      case PKM.KINGDRA:
        return new Pokemon.Kingdra();
      case PKM.TRAPINCH:
        return new Pokemon.Trapinch();
      case PKM.VIBRAVA:
        return new Pokemon.Vibrava();
      case PKM.FLYGON:
        return new Pokemon.Flygon();
      case PKM.SPHEAL:
        return new Pokemon.Spheal();
      case PKM.SEALEO:
        return new Pokemon.Sealeo();
      case PKM.WALREIN:
        return new Pokemon.Walrein();
      case PKM.ARON:
        return new Pokemon.Aron();
      case PKM.LAIRON:
        return new Pokemon.Lairon();
      case PKM.AGGRON:
        return new Pokemon.Aggron();
      case PKM.MAGNEMITE:
        return new Pokemon.Magnemite();
      case PKM.MAGNETON:
        return new Pokemon.Magneton();
      case PKM.MAGNEZONE:
        return new Pokemon.Magnezone();
      case PKM.RHYHORN:
        return new Pokemon.Rhyhorn();
      case PKM.RHYDON:
        return new Pokemon.Rhydon();
      case PKM.RHYPERIOR:
        return new Pokemon.Rhyperior();
      case PKM.TOGEPI:
        return new Pokemon.Togepi();
      case PKM.TOGETIC:
        return new Pokemon.Togetic();
      case PKM.TOGEKISS:
        return new Pokemon.Togekiss();
      case PKM.DUSKULL:
        return new Pokemon.Duskull();
      case PKM.DUSCLOPS:
        return new Pokemon.Dusclops();
      case PKM.DUSKNOIR:
        return new Pokemon.Dusknoir();
      case PKM.LOTAD:
        return new Pokemon.Lotad();
      case PKM.LOMBRE:
        return new Pokemon.Lombre();
      case PKM.LUDICOLO:
        return new Pokemon.Ludicolo();
      case PKM.SHINX:
        return new Pokemon.Shinx();
      case PKM.LUXIO:
        return new Pokemon.Luxio();
      case PKM.LUXRAY:
        return new Pokemon.Luxray();
      case PKM.POLIWAG:
        return new Pokemon.Poliwag();
      case PKM.POLIWHIRL:
        return new Pokemon.Poliwhirl();
      case PKM.POLITOED:
        return new Pokemon.Politoed();
      case PKM.ABRA:
        return new Pokemon.Abra();
      case PKM.KADABRA:
        return new Pokemon.Kadabra();
      case PKM.ALAKAZAM:
        return new Pokemon.Alakazam();
      case PKM.GASTLY:
        return new Pokemon.Gastly();
      case PKM.HAUNTER:
        return new Pokemon.Haunter();
      case PKM.GENGAR:
        return new Pokemon.Gengar();
      case PKM.DRATINI:
        return new Pokemon.Dratini();
      case PKM.DRAGONAIR:
        return new Pokemon.Dragonair();
      case PKM.DRAGONITE:
        return new Pokemon.Dragonite();
      case PKM.LARVITAR:
        return new Pokemon.Larvitar();
      case PKM.PUPITAR:
        return new Pokemon.Pupitar();
      case PKM.TYRANITAR:
        return new Pokemon.Tyranitar();
      case PKM.SLAKOTH:
        return new Pokemon.Slakoth();
      case PKM.VIGOROTH:
        return new Pokemon.Vigoroth();
      case PKM.SLAKING:
        return new Pokemon.Slaking();
      case PKM.RALTS:
        return new Pokemon.Ralts();
      case PKM.KIRLIA:
        return new Pokemon.Kirlia();
      case PKM.GARDEVOIR:
        return new Pokemon.Gardevoir();
      case PKM.BAGON:
        return new Pokemon.Bagon();
      case PKM.SHELGON:
        return new Pokemon.Shelgon();
      case PKM.SALAMENCE:
        return new Pokemon.Salamence();
      case PKM.BELDUM:
        return new Pokemon.Beldum();
      case PKM.METANG:
        return new Pokemon.Metang();
      case PKM.METAGROSS:
        return new Pokemon.Metagross();
      case PKM.GIBLE:
        return new Pokemon.Gible();
      case PKM.GABITE:
        return new Pokemon.Gabite();
      case PKM.GARCHOMP:
        return new Pokemon.Garchomp();
      case PKM.ELEKID:
        return new Pokemon.Elekid();
      case PKM.ELECTABUZZ:
        return new Pokemon.Electabuzz();
      case PKM.ELECTIVIRE:
        return new Pokemon.Electivire();
      case PKM.MAGBY:
        return new Pokemon.Magby();
      case PKM.MAGMAR:
        return new Pokemon.Magmar();
      case PKM.MAGMORTAR:
        return new Pokemon.Magmortar();
      case PKM.MUNCHLAX:
        return new Pokemon.Munchlax();
      case PKM.SNORLAX:
        return new Pokemon.Snorlax();
      case PKM.GROWLITHE:
        return new Pokemon.Growlithe();
      case PKM.ARCANINE:
        return new Pokemon.Arcanine();
      case PKM.ONIX:
        return new Pokemon.Onix();
      case PKM.STEELIX:
        return new Pokemon.Steelix();
      case PKM.MEGASTEELIX:
        return new Pokemon.MegaSteelix();
      case PKM.SCYTHER:
        return new Pokemon.Scyther();
      case PKM.SCIZOR:
        return new Pokemon.Scizor();
      case PKM.MEGASCIZOR:
        return new Pokemon.MegaScizor();
      case PKM.RIOLU:
        return new Pokemon.Riolu();
      case PKM.LUCARIO:
        return new Pokemon.Lucario();
      case PKM.MEGALUCARIO:
        return new Pokemon.MegaLucario();
      case PKM.MAGIKARP:
        return new Pokemon.Magikarp();
      case PKM.RATTATA:
        return new Pokemon.Rattata();
      case PKM.RATICATE:
        return new Pokemon.Raticate();
      case PKM.SPEAROW:
        return new Pokemon.Spearow();
      case PKM.FEAROW:
        return new Pokemon.Fearow();
      case PKM.GYARADOS:
        return new Pokemon.Gyarados();
      case PKM.LUGIA:
        return new Pokemon.Lugia();
      case PKM.ZAPDOS:
        return new Pokemon.Zapdos();
      case PKM.MOLTRES:
        return new Pokemon.Moltres();
      case PKM.ARTICUNO:
        return new Pokemon.Articuno();
      case PKM.DIALGA:
        return new Pokemon.Dialga();
      case PKM.PALKIA:
        return new Pokemon.Palkia();
      case PKM.SUICUNE:
        return new Pokemon.Suicune();
      case PKM.RAIKOU:
        return new Pokemon.Raikou();
      case PKM.ENTEI:
        return new Pokemon.Entei();
      case PKM.KYOGRE:
        return new Pokemon.Kyogre();
      case PKM.GROUDON:
        return new Pokemon.Groudon();
      case PKM.RAYQUAZA:
        return new Pokemon.Rayquaza();
      case PKM.REGICE:
        return new Pokemon.Regice();
      case PKM.REGIROCK:
        return new Pokemon.Regirock();
      case PKM.REGISTEEL:
        return new Pokemon.Registeel();
      case PKM.REGIGIGAS:
        return new Pokemon.Regigigas();
      case PKM.GIRATINA:
        return new Pokemon.Giratina();
      case PKM.EEVEE:
        return new Pokemon.Eevee();
      case PKM.VAPOREON:
        return new Pokemon.Vaporeon();
      case PKM.JOLTEON:
        return new Pokemon.Jolteon();
      case PKM.FLAREON:
        return new Pokemon.Flareon();
      case PKM.ESPEON:
        return new Pokemon.Espeon();
      case PKM.UMBREON:
        return new Pokemon.Umbreon();
      case PKM.LEAFEON:
        return new Pokemon.Leafeon();
      case PKM.SYLVEON:
        return new Pokemon.Sylveon();
      case PKM.GLACEON:
        return new Pokemon.Glaceon();
      case PKM.MEDITITE:
        return new Pokemon.Meditite();
      case PKM.MEDICHAM:
        return new Pokemon.Medicham();
      case PKM.MEGAMEDICHAM:
        return new Pokemon.MegaMedicham();
      case PKM.NUMEL:
        return new Pokemon.Numel();
      case PKM.CAMERUPT:
        return new Pokemon.Camerupt();
      case PKM.MEGACAMERUPT:
        return new Pokemon.MegaCamerupt();
      case PKM.DITTO:
        return new Pokemon.Ditto();
      case PKM.SANDSHREW:
        return new Pokemon.Sandshrew();
      case PKM.DARKRAI:
        return new Pokemon.Darkrai();
      case PKM.LITWICK:
        return new Pokemon.Litwick();
      case PKM.LAMPENT:
        return new Pokemon.Lampent();
      case PKM.CHANDELURE:
        return new Pokemon.Chandelure();
      case PKM.BELLSPROUT:
        return new Pokemon.Bellsprout();
      case PKM.WEEPINBELL:
        return new Pokemon.Weepinbell();
      case PKM.VICTREEBEL:
        return new Pokemon.Victreebel();
      case PKM.SWINUB:
        return new Pokemon.Swinub();
      case PKM.PILOSWINE:
        return new Pokemon.Piloswine();
      case PKM.MAMOSWINE:
        return new Pokemon.Mamoswine();
      case PKM.SNORUNT:
        return new Pokemon.Snorunt();
      case PKM.GLALIE:
        return new Pokemon.Glalie();
      case PKM.FROSLASS:
        return new Pokemon.Froslass();
      case PKM.SNOVER:
        return new Pokemon.Snover();
      case PKM.ABOMASNOW:
        return new Pokemon.Abomasnow();
      case PKM.MEGAABOMASNOW:
        return new Pokemon.MegaAbomasnow();
      case PKM.VANILLITE:
        return new Pokemon.Vanillite();
      case PKM.VANILLISH:
        return new Pokemon.Vanillish();
      case PKM.VANILLUXE:
        return new Pokemon.Vanilluxe();
      case PKM.VOLCARONA:
        return new Pokemon.Volcarona();
      case PKM.LANDORUS:
        return new Pokemon.Landorus();
      case PKM.THUNDURUS:
        return new Pokemon.Thundurus();
      case PKM.TORNADUS:
        return new Pokemon.Tornadus();
      case PKM.KELDEO:
        return new Pokemon.Keldeo();
      case PKM.TERRAKION:
        return new Pokemon.Terrakion();
      case PKM.VIRIZION:
        return new Pokemon.Virizion();
      case PKM.COBALION:
        return new Pokemon.Cobalion();
      case PKM.MANAPHY:
        return new Pokemon.Manaphy();
      case PKM.SPIRITOMB:
        return new Pokemon.Spiritomb();
      case PKM.ABSOL:
        return new Pokemon.Absol();
      case PKM.LAPRAS:
        return new Pokemon.Lapras();
      case PKM.LATIAS:
        return new Pokemon.Latias();
      case PKM.LATIOS:
        return new Pokemon.Latios();
      case PKM.MESPRIT:
        return new Pokemon.Mesprit();
      case PKM.AZELF:
        return new Pokemon.Azelf();
      case PKM.UXIE:
        return new Pokemon.Uxie();
      case PKM.MEWTWO:
        return new Pokemon.Mewtwo();
      case PKM.KYUREM:
        return new Pokemon.Kyurem();
      case PKM.RESHIRAM:
        return new Pokemon.Reshiram();
      case PKM.ZEKROM:
        return new Pokemon.Zekrom();
      case PKM.CELEBI:
        return new Pokemon.Celebi();
      case PKM.VICTINI:
        return new Pokemon.Victini();
      case PKM.JIRACHI:
        return new Pokemon.Jirachi();
      case PKM.ARCEUS:
        return new Pokemon.Arceus();
      case PKM.DEOXYS:
        return new Pokemon.Deoxys();
      case PKM.SHAYMIN:
        return new Pokemon.Shaymin();
      case PKM.CRESSELIA:
        return new Pokemon.Cresselia();
      case PKM.HEATRAN:
        return new Pokemon.Heatran();
      case PKM.HOOH:
        return new Pokemon.HooH();
      case PKM.ROTOM:
        return new Pokemon.Rotom();
      case PKM.AERODACTYL:
        return new Pokemon.Aerodactyl();
      default:
        console.log(`No pokemon with name "${name}" found, return magikarp`);
        return new Pokemon.Magikarp();
    }
  }

  static getPokemonRarityFromName(name) {
    const pokemon = PokemonFactory.createPokemonFromName(name);
    return pokemon.rarity;
  }
}

module.exports = PokemonFactory;
