import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import SynergyIcon from "../icons/synergy-icon"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { RarityColor, SynergyTriggers } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { Synergy, SynergyEffects } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { EffectDescriptionComponent } from "../synergy/effect-description"
import { Checkbox } from "../checkbox/checkbox"

export default function WikiTypes() {
  const { t } = useTranslation()
  return (
    <Tabs className="wiki-types">
      <TabList>
        {(Object.keys(Synergy) as Synergy[]).map((type) => {
          return (
            <Tab key={"title-" + type}>
              <SynergyIcon type={type} />
            </Tab>
          )
        })}
        <Tab key="title-all">{t("all")}</Tab>
      </TabList>

      {(Object.keys(Synergy) as Synergy[]).map((r) => {
        return (
          <TabPanel key={r}>
            <WikiType type={r} />
          </TabPanel>
        )
      })}
      <TabPanel key="all">
        <WikiAllTypes />
      </TabPanel>
    </Tabs>
  )
}

export function WikiType(props: { type: Synergy }) {
  const { t } = useTranslation()
  const [showEvolutions, setShowEvolutions] = useState(false)

  const pokemons = PRECOMPUTED_POKEMONS_PER_TYPE[props.type]
    .filter((p) => p !== Pkm.DEFAULT)
    .map((p) => getPokemonData(p))
    .sort((a, b) => a.stars - b.stars) // put first stage first
    .filter((a, index, list) => {
      if (a.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      if (a.rarity === Rarity.SPECIAL) return true // show all summons & specials, even in the same family
      if (showEvolutions) return true

      // remove if already one member of family in the list
      return (
        list.findIndex((b) => PkmFamily[a.name] === PkmFamily[b.name]) === index
      )
    })

  const pokemonsPerRarity = groupBy(pokemons, (p) => p.rarity)
  for (const rarity in pokemonsPerRarity) {
    pokemonsPerRarity[rarity].sort((a: IPokemonData, b: IPokemonData) => {
      if (a.regional !== b.regional) return +a.regional - +b.regional
      if (a.additional !== b.additional) return +a.additional - +b.additional
      return a.index < b.index ? -1 : 1
    })
  }

  return (
    <div style={{ padding: "0 1em" }}>
      <h2>
        <SynergyIcon type={props.type} /> {t(`synergy.${props.type}`)}
      </h2>
      <p>{addIconsToDescription(t(`synergy_description.${props.type}`, { additionalInfo: "" }))}</p>
      {SynergyEffects[props.type].map((effect, i) => {
        return (
          <div
            key={t(`effect.${effect}`)}
            style={{ display: "flex", alignItems: "center" }}
          >
            <span>
              ({SynergyTriggers[props.type][i]}) {t(`effect.${effect}`)}
              :&nbsp;
            </span>
            <EffectDescriptionComponent effect={effect} />
          </div>
        )
      })}

      <hr />
      <Checkbox
        checked={showEvolutions}
        onToggle={setShowEvolutions}
        label={t("show_evolutions")}
        isDark
      />
      <table>
        <tbody>
          {(Object.values(Rarity) as Rarity[]).map((rarity) => {
            return (
              <tr key={rarity}>
                <td style={{ color: RarityColor[rarity] }}>
                  {t(`rarity.${rarity}`)}
                </td>
                <td>
                  {(pokemonsPerRarity[rarity] ?? []).map((p) => {
                    return (
                      <div
                        key={p.name}
                        className={cc("pokemon-portrait", {
                          additional: p.additional,
                          regional: p.regional
                        })}
                      >
                        <img
                          src={getPortraitSrc(p.index)}
                          data-tooltip-id={`pokemon-detail-${p.index}`}
                        />
                        <Tooltip
                          id={`pokemon-detail-${p.index}`}
                          className="custom-theme-tooltip game-pokemon-detail-tooltip"
                        >
                          <GamePokemonDetail pokemon={p.name} />
                        </Tooltip>
                      </div>
                    )
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function WikiAllTypes() {
  const rarityOrder = [Rarity.COMMON, Rarity.UNCOMMON, Rarity.RARE, Rarity.EPIC, Rarity.ULTRA, Rarity.HATCH, Rarity.UNIQUE, Rarity.LEGENDARY, Rarity.SPECIAL]
  const pokemons = Object.values(Pkm)
    .filter((p) => p !== Pkm.DEFAULT)
    .map((p) => getPokemonData(p))
    .filter((a, index, list) => {
      if (a.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      return true
    })

  const pokemonsPerType = Object.fromEntries(Object.values(Synergy).map(type => [type as Synergy, [] as IPokemonData[]]))
  for (const p of pokemons) {
    for (const type of p.types) {
      pokemonsPerType[type].push(p)
    }
  }

  for (const type in pokemonsPerType) {
    pokemonsPerType[type].sort((a, b) => a.rarity !== b.rarity ? rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity) : a.stars - b.stars) // put first stage first
  }

  const [hoveredPokemon, setHoveredPokemon] = useState<Pkm>()
  const { t } = useTranslation()

  return (
    <>
      <div id="wiki-types-all">
        {(Object.values(Synergy) as Synergy[]).map((type) => {
          return (
            <section key={type}>
              <h2>
                <SynergyIcon type={type} /> {t(`synergy.${type}`)}
              </h2>
              <ul>
                {(pokemonsPerType[type] ?? []).map((p) => {
                  return (
                    <li
                      key={p.name}
                      className={cc("pokemon-portrait", {
                        additional: p.additional,
                        regional: p.regional
                      })}
                      onMouseOver={() => {
                        setHoveredPokemon(p.name)
                      }}
                      data-tooltip-id="pokemon-detail"
                    >
                      <img
                        src={getPortraitSrc(p.index)}
                        data-tooltip-id={`pokemon-detail-${p.index}`}
                      />
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
      {hoveredPokemon && <Tooltip
        id="pokemon-detail"
        className="custom-theme-tooltip game-pokemon-detail-tooltip"
        float
      >
        <GamePokemonDetail pokemon={hoveredPokemon} />
      </Tooltip>}
    </>
  )
}
