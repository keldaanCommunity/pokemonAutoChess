import React from "react"
import { useTranslation } from "react-i18next"
import { useCredits } from "../../../../../core/credits"

export default function Credits(props: {
  for: "sprite" | "portrait"
  index: string
}) {
  const { t } = useTranslation()
  const { spriteCredits, creditsNames } = useCredits()

  if (!spriteCredits || !(props.index in spriteCredits)) return null

  let credits
  if (props.for === "portrait") {
    credits = spriteCredits[props.index].portrait_credit
  } else {
    credits = spriteCredits[props.index].sprite_credit
  }

  if (!credits) return null

  function findCredits(id: string) {
    let contact = ""
    let name = ""
    if (creditsNames) {
      const user = creditsNames.find((user) => user.discord === id)
      if (user != null) {
        contact = user.contact
        name = user.name
      }
    }
    return contact ? (
      <a style={{ marginRight: "0.5em" }} key={id} href={contact}>
        {name}
      </a>
    ) : name ? (
      <span style={{ marginRight: "0.5em" }} key={id}>
        {name}
      </span>
    ) : null
  }

  return (
    <>
      <dd>{credits.primary.length > 0 && findCredits(credits.primary)}</dd>
      {credits.secondary.length > 0 && (
        <>
          <dt>{t("others")}</dt>
          <dd>
            <ul style={{ display: "inline-block" }}>
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
