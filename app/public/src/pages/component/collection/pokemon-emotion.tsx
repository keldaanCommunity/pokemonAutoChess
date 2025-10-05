import React from "react"
import { useTranslation } from "react-i18next"
import { AvatarEmotions, Emotion } from "../../../../../types"
import { getEmotionCost } from "../../../../../types/Config"
import { PkmByIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import PokemonPortrait from "../pokemon-portrait"
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
  const lastBoostersOpened = useAppSelector(
    (state) => state.lobby.lastBoostersOpened
  )
  const cost = getEmotionCost(props.emotion, props.shiny)
  const canUnlock = !props.unlocked && cost <= props.dust
  const isNew = lastBoostersOpened.some((booster) =>
    booster.some(
      (card) =>
        card.name === PkmByIndex[props.index] &&
        card.shiny === props.shiny &&
        card.emotion === props.emotion &&
        card.new
    )
  )

  return (
    <div
      className={cc("my-box", "clickable", "pokemon-emotion", {
        unlocked: !!props.unlocked,
        unlockable: canUnlock,
        selected: !!props.selected,
        new: isNew,
        shimmer: isNew
      })}
      onClick={props.onClick}
    >
      <PokemonPortrait portrait={props} />
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
