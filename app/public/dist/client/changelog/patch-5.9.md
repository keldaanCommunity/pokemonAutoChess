# New Pokemons:

- Terrakion
- Fletchling
- Fletchinder
- Talonflame
- Vullaby
- Mandibuzz
- Inkay
- Malamar
- Hisui Voltorb
- Hisui Electrode
- Timburr
- Gurdurr
- Conkeldurr

# Changes to Pokemon & Abilities

- Nerf Kecleon: PP 80 → 100
- Changed Shadow Clone (Shuppet): instead of taking an item from original Shuppet, steal a random item from the current target ; the clone spawns on the ~~farthest~~ closest available tile from the target
- Changed Nightmare (Gastly): Silence duration 1.5/3/6 → 1.5/2.5/5 seconds; All Pokémon suffering from ~~Flinch/Silence/Sleep~~ a Ghost curse take 40/80/150 special damage
- Alolan Marowak is now tier 2 ; adjusted stats to match Marowak's stats ; new ability: Shadow Bone
- Change Bonemerang (Marowak): ~~deal 30/60/90 special damage~~ deal 2 times 15/30/60 special damage
- Rework Maractus: now Grass/Sound/Flora, removed passive, PP 85 → 90
- Change Spike Armor (Onix, Maractus): when casting again before the end of the effect, throw spikes in all directions, dealing 30 special damage to all enemies hit
- Hisuian Typlosion is now tier 3 ; adjusted stats to match Typhlosion's stats
- Numel is now epic regional ; adjusted stats accordingly ; temporarely removed Mega Camerupt
- Houndour is now epic additional ; HP 85/150 → 90/160 ; temporely removed Mega Houndoom
- Skorupi is now epic additional ; adjusted stats accordingly
- Change Fennekin ability: Mystical Fire: deal 20/40/80 special damage to the target and reduce its special attack by 10
- Change Blue Flare (Reshiram): damage delay 1 second → 250ms, damage: ~~50 + 20 * fire synergy step~~ → 50 + 10 * fire synergy level
- Change Glaciate (Kyurem): damage delay 1 second → 250ms, damage: ~~50 + 20 * ice synergy step~~ → 50 + 10 * ice synergy level
- Change Fusion Bolt (Zekrom): damage delay 1 second → 250ms, damage: ~~50 + 40 * electric synergy step~~ → 50 + 10 * electric synergy level
- New ability for Spheal line: Ice Ball: Buff the Special Defense by 5 then deal special damage equal to 10/20/30 + 100/200/300% of Special Defense
- Buff Morgrem: Attack 11 → 12
- Buff Grimmsnarl: Attack 20 → 24
- Cosmic Power renamed to Cosmic Power (Moon)
- New ability for Solrock: Cosmic Power (Sun): buff base attack of allies by 25%
- New ability for Cosmoem: Teleport (same as Cosmog)
- New ability for Rotom Drone: Flash: adjacent enemies are blinded for 1.5/3/5 seconds
- Change Rock Smash (Anorith, Archen): inflict Armor Break instead of Silence, damage: 20/40/80 → 25/50/100
- New ability for Anorith line: Harden: gain 2/4/6 defense
- Change Heavy Slam (Aggron): base damage 10/20/40 → 15/30/60 ; HP diff damage scaling 1 → 0.5
- Nerf Ogerpon Teal mask: PP 80 → 100
- Buff Ogerpon Wellspring: passive PP gain: 10 → 20. Added AP scaling for PP gain
- Buff Ogerpon Hearthflame: passive burn duration 2 → 5 seconds
- Nerf Morpeko: Aura wheel cooldown: 100ms → 200ms
- Cobalion, Virizion and Keldeo are now Legendary ; adjusted stats accordingly.
- New ability for Cobalion: Sacred Sword of the Iron Will
- New ability for Virizion: Sacred Sword of the Grasslands
- Keldeo range: 2 → 1 ; New ability: Secret Sword
- Buff Mareep line: PP 110 → 100
- Nerf Psystrike (Mewtwo): damage 100 → 80
- Nerf Fiery Wrath (Galarian Moltres): damage 40 → 33
- Nerf Mega Sableye: HP 230 → 200
- Nerf Tsareena: PP 90 → 120
- Nerf Galar Corsola: now has the same stats than regular Corsola
- Nerf Cursola: HP 300 → 200
- Adjusted Curse (Cursola): curse duration 8/4 → 8/5/3 seconds

# Changes to Synergies

- Human rework: healing is now for Humans only, not for all allies ; healing: 15/30/60% → 25/40/60% ; Human 2 and 4 give a random TM, Human 6 gives a random HM
- Nerf Dark crit damage +60/80/100% → +30/40/50%
- Buff Electric 9: Triple attacks deal ~~10~~ 20 special damage to adjacent enemies
- Nerf Ghost 2: def/spedef debuff 5 → 2
- Nerf Ghost 4: atk debuff 30 → 25%

# Changes to Items

- Introducing Technical Machines (TM) and Hidden Machines (HM), that allow changing the ability of Human pokemons.
- Removed Amulet coin base stats
- Tiny mushroom now reduces health by 50% only if the holder is cloned
- Pokemons can now hold artificial items and Shiny Stone even if they give one of their existing synergies
- Max Revive is now consumed on use (stats are lost after resurrection)
- Item effects are now updated when items are gained or lost in battle
    - Stats and statuses are now lost when items are removed
    - Synergy effects and types are now added and removed accordingly
    - Stat increases from the synergy of an item are gained when added, but not lost when removed
- Change Gold Bottle Cap: Jackpot now doubles the amount of gold earned during this round instead of giving 5 gold. Show the stacks next to the item icon.

# Gameplay

- New status: Blinded: reduce accuracy of basic attacks by 50%. Replace the existing Smoke effect that was not considered a status.
- New rank system: 12 different ranks, each with a different icon (by @joinity). Beast ball and Master ball players will create ranked games with Ultra ball.
  - Level ball: 0 ELO
  - Net ball: 1050 ELO
  - Safari ball: 1100 ELO
  - Love ball: 1150 ELO
  - Premier ball: 1200 ELO
  - Quick ball: 1250 ELO
  - Poké ball: 1300 ELO
  - Super ball: 1350 ELO
  - Ultra ball: 1400 ELO
  - Master ball: 1500 ELO
  - Beast ball: 1700 ELO
- ELO, XP and titles after game are now distributed immediately after the player is eliminated and leaves the game, instead of waiting for the game to end
- PvE rounds no longer give additional income based on victory/defeat streaks
- Due to an increase of cases of intentional leaves at the start of a game, we have to increase the penalties for early disconnections. Intentional disconnections before stage 6 are no longer protected against Elo loss. Unintentional disconnections without reconnection within the next 3 minutes before stage 6 remain protected against Elo loss, but players won't be able to join a new game within the next 5 minutes.
- Adjusted bonus max HP and starting gold for "Do it all yourself!" scribble

# UI

- Added item components recipe on craftable items tooltip

# Bugfix

- Pokemon with passives that apply persistent effects now apply properly to spawns and resurrected pokemon.
- Weather effects now apply properly to spawns and resurrected pokemon.
- Light effects are no longer erroneously applied to spawns and resurrected pokemon.

# Misc
