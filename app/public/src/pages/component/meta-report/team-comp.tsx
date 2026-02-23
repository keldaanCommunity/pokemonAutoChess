import { useTranslation } from "react-i18next"
import { IMetaV2 } from "../../../../../models/mongo-models/meta-v2"
import {
  Item,
  ItemComponents,
  ItemRecipe
} from "../../../../../types/enum/Item"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
import { EloBadge } from "../profile/elo-badge"
import "./team-comp.css"

export function rankType(
  a: Synergy,
  b: Synergy,
  synergies: { [key in Synergy]?: number }
) {
  const sa = synergies[a]
  const sb = synergies[b]
  const va = sa ? sa : 0
  const vb = sb ? sb : 0
  return vb - va
}

function rankPokemon(
  a: Pkm,
  b: Pkm,
  pokemons: {
    [key in Pkm]?: {
      frequency: number
      mean_items: number
      items: string[]
    }
  }
) {
  const pa = pokemons[a]
  const pb = pokemons[b]
  const va = pa ? pa.frequency : 0
  const vb = pb ? pb.frequency : 0
  return vb - va
}

export default function TeamComp(props: { team: IMetaV2; rank: number }) {
  const { t } = useTranslation()
  const sortedTypes = props.team.synergies
    ? (Object.keys(props.team.synergies) as Synergy[]).sort((a, b) => {
        return rankType(a, b, props.team.synergies)
      })
    : new Array<Synergy>()
  const sortedPokemons = props.team.mean_team.pokemons
    ? (Object.keys(props.team.mean_team.pokemons) as Pkm[]).sort((a, b) => {
        return rankPokemon(a, b, props.team.mean_team.pokemons)
      })
    : new Array<Pkm>()

  // Calculate carousel items (base components) from mean items
  const getCarouselItems = () => {
    const carouselItemsMap = new Map<Item, number>()

    // For each item in mean_items, decompose it to base components
    props.team.mean_items?.forEach((itemData) => {
      const item = itemData.item as Item
      const recipe = ItemRecipe[item]

      if (recipe) {
        // Add the base components with weighted frequency
        recipe.forEach((baseItem) => {
          const current = carouselItemsMap.get(baseItem) || 0
          carouselItemsMap.set(baseItem, current + itemData.frequency)
        })
      } else {
        // If no recipe, the item itself is a base carousel item
        const current = carouselItemsMap.get(item) || 0
        carouselItemsMap.set(item, current + itemData.frequency)
      }
    })

    // Sort by frequency and get top 3, filtering to only ItemComponents
    return Array.from(carouselItemsMap.entries())
      .filter(([item]) => ItemComponents.includes(item))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([item, frequency]) => ({ item, frequency }))
  }

  const carouselItems = getCarouselItems()

  return (
    <div className="team-comp my-box" id={props.team.cluster_id}>
      <div className="team-comp-container">
        <div className="team-comp-left">
          <div className="team-comp-header">
            <span className="rank">{props.rank}</span>
            <div className="synergy-group">
              {sortedTypes.slice(0, 3).map((type) => (
                <div className="synergy-item" key={type}>
                  <SynergyIcon
                    type={type.toUpperCase() as Synergy}
                    size="48px"
                  />
                  <span>{props.team.synergies[type]}</span>
                </div>
              ))}
            </div>
            <div className="header-info">
              <span>
                <label>{t("average_place")}:</label>
                {props.team.mean_rank.toFixed(2)}
              </span>
              <span>
                <label>{t("winrate")}:</label>
                {props.team.winrate.toFixed(2)} %
              </span>
              <span>
                <label>{t("count")}:</label>
                {props.team.count}
              </span>
            </div>
          </div>
          <div className="popular-pokemons-header">{t("popular_pokemons")}</div>
          <div className="player-team-pokemons">
            {sortedPokemons.map((pokemon) => {
              const pokemonData = props.team.mean_team.pokemons[pokemon]
              return (
                <div key={`mean_${pokemon}`} className="pokemon-container">
                  <PokemonPortrait portrait={PkmIndex[pokemon]} />
                  <div className="pokemon-frequency">
                    {((pokemonData?.frequency ?? 0) * 100).toFixed(0) + "%"}
                  </div>
                  <div className="pokemon-items">
                    {(pokemonData?.items || []).map((item, i) => (
                      <img
                        key={i}
                        src={`/assets/item/${item}.png`}
                        data-tooltip-id="item-detail-tooltip"
                        data-tooltip-content={item}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {props.team.mean_items && props.team.mean_items.length > 0 && (
          <div className="top-items-list">
            <div className="items-header">{t("popular_items")}</div>
            <div className="items-group">
              {props.team.mean_items.slice(0, 5).map((itemData, idx) => (
                <div key={idx} className="item-entry">
                  <img
                    src={`/assets/item/${itemData.item}.png`}
                    data-tooltip-id="item-detail-tooltip"
                    data-tooltip-content={itemData.item}
                    className="item-icon"
                  />
                  <span className="item-frequency">
                    {(itemData.frequency * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            {carouselItems.length > 0 && (
              <div className="carousel-priority-section">
                <div className="carousel-header">{t("carousel_priority")}</div>
                <div className="carousel-items-list">
                  {carouselItems.map((itemData, idx) => {
                    const ordinals = ["1st", "2nd", "3rd", "4th", "5th"]
                    return (
                      <div key={idx} className="carousel-item-entry">
                        <img
                          src={`/assets/item/${itemData.item}.png`}
                          data-tooltip-id="item-detail-tooltip"
                          data-tooltip-content={itemData.item}
                          className="carousel-item-icon"
                        />
                        <span className="carousel-item-frequency">
                          {ordinals[idx]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {props.team.top_teams && props.team.top_teams.length > 0 && (
          <div className="top-teams-list">
            <div className="teams-header">{t("example_teams")}</div>
            {props.team.top_teams.slice(0, 3).map((topTeam, idx) => (
              <div key={idx} className="top-team-entry">
                <div className="team-rank">
                  Top {topTeam.rank}
                  <div className="team-elo">
                    <EloBadge elo={topTeam.elo} />
                  </div>
                </div>
                <div className="team-pokemons">
                  {topTeam.pokemons.map((pokemonData, pokemonIdx) => (
                    <div
                      key={`top_${idx}_${pokemonIdx}`}
                      className="pokemon-container"
                    >
                      <PokemonPortrait
                        portrait={PkmIndex[pokemonData.name as Pkm]}
                      />
                      <div className="pokemon-items">
                        {(pokemonData.items || []).map((item, i) => (
                          <img
                            key={i}
                            src={`/assets/item/${item}.png`}
                            data-tooltip-id="item-detail-tooltip"
                            data-tooltip-content={item}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
