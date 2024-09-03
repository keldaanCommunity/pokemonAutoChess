import { Dispatcher } from "@colyseus/command"
import {
  Client,
  Room,
  RoomListingData,
  matchMaker,
  subscribeLobby
} from "colyseus"
import { CronJob } from "cron"
import admin from "firebase-admin"
import Message from "../models/colyseus-models/message"
import { TournamentSchema } from "../models/colyseus-models/tournament"
import BannedUser from "../models/mongo-models/banned-user"
import { IBot } from "../models/mongo-models/bot-v2"
import ChatV2 from "../models/mongo-models/chat-v2"
import Tournament from "../models/mongo-models/tournament"
import UserMetadata, {
  IUserMetadata
} from "../models/mongo-models/user-metadata"
import { Emotion, IPlayer, Role, Title, Transfer } from "../types"
import {
  GREATBALL_RANKED_LOBBY_CRON,
  INACTIVITY_TIMEOUT,
  MAX_CONCURRENT_PLAYERS_ON_LOBBY,
  MAX_CONCURRENT_PLAYERS_ON_SERVER,
  SCRIBBLE_LOBBY_CRON,
  TOURNAMENT_CLEANUP_DELAY,
  TOURNAMENT_REGISTRATION_TIME,
  ULTRABALL_RANKED_LOBBY_CRON
} from "../types/Config"
import { CloseCodes } from "../types/enum/CloseCodes"
import { EloRank } from "../types/enum/EloRank"
import { GameMode } from "../types/enum/Game"
import { Language } from "../types/enum/Language"
import { ITournament } from "../types/interfaces/Tournament"
import { logger } from "../utils/logger"
import {
  AddBotCommand,
  BanUserCommand,
  BuyBoosterCommand,
  BuyEmotionCommand,
  ChangeAvatarCommand,
  ChangeNameCommand,
  ChangeSelectedEmotionCommand,
  ChangeTitleCommand,
  CreateTournamentLobbiesCommand,
  DeleteBotCommand,
  EndTournamentMatchCommand,
  GiveBoostersCommand,
  GiveRoleCommand,
  GiveTitleCommand,
  NextTournamentStageCommand,
  OnCreateTournamentCommand,
  OnJoinCommand,
  OnLeaveCommand,
  OnNewMessageCommand,
  OnSearchByIdCommand,
  OnSearchCommand,
  OpenBoosterCommand,
  OpenSpecialGameCommand,
  ParticipateInTournamentCommand,
  RemoveMessageCommand,
  RemoveTournamentCommand,
  SelectLanguageCommand,
  UnbanUserCommand
} from "./commands/lobby-commands"
import LobbyState from "./states/lobby-state"

export default class CustomLobbyRoom extends Room<LobbyState> {
  bots: Map<string, IBot> = new Map<string, IBot>()
  unsubscribeLobby: (() => void) | undefined
  rooms: RoomListingData<any>[] | undefined
  dispatcher: Dispatcher<this>
  tournamentCronJobs: Map<string, CronJob> = new Map<string, CronJob>()
  cleanUpCronJobs: CronJob[] = []
  users: Map<string, IUserMetadata> = new Map<string, IUserMetadata>()

  constructor() {
    super()
    this.dispatcher = new Dispatcher(this)
  }

  removeRoom(index: number, roomId: string) {
    // remove room listing data
    if (index !== -1) {
      this.rooms?.splice(index, 1)

      this.clients.forEach((client) => {
        client.send(Transfer.REMOVE_ROOM, roomId)
      })
    }
  }

  addRoom(roomId: string, data: RoomListingData<any>) {
    // append room listing data
    this.rooms?.push(data)

    this.clients.forEach((client) => {
      client.send(Transfer.ADD_ROOM, [roomId, data])
    })
  }

  changeRoom(index: number, roomId: string, data: RoomListingData<any>) {
    if (this.rooms) {
      const previousData = this.rooms[index]

      // replace room listing data
      this.rooms[index] = data

      this.clients.forEach((client) => {
        if (previousData && !data) {
          client.send(Transfer.REMOVE_ROOM, roomId)
        } else if (data) {
          client.send(Transfer.ADD_ROOM, [roomId, data])
        }
      })
    }
  }

  async onCreate(): Promise<void> {
    logger.info("create lobby", this.roomId)
    this.setState(new LobbyState())
    this.state.getNextSpecialGame()
    this.autoDispose = false
    this.listing.unlisted = true

    this.clock.setInterval(async () => {
      const ccu = await matchMaker.stats.getGlobalCCU()
      this.state.ccu = ccu
    }, 1000)

    this.unsubscribeLobby = await subscribeLobby((roomId, data) => {
      if (this.rooms) {
        const roomIndex = this.rooms?.findIndex(
          (room) => room.roomId === roomId
        )

        if (!data) {
          this.removeRoom(roomIndex, roomId)
        } else if (roomIndex === -1) {
          this.addRoom(roomId, data)
        } else {
          this.changeRoom(roomIndex, roomId, data)
        }
      }
    })

    this.rooms = await matchMaker.query({ private: false, unlisted: false })

    this.onMessage(Transfer.DELETE_BOT_DATABASE, async (client, message) => {
      this.dispatcher.dispatch(new DeleteBotCommand(), { client, message })
    })

    this.onMessage(Transfer.ADD_BOT_DATABASE, async (client, url) => {
      this.dispatcher.dispatch(new AddBotCommand(), { client, url })
    })

    this.onMessage(
      Transfer.SELECT_LANGUAGE,
      async (client, message: Language) => {
        this.dispatcher.dispatch(new SelectLanguageCommand(), {
          client,
          message
        })
      }
    )

    this.onMessage(
      Transfer.UNBAN,
      (client, { uid, name }: { uid: string; name: string }) => {
        this.dispatcher.dispatch(new UnbanUserCommand(), { client, uid, name })
      }
    )

    this.onMessage(
      Transfer.BAN,
      (client, { uid, reason }: { uid: string; reason: string }) => {
        this.dispatcher.dispatch(new BanUserCommand(), {
          client,
          uid,
          reason
        })
      }
    )

    this.onMessage(Transfer.NEW_MESSAGE, (client, message) => {
      this.dispatcher.dispatch(new OnNewMessageCommand(), { client, message })
    })

    this.onMessage(
      Transfer.REMOVE_MESSAGE,
      (client, message: { id: string }) => {
        this.dispatcher.dispatch(new RemoveMessageCommand(), {
          client,
          messageId: message.id
        })
      }
    )

    this.onMessage(
      Transfer.NEW_TOURNAMENT,
      (client, message: { name: string; startDate: string }) => {
        this.dispatcher.dispatch(new OnCreateTournamentCommand(), {
          client,
          name: message.name,
          startDate: message.startDate
        })
      }
    )

    this.onMessage(
      Transfer.REMOVE_TOURNAMENT,
      (client, message: { id: string }) => {
        this.dispatcher.dispatch(new RemoveTournamentCommand(), {
          client,
          tournamentId: message.id
        })
      }
    )

    this.onMessage(
      Transfer.REMAKE_TOURNAMENT_LOBBIES,
      (client, message: { id: string }) => {
        this.dispatcher.dispatch(new CreateTournamentLobbiesCommand(), {
          client,
          tournamentId: message.id
        })
      }
    )

    this.onMessage(
      Transfer.PARTICIPATE_TOURNAMENT,
      (client, message: { tournamentId: string; participate: boolean }) => {
        this.dispatcher.dispatch(new ParticipateInTournamentCommand(), {
          client,
          tournamentId: message.tournamentId,
          participate: message.participate
        })
      }
    )

    this.onMessage(
      Transfer.GIVE_BOOSTER,
      (
        client,
        { uid, numberOfBoosters }: { uid: string; numberOfBoosters: number }
      ) => {
        this.dispatcher.dispatch(new GiveBoostersCommand(), {
          client,
          uid,
          numberOfBoosters: Number(numberOfBoosters) || 1
        })
      }
    )

    this.onMessage(
      Transfer.GIVE_TITLE,
      (client, { uid, title }: { uid: string; title: Title }) => {
        this.dispatcher.dispatch(new GiveTitleCommand(), { client, uid, title })
      }
    )

    this.onMessage(
      Transfer.SET_ROLE,
      (client, { uid, role }: { uid: string; role: Role }) => {
        this.dispatcher.dispatch(new GiveRoleCommand(), { client, uid, role })
      }
    )

    this.onMessage(Transfer.OPEN_BOOSTER, (client) => {
      this.dispatcher.dispatch(new OpenBoosterCommand(), { client })
    })

    this.onMessage(Transfer.CHANGE_NAME, (client, message) => {
      this.dispatcher.dispatch(new ChangeNameCommand(), {
        client,
        name: message.name
      })
    })

    this.onMessage(Transfer.SET_TITLE, (client, title: Title | "") => {
      this.dispatcher.dispatch(new ChangeTitleCommand(), { client, title })
    })

    this.onMessage(
      Transfer.CHANGE_SELECTED_EMOTION,
      (
        client,
        {
          index,
          emotion,
          shiny
        }: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        this.dispatcher.dispatch(new ChangeSelectedEmotionCommand(), {
          client,
          index,
          emotion,
          shiny
        })
      }
    )

    this.onMessage(
      Transfer.BUY_EMOTION,
      (
        client,
        {
          index,
          emotion,
          shiny
        }: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        this.dispatcher.dispatch(new BuyEmotionCommand(), {
          client,
          index,
          emotion,
          shiny
        })
      }
    )

    this.onMessage(
      Transfer.BUY_BOOSTER,
      (client, message: { index: string }) => {
        this.dispatcher.dispatch(new BuyBoosterCommand(), {
          client,
          index: message.index
        })
      }
    )

    this.onMessage(Transfer.SEARCH_BY_ID, (client, uid: string) => {
      this.dispatcher.dispatch(new OnSearchByIdCommand(), { client, uid })
    })

    this.onMessage(Transfer.SEARCH, (client, { name }: { name: string }) => {
      this.dispatcher.dispatch(new OnSearchCommand(), { client, name })
    })

    this.onMessage(
      Transfer.CHANGE_AVATAR,
      (
        client,
        {
          index,
          emotion,
          shiny
        }: { index: string; emotion: Emotion; shiny: boolean }
      ) => {
        this.dispatcher.dispatch(new ChangeAvatarCommand(), {
          client,
          index,
          emotion,
          shiny
        })
      }
    )

    this.presence.subscribe("ranked-lobby-winner", (player: IPlayer) => {
      this.state.addAnnouncement(`${player.name} won the ranked match !`)
    })

    this.presence.subscribe("tournament-winner", (player: IPlayer) => {
      this.state.addAnnouncement(`${player.name} won the tournament !`)
    })

    this.presence.subscribe(
      "tournament-match-end",
      ({
        tournamentId,
        bracketId,
        players
      }: {
        tournamentId: string
        bracketId: string
        players: { id: string; rank: number }[]
      }) => {
        this.dispatcher.dispatch(new EndTournamentMatchCommand(), {
          tournamentId,
          bracketId,
          players
        })
      }
    )

    this.presence.subscribe(
      "lobby-full",
      (params: {
        gameMode: GameMode
        minRank: EloRank | null
        noElo?: boolean
      }) => {
        // open another special lobby when the previous one is full
        if (
          params.gameMode === GameMode.RANKED ||
          params.gameMode === GameMode.SCRIBBLE
        ) {
          this.dispatcher.dispatch(new OpenSpecialGameCommand(), params)
        }
      }
    )

    this.presence.subscribe("server-announcement", (message: string) => {
      this.state.addAnnouncement(message)
    })

    this.initCronJobs()
    //this.fetchChat()
    this.fetchTournaments()
  }

  async onAuth(client: Client, options: any, request: any) {
    try {
      super.onAuth(client, options, request)
      const token = await admin.auth().verifyIdToken(options.idToken)
      const user = await admin.auth().getUser(token.uid)
      const isBanned = await BannedUser.findOne({ uid: user.uid })
      const userProfile = await UserMetadata.findOne({ uid: user.uid })
      client.send(Transfer.USER_PROFILE, userProfile)

      if (!user.displayName) {
        logger.error("No display name for this account", user.uid)
        throw new Error(
          "No display name for this account. Please report this error."
        )
      } else if (isBanned) {
        throw new Error("Account banned")
      } else if (
        (this.state.ccu > MAX_CONCURRENT_PLAYERS_ON_SERVER ||
          this.clients.length > MAX_CONCURRENT_PLAYERS_ON_LOBBY) &&
        userProfile?.role !== Role.ADMIN &&
        userProfile?.role !== Role.MODERATOR
      ) {
        throw new Error(
          "The servers are currently at maximum capacity. Please try again later."
        )
      } else {
        return user
      }
    } catch (error) {
      //logger.info(error)
      // biome-ignore lint/complexity/noUselessCatch: <explanation>
      throw error // https://docs.colyseus.io/community/deny-player-join-a-room/
    }
  }

  onJoin(client: Client, options: any, auth: any) {
    this.dispatcher.dispatch(new OnJoinCommand(), {
      client,
      options,
      auth,
      rooms: this.rooms
    })
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (consented) {
        throw new Error("consented leave")
      }
      await this.allowReconnection(client, 30)
      const userProfile = this.users.get(client.auth.uid)
      if (userProfile) {
        client.send(Transfer.USER_PROFILE, userProfile)
      } else {
        throw new Error("Missing User Profile.")
      }
    } catch (error) {
      this.dispatcher.dispatch(new OnLeaveCommand(), { client })
    }
  }

  onDispose() {
    try {
      logger.info("dispose lobby")
      this.dispatcher.stop()
      this.cleanUpCronJobs.forEach((j) => j.stop())
      if (this.unsubscribeLobby) {
        this.unsubscribeLobby()
      }
    } catch (error) {
      logger.error(error)
    }
  }

  async fetchChat() {
    try {
      const messages = await ChatV2.find({
        time: { $gt: Date.now() - 86400000 }
      })
      if (messages) {
        messages.forEach((message) => {
          this.state.messages.push(
            new Message(
              message.id,
              message.payload,
              message.authorId,
              message.author,
              message.avatar,
              message.time
            )
          )
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }

  async fetchTournaments() {
    try {
      const tournaments = await Tournament.find()
      if (tournaments) {
        this.state.tournaments.clear()
        tournaments.forEach(async (tournament) => {
          const startDate = new Date(tournament.startDate)

          if (
            tournament.finished &&
            Date.now() > startDate.getTime() + TOURNAMENT_CLEANUP_DELAY
          ) {
            logger.debug(`Deleted old tournament ${tournament.name}`)
            await Tournament.findByIdAndDelete(tournament.id)
            return
          }

          this.state.tournaments.push(
            new TournamentSchema(
              tournament.id,
              tournament.name,
              tournament.startDate,
              tournament.players,
              tournament.brackets,
              tournament.finished
            )
          )

          if (
            startDate.getTime() > Date.now() &&
            this.tournamentCronJobs.has(tournament.id) === false
          ) {
            logger.debug(
              "Start tournament cron job for",
              new Date(tournament.startDate)
            )
            this.tournamentCronJobs.set(
              tournament.id,
              new CronJob(
                startDate,
                () => this.startTournament(tournament),
                null,
                true
              )
            )

            if (
              Date.now() <
              startDate.getTime() - TOURNAMENT_REGISTRATION_TIME
            ) {
              logger.debug(
                "Start tournament registrations opening cron job for",
                new Date(startDate.getTime() - TOURNAMENT_REGISTRATION_TIME)
              )
              new CronJob(
                new Date(startDate.getTime() - TOURNAMENT_REGISTRATION_TIME),
                () =>
                  this.state.addAnnouncement(
                    `${tournament.name} is starting in one hour. Tournament registration is now open in the Tournament tab.`
                  ),
                null,
                true
              )
            }
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }

  startTournament(tournament: ITournament) {
    logger.info(`Start tournament ${tournament.name}`)
    this.dispatcher.dispatch(new NextTournamentStageCommand(), {
      tournamentId: tournament.id
    })
  }

  initCronJobs() {
    logger.debug("init lobby cron jobs")
    const greatBallRankedLobbyJob = CronJob.from({
      cronTime: GREATBALL_RANKED_LOBBY_CRON,
      timeZone: "Europe/Paris",
      onTick: () => {
        this.dispatcher.dispatch(new OpenSpecialGameCommand(), {
          gameMode: GameMode.RANKED,
          minRank: EloRank.GREATBALL
        })
      },
      start: true
    })
    this.cleanUpCronJobs.push(greatBallRankedLobbyJob)

    const ultraBallRankedLobbyJob = CronJob.from({
      cronTime: ULTRABALL_RANKED_LOBBY_CRON,
      timeZone: "Europe/Paris",
      onTick: () => {
        this.dispatcher.dispatch(new OpenSpecialGameCommand(), {
          gameMode: GameMode.RANKED,
          minRank: EloRank.ULTRABALL
        })
      },
      start: true
    })
    this.cleanUpCronJobs.push(ultraBallRankedLobbyJob)

    const scribbleLobbyJob = CronJob.from({
      cronTime: SCRIBBLE_LOBBY_CRON,
      timeZone: "Europe/Paris",
      onTick: () => {
        this.dispatcher.dispatch(new OpenSpecialGameCommand(), {
          gameMode: GameMode.SCRIBBLE,
          noElo: true
        })
      },
      start: true
    })
    this.cleanUpCronJobs.push(scribbleLobbyJob)

    if (process.env.NODE_APP_INSTANCE || process.env.MODE === "dev") {
      const staleJob = CronJob.from({
        cronTime: "*/1 * * * *", // every minute
        timeZone: "Europe/Paris",
        onTick: async () => {
          logger.debug(`Auto clean up stale rooms`)
          const query = await matchMaker.query({
            // query all the available rooms
            private: false,
            unlisted: false
          })

          query.forEach((data) => {
            if (!this.rooms?.map((r) => r.roomId).includes(data.roomId)) {
              // if the query room was not in this.rooms, add it
              this.addRoom(data.roomId, data)
            }
          })
          this.rooms?.forEach(async (room, roomIndex) => {
            const { type, gameStartedAt } = room.metadata ?? {}
            if (
              (type === "preparation" &&
                gameStartedAt != null &&
                new Date(gameStartedAt).getTime() < Date.now() - 60000) ||
              !query.map((r) => r.roomId).includes(room.roomId)
            ) {
              this.presence.hdel("roomcaches", room.roomId)
              this.removeRoom(roomIndex, room.roomId)
              //   // Attempt to see if the room exit. If it exist, disconnect it
              //   const disconnection = await matchMaker.remoteRoomCall(
              //     room.roomId,
              //     "disconnect"
            }
          })
        },
        start: true
      })

      this.cleanUpCronJobs.push(staleJob)

      const afkJob = CronJob.from({
        cronTime: "*/1 * * * *", // every minute
        timeZone: "Europe/Paris",
        onTick: async () => {
          logger.debug("checking inactive users")
          this.clients.forEach((c) => {
            if (
              c.userData.joinedAt &&
              c.userData.joinedAt < Date.now() - INACTIVITY_TIMEOUT
            ) {
              //logger.info("disconnected user for inactivity", c.id)
              c.leave(CloseCodes.USER_INACTIVE)
            }
          })
        },
        start: true
      })
      this.cleanUpCronJobs.push(afkJob)
    }
  }
}
