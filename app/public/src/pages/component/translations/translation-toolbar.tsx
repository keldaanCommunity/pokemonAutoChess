import React, { useRef, useState } from "react"
import { Language } from "../../../../../types/enum/Language"
import "./translation-toolbar.css"
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
  const dialogRef = useRef<HTMLDialogElement>(null)

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
        onClick={() => dialogRef.current?.showModal()}
        style={{ fontSize: "0.9em" }}
      >
        Help
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
      <dialog ref={dialogRef} className="translations-help-dialog">
        <h3>How to contribute translations</h3>
        <ul>
          <li>
            Select the target language from the <strong>Translate to</strong>{" "}
            dropdown.
          </li>
          <li>
            Use the <strong>Filter</strong> dropdown to focus on missing or
            already-translated labels.
          </li>
          <li>
            Edit the right-hand column for any label you want to translate.
            Edited rows are highlighted.
          </li>
          <li>
            Click <strong>↩</strong> on a row to revert your change to the saved
            value.
          </li>
          <li>
            Use the search bar to quickly find labels by key, English text, or
            translated text.
          </li>
          <li>
            When done, use <strong>Download JSON</strong> to save the file
            locally, or <strong>Submit Pull Request</strong> to contribute
            directly via GitHub (requires a personal access token).
          </li>
        </ul>
        <div className="translations-help-dialog-actions">
          <button
            className="bubbly blue"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  )
}
