import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeName } from "../../../stores/NetworkStore"

export function NameTab() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>("")
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.user)

  if (user && user.anonymous) {
    return (
      <div className="my-container">
        <p>{t("anonymous_users_name_hint")}</p>
      </div>
    )
  }

  return user ? (
    <div>
      <h3>{t("change_name")}</h3>
      <div style={{ display: "flex", gap: "0.5em" }}>
        <input
          type="text"
          placeholder={user.name}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <button
          className="bubbly blue"
          onClick={() => dispatch(changeName(inputValue))}
        >
          {t("change")}
        </button>
      </div>
    </div>
  ) : null
}
