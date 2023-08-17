import React, { useMemo, useState } from "react"
import { t } from "i18next"

import { MainSidebar } from "../../main-sidebar"
import { PokemonTypeahead } from "../typeahead/pokemon-typeahead"
import { StatusTypeahead } from "../typeahead/status-typeahead"
import { Status } from "../../../../../types/enum/Status"
import { Pkm } from "../../../../../types/enum/Pokemon"

import TestStatusAnim from "../anim/TestStatusAnim"
import PokemonFactory from "../../../../../models/pokemon-factory"

import "./sprite-debug.css"
import { useNavigate } from "react-router-dom"

export function SpriteDebug() {
  const navigate = useNavigate()
  const [sprite, setSprite] = useState<Pkm>()
  const [status, setStatus] = useState<string>()

  const pkmIndex = useMemo(
    () => (sprite ? PokemonFactory.createPokemonFromName(sprite).index : null),
    [sprite]
  )

  return (
    <div className="sprite-debug-root">
      <MainSidebar
        page="main_lobby"
        leave={() => navigate("/lobby")}
        leaveLabel={t("back_to_lobby")}
      />
      <div className="sprite-debug-container">
        <div className="sprite-debug-toolbar">
          <div>
            Pokemon:
            <PokemonTypeahead onChange={(update) => setSprite(update)} />
          </div>
          <div>
            Status:
            <StatusTypeahead onChange={(update) => setStatus(update)} />
          </div>
        </div>
        <div className="sprite-debug-sprite">
          <TestStatusAnim
            pkmIndex={pkmIndex}
            atlasKey="status"
            width={500}
            height={500}
            {...(status ? PARAMS_ANIM_BY_STATUS[status] : {})}
          />
        </div>
      </div>
    </div>
  )
}

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
