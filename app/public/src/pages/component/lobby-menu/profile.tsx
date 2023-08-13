import React, { useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { t } from "i18next"
import { Title } from "../../../../../types"
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
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"

export default function Profile() {
  const { user } = useAppSelector((state) => ({
    user: state.lobby.user
  }))

  if (!user) {
    return null
  }

  return (
    <div className="profile-container nes-container">
      <PlayerBox user={user} />

      <Tabs>
        <TabList>
          <Tab>{t("name")}</Tab>
          <Tab>{t("avatar")}</Tab>
          <Tab>{t("title_label")}</Tab>
          <Tab>{t("game_history")}</Tab>
        </TabList>

        <TabPanel>
          <NameTab user={user} />
        </TabPanel>
        <TabPanel>
          <AvatarTab />
        </TabPanel>
        <TabPanel>
          <TitleTab user={user} />
        </TabPanel>
        <TabPanel>
          <History history={user.history} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

function NameTab({ user }: { user: ILobbyUser }) {
  const [inputValue, setInputValue] = useState<string>("")
  const dispatch = useAppDispatch()

  if (user.anonymous) {
    return (
      <div className="nes-container">
        <p>{t("anonymous_users_name_hint")}</p>
      </div>
    )
  }

  return (
    <div className="nes-container">
      <h3>{t("change_name")}</h3>
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
          {t("change")}
        </button>
      </div>
    </div>
  )
}

function AvatarTab() {
  const dispatch = useAppDispatch()
  const pokemonCollection = useAppSelector(
    (state) => state.lobby.pokemonCollection
  )

  return (
    <div className="nes-container">
      <h3>{t("change_avatar")}</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {pokemonCollection.length === 0 && <p>{t("play_more_games_hint")}</p>}
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
  )
}

function TitleTab({ user }: { user: ILobbyUser }) {
  const dispatch = useAppDispatch()
  return (
    <ul className="titles">
      {Object.keys(Title).map((k) => (
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
          <span>{t(`title.${k}`)}</span>
          <p>{t(`title_description.${k}`)}</p>
        </li>
      ))}
    </ul>
  )
}
