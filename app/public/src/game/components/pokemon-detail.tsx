import { t } from "i18next"
import { GameObjects } from "phaser"
import ReactDOM from "react-dom/client"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import { Emotion } from "../../../../types"
import { RarityColor } from "../../../../types/Config"
import { Ability } from "../../../../types/enum/Ability"
import { Rarity, Stat } from "../../../../types/enum/Game"
import { Passive } from "../../../../types/enum/Passive"
import { Pkm, PkmIndex } from "../../../../types/enum/Pokemon"
import { Synergy } from "../../../../types/enum/Synergy"
import { AbilityTooltip } from "../../pages/component/ability/ability-tooltip"
import { addIconsToDescription } from "../../pages/utils/descriptions"
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
  critPower: HTMLDivElement
  ap: HTMLDivElement
  abilityDescription: HTMLDivElement | null = null
  passiveDescription: HTMLDivElement | null = null
  pp: HTMLDivElement
  abilityRoot: ReactDOM.Root | null = null
  passiveDescriptionRoot: ReactDOM.Root | null = null

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: Pkm,
    rarity: Rarity,
    hp: number,
    atk: number,
    def: number,
    speDef: number,
    range: number,
    atkSpeed: number,
    critChance: number,
    critPower: number,
    ap: number,
    pp: number,
    luck: number,
    types: Set<Synergy>,
    skill: Ability,
    passive: Passive,
    emotion: Emotion,
    shiny: boolean,
    index: string,
    stars: number,
    evolution: Pkm
  ) {
    super(scene, x, y)

    this.dom = document.createElement("div")
    this.dom.className = "my-container game-pokemon-detail-tooltip"
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

    this.critPower = document.createElement("p")
    this.critPower.textContent = critPower.toString()

    this.ap = document.createElement("p")
    this.ap.textContent = ap.toString()
    this.ap.classList.toggle("negative", ap < 0)

    this.pp = document.createElement("p")
    this.pp.innerHTML = pp.toString()

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
    pokemonName.textContent = t(`pkm.${name}`)
    pokemonName.className = "game-pokemon-detail-entry-name"
    entry.appendChild(pokemonName)

    const pokemonRarity = document.createElement("p")
    pokemonRarity.textContent = t(`rarity.${rarity}`)
    pokemonRarity.style.color = RarityColor[rarity]
    pokemonRarity.className = "game-pokemon-detail-entry-rarity"
    entry.appendChild(pokemonRarity)

    const pokemonStars = document.createElement("p")
    pokemonStars.className = "game-pokemon-detail-entry-tier"
    for (let i = 0; i < stars; i++) {
      const img = document.createElement("img")
      img.src = "assets/ui/star.svg"
      img.setAttribute("height", "16")
      pokemonStars.appendChild(img)
    }
    for (let i = stars; i < getPokemonData(name).stages; i++) {
      const img = document.createElement("img")
      img.src = "assets/ui/star_empty.svg"
      img.setAttribute("height", "16")
      pokemonStars.appendChild(img)
    }
    entry.appendChild(pokemonStars)

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
      { stat: Stat.CRIT_POWER, elm: this.critPower },
      { stat: Stat.PP, elm: this.pp },
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
      statImg.title = t(`stat.${stat}`)
      statElm.appendChild(statImg)
      statElm.appendChild(elm)
      statsElm.appendChild(statElm)
    }
    wrap.appendChild(statsElm)

    if (passive != Passive.NONE) {
      this.passiveDescription = document.createElement("div")
      this.passiveDescription.className = "game-pokemon-detail-passive"
      this.passiveDescriptionRoot = ReactDOM.createRoot(this.passiveDescription)
      this.updatePassiveDescription({ passive, stars, ap, luck })
      wrap.appendChild(this.passiveDescription)
    }

    if (skill !== Ability.DEFAULT) {
      const abilityDiv = document.createElement("div")
      abilityDiv.className = "game-pokemon-detail-ult"
      this.abilityRoot = ReactDOM.createRoot(abilityDiv)
      this.updateAbilityDescription({ skill, stars, ap, luck })
      wrap.appendChild(abilityDiv)
    }

    this.dom.appendChild(wrap)
    this.setElement(this.dom)
  }

  updateValue(el: HTMLElement, previousValue: number, value: number) {
    el.textContent = value.toString()
    el.classList.toggle("negative", value < 0)
  }

  updateAbilityDescription({ skill, stars, ap, luck }: { skill: Ability, stars: number, ap: number, luck: number }) {
    this.abilityRoot?.render(
      <>
        <div className="ability-name">{t(`ability.${skill}`)}</div>
        <AbilityTooltip ability={skill} stats={{ stars, ap, luck }} />
      </>
    )
  }

  updatePassiveDescription({ passive, stars, ap, luck }: { passive: Passive, stars: number, ap: number, luck: number }) {
    this.passiveDescriptionRoot?.render(
      <p>
        {addIconsToDescription(
          t(`passive_description.${passive}`), { stars, ap, luck })}
      </p>
    )
  }
}
