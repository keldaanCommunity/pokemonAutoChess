import React from "react"
import { Typeahead } from "react-bootstrap-typeahead"
import { useTranslation } from "react-i18next"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import "./pokemon-typeahead.css"

export function PokemonTypeahead({
  onChange,
  value
}: { value: string; onChange: (value: Pkm | "") => void }) {
  const pokemonOptions = Object.values(Pkm).filter((p) => {
    const pokemon = getPokemonData(p)
    return pokemon.skill !== Ability.DEFAULT || pokemon.passive !== Passive.NONE
  })
  const { t } = useTranslation()

  return (
    <Typeahead
      id="pokemon-typeahead"
      className="pokemon-typeahead"
      defaultInputValue={value}
      options={pokemonOptions}
      placeholder={t("search_pokemon")}
      onChange={(option) => {
        const val = (option.length ? option[0] : "") as Pkm
        console.log("onChange", val)
        onChange(val)
      }}
    />
  )
}
