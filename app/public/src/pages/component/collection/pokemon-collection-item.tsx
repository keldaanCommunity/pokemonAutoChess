import React, { Dispatch, SetStateAction } from "react"
import { ITracker } from "../../../../../types/ITracker"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"

const cursorStyle = {
  cursor: "var(--cursor-hover)",
  padding: "10px",
  backgroundColor: "#54596b",
  margin: "10px"
}

export default function PokemonCollectionItem(props: {
  name: Pkm
  index: string
  metadata: ITracker
  config: IPokemonConfig | undefined
  setPokemon: Dispatch<SetStateAction<Pkm | undefined>>
}) {
  if (
    !props.metadata ||
    Object.keys(props.metadata.portrait_files).length == 0
  ) {
    return null
  }

  return (
    <div
      style={cursorStyle}
      className="nes-container"
      onClick={() => {
        props.setPokemon(props.name)
      }}
    >
      <img
        style={{
          filter:
            props.config &&
            (props.config.emotions.length != 0 ||
              props.config.shinyEmotions.length != 0)
              ? "grayscale(0)"
              : "grayscale(1)",
          width: "80px",
          height: "80px",
          imageRendering: "pixelated"
        }}
        src={getPortraitSrc(
          props.index,
          props.config?.selectedShiny,
          props.config?.selectedEmotion
        )}
      />
      <div
        style={{
          display: "flex",
          marginTop: "5px",
          marginBottom: "-10px",
          justifyContent: "center"
        }}
      >
        {props.config ? props.config.dust : 0}
        <img
          style={{ width: "20px", height: "20px", imageRendering: "pixelated" }}
          src={getPortraitSrc(props.index)}
        />
      </div>
    </div>
  )
}
