import { useTranslation } from "react-i18next"
import { IPokemonsStatistic } from "../../../../../models/mongo-models/pokemons-statistic"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../../../../models/precomputed/precomputed-rarity"
import { PRECOMPUTED_POKEMONS_PER_TYPE } from "../../../../../models/precomputed/precomputed-types"
import { Rarity } from "../../../../../types/enum/Game"
import { Pkm, PkmFamily, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import PokemonPortrait from "../pokemon-portrait"
import "./pokemon-statistic.css"

export default function PokemonStatistic(props: {
  pokemons: IPokemonsStatistic[]
  rankingBy: string
  synergy: Synergy | "all"
  rarity: Rarity | "all"
  pool: string
  tier: string
  selectedPkm: string
}) {
  const { t } = useTranslation()

  type FamilyStats = {
    pokemons: IPokemonsStatistic[]
    totalCount?: number
    averageRank?: number | null
    averageItemHeld?: number | null
  }
  const families = new Map<Pkm, FamilyStats>()

  const filteredPokemons = props.pokemons.filter(
    (p) =>
      hasType(p, props.synergy) &&
      hasRarity(p, props.rarity) &&
      isInPool(p, props.pool) &&
      (props.tier === "all" || getPokemonData(p.name).stars === +props.tier) &&
      (props.selectedPkm === "" || p.name === props.selectedPkm)
  )

  filteredPokemons.forEach((pokemon) => {
    const familyName = PkmFamily[pokemon.name]
    const family = families.get(familyName)
    if (family) {
      family.pokemons.push(pokemon)
    } else {
      families.set(PkmFamily[pokemon.name], { pokemons: [pokemon] })
    }
  })

  families.forEach((family) => {
    family.pokemons.sort(
      (a, b) => getPokemonData(a.name).stars - getPokemonData(b.name).stars
    )
    family.totalCount = family.pokemons.reduce(
      (prev, curr) => prev + curr.count,
      0
    )
    family.averageRank = computeAverageRank(family.pokemons)
    family.averageItemHeld = computeAverageItemHeld(family.pokemons)
  })

  const familiesArray = Array.from(families).sort((a, b) =>
    props.rankingBy === "count"
      ? b[1].totalCount! - a[1].totalCount!
      : props.rankingBy === "item_count"
        ? b[1].averageItemHeld! - a[1].averageItemHeld!
        : (a[1].averageRank ?? 9) - (b[1].averageRank ?? 9)
  )

  if (filteredPokemons.length === 0) {
    return <p>{t("no_data_available")}</p>
  }
  return (
    <article>
      {familiesArray.map(([pkm, family], i) => (
        <div key={"family." + pkm} className="my-box pokemon-family-stat">
          <span className="rank">{i + 1}</span>

          <div className="pokemon-family-summary">
            <div className="pokemon-portraits-vertical">
              {family.pokemons.map((pokemon) => (
                <div className="pokemon-detail-row">
                  <PokemonPortrait
                    key={pokemon.name + "-thumb"}
                    portrait={PkmIndex[pokemon.name]}
                    width={40}
                  />
                  <span className="pokemon-name-container">
                    <span>{t(`pkm.${pokemon.name}`)}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="pokemon-family-stats">
              <span className="pokemon-stat-item">
                <div>{t("average_place")}</div>
                <span className="pokemon-stat-value">
                  {family.averageRank ? family.averageRank.toFixed(1) : "???"}
                </span>
              </span>
              <span className="pokemon-stat-item">
                <div>{t("count")}</div>
                <span className="pokemon-stat-value">{family.totalCount}</span>
              </span>
              <span className="pokemon-stat-item">
                <div>{t("held_items")}</div>
                <span className="pokemon-stat-value">
                  {family.averageItemHeld?.toFixed(2)}
                </span>
              </span>
            </div>
          </div>

          <div className="pokemon-details-list">
            {family.pokemons.map((pokemon) => (
              <div
                key={pokemon.name + "-details"}
                className="pokemon-detail-row"
              >
                <PokemonPortrait portrait={PkmIndex[pokemon.name]} width={40} />
                <span className="pokemon-detail-stat" title="Average Rank">
                  <strong>
                    {pokemon.count === 0 ? "???" : pokemon.rank.toFixed(1)}
                  </strong>
                </span>
                <span className="pokemon-stat-container">
                  <label>{t("count")}:</label> {pokemon.count}
                </span>
                <span className="pokemon-stat-container">
                  <label>{t("held_items")}:</label> {pokemon.item_count}
                </span>
                <div className="pokemon-items-row">
                  {pokemon.items.map((item) => (
                    <img
                      key={pokemon.name + "-item-" + item}
                      src={"assets/item/" + item + ".png"}
                      className="pokemon-item-img"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </article>
  )
}

function computeAverageRank(pokemons: IPokemonsStatistic[]): number | null {
  const pokemonsPlayedAtLeastOnce = pokemons.filter((p) => p.count > 0)
  if (pokemonsPlayedAtLeastOnce.length === 0) return null
  return (
    pokemonsPlayedAtLeastOnce.reduce(
      (prev, curr) => prev + curr.rank * curr.count,
      0
    ) / pokemonsPlayedAtLeastOnce.reduce((prev, curr) => prev + curr.count, 0)
  )
}

function computeAverageItemHeld(pokemons: IPokemonsStatistic[]): number | null {
  const pokemonsPlayedAtLeastOnce = pokemons.filter((p) => p.count > 0)
  if (pokemonsPlayedAtLeastOnce.length === 0) return null
  return (
    pokemonsPlayedAtLeastOnce.reduce(
      (prev, curr) => prev + curr.item_count * curr.count,
      0
    ) / pokemonsPlayedAtLeastOnce.reduce((prev, curr) => prev + curr.count, 0)
  )
}

function isInPool(pokemon: IPokemonsStatistic, pool: string): boolean {
  if (pool === "all") return true
  const data = getPokemonData(pokemon.name)
  if (pool === "special") return data.rarity === Rarity.SPECIAL
  if (pool === "additional") return data.additional
  if (pool === "regional") return data.regional
  if (pool === "regular")
    return !data.additional && !data.regional && data.rarity !== Rarity.SPECIAL
  return false
}

function hasType(
  pokemon: IPokemonsStatistic,
  synergy: Synergy | "all"
): boolean {
  if (synergy === "all") return true
  const types = PRECOMPUTED_POKEMONS_PER_TYPE[synergy]
  return types.includes(pokemon.name)
}

function hasRarity(
  pokemon: IPokemonsStatistic,
  rarity: Rarity | "all"
): boolean {
  if (rarity === "all") return true
  return PRECOMPUTED_POKEMONS_PER_RARITY[rarity].includes(pokemon.name)
}
