import { model, Schema } from "mongoose"
import type { IReportMetadata } from "../../types/models/report-metadata"

const metadataSchema = new Schema({
  time_limit: {
    type: String
  },
  created_at: {
    type: String
  },
  count: {
    type: Number
  }
})

export default model<IReportMetadata>("Metadata", metadataSchema, "metadata")
