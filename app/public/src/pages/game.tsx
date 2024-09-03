import { type NonFunctionPropNames } from "@colyseus/schema/lib/types/HelperTypes"
import { Client, Room } from "colyseus.js"
import firebase from "firebase/compat/app"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import AfterGameState from "../../../rooms/states/after-game-state"
import GameState from "../../../rooms/states/game-state"
import {
  IBoardEvent,
  IDps,
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  IExperienceManager,
  IPlayer,
  ISimplePlayer,
  Role,
  Transfer
} from "../../../types"
import { RequiredStageLevelForXpElligibility } from "../../../types/Config"
import { DungeonDetails } from "../../../types/enum/Dungeon"
import { Team } from "../../../types/enum/Game"
import { Pkm } from "../../../types/enum/Pokemon"
import { getFreeSpaceOnBench } from "../../../utils/board"
import { logger } from "../../../utils/logger"
import { addWanderingPokemon } from "../game/components/pokemon"
import GameContainer from "../game/game-container"
import GameScene from "../game/scenes/game-scene"
import { selectCurrentPlayer, useAppDispatch, useAppSelector } from "../hooks"
import store from "../stores"
import {
  addDpsMeter,
  addPlayer,
  changeDpsMeter,
  changePlayer,
  leaveGame,
  removeDpsMeter,
  removePlayer,
  setAdditionalPokemons,
  updateExperienceManager,
  setInterest,
  setItemsProposition,
  setLife,
  setLoadingProgress,
  setMoney,
  setNoELO,
  setPhase,
  setPokemonCollection,
  setPokemonProposition,
  setRoundTime,
  setShop,
  setShopLocked,
  setStageLevel,
  setStreak,
  setSynergies,
  setWeather
} from "../stores/GameStore"
import { joinGame, logIn, setProfile } from "../stores/NetworkStore"
import GameDpsMeter from "./component/game/game-dps-meter"
import GameFinalRank from "./component/game/game-final-rank"
import GameItemsProposition from "./component/game/game-items-proposition"
import GameLoadingScreen from "./component/game/game-loading-screen"
import GamePlayers from "./component/game/game-players"
import GamePokemonsProposition from "./component/game/game-pokemons-proposition"
import GameShop from "./component/game/game-shop"
import GameStageInfo from "./component/game/game-stage-info"
import GameSynergies from "./component/game/game-synergies"
import GameToasts from "./component/game/game-toasts"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { playMusic, preloadMusic } from "./utils/audio"
import { LocalStoreKeys, localStore } from "./utils/store"
import { FIREBASE_CONFIG } from "./utils/utils"

let gameContainer: GameContainer

export function getGameContainer(): GameContainer {
  return gameContainer
}

export function getGameScene(): GameScene | undefined {
  return gameContainer?.game?.scene?.getScene<GameScene>("gameScene")
}

export default function Game() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const client: Client = useAppSelector((state) => state.network.client)
  const room: Room<GameState> | undefined = useAppSelector(
    (state) => state.network.game
  )
  const uid: string = useAppSelector((state) => state.network.uid)
  const currentPlayerId: string = useAppSelector(
    (state) => state.game.currentPlayerId
  )
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const spectate = currentPlayerId !== uid || !currentPlayer?.alive

  const initialized = useRef<boolean>(false)
  const connecting = useRef<boolean>(false)
  const connected = useRef<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [connectError, setConnectError] = useState<string>("")
  const [finalRank, setFinalRank] = useState<number>(0)
  const [finalRankVisible, setFinalRankVisible] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  const MAX_ATTEMPS_RECONNECT = 3

  const connectToGame = useCallback(
    async (attempts = 1) => {
      logger.debug(
        `connectToGame attempt ${attempts} / ${MAX_ATTEMPS_RECONNECT}`
      )
      const cachedReconnectionToken = localStore.get(
        LocalStoreKeys.RECONNECTION_GAME
      )?.reconnectionToken
      if (cachedReconnectionToken) {
        connecting.current = true
        const statusMessage = document.querySelector("#status-message")
        if (statusMessage) {
          statusMessage.textContent = `Connecting to game...`
        }

        client
          .reconnect(cachedReconnectionToken)
          .then((room: Room) => {
            // store game token for 1 hour
            localStore.set(
              LocalStoreKeys.RECONNECTION_GAME,
              { reconnectionToken: room.reconnectionToken, roomId: room.roomId },
              60 * 60
            )
            dispatch(joinGame(room))
            connected.current = true
            connecting.current = false
          })
          .catch((error) => {
            if (attempts < MAX_ATTEMPS_RECONNECT) {
              setTimeout(async () => await connectToGame(attempts + 1), 1000)
            } else {
              let connectError = error.message
              if (error.code === 4212) {
                // room disposed
                connectError = "This game does no longer exist"
              }
              //TODO: handle more known error codes with informative messages
              setConnectError(connectError)
              logger.error("reconnect error", error)
            }
          })
      } else {
        navigate("/") // no reconnection token, login again
      }
    },
    [client, dispatch, navigate]
  )

  function playerClick(id: string) {
    const scene = getGameScene()
    if (scene?.spectate) {
      // if spectating game we switch directly without notifying the server to not show spectators avatars
      if (room?.state?.players) {
        const spectatedPlayer = room?.state?.players.get(id)
        const gameContainer = getGameContainer()
        if (spectatedPlayer) {
          gameContainer.setPlayer(spectatedPlayer)

          const simulation = room.state.simulations.get(
            spectatedPlayer.simulationId
          )
          if (simulation) {
            gameContainer.setSimulation(simulation)
          }
        }

        gameContainer.gameScene?.board?.updateScoutingAvatars()
      }
    } else {
      room?.send(Transfer.SPECTATE, id)
    }
  }

  const leave = useCallback(async () => {
    const savedPlayers = new Array<ISimplePlayer>()

    const token = await firebase.auth().currentUser?.getIdToken()

    if (gameContainer && gameContainer.game) {
      gameContainer.game.destroy(true)
    }

    const nbPlayers = room?.state.players.size ?? 0

    if (nbPlayers > 0) {
      room?.state.players.forEach((player) =>
        savedPlayers.push(gameContainer.transformToSimplePlayer(player))
      )
    }

    const elligibleToXP =
      nbPlayers >= 2 &&
      (room?.state.stageLevel ?? 0) >= RequiredStageLevelForXpElligibility
    const elligibleToELO =
      elligibleToXP &&
      !room?.state.noElo &&
      savedPlayers.filter((p) => p.role !== Role.BOT).length >= 4

    const r: Room<AfterGameState> = await client.create("after-game", {
      players: savedPlayers,
      idToken: token,
      elligibleToXP,
      elligibleToELO
    })
    localStore.set(LocalStoreKeys.RECONNECTION_AFTER_GAME, { reconnectionToken: r.reconnectionToken, roomId: r.roomId }, 30)
    if (r.connection.isOpen) {
      r.connection.close()
    }
    dispatch(leaveGame())
    navigate("/after")

    try {
      await room?.leave()
    } catch (error) {
      logger.warn("Room already closed")
    }
  }, [client, dispatch, navigate, room])

  useEffect(() => {
    // create a history entry to prevent back button switching page immediately, and leave game properly instead
    window.history.pushState(null, "", window.location.href);
    const confirmLeave = () => {
      if (confirm("Do you want to leave game ?")) {
        leave()
      } else {
        // push again another entry to prevent back button from switching page, effectively canceling the back action
        window.history.pushState(null, "", window.location.href);
      }
    }
    // when pressing back button, properly leave game
    window.addEventListener("popstate", confirmLeave)
    return () => {
      window.removeEventListener("popstate", confirmLeave)
    }
  }, [])

  useEffect(() => {
    const connect = () => {
      logger.debug("connecting to game")
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG)
      }

      firebase.auth().onAuthStateChanged(async (user) => {
        if (user && !connecting.current) {
          connecting.current = true
          dispatch(logIn(user))
          await connectToGame()
        }
      })
    }

    if (!connected.current) {
      connect()
    } else if (
      !initialized.current &&
      room != undefined &&
      container?.current
    ) {
      logger.debug("initializing game")
      initialized.current = true

      gameContainer = new GameContainer(container.current, uid, room)

      const gameElm = document.getElementById("game")
      gameElm?.addEventListener(Transfer.DRAG_DROP, ((
        event: CustomEvent<IDragDropMessage>
      ) => {
        gameContainer.onDragDrop(event)
      }) as EventListener)
      gameElm?.addEventListener(Transfer.DRAG_DROP_ITEM, ((
        event: CustomEvent<IDragDropItemMessage>
      ) => {
        gameContainer.onDragDropItem(event)
      }) as EventListener)
      gameElm?.addEventListener(Transfer.DRAG_DROP_COMBINE, ((
        event: CustomEvent<IDragDropCombineMessage>
      ) => {
        gameContainer.onDragDropCombine(event)
      }) as EventListener)

      room.onMessage(Transfer.LOADING_COMPLETE, () => {
        setLoaded(true)
      })
      room.onMessage(Transfer.FINAL_RANK, (finalRank) => {
        setFinalRank(finalRank)
        setFinalRankVisible(true)
      })
      room.onMessage(Transfer.PRELOAD_MAPS, async (maps) => {
        logger.info("preloading maps", maps)
        const gameScene = getGameScene()
        if (gameScene) {
          gameScene.load.reset()
          await gameScene.preloadMaps(maps)
          gameScene.load.once("complete", () => {
            const gc = getGameContainer()
            gc && gc.player && gameScene.setMap(gc.player.map)
          })
          gameScene.load.start()
        }
      })
      room.onMessage(Transfer.SHOW_EMOTE, (message) => {
        const g = getGameScene()
        if (g?.minigameManager?.pokemons?.size && g.minigameManager.pokemons.size > 0) {
          // early return here to prevent showing animation twice
          return g.minigameManager?.showEmote(message.id, message?.emote)
        }

        if (g && g.board) {
          g.board.showEmote(message.id, message?.emote)
        }
      })

      room.onMessage(Transfer.POKEMON_DAMAGE, (message) => {
        gameContainer.handleDisplayDamage(message)
      })

      room.onMessage(Transfer.ABILITY, (message) => {
        gameContainer.handleDisplayAbility(message)
      })

      room.onMessage(Transfer.POKEMON_HEAL, (message) => {
        gameContainer.handleDisplayHeal(message)
      })

      room.onMessage(Transfer.PLAYER_DAMAGE, (value) => {
        toast(
          <div className="toast-player-damage">
            <span style={{ verticalAlign: "middle" }}>-{value}</span>
            <img className="icon-life" src="/assets/ui/heart.png" alt="❤" />
          </div>,
          { containerId: "toast-life" }
        )
      })

      room.onMessage(Transfer.PLAYER_INCOME, (value) => {
        toast(
          <div className="toast-player-income">
            <span style={{ verticalAlign: "middle" }}>+{value}</span>
            <img className="icon-money" src="/assets/icons/money.svg" alt="$" />
          </div>,
          { containerId: "toast-money" }
        )
      })

      room.onMessage(Transfer.UNOWN_WANDERING, () => {
        if (gameContainer.game) {
          const g = getGameScene()
          if (g && g.unownManager) {
            g.unownManager.addWanderingUnown()
          }
        }
      })

      room.onMessage(Transfer.POKEMON_WANDERING, (pokemon: Pkm) => {
        const scene = getGameScene()
        if (scene) {
          addWanderingPokemon(scene, pokemon, (sprite, pointer, tween) => {
            if (
              scene.board &&
              getFreeSpaceOnBench(scene.board.player.board) > 0
            ) {
              room.send(Transfer.POKEMON_WANDERING, pokemon)
              sprite.destroy()
              tween.destroy()
            } else if (scene.board) {
              scene.board.displayText(pointer.x, pointer.y, t("full"))
            }
          })
        }
      })

      room.onMessage(Transfer.BOARD_EVENT, (event: IBoardEvent) => {
        if (gameContainer.game) {
          const g = getGameScene()
          if (g?.battle?.simulation?.id === event.simulationId) {
            g.battle.displayBoardEvent(event)
          }
        }
      })

      room.onMessage(
        Transfer.CLEAR_BOARD,
        (event: { simulationId: string }) => {
          if (gameContainer.game) {
            const g = getGameScene()
            if (g?.battle?.simulation?.id === event.simulationId) {
              g.battle.clearBoardEvents()
            }
          }
        }
      )

      room.onMessage(Transfer.SIMULATION_STOP, () => {
        if (gameContainer.game) {
          const g = getGameScene()
          if (g && g.battle) {
            g.battle.clear()
          }
        }
      })

      room.onMessage(Transfer.GAME_END, leave)

      room.onMessage(Transfer.USER_PROFILE, (user: IUserMetadata) => {
        dispatch(setProfile(user))
      })

      room.state.listen("roundTime", (value) => {
        dispatch(setRoundTime(value))
      })

      room.state.listen("phase", (newPhase, previousPhase) => {
        if (gameContainer.game) {
          const g = getGameScene()
          if (g) {
            g.updatePhase(newPhase, previousPhase)
          }
        }
        dispatch(setPhase(newPhase))
      })

      room.state.listen("stageLevel", (value) => {
        dispatch(setStageLevel(value))
      })

      room.state.listen("noElo", (value) => {
        dispatch(setNoELO(value))
      })

      room.state.additionalPokemons.onAdd(() => {
        dispatch(setAdditionalPokemons([...room.state.additionalPokemons]))
      })

      room.state.simulations.onRemove(() => {
        gameContainer.resetSimulation()
      })

      room.state.simulations.onAdd((simulation) => {
        gameContainer.initializeSimulation(simulation)

        simulation.listen("weather", (value) => {
          dispatch(setWeather({ id: simulation.id, value: value }))
        })

        const teams = [Team.BLUE_TEAM, Team.RED_TEAM]
        teams.forEach((team) => {
          const dpsMeter =
            team === Team.BLUE_TEAM
              ? simulation.blueDpsMeter
              : simulation.redDpsMeter
          dpsMeter.onAdd((dps) => {
            dispatch(addDpsMeter({ value: dps, id: simulation.id, team }))
            const fields: NonFunctionPropNames<IDps>[] = [
              "id",
              "name",
              "physicalDamage",
              "specialDamage",
              "trueDamage",
              "heal",
              "shield",
              "physicalDamageReduced",
              "specialDamageReduced",
              "shieldDamageTaken"
            ]
            fields.forEach((field) => {
              dps.listen(field, (value) => {
                dispatch(
                  changeDpsMeter({
                    id: dps.id,
                    team,
                    field: field,
                    value: value,
                    simulationId: simulation.id
                  })
                )
              })
            })
          })

          dpsMeter.onRemove(() => {
            dispatch(removeDpsMeter({ simulationId: simulation.id, team }))
          })
        })
      })

      room.state.players.onAdd((player) => {
        gameContainer.initializePlayer(player)
        dispatch(addPlayer(player))

        if (player.id == uid) {
          dispatch(setInterest(player.interest))
          dispatch(setStreak(player.streak))
          dispatch(setShopLocked(player.shopLocked))
          dispatch(setPokemonCollection(player.pokemonCollection))

          player.listen("interest", (value) => {
            dispatch(setInterest(value))
          })
          player.listen("shop", (value) => {
            dispatch(setShop(value))
          })
          player.listen("shopLocked", (value) => {
            dispatch(setShopLocked(value))
          })
          player.listen("money", (value) => {
            dispatch(setMoney(value))
          })
          player.listen("streak", (value) => {
            dispatch(setStreak(value))
          })
        }
        player.listen("life", (value, previousValue) => {
          dispatch(setLife({ id: player.id, value: value }))
          if (
            value <= 0 &&
            value !== previousValue &&
            player.id === uid &&
            !spectate
          ) {
            setFinalRankVisible(true)
          }
        })
        player.listen("experienceManager", (experienceManager) => {
          if (player.id === uid) {
            dispatch(updateExperienceManager(experienceManager))
            const fields: NonFunctionPropNames<IExperienceManager>[] = [
              "experience",
              "expNeeded",
              "level"
            ]
            fields.forEach((field) => {
              experienceManager.listen(field, (value) => {
                dispatch(updateExperienceManager({ ...experienceManager, [field]: value } as IExperienceManager))
              })
            })
          }
        })
        player.listen("loadingProgress", (value) => {
          dispatch(setLoadingProgress({ id: player.id, value: value }))
        })
        player.listen("map", (newMap) => {
          if (player.id === store.getState().game.currentPlayerId) {
            const gameScene = getGameScene()
            if (gameScene) {
              gameScene.setMap(newMap)
              const alreadyLoading = gameScene.load.isLoading()
              if (!alreadyLoading) {
                gameScene.load.reset()
              }
              preloadMusic(gameScene, DungeonDetails[newMap].music)
              gameScene.load.once("complete", () =>
                playMusic(gameScene, DungeonDetails[newMap].music)
              )
              if (!alreadyLoading) {
                gameScene.load.start()
              }
            }
          }
          dispatch(changePlayer({ id: player.id, field: "map", value: newMap }))
        })

        player.listen("spectatedPlayerId", (spectatedPlayerId) => {
          if (room?.state?.players) {
            const spectatedPlayer = room?.state?.players.get(spectatedPlayerId)
            const gameContainer = getGameContainer()
            if (spectatedPlayer && player.id === uid) {
              gameContainer.setPlayer(spectatedPlayer)

              const simulation = room.state.simulations.get(
                spectatedPlayer.simulationId
              )
              if (simulation) {
                gameContainer.setSimulation(simulation)
              }
            }

            gameContainer.gameScene?.board?.updateScoutingAvatars()
          }
        })

        const fields: NonFunctionPropNames<IPlayer>[] = [
          "name",
          "avatar",
          "boardSize",
          "experienceManager",
          "money",
          "history",
          "life",
          "opponentId",
          "opponentName",
          "opponentAvatar",
          "opponentTitle",
          "rank",
          "regionalPokemons",
          "streak",
          "title"
        ]

        fields.forEach((field) => {
          player.listen(field, (value) => {
            dispatch(
              changePlayer({ id: player.id, field: field, value: value })
            )
          })
        })

        player.synergies.onChange(() => {
          dispatch(setSynergies({ id: player.id, value: player.synergies }))
        })

        player.itemsProposition.onAdd(() => {
          if (player.id == uid) {
            dispatch(setItemsProposition(player.itemsProposition))
          }
        })
        player.itemsProposition.onRemove(() => {
          if (player.id == uid) {
            dispatch(setItemsProposition(player.itemsProposition))
          }
        })

        player.pokemonsProposition.onAdd(() => {
          if (player.id == uid) {
            dispatch(setPokemonProposition(player.pokemonsProposition.map(p => p)))
          }
        })
        player.pokemonsProposition.onRemove(() => {
          if (player.id == uid) {
            dispatch(setPokemonProposition(player.pokemonsProposition.map(p => p)))
          }
        })
      })

      room.state.players.onRemove((player) => {
        dispatch(removePlayer(player))
      })

      room.state.spectators.onAdd((uid) => {
        gameContainer.initializeSpectactor(uid)
      })
    }
  }, [
    connected,
    connecting,
    initialized,
    room,
    dispatch,
    client,
    uid,
    currentPlayerId,
    connectToGame,
    leave
  ])

  return (
    <main id="game-wrapper">
      {loaded ? (
        <>
          <MainSidebar page="game" leave={leave} leaveLabel={t("leave_game")} />
          <GameFinalRank
            rank={finalRank}
            hide={() => setFinalRankVisible(false)}
            leave={leave}
            visible={finalRankVisible}
          />
          {!spectate && <GameShop />}
          <GameStageInfo />
          <GamePlayers click={(id: string) => playerClick(id)} />
          <GameSynergies />
          <GameItemsProposition />
          <GamePokemonsProposition />
          <GameDpsMeter />
          <GameToasts />
        </>
      ) : (
        <GameLoadingScreen connectError={connectError} />
      )}
      <div id="game" ref={container}></div>
    </main>
  )
}
