import {
  AnimationType,
  AttackSprite,
  HitSprite,
  PokemonAnimationConfig
} from "../../../../types/Animation"
import { Pkm } from "../../../../types/enum/Pokemon"

export const DEFAULT_POKEMON_ANIMATION_CONFIG: Required<PokemonAnimationConfig> =
  {
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
    hitSprite: [
      HitSprite.NORMAL_HIT,
      HitSprite.NORMAL_HIT2,
      HitSprite.NORMAL_HIT3,
      HitSprite.NORMAL_HIT4
    ],
    animationsOriented: []
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
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.IVYSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.VENUSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.CHARMANDER]: {
    attack: AnimationType.Kick,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CHARMELEON]: {
    attack: AnimationType.Strike,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CHARIZARD]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.SQUIRTLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.WARTORTLE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.BLASTOISE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.AZURILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Appeal,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.MARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.AZUMARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.ZUBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Charge,
    eat: AnimationType.Sleep,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.GOLBAT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Hover,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.CROBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.MAREEP]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.FLAFFY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.AMPHAROS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.CLEFFA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Dance,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.CLEFAIRY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Dance,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.CLEFABLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Dance,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.IGGLYBUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.WIGGLYTUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sleep,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.JIGGLYPUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.DeepBreath,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.CATERPIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.METAPOD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.BUTTERFREE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.WEEDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.KAKUNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.BEEDRILL]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.PIDGEY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.PIDGEOTTO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.PIDGEOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.HOPPIP]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SKIPLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.JUMPLUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SEEDOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.NUZLEAF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SHIFTRY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.STARLY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.STARAVIA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.STARAPTOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.CHIKORITA]: {
    attack: AnimationType.Slam,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.BAYLEEF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.MEGANIUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.CYNDAQUIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.QUILAVA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.TYPHLOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
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
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.GROVYLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SCEPTILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.TORCHIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.COMBUSKEN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.BLAZIKEN]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.MUDKIP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.MARSHTOMP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.SWAMPERT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.TURTWIG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rumble,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.GROTLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rumble,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.TORTERRA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rumble,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.CHIMCHAR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.MONFERNO]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.INFERNAPE]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
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
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.NIDORINA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.NIDOQUEEN]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
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
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.PIKACHU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.RAICHU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MACHOP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Strike,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.MACHOKE]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.MACHAMP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.HORSEA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SEADRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.KINGDRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.TRAPINCH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.VIBRAVA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.FLYGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.SPHEAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.SEALEO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.WALREIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
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
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MAGNETON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MAGNEZONE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.RHYHORN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.RHYDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.RHYPERIOR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rumble,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.TOGEPI]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Dance,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.TOGETIC]: {
    attack: AnimationType.Hover,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.TOGEKISS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.DUSKULL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.DUSCLOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.DUSKNOIR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.LOTAD]: {
    attack: AnimationType.Shake,
    ability: AnimationType.Double,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.LOMBRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Double,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.LUDICOLO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SHINX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.LUXIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.LUXRAY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.POLIWAG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Appeal,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.POLIWHIRL]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.POLITOED]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.ABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.KADABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.ALAKAZAM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GASTLY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Lick,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.HAUNTER]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Lick,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.GENGAR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Special2,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
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
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.PUPITAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.TYRANITAR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
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
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.KIRLIA]: {
    attack: AnimationType.Twirl,
    ability: AnimationType.Pose,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GARDEVOIR]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GALLADE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.STEEL_HIT
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
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.BELDUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.METANG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.METAGROSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Ricochet,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GIBLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.GABITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.GARCHOMP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.ELEKID]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ELECTABUZZ]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ELECTIVIRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MAGBY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.MAGMAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.MAGMORTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
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
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.ARCANINE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rumble,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
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
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.STEELIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  /*[Pkm.MEGA_STEELIX]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shoot,
        emote: AnimationType.Shoot,
        shinyUnavailable: true,
        attackSprite: AttackSprite.ROCK_MELEE
    },*/
  [Pkm.SCYTHER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Slice,
    emote: AnimationType.Shoot
  },
  [Pkm.SCIZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.KLEAVOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
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
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.RATTATA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.TailWhip,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.ALOLAN_RATTATA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.TailWhip,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.RATICATE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.ALOLAN_RATICATE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.TailWhip,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.SPEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.FEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.GYARADOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.LUGIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.SHADOW_LUGIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Dance,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.GIRATINA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.ZAPDOS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit,
    emote: AnimationType.Emit,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MOLTRES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.ARTICUNO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.GALARIAN_ZAPDOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.GALARIAN_MOLTRES]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.GALARIAN_ARTICUNO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
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
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ENTEI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.REGICE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.REGIROCK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
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
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.GROUDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.RAYQUAZA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.FLYING_HIT
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
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.JOLTEON]: {
    attack: AnimationType.Shock,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.FLAREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.ESPEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UMBREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.LEAFEON]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SYLVEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.MEDITITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.MEDICHAM]: {
    attack: AnimationType.Charge,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.NUMEL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.CAMERUPT]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  /*[Pkm.MEGA_CAMERUPT]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GROUND_MELEE
    },*/
  [Pkm.DARKRAI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sink,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.LITWICK]: {
    attack: AnimationType.Sink,
    ability: AnimationType.Pose,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.LAMPENT]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CHANDELURE]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.SLOWPOKE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SLOWBRO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SLOWKING]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.BELLSPROUT]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.WEEPINBELL]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.VICTREEBEL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
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
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.GLALIE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Bite,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.FROSLASS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.SNOVER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.ABOMASNOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  /*[Pkm.MEGA_ABOMASNOW]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ICE_MELEE
    },*/
  [Pkm.VANILLITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.VANILLISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.VANILLUXE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.GLACEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.LARVESTA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.VOLCARONA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.LANDORUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.THUNDURUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.TORNADUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.ENAMORUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.KELDEO]: {
    attack: AnimationType.Swing,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.TERRAKION]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.VIRIZION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
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
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.ROTOM]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Double,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ROTOM_DRONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    shinyUnavailable: true,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.SPIRITOMB]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Withdraw,
    attackSprite: AttackSprite.DARK_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.ABSOL]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.LAPRAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.LATIAS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.LATIOS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.MESPRIT]: {
    attack: AnimationType.Hover,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.AZELF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.UXIE]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.MEWTWO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Punch,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.KYUREM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.RESHIRAM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.ZEKROM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.CELEBI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.VICTINI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.JIRACHI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
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
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.CRESSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.HEATRAN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.HO_OH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Jab,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.AERODACTYL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.PRIMAL_KYOGRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swell,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.PRIMAL_GROUDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.FIRE_HIT
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
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.ALOLAN_PERSIAN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.DEINO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.ZWEILOUS]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.HYDREIGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.SANDILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.KROKOROK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.KROOKODILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.SOLOSIS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.DUOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.REUNICLUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.MEGA_RAYQUAZA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.ODDISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.GLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.VILEPLUME]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.BELLOSSOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Twirl,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
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
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.ARMALDO]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.ARCHEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.FlapAround,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.ARCHEOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.SHIELDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.BASTIODON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
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
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.OMASTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.TYRUNT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Bite,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.TYRANTRUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.BUDEW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.ROSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.ROSERADE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.BUNEARY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.LOPUNNY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  /*[Pkm.MEGA_LOPUNNY]: {
        attack: AnimationType.QuickStrike,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIGHTING_MELEE,
        hitSprite: HitSprite.FIGHTING_HIT
    },*/
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
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.WHIRLIPEDE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.SCOLIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
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
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MANECTRIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  /*[Pkm.MEGA_MANECTRIC]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shock,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.ELECTRIC_MELEE,
        hitSprite: HitSprite.ELECTRIC_HIT
    },*/
  [Pkm.SHUPPET]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.BANETTE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Double,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  /*[Pkm.MEGA_BANETTE]: {
        attack: AnimationType.Strike,
        ability: AnimationType.Double,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.GHOST_MELEE,
        hitSprite: HitSprite.GHOST_HIT
    },*/
  [Pkm.HONEDGE]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Swing,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.DOUBLADE]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Swing,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.AEGISLASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Special0,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT,
    animationsOriented: [AnimationType.Special0]
  },
  [Pkm.AEGISLASH_BLADE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Special0,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT,
    animationsOriented: [AnimationType.Special0]
  },
  [Pkm.CUBONE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.ALOLAN_MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Punch,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.WHISMUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.LOUDRED]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.EXPLOUD]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.TYMPOLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.PALPITOAD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SEISMITOAD]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SEWADDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.SWADLOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.LEAVANNY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
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
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLOETTE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLORGES]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLABEBE_BLUE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLOETTE_BLUE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLORGES_BLUE]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLABEBE_ORANGE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLOETTE_ORANGE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLORGES_ORANGE]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLABEBE_YELLOW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLOETTE_YELLOW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLORGES_YELLOW]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLABEBE_WHITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLOETTE_WHITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.FLORGES_WHITE]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.JANGMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.HAKAMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.KOMMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.MELOETTA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.PIROUETTE_MELOETTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.SWABLU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.ALTARIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  /*[Pkm.MEGA_ALTARIA]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Attack,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.DRAGON_RANGE,
        hitSprite: HitSprite.SOUND_HIT
    },*/
  [Pkm.CASTFORM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot
  },
  [Pkm.CASTFORM_SUN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CASTFORM_RAIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.CASTFORM_HAIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.CORPHISH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE
  },
  [Pkm.CRAWDAUNT]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE
  },
  [Pkm.JOLTIK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.GALVANTULA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
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
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.HATENNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.HATTREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
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
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.BRAIXEN]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.DELPHOX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.MAKUHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.HARIYAMA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.REGIELEKI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Attack,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
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
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.ETERNATUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.PONYTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.RAPIDASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.GALARIAN_PONYTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.GALARIAN_RAPIDASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.NINCADA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.NINJASK]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.SHEDINJA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
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
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.GOURGEIST]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.CACNEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.CACTURNE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
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
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.CHANSEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.BLISSEY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.TAPU_KOKO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.TAPU_LELE]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Charge,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.STAKATAKA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Sleep,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.BLACEPHALON]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.HOUNDOUR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.HOUNDOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  /*[Pkm.MEGA_HOUNDOOM]: {
        attack: AnimationType.Attack,
        ability: AnimationType.Shake,
        emote: AnimationType.Shoot,
        attackSprite: AttackSprite.FIRE_MELEE,
        hitSprite: HitSprite.DARK_HIT
    },*/
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
    ability: AnimationType.Attack,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.SALAZZLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.VENONAT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.VENOMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.FlapAround,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.VOLTORB]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ELECTRODE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.HISUI_VOLTORB]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Pose,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.HISUI_ELECTRODE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.SLUGMA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.MAGCARGO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hurt,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.SNEASEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.WEAVILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.CROAGUNK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.TOXICROAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.CHINCHOU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.LANTURN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.POOCHYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.MIGHTYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.BRONZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE
  },
  [Pkm.BRONZONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.DRIFLOON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.DRIFBLIM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.SHROOMISH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.BRELOOM]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.TENTACOOL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.TENTACRUEL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SNUBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.GRANBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.SEVIPER]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.DeepBreath,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.ALOLAN_VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.ALOLAN_NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.BUIZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.FLOATZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.MAWILE]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.KECLEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE
  },
  [Pkm.CARBINK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.DIANCIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.CHATOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Appeal,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
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
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.BOUNSWEET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.STEENEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.TSAREENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.VOLCANION]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.FIRE_HIT
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
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.DEWOTT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
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
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.FROSMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.WAILMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.WAILORD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.DREEPY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.DRAKLOAK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.DRAGAPULT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.SNIVY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Appeal,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SERVINE]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SERPERIOR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SCORBUNNY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Kick,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.RABOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CINDERACE]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.POPPLIO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.BRIONNE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.PRIMARINA]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.GOTHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GOTHORITA]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GOTHITELLE]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.SANDSHREW]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.LostBalance,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.SANDSLASH]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.DeepBreath,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GROUND_HIT
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
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.GALARIAN_FARFETCH_D]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.UNOWN_A]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_B]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_C]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_D]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_E]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_F]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_G]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_H]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_I]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_J]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_K]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_L]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_M]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_N]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_O]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_P]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_Q]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_R]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_S]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_T]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_U]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_V]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_W]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_X]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_Y]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_Z]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_QUESTION]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.UNOWN_EXCLAMATION]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.TAPU_FINI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.TAPU_BULU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.DIGLETT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn,
    emote: AnimationType.Special0,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.DUGTRIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn,
    emote: AnimationType.Special0,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.ALOLAN_DIGLETT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn,
    emote: AnimationType.Special0,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.ALOLAN_DUGTRIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk,
    emote: AnimationType.Hop,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.ROWLET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.DARTIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.DECIDUEYE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.HISUI_ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.HISUI_ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.FROAKIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.FROGADIER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.GRENINJA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Attack,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
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
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.MIMIKYU_BUSTED]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.ALOLAN_GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.ALOLAN_MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
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
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.FORRETRESS]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.SEEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.DEWGONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.ALOLAN_GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.ALOLAN_GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.ALOLAN_GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.EKANS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.ARBOK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.MIME_JR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.MR_MIME]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ORIGIN_GIRATINA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
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
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.HOOPA_UNBOUND]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Cringe,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
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
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.XERNEAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.YVELTAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.MARSHADOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.HOOTHOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.NOCTOWL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.BONSLEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.SUDOWOODO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Slam,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.PHIONE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.COMBEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.VESPIQUEEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
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
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.PIGNITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.EMBOAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.WYNAUT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.WOBBUFFET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.LUNATONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.SOLROCK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
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
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.WURMPLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.SILCOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.BEAUTIFLY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.FlapAround,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.CASCOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.DUSTOX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.FlapAround,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.TINKATINK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike,
    emote: AnimationType.Strike,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.TINKATUFF]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike,
    emote: AnimationType.Strike,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.TINKATON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Cringe,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.PARAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.PARASECT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.BUG_HIT
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
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.PRIMEAPE]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge,
    emote: AnimationType.Strike,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.ANNIHILAPE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.SUNKERN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.SUNFLORA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.MARACTUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Twirl,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.PLUSLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MINUN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.PINSIR]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Attack,
    emote: AnimationType.Slice,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.NATU]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Charge,
    emote: AnimationType.Hover,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.XATU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GLIGAR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.MultiStrike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.GLISCOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.SHELLDER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.CLOYSTER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SENTRET]: {
    attack: AnimationType.Strike,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.FURRET]: {
    attack: AnimationType.Strike,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.SPECTRIER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.TORKOAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.DELIBIRD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.IRON_BUNDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.KARTANA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.CHINGLING]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.CHIMECHO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
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
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.KOFFING]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Gas,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.WEEZING]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Gas,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.STARYU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.STARMIE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.NOSEPASS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.PROBOPASS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.WOOBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate,
    emote: AnimationType.Hover,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.SWOOBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate,
    emote: AnimationType.Hover,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.CLAUNCHER]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Appeal,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.CLAWITZER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.YANMA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.YANMEGA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.QuickStrike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.HELIOPTILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.HELIOLISK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
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
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.LIEPARD]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.BARBOACH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.WHISCASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
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
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.LUMINEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.STUNKY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.SKUNTANK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.ILLUMISE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.VOLBEAT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Appeal,
    emote: AnimationType.Appeal,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.NECROZMA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.ULTRA_NECROZMA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.CHERUBI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.CHERRIM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.CHERRIM_SUNLIGHT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.MISDREAVUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.MISMAGIUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
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
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
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
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.KRICKETUNE]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.HIPPOPOTAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.HIPPODOWN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.WINGULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.PELIPPER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.NIHILEGO]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.SOBBLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.DRIZZILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    shinyUnavailable: true,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.INTELEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Strike,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.TROPIUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.EXEGGCUTE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.GRASS_RANGE
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
    emote: AnimationType.Hop,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.CARNIVINE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.HISUIAN_QWILFISH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Withdraw,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.OVERQWIL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.DARK_HIT
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
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.LINOONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.GALARIAN_ZIGZAGOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.GALARIAN_LINOONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.OBSTAGOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Double,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.SOUND_HIT
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
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
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
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.GALAR_CORSOLA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.CURSOLA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.GIMMIGHOUL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
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
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.TREVENANT]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Swing,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
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
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.TOXTRICITY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.BRUXISH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
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
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.BISHARP]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.KINGAMBIT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.MINIOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.MINIOR_KERNEL_RED]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.MINIOR_KERNEL_BLUE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.MINIOR_KERNEL_ORANGE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.MINIOR_KERNEL_GREEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.FEEBAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Dance,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.MILOTIC]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.MORPEKO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.MORPEKO_HANGRY]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Special0,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.KANGASKHAN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.TEDDIURSA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch,
    emote: AnimationType.Appeal,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.URSARING]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiStrike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.URSALUNA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.URSALUNA_BLOODMOON]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
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
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.WATCHOG]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Rotate,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.SPINARAK]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.ARIADOS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.DEWPIDER]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.ARAQUANID]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.ROCKRUFF]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.DeepBreath,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.LYCANROC_DAY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.LYCANROC_DUSK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.LYCANROC_NIGHT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.QuickStrike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.DRUDDIGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.COSMOG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.COSMOEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
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
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.MAGEARNA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.IMPIDIMP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.MORGREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
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
    emote: AnimationType.Emit,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.DEOXYS_DEFENSE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.DEOXYS_ATTACK]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.DEOXYS_SPEED]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.CRABRAWLER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.CRABOMINABLE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.CUTIEFLY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.RIBOMBEE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ZANGOOSE]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.NICKIT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.THIEVUL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.DROWZEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.HYPNO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.WATTREL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.FlapAround,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.KILOWATTREL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.FlapAround,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.STANTLER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.WYRDEER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.BURMY_PLANT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Attack,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.BURMY_SANDY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Attack,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.GROUND_HIT
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
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.WOOPER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.QUAGSIRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.PALDEA_WOOPER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.CLODSIRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.FUECOCO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CROCALOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
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
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.TANGROWTH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Emit,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.PSYDUCK]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GOLDUCK]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.PHANPY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.TumbleBack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE
  },
  [Pkm.DONPHAN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Special0,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ROCK_MELEE,
    animationsOriented: [AnimationType.Special0]
  },
  [Pkm.SPOINK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.GRUMPIG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.SINISTEA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.POLTEAGEIST]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GHOST_RANGE,
    hitSprite: HitSprite.GHOST_HIT
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
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.GOLURK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.TRUBBISH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.GARBODOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.GRUBBIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.CHARJABUG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.VIKAVOLT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.SHELLOS_WEST_SEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.GASTRODON_WEST_SEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SHELLOS_EAST_SEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.GASTRODON_EAST_SEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.MUNNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.MUSHARNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
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
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.BRAVIARY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.HEATMOR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.HAWLUCHA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Cringe,
    emote: AnimationType.Kick,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.MIENFOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.MIENSHAO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.STONJOURNER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.HISUI_SNEASEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.SNEASLER]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.POIPOLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.NAGANADEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.CRAMORANT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FLYING_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.ARROKUDA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.WISHIWASHI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.WISHIWASHI_SCHOOL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.PAWMI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.PAWMO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.PAWMOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.PYUKUMUKU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rumble,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.GOLDEEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.SEAKING]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WATER_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.LUVDISC]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.AUDINO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.SOUND_RANGE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.PETILIL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Twirl,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.LILIGANT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.HISUIAN_LILLIGANT]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.MANTYKE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover,
    emote: AnimationType.Strike,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.MANTINE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover,
    emote: AnimationType.Strike,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.REMORAID]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WILD_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.OCTILLERY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.SIGILYPH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
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
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.BARBARACLE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.SKARMORY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.DURANT]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.OGERPON_TEAL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.OGERPON_TEAL_MASK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.OGERPON_WELLSPRING]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.OGERPON_WELLSPRING_MASK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.OGERPON_HEARTHFLAME]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.OGERPON_HEARTHFLAME_MASK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.OGERPON_CORNERSTONE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.OGERPON_CORNERSTONE_MASK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.IRON_HANDS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Hop,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ROOKIDEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.CORVISQUIRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.CORVIKNIGHT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.MURKROW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.HONCHKROW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.SANDYGAST]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.PALOSSAND]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GHOST_MELEE,
    hitSprite: HitSprite.GHOST_HIT
  },
  [Pkm.TURTONATOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rumble,
    attackSprite: AttackSprite.DRAGON_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.SKORUPI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Jab,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.DRAPION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Jab,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.DARUMAKA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.DARMANITAN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.QuickStrike,
    emote: AnimationType.Rumble,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.WILD_HIT
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
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.KINGLER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.WATER_HIT
  },
  [Pkm.ZYGARDE_10]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp
  },
  [Pkm.ZYGARDE_50]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.DRAGON_GREEN_RANGE
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
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CENTISKORCH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.STUFFUL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.BEWEAR]: {
    attack: AnimationType.Slap,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.GLIMMET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Twirl,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.GLIMMORA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.FLETCHLING]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.FLETCHINDER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.TALONFLAME]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.VULLABY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.MANDIBUZZ]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.INKAY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.MALAMAR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.DARK_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.TIMBURR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.GURDURR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Punch,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.CONKELDURR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.PILLAR_WOOD]: {
    attack: AnimationType.Idle,
    ability: AnimationType.Idle,
    emote: AnimationType.Idle,
    hop: AnimationType.Idle,
    shinyUnavailable: true,
    noShadow: true
  },
  [Pkm.PILLAR_IRON]: {
    attack: AnimationType.Idle,
    ability: AnimationType.Idle,
    emote: AnimationType.Idle,
    hop: AnimationType.Idle,
    shinyUnavailable: true,
    noShadow: true
  },
  [Pkm.PILLAR_CONCRETE]: {
    attack: AnimationType.Idle,
    ability: AnimationType.Idle,
    emote: AnimationType.Idle,
    hop: AnimationType.Idle,
    shinyUnavailable: true,
    noShadow: true
  },
  [Pkm.ELGYEM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.DeepBreath,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.BEHEEYEM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.LITTEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.TORRACAT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch,
    emote: AnimationType.Emit,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.INCINEROAR]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Ricochet,
    emote: AnimationType.Pose,
    shinyUnavailable: true, // missing Ricochet anim
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.DRACOZOLT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ARCTOZOLT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Stomp,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.ARCTOVISH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Twirl,
    hop: AnimationType.Twirl,
    hurt: AnimationType.Idle,
    sleep: AnimationType.Idle,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.CRYOGONAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ICE_RANGE,
    hitSprite: HitSprite.ICE_HIT
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
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.DRAGALGE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.CUBCHOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.BEARTIC]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.ICE_MELEE,
    hitSprite: HitSprite.ICE_HIT
  },
  [Pkm.NACLI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rotate,
    emote: AnimationType.Attack,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.NACLSTACK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rotate,
    emote: AnimationType.Attack,
    shinyUnavailable: true,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.GARGANACL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.ROCK_MELEE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.CAPSAKID]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Dance,
    emote: AnimationType.Dance,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.SCOVILLAIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Dance,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.SWIRLIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.SLURPUFF]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.GULPIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.SWALOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.FIDOUGH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.DACHSBUN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.TailWhip,
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.MILCERY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_VANILLA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_RUBY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_MATCHA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_MINT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_LEMON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_SALTED]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_RUBY_SWIRL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_CARAMEL_SWIRL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.ALCREMIE_RAINBOW_SWIRL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Rotate,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FAIRY_RANGE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.PECHARUNT]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Charge,
    emote: AnimationType.Twirl,
    hop: AnimationType.Twirl,
    attackSprite: AttackSprite.POISON_RANGE,
    hitSprite: HitSprite.POISON_HIT
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
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.FLORAGATO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.MEOWSCARADA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.FOMANTIS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.LURANTIS]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Attack,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.GRASS_MELEE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.ROARING_MOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp,
    emote: AnimationType.RearUp,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.CHARCADET]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.ARMAROUGE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIRE_RANGE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.CERULEDGE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.FIRE_MELEE,
    hitSprite: HitSprite.FIRE_HIT
  },
  [Pkm.TYNAMO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    shinyUnavailable: true,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.EELEKTRIK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.EELEKTROSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ELECTRIC_MELEE,
    hitSprite: HitSprite.ELECTRIC_HIT
  },
  [Pkm.PIDOVE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.TRANQUILL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.UNFEZANT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
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
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.STEEL_HIT
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
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.PANGORO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.GROOKEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Strike,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.THWACKEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Sing,
    shinyUnavailable: true,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.RILLABOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Sing,
    shinyUnavailable: true,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.SOUND_HIT
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
    attackSprite: AttackSprite.FAIRY_MELEE,
    hitSprite: HitSprite.SOUND_HIT
  },
  [Pkm.INDEEDEE_MALE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.INDEEDEE_FEMALE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.PSYCHIC_RANGE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.COTTONEE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Twirl,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.WHIMSICOTT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
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
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
  },
  [Pkm.DELCATTY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Appeal,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.FAIRY_HIT
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
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.MEOWSTIC_MALE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.MEOWSTIC_FEMALE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.SpAttack,
    emote: AnimationType.SpAttack,
    attackSprite: AttackSprite.PSYCHIC_MELEE,
    hitSprite: HitSprite.PSYCHIC_HIT
  },
  [Pkm.OKIDOGI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    shinyUnavailable: true,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.WILD_HIT
  },
  [Pkm.MUNKIDORI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    shinyUnavailable: true,
    attackSprite: AttackSprite.POISON_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.FEZANDIPITI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.FlapAround,
    shinyUnavailable: true,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.POISON_HIT
  },
  [Pkm.SURSKIT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing,
    emote: AnimationType.Twirl,
    attackSprite: AttackSprite.WATER_RANGE,
    hitSprite: HitSprite.BUG_HIT
  },
  [Pkm.MASQUERAIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_RANGE,
    hitSprite: HitSprite.BUG_HIT
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
    attackSprite: AttackSprite.NORMAL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.LEDYBA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.LEDIAN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.EMOLGA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shock,
    emote: AnimationType.DeepBreath,
    attackSprite: AttackSprite.ELECTRIC_RANGE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.TAILLOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.SWELLOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FLYING_MELEE,
    hitSprite: HitSprite.FLYING_HIT
  },
  [Pkm.DRILBUR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch,
    emote: AnimationType.Emit,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.EXCADRILL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.ROGGENROLA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.BOLDORE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.GIGALITH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.ROCK_RANGE,
    hitSprite: HitSprite.ROCK_HIT
  },
  [Pkm.TOGEDEMARU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock,
    emote: AnimationType.Charge,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.FALINKS_BRASS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.FALINKS_TROOPER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.STEEL_HIT
  },
  [Pkm.DEDENNE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge,
    emote: AnimationType.Rotate,
    attackSprite: AttackSprite.STEEL_MELEE,
    hitSprite: HitSprite.FAIRY_HIT,
    hurt: AnimationType.Charge,
    eat: AnimationType.Sleep
  },
  [Pkm.SILICOBRA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.SANDACONDA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.DUNSPARCE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.DeepBreath,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.DUDUNSPARCE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.GROUND_MELEE,
    hitSprite: HitSprite.GROUND_HIT
  },
  [Pkm.SMOLIV]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shake,
    emote: AnimationType.Shake,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.DOLLIV]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.ARBOLIVA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.GRASS_RANGE,
    hitSprite: HitSprite.GRASS_HIT
  },
  [Pkm.CHESPIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot,
    emote: AnimationType.Pose,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.QUILLADIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.CHESNAUGHT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Rumble,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.FIGHTING_MELEE,
    hitSprite: HitSprite.FIGHTING_HIT
  },
  [Pkm.NYMBLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.DARK_HIT
  },
  [Pkm.LOKIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack,
    emote: AnimationType.Shoot,
    attackSprite: AttackSprite.BUG_MELEE,
    hitSprite: HitSprite.DARK_HIT
  }
}