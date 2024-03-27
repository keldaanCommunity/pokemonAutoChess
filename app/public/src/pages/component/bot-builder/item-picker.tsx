import { t } from "i18next"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { Tooltip } from "react-tooltip"
import { PkmWithConfig } from "../../../../../types"
import {
  ArtificialItems,
  BasicItems,
  Berries,
  CraftableItems,
  Item
} from "../../../../../types/enum/Item"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { cc } from "../../utils/jsx"

export default function ItemPicker(props: {
  selected: PkmWithConfig | Item
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithConfig | Item>>
}) {
  const [itemHovered, setItemHovered] = useState<Item>()

  function handleOnDragStart(e: React.DragEvent, item: Item) {
    e.dataTransfer.setData("item", item)
  }

  const tabs = [
    { label: t("components"), key: "components", items: BasicItems },
    { label: t("craftable_items"), key: "craftable", items: CraftableItems },
    { label: t("berries"), key: "berries", items: Berries },
    {
      label: t("artificial_items"),
      key: "artificial_items",
      items: ArtificialItems
    }
  ]

  return (
    <Tabs className="nes-container" id="item-picker">
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
              className={cc("item", { selected: item === props.selected })}
              data-tooltip-id="detail-item"
              onMouseOver={() => setItemHovered(item)}
              onClick={() => props.selectEntity(item)}
              draggable
              onDragStart={(e) => handleOnDragStart(e, item)}
            />
          ))}
        </TabPanel>
      ))}
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
    </Tabs>
  )
}
