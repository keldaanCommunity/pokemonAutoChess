import React from "react"
import { useTranslation } from "react-i18next"
import { getPokemonData } from "../../../../../models/precomputed"
import { RarityColor } from "../../../../../types/Config"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import "./booster-card.css"

export function BoosterCard(props: { pkm: string; shards: number }) {
  const { t } = useTranslation()
  const pkm: Pkm = (Object.keys(PkmIndex).find(
    (p) => PkmIndex[p] === props.pkm
  ) ?? Pkm.DITTO) as Pkm
  const pokemonData = getPokemonData(pkm)
  const style = {
    "--rarity-color": RarityColor[pokemonData.rarity]
  } as React.CSSProperties
  return (
    <div
      className={cc(
        "booster-card",
        "rarity-" + pokemonData.rarity.toLowerCase()
      )}
      style={style}
      onClick={(e) => e.currentTarget.classList.add("flipped")}
    >
      <div className="back">
        <img src="/assets/ui/pokecard.png" />
      </div>
      <div className="front">
        <img src={getPortraitSrc(props.pkm)}></img>
        <p className="name">{t(`pkm.${pkm}`)}</p>
        <p>
          {props.shards} {t("shards")}
        </p>
      </div>
    </div>
  )
}
