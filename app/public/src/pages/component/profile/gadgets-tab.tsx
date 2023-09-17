import React from "react"
import { useTranslation } from "react-i18next"
import { GADGETS } from "../../../../../core/gadgets"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"

export function GadgetsTab() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.lobby.user)
  const level = user?.level ?? 0
  const gadgets = Object.values(GADGETS)
  const nbGadgetsUnlocked = gadgets.filter(
    (g) => g.levelRequired <= level
  ).length

  return user ? (
    <div>
      <p>
        {nbGadgetsUnlocked} / {gadgets.length} {t("gadgets_unlocked")}
      </p>
      <ul className="gadgets">
        {gadgets.map((g) => (
          <li
            key={g.name}
            className={cc("gadget", "nes-container", {
              locked: g.levelRequired > level
            })}
          >
            <img src={`/assets/ui/${g.icon}.svg`} alt={t(g.name)} />
            <span>{t(g.name)}</span>
            {g.levelRequired > level && (
              <small>
                {t("level_required")}: {g.levelRequired}
              </small>
            )}
            <p className="description">{t(g.description)}</p>
          </li>
        ))}
      </ul>
    </div>
  ) : null
}
