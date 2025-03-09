import { t } from "i18next"
import React, { useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Tooltip } from "react-tooltip"
import { PkmWithCustom } from "../../../../../types"
import {
  ArtificialItems,
  ItemComponents,
  Berries,
  CraftableItems,
  Item,
  WeatherRocks,
  ShinyItems,
  SpecialItems
} from "../../../../../types/enum/Item"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { cc } from "../../utils/jsx"
import { usePreferences } from "../../../preferences"

export default function ItemPicker(props: {
  selected: PkmWithCustom | Item
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithCustom | Item>>
}) {
  const [{ antialiasing }] = usePreferences()
  const [itemHovered, setItemHovered] = useState<Item>()

  function handleOnDragStart(e: React.DragEvent, item: Item) {
    e.dataTransfer.setData("item", item)
  }

  const tabs = [
    { label: t("components"), key: "components", items: ItemComponents },
    { label: t("craftable_items"), key: "craftable", items: CraftableItems },
    { label: t("berries"), key: "berries", items: Berries },

    { label: t("artificial_items"), key: "artificial", items: ArtificialItems },
    {
      label: t("shiny_items"),
      key: "shiny_items",
      items: ShinyItems
    }
  ]

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
                selected: item === props.selected,
                pixelated: !antialiasing
              })}
              data-tooltip-id="item-detail"
              onMouseOver={() => setItemHovered(item)}
              onClick={() => props.selectEntity(item)}
              draggable
              onDragStart={(e) => handleOnDragStart(e, item)}
            />
          ))}
        </TabPanel>
      ))}
      {itemHovered && <Tooltip
        id="item-detail"
        className="custom-theme-tooltip item-detail-tooltip"
      >
        <ItemDetailTooltip item={itemHovered} />
      </Tooltip>}
    </Tabs>
  )
}
