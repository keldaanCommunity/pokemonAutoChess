import React from "react"
import { useTranslation } from "react-i18next"
import { IBot } from "../../../../../models/mongo-models/bot-v2"
import { Emotion, PkmWithCustom } from "../../../../../types"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getAvatarSrc } from "../../../../../utils/avatar"
import { validateBot } from "./bot-logic"

export default function BotAvatar(props: {
  bot: IBot
  onChangeAvatar: (pkm: PkmWithCustom) => void
  onClick: () => void
}) {
  const { t } = useTranslation()

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

  const errors = validateBot(props.bot)

  return (
    <div id="bot-info" className="my-box">
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
      <p>
        {errors.length > 0 ? (
          <span style={{ color: "red" }} title={errors.join("\n")}>
            {t("invalid")}
          </span>
        ) : (
          <span style={{ color: "lime" }}>{t("valid")}</span>
        )}
      </p>
    </div>
  )
}
