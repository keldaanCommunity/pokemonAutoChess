export type Gadget = {
  name: string
  description: string
  icon: string
  levelRequired: number
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
  levelRequired: 10
}

const BOT_BUILDER: Gadget = {
  name: "gadget.bot_builder",
  description: "gadget.bot_builder_desc",
  icon: "bot",
  levelRequired: 20
}

export const GADGETS = {
  TRAINER_CARD,
  BAG,
  TEAM_PLANNER,
  JUKEBOX,
  BOT_BUILDER
} as const
