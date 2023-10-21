import React from "react"
import PokemonFactory from "../../../../../models/pokemon-factory"
import Credits from "./Credits"
import { RarityColor } from "../../../../../types/Config"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { AbilityTooltip } from "../ability/ability-tooltip"
import { Stat } from "../../../../../types/enum/Game"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { addIconsToDescription } from "../../utils/descriptions"
import { useTranslation } from "react-i18next"
import "./wiki-pokemon-detail.css"

export default function WikiPokemonDetail(props: {
  pokemon: Pkm
}) {
  const { t } = useTranslation()
  const pokemon = PokemonFactory.createPokemonFromName(props.pokemon)

  const evolution =
    pokemon.evolution === Pkm.DEFAULT
      ? null
      : PokemonFactory.createPokemonFromName(pokemon.evolution as Pkm)

  const statProp: Record<Stat, string> = {
    [Stat.ATK]: "atk",
    [Stat.DEF]: "def",
    [Stat.HP]: "hp",
    [Stat.MAX_PP]: "maxPP",
    [Stat.RANGE]: "range",
    [Stat.SPE_DEF]: "speDef",
    [Stat.CRIT_CHANCE]: "critChance",
    [Stat.CRIT_DAMAGE]: "critDamage",
    [Stat.ATK_SPEED]: "atkSpeed",
    [Stat.PP]: "maxPP",
    [Stat.AP]: "ap",
    [Stat.SHIELD]: "shield"
  }

  return (
    <div className="wiki-pokemon-detail">
      <div className="game-pokemon-detail-tooltip">
        <GamePokemonDetail pokemon={pokemon} />
      </div>
      <dl>
        <dt>{t("name")}</dt>
        <dd className="pokemon-name">{t(`pkm.${pokemon.name}`)}</dd>
        <dt>{t("index")}</dt>
        <dd className="pokemon-index">{pokemon.index}</dd>
        <dt>{t("rarity_label")}</dt>
        <dd style={{ color: RarityColor[pokemon.rarity] }}>
          {t(`rarity.${pokemon.rarity}`)}
        </dd>
        <dt style={{ verticalAlign: "middle" }}>{t("tier")}</dt>
        <dd>
          {Array.from({ length: pokemon.stars }, (_, i) => (
            <img src="assets/ui/star.svg" height="24" key={"star" + i}></img>
          ))}
        </dd>
        <dt>{t("synergies")}</dt>
        <dd>
          {Array.from(pokemon.types.values()).map((type) => (
            <SynergyIcon key={"img" + type} type={type} />
          ))}
        </dd>
        <dt>{t("evolution")}</dt>
        <dd>
          {!evolution ? (
            "No evolution"
          ) : (
            <>
              <img
                src={getPortraitSrc(evolution.index)}
                style={{ marginRight: "0.5em" }}
              />
              <span className="pokemon-name">{t(`pkm.${evolution.name}`)}</span>
            </>
          )}
        </dd>

        <dt>{t("portrait_credit")}</dt>
        <Credits for="portrait" index={pokemon.index} />
        
        <dt>{t("sprite_credit")}</dt>
        <Credits for="sprite"  index={pokemon.index} />
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
        {pokemon.skill !== Ability.DEFAULT && (
          <>
            <dt>{t("ability_label")}</dt>
            <dd>
              {t(`ability.${pokemon.skill}`)}
              <AbilityTooltip ability={pokemon.skill} tier={pokemon.stars} />
            </dd>
          </>
        )}
        {pokemon.passive !== Passive.NONE && (
          <>
            <dt>{t("passive_label")}</dt>
            <dd>
              <br />
              {addIconsToDescription(
                t(`passive_description.${pokemon.passive}`)
              )}
            </dd>
          </>
        )}
      </dl>
    </div>
  )
}
