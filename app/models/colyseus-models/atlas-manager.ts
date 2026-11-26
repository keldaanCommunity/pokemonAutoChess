import { ArraySchema, Schema, SetSchema, type } from "@colyseus/schema"
import { NB_LEGENDARY_PROPOSITIONS, RegionDetails } from "../../config"
import { type AtlasNodeId, AtlasTree } from "../../config/game/atlas"
import { activateAtlasNode, testAtlasNodeCondition } from "../../core/atlas"
import { assignLegendaries } from "../../core/pools"
import type GameRoom from "../../rooms/game-room"
import type { IAtlasManager } from "../../types"
import type { PkmProposition } from "../../types/enum/Pokemon"
import type { Synergy } from "../../types/enum/Synergy"
import { resetArraySchema } from "../../utils/schemas"
import type Player from "./player"

export default class AtlasManager extends Schema implements IAtlasManager {
  @type("uint8") emera = 0
  @type({ set: "string" }) unlockedNodes = new SetSchema<AtlasNodeId>(["root"])
  @type(["string"]) legendaries = new ArraySchema<PkmProposition | "">(
    ...Array.from({ length: NB_LEGENDARY_PROPOSITIONS }, () => "" as const)
  )
  @type(["string"]) symbols = new ArraySchema<Synergy>()

  unlockNode(nodeId: AtlasNodeId, player: Player, room: GameRoom) {
    if (this.canUnlockNode(nodeId, player)) {
      this.emera--
      this.unlockedNodes.add(nodeId)
      activateAtlasNode(nodeId, player, room)
    }
  }

  canUnlockNode(nodeId: AtlasNodeId, player: Player): boolean {
    return this.emera > 0 && this.isConnectedAndUnlockable(nodeId, player)
  }

  isConnectedAndUnlockable(nodeId: AtlasNodeId, player: Player): boolean {
    // Logic to check if adjacent node is unlocked
    const node = AtlasTree.nodes[nodeId]
    if (node == null) return false
    if (this.unlockedNodes.has(nodeId)) return false // already unlocked
    if (
      node.type === "condition" &&
      testAtlasNodeCondition(node.condition, player) !== true
    ) {
      return false // condition not reached
    }
    if (node.type === "legendary") {
      const index = Number(nodeId.at(-1)) - 1
      const pkm = player.atlasManager.legendaries[index]
      if (!pkm) return false // no legendary assigned yet, waiting for the rollout
    }

    return AtlasTree.connections.some(
      (conn) =>
        (conn.from === nodeId && this.unlockedNodes.has(conn.to)) ||
        (conn.to === nodeId && this.unlockedNodes.has(conn.from))
    )
  }

  resetLegendaries() {
    resetArraySchema(
      this.legendaries,
      this.legendaries.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4 | 5 | 6
        return this.unlockedNodes.has(`legendary${n}`) ? l : ""
      })
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

    const newLegendaries: PkmProposition[] = assignLegendaries(player, symbols)
    this.legendaries = new ArraySchema(
      ...newLegendaries.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4 | 5 | 6
        return this.unlockedNodes.has(`legendary${n}`) ? this.legendaries[i] : l
      })
    )
  }
}
