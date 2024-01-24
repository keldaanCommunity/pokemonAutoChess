import { GameObjects } from "phaser"
import React from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../models/precomputed"
import { IPlayer } from "../../../../types"
import { Emotion } from "../../../../types/enum/Emotion"
import { throttle } from "../../../../utils/function"
import { logger } from "../../../../utils/logger"
import { cc } from "../../pages/utils/jsx"
import store from "../../stores"
import { toggleAnimation } from "../../stores/NetworkStore"
import { getAvatarString, getPortraitSrc } from "../../utils"
import "./emote-menu.css"

const sendEmote = throttle(function (
  index: string,
  shiny: boolean,
  emotion: Emotion
) {
  store.dispatch(toggleAnimation(getAvatarString(index, shiny, emotion)))
},
3000)

export function EmoteMenuComponent(props: {
  player: IPlayer
  index: string
  shiny: boolean
}) {
  const { t } = useTranslation()
  const emotions: Emotion[] = [
    Emotion.HAPPY,
    Emotion.JOYOUS,
    Emotion.DETERMINED,
    Emotion.PAIN,
    Emotion.ANGRY,
    Emotion.CRYING,
    Emotion.SURPRISED,
    Emotion.STUNNED,
    Emotion.DIZZY
  ].filter((emotion) => {
    const indexEmotion = Object.values(Emotion).indexOf(emotion)
    return (
      PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index]?.[indexEmotion] === 1
    )
  })

  const pokemonCollection = props.player.pokemonCollection
  const pConfig = pokemonCollection[props.index]

  return emotions.length === 0 ? (
    <div>{t("no_emotions_available")}</div>
  ) : (
    <ul>
      {emotions.map((emotion) => {
        const unlocked = pConfig && pConfig.emotions.includes(emotion)
        return (
          <li key={emotion}>
            <img
              src={getPortraitSrc(props.index, props.shiny, emotion)}
              title={emotion + (!unlocked ? " (locked)" : "")}
              className={cc({ locked: !unlocked })}
              onClick={() =>
                unlocked && sendEmote(props.index, props.shiny, emotion)
              }
            />
          </li>
        )
      })}
    </ul>
  )
}

export default class EmoteMenu extends GameObjects.DOMElement {
  dom: HTMLDivElement
  constructor(scene: Phaser.Scene, avatarIndex: string, shiny: boolean) {
    super(scene, -350, -150)
    const state = store.getState()
    const player = state.game.players.find(
      (p) => p.id === state.game.currentPlayerId
    )
    this.dom = document.createElement("div")
    this.dom.className = "nes-container emote-menu"
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    if (player) {
      root.render(
        <EmoteMenuComponent player={player} index={avatarIndex} shiny={shiny} />
      )
    } else {
      logger.error(`Cant' find player bound to EmoteMenu`)
    }
  }
}
