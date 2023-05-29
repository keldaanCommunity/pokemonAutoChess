import { GameObjects } from "phaser"
import { Rarity, Stat } from "../../../../types/enum/Game"
import { Emotion } from "../../../../types"
import { AbilityName } from "../../../../types/strings/Ability"
import { Ability } from "../../../../types/enum/Ability"
import { getPortraitSrc } from "../../utils"
import { RarityColor } from "../../../../types/Config"
import { StatLabel } from "../../../../types/strings/Stat"
import React from "react"
import ReactDOM from "react-dom"
import { AbilityTooltip } from "../../pages/component/ability/ability-tooltip"
import { CustomPokemonDescription } from "../../../../types/strings/Pokemon"
import { Pkm, PkmIndex } from "../../../../types/enum/Pokemon"
import { Passive } from "../../../../types/enum/Passive"
import { addIconsToDescription } from "../../pages/utils/descriptions"
import { PassiveDescription } from "../../../../types/strings/Passive"

export default class PokemonDetail extends GameObjects.DOMElement {
  dom: HTMLDivElement
  hp: HTMLDivElement
  atk: HTMLDivElement
  def: HTMLDivElement
  speDef: HTMLDivElement
  range: HTMLDivElement
  atkSpeed: HTMLDivElement
  critChance: HTMLDivElement
  critDamage: HTMLDivElement
  ap: HTMLDivElement
  abilityDescription: HTMLDivElement
  passiveDescription: HTMLDivElement
  mana: HTMLDivElement

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    rarity: Rarity,
    hp: number,
    atk: number,
    def: number,
    speDef: number,
    range: number,
    atkSpeed: number,
    critChance: number,
    critDamage: number,
    ap: number,
    mana: number,
    types: string[],
    skill: Ability,
    passive: Passive,
    emotion: Emotion,
    shiny: boolean,
    index: string,
    abilityTier: number,
    evolution: Pkm
  ) {
    super(scene, x, y)

    this.dom = document.createElement("div")
    this.dom.className = "nes-container"
    const wrap = document.createElement("div")
    wrap.className = "game-pokemon-detail"

    this.hp = document.createElement("p")
    this.hp.textContent = hp.toString()

    this.atk = document.createElement("p")
    this.atk.textContent = atk.toString()

    this.def = document.createElement("p")
    this.def.textContent = def.toString()

    this.speDef = document.createElement("p")
    this.speDef.textContent = speDef.toString()

    this.range = document.createElement("p")
    this.range.textContent = range.toString()

    this.atkSpeed = document.createElement("p")
    this.atkSpeed.textContent = atkSpeed.toFixed(2)

    this.critChance = document.createElement("p")
    this.critChance.textContent = critChance.toString() + "%"

    this.critDamage = document.createElement("p")
    this.critDamage.textContent = critDamage.toString()

    this.ap = document.createElement("p")
    this.ap.textContent = ap.toString()

    this.mana = document.createElement("p")
    this.mana.innerHTML = mana.toString()

    const avatar = document.createElement("img")
    avatar.className = "game-pokemon-detail-portrait"
    avatar.src = getPortraitSrc(index, shiny, emotion)
    avatar.style.borderColor = RarityColor[rarity]
    wrap.appendChild(avatar)

    if (index === PkmIndex[Pkm.EGG]) {
      const eggHint = document.createElement("img")
      eggHint.className = "game-pokemon-detail-portrait-hint"
      eggHint.src = getPortraitSrc(PkmIndex[evolution])
      wrap.appendChild(eggHint)
    }

    const entry = document.createElement("div")
    entry.className = "game-pokemon-detail-entry"
    wrap.appendChild(entry)

    const pokemonName = document.createElement("p")
    pokemonName.textContent = name
    pokemonName.className = "game-pokemon-detail-entry-name"
    entry.appendChild(pokemonName)

    const pokemonRarity = document.createElement("p")
    pokemonRarity.textContent = rarity
    pokemonRarity.style.color = RarityColor[rarity]
    pokemonRarity.className = "game-pokemon-detail-entry-rarity"
    entry.appendChild(pokemonRarity)

    const typesList = document.createElement("div")
    typesList.className = "game-pokemon-detail-types"
    types.forEach((type) => {
      const ty = document.createElement("img")
      ty.src = "assets/types/" + type + ".svg"
      ty.alt = type
      ty.title = type
      ty.className = "synergy-icon"
      ty.style.width = "34px"
      ty.style.height = "34px"
      typesList.appendChild(ty)
    })
    wrap.appendChild(typesList)

    const stats = [
      { stat: Stat.HP, elm: this.hp },
      { stat: Stat.DEF, elm: this.def },
      { stat: Stat.ATK, elm: this.atk },
      { stat: Stat.ATK_SPEED, elm: this.atkSpeed },
      { stat: Stat.CRIT_DAMAGE, elm: this.critDamage },
      { stat: Stat.MANA, elm: this.mana },
      { stat: Stat.SPE_DEF, elm: this.speDef },
      { stat: Stat.AP, elm: this.ap },
      { stat: Stat.RANGE, elm: this.range },
      { stat: Stat.CRIT_CHANCE, elm: this.critChance }
    ]

    const statsElm = document.createElement("div")
    statsElm.className = "game-pokemon-detail-stats"
    for (const { stat, elm } of stats) {
      const statElm = document.createElement("div")
      const statImg = document.createElement("img")
      statImg.src = `assets/icons/${stat}.png`
      statImg.alt = stat
      statImg.title = StatLabel[stat]["eng"]
      statElm.appendChild(statImg)
      statElm.appendChild(elm)
      statsElm.appendChild(statElm)
    }
    wrap.appendChild(statsElm)

    if(passive != Passive.NONE) {
      this.passiveDescription = document.createElement("div")
      this.passiveDescription.className = "game-pokemon-detail-passive"
      this.updatePassiveDescription(passive, abilityTier, ap)
      wrap.appendChild(this.passiveDescription)
    }

    if (skill !== Ability.DEFAULT) {
      const ult = document.createElement("div")
      ult.className = "game-pokemon-detail-ult"

      const ultNameWrap = document.createElement("div")
      ultNameWrap.className = "ability-name"
      const ultName = document.createElement("p")
      ultName.textContent = AbilityName[skill]["eng"]

      this.abilityDescription = document.createElement("div")
      this.updateAbilityDescription(skill, abilityTier, ap)
      ultNameWrap.appendChild(ultName)
      ult.appendChild(ultNameWrap)
      ult.appendChild(this.abilityDescription)
      wrap.appendChild(ult)
    }

    if (name in CustomPokemonDescription) {
      const ult = document.createElement("div")
      ult.className = "game-pokemon-detail-ult"
      const descriptionWrap = document.createElement("div")
      descriptionWrap.className = "custom-description"
      const description = document.createElement("p")
      description.textContent = CustomPokemonDescription[name]["eng"]
      descriptionWrap.appendChild(description)
      ult.appendChild(descriptionWrap)
      wrap.appendChild(ult)
    }

    this.dom.appendChild(wrap)
    this.setElement(this.dom)
  }

  updateValue(el: HTMLElement, previousValue: number, value: number) {
    el.textContent = value.toString()
  }

  updateAbilityDescription(skill: Ability, abilityTier: number, ap: number) {
    ReactDOM.render(
      <AbilityTooltip ability={skill} tier={abilityTier} ap={ap} />,
      this.abilityDescription
    )
  }

  updatePassiveDescription(passive: Passive, abilityTier: number, ap: number) {
    ReactDOM.render(
      <p>Passive: {addIconsToDescription(PassiveDescription[passive], abilityTier, ap)}</p>,
      this.passiveDescription
    )
  }
}
