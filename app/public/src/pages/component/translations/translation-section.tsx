import React, { useMemo } from "react"
import { TranslationRow } from "./translation-row"
import type { TranslationNode } from "./types"
import "./translation-section.css"

export interface TranslationSectionProps {
  path: string
  label: string
  enObj: TranslationNode
  collapsedSections: Set<string>
  toggleSection: (path: string) => void
  edits: Record<string, string>
  getTargetValue: (path: string) => string
  onEdit: (path: string, value: string) => void
  onRevert: (path: string) => void
  depth: number
  translatedCount: number
  missingCount: number
  totalCount: number
}

export const TranslationSection = React.memo(function TranslationSection({
  path,
  label,
  enObj,
  collapsedSections,
  toggleSection,
  edits,
  getTargetValue,
  onEdit,
  onRevert,
  depth,
  translatedCount,
  missingCount,
  totalCount
}: TranslationSectionProps) {
  const isCollapsed = collapsedSections.has(path)

  const editedCount = useMemo(
    () =>
      Object.keys(edits).filter((k) => k === path || k.startsWith(path + "."))
        .length,
    [edits, path]
  )

  return (
    <div className="translation-section">
      <button
        className={`translation-section-header depth-${Math.min(depth, 3)}${editedCount > 0 ? " has-edits" : ""}`}
        onClick={() => toggleSection(path)}
      >
        <span className="section-arrow">{isCollapsed ? "▶" : "▼"}</span>
        <span className="section-label">{label}</span>
        <span className="translations-stats">
          <span className="stat-translated">{translatedCount} translated</span>
          {", "}
          <span className="stat-missing">{missingCount} missing</span>{" "}
          <span>
            ({((translatedCount / totalCount) * 100).toFixed(1)}% complete)
          </span>
        </span>
        {editedCount > 0 && (
          <span className="section-edit-badge">{editedCount} edited</span>
        )}
      </button>

      {!isCollapsed && (
        <div className="translation-section-content">
          {Object.entries(enObj).map(([key, value]) => {
            const childPath = `${path}.${key}`
            if (typeof value === "string") {
              return (
                <TranslationRow
                  key={childPath}
                  path={childPath}
                  leafKey={key}
                  enValue={value}
                  targetValue={getTargetValue(childPath)}
                  isEdited={childPath in edits}
                  onEdit={onEdit}
                  onRevert={onRevert}
                />
              )
            }

            const translatedCount = Object.keys(value).filter(
              (k) => getTargetValue(`${childPath}.${k}`) !== ""
            ).length
            const missingCount = Object.keys(value).filter(
              (k) => getTargetValue(`${childPath}.${k}`) === ""
            ).length
            const totalCount = Object.keys(value).length

            return (
              <TranslationSection
                key={childPath}
                path={childPath}
                label={key}
                enObj={value as TranslationNode}
                collapsedSections={collapsedSections}
                toggleSection={toggleSection}
                edits={edits}
                getTargetValue={getTargetValue}
                onEdit={onEdit}
                onRevert={onRevert}
                depth={depth + 1}
                translatedCount={translatedCount}
                missingCount={missingCount}
                totalCount={totalCount}
              />
            )
          })}
        </div>
      )}
    </div>
  )
})
