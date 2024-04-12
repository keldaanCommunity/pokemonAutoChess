import CSS from "csstype"
import React from "react"
import { useTranslation } from "react-i18next"
import { Item } from "../../../../../types/enum/Item"
import { useAppDispatch } from "../../../hooks"
import { itemClick } from "../../../stores/NetworkStore"
import { addIconsToDescription } from "../../utils/descriptions"

const style: CSS.Properties = {
  width: "320px",
  maxWidth: "20vw",
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  justifyContent: "space-around",
  textAlign: "center"
}

export default function GameItem(props: { item: Item }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  return (
    <div className="my-container" style={style}>
      <img
        style={{ width: "4rem", height: "4rem", imageRendering: "pixelated" }}
        src={"assets/item/" + props.item + ".png"}
      ></img>
      <h3>{t(`item.${props.item}`)}</h3>
      <p>{addIconsToDescription(t(`item_description.${props.item}`))}</p>
      <button
        onClick={() => {
          dispatch(itemClick(props.item))
        }}
        type="button"
        className="bubbly blue active"
      >
        Pick
      </button>
    </div>
  )
}
