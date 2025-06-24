import React from "react"
import { useTranslation } from "react-i18next"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { DUST_PER_BOOSTER, DUST_PER_SHINY, RarityColor } from "../../../../../types/Config"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import { useAppSelector } from "../../../hooks"
import { hasUnlocked } from "../../../../../core/collection"
import { BoosterCard } from "../../../../../types/Booster"
import PokemonPortrait from "../pokemon-portrait"
import "./booster-card.css"

interface BoosterCardProps {
  card: BoosterCard
  flipped: boolean
  onFlip: () => void
}

export function BoosterCard({ card, flipped, onFlip }: BoosterCardProps) {
  const { t } = useTranslation()
  const pokemonData = getPokemonData(card.name)
  const style = {
    "--rarity-color": RarityColor[pokemonData.rarity]
  } as React.CSSProperties

  const pokemonCollection = useAppSelector(
    (state) => state.network.profile?.pokemonCollection
  )
  const hasUnlockedCard = pokemonCollection != null && hasUnlocked(pokemonCollection, card)

  return (
    <div
      className={cc(
        "booster-card",
        "rarity-" + pokemonData.rarity.toLowerCase(),
        { shiny: card.shiny || false, flipped }
      )}
      style={style}
      onClick={onFlip}
    >
      <div className="back">
        <img src="/assets/ui/pokecard.png" />
      </div>
      <div className={cc("front", { shimmer: card.shiny })}>
        <PokemonPortrait portrait={{ index: PkmIndex[card.name], shiny: card.shiny, emotion: card.emotion }} />
        <div className="front-text">
          <p className="name">{t(`pkm.${card.name}`)}
            <br /> <span style={{ fontWeight: 'normal' }}>{t(`emotion.${card.emotion}`)}</span>
          </p>
          {card.new
            ? <p className={cc({ new: hasUnlockedCard })}>{t("new")}</p>
            : <p className="dust">
              +{card.shiny ? DUST_PER_SHINY : DUST_PER_BOOSTER} {t("shards")}{" "}
              <img
                src={getPortraitSrc(PkmIndex[card.name])}
                className="dust"
                alt="dust"
              />
            </p>
          }
        </div>
      </div>
    </div >
  )
}
