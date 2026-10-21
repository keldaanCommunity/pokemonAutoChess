import { ArraySchema, Schema, SetSchema, type } from "@colyseus/schema"
import { NB_LEGENDARY_PROPOSITIONS, RegionDetails } from "../../config"
import { type AtlasNodeId, AtlasTree } from "../../config/game/atlas"
import { activateAtlasNode } from "../../core/atlas"
import { assignLegendaries } from "../../core/pools"
import type GameRoom from "../../rooms/game-room"
import type { IAtlasManager } from "../../types"
import type { PkmProposition } from "../../types/enum/Pokemon"
import type { Synergy } from "../../types/enum/Synergy"
import type Player from "./player"

export default class AtlasManager extends Schema implements IAtlasManager {
  @type("uint8") emera = 20 //TEMP 0
  @type({ set: "string" }) unlockedNodes = new SetSchema<AtlasNodeId>(["root"])
  @type(["string"]) legendaries = new ArraySchema<PkmProposition>()
  @type(["string"]) symbols = new ArraySchema<Synergy>()

  unlockNode(nodeId: AtlasNodeId, player: Player, room: GameRoom) {
    if (this.canUnlockNode(nodeId)) {
      this.emera--
      this.unlockedNodes.add(nodeId)
      activateAtlasNode(nodeId, player, room)
    }
  }

  canUnlockNode(nodeId: AtlasNodeId): boolean {
    return this.emera > 0 && this.isConnectedAndUnlockable(nodeId)
  }

  isConnectedAndUnlockable(nodeId: AtlasNodeId) {
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

  assignLegendaries(player: Player, portalSynergies: Synergy[]) {
    // ensure we have at least one symbol per proposition
    // complete with one from dominant synergy and region symbols
    const symbols = [
      ...portalSynergies,
      ...player.synergies.getTopSynergies(1),
      ...RegionDetails[player.map].synergies
    ].slice(0, NB_LEGENDARY_PROPOSITIONS)

    this.symbols = new ArraySchema(...symbols)

    const legendaries: PkmProposition[] = assignLegendaries(player, symbols)
    this.legendaries = new ArraySchema(...legendaries)
  }
}
