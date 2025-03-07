import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeAvatar } from "../../../stores/NetworkStore"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import PokemonPortrait from "../pokemon-portrait"

export function AvatarTab() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const pokemonCollectionMap = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )

  const pokemonCollection = pokemonCollectionMap
    ? [...pokemonCollectionMap.values()]
    : []
  const [selectedPkm, setSelectedPkm] = useState<Pkm | "">("")

  return (
    <div>
      <h3>{t("change_avatar")}</h3>
      <PokemonTypeahead value={selectedPkm} onChange={setSelectedPkm} />
      <div style={{ display: "flex", flexWrap: "wrap", margin: "0.5em 0" }}>
        {pokemonCollection.length === 0 && <p>{t("play_more_games_hint")}</p>}
        {["normal", "shiny"].flatMap((type) =>
          pokemonCollection
            .filter((p) => !selectedPkm || p.id === PkmIndex[selectedPkm])
            .map((p) => {
              return (
                type === "shiny"
                  ? p.shinyEmotions
                  : p.emotions
              ).map((emotion) => {
                return (
                  <PokemonPortrait
                    key={`${type}-${p.id}${emotion}`}
                    className="clickable"
                    onClick={() => {
                      dispatch(
                        changeAvatar({
                          index: p.id,
                          emotion: emotion,
                          shiny: type === "shiny"
                        })
                      )
                    }}
                    portrait={{
                      index: p.id,
                      shiny: type === "shiny",
                      emotion
                    }}
                  />
                )
              })
            })
        )}
      </div>
    </div>
  )
}
