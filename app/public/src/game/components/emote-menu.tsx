import { GameObjects } from "phaser"
import React from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../models/precomputed/precomputed-emotions"
import { IPlayer } from "../../../../types"
import { AvatarEmotions, Emotion } from "../../../../types/enum/Emotion"
import { logger } from "../../../../utils/logger"
import { cc } from "../../pages/utils/jsx"
import store from "../../stores"
import { getPortraitSrc } from "../../../../utils/avatar"
import GameScene from "../scenes/game-scene"
import { usePreference } from "../../preferences"
import "./emote-menu.css"

export function EmoteMenuComponent(props: {
  player: IPlayer
  index: string
  shiny: boolean
  sendEmote: (emotion: Emotion) => void
}) {
  const [antialiasing] = usePreference('antialiasing')
  const { t } = useTranslation()
  const emotions: Emotion[] = AvatarEmotions.filter((emotion) => {
    const indexEmotion = Object.values(Emotion).indexOf(emotion)
    return (
      PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index]?.[indexEmotion] === 1
    )
  })

  return emotions.length === 0 ? (
    <div>{t("no_emotions_available")}</div>
  ) : (
    <ul>
      {emotions.map((emotion, i) => {
        const unlocked = store.getState().game.emotesUnlocked.includes(emotion)
        return (
          <li key={emotion}>
            <img
              src={getPortraitSrc(props.index, props.shiny, emotion)}
              title={emotion + (!unlocked ? " (locked)" : "")}
              className={cc({
                locked: !unlocked,
                pixelated: !antialiasing
              })}
              onClick={() => unlocked && props.sendEmote(emotion)}
            />
            <span className="counter">{i + 1}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default class EmoteMenu extends GameObjects.DOMElement {
  dom: HTMLDivElement
  constructor(
    scene: GameScene,
    avatarIndex: string,
    shiny: boolean,
    sendEmote: (emotion: Emotion) => void
  ) {
    super(scene, -350, -150)
    const state = store.getState()
    const player = state.game.players.find((p) => p.id === scene.uid)

    this.dom = document.createElement("div")
    this.dom.className = "my-container emote-menu"
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    if (player) {
      root.render(
        <EmoteMenuComponent
          player={player}
          index={avatarIndex}
          shiny={shiny}
          sendEmote={sendEmote}
        />
      )
    } else {
      logger.error(`Cant' find player bound to EmoteMenu`)
    }
  }
}
