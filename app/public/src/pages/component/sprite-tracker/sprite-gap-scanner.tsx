import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Checkbox } from "../checkbox/checkbox"
import "./sprite-gap-scanner.css"

interface SpriteGapEntry {
  index: string
  monsterName: string
  formName: string
  formPath: string
  isShiny: boolean
  hasPortrait: boolean
  hasSprite: boolean
  canon: boolean
}

interface SpriteGapScannerResult {
  spriteOnly: SpriteGapEntry[]
  stats: {
    totalSpriteCollab: number
    lastRefresh: number
    refreshDurationMs: number
  }
}

export default function SpriteGapScanner() {
  const { t } = useTranslation()
  const [data, setData] = useState<SpriteGapScannerResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterAlternate, setFilterAlternate] = useState(false)
  const [filterAltcolor, setFilterAltcolor] = useState(false)
  const [filterFemale, setFilterFemale] = useState(false)
  const [filterCutscene, setFilterCutscene] = useState(false)
  const [filterAlcremie, setFilterAlcremie] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/sprite-gap-scanner")
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const result: SpriteGapScannerResult = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t("sprite_tracker.failed_to_fetch_data")
        )
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredSpriteOnly = useMemo(() => {
    const entries = data?.spriteOnly ?? []
    return entries.filter((entry) => {
      const name = entry.formName.toLowerCase()
      const monsterName = entry.monsterName.toLowerCase()
      if (name.includes("alternate") && !filterAlternate) return false
      if (name.includes("altcolor") && !filterAltcolor) return false
      if (name.includes("female") && !filterFemale) return false
      if (name.includes("cutscene") && !filterCutscene) return false
      if (monsterName.includes("alcremie") && !filterAlcremie) return false
      return true
    })
  }, [
    data?.spriteOnly,
    filterAlternate,
    filterAltcolor,
    filterFemale,
    filterCutscene,
    filterAlcremie
  ])

  const filterCounts = useMemo(() => {
    const entries = data?.spriteOnly ?? []
    let alternate = 0
    let altcolor = 0
    let female = 0
    let cutscene = 0
    let alcremie = 0

    for (const entry of entries) {
      const formName = entry.formName.toLowerCase()
      const monsterName = entry.monsterName.toLowerCase()

      if (formName.includes("alternate")) alternate += 1
      if (formName.includes("altcolor")) altcolor += 1
      if (formName.includes("female")) female += 1
      if (formName.includes("cutscene")) cutscene += 1
      if (monsterName.includes("alcremie")) alcremie += 1
    }

    return { alternate, altcolor, female, cutscene, alcremie }
  }, [data?.spriteOnly])

  const getSpriteCollabUrl = (index: string) => {
    const parts = index.split("-")
    const species = parts[0]
    const baseForm = Number(parts[1] ?? "0")
    const hasVariant = parts.slice(2).some((part) => Number(part) > 0)
    const form = baseForm > 0 ? baseForm : hasVariant ? 1 : 0

    if (form === 0) {
      return `https://sprites.pmdcollab.org/#/${species}`
    }

    return `https://sprites.pmdcollab.org/#/${species}?form=${form}`
  }

  if (loading) {
    return (
      <div className="sprite-gap-scanner">
        <div className="loading">{t("loading")}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sprite-gap-scanner">
        <div className="error">
          <strong>{t("sprite_tracker.error_label")}</strong>: {error}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="sprite-gap-scanner">
        <div className="error">{t("no_data_available")}</div>
      </div>
    )
  }

  const lastRefreshDate = new Date(data.stats.lastRefresh)
  const lastRefreshStr = lastRefreshDate.toLocaleString()

  return (
    <div className="sprite-gap-scanner">
      <div className="refresh-info">
        <small>
          {t("sprite_tracker.summary_line", {
            totalSpriteCollab: data.stats.totalSpriteCollab,
            missingInPac: data.spriteOnly.length,
            lastUpdated: lastRefreshStr,
            refreshDurationMs: data.stats.refreshDurationMs
          })}
        </small>
      </div>

      <div className="criteria-info">
        <strong>{t("sprite_tracker.criteria_title")}</strong>
        <p>{t("sprite_tracker.criteria_line_1")}</p>
        <p>{t("sprite_tracker.criteria_line_2")}</p>
        <p>{t("sprite_tracker.criteria_line_3")}</p>
      </div>

      <div className="filter-container">
        <Checkbox
          label={t("sprite_tracker.filter_alternate", {
            count: filterCounts.alternate
          })}
          checked={filterAlternate}
          onToggle={setFilterAlternate}
          isDark
        />
        <Checkbox
          label={t("sprite_tracker.filter_altcolor", {
            count: filterCounts.altcolor
          })}
          checked={filterAltcolor}
          onToggle={setFilterAltcolor}
          isDark
        />
        <Checkbox
          label={t("sprite_tracker.filter_female", {
            count: filterCounts.female
          })}
          checked={filterFemale}
          onToggle={setFilterFemale}
          isDark
        />
        <Checkbox
          label={t("sprite_tracker.filter_cutscene", {
            count: filterCounts.cutscene
          })}
          checked={filterCutscene}
          onToggle={setFilterCutscene}
          isDark
        />
        <Checkbox
          label={t("sprite_tracker.filter_alcremie", {
            count: filterCounts.alcremie
          })}
          checked={filterAlcremie}
          onToggle={setFilterAlcremie}
          isDark
        />
      </div>

      <div className="content">
        <div className="entry-list">
          {filteredSpriteOnly.length === 0 ? (
            <p className="empty-state">{t("no_results_found")}</p>
          ) : (
            filteredSpriteOnly.map((entry) => (
              <div key={entry.index} className="entry sprite-only-entry">
                <div className="entry-header">
                  <div className="entry-info">
                    <strong>{entry.index}</strong>
                    <a
                      className="pokemon-name entry-name-link"
                      href={getSpriteCollabUrl(entry.index)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {entry.monsterName}
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
