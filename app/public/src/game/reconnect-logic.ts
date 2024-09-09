import { Client, Room } from "colyseus.js"
import { WebSocketTransport } from "colyseus.js/lib/transport/WebSocketTransport"
import { logger } from "../../../utils/logger"
import { CloseCodes } from "../../../types/enum/CloseCodes"
import { Transfer } from "../../../types"
import { localStore, LocalStoreKeys } from "../pages/utils/store"

const MAX_RECONNECT_TRIES = 3

/**
 * Automatically reconnects when the connection closes unexpectedly or times out.
 * @param client The colyseus.js client-side Client.
 * @param room The colyseus.js client-side Room.
 * @param reconnectStoreKey The localStorage key string to save the reconnection token.
 * @param tokenExpirationTime The expiration time in seconds for the localStorage key expiration.
 */
export function enableAutoReconnect<T = any>(client: Client, room: Room<T>, reconnectStoreKey: LocalStoreKeys, tokenExpirationTime: number) {

  // override web socket onclose event with a custom function
  const transport: WebSocketTransport = room.connection.transport as any
  const originalOnclose: (event: CloseEvent) => any = transport.ws.onclose as any
  transport.ws.onclose = room.connection.events.onclose = function onclose(closeEvent: CloseEvent) {
    // only reconnect for abnormal closure or timeout
    if (closeEvent.code !== CloseCodes.ABNORMAL_CLOSURE && closeEvent.code !== CloseCodes.TIMEOUT) {
      return originalOnclose(closeEvent)
    }

    logger.log("Connection closed unexpectedly or timed out. Attempting to reconnect.")

    const token = room.reconnectionToken.slice(room.reconnectionToken.indexOf(":") + 1)

    const reconnect = function reconnect(tries = 1) {
      logger.log(`Reconnect try ${tries}/${MAX_RECONNECT_TRIES}`)

      // request reconnect from the server
      client.http.post(`matchmake/reconnect/${room.roomId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reconnectionToken: token })

      // receive server response
      }).then((response) => {
        const responseData = response.data
        if (responseData.error) {
          throw new Error(responseData.error)
        }
        // create url endpoint and connect web socket
        const roomData = responseData.room
        const sessionId = responseData.sessionId
        const endpoint = `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}${(window.location.port && `:${window.location.port}`)}`
          + `/${roomData.processId}/${roomData.roomId}?sessionId=${sessionId}&reconnectionToken=${token}`
        room.connection.connect(endpoint)

      // if error, try again to reconnect after 1 second
      }).catch((error) => {
        logger.log("reconnection error", error)
        if (tries < MAX_RECONNECT_TRIES) {
          setTimeout(() => reconnect(tries + 1), 1000)
        } else {
          originalOnclose(closeEvent)
        }
      })
    }

    reconnect()
  }

  // update to new reconnection token after reconnecting
  (room as any).onJoin(() => {
    localStore.set(
      reconnectStoreKey,
      { reconnectionToken: room.reconnectionToken, roomId: room.roomId },
      tokenExpirationTime
    )
  })

  // wrap send method with a connection check
  const originalSend = room.send
  room.send = function send<T = any>(type: string | number, message?: T): void {
    if (this.connection.isOpen) {
      originalSend.apply(this, [type, message])
    } else if (type !== Transfer.LOADING_PROGRESS) {
      logger.log("message failed", { type, message })
    }
  }
}