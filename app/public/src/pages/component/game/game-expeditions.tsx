import { useTranslation } from "react-i18next"
import {
  getExpeditionLabel,
  getPlayerExpeditions
} from "../../../../../models/expeditions"
import { useAppSelector } from "../../../hooks"
import { usePreference } from "../../../preferences"
import { addIconsToDescription } from "../../utils/descriptions"
import DraggableWindow from "../modal/draggable-window"

export default function GameExpeditions() {
  const { t } = useTranslation()
  const profile = useAppSelector((state) => state.network.profile)
  const [expeditionsPosition, setExpeditionsPosition] = usePreference(
    "expeditionsPosition"
  )

  if (!profile) return null
  const expeditions = getPlayerExpeditions(profile)

  return (
    <DraggableWindow
      title={t("expeditions.title")}
      className="my-container expeditions-container"
      initialPosition={expeditionsPosition}
      onMove={(position) => setExpeditionsPosition(position)}
      defaultMinimized={true}
    >
      <ul style={{ maxWidth: "500px" }}>
        {expeditions.map((expedition) => (
          <li key={expedition.type + expedition.rank}>
            <span className="expedition-type">
              {t("expeditions." + expedition.type)}
            </span>
            <p>{addIconsToDescription(getExpeditionLabel(expedition))}</p>
          </li>
        ))}
      </ul>
    </DraggableWindow>
  )
}
