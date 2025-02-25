import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { DishByPkm } from "../../../../../core/dishes"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { addIconsToDescription } from "../../utils/descriptions"
import { AbilityTooltip } from "../ability/ability-tooltip"
import SynergyIcon from "../icons/synergy-icon"
import { cc } from "../../utils/jsx"
import { usePreference } from "../../../preferences"
import "./game-pokemon-detail.css"

export function GamePokemonDetail(props: {
  pokemon: Pkm | Pokemon
  shiny?: boolean
  emotion?: Emotion
}) {
  const [antialiasing] = usePreference("antialiasing")
  const { t } = useTranslation()
  const pokemon: Pokemon = useMemo(
    () =>
      typeof props.pokemon === "string"
        ? PokemonFactory.createPokemonFromName(props.pokemon)
        : props.pokemon,
    [props.pokemon]
  )

  const pokemonStats = useMemo(
    () => [
      { stat: Stat.HP, value: pokemon.hp },
      { stat: Stat.DEF, value: pokemon.def },
      { stat: Stat.ATK, value: pokemon.atk },
      { stat: Stat.RANGE, value: pokemon.range },
      { stat: Stat.PP, value: pokemon.maxPP },
      { stat: Stat.SPE_DEF, value: pokemon.speDef },
      { stat: Stat.SPEED, value: pokemon.speed }
    ],
    [
      pokemon.atk,
      pokemon.def,
      pokemon.hp,
      pokemon.maxPP,
      pokemon.range,
      pokemon.speed,
      pokemon.speDef
    ]
  )

  return (
    <div className="game-pokemon-detail in-shop">
      <img
        className={cc("game-pokemon-detail-portrait", {
          pixelated: !antialiasing
        })}
        style={{ borderColor: RarityColor[pokemon.rarity] }}
        src={getPortraitSrc(
          pokemon.index,
          props.shiny ?? pokemon.shiny,
          props.emotion ?? pokemon.emotion
        )}
      />
      <div className="game-pokemon-detail-entry">
        <p className="game-pokemon-detail-entry-name">
          {t(`pkm.${pokemon.name}`)}
        </p>
        <p
          className="game-pokemon-detail-entry-rarity"
          style={{ color: RarityColor[pokemon.rarity] }}
        >
          {t(`rarity.${pokemon.rarity}`)}
        </p>
        <p className="game-pokemon-detail-entry-tier">
          {Array.from({ length: pokemon.stars }, (_, index) => (
            <img key={index} src="assets/ui/star.svg" height="16"></img>
          ))}
          {Array.from(
            { length: getPokemonData(pokemon.name).stages - pokemon.stars },
            (_, index) => (
              <img key={index} src="assets/ui/star_empty.svg" height="16"></img>
            )
          )}
        </p>
      </div>

      <div className="game-pokemon-detail-types">
        {Array.from(pokemon.types.values()).map((type) => (
          <SynergyIcon type={type} key={type} />
        ))}
      </div>

      <div className="game-pokemon-detail-stats">
        {pokemonStats.map(({ stat, value }) => (
          <div key={stat} className={"game-pokemon-detail-stat-" + stat.toLowerCase()}>
            <img
              src={`assets/icons/${stat}.png`}
              alt={stat}
              title={t(`stat.${stat}`)}
            />
            <span>{value}</span>
          </div>
        ))}
      </div>

      {DishByPkm[pokemon.name] && (
        <div className="game-pokemon-detail-dish">
          <div className="game-pokemon-detail-dish-name">
            <img src="assets/ui/dish.svg" /><i>{t("signature_dish")}:</i> {t(`item.${DishByPkm[pokemon.name]}`)}
          </div>
          <img
            src={`assets/item/${DishByPkm[pokemon.name]}.png`}
            className="game-pokemon-detail-dish-icon"
            alt={DishByPkm[pokemon.name]}
            title={t(`item.${DishByPkm[pokemon.name]}`)}
          />
          <p>
            {addIconsToDescription(t(`item_description.${DishByPkm[pokemon.name]}`))}
          </p>
        </div>
      )}

      {pokemon.passive !== Passive.NONE && (
        <div className="game-pokemon-detail-passive">
          <p>
            {addIconsToDescription(t(`passive_description.${pokemon.passive}`))}
          </p>
        </div>
      )}

      {pokemon.skill !== Ability.DEFAULT && (
        <div className="game-pokemon-detail-ult">
          <div className="ability-name">{t(`ability.${pokemon.skill}`)}</div>
          <div>
            <AbilityTooltip
              ability={pokemon.skill}
              stats={{ ap: pokemon.ap, luck: pokemon.luck, stars: pokemon.stars, stages: getPokemonData(pokemon.name).stages }}
              key={pokemon.id}
            />
          </div>
        </div>
      )}
    </div>
  )
}
