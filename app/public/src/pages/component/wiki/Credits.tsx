import { ICreditName } from "../../../../../types"
import React from "react"

export default function Credits(props: {
  credits: ICreditName[]
  primary: string
  secondary: string[]
}) {
  function findCredits(id: string) {
    let contact = ""
    let name = ""
    if (props.credits) {
      const user = props.credits.find(user => user.Discord === id)
      if (user != null) {
        contact = user.Contact
        name = user.Name
      }
    }
    return (
      <a
        className="nes-text is-primary"
        style={{ marginRight: "20px" }}
        key={id}
        href={contact}
      >
        {name}
      </a>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexGrow: ".3",
        justifyContent: "space-around"
      }}
    >
      {props.primary.length !== 0 ? (
        <div>
          <p>{findCredits(props.primary)}</p>
        </div>
      ) : null}

      {props.secondary.length !== 0 ? (
        <div>
          <p>Others</p>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {props.secondary.map((s) => findCredits(s))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
