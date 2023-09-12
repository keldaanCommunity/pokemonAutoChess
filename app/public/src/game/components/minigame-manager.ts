import Pokemon from "./pokemon"
import { FloatingItem } from "./floating-item"
import {
  IFloatingItem,
  IPokemonAvatar,
  IPortal,
  ISynergySymbol
} from "../../../../types"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import {
  transformMiniGameXCoordinate,
  transformMiniGameYCoordinate
} from "../../pages/utils/utils"
import PokemonAvatar from "./pokemon-avatar"
import { Portal, SynergySymbol } from "./portal"
import { clamp } from "../../../../utils/number"
import { logger } from "../../../../utils/logger"

export default class MinigameManager {
  pokemons: Map<string, Pokemon>
  items: Map<string, FloatingItem>
  portals: Map<string, Portal>
  symbols: Map<string, SynergySymbol>
  uid: string
  scene: GameScene
  display: boolean
  animationManager: AnimationManager

  constructor(
    scene: GameScene,
    animationManager: AnimationManager,
    uid: string,
    avatars: Map<string, IPokemonAvatar>,
    items: Map<string, IFloatingItem>
  ) {
    this.pokemons = new Map<string, Pokemon>()
    this.items = new Map<string, FloatingItem>()
    this.portals = new Map<string, Portal>()
    this.symbols = new Map<string, SynergySymbol>()
    this.uid = uid
    this.scene = scene
    this.display = false
    this.animationManager = animationManager
    this.buildPokemons(avatars)
    this.buildItems(items)
    this.scene.events.on("update", () => this.update())
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

  buildPortals(portals: Map<string, IPortal>) {
    portals.forEach((portal) => {
      this.addPortal(portal)
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
      itemUI.destroy(true)
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
      portalUI.destroy(true)
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
          logger.debug("change portal.avatarId", value)
          if (value != "" && typeof value === "string") {
            const avatar = this.pokemons.get(value)
            logger.debug(
              `Player ${value} (${avatar?.playerId}) has taken portal ${portal.id}`
            )
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
      symbolUI.destroy(true)
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
      pokemon.id,
      this.animationManager
    )

    if (pokemonUI.isCurrentPlayerAvatar) {
      const arrowIndicator = this.scene.add
        .sprite(
          pokemonUI.x + pokemonUI.width / 2 - 16,
          pokemonUI.y - 70,
          "arrowDown"
        )
        .setDepth(10)
        .setScale(2)
      this.scene.tweens.add({
        targets: arrowIndicator,
        y: pokemonUI.y - 50,
        duration: 500,
        ease: Phaser.Math.Easing.Sine.InOut,
        loop: 3,
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
      pokemonUI.destroy(true)
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
}
