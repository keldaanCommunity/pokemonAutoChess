import React from "react"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { PkmWithConfig, Emotion } from "../../../../../types"
import { Item } from "../../../../../types/enum/Item"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import { getAvatarSrc, getAvatarString } from "../../../utils"

export default function BotAvatar(props: {
  bot: IBot
  setBot: React.Dispatch<React.SetStateAction<IBot>>
  selection: PkmWithConfig | Item
}) {
  const displayName = useAppSelector((state) => state.lobby?.user?.name)

  function handleClick() {
    if (Object.values(Pkm).includes((props.selection as PkmWithConfig).name)) {
      const pkm = props.selection as PkmWithConfig
      props.setBot({
        ...props.bot,
        name: pkm.name.toUpperCase(),
        author: displayName ?? "???",
        avatar: getAvatarString(PkmIndex[pkm.name], pkm.shiny, pkm.emotion)
      })
    }
  }

  function handleOnDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    if (e.dataTransfer.getData("pokemon") != "") {
      const pkm: PkmWithConfig = {
        name: e.dataTransfer.getData("pokemon") as Pkm,
        emotion: Emotion.NORMAL,
        shiny: false
      }
      props.setBot({
        ...props.bot,
        name: pkm.name.toUpperCase(),
        author: displayName ?? "???",
        avatar: getAvatarString(PkmIndex[pkm.name], pkm.shiny, pkm.emotion)
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
        onClick={handleClick}
      />
      <p>
        {props.bot.name} {props.bot.author && "by " + props.bot.author}
      </p>
      <p>ELO: {props.bot.elo}</p>
    </div>
  )
}
