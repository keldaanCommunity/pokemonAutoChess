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
        <div className="nes-container">
          <p>{t("anonymous_users_name_hint")}</p>
        </div>
      )
    }
  
    return user ? (
      <div>
        <h3>{t("change_name")}</h3>
        <div className="nes-field is-inline" style={{ gap: "0.5em" }}>
          <input
            type="text"
            className="my-input"
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