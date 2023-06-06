import { Pkm } from "./enum/Pokemon"

export enum AnimationType {
  Idle = "Idle",
  Walk = "Walk",
  Sleep = "Sleep",
  Hurt = "Hurt",
  Attack = "Attack",
  Charge = "Charge",
  Shoot = "Shoot",
  Strike = "Strike",
  Chop = "Chop",
  Scratch = "Scratch",
  Punch = "Punch",
  Slap = "Slap",
  Slice = "Slice",
  MultiScratch = "MultiScratch",
  MultiStrike = "MultiStrike",
  Uppercut = "Uppercut",
  Ricochet = "Ricochet",
  Bite = "Bite",
  Shake = "Shake",
  Jab = "Jab",
  Kick = "Kick",
  Lick = "Lick",
  Slam = "Slam",
  Stomp = "Stomp",
  Appeal = "Appeal",
  Dance = "Dance",
  Twirl = "Twirl",
  TailWhip = "TailWhip",
  Sing = "Sing",
  Sound = "Sound",
  Rumble = "Rumble",
  FlapAround = "FlapAround",
  Gas = "Gas",
  Shock = "Shock",
  Emit = "Emit",
  SpAttack = "SpAttack",
  Withdraw = "Withdraw",
  RearUp = "RearUp",
  Swell = "Swell",
  Swing = "Swing",
  Double = "Double",
  Rotate = "Rotate",
  Hop = "Hop",
  Hover = "Hover",
  QuickStrike = "QuickStrike",
  EventSleep = "EventSleep",
  Wake = "Wake",
  Eat = "Eat",
  Tumble = "Tumble",
  Pose = "Pose",
  Pull = "Pull",
  Pain = "Pain",
  Float = "Float",
  DeepBreath = "DeepBreath",
  Nod = "Nod",
  Sit = "Sit",
  LookUp = "LookUp",
  Sink = "Sink",
  Trip = "Trip",
  Laying = "Laying",
  LeapForth = "LeapForth",
  Head = "Head",
  Cringe = "Cringe",
  LostBalance = "LostBalance",
  TumbleBack = "TumbleBack",
  HitGround = "HitGround",
  Faint = "Faint",
  Fainted = "Fainted",
  StandingUp = "StandingUp",
  DigIn = "DigIn",
  DigOut = "DigOut",
  Wiggle = "Wiggle",
  Yawn = "Yawn",
  RaiseArms = "RaiseArms",
  CarefulWalk = "CarefulWalk",
  Injured = "Injured",
  Jump = "Jump",
  Roar = "Roar",
  Wave = "Wave",
  Cry = "Cry",
  Bow = "Bow",
  Special0 = "Special0",
  Special1 = "Special1",
  Special2 = "Special2",
  Special3 = "Special3",
  Special4 = "Special4",
  Special5 = "Special5",
  Special6 = "Special6",
  Special7 = "Special7",
  Special8 = "Special8",
  Special9 = "Special9",
  Special10 = "Special10",
  Special11 = "Special11",
  Special12 = "Special12",
  Special13 = "Special13",
  Special14 = "Special14",
  Special15 = "Special15",
  Special16 = "Special16",
  Special17 = "Special17",
  Special18 = "Special18",
  Special19 = "Special19",
  Special20 = "Special20",
  Special21 = "Special21",
  Special22 = "Special22",
  Special23 = "Special23",
  Special24 = "Special24",
  Special25 = "Special25",
  Special26 = "Special26",
  Special27 = "Special27",
  Special28 = "Special28",
  Special29 = "Special29",
  Special30 = "Special30",
  Special31 = "Special31"
}

export const AnimationConfig: {
  [key in Pkm]: { attack: AnimationType; ability: AnimationType }
} = {
  [Pkm.EGG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.DITTO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BULBASAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.IVYSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.VENUSAUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.CHARMANDER]: {
    attack: AnimationType.Kick,
    ability: AnimationType.DeepBreath
  },
  [Pkm.CHARMELEON]: {
    attack: AnimationType.Strike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.CHARIZARD]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.SQUIRTLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.WARTORTLE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot
  },
  [Pkm.BLASTOISE]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Shoot
  },
  [Pkm.GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.AZURILL]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Special0
  },
  [Pkm.MARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.AZUMARILL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.ZUBAT]: {
    attack: AnimationType.Eat,
    ability: AnimationType.Attack
  },
  [Pkm.GOLBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.CROBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.MAREEP]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Attack
  },
  [Pkm.FLAFFY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.AMPHAROS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CLEFFA]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.CLEFAIRY]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.CLEFABLE]: {
    attack: AnimationType.Dance,
    ability: AnimationType.Rotate
  },
  [Pkm.IGGLYBUFF]: {
    attack: AnimationType.Special1,
    ability: AnimationType.EventSleep
  },
  [Pkm.WIGGLYTUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sleep
  },
  [Pkm.JIGGLYPUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CATERPIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.METAPOD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BUTTERFREE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.WEEDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.KAKUNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.BEEDRILL]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Attack
  },
  [Pkm.PIDGEY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.PIDGEOTTO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.PIDGEOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.HOPPIP]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.SKIPLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.JUMPLUFF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SEEDOT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.NUZLEAF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SHIFTRY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Attack
  },
  [Pkm.STARLY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.STARAVIA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.STARAPTOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CHIKORITA]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.Charge
  },
  [Pkm.BAYLEEF]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MEGANIUM]: {
    attack: AnimationType.Shake,
    ability: AnimationType.Charge
  },
  [Pkm.CYNDAQUIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.QUILAVA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.TYPHLOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.TOTODILE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.HitGround
  },
  [Pkm.CROCONAW]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.FERALIGATR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.TREECKO]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Pose
  },
  [Pkm.GROVYLE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Special17
  },
  [Pkm.SCEPTILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.TORCHIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.COMBUSKEN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.BLAZIKEN]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick
  },
  [Pkm.MUDKIP]: {
    attack: AnimationType.Pose,
    ability: AnimationType.Twirl
  },
  [Pkm.MARSHTOMP]: {
    attack: AnimationType.Withdraw,
    ability: AnimationType.Swing
  },
  [Pkm.SWAMPERT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.TURTWIG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.GROTLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.TORTERRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.CHIMCHAR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.MONFERNO]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.INFERNAPE]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.PIPLUP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.PRINPLUP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.EMPOLEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.NIDORANF]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDORINA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDOQUEEN]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NIDORANM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.NIDORINO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.NIDOKING]: {
    attack: AnimationType.Strike,
    ability: AnimationType.RearUp
  },
  [Pkm.PICHU]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Shock
  },
  [Pkm.PIKACHU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shock
  },
  [Pkm.RAICHU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shock
  },
  [Pkm.MACHOP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Strike
  },
  [Pkm.MACHOKE]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch
  },
  [Pkm.MACHAMP]: {
    attack: AnimationType.Kick,
    ability: AnimationType.Punch
  },
  [Pkm.HORSEA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.SEADRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.KINGDRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.TRAPINCH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing
  },
  [Pkm.VIBRAVA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.FLYGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.SPHEAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.SEALEO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.WALREIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ARON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.LAIRON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.AGGRON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigOut
  },
  [Pkm.MAGNEMITE]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.MAGNETON]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.MAGNEZONE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.RHYHORN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp
  },
  [Pkm.RHYDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Stomp
  },
  [Pkm.RHYPERIOR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rumble
  },
  [Pkm.TOGEPI]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Dance
  },
  [Pkm.TOGETIC]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Dance
  },
  [Pkm.TOGEKISS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.DUSKULL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.DUSCLOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.DUSKNOIR]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Special3
  },
  [Pkm.LOTAD]: {
    attack: AnimationType.Shake,
    ability: AnimationType.Double
  },
  [Pkm.LOMBRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Double
  },
  [Pkm.LUDICOLO]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Double
  },
  [Pkm.SHINX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.LUXIO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.LUXRAY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.POLIWAG]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.POLIWHIRL]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Rotate
  },
  [Pkm.POLITOED]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Rotate
  },
  [Pkm.ABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.KADABRA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ALAKAZAM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special1
  },
  [Pkm.GASTLY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Lick
  },
  [Pkm.HAUNTER]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.MultiStrike
  },
  [Pkm.GENGAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special2
  },
  [Pkm.DRATINI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.DRAGONAIR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DRAGONITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.LARVITAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PUPITAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TYRANITAR]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.SLAKOTH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Appeal
  },
  [Pkm.VIGOROTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Dance
  },
  [Pkm.SLAKING]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Dance
  },
  [Pkm.RALTS]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Pull
  },
  [Pkm.KIRLIA]: {
    attack: AnimationType.Twirl,
    ability: AnimationType.Pose
  },
  [Pkm.GARDEVOIR]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Special2
  },
  [Pkm.BAGON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Bite
  },
  [Pkm.SHELGON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SALAMENCE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.BELDUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.METANG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch
  },
  [Pkm.METAGROSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Ricochet
  },
  [Pkm.GIBLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GABITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GARCHOMP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ELEKID]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shock
  },
  [Pkm.ELECTABUZZ]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.ELECTIVIRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.MAGBY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.MAGMAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MAGMORTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MUNCHLAX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.DeepBreath
  },
  [Pkm.SNORLAX]: {
    attack: AnimationType.Stomp,
    ability: AnimationType.Charge
  },
  [Pkm.GROWLITHE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ARCANINE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ONIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.STEELIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MEGA_STEELIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SCYTHER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Slice
  },
  [Pkm.SCIZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.MultiScratch
  },
  [Pkm.MEGA_SCIZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RIOLU]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Pose
  },
  [Pkm.LUCARIO]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Pose
  },
  [Pkm.MEGA_LUCARIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MAGIKARP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.RATTATA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.RATICATE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SPEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.FEAROW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.GYARADOS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Attack
  },
  [Pkm.LUGIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.GIRATINA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.ZAPDOS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.MOLTRES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.ARTICUNO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.DIALGA]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special0
  },
  [Pkm.PALKIA]: {
    attack: AnimationType.Special0,
    ability: AnimationType.RearUp
  },
  [Pkm.SUICUNE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Roar
  },
  [Pkm.RAIKOU]: {
    attack: AnimationType.Shock,
    ability: AnimationType.Roar
  },
  [Pkm.ENTEI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Roar
  },
  [Pkm.REGICE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REGIROCK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.REGISTEEL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.KYOGRE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.GROUDON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.RAYQUAZA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REGIGIGAS]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Special0
  },
  [Pkm.EEVEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.VAPOREON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.JOLTEON]: {
    attack: AnimationType.Shock,
    ability: AnimationType.Pose
  },
  [Pkm.FLAREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.ESPEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.UMBREON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Eat
  },
  [Pkm.LEAFEON]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.DeepBreath
  },
  [Pkm.SYLVEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.MEDITITE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.SpAttack
  },
  [Pkm.MEDICHAM]: {
    attack: AnimationType.Charge,
    ability: AnimationType.SpAttack
  },
  [Pkm.MEGA_MEDICHAM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.NUMEL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.CAMERUPT]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_CAMERUPT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.DARKRAI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Sink
  },
  [Pkm.LITWICK]: {
    attack: AnimationType.Sink,
    ability: AnimationType.Pose
  },
  [Pkm.LAMPENT]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate
  },
  [Pkm.CHANDELURE]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Rotate
  },
  [Pkm.SLOWPOKE]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Swing
  },
  [Pkm.SLOWBRO]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shake
  },
  [Pkm.SLOWKING]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.BELLSPROUT]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Rotate
  },
  [Pkm.WEEPINBELL]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Rotate
  },
  [Pkm.VICTREEBEL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Swing
  },
  [Pkm.SWINUB]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shake
  },
  [Pkm.PILOSWINE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.MAMOSWINE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Special0
  },
  [Pkm.SNORUNT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.GLALIE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Bite
  },
  [Pkm.FROSLASS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.SNOVER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.ABOMASNOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_ABOMASNOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.VANILLITE]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.HitGround
  },
  [Pkm.VANILLISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.VANILLUXE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GLACEON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.VOLCARONA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.LANDORUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.THUNDURUS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TORNADUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.KELDEO]: {
    attack: AnimationType.Swing,
    ability: AnimationType.RearUp
  },
  [Pkm.TERRAKION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.VIRIZION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.COBALION]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.MANAPHY]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Double
  },
  [Pkm.ROTOM]: {
    attack: AnimationType.Emit,
    ability: AnimationType.Double
  },
  [Pkm.SPIRITOMB]: {
    attack: AnimationType.Withdraw,
    ability: AnimationType.Special1
  },
  [Pkm.ABSOL]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.SpAttack
  },
  [Pkm.LAPRAS]: {
    attack: AnimationType.Swing,
    ability: AnimationType.RearUp
  },
  [Pkm.LATIAS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special2
  },
  [Pkm.LATIOS]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Special0
  },
  [Pkm.MESPRIT]: {
    attack: AnimationType.Hover,
    ability: AnimationType.DeepBreath
  },
  [Pkm.AZELF]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Special1
  },
  [Pkm.UXIE]: {
    attack: AnimationType.Hover,
    ability: AnimationType.Attack
  },
  [Pkm.MEWTWO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.KYUREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RESHIRAM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.ZEKROM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CELEBI]: {
    attack: AnimationType.DeepBreath,
    ability: AnimationType.Special0
  },
  [Pkm.VICTINI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.JIRACHI]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.ARCEUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Pose
  },
  [Pkm.DEOXYS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.SHAYMIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.CRESSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.HEATRAN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.HO_OH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Jab
  },
  [Pkm.AERODACTYL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.PRIMAL_KYOGRE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PRIMAL_GROUDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MEOWTH]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Pose
  },
  [Pkm.PERSIAN]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.DEINO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ZWEILOUS]: {
    attack: AnimationType.Jab,
    ability: AnimationType.Charge
  },
  [Pkm.HYDREIGON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SANDILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.KROKOROK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.KROOKODILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SOLOSIS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.DUOSION]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.REUNICLUS]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.MEGA_RAYQUAZA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SWABLU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.ODDISH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.GLOOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.VILEPLUME]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.BELLOSSOM]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Twirl
  },
  [Pkm.AMAURA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.AURORUS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ANORITH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Scratch
  },
  [Pkm.ARMALDO]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Special0
  },
  [Pkm.ARCHEN]: {
    attack: AnimationType.Swing,
    ability: AnimationType.FlapAround
  },
  [Pkm.ARCHEOPS]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Strike
  },
  [Pkm.SHIELDON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BASTIODON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TIRTOUGA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CARRACOSTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.LILEEP]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Shoot
  },
  [Pkm.CRADILY]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Shoot
  },
  [Pkm.CRANIDOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.RAMPARDOS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.KABUTO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.KABUTOPS]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge
  },
  [Pkm.OMANYTE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw
  },
  [Pkm.OMASTAR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Withdraw
  },
  [Pkm.TYRUNT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TYRANTRUM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BUDEW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ROSELIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ROSERADE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.BUNEARY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.LOPUNNY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.MEGA_LOPUNNY]: {
    attack: AnimationType.QuickStrike,
    ability: AnimationType.Attack
  },
  [Pkm.AXEW]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Emit
  },
  [Pkm.FRAXURE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HAXORUS]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Charge
  },
  [Pkm.VENIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.WHIRLIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SCOLIPEDE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PORYGON]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Charge
  },
  [Pkm.PORYGON_2]: {
    attack: AnimationType.RearUp,
    ability: AnimationType.Charge
  },
  [Pkm.PORYGON_Z]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swing
  },
  [Pkm.ELECTRIKE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock
  },
  [Pkm.MANECTRIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shock
  },
  [Pkm.MEGA_MANECTRIC]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SHUPPET]: {
    attack: AnimationType.SpAttack,
    ability: AnimationType.Double
  },
  [Pkm.BANETTE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Double
  },
  [Pkm.MEGA_BANETTE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Double
  },
  [Pkm.HONEDGE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Head
  },
  [Pkm.DOUBLADE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.AEGISLASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.CUBONE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.SpAttack
  },
  [Pkm.MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_MAROWAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Punch
  },
  [Pkm.WHISMUR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal
  },
  [Pkm.LOUDRED]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Appeal
  },
  [Pkm.EXPLOUD]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.TYMPOLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PALPITOAD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SEISMITOAD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SEWADDLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SWADLOON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.LEAVANNY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.PIKIPEK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TRUMBEAK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.TOUCANNON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.FLABEBE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.FLOETTE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.FLORGES]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.JANGMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.HAKAMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.KOMMO_O]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.MELOETTA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.ALTARIA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.MEGA_ALTARIA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CASTFORM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Rotate
  },
  [Pkm.CASTFORM_SUN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.CASTFORM_RAIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.CASTFORM_HAIL]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.CORPHISH]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Hop
  },
  [Pkm.CRAWDAUNT]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Hop
  },
  [Pkm.JOLTIK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.GALVANTULA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.GENESECT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.RELICANTH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.HATENNA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HATTREM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HATTERENE]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Charge
  },
  [Pkm.FENNEKIN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.BRAIXEN]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Hop
  },
  [Pkm.DELPHOX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.MAKUHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.HARIYAMA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.REGIELEKI]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Charge
  },
  [Pkm.REGIDRAGO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.GUZZLORD]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.ETERNATUS]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Attack
  },
  [Pkm.PONYTA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk
  },
  [Pkm.RAPIDASH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Walk
  },
  [Pkm.NINCADA]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.NINJASK]: {
    attack: AnimationType.MultiScratch,
    ability: AnimationType.Shoot
  },
  [Pkm.SHEDNINJA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Charge
  },
  [Pkm.NOIBAT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.NOIVERN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hover
  },
  [Pkm.PUMPKABOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOURGEIST]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover
  },
  [Pkm.CACNEA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.CACTURNE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.TAUROS]: {
    attack: AnimationType.Stomp,
    ability: AnimationType.Attack
  },
  [Pkm.DEFAULT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HAPPINY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake
  },
  [Pkm.CHANSEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.BLISSEY]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Shoot
  },
  [Pkm.TAPU_KOKO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Emit
  },
  [Pkm.TAPU_LELE]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Charge
  },
  [Pkm.STAKATAKA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Sleep
  },
  [Pkm.BLACEPHALON]: {
    attack: AnimationType.Hop,
    ability: AnimationType.Attack
  },
  [Pkm.HOUNDOUR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.HOUNDOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.RearUp
  },
  [Pkm.MEGA_HOUNDOOM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shake
  },
  [Pkm.CLAMPERL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.HUNTAIL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOREBYSS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SMOOCHUM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Twirl
  },
  [Pkm.JYNX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Slap
  },
  [Pkm.SALANDIT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.SALAZZLE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.VENONAT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.VENOMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.FlapAround
  },
  [Pkm.VOLTORB]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.ELECTRODE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.SLUGMA]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.MAGCARGO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hurt
  },
  [Pkm.SNEASEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DeepBreath
  },
  [Pkm.WEAVILE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.CROAGUNK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike
  },
  [Pkm.TOXICROAK]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Strike
  },
  [Pkm.CHINCHOU]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.LANTURN]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.POOCHYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.MIGHTYENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.BRONZOR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.BRONZONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Emit
  },
  [Pkm.DRIFLOON]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Swell
  },
  [Pkm.DRIFBLIM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Idle
  },
  [Pkm.SHROOMISH]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.BRELOOM]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Charge
  },
  [Pkm.TENTACOOL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.TENTACRUEL]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Charge
  },
  [Pkm.SNUBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GRANBULL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SEVIPER]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Shoot
  },
  [Pkm.VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ALOLAN_VULPIX]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.ALOLAN_NINETALES]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.RearUp
  },
  [Pkm.BUIZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.FLOATZEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.MAWILE]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swing
  },
  [Pkm.KECLEON]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.CARBINK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.DIANCIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.CHATOT]: {
    attack: AnimationType.Special0,
    ability: AnimationType.Charge
  },
  [Pkm.GOOMY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SLIGOO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.GOODRA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MEW]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.BOUNSWEET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.STEENEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.TSAREENA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.VOLCANION]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot
  },
  [Pkm.APPLIN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.APPLETUN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.OSHAWOTT]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Attack
  },
  [Pkm.DEWOTT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hop
  },
  [Pkm.SAMUROTT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Strike
  },
  [Pkm.SNOM]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.FROSMOTH]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Hop
  },
  [Pkm.WAILMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.WAILORD]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.DREEPY]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.DRAKLOAK]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.DRAGAPULT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.SNIVY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Appeal
  },
  [Pkm.SERVINE]: {
    attack: AnimationType.Slice,
    ability: AnimationType.Charge
  },
  [Pkm.SERPERIOR]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Charge
  },
  [Pkm.SCORBUNNY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Kick
  },
  [Pkm.RABOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.CINDERACE]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Kick
  },
  [Pkm.POPPLIO]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.BRIONNE]: {
    attack: AnimationType.Shoot,
    ability: AnimationType.Shoot
  },
  [Pkm.PRIMARINA]: {
    attack: AnimationType.Charge,
    ability: AnimationType.Shoot
  },
  [Pkm.GOTHITA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.GOTHORITA]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.GOTHITELLE]: {
    attack: AnimationType.Appeal,
    ability: AnimationType.Charge
  },
  [Pkm.SANDSHREW]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Withdraw
  },
  [Pkm.SANDSLASH]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Withdraw
  },
  [Pkm.FARFETCH_D]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.UNOWN_A]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_B]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_C]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_D]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_E]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_F]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_G]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_H]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_I]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_J]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_K]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_L]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_M]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_N]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_O]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_P]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Q]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_R]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_S]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_T]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_U]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_V]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_W]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_X]: {
    attack: AnimationType.Rotate,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Y]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_Z]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_QUESTION]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.UNOWN_EXCLAMATION]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Rotate
  },
  [Pkm.TAPU_FINI]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.TAPU_BULU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DIGLETT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn
  },
  [Pkm.DUGTRIO]: {
    attack: AnimationType.Attack,
    ability: AnimationType.DigIn
  },
  [Pkm.ROWLET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DARTIX]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DECIDUEYE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HISUI_ZORUA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HISUI_ZOROARK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.FROAKIE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.FROGADIER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GRENINJA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hurt
  },
  [Pkm.TYROGUE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HITMONLEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Kick
  },
  [Pkm.HITMONCHAN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Uppercut
  },
  [Pkm.HITMONTOP]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Swing
  },
  [Pkm.MIMIKYU]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GRIMER]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_MUK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.CARVANHA]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swell
  },
  [Pkm.SHARPEDO]: {
    attack: AnimationType.Bite,
    ability: AnimationType.Swell
  },
  [Pkm.PINECO]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Charge
  },
  [Pkm.FORRETRESS]: {
    attack: AnimationType.Ricochet,
    ability: AnimationType.Charge
  },
  [Pkm.SEEL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.DEWGONG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GEODUDE]: {
    attack: AnimationType.Punch,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GRAVELER]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Shoot
  },
  [Pkm.ALOLAN_GOLEM]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.EKANS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ARBOK]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MIME_JR]: {
    attack: AnimationType.MultiStrike,
    ability: AnimationType.Twirl
  },
  [Pkm.MR_MIME]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.ORIGIN_GIRATINA]: {
    attack: AnimationType.Scratch,
    ability: AnimationType.Shoot
  },
  [Pkm.PIROUETTE_MELOETTA]: {
    attack: AnimationType.Swing,
    ability: AnimationType.Twirl
  },
  [Pkm.MELMETAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HOOPA]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.HOOPA_UNBOUND]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.SILVALLY]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.TYPE_NULL]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Shoot
  },
  [Pkm.ZERAORA]: {
    attack: AnimationType.Strike,
    ability: AnimationType.Attack
  },
  [Pkm.XERNEAS]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.YVELTAL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.MARSHADOW]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Attack
  },
  [Pkm.HOOTHOOT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.NOCTOWL]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.BONSLEY]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.SUDOWOODO]: {
    attack: AnimationType.Slam,
    ability: AnimationType.Attack
  },
  [Pkm.PHIONE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Charge
  },
  [Pkm.COMBEE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Hover
  },
  [Pkm.VESPIQUEEN]: {
    attack: AnimationType.Attack,
    ability: AnimationType.SpAttack
  },
  [Pkm.SHUCKLE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw
  },
  [Pkm.TEPIG]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.PIGNITE]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.EMBOAR]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.WYNAUT]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Shoot
  },
  [Pkm.WOBBUFFET]: {
    attack: AnimationType.Attack,
    ability: AnimationType.Withdraw
  }
}

export const AnimationComplete: { [key in AnimationType]: boolean } = {
  [AnimationType.Idle]: true,
  [AnimationType.Walk]: true,
  [AnimationType.Sleep]: false,
  [AnimationType.Hurt]: true,
  [AnimationType.Attack]: true,
  [AnimationType.Charge]: true,
  [AnimationType.Shoot]: true,
  [AnimationType.Strike]: true,
  [AnimationType.Chop]: true,
  [AnimationType.Scratch]: true,
  [AnimationType.Punch]: true,
  [AnimationType.Slap]: true,
  [AnimationType.Slice]: true,
  [AnimationType.MultiScratch]: true,
  [AnimationType.MultiStrike]: true,
  [AnimationType.Uppercut]: true,
  [AnimationType.Ricochet]: true,
  [AnimationType.Bite]: true,
  [AnimationType.Shake]: true,
  [AnimationType.Jab]: true,
  [AnimationType.Kick]: true,
  [AnimationType.Lick]: true,
  [AnimationType.Slam]: true,
  [AnimationType.Stomp]: true,
  [AnimationType.Appeal]: true,
  [AnimationType.Dance]: true,
  [AnimationType.Twirl]: true,
  [AnimationType.TailWhip]: false,
  [AnimationType.Sing]: false,
  [AnimationType.Sound]: false,
  [AnimationType.Rumble]: true,
  [AnimationType.FlapAround]: true,
  [AnimationType.Gas]: true,
  [AnimationType.Shock]: true,
  [AnimationType.Emit]: true,
  [AnimationType.SpAttack]: true,
  [AnimationType.Withdraw]: true,
  [AnimationType.RearUp]: true,
  [AnimationType.Swell]: true,
  [AnimationType.Swing]: true,
  [AnimationType.Double]: true,
  [AnimationType.Rotate]: true,
  [AnimationType.Hop]: true,
  [AnimationType.Hover]: true,
  [AnimationType.QuickStrike]: true,
  [AnimationType.EventSleep]: false,
  [AnimationType.Wake]: false,
  [AnimationType.Eat]: false,
  [AnimationType.Tumble]: false,
  [AnimationType.Pose]: false,
  [AnimationType.Pull]: false,
  [AnimationType.Pain]: false,
  [AnimationType.Float]: false,
  [AnimationType.DeepBreath]: false,
  [AnimationType.Nod]: true,
  [AnimationType.Sit]: false,
  [AnimationType.LookUp]: false,
  [AnimationType.Sink]: false,
  [AnimationType.Trip]: false,
  [AnimationType.Laying]: false,
  [AnimationType.LeapForth]: false,
  [AnimationType.Head]: false,
  [AnimationType.Cringe]: false,
  [AnimationType.LostBalance]: false,
  [AnimationType.TumbleBack]: false,
  [AnimationType.HitGround]: false,
  [AnimationType.Faint]: false,
  [AnimationType.Fainted]: false,
  [AnimationType.StandingUp]: false,
  [AnimationType.DigIn]: false,
  [AnimationType.DigOut]: false,
  [AnimationType.Wiggle]: false,
  [AnimationType.Yawn]: false,
  [AnimationType.RaiseArms]: false,
  [AnimationType.CarefulWalk]: false,
  [AnimationType.Injured]: false,
  [AnimationType.Jump]: false,
  [AnimationType.Roar]: false,
  [AnimationType.Wave]: false,
  [AnimationType.Cry]: false,
  [AnimationType.Bow]: false,
  [AnimationType.Special0]: false,
  [AnimationType.Special1]: false,
  [AnimationType.Special2]: false,
  [AnimationType.Special3]: false,
  [AnimationType.Special4]: false,
  [AnimationType.Special5]: false,
  [AnimationType.Special6]: false,
  [AnimationType.Special7]: false,
  [AnimationType.Special8]: false,
  [AnimationType.Special9]: false,
  [AnimationType.Special10]: false,
  [AnimationType.Special11]: false,
  [AnimationType.Special12]: false,
  [AnimationType.Special13]: false,
  [AnimationType.Special14]: false,
  [AnimationType.Special15]: false,
  [AnimationType.Special16]: false,
  [AnimationType.Special17]: false,
  [AnimationType.Special18]: false,
  [AnimationType.Special19]: false,
  [AnimationType.Special20]: false,
  [AnimationType.Special21]: false,
  [AnimationType.Special22]: false,
  [AnimationType.Special23]: false,
  [AnimationType.Special24]: false,
  [AnimationType.Special25]: false,
  [AnimationType.Special26]: false,
  [AnimationType.Special27]: false,
  [AnimationType.Special28]: false,
  [AnimationType.Special29]: false,
  [AnimationType.Special30]: false,
  [AnimationType.Special31]: false
}
