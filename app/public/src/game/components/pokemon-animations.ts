import {
    AnimationType,
    AttackSprite,
    HitSprite,
    PokemonAnimationConfig
} from "../../../../types/Animation"
import { Pkm } from "../../../../types/enum/Pokemon"

export const DEFAULT_POKEMON_ANIMATION_CONFIG = {
    idle: AnimationType.Idle,
    walk: AnimationType.Walk,
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    hop: AnimationType.Hop,
    hurt: AnimationType.Hurt,
    sleep: AnimationType.Sleep,
    eat: AnimationType.Eat,
    shinyUnavailable: false,
    noShadow: false,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.NORMAL_HIT
} as const

export const PokemonAnimations: {
    [key in Pkm]: PokemonAnimationConfig
} = {
    [Pkm.DEFAULT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Attack
    },
    [Pkm.EGG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.LostBalance,
        emote: AnimationType.LostBalance
    },
    [Pkm.DITTO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Hop,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.BULBASAUR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.IVYSAUR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.VENUSAUR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.CHARMANDER]: {
        attack: AnimationType.Kick,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.CHARMELEON]: {
        attack: AnimationType.Strike,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.CHARIZARD]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.SQUIRTLE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.WARTORTLE]: {
        attack: AnimationType.Ricochet,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.BLASTOISE]: {
        attack: AnimationType.Ricochet,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.GEODUDE]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.GRAVELER]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.GOLEM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.AZURILL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Appeal,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.MARILL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.AZUMARILL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.ZUBAT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Charge,
        eat: AnimationType.Sleep,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GOLBAT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Hover,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.CROBAT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.MAREEP]: {
        attack: AnimationType.Emit,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.FLAFFY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.AMPHAROS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.CLEFFA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.CLEFAIRY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.CLEFABLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.IGGLYBUFF]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Sing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.WIGGLYTUFF]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Sleep,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.JIGGLYPUFF]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.CATERPIE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_RANGE
    },
    [Pkm.METAPOD]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_RANGE
    },
    [Pkm.BUTTERFREE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_RANGE
    },
    [Pkm.WEEDLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.KAKUNA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.BEEDRILL]: {
        attack: AnimationType.Jab,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.PIDGEY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.FlapAround,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.PIDGEOTTO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.FlapAround,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.PIDGEOT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.FlapAround,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.HOPPIP]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.SKIPLOOM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.JUMPLUFF]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.SEEDOT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.NUZLEAF]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.SHIFTRY]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.STARLY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.STARAVIA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.STARAPTOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.CHIKORITA]: {
        attack: AnimationType.Slam,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.BAYLEEF]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.MEGANIUM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shake,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.CYNDAQUIL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.QUILAVA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.TYPHLOSION]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.TOTODILE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.HitGround,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.CROCONAW]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.FERALIGATR]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.TREECKO]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Pose,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.GROVYLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.SCEPTILE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.TORCHIC]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.COMBUSKEN]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.BLAZIKEN]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Kick,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.MUDKIP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.MARSHTOMP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SWAMPERT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.TURTWIG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rumble,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.GROTLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rumble,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.TORTERRA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rumble,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.CHIMCHAR]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.MONFERNO]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.INFERNAPE]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.PIPLUP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.PRINPLUP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.EMPOLEON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.NIDORANF]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.NIDORINA]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.NIDOQUEEN]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.NIDORANM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.NIDORINO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.NIDOKING]: {
        attack: AnimationType.Strike,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.PICHU]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.Shock,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.PIKACHU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Pose
    },
    [Pkm.RAICHU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.MACHOP]: {
        attack: AnimationType.Kick,
        ability: AnimationType.Strike,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.MACHOKE]: {
        attack: AnimationType.Kick,
        ability: AnimationType.Punch,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.MACHAMP]: {
        attack: AnimationType.Kick,
        ability: AnimationType.Punch,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.HORSEA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.SEADRA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.KINGDRA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.TRAPINCH]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.VIBRAVA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.FLYGON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.SPHEAL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.SEALEO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.WALREIN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.ARON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.LAIRON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.AGGRON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DigOut,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.MAGNEMITE]: {
        attack: AnimationType.SpAttack,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.MAGNETON]: {
        attack: AnimationType.SpAttack,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.MAGNEZONE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.RHYHORN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Stomp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.RHYDON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Stomp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.RHYPERIOR]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Rumble,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.TOGEPI]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.Dance,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.TOGETIC]: {
        attack: AnimationType.Hover,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.TOGEKISS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.DUSKULL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.DUSCLOPS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.DUSKNOIR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.LOTAD]: {
        attack: AnimationType.Shake,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.LOMBRE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.LUDICOLO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.SHINX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.LUXIO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.LUXRAY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.POLIWAG]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Appeal,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.POLIWHIRL]: {
        attack: AnimationType.RearUp,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot
    },
    [Pkm.POLITOED]: {
        attack: AnimationType.RearUp,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.ABRA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.KADABRA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.ALAKAZAM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GASTLY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Lick,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.HAUNTER]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Lick,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.GENGAR]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Special2,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.DRATINI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.DRAGONAIR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.DRAGONITE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.LARVITAR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.PUPITAR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.TYRANITAR]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.SLAKOTH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Appeal,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.VIGOROTH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Dance,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SLAKING]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Dance,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.RALTS]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.Pull,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.KIRLIA]: {
        attack: AnimationType.Twirl,
        ability: AnimationType.Pose,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GARDEVOIR]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GALLADE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.BAGON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Bite,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.SHELGON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.SALAMENCE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.BELDUM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.METANG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.MultiScratch,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.METAGROSS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Ricochet,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.GIBLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.GABITE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.GARCHOMP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.ELEKID]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.ELECTABUZZ]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.ELECTIVIRE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.MAGBY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.MAGMAR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.MAGMORTAR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.MUNCHLAX]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SNORLAX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Stomp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GROWLITHE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rumble,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.ARCANINE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rumble,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.HISUI_GROWLITHE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.HISUI_ARCANINE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.QuickStrike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.ONIX]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.STEELIX]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.MEGA_STEELIX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.SCYTHER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Slice,
        emote: AnimationType.Shoot
    },
    [Pkm.SCIZOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.MultiScratch,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.KLEAVOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.RIOLU]: {
        attack: AnimationType.Strike,
        ability: AnimationType.RearUp,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIGHTING_RANGE
    },
    [Pkm.LUCARIO]: {
        attack: AnimationType.Strike,
        ability: AnimationType.RearUp,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIGHTING_RANGE
    },
    [Pkm.MAGIKARP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.RATTATA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.ALOLAN_RATTATA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.TailWhip,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.RATICATE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.ALOLAN_RATICATE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.TailWhip,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.SPEAROW]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.FEAROW]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GYARADOS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.LUGIA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.SHADOW_LUGIA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Dance,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.GIRATINA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot
    },
    [Pkm.ZAPDOS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Emit,
        emote: AnimationType.Emit,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.MOLTRES]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Pose,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.ARTICUNO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.GALARIAN_ZAPDOS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.GALARIAN_MOLTRES]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.GALARIAN_ARTICUNO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.DIALGA]: {
        attack: AnimationType.Scratch,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.PALKIA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.SUICUNE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.RAIKOU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.QuickStrike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.ENTEI]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.REGICE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.REGIROCK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.REGISTEEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.KYOGRE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swell,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.GROUDON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.RAYQUAZA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.REGIGIGAS]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Rumble,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.EEVEE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot
    },
    [Pkm.VAPOREON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.JOLTEON]: {
        attack: AnimationType.Shock,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.FLAREON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.ESPEON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.UMBREON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.LEAFEON]: {
        attack: AnimationType.QuickStrike,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.SYLVEON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.MEDITITE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.MEDICHAM]: {
        attack: AnimationType.Charge,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.NUMEL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.CAMERUPT]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.MEGA_CAMERUPT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.DARKRAI]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Sink,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_RANGE
    },
    [Pkm.LITWICK]: {
        attack: AnimationType.Sink,
        ability: AnimationType.Pose,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.LAMPENT]: {
        attack: AnimationType.Emit,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.CHANDELURE]: {
        attack: AnimationType.Emit,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.SLOWPOKE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SLOWBRO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SLOWKING]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.BELLSPROUT]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.WEEPINBELL]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.VICTREEBEL]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.SWINUB]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shake,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.PILOSWINE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.MAMOSWINE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.SNORUNT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.GLALIE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Bite,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.FROSLASS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.SNOVER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.ABOMASNOW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.MEGA_ABOMASNOW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.VANILLITE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.VANILLISH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.VANILLUXE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.GLACEON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Pose,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.LARVESTA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.VOLCARONA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.LANDORUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.THUNDURUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.TORNADUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.ENAMORUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.KELDEO]: {
        attack: AnimationType.Swing,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.TERRAKION]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.VIRIZION]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.COBALION]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.MANAPHY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.ROTOM]: {
        attack: AnimationType.Emit,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.ROTOM_DRONE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.SPIRITOMB]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Withdraw,
        attackSprite: AttackSprite.DARK_RANGE
    },
    [Pkm.ABSOL]: {
        attack: AnimationType.QuickStrike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.LAPRAS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.LATIAS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.LATIOS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.MESPRIT]: {
        attack: AnimationType.Hover,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.AZELF]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UXIE]: {
        attack: AnimationType.Hover,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.MEWTWO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Punch,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.KYUREM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.RESHIRAM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.ZEKROM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.CELEBI]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.VICTINI]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.JIRACHI]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Pose,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.ARCEUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.SHAYMIN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.CRESSELIA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.HEATRAN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.HO_OH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Jab,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.AERODACTYL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.PRIMAL_KYOGRE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swell,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.PRIMAL_GROUDON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.MEOWTH]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Pose,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.PERSIAN]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.ALOLAN_MEOWTH]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Pose,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.ALOLAN_PERSIAN]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.DEINO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_RANGE
    },
    [Pkm.ZWEILOUS]: {
        attack: AnimationType.Jab,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_RANGE
    },
    [Pkm.HYDREIGON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_RANGE
    },
    [Pkm.SANDILE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.KROKOROK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.KROOKODILE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.SOLOSIS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.DUOSION]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.REUNICLUS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.MEGA_RAYQUAZA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.SWABLU]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_RANGE
    },
    [Pkm.ODDISH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.GLOOM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.VILEPLUME]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.BELLOSSOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Twirl,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.AMAURA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.AURORUS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.ANORITH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Scratch,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.ARMALDO]: {
        attack: AnimationType.Scratch,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.ARCHEN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.FlapAround,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.ARCHEOPS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.SHIELDON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.BASTIODON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    /*[Pkm.TIRTOUGA]: {
      attack: AnimationType.Attack,
      ability: AnimationType.Attack,
      emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.CARRACOSTA]: {
      attack: AnimationType.Attack,
      ability: AnimationType.Attack,
      emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },*/
    [Pkm.LILEEP]: {
        attack: AnimationType.SpAttack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.CRADILY]: {
        attack: AnimationType.SpAttack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.CRANIDOS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.RAMPARDOS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.KABUTO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.KABUTOPS]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.OMANYTE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.OMASTAR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.TYRUNT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Bite,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.TYRANTRUM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.BUDEW]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.ROSELIA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.ROSERADE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.BUNEARY]: {
        attack: AnimationType.QuickStrike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.LOPUNNY]: {
        attack: AnimationType.QuickStrike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.MEGA_LOPUNNY]: {
        attack: AnimationType.QuickStrike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.AXEW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.FRAXURE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.HAXORUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.VENIPEDE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.TumbleBack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.WHIRLIPEDE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.SCOLIPEDE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.PORYGON]: {
        attack: AnimationType.RearUp,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_RANGE
    },
    [Pkm.PORYGON_2]: {
        attack: AnimationType.RearUp,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_RANGE
    },
    [Pkm.PORYGON_Z]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_RANGE
    },
    [Pkm.ELECTRIKE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.MANECTRIC]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.MEGA_MANECTRIC]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.SHUPPET]: {
        attack: AnimationType.SpAttack,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.BANETTE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.MEGA_BANETTE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.HONEDGE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Head,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.DOUBLADE]: {
        attack: AnimationType.Slice,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.AEGISLASH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Special0,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.AEGISLASH_BLADE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Special0,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.CUBONE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.MAROWAK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.ALOLAN_MAROWAK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Punch,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.WHISMUR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Appeal,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.LOUDRED]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Appeal,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.EXPLOUD]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.TYMPOLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.PALPITOAD]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SEISMITOAD]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SEWADDLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.SWADLOON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.LEAVANNY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    /*[Pkm.PIKIPEK]: {
      attack: AnimationType.Attack,
      ability: AnimationType.Attack,
      emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.TRUMBEAK]: {
      attack: AnimationType.Attack,
      ability: AnimationType.Attack,
      emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.TOUCANNON]: {
      attack: AnimationType.Attack,
      ability: AnimationType.Attack,
      emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },*/
    [Pkm.FLABEBE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swell,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.FLOETTE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.FLORGES]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.JANGMO_O]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.HAKAMO_O]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.KOMMO_O]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.MELOETTA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot
    },
    [Pkm.PIROUETTE_MELOETTA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Twirl
    },
    [Pkm.ALTARIA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_RANGE
    },
    [Pkm.MEGA_ALTARIA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_RANGE
    },
    [Pkm.CASTFORM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot
    },
    [Pkm.CASTFORM_SUN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot
    },
    [Pkm.CASTFORM_RAIN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot
    },
    [Pkm.CASTFORM_HAIL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot
    },
    [Pkm.CORPHISH]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.CRAWDAUNT]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.JOLTIK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.GALVANTULA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.GENESECT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_RANGE
    },
    [Pkm.RELICANTH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.HATENNA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.HATTREM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.HATTERENE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.FENNEKIN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.BRAIXEN]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.DELPHOX]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.MAKUHITA]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.HARIYAMA]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.REGIELEKI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.REGIDRAGO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.GUZZLORD]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.ETERNATUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.PONYTA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Walk,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.RAPIDASH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Walk,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.GALARIAN_PONYTA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Walk,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.GALARIAN_RAPIDASH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Walk,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.NINCADA]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.NINJASK]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot
    },
    [Pkm.SHEDINJA]: {
        attack: AnimationType.Scratch,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.NOIBAT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.NOIVERN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.PUMPKABOO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.GOURGEIST]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.CACNEA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.CACTURNE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.TAUROS]: {
        attack: AnimationType.Stomp,
        ability: AnimationType.Attack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.HAPPINY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shake,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.CHANSEY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.BLISSEY]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.TAPU_KOKO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.TAPU_LELE]: {
        attack: AnimationType.Hop,
        ability: AnimationType.Charge,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.STAKATAKA]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Sleep,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.BLACEPHALON]: {
        attack: AnimationType.Hop,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.HOUNDOUR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.HOUNDOOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.MEGA_HOUNDOOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shake,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.CLAMPERL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot
    },
    [Pkm.HUNTAIL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.GOREBYSS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.SMOOCHUM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.JYNX]: {
        attack: AnimationType.Slap,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.SALANDIT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.SALAZZLE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.VENONAT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.VENOMOTH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.FlapAround,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.VOLTORB]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hurt,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.ELECTRODE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hurt,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.HISUI_VOLTORB]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Pose,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.HISUI_ELECTRODE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hurt,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.SLUGMA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.MAGCARGO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hurt,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.SNEASEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.WEAVILE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.CROAGUNK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.TOXICROAK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.CHINCHOU]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.LANTURN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.POOCHYENA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.MIGHTYENA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.BRONZOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.BRONZONG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.DRIFLOON]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swell,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.DRIFBLIM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.SHROOMISH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.BRELOOM]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.TENTACOOL]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Shoot,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.TENTACRUEL]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SNUBULL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.GRANBULL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.SEVIPER]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.VULPIX]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.NINETALES]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.ALOLAN_VULPIX]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.ALOLAN_NINETALES]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.BUIZEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.FLOATZEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.MAWILE]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.KECLEON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.CARBINK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.DIANCIE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hurt,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.CHATOT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Appeal,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GOOMY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.SLIGOO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.GOODRA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.HISUI_SLIGGOO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.HISUI_GOODRA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.MEW]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.BOUNSWEET]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.STEENEE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.TSAREENA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Kick,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.VOLCANION]: {
        attack: AnimationType.Charge,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.APPLIN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge
    },
    [Pkm.APPLETUN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.FLAPPLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.DIPPLIN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.HYDRAPPLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.OSHAWOTT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.DEWOTT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SAMUROTT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SNOM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.FROSMOTH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.WAILMER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hurt,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.WAILORD]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hurt,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.DREEPY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.DRAKLOAK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.DRAGAPULT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.SNIVY]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Appeal,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.SERVINE]: {
        attack: AnimationType.Slice,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.SERPERIOR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.SCORBUNNY]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Kick,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.RABOOT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Kick,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.CINDERACE]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Kick,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.POPPLIO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.BRIONNE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.PRIMARINA]: {
        attack: AnimationType.Charge,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GOTHITA]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GOTHORITA]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GOTHITELLE]: {
        attack: AnimationType.Appeal,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.SANDSHREW]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.LostBalance,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SANDSLASH]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.ALOLAN_SANDSHREW]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.ALOLAN_SANDSLASH]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.FARFETCH_D]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GALARIAN_FARFETCH_D]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.UNOWN_A]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_B]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_C]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_D]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_E]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_F]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_G]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_H]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_I]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_J]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_K]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_L]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_M]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_N]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_O]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_P]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_Q]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_R]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_S]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_T]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_U]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_V]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_W]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_X]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_Y]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_Z]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_QUESTION]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.UNOWN_EXCLAMATION]: {
        attack: AnimationType.Rotate,
        ability: AnimationType.Rotate,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.TAPU_FINI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.TAPU_BULU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.DIGLETT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DigIn,
        emote: AnimationType.Special0,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.ALOLAN_DIGLETT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DigIn,
        emote: AnimationType.Special0,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.DUGTRIO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DigIn,
        emote: AnimationType.Special0,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.ALOLAN_DUGTRIO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Walk,
        emote: AnimationType.Hop,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.ROWLET]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.DARTIX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.DECIDUEYE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.ZORUA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.ZOROARK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.HISUI_ZORUA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.HISUI_ZOROARK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.FROAKIE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.FROGADIER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.GRENINJA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hurt,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.TYROGUE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot
    },
    [Pkm.HITMONLEE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Kick,
        emote: AnimationType.Withdraw,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.HITMONCHAN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Uppercut,
        emote: AnimationType.Punch,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.HITMONTOP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.MIMIKYU]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.MIMIKYU_BUSTED]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GRIMER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.MUK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.ALOLAN_GRIMER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.ALOLAN_MUK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.CARVANHA]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Swell,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SHARPEDO]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Swell,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.PINECO]: {
        attack: AnimationType.Ricochet,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.FORRETRESS]: {
        attack: AnimationType.Ricochet,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.SEEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.DEWGONG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.ALOLAN_GEODUDE]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.ALOLAN_GRAVELER]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.ALOLAN_GOLEM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.EKANS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.ARBOK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.MIME_JR]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.MR_MIME]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ORIGIN_GIRATINA]: {
        attack: AnimationType.Scratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot
    },
    [Pkm.MELTAN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.MELMETAL]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Punch,
        emote: AnimationType.Charge
    },
    [Pkm.HOOPA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Hop,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.HOOPA_UNBOUND]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Cringe,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.SILVALLY]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot
    },
    [Pkm.TYPE_NULL]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.ZERAORA]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.XERNEAS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.YVELTAL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.MARSHADOW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.HOOTHOOT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.NOCTOWL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.BONSLEY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.SUDOWOODO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Slam,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.PHIONE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.COMBEE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.VESPIQUEEN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.SHUCKLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.TEPIG]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.PIGNITE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.EMBOAR]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.WYNAUT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.WOBBUFFET]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.LUNATONE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_RANGE
    },
    [Pkm.SOLROCK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.POLIWRATH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SHAYMIN_SKY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.WURMPLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.SILCOON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.BEAUTIFLY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.FlapAround,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.CASCOON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.DUSTOX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.FlapAround,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.TINKATINK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Strike,
        emote: AnimationType.Strike,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.TINKATUFF]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Strike,
        emote: AnimationType.Strike,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.TINKATON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Cringe,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.PARAS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.PARASECT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.MILTANK]: {
        attack: AnimationType.Stomp,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.MANKEY]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Charge,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.PRIMEAPE]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Charge,
        emote: AnimationType.Strike,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.ANNIHILAPE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.SUNKERN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.SUNFLORA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shoot,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.MARACTUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Twirl,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.PLUSLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.MINUN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.PINSIR]: {
        attack: AnimationType.Slice,
        ability: AnimationType.Attack,
        emote: AnimationType.Slice,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.NATU]: {
        attack: AnimationType.Jab,
        ability: AnimationType.Charge,
        emote: AnimationType.Hover,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.XATU]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.GLIGAR]: {
        attack: AnimationType.Strike,
        ability: AnimationType.MultiStrike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.GLISCOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.SHELLDER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.CLOYSTER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SENTRET]: {
        attack: AnimationType.Strike,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.FURRET]: {
        attack: AnimationType.Strike,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SPECTRIER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.TORKOAL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.DELIBIRD]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.IRON_BUNDLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.KARTANA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.CHINGLING]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.CHIMECHO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Twirl,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.ALOLAN_RAICHU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.DHELMISE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.KOFFING]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Gas,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.WEEZING]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Gas,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.STARYU]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.STARMIE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.NOSEPASS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.PROBOPASS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.WOOBAT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Hover,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.SWOOBAT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.Hover,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.CLAUNCHER]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Double,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.CLAWITZER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.YANMA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.YANMEGA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.QuickStrike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.HELIOPTILE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot
    },
    [Pkm.HELIOLISK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot
    },
    [Pkm.BIDOOF]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.BIBAREL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SPINDA]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Twirl,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.BALTOY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.CLAYDOL]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Rotate,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.HERACROSS]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Slam,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.PURRLOIN]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.LIEPARD]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.BARBOACH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Dance
    },
    [Pkm.WHISCASH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Dance
    },
    [Pkm.SCRAGGY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.SCRAFTY]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.FINNEON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.LUMINEON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.STUNKY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.SKUNTANK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.ILLUMISE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.VOLBEAT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Appeal,
        emote: AnimationType.Appeal,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.NECROZMA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot
    },
    [Pkm.ULTRA_NECROZMA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Charge
    },
    [Pkm.CHERUBI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.CHERRIM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shake
    },
    [Pkm.CHERRIM_SUNLIGHT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Dance
    },
    [Pkm.MISDREAVUS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.MISMAGIUS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.DODUO]: {
        attack: AnimationType.Jab,
        ability: AnimationType.Charge,
        emote: AnimationType.MultiStrike,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.DODRIO]: {
        attack: AnimationType.Jab,
        ability: AnimationType.Charge,
        emote: AnimationType.MultiStrike,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.XURKITREE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.TANDEMAUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.MAUSHOLD_THREE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.MAUSHOLD_FOUR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.KRICKETOT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.KRICKETUNE]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.HIPPOPOTAS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.HIPPODOWN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.GROUND_MELEE
    },
    [Pkm.WINGULL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.PELIPPER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.NIHILEGO]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.SOBBLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.DRIZZILE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.INTELEON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Strike,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.TROPIUS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.EXEGGCUTE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.EXEGGUTOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.ALOLAN_EXEGGUTOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.COMFEY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Hop
    },
    [Pkm.CARNIVINE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.HISUIAN_QWILFISH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Withdraw,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.OVERQWIL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.HISUIAN_TYPHLOSION]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.LILLIPUP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.HERDIER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.STOUTLAND]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.ZIGZAGOON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.LINOONE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.GALARIAN_ZIGZAGOON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.GALARIAN_LINOONE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.OBSTAGOON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.PHEROMOSA]: {
        attack: AnimationType.Kick,
        ability: AnimationType.Swing,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.SABLEYE]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.MEGA_SABLEYE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.DRACOVISH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Hop,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.CORSOLA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shake,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.GALAR_CORSOLA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.CURSOLA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.GIMMIGHOUL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.GHOLDENGO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge
    },
    [Pkm.PHANTUMP]: {
        attack: AnimationType.Strike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.TREVENANT]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Swing,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.SMEARGLE]: {
        attack: AnimationType.SpAttack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Pose
    },
    [Pkm.TOXEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.TOXTRICITY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.BRUXISH]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SUBSTITUTE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.CYCLIZAR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.PAWNIARD]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Appeal,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.BISHARP]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.KINGAMBIT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.MINIOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.MINIOR_KERNEL_RED]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.MINIOR_KERNEL_BLUE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.MINIOR_KERNEL_ORANGE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.MINIOR_KERNEL_GREEN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.FEEBAS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Dance,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.MILOTIC]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.MORPEKO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.MORPEKO_HANGRY]: {
        attack: AnimationType.Swing,
        ability: AnimationType.Special0,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.KANGASKHAN]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.TEDDIURSA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.MultiScratch,
        emote: AnimationType.Appeal,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.URSARING]: {
        attack: AnimationType.Attack,
        ability: AnimationType.MultiStrike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.URSALUNA]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp
    },
    [Pkm.URSALUNA_BLOODMOON]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot
    },
    [Pkm.AIPOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Dance,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.AMBIPOM]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.DEERLING]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SAWSBUCK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.LICKITUNG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Lick,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.LICKILICKY]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Withdraw,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.PATRAT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.WATCHOG]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Rotate,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.SPINARAK]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.ARIADOS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.DEWPIDER]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.ARAQUANID]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.ROCKRUFF]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.LYCANROC_DAY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.LYCANROC_DUSK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.LYCANROC_NIGHT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.QuickStrike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.DRUDDIGON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WILD_MELEE
    },
    [Pkm.COSMOG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.COSMOEM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.SOLGALEO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.LUNALA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.MAGEARNA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.IMPIDIMP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.MORGREM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.GRIMMSNARL]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Charge,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.DEOXYS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Emit
    },
    [Pkm.DEOXYS_DEFENSE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Withdraw,
        emote: AnimationType.Shoot
    },
    [Pkm.DEOXYS_ATTACK]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge
    },
    [Pkm.DEOXYS_SPEED]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge
    },
    [Pkm.CRABRAWLER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.CRABOMINABLE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.CUTIEFLY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.BUG_RANGE
    },
    [Pkm.RIBOMBEE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.BUG_RANGE
    },
    [Pkm.ZANGOOSE]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.NICKIT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.THIEVUL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.DROWZEE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.HYPNO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.WATTREL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.FlapAround,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.KILOWATTREL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.FlapAround,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.STANTLER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.WYRDEER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.BURMY_PLANT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.BURMY_SANDY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.BURMY_TRASH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.WORMADAM_PLANT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.WORMADAM_SANDY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.WORMADAM_TRASH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.MOTHIM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Hover,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.WOOPER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.QUAGSIRE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.PALDEA_WOOPER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.CLODSIRE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.FUECOCO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.CROCALOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.SKELEDIRGE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.TANGELA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.TANGROWTH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Emit,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.PSYDUCK]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GOLDUCK]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.PHANPY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.TumbleBack,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.DONPHAN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.TumbleBack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.SPOINK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.GRUMPIG]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.SINISTEA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.POLTEAGEIST]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hop,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_RANGE
    },
    [Pkm.FERROSEED]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Special0,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.FERROTHORN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Special0,
        emote: AnimationType.Special0,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.GOLETT]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Tumble,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GOLURK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.TRUBBISH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Pose
    },
    [Pkm.GARBODOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shake,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.GRUBBIN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.CHARJABUG]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.VIKAVOLT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    },
    [Pkm.SHELLOS_WEST_SEA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.GASTRODON_WEST_SEA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SHELLOS_EAST_SEA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.GASTRODON_EAST_SEA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.MUNNA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.MUSHARNA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.KLEFKI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.STEEL_RANGE
    },
    [Pkm.RUFFLET]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.BRAVIARY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.HEATMOR]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.HAWLUCHA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Cringe,
        emote: AnimationType.Kick,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.MIENFOO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.MIENSHAO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.STONJOURNER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shake,
        emote: AnimationType.Shake
    },
    [Pkm.HISUI_SNEASEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.MultiScratch,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.SNEASLER]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.POIPOLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.NAGANADEL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.CRAMORANT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FLYING_RANGE
    },
    [Pkm.ARROKUDA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.WISHIWASHI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.WISHIWASHI_SCHOOL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.PAWMI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.PAWMO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.PAWMOT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.PYUKUMUKU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rumble,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.GOLDEEN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.SEAKING]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.LUVDISC]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.AUDINO]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Pose,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.SOUND_RANGE
    },
    [Pkm.PETILIL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Twirl,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.LILIGANT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.DeepBreath,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.HISUIAN_LILLIGANT]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.MANTYKE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hover,
        emote: AnimationType.Strike
    },
    [Pkm.MANTINE]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hover,
        emote: AnimationType.Strike,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.REMORAID]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.RearUp
    },
    [Pkm.OCTILLERY]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Attack,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.SIGILYPH]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.FRIGIBAX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.ARCTIBAX]: {
        attack: AnimationType.Scratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.BAXCALIBUR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.BINACLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.BARBARACLE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ROCK_RANGE
    },
    [Pkm.SKARMORY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge
    },
    [Pkm.DURANT]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.OGERPON_TEAL]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.OGERPON_TEAL_MASK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.OGERPON_WELLSPRING]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.OGERPON_WELLSPRING_MASK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.OGERPON_HEARTHFLAME]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.OGERPON_HEARTHFLAME_MASK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.OGERPON_CORNERSTONE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.OGERPON_CORNERSTONE_MASK]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.IRON_HANDS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Hop,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.ROOKIDEE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.CORVISQUIRE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.CORVIKNIGHT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.MURKROW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.HONCHKROW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.SANDYGAST]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.PALOSSAND]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GHOST_MELEE
    },
    [Pkm.TURTONATOR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rumble,
        attackSprite: AttackSprite.DRAGON_MELEE
    },
    [Pkm.SKORUPI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Jab,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.DRAPION]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Jab,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.DARUMAKA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.DARMANITAN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.QuickStrike,
        emote: AnimationType.Rumble,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.DARMANITAN_ZEN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.KRABBY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Slam,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.KINGLER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.ZYGARDE_10]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp
    },
    [Pkm.ZYGARDE_50]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Charge
    },
    [Pkm.ZYGARDE_100]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Emit,
        emote: AnimationType.Emit,
        attackSprite: AttackSprite.DRAGON_GREEN_RANGE
    },
    [Pkm.SIZZLIPEDE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.CENTISKORCH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.STUFFUL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.BEWEAR]: {
        attack: AnimationType.Slap,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GLIMMET]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Twirl,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.GLIMMORA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.FLETCHLING]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.FLETCHINDER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.TALONFLAME]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.VULLABY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.MANDIBUZZ]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.INKAY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.MALAMAR]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.TIMBURR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.GURDURR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Punch,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.CONKELDURR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.PILLAR_WOOD]: {
        attack: AnimationType.Idle,
        ability: AnimationType.Idle,
        emote: AnimationType.Idle,
        shinyUnavailable: true,
        noShadow: true
    },
    [Pkm.PILLAR_IRON]: {
        attack: AnimationType.Idle,
        ability: AnimationType.Idle,
        emote: AnimationType.Idle,
        shinyUnavailable: true,
        noShadow: true
    },
    [Pkm.PILLAR_CONCRETE]: {
        attack: AnimationType.Idle,
        ability: AnimationType.Idle,
        emote: AnimationType.Idle,
        shinyUnavailable: true,
        noShadow: true
    },
    [Pkm.ELGYEM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Charge,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.BEHEEYEM]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.LITTEN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.MultiScratch,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.TORRACAT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.MultiScratch,
        emote: AnimationType.Emit,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.INCINEROAR]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Ricochet,
        emote: AnimationType.Pose,
        shinyUnavailable: true, // missing Ricochet anim
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.DRACOZOLT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.ARCTOZOLT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Stomp,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.ARCTOVISH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Twirl,
        hop: AnimationType.Twirl,
        hurt: AnimationType.Idle,
        sleep: AnimationType.Idle,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.CRYOGONAL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ICE_RANGE
    },
    [Pkm.DRAMPA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.RearUp,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.DRAGON_RANGE
    },
    [Pkm.SKRELP]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.DRAGALGE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.CUBCHOO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.BEARTIC]: {
        attack: AnimationType.MultiStrike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },
    [Pkm.NACLI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Attack,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.NACLSTACK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Rotate,
        emote: AnimationType.Attack,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.GARGANACL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.ROCK_MELEE
    },
    [Pkm.CAPSAKID]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Double,
        emote: AnimationType.Dance,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.SCOVILLAIN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.SWIRLIX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.SLURPUFF]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.GULPIN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.SWALOT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.FIDOUGH]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.DACHSBUN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.TailWhip,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.MILCERY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_VANILLA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_RUBY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_MATCHA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_MINT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_LEMON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_SALTED]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_RUBY_SWIRL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_CARAMEL_SWIRL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.ALCREMIE_RAINBOW_SWIRL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Rotate,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FAIRY_RANGE
    },
    [Pkm.PECHARUNT]: {
        attack: AnimationType.Charge,
        ability: AnimationType.Charge,
        emote: AnimationType.Twirl,
        hop: AnimationType.Twirl,
        attackSprite: AttackSprite.POISON_RANGE
    },
    [Pkm.VELUZA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.DURALUDON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.STEEL_RANGE
    },
    [Pkm.ARCHALUDON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.STEEL_RANGE
    },
    [Pkm.SPRIGATITO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Appeal,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.FLORAGATO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.MEOWSCARADA]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.FOMANTIS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.LURANTIS]: {
        attack: AnimationType.MultiScratch,
        ability: AnimationType.Attack,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.ROARING_MOON]: {
        attack: AnimationType.Attack,
        ability: AnimationType.RearUp,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.CHARCADET]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge
    },
    [Pkm.ARMAROUGE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIRE_RANGE
    },
    [Pkm.CERULEDGE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FIRE_MELEE
    },
    [Pkm.TYNAMO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.EELEKTRIK]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.EELEKTROSS]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.ELECTRIC_MELEE
    },
    [Pkm.PIDOVE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.TRANQUILL]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.UNFEZANT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.ZACIAN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.RearUp,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.ZACIAN_CROWNED]: {
        attack: AnimationType.Scratch,
        ability: AnimationType.Shoot,
        emote: AnimationType.Charge,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.IRON_VALIANT]: {
        attack: AnimationType.Slice,
        ability: AnimationType.Twirl,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.PANCHAM]: {
        attack: AnimationType.Punch,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.PANGORO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.GROOKEY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Strike
    },
    [Pkm.THWACKEY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Sing,
        shinyUnavailable: true
    },
    [Pkm.RILLABOOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Sing,
        shinyUnavailable: true
    },
    [Pkm.KUBFU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.FIGHTING_MELEE
    },
    [Pkm.URSHIFU_RAPID]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.WATER_MELEE
    },
    [Pkm.URSHIFU_SINGLE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DARK_MELEE
    },
    [Pkm.SCREAM_TAIL]: {
        attack: AnimationType.Bite,
        ability: AnimationType.Shoot,
        emote: AnimationType.Withdraw,
        attackSprite: AttackSprite.FAIRY_MELEE
    },
    [Pkm.INDEEDEE_MALE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.INDEEDEE_FEMALE]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.PSYCHIC_RANGE
    },
    [Pkm.COTTONEE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Twirl,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.WHIMSICOTT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GRASS_RANGE
    },
    [Pkm.GIRAFARIG]: {
        attack: AnimationType.Stomp,
        ability: AnimationType.Shoot,
        emote: AnimationType.Bite,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.FARIGIRAF]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.SKITTY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Appeal,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.DELCATTY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Appeal,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.GLAMEOW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.PURUGLY]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.MINCCINO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Appeal
    },
    [Pkm.CINCCINO]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Dance
    },
    [Pkm.PIKACHU_SURFER]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot
    },
    [Pkm.ESPURR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.MEOWSTIC_MALE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.MEOWSTIC_FEMALE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.SpAttack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.PSYCHIC_MELEE
    },
    [Pkm.OKIDOGI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.MUNKIDORI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.POISON_MELEE
    },
    [Pkm.FEZANDIPITI]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.FlapAround,
        shinyUnavailable: true,
        attackSprite: AttackSprite.FLYING_MELEE
    },
    [Pkm.SURSKIT]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Swing,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.WATER_RANGE
    },
    [Pkm.MASQUERAIN]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Hover,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_RANGE
    },
    [Pkm.GOSSIFLEUR]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Twirl,
        emote: AnimationType.Twirl,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.ELDEGOSS]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.SpAttack,
        emote: AnimationType.SpAttack,
        attackSprite: AttackSprite.GRASS_MELEE
    },
    [Pkm.FURFROU]: {
        attack: AnimationType.Attack,
        ability: AnimationType.TailWhip,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.VAROOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.REVAVROOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Swing,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.STEEL_MELEE
    },
    [Pkm.CELESTEELA]: {
        attack: AnimationType.Slam,
        ability: AnimationType.Charge,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.NORMAL_MELEE
    },
    [Pkm.LEDYBA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Pose,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.LEDIAN]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Strike,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.BUG_MELEE
    },
    [Pkm.EMOLGA]: {
        attack: AnimationType.Shoot,
        ability: AnimationType.Shock,
        emote: AnimationType.DeepBreath,
        attackSprite: AttackSprite.ELECTRIC_RANGE
    }
}

