import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import {
  ArtificialItems,
  Berries,
  Dishes,
  FishingRods,
  HMs,
  Item,
  ItemComponents,
  ItemRecipe,
  MemoryDiscs,
  Mulches,
  ShinyItems,
  SpecialItems,
  SynergyGems,
  SynergyGemsBuried,
  TMs,
  Tools,
  TownItems,
  WeatherRocks
} from "../../../../../types/enum/Item"
import { Synergy } from "../../../../../types/enum/Synergy"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { addIconsToDescription } from "../../utils/descriptions"
import SynergyIcon from "../icons/synergy-icon"
import { isIn } from "../../../../../utils/array"

function ItemList(props: {
  items: readonly Item[]
  icon?: string
  onItemHover?: (item: Item) => void
}) {
  return props.items.map((i) => (
    <li
      key={i}
      data-tooltip-id="item-detail"
      onMouseOver={() => props.onItemHover?.(i)}
    >
      <img
        src={props.icon ?? "assets/item/" + i + ".png"}
        className="item"
      ></img>
    </li>
  ))
}

export default function WikiItems() {
  const [itemHovered, setItemHovered] = useState<Item>()
  const { t } = useTranslation()
  const otherBuriedItems = [
    Item.TRASH,
    Item.LEFTOVERS,
    Item.COIN,
    Item.NUGGET,
    Item.BIG_NUGGET
  ]
  const specialItems = useMemo(() => {
    const specialItemsToExclude: Item[] = [
      ...MemoryDiscs,
      ...TownItems,
      ...otherBuriedItems,
      ...FishingRods,
      ...Mulches,
      Item.CHEF_HAT,
      Item.FIRE_SHARD,
      Item.CELL_BATTERY
    ]
    return SpecialItems.filter((i) => !specialItemsToExclude.includes(i))
  }, []) // too many memory discs to display

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
          <ItemList items={ShinyItems} onItemHover={setItemHovered} />
        </ul>

        <h2>{t("town_items")}</h2>
        <p>{t("town_items_description")}</p>
        <ul className="town">
          <ItemList items={TownItems} onItemHover={setItemHovered} />
        </ul>

        <h2>{t("special_items")}</h2>
        <p>{t("special_items_description")}</p>
        <ul className="special">
          <ItemList items={specialItems} onItemHover={setItemHovered} />
        </ul>
      </article>

      <article className="synergy-items">
        <h2>{t("items_from_synergies")}</h2>
        <h3>
          <SynergyIcon type={Synergy.ARTIFICIAL} /> {t("tools")}
        </h3>
        <p>{addIconsToDescription(t("tools_description"))}</p>
        <ul>
          <ItemList items={ArtificialItems} onItemHover={setItemHovered} />
        </ul>
        <p>{addIconsToDescription(t("other_tools_description"))}</p>
        <ul>
          <ItemList
            items={Tools.filter((i) => isIn(ArtificialItems, i) === false)}
            onItemHover={setItemHovered}
          />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.GROUND} /> {t("gems")}
        </h3>
        <p>{addIconsToDescription(t("gems_description"))}</p>
        <ul>
          <ItemList items={SynergyGemsBuried} onItemHover={setItemHovered} />
        </ul>
        <p>{addIconsToDescription(t("gems_not_buried_description"))}</p>
        <ul>
          <ItemList
            items={SynergyGems.filter(
              (gem) => SynergyGemsBuried.includes(gem) === false
            )}
            onItemHover={setItemHovered}
          />
        </ul>
        <p>{addIconsToDescription(t("you_may_also_find_in_the_ground"))}</p>
        <ul>
          <ItemList items={otherBuriedItems} onItemHover={setItemHovered} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.ROCK} /> {t("weather_rocks")}
        </h3>
        <p>{addIconsToDescription(t("weather_rocks_description"))}</p>
        <ul>
          <ItemList items={WeatherRocks} onItemHover={setItemHovered} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.HUMAN} /> {t("tm_hm")}
        </h3>
        <p>{addIconsToDescription(t("tm_hm_description"))}</p>
        <ul>
          <ItemList items={TMs} onItemHover={setItemHovered} />
          <ItemList items={HMs} onItemHover={setItemHovered} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.GRASS} /> {t("berries")}
        </h3>
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

        <h3>
          <SynergyIcon type={Synergy.GOURMET} /> {t("dishes")}
        </h3>
        <p>{addIconsToDescription(t("dishes_description"))}</p>
        <ul>
          <ItemList
            items={[Item.CHEF_HAT, ...Dishes] as Item[]}
            onItemHover={setItemHovered}
          />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.WATER} /> {t("fishing_rods")}
        </h3>
        <p>{addIconsToDescription(t("fishing_rods_description"))}</p>
        <ul>
          <ItemList
            items={[...FishingRods].reverse()}
            onItemHover={setItemHovered}
          />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.FLORA} /> {t("mulch")}
        </h3>
        <p>{addIconsToDescription(t("mulch_description"))}</p>
        <ul>
          <ItemList items={Mulches} onItemHover={setItemHovered} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.ELECTRIC} /> {t("item.CELL_BATTERY")}
        </h3>
        <p>{addIconsToDescription(t("cell_battery_description"))}</p>
        <ul>
          <ItemList items={[Item.CELL_BATTERY]} onItemHover={setItemHovered} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.FIRE} /> {t("item.FIRE_SHARD")}
        </h3>
        <p>{addIconsToDescription(t("fire_shard_description"))}</p>
        <ul>
          <ItemList items={[Item.FIRE_SHARD]} onItemHover={setItemHovered} />
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
