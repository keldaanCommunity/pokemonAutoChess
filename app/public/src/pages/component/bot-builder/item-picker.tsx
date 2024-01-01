import React, { useState } from "react"
import { ArtificialItems, BasicItems, Berries, CompletedItems, Item } from "../../../../../types/enum/Item"
import { PkmWithConfig } from "../../../../../types"
import { Tooltip } from "react-tooltip"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { t } from "i18next"
import ReactDOM from "react-dom"

export default function ItemPicker(props: {
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithConfig | Item>>
}) {
  const [itemHovered, setItemHovered] = useState<Item>()

  function handleOnDragStart(e: React.DragEvent, item: Item) {
    e.dataTransfer.setData("item", item)
  }

  const tabs = [
    { label: t("components"), key: "components", items: BasicItems},
    { label: t("completed_items"), key: "completed", items: CompletedItems},
    { label: t("berries"), key: "berries", items: Berries},
    { label: t("artificial_items"), key: "artificial_items", items: ArtificialItems },
  ]

  return (
    <Tabs className="nes-container" id="item-picker">
    <TabList>
      {tabs.map((t) => (
          <Tab key={t.key}>
            {t.label}
          </Tab>
      ))}
    </TabList>
    {tabs.map((t) => (<TabPanel key={t.key}>
      {t.items.map((item) => (
        <img
          key={item}
          src={"assets/item/" + Item[item] + ".png"}
          className="item"
          data-tooltip-id="detail-item"
          onMouseOver={() => setItemHovered(item)}
          onClick={() => props.selectEntity(item)}
          draggable
          onDragStart={(e) => handleOnDragStart(e, item)}
        />
      ))}
      </TabPanel>))}
      {itemHovered && ReactDOM.createPortal(
        <Tooltip
          id="detail-item"
          className="custom-theme-tooltip item-detail-tooltip"
        >
          <ItemDetailTooltip item={itemHovered} />
        </Tooltip>
      , document.body)}
    </Tabs>
  )
}
