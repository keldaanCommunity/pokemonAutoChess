import React from "react"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"

type Gadget = {
  name: string
  description: string
  icon: string
  levelRequired: number
}
const GADGETS: Gadget[] = [
  {
    name: "gadget.trainer_card",
    description: "gadget.trainer_card_desc",
    icon: "profile",
    levelRequired: 0
  },
  {
    name: "gadget.bag",
    description: "gadget.bag_desc",
    icon: "school-bag",
    levelRequired: 1
  },
  {
    name: "gadget.team_planner",
    description: "gadget.team_planner_desc",
    icon: "team-builder",
    levelRequired: 10
  },
  {
    name: "gadget.bot_builder",
    description: "gadget.bot_builder_desc",
    icon: "bot",
    levelRequired: 20
  },
  {
    name: "gadget.jukebox",
    description: "gadget.jukebox_desc",
    icon: "compact-disc",
    levelRequired: 30
  }
]

export function GadgetsTab() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.lobby.user)
  const level = user?.level ?? 0
  const nbGadgetsUnlocked = GADGETS.filter(
    (g) => g.levelRequired <= level
  ).length

  return user ? (
    <div>
      <p>
        {nbGadgetsUnlocked} / {GADGETS.length} {t("gadgets_unlocked")}
      </p>
      <ul className="gadgets">
        {GADGETS.map((g) => (
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
