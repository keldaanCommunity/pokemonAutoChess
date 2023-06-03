import React from "react"
import "./money.css"

export function Money(props: { value?: number | string }) {
  return (
    <>
      {props.value && (
        <span style={{ verticalAlign: "middle", flex: "1" }}>{props.value}</span>
      )}
      <img className="icon-money" src="/assets/ui/money.svg" alt="$" />
    </>
  )
}
