import { t } from "i18next"
import { GameObjects } from "phaser"
import Player from "../../../../models/colyseus-models/player"
import { isOnBench } from "../../../../models/colyseus-models/pokemon"
import { PokemonAvatarModel } from "../../../../models/colyseus-models/pokemon-avatar"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import GameState from "../../../../rooms/states/game-state"
import { IPokemon, Transfer } from "../../../../types"
import { SynergyTriggers } from "../../../../types/Config"
import {
  GamePhaseState,
  GameMode,
  Orientation,
  PokemonActionState
} from "../../../../types/enum/Game"
import { AnimationConfig, Pkm } from "../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../types/enum/SpecialGameRule"
import { Synergy } from "../../../../types/enum/Synergy"
import { values } from "../../../../utils/schemas"
import { transformCoordinate } from "../../pages/utils/utils"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import PokemonAvatar from "./pokemon-avatar"
import PokemonSpecial from "./pokemon-special"

export enum BoardMode {
  PICK = "pick",
  BATTLE = "battle",
  MINIGAME = "minigame"
}

export default class BoardManager {
  pokemons: Map<string, PokemonSprite>
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
  berryTrees: Phaser.GameObjects.Sprite[] = []
  gameMode: GameMode
  smeargle: PokemonSprite | null = null
  specialGameRule: SpecialGameRule | null = null

  constructor(
    scene: GameScene,
    player: Player,
    animationManager: AnimationManager,
    uid: string,
    state: GameState
  ) {
    this.pokemons = new Map<string, PokemonSprite>()
    this.uid = uid
    this.scene = scene
    this.player = player
    this.mode = BoardMode.PICK
    this.animationManager = animationManager
    this.lightX = state.lightX
    this.lightY = state.lightY
    this.gameMode = state.gameMode
    this.specialGameRule = state.specialGameRule
    this.renderBoard()

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
      if (this.playerAvatar) {
        this.animationManager.animatePokemon(
          this.playerAvatar,
          PokemonActionState.HOP,
          false
        )
      }
      if (this.opponentAvatar) {
        this.animationManager.animatePokemon(
          this.opponentAvatar,
          PokemonActionState.HURT,
          false
        )
      }
      if (this.pveChest) {
        this.pveChest.anims.play("open_chest")
        const rewards = values(this.player.pveRewards).concat(
          values(this.player.pveRewardsPropositions)
        )
        rewards.forEach((item, i) => {
          const itemSprite = this.scene.add.sprite(
            1512,
            122,
            "item",
            item + ".png"
          )
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
            x: 1512 + (i - (rewards.length - 1) / 2) * 70
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

  addPokemonSprite(pokemon: IPokemon): PokemonSprite {
    if (this.pokemons.has(pokemon.id)) {
      return this.pokemons.get(pokemon.id)!
    }
    const coordinates = transformCoordinate(
      pokemon.positionX,
      pokemon.positionY
    )
    const pokemonUI = new PokemonSprite(
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

    return pokemonUI
  }

  removePokemon(pokemonToRemove: IPokemon) {
    const pokemonUI = this.pokemons.get(pokemonToRemove.id)
    if (pokemonUI) {
      pokemonUI.destroy()
    }
    this.pokemons.delete(pokemonToRemove.id)
  }

  renderBoard() {
    this.showBerryTree()
    this.pokemons.forEach((p) => p.destroy())
    this.pokemons.clear()
    if (this.mode === BoardMode.PICK) {
      this.showLightCell()
    }

    this.player.board.forEach((pokemon) => {
      if (this.mode === BoardMode.PICK || isOnBench(pokemon)) {
        this.addPokemonSprite(pokemon)
      }
    })

    if (this.gameMode === GameMode.SCRIBBLE) {
      if (this.smeargle) {
        this.smeargle.destroy()
        this.smeargle = null
      }
      this.addSmeargle()
    }
  }

  showLightCell() {
    this.hideLightCell()
    const lightCount = this.player.synergies.get(Synergy.LIGHT)
    if (lightCount && lightCount >= SynergyTriggers[Synergy.LIGHT][0]) {
      const coordinates = transformCoordinate(this.lightX, this.lightY)
      this.lightCell = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        "LIGHT_CELL/000.png"
      )
      this.lightCell.setDepth(2)
      this.lightCell.setScale(2, 2)
      this.lightCell.anims.play("LIGHT_CELL")
    }
  }

  hideLightCell() {
    this.lightCell?.destroy()
  }

  showBerryTree() {
    this.berryTrees.forEach((tree) => tree.destroy())
    this.berryTrees = []
    const grassLevel = this.player.synergies.get(Synergy.GRASS) ?? 0
    const nbTrees = SynergyTriggers[Synergy.GRASS].filter(
      (n) => n <= grassLevel
    ).length

    const treePositions = [
      [408, 710],
      [360, 710],
      [312, 710]
    ]

    for (let i = 0; i < nbTrees; i++) {
      const tree = this.scene.add.sprite(
        treePositions[i][0],
        treePositions[i][1],
        "berry_trees",
        this.player.berryTreesType[i] + "_1"
      )

      tree.setDepth(1).setScale(2, 2).setOrigin(0.5, 1)
      if (this.player.berryTreesStage[i] === 0) {
        tree.anims.play("CROP")
      } else {
        tree.anims.play(
          `${this.player.berryTreesType[i]}_TREE_STEP_${this.player.berryTreesStage[i]}`
        )
      }

      tree.setInteractive()
      tree.on("pointerdown", (pointer) => {
        if (this.player.id !== this.scene.uid) return
        if (this.scene.room && this.player.berryTreesStage[i] >= 3) {
          this.scene.room.send(Transfer.PICK_BERRY, i)
          this.displayText(pointer.x, pointer.y, t("berry_gained"))
          tree.play("CROP")
        } else {
          this.displayText(pointer.x, pointer.y, t("berry_unripe"))
        }
      })

      this.berryTrees.push(tree)
    }
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
        text.destroy()
      }
    })
  }

  updatePlayerAvatar() {
    if (this.playerAvatar) {
      this.playerAvatar.destroy()
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
      this.player.id
    )
    this.playerAvatar.orientation = Orientation.UPRIGHT
    this.playerAvatar.updateLife(this.player.life)
    this.animationManager.animatePokemon(
      this.playerAvatar,
      this.playerAvatar.action,
      false
    )
  }

  updateOpponentAvatar(
    opponentId: string | null,
    opponentAvatarString: string | null
  ) {
    if (this.opponentAvatar) {
      this.opponentAvatar.destroy()
    }
    if (this.pveChestGroup) {
      this.pveChestGroup.destroy(true, true)
      this.pveChest = null
      this.pveChestGroup = null
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

      // do not display avatar when player is dead
      if (opponentLife <= 0 || !opponentAvatarString || !opponentId) return

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
        opponentId
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
    if (this.playerAvatar && this.player.id === playerId) {
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
      if (!pokemon.isOnBench) {
        pokemon.destroy()
        this.pokemons.delete(pokemon.id)
      }
    })
    this.closeTooltips()
    this.scene.input.setDragState(this.scene.input.activePointer, 0)
  }

  pickMode() {
    // logger.debug('pickMode');
    this.mode = BoardMode.PICK
    this.renderBoard()
    this.updatePlayerAvatar()
    this.updateOpponentAvatar(null, null)
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
      this.playerAvatar.destroy()
    }
    this.updateOpponentAvatar(null, null)
  }

  setPlayer(player: Player) {
    if (player.id != this.player.id) {
      this.player = player
      this.renderBoard()
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
          if (this.mode === BoardMode.BATTLE && !pokemonUI.isOnBench) {
            pokemonUI.destroy()
            this.pokemons.delete(pokemonUI.id)
          }
          break

        case "action":
          this.animationManager.animatePokemon(pokemonUI, value, false)
          break

        case "hp": {
          const baseHP = getPokemonData(pokemon.name).hp
          const sizeBuff = (pokemon.hp - baseHP) / baseHP
          pokemonUI.sprite.setScale(2 + sizeBuff)
          pokemonUI.hp = value
          break
        }

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

  showEmote(playerId: string, emote?: string) {
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

  addSmeargle() {
    this.smeargle = new PokemonSpecial(
      this.scene,
      1512,
      396,
      Pkm.SMEARGLE,
      this.animationManager,
      t(`scribble_description.${this.specialGameRule}`),
      t(`scribble.${this.specialGameRule}`)
    )
  }
}
