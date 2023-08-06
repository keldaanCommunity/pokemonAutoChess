import React, { useCallback } from "react"
import { Link } from "react-router-dom"
import firebase from "firebase/compat/app"
import DiscordButton from "./component/buttons/discord-button"
import DonateButton from "./component/buttons/donate-button"
import PolicyButton from "./component/buttons/policy-button"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  logOut,
  requestMeta,
  requestBotList,
  INetwork
} from "../stores/NetworkStore"
import { IUserLobbyState, leaveLobby } from "../stores/LobbyStore"
import { Role, Title } from "../../../types"
import { cc } from "./utils/jsx"
import "./lobby.css"
import { useTranslation } from "react-i18next"
import { LanguageButton } from "./component/buttons/language-button"
import { Page } from "./lobby"

interface HeaderProps {
  changePage: (nextPage: Page) => void
  showBackButton: boolean
}

export function Header(props: HeaderProps) {
  const { changePage, showBackButton } = props
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const {
    lobby,
    meta,
    metaItems,
    botList,
    user
  }: Partial<INetwork> & Partial<IUserLobbyState> = useAppSelector((state) => ({
    lobby: state.network.lobby,
    meta: state.lobby.meta,
    metaItems: state.lobby.metaItems,
    botList: state.lobby.botList,
    user: state.lobby.user
  }))

  const numberOfBooster = user?.booster ?? 0

  const botBuilderOnClick = useCallback(() => {
    if (user?.anonymous === false && botList.length == 0) {
      dispatch(requestBotList())
    }
    changePage("bot_builder")
  }, [botList.length, changePage, dispatch, user?.anonymous])

  const botBuilderAdminOnClick = useCallback(() => {
    if (user?.role !== Role.BASIC && botList.length == 0) {
      dispatch(requestBotList())
    }
    changePage("bot_manager")
  }, [botList.length, changePage, dispatch, user?.role])

  const metaOnClick = useCallback(() => {
    if (meta.length == 0 || metaItems.length == 0) {
      dispatch(requestMeta())
    }
    changePage("meta")
  }, [changePage, dispatch, meta.length, metaItems.length])

  return (
    <nav>
      {showBackButton && (
        <button onClick={() => changePage("main_lobby")} className="bubbly">
          {t("back_to_lobby")}
        </button>
      )}

      <button className="bubbly blue" onClick={() => changePage("collection")}>
        <img src="assets/ui/collection.svg" alt="" />
        {t("collection")}
      </button>
      <button
        className={cc("bubbly", "blue", { shimmer: numberOfBooster > 0 })}
        onClick={() => changePage("booster")}
      >
        <img src="assets/ui/booster.svg" alt="" />
        {t("boosters")}
      </button>
      <button className="bubbly green" onClick={() => changePage("wiki")}>
        <img src="assets/ui/wiki.svg" alt="" />
        {t("wiki")}
      </button>
      {user?.anonymous === false && user?.title === Title.BOT_BUILDER && (
        <button
          disabled={user?.anonymous}
          className="bubbly green"
          onClick={botBuilderOnClick}
        >
          <img src="assets/ui/bot.svg" alt="" />
          {t("bot_builder")}
        </button>
      )}
      {user?.role === Role.ADMIN ||
      user?.role === Role.MODERATOR ||
      user?.role === Role.BOT_MANAGER ? (
        <button className="bubbly green" onClick={botBuilderAdminOnClick}>
          <img src="assets/ui/bot.svg" alt="" />
          {t("bot_admin")}
        </button>
      ) : null}

      <button className="bubbly green" onClick={metaOnClick}>
        <img src="assets/ui/meta.svg" alt="" />
        {t("meta")}
      </button>
      <DiscordButton />
      <DonateButton />
      <PolicyButton />
      <LanguageButton />
      <Link to="/" style={{ textDecoration: "none" }}>
        <button
          className="bubbly red"
          onClick={async () => {
            await lobby?.leave()
            await firebase.auth().signOut()
            dispatch(leaveLobby())
            dispatch(logOut())
          }}
        >
          {t("sign_out")}
        </button>
      </Link>
    </nav>
  )
}
