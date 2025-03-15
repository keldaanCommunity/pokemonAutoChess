import { t } from "i18next"
import { GameObjects } from "phaser"
import type { NonFunctionPropNames } from "../../../../types/HelperTypes"
import Player from "../../../../models/colyseus-models/player"
import { PokemonAvatarModel } from "../../../../models/colyseus-models/pokemon-avatar"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import GameState from "../../../../rooms/states/game-state"
import { IPokemon, Transfer } from "../../../../types"
import { PortalCarouselStages, SynergyTriggers } from "../../../../types/Config"
import {
  GameMode,
  GamePhaseState,
  Orientation,
  PokemonActionState,
  Stat
} from "../../../../types/enum/Game"
import { AnimationConfig, Pkm } from "../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../types/enum/SpecialGameRule"
import { Synergy } from "../../../../types/enum/Synergy"
import { isOnBench } from "../../../../utils/board"
import { values } from "../../../../utils/schemas"
import { transformCoordinate } from "../../pages/utils/utils"
import store from "../../stores"
import AnimationManager from "../animation-manager"
import GameScene from "../scenes/game-scene"
import PokemonSprite from "./pokemon"
import PokemonAvatar from "./pokemon-avatar"
import PokemonSpecial from "./pokemon-special"
import { displayBoost } from "./boosts-animations"
import { Item } from "../../../../types/enum/Item"
import { playMusic } from "../../pages/utils/audio"
import { DEPTH } from "../depths"
import { DungeonMusic } from "../../../../types/enum/Dungeon"

export enum BoardMode {
  PICK = "pick",
  BATTLE = "battle",
  TOWN = "town"
}

export default class BoardManager {
  pokemons: Map<string, PokemonSprite>
  uid: string
  scene: GameScene
  state: GameState
  player: Player
  mode: BoardMode
  animationManager: AnimationManager
  playerAvatar: PokemonAvatar | null
  opponentAvatar: PokemonAvatar | null
  scoutingAvatars: PokemonAvatar[] = []
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
    this.state = state
    this.player = player
    this.mode = BoardMode.PICK
    this.animationManager = animationManager
    this.lightX = state.lightX
    this.lightY = state.lightY
    this.gameMode = state.gameMode
    this.specialGameRule = state.specialGameRule
    this.playerAvatar = null
    this.opponentAvatar = null
    this.lightCell = null
    this.pveChest = null
    this.pveChestGroup = null

    if (state.phase == GamePhaseState.FIGHT) {
      this.battleMode()
    } else if (state.phase === GamePhaseState.TOWN) {
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
      this.playerAvatar &&
        this.animationManager.animatePokemon(
          this.playerAvatar,
          PokemonActionState.HURT,
          false
        )
    } else {
      this.playerAvatar &&
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
    this.showBerryTrees()
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

    if (this.specialGameRule != null) {
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
      this.lightCell.setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
      this.lightCell.setScale(2, 2)
      this.lightCell.anims.play("LIGHT_CELL")
    }
  }

  hideLightCell() {
    this.lightCell?.destroy()
    this.lightCell = null
  }

  showBerryTrees() {
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

      tree.setDepth(DEPTH.INANIMATE_OBJECTS).setScale(2, 2).setOrigin(0.5, 1)
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

  hideBerryTrees() {
    this.berryTrees.forEach((tree) => tree.destroy())
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
      new GameObjects.Text(this.scene, x, y, label, textStyle).setOrigin(
        0.5,
        0.5
      )
    )
    text.setDepth(DEPTH.TEXT)

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
      this.opponentAvatar = null
    }
    if (this.pveChestGroup) {
      this.pveChestGroup.destroy(true, true)
      this.pveChest = null
      this.pveChestGroup = null
    }

    if (this.mode === BoardMode.BATTLE && opponentId === "pve") {
      this.pveChestGroup = this.scene.add.group()
      this.pveChest = this.scene.add.sprite(1512, 122, "chest", "1.png")
      this.pveChest.setScale(2)
      this.pveChestGroup.add(this.pveChest)
    } else if (
      this.mode === BoardMode.BATTLE &&
      opponentAvatarString &&
      opponentId
    ) {
      let opponentLife = 0
      this.state.players.forEach((p) => {
        if (p.id === opponentId) opponentLife = p.life
      })

      // do not display avatar when player is dead
      if (opponentLife <= 0) return

      const opponentAvatar = new PokemonAvatarModel(
        this.player.opponentId,
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

      this.opponentAvatar.orientation = Orientation.DOWNLEFT
      this.opponentAvatar.updateLife(opponentLife)
      this.animationManager.animatePokemon(
        this.opponentAvatar,
        this.opponentAvatar.action,
        false
      )

      this.updateScoutingAvatars() // will remove opponent from scouting avatars if needed
    }
  }

  updateScoutingAvatars(resetAll = false) {
    const players = this.state.players
    if (!players) return

    const scoutingPlayers = values(players).filter((p) => {
      const spectatedPlayer = players[p.spectatedPlayerId]

      if (
        !spectatedPlayer ||
        spectatedPlayer.id === p.id || // can't scout yourself
        this.mode === BoardMode.TOWN || // no scouting in town
        p.id === this.opponentAvatar?.playerId // avatar already in opponent box
      )
        return false

      // will show avatar when scouting your board or your fight
      const isSpectatingBoard = spectatedPlayer.id === this.player.id
      const isSpectatingBattle =
        this.mode === BoardMode.BATTLE &&
        spectatedPlayer.simulationId === this.player.simulationId

      return isSpectatingBoard || isSpectatingBattle
    })

    /*logger.debug(
      values(players)
        .map((p) => `${p.name} (${p.id}) is watching ${p.spectatedPlayerId}`)
        .join("\n")
    )

    logger.debug(
      "scouting now",
      scoutingPlayers.map((p) => `${p.name} (${p.id})`).join("\n")
    )*/

    this.scoutingAvatars = this.scoutingAvatars.filter((avatar) => {
      // remove player avatars that stopped scouting
      if (
        resetAll ||
        scoutingPlayers.some((p) => p.id === avatar.playerId) === false
      ) {
        avatar.destroy()
        return false
      }
      return true
    })

    const newScoutingAvatars = scoutingPlayers.filter(
      (p) => this.scoutingAvatars.some((a) => a.playerId === p.id) === false
    )
    newScoutingAvatars.forEach((player) => {
      const playerIndex = values(players).findIndex((p) => p.id === player.id)
      const scoutAvatarModel = new PokemonAvatarModel(
        player.id,
        player.avatar,
        0,
        0,
        0
      )

      const scoutAvatar = new PokemonAvatar(
        this.scene,
        1512,
        218 + 48 * playerIndex,
        scoutAvatarModel,
        player.id,
        true
      )

      scoutAvatar.orientation = Orientation.DOWNLEFT
      this.animationManager.animatePokemon(
        scoutAvatar,
        scoutAvatar.action,
        false
      )

      this.scoutingAvatars.push(scoutAvatar)
    })
  }

  updateAvatarLife(playerId: string, value: number) {
    if (this.playerAvatar && this.player.id === playerId) {
      this.playerAvatar.updateLife(value)
    }

    if (this.opponentAvatar && this.opponentAvatar.playerId === playerId) {
      this.opponentAvatar.updateLife(value)
    }
  }

  battleMode() {
    // logger.debug('battleMode');
    this.mode = BoardMode.BATTLE
    this.hideLightCell()
    this.pokemons.forEach((pokemon) => {
      if (!isOnBench(pokemon)) {
        pokemon.destroy()
        this.pokemons.delete(pokemon.id)
      }
    })
    this.closeTooltips()
    this.scene.input.setDragState(this.scene.input.activePointer, 0)
    setTimeout(() => {
      const gameState = store.getState().game
      const currentPlayer = gameState.players.find(
        (p) => p.id === gameState.currentPlayerId
      )
      if (currentPlayer) {
        this.updateOpponentAvatar(
          currentPlayer.opponentId,
          currentPlayer.opponentAvatar
        )
      }
    }, 0) // need to wait for next event loop for state to be up to date
  }

  pickMode() {
    // logger.debug('pickMode');
    this.mode = BoardMode.PICK
    this.scene.setMap(this.player.map)
    this.renderBoard()
    this.updatePlayerAvatar()
    this.updateOpponentAvatar(null, null)
    this.updateScoutingAvatars(true)
  }

  minigameMode() {
    this.mode = BoardMode.TOWN
    this.scene.setMap("town")
    if (this.state.stageLevel === PortalCarouselStages[0])
      playMusic(this.scene, DungeonMusic.TREASURE_TOWN_STAGE_0)
    if (this.state.stageLevel === PortalCarouselStages[1])
      playMusic(this.scene, DungeonMusic.TREASURE_TOWN_STAGE_10)
    if (this.state.stageLevel === PortalCarouselStages[2])
      playMusic(this.scene, DungeonMusic.TREASURE_TOWN_STAGE_20)
    this.hideLightCell()
    this.hideBerryTrees()
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
    this.updateScoutingAvatars(true)
    this.scene.minigameManager?.addVillagers(
      this.scene.room?.state.townEncounter ?? null,
      store.getState().game.podium
    )
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
      this.updateScoutingAvatars(true)
    }
  }

  updatePokemonItems(playerId: string, pokemon: IPokemon, item: Item) {
    // logger.debug(change);
    if (this.player.id === playerId) {
      const pkm = this.pokemons.get(pokemon.id)
      if (pkm) {
        pkm.itemsContainer.render(pokemon.items)
      }
      if (item === Item.SHINY_STONE) {
        pkm?.addLight()
      }
    }
  }

  changePokemon<F extends NonFunctionPropNames<IPokemon>>(
    pokemon: IPokemon,
    field: F,
    value: IPokemon[F],
    previousValue: IPokemon[F]
  ) {
    const pokemonUI = this.pokemons.get(pokemon.id)
    let coordinates: number[]
    if (pokemonUI) {
      switch (field) {
        case "positionX":
          pokemonUI.positionX = value as IPokemon["positionX"]
          pokemonUI.positionY = pokemon.positionY
          coordinates = transformCoordinate(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          break

        case "positionY":
          pokemonUI.positionY = value as IPokemon["positionY"]
          pokemonUI.positionX = pokemon.positionX
          coordinates = transformCoordinate(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          if (this.mode === BoardMode.BATTLE && !isOnBench(pokemonUI)) {
            pokemonUI.destroy()
            this.pokemons.delete(pokemonUI.id)
          }
          break

        case "action":
          this.animationManager.animatePokemon(
            pokemonUI,
            value as IPokemon["action"],
            false
          )
          break

        case "hp": {
          const baseHP = getPokemonData(pokemon.name).hp
          const sizeBuff = (pokemon.hp - baseHP) / baseHP
          pokemonUI.sprite.setScale(2 + sizeBuff)
          pokemonUI.hp = value as IPokemon["hp"]
          break
        }

        case "atk":
          pokemonUI.atk = value as IPokemon["atk"]
          if ((value as IPokemon["atk"]) > (previousValue as IPokemon["atk"]))
            this.displayBoost(Stat.ATK, pokemonUI)
          break

        case "ap":
          pokemonUI.ap = value as IPokemon["ap"]
          if ((value as IPokemon["ap"]) > (previousValue as IPokemon["atk"]))
            this.displayBoost(Stat.AP, pokemonUI)
          break

        case "shiny":
          pokemonUI.shiny = value as IPokemon["shiny"]
          this.animationManager.animatePokemon(
            pokemonUI,
            pokemonUI.action,
            false
          )
          break

        case "skill":
          if (pokemonUI.skill !== value) {
            pokemonUI.skill = value as IPokemon["skill"]
            pokemonUI.evolutionAnimation()
          }
          break

        case "types":
          pokemonUI.types = new Set(values(value as IPokemon["types"]))
          break

        case "meal":
          if (pokemonUI.meal !== value) {
            pokemonUI.updateMeal(value as IPokemon["meal"])
          }
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
      if (isOnBench(pokemon)) {
        benchSize++
      }
    })

    return benchSize
  }

  showEmote(playerId: string, emote?: string) {
    const avatars = [
      this.playerAvatar,
      this.opponentAvatar,
      ...this.scoutingAvatars
    ]
    const player = avatars.find((a) => a?.playerId === playerId)
    if (player) {
      this.animationManager.play(player, AnimationConfig[player.name].emote)

      if (emote) {
        player.drawSpeechBubble(emote, player === this.opponentAvatar)
      }
    }
  }

  addSmeargle() {
    this.smeargle = new PokemonSpecial({
      scene: this.scene,
      x: 1512,
      y: 396,
      name: Pkm.SMEARGLE,
      orientation: Orientation.DOWNLEFT,
      dialog: t(`scribble_description.${this.specialGameRule}`),
      dialogTitle: t(`scribble.${this.specialGameRule}`)
    })
  }

  displayBoost(stat: Stat, pokemon: PokemonSprite) {
    pokemon.emoteAnimation()
    const coords = transformCoordinate(pokemon.positionX, pokemon.positionY)
    displayBoost(this.scene, coords[0], coords[1], stat)
  }
}
