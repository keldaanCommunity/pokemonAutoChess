import React from "react"
import { Item } from "../../../../../types/enum/Item"
import CSS from "csstype"
import { DetailledPkm } from "../../../../../types"

const itemPoolStyle: CSS.Properties = {
  display: "flex",
  flexWrap: "wrap",
  margin: "10px",
  marginTop: "0px"
}

const imgStyle: CSS.Properties = {
  width: "40px",
  height: "40px",
  imageRendering: "pixelated",
  cursor: "var(--cursor-hover)"
}

export default function ItemPicker(props: {
  selectEntity: React.Dispatch<React.SetStateAction<DetailledPkm | Item>>
}) {
  return (
    <div className="nes-container" style={itemPoolStyle}>
      {(Object.keys(Item) as Item[]).map((item) => {
        return (
          <div
            onClick={() => {
              props.selectEntity(item)
            }}
            key={item}
          >
            <img style={imgStyle} src={"assets/item/" + Item[item] + ".png"} />
          </div>
        )
      })}
    </div>
  )
}
