import { type AtlasNodeId, AtlasTree } from "../config/game/atlas"
import type Player from "../models/colyseus-models/player"
import type { Pokemon } from "../models/colyseus-models/pokemon"
import PokemonFactory from "../models/pokemon-factory"
import type GameRoom from "../rooms/game-room"
import { Item } from "../types"
import { PkmDuos } from "../types/enum/Pokemon"

export function activateAtlasNode(
  nodeId: AtlasNodeId,
  player: Player,
  room: GameRoom
) {
  const node = AtlasTree.nodes[nodeId]

  const effect = AtlasNodeEffects[nodeId]
  if (effect) {
    effect(player)
  }

  if (node.type === "item") {
    player.items.push(node.item)
  }

  if (node.type === "keystone" && node.emera === "legendary") {
    const index = Number(nodeId.at(-1)) - 1
    const pkm = player.atlasManager.legendaries[index]
    if (pkm) {
      const pokemonsObtained: Pokemon[] = (
        pkm in PkmDuos ? PkmDuos[pkm] : [pkm]
      ).map((p) => PokemonFactory.createPokemonFromName(p, player))
      const sellIfNoSpace = false //TODO: replace with player.pendingPokemonstoAdd
      room.givePokemons(pokemonsObtained, player, sellIfNoSpace)
    }
  }
}

type AtlasNodeEffect = (player: Player) => void
export const AtlasNodeEffects: { [nodeId in AtlasNodeId]?: AtlasNodeEffect } = {
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
