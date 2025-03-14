import React from "react"
import { useTranslation } from "react-i18next"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PkmWithCustom } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import { usePreferences } from "../../../preferences"
import "./booster-card.css"

interface BoosterCardProps {
  pkm: PkmWithCustom
  shards: number
  flipped: boolean
  onFlip: () => void
}

export function BoosterCard({ pkm, shards, flipped, onFlip }: BoosterCardProps) {
  const [{ antialiasing }] = usePreferences()
  const { t } = useTranslation()
  const pokemonData = getPokemonData(pkm.name)
  const style = {
    "--rarity-color": RarityColor[pokemonData.rarity]
  } as React.CSSProperties

  return (
    <div
      className={cc(
        "booster-card",
        "rarity-" + pokemonData.rarity.toLowerCase(),
        { shiny: pkm.shiny || false, flipped }
      )}
      style={style}
      onClick={onFlip}
    >
      <div className="back">
        <img src="/assets/ui/pokecard.png" />
      </div>
      <div className={cc("front", { shimmer: !!pkm.shiny })}>
        <img
          src={getPortraitSrc(
            PkmIndex[pkm.name],
            pkm.shiny,
            pkm.emotion
          )}
          className={cc({ pixelated: !antialiasing })}
        ></img>
        <div className="front-text">
          <p className="name">{t(`pkm.${pkm.name}`)}</p>
          <p>
            {shards} {t("shards")}
          </p>
        </div>
      </div>
    </div>
  )
}
