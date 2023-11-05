import Pokemon from "./pokemon"
import { transformCoordinate } from "../../pages/utils/utils"
import { IPokemon, Transfer } from "../../../../types"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import { Item } from "../../../../types/enum/Item"
import { AnimationConfig } from "../../../../types/enum/Pokemon"
import {
  GamePhaseState,
  Orientation,
  PokemonActionState
} from "../../../../types/enum/Game"
import { PokemonAvatarModel } from "../../../../models/colyseus-models/pokemon-avatar"
import Player from "../../../../models/colyseus-models/player"
import PokemonAvatar from "./pokemon-avatar"
import { Synergy } from "../../../../types/enum/Synergy"
import { SynergyTriggers } from "../../../../types/Config"
import { GameObjects } from "phaser"
import { t } from "i18next"

export enum BoardMode {
  PICK = "pick",
  BATTLE = "battle",
  MINIGAME = "minigame"
}

export default class BoardManager {
  pokemons: Map<string, Pokemon>
  uid: string
  scene: GameScene
  player: Player
  mode: BoardMode
  animationManager: AnimationManager
  playerAvatar: PokemonAvatar
  opponentAvatar: PokemonAvatar | null
  pveChestGroup: Phaser.GameObjects.Group | null
  pveChest: Phaser.GameObjects.Sprite | null
  lightX: number
  lightY: number
  lightCell: Phaser.GameObjects.Sprite | null
  berryTree: Phaser.GameObjects.Sprite | null

  constructor(
    scene: GameScene,
    player: Player,
    animationManager: AnimationManager,
    uid: string,
    lightX: number,
    lightY: number
  ) {
    this.lightX = lightX
    this.lightY = lightY
    this.pokemons = new Map<string, Pokemon>()
    this.uid = uid
    this.scene = scene
    this.player = player
    this.mode = BoardMode.PICK
    this.animationManager = animationManager
    this.buildPokemons()

    if (this.scene.room?.state.phase == GamePhaseState.FIGHT) {
      this.battleMode()
    } else if (this.scene.room?.state.phase === GamePhaseState.MINIGAME) {
      this.minigameMode()
    } else {
      this.pickMode()
    }
  }

  victoryAnimation(winnerId: string) {
    //logger.debug({ winnerId, playerId: this.player.id, opponentId: this.opponentAvatar?.playerId })
    if (winnerId === this.player.id) {
      this.animationManager.animatePokemon(
        this.playerAvatar,
        PokemonActionState.HOP,
        false
      )
      if (this.opponentAvatar) {
        this.animationManager.animatePokemon(
          this.opponentAvatar,
          PokemonActionState.HURT,
          false
        )
      }
      if (this.pveChest) {
        this.pveChest.anims.play("open_chest")
        this.player.pveRewards.forEach((item, i) => {
          const itemSprite = this.scene.add.sprite(1512, 122, "item", item)
          itemSprite.setScale(0.5)
          const shinyEffect = this.scene.add.sprite(1512, 122, "shine")
          shinyEffect.setScale(2)
          shinyEffect.play("shine")
          this.pveChestGroup?.addMultiple([itemSprite, shinyEffect])
          this.scene.tweens.add({
            targets: [itemSprite, shinyEffect],
            ease: Phaser.Math.Easing.Quadratic.Out,
            duration: 1000,
            y: 75,
            x: 1512 + (i - (this.player.pveRewards.length - 1) / 2) * 70
          })
        })
      }
    } else if (winnerId === this.opponentAvatar?.playerId) {
      this.animationManager.animatePokemon(
        this.opponentAvatar,
        PokemonActionState.HOP,
        false
      )
      this.animationManager.animatePokemon(
        this.playerAvatar,
        PokemonActionState.HURT,
        false
      )
    } else {
      this.animationManager.animatePokemon(
        this.playerAvatar,
        PokemonActionState.IDLE,
        false
      )
      if (this.opponentAvatar) {
        this.animationManager.animatePokemon(
          this.opponentAvatar,
          PokemonActionState.IDLE,
          false
        )
      }
    }
  }

  addPokemon(pokemon: IPokemon): Pokemon {
    const coordinates = transformCoordinate(
      pokemon.positionX,
      pokemon.positionY
    )
    const pokemonUI = new Pokemon(
      this.scene,
      coordinates[0],
      coordinates[1],
      pokemon,
      this.player.id,
      false,
      false
    )

    this.animationManager.animatePokemon(pokemonUI, pokemon.action, false)
    this.pokemons.set(pokemonUI.id, pokemonUI)
    if (pokemon.positionY != 0 && this.mode !== BoardMode.PICK) {
      pokemonUI.setVisible(false)
    }

    return pokemonUI
  }

  removePokemon(pokemonToRemove: IPokemon) {
    const pokemonUI = this.pokemons.get(pokemonToRemove.id)
    if (pokemonUI) {
      pokemonUI.destroy(true)
    }
    this.pokemons.delete(pokemonToRemove.id)
  }

  buildPokemons() {
    this.showLightCell()
    this.showBerryTree()
    this.player.board.forEach((pokemon) => {
      this.addPokemon(pokemon)
    })
  }

  showLightCell() {
    this.hideLightCell()
    const lightCount = this.player.synergies.get(Synergy.LIGHT)
    if (lightCount && lightCount >= SynergyTriggers[Synergy.LIGHT][0]) {
      const coordinates = transformCoordinate(this.lightX, this.lightY)
      this.lightCell = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "LIGHT_CELL",
        "000"
      )
      this.lightCell.setDepth(1)
      this.lightCell.setScale(2, 2)
      this.lightCell.anims.play("LIGHT_CELL")
    }
  }

  hideLightCell() {
    this.lightCell?.destroy()
  }

  showBerryTree() {
    this.hideBerryTree()
    const grassCount = this.player.synergies.get(Synergy.GRASS)
    if (grassCount && grassCount >= SynergyTriggers[Synergy.GRASS][0]) {
      this.berryTree = this.scene.add.sprite(
        408,
        710,
        "berry_trees",
        this.player.berry + "_1"
      )
      this.berryTree.setDepth(1)
      this.berryTree.setScale(2, 2)
      this.berryTree.setOrigin(0.5, 1)
      if (this.player.berryTreeStage === 0) {
        this.berryTree.anims.play("CROP")
      } else {
        this.berryTree.anims.play(
          `${this.player.berry}_TREE_STEP_${this.player.berryTreeStage}`
        )
      }

      this.berryTree.setInteractive()
      this.berryTree.on("pointerdown", (pointer) => {
        if (this.scene.room && this.player.berryTreeStage >= 3) {
          this.scene.room.send(Transfer.PICK_BERRY)
          this.displayText(pointer.x, pointer.y, t("berry_gained"))
          this.berryTree?.play("CROP")
        } else {
          this.displayText(pointer.x, pointer.y, t("berry_unripe"))
        }
      })
    }
  }

  hideBerryTree() {
    this.berryTree?.destroy()
  }

  displayText(x: number, y: number, label: string) {
    const textStyle = {
      fontSize: "25px",
      fontFamily: "Verdana",
      color: "#fff",
      align: "center",
      strokeThickness: 2,
      stroke: "#000"
    }

    const text = this.scene.add.existing(
      new GameObjects.Text(this.scene, x, y, label, textStyle)
    )
    text.setDepth(10)

    this.scene.add.tween({
      targets: [text],
      ease: "linear",
      duration: 1500,
      delay: 0,
      alpha: {
        getStart: () => 1,
        getEnd: () => 0
      },
      y: {
        getStart: () => y - 50,
        getEnd: () => y - 110
      },
      onComplete: () => {
        text.destroy(true)
      }
    })
  }

  updatePlayerAvatar() {
    if (this.playerAvatar) {
      this.playerAvatar.destroy(true)
    }
    if (this.player.life <= 0) return // do not display avatar when player is dead
    const playerAvatar = new PokemonAvatarModel(
      this.player.id,
      this.player.avatar,
      0,
      0,
      0
    )
    this.playerAvatar = new PokemonAvatar(
      this.scene,
      504,
      696,
      playerAvatar,
      this.player.id,
      this.animationManager
    )
    this.playerAvatar.orientation = Orientation.UPRIGHT
    this.playerAvatar.updateLife(this.player.life)
    this.animationManager.animatePokemon(
      this.playerAvatar,
      this.playerAvatar.action,
      false
    )
  }

  updateOpponentAvatar(opponentId: string, opponentAvatarString: string) {
    if (this.opponentAvatar) {
      this.opponentAvatar.destroy(true)
    }

    if (opponentId === "pve") {
      this.pveChestGroup = this.scene.add.group()
      this.pveChest = this.scene.add.sprite(1512, 122, "chest", "1.png")
      this.pveChest.setScale(2)
      this.pveChestGroup.add(this.pveChest)
    } else if (this.mode === BoardMode.BATTLE) {
      let opponentLife = 0
      this.scene.room?.state.players.forEach((p) => {
        if (p.id === opponentId) opponentLife = p.life
      })

      if (opponentLife <= 0) return // do not display avatar when player is dead

      const opponentAvatar = new PokemonAvatarModel(
        this.player.id,
        opponentAvatarString,
        0,
        0,
        0
      )
      this.opponentAvatar = new PokemonAvatar(
        this.scene,
        1512,
        122,
        opponentAvatar,
        opponentId,
        this.animationManager
      )
      this.opponentAvatar.disableInteractive()
      this.opponentAvatar.orientation = Orientation.DOWNLEFT
      this.opponentAvatar.updateLife(opponentLife)
      this.animationManager.animatePokemon(
        this.opponentAvatar,
        this.opponentAvatar.action,
        false
      )
    }
  }

  updateAvatarLife(playerId: string, value: number) {
    if (this.player.id === playerId) {
      this.playerAvatar.updateLife(value)
    }

    if (this.opponentAvatar && this.opponentAvatar.id === playerId) {
      this.opponentAvatar.updateLife(value)
    }
  }

  battleMode() {
    // logger.debug('battleMode');
    this.mode = BoardMode.BATTLE
    this.hideLightCell()
    this.pokemons.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        pokemon.setVisible(false)
      }
    })
    this.closeTooltips()
    this.scene.input.setDragState(this.scene.input.activePointer, 0)
  }

  pickMode() {
    // logger.debug('pickMode');
    this.mode = BoardMode.PICK
    this.showLightCell()
    this.showBerryTree()
    this.pokemons.forEach((pokemon) => {
      pokemon.setVisible(true)
    })
    this.updatePlayerAvatar()
    if (this.opponentAvatar) {
      this.opponentAvatar.destroy(true)
    }
    if (this.pveChestGroup) {
      this.pveChestGroup.destroy(true, true)
      this.pveChest = null
      this.pveChestGroup = null
    }
  }

  minigameMode() {
    this.mode = BoardMode.MINIGAME
    this.hideLightCell()
    this.pokemons.forEach((pokemon) => {
      if (pokemon.positionY != 0) {
        pokemon.setVisible(false)
      }
    })
    this.closeTooltips()
    this.scene.input.setDragState(this.scene.input.activePointer, 0)

    if (this.playerAvatar) {
      this.playerAvatar.destroy(true)
    }
    if (this.opponentAvatar) {
      this.opponentAvatar.destroy(true)
    }
    if (this.pveChestGroup) {
      this.pveChestGroup.destroy(true, true)
      this.pveChest = null
      this.pveChestGroup = null
    }
  }

  setPlayer(player: Player) {
    if (player.id != this.player.id) {
      this.pokemons.forEach((pokemon) => {
        pokemon.destroy(true)
      })
      this.pokemons.clear()
      this.player = player
      this.buildPokemons()
      this.updatePlayerAvatar()
      this.updateOpponentAvatar(
        this.player.opponentId,
        this.player.opponentAvatar
      )
    }
  }

  updatePokemonItems(playerId: string, pokemon: IPokemon) {
    // logger.debug(change);
    if (this.player.id === playerId) {
      const pkm = this.pokemons.get(pokemon.id)
      if (pkm) {
        pkm.itemsContainer.render(pokemon.items)
      }
    }
  }

  changePokemon(pokemon: IPokemon, field: string, value) {
    const pokemonUI = this.pokemons.get(pokemon.id)
    let coordinates: number[]
    if (pokemonUI) {
      switch (field) {
        case "positionX":
          pokemonUI.positionX = value
          pokemonUI.positionY = pokemon.positionY
          coordinates = transformCoordinate(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          break

        case "positionY":
          pokemonUI.positionY = value
          pokemonUI.positionX = pokemon.positionX
          coordinates = transformCoordinate(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          if (pokemonUI.positionY != 0 && this.mode == "battle") {
            pokemonUI.setVisible(false)
          }
          break

        case "action":
          this.animationManager.animatePokemon(pokemonUI, value, false)
          break

        default:
          pokemonUI[field] = value
          break
      }
    }
  }

  closeTooltips() {
    this.pokemons.forEach((pokemon) => {
      if (pokemon.detail) {
        pokemon.closeDetail()
      }
      if (pokemon.itemsContainer) {
        pokemon.itemsContainer.closeDetails()
      }
    })
  }

  getBenchSize(): number {
    let benchSize = 0

    this.pokemons.forEach((pokemon) => {
      if (pokemon.isOnBench) {
        benchSize++
      }
    })

    return benchSize
  }

  toggleAnimation(playerId: string, emote?: string) {
    const player =
      this.playerAvatar.playerId === playerId
        ? this.playerAvatar
        : this.opponentAvatar?.playerId === playerId
        ? this.opponentAvatar
        : undefined
    if (player) {
      this.animationManager.play(player, AnimationConfig[player.name].emote)

      if (emote) {
        player.drawSpeechBubble(emote, false)
      }
    }
  }
}
