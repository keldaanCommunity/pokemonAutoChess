import { marked } from "marked"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { clamp } from "../../../../../utils/number"
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
        setPatchContent(summaryParsed)
        setFullPatchNotes(fullNotesParsed)
      })
      .catch(() => {
        setPatchContent(
          `<h2>Patch ${version}</h2><p>Changelog not available</p>`
        )
        setFullPatchNotes("<p>Patch notes not available</p>")
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
    </div>
  )
}
