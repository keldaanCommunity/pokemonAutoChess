import { t } from "i18next"
import { GameObjects } from "phaser"
import {
  BERRY_TREE_POSITIONS,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  getRegionTint,
  PortalCarouselStages,
  RegionDetails,
  SynergyTriggers
} from "../../../../config"
import {
  FLOWER_POTS_POSITIONS_BLUE,
  FlowerPotMons,
  FlowerPots
} from "../../../../core/flower-pots"
import { TownEncounters } from "../../../../core/town-encounters"
import Player from "../../../../models/colyseus-models/player"
import { PokemonAvatarModel } from "../../../../models/colyseus-models/pokemon-avatar"
import PokemonFactory from "../../../../models/pokemon-factory"
import { getPokemonData } from "../../../../models/precomputed/precomputed-pokemon-data"
import { PVEStage, PVEStages } from "../../../../models/pve-stages"
import GameState from "../../../../rooms/states/game-state"
import { IPokemon } from "../../../../types"
import { DungeonMusic } from "../../../../types/enum/Dungeon"
import {
  GameMode,
  GamePhaseState,
  Orientation,
  PokemonActionState,
  Stat,
  Team
} from "../../../../types/enum/Game"
import { Item } from "../../../../types/enum/Item"
import { Pkm, PkmByIndex } from "../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../types/enum/SpecialGameRule"
import { Synergy } from "../../../../types/enum/Synergy"
import { Weather } from "../../../../types/enum/Weather"
import type { NonFunctionPropNames } from "../../../../types/HelperTypes"
import { isOnBench } from "../../../../utils/board"
import { logger } from "../../../../utils/logger"
import { max } from "../../../../utils/number"
import { randomBetween } from "../../../../utils/random"
import { values } from "../../../../utils/schemas"
import { GamePokemonDetailDOMWrapper } from "../../pages/component/game/game-pokemon-detail"
import { getGameContainer } from "../../pages/game"
import { playMusic } from "../../pages/utils/audio"
import {
  transformBoardCoordinates,
  transformEntityCoordinates
} from "../../pages/utils/utils"
import { preference } from "../../preferences"
import store from "../../stores"
import { refreshShopUI } from "../../stores/GameStore"
import AnimationManager from "../animation-manager"
import { PokemonAnimations } from "../components/pokemon-animations"
import { DEPTH } from "../depths"
import GameScene from "../scenes/game-scene"
import { BerryTree } from "./berry-tree"
import PokemonSprite from "./pokemon"
import PokemonAvatar from "./pokemon-avatar"
import PokemonSpecial from "./pokemon-special"
import { Portal } from "./portal"

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
  gameMode: GameMode
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
  berryTrees: BerryTree[] = []
  flowerPots: Phaser.GameObjects.Sprite[] = []
  flowerPokemonsInPots: PokemonSprite[] = []
  mulchAmountText: Phaser.GameObjects.Text | null = null
  mulchIcon: Phaser.GameObjects.Image | null = null
  groundHoles: Phaser.GameObjects.Sprite[]
  portal: Portal | undefined
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
    this.groundHoles = []
    this.berryTrees = []
    this.flowerPots = []
    this.flowerPokemonsInPots = []

    if (state.phase == GamePhaseState.FIGHT) {
      this.battleMode(false)
    } else if (state.phase === GamePhaseState.TOWN) {
      this.renderBoard(true)
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
    const coordinates = transformBoardCoordinates(
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
    this.pokemons.get(pokemonUI.id)?.destroy()
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

  renderBoard(phaseChanged: boolean) {
    this.pokemons.forEach((p) => p.destroy())
    this.pokemons.clear()

    if (this.mode !== BoardMode.TOWN) {
      this.renderBerryTrees()
      this.renderFlowerPots()
      this.renderGroundHoles()
    }

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

    if (this.state.stageLevel in PVEStages) {
      if (phaseChanged) {
        this.addPvePokemons(PVEStages[this.state.stageLevel], false)
      } else if (this.mode === BoardMode.PICK) {
        // immediately add PVE pokemons
        this.addPvePokemons(PVEStages[this.state.stageLevel], true)
      }
    }
  }

  showLightCell() {
    this.hideLightCell()
    const lightCount = this.player.synergies.get(Synergy.LIGHT)
    if (lightCount && lightCount >= SynergyTriggers[Synergy.LIGHT][0]) {
      const coordinates = transformBoardCoordinates(this.lightX, this.lightY)
      this.lightCell = this.scene.add.sprite(
        coordinates[0],
        coordinates[1],
        "abilities",
        "LIGHT_CELL/000.png"
      )
      this.lightCell.setDepth(DEPTH.LIGHT_CELL)
      this.lightCell.setScale(2, 2)
      this.lightCell.anims.play("LIGHT_CELL")
    }
  }

  hideLightCell() {
    this.lightCell?.destroy()
    this.lightCell = null
  }

  renderBerryTrees() {
    this.berryTrees.forEach((tree) => tree.destroy())
    this.berryTrees = []
    const grassLevel = this.player.synergies.get(Synergy.GRASS) ?? 0
    const nbTrees = max(3)(
      SynergyTriggers[Synergy.GRASS].filter((n) => n <= grassLevel).length
    )

    for (let i = 0; i < nbTrees; i++) {
      const tree = new BerryTree(
        this,
        BERRY_TREE_POSITIONS[i][0],
        BERRY_TREE_POSITIONS[i][1],
        i
      )
      this.berryTrees.push(tree)
    }
  }

  hideBerryTrees() {
    this.berryTrees.forEach((tree) => tree.destroy())
    this.berryTrees = []
  }

  getNbFlowerPots(): number {
    const floraLevel = this.player.synergies.get(Synergy.FLORA) ?? 0
    let nbPots = SynergyTriggers[Synergy.FLORA].filter(
      (n) => n <= floraLevel
    ).length
    if (
      floraLevel >= 6 &&
      this.player.flowerPots.every((p) => p.evolution === Pkm.DEFAULT)
    ) {
      nbPots = 5
    }
    return nbPots
  }

  renderFlowerPots() {
    this.hideFlowerPots()
    const nbPots = this.getNbFlowerPots()

    for (let i = 0; i < nbPots; i++) {
      const potSprite = this.scene.add.sprite(
        FLOWER_POTS_POSITIONS_BLUE[i][0],
        FLOWER_POTS_POSITIONS_BLUE[i][1],
        "flower_pots",
        FlowerPots[i] + ".png"
      )

      potSprite
        .setDepth(
          i % 2 ? DEPTH.INANIMATE_OBJECTS : DEPTH.INANIMATE_OBJECTS + 0.1
        )
        .setScale(2, 2)
        .setOrigin(0.5, 0.5)
        .setTint(
          getRegionTint(this.scene.mapName, preference("colorblindMode"))
        )
      const potPokemon = this.player.flowerPots[i]

      const simulation = this.scene?.room?.state.simulations.get(
        this.player.simulationId
      )
      const isOnBattle =
        this.mode === BoardMode.BATTLE &&
        simulation?.started &&
        values(simulation.blueDpsMeter).some((p) => p.id === potPokemon.id)

      if (potPokemon && !isOnBattle) {
        const flowerInPot = new PokemonSprite(
          this.scene,
          FLOWER_POTS_POSITIONS_BLUE[i][0],
          FLOWER_POTS_POSITIONS_BLUE[i][1] - 24,
          potPokemon,
          this.player.id,
          false,
          false
        )
        this.animationManager.animatePokemon(
          flowerInPot,
          PokemonActionState.SLEEP,
          false,
          true
        )
        flowerInPot.draggable = false
        this.flowerPokemonsInPots.push(flowerInPot)
        this.pokemons.set(flowerInPot.id, flowerInPot)
      }

      this.flowerPots.push(potSprite)
    }

    this.updateMulchCount()
  }

  updateMulchCount() {
    const nbPots = this.getNbFlowerPots()
    if (nbPots === 0) {
      this.mulchAmountText?.destroy()
      this.mulchAmountText = null
      this.mulchIcon?.destroy()
      this.mulchIcon = null
      return
    }

    if (this.mulchAmountText === null) {
      this.mulchAmountText = this.displayText(348, 622, "").setOrigin(0, 0)
    }
    this.mulchAmountText.setText(`${this.player.mulch}/${this.player.mulchCap}`)
    if (this.mulchIcon === null) {
      const mulchCollected =
        this.player.items.filter((i) => i === Item.RICH_MULCH).length +
        this.player.flowerPots.reduce((acc, pot) => acc + pot.stars, 0) -
        8
      this.mulchIcon = this.scene.add.image(
        332,
        636,
        "item",
        `${mulchCollected >= 8 ? Item.AMAZE_MULCH : Item.RICH_MULCH}.png`
      )
      this.mulchIcon.setScale(0.25).setDepth(DEPTH.TEXT)
    }
  }

  hideFlowerPots() {
    this.flowerPots.forEach((pot) => pot.destroy())
    this.flowerPokemonsInPots.forEach((p) => {
      p.destroy()
      this.pokemons.delete(p.id)
    })
    this.flowerPots = []
    this.flowerPokemonsInPots = []
    if (this.mulchAmountText) {
      this.mulchAmountText.destroy()
      this.mulchAmountText = null
    }
    if (this.mulchIcon) {
      this.mulchIcon?.destroy()
      this.mulchIcon = null
    }
  }

  renderGroundHoles() {
    this.groundHoles.forEach((hole) => hole.destroy())
    this.groundHoles = []
    for (let row = 0; row < BOARD_HEIGHT / 2; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        let trenchWidth = 0
        const index = col + row * BOARD_WIDTH
        while (
          col + trenchWidth < BOARD_WIDTH &&
          this.player.groundHoles[index + trenchWidth] === 5
        ) {
          trenchWidth++
        }
        if (trenchWidth >= 2) {
          // trench
          const [x, y] = transformBoardCoordinates(col, row + 1)
          const trench = this.scene.add
            .sprite(x - 44, y + 10, "ground_holes", `trench${trenchWidth}.png`)
            .setOrigin(0, 0.5)
            .setScale(2)
            .setAlpha(0.9)
            .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
            .setTint(
              getRegionTint(this.scene.mapName, preference("colorblindMode"))
            )
          this.groundHoles.push(trench)
          col += trenchWidth - 1
        } else {
          // single hole
          const hole = this.player.groundHoles[index]
          if (hole > 0) {
            const [x, y] = transformBoardCoordinates(col, row + 1)
            const groundHole = this.scene.add
              .sprite(x, y + 10, "ground_holes", `hole${hole}.png`)
              .setScale(2)
              .setDepth(DEPTH.BOARD_EFFECT_GROUND_LEVEL)
              .setTint(
                getRegionTint(this.scene.mapName, preference("colorblindMode"))
              )
            this.groundHoles.push(groundHole)
          }
        }
      }
    }
  }

  hideGroundHoles() {
    this.groundHoles.forEach((hole) => hole.destroy())
    this.groundHoles = []
  }

  displayText(x: number, y: number, label: string, tweenOut: boolean = false) {
    const textStyle = {
      fontSize: "24px",
      fontFamily: "Jost",
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

    if (tweenOut) {
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

    return text
  }

  updatePlayerAvatar() {
    if (this.playerAvatar) {
      this.playerAvatar.destroy()
    }
    if (this.player.life <= 0) return // do not display avatar when player is dead
    if (this.state.phase === GamePhaseState.TOWN) return // do not display avatar in town since it is on board
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
      this.pveChest
        .setScale(2)
        .setTint(
          getRegionTint(this.scene.mapName, preference("colorblindMode"))
        )
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
      const spectatedPlayer = players.get(p.spectatedPlayerId)

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
    if (
      this.playerAvatar &&
      this.playerAvatar.scene &&
      this.player.id === playerId
    ) {
      this.playerAvatar.updateLife(value)
    }

    if (
      this.opponentAvatar &&
      this.opponentAvatar.scene &&
      this.opponentAvatar.playerId === playerId
    ) {
      this.opponentAvatar.updateLife(value)
    }
  }

  battleMode(phaseChanged: boolean) {
    // logger.debug('battleMode');
    this.mode = BoardMode.BATTLE
    this.hideLightCell()
    if (!phaseChanged) this.removePokemonsOnBoard() // remove immediately board sprites if arriving in battle mode
    this.scene.closeTooltips()
    this.scene.input.setDragState(this.scene.input.activePointer, 0)
    setTimeout(() => {
      const gameState = store.getState().game
      const currentPlayer = gameState.players.find(
        (p) => p.id === gameState.currentPlayerId
      )
      if (currentPlayer) {
        const isPVERound = currentPlayer.opponentId === "pve"
        const isRedPlayer = gameState.currentTeam === Team.RED_TEAM
        if (!isPVERound && phaseChanged) {
          this.portalTransition(isRedPlayer)
        } else {
          this.updateOpponentAvatar(
            currentPlayer.opponentId,
            currentPlayer.opponentAvatar
          )
        }
      }
    }, 0) // need to wait for next event loop for state to be up to date
  }

  removePokemonsOnBoard() {
    this.pokemons.forEach((pkmSprite) => {
      if (
        !isOnBench(pkmSprite) &&
        !(
          FlowerPotMons.includes(PkmByIndex[pkmSprite.pokemon.index]) &&
          pkmSprite.positionY === -1
        )
      ) {
        pkmSprite.destroy()
        this.pokemons.delete(pkmSprite.id)
      }
    })
  }

  pickMode() {
    // logger.debug('pickMode');
    this.mode = BoardMode.PICK
    this.scene.setMap(this.player.map)
    if (
      this.scene.cache.audio.has(
        "music_" + RegionDetails[this.player.map].music
      ) &&
      PortalCarouselStages.includes(this.state.stageLevel)
    ) {
      // play back original region music when leaving town
      playMusic(this.scene, RegionDetails[this.player.map].music)
    }
    this.renderBoard(true)
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
    this.hideFlowerPots()
    this.hideGroundHoles()
    this.removePokemonsOnBoard()
    this.scene.board?.pokemons.forEach((p) => p.setAlpha(1))
    this.scene.closeTooltips()
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
      this.renderBoard(false)
      this.updatePlayerAvatar()
      this.updateOpponentAvatar(
        this.player.opponentId,
        this.player.opponentAvatar
      )
      this.updateScoutingAvatars(true)
    }
  }

  updatePokemonItems(
    playerId: string,
    pokemon: IPokemon,
    item: Item,
    removed: boolean = false
  ) {
    // logger.debug(change);
    if (this.player.id === playerId) {
      const pkm = this.pokemons.get(pokemon.id)
      if (pkm) {
        pkm.itemsContainer.render(pokemon.items)
      }
      if (item === Item.SHINY_STONE) {
        if (removed) {
          pkm?.removeLight()
        } else {
          pkm?.addLight()
        }
      }
      if (item === Item.BERSERK_GENE) {
        if (removed) {
          pkm?.removeBerserkEffect()
        } else {
          pkm?.addBerserkEffect()
        }
      }
      if (item === Item.AIR_BALLOON) {
        if (removed) {
          pkm?.removeFloatingAnimation()
        } else {
          pkm?.addFloatingAnimation()
        }
      }
    }
  }

  updatePokemonDishes(playerId: string, pokemon: IPokemon, dishes: Item[]) {
    if (this.player.id === playerId) {
      const pokemonUI = this.pokemons.get(pokemon.id)
      if (pokemonUI) {
        pokemonUI.updateDishes(dishes)
      }
    }
  }

  changePokemon<F extends NonFunctionPropNames<IPokemon>>(
    pokemon: IPokemon,
    field: F,
    value: IPokemon[F],
    previousValue?: IPokemon[F]
  ) {
    const pokemonUI = this.pokemons.get(pokemon.id)
    let coordinates: number[]
    if (pokemonUI) {
      switch (field) {
        case "positionX":
          pokemonUI.positionX = value as IPokemon["positionX"]
          pokemonUI.positionY = pokemon.positionY
          coordinates = transformBoardCoordinates(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          store.dispatch(refreshShopUI())
          break

        case "positionY": {
          pokemonUI.positionY = value as IPokemon["positionY"]
          pokemonUI.positionX = pokemon.positionX
          coordinates = transformBoardCoordinates(
            pokemon.positionX,
            pokemon.positionY
          )
          pokemonUI.x = coordinates[0]
          pokemonUI.y = coordinates[1]
          const simulation = this.scene?.room?.state.simulations.get(
            this.player.simulationId
          )
          if (
            this.mode === BoardMode.BATTLE &&
            !isOnBench(pokemonUI) &&
            simulation?.started
          ) {
            pokemonUI.destroy()
            this.pokemons.delete(pokemonUI.id)
          }
          store.dispatch(refreshShopUI())
          break
        }

        case "action":
          this.animationManager.animatePokemon(
            pokemonUI,
            value as IPokemon["action"],
            false
          )
          break

        case "hp":
        case "maxHP": {
          const baseHP = getPokemonData(pokemon.name).hp
          const sizeBuff = (pokemon.hp - baseHP) / baseHP
          pokemonUI.sprite.setScale(2 + sizeBuff)
          if (previousValue != null && value && value > previousValue)
            pokemonUI.displayBoost(Stat.HP)
          break
        }

        case "atk":
          if (previousValue != null && value && value > previousValue)
            pokemonUI.displayBoost(Stat.ATK)
          break

        case "def":
          if (previousValue != null && value && value > previousValue)
            pokemonUI.displayBoost(Stat.DEF)
          break

        case "speed":
          if (previousValue != null && value && value > previousValue)
            pokemonUI.displayBoost(Stat.SPEED)
          break

        case "ap":
          if (previousValue != null && value && value > previousValue)
            pokemonUI.displayBoost(Stat.AP)
          if (pokemonUI.detail instanceof GamePokemonDetailDOMWrapper) {
            pokemonUI.detail.updatePokemon(pokemonUI.pokemon)
          }
          break

        case "luck":
          if (previousValue != null && value && value > previousValue)
            pokemonUI.displayBoost(Stat.LUCK)
          if (pokemonUI.detail instanceof GamePokemonDetailDOMWrapper) {
            pokemonUI.detail.updatePokemon(pokemonUI.pokemon)
          }
          break

        case "shiny":
          this.animationManager.animatePokemon(
            pokemonUI,
            pokemonUI.action,
            false
          )
          break

        case "index":
          if (previousValue != null && value !== previousValue) {
            pokemonUI.evolutionAnimation()
          }
          break

        case "skill":
          if (previousValue != null && value !== previousValue) {
            pokemonUI.evolutionAnimation()
          }
          break

        case "supercharged":
          if (value === true && previousValue === false) {
            pokemonUI.superchargeAnimation(this.scene, false, false)
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
        pokemon.itemsContainer.closeTooltips()
      }
    })
    for (const tree of this.berryTrees.values()) {
      tree.closeDetail()
    }
    this.flowerPokemonsInPots.forEach((pokemon) => {
      if (pokemon.detail) {
        pokemon.closeDetail()
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
      this.animationManager.play(player, PokemonAnimations[player.name].emote)

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

  addPvePokemons(pveStage: PVEStage, immediately: boolean) {
    pveStage.board.forEach(([pkm, boardX, boardY], i) => {
      const [x, y] = transformEntityCoordinates(boardX, boardY - 1, true)
      const id = `pve_${this.state.stageLevel}_${i}`

      const pokemon = PokemonFactory.createPokemonFromName(pkm, {
        shiny: this.state.shinyEncounter
      })
      for (const stat in pveStage.statBoosts) {
        pokemon.applyStat(stat as Stat, pveStage.statBoosts[stat], undefined)
      }
      if (
        this.state.townEncounter === TownEncounters.MAROWAK &&
        pveStage.marowakItems &&
        i in pveStage.marowakItems
      ) {
        pveStage.marowakItems[i]!.forEach((item) => pokemon.items.add(item))
      }

      const pkmSprite = new PokemonSprite(
        this.scene,
        x,
        y,
        pokemon,
        id,
        false,
        false
      )

      this.pokemons.set(id, pkmSprite)
      pkmSprite.setDepth(DEPTH.POKEMON)

      if (immediately) {
        pkmSprite.orientation = Orientation.DOWNLEFT
        this.scene.animationManager?.animatePokemon(
          pkmSprite,
          PokemonActionState.IDLE,
          false
        )
      } else {
        pkmSprite.y -= 500
        pkmSprite.orientation = Orientation.DOWN
        pkmSprite.pokemon.action = PokemonActionState.WALK

        this.scene.tweens.add({
          targets: pkmSprite,
          y,
          ease: "Linear",
          duration: 3000,
          onComplete: () => {
            if (pkmSprite) {
              pkmSprite.orientation = Orientation.DOWNLEFT
              this.scene.animationManager?.animatePokemon(
                pkmSprite,
                PokemonActionState.IDLE,
                false
              )
            }
          }
        })
      }
    })
  }

  addPortal() {
    if (this.portal) this.portal.destroy()
    const [x, y] = transformBoardCoordinates(3.5, 5)
    this.portal = new Portal(this.scene, "portal", x, y).setScale(0)
    this.scene.tweens.add({
      targets: this.portal,
      scale: 1.5,
      duration: 5000,
      ease: Phaser.Math.Easing.Sine.Out
    })
  }

  portalTransition(isRedPlayer: boolean) {
    const [portalX, portalY] = transformBoardCoordinates(3.5, 5)
    const opponent = values(this.state.players).find(
      (p) => p.id === this.player.opponentId
    )
    if (!opponent) {
      logger.error("No opponent found for portal transition")
      return
    }

    if (isRedPlayer) {
      // avatar goes first in the portal
      if (this.playerAvatar != null) {
        this.scene.tweens.add({
          targets: this.playerAvatar,
          ease: Phaser.Math.Easing.Quadratic.In,
          duration: 700,
          scale: 0,
          x: portalX,
          y: portalY
        })
      }

      // move board pokemons into the portal
      const pokemonsToTeleport = [...this.pokemons.values()].filter(
        (p) => FlowerPotMons.includes(PkmByIndex[p.pokemon.index]) === false
      )
      for (const pokemon of pokemonsToTeleport) {
        const delay = randomBetween(0, 300)
        this.scene.tweens.add({
          targets: pokemon,
          ease: Phaser.Math.Easing.Quadratic.In,
          delay,
          duration: 700,
          scale: 0,
          x: portalX,
          y: portalY
        })
      }

      // portal close
      this.scene.tweens.add({
        targets: this.portal,
        ease: Phaser.Math.Easing.Quadratic.In,
        delay: 700,
        duration: 300,
        scale: 0,
        onComplete: () => {
          // switch to opponent map

          this.scene.setMap(opponent.map)

          const simulation = this.scene?.room?.state.simulations.get(
            this.player.simulationId
          )
          if (simulation && simulation.weather === Weather.DROUGHT) {
            // postFX on tilemap layers, needs to be reapplied again if changing map
            getGameContainer().handleWeatherChange(
              simulation,
              simulation.weather
            )
          }

          // move portal to the other side when spawning
          const [x, y] = transformBoardCoordinates(3.5, 2)
          this.portal?.setPosition(x, y).setScale(1)

          // show the opponent pokemons
          opponent.board.forEach((pokemon) => {
            if (isOnBench(pokemon)) return
            const [x, y] = transformEntityCoordinates(
              pokemon.positionX,
              pokemon.positionY - 1,
              true
            )
            const pokemonSprite = new PokemonSprite(
              this.scene,
              x,
              y,
              pokemon,
              this.player.opponentId,
              false,
              false
            )
            this.animationManager.animatePokemon(
              pokemonSprite,
              PokemonActionState.IDLE,
              false
            )
            this.pokemons.get(pokemonSprite.id)?.destroy()
            this.pokemons.set(pokemonSprite.id, pokemonSprite)
          })

          // show the opponent avatar
          this.updateOpponentAvatar(opponent.id, opponent.avatar)

          // replace the red pokemon avatar
          if (this.playerAvatar) {
            this.playerAvatar.x = x
            this.playerAvatar.y = y
            this.scene.tweens.add({
              targets: this.playerAvatar,
              ease: Phaser.Math.Easing.Quadratic.Out,
              duration: 1000,
              scale: 1,
              x: 504,
              y: 696,
              onStart: () => {
                if (this.playerAvatar) {
                  this.animationManager.animatePokemon(
                    this.playerAvatar,
                    PokemonActionState.HOP,
                    false,
                    false
                  )
                }
              }
            })
          }

          // replace the red pokemons
          pokemonsToTeleport.forEach((pokemon) => {
            const [originalX, originalY] = transformBoardCoordinates(
              pokemon.positionX,
              pokemon.positionY
            )
            pokemon.x = x
            pokemon.y = y
            const delay = randomBetween(0, 300)
            this.scene.tweens.add({
              targets: pokemon,
              ease: Phaser.Math.Easing.Quadratic.Out,
              delay,
              duration: 700,
              scale: 1,
              x: originalX,
              y: originalY,
              onStart: () => {
                this.animationManager.animatePokemon(
                  pokemon,
                  PokemonActionState.HOP,
                  false,
                  false
                )
              }
            })
          })

          // close the other side portal
          this.scene.tweens.add({
            targets: this.portal,
            ease: Phaser.Math.Easing.Cubic.In,
            delay: 700,
            duration: 300,
            scale: 0,
            onComplete: () => {
              this.portal?.destroy()
              this.portal = undefined
            }
          })
        }
      })
    } else {
      // opponent avatar move out of the portal
      this.updateOpponentAvatar(opponent.id, opponent.avatar)
      if (this.opponentAvatar) {
        this.opponentAvatar.x = portalX
        this.opponentAvatar.y = portalY
        this.opponentAvatar.setScale(0)
        this.scene.tweens.add({
          targets: this.opponentAvatar,
          ease: Phaser.Math.Easing.Quadratic.Out,
          duration: 1500,
          scale: 1,
          x: 1512,
          y: 122,
          onStart: () => {
            if (this.opponentAvatar) {
              this.animationManager.animatePokemon(
                this.opponentAvatar,
                PokemonActionState.HOP,
                false,
                false
              )
            }
          }
        })
      }

      // opponent pokemons move out of the portal
      setTimeout(() => {
        const opponent = values(this.state.players).find(
          (p) => p.id === this.player.opponentId
        )
        if (!opponent) return
        opponent.board.forEach((pokemon) => {
          if (isOnBench(pokemon)) return
          const pokemonSprite = new PokemonSprite(
            this.scene,
            portalX,
            portalY,
            pokemon,
            this.player.opponentId,
            false,
            false
          )
          pokemonSprite.setScale(0)
          this.pokemons.get(pokemonSprite.id)?.destroy()
          this.pokemons.set(pokemonSprite.id, pokemonSprite)

          const [originalX, originalY] = transformEntityCoordinates(
            pokemon.positionX,
            pokemon.positionY - 1,
            true
          )
          const delay = randomBetween(0, 300)
          this.scene.tweens.add({
            targets: pokemonSprite,
            ease: Phaser.Math.Easing.Quadratic.Out,
            delay,
            duration: 700,
            scale: 1,
            x: originalX,
            y: originalY,
            onStart: () => {
              this.animationManager.animatePokemon(
                pokemonSprite,
                PokemonActionState.HOP,
                false,
                false
              )
            }
          })
        })
      }, 1000)

      // close portal
      this.scene.tweens.add({
        targets: this.portal,
        ease: Phaser.Math.Easing.Cubic.In,
        delay: 1700,
        duration: 300,
        scale: 0,
        onComplete: () => {
          this.portal?.destroy()
          this.portal = undefined
        }
      })
    }
  }
}
