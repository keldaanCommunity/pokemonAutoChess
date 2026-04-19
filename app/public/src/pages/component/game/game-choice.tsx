import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { PlayerChoice } from "../../../../../models/colyseus-models/player-choice"
import { type Item, ShinyItems } from "../../../../../types/enum/Item"
import {
  Pkm,
  PkmDuo,
  PkmDuos,
  PkmFamily
} from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { isIn } from "../../../../../utils/array"
import { DEPTH } from "../../../game/depths"
import { selectConnectedPlayer, useAppSelector } from "../../../hooks"
import { IDetailledPokemon } from "../../../models/bot-v2"
import { pickChoice } from "../../../network"
import { getGameScene } from "../../game"
import { playSound, SOUNDS } from "../../utils/audio"
import { addIconsToDescription } from "../../utils/descriptions"
import { LocalStoreKeys, localStore } from "../../utils/store"
import GamePokemonDuoPortrait from "./game-pokemon-duo-portrait"
import GamePokemonPortrait from "./game-pokemon-portrait"
import "./game-choice.css"

function isPokemonChoice(choice: PlayerChoice): boolean {
  return choice.pokemons.length > 0
}

export default function GameChoice() {
  const { t } = useTranslation()
  const connectedPlayer = useAppSelector(selectConnectedPlayer)
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)

  const life = connectedPlayer?.life ?? 0
  const choices = connectedPlayer?.choices ?? []

  const board = getGameScene()?.board
  const hasPokemonChoice = choices.some(isPokemonChoice)
  const containsDuo = choices.some((choice) =>
    choice.pokemons.some((pokemon) => pokemon in PkmDuo)
  )
  const isBenchFull =
    board && hasPokemonChoice && board.getBenchSize() >= (containsDuo ? 7 : 8)

  const [teamPlanner, setTeamPlanner] = useState<IDetailledPokemon[]>(
    localStore.get(LocalStoreKeys.TEAM_PLANNER)
  )

  useEffect(() => {
    const updateTeamPlanner = (event: StorageEvent) => {
      if (event.key === LocalStoreKeys.TEAM_PLANNER) {
        setTeamPlanner(localStore.get(LocalStoreKeys.TEAM_PLANNER))
      }
    }

    window.addEventListener("storage", updateTeamPlanner)

    return () => {
      window.removeEventListener("storage", updateTeamPlanner)
    }
  }, [])

  const [visible, setVisible] = useState(true)

  if (choices.length === 0 || life <= 0) {
    return null
  }

  const choice = choices[0] // only display one choice at a time, the others will be displayed after the first one is picked

  let message: string | null = null
  if (choice.type === "addPick") {
    message = t("player_choices.choose_add_pick")
  } else if (choice.type === "starter") {
    message =
      specialGameRule === SpecialGameRule.FIRST_PARTNER
        ? t("player_choices.choose_first_partner")
        : t("player_choices.choose_starter")
  } else if (choice.type === "mission_order") {
    message = t("player_choices.choose_mission_order")
  } else if (choice.type === "unique") {
    message = t("player_choices.choose_unique")
  } else if (choice.type === "legendary") {
    message = t("player_choices.choose_legendary")
  } else if (choice.type === "item") {
    message = t("player_choices.choose_item")
  } else if (choice.type === "wand") {
    message = t("player_choices.choose_wand")
  }

  return (
    <div className="game-choice" style={{ zIndex: DEPTH.MODAL }}>
      <div
        className="my-container"
        style={{ visibility: visible ? "visible" : "hidden" }}
      >
        {message && <h2>{message}</h2>}

        {choice.pokemons.length > 0 ? (
          <div className="game-choice-pokemons-list">
            {choice.pokemons.map((proposition, index) => {
              const item = choice.items[index]
              return (
                <div
                  key={`${choice.id}-${index}`}
                  className="my-box active clickable"
                  onClick={(event) => {
                    event.stopPropagation()
                    playSound(SOUNDS.BUTTON_CLICK)
                    pickChoice(choice.id, index)
                  }}
                >
                  {proposition in PkmDuos ? (
                    <GamePokemonDuoPortrait
                      key={`proposition-${choice.id}-${index}`}
                      origin="proposition"
                      index={index}
                      duo={proposition as PkmDuo}
                      inPlanner={
                        teamPlanner?.some(
                          (pokemon) =>
                            pokemon.name === proposition[0] ||
                            pokemon.name === proposition[1]
                        ) ?? false
                      }
                    />
                  ) : (
                    <GamePokemonPortrait
                      key={`proposition-${choice.id}-${index}`}
                      origin="proposition"
                      index={index}
                      pokemon={proposition as Pkm}
                      inPlanner={
                        teamPlanner?.some((pokemon) => {
                          if (proposition in PkmDuos) {
                            return PkmDuos[proposition].includes(pokemon.name)
                          }

                          return PkmFamily[pokemon.name] === proposition
                        }) ?? false
                      }
                    />
                  )}

                  {item && isIn(ShinyItems, item) === false && (
                    <div className="choice-additional-item">
                      <span
                        style={{
                          fontSize: "2rem",
                          verticalAlign: "middle"
                        }}
                      >
                        +
                      </span>
                      <img
                        style={{
                          width: "2rem",
                          height: "2rem",
                          verticalAlign: "middle"
                        }}
                        src={"assets/item/" + item + ".png"}
                      />
                      <p>
                        {addIconsToDescription(t(`item_description.${item}`))}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="game-choice-items-list">
            {choice.items.map((item: Item, index) => (
              <div
                className="my-box active clickable"
                key={`${choice.id}-${index}`}
                onClick={(event) => {
                  event.stopPropagation()
                  playSound(SOUNDS.BUTTON_CLICK)
                  pickChoice(choice.id, index)
                }}
              >
                <img
                  style={{ width: "4rem", height: "4rem" }}
                  src={"assets/item/" + item + ".png"}
                />
                <h3 style={{ margin: "0.25em 0" }}>{t(`item.${item}`)}</h3>
                <p style={{ marginBottom: "0.5em" }}>
                  {addIconsToDescription(t(`item_description.${item}`))}
                </p>
              </div>
            ))}
          </div>
        )}

        {isBenchFull && choice.pokemons.length > 0 && (
          <p>{t("player_choices.free_slot_hint")}</p>
        )}
      </div>

      <div className="show-hide-action">
        <button
          className="bubbly orange active"
          onClick={() => {
            setVisible(!visible)
          }}
        >
          {visible ? t("hide") : t("show")}
        </button>
      </div>
    </div>
  )
}
