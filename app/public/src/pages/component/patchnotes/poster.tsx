import React from "react"
import "./poster.css"

interface PosterProps {
  version: string
  onClick?: () => void
  isDetailed?: boolean
}

export function Poster({ version, onClick, isDetailed }: PosterProps) {
  return (
    <div
      className={`poster ${isDetailed ? "poster-detailed" : ""}`}
      onClick={onClick}
      style={{
        viewTransitionName: `poster-${version.replace(/\./g, "-")}`
      }}
    >
      <img
        src={`/assets/posters/${version}.png`}
        alt={`Patch ${version} poster`}
        loading="lazy"
      />
    </div>
  )
}
