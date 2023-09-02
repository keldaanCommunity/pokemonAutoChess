import React from "react"
import { Item } from "../../../../../types/enum/Item"
import { Pkm } from "../../../../../types/enum/Pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { PkmWithConfig, Emotion } from "../../../../../types"
import tracker from "../../../../dist/client/assets/pokemons/tracker.json"
import { ITracker } from "../../../../../types/ITracker"
import { useTranslation } from "react-i18next"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { ItemDetailTooltip } from "../../../game/components/item-detail"

export default function SelectedEntity(props: {
  entity: Item | PkmWithConfig
  onChange: (pkm: PkmWithConfig) => void
}) {
  const { t } = useTranslation()
  if (Object.keys(Item).includes(props.entity as Item)) {
    return (
      <div className="nes-container">
        <ItemDetailTooltip item={props.entity as Item} />
      </div>
    )
  } else if (
    Object.values(Pkm).includes((props.entity as PkmWithConfig).name)
  ) {
    const detailledPkm = props.entity as PkmWithConfig
    const pokemon = PokemonFactory.createPokemonFromName(detailledPkm.name, {
      selectedEmotion: detailledPkm.emotion,
      selectedShiny: detailledPkm.shiny
    })
    let pMetadata: ITracker | undefined = undefined

    const availableEmotions: Emotion[] = []
    const pathIndex = pokemon.index.split("-")
    if (pathIndex.length == 1) {
      pMetadata = tracker[pokemon.index]
    } else if (pathIndex.length == 2) {
      pMetadata = tracker[pathIndex[0]].subgroups[pathIndex[1]]
    }

    if (pMetadata) {
      Object.keys(pMetadata.portrait_files).forEach((k) => {
        const possibleEmotion = k as Emotion
        if (Object.values(Emotion).includes(possibleEmotion)) {
          availableEmotions.push(possibleEmotion)
        }
      })
    }
    return (
      <div id="selected-entity" className="nes-container">
        <fieldset>
          <label>
            <input
              type="checkbox"
              className="nes-checkbox is-dark"
              checked={detailledPkm.shiny}
              onChange={() => {
                props.onChange({
                  ...detailledPkm,
                  shiny: !detailledPkm.shiny
                })
              }}
            />
            <span>{t("shiny")}</span>
          </label>
          <label>
            {t("emotion_label")}:
            <select
              value={detailledPkm.emotion}
              onChange={(e) => {
                props.onChange({
                  ...detailledPkm,
                  emotion: e.target.value as Emotion
                })
              }}
            >
              {availableEmotions.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <GamePokemonDetail
          pokemon={PokemonFactory.createPokemonFromName(detailledPkm.name)}
          emotion={detailledPkm.emotion}
          shiny={detailledPkm.shiny}
        />
      </div>
    )
  } else {
    return null
  }
}
