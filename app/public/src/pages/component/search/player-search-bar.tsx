import firebase from "firebase/compat/app"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { ISuggestionUser } from "../../../../../types"
import { debounce } from "../../../../../utils/function"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import "./player-search-bar.css"

export function PlayerSearchBar(props: {
  onSelect: (user: ISuggestionUser) => void
}) {
  const { t } = useTranslation()
  const [suggestions, setSuggestions] = useState<ISuggestionUser[]>([])

  const elementRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const abortControllerRef = useRef<AbortController | null>(null)

  async function searchName(query: string) {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    setLoading(true)
    setError("")
    try {
      const token = await firebase.auth().currentUser?.getIdToken()
      const res = await fetch(`/players?name=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        signal
      })
      if (res.ok) {
        const suggestions = await res.json()
        if (suggestions.length === 0) {
          setError(t("no_results_found"))
        } else {
          setSuggestions(suggestions)
          setError("")
        }
      } else {
        setError(res.statusText)
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message)
      }
    }
    setLoading(false)
  }

  const debouncedSearchName = useRef(debounce(searchName, 500)).current

  function onSearchQueryChange(query: string) {
    abortControllerRef.current?.abort()
    if (query) {
      debouncedSearchName(query)
    } else {
      setSuggestions([])
      setError("")
    }
  }

  function onSelect(val) {
    props.onSelect(val)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ["ArrowUp", "ArrowDown"].includes(e.key) &&
      document.activeElement &&
      elementRef.current &&
      elementRef.current.contains(document.activeElement)
    ) {
      e.preventDefault()
      const focusableElements = Array.from(
        elementRef.current.querySelectorAll("input, .search-suggestions li")
      )
      const currEltIndex = focusableElements.findIndex(
        (e) => e === document.activeElement
      )

      if (e.key === "ArrowUp") {
        const prevEl = focusableElements[currEltIndex - 1]
        if (prevEl instanceof HTMLElement) prevEl?.focus()
      } else if (e.key === "ArrowDown") {
        const nextEl = focusableElements[currEltIndex + 1]
        if (nextEl instanceof HTMLElement) nextEl?.focus()
      }
    }
  }

  return (
    <div
      className="player-search-bar"
      onKeyDown={handleKeyDown}
      ref={elementRef}
    >
      <SearchBar onChange={onSearchQueryChange} />
      <PlayerSearchResults
        suggestions={suggestions}
        loading={loading}
        error={error}
        onSelect={onSelect}
      />
    </div>
  )
}

function SearchBar({ onChange }) {
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

export function PlayerSearchResults(props: {
  suggestions: ISuggestionUser[]
  loading: boolean
  error?: string | null
  onSelect: (user: ISuggestionUser) => void
}) {
  const { t } = useTranslation()
  const { suggestions, onSelect, loading, error } = props
  if (!loading && !error && suggestions.length === 0) return null

  return (
    <div className="player-search-results">
      {loading ? (
        <p className="loading">{t("loading")}</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="search-suggestions">
          {suggestions.map((suggestion) => (
            <li
              className={cc("clickable", {
                banned: suggestion.banned === true
              })}
              key={suggestion.id}
              onClick={() => onSelect(suggestion)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") onSelect(suggestion)
              }}
              tabIndex={0}
            >
              <PokemonPortrait avatar={suggestion.avatar} />
              <span>{suggestion.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
