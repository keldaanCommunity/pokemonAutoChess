import React, { useCallback, useEffect, useRef, useState } from "react"
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
import { Page } from "./lobby"
import { Sidebar, Menu, MenuItem, MenuItemProps } from "react-pro-sidebar"

import "./main-sidebar.css"
import Booster from "./component/booster/booster"
import PokemonCollection from "./component/collection/pokemon-collection"
import GameOptionsModal from "./component/game/game-options-modal"
import MetaReport from "./component/meta-report/meta-report"
import { BasicModal } from "./component/modal/modal"
import News from "./component/news/news"
import Wiki from "./component/wiki/wiki"

interface MainSidebarProps {
  changePage?: (nextPage: Page) => void
  showBackButton?: boolean
}

export function MainSidebar(props: MainSidebarProps) {
  const { changePage, showBackButton } = props
  const [collapsed, setCollapsed] = useState(true)
  const [modal, setModal] = useState<Modals>()
  const changeModal = useCallback(
    (nextModal: Modals) => setModal(nextModal),
    []
  )
  const sidebarRef = useRef<HTMLHtmlElement>(null)

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
    changePage?.("bot_builder")
  }, [botList.length, changePage, dispatch, user?.anonymous])

  const botBuilderAdminOnClick = useCallback(() => {
    if (user?.role !== Role.BASIC && botList.length == 0) {
      dispatch(requestBotList())
    }
    changePage?.("bot_manager")
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

  useEffect(() => {
    if (!sidebarRef.current) {
      return
    }

    const ref = sidebarRef.current

    const enableSidebar = () => {
      if (collapsed) {
        setCollapsed(false)
      }
    }

    const disableSidebar = () => {
      if (!collapsed) {
        setCollapsed(true)
      }
    }

    ref.addEventListener("mouseenter", enableSidebar)
    ref.addEventListener("mouseleave", disableSidebar)

    return () => {
      if (ref) {
        ref.removeEventListener("mouseenter", enableSidebar)
        ref.removeEventListener("mouseleave", disableSidebar)
      }
    }
  }, [collapsed])

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#61738a"
      className="sidebar"
      ref={sidebarRef}
    >
      <Menu>
        {showBackButton && (
          <NavLink
            text={t("back_to_lobby")}
            png="colyseus-icon"
            onClick={() => (window.location.href = "/lobby")}
          />
        )}
        <NavLink
          text={t("collection")}
          location="collection"
          svg="collection"
          menuItemColor="blue"
          handleClick={changeModal}
        />
        <NavLink
          text={t("boosters")}
          location="booster"
          svg="booster"
          menuItemColor="blue"
          handleClick={changeModal}
          shimmer={numberOfBooster > 0}
        />
        <NavLink
          text={t("wiki")}
          location="wiki"
          svg="wiki"
          menuItemColor="green"
          handleClick={changeModal}
        />
        <NavLink
          text={t("meta")}
          svg="meta"
          menuItemColor="green"
          onClick={metaOnClick}
        />

        {user?.anonymous === false && user?.title === Title.BOT_BUILDER && (
          <NavLink
            text={t("bot_builder")}
            svg="bot"
            menuItemColor="green"
            onClick={botBuilderOnClick}
          />
        )}

        {(user?.role === Role.ADMIN ||
          user?.role === Role.MODERATOR ||
          user?.role === Role.BOT_MANAGER) && (
          <NavLink
            text={t("bot_admin")}
            svg="bot"
            menuItemColor="green"
            onClick={botBuilderAdminOnClick}
          />
        )}

        <NavLink
          text={t("news")}
          location="news"
          svg="newspaper"
          handleClick={changeModal}
        />
        <NavLink
          text={t("options")}
          svg="options"
          location="options"
          handleClick={changeModal}
        />

        <NavLink
          text={t("sign_out")}
          svg="exit-door"
          menuItemColor="red"
          onClick={signOut}
        />
      </Menu>
      {!collapsed ? (
        <div className="additional-links">
          <DiscordButton />
          <DonateButton />
          <PolicyButton />
        </div>
      ) : null}

      <Modals modal={modal} setModal={setModal} />
    </Sidebar>
  )
}

type NavLinkProps = MenuItemProps &
  NavPageLink & {
    text?: string
    svg?: string
    png?: string
    shimmer?: boolean
    menuItemColor?: string
  }

type NavPageLink = {
  location?: Modals
  handleClick?: (update: Modals) => void
}

function NavLink(props: NavLinkProps) {
  const {
    text,
    location,
    handleClick,
    shimmer = false,
    svg,
    png,
    icon,
    menuItemColor = "default",
    onClick
  } = props

  return (
    <MenuItem
      className={cc("menu-item", menuItemColor)}
      onClick={(e) => {
        onClick?.(e)

        if (location) {
          handleClick?.(location)
        }
      }}
      title={text}
      icon={
        <div className="icon">
          {shimmer && (
            <span className="notification">
              <img width={10} height={10} src="assets/ui/pokeball.svg" />
            </span>
          )}
          {svg ? (
            <img width={20} height={20} src={`assets/ui/${svg}.svg`} />
          ) : png ? (
            <img height={20} src={`assets/ui/${png}.png`} />
          ) : (
            icon
          )}
        </div>
      }
      rootStyles={{
        cursor: "inherit"
      }}
    >
      {text}
    </MenuItem>
  )
}

export type Modals =
  | "meta"
  | "wiki"
  | "collection"
  | "booster"
  | "news"
  | "options"

function Modals({
  modal,
  setModal
}: {
  modal?: Modals
  setModal: (nextModal?: Modals) => void
}) {
  const {
    meta,
    metaItems,
    metaPokemons
  }: Partial<INetwork> & Partial<IUserLobbyState> = useAppSelector((state) => ({
    meta: state.lobby.meta,
    metaItems: state.lobby.metaItems,
    metaPokemons: state.lobby.metaPokemons
  }))

  const closeModal = useCallback(() => setModal(undefined), [setModal])

  return (
    <>
      <BasicModal
        handleClose={closeModal}
        show={modal === "news"}
        body={<News />}
      />
      <BasicModal
        handleClose={closeModal}
        show={modal === "collection"}
        body={<PokemonCollection />}
      />
      <BasicModal
        handleClose={closeModal}
        show={modal === "booster"}
        body={<Booster />}
      />
      <BasicModal
        handleClose={closeModal}
        show={modal === "wiki"}
        body={<Wiki />}
      />
      <BasicModal
        title={"meta"}
        show={modal === "meta" && meta.length > 0 && metaItems.length > 0}
        handleClose={closeModal}
        body={
          <MetaReport
            meta={meta}
            metaItems={metaItems}
            metaPokemons={metaPokemons}
          />
        }
      />
      <GameOptionsModal
        show={modal === "options"}
        ingame={false}
        hideModal={closeModal}
        leave={closeModal}
      />
    </>
  )
}
