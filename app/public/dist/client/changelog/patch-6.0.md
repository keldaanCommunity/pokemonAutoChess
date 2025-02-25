# New Pokemons

- Nacli
- Naclstack
- Garnacl
- Capsakid
- Scovillain
- Swirlix
- Slurpuff
- Gulpin
- Swalot
- Galarian Farfetch'd
- Dipplin
- Flapple
- Hydrapple
- Fidough
- Dachsbun
- Milcery
- Alcremie (Vanilla, Ruby, Matcha, Mint, Lemon, Salted, Ruby Swirl, Caramel Swirl, Rainbow Swirl)

# Changes to Pokemon & Abilities

- Lickitung line is now Wild/Normal/Gourmet
- Sinistea line is now Ghost/Artificial/Gourmet
- Vanillite line is now Ice/Amorphous/Gourmet
- Bounsweet line is now Grass/Fighting/Gourmet
- Combee line is now Bug/Flora/Gourmet
- Munchlax is now Normal/Baby/Gourmet
- Snorlax is now Normal/Gourmet/Monster
- Munchlax line passive changed: now also gain permanent HP by eating dishes and cooking
- Applin line is now Dragon/Grass/Gourmet, with a new ability
- Cherubi line is now Flora/Light/Gourmet
- Tropius is now Grass/Gourmet/Flying; passive changed to Signature Dish
- Shuckle is now Bug/Rock/Gourmet; passive changed to Signature Dish
- Farfetch'd is now Flying/Gourmet/Normal
- Miltank is now Normal/Gourmet/Field
- Spinda is now Normal/Gourmet
- Guzzlord is now Gourmet/Dark/Monster and has a new passive
- Leafeon is no longer Flora
- Vaporeon is no longer Amorphous
- Flareon is no longer Light
- Sylveon is no longer Sound
- Buff Vulpix line andd Alolan Vulpix line: PP 85 → 80 : Aurora Veil Rune protect duration 0.5 → 1 second
- Nerf Teatime (Polteageist): healing 20/40/80 → 15/30/60
- Buff Houndour line: PP 125 → 110
- Buff Topsy Turvy (Inkay): also reverse AP buffs
- Nerf Inteleon: Snipe shot damage 40/80/160 → 40/80/120
- Nerf Stantler: HP 200 → 180, Def/Spedef: 5 → 3 (6 post def/spedef stat change)
- Nerf Miltank: HP 250 → 200
- Nerf Spinda: HP 250 → 200
- Nerf Burmy line: Burmy now has various defense stats based on its cloak: Plant Cloak < Sand Cloak < Trash Cloak
- Buff Melmetal: increase Attack speed/Attack ratio: 10% attack speed = ~~3~~ 5 attack
- Rework Fuecoco line: now 3-range with nerfed defense/special defense, ability Torch Song reworked, PP 100 → 60
- Porygon is now in Ultra category ; adjusted stats ; new passive Conversion: get the highest synergy of your opponent and its effects at the start of the fight.
- Change Unown-O: OVEN - Cook a random dish for all your pokemons next fight
- Nerf Cryogonal: PP 95 → 100, Freeze dry: remove AP scaling on the special defense part of the damage, explosive damage 40 + 150% spedef → 30 + 100% spe def
- Nerf Alolan Raichu: back to tier 3, gets the same stats as Raichu but keeps the additional psychic synergy
- Change HyperSpace Fury: now also reduces special defense evert hit
- Changed Heavy Slam (Aggron): Shield 10/20/40 → 15/30/60, remove AP scaling
- Buff Concrete Pillar (Conkeldurr) HP 300 → 400
- Rework Acrobatics: now move to a cell at good distance from its target. Move further away if not holding any item.
- Rework Glaive Rush (Frigibax): improves targeting when destination cell is occupied, deal special damage instead of physical, added animation

# Changes to Synergies

- New synergy Gourmet: Gourmet Pokémon can be equipped with a Chef's Hat. Chefs will cook up their Signature Dish between fights and feed adjacent allies, giving them various buffs and effects.
- Berry trees no longer change every time a berry is collected. Instead, they change when you change region.
- Wild now gives Speed at levels 2-4 and Attack at levels 6-8 instead of attack and movement speed at all levels

# Changes to Items

- New item category: Dishes ; Dishes are cooked by Gourmet chefs to give strong buffs to a Pokémon in the next fight. If not used by the end of the timer, the cook or another random ally will eat it.
- More than 20 dishes have been added to the game
- Nerf Pokerus: effect applies every ~~2~~ 2.5 seconds
- Buff Swift Wing: 25 → 30% attack speed
- Minor nerf to Repeat Ball: legendaries are found afer ~~140~~ 150 rolls
- Adjusted berries:
    - Aguav: restore ~~to max HP~~ 50% HP
    - Chesto: give ~~+15~~ +50 AP
    - Sitrus: buff healing by ~~50%~~ 30%

# Gameplay

- Attack speed, move speed and ability cooldowns have all been merged into one statistic: Speed. 1 Speed = 1% attack speed in previous patch. Pokemons now have a different base speed as part of their stats, taken from their base game stats. Many attack and max PP stats have been adjusted to compensate for the difference of base speed.
- Defense and special defense stats have all been doubled, and damage reduction formula changed to `1/(1+def/20)` instead of `1/(1+def/10)`. This will allow more precise number tweaking in the future.
- Added regional variants for Unique and Legendary Pokémon. The first regional variant unique is Galarian Farfetch'd, which can be found in Fighting regions. Galarian Moltres, Zapdos and Articuno are now regional variants as well
- Regional variants are no longer found in maps with common synergies between the variant and the original Pokémon
- When an effect is considering the strongest Pokémon, or the pokémon with the highest stat, if several Pokémon are equal, it now selects a random Pokémon among those. Before, it was based on board position. This is especially relevant for Ghost curses.
- Farthest reachable target algorithm has been improved to favor the farthest target when there are multiple equidistant free cells. This impacts several abilities and effects, such as Comet Shard and all dashers abilities
- PVE rewards from stage 24 onwards now propose 1 synergy stone maximum
- Regular item carousels now propose 4 synergy stones maximum
- Weather Windy and Snow now impacts speed instead of movement speed

# UI

- Added anti-aliasing in Interface options
- Artificial items are now automatically dropped when benching the unit that was holding them.
- Added search bar in Wiki > Abilities
- Disabled right click browser menu when in game
- Added player add picks and regional picks info when spectating

# Bugfix

# Misc

- Quick play and custom lobbies no longer guarantee +1 minimum elo gain when top 1. Ranked games still do.
- Added experience required per level in Wiki > Data
- ELO decay now starts after 15 days of inactivity instead of 10