import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { THEME_BY_TITLE, TITLES_UNLOCKING_THEMES } from "../../../../../config"
import { fetchTitles, ITitleStatistic } from "../../../models/title-statistic"
import { Title } from "../../../../../types"
import { isIn } from "../../../../../utils/array"
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
  const nbTitlesUnlocked = user
    ? Object.keys(Title).filter((title) => isIn(user.titles, title)).length
    : 0

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
          {t("profile.progress.titles_unlocked", {
            count: nbTitlesUnlocked,
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
          .map((title) => (
            <li
              key={title.name}
              style={{
                background: `linear-gradient(to right, var(--color-bg-primary) 0% ${
                  title.rarity * 100
                }%, var(--color-bg-secondary) ${title.rarity * 100}% 100%)`
              }}
              className={cc("clickable", "my-box", {
                unlocked: user.titles.includes(title.name),
                selected: user.title === title.name
              })}
              onClick={() => {
                if (user.titles.includes(title.name)) {
                  dispatch(setTitle(title.name))
                }
              }}
            >
              <span className="title-name">{t(`title.${title.name}`)}</span>
              <div className="title-description">
                <p>
                  {addIconsToDescription(t(`title_description.${title.name}`))}
                </p>
                {TITLES_UNLOCKING_THEMES.includes(title.name) && (
                  <p>
                    <img
                      src={`/assets/ui/palette.svg`}
                      height="24"
                      width="24"
                    />{" "}
                    {t("profile.progress.unlocks_theme", {
                      theme: t(`theme.${THEME_BY_TITLE[title.name as Title]}`)
                    })}
                  </p>
                )}
              </div>

              <span className="title-rarity">
                {(title.rarity * 100).toFixed(3)}%
              </span>
            </li>
          ))}
      </ul>
    </div>
  ) : null
}
