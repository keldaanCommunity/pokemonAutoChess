import React, { useState } from "react"
import { Title, TitleDescription, TitleName } from "../../../../../types"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import Elo from "../elo"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  changeAvatar,
  changeName,
  setTitle
} from "../../../stores/NetworkStore"
import { RoleBadge } from "../RoleBadge"
import { getAvatarSrc, getPortraitSrc } from "../../../utils"

export default function Profile() {
  const dispatch = useAppDispatch()
  const [inputValue, setInputValue] = useState<string>("")
  const user = useAppSelector((state) => state.lobby.user)
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )

  if (user) {
    return (
      <>
        <div className="player-box" style={{ marginBottom: "1em" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
              <img src={getAvatarSrc(user.avatar)} />
              <p style={{ color: "#ffc107" }}>{TitleName[user.title]}</p>
              <RoleBadge role={user.role} />
              <p>{user.name}</p>
            </div>
            <p>
              Level {user.level} ({user.exp} / 1000)
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Elo elo={user.elo} />
            </div>
            <p>Wins: {user.wins}</p>
          </div>
        </div>

        <Tabs>
          <TabList>
            <Tab>Name</Tab>
            <Tab>Avatar</Tab>
            <Tab>Title</Tab>
          </TabList>

          <TabPanel>
            <div className="nes-container">
              <h3>Change Name</h3>
              <div className="nes-field is-inline" style={{gap: "0.5em"}}>
                <input
                  type="text"
                  className="my-input"
                  placeholder={user.name}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                  }}
                />
                <button
                  className="bubbly blue"
                  onClick={() => dispatch(changeName(inputValue))}
                >
                  Change
                </button>
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="nes-container">
              <h3>Change Avatar</h3>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {pokemonCollection.length === 0 && <p>Play more games to earn boosters and unlock new avatars !</p>}
                {pokemonCollection.map((pokemonConfig) => {
                  return pokemonConfig.emotions.map((emotion) => {
                    return (
                      <img
                        key={`normal-${pokemonConfig.id}${emotion}`}
                        className="clickable"
                        onClick={() => {
                          dispatch(
                            changeAvatar({
                              index: pokemonConfig.id,
                              emotion: emotion,
                              shiny: false
                            })
                          )
                        }}
                        src={getPortraitSrc(pokemonConfig.id, false, emotion)}
                      ></img>
                    )
                  })
                })}
                {pokemonCollection.map((pokemonConfig) => {
                  return pokemonConfig.shinyEmotions.map((emotion) => {
                    return (
                      <img
                        key={`shiny-${pokemonConfig.id}${emotion}`}
                        className="clickable"
                        onClick={() => {
                          dispatch(
                            changeAvatar({
                              index: pokemonConfig.id,
                              emotion: emotion,
                              shiny: true
                            })
                          )
                        }}
                        src={getPortraitSrc(pokemonConfig.id, true, emotion)}
                      ></img>
                    )
                  })
                })}
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <ul className="titles" style={{ display: "flex", flexDirection: "column", padding: 0 }}>
              {Object.keys(Title).map((k,i) => (
                <li key={k} style={{ 
                  padding: "0.5em",
                  listStyle: "none",
                  backgroundColor: i%2 ? '#54596b' : '#61738a'
                }}>
                  <h5
                    onClick={() => {
                      if (user.titles.includes(k as Title)) {
                        dispatch(setTitle(k))
                      }
                    }}
                    style={{ color: user.title === k ? '#ffc107' : user.titles.includes(k as Title) ? "#92cc41" : "#db5e6a" }}
                    className="clickable"
                  >
                    {TitleName[k]}
                  </h5>
                  <p style={{ 
                    margin: 0, 
                    color: user.titles.includes(k as Title) ? '#ffffff' : '#a0a0a0'
                  }}>{TitleDescription[k]}</p>
                </li>
              ))}
            </ul>
          </TabPanel>
        </Tabs>
      </>
    )
  } else {
    return null
  }
}
