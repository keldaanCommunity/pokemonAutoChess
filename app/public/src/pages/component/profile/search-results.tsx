import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { searchById } from "../../../stores/NetworkStore"
import { getAvatarSrc } from "../../../utils"
import { useTranslation } from "react-i18next"

export default function SearchResults() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const suggestions = useAppSelector((state) => state.lobby.suggestions)

  return (
    <div>
      <ul className="search-suggestions">
        {suggestions.map((suggestion) => (
          <li
            className="player-box clickable"
            key={suggestion.id}
            onClick={(e) => {
              dispatch(searchById(suggestion.id))
            }}
          >
            <img
              src={getAvatarSrc(suggestion.avatar)}
              className="pokemon-portrait"
            />
            <p>{suggestion.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
