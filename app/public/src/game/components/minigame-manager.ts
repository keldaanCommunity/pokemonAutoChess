import { t } from "i18next"
import {
  Emotion,
  IFloatingItem,
  IPokemonAvatar,
  IPortal,
  ISynergySymbol,
  Transfer
} from "../../../../types"
import { Orientation, PokemonActionState } from "../../../../types/enum/Game"
import { Pkm } from "../../../../types/enum/Pokemon"
import { logger } from "../../../../utils/logger"
import { clamp } from "../../../../utils/number"
import {
  transformMiniGameXCoordinate,
  transformMiniGameYCoordinate
} from "../../pages/utils/utils"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import { FloatingItem } from "./floating-item"
import PokemonAvatar from "./pokemon-avatar"
import PokemonSpecial from "./pokemon-special"
import { Portal, SynergySymbol } from "./portal"
import { DEPTH } from "../depths"
import {
  TownEncounter,
  TownEncounters,
  TownEncounterSellPrice
} from "../../../../core/town-encounters"
import { GameDialog } from "./game-dialog"
import { ILeaderboardInfo } from "../../../../types/interfaces/LeaderboardInfo"
import { getPokemonCustomFromAvatar } from "../../../../utils/avatar"
import { getRankLabel } from "../../../../types/strings/Strings"
import { SpecialGameRule } from "../../../../types/enum/SpecialGameRule"

export default class MinigameManager {
  pokemons: Map<string, PokemonAvatar>
  items: Map<string, FloatingItem>
  portals: Map<string, Portal>
  symbols: Map<string, SynergySymbol>
  uid: string
  scene: GameScene
  display: boolean
  animationManager: AnimationManager
  villagers: PokemonSpecial[] = []
  encounterDescription: GameDialog | null = null

  constructor(
    scene: GameScene,
    animationManager: AnimationManager,
    uid: string,
    avatars: Map<string, IPokemonAvatar>,
    items: Map<string, IFloatingItem>
  ) {
    this.pokemons = new Map<string, PokemonAvatar>()
    this.items = new Map<string, FloatingItem>()
    this.portals = new Map<string, Portal>()
    this.symbols = new Map<string, SynergySymbol>()
    this.uid = uid
    this.scene = scene
    this.display = false
    this.animationManager = animationManager
    this.buildPokemons(avatars)
    this.buildItems(items)
    this.scene.room?.onMessage(
      Transfer.NPC_DIALOG,
      (message: { npc: Pkm; dialog: string }) => this.onNpcDialog(message)
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

  buildPokemons(avatars: Map<string, IPokemonAvatar>) {
    avatars.forEach((pkm) => {
      this.addPokemon(pkm)
    })
  }

  buildItems(items: Map<string, IFloatingItem>) {
    items.forEach((item) => {
      this.addItem(item)
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
    const it = new FloatingItem(
      this.scene,
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
              if (symbol.getData("portalId") === portal.id) {
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
      symbol.synergy
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
          symbolUI.setData("portalId", value)
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
        .sprite(
          pokemonUI.x + pokemonUI.width / 2 - 16,
          pokemonUI.y - 70,
          "arrowDown"
        )
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

  addKecleon() {
    this.villagers.push(
      new PokemonSpecial({
        scene: this.scene,
        x: 1000,
        y: 408,
        name: Pkm.KECLEON,
        orientation: Orientation.DOWN,
        animation: PokemonActionState.IDLE,
        dialog: t("npc_dialog.tell_price"),
        dialogTitle: t("npc_dialog.welcome")
      })
    )
  }

  addVillagers(encounter: TownEncounter | null, podium: ILeaderboardInfo[]) {
    const cx = 964,
      cy = 404
    const kecleon = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.KECLEON ? cx - 24 : 34 * 48,
      y: encounter === TownEncounters.KECLEON ? cy : 5 * 48 + 4,
      name: Pkm.KECLEON
    })
    const kecleonShiny = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.KECLEON ? cx + 24 : 35 * 48,
      y: encounter === TownEncounters.KECLEON ? cy : 5 * 48 + 4,
      name: Pkm.KECLEON,
      shiny: true
    })

    const electivire = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.ELECTIVIRE ? cx : 6.5 * 48,
      y: encounter === TownEncounters.ELECTIVIRE ? cy : 7.5 * 48,
      name: Pkm.ELECTIVIRE
    })

    const chansey = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.CHANSEY ? cx : 2.5 * 48,
      y: encounter === TownEncounters.CHANSEY ? cy : 12 * 48,
      name: Pkm.CHANSEY
    })

    const kangaskhan = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.KANGASKHAN ? cx : 41 * 48,
      y: encounter === TownEncounters.KANGASKHAN ? cy : 6 * 48,
      name: Pkm.KANGASKHAN
    })

    const xatu = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.XATU ? cx : 6 * 48,
      y: encounter === TownEncounters.XATU ? cy : 21 * 48,
      name: Pkm.XATU
    })

    const duskull = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.DUSKULL ? cx : 18 * 48,
      y: encounter === TownEncounters.DUSKULL ? cy : 21.5 * 48,
      name: Pkm.DUSKULL
    })

    const regirock = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.REGIROCK ? cx : 24 * 48,
      y: encounter === TownEncounters.REGIROCK ? cy : 22 * 48,
      name: Pkm.REGIROCK
    })

    const marowak = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.MAROWAK ? cx : 41 * 48,
      y: encounter === TownEncounters.MAROWAK ? cy : 12 * 48,
      name: Pkm.MAROWAK
    })

    const wobbuffet = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.WOBBUFFET ? cx + 24 : 44.5 * 48,
      y: encounter === TownEncounters.WOBBUFFET ? cy : 18 * 48,
      name: Pkm.WOBBUFFET
    })

    const wynaut = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.WOBBUFFET ? cx - 24 : 43.5 * 48,
      y: encounter === TownEncounters.WOBBUFFET ? cy : 18 * 48,
      name: Pkm.WYNAUT
    })

    const spinda = new PokemonSpecial({
      scene: this.scene,
      x: encounter === TownEncounters.SPINDA ? cx : 38 * 48,
      y: encounter === TownEncounters.SPINDA ? cy : 18 * 48,
      name: Pkm.SPINDA
    })

    const mareep = new PokemonSpecial({
      scene: this.scene,
      x: 46 * 48,
      y: 2.5 * 48,
      name: Pkm.MAREEP,
      orientation: Orientation.DOWNLEFT,
      animation: PokemonActionState.EAT
    })

    const podiumPokemons = podium.map((p, rank) => {
      const { name, shiny } = getPokemonCustomFromAvatar(p.avatar)
      const champion = new PokemonSpecial({
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

    this.villagers.push(
      kecleon,
      kecleonShiny,
      electivire,
      chansey,
      kangaskhan,
      xatu,
      duskull,
      regirock,
      marowak,
      mareep,
      wobbuffet,
      wynaut,
      spinda,
      ...podiumPokemons
    )

    if (encounter) this.showEncounterDescription(encounter)
  }

  showEmote(id: string, emote: Emotion) {
    const pokemonAvatar = this.pokemons.get(id)
    if (pokemonAvatar) {
      pokemonAvatar.action = PokemonActionState.EMOTE
      this.animationManager.animatePokemon(
        pokemonAvatar,
        PokemonActionState.EMOTE,
        false,
        false
      )
      pokemonAvatar.drawSpeechBubble(emote, false)
    }
  }

  onNpcDialog({ npc, dialog }: { npc: Pkm; dialog: string }) {
    const villager = this.villagers.find((pkm) => pkm.name === npc)
    if (villager) {
      if (dialog) {
        this.scene.board?.displayText(villager.x, villager.y - 10, t(dialog))
      } else {
        villager.emoteAnimation()
      }
    }
  }

  showEncounterDescription(encounter: TownEncounter) {
    const specialGameRule = this.scene.room?.state.specialGameRule
    const cost =
      specialGameRule === SpecialGameRule.TOWN_FESTIVAL
        ? 0
        : TownEncounterSellPrice[encounter]
    this.encounterDescription = new GameDialog(
      this.scene,
      t(`town_encounter_description.${encounter}`, { cost }),
      undefined,
      "town-encounter-description"
    )
    this.encounterDescription
      .setOrigin(0, 0)
      .setPosition(15 * 48, 15 * 48)
      .removeInteractive()
    // add to scene
    this.scene.add.existing(this.encounterDescription)
  }
}
