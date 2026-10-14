import type { Tree } from "../../types/atlas"
import { Item } from "../../types/enum/Item"
import { TownEncounters } from "../../types/enum/TownEncounter"

export const STAGE_ATLAS_UNLOCKED = 20

const D = 19 // distance factor

export const ATLAS_INITIAL_SCALE = 4
export const ATLAS_MIN_SCALE = 2
export const ATLAS_MAX_SCALE = 8

export const AtlasTree: Tree = {
  nodes: [
    { id: "root", position: [0, 0], type: "start" },
    // inner circle 1
    {
      id: "croagunk",
      type: "encounter",
      encounter: TownEncounters.CROAGUNK,
      position: rotToXY(-150, 10 * D)
    },
    {
      id: "meowth",
      type: "encounter",
      encounter: TownEncounters.MEOWTH,
      position: rotToXY(-30, 10 * D)
    },
    {
      id: "lapras",
      type: "encounter",
      encounter: TownEncounters.LAPRAS,
      position: rotToXY(90, 10 * D)
    },

    // inner circle 2
    {
      id: "makuhita",
      type: "encounter",
      encounter: TownEncounters.MAKUHITA,
      position: rotToXY(0, 17 * D)
    },
    {
      id: "marowak",
      type: "encounter",
      encounter: TownEncounters.MAROWAK,
      position: rotToXY(60, 17 * D)
    },
    {
      id: "duskull",
      type: "encounter",
      encounter: TownEncounters.DUSKULL,
      position: rotToXY(120, 17 * D)
    },
    {
      id: "kecleon",
      type: "encounter",
      encounter: TownEncounters.KECLEON,
      position: rotToXY(180, 17 * D)
    },
    {
      id: "wobbuffet",
      type: "encounter",
      encounter: TownEncounters.WOBBUFFET,
      position: rotToXY(240, 17 * D)
    },
    {
      id: "kingambit",
      type: "encounter",
      encounter: TownEncounters.KINGAMBIT,
      position: rotToXY(300, 17 * D)
    },

    // legendaries
    {
      id: "legendary1",
      type: "keystone",
      emera: "legendary",
      position: rotToXY(0, 27 * D)
    },
    {
      id: "legendary2",
      type: "keystone",
      emera: "legendary",
      position: rotToXY(60, 27 * D)
    },
    {
      id: "legendary3",
      type: "keystone",
      emera: "legendary",
      position: rotToXY(120, 27 * D)
    },
    {
      id: "legendary4",
      type: "keystone",
      emera: "legendary",
      position: rotToXY(180, 27 * D)
    },
    {
      id: "legendary5",
      type: "keystone",
      emera: "legendary",
      position: rotToXY(240, 27 * D)
    },
    {
      id: "legendary6",
      type: "keystone",
      emera: "legendary",
      position: rotToXY(300, 27 * D)
    },

    // inner circle 3
    {
      id: "spinda",
      type: "encounter",
      encounter: TownEncounters.SPINDA,
      position: rotToXY(20, 27 * D)
    },
    {
      id: "regirock",
      type: "encounter",
      encounter: TownEncounters.REGIROCK,
      position: rotToXY(40, 27 * D)
    },
    {
      id: "chansey",
      type: "encounter",
      encounter: TownEncounters.CHANSEY,
      position: rotToXY(80, 27 * D)
    },
    {
      id: "electivire",
      type: "encounter",
      encounter: TownEncounters.ELECTIVIRE,
      position: rotToXY(100, 27 * D)
    },
    {
      id: "ludicolo",
      type: "encounter",
      encounter: TownEncounters.LUDICOLO,
      position: rotToXY(140, 27 * D)
    },
    {
      id: "sableye",
      type: "encounter",
      encounter: TownEncounters.SABLEYE,
      position: rotToXY(160, 27 * D)
    },
    {
      id: "xatu",
      type: "encounter",
      encounter: TownEncounters.XATU,
      position: rotToXY(200, 27 * D)
    },
    {
      id: "celebi",
      type: "encounter",
      encounter: TownEncounters.CELEBI,
      position: rotToXY(220, 27 * D)
    },
    {
      id: "munchlax",
      type: "encounter",
      encounter: TownEncounters.MUNCHLAX,
      position: rotToXY(260, 27 * D)
    },
    {
      id: "kangaskhan",
      type: "encounter",
      encounter: TownEncounters.KANGASKHAN,
      position: rotToXY(280, 27 * D)
    },
    {
      id: "cinccino",
      type: "encounter",
      encounter: TownEncounters.CINCCINO,
      position: rotToXY(320, 27 * D)
    },
    {
      id: "wigglytuff",
      type: "encounter",
      encounter: TownEncounters.WIGGLYTUFF,
      position: rotToXY(340, 27 * D)
    },

    {
      id: "branch1",
      type: "step",
      position: rotToXY(0, 36 * D)
    },
    {
      id: "atlas_item1",
      type: "item",
      item: Item.RARE_CANDY,
      position: rotToXY(0, 45 * D)
    },

    {
      id: "branch2",
      type: "step",
      position: rotToXY(30, 36 * D)
    },
    {
      id: "atlas_item2",
      type: "keystone",
      emera: "awakening",
      position: rotToXY(30, 45 * D)
    },

    {
      id: "branch3",
      type: "condition",
      condition: "mega",
      position: rotToXY(60, 36 * D)
    },
    {
      id: "atlas_item3",
      type: "item",
      item: Item.MEGA_STONE,
      position: rotToXY(60, 45 * D)
    },

    {
      id: "looplet",
      type: "item",
      item: Item.LOOPLET,
      position: rotToXY(90, 36 * D)
    },
    {
      id: "looplet_pink_buff",
      position: sumVectors(rotToXY(90, 36 * D), rotToXY(150, 90)),
      type: "buff",
      buff: "pink"
    },
    {
      id: "looplet_red_buff",
      position: sumVectors(rotToXY(90, 36 * D), rotToXY(120, 90)),
      type: "buff",
      buff: "red"
    },
    {
      id: "looplet_gold_buff",
      position: sumVectors(rotToXY(90, 36 * D), rotToXY(90, 90)),
      type: "buff",
      buff: "yellow"
    },
    {
      id: "looplet_green_buff",
      position: sumVectors(rotToXY(90, 36 * D), rotToXY(60, 90)),
      type: "buff",
      buff: "green"
    },
    {
      id: "looplet_blue_buff",
      position: sumVectors(rotToXY(90, 36 * D), rotToXY(30, 90)),
      type: "buff",
      buff: "blue"
    },

    {
      id: "branch5",
      type: "step",
      position: rotToXY(120, 36 * D)
    },
    {
      id: "atlas_item5",
      type: "item",
      item: Item.EVIOLITE,
      position: rotToXY(120, 45 * D)
    },

    {
      id: "branch6",
      type: "step",
      position: rotToXY(150, 36 * D)
    },
    {
      id: "atlas_item6",
      type: "item",
      item: Item.TERA_ORB,
      position: rotToXY(150, 45 * D)
    },

    {
      id: "branch7",
      type: "step",
      position: rotToXY(180, 36 * D)
    },
    {
      id: "atlas_item7",
      type: "item",
      item: Item.GOLD_BOW,
      position: rotToXY(180, 45 * D)
    },

    {
      id: "branch8",
      type: "step",
      position: rotToXY(210, 36 * D)
    },
    {
      id: "atlas_item8",
      type: "item",
      item: Item.Z_RING,
      position: rotToXY(210, 45 * D)
    },

    {
      id: "branch9",
      type: "condition",
      condition: "mega",
      position: rotToXY(240, 36 * D)
    },
    {
      id: "atlas_item9",
      type: "item",
      item: Item.MEGA_STONE,
      position: rotToXY(240, 45 * D)
    },

    {
      id: "grovyle",
      type: "encounter",
      encounter: TownEncounters.GROVYLE,
      position: rotToXY(270, 36 * D)
    },
    {
      id: "atlas_item10",
      type: "item",
      item: Item.STAR_PIECE,
      position: rotToXY(270, 45 * D)
    },

    {
      id: "magnezone",
      type: "encounter",
      encounter: TownEncounters.MAGNEZONE,
      position: rotToXY(300, 36 * D)
    },
    {
      id: "atlas_item11",
      type: "item",
      item: Item.GOLD_MASK,
      position: rotToXY(300, 45 * D)
    },

    {
      id: "branch12",
      type: "step",
      position: rotToXY(330, 36 * D)
    },
    {
      id: "atlas_item12",
      type: "item",
      item: Item.DYNAMAX_BAND,
      position: rotToXY(330, 45 * D)
    }
    /*
    {
      id: "gigantamax",
      type: "keystone",
      emera: "gigantamax",
      position: rotToXY(330, 45 * D)
    }
    */
  ],
  connections: [
    { from: "root", to: "croagunk" },
    { from: "root", to: "meowth" },
    { from: "root", to: "lapras" },

    { from: "meowth", to: "kingambit" },
    { from: "meowth", to: "makuhita" },

    { from: "lapras", to: "marowak" },
    { from: "lapras", to: "duskull" },

    { from: "croagunk", to: "kecleon" },
    { from: "croagunk", to: "wobbuffet" },

    { from: "makuhita", to: "wigglytuff" },
    { from: "makuhita", to: "legendary1" },
    { from: "makuhita", to: "spinda" },

    { from: "marowak", to: "regirock" },
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
    { from: "cinccino", to: "wigglytuff" },

    { from: "wigglytuff", to: "branch1" },
    { from: "spinda", to: "branch1" },
    { from: "branch1", to: "atlas_item1" },

    { from: "spinda", to: "branch2" },
    { from: "regirock", to: "branch2" },
    { from: "branch2", to: "atlas_item2" },

    { from: "regirock", to: "branch3" },
    { from: "chansey", to: "branch3" },
    { from: "branch3", to: "atlas_item3" },

    { from: "chansey", to: "looplet" },
    { from: "electivire", to: "looplet" },
    { from: "looplet", to: "looplet_pink_buff" },
    { from: "looplet", to: "looplet_red_buff" },
    { from: "looplet", to: "looplet_gold_buff" },
    { from: "looplet", to: "looplet_green_buff" },
    { from: "looplet", to: "looplet_blue_buff" },

    { from: "electivire", to: "branch5" },
    { from: "ludicolo", to: "branch5" },
    { from: "branch5", to: "atlas_item5" },

    { from: "ludicolo", to: "branch6" },
    { from: "sableye", to: "branch6" },
    { from: "branch6", to: "atlas_item6" },

    { from: "sableye", to: "branch7" },
    { from: "xatu", to: "branch7" },
    { from: "branch7", to: "atlas_item7" },

    { from: "xatu", to: "branch8" },
    { from: "celebi", to: "branch8" },
    { from: "branch8", to: "atlas_item8" },

    { from: "celebi", to: "branch9" },
    { from: "munchlax", to: "branch9" },
    { from: "branch9", to: "atlas_item9" },

    { from: "munchlax", to: "grovyle" },
    { from: "kangaskhan", to: "grovyle" },
    { from: "grovyle", to: "atlas_item10" },

    { from: "kangaskhan", to: "magnezone" },
    { from: "cinccino", to: "magnezone" },
    { from: "magnezone", to: "atlas_item11" },

    { from: "cinccino", to: "branch12" },
    { from: "wigglytuff", to: "branch12" },
    { from: "branch12", to: "atlas_item12" }
  ]
}

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
