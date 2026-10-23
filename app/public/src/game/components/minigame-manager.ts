import type { MapSchema } from "@colyseus/schema"
import { t } from "i18next"
import Phaser from "phaser"
import { NpcsConfig, TownEncounterSellPrice } from "../../../../config"
import type { NPC } from "../../../../config/game/town-encounters"
import type { FloatingItem } from "../../../../models/colyseus-models/floating-item"
import type { PokemonAvatarModel } from "../../../../models/colyseus-models/pokemon-avatar"
import type {
  Portal as PortalSchema,
  SynergySymbol as SynergySymbolSchema
} from "../../../../models/colyseus-models/portal"
import type GameState from "../../../../rooms/states/game-state"
import {
  type IFloatingItem,
  type IPokemonAvatar,
  type IPortal,
  type ISynergySymbol,
  Transfer
} from "../../../../types"
import { Orientation, PokemonActionState } from "../../../../types/enum/Game"
import type { PlayerDialog } from "../../../../types/enum/PlayerDialog"
import { Pkm } from "../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../types/enum/SpecialGameRule"
import {
  type TownEncounter,
  TownEncounters,
  TownEncountersList
} from "../../../../types/enum/TownEncounter"
import type { ILeaderboardInfo } from "../../../../types/interfaces/LeaderboardInfo"
import type { NpcDialog } from "../../../../types/strings/NpcDialog"
import { getRankLabel } from "../../../../types/strings/Strings"
import { getPokemonCustomFromAvatar } from "../../../../utils/avatar"
import { logger } from "../../../../utils/logger"
import { clamp } from "../../../../utils/number"
import {
  transformMiniGameXCoordinate,
  transformMiniGameYCoordinate
} from "../../pages/utils/utils"
import type AnimationManager from "../animation-manager"
import { DEPTH } from "../depths"
import type GameScene from "../scenes/game-scene"
import { FloatingItemContainer } from "./floating-item-container"
import { GameDialog } from "./game-dialog"
import PokemonAvatar from "./pokemon-avatar"
import PokemonNPC from "./pokemon-npc"
import { Portal, SynergySymbol } from "./portal"

export default class MinigameManager {
  pokemons: Map<string, PokemonAvatar>
  items: Map<string, FloatingItemContainer>
  portals: Map<string, Portal>
  symbols: Map<string, SynergySymbol>
  uid: string
  scene: GameScene
  display: boolean
  animationManager: AnimationManager
  villagers: PokemonNPC[] = []
  encounterDescription: GameDialog | null = null

  constructor(
    scene: GameScene,
    animationManager: AnimationManager,
    uid: string,
    existingState: GameState
  ) {
    this.pokemons = new Map<string, PokemonAvatar>()
    this.items = new Map<string, FloatingItemContainer>()
    this.portals = new Map<string, Portal>()
    this.symbols = new Map<string, SynergySymbol>()
    this.uid = uid
    this.scene = scene
    this.display = false
    this.animationManager = animationManager
    this.buildPokemons(existingState.avatars)
    this.buildItems(existingState.floatingItems)
    this.buildPortals(
      existingState.portals,
      existingState.symbols,
      existingState.avatars
    )

    this.scene.room?.onMessage(
      Transfer.NPC_DIALOG,
      (message: { npc: Pkm; dialog: NpcDialog }) => this.onNpcDialog(message)
    )
  }

  dispose() {
    this.villagers.forEach((villager) => {
      if (villager) {
        villager.destroy()
      }
    })
    this.villagers = []
    this.encounterDescription?.destroy()
  }

  update() {
    const interpolatePosition =
      (min = 0.2, max = min, acceleration = 100) =>
      (item) => {
        if (!item.data) return
        const { serverX, serverY } = item.data.values
        item.x = Phaser.Math.Linear(
          item.x,
          serverX,
          clamp(acceleration / Math.abs(serverX - item.x), min, max)
        )
        item.y = Phaser.Math.Linear(
          item.y,
          serverY,
          clamp(acceleration / Math.abs(serverY - item.y), 0.05, 0.25)
        )
      }
    this.pokemons.forEach(interpolatePosition(0.2))
    this.items.forEach(interpolatePosition(0.05, 0.25, 100))
    this.portals.forEach(interpolatePosition(0.05, 0.25, 100))
    this.symbols.forEach(interpolatePosition(0.02, 0.25, 50))
  }

  buildPokemons(avatars: MapSchema<PokemonAvatarModel, string>) {
    avatars.forEach((pkm) => {
      if (pkm.portalId === "") {
        // we dont show pokemon if it has already taken a portal
        this.addPokemon(pkm)
      }
    })
  }

  buildItems(items: MapSchema<FloatingItem, string>) {
    items.forEach((item) => {
      this.addItem(item)
    })
  }

  buildPortals(
    portals: MapSchema<PortalSchema, string>,
    symbols: MapSchema<SynergySymbolSchema, string>,
    avatars: MapSchema<PokemonAvatarModel, string>
  ) {
    const portalsTaken = new Set<string>()
    avatars.forEach((avatar) => {
      if (avatar.portalId) {
        portalsTaken.add(avatar.portalId)
      }
    })
    portals.forEach((portal) => {
      if (portalsTaken.has(portal.id) === false) {
        this.addPortal(portal)
      }
    })
    symbols.forEach((symbol) => {
      if (portalsTaken.has(symbol.portalId) === false) {
        this.addSymbol(symbol)
      }
    })
  }

  getVector(x: number, y: number) {
    const avatar = this.pokemons.get(this.uid)
    if (avatar) {
      return {
        x: x - avatar.x,
        y: y - avatar.y
      }
    } else {
      return { x: 0, y: 0 }
    }
  }

  /* Floating Items */

  addItem(item: IFloatingItem) {
    const it = new FloatingItemContainer(
      this,
      item.id,
      transformMiniGameXCoordinate(item.x),
      transformMiniGameYCoordinate(item.y),
      item.name
    )
    this.items.set(it.id, it)
  }

  removeItem(itemToRemove: IFloatingItem) {
    const itemUI = this.items.get(itemToRemove.id)
    if (itemUI) {
      itemUI.destroy()
    }
    this.items.delete(itemToRemove.id)
  }

  changeItem(item: IFloatingItem, field: string, value: string | number) {
    const itemUI = this.items.get(item.id)
    const coordinate =
      typeof value === "number" ? value : Number.parseFloat(value)
    if (itemUI) {
      switch (field) {
        case "x":
          itemUI.setData("serverX", transformMiniGameXCoordinate(coordinate))
          break

        case "y":
          itemUI.setData("serverY", transformMiniGameYCoordinate(coordinate))
          break

        case "avatarId":
          itemUI.onGrab(value)
      }
    }
  }

  /* Portals */
  addPortal(portal: IPortal) {
    const p = new Portal(
      this.scene,
      portal.id,
      transformMiniGameXCoordinate(portal.x),
      transformMiniGameYCoordinate(portal.y)
    )
    this.portals.set(p.id, p)
  }

  removePortal(portalToRemove: IPortal) {
    const portalUI = this.portals.get(portalToRemove.id)
    if (portalUI) {
      portalUI.destroy()
    }
    this.portals.delete(portalToRemove.id)
  }

  changePortal(portal: IPortal, field: string, value: string | number) {
    const portalUI = this.portals.get(portal.id)
    const coordinate =
      typeof value === "number" ? value : Number.parseFloat(value)
    if (portalUI) {
      switch (field) {
        case "x":
          portalUI.setData("serverX", transformMiniGameXCoordinate(coordinate))
          break

        case "y":
          portalUI.setData("serverY", transformMiniGameYCoordinate(coordinate))
          break

        case "avatarId":
          if (value != "" && typeof value === "string") {
            const avatar = this.pokemons.get(value)
            this.symbols.forEach((symbol) => {
              if (symbol.portalId === portal.id) {
                this.removeSymbol(symbol)
              }
            })
            this.scene.tweens.add({
              targets: [portalUI, avatar],
              x: portalUI.x,
              y: portalUI.y,
              scale: 0,
              duration: 800,
              ease: Phaser.Math.Easing.Sine.In
            })
          }
      }
    }
  }

  /* Synergy symbols */
  addSymbol(symbol: ISynergySymbol) {
    const s = new SynergySymbol(
      this.scene,
      symbol.id,
      transformMiniGameXCoordinate(symbol.x),
      transformMiniGameYCoordinate(symbol.y),
      symbol.synergy,
      symbol.portalId
    )
    this.symbols.set(s.id, s)
  }

  removeSymbol(symbolToRemove: ISynergySymbol) {
    const symbolUI = this.symbols.get(symbolToRemove.id)
    if (symbolUI) {
      symbolUI.destroy()
    }
    if (this.symbols.has(symbolToRemove.id)) {
      this.symbols.delete(symbolToRemove.id)
    }
  }

  changeSymbol(symbol: ISynergySymbol, field: string, value: string | number) {
    const symbolUI = this.symbols.get(symbol.id)
    const coordinate =
      typeof value === "number" ? value : Number.parseFloat(value)
    if (symbolUI) {
      switch (field) {
        case "x":
          symbolUI.setData("serverX", transformMiniGameXCoordinate(coordinate))
          break

        case "y":
          symbolUI.setData("serverY", transformMiniGameYCoordinate(coordinate))
          break

        case "portalId":
          symbolUI.portalId = value as string
          break
      }
    }
  }

  /* Pokemon avatars */

  addPokemon(pokemon: IPokemonAvatar) {
    const pokemonUI = new PokemonAvatar(
      this.scene,
      transformMiniGameXCoordinate(pokemon.x),
      transformMiniGameYCoordinate(pokemon.y),
      pokemon,
      pokemon.id
    )

    if (pokemonUI.isCurrentPlayerAvatar) {
      const arrowIndicator = this.scene.add
        .sprite(pokemonUI.x, pokemonUI.y - 70, "arrowDown")
        .setDepth(DEPTH.INDICATOR)
        .setScale(2)
      this.scene.tweens.add({
        targets: arrowIndicator,
        y: pokemonUI.y - 50,
        duration: 500,
        ease: Phaser.Math.Easing.Sine.InOut,
        loop: 5,
        yoyo: true,
        onComplete() {
          arrowIndicator.destroy()
        }
      })
    }

    this.animationManager.animatePokemon(pokemonUI, pokemon.action, false)
    this.pokemons.set(pokemonUI.playerId, pokemonUI)
  }

  removePokemon(pokemonToRemove: IPokemonAvatar) {
    const pokemonUI = this.pokemons.get(pokemonToRemove.id)
    if (pokemonUI) {
      pokemonUI.destroy()
    }
    this.pokemons.delete(pokemonToRemove.id)
  }

  changePokemon(pokemon: IPokemonAvatar, field: string, value) {
    const pokemonUI = this.pokemons.get(pokemon.id)
    if (pokemonUI) {
      switch (field) {
        case "orientation":
          pokemonUI.orientation = value
          this.animationManager.animatePokemon(
            pokemonUI,
            pokemonUI.action,
            false
          )
          break

        case "action":
          pokemonUI.action = value
          this.animationManager.animatePokemon(pokemonUI, value, false)
          break

        case "x":
          pokemonUI.setData("serverX", transformMiniGameXCoordinate(value))
          break

        case "y":
          pokemonUI.setData("serverY", transformMiniGameYCoordinate(value))
          break

        case "timer":
          if (pokemonUI instanceof PokemonAvatar) {
            pokemonUI.updateCircleTimer(value)
          }
          break
      }
    } else {
      logger.warn("cant find pokemon for id", pokemon.id)
    }
  }

  addVillagers(encounter: TownEncounter | null, podium: ILeaderboardInfo[]) {
    const cx = 980,
      cy = 404

    let npcs: NPC[]

    if (encounter === TownEncounters.AMPHAROS) {
      npcs = [TownEncounters.AMPHAROS]
    } else if (encounter === TownEncounters.DUSKNOIR) {
      npcs = [TownEncounters.DUSKNOIR]
    } else {
      npcs = [...TownEncountersList, "mareep"]
      const podiumPokemons = podium.map((p, rank) => {
        const { name, shiny } = getPokemonCustomFromAvatar(p.avatar)
        const champion = new PokemonNPC({
          scene: this.scene,
          x: 6.5 * 48 + [0, -64, +64][rank],
          y: 12.5 * 48,
          name,
          shiny,
          orientation: Orientation.DOWN,
          animation: PokemonActionState.IDLE,
          dialog: p.name,
          dialogTitle: getRankLabel(rank + 1)
        })
        champion.sprite.setDepth(DEPTH.POKEMON + (2 - rank)) //ensure top 1 is on top
        return champion
      })
      this.villagers.push(...podiumPokemons)
    }

    npcs.forEach((npc) => {
      const isEncounter = encounter === npc
      const npcsConfig = Array.isArray(NpcsConfig[npc])
        ? NpcsConfig[npc]
        : [NpcsConfig[npc]]
      npcsConfig.forEach((config, i) => {
        const npc = new PokemonNPC({
          scene: this.scene,
          x: isEncounter
            ? cx + 48 * (i - (npcsConfig.length - 1) / 2)
            : config.x,
          y: isEncounter ? cy : config.y,
          name: config.name,
          orientation: isEncounter ? Orientation.DOWN : config.orientation,
          animation:
            typeof config.animation === "function"
              ? config.animation(isEncounter)
              : (config.animation ?? PokemonActionState.IDLE)
        })
        this.villagers.push(npc)
        if (config.action && !isEncounter) {
          config.action(npc)
        }
      })
    })

    const specialGameRule = this.scene.room?.state?.specialGameRule
    if (encounter) {
      const cost =
        specialGameRule === SpecialGameRule.TOWN_FESTIVAL
          ? 0
          : TownEncounterSellPrice[encounter]
      this.showEncounterDescription(
        t(`town_encounter_description.${encounter}`, { cost })
      )
    } else if (specialGameRule && this.scene.room?.state.stageLevel === 0) {
      const smeargle = new PokemonNPC({
        scene: this.scene,
        x: cx,
        y: cy,
        name: Pkm.SMEARGLE
      })
      this.villagers.push(smeargle)
      this.showEncounterDescription(
        t(`scribble.${specialGameRule}`) +
          " - " +
          t(`scribble_description.${specialGameRule}`)
      )
    }
  }

  showEmote(id: string, emote: string) {
    const pokemonAvatar = this.pokemons.get(id)
    if (pokemonAvatar) {
      pokemonAvatar.action = PokemonActionState.EMOTE
      this.animationManager.animatePokemon(
        pokemonAvatar,
        PokemonActionState.EMOTE,
        false,
        false
      )
      if (emote.startsWith("player_dialog/")) {
        this.scene.board?.displayText(
          pokemonAvatar.x,
          pokemonAvatar.y - 10,
          t(
            `player_dialog.${emote.substring("player_dialog/".length) as PlayerDialog}`
          ),
          true
        )
      } else {
        pokemonAvatar.drawSpeechBubble(emote, false)
      }
    }
  }

  onNpcDialog({ npc, dialog, ...otherArgs }: { npc: Pkm; dialog: NpcDialog }) {
    const villager = this.villagers.find((pkm) => pkm.name === npc)
    if (villager) {
      if (dialog) {
        this.scene.board?.displayText(
          villager.x,
          villager.y - 10,
          t(`npc_dialog.${dialog}`, otherArgs),
          true
        )
      } else {
        villager.emoteAnimation()
      }
    }
  }

  showEncounterDescription(desc: string) {
    this.encounterDescription = new GameDialog({
      scene: this.scene,
      dialog: desc,
      extraClass: "town-encounter-description"
    })
      .setOrigin(0, 0)
      .setPosition(15 * 48, 15 * 48)
      .removeInteractive()
    // add to scene
    this.scene.add.existing(this.encounterDescription)
  }

  closeTooltips() {
    for (const it of this.items.values()) {
      it.closeDetail()
    }
  }
}
