import { Damage, Stat } from "../enum/Game"
import { Item } from "../enum/Item"
import { Status } from "../enum/Status"

export const ItemName: { [key in Item]: string } = {
  [Item.FOSSIL_STONE]: "Fossil Stone",
  [Item.TWISTED_SPOON]: "Twisted Spoon",
  [Item.MYSTIC_WATER]: "Mystic Water",
  [Item.MAGNET]: "Magnet",
  [Item.BLACK_GLASSES]: "Black Glasses",
  [Item.MIRACLE_SEED]: "Miracle Seed",
  [Item.NEVER_MELT_ICE]: "Never Melt Ice",
  [Item.CHARCOAL]: "Charcoal",
  [Item.HEART_SCALE]: "Heart Scale",
  [Item.OLD_AMBER]: "Old Amber",
  [Item.DAWN_STONE]: "Dawn Stone",
  [Item.WATER_STONE]: "Water Stone",
  [Item.THUNDER_STONE]: "Thunder Stone",
  [Item.FIRE_STONE]: "Fire Stone",
  [Item.MOON_STONE]: "Moon Stone",
  [Item.DUSK_STONE]: "Dusk Stone",
  [Item.LEAF_STONE]: "Leaf Stone",
  [Item.ICY_ROCK]: "Icy Rock",
  [Item.CHOICE_SPECS]: "Choice Specs",
  [Item.SOUL_DEW]: "Soul Dew",
  [Item.UPGRADE]: "Upgrade",
  [Item.REAPER_CLOTH]: "Reaper Cloth",
  [Item.POKEMONOMICON]: "Pokemonomicon",
  [Item.POWER_LENS]: "Power Lens",
  [Item.SHELL_BELL]: "Shell Bell",
  [Item.LUCKY_EGG]: "Lucky Egg",
  [Item.AQUA_EGG]: "Aqua Egg",
  [Item.BLUE_ORB]: "Blue Orb",
  [Item.ZOOM_LENS]: "Zoom Lens",
  [Item.STAR_DUST]: "Star Dust",
  [Item.DELTA_ORB]: "Delta Orb",
  [Item.MANA_SCARF]: "Mana Scarf",
  [Item.SMOKE_BALL]: "Smoke Ball",
  [Item.XRAY_VISION]: "XRay Vision",
  [Item.RAZOR_FANG]: "Razor Fang",
  [Item.LEFTOVERS]: "Leftovers",
  [Item.CHOICE_SCARF]: "Choice Scarf",
  [Item.FIRE_GEM]: "Fire Gem",
  [Item.DEFENSIVE_RIBBON]: "Defensive Ribbon",
  [Item.WONDER_BOX]: "Wonder Box",
  [Item.RUNE_PROTECT]: "Rune Protect",
  [Item.WIDE_LENS]: "Wide Lens",
  [Item.RAZOR_CLAW]: "Razor Claw",
  [Item.FLUFFY_TAIL]: "Fluffy Tail",
  [Item.ORAN_BERRY]: "Oran Berry",
  [Item.SHINY_CHARM]: "Shiny Charm",
  [Item.FOCUS_BAND]: "Focus Band",
  [Item.FLAME_ORB]: "Flame Orb",
  [Item.ASSAULT_VEST]: "Assault Vest",
  [Item.AMULET_COIN]: "Amulet Coin",
  [Item.POKE_DOLL]: "Poke Doll",
  [Item.RED_ORB]: "Red Orb",
  [Item.MAX_REVIVE]: "Max Revive",
  [Item.ROCKY_HELMET]: "Rocky Helmet"
}

export const ItemDescription: { [key in Item]: string } = Object.freeze({
  [Item.FOSSIL_STONE]: "A fossil of a Pokémon that lived in prehistoric times",
  [Item.TWISTED_SPOON]: `+10% ${Stat.AP}`,
  [Item.MYSTIC_WATER]: `+15 ${Stat.MANA}`,
  [Item.MAGNET]: `+10% ${Stat.ATK_SPEED}`,
  [Item.BLACK_GLASSES]: `+5% ${Stat.CRIT_CHANCE}`,
  [Item.MIRACLE_SEED]: `+15 ${Stat.SHIELD} when combat begins`,
  [Item.NEVER_MELT_ICE]: `+1 ${Stat.SPE_DEF}`,
  [Item.CHARCOAL]: `+1 ${Stat.ATK}`,
  [Item.HEART_SCALE]: `+1 ${Stat.DEF}`,
  [Item.OLD_AMBER]: "The holder gains the fossil type",
  [Item.DAWN_STONE]: "The holder gains the psychic type",
  [Item.WATER_STONE]: "The holder gains the water type",
  [Item.THUNDER_STONE]: "The holder gains the electric type",
  [Item.FIRE_STONE]: "The holder gains the fire type",
  [Item.MOON_STONE]: "The holder gains the fairy type",
  [Item.DUSK_STONE]: "The holder gains the dark type",
  [Item.LEAF_STONE]: "The holder gains the grass type",
  [Item.ICY_ROCK]: "The holder gains the ice type",
  [Item.CHOICE_SPECS]: `The holder gains 100% bonus ${Stat.AP}`,
  [Item.SOUL_DEW]:
    `During combat, the holder gains 10% ${Stat.AP} every second`,
  [Item.UPGRADE]: `Attacks grant +5% bonus ${Stat.ATK_SPEED} for the rest of combat`,
  [Item.REAPER_CLOTH]: "The holder spells can critically strike",
  [Item.POKEMONOMICON]:
    "When the holder deals damage with their Ability, they burn and wound the target for 2 seconds",
  [Item.POWER_LENS]:
    `50% of received ${Damage.SPECIAL} is reflected to the attacker`,
  [Item.SHELL_BELL]: "Holder heals for 30% of all damages inflicted",
  [Item.LUCKY_EGG]:
    `+30% ${Stat.AP} for holder and adjacent allies in the same row`,
  [Item.AQUA_EGG]:
    `The holder gains +50 starting ${Stat.MANA} and regains 20 ${Stat.MANA} after casting its ability`,
  [Item.BLUE_ORB]:
    `Every third attack from the holder unleashes a chain lightning that bounces to 2 enemies, burning 20 ${Stat.MANA}`,
  [Item.ZOOM_LENS]:
    `The holder converts 5% of its ${Stat.AP} as ${Stat.ATK} and 5 x its ${Stat.ATK} as ${Stat.AP}`,
  [Item.STAR_DUST]:
    `After casting ability, gain 50% of max ${Stat.MANA} as ${Stat.SHIELD}`,
  [Item.DELTA_ORB]:
    `Holder and adjacent allies in the same row gain 3 bonus ${Stat.MANA} per hit`,
  [Item.MANA_SCARF]: `The holder attacks restore 8 additional ${Stat.MANA}`,
  [Item.SMOKE_BALL]:
    `Trigger ${Status.PARALYSIS} on enemy attackers, reducing their ${Stat.ATK_SPEED} by 40% for 5 seconds`,
  [Item.XRAY_VISION]:
    `+50% ${Stat.ATK_SPEED}. The holder attacks can no longer miss.`,
  [Item.RAZOR_FANG]: `+100% ${Stat.CRIT_DAMAGE}`,
  [Item.LEFTOVERS]:
    `During the combat, the holder attack heals adjacent allies on the same row for 5% of their max ${Stat.HP}`,
  [Item.CHOICE_SCARF]:
    "The holder basic attacks hit a second adjacent enemy for 50% of the damage",
  [Item.FIRE_GEM]: `Adds 8% of target max ${Stat.HP} to attack damage`,
  [Item.DEFENSIVE_RIBBON]:
    `When the holder takes damage, they gain +1 ${Stat.ATK}, +1 ${Stat.DEF}, +1 ${Stat.SPE_DEF} and +5% ${Stat.ATK_SPEED} (stacks up to 10 times)`,
  [Item.WONDER_BOX]:
    "At the beginning of each battle, wonder box is replaced by 2 temporary items (max 3 items held)",
  [Item.RUNE_PROTECT]:
    `When combat begins, the holder and all adjacent allies receive ${Status.RUNE_PROTECT} for 6 seconds, making them immune to ${Damage.SPECIAL} and status alterations`,
  [Item.WIDE_LENS]: `The holder gains +2 ${Stat.RANGE}`,
  [Item.RAZOR_CLAW]: `The holder gains +55% ${Stat.CRIT_CHANCE}`,
  [Item.FLUFFY_TAIL]: `Holder is immune to all status alterations`,
  [Item.ORAN_BERRY]: `+130 ${Stat.SHIELD} when combat begins`,
  [Item.SHINY_CHARM]:
    `Upon attack, 25% chance to trigger ${Status.PROTECT} for 1 second`,
  [Item.FOCUS_BAND]:
    `When combat begins, the holder and adjacent allies in the same row gain +30% ${Stat.ATK_SPEED}`,
  [Item.FLAME_ORB]: `Holder is burned and cannot heal during the fight, but increase its ${Stat.ATK} by 100%`,
  [Item.ASSAULT_VEST]: `+18 ${Stat.SPE_DEF}`,
  [Item.AMULET_COIN]:
    "+1 gold each time the holder kills an enemy (max 5 gold per stage)",
  [Item.POKE_DOLL]: "Reduce all incoming damage by 30%",
  [Item.RED_ORB]:
    `+10 ${Stat.ATK}. Each attack of the holder deals 20% additional ${Damage.TRUE}`,
  [Item.MAX_REVIVE]: `Prevents the holder first death, restoring to max ${Stat.HP}`,
  [Item.ROCKY_HELMET]:
    `+12 ${Stat.DEF}. Negates critical bonus damage from incoming critical hits.`
})
