import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { marked } from "marked"
import "./poster.css"

export function Poster(props: { version: string }) {
  const { t } = useTranslation()
  const [patchContent, setPatchContent] = useState<string>()

  useEffect(() => {
    fetch(`/changelog/summary/summary-${props.version}.md`)
      .then((res) => res.text())
      .then((md) => marked.parse(md, { mangle: false, headerIds: false }))
      .then((parsed) => setPatchContent(parsed))
  }, [])

  return (
    <div
      className="poster"
      onClick={(e) => e.currentTarget.classList.toggle("flipped")}
    >
      <div className="front">
        <img src={`/assets/posters/${props.version}.png`} alt={props.version} />
      </div>
      <div className="back">
        {patchContent ? (
          <div dangerouslySetInnerHTML={{ __html: patchContent }}></div>
        ) : (
          <p>{t("loading")}</p>
        )}
      </div>
    </div>
  )
}
