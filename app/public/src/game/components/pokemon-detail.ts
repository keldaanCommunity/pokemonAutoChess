import { GameObjects } from "phaser"
import { AttackType } from "../../../../types/enum/Game"
import { Emotion } from "../../../../types"
import {
  AbilityName,
  AbilityDescription
} from "../../../../types/strings/Ability"
import { Ability } from "../../../../types/enum/Ability"
import { getPortraitSrc } from "../../utils"

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
    this.dom.style.color = "#fff"
    this.dom.style.padding = "10px"

    const wrap = document.createElement("div")
    wrap.style.display = "flex"

    const infos = document.createElement("div")
    infos.style.display = "flex"
    infos.style.flexFlow = "column"
    infos.style.minWidth = "200px"

    this.hp = document.createElement("p")
    this.hp.innerHTML = hp.toString()

    this.atk = document.createElement("p")
    this.atk.innerHTML = atk.toString()

    this.def = document.createElement("p")
    this.def.innerHTML = def.toString()

    this.speDef = document.createElement("p")
    this.speDef.innerHTML = speDef.toString()

    this.range = document.createElement("p")
    this.range.innerHTML = range.toString()

    this.atkSpeed = document.createElement("p")
    this.atkSpeed.innerHTML = atkSpeed.toString()

    this.critChance = document.createElement("p")
    this.critChance.innerHTML = critChance.toString()

    this.critDamage = document.createElement("p")
    this.critDamage.innerHTML = critDamage.toString()

    this.spellDamage = document.createElement("p")
    this.spellDamage.innerHTML = spellDamage.toString()

    this.mana = document.createElement("p")
    this.mana.innerHTML = mana.toString()

    const pokemonName = document.createElement("p")
    pokemonName.innerHTML = capitalizeFirstLetter(name)

    const avatar = document.createElement("img")
    avatar.src = getPortraitSrc(index, shiny, emotion)

    const profile = document.createElement("div")
    profile.style.display = "flex"
    profile.style.alignItems = "center"
    profile.style.justifyContent = "space-around"

    const t = document.createElement("div")
    t.style.display = "flex"
    types.forEach((type) => {
      const ty = document.createElement("img")
      ty.src = "assets/types/" + type + ".png"
      ty.style.width = "34px"
      ty.style.height = "34px"
      t.appendChild(ty)
    })

    const a = document.createElement("p")
    switch (attackType) {
      case AttackType.PHYSICAL:
        a.innerHTML = "Physical"
        a.className = "nes-text is-error"
        break
      case AttackType.SPECIAL:
        a.innerHTML = "Special"
        a.className = "nes-text is-primary"
        break
      case AttackType.TRUE:
        a.innerHTML = "True"
        a.className = "nes-text is-success"
        break
      default:
        break
    }

    const at = document.createElement("div")
    at.style.display = "flex"
    at.style.justifyContent = "space-around"
    at.style.marginBottom = "10px"
    at.style.marginTop = "10px"
    at.appendChild(t)
    at.appendChild(a)

    const f1 = document.createElement("div")
    f1.style.display = "flex"
    f1.style.justifyContent = "space-between"

    const af1 = document.createElement("div")
    af1.style.display = "flex"
    const hpImg = document.createElement("img")
    hpImg.style.width = "20px"
    hpImg.style.height = "20px"
    hpImg.src = "assets/icons/hp.png"
    af1.appendChild(hpImg)
    af1.appendChild(this.hp)

    const bf1 = document.createElement("div")
    bf1.style.display = "flex"
    bf1.appendChild(this.atk)
    const atkImg = document.createElement("img")
    atkImg.style.width = "20px"
    atkImg.style.height = "20px"
    atkImg.src = "assets/icons/atk.png"
    bf1.appendChild(atkImg)

    f1.appendChild(af1)
    f1.appendChild(bf1)

    const f2 = document.createElement("div")
    f2.style.display = "flex"
    f2.style.justifyContent = "space-between"

    const af2 = document.createElement("div")
    af2.style.display = "flex"
    const defImg = document.createElement("img")
    defImg.style.width = "20px"
    defImg.style.height = "20px"
    defImg.src = "assets/icons/def.png"
    af2.appendChild(defImg)
    af2.appendChild(this.def)

    const bf2 = document.createElement("div")
    bf2.style.display = "flex"
    bf2.appendChild(this.range)
    const rangeImg = document.createElement("img")
    rangeImg.style.width = "20px"
    rangeImg.style.height = "20px"
    rangeImg.src = "assets/icons/range.png"
    bf2.appendChild(rangeImg)

    f2.appendChild(af2)
    f2.appendChild(bf2)

    const f3 = document.createElement("div")
    f3.style.display = "flex"
    f3.style.justifyContent = "space-between"

    const af3 = document.createElement("div")
    af3.style.display = "flex"
    const speDefImg = document.createElement("img")
    speDefImg.style.width = "20px"
    speDefImg.style.height = "20px"
    speDefImg.src = "assets/icons/speDef.png"
    af3.appendChild(speDefImg)
    af3.appendChild(this.speDef)

    const bf3 = document.createElement("div")
    bf3.style.display = "flex"
    bf3.appendChild(this.atkSpeed)
    const atkSpeedImg = document.createElement("img")
    atkSpeedImg.style.width = "20px"
    atkSpeedImg.style.height = "20px"
    atkSpeedImg.src = "assets/icons/atkSpeed.png"
    bf3.appendChild(atkSpeedImg)

    f3.appendChild(af3)
    f3.appendChild(bf3)

    const f4 = document.createElement("div")
    f4.style.display = "flex"
    f4.style.justifyContent = "space-between"

    const af4 = document.createElement("div")
    af4.style.display = "flex"
    const manaImg = document.createElement("img")
    manaImg.style.width = "20px"
    manaImg.style.height = "20px"
    manaImg.src = "assets/icons/mana.png"
    af4.appendChild(manaImg)
    af4.appendChild(this.mana)

    const bf4 = document.createElement("div")
    bf4.style.display = "flex"
    bf4.appendChild(this.critChance)
    const critChangeImg = document.createElement("img")
    critChangeImg.style.width = "20px"
    critChangeImg.style.height = "20px"
    critChangeImg.src = "assets/icons/critChance.png"
    bf4.appendChild(critChangeImg)

    f4.appendChild(af4)
    f4.appendChild(bf4)

    const f5 = document.createElement("div")
    f5.style.display = "flex"
    f5.style.justifyContent = "space-between"

    const af5 = document.createElement("div")
    af5.style.display = "flex"
    const spellDamageImg = document.createElement("img")
    spellDamageImg.style.width = "20px"
    spellDamageImg.style.height = "20px"
    spellDamageImg.src = "assets/icons/spellDamage.png"
    af5.appendChild(spellDamageImg)
    af5.appendChild(this.spellDamage)

    const bf5 = document.createElement("div")
    bf5.style.display = "flex"
    bf5.appendChild(this.critDamage)
    const critDamageImg = document.createElement("img")
    critDamageImg.style.width = "20px"
    critDamageImg.style.height = "20px"
    critDamageImg.src = "assets/icons/critDamage.png"
    bf5.appendChild(critDamageImg)

    f5.appendChild(af5)
    f5.appendChild(bf5)

    f1.style.height = "25px"
    f2.style.height = "25px"
    f3.style.height = "25px"
    f4.style.height = "25px"
    f5.style.height = "25px"

    profile.appendChild(avatar)
    profile.appendChild(pokemonName)

    const ult = document.createElement("p")
    ult.innerHTML = AbilityName[skill].eng

    const description = document.createElement("p")
    description.innerHTML = AbilityDescription[skill].eng

    const ultDiv = document.createElement("div")
    ultDiv.style.display = "flex"
    ultDiv.style.flexFlow = "column"
    ultDiv.style.textAlign = "justify"
    ultDiv.style.maxWidth = "200px"
    ultDiv.style.marginLeft = "10px"

    ultDiv.appendChild(ult)
    ultDiv.appendChild(description)

    infos.appendChild(profile)
    infos.appendChild(at)
    infos.appendChild(f1)
    infos.appendChild(f2)
    infos.appendChild(f3)
    infos.appendChild(f4)
    infos.appendChild(f5)

    wrap.appendChild(infos)
    wrap.appendChild(ultDiv)
    this.dom.appendChild(wrap)
    this.setElement(this.dom)
  }

  updateValue(el: HTMLElement, previousValue: number, value: number) {
    el.innerHTML = value.toString()
  }
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
