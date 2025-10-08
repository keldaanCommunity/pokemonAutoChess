import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Ability } from "../../../../../types/enum/Ability"
import { addIconsToDescription } from "../../utils/descriptions"
import "./ability-tooltip.css"
import { preference } from "../../../preferences"

export function AbilityTooltip(props: {
  ability: Ability
  stats?: { stars: number; stages: number; ap: number; luck: number }
}) {
  const { t } = useTranslation()

  const keybindings = preference("keybindings")
  
  const [isExtraKeyPressed, setExtraKeyPressed] = useState(false)
  useEffect(() => {


    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toUpperCase() === keybindings.expand_description) {
        setExtraKeyPressed(true)
      }

    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.toUpperCase() === keybindings.expand_description) {
        setExtraKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [preference])



  const description = t(`ability_description.${props.ability}`)
  const extraDetailText = t(`ability_extra_detail.${props.ability}`)

  //only render extra details if a key is found in the table
  if (!extraDetailText.startsWith("ability_extra_detail") && isExtraKeyPressed) {
    return (
      <>
        <p className="ability-description">
          {addIconsToDescription(description, props.stats)}
        </p>
        {/*Only render if the key is pressed and extra de */}
        {extraDetailText && (      
        <div className="ability-extra-detail ability-description">
          <p> {addIconsToDescription(extraDetailText, props.stats)}</p>
        </div>)}

      </>
    )
  } else {
      return (
    <>
      <p className="ability-description">
        {addIconsToDescription(description, props.stats)}
      </p>
    </>
    )
  }



}
