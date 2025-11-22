import { BOTS_ENABLED } from "../config"

export type Gadget = {
  name: string
  description: string
  icon: string
  levelRequired: number
  disabled?: boolean
}

const TRAINER_CARD: Gadget = {
  name: "gadget.trainer_card",
  description: "gadget.trainer_card_desc",
  icon: "profile",
  levelRequired: 0
}

const BAG: Gadget = {
  name: "gadget.bag",
  description: "gadget.bag_desc",
  icon: "school-bag",
  levelRequired: 1
}

const TEAM_PLANNER: Gadget = {
  name: "gadget.team_planner",
  description: "gadget.team_planner_desc",
  icon: "team-builder",
  levelRequired: 2
}

const JUKEBOX: Gadget = {
  name: "gadget.jukebox",
  description: "gadget.jukebox_desc",
  icon: "compact-disc",
  levelRequired: 5
}

const SYNERGY_WHEEL: Gadget = {
  name: "gadget.synergy_wheel",
  description: "gadget.synergy_wheel_desc",
  icon: "synergy-wheel",
  levelRequired: 10
}

const GAMEBOY: Gadget = {
  name: "gadget.gameboy",
  description: "gadget.gameboy_desc",
  icon: "gameboy",
  levelRequired: 20
}

const POKEGUESSER: Gadget = {
  name: "gadget.pokeguesser",
  description: "gadget.pokeguesser_desc",
  icon: "pokeguesser",
  levelRequired: 30
}

const BOT_BUILDER: Gadget = {
  name: "gadget.bot_builder",
  description: "gadget.bot_builder_desc",
  icon: "bot",
  levelRequired: 40,
  disabled: !BOTS_ENABLED
}

const TIER_LIST_MAKER: Gadget = {
  name: "gadget.tier_list_maker",
  description: "gadget.tier_list_maker_desc",
  icon: "tier-list",
  levelRequired: 50
}

export const GADGETS = {
  TRAINER_CARD,
  BAG,
  TEAM_PLANNER,
  JUKEBOX,
  SYNERGY_WHEEL,
  BOT_BUILDER,
  GAMEBOY,
  POKEGUESSER,
  TIER_LIST_MAKER
} as const
