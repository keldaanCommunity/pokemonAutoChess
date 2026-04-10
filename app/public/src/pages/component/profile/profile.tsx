import firebase from "firebase/compat/app"
import React, { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import { ISuggestionUser, Role, Title } from "../../../../../types"
import { debounce } from "../../../../../utils/function"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  ban,
  giveBooster,
  giveRole,
  giveTitle,
  searchById,
  unban
} from "../../../network"
import { setSearchedUser } from "../../../stores/LobbyStore"
import { AccountTab } from "./account-tab"
import { AvatarTab } from "./avatar-tab"
import { GadgetsTab } from "./gadgets-tab"
import GameHistory from "./game-history"
import PlayerBox from "./player-box"
import { ProfileChatHistory } from "./profile-chat-history"
import { ProgressTab } from "./progress-tab"
import { SearchBar } from "./search-bar"
import SearchResults from "./search-results"
import { TitleTab } from "./title-tab"
import "./profile.css"

export default function Profile() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const [suggestions, setSuggestions] = useState<ISuggestionUser[]>([])
  const searchedUser = useAppSelector((state) => state.lobby.searchedUser)

  const profile = searchedUser ?? user
  const [gameHistory, setGameHistory] = useState<IGameRecord[]>([])
  const [rightPanel, setRightPanel] = useState<"chat" | "game">("game")

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const abortControllerRef = useRef<AbortController | null>(null)

  async function searchName(query: string) {
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    setLoading(true)
    setError("")
    try {
      const token = await firebase.auth().currentUser?.getIdToken()
      const res = await fetch(`/players?name=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        signal
      })
      if (res.ok) {
        const suggestions = await res.json()
        if (suggestions.length === 0) {
          setError(t("no_results_found"))
        } else {
          setSuggestions(suggestions)
          setError("")
        }
      } else {
        setError(res.statusText)
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message)
      }
    }
    setLoading(false)
  }

  const debouncedSearchName = useRef(debounce(searchName, 500)).current

  function onSearchQueryChange(query: string) {
    abortControllerRef.current?.abort()
    if (query) {
      debouncedSearchName(query)
    } else {
      resetSearch()
    }
  }

  const resetSearch = useCallback(
    (user = searchedUser) => {
      dispatch(setSearchedUser(user))
      setSuggestions([])
      setError("")
    },
    [dispatch]
  )

  return (
    <div className="profile-modal">
      <div className="profile-box">
        <h2>
          {profile?.displayName ?? ""} {t("profile")}
        </h2>
        {profile && <PlayerBox user={profile} history={gameHistory} />}
      </div>

      <SearchBar onChange={onSearchQueryChange} />

      <div className="profile-actions">
        {loading ? (
          <div className="loading">{t("loading")}</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : searchedUser ? (
          <OtherProfileActions
            rightPanel={rightPanel}
            setRightPanel={setRightPanel}
          />
        ) : suggestions.length > 0 ? (
          <SearchResults
            suggestions={suggestions}
            onSelect={(suggestion) => searchById(suggestion.id)}
          />
        ) : (
          <MyProfileMenu />
        )}
      </div>

      {rightPanel === "game" && profile && (
        <GameHistory uid={profile.uid} onUpdate={setGameHistory} />
      )}
      {rightPanel === "chat" && profile && (
        <ProfileChatHistory uid={profile.uid} />
      )}
    </div>
  )
}

function MyProfileMenu() {
  const { t } = useTranslation()
  return (
    <Tabs>
      <TabList>
        <Tab>{t("progress")}</Tab>
        <Tab>{t("avatar")}</Tab>
        <Tab>{t("title_label")}</Tab>
        <Tab>{t("gadgets")}</Tab>
        <Tab>{t("account")}</Tab>
      </TabList>

      <TabPanel>
        <ProgressTab />
      </TabPanel>
      <TabPanel>
        <AvatarTab />
      </TabPanel>
      <TabPanel>
        <TitleTab />
      </TabPanel>
      <TabPanel>
        <GadgetsTab />
      </TabPanel>
      <TabPanel>
        <AccountTab />
      </TabPanel>
    </Tabs>
  )
}

function OtherProfileActions(props: {
  rightPanel: "game" | "chat"
  setRightPanel: React.Dispatch<React.SetStateAction<"game" | "chat">>
}) {
  const { t } = useTranslation()
  const currentUid = useAppSelector((state) => state.network.profile?.uid)
  const role = useAppSelector((state) => state.network.profile?.role)
  const user = useAppSelector((state) => state.lobby.searchedUser)
  const [title, setTitle] = useState<Title>(user?.title || Title.ACE_TRAINER)
  const [profileRole, setProfileRole] = useState<Role>(user?.role ?? Role.BASIC)

  const giveButton =
    user && role && role === Role.ADMIN ? (
      <button
        className="bubbly green"
        onClick={() => {
          giveBooster({
            numberOfBoosters: Number(prompt("How many boosters ?")) || 1,
            uid: user.uid
          })
        }}
      >
        {t("give_boosters")}
      </button>
    ) : null

  const banButton =
    user && role && (role === Role.ADMIN || role === Role.MODERATOR) ? (
      <button
        className="bubbly red"
        onClick={() => {
          const reason = prompt(`Reason for the ban:`)
          ban({ uid: user.uid, reason: reason ?? "" })
        }}
      >
        {t("ban_user")}
      </button>
    ) : null

  const unbanButton =
    user && role && (role === Role.ADMIN || role === Role.MODERATOR) ? (
      <button
        className="bubbly red"
        onClick={() => {
          const reason = prompt(`Reason for the unban:`)
          unban({ uid: user.uid, reason: reason ?? "" })
        }}
      >
        {t("unban_user")}
      </button>
    ) : null

  const chatHistoryButton =
    user && role && (role === Role.ADMIN || role === Role.MODERATOR) ? (
      <button
        className="bubbly blue"
        onClick={() => {
          props.setRightPanel("chat")
        }}
      >
        {t("see_chat_history")}
      </button>
    ) : null

  const gameHistoryButton =
    user && role && (role === Role.ADMIN || role === Role.MODERATOR) ? (
      <button
        className="bubbly blue"
        onClick={() => {
          props.setRightPanel("game")
        }}
      >
        {t("see_game_history")}
      </button>
    ) : null

  const roleButton =
    user && role && role === Role.ADMIN ? (
      <div className="my-input-group">
        <button
          className="bubbly orange"
          onClick={() => {
            giveRole({ uid: user.uid, role: profileRole })
            alert(`Role ${profileRole} given to ${user.displayName}`)
          }}
        >
          {t("give_role")}
        </button>
        <select
          value={profileRole}
          onChange={(e) => {
            setProfileRole(e.target.value as Role)
          }}
        >
          {Object.keys(Role).map((r) => (
            <option key={r} value={r}>
              {t("role." + r).toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    ) : null

  const titleButton =
    user && role && role === Role.ADMIN ? (
      <div className="my-input-group">
        <button
          className="bubbly blue"
          onClick={() => {
            giveTitle({ uid: user.uid, title: title })
            alert(`Title ${title} given to ${user.displayName}`)
          }}
        >
          {t("give_title")}
        </button>
        <select
          value={title}
          onChange={(e) => {
            setTitle(e.target.value as Title)
          }}
        >
          {Object.keys(Title).map((ti) => (
            <option key={ti} value={ti}>
              {ti}
            </option>
          ))}
        </select>
      </div>
    ) : null

  return role === Role.ADMIN || role === Role.MODERATOR ? (
    <>
      {giveButton}
      {roleButton}
      {titleButton}
      {user?.banned ? unbanButton : banButton}
      {props.rightPanel === "game" ? chatHistoryButton : gameHistoryButton}
      {currentUid && user && user.uid !== currentUid && (
        <button className="bubbly blue" onClick={() => searchById(currentUid)}>
          {t("back_to_my_profile")}
        </button>
      )}
    </>
  ) : null
}
