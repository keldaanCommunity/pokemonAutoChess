import { Synergy } from "../enum/Synergy"
import type { Item, PkmWithCustom } from "../index"

export interface ITierList {
  name: string
  rows: Array<{
    name: string
    color?: string
    items: Array<Item | PkmWithCustom | Synergy>
  }>
}
