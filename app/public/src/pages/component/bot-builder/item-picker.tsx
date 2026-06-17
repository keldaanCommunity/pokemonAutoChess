import { t } from "i18next"
import type React from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import type { PkmWithCustom } from "../../../../../types"
import {
  Berries,
  CraftableItems,
  Item,
  ItemComponents,
  MemoryDiscs,
  ShinyItems,
  TMs,
  Tools,
  UnholdableItems,
  Wands
} from "../../../../../types/enum/Item"
import { isIn } from "../../../../../utils/array"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { cc } from "../../utils/jsx"

export default function ItemPicker(props: {
  selected?: PkmWithCustom | Item
  selectEntity?: React.Dispatch<React.SetStateAction<PkmWithCustom | Item>>
  origin: "tier-list" | "bot-builder" | "team-planner"
}) {
  function handleOnDragStart(e: React.DragEvent, item: Item) {
    e.stopPropagation()
    e.dataTransfer.setData("text/plain", `item,${item}`)
  }

  const tabs = [
    { label: t("components"), key: "components", items: ItemComponents },
    { label: t("craftable_items"), key: "craftable", items: CraftableItems },
    {
      label: t("food"),
      key: "food",
      items: [
        ...Berries,
        Item.TART_APPLE,
        Item.SWEET_APPLE,
        Item.SIRUPY_APPLE,
        Item.CHEF_HAT
      ]
    },

    { label: t("tools"), key: "tools", items: Tools },
    {
      label: t("shiny_items"),
      key: "shiny_items",
      items: ShinyItems
    },
    {
      label: t("tm_short"),
      key: "tm",
      items: TMs
    },
    {
      label: t("wands"),
      key: "wands",
      items: Wands,
      hidden: props.origin === "team-planner" || props.origin === "bot-builder"
    },
    {
      label: t("special_items"),
      key: "special_items",
      items: [
        Item.RUSTED_SWORD,
        Item.TEAL_MASK,
        Item.WELLSPRING_MASK,
        Item.CORNERSTONE_MASK,
        Item.HEARTHFLAME_MASK,
        ...MemoryDiscs
      ]
    }
  ].filter((tab) => !tab.hidden)

  if (props.origin !== "tier-list") {
    tabs.forEach((tab) => {
      if (tab.key !== "tm") {
        tab.items = tab.items.filter((item) => !isIn(UnholdableItems, item))
      }
    })
  }

  return (
    <Tabs className="my-box" id="item-picker">
      <TabList>
        {tabs.map((t) => (
          <Tab key={t.key}>{t.label}</Tab>
        ))}
      </TabList>
      {tabs.map((t) => (
        <TabPanel key={t.key}>
          {t.items.map((item) => (
            <img
              key={item}
              src={"assets/item/" + Item[item] + ".png"}
              className={cc("item", {
                selected: item === props.selected
              })}
              data-tooltip-id="item-detail-tooltip"
              data-tooltip-content={item}
              onClick={() => props.selectEntity?.(item)}
              draggable
              onDragStart={(e) => handleOnDragStart(e, item)}
            />
          ))}
        </TabPanel>
      ))}
      <ItemDetailTooltip />
    </Tabs>
  )
}
