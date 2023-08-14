import GameScene from "./scenes/game-scene"
import MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin.js"
import { getPath, transformCoordinate } from "../pages/utils/utils"
import Phaser from "phaser"
import Player from "../../../models/colyseus-models/player"
import { Room } from "colyseus.js"
import GameState from "../../../rooms/states/game-state"
import { Pokemon } from "../../../models/colyseus-models/pokemon"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  IPlayer,
  IPokemon,
  IPokemonEntity,
  Transfer,
  NonFunctionPropNames,
  ISimplePlayer
} from "../../../types"
import PokemonEntity from "../../../core/pokemon-entity"
import { DesignTiled } from "../../../core/design"
import { toast } from "react-toastify"
import React from "react"
import { IPokemonConfig } from "../../../models/mongo-models/user-metadata"
import { getPortraitSrc } from "../utils"
import { IPokemonRecord } from "../../../models/colyseus-models/game-record"
import { Synergy } from "../../../types/enum/Synergy"
import {
  AttackType,
  HealType,
  Orientation,
  PokemonActionState
} from "../../../types/enum/Game"
import { Weather } from "../../../types/enum/Weather"
import store from "../stores"
import { logger } from "../../../utils/logger"
import { PokemonAvatarModel } from "../../../models/colyseus-models/pokemon-avatar"
import { FloatingItem } from "../../../models/colyseus-models/floating-item"
import Status from "../../../models/colyseus-models/status"
import Count from "../../../models/colyseus-models/count"
import { Ability } from "../../../types/enum/Ability"
import { Portal, SynergySymbol } from "../../../models/colyseus-models/portal"

class GameContainer {
  room: Room<GameState>
  div: HTMLDivElement
  game: Phaser.Game | undefined
  player: Player | undefined
  tilemap: DesignTiled | undefined
  uid: string
  spectate: boolean
  constructor(div: HTMLDivElement, uid: string, room: Room<GameState>) {
    this.room = room
    this.div = div
    this.game = undefined
    this.player = undefined
    this.tilemap = undefined
    this.uid = uid
    this.spectate = false
    this.initializeEvents()
  }

  initializeGame() {
    if (this.game != null) return // prevent initializing twice
    // Create Phaser game
    const config = {
      type: Phaser.AUTO,
      width: 2000,
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
    this.game.scene.start("gameScene", {
      room: this.room,
      tilemap: this.tilemap,
      spectate: this.spectate
    })
  }

  initializeEvents() {
    this.room.onMessage(Transfer.DRAG_DROP_FAILED, (message) =>
      this.handleDragDropFailed(message)
    )
    this.room.state.avatars.onAdd((avatar) => {
      this.gameScene?.minigameManager?.addPokemon(avatar)
      const fields: NonFunctionPropNames<PokemonAvatarModel>[] = [
        "x",
        "y",
        "action",
        "timer",
        "orientation"
      ]
      fields.forEach((field) => {
        avatar.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changePokemon(avatar, field, value)
        })
      })
    })

    this.room.state.avatars.onRemove((avatar, key) => {
      this.gameScene?.minigameManager?.removePokemon(avatar)
    })

    this.room.state.floatingItems.onAdd((floatingItem) => {
      this.gameScene?.minigameManager?.addItem(floatingItem)
      const fields: NonFunctionPropNames<FloatingItem>[] = [
        "x",
        "y",
        "avatarId"
      ]
      fields.forEach((field) => {
        floatingItem.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changeItem(
            floatingItem,
            field,
            value
          )
        })
      })
    })

    this.room.state.floatingItems.onRemove((floatingItem, key) => {
      this.gameScene?.minigameManager?.removeItem(floatingItem)
    })

    this.room.state.portals.onAdd((portal) => {
      this.gameScene?.minigameManager?.addPortal(portal)
      const fields: NonFunctionPropNames<Portal>[] = ["x", "y", "avatarId"]
      fields.forEach((field) => {
        portal.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changePortal(portal, field, value)
        })
      })
    })

    this.room.state.portals.onRemove((portal, key) => {
      this.gameScene?.minigameManager?.removePortal(portal)
    })

    this.room.state.symbols.onAdd((symbol) => {
      this.gameScene?.minigameManager?.addSymbol(symbol)
      const fields: NonFunctionPropNames<SynergySymbol>[] = [
        "x",
        "y",
        "portalId"
      ]
      fields.forEach((field) => {
        symbol.listen(field, (value, previousValue) => {
          this.gameScene?.minigameManager?.changeSymbol(symbol, field, value)
        })
      })
    })

    this.room.state.symbols.onRemove((symbol, key) => {
      this.gameScene?.minigameManager?.removeSymbol(symbol)
    })

    this.room.onError((err) => logger.error("room error", err))
  }

  setTilemap(tilemap) {
    this.tilemap = tilemap
    if (this.player || (this.spectate && this.room.state.players.size > 0)) {
      // logger.debug('setTilemap', this.player, this.tilemap);
      this.initializeGame()
    }
  }

  initializePlayer(player: Player) {
    // logger.debug(player);
    if (this.uid == player.id) {
      this.player = player
      if (this.tilemap) {
        // logger.debug('initializePlayer', this.player, this.tilemap);
        this.initializeGame()
      }
    } else if (this.spectate && this.tilemap) {
      this.initializeGame()
    }

    player.board.onAdd((pokemon, key) => {
      const p = <Pokemon>pokemon
      if (p.stars > 1) {
        const config: IPokemonConfig | undefined = player.pokemonCollection.get(
          pokemon.index
        )
        const i = React.createElement(
          "img",
          {
            src: getPortraitSrc(
              pokemon.index,
              config?.selectedShiny,
              config?.selectedEmotion
            )
          },
          null
        )
        toast(i, {
          containerId: player.rank.toString(),
          className: "toast-new-pokemon"
        })
      }

      const fields: NonFunctionPropNames<Pokemon>[] = [
        "positionX",
        "positionY",
        "action"
      ]
      fields.forEach((field) => {
        p.listen(field, (value, previousValue) => {
          if (player.id === this.spectatedPlayerId) {
            this.gameScene?.board?.changePokemon(pokemon, field, value)
          }
        })
      })

      p.items.onAdd((value, key) => {
        // logger.debug('added', value, key)
        if (player.id === this.spectatedPlayerId) {
          this.gameScene?.board?.addPokemonItem(player.id, value, p)
        }
      })
      p.items.onRemove((value, key) => {
        // logger.debug('removed', value, key)
        if (player.id === this.spectatedPlayerId) {
          this.gameScene?.board?.removePokemonItem(player.id, value, p)
        }
      })

      this.handleBoardPokemonAdd(player, p)
    })

    player.board.onRemove((pokemon, key) => {
      if (player.id === this.spectatedPlayerId) {
        this.gameScene?.board?.removePokemon(pokemon)
      }
    })

    player.items.onAdd((value, key) => {
      // logger.debug('added', value, key);
      if (player.id === this.spectatedPlayerId) {
        this.gameScene?.itemsContainer?.addItem(value)
      }
    })

    player.items.onRemove((value, key) => {
      // logger.debug('removed', value, key);
      if (player.id === this.spectatedPlayerId) {
        this.gameScene?.itemsContainer?.removeItem(value)
      }
    })

    player.simulation.listen("weather", (value, previousValue) => {
      this.handleWeatherChange(player, value)
    })

    for (let team of [player.simulation.blueTeam, player.simulation.redTeam]) {
      team.onAdd((p, key) => {
        // logger.debug('add pokemon');
        const pokemon = <PokemonEntity>p
        this.gameScene?.battle?.addPokemon(player.id, pokemon)

        const fields: NonFunctionPropNames<Status>[] = [
          "armorReduction",
          "burn",
          "confusion",
          "deltaOrb",
          "electricField",
          "fairyField",
          "freeze",
          "grassField",
          "paralysis",
          "poisonStacks",
          "protect",
          "psychicField",
          "resurection",
          "resurecting",
          "runeProtect",
          "silence",
          "sleep",
          "soulDew",
          "spikeArmor",
          "synchro",
          "wound",
          "magicBounce"
        ]

        fields.forEach((field) => {
          pokemon.status.listen(field, (value, previousValue) => {
            this.gameScene?.battle?.changeStatus(player.id, pokemon, field)
          })
        })

        pokemon.onChange((changes) => {
          const fields: NonFunctionPropNames<PokemonEntity>[] = [
            "positionX",
            "positionY",
            "orientation",
            "action",
            "critChance",
            "critDamage",
            "ap",
            "atkSpeed",
            "life",
            "shield",
            "pp",
            "atk",
            "def",
            "speDef",
            "range",
            "targetX",
            "targetY",
            "team",
            "index"
          ]

          fields.forEach((field) => {
            pokemon.listen(field, (value, previousValue) => {
              // logger.debug('simulation change' + change.field);
              this.gameScene?.battle?.changePokemon(
                player.id,
                pokemon,
                field,
                value,
                previousValue
              )
            })
          })
        })

        pokemon.items.onAdd((value, key) => {
          // logger.debug('added', value, key)
          if (player.id === this.spectatedPlayerId) {
            this.gameScene?.battle?.addPokemonItem(player.id, value, pokemon)
          }
        })
        pokemon.items.onRemove((value, key) => {
          // logger.debug('removed', value, key)
          if (player.id === this.spectatedPlayerId) {
            this.gameScene?.battle?.removePokemonItem(player.id, value, pokemon)
          }
        })

        const fieldsCount: NonFunctionPropNames<Count>[] = [
          "crit",
          "dodgeCount",
          "ult",
          "petalDanceCount",
          "futureSightCount",
          "earthquakeCount",
          "fieldCount",
          "soundCount",
          "growGroundCount",
          "fairyCritCount",
          "powerLensCount",
          "starDustCount",
          "mindBlownCount",
          "spellBlockedCount",
          "manaBurnCount",
          "staticCount",
          "moneyCount",
          "attackCount",
          "tripleAttackCount",
          "monsterExecutionCount",
          "upgradeCount",
          "soulDewCount",
          "defensiveRibbonCount",
          "attackOrderCount",
          "healOrderCount"
        ]

        fieldsCount.forEach((field) => {
          pokemon.count.listen(field, (value, previousValue) => {
            this.gameScene?.battle?.changeCount(
              player.id,
              pokemon,
              field,
              value
            )
          })
        })
      })

      team.onRemove((pokemon, key) => {
        this.gameScene?.battle?.removePokemon(player.id, pokemon)
      })
    }
  }

  initializeSpectactor(uid: string) {
    if (this.uid === uid) {
      this.spectate = true
      if (this.tilemap && this.room.state.players.size > 0) {
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

  handleWeatherChange(player: Player, value: Weather) {
    const weatherManager = this.gameScene?.weatherManager
    if (weatherManager && player.id === this.spectatedPlayerId) {
      weatherManager.clearWeather()
      if (value === Weather.RAIN) {
        weatherManager.addRain()
      } else if (value === Weather.SUN) {
        weatherManager.addSun()
      } else if (value === Weather.SANDSTORM) {
        weatherManager.addSandstorm()
      } else if (value === Weather.SNOW) {
        weatherManager.addSnow()
      } else if (value === Weather.NIGHT) {
        weatherManager.addNight()
      } else if (value === Weather.WINDY) {
        weatherManager.addWind()
      } else if (value === Weather.STORM) {
        weatherManager.addStorm()
      } else if (value === Weather.MISTY) {
        weatherManager.addMist()
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
    this.gameScene?.battle?.displayHeal(
      message.x,
      message.y,
      message.amount,
      message.type,
      message.index,
      message.id
    )
  }

  handleDisplayDamage(message: {
    type: AttackType
    id: string
    x: number
    y: number
    index: string
    amount: number
  }) {
    this.gameScene?.battle?.displayDamage(
      message.x,
      message.y,
      message.amount,
      message.type,
      message.index,
      message.id
    )
  }

  handleDisplayAbility(message: {
    id: string
    skill: Ability
    orientation: Orientation
    positionX: number
    positionY: number
    targetX?: number
    targetY?: number
  }) {
    this.gameScene?.battle?.displayAbility(
      message.id,
      message.skill,
      message.orientation,
      message.positionX,
      message.positionY,
      message.targetX,
      message.targetY
    )
  }

  /* Board pokemons */

  handleBoardPokemonAdd(player: IPlayer, pokemon: IPokemon) {
    if (player.id === this.spectatedPlayerId) {
      const pokemonUI = this.gameScene?.board?.addPokemon(pokemon)
      if (pokemonUI && pokemon.action === PokemonActionState.FISH) {
        pokemonUI.fishingAnimation()
      }
    }
  }

  handleDragDropFailed(message: any) {
    const gameScene = this.gameScene
    if (gameScene?.lastDragDropPokemon && message.updateBoard) {
      const tg = gameScene.lastDragDropPokemon
      const coordinates = transformCoordinate(tg.positionX, tg.positionY)
      tg.x = coordinates[0]
      tg.y = coordinates[1]
    }

    if (gameScene && message.updateItems) {
      gameScene.itemsContainer?.updateItems()
    }
  }

  onPlayerClick(id: string) {
    if (this.gameScene && this.room.state.players.has(id)) {
      const player = this.room.state.players.get(id)!
      this.gameScene.setPlayer(player)
      this.handleWeatherChange(player, player.simulation.weather)
    }
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

  onSellDrop(event: CustomEvent<{ pokemonId: string }>) {
    this.room.send(Transfer.SELL_DROP, event.detail)
  }

  transformToSimplePlayer(player: IPlayer): ISimplePlayer {
    const simplePlayer = {
      elo: player.elo,
      name: player.name,
      id: player.id,
      rank: player.rank,
      avatar: player.avatar,
      title: player.title,
      role: player.role,
      pokemons: new Array<IPokemonRecord>(),
      synergies: new Array<{ name: Synergy; value: number }>()
    }

    const allSynergies = new Array<{ name: Synergy; value: number }>()
    player.synergies.forEach((v, k) => {
      allSynergies.push({ name: k as Synergy, value: v })
    })

    allSynergies.sort((a, b) => b.value - a.value)

    simplePlayer.synergies = allSynergies.slice(0, 5)

    if (player.board && player.board.size > 0) {
      player.board.forEach((pokemon) => {
        if (pokemon.positionY != 0) {
          simplePlayer.pokemons.push({
            avatar: getPath(pokemon),
            items: pokemon.items.toArray(),
            name: pokemon.name
          })
        }
      })
    }

    return simplePlayer
  }
}

export default GameContainer
