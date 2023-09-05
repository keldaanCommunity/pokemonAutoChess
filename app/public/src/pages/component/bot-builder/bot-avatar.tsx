import React from "react"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { PkmWithConfig, Emotion } from "../../../../../types"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getAvatarSrc } from "../../../utils"

export default function BotAvatar(props: {
  bot: IBot,
  onChangeAvatar: (pkm: PkmWithConfig) => void
  onClick: () => void
}) {
  function handleOnDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    if (e.dataTransfer.getData("pokemon") != "") {
      props.onChangeAvatar({
        name: e.dataTransfer.getData("pokemon") as Pkm,
        emotion: Emotion.NORMAL,
        shiny: false
      })
    }
  }

  return (
    <div id="bot-info">
      <img
        className="bot-avatar"
        src={getAvatarSrc(props.bot.avatar)}
        onDragOver={handleOnDragOver}
        onDrop={handleDrop}
        onClick={props.onClick}
      />
      <p>
        {props.bot.name} {props.bot.author && "by " + props.bot.author}
      </p>
      <p>ELO: {props.bot.elo}</p>
    </div>
  )
}
