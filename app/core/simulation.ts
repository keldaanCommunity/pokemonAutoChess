/* eslint-disable @typescript-eslint/no-extra-semi */
import Board from "./board"
import { Schema, MapSchema, type } from "@colyseus/schema"
import PokemonEntity from "./pokemon-entity"
import PokemonFactory from "../models/pokemon-factory"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { Item } from "../types/enum/Item"
import { Effect } from "../types/enum/Effect"
import { Climate, PokemonActionState, Stat } from "../types/enum/Game"
import Dps from "./dps"
import DpsHeal from "./dps-heal"
import ItemFactory from "../models/item-factory"
import { ISimulation, IPokemonEntity, IPokemon, IPlayer } from "../types"
import { Synergy } from "../types/enum/Synergy"
import { Pkm } from "../types/enum/Pokemon"
import { ItemStats } from "../types/Config"
import { getPath } from "../public/src/pages/utils/utils"
import GameRoom from "../rooms/game-room"
import { pickRandomIn } from "../utils/random"

export default class Simulation extends Schema implements ISimulation {
  @type("string") climate: Climate = Climate.NEUTRAL
  @type({ map: PokemonEntity }) blueTeam = new MapSchema<IPokemonEntity>()
  @type({ map: PokemonEntity }) redTeam = new MapSchema<IPokemonEntity>()
  @type({ map: Dps }) blueDpsMeter = new MapSchema<Dps>()
  @type({ map: Dps }) redDpsMeter = new MapSchema<Dps>()
  @type({ map: DpsHeal }) blueHealDpsMeter = new MapSchema<DpsHeal>()
  @type({ map: DpsHeal }) redHealDpsMeter = new MapSchema<DpsHeal>()
  room: GameRoom
  blueEffects = new Array<Effect>()
  redEffects = new Array<Effect>()
  board: Board = new Board(8, 6)
  finished = false
  flowerSpawn: boolean[] = [false, false]
  stageLevel: number = 0
  player: IPlayer | undefined
  id: string

  constructor(id: string, room: GameRoom) {
    super()
    this.id = id
    this.room = room
  }

  initialize(
    blueTeam: MapSchema<Pokemon>,
    redTeam: MapSchema<Pokemon>,
    blueEffects: Effect[],
    redEffects: Effect[],
    stageLevel: number,
    player: IPlayer
  ) {
    this.player = player
    this.stageLevel = stageLevel
    this.blueDpsMeter.forEach((dps, key) => {
      this.blueDpsMeter.delete(key)
    })

    this.redDpsMeter.forEach((dps, key) => {
      this.redDpsMeter.delete(key)
    })

    this.blueHealDpsMeter.forEach((dps, key) => {
      this.blueHealDpsMeter.delete(key)
    })

    this.redHealDpsMeter.forEach((dps, key) => {
      this.redHealDpsMeter.delete(key)
    })

    this.board = new Board(8, 6)
    if (blueEffects) {
      this.blueEffects = blueEffects
    }
    if (redEffects) {
      this.redEffects = redEffects
    }
    // console.log('blueEffects', blueEffects);
    // console.log('redEffects', redEffects);
    this.climate = this.getClimate()
    this.finished = false
    this.flowerSpawn = [false, false]

    if (blueTeam) {
      blueTeam.forEach((pokemon) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(pokemon, pokemon.positionX, pokemon.positionY - 1, 0)
        }
      })
    }

    if (redTeam) {
      redTeam.forEach((pokemon) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(
            pokemon,
            pokemon.positionX,
            5 - (pokemon.positionY - 1),
            1
          )
        }
      })
    }

    if (
      blueEffects &&
      (blueEffects.includes(Effect.INFESTATION) ||
        blueEffects.includes(Effect.HORDE) ||
        blueEffects.includes(Effect.HEART_OF_THE_SWARM))
    ) {
      const bugTeam = new Array<IPokemon>()
      blueTeam.forEach((pkm) => {
        if (pkm.types.includes(Synergy.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm)
        }
      })
      bugTeam.sort((a, b) => b.hp - a.hp)

      if (blueEffects.includes(Effect.INFESTATION)) {
        const bug = PokemonFactory.createPokemonFromName(bugTeam[0].name)
        const coord = this.getFirstAvailablePlaceOnBoard(true)
        this.addPokemon(bug, coord.x, coord.y, 0, true)
      } else if (blueEffects.includes(Effect.HORDE)) {
        for (let i = 0; i < 2; i++) {
          const bug = PokemonFactory.createPokemonFromName(bugTeam[i].name)
          const coord = this.getFirstAvailablePlaceOnBoard(true)
          this.addPokemon(bug, coord.x, coord.y, 0, true)
        }
      } else if (blueEffects.includes(Effect.HEART_OF_THE_SWARM)) {
        for (let i = 0; i < 4; i++) {
          const bug = PokemonFactory.createPokemonFromName(bugTeam[i].name)
          const coord = this.getFirstAvailablePlaceOnBoard(true)
          this.addPokemon(bug, coord.x, coord.y, 0, true)
        }
      }
    }

    if (
      redEffects &&
      (redEffects.includes(Effect.INFESTATION) ||
        redEffects.includes(Effect.HORDE) ||
        redEffects.includes(Effect.HEART_OF_THE_SWARM))
    ) {
      const bugTeam = new Array<IPokemon>()
      redTeam.forEach((pkm) => {
        if (pkm.types.includes(Synergy.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm)
        }
      })
      bugTeam.sort((a, b) => b.hp - a.hp)

      if (redEffects.includes(Effect.INFESTATION)) {
        const bug = PokemonFactory.createPokemonFromName(bugTeam[0].name)
        const coord = this.getFirstAvailablePlaceOnBoard(false)
        this.addPokemon(bug, coord.x, coord.y, 1, true)
      } else if (redEffects.includes(Effect.HORDE)) {
        for (let i = 0; i < 2; i++) {
          const bug = PokemonFactory.createPokemonFromName(bugTeam[i].name)
          const coord = this.getFirstAvailablePlaceOnBoard(false)
          this.addPokemon(bug, coord.x, coord.y, 1, true)
        }
      } else if (redEffects.includes(Effect.HEART_OF_THE_SWARM)) {
        for (let i = 0; i < 4; i++) {
          const bug = PokemonFactory.createPokemonFromName(bugTeam[i].name)
          const coord = this.getFirstAvailablePlaceOnBoard(false)
          this.addPokemon(bug, coord.x, coord.y, 1, true)
        }
      }
    }

    this.applyPostEffects()
  }

  addPokemon(
    pokemon: IPokemon,
    x: number,
    y: number,
    team: number,
    isClone = false
  ) {
    const pokemonEntity = new PokemonEntity(pokemon, x, y, team, this)
    pokemonEntity.isClone = isClone
    this.applyItemsEffects(pokemonEntity)
    this.board.setValue(
      pokemonEntity.positionX,
      pokemonEntity.positionY,
      pokemonEntity
    )

    if (team == 0) {
      this.applyEffects(pokemonEntity, pokemon.types, this.blueEffects)
      const dps = new Dps(pokemonEntity.id, getPath(pokemonEntity))
      const dpsHeal = new DpsHeal(pokemonEntity.id, getPath(pokemonEntity))
      this.blueTeam.set(pokemonEntity.id, pokemonEntity)
      this.blueDpsMeter.set(pokemonEntity.id, dps)
      this.blueHealDpsMeter.set(pokemonEntity.id, dpsHeal)
    }
    if (team == 1) {
      this.applyEffects(pokemonEntity, pokemon.types, this.redEffects)
      const dps = new Dps(pokemonEntity.id, getPath(pokemonEntity))
      const dpsHeal = new DpsHeal(pokemonEntity.id, getPath(pokemonEntity))
      this.redTeam.set(pokemonEntity.id, pokemonEntity)
      this.redDpsMeter.set(pokemonEntity.id, dps)
      this.redHealDpsMeter.set(pokemonEntity.id, dpsHeal)
    }
    return pokemonEntity
  }

  addPokemonEntity(p: PokemonEntity, x: number, y: number, team: number) {
    const pokemon = PokemonFactory.createPokemonFromName(p.name)
    p.items.forEach((i) => {
      pokemon.items.add(i)
    })
    return this.addPokemon(pokemon, x, y, team)
  }

  getFirstAvailablePlaceOnBoard(ascending: boolean) {
    let row = 0
    let column = 0
    if (ascending) {
      outerloop: for (let x = 0; x < this.board.rows; x++) {
        for (let y = 0; y < this.board.columns; y++) {
          if (this.board.getValue(x, y) === undefined) {
            row = x
            column = y
            break outerloop
          }
        }
      }
    } else {
      outerloop: for (let x = 0; x < this.board.rows; x++) {
        for (let y = this.board.columns - 1; y >= 0; y--) {
          if (this.board.getValue(x, y) === undefined) {
            row = x
            column = y
            break outerloop
          }
        }
      }
    }
    return { x: row, y: column }
  }

  applyStat(pokemon: PokemonEntity, stat: Stat, value: number) {
    switch (stat) {
      case Stat.ATK:
        pokemon.addAttack(value)
        break
      case Stat.DEF:
        pokemon.addDefense(value)
        break
      case Stat.SPE_DEF:
        pokemon.addSpecialDefense(value)
        break
      case Stat.SPELL_POWER:
        pokemon.addSpellDamage(value)
        break
      case Stat.MANA:
        pokemon.setMana(pokemon.mana + value)
        break
      case Stat.ATK_SPEED:
        pokemon.handleAttackSpeed(value)
        break
      case Stat.CRIT_CHANCE:
        pokemon.addCritChance(value)
        break
      case Stat.CRIT_DAMAGE:
        pokemon.addCritDamage(value)
        break
      case Stat.SHIELD:
        pokemon.handleShield(value, pokemon)
        break
      case Stat.HP:
        pokemon.handleHeal(value, pokemon)
        break
    }
  }

  applyItemsEffects(pokemon: PokemonEntity) {
    // wonderbox should be applied first so that wonderbox items effects can be applied after
    if (pokemon.items.has(Item.WONDER_BOX)) {
      pokemon.items.delete(Item.WONDER_BOX)
      const randomItems = ItemFactory.createWonderboxItems(pokemon.items)
      randomItems.forEach((item) => {
        if (pokemon.items.size < 3) {
          pokemon.items.add(item)
        }
      })
    }

    pokemon.items.forEach((item) => {
      Object.entries(ItemStats[item]!).forEach(([stat, value]) =>
        this.applyStat(pokemon, stat as Stat, value)
      )
    })

    if (pokemon.items.has(Item.SOUL_DEW)) {
      pokemon.status.triggerSoulDew(2000)
    }

    if (pokemon.items.has(Item.AQUA_EGG)) {
      pokemon.setMana(pokemon.mana + pokemon.maxMana / 2)
    }
    if (pokemon.items.has(Item.ZOOM_LENS)) {
      const spellPowerBoost = 5 * pokemon.baseAtk
      const atkBoost = 0.05 * pokemon.spellDamage
      pokemon.addAttack(atkBoost)
      pokemon.addSpellDamage(spellPowerBoost)
    }

    if (pokemon.items.has(Item.BRIGHT_POWDER)) {
      pokemon.status.triggerBrightPowder(4000)
    }
    if (pokemon.items.has(Item.WIDE_LENS)) {
      pokemon.range += 2
    }
  }

  applyPostEffects() {
    const blueIronDefense = Array.from(this.blueTeam.values()).filter((p) =>
      p.effects.includes(Effect.IRON_DEFENSE)
    )
    if (blueIronDefense.length > 0) {
      blueIronDefense.forEach((pokemon) => {
        pokemon.effects.splice(
          pokemon.effects.findIndex((e) => e === Effect.IRON_DEFENSE),
          1
        )
      })
      const blueIronDefensePkm = pickRandomIn(blueIronDefense)
      blueIronDefensePkm.addAttack(blueIronDefensePkm.atk)
      blueIronDefensePkm.effects.push(Effect.IRON_DEFENSE)
    }

    const redIronDefense = Array.from(this.redTeam.values()).filter((p) =>
      p.effects.includes(Effect.IRON_DEFENSE)
    )
    if (redIronDefense.length > 0) {
      redIronDefense.forEach((pokemon) => {
        pokemon.effects.splice(
          pokemon.effects.findIndex((e) => e === Effect.IRON_DEFENSE),
          1
        )
      })
      const redIronDefensePkm = pickRandomIn(redIronDefense)
      redIronDefensePkm.addAttack(redIronDefensePkm.atk)
      redIronDefensePkm.effects.push(Effect.IRON_DEFENSE)
    }

    this.blueTeam.forEach((pokemon) => {
      if (pokemon.effects.includes(Effect.AUTOTOMIZE)) {
        pokemon.addAttack(pokemon.atk)
      }
      let shieldBonus = 0
      if (pokemon.effects.includes(Effect.STAMINA)) {
        shieldBonus = 20
      }
      if (pokemon.effects.includes(Effect.STRENGTH)) {
        shieldBonus += 30
      }
      if (pokemon.effects.includes(Effect.ROCK_SMASH)) {
        shieldBonus += 40
      }
      if (pokemon.effects.includes(Effect.PURE_POWER)) {
        shieldBonus += 50
      }
      if (shieldBonus >= 0) {
        pokemon.handleShield(shieldBonus, pokemon)
        const cells = this.board.getAdjacentCells(
          pokemon.positionX,
          pokemon.positionY
        )

        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.handleShield(shieldBonus, pokemon)
          }
        })
      }
      if (pokemon.items.has(Item.LUCKY_EGG)) {
        ;[-1, 0, 1].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.addSpellDamage(30)
          }
        })
      }
      if (pokemon.items.has(Item.DELTA_ORB)) {
        ;[-1, 0, 1].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.addSpellDamage(30)
          }
        })
      }
      if (pokemon.items.has(Item.RUNE_PROTECT)) {
        const cells = this.board.getAdjacentCells(
          pokemon.positionX,
          pokemon.positionY
        )
        pokemon.status.triggerRuneProtect(8000)
        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.status.triggerRuneProtect(8000)
          }
        })
      }

      if (pokemon.items.has(Item.FOCUS_BAND)) {
        ;[-1, 0, 1].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.handleAttackSpeed(30)
          }
        })
      }

      if (pokemon.items.has(Item.DELTA_ORB)) {
        ;[-1, 0, 1].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.status.deltaOrb = true
          }
        })
      }
    })

    this.redTeam.forEach((pokemon) => {
      if (pokemon.effects.includes(Effect.AUTOTOMIZE)) {
        pokemon.addAttack(pokemon.atk)
      }
      let shieldBonus = 0
      if (pokemon.effects.includes(Effect.STAMINA)) {
        shieldBonus = 20
      }
      if (pokemon.effects.includes(Effect.STRENGTH)) {
        shieldBonus += 30
      }
      if (pokemon.effects.includes(Effect.ROCK_SMASH)) {
        shieldBonus += 40
      }
      if (pokemon.effects.includes(Effect.PURE_POWER)) {
        shieldBonus += 50
      }
      if (shieldBonus >= 0) {
        pokemon.handleShield(shieldBonus, pokemon)
        const cells = this.board.getAdjacentCells(
          pokemon.positionX,
          pokemon.positionY
        )

        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.handleShield(shieldBonus, pokemon)
          }
        })
      }
      if (pokemon.items.has(Item.LUCKY_EGG)) {
        ;[-1, 0, 1].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.addSpellDamage(30)
          }
        })
      }
      if (pokemon.items.has(Item.DELTA_ORB)) {
        ;[-2, -1, 0, 1, 2].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.addSpellDamage(30)
          }
        })
      }
      if (pokemon.items.has(Item.RUNE_PROTECT)) {
        const cells = this.board.getAdjacentCells(
          pokemon.positionX,
          pokemon.positionY
        )
        pokemon.status.triggerRuneProtect(6000)
        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.status.triggerRuneProtect(6000)
          }
        })
      }

      if (pokemon.items.has(Item.FOCUS_BAND)) {
        ;[-1, 0, 1].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.handleAttackSpeed(30)
          }
        })
      }
      if (pokemon.items.has(Item.DELTA_ORB)) {
        ;[-1, 0, 1].forEach((offset) => {
          const value = this.board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value) {
            value.status.deltaOrb = true
          }
        })
      }
    })

    let isTapuKoko = false
    let isTapuLele = false

    this.blueTeam.forEach((pokemon) => {
      if (pokemon.name == Pkm.TAPU_KOKO) {
        isTapuKoko = true
      }
      if (pokemon.name == Pkm.TAPU_LELE) {
        isTapuLele = true
      }
    })
    this.redTeam.forEach((pokemon) => {
      if (pokemon.name == Pkm.TAPU_KOKO) {
        isTapuKoko = true
      }
      if (pokemon.name == Pkm.TAPU_LELE) {
        isTapuLele = true
      }
    })

    this.blueTeam.forEach((pokemon) => {
      if (isTapuKoko && pokemon.types.includes(Synergy.ELECTRIC)) {
        pokemon.status.electricField = true
      }
      if (isTapuLele && pokemon.types.includes(Synergy.PSYCHIC)) {
        pokemon.status.psychicField = true
      }
    })

    this.redTeam.forEach((pokemon) => {
      if (isTapuKoko && pokemon.types.includes(Synergy.ELECTRIC)) {
        pokemon.status.electricField = true
      }
      if (isTapuLele && pokemon.types.includes(Synergy.PSYCHIC)) {
        pokemon.status.psychicField = true
      }
    })
    this.blueTeam.forEach((p) => {
      const pokemon = p as PokemonEntity
      if (pokemon.items.has(Item.FLAME_ORB)) {
        pokemon.addAttack(pokemon.baseAtk)
        pokemon.status.triggerBurn(60000, pokemon, pokemon, this.board)
        pokemon.status.triggerWound(60000, pokemon, this.board)
      }
    })

    this.redTeam.forEach((p) => {
      const pokemon = p as PokemonEntity
      if (pokemon.items.has(Item.FLAME_ORB)) {
        pokemon.addAttack(pokemon.baseAtk)
        pokemon.status.triggerBurn(60000, pokemon, pokemon, this.board)
        pokemon.status.triggerWound(60000, pokemon, this.board)
      }
    })
  }

  applyEffects(pokemon: PokemonEntity, types: string[], allyEffects: Effect[]) {
    allyEffects.forEach((effect) => {
      switch (effect) {
        case Effect.HONE_CLAWS:
          if (types.includes(Synergy.DARK) && pokemon.items.size != 0) {
            pokemon.addAttack(4 * pokemon.items.size)
            pokemon.handleShield(20 * pokemon.items.size, pokemon)
            pokemon.effects.push(Effect.HONE_CLAWS)
          }
          break

        case Effect.ASSURANCE:
          if (types.includes(Synergy.DARK) && pokemon.items.size != 0) {
            pokemon.addAttack(7 * pokemon.items.size)
            pokemon.handleShield(30 * pokemon.items.size, pokemon)
            pokemon.effects.push(Effect.ASSURANCE)
          }
          break

        case Effect.BEAT_UP:
          if (types.includes(Synergy.DARK) && pokemon.items.size != 0) {
            pokemon.addAttack(10 * pokemon.items.size)
            pokemon.handleShield(50 * pokemon.items.size, pokemon)
            pokemon.effects.push(Effect.BEAT_UP)
          }
          break

        case Effect.ANCIENT_POWER:
          if (types.includes(Synergy.FOSSIL)) {
            pokemon.addCritChance(20)
            pokemon.addCritDamage(0.4)
            pokemon.effects.push(Effect.ANCIENT_POWER)
          }
          break

        case Effect.ELDER_POWER:
          if (types.includes(Synergy.FOSSIL)) {
            pokemon.addCritChance(35)
            pokemon.addCritDamage(0.7)
            pokemon.effects.push(Effect.ELDER_POWER)
          }
          break

        case Effect.UNOWN_GATHERINGS:
          if (types.includes(Synergy.FOSSIL)) {
            pokemon.addCritChance(50)
            pokemon.addCritDamage(1)
            pokemon.effects.push(Effect.UNOWN_GATHERINGS)
          }
          break

        case Effect.BLAZE:
          if (types.includes(Synergy.FIRE)) {
            pokemon.effects.push(Effect.BLAZE)
          }
          break

        case Effect.VICTORY_STAR:
          if (types.includes(Synergy.FIRE)) {
            pokemon.effects.push(Effect.VICTORY_STAR)
          }
          break

        case Effect.DROUGHT:
          if (types.includes(Synergy.FIRE)) {
            pokemon.effects.push(Effect.DROUGHT)
          }
          break

        case Effect.DESOLATE_LAND:
          if (types.includes(Synergy.FIRE)) {
            pokemon.effects.push(Effect.DESOLATE_LAND)
          }
          break

        case Effect.INGRAIN:
          if (types.includes(Synergy.GRASS)) {
            pokemon.effects.push(Effect.INGRAIN)
          }
          break

        case Effect.GROWTH:
          if (types.includes(Synergy.GRASS)) {
            pokemon.effects.push(Effect.GROWTH)
          }
          break

        case Effect.SPORE:
          if (types.includes(Synergy.GRASS)) {
            pokemon.effects.push(Effect.SPORE)
          }
          break

        case Effect.RAIN_DANCE:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.25)
            pokemon.effects.push(Effect.RAIN_DANCE)
          }
          break

        case Effect.DRIZZLE:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.5)
            pokemon.effects.push(Effect.DRIZZLE)
          }
          break

        case Effect.PRIMORDIAL_SEA:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.75)
            pokemon.effects.push(Effect.PRIMORDIAL_SEA)
          }
          break

        case Effect.STAMINA:
          if (types.includes(Synergy.NORMAL)) {
            pokemon.effects.push(Effect.STAMINA)
          }
          break

        case Effect.STRENGTH:
          if (types.includes(Synergy.NORMAL)) {
            pokemon.effects.push(Effect.STRENGTH)
          }
          break

        case Effect.ROCK_SMASH:
          if (types.includes(Synergy.NORMAL)) {
            pokemon.effects.push(Effect.ROCK_SMASH)
          }
          break

        case Effect.PURE_POWER:
          if (types.includes(Synergy.NORMAL)) {
            pokemon.effects.push(Effect.PURE_POWER)
          }
          break

        case Effect.EERIE_IMPULSE:
          if (types.includes(Synergy.ELECTRIC)) {
            pokemon.effects.push(Effect.EERIE_IMPULSE)
          }
          break

        case Effect.RISING_VOLTAGE:
          if (types.includes(Synergy.ELECTRIC)) {
            pokemon.effects.push(Effect.RISING_VOLTAGE)
          }
          break

        case Effect.OVERDRIVE:
          if (types.includes(Synergy.ELECTRIC)) {
            pokemon.effects.push(Effect.OVERDRIVE)
          }
          break

        case Effect.GUTS:
          pokemon.effects.push(Effect.GUTS)
          break

        case Effect.DEFIANT:
          pokemon.effects.push(Effect.DEFIANT)
          break

        case Effect.JUSTIFIED:
          pokemon.effects.push(Effect.JUSTIFIED)
          break

        case Effect.IRON_DEFENSE:
          if (types.includes(Synergy.METAL)) {
            pokemon.effects.push(Effect.IRON_DEFENSE)
          }
          break

        case Effect.AUTOTOMIZE:
          if (types.includes(Synergy.METAL)) {
            pokemon.effects.push(Effect.AUTOTOMIZE)
          }
          break

        case Effect.BULK_UP:
          if (types.includes(Synergy.FIELD)) {
            pokemon.effects.push(Effect.BULK_UP)
          }
          break

        case Effect.RAGE:
          if (types.includes(Synergy.FIELD)) {
            pokemon.effects.push(Effect.RAGE)
          }
          break

        case Effect.ANGER_POINT:
          if (types.includes(Synergy.FIELD)) {
            pokemon.effects.push(Effect.ANGER_POINT)
          }
          break

        case Effect.PURSUIT:
          if (types.includes(Synergy.MONSTER)) {
            pokemon.effects.push(Effect.PURSUIT)
          }
          break

        case Effect.BRUTAL_SWING:
          if (types.includes(Synergy.MONSTER)) {
            pokemon.effects.push(Effect.BRUTAL_SWING)
          }
          break

        case Effect.POWER_TRIP:
          if (types.includes(Synergy.MONSTER)) {
            pokemon.effects.push(Effect.POWER_TRIP)
          }
          break

        case Effect.AMNESIA:
          if (types.includes(Synergy.PSYCHIC)) {
            pokemon.effects.push(Effect.AMNESIA)
            pokemon.addSpellDamage(50)
          }
          break

        case Effect.LIGHT_SCREEN:
          if (types.includes(Synergy.PSYCHIC)) {
            pokemon.effects.push(Effect.LIGHT_SCREEN)
            pokemon.addSpellDamage(100)
          }
          break

        case Effect.EERIE_SPELL:
          if (types.includes(Synergy.PSYCHIC)) {
            pokemon.effects.push(Effect.EERIE_SPELL)
            pokemon.addSpellDamage(150)
          }
          break

        case Effect.MEDITATE:
          pokemon.effects.push(Effect.MEDITATE)
          break

        case Effect.FOCUS_ENERGY:
          pokemon.effects.push(Effect.FOCUS_ENERGY)
          break

        case Effect.CALM_MIND:
          pokemon.effects.push(Effect.CALM_MIND)
          break

        case Effect.TAILWIND:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true
            pokemon.effects.push(Effect.TAILWIND)
          }
          break

        case Effect.FEATHER_DANCE:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true
            pokemon.effects.push(Effect.FEATHER_DANCE)
          }
          break

        case Effect.MAX_AIRSTREAM:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true
            pokemon.effects.push(Effect.MAX_AIRSTREAM)
          }
          break

        case Effect.MAX_GUARD:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true
            pokemon.effects.push(Effect.MAX_GUARD)
          }
          break

        case Effect.SWIFT_SWIM:
          if (types.includes(Synergy.AQUATIC)) {
            pokemon.effects.push(Effect.SWIFT_SWIM)
          }
          break

        case Effect.HYDRO_CANNON:
          if (types.includes(Synergy.AQUATIC)) {
            pokemon.effects.push(Effect.HYDRO_CANNON)
          }
          break

        case Effect.ODD_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.ODD_FLOWER)
          }
          break

        case Effect.GLOOM_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.GLOOM_FLOWER)
          }
          break

        case Effect.VILE_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.VILE_FLOWER)
          }
          break

        case Effect.SUN_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.SUN_FLOWER)
          }
          break

        case Effect.BATTLE_ARMOR:
          if (types.includes(Synergy.MINERAL)) {
            pokemon.handleShield(50, pokemon)
            pokemon.effects.push(Effect.BATTLE_ARMOR)
          }
          break

        case Effect.MOUTAIN_RESISTANCE:
          if (types.includes(Synergy.MINERAL)) {
            pokemon.handleShield(100, pokemon)
            pokemon.effects.push(Effect.MOUTAIN_RESISTANCE)
          }
          break

        case Effect.DIAMOND_STORM:
          if (types.includes(Synergy.MINERAL)) {
            pokemon.handleShield(200, pokemon)
            pokemon.effects.push(Effect.DIAMOND_STORM)
          }
          break

        case Effect.PHANTOM_FORCE:
          if (types.includes(Synergy.GHOST)) {
            pokemon.effects.push(Effect.PHANTOM_FORCE)
          }
          break

        case Effect.CURSE:
          if (types.includes(Synergy.GHOST)) {
            pokemon.effects.push(Effect.CURSE)
          }
          break

        case Effect.SHADOW_TAG:
          if (types.includes(Synergy.GHOST)) {
            pokemon.effects.push(Effect.SHADOW_TAG)
          }
          break

        case Effect.WANDERING_SPIRIT:
          if (types.includes(Synergy.GHOST)) {
            pokemon.effects.push(Effect.WANDERING_SPIRIT)
          }
          break

        case Effect.AROMATIC_MIST:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.effects.push(Effect.AROMATIC_MIST)
          }
          break

        case Effect.FAIRY_WIND:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.effects.push(Effect.FAIRY_WIND)
          }
          break

        case Effect.STRANGE_STEAM:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.effects.push(Effect.STRANGE_STEAM)
          }
          break

        case Effect.DRAGON_ENERGY:
          if (types.includes(Synergy.DRAGON)) {
            pokemon.effects.push(Effect.DRAGON_ENERGY)
          }
          break

        case Effect.DRAGON_DANCE:
          if (types.includes(Synergy.DRAGON)) {
            pokemon.effects.push(Effect.DRAGON_DANCE)
          }
          break

        case Effect.SNOW:
          pokemon.effects.push(Effect.SNOW)
          break

        case Effect.SHEER_COLD:
          pokemon.effects.push(Effect.SHEER_COLD)
          break

        case Effect.POISON_GAS:
          if (types.includes(Synergy.POISON)) {
            pokemon.effects.push(Effect.POISON_GAS)
          }
          break

        case Effect.TOXIC:
          if (types.includes(Synergy.POISON)) {
            pokemon.effects.push(Effect.TOXIC)
          }
          break

        case Effect.LARGO:
          if (types.includes(Synergy.SOUND)) {
            pokemon.effects.push(Effect.LARGO)
          }
          break

        case Effect.ALLEGRO:
          if (types.includes(Synergy.SOUND)) {
            pokemon.effects.push(Effect.ALLEGRO)
          }
          break

        case Effect.PRESTO:
          if (types.includes(Synergy.SOUND)) {
            pokemon.effects.push(Effect.PRESTO)
          }
          break

        case Effect.INFESTATION:
          if (types.includes(Synergy.BUG)) {
            pokemon.effects.push(Effect.INFESTATION)
          }
          break

        case Effect.HORDE:
          if (types.includes(Synergy.BUG)) {
            pokemon.effects.push(Effect.HORDE)
          }
          break

        case Effect.HEART_OF_THE_SWARM:
          if (types.includes(Synergy.BUG)) {
            pokemon.effects.push(Effect.HEART_OF_THE_SWARM)
          }
          break

        case Effect.SHORE_UP:
          if (types.includes(Synergy.GROUND)) {
            pokemon.effects.push(Effect.SHORE_UP)
          }
          break

        case Effect.ROTOTILLER:
          if (types.includes(Synergy.GROUND)) {
            pokemon.effects.push(Effect.ROTOTILLER)
          }
          break

        case Effect.SANDSTORM:
          if (types.includes(Synergy.GROUND)) {
            pokemon.effects.push(Effect.SANDSTORM)
          }
          break

        case Effect.DUBIOUS_DISC:
          if (types.includes(Synergy.ARTIFICIAL)) {
            pokemon.effects.push(Effect.DUBIOUS_DISC)
          }
          break

        case Effect.LINK_CABLE:
          if (types.includes(Synergy.ARTIFICIAL)) {
            pokemon.effects.push(Effect.LINK_CABLE)
          }
          break

        case Effect.GOOGLE_SPECS:
          if (types.includes(Synergy.ARTIFICIAL)) {
            pokemon.effects.push(Effect.GOOGLE_SPECS)
          }
          break

        case Effect.HATCHER:
          if (types.includes(Synergy.BABY)) {
            pokemon.effects.push(Effect.HATCHER)
          }
          break

        case Effect.BREEDER:
          if (types.includes(Synergy.BABY)) {
            pokemon.effects.push(Effect.BREEDER)
          }
          break

        default:
          break
      }
    })
  }

  getClimate() {
    let climate = Climate.NEUTRAL
    if (
      this.blueEffects.includes(Effect.SNOW) ||
      this.redEffects.includes(Effect.SNOW)
    ) {
      climate = Climate.SNOW
    }
    if (
      this.blueEffects.includes(Effect.DRIZZLE) ||
      this.redEffects.includes(Effect.DRIZZLE)
    ) {
      climate = Climate.RAIN
    }
    if (
      this.blueEffects.includes(Effect.SHEER_COLD) ||
      this.redEffects.includes(Effect.SHEER_COLD)
    ) {
      climate = Climate.SNOW
    }
    if (
      this.blueEffects.includes(Effect.RAIN_DANCE) ||
      this.redEffects.includes(Effect.RAIN_DANCE)
    ) {
      climate = Climate.RAIN
    }
    if (
      this.blueEffects.includes(Effect.SANDSTORM) ||
      this.redEffects.includes(Effect.SANDSTORM)
    ) {
      climate = Climate.SANDSTORM
    }
    if (
      this.blueEffects.includes(Effect.DROUGHT) ||
      this.redEffects.includes(Effect.DROUGHT)
    ) {
      climate = Climate.SUN
    }
    if (
      this.blueEffects.includes(Effect.PRIMORDIAL_SEA) ||
      this.redEffects.includes(Effect.PRIMORDIAL_SEA)
    ) {
      climate = Climate.RAIN
    }
    return climate
  }

  update(dt: number) {
    if (this.blueTeam.size == 0 || this.redTeam.size == 0) {
      this.finished = true
      if (this.blueTeam.size == 0) {
        this.redTeam.forEach((p) => {
          p.action = PokemonActionState.HOP
        })
      } else {
        this.blueTeam.forEach((p) => {
          p.action = PokemonActionState.HOP
        })
      }
    }

    this.blueTeam.forEach((pkm, key) => {
      if (!pkm.life) {
        this.blueTeam.delete(key)
      }
      if (pkm.life <= 0) {
        this.blueTeam.delete(key)
      } else {
        pkm.update(dt, this.board, this.climate)
        this.blueDpsMeter
          .get(key)
          ?.changeDamage(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage)
        this.blueHealDpsMeter.get(key)?.changeHeal(pkm.healDone, pkm.shieldDone)
      }
    })

    this.redTeam.forEach((pkm, key) => {
      if (!pkm.life) {
        this.redTeam.delete(key)
      }
      if (pkm.life <= 0) {
        this.redTeam.delete(key)
      } else {
        pkm.update(dt, this.board, this.climate)
        this.redDpsMeter
          .get(key)
          ?.changeDamage(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage)
        this.redHealDpsMeter.get(key)?.changeHeal(pkm.healDone, pkm.shieldDone)
      }
    })
  }

  stop() {
    this.blueTeam.forEach((pokemon, key) => {
      // console.log('deleting ' + pokemon.name);
      this.blueTeam.delete(key)
    })

    this.redTeam.forEach((pokemon, key) => {
      // console.log('deleting ' + pokemon.name);
      this.redTeam.delete(key)
    })

    this.climate = Climate.NEUTRAL
  }
}
