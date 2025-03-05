import React from "react"
import { useTranslation } from "react-i18next"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { PkmWithCustom } from "../../../../../types"
import { RarityColor } from "../../../../../types/Config"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import "./booster-card.css"
import { usePreferences } from "../../../preferences"

export function BoosterCard(props: { pkm: PkmWithCustom; shards: number }) {
  const [{ antialiasing }] = usePreferences()
  const { t } = useTranslation()
  const pkm = props.pkm.name
  const pokemonData = getPokemonData(pkm)
  const style = {
    "--rarity-color": RarityColor[pokemonData.rarity]
  } as React.CSSProperties
  return (
    <div
      className={cc(
        "booster-card",
        "rarity-" + pokemonData.rarity.toLowerCase(),
        { shiny: props.pkm.shiny || false }
      )}
      style={style}
      onClick={(e) => e.currentTarget.classList.add("flipped")}
    >
      <div className="back">
        <img src="/assets/ui/pokecard.png" />
      </div>
      <div className={cc("front", { shimmer: !!props.pkm.shiny })}>
        <img
          src={getPortraitSrc(
            PkmIndex[pkm],
            props.pkm.shiny,
            props.pkm.emotion
          )}
          className={cc({ pixelated: !antialiasing })}
        ></img>
        <div className="front-text">
          <p className="name">{t(`pkm.${pkm}`)}</p>
          <p>
            {props.shards} {t("shards")}
          </p>
        </div>
      </div>
    </div>
  )
}
