import { Item } from "../enum/Item"

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
  [Item.WATER_INCENSE]: "Water Incense",
  [Item.SHELL_BELL]: "Shell Bell",
  [Item.LUCKY_EGG]: "Lucky Egg",
  [Item.AQUA_EGG]: "Aqua Egg",
  [Item.BLUE_ORB]: "Blue Orb",
  [Item.ZOOM_LENS]: "Zoom Lens",
  [Item.BRIGHT_POWDER]: "Bright Powder",
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
  [Item.KINGS_ROCK]: "Kings Rock",
  [Item.POKE_DOLL]: "Poke Doll",
  [Item.RED_ORB]: "Red Orb",
  [Item.MAX_REVIVE]: "Max Revive",
  [Item.ROCKY_HELMET]: "Rocky Helmet"
}

export const ItemDescription: { [key in Item]: string } = Object.freeze({
  [Item.FOSSIL_STONE]: "Give it to a Ditto to obtain a random fossil",
  [Item.TWISTED_SPOON]: "+10% spell damage",
  [Item.MYSTIC_WATER]: "+15 mana",
  [Item.MAGNET]: "+10% attack speed",
  [Item.BLACK_GLASSES]: "+5% critical hit",
  [Item.MIRACLE_SEED]: "+15 health",
  [Item.NEVER_MELT_ICE]: "+2 special defense",
  [Item.CHARCOAL]: "+1 attack",
  [Item.HEART_SCALE]: "+1 defense",
  [Item.OLD_AMBER]: "The holder gains the fossil type",
  [Item.DAWN_STONE]: "The holder gains the psychic type",
  [Item.WATER_STONE]: "The holder gains the water type",
  [Item.THUNDER_STONE]: "The holder gains the electric type",
  [Item.FIRE_STONE]: "The holder gains the fire type",
  [Item.MOON_STONE]: "The holder gains the fairy type",
  [Item.DUSK_STONE]: "The holder gains the dark type",
  [Item.LEAF_STONE]: "The holder gains the grass type",
  [Item.ICY_ROCK]: "The holder gains the ice type",
  [Item.CHOICE_SPECS]: "The holder gains 80% spell damage",
  [Item.SOUL_DEW]:
    "During combat, the holder gains 10% spell damage every 2 seconds",
  [Item.UPGRADE]: "Attacks grant +5% bonus Attack Speed for the rest of combat",
  [Item.REAPER_CLOTH]: "The holder spells can critically strike",
  [Item.POKEMONOMICON]:
    "When the holder deals damage with their Ability, they burn and wound the target for 2 seconds",
  [Item.WATER_INCENSE]:
    "30% bonus damage on spells up to 75% if target as more than 200hp",
  [Item.SHELL_BELL]: "Holder heals for 50% of all damages",
  [Item.LUCKY_EGG]:
    "30% spelldamage for holder and adjacent allies in the same row",
  [Item.AQUA_EGG]:
    "The holder gains 50% mana at start. After casting its ability the holder gains 20 mana",
  [Item.BLUE_ORB]:
    "Every third attack from the holder unleashes a chain lightning that bounces to 3 enemies, burning 30 mana",
  [Item.ZOOM_LENS]:
    "The holder convert 5% of spell power as attack and 5 x attack as spell power",
  [Item.BRIGHT_POWDER]:
    "Every 4 sec, the holder throw sand, dropping a random adjacent ennemy speed by 30%",
  [Item.DELTA_ORB]:
    "Holder and adjacent allies in the same row gain 3 bonus mana /hit",
  [Item.MANA_SCARF]: "The holder attacks restore 8 additional mana",
  [Item.SMOKE_BALL]:
    "Reduce the attack speed of ennemy attackers by 40% for 5 seconds",
  [Item.XRAY_VISION]:
    "Grants 30% bonus attack speed. The holder attacks can no longer miss.",
  [Item.RAZOR_FANG]: "+100% Critical hit damage",
  [Item.LEFTOVERS]:
    "During the combat, the holder attack heals adjacent allies on the same row for 5% of their max health",
  [Item.CHOICE_SCARF]:
    "The holder basic attack hit a second adjacent ennemy for 75% of holder damage",
  [Item.FIRE_GEM]:
    "On kill holder gain 5/10/15 attack damage depending on stage (0/10/20)",
  [Item.DEFENSIVE_RIBBON]:
    "When the holder takes damage, they gain attack damage, 1 defense, 1 special defense and 5% attack speed. (stacks 10 times)",
  [Item.WONDER_BOX]:
    "At the beginning of each battle phase, the holder equips 2 temporary items",
  [Item.RUNE_PROTECT]:
    "When combat begins, the holder and all adjacent allies are immune to spells for the first 6 seconds",
  [Item.WIDE_LENS]: "The holder gains +2 range",
  [Item.RAZOR_CLAW]: "The holder gains 50% Critical hit Chance",
  [Item.FLUFFY_TAIL]: "Holder is immune to all status",
  [Item.ORAN_BERRY]: "Grants 100 bonus hp",
  [Item.SHINY_CHARM]:
    "Upon attack, 25% chance to trigger protect status for 1s",
  [Item.FOCUS_BAND]:
    "When combat begins, the holder and all allies within 1 hexes in the same row gain +30% Attack Speed for the rest of combat",
  [Item.FLAME_ORB]: "Holder is burned but increase attack by 100%",
  [Item.ASSAULT_VEST]: "Grants 16 bonus special defense",
  [Item.KINGS_ROCK]:
    "+1 money each time the holder kill an ennemy (max 5 golds)",
  [Item.POKE_DOLL]: "Reduce all incoming damage by 30%",
  [Item.RED_ORB]:
    "+8 attack damage. Each attack of the holder deals an additional 20% true damage",
  [Item.MAX_REVIVE]: "Prevents the holder first death",
  [Item.ROCKY_HELMET]:
    "Grants 10 bonus armor. Negates bonus damage from incoming critical hits."
})
