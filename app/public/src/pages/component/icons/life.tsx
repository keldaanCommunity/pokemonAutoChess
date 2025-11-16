import React from "react"
import "./life.css"

export function Life(props: { value?: number | string }) {
  return (
    <>
      {props.value && (
        <span
          style={{
            verticalAlign: "middle",
            flex: "1",
            color: +props.value < 0 ? "red" : "inherit"
          }}
        >
          {props.value}
        </span>
      )}
      <img className="icon-life" src="/assets/ui/heart.png" alt="❤" />
    </>
  )
}
