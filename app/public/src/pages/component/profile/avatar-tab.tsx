import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Pkm, PkmByIndex, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeAvatar } from "../../../stores/NetworkStore"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonPortrait from "../pokemon-portrait"

export function AvatarTab() {
  const { t } = useTranslation()
  const pokemonCollectionMap = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )

  const pokemonCollection = pokemonCollectionMap
    ? [...pokemonCollectionMap.values()]
    : []

  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")
  const nbUnlocked = pokemonCollection.length
  const nbTotal = Object.keys(PkmByIndex).length

  return (
    <div>
      <h3 style={{ display: "flex" }}>{t("change_avatar")} <div className="spacer"></div> {t("avatars_unlocked", { nbUnlocked, nbTotal })}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
        <PokemonTypeahead value={selectedPkm} onChange={setSelectedPkm} />
        {selectedPkm != "" && <button className="bubbly blue" onClick={() => setSelectedPkm("")}>
          {t("all")}
        </button>}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", margin: "0.5em 0" }}>
        {pokemonCollection.length === 0 && <p>{t("play_more_games_hint")}</p>}
        {selectedPkm
          ? <SelectedPokemonAvatars pokemon={selectedPkm} />
          : pokemonCollection.map((item) => {
            return (
              <PokemonPortrait
                key={`${item.id}`}
                className="clickable"
                onClick={() => { setSelectedPkm(PkmByIndex[item.id]) }}
                portrait={{ index: item.id }}
              />
            )
          })
        }
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

  const index = PkmIndex[props.pokemon]
  const pokemonCollectionItem = pokemonCollectionMap?.get(index)
  if (!pokemonCollectionItem || (pokemonCollectionItem.emotions.length === 0 && pokemonCollectionItem.shinyEmotions.length === 0)) return <p>{t("play_more_games_hint")}</p>

  return (
    ["normal", "shiny"].flatMap(
      (type) => pokemonCollectionItem[type === "shiny" ? "shinyEmotions" : "emotions"]
        .map((emotion) => {
          return (
            <PokemonPortrait
              key={`${type}-${index}${emotion}`}
              className="clickable"
              onClick={() => {
                dispatch(
                  changeAvatar({
                    index,
                    emotion,
                    shiny: type === "shiny"
                  })
                )
              }}
              portrait={{
                index,
                shiny: type === "shiny",
                emotion
              }}
            />
          )
        }))
  )
}
