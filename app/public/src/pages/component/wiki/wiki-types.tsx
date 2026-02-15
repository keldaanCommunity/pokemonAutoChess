import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { RarityColor, SynergyTriggers } from "../../../../../config"
import { SynergyEffects } from "../../../../../models/effects"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { Synergy, SynergyArray } from "../../../../../types/enum/Synergy"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { groupBy } from "../../../../../utils/array"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { usePreferences } from "../../../preferences"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import {
  filterPokemonsAccordingToPreferences,
  PokemonFilters
} from "../pokemon-filters/pokemon-filters"
import { EffectDescriptionComponent } from "../synergy/effect-description"
import { SynergyOverlaps } from "../synergy-overlaps/synergy-overlaps"

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
  const [preferences] = usePreferences()
  const [overlap, setOverlap] = useState<Synergy | null>(null)

  const pokemons = filterPokemonsAccordingToPreferences(
    PRECOMPUTED_POKEMONS_PER_TYPE[props.type],
    preferences
  )
    .map((p) => getPokemonData(p))
    .sort((a, b) => a.stars - b.stars) // put first stage first

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
        <PokemonFilters />
        <SynergyOverlaps
          type={props.type}
          pokemons={pokemons}
          overlap={overlap}
          setOverlap={setOverlap}
        />
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
  const [preferences] = usePreferences()
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
  const pokemons = filterPokemonsAccordingToPreferences(
    Object.values(Pkm),
    preferences
  ).map((p) => getPokemonData(p))

  const pokemonsPerType = Object.fromEntries(
    SynergyArray.map((type) => [type as Synergy, [] as IPokemonData[]])
  )
  for (const p of pokemons) {
    for (const type of p.types) {
      pokemonsPerType[type].push(p)
    }
  }
  pokemonsPerType["protean"] = [
    getPokemonData(Pkm.KECLEON),
    getPokemonData(Pkm.ARCEUS)
  ]

  for (const type in pokemonsPerType) {
    pokemonsPerType[type].sort((a, b) =>
      a.rarity !== b.rarity
        ? rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
        : a.stars - b.stars
    ) // put first stage first
  }

  const { t } = useTranslation()
  const types = [...SynergyArray, "protean"] as const

  return (
    <>
      <div id="wiki-types-all">
        <div style={{ float: "right", justifyItems: "end" }}>
          <PokemonFilters />
        </div>
        {types.map((type) => {
          return (
            <section key={type}>
              <h2>
                {type === "protean" ? (
                  t("type_fluid")
                ) : (
                  <>
                    <SynergyIcon type={type} /> {t(`synergy.${type}`)}
                  </>
                )}
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
