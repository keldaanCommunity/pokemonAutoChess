import React from "react"
import { useTranslation } from "react-i18next"
import { useCredits } from "../../../../../core/credits"

export default function Credits(props: {
  for: "sprite" | "portrait"
  index: string
}) {
  const { t } = useTranslation()
  const { spriteCredits, creditsNames } = useCredits()

  if (!spriteCredits || !spriteCredits.hasOwnProperty(props.index)) return null

  let credits
  if (props.for === "portrait") {
    credits = spriteCredits[props.index]?.portrait_credit
  } else {
    credits = spriteCredits[props.index]?.sprite_credit
  }

  if (!credits) return null

  function findCredits(id: string) {
    let contact = ""
    let name = ""
    if (creditsNames) {
      const user = creditsNames.find((user) => user.Discord === id)
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
      <dd>{credits.primary.length > 0 && findCredits(credits.primary)}</dd>
      {credits.secondary.length > 0 && (
        <>
          <dt>{t("others")}</dt>
          <dd>
            <ul style={{ paddingLeft: "12ch" }}>
              {credits.secondary.map((s) => (
                <li key={s}>{findCredits(s)}</li>
              ))}
            </ul>
          </dd>
        </>
      )}
    </>
  )
}
