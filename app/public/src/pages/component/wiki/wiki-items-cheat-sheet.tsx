import React, { useState } from "react"
import { ItemRecipe } from "../../../../../types/Config"
import { BasicItems, Berries, Item } from "../../../../../types/enum/Item"
import { Tooltip } from "react-tooltip"
import CSS from "csstype"
import { ItemDetailTooltip } from "../../../game/components/item-detail"
import ReactDOM from "react-dom"

export default function WikiItemsCheatSheet() {
  const [itemHovered, setItemHovered] = useState<Item>()
  return (
    <div id="wiki-items">
      <article>
        <h2>Item Recipes</h2>
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
              {BasicItems.map((i) => {
                return (
                  <th
                    key={i}
                    data-tooltip-id="detail-item"
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
            {BasicItems.map((i) => {
              return (
                <tr key={"tr-" + i}>
                  <td
                    data-tooltip-id="detail-item"
                    onMouseOver={() => setItemHovered(i)}
                  >
                    <img
                      src={"assets/item/" + i + ".png"}
                      className="item"
                    ></img>
                  </td>
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
                        key={"td-" + i + "-" + j}
                        data-tooltip-id="detail-item"
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
        <h2>Berries</h2>
        <ul className="berries">
          {Berries.map((i) => (
            <li
              key={i}
              data-tooltip-id="detail-item"
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
    </div>
  )
}
