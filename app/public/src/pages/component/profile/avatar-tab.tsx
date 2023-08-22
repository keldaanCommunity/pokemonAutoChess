import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeAvatar } from "../../../stores/NetworkStore"
import { getPortraitSrc } from "../../../utils"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"

export function AvatarTab() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )
  const [selectedPkm, setSelectedPkm] = useState<string>("")

  return (
    <div>
      <h3>{t("change_avatar")}</h3>
      <PokemonTypeahead value={selectedPkm} onChange={setSelectedPkm} />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {pokemonCollection.length === 0 && <p>{t("play_more_games_hint")}</p>}
        {["normal", "shiny"].flatMap((type) =>
          pokemonCollection
            .filter(
              (pokemonConfig) =>
                !selectedPkm || pokemonConfig.id === PkmIndex[selectedPkm]
            )
            .map((pokemonConfig) => {
              return (
                type === "shiny"
                  ? pokemonConfig.shinyEmotions
                  : pokemonConfig.emotions
              ).map((emotion) => {
                return (
                  <img
                    key={`${type}-${pokemonConfig.id}${emotion}`}
                    className="clickable pokemon-portrait"
                    onClick={() => {
                      dispatch(
                        changeAvatar({
                          index: pokemonConfig.id,
                          emotion: emotion,
                          shiny: type === "shiny"
                        })
                      )
                    }}
                    src={getPortraitSrc(
                      pokemonConfig.id,
                      type === "shiny",
                      emotion
                    )}
                  ></img>
                )
              })
            })
        )}
      </div>
    </div>
  )
}
