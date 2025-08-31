import React from "react"
import { useTranslation } from "react-i18next"
import { PkmColorVariants } from "../../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm } from "../../../../../types/enum/Pokemon"
import "./pokemon-typeahead.css"

export function PokemonTypeahead({
  onChange,
  value,
  options
}: {
  value: string
  options?: string[]
  onChange: (value: Pkm | "") => void
}) {
  const { t } = useTranslation()
  const pokemonOptions =
    options ||
    Object.values(Pkm)
      .filter((p) => {
        const pokemon = getPokemonData(p)
        return (
          (pokemon.skill !== Ability.DEFAULT ||
            pokemon.passive !== Passive.NONE) &&
          PkmColorVariants.includes(pokemon.name as Pkm) === false
        )
      })
      .sort((a, b) => t("pkm." + a).localeCompare(t("pkm." + b)))

  return (
    <select
      value={value}
      onChange={(e) => onChange((e.target?.value as Pkm) ?? "")}
      className="pokemon-typeahead"
    >
      <option value="" disabled>
        {t("search_pokemon")}
      </option>
      <option value="">{t("all")}</option>
      {pokemonOptions.map((p) => (
        <option key={p} value={p}>
          {t("pkm." + p)}
        </option>
      ))}
    </select>
  )
}
