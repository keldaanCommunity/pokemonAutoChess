import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import {
  ArtificialItems,
  ItemComponents,
  Berries,
  Item,
  ItemRecipe,
  SpecialItems,
  ShinyItems,
  WeatherRocks
} from "../../../../../types/enum/Item"
import { Synergy } from "../../../../../types/enum/Synergy"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import SynergyIcon from "../icons/synergy-icon"

export default function WikiItems() {
  const [itemHovered, setItemHovered] = useState<Item>()
  const { t } = useTranslation()
  return (
    <div id="wiki-items">
      <article>
        <h2>{t("item_recipes")}</h2>
        <table>
          <tbody>
            <tr>
              <td
                style={{
                  fontSize: "300%",
                  verticalAlign: "middle",
                  textAlign: "center",
                  lineHeight: 0
                }}
              >
                +
              </td>
              {ItemComponents.map((i) => {
                return (
                  <th
                    key={i}
                    data-tooltip-id="detail-item"
                    onMouseOver={() => setItemHovered(i)}
                  >
                    <img
                      src={"assets/item/" + i + ".png"}
                      className="item"
                    ></img>
                  </th>
                )
              })}
            </tr>
            {ItemComponents.map((i) => {
              return (
                <tr key={"tr-" + i}>
                  <td
                    data-tooltip-id="detail-item"
                    onMouseOver={() => setItemHovered(i)}
                  >
                    <img
                      src={"assets/item/" + i + ".png"}
                      className="item"
                    ></img>
                  </td>
                  {ItemComponents.map((j) => {
                    let tier2Item
                    Object.keys(ItemRecipe).forEach((recipeName) => {
                      if (
                        (ItemRecipe[recipeName][0] == i &&
                          ItemRecipe[recipeName][1] == j) ||
                        (ItemRecipe[recipeName][0] == j &&
                          ItemRecipe[recipeName][1] == i)
                      ) {
                        tier2Item = recipeName
                      }
                    })
                    return (
                      <td
                        key={"td-" + i + "-" + j}
                        data-tooltip-id="detail-item"
                        onMouseOver={() => setItemHovered(tier2Item)}
                      >
                        <img
                          src={"assets/item/" + tier2Item + ".png"}
                          className="item"
                        ></img>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </article>
      <article>
        <h2>
          <SynergyIcon type={Synergy.GRASS} /> {t("berries")}
        </h2>
        <ul className="berries">
          {Berries.map((i) => (
            <li
              key={i}
              data-tooltip-id="detail-item"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
              <br />
              <img
                src={"assets/environment/berry_trees/" + i + "_6.png"}
                className="tree"
              ></img>
            </li>
          ))}
        </ul>
      </article>
      <article>
        <h2>
          <SynergyIcon type={Synergy.ARTIFICIAL} /> {t("artificial_items")}
        </h2>
        <ul className="artificial">
          {ArtificialItems.map((i) => (
            <li
              key={i}
              data-tooltip-id="detail-item"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>

        <h2>
          <SynergyIcon type={Synergy.ROCK} /> {t("weather_rocks")}
        </h2>
        <ul className="weather-rocks">
          {WeatherRocks.map((i) => (
            <li
              key={i}
              data-tooltip-id="detail-item"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>

        <h2>{t("shiny_items")}</h2>
        <ul className="shiny">
          {ShinyItems.map((i) => (
            <li
              key={i}
              data-tooltip-id="detail-item"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>

        <h2>{t("special_items")}</h2>
        <ul className="special">
          {SpecialItems.map((i) => (
            <li
              key={i}
              data-tooltip-id="detail-item"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>
      </article>

      {itemHovered &&
        ReactDOM.createPortal(
          <Tooltip
            id="detail-item"
            className="custom-theme-tooltip item-detail-tooltip"
          >
            <ItemDetailTooltip item={itemHovered} />
          </Tooltip>,
          document.body
        )}
    </div>
  )
}
