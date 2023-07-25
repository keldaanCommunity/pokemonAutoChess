import React, { useState } from "react"
import { Item } from "../../../../../types/enum/Item"
import { ItemDescription, ItemName } from "../../../../../types/strings/Item"
import { Pkm } from "../../../../../types/enum/Pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { RarityColor } from "../../../../../types/Config"
import CSS from "csstype"
import { getPortraitSrc } from "../../../utils"
import { DetailledPkm, Emotion } from "../../../../../types"
import tracker from "../../../../dist/client/assets/pokemons/tracker.json"
import { ITracker } from "../../../../../types/ITracker"
import SynergyIcon from "../icons/synergy-icon"
import { AbilityTooltip } from "../ability/ability-tooltip"
import { addIconsToDescription } from "../../utils/descriptions"
import { t } from "i18next"

const entityStyle: CSS.Properties = {
  position: "absolute",
  right: "0px",
  top: "8.5%",
  margin: "10px",
  marginTop: "0px",
  width: "20%"
}

const imgStyle: CSS.Properties = {
  height: "80px",
  width: "80px",
  imageRendering: "pixelated"
}

export default function SelectedEntity(props: {
  entity: Item | DetailledPkm
  selectEntity: React.Dispatch<React.SetStateAction<DetailledPkm | Item>>
}) {
  const [metadata, setMetadata] = useState<{ [key: string]: ITracker }>(
    tracker as unknown as { [key: string]: ITracker }
  )
  if (Object.keys(Item).includes(props.entity as Item)) {
    return (
      <div className="nes-container" style={entityStyle}>
        <div style={{ display: "flex" }}>
          <img style={imgStyle} src={"assets/item/" + props.entity + ".png"} />
          <h3>{ItemName[props.entity as Item]}</h3>
        </div>
        <p>{addIconsToDescription(ItemDescription[props.entity as Item])}</p>
      </div>
    )
  } else if (Object.values(Pkm).includes((props.entity as DetailledPkm).pkm)) {
    const detailledPkm = props.entity as DetailledPkm
    const pokemon = PokemonFactory.createPokemonFromName(detailledPkm.pkm, {
      selectedEmotion: detailledPkm.emotion,
      selectedShiny: detailledPkm.shiny
    })
    let pMetadata: ITracker | undefined = undefined

    const availableEmotions: Emotion[] = []
    const pathIndex = pokemon.index.split("-")
    if (pathIndex.length == 1) {
      pMetadata = metadata[pokemon.index]
    } else if (pathIndex.length == 2) {
      pMetadata = metadata[pathIndex[0]].subgroups[pathIndex[1]]
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
      <div className="nes-container" style={entityStyle}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h3>Shiny:</h3>
            <input
              type="checkbox"
              checked={detailledPkm.shiny}
              onChange={(e) => {
                props.selectEntity({
                  pkm: detailledPkm.pkm,
                  shiny: !detailledPkm.shiny,
                  emotion: detailledPkm.emotion
                })
              }}
            />
            <h3>{detailledPkm.shiny ? "Yes" : "No"}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
            <h3>Emotion: </h3>
            <select
              value={detailledPkm.emotion}
              onChange={(e) => {
                props.selectEntity({
                  pkm: detailledPkm.pkm,
                  shiny: detailledPkm.shiny,
                  emotion: e.target.value as Emotion
                })
              }}
            >
              {availableEmotions.map((e) => (
                <option value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "start"
          }}
        >
          <div style={{ display: "flex" }}>
            <img
              style={imgStyle}
              src={getPortraitSrc(
                pokemon.index,
                detailledPkm.shiny,
                detailledPkm.emotion
              )}
            />
            <h3>{pokemon.name}</h3>
          </div>
          <p style={{ color: RarityColor[pokemon.rarity] }}>{pokemon.rarity}</p>
          <div>
            {pokemon.types.map((type) => {
              return <SynergyIcon type={type} key={"img" + type} />
            })}
          </div>
          <p>Health: {pokemon.hp}</p>
          <p>Attack: {pokemon.atk}</p>
          <p>Defense: {pokemon.def}</p>
          <p>Special Defense: {pokemon.speDef}</p>
          <p>Range: {pokemon.range}</p>
          <p>Mana: {pokemon.maxMana}</p>
          <p>Abilty: {t(`ability.${pokemon.skill}`)}</p>
          <AbilityTooltip ability={pokemon.skill} />
        </div>
      </div>
    )
  } else {
    return null
  }
}
