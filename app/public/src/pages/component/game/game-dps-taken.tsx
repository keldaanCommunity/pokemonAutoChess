import React from "react"
import { IDps } from "../../../../../types"
import { useTranslation } from "react-i18next"
import ProgressBar from "../progress-bar/progress-bar"
import PokemonPortrait from "../pokemon-portrait"

export default function GameDpsTaken(props: {
  maxDamageTaken: number
  dps: IDps
}) {
  const { t } = useTranslation()
  return (
    <div className="game-dps-bar">
      <PokemonPortrait avatar={props.dps.name} />
      <div className="game-dps-progress-wrapper">
        <p>
          {props.dps.physicalDamageReduced +
            props.dps.specialDamageReduced +
            props.dps.shieldDamageTaken}
        </p>
        <ProgressBar className="my-progress is-primary">
          <ProgressBar
            style={{ backgroundColor: "#e76e55" }}
            max={props.maxDamageTaken}
            now={props.dps.physicalDamageReduced}
            key="hp"
            title={`${t("physical_damage_reduced")}: ${props.dps.physicalDamageReduced}`}
          />
          <ProgressBar
            style={{ backgroundColor: "#209cee" }}
            max={props.maxDamageTaken}
            now={props.dps.specialDamageReduced}
            key="hp"
            title={`${t("special_damage_reduced")}: ${props.dps.specialDamageReduced}`}
          />
          <ProgressBar
            style={{ backgroundColor: "#8d8d8d" }}
            max={props.maxDamageTaken}
            now={props.dps.shieldDamageTaken}
            key="shield"
            title={`${t("shield_damage_taken")}: ${props.dps.shieldDamageTaken}`}
          />
        </ProgressBar>
      </div>
    </div>
  )
}
