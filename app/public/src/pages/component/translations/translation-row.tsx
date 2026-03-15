import React, { useState } from "react"
import { addIconsToDescription } from "../../utils/descriptions"
import "./translation-row.css"

export interface TranslationRowProps {
  path: string
  leafKey: string
  enValue: string
  targetValue: string
  isEdited: boolean
  onEdit: (path: string, value: string) => void
  onRevert: (path: string) => void
}

export const TranslationRow = React.memo(function TranslationRow({
  path,
  leafKey,
  enValue,
  targetValue,
  isEdited,
  onEdit,
  onRevert
}: TranslationRowProps) {
  const [focused, setFocused] = useState<"en" | "target" | null>(null)

  return (
    <div className={`translation-row${isEdited ? " edited" : ""}`}>
      <span className="translation-key" title={path}>
        {leafKey}
      </span>

      <div className="translation-field-wrap">
        {focused === "en" && enValue && (
          <div className="translation-preview">
            {addIconsToDescription(enValue)}
          </div>
        )}
        <textarea
          className="translation-en"
          value={enValue}
          readOnly
          tabIndex={-1}
          rows={1}
          onFocus={() => setFocused("en")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <div className="translation-field-wrap">
        {focused === "target" && targetValue && (
          <div className="translation-preview">
            {addIconsToDescription(targetValue)}
          </div>
        )}
        <textarea
          className="translation-target"
          value={targetValue}
          rows={1}
          onChange={(e) => onEdit(path, e.currentTarget.value)}
          onFocus={() => setFocused("target")}
          onBlur={() => setFocused(null)}
        />
      </div>

      <button
        className="translation-revert-btn"
        title="Revert to original"
        disabled={!isEdited}
        onClick={() => onRevert(path)}
      >
        ↩
      </button>
    </div>
  )
})
