import React from "react"
import { Emotion, EmotionCost } from "../../../../../types"
import ReactTooltip from "react-tooltip"
import { useAppDispatch } from "../../../hooks"
import { buyEmotion, changeSelectedEmotion } from "../../../stores/NetworkStore"
import { getPortraitSrc } from "../../../utils"

const cursorStyle = {
  padding: "10px",
  display: "flex",
  flexFlow: "column",
  margin: "10px",
  cursor: "var(--cursor-hover)"
}

export default function PokemonEmotion(props: {
  index: string
  shiny: boolean
  unlocked: boolean | undefined
  path: string
  emotion: Emotion
}) {
  const dispatch = useAppDispatch()
  const cost = props.shiny
    ? EmotionCost[props.emotion] * 3
    : EmotionCost[props.emotion]
  const price = props.unlocked ? null : (
    <div
      style={{
        display: "flex",
        marginTop: "5px",
        marginBottom: "-10px",
        justifyContent: "center",
        height: "25px"
      }}
    >
      <p>{cost}</p>
      <img
        style={{ width: "20px", height: "20px", imageRendering: "pixelated" }}
        src={getPortraitSrc(props.index)}
      />
    </div>
  )

  return (
    <div
      className="nes-container"
      style={cursorStyle}
      data-tip
      data-for={`${props.path}-${props.emotion}`}
      onClick={() => {
        if (props.unlocked) {
          dispatch(
            changeSelectedEmotion({
              index: props.index,
              emotion: props.emotion,
              shiny: props.shiny
            })
          )
        } else {
          dispatch(
            buyEmotion({
              index: props.index,
              emotion: props.emotion,
              shiny: props.shiny
            })
          )
        }
      }}
    >
      <img
        src={getPortraitSrc(props.index, props.shiny, props.emotion)}
        style={{
          filter: props.unlocked ? "grayscale(0)" : "grayscale(1)",
          width: "80px",
          height: "80px",
          imageRendering: "pixelated"
        }}
      />
      {price}
      <ReactTooltip
        id={`${props.path}-${props.emotion}`}
        textColor="#000000"
        className="customeTheme"
        effect="solid"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              width: "80px",
              height: "80px",
              imageRendering: "pixelated"
            }}
            src={getPortraitSrc(props.index, props.shiny, props.emotion)}
          ></img>
          <p>
            {props.unlocked
              ? `Click to select the ${props.emotion} emotion for you pokemon`
              : `Click to unlock the ${props.emotion} emotion for you pokemon`}
          </p>
        </div>
      </ReactTooltip>
    </div>
  )
}
