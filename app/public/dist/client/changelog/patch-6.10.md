# New Pokemons:

- Quaxly
- Quaxwell
- Quaquaval
- Hisui Avalugg
- Komala
- Slither Wing


# Changes to Synergies

> This fairy rework is minor, the base effect of special damage on fairy attacks is unchanged, but the added random effects are fun and thematic for fairy. This is also a first attempt of a "build your own synergy" with 256 different combinations of wands.

- Fairy rework: Fairy Pokémon use wands to deal additional special damage and various effects with their attacks. Pick one of 3 wands at each stage of Fairy. 12 wands have been added, each with their own unique effect conditionned by luck. Fairy 8 now also gives 20 Luck to all fairy.
- Change to Flying: the selection of the destination cell when flying away is now smarter: it now considers the farthest free cells with at least one enemy at attack range, and the minimum of threats around.
- Dark melee Pokémon have increased priority movement for their first jump. That means they land their first attack slightly faster (-200ms on average), but this also prevents the opponent backline to move and leave a gap for assassins to infiltrate.

# Changes to Pokemon & Abilities

- Roost (Pidove), Firestarter (Fletchling) and Plasma Tempest (Rotom Fan) now uses the new smarter flying away logic. These abilities also proc the protection and aggro reset effect from Flying synergy if active when doing so.
- Changed Tropius Dish to Nanab berry: once below 50%HP, heal 50HP and give 1 gold


> Required preemptive nerf due to some interactions with wands that love high speed backline attackers

- Nerf Geomancy (Xerneas): Speed 20 → 15

> Trying to tone down the grass/flora composition by making most flower pots Pokémon not benefitting from the grass healing. We hope it will make you consider new Flora comps where Grass is no longer mandatory.

- Hoppip line: remove Grass type ; Attack: 4/8/12 → 5/10/15
- Chikorita: Flora/Grass → Flora/Grass/Fairy ; PP 90 → 100
- Oddish: remove Grass type; HP 80/150/230 → 80/150/250
- Bellossom: remove Grass type ; HP: 250 → 300

- Bagon line is now regional in Dragon/Monster regions
- Deino line is no longer regional


# Changes to Items

- Lucky Ribbon: Remove 10 DEF, added 15 SHIELD. New effect: Holder now has 15% additional chance to dodge incoming attacks.

# Gameplay

- Locked status now also prevents forced displacement (like Aquatic tidal wave or Fighting knockback)

# Events

- Expeditions mission selection has been tweaked based on player feedback

# UI

- New gadget: Smeargle's Palette, allowing you to customize the theme and colors of the game. 8 new themes are available at launch, with more to come in the future. Some themes are unlocked by getting specific titles.
- Items on item bench are now sorted by category, and categories are sorted by importance (e.g. special and shiny items first, berries at the end).
- Added elo tab on profile menu with information about elo decay and max elo reached.
- Added Pokemon Auto Chess Twitch streams to the main lobby
- Pokemon sprites size scaling based on max HP now decreases quadratically instead of linearly, to avoid sprites being too big at high HP values.
- Added Game Activity tab in Meta Report showing game count trends over the last 30 days.


# Bugfix

# Misc

- Added Twitch account verification and linking in Profile > Account, with secure OAuth flow.
- Added a Twitch stream panel in the main lobby to surface live PAC creators, including stream title, viewers, uptime, language/tags, and direct channel links.
- Added a new Player Report tab in Meta Report with a player rank distribution chart by Elo buckets.
- New gadget: Sprite Tracker, showing SpriteCollab entries missing in PAC with smart form filters, grouped normal/shiny previews, and direct links to SpriteCollab.
