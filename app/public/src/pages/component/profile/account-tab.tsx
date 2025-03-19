import React from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { deleteAccount } from "../../../stores/NetworkStore"

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
