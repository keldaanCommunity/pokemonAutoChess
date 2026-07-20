import { useTranslation } from "react-i18next"
import { DEPTH } from "../../../game/depths"
import { useAppSelector } from "../../../hooks"
import { usePreference } from "../../../preferences"
import DraggableWindow from "../modal/draggable-window"
import Synergies from "../synergy/synergies"

export default function GameSynergies() {
  const synergies = useAppSelector((state) => state.game.synergiesSpectated)
  const { t } = useTranslation()
  const [synergiesPosition, setSynergiesPosition] =
    usePreference("synergiesPosition")

  return (
    <DraggableWindow
      title={t("synergies")}
      className="my-container synergies-container"
      initialPosition={synergiesPosition}
      onMove={(position) => setSynergiesPosition(position)}
      style={{ zIndex: DEPTH.SYNERGIES_CONTAINER }}
    >
      <Synergies synergies={synergies} tooltipPortal={true} />
    </DraggableWindow>
  )
}
