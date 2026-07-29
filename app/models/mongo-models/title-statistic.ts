import { model, Schema } from "mongoose"
import { Title } from "../../types"
import type { ITitleStatistic } from "../../types/models/title-statistic"

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
