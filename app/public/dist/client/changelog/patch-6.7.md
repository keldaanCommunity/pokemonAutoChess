# New Pokemons:

- Rotom Heat
- Rotom Wash
- Rotom Frost
- Rotom Fan
- Rotom Mow
- Galarian Weezing
- Orthworm
- Iron Thorns
- Klink
- Klang
- Klinklang
- Tadbulb
- Bellibolt
- Pincurchin

# Gameplay

- Stage 0 portal carousel now gives you 3 starters with 3 item components to choose from based on the portal symbols. This replaces the random Pokémon given to you at the start of the game.
- Max fight duration has been increased from 40 seconds to 45 seconds. You should get less draws now.
- Increased base duration of item carousel from 15 seconds to 16 seconds, and base retention delay from 5 seconds to 6 seconds. A bit more time to read item descriptions and make your choice.
- Units with both BURN and FREEZE status now unfreeze twice faster
- Synergies have been reordered based on their amount of families, unique, legendary and special excluded. This has an impact in case of equalities between synergies, notably: Arceus/Kecleon synergies, synergies obtained with Unown W, which synergy is Porygon converted to.
- When evolving a pokemon by merging 3 copies, items held by units on the board are prioritized rather than those held by units on bench
- BOARD_EFFECT (Smog, traps, terrain...) can now overlap on the same cell. Units moving into a cell with multiple board effects will gain all effects.

# Changes to Synergies

- Rework ELECTRIC 7: Supercharged: Triple attacks also burn 10 PP of the target and charge a Cell Battery by 5%. Each cell battery on bench gives 3 Speed to all your ELECTRIC Pokémon. Cell batteries can also be used on an ELECTRIC Pokémon to supercharge it for the next fight, granting it 50 SPEED and ELECTRIC_FIELD.
- New effect for GRASS: 40% of overheal is now gained as max HP
- PSYCHIC synergy thresholds changed: 2/4/6 → 3/5/7
- New effect for PSYCHIC 3: A Unown has 5% chance to appear in your shop
- New effect for PSYCHIC 7: Get a unown shop and a free shop reroll after every fight and every 10 shop rerolls.
- Changed ICE: FREEZE chance on hit is now 30% at all levels, SPE_DEF buffs: 4/12/40/60 → 4/12/30/60
- FIGHTING throws now throw the target further away and always on the target's team side of the board, and only if target is at melee contact.

# Changes to Items

- Artificial items have been renamed Tools. Some tools are now exclusive to Electivire town encounter.
- Removed Rotom Phone item, due to the rework of Rotom.
- Removed Toxic Orb
- New item: SPELL_TAG: Gives GHOST synergy. When the holder dies, curses its attacker to be KO'd in 9 seconds.
- Fluffy Tail is renamed SAFETY_GOGGLES. In addition to its previous effect, it now also grants immunity to sandstorm damage.
- Choice Scarf is renamed LOADED_DICE. Now gives +30 LUCK as base stat. Attacks have ~~100~~ 50% [LK] chance to bounce to a random enemy for ~~50~~ 100% of the attack damage.
- Lucky Egg is replaced by HEAVY_DUTY_BOOTS: Base stats: 12 DEF 30 AP; The holder is immune to board effects and forced displacement.
- XRAY_VISION has a new icon
- Changed POKE_DOLL: holder is now more likely to be chosen as a target. When a Pokémon considers a new target between several at equal distance, it will prefer to target the holder of POKE_DOLL.
- ELECTIRIZER now gives ELECTRIC type. Removed PP burn on triple attacks.
- MAGMARIZER now gives FIRE type. Base stat: ATK 3 → 5 New effect: The holder doesn't suffer from Burn. Instead, it gains 30 SPEED when it is affected by BURN.
- POKERUS_VIAL now gives POISON type.
- New tool: DRAGON_SCALE: Gives DRAGON synergy as first synergy. +5 DEF/SPE_DEF
- New tool: TERRAIN_EXTENDER: At the start of the fight, holder gains either ELECTRIC_FIELD, GRASS_FIELD, PSYCHIC_FIELD, FAIRY_FIELD. When casting its ability, spread the field effect to all allies sharing the field's synergy.
- Added new synergy gems for all synergies (except BABY). These gems cannot be found buried in the ground, but can be obtained from Sableye encounter.
- PROTECTIVE_PADS now also protects against FIGHTING throws
- EXCHANGE_TICKET now exchange synergy stones with another synergy stones, and other craftable items with another craftable items excluding synergy stones
- Buff STICKY_BARB: base DEF 3 → 6
- Buff SMOKE_BALL: add 15 base SHIELD
- Buff POKEMONOMICON: base AP 10 → 30
- Buff WIDE_LENS: CRIT_CHANCE 10% → 15%
- Removed base 10 SPEED from GRACIDEA_FLOWER
- Revert BLUE_ORB nerf from patch 6.0: applies the effect every ~~4~~ 3 attacks ; PP burned: 20 → 15
- Changed INCENSE: gives FLORA type again ; base stats: 10 SPE_DEF 30 AP → 10 SPE_DEF 30 LUCK

# Changes to Pokemon & Abilities

- Eevee is now in Special category, and only found at stage 0 proposals. It always comes with a FOSSIL_STONE.
- Ditto can no longer appear in shops before stage 6
- Nerf and changes to Icicle Missile (Vanilluxe): FREEZE duration 3 → 2 seconds ; now correctly strikes the unit at the targeted cell at impact. If the initial target leaves that cell before impact, the missile can miss. If the attacker is KO before the projectile landing, the missile will have no effect.
- Change Magma Storm (Heatran): now deals 100 SPECIAL and propagates to adjacent enemies up to 5 times, losing 20% of its power for every tile travelled.
- Kleavor and Scizor are now regional variants of Scyther, obtainable in ROCK and STEEL regions. Tier 4 → 3, adjusted stats.
- Change Aqua Ring: heal amount increased from 20/30/50 to 20/40/80 HP.
- Clamperl is now FOSSIL/WATER instead of FOSSIL/WATER/AQUATIC ; DEF 8 → 10; SPE_DEF 4 → 5 ; new ability: Iron Defense ; Clamperl will evolve into Huntail or Gorebyss based on the dominant synergy between Dark and Psychic
- Huntail is now FOSSIL/WATER/DARK instead of FOSSIL/WATER/AQUATIC ; new ability: Cavernous Chomp - Deals 40/80/160 damage to the target. If the user is able to KO the target with its ability, it becomes RAGE for 1/2/3 seconds.
- Gorebyss is now FOSSIL/WATER/PSYCHIC instead of FOSSIL/WATER/AQUATIC ; new ability: Aqua Ring
- Kecleon and Arceus odds have been lowered even further: 1/200 → 1/400
- Buff Stakataka: ATK 10 → 20
- Galarian Slowpoke now appears in Poison regions instead of PSYCHIC regions
- Galarian Yamask now appears in Monster regions instead of GHOST regions
- Nerf Unown W: now gives you a high rarity Pokémon of one of your two highest synergies. Chances to get an epic have been extended up to level 30.
- Buff Quagsire: ATK 15 → 21
- Buff Guzzlord: DEF/SPE_DEF 6 → 10
- Buff Discharge: damage 25/50/75 → 25/50/100 SPECIAL
- New ability for Elekid line: Shockwave: deal 25/50/100 SPECIAL to all enemies in a 2-range radius, +1 range if user is in an ELECTRIC_FIELD.
- Rework Meteor Mash (Beldum): Deal 3 times 100% (AP) of Attack as SPECIAL to the target (4 times if user is in PSYCHIC_FIELD) and increase the user's ATK by 2 for each hit.
- Buff Deoxys: all forms HP 220 → 250
- Buff Meltan: PP 80 → 50
- Nerf Flutter Mane: ATK 20 → 17
- Nerf Plusle & Minun: PP 60 → 70
- Nerf Hisuian Qwilfish: no longer gains 1 AP per cast. DEF: 15/18 → 12/15 ; Barb barrage damage: 20/40/60/80 → 15/30/45/60 SPECIAL
- Bellossom is now FLORA/GRASS/SOUND instead of FLORA/POISON/GRASS
- Armarouge and Ceruledge now have HUMAN synergy in addition to their existing synergies. Nerf DEF and SPE_DEF statistics as a tradeoff.
- Buff Armor Cannon (Armarouge): secondary damage 30 → 50 SPECIAL, final damage 15 → 25 SPECIAL
- Nerf Skarmory passive: 12 → 10 spikes
- Nerf Hitmonlee: ATK 26 → 24
- Buff Basculin Red & Blue: HP 140 → 160
- Changed Roost (Pidove): now gain shield instead of healing HP
- Rework of Rotom Drone: now part of the Rotom line
- Rework of Rotom: now has 7 different forms that can be switched between with Rotom Catalog.
- Buff Ogerpon (all forms): DEF/SPE_DEF 8/8 → 14/16
- Alcremie passive no longer count benched units to determine its flavor.
- Comfey is now dropped when a Pokémon resurrects, and the Pokémon lose its stats buffs upon resurrection.
- Deerling and Sawsbuck now have GRASS synergy in addition to their existing synergies.
- Moved Noibat to Uncommon category
- Pumpkaboo and Gourgeist now have LIGHT synergy in addition to their existing synergies. HP 90/190 → 80/180, ATK 13/26 → 10/22
- Switch defensive stats of Burmy Trash and Burmy Sandy, and Wormadam Trash and Wormadam Sandy
- Remoraid can now be fished when playing WILD, based on wild chance.
- New ability for Tangela: Vine Whip
- Rework Power Whip and gave to Carnivine: deal 15/30/60 SPECIAL + 50% of user's current HP as SPECIAL to the target.
- Changed Grookey line passive: no longer gives PP to user and other drummers. PP gained 2/3/4 → 2/3/5
- Buff Minior Shields Up & Down: removed ability cooldown
- Buff Mud Bubble: reduce cooldown duration
- Buff Lock On (Genesect): TRUE bonus 200% → 300%
- Buff Maractus: PP 90 → 80
- Buff Swirlix line: PP 100 → 80
- Buff Houndoom: HP 160 → 175 ; ATK 18 → 24 ; DEF/SPE_DEF: 12/12 → 10/14
- Zygarde PP no longer resets to 0 when transforming into Complete form
- Gligar is now Epic additional pick. Removed item evolution rule. Adjusted stats.
- Reworked First Impression (Wimpod): deals 45/90/180 SPECIAL and inflicts Flinch for 5 seconds. On first cast, jumps backwards, spawning a random 1 star [common, uncommon, rare] BUG Pokémon at their previous location. PP 140 → 100.
- Brave Bird and Follow me now always move to a position on your side of the board
- Smoliv line is no longer regional
- Change Spark damage: 40/80 → 30/60/90 SPECIAL ; Wattrel line PP 100 → 80
- Rework Blacephalon: now Legendary FIRE/GHOST/HUMAN. Rework Mind Blown: Throws its head in the air, which then explodes into 5 fireworks. The user takes 50% of its max HP as true damage in the process. Fireworks hit in a 2 tile radius above random enemies, with effect depending on their color.
- Regieleki is now ELECTRIC/HUMAN/AMORPHOUS instead of ELECTRIC/HUMAN/FOSSIL

# Town Encounters

- New town encounter at stage 4: Wigglytuff gives you 30 GOLD for completing a mission.
- New town encounter at stage 17: Croagunk gives all players an EXCHANGE_TICKET
- Wobbuffet encounter now gives all players a RECYCLE_TICKET instead of an EXCHANGE_TICKET. It can now also be encountered at stage 22 and 27.
- Sableye can no longer be encountered at stage 4, but can now be encountered at stage 17.
- Kecleon can no longer be encountered after stage 22.

# UI

- Pokemons sprites are now lazy-loaded. This should reduce game loading times and memory usage significantly, at the cost of having a small delay before the Pokémon sprites are displayed for the first time. A wobbling pokéball is shown while the sprite is being loaded (should not take more than 1 second in most cases).
- Synergies count and battle stats now can be moved around the screen and minimized/maximized as needed.
- Round distance (number of rounds since your last fight with a player) is now shown in the player detail tooltip when hovering over a player's icon in game. This is useful to have a better guess of who will be your next opponent, since matchmaking is designed to maximize the round distance for all players.
- Wiki items section has been reworked for better readability.
- New section on the wiki: Stages
- New icons for TM and HM items
- Added colorblind mode option in preferences. This option changes Pokémon shadows, lighting, DPS bars and various other interfaces to increase contrasts and help colorblind players. We're looking for feedback from colorblind players to improve it further, please reach out on our Discord if you have suggestions.
- Added favorite Pokémon feature: you can now favorite Pokémon in your collection, to find them more easily when picking an avatar.

# Bugfix

- Added missing FIELD and DRAGON MEMORY_DISCS for Silvally
- All dash abilities and abilities hitting in between two cells now guarantee to hit at least the original target if no other enemies are hit. Abilities impacted: Aqua Jet, Flame Charge, Volt Switch, Wheel of Fire, Infernal Parade, Dig, Poison Powder, Silver Wind, Pyro Ball, Whirlpool, Magical Leaf, Snipe Shot, Extreme Speed, Psystrike, Psyshield Bash, Power Whip, Pastel Veil, Steel Wing, Firestarter, Surf, Steam Roller
- Fixed Comet shard description and removed AP scaling that was applied by mistake.
- Fixed Sacred Ash resurrecting a unit already currently resurrecting, causing duplication of that unit.
- Inanimate objects and Eggs can no longer be sent to the Dojo via Dojo Ticket item
- Fix passive descriptions not updating with AP and LUCK
- Fix Houndour spawns not getting AMORPHOUS bonuses
- Fix range of suction heal

# Misc

- Nerfed marowak encounter items for stages 14 and 24 
- Jukebox gadget level requirement decreased to 5
- New gadget: Synergy Wheel, unlocks at level 10
- Gameboy gadget level requirement decreased to 20
- Pokeguessr gadget level requirement decreased to 30
- Bot builder gadget level requirement increased to 40
- New gadget: Tier-list Maker, unlocks at level 50
- Added bench management to Bot builder