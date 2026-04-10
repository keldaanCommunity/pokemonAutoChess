import type { IReportMetadata } from "../../../types/models/report-metadata"

export type { IReportMetadata } from "../../../types/models/report-metadata"

export async function fetchMetadata(): Promise<IReportMetadata[]> {
  return fetch("/meta/metadata").then((res) => res.json())
}
