import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import {
  ArtificialItems,
  Berries,
  Dishes,
  HMs,
  Item,
  ItemComponents,
  ItemRecipe,
  MemoryDiscs,
  ShinyItems,
  SpecialItems,
  SynergyGems,
  TMs,
  WeatherRocks
} from "../../../../../types/enum/Item"
import { Synergy } from "../../../../../types/enum/Synergy"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { addIconsToDescription } from "../../utils/descriptions"
import SynergyIcon from "../icons/synergy-icon"

export default function WikiItems() {
  const [itemHovered, setItemHovered] = useState<Item>()
  const { t } = useTranslation()
  const specialItems = SpecialItems.filter((i) => !(MemoryDiscs as readonly Item[]).includes(i)) // too many memory discs to display
  return (
    <div id="wiki-items">
      <article className="craftable">
        <h2>{t("item_recipes")}</h2>
        <p>{addIconsToDescription(t("craftable_items_description"))}</p>
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
                    data-tooltip-id="item-detail"
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
                    data-tooltip-id="item-detail"
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
                        data-tooltip-id="item-detail"
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
        <h2>{t("shiny_items")}</h2>
        <p>{addIconsToDescription(t("shiny_items_description"))}</p>
        <ul className="shiny">
          {ShinyItems.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>

        <h2>{t("special_items")}</h2>
        <p>{t("special_items_description")}</p>
        <ul className="special">
          {specialItems.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>
      </article>

      <article className="artificial">
        <h2>
          <SynergyIcon type={Synergy.ARTIFICIAL} /> {t("artificial_items")}
        </h2>
        <p>{addIconsToDescription(t("artificial_items_description"))}</p>
        <ul>
          {ArtificialItems.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>
      </article>

      <article className="gems">
        <h2>
          <SynergyIcon type={Synergy.GROUND} /> {t("gems")}
        </h2>
        <p>{addIconsToDescription(t("gems_description"))}</p>
        <ul>
          {SynergyGems.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>
      </article>

      <article className="weather-rocks">
        <h2>
          <SynergyIcon type={Synergy.ROCK} /> {t("weather_rocks")}
        </h2>
        <p>{addIconsToDescription(t("weather_rocks_description"))}</p>
        <ul>
          {WeatherRocks.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>
      </article>

      <article className="tm-hm">
        <h2>
          <SynergyIcon type={Synergy.HUMAN} /> {t("tm_hm")}
        </h2>
        <p>{addIconsToDescription(t("tm_hm_description"))}</p>
        <ul>
          {TMs.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/TM.png"} className="item"></img>
            </li>
          ))}
          {HMs.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/HM.png"} className="item"></img>
            </li>
          ))}
        </ul>
      </article>

      <article className="berries">
        <h2>
          <SynergyIcon type={Synergy.GRASS} /> {t("berries")}
        </h2>
        <p>{addIconsToDescription(t("berries_description"))}</p>
        <ul>
          {Berries.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
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

      <article className="dishes">
        <h2>
          <SynergyIcon type={Synergy.GOURMET} /> {t("dishes")}
        </h2>
        <p>{addIconsToDescription(t("dishes_description"))}</p>
        <ul>
          {Dishes.map((i) => (
            <li
              key={i}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(i)}
            >
              <img src={"assets/item/" + i + ".png"} className="item"></img>
            </li>
          ))}
        </ul>
      </article>

      {itemHovered && (
        <Tooltip
          id="item-detail"
          className="custom-theme-tooltip item-detail-tooltip"
        >
          <ItemDetailTooltip item={itemHovered} />
        </Tooltip>
      )}
    </div>
  )
}
