import type { Item } from "./enum/Item"
import type { PkmProposition } from "./enum/Pokemon"
import type { TownEncounter } from "./enum/TownEncounter"

export type AtlasNodeType =
  | "start"
  | "step"
  | "keystone"
  | "legendary"
  | "encounter"
  | "condition"
  | "item"
  | "buff"
export type AtlasKeystone = "awakening" | "gigantamax"

export type Emera =
  | AtlasKeystone
  | "legendary"
  | "blank"
  | "pink"
  | "red"
  | "yellow"
  | "green"
  | "blue"

type Node = {
  type: AtlasNodeType
  position: [number, number]
}

export type StartNode = Node & {
  type: "start"
}

export type StepNode = Node & {
  type: "step"
}

export type KeystoneNode = Node & {
  type: "keystone"
  emera: AtlasKeystone
}

export type LegendaryNode = Node & {
  type: "legendary"
  pokemon?: PkmProposition
}

export type EncounterNode = Node & {
  type: "encounter"
  encounter: TownEncounter
}

export type ConditionNode = Node & {
  type: "condition"
  condition: "mega" | "gigantamax"
}

export type ItemNode = Node & {
  type: "item"
  item: Item
}

export type BuffNode = Node & {
  type: "buff"
  buff: "red" | "blue" | "pink" | "yellow" | "green"
}

export type AtlasNode =
  | StartNode
  | KeystoneNode
  | LegendaryNode
  | EncounterNode
  | ConditionNode
  | StepNode
  | ItemNode
  | BuffNode

export type AtlasNodeConnection = {
  from: string
  to: string
}

export type TAtlasTree = {
  nodes: { [nodeId: string]: AtlasNode }
  connections: AtlasNodeConnection[]
}

export const isLegendaryNode = (node: AtlasNode): node is LegendaryNode =>
  node.type === "legendary"
