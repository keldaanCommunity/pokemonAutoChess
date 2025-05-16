import { useEffect, useState } from "react"
import { fetchMetadata } from "../../../../../models/mongo-models/report-metadata"
import { formatDate } from "../../utils/date"
import { useTranslation } from "react-i18next"
import "./metadata-report.css"

const MetadataReport = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [count, setCount] = useState<number>(0)
  const [createdAt, setCreatedAt] = useState<string>("")
  const [timeLimit, setTimeLimit] = useState<string>("")
  const { t } = useTranslation()

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
    <p id="metadata-report">
      {t("meta_report_info", {
        report_date: formatDate(new Date(createdAt), { dateStyle: "long" }),
        time_limit: formatDate(new Date(timeLimit), { dateStyle: "long" }),
        count
      })}
    </p>
  )
}

export default MetadataReport
