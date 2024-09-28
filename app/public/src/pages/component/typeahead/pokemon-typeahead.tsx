import React from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import "./pokemon-typeahead.css"

export function PokemonTypeahead({
  onChange,
  value
}: { value: string; onChange: (value: Pkm | "") => void }) {
  const { t } = useTranslation()
  const pokemonOptions = Object.values(Pkm).filter((p) => {
    const pokemon = getPokemonData(p)
    return pokemon.skill !== Ability.DEFAULT || pokemon.passive !== Passive.NONE
  }).sort((a, b) => t("pkm." + a).localeCompare(t("pkm." + b)))

  return (
    <select value={value} onChange={(e) => onChange((e.target?.value as Pkm) ?? "")} className="pokemon-typeahead">
      <option value="" disabled>{t("search_pokemon")}</option>
      <option value="">{t("all")}</option>
      {pokemonOptions.map((p) => (
        <option key={p} value={p}>{t("pkm." + p)}</option>
      ))}
    </select>

  )
}
