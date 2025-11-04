import React, { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { useTranslation } from "react-i18next"
import { PatchSummary } from "./patch-summary"
import { Poster } from "./poster"
import "./patchnotes.css"
import { transition } from "d3"

export default function PatchNotes() {
  const { t } = useTranslation()
  const PATCHES = [
    "6.6",
    "6.5",
    "6.4",
    "6.3",
    "6.2",
    "6.1",
    "6.0",
    "5.10",
    "5.9",
    "5.8",
    "5.7",
    "5.6",
    "5.5",
    "5.4",
    "5.3",
    "5.2",
    "5.1",
    "5.0",
    "4.9",
    "4.8",
    "4.7",
    "4.6",
    "4.5",
    "4.4",
    "4.3",
    "4.2",
    "4.1",
    "4.0",
    "3.10",
    "3.9",
    "3.8"
  ]

  const [selectedPatch, setSelectedPatch] = useState<string | null>(null)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedPatch) {
        handleBackClick()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedPatch])

  const viewTransition = (transition: () => void) => {
    // Use View Transition API if available
    if (
      "startViewTransition" in document &&
      typeof document.startViewTransition === "function"
    ) {
      document.startViewTransition(() => {
        flushSync(() => {
          transition()
        })
      })
    } else {
      transition()
    }
  }

  const handlePosterClick = (version: string) =>
    viewTransition(() => {
      setSelectedPatch(selectedPatch === version ? null : version)
    })

  const handleBackClick = () =>
    viewTransition(() => {
      setSelectedPatch(null)
    })

  if (selectedPatch) {
    return (
      <div className="patchnotes-detail-view">
        <div className="detail-content">
          <div className="detail-poster">
            <button className="bubbly blue" onClick={handleBackClick}>
              {t("back")}
            </button>
            <Poster version={selectedPatch} isDetailed />
          </div>
          <div className="detail-notes">
            <PatchSummary version={selectedPatch} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ul className="patchnotes-grid" role="list">
      {PATCHES.map((v) => (
        <li
          key={v}
          style={{ viewTransitionName: `poster-${v}` }}
          role="listitem"
        >
          <Poster version={v} onClick={() => handlePosterClick(v)} />
        </li>
      ))}
    </ul>
  )
}
