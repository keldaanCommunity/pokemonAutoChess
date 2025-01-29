import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { IGameRecord } from "../../../../../models/colyseus-models/game-record"
import { Role, Title } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { setSearchedUser, setSuggestions } from "../../../stores/LobbyStore"
import {
  ban,
  giveBooster,
  giveRole,
  giveTitle,
  heapSnapshot,
  searchName,
  unban
} from "../../../stores/NetworkStore"
import { AvatarTab } from "./avatar-tab"
import { GadgetsTab } from "./gadgets-tab"
import History from "./history"
import { NameTab } from "./name-tab"
import PlayerBox from "./player-box"
import "./profile.css"
import { SearchBar } from "./search-bar"
import SearchResults from "./search-results"
import { TitleTab } from "./title-tab"

export default function Profile() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.network.profile)
  const suggestions = useAppSelector((state) => state.lobby.suggestions)
  const searchedUser = useAppSelector((state) => state.lobby.searchedUser)

  const profile = searchedUser ?? user
  const [gameHistory, setGameHistory] = useState<IGameRecord[]>([])

  function onSearchQueryChange(query: string) {
    if (query) {
      dispatch(searchName(query))
    } else {
      resetSearch()
    }
  }

  const resetSearch = useCallback(() => {
    dispatch(setSearchedUser(undefined))
    dispatch(setSuggestions([]))
  }, [dispatch])

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
        {searchedUser ? (
          <OtherProfileActions resetSearch={resetSearch} />
        ) : suggestions.length > 0 ? (
          <SearchResults />
        ) : (
          <MyProfileMenu />
        )}
      </div>

      {profile && <History uid={profile.uid} onUpdate={setGameHistory} />}
    </div>
  )
}

function MyProfileMenu() {
  const { t } = useTranslation()
  return (
    <Tabs>
      <TabList>
        <Tab>{t("name")}</Tab>
        <Tab>{t("avatar")}</Tab>
        <Tab>{t("title_label")}</Tab>
        <Tab>{t("gadgets")}</Tab>
      </TabList>

      <TabPanel>
        <NameTab />
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
    </Tabs>
  )
}

function OtherProfileActions({ resetSearch }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.network.profile?.role)
  const user = useAppSelector((state) => state.lobby.searchedUser)
  const [title, setTitle] = useState<Title>(user?.title || Title.ACE_TRAINER)
  const [profileRole, setProfileRole] = useState<Role>(user?.role ?? Role.BASIC)

  const giveButton =
    user && role && role === Role.ADMIN ? (
      <button
        className="bubbly green"
        onClick={() => {
          dispatch(
            giveBooster({
              numberOfBoosters: Number(prompt("How many boosters ?")) || 1,
              uid: user.uid
            })
          )
        }}
      >{t("give_boosters")}
      </button>
    ) : null

  const heapSnapshotButton =
    user && role && role === Role.ADMIN ? (
      <button
        className="bubbly red"
        onClick={() => {
          dispatch(heapSnapshot())
        }}
      >
        {t("heap_snapshot")}
      </button>
    ) : null

  const banButton =
    user && role && (role === Role.ADMIN || role === Role.MODERATOR) ? (
      <button
        className="bubbly red"
        onClick={() => {
          const reason = prompt(`Reason for the ban:`)
          dispatch(ban({ uid: user.uid, reason: reason ? reason : "" }))
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
          dispatch(unban({ uid: user.uid, name: user.displayName }))
        }}
      >
        {t("unban_user")}
      </button>
    ) : null

  const roleButton =
    user && role && role === Role.ADMIN ? (
      <div className="my-input-group">
        <button
          className="bubbly orange"
          onClick={() => {
            dispatch(giveRole({ uid: user.uid, role: profileRole }))
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
            dispatch(giveTitle({ uid: user.uid, title: title }))
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
      {heapSnapshotButton}
      {roleButton}
      {titleButton}
      {user?.banned ? unbanButton : banButton}
      <button className="bubbly blue" onClick={resetSearch}>
        {t("back_to_my_profile")}
      </button>
    </>
  ) : null
}
