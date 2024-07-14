import React, { memo, useState, useMemo, useCallback, ChangeEvent } from "react"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import { Rarity } from "../../../../../types/enum/Game"
import { RarityColor } from "../../../../../types/Config"
import { t } from "i18next"
import { WikiAllPokemons, WikiPokemon } from "./wiki-pokemons"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { getPortraitSrc } from "../../../utils"
import Credits from "./Credits"

export const WikiPanelPokemon = memo(() => {
  const [pokemon, setPokemon] = useState<Pkm>()
  const options = useMemo(() => [...Object.values<Rarity>(Rarity), "all"], [])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const view = options[optionIndex]

  const updateOption = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setOptionIndex(Number(e.currentTarget.value))
    setPokemon(undefined)
  }, [])

  return (
    <div className="wiki-panel-pokemon">
      <PokemonTypeahead value={pokemon} onChange={setPokemon} />
      <select
        onChange={updateOption}
        className="uppercase"
        style={{ color: RarityColor[Rarity[options[optionIndex]]] }}
      >
        {options.map((rarity, index) => {
          return (
            <option
              key={rarity}
              value={index}
              style={{ color: RarityColor[Rarity[rarity]] }}
              className="uppercase"
            >
              {rarity === "all" ? t("ALL") : t("rarity." + rarity)}
            </option>
          )
        })}
      </select>

      {!pokemon &&
        (view === "all" ? (
          <WikiAllPokemons />
        ) : (
          <WikiPokemon rarity={view as Rarity} onSelect={setPokemon} />
        ))}

      {pokemon && (
        <>
          <button onClick={() => setPokemon(undefined)}>{t("clear")}</button>
          <WikiPanelPokemonDetail pokemon={pokemon} />
        </>
      )}
    </div>
  )
})

export const WikiPanelPokemonDetail = memo(({ pokemon }: { pokemon: Pkm }) => {
  const data = useMemo(() => getPokemonData(pokemon), [pokemon])
  return (
    <div className="wiki-panel-pokemon-detail">
      <div className="wiki-panel-pokemon-detail-pokemon game-pokemon-detail-tooltip my-box">
        <GamePokemonDetail pokemon={pokemon} />
      </div>
      <dl className="wiki-panel-pokemon-detail-list">
        <dt>{t("index")}</dt>
        <dd className="pokemon-index">{data.index}</dd>
        <dt>{t("pool_label")}</dt>
        <dd>
          {t(
            `pool.${
              data.regional
                ? "regional"
                : data.additional
                ? "additional"
                : "regular"
            }`
          )}
        </dd>
        <dt>{t("evolution")}</dt>
        <dd>
          {!data.evolution ? (
            "No evolution"
          ) : (
            <>
              <img src={getPortraitSrc(PkmIndex[data.evolution])} />
              <span className="pokemon-name">{t(`pkm.${data.evolution}`)}</span>
            </>
          )}
        </dd>
        <dt>{t("portrait_credit")}</dt>
        <Credits for="portrait" index={data.index} />

        <dt>{t("sprite_credit")}</dt>
        <Credits for="sprite" index={data.index} />
      </dl>
    </div>
  )
})
