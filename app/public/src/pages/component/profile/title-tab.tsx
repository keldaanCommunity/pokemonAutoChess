import React, { useState } from "react"
import { useTranslation } from "react-i18next"
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
  return user ? (
    <div>
      <p>
        {user.titles.length} / {Object.keys(Title).length}
        {t("titles_unlocked")}
      </p>
      <Checkbox
        checked={showUnlocked}
        onToggle={setShowUnlocked}
        label="Show locked"
        isDark
      />
      <ul className="titles">
        {Object.keys(Title)
          .filter<Title>(
            (title): title is Title =>
              showUnlocked || user.titles.includes(title as Title)
          )
          .map((k) => (
            <li
              key={k}
              className={cc("clickable", {
                unlocked: user.titles.includes(k),
                selected: user.title === k
              })}
              onClick={() => {
                if (user.titles.includes(k)) {
                  dispatch(setTitle(k))
                }
              }}
            >
              <span>{t(`title.${k}`)}</span>
              <p>{t(`title_description.${k}`)}</p>
            </li>
          ))}
      </ul>
    </div>
  ) : null
}
