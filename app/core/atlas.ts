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
  Item,
  SynergyStones
} from "../types"
import { Rarity } from "../types/enum/Game"
import { pkmsFromProposition } from "../types/enum/Pokemon"
import { pickNRandomIn } from "../utils/random"
import { openTreasureChest } from "./effects/items"

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
      const sellIfNoSpace = false //TODO: replace with player.pendingPokemonstoAdd
      room.givePokemons(pokemonsObtained, player, sellIfNoSpace)
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

  duskull: (player) => {
    player.addMoney(
      Math.floor(player.gameStats.totalMoneyEarned / 10),
      true,
      null
    )
  },

  marowak() {
    // handled in makePveBoard function
  },

  lapras: (player) => {
    player.items.push(Item.LAPRAS_PASSPORT)
  },

  meowth: (player) => {
    player.addMoney(10, true, null)
  },

  croagunk: (player) => {
    player.items.push(
      Item.EXCHANGE_TICKET,
      Item.EXCHANGE_TICKET,
      Item.EXCHANGE_TICKET
    )
  }
}
