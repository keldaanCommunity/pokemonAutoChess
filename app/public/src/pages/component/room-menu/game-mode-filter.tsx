import { useId } from "react"
import { useTranslation } from "react-i18next"
import { GameMode } from "../../../../../types/enum/Game"

const gameModes = [
  GameMode.CLASSIC,
  GameMode.RANKED,
  GameMode.SCRIBBLE,
  GameMode.DOUBLE_UP,
  GameMode.CUSTOM_LOBBY,
  GameMode.TOURNAMENT
]

export function GameModeFilter({
  gameMode,
  onChange
}: {
  gameMode: GameMode | ""
  onChange: (gameMode: GameMode | "") => void
}) {
  const { t } = useTranslation()
  const id = useId()

  return (
    <>
      <label htmlFor={id}>{t("game_mode")}:</label>
      <select
        id={id}
        value={gameMode}
        onChange={(e) => onChange(e.target.value as GameMode | "")}
      >
        <option value="">{t("all")}</option>
        {gameModes.map((mode) => (
          <option key={mode} value={mode}>
            {t(`game_modes.${mode}`)}
          </option>
        ))}
      </select>
    </>
  )
}
