import { Command } from "@colyseus/command"
import { Client, matchMaker } from "colyseus"
import {
  getRemainingPlayers,
  getTournamentStage,
  makeBrackets
} from "../../core/tournament-logic"
import {
  TournamentBracketSchema,
  TournamentPlayerSchema
} from "../../models/colyseus-models/tournament"
import { Tournament } from "../../models/mongo-models/tournament"
import UserMetadata from "../../models/mongo-models/user-metadata"
import { notificationsService } from "../../services/notifications"
import { IPlayer, Role, Title, Transfer } from "../../types"
import { GameMode } from "../../types/enum/Game"
import { ITournamentPlayer } from "../../types/interfaces/Tournament"
import { logger } from "../../utils/logger"
import { convertSchemaToRawObject, values } from "../../utils/schemas"
import CustomLobbyRoom from "../custom-lobby-room"

export class OnCreateTournamentCommand extends Command<
  CustomLobbyRoom,
  { client: Client; name: string; startDate: string }
> {
  async execute({
    client,
    name,
    startDate
  }: {
    client: Client
    name: string
    startDate: string
  }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (user && user.role && user.role === Role.ADMIN) {
        await this.state.createTournament(name, startDate)
        await this.room.fetchTournaments()
        this.room.presence.publish(
          "announcement",
          `A new tournament "${name}" is planned on ${new Date(
            startDate
          ).toLocaleString("en-US", {
            timeZoneName: "short"
          })}, mark your calendar !`
        )
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class DeleteTournamentCommand extends Command<
  CustomLobbyRoom,
  { client: Client; tournamentId: string }
> {
  execute({ client, tournamentId }: { client: Client; tournamentId: string }) {
    try {
      const user = this.room.users.get(client.auth.uid)
      if (user && user.role && user.role === Role.ADMIN) {
        this.state.removeTournament(tournamentId)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ParticipateInTournamentCommand extends Command<
  CustomLobbyRoom,
  { client: Client; tournamentId: string; participate: boolean }
> {
  async execute({
    client,
    tournamentId,
    participate
  }: {
    client: Client
    tournamentId: string
    participate: boolean
  }) {
    try {
      if (!client.auth.uid || this.room.users.has(client.auth.uid) === false)
        return
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )

      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      const user = await UserMetadata.findOne({ uid: client.auth.uid })
      if (!user) return

      if (participate) {
        //logger.debug(`${user.uid} participates in tournament ${tournamentId}`)
        const tournamentPlayer = new TournamentPlayerSchema(
          user.displayName,
          user.avatar,
          user.elo
        )

        tournament.players.set(user.uid, tournamentPlayer)
      } else if (tournament.players.has(user.uid)) {
        /*logger.debug(
          `${user.uid} no longer participates in tournament ${tournamentId}`
        )*/
        tournament.players.delete(user.uid)
      }

      const mongoTournament = await Tournament.findById(tournamentId)
      if (mongoTournament) {
        mongoTournament.players = convertSchemaToRawObject(tournament.players)
        mongoTournament.save()
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class NextTournamentStageCommand extends Command<
  CustomLobbyRoom,
  { tournamentId: string }
> {
  async execute({ tournamentId }: { tournamentId: string }) {
    try {
      logger.debug(`Tournament ${tournamentId} is moving to next stage`)
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      const remainingPlayers = getRemainingPlayers(tournament)

      // Find players who just got eliminated in this round
      const playersInLastRound = new Set<string>()
      tournament.brackets.forEach((bracket) => {
        bracket.playersId.forEach((id) => playersInLastRound.add(id))
      })

      // Sort newly eliminated players matching the display sort in tournament-item.tsx
      const isFinalRound =
        remainingPlayers.length <= 4 &&
        remainingPlayers.some((p) => p.ranks.length > 0)
      const newlyEliminated: { id: string; sortKey: number }[] = []
      tournament.players.forEach((player, playerId) => {
        if (player.eliminated && playersInLastRound.has(playerId)) {
          const ranks = values(player.ranks)
          const sortKey = isFinalRound
            ? (ranks[ranks.length - 1] ?? 8) // finalists (final round) sorted by last rank
            : ranks.length > 0 // others by average rank
              ? ranks.reduce((sum, r) => sum + r, 0) / ranks.length
              : 8
          newlyEliminated.push({ id: playerId, sortKey })
        }
      })
      newlyEliminated.sort((a, b) => a.sortKey - b.sortKey)

      newlyEliminated.forEach(({ id }, index) => {
        const finalPosition = remainingPlayers.length + index + 1
        notificationsService.addNotification(
          id,
          "tournament_finished",
          finalPosition.toString()
        )
        // send notification immediately if the user is online and in lobby
        const client = this.room.clients.find((c) => c.auth.uid === id)
        if (client) {
          client.send(
            Transfer.NOTIFICATIONS,
            notificationsService.getNotifications(id)
          )
        }
      })

      if (isFinalRound) {
        // finals ended
        return [new EndTournamentCommand().setPayload({ tournamentId })]
      } else {
        return [
          new CreateTournamentLobbiesCommand().setPayload({ tournamentId })
        ]
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class CreateTournamentLobbiesCommand extends Command<
  CustomLobbyRoom,
  { client?: Client; tournamentId: string }
> {
  async execute({
    tournamentId,
    client
  }: {
    tournamentId: string
    client?: Client
  }) {
    try {
      if (client) {
        const user = this.room.users.get(client.auth.uid)
        if (!user || !user.role || user.role !== Role.ADMIN) {
          return
        }
      }

      logger.debug(`Creating tournament lobbies for tournament ${tournamentId}`)
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      this.state.addAnnouncement(
        `${tournament.name} ${getTournamentStage(tournament)} are starting !`
      )

      const brackets = makeBrackets(tournament)
      tournament.brackets.clear()

      for (const bracket of brackets) {
        const bracketId = crypto.randomUUID()
        logger.info(`Creating tournament game ${bracket.name} id: ${bracketId}`)
        tournament.brackets.set(
          bracketId,
          new TournamentBracketSchema(bracket.name, bracket.playersId)
        )

        await matchMaker.createRoom("preparation", {
          gameMode: GameMode.TOURNAMENT,
          noElo: true,
          ownerId: null,
          roomName: bracket.name,
          autoStartDelayInSeconds: 10 * 60,
          whitelist: bracket.playersId,
          tournamentId,
          bracketId
        })
        //await wait(1000)
      }

      //save brackets to db
      const mongoTournament = await Tournament.findById(tournamentId)
      if (mongoTournament) {
        mongoTournament.brackets = convertSchemaToRawObject(tournament.brackets)
        await mongoTournament.save()
      }

      tournament.pendingLobbiesCreation = false
    } catch (error) {
      logger.error(error)
    }
  }
}

export class RemakeTournamentLobbyCommand extends Command<
  CustomLobbyRoom,
  { client?: Client; tournamentId: string; bracketId: string }
> {
  async execute({
    tournamentId,
    bracketId,
    client
  }: {
    tournamentId: string
    bracketId: string
    client?: Client
  }) {
    try {
      if (client) {
        const user = this.room.users.get(client.auth.uid)
        if (!user || !user.role || user.role !== Role.ADMIN) {
          return
        }
      }

      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      const bracket = tournament.brackets.get(bracketId)
      if (!bracket)
        return logger.error(`Tournament bracket not found: ${bracketId}`)

      logger.info(`Remaking tournament game ${bracket.name} id: ${bracketId}`)
      tournament.brackets.set(
        bracketId,
        new TournamentBracketSchema(bracket.name, bracket.playersId)
      )

      await matchMaker.createRoom("preparation", {
        gameMode: GameMode.TOURNAMENT,
        noElo: true,
        ownerId: null,
        roomName: bracket.name,
        autoStartDelayInSeconds: 10 * 60,
        whitelist: bracket.playersId,
        tournamentId,
        bracketId
      })

      //save brackets to db
      const mongoTournament = await Tournament.findById(tournamentId)
      if (mongoTournament) {
        mongoTournament.brackets = convertSchemaToRawObject(tournament.brackets)
        await mongoTournament.save()
      }

      tournament.pendingLobbiesCreation = false
    } catch (error) {
      logger.error(error)
    }
  }
}

export class EndTournamentMatchCommand extends Command<
  CustomLobbyRoom,
  {
    tournamentId: string
    bracketId: string
    players: { id: string; rank: number }[]
  }
> {
  async execute({
    tournamentId,
    bracketId,
    players
  }: {
    tournamentId: string
    bracketId: string
    players: IPlayer[]
  }) {
    logger.debug(`Tournament ${tournamentId} bracket ${bracketId} has ended`)
    try {
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      const bracket = tournament.brackets.get(bracketId)
      if (!bracket)
        return logger.error(`Tournament bracket not found: ${bracketId}`)

      bracket.finished = true

      players.forEach((p) => {
        const player = tournament.players.get(p.id)
        if (player) {
          player.ranks.push(p.rank)
          if (p.rank > 4) {
            // eliminate players whose rank is > 4
            player.eliminated = true
          }
        }
      })

      bracket.playersId.forEach((playerId) => {
        const player = tournament.players.get(playerId)
        if (player && players.every((p) => p.id !== playerId)) {
          // eliminate players who did not attend their bracket
          player.eliminated = true
        }
      })

      if (
        !tournament.pendingLobbiesCreation &&
        values(tournament.brackets).every((b) => b.finished)
      ) {
        tournament.pendingLobbiesCreation = true // prevent executing command multiple times
        //save brackets and player ranks to db before moving to next stage
        const mongoTournament = await Tournament.findById(tournamentId)
        if (mongoTournament) {
          mongoTournament.players = convertSchemaToRawObject(tournament.players)
          mongoTournament.brackets = convertSchemaToRawObject(
            tournament.brackets
          )
          mongoTournament.save()
        }

        return [new NextTournamentStageCommand().setPayload({ tournamentId })]
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class EndTournamentCommand extends Command<
  CustomLobbyRoom,
  { tournamentId: string }
> {
  async execute({ tournamentId }: { tournamentId: string }) {
    try {
      logger.debug(`Tournament ${tournamentId} is finished`)
      const tournament = this.state.tournaments.find(
        (t) => t.id === tournamentId
      )
      if (!tournament)
        return logger.error(`Tournament not found: ${tournamentId}`)

      let finalists: (ITournamentPlayer & { id: string })[] = [],
        nbMatchsPlayed = 0

      tournament.players.forEach((player, playerId) => {
        if (player.ranks.length > nbMatchsPlayed) {
          finalists = []
          nbMatchsPlayed = player.ranks.length
        }
        if (player.ranks.length === nbMatchsPlayed) {
          finalists.push({
            id: playerId,
            ...player
          })
        }
      })

      const winner = finalists.find((p) => p.ranks.at(-1) === 1)
      if (winner) {
        this.room.presence.publish(
          "announcement",
          `${winner.name} won the tournament !`
        )
      }

      for (const player of finalists) {
        const rank = player.ranks.at(-1) ?? 1
        const user = this.room.users.get(player.id)

        const mongoUser = await UserMetadata.findOne({ uid: player.id })
        if (mongoUser === null) continue

        logger.debug(
          `Tournament ${tournamentId} finalist ${player.name} finished with rank ${rank}, distributing rewards`
        )

        mongoUser.booster += 3 // 3 boosters for top 8
        if (mongoUser.titles.includes(Title.ACE_TRAINER) === false) {
          mongoUser.titles.push(Title.ACE_TRAINER)
          if (user) user.titles.push(Title.ACE_TRAINER)
        }

        if (rank <= 4) {
          mongoUser.booster += 3 // 6 boosters for top 4
          if (mongoUser.titles.includes(Title.ELITE_FOUR_MEMBER) === false) {
            mongoUser.titles.push(Title.ELITE_FOUR_MEMBER)
            if (user) user.titles.push(Title.ELITE_FOUR_MEMBER)
          }
        }

        if (rank === 1) {
          mongoUser.booster += 4 // 10 boosters for top 1
          if (mongoUser.titles.includes(Title.CHAMPION) === false) {
            mongoUser.titles.push(Title.CHAMPION)
            if (user) user.titles.push(Title.CHAMPION)
          }
        }

        if (user) user.booster = mongoUser.booster
        await mongoUser.save()
      }

      tournament.brackets.clear()
      tournament.finished = true

      const mongoTournament = await Tournament.findById(tournamentId)
      if (mongoTournament) {
        mongoTournament.finished = true
        mongoTournament.brackets = convertSchemaToRawObject(tournament.brackets)
        await mongoTournament.save()
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
