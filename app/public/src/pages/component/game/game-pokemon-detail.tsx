import { GameObjects } from "phaser"
import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import { useTranslation } from "react-i18next"
import { DishByPkm } from "../../../../../core/dishes"
import { ItemStats } from "../../../../../core/items"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion, IPokemon, IPokemonEntity } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { Item } from "../../../../../types/enum/Item"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { values } from "../../../../../utils/schemas"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { AbilityTooltip } from "../ability/ability-tooltip"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import { GameTooltipBar } from "./game-tooltip-bar"
import "./game-pokemon-detail.css"

export function GamePokemonDetail(props: {
  pokemon: Pkm | IPokemon | IPokemonEntity
  origin: "shop" | "proposition" | "team" | "planner" | "battle" | "wiki"
  shiny?: boolean
  emotion?: Emotion
  isAlly?: boolean
}) {
  const { t } = useTranslation()
  const pokemon: IPokemon | IPokemonEntity = useMemo(() => {
    if (typeof props.pokemon === "string") {
      const pokemon = PokemonFactory.createPokemonFromName(props.pokemon)
      pokemon.pp = pokemon.maxPP
      return pokemon
    }
    return props.pokemon
  }, [props.pokemon])

  const pokemonStats = useMemo(() => {
    const baseStats = PokemonFactory.createPokemonFromName(pokemon.name)
    return [
      { stat: Stat.DEF, value: pokemon.def, baseValue: baseStats.def },
      { stat: Stat.ATK, value: pokemon.atk, baseValue: baseStats.atk },
      {
        stat: Stat.CRIT_CHANCE,
        value: pokemon.critChance,
        baseValue: baseStats.critChance
      },
      { stat: Stat.AP, value: pokemon.ap, baseValue: baseStats.ap },
      { stat: Stat.RANGE, value: pokemon.range, baseValue: baseStats.range },
      {
        stat: Stat.SPE_DEF,
        value: pokemon.speDef,
        baseValue: baseStats.speDef
      },
      { stat: Stat.SPEED, value: pokemon.speed, baseValue: baseStats.speed },
      {
        stat: Stat.CRIT_POWER,
        value: pokemon.critPower,
        baseValue: baseStats.critPower
      },
      { stat: Stat.LUCK, value: pokemon.luck, baseValue: baseStats.luck }
    ].map((s) => {
      if (props.origin === "team") {
        // count item stats as well
        s.value = values(pokemon.items).reduce(
          (acc, item) => acc + (ItemStats[item]?.[s.stat] ?? 0),
          s.value
        )
      }
      return s
    })
  }, [
    pokemon.name,
    pokemon.items,
    pokemon.def,
    pokemon.atk,
    pokemon.critChance,
    pokemon.ap,
    pokemon.range,
    pokemon.speDef,
    pokemon.speed,
    pokemon.critPower,
    pokemon.luck,
    props.origin
  ])

  let dish = DishByPkm[pokemon.name]
  if (!dish && pokemon.types.has(Synergy.GOURMET)) {
    if (pokemon.items.has(Item.COOKING_POT)) {
      dish = Item.HEARTY_STEW
    } else if (pokemon.name !== Pkm.GUZZLORD) {
      dish = Item.SANDWICH
    }
  }

  const hp = useMemo(() => {
    if (props.origin === "battle") return pokemon.hp
    if (props.origin === "team") {
      return values(pokemon.items).reduce(
        (acc, item) => acc + (ItemStats[item]?.[Stat.HP] ?? 0),
        pokemon.hp
      )
    }

    return undefined // only show max HP in shop/planner/wiki
  }, [pokemon.hp, pokemon.items, props.origin])

  const pp = useMemo(() => {
    if (props.origin === "battle") return pokemon.pp
    if (props.origin === "team") {
      return values(pokemon.items).reduce(
        (acc, item) => acc + (ItemStats[item]?.[Stat.PP] ?? 0),
        pokemon.pp
      )
    }
    return undefined // only show max PP in shop/planner/wiki
  }, [pokemon.pp, pokemon.items, props.origin])

  const shield = useMemo(() => {
    if (props.origin === "battle") return pokemon.shield
    if (props.origin === "team") {
      return values(pokemon.items).reduce(
        (acc, item) => acc + (ItemStats[item]?.[Stat.SHIELD] ?? 0),
        0
      )
    }
    return undefined
  }, [pokemon.items, props.origin, pokemon.shield])

  return (
    <div className="game-pokemon-detail">
      <PokemonPortrait
        className="game-pokemon-detail-portrait"
        style={{ borderColor: RarityColor[pokemon.rarity] }}
        portrait={{
          index: pokemon.index,
          shiny: props.shiny ?? pokemon.shiny,
          emotion: props.emotion ?? pokemon.emotion
        }}
      />
      {pokemon.index === PkmIndex[Pkm.EGG] &&
        "evolution" in pokemon &&
        pokemon.evolution != null && (
          <img
            className="game-pokemon-detail-portrait-hint"
            src={getPortraitSrc(PkmIndex[pokemon.evolution])}
          />
        )}
      <div className="game-pokemon-detail-entry">
        <p className="game-pokemon-detail-entry-name">
          {pokemon.secondaryName === Pkm.DEFAULT ? (t(`pkm.${pokemon.name}`)) : (t(`pkm.${pokemon.name}`) + " (" + t(`pkm.${pokemon.secondaryName}`) + ")")}
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
        <GameTooltipBar
          type={props.isAlly === false ? "HP_ENEMY" : "HP_ALLY"}
          value={hp}
          extraValue={shield}
          maxValue={pokemon.maxHP}
          graduationStep={10}
        />
        <GameTooltipBar type="PP" value={pp} maxValue={pokemon.maxPP} />
      </div>
      <div className="game-pokemon-detail-stats">
        {pokemonStats.map(({ stat, value, baseValue }) => (
          <div
            key={stat}
            className={"game-pokemon-detail-stat-" + stat.toLowerCase()}
          >
            <img
              src={`assets/icons/${stat}.png`}
              alt={stat}
              title={`${t(`stat.${stat}`)}${value !== baseValue ? ` (${baseValue} ${value > baseValue ? "+" : "-"} ${value - baseValue})` : ""}`}
            />
            <span
              className={cc({
                buffed: value > baseValue,
                nerfed: value < baseValue
              })}
            >
              {value}
            </span>
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
          {pokemon.stacksRequired > 0 && (
            <div className="game-pokemon-detail-passive-bar">
              <GameTooltipBar
                type="XP"
                value={pokemon.stacks}
                maxValue={pokemon.stacksRequired!}
                graduationStep={1}
              />
            </div>
          )}
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
  private root: ReactDOM.Root
  private pokemon: Pkm | IPokemon | IPokemonEntity
  private shiny?: boolean
  private emotion?: Emotion
  private origin: "shop" | "team" | "planner" | "battle" | "wiki"
  isAlly: boolean

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    pokemon: Pkm | IPokemon | IPokemonEntity,
    shiny?: boolean,
    emotion?: Emotion,
    origin: "shop" | "team" | "planner" | "battle" | "wiki" = "wiki",
    isAlly: boolean = true
  ) {
    super(scene, x, y)
    this.dom = document.createElement("div")
    this.dom.className = "my-container game-pokemon-detail-tooltip"
    this.setElement(this.dom)
    this.root = ReactDOM.createRoot(this.dom)
    this.pokemon = pokemon
    this.shiny = shiny
    this.emotion = emotion
    this.origin = origin
    this.isAlly = isAlly
    this.render()
  }

  private render() {
    this.root.render(
      <GamePokemonDetail
        pokemon={this.pokemon}
        shiny={this.shiny}
        emotion={this.emotion}
        origin={this.origin}
        isAlly={this.isAlly}
      />
    )
  }

  public updatePokemon(
    pokemon: Pkm | IPokemon | IPokemonEntity,
    shiny?: boolean,
    emotion?: Emotion
  ) {
    this.pokemon = pokemon
    if (shiny !== undefined) this.shiny = shiny
    if (emotion !== undefined) this.emotion = emotion
    this.render()
  }

  public destroy() {
    this.root.unmount()
    super.destroy()
  }
}
