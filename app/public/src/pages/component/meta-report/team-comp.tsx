import { useTranslation } from "react-i18next"
import { IMetaV2 } from "../../../../../models/mongo-models/meta-v2"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"
import PokemonPortrait from "../pokemon-portrait"
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
            <span>
              <label>{t("average_place")}:</label>
              {props.team.mean_rank.toFixed(2)}
            </span>
            <span>
              <label>{t("winrate")}:</label>
              {props.team.winrate.toFixed(2)} %
            </span>
            <span>
              <label>{t("popularity")}:</label>
              {props.team.ratio.toFixed(2)} %
            </span>
            <span>
              <label>{t("count")}:</label>
              {props.team.count}
            </span>
          </div>
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
        {props.team.top_teams && props.team.top_teams.length > 0 && (
          <div className="top-teams-list">
            {props.team.top_teams.map((topTeam, idx) => (
              <div key={idx} className="top-team-entry">
                <div className="team-rank">
                  #{topTeam.rank}
                  <div className="team-elo">{topTeam.elo}</div>
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
