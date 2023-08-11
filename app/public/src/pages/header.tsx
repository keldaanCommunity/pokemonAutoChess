import React, { useCallback, useState } from "react"
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
import { Page, Modals } from "./lobby"
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  MenuItemProps
} from "react-pro-sidebar"

interface HeaderProps {
  changeModal: (nextModal: Modals) => void
  changePage: (nextPage: Page) => void
  showBackButton: boolean
}

export function Header(props: HeaderProps) {
  return <MainSidebar {...props} />
}

function MainSidebar(props: HeaderProps) {
  const { changeModal, changePage, showBackButton } = props
  const [collapsed, setCollapsed] = useState(true)

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
    changeModal("meta")
  }, [changeModal, dispatch, meta.length, metaItems.length])

  const signOut = useCallback(async () => {
    await lobby?.leave()
    await firebase.auth().signOut()
    dispatch(leaveLobby())
    dispatch(logOut())
  }, [dispatch, lobby])

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#61738a"
      className="sidebar"
      breakPoint="lg"
    >
      <Menu>
        {showBackButton && (
          <NavLink
            text={t(collapsed ? "lobby" : "back_to_lobby")}
            location="main_lobby"
            handleClick={changePage}
          />
        )}
        <NavLink
          text={t("news")}
          location="news"
          icon="📰"
          handleClick={changeModal}
        />
        <NavLink
          text={t("collection")}
          location="collection"
          svg="collection"
          handleClick={changeModal}
        />
        <NavLink
          text={t("boosters")}
          location="booster"
          svg="booster"
          handleClick={changeModal}
          shimmer={numberOfBooster > 0}
        />
        <NavLink
          text={t("wiki")}
          location="wiki"
          svg="wiki"
          handleClick={changeModal}
        />
        {user?.anonymous === false && user?.title === Title.BOT_BUILDER && (
          <NavLink
            text={t("bot_builder")}
            svg="bot"
            onClick={botBuilderOnClick}
          />
        )}

        {(user?.role === Role.ADMIN ||
          user?.role === Role.MODERATOR ||
          user?.role === Role.BOT_MANAGER) && (
          <NavLink
            text={t("bot_admin")}
            svg="bot"
            onClick={botBuilderAdminOnClick}
          />
        )}

        <NavLink text={t("meta")} svg="meta" onClick={metaOnClick} />
        <NavLink icon="🚪" text={t("sign_out")} onClick={signOut} />
        <NavLink
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? "🢂" : "🢀"}
        />
      </Menu>
    </Sidebar>
  )
}

type NavLinkProps = MenuItemProps &
  NavPageLink & {
    text?: string
    svg?: string
    shimmer?: boolean
  }

type NavPageLink = {
  location?: any
  handleClick?: (update: any) => void
}

function NavLink(props: NavLinkProps) {
  const {
    text,
    location,
    handleClick,
    shimmer = false,
    svg,
    icon,
    onClick
  } = props

  return (
    <MenuItem
      className="menu-item"
      onClick={(e) => {
        onClick?.(e)

        if (location) {
          handleClick?.(location)
        }
      }}
      icon={
        <div className="icon">
          {shimmer && <span className="notification">🔴</span>}
          {svg ? (
            <img width={20} height={20} src={`assets/ui/${svg}.svg`} />
          ) : (
            icon
          )}
        </div>
      }
      suffix={shimmer && "🔥"}
      rootStyles={{
        cursor: "inherit"
      }}
    >
      {text}
    </MenuItem>
  )
}
