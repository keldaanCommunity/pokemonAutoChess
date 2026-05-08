import { useState } from "react"
import { flushSync } from "react-dom"
import { PATCHES, PatchInfo } from "../../../../../config/game/patches"
import { PatchSummary } from "./patch-summary"
import { Poster } from "./poster"
import "./patchnotes.css"

export default function PatchNotes() {
  const [selectedPatch, setSelectedPatch] = useState<PatchInfo | null>(null)

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

  const handlePosterClick = (patch: PatchInfo) =>
    viewTransition(() => {
      setSelectedPatch(selectedPatch?.v === patch.v ? null : patch)
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
            <Poster version={selectedPatch.v} isDetailed />
          </div>
          <div className="detail-notes">
            <button
              className="close-btn"
              onClick={handleBackClick}
              style={{ float: "right", marginLeft: "2em" }}
            >
              🗙
            </button>
            <PatchSummary patch={selectedPatch} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ul className="patchnotes-grid" role="list">
      {PATCHES.map((patch) => (
        <li
          key={patch.v}
          style={{ viewTransitionName: `poster-${patch.v}` }}
          role="listitem"
        >
          <Poster version={patch.v} onClick={() => handlePosterClick(patch)} />
        </li>
      ))}
    </ul>
  )
}
