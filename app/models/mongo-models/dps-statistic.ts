import { Pkm } from "../../types/enum/Pokemon"
import { Schema, model } from "mongoose"

export interface IDpsStatistic {
  name: Pkm
  turns: IDpsReport[]
}

export interface IDpsReport {
  stageLevel: number
  count: number
  heal: number
  shield: number
  physical: number
  special: number
  true: number
}

const dpsStatistic = new Schema({
  name: {
    type: String,
    enum: Pkm
  },
  turns: [
    {
      stageLevel: {
        type: Number
      },
      count: {
        type: Number
      },
      heal: {
        type: Number
      },
      shield: {
        type: Number
      },
      physical: {
        type: Number
      },
      true: {
        type: Number
      }
    }
  ]
})

export default model<IDpsStatistic>("DpsStatistic", dpsStatistic)

export async function fetchMetaDps(): Promise<IDpsStatistic[]> {
  return fetch("/meta/dps").then((res) => res.json())
}
