import { GameObjects } from "phaser"
import { AttackType, Rarity } from "../../../../types/enum/Game"
import { Emotion } from "../../../../types"
import {
  AbilityName,
  AbilityDescription
} from "../../../../types/strings/Ability"
import { Ability } from "../../../../types/enum/Ability"
import { getPortraitSrc } from "../../utils"
import { AttackTypeColor, RarityColor } from "../../../../types/Config"
import { AttackTypeLabel } from "../../../../types/strings/AttackType"

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
  spellDamage: HTMLDivElement
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
    attackType: AttackType,
    range: number,
    atkSpeed: string,
    critChance: number,
    critDamage: number,
    spellDamage: number,
    mana: number,
    types: string[],
    skill: Ability,
    emotion: Emotion,
    shiny: boolean,
    index: string
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
    this.atkSpeed.textContent = atkSpeed.toString()

    this.critChance = document.createElement("p")
    this.critChance.textContent = critChance.toString() + "%"

    this.critDamage = document.createElement("p")
    this.critDamage.textContent = critDamage.toString()

    this.spellDamage = document.createElement("p")
    this.spellDamage.textContent = spellDamage.toString()

    this.mana = document.createElement("p")
    this.mana.innerHTML = mana.toString()

    const avatar = document.createElement("img")
    avatar.className = "game-pokemon-detail-portrait"
    avatar.src = getPortraitSrc(index, shiny, emotion)
    avatar.style.borderColor = RarityColor[rarity]
    wrap.appendChild(avatar)

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

    const attackTypeElm = document.createElement("p")
    attackTypeElm.textContent = AttackTypeLabel[attackType].eng
    attackTypeElm.style.color = AttackTypeColor[attackType]
    attackTypeElm.className = "game-pokemon-detail-entry-attack-type"
    entry.appendChild(attackTypeElm)

    const typesList = document.createElement("div")
    typesList.className = "game-pokemon-detail-types"
    types.forEach((type) => {
      const ty = document.createElement("img")
      ty.src = "assets/types/" + type + ".png"
      ty.alt = type
      ty.title = type
      ty.className = "synergy-icon"
      ty.style.width = "34px"
      ty.style.height = "34px"
      typesList.appendChild(ty)
    })
    wrap.appendChild(typesList)

    const stats = [
      { title: "Health points", img: "assets/icons/hp.png", value: this.hp },
      { title: "Defense", img: "assets/icons/def.png", value: this.def },
      { title: "Attack", img: "assets/icons/atk.png", value: this.atk },
      {
        title: "Attack Speed",
        img: "assets/icons/atkSpeed.png",
        value: this.atkSpeed
      },
      {
        title: "Critical Damage",
        img: "assets/icons/critDamage.png",
        value: this.critDamage
      },
      { title: "Mana", img: "assets/icons/mana.png", value: this.mana },
      {
        title: "Special Defense",
        img: "assets/icons/speDef.png",
        value: this.speDef
      },
      {
        title: "Spell Damage",
        img: "assets/icons/spellDamage.png",
        value: this.spellDamage
      },
      {
        title: "Attack Range",
        img: "assets/icons/range.png",
        value: this.range
      },
      {
        title: "Critical Chance",
        img: "assets/icons/critChance.png",
        value: this.critChance
      }
    ]

    const statsElm = document.createElement("div")
    statsElm.className = "game-pokemon-detail-stats"
    for (const stat of stats) {
      const statElm = document.createElement("div")
      const statImg = document.createElement("img")
      statImg.src = stat.img
      statImg.alt = stat.title
      statImg.title = stat.title
      statElm.appendChild(statImg)
      statElm.appendChild(stat.value)
      statsElm.appendChild(statElm)
    }
    wrap.appendChild(statsElm)

    const ult = document.createElement("div")
    ult.className = "game-pokemon-detail-ult"
    const ultName = document.createElement("p")
    ultName.textContent = AbilityName[skill].eng

    const description = document.createElement("p")
    description.textContent = AbilityDescription[skill].eng

    ult.appendChild(ultName)
    ult.appendChild(description)
    wrap.appendChild(ult)

    this.dom.appendChild(wrap)
    this.setElement(this.dom)
  }

  updateValue(el: HTMLElement, previousValue: number, value: number) {
    el.textContent = value.toString()
  }
}
