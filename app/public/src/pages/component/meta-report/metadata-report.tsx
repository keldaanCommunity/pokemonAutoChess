import { useEffect, useState } from "react"
import { fetchMetadata } from "../../../../../models/mongo-models/report-metadata"
import "./metadata-report.css"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)
const format = "YYYY-MM-DDTHH:mm:ss"

const MetadataReport = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)
  const [createdAt, setCreatedAt] = useState<string>("")
  const [timeLimit, setTimeLimit] = useState<string>("")

  useEffect(() => {
    fetchMetadata().then((res) => {
      if (res[0]) {
        setCount(res[0].count)
        setCreatedAt(res[0].created_at.slice(0, 19))
        setTimeLimit(res[0].time_limit.slice(0, 19))
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div id="metadata-report">
      <p>Generated at {dayjs(createdAt, format).toString()}</p>
      <p>From {dayjs(timeLimit, format).toString()}</p>
      <p>{count} Games</p>
    </div>
  )
}

export default MetadataReport
