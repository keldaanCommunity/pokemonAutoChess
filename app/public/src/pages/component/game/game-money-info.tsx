import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { BattleResult } from "../../../../../types/enum/Game"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { max } from "../../../../../utils/number"
import { selectSpectatedPlayer, useAppSelector } from "../../../hooks"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { Money } from "../icons/money"
import "./game-money-info.css"
import { Box } from "../box/box"

export function GameMoneyInfo() {
  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  const maxInterest = useAppSelector((state) => state.game.maxInterest)
  if (!spectatedPlayer) return null

  return (
    <div id="game-money-info" className="my-container money information">
      <div data-tooltip-id="detail-money">
        <Tooltip id="detail-money" className="custom-theme-tooltip" place="top">
          <GameMoneyDetail />
        </Tooltip>
        <Money
          value={spectatedPlayer.money}
          className={cc({
            "is-max": spectatedPlayer.money >= maxInterest * 10
          })}
        />
      </div>
    </div>
  )
}

export function GameMoneyDetail() {
  const { t } = useTranslation()
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const currentPlayer = useAppSelector(selectSpectatedPlayer)
  const streak = useAppSelector((state) => state.game.streak)
  const lastPlayerBattle =
    currentPlayer && currentPlayer.history && currentPlayer.history.length > 0
      ? currentPlayer.history.filter((r) => r.id !== "pve").at(-1)
      : null
  const lastBattleResult = lastPlayerBattle ? lastPlayerBattle.result : null
  const interest = useAppSelector((state) => state.game.interest)
  const maxInterest = useAppSelector((state) => state.game.maxInterest)
  let streakLabel = "Draw"
  if (lastBattleResult === BattleResult.WIN) {
    streakLabel = t("shop.victory_count", { count: streak + 1 })
  } else if (lastBattleResult === BattleResult.DEFEAT) {
    streakLabel = t("shop.defeat_count", { count: streak + 1 })
  }

  const total = 5 + interest + max(5)(streak)

  return (
    <Box className="game-money-detail" tooltip>
      <Box.Header title={t("shop.income")}>
        <p className="help">
          {addIconsToDescription(t("shop.passive_income_hint"))}
        </p>
        <p className="help">{addIconsToDescription(t("shop.streak_income_hint"))}</p>
        {specialGameRule !== SpecialGameRule.BLOOD_MONEY && (
          <p className="help">
            {addIconsToDescription(
              t("shop.additional_income_hint", {
                maxInterest,
                maxInterestGolds: maxInterest * 10
              })
            )}
          </p>
        )}
      </Box.Header>
      <Box.Content className="game-money-next-round">
        <div>
          <output>
            <Money value={5} />
          </output>
          <p>{t("shop.income")}</p>
        </div>
        +
        <div>
          <output>
            <Money value={interest} />
          </output>
          <p>{addIconsToDescription(t("shop.interest", { maxInterest }))}</p>
        </div>
        +
        <div>
          <output>
            <Money value={streak === 0 ? 0 : "+" + max(5)(streak)} />
          </output>
          <p>
            {t("shop.streak")} {lastBattleResult !== null && `(${streakLabel})`}
          </p>
        </div>
        =
        <div className="total">
          <output>
            <Money value={total} />
          </output>
          <p>{t("total")}</p>
        </div>
      </Box.Content>
    </Box>
  )
}
