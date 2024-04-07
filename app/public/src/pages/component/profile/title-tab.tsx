import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ITitleStatistic,
  fetchTitles
} from "../../../../../models/mongo-models/title-statistic"
import { Title } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTitle } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"
import { Checkbox } from "../checkbox/checkbox"

export function TitleTab() {
  const [showUnlocked, setShowUnlocked] = useState<boolean>(true)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.user)
  const [titles, setTitles] = useState<ITitleStatistic[]>([])

  useEffect(() => {
    fetchTitles().then((res) => {
      setTitles(res)
    })
  }, [])

  return user && titles ? (
    <div>
      <p>
        {user.titles.length} / {Object.keys(Title).length}{" "}
        {t("titles_unlocked")}
      </p>
      <Checkbox
        checked={showUnlocked}
        onToggle={setShowUnlocked}
        label={t("toggle_locked")}
        isDark
      />
      <ul className="titles">
        {titles
          .filter((title) => showUnlocked || user.titles.includes(title.name))
          .sort((a, b) => b.rarity - a.rarity)
          .map((k) => (
            <li
              key={k.name}
              style={{
                background: `linear-gradient(to right, var(--color-bg-primary) 0% ${
                  k.rarity * 100
                }%, var(--color-bg-secondary) ${k.rarity * 100}% 100%)`
              }}
              className={cc("clickable", "my-box", {
                unlocked: user.titles.includes(k.name),
                selected: user.title === k.name
              })}
              onClick={() => {
                if (user.titles.includes(k.name)) {
                  dispatch(setTitle(k.name))
                }
              }}
            >
              <div>
                <span>{t(`title.${k.name}`)}</span>
                <p>{t(`title_description.${k.name}`)}</p>
              </div>

              <span>{(k.rarity * 100).toFixed(3)}%</span>
            </li>
          ))}
      </ul>
    </div>
  ) : null
}
