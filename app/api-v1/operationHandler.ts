import { Response, Request } from "express"
import History from "../models/mongo-models/history"
import { matchMaker } from "colyseus"

export default class OperationHandler {
  static getGameById(req: Request, res: Response) {
    const id = req.params.id
    History.findOne({ id: id }, (err, game) => {
      if (err) {
        return res.status(400).json(err)
      }
      if (game) {
        return res.status(200).json(game)
      } else {
        return res.status(404).json({ err: `no game found with id ${id}` })
      }
    })
  }

  static getGamesByName(req: Request, res: Response) {
    const name = req.params.name
    History.find({ name: name }, (err, games) => {
      if (err) {
        return res.status(400).json(err)
      }
      if (games && games.length > 0) {
        return res.status(200).json(games)
      } else {
        return res
          .status(404)
          .json({ err: `no games found with name ${name}.` })
      }
    })
  }

  static getGamesByTime(req: Request, res: Response) {
    const startTime = req.query.startTime
    const endTime = req.query.endTime

    History.find(
      { startTime: { $gt: startTime }, endTime: { $lt: endTime } },
      undefined,
      { limit: 10, sort: { startTime: -1 } },
      (err, games) => {
        if (err) {
          return res.status(400).json(err)
        }
        if (games && games.length > 0) {
          return res.status(200).json(games)
        } else {
          return res.status(404).json({
            err: `no games found between epoch${startTime} and ${endTime}.`
          })
        }
      }
    )
  }

  static async createGame(req: Request, res: Response) {
    const name = req.params.name
    try {
      const room = await matchMaker.createRoom("room", { name: name })
      return res.status(200).json({ id: room.roomId })
    } catch (error) {
      return res.status(400).json(error)
    }
  }

  static async getGameStatus(req: Request, res: Response) {
    const id = req.params.id
    try {
      const status = await matchMaker.remoteRoomCall(id, "status")
      if (status) {
        return res.status(200).json(status)
      }
    } catch (error) {
      return res.status(400).json({ err: error })
    }
  }
}
