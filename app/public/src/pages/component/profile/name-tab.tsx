import React, { useState } from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeName } from "../../../stores/NetworkStore"

export function NameTab() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>("")
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const isAnonymous = false // TODO: retrieve from profile if we decide to add back anonymous users

  if (user && isAnonymous) {
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
          placeholder={user.displayName}
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
