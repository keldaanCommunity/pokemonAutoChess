import { ArraySchema, Schema, SetSchema, type } from "@colyseus/schema"
import { type AtlasNodeId, AtlasTree } from "../../config/game/atlas"
import { activateAtlasNode } from "../../core/atlas"
import type GameRoom from "../../rooms/game-room"
import type { IAtlasManager } from "../../types"
import type { PkmProposition } from "../../types/enum/Pokemon"
import type Player from "./player"

export default class AtlasManager extends Schema implements IAtlasManager {
  @type("uint8") emera = 20 //TEMP 0
  @type({ set: "string" }) unlockedNodes = new SetSchema<string>(["root"])
  @type(["string"]) legendaries = new ArraySchema<PkmProposition>()

  unlockNode(nodeId: AtlasNodeId, player: Player, room: GameRoom) {
    if (this.canUnlockNode(nodeId)) {
      this.emera--
      this.unlockedNodes.add(nodeId)
      activateAtlasNode(nodeId, player, room)
    }
  }

  canUnlockNode(nodeId: string): boolean {
    return this.emera > 0 && this.isConnectedAndUnlockable(nodeId)
  }

  isConnectedAndUnlockable(nodeId: string) {
    // Logic to check if adjacent node is unlocked
    return (
      this.unlockedNodes.has(nodeId) === false &&
      AtlasTree.connections.some(
        (conn) =>
          (conn.from === nodeId && this.unlockedNodes.has(conn.to)) ||
          (conn.to === nodeId && this.unlockedNodes.has(conn.from))
      )
    )
  }
}
