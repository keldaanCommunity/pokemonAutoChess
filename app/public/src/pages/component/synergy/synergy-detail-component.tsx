import React from "react"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { PrecomputedTypePokemon } from "../../../../../types"
import { Synergy, SynergyEffects } from "../../../../../types/enum/Synergy"
import PRECOMPUTED_TYPE_POKEMONS from "../../../../../models/precomputed/type-pokemons.json"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { SynergyTriggers, RarityColor } from "../../../../../types/Config"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { EffectDescriptionComponent } from "./effect-description"
import { addIconsToDescription } from "../../utils/descriptions"
import { useTranslation } from "react-i18next"

const precomputed = PRECOMPUTED_TYPE_POKEMONS as PrecomputedTypePokemon

export default function SynergyDetailComponent(props: {
  type: Synergy
  value: number
}) {
  const { t } = useTranslation()
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  if (Object.hasOwn(SynergyTriggers, props.type) === false) return null
  const levelReached = SynergyTriggers[props.type]
    .filter((n) => n <= props.value)
    .at(-1)
  return (
    <div style={{ maxWidth: "480px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <SynergyIcon type={props.type} size="40px" />
        <h3 style={{ margin: 0 }}>{t(`synergy.${props.type}`)}</h3>
      </div>
      <p>{addIconsToDescription(t(`synergy_description.${props.type}`))}</p>

      {SynergyEffects[props.type].map((d, i) => {
        return (
          <div
            key={d}
            style={{
              color:
                levelReached === SynergyTriggers[props.type][i]
                  ? "#fff"
                  : "#e8e8e8",
              backgroundColor:
                levelReached === SynergyTriggers[props.type][i]
                  ? "#54596b"
                  : "rgba(84, 89, 107,0)",
              border:
                levelReached === SynergyTriggers[props.type][i]
                  ? "4px solid black"
                  : "none",
              borderRadius: "12px",
              padding: "5px"
            }}
          >
            <h5 style={{ fontSize: "1.3vw" }}>
              ({SynergyTriggers[props.type][i]}) {t(`effect.${d}`)}
            </h5>
            <EffectDescriptionComponent effect={d} />
          </div>
        )
      })}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {precomputed[props.type].pokemons.map((p) => {
          const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
          const s = { border: "3px solid " + RarityColor[pokemon.rarity] }
          return <img key={p} style={s} src={getPortraitSrc(pokemon.index)} />
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {precomputed[props.type].mythicalPokemons.map((p) => {
          const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
          const s = { border: "3px solid " + RarityColor[pokemon.rarity] }
          return <img key={p} style={s} src={getPortraitSrc(pokemon.index)} />
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {precomputed[props.type].additionalPokemons.map((p) => {
          if (additionalPokemons.includes(p)) {
            const pokemon = PokemonFactory.createPokemonFromName(p as Pkm)
            const s = { border: "3px solid " + RarityColor[pokemon.rarity] }
            return <img key={p} style={s} src={getPortraitSrc(pokemon.index)} />
          } else {
            return null
          }
        })}
      </div>
    </div>
  )
}
