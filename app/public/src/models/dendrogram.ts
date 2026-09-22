import type { IDendrogram } from "../../../types/models/dendrogram"

export type {
  IBranchProfile,
  IClusterProfile,
  IDendrogram,
  IDendrogramNode
} from "../../../types/models/dendrogram"

export async function fetchDendrogram(): Promise<IDendrogram | null> {
  return fetch("/dendrogram").then((res) => res.json())
}
