import type React from "react"
import { useTranslation } from "react-i18next"
import { getBotDifficultyByElo } from "../../../../../config/game/bots"
import { validateBot } from "../../../../../core/bot-logic"
import { Emotion, type PkmWithCustom } from "../../../../../types"
import { BotDifficulty } from "../../../../../types/enum/Game"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getAvatarSrc } from "../../../../../utils/avatar"
import type { IBot } from "../../../models/bot-v2"

export default function BotAvatar(props: {
  bot: IBot
  onChangeAvatar: (pkm: PkmWithCustom) => void
  onClick: () => void
}) {
  const { t } = useTranslation()

  function handleOnDragOver(e: React.DragEvent) {
    e.stopPropagation()
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.stopPropagation()
    e.preventDefault()
    const data = e.dataTransfer.getData("text/plain")
    if (data.startsWith("pokemon")) {
      const [type, name] = data.split(",") as [string, Pkm]
      props.onChangeAvatar({
        name,
        emotion: Emotion.NORMAL,
        shiny: false
      })
    }
  }

  const errors = validateBot(props.bot)
  const botDifficulty = getBotDifficultyByElo(props.bot.elo)

  function getColorByEloRange(elo: number): string {
    switch (botDifficulty) {
      case BotDifficulty.BEGINNER:
        return "var(--color-rarity-common)"
      case BotDifficulty.EASY:
        return "var(--color-rarity-uncommon)"
      case BotDifficulty.MEDIUM:
        return "var(--color-rarity-rare)"
      case BotDifficulty.HARD:
        return "var(--color-rarity-epic)"
      case BotDifficulty.EXTREME:
        return "var(--color-rarity-ultra)"
      case BotDifficulty.MASTER:
        return "var(--color-rarity-legendary)"
      default:
        return "var(--color-rarity-common)"
    }
  }

  return (
    <div id="bot-info" className="my-box">
      <img
        className="bot-avatar"
        src={getAvatarSrc(props.bot.avatar)}
        onDragOver={handleOnDragOver}
        onDrop={handleDrop}
        onClick={props.onClick}
      />
      {props.bot.name === Pkm.DEFAULT ? (
        <p
          style={{ color: "var(--color-fg-negative)", whiteSpace: "pre-line" }}
        >
          {t("bot_builder.default_name_warning")}
        </p>
      ) : (
        <p>
          {props.bot.name} {props.bot.author && "by " + props.bot.author}
        </p>
      )}
      <p>
        {t("elo")}:{" "}
        <span
          style={{
            fontWeight: "bold",
            color: getColorByEloRange(props.bot.elo)
          }}
        >
          {props.bot.elo} - {t(`bot_difficulty.${botDifficulty}`)}
        </span>
      </p>
      <p>
        {errors.length > 0 ? (
          <span
            style={{ color: "var(--color-fg-negative)" }}
            title={errors.join("\n")}
          >
            {t("bot_builder.invalid")}
          </span>
        ) : (
          <span style={{ color: "var(--color-fg-positive)" }}>
            {t("bot_builder.valid")}
          </span>
        )}
      </p>
    </div>
  )
}
