import React, { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import GamePokemonPortrait from "./game-pokemon-portrait"
import GamePokemonDuoPortrait from "./game-pokemon-duo-portrait"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { pokemonPropositionClick } from "../../../stores/NetworkStore"
import { AdditionalPicksStages } from "../../../../../types/Config"
import { getGameScene } from "../../game"
import { Pkm, PkmDuo, PkmDuos } from "../../../../../types/enum/Pokemon"
import { useTranslation } from "react-i18next"
import { addIconsToDescription } from "../../utils/descriptions"
import "./game-pokemon-propositions.css"

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

  const board = getGameScene()?.board
  const isBenchFull =
    board &&
    board.getBenchSize() >=
      (pokemonsProposition.some((p) => p in PkmDuo) ? 7 : 8)
  const life = useAppSelector((state) => state.game.currentPlayerLife)

  const [visible, setVisible] = useState(true)
  if (pokemonsProposition.length > 0 && life > 0) {
    return (
      <div className="game-pokemons-proposition">
        <div
          className="nes-container"
          style={{ visibility: visible ? "visible" : "hidden" }}
        >
          {AdditionalPicksStages.includes(stageLevel) && (
            <h2>{t("pick_additional_pokemon_hint")}</h2>
          )}
          <div className="game-pokemons-proposition-list">
            {pokemonsProposition.map((proposition, index) => {
              const item = itemsProposition[index]
              return (
                <div
                  key={index}
                  className="nes-container active"
                  onClick={() => dispatch(pokemonPropositionClick(proposition))}
                >
                  {proposition in PkmDuos ? (
                    <GamePokemonDuoPortrait
                      key={"proposition" + index}
                      origin="proposition"
                      index={index}
                      duo={proposition as PkmDuo}
                    />
                  ) : (
                    <GamePokemonPortrait
                      key={"proposition" + index}
                      origin="proposition"
                      index={index}
                      pokemon={PokemonFactory.createPokemonFromName(
                        proposition as Pkm
                      )}
                    />
                  )}
                  {item && (
                    <div className="additional-pick-item ">
                      <span
                        style={{
                          fontSize: "48px",
                          verticalAlign: "middle"
                        }}
                      >
                        +
                      </span>
                      <img
                        style={{
                          width: "48px",
                          height: "48px",
                          imageRendering: "pixelated",
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
      </div>
    )
  } else {
    return null
  }
}
