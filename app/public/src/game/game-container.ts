import { SchemaCallbackProxy } from "@colyseus/schema"
import { getStateCallbacks, Room } from "colyseus.js"
import { t } from "i18next"
import Phaser from "phaser"
import MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin.js"
import OutlinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js"
import React from "react"
import { toast } from "react-toastify"
import { FLOWER_POTS_POSITIONS_BLUE } from "../../../core/flower-pots"
import { PokemonEntity } from "../../../core/pokemon-entity"
import Simulation from "../../../core/simulation"
import Count from "../../../models/colyseus-models/count"
import { FloatingItem } from "../../../models/colyseus-models/floating-item"
import Player from "../../../models/colyseus-models/player"
import { Pokemon } from "../../../models/colyseus-models/pokemon"
import { PokemonAvatarModel } from "../../../models/colyseus-models/pokemon-avatar"
import { Portal, SynergySymbol } from "../../../models/colyseus-models/portal"
import Status from "../../../models/colyseus-models/status"
import GameState from "../../../rooms/states/game-state"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  IPlayer,
  IPokemon,
  IPokemonEntity,
  Transfer
} from "../../../types"
import { Ability } from "../../../types/enum/Ability"
import {
  AttackType,
  GamePhaseState,
  HealType,
  Orientation,
  PokemonActionState,
  Rarity
} from "../../../types/enum/Game"
import { Weather } from "../../../types/enum/Weather"
import type { NonFunctionPropNames } from "../../../types/HelperTypes"
import { logger } from "../../../utils/logger"
import { clamp, max } from "../../../utils/number"
import { values } from "../../../utils/schemas"
import { getCachedPortrait } from "../pages/component/game/game-pokemon-portrait"
import { playSound, SOUNDS } from "../pages/utils/audio"
import { transformBoardCoordinates } from "../pages/utils/utils"
import { preference, subscribeToPreferences } from "../preferences"
import store from "../stores"
import { changePlayer, setPlayer, setSimulation } from "../stores/GameStore"
import { clearAbilityAnimations } from "./components/abilities-animations"
import { BoardMode } from "./components/board-manager"
import { DEPTH } from "./depths"
import GameScene from "./scenes/game-scene"

class GameContainer {
  room: Room<GameState>
  $: SchemaCallbackProxy<GameState>
  div: HTMLDivElement
  game: Phaser.Game | undefined
  player: Player | undefined
  simulation: Simulation | undefined
  uid: string
  spectate: boolean
  constructor(div: HTMLDivElement, uid: string, room: Room<GameState>) {
    this.room = room
    this.$ = getStateCallbacks(room)
    this.div = div
    this.uid = uid
    this.spectate = false
    this.initializeEvents()
  }

  resetSimulation() {
    this.simulation = undefined
    this.gameScene?.battle?.clear()
  }

  initializeSimulation(simulation: Simulation) {
    if (
      simulation.bluePlayerId === this.player?.id ||
      (simulation.redPlayerId === this.player?.id && !simulation.isGhostBattle)
    ) {
      this.setSimulation(simulation)
    }

    const $simulation = this.$<Simulation>(simulation)

    $simulation.listen("winnerId", (winnerId) => {
      if (this.gameScene?.board?.player.simulationId === simulation.id) {
        this.gameScene.board.victoryAnimation(winnerId)
      }
    })

    $simulation.listen("weather", (value, previousValue) => {
      this.handleWeatherChange(simulation, value)
    })

    for (const team of [$simulation.blueTeam, $simulation.redTeam]) {
      team.onAdd((p, key) =>
        this.initializePokemon(
          <PokemonEntity>p,
          simulation,
          team === $simulation.blueTeam
            ? simulation.bluePlayerId
            : simulation.redPlayerId
        )
      )
      team.onRemove((pokemon, key) => {
        // logger.debug('remove pokemon');
        this.gameScene?.battle?.removePokemon(simulation.id, pokemon)
      })
    }

    $simulation.listen("started", (value, previousValue) => {
      if (
        this.gameScene?.board?.player.simulationId === simulation.id &&
        value === true &&
        value !== previousValue
      ) {
        this.gameScene?.board?.removePokemonsOnBoard()
        this.gameScene?.battle?.onSimulationStart()
      }
    })
  }

  initializePokemon(
    pokemon: PokemonEntity,
    simulation: Simulation,
    playerId: string
  ) {
    this.gameScene?.battle?.addPokemonEntitySprite(
      simulation.id,
      pokemon,
      playerId
    )

    const $pokemon = this.$<PokemonEntity>(pokemon)

    const fields: (NonFunctionPropNames<PokemonEntity> &
      keyof IPokemonEntity)[] = [
      "positionX",
      "positionY",
      "orientation",
      "action",
      "critChance",
      "critPower",
      "ap",
      "luck",
      "speed",
      "hp",
      "maxHP",
      "shield",
      "pp",
      "atk",
      "def",
      "speDef",
      "range",
      "targetX",
      "targetY",
      "team",
      "index",
      "shiny",
      "skill",
      "stars",
      "types",
      "stacks",
      "stacksRequired"
    ]

    fields.forEach((field) => {
      $pokemon.listen(field, (value, previousValue) => {
        this.gameScene?.battle?.changePokemon(
          simulation.id,
          pokemon,
          field,
          value,
          previousValue
        )
      })
    })

    const statusFields: NonFunctionPropNames<Status>[] = [
      "armorReduction",
      "burn",
      "charm",
      "confusion",
      "curse",
      "curseVulnerability",
      "curseWeakness",
      "curseTorment",
      "curseFate",
      "electricField",
      "fairyField",
      "fatigue",
      "flinch",
      "freeze",
      "grassField",
      "paralysis",
      "pokerus",
      "poisonStacks",
      "protect",
      "skydiving",
      "psychicField",
      "resurrection",
      "resurrecting",
      "runeProtect",
      "silence",
      "sleep",
      "spikeArmor",
      "wound",
      "enraged",
      "possessed",
      "locked",
      "blinded",
      "magicBounce",
      "reflect",
      "tree"
    ]

    statusFields.forEach((field) => {
      $pokemon.status.listen(field, (value, previousValue) => {
        this.gameScene?.battle?.changeStatus(
          simulation.id,
          pokemon,
          field,
          previousValue
        )
      })
    })

    $pokemon.items.onChange((value, key) => {
      this.gameScene?.battle?.updatePokemonItems(simulation.id, pokemon)
    })

    const fieldsCount: NonFunctionPropNames<Count>[] = [
      "crit",
      "dodgeCount",
      "ult",
      "fieldCount",
      "fightingBlockCount",
      "fairyCritCount",
      "starDustCount",
      "spellBlockedCount",
      "manaBurnCount",
      "moneyCount",
      "amuletCoinCount",
      "bottleCapCount",
      "attackCount",
      "tripleAttackCount",
      "upgradeCount",
      "soulDewCount",
      "defensiveRibbonCount"
    ]

    fieldsCount.forEach((field) => {
      $pokemon.count.listen(field, (value, previousValue) => {
        this.gameScene?.battle?.changeCount(
          simulation.id,
          pokemon,
          field,
          value,
          previousValue
        )
      })
    })
  }

  initializeGame() {
    if (this.game != null) return // prevent initializing twice
    // Create Phaser game
    const renderer = Number(preference("renderer") ?? Phaser.AUTO)
    const config = {
      type: renderer,
      width: 1950,
      height: 1000,
      parent: this.div,
      pixelArt: true,
      scene: GameScene,
      scale: { mode: Phaser.Scale.FIT },
      dom: {
        createContainer: true
      },
      disableContextMenu: true,
      plugins: {
        global: [
          {
            key: "rexMoveTo",
            plugin: MoveToPlugin,
            start: true
          }
        ]
      }
    }
    this.game = new Phaser.Game(config)
    this.game.domContainer.style.zIndex = DEPTH.PHASER_DOM_CONTAINER.toString()
    this.game.scene.start("gameScene", {
      room: this.room,
      spectate: this.spectate
    })
    this.game.scale.on("resize", this.resize, this)
    if (this.game.renderer.type === Phaser.WEBGL) {
      this.game.plugins.install("rexOutline", OutlinePlugin, true)
    }
    const unsubscribeToPreferences = subscribeToPreferences(
      ({ antialiasing }) => {
        if (!this.game?.canvas) return
        this.game.canvas.style.imageRendering = antialiasing ? "" : "pixelated"
      },
      true
    )
    this.game.events.on("destroy", unsubscribeToPreferences)
  }

  resize() {
    const screenWidth = window.innerWidth - 60
    const screenHeight = window.innerHeight
    const screenRatio = screenWidth / screenHeight
    const IDEAL_WIDTH = 42 * 48
    const MIN_HEIGHT = 1050
    const MAX_HEIGHT = 32 * 48
    const height = clamp(IDEAL_WIDTH / screenRatio, MIN_HEIGHT, MAX_HEIGHT)
    const width = max(50 * 48)(height * screenRatio)

    if (
      this.game &&
      (this.game.scale.height !== height || this.game.scale.width !== width)
    ) {
      this.game.scale.setGameSize(width, height)
    }
  }

  initializeEvents() {
    this.room.onMessage(Transfer.DRAG_DROP_CANCEL, (message) =>
      this.handleDragDropCancel(message)
    )
    const $state = this.$<GameState>(this.room.state)
    $state.avatars.onAdd((avatar) => {
      const $avatar = this.$<PokemonAvatarModel>(avatar)
      this.gameScene?.minigameManager?.addPokemon(avatar)
      const fields: NonFunctionPropNames<PokemonAvatarModel>[] = [
        "x",
        "y",
        "action",
        "timer",
        "orientation"
      ]
      fields.forEach((field) => {
        $avatar.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changePokemon(avatar, field, value)
        })
      })
    })

    $state.avatars.onRemove((avatar, key) => {
      this.gameScene?.minigameManager?.removePokemon(avatar)
    })

    $state.floatingItems.onAdd((floatingItem) => {
      this.gameScene?.minigameManager?.addItem(floatingItem)
      const fields: NonFunctionPropNames<FloatingItem>[] = [
        "x",
        "y",
        "avatarId"
      ]
      const $floatingItem = this.$<FloatingItem>(floatingItem)
      fields.forEach((field) => {
        $floatingItem.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changeItem(
            floatingItem,
            field,
            value
          )
        })
      })
    })

    $state.floatingItems.onRemove((floatingItem, key) => {
      this.gameScene?.minigameManager?.removeItem(floatingItem)
    })

    $state.portals.onAdd((portal) => {
      this.gameScene?.minigameManager?.addPortal(portal)
      const $portal = this.$<Portal>(portal)
      const fields: NonFunctionPropNames<Portal>[] = ["x", "y", "avatarId"]

      fields.forEach((field) => {
        $portal.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changePortal(portal, field, value)
        })
      })
    })

    $state.portals.onRemove((portal, key) => {
      this.gameScene?.minigameManager?.removePortal(portal)
    })

    $state.symbols.onAdd((symbol) => {
      this.gameScene?.minigameManager?.addSymbol(symbol)
      const $symbol = this.$<SynergySymbol>(symbol)
      const fields: NonFunctionPropNames<SynergySymbol>[] = [
        "x",
        "y",
        "portalId"
      ]

      fields.forEach((field) => {
        $symbol.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changeSymbol(symbol, field, value)
        })
      })
    })

    $state.symbols.onRemove((symbol, key) => {
      this.gameScene?.minigameManager?.removeSymbol(symbol)
    })

    this.room.onError((err) => logger.error("room error", err))
  }

  initializePlayer(player: Player) {
    //logger.debug("initializePlayer", player, player.id)
    if (this.uid == player.id || (this.spectate && !this.player)) {
      this.room.send(Transfer.SPECTATE, this.uid) // always spectate yourself when loading the game initially
      this.setPlayer(player)
      this.initializeGame()
    }

    const listenForPokemonChanges = (
      pokemon: Pokemon,
      fields: NonFunctionPropNames<IPokemon>[] = [
        "positionX",
        "positionY",
        "action",
        "hp",
        "maxHP",
        "atk",
        "ap",
        "def",
        "speed",
        "luck",
        "shiny",
        "skill",
        "meal",
        "supercharged"
      ]
    ) => {
      const $pokemon = this.$<Pokemon>(pokemon)
      fields.forEach((field) => {
        $pokemon.listen(field, (value, previousValue) => {
          if (field && player.id === this.spectatedPlayerId) {
            this.gameScene?.board?.changePokemon(
              pokemon,
              field,
              value as IPokemon[typeof field],
              previousValue as IPokemon[typeof field]
            )
          }
        })
      })

      $pokemon.items.onChange((value, key) => {
        if (player.id === this.spectatedPlayerId) {
          this.gameScene?.board?.updatePokemonItems(player.id, pokemon, value)
        }
      })
    }

    const $player = this.$<Player>(player)

    $player.board.onAdd((pokemon, key) => {
      if (pokemon.stars > 1) {
        const i = React.createElement(
          "img",
          {
            src: getCachedPortrait(pokemon.index, player.pokemonCustoms)
          },
          null
        )
        toast(i, {
          containerId: player.rank.toString(),
          className: "toast-new-pokemon"
        })
      }

      listenForPokemonChanges(pokemon)
      this.handleBoardPokemonAdd(player, pokemon)
    }, false)

    $player.board.onRemove((pokemon, key) => {
      if (player.id === this.spectatedPlayerId) {
        this.gameScene?.board?.removePokemon(pokemon)
      }
    })

    $player.board.onChange((pokemon, key) => {
      store.dispatch(
        changePlayer({ id: player.id, field: "board", value: player.board })
      )
    })

    $player.items.onChange((value, key) => {
      if (player.id === this.spectatedPlayerId) {
        //logger.debug("changed", value, key, player.items)
        this.gameScene?.itemsContainer?.render(player.items)
      }
    })

    $player.synergies.onChange(() => {
      if (
        player.id === this.spectatedPlayerId &&
        this.gameScene?.board?.mode === BoardMode.PICK
      ) {
        this.gameScene?.board?.showLightCell()
        this.gameScene?.board?.renderBerryTrees()
        this.gameScene?.board?.renderFlowerPots()
      }
    })

    $player.flowerPots.onAdd((pokemon, index) => {
      listenForPokemonChanges(pokemon, ["hp", "ap"])
      const board = this.gameScene?.board
      if (
        board &&
        player.id === this.spectatedPlayerId &&
        this.gameScene?.board?.mode !== BoardMode.TOWN
      ) {
        board.renderFlowerPots()
        const [x, y] = FLOWER_POTS_POSITIONS_BLUE[index]
        const evolutionAnim = this.gameScene.add.sprite(
          x,
          y - 24,
          "abilities",
          "EVOLUTION/000.png"
        )
        evolutionAnim.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
          evolutionAnim.destroy()
        )
        evolutionAnim.setScale(2).setDepth(DEPTH.BOOST_BACK).play("EVOLUTION")
      }
    }, false)

    $player.flowerPots.onChange((pokemon, key) => {
      store.dispatch(
        changePlayer({
          id: player.id,
          field: "flowerPots",
          value: player.flowerPots
        })
      )
      if (pokemon) {
        listenForPokemonChanges(pokemon, ["hp", "ap"])
      }
    })
  }

  initializeSpectactor(uid: string) {
    if (this.uid === uid) {
      this.spectate = true
      if (this.room.state.players.size > 0) {
        this.initializeGame()
      }
    }
  }

  get gameScene(): GameScene | undefined {
    return this.game?.scene?.getScene("gameScene") as GameScene | undefined
  }

  get spectatedPlayerId(): string {
    return store.getState().game.currentPlayerId
  }

  get simulationId(): string {
    return this.simulation?.id ? this.simulation.id : ""
  }

  handleWeatherChange(simulation: Simulation, value: Weather) {
    if (this.gameScene && simulation.id === this.player?.simulationId) {
      if (this.gameScene.weatherManager) {
        this.gameScene.weatherManager.clearWeather()
        if (value === Weather.RAIN) {
          this.gameScene.weatherManager.addRain()
        } else if (value === Weather.SUN) {
          this.gameScene.weatherManager.addSun()
        } else if (value === Weather.SANDSTORM) {
          this.gameScene.weatherManager.addSandstorm()
        } else if (value === Weather.SNOW) {
          this.gameScene.weatherManager.addSnow()
        } else if (value === Weather.NIGHT) {
          this.gameScene.weatherManager.addNight()
        } else if (value === Weather.BLOODMOON) {
          this.gameScene.weatherManager.addBloodMoon()
        } else if (value === Weather.WINDY) {
          this.gameScene.weatherManager.addWind()
        } else if (value === Weather.STORM) {
          this.gameScene.weatherManager.addStorm()
        } else if (value === Weather.MISTY) {
          this.gameScene.weatherManager.addMist()
        } else if (value === Weather.SMOG) {
          this.gameScene.weatherManager.addSmog()
        } else if (value === Weather.MURKY) {
          this.gameScene.weatherManager.addMurky()
        }
      }
    }
  }

  handleDisplayHeal(message: {
    type: HealType
    id: string
    x: number
    y: number
    index: string
    amount: number
  }) {
    if (document.hidden) return // do not display heal when the tab is not focused
    if (preference("showDamageNumbers")) {
      this.gameScene?.battle?.displayHeal(message)
    }
  }

  handleDisplayDamage(message: {
    type: AttackType
    id: string
    x: number
    y: number
    index: string
    amount: number
  }) {
    if (document.hidden) return // do not display damage when the tab is not focused
    if (preference("showDamageNumbers")) {
      this.gameScene?.battle?.displayDamage(message)
    }
  }

  handleDisplayAbility(message: {
    id: string
    skill: Ability
    orientation: Orientation
    positionX: number
    positionY: number
    targetX?: number
    targetY?: number
    delay?: number
    ap?: number
  }) {
    if (document.hidden) return // do not display abilities when the tab is not focused
    this.gameScene?.battle?.displayAbility(message)
  }

  /* Board pokemons */

  handleBoardPokemonAdd(player: IPlayer, pokemon: IPokemon) {
    const board = this.gameScene?.board
    if (
      board &&
      player.id === this.spectatedPlayerId &&
      (board.mode === BoardMode.PICK || pokemon.positionY === 0)
    ) {
      const pokemonUI = this.gameScene?.board?.addPokemonSprite(pokemon)
      if (!pokemonUI) return
      if (pokemon.action === PokemonActionState.FISH) {
        pokemonUI.fishingAnimation()
      } else if (pokemon.stars > 1) {
        pokemonUI.evolutionAnimation()
        playSound(
          pokemon.stars === 2 ? SOUNDS.EVOLUTION_T2 : SOUNDS.EVOLUTION_T3
        )
      } else if (pokemon.rarity === Rarity.HATCH) {
        pokemonUI.hatchAnimation()
      } else {
        pokemonUI.spawnAnimation()
      }
    }
  }

  handleDragDropCancel(message: {
    updateBoard: boolean
    updateItems: boolean
    text?: string
    pokemonId?: string
  }) {
    const gameScene = this.gameScene
    if (gameScene?.lastDragDropPokemon && message.updateBoard) {
      const tg = gameScene.lastDragDropPokemon
      const coordinates = transformBoardCoordinates(tg.positionX, tg.positionY)
      tg.x = coordinates[0]
      tg.y = coordinates[1]
    }

    if (message.updateItems && gameScene && this.player) {
      gameScene.itemsContainer?.render(this.player.items)
    }

    if (message.text && message.pokemonId) {
      const pokemon = this.gameScene?.board?.pokemons.get(message.pokemonId)
      if (pokemon) {
        gameScene?.board?.displayText(
          pokemon.x,
          pokemon.y,
          t(message.text),
          true
        )
      }
    }
  }

  setPlayer(player: Player) {
    this.player = player
    if (this.room.state.phase !== GamePhaseState.TOWN) {
      this.gameScene?.setMap(player.map)
    }
    this.gameScene?.battle?.setPlayer(player)
    this.gameScene?.board?.setPlayer(player)
    this.gameScene?.itemsContainer?.setPlayer(player)
    this.gameScene && clearAbilityAnimations(this.gameScene)
    store.dispatch(setPlayer(player))
  }

  setSimulation(simulation: Simulation) {
    this.simulation = simulation
    store.dispatch(setSimulation(simulation))
    if (this.gameScene?.battle) {
      this.gameScene?.battle.setSimulation(this.simulation)
    }
    this.handleWeatherChange(simulation, simulation.weather)
  }

  onDragDrop(event: CustomEvent<IDragDropMessage>) {
    this.room.send(Transfer.DRAG_DROP, event.detail)
  }

  onDragDropCombine(event: CustomEvent<IDragDropCombineMessage>) {
    this.room.send(Transfer.DRAG_DROP_COMBINE, event.detail)
  }

  onDragDropItem(event: CustomEvent<IDragDropItemMessage>) {
    this.room.send(Transfer.DRAG_DROP_ITEM, event.detail)
  }
}

export default GameContainer
