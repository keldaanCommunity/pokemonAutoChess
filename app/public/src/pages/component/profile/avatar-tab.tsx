import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { precomputedPokemonsImplemented } from "../../../../../../gen/precomputed-pokemons"
import { Pkm, PkmByIndex, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getAvatarString } from "../../../../../utils/avatar"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeAvatar } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"

export function AvatarTab() {
  const { t } = useTranslation()
  const pokemonCollectionMap = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )

  const pokemonCollection = useMemo(() => pokemonCollectionMap
    ? [...pokemonCollectionMap.values()]
    : []
    , [pokemonCollectionMap])

  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")

  const unlocked = pokemonCollection.filter(
    (item) => item.emotions.length > 0 || item.shinyEmotions.length > 0
  )
  const nbUnlocked = unlocked.length
  const nbTotal = precomputedPokemonsImplemented.length

  return (
    <div>
      <h3 style={{ display: "flex" }}>
        {t("change_avatar")} <div className="spacer"></div>{" "}
        {t("avatars_unlocked", { count: nbUnlocked, total: nbTotal })}
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
        <PokemonTypeahead value={selectedPkm} onChange={setSelectedPkm} />
        {selectedPkm != "" && (
          <button className="bubbly blue" onClick={() => setSelectedPkm("")}>
            {t("all")}
          </button>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          margin: "0.5em 0",
          gap: selectedPkm ? "0.5em" : 0
        }}
      >
        {pokemonCollection.length === 0 && <p>{t("play_more_games_hint")}</p>}
        {selectedPkm ? (
          <SelectedPokemonAvatars pokemon={selectedPkm} />
        ) : (
          unlocked.map((item) => {
            return (
              <PokemonPortrait
                key={`${item.id}`}
                className="clickable"
                onClick={() => {
                  setSelectedPkm(PkmByIndex[item.id])
                }}
                portrait={{ index: item.id }}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

function SelectedPokemonAvatars(props: { pokemon: Pkm }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const pokemonCollectionMap = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )
  const currentAvatar = useAppSelector((state) => state.network.profile?.avatar)

  const index = PkmIndex[props.pokemon]
  const pokemonCollectionItem = pokemonCollectionMap?.get(index)

  if (
    !pokemonCollectionItem ||
    (pokemonCollectionItem.emotions.length === 0 &&
      pokemonCollectionItem.shinyEmotions.length === 0)
  )
    return <p>{t("play_more_games_hint")}</p>

  return ["normal", "shiny"].flatMap((type) =>
    pokemonCollectionItem[type === "shiny" ? "shinyEmotions" : "emotions"].map(
      (emotion) => {
        return (
          <div
            className={cc("my-box clickable pokemon-emotion unlocked", {
              selected:
                getAvatarString(index, type === "shiny", emotion) ===
                currentAvatar
            })}
            onClick={() => {
              dispatch(
                changeAvatar({
                  index,
                  emotion,
                  shiny: type === "shiny"
                })
              )
            }}
          >
            <PokemonPortrait
              key={`${type}-${index}${emotion}`}
              portrait={{
                index,
                shiny: type === "shiny",
                emotion
              }}
            />
            <p>{t(`emotion.${emotion}`)}</p>
          </div>
        )
      }
    )
  )
}
