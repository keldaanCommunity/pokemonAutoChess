import React from "react"
import { useTranslation } from "react-i18next"
import { IDps } from "../../../../../types"
import PokemonPortrait from "../pokemon-portrait"
import ProgressBar from "../progress-bar/progress-bar"

export default function GameDps(props: { maxDamage: number; dps: IDps }) {
  const { t } = useTranslation()
  return (
    <div className="game-dps-bar">
      <PokemonPortrait avatar={props.dps.name} />
      <div className="game-dps-progress-wrapper">
        <p>
          {props.dps.physicalDamage +
            props.dps.specialDamage +
            props.dps.trueDamage}
        </p>
        <ProgressBar className="my-progress is-primary">
          <ProgressBar
            style={{ backgroundColor: "var(--color-physical)" }}
            max={props.maxDamage}
            now={props.dps.physicalDamage}
            key="physical"
            title={`${t("physical_damage_dealt")}: ${props.dps.physicalDamage}`}
          />
          <ProgressBar
            style={{ backgroundColor: "var(--color-special)" }}
            max={props.maxDamage}
            now={props.dps.specialDamage}
            key="special"
            title={`${t("special_damage_dealt")}: ${props.dps.specialDamage}`}
          />
          <ProgressBar
            style={{ backgroundColor: "var(--color-true)" }}
            max={props.maxDamage}
            now={props.dps.trueDamage}
            key="true"
            title={`${t("true_damage_dealt")}: ${props.dps.trueDamage}`}
          />
        </ProgressBar>
      </div>
    </div>
  )
}
