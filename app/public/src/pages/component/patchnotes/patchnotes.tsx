import React from "react"
import { useTranslation } from "react-i18next"
import { Poster } from "./poster"
import "./patchnotes.css"

export default function PatchNotes() {
  const { t } = useTranslation()

  const PATCHES = ["4.2", "4.1", "4.0", "3.10", "3.9", "3.8"]

  return (
    <div className="nes-container patchnotes">
      <h1>{t("patch_notes")}</h1>
      <div className="content">
        <ul>
          {PATCHES.map((v) => (
            <li key={v}>
              <Poster version={v} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
