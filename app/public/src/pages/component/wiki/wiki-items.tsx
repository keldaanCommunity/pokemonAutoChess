import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  ArtificialItems,
  Berries,
  Dishes,
  FishingRods,
  HMs,
  Item,
  ItemComponentsNoScarf,
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
import { isIn } from "../../../../../utils/array"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { addIconsToDescription } from "../../utils/descriptions"
import SynergyIcon from "../icons/synergy-icon"

function ItemList(props: { items: readonly Item[]; icon?: string }) {
  return props.items.map((i) => (
    <li key={i} data-tooltip-id="item-detail-tooltip" data-tooltip-content={i}>
      <img
        src={props.icon ?? "assets/item/" + i + ".png"}
        className="item"
      ></img>
    </li>
  ))
}

export default function WikiItems() {
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

  const components = ItemComponentsNoScarf

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
              {components.map((i) => {
                return (
                  <th
                    key={i}
                    data-tooltip-id="item-detail-tooltip"
                    data-tooltip-content={i}
                  >
                    <img
                      src={"assets/item/" + i + ".png"}
                      className="item"
                    ></img>
                  </th>
                )
              })}
            </tr>
            {components.map((i) => {
              return (
                <tr key={"tr-" + i}>
                  <td
                    data-tooltip-id="item-detail-tooltip"
                    data-tooltip-content={i}
                  >
                    <img
                      src={"assets/item/" + i + ".png"}
                      className="item"
                    ></img>
                  </td>
                  {components.map((j) => {
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
                        data-tooltip-id="item-detail-tooltip"
                        data-tooltip-content={tier2Item}
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
          <ItemList items={ShinyItems} />
        </ul>

        <h2>{t("town_items")}</h2>
        <p>{t("town_items_description")}</p>
        <ul className="town">
          <ItemList items={TownItems} />
        </ul>

        <h2>{t("special_items")}</h2>
        <p>{t("special_items_description")}</p>
        <ul className="special">
          <ItemList items={specialItems} />
        </ul>
      </article>

      <article className="synergy-items">
        <h2>{t("items_from_synergies")}</h2>

        <h3>
          <SynergyIcon type={Synergy.NORMAL} /> {t("scarves")}
        </h3>
        <p>{addIconsToDescription(t("scarves_description"))}</p>
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
              {[...components, Item.SILK_SCARF].map((i) => {
                return (
                  <th
                    key={i}
                    data-tooltip-id="item-detail-tooltip"
                    data-tooltip-content={i}
                  >
                    <img
                      src={"assets/item/" + i + ".png"}
                      className="item"
                    ></img>
                  </th>
                )
              })}
            </tr>
            <tr>
              <td
                data-tooltip-id="item-detail-tooltip"
                data-tooltip-content={Item.SILK_SCARF}
              >
                <img
                  src={"assets/item/" + Item.SILK_SCARF + ".png"}
                  className="item"
                ></img>
              </td>
              {[...components, Item.SILK_SCARF].map((j) => {
                let tier2Item
                Object.keys(ItemRecipe).forEach((recipeName) => {
                  if (
                    (ItemRecipe[recipeName][0] == Item.SILK_SCARF &&
                      ItemRecipe[recipeName][1] == j) ||
                    (ItemRecipe[recipeName][0] == j &&
                      ItemRecipe[recipeName][1] == Item.SILK_SCARF)
                  ) {
                    tier2Item = recipeName
                  }
                })
                return (
                  <td
                    key={"td-" + Item.SILK_SCARF + "-" + j}
                    data-tooltip-id="item-detail-tooltip"
                    data-tooltip-content={tier2Item}
                  >
                    <img
                      src={"assets/item/" + tier2Item + ".png"}
                      className="item"
                    ></img>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>

        <h3>
          <SynergyIcon type={Synergy.ARTIFICIAL} /> {t("tools")}
        </h3>
        <p>{addIconsToDescription(t("tools_description"))}</p>
        <ul>
          <ItemList items={ArtificialItems} />
        </ul>
        <p>{addIconsToDescription(t("other_tools_description"))}</p>
        <ul>
          <ItemList
            items={Tools.filter((i) => isIn(ArtificialItems, i) === false)}
          />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.GROUND} /> {t("gems")}
        </h3>
        <p>{addIconsToDescription(t("gems_description"))}</p>
        <ul>
          <ItemList items={SynergyGemsBuried} />
        </ul>
        <p>{addIconsToDescription(t("gems_not_buried_description"))}</p>
        <ul>
          <ItemList
            items={SynergyGems.filter(
              (gem) => SynergyGemsBuried.includes(gem) === false
            )}
          />
        </ul>
        <p>{addIconsToDescription(t("you_may_also_find_in_the_ground"))}</p>
        <ul>
          <ItemList items={otherBuriedItems} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.ROCK} /> {t("weather_rocks")}
        </h3>
        <p>{addIconsToDescription(t("weather_rocks_description"))}</p>
        <ul>
          <ItemList items={WeatherRocks} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.HUMAN} /> {t("tm_hm")}
        </h3>
        <p>{addIconsToDescription(t("tm_hm_description"))}</p>
        <ul>
          <ItemList items={TMs} />
          <ItemList items={HMs} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.GRASS} /> {t("berries")}
        </h3>
        <p>{addIconsToDescription(t("berries_description"))}</p>
        <ul>
          {Berries.map((berry) => (
            <li
              key={berry}
              data-tooltip-id="item-detail-tooltip"
              data-tooltip-content={berry}
            >
              <img src={"assets/item/" + berry + ".png"} className="item"></img>
              <br />
              <img
                src={"assets/environment/berry_trees/" + berry + "_6.png"}
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
          <ItemList items={[Item.CHEF_HAT, ...Dishes] as Item[]} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.WATER} /> {t("fishing_rods")}
        </h3>
        <p>{addIconsToDescription(t("fishing_rods_description"))}</p>
        <ul>
          <ItemList items={[...FishingRods].reverse()} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.FLORA} /> {t("mulch")}
        </h3>
        <p>{addIconsToDescription(t("mulch_description"))}</p>
        <ul>
          <ItemList items={Mulches} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.ELECTRIC} /> {t("item.CELL_BATTERY")}
        </h3>
        <p>{addIconsToDescription(t("cell_battery_description"))}</p>
        <ul>
          <ItemList items={[Item.CELL_BATTERY]} />
        </ul>

        <h3>
          <SynergyIcon type={Synergy.FIRE} /> {t("item.FIRE_SHARD")}
        </h3>
        <p>{addIconsToDescription(t("fire_shard_description"))}</p>
        <ul>
          <ItemList items={[Item.FIRE_SHARD]} />
        </ul>
      </article>

      <ItemDetailTooltip />
    </div>
  )
}
