import React from "react"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { IItemsStatistic } from "../../../../../models/mongo-models/items-statistic"
import { getPortraitSrc } from "../../../utils"
import { useTranslation } from "react-i18next"

export default function ItemStatistic(props: {
  item: IItemsStatistic
  rank: number
}) {
  const { t } = useTranslation()
  return (
    <div className="item-stat nes-container">
      <span className="rank">{props.rank}</span>
      <img
        src={"assets/item/" + props.item.name + ".png"}
        style={{
          width: "48px",
          height: "48px",
          imageRendering: "pixelated"
        }}
      ></img>
      <span>{t(`item.${props.item.name}`)}</span>
      <span>
        {t("average_place")}: {props.item.rank}
      </span>
      <span>
        {t("count")}: {props.item.count}
      </span>
      <div style={{ display: "flex", gap: "0.5em" }}>
        <span>{t("popular_holders")}:</span>
        {props.item.pokemons.map((pokemon) => (
          <img
            key={pokemon}
            className="pokemon-portrait"
            src={getPortraitSrc(PkmIndex[pokemon])}
          />
        ))}
      </div>
    </div>
  )
}
