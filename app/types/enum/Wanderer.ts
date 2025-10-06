import { Pkm } from "./Pokemon"

export enum WandererBehavior {
  RUN_THROUGH = "RUN_THROUGH",
  SPECTATE = "SPECTATE"
}

export enum WandererType {
  CATCHABLE = "CATCHABLE",
  UNOWN = "UNOWN"
}

export interface Wanderer {
  id: string
  pkm: Pkm
  type: WandererType
  behavior: WandererBehavior
}
