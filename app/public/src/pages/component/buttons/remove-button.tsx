import React, { MouseEventHandler } from "react"

export function RemoveButton(props: {
  onClick: MouseEventHandler
  title?: string
}) {
  return (
    <button
      className="bubbly red"
      title={props.title}
      onClick={props.onClick}
      style={{
        padding: 0,
        fontSize: "1vw",
        height: "2em",
        width: "2em"
      }}
    >
      🗙
    </button>
  )
}
