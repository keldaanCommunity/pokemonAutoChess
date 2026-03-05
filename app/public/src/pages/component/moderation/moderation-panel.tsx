import firebase from "firebase/compat/app"
import React, { useCallback, useRef, useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { USERNAME_REGEXP } from "../../../../../config"
import { IChatV2, ISuggestionUser } from "../../../../../types"
import { debounce } from "../../../../../utils/function"
import { renameAccount, searchById, searchMessages } from "../../../network"
import ChatHistory from "../chat/chat-history"
import SearchResults from "../profile/search-results"
import "./moderation-panel.css"

export default function ModerationPanel() {
  return (
    <div className="moderation-panel">
      <Tabs>
        <TabList>
          <Tab>Search by user ID</Tab>
          <Tab>Search by message content</Tab>
          <Tab>Rename accounts</Tab>
        </TabList>

        <TabPanel>
          <SearchByUserId />
        </TabPanel>
        <TabPanel>
          <SearchByMessageContent />
        </TabPanel>
        <TabPanel>
          <RenameAccounts />
        </TabPanel>
      </Tabs>
    </div>
  )
}

function SearchByMessageContent() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<IChatV2[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim()
    if (trimmed.length < 2) return
    setLoading(true)
    setError(null)
    try {
      const messages = await searchMessages(trimmed)
      setResults([...messages])
    } catch (e: any) {
      setError(e?.message ?? "Search failed")
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="moderation-search moderation-chat-search">
      <p>
        Searching messages in content is performance-intensive. Use it in
        moderation (pun intended).
      </p>
      <div className="moderation-search-bar">
        <input
          ref={inputRef}
          type="text"
          className="moderation-search-input"
          placeholder="Search message content (min 2 chars)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bubbly blue"
          disabled={query.trim().length < 2 || loading}
          onClick={handleSearch}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <p className="moderation-error">{error}</p>}

      {results !== null && (
        <div className="moderation-results">
          {results.length === 0 ? (
            <p className="moderation-no-results">No messages found.</p>
          ) : (
            <>
              <p className="moderation-result-count">
                {results.length} message{results.length !== 1 ? "s" : ""} found
                {results.length === 50 ? " (showing latest 50)" : ""}
              </p>
              <ChatHistory messages={results} source="lobby" />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function RenameAccounts() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<ISuggestionUser[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const [selected, setSelected] = useState<ISuggestionUser | null>(null)
  const [newName, setNewName] = useState("")
  const [renaming, setRenaming] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)
  const [renameSuccess, setRenameSuccess] = useState<string | null>(null)

  async function fetchSuggestions(q: string) {
    abortRef.current = new AbortController()
    setSearchLoading(true)
    setSearchError(null)
    try {
      const token = await firebase.auth().currentUser?.getIdToken()
      const res = await fetch(`/players?name=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortRef.current.signal
      })
      if (!res.ok) throw new Error(res.statusText)
      setSuggestions(await res.json())
    } catch (e: any) {
      if (e?.name !== "AbortError")
        setSearchError(e?.message ?? "Search failed")
    } finally {
      setSearchLoading(false)
    }
  }

  const debouncedFetch = useRef(debounce(fetchSuggestions, 400)).current

  function onQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    setSelected(null)
    setNewName("")
    setRenameError(null)
    setRenameSuccess(null)
    abortRef.current?.abort()
    if (q.trim().length >= 2) {
      debouncedFetch(q.trim())
    } else {
      setSuggestions([])
    }
  }

  function selectUser(user: ISuggestionUser) {
    setSelected(user)
    setSuggestions([])
    setQuery(user.name)
    setNewName("")
    setRenameError(null)
    setRenameSuccess(null)
  }

  async function handleRename() {
    if (!selected) return
    const trimmed = newName.trim()
    if (!USERNAME_REGEXP.test(trimmed)) {
      setRenameError("Invalid name: 3-24 characters, letters/digits/._- only")
      return
    }
    setRenaming(true)
    setRenameError(null)
    setRenameSuccess(null)
    try {
      const { displayName } = await renameAccount(selected.id, trimmed)
      setRenameSuccess(`Account renamed to "${displayName}" successfully.`)
      setSelected({ ...selected, name: displayName })
      setNewName("")
    } catch (e: any) {
      setRenameError(e?.message ?? "Rename failed")
    } finally {
      setRenaming(false)
    }
  }

  const isValidNewName = USERNAME_REGEXP.test(newName.trim())

  return (
    <div className="moderation-search moderation-rename">
      <div className="moderation-search-bar">
        <input
          type="text"
          className="moderation-search-input"
          placeholder="Search username…"
          value={query}
          onChange={onQueryChange}
        />
        {searchLoading && <span className="moderation-hint">Searching…</span>}
      </div>

      {searchError && <p className="moderation-error">{searchError}</p>}

      {suggestions.length > 0 && (
        <div className="moderation-results">
          <SearchResults suggestions={suggestions} onSelect={selectUser} />
        </div>
      )}

      {selected && (
        <div className="moderation-rename-form">
          <p className="moderation-hint">
            Renaming <strong>{selected.name}</strong>
            <span className="moderation-uid"> ({selected.id})</span>
          </p>
          <div className="moderation-search-bar">
            <input
              type="text"
              className="moderation-search-input"
              placeholder="New username…"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value)
                setRenameError(null)
                setRenameSuccess(null)
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && isValidNewName && handleRename()
              }
            />
            <button
              className="bubbly blue"
              disabled={!isValidNewName || renaming}
              onClick={handleRename}
            >
              {renaming ? "Renaming…" : "Rename"}
            </button>
          </div>
          {renameError && <p className="moderation-error">{renameError}</p>}
          {renameSuccess && (
            <p className="moderation-success">{renameSuccess}</p>
          )}
        </div>
      )}
    </div>
  )
}

function SearchByUserId() {
  const [uid, setUid] = useState("")

  function handleSearch() {
    const trimmed = uid.trim()
    if (!trimmed) return
    searchById(trimmed)
  }

  return (
    <div className="moderation-search">
      <div className="moderation-search-bar">
        <input
          type="text"
          className="moderation-search-input"
          placeholder="User ID…"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bubbly blue"
          disabled={uid.trim().length === 0}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  )
}
