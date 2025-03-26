import React from "react"
import { useTranslation } from "react-i18next"
import { IItemsStatistic } from "../../../../../models/mongo-models/items-statistic"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import PokemonPortrait from "../pokemon-portrait"

export default function ItemStatistic(props: {
  item: IItemsStatistic
  rank: number
}) {
  const { t } = useTranslation()
  return (
    <div className="item-stat my-box">
      <span className="rank">{props.rank}</span>
      <img
        src={"assets/item/" + props.item.name + ".png"}
        style={{
          width: "48px",
          height: "48px"
        }}
      ></img>
      <span>{t(`item.${props.item.name}`)}</span>
      <span>
        <label>{t("average_place")}:</label> {props.item.rank}
      </span>
      <span>
        <label>{t("count")}:</label> {props.item.count}
      </span>
      <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
        <label>{t("popular_holders")}:</label>
        {props.item.pokemons.map((pokemon) => (
          <PokemonPortrait portrait={PkmIndex[pokemon]} key={pokemon} />
        ))}
      </div>
    </div>
  )
}
