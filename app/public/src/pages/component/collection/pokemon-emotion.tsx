import React from "react"
import { Emotion } from "../../../../../types"
import { useAppDispatch } from "../../../hooks"
import { buyEmotion, changeSelectedEmotion } from "../../../stores/NetworkStore"
import { getPortraitSrc } from "../../../utils"
import { getEmotionCost } from "../../../../../types/Config"
import { cc } from "../../utils/jsx"
import "./pokemon-emotion.css"
import { t } from "i18next"

export default function PokemonEmotion(props: {
  index: string
  shiny: boolean
  unlocked: boolean | undefined
  path: string
  emotion: Emotion
  dust: number
}) {
  const dispatch = useAppDispatch()
  const cost = getEmotionCost(props.emotion, props.shiny)
  const canUnlock = !props.unlocked && cost <= props.dust

  return (
    <div
      className={cc("nes-container", "pokemon-emotion", {
        unlocked: !!props.unlocked,
        unlockable: canUnlock,
        shimmer: canUnlock
      })}
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
      <img src={getPortraitSrc(props.index, props.shiny, props.emotion)} />
      {props.unlocked ? (
        <p>{t(`emotion.${props.emotion}`)}</p>
      ) : (
        <p>
          <span>{cost}</span>
          <img src={getPortraitSrc(props.index)} />
        </p>
      )}
    </div>
  )
}
