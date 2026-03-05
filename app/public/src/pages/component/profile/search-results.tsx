import React from "react"
import { ISuggestionUser } from "../../../../../types"
import { searchById } from "../../../network"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"

export default function SearchResults(props: {
  suggestions: ISuggestionUser[]
  onSelect?: (user: ISuggestionUser) => void
}) {
  const { suggestions, onSelect } = props
  return (
    <div>
      <ul className="search-suggestions">
        {suggestions.map((suggestion) => (
          <li
            className={cc("player my-box clickable", {
              banned: suggestion.banned === true
            })}
            key={suggestion.id}
            onClick={() =>
              onSelect ? onSelect(suggestion) : searchById(suggestion.id)
            }
          >
            <PokemonPortrait avatar={suggestion.avatar} />
            <span>{suggestion.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
