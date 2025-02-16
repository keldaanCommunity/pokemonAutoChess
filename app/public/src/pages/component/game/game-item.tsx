import CSS from "csstype"
import React from "react"
import { useTranslation } from "react-i18next"
import { Item } from "../../../../../types/enum/Item"
import { useAppDispatch } from "../../../hooks"
import { itemClick } from "../../../stores/NetworkStore"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { usePreference } from "../../../preferences"

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
  const [antialiasing] = usePreference("antialiasing")
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  return (
    <div className="my-container" style={style}>
      <img
        style={{ width: "4rem", height: "4rem" }}
        src={"assets/item/" + props.item + ".png"}
        className={cc({ pixelated: !antialiasing })}
      ></img>
      <h3 style={{ margin: "0.25em 0" }}>{t(`item.${props.item}`)}</h3>
      <p style={{ marginBottom: "0.5em" }}>{addIconsToDescription(t(`item_description.${props.item}`))}</p>
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
