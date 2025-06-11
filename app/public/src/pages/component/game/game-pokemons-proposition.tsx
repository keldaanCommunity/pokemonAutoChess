import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AdditionalPicksStages } from "../../../../../types/Config"
import { ShinyItems } from "../../../../../types/enum/Item"
import { Pkm, PkmDuo, PkmDuos } from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { pokemonPropositionClick } from "../../../stores/NetworkStore"
import { getGameScene } from "../../game"
import { playSound, SOUNDS } from "../../utils/audio"
import { addIconsToDescription } from "../../utils/descriptions"
import GamePokemonDuoPortrait from "./game-pokemon-duo-portrait"
import GamePokemonPortrait from "./game-pokemon-portrait"
import { IDetailledPokemon } from "../../../../../models/mongo-models/bot-v2"
import { localStore, LocalStoreKeys } from "../../utils/store"
import "./game-pokemon-propositions.css"
import { DEPTH } from "../../../game/depths"

export default function GamePokemonsPropositions() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const pokemonsProposition = useAppSelector(
    (state) => state.game.pokemonsProposition
  )
  const itemsProposition = useAppSelector(
    (state) => state.game.itemsProposition
  )
  const stageLevel = useAppSelector((state) => state.game.stageLevel)
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)

  const board = getGameScene()?.board
  const isBenchFull =
    board &&
    board.getBenchSize() >=
    (pokemonsProposition.some((p) => p in PkmDuo) ? 7 : 8)
  const life = useAppSelector((state) => state.game.players.find((p) => p.id === state.network.uid)?.life ?? 0)
  const [teamPlanner, setTeamPlanner] = useState<IDetailledPokemon[]>(localStore.get(LocalStoreKeys.TEAM_PLANNER))
  useEffect(() => {
    const updateTeamPlanner = (e: StorageEvent) => {
      if (e.key === LocalStoreKeys.TEAM_PLANNER) {
        setTeamPlanner(localStore.get(LocalStoreKeys.TEAM_PLANNER))
      }
    }
    window.addEventListener("storage", updateTeamPlanner)
    return () => {
      window.removeEventListener("storage", updateTeamPlanner)
    }
  }, [])

  const [visible, setVisible] = useState(true)
  if (pokemonsProposition.length > 0 && life > 0) {
    return (
      <div className="game-pokemons-proposition" style={{zIndex: DEPTH.TOOLTIP}}>
        <div
          className="my-container"
          style={{ visibility: visible ? "visible" : "hidden" }}
        >
          {AdditionalPicksStages.includes(stageLevel) && (
            <h2>{t("pick_additional_pokemon_hint")}</h2>
          )}
          {stageLevel === 1 && specialGameRule === SpecialGameRule.FIRST_PARTNER && <h2>{t("pick_first_partner_hint")}</h2>}
          <div className="game-pokemons-proposition-list">
            {pokemonsProposition.map((proposition, index) => {
              const item = itemsProposition[index]
              return (
                <div
                  key={index}
                  className="my-box active clickable"
                  onClick={(e) => {
                    e.stopPropagation()
                    playSound(SOUNDS.BUTTON_CLICK)
                    dispatch(pokemonPropositionClick(proposition))
                  }}
                >
                  {proposition in PkmDuos ? (
                    <GamePokemonDuoPortrait
                      key={"proposition" + index}
                      origin="proposition"
                      index={index}
                      duo={proposition as PkmDuo}
                      inPlanner={teamPlanner?.some(p => p.name === proposition[0] || p.name === proposition[1]) ?? false}
                    />
                  ) : (
                    <GamePokemonPortrait
                      key={"proposition" + index}
                      origin="proposition"
                      index={index}
                      pokemon={proposition as Pkm}
                      inPlanner={teamPlanner?.some(p => p.name === proposition) ?? false}
                    />
                  )}
                  {item && ShinyItems.includes(item) === false && (
                    <div className="additional-pick-item ">
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
          {isBenchFull && <p>{t("free_slot_hint")}</p>}
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
      </div >
    )
  } else {
    return null
  }
}
