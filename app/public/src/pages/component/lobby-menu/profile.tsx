import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { Title, TitleDescription, TitleName } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  changeAvatar,
  changeName,
  setTitle
} from "../../../stores/NetworkStore"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import PlayerBox from "./player-box"
import History from "./history"

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
        <PlayerBox user={user} />

        <Tabs>
          <TabList>
            <Tab>Name</Tab>
            <Tab>Avatar</Tab>
            <Tab>Title</Tab>
            <Tab>Game History</Tab>
          </TabList>

          <TabPanel>
            <div className="nes-container">
              <h3>Change Name</h3>
              <div className="nes-field is-inline" style={{ gap: "0.5em" }}>
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
                {pokemonCollection.length === 0 && (
                  <p>
                    Play more games to earn boosters and unlock new avatars !
                  </p>
                )}
                {pokemonCollection.map((pokemonConfig) => {
                  return pokemonConfig.emotions.map((emotion) => {
                    return (
                      <img
                        key={`normal-${pokemonConfig.id}${emotion}`}
                        className="clickable pokemon-portrait"
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
                        className="clickable pokemon-portrait"
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
            <ul className="titles">
              {Object.keys(Title).map((k, i) => (
                <li
                  key={k}
                  className={cc("clickable", {
                    unlocked: user.titles.includes(k as Title),
                    selected: user.title === k
                  })}
                  onClick={() => {
                    if (user.titles.includes(k as Title)) {
                      dispatch(setTitle(k))
                    }
                  }}
                >
                  <span>{TitleName[k]}</span>
                  <p>{TitleDescription[k]}</p>
                </li>
              ))}
            </ul>
          </TabPanel>
          <TabPanel>
            <History history={user.history} />
          </TabPanel>
        </Tabs>
      </>
    )
  } else {
    return null
  }
}
