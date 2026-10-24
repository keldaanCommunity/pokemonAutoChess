import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { STAGE_ATLAS_UNLOCKED } from "../../../../../config/game/atlas"
import { GamePhaseState } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import store from "../../../stores"
import { setAtlasVisible } from "../../../stores/GameStore"
import { cc } from "../../utils/jsx"

export function GameConnectionOrb() {
  const { t } = useTranslation()
  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const currentPhase = useAppSelector((state) => state.game.phase)
  const atlasVisible = useAppSelector((state) => state.game.atlasVisible)
  const emera = useAppSelector((state) => state.game.atlasManager.emera)

  if (
    stageLevel < STAGE_ATLAS_UNLOCKED ||
    (stageLevel === STAGE_ATLAS_UNLOCKED &&
      currentPhase === GamePhaseState.TOWN)
  ) {
    return null
  }

  return (
    <div id="game-connection-orb" className="my-container information">
      <div data-tooltip-id="detail-connection-orb">
        <Tooltip
          id="detail-connection-orb"
          className="custom-theme-tooltip"
          place="top"
        >
          <p className="help">{t("hud.connection_orb.hint")}</p>
        </Tooltip>
        <img
          id="game-connection-orb-icon"
          onClick={() => store.dispatch(setAtlasVisible(!atlasVisible))}
          src="/assets/ui/connection_orb.png"
          className={cc({ active: atlasVisible, usable: emera > 0 })}
        />
        <span>{emera}</span>
        <img
          className="icon"
          src="/assets/ui/emera.png"
          alt={t("atlas.emera")}
        />
      </div>
    </div>
  )
}
