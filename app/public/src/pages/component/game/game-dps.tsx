import React from "react"
import { IDps } from "../../../../../types"
import { useTranslation } from "react-i18next"
import ProgressBar from "../progress-bar/progress-bar"
import PokemonPortrait from "../pokemon-portrait"

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
            style={{ backgroundColor: "#e76e55" }}
            max={props.maxDamage}
            now={props.dps.physicalDamage}
            key="physical"
            title={`${t("physical_damage_dealt")}: ${props.dps.physicalDamage}`}
          />
          <ProgressBar
            style={{ backgroundColor: "#209cee" }}
            max={props.maxDamage}
            now={props.dps.specialDamage}
            key="special"
            title={`${t("special_damage_dealt")}: ${props.dps.specialDamage}`}
          />
          <ProgressBar
            style={{ backgroundColor: "#f7d51d" }}
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
