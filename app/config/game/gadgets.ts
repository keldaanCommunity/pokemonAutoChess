import { BOTS_ENABLED } from ".."

export const GADGETS_NAMES = [
  "trainer_card",
  "bag",
  "team_planner",
  "jukebox",
  "palette",
  "synergy_wheel",
  "gameboy",
  "pokeguesser",
  "bot_builder",
  "tier_list_maker",
  "sprite_tracker"
] as const

export type GadgetName = (typeof GADGETS_NAMES)[number]

export type Gadget = {
  name: GadgetName
  icon: string
  levelRequired: number
  disabled?: boolean
}

export const GADGETS: Record<GadgetName, Gadget> = {
  trainer_card: {
    name: "trainer_card",
    icon: "profile",
    levelRequired: 0
  },
  bag: {
    name: "bag",
    icon: "school-bag",
    levelRequired: 1
  },
  team_planner: {
    name: "team_planner",
    icon: "team-builder",
    levelRequired: 2
  },
  jukebox: {
    name: "jukebox",
    icon: "compact-disc",
    levelRequired: 5
  },
  palette: {
    name: "palette",
    icon: "palette",
    levelRequired: 10
  },
  synergy_wheel: {
    name: "synergy_wheel",
    icon: "synergy-wheel",
    levelRequired: 15
  },
  gameboy: {
    name: "gameboy",
    icon: "gameboy",
    levelRequired: 20
  },
  pokeguesser: {
    name: "pokeguesser",
    icon: "pokeguesser",
    levelRequired: 30
  },
  bot_builder: {
    name: "bot_builder",
    icon: "bot",
    levelRequired: 40,
    disabled: !BOTS_ENABLED
  },

  tier_list_maker: {
    name: "tier_list_maker",
    icon: "tier-list",
    levelRequired: 50
  },
  sprite_tracker: {
    name: "sprite_tracker",
    icon: "pokemon-sprite",
    levelRequired: 60
  }
} as const

export const GADGETS_UNLOCKED_BY_LEVEL: Record<number, Gadget> =
  Object.fromEntries(
    Object.values(GADGETS).map((gadget) => [gadget.levelRequired, gadget])
  ) as Record<number, Gadget>
