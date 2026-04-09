import type { IMetaV2 } from "../../../types/models/meta-v2"

export type {
  IMetaV2,
  IMeanTeam,
  ITopTeam
} from "../../../types/models/meta-v2"

export async function fetchMetaV2(): Promise<IMetaV2[]> {
  return fetch("/meta-v2").then((res) => res.json())
}
