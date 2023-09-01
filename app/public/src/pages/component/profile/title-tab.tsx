import React from "react"
import { useTranslation } from "react-i18next"
import { Title } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setTitle } from "../../../stores/NetworkStore"
import { cc } from "../../utils/jsx"

export function TitleTab() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.user)
  return user ? <div>
    <p>{user.titles.length} / {Object.keys(Title).length} {t("titles_unlocked")}</p>
    <ul className="titles">
      {Object.keys(Title).map((k, i) => (
        <li
          key={k}
          className={cc("clickable", {
            unlocked: user.titles.includes(k as Title),
            selected: user.title === k
          })}
          onClick={() => {
            if (user.titles.includes(k as Title)) {
              dispatch(setTitle(k))
            }
          }}
        >
          <span>{t(`title.${k}`)}</span>
          <p>{t(`title_description.${k}`)}</p>
        </li>
      ))}
    </ul>
  </div> : null
}
