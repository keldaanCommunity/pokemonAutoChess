import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { List } from "react-window"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { Checkbox } from "../checkbox/checkbox"
import "./sprite-tracker.css"

interface SpriteGapEntry {
  index: string
  monsterName: string
  formName: string
  displayName: string
  formPath: string
  portraitUrl?: string
  isShiny: boolean
  hasPortrait: boolean
  hasSprite: boolean
  canon: boolean
}

interface SpriteTrackerResult {
  spriteOnly: SpriteGapEntry[]
  stats: {
    totalSpriteCollab: number
    lastRefresh: number
    refreshDurationMs: number
  }
}

type GroupedSpriteRow = {
  key: string
  normal?: SpriteGapEntry
  shiny?: SpriteGapEntry
  others: SpriteGapEntry[]
}

const SPRITE_TRACKER_ROW_HEIGHT = 76

type SpriteOnlyRowData = {
  groups: GroupedSpriteRow[]
  normalLabel: string
  shinyLabel: string
  getSpriteCollabUrl: (index: string) => string
  getPacPortraitUrl: (index: string) => string
  getImageFallback: (event: React.SyntheticEvent<HTMLImageElement>) => void
}

function SpriteOnlyRow({
  index,
  style,
  groups,
  normalLabel,
  shinyLabel,
  getSpriteCollabUrl,
  getPacPortraitUrl,
  getImageFallback
}: {
  ariaAttributes: object
  index: number
  style: React.CSSProperties
} & SpriteOnlyRowData): React.ReactElement | null {
  const group = groups[index]
  const normalEntry = group.normal ?? group.others[0] ?? group.shiny
  const shinyEntry = group.shiny !== normalEntry ? group.shiny : undefined
  const title = normalEntry?.displayName.replace(/\s+Shiny$/i, "")
  const normalIndex = normalEntry?.isShiny ? undefined : normalEntry?.index
  const shinyIndex =
    shinyEntry?.index ?? (normalEntry?.isShiny ? normalEntry.index : undefined)

  if (!normalEntry) {
    return null
  }

  return (
    <div style={style}>
      <div className="entry my-box sprite-only-entry">
        <div className="entry-header">
          <div className="entry-info grouped-row">
            <div className="entry-portraits">
              <img
                className="pokemon-portrait entry-portrait"
                src={
                  normalEntry.portraitUrl ??
                  getPacPortraitUrl(normalEntry.index)
                }
                onError={getImageFallback}
              />
              {shinyEntry && (
                <img
                  className="pokemon-portrait entry-portrait"
                  src={
                    shinyEntry.portraitUrl ??
                    getPacPortraitUrl(shinyEntry.index)
                  }
                  onError={getImageFallback}
                />
              )}
            </div>
            <div className="entry-text">
              <div className="entry-line">
                <a
                  className="pokemon-name entry-title entry-name-link"
                  href={getSpriteCollabUrl(normalEntry.index)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {title}
                </a>
              </div>
              <div className="entry-line entry-summary">
                {normalIndex && (
                  <>
                    <span className="entry-kind">{normalLabel}</span>
                    <strong>{normalIndex}</strong>
                  </>
                )}
                {normalIndex && shinyIndex && (
                  <span className="entry-separator">|</span>
                )}
                {shinyIndex && (
                  <>
                    <span className="entry-kind">{shinyLabel}</span>
                    <strong>{shinyIndex}</strong>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getShinyGroupKey(index: string): string {
  if (index.endsWith("-0000-0001")) {
    return index.slice(0, -10)
  }

  const parts = index.split("-")

  if (parts.length === 3 && parts[2] === "0001") {
    return `${parts[0]}-${parts[1]}`
  }

  if (parts.length >= 4 && parts[2] === "0001") {
    const base = [...parts]
    base[2] = "0000"
    return base.join("-")
  }

  return index
}

function buildGroupedSpriteRows(entries: SpriteGapEntry[]): GroupedSpriteRow[] {
  const groups = new Map<string, GroupedSpriteRow>()

  for (const entry of entries) {
    const key = getShinyGroupKey(entry.index)
    if (!groups.has(key)) {
      groups.set(key, { key, others: [] })
    }

    const group = groups.get(key)!
    if (entry.isShiny) {
      if (!group.shiny) {
        group.shiny = entry
      } else {
        group.others.push(entry)
      }
    } else if (!group.normal) {
      group.normal = entry
    } else {
      group.others.push(entry)
    }
  }

  return [...groups.values()].sort((a, b) => a.key.localeCompare(b.key))
}

export default function SpriteTracker() {
  const { t } = useTranslation()
  const [data, setData] = useState<SpriteTrackerResult | null>(null)
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
        const result: SpriteTrackerResult = await response.json()
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

  const groupedSpriteOnly = useMemo(
    () => buildGroupedSpriteRows(filteredSpriteOnly),
    [filteredSpriteOnly]
  )

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

  const getPacPortraitUrl = (index: string) => getPortraitSrc(index)

  const getImageFallback = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget
    const fallback = getPortraitSrc("0129")
    if (target.src !== new URL(fallback, window.location.origin).href) {
      target.src = fallback
      return
    }
    target.style.visibility = "hidden"
  }

  if (loading) {
    return (
      <div className="sprite-tracker">
        <div className="loading">{t("loading")}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sprite-tracker">
        <div className="error">
          <strong>{t("sprite_tracker.error_label")}</strong>: {error}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="sprite-tracker">
        <div className="error">{t("no_data_available")}</div>
      </div>
    )
  }

  const lastRefreshDate = new Date(data.stats.lastRefresh)
  const lastRefreshStr = lastRefreshDate.toLocaleString()

  return (
    <div className="sprite-tracker">
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

      <div className="criteria-info my-box">
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
        {groupedSpriteOnly.length === 0 ? (
          <p className="empty-state">{t("no_results_found")}</p>
        ) : (
          <AutoSizer
            renderProp={({ height, width }) => {
              if (height === undefined || width === undefined) return null
              return (
                <List<SpriteOnlyRowData>
                  style={{ height, width }}
                  rowCount={groupedSpriteOnly.length}
                  rowHeight={SPRITE_TRACKER_ROW_HEIGHT}
                  rowComponent={SpriteOnlyRow}
                  rowProps={{
                    groups: groupedSpriteOnly,
                    normalLabel: t("sprite_tracker.normal"),
                    shinyLabel: t("sprite_tracker.shiny"),
                    getSpriteCollabUrl,
                    getPacPortraitUrl,
                    getImageFallback
                  }}
                />
              )
            }}
          />
        )}
      </div>
    </div>
  )
}
