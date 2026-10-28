# New Pokemons:

- Bombirdier
- Sandy Shocks

# Changes to Pokemon & Abilities

- New passive to Duosion and Reuniclus: Mitosis. Upon KO, the Pokémon will split into 2 copies of its previous stage of evolution with no items and half its current PP.
- Pirouette Meloetta no longer transforms to Aria Meloetta when put on bench
- Nerf Magic Bounce (Xatu): user gets SILENCE during the effect. Duration: 5 → 4 seconds
- Poison Gas Board effect change: POISON Pokémon are now immune
- Buff Carnivine: partial revert of the 6.8 nerf; Speed: 29 → 40
- Delibird is now ICE/FLYING/GOURMET instead of ICE/FLYING/FIELD ; New dish: LUCKY_EGG
- Rework Dondozo and Tatusigiri:
  - When swallowed by Dondozo, Tatsugiri now also provides 50 max HP in addition to its other stats buffs that depend on its form.
    - Tatsugiri HP: 80 → 50
    - Tatsugiri can no longer eat dishes
    - Tatsugiri no longer takes an item slot when swallowed by Dondozo. Instead it is addes as an _absorbed_ item. Absorbed items cannot be stolen or dropped during battle.
    - RICE now gives 50 max HP instead of 80 SHIELD
    - Change Order Up ability: Dondozo **and the allies who have eaten RICE** gain the bonus stats provided by its commander.
- Rework Lycanroc:
  - Lycanroc Day Form becomes the base form of Lycanroc when evolving Rockruff
    - Lycanroc can transform back to Day form on ZENITH weather
    - Lycanroc also transforms to Night Form on BLOODMOON in addition to NIGHT
    - Lycanroc transforms into Dusk Form on DROUGHT
    - Add FIRE type to Lycanroc Dusk Form
- Nerf Drum Beating (Grookey): removed AP scaling and ability crit on the team-wide speed buff part of the ability.
- Cascoon is no longer regional. Wurmple evolves into Cascoon if POISON synergy is active, or into Silcoon instead.
- Rework Bite: Deal [300,400,500,1000]% of user ATK as SPECIAL to the target and heal the user for [50,SP]% of the damage dealt
- Change ability of Totodile line to Bite instead of Crunch.
- Change ability of Larvitar line to Pursuit instead of Bite. Pursuit: Deal [35,70,140,280,SP] SPECIAL to the target and marks it. If the target subsequently jumps, teleports or FLY_AWAY, jump next to it and cast again immediately.
- Buff Bounsweet line: PP 120 → 90
- Rework Unown-D (DUPE): Transform into a copy of your STRONGEST ally without its items and permanent buffs. PP 100 → 50
- Change Unown-N (NUKE): No longer consume PP and trigger on-cast effects. Fixed SHIELD amount given not increasing with CRIT_POWER on crit. Clarified description. PP 100 → 80
- Change Unown-V (VOLT): No longer consume PP and trigger on-cast effects for each thunder shock. Clarified description. PP 90 → 60
- Change Unown-Y (YOGA): No longer consume PP and trigger on-cast effects. Clarified description.
- Nerf Attack Order (Vespiqueen): base damage [20,40,60,120] → [10,20,30,60] SPECIAL
- Buff Wartortle: DEF/SPE_DEF 3 → 4 ; Buff Blastoise: DEF/SPE_DEF 4 → 6, ATK 20 → 23
- Rework Nightmare (Ghastly): now applies damage to all enemies suffering from a negative status condition instead of just GHOST curse.
- Revert Cosmog and Cosmoem buffs from 6.7.5 and 6.8 HP : 100 → 140 ; Cosmoem HP: 200 → 220 ; evolutiion stacks required: 8 → 10 ; this is due to the increase of selling prices of evolved Pokémon.
- New ability for Paras: Scatters 3 spores around the nearest non POISONED enemy. After 2 seconds, it explodes on nearby ADJACENT enemies dealing [10,20,40,80,SP] SPECIAL, inflicting POISONED for 3s.
- New ability for Milotic: Creates an oceanic swirl around the largest 3x3 group of Pokémon. For 3 seconds, it heals allies in the area for [5,10,15,20,SP] HP and deals [3,6,9,12,SP] SPECIAL to enemies every 0.5 seconds. At the end of the duration, the swirl dissipates, leaving enemies in the area with CHARM for 1 second.
- New ability for Jirachi: Calls down 3 stars in succession, each targeting the ally with the lowest HP%. Each star takes 1.5 seconds to reach its target, and the next star appears as the previous one lands. On impact, grants [10,15,20,25,SP] SHIELD to ADJACENT allies, and applies BURN to ADJACENT enemies for 2 seconds.
- Nerf Alcremie Rainbow Swirl passive: 50 → 30 PP to the decorated ally
- Buff Alcremie Ruby passive: 30 → 40 SPEED to the decorated ally
- Change Alcremie Lemon passive: 40% CRIT_CHANCE → 30% CRIT_CHANCE and 30% CRIT_POWER to the decorated ally. DARK allies now give the Lemon flavor
- Change Alcremie Caramel passive: 80% CRIT_POWER → 80 AP to the decorated ally. SOUND allies now give the Caramel flavor
- New ability for Tentacruel: Stings with 3 waves of toxins in a CONE, dealing [1,2,3,4,SP] SPECIAL each. Each enemy hit receives one effect based on its current status:\n- If not POISONED, inflicts POISONED for [2,SP] seconds.\n- If afflicted with POISONED, inflicts PARALYSIS for [2,SP] seconds.\n- If afflicted with PARALYSIS, inflicts ARMOR_BREAK for [2,SP] seconds.\n- If afflicted with ARMOR_BREAK, inflicts FATIGUE for [2,SP] seconds.
# Changes to Synergies

- Synergies now have a more consistent order accross all places where they are displayed (synergy menu, game history, post-game screen, etc.). The order is based on the synergy level, then in case of tie on the synergy tier, then in case of tie on the amount of Pokémon representing that synergy. This order is also used to clarify the determination of some divergent evolutions (e.g. Meowstic, Gallade/Gardevoir) and some passives (Arceus, Kecleon).

- GOURMET cooking mechanic has been revisited. The cooking process now takes up to 8 seconds to complete, giving you time to move your chef around to properly distribute the dishes to your allies. If the battle is about to start, the cooking time will be reduced and even be instant on the last seconds of the preparation phase. Your chefs now cook immediately when receiving the CHEF_HAT. Dishes made this stage are now removed if the chef loses their hat by deactivating GOURMET synergy or benching the chef. This allows you to freely switch dishes between rounds without having to think one stage ahead.
- A GOURMET GROUND Pokémon can now dig and cook in the same stage. The cooking will be delayed until the Pokémon is done digging.
- Buff FLYING: now dodges the damage that would have dropped them below the HP threshold. Flying 8 Skydive damage: 150 → 200% of ATK

# Changes to Items

- Rework Casteliacone dish: In the next fight, get [30,LK]% chance to inflict FREEZE for 2 seconds ON_HIT. The first attack always FREEZE.
- Rework Whipped Dream dish: In the next fight, get [30,LK]% chance to inflict CHARM for 2 seconds ON_HIT. The first attack always CHARM.
- Rework Black Sludge: POISONED the Pokémon that eats it. If it has POISON type, restore 5% of max HP every 2 seconds instead. **In the next fight, get [30,LK]% chance to inflict POISONED for 5 seconds ON_HIT. The first attack always inflicts POISONED.**
- METEORITE and ROTOM_CATALOG now open a choice menu to directly choose the form instead of cycling through the forms.

# Gameplay

- Environmental effects (board effects, tidal wave, ghost curse...) are now displayed in DPS report with their own icon (thanks to tegberen)

# UI

- Teams displayed in post-game screen and game history are now ordered from strongest to weakest units
- The values for all tiers in ability descriptions can be shown during the game by pressing the Ctrl key
- You can now save teams from your game history as local files to load them later into your team planner
- Wiki Regions has been updated to allow filtering regions by synergy
- Added an option to disable custom cursors
- Added new keybindings to cycle between players by rank
- Added board effects descriptions in Wiki > Statuses
- Added Gift Shop stage description in Wiki > Stages
- Wiki now opens at the last tab you were on when you closed it
- Special, Unique and Legendary Pokémon in the shop now have the shimmer animation to be more noticeable

# Bugfix

- Grookey line now works properly with Electric triple attack effects
- Skill Swap now keeps the max PP of the target Pokémon on the next rounds after skill swap, as expected
- Cherubi pool size has been corrected to match the pool size of Pokémon with 2 stages of evolution
- Fixed AIR_BALLOON not giving immunity to several board effects
- Fixed Pokémon not losing their immunity to board effects if they lose their HEAVY_DUTY_BOOTS or AIR_BALLOON
- Fixed Fossil synergy effect shield based on current max HP instead of base max HP
- Fixed Light synergy effect attack buff based on current ATK instead of base ATK
- Fixed Porygon conversion passive on GHOST giving 2x more dodge chance than expected
- Fixed Monster flinch chance being ON_HIT instead of ON_ATTACK
- Fixed Palafin Hero not gaining a fourth STAR when transforming

# Misc

- The post game screen has new victory jingles made by John Rei
- Removed Bench is Lava scribble
- Add "Base" to the glossary of technical terms
- New title: Bodybuilder. Get a FIGHTING Pokémon to +40 ATK after training on the bench.
- New title: Guild Hero. Finish first on the Expeditions leaderboard at the end of the event.
- New title: Bestie. Finish first on Poképals leaderboard with your pal at the end of the event.
- Synergy meta report is now public
- Add FPS limiter option to settings
- Added Turkish translation (thanks to badblli)
