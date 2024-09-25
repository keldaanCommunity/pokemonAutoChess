import React from "react"
import "./money.css"

export function Money(props: { value?: number | string }) {
  return (
    <>
      {props.value != null && (
        <span style={{ verticalAlign: "middle", flex: "1", fontWeight: "500" }}>
          {props.value}
        </span>
      )}
      <img className="icon-money" src="/assets/icons/money.svg" alt="$" />
    </>
  )
}
