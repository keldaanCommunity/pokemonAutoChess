import React, { useState } from "react"
import History from "./history"
import { Role, Title } from "../../../../../types"
import Elo from "../elo"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  searchName,
  searchById,
  giveBooster,
  setModerator,
  giveTitle,
  ban
} from "../../../stores/NetworkStore"
import { RoleBadge } from "../RoleBadge"
import { getAvatarSrc } from "../../../utils"

export default function Search() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.searchedUser)
  const suggestions = useAppSelector((state) => state.lobby.suggestions)
  const [currentText, setCurrentText] = useState<string>("")
  const role = useAppSelector((state) => state.lobby.user?.role)
  const [t, setT] = useState<Title>(Title.ACE_TRAINER)
  const giveButton =
    user && role && role === Role.ADMIN ? (
      <button
        className="bubbly-success"
        onClick={() => {
          dispatch(giveBooster({ numberOfBoosters: 1, uid: user.id }))
        }}
      >
        <p style={{ margin: "0px" }}>Give 1 booster</p>
      </button>
    ) : null

  const banButton =
    user && role && (role === Role.ADMIN || role === Role.MODERATOR) ? (
      <button
        className="bubbly-error"
        onClick={() => {
          dispatch(ban(user.id))
        }}
      >
        <p style={{ margin: "0px" }}>Ban User</p>
      </button>
    ) : null
  const modButton =
    user && role && role === Role.ADMIN ? (
      <button
        className="bubbly-warning"
        onClick={() => {
          dispatch(setModerator(user.id))
        }}
      >
        <p style={{ margin: "0px" }}>Set Moderator</p>
      </button>
    ) : null
  const titleButton =
    user && role && role === Role.ADMIN ? (
      <div style={{ display: "flex" }}>
        <select
          value={t}
          onChange={(e) => {
            setT(e.target.value as Title)
          }}
        >
          {Object.keys(Title).map((ti) => (
            <option key={ti} value={ti}>
              {ti}
            </option>
          ))}
        </select>
        <button
          className="bubbly-primary"
          onClick={() => {
            dispatch(giveTitle({ uid: user.id, title: t }))
          }}
        >
          Give Title
        </button>
      </div>
    ) : null

  return (
    <div>
      <div className="nes-field is-inline">
        <input
          type="text"
          id="inline_field"
          className="my-input"
          placeholder="Player Name..."
          value={currentText}
          onChange={(e) => {
            setCurrentText(e.target.value)
            dispatch(searchName(e.target.value))
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "10px",
          justifyContent: "space-around"
        }}
      >
        {suggestions.map((suggestion) => (
          <div
            style={{ display: "flex", flexFlow: "column", padding: "5px" }}
            className="playerBox my-cursor"
            key={suggestion.id}
            onClick={(e) => {
              dispatch(searchById(suggestion.id))
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                style={{ width: "40px", height: "40px" }}
                src={getAvatarSrc(suggestion.avatar)}
              />
            </div>
            <div style={{ display: "flex", flexFlow: "column" }}>
              <p style={{ margin: "0px", padding: "0px" }}>
                {suggestion.name}{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
      {user ? (
        <div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "30px" }}
          >
            <img src={getAvatarSrc(user.avatar)} />
            <h5>{user.name}</h5>
            <RoleBadge role={user.role} />
            <Elo elo={user.elo} />
          </div>
          <p>
            Level {user.level} ({user.exp} / 1000)
          </p>
          <p>Wins: {user.wins}</p>
          {modButton}
          {giveButton}
          {titleButton}
          {banButton}
          <h5>Game History</h5>
          <History history={user.history} />
        </div>
      ) : null}
    </div>
  )
}
