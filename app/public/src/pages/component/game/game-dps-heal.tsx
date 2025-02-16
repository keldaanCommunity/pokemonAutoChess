import React from "react"
import { useTranslation } from "react-i18next"
import { IDps } from "../../../../../types"
import ProgressBar from "../progress-bar/progress-bar"
import PokemonPortrait from "../pokemon-portrait"

export default function GameDpsHeal(props: {
  maxHeal: number
  dpsMeter: IDps
}) {
  const { t } = useTranslation()
  return (
    <div className="game-dps-bar">
      <PokemonPortrait avatar={props.dpsMeter.name} />
      <div className="game-dps-progress-wrapper">
        <p>{props.dpsMeter.heal + props.dpsMeter.shield}</p>
        <ProgressBar className="my-progress is-primary">
          <ProgressBar
            style={{ backgroundColor: "#76c442" }}
            max={props.maxHeal}
            now={props.dpsMeter.heal}
            key="heal"
            title={`${t("hp_healed")}: ${props.dpsMeter.heal}`}
          />
          <ProgressBar
            style={{ backgroundColor: "#8d8d8d" }}
            max={props.maxHeal}
            now={props.dpsMeter.shield}
            key="shield"
            title={`${t("shield_given")}: ${props.dpsMeter.shield}`}
          />
        </ProgressBar>
      </div>
    </div>
  )
}
