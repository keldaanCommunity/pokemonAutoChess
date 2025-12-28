import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { RarityColor, SynergyTriggers } from "../../../../../config"
import { SynergyEffects } from "../../../../../models/effects"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Ability } from "../../../../../types/enum/Ability"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { Synergy, SynergyArray } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { usePreferences } from "../../../preferences"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { Checkbox } from "../checkbox/checkbox"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { EffectDescriptionComponent } from "../synergy/effect-description"

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
  const [preferences, setPreferences] = usePreferences()
  const [overlap, setOverlap] = useState<Synergy | null>(null)

  const pokemons = PRECOMPUTED_POKEMONS_PER_TYPE[props.type]
    .filter((p) => p !== Pkm.DEFAULT)
    .map((p) => getPokemonData(p))
    .sort((a, b) => a.stars - b.stars) // put first stage first
    .filter((p, index, list) => {
      if (p.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      if (p.rarity === Rarity.SPECIAL) return true // show all summons & specials, even in the same family
      if (preferences.showEvolutions) return true
      const prevolution = list.find(
        (p2) => p2.evolution === p.name || p2.evolutions.includes(p.name)
      )
      // if show evolutions is unchecked, do not show a pokemon if it has a prevolution and that prevolution is in the same rarity category
      if (prevolution && prevolution.rarity === p.rarity) return false
      return true
    })

  const filteredPokemons = pokemons.filter((p) =>
    overlap ? p.types.includes(overlap) : true
  )

  const pokemonsPerRarity = groupBy(filteredPokemons, (p) => p.rarity)
  for (const rarity in pokemonsPerRarity) {
    const families = groupBy(
      pokemonsPerRarity[rarity as Rarity],
      (p) => PkmFamily[p.name]
    )
    pokemonsPerRarity[rarity] = Object.values(families)
      .sort((fa, fb) => {
        const a = fa[0],
          b = fb[0]
        if (a.regional !== b.regional) return +a.regional - +b.regional
        if (a.additional !== b.additional) return +a.additional - +b.additional
        return a.index.localeCompare(b.index)
      })
      .flat()
      .sort((a, b) => {
        if (PkmFamily[a.name] === PkmFamily[b.name]) return a.stars - b.stars
        return 0
      })
  }

  const overlapsMap = new Map(
    SynergyArray.filter((type) => type !== props.type).map((type) => [
      type,
      pokemons
        .filter((p) => p.types.includes(type))
        .filter(
          (p, i, list) =>
            list.findIndex((q) => PkmFamily[p.name] === PkmFamily[q.name]) === i
        ).length
    ])
  )

  const overlaps = [...overlapsMap.entries()]
    .filter(([type, nb]) => nb > 0)
    .sort((a, b) => b[1] - a[1])

  return (
    <div style={{ padding: "0 1em" }}>
      <h2>
        <SynergyIcon type={props.type} /> {t(`synergy.${props.type}`)}
      </h2>
      <p>
        {addIconsToDescription(
          t(`synergy_description.${props.type}`, { additionalInfo: "" })
        )}
      </p>
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
      <div style={{ float: "right", justifyItems: "end" }}>
        <Checkbox
          checked={preferences.showEvolutions}
          onToggle={(checked) => {
            setPreferences({ showEvolutions: checked })
          }}
          label={t("show_evolutions")}
          isDark
        />
        <details>
          <summary style={{ textAlign: "end" }}>{t("overlaps")}</summary>
          <ul className="synergy-overlaps">
            {overlaps.map(([type, nb]) => {
              return (
                <li
                  onClick={() => setOverlap(overlap === type ? null : type)}
                  key={type}
                  className={cc({ active: overlap === type })}
                >
                  <SynergyIcon type={props.type} />
                  <SynergyIcon type={type} />
                  <span>{nb}</span>
                </li>
              )
            })}
          </ul>
        </details>
      </div>
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
                          data-tooltip-id="game-pokemon-detail-tooltip"
                          data-tooltip-content={p.name}
                        />
                      </div>
                    )
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <GamePokemonDetailTooltip origin="wiki" />
    </div>
  )
}

export function WikiAllTypes() {
  const rarityOrder = [
    Rarity.COMMON,
    Rarity.UNCOMMON,
    Rarity.RARE,
    Rarity.EPIC,
    Rarity.ULTRA,
    Rarity.HATCH,
    Rarity.UNIQUE,
    Rarity.LEGENDARY,
    Rarity.SPECIAL
  ]
  const pokemons = Object.values(Pkm)
    .filter((p) => p !== Pkm.DEFAULT)
    .map((p) => getPokemonData(p))
    .filter((a, index, list) => {
      if (a.skill === Ability.DEFAULT) return false // pokemons with no ability are not ready for the show
      return true
    })

  const pokemonsPerType = Object.fromEntries(
    SynergyArray.map((type) => [type as Synergy, [] as IPokemonData[]])
  )
  for (const p of pokemons) {
    for (const type of p.types) {
      pokemonsPerType[type].push(p)
    }
  }

  for (const type in pokemonsPerType) {
    pokemonsPerType[type].sort((a, b) =>
      a.rarity !== b.rarity
        ? rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
        : a.stars - b.stars
    ) // put first stage first
  }

  const { t } = useTranslation()

  return (
    <>
      <div id="wiki-types-all">
        {SynergyArray.map((type) => {
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
                    >
                      <img
                        src={getPortraitSrc(p.index)}
                        data-tooltip-id="game-pokemon-detail-tooltip"
                        data-tooltip-content={p.name}
                      />
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
      <GamePokemonDetailTooltip origin="wiki" />
    </>
  )
}
