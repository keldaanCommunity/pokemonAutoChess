import { Client, Room } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useEffect, useRef, useState } from "react"
import GameState from "../../../rooms/states/game-state"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  setPokemonCollection,
  setSynergies,
  addPlayer,
  changePlayer,
  setExperienceManager,
  setInterest,
  setItemsProposition,
  setMapName,
  setMoney,
  setNoELO,
  setPhase,
  setRoundTime,
  setShop,
  setShopLocked,
  setStageLevel,
  setStreak,
  setOpponentName,
  setOpponentAvatar,
  setLife,
  setPlayer,
  setBoardSize,
  setCurrentPlayerMoney,
  setCurrentPlayerExperienceManager,
  setCurrentPlayerAvatar,
  setCurrentPlayerName,
  setLoadingProgress,
  addBlueDpsMeter,
  changeBlueDpsMeter,
  addRedDpsMeter,
  changeRedDpsMeter,
  addBlueHealDpsMeter,
  changeBlueHealDpsMeter,
  addRedHealDpsMeter,
  changeRedHealDpsMeter,
  removeRedDpsMeter,
  removeBlueDpsMeter,
  removeRedHealDpsMeter,
  removeBlueHealDpsMeter,
  leaveGame,
  displayEmote,
  setCurrentPlayerTitle,
  setPokemonProposition,
  setAdditionalPokemons
} from "../stores/GameStore"
import { logIn, joinGame, requestTilemap } from "../stores/NetworkStore"
import { FIREBASE_CONFIG } from "./utils/utils"
import GameContainer from "../game/game-container"
import { Navigate } from "react-router-dom"
import GameDpsMeter from "./component/game/game-dps-meter"
import GameItemsProposition from "./component/game/game-items-proposition"
import GamePlayerInformations from "./component/game/game-player-informations"
import GamePlayers from "./component/game/game-players"
import GameShop from "./component/game/game-shop"
import GameSynergies from "./component/game/game-synergies"
import GameModal from "./component/game/game-modal"
import GameOptionsIcon from "./component/game/game-options-icon"
import GameLoadingScreen from "./component/game/game-loading-screen"
import AfterGameState from "../../../rooms/states/after-game-state"
import {
  IDragDropCombineMessage,
  IDragDropItemMessage,
  IDragDropMessage,
  Transfer,
  ISimplePlayer,
  NonFunctionPropNames,
  IDps,
  IDpsHeal,
  IPlayer,
  Role
} from "../../../types"
import GameToasts from "./component/game/game-toasts"
import GamePokemonsProposition from "./component/game/game-pokemons-proposition"
import { getRankLabel } from "../../../types/strings/Strings"
import GameScene from "../game/scenes/game-scene"
import { toast } from "react-toastify"
import { logger } from "../../../utils/logger"
import { RequiredStageLevelForXpElligibility } from "../../../types/Config"

let gameContainer: GameContainer

function playerClick(id: string) {
  gameContainer.onPlayerClick(id)
}

export function getGameContainer(): GameContainer {
  return gameContainer
}

export function getGameScene(): GameScene | undefined {
  return gameContainer?.game?.scene?.getScene("gameScene") as
    | GameScene
    | undefined
}

export default function Game() {
  const dispatch = useAppDispatch()
  const client: Client = useAppSelector((state) => state.network.client)
  const room: Room<GameState> | undefined = useAppSelector(
    (state) => state.network.game
  )
  const uid: string = useAppSelector((state) => state.network.uid)
  const currentPlayerId: string = useAppSelector(
    (state) => state.game.currentPlayerId
  )
  const spectate = currentPlayerId !== uid

  const [initialized, setInitialized] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [reconnected, setReconnected] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalInfo, setModalInfo] = useState<string>("")
  const [modalBoolean, setModalBoolean] = useState<boolean>(false)
  const [toAfter, setToAfter] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  const MAX_ATTEMPS_RECONNECT = 2

  async function leave() {
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

    const elligibleToXP = nbPlayers >= 2 && (room?.state.stageLevel ?? 0) >= RequiredStageLevelForXpElligibility
    const elligibleToELO = elligibleToXP && !room?.state.noElo && savedPlayers.filter(p => p.role !== Role.BOT).length >= 2

    const r: Room<AfterGameState> = await client.create("after-game", {
      players: savedPlayers,
      idToken: token,
      elligibleToXP,
      elligibleToELO
    })
    localStorage.setItem("cachedReconnectionToken", r.reconnectionToken)
    r.connection.close()
    dispatch(leaveGame())
    setToAfter(true)

    try {
      await room?.leave()
    } catch(error) {
      logger.warn("Room already closed")
    }
  }

  useEffect(() => {
    const reconnect = async () => {
      setReconnected(true)
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG)
      }

      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          dispatch(logIn(user))

          async function tryToReconnectToLastGame(attempts = 1) {
            try {
              const cachedReconnectionToken = localStorage.getItem(
                "cachedReconnectionToken"
              )
              if (cachedReconnectionToken) {
                const r: Room<GameState> = await client.reconnect(
                  cachedReconnectionToken
                )
                localStorage.setItem(
                  "cachedReconnectionToken",
                  r.reconnectionToken
                )
                dispatch(joinGame(r))
              }
            } catch (error) {
              if (attempts < MAX_ATTEMPS_RECONNECT) {
                setTimeout(() => tryToReconnectToLastGame(attempts + 1), 100)
              } else {
                logger.error("reconnect error", error)
                setToAuth(true)
              }
            }
          }

          tryToReconnectToLastGame()
        }
      })
    }

    if (!reconnected) {
      reconnect()
    }

    if (!initialized && room != undefined && container?.current) {
      setInitialized(true)
      dispatch(requestTilemap())

      gameContainer = new GameContainer(container.current, uid, room)
      document.getElementById("game")?.addEventListener(Transfer.DRAG_DROP, ((
        event: CustomEvent<IDragDropMessage>
      ) => {
        gameContainer.onDragDrop(event)
      }) as EventListener)
      document
        .getElementById("game")
        ?.addEventListener(Transfer.DRAG_DROP_ITEM, ((
          event: CustomEvent<IDragDropItemMessage>
        ) => {
          gameContainer.onDragDropItem(event)
        }) as EventListener)
      document
        .getElementById("game")
        ?.addEventListener(Transfer.DRAG_DROP_COMBINE, ((
          event: CustomEvent<IDragDropCombineMessage>
        ) => {
          gameContainer.onDragDropCombine(event)
        }) as EventListener)
      document.getElementById("game")?.addEventListener(Transfer.SELL_DROP, ((
        event: CustomEvent<{ pokemonId: string }>
      ) => {
        gameContainer.onSellDrop(event)
      }) as EventListener)
      room.onMessage(Transfer.LOADING_COMPLETE, () => {
        setLoaded(true)
      })
      room.onMessage(Transfer.BROADCAST_INFO, (message) => {
        setModalTitle(message.title)
        setModalInfo(message.info)
        setModalBoolean(true)
      })
      room.onMessage(Transfer.REQUEST_TILEMAP, (tilemap) => {
        gameContainer.setTilemap(tilemap)
      })
      room.onMessage(Transfer.BROADCAST_EMOTE, (message) => {
        dispatch(displayEmote({ id: message.id, emote: message.emote }))
      })

      room.onMessage(Transfer.POKEMON_DAMAGE, (message) => {
        gameContainer.handleDisplayDamage(message)
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
            <img className="icon-money" src="/assets/ui/money.svg" alt="$" />
          </div>,
          { containerId: "toast-money" }
        )
      })

      room.onMessage(Transfer.UNOWN_WANDERING, () => {
        if (gameContainer.game) {
          const g: any = gameContainer.game.scene.getScene("gameScene")
          if (g && g.unownManager) {
            g.unownManager.addWanderingUnown()
          }
        }
      })

      room.onMessage(Transfer.GAME_END, leave)

      room.state.listen("roundTime", (value, previousValue) => {
        dispatch(setRoundTime(value))
      })

      room.state.listen("phase", (value, previousValue) => {
        if (gameContainer.game) {
          const g: any = gameContainer.game.scene.getScene("gameScene")
          g.updatePhase()
        }
        dispatch(setPhase(value))
      })

      room.state.listen("stageLevel", (value, previousValue) => {
        dispatch(setStageLevel(value))
      })

      room.state.listen("mapName", (value, previousValue) => {
        dispatch(setMapName(value))
      })

      room.state.listen("noElo", (value, previousValue) => {
        dispatch(setNoELO(value))
      })

      room.state.additionalPokemons.onAdd((pkm) => {
        dispatch(setAdditionalPokemons(room.state.additionalPokemons))
      })

      room.state.players.onAdd((player) => {
        // dispatch(changePlayer({ id: player.id, change: change }))
        gameContainer.initializePlayer(player)
        dispatch(addPlayer(player))

        if (player.id == uid) {
          dispatch(setInterest(player.interest))
          dispatch(setStreak(player.streak))
          dispatch(setShopLocked(player.shopLocked))
          dispatch(setPokemonCollection(player.pokemonCollection))
          dispatch(setPlayer(player))
        }

        if (player.id === uid) {
          player.listen("alive", (value, previousValue) => {
            const rankPhrase = getRankLabel(player.rank)!
            const titlePhrase = "Game Over"
            if (value === false) {
              setModalTitle(titlePhrase)
              setModalInfo(rankPhrase)
              setModalBoolean(true)
            }
          })
          player.listen("interest", (value, previousValue) => {
            dispatch(setInterest(value))
          })
          player.listen("shop", (value, previousValue) => {
            dispatch(setShop(value))
          })
          player.listen("shopLocked", (value, previousValue) => {
            dispatch(setShopLocked(value))
          })
          player.listen("money", (value, previousValue) => {
            dispatch(setMoney(value))
          })
          player.listen("streak", (value, previousValue) => {
            dispatch(setStreak(value))
          })
        }

        player.listen("opponentName", (value, previousValue) => {
          dispatch(setOpponentName({ id: player.id, value: value }))
        })
        player.listen("opponentAvatar", (value, previousValue) => {
          dispatch(setOpponentAvatar({ id: player.id, value: value }))
        })
        player.listen("boardSize", (value, previousValue) => {
          dispatch(setBoardSize({ id: player.id, value: value }))
        })
        player.listen("life", (value, previousValue) => {
          dispatch(setLife({ id: player.id, value: value }))
        })
        player.listen("money", (value, previousValue) => {
          dispatch(setCurrentPlayerMoney({ id: player.id, value: value }))
        })
        player.listen("experienceManager", (value, previousValue) => {
          if (player.id === uid) {
            dispatch(setExperienceManager(value))
          }
          dispatch(
            setCurrentPlayerExperienceManager({
              id: player.id,
              value: value
            })
          )
        })
        player.listen("avatar", (value, previousValue) => {
          dispatch(setCurrentPlayerAvatar({ id: player.id, value: value }))
        })
        player.listen("name", (value, previousValue) => {
          dispatch(setCurrentPlayerName({ id: player.id, value: value }))
        })
        player.listen("title", (value, previousValue) => {
          dispatch(setCurrentPlayerTitle({ id: player.id, value: value }))
        })
        player.listen("loadingProgress", (value, previousValue) => {
          dispatch(setLoadingProgress({ id: player.id, value: value }))
        })

        const fields: NonFunctionPropNames<IPlayer>[] = [
          "money",
          "history",
          "life",
          "rank"
        ]

        fields.forEach((field) => {
          player.listen(field, (value, previousValue) => {
            dispatch(
              changePlayer({ id: player.id, field: field, value: value })
            )
          })
        })

        player.synergies.onChange((value, key) => {
          dispatch(setSynergies({ id: player.id, value: player.synergies }))
        })

        player.itemsProposition.onAdd((changes) => {
          if (player.id == uid) {
            dispatch(setItemsProposition(player.itemsProposition))
          }
        })
        player.itemsProposition.onRemove((changes) => {
          if (player.id == uid) {
            dispatch(setItemsProposition(player.itemsProposition))
          }
        })

        player.pokemonsProposition.onAdd((changes) => {
          if (player.id == uid) {
            dispatch(setPokemonProposition(player.pokemonsProposition))
          }
        })
        player.pokemonsProposition.onRemove((changes) => {
          if (player.id == uid) {
            dispatch(setPokemonProposition(player.pokemonsProposition))
          }
        })

        player.simulation.blueDpsMeter.onAdd((dps, key) => {
          dispatch(addBlueDpsMeter({ value: dps, id: player.id }))
          const fields: NonFunctionPropNames<IDps>[] = [
            "id",
            "name",
            "physicalDamage",
            "specialDamage",
            "trueDamage"
          ]
          fields.forEach((field) => {
            dps.listen(field, (value, previousValue) => {
              dispatch(
                changeBlueDpsMeter({
                  id: dps.id,
                  field: field,
                  value: value,
                  playerId: player.id
                })
              )
            })
          })
        })
        player.simulation.blueDpsMeter.onRemove((dps, key) => {
          dispatch(removeBlueDpsMeter(player.id))
        })

        player.simulation.redDpsMeter.onAdd((dps, key) => {
          dispatch(addRedDpsMeter({ value: dps, id: player.id }))
          const fields: NonFunctionPropNames<IDps>[] = [
            "id",
            "name",
            "physicalDamage",
            "specialDamage",
            "trueDamage"
          ]
          fields.forEach((field) => {
            dps.listen(field, (value, previousValue) => {
              dispatch(
                changeRedDpsMeter({
                  id: dps.id,
                  field: field,
                  value: value,
                  playerId: player.id
                })
              )
            })
          })
        })
        player.simulation.redDpsMeter.onRemove((dps, key) => {
          dispatch(removeRedDpsMeter(player.id))
        })

        player.simulation.blueHealDpsMeter.onAdd((dps, key) => {
          dispatch(addBlueHealDpsMeter({ value: dps, id: player.id }))
          const fields: NonFunctionPropNames<IDpsHeal>[] = [
            "heal",
            "id",
            "name",
            "shield"
          ]

          fields.forEach((field) => {
            dps.listen(field, (value, previousValue) => {
              dispatch(
                changeBlueHealDpsMeter({
                  id: dps.id,
                  field: field,
                  value: value,
                  playerId: player.id
                })
              )
            })
          })
        })
        player.simulation.blueHealDpsMeter.onRemove((dps, key) => {
          dispatch(removeBlueHealDpsMeter(player.id))
        })

        player.simulation.redHealDpsMeter.onAdd((dps, key) => {
          dispatch(addRedHealDpsMeter({ value: dps, id: player.id }))
          const fields: NonFunctionPropNames<IDpsHeal>[] = [
            "heal",
            "id",
            "name",
            "shield"
          ]

          fields.forEach((field) => {
            dps.listen(field, (value, previousValue) => {
              dispatch(
                changeRedHealDpsMeter({
                  id: dps.id,
                  field: field,
                  value: value,
                  playerId: player.id
                })
              )
            })
          })
        })
        player.simulation.redHealDpsMeter.onRemove((dps, key) => {
          dispatch(removeRedHealDpsMeter(player.id))
        })
      })

      room.state.spectators.onAdd((uid) => {
        gameContainer.initializeSpectactor(uid)
      })
    }
  }, [reconnected, initialized, room, dispatch, client, uid, currentPlayerId])

  if (toAuth) {
    return <Navigate to={"/"} />
  }

  if (toAfter) {
    return <Navigate to="/after" />
  }

  return (
    <div>
      {loaded ? (
        <>
          <GameModal
            modalBoolean={modalBoolean}
            modalTitle={modalTitle}
            modalInfo={modalInfo}
            hideModal={setModalBoolean}
            leave={leave}
          />
          {!spectate && <GameShop />}
          <GamePlayerInformations />
          <GamePlayers click={(id: string) => playerClick(id)} />
          <GameSynergies />
          <GameItemsProposition />
          <GamePokemonsProposition />
          <GameDpsMeter />
          <GameToasts />
          <GameOptionsIcon leave={leave} />
        </>
      ) : (
        <GameLoadingScreen />
      )}
      <div id="game" ref={container}></div>
    </div>
  )
}
