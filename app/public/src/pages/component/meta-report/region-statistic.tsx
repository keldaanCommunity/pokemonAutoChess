import { useTranslation } from "react-i18next"
import { RegionDetails } from "../../../../../config"
import { IRegionStatistic } from "../../../../../models/mongo-models/regions-statistic"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import PokemonPortrait from "../pokemon-portrait"
import SynergyIcon from "../icons/synergy-icon"

export default function RegionStatistic(props: {
  region: IRegionStatistic
  rank: number
}) {
  const { t } = useTranslation()
  const details = RegionDetails[props.region.name]

  return (
    <div className="region-stat my-box">
      <span className="rank">{props.rank}</span>
      {details && (
        <img
          src={`/assets/maps/${props.region.name}-preview.png`}
          style={{
            width: "48px",
            height: "48px",
            objectFit: "cover"
          }}
          alt={props.region.name}
        ></img>
      )}
      <span>{t(`map.${props.region.name}`)}</span>
      <div>
        {details?.synergies?.map((synergy) => (
          <SynergyIcon key={synergy} type={synergy} size="38px" />
        ))}
      </div>
      <div>
        <span>
          <label>{t("count")}:</label> {props.region.count}
        </span>
        <span>
          <label>{t("average_place")}:</label> {props.region.rank.toFixed(2)}
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
        <label>{t("popular_pokemons")}:</label>
        {(props.region.pokemons as Pkm[]).map((pokemon) => (
          <PokemonPortrait portrait={PkmIndex[pokemon]} key={pokemon} />
        ))}
      </div>
    </div>
  )
}
