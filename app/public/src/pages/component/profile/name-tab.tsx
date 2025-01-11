import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { USERNAME_REGEXP } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeName, setErrorAlertMessage } from "../../../stores/NetworkStore"

export function NameTab() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>("")
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const isAnonymous = false // TODO: retrieve from profile if we decide to add back anonymous users

  function tryChangeName(newName: string) {
    if (USERNAME_REGEXP.test(newName)) {
      dispatch(changeName(newName))
    } else {
      dispatch(setErrorAlertMessage(t("invalid_username")))
    }
  }

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
          onClick={() => tryChangeName(inputValue)}
        >
          {t("change")}
        </button>
      </div>
    </div>
  ) : null
}
