import { SetSchema } from "@colyseus/schema"
import { type AtlasNodeId, AtlasTree } from "../config/game/atlas"
import { getTreasureBoxReward } from "../config/game/town-encounters"
import type Player from "../models/colyseus-models/player"
import { PlayerChoice } from "../models/colyseus-models/player-choice"
import type { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import type GameRoom from "../rooms/game-room"
import {
  CraftableItemsNoScarves,
  DubiousGadgets,
  FossilStones,
  Item,
  Scarves,
  SynergyGems,
  SynergyStones,
  Transfer
} from "../types"
import { EvolutionType } from "../types/EvolutionRules"
import { Rarity } from "../types/enum/Game"
import { Dishes } from "../types/enum/Item"
import { Pkm, pkmsFromProposition } from "../types/enum/Pokemon"
import { max } from "../utils/number"
import { entries } from "../utils/object"
import { pickNRandomIn, pickRandomIn } from "../utils/random"
import { schemaValues } from "../utils/schemas"
import { openTreasureChest } from "./effects/items"
import { EvolutionManager } from "./evolution-logic/evolution-manager"
import { canMegaEvolve } from "./evolution-logic/mega-evolution"

export function activateAtlasNode(
  nodeId: AtlasNodeId,
  player: Player,
  room: GameRoom
) {
  const node = AtlasTree.nodes[nodeId]

  const effect = AtlasNodeEffects[nodeId]
  if (effect) {
    effect(player, room)
  }

  if (node.type === "item") {
    player.items.push(node.item)
  }

  if (node.type === "legendary") {
    const index = Number(nodeId.at(-1)) - 1
    const pkm = player.atlasManager.legendaries[index]
    if (pkm) {
      const pokemonsObtained: Pokemon[] = pkmsFromProposition(pkm).map((p) =>
        PokemonFactory.createPokemonFromName(p, player)
      )
      room.givePokemons(pokemonsObtained, player)
    }
  }
}

export function testAtlasNodeCondition(
  condition: "mega" | "gigantamax",
  player: Player
): boolean {
  switch (condition) {
    case "mega":
    default: {
      return schemaValues(player.board).some(canMegaEvolve)
    }
  }
}

type AtlasNodeEffect = (player: Player, room: GameRoom) => void
export const AtlasNodeEffects: { [nodeId in AtlasNodeId]?: AtlasNodeEffect } = {
  kecleon: (player) => {
    player.choices.push(
      new PlayerChoice({
        type: "item",
        items: pickNRandomIn(SynergyStones, 3)
      })
    )
  },

  chansey: (player) => {
    player.board.forEach((pokemon) => {
      if (pokemon.rarity === Rarity.HATCH) {
        pokemon.addMaxHP(50)
        pokemon.addAttack(5)
        pokemon.addAbilityPower(30)
      }
    })
  },

  electivire: (player) => {
    player.choices.push(
      new PlayerChoice({
        type: "item",
        items: pickNRandomIn(DubiousGadgets, 3)
      })
    )
  },

  xatu: (player, room) => {
    openTreasureChest(player, room, getTreasureBoxReward())
  },

  kangaskhan: (player) => {
    player.choices.push(
      new PlayerChoice({
        type: "item",
        items: pickNRandomIn(CraftableItemsNoScarves, 3)
      })
    )
  },

  duskull: (player, room) => {
    const moneyGained = Math.floor(player.gameStats.totalMoneyEarned / 10)
    player.addMoney(moneyGained, true, null)
    const client = room.clients.find((cli) => cli.auth.uid === player.id)
    client?.send(Transfer.PLAYER_INCOME, moneyGained)
  },

  meowth: (player, room) => {
    const moneyGained = 10
    player.addMoney(moneyGained, true, null)
    const client = room.clients.find((cli) => cli.auth.uid === player.id)
    client?.send(Transfer.PLAYER_INCOME, moneyGained)
  },

  marowak() {
    // handled in makePveBoard function
  },

  wobbuffet: (player) => {
    player.items.push(Item.RECYCLE_TICKET, Item.RECYCLE_TICKET)
  },

  spinda: (player, room) => {
    const availableEncounterNodes = entries(AtlasTree.nodes)
      .filter(
        ([nodeId, node]) =>
          node.type === "encounter" &&
          player.atlasManager.unlockedNodes.has(nodeId) === false
      )
      .map(([nodeId]) => nodeId)
    if (availableEncounterNodes.length === 0) return
    const randomEncounter = pickRandomIn(availableEncounterNodes)
    player.atlasManager.unlockedNodes.add(randomEncounter)
    activateAtlasNode(randomEncounter, player, room)
  },

  regirock: (player) => {
    player.life = max(100)(player.life + 15)
  },

  munchlax: (player) => {
    player.items.push(...pickNRandomIn(Dishes, 5))
  },

  sableye: (player) => {
    player.choices.push(
      new PlayerChoice({
        type: "item",
        items: pickNRandomIn(SynergyGems, 6)
      })
    )
  },

  celebi: (player, room) => {
    player.life =
      player.lifeByStage[room.state.stageLevel - 1] ??
      player.lifeByStage[0] ??
      100
  },

  makuhita: (player) => {
    player.items.push(Item.GOLD_DOJO_TICKET)
  },

  croagunk: (player) => {
    player.items.push(
      Item.EXCHANGE_TICKET,
      Item.EXCHANGE_TICKET,
      Item.EXCHANGE_TICKET
    )
  },

  ampharos: () => {
    // handled in simulation applyPostEffects
  },

  cinccino: (player) => {
    player.choices.push(
      new PlayerChoice({
        type: "item",
        items: pickNRandomIn(Scarves, 3)
      })
    )
  },

  chimecho: (player) => {
    player.items.push(Item.SOOTHE_BELL)
  },

  kingambit: (player, room) => {
    const maxHP = Math.max(
      ...schemaValues(room.state.players).map((p) => p.life)
    )
    let moneyGained = 5
    if (player.life === maxHP) {
      moneyGained = 15
      player.items.push(Item.LEADERS_CREST)
    }

    player.addMoney(moneyGained, true, null)
    const client = room.clients.find((cli) => cli.auth.uid === player.id)
    client?.send(Transfer.PLAYER_INCOME, moneyGained)
  },

  lapras: (player) => {
    player.items.push(Item.LAPRAS_PASSPORT)
  },

  ludicolo: (player) => {
    // handled in updateEachSecond
  },

  magnezone: (player) => {
    // handled in simulation onFinish
  },

  grovyle: (player) => {
    // handled in stopFightingPhase
  },

  dusknoir: (player) => {
    player.atlasManager.unlockedNodes = new SetSchema<AtlasNodeId>([
      "root",
      "dusknoir"
    ])
  },

  azurill: (player) => {
    // handled in simulation applyPostEffects
  },

  bidoof: (player) => {
    // handled in simulation applyPostEffects
  },

  loudred: (player) => {
    // handled in simulation applyPostEffects
  },

  omanyte: (player, room) => {
    const ditto = PokemonFactory.createPokemonFromName(Pkm.DITTO, player)
    room.givePokemons([ditto], player)
    player.choices.push(
      new PlayerChoice({
        type: "item",
        items: pickNRandomIn(FossilStones, 3)
      })
    )
  },

  wigglytuff: (player, room) => {
    player.items.push(Item.MISSION_ORDER_BLACK)
    const playersAlive = schemaValues(room.state.players).filter((p) => p.alive)
    if (playersAlive.length <= 2) {
      player.completeMissionOrder(Item.MISSION_ORDER_BLACK)
    }
  },

  awakening: (player) => {
    player.experienceManager.maxLevel = 10
    const pokemonsOnBoard = schemaValues(player.board)
    pokemonsOnBoard.forEach((pokemon) => {
      if (
        player.board.has(pokemon.id) &&
        (pokemon.rarity === Rarity.COMMON ||
          pokemon.rarity === Rarity.UNCOMMON) &&
        pokemon.hasEvolution &&
        pokemon.evolutionRule.type === EvolutionType.COUNT
      ) {
        EvolutionManager.evolve(pokemon, player, {
          type: EvolutionType.ONE_TIME_EFFECT
        })
      }
    })
  }
}
