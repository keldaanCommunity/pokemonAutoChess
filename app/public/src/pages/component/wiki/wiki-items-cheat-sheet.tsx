import React from "react"
import { ItemRecipe } from "../../../../../types/Config"
import { BasicItems, Item } from "../../../../../types/enum/Item"
import ReactTooltip from "react-tooltip"
import CSS from "csstype"
import { ItemDetailTooltip } from "../../../game/components/item-detail.tsx"

const imgStyle: CSS.Properties = {
  imageRendering: "pixelated",
  width: "50px",
  height: "50px",
  cursor: "var(--cursor-hover)"
}

export default function WikiItemsCheatSheet() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table>
        <tbody>
          <tr>
            <td></td>
            {BasicItems.map((i) => {
              return (
                <th key={i} style={{ paddingBottom: "30px" }}>
                  <img style={imgStyle} src={"assets/item/" + i + ".png"}></img>
                </th>
              )
            })}
          </tr>
          {BasicItems.map((i) => {
            return (
              <tr key={"tr-" + i}>
                <th style={{ paddingRight: "30px" }}>
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
                      data-tip
                      data-for={"detail-" + i + "-" + j}
                    >
                      <img                      
                        style={imgStyle}
                        src={"assets/item/" + tier2Item + ".png"}
                      ></img>
                      <ReactTooltip
                        id={"detail-" + i + "-" + j}
                        className="customeTheme item-detail-tooltip"
                        effect="solid"
                      >
                        <ItemDetailTooltip item={tier2Item as Item} depth={1} />
                      </ReactTooltip>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
