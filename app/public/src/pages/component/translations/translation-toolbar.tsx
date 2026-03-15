import React, { useRef, useState } from "react"
import { Language } from "../../../../../types/enum/Language"
import { LanguageNames } from "../../../../dist/client/locales"
import "./translation-toolbar.css"

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
        className="bubbly blue"
        onClick={() => dialogRef.current?.showModal()}
        style={{ fontSize: "0.9em" }}
      >
        Help
      </button>
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
      <dialog ref={dialogRef} className="translations-help-dialog">
        <h3>How to contribute translations</h3>
        <ul>
          <li>
            Select the target language from the <strong>Translate to</strong>{" "}
            dropdown. The reference language is English, it is the one
            maintained by the developers.
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
            If you made a mistale, you can click the <strong>↩</strong> button
            on a row to revert your change to the saved value. You can also
            reset all edits with the <strong>Reset all</strong> button in the
            footer.
          </li>
          <li>
            A search bar on top right can be used to quickly find labels by key,
            English text, or translated text.
          </li>
          <li>
            When done, you can submit your changes. You will need a Github
            account and a personal access token with <code>public_repo</code>{" "}
            access. Then click on <strong>Submit Pull Request</strong> and
            follow instructions.
          </li>
        </ul>
        <p
          className="disclaimer"
          style={{
            padding: "1em",
            backgroundColor: "#700000",
            borderRadius: 4
          }}
        >
          <strong>IMPORTANT:</strong> if you contribute for the first time,
          start with just a few translations before trying to submit a pull
          request, so you don't lose too much work if something goes wrong.
        </p>
        <div className="translations-help-dialog-actions">
          <button
            className="bubbly blue"
            onClick={() => dialogRef.current?.close()}
          >
            Understood!
          </button>
        </div>
      </dialog>
    </div>
  )
}
