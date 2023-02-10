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
        style={{ marginRight: "0.5em" }}
        key={id}
        href={contact}
      >
        {name}
      </a>
    )
  }

  return (
    <>
      <dd>{props.primary.length > 0 && findCredits(props.primary)}</dd>
      {props.secondary.length > 0 && (<>
        <dt>Others</dt>
        <dd><ul style={{paddingLeft: "12ch"}}>
          {props.secondary.map((s) => (<li key={s}>{findCredits(s)}</li>))}
        </ul></dd>
      </>)}
    </>
  )
}
