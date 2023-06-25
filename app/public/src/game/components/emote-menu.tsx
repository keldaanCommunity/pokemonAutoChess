import React from "react"
import ReactDOM from "react-dom"
import { GameObjects } from "phaser"
import { Emotion } from "../../../../types/enum/Emotion"
import { getAvatarString, getPortraitSrc } from "../../utils"
import "./emote-menu.css"
import { throttle } from "../../../../utils/function"
import { broadcastEmote } from "../../stores/NetworkStore"
import store from "../../stores"
import tracker from "../../../dist/client/assets/pokemons/tracker.json"
import { ITracker } from "../../../../types/ITracker"
import { cc } from "../../pages/utils/jsx"
import { IPlayer } from "../../../../types"
import { logger } from "../../../../utils/logger"

const sendEmote = throttle(function (
  index: string,
  shiny: boolean,
  emotion: Emotion
) {
  store.dispatch(broadcastEmote(getAvatarString(index, shiny, emotion)))
},
3000)

export function EmoteMenuComponent(props: {
  player: IPlayer
  index: string
  shiny: boolean
}) {
  let emotions: Emotion[] = [
    Emotion.HAPPY,
    Emotion.JOYOUS,
    Emotion.DETERMINED,
    Emotion.PAIN,
    Emotion.ANGRY,
    Emotion.CRYING,
    Emotion.SURPRISED,
    Emotion.STUNNED,
    Emotion.DIZZY
  ]

  const pokemonCollection = props.player.pokemonCollection
  const metadata = tracker as unknown as { [key: string]: ITracker }
  let pMetadata: ITracker | undefined = undefined
  const pathIndex = props.index.split("-")
  if (pathIndex.length == 1) {
    pMetadata = metadata[props.index]
  } else if (pathIndex.length == 2) {
    pMetadata = metadata[pathIndex[0]].subgroups[pathIndex[1]]
  }
  if (pMetadata) {
    emotions = emotions.filter(
      (emotion) => emotion in pMetadata!.portrait_files
    )
  }
  const pConfig = pokemonCollection[props.index]
  console.log({ pokemonCollection, pConfig })

  return (
    <ul>
      {emotions.map((emotion) => {
        const unlocked = pConfig && pConfig.emotions.includes(emotion)
        return (
          <li key={emotion}>
            <img
              src={getPortraitSrc(props.index, props.shiny, emotion)}
              title={emotion + (!unlocked ? " (locked)":"")}
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
    if (player) {
      ReactDOM.render(
        <EmoteMenuComponent
          player={player}
          index={avatarIndex}
          shiny={shiny}
        />,
        this.dom
      )
    } else {
      logger.error(`Cant' find player bound to EmoteMenu`)
    }
  }
}
