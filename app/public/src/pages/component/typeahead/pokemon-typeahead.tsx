import React from "react"
import { Typeahead } from "react-bootstrap-typeahead"

import { TypeaheadProps } from "./types"

import { useTranslation } from "react-i18next"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPokemonData } from "../../../../../models/precomputed"
import { Ability } from "../../../../../types/enum/Ability"
import "./pokemon-typeahead.css"
import { Passive } from "../../../../../types/enum/Passive"

export function PokemonTypeahead({ onChange, value }: TypeaheadProps<Pkm>) {
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
      placeholder={t("select_pokemon")}
      onChange={(option) => {
        const val = option[0] as Pkm
        onChange(val)
      }}
    />
  )
}
