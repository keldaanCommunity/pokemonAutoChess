# Pokemon Auto Chess — Codebase Architecture Reference
## For RL Bot Development

---

## 1. GAME LOOP — Rounds, Phases, Combat

### Phase State Machine

Three phases defined in `app/types/enum/Game.ts:21-25`:

```
PICK  → Players select Pokemon/items from propositions
FIGHT → Combat simulations execute
TOWN  → Carousel mini-games (item/portal selection)
```

### Phase Flow

```
START → TOWN (Carousel stage 0)
          ↓
        PICK (20-50 seconds depending on stage)
          ↓
        FIGHT (45 seconds max)
          ↓
      Carousel stage? ──YES──→ TOWN
          │
          NO
          ↓
        PICK (repeat)
          ↓
      ... until 1 player alive
```

### Key Files

| Component | File | Lines |
|-----------|------|-------|
| Phase enum | `app/types/enum/Game.ts` | 21-25 |
| Game state | `app/rooms/states/game-state.ts` | 31-96 |
| Game room entry | `app/rooms/game-room.ts` | 606-623 |
| Main update loop | `app/rooms/commands/game-commands.ts` | 995-1032 |
| Phase transitions | `app/rooms/commands/game-commands.ts` | 1034-1060 |
| Pick phase init | `app/rooms/commands/game-commands.ts` | 1320-1399 |
| Pick phase stop | `app/rooms/commands/game-commands.ts` | 1700-1721 |
| Fight phase init | `app/rooms/commands/game-commands.ts` | 1854-1968 |
| Fight phase stop | `app/rooms/commands/game-commands.ts` | 1723-1809 |
| Town phase init | `app/rooms/commands/game-commands.ts` | 1818-1852 |
| Death check | `app/rooms/commands/game-commands.ts` | 1297-1318 |
| End game check | `app/rooms/commands/game-commands.ts` | 1208-1235 |
| Income computation | `app/rooms/commands/game-commands.ts` | 1262-1295 |
| Combat simulation | `app/core/simulation.ts` | 1415-1509, 1533-1645 |
| Timing config | `app/config/game/stages.ts` | 1-23 |

### Main Update Loop (`OnUpdateCommand.execute()`)

Every frame (`app/rooms/commands/game-commands.ts:995-1032`):
1. Decrements `state.time` by deltaTime
2. Updates displayed `roundTime` every second
3. When `time < 0` → sets `updatePhaseNeeded = true`
4. During FIGHT: calls `simulation.update(deltaTime)` on each battle
5. When all simulations finish → 3 second victory pause → phase change
6. Dispatches `OnUpdatePhaseCommand` to transition phases

### Combat Resolution (`app/core/simulation.ts`)

- `Simulation.update(dt)` (line 1415): Updates all Pokemon entities each frame
- Each Pokemon calls its own `update(dt, board, player)`
- Battle ends when one team has 0 Pokemon remaining
- `Simulation.onFinish()` (line 1533): Determines winner, applies damage to loser, awards gold to winner

### After Each Fight (`stopFightingPhase`)

1. Finishes all simulations
2. Computes streaks and achievements
3. Checks for player deaths (HP <= 0)
4. Checks for game end (1 player alive)
5. Increments stage level
6. Computes income (interest + streak + base 5g)
7. Refreshes shops for next round

---

## 2. SHOP LOGIC — Unit Offering & Purchasing

### Shop Pool Architecture

**Shared game-wide pool** (`app/models/shop.ts:199-220`):
- One `Shop` instance per game (`app/rooms/states/game-state.ts:56`)
- 5 rarity pools: `commonPool`, `uncommonPool`, `rarePool`, `epicPool`, `ultraPool`

**Pool sizes** (`app/config/game/pools.ts:4-14`):

| Rarity | Copies per Pokemon |
|--------|-------------------|
| COMMON | 27 |
| UNCOMMON | 22 |
| RARE | 18 |
| EPIC | 14 |
| ULTRA | 10 |
| UNIQUE | 1 (carousel only) |
| LEGENDARY | 1 (carousel only) |

**Per-player regional pools** (`app/models/colyseus-models/player.ts:139-143`):
- Each player has regional variant storage per rarity

### Shop Generation

`assignShop(player, manualRefresh, state)` (`app/models/shop.ts:335-367`):
1. Releases current shop Pokemon back to pools
2. Checks for Unown shop condition
3. Generates 6 new Pokemon via `pickPokemon()` per slot

**Shop size**: Always 6 (`app/config/game/shop.ts:3`)

### Rarity Probabilities by Level

`RarityProbabilityPerLevel` (`app/config/game/shop.ts:56-66`):

| Level | Common | Uncommon | Rare | Epic | Ultra |
|-------|--------|----------|------|------|-------|
| 1-2 | 100% | 0% | 0% | 0% | 0% |
| 3 | 70% | 30% | 0% | 0% | 0% |
| 4 | 50% | 40% | 10% | 0% | 0% |
| 5 | 36% | 42% | 20% | 2% | 0% |
| 6 | 25% | 40% | 30% | 5% | 0% |
| 7 | 16% | 33% | 35% | 15% | 1% |
| 8 | 11% | 27% | 35% | 22% | 5% |
| 9 | 5% | 20% | 35% | 30% | 10% |

### Buy Prices

`RarityCost` (`app/config/game/shop.ts:20-30`):

| Rarity | Cost |
|--------|------|
| COMMON | 1g |
| UNCOMMON | 2g |
| RARE | 3g |
| EPIC | 4g |
| ULTRA | 5g |
| UNIQUE | 10g |
| LEGENDARY | 20g |

Special: DITTO=5g, FALINKS_TROOPER=3g, UNOWN=1g, MELTAN=0g

### Buy Command

`OnBuyPokemonCommand` (`app/rooms/commands/game-commands.ts:130-186`):
- Requires: `player.money >= cost` AND bench space available
- Gold deducted immediately on purchase
- Pokemon added to board, `onAcquired(player)` triggers item effects

### Sell Mechanics

`OnSellPokemonCommand` (`app/rooms/commands/game-commands.ts:847-882`):
- Sell price: `RarityCost[rarity] * stars` (with exceptions)
- Pokemon released back to shared pool
- Items dropped to player inventory
- Cannot sell during FIGHT phase unless on bench

### Reroll

`OnShopRerollCommand` (`app/rooms/commands/game-commands.ts:884-906`):
- Cost: 1 gold (or free if `shopFreeRolls > 0`)
- Free rolls from: Unown shop, Repeat Ball items

### Shop Lock

`OnLockCommand` (`app/rooms/commands/game-commands.ts:908-914`):
- Toggles `player.shopLocked`
- When locked: only empty/DEFAULT slots refilled, purchased Pokemon kept

### Level Up

`OnLevelUpCommand` (`app/rooms/commands/game-commands.ts:930-946`):
- Cost: always 4 gold
- Adds 4 XP to player
- Max level: 9

### Experience Table

`ExpTable` (`app/config/game/experience.ts:7-17`):

| Level | XP Needed |
|-------|-----------|
| 2 | 2 |
| 3 | 6 |
| 4 | 10 |
| 5 | 22 |
| 6 | 34 |
| 7 | 52 |
| 8 | 72 |
| 9 | 255 |

Auto XP: +2 per stage end

### Income Formula

`computeIncome()` (`app/rooms/commands/game-commands.ts:1262-1295`):
- **Base**: 5 gold
- **Interest**: `floor(gold / 10)` capped at `maxInterest` (default 5)
- **Streak bonus**: `max(5, player.streak)` for PvP rounds
- **Win bonus**: +1 gold for winning (PvP only)

---

## 3. BOT INTERFACE — How Existing Bots Work

### Critical Finding: Bots Are Scripted, Not AI

Current bots follow **pre-scripted scenarios** loaded from MongoDB. They do NOT make real-time decisions.

### Bot Architecture

**Core files:**
- `app/core/bot.ts` (104 lines) — Bot class
- `app/core/bot-manager.ts` (20 lines) — Manages all bots
- `app/core/bot-logic.ts` (311 lines) — Validation and ELO estimation
- `app/models/mongo-models/bot-v2.ts` (122 lines) — Database model

### How Bots Connect

`app/rooms/game-room.ts:264-279`:
- Bots created as `Player` objects with `isBot = true`, `role = Role.BOT`
- Registered via `state.botManager.addBot(player)`
- Updated every phase via `state.botManager.updateBots()`

### Bot Data Model

```typescript
interface IBot {
  avatar: string        // Pokemon avatar
  author: string        // Creator name
  elo: number          // Skill estimate (500-1400)
  steps: IStep[]       // 31 stages (0-30)
  name: string
  id: string
  approved: boolean
}

interface IStep {
  board: IDetailledPokemon[]  // Pokemon lineup
  roundsRequired: number      // Rounds before advancing
}

interface IDetailledPokemon {
  name: Pkm            // Species
  x: number            // Board X (0-7)
  y: number            // Board Y (0-3)
  items: Item[]        // Equipped items
  emotion?: Emotion
  shiny?: boolean
}
```

### Bot Decision Flow

1. `bot.initialize()` — Loads scenario from MongoDB
2. `bot.updateProgress()` — Called each phase, increments progress counter
3. When stage threshold met → advances to next step
4. `bot.updatePlayerTeam()` — Clears board, spawns pre-determined Pokemon with items

### What Bots CANNOT Do

Bots are excluded from: buying, selling, dragging Pokemon, leveling up, locking shop, using items, refreshing shop. All these commands check `if (player.isBot) return`.

### Bot Difficulty Tiers

`app/rooms/commands/preparation-commands.ts:718-795`:

| Difficulty | ELO Range |
|-----------|-----------|
| EASY | < 800 |
| MEDIUM | 800-1100 |
| HARD | 1100-1400 |
| EXTREME | >= 1400 |

### RL Opportunity

The current bot interface is purely scripted. To build RL:
- You'd need to implement reactive decision-making (buy/sell/position)
- The Player object already exposes all necessary observation data
- Commands exist for all actions (buy, sell, level, refresh, drag, lock)
- The bot exclusion checks would need to be removed/modified for your RL agent

---

## 4. STATE OBJECTS — Board, Bench, Items, Gold, Synergies

### Board Representation

**Config** (`app/config/game/board.ts:1-18`):
- `BOARD_WIDTH = 8`, `BOARD_HEIGHT = 6`
- `BOARD_SIDE_HEIGHT = 4` (playable area)

**Storage** (`app/models/colyseus-models/player.ts:84`):
```typescript
@type({ map: Pokemon }) board = new MapSchema<Pokemon>()
```
- Single MapSchema holds both board AND bench Pokemon
- Bench = Y position 0
- Board = Y positions 1-5
- Not placed = X=-1, Y=-1

**Battle board** (`app/core/board.ts:11-94`):
- Separate `Board` class for combat simulation
- `cells: Array<PokemonEntity | undefined>` — flat array indexed by `y * columns + x`

### Pokemon State

`app/models/colyseus-models/pokemon.ts:63-116`:

```
id, name, index, shiny            — Identity
positionX, positionY              — Board position
atk, hp, maxHP, def, speDef       — Combat stats
shield, speed, range, luck        — Secondary stats
critChance, critPower             — Crit stats
skill, passive                    — Abilities
pp, maxPP, ap                     — Ability power/mana
items (SetSchema<Item>)           — Held items
types (SetSchema<Synergy>)        — Type synergies
rarity                            — Rarity tier
stars (1-3)                       — Star level
evolution                         — Next evolution
action                            — Current action state
```

### Item System

**Item enum** (`app/types/enum/Item.ts:6-305`): 300+ items

**9 base components** (`app/types/enum/Item.ts:445-464`):
FOSSIL_STONE, MYSTIC_WATER, MAGNET, BLACK_GLASSES, TWISTED_SPOON, CHARCOAL, HEART_SCALE, MIRACLE_SEED, NEVER_MELT_ICE, SILK_SCARF

**Recipes** (`app/types/enum/Item.ts:467-523`):
- ~50 craftable items, each from 2 base components
- Example: `CHOICE_SPECS = [TWISTED_SPOON, TWISTED_SPOON]`

**Item holding**: Pokemon hold items via `SetSchema<Item>` (no duplicates)

**Player inventory**: `player.items = ArraySchema<Item>()` — unequipped items

### Gold/Economy

- Starting gold: 5 (999 in dev mode)
- `player.money` (`uint16`) at `player.ts:88`
- Interest: `floor(gold/10)` capped at 5 (modifiable by items)
- Income = base(5) + interest + streak bonus
- Level up cost: always 4g
- Reroll cost: 1g (or free with shopFreeRolls)

### Synergy System

**31 synergies** (`app/types/enum/Synergy.ts:1-33`):
NORMAL, FLYING, FIELD, DARK, GROUND, PSYCHIC, GRASS, BUG, WATER, AQUATIC, POISON, FAIRY, FIGHTING, FIRE, GHOST, ROCK, MONSTER, AMORPHOUS, WILD, SOUND, FLORA, STEEL, ELECTRIC, ICE, BABY, HUMAN, DRAGON, LIGHT, GOURMET, FOSSIL, ARTIFICIAL

**Triggers** (`app/config/game/synergies.ts:5-37`):
- Each synergy has activation thresholds (e.g., WATER[2,4,6,9], DRAGON[3,5,7])

**Computation** (`app/models/colyseus-models/synergies.ts:72-259`):
- `computeSynergies(board, bonusSynergies, specialGameRule)`
- Counts all Pokemon types on board (Y > 0 only, excludes bench)
- Dragon gets double-type bonus
- Items can add bonus synergies

**Player synergies** (`player.ts:87`):
```typescript
@type({ map: "uint8" }) synergies = new Synergies()
```

### Player State Summary

`app/models/colyseus-models/player.ts:78-836`:

| Property | Type | Purpose |
|----------|------|---------|
| `id` | string | Player ID |
| `name` | string | Display name |
| `life` | int16 | HP (starts at 100) |
| `alive` | boolean | Still in game? |
| `money` | uint16 | Gold |
| `board` | MapSchema<Pokemon> | All Pokemon (bench + board) |
| `shop` | ArraySchema<Pkm> | Current shop offerings |
| `shopLocked` | boolean | Shop locked? |
| `shopFreeRolls` | uint8 | Free rerolls available |
| `experienceManager` | ExperienceManager | Level/XP tracking |
| `synergies` | Synergies | Active synergy counts |
| `items` | ArraySchema<Item> | Inventory items |
| `effects` | Effects | Active synergy effects |
| `rank` | uint8 | Current placement |
| `streak` | int8 | Win/loss streak |
| `opponentId` | string | Current opponent |
| `history` | ArraySchema<HistoryItem> | Battle results |
| `boardSize` | uint8 | Active team count |
| `rerollCount` | uint16 | Total rerolls |
| `totalMoneyEarned` | uint16 | Cumulative gold |

---

## 5. GAME SPEED CONTROLS — Timers, Animation, Fast-Forward

### Phase Durations

`app/config/game/stages.ts`:

| Constant | Value | Purpose |
|----------|-------|---------|
| `StageDuration[n]` | 20-50s | Pick phase per stage |
| `FIGHTING_PHASE_DURATION` | 45000ms | Max combat time |
| `ITEM_CAROUSEL_BASE_DURATION` | 16000ms | Item carousel base |
| `PORTAL_CAROUSEL_BASE_DURATION` | 23000ms | Portal carousel base |

Carousel duration adjusted: `+2000ms per alive player` (except stage 4)

### Simulation Tick

`app/config/server/network.ts:12`:
- `MAX_SIMULATION_DELTA_TIME = 50` — 50ms max per frame (prevents lag desync)
- Game loop: `setSimulationInterval()` in `game-room.ts:609`

### Attack Speed Formula

`app/core/attacking-state.ts:125`:
```
attackDuration = 1000 / (0.4 + speed * 0.007)
```

| Speed Stat | Attack Duration |
|-----------|----------------|
| 0 | 2500ms |
| 50 (default) | 1333ms |
| 100 | 909ms |
| 200 | 556ms |
| 300 | 385ms |

### Movement Speed

`app/core/pokemon-entity.ts:1834`:
```
moveSpeed = 0.5 + speed / 100
```

### Animation Frame Rates (Client-Side)

`app/public/src/game/animation-manager.ts`:
- `FPS_EFFECTS = 20` — Effect animations
- `FPS_POKEMON_ANIMS = 36` — Pokemon animations
- Per-Pokemon timing data in `app/types/delays.json`

### Default Combat Stats

`app/config/game/battle.ts`:
- `DEFAULT_SPEED = 50`
- `BASE_PROJECTILE_SPEED = 3`
- `DEFAULT_CRIT_CHANCE = 10`
- `DEFAULT_CRIT_POWER = 2`

### Victory Delay

After all simulations finish: `state.time = 3000` (3 second victory animation before phase transition)

### No Fast-Forward

There is **no built-in fast-forward or speed multiplier**. The simulation runs at real-time with deltaTime capped at 50ms. To speed up for RL training, you would need to:
1. Modify `MAX_SIMULATION_DELTA_TIME`
2. Or bypass the real-time loop entirely and step the simulation directly
3. Or run headless without animation delays

---

## 6. CRITICAL RL INTEGRATION POINTS

### Where to Hook In

1. **Bot replacement**: Modify `app/core/bot.ts` to accept real-time decisions instead of scripted scenarios
2. **Command interface**: All player actions go through commands in `app/rooms/commands/game-commands.ts`:
   - `OnBuyPokemonCommand` (line 130)
   - `OnSellPokemonCommand` (line 847)
   - `OnShopRerollCommand` (line 884)
   - `OnLevelUpCommand` (line 930)
   - `OnLockCommand` (line 908)
   - `OnDragDropPokemonCommand` — positioning

3. **Observation extraction**: Player state has everything needed:
   - Board state, shop contents, gold, HP, level, synergies, items, opponent history

4. **Reward signal**:
   - `Simulation.onFinish()` — win/loss/draw per round
   - Final placement (1-8) at game end
   - Gold earned, damage dealt metrics

### Action Space (from your bot)

Your websocket bot's action space maps roughly to:
- 0-5: Buy from shop slot
- 6: Refresh/reroll shop
- 7: Level up
- 8: Lock shop
- 9: End turn / do nothing
- 10-33: Move Pokemon (board positioning)
- 34-57: Sell Pokemon
- 58-63: Remove from shop
- 64-66: Pick from proposition
- 67-72: Combine/merge

### Observation Space

Key observations your bot should track:
- Phase, stage level, time remaining
- HP, gold, level, XP
- Board Pokemon (name, position, stars, items, stats)
- Shop contents
- Active synergies and counts
- Opponent info and battle history
- Available actions (action mask)
