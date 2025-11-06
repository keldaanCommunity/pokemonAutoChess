import React, { useEffect, useState } from "react"
import "./poster.css"

interface PosterProps {
  version: string
  onClick?: () => void
  isDetailed?: boolean
}

export function Poster({ version, onClick, isDetailed }: PosterProps) {
  const [imageSrc, setImageSrc] = useState(`/assets/posters/${version}.png`)
  const [isHdLoaded, setIsHdLoaded] = useState(false)

  useEffect(() => {
    if (isDetailed && !isHdLoaded) {
      setTimeout(() => {
        const hdImage = new Image()
        const hdImageSrc = `/assets/posters/hd/${version}.png`
        hdImage.src = hdImageSrc
        hdImage.onload = () => {
          setImageSrc(hdImageSrc)
          setIsHdLoaded(true)
        }
        hdImage.onerror = () => {
          // Keep the original image if HD version fails to load
          console.warn(
            `HD version of poster ${version} not found, keeping original`
          )
        }
      }, 400)
    }
  }, [isDetailed, version, isHdLoaded])

  return (
    <div
      className={`poster ${isDetailed ? "poster-detailed" : ""}`}
      onClick={onClick}
      style={{
        viewTransitionName: `poster-${version.replace(/\./g, "-")}`
      }}
    >
      <img src={imageSrc} alt={`Patch ${version} poster`} loading="lazy" />
    </div>
  )
}
