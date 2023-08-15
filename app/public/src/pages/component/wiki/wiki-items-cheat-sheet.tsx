import React, { useState } from "react"
import { ItemRecipe } from "../../../../../types/Config"
import { BasicItems, Item } from "../../../../../types/enum/Item"
import { Tooltip } from "react-tooltip"
import CSS from "csstype"
import { ItemDetailTooltip } from "../../../game/components/item-detail.tsx"

const imgStyle: CSS.Properties = {
  imageRendering: "pixelated",
  width: "50px",
  height: "50px",
  cursor: "var(--cursor-hover)"
}

export default function WikiItemsCheatSheet() {
  const [itemHovered, setItemHovered] = useState<Item>(null)
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table>
        <tbody>
          <tr>
            <td
              style={{
                fontSize: "300%",
                verticalAlign: "middle",
                lineHeight: 0,
                paddingBottom: "30px"
              }}
            >
              +
            </td>
            {BasicItems.map((i) => {
              return (
                <th
                  key={i}
                  style={{ paddingBottom: "30px" }}
                  data-tooltip-id="detail-item"
                  onMouseOver={() => setItemHovered(i)}
                >
                  <img style={imgStyle} src={"assets/item/" + i + ".png"}></img>
                </th>
              )
            })}
          </tr>
          {BasicItems.map((i) => {
            return (
              <tr key={"tr-" + i}>
                <th
                  style={{ paddingRight: "30px" }}
                  data-tooltip-id="detail-item"
                  onMouseOver={() => setItemHovered(i)}
                >
                  <img style={imgStyle} src={"assets/item/" + i + ".png"}></img>
                </th>
                {BasicItems.map((j) => {
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
                      style={{ paddingRight: "5px" }}
                      key={"td-" + i + "-" + j}
                      data-tooltip-id="detail-item"
                      onMouseOver={() => setItemHovered(tier2Item)}
                    >
                      <img
                        style={imgStyle}
                        src={"assets/item/" + tier2Item + ".png"}
                      ></img>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {itemHovered && (
        <Tooltip id="detail-item" className="customeTheme item-detail-tooltip">
          <ItemDetailTooltip item={itemHovered} depth={1} />
        </Tooltip>
      )}
    </div>
  )
}
