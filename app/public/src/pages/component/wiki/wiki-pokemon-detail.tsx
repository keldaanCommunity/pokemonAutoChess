import React, { useState } from "react"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { CDN_URL } from "../../../../../types"
import { ICreditName } from "../../../../../types"
import { ITracker } from "../../../../../types/ITracker"
import Credits from "./Credits"
import { RarityColor } from "../../../../../types/Config"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import SynergyIcon from "../icons/synergy-icon"
import { AbilityTooltip } from "../ability/ability-tooltip"
import { Rarity, Stat } from "../../../../../types/enum/Game"
import "./wiki-pokemon-detail.css"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import { Ability } from "../../../../../types/enum/Ability"
import { Passive } from "../../../../../types/enum/Passive"
import { addIconsToDescription } from "../../utils/descriptions"
import { useTranslation } from "react-i18next"

export default function WikiPokemonDetail(props: {
  pokemon: Pkm
  m: ITracker | undefined
}) {
  const { t } = useTranslation()
  const pokemon = PokemonFactory.createPokemonFromName(props.pokemon)
  const [credits, setCredits] = useState<ICreditName[]>()
  const [initialized, setInitialized] = useState<boolean>(false)
  if (!initialized) {
    setInitialized(true)
    fetch(`${CDN_URL}/credit_names.txt`)
      .then((res) => res.text())
      .then((text) => text.split("\n"))
      .then((lines: string[]) =>
        lines.slice(1).map((line) => {
          const [Name, Discord, Contact] = line.split("\t")
          const credit: ICreditName = { Name, Discord, Contact }
          return credit
        })
      )
      .then((credits: ICreditName[]) => setCredits(credits))
  }

  const evolution =
    pokemon.evolution === Pkm.DEFAULT
      ? null
      : PokemonFactory.createPokemonFromName(pokemon.evolution as Pkm)

  if (!props.m) return null

  const statProp: Record<Stat, string> = {
    [Stat.ATK]: "atk",
    [Stat.DEF]: "def",
    [Stat.HP]: "hp",
    [Stat.MAX_MANA]: "maxMana",
    [Stat.RANGE]: "range",
    [Stat.SPE_DEF]: "speDef",
    [Stat.CRIT_CHANCE]: "critChance",
    [Stat.CRIT_DAMAGE]: "critDamage",
    [Stat.ATK_SPEED]: "atkSpeed",
    [Stat.MANA]: "mana",
    [Stat.AP]: "ap",
    [Stat.SHIELD]: "shield"
  }

  return (
    <div className="wiki-pokemon-detail">
      <div className="game-pokemon-detail-tooltip">
        <GamePokemonDetail pokemon={pokemon}></GamePokemonDetail>
      </div>
      <dl>
        <dt>{t("name")}</dt>
        <dd className="pokemon-name">{t(`pkm.${pokemon.name}`)}</dd>
        <dt>{t("index")}</dt>
        <dd className="pokemon-index">{pokemon.index}</dd>
        <dt>{t("rarity_label")}</dt>
        <dd style={{ color: RarityColor[pokemon.rarity] }}>{pokemon.rarity}</dd>
        <dt>{t("synergies")}</dt>
        <dd>
          {pokemon.types.map((type) => (
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
        {credits && (
          <Credits
            credits={credits}
            primary={props.m.sprite_credit.primary}
            secondary={props.m.sprite_credit.secondary}
          />
        )}

        <dt>{t("sprite_credit")}</dt>
        {credits && (
          <Credits
            credits={credits}
            primary={props.m.portrait_credit.primary}
            secondary={props.m.portrait_credit.secondary}
          />
        )}
      </dl>
      <dl>
        {[Stat.HP, Stat.ATK, Stat.DEF, Stat.SPE_DEF, Stat.RANGE].map((stat) => (
          <React.Fragment key={stat}>
            <dt>
              <img src={`assets/icons/${stat}.png`} alt="" />{" "}
              {t(`stat.${stat}`)}
            </dt>
            <dd>{pokemon[statProp[stat]]}</dd>
          </React.Fragment>
        ))}
        <dt>
          <img src={`assets/icons/mana.png`} alt="" /> {t("stat.MAX_MANA")}
        </dt>
        <dd>{pokemon.maxMana}</dd>
      </dl>
      <dl>
        {pokemon.skill !== Ability.DEFAULT && (
          <>
            <dt>{t("ability_label")}</dt>
            <dd>
              {t(`ability.${pokemon.skill}`)}
              <AbilityTooltip
                ability={pokemon.skill}
                tier={pokemon.rarity === Rarity.MYTHICAL ? 3 : pokemon.stars}
              />
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
