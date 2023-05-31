import { Command } from "@colyseus/command"
import { Client, logger, RoomListingData } from "colyseus"
import { ArraySchema } from "@colyseus/schema"
import { GameRecord } from "../../models/colyseus-models/game-record"
import LobbyUser from "../../models/colyseus-models/lobby-user"
import UserMetadata, {
  IUserMetadata,
  IPokemonConfig
} from "../../models/mongo-models/user-metadata"
import DetailledStatistic from "../../models/mongo-models/detailled-statistic-v2"
import {
  Transfer,
  Role,
  Title,
  Emotion,
  USERNAME_REGEXP,
  ISuggestionUser,
  CDN_PORTRAIT_URL
} from "../../types"
import CustomLobbyRoom from "../custom-lobby-room"
import { nanoid } from "nanoid"
import { Pkm, PkmFamily, PkmIndex } from "../../types/enum/Pokemon"
import { CallbackError, FilterQuery } from "mongoose"
import PokemonConfig from "../../models/colyseus-models/pokemon-config"
import PRECOMPUTED_RARITY_POKEMONS from "../../models/precomputed/type-rarity-all.json"
import { RarityProbability, getEmotionCost } from "../../types/Config"
import { Rarity } from "../../types/enum/Game"
import { sum } from "../../utils/array"
import { pickRandomIn } from "../../utils/random"
import { getPortraitSrc } from "../../public/src/utils"

export class OnJoinCommand extends Command<
  CustomLobbyRoom,
  {
    client: Client
    options: any
    auth: any
    rooms: RoomListingData<any>[] | undefined
  }
> {
  execute({
    client,
    rooms = []
  }: {
    client: Client
    options: any
    auth: any
    rooms: RoomListingData<any>[] | undefined
  }) {
    try {
      logger.info(`${client.auth.displayName} ${client.id} join lobby room`)
      client.send(Transfer.ROOMS, rooms)
      // client.send(Transfer.REQUEST_BOT_DATA, this.bots);
      UserMetadata.findOne(
        { uid: client.auth.uid },
        (err: any, user: IUserMetadata) => {
          if (user) {
            // load existing account
            DetailledStatistic.find(
              { playerId: client.auth.uid },
              ["pokemons", "time", "rank", "elo"],
              { limit: 10, sort: { time: -1 } },
              (err, stats) => {
                if (err) {
                  logger.error(err)
                } else {
                  const records = new ArraySchema<GameRecord>()
                  stats.forEach((record) => {
                    records.push(
                      new GameRecord(
                        record.time,
                        record.rank,
                        record.elo,
                        record.pokemons
                      )
                    )
                  })

                  this.state.users.set(
                    client.auth.uid,
                    new LobbyUser(
                      user.uid,
                      user.displayName,
                      user.elo,
                      user.avatar,
                      user.langage,
                      user.wins,
                      user.exp,
                      user.level,
                      user.donor,
                      records,
                      user.honors,
                      user.pokemonCollection,
                      user.booster,
                      user.titles,
                      user.title,
                      user.role,
                      client.auth.email === undefined &&
                        client.auth.photoURL === undefined
                    )
                  )
                }
              }
            )
          } else {
            // create new user account
            const numberOfBoosters = 3
            UserMetadata.create({
              uid: client.auth.uid,
              displayName: client.auth.displayName,
              booster: numberOfBoosters,
              pokemonCollection: new Map<string, IPokemonConfig>()
            })
            this.state.users.set(
              client.auth.uid,
              new LobbyUser(
                client.auth.uid,
                client.auth.displayName,
                1000,
                "0019/Normal",
                "eng",
                0,
                0,
                0,
                false,
                [],
                [],
                new Map<string, IPokemonConfig>(),
                numberOfBoosters,
                [],
                "",
                Role.BASIC,
                client.auth.email === undefined &&
                  client.auth.photoURL === undefined
              )
            )
          }
        }
      )
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnLeaveCommand extends Command<
  CustomLobbyRoom,
  { client: Client }
> {
  execute({ client }: { client: Client }) {
    try {
      if (client && client.auth && client.auth.displayName && client.auth.uid) {
        logger.info(`${client.auth.displayName} ${client.id} leave lobby`)
        this.state.users.delete(client.auth.uid)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class GiveTitleCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; title: Title }
> {
  execute({
    client,
    uid,
    title
  }: {
    client: Client
    uid: string
    title: Title
  }) {
    try {
      const u = this.state.users.get(client.auth.uid)
      const targetUser = this.state.users.get(uid)

      if (u && u.role && u.role === Role.ADMIN) {
        UserMetadata.findOne({ uid }, (err, user) => {
          if (err) logger.error(err)
          else if (user && user.titles && !user.titles.includes(title)) {
            user.titles.push(title)
            user.save()

            if (targetUser) {
              targetUser.titles.push(title)
            }
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class GiveBoostersCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; numberOfBoosters: number }
> {
  execute({
    client,
    uid,
    numberOfBoosters = 1
  }: {
    client: Client
    uid: string
    numberOfBoosters: number
  }) {
    try {
      const u = this.state.users.get(client.auth.uid)
      const targetUser = this.state.users.get(uid)

      if (u && u.role && u.role === Role.ADMIN) {
        UserMetadata.findOne({ uid: uid }, (err, user) => {
          if (err) logger.error(err)
          else if (user) {
            user.booster += numberOfBoosters
            user.save()

            if (targetUser) {
              targetUser.booster = user.booster
            }
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class GiveRoleCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string; role: Role }
> {
  execute({ client, uid, role }: { client: Client; uid: string; role: Role }) {
    try {
      const u = this.state.users.get(client.auth.uid)
      const targetUser = this.state.users.get(uid)
      // logger.debug(u.role, uid)
      if (u && u.role === Role.ADMIN) {
        UserMetadata.findOne({ uid: uid }, (err, user) => {
          if (err) logger.error(err)
          else if (user) {
            user.role = role
            user.save()

            if (targetUser) {
              targetUser.role = user.role
            }
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}
export class OnNewMessageCommand extends Command<
  CustomLobbyRoom,
  { client: Client; message: string }
> {
  execute({ client, message }: { client: Client; message: string }) {
    try {
      const MAX_MESSAGE_LENGTH = 250
      const user = this.state.users.get(client.auth.uid)
      if (user && !user.anonymous && message != "") {
        this.state.addMessage(
          nanoid(),
          message.substring(0, MAX_MESSAGE_LENGTH),
          user.id,
          user.name,
          user.avatar,
          Date.now(),
          true
        )
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class RemoveMessageCommand extends Command<
  CustomLobbyRoom,
  { client: Client; messageId: string }
> {
  execute({ client, messageId }: { client: Client; messageId: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (
        user &&
        user.role &&
        (user.role === Role.ADMIN || user.role === Role.MODERATOR)
      ) {
        this.state.removeMessage(messageId)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OpenBoosterCommand extends Command<
  CustomLobbyRoom,
  { client: Client }
> {
  execute({ client }: { client: Client }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return

      const DUST_PER_BOOSTER = 50
      if (user && user.booster && user.booster > 0) {
        user.booster -= 1
        const boosterIndex: string[] = []

        for (let i = 0; i < 5; i++) {
          const pkm = pickRandomPokemonBooster()
          boosterIndex.push(PkmIndex[pkm])
        }

        boosterIndex.forEach((i) => {
          const c = user.pokemonCollection.get(i)
          if (c) {
            c.dust += DUST_PER_BOOSTER
          } else {
            const newConfig = new PokemonConfig(i)
            newConfig.dust += DUST_PER_BOOSTER
            user.pokemonCollection.set(i, newConfig)
          }
        })

        UserMetadata.findOne(
          { uid: client.auth.uid },
          (err, u: FilterQuery<IUserMetadata>) => {
            if (err) logger.error(err)
            else if (u) {
              u.booster = user.booster
              boosterIndex.forEach((i) => {
                const c = u.pokemonCollection.get(i)
                if (c) {
                  c.dust += DUST_PER_BOOSTER
                } else {
                  u.pokemonCollection.set(i, {
                    id: i,
                    emotions: [],
                    shinyEmotions: [],
                    dust: DUST_PER_BOOSTER,
                    selectedEmotion: Emotion.NORMAL,
                    selectedShiny: false
                  })
                }
              })
              u.save()
            }
          }
        )
        client.send(Transfer.BOOSTER_CONTENT, boosterIndex)
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

function pickRandomPokemonBooster(): Pkm {
  let pkm = Pkm.MAGIKARP
  const rarities = Object.keys(Rarity) as Rarity[]
  const seed = Math.random() * sum(Object.values(RarityProbability))
  let threshold = 0
  for (let i = 0; i < rarities.length; i++) {
    const rarity = rarities[i]
    const rarityProbability = RarityProbability[rarity]
    threshold += rarityProbability
    if (
      seed < threshold &&
      PRECOMPUTED_RARITY_POKEMONS[rarity] &&
      PRECOMPUTED_RARITY_POKEMONS[rarity].length > 0
    ) {
      pkm = pickRandomIn(PRECOMPUTED_RARITY_POKEMONS[rarity]) as Pkm
      break
    }
  }
  return pkm
}

export class ChangeNameCommand extends Command<
  CustomLobbyRoom,
  { client: Client; name: string }
> {
  execute({ client, name }: { client: Client; name: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      if (USERNAME_REGEXP.test(name)) {
        user.name = name
        UserMetadata.findOne({ uid: client.auth.uid }, (err, user) => {
          if (err) logger.error(err)
          else if (user) {
            user.displayName = name
            user.save()
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeTitleCommand extends Command<
  CustomLobbyRoom,
  { client: Client; title: Title | "" }
> {
  execute({ client, title }: { client: Client; title: Title | "" }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (user) {
        if (user.title === title) {
          title = "" // remove title if user already has it
        }
        user.title = title
        UserMetadata.findOne({ uid: client.auth.uid }, (err, user) => {
          if (err) logger.error(err)
          else if (user) {
            user.title = title
            user.save()
          }
        })
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeSelectedEmotionCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string; emotion: Emotion; shiny: boolean }
> {
  execute({
    client,
    emotion,
    index,
    shiny
  }: {
    client: Client
    index: string
    emotion: Emotion
    shiny: boolean
  }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const pokemonConfig = user.pokemonCollection.get(index)
      if (pokemonConfig) {
        const emotionsToCheck = shiny
          ? pokemonConfig.shinyEmotions
          : pokemonConfig.emotions
        if (
          emotionsToCheck.includes(emotion) &&
          (emotion != pokemonConfig.selectedEmotion ||
            shiny != pokemonConfig.selectedShiny)
        ) {
          pokemonConfig.selectedEmotion = emotion
          pokemonConfig.selectedShiny = shiny
          UserMetadata.findOne({ uid: client.auth.uid }, (err, u) => {
            if (err) logger.error(err)
            else if (u) {
              if (u.pokemonCollection.has(index)) {
                const pokemonConfig = u.pokemonCollection.get(index)
                pokemonConfig.selectedEmotion = emotion
                pokemonConfig.selectedShiny = shiny
                u.save()
              }
            }
          })
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class ChangeAvatarCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string; emotion: Emotion; shiny: boolean }
> {
  execute({
    client,
    index,
    emotion,
    shiny
  }: {
    client: Client
    index: string
    emotion: Emotion
    shiny: boolean
  }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const config = user.pokemonCollection.get(index)
      if (config) {
        const emotionsToCheck = shiny ? config.shinyEmotions : config.emotions
        if (emotionsToCheck.includes(emotion)) {
          const portrait = getPortraitSrc(index, shiny, emotion)
            .replace(CDN_PORTRAIT_URL, "")
            .replace(".png", "")
          user.avatar = portrait
          UserMetadata.findOne(
            { uid: client.auth.uid },
            (err: CallbackError, u: FilterQuery<IUserMetadata>) => {
              if (err) logger.error(err)
              else if (u) {
                u.avatar = portrait
                u.save()
              }
            }
          )
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class BuyEmotionCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string; emotion: Emotion; shiny: boolean }
> {
  execute({
    client,
    emotion,
    index,
    shiny
  }: {
    client: Client
    index: string
    emotion: Emotion
    shiny: boolean
  }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const pokemonConfig = user.pokemonCollection.get(index)
      if (pokemonConfig) {
        const emotionsToCheck = shiny
          ? pokemonConfig.shinyEmotions
          : pokemonConfig.emotions
        const cost = getEmotionCost(emotion, shiny)
        if (!emotionsToCheck.includes(emotion) && pokemonConfig.dust >= cost) {
          emotionsToCheck.push(emotion)
          pokemonConfig.dust -= cost
          pokemonConfig.selectedEmotion = emotion
          pokemonConfig.selectedShiny = shiny
          UserMetadata.findOne({ uid: client.auth.uid }, (err, u) => {
            if (err) logger.error(err)
            else if (u) {
              let numberOfShinies = 0
              u.pokemonCollection.forEach((c) => {
                numberOfShinies += c.shinyEmotions.length
              })
              if (
                numberOfShinies > 30 &&
                !u.titles.includes(Title.SHINY_SEEKER)
              ) {
                u.titles.push(Title.SHINY_SEEKER)
              }
              if (
                u.pokemonCollection.size >= 30 &&
                !u.titles.includes(Title.DUKE)
              ) {
                u.titles.push(Title.DUKE)
              }
              if (
                emotion === Emotion.ANGRY &&
                index === PkmIndex[Pkm.ARBOK] &&
                !u.titles.includes(Title.DENTIST)
              ) {
                u.titles.push(Title.DENTIST)
              }
              if (u.pokemonCollection.has(index)) {
                const uPokemonConfig = u.pokemonCollection.get(index)
                if (
                  uPokemonConfig.shinyEmotions.length >=
                    Object.keys(Emotion).length &&
                  uPokemonConfig.emotions.length >=
                    Object.keys(Emotion).length &&
                  !u.titles.includes(Title.DUCHESS)
                ) {
                  u.titles.push(Title.DUCHESS)
                }

                const unowns = (Object.keys(PkmFamily) as Pkm[]).filter(
                  (pkm) => PkmFamily[pkm] === Pkm.UNOWN_A
                )
                if (
                  !u.titles.includes(Title.ARCHEOLOGIST) &&
                  unowns.every((name) => {
                    const index = PkmIndex[name]
                    const collection = u.pokemonCollection.get(index)
                    const isUnlocked =
                      collection &&
                      (collection.emotions.length > 0 ||
                        collection.shinyEmotions.length > 0)
                    return isUnlocked || index === index
                  })
                ) {
                  u.titles.push(Title.ARCHEOLOGIST)
                }

                if (shiny) {
                  uPokemonConfig.shinyEmotions.push(emotion)
                } else {
                  uPokemonConfig.emotions.push(emotion)
                }

                uPokemonConfig.dust -= cost
                uPokemonConfig.selectedEmotion = emotion
                uPokemonConfig.selectedShiny = shiny
                u.save()
              }
            }
          })
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class BuyBoosterCommand extends Command<
  CustomLobbyRoom,
  { client: Client; index: string }
> {
  execute({ client, index }: { client: Client; index: string }) {
    try {
      const user = this.state.users.get(client.auth.uid)
      if (!user) return
      const pokemonConfig = user.pokemonCollection.get(index)
      if (pokemonConfig) {
        const BOOSTER_COST = 500
        if (pokemonConfig.dust >= BOOSTER_COST) {
          pokemonConfig.dust -= BOOSTER_COST
          user.booster += 1
          UserMetadata.findOne({ uid: client.auth.uid }, (err, u) => {
            if (err) logger.error(err)
            else if (u) {
              u.pokemonCollection.get(index).dust = pokemonConfig.dust
              u.booster = user.booster
              u.save()
            }
          })
        }
      }
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnSearchByIdCommand extends Command<
  CustomLobbyRoom,
  { client: Client; uid: string }
> {
  execute({ client, uid }: { client: Client; uid: string }) {
    try {
      UserMetadata.findOne({ uid }, (err, user) => {
        if (err) logger.error(err)
        else if (user) {
          DetailledStatistic.find(
            { playerId: user.uid },
            ["pokemons", "time", "rank", "elo"],
            { limit: 10, sort: { time: -1 } },
            (err, stats) => {
              if (err) {
                logger.error(err)
              } else {
                client.send(
                  Transfer.USER,
                  new LobbyUser(
                    user.uid,
                    user.displayName,
                    user.elo,
                    user.avatar,
                    user.langage,
                    user.wins,
                    user.exp,
                    user.level,
                    user.donor,
                    stats.map((r) => {
                      return new GameRecord(r.time, r.rank, r.elo, r.pokemons)
                    }),
                    user.honors,
                    user.pokemonCollection,
                    user.booster,
                    user.titles,
                    user.title,
                    user.role,
                    false
                  )
                )
              }
            }
          )
        } else {
          client.send(Transfer.USER, {})
        }
      })
    } catch (error) {
      logger.error(error)
    }
  }
}

export class OnSearchCommand extends Command<
  CustomLobbyRoom,
  { client: Client; name: string }
> {
  execute({ client, name }: { client: Client; name: string }) {
    try {
      if (USERNAME_REGEXP.test(name)) {
        const regExp = new RegExp(name)
        UserMetadata.find(
          { displayName: { $regex: regExp, $options: "i" } },
          ["uid", "elo", "displayName", "level", "avatar"],
          { limit: 100, sort: { level: -1 } },
          (err, users) => {
            if (err) logger.error(err)
            else if (users) {
              const suggestions: Array<ISuggestionUser> = users.map((u) => {
                return {
                  id: u.uid,
                  elo: u.elo,
                  name: u.displayName,
                  level: u.level,
                  avatar: u.avatar
                }
              })
              client.send(Transfer.SUGGESTIONS, suggestions)
            }
          }
        )
      }
    } catch (error) {
      logger.error(error)
    }
  }
}