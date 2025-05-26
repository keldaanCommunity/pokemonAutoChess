import React from "react"
import { useTranslation } from "react-i18next"
import { GADGETS } from "../../../../../core/gadgets"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"

export function GadgetsTab() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.network.profile)
  const level = user?.level ?? 0
  const gadgets = Object.values(GADGETS).filter((g) => !g.disabled)
  const nbGadgetsUnlocked = gadgets.filter(
    (g) => g.levelRequired <= level
  ).length

  return user ? (
    <div>
      <p style={{ textAlign: "right" }}>
        {t("gadgets_unlocked", { count: nbGadgetsUnlocked, total: gadgets.length })}
      </p>
      <ul className="gadgets">
        {gadgets.map((g) => (
          <li
            key={g.name}
            className={cc("gadget", "my-container", {
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
