import { Langage } from ".."
import { AttackType } from "../enum/Game"

export const AttackTypeLabel: { [key in AttackType]: Langage } = {
  [AttackType.PHYSICAL]: {
    eng: "Physical",
    esp: "Físico",
    fra: "Physique",
    prt: "Físico"
  },

  [AttackType.SPECIAL]: {
    eng: "Special",
    esp: "Especial",
    fra: "Spécial",
    prt: "Especial"
  },

  [AttackType.TRUE]: {
    eng: "True",
    esp: "Bruto",
    fra: "Brut",
    prt: "Bruto"
  }
}
