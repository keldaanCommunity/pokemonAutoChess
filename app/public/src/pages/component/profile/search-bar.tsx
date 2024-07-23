import React, { useState } from "react"
import { useTranslation } from "react-i18next"

export function SearchBar({ onChange }) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { t } = useTranslation()

  return (
    <input
      type="search"
      className="search-bar"
      placeholder={t("search_player")}
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value)
        onChange(e.target.value)
      }}
    />
  )
}
