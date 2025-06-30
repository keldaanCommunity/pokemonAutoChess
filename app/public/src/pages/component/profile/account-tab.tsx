import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { changeName, deleteAccount, setErrorAlertMessage } from "../../../stores/NetworkStore"
import { USERNAME_REGEXP } from "../../../../../types"

export function AccountTab() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.network.profile)

    const promptDeleteAccount = () => {
        const confirmation = prompt(t("delete_account_confirmation"))
        if (confirmation === t("delete_account_passphrase")) {
            dispatch(deleteAccount())
        } else if (confirmation != null) {
            alert(t("delete_account_confirmation_failed"))
        }
    }

    return user ? (
        <div>
            <ChangeNameForm />
            <h3>{t("user_id")}</h3>
            <p>{t("user_id_hint1")} <span style={{ color: "red" }}>{user.uid}</span></p>
            <p>{t("user_id_hint2")}</p>
            <h3>{t("delete_account")}</h3>
            <p>{t("delete_account_hint")}</p>
            <button
                className="bubbly red"
                onClick={() => promptDeleteAccount()}
            >
                {t("delete_account")}
            </button>
        </div>
    ) : null
}

function ChangeNameForm() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>("")
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const isAnonymous = false // TODO: retrieve from profile if we decide to add back anonymous users

  function tryChangeName(newName: string) {
    // Check for valid username and not fully invisible characters (e.g., Hangul Filler)
    if (
      USERNAME_REGEXP.test(newName) &&
      // Remove all invisible characters and check if anything remains
      newName.replace(/[\u3164\u200B-\u200D\u2060\uFEFF]/g, "").trim().length > 0
    ) {
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
      <p className="disclaimer">
        {t("username_disclaimer")}
      </p>
    </div>
  ) : null
}
