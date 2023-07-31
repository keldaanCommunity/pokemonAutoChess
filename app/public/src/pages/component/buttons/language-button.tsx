import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { useTranslation } from "react-i18next"
import { Language, LanguageFlag } from "../../../../../types/enum/Language"
import { selectLanguage } from "../../../stores/NetworkStore"

export function LanguageButton() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const selectedLanguage = useAppSelector((state) => state.lobby.language)
  const language = selectedLanguage ? selectedLanguage : i18n.language
  return (
    <button type="button" className="bubbly">
      <select
        value={language}
        onChange={(e) => {
          dispatch(selectLanguage(e.target.value as Language))
        }}
      >
        {Object.keys(Language).map((lng) => (
          <option key={lng} value={lng}>
            {LanguageFlag[lng]}
          </option>
        ))}
      </select>
    </button>
  )
}
