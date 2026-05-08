import { marked } from "marked"
import { memo, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { PatchInfo } from "../../../../../config/game/patches"
import { Item } from "../../../../../types/enum/Item"
import { getPkmFromPortraitSrc } from "../../../../../utils/avatar"
import { clamp } from "../../../../../utils/number"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { addIconsToHtml } from "../../utils/descriptions"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import "./patch-summary.css"

interface PatchSummaryProps {
  patch: PatchInfo
  showHeader?: boolean
}

interface MidpatchNote {
  version: string
  html: string
}

function fetchMarkdown(
  url: string,
  headingLevelAdjustment: number = 0
): Promise<string> {
  return fetch(url)
    .then((res) => res.text())
    .then((md) => {
      marked.use({
        renderer: {
          heading({ tokens, depth }) {
            const newDepth = clamp(depth + headingLevelAdjustment, 1, 6)
            const text = this.parser.parseInline(tokens)
            return `<h${newDepth}>${text}</h${newDepth}>`
          },
          image({ href, title, text }) {
            const titleAttr = title ? ` title="${title}"` : ""
            let tooltipId = ""
            let content = ""
            if (href.startsWith("/assets/portraits/")) {
              tooltipId = "game-pokemon-detail-tooltip"
              content = getPkmFromPortraitSrc(href)?.name || ""
            } else if (href.startsWith("/assets/item/")) {
              tooltipId = "item-detail-tooltip"
              const itemNameMatch = href.match(/\/assets\/item\/(\w+)\.png/)
              if (itemNameMatch && itemNameMatch[1] in Item) {
                content = Item[itemNameMatch[1]]
              }
            }
            return `<img src="${href}" alt="${text}"${titleAttr} ${tooltipId && `data-tooltip-id="${tooltipId}"`} data-tooltip-content="${content}" />`
          }
        }
      })
      return marked.parse(md)
    })
}

export const PatchSummary = memo(
  ({ patch }: PatchSummaryProps) => {
    const { t } = useTranslation()
    const [patchContent, setPatchContent] = useState<string>()
    const [fullPatchNotes, setFullPatchNotes] = useState<string>()
    const [midpatchNotes, setMidpatchNotes] = useState<MidpatchNote[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      setIsLoading(true)

      // Fetch both summary and full patch notes
      const fetchSummary = fetchMarkdown(
        `/changelog/summary/summary-${patch.v}.md`
      )
      const fetchFullNotes = fetchMarkdown(`/changelog/patch-${patch.v}.md`, 2)
      const midpatches = patch.midpatches ?? []
      const fetchMidpatchNotes = Promise.all(
        midpatches.map((version) =>
          fetchMarkdown(`/changelog/patch-${version}.md`, 3)
            .then((parsed) => ({
              version,
              html: addIconsToHtml(parsed)
            }))
            .catch(() => null)
        )
      )

      Promise.all([fetchSummary, fetchFullNotes, fetchMidpatchNotes])
        .then(([summaryParsed, fullNotesParsed, midpatchesParsed]) => {
          setPatchContent(addIconsToHtml(summaryParsed))
          setFullPatchNotes(addIconsToHtml(fullNotesParsed))
          setMidpatchNotes(midpatchesParsed.filter(Boolean) as MidpatchNote[])
        })
        .catch(() => {
          const fallbackContent = `<h2>Patch ${patch.v}</h2><p>Changelog not available</p>`
          const fallbackNotes = "<p>Patch notes not available</p>"

          setPatchContent(addIconsToHtml(fallbackContent))
          setFullPatchNotes(addIconsToHtml(fallbackNotes))
          setMidpatchNotes([])
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, [patch.v, patch.midpatches])

    const patchContentHtml = useMemo(
      () => ({ __html: patchContent || "" }),
      [patchContent]
    )
    const fullPatchNotesHtml = useMemo(
      () => ({ __html: fullPatchNotes || "" }),
      [fullPatchNotes]
    )

    const hasMidpatches = midpatchNotes.length > 0

    return (
      <div className="patch-summary">
        {isLoading ? (
          <p>{t("loading")}...</p>
        ) : (
          <>
            {hasMidpatches && (
              <nav
                className="midpatch-shortcuts"
                aria-label="Midpatch shortcuts"
              >
                <span>Jump to midpatch notes:</span>
                {midpatchNotes.map(({ version }) => (
                  <a
                    key={version}
                    href={`#midpatch-${version.replace(/\./g, "-")}`}
                  >
                    {version}
                  </a>
                ))}
              </nav>
            )}
            <div
              className="patch-content"
              dangerouslySetInnerHTML={patchContentHtml}
            ></div>
            <hr />
            {fullPatchNotes && (
              <>
                <h2>{t("full_patch_notes")}</h2>
                <div
                  className="full-patch-notes"
                  dangerouslySetInnerHTML={fullPatchNotesHtml}
                ></div>
              </>
            )}
            {hasMidpatches && (
              <>
                <h2>Midpatch notes</h2>
                {midpatchNotes.map(({ version, html }) => (
                  <section
                    key={version}
                    id={`midpatch-${version.replace(/\./g, "-")}`}
                    className="midpatch-section"
                  >
                    <h3>Patch {version}</h3>
                    <div
                      className="full-patch-notes"
                      dangerouslySetInnerHTML={{ __html: html }}
                    ></div>
                  </section>
                ))}
              </>
            )}
          </>
        )}
        <GamePokemonDetailTooltip origin="patchnotes" />
        <ItemDetailTooltip />
      </div>
    )
  },
  (prevProps, nextProps) => prevProps.patch.v === nextProps.patch.v
)
