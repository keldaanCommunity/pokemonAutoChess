import { entity, MapSchema, Schema, SetSchema, type } from "@colyseus/schema"
import { nanoid } from "nanoid"
import { OnAbilityCastEffect, PeriodicEffect } from "../../core/effects/effect"
import {
  ConditionBasedEvolutionRule,
  CountEvolutionRule,
  EvolutionRule,
  HatchEvolutionRule,
  ItemEvolutionRule
} from "../../core/evolution-rules"
import { ItemStats } from "../../core/items"
import Simulation from "../../core/simulation"
import { DelayedCommand } from "../../core/simulation-command"
import GameState from "../../rooms/states/game-state"
import { Emotion, IPlayer, IPokemon, IPokemonEntity, Title } from "../../types"
import { DEFAULT_SPEED, SynergyTriggers } from "../../types/Config"
import { Ability } from "../../types/enum/Ability"
import { DungeonDetails, DungeonPMDO } from "../../types/enum/Dungeon"
import { EffectEnum } from "../../types/enum/Effect"
import {
  AttackType,
  PokemonActionState,
  Rarity,
  Stat
} from "../../types/enum/Game"
import {
  AllItems,
  ArtificialItems,
  Berries,
  Flavors,
  Item,
  ItemComponents,
  ItemRecipe,
  OgerponMasks,
  RemovableItems,
  SynergyGivenByItem,
  SynergyItems
} from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import {
  Pkm,
  PkmFamily,
  PkmIndex,
  PkmRegionalVariants,
  Unowns
} from "../../types/enum/Pokemon"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import { Synergy } from "../../types/enum/Synergy"
import { Weather } from "../../types/enum/Weather"
import { removeInArray } from "../../utils/array"
import {
  getFirstAvailablePositionInBench,
  getFirstAvailablePositionOnBoard,
  isOnBench
} from "../../utils/board"
import { distanceC, distanceE } from "../../utils/distance"
import { pickRandomIn } from "../../utils/random"
import { values } from "../../utils/schemas"
import { SynergyEffects } from "../effects"
import PokemonFactory from "../pokemon-factory"
import Player from "./player"

export class Pokemon extends Schema implements IPokemon {
  @type("string") id: string
  @type("string") name: Pkm
  @type({ set: "string" }) types = new SetSchema<Synergy>()
  @type("string") rarity: Rarity = Rarity.SPECIAL
  @type("string") index: string
  @type("string") evolution: Pkm = Pkm.DEFAULT
  @type("int8") positionX = -1
  @type("int8") positionY = -1
  @type("uint8") speed = DEFAULT_SPEED
  @type("uint8") def: number = 1
  @type("uint8") speDef: number = 1
  @type("uint8") attackType: AttackType = AttackType.PHYSICAL
  @type("uint16") atk: number = 1
  @type("uint16") hp: number = 10
  @type("uint8") range: number = 1
  @type("uint8") stars: number = 1
  @type("uint8") maxPP: number = 100
  @type("uint16") ap: number = 0
  @type("string") skill: Ability = Ability.DEFAULT
  @type("string") passive: Passive = Passive.NONE
  @type({ set: "string" }) items = new SetSchema<Item>()
  @type("string") meal: Item | "" = ""
  @type("boolean") shiny: boolean
  @type("string") emotion: Emotion
  @type("string") action: PokemonActionState = PokemonActionState.IDLE
  permanentLuck: number = 0
  deathCount: number = 0
  evolutions: Pkm[] = []
  evolutionRule: EvolutionRule = new CountEvolutionRule(3)
  additional = false
  regional = false
  canHoldItems = true
  canBeBenched = true
  canBeSold = true
  stages?: number
  tm: Ability | null = null

  constructor(shiny = false, emotion = Emotion.NORMAL) {
    super()
    const name = Object.entries(PokemonClasses).find(
      ([name, pokemonClass]) => pokemonClass === this.constructor
    )?.[0] as Pkm
    this.id = nanoid()
    this.name = name
    this.index = PkmIndex[name]
    this.shiny = shiny
    this.emotion = emotion
  }

  get final(): boolean {
    /* true if should be excluded from shops when obtained */
    return (
      !this.hasEvolution ||
      (this.evolutionRule instanceof CountEvolutionRule === false &&
        this.passive !== Passive.CORSOLA)
    )
  }

  get canBePlaced(): boolean {
    return ![Pkm.EGG].includes(this.name)
  }

  get canBeCloned(): boolean {
    return (
      this.rarity !== Rarity.UNIQUE &&
      this.rarity !== Rarity.LEGENDARY &&
      this.rarity !== Rarity.HATCH &&
      this.passive !== Passive.INANIMATE &&
      ![Pkm.DITTO, Pkm.EGG].includes(this.name)
    )
  }

  get canEat(): boolean {
    return this.passive !== Passive.INANIMATE && !Unowns.includes(this.name)
  }

  get hasEvolution(): boolean {
    return this.evolution !== Pkm.DEFAULT || this.evolutions.length > 0
  }

  get doesCountForTeamSize(): boolean {
    return (
      this.passive !== Passive.INANIMATE &&
      this.items.has(Item.GOLD_BOW) === false
    )
  }

  get luck(): number {
    let luck = this.permanentLuck
    this.items.forEach((item) => {
      luck += ItemStats[item]?.[Stat.LUCK] ?? 0
    })
    return luck
  }

  set luck(value: number) {
    this.permanentLuck = value
  }

  onChangePosition(
    x: number,
    y: number,
    player: Player,
    state?: GameState,
    doNotRemoveItems: boolean = false
  ) {
    // called after manually changing position of the pokemon on board
    if (y === 0 && !doNotRemoveItems) {
      const itemsToRemove = values(this.items).filter((item) => {
        return (
          RemovableItems.includes(item) ||
          (state?.specialGameRule === SpecialGameRule.SLAMINGO &&
            item !== Item.RARE_CANDY)
        )
      })
      player.items.push(...itemsToRemove)
      this.removeItems(itemsToRemove, player)
    }
  }

  onItemGiven(item: Item, player: Player) {
    // called after giving an item to the mon
  }

  onItemRemoved(item: Item, player: Player) {
    // called after an item is unequipped from the mon
  }

  onAcquired(player: Player) {
    // called after buying or picking the mon
  }

  afterSell(player: Player) {
    // called after selling the mon
  }

  afterEvolve(params: {
    pokemonEvolved: Pokemon
    pokemonsBeforeEvolution: Pokemon[]
    player: Player
  }) {
    // called after evolving
  }

  beforeSimulationStart(params: {
    simulationId: string
    isGhostBattle: boolean
    weather: Weather
    player: Player
    teamEffects: Set<EffectEnum>
    opponentEffects: Set<EffectEnum>
  }) {
    // called at simulation start before entities are generated
  }

  afterSimulationStart(params: {
    player: IPlayer
    simulation: Simulation
    team: MapSchema<IPokemonEntity>
    entity: IPokemonEntity
  }) {
    // called at simulation start after entities are generated
  }

  onSpawn(params: { entity: IPokemonEntity; simulation: Simulation }) {
    // called after entity is added, either at simulation start or when cloned/spawned
  }

  isInRegion(map: DungeonPMDO | "town", state?: GameState) {
    if (map === "town") return false
    const regionSynergies = DungeonDetails[map]?.synergies
    const basePkm = PkmFamily[this.name]
    const originalVariantPkm = (Object.keys(PkmRegionalVariants) as Pkm[]).find(
      (p) => PkmRegionalVariants[p]!.includes(basePkm)
    )

    let originalVariant: Pokemon | null = null
    if (originalVariantPkm) {
      originalVariant = new PokemonClasses[originalVariantPkm]()
      if (
        originalVariant?.additional === true &&
        state &&
        state.additionalPokemons.includes(originalVariantPkm) === false
      ) {
        return false
      }
    }

    if (originalVariant) {
      const commonTypes = values(originalVariant.types).filter((t) =>
        this.types.has(t)
      )
      if (commonTypes.some((t) => regionSynergies.includes(t))) {
        return false // ignore variant if map has the synergy of the original variant
      }
    }

    return regionSynergies.some((s) => this.types.has(s))
  }

  removeItem(item: Item, player: Player) {
    this.removeItems([item], player)
  }

  removeItems(items: Item[], player: Player) {
    /* onItemRemoved effects need to be called after removing all items in case they trigger transformations (Pikachu Surfer, etc.)
     in order:
     1) remove items from the pokemon
     2) check if any synergy should be removed
     3) call onItemRemoved effects for each item removed
    */
    for (const item of items) {
      this.items.delete(item)
    }

    const nativeTypes = new PokemonClasses[this.name]().types
    for (const item of items) {
      const synergyRemoved = SynergyGivenByItem[item]
      const otherSynergyItemsHeld = values(this.items).filter(
        (i) => SynergyGivenByItem[i] === synergyRemoved
      )

      if (
        synergyRemoved &&
        nativeTypes.has(synergyRemoved) === false &&
        otherSynergyItemsHeld.length === 0
      ) {
        this.types.delete(synergyRemoved)
      }
    }

    for (const item of items) {
      this.onItemRemoved(item, player)
    }
  }
}

export class Ditto extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AMORPHOUS])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 50
  atk = 5
  speed = 40
  def = 2
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.TRANSFORM
  passive = Passive.DITTO
}

export class Substitute extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 80
  atk = 1
  speed = 28
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
}

export class Egg extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 30
  atk = 1
  speed = 41
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  passive = Passive.EGG
  evolutionRule = new HatchEvolutionRule()
  canHoldItems = false
}

export class Electrike extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MANECTRIC
  hp = 80
  atk = 6
  speed = 70
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.THUNDER_FANG
  additional = true
}

export class Manectric extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  //evolution = Pkm.MEGA_MANECTRIC
  hp = 160
  atk = 12
  speed = 70
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.THUNDER_FANG
  additional = true
}

export class MegaManectric extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 3
  hp = 250
  atk = 27
  speed = 70
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  //skill = Ability.THUNDER_FANG
}

export class Shuppet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.BANETTE
  hp = 100
  atk = 10
  speed = 46
  def = 4
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.SHADOW_CLONE
  additional = true
}

export class Banette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.EPIC
  stars = 2
  //evolution = Pkm.MEGA_BANETTE
  hp = 180
  atk = 20
  speed = 46
  def = 6
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.SHADOW_CLONE
  additional = true
}

export class MegaBanette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 30
  speed = 46
  def = 8
  speDef = 10
  maxPP = 100
  range = 1
  //skill = Ability.SHADOW_CLONE
  skill = Ability.DEFAULT
}

export class Riolu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIGHTING,
    Synergy.STEEL,
    Synergy.BABY
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LUCARIO
  hp = 65
  atk = 6
  speed = 54
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.AURASPHERE
  additional = true
}

export class Lucario extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 18
  speed = 54
  def = 8
  speDef = 8
  maxPP = 80
  range = 2
  skill = Ability.AURASPHERE
  additional = true
}

export class Crabrawler extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.FIGHTING,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CRABOMINABLE
  hp = 90
  atk = 10
  speed = 39
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ICE_HAMMER
  additional = true
  passive = Passive.BERRY_EATER
}

export class Crabominable extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.FIGHTING,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 220
  atk = 24
  speed = 39
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ICE_HAMMER
  additional = true
  passive = Passive.BERRY_EATER
}

export class Cutiefly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.RIBOMBEE
  hp = 75
  atk = 5
  speed = 65
  def = 2
  speDef = 2
  maxPP = 40
  range = 2
  skill = Ability.POLLEN_PUFF
  regional = true
}

export class Ribombee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 10
  speed = 65
  def = 4
  speDef = 4
  maxPP = 40
  range = 2
  skill = Ability.POLLEN_PUFF
  regional = true
}

export class Nickit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIELD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.THIEVUL
  hp = 75
  atk = 7
  speed = 54
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.THIEF
  additional = true
}

export class Thievul extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIELD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 17
  speed = 54
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.THIEF
  additional = true
}

export class Swablu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.ALTARIA
  hp = 100
  atk = 9
  speed = 51
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.HYPER_VOICE
  additional = true
}

export class Altaria extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 2
  //evolution = Pkm.MEGA_ALTARIA
  hp = 170
  atk = 15
  speed = 51
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.HYPER_VOICE
  additional = true
}

export class MegaAltaria extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 3
  hp = 260
  atk = 24
  speed = 51
  def = 10
  speDef = 10
  maxPP = 100
  range = 2
  //skill = Ability.HYPER_VOICE
  skill = Ability.DEFAULT
}

export class Scyther extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  evolutions = [Pkm.SCIZOR, Pkm.KLEAVOR]
  hp = 170
  atk = 17
  speed = 59
  def = 10
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.X_SCISSOR
  passive = Passive.SCYTHER

  evolutionRule = new ItemEvolutionRule(
    [Item.METAL_COAT, Item.BLACK_AUGURITE],
    (pokemon, player, item) => {
      if (item === Item.METAL_COAT) {
        return Pkm.SCIZOR
      } else {
        return Pkm.KLEAVOR
      }
    }
  )
}

export class Scizor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 170
  atk = 22
  speed = 59
  def = 14
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.X_SCISSOR
}

export class Kleavor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ROCK, Synergy.DARK])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 170
  atk = 22
  speed = 59
  def = 14
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.STONE_AXE

  onAcquired(player: Player): void {
    this.items.delete(Item.BLACK_AUGURITE) // black augurite is not a held item, but is needed for evolution
  }
}

export class Bounsweet extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.FIGHTING,
    Synergy.GOURMET
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.STEENEE
  hp = 85
  atk = 10
  speed = 48
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.TROP_KICK
}

export class Steenee extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.FIGHTING,
    Synergy.GOURMET
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.TSAREENA
  hp = 160
  atk = 19
  speed = 48
  def = 10
  speDef = 10
  maxPP = 120
  range = 1
  skill = Ability.TROP_KICK
}

export class Tsareena extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.FIGHTING,
    Synergy.GOURMET
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 320
  atk = 33
  speed = 48
  def = 12
  speDef = 12
  maxPP = 120
  range = 1
  skill = Ability.TROP_KICK
}

export class Buneary extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.LOPUNNY
  hp = 60
  atk = 6
  speed = 59
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  regional = true
}

export class Lopunny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 2
  //evolution = Pkm.MEGA_LOPUNNY
  hp = 120
  atk = 13
  speed = 59
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.HIGH_JUMP_KICK
  regional = true
}

export class MegaLopunny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 26
  speed = 59
  def = 10
  speDef = 10
  maxPP = 80
  range = 1
  //skill = Ability.HIGH_JUMP_KICK
  skill = Ability.DEFAULT
  regional = true
}

export class Onix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.STEELIX
  hp = 100
  atk = 7
  speed = 35
  def = 20
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  additional = true
}

export class Steelix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.EPIC
  stars = 2
  //evolution = Pkm.MEGA_STEELIX
  hp = 200
  atk = 13
  speed = 35
  def = 40
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.IRON_TAIL
  additional = true
}

export class MegaSteelix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.EPIC
  stars = 3
  hp = 350
  atk = 22
  speed = 35
  def = 60
  speDef = 30
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  //skill = Ability.IRON_TAIL
  additional = true
}

export class Numel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.CAMERUPT
  hp = 120
  atk = 10
  speed = 38
  def = 6
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.ERUPTION
  regional = true
}

export class Camerupt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 2
  //evolution = Pkm.MEGA_CAMERUPT
  hp = 210
  atk = 15
  speed = 38
  def = 14
  speDef = 14
  maxPP = 120
  range = 1
  skill = Ability.ERUPTION
  regional = true
}

export class MegaCamerupt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 3
  hp = 330
  atk = 24
  speed = 38
  def = 20
  speDef = 20
  maxPP = 120
  range = 1
  skill = Ability.DEFAULT
  //skill = Ability.ERUPTION
  regional = true
}

export class Meditite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.MEDICHAM
  hp = 80
  atk = 9
  speed = 51
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.MEDITATE
  additional = true
}

export class Medicham extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 16
  speed = 51
  def = 12
  speDef = 12
  maxPP = 100
  range = 2
  skill = Ability.MEDITATE
  additional = true
}

export class Elekid extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.BABY
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.ELECTABUZZ
  hp = 110
  atk = 5
  speed = 55
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.DISCHARGE
}

export class Electabuzz extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.ELECTIVIRE
  hp = 190
  atk = 15
  speed = 55
  def = 12
  speDef = 12
  maxPP = 90
  range = 1
  skill = Ability.DISCHARGE
}

export class Electivire extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 350
  atk = 26
  speed = 55
  def = 16
  speDef = 16
  maxPP = 90
  range = 1
  skill = Ability.DISCHARGE
}

export class Gible extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GABITE
  hp = 100
  atk = 5
  speed = 58
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_BREATH
}

export class Gabite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.GARCHOMP
  hp = 160
  atk = 12
  speed = 58
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_BREATH
}

export class Garchomp extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 240
  atk = 28
  speed = 58
  def = 12
  speDef = 12
  maxPP = 100
  range = 2
  skill = Ability.DRAGON_BREATH
}

export class Roggenrola extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.LIGHT])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.BOLDORE
  hp = 90
  atk = 4
  speed = 37
  def = 8
  speDef = 6
  maxPP = 110
  range = 2
  skill = Ability.ROCK_ARTILLERY
}

export class Boldore extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.LIGHT])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.GIGALITH
  hp = 170
  atk = 7
  speed = 37
  def = 12
  speDef = 10
  maxPP = 110
  range = 2
  skill = Ability.ROCK_ARTILLERY
}

export class Gigalith extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.LIGHT])
  rarity = Rarity.EPIC
  stars = 3
  hp = 280
  atk = 17
  speed = 37
  def = 16
  speDef = 14
  maxPP = 110
  range = 2
  skill = Ability.ROCK_ARTILLERY
}

export class Beldum extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.METANG
  hp = 110
  atk = 5
  speed = 47
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.METEOR_MASH
}

export class Metang extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.METAGROSS
  hp = 190
  atk = 9
  speed = 47
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.METEOR_MASH
}

export class Metagross extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 320
  atk = 20
  speed = 47
  def = 16
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.METEOR_MASH
}

export class Tympole extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.GROUND,
    Synergy.SOUND
  ])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.PALPITOAD
  evolutionRule = new HatchEvolutionRule()
  hp = 80
  atk = 7
  speed = 49
  def = 6
  speDef = 6
  maxPP = 70
  range = 1
  skill = Ability.SLUDGE_WAVE
  passive = Passive.HATCH
}

export class Palpitoad extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.GROUND,
    Synergy.SOUND
  ])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.SEISMITOAD
  evolutionRule = new HatchEvolutionRule()
  hp = 130
  atk = 16
  speed = 49
  def = 8
  speDef = 8
  maxPP = 70
  range = 1
  skill = Ability.SLUDGE_WAVE
  passive = Passive.HATCH
}

export class Seismitoad extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.GROUND,
    Synergy.SOUND
  ])
  rarity = Rarity.HATCH
  stars = 3
  hp = 210
  atk = 21
  speed = 49
  def = 12
  speDef = 12
  maxPP = 70
  range = 1
  skill = Ability.SLUDGE_WAVE
}

export class Bagon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SHELGON
  hp = 70
  atk = 5
  speed = 57
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_CLAW
}

export class Shelgon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SALAMENCE
  hp = 130
  atk = 11
  speed = 57
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_CLAW
}

export class Salamence extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.MONSTER,
    Synergy.FLYING
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 20
  speed = 57
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_CLAW
}

export class Ralts extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.KIRLIA
  hp = 90
  atk = 5
  speed = 51
  def = 4
  speDef = 8
  maxPP = 100
  range = 3
  skill = Ability.FUTURE_SIGHT
}

export class Kirlia extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolutions = [Pkm.GARDEVOIR, Pkm.GALLADE]
  evolutionRule = new CountEvolutionRule(3, (pokemon, player) => {
    const fairyCount = player.synergies.get(Synergy.FAIRY) ?? 0
    const fightingCount = player.synergies.get(Synergy.FIGHTING) ?? 0
    return fightingCount >= fairyCount ? Pkm.GALLADE : Pkm.GARDEVOIR
  })
  hp = 130
  atk = 12
  speed = 51
  def = 6
  speDef = 10
  maxPP = 100
  range = 3
  skill = Ability.FUTURE_SIGHT
  passive = Passive.KIRLIA
}

export class Gardevoir extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.HUMAN
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 230
  atk = 26
  speed = 51
  def = 8
  speDef = 16
  maxPP = 100
  range = 3
  skill = Ability.FUTURE_SIGHT
}

export class Gallade extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity: Rarity = Rarity.EPIC
  stars = 3
  hp = 260
  atk = 38
  speed = 51
  def = 10
  speDef = 20
  maxPP = 100
  range = 1
  skill = Ability.PSYCHO_CUT
}

export class Fuecoco extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.SOUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.CROCALOR
  hp = 110
  atk = 5
  speed = 46
  def = 4
  speDef = 2
  maxPP = 60
  range = 3
  skill = Ability.TORCH_SONG
}

export class Crocalor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.SOUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.SKELEDIRGE
  hp = 170
  atk = 13
  speed = 46
  def = 6
  speDef = 4
  maxPP = 60
  range = 3
  skill = Ability.TORCH_SONG
}

export class Skeledirge extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.SOUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 3
  hp = 350
  atk = 24
  speed = 46
  def = 8
  speDef = 6
  maxPP = 60
  range = 3
  skill = Ability.TORCH_SONG
}

export class Budew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.BABY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.ROSELIA
  hp = 90
  atk = 5
  speed = 54
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.PETAL_DANCE
}

export class Roselia extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.ROSERADE
  hp = 130
  atk = 15
  speed = 54
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.PETAL_DANCE
}

export class Roserade extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 3
  hp = 230
  atk = 17
  speed = 54
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.PETAL_DANCE
}

export class Slakoth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.VIGOROTH
  hp = 130
  atk = 5
  speed = 57
  def = 10
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SLACK_OFF
  regional = true
}

export class Vigoroth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.SLAKING
  hp = 220
  atk = 16
  speed = 57
  def = 10
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SLACK_OFF
  passive = Passive.VIGOROTH
  regional = true
}

export class Slaking extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 3
  hp = 380
  atk = 30
  speed = 57
  def = 14
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.SLACK_OFF
  passive = Passive.SLAKING
  regional = true
}

export class Honedge extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.DOUBLADE
  hp = 85
  atk = 6
  speed = 44
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.KING_SHIELD
}

export class Doublade extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.AEGISLASH
  hp = 130
  atk = 13
  speed = 44
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.KING_SHIELD
}

export class Aegislash extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 23
  speed = 44
  def = 14
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.KING_SHIELD
  passive = Passive.AEGISLASH
}

export class AegislashBlade extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 34
  speed = 44
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.KING_SHIELD
  passive = Passive.AEGISLASH
}

export class Oshawott extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.FIELD,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DEWOTT
  hp = 90
  atk = 8
  speed = 47
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.AQUA_TAIL
}

export class Dewott extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.FIELD,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.SAMUROTT
  hp = 150
  atk = 15
  speed = 47
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.AQUA_TAIL
}

export class Samurott extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.FIELD,
    Synergy.FIGHTING
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 260
  atk = 32
  speed = 47
  def = 16
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.AQUA_TAIL
}

export class Larvitar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PUPITAR
  hp = 75
  atk = 7
  speed = 45
  def = 8
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.BITE
}

export class Pupitar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.TYRANITAR
  hp = 130
  atk = 14
  speed = 45
  def = 12
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.BITE
}

export class Tyranitar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.RARE
  stars = 3
  hp = 210
  atk = 28
  speed = 45
  def = 16
  speDef = 10
  maxPP = 90
  range = 1
  skill = Ability.BITE
}

export class JangmoO extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FIGHTING,
    Synergy.SOUND
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HAKAMO_O
  hp = 100
  atk = 6
  speed = 52
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  regional = true
}

export class HakamoO extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FIGHTING,
    Synergy.SOUND
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.KOMMO_O
  hp = 160
  atk = 12
  speed = 52
  def = 10
  speDef = 10
  maxPP = 90
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  regional = true
}

export class KommoO extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FIGHTING,
    Synergy.SOUND
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 280
  atk = 23
  speed = 52
  def = 16
  speDef = 16
  maxPP = 90
  range = 1
  skill = Ability.CLANGOROUS_SOUL
  regional = true
}

export class Gastly extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.POISON,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.HAUNTER
  hp = 90
  atk = 12
  speed = 60
  def = 6
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.NIGHTMARE
}

export class Haunter extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.POISON,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.GENGAR
  hp = 180
  atk = 22
  speed = 60
  def = 8
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.NIGHTMARE
}

export class Gengar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.POISON,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 350
  atk = 35
  speed = 60
  def = 10
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.NIGHTMARE
}

export class Abra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.KADABRA
  hp = 90
  atk = 4
  speed = 63
  def = 4
  speDef = 8
  maxPP = 50
  range = 4
  skill = Ability.TELEPORT
}

export class Kadabra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.ALAKAZAM
  hp = 130
  atk = 8
  speed = 63
  def = 6
  speDef = 10
  maxPP = 50
  range = 4
  skill = Ability.TELEPORT
}

export class Alakazam extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 19
  speed = 63
  def = 8
  speDef = 16
  maxPP = 50
  range = 4
  skill = Ability.TELEPORT
}

export class Litwick extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.LAMPENT
  hp = 50
  atk = 4
  speed = 51
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.HEX
}

export class Lampent extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.CHANDELURE
  hp = 90
  atk = 9
  speed = 51
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.HEX
}

export class Chandelure extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.COMMON
  stars = 3
  hp = 160
  atk = 14
  speed = 51
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.HEX
}

const conversionEffect = ({
  simulation,
  player,
  entity
}: {
  simulation: Simulation
  player: IPlayer
  entity: IPokemonEntity
}) => {
  const opponent =
    simulation.bluePlayerId === player.id
      ? simulation.redPlayer
      : simulation.bluePlayer
  if (!opponent) return
  const synergyCopied = pickRandomIn(opponent.synergies.getTopSynergies())
  if (entity.types.has(synergyCopied)) return // does not copy if already has the synergy
  entity.types.add(synergyCopied)
  const effect =
    SynergyEffects[synergyCopied].find((effect) =>
      opponent.effects.has(effect)
    ) ?? SynergyEffects[synergyCopied][0]!

  simulation.applyEffect(
    entity,
    entity.types,
    effect,
    player?.synergies.countActiveSynergies() || 0
  )

  // when converting to bug, get a clone
  if (synergyCopied === Synergy.BUG) {
    const bug = PokemonFactory.createPokemonFromName(
      entity.name,
      player as Player
    )
    const coord = simulation.getClosestAvailablePlaceOnBoardToPokemonEntity(
      entity,
      player.team
    )
    simulation.addPokemon(bug, coord.x, coord.y, player.team, true)
  }

  // when converting to dragon, no double synergy but gains the AP/AS/SHIELD based on opponent team
  if (synergyCopied === Synergy.DRAGON) {
    const opponentTeam = simulation.getOpponentTeam(player.id)!
    const dragonLevel = values(opponentTeam).reduce(
      (acc, p) => acc + (p.types.has(Synergy.DRAGON) ? p.stars : 0),
      0
    )
    if (
      effect === EffectEnum.DRAGON_SCALES ||
      effect === EffectEnum.DRAGON_DANCE
    ) {
      entity.addShield(dragonLevel * 5, entity, 0, false)
    }
    if (effect === EffectEnum.DRAGON_DANCE) {
      entity.addAbilityPower(dragonLevel, entity, 0, false)
      entity.addSpeed(dragonLevel, entity, 0, false)
    }
  }

  // when converting to ghost, get Dodge chance
  if (synergyCopied === Synergy.GHOST) {
    entity.addDodgeChance(0.15, entity, 0, false)
  }

  // when converting to gourmet, get a Chef hat. Useless but funny
  if (synergyCopied === Synergy.GOURMET && entity.items.size < 3) {
    entity.items.add(Item.CHEF_HAT)
  }
}

export class Porygon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.ARTIFICIAL])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.PORYGON_2
  hp = 100
  atk = 13
  speed = 54
  def = 12
  speDef = 12
  maxPP = 100
  range = 2
  skill = Ability.TRI_ATTACK
  passive = Passive.CONVERSION
  afterSimulationStart = conversionEffect
}

export class Porygon2 extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.ARTIFICIAL])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.PORYGON_Z
  hp = 200
  atk = 23
  speed = 54
  def = 16
  speDef = 16
  maxPP = 80
  range = 2
  skill = Ability.TRI_ATTACK
  passive = Passive.CONVERSION
  afterSimulationStart = conversionEffect
}

export class PorygonZ extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.ARTIFICIAL])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 33
  speed = 54
  def = 16
  speDef = 16
  maxPP = 60
  range = 2
  skill = Ability.TRI_ATTACK
  passive = Passive.CONVERSION
  afterSimulationStart = conversionEffect
}

export class Sewaddle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SWADLOON
  hp = 60
  atk = 5
  speed = 54
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.MANTIS_BLADES
}

export class Swadloon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.LEAVANNY
  hp = 110
  atk = 11
  speed = 54
  def = 6
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.MANTIS_BLADES
}

export class Leavanny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.BUG])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 190
  atk = 23
  speed = 54
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MANTIS_BLADES
}

export class Turtwig extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.GROTLE
  hp = 80
  atk = 5
  speed = 43
  def = 7
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.BULLDOZE
}

export class Grotle extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.TORTERRA
  hp = 150
  atk = 9
  speed = 43
  def = 12
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.BULLDOZE
}

export class Torterra extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 280
  atk = 21
  speed = 43
  def = 16
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.BULLDOZE
}

export class Deino extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.ZWEILOUS
  hp = 80
  atk = 5
  speed = 56
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.DARK_HARVEST
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.DRAGON)
  }
}

export class Zweilous extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.HYDREIGON
  hp = 130
  atk = 11
  speed = 56
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.DARK_HARVEST
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.DRAGON)
  }
}

export class Hydreigon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 20
  speed = 56
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.DARK_HARVEST
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.DRAGON)
  }
}

export class Poliwag extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIGHTING
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.POLIWHIRL
  hp = 65
  atk = 5
  speed = 54
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.SOAK
}

export class Poliwhirl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIGHTING
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolutions = [Pkm.POLITOED, Pkm.POLIWRATH]
  hp = 120
  atk = 8
  speed = 54
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.SOAK
  passive = Passive.TADPOLE

  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (
        Math.max(
          ...values(player.board)
            .filter((pkm) => pkm.index === this.index)
            .map((v) => v.positionY)
        ) === 3
      ) {
        return Pkm.POLIWRATH
      } else {
        return Pkm.POLITOED
      }
    }
  )
}

export class Politoed extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 17
  speed = 54
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.SOAK
}

export class Poliwrath extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIGHTING
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 17
  speed = 54
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.CRABHAMMER
}

export class Magby extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.HUMAN, Synergy.BABY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MAGMAR
  hp = 80
  atk = 6
  speed = 52
  def = 2
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.FLAMETHROWER
}

export class Magmar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MAGMORTAR
  hp = 140
  atk = 15
  speed = 52
  def = 4
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.FLAMETHROWER
}

export class Magmortar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 3
  hp = 280
  atk = 28
  speed = 52
  def = 6
  speDef = 8
  maxPP = 80
  range = 2
  skill = Ability.FLAMETHROWER
}

export class Solosis extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.DUOSION
  hp = 100
  atk = 6
  speed = 35
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.PSYCHIC
}

export class Duosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.REUNICLUS
  hp = 200
  atk = 10
  speed = 35
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.PSYCHIC
}

export class Reuniclus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 20
  speed = 35
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.PSYCHIC
}

export class Shinx extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.LUXIO
  hp = 120
  atk = 13
  speed = 47
  def = 10
  speDef = 10
  maxPP = 70
  range = 1
  skill = Ability.VOLT_SWITCH
}

export class Luxio extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.LUXRAY
  hp = 210
  atk = 26
  speed = 47
  def = 12
  speDef = 12
  maxPP = 70
  range = 1
  skill = Ability.VOLT_SWITCH
}

export class Luxray extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 41
  speed = 47
  def = 14
  speDef = 14
  maxPP = 70
  range = 1
  skill = Ability.VOLT_SWITCH
}

export class Cubone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 1
  evolutions = [Pkm.MAROWAK, Pkm.ALOLAN_MAROWAK]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (player.regionalPokemons.includes(Pkm.ALOLAN_MAROWAK))
        return Pkm.ALOLAN_MAROWAK
      else return Pkm.MAROWAK
    }
  )
  hp = 110
  atk = 11
  speed = 36
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.BONEMERANG
  additional = true
}

export class Marowak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 22
  speed = 36
  def = 12
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.BONEMERANG
  additional = true
}

export class AlolanMarowak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.FIRE, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 22
  speed = 36
  def = 12
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.SHADOW_BONE
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.CUBONE)) &&
      regionSynergies.includes(Synergy.FIRE)
    )
  }
}

export class Axew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON])
  rarity = Rarity.HATCH
  evolutionRule = new HatchEvolutionRule()
  stars = 1
  evolution = Pkm.FRAXURE
  hp = 80
  atk = 9
  speed = 56
  def = 2
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
  passive = Passive.HATCH
}

export class Fraxure extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON])
  rarity = Rarity.HATCH
  evolutionRule = new HatchEvolutionRule()
  stars = 2
  evolution = Pkm.HAXORUS
  hp = 130
  atk = 18
  speed = 56
  def = 4
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
  passive = Passive.HATCH
}

export class Haxorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON])
  rarity = Rarity.HATCH
  stars = 3
  hp = 200
  atk = 27
  speed = 56
  def = 8
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
}

export class Dratini extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FLYING,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.DRAGONAIR
  hp = 80
  atk = 5
  speed = 51
  def = 8
  speDef = 8
  maxPP = 110
  range = 1
  skill = Ability.DRAGON_BREATH
}

export class Dragonair extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FLYING,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.DRAGONITE
  hp = 120
  atk = 12
  speed = 51
  def = 10
  speDef = 10
  maxPP = 110
  range = 1
  skill = Ability.DRAGON_BREATH
}

export class Dragonite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FLYING,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 250
  atk = 22
  speed = 51
  def = 12
  speDef = 12
  maxPP = 110
  range = 1
  skill = Ability.DRAGON_BREATH
}

export class Goomy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolutions = [Pkm.SLIGOO, Pkm.HISUI_SLIGGOO]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (player.regionalPokemons.includes(Pkm.HISUI_SLIGGOO))
        return Pkm.HISUI_SLIGGOO
      else return Pkm.SLIGOO
    }
  )
  hp = 90
  atk = 6
  speed = 51
  def = 8
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.LIQUIDATION
}

export class Sligoo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.GOODRA
  hp = 160
  atk = 13
  speed = 51
  def = 10
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.LIQUIDATION
}

export class Goodra extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 28
  speed = 51
  def = 12
  speDef = 20
  maxPP = 100
  range = 1
  skill = Ability.LIQUIDATION
}

export class HisuiSliggoo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.STEEL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.HISUI_GOODRA
  hp = 160
  atk = 13
  speed = 38
  def = 14
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.SHELTER
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.STEEL)
  }
}

export class HisuiGoodra extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.STEEL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 28
  speed = 38
  def = 20
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.SHELTER
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.STEEL)
  }
}

export class Lotad extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.AQUATIC,
    Synergy.SOUND
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LOMBRE
  hp = 60
  atk = 6
  speed = 47
  def = 2
  speDef = 2
  maxPP = 80
  range = 3
  skill = Ability.TORMENT
  regional = true
}

export class Lombre extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.AQUATIC,
    Synergy.SOUND
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.LUDICOLO
  hp = 110
  atk = 12
  speed = 47
  def = 4
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.TORMENT
  regional = true
}

export class Ludicolo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.AQUATIC,
    Synergy.SOUND
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 220
  atk = 22
  speed = 47
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.TORMENT
  regional = true
}

export class Togepi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.BABY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.TOGETIC
  hp = 80
  atk = 5
  speed = 51
  def = 2
  speDef = 2
  maxPP = 70
  range = 2
  skill = Ability.WISH
}

export class Togetic extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.NORMAL,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.TOGEKISS
  hp = 150
  atk = 10
  speed = 51
  def = 2
  speDef = 2
  maxPP = 70
  range = 2
  skill = Ability.WISH
}

export class Togekiss extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.NORMAL,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 260
  atk = 24
  speed = 51
  def = 2
  speDef = 2
  maxPP = 70
  range = 2
  skill = Ability.WISH
}

export class Rhyhorn extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.MONSTER,
    Synergy.ROCK
  ])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.RHYDON
  hp = 120
  atk = 14
  speed = 38
  def = 12
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HORN_DRILL
}

export class Rhydon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.MONSTER,
    Synergy.ROCK
  ])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.RHYPERIOR
  hp = 240
  atk = 23
  speed = 38
  def = 20
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.HORN_DRILL
}

export class Rhyperior extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.MONSTER,
    Synergy.ROCK
  ])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 380
  atk = 36
  speed = 38
  def = 30
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.HORN_DRILL
}

export class Aron extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.LAIRON
  hp = 60
  atk = 4
  speed = 41
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HEAVY_SLAM
}

export class Lairon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.AGGRON
  hp = 100
  atk = 9
  speed = 41
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.HEAVY_SLAM
}

export class Aggron extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.MONSTER, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 170
  atk = 20
  speed = 41
  def = 12
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.HEAVY_SLAM
}

export class Whismur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LOUDRED
  hp = 90
  atk = 6
  speed = 47
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.ECHO
}
export class Loudred extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.EXPLOUD
  hp = 150
  atk = 14
  speed = 47
  def = 4
  speDef = 4
  maxPP = 90
  range = 2
  skill = Ability.ECHO
}

export class Exploud extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 3
  hp = 300
  atk = 24
  speed = 47
  def = 6
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.ECHO
}

export class Swinub extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.PILOSWINE
  hp = 65
  atk = 4
  speed = 51
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
}

export class Piloswine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.MAMOSWINE
  hp = 120
  atk = 8
  speed = 51
  def = 10
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
}

export class Mamoswine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ICE])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 13
  speed = 51
  def = 16
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.ICICLE_CRASH
}

export class Snover extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ICE, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.ABOMASNOW
  hp = 90
  atk = 10
  speed = 44
  def = 6
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.SHEER_COLD
  regional = true
}

export class Abomasnow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ICE, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 2
  //evolution = Pkm.MEGA_ABOMASNOW
  hp = 180
  atk = 20
  speed = 44
  def = 10
  speDef = 10
  maxPP = 120
  range = 1
  skill = Ability.SHEER_COLD
  regional = true
}

export class MegaAbomasnow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ICE, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 30
  speed = 44
  def = 14
  speDef = 14
  maxPP = 120
  range = 1
  skill = Ability.DEFAULT
  //skill = Ability.SHEER_COLD
  regional = true
}

export class Snorunt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GLALIE
  hp = 90
  atk = 9
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.ICY_WIND
}

export class Glalie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.FROSLASS
  hp = 170
  atk = 17
  speed = 60
  def = 6
  speDef = 6
  maxPP = 90
  range = 3
  skill = Ability.ICY_WIND
}

export class Froslass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 3
  hp = 320
  atk = 31
  speed = 60
  def = 8
  speDef = 8
  maxPP = 80
  range = 3
  skill = Ability.ICY_WIND
}

export class Vanillite extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.VANILLISH
  hp = 70
  atk = 6
  speed = 50
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.ICICLE_MISSILE
}

export class Vanillish extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.VANILLUXE
  hp = 130
  atk = 12
  speed = 50
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.ICICLE_MISSILE
}

export class Vanilluxe extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 230
  atk = 24
  speed = 50
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.ICICLE_MISSILE
}

export class Trapinch extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.VIBRAVA
  hp = 70
  atk = 7
  speed = 57
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_TAIL
}

export class Vibrava extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.FLYGON
  hp = 120
  atk = 12
  speed = 57
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_TAIL
}

export class Flygon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 3
  hp = 190
  atk = 23
  speed = 57
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.DRAGON_TAIL
}

export class Pichu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FAIRY,
    Synergy.BABY
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.PIKACHU
  hp = 60
  atk = 5
  speed = 54
  def = 1
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
}

export class Pikachu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 2
  evolutions = [Pkm.RAICHU, Pkm.ALOLAN_RAICHU]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (player.regionalPokemons.includes(Pkm.ALOLAN_RAICHU))
        return Pkm.ALOLAN_RAICHU
      else return Pkm.RAICHU
    }
  )
  hp = 120
  atk = 8
  speed = 54
  def = 4
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
  onItemGiven(item: Item, player: Player): void {
    if (item === Item.SURFBOARD) {
      player.transformPokemon(this, Pkm.PIKACHU_SURFER)
    }
  }
}

export class Raichu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 17
  speed = 54
  def = 7
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
}

export class AlolanRaichu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FAIRY,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 17
  speed = 54
  def = 7
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.NUZZLE
  passive = Passive.SURGE_SURFER
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.PSYCHIC)
  }
}

export class Bulbasaur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.IVYSAUR
  hp = 80
  atk = 5
  speed = 51
  def = 4
  speDef = 4
  maxPP = 70
  range = 2
  skill = Ability.MAGICAL_LEAF
}

export class Ivysaur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.VENUSAUR
  hp = 130
  atk = 9
  speed = 51
  def = 8
  speDef = 8
  maxPP = 70
  range = 2
  skill = Ability.MAGICAL_LEAF
}

export class Venusaur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 17
  speed = 51
  def = 12
  speDef = 12
  maxPP = 70
  range = 2
  skill = Ability.MAGICAL_LEAF
}

export class Igglybuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY, Synergy.BABY])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.JIGGLYPUFF
  hp = 65
  atk = 5
  speed = 39
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.SING
}

export class Jigglypuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.WIGGLYTUFF
  hp = 120
  atk = 10
  speed = 39
  def = 4
  speDef = 4
  maxPP = 90
  range = 2
  skill = Ability.SING
}

export class Wigglytuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 19
  speed = 39
  def = 6
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.SING
}

export class Duskull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.DUSCLOPS
  hp = 70
  atk = 6
  speed = 39
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.SHADOW_BALL
}

export class Dusclops extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.DUSKNOIR
  hp = 150
  atk = 12
  speed = 39
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.SHADOW_BALL
}

export class Dusknoir extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 240
  atk = 26
  speed = 39
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.SHADOW_BALL
}

export class Magnemite extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MAGNETON
  hp = 80
  atk = 5
  speed = 44
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_BOMB
}

export class Magneton extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.MAGNEZONE
  hp = 150
  atk = 9
  speed = 44
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_BOMB
}

export class Magnezone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 20
  speed = 44
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.MAGNET_BOMB
}

export class Horsea extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SEADRA
  hp = 70
  atk = 6
  speed = 52
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.WHIRLPOOL
}

export class Seadra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.KINGDRA
  hp = 140
  atk = 12
  speed = 52
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.WHIRLPOOL
}

export class Kingdra extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 24
  speed = 52
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.WHIRLPOOL
}

export class Flabebe extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.FLOETTE
  hp = 60
  atk = 6
  speed = 49
  def = 2
  speDef = 6
  maxPP = 90
  range = 3
  skill = Ability.FAIRY_WIND
}

export class Floette extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.FLORGES
  hp = 120
  atk = 10
  speed = 49
  def = 2
  speDef = 10
  maxPP = 90
  range = 3
  skill = Ability.FAIRY_WIND
}
export class Florges extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FLORA])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 19
  speed = 49
  def = 4
  speDef = 14
  maxPP = 90
  range = 3
  skill = Ability.FAIRY_WIND
}

export class Chikorita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.BAYLEEF
  hp = 70
  atk = 6
  speed = 51
  def = 2
  speDef = 2
  maxPP = 90
  range = 2
  skill = Ability.STUN_SPORE // need to find another ability inflatuate, speed/atk debuff
}

export class Bayleef extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.SPECIAL
  stars = 2
  evolution = Pkm.MEGANIUM
  hp = 140
  atk = 10
  speed = 51
  def = 4
  speDef = 4
  maxPP = 90
  range = 2
  skill = Ability.STUN_SPORE
}

export class Meganium extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 250
  atk = 22
  speed = 51
  def = 6
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.STUN_SPORE
}

export class Venipede extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.FIELD])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.WHIRLIPEDE
  hp = 90
  atk = 12
  speed = 72
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.STEAMROLLER
}

export class Whirlipede extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.FIELD])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.SCOLIPEDE
  hp = 180
  atk = 24
  speed = 72
  def = 10
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.STEAMROLLER
}

export class Scolipede extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.FIELD])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 300
  atk = 36
  speed = 72
  def = 14
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.STEAMROLLER
}

export class Spheal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.ICE])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SEALEO
  hp = 80
  atk = 6
  speed = 46
  def = 6
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.ICE_BALL
}

export class Sealeo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.ICE])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.WALREIN
  hp = 150
  atk = 12
  speed = 46
  def = 6
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.ICE_BALL
}

export class Walrein extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.ICE])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 300
  atk = 24
  speed = 46
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.ICE_BALL
}

export class NidoranF extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.NIDORINA
  hp = 70
  atk = 5
  speed = 49
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.POISON)
  }
}

export class Nidorina extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.NIDOQUEEN
  hp = 130
  atk = 10
  speed = 49
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.POISON)
  }
}

export class Nidoqueen extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 230
  atk = 20
  speed = 49
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.POISON)
  }
}

export class NidoranM extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.NIDORINO
  hp = 70
  atk = 5
  speed = 52
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.HORN_ATTACK
}

export class Nidorino extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.NIDOKING
  hp = 140
  atk = 9
  speed = 52
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.HORN_ATTACK
}

export class Nidoking extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIELD,
    Synergy.GROUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 20
  speed = 52
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.HORN_ATTACK
}

export class Machop extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MACHOKE
  hp = 70
  atk = 6
  speed = 43
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.GUILLOTINE
}

export class Machoke extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.MACHAMP
  hp = 130
  atk = 12
  speed = 43
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.GUILLOTINE
}

export class Machamp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 220
  atk = 23
  speed = 43
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.GUILLOTINE
}

export class Piplup extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.PRINPLUP
  hp = 60
  atk = 6
  speed = 44
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.METAL_CLAW
}

export class Prinplup extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.EMPOLEON
  hp = 130
  atk = 12
  speed = 44
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.METAL_CLAW
}

export class Empoleon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 240
  atk = 24
  speed = 44
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.METAL_CLAW
}

export class Chimchar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.MONFERNO
  hp = 60
  atk = 4
  speed = 60
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.TORMENT
  regional = true
}

export class Monferno extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.INFERNAPE
  hp = 100
  atk = 10
  speed = 60
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.TORMENT
  regional = true
}

export class Infernape extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 180
  atk = 19
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.TORMENT
  regional = true
}

export class Mudkip extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.MARSHTOMP
  hp = 65
  atk = 5
  speed = 44
  def = 4
  speDef = 4
  maxPP = 60
  range = 1
  skill = Ability.MUD_BUBBLE
  passive = Passive.WATER_SPRING

  beforeSimulationStart({
    opponentEffects
  }: {
    opponentEffects: Set<EffectEnum>
  }): void {
    opponentEffects.add(EffectEnum.WATER_SPRING)
  }
}

export class Marshtomp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.SWAMPERT
  hp = 130
  atk = 9
  speed = 44
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.MUD_BUBBLE
  passive = Passive.WATER_SPRING

  beforeSimulationStart({
    opponentEffects
  }: {
    opponentEffects: Set<EffectEnum>
  }): void {
    opponentEffects.add(EffectEnum.WATER_SPRING)
  }
}

export class Swampert extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 20
  speed = 44
  def = 10
  speDef = 10
  maxPP = 60
  range = 1
  skill = Ability.MUD_BUBBLE
  passive = Passive.WATER_SPRING

  beforeSimulationStart({
    opponentEffects
  }: {
    opponentEffects: Set<EffectEnum>
  }): void {
    opponentEffects.add(EffectEnum.WATER_SPRING)
  }
}

export class Torchic extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.COMBUSKEN
  hp = 80
  atk = 6
  speed = 51
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
}

export class Combusken extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.BLAZIKEN
  hp = 150
  atk = 11
  speed = 51
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
}

export class Blaziken extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 23
  speed = 51
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.BLAZE_KICK
}

export class Treecko extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.GROVYLE
  hp = 70
  atk = 4
  speed = 63
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.LEAF_BLADE
}

export class Grovyle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SCEPTILE
  hp = 120
  atk = 12
  speed = 63
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.LEAF_BLADE
}

export class Sceptile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 23
  speed = 63
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.LEAF_BLADE
}

export class Cyndaquil extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.QUILAVA
  hp = 70
  atk = 7
  speed = 51
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.WHEEL_OF_FIRE
}

export class Quilava extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolutions = [Pkm.TYPHLOSION, Pkm.HISUIAN_TYPHLOSION]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (player.regionalPokemons.includes(Pkm.HISUIAN_TYPHLOSION))
        return Pkm.HISUIAN_TYPHLOSION
      else return Pkm.TYPHLOSION
    }
  )
  hp = 120
  atk = 12
  speed = 51
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.WHEEL_OF_FIRE
}

export class Typhlosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 230
  atk = 24
  speed = 51
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.WHEEL_OF_FIRE
}

export class HisuianTyphlosion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 230
  atk = 24
  speed = 51
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.INFERNAL_PARADE
  passive = Passive.HISUIAN_TYPHLOSION
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.GHOST)
  }
}

export class Slowpoke extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SLOWBRO
  hp = 80
  atk = 7
  speed = 35
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.YAWN
  regional = true
}

export class Slowbro extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.SLOWKING
  hp = 160
  atk = 12
  speed = 35
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.YAWN
  regional = true
}

export class Slowking extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 260
  atk = 27
  speed = 35
  def = 14
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.YAWN
  regional = true
}

export class Psyduck extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.GOLDUCK
  hp = 75
  atk = 7
  speed = 52
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.PSYSHOCK
  passive = Passive.PSYDUCK
  additional = true
}

export class Golduck extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 14
  speed = 52
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.PSYSHOCK
  passive = Passive.PSYDUCK
  additional = true
}

export class Squirtle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.WARTORTLE
  hp = 60
  atk = 5
  speed = 50
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.HYDRO_PUMP
}

export class Wartortle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.BLASTOISE
  hp = 120
  atk = 9
  speed = 50
  def = 3
  speDef = 3
  maxPP = 100
  range = 3
  skill = Ability.HYDRO_PUMP
}

export class Blastoise extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 20
  speed = 50
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.HYDRO_PUMP
}

export class Bellsprout extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.WEEPINBELL
  hp = 70
  atk = 6
  speed = 47
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.INGRAIN
}

export class Weepinbell extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.SPECIAL
  stars = 2
  evolution = Pkm.VICTREEBEL
  hp = 150
  atk = 12
  speed = 47
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.INGRAIN
}

export class Victreebel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.POISON, Synergy.FLORA])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 230
  atk = 20
  speed = 47
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.INGRAIN
}

/*export class Pikipek extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.TRUMBEAK
  hp = 70
  atk = 5
  speed = 44
  def = 4
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
}

export class Trumbeak extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.TOUCANNON
  hp = 120
  atk = 9
  speed = 44
  def = 6
  speDef = 6
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
}

export class Toucannon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 210
  atk = 20
  speed = 44
  def = 8
  speDef = 8
  maxPP = 70
  range = 1
  skill = Ability.DEFAULT
}*/

export class Geodude extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.GRAVELER
  hp = 70
  atk = 4
  speed = 39
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ROCK_SLIDE
}

export class Graveler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.GOLEM
  hp = 120
  atk = 10
  speed = 39
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.ROCK_SLIDE
}

export class Golem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 17
  speed = 39
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.ROCK_SLIDE
}

export class Totodile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.MONSTER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CROCONAW
  hp = 75
  atk = 7
  speed = 50
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.CRUNCH
}

export class Croconaw extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.MONSTER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.FERALIGATR
  hp = 130
  atk = 14
  speed = 50
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.CRUNCH
}

export class Feraligatr extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.MONSTER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 27
  speed = 50
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.CRUNCH
}

export class Azurill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.BABY])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.MARILL
  hp = 50
  atk = 5
  speed = 41
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.PLAY_ROUGH
}

export class Marill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.AZUMARILL
  hp = 110
  atk = 9
  speed = 41
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.PLAY_ROUGH
}

export class Azumarill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 21
  speed = 41
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.PLAY_ROUGH
}

export class Zubat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.GOLBAT
  hp = 50
  atk = 4
  speed = 67
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.LEECH_LIFE
}

export class Golbat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.CROBAT
  hp = 100
  atk = 7
  speed = 67
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.LEECH_LIFE
}

export class Crobat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FLYING,
    Synergy.SOUND
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 15
  speed = 67
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.LEECH_LIFE
}

export class Mareep extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.FLAFFY
  hp = 60
  atk = 5
  speed = 43
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.THUNDER_SHOCK
}

export class Flaffy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.AMPHAROS
  hp = 110
  atk = 9
  speed = 43
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.THUNDER_SHOCK
}

export class Ampharos extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.FIELD,
    Synergy.LIGHT
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 18
  speed = 43
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.THUNDER_SHOCK
}

export class Cleffa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.BABY])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CLEFAIRY
  hp = 70
  atk = 5
  speed = 44
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.METRONOME
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.BABY) ||
      regionSynergies.includes(Synergy.LIGHT)
    )
  }
}

export class Clefairy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.LIGHT])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.CLEFABLE
  hp = 150
  atk = 11
  speed = 44
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.METRONOME
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.BABY) ||
      regionSynergies.includes(Synergy.LIGHT)
    )
  }
}

export class Clefable extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.NORMAL, Synergy.LIGHT])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 220
  atk = 18
  speed = 44
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.METRONOME
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.BABY) ||
      regionSynergies.includes(Synergy.LIGHT)
    )
  }
}

export class Caterpie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.AMORPHOUS])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.METAPOD
  hp = 60
  atk = 5
  speed = 47
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
}

export class Metapod extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.AMORPHOUS])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.BUTTERFREE
  hp = 110
  atk = 9
  speed = 47
  def = 6
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
}

export class Butterfree extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.BUG,
    Synergy.FLYING,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.COMMON
  stars = 3
  hp = 180
  atk = 16
  speed = 47
  def = 4
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.STRING_SHOT
}

export class Weedle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.KAKUNA
  hp = 60
  atk = 5
  speed = 49
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BUG_BUZZ
}

export class Kakuna extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.BEEDRILL
  hp = 110
  atk = 10
  speed = 35
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BUG_BUZZ
}

export class Beedrill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 170
  atk = 17
  speed = 49
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BUG_BUZZ
}

export class Pidgey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.PIDGEOTTO
  hp = 60
  atk = 4
  speed = 57
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.HURRICANE
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 0
  }
}

export class Pidgeotto extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.PIDGEOT
  hp = 110
  atk = 8
  speed = 57
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.HURRICANE
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 0
  }
}

export class Pidgeot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 16
  speed = 57
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.HURRICANE
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 0
  }
}

export class Hoppip extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FLORA, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.SKIPLOOM
  hp = 50
  atk = 4
  speed = 60
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.ACROBATICS
}

export class Skiploom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FLORA, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 2
  evolution = Pkm.JUMPLUFF
  hp = 100
  atk = 8
  speed = 60
  def = 3
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.ACROBATICS
}

export class Jumpluff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FLORA, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 150
  atk = 12
  speed = 60
  def = 4
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.ACROBATICS
}

export class Seedot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.NUZLEAF
  hp = 60
  atk = 6
  speed = 51
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.RAZOR_LEAF
  regional = true
}

export class Nuzleaf extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.SHIFTRY
  hp = 120
  atk = 9
  speed = 51
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.RAZOR_LEAF
  regional = true
}

export class Shiftry extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 21
  speed = 51
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.RAZOR_LEAF
  regional = true
}

export class Sprigatito extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.FLORAGATO
  hp = 55
  atk = 5
  speed = 63
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.FLOWER_TRICK
}

export class Floragato extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.MEOWSCARADA
  hp = 105
  atk = 8
  speed = 63
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.FLOWER_TRICK
}

export class Meowscarada extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 180
  atk = 19
  speed = 63
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.FLOWER_TRICK
}

export class Charmander extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.CHARMELEON
  hp = 60
  atk = 4
  speed = 57
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.BLAST_BURN
}

export class Charmeleon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.CHARIZARD
  hp = 120
  atk = 8
  speed = 57
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BLAST_BURN
}

export class Charizard extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 18
  speed = 57
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.BLAST_BURN
}

export class Magikarp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.GYARADOS
  hp = 30
  atk = 1
  speed = 51
  def = 2
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.SPLASH
  passive = Passive.MAGIKARP
  evolutionRule = new CountEvolutionRule(8)
}

export class Gyarados extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.WATER,
    Synergy.FLYING
  ])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 300
  atk = 28
  speed = 51
  def = 10
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HYDRO_PUMP
  onAcquired(player: Player) {
    player.titles.add(Title.FISHERMAN)
  }
}

export class PikachuSurfer extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.AQUATIC,
    Synergy.FAIRY
  ])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 120
  atk = 8
  speed = 54
  def = 4
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SURF
  passive = Passive.PIKACHU_SURFER
  onItemRemoved(item: Item, player: Player): void {
    if (item === Item.SURFBOARD) {
      player.transformPokemon(this, Pkm.PIKACHU)
    }
  }
}

export class Rattata extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.RATICATE
  hp = 50
  atk = 4
  speed = 56
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.AGILITY
}

export class Raticate extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.COMMON
  stars = 2
  hp = 110
  atk = 9
  speed = 56
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AGILITY
}

export class AlolanRattata extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.ALOLAN_RATICATE
  hp = 60
  atk = 6
  speed = 50
  def = 2
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.TAIL_WHIP
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.DARK)
  }
}

export class AlolanRaticate extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.COMMON
  stars = 2
  hp = 130
  atk = 14
  speed = 50
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.TAIL_WHIP
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.DARK)
  }
}

export class Spearow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.FEAROW
  hp = 50
  atk = 4
  speed = 57
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.PECK
}

export class Fearow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 2
  hp = 120
  atk = 8
  speed = 57
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.PECK
}

export class Meloetta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 23
  speed = 54
  def = 8
  speDef = 12
  maxPP = 60
  range = 4
  skill = Ability.RELIC_SONG
  passive = Passive.MELOETTA

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    if (y === 3) {
      player.transformPokemon(this, Pkm.PIROUETTE_MELOETTA)
    }
  }
}

export class PirouetteMeloetta extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.SOUND,
    Synergy.FIGHTING
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 23
  speed = 82
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.U_TURN
  passive = Passive.MELOETTA

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    if (y !== 3) {
      player.transformPokemon(this, Pkm.MELOETTA)
    }
  }
}

export class Lugia extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.FLYING,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.LEGENDARY
  evolution = Pkm.SHADOW_LUGIA
  evolutionRule = new ItemEvolutionRule([Item.DUSK_STONE])
  stars = 3
  hp = 300
  atk = 26
  speed = 60
  def = 12
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.SKY_ATTACK
  passive = Passive.LUGIA
}

export class ShadowLugia extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.FLYING,
    Synergy.PSYCHIC,
    Synergy.DARK
  ])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 300
  atk = 26
  speed = 60
  def = 12
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.SKY_ATTACK_SHADOW
  passive = Passive.NIGHT
}

export class Giratina extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 32
  speed = 54
  def = 12
  speDef = 12
  maxPP = 40
  range = 1
  skill = Ability.SHADOW_SNEAK
  passive = Passive.GIRATINA

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    if (y !== 3) {
      player.transformPokemon(this, Pkm.ORIGIN_GIRATINA)
    }
  }
}

export class OriginGiratina extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GHOST,
    Synergy.FLYING
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 32
  speed = 54
  def = 4
  speDef = 4
  maxPP = 40
  range = 2
  skill = Ability.SHADOW_SNEAK
  passive = Passive.GIRATINA

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    if (y === 3) {
      player.transformPokemon(this, Pkm.GIRATINA)
    }
  }
}

export class Zapdos extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 27
  speed = 57
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.THUNDER
  passive = Passive.STORM
}

export class GalarianZapdos extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 27
  speed = 57
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.THUNDEROUS_KICK
}

export class Zeraora extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ELECTRIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  speed = 71
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.PLASMA_FIST
}

export class Stantler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 19
  speed = 52
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.PSYSHIELD_BASH
  passive = Passive.STANTLER
  evolution: Pkm = Pkm.WYRDEER
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon: Pokemon, player: Player, stageLevel: number) => {
      return player.map !== this.originalMap && stageLevel >= 20
    }
  )
  originalMap: DungeonPMDO | "town" = "town"
  onAcquired(player: Player): void {
    this.originalMap = player.map
  }
}

export class Wyrdeer extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 250
  atk = 21
  speed = 42
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.PSYSHIELD_BASH
}

export class Miltank extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.GOURMET,
    Synergy.FIELD
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 13
  speed = 57
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.ROLLOUT
}

export class Yveltal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 22
  speed = 57
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.DEATH_WING
}

export class Moltres extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 28
  speed = 54
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.OVERHEAT
  passive = Passive.SUN
}

export class GalarianMoltres extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 28
  speed = 54
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.FIERY_WRATH
}

export class Pinsir extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.BUG])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 20
  speed = 52
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.GUILLOTINE
}

export class Articuno extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 28
  speed = 52
  def = 6
  speDef = 6
  maxPP = 110
  range = 2
  skill = Ability.BLIZZARD
  passive = Passive.SNOW
}

export class GalarianArticuno extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 27
  speed = 55
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.FREEZING_GLARE
}

export class Dialga extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 23
  speed = 54
  def = 10
  speDef = 10
  maxPP = 110
  range = 1
  skill = Ability.ROAR_OF_TIME
}

export class Palkia extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.WATER])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 22
  speed = 57
  def = 10
  speDef = 10
  maxPP = 110
  range = 1
  skill = Ability.SPACIAL_REND
}

export class Meltan extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.AMORPHOUS])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 50
  atk = 5
  speed = 40
  def = 8
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.MAGNET_PULL
  passive = Passive.MELTAN
}

export class Melmetal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.AMORPHOUS])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 320
  atk = 35
  speed = 36
  def = 14
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_IRON_BASH
  passive = Passive.MELMETAL
  onAcquired(player: Player) {
    if (player.items.includes(Item.MYSTERY_BOX) === false) {
      player.items.push(Item.MYSTERY_BOX)
    }
  }
  afterSell(player: Player) {
    removeInArray(player.items, Item.MYSTERY_BOX)
  }
}

export class Suicune extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 28
  speed = 52
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.AQUA_JET
}

export class Raikou extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.ELECTRIC,
    Synergy.FIELD
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 26
  speed = 62
  def = 10
  speDef = 10
  maxPP = 130
  range = 1
  skill = Ability.VOLT_SWITCH
}

export class Entei extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 27
  speed = 57
  def = 10
  speDef = 10
  maxPP = 130
  range = 1
  skill = Ability.FLAME_CHARGE
}

export class Regice extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.HUMAN, Synergy.FOSSIL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  speed = 41
  def = 15
  speDef = 25
  maxPP = 100
  range = 1
  skill = Ability.HAIL
}

export class Seviper extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.MONSTER])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 22
  speed = 46
  def = 8
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.VENOSHOCK
}

export class Lunatone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.PSYCHIC, Synergy.DARK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  speed = 47
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.COSMIC_POWER_MOON
  passive = Passive.NIGHT
}

export class Solrock extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FIRE, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  speed = 47
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.COSMIC_POWER_SUN
  passive = Passive.SUN
}

export class Regirock extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.HUMAN, Synergy.FOSSIL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  speed = 41
  def = 25
  speDef = 15
  maxPP = 100
  range = 1
  skill = Ability.STEALTH_ROCKS
}

export class Tauros extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 60
  def = 14
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
}

export class Heracross extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FIGHTING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 21
  speed = 52
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.CLOSE_COMBAT
  passive = Passive.GUTS
}

export class Zangoose extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 18
  speed = 54
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.FACADE
  passive = Passive.TOXIC_BOOST
}

export class Registeel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.HUMAN, Synergy.FOSSIL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  speed = 41
  def = 20
  speDef = 20
  maxPP = 100
  range = 1
  skill = Ability.IRON_HEAD
}

export class Regigigas extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.HUMAN,
    Synergy.FOSSIL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 400
  atk = 30
  speed = 57
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.CRUSH_GRIP
  passive = Passive.SLOW_START

  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.addSpeed(-30, entity, 0, false)
  }
}

export class Kyogre extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.MONSTER])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.PRIMAL_KYOGRE
  evolutionRule = new ItemEvolutionRule([Item.BLUE_ORB])
  hp = 300
  atk = 18
  speed = 54
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.ORIGIN_PULSE
  passive = Passive.PRIMAL
}

export class Groudon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.MONSTER])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.PRIMAL_GROUDON
  evolutionRule = new ItemEvolutionRule([Item.RED_ORB])
  hp = 300
  atk = 18
  speed = 54
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.EARTHQUAKE
  passive = Passive.PRIMAL
}

export class Rayquaza extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.MEGA_RAYQUAZA
  evolutionRule = new ItemEvolutionRule([Item.GREEN_ORB])
  hp = 300
  atk = 27
  speed = 55
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.DRACO_METEOR
  passive = Passive.PRIMAL
}

export class Eevee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  hp = 90
  atk = 5
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
  passive = Passive.EEVEE
  evolutions = [
    Pkm.VAPOREON,
    Pkm.JOLTEON,
    Pkm.FLAREON,
    Pkm.ESPEON,
    Pkm.UMBREON,
    Pkm.LEAFEON,
    Pkm.SYLVEON,
    Pkm.GLACEON
  ]
  evolutionRule = new ItemEvolutionRule(
    [
      Item.WATER_STONE,
      Item.FIRE_STONE,
      Item.THUNDER_STONE,
      Item.DUSK_STONE,
      Item.MOON_STONE,
      Item.LEAF_STONE,
      Item.DAWN_STONE,
      Item.ICE_STONE
    ],
    (pokemon, player, item) => {
      switch (item) {
        case Item.WATER_STONE:
          return Pkm.VAPOREON
        case Item.FIRE_STONE:
          return Pkm.FLAREON
        case Item.THUNDER_STONE:
          return Pkm.JOLTEON
        case Item.DUSK_STONE:
          return Pkm.UMBREON
        case Item.MOON_STONE:
          return Pkm.SYLVEON
        case Item.LEAF_STONE:
          return Pkm.LEAFEON
        case Item.DAWN_STONE:
          return Pkm.ESPEON
        case Item.ICE_STONE:
        default:
          return Pkm.GLACEON
      }
    }
  )
}

export class Vaporeon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Jolteon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 8
  speed = 83
  def = 6
  speDef = 4
  maxPP = 120
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Flareon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Espeon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 8
  speed = 70
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Umbreon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Leafeon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 9
  speed = 61
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Sylveon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Glaceon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 12
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HAPPY_HOUR
}

export class Volcanion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 20
  speed = 47
  def = 8
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.STEAM_ERUPTION
}

export class Darkrai extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.GHOST,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 22
  speed = 65
  def = 4
  speDef = 4
  maxPP = 120
  range = 2
  skill = Ability.DARK_VOID
}

export class Larvesta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.BUG])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.VOLCARONA
  hp = 100
  atk = 11
  speed = 57
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.FIERY_DANCE
  additional = true
}

export class Volcarona extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.BUG])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 21
  speed = 57
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.FIERY_DANCE
  additional = true
}

export class Chatot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.SOUND])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 18
  speed = 54
  def = 4
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.CHATTER
}

export class Farfetchd extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLYING,
    Synergy.GOURMET,
    Synergy.NORMAL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 8
  speDef = 8
  maxPP = 60
  range = 1
  skill = Ability.RAZOR_WIND
}

export class GalarianFarfetchd extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLYING,
    Synergy.GOURMET,
    Synergy.FIGHTING
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  def = 8
  speDef = 8
  maxPP = 60
  range = 1
  skill = Ability.LEAF_BLADE
}

export class Kecleon extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 22
  speed = 38
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ILLUSION
  passive = Passive.PROTEAN2
}

function updateCastform(pokemon: Pokemon, weather: Weather, player: Player) {
  let weatherForm: Pkm = Pkm.CASTFORM
  if (weather === Weather.SNOW) {
    weatherForm = Pkm.CASTFORM_HAIL
  } else if (weather === Weather.RAIN) {
    weatherForm = Pkm.CASTFORM_RAIN
  } else if (weather === Weather.SUN) {
    weatherForm = Pkm.CASTFORM_SUN
  }

  if (pokemon.name === weatherForm) return
  if (!player) return

  player.transformPokemon(pokemon, weatherForm)
}

export class Castform extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ARTIFICIAL, Synergy.AMORPHOUS])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  speed = 47
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM

  beforeSimulationStart({
    isGhostBattle,
    weather,
    player
  }: {
    isGhostBattle: boolean
    weather: Weather
    player: Player
  }) {
    if (!isGhostBattle) {
      updateCastform(this, weather, player)
    }
  }
}

export class CastformSun extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ARTIFICIAL,
    Synergy.FIRE,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  speed = 47
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM

  beforeSimulationStart({
    isGhostBattle,
    weather,
    player
  }: {
    isGhostBattle: boolean
    weather: Weather
    player: Player
  }) {
    if (!isGhostBattle) {
      updateCastform(this, weather, player)
    }
  }
}

export class CastformRain extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ARTIFICIAL,
    Synergy.WATER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  speed = 47
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM

  beforeSimulationStart({
    isGhostBattle,
    weather,
    player
  }: {
    isGhostBattle: boolean
    weather: Weather
    player: Player
  }) {
    if (!isGhostBattle) {
      updateCastform(this, weather, player)
    }
  }
}

export class CastformHail extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ARTIFICIAL,
    Synergy.ICE,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 18
  speed = 47
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.FORECAST
  passive = Passive.CASTFORM

  beforeSimulationStart({
    isGhostBattle,
    weather,
    player
  }: {
    isGhostBattle: boolean
    weather: Weather
    player: Player
  }) {
    if (!isGhostBattle) {
      updateCastform(this, weather, player)
    }
  }
}

export class Landorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.GROUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 27
  speed = 57
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.SANDSEAR_STORM
  passive = Passive.LANDORUS
}

export class Thundurus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ELECTRIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 26
  speed = 61
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.WILDBOLT_STORM
  passive = Passive.THUNDURUS
}

export class Tornadus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ICE])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 26
  speed = 61
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.BLEAKWIND_STORM
  passive = Passive.TORNADUS
}

export class Enamorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FAIRY])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 26
  speed = 59
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.SPRINGTIDE_STORM
  passive = Passive.ENAMORUS
}

export class Keldeo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 26
  speed = 60
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.SECRET_SWORD
}

export class Terrakion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  speed = 60
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.SACRED_SWORD_CAVERN
}

export class Virizion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 26
  speed = 60
  def = 8
  speDef = 16
  maxPP = 120
  range = 1
  skill = Ability.SACRED_SWORD_GRASS
}

export class Cobalion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 26
  speed = 60
  def = 16
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.SACRED_SWORD_IRON
}

export class Mawile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.FAIRY,
    Synergy.MONSTER
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 16
  speed = 41
  def = 12
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.PLAY_ROUGH
}

export class Phione extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  evolution = Pkm.MANAPHY
  evolutionRule = new ItemEvolutionRule([Item.AQUA_EGG])
  hp = 190
  atk = 13
  speed = 57
  def = 4
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.TAKE_HEART
  passive = Passive.PHIONE
}

export class Manaphy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 240
  atk = 15
  speed = 57
  def = 8
  speDef = 8
  maxPP = 80
  range = 3
  skill = Ability.TAKE_HEART
}

export class Rotom extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.GHOST,
    Synergy.LIGHT
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 10
  speed = 54
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.CHARGE
}

export class RotomDrone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.ARTIFICIAL])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 80
  atk = 6
  speed = 53
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.FLASH
}

export class Spiritomb extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.GHOST,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 22
  speed = 36
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.SHADOW_BALL
}

export class Absol extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 19
  speed = 49
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.NIGHT_SLASH
}

export class Delibird extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FLYING, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 19
  speed = 49
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.PRESENT
}

export class IronBundle extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ICE,
    Synergy.WATER,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 13
  speed = 69
  def = 10
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AURORA_BEAM
}

export class Lapras extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 12
  speed = 44
  def = 10
  speDef = 12
  maxPP = 120
  range = 1
  skill = Ability.DIVE
}

export class Latias extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 120
  atk = 9
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.MIST_BALL
  passive = Passive.SHARED_VISION
}

export class Latios extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 120
  atk = 9
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.LUSTER_PURGE
  passive = Passive.SHARED_VISION
}

export class Uxie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 55
  def = 10
  speDef = 10
  maxPP = 90
  range = 3
  skill = Ability.KNOWLEDGE_THIEF
}

export class Mesprit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  speed = 51
  def = 8
  speDef = 8
  maxPP = 90
  range = 3
  skill = Ability.SONG_OF_DESIRE
}

export class Azelf extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  speed = 62
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.NASTY_PLOT
}

export class Mew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 27
  speed = 64
  def = 10
  speDef = 10
  maxPP = 50
  range = 4
  skill = Ability.TELEPORT
  passive = Passive.SYNCHRO
}

export class Mewtwo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.MONSTER,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 25
  speed = 67
  def = 10
  speDef = 10
  maxPP = 110
  range = 3
  skill = Ability.PSYSTRIKE
}

export class Marshadow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 23
  speed = 65
  def = 10
  speDef = 10
  maxPP = 125
  range = 1
  skill = Ability.SPECTRAL_THIEF
}

export class Kyurem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ICE])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 27
  speed = 55
  def = 6
  speDef = 12
  maxPP = 100
  range = 3
  skill = Ability.GLACIATE
}

export class Reshiram extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 28
  speed = 54
  def = 6
  speDef = 12
  maxPP = 100
  range = 3
  skill = Ability.BLUE_FLARE
}

export class Zekrom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ELECTRIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 28
  speed = 54
  def = 6
  speDef = 12
  maxPP = 100
  range = 3
  skill = Ability.FUSION_BOLT
}

export class Celebi extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.PSYCHIC,
    Synergy.FLORA
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 25
  speed = 57
  def = 10
  speDef = 10
  maxPP = 100
  range = 3
  skill = Ability.TIME_TRAVEL
  passive = Passive.CELEBI
}

export class Victini extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 27
  speed = 57
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.SEARING_SHOT
  passive = Passive.VICTINI
  beforeSimulationStart({
    opponentEffects
  }: {
    opponentEffects: Set<EffectEnum>
  }) {
    opponentEffects.add(EffectEnum.VICTINI_PASSIVE)
  }
}

export class Jirachi extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.PSYCHIC,
    Synergy.SOUND
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 27
  speed = 57
  def = 10
  speDef = 10
  maxPP = 80
  range = 3
  skill = Ability.DOOM_DESIRE
  passive = Passive.GOOD_LUCK
  beforeSimulationStart({ teamEffects }: { teamEffects: Set<EffectEnum> }) {
    teamEffects.add(EffectEnum.GOOD_LUCK)
  }
}

export class Arceus extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 21
  speed = 63
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.JUDGEMENT
  passive = Passive.PROTEAN3
}

export class Deoxys extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.AMORPHOUS,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 20
  speed = 73
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.PSYCHO_BOOST
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
  afterSell(player: Player): void {
    removeInArray(player.items, Item.METEORITE)
  }
}

export class DeoxysDefense extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.AMORPHOUS,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 15
  speed = 45
  def = 16
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.PROTECT
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
  afterSell(player: Player): void {
    removeInArray(player.items, Item.METEORITE)
  }
}

export class DeoxysAttack extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.AMORPHOUS,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 20
  speed = 73
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.ZAP_CANNON
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
  afterSell(player: Player): void {
    removeInArray(player.items, Item.METEORITE)
  }
}

export class DeoxysSpeed extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.AMORPHOUS,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 15
  speed = 90
  def = 6
  speDef = 6
  maxPP = 60
  range = 2
  skill = Ability.EXTREME_SPEED
  passive = Passive.ALIEN_DNA
  onAcquired(player: Player) {
    if (player.items.includes(Item.METEORITE) === false) {
      player.items.push(Item.METEORITE)
    }
  }
  afterSell(player: Player): void {
    removeInArray(player.items, Item.METEORITE)
  }
}

export class Shaymin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.LEGENDARY
  stars = 3
  evolution = Pkm.SHAYMIN_SKY
  evolutionRule = new ItemEvolutionRule([Item.GRACIDEA_FLOWER])
  hp = 200
  atk = 25
  speed = 57
  def = 10
  speDef = 10
  maxPP = 100
  range = 3
  skill = Ability.SEED_FLARE
  passive = Passive.SHAYMIN
}

export class ShayminSky extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 300
  atk = 28
  speed = 66
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.SEED_FLARE
}

export class Cresselia extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.LIGHT
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 14
  speed = 52
  def = 10
  speDef = 10
  maxPP = 100
  range = 3
  skill = Ability.LUNAR_BLESSING
}

export class Heatran extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 280
  atk = 19
  speed = 50
  def = 10
  speDef = 10
  maxPP = 100
  range = 2
  skill = Ability.MAGMA_STORM
}

export class HooH extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FLYING, Synergy.LIGHT])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  speed = 50
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.FIRE_BLAST
  passive = Passive.SUN
}

export class RoaringMoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.DARK, Synergy.FOSSIL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 25
  speed = 61
  def = 6
  speDef = 9
  maxPP = 140
  range = 3
  skill = Ability.SCALE_SHOT
}

export class Torkoal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.GROUND])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 17
  speed = 31
  def = 16
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SMOKE_SCREEN
}

export class Heatmor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 22
  speed = 46
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.FIRE_LASH
}

export class Cryogonal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.AMORPHOUS])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  speed = 59
  def = 4
  speDef = 16
  maxPP = 100
  range = 3
  skill = Ability.FREEZE_DRY
}

export class Drampa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.NORMAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 12
  speed = 37
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.DRAGON_PULSE
  passive = Passive.BERSERK
}

export class PrimalGroudon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.MONSTER,
    Synergy.FIRE
  ])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 400
  atk = 18
  speed = 54
  def = 12
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.EARTHQUAKE
  passive = Passive.SANDSTORM
  onAcquired(player: Player) {
    player.titles.add(Title.PRIMAL)
  }
}

export class PrimalKyogre extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.ELECTRIC,
    Synergy.MONSTER
  ])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 400
  atk = 18
  speed = 54
  def = 6
  speDef = 6
  maxPP = 90
  range = 3
  skill = Ability.ORIGIN_PULSE
  passive = Passive.RAIN
  onAcquired(player: Player) {
    player.titles.add(Title.PRIMAL)
  }
}

export class MegaRayquaza extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FLYING])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 400
  atk = 27
  speed = 55
  def = 10
  speDef = 10
  maxPP = 100
  range = 2
  skill = Ability.DRACO_METEOR
  passive = Passive.AIRLOCK
  onAcquired(player: Player) {
    player.titles.add(Title.PRIMAL)
  }
}

export class Oddish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.GLOOM
  hp = 80
  atk = 8
  speed = 41
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.STUN_SPORE
}

export class Gloom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 2
  evolution = Pkm.VILEPLUME
  hp = 140
  atk = 16
  speed = 41
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.STUN_SPORE
}

export class Vileplume extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 200
  atk = 24
  speed = 41
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.STUN_SPORE
}

export class Bellossom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.SPECIAL
  stars = 4
  hp = 300
  atk = 30
  speed = 41
  def = 10
  speDef = 10
  maxPP = 10
  range = 1
  skill = Ability.PETAL_BLIZZARD
}

export class Amaura extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.AURORUS
  hp = 130
  atk = 7
  speed = 44
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.HAIL
  additional = true
}

export class Aurorus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ICE])
  rarity = Rarity.EPIC
  stars = 2
  hp = 280
  atk = 18
  speed = 44
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.HAIL
  additional = true
}

export class Carbink extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ROCK, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DIANCIE
  hp = 125
  atk = 7
  speed = 41
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DIAMOND_STORM
  additional = true
}

export class Diancie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.ROCK, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 2
  hp = 300
  atk = 10
  speed = 41
  def = 16
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.DIAMOND_STORM
  additional = true
}

export class Sunkern extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SUNFLORA
  hp = 80
  atk = 9
  speed = 35
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.SOLAR_BEAM
  additional = true
}

export class Sunflora extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE, Synergy.FLORA])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 20
  speed = 35
  def = 10
  speDef = 10
  maxPP = 80
  range = 2
  skill = Ability.SOLAR_BEAM
  additional = true
}

export class Mankey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.PRIMEAPE
  hp = 120
  atk = 7
  speed = 54
  def = 6
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.THRASH
}

export class Primeape extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.ANNIHILAPE
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon) => pokemon.atk >= 30
  )
  hp = 240
  atk = 20
  speed = 54
  def = 12
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.THRASH
  passive = Passive.PRIMEAPE
}

export class Annihilape extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.FIGHTING,
    Synergy.GHOST
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 320
  atk = 30
  speed = 54
  def = 12
  speDef = 14
  maxPP = 90
  range = 1
  skill = Ability.THRASH
  onAcquired(player: Player) {
    player.titles.add(Title.ANNIHILATOR)
    this.atk -= 30 - 20 // revert permanent atk buff stacked for evolution
  }
}

export class Anorith extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.BUG, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARMALDO
  hp = 60
  atk = 6
  speed = 39
  def = 4
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.HARDEN
  additional = true
}

export class Armaldo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.BUG, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 16
  speed = 39
  def = 6
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.HARDEN
  additional = true
}

export class Wynaut extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.BABY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WOBBUFFET
  hp = 110
  atk = 8
  speed = 36
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.COUNTER
  passive = Passive.WOBBUFFET
  additional = true
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.toIdleState()
  }
}

export class Wobbuffet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.AMORPHOUS])
  rarity = Rarity.RARE
  stars = 2
  hp = 280
  atk = 20
  speed = 36
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.COUNTER
  passive = Passive.WOBBUFFET
  additional = true
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.toIdleState()
  }
}

export class Munna extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FIELD,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MUSHARNA
  hp = 80
  atk = 9
  speed = 34
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.MOON_DREAM
  passive = Passive.DREAM_CATCHER
  additional = true
}

export class Musharna extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FIELD,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 240
  atk = 18
  speed = 34
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.MOON_DREAM
  passive = Passive.DREAM_CATCHER
  additional = true
}

export class Archen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLYING, Synergy.FOSSIL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARCHEOPS
  hp = 70
  atk = 4
  speed = 60
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.ROCK_SMASH
  additional = true
}

export class Archeops extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLYING, Synergy.FOSSIL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 10
  speed = 60
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.ROCK_SMASH
  additional = true
}

export class Gligar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.POISON,
    Synergy.FLYING
  ])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.GLISCOR
  evolutionRule = new ItemEvolutionRule([Item.RAZOR_FANG])
  hp = 150
  atk = 15
  speed = 55
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.POISON_JAB
  passive = Passive.GLIGAR
}

export class Gliscor extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.POISON,
    Synergy.FLYING
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 170
  atk = 16
  speed = 55
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.POISON_JAB
  passive = Passive.GLISCOR
}

export class Shieldon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.BASTIODON
  hp = 90
  atk = 7
  speed = 35
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.IRON_DEFENSE
  additional = true
}

export class Bastiodon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 2
  hp = 250
  atk = 11
  speed = 35
  def = 16
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.IRON_DEFENSE
  additional = true
}

export class Mienfoo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MIENSHAO
  hp = 80
  atk = 9
  speed = 59
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.DRAIN_PUNCH
  additional = true
}

export class Mienshao extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 175
  atk = 18
  speed = 59
  def = 8
  speDef = 8
  maxPP = 60
  range = 1
  skill = Ability.DRAIN_PUNCH
  additional = true
}
/*
export class Tirtouga extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CARRACOSTA
  hp = 120
  atk = 8
  speed = 35
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  additional = true
}

export class Carracosta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 2
  hp = 240
  atk = 16
  speed = 35
  def = 14
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.DEFAULT
  additional = true
}*/

export class Lileep extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CRADILY
  hp = 70
  atk = 7
  speed = 39
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.LEECH_SEED
  additional = true
}

export class Cradily extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 22
  speed = 39
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.LEECH_SEED
  additional = true
}

export class Cranidos extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.RAMPARDOS
  hp = 60
  atk = 7
  speed = 44
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  additional = true
}

export class Rampardos extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.MONSTER])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 15
  speed = 44
  def = 6
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  additional = true
}

export class Kabuto extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.KABUTOPS
  hp = 80
  atk = 8
  speed = 51
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.PROTECT
  additional = true
}

export class Kabutops extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FOSSIL, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 22
  speed = 51
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.SLASHING_CLAW
  additional = true
}

export class Omanyte extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.OMASTAR
  hp = 70
  atk = 6
  speed = 43
  def = 4
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.ROCK_TOMB
  additional = true
}

export class Omastar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  speed = 43
  def = 6
  speDef = 8
  maxPP = 90
  range = 2
  skill = Ability.ROCK_TOMB
  additional = true
}
export class Clamperl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 1
  hp = 100
  atk = 8
  speed = 35
  def = 8
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.ROCK_TOMB
  passive = Passive.BIVALVE
  additional = true
  evolutions = [Pkm.HUNTAIL, Pkm.GOREBYSS]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (
        Math.max(
          ...values(player.board)
            .filter((pkm) => pkm.index === this.index)
            .map((v) => v.positionY)
        ) === 3
      ) {
        return Pkm.HUNTAIL
      } else {
        return Pkm.GOREBYSS
      }
    }
  )
}

export class Gorebyss extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 18
  speed = 35
  def = 10
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.HYDRO_PUMP
  passive = Passive.BIVALVE
  additional = true
}
export class Huntail extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FOSSIL,
    Synergy.WATER,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 140
  atk = 30
  speed = 35
  def = 10
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.ROCK_TOMB
  passive = Passive.BIVALVE
  additional = true
}
export class Relicanth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.WATER, Synergy.FOSSIL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 13
  speed = 43
  def = 14
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ROCK_TOMB
}

export class Tyrunt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ROCK, Synergy.FOSSIL])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.TYRANTRUM
  hp = 70
  atk = 8
  speed = 48
  def = 8
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.ROCK_HEAD
  additional = true
}

export class Tyrantrum extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ROCK, Synergy.FOSSIL])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 18
  speed = 48
  def = 12
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.ROCK_HEAD
  additional = true
}

export class Aerodactyl extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLYING, Synergy.FOSSIL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 67
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.ROCK_SLIDE
}

export class Genesect extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.BUG,
    Synergy.STEEL,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 20
  speed = 57
  def = 12
  speDef = 6
  maxPP = 80
  range = 4
  skill = Ability.LOCK_ON
}

export class Hatenna extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HATTREM
  hp = 75
  atk = 7
  speed = 34
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.MAGIC_POWDER
}

export class Hattrem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.HATTERENE
  hp = 130
  atk = 12
  speed = 34
  def = 8
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.MAGIC_POWDER
}

export class Hatterene extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 240
  atk = 25
  speed = 34
  def = 10
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.MAGIC_POWDER
}
export class Fennekin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.BRAIXEN
  hp = 50
  atk = 4
  speed = 58
  def = 2
  speDef = 2
  maxPP = 80
  range = 2
  skill = Ability.MYSTICAL_FIRE
}
export class Braixen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.DELPHOX
  hp = 100
  atk = 8
  speed = 58
  def = 2
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.MYSTICAL_FIRE
}
export class Delphox extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 16
  speed = 58
  def = 2
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.MYSTICAL_FIRE
}

export class Regieleki extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.HUMAN,
    Synergy.FOSSIL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 20
  speed = 89
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.THUNDER_CAGE
}
export class Regidrago extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FOSSIL,
    Synergy.MONSTER
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 350
  atk = 25
  speed = 51
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.DRACO_ENERGY
}
export class Guzzlord extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GOURMET,
    Synergy.DARK,
    Synergy.MONSTER
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  speed = 39
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.CRUNCH
  passive = Passive.GUZZLORD
}
export class Eternatus extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.POISON,
    Synergy.FOSSIL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 18
  speed = 67
  def = 16
  speDef = 16
  maxPP = 125
  range = 1
  skill = Ability.DYNAMAX_CANNON
}

export class Nincada extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.NINJASK
  hp = 130
  atk = 10
  speed = 76
  def = 10
  speDef = 4
  maxPP = 110
  range = 1
  skill = Ability.WONDER_GUARD
  passive = Passive.NINCADA
  additional = true
}

export class Ninjask extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 14
  speed = 76
  def = 10
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AERIAL_ACE
  additional = true
  onAcquired(player: Player) {
    // also gain sheninja if free space on bench
    const x = getFirstAvailablePositionInBench(player.board)
    if (x !== undefined) {
      const pokemon = PokemonFactory.createPokemonFromName(Pkm.SHEDINJA, player)
      pokemon.positionX = x
      pokemon.positionY = 0
      player.board.set(pokemon.id, pokemon)
    }
  }
}

export class Shedinja extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  hp = 100
  atk = 14
  speed = 38
  def = 0
  speDef = 0
  maxPP = 100
  range = 1
  skill = Ability.WONDER_GUARD
  passive = Passive.WONDER_GUARD
  additional = true
}

export class Happiny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY, Synergy.BABY])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.CHANSEY
  hp = 150
  atk = 8
  speed = 43
  def = 10
  speDef = 10
  maxPP = 120
  range = 1
  skill = Ability.SOFT_BOILED
}

export class Chansey extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FAIRY,
    Synergy.GOURMET
  ])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.BLISSEY
  hp = 300
  atk = 21
  speed = 43
  def = 12
  speDef = 20
  maxPP = 120
  range = 1
  skill = Ability.SOFT_BOILED
}

export class Blissey extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FAIRY,
    Synergy.GOURMET
  ])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 480
  atk = 26
  speed = 43
  def = 20
  speDef = 30
  maxPP = 120
  range = 1
  skill = Ability.SOFT_BOILED
}

export class TapuKoko extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 67
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.ELECTRIC_SURGE
  passive = Passive.ELECTRIC_TERRAIN
}

export class TapuLele extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  speed = 55
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.PSYCHIC_SURGE
  passive = Passive.PSYCHIC_TERRAIN
}

export class Xerneas extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.LIGHT, Synergy.FLORA])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 22
  speed = 57
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.GEOMANCY
  passive = Passive.MISTY
}

export class TapuFini extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  speed = 52
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.MISTY_SURGE
  passive = Passive.MISTY_TERRAIN
}

export class TapuBulu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  speed = 49
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.GRASSY_SURGE
  passive = Passive.GRASSY_TERRAIN
}

export class Stakataka extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 10
  speed = 29
  def = 30
  speDef = 30
  maxPP = 100
  range = 1
  skill = Ability.IRON_DEFENSE
}

export class Blacephalon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 13
  speed = 59
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.MIND_BLOWN
}

export class Houndour extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HOUNDOOM
  hp = 90
  atk = 7
  speed = 55
  def = 8
  speDef = 8
  maxPP = 110
  range = 1
  skill = Ability.BEAT_UP
  additional = true
}

export class Houndoom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 2
  //evolution = Pkm.MEGA_HOUNDOOM
  hp = 160
  atk = 18
  speed = 55
  def = 12
  speDef = 12
  maxPP = 110
  range = 1
  skill = Ability.BEAT_UP
  additional = true
}

export class MegaHoundoom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 3
  hp = 280
  atk = 35
  speed = 55
  def = 16
  speDef = 16
  maxPP = 120
  range = 1
  //skill = Ability.BEAT_UP
  skill = Ability.DEFAULT
  additional = true
}

export class Cacnea extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CACTURNE
  hp = 85
  atk = 7
  speed = 43
  def = 6
  speDef = 2
  maxPP = 70
  range = 1
  skill = Ability.HEAL_BLOCK
  additional = true
}

export class Cacturne extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.DARK, Synergy.HUMAN])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 21
  speed = 43
  def = 12
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.HEAL_BLOCK
  additional = true
}

export class Pumpkaboo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GOURGEIST
  hp = 90
  atk = 13
  speed = 52
  def = 12
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.TRICK_OR_TREAT
  additional = true
}
export class Gourgeist extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.GRASS])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 26
  speed = 52
  def = 20
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.TRICK_OR_TREAT
  additional = true
}

export class Natu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.XATU
  hp = 90
  atk = 5
  speed = 60
  def = 4
  speDef = 4
  maxPP = 70
  range = 2
  skill = Ability.MAGIC_BOUNCE
  additional = true
}
export class Xatu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 15
  speed = 60
  def = 7
  speDef = 7
  maxPP = 70
  range = 2
  skill = Ability.MAGIC_BOUNCE
  additional = true
}

export class Noibat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.SOUND,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.NOIVERN
  hp = 65
  atk = 6
  speed = 64
  def = 2
  speDef = 2
  maxPP = 70
  range = 2
  skill = Ability.RAZOR_WIND
  additional = true
}
export class Noivern extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.SOUND,
    Synergy.FLYING
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 14
  speed = 64
  def = 6
  speDef = 6
  maxPP = 70
  range = 2
  skill = Ability.RAZOR_WIND
  additional = true
}

export class Shellder extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.ROCK])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CLOYSTER
  hp = 70
  atk = 5
  speed = 47
  def = 10
  speDef = 4
  maxPP = 110
  range = 1
  skill = Ability.SHELL_SMASH
  additional = true
}

export class Cloyster extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.ICE, Synergy.ROCK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 11
  speed = 47
  def = 16
  speDef = 4
  maxPP = 110
  range = 1
  skill = Ability.SHELL_SMASH
  additional = true
}

export class Buizel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIELD
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.FLOATZEL
  hp = 90
  atk = 8
  speed = 62
  def = 6
  speDef = 6
  maxPP = 70
  range = 1
  skill = Ability.AQUA_JET
  additional = true
}
export class Floatzel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.FIELD
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 21
  speed = 62
  def = 10
  speDef = 10
  maxPP = 70
  range = 1
  skill = Ability.AQUA_JET
  additional = true
}

export class Ponyta extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.RAPIDASH
  hp = 90
  atk = 11
  speed = 59
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.FLAME_CHARGE
  additional = true
}
export class Rapidash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 21
  speed = 59
  def = 10
  speDef = 10
  maxPP = 60
  range = 1
  skill = Ability.FLAME_CHARGE
  additional = true
}

export class GalarianPonyta extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.PSYCHIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GALARIAN_RAPIDASH
  hp = 90
  atk = 8
  speed = 59
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.PASTEL_VEIL
  regional = true
  additional = true
}
export class GalarianRapidash extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.PSYCHIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 18
  speed = 59
  def = 10
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.PASTEL_VEIL
  regional = true
  additional = true
}

export class Makuhita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.HARIYAMA
  hp = 80
  atk = 8
  speed = 41
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DYNAMIC_PUNCH
  additional = true
}
export class Hariyama extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.MONSTER])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 23
  speed = 41
  def = 10
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.DYNAMIC_PUNCH
  additional = true
}

export class Sentret extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.NORMAL,
    Synergy.FIELD
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.FURRET
  hp = 80
  atk = 6
  speed = 54
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.HELPING_HAND
  additional = true
}
export class Furret extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.NORMAL,
    Synergy.FIELD
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 15
  speed = 54
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.HELPING_HAND
  additional = true
}

export class Joltik extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.GALVANTULA
  hp = 80
  atk = 7
  speed = 60
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ELECTRO_WEB
  additional = true
}
export class Galvantula extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 17
  speed = 60
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ELECTRO_WEB
  additional = true
}

export class Paras extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PARASECT
  hp = 90
  atk = 7
  speed = 35
  def = 4
  speDef = 4
  maxPP = 110
  range = 1
  skill = Ability.ABSORB
  additional = true
}

export class Parasect extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 18
  speed = 35
  def = 6
  speDef = 6
  maxPP = 110
  range = 1
  skill = Ability.ABSORB
  additional = true
}

export class Corphish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CRAWDAUNT
  hp = 85
  atk = 6
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.CRABHAMMER
  additional = true
}

export class Crawdaunt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 16
  speed = 43
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.CRABHAMMER
  additional = true
}
export class Meowth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PERSIAN
  hp = 80
  atk = 7
  speed = 62
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.PAYDAY
  additional = true
}

export class Persian extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 17
  speed = 62
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.PAYDAY
  additional = true
}

export class AlolanMeowth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.ALOLAN_PERSIAN
  hp = 80
  atk = 7
  speed = 62
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.PICKUP
  regional = true
  additional = true
}

export class AlolanPersian extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 17
  speed = 62
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.PICKUP
  regional = true
  additional = true
}

export class Hoothoot extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.NOCTOWL
  hp = 75
  atk = 5
  speed = 47
  def = 4
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.HYPNOSIS
  additional = true
}

export class Noctowl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.FLYING,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 10
  speed = 47
  def = 6
  speDef = 10
  maxPP = 90
  range = 1
  skill = Ability.HYPNOSIS
  additional = true
}

export class Munchlax extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.GOURMET,
    Synergy.BABY
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SNORLAX
  hp = 120
  atk = 9
  speed = 35
  def = 4
  speDef = 4
  maxPP = 120
  range = 1
  skill = Ability.BODY_SLAM
  passive = Passive.GLUTTON
  additional = true
}

export class Snorlax extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.GOURMET,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 260
  atk = 21
  speed = 35
  def = 6
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.BODY_SLAM
  passive = Passive.GLUTTON
  additional = true
}

export class Poipole extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.BUG])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.NAGANADEL
  hp = 120
  atk = 10
  speed = 64
  def = 6
  speDef = 6
  maxPP = 75
  range = 1
  skill = Ability.FELL_STINGER
  passive = Passive.POISON_PIN

  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon) => pokemon.hp >= 200
  )
}

export class Naganadel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.POISON, Synergy.BUG])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 18
  speed = 64
  def = 6
  speDef = 6
  maxPP = 75
  range = 1
  skill = Ability.FELL_STINGER
  onAcquired(player: Player) {
    // cancel permanent stat buffs of Poipole
    // this is not perfect: see https://discord.com/channels/737230355039387749/1336313038617182209/1394408583046889522
    this.atk -= 18 - 10
    this.hp -= 200 - 120
  }
}

export class Growlithe extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARCANINE
  hp = 75
  atk = 5
  speed = 55
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.FIRE_FANG
  additional = true
}

export class Arcanine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 13
  speed = 55
  def = 10
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.FIRE_FANG
  additional = true
}

export class HisuiGrowlithe extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.ROCK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HISUI_ARCANINE
  hp = 75
  atk = 5
  speed = 54
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_EDGE
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GROWLITHE)) &&
      regionSynergies.includes(Synergy.ROCK)
    )
  }
}

export class HisuiArcanine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.ROCK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 11
  speed = 54
  def = 12
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_EDGE
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GROWLITHE)) &&
      regionSynergies.includes(Synergy.ROCK)
    )
  }
}

export class Smoochum extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.PSYCHIC, Synergy.BABY])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.JYNX
  hp = 60
  atk = 5
  speed = 55
  def = 2
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.LOVELY_KISS
  additional = true
}

export class Jynx extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 11
  speed = 55
  def = 6
  speDef = 8
  maxPP = 80
  range = 2
  skill = Ability.LOVELY_KISS
  additional = true
}

export class MimeJr extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.PSYCHIC, Synergy.BABY])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MR_MIME
  hp = 60
  atk = 5
  speed = 54
  def = 2
  speDef = 3
  maxPP = 80
  range = 2
  skill = Ability.MIMIC
  additional = true
}

export class MrMime extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.PSYCHIC,
    Synergy.HUMAN
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 11
  speed = 54
  def = 4
  speDef = 7
  maxPP = 80
  range = 2
  skill = Ability.MIMIC
  additional = true
}

export class Salandit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.POISON])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SALAZZLE
  hp = 70
  atk = 6
  speed = 63
  def = 4
  speDef = 4
  maxPP = 60
  range = 2
  skill = Ability.TOXIC
  additional = true
}

export class Salazzle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.POISON])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 14
  speed = 63
  def = 8
  speDef = 8
  maxPP = 60
  range = 2
  skill = Ability.TOXIC
  additional = true
}

export class Venonat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.VENOMOTH
  hp = 50
  atk = 6
  speed = 54
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.BUG_BUZZ
  additional = true
}

export class Venomoth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 10
  speed = 54
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.BUG_BUZZ
  additional = true
}

export class Voltorb extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ELECTRODE
  hp = 60
  atk = 7
  speed = 73
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.EXPLOSION
  additional = true
}

export class Electrode extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ARTIFICIAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  speed = 73
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.EXPLOSION
  additional = true
}

export class HisuiVoltorb extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.GRASS,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HISUI_ELECTRODE
  hp = 60
  atk = 7
  speed = 73
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.CHLOROBLAST
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.VOLTORB)) &&
      (regionSynergies.includes(Synergy.GRASS) ||
        regionSynergies.includes(Synergy.FOSSIL))
    )
  }
}

export class HisuiElectrode extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.GRASS,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  speed = 73
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.CHLOROBLAST
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.VOLTORB)) &&
      (regionSynergies.includes(Synergy.GRASS) ||
        regionSynergies.includes(Synergy.FOSSIL))
    )
  }
}

export class Slugma extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MAGCARGO
  hp = 70
  atk = 7
  speed = 35
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.LAVA_PLUME
  additional = true
}

export class Magcargo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIRE,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 16
  speed = 35
  def = 16
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.LAVA_PLUME
  additional = true
}

export class Sneasel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.DARK, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.WEAVILE
  hp = 85
  atk = 8
  speed = 65
  def = 2
  speDef = 6
  maxPP = 40
  range = 1
  skill = Ability.SLASHING_CLAW
  additional = true
}

export class Weavile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.DARK, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 22
  speed = 65
  def = 4
  speDef = 6
  maxPP = 40
  range = 1
  skill = Ability.SLASHING_CLAW
  additional = true
}

export class HisuiSneasel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIGHTING,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SNEASLER
  hp = 85
  atk = 8
  speed = 63
  def = 2
  speDef = 6
  maxPP = 50
  range = 1
  skill = Ability.DIRE_CLAW
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.SNEASEL)) &&
      (regionSynergies.includes(Synergy.FIGHTING) ||
        regionSynergies.includes(Synergy.POISON))
    )
  }
}

export class Sneasler extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIGHTING,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 19
  speed = 63
  def = 4
  speDef = 6
  maxPP = 50
  range = 1
  skill = Ability.DIRE_CLAW
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.SNEASEL)) &&
      (regionSynergies.includes(Synergy.FIGHTING) ||
        regionSynergies.includes(Synergy.POISON))
    )
  }
}

export class Seel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.DEWGONG
  hp = 80
  atk = 7
  speed = 47
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.AURORA_BEAM
  additional = true
}

export class Dewgong extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 16
  speed = 47
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.AURORA_BEAM
  additional = true
}

export class Croagunk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIGHTING,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.TOXICROAK
  hp = 75
  atk = 6
  speed = 52
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.CROSS_POISON
  additional = true
}

export class Toxicroak extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIGHTING,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 13
  speed = 52
  def = 8
  speDef = 8
  maxPP = 85
  range = 1
  skill = Ability.CROSS_POISON
  additional = true
}
export class Chinchou extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.LANTURN
  hp = 60
  atk = 7
  speed = 43
  def = 4
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.ELECTRO_BALL
  additional = true
}

export class Lanturn extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 16
  speed = 43
  def = 6
  speDef = 10
  maxPP = 100
  range = 2
  skill = Ability.ELECTRO_BALL
  additional = true
}
export class Poochyena extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MIGHTYENA
  hp = 80
  atk = 9
  speed = 47
  def = 4
  speDef = 4
  maxPP = 75
  range = 1
  skill = Ability.GROWL
}

export class Mightyena extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 19
  speed = 47
  def = 8
  speDef = 8
  maxPP = 75
  range = 1
  skill = Ability.GROWL
}

export class Bronzor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.BRONZONG
  hp = 100
  atk = 6
  speed = 36
  def = 12
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.DEFENSE_CURL
  additional = true
}

export class Bronzong extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.PSYCHIC,
    Synergy.SOUND
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 12
  speed = 36
  def = 18
  speDef = 14
  maxPP = 80
  range = 1
  skill = Ability.DEFENSE_CURL
  additional = true
}

export class Drifloon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FLYING,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.DRIFBLIM
  hp = 100
  atk = 5
  speed = 51
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.TAILWIND
  additional = true
}

export class Drifblim extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FLYING,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 250
  atk = 9
  speed = 51
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.TAILWIND
  additional = true
}

export class Shroomish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.BRELOOM
  hp = 70
  atk = 7
  speed = 47
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.LEECH_SEED
  additional = true
}

export class Breloom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 18
  speed = 47
  def = 6
  speDef = 6
  maxPP = 85
  range = 1
  skill = Ability.LEECH_SEED
  additional = true
}
export class Tentacool extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.POISON
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.TENTACRUEL
  hp = 65
  atk = 4
  speed = 57
  def = 4
  speDef = 8
  maxPP = 85
  range = 1
  skill = Ability.TOXIC
  additional = true
}

export class Tentacruel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.AQUATIC,
    Synergy.POISON
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 9
  speed = 57
  def = 6
  speDef = 14
  maxPP = 85
  range = 1
  skill = Ability.TOXIC
  additional = true
}

export class Snubull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GRANBULL
  hp = 115
  atk = 13
  speed = 39
  def = 8
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.ROAR
  additional = true
}

export class Granbull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  hp = 265
  atk = 30
  speed = 39
  def = 12
  speDef = 6
  maxPP = 70
  range = 1
  skill = Ability.ROAR
  additional = true
}

const evolveMothim = function (params: {
  this: Pokemon
  pokemonEvolved: Pokemon
  pokemonsBeforeEvolution: Pokemon[]
  player: Player
}) {
  const preEvolve = params.pokemonsBeforeEvolution.at(-1)
  if (preEvolve instanceof WormadamTrash) {
    params.pokemonEvolved.types.add(Synergy.ARTIFICIAL)
  } else if (preEvolve instanceof WormadamSandy) {
    params.pokemonEvolved.types.add(Synergy.GROUND)
  } else if (preEvolve instanceof WormadamPlant) {
    params.pokemonEvolved.types.add(Synergy.GRASS)
  }
}

export class TypeNull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ARTIFICIAL])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.SILVALLY
  evolutionRule = new ItemEvolutionRule([...SynergyItems])
  hp = 200
  atk = 15
  speed = 55
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.HEAD_SMASH
  passive = Passive.TYPE_NULL
}

export class Silvally extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ARTIFICIAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 260
  atk = 18
  speed = 55
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.MULTI_ATTACK
  passive = Passive.RKS_SYSTEM
  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state, true)
    if (y === 0) {
      const itemsToRemove = values(this.items).filter((item) => {
        return (
          RemovableItems.includes(item) ||
          (state?.specialGameRule === SpecialGameRule.SLAMINGO &&
            item !== Item.RARE_CANDY) ||
          (SynergyItems as ReadonlyArray<Item>).includes(item)
        )
      })
      player.items.push(...itemsToRemove)
      this.removeItems(itemsToRemove, player)
    }
  }
  onItemRemoved(item: Item, player: Player) {
    if (
      (SynergyItems as ReadonlyArray<Item>).includes(item) &&
      values(this.items).filter((item) =>
        (SynergyItems as ReadonlyArray<Item>).includes(item)
      ).length === 0 &&
      player.getPokemonAt(this.positionX, this.positionY)?.name === Pkm.SILVALLY
    ) {
      player.transformPokemon(this, Pkm.TYPE_NULL)
    }
  }
}

export class Applin extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GOURMET,
    Synergy.GRASS
  ])
  rarity = Rarity.UNIQUE
  stars = 2
  evolutions = [Pkm.APPLETUN, Pkm.FLAPPLE, Pkm.DIPPLIN]
  evolutionRule = new ItemEvolutionRule(
    [Item.SWEET_APPLE, Item.TART_APPLE, Item.SIRUPY_APPLE],
    (pokemon, player, item_) => {
      const item = item_ as
        | Item.SWEET_APPLE
        | Item.TART_APPLE
        | Item.SIRUPY_APPLE
      if (item === Item.SWEET_APPLE) {
        return Pkm.APPLETUN
      }
      if (item === Item.TART_APPLE) {
        return Pkm.FLAPPLE
      }
      return Pkm.DIPPLIN
    }
  )
  hp = 160
  atk = 12
  speed = 31
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.NUTRIENTS
  passive = Passive.APPLIN
}

export class Dipplin extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GOURMET,
    Synergy.GRASS
  ])
  rarity = Rarity.UNIQUE
  evolution = Pkm.HYDRAPPLE
  evolutionRule = new ItemEvolutionRule([Item.SIRUPY_APPLE])
  stars = 3
  hp = 180
  atk = 14
  speed = 31
  def = 8
  speDef = 8
  maxPP = 60
  range = 3
  skill = Ability.SYRUP_BOMB
  passive = Passive.DIPPLIN

  onAcquired() {
    this.meal = "" // consume meal to evolve
    this.items.delete(Item.SIRUPY_APPLE)
  }
}

export class Appletun extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GOURMET,
    Synergy.GRASS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 15
  speed = 31
  def = 12
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.APPLE_ACID

  onAcquired() {
    this.meal = "" // consume meal to evolve
    this.items.delete(Item.SWEET_APPLE)
  }
}

export class Flapple extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GOURMET,
    Synergy.GRASS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 19
  speed = 50
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.GRAV_APPLE

  onAcquired() {
    this.meal = "" // consume meal to evolve
    this.items.delete(Item.TART_APPLE)
  }
}

export class Hydrapple extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.GOURMET,
    Synergy.GRASS
  ])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 170
  atk = 21
  speed = 31
  def = 4
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.FICKLE_BEAM

  onAcquired() {
    this.meal = "" // consume meal to evolve
    this.items.delete(Item.SIRUPY_APPLE)
  }
}

export class Staryu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.STARMIE
  hp = 80
  atk = 6
  speed = 62
  def = 4
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.PSYBEAM
  additional = true
}

export class Starmie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 17
  speed = 62
  def = 8
  speDef = 12
  maxPP = 100
  range = 2
  skill = Ability.PSYBEAM
  additional = true
}

export class Vulpix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.NINETALES
  hp = 75
  atk = 6
  speed = 57
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.FIRE_SPIN
  additional = true
}

export class Ninetales extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 18
  speed = 57
  def = 6
  speDef = 10
  maxPP = 80
  range = 2
  skill = Ability.FIRE_SPIN
  additional = true
}

export class AlolanVulpix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FAIRY])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.ALOLAN_NINETALES
  hp = 75
  atk = 6
  speed = 60
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.AURORA_VEIL
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.VULPIX)) &&
      (regionSynergies.includes(Synergy.ICE) ||
        regionSynergies.includes(Synergy.FAIRY))
    )
  }
}

export class AlolanNinetales extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FAIRY])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 17
  speed = 60
  def = 10
  speDef = 10
  maxPP = 80
  range = 2
  skill = Ability.AURORA_VEIL
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.VULPIX)) &&
      (regionSynergies.includes(Synergy.ICE) ||
        regionSynergies.includes(Synergy.FAIRY))
    )
  }
}

export class Snom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ICE])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.FROSMOTH
  hp = 70
  atk = 8
  speed = 46
  def = 4
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.BUG_BUZZ
  additional = true
}

export class Frosmoth extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ICE])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 20
  speed = 46
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.BUG_BUZZ
  additional = true
}

export class Wailmer extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.WAILORD
  hp = 180
  atk = 6
  speed = 44
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DIVE
  additional = true
}

export class Wailord extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.EPIC
  stars = 2
  hp = 400
  atk = 11
  speed = 44
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DIVE
  additional = true
}

export class Dreepy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.DRAKLOAK
  evolutionRule = new HatchEvolutionRule()
  hp = 90
  atk = 5
  speed = 71
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.DRAGON_DARTS
  passive = Passive.HATCH
}

export class Drakloak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.DRAGAPULT
  evolutionRule = new HatchEvolutionRule()
  hp = 140
  atk = 12
  speed = 71
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.DRAGON_DARTS
  passive = Passive.HATCH
}

export class Dragapult extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 21
  speed = 71
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.DRAGON_DARTS
}

export class Snivy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIELD])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.SERVINE
  evolutionRule = new HatchEvolutionRule()
  hp = 90
  atk = 4
  speed = 61
  def = 2
  speDef = 2
  maxPP = 70
  range = 3
  skill = Ability.MAGICAL_LEAF
  passive = Passive.HATCH
}

export class Servine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIELD])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.SERPERIOR
  evolutionRule = new HatchEvolutionRule()
  hp = 160
  atk = 11
  speed = 61
  def = 2
  speDef = 2
  maxPP = 70
  range = 3
  skill = Ability.MAGICAL_LEAF
  passive = Passive.HATCH
}

export class Serperior extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIELD])
  rarity = Rarity.HATCH
  stars = 3
  hp = 240
  atk = 21
  speed = 61
  def = 2
  speDef = 2
  maxPP = 70
  range = 3
  skill = Ability.MAGICAL_LEAF
}

export class Starly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.STARAVIA
  hp = 65
  atk = 5
  speed = 57
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.BRAVE_BIRD
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 1
  }
}

export class Staravia extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.STARAPTOR
  hp = 120
  atk = 9
  speed = 57
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.BRAVE_BIRD
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 1
  }
}

export class Staraptor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 19
  speed = 57
  def = 7
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.BRAVE_BIRD
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 1
  }
}

export class Scorbunny extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.RABOOT
  evolutionRule = new HatchEvolutionRule()
  hp = 75
  atk = 5
  speed = 63
  def = 4
  speDef = 4
  maxPP = 50
  range = 2
  skill = Ability.PYRO_BALL
  passive = Passive.HATCH
}

export class Raboot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.CINDERACE
  evolutionRule = new HatchEvolutionRule()
  hp = 130
  atk = 10
  speed = 63
  def = 6
  speDef = 6
  maxPP = 50
  range = 2
  skill = Ability.PYRO_BALL
  passive = Passive.HATCH
}

export class Cinderace extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.FIELD, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 3
  hp = 180
  atk = 17
  speed = 63
  def = 9
  speDef = 9
  maxPP = 50
  range = 2
  skill = Ability.PYRO_BALL
}

export class AlolanGeodude extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.ALOLAN_GRAVELER
  hp = 70
  atk = 4
  speed = 39
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.ELECTRIC)
  }
}

export class AlolanGraveler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.ALOLAN_GOLEM
  hp = 120
  atk = 10
  speed = 39
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.ELECTRIC)
  }
}

export class AlolanGolem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.ROCK])
  rarity = Rarity.COMMON
  stars = 3
  hp = 200
  atk = 17
  speed = 39
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.DISCHARGE
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.ELECTRIC)
  }
}

export class Popplio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.BRIONNE
  evolutionRule = new HatchEvolutionRule()
  hp = 65
  atk = 5
  speed = 44
  def = 4
  speDef = 4
  maxPP = 70
  range = 3
  skill = Ability.SPARKLING_ARIA
  passive = Passive.HATCH
}

export class Brionne extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.PRIMARINA
  evolutionRule = new HatchEvolutionRule()
  hp = 130
  atk = 10
  speed = 44
  def = 4
  speDef = 6
  maxPP = 70
  range = 3
  skill = Ability.SPARKLING_ARIA
  passive = Passive.HATCH
}

export class Primarina extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 20
  speed = 44
  def = 4
  speDef = 8
  maxPP = 70
  range = 3
  skill = Ability.SPARKLING_ARIA
}

export class Gothita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.GOTHORITA
  evolutionRule = new HatchEvolutionRule()
  hp = 70
  atk = 5
  speed = 46
  def = 2
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.FAKE_TEARS
  passive = Passive.HATCH
}

export class Gothorita extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.GOTHITELLE
  evolutionRule = new HatchEvolutionRule()
  hp = 120
  atk = 12
  speed = 46
  def = 4
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.FAKE_TEARS
  passive = Passive.HATCH
}

export class Gothitelle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.HUMAN])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 20
  speed = 46
  def = 6
  speDef = 8
  maxPP = 80
  range = 3
  skill = Ability.FAKE_TEARS
}

export class Sandshrew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SANDSLASH
  hp = 90
  atk = 5
  speed = 46
  def = 6
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.ROLLOUT
  additional = true
}

export class Sandslash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 13
  speed = 46
  def = 10
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.ROLLOUT
  additional = true
}

export class AlolanSandshrew extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ALOLAN_SANDSLASH
  hp = 90
  atk = 5
  speed = 46
  def = 6
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.ICE_BALL
  additional = true
  regional = true
}

export class AlolanSandslash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 13
  speed = 46
  def = 10
  speDef = 5
  maxPP = 80
  range = 1
  skill = Ability.ICE_BALL
  additional = true
  regional = true
}

export class Nosepass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.PROBOPASS
  hp = 70
  atk = 5
  speed = 38
  def = 6
  speDef = 6
  maxPP = 90
  range = 2
  skill = Ability.MAGNET_RISE
  additional = true
}

export class Probopass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 11
  speed = 38
  def = 16
  speDef = 16
  maxPP = 90
  range = 2
  skill = Ability.MAGNET_RISE
  additional = true
}

export class Woobat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLYING,
    Synergy.SOUND,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SWOOBAT
  hp = 60
  atk = 4
  speed = 62
  def = 2
  speDef = 2
  maxPP = 90
  range = 3
  skill = Ability.ATTRACT
  additional = true
}

export class Swoobat extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLYING,
    Synergy.SOUND,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 10
  speed = 62
  def = 4
  speDef = 4
  maxPP = 90
  range = 3
  skill = Ability.ATTRACT
  additional = true
}

export class Pineco extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.FORRETRESS
  hp = 75
  atk = 5
  speed = 38
  def = 10
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.EXPLOSION
  additional = true
}

export class Forretress extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 200
  atk = 9
  speed = 38
  def = 14
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.EXPLOSION
  additional = true
}

export class UnownA extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 90
  range = 9
  skill = Ability.HIDDEN_POWER_A
  passive = Passive.UNOWN
  canHoldItems = false
}
export class UnownB extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 60
  range = 9
  skill = Ability.HIDDEN_POWER_B
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownC extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 60
  range = 9
  skill = Ability.HIDDEN_POWER_C
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownD extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_D
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownE extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_E
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownF extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_F
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownG extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_G
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownH extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 80
  range = 9
  skill = Ability.HIDDEN_POWER_H
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownI extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_I
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownJ extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 90
  range = 9
  skill = Ability.HIDDEN_POWER_J
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownK extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 90
  range = 9
  skill = Ability.HIDDEN_POWER_K
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownL extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 60
  range = 9
  skill = Ability.HIDDEN_POWER_L
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownM extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 50
  range = 9
  skill = Ability.HIDDEN_POWER_M
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownN extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_N
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownO extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 50
  range = 9
  skill = Ability.HIDDEN_POWER_O
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownP extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_P
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownQ extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 200
  range = 9
  skill = Ability.HIDDEN_POWER_Q
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownR extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 90
  range = 9
  skill = Ability.HIDDEN_POWER_R
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownS extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_S
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownT extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 80
  range = 9
  skill = Ability.HIDDEN_POWER_T
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownU extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 80
  range = 9
  skill = Ability.HIDDEN_POWER_U
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownV extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 90
  range = 9
  skill = Ability.HIDDEN_POWER_V
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownW extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_W
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownX extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 60
  range = 9
  skill = Ability.HIDDEN_POWER_X
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownY extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_Y
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownZ extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 90
  range = 9
  skill = Ability.HIDDEN_POWER_Z
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownQuestion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 100
  range = 9
  skill = Ability.HIDDEN_POWER_QM
  passive = Passive.UNOWN
  canHoldItems = false
}

export class UnownExclamation extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 1
  speed = 40
  def = 2
  speDef = 2
  maxPP = 60
  range = 9
  skill = Ability.HIDDEN_POWER_EM
  passive = Passive.UNOWN
  canHoldItems = false
}

export class Diglett extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.DUGTRIO
  hp = 75
  atk = 5
  speed = 63
  def = 6
  speDef = 4
  maxPP = 50
  range = 1
  skill = Ability.DIG
  additional = true
}

export class Dugtrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 12
  speed = 63
  def = 10
  speDef = 8
  maxPP = 50
  range = 1
  skill = Ability.DIG
  additional = true
}

export class AlolanDiglett extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ALOLAN_DUGTRIO
  hp = 70
  atk = 7
  speed = 60
  def = 4
  speDef = 2
  maxPP = 50
  range = 1
  skill = Ability.DIG
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.DIGLETT)) &&
      regionSynergies.includes(Synergy.STEEL)
    )
  }
}

export class AlolanDugtrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 16
  speed = 60
  def = 6
  speDef = 4
  maxPP = 50
  range = 1
  skill = Ability.DIG
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.DIGLETT)) &&
      regionSynergies.includes(Synergy.STEEL)
    )
  }
}

export class Rowlet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLYING, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.DARTIX
  evolutionRule = new HatchEvolutionRule()
  hp = 70
  atk = 5
  speed = 47
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.SPIRIT_SHACKLE
  passive = Passive.HATCH
}

export class Dartix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLYING, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.DECIDUEYE
  evolutionRule = new HatchEvolutionRule()
  hp = 130
  atk = 9
  speed = 47
  def = 4
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.SPIRIT_SHACKLE
  passive = Passive.HATCH
}

export class Decidueye extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLYING, Synergy.GHOST])
  rarity = Rarity.HATCH
  stars = 3
  hp = 190
  atk = 18
  speed = 47
  def = 4
  speDef = 8
  maxPP = 100
  range = 3
  skill = Ability.SPIRIT_SHACKLE
}

export class Zorua extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ZOROARK
  hp = 70
  atk = 7
  speed = 59
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  additional = true
}

export class Zoroark extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 16
  speed = 59
  def = 8
  speDef = 8
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  additional = true
}

export class HisuiZorua extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.HISUI_ZOROARK
  hp = 70
  atk = 7
  speed = 60
  def = 4
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.ZORUA)) &&
      regionSynergies.includes(Synergy.GHOST)
    )
  }
}

export class HisuiZoroark extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GHOST])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 16
  speed = 60
  def = 8
  speDef = 8
  maxPP = 85
  range = 1
  skill = Ability.ILLUSION
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.ZORUA)) &&
      regionSynergies.includes(Synergy.GHOST)
    )
  }
}

export class Grimer extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.MONSTER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MUK
  hp = 80
  atk = 4
  speed = 41
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  additional = true
}

export class Muk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.MONSTER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 9
  speed = 41
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  additional = true
}

export class AlolanGrimer extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.DARK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ALOLAN_MUK
  hp = 70
  atk = 6
  speed = 41
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GRIMER)) &&
      regionSynergies.includes(Synergy.DARK)
    )
  }
}

export class AlolanMuk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.DARK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  speed = 41
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SLUDGE
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.GRIMER)) &&
      regionSynergies.includes(Synergy.DARK)
    )
  }
}

export class Ekans extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARBOK
  hp = 60
  atk = 8
  speed = 51
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  additional = true
}

export class Arbok extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 17
  speed = 51
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.VENOSHOCK
  additional = true
}

export class Carvanha extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SHARPEDO
  hp = 85
  atk = 11
  speed = 55
  def = 2
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.BITE
  additional = true
}

export class Sharpedo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 26
  speed = 55
  def = 4
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.BITE
  additional = true
}

export class Froakie extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.FROGADIER
  evolutionRule = new HatchEvolutionRule()
  hp = 80
  atk = 6
  speed = 64
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.WATER_SHURIKEN
  passive = Passive.HATCH
}

export class Frogadier extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.GRENINJA
  evolutionRule = new HatchEvolutionRule()
  hp = 140
  atk = 12
  speed = 64
  def = 6
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.WATER_SHURIKEN
  passive = Passive.HATCH
}

export class Greninja extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC, Synergy.DARK])
  rarity = Rarity.HATCH
  stars = 3
  hp = 200
  atk = 19
  speed = 64
  def = 8
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.WATER_SHURIKEN
}

export class Chingling extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.PSYCHIC, Synergy.BABY])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.CHIMECHO
  evolutionRule = new ItemEvolutionRule([Item.STAR_DUST])
  hp = 150
  atk = 10
  speed = 46
  def = 7
  speDef = 8
  maxPP = 70
  range = 3
  skill = Ability.ECHO
  passive = Passive.CHINGLING
}

export class Chimecho extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  speed = 46
  def = 10
  speDef = 12
  maxPP = 70
  range = 3
  skill = Ability.ECHO
  passive = Passive.CHIMECHO
}

export class Tyrogue extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIGHTING,
    Synergy.HUMAN,
    Synergy.BABY
  ])
  rarity = Rarity.UNIQUE
  stars = 2
  hp = 150
  atk = 11
  speed = 36
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MACH_PUNCH
  passive = Passive.TYROGUE
  evolutions = [Pkm.HITMONTOP, Pkm.HITMONLEE, Pkm.HITMONCHAN]
  evolutionRule = new ItemEvolutionRule(AllItems, (pokemon, player, item_) => {
    const item = item_ as Item
    if (
      item === Item.CHARCOAL ||
      item === Item.MAGNET ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.CHARCOAL)) ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.MAGNET))
    ) {
      return Pkm.HITMONLEE
    }

    if (
      item === Item.HEART_SCALE ||
      item === Item.NEVER_MELT_ICE ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.HEART_SCALE)) ||
      (item in ItemRecipe && ItemRecipe[item]!.includes(Item.NEVER_MELT_ICE))
    ) {
      return Pkm.HITMONCHAN
    }

    return Pkm.HITMONTOP
  })
}

export class Hitmontop extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 22
  speed = 45
  def = 10
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.TRIPLE_KICK
}

export class Hitmonlee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 26
  speed = 56
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MAWASHI_GERI
}

export class Hitmonchan extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 22
  speed = 49
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.MEGA_PUNCH
}

export class Mimikyu extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FAIRY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 14
  speed = 56
  def = 10
  speDef = 12
  maxPP = 40
  range = 1
  skill = Ability.SHADOW_SNEAK
  passive = Passive.MIMIKYU
}

export class MimikyuBusted extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FAIRY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 23
  speed = 56
  def = 10
  speDef = 12
  maxPP = 40
  range = 1
  skill = Ability.SHADOW_SNEAK
  passive = Passive.MIMIKYU_BUSTED
}

export class Bonsley extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLORA, Synergy.BABY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SUDOWOODO
  hp = 125
  atk = 9
  speed = 35
  def = 10
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.WOOD_HAMMER
  passive = Passive.SUDOWOODO
  additional = true
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.toIdleState()
  }
}

export class Sudowoodo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.FLORA, Synergy.MONSTER])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 22
  speed = 35
  def = 12
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.WOOD_HAMMER
  passive = Passive.SUDOWOODO
  additional = true
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.toIdleState()
  }
}

export class Combee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLORA, Synergy.GOURMET])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.VESPIQUEEN
  hp = 80
  atk = 10
  speed = 38
  def = 5
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.HEAL_ORDER
  additional = true
}

export class Vespiqueen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLORA, Synergy.GOURMET])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 20
  speed = 38
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.HEAL_ORDER
  additional = true
}

export class Shuckle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ROCK, Synergy.GOURMET])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 5
  speed = 27
  def = 40
  speDef = 40
  maxPP = 90
  range = 1
  skill = Ability.BIDE
}

export class Tepig extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIGHTING])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.PIGNITE
  evolutionRule = new HatchEvolutionRule()
  hp = 70
  atk = 7
  speed = 46
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HEAT_CRASH
  passive = Passive.HATCH
}

export class Pignite extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIGHTING])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.EMBOAR
  evolutionRule = new HatchEvolutionRule()
  hp = 140
  atk = 12
  speed = 46
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.HEAT_CRASH
  passive = Passive.HATCH
}

export class Emboar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.FIGHTING])
  rarity = Rarity.HATCH
  stars = 3
  hp = 210
  atk = 20
  speed = 46
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.HEAT_CRASH
}

export class Wurmple extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG])
  rarity = Rarity.EPIC
  stars = 1
  hp = 110
  atk = 12
  speed = 31
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.ENTANGLING_THREAD
  evolutions = [Pkm.SILCOON, Pkm.CASCOON]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (player.regionalPokemons.includes(Pkm.CASCOON)) return Pkm.CASCOON
      else return Pkm.SILCOON
    }
  )
}

export class Silcoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.BEAUTIFLY
  hp = 200
  atk = 23
  speed = 20
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.SPIKY_SHIELD
}

export class Beautifly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 3
  hp = 250
  atk = 35
  speed = 42
  def = 12
  speDef = 12
  maxPP = 60
  range = 1
  skill = Ability.SILVER_WIND
}

export class Cascoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.DUSTOX
  hp = 200
  atk = 23
  speed = 20
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.SPIKY_SHIELD
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.POISON)
  }
}

export class Dustox extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 3
  hp = 250
  atk = 35
  speed = 42
  def = 12
  speDef = 12
  maxPP = 60
  range = 1
  skill = Ability.POISON_POWDER
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.POISON)
  }
}

export class Tinkatink extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.TINKATUFF
  hp = 100
  atk = 10
  speed = 55
  def = 6
  speDef = 6
  maxPP = 120
  range = 1
  skill = Ability.GIGATON_HAMMER
}

export class Tinkatuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.TINKATON
  hp = 200
  atk = 20
  speed = 55
  def = 8
  speDef = 8
  maxPP = 120
  range = 1
  skill = Ability.GIGATON_HAMMER
}

export class Tinkaton extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FAIRY])
  rarity = Rarity.EPIC
  stars = 3
  hp = 300
  atk = 40
  speed = 55
  def = 16
  speDef = 16
  maxPP = 120
  range = 1
  skill = Ability.GIGATON_HAMMER
}

export class Maractus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.SOUND, Synergy.FLORA])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  speed = 44
  def = 12
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.SPIKY_SHIELD
}

export class Plusle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 140
  atk = 12
  speed = 61
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.LINK_CABLE
}

export class Minun extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 140
  atk = 12
  speed = 61
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.LINK_CABLE
}

export class Spectrier extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.FIELD])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 280
  atk = 25
  speed = 67
  def = 10
  speDef = 20
  maxPP = 80
  range = 1
  skill = Ability.ASTRAL_BARRAGE
  passive = Passive.GRIM_NEIGH
}

export class Kartana extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.GRASS])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 35
  speed = 60
  def = 20
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.LEAF_BLADE
  passive = Passive.BEAST_BOOST_ATK
}

export class Dhelmise extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.GHOST, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 19
  speed = 38
  def = 10
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.ANCHOR_SHOT
}

export class Tropius extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.GOURMET,
    Synergy.FLYING
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 41
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.AIR_SLASH
}

export class Carnivine extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.MONSTER,
    Synergy.GRASS,
    Synergy.FLORA
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 21
  speed = 40
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.VINE_WHIP
}

export class Sableye extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  evolutionRule = new ItemEvolutionRule([Item.RED_ORB])
  evolution = Pkm.MEGA_SABLEYE
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 13
  speed = 41
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.KNOCK_OFF
  passive = Passive.SABLEYE
}

export class MegaSableye extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 200
  atk = 13
  speed = 31
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.KNOCK_OFF
  passive = Passive.MEGA_SABLEYE
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.triggerRuneProtect(60000)
  }
}

export class Koffing extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.ARTIFICIAL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.WEEZING
  hp = 70
  atk = 5
  speed = 44
  def = 6
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.SMOG
  additional = true
}

export class Weezing extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.ARTIFICIAL,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 170
  atk = 10
  speed = 44
  def = 10
  speDef = 10
  maxPP = 60
  range = 1
  skill = Ability.SMOG
  additional = true
}

export class Clauncher extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CLAWITZER
  hp = 80
  atk = 7
  speed = 44
  def = 2
  speDef = 2
  maxPP = 180
  range = 4
  skill = Ability.WATER_PULSE
  passive = Passive.MEGA_LAUNCHER
  additional = true
}

export class Clawitzer extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 19
  speed = 44
  def = 6
  speDef = 4
  maxPP = 180
  range = 4
  skill = Ability.WATER_PULSE
  passive = Passive.MEGA_LAUNCHER
  additional = true
}

export class Yanma extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FOSSIL, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.YANMEGA
  hp = 70
  atk = 8
  speed = 55
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.AERIAL_ACE
  passive = Passive.CLEAR_WING
  additional = true
}

export class Yanmega extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FOSSIL, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 160
  atk = 15
  speed = 55
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.AERIAL_ACE
  passive = Passive.CLEAR_WING
  additional = true
}

class DrySkinEffect extends PeriodicEffect {
  constructor() {
    super(
      (pokemon) => {
        pokemon.handleHeal(8, pokemon, 0, false)
      },
      Passive.DRY_SKIN,
      1000
    )
  }
}

export class Helioptile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HELIOLISK
  hp = 75
  atk = 8
  speed = 60
  def = 4
  speDef = 4
  maxPP = 80
  range = 3
  skill = Ability.PARABOLIC_CHARGE
  passive = Passive.DRY_SKIN
  additional = true
  onSpawn({
    entity,
    simulation
  }: {
    entity: IPokemonEntity
    simulation: Simulation
  }) {
    if (simulation.weather === Weather.RAIN) {
      entity.effectsSet.add(new DrySkinEffect())
    } else if (simulation.weather === Weather.SANDSTORM) {
      entity.addDodgeChance(0.25, entity, 0, false)
    } else if (simulation.weather === Weather.SUN) {
      entity.addAbilityPower(50, entity, 0, false)
    }
  }
}

export class Heliolisk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.ELECTRIC,
    Synergy.LIGHT
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 170
  atk = 19
  speed = 60
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.PARABOLIC_CHARGE
  passive = Passive.DRY_SKIN
  additional = true
  onSpawn({
    entity,
    simulation
  }: {
    entity: IPokemonEntity
    simulation: Simulation
  }) {
    if (simulation.weather === Weather.RAIN) {
      entity.effectsSet.add(new DrySkinEffect())
    } else if (simulation.weather === Weather.SANDSTORM) {
      entity.addDodgeChance(0.25, entity, 0, false)
    } else if (simulation.weather === Weather.SUN) {
      entity.addAbilityPower(50, entity, 0, false)
    }
  }
}

export class Exeggcute extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.PSYCHIC])
  rarity = Rarity.EPIC
  stars = 1
  evolutions = [Pkm.EXEGGUTOR, Pkm.ALOLAN_EXEGGUTOR]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (player.regionalPokemons.includes(Pkm.ALOLAN_EXEGGUTOR))
        return Pkm.ALOLAN_EXEGGUTOR
      else return Pkm.EXEGGUTOR
    }
  )
  hp = 110
  atk = 9
  speed = 38
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.EGG_BOMB
  additional = true
}

export class Exeggutor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.PSYCHIC])
  rarity = Rarity.EPIC
  stars = 2
  hp = 300
  atk = 22
  speed = 38
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.EGG_BOMB
  additional = true
}

export class AlolanExeggutor extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.FLORA,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 350
  atk = 26
  speed = 38
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.EGG_BOMB
  regional = true
  additional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.EXEGGCUTE)) &&
      regionSynergies.includes(Synergy.DRAGON)
    )
  }
}

export class Bidoof extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.BIBAREL
  hp = 65
  atk = 7
  speed = 48
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.SUPER_FANG
  additional = true
}

export class Bibarel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.AQUATIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 16
  speed = 48
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.SUPER_FANG
  additional = true
}

export class Spinda extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GOURMET])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  speed = 44
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.TEETER_DANCE
  passive = Passive.SPOT_PANDA
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.effects.add(EffectEnum.IMMUNITY_CONFUSION)
  }
}

export class Baltoy extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.PSYCHIC,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.CLAYDOL
  hp = 80
  atk = 8
  speed = 49
  def = 8
  speDef = 8
  maxPP = 70
  range = 2
  skill = Ability.CONFUSION
  additional = true
}

export class Claydol extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.PSYCHIC,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 15
  speed = 49
  def = 12
  speDef = 12
  maxPP = 70
  range = 2
  skill = Ability.CONFUSION
  additional = true
}

export class Purrloin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.LIEPARD
  hp = 70
  atk = 7
  speed = 59
  def = 3
  speDef = 3
  maxPP = 90
  range = 1
  skill = Ability.FAKE_OUT
  additional = true
}

export class Liepard extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 19
  speed = 59
  def = 5
  speDef = 5
  maxPP = 90
  range = 1
  skill = Ability.FAKE_OUT
  additional = true
}

export class Pancham extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PANGORO
  hp = 80
  atk = 8
  speed = 42
  def = 6
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.ARM_THRUST
  passive = Passive.PARTING_SHOT
  additional = true
}

export class Pangoro extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  hp = 210
  atk = 22
  speed = 42
  def = 8
  speDef = 7
  maxPP = 100
  range = 1
  skill = Ability.ARM_THRUST
  passive = Passive.PARTING_SHOT
  additional = true
}

export class Barboach extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.WHISCASH
  hp = 120
  atk = 9
  speed = 44
  def = 6
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.FISSURE
  passive = Passive.AQUA_VEIL
  additional = true
  onSpawn({
    entity,
    simulation
  }: {
    entity: IPokemonEntity
    simulation: Simulation
  }) {
    if (simulation.weather === Weather.RAIN) {
      entity.status.triggerRuneProtect(60000)
    }
  }
}

export class Whiscash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.GROUND])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 22
  speed = 44
  def = 8
  speDef = 10
  maxPP = 90
  range = 1
  skill = Ability.FISSURE
  passive = Passive.AQUA_VEIL
  additional = true
  onSpawn({
    entity,
    simulation
  }: {
    entity: IPokemonEntity
    simulation: Simulation
  }) {
    if (simulation.weather === Weather.RAIN) {
      entity.status.triggerRuneProtect(60000)
    }
  }
}

export class Scraggy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SCRAFTY
  hp = 70
  atk = 8
  speed = 44
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.ASSURANCE
  passive = Passive.MOXIE
  additional = true
}

export class Scrafty extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FIGHTING])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 18
  speed = 44
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.ASSURANCE
  passive = Passive.MOXIE
  additional = true
}

export class Finneon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LUMINEON
  hp = 80
  atk = 6
  speed = 54
  def = 4
  speDef = 4
  maxPP = 85
  range = 2
  skill = Ability.AQUA_RING
  additional = true
}

export class Lumineon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 17
  speed = 54
  def = 8
  speDef = 8
  maxPP = 85
  range = 2
  skill = Ability.AQUA_RING
  additional = true
}

export class Stunky extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.POISON])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SKUNTANK
  hp = 125
  atk = 9
  speed = 52
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.POISON_GAS
  passive = Passive.STENCH
  additional = true
}

export class Skuntank extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.POISON])
  rarity = Rarity.EPIC
  stars = 2
  hp = 280
  atk = 21
  speed = 52
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.POISON_GAS
  passive = Passive.STENCH
  additional = true
}

export class Illumise extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.BUG, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 130
  atk = 12
  speed = 52
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.STRUGGLE_BUG
  passive = Passive.ILLUMISE_VOLBEAT
}

export class Volbeat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.BUG, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 130
  atk = 12
  speed = 52
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.TAIL_GLOW
  passive = Passive.ILLUMISE_VOLBEAT
}

export class Necrozma extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.LIGHT, Synergy.PSYCHIC])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 29
  speed = 50
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.PRISMATIC_LASER
  passive = Passive.PRISM

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (
      (x === player.lightX && y === player.lightY && hasLight) ||
      this.items.has(Item.SHINY_STONE)
    ) {
      player.transformPokemon(this, Pkm.ULTRA_NECROZMA)
    }
  }

  onItemGiven(item: Item, player: Player) {
    if (item === Item.SHINY_STONE) {
      player.transformPokemon(this, Pkm.ULTRA_NECROZMA)
    }
  }
}

export class UltraNecrozma extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.LIGHT,
    Synergy.PSYCHIC
  ])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 300
  atk = 29
  speed = 50
  def = 10
  speDef = 10
  maxPP = 100
  range = 3
  skill = Ability.PRISMATIC_LASER
  passive = Passive.PRISM

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (
      (x !== player.lightX || y !== player.lightY || !hasLight) &&
      !this.items.has(Item.SHINY_STONE)
    ) {
      player.transformPokemon(this, Pkm.NECROZMA)
    }
  }
}

export class Cherubi extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLORA,
    Synergy.LIGHT,
    Synergy.GOURMET
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.CHERRIM
  hp = 90
  atk = 6
  speed = 52
  def = 2
  speDef = 2
  maxPP = 65
  range = 3
  skill = Ability.NATURAL_GIFT
  regional = true
}

export class Cherrim extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLORA,
    Synergy.LIGHT,
    Synergy.GOURMET
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 180
  atk = 15
  speed = 52
  def = 4
  speDef = 4
  maxPP = 65
  range = 3
  skill = Ability.NATURAL_GIFT
  passive = Passive.BLOSSOM
  regional = true
  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (
      (x === player.lightX && y === player.lightY && hasLight) ||
      this.items.has(Item.SHINY_STONE)
    ) {
      player.transformPokemon(this, Pkm.CHERRIM_SUNLIGHT)
    }
  }

  onItemGiven(item: Item, player: Player) {
    if (item === Item.SHINY_STONE) {
      player.transformPokemon(this, Pkm.CHERRIM_SUNLIGHT)
    }
  }
}

export class CherrimSunlight extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLORA,
    Synergy.LIGHT,
    Synergy.GOURMET
  ])
  rarity = Rarity.EPIC
  stars = 3
  hp = 250
  atk = 30
  speed = 52
  def = 6
  speDef = 9
  maxPP = 65
  range = 3
  skill = Ability.NATURAL_GIFT
  passive = Passive.BLOSSOM
  regional = true
  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    const hasLight =
      (player.synergies.get(Synergy.LIGHT) ?? 0) >=
      SynergyTriggers[Synergy.LIGHT][0]
    if (
      (x !== player.lightX || y !== player.lightY || !hasLight) &&
      !this.items.has(Item.SHINY_STONE)
    ) {
      player.transformPokemon(this, Pkm.CHERRIM)
    }
  }
}

export class Misdreavus extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FAIRY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.MISMAGIUS
  hp = 80
  atk = 7
  speed = 59
  def = 4
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.NIGHT_SHADE
  additional = true
}

export class Mismagius extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.FAIRY,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 20
  speed = 59
  def = 4
  speDef = 8
  maxPP = 100
  range = 3
  skill = Ability.NIGHT_SHADE
  additional = true
}

export class Doduo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DODRIO
  hp = 90
  atk = 10
  speed = 60
  def = 6
  speDef = 4
  maxPP = 85
  range = 1
  skill = Ability.AGILITY
  regional = true
}

export class Dodrio extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 185
  atk = 24
  speed = 60
  def = 10
  speDef = 6
  maxPP = 85
  range = 1
  skill = Ability.AGILITY
  regional = true
}

export class Kricketot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.KRICKETUNE
  hp = 80
  atk = 7
  speed = 46
  def = 4
  speDef = 4
  maxPP = 60
  range = 1
  skill = Ability.SCREECH
  additional = true
}

export class Kricketune extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 18
  speed = 46
  def = 8
  speDef = 8
  maxPP = 60
  range = 1
  skill = Ability.SCREECH
  additional = true
}

export class Hippopotas extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HIPPODOWN
  hp = 120
  atk = 11
  speed = 40
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SAND_TOMB
  additional = true
  passive = Passive.SAND_STREAM
}

export class Hippodown extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.NORMAL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 270
  atk = 23
  speed = 40
  def = 14
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SAND_TOMB
  additional = true
  passive = Passive.SAND_STREAM
}

export class Wingull extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.PELIPPER
  hp = 90
  atk = 10
  speed = 46
  def = 10
  speDef = 6
  maxPP = 70
  range = 2
  skill = Ability.WHIRLWIND
  additional = true
  passive = Passive.DRIZZLE
}

export class Pelipper extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 24
  speed = 46
  def = 14
  speDef = 8
  maxPP = 70
  range = 2
  skill = Ability.WHIRLWIND
  additional = true
  passive = Passive.DRIZZLE
}

export class Murkrow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HONCHKROW
  hp = 110
  atk = 9
  speed = 48
  def = 12
  speDef = 6
  maxPP = 70
  range = 1
  skill = Ability.FOUL_PLAY
  passive = Passive.BAD_LUCK
  additional = true
  beforeSimulationStart({
    opponentEffects
  }: {
    opponentEffects: Set<EffectEnum>
  }) {
    opponentEffects.add(EffectEnum.BAD_LUCK)
  }
}

export class Honchkrow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FLYING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 23
  speed = 48
  def = 16
  speDef = 10
  maxPP = 70
  range = 1
  skill = Ability.FOUL_PLAY
  passive = Passive.BAD_LUCK
  additional = true
  beforeSimulationStart({
    opponentEffects
  }: {
    opponentEffects: Set<EffectEnum>
  }) {
    opponentEffects.add(EffectEnum.BAD_LUCK)
  }
}

export class Zigzagoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LINOONE
  hp = 80
  atk = 7
  speed = 57
  def = 8
  speDef = 4
  maxPP = 50
  range = 1
  skill = Ability.SLASH
  passive = Passive.PICKUP
}

export class Linoone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 19
  speed = 57
  def = 12
  speDef = 8
  maxPP = 50
  range = 1
  skill = Ability.SLASH
  passive = Passive.PICKUP
}

export class GalarianZigzagoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.GALARIAN_LINOONE
  hp = 80
  atk = 6
  speed = 55
  def = 10
  speDef = 4
  maxPP = 50
  range = 1
  skill = Ability.SLASH
  regional = true
}

export class GalarianLinoone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.OBSTAGOON
  hp = 180
  atk = 16
  speed = 55
  def = 14
  speDef = 8
  maxPP = 50
  range = 1
  skill = Ability.SLASH
  regional = true
}

export class Obstagoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.DARK, Synergy.SOUND])
  rarity = Rarity.RARE
  stars = 3
  hp = 280
  atk = 22
  speed = 55
  def = 16
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.OBSTRUCT
  regional = true
}

export class Phantump extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GRASS,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.TREVENANT
  hp = 90
  atk = 8
  speed = 43
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.POLTERGEIST
  additional = true
}

export class Trevenant extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GRASS,
    Synergy.MONSTER
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 18
  speed = 43
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.POLTERGEIST
  additional = true
}

export class HisuianQwilfish extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.POISON,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.OVERQWIL
  hp = 95
  atk = 7
  speed = 52
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BARB_BARRAGE
  regional = true
}

export class Overqwil extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.POISON,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 230
  atk = 18
  speed = 52
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.BARB_BARRAGE
  regional = true
}

export class Xurkitree extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ARTIFICIAL,
    Synergy.LIGHT
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 15
  speed = 52
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.CHARGE_BEAM
  passive = Passive.SPECIAL_ATTACK
  attackType = AttackType.SPECIAL
}

export class Nihilego extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 22
  speed = 58
  def = 2
  speDef = 10
  maxPP = 80
  range = 3
  skill = Ability.ACID_SPRAY
  passive = Passive.BEAST_BOOST_AP
}

export class Tandemaus extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 2
  hp = 160
  atk = 14
  speed = 61
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  evolution = Pkm.MAUSHOLD_THREE
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon, player, stageLevel) => stageLevel >= 14
  )
  passive = Passive.FAMILY
}

export class MausholdThree extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 61
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
  evolution = Pkm.MAUSHOLD_FOUR
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon, player, stageLevel) => stageLevel >= 20
  )
  passive = Passive.FAMILY
}

export class MausholdFour extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 240
  atk = 21
  speed = 61
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.POPULATION_BOMB
}

export class Morpeko extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.ELECTRIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 18
  speed = 56
  def = 10
  speDef = 10
  maxPP = 50
  range = 1
  skill = Ability.AURA_WHEEL
  passive = Passive.HUNGER_SWITCH
}

export class MorpekoHangry extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.ELECTRIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 18
  speed = 56
  def = 10
  speDef = 10
  maxPP = 50
  range = 1
  skill = Ability.AURA_WHEEL
  passive = Passive.HUNGER_SWITCH
}

export class Minior extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 44
  def = 10
  speDef = 10
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_DOWN
  passive = Passive.METEOR
}

export class MiniorKernelBlue extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 44
  def = 10
  speDef = 10
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  passive = Passive.METEOR
}

export class MiniorKernelRed extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 44
  def = 10
  speDef = 10
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  passive = Passive.METEOR
}

export class MiniorKernelOrange extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 44
  def = 10
  speDef = 10
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  passive = Passive.METEOR
}

export class MiniorKernelGreen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 44
  def = 10
  speDef = 10
  maxPP = 50
  range = 3
  skill = Ability.SHIELDS_UP
  passive = Passive.METEOR
}

export class Hoopa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 15
  speed = 47
  def = 6
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.UNBOUND
}

export class HoopaUnbound extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.DARK, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 4
  hp = 250
  atk = 25
  speed = 47
  def = 6
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.HYPERSPACE_FURY
}

export class Gimmighoul extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 2
  hp = 200
  atk = 9
  speed = 52
  def = 8
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.GOLD_RUSH
  evolution = Pkm.GHOLDENGO
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon, player) => player.money >= 99
  )
  passive = Passive.GIMMIGHOUL
}

export class Gholdengo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GHOST, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 20
  speed = 52
  def = 10
  speDef = 10
  maxPP = 90
  range = 1
  skill = Ability.MAKE_IT_RAIN
  passive = Passive.GHOLDENGO
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    if (entity.player && entity.player.money >= 50) {
      entity.status.triggerRuneProtect(60000)
    }
  }
  onAcquired(player: Player) {
    player.titles.add(Title.GOLDEN)
  }
}

export class Sobble extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.ULTRA
  evolution = Pkm.DRIZZILE
  stars = 1
  hp = 120
  atk = 12
  speed = 63
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.SNIPE_SHOT
}

export class Drizzile extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.ULTRA
  evolution = Pkm.INTELEON
  stars = 2
  hp = 200
  atk = 22
  speed = 63
  def = 8
  speDef = 8
  maxPP = 100
  range = 3
  skill = Ability.SNIPE_SHOT
}

export class Inteleon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 360
  atk = 34
  speed = 63
  def = 12
  speDef = 12
  maxPP = 100
  range = 3
  skill = Ability.SNIPE_SHOT
}

export class Comfey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 13
  speed = 57
  def = 8
  speDef = 12
  maxPP = 80
  range = 3
  skill = Ability.FLORAL_HEALING
  passive = Passive.COMFEY
  canHoldItems = false
  afterSimulationStart({
    simulation,
    team,
    entity
  }: {
    simulation: Simulation
    team: MapSchema<IPokemonEntity>
    entity: IPokemonEntity
  }) {
    const alliesWithFreeSlots = values(team).filter(
      (p) =>
        p.name !== Pkm.COMFEY &&
        p.items.size < 3 &&
        p.refToBoardPokemon.canHoldItems
    )

    if (alliesWithFreeSlots.length > 0) {
      alliesWithFreeSlots.sort(
        (a, b) =>
          distanceE(
            a.positionX,
            a.positionY,
            entity.positionX,
            entity.positionY
          ) -
          distanceE(
            b.positionX,
            b.positionY,
            entity.positionX,
            entity.positionY
          )
      )
      const nearestAllyWithFreeItemSlot = alliesWithFreeSlots[0]

      // delete comfey
      team.delete(entity.id)
      simulation.board.setEntityOnCell(
        entity.positionX,
        entity.positionY,
        undefined
      )
      if (simulation.blueDpsMeter.has(entity.id)) {
        simulation.blueDpsMeter.delete(entity.id)
      }
      if (simulation.redDpsMeter.has(entity.id)) {
        simulation.redDpsMeter.delete(entity.id)
      }

      nearestAllyWithFreeItemSlot.addItem(Item.COMFEY)
    }
  }
}

export class Lillipup extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.COMMON
  evolution = Pkm.HERDIER
  stars = 1
  hp = 60
  atk = 6
  speed = 51
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.RETALIATE
}

export class Herdier extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.COMMON
  evolution = Pkm.STOUTLAND
  stars = 2
  hp = 120
  atk = 11
  speed = 51
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.RETALIATE
}

export class Stoutland extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.COMMON
  stars = 3
  hp = 220
  atk = 21
  speed = 51
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.RETALIATE
}

export class Pheromosa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FIGHTING])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 200
  atk = 27
  speed = 73
  def = 10
  speDef = 10
  maxPP = 85
  range = 1
  skill = Ability.LUNGE
}

export class Dracovish extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.AQUATIC,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 20
  speed = 49
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.FISHIOUS_REND
}

export class Dracozolt extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.ELECTRIC,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 20
  speed = 49
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.BOLT_BEAK
}

export class Arctozolt extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.ICE,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 22
  speed = 43
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.THUNDER_FANG
}

export class Arctovish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.WATER, Synergy.FOSSIL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 22
  speed = 43
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.ICE_FANG
}

export class Bruxish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 18
  speed = 54
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.PSYCHIC_FANGS
}

export class Corsola extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.AQUATIC])
  rarity = Rarity.EPIC
  stars = 1
  hp = 125
  atk = 9
  speed = 35
  def = 2
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.RECOVER
  passive = Passive.CORSOLA
  evolution = Pkm.GALAR_CORSOLA
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon) => pokemon.deathCount > 0
  )
  regional = true
}

export class GalarCorsola extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.AQUATIC, Synergy.GHOST])
  evolution = Pkm.CURSOLA
  rarity = Rarity.EPIC
  stars = 1
  hp = 125
  atk = 9
  speed = 35
  def = 2
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.CURSE
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return false // only base form is in region
  }
}

export class Cursola extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.AQUATIC, Synergy.GHOST])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 28
  speed = 35
  def = 6
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.CURSE
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return false // only base form is in region
  }
}

export class Smeargle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.HUMAN])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 250
  atk = 19
  speed = 49
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.SKETCH

  afterSimulationStart({ entity }) {
    if (entity.player) {
      const allyOnTheLeft = entity.player.getPokemonAt(
        this.positionX - 1,
        this.positionY
      )
      if (allyOnTheLeft && entity.skill === Ability.SKETCH) {
        entity.maxPP = allyOnTheLeft.maxPP
        entity.skill = allyOnTheLeft.skill
        entity.stars = allyOnTheLeft.stars
      }
    }
  }
}

export class Toxel extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.POISON,
    Synergy.BABY
  ])
  rarity = Rarity.RARE
  evolution = Pkm.TOXTRICITY
  stars = 1
  hp = 80
  atk = 8
  speed = 49
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.OVERDRIVE
  regional = true
}

export class Toxtricity extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.POISON,
    Synergy.SOUND
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 160
  atk = 20
  speed = 49
  def = 6
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.OVERDRIVE
  regional = true
}

export class Cyclizar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.NORMAL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 220
  atk = 17
  speed = 64
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SHED_TAIL
}

export class Pawniard extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.BISHARP
  hp = 130
  atk = 18
  speed = 41
  def = 10
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.KOWTOW_CLEAVE
}

export class Bisharp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.KINGAMBIT
  hp = 250
  atk = 31
  speed = 41
  def = 16
  speDef = 8
  maxPP = 60
  range = 1
  skill = Ability.KOWTOW_CLEAVE
}

export class Kingambit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.STEEL])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 400
  atk = 44
  speed = 41
  def = 24
  speDef = 12
  maxPP = 60
  range = 1
  skill = Ability.KOWTOW_CLEAVE
}

export class Feebas extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER])
  rarity = Rarity.SPECIAL
  evolution = Pkm.MILOTIC
  stars = 1
  hp = 60
  atk = 5
  speed = 51
  def = 4
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SPLASH
  passive = Passive.FEEBAS
  evolutionRule = new CountEvolutionRule(6)
}

export class Milotic extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FAIRY, Synergy.WATER])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 300
  atk = 15
  speed = 51
  def = 8
  speDef = 14
  maxPP = 80
  range = 2
  skill = Ability.ATTRACT
  onAcquired(player: Player) {
    player.titles.add(Title.SIREN)
  }
}

export class Dewpider extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.BUG,
    Synergy.AMORPHOUS
  ])
  additional = true
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARAQUANID
  hp = 60
  atk = 8
  speed = 38
  def = 4
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.STICKY_WEB
  passive = Passive.WATER_BUBBLE
}

export class Araquanid extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.BUG,
    Synergy.AMORPHOUS
  ])
  additional = true
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 17
  speed = 38
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.STICKY_WEB
  passive = Passive.WATER_BUBBLE
}

export class Lickitung extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.NORMAL,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.LICKILICKY
  hp = 70
  atk = 5
  speed = 41
  def = 4
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.LICK
}

export class Lickilicky extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.NORMAL,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 10
  speed = 41
  def = 7
  speDef = 7
  maxPP = 90
  range = 1
  skill = Ability.LICK
}

export class Kangaskhan extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WILD,
    Synergy.FIGHTING,
    Synergy.NORMAL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 15
  speed = 54
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.HEADBUTT
}

export class Teddiursa extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.URSARING
  hp = 150
  atk = 13
  speed = 41
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.FURY_SWIPES
}

export class Ursaring extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.URSALUNA
  hp = 280
  atk = 24
  speed = 41
  def = 12
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.FURY_SWIPES
}

export class Ursaluna extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 450
  atk = 29
  speed = 41
  def = 24
  speDef = 20
  maxPP = 100
  range = 1
  skill = Ability.FURY_SWIPES
  passive = Passive.BLOODMOON
  beforeSimulationStart({
    weather,
    player
  }: {
    weather: Weather
    player: Player
  }) {
    if (weather === Weather.BLOODMOON) {
      player.transformPokemon(this, Pkm.URSALUNA_BLOODMOON)
    }
  }
}

export class UrsalunaBloodmoon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 380
  atk = 38
  speed = 41
  def = 28
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.BLOOD_MOON
  beforeSimulationStart({
    weather,
    player
  }: {
    weather: Weather
    player: Player
  }) {
    if (weather !== Weather.BLOODMOON) {
      player.transformPokemon(this, Pkm.URSALUNA)
    }
  }
  onAcquired(player: Player) {
    player.titles.add(Title.BLOODY)
  }
}

export class Aipom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.AMBIPOM
  hp = 70
  atk = 6
  speed = 62
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.TICKLE
}

export class Ambipom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 12
  speed = 62
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.TICKLE
}

export class Deerling extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GRASS])
  rarity = Rarity.RARE
  additional = true
  stars = 1
  evolution = Pkm.SAWSBUCK
  hp = 80
  atk = 8
  speed = 55
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.HORN_LEECH
}

export class Sawsbuck extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.GRASS])
  rarity = Rarity.RARE
  additional = true
  stars = 2
  hp = 180
  atk = 22
  speed = 55
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.HORN_LEECH
}

export class Patrat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WATCHOG
  hp = 80
  atk = 8
  speed = 50
  def = 3
  speDef = 3
  maxPP = 100
  range = 2
  skill = Ability.DETECT
  additional = true
}

export class Watchog extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.LIGHT])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 17
  speed = 50
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.DETECT
  additional = true
}

export class Taillow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SWELLOW
  hp = 70
  atk = 7
  speed = 80
  def = 6
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.BRAVE_BIRD
}

export class Swellow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 16
  speed = 80
  def = 11
  speDef = 9
  maxPP = 100
  range = 1
  skill = Ability.BRAVE_BIRD
}

export class Spinarak extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.BUG, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ARIADOS
  hp = 60
  atk = 6
  speed = 38
  def = 2
  speDef = 2
  maxPP = 70
  range = 2
  skill = Ability.STRING_SHOT
}

export class Ariados extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.BUG, Synergy.POISON])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 15
  speed = 38
  def = 4
  speDef = 4
  maxPP = 70
  range = 2
  skill = Ability.STRING_SHOT
}

export class Rockruff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.LYCANROC_DUSK
  hp = 90
  atk = 12
  speed = 61
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
}

function updateLycanroc(pokemon: Pokemon, weather: Weather, player: Player) {
  let weatherForm
  if (weather === Weather.NIGHT) {
    weatherForm = Pkm.LYCANROC_NIGHT
  } else if (weather === Weather.SUN) {
    weatherForm = Pkm.LYCANROC_DAY
  }

  if (!weatherForm || pokemon.name === weatherForm) return
  player.transformPokemon(pokemon, weatherForm)
}

export class LycanrocDusk extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 22
  speed = 61
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
  passive = Passive.LYCANROC

  beforeSimulationStart({ weather, player }) {
    updateLycanroc(this, weather, player)
  }
}

export class LycanrocNight extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 22
  speed = 61
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
  passive = Passive.LYCANROC

  beforeSimulationStart({ weather, player }) {
    updateLycanroc(this, weather, player)
  }
}

export class LycanrocDay extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.ROCK, Synergy.LIGHT])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 22
  speed = 61
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.ACCELEROCK
  passive = Passive.LYCANROC

  beforeSimulationStart({ weather, player }) {
    updateLycanroc(this, weather, player)
  }
}

export class Druddigon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.WILD,
    Synergy.MONSTER
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 170
  atk = 19
  speed = 40
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.OUTRAGE
}

export class Cosmog extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  evolution = Pkm.COSMOEM
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon) => pokemon.evolutionRule.stacks >= 10
  )
  stars = 1
  hp = 100
  atk = 5
  speed = 37
  def = 8
  speDef = 8
  maxPP = 100
  range = 4
  skill = Ability.TELEPORT
  passive = Passive.COSMOG
}

export class Cosmoem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 2
  evolutions = [Pkm.SOLGALEO, Pkm.LUNALA]
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon) => pokemon.evolutionRule.stacks >= 10,
    (pokemon, player) => {
      if (
        pokemon.positionX === player.lightX &&
        pokemon.positionY === player.lightY &&
        SynergyEffects[Synergy.LIGHT].some((e) => player.effects.has(e))
      )
        return Pkm.SOLGALEO
      else return Pkm.LUNALA
    }
  )
  onAcquired(player: Player) {
    this.hp -= 200 - 100 // revert hp buffs of cosmog
  }
  hp = 200
  atk = 5
  speed = 37
  def = 16
  speDef = 16
  maxPP = 100
  range = 4
  skill = Ability.TELEPORT
  passive = Passive.COSMOEM
}

export class Solgaleo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.LIGHT,
    Synergy.STEEL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 27
  speed = 56
  def = 12
  speDef = 8
  maxPP = 110
  range = 1
  skill = Ability.SUNSTEEL_STRIKE
  onAcquired(player: Player) {
    this.hp -= 300 - 200 // revert hp buffs of cosmoem
    player.titles.add(Title.STARGAZER)
  }
}

export class Lunala extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.LIGHT,
    Synergy.GHOST
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 27
  speed = 56
  def = 6
  speDef = 6
  maxPP = 100
  range = 4
  skill = Ability.MOONGEIST_BEAM
  onAcquired(player: Player) {
    this.hp -= 300 - 200 // revert hp buffs of cosmoem
    player.titles.add(Title.STARGAZER)
  }
}

export class Magearna extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.FAIRY,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 25
  speed = 46
  def = 8
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.FLEUR_CANNON
  passive = Passive.SOUL_HEART
}

export class Impidimp extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FAIRY, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.MORGREM
  hp = 60
  atk = 6
  speed = 44
  def = 2
  speDef = 4
  maxPP = 70
  range = 1
  skill = Ability.SPIRIT_BREAK
  regional = true
}

export class Morgrem extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FAIRY, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.GRIMMSNARL
  hp = 110
  atk = 12
  speed = 44
  def = 4
  speDef = 6
  maxPP = 70
  range = 1
  skill = Ability.SPIRIT_BREAK
  regional = true
}

export class Grimmsnarl extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FAIRY, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 200
  atk = 26
  speed = 44
  def = 6
  speDef = 8
  maxPP = 70
  range = 1
  skill = Ability.SPIRIT_BREAK
  regional = true
}

export class Drowzee extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.HYPNO
  hp = 100
  atk = 7
  speed = 46
  def = 4
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.DREAM_EATER
  regional = true
}

export class Hypno extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.HUMAN,
    Synergy.MONSTER
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 250
  atk = 14
  speed = 46
  def = 8
  speDef = 12
  maxPP = 100
  range = 2
  skill = Ability.DREAM_EATER
  regional = true
}

export class Wattrel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ELECTRIC])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.KILOWATTREL
  hp = 90
  atk = 7
  speed = 65
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.SPARK
  additional = true
  passive = Passive.WIND_POWER
}

export class Kilowattrel extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.ELECTRIC])
  rarity = Rarity.EPIC
  stars = 2
  hp = 190
  atk = 16
  speed = 65
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.SPARK
  additional = true
  passive = Passive.WIND_POWER
}

export class BurmyPlant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WORMADAM_PLANT
  hp = 70
  atk = 7
  speed = 46
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.GRASS)
  }
}

export class BurmySandy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WORMADAM_SANDY
  hp = 70
  atk = 7
  speed = 46
  def = 4
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.GROUND) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class BurmyTrash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ARTIFICIAL])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.WORMADAM_TRASH
  hp = 70
  atk = 7
  speed = 46
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.ARTIFICIAL) &&
      !regionSynergies.includes(Synergy.GROUND) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class WormadamPlant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GRASS])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MOTHIM
  hp = 150
  atk = 13
  speed = 46
  def = 2
  speDef = 4
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  afterEvolve = evolveMothim
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return regionSynergies.includes(Synergy.GRASS)
  }
}

export class WormadamSandy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MOTHIM
  hp = 150
  atk = 13
  speed = 46
  def = 4
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  afterEvolve = evolveMothim
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.GROUND) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class WormadamTrash extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ARTIFICIAL])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.MOTHIM
  hp = 150
  atk = 13
  speed = 46
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.QUIVER_DANCE
  passive = Passive.ENVIRONMENTAL_ADAPTATION
  stages = 3
  regional = true
  afterEvolve = evolveMothim
  isInRegion(map: DungeonPMDO, state?: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.ARTIFICIAL) &&
      !regionSynergies.includes(Synergy.GROUND) &&
      !regionSynergies.includes(Synergy.GRASS)
    )
  }
}

export class Mothim extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 3
  hp = 200
  atk = 20
  speed = 46
  def = 6
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.QUIVER_DANCE
  passive = Passive.MOTHIM
  stages = 3
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    // always hide mothim to avoid showing duplicated with other burmy forms
    // this does not impact the evolution of wormadam
    return false
  }
}

export class Wooper extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.GROUND])
  rarity = Rarity.RARE
  evolution = Pkm.QUAGSIRE
  stars = 1
  hp = 80
  atk = 8
  speed = 31
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.MUD_SHOT
  additional = true
}

export class Quagsire extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.AQUATIC, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 15
  speed = 31
  def = 15
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.MUD_SHOT
  additional = true
}

export class PaldeaWooper extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.GROUND,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  evolution = Pkm.CLODSIRE
  stars = 1
  hp = 80
  atk = 6
  speed = 31
  def = 6
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.RECOVER
  additional = true
  regional = true
}

export class Clodsire extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.GROUND,
    Synergy.AQUATIC
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 12
  speed = 31
  def = 10
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.RECOVER
  additional = true
  regional = true
}

export class Tangela extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.MONSTER,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNCOMMON
  evolution = Pkm.TANGROWTH
  stars = 1
  hp = 100
  atk = 4
  speed = 41
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.POWER_WHIP
  additional = true
}

export class Tangrowth extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.MONSTER,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 190
  atk = 14
  speed = 41
  def = 12
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.POWER_WHIP
  additional = true
}

export class Phanpy extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND, Synergy.BABY])
  rarity = Rarity.RARE
  evolution = Pkm.DONPHAN
  stars = 1
  hp = 80
  atk = 5
  speed = 41
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.RAPID_SPIN
}

export class Donphan extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.GROUND])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 10
  speed = 41
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.RAPID_SPIN
}

export class Spoink extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.RARE
  evolution = Pkm.GRUMPIG
  stars = 1
  hp = 100
  atk = 5
  speed = 51
  def = 8
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.BOUNCE
  regional = true
}

export class Grumpig extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.RARE
  stars = 2
  hp = 240
  atk = 9
  speed = 51
  def = 12
  speDef = 20
  maxPP = 100
  range = 1
  skill = Ability.BOUNCE
  regional = true
}

export class Sinistea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.ARTIFICIAL,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.POLTEAGEIST
  hp = 60
  atk = 4
  speed = 47
  def = 3
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.TEA_TIME
  additional = true
}

export class Polteageist extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.ARTIFICIAL,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 9
  speed = 47
  def = 5
  speDef = 10
  maxPP = 100
  range = 2
  skill = Ability.TEA_TIME
  additional = true
}

export class Ferroseed extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.STEEL])
  rarity = Rarity.EPIC
  evolution = Pkm.FERROTHORN
  stars = 1
  hp = 100
  atk = 8
  speed = 31
  def = 14
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.SPIKES
  additional = true
}

export class Ferrothorn extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.STEEL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 16
  speed = 31
  def = 28
  speDef = 28
  maxPP = 100
  range = 1
  skill = Ability.SPIKES
  additional = true
}

export class Golett extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.ARTIFICIAL,
    Synergy.GHOST
  ])
  rarity = Rarity.RARE
  evolution = Pkm.GOLURK
  stars = 1
  hp = 80
  atk = 7
  speed = 43
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SHADOW_PUNCH
  additional = true
}

export class Golurk extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GROUND,
    Synergy.ARTIFICIAL,
    Synergy.GHOST
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 21
  speed = 43
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SHADOW_PUNCH
  additional = true
}

export class Trubbish extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ARTIFICIAL])
  rarity = Rarity.EPIC
  evolution = Pkm.GARBODOR
  stars = 1
  hp = 110
  atk = 8
  speed = 49
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.GUNK_SHOT
  passive = Passive.RECYCLE
  additional = true

  statIncreases = {
    [Stat.SPEED]: 0,
    [Stat.AP]: 0,
    [Stat.CRIT_CHANCE]: 0,
    [Stat.PP]: 0,
    [Stat.SHIELD]: 0,
    [Stat.ATK]: 0,
    [Stat.SPE_DEF]: 0,
    [Stat.DEF]: 0
  }

  beforeSimulationStart({ player }: { player: Player }) {
    values(this.items).forEach((item) => {
      if (Berries.includes(item)) {
        this.hp += 10
        this.removeItem(item, player)
      }
      if (ItemComponents.includes(item)) {
        this.hp += 25
        Object.entries(ItemStats[item] ?? {}).forEach(([stat, value]) => {
          if (stat in this.statIncreases) {
            this.statIncreases[stat as Stat] += value
          }
        })
        this.removeItem(item, player)
      }
      if (ArtificialItems.includes(item)) {
        this.hp += 50
        Object.entries(ItemStats[item] ?? {}).forEach(([stat, value]) => {
          if (stat in this.statIncreases) {
            this.statIncreases[stat as Stat] += value
          }
        })

        this.removeItem(item, player)

        const itemIndex = player.artificialItems.indexOf(item)
        player.artificialItems[itemIndex] = Item.TRASH
        player.items.push(player.artificialItems[itemIndex])
      }
    })
  }

  onSpawn({ entity }: { entity: IPokemonEntity }) {
    // Add non-permanent stats to Trubbish
    entity.addAbilityPower(this.statIncreases[Stat.AP], entity, 0, false)
    entity.addShield(this.statIncreases[Stat.SHIELD], entity, 0, false)
    entity.addCritChance(this.statIncreases[Stat.CRIT_CHANCE], entity, 0, false)
    entity.addPP(this.statIncreases[Stat.PP], entity, 0, false)
    entity.addSpeed(this.statIncreases[Stat.SPEED], entity, 0, false)
    entity.addAttack(this.statIncreases[Stat.ATK], entity, 0, false)
    entity.addSpecialDefense(this.statIncreases[Stat.SPE_DEF], entity, 0, false)
    entity.addDefense(this.statIncreases[Stat.DEF], entity, 0, false)
  }

  afterEvolve({
    pokemonEvolved: garbodorObj,
    pokemonsBeforeEvolution: trubbishes
  }: {
    pokemonEvolved: Pokemon
    pokemonsBeforeEvolution: Pokemon[]
  }) {
    // Carry over the stats gained with passive
    const garbodor = garbodorObj as Garbodor
    garbodor.statIncreases = {
      [Stat.SPEED]: 0,
      [Stat.AP]: 0,
      [Stat.CRIT_CHANCE]: 0,
      [Stat.PP]: 0,
      [Stat.SHIELD]: 0,
      [Stat.ATK]: 0,
      [Stat.SPE_DEF]: 0,
      [Stat.DEF]: 0
    }

    trubbishes.forEach((trubbishObj) => {
      const trubbish = trubbishObj as unknown as Trubbish
      for (const key in garbodor.statIncreases) {
        garbodor.statIncreases[key] += trubbish.statIncreases[key]
      }
    })
  }
}

export class Garbodor extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ARTIFICIAL])
  rarity = Rarity.EPIC
  stars = 2
  hp = 230
  atk = 14
  speed = 49
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.GUNK_SHOT
  passive = Passive.RECYCLE
  additional = true

  statIncreases = {
    [Stat.SPEED]: 0,
    [Stat.AP]: 0,
    [Stat.CRIT_CHANCE]: 0,
    [Stat.PP]: 0,
    [Stat.SHIELD]: 0,
    [Stat.ATK]: 0,
    [Stat.SPE_DEF]: 0,
    [Stat.DEF]: 0
  }

  defaultValues = {
    [Stat.HP]: this.hp,
    [Stat.ATK]: this.atk,
    [Stat.DEF]: this.def,
    [Stat.SPE_DEF]: this.speDef
  }

  beforeSimulationStart = Trubbish.prototype.beforeSimulationStart
  onSpawn = Trubbish.prototype.onSpawn
}

export class Grubbin extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.CHARJABUG
  evolutionRule = new HatchEvolutionRule()
  hp = 75
  atk = 5
  speed = 39
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.ZAP_CANNON
  passive = Passive.HATCH
}

export class Charjabug extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.VIKAVOLT
  evolutionRule = new HatchEvolutionRule()
  hp = 130
  atk = 13
  speed = 39
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.ZAP_CANNON
  passive = Passive.HATCH
}

export class Vikavolt extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.ELECTRIC])
  rarity = Rarity.HATCH
  stars = 3
  hp = 180
  atk = 24
  speed = 39
  def = 8
  speDef = 8
  maxPP = 100
  range = 3
  skill = Ability.ZAP_CANNON
}

export class ShellosWestSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.GROUND,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GASTRODON_WEST_SEA
  hp = 120
  atk = 9
  speed = 38
  def = 6
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.MUDDY_WATER
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.WATER) ||
      regionSynergies.includes(Synergy.GROUND)
    )
  }
}

export class GastrodonWestSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.GROUND,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 270
  atk = 19
  speed = 38
  def = 10
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.MUDDY_WATER
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      regionSynergies.includes(Synergy.WATER) ||
      regionSynergies.includes(Synergy.GROUND)
    )
  }
}

export class ShellosEastSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.GASTRODON_EAST_SEA
  hp = 120
  atk = 9
  speed = 38
  def = 6
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.ANCIENT_POWER
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (regionSynergies.includes(Synergy.AQUATIC) ||
        regionSynergies.includes(Synergy.ROCK)) &&
      !(
        regionSynergies.includes(Synergy.GROUND) ||
        regionSynergies.includes(Synergy.WATER)
      )
    )
  }
}

export class GastrodonEastSea extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.AQUATIC,
    Synergy.ROCK,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 270
  atk = 19
  speed = 38
  def = 10
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.ANCIENT_POWER
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (regionSynergies.includes(Synergy.AQUATIC) ||
        regionSynergies.includes(Synergy.ROCK)) &&
      !(
        regionSynergies.includes(Synergy.GROUND) ||
        regionSynergies.includes(Synergy.WATER)
      )
    )
  }
}

export class Rufflet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.BRAVIARY
  hp = 70
  atk = 7
  speed = 51
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.CRUSH_CLAW
  regional = true
}

export class Braviary extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FLYING])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 15
  speed = 51
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.CRUSH_CLAW
  regional = true
}

export class Klefki extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.FAIRY,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 15
  speed = 49
  def = 8
  speDef = 6
  maxPP = 90
  range = 3
  skill = Ability.FAIRY_LOCK
}

export class Hawlucha extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIGHTING,
    Synergy.FLYING,
    Synergy.HUMAN
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 17
  speed = 63
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.FLYING_PRESS
}

export class Stonjourner extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GROUND, Synergy.LIGHT])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  speed = 47
  def = 20
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.GRAVITY
  passive = Passive.STONJOURNER
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.toIdleState()
  }
  afterSimulationStart({
    entity,
    simulation
  }: {
    entity: IPokemonEntity
    simulation: Simulation
  }) {
    simulation.board
      .getAdjacentCells(entity.positionX, entity.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team === entity.team) {
          cell.value.addAbilityPower(50, cell.value, 0, false)
        }
      })
  }
}

export class Cramorant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.AQUATIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 19
  speed = 52
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.GULP_MISSILE
}

export class Arrokuda extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 80
  atk = 10
  speed = 46
  def = 2
  speDef = 2
  maxPP = 140
  range = 1
  skill = Ability.AQUA_JET
}

export class Durant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.BUG])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 19
  speed = 60
  def = 12
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.INFESTATION
  passive = Passive.DURANT
}

export class Wishiwashi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER])
  rarity = Rarity.SPECIAL
  stars = 1
  evolution = Pkm.WISHIWASHI_SCHOOL
  hp = 50
  atk = 11
  speed = 38
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AQUA_JET
  passive = Passive.WISHIWASHI
  evolutionRule = new CountEvolutionRule(3)
}

export class WishiwashiSchool extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.MONSTER,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.SPECIAL
  stars = 3
  evolution = Pkm.WISHIWASHI_SCHOOL
  hp = 300
  atk = 22
  speed = 35
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SCHOOLING
  onAcquired(player: Player) {
    player.titles.add(Title.FEARSOME)
  }
}

export class Pawmi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIGHTING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.PAWMO
  hp = 80
  atk = 6
  speed = 59
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_SHOCK
}

export class Pawmo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIGHTING])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.PAWMOT
  hp = 150
  atk = 13
  speed = 59
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_SHOCK
}

export class Pawmot extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FIGHTING])
  rarity = Rarity.RARE
  stars = 3
  hp = 240
  atk = 31
  speed = 59
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.DOUBLE_SHOCK
}

export class Pyukumuku extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.POISON,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 10
  speed = 27
  def = 14
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.PURIFY
  passive = Passive.PYUKUMUKU
}

export class Goldeen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.NORMAL])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SEAKING
  hp = 90
  atk = 8
  speed = 47
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.WATERFALL
  additional = true
}

export class Seaking extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.NORMAL])
  rarity = Rarity.RARE
  stars = 2
  hp = 250
  atk = 16
  speed = 47
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.WATERFALL
  additional = true
}

export class Luvdisc extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.AQUATIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 14
  speed = 56
  def = 6
  speDef = 10
  maxPP = 60
  range = 3
  skill = Ability.CHARM
  passive = Passive.LUVDISC
}

export class Audino extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.SOUND])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 41
  def = 8
  speDef = 8
  maxPP = 80
  range = 2
  skill = Ability.ENTRAINMENT
}

export class Petilil extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  evolutions = [Pkm.LILIGANT, Pkm.HISUIAN_LILLIGANT]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon: Pokemon, player: IPlayer) => {
      if (player.regionalPokemons.includes(Pkm.HISUIAN_LILLIGANT))
        return Pkm.HISUIAN_LILLIGANT
      else return Pkm.LILIGANT
    }
  )
  stars = 1
  hp = 85
  atk = 5
  speed = 54
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.AROMATHERAPY
  additional = true
}

export class Lilligant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA, Synergy.HUMAN])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 10
  speed = 54
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.AROMATHERAPY
  additional = true
}

export class HisuianLilligant extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GRASS,
    Synergy.FIGHTING,
    Synergy.HUMAN
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 180
  atk = 14
  speed = 59
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.VICTORY_DANCE
  additional = true
  regional = true
  isInRegion(map: DungeonPMDO, state: GameState) {
    const regionSynergies = DungeonDetails[map]?.synergies
    return (
      (!state || state.additionalPokemons.includes(Pkm.PETILIL)) &&
      regionSynergies.includes(Synergy.FIGHTING)
    )
  }
}

export class Mantyke extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BABY, Synergy.WATER, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  evolution = Pkm.MANTINE
  evolutionRule = new ConditionBasedEvolutionRule(
    (pokemon: Pokemon, player: Player) => {
      for (const p of player.board.values()) {
        if (
          p.name === Pkm.REMORAID &&
          !isOnBench(p) &&
          !isOnBench(pokemon) &&
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            p.positionX,
            p.positionY
          ) === 1
        ) {
          return true
        }
      }
      return false
    }
  )
  stars = 2
  hp = 160
  atk = 6
  speed = 47
  def = 6
  speDef = 12
  maxPP = 100
  range = 2
  skill = Ability.BOUNCE
  passive = Passive.MANTYKE

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    this.evolutionRule.tryEvolve(this, player, 0)
  }
}

export class Mantine extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 230
  atk = 12
  speed = 47
  def = 8
  speDef = 16
  maxPP = 100
  range = 2
  skill = Ability.BOUNCE
  passive = Passive.MANTINE
}

export class Remoraid extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.WATER])
  rarity = Rarity.SPECIAL
  evolution = Pkm.OCTILLERY
  stars = 1
  hp = 60
  atk = 13
  speed = 39
  def = 4
  speDef = 2
  maxPP = 80
  range = 1
  skill = Ability.AQUA_JET

  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    for (const pokemon of player.board.values()) {
      if (pokemon.name === Pkm.MANTYKE) {
        pokemon.evolutionRule.tryEvolve(pokemon, player, 0)
      }
    }
  }
}

export class Octillery extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.WATER])
  rarity = Rarity.SPECIAL
  stars = 2
  hp = 150
  atk = 26
  speed = 39
  def = 6
  speDef = 6
  maxPP = 80
  range = 3
  skill = Ability.OCTAZOOKA
}

export class Sigilyph extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FLYING,
    Synergy.FOSSIL
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 56
  def = 6
  speDef = 6
  maxPP = 100
  range = 3
  skill = Ability.PSYCHO_SHIFT
}

export class Frigibax extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ICE])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.ARCTIBAX
  hp = 150
  atk = 15
  speed = 53
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.GLAIVE_RUSH
}

export class Arctibax extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ICE])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.BAXCALIBUR
  hp = 270
  atk = 30
  speed = 53
  def = 10
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.GLAIVE_RUSH
}

export class Baxcalibur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.ICE])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 400
  atk = 45
  speed = 53
  def = 16
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.GLAIVE_RUSH
}

export class Sandile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.HATCH
  stars = 1
  evolution = Pkm.KROKOROK
  evolutionRule = new HatchEvolutionRule()
  hp = 80
  atk = 6
  speed = 54
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.FOUL_PLAY
  passive = Passive.HATCH
}

export class Krokorok extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.HATCH
  stars = 2
  evolution = Pkm.KROOKODILE
  evolutionRule = new HatchEvolutionRule()
  hp = 150
  atk = 12
  speed = 54
  def = 6
  speDef = 6
  maxPP = 80
  range = 1
  skill = Ability.FOUL_PLAY
  passive = Passive.HATCH
}

export class Krookodile extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.GROUND,
    Synergy.MONSTER
  ])
  rarity = Rarity.HATCH
  stars = 3
  hp = 220
  atk = 20
  speed = 54
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.FOUL_PLAY
}

export class Binacle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.BARBARACLE
  hp = 80
  atk = 9
  speed = 47
  def = 8
  speDef = 4
  maxPP = 65
  range = 1
  skill = Ability.STONE_EDGE
  additional = true
}

export class Barbaracle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.WATER])
  rarity = Rarity.RARE
  stars = 2
  hp = 200
  atk = 21
  speed = 47
  def = 16
  speDef = 8
  maxPP = 65
  range = 1
  skill = Ability.STONE_EDGE
  additional = true
}

export class Skarmory extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 18
  speed = 47
  def = 16
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.ROAR
  passive = Passive.SKARMORY

  afterSimulationStart(params: {
    player: IPlayer
    simulation: Simulation
    entity: IPokemonEntity
  }) {
    params.entity.commands.push(
      new DelayedCommand(() => {
        const board = params.simulation.board
        const simulation = params.simulation
        const entity = params.entity

        const nbSpikes = 12
        const positions = new Set<string>()
        for (let i = 0; i < nbSpikes; i++) {
          let x, y
          do {
            x = Math.floor(Math.random() * board.columns)
            y =
              Math.floor((Math.random() * board.rows) / 2) +
              (entity.positionY < 3 ? 3 : 0)
          } while (positions.has(`${x},${y}`))
          positions.add(`${x},${y}`)

          board.addBoardEffect(x, y, EffectEnum.SPIKES, simulation)
          entity.broadcastAbility({
            skill: Ability.SPIKES,
            targetX: x,
            targetY: y
          })
        }
      }, 300)
    )
  }
}

function ogerponOnAcquired(
  player: Player,
  currentMask:
    | Item.WELLSPRING_MASK
    | Item.CORNERSTONE_MASK
    | Item.HEARTHFLAME_MASK
    | Item.TEAL_MASK
    | null
) {
  OgerponMasks.forEach((mask) => {
    if (!player.items.includes(mask) && mask !== currentMask) {
      player.items.push(mask)
    }
  })
  if (currentMask && player.items.includes(currentMask)) {
    removeInArray(player.items, currentMask)
  }
}

function ogerponOnSell(player: Player) {
  OgerponMasks.forEach((mask) => {
    removeInArray(player.items, mask)
  })
}

export class OgerponTeal extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  onAcquired = (player: Player) => ogerponOnAcquired(player, null)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_TEAL
}

export class OgerponTealMask extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FLORA])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 60
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  shiny = false
  onAcquired = (player: Player) => ogerponOnAcquired(player, Item.TEAL_MASK)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_TEAL
}

export class OgerponWellspring extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.AQUATIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  onAcquired = (player: Player) => ogerponOnAcquired(player, null)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_WELLSPRING
}

export class OgerponWellspringMask extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.AQUATIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 60
  def = 8
  speDef = 16
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  shiny = false
  onAcquired = (player: Player) =>
    ogerponOnAcquired(player, Item.WELLSPRING_MASK)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_WELLSPRING
}

export class OgerponHearthflame extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 21
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  onAcquired = (player: Player) => ogerponOnAcquired(player, null)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_HEARTHFLAME
}

export class OgerponHearthflameMask extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 21
  speed = 60
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  shiny = false
  onAcquired = (player: Player) =>
    ogerponOnAcquired(player, Item.HEARTHFLAME_MASK)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_HEARTHFLAME
}

export class OgerponCornerstone extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 60
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  onAcquired = (player: Player) => ogerponOnAcquired(player, null)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_CORNERSTONE
}

export class OgerponCornerstoneMask extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.ROCK])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 60
  def = 16
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.IVY_CUDGEL
  shiny = false
  onAcquired = (player: Player) =>
    ogerponOnAcquired(player, Item.CORNERSTONE_MASK)
  afterSell = (player: Player) => ogerponOnSell(player)
  passive = Passive.OGERPON_CORNERSTONE
}

export class IronHands extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIGHTING,
    Synergy.ARTIFICIAL,
    Synergy.ELECTRIC
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 230
  atk = 20
  speed = 41
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.FORCE_PALM
}

export class Rookidee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.CORVISQUIRE
  hp = 80
  atk = 8
  speed = 46
  def = 8
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.STEEL_WING
  regional = true
}

export class Corvisquire extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  evolution = Pkm.CORVIKNIGHT
  hp = 150
  atk = 14
  speed = 46
  def = 13
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.STEEL_WING
  regional = true
}

export class Corviknight extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 3
  hp = 250
  atk = 28
  speed = 46
  def = 18
  speDef = 12
  maxPP = 90
  range = 1
  skill = Ability.STEEL_WING
  regional = true
}
export class Turtonator extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.FIRE])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 14
  speed = 37
  def = 24
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.SHELL_TRAP
}

export class Sandygast extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GROUND,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.PALOSSAND
  hp = 60
  atk = 6
  speed = 36
  def = 6
  speDef = 2
  maxPP = 90
  range = 1
  skill = Ability.SHORE_UP
  additional = true
}

export class Palossand extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GHOST,
    Synergy.GROUND,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 11
  speed = 36
  def = 8
  speDef = 4
  maxPP = 90
  range = 1
  skill = Ability.SHORE_UP
  additional = true
}

export class Skorupi extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.BUG, Synergy.POISON])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DRAPION
  hp = 80
  atk = 9
  speed = 55
  def = 10
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.POISON_STING
  additional = true
}

export class Drapion extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.POISON, Synergy.DARK])
  rarity = Rarity.EPIC
  stars = 2
  hp = 160
  atk = 16
  speed = 55
  def = 16
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.POISON_STING
  additional = true
}

export class Darumaka extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.DARMANITAN
  hp = 80
  atk = 11
  speed = 55
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HEADBUTT
}

export class Darmanitan extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 24
  speed = 61
  def = 2
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.HEADBUTT
  passive = Passive.DARMANITAN
}

export class DarmanitanZen extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.EPIC
  stars = 2
  hp = 220
  atk = 14
  speed = 41
  def = 12
  speDef = 12
  maxPP = 100
  range = 5
  skill = Ability.TRANSE
  passive = Passive.DARMANITAN_ZEN
}

export class Krabby extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.KINGLER
  hp = 80
  atk = 6
  speed = 49
  def = 8
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.VISE_GRIP
  additional = true
}

export class Kingler extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WATER, Synergy.NORMAL])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 16
  speed = 49
  def = 14
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.VISE_GRIP
  additional = true
}

export class Zygarde10 extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GROUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 26
  speed = 62
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.LANDS_WRATH
  passive = Passive.ZYGARDE
  onAcquired(player: Player) {
    if (player.items.includes(Item.ZYGARDE_CUBE) === false) {
      player.items.push(Item.ZYGARDE_CUBE)
    }
  }
}

export class Zygarde50 extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GROUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 220
  atk = 23
  speed = 55
  def = 5
  speDef = 5
  maxPP = 100
  range = 3
  skill = Ability.THOUSAND_ARROWS
  passive = Passive.ZYGARDE
  onAcquired(player: Player) {
    if (player.items.includes(Item.ZYGARDE_CUBE) === false) {
      player.items.push(Item.ZYGARDE_CUBE)
    }
  }
}

export class Zygarde100 extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.GROUND])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 350
  atk = 28
  speed = 50
  def = 10
  speDef = 10
  maxPP = 100
  range = 2
  skill = Ability.CORE_ENFORCER
}

export class Sizzlipede extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.BUG])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.CENTISKORCH
  hp = 75
  atk = 9
  speed = 46
  def = 2
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.BURN_UP
  regional = true
}

export class Centiskorch extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.BUG])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 18
  speed = 46
  def = 2
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.BURN_UP
  regional = true
}

export class Stufful extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.BEWEAR
  hp = 100
  atk = 8
  speed = 44
  def = 6
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.POWER_HUG
  additional = true
}

export class Bewear extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIGHTING])
  rarity = Rarity.EPIC
  stars = 2
  hp = 260
  atk = 25
  speed = 44
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.POWER_HUG
  additional = true
}

export class Glimmet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ROCK, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.GLIMMORA
  hp = 80
  atk = 6
  speed = 53
  def = 8
  speDef = 8
  maxPP = 70
  range = 1
  skill = Ability.MORTAL_SPIN
  additional = true
  passive = Passive.GLIMMORA
}

export class Glimmora extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.ROCK, Synergy.FLORA])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 11
  speed = 53
  def = 12
  speDef = 12
  maxPP = 70
  range = 1
  skill = Ability.MORTAL_SPIN
  additional = true
  passive = Passive.GLIMMORA
}

export class Fletchling extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FIRE])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.FLETCHINDER
  hp = 120
  atk = 12
  speed = 65
  def = 6
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.FIRESTARTER
}

export class Fletchinder extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FIRE])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.TALONFLAME
  hp = 230
  atk = 25
  speed = 65
  def = 10
  speDef = 10
  maxPP = 100
  range = 2
  skill = Ability.FIRESTARTER
}

export class Talonflame extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLYING, Synergy.FIRE])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 340
  atk = 37
  speed = 65
  def = 14
  speDef = 14
  maxPP = 100
  range = 2
  skill = Ability.FIRESTARTER
}

export class Vullaby extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MANDIBUZZ
  hp = 90
  atk = 10
  speed = 51
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.BONE_ARMOR
  additional = true
}

export class Mandibuzz extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DARK, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 210
  atk = 19
  speed = 51
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.BONE_ARMOR
  additional = true
}

export class Inkay extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.PSYCHIC,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.MALAMAR
  hp = 90
  atk = 9
  speed = 48
  def = 6
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.TOPSY_TURVY
  additional = true
}

export class Malamar extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DARK,
    Synergy.PSYCHIC,
    Synergy.AQUATIC
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 230
  atk = 19
  speed = 48
  def = 10
  speDef = 24
  maxPP = 100
  range = 1
  skill = Ability.TOPSY_TURVY
  additional = true
}

const updatePillars = (player: Player, pkm: Pkm, pillarPkm: Pkm) => {
  const pkmOnBoard = values(player.board).filter(
    (p) => p.name === pkm && p.positionY > 0
  )
  const pillars = values(player.board).filter((p) => p.name === pillarPkm)
  const nbPillars = pkmOnBoard.length * (pkm === Pkm.CONKELDURR ? 2 : 1)
  if (pillars.length < nbPillars) {
    for (let i = 0; i < nbPillars - pillars.length; i++) {
      const freeSpace = getFirstAvailablePositionOnBoard(player.board)
      if (freeSpace) {
        const pillar = PokemonFactory.createPokemonFromName(pillarPkm, player)
        pillar.positionX = freeSpace[0]
        pillar.positionY = freeSpace[1]
        player.board.set(pillar.id, pillar)
      }
    }
  } else if (nbPillars < pillars.length) {
    for (let i = 0; i < pillars.length - nbPillars; i++) {
      player.board.delete(pillars[i].id)
    }
  }
}

const pillarEvolve =
  (pillarToRemove: Pkm, pillarEvolution: Pkm) =>
    (params: {
      pokemonEvolved: Pokemon
      pokemonsBeforeEvolution: Pokemon[]
      player: Player
    }) => {
      const pkmOnBoard = values(params.player.board).filter(
        (p) =>
          p.name === params.pokemonsBeforeEvolution[0].name && p.positionY > 0
      )
      const pillars = values(params.player.board).filter(
        (p) => p.name === pillarToRemove
      )
      for (let i = 0; i < pillars.length - pkmOnBoard.length; i++) {
        params.player.board.delete(pillars[i].id)
      }
      const coords =
        pillars.length > 0
          ? [pillars[0].positionX, pillars[0].positionY]
          : getFirstAvailablePositionOnBoard(params.player.board)
      if (coords && params.pokemonEvolved.positionY > 0) {
        const pillar = PokemonFactory.createPokemonFromName(
          pillarEvolution,
          params.player
        )
        pillar.positionX = coords[0]
        pillar.positionY = coords[1]
        params.player.board.set(pillar.id, pillar)
      }
      updatePillars(params.player, params.pokemonEvolved.name, pillarEvolution)
    }

export class Timburr extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.GURDURR
  hp = 140
  atk = 15
  speed = 39
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.COLUMN_CRUSH
  passive = Passive.PILLAR
  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    updatePillars(player, Pkm.TIMBURR, Pkm.PILLAR_WOOD)
  }
  afterSell(player) {
    updatePillars(player, Pkm.TIMBURR, Pkm.PILLAR_WOOD)
  }
  afterEvolve = pillarEvolve(Pkm.PILLAR_WOOD, Pkm.PILLAR_IRON)
}

export class Gurdurr extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.CONKELDURR
  hp = 280
  atk = 26
  speed = 39
  def = 12
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.COLUMN_CRUSH
  passive = Passive.PILLAR
  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    updatePillars(player, Pkm.GURDURR, Pkm.PILLAR_IRON)
  }
  afterSell(player) {
    updatePillars(player, Pkm.GURDURR, Pkm.PILLAR_IRON)
  }
  afterEvolve = pillarEvolve(Pkm.PILLAR_IRON, Pkm.PILLAR_CONCRETE)
}

export class Conkeldurr extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.HUMAN])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 400
  atk = 36
  speed = 39
  def = 16
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.COLUMN_CRUSH
  passive = Passive.PILLAR
  onChangePosition(x: number, y: number, player: Player, state: GameState) {
    super.onChangePosition(x, y, player, state)
    updatePillars(player, Pkm.CONKELDURR, Pkm.PILLAR_CONCRETE)
  }
  afterSell(player) {
    updatePillars(player, Pkm.CONKELDURR, Pkm.PILLAR_CONCRETE)
  }
}

export class PillarWood extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 100
  atk = 0
  speed = 0
  def = 2
  speDef = 2
  maxPP = 10
  range = 1
  skill = Ability.DEFAULT
  passive = Passive.INANIMATE
  canHoldItems = false
  canBeBenched = false
  canBeSold = false
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.status.triggerRuneProtect(30000)
    entity.toIdleState()
  }
}

export class PillarIron extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.SPECIAL
  stars = 2
  hp = 200
  atk = 0
  speed = 0
  def = 6
  speDef = 6
  maxPP = 10
  range = 1
  skill = Ability.DEFAULT
  passive = Passive.INANIMATE
  canHoldItems = false
  canBeBenched = false
  canBeSold = false
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.status.triggerRuneProtect(30000)
    entity.toIdleState()
  }
}

export class PillarConcrete extends Pokemon {
  types = new SetSchema<Synergy>([])
  rarity = Rarity.SPECIAL
  stars = 3
  hp = 300
  atk = 0
  speed = 0
  def = 10
  speDef = 10
  maxPP = 10
  range = 1
  skill = Ability.DEFAULT
  passive = Passive.INANIMATE
  canHoldItems = false
  canBeBenched = false
  canBeSold = false
  onSpawn({ entity }: { entity: IPokemonEntity }) {
    entity.status.tree = true
    entity.status.triggerRuneProtect(30000)
    entity.toIdleState()
  }
}

export class Elgyem extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.MONSTER,
    Synergy.LIGHT
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.BEHEEYEM
  hp = 70
  atk = 8
  speed = 38
  def = 4
  speDef = 4
  maxPP = 90
  range = 2
  skill = Ability.WONDER_ROOM
  additional = true
}

export class Beheeyem extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.MONSTER,
    Synergy.LIGHT
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 18
  speed = 38
  def = 8
  speDef = 8
  maxPP = 90
  range = 2
  skill = Ability.WONDER_ROOM
  additional = true
}

export class Litten extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.TORRACAT
  hp = 90
  atk = 8
  speed = 44
  def = 8
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.DARK_LARIAT
}

export class Torracat extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 2
  evolution = Pkm.INCINEROAR
  hp = 170
  atk = 14
  speed = 44
  def = 12
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.DARK_LARIAT
}

export class Incineroar extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.DARK, Synergy.FIELD])
  rarity = Rarity.EPIC
  stars = 3
  hp = 280
  atk = 24
  speed = 44
  def = 16
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.DARK_LARIAT
}

export class Skrelp extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.POISON,
    Synergy.AQUATIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.DRAGALGE
  hp = 60
  atk = 7
  speed = 39
  def = 2
  speDef = 2
  maxPP = 100
  range = 3
  skill = Ability.SLUDGE_WAVE
  additional = true
}

export class Dragalge extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.POISON,
    Synergy.AQUATIC
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 15
  speed = 39
  def = 4
  speDef = 4
  maxPP = 100
  range = 3
  skill = Ability.SLUDGE_WAVE
  additional = true
}

export class Cubchoo extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FIELD, Synergy.AQUATIC])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.BEARTIC
  hp = 90
  atk = 10
  speed = 41
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.FROST_BREATH
  additional = true
}

export class Beartic extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ICE, Synergy.FIELD, Synergy.AQUATIC])
  rarity = Rarity.EPIC
  stars = 2
  hp = 200
  atk = 26
  speed = 41
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.FROST_BREATH
  additional = true
}

export class Nacli extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GOURMET])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.NACLSTACK
  hp = 80
  atk = 7
  speed = 36
  def = 6
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SALT_CURE
}

export class Naclstack extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GOURMET])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.GARGANACL
  hp = 160
  atk = 13
  speed = 36
  def = 8
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SALT_CURE
}

export class Garganacl extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ROCK, Synergy.GOURMET])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 280
  atk = 24
  speed = 36
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SALT_CURE
}

export class Capsakid extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE, Synergy.GOURMET])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.SCOVILLAIN
  hp = 60
  atk = 6
  speed = 49
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.SPICY_EXTRACT
  additional = true
}

export class Scovillain extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FIRE, Synergy.GOURMET])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  speed = 49
  def = 2
  speDef = 2
  maxPP = 100
  range = 2
  skill = Ability.SPICY_EXTRACT
  additional = true
}

export class Swirlix extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.GOURMET])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.SLURPUFF
  hp = 80
  atk = 9
  speed = 48
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SWEET_SCENT
  additional = true
}

export class Slurpuff extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.GOURMET])
  rarity = Rarity.RARE
  stars = 2
  hp = 190
  atk = 21
  speed = 48
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.SWEET_SCENT
  additional = true
}

export class Gulpin extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.GOURMET,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 1
  evolution = Pkm.SWALOT
  hp = 120
  atk = 7
  speed = 43
  def = 4
  speDef = 4
  maxPP = 60
  range = 1
  skill = Ability.SWALLOW
  additional = true
}

export class Swalot extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.GOURMET,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 280
  atk = 15
  speed = 43
  def = 8
  speDef = 8
  maxPP = 60
  range = 1
  skill = Ability.SWALLOW
  additional = true
}

export class Fidough extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GOURMET,
    Synergy.FAIRY,
    Synergy.FIELD
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.DACHSBUN
  hp = 75
  atk = 7
  speed = 55
  def = 6
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.GROWL
  passive = Passive.WELL_BAKED
  additional = true
}

export class Dachsbun extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.GOURMET,
    Synergy.FAIRY,
    Synergy.FIELD
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 15
  speed = 55
  def = 12
  speDef = 10
  maxPP = 80
  range = 1
  skill = Ability.GROWL
  passive = Passive.WELL_BAKED
  additional = true
}

const alcremieByFlavor: Record<(typeof Flavors)[number], Pkm> = {
  VANILLA_FLAVOR: Pkm.ALCREMIE_VANILLA,
  RUBY_FLAVOR: Pkm.ALCREMIE_RUBY,
  MATCHA_FLAVOR: Pkm.ALCREMIE_MATCHA,
  MINT_FLAVOR: Pkm.ALCREMIE_MINT,
  LEMON_FLAVOR: Pkm.ALCREMIE_LEMON,
  SALTED_FLAVOR: Pkm.ALCREMIE_SALTED,
  RUBY_SWIRL_FLAVOR: Pkm.ALCREMIE_RUBY_SWIRL,
  CARAMEL_SWIRL_FLAVOR: Pkm.ALCREMIE_CARAMEL_SWIRL,
  RAINBOW_SWIRL_FLAVOR: Pkm.ALCREMIE_RAINBOW_SWIRL
} as const

export class Milcery extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 2
  evolutions = [
    Pkm.ALCREMIE_VANILLA,
    Pkm.ALCREMIE_RUBY,
    Pkm.ALCREMIE_MATCHA,
    Pkm.ALCREMIE_MINT,
    Pkm.ALCREMIE_LEMON,
    Pkm.ALCREMIE_SALTED,
    Pkm.ALCREMIE_RUBY_SWIRL,
    Pkm.ALCREMIE_CARAMEL_SWIRL,
    Pkm.ALCREMIE_RAINBOW_SWIRL
  ]
  evolutionRule = new ItemEvolutionRule(
    [...Flavors],
    (pokemon, player, item: Item) => alcremieByFlavor[item]
  )
  hp = 130
  atk = 10
  speed = 41
  def = 2
  speDef = 6
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.CREAM
}

function alcremieOnAcquired(this: IPokemonEntity, player: Player) {
  const flavor = Object.keys(alcremieByFlavor).find(
    (flavor) => alcremieByFlavor[flavor] === this.name
  ) as Item
  removeInArray(player.items, flavor)
  this.items.delete(flavor)
}

export class AlcremieVanilla extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.VANILLA_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieRuby extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.RUBY_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieMatcha extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.MATCHA_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieMint extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.MINT_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieLemon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.LEMON_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieSalted extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.SALTED_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieRubySwirl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.RUBY_SWIRL_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieCaramelSwirl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.CARAMEL_SWIRL_CREAM
  onAcquired = alcremieOnAcquired
}

export class AlcremieRainbowSwirl extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FAIRY,
    Synergy.AMORPHOUS,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 16
  speed = 41
  def = 6
  speDef = 12
  maxPP = 80
  range = 2
  skill = Ability.DECORATE
  passive = Passive.RAINBOW_SWIRL_CREAM
  onAcquired = alcremieOnAcquired
}

export class Pecharunt extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.GHOST,
    Synergy.GOURMET
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 25
  speed = 55
  def = 12
  speDef = 6
  maxPP = 120
  range = 3
  skill = Ability.MALIGNANT_CHAIN
}

export class Veluza extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.WATER,
    Synergy.PSYCHIC,
    Synergy.GOURMET
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 180
  atk = 20
  speed = 45
  def = 5
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.FILLET_AWAY
}

export class Duraludon extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.DRAGON, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 2
  evolution = Pkm.ARCHALUDON
  evolutionRule = new ItemEvolutionRule(ArtificialItems)
  hp = 180
  atk = 18
  speed = 52
  def = 6
  speDef = 6
  maxPP = 110
  range = 2
  skill = Ability.ELECTRO_SHOT
  passive = Passive.DURALUDON
}

export class Archaludon extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.DRAGON,
    Synergy.STEEL,
    Synergy.ELECTRIC
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 20
  speed = 52
  def = 10
  speDef = 10
  maxPP = 110
  range = 2
  skill = Ability.ELECTRO_SHOT
}

export class Fomantis extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLORA,
    Synergy.LIGHT,
    Synergy.FIGHTING
  ])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.LURANTIS
  hp = 70
  atk = 8
  speed = 47
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.SOLAR_BLADE
  additional = true
}

export class Lurantis extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FLORA,
    Synergy.LIGHT,
    Synergy.FIGHTING
  ])
  rarity = Rarity.RARE
  stars = 2
  hp = 170
  atk = 18
  speed = 47
  def = 9
  speDef = 9
  maxPP = 100
  range = 1
  skill = Ability.SOLAR_BLADE
  additional = true
}

export class Charcadet extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.BABY])
  rarity = Rarity.UNIQUE
  stars = 2
  evolutions = [Pkm.ARMAROUGE, Pkm.CERULEDGE]
  evolutionRule = new ItemEvolutionRule(
    [Item.AUSPICIOUS_ARMOR, Item.MALICIOUS_ARMOR],
    (pokemon, player, item_) => {
      const item = item_ as Item
      if (item === Item.AUSPICIOUS_ARMOR) {
        return Pkm.ARMAROUGE
      }
      if (item === Item.MALICIOUS_ARMOR) {
        return Pkm.CERULEDGE
      }
      return Pkm.ARMAROUGE
    }
  )
  hp = 150
  atk = 15
  speed = 33
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.FLAME_CHARGE
  passive = Passive.CHARCADET
  afterSell(player: Player): void {
    removeInArray(player.items, Item.MALICIOUS_ARMOR)
    removeInArray(player.items, Item.AUSPICIOUS_ARMOR)
  }
}

export class Armarouge extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  speed = 51
  def = 8
  speDef = 8
  maxPP = 100
  range = 2
  skill = Ability.ARMOR_CANNON
  onAcquired = (player) => {
    this.items.delete(Item.AUSPICIOUS_ARMOR)
  }
}

export class Ceruledge extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIRE, Synergy.GHOST])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 20
  speed = 51
  def = 10
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.BITTER_BLADE
  onAcquired = (player) => {
    this.items.delete(Item.MALICIOUS_ARMOR)
  }
}

export class Tynamo extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.EELEKTRIK
  hp = 50
  atk = 6
  speed = 41
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.SUCTION_HEAL
  regional = true
}

export class Eelektrik extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  evolution = Pkm.EELEKTROSS
  hp = 150
  atk = 12
  speed = 41
  def = 8
  speDef = 8
  maxPP = 80
  range = 1
  skill = Ability.SUCTION_HEAL
  regional = true
}

export class Eelektross extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.ELECTRIC,
    Synergy.AQUATIC,
    Synergy.AMORPHOUS
  ])
  rarity = Rarity.UNCOMMON
  stars = 3
  hp = 250
  atk = 24
  speed = 41
  def = 12
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.SUCTION_HEAL
  regional = true
}

export class Pidove extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 1
  evolution = Pkm.TRANQUILL
  hp = 60
  atk = 5
  speed = 64
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.ROOST
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 2
  }
}

export class Tranquill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 2
  evolution = Pkm.UNFEZANT
  hp = 110
  atk = 9
  speed = 64
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.ROOST
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 2
  }
}

export class Unfezant extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FLYING])
  rarity = Rarity.COMMON
  stars = 3
  hp = 180
  atk = 19
  speed = 64
  def = 7
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.ROOST
  regional = true
  isInRegion(map: DungeonPMDO, state?: GameState) {
    return Object.keys(DungeonPMDO).indexOf(map) % 3 === 2
  }
}

export class Zacian extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.WILD])
  rarity = Rarity.LEGENDARY
  evolution = Pkm.ZACIAN_CROWNED
  evolutionRule = new ItemEvolutionRule([Item.RUSTED_SWORD])
  stars = 3
  hp = 260
  atk = 22
  speed = 69
  def = 11
  speDef = 11
  maxPP = 100
  range = 1
  skill = Ability.BEHEMOTH_BLADE
  passive = Passive.ZACIAN
}

export class ZacianCrowned extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FAIRY, Synergy.WILD, Synergy.STEEL])
  rarity = Rarity.LEGENDARY
  stars = 4
  hp = 260
  atk = 22
  speed = 69
  def = 12
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.BEHEMOTH_BLADE
}

export class IronValiant extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.FIGHTING,
    Synergy.FAIRY,
    Synergy.ARTIFICIAL
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 25
  speed = 76
  def = 10
  speDef = 6
  maxPP = 50
  range = 1
  skill = Ability.LASER_BLADE
}

export class Grookey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.GRASS])
  rarity = Rarity.ULTRA
  stars = 1
  evolution = Pkm.THWACKEY
  hp = 120
  atk = 17
  speed = 58
  def = 8
  speDef = 6
  maxPP = 60
  range = 1
  skill = Ability.DRUM_BEATING
  passive = Passive.DRUMMER
}

export class Thwackey extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.GRASS])
  rarity = Rarity.ULTRA
  stars = 2
  evolution = Pkm.RILLABOOM
  hp = 250
  atk = 29
  speed = 58
  def = 14
  speDef = 11
  maxPP = 60
  range = 1
  skill = Ability.DRUM_BEATING
  passive = Passive.DRUMMER
}

export class Rillaboom extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.SOUND, Synergy.GRASS])
  rarity = Rarity.ULTRA
  stars = 3
  hp = 400
  atk = 40
  speed = 58
  def = 20
  speDef = 16
  maxPP = 60
  range = 1
  skill = Ability.DRUM_BEATING
  passive = Passive.DRUMMER
}

export class Kubfu extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.BABY])
  rarity = Rarity.UNIQUE
  stars = 2
  evolutions = [Pkm.URSHIFU_RAPID, Pkm.URSHIFU_SINGLE]
  evolutionRule = new ItemEvolutionRule(
    [Item.SCROLL_OF_WATERS, Item.SCROLL_OF_DARKNESS],
    (pokemon, player, item: Item) => {
      return item === Item.SCROLL_OF_WATERS
        ? Pkm.URSHIFU_RAPID
        : Pkm.URSHIFU_SINGLE
    }
  )
  hp = 150
  atk = 15
  speed = 50
  def = 8
  speDef = 6
  maxPP = 90
  range = 1
  skill = Ability.MACH_PUNCH
  passive = Passive.KUBFU
}

export class UrshifuRapid extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.WATER])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 25
  speed = 50
  def = 12
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.SURGING_STRIKES
  onAcquired(player: Player): void {
    removeInArray(player.items, Item.SCROLL_OF_WATERS)
    removeInArray(player.items, Item.SCROLL_OF_DARKNESS)
    this.items.delete(Item.SCROLL_OF_WATERS)
  }
}

export class UrshifuSingle extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.DARK])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 25
  speed = 50
  def = 12
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.WICKED_BLOW
  onAcquired(player: Player): void {
    removeInArray(player.items, Item.SCROLL_OF_WATERS)
    removeInArray(player.items, Item.SCROLL_OF_DARKNESS)
    this.items.delete(Item.SCROLL_OF_DARKNESS)
  }
}

export class ScreamTail extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.PSYCHIC,
    Synergy.FAIRY,
    Synergy.SOUND
  ])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 14
  speed = 71
  def = 8
  speDef = 12
  maxPP = 80
  range = 1
  skill = Ability.BOOMBURST
}

export class IndeedeeFemale extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 190
  atk = 9
  speed = 61
  def = 4
  speDef = 6
  maxPP = 100
  range = 2
  skill = Ability.FOLLOW_ME
}

export class IndeedeeMale extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.PSYCHIC])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 160
  atk = 13
  speed = 61
  def = 2
  speDef = 4
  maxPP = 80
  range = 2
  skill = Ability.AFTER_YOU
}

export class Cottonee extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FAIRY])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.WHIMSICOTT
  hp = 60
  atk = 5
  speed = 74
  def = 4
  speDef = 1
  maxPP = 80
  range = 2
  skill = Ability.COTTON_SPORE
  additional = true
}

export class Whimsicott extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GRASS, Synergy.FAIRY])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 11
  speed = 74
  def = 9
  speDef = 5
  maxPP = 80
  range = 2
  skill = Ability.COTTON_SPORE
  additional = true
}

export class Girafarig extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.PSYCHIC,
    Synergy.FIELD
  ])
  rarity = Rarity.EPIC
  evolution = Pkm.FARIGIRAF
  stars = 1
  hp = 90
  atk = 11
  speed = 39
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.TWIN_BEAM
  additional = true
}

export class Farigiraf extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.NORMAL,
    Synergy.PSYCHIC,
    Synergy.FIELD
  ])
  rarity = Rarity.EPIC
  stars = 2
  hp = 210
  atk = 24
  speed = 39
  def = 6
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.TWIN_BEAM
  additional = true
}

export class Skitty extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  evolution = Pkm.DELCATTY
  stars = 1
  hp = 65
  atk = 6
  speed = 32
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.DISARMING_VOICE
  additional = true
}

export class Delcatty extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FAIRY, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 160
  atk = 14
  speed = 32
  def = 5
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.DISARMING_VOICE
  additional = true
}

export class Glameow extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  evolution = Pkm.PURUGLY
  stars = 1
  hp = 65
  atk = 6
  speed = 70
  def = 3
  speDef = 2
  maxPP = 100
  range = 1
  skill = Ability.SWAGGER
  additional = true
}

export class Purugly extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.DARK])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  speed = 70
  def = 5
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.SWAGGER
  additional = true
}

export class Minccino extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  evolution = Pkm.CINCCINO
  stars = 1
  hp = 60
  atk = 5
  speed = 74
  def = 3
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.ENCORE
  additional = true
  abilitiesCasted: Ability[] = []
  afterSimulationStart(params: {
    player: IPlayer
    simulation: Simulation
    team: MapSchema<IPokemonEntity>
    entity: IPokemonEntity
  }) {
    this.abilitiesCasted = []
    params.team.forEach((pokemon) => {
      if (pokemon.refToBoardPokemon.id !== this.id) {
        pokemon.effectsSet.add(
          new OnAbilityCastEffect(() => {
            this.abilitiesCasted.push(pokemon.skill)
          })
        )
      }
    })
  }
}

export class Cinccino extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 12
  speed = 74
  def = 4
  speDef = 4
  maxPP = 80
  range = 1
  skill = Ability.ENCORE
  additional = true
  abilitiesCasted: Ability[] = []
  afterSimulationStart(params: {
    player: IPlayer
    simulation: Simulation
    team: MapSchema<IPokemonEntity>
    entity: IPokemonEntity
  }) {
    this.abilitiesCasted = []
    params.team.forEach((pokemon) => {
      if (pokemon.refToBoardPokemon.id !== this.id) {
        pokemon.effectsSet.add(
          new OnAbilityCastEffect(() => {
            this.abilitiesCasted.push(pokemon.skill)
          })
        )
      }
    })
  }
}

export class Espurr extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  evolutions = [Pkm.MEOWSTIC_MALE, Pkm.MEOWSTIC_FEMALE]
  evolutionRule = new CountEvolutionRule(
    3,
    (pokemon, player, stageLevel: number) => {
      const psychicCount = player.synergies.get(Synergy.PSYCHIC) ?? 0
      const fieldCount = player.synergies.get(Synergy.FIELD) ?? 0
      return psychicCount >= fieldCount
        ? Pkm.MEOWSTIC_MALE
        : Pkm.MEOWSTIC_FEMALE
    }
  )
  stars = 1
  hp = 80
  atk = 3
  speed = 66
  def = 3
  speDef = 3
  maxPP = 100
  range = 1
  skill = Ability.REFLECT
  passive = Passive.ESPURR
}

export class MeowsticMale extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.PSYCHIC, Synergy.FIELD])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 8
  speed = 66
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.REFLECT
}

export class MeowsticFemale extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.WILD, Synergy.FIELD, Synergy.PSYCHIC])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 8
  speed = 66
  def = 5
  speDef = 5
  maxPP = 100
  range = 1
  skill = Ability.STORED_POWER
}

export class Okidogi extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.FIGHTING,
    Synergy.WILD
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 28
  speed = 51
  def = 12
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.CHAIN_CRAZED
}

export class Munkidori extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.POISON,
    Synergy.PSYCHIC,
    Synergy.HUMAN
  ])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 22
  speed = 68
  def = 10
  speDef = 12
  maxPP = 100
  range = 1
  skill = Ability.MIND_BEND
}

export class Fezandipiti extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.POISON, Synergy.FAIRY, Synergy.SOUND])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 250
  atk = 22
  speed = 63
  def = 10
  speDef = 14
  maxPP = 80
  range = 1
  skill = Ability.DISARMING_VOICE
}

export class Surskit extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.AQUATIC])
  rarity = Rarity.RARE
  stars = 1
  evolution = Pkm.MASQUERAIN
  hp = 70
  atk = 6
  speed = 51
  def = 4
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.AQUA_JET
  additional = true
}

export class Masquerain extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.BUG, Synergy.AQUATIC, Synergy.FLYING])
  rarity = Rarity.RARE
  stars = 2
  hp = 150
  atk = 14
  speed = 51
  def = 6
  speDef = 7
  maxPP = 100
  range = 2
  skill = Ability.SILVER_WIND
  additional = true
}

export class Gossifleur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.ELDEGOSS
  hp = 70
  atk = 5
  speed = 50
  def = 6
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.COTTON_GUARD
  regional = true
}

export class Eldegoss extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FLORA, Synergy.SOUND])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 140
  atk = 9
  speed = 50
  def = 10
  speDef = 14
  maxPP = 100
  range = 1
  skill = Ability.COTTON_GUARD
  regional = true
}

export class Furfrou extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.NORMAL, Synergy.FIELD])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 16
  speed = 65
  def = 8
  speDef = 10
  maxPP = 90
  range = 1
  skill = Ability.COTTON_GUARD
  passive = Passive.FUR_COAT
}

export class Varoom extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.ARTIFICIAL,
    Synergy.POISON
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.REVAVROOM
  hp = 70
  atk = 6
  speed = 50
  def = 3
  speDef = 1
  maxPP = 80
  range = 1
  skill = Ability.SPIN_OUT
  regional = true
  passive = Passive.ACCELERATION
}

export class Revavroom extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.STEEL,
    Synergy.ARTIFICIAL,
    Synergy.POISON
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 150
  atk = 14
  speed = 50
  def = 7
  speDef = 3
  maxPP = 80
  range = 1
  skill = Ability.SPIN_OUT
  regional = true
  passive = Passive.ACCELERATION
}

export class Celesteela extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.STEEL, Synergy.FLYING, Synergy.GRASS])
  rarity = Rarity.LEGENDARY
  stars = 3
  hp = 300
  atk = 30
  speed = 40
  def = 15
  speDef = 15
  maxPP = 100
  range = 1
  skill = Ability.ULTRA_THRUSTERS
}

export class Ledyba extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.BUG,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.UNCOMMON
  stars = 1
  evolution = Pkm.LEDIAN
  hp = 60
  atk = 5
  speed = 55
  def = 2
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.MACH_PUNCH
  additional = true
}

export class Ledian extends Pokemon {
  types = new SetSchema<Synergy>([
    Synergy.BUG,
    Synergy.FIGHTING,
    Synergy.FLYING
  ])
  rarity = Rarity.UNCOMMON
  stars = 2
  hp = 130
  atk = 9
  speed = 55
  def = 4
  speDef = 10
  maxPP = 100
  range = 1
  skill = Ability.MACH_PUNCH
  additional = true
}

export class Emolga extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FLYING])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 20
  speed = 66
  def = 5
  speDef = 5
  maxPP = 100
  range = 2
  skill = Ability.ELECTRO_BALL
}

export class Drilbur extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 1
  hp = 80
  atk = 8
  speed = 56
  def = 4
  speDef = 4
  maxPP = 100
  range = 1
  skill = Ability.DRILL_RUN
  additional = true
}

export class Excadrill extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.GROUND, Synergy.STEEL])
  rarity = Rarity.RARE
  stars = 2
  hp = 180
  atk = 19
  speed = 56
  def = 8
  speDef = 8
  maxPP = 100
  range = 1
  skill = Ability.DRILL_RUN
  additional = true
}

export class Togedemaru extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 17
  speed = 50
  def = 12
  speDef = 8
  maxPP = 90
  range = 1
  skill = Ability.ZING_ZAP
}

export class Dedenne extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.ELECTRIC, Synergy.FAIRY])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 200
  atk = 18
  speed = 50
  def = 10
  speDef = 12
  maxPP = 95
  range = 1
  skill = Ability.STATIC_SHOCK
}

export class FalinksBrass extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.STEEL])
  rarity = Rarity.UNIQUE
  stars = 3
  hp = 150
  atk = 14
  speed = 50
  def = 10
  speDef = 6
  maxPP = 100
  range = 1
  skill = Ability.NO_RETREAT
  passive = Passive.FALINKS
  onAcquired(player: Player): void {
    player.effects.add(EffectEnum.FALINKS_BRASS)
  }
  afterSell(player: Player): void {
    player.effects.delete(EffectEnum.FALINKS_BRASS)
  }
}

export class FalinksTrooper extends Pokemon {
  types = new SetSchema<Synergy>([Synergy.FIGHTING, Synergy.STEEL])
  rarity = Rarity.SPECIAL
  stars = 1
  hp = 30
  atk = 1
  speed = 50
  def = 1
  speDef = 1
  maxPP = 100
  range = 1
  skill = Ability.TACKLE
  onAcquired(player: Player): void {
    player.effects.update(player.synergies, player.board)
  }
  afterSell(player: Player): void {
    player.effects.update(player.synergies, player.board)
  }
}

export const PokemonClasses: Record<
  Pkm,
  new (
    shiny?: boolean,
    emotion?: Emotion
  ) => Pokemon
> = {
  [Pkm.DEFAULT]: Pokemon,
  [Pkm.DITTO]: Ditto,
  [Pkm.BULBASAUR]: Bulbasaur,
  [Pkm.IVYSAUR]: Ivysaur,
  [Pkm.VENUSAUR]: Venusaur,
  [Pkm.CHARMANDER]: Charmander,
  [Pkm.CHARMELEON]: Charmeleon,
  [Pkm.CHARIZARD]: Charizard,
  [Pkm.SQUIRTLE]: Squirtle,
  [Pkm.WARTORTLE]: Wartortle,
  [Pkm.BLASTOISE]: Blastoise,
  [Pkm.SLOWPOKE]: Slowpoke,
  [Pkm.SLOWBRO]: Slowbro,
  [Pkm.SLOWKING]: Slowking,
  [Pkm.GEODUDE]: Geodude,
  [Pkm.GRAVELER]: Graveler,
  [Pkm.GOLEM]: Golem,
  [Pkm.AZURILL]: Azurill,
  [Pkm.MARILL]: Marill,
  [Pkm.AZUMARILL]: Azumarill,
  [Pkm.ZUBAT]: Zubat,
  [Pkm.GOLBAT]: Golbat,
  [Pkm.CROBAT]: Crobat,
  [Pkm.AMPHAROS]: Ampharos,
  [Pkm.MAREEP]: Mareep,
  [Pkm.FLAFFY]: Flaffy,
  [Pkm.CLEFFA]: Cleffa,
  [Pkm.CLEFAIRY]: Clefairy,
  [Pkm.CLEFABLE]: Clefable,
  [Pkm.IGGLYBUFF]: Igglybuff,
  [Pkm.JIGGLYPUFF]: Jigglypuff,
  [Pkm.WIGGLYTUFF]: Wigglytuff,
  [Pkm.CATERPIE]: Caterpie,
  [Pkm.METAPOD]: Metapod,
  [Pkm.BUTTERFREE]: Butterfree,
  [Pkm.WEEDLE]: Weedle,
  [Pkm.KAKUNA]: Kakuna,
  [Pkm.BEEDRILL]: Beedrill,
  [Pkm.PIDGEY]: Pidgey,
  [Pkm.PIDGEOTTO]: Pidgeotto,
  [Pkm.PIDGEOT]: Pidgeot,
  [Pkm.HOPPIP]: Hoppip,
  [Pkm.SKIPLOOM]: Skiploom,
  [Pkm.JUMPLUFF]: Jumpluff,
  [Pkm.SEEDOT]: Seedot,
  [Pkm.NUZLEAF]: Nuzleaf,
  [Pkm.SHIFTRY]: Shiftry,
  [Pkm.STARLY]: Starly,
  [Pkm.STARAVIA]: Staravia,
  [Pkm.STARAPTOR]: Staraptor,
  [Pkm.CHIKORITA]: Chikorita,
  [Pkm.BAYLEEF]: Bayleef,
  [Pkm.MEGANIUM]: Meganium,
  [Pkm.CYNDAQUIL]: Cyndaquil,
  [Pkm.QUILAVA]: Quilava,
  [Pkm.TYPHLOSION]: Typhlosion,
  [Pkm.TOTODILE]: Totodile,
  [Pkm.CROCONAW]: Croconaw,
  [Pkm.FERALIGATR]: Feraligatr,
  [Pkm.TREECKO]: Treecko,
  [Pkm.GROVYLE]: Grovyle,
  [Pkm.SCEPTILE]: Sceptile,
  [Pkm.TORCHIC]: Torchic,
  [Pkm.COMBUSKEN]: Combusken,
  [Pkm.BLAZIKEN]: Blaziken,
  [Pkm.MUDKIP]: Mudkip,
  [Pkm.MARSHTOMP]: Marshtomp,
  [Pkm.SWAMPERT]: Swampert,
  [Pkm.TURTWIG]: Turtwig,
  [Pkm.GROTLE]: Grotle,
  [Pkm.TORTERRA]: Torterra,
  [Pkm.CHIMCHAR]: Chimchar,
  [Pkm.MONFERNO]: Monferno,
  [Pkm.INFERNAPE]: Infernape,
  [Pkm.PIPLUP]: Piplup,
  [Pkm.PRINPLUP]: Prinplup,
  [Pkm.EMPOLEON]: Empoleon,
  [Pkm.NIDORANF]: NidoranF,
  [Pkm.NIDORINA]: Nidorina,
  [Pkm.NIDOQUEEN]: Nidoqueen,
  [Pkm.NIDORANM]: NidoranM,
  [Pkm.NIDORINO]: Nidorino,
  [Pkm.NIDOKING]: Nidoking,
  [Pkm.PICHU]: Pichu,
  [Pkm.PIKACHU]: Pikachu,
  [Pkm.RAICHU]: Raichu,
  [Pkm.MACHOP]: Machop,
  [Pkm.MACHOKE]: Machoke,
  [Pkm.MACHAMP]: Machamp,
  [Pkm.HORSEA]: Horsea,
  [Pkm.SEADRA]: Seadra,
  [Pkm.KINGDRA]: Kingdra,
  [Pkm.TRAPINCH]: Trapinch,
  [Pkm.VIBRAVA]: Vibrava,
  [Pkm.FLYGON]: Flygon,
  [Pkm.SPHEAL]: Spheal,
  [Pkm.SEALEO]: Sealeo,
  [Pkm.WALREIN]: Walrein,
  [Pkm.ARON]: Aron,
  [Pkm.LAIRON]: Lairon,
  [Pkm.AGGRON]: Aggron,
  [Pkm.MAGNEMITE]: Magnemite,
  [Pkm.MAGNETON]: Magneton,
  [Pkm.MAGNEZONE]: Magnezone,
  [Pkm.RHYHORN]: Rhyhorn,
  [Pkm.RHYDON]: Rhydon,
  [Pkm.RHYPERIOR]: Rhyperior,
  [Pkm.TOGEPI]: Togepi,
  [Pkm.TOGETIC]: Togetic,
  [Pkm.TOGEKISS]: Togekiss,
  [Pkm.DUSKULL]: Duskull,
  [Pkm.DUSCLOPS]: Dusclops,
  [Pkm.DUSKNOIR]: Dusknoir,
  [Pkm.LOTAD]: Lotad,
  [Pkm.LOMBRE]: Lombre,
  [Pkm.LUDICOLO]: Ludicolo,
  [Pkm.SHINX]: Shinx,
  [Pkm.LUXIO]: Luxio,
  [Pkm.LUXRAY]: Luxray,
  [Pkm.POLIWAG]: Poliwag,
  [Pkm.POLIWHIRL]: Poliwhirl,
  [Pkm.POLITOED]: Politoed,
  [Pkm.ABRA]: Abra,
  [Pkm.KADABRA]: Kadabra,
  [Pkm.ALAKAZAM]: Alakazam,
  [Pkm.GASTLY]: Gastly,
  [Pkm.HAUNTER]: Haunter,
  [Pkm.GENGAR]: Gengar,
  [Pkm.DRATINI]: Dratini,
  [Pkm.DRAGONAIR]: Dragonair,
  [Pkm.DRAGONITE]: Dragonite,
  [Pkm.LARVITAR]: Larvitar,
  [Pkm.PUPITAR]: Pupitar,
  [Pkm.TYRANITAR]: Tyranitar,
  [Pkm.SLAKOTH]: Slakoth,
  [Pkm.VIGOROTH]: Vigoroth,
  [Pkm.SLAKING]: Slaking,
  [Pkm.RALTS]: Ralts,
  [Pkm.KIRLIA]: Kirlia,
  [Pkm.GARDEVOIR]: Gardevoir,
  [Pkm.BAGON]: Bagon,
  [Pkm.SHELGON]: Shelgon,
  [Pkm.SALAMENCE]: Salamence,
  [Pkm.BELDUM]: Beldum,
  [Pkm.METANG]: Metang,
  [Pkm.METAGROSS]: Metagross,
  [Pkm.GIBLE]: Gible,
  [Pkm.GABITE]: Gabite,
  [Pkm.GARCHOMP]: Garchomp,
  [Pkm.ELEKID]: Elekid,
  [Pkm.ELECTABUZZ]: Electabuzz,
  [Pkm.ELECTIVIRE]: Electivire,
  [Pkm.MAGBY]: Magby,
  [Pkm.MAGMAR]: Magmar,
  [Pkm.MAGMORTAR]: Magmortar,
  [Pkm.MUNCHLAX]: Munchlax,
  [Pkm.SNORLAX]: Snorlax,
  [Pkm.GROWLITHE]: Growlithe,
  [Pkm.ARCANINE]: Arcanine,
  [Pkm.HISUI_GROWLITHE]: HisuiGrowlithe,
  [Pkm.HISUI_ARCANINE]: HisuiArcanine,
  [Pkm.ONIX]: Onix,
  [Pkm.STEELIX]: Steelix,
  //[Pkm.MEGA_STEELIX]: MegaSteelix,
  [Pkm.SCYTHER]: Scyther,
  [Pkm.SCIZOR]: Scizor,
  [Pkm.KLEAVOR]: Kleavor,
  [Pkm.RIOLU]: Riolu,
  [Pkm.LUCARIO]: Lucario,
  [Pkm.MAGIKARP]: Magikarp,
  [Pkm.RATTATA]: Rattata,
  [Pkm.ALOLAN_RATTATA]: AlolanRattata,
  [Pkm.RATICATE]: Raticate,
  [Pkm.ALOLAN_RATICATE]: AlolanRaticate,
  [Pkm.SPEAROW]: Spearow,
  [Pkm.FEAROW]: Fearow,
  [Pkm.GYARADOS]: Gyarados,
  [Pkm.LUGIA]: Lugia,
  [Pkm.SHADOW_LUGIA]: ShadowLugia,
  [Pkm.ZAPDOS]: Zapdos,
  [Pkm.MOLTRES]: Moltres,
  [Pkm.ARTICUNO]: Articuno,
  [Pkm.GALARIAN_ARTICUNO]: GalarianArticuno,
  [Pkm.GALARIAN_ZAPDOS]: GalarianZapdos,
  [Pkm.GALARIAN_MOLTRES]: GalarianMoltres,
  [Pkm.DIALGA]: Dialga,
  [Pkm.PALKIA]: Palkia,
  [Pkm.SUICUNE]: Suicune,
  [Pkm.RAIKOU]: Raikou,
  [Pkm.ENTEI]: Entei,
  [Pkm.KYOGRE]: Kyogre,
  [Pkm.GROUDON]: Groudon,
  [Pkm.RAYQUAZA]: Rayquaza,
  [Pkm.MEGA_RAYQUAZA]: MegaRayquaza,
  [Pkm.REGICE]: Regice,
  [Pkm.REGIROCK]: Regirock,
  [Pkm.REGISTEEL]: Registeel,
  [Pkm.REGIGIGAS]: Regigigas,
  [Pkm.GIRATINA]: Giratina,
  [Pkm.EEVEE]: Eevee,
  [Pkm.VAPOREON]: Vaporeon,
  [Pkm.JOLTEON]: Jolteon,
  [Pkm.FLAREON]: Flareon,
  [Pkm.ESPEON]: Espeon,
  [Pkm.UMBREON]: Umbreon,
  [Pkm.LEAFEON]: Leafeon,
  [Pkm.SYLVEON]: Sylveon,
  [Pkm.GLACEON]: Glaceon,
  [Pkm.MEDITITE]: Meditite,
  [Pkm.MEDICHAM]: Medicham,
  [Pkm.NUMEL]: Numel,
  [Pkm.CAMERUPT]: Camerupt,
  //[Pkm.MEGA_CAMERUPT]: MegaCamerupt,
  [Pkm.DARKRAI]: Darkrai,
  [Pkm.LITWICK]: Litwick,
  [Pkm.LAMPENT]: Lampent,
  [Pkm.CHANDELURE]: Chandelure,
  [Pkm.BELLSPROUT]: Bellsprout,
  [Pkm.WEEPINBELL]: Weepinbell,
  [Pkm.VICTREEBEL]: Victreebel,
  [Pkm.SWINUB]: Swinub,
  [Pkm.PILOSWINE]: Piloswine,
  [Pkm.MAMOSWINE]: Mamoswine,
  [Pkm.SNORUNT]: Snorunt,
  [Pkm.GLALIE]: Glalie,
  [Pkm.FROSLASS]: Froslass,
  [Pkm.SNOVER]: Snover,
  [Pkm.ABOMASNOW]: Abomasnow,
  //[Pkm.MEGA_ABOMASNOW]: MegaAbomasnow,
  [Pkm.VANILLITE]: Vanillite,
  [Pkm.VANILLISH]: Vanillish,
  [Pkm.VANILLUXE]: Vanilluxe,
  [Pkm.LARVESTA]: Larvesta,
  [Pkm.VOLCARONA]: Volcarona,
  [Pkm.LANDORUS]: Landorus,
  [Pkm.THUNDURUS]: Thundurus,
  [Pkm.TORNADUS]: Tornadus,
  [Pkm.ENAMORUS]: Enamorus,
  [Pkm.KELDEO]: Keldeo,
  [Pkm.TERRAKION]: Terrakion,
  [Pkm.VIRIZION]: Virizion,
  [Pkm.COBALION]: Cobalion,
  [Pkm.MANAPHY]: Manaphy,
  [Pkm.PHIONE]: Phione,
  [Pkm.SPIRITOMB]: Spiritomb,
  [Pkm.ABSOL]: Absol,
  [Pkm.LAPRAS]: Lapras,
  [Pkm.LATIAS]: Latias,
  [Pkm.LATIOS]: Latios,
  [Pkm.MESPRIT]: Mesprit,
  [Pkm.AZELF]: Azelf,
  [Pkm.UXIE]: Uxie,
  [Pkm.MEWTWO]: Mewtwo,
  [Pkm.KYUREM]: Kyurem,
  [Pkm.RESHIRAM]: Reshiram,
  [Pkm.ZEKROM]: Zekrom,
  [Pkm.CELEBI]: Celebi,
  [Pkm.VICTINI]: Victini,
  [Pkm.JIRACHI]: Jirachi,
  [Pkm.ARCEUS]: Arceus,
  [Pkm.SHAYMIN]: Shaymin,
  [Pkm.SHAYMIN_SKY]: ShayminSky,
  [Pkm.CRESSELIA]: Cresselia,
  [Pkm.HEATRAN]: Heatran,
  [Pkm.HO_OH]: HooH,
  [Pkm.ROTOM]: Rotom,
  [Pkm.ROTOM_DRONE]: RotomDrone,
  [Pkm.AERODACTYL]: Aerodactyl,
  [Pkm.SWABLU]: Swablu,
  [Pkm.CARVANHA]: Carvanha,
  [Pkm.PRIMAL_KYOGRE]: PrimalKyogre,
  [Pkm.PRIMAL_GROUDON]: PrimalGroudon,
  [Pkm.MEOWTH]: Meowth,
  [Pkm.PERSIAN]: Persian,
  [Pkm.ALOLAN_MEOWTH]: AlolanMeowth,
  [Pkm.ALOLAN_PERSIAN]: AlolanPersian,
  [Pkm.DEINO]: Deino,
  [Pkm.ZWEILOUS]: Zweilous,
  [Pkm.HYDREIGON]: Hydreigon,
  [Pkm.SANDILE]: Sandile,
  [Pkm.KROKOROK]: Krokorok,
  [Pkm.KROOKODILE]: Krookodile,
  [Pkm.SOLOSIS]: Solosis,
  [Pkm.DUOSION]: Duosion,
  [Pkm.REUNICLUS]: Reuniclus,
  [Pkm.ODDISH]: Oddish,
  [Pkm.GLOOM]: Gloom,
  [Pkm.VILEPLUME]: Vileplume,
  [Pkm.BELLOSSOM]: Bellossom,
  [Pkm.AMAURA]: Amaura,
  [Pkm.AURORUS]: Aurorus,
  [Pkm.ANORITH]: Anorith,
  [Pkm.ARMALDO]: Armaldo,
  [Pkm.ARCHEN]: Archen,
  [Pkm.ARCHEOPS]: Archeops,
  [Pkm.SHIELDON]: Shieldon,
  [Pkm.BASTIODON]: Bastiodon,
  //[Pkm.TIRTOUGA]: Tirtouga,
  //[Pkm.CARRACOSTA]: Carracosta,
  [Pkm.LILEEP]: Lileep,
  [Pkm.CRADILY]: Cradily,
  [Pkm.OMANYTE]: Omanyte,
  [Pkm.OMASTAR]: Omastar,
  [Pkm.CRANIDOS]: Cranidos,
  [Pkm.RAMPARDOS]: Rampardos,
  [Pkm.TYRUNT]: Tyrunt,
  [Pkm.TYRANTRUM]: Tyrantrum,
  [Pkm.KABUTO]: Kabuto,
  [Pkm.KABUTOPS]: Kabutops,
  [Pkm.BUDEW]: Budew,
  [Pkm.ROSELIA]: Roselia,
  [Pkm.ROSERADE]: Roserade,
  [Pkm.BUNEARY]: Buneary,
  [Pkm.LOPUNNY]: Lopunny,
  //[Pkm.MEGA_LOPUNNY]: MegaLopunny,
  [Pkm.AXEW]: Axew,
  [Pkm.FRAXURE]: Fraxure,
  [Pkm.HAXORUS]: Haxorus,
  [Pkm.VENIPEDE]: Venipede,
  [Pkm.WHIRLIPEDE]: Whirlipede,
  [Pkm.SCOLIPEDE]: Scolipede,
  [Pkm.PORYGON]: Porygon,
  [Pkm.PORYGON_2]: Porygon2,
  [Pkm.PORYGON_Z]: PorygonZ,
  [Pkm.ELECTRIKE]: Electrike,
  [Pkm.MANECTRIC]: Manectric,
  //[Pkm.MEGA_MANECTRIC]: MegaManectric,
  [Pkm.SHUPPET]: Shuppet,
  [Pkm.BANETTE]: Banette,
  //[Pkm.MEGA_BANETTE]: MegaBanette,
  [Pkm.HONEDGE]: Honedge,
  [Pkm.DOUBLADE]: Doublade,
  [Pkm.AEGISLASH]: Aegislash,
  [Pkm.AEGISLASH_BLADE]: AegislashBlade,
  [Pkm.CUBONE]: Cubone,
  [Pkm.MAROWAK]: Marowak,
  [Pkm.ALOLAN_MAROWAK]: AlolanMarowak,
  [Pkm.WHISMUR]: Whismur,
  [Pkm.LOUDRED]: Loudred,
  [Pkm.EXPLOUD]: Exploud,
  [Pkm.TYMPOLE]: Tympole,
  [Pkm.PALPITOAD]: Palpitoad,
  [Pkm.SEISMITOAD]: Seismitoad,
  [Pkm.SEWADDLE]: Sewaddle,
  [Pkm.SWADLOON]: Swadloon,
  [Pkm.LEAVANNY]: Leavanny,
  //[Pkm.PIKIPEK]: Pikipek,
  //[Pkm.TRUMBEAK]: Trumbeak,
  //[Pkm.TOUCANNON]: Toucannon,
  [Pkm.FLABEBE]: Flabebe,
  [Pkm.FLOETTE]: Floette,
  [Pkm.FLORGES]: Florges,
  [Pkm.JANGMO_O]: JangmoO,
  [Pkm.HAKAMO_O]: HakamoO,
  [Pkm.KOMMO_O]: KommoO,
  [Pkm.MELOETTA]: Meloetta,
  [Pkm.PIROUETTE_MELOETTA]: PirouetteMeloetta,
  [Pkm.ALTARIA]: Altaria,
  //[Pkm.MEGA_ALTARIA]: MegaAltaria,
  [Pkm.CASTFORM]: Castform,
  [Pkm.CASTFORM_SUN]: CastformSun,
  [Pkm.CASTFORM_RAIN]: CastformRain,
  [Pkm.CASTFORM_HAIL]: CastformHail,
  [Pkm.CORPHISH]: Corphish,
  [Pkm.CRAWDAUNT]: Crawdaunt,
  [Pkm.JOLTIK]: Joltik,
  [Pkm.GALVANTULA]: Galvantula,
  [Pkm.GENESECT]: Genesect,
  [Pkm.DIANCIE]: Diancie,
  [Pkm.HATENNA]: Hatenna,
  [Pkm.HATTREM]: Hattrem,
  [Pkm.HATTERENE]: Hatterene,
  [Pkm.FENNEKIN]: Fennekin,
  [Pkm.BRAIXEN]: Braixen,
  [Pkm.DELPHOX]: Delphox,
  [Pkm.MAKUHITA]: Makuhita,
  [Pkm.HARIYAMA]: Hariyama,
  [Pkm.REGIELEKI]: Regieleki,
  [Pkm.REGIDRAGO]: Regidrago,
  [Pkm.GUZZLORD]: Guzzlord,
  [Pkm.ETERNATUS]: Eternatus,
  [Pkm.PONYTA]: Ponyta,
  [Pkm.RAPIDASH]: Rapidash,
  [Pkm.GALARIAN_PONYTA]: GalarianPonyta,
  [Pkm.GALARIAN_RAPIDASH]: GalarianRapidash,
  [Pkm.NINCADA]: Nincada,
  [Pkm.NINJASK]: Ninjask,
  [Pkm.SHEDINJA]: Shedinja,
  [Pkm.NOIBAT]: Noibat,
  [Pkm.NOIVERN]: Noivern,
  [Pkm.PUMPKABOO]: Pumpkaboo,
  [Pkm.GOURGEIST]: Gourgeist,
  [Pkm.CACNEA]: Cacnea,
  [Pkm.CACTURNE]: Cacturne,
  [Pkm.RELICANTH]: Relicanth,
  [Pkm.TAUROS]: Tauros,
  [Pkm.HAPPINY]: Happiny,
  [Pkm.CHANSEY]: Chansey,
  [Pkm.BLISSEY]: Blissey,
  [Pkm.TAPU_KOKO]: TapuKoko,
  [Pkm.TAPU_LELE]: TapuLele,
  [Pkm.STAKATAKA]: Stakataka,
  [Pkm.BLACEPHALON]: Blacephalon,
  [Pkm.HOUNDOUR]: Houndour,
  [Pkm.HOUNDOOM]: Houndoom,
  //[Pkm.MEGA_HOUNDOOM]: MegaHoundoom,
  [Pkm.CLAMPERL]: Clamperl,
  [Pkm.HUNTAIL]: Huntail,
  [Pkm.GOREBYSS]: Gorebyss,
  [Pkm.SMOOCHUM]: Smoochum,
  [Pkm.JYNX]: Jynx,
  [Pkm.SALANDIT]: Salandit,
  [Pkm.SALAZZLE]: Salazzle,
  [Pkm.VENONAT]: Venonat,
  [Pkm.VENOMOTH]: Venomoth,
  [Pkm.VOLTORB]: Voltorb,
  [Pkm.ELECTRODE]: Electrode,
  [Pkm.SLUGMA]: Slugma,
  [Pkm.MAGCARGO]: Magcargo,
  [Pkm.SNEASEL]: Sneasel,
  [Pkm.WEAVILE]: Weavile,
  [Pkm.CROAGUNK]: Croagunk,
  [Pkm.TOXICROAK]: Toxicroak,
  [Pkm.CHINCHOU]: Chinchou,
  [Pkm.LANTURN]: Lanturn,
  [Pkm.POOCHYENA]: Poochyena,
  [Pkm.MIGHTYENA]: Mightyena,
  [Pkm.BRONZOR]: Bronzor,
  [Pkm.BRONZONG]: Bronzong,
  [Pkm.DRIFLOON]: Drifloon,
  [Pkm.DRIFBLIM]: Drifblim,
  [Pkm.SHROOMISH]: Shroomish,
  [Pkm.BRELOOM]: Breloom,
  [Pkm.TENTACOOL]: Tentacool,
  [Pkm.TENTACRUEL]: Tentacruel,
  [Pkm.SNUBULL]: Snubull,
  [Pkm.GRANBULL]: Granbull,
  [Pkm.SEVIPER]: Seviper,
  [Pkm.VULPIX]: Vulpix,
  [Pkm.NINETALES]: Ninetales,
  [Pkm.ALOLAN_VULPIX]: AlolanVulpix,
  [Pkm.ALOLAN_NINETALES]: AlolanNinetales,
  [Pkm.MAWILE]: Mawile,
  [Pkm.BUIZEL]: Buizel,
  [Pkm.FLOATZEL]: Floatzel,
  [Pkm.KECLEON]: Kecleon,
  [Pkm.CARBINK]: Carbink,
  [Pkm.CHATOT]: Chatot,
  [Pkm.GOOMY]: Goomy,
  [Pkm.SLIGOO]: Sligoo,
  [Pkm.GOODRA]: Goodra,
  [Pkm.HISUI_SLIGGOO]: HisuiSliggoo,
  [Pkm.HISUI_GOODRA]: HisuiGoodra,
  [Pkm.MEW]: Mew,
  [Pkm.BOUNSWEET]: Bounsweet,
  [Pkm.STEENEE]: Steenee,
  [Pkm.TSAREENA]: Tsareena,
  [Pkm.VOLCANION]: Volcanion,
  [Pkm.APPLIN]: Applin,
  [Pkm.APPLETUN]: Appletun,
  [Pkm.FLAPPLE]: Flapple,
  [Pkm.DIPPLIN]: Dipplin,
  [Pkm.HYDRAPPLE]: Hydrapple,
  [Pkm.OSHAWOTT]: Oshawott,
  [Pkm.DEWOTT]: Dewott,
  [Pkm.SAMUROTT]: Samurott,
  [Pkm.SNOM]: Snom,
  [Pkm.FROSMOTH]: Frosmoth,
  [Pkm.WAILMER]: Wailmer,
  [Pkm.WAILORD]: Wailord,
  [Pkm.DREEPY]: Dreepy,
  [Pkm.DRAKLOAK]: Drakloak,
  [Pkm.DRAGAPULT]: Dragapult,
  [Pkm.SNIVY]: Snivy,
  [Pkm.SERVINE]: Servine,
  [Pkm.SERPERIOR]: Serperior,
  [Pkm.POPPLIO]: Popplio,
  [Pkm.BRIONNE]: Brionne,
  [Pkm.PRIMARINA]: Primarina,
  [Pkm.GOTHITA]: Gothita,
  [Pkm.GOTHORITA]: Gothorita,
  [Pkm.GOTHITELLE]: Gothitelle,
  [Pkm.SCORBUNNY]: Scorbunny,
  [Pkm.RABOOT]: Raboot,
  [Pkm.CINDERACE]: Cinderace,
  [Pkm.SANDSHREW]: Sandshrew,
  [Pkm.SANDSLASH]: Sandslash,
  [Pkm.ALOLAN_SANDSHREW]: AlolanSandshrew,
  [Pkm.ALOLAN_SANDSLASH]: AlolanSandslash,
  [Pkm.FARFETCH_D]: Farfetchd,
  [Pkm.GALARIAN_FARFETCH_D]: GalarianFarfetchd,
  [Pkm.UNOWN_A]: UnownA,
  [Pkm.UNOWN_B]: UnownB,
  [Pkm.UNOWN_C]: UnownC,
  [Pkm.UNOWN_D]: UnownD,
  [Pkm.UNOWN_E]: UnownE,
  [Pkm.UNOWN_F]: UnownF,
  [Pkm.UNOWN_G]: UnownG,
  [Pkm.UNOWN_H]: UnownH,
  [Pkm.UNOWN_I]: UnownI,
  [Pkm.UNOWN_J]: UnownJ,
  [Pkm.UNOWN_K]: UnownK,
  [Pkm.UNOWN_L]: UnownL,
  [Pkm.UNOWN_M]: UnownM,
  [Pkm.UNOWN_N]: UnownN,
  [Pkm.UNOWN_O]: UnownO,
  [Pkm.UNOWN_P]: UnownP,
  [Pkm.UNOWN_Q]: UnownQ,
  [Pkm.UNOWN_R]: UnownR,
  [Pkm.UNOWN_S]: UnownS,
  [Pkm.UNOWN_T]: UnownT,
  [Pkm.UNOWN_U]: UnownU,
  [Pkm.UNOWN_V]: UnownV,
  [Pkm.UNOWN_W]: UnownW,
  [Pkm.UNOWN_X]: UnownX,
  [Pkm.UNOWN_Y]: UnownY,
  [Pkm.UNOWN_Z]: UnownZ,
  [Pkm.UNOWN_QUESTION]: UnownQuestion,
  [Pkm.UNOWN_EXCLAMATION]: UnownExclamation,
  [Pkm.EGG]: Egg,
  [Pkm.TAPU_FINI]: TapuFini,
  [Pkm.TAPU_BULU]: TapuBulu,
  [Pkm.DIGLETT]: Diglett,
  [Pkm.ALOLAN_DIGLETT]: AlolanDiglett,
  [Pkm.DUGTRIO]: Dugtrio,
  [Pkm.ALOLAN_DUGTRIO]: AlolanDugtrio,
  [Pkm.ROWLET]: Rowlet,
  [Pkm.DARTIX]: Dartix,
  [Pkm.DECIDUEYE]: Decidueye,
  [Pkm.ZORUA]: Zorua,
  [Pkm.ZOROARK]: Zoroark,
  [Pkm.HISUI_ZORUA]: HisuiZorua,
  [Pkm.HISUI_ZOROARK]: HisuiZoroark,
  [Pkm.FROAKIE]: Froakie,
  [Pkm.FROGADIER]: Frogadier,
  [Pkm.GRENINJA]: Greninja,
  [Pkm.TYROGUE]: Tyrogue,
  [Pkm.HITMONLEE]: Hitmonlee,
  [Pkm.HITMONCHAN]: Hitmonchan,
  [Pkm.HITMONTOP]: Hitmontop,
  [Pkm.MIMIKYU]: Mimikyu,
  [Pkm.MIMIKYU_BUSTED]: MimikyuBusted,
  [Pkm.GRIMER]: Grimer,
  [Pkm.MUK]: Muk,
  [Pkm.ALOLAN_GRIMER]: AlolanGrimer,
  [Pkm.ALOLAN_MUK]: AlolanMuk,
  [Pkm.SHARPEDO]: Sharpedo,
  [Pkm.PINECO]: Pineco,
  [Pkm.FORRETRESS]: Forretress,
  [Pkm.SEEL]: Seel,
  [Pkm.DEWGONG]: Dewgong,
  [Pkm.ALOLAN_GEODUDE]: AlolanGeodude,
  [Pkm.ALOLAN_GRAVELER]: AlolanGraveler,
  [Pkm.ALOLAN_GOLEM]: AlolanGolem,
  [Pkm.EKANS]: Ekans,
  [Pkm.ARBOK]: Arbok,
  [Pkm.MIME_JR]: MimeJr,
  [Pkm.MR_MIME]: MrMime,
  [Pkm.ORIGIN_GIRATINA]: OriginGiratina,
  [Pkm.MELMETAL]: Melmetal,
  [Pkm.HOOPA]: Hoopa,
  [Pkm.HOOPA_UNBOUND]: HoopaUnbound,
  [Pkm.ZERAORA]: Zeraora,
  [Pkm.XERNEAS]: Xerneas,
  [Pkm.YVELTAL]: Yveltal,
  [Pkm.MARSHADOW]: Marshadow,
  [Pkm.HOOTHOOT]: Hoothoot,
  [Pkm.NOCTOWL]: Noctowl,
  [Pkm.BONSLEY]: Bonsley,
  [Pkm.SUDOWOODO]: Sudowoodo,
  [Pkm.COMBEE]: Combee,
  [Pkm.VESPIQUEEN]: Vespiqueen,
  [Pkm.SHUCKLE]: Shuckle,
  [Pkm.TEPIG]: Tepig,
  [Pkm.PIGNITE]: Pignite,
  [Pkm.EMBOAR]: Emboar,
  [Pkm.WYNAUT]: Wynaut,
  [Pkm.WOBBUFFET]: Wobbuffet,
  [Pkm.LUNATONE]: Lunatone,
  [Pkm.SOLROCK]: Solrock,
  [Pkm.POLIWRATH]: Poliwrath,
  [Pkm.WURMPLE]: Wurmple,
  [Pkm.SILCOON]: Silcoon,
  [Pkm.BEAUTIFLY]: Beautifly,
  [Pkm.CASCOON]: Cascoon,
  [Pkm.DUSTOX]: Dustox,
  [Pkm.TINKATINK]: Tinkatink,
  [Pkm.TINKATUFF]: Tinkatuff,
  [Pkm.TINKATON]: Tinkaton,
  [Pkm.PARAS]: Paras,
  [Pkm.PARASECT]: Parasect,
  [Pkm.MILTANK]: Miltank,
  [Pkm.MANKEY]: Mankey,
  [Pkm.PRIMEAPE]: Primeape,
  [Pkm.ANNIHILAPE]: Annihilape,
  [Pkm.SUNKERN]: Sunkern,
  [Pkm.SUNFLORA]: Sunflora,
  [Pkm.MARACTUS]: Maractus,
  [Pkm.PLUSLE]: Plusle,
  [Pkm.MINUN]: Minun,
  [Pkm.PINSIR]: Pinsir,
  [Pkm.NATU]: Natu,
  [Pkm.XATU]: Xatu,
  [Pkm.GLIGAR]: Gligar,
  [Pkm.GLISCOR]: Gliscor,
  [Pkm.SHELLDER]: Shellder,
  [Pkm.CLOYSTER]: Cloyster,
  [Pkm.SENTRET]: Sentret,
  [Pkm.FURRET]: Furret,
  [Pkm.SPECTRIER]: Spectrier,
  [Pkm.TORKOAL]: Torkoal,
  [Pkm.DELIBIRD]: Delibird,
  [Pkm.IRON_BUNDLE]: IronBundle,
  [Pkm.KARTANA]: Kartana,
  [Pkm.CHINGLING]: Chingling,
  [Pkm.CHIMECHO]: Chimecho,
  [Pkm.ALOLAN_RAICHU]: AlolanRaichu,
  [Pkm.DHELMISE]: Dhelmise,
  [Pkm.KOFFING]: Koffing,
  [Pkm.WEEZING]: Weezing,
  [Pkm.STARYU]: Staryu,
  [Pkm.STARMIE]: Starmie,
  [Pkm.NOSEPASS]: Nosepass,
  [Pkm.PROBOPASS]: Probopass,
  [Pkm.WOOBAT]: Woobat,
  [Pkm.SWOOBAT]: Swoobat,
  [Pkm.CLAUNCHER]: Clauncher,
  [Pkm.CLAWITZER]: Clawitzer,
  [Pkm.YANMA]: Yanma,
  [Pkm.YANMEGA]: Yanmega,
  [Pkm.HELIOPTILE]: Helioptile,
  [Pkm.HELIOLISK]: Heliolisk,
  [Pkm.BIDOOF]: Bidoof,
  [Pkm.BIBAREL]: Bibarel,
  [Pkm.SPINDA]: Spinda,
  [Pkm.BALTOY]: Baltoy,
  [Pkm.CLAYDOL]: Claydol,
  [Pkm.HERACROSS]: Heracross,
  [Pkm.PURRLOIN]: Purrloin,
  [Pkm.LIEPARD]: Liepard,
  [Pkm.BARBOACH]: Barboach,
  [Pkm.WHISCASH]: Whiscash,
  [Pkm.SCRAGGY]: Scraggy,
  [Pkm.SCRAFTY]: Scrafty,
  [Pkm.FINNEON]: Finneon,
  [Pkm.LUMINEON]: Lumineon,
  [Pkm.STUNKY]: Stunky,
  [Pkm.SKUNTANK]: Skuntank,
  [Pkm.ILLUMISE]: Illumise,
  [Pkm.VOLBEAT]: Volbeat,
  [Pkm.NECROZMA]: Necrozma,
  [Pkm.ULTRA_NECROZMA]: UltraNecrozma,
  [Pkm.CHERUBI]: Cherubi,
  [Pkm.CHERRIM]: Cherrim,
  [Pkm.CHERRIM_SUNLIGHT]: CherrimSunlight,
  [Pkm.MISDREAVUS]: Misdreavus,
  [Pkm.MISMAGIUS]: Mismagius,
  [Pkm.DODUO]: Doduo,
  [Pkm.DODRIO]: Dodrio,
  [Pkm.XURKITREE]: Xurkitree,
  [Pkm.TANDEMAUS]: Tandemaus,
  [Pkm.MAUSHOLD_THREE]: MausholdThree,
  [Pkm.MAUSHOLD_FOUR]: MausholdFour,
  [Pkm.KRICKETOT]: Kricketot,
  [Pkm.KRICKETUNE]: Kricketune,
  [Pkm.HIPPOPOTAS]: Hippopotas,
  [Pkm.HIPPODOWN]: Hippodown,
  [Pkm.WINGULL]: Wingull,
  [Pkm.PELIPPER]: Pelipper,
  [Pkm.NIHILEGO]: Nihilego,
  [Pkm.SOBBLE]: Sobble,
  [Pkm.DRIZZILE]: Drizzile,
  [Pkm.INTELEON]: Inteleon,
  [Pkm.TROPIUS]: Tropius,
  [Pkm.EXEGGCUTE]: Exeggcute,
  [Pkm.EXEGGUTOR]: Exeggutor,
  [Pkm.ALOLAN_EXEGGUTOR]: AlolanExeggutor,
  [Pkm.COMFEY]: Comfey,
  [Pkm.CARNIVINE]: Carnivine,
  [Pkm.HISUIAN_QWILFISH]: HisuianQwilfish,
  [Pkm.OVERQWIL]: Overqwil,
  [Pkm.HISUIAN_TYPHLOSION]: HisuianTyphlosion,
  [Pkm.LILLIPUP]: Lillipup,
  [Pkm.HERDIER]: Herdier,
  [Pkm.STOUTLAND]: Stoutland,
  [Pkm.ZIGZAGOON]: Zigzagoon,
  [Pkm.LINOONE]: Linoone,
  [Pkm.GALARIAN_ZIGZAGOON]: GalarianZigzagoon,
  [Pkm.GALARIAN_LINOONE]: GalarianLinoone,
  [Pkm.OBSTAGOON]: Obstagoon,
  [Pkm.PHEROMOSA]: Pheromosa,
  [Pkm.SABLEYE]: Sableye,
  [Pkm.MEGA_SABLEYE]: MegaSableye,
  [Pkm.DRACOVISH]: Dracovish,
  [Pkm.DRACOZOLT]: Dracozolt,
  [Pkm.ARCTOVISH]: Arctovish,
  [Pkm.ARCTOZOLT]: Arctozolt,
  [Pkm.CORSOLA]: Corsola,
  [Pkm.GALAR_CORSOLA]: GalarCorsola,
  [Pkm.CURSOLA]: Cursola,
  [Pkm.GIMMIGHOUL]: Gimmighoul,
  [Pkm.GHOLDENGO]: Gholdengo,
  [Pkm.PHANTUMP]: Phantump,
  [Pkm.TREVENANT]: Trevenant,
  [Pkm.SMEARGLE]: Smeargle,
  [Pkm.TOXEL]: Toxel,
  [Pkm.TOXTRICITY]: Toxtricity,
  [Pkm.BRUXISH]: Bruxish,
  [Pkm.SUBSTITUTE]: Substitute,
  [Pkm.CYCLIZAR]: Cyclizar,
  [Pkm.PAWNIARD]: Pawniard,
  [Pkm.BISHARP]: Bisharp,
  [Pkm.KINGAMBIT]: Kingambit,
  [Pkm.MINIOR]: Minior,
  [Pkm.MINIOR_KERNEL_RED]: MiniorKernelRed,
  [Pkm.MINIOR_KERNEL_BLUE]: MiniorKernelBlue,
  [Pkm.MINIOR_KERNEL_ORANGE]: MiniorKernelOrange,
  [Pkm.MINIOR_KERNEL_GREEN]: MiniorKernelGreen,
  [Pkm.FEEBAS]: Feebas,
  [Pkm.MILOTIC]: Milotic,
  [Pkm.MORPEKO]: Morpeko,
  [Pkm.MORPEKO_HANGRY]: MorpekoHangry,
  [Pkm.KANGASKHAN]: Kangaskhan,
  [Pkm.TEDDIURSA]: Teddiursa,
  [Pkm.URSARING]: Ursaring,
  [Pkm.URSALUNA]: Ursaluna,
  [Pkm.URSALUNA_BLOODMOON]: UrsalunaBloodmoon,
  [Pkm.AIPOM]: Aipom,
  [Pkm.AMBIPOM]: Ambipom,
  [Pkm.DEERLING]: Deerling,
  [Pkm.SAWSBUCK]: Sawsbuck,
  [Pkm.LICKITUNG]: Lickitung,
  [Pkm.LICKILICKY]: Lickilicky,
  [Pkm.PATRAT]: Patrat,
  [Pkm.WATCHOG]: Watchog,
  [Pkm.SPINARAK]: Spinarak,
  [Pkm.ARIADOS]: Ariados,
  [Pkm.TYPE_NULL]: TypeNull,
  [Pkm.SILVALLY]: Silvally,
  [Pkm.DEWPIDER]: Dewpider,
  [Pkm.ARAQUANID]: Araquanid,
  [Pkm.ROCKRUFF]: Rockruff,
  [Pkm.LYCANROC_DAY]: LycanrocDay,
  [Pkm.LYCANROC_DUSK]: LycanrocDusk,
  [Pkm.LYCANROC_NIGHT]: LycanrocNight,
  [Pkm.DRUDDIGON]: Druddigon,
  [Pkm.COSMOG]: Cosmog,
  [Pkm.COSMOEM]: Cosmoem,
  [Pkm.SOLGALEO]: Solgaleo,
  [Pkm.LUNALA]: Lunala,
  [Pkm.MAGEARNA]: Magearna,
  [Pkm.IMPIDIMP]: Impidimp,
  [Pkm.MORGREM]: Morgrem,
  [Pkm.GRIMMSNARL]: Grimmsnarl,
  [Pkm.DEOXYS]: Deoxys,
  [Pkm.DEOXYS_DEFENSE]: DeoxysDefense,
  [Pkm.DEOXYS_ATTACK]: DeoxysAttack,
  [Pkm.DEOXYS_SPEED]: DeoxysSpeed,
  [Pkm.CRABRAWLER]: Crabrawler,
  [Pkm.CRABOMINABLE]: Crabominable,
  [Pkm.CUTIEFLY]: Cutiefly,
  [Pkm.RIBOMBEE]: Ribombee,
  [Pkm.ZANGOOSE]: Zangoose,
  [Pkm.NICKIT]: Nickit,
  [Pkm.THIEVUL]: Thievul,
  [Pkm.DROWZEE]: Drowzee,
  [Pkm.HYPNO]: Hypno,
  [Pkm.WATTREL]: Wattrel,
  [Pkm.KILOWATTREL]: Kilowattrel,
  [Pkm.STANTLER]: Stantler,
  [Pkm.BURMY_PLANT]: BurmyPlant,
  [Pkm.BURMY_SANDY]: BurmySandy,
  [Pkm.BURMY_TRASH]: BurmyTrash,
  [Pkm.WORMADAM_PLANT]: WormadamPlant,
  [Pkm.WORMADAM_SANDY]: WormadamSandy,
  [Pkm.WORMADAM_TRASH]: WormadamTrash,
  [Pkm.MOTHIM]: Mothim,
  [Pkm.WOOPER]: Wooper,
  [Pkm.QUAGSIRE]: Quagsire,
  [Pkm.PALDEA_WOOPER]: PaldeaWooper,
  [Pkm.CLODSIRE]: Clodsire,
  [Pkm.FUECOCO]: Fuecoco,
  [Pkm.CROCALOR]: Crocalor,
  [Pkm.SKELEDIRGE]: Skeledirge,
  [Pkm.TANGELA]: Tangela,
  [Pkm.TANGROWTH]: Tangrowth,
  [Pkm.PSYDUCK]: Psyduck,
  [Pkm.GOLDUCK]: Golduck,
  [Pkm.PHANPY]: Phanpy,
  [Pkm.DONPHAN]: Donphan,
  [Pkm.SPOINK]: Spoink,
  [Pkm.GRUMPIG]: Grumpig,
  [Pkm.SINISTEA]: Sinistea,
  [Pkm.POLTEAGEIST]: Polteageist,
  [Pkm.FERROSEED]: Ferroseed,
  [Pkm.FERROTHORN]: Ferrothorn,
  [Pkm.GOLETT]: Golett,
  [Pkm.GOLURK]: Golurk,
  [Pkm.TRUBBISH]: Trubbish,
  [Pkm.GARBODOR]: Garbodor,
  [Pkm.GRUBBIN]: Grubbin,
  [Pkm.CHARJABUG]: Charjabug,
  [Pkm.VIKAVOLT]: Vikavolt,
  [Pkm.SHELLOS_WEST_SEA]: ShellosWestSea,
  [Pkm.GASTRODON_WEST_SEA]: GastrodonWestSea,
  [Pkm.SHELLOS_EAST_SEA]: ShellosEastSea,
  [Pkm.GASTRODON_EAST_SEA]: GastrodonEastSea,
  [Pkm.MUNNA]: Munna,
  [Pkm.MUSHARNA]: Musharna,
  [Pkm.RUFFLET]: Rufflet,
  [Pkm.BRAVIARY]: Braviary,
  [Pkm.HEATMOR]: Heatmor,
  [Pkm.KLEFKI]: Klefki,
  [Pkm.HAWLUCHA]: Hawlucha,
  [Pkm.MIENFOO]: Mienfoo,
  [Pkm.MIENSHAO]: Mienshao,
  [Pkm.STONJOURNER]: Stonjourner,
  [Pkm.HISUI_SNEASEL]: HisuiSneasel,
  [Pkm.SNEASLER]: Sneasler,
  [Pkm.PYUKUMUKU]: Pyukumuku,
  [Pkm.POIPOLE]: Poipole,
  [Pkm.NAGANADEL]: Naganadel,
  [Pkm.CRAMORANT]: Cramorant,
  [Pkm.ARROKUDA]: Arrokuda,
  [Pkm.WISHIWASHI]: Wishiwashi,
  [Pkm.WISHIWASHI_SCHOOL]: WishiwashiSchool,
  [Pkm.PAWMI]: Pawmi,
  [Pkm.PAWMO]: Pawmo,
  [Pkm.PAWMOT]: Pawmot,
  [Pkm.GOLDEEN]: Goldeen,
  [Pkm.SEAKING]: Seaking,
  [Pkm.LUVDISC]: Luvdisc,
  [Pkm.AUDINO]: Audino,
  [Pkm.PETILIL]: Petilil,
  [Pkm.LILIGANT]: Lilligant,
  [Pkm.MANTYKE]: Mantyke,
  [Pkm.MANTINE]: Mantine,
  [Pkm.REMORAID]: Remoraid,
  [Pkm.OCTILLERY]: Octillery,
  [Pkm.SIGILYPH]: Sigilyph,
  [Pkm.FRIGIBAX]: Frigibax,
  [Pkm.ARCTIBAX]: Arctibax,
  [Pkm.BAXCALIBUR]: Baxcalibur,
  [Pkm.BINACLE]: Binacle,
  [Pkm.BARBARACLE]: Barbaracle,
  [Pkm.SKARMORY]: Skarmory,
  [Pkm.DURANT]: Durant,
  [Pkm.OGERPON_TEAL]: OgerponTeal,
  [Pkm.OGERPON_TEAL_MASK]: OgerponTealMask,
  [Pkm.OGERPON_WELLSPRING]: OgerponWellspring,
  [Pkm.OGERPON_WELLSPRING_MASK]: OgerponWellspringMask,
  [Pkm.OGERPON_HEARTHFLAME]: OgerponHearthflame,
  [Pkm.OGERPON_HEARTHFLAME_MASK]: OgerponHearthflameMask,
  [Pkm.OGERPON_CORNERSTONE]: OgerponCornerstone,
  [Pkm.OGERPON_CORNERSTONE_MASK]: OgerponCornerstoneMask,
  [Pkm.IRON_HANDS]: IronHands,
  [Pkm.ROOKIDEE]: Rookidee,
  [Pkm.CORVISQUIRE]: Corvisquire,
  [Pkm.CORVIKNIGHT]: Corviknight,
  [Pkm.MURKROW]: Murkrow,
  [Pkm.HONCHKROW]: Honchkrow,
  [Pkm.TURTONATOR]: Turtonator,
  [Pkm.SANDYGAST]: Sandygast,
  [Pkm.PALOSSAND]: Palossand,
  [Pkm.SKORUPI]: Skorupi,
  [Pkm.DRAPION]: Drapion,
  [Pkm.DARUMAKA]: Darumaka,
  [Pkm.DARMANITAN]: Darmanitan,
  [Pkm.DARMANITAN_ZEN]: DarmanitanZen,
  [Pkm.KRABBY]: Krabby,
  [Pkm.KINGLER]: Kingler,
  [Pkm.ZYGARDE_10]: Zygarde10,
  [Pkm.ZYGARDE_50]: Zygarde50,
  [Pkm.ZYGARDE_100]: Zygarde100,
  [Pkm.SIZZLIPEDE]: Sizzlipede,
  [Pkm.CENTISKORCH]: Centiskorch,
  [Pkm.STUFFUL]: Stufful,
  [Pkm.BEWEAR]: Bewear,
  [Pkm.GLIMMET]: Glimmet,
  [Pkm.GLIMMORA]: Glimmora,
  [Pkm.FLETCHLING]: Fletchling,
  [Pkm.FLETCHINDER]: Fletchinder,
  [Pkm.TALONFLAME]: Talonflame,
  [Pkm.VULLABY]: Vullaby,
  [Pkm.MANDIBUZZ]: Mandibuzz,
  [Pkm.INKAY]: Inkay,
  [Pkm.MALAMAR]: Malamar,
  [Pkm.HISUI_VOLTORB]: HisuiVoltorb,
  [Pkm.HISUI_ELECTRODE]: HisuiElectrode,
  [Pkm.TIMBURR]: Timburr,
  [Pkm.GURDURR]: Gurdurr,
  [Pkm.CONKELDURR]: Conkeldurr,
  [Pkm.PILLAR_WOOD]: PillarWood,
  [Pkm.PILLAR_IRON]: PillarIron,
  [Pkm.PILLAR_CONCRETE]: PillarConcrete,
  [Pkm.ELGYEM]: Elgyem,
  [Pkm.BEHEEYEM]: Beheeyem,
  [Pkm.LITTEN]: Litten,
  [Pkm.TORRACAT]: Torracat,
  [Pkm.INCINEROAR]: Incineroar,
  [Pkm.CRYOGONAL]: Cryogonal,
  [Pkm.DRAMPA]: Drampa,
  [Pkm.SKRELP]: Skrelp,
  [Pkm.DRAGALGE]: Dragalge,
  [Pkm.CUBCHOO]: Cubchoo,
  [Pkm.BEARTIC]: Beartic,
  [Pkm.NACLI]: Nacli,
  [Pkm.NACLSTACK]: Naclstack,
  [Pkm.GARGANACL]: Garganacl,
  [Pkm.CAPSAKID]: Capsakid,
  [Pkm.SCOVILLAIN]: Scovillain,
  [Pkm.SWIRLIX]: Swirlix,
  [Pkm.SLURPUFF]: Slurpuff,
  [Pkm.GULPIN]: Gulpin,
  [Pkm.SWALOT]: Swalot,
  [Pkm.FIDOUGH]: Fidough,
  [Pkm.DACHSBUN]: Dachsbun,
  [Pkm.MILCERY]: Milcery,
  [Pkm.ALCREMIE_VANILLA]: AlcremieVanilla,
  [Pkm.ALCREMIE_RUBY]: AlcremieRuby,
  [Pkm.ALCREMIE_MATCHA]: AlcremieMatcha,
  [Pkm.ALCREMIE_MINT]: AlcremieMint,
  [Pkm.ALCREMIE_LEMON]: AlcremieLemon,
  [Pkm.ALCREMIE_SALTED]: AlcremieSalted,
  [Pkm.ALCREMIE_RUBY_SWIRL]: AlcremieRubySwirl,
  [Pkm.ALCREMIE_CARAMEL_SWIRL]: AlcremieCaramelSwirl,
  [Pkm.ALCREMIE_RAINBOW_SWIRL]: AlcremieRainbowSwirl,
  [Pkm.PECHARUNT]: Pecharunt,
  [Pkm.VELUZA]: Veluza,
  [Pkm.DURALUDON]: Duraludon,
  [Pkm.ARCHALUDON]: Archaludon,
  [Pkm.SPRIGATITO]: Sprigatito,
  [Pkm.FLORAGATO]: Floragato,
  [Pkm.MEOWSCARADA]: Meowscarada,
  [Pkm.FOMANTIS]: Fomantis,
  [Pkm.LURANTIS]: Lurantis,
  [Pkm.ROARING_MOON]: RoaringMoon,
  [Pkm.CHARCADET]: Charcadet,
  [Pkm.ARMAROUGE]: Armarouge,
  [Pkm.CERULEDGE]: Ceruledge,
  [Pkm.TYNAMO]: Tynamo,
  [Pkm.EELEKTRIK]: Eelektrik,
  [Pkm.EELEKTROSS]: Eelektross,
  [Pkm.PIDOVE]: Pidove,
  [Pkm.TRANQUILL]: Tranquill,
  [Pkm.UNFEZANT]: Unfezant,
  [Pkm.ZACIAN]: Zacian,
  [Pkm.ZACIAN_CROWNED]: ZacianCrowned,
  [Pkm.IRON_VALIANT]: IronValiant,
  [Pkm.PANCHAM]: Pancham,
  [Pkm.PANGORO]: Pangoro,
  [Pkm.GROOKEY]: Grookey,
  [Pkm.THWACKEY]: Thwackey,
  [Pkm.RILLABOOM]: Rillaboom,
  [Pkm.GALLADE]: Gallade,
  [Pkm.KUBFU]: Kubfu,
  [Pkm.URSHIFU_SINGLE]: UrshifuSingle,
  [Pkm.URSHIFU_RAPID]: UrshifuRapid,
  [Pkm.HISUIAN_LILLIGANT]: HisuianLilligant,
  [Pkm.SCREAM_TAIL]: ScreamTail,
  [Pkm.WYRDEER]: Wyrdeer,
  [Pkm.INDEEDEE_FEMALE]: IndeedeeFemale,
  [Pkm.INDEEDEE_MALE]: IndeedeeMale,
  [Pkm.COTTONEE]: Cottonee,
  [Pkm.WHIMSICOTT]: Whimsicott,
  [Pkm.GIRAFARIG]: Girafarig,
  [Pkm.FARIGIRAF]: Farigiraf,
  [Pkm.SKITTY]: Skitty,
  [Pkm.DELCATTY]: Delcatty,
  [Pkm.GLAMEOW]: Glameow,
  [Pkm.PURUGLY]: Purugly,
  [Pkm.MINCCINO]: Minccino,
  [Pkm.CINCCINO]: Cinccino,
  [Pkm.PIKACHU_SURFER]: PikachuSurfer,
  [Pkm.ESPURR]: Espurr,
  [Pkm.MEOWSTIC_MALE]: MeowsticMale,
  [Pkm.MEOWSTIC_FEMALE]: MeowsticFemale,
  [Pkm.OKIDOGI]: Okidogi,
  [Pkm.MUNKIDORI]: Munkidori,
  [Pkm.FEZANDIPITI]: Fezandipiti,
  [Pkm.SURSKIT]: Surskit,
  [Pkm.MASQUERAIN]: Masquerain,
  [Pkm.GOSSIFLEUR]: Gossifleur,
  [Pkm.ELDEGOSS]: Eldegoss,
  [Pkm.FURFROU]: Furfrou,
  [Pkm.MELTAN]: Meltan,
  [Pkm.VAROOM]: Varoom,
  [Pkm.REVAVROOM]: Revavroom,
  [Pkm.CELESTEELA]: Celesteela,
  [Pkm.LEDYBA]: Ledyba,
  [Pkm.LEDIAN]: Ledian,
  [Pkm.EMOLGA]: Emolga,
  [Pkm.TAILLOW]: Taillow,
  [Pkm.SWELLOW]: Swellow,
  [Pkm.DRILBUR]: Drilbur,
  [Pkm.EXCADRILL]: Excadrill,
  [Pkm.ROGGENROLA]: Roggenrola,
  [Pkm.BOLDORE]: Boldore,
  [Pkm.GIGALITH]: Gigalith,
  [Pkm.TOGEDEMARU]: Togedemaru,
  [Pkm.FALINKS_BRASS]: FalinksBrass,
  [Pkm.FALINKS_TROOPER]: FalinksTrooper,
  [Pkm.DEDENNE]: Dedenne
}

// declare all the classes in colyseus schema TypeRegistry
// required if schema class doesnt have a @type decorator
// see https://discord.com/channels/525739117951320081/1341559052299407412/1342631038152868072
Object.values(PokemonClasses).forEach((pokemonClass) => entity(pokemonClass))
