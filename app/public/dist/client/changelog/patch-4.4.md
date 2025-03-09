# DB MIGRATION ACTIONS REQUIRED

- db-commands/update-pkm: Rename SHEDNINJA to SHENINJA
- Update Bots items: Replace ORAN_BERRY by KINGS_ROCK

# New Pokemons:

- Xurkitree
- Tandemaus/Maushold
- Kricketot/Kricketune
- Hippopotas/Hippodown
- Wingull/Pelipper
- Nihilego

# Changes to Pokemon & Abilities

- Magnet Rise Buff: ~~[1,2,4]~~ -> [2,4,6] protected allies
- Stun Spore Buff: now inflicts Paralysis and deal damage to all surrounding enemies
- Bellossom is now tier 4. No changes in stats, only ability damage
- Spinda: lost Sound & Human synergy, HP ~~200~~ 250, added AP scaling to its passive
- Nerf Woobat Attack ~~6~~ 5, Swoobat Attack ~~15~~ 12
- Buff Porygon2: HP ~~180~~ 200, Attack ~~14~~ 22
- Nerf PorygonZ: HP ~~333~~ 200
- Adjust Tri Attack: can now apply either Freeze for 2 seconds, Burn for 5 seconds or Paralysis for 5 seconds. Ability damage changed: ~~25/50/100~~ 30/50/70
- Buff Tornadus: Attack ~~15~~ 20 ; PP ~~100~~ 70
- Nincada is now an additional Epic. Evolve in both Sheninja and Ninjask
- Rework Lock-On (Genesect): Lock on the target. The next attack cannot miss, deal 100% (scales with AP) True Damage and apply Armor Break for 3 seconds
- Unown-T is now TREE: gives 3 random berries
- Slowbro now needs a King's Rock to evolve to Slowking
- Pokemons with "tree" status (Sudowoodo, Wobbuffet) cannot be silenced or lose PP until their bar is full
- Bonsly/Sudowoodo now cast their ability once they reach max PP for the first time
- Nerf Attack of Ratata and Spearow lines
- Nerf Castform rain: PP gain ~~20~~ 10
- Buff Sharpedo: HP ~~130~~ 150
- Buff Ultra-Necrozma: change tier to tier 4, get the same stats than Necrozma but with range 3 and Dragon synergy
- Nerf Uxie: PP ~~65~~ 80
- Buff Mesprit: Song of Desire now charms 2 enemies in the backline. Duration reduced ~~6~~ 3 seconds
- Buff Azelf: Confusing Mind now confuse 2 enemies in the backline. Duration reduced ~~6~~ 3 seconds
- Buff SlowPoke line: HP ~~75/130/260 ~~ 80/180/260, Def ~~2/3/4~~ 3/5/6
- Buff Weepinbell: HP ~~140~~ 160, Attack ~~9~~ 12
- Buff Duduo Attack ~~10~~12 and Dodrio Attack ~~24~~28
- Buff Marowak HP ~~220~~ 250
- Adjust Bounsweet Attack ~~8~~ 10, Steenie Attack ~~16~~ 20, PP ~~100~~ 120
- Buff Gorebyss Def ~~2~~ 5, SpeDef ~~2~~ 3
- Buff Waterfall (Totodile): now also clear negative status and board cell effect on cast
- Buff Dialga and Palkia PP: ~~150~~ 120
- New ability for Pichu line: Nuzzle: Dash to the farthest enemy target, dealing 30/60/120 special damage and paralyzing it for 3/4/5 seconds; - Adjusted max PP for Pichu line: ~~140~~ 100 ; Alolan Raichu ~~100~~ 80 PP
- Change Growl: now inflicts Flinch status intead of Wound
- Change Bite: now heals for 30% of real damage taken instead of 30% of ability damage. Now also inflicts Flinch for 5 seconds
- Buff Mudkip line: Attack ~~4/8/18~~ 5/9/20
- Buff Sandshrew/Sandslash: Attack ~~4/10~~ 5/13
- Buff Nosepass/Probopass: HP ~~60/120~~ 70/140
- Buff Shroomish/Breloom: HP ~~60/150~~ 70/170
- Buff Diglett/Dugtrio: Def ~~2/4~~ 3/5
- Rework Magic Bounce: now prevents damage and reflect 40 special damage. No longer silence the attacker
- Buff Maractus: Attack ~~12~~ 15
- Nerf Gligar/Gliscor HP: ~~160/200~~ 150/180
- Buff Applin/Appletun Attack ~~6/16~~ 8/22 ; Apple Acid def/spedef reduction: ~~3~~ 5
- All Eeveelutions are now 1-range
- Rework Shell trap (Shuckle): after the next Physical damage received, the trap explodes and deal [100,SP] damage to adjacent enemies
- Changed Shuckle PP ~~70~~ 100
- Buff Triple kick (Hitmontop) ~~50~~ 60 special damage
- Buff Iron Defense (Stakataka) ~~10/20/50~~ ~~20/40/80~~ shield

# Changes to Synergies

- Buff Grass: You get a berry tree that produces berries over time
- Buff Monster: Monster now have a chance to apply Flinch status for 2 seconds on attack
- Nerf Fairy: (6) Shock damage ~~60~~ 45 ; (8) Shock damage ~~80~~ 60

# Changes to Items

- Added Berries: 20 berries with unique effects
- Oran Berry is replaced by King's Rock
- PVE stages can no longer have duplicates in rewards, except stage 40
- Delta Orb effect can now be stacked, if you put a mon between two units with Delta orbs for example
- Nerf Shiny Charm: protect duration ~~3~~ 2 seconds
- Buff Shell Bell: ~~30~~ 33% heal
- Buff Choice Scarf: now pick the lowest life adjacent enemy for secondary target
- You can no longer put a synergy stone or combine a synergy stone on a mon that already has this synergy

# Changes to stages

- Nerf PVE stages round 2, 3 and 14, buffed stage 19 and 40
- PVE Stage 14 is now against Mewtwo
- Tower duo PVE Stage is moved to stage 19
- Giratina is added to PVE Stage 40 board

# Gameplay

- New status: Flinch: all incoming damage bypass Shield
- Like poison, the following status can now have their duration extended if applied again before the end of their initial duration: Armor Break, Burn, Silence, Wound, Paralysis, Rune Protect, Spike Armor, Magic Bounce.
- Negative status are cleared when the opposite team is eliminated
- The number of pokemons required to change these weathers has been reduced to 6: Snow, Storm, Sandstorm

# UI

- Added Animated map tiles
- Redesigned meta reports
- Change item sprites to higher definition versions
- Prevent pokemon ability animations to cancel before the end

# Bugfix

- Shadow Clone was using current HP and not max HP. Now also reduce max HP of clones
- Light spot was never on the front line
