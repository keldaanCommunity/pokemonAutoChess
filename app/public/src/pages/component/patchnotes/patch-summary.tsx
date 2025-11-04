import { marked } from "marked"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "./patch-summary.css"

interface PatchSummaryProps {
  version: string
  showHeader?: boolean
}

export function PatchSummary({ version }: PatchSummaryProps) {
  const { t } = useTranslation()
  const [patchContent, setPatchContent] = useState<string>()
  const [fullPatchNotes, setFullPatchNotes] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // Fetch both summary and full patch notes
    const fetchSummary = fetch(`/changelog/summary/summary-${version}.md`)
      .then((res) => res.text())
      .then((md) => marked.parse(md))

    const fetchFullNotes = fetch(`/changelog/patch-${version}.md`)
      .then((res) => res.text())
      .then((md) => marked.parse(md))

    Promise.all([fetchSummary, fetchFullNotes])
      .then(([summaryParsed, fullNotesParsed]) => {
        setPatchContent(summaryParsed)
        setFullPatchNotes(fullNotesParsed)
      })
      .catch(() => {
        setPatchContent(
          `<h2>Patch ${version}</h2><p>Changelog not available</p>`
        )
        setFullPatchNotes("<p>Full patch notes not available</p>")
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
