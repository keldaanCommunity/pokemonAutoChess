import { GameObjects } from "phaser"
import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { DishByPkm } from "../../../../../core/dishes"
import { PokemonEntity } from "../../../../../core/pokemon-entity"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { Item } from "../../../../../types/enum/Item"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { addIconsToDescription } from "../../utils/descriptions"
import { AbilityTooltip } from "../ability/ability-tooltip"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import { GameTooltipBar } from "./game-tooltip-bar"
import "./game-pokemon-detail.css"

export function GamePokemonDetail(props: {
  pokemon: Pkm | Pokemon | PokemonEntity
  shiny?: boolean
  emotion?: Emotion
}) {
  const { t } = useTranslation()
  const pokemon: Pokemon | PokemonEntity = useMemo(
    () =>
      typeof props.pokemon === "string"
        ? PokemonFactory.createPokemonFromName(props.pokemon)
        : props.pokemon,
    [props.pokemon]
  )

  const pokemonStats = useMemo(
    () => [
      { stat: Stat.DEF, value: pokemon.def },
      { stat: Stat.ATK, value: pokemon.atk },
      { stat: Stat.CRIT_CHANCE, value: pokemon.critChance },
      { stat: Stat.LUCK, value: pokemon.luck },
      { stat: Stat.SPE_DEF, value: pokemon.speDef },
      { stat: Stat.SPEED, value: pokemon.speed },
      { stat: Stat.CRIT_POWER, value: pokemon.critPower },
      { stat: Stat.RANGE, value: pokemon.range }
    ],
    [
      pokemon.atk,
      pokemon.def,
      pokemon.range,
      pokemon.speed,
      pokemon.speDef,
      pokemon.critChance,
      pokemon.critPower,
      pokemon.luck
    ]
  )

  let dish = DishByPkm[pokemon.name]
  if (!dish && pokemon.types.has(Synergy.GOURMET)) {
    if (pokemon.items.has(Item.COOKING_POT)) {
      dish = Item.HEARTY_STEW
    } else if (pokemon.name !== Pkm.GUZZLORD) {
      dish = Item.SANDWICH
    }
  }

  return (
    <div className="game-pokemon-detail in-shop">
      <PokemonPortrait
        className="game-pokemon-detail-portrait"
        style={{ borderColor: RarityColor[pokemon.rarity] }}
        portrait={{
          index: pokemon.index,
          shiny: props.shiny ?? pokemon.shiny,
          emotion: props.emotion ?? pokemon.emotion
        }}
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

      <div className="game-pokemon-detail-bars">
        <GameTooltipBar type="HP" value={77} maxValue={pokemon.maxHP} />
        <GameTooltipBar type="PP" value={pokemon.pp} maxValue={pokemon.maxPP} />
      </div>

      <div className="game-pokemon-detail-stats">
        {pokemonStats.map(({ stat, value }) => (
          <div
            key={stat}
            className={"game-pokemon-detail-stat-" + stat.toLowerCase()}
          >
            <img
              src={`assets/icons/${stat}.png`}
              alt={stat}
              title={t(`stat.${stat}`)}
            />
            <span>{value}</span>
          </div>
        ))}
      </div>

      {dish && (
        <div className="game-pokemon-detail-dish">
          <div className="game-pokemon-detail-dish-name">
            <img src="assets/ui/dish.svg" />
            <i>{t("signature_dish")}:</i> {t(`item.${dish}`)}
          </div>
          <img
            src={`assets/item/${dish}.png`}
            className="game-pokemon-detail-dish-icon"
            alt={dish}
            title={t(`item.${dish}`)}
          />
          <p>{addIconsToDescription(t(`item_description.${dish}`))}</p>
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
              stats={{
                ap: pokemon.ap,
                luck: pokemon.luck,
                stars: pokemon.stars,
                stages: getPokemonData(pokemon.name).stages
              }}
              key={pokemon.id}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export class GamePokemonDetailDOMWrapper extends GameObjects.DOMElement {
  dom: HTMLDivElement
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pokemon: Pkm | Pokemon | PokemonEntity,
    shiny?: boolean,
    emotion?: Emotion
  ) {
    super(scene, x, y)
    this.dom = document.createElement("div")
    this.setElement(this.dom)
    const root = ReactDOM.createRoot(this.dom)
    root.render(
      <GamePokemonDetail pokemon={pokemon} shiny={shiny} emotion={emotion} />
    )
  }
}
