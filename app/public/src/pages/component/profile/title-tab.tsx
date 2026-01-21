import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  fetchTitles,
  ITitleStatistic
} from "../../../../../models/mongo-models/title-statistic"
import { Title } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTitle } from "../../../stores/NetworkStore"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { Checkbox } from "../checkbox/checkbox"

export function TitleTab() {
  const [showUnlocked, setShowUnlocked] = useState<boolean>(true)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const [titles, setTitles] = useState<ITitleStatistic[]>([])

  useEffect(() => {
    fetchTitles().then((res) => {
      Object.keys(Title).forEach((title) => {
        if (!res.some((t) => t.name === title)) {
          res.push({ name: title as Title, rarity: 0 })
        }
      })
      setTitles(res)
    })
  }, [])

  return user && titles ? (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Checkbox
          checked={showUnlocked}
          onToggle={setShowUnlocked}
          label={t("toggle_locked")}
          isDark
        />
        <p>
          {t("titles_unlocked", {
            count: user.titles.length,
            total: Object.keys(Title).length
          })}
        </p>
      </div>
      <ul className="titles">
        <li
          key="no-title"
          className={cc("clickable", "my-box", {
            unlocked: true,
            selected: user.title === ""
          })}
          onClick={() => dispatch(setTitle(""))}
        >
          <span>{t("title.no_title")}</span>
        </li>
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
              <span className="title-name">{t(`title.${k.name}`)}</span>
              <p className="title-description">
                {addIconsToDescription(t(`title_description.${k.name}`))}
              </p>

              <span className="title-rarity">
                {(k.rarity * 100).toFixed(3)}%
              </span>
            </li>
          ))}
      </ul>
    </div>
  ) : null
}
