import { Schema, model } from "mongoose"

export interface IReportMetadata {
  created_at: string
  count: number
  time_limit: string
}

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

export async function fetchMetadata(): Promise<IReportMetadata[]> {
  return fetch("/meta/metadata").then((res) => res.json())
}
