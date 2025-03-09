import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { RarityColor } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { addIconsToDescription } from "../../utils/descriptions"
import { AbilityTooltip } from "../ability/ability-tooltip"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import Credits from "./Credits"
import "./wiki-pokemon-detail.css"

export default function WikiPokemonDetail(props: { pokemon: Pkm, selectPkm: (pkm: Pkm) => void }) {
  const { t } = useTranslation()
  const pokemon = useMemo(
    () => PokemonFactory.createPokemonFromName(props.pokemon),
    [props.pokemon]
  )
  const pokemonData = useMemo(
    () => getPokemonData(props.pokemon),
    [props.pokemon]
  )
  const evolutions = pokemonData.evolution ? [pokemonData.evolution] : pokemonData.evolutions
  const statProp: Record<Stat, string> = {
    [Stat.ATK]: "atk",
    [Stat.DEF]: "def",
    [Stat.HP]: "hp",
    [Stat.MAX_PP]: "maxPP",
    [Stat.RANGE]: "range",
    [Stat.SPE_DEF]: "speDef",
    [Stat.CRIT_CHANCE]: "critChance",
    [Stat.CRIT_POWER]: "critPower",
    [Stat.SPEED]: "speed",
    [Stat.PP]: "maxPP",
    [Stat.AP]: "ap",
    [Stat.SHIELD]: "shield",
    [Stat.LUCK]: "luck",
  }

  return (
    <div className="wiki-pokemon-detail">
      <div className="game-pokemon-detail-tooltip my-box">
        <GamePokemonDetail pokemon={pokemon} />
      </div>
      <dl>
        <dt>{t("name")}</dt>
        <dd className="pokemon-name">{t(`pkm.${props.pokemon}`)}</dd>
        <dt>{t("index")}</dt>
        <dd className="pokemon-index">{pokemonData.index}</dd>
        <dt>{t("rarity_label")}</dt>
        <dd style={{ color: RarityColor[pokemonData.rarity] }}>
          {t(`rarity.${pokemonData.rarity}`)}
        </dd>
        <dt>{t("pool_label")}</dt>
        <dd>{t(`pool.${pokemonData.regional ? 'regional' : pokemonData.additional ? 'additional' : 'regular'}`)}</dd>
        <dt style={{ verticalAlign: "middle" }}>{t("tier")}</dt>
        <dd>
          {Array.from({ length: pokemonData.stars }, (_, i) => (
            <img src="assets/ui/star.svg" height="24" key={"star" + i}></img>
          ))}
        </dd>
        <dt>{t("synergies")}</dt>
        <dd>
          {pokemonData.types.map((type) => (
            <SynergyIcon key={"img" + type} type={type} />
          ))}
        </dd>
        <dt>{t("evolution")}</dt>
        <dd>
          {evolutions.length === 0 ? (
            "No evolution"
          ) : (evolutions.map((evolution) => (
            <div key={evolution} onClick={() => props.selectPkm(evolution)} style={{ cursor: "pointer" }}>
              <img
                src={getPortraitSrc(PkmIndex[evolution])}
                style={{ marginRight: "0.5em" }}
              />
              <span className="pokemon-name">
                {t(`pkm.${evolution}`)}
              </span>
            </div>))
          )}
        </dd>

        <dt>{t("portrait_credit")}</dt>
        <Credits for="portrait" index={pokemonData.index} />

        <dt>{t("sprite_credit")}</dt>
        <Credits for="sprite" index={pokemonData.index} />
      </dl>
      <dl>
        {[Stat.HP, Stat.PP, Stat.RANGE, Stat.ATK, Stat.DEF, Stat.SPE_DEF].map(
          (stat) => (
            <React.Fragment key={stat}>
              <dt>
                <img src={`assets/icons/${stat}.png`} alt="" />{" "}
                {t(`stat.${stat}`)}
              </dt>
              <dd>{pokemon[statProp[stat]]}</dd>
            </React.Fragment>
          )
        )}
      </dl>
      <dl>
        {pokemonData.skill !== Ability.DEFAULT && (
          <>
            <dt>{t("ability_label")}</dt>
            <dd>
              {t(`ability.${pokemon.skill}`)}
              <AbilityTooltip
                ability={pokemonData.skill}
                stats={{ ap: 0, luck: 0, stars: pokemonData.stars, stages: 3 }}
              />
            </dd>
          </>
        )}
        {pokemonData.passive !== Passive.NONE && (
          <>
            <dt>{t("passive")}</dt>
            <dd>
              <p>
                {addIconsToDescription(
                  t(`passive_description.${pokemonData.passive}`)
                )}
              </p>
            </dd>
          </>
        )}
      </dl>
    </div>
  )
}
