import React from "react"
import { Status } from "../../../../../types/enum/Status"
import { StatusDescription } from "../../../../../types/strings/Status"
import { addIconsToDescription } from "../../utils/descriptions"
import TestStatusAnim from "../anim/TestStatusAnim"

export const PARAMS_ANIM_BY_STATUS: {
  [key in Status]: {
    animationKey: string
    offset?: [number, number]
    scale?: number
    depth?: number
  }
} = {
  [Status.BURN]: { animationKey: "burn", scale: 2, offset: [0, -30] },
  [Status.SILENCE]: { animationKey: "silence", scale: 2, offset: [0, -30] },
  [Status.POISON]: { animationKey: "poison", scale: 2, offset: [0, -30] },
  [Status.FREEZE]: { animationKey: "freeze", scale: 2, offset: [0, 0] },
  [Status.PROTECT]: { animationKey: "protect", scale: 2, offset: [0, -30] },
  [Status.SLEEP]: { animationKey: "sleep", scale: 2, offset: [0, -30] },
  [Status.CONFUSION]: { animationKey: "confusion", scale: 2, offset: [0, -30] },
  [Status.WOUND]: { animationKey: "wound", scale: 2, offset: [0, -30] },
  [Status.RESURECTION]: {
    animationKey: "resurection",
    scale: 2,
    offset: [0, -45]
  },
  [Status.PARALYSIS]: { animationKey: "paralysis", scale: 2, offset: [0, -20] },
  [Status.ARMOR_REDUCTION]: {
    animationKey: "armorReduction",
    scale: 2,
    offset: [0, -40]
  },
  [Status.RUNE_PROTECT]: {
    animationKey: "rune_protect",
    scale: 2,
    offset: [0, -45]
  },
  [Status.ELECTRIC_FIELD]: {
    animationKey: "ELECTRIC_SURGE",
    scale: 2,
    offset: [0, 10],
    depth: 0
  },
  [Status.PSYCHIC_FIELD]: {
    animationKey: "PSYCHIC_SURGE",
    scale: 2,
    offset: [0, 10],
    depth: 0
  },
  [Status.GRASS_FIELD]: {
    animationKey: "GRASSY_SURGE",
    scale: 2,
    offset: [0, 10],
    depth: 0
  },
  [Status.FAIRY_FIELD]: {
    animationKey: "MISTY_SURGE",
    scale: 1,
    offset: [0, 10],
    depth: 0
  }
}

export default function WikiStatus() {
  return (
    <ul className="wiki-status">
      {Object.values(Status).map((status) => (
        <li key={status} className="nes-container">
          <TestStatusAnim
            atlasKey="status"
            width={140}
            height={140}
            {...PARAMS_ANIM_BY_STATUS[status]}
          ></TestStatusAnim>
          <h2>{addIconsToDescription(status)}</h2>
          <p className="description">
            {addIconsToDescription(StatusDescription[status]["eng"])}
          </p>
        </li>
      ))}
    </ul>
  )
}
