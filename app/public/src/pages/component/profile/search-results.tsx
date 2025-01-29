import React from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { searchById } from "../../../stores/NetworkStore"
import { getAvatarSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"

export default function SearchResults() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const suggestions = useAppSelector((state) => state.lobby.suggestions)
  console.log({ suggestions })

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
            <img
              src={getAvatarSrc(suggestion.avatar)}
              className="pokemon-portrait"
            />
            <span>{suggestion.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
