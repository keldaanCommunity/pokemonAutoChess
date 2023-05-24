import { Langage } from ".."
import { Stat } from "../enum/Game"

export const StatLabel: { [key in Stat]: Langage } = {
  [Stat.ATK]: {
    eng: "Attack",
    esp: "Ataque",
    fra: "Attaque",
    prt: "Ataque"
  },
  [Stat.ATK_SPEED]: {
    eng: "Attack Speed",
    esp: "Velocidad de Ataque",
    fra: "Vitesse d'Attaque",
    prt: "Velocidade de Ataque"
  },
  [Stat.CRIT_CHANCE]: {
    eng: "Crit Chance",
    esp: "Probabilidad de Crít",
    fra: "Chances de Crit",
    prt: "Chance Crít"
  },
  [Stat.CRIT_DAMAGE]: {
    eng: "Crit Damage",
    esp: "Daño de Crít",
    fra: "Dégâts de Crit",
    prt: "Dano Crit"
  },
  [Stat.DEF]: {
    eng: "Defense",
    esp: "Defensa",
    fra: "Défense",
    prt: "Defesa"
  },
  [Stat.SPE_DEF]: {
    eng: "Special Defense",
    esp: "Defensa Especial",
    fra: "Défense Spéciale",
    prt: "Defesa Especial"
  },
  [Stat.HP]: {
    eng: "Health Points",
    esp: "Puntos de Vida",
    fra: "Points de Vie",
    prt: "Pontos de Vida"
  },
  [Stat.RANGE]: {
    eng: "Attack Range",
    esp: "Rango de Ataque",
    fra: "Portée d'Attaque",
    prt: "Raio de Ataque"
  },
  [Stat.MANA]: {
    eng: "Mana",
    esp: "Maná",
    fra: "Mana",
    prt: "Mana"
  },
  [Stat.MAX_MANA]: {
    eng: "Max Mana",
    esp: "Max Maná",
    fra: "Mana Max",
    prt: "Max Mana"
  },
  [Stat.AP]: {
    eng: "Ability Power",
    esp: "Poder",
    fra: "Puissance",
    prt: "Poder"
  },
  [Stat.SHIELD]: {
    eng: "Shield",
    esp: "Escudo",
    fra: "Bouclier",
    prt: "Escudo"
  }
}
