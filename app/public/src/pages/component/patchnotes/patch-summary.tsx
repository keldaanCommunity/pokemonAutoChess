import { marked } from "marked"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { PkmWithCustom } from "../../../../../types"
import { Item } from "../../../../../types/enum/Item"
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
            if (href.startsWith("/assets/portraits/")) {
              tooltipId = "pokemon-detail"
            } else if (href.startsWith("/assets/item/")) {
              tooltipId = "item-detail"
            }
            return `<img src="${href}" alt="${text}"${titleAttr} ${tooltipId && `data-tooltip-id="${tooltipId}"`} />`
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
  const [hoveredPokemon, setHoveredPokemon] = useState<PkmWithCustom>()
  const [itemHovered, setItemHovered] = useState<Item>()

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

  const handleOnMouseOver = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      if (target && target.matches('img[src^="/assets/portraits/"]')) {
        // Extract Pokemon ID from image src
        const src = target.getAttribute("src") || ""
        const pkm = getPkmFromPortraitSrc(src)
        if (pkm && (!hoveredPokemon || pkm.name !== hoveredPokemon.name)) {
          setHoveredPokemon(pkm)
          if (itemHovered) {
            setItemHovered(undefined)
          }
        }
      } else if (target && target.matches('img[src^="/assets/item/"]')) {
        // Extract Item ID from image src
        const src = target.getAttribute("src") || ""
        const itemNameMatch = src.match(/\/assets\/item\/(\w+)\.png/)
        if (itemNameMatch && itemNameMatch[1] in Item) {
          const item = Item[itemNameMatch[1]]
          if (item !== itemHovered) {
            setItemHovered(item)
            if (hoveredPokemon) {
              setHoveredPokemon(undefined)
            }
          }
        }
      }
    },
    [hoveredPokemon, itemHovered]
  )

  const handleOnMouseOut = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement
      const relatedTarget = event.relatedTarget as HTMLElement

      // Don't clear tooltips if we're moving to another image or the tooltip itself
      if (
        relatedTarget &&
        (relatedTarget.matches(
          'img[src^="/assets/portraits/"], img[src^="/assets/item/"]'
        ) ||
          relatedTarget.closest(".react-tooltip"))
      ) {
        return
      }

      if (target && target.matches('img[src^="/assets/portraits/"]')) {
        setHoveredPokemon(undefined)
      } else if (target && target.matches('img[src^="/assets/item/"]')) {
        setItemHovered(undefined)
      }
    },
    []
  )

  return (
    <div
      className="patch-summary"
      onMouseOver={handleOnMouseOver}
      onMouseOutCapture={handleOnMouseOut}
    >
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
      {hoveredPokemon && (
        <Tooltip
          id="pokemon-detail"
          className="custom-theme-tooltip game-pokemon-detail-tooltip"
          float
        >
          <GamePokemonDetail
            pokemon={hoveredPokemon.name}
            emotion={hoveredPokemon.emotion}
            shiny={hoveredPokemon.shiny}
            origin="patchnotes"
          />
        </Tooltip>
      )}
      {itemHovered && (
        <Tooltip
          id="item-detail"
          className="custom-theme-tooltip item-detail-tooltip"
          float
        >
          <ItemDetailTooltip item={itemHovered} />
        </Tooltip>
      )}
    </div>
  )
}
