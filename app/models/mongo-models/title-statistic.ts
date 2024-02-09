import { Schema, model } from "mongoose"
import { Title } from "../../types"

export interface ITitleStatistic {
  name: Title
  rarity: number
}

const titleSchema = new Schema({
  name: {
    type: String,
    enum: Title
  },
  rarity: {
    type: Number
  }
})

export default model<ITitleStatistic>("TitleStatistic", titleSchema)

export async function fetchTitles(): Promise<ITitleStatistic[]> {
  return fetch("/titles").then((res) => res.json())
}
