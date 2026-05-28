# New Pokemons:

- Quaxly
- Quaxwell
- Quaquaval
- Hisui Avalugg
- Komala
- Tarountula
- Spidops
- Slither Wing
- Skwovet
- Greedent

# Changes to Game modes

- Ranked gamemode and participating in Tournaments now require to have an account of level 10 or higher

> We are trying a new approach to discourage some people from creating multiple accounts and playing ranked games at a level that is not theirs, or from polluting the leaderboard with multiple accounts (a.k.a. smurfing). This rule will inevitably impact new players ; no approach is perfect, we hope it's an acceptable compromise.


# Changes to Synergies

- FAIRY rework: Fairy Pokémon use wands to deal additional SPECIAL and various effects with their attacks. Pick one of 3 wands at each stage of Fairy. 12 wands have been added, each with their own unique effect conditionned by luck. Fairy 8 now also gives 20 LUCK to all FAIRY allies.

BLAST_WAND HP_SWAP_WAND SPIRIT_WAND LONG_WAND CONFUSE_WAND PETRIFY_WAND SLOW_WAND SLUMBER_WAND GUIDING_WAND SURROUND_WAND POUNCE_WAND TWO_EDGED_WAND WARP_WAND SWITCHER_WAND WHIRLWIND_WAND TUNNEL_WAND

> This fairy rework is minor, the base effect of special damage on fairy attacks is unchanged, but the added random effects are fun and thematic for fairy. This is also a first attempt of a "build your own synergy" with 256 different combinations of wands.

- FLYING: the selection of the destination cell when flying away is now smarter: it now considers the farthest free cells with at least one enemy at attack range, and the minimum of threats around.
- DARK melee Pokémon have increased priority movement for their first jump. That means they land their first attack slightly faster (-200ms on average), but this also prevents the opponent backline to move and leave a gap for assassins to infiltrate.

> These two changes aim to make movement-based synergy effects more predictable and more intuitive.

- FIGHTING 8 "Justified" is now "Coaching": no longer reduce hits taken before throwing, but instead gives you a Training Bag. Each round, FIGHTING Pokémon on the bench with a training bag or a pillar on their left will train, gaining 4 ATK and 10% base max HP permanently. Pillars can now be put on bench.
- HUMAN TM are now removable simply by benching the Pokémon
- Unowns no longer disappear after one fight if they did not cast their ability
- Unowns, when disappearing after casting their ability, leave a reminescence that gives 1 point in Psychic synergy but only for the next automatic shop assignment. This allows to chain Unown shops when playing Psychic 7 with an Unown on board.

> We simplify the rules and oddities around Unown management to make Psychic easier to play, especially for beginners

- FIELD_GEM, GROUND_GEM and AMORPHOUS_GEM can now be found buried in the ground
- Nerf ROCK: Def 10/30/60 → 10/25/50
- Nerf AMORPHOUS 7 Ethereal: 6 → 5 speed, 12 → 10 HP per active synergy

- Buff STEEL: now gives +3 DEF to the whole team when activated ; STEEL 8 Max Meltdown: 120 → 125% of ATK as TRUE

> Mostly adressing the lack of power of Steel 2 in early game, and the lack of incentive to enter Steel 2 in late game when you don't have a Steel Attack Damage carry.

# Changes to Pokemon & Abilities

## Distribution changes

- Hoppip line: remove GRASS type ; ATK: 4/8/12 → 5/10/15
- Chikorita: added FAIRY type ; PP 90 → 100
- Oddish: remove GRASS type; HP 80/150/230 → 80/150/250
- Bellossom: remove GRASS type ; HP: 250 → 300

> Trying to tone down the grass/flora composition by making most flower pots Pokémon not benefitting from the grass healing. We hope it will make you consider new Flora comps where Grass is no longer mandatory.

- Bagon line is now regional in Dragon/Monster regions
- Deino line is no longer regional
- Buneary line is now Rare instead of Uncommon. Adjusted stats.
- Vespiquen is now Unique with a new passive that let you choose between 3 different abilities. Comfey is now Special category. Adjusted stats for both Pokémon.
- Dunsparce and Dudunsparce are now NORMAL/GROUND/BUG instead of NORMAL/GROUND/FLYING

## Buffs

- Roost (Pidove), Firestarter (Fletchling) and Plasma Tempest (Rotom Fan) now use the new smarter flying away logic. These abilities also proc the protection and aggro reset effect from FLYING synergy if active when doing so.
- Buff Scream Tail: ATK 14 → 16, Defense: 8 → 12
- Ralts line: PP 95 → 100 ; buff Future Sight: now deals 20% of damage to adjacent targets as well. New visual animation.
- Improve Dream Eater: will no longer be stuck in a cast loop if the target has immunity to sleep, and will target an enemy that can be put to sleep if the main target is immune.
- Buff Mystical Fire (Fennekin): AP reduction increased from 10 to 20, and new visual animation.
- Buff Egg Bomb (Exeggcute): Eggs brought by the ability now hatch the next round immediately
- Buff Schooling (Wishiwashi): 10% → 15% max HP special damage
- Buff Spiritomb: ATK 15 → 18, Def 8 → 12, SpeDef 8 → 12
- Buff Mawile: SPEED 41 → 47
- Buff Purify (Pyukumuku): now also cures negative status conditions of adjacent allies, in addition to the user
- Buff Blipbug line: PP 100 → 85
- Buff Necrozma line: PP 110 → 100
- Buff Solgaleo: PP 110 → 100

## Nerfs

> Chimecho was performing badly at low elo and very well at high elo. The passive is the main culprit, giving incredible value when played in sound 6 and fully surrounded with sound allies. These specific conditions were not often met at low elo, but highly optimized at high elo, creating a huge power gap for this Pokémon. We change the range and passive to both reduce its power ceiling and make it more intuitive and less conditional.

- Nerf Chimecho ; range 3 → 2 ; passive reworked: Resonates to the sounds of adjacent allies, which gives 3 PP to Chimecho when they cast their ability.
- Nerf Fuecoco PP: 60/60/60 → 80/70/60
- Dive (Wailmer, Lapras) no longer inflicts FREEZE ; Lapras PP: 120 → 110
- Revert Popplio buff from 5.7 ; PP 70 → 80
- Nerf Geomancy (Xerneas): SPEED 20 → 15
- Nerf Water Pulse (Clawitzer): damage 75/150 → 70/140, 100% → 30% CONFUSION chance
- Nerf Sticky Web (Dewpider): fix damage applied to all targets hit instead of just the main target, and reduce the range of the web from a 2-tile cone in front of the user to a 1-tile cone.
- Nerf Swinub line: DEF 6/10/16 → 5/8/16, SPE_DEF: 4/8/12 → 3/6/12
- Nerf Psychic Surge (Tapu Lele): 40 → 30 SHIELD given to allies
- Nerf Cherrim Sunlight form: ATK 30 → 25 ; Natural Gift heal 120 → 90 HP

## Reworks

- Changed Tropius Dish to NANAB_BERRY: once below 50%HP, heal 50 HP and give 1 GOLD
- Shuckle: PP 90 → 50 ; Shuckle no longer gains PP during Bide effect
- Archen is now 2-range ; ATK: 4/10 -> 6/13, DEF: 4/8 → 3/6, SPE_DEF: 4/8 → 3/6
- New visual animation for Doom Desire

> We adjust damage per rank for PvE legendary abilities now that Skill Swap TM exists

- Psystrike (Mewtwo): 80 damage at all tiers → 20/40/80
- Origin Pulse (Kyogre): 100 damage at all tiers → 25/50/100
- Precipice Blades (Groudon): 100 damage at all tiers → 25/50/100
- Sky Attack (Lugia): 120 damage at all tiers → 30/60/120
- Overheat (Moltres): 50 damage at all tiers → 12/25/50
- Nerf Blizzard (Articuno): +100% → +30% damage if target already has freeze

# Changes to Items

- LUCKY_RIBBON: Remove 10 DEF, added 15 SHIELD. New effect: Holder now has 15% additional chance to dodge incoming attacks.
- Buff BERSERK_GENE: Confusion duration 3 → 1 second
- Revert MACH_RIBBON nerf from 6.9: 15 → 20 SPEED every 3 seconds
- FRIEND_BOW can now be held by Pokémon already NORMAL to benefit from the SHIELD base stats

# Gameplay

- LOCKED status now also prevents forced displacement (like Aquatic tidal wave or Fighting knockback)
- STORM weather: lighting falls more often and ELECTRIC Pokémon are supercharged when hit by lightning
- Item carousel phases in town have 5 seconds increased duration when there is a town encounter, to give more time to read and react

# Events

- Expeditions mission objectives have been tweaked based on player feedback

# Town Encounters

> Increasing the difficulty of the Diversify mission was not the way to go. Instead, we're looking at reducing the value and the accessibility of the best synergy fillers.

- Revert MISSION_ORDER_GREEN change from 6.9: reach 9 → 8 different active synergies
- Change MISSION_ORDER_PINK : reach 4 STAR STAR STAR Pokémon on board instead of 5
- MISSION_ORDER_GOLD is no longer proposed if stage 1 was a shiny PvE round
- New town encounter: Ludicolo

# UI

- New gadget: Smeargle's Palette, allowing you to customize the theme and colors of the game. 9 new themes are available at launch, with more to come in the future. Some themes are unlocked by getting specific titles.
- Items on item bench are now sorted by category, and categories are sorted by importance (e.g. special and shiny items first, berries at the end).
- Added a streak counter in the game UI next to life and money, showing the current win/loss streak.
- Added elo tab on profile menu with information about elo decay and max elo reached.
- Added Pokemon Auto Chess Twitch streams to the main lobby
- Added Game Activity tab in Meta Report showing game count trends over the last 30 days.
- Pokemon sprites size scaling based on max HP now decreases quadratically instead of linearly, to avoid sprites being too big at high HP values.

# Bugfix

- Lingering Aroma damage on hit now only applies to attackers at melee range as intended
- Fix Smeargle losing Sketch forever when copying and using Skill Swap
- Fix second dish lost when holding big eater belt and evolving
- Fix losing skill learned with Skill Swap TM when evolving
- A Gourmet Pokémon with a Chef Hat on the bench will now only distribute dishes to adjacent Pokémon on the bench as well

# Misc

- Added Twitch account verification and linking in Profile > Account, with secure OAuth flow.
- Added a Twitch stream panel in the main lobby to surface live PAC creators, including stream title, viewers, uptime, language/tags, and direct channel links.
- Added a new player Elo distribution report tab in Meta Report that shows the player rank distribution chart by Elo ranks.
- New gadget: Sprite Tracker, showing SpriteCollab entries missing in PAC with smart form filters, grouped normal/shiny previews, and direct links to SpriteCollab.
- Added a key shortcut to open the Meta Report (default M, can be changed in options)
- New title: Legionnaire, obtained by making a Falinks formation with 8 troopers or more.
- New accounts have their random starter Pokémon normal emotion already unlocked in their collection
- Thanks to John Rei, we have a new music in the jukebox and 3 alternate versions of the Treasure Town musics