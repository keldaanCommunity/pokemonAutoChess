import { useTranslation } from "react-i18next"
import type { IDps } from "../../../../../types"
import {
  type EnvironmentalEffect,
  EnvironmentalEffects
} from "../../../../../types/enum/Effect"
import { isIn } from "../../../../../utils/array"
import PokemonPortrait from "../pokemon-portrait"
import ProgressBar from "../progress-bar/progress-bar"

export default function GameDpsHeal(props: {
  maxHeal: number
  dpsMeter: IDps
}) {
  const { t } = useTranslation()
  return (
    <div className="game-dps-bar">
      {isIn(EnvironmentalEffects, props.dpsMeter.id) ? (
        <img
          src={`assets/icons/effects/${props.dpsMeter.id as EnvironmentalEffect}.svg`}
          className="pokemon-portrait"
          title={t(`effect.${props.dpsMeter.id as EnvironmentalEffect}`)}
          alt={t(`effect.${props.dpsMeter.id as EnvironmentalEffect}`)}
        />
      ) : (
        <PokemonPortrait avatar={props.dpsMeter.name} />
      )}
      <div className="game-dps-progress-wrapper">
        <p>{props.dpsMeter.heal + props.dpsMeter.shield}</p>
        <ProgressBar className="my-progress is-primary">
          <ProgressBar
            className="colorblind-pattern-vertical-stripes"
            style={{ backgroundColor: "#76c442" }}
            max={props.maxHeal}
            now={props.dpsMeter.heal}
            key="heal"
            title={`${t("game_stats.hp_healed")}: ${props.dpsMeter.heal}`}
          />
          <ProgressBar
            className="colorblind-pattern-diagonal-stripes"
            style={{ backgroundColor: "#8d8d8d" }}
            max={props.maxHeal}
            now={props.dpsMeter.shield}
            key="shield"
            title={`${t("game_stats.shield_given")}: ${props.dpsMeter.shield}`}
          />
        </ProgressBar>
      </div>
    </div>
  )
}
