import React, { useState } from "react"
import { useTranslation } from "react-i18next"

export function SearchBar({ onChange }) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { t } = useTranslation()

  return (
    <div className="search-bar nes-field is-inline">
      <input
        type="text"
        className="my-input"
        placeholder={t("search_player")}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          onChange(e.target.value)
        }}
      />
    </div>
  )
}
