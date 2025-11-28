import { marked } from "marked"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { Item } from "../../../../../types/enum/Item"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPkmFromPortraitSrc } from "../../../../../utils/avatar"
import { clamp } from "../../../../../utils/number"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { addIconsToHtml } from "../../utils/descriptions"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import "./patch-summary.css"

interface PatchSummaryProps {
  version: string
  showHeader?: boolean
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
              tooltipId = "pokemon-detail"
              content = getPkmFromPortraitSrc(href)?.name || ""
            } else if (href.startsWith("/assets/item/")) {
              tooltipId = "item-detail"
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

export function PatchSummary({ version }: PatchSummaryProps) {
  const { t } = useTranslation()
  const [patchContent, setPatchContent] = useState<string>()
  const [fullPatchNotes, setFullPatchNotes] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Fetch both summary and full patch notes
    const fetchSummary = fetchMarkdown(
      `/changelog/summary/summary-${version}.md`
    )
    const fetchFullNotes = fetchMarkdown(`/changelog/patch-${version}.md`, 2)

    Promise.all([fetchSummary, fetchFullNotes])
      .then(([summaryParsed, fullNotesParsed]) => {
        setPatchContent(addIconsToHtml(summaryParsed))
        setFullPatchNotes(addIconsToHtml(fullNotesParsed))
      })
      .catch(() => {
        const fallbackContent = `<h2>Patch ${version}</h2><p>Changelog not available</p>`
        const fallbackNotes = "<p>Patch notes not available</p>"

        setPatchContent(addIconsToHtml(fallbackContent))
        setFullPatchNotes(addIconsToHtml(fallbackNotes))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [version])

  return (
    <div className="patch-summary">
      {isLoading ? (
        <p>{t("loading")}...</p>
      ) : (
        <>
          <div
            className="patch-content"
            dangerouslySetInnerHTML={{ __html: patchContent || "" }}
          ></div>
          <hr />
          {fullPatchNotes && (
            <>
              <h2>{t("full_patch_notes")}</h2>
              <div
                className="full-patch-notes"
                dangerouslySetInnerHTML={{ __html: fullPatchNotes }}
              ></div>
            </>
          )}
        </>
      )}
      <Tooltip
        id="pokemon-detail"
        className="custom-theme-tooltip game-pokemon-detail-tooltip"
        render={({ content }) => (
          <GamePokemonDetail pokemon={content as Pkm} origin="patchnotes" />
        )}
        float
      />
      <Tooltip
        id="item-detail"
        className="custom-theme-tooltip item-detail-tooltip"
        render={({ content }) => <ItemDetailTooltip item={content as Item} />}
        float
      />
    </div>
  )
}
