import { Command } from "@colyseus/command"
import { SetSchema } from "@colyseus/schema"
import { Client, updateLobby } from "colyseus"
import { nanoid } from "nanoid"
import {
  AdditionalPicksStages,
  BOARD_SIDE_HEIGHT,
  BOARD_WIDTH,
  FIGHTING_PHASE_DURATION,
  ITEM_CAROUSEL_BASE_DURATION,
  ItemCarouselStages,
  ItemProposalStages,
  MAX_PLAYERS_PER_GAME,
  PORTAL_CAROUSEL_BASE_DURATION,
  PortalCarouselStages,
  StageDuration
} from "../../config"
import {
  OnItemDroppedEffect,
  OnStageStartEffect
} from "../../core/effects/effect"
import { ItemEffects } from "../../core/effects/items"
import { PassiveEffects } from "../../core/effects/passives"
import { giveRandomEgg } from "../../core/eggs"
import {
  ConditionBasedEvolutionRule,
  CountEvolutionRule,
  HatchEvolutionRule
} from "../../core/evolution-rules"
import { getFlowerPotsUnlocked } from "../../core/flower-pots"
import { selectMatchups } from "../../core/matchmaking"
import { canSell } from "../../core/pokemon-entity"
import Simulation from "../../core/simulation"
import { TownEncounters } from "../../core/town-encounters"
import { getLevelUpCost } from "../../models/colyseus-models/experience-manager"
import Player from "../../models/colyseus-models/player"
import { Pokemon, PokemonClasses } from "../../models/colyseus-models/pokemon"
import { Wanderer } from "../../models/colyseus-models/wanderer"
import { IDetailledPokemon } from "../../models/mongo-models/bot-v2"
import UserMetadata from "../../models/mongo-models/user-metadata"
import PokemonFactory, {
  getColorVariantForPlayer,
  getPokemonBaseline,
  PkmColorVariantsByPkm
} from "../../models/pokemon-factory"
import { PVEStages } from "../../models/pve-stages"
import { getBuyPrice, getSellPrice } from "../../models/shop"
import {
  Emotion,
  IClient,
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  Role,
  Title,
  Transfer
} from "../../types"
import { DungeonPMDO } from "../../types/enum/Dungeon"
import { EffectEnum } from "../../types/enum/Effect"
import {
  BattleResult,
  GamePhaseState,
  PokemonActionState,
  Team
} from "../../types/enum/Game"
import {
  ConsumableItems,
  CraftableItems,
  CraftableNonSynergyItems,
  Dishes,
  Item,
  ItemComponents,
  ItemRecipe,
  Mulches,
  ShinyItems,
  SynergyGems,
  SynergyGivenByGem,
  SynergyGivenByItem,
  SynergyStones,
  Tools,
  UnholdableItems
} from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import {
  Pkm,
  PkmIndex,
  PkmRegionalVariants,
  Unowns
} from "../../types/enum/Pokemon"
import { SpecialGameRule } from "../../types/enum/SpecialGameRule"
import { Synergy } from "../../types/enum/Synergy"
import { WandererBehavior, WandererType } from "../../types/enum/Wanderer"
import { isIn, removeInArray } from "../../utils/array"
import { getAvatarString } from "../../utils/avatar"
import {
  getFirstAvailablePositionInBench,
  getFirstAvailablePositionOnBoard,
  getFreeSpaceOnBench,
  getMaxTeamSize,
  isOnBench,
  isPositionEmpty
} from "../../utils/board"
import { repeat } from "../../utils/function"
import { logger } from "../../utils/logger"
import { max } from "../../utils/number"
import { chance, pickNRandomIn, pickRandomIn } from "../../utils/random"
import { resetArraySchema, values } from "../../utils/schemas"
import { getWeather } from "../../utils/weather"
import GameRoom from "../game-room"

export class OnBuyPokemonCommand extends Command<
  GameRoom,
  {
    playerId: string
    index: number
  }
> {
  execute({ playerId, index }) {
    if (
      playerId === undefined ||
      index === undefined ||
      !this.state.players.has(playerId)
    )
      return
    const player = this.state.players.get(playerId)
    const name = player?.shop[index]
    if (!player || !player.alive || !name || name === Pkm.DEFAULT) return

    const pokemon = PokemonFactory.createPokemonFromName(name, player)
    const isEvolution =
      pokemon.evolutionRule &&
      pokemon.evolutionRule instanceof CountEvolutionRule &&
      pokemon.evolutionRule.canEvolveIfGettingOne(pokemon, player)

    let cost = getBuyPrice(name, this.state.specialGameRule)
    const freeSpaceOnBench = getFreeSpaceOnBench(player.board)
    const hasSpaceOnBench = freeSpaceOnBench > 0 || isEvolution

    if (
      isEvolution &&
      this.state.specialGameRule === SpecialGameRule.BUYER_FEVER
    ) {
      cost = 0
    }

    const canBuy = player.money >= cost && hasSpaceOnBench
    if (!canBuy) return

    player.money -= cost

    const x = getFirstAvailablePositionInBench(player.board)
    pokemon.positionX = x !== null ? x : -1
    pokemon.positionY = 0
    player.board.set(pokemon.id, pokemon)
    if (pokemon.types.has(Synergy.WILD)) player.updateWildChance()
    pokemon.onAcquired(player)

    if (
      pokemon.passive === Passive.UNOWN &&
      (player.effects.has(EffectEnum.EERIE_SPELL) ||
        player.shopsSinceLastUnownShop === 0) &&
      player.shopFreeRolls > 0 &&
      player.shop.every((p) => Unowns.includes(p) || p === Pkm.DEFAULT)
    ) {
      // reset shop after picking in a unown shop
      this.state.shop.assignShop(player, true, this.state)
      player.shopFreeRolls -= 1
    } else {
      player.shop[index] = Pkm.DEFAULT
    }

    this.room.checkEvolutionsAfterPokemonAcquired(playerId)
  }
}

export class OnRemoveFromShopCommand extends Command<
  GameRoom,
  {
    playerId: string
    index: number
  }
> {
  execute({ playerId, index }) {
    if (
      playerId === undefined ||
      index === undefined ||
      !this.state.players.has(playerId)
    )
      return
    const player = this.state.players.get(playerId)
    const name = player?.shop[index]
    if (!player || !player.alive || !name || name === Pkm.DEFAULT) return

    const cost = getBuyPrice(name, this.state.specialGameRule)
    if (player.money >= cost) {
      player.shop[index] = Pkm.DEFAULT
      player.shopLocked = true
      this.state.shop.releasePokemon(name, player, this.state)
    }
  }
}

export class OnPokemonCatchCommand extends Command<
  GameRoom,
  {
    client: Client
    playerId: string
    id: string
  }
> {
  async execute({ client, playerId, id }) {
    if (playerId === undefined || !this.state.players.has(playerId)) return
    const player = this.state.players.get(playerId)
    const wanderer = player?.wanderers.get(id)

    if (!player || !player.alive || !wanderer) return
    player.wanderers.delete(id)

    if (wanderer.type === WandererType.UNOWN) {
      const unownIndex = PkmIndex[wanderer.pkm]
      if (client.auth) {
        const DUST_PER_ENCOUNTER = 50
        const u = await UserMetadata.findOne({ uid: client.auth.uid })
        if (u) {
          const c = u.pokemonCollection.get(unownIndex)
          if (c) {
            c.dust += DUST_PER_ENCOUNTER
          } else {
            u.pokemonCollection.set(unownIndex, {
              id: unownIndex,
              unlocked: Buffer.alloc(5, 0),
              dust: DUST_PER_ENCOUNTER,
              selectedEmotion: Emotion.NORMAL,
              selectedShiny: false,
              played: 0
            })
          }
          u.save()
        }
      }
    } else if (wanderer.type === WandererType.CATCHABLE) {
      const pokemon = PokemonFactory.createPokemonFromName(wanderer.pkm, player)
      const freeSpaceOnBench = getFreeSpaceOnBench(player.board)
      const hasSpaceOnBench =
        freeSpaceOnBench > 0 ||
        (pokemon.evolutionRule &&
          pokemon.evolutionRule instanceof CountEvolutionRule &&
          pokemon.evolutionRule.canEvolveIfGettingOne(pokemon, player))

      if (hasSpaceOnBench) {
        const x = getFirstAvailablePositionInBench(player.board)
        pokemon.positionX = x !== null ? x : -1
        pokemon.positionY = 0
        player.board.set(pokemon.id, pokemon)
        pokemon.onAcquired(player)
        this.room.checkEvolutionsAfterPokemonAcquired(playerId)
      }
    } else if (wanderer.type === WandererType.SPECIAL) {
      if (wanderer.pkm === Pkm.CHATOT) {
        player.addMoney(30, true, null)
        this.room.broadcast(Transfer.PLAYER_INCOME, 30)
      }
    }
  }
}

export class OnDragDropPokemonCommand extends Command<
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

    if (player && player.alive) {
      message.updateItems = false
      const pokemon = player.board.get(detail.id)
      const { x, y } = detail

      if (
        pokemon &&
        x != null &&
        x >= 0 &&
        x < BOARD_WIDTH &&
        y != null &&
        y >= 0 &&
        y < BOARD_SIDE_HEIGHT
      ) {
        const dropOnBench = y == 0
        const dropFromBench = isOnBench(pokemon)

        if (
          pokemon.name === Pkm.DITTO &&
          dropFromBench &&
          !isPositionEmpty(x, y, player.board) &&
          !(this.state.phase === GamePhaseState.FIGHT && y > 0)
        ) {
          const pokemonToClone = player.getPokemonAt(x, y)
          if (pokemonToClone && pokemonToClone.canBeCloned) {
            dittoReplaced = true
            let pkm = getPokemonBaseline(pokemonToClone.name)
            if (pkm in PkmColorVariantsByPkm) {
              pkm = getColorVariantForPlayer(pkm, player)
            }
            const replaceDitto = PokemonFactory.createPokemonFromName(
              pkm,
              player
            )
            pokemon.items.forEach((item) => {
              player.items.push(item)
            })
            player.board.delete(detail.id)
            const position = getFirstAvailablePositionInBench(player.board)
            if (position !== null) {
              replaceDitto.positionX = position
              replaceDitto.positionY = 0
              player.board.set(replaceDitto.id, replaceDitto)
              success = true
              message.updateBoard = false
            }
          } else if (dropOnBench) {
            this.swapPokemonPositions(player, pokemon, x, y)
            success = true
          }
        } else if (
          pokemon.name === Pkm.MELTAN &&
          player.getPokemonAt(x, y)?.name === Pkm.MELMETAL
        ) {
          // Meltan can merge with Melmetal
          const melmetal = player.getPokemonAt(x, y)!
          melmetal.addMaxHP(50, player)
          pokemon.items.forEach((item) => {
            player.items.push(item)
          })
          player.board.delete(pokemon.id)
          success = true
        } else if (dropOnBench && dropFromBench) {
          // Drag and drop pokemons through bench has no limitation
          this.swapPokemonPositions(player, pokemon, x, y)
          success = true
        } else if (this.state.phase == GamePhaseState.PICK) {
          // On pick, allow to drop on / from board
          const teamSize = this.room.getTeamSize(player.board)
          const isBoardFull =
            teamSize >=
            getMaxTeamSize(
              player.experienceManager.level,
              this.room.state.specialGameRule
            )
          const dropToEmptyPlace = isPositionEmpty(x, y, player.board)
          const target = player.getPokemonAt(x, y)

          if (dropOnBench) {
            if (
              pokemon.canBeBenched &&
              (!target || target.canBePlaced) &&
              !(isBoardFull && pokemon?.doesCountForTeamSize === false)
            ) {
              // From board to bench (bench to bench is already handled)
              this.swapPokemonPositions(player, pokemon, x, y)
              success = true
            }
          } else if (
            pokemon.canBePlaced &&
            (!target || target.canBeBenched) &&
            !(
              dropFromBench &&
              dropToEmptyPlace &&
              isBoardFull &&
              pokemon.doesCountForTeamSize
            ) &&
            !(
              dropFromBench &&
              isBoardFull &&
              target?.doesCountForTeamSize === false
            )
          ) {
            // Prevents a pokemon to go on the board only if it's adding a pokemon from the bench on a full board
            this.swapPokemonPositions(player, pokemon, x, y)
            success = true
          }
        }
      }

      if (!success && client.send) {
        client.send(Transfer.DRAG_DROP_CANCEL, message)
      }
      if (dittoReplaced) {
        this.room.checkEvolutionsAfterPokemonAcquired(playerId)
      }

      if (success) {
        player.updateSynergies()
        player.boardSize = this.room.getTeamSize(player.board)
      }
    }
    if (commands.length > 0) {
      return commands
    }
  }

  swapPokemonPositions(player: Player, pokemon: Pokemon, x: number, y: number) {
    const pokemonToSwap = player.getPokemonAt(x, y)
    if (pokemonToSwap) {
      pokemonToSwap.positionX = pokemon.positionX
      pokemonToSwap.positionY = pokemon.positionY
      pokemonToSwap.onChangePosition(
        pokemon.positionX,
        pokemon.positionY,
        player,
        this.state
      )
    }
    pokemon.positionX = x
    pokemon.positionY = y
    pokemon.onChangePosition(x, y, player, this.state)
  }
}

export class OnSwitchBenchAndBoardCommand extends Command<
  GameRoom,
  {
    client: Client
    pokemonId: string
  }
> {
  execute({ client, pokemonId }) {
    const playerId = client.auth.uid
    const player = this.room.state.players.get(playerId)
    if (!player || !player.alive) return

    const pokemon = player.board.get(pokemonId)
    if (!pokemon) return

    if (this.state.phase !== GamePhaseState.PICK) return // can't switch pokemons if not in pick phase

    if (pokemon.positionY === 0) {
      // pokemon is on bench, switch to board
      const teamSize = this.room.getTeamSize(player.board)
      const isBoardFull =
        teamSize >=
        getMaxTeamSize(
          player.experienceManager.level,
          this.room.state.specialGameRule
        )
      const destination = getFirstAvailablePositionOnBoard(
        player.board,
        pokemon.range
      )
      if (
        pokemon.canBePlaced &&
        destination &&
        !(isBoardFull && pokemon.doesCountForTeamSize)
      ) {
        const [x, y] = destination
        pokemon.positionX = x
        pokemon.positionY = y
        pokemon.onChangePosition(x, y, player, this.state)
      }
    } else {
      // pokemon is on board, switch to bench
      const x = getFirstAvailablePositionInBench(player.board)
      if (x !== null) {
        pokemon.positionX = x
        pokemon.positionY = 0
        pokemon.onChangePosition(x, 0, player, this.state)
      }
    }

    player.updateSynergies()
    player.boardSize = this.room.getTeamSize(player.board)
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

    if (!player || !player.alive) return

    message.updateBoard = false
    message.updateItems = true

    const itemA = detail.itemA
    const itemB = detail.itemB

    //verify player has both items
    if (!player.items.includes(itemA) || !player.items.includes(itemB)) {
      client.send(Transfer.DRAG_DROP_CANCEL, message)
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
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }
    }

    let result: Item | undefined = undefined

    if (itemA === Item.EXCHANGE_TICKET || itemB === Item.EXCHANGE_TICKET) {
      const exchangedItem = itemA === Item.EXCHANGE_TICKET ? itemB : itemA
      if (ItemComponents.includes(exchangedItem)) {
        result = pickRandomIn(ItemComponents.filter((i) => i !== exchangedItem))
      } else if (SynergyStones.includes(exchangedItem)) {
        result = pickRandomIn(SynergyStones.filter((i) => i !== exchangedItem))
      } else if (CraftableItems.includes(exchangedItem)) {
        result = pickRandomIn(
          CraftableNonSynergyItems.filter((i) => i !== exchangedItem)
        )
      } else {
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }
    } else if (itemA === Item.RECYCLE_TICKET || itemB === Item.RECYCLE_TICKET) {
      const recycledItem = itemA === Item.RECYCLE_TICKET ? itemB : itemA
      const recipe = ItemRecipe[recycledItem]
      if (!recipe) {
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }
      result = recipe[0]
      player.items.push(recipe[1])
    } else {
      // find recipe result
      const recipes = Object.entries(ItemRecipe) as [Item, Item[]][]
      for (const [key, value] of recipes) {
        if (
          (value[0] == itemA && value[1] == itemB) ||
          (value[0] == itemB && value[1] == itemA)
        ) {
          result = key
          break
        }
      }
    }

    if (!result) {
      client.send(Transfer.DRAG_DROP_CANCEL, message)
      return
    } else {
      player.items.push(result)
      removeInArray(player.items, itemA)
      removeInArray(player.items, itemB)
    }

    player.updateSynergies()
  }
}
export class OnDragDropItemCommand extends Command<
  GameRoom,
  {
    client: Client
    detail: IDragDropItemMessage
  }
> {
  execute({
    client,
    detail
  }: {
    client: Client
    detail: IDragDropItemMessage
  }) {
    const playerId = client.auth.uid
    const message = {
      updateBoard: true,
      updateItems: true
    }
    const player = this.state.players.get(playerId)
    if (!player || !player.alive) return

    message.updateBoard = false
    message.updateItems = true

    const { zone, index, id: item } = detail

    if (!player.items.includes(item)) {
      client.send(Transfer.DRAG_DROP_CANCEL, message)
      return
    }

    let pokemon: Pokemon | undefined
    if (zone === "flower-pot-zone") {
      const nbPots = getFlowerPotsUnlocked(player).length
      if (index >= nbPots) {
        // has not unlocked that flower pot yet
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }
      pokemon = player.flowerPots[index]
      if (!pokemon || isIn(Mulches, item) === false) {
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }
      if (item === Item.RICH_MULCH) {
        if (pokemon.evolution === Pkm.DEFAULT) {
          client.send(Transfer.DRAG_DROP_CANCEL, {
            ...message,
            text: "fully_grown",
            pokemonId: pokemon.id
          })
          return
        }
        const potEvolution = PokemonFactory.createPokemonFromName(
          pokemon.evolution,
          player
        )
        potEvolution.action = PokemonActionState.SLEEP
        player.flowerPots[index] = potEvolution
        removeInArray(player.items, item)
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }
    } else {
      const x = index % BOARD_WIDTH
      const y = Math.floor(index / BOARD_WIDTH)
      pokemon = player.getPokemonAt(x, y)
    }

    if (!pokemon) {
      client.send(Transfer.DRAG_DROP_CANCEL, message)
      return
    }

    const onItemDroppedEffects: OnItemDroppedEffect[] = [
      ...(ItemEffects[item]?.filter(
        (effect) => effect instanceof OnItemDroppedEffect
      ) ?? []),
      ...(PassiveEffects[pokemon.passive]?.filter(
        (effect) => effect instanceof OnItemDroppedEffect
      ) ?? [])
    ]
    for (const onItemDroppedEffect of onItemDroppedEffects) {
      const shouldEquipItem = onItemDroppedEffect.apply({
        pokemon,
        player,
        item,
        room: this.room
      })
      if (shouldEquipItem === false) {
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }
    }

    if (isIn(Dishes, item)) {
      if (pokemon.meal === "" && pokemon.canEat) {
        pokemon.meal = item
        pokemon.action = PokemonActionState.EAT
        removeInArray(player.items, item)
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        pokemon.items.add(item) // add the item just in time for the evolution
        const pokemonEvolved = this.room.checkEvolutionsAfterItemAcquired(
          playerId,
          pokemon
        )
        if (pokemonEvolved) pokemonEvolved.items.delete(item)
        else pokemon.items.delete(item)
        return
      } else {
        client.send(Transfer.DRAG_DROP_CANCEL, {
          ...message,
          text: pokemon.canEat ? "belly_full" : "not_hungry",
          pokemonId: pokemon.id
        })
        return
      }
    }

    if (
      pokemon.canHoldItems === false &&
      UnholdableItems.includes(item) === false
    ) {
      client.send(Transfer.DRAG_DROP_CANCEL, message)
      return
    }

    const isBasicItem = ItemComponents.includes(item)
    const existingBasicItemToCombine = values(pokemon.items).find((i) =>
      ItemComponents.includes(i)
    )

    // check if full items and nothing to combine
    if (
      pokemon.items.size >= 3 &&
      !(isBasicItem && existingBasicItemToCombine) &&
      UnholdableItems.includes(item) === false
    ) {
      client.send(Transfer.DRAG_DROP_CANCEL, {
        ...message,
        text: "full",
        pokemonId: pokemon.id
      })
      return
    }

    if (!isBasicItem && pokemon.items.has(item)) {
      // prevent adding twice the same item
      client.send(Transfer.DRAG_DROP_CANCEL, {
        ...message,
        text: "already_held",
        pokemonId: pokemon.id
      })
      return
    }

    if (isBasicItem && existingBasicItemToCombine) {
      const recipe = Object.entries(ItemRecipe).find(
        ([_result, recipe]) =>
          (recipe[0] === existingBasicItemToCombine && recipe[1] === item) ||
          (recipe[0] === item && recipe[1] === existingBasicItemToCombine)
      )

      if (!recipe) {
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }

      const itemCombined = recipe[0] as Item

      if (
        isIn(SynergyStones, itemCombined) &&
        pokemon.types.has(SynergyGivenByItem[itemCombined])
      ) {
        // prevent combining into a synergy stone on a pokemon that already has this synergy
        client.send(Transfer.DRAG_DROP_CANCEL, message)
        return
      }

      pokemon.items.delete(existingBasicItemToCombine)
      removeInArray(player.items, item)

      if (pokemon.items.has(itemCombined)) {
        // pokemon already has the combined item so the second one pops off and go to player inventory
        player.items.push(itemCombined)
      } else {
        pokemon.addItem(itemCombined, player)
      }
    } else {
      pokemon.addItem(item, player)
      removeInArray(player.items, item)
    }

    if (pokemon.items.has(Item.SHINY_CHARM)) {
      pokemon.shiny = true
    }

    this.room.checkEvolutionsAfterItemAcquired(playerId, pokemon)

    if (pokemon.items.has(item) && isIn(UnholdableItems, item)) {
      // if the item is not holdable, we immediately remove it from the pokemon items
      // It is added just in time for ItemEvolutionRule to be checked
      pokemon.items.delete(item)
      if (!isIn(ConsumableItems, item) && !isIn(Mulches, item)) {
        // item is not holdable and has not been consumed, so we add it back to player items
        player.items.push(item)
      }
    }

    player.updateSynergies()
  }
}

export class OnSellPokemonCommand extends Command<
  GameRoom,
  {
    client: Client
    pokemonId: string
  }
> {
  execute({ client, pokemonId }) {
    const player = this.state.players.get(client.auth.uid)

    if (!player || !player.alive) return

    const pokemon = player.board.get(pokemonId)
    if (!pokemon) return
    if (!isOnBench(pokemon) && this.state.phase === GamePhaseState.FIGHT) {
      return // can't sell a pokemon currently fighting
    }

    if (canSell(pokemon.name, this.state.specialGameRule) === false) {
      return
    }

    player.board.delete(pokemonId)
    this.state.shop.releasePokemon(pokemon.name, player, this.state)

    const sellPrice = getSellPrice(pokemon, this.state.specialGameRule)
    player.addMoney(sellPrice, false, null)
    pokemon.items.forEach((it) => {
      player.items.push(it)
    })

    player.updateSynergies()
    player.boardSize = this.room.getTeamSize(player.board)
    pokemon.afterSell(player)
  }
}

export class OnShopRerollCommand extends Command<GameRoom, string> {
  execute(id) {
    const player = this.state.players.get(id)
    if (!player || !player.alive) return
    const rollCost = player.shopFreeRolls > 0 ? 0 : 1
    const canRoll = (player?.money ?? 0) >= rollCost

    if (canRoll) {
      player.rerollCount++
      player.money -= rollCost
      if (player.shopFreeRolls > 0) {
        player.shopFreeRolls--
      } else {
        const repeatBallHolders = values(player.board).filter((p) =>
          p.items.has(Item.REPEAT_BALL)
        )
        if (repeatBallHolders.length > 0)
          player.shopFreeRolls += repeatBallHolders.length
      }
      this.state.shop.assignShop(player, true, this.state)
    }
  }
}

export class OnLockCommand extends Command<GameRoom, string> {
  execute(id) {
    const player = this.state.players.get(id)
    if (!player || !player.alive) return
    player.shopLocked = !player.shopLocked
  }
}

export class OnSpectateCommand extends Command<
  GameRoom,
  {
    id: string
    spectatedPlayerId: string
  }
> {
  execute({ id, spectatedPlayerId }) {
    const player = this.state.players.get(id)
    if (!player) return
    player.spectatedPlayerId = spectatedPlayerId
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
    if (!player || !player.alive) return

    const cost = getLevelUpCost(this.state.specialGameRule)
    if (player.money >= cost && player.experienceManager.canLevelUp()) {
      player.addExperience(4)
      player.money -= cost
    }
  }
}

export class OnPickBerryCommand extends Command<
  GameRoom,
  {
    playerId: string
    berryIndex: number
  }
> {
  execute({ playerId, berryIndex }) {
    const player = this.state.players.get(playerId)
    if (!player || !player.alive) return
    if (player.berryTreesStages[berryIndex] >= 3) {
      player.berryTreesStages[berryIndex] = 0
      player.items.push(player.berryTreesType[berryIndex])
    }
  }
}

export class OnJoinCommand extends Command<GameRoom, { client: Client }> {
  async execute({ client }) {
    try {
      //logger.debug("onJoin", client.auth.uid)
      const players = values(this.state.players)
      if (players.some((p) => p.id === client.auth.uid)) {
        /*logger.info(
          `${client.auth.displayName} (${client.id}) joined game room ${this.room.roomId}`
        )*/
        if (this.state.players.size >= MAX_PLAYERS_PER_GAME) {
          const humanPlayers = players.filter((p) => !p.isBot)
          if (humanPlayers.length === 1) {
            humanPlayers[0].titles.add(Title.LONE_WOLF)
          }
        }
      } else {
        this.state.spectators.add(client.auth.uid)
      }
    } catch (error) {
      logger.error(error)
    }
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
      this.state.time -= deltaTime
      if (Math.round(this.state.time / 1000) != this.state.roundTime) {
        this.state.roundTime = Math.round(this.state.time / 1000)
      }
      if (this.state.time < 0) {
        this.state.updatePhaseNeeded = true
      } else if (this.state.phase == GamePhaseState.FIGHT) {
        let everySimulationFinished = true

        this.state.simulations.forEach((simulation) => {
          if (!simulation.finished) {
            if (simulation.started) simulation.update(deltaTime)
            everySimulationFinished = false
          }
        })

        if (everySimulationFinished && !this.state.updatePhaseNeeded) {
          // wait for 3 seconds victory anim before moving to next stage
          this.state.time = 3000
          this.state.updatePhaseNeeded = true
        }
      } else if (this.state.phase === GamePhaseState.TOWN) {
        this.room.miniGame.update(deltaTime)
      }
      if (this.state.updatePhaseNeeded && this.state.time < 0) {
        return [new OnUpdatePhaseCommand()]
      }
    }
  }
}

export class OnUpdatePhaseCommand extends Command<GameRoom> {
  execute() {
    this.state.updatePhaseNeeded = false
    if (this.state.phase == GamePhaseState.TOWN) {
      this.stopTownPhase()
      /* Normally Stage level is bumped after a fighting phase, but since magikarp is round 1, we need to increase stage level from 0 -> 1 to avoid a PVP round 1. There is probably a better solution*/
      if (this.state.stageLevel === 0) {
        this.state.stageLevel = 1
      }
      this.initializePickingPhase()
    } else if (this.state.phase == GamePhaseState.PICK) {
      this.stopPickingPhase()
      this.checkForLazyTeam()
      this.initializeFightingPhase()
    } else if (this.state.phase == GamePhaseState.FIGHT) {
      this.stopFightingPhase()
      if (
        (ItemCarouselStages.includes(this.state.stageLevel) ||
          PortalCarouselStages.includes(this.state.stageLevel)) &&
        !this.state.gameFinished
      ) {
        this.initializeTownPhase()
      } else {
        this.initializePickingPhase()
      }
    }
  }

  computeAchievements() {
    this.state.players.forEach((player) => {
      this.checkSuccess(player)
    })
  }

  checkSuccess(player: Player) {
    player.titles.add(Title.NOVICE)
    const effects = this.state.simulations
      .get(player.simulationId)
      ?.getEffects(player.id)
    if (effects) {
      effects.forEach((effect) => {
        switch (effect) {
          case EffectEnum.PURE_POWER:
            player.titles.add(Title.POKEFAN)
            break
          case EffectEnum.SPORE:
            player.titles.add(Title.POKEMON_RANGER)
            break
          case EffectEnum.DESOLATE_LAND:
            player.titles.add(Title.KINDLER)
            break
          case EffectEnum.PRIMORDIAL_SEA:
            player.titles.add(Title.FIREFIGHTER)
            break
          case EffectEnum.POWER_SURGE:
            player.titles.add(Title.ELECTRICIAN)
            break
          case EffectEnum.JUSTIFIED:
            player.titles.add(Title.BLACK_BELT)
            break
          case EffectEnum.EERIE_SPELL:
            player.titles.add(Title.TELEKINESIST)
            break
          case EffectEnum.BEAT_UP:
            player.titles.add(Title.DELINQUENT)
            break
          case EffectEnum.MAX_MELTDOWN:
            player.titles.add(Title.ENGINEER)
            break
          case EffectEnum.DEEP_MINER:
            player.titles.add(Title.GEOLOGIST)
            break
          case EffectEnum.TOXIC:
            player.titles.add(Title.TEAM_ROCKET_GRUNT)
            break
          case EffectEnum.DRAGON_DANCE:
            player.titles.add(Title.DRAGON_TAMER)
            break
          case EffectEnum.ANGER_POINT:
            player.titles.add(Title.CAMPER)
            break
          case EffectEnum.MERCILESS:
            player.titles.add(Title.MYTH_TRAINER)
            break
          case EffectEnum.CALM_MIND:
            player.titles.add(Title.RIVAL)
            break
          case EffectEnum.SURGE_SURFER:
            player.titles.add(Title.SURFER)
            break
          case EffectEnum.HEART_OF_THE_SWARM:
            player.titles.add(Title.BUG_MANIAC)
            break
          case EffectEnum.SKYDIVE:
            player.titles.add(Title.BIRD_KEEPER)
            break
          case EffectEnum.FLOWER_POWER:
            player.titles.add(Title.GARDENER)
            break
          case EffectEnum.GOOGLE_SPECS:
            player.titles.add(Title.ALCHEMIST)
            break
          case EffectEnum.BERSERK:
            player.titles.add(Title.BERSERKER)
            break
          case EffectEnum.ETHEREAL:
            player.titles.add(Title.BLOB)
            break
          case EffectEnum.BANQUET:
            player.titles.add(Title.CHEF)
            break
          case EffectEnum.DIAMOND_STORM:
            player.titles.add(Title.HIKER)
            break
          case EffectEnum.CURSE_OF_FATE:
            player.titles.add(Title.HEX_MANIAC)
            break
          case EffectEnum.MOON_FORCE:
            player.titles.add(Title.CUTE_MANIAC)
            break
          case EffectEnum.SHEER_COLD:
            player.titles.add(Title.SKIER)
            break
          case EffectEnum.FORGOTTEN_POWER:
            player.titles.add(Title.MUSEUM_DIRECTOR)
            break
          case EffectEnum.PRESTO:
            player.titles.add(Title.MUSICIAN)
            break
          case EffectEnum.GOLDEN_EGGS:
            player.titles.add(Title.BABYSITTER)
            break
          case EffectEnum.MAX_ILLUMINATION:
            player.titles.add(Title.CHOSEN_ONE)
            break
          default:
            break
        }
      })
      if (effects.size >= 5) {
        player.titles.add(Title.HARLEQUIN)
      }
      if (effects.size >= 10) {
        player.titles.add(Title.TACTICIAN)
      }
      if (effects.size >= 15) {
        player.titles.add(Title.STRATEGIST)
      }
      let shield = 0
      let heal = 0
      const dpsMeter = this.state.simulations
        .get(player.simulationId)
        ?.getDpsMeter(player.id)

      if (dpsMeter) {
        dpsMeter.forEach((v) => {
          shield += v.shield
          heal += v.heal
        })
      }

      if (shield > 1000) {
        player.titles.add(Title.GARDIAN)
      }
      if (heal > 1000) {
        player.titles.add(Title.NURSE)
      }

      if (this.state.stageLevel >= 40) {
        player.titles.add(Title.ETERNAL)
      }
    }
  }

  checkEndGame(): boolean {
    const playersAlive = values(this.state.players).filter((p) => p.alive)

    if (playersAlive.length <= 1) {
      this.state.gameFinished = true
      const winner = playersAlive[0]
      if (winner) {
        /* there is a case where none of the players is alive because
         all the remaining players are dead due to a draw battle.
         In that case, they all already received their rank with checkDeath function */
        const client = this.room.clients.find(
          (cli) => cli.auth.uid === winner.id
        )
        if (client) {
          client.send(Transfer.FINAL_RANK, 1)
        }
      }
      this.clock.setTimeout(() => {
        // dispose the room automatically after 30 seconds
        this.room.broadcast(Transfer.GAME_END)
        this.room.disconnect()
      }, 30 * 1000)

      return true
    }

    return false
  }

  computeStreak(isPVE: boolean) {
    if (isPVE) return // PVE rounds do not change the current streak
    this.state.players.forEach((player) => {
      if (!player.alive) {
        return
      }

      const [previousBattleResult, lastBattleResult] = player.history
        .filter(
          (stage) => stage.id !== "pve" && stage.result !== BattleResult.DRAW
        )
        .map((stage) => stage.result)
        .slice(-2)

      if (lastBattleResult === BattleResult.DRAW) {
        // preserve existing streak but lose HP
      } else if (lastBattleResult !== previousBattleResult) {
        // reset streak
        player.streak = 0
      } else {
        player.streak += 1
      }
    })
  }

  computeIncome(isPVE: boolean, specialGameRule: SpecialGameRule | null) {
    this.state.players.forEach((player) => {
      let income = 0
      if (player.alive && !player.isBot) {
        const nbGimmighoulCoins = player.items.filter(
          (item) => item === Item.GIMMIGHOUL_COIN
        ).length
        const nbAmuletCoins =
          player.items.filter((item) => item === Item.AMULET_COIN).length +
          values(player.board).filter((pokemon) =>
            pokemon.items.has(Item.AMULET_COIN)
          ).length
        player.maxInterest = 5 + nbGimmighoulCoins - nbAmuletCoins
        if (specialGameRule !== SpecialGameRule.BLOOD_MONEY) {
          player.interest = max(player.maxInterest)(
            Math.floor(player.money / 10)
          )
          income += player.interest
        }
        if (!isPVE) {
          income += max(5)(player.streak)
        }
        income += 5
        player.addMoney(income, true, null)
        if (income > 0) {
          const client = this.room.clients.find(
            (cli) => cli.auth.uid === player.id
          )
          client?.send(Transfer.PLAYER_INCOME, income)
        }
        player.addExperience(2)
      }
    })
  }

  checkDeath() {
    this.state.players.forEach((player: Player) => {
      if (player.life <= 0 && player.alive) {
        if (!player.isBot) {
          player.shop.forEach((pkm) => {
            this.state.shop.releasePokemon(pkm, player, this.state)
          })
          player.board.forEach((pokemon) => {
            this.state.shop.releasePokemon(pokemon.name, player, this.state)
          })
        }
        player.alive = false
        const client = this.room.clients.find(
          (cli) => cli.auth.uid === player.id
        )
        if (client) {
          client.send(Transfer.FINAL_RANK, player.rank)
        }
      }
    })
  }

  initializePickingPhase() {
    this.state.phase = GamePhaseState.PICK
    this.state.time =
      (StageDuration[this.state.stageLevel] ?? StageDuration.DEFAULT) * 1000

    // Item propositions stages
    if (ItemProposalStages.includes(this.state.stageLevel)) {
      this.state.players.forEach((player: Player) => {
        resetArraySchema(
          player.itemsProposition,
          pickNRandomIn(ItemComponents, 3)
        )
      })
    }

    if (
      [3, 15].includes(this.state.stageLevel) &&
      this.state.specialGameRule === SpecialGameRule.TECHNOLOGIC
    ) {
      this.state.players.forEach((player: Player) => {
        const itemsSet = Tools.filter(
          (item) => player.artificialItems.includes(item) === false
        )
        resetArraySchema(player.itemsProposition, pickNRandomIn(itemsSet, 3))
      })
    }

    // Additional pick stages
    if (AdditionalPicksStages.includes(this.state.stageLevel)) {
      const pool =
        this.state.stageLevel === AdditionalPicksStages[0]
          ? this.room.additionalUncommonPool
          : this.state.stageLevel === AdditionalPicksStages[1]
            ? this.room.additionalRarePool
            : this.room.additionalEpicPool
      let remainingAddPicks = 8
      this.state.players.forEach((player: Player) => {
        if (!player.isBot) {
          const items = pickNRandomIn(ItemComponents, 3)
          for (let i = 0; i < 3; i++) {
            const p = pool.pop()
            if (p) {
              // If the Pokemon has a regional variant in the player's region, show that instead of the base form.
              // Base form will still be added to the pool for all players
              const regionalVariants = (PkmRegionalVariants[p] ?? []).filter(
                (pkm) =>
                  new PokemonClasses[pkm](pkm).isInRegion(
                    player.map === "town" ? DungeonPMDO.AmpPlains : player.map
                  )
              )
              if (regionalVariants.length > 0) {
                player.pokemonsProposition.push(pickRandomIn(regionalVariants))
              } else {
                player.pokemonsProposition.push(p)
              }
              player.itemsProposition.push(items[i])
            }
          }
          remainingAddPicks--
        }
      })

      repeat(remainingAddPicks)(() => {
        const p = pool.pop()
        if (p) {
          this.state.shop.addAdditionalPokemon(p, this.state)
        }
      })

      // update regional pokemons in case some regional variants of add picks are now available
      this.state.players.forEach((p) => p.updateRegionalPool(this.state, false))
    }

    const commands = new Array<Command>()

    this.state.players.forEach((p) => this.updatePlayerBetweenStages(p))

    this.spawnWanderingPokemons()

    // PvE stage initialization
    const pveStage = PVEStages[this.state.stageLevel]
    if (pveStage) {
      this.state.shinyEncounter =
        this.state.townEncounter === TownEncounters.CELEBI ||
        (this.state.specialGameRule === SpecialGameRule.SHINY_HUNTER &&
          pveStage.shinyChance !== undefined) ||
        chance(pveStage.shinyChance ?? 0)
    }

    return commands
  }

  updatePlayerBetweenStages(player: Player) {
    const board = values(player.board)

    if (
      player.synergies.getSynergyStep(Synergy.FIRE) === 4 &&
      player.items.includes(Item.FIRE_SHARD) === false &&
      player.life > 2
    ) {
      player.items.push(Item.FIRE_SHARD)
    }

    const nbTrees = player.synergies.getSynergyStep(Synergy.GRASS)
    for (let i = 0; i < nbTrees; i++) {
      player.berryTreesStages[i] = max(3)(player.berryTreesStages[i] + 1)
    }

    if (player.synergies.getSynergyStep(Synergy.GROUND) > 0) {
      player.board.forEach((pokemon, pokemonId) => {
        if (
          pokemon.types.has(Synergy.GROUND) &&
          !isOnBench(pokemon) &&
          pokemon.items.has(Item.CHEF_HAT) === false
        ) {
          const index =
            (pokemon.positionY - 1) * BOARD_WIDTH + pokemon.positionX
          const hasAlreadyReachedMaxDepth = player.groundHoles[index] === 5
          const isReachingMaxDepth = player.groundHoles[index] === 4
          if (!hasAlreadyReachedMaxDepth) {
            let buriedItem = isReachingMaxDepth
              ? player.buriedItems[index]
              : null
            this.room.broadcast(Transfer.DIG, {
              pokemonId,
              buriedItem
            })
            this.room.clock.setTimeout(() => {
              player.groundHoles[index] = max(5)(player.groundHoles[index] + 1)
              if (pokemon.passive === Passive.ORTHWORM) {
                pokemon.addMaxHP(5, player)
              }
              player.board.forEach((pokemon) => {
                // Condition based evolutions on ground hole dig
                if (
                  pokemon.evolutionRule instanceof ConditionBasedEvolutionRule
                ) {
                  pokemon.evolutionRule.tryEvolve(
                    pokemon,
                    player,
                    this.state.stageLevel
                  )
                }
              })
            }, 1000)

            if (
              pokemon.items.has(Item.EXPLORER_KIT) &&
              isReachingMaxDepth &&
              !buriedItem
            ) {
              if (chance(0.1, pokemon)) {
                buriedItem = Item.BIG_NUGGET
              } else if (chance(0.5, pokemon)) {
                buriedItem = Item.NUGGET
              } else {
                buriedItem = Item.COIN
              }
            }

            if (buriedItem) {
              this.room.clock.setTimeout(() => {
                if (buriedItem === Item.COIN) {
                  player.addMoney(1, true, null)
                } else if (buriedItem === Item.NUGGET) {
                  player.addMoney(3, true, null)
                } else if (buriedItem === Item.BIG_NUGGET) {
                  player.addMoney(10, true, null)
                } else if (buriedItem === Item.TREASURE_BOX) {
                  player.items.push(...pickNRandomIn(ItemComponents, 2))
                } else if (isIn(SynergyGems, buriedItem)) {
                  const type = SynergyGivenByGem[buriedItem]
                  player.bonusSynergies.set(
                    type,
                    (player.bonusSynergies.get(type) ?? 0) + 1
                  )
                  player.items.push(buriedItem)
                  player.updateSynergies()
                } else {
                  player.items.push(buriedItem)
                }
              }, 2500)
            }
          }
        }
      })
    }

    const rottingItems: Map<Item, Item> = new Map([
      // order matters to not convert several times in a row
      [Item.SIRUPY_APPLE, Item.LEFTOVERS],
      [Item.SWEET_APPLE, Item.SIRUPY_APPLE],
      [Item.TART_APPLE, Item.SWEET_APPLE]
    ])

    for (const rottingItem of rottingItems.keys()) {
      while (player.items.includes(rottingItem as Item)) {
        const index = player.items.indexOf(rottingItem)
        const newItem = rottingItems.get(rottingItem)
        if (index >= 0 && newItem) {
          // SEE https://github.com/colyseus/schema/issues/192
          player.items.splice(index, 1)
          player.items.push(newItem)
        }
      }
    }

    if (
      this.state.specialGameRule === SpecialGameRule.FIRST_PARTNER &&
      this.state.stageLevel > 1 &&
      this.state.stageLevel < 10 &&
      player.firstPartner
    ) {
      this.room.spawnOnBench(player, player.firstPartner, "spawn")
    }

    if (this.state.specialGameRule === SpecialGameRule.GO_BIG_OR_GO_HOME) {
      board.forEach((pokemon) => {
        pokemon.addMaxHP(5, player)
      })
    }

    if (
      player.pokemonsTrainingInDojo.some(
        (p) => p.returnStage === this.state.stageLevel
      )
    ) {
      const returningPokemons = player.pokemonsTrainingInDojo.filter(
        (p) => p.returnStage === this.state.stageLevel
      )
      returningPokemons.forEach((p) => {
        const substitute = values(player.board).find(
          (s) => s.name === Pkm.SUBSTITUTE && s.id === p.pokemon.id
        )
        if (!substitute) return
        p.pokemon.hp += [50, 100, 150][p.ticketLevel - 1] ?? 0
        p.pokemon.maxHP += [50, 100, 150][p.ticketLevel - 1] ?? 0
        p.pokemon.atk += [5, 10, 15][p.ticketLevel - 1] ?? 0
        p.pokemon.ap += [15, 30, 45][p.ticketLevel - 1] ?? 0
        p.pokemon.positionX = substitute.positionX
        p.pokemon.positionY = substitute.positionY
        player.board.delete(substitute.id)
        player.board.set(p.pokemon.id, p.pokemon)
        /* Set schemas needs to be reset to fix reactivity issues ; bug on Colyseus Schema ? */
        p.pokemon.types = new SetSchema<Synergy>(values(p.pokemon.types))
        p.pokemon.items = new SetSchema<Item>()
        p.pokemon.addItems(values(substitute.items), player)
        substitute.items.clear()
        this.room.checkEvolutionsAfterPokemonAcquired(player.id)
        player.pokemonsTrainingInDojo.splice(
          player.pokemonsTrainingInDojo.indexOf(p),
          1
        )
      })
    }

    board.forEach((pokemon) => {
      // Passives updating every stage
      const passiveEffects =
        PassiveEffects[pokemon.passive]?.filter(
          (p) => p instanceof OnStageStartEffect
        ) ?? []
      passiveEffects.forEach((effect) =>
        effect.apply({ pokemon, player, room: this.room })
      )

      // Held item effects on stage start
      const itemEffects =
        values(pokemon.items)
          .flatMap((item) => ItemEffects[item])
          ?.filter((p) => p instanceof OnStageStartEffect) ?? []
      itemEffects.forEach((effect) =>
        effect.apply({ pokemon, player, room: this.room })
      )

      // Condition based evolutions on stage start
      if (pokemon.evolutionRule instanceof ConditionBasedEvolutionRule) {
        pokemon.evolutionRule.tryEvolve(pokemon, player, this.state.stageLevel)
      }
    })

    // Unholdable item effects on stage start
    player.items.forEach((item) => {
      const itemEffects =
        ItemEffects[item]?.filter((p) => p instanceof OnStageStartEffect) ?? []
      itemEffects.forEach((effect) => effect.apply({ player, room: this.room }))
    })
  }

  checkForLazyTeam() {
    // force move on board some units if room available
    this.state.players.forEach((player, key) => {
      if (player.isBot) return

      const teamSize = this.room.getTeamSize(player.board)
      const maxTeamSize = getMaxTeamSize(
        player.experienceManager.level,
        this.state.specialGameRule
      )
      if (teamSize < maxTeamSize) {
        const numberOfPokemonsToMove = maxTeamSize - teamSize
        for (let i = 0; i < numberOfPokemonsToMove; i++) {
          const pokemon = values(player.board)
            .filter((p) => isOnBench(p) && p.canBePlaced)
            .sort((a, b) => a.positionX - b.positionX)[0]
          if (pokemon) {
            const coordinates = getFirstAvailablePositionOnBoard(
              player.board,
              pokemon.types.has(Synergy.DARK) && pokemon.range === 1
                ? 3
                : pokemon.range
            )

            if (coordinates) {
              pokemon.positionX = coordinates[0]
              pokemon.positionY = coordinates[1]
              pokemon.onChangePosition(
                coordinates[0],
                coordinates[1],
                player,
                this.state
              )
            }
          }
        }
        if (numberOfPokemonsToMove > 0) {
          player.updateSynergies()
          player.boardSize = this.room.getTeamSize(player.board)
        }
      }
    })
  }

  stopPickingPhase() {
    this.state.players.forEach((player) => {
      const pokemonsProposition = values(player.pokemonsProposition)

      if (pokemonsProposition.length > 0) {
        // auto pick if not chosen
        this.room.pickPokemonProposition(
          player.id,
          pickRandomIn(pokemonsProposition),
          true
        )
        player.pokemonsProposition.clear()
      }

      const itemsProposition = values(player.itemsProposition)
      if (player.itemsProposition.length > 0) {
        // auto pick if not chosen
        this.room.pickItemProposition(player.id, pickRandomIn(itemsProposition))
        player.itemsProposition.clear()
      }
    })
  }

  stopFightingPhase() {
    const isPVE = this.state.stageLevel in PVEStages

    this.state.simulations.forEach((simulation) => {
      if (!simulation.finished) {
        simulation.onFinish()
      }
      simulation.stop()
    })

    this.computeAchievements()
    this.computeStreak(isPVE)
    this.checkDeath()
    const isGameFinished = this.checkEndGame()

    if (!isGameFinished) {
      this.state.stageLevel += 1
      this.room.setMetadata({ stageLevel: this.state.stageLevel })
      this.computeIncome(isPVE, this.state.specialGameRule)
      this.state.players.forEach((player: Player) => {
        if (player.alive) {
          // Fake bots XP bar
          if (player.isBot) {
            player.experienceManager.level = max(9)(
              Math.round(this.state.stageLevel / 2)
            )
          }

          // Give PVE rewards to players
          if (isPVE && player.history.at(-1)?.result === BattleResult.WIN) {
            while (player.pveRewards.length > 0) {
              const reward = player.pveRewards.pop()!
              player.items.push(reward)
            }

            if (player.pveRewardsPropositions.length > 0) {
              resetArraySchema(
                player.itemsProposition,
                player.pveRewardsPropositions
              )
              player.pveRewardsPropositions.clear()
            }
          }

          this.spawnBabyEggs(player, isPVE)

          // Update automatic evolutions and remove Unowns
          player.board.forEach((pokemon, key) => {
            if (pokemon.evolutionRule) {
              if (pokemon.evolutionRule instanceof HatchEvolutionRule) {
                pokemon.evolutionRule.updateHatch(
                  pokemon,
                  player,
                  this.state.stageLevel
                )
              }
            }
            if (pokemon.passive === Passive.UNOWN && !isOnBench(pokemon)) {
              // remove after one fight
              player.board.delete(key)
            }
          })

          // Refreshes effects (Tapu Terrains, or if player lost Psychic 6 after Unown diseappeared)
          player.updateSynergies()

          // Refreshes shop
          if (!player.isBot) {
            if (!player.shopLocked) {
              if (player.shop.every((p) => Unowns.includes(p))) {
                // player stayed on unown shop and did nothing, so we remove its free roll
                player.shopFreeRolls -= 1
              }

              this.state.shop.assignShop(player, false, this.state)
            } else {
              this.state.shop.refillShop(player, this.state)
              player.shopLocked = false
            }
          }
        }
      })
      // Update Bots after unown deletion so unown in bot boards are not deleted
      this.state.botManager.updateBots()
    }
  }

  stopTownPhase() {
    this.room.miniGame.stop(this.room.state)
  }

  initializeTownPhase() {
    this.state.phase = GamePhaseState.TOWN
    const nbPlayersAlive = values(this.state.players).filter(
      (p) => p.alive
    ).length

    let minigamePhaseDuration = ITEM_CAROUSEL_BASE_DURATION
    if (PortalCarouselStages.includes(this.state.stageLevel)) {
      minigamePhaseDuration = PORTAL_CAROUSEL_BASE_DURATION
    } else if (this.state.stageLevel !== ItemCarouselStages[0]) {
      minigamePhaseDuration += nbPlayersAlive * 2000
    }
    this.state.time = minigamePhaseDuration
    this.room.miniGame.initialize(this.state, this.room)
  }

  initializeFightingPhase() {
    this.state.simulations.clear()
    this.state.phase = GamePhaseState.FIGHT
    this.state.time = FIGHTING_PHASE_DURATION
    this.state.roundTime = Math.round(this.state.time / 1000)
    updateLobby(this.room)
    this.state.players.forEach((player: Player) => {
      if (player.alive) {
        player.registerPlayedPokemons()
      }
    })

    const pveStage = PVEStages[this.state.stageLevel]
    if (pveStage) {
      this.state.players.forEach((player: Player) => {
        if (player.alive) {
          player.opponentId = "pve"
          player.opponentName = pveStage.name
          player.opponentAvatar = getAvatarString(
            PkmIndex[pveStage.avatar],
            this.state.shinyEncounter,
            pveStage.emotion
          )
          player.opponentTitle = "WILD"
          player.team = Team.BLUE_TEAM

          const rewards = pveStage.getRewards?.(player) ?? ([] as Item[])
          resetArraySchema(player.pveRewards, rewards)

          const rewardsPropositions =
            this.state.shinyEncounter && this.state.stageLevel > 1
              ? pickNRandomIn(ShinyItems, 3)
              : (pveStage.getRewardsPropositions?.(player) ?? ([] as Item[]))

          resetArraySchema(player.pveRewardsPropositions, rewardsPropositions)

          const pveBoard = PokemonFactory.makePveBoard(
            pveStage,
            this.state.shinyEncounter,
            this.state.townEncounter
          )
          const weather = getWeather(player, null, pveBoard)
          const simulation = new Simulation(
            nanoid(),
            this.room,
            player.board,
            pveBoard,
            player,
            undefined,
            this.state.stageLevel,
            weather
          )
          player.simulationId = simulation.id
          this.state.simulations.set(simulation.id, simulation)
          simulation.start()
        }
      })
    } else {
      const matchups = selectMatchups(this.state)
      this.state.simulationPaused = true // 2 seconds pause for portal transition animation

      matchups.forEach((matchup) => {
        const { bluePlayer, redPlayer, ghost } = matchup
        const weather = getWeather(
          bluePlayer,
          redPlayer,
          redPlayer.board,
          ghost
        )
        const simulationId = nanoid()

        bluePlayer.simulationId = simulationId
        bluePlayer.team = Team.BLUE_TEAM
        bluePlayer.opponents.set(
          redPlayer.id,
          (bluePlayer.opponents.get(redPlayer.id) ?? 0) + 1
        )
        bluePlayer.opponentId = redPlayer.id
        bluePlayer.opponentName = matchup.ghost
          ? `Ghost of ${redPlayer.name}`
          : redPlayer.name
        bluePlayer.opponentAvatar = redPlayer.avatar
        bluePlayer.opponentTitle = redPlayer.title ?? ""

        if (!matchup.ghost) {
          redPlayer.simulationId = simulationId
          redPlayer.team = Team.RED_TEAM
          redPlayer.opponents.set(
            bluePlayer.id,
            (redPlayer.opponents.get(bluePlayer.id) ?? 0) + 1
          )
          redPlayer.opponentId = bluePlayer.id
          redPlayer.opponentName = bluePlayer.name
          redPlayer.opponentAvatar = bluePlayer.avatar
          redPlayer.opponentTitle = bluePlayer.title ?? ""
        }

        const simulation = new Simulation(
          simulationId,
          this.room,
          bluePlayer.board,
          redPlayer.board,
          bluePlayer,
          redPlayer,
          this.state.stageLevel,
          weather,
          matchup.ghost
        )

        this.state.simulations.set(simulation.id, simulation)
        setTimeout(() => {
          this.state.simulationPaused = false
          simulation.start()
        }, 2500) // 2 seconds for portal transition animation, 500 ms for latency
      })
    }
  }

  spawnWanderingPokemons() {
    const isPVE = this.state.stageLevel in PVEStages

    this.state.players.forEach((player: Player) => {
      if (player.alive && !player.isBot) {
        const client = this.room.clients.find(
          (cli) => cli.auth.uid === player.id
        )
        if (!client) return

        const UNOWN_ENCOUNTER_CHANCE = 0.037
        if (chance(UNOWN_ENCOUNTER_CHANCE)) {
          const pkm = pickRandomIn(Unowns)
          const id = nanoid()
          const wanderer = new Wanderer({
            id,
            pkm,
            type: WandererType.UNOWN,
            behavior: WandererBehavior.RUN_THROUGH
          })

          this.clock.setTimeout(
            () => player.wanderers.set(id, wanderer),
            Math.round((5 + 15 * Math.random()) * 1000)
          )
        }

        if (
          isPVE &&
          this.state.specialGameRule === SpecialGameRule.GOTTA_CATCH_EM_ALL
        ) {
          const nbPokemonsToSpawn = Math.ceil(this.state.stageLevel / 2)
          for (let i = 0; i < nbPokemonsToSpawn; i++) {
            const id = nanoid()
            const pkm = this.state.shop.pickPokemon(
              player,
              this.state,
              -1,
              true
            )
            const wanderer = new Wanderer({
              id,
              pkm,
              type: WandererType.CATCHABLE,
              behavior: WandererBehavior.RUN_THROUGH
            })

            this.clock.setTimeout(
              () => player.wanderers.set(id, wanderer),
              4000 + i * 400
            )
          }
        }
      }
    })
  }

  spawnBabyEggs(player: Player, isPVE: boolean) {
    const hasBabyActive =
      player.effects.has(EffectEnum.HATCHER) ||
      player.effects.has(EffectEnum.BREEDER) ||
      player.effects.has(EffectEnum.GOLDEN_EGGS)
    const hasLostLastBattle =
      player.history.at(-1)?.result === BattleResult.DEFEAT
    const eggsOnBench = values(player.board).filter((p) => p.name === Pkm.EGG)
    const nbOfGoldenEggsOnBench = eggsOnBench.filter((p) => p.shiny).length
    let nbEggsFound = 0
    let goldenEggFound = false

    if (hasLostLastBattle && hasBabyActive) {
      const EGG_CHANCE = 0.1
      const GOLDEN_EGG_CHANCE = 0.05
      const playerEggChanceStacked = player.eggChance
      const playerGoldenEggChanceStacked = player.goldenEggChance
      const babies = values(player.board).filter(
        (p) => !isOnBench(p) && p.types.has(Synergy.BABY)
      )

      for (const baby of babies) {
        if (
          player.effects.has(EffectEnum.GOLDEN_EGGS) &&
          nbOfGoldenEggsOnBench === 0 &&
          chance(GOLDEN_EGG_CHANCE, baby)
        ) {
          nbEggsFound++
          goldenEggFound = true
        } else if (chance(EGG_CHANCE, baby)) {
          nbEggsFound++
        }
        if (player.effects.has(EffectEnum.GOLDEN_EGGS) && !goldenEggFound) {
          player.goldenEggChance += max(0.1)(
            Math.pow(GOLDEN_EGG_CHANCE, 1 - baby.luck / 200)
          )
        } else if (
          player.effects.has(EffectEnum.HATCHER) &&
          nbEggsFound === 0
        ) {
          player.eggChance += max(0.2)(
            Math.pow(EGG_CHANCE, 1 - baby.luck / 100)
          )
        }
      }

      // Second chance with chance stacked after lose streaks
      if (
        nbEggsFound === 0 &&
        (player.effects.has(EffectEnum.BREEDER) ||
          player.effects.has(EffectEnum.GOLDEN_EGGS) ||
          chance(playerEggChanceStacked))
      ) {
        nbEggsFound = 1 // baby >= 5 guarantees at least 1 egg after a defeat
      }
      if (
        goldenEggFound === false &&
        player.effects.has(EffectEnum.GOLDEN_EGGS) &&
        nbOfGoldenEggsOnBench === 0 &&
        chance(playerGoldenEggChanceStacked)
      ) {
        goldenEggFound = true
      }
    } else if (!isPVE) {
      // winning a PvP fight resets the stacked egg chance
      player.eggChance = 0
      player.goldenEggChance = 0
    }

    if (
      this.state.specialGameRule === SpecialGameRule.OMELETTE_COOK &&
      [2, 3, 4].includes(this.state.stageLevel)
    ) {
      nbEggsFound = 1
    }

    for (let i = 0; i < nbEggsFound; i++) {
      if (getFreeSpaceOnBench(player.board) === 0) continue
      const isGoldenEgg =
        goldenEggFound && i === 0 && nbOfGoldenEggsOnBench === 0
      giveRandomEgg(player, isGoldenEgg)
      if (player.effects.has(EffectEnum.HATCHER)) {
        player.eggChance = 0 // getting an egg resets the stacked egg chance
      }
      if (player.effects.has(EffectEnum.GOLDEN_EGGS) && isGoldenEgg) {
        player.goldenEggChance = 0 // getting a golden egg resets the stacked egg chance
      }
    }
  }
}

export class OnOverwriteBoardCommand extends Command<GameRoom> {
  execute({
    playerId,
    board
  }: {
    playerId: string
    board: IDetailledPokemon[]
  }) {
    const player = this.room.state.players.get(playerId)
    if (!player || player.role !== Role.ADMIN) return
    player.board.clear()
    board.forEach((p) => {
      const pokemon = PokemonFactory.createPokemonFromName(p.name, p)
      pokemon.positionX = p.x
      pokemon.positionY = p.y
      p.items.forEach((item) => pokemon.items.add(item))
      player.board.set(pokemon.id, pokemon)
    })
    player.updateSynergies()
    player.boardSize = this.room.getTeamSize(player.board)
  }
}
