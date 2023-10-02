/* eslint-disable @typescript-eslint/no-extra-semi */
import Board from "./board"
import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema"
import PokemonEntity from "./pokemon-entity"
import PokemonFactory from "../models/pokemon-factory"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { Item } from "../types/enum/Item"
import { Effect } from "../types/enum/Effect"
import {
  AttackType,
  BattleResult,
  BoardEvent,
  PokemonActionState,
  Stat,
  Team
} from "../types/enum/Game"
import { Weather, WeatherEffects } from "../types/enum/Weather"
import Dps from "./dps"
import DpsHeal from "./dps-heal"
import ItemFactory from "../models/item-factory"
import { ISimulation, IPokemonEntity, IPokemon, Transfer } from "../types"
import { Synergy } from "../types/enum/Synergy"
import { BOARD_HEIGHT, BOARD_WIDTH, ItemStats } from "../types/Config"
import { getPath } from "../public/src/pages/utils/utils"
import GameRoom from "../rooms/game-room"
import { pickRandomIn, randomBetween } from "../utils/random"
import { Passive } from "../types/enum/Passive"
import Player from "../models/colyseus-models/player"

export default class Simulation extends Schema implements ISimulation {
  @type("string") weather: Weather = Weather.NEUTRAL
  @type("string") winnerId = ""
  @type({ map: PokemonEntity }) blueTeam = new MapSchema<IPokemonEntity>()
  @type({ map: PokemonEntity }) redTeam = new MapSchema<IPokemonEntity>()
  @type({ map: Dps }) blueDpsMeter = new MapSchema<Dps>()
  @type({ map: Dps }) redDpsMeter = new MapSchema<Dps>()
  @type({ map: DpsHeal }) blueHealDpsMeter = new MapSchema<DpsHeal>()
  @type({ map: DpsHeal }) redHealDpsMeter = new MapSchema<DpsHeal>()
  @type("string") id: string
  @type("string") bluePlayerId: string
  @type("string") redPlayerId: string
  room: GameRoom
  blueEffects = new Array<Effect>()
  redEffects = new Array<Effect>()
  board: Board = new Board(BOARD_HEIGHT, BOARD_WIDTH)
  finished = false
  flowerSpawn: boolean[] = [false, false]
  stageLevel = 0
  bluePlayer: Player | undefined
  redPlayer: Player | undefined
  stormLightningTimer = 0

  constructor(
    id: string,
    room: GameRoom,
    blueTeam: MapSchema<Pokemon>,
    redTeam: MapSchema<Pokemon>,
    bluePlayer: Player,
    redPlayer: Player | undefined,
    stageLevel: number,
    weather: Weather
  ) {
    super()
    this.id = id
    this.room = room
    this.bluePlayer = bluePlayer
    this.redPlayer = redPlayer
    this.bluePlayerId = bluePlayer.id
    this.redPlayerId = redPlayer?.id ? redPlayer?.id : ""
    this.stageLevel = stageLevel
    this.weather = weather

    this.board = new Board(BOARD_HEIGHT, BOARD_WIDTH)
    this.blueEffects = bluePlayer?.effects?.list ?? []
    this.redEffects = redPlayer?.effects?.list ?? []
    // logger.debug({ blueEffects, redEffects })

    this.room.updateCastform(this.weather)

    // update effects after castform transformation
    this.blueEffects = bluePlayer?.effects?.list ?? []
    this.redEffects = redPlayer?.effects?.list ?? []

    this.finished = false
    this.winnerId = ""
    this.flowerSpawn = [false, false]
    this.stormLightningTimer = randomBetween(4000, 8000)

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

    ;[
      { team: blueTeam, effects: this.blueEffects, player: bluePlayer },
      { team: redTeam, effects: this.redEffects, player: redPlayer }
    ].forEach(
      ({
        team,
        effects,
        player
      }: {
        team: MapSchema<Pokemon>
        effects: Effect[]
        player: Player | undefined
      }) => {
        if (
          player &&
          [
            Effect.COCOON,
            Effect.INFESTATION,
            Effect.HORDE,
            Effect.HEART_OF_THE_SWARM
          ].some((e) => effects.includes(e))
        ) {
          const teamIndex = team === blueTeam ? 0 : 1
          const bugTeam = new Array<IPokemon>()
          team.forEach((pkm) => {
            if (pkm.types.includes(Synergy.BUG) && pkm.positionY != 0) {
              bugTeam.push(pkm)
            }
          })
          bugTeam.sort((a, b) => b.hp - a.hp)

          let numberToSpawn = 0
          if (effects.includes(Effect.COCOON)) {
            numberToSpawn = 1
          }
          if (effects.includes(Effect.INFESTATION)) {
            numberToSpawn = 2
          }
          if (effects.includes(Effect.HORDE)) {
            numberToSpawn = 3
          }
          if (effects.includes(Effect.HEART_OF_THE_SWARM)) {
            numberToSpawn = 5
          }

          for (let i = 0; i < numberToSpawn; i++) {
            const bug = PokemonFactory.createPokemonFromName(
              bugTeam[i].name,
              player
            )
            const coord = this.getClosestAvailablePlaceOnBoardToPokemon(
              bugTeam[i],
              teamIndex
            )
            this.addPokemon(bug, coord.x, coord.y, teamIndex, true)
          }
        }
      }
    )

    this.applyPostEffects()
  }

  getCurrentBattleResult(playerId: string) {
    if (this.blueTeam.size === 0 && this.redTeam.size > 0) {
      return playerId === this.bluePlayer?.id
        ? BattleResult.DEFEAT
        : BattleResult.WIN
    } else if (this.redTeam.size === 0 && this.blueTeam.size > 0) {
      return playerId === this.redPlayer?.id
        ? BattleResult.DEFEAT
        : BattleResult.WIN
    }
    return BattleResult.DRAW
  }

  getEffects(playerId: string) {
    return playerId === this.bluePlayer?.id
      ? this.blueEffects
      : playerId === this.redPlayer?.id
      ? this.redEffects
      : undefined
  }

  getDpsMeter(playerId: string) {
    return playerId === this.bluePlayer?.id
      ? this.blueDpsMeter
      : playerId === this.redPlayer?.id
      ? this.redDpsMeter
      : undefined
  }

  getHealDpsMeter(playerId: string) {
    return playerId === this.bluePlayer?.id
      ? this.blueHealDpsMeter
      : playerId === this.redPlayer?.id
      ? this.redHealDpsMeter
      : undefined
  }

  getTeam(playerId: string) {
    return playerId === this.bluePlayer?.id
      ? this.blueTeam
      : playerId === this.redPlayer?.id
      ? this.redTeam
      : undefined
  }

  getOpponentTeam(playerId: string) {
    return playerId === this.bluePlayer?.id
      ? this.redTeam
      : playerId === this.redPlayer?.id
      ? this.blueTeam
      : undefined
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
    this.applySynergyEffects(pokemonEntity)
    this.applyItemsEffects(pokemonEntity)
    this.applyWeatherEffects(pokemonEntity)
    this.board.setValue(
      pokemonEntity.positionX,
      pokemonEntity.positionY,
      pokemonEntity
    )

    if (team == Team.BLUE_TEAM) {
      const dps = new Dps(pokemonEntity.id, getPath(pokemonEntity))
      const dpsHeal = new DpsHeal(pokemonEntity.id, getPath(pokemonEntity))
      this.blueTeam.set(pokemonEntity.id, pokemonEntity)
      this.blueDpsMeter.set(pokemonEntity.id, dps)
      this.blueHealDpsMeter.set(pokemonEntity.id, dpsHeal)
    }
    if (team == Team.RED_TEAM) {
      const dps = new Dps(pokemonEntity.id, getPath(pokemonEntity))
      const dpsHeal = new DpsHeal(pokemonEntity.id, getPath(pokemonEntity))
      this.redTeam.set(pokemonEntity.id, pokemonEntity)
      this.redDpsMeter.set(pokemonEntity.id, dps)
      this.redHealDpsMeter.set(pokemonEntity.id, dpsHeal)
    }
    return pokemonEntity
  }

  getFirstAvailablePlaceOnBoard(teamIndex: number): { x: number; y: number } {
    let candidateX = 0,
      candidateY = 0
    if (teamIndex === 0) {
      outerloop: for (let y = 0; y < this.board.rows; y++) {
        for (let x = 0; x < this.board.columns; x++) {
          if (this.board.getValue(x, y) === undefined) {
            candidateX = x
            candidateY = y
            break outerloop
          }
        }
      }
    } else {
      outerloop: for (let y = 0; y < this.board.rows; y++) {
        for (let x = this.board.columns - 1; x >= 0; x--) {
          if (this.board.getValue(x, y) === undefined) {
            candidateX = x
            candidateY = y
            break outerloop
          }
        }
      }
    }
    return { x: candidateX, y: candidateY }
  }

  getClosestAvailablePlaceOnBoardTo(
    positionX: number,
    positionY: number,
    teamIndex: number
  ): { x: number; y: number } {
    const placesToConsiderByOrderOfPriority = [
      [0, 0],
      [-1, 0],
      [+1, 0],
      [0, -1],
      [-1, -1],
      [+1, -1],
      [-1, +1],
      [+1, +1],
      [0, +1],
      [-2, 0],
      [+2, 0],
      [-2, -1],
      [+2, -1],
      [0, -2],
      [-1, -2],
      [+1, -2],
      [-2, -2],
      [+2, -2],
      [-2, +1],
      [+2, +1],
      [-3, 0],
      [+3, 0],
      [-3, -1],
      [+3, -1],
      [-3, -2],
      [+3, -2],
      [0, -3],
      [-1, -3],
      [+1, -3],
      [-2, -3],
      [+2, -3],
      [-3, -3],
      [+3, -3],
      [-3, +1],
      [+3, +1]
    ]
    for (const [dx, dy] of placesToConsiderByOrderOfPriority) {
      const x = positionX + dx
      const y = teamIndex === 0 ? positionY - 1 + dy : 5 - (positionY - 1) - dy

      if (
        x >= 0 &&
        x < this.board.columns &&
        y >= 0 &&
        y < this.board.rows &&
        this.board.getValue(x, y) === undefined
      ) {
        return { x, y }
      }
    }
    return this.getFirstAvailablePlaceOnBoard(teamIndex)
  }

  getClosestAvailablePlaceOnBoardToPokemon(
    pokemon: IPokemon | IPokemonEntity,
    teamIndex: number
  ): { x: number; y: number } {
    return this.getClosestAvailablePlaceOnBoardTo(
      pokemon.positionX,
      pokemon.positionY,
      teamIndex
    )
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
      case Stat.AP:
        pokemon.addAbilityPower(value)
        break
      case Stat.PP:
        pokemon.setPP(pokemon.pp + value)
        break
      case Stat.ATK_SPEED:
        pokemon.addAttackSpeed(value)
        break
      case Stat.CRIT_CHANCE:
        pokemon.addCritChance(value)
        break
      case Stat.CRIT_DAMAGE:
        pokemon.addCritDamage(value)
        break
      case Stat.SHIELD:
        pokemon.addShield(value, pokemon)
        break
      case Stat.HP:
        pokemon.handleHeal(value, pokemon, 0)
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
      this.applyItemEffect(pokemon, item)
    })

    if (pokemon.passive === Passive.SYNCHRO) {
      pokemon.status.triggerSynchro()
    }
  }

  applyItemEffect(pokemon: PokemonEntity, item: Item) {
    if (ItemStats[item]) {
      Object.entries(ItemStats[item]).forEach(([stat, value]) =>
        this.applyStat(pokemon, stat as Stat, value)
      )
    }

    if (item === Item.SOUL_DEW) {
      pokemon.status.triggerSoulDew(1000)
    }

    if (item === Item.WIDE_LENS) {
      pokemon.range += 2
    }

    if (item === Item.MAX_REVIVE) {
      pokemon.status.resurection = true
    }
  }

  applySynergyEffects(pokemon: PokemonEntity) {
    if (pokemon.team === Team.BLUE_TEAM) {
      this.applyEffects(pokemon, pokemon.types, this.blueEffects)
    } else if (pokemon.team === Team.RED_TEAM) {
      this.applyEffects(pokemon, pokemon.types, this.redEffects)
    }
  }

  applyWeatherEffects(pokemon: PokemonEntity) {
    const weatherEffect = WeatherEffects.get(this.weather)
    if (weatherEffect) {
      switch (weatherEffect) {
        case Effect.WINDY:
          pokemon.addDodgeChance(
            pokemon.types.includes(Synergy.FLYING) ? 0.2 : 0.1
          )
          break
        case Effect.NIGHT:
          pokemon.addCritChance(10)
          break
        case Effect.SNOW:
          pokemon.addAttackSpeed(-25)
          break
      }
      pokemon.effects.push(weatherEffect)
    }
  }

  applyPostEffects() {
    ;[this.blueTeam, this.redTeam].forEach((team) => {
      const ironDefenseCandidates = Array.from(team.values()).filter((p) =>
        p.effects.includes(Effect.IRON_DEFENSE)
      )
      if (ironDefenseCandidates.length > 0) {
        ironDefenseCandidates.forEach((pokemon) => {
          pokemon.effects.splice(
            pokemon.effects.findIndex((e) => e === Effect.IRON_DEFENSE),
            1
          )
        })
        const ironDefensePkm = pickRandomIn(ironDefenseCandidates)
        ironDefensePkm.addAttack(ironDefensePkm.baseAtk)
        ironDefensePkm.effects.push(Effect.IRON_DEFENSE)
      }

      const steelSurgeCandidates = Array.from(team.values()).filter((p) =>
        p.effects.includes(Effect.STEEL_SURGE)
      )

      if (steelSurgeCandidates.length > 0) {
        steelSurgeCandidates.forEach((pokemon) => {
          pokemon.effects.splice(
            pokemon.effects.findIndex((e) => e === Effect.STEEL_SURGE),
            1
          )
          pokemon.effects.push(Effect.AUTOMATE)
        })
        const steelSurgePkm = pickRandomIn(steelSurgeCandidates)
        steelSurgePkm.addAttack(steelSurgePkm.baseAtk)
        steelSurgePkm.effects.push(Effect.STEEL_SURGE)
      }

      team.forEach((pokemon) => {
        if (pokemon.effects.includes(Effect.AUTOMATE)) {
          pokemon.addAttack(pokemon.baseAtk)
        }
        if (
          pokemon.effects.includes(Effect.DRAGON_SCALES) ||
          pokemon.effects.includes(Effect.DRAGON_DANCE)
        ) {
          pokemon.addMaxHP(30 * pokemon.stars)
          pokemon.life = pokemon.hp
        }
        if (pokemon.effects.includes(Effect.DRAGON_DANCE)) {
          pokemon.addAbilityPower(10 * pokemon.stars)
          pokemon.addAttackSpeed(10 * pokemon.stars)
        }
        let shieldBonus = 0
        if (pokemon.effects.includes(Effect.STAMINA)) {
          shieldBonus = 10
        }
        if (pokemon.effects.includes(Effect.STRENGTH)) {
          shieldBonus += 25
        }
        if (pokemon.effects.includes(Effect.ROCK_SMASH)) {
          shieldBonus += 35
        }
        if (pokemon.effects.includes(Effect.PURE_POWER)) {
          shieldBonus += 55
        }
        if (shieldBonus >= 0) {
          pokemon.addShield(shieldBonus, pokemon)
          const cells = this.board.getAdjacentCells(
            pokemon.positionX,
            pokemon.positionY
          )

          cells.forEach((cell) => {
            if (cell.value && pokemon.team == cell.value.team) {
              cell.value.addShield(shieldBonus, pokemon)
            }
          })
        }
        if (pokemon.items.has(Item.LUCKY_EGG)) {
          ;[-1, 0, 1].forEach((offset) => {
            const ally = this.board.getValue(
              pokemon.positionX + offset,
              pokemon.positionY
            )
            if (ally && ally.team === pokemon.team) {
              ally.addAbilityPower(40)
            }
          })
        }
        if (pokemon.items.has(Item.CLEANSE_TAG)) {
          ;[-1, 0, 1].forEach((offset) => {
            const ally = this.board.getValue(
              pokemon.positionX + offset,
              pokemon.positionY
            )
            if (ally && ally.team === pokemon.team) {
              ally.addShield(Math.ceil(0.25 * ally.hp), ally, false)
              ally.status.triggerRuneProtect(6000)
            }
          })
        }

        if (pokemon.items.has(Item.GRACIDEA_FLOWER)) {
          ;[-1, 0, 1].forEach((offset) => {
            const value = this.board.getValue(
              pokemon.positionX + offset,
              pokemon.positionY
            )
            if (value) {
              value.addAttackSpeed(25)
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

        if (pokemon.items.has(Item.FLAME_ORB)) {
          pokemon.addAttack(pokemon.baseAtk)
          pokemon.status.triggerBurn(
            60000,
            pokemon as PokemonEntity,
            pokemon as PokemonEntity,
            this.board
          )
        }

        if (pokemon.items.has(Item.FLUFFY_TAIL)) {
          pokemon.status.triggerRuneProtect(60000)
        }
      })
    })

    if (this.blueEffects.includes(Effect.MOON_FORCE)) {
      this.redTeam.forEach((pkm) => pkm.status.triggerCharm(2000, pkm))
    }
    if (this.redEffects.includes(Effect.MOON_FORCE)) {
      this.blueTeam.forEach((pkm) => pkm.status.triggerCharm(2000, pkm))
    }
  }

  applyEffects(
    pokemon: PokemonEntity,
    types: ArraySchema<Synergy>,
    allyEffects: Effect[]
  ) {
    allyEffects.forEach((effect) => {
      switch (effect) {
        case Effect.HONE_CLAWS:
          if (types.includes(Synergy.DARK)) {
            pokemon.addCritChance(40)
            pokemon.addCritDamage(0.25)
            pokemon.effects.push(Effect.HONE_CLAWS)
          }
          break

        case Effect.ASSURANCE:
          if (types.includes(Synergy.DARK)) {
            pokemon.addCritChance(60)
            pokemon.addCritDamage(0.35)
            pokemon.effects.push(Effect.ASSURANCE)
          }
          break

        case Effect.BEAT_UP:
          if (types.includes(Synergy.DARK)) {
            pokemon.addCritChance(80)
            pokemon.addCritDamage(0.5)
            pokemon.effects.push(Effect.BEAT_UP)
          }
          break

        case Effect.ANCIENT_POWER:
        case Effect.ELDER_POWER:
        case Effect.FORGOTTEN_POWER:
          if (types.includes(Synergy.FOSSIL)) {
            pokemon.effects.push(effect)
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
            pokemon.addDodgeChance(0.3)
            pokemon.effects.push(Effect.RAIN_DANCE)
          }
          break

        case Effect.DRIZZLE:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.45)
            pokemon.effects.push(Effect.DRIZZLE)
          }
          break

        case Effect.PRIMORDIAL_SEA:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.6)
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
          if (types.includes(Synergy.FIGHTING)) {
            pokemon.effects.push(Effect.GUTS)
          }
          break

        case Effect.DEFIANT:
          if (types.includes(Synergy.FIGHTING)) {
            pokemon.effects.push(Effect.DEFIANT)
          }
          break

        case Effect.JUSTIFIED:
          if (types.includes(Synergy.FIGHTING)) {
            pokemon.effects.push(Effect.JUSTIFIED)
          }
          break

        case Effect.IRON_DEFENSE:
          if (types.includes(Synergy.STEEL)) {
            pokemon.effects.push(Effect.IRON_DEFENSE)
          }
          break

        case Effect.AUTOMATE:
          if (types.includes(Synergy.STEEL)) {
            pokemon.effects.push(Effect.AUTOMATE)
          }
          break

        case Effect.STEEL_SURGE:
          if (types.includes(Synergy.STEEL)) {
            pokemon.effects.push(Effect.STEEL_SURGE)
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
            pokemon.addAbilityPower(50)
          }
          break

        case Effect.LIGHT_SCREEN:
          if (types.includes(Synergy.PSYCHIC)) {
            pokemon.effects.push(Effect.LIGHT_SCREEN)
            pokemon.addAbilityPower(100)
          }
          break

        case Effect.EERIE_SPELL:
          if (types.includes(Synergy.PSYCHIC)) {
            pokemon.effects.push(Effect.EERIE_SPELL)
            pokemon.addAbilityPower(150)
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
            pokemon.flyingProtection = 1
            pokemon.effects.push(Effect.TAILWIND)
          }
          break

        case Effect.FEATHER_DANCE:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = 1
            pokemon.effects.push(Effect.FEATHER_DANCE)
          }
          break

        case Effect.MAX_AIRSTREAM:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = 2
            pokemon.effects.push(Effect.MAX_AIRSTREAM)
          }
          break

        case Effect.MAX_GUARD:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = 2
            pokemon.effects.push(Effect.MAX_GUARD)
          }
          break

        case Effect.SWIFT_SWIM:
          if (types.includes(Synergy.AQUATIC)) {
            pokemon.effects.push(Effect.SWIFT_SWIM)
          }
          break

        case Effect.HYDRATION:
          if (types.includes(Synergy.AQUATIC)) {
            pokemon.effects.push(Effect.HYDRATION)
          }
          break

        case Effect.WATER_VEIL:
          if (types.includes(Synergy.AQUATIC)) {
            pokemon.effects.push(Effect.WATER_VEIL)
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
          if (types.includes(Synergy.ROCK)) {
            pokemon.addDefense(5)
            pokemon.effects.push(Effect.BATTLE_ARMOR)
          }
          break

        case Effect.MOUTAIN_RESISTANCE:
          if (types.includes(Synergy.ROCK)) {
            pokemon.addDefense(10)
            pokemon.effects.push(Effect.MOUTAIN_RESISTANCE)
          }
          break

        case Effect.DIAMOND_STORM:
          if (types.includes(Synergy.ROCK)) {
            pokemon.addDefense(20)
            pokemon.effects.push(Effect.DIAMOND_STORM)
          }
          break

        case Effect.PHANTOM_FORCE:
        case Effect.CURSE:
        case Effect.SHADOW_TAG:
        case Effect.WANDERING_SPIRIT:
          if (types.includes(Synergy.GHOST)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.AROMATIC_MIST:
        case Effect.FAIRY_WIND:
        case Effect.STRANGE_STEAM:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.DRAGON_ENERGY:
        case Effect.DRAGON_SCALES:
        case Effect.DRAGON_DANCE:
          if (types.includes(Synergy.DRAGON)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.COOL_BREEZE:
          pokemon.effects.push(Effect.COOL_BREEZE)
          pokemon.addSpecialDefense(2)
          break

        case Effect.CHILLY:
          pokemon.effects.push(Effect.FROSTY)
          pokemon.addSpecialDefense(4)
          break

        case Effect.FROSTY:
          pokemon.effects.push(Effect.FROSTY)
          pokemon.addSpecialDefense(8)
          break

        case Effect.FREEZING:
          pokemon.effects.push(Effect.FROSTY)
          pokemon.addSpecialDefense(15)
          break

        case Effect.SHEER_COLD:
          pokemon.effects.push(Effect.SHEER_COLD)
          pokemon.addSpecialDefense(30)
          break

        case Effect.POISONOUS:
        case Effect.VENOMOUS:
        case Effect.TOXIC:
          if (types.includes(Synergy.POISON)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.LARGO:
        case Effect.ALLEGRO:
        case Effect.PRESTO:
          if (types.includes(Synergy.SOUND)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.COCOON:
        case Effect.INFESTATION:
        case Effect.HORDE:
        case Effect.HEART_OF_THE_SWARM:
          if (types.includes(Synergy.BUG)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.TILLER:
        case Effect.DIGGER:
        case Effect.DRILLER:
          if (types.includes(Synergy.GROUND)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.DUBIOUS_DISC:
        case Effect.LINK_CABLE:
        case Effect.GOOGLE_SPECS:
          if (types.includes(Synergy.ARTIFICIAL) && pokemon.items.size > 0) {
            const nbItems =
              pokemon.items.size + (pokemon.items.has(Item.WONDER_BOX) ? 1 : 0)
            const attackBoost = {
              [Effect.DUBIOUS_DISC]: 0.1,
              [Effect.LINK_CABLE]: 0.2,
              [Effect.GOOGLE_SPECS]: 0.3
            }[effect]
            const apBoost = {
              [Effect.DUBIOUS_DISC]: 10,
              [Effect.LINK_CABLE]: 20,
              [Effect.GOOGLE_SPECS]: 30
            }[effect]
            const shieldBoost = {
              [Effect.DUBIOUS_DISC]: 0.1,
              [Effect.LINK_CABLE]: 0.2,
              [Effect.GOOGLE_SPECS]: 0.3
            }[effect]
            pokemon.addAttack(attackBoost * pokemon.baseAtk * nbItems)
            pokemon.addAbilityPower(apBoost * nbItems)
            pokemon.addShield(shieldBoost * pokemon.hp * nbItems, pokemon)
            pokemon.effects.push(Effect.GOOGLE_SPECS)
          }
          break

        case Effect.HATCHER:
        case Effect.BREEDER:
          if (types.includes(Synergy.BABY)) {
            pokemon.effects.push(effect)
          }
          break

        case Effect.GRASSY_TERRAIN:
          if (types.includes(Synergy.GRASS)) {
            pokemon.status.grassField = true
            pokemon.effects.push(Effect.GRASSY_TERRAIN)
          }
          break

        case Effect.PSYCHIC_TERRAIN:
          if (types.includes(Synergy.PSYCHIC)) {
            pokemon.addPsychicField()
            pokemon.effects.push(Effect.PSYCHIC_TERRAIN)
          }
          break

        case Effect.ELECTRIC_TERRAIN:
          if (types.includes(Synergy.ELECTRIC)) {
            pokemon.addElectricField()
            pokemon.effects.push(Effect.ELECTRIC_TERRAIN)
          }
          break

        case Effect.MISTY_TERRAIN:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.status.fairyField = true
            pokemon.effects.push(Effect.MISTY_TERRAIN)
          }
          break

        default:
          break
      }
    })
    if (pokemon.passive === Passive.CLEAR_WING) {
      pokemon.status.triggerClearWing(1000)
    }
  }

  update(dt: number) {
    if (this.blueTeam.size === 0 || this.redTeam.size === 0) {
      this.finished = true
      if (this.blueTeam.size === 0 && this.redTeam.size > 0) {
        this.winnerId = this.redPlayer ? this.redPlayer.id : "pve"
        this.redTeam.forEach((p) => {
          p.action = PokemonActionState.HOP
        })
      } else if (this.redTeam.size === 0 && this.blueTeam.size > 0) {
        this.winnerId = this.bluePlayer?.id ?? ""
        this.blueTeam.forEach((p) => {
          p.action = PokemonActionState.HOP
        })
      }
    }

    this.blueTeam.forEach((pkm, key) => {
      this.blueDpsMeter
        .get(key)
        ?.changeDamage(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage)
      this.blueHealDpsMeter.get(key)?.changeHeal(pkm.healDone, pkm.shieldDone)

      if (
        (!pkm.life || pkm.life <= 0) &&
        !pkm.status.resurecting &&
        !pkm.status.resurection
      ) {
        this.blueTeam.delete(key)
      } else {
        pkm.update(dt, this.board, this.weather)
      }
    })

    this.redTeam.forEach((pkm, key) => {
      this.redDpsMeter
        .get(key)
        ?.changeDamage(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage)
      this.redHealDpsMeter.get(key)?.changeHeal(pkm.healDone, pkm.shieldDone)

      if (
        (!pkm.life || pkm.life <= 0) &&
        !pkm.status.resurecting &&
        !pkm.status.resurection
      ) {
        this.redTeam.delete(key)
      } else {
        pkm.update(dt, this.board, this.weather)
      }
    })

    if (this.weather === Weather.STORM) {
      this.stormLightningTimer -= dt
      if (this.stormLightningTimer <= 0) {
        this.stormLightningTimer = randomBetween(4000, 8000)
        // trigger lightning
        const x = randomBetween(0, this.board.columns - 1)
        const y = randomBetween(0, this.board.rows - 1)
        //logger.debug('lightning at ' + x + ' ' + y)
        const pokemonOnCell = this.board.getValue(x, y)
        if (
          pokemonOnCell &&
          pokemonOnCell.types.includes(Synergy.ELECTRIC) === false
        ) {
          pokemonOnCell.handleSpecialDamage(
            100,
            this.board,
            AttackType.SPECIAL,
            null,
            false
          )
        }
        this.room.broadcast(Transfer.BOARD_EVENT, {
          id: this.id,
          type: BoardEvent.LIGHTNING,
          x,
          y
        })
      }
    }
  }

  stop() {
    this.blueTeam.forEach((pokemon, key) => {
      // logger.debug('deleting ' + pokemon.name);
      this.blueTeam.delete(key)
    })

    this.redTeam.forEach((pokemon, key) => {
      // logger.debug('deleting ' + pokemon.name);
      this.redTeam.delete(key)
    })

    this.weather = Weather.NEUTRAL
    this.winnerId = ""
    this.room.broadcast(Transfer.SIMULATION_STOP)
  }
}
