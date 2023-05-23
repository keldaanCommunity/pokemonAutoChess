import { Effect } from "../enum/Effect"
import { Damage, Stat } from "../enum/Game";
import { Synergy } from "../enum/Synergy"
import { Status } from "../enum/Status"

export const SynergyName: {
  [key in Synergy]: { eng: string; esp: string; fra: string }
} = {
  [Synergy.NORMAL]: {
    eng: "Normal",
    esp: "Normal",
    fra: "Normal"
  },
  [Synergy.GRASS]: {
    eng: "Grass",
    esp: "Planta",
    fra: "Feuille"
  },
  [Synergy.FIRE]: {
    eng: "Fire",
    esp: "Fuego",
    fra: "Feu"
  },
  [Synergy.WATER]: {
    eng: "Water",
    esp: "Agua",
    fra: "Eau"
  },
  [Synergy.ELECTRIC]: {
    eng: "Electric",
    esp: "Elec",
    fra: "Elec"
  },
  [Synergy.FIGHTING]: {
    eng: "Fighting",
    esp: "Lucha",
    fra: "Combat"
  },
  [Synergy.PSYCHIC]: {
    eng: "Psychic",
    esp: "Psiquico",
    fra: "Psy"
  },
  [Synergy.DARK]: {
    eng: "Dark",
    esp: "Siniestro",
    fra: "Ténèbres"
  },
  [Synergy.STEEL]: {
    eng: "Steel",
    esp: "Acero",
    fra: "Acier"
  },
  [Synergy.GROUND]: {
    eng: "Ground",
    esp: "Tierra",
    fra: "Sol"
  },
  [Synergy.POISON]: {
    eng: "Poison",
    esp: "Veneno",
    fra: "Poison"
  },
  [Synergy.DRAGON]: {
    eng: "Dragon",
    esp: "Dragón",
    fra: "Dragon"
  },
  [Synergy.FIELD]: {
    eng: "Field",
    esp: "Campo",
    fra: "Terrestre"
  },
  [Synergy.MONSTER]: {
    eng: "Monster",
    esp: "Monstruo",
    fra: "Monstre"
  },
  [Synergy.HUMAN]: {
    eng: "Human",
    esp: "Humanoide",
    fra: "Humain"
  },
  [Synergy.AQUATIC]: {
    eng: "Aquatic",
    esp: "Acuático",
    fra: "Aquatique"
  },
  [Synergy.BUG]: {
    eng: "Bug",
    esp: "Bicho",
    fra: "Insecte"
  },
  [Synergy.FLYING]: {
    eng: "Flying",
    esp: "Volador",
    fra: "Vol"
  },
  [Synergy.FLORA]: {
    eng: "Flora",
    esp: "Flor",
    fra: "Fleur"
  },
  [Synergy.ROCK]: {
    eng: "Rock",
    esp: "Roca",
    fra: "Minéral"
  },
  [Synergy.GHOST]: {
    eng: "Ghost",
    esp: "Fantasma",
    fra: "Fantome"
  },
  [Synergy.FAIRY]: {
    eng: "Fairy",
    esp: "Hada",
    fra: "Fée"
  },
  [Synergy.ICE]: {
    eng: "Ice",
    esp: "Hielo",
    fra: "Glace"
  },
  [Synergy.FOSSIL]: {
    eng: "Fossil",
    esp: "Fossil",
    fra: "Fossile"
  },
  [Synergy.SOUND]: {
    eng: "Sound",
    esp: "Sound",
    fra: "Sound"
  },
  [Synergy.ARTIFICIAL]: {
    eng: "Artificial",
    esp: "Artificial",
    fra: "Artificial"
  },
  [Synergy.BABY]: {
    eng: "Baby",
    esp: "",
    fra: ""
  }
}

export const SynergyDescription: {
  [key in Synergy]: { eng: string; esp: string; fra: string }
} = {
  [Synergy.NORMAL]: {
    eng: `Normal pokemons and their adjacent allies gain ${Stat.SHIELD} when combat starts`,
    esp: "",
    fra: ""
  },
  [Synergy.GRASS]: {
    eng: `Grass pokemons heal over time`,
    esp: "",
    fra: ""
  },
  [Synergy.FIRE]: {
    eng: `Fire pokemons gain ${Stat.ATK} after every hit and have a chance to ${Status.BURN} their enemies for 2 seconds`,
    esp: "",
    fra: ""
  },
  [Synergy.WATER]: {
    eng: `Water pokemons have a chance to dodge basic attacks`,
    esp: "",
    fra: ""
  },
  [Synergy.ELECTRIC]: {
    eng: `Electric pokemons basic attacks have a chance to trigger two additional attacks`,
    esp: "",
    fra: ""
  },
  [Synergy.FIGHTING]: {
    eng: "Fighting pokemons block a flat amount of damage on every hit received",
    esp: "",
    fra: ""
  },
  [Synergy.PSYCHIC]: {
    eng: `Psychic pokemons gain additional ${Stat.AP}`,
    esp: "",
    fra: ""
  },
  [Synergy.DARK]: {
    eng: `Dark pokemons critical hits are more powerful and more frequent. Melee Dark pokemons jump to the farthest target reachable.`,
    esp: "",
    fra: ""
  },
  [Synergy.STEEL]: {
    eng: `Steel pokemons can double their base ${Stat.ATK}`,
    esp: "",
    fra: ""
  },
  [Synergy.GROUND]: {
    eng: `Ground pokemons gain bonus ${Stat.ATK}, ${Stat.DEF} and ${Stat.SPE_DEF} every 3 seconds, up to 4 times.`,
    esp: "",
    fra: ""
  },
  [Synergy.POISON]: {
    eng: `Poison pokemons have a chance to ${Status.POISON} their target for seconds with their basic attacks `,
    esp: "",
    fra: ""
  },
  [Synergy.DRAGON]: {
    eng: `Dragon pokemons gain ${Stat.ATK_SPEED} after every basic attack`,
    esp: "Dragón",
    fra: "Dragon"
  },
  [Synergy.FIELD]: {
    eng: `When a field pokemon dies, all the other field pokemons gain ${Stat.ATK_SPEED} and are healed for a percentage of their max ${Stat.HP}`,
    esp: "",
    fra: ""
  },
  [Synergy.MONSTER]: {
    eng: `Monster pokemons heal and gain bonus stats every time they knock down an opponent`,
    esp: "",
    fra: ""
  },
  [Synergy.HUMAN]: {
    eng: `All your team heals for a percentage of the damage they deal with attacks and abilities`,
    esp: "",
    fra: ""
  },
  [Synergy.AQUATIC]: {
    eng: `Aquatic pokemons have a chance to steal ${Stat.MANA} from their target at every basic attack`,
    esp: "",
    fra: ""
  },
  [Synergy.BUG]: {
    eng: `At the start of the combat, the bug pokemons with the most ${Stat.HP} are duplicated`,
    esp: "",
    fra: ""
  },
  [Synergy.FLYING]: {
    eng: `Flying pokemons fly away when they fell under a certain amount of ${Stat.HP}`,
    esp: "",
    fra: ""
  },
  [Synergy.FLORA]: {
    eng: "When the first flora pokemon is dead, a flower will rise from its grave...",
    esp: "",
    fra: ""
  },
  [Synergy.ROCK]: {
    eng: `Rock pokemons gain ${Stat.SHIELD} at the start of the combat`,
    esp: "",
    fra: ""
  },
  [Synergy.GHOST]: {
    eng: `Ghost pokemons have 50% chance to ${Status.SILENCE} on hit, and deal a percentage of their damage as ${Damage.TRUE}`,
    esp: "",
    fra: ""
  },
  [Synergy.FAIRY]: {
    eng: "Fairy pokemons shock nearby enemies whenever they deal or receive a critical strike",
    esp: "",
    fra: ""
  },
  [Synergy.ICE]: {
    eng: `All allies have a chance to ${Status.FREEZE} the enemy for 2 seconds after a hit`,
    esp: "",
    fra: ""
  },
  [Synergy.FOSSIL]: {
    eng: `On their first KO, fossil pokemons come back to life with increased ${Stat.ATK}`,
    esp: "",
    fra: ""
  },
  [Synergy.SOUND]: {
    eng: `Sound pokemons gain ${Stat.ATK} every time they use their abilities`,
    esp: "",
    fra: ""
  },
  [Synergy.ARTIFICIAL]: {
    eng: `Artificial pokemons gains ${Stat.ATK} and ${Stat.SHIELD} depending on the number of items held`,
    esp: "",
    fra: ""
  },
  [Synergy.BABY]: {
    eng: `Babies can bring you Pokemon Eggs to comfort you after a defeat`,
    esp: "",
    fra: ""
  }
}

