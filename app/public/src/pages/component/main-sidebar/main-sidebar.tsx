import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Menu, MenuItem, MenuItemProps, Sidebar } from "react-pro-sidebar"
import { useNavigate } from "react-router"
import pkg from "../../../../../../package.json"
import { GADGETS } from "../../../../../core/gadgets"
import { Role } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setSearchedUser } from "../../../stores/LobbyStore"
import { cc } from "../../utils/jsx"
import Booster from "../booster/booster"
import TeamBuilderModal from "../bot-builder/team-builder-modal"
import PokemonCollection from "../collection/pokemon-collection"
import GameOptionsModal from "../options/game-options-modal"
import Jukebox from "../jukebox/jukebox"
import MetaReport from "../meta-report/meta-report"
import { Modal } from "../modal/modal"
import Patchnotes from "../patchnotes/patchnotes"
import { usePatchVersion } from "../patchnotes/usePatchVersion"
import Profile from "../profile/profile"
import { TournamentsAdmin } from "../tournaments-admin/tournaments-admin"
import Wiki from "../wiki/wiki"

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

  const { t } = useTranslation()
  const user = useAppSelector((state) => state.lobby.user)
  const profile = useAppSelector((state) => state.network.profile)
  const profileLevel = profile?.level ?? 0

  const { isNewPatch, updateVersionChecked } = usePatchVersion()

  const version = pkg.version

  const numberOfBooster = profile?.booster ?? 0

  useEffect(() => {
    if (!sidebarRef.current) {
      return
    }

    const ref = sidebarRef.current

    const extendSidebar = () => setCollapsed(false)
    const collapseSidebar = () => setCollapsed(true)

    ref.addEventListener("mouseenter", extendSidebar)
    ref.addEventListener("mouseleave", collapseSidebar)

    return () => {
      if (ref) {
        ref.removeEventListener("mouseenter", extendSidebar)
        ref.removeEventListener("mouseleave", collapseSidebar)
      }
    }
  }, [collapsed])

  return (
    <Sidebar collapsed={collapsed} className="sidebar" ref={sidebarRef}>
      <Menu>
        <div className="sidebar-logo" onClick={() => setCollapsed(!collapsed)}>
          <img src={`assets/ui/colyseus-icon.png`} />
          <div>
            <h1>Pokemon Auto Chess</h1>
            <small>v{version}</small>
          </div>
        </div>

        <NavLink
          svg="meta"
          onClick={() =>
            window.open(
              "https://github.com/keldaanCommunity/pokemonAutoChess/blob/master/policy.md",
              "_blank"
            )
          }
        >
          {t("policy")}
        </NavLink>

        <NavLink
          location="news"
          svg="newspaper"
          handleClick={(newModal) => {
            changeModal(newModal)
            if (isNewPatch) {
              updateVersionChecked()
            }
          }}
          shimmer={isNewPatch}
        >
          {t("news")}
        </NavLink>

        {page === "main_lobby" && (
          <NavLink location="profile" svg="profile" handleClick={changeModal}>
            {t("profile")}
          </NavLink>
        )}

        {page === "main_lobby" && profileLevel >= GADGETS.BAG.levelRequired && (
          <NavLink
            location="collection"
            svg="collection"
            className="blue"
            handleClick={changeModal}
          >
            {t("collection")}
          </NavLink>
        )}
        {page === "main_lobby" && profileLevel >= GADGETS.BAG.levelRequired && (
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
        <NavLink
          svg="meta"
          className="green"
          location="meta"
          handleClick={changeModal}
        >
          {t("meta")}
        </NavLink>

        {profileLevel >= GADGETS.TEAM_PLANNER.levelRequired && (
          <NavLink
            svg="team-builder"
            location="team-builder"
            handleClick={changeModal}
          >
            {t("team_builder")}
          </NavLink>
        )}

        {page !== "game" &&
          user?.anonymous === false &&
          profileLevel >= GADGETS.BOT_BUILDER.levelRequired && (
            <NavLink svg="bot" onClick={() => navigate("/bot-builder")}>
              {t("bot_builder")}
            </NavLink>
          )}

        {page !== "game" && user?.role === Role.ADMIN && (
          <>
            <NavLink
              svg="pokemon-sprite"
              onClick={() => navigate("/sprite-viewer")}
            >
              Sprite Viewer
            </NavLink>
            <NavLink svg="map" onClick={() => navigate("/map-viewer")}>
              Map Viewer
            </NavLink>
            <NavLink
              svg="tournament"
              location="tournaments"
              handleClick={changeModal}
            >
              Tournaments
            </NavLink>
          </>
        )}

        {page === "game" && profileLevel >= GADGETS.JUKEBOX.levelRequired && (
          <NavLink
            svg="compact-disc"
            location="jukebox"
            handleClick={changeModal}
          >
            Jukebox
          </NavLink>
        )}

        <NavLink svg="options" location="options" handleClick={changeModal}>
          {t("options")}
        </NavLink>

        <div className="spacer"></div>

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

      <Modals modal={modal} setModal={setModal} page={page} />
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
  | "profile"
  | "meta"
  | "wiki"
  | "team-builder"
  | "collection"
  | "booster"
  | "news"
  | "options"
  | "keybinds"
  | "jukebox"
  | "announcement"
  | "tournaments"

function Modals({
  modal,
  setModal,
  page
}: {
  modal?: Modals
  setModal: (nextModal?: Modals) => void
  page: Page
}) {
  const { t } = useTranslation()
  const searchedUser = useAppSelector((state) => state.lobby.searchedUser)

  const dispatch = useAppDispatch()

  const closeModal = useCallback(() => setModal(undefined), [setModal])

  useEffect(() => {
    if (searchedUser && modal !== "profile") {
      setModal("profile")
    }
  }, [modal, searchedUser, setModal])

  return (
    <>
      <Modal
        onClose={closeModal}
        show={modal === "news"}
        header={t("patch_notes")}
        className="patchnotes">
        <Patchnotes />
      </Modal>
      <Modal
        onClose={() => {
          closeModal()
          dispatch(setSearchedUser(undefined))
        }}
        show={modal === "profile"}
        header={t("profile")}>
        <Profile />
      </Modal>
      <Modal
        onClose={closeModal}
        show={modal === "collection"}
        header={t("collection")}
        className="anchor-top">
        <PokemonCollection />
      </Modal>
      <Modal
        onClose={closeModal}
        show={modal === "booster"}
        className="custom-bg">
        <Booster />
      </Modal>
      <Modal
        onClose={closeModal}
        show={modal === "wiki"}
        className="wiki-modal"
        header={t("wiki")}>
        <Wiki inGame={page === "game"} />
      </Modal>
      <Modal
        show={modal === "meta"}
        header={t("meta")}
        onClose={closeModal}>
        <MetaReport />
      </Modal>
      <TeamBuilderModal
        show={modal === "team-builder"}
        handleClose={closeModal}
      />
      <GameOptionsModal
        show={modal === "options"}
        page={page}
        hideModal={closeModal}
      />
      <Modal
        onClose={closeModal}
        show={modal === "tournaments"}
        header="Tournaments">
        <TournamentsAdmin />
      </Modal>
      <Jukebox show={modal === "jukebox"} handleClose={closeModal} />
    </>
  )
}
