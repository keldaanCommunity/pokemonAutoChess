import React, { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { Sidebar, Menu, MenuItem, MenuItemProps } from "react-pro-sidebar"
import { useAppDispatch, useAppSelector } from "../hooks"
import { requestMeta, INetwork } from "../stores/NetworkStore"
import { IUserLobbyState } from "../stores/LobbyStore"
import { Role, Title } from "../../../types"
import { cc } from "./utils/jsx"
import Booster from "./component/booster/booster"
import PokemonCollection from "./component/collection/pokemon-collection"
import GameOptionsModal from "./component/game/game-options-modal"
import MetaReport from "./component/meta-report/meta-report"
import { BasicModal } from "./component/modal/modal"
import News from "./component/news/news"
import Wiki from "./component/wiki/wiki"
import pkg from "../../../../package.json"

import "./main-sidebar.css"

export type Page = "main_lobby" | "preparation" | "game"

interface MainSidebarProps {
  page: Page
  leave: () => void
  leaveLabel: string
}

export function MainSidebar(props: MainSidebarProps) {
  const { page, leave, leaveLabel } = props
  const [collapsed, setCollapsed] = useState(true)
  const navigate = useNavigate()
  const [modal, setModal] = useState<Modals>()
  const changeModal = useCallback(
    (nextModal: Modals) => setModal(nextModal),
    []
  )
  const sidebarRef = useRef<HTMLHtmlElement>(null)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const {
    meta,
    metaItems,
    user,
    botList
  }: Partial<INetwork> & Partial<IUserLobbyState> = useAppSelector((state) => ({
    meta: state.lobby.meta,
    metaItems: state.lobby.metaItems,
    botList: state.lobby.botList,
    user: state.lobby.user
  }))

  const version = pkg.version

  const numberOfBooster = user?.booster ?? 0

  const metaOnClick = useCallback(() => {
    if (meta.length == 0 || metaItems.length == 0) {
      dispatch(requestMeta())
    }
    changeModal("meta")
  }, [changeModal, dispatch, meta.length, metaItems.length])

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
        <div className="sidebar-logo">
          <img src={`assets/ui/colyseus-icon.png`} />
          <div>
            <h1>Pokemon Auto Chess</h1>
            <small>v{version}</small>
          </div>
        </div>

        {page !== "game" && (
          <NavLink
            location="collection"
            svg="collection"
            className="blue"
            handleClick={changeModal}
          >
            {t("collection")}
          </NavLink>
        )}
        {page !== "game" && (
          <NavLink
            location="booster"
            svg="booster"
            className="blue"
            handleClick={changeModal}
            shimmer={numberOfBooster > 0}
          >
            {t("boosters")}
          </NavLink>
        )}
        <NavLink
          location="wiki"
          svg="wiki"
          className="green"
          handleClick={changeModal}
        >
          {t("wiki")}
        </NavLink>
        <NavLink svg="meta" className="green" onClick={metaOnClick}>
          {t("meta")}
        </NavLink>

        {page !== "game" &&
          user?.anonymous === false &&
          user?.title === Title.BOT_BUILDER && (
            <NavLink svg="bot" onClick={() => navigate("/bot-builder")}>
              {t("bot_builder")}
            </NavLink>
          )}

        {page !== "game" &&
          (user?.role === Role.ADMIN ||
            user?.role === Role.MODERATOR ||
            user?.role === Role.BOT_MANAGER) && (
            <NavLink svg="bot" onClick={() => navigate("/bot-admin")}>
              {t("bot_admin")}
            </NavLink>
          )}

        {page !== "game" &&
          (user?.role === Role.ADMIN || user?.role === Role.MODERATOR) && (
            <NavLink svg="bot" onClick={() => navigate("/sprite-debug")}>
              Debug sprite
            </NavLink>
          )}

        <NavLink location="news" svg="newspaper" handleClick={changeModal}>
          {t("news")}
        </NavLink>
        <NavLink svg="options" location="options" handleClick={changeModal}>
          {t("options")}
        </NavLink>

        <div className="spacer"></div>

        {!collapsed && page !== "game" && (
          <div className="additional-links">
            <a
              href="https://github.com/keldaanCommunity/pokemonAutoChess/blob/master/policy.md"
              target="_blank"
            >
              {t("policy")}
            </a>
          </div>
        )}

        {page !== "game" && (
          <NavLink
            svg="donate"
            className="tipeee"
            onClick={() =>
              window.open("https://en.tipeee.com/pokemon-auto-chess", "_blank")
            }
          >
            {t("donate")}
            <img
              src="assets/ui/tipeee.svg"
              style={{
                height: "1.25em",
                display: "inline-block"
              }}
            />
          </NavLink>
        )}

        {page !== "game" && (
          <NavLink
            svg="discord"
            className="discord"
            onClick={() => window.open("https://discord.gg/6JMS7tr", "_blank")}
          >
            Discord
          </NavLink>
        )}

        <NavLink svg="exit-door" className="red logout" onClick={leave}>
          {leaveLabel}
        </NavLink>
      </Menu>

      <Modals modal={modal} setModal={setModal} />
    </Sidebar>
  )
}

type NavLinkProps = MenuItemProps &
  NavPageLink & {
    svg?: string
    png?: string
    shimmer?: boolean
    className?: string
  }

type NavPageLink = {
  location?: Modals
  handleClick?: (update: Modals) => void
}

function NavLink(props: NavLinkProps) {
  const {
    children,
    location,
    handleClick,
    shimmer = false,
    svg,
    png,
    icon,
    className = "default",
    onClick
  } = props

  return (
    <MenuItem
      className={cc("menu-item", className, shimmer ? "shimmer" : "")}
      onClick={(e) => {
        onClick?.(e)
        if (location) {
          handleClick?.(location)
        }
      }}
      icon={
        <div className="icon">
          {shimmer && (
            <span className="notification">
              <img width={10} height={10} src="assets/ui/pokeball.svg" />
            </span>
          )}
          {svg ? (
            <img width={32} height={32} src={`assets/ui/${svg}.svg`} />
          ) : png ? (
            <img height={32} src={`assets/ui/${png}.png`} />
          ) : (
            icon
          )}
        </div>
      }
    >
      {children}
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
