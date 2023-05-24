import React from "react"
import "./life.css"

export function Life(props: { value?: number | string }) {
  return (
    <>
      {props.value && (
        <span style={{ verticalAlign: "middle" }}>{props.value}</span>
      )}
      <img className="icon-life" src="/assets/ui/heart.png" alt="❤" />
    </>
  )
}
