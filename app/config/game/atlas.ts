import type { AtlasNode, TAtlasTree } from "../../types/atlas"
import { Item } from "../../types/enum/Item"
import { TownEncounters } from "../../types/enum/TownEncounter"

export const STAGE_ATLAS_UNLOCKED = 20

const D = 19 // distance factor

export const ATLAS_INITIAL_SCALE = 4
export const ATLAS_MIN_SCALE = 2
export const ATLAS_MAX_SCALE = 8

const nodes = {
  root: { position: [0, 0], type: "start" as const },
  // inner circle 1
  croagunk: {
    type: "encounter",
    encounter: TownEncounters.CROAGUNK,
    position: rotToXY(-150, 10 * D)
  },
  meowth: {
    type: "encounter",
    encounter: TownEncounters.MEOWTH,
    position: rotToXY(-30, 10 * D)
  },
  lapras: {
    type: "encounter",
    encounter: TownEncounters.LAPRAS,
    position: rotToXY(90, 10 * D)
  },

  // inner circle 2
  makuhita: {
    type: "encounter",
    encounter: TownEncounters.MAKUHITA,
    position: rotToXY(0, 17 * D)
  },
  marowak: {
    type: "encounter",
    encounter: TownEncounters.MAROWAK,
    position: rotToXY(60, 17 * D)
  },
  duskull: {
    type: "encounter",
    encounter: TownEncounters.DUSKULL,
    position: rotToXY(120, 17 * D)
  },
  kecleon: {
    type: "encounter",
    encounter: TownEncounters.KECLEON,
    position: rotToXY(180, 17 * D)
  },
  wobbuffet: {
    type: "encounter",
    encounter: TownEncounters.WOBBUFFET,
    position: rotToXY(240, 17 * D)
  },
  kingambit: {
    type: "encounter",
    encounter: TownEncounters.KINGAMBIT,
    position: rotToXY(300, 17 * D)
  },

  // legendaries
  legendary1: {
    type: "legendary",
    position: rotToXY(0, 27 * D)
  },
  legendary2: {
    type: "legendary",
    position: rotToXY(60, 27 * D)
  },
  legendary3: {
    type: "legendary",
    position: rotToXY(120, 27 * D)
  },
  legendary4: {
    type: "legendary",
    position: rotToXY(180, 27 * D)
  },
  legendary5: {
    type: "legendary",
    position: rotToXY(240, 27 * D)
  },
  legendary6: {
    type: "legendary",
    position: rotToXY(300, 27 * D)
  },

  // inner circle 3
  spinda: {
    type: "encounter",
    encounter: TownEncounters.SPINDA,
    position: rotToXY(20, 27 * D)
  },
  azurill: {
    type: "encounter",
    encounter: TownEncounters.AZURILL,
    position: rotToXY(40, 27 * D)
  },
  chansey: {
    type: "encounter",
    encounter: TownEncounters.CHANSEY,
    position: rotToXY(80, 27 * D)
  },
  electivire: {
    type: "encounter",
    encounter: TownEncounters.ELECTIVIRE,
    position: rotToXY(100, 27 * D)
  },
  ludicolo: {
    type: "encounter",
    encounter: TownEncounters.LUDICOLO,
    position: rotToXY(140, 27 * D)
  },
  sableye: {
    type: "encounter",
    encounter: TownEncounters.SABLEYE,
    position: rotToXY(160, 27 * D)
  },
  xatu: {
    type: "encounter",
    encounter: TownEncounters.XATU,
    position: rotToXY(200, 27 * D)
  },
  celebi: {
    type: "encounter",
    encounter: TownEncounters.CELEBI,
    position: rotToXY(220, 27 * D)
  },
  munchlax: {
    type: "encounter",
    encounter: TownEncounters.MUNCHLAX,
    position: rotToXY(260, 27 * D)
  },
  kangaskhan: {
    type: "encounter",
    encounter: TownEncounters.KANGASKHAN,
    position: rotToXY(280, 27 * D)
  },
  cinccino: {
    type: "encounter",
    encounter: TownEncounters.CINCCINO,
    position: rotToXY(320, 27 * D)
  },
  chimecho: {
    type: "encounter",
    encounter: TownEncounters.CHIMECHO,
    position: rotToXY(340, 27 * D)
  },

  bidoof: {
    type: "encounter",
    encounter: TownEncounters.BIDOOF,
    position: rotToXY(0, 36 * D)
  },
  atlas_item1: {
    type: "item",
    item: Item.RARE_CANDY,
    position: rotToXY(0, 45 * D)
  },

  regirock: {
    type: "encounter",
    encounter: TownEncounters.REGIROCK,
    position: rotToXY(30, 36 * D)
  },
  atlas_item2: {
    type: "keystone",
    emera: "awakening",
    position: rotToXY(30, 45 * D)
  },

  branch3: {
    type: "condition",
    condition: "mega",
    position: rotToXY(60, 36 * D)
  },
  atlas_item3: {
    type: "item",
    item: Item.MEGA_STONE,
    position: rotToXY(60, 45 * D)
  },

  looplet: {
    type: "item",
    item: Item.LOOPLET,
    position: rotToXY(90, 36 * D)
  },
  looplet_pink_buff: {
    position: sumVectors(rotToXY(90, 36 * D), rotToXY(150, 90)),
    type: "buff",
    buff: "pink"
  },
  looplet_red_buff: {
    position: sumVectors(rotToXY(90, 36 * D), rotToXY(120, 90)),
    type: "buff",
    buff: "red"
  },
  looplet_gold_buff: {
    position: sumVectors(rotToXY(90, 36 * D), rotToXY(90, 90)),
    type: "buff",
    buff: "yellow"
  },
  looplet_green_buff: {
    position: sumVectors(rotToXY(90, 36 * D), rotToXY(60, 90)),
    type: "buff",
    buff: "green"
  },
  looplet_blue_buff: {
    position: sumVectors(rotToXY(90, 36 * D), rotToXY(30, 90)),
    type: "buff",
    buff: "blue"
  },

  omanyte: {
    type: "encounter",
    encounter: TownEncounters.OMANYTE,
    position: rotToXY(120, 36 * D)
  },
  atlas_item5: {
    type: "item",
    item: Item.EVIOLITE,
    position: rotToXY(120, 45 * D)
  },

  ampharos: {
    type: "encounter",
    encounter: TownEncounters.AMPHAROS,
    position: rotToXY(150, 36 * D)
  },
  atlas_item6: {
    type: "item",
    item: Item.TERA_ORB,
    position: rotToXY(150, 45 * D)
  },

  dusknoir: {
    type: "encounter",
    encounter: TownEncounters.DUSKNOIR,
    position: rotToXY(180, 36 * D)
  },
  atlas_item7: {
    type: "item",
    item: Item.GOLD_BOW,
    position: rotToXY(180, 45 * D)
  },

  wigglytuff: {
    type: "encounter",
    encounter: TownEncounters.WIGGLYTUFF,
    position: rotToXY(210, 36 * D)
  },
  atlas_item8: {
    type: "item",
    item: Item.Z_RING,
    position: rotToXY(210, 45 * D)
  },

  branch9: {
    type: "condition",
    condition: "mega",
    position: rotToXY(240, 36 * D)
  },
  atlas_item9: {
    type: "item",
    item: Item.MEGA_STONE,
    position: rotToXY(240, 45 * D)
  },

  grovyle: {
    type: "encounter",
    encounter: TownEncounters.GROVYLE,
    position: rotToXY(270, 36 * D)
  },
  atlas_item10: {
    type: "item",
    item: Item.STAR_PIECE,
    position: rotToXY(270, 45 * D)
  },

  magnezone: {
    type: "encounter",
    encounter: TownEncounters.MAGNEZONE,
    position: rotToXY(300, 36 * D)
  },
  atlas_item11: {
    type: "item",
    item: Item.GOLD_MASK,
    position: rotToXY(300, 45 * D)
  },

  loudred: {
    type: "encounter",
    position: rotToXY(330, 36 * D),
    encounter: TownEncounters.LOUDRED
  },
  atlas_item12: {
    type: "item",
    item: Item.DYNAMAX_BAND,
    position: rotToXY(330, 45 * D)
  }
  /*
    gigantamax: {
      type: "keystone",
      emera: "gigantamax",
      position: rotToXY(330, 45 * D)
    }
    */
} satisfies { [nodeId: string]: AtlasNode }

const connections = [
  { from: "root", to: "croagunk" },
  { from: "root", to: "meowth" },
  { from: "root", to: "lapras" },

  { from: "meowth", to: "kingambit" },
  { from: "meowth", to: "makuhita" },

  { from: "lapras", to: "marowak" },
  { from: "lapras", to: "duskull" },

  { from: "croagunk", to: "kecleon" },
  { from: "croagunk", to: "wobbuffet" },

  { from: "makuhita", to: "chimecho" },
  { from: "makuhita", to: "legendary1" },
  { from: "makuhita", to: "spinda" },

  { from: "marowak", to: "azurill" },
  { from: "marowak", to: "legendary2" },
  { from: "marowak", to: "chansey" },

  { from: "duskull", to: "electivire" },
  { from: "duskull", to: "legendary3" },
  { from: "duskull", to: "ludicolo" },

  { from: "kecleon", to: "sableye" },
  { from: "kecleon", to: "legendary4" },
  { from: "kecleon", to: "xatu" },

  { from: "wobbuffet", to: "celebi" },
  { from: "wobbuffet", to: "legendary5" },
  { from: "wobbuffet", to: "munchlax" },

  { from: "kingambit", to: "kangaskhan" },
  { from: "kingambit", to: "legendary6" },
  { from: "kingambit", to: "cinccino" },

  { from: "spinda", to: "regirock" },
  { from: "chansey", to: "electivire" },
  { from: "ludicolo", to: "sableye" },
  { from: "xatu", to: "celebi" },
  { from: "munchlax", to: "kangaskhan" },
  { from: "cinccino", to: "chimecho" },

  { from: "chimecho", to: "bidoof" },
  { from: "spinda", to: "bidoof" },
  { from: "bidoof", to: "atlas_item1" },

  { from: "spinda", to: "azurill" },
  { from: "azurill", to: "regirock" },
  { from: "regirock", to: "atlas_item2" },

  { from: "azurill", to: "branch3" },
  { from: "chansey", to: "branch3" },
  { from: "branch3", to: "atlas_item3" },

  { from: "chansey", to: "looplet" },
  { from: "electivire", to: "looplet" },
  { from: "looplet", to: "looplet_pink_buff" },
  { from: "looplet", to: "looplet_red_buff" },
  { from: "looplet", to: "looplet_gold_buff" },
  { from: "looplet", to: "looplet_green_buff" },
  { from: "looplet", to: "looplet_blue_buff" },

  { from: "electivire", to: "omanyte" },
  { from: "ludicolo", to: "omanyte" },
  { from: "omanyte", to: "atlas_item5" },

  { from: "ludicolo", to: "ampharos" },
  { from: "sableye", to: "ampharos" },
  { from: "ampharos", to: "atlas_item6" },

  { from: "sableye", to: "dusknoir" },
  { from: "xatu", to: "dusknoir" },
  { from: "dusknoir", to: "atlas_item7" },

  { from: "xatu", to: "wigglytuff" },
  { from: "celebi", to: "wigglytuff" },
  { from: "wigglytuff", to: "atlas_item8" },

  { from: "celebi", to: "branch9" },
  { from: "munchlax", to: "branch9" },
  { from: "branch9", to: "atlas_item9" },

  { from: "munchlax", to: "grovyle" },
  { from: "kangaskhan", to: "grovyle" },
  { from: "grovyle", to: "atlas_item10" },

  { from: "kangaskhan", to: "magnezone" },
  { from: "cinccino", to: "magnezone" },
  { from: "magnezone", to: "atlas_item11" },

  { from: "cinccino", to: "loudred" },
  { from: "chimecho", to: "loudred" },
  { from: "loudred", to: "atlas_item12" }
] satisfies { from: keyof typeof nodes; to: keyof typeof nodes }[]

export const AtlasTree = {
  nodes,
  connections
} satisfies TAtlasTree

export type AtlasNodeId = keyof typeof AtlasTree.nodes

export function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180)
}

export function rotToXY(degrees: number, radius: number): [number, number] {
  return [
    radius * Math.cos(degreesToRadians(degrees)),
    radius * Math.sin(degreesToRadians(degrees))
  ]
}

function sumVectors(...vectors: [number, number][]) {
  return vectors.reduce(([x, y], [dx, dy]) => {
    return [x + dx, y + dy]
  })
}
