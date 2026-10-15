import type { Item } from "./enum/Item"
import type { TownEncounter } from "./enum/TownEncounter"

export type AtlasNodeType =
  | "start"
  | "step"
  | "keystone"
  | "encounter"
  | "condition"
  | "item"
  | "buff"
export type AtlasKeystone = "legendary" | "awakening" | "gigantamax"

export type Emera =
  | AtlasKeystone
  | "blank"
  | "pink"
  | "red"
  | "yellow"
  | "green"
  | "blue"

export type AtlasNode = {
  id: string
  type: AtlasNodeType
  position: [number, number]
}

export type StartNode = AtlasNode & {
  type: "start"
}

export type StepNode = AtlasNode & {
  type: "step"
}

export type KeystoneNode = AtlasNode & {
  type: "keystone"
  emera: AtlasKeystone
}

export type EncounterNode = AtlasNode & {
  type: "encounter"
  encounter: TownEncounter
}

export type ConditionNode = AtlasNode & {
  type: "condition"
  condition: "mega" | "gigantamax"
}

export type ItemNode = AtlasNode & {
  type: "item"
  item: Item
}

export type BuffNode = AtlasNode & {
  type: "buff"
  buff: "red" | "blue" | "pink" | "yellow" | "green"
}

export type TreeNode =
  | StartNode
  | KeystoneNode
  | EncounterNode
  | ConditionNode
  | StepNode
  | ItemNode
  | BuffNode

export type TreeConnection = {
  from: string
  to: string
}

export type Tree = {
  nodes: TreeNode[]
  connections: TreeConnection[]
}
