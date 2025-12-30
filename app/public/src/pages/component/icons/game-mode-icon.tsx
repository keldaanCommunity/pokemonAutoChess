import { useTranslation } from "react-i18next"
import { GameMode } from "../../../../../types/enum/Game"
import { cc } from "../../utils/jsx"

export function GameModeIcon(props: { gameMode: GameMode }) {
  const { t } = useTranslation()
  return (
    <img
      alt={t(`game_modes.${props.gameMode}`)}
      title={t(`game_modes.${props.gameMode}`)}
      className={cc(props.gameMode.toLowerCase(), "gamemode icon")}
      src={`/assets/ui/${props.gameMode.toLowerCase()}.png`}
      draggable="false"
    />
  )
}
