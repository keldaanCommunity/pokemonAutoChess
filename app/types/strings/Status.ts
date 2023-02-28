import { Langage } from ".."
import { Damage, Stat } from "../enum/Game"
import { Status } from "../enum/Status"

export const StatusLabel: { [key in Status]: Langage } = {
  [Status.BURN]: {
    eng: "Burn",
    esp: "",
    fra: "Brûlure",
    prt: ""
  },
  [Status.SILENCE]: {
    eng: "Silence",
    esp: "",
    fra: "Silence",
    prt: ""
  },
  [Status.POISON]: {
    eng: "Poison",
    esp: "",
    fra: "Poison",
    prt: ""
  },
  [Status.FREEZE]: {
    eng: "Freeze",
    esp: "",
    fra: "Gelé",
    prt: ""
  },
  [Status.PROTECT]: {
    eng: "Protect",
    esp: "",
    fra: "Protection",
    prt: ""
  },
  [Status.SLEEP]: {
    eng: "Asleep",
    esp: "",
    fra: "Sommeil",
    prt: ""
  },
  [Status.CONFUSION]: {
    eng: "Confused",
    esp: "",
    fra: "Confus",
    prt: ""
  },
  [Status.WOUND]: {
    eng: "Wound",
    esp: "",
    fra: "Blessure",
    prt: ""
  },
  [Status.RESURECTION]: {
    eng: "Resurection",
    esp: "",
    fra: "Résurrection",
    prt: ""
  },
  [Status.SMOKE]: {
    eng: "Smoke",
    esp: "",
    fra: "Enfumé",
    prt: ""
  },
  [Status.ARMOR_REDUCTION]: {
    eng: "Armor Reduction",
    esp: "",
    fra: "Armure Brisée",
    prt: ""
  },
  [Status.RUNE_PROTECT]: {
    eng: "Rune Protect",
    esp: "",
    fra: "Protection Runique",
    prt: ""
  },
  [Status.ELECTRIC_FIELD]: {
    eng: "Electric Field",
    esp: "",
    fra: "Champ Electrique",
    prt: ""
  },
  [Status.PSYCHIC_FIELD]: {
    eng: "Psychic Field",
    esp: "",
    fra: "Champ Psychique",
    prt: ""
  },
  [Status.GRASS_FIELD]: {
    eng: "Grass Field",
    esp: "",
    prt: "",
    fra: ""
  },
  [Status.FAIRY_FIELD]: {
    eng: "Fairy Field",
    esp: "",
    prt: "",
    fra: ""
  }
}

export const StatusDescription: { [key in Status]: Langage } = {
  [Status.BURN]: {
    eng: `Deals 5% of max HP as ${Damage.TRUE} every second`,
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.SILENCE]: {
    eng: "Prevents casting abilities and gaining mana",
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.POISON]: {
    eng: `Deals 13% of max HP as ${Damage.TRUE} every second`,
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.FREEZE]: {
    eng: "Prevents moving or attacking",
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.PROTECT]: {
    eng: "Protects from any source of damage, but prevents mana gain",
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.SLEEP]: {
    eng: "Prevents moving or attacking. Receiving attacks reduces the duration of the effect.",
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.CONFUSION]: {
    eng: "Prevents attacking",
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.WOUND]: {
    eng: "Prevents healing from any source",
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.RESURECTION]: {
    eng: `Prevent death once, restoring to max ${Stat.HP}`,
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.SMOKE]: {
    eng: `Reduce ${Stat.ATK_SPEED} by 40%`,
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.ARMOR_REDUCTION]: {
    eng: `Reduce ${Stat.DEF} & ${Stat.SPE_DEF} by 50%`,
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.RUNE_PROTECT]: {
    eng: `Protects from any source of ${Damage.SPECIAL}.`,
    esp: "",
    fra: "",
    prt: ""
  },
  [Status.ELECTRIC_FIELD]: {
    eng: "Increase damage dealt by 30% (Electric only)",
    esp: "",
    fra: "Champ Electrique",
    prt: ""
  },
  [Status.PSYCHIC_FIELD]: {
    eng: "Increase damage dealt by 30% (Psychic only)",
    esp: "",
    fra: "Champ Psychique",
    prt: ""
  },
  [Status.GRASS_FIELD]: {
    eng: "Increase damage dealt by 30% (Grass only)",
    esp: "",
    prt: "",
    fra: ""
  },
  [Status.FAIRY_FIELD]: {
    eng: "Increase damage dealt by 30% (Fairy only)",
    esp: "",
    prt: "",
    fra: ""
  }
}
