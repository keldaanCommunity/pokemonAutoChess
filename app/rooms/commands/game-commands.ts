import { Command } from "@colyseus/command"
import { ItemRecipe, PkmCost, NeutralStage } from "../../types/Config"
import { Item, BasicItems } from "../../types/enum/Item"
import { BattleResult } from "../../types/enum/Game"
import Player from "../../models/colyseus-models/player"
import PokemonFactory from "../../models/pokemon-factory"
import ItemFactory from "../../models/item-factory"
import UserMetadata from "../../models/mongo-models/user-metadata"
import GameRoom from "../game-room"
import { Client } from "colyseus"
import { Effect } from "../../types/enum/Effect"
import { Title } from "../../types"
import { MapSchema } from "@colyseus/schema"
import { GamePhaseState, Rarity } from "../../types/enum/Game"
import {
  IDragDropMessage,
  IDragDropItemMessage,
  IDragDropCombineMessage,
  IClient,
  IPokemonEntity,
  Transfer
} from "../../types"
import { Synergy } from "../../types/enum/Synergy"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Pokemon } from "../../models/colyseus-models/pokemon"
import { Ability } from "../../types/enum/Ability"

export class OnShopCommand extends Command<
  GameRoom,
  {
    id: string
    index: number
  }
> {
  execute({ id, index }) {
    if (id !== undefined && index !== undefined && this.state.players.has(id)) {
      const player = this.state.players.get(id)
      if (player && player.shop[index]) {
        const name = player.shop[index]
        let pokemon = PokemonFactory.createPokemonFromName(
          name,
          player.pokemonCollection.get(PkmIndex[name])
        )
        if (
          pokemon.name !== Pkm.MAGIKARP &&
          player.money >= pokemon.cost &&
          (this.room.getBoardSize(player.board) < 8 ||
            (this.room.getPossibleEvolution(player.board, pokemon.name) &&
              this.room.getBoardSize(player.board) == 8))
        ) {
          player.money -= pokemon.cost
          if (pokemon.skill === Ability.PROTEAN) {
            const rankArray = new Array<{ s: Synergy; v: number }>()
            player.synergies.forEach((value, key) => {
              if (!pokemon.types.includes(key as Synergy)) {
                rankArray.push({ s: key as Synergy, v: value })
              }
            })
            rankArray.sort((a, b) => {
              return b.v - a.v
            })
            for (let i = 0; i < 2; i++) {
              const kv = rankArray.shift()
              if (kv) {
                pokemon.types.push(kv.s)
              }
            }
            player.synergies.update(player.board)
            player.effects.update(player.synergies)
          }
          if (pokemon.name == Pkm.CASTFORM) {
            if (
              player.synergies.get(Synergy.FIRE) ||
              player.synergies.get(Synergy.WATER) ||
              player.synergies.get(Synergy.ICE)
            ) {
              const rankArray = [
                {
                  s: Synergy.FIRE,
                  v: player.synergies.get(Synergy.FIRE)
                    ? player.synergies.get(Synergy.FIRE)
                    : 0
                },
                {
                  s: Synergy.WATER,
                  v: player.synergies.get(Synergy.WATER)
                    ? player.synergies.get(Synergy.WATER)
                    : 0
                },
                {
                  s: Synergy.ICE,
                  v: player.synergies.get(Synergy.ICE)
                    ? player.synergies.get(Synergy.ICE)
                    : 0
                }
              ]
              rankArray.sort((a, b) => {
                const va = a.v ? a.v : 0
                const vb = b.v ? b.v : 0
                return vb - va
              })
              switch (rankArray[0].s) {
                case Synergy.FIRE:
                  pokemon = PokemonFactory.createPokemonFromName(
                    Pkm.CASTFORM_SUN,
                    player.pokemonCollection.get(PkmIndex[Pkm.CASTFORM_SUN])
                  )
                  break
                case Synergy.WATER:
                  pokemon = PokemonFactory.createPokemonFromName(
                    Pkm.CASTFORM_RAIN,
                    player.pokemonCollection.get(PkmIndex[Pkm.CASTFORM_RAIN])
                  )
                  break
                case Synergy.ICE:
                  pokemon = PokemonFactory.createPokemonFromName(
                    Pkm.CASTFORM_HAIL,
                    player.pokemonCollection.get(PkmIndex[Pkm.CASTFORM_HAIL])
                  )
                  break
              }
            }
          }
          const x = this.room.getFirstAvailablePositionInBoard(player.id)
          pokemon.positionX = x !== undefined ? x : -1
          pokemon.positionY = 0
          player.board.set(pokemon.id, pokemon)

          if (pokemon.rarity == Rarity.MYTHICAL) {
            this.state.shop.assignShop(player)
          } else {
            player.shop[index] = Pkm.DEFAULT
          }
          this.room.updateEvolution(id)
        }
      }
    }
  }
}

export class OnItemCommand extends Command<
  GameRoom,
  {
    playerId: string
    id: string
  }
> {
  execute({ playerId, id }) {
    const player = this.state.players.get(playerId)
    if (player) {
      if (player.itemsProposition.includes(id)) {
        player.items.add(id)
      }
      while (player.itemsProposition.length > 0) {
        player.itemsProposition.pop()
      }
    }
  }
}

export class OnPokemonPropositionCommand extends Command<
  GameRoom,
  {
    playerId: string
    pkm: Pkm
  }
> {
  execute({ playerId, pkm }) {
    const player = this.state.players.get(playerId)
    if (player) {
      if (player.pokemonsProposition.includes(pkm)) {
        this.state.additionalPokemons.push(pkm)
        this.state.shop.addAdditionalPokemon(pkm)
        if (this.room.getBoardSize(player.board) < 8) {
          const pokemon = PokemonFactory.createPokemonFromName(
            pkm,
            player.pokemonCollection.get(PkmIndex[pkm])
          )
          const x = this.room.getFirstAvailablePositionInBoard(player.id)
          pokemon.positionX = x !== undefined ? x : -1
          pokemon.positionY = 0
          player.board.set(pokemon.id, pokemon)
        }
      }
      while (player.pokemonsProposition.length > 0) {
        player.pokemonsProposition.pop()
      }
    }
  }
}

export class OnDragDropCommand extends Command<
  GameRoom,
  {
    client: IClient
    detail: IDragDropMessage
  }
> {
  execute({ client, detail }) {
    const commands = []
    let success = false
    let dittoReplaced = false
    const message = {
      updateBoard: true,
      updateItems: true
    }
    const playerId = client.auth.uid
    const player = this.state.players.get(playerId)

    if (player) {
      message.updateItems = false
      const pokemon = player.board.get(detail.id)
      if (pokemon) {
        const x = parseInt(detail.x)
        const y = parseInt(detail.y)
        if (pokemon.name == Pkm.DITTO) {
          const pokemonToClone = this.room.getPokemonByPosition(playerId, x, y)
          if (
            pokemonToClone &&
            pokemonToClone.rarity != Rarity.MYTHICAL &&
            !pokemonToClone.types.includes(Synergy.FOSSIL)
          ) {
            dittoReplaced = true
            const replaceDitto = PokemonFactory.createPokemonFromName(
              PokemonFactory.getPokemonBaseEvolution(pokemonToClone.name),
              player.pokemonCollection.get(PkmIndex[pokemonToClone.name])
            )
            player.board.delete(detail.id)
            const position =
              this.room.getFirstAvailablePositionInBoard(playerId)
            if (position !== undefined) {
              replaceDitto.positionX = position
              replaceDitto.positionY = 0
              player.board.set(replaceDitto.id, replaceDitto)
              success = true
              message.updateBoard = false
            }
          }
        } else {
          if (y == 0 && pokemon.positionY == 0) {
            this.room.swap(playerId, pokemon, x, y)
            success = true
          } else if (this.state.phase == GamePhaseState.PICK) {
            const teamSize = this.room.getTeamSize(player.board)
            if (teamSize < player.experienceManager.level) {
              this.room.swap(playerId, pokemon, x, y)
              success = true
            } else if (teamSize == player.experienceManager.level) {
              const empty = this.room.isPositionEmpty(playerId, x, y)
              if (!empty) {
                this.room.swap(playerId, pokemon, x, y)
                success = true
                message.updateBoard = false
              } else {
                if ((pokemon.positionY != 0 && y != 0) || y == 0) {
                  this.room.swap(playerId, pokemon, x, y)
                  success = true
                  message.updateBoard = false
                }
              }
            }
          }
        }
        player.synergies.update(player.board)
        player.effects.update(player.synergies)
        player.boardSize = this.room.getTeamSize(player.board)
      }

      if (!success && client.send) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
      }
      if (dittoReplaced) {
        this.room.updateEvolution(playerId)
      }

      player.synergies.update(player.board)
      player.effects.update(player.synergies)
    }
    if (commands.length > 0) {
      return commands
    }
  }
}

export class OnDragDropCombineCommand extends Command<
  GameRoom,
  {
    client: Client
    detail: IDragDropCombineMessage
  }
> {
  execute({ client, detail }) {
    const playerId = client.auth.uid
    const message = {
      updateBoard: true,
      updateItems: true
    }
    const player = this.state.players.get(playerId)

    if (player) {
      message.updateBoard = false
      message.updateItems = true

      const itemA = detail.itemA
      const itemB = detail.itemB

      //verify player has both items
      if (!player.items.has(itemA) || !player.items.has(itemB)) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }
      // check for two if both items are same
      else if (itemA == itemB) {
        let count = 0
        player.items.forEach((item) => {
          if (item == itemA) {
            count++
          }
        })

        if (count < 2) {
          client.send(Transfer.DRAG_DROP_FAILED, message)
          return
        }
      }

      // find recipe result
      let result: Item | undefined = undefined
      for (const [key, value] of Object.entries(ItemRecipe) as [
        Item,
        Item[]
      ][]) {
        if (
          (value[0] == itemA && value[1] == itemB) ||
          (value[0] == itemB && value[1] == itemA)
        ) {
          result = key
          break
        }
      }

      if (!result) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      } else {
        player.items.add(result)
        player.items.delete(itemA)
        player.items.delete(itemB)
      }

      player.synergies.update(player.board)
      player.effects.update(player.synergies)
    }
  }
}
export class OnDragDropItemCommand extends Command<
  GameRoom,
  {
    client: Client
    detail: IDragDropItemMessage
  }
> {
  execute({ client, detail }) {
    const commands = new Array<Command>()
    const playerId = client.auth.uid
    const message = {
      updateBoard: true,
      updateItems: true
    }
    const player = this.state.players.get(playerId)
    if (player) {
      message.updateBoard = false
      message.updateItems = true

      const item = detail.id

      if (!player.items.has(item) && !detail.bypass) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }

      const x = parseInt(detail.x)
      const y = parseInt(detail.y)

      const pokemon = player.getPokemonAt(x, y)

      if (pokemon === undefined) {
        client.send(Transfer.DRAG_DROP_FAILED, message)
        return
      }
      // check if full items
      if (pokemon.items.size >= 3) {
        if (BasicItems.includes(item)) {
          let includesBasicItem = false
          pokemon.items.forEach((i) => {
            if (BasicItems.includes(i)) {
              includesBasicItem = true
            }
          })
          if (!includesBasicItem) {
            client.send(Transfer.DRAG_DROP_FAILED, message)
            return
          }
        } else {
          client.send(Transfer.DRAG_DROP_FAILED, message)
          return
        }
      }

      // SPECIAL CASES: create a new pokemon on item equip
      let newItemPokemon: Pokemon | undefined = undefined
      let equipAfterTransform = true
      const fossil = PokemonFactory.getRandomFossil(player.board)

      switch (pokemon.name) {
        case Pkm.EEVEE:
          switch (item) {
            case Item.WATER_STONE:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.VAPOREON,
                player.pokemonCollection.get(PkmIndex[Pkm.VAPOREON])
              )
              break
            case Item.FIRE_STONE:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.FLAREON,
                player.pokemonCollection.get(PkmIndex[Pkm.FLAREON])
              )
              break
            case Item.THUNDER_STONE:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.JOLTEON,
                player.pokemonCollection.get(PkmIndex[Pkm.JOLTEON])
              )
              break
            case Item.DUSK_STONE:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.UMBREON,
                player.pokemonCollection.get(PkmIndex[Pkm.UMBREON])
              )
              break
            case Item.MOON_STONE:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.SYLVEON,
                player.pokemonCollection.get(PkmIndex[Pkm.SYLVEON])
              )
              break
            case Item.LEAF_STONE:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.LEAFEON,
                player.pokemonCollection.get(PkmIndex[Pkm.LEAFEON])
              )
              break
            case Item.DAWN_STONE:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.ESPEON,
                player.pokemonCollection.get(PkmIndex[Pkm.ESPEON])
              )
              break
            case Item.ICY_ROCK:
              newItemPokemon = PokemonFactory.transformPokemon(
                pokemon,
                Pkm.GLACEON,
                player.pokemonCollection.get(PkmIndex[Pkm.GLACEON])
              )
              break
          }
          break
        case Pkm.DITTO:
          equipAfterTransform = false
          switch (item) {
            case Item.FOSSIL_STONE:
              if (fossil) {
                newItemPokemon = PokemonFactory.transformPokemon(
                  pokemon,
                  fossil,
                  player.pokemonCollection.get(PkmIndex[fossil])
                )
              }

              break
            default:
              client.send(Transfer.DRAG_DROP_FAILED, message)
              break
          }
          break
        case Pkm.GROUDON:
          if (item == Item.RED_ORB) {
            newItemPokemon = PokemonFactory.transformPokemon(
              pokemon,
              Pkm.PRIMAL_GROUDON,
              player.pokemonCollection.get(PkmIndex[Pkm.PRIMAL_GROUDON])
            )
          }
          break
        case Pkm.KYOGRE:
          if (item == Item.BLUE_ORB) {
            newItemPokemon = PokemonFactory.transformPokemon(
              pokemon,
              Pkm.PRIMAL_KYOGRE,
              player.pokemonCollection.get(PkmIndex[Pkm.PRIMAL_KYOGRE])
            )
          }
          break
        case Pkm.RAYQUAZA:
          if (item == Item.DELTA_ORB) {
            newItemPokemon = PokemonFactory.transformPokemon(
              pokemon,
              Pkm.MEGA_RAYQUAZA,
              player.pokemonCollection.get(PkmIndex[Pkm.MEGA_RAYQUAZA])
            )
          }
          break
      }

      if (newItemPokemon) {
        // delete the extra pokemons
        player.board.delete(pokemon.id)
        player.board.set(newItemPokemon.id, newItemPokemon)
        player.synergies.update(player.board)
        player.effects.update(player.synergies)
        player.boardSize = this.room.getTeamSize(player.board)
        if (equipAfterTransform) {
          newItemPokemon.items.add(item)
        }
        player.items.delete(item)
        return
      }

      // regular equip
      switch (item) {
        case Item.WATER_STONE:
          if (!pokemon.types.includes(Synergy.WATER)) {
            pokemon.types.push(Synergy.WATER)
          }
          break
        case Item.FIRE_STONE:
          if (!pokemon.types.includes(Synergy.FIRE)) {
            pokemon.types.push(Synergy.FIRE)
          }
          break
        case Item.THUNDER_STONE:
          if (!pokemon.types.includes(Synergy.ELECTRIC)) {
            pokemon.types.push(Synergy.ELECTRIC)
          }
          break
        case Item.DUSK_STONE:
          if (!pokemon.types.includes(Synergy.DARK)) {
            pokemon.types.push(Synergy.DARK)
          }
          break
        case Item.MOON_STONE:
          if (!pokemon.types.includes(Synergy.FAIRY)) {
            pokemon.types.push(Synergy.FAIRY)
          }
          break
        case Item.LEAF_STONE:
          if (!pokemon.types.includes(Synergy.GRASS)) {
            pokemon.types.push(Synergy.GRASS)
          }
          break
        case Item.DAWN_STONE:
          if (!pokemon.types.includes(Synergy.PSYCHIC)) {
            pokemon.types.push(Synergy.PSYCHIC)
          }
          break
        case Item.ICY_ROCK:
          if (!pokemon.types.includes(Synergy.ICE)) {
            pokemon.types.push(Synergy.ICE)
          }
          break
        case Item.OLD_AMBER:
          if (!pokemon.types.includes(Synergy.FOSSIL)) {
            pokemon.types.push(Synergy.FOSSIL)
          }
          break
      }

      if (BasicItems.includes(item)) {
        let itemToCombine
        pokemon.items.forEach((i) => {
          if (BasicItems.includes(i)) {
            itemToCombine = i
          }
        })
        if (itemToCombine) {
          Object.keys(ItemRecipe).forEach((n) => {
            const name = n as Item
            const recipe = ItemRecipe[name]
            if (
              recipe &&
              ((recipe[0] == itemToCombine && recipe[1] == item) ||
                (recipe[0] == item && recipe[1] == itemToCombine))
            ) {
              pokemon.items.delete(itemToCombine)
              player.items.delete(item)

              if (pokemon.items.has(name)) {
                player.items.add(name)
              } else {
                const detail: IDragDropItemMessage = {
                  id: name,
                  x: pokemon.positionX,
                  y: pokemon.positionY,
                  bypass: true
                }
                commands.push(
                  new OnDragDropItemCommand().setPayload({
                    client: client,
                    detail: detail
                  })
                )
              }
            }
          })
        } else {
          pokemon.items.add(item)
          player.items.delete(item)
        }
      } else {
        if (pokemon.items.has(item)) {
          client.send(Transfer.DRAG_DROP_FAILED, message)
          return
        } else {
          pokemon.items.add(item)
          player.items.delete(item)
        }
      }

      player.synergies.update(player.board)
      player.effects.update(player.synergies)
      if (commands.length > 0) {
        return commands
      }
    }
  }
}

export class OnSellDropCommand extends Command<
  GameRoom,
  {
    client: Client
    detail: { pokemonId: string }
  }
> {
  execute({ client, detail }) {
    const player = this.state.players.get(client.auth.uid)

    if (player) {
      const pokemon = player.board.get(detail.pokemonId)
      if (pokemon) {
        if (PokemonFactory.getPokemonBaseEvolution(pokemon.name) == Pkm.EEVEE) {
          player.money += PkmCost[pokemon.rarity]
        } else if (pokemon.types.includes(Synergy.FOSSIL)) {
          player.money += 5 + PkmCost[pokemon.rarity] * pokemon.stars
        } else {
          player.money += PkmCost[pokemon.rarity] * pokemon.stars
        }

        pokemon.items.forEach((it) => {
          player.items.add(it)
        })

        player.board.delete(detail.pokemonId)

        player.synergies.update(player.board)
        player.effects.update(player.synergies)
        player.boardSize = this.room.getTeamSize(player.board)
      }
    }
  }
}

export class OnRefreshCommand extends Command<
  GameRoom,
  {
    id: string
  }
> {
  execute(id) {
    const player = this.state.players.get(id)
    if (player && player.money >= 1) {
      this.state.shop.assignShop(player)
      player.money -= 1
    }
  }
}

export class OnLockCommand extends Command<
  GameRoom,
  {
    id: string
  }
> {
  execute(id) {
    const player = this.state.players.get(id)
    if (player) {
      player.shopLocked = !player.shopLocked
    }
  }
}

export class OnLevelUpCommand extends Command<
  GameRoom,
  {
    id: string
  }
> {
  execute(id) {
    const player = this.state.players.get(id)
    if (player) {
      if (player.money >= 4 && player.experienceManager.canLevel()) {
        player.experienceManager.addExperience(4)
        player.money -= 4
      }
    }
  }
}

export class OnJoinCommand extends Command<
  GameRoom,
  {
    client: Client
    options: any
    auth: any
  }
> {
  execute({ client, options, auth }) {
    UserMetadata.findOne({ uid: auth.uid }, (err, user) => {
      if (user) {
        const player = new Player(
          user.uid,
          user.displayName,
          user.elo,
          user.avatar,
          false,
          this.state.players.size + 1,
          user.pokemonCollection,
          user.title,
          user.role
        )

        this.state.players.set(client.auth.uid, player)

        if (client && client.auth && client.auth.displayName) {
          console.log(`${client.auth.displayName} ${client.id} join game room`)
        }

        // console.log(this.state.players.get(client.auth.uid).tileset);
        this.state.shop.assignShop(player)
        if (this.state.players.size >= 8) {
          // console.log('game elligible to xp');
          this.state.elligibleToXP = true
          let c = 0
          this.state.players.forEach((p) => {
            if (!p.isBot) {
              c += 1
            }
          })
          if (c === 1) {
            this.state.players.forEach((p) => {
              if (!p.isBot) {
                p.titles.add(Title.LONE_WOLF)
              }
            })
          }
        }
      }
    })
  }
}

export class OnUpdateCommand extends Command<
  GameRoom,
  {
    deltaTime: number
  }
> {
  execute({ deltaTime }) {
    if (deltaTime) {
      let updatePhaseNeeded = false
      this.state.time -= deltaTime
      if (Math.round(this.state.time / 1000) != this.state.roundTime) {
        this.state.roundTime = Math.round(this.state.time / 1000)
      }
      if (this.state.time < 0) {
        updatePhaseNeeded = true
      } else if (this.state.phase == GamePhaseState.FIGHT) {
        let everySimulationFinished = true

        this.state.players.forEach((player, key) => {
          if (!player.simulation.finished) {
            if (everySimulationFinished) {
              everySimulationFinished = false
            }
            player.simulation.update(deltaTime)
            if (player.simulation.generatedMoney > 0) {
              player.money += player.simulation.generatedMoney
              player.simulation.generatedMoney = 0
            }
          }
        })

        if (everySimulationFinished) {
          updatePhaseNeeded = true
        }
      }
      if (updatePhaseNeeded) {
        return [new OnUpdatePhaseCommand()]
      }
    }
  }
}

export class OnUpdatePhaseCommand extends Command<GameRoom, any> {
  execute() {
    if (this.state.phase == GamePhaseState.PICK) {
      const commands = this.checkForLazyTeam()
      if (commands.length != 0) {
        return commands
      }
      this.initializeFightingPhase()
    } else if (this.state.phase == GamePhaseState.FIGHT) {
      this.computeAchievments()
      this.computeStreak()
      this.computeLife()
      this.rankPlayers()
      this.checkDeath()
      const kickCommands = this.checkEndGame()
      if (kickCommands.length != 0) {
        return kickCommands
      }
      this.computeIncome()
      this.initializePickingPhase()
    }
  }

  computeAchievments() {
    this.state.players.forEach((player, key) => {
      this.checkSuccess(player)
    })
  }

  checkSuccess(player: Player) {
    player.titles.add(Title.NOVICE)
    player.simulation.blueEffects.forEach((effect) => {
      switch (effect) {
        case Effect.PURE_POWER:
          player.titles.add(Title.POKEFAN)
          break
        case Effect.SPORE:
          player.titles.add(Title.POKEMON_RANGER)
          break
        case Effect.DESOLATE_LAND:
          player.titles.add(Title.KINDLER)
          break
        case Effect.PRIMORDIAL_SEA:
          player.titles.add(Title.FIREFIGHTER)
          break
        case Effect.OVERDRIVE:
          player.titles.add(Title.ELECTRICIAN)
          break
        case Effect.PUNISHMENT:
          player.titles.add(Title.BLACK_BELT)
          break
        case Effect.EERIE_SPELL:
          player.titles.add(Title.TELEKINESIST)
          break
        case Effect.BEAT_UP:
          player.titles.add(Title.DELINQUENT)
          break
        case Effect.AUTOTOMIZE:
          player.titles.add(Title.ENGINEER)
          break
        case Effect.SANDSTORM:
          player.titles.add(Title.GEOLOGIST)
          break
        case Effect.TOXIC:
          player.titles.add(Title.TEAM_ROCKET_GRUNT)
          break
        case Effect.DRAGON_DANCE:
          player.titles.add(Title.DRAGON_TAMER)
          break
        case Effect.ANGER_POINT:
          player.titles.add(Title.CAMPER)
          break
        case Effect.POWER_TRIP:
          player.titles.add(Title.MYTH_TRAINER)
          break
        case Effect.CALM_MIND:
          player.titles.add(Title.RIVAL)
          break
        case Effect.HYDRO_CANNON:
          player.titles.add(Title.DIVER)
          break
        case Effect.HEART_OF_THE_SWARM:
          player.titles.add(Title.BUG_MANIAC)
          break
        case Effect.MAX_GUARD:
          player.titles.add(Title.BIRD_KEEPER)
          break
        case Effect.SUN_FLOWER:
          player.titles.add(Title.GARDENER)
          break
        case Effect.DIAMOND_STORM:
          player.titles.add(Title.HIKER)
          break
        case Effect.CURSE:
          player.titles.add(Title.HEX_MANIAC)
          break
        case Effect.STRANGE_STEAM:
          player.titles.add(Title.CUTE_MANIAC)
          break
        case Effect.SHEER_COLD:
          player.titles.add(Title.SKIER)
          break
        case Effect.UNOWN_GATHERINGS:
          player.titles.add(Title.MUSEUM_DIRECTOR)
          break
        case Effect.PRESTO:
          player.titles.add(Title.MUSICIAN)
          break
        default:
          break
      }
    })
    if (player.simulation.blueEffects.length >= 5) {
      player.titles.add(Title.HARLEQUIN)
    }
    let shield = 0
    let heal = 0
    player.simulation.blueHealDpsMeter.forEach((v) => {
      shield += v.shield
      heal += v.heal
    })
    if (shield > 1000) {
      player.titles.add(Title.GARDIAN)
    }
    if (heal > 1000) {
      player.titles.add(Title.NURSE)
    }
  }

  checkEndGame() {
    const commands = []
    const numberOfPlayersAlive = this.room.getNumberOfPlayersAlive(
      this.state.players
    )

    if (numberOfPlayersAlive <= 1) {
      this.state.gameFinished = true
      this.room.broadcast(Transfer.BROADCAST_INFO, {
        title: "End of the game",
        info: "We have a winner !"
      })
      // commands.push(new OnKickPlayerCommand());
    }
    return commands
  }

  computePlayerDamage(
    redTeam: MapSchema<IPokemonEntity>,
    playerLevel: number,
    stageLevel: number
  ) {
    let damage = playerLevel - 2
    let multiplier = 1
    if (stageLevel >= 10) {
      multiplier = 1.25
    } else if (stageLevel >= 15) {
      multiplier = 1.5
    } else if (stageLevel >= 20) {
      multiplier = 2.0
    } else if (stageLevel >= 25) {
      multiplier = 3
    } else if (stageLevel >= 30) {
      multiplier = 5
    } else if (stageLevel >= 35) {
      multiplier = 8
    }
    damage = damage * multiplier
    if (redTeam.size > 0) {
      redTeam.forEach((pokemon, key) => {
        damage += pokemon.stars
      })
    }
    damage = Math.max(Math.round(damage), 0)
    return damage
  }

  rankPlayers() {
    const rankArray = new Array<{ id: string; life: number; level: number }>()
    this.state.players.forEach((player, key) => {
      if (!player.alive) {
        return
      }

      rankArray.push({
        id: player.id,
        life: player.life,
        level: player.experienceManager.level
      })
    })

    const sortPlayers = (
      a: { id: string; life: number; level: number },
      b: { id: string; life: number; level: number }
    ) => {
      let diff = b.life - a.life
      if (diff == 0) {
        diff = b.level - a.level
      }
      return diff
    }

    rankArray.sort(sortPlayers)

    rankArray.forEach((rankPlayer, index) => {
      const player = this.state.players.get(rankPlayer.id)
      if (player) {
        player.rank = index + 1
      }
    })
  }

  computeLife() {
    const isPVE = this.checkForPVE()
    this.state.players.forEach((player, key) => {
      if (player.alive) {
        const currentResult = player.getCurrentBattleResult()

        if (
          currentResult == BattleResult.DEFEAT ||
          currentResult == BattleResult.DRAW
        ) {
          player.life =
            player.life -
            this.computePlayerDamage(
              player.simulation.redTeam,
              player.experienceManager.level,
              this.state.stageLevel
            )
        }
        player.addBattleResult(
          player.opponentName,
          currentResult,
          player.opponentAvatar,
          isPVE
        )
      }
    })
  }

  computeStreak() {
    if (this.checkForPVE()) {
      return
    }

    this.state.players.forEach((player, key) => {
      if (!player.alive) {
        return
      }
      const currentResult = player.getCurrentBattleResult()
      const lastPlayerResult = player.getLastPlayerBattleResult()

      if (
        currentResult == BattleResult.DRAW ||
        currentResult != lastPlayerResult
      ) {
        player.streak = 0
      } else {
        player.streak = Math.min(player.streak + 1, 5)
      }
    })
  }

  computeIncome() {
    this.state.players.forEach((player, key) => {
      if (player.alive && !player.isBot) {
        player.interest = Math.min(Math.floor(player.money / 10), 5)
        player.money += player.interest
        player.money += player.streak
        if (player.getLastBattleResult() == BattleResult.WIN) {
          player.money += 1
        }
        player.money += 5
        player.experienceManager.addExperience(2)
      }
    })
  }

  checkDeath() {
    this.state.players.forEach((player: Player, key: string) => {
      if (player.life <= 0) {
        player.life = 0
        player.alive = false
      }
    })
  }

  initializePickingPhase() {
    this.state.phase = GamePhaseState.PICK
    const isPVE = this.checkForPVE()

    this.state.time =
      this.state.stageLevel === 10 || this.state.stageLevel === 20
        ? 50000
        : 30000

    this.state.players.forEach((player: Player, key: string) => {
      player.simulation.stop()
      if (player.alive) {
        if (player.isBot) {
          player.experienceManager.level = Math.min(
            9,
            Math.round(this.state.stageLevel / 2)
          )
        }
        if (isPVE && player.getLastBattleResult() == BattleResult.WIN) {
          const items = ItemFactory.createRandomItems()
          // let items = process.env.MODE == 'dev' ? ItemFactory.createRandomFossils(): ItemFactory.createRandomItem();
          items.forEach((item) => {
            player.itemsProposition.push(item)
          })
          // const item = ItemFactory.createRandomItem();
          // const item = ItemFactory.createSpecificItems([ItemS.BLUE_ORB]);
          player.items.add(ItemFactory.createBasicRandomItem())
        }

        player.opponentName = ""

        if (!player.shopLocked) {
          if (this.state.stageLevel == 10) {
            this.state.shop.assignFirstMythicalShop(player)
          } else if (this.state.stageLevel == 20) {
            this.state.shop.assignSecondMythicalShop(player)
          } else if (this.state.stageLevel == 2) {
            this.state.shop.assignDittoShop(player)
          } else if (this.state.stageLevel == 3) {
            this.state.shop.assignDittoShop(player)
          } else {
            this.state.shop.assignShop(player)
          }
        } else {
          player.shopLocked = false
        }
        player.board.forEach((pokemon, key) => {
          if (pokemon.fossilTimer !== undefined) {
            if (pokemon.fossilTimer == 0) {
              let pokemonEvolved
              if (pokemon.name === Pkm.CLAMPERL) {
                if (pokemon.positionX >= 4) {
                  pokemonEvolved = PokemonFactory.createPokemonFromName(
                    Pkm.HUNTAIL,
                    player.pokemonCollection.get(PkmIndex[Pkm.HUNTAIL])
                  )
                } else {
                  pokemonEvolved = PokemonFactory.createPokemonFromName(
                    Pkm.GOREBYSS,
                    player.pokemonCollection.get(PkmIndex[Pkm.GOREBYSS])
                  )
                }
              } else {
                pokemonEvolved = PokemonFactory.createPokemonFromName(
                  pokemon.evolution,
                  player.pokemonCollection.get(pokemon.index)
                )
              }

              pokemon.items.forEach((i) => {
                pokemonEvolved.items.add(i)
                switch (i) {
                  case Item.WATER_STONE:
                    pokemonEvolved.types.push(Synergy.WATER)
                    break
                  case Item.FIRE_STONE:
                    pokemonEvolved.types.push(Synergy.FIRE)
                    break
                  case Item.THUNDER_STONE:
                    pokemonEvolved.types.push(Synergy.ELECTRIC)
                    break
                  case Item.DUSK_STONE:
                    pokemonEvolved.types.push(Synergy.DARK)
                    break
                  case Item.MOON_STONE:
                    pokemonEvolved.types.push(Synergy.FAIRY)
                    break
                  case Item.LEAF_STONE:
                    pokemonEvolved.types.push(Synergy.GRASS)
                    break
                  case Item.DAWN_STONE:
                    pokemonEvolved.types.push(Synergy.PSYCHIC)
                    break
                  case Item.ICY_ROCK:
                    pokemonEvolved.types.push(Synergy.ICE)
                    break
                  case Item.OLD_AMBER:
                    pokemonEvolved.types.push(Synergy.FOSSIL)
                    break
                }
              })
              pokemonEvolved.positionX = pokemon.positionX
              pokemonEvolved.positionY = pokemon.positionY
              player.board.delete(key)
              player.board.set(pokemonEvolved.id, pokemonEvolved)
              player.synergies.update(player.board)
              player.effects.update(player.synergies)
            } else {
              pokemon.fossilTimer -= 1
            }
          }
        })
      }
    })
    if (this.state.stageLevel === 5) {
      this.state.players.forEach((player: Player) => {
        if (player.isBot) {
          const p = this.room.additionalPokemonsPool.pop()
          if (p) {
            this.state.additionalPokemons.push(p)
            this.state.shop.addAdditionalPokemon(p)
          }
        } else {
          for (let i = 0; i < 3; i++) {
            const p = this.room.additionalPokemonsPool.pop()
            if (p) {
              player.pokemonsProposition.push(p)
            }
          }
        }
      })
    }
  }

  checkForLazyTeam() {
    const commands = new Array<Command>()

    this.state.players.forEach((player, key) => {
      const teamSize = this.room.getTeamSize(player.board)
      if (teamSize < player.experienceManager.level) {
        const numberOfPokemonsToMove = player.experienceManager.level - teamSize
        for (let i = 0; i < numberOfPokemonsToMove; i++) {
          const boardSize = this.room.getBoardSizeWithoutDitto(player.board)
          if (boardSize > 0) {
            const coordinate = this.room.getFirstAvailablePositionInTeam(
              player.id
            )
            const p = this.room.getFirstPokemonOnBench(player.board)
            if (coordinate && p) {
              const detail: { id: string; x: number; y: number } = {
                id: p.id,
                x: coordinate[0],
                y: coordinate[1]
              }
              const client: IClient = {
                auth: {
                  uid: key
                }
              }
              commands.push(
                new OnDragDropCommand().setPayload({
                  client: client,
                  detail: detail
                })
              )
            }
          }
        }
      }
    })
    return commands
  }

  getPVEIndex(stageLevel: number) {
    const result = NeutralStage.findIndex((stage) => {
      return stage.turn == stageLevel
    })

    return result
  }

  checkForPVE() {
    return this.getPVEIndex(this.state.stageLevel) >= 0
  }

  initializeFightingPhase() {
    this.state.phase = GamePhaseState.FIGHT
    this.state.time = 40000
    this.state.stageLevel += 1
    this.state.botManager.updateBots()

    const stageIndex = this.getPVEIndex(this.state.stageLevel)

    this.state.players.forEach((player: Player, key: string) => {
      if (player.alive) {
        if (player.itemsProposition.length != 0) {
          if (player.itemsProposition.length == 3) {
            const i = player.itemsProposition.pop()
            if (i) {
              player.items.add(i)
            }
          }
          while (player.itemsProposition.length > 0) {
            player.itemsProposition.pop()
          }
        }

        if (player.pokemonsProposition.length != 0) {
          if (player.pokemonsProposition.length == 3) {
            const i = player.pokemonsProposition.pop()
            if (i) {
              this.state.additionalPokemons.push(i)
              this.state.shop.addAdditionalPokemon(i)
            }
          }
          while (player.pokemonsProposition.length > 0) {
            player.pokemonsProposition.pop()
          }
        }

        if (stageIndex != -1) {
          player.opponentName = "PVE"
          player.opponentAvatar = NeutralStage[stageIndex].avatar
          player.simulation.initialize(
            player.board,
            PokemonFactory.getNeutralPokemonsByLevelStage(
              this.state.stageLevel
            ),
            player.effects.list,
            []
          )
        } else {
          const opponentId = this.room.computeRandomOpponent(key)
          if (opponentId) {
            const opponent = this.state.players.get(opponentId)
            if (opponent) {
              player.simulation.initialize(
                player.board,
                opponent.board,
                player.effects.list,
                opponent.effects.list
              )
            }
          }
        }
      }
    })
  }
}
