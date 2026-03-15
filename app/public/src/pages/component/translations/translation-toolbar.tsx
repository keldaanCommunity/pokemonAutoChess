import React from "react"
import { Language } from "../../../../../types/enum/Language"
import { LanguageNames } from "../../../../dist/client/locales"

export interface TranslationToolbarProps {
  targetLang: Language
  filterMode: "all" | "missing" | "translated"
  search: string
  translatedCount: number
  totalCount: number
  onLangChange: (lang: Language) => void
  onFilterChange: (mode: "all" | "missing" | "translated") => void
  onSearch: (q: string) => void
  onCollapseAll: () => void
  onExpandAll: () => void
}

export function TranslationToolbar({
  targetLang,
  filterMode,
  search,
  translatedCount,
  totalCount,
  onLangChange,
  onFilterChange,
  onSearch,
  onCollapseAll,
  onExpandAll
}: TranslationToolbarProps) {
  const missingCount = totalCount - translatedCount
  return (
    <div className="translations-toolbar my-box">
      <label htmlFor="lang-select">Translate to:</label>
      <select
        id="lang-select"
        value={targetLang}
        onChange={(e) => onLangChange(e.currentTarget.value as Language)}
      >
        {Object.values(Language)
          .filter((l) => l !== Language.en)
          .map((l) => (
            <option key={l} value={l}>
              {LanguageNames[l]} ({l})
            </option>
          ))}
      </select>

      <label htmlFor="filter-select">Filter:</label>
      <select
        id="filter-select"
        value={filterMode}
        onChange={(e) =>
          onFilterChange(
            e.currentTarget.value as "all" | "missing" | "translated"
          )
        }
      >
        <option value="all">All</option>
        <option value="missing">Missing translations</option>
        <option value="translated">Already translated</option>
      </select>

      <span className="translations-stats">
        <span className="stat-translated">{translatedCount} translated</span>
        {" · "}
        <span className="stat-missing">{missingCount} missing</span>
      </span>

      <div className="spacer" />

      <button
        className="bubbly"
        onClick={onCollapseAll}
        style={{ fontSize: "0.9em" }}
      >
        Collapse all
      </button>
      <button
        className="bubbly"
        onClick={onExpandAll}
        style={{ fontSize: "0.9em" }}
      >
        Expand all
      </button>

      <input
        className="translations-search"
        type="search"
        placeholder="Search keys, English or translated text…"
        value={search}
        onChange={(e) => onSearch(e.currentTarget.value)}
      />
    </div>
  )
}
