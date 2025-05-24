import React from "react"
import { useTranslation } from "react-i18next"
import { AvatarEmotions, Emotion } from "../../../../../types"
import { getEmotionCost } from "../../../../../types/Config"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import "./pokemon-emotion.css"

export default function PokemonEmotion(props: {
  index: string
  shiny: boolean
  unlocked: boolean | undefined
  selected: boolean | undefined
  path: string
  emotion: Emotion
  dust: number
  onClick: () => void
}) {
  const { t } = useTranslation()
  const cost = getEmotionCost(props.emotion, props.shiny)
  const canUnlock = !props.unlocked && cost <= props.dust

  return (
    <div
      className={cc("my-box", "clickable", "pokemon-emotion", {
        unlocked: !!props.unlocked,
        unlockable: canUnlock,
        selected: !!props.selected
      })}
      onClick={props.onClick}
    >
      <img src={getPortraitSrc(props.index, props.shiny, props.emotion)} />
      {AvatarEmotions.includes(props.emotion) && (
        <span className="shortcut">
          Ctrl+{AvatarEmotions.indexOf(props.emotion) + 1}
        </span>
      )}
      {props.unlocked ? (
        <p>{t(`emotion.${props.emotion}`)}</p>
      ) : (
        <p className="dust">
          <span>{cost}</span>
          <img src={getPortraitSrc(props.index)} />
        </p>
      )}
    </div>
  )
}
