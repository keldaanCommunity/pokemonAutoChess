import { Schema, SetSchema, type } from "@colyseus/schema"
import { AtlasTree } from "../../config/game/atlas"
import type { IAtlasManager } from "../../types"

export default class AtlasManager extends Schema implements IAtlasManager {
  @type("uint8") emera = 0
  @type({ set: "string" }) unlockedNodes = new SetSchema<string>(["root"])

  unlockNode(nodeId: string) {
    if (this.canUnlockNode(nodeId)) {
      this.emera--
      this.unlockedNodes.add(nodeId)
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
