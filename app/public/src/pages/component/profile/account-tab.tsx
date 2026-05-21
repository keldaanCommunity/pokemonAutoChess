import { useState } from "react"
import { useTranslation } from "react-i18next"
import { USERNAME_REGEXP } from "../../../../../config"
import { Role } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  deleteAccount,
  fetchProfile,
  heapSnapshot,
  startTwitchVerification,
  startYouTubeVerification,
  unlinkTwitchVerification,
  unlinkYouTubeVerification
} from "../../../network"
import { changeName, setErrorAlertMessage } from "../../../stores/NetworkStore"

export function AccountTab() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.network.profile)

  const promptDeleteAccount = () => {
    const confirmation = prompt(
      t("profile.account.delete_account_confirmation")
    )
    if (confirmation === t("profile.account.delete_account_passphrase")) {
      deleteAccount()
    } else if (confirmation != null) {
      alert(t("profile.account.delete_account_confirmation_failed"))
    }
  }

  return user ? (
    <div>
      <ChangeNameForm />
      <TwitchLinkSection />
      <YouTubeLinkSection />
      <h3>{t("profile.account.user_id")}</h3>
      <p>
        {t("profile.account.user_id_hint1")}{" "}
        <span style={{ color: "red" }}>{user.uid}</span>
      </p>
      <p>{t("profile.account.user_id_hint2")}</p>
      <h3>{t("profile.account.delete_account")}</h3>
      <p>{t("profile.account.delete_account_hint")}</p>
      <button className="bubbly red" onClick={() => promptDeleteAccount()}>
        {t("profile.account.delete_account")}
      </button>
      {user.role === Role.ADMIN && (
        <>
          <h3>{t("heap_snapshot")}</h3>
          <button className="bubbly red" onClick={() => heapSnapshot()}>
            {t("heap_snapshot")}
          </button>
        </>
      )}
    </div>
  ) : null
}

function TwitchLinkSection() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const [loadingAction, setLoadingAction] = useState<
    "connect" | "unlink" | null
  >(null)

  async function handleConnect() {
    setLoadingAction("connect")
    try {
      const payload = await startTwitchVerification()
      window.location.assign(payload.authorizeUrl)
    } catch (error) {
      dispatch(
        setErrorAlertMessage(
          error instanceof Error
            ? error.message
            : "Unable to start Twitch verification"
        )
      )
      setLoadingAction(null)
    }
  }

  async function handleUnlink() {
    const confirmed = window.confirm(
      "Are you sure you want to unlink your Twitch account?"
    )
    if (!confirmed) {
      return
    }

    setLoadingAction("unlink")
    try {
      await unlinkTwitchVerification()
      await fetchProfile(true)
    } catch (error) {
      dispatch(
        setErrorAlertMessage(
          error instanceof Error
            ? error.message
            : "Unable to unlink Twitch account"
        )
      )
    } finally {
      setLoadingAction(null)
    }
  }

  if (!user) {
    return null
  }

  const verifiedAt = user.twitchVerifiedAt
    ? new Date(user.twitchVerifiedAt).toLocaleString()
    : null
  const twitchProfileUrl = user.twitchLogin
    ? `https://www.twitch.tv/${user.twitchLogin}`
    : null

  return (
    <div>
      <h3>Twitch</h3>
      {user.twitchUserId && user.twitchLogin ? (
        <>
          <p>
            Linked as{" "}
            <strong>{user.twitchDisplayName || user.twitchLogin}</strong> (@
            {user.twitchLogin})
          </p>
          {verifiedAt && <p>Verified on {verifiedAt}</p>}
          {twitchProfileUrl && (
            <p>
              <a href={twitchProfileUrl} target="_blank" rel="noreferrer">
                Open Twitch profile
              </a>
            </p>
          )}
          <button
            className="bubbly red"
            disabled={loadingAction != null}
            onClick={() => handleUnlink()}
          >
            {loadingAction === "unlink" ? "Unlinking..." : "Unlink Twitch"}
          </button>
        </>
      ) : (
        <>
          <p>
            Link your Twitch account to verify streamer identity and connect
            your PAC profile to your Twitch login.
          </p>
          <button
            className="bubbly blue"
            disabled={loadingAction != null}
            onClick={() => handleConnect()}
          >
            {loadingAction === "connect" ? "Connecting..." : "Connect Twitch"}
          </button>
        </>
      )}
    </div>
  )
}

function YouTubeLinkSection() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const [loadingAction, setLoadingAction] = useState<
    "connect" | "unlink" | null
  >(null)

  async function handleConnect() {
    setLoadingAction("connect")
    try {
      const payload = await startYouTubeVerification()
      window.location.assign(payload.authorizeUrl)
    } catch (error) {
      dispatch(
        setErrorAlertMessage(
          error instanceof Error
            ? error.message
            : "Unable to start YouTube verification"
        )
      )
      setLoadingAction(null)
    }
  }

  async function handleUnlink() {
    const confirmed = window.confirm(
      "Are you sure you want to unlink your YouTube account?"
    )
    if (!confirmed) {
      return
    }

    setLoadingAction("unlink")
    try {
      await unlinkYouTubeVerification()
      await fetchProfile(true)
    } catch (error) {
      dispatch(
        setErrorAlertMessage(
          error instanceof Error
            ? error.message
            : "Unable to unlink YouTube account"
        )
      )
    } finally {
      setLoadingAction(null)
    }
  }

  if (!user) {
    return null
  }

  const verifiedAt = user.youtubeVerifiedAt
    ? new Date(user.youtubeVerifiedAt).toLocaleString()
    : null
  const youtubeProfileUrl = user.youtubeHandle
    ? `https://www.youtube.com/${user.youtubeHandle}`
    : user.youtubeChannelId
      ? `https://www.youtube.com/channel/${user.youtubeChannelId}`
      : null

  return (
    <div>
      <h3>YouTube</h3>
      {user.youtubeChannelId ? (
        <>
          <p>
            Linked as{" "}
            <strong>{user.youtubeChannelTitle || "YouTube Channel"}</strong>
            {user.youtubeHandle ? ` (${user.youtubeHandle})` : ""}
          </p>
          {verifiedAt && <p>Verified on {verifiedAt}</p>}
          {youtubeProfileUrl && (
            <p>
              <a href={youtubeProfileUrl} target="_blank" rel="noreferrer">
                Open YouTube channel
              </a>
            </p>
          )}
          <button
            className="bubbly red"
            disabled={loadingAction != null}
            onClick={() => handleUnlink()}
          >
            {loadingAction === "unlink" ? "Unlinking..." : "Unlink YouTube"}
          </button>
        </>
      ) : (
        <>
          <p>
            Link your YouTube account to verify channel ownership and connect
            your PAC profile to your YouTube identity.
          </p>
          <button
            className="bubbly blue"
            disabled={loadingAction != null}
            onClick={() => handleConnect()}
          >
            {loadingAction === "connect" ? "Connecting..." : "Connect YouTube"}
          </button>
        </>
      )}
    </div>
  )
}

function ChangeNameForm() {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>("")
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const isAnonymous = false // TODO: retrieve from profile if we decide to add back anonymous users

  function tryChangeName(newName: string) {
    // Remove all invisible characters
    newName = newName.replace(/[\u3164\u200B-\u200D\u2060\uFEFF]/g, "")
    if (USERNAME_REGEXP.test(newName)) {
      dispatch(changeName(newName))
    } else {
      dispatch(setErrorAlertMessage(t("profile.account.invalid_username")))
    }
  }

  if (user && isAnonymous) {
    return (
      <div className="my-container">
        <p>{t("profile.account.anonymous_users_name_hint")}</p>
      </div>
    )
  }

  return user ? (
    <div>
      <h3>{t("profile.account.change_name")}</h3>
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
      <p className="disclaimer">{t("profile.account.username_disclaimer")}</p>
    </div>
  ) : null
}
