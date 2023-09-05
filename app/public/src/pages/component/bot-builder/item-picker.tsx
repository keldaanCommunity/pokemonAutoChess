import React, { useState } from "react"
import { Item } from "../../../../../types/enum/Item"
import { PkmWithConfig } from "../../../../../types"
import ReactTooltip from "react-tooltip"
import { ItemDetailTooltip } from "../../../game/components/item-detail"

export default function ItemPicker(props: {
  selectEntity: React.Dispatch<React.SetStateAction<PkmWithConfig | Item>>
}) {
  const [itemHovered, setItemHovered] = useState<Item>()

  function handleOnDragStart(e: React.DragEvent, item: Item) {
    e.dataTransfer.setData("item", item)
  }

  return (
    <div id="item-picker" className="nes-container">
      {(Object.keys(Item) as Item[]).map((item) => (
        <img
          key={item}
          src={"assets/item/" + Item[item] + ".png"}
          data-tip
          data-for="detail-item"
          onMouseOver={() => setItemHovered(item)}
          onClick={() => props.selectEntity(item)}
          draggable
          onDragStart={(e) => handleOnDragStart(e, item)}
        />
      ))}
      {itemHovered && (
        <ReactTooltip
          id="detail-item"
          className="customeTheme item-detail-tooltip"
        >
          <ItemDetailTooltip item={itemHovered} />
        </ReactTooltip>
      )}
    </div>
  )
}
