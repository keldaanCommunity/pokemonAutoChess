import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Language } from "../../../types/enum/Language"
import { LanguageNames } from "../../dist/client/locales"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { PRModal, submitTranslationPR } from "./component/translations/pr-modal"
import { TranslationRow } from "./component/translations/translation-row"
import { TranslationSection } from "./component/translations/translation-section"
import { TranslationToolbar } from "./component/translations/translation-toolbar"
import type {
  TranslationMap,
  TranslationNode
} from "./component/translations/types"
import {
  applyEditsToObject,
  getNestedValue
} from "./component/translations/types"
import { LocalStoreKeys, localStore } from "./utils/store"
import "./translations.css"

function storageKey(lang: Language) {
  return `${LocalStoreKeys.TRANSLATION_EDITS}:${lang}`
}

function loadEdits(lang: Language): Record<string, string> {
  return localStore.get(storageKey(lang) as LocalStoreKeys) ?? {}
}

function saveEdits(lang: Language, edits: Record<string, string>) {
  if (Object.keys(edits).length === 0) {
    localStore.delete(storageKey(lang) as LocalStoreKeys)
  } else {
    localStore.set(storageKey(lang) as LocalStoreKeys, edits)
  }
}

function clearEdits(lang: Language) {
  localStore.delete(storageKey(lang) as LocalStoreKeys)
}

export default function TranslationsPage() {
  const navigate = useNavigate()

  const [targetLang, setTargetLang] = useState<Language>(Language.fr)
  const [enData, setEnData] = useState<TranslationMap | null>(null)
  const [targetData, setTargetData] = useState<TranslationMap | null>(null)
  const [loading, setLoading] = useState(true)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [search, setSearch] = useState("")
  const [filterMode, setFilterMode] = useState<
    "all" | "missing" | "translated" | "edited"
  >("all")
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  )
  const [prModalOpen, setPrModalOpen] = useState(false)
  const [prSubmitting, setPrSubmitting] = useState(false)
  const [prProgress, setPrProgress] = useState("")
  const [prError, setPrError] = useState("")
  const [prUrl, setPrUrl] = useState("")

  // Load English once
  useEffect(() => {
    const githubUrl =
      "https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/refs/heads/master/app/public/dist/client/locales/en/translation.json"
    fetch(githubUrl)
      .catch(() => fetch("locales/en/translation.json"))
      .then((r) => r.json())
      .then((data: TranslationMap) => {
        setEnData(data)
        const sections = Object.entries(data)
          .filter(([, v]) => typeof v === "object")
          .map(([k]) => k)
        setCollapsedSections(new Set(sections))
      })
  }, [])

  // Reload target language and restore any saved edits
  useEffect(() => {
    setLoading(true)
    setEdits(loadEdits(targetLang))
    const githubUrl = `https://raw.githubusercontent.com/keldaanCommunity/pokemonAutoChess/refs/heads/master/app/public/dist/client/locales/${targetLang}/translation.json`
    fetch(githubUrl)
      .catch(() => fetch(`locales/${targetLang}/translation.json`))
      .then((r) => r.json())
      .then((data: TranslationMap) => {
        setTargetData(data)
        setLoading(false)
      })
      .catch(() => {
        setTargetData({})
        setLoading(false)
      })
  }, [targetLang])

  const getTargetValue = useCallback(
    (path: string) => {
      if (path in edits) return edits[path]
      if (!targetData) return ""
      return getNestedValue(targetData, path)
    },
    [edits, targetData]
  )

  const onEdit = useCallback(
    (path: string, value: string) => {
      setEdits((prev) => {
        const next = { ...prev, [path]: value }
        saveEdits(targetLang, next)
        return next
      })
    },
    [targetLang]
  )

  const onRevert = useCallback(
    (path: string) => {
      setEdits((prev) => {
        const next = { ...prev }
        delete next[path]
        saveEdits(targetLang, next)
        return next
      })
    },
    [targetLang]
  )

  const allLeaves = useMemo<
    Array<{ path: string; leafKey: string; enValue: string }>
  >(() => {
    if (!enData) return []
    const results: Array<{ path: string; leafKey: string; enValue: string }> =
      []
    const walk = (obj: TranslationNode, prefix: string) => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key
        if (typeof value === "string") {
          results.push({ path, leafKey: key, enValue: value })
        } else {
          walk(value as TranslationNode, path)
        }
      }
    }
    walk(enData as TranslationNode, "")
    return results
  }, [enData])

  const filteredLeaves = useMemo(() => {
    const q = search.trim().toLowerCase()
    const needsFlat = q !== "" || filterMode !== "all"
    if (!needsFlat) return null
    return allLeaves.filter(({ path, enValue }) => {
      const targetVal = getTargetValue(path)
      if (filterMode === "missing" && targetVal !== "" && !(path in edits))
        return false
      if (filterMode === "translated" && targetVal === "") return false
      if (filterMode === "edited" && !(path in edits)) return false
      if (q) {
        return (
          path.toLowerCase().includes(q) ||
          enValue.toLowerCase().includes(q) ||
          targetVal.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, filterMode, allLeaves, getTargetValue, edits])

  const toggleSection = useCallback((path: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  const expandAll = useCallback(() => setCollapsedSections(new Set()), [])

  const collapseAll = useCallback(() => {
    if (!enData) return
    const collect = (obj: TranslationNode, prefix: string): string[] =>
      Object.entries(obj).flatMap(([k, v]) => {
        const p = prefix ? `${prefix}.${k}` : k
        if (typeof v === "object")
          return [p, ...collect(v as TranslationNode, p)]
        return []
      })
    setCollapsedSections(new Set(collect(enData as TranslationNode, "")))
  }, [enData])

  const editedCount = Object.keys(edits).length

  const translatedCount = useMemo(
    () => allLeaves.filter(({ path }) => getTargetValue(path) !== "").length,
    [allLeaves, getTargetValue]
  )

  const openPrModal = useCallback(() => {
    setPrProgress("")
    setPrError("")
    setPrUrl("")
    setPrModalOpen(true)
  }, [])

  const handleSubmitPR = useCallback(
    async (token: string) => {
      if (!targetData) return
      const merged = applyEditsToObject(targetData, edits)
      const content = JSON.stringify(merged, null, "\t")
      setPrSubmitting(true)
      setPrError("")
      try {
        const url = await submitTranslationPR(
          token,
          targetLang,
          LanguageNames[targetLang],
          content,
          setPrProgress
        )
        clearEdits(targetLang)
        setPrUrl(url)
      } catch (e: unknown) {
        setPrError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        setPrSubmitting(false)
      }
    },
    [targetData, edits, targetLang]
  )

  const handleDownload = useCallback(() => {
    if (!targetData) return
    const merged = applyEditsToObject(targetData, edits)
    const blob = new Blob([JSON.stringify(merged, null, "\t")], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `translation.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [targetData, edits])

  const handleReset = useCallback(() => {
    if (editedCount > 0 && !window.confirm("Discard all edits?")) return
    clearEdits(targetLang)
    setEdits({})
  }, [editedCount, targetLang])

  const isReady = enData !== null && targetData !== null && !loading

  return (
    <>
      <div className="translations-page">
        <MainSidebar
          page="main_lobby"
          leave={() => navigate("/lobby")}
          leaveLabel="Back to lobby"
        />
        <div className="translations-container">
          <TranslationToolbar
            targetLang={targetLang}
            filterMode={filterMode}
            search={search}
            translatedCount={translatedCount}
            totalCount={allLeaves.length}
            editedCount={editedCount}
            onLangChange={setTargetLang}
            onFilterChange={setFilterMode}
            onSearch={setSearch}
            onCollapseAll={collapseAll}
            onExpandAll={expandAll}
          />

          <div className="translations-column-headers my-box">
            <span className="col-key">Key</span>
            <span className="col-en">English</span>
            <span className="col-target">{LanguageNames[targetLang]}</span>
          </div>

          <div className="translations-list my-box">
            {!isReady ? (
              <p className="translations-loading">Loading…</p>
            ) : filteredLeaves !== null ? (
              filteredLeaves.length === 0 ? (
                <p className="translations-loading">No results</p>
              ) : (
                filteredLeaves.map(({ path, enValue }) => (
                  <TranslationRow
                    key={path}
                    path={path}
                    leafKey={path}
                    enValue={enValue}
                    targetValue={getTargetValue(path)}
                    isEdited={path in edits}
                    onEdit={onEdit}
                    onRevert={onRevert}
                  />
                ))
              )
            ) : (
              enData &&
              targetData &&
              Object.entries(enData).map(([key, value]) => {
                if (typeof value === "string") {
                  return (
                    <TranslationRow
                      key={key}
                      path={key}
                      leafKey={key}
                      enValue={value}
                      targetValue={getTargetValue(key)}
                      isEdited={key in edits}
                      onEdit={onEdit}
                      onRevert={onRevert}
                    />
                  )
                }
                return (
                  <TranslationSection
                    key={key}
                    path={key}
                    label={key}
                    enObj={value as TranslationNode}
                    collapsedSections={collapsedSections}
                    toggleSection={toggleSection}
                    edits={edits}
                    getTargetValue={getTargetValue}
                    onEdit={onEdit}
                    onRevert={onRevert}
                    depth={0}
                  />
                )
              })
            )}
          </div>

          <div className="translations-footer my-box">
            <span className="edited-count">
              {editedCount === 0
                ? "No fields edited"
                : `${editedCount} field${editedCount === 1 ? "" : "s"} edited`}
            </span>
            <div className="flex-spacer" />
            {editedCount > 0 && (
              <>
                <button className="bubbly red" onClick={handleReset}>
                  Reset all
                </button>
                <div className="spacer"></div>
                <button className="bubbly blue" onClick={handleDownload}>
                  Download {LanguageNames[targetLang]} JSON
                </button>
                <button className="bubbly green" onClick={openPrModal}>
                  Submit Pull Request
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {prModalOpen && (
        <PRModal
          lang={targetLang}
          langName={LanguageNames[targetLang]}
          onClose={() => setPrModalOpen(false)}
          onSubmit={handleSubmitPR}
          progress={prProgress}
          error={prError}
          prUrl={prUrl}
          submitting={prSubmitting}
        />
      )}
    </>
  )
}
