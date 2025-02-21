import React from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { searchById } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"

export default function SearchResults() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const suggestions = useAppSelector((state) => state.lobby.suggestions)

  return (
    <div>
      <ul className="search-suggestions">
        {suggestions.map((suggestion) => (
          <li
            className={cc("player my-box clickable", { banned: suggestion.banned === true })}
            key={suggestion.id}
            onClick={(e) => {
              dispatch(searchById(suggestion.id))
            }}
          >
            <PokemonPortrait avatar={suggestion.avatar} />
            <span>{suggestion.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
