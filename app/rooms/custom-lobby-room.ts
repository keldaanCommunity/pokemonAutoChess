import { Client, LobbyRoom } from 'colyseus'
import LobbyState from './states/lobby-state'
import {connect, FilterQuery, CallbackError} from 'mongoose'
import Chat from '../models/mongo-models/chat'
import UserMetadata, { IPokemonConfig, IUserMetadata } from '../models/mongo-models/user-metadata'
import LeaderboardInfo from '../models/colyseus-models/leaderboard-info'
import {ArraySchema} from '@colyseus/schema'
import LobbyUser from '../models/colyseus-models/lobby-user'
import admin from 'firebase-admin'
import {GameRecord} from '../models/colyseus-models/game-record'
import {MessageEmbed, WebhookClient} from 'discord.js'
import DetailledStatistic from '../models/mongo-models/detailled-statistic-v2'
import BotV2, { IBot } from '../models/mongo-models/bot-v2'
import Meta, { IMeta } from '../models/mongo-models/meta'
import ItemsStatistic, { IItemsStatistic } from '../models/mongo-models/items-statistic'
import PokemonsStatistic, {IPokemonsStatistic} from '../models/mongo-models/pokemons-statistic'
import { PastebinAPI } from 'pastebin-ts/dist/api'
import { Emotion, EmotionCost, Transfer, CDN_PORTRAIT_URL, ISuggestionUser } from '../types'
import {Pkm} from '../types/enum/Pokemon'
import PokemonFactory from '../models/pokemon-factory'
import PokemonConfig from '../models/colyseus-models/pokemon-config'
import BotMonitoring, { IBotMonitoring } from '../models/mongo-models/bot-monitoring'

const pastebin = new PastebinAPI({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  'api_dev_key': process.env.PASTEBIN_API_DEV_KEY!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  'api_user_name': process.env.PASTEBIN_API_USERNAME!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  'api_user_password': process.env.PASTEBIN_API_PASSWORD!
})

export default class CustomLobbyRoom extends LobbyRoom{
  discordWebhook: WebhookClient
  bots: Map<string, IBot>
  meta: IMeta[]
  metaItems: IItemsStatistic[]
  metaPokemons: IPokemonsStatistic[]
  botMonitor: IBotMonitoring[]

  constructor(){
    super()
    this.discordWebhook = new WebhookClient({url: process.env.WEBHOOK_URL? process.env.WEBHOOK_URL : 'Default Webhook URL'})
    this.bots = new Map<string, IBot>()
    this.meta = new Array<IMeta>()
    this.metaItems = new Array<IItemsStatistic>()
    this.metaPokemons = new Array<IPokemonsStatistic>()
    this.botMonitor = new Array<IBotMonitoring>()
  }

  onCreate(): Promise<void>{
    console.log('create lobby', this.roomId)
    super.onCreate({})
    this.setState(new LobbyState())
    this.autoDispose = false

    this.onMessage(Transfer.NEW_MESSAGE, (client, message) => {
      if (message.payload != '') {
        this.state.addMessage(this.state.users.get(client.auth.uid).name, message.payload, this.state.users.get(client.auth.uid).avatar, Date.now(), true)
      }
    })

    this.onMessage(Transfer.BOT_CREATION, (client, message)=>{
      try {
        const bot = message.bot
        const user = this.state.users.get(client.auth.uid)
        pastebin.createPaste({text: JSON.stringify(bot), title: `${user.name} has uploaded BOT ${bot.name}`, format: 'json'}).then((data: unknown) => {
          const dsEmbed = new MessageEmbed()
              .setTitle(`BOT ${bot.name} created by ${bot.author}`)
              .setURL(data as string)
              .setAuthor(user.name, `${CDN_PORTRAIT_URL}${user.avatar}.png`)
              .setDescription(`A new bot has been created by ${user.name}, You can import the data in the Pokemon Auto Chess Bot Builder (url: ${data} ).`)
              .setThumbnail(`${CDN_PORTRAIT_URL}${bot.avatar}.png`)
          client.send(Transfer.PASTEBIN_URL, {url: data as string})
          try {
            this.discordWebhook.send({
              embeds: [dsEmbed]
            })
          } catch (error) {
            console.log(error)
          }
        })
            .catch((err) => {
              console.log(err)
            })
      } catch (error) {
        console.log(error)
      }
    })

    this.onMessage(Transfer.REQUEST_BOT_LIST, (client)=>{
      const botList = new Array<{name: string, avatar: string}>()

      this.bots.forEach(b=>{
        botList.push({name: b.name, avatar: b.avatar})
      })

      client.send(Transfer.REQUEST_BOT_LIST, botList)
    })

    this.onMessage(Transfer.REQUEST_BOT_DATA, (client, bot)=>{
      const botData = this.bots.get(bot)
      client.send(Transfer.REQUEST_BOT_DATA, botData)
    })

    this.onMessage(Transfer.REQUEST_META, (client)=>{
      client.send(Transfer.REQUEST_META, this.meta)
      client.send(Transfer.REQUEST_META_ITEMS, this.metaItems)
      client.send(Transfer.REQUEST_META_POKEMONS, this.metaPokemons)
      client.send(Transfer.REQUEST_BOT_MONITOR, this.botMonitor)
    })


    this.onMessage(Transfer.OPEN_BOOSTER, (client)=>{
      const user: LobbyUser = this.state.users.get(client.auth.uid)
      if(user && user.booster && user.booster > 0) {
        user.booster -= 1
        const keys = Object.keys(Pkm)
        const boosterIndex: string[] = []
        let i = 5
        while(i > 0){
          const k = keys[Math.floor(Math.random() * keys.length)]
          const p = PokemonFactory.createPokemonFromName(Pkm[k])
          if(p.name != Pkm.MAGIKARP){
            boosterIndex.push(p.index)     
            i--
          }
        }

        boosterIndex.forEach(i=>{
            const c = user.pokemonCollection.get(i)
          if(c){
            c.dust += 40
          }
          else{
            const newConfig = new PokemonConfig(i)
            newConfig.dust += 40
            user.pokemonCollection.set(i, newConfig)
          }
        })

        UserMetadata.findOne({'uid': client.auth.uid}, (err, u: FilterQuery<IUserMetadata>)=>{
          u.booster = user.booster
          boosterIndex.forEach(i=>{
            const c = u.pokemonCollection.get(i)
            if(c){
              c.dust += 40
            }
            else{
              u.pokemonCollection.set(i, {id: i, emotions:[], shinyEmotions:[], dust: 40, selectedEmotion: Emotion.NORMAL, selectedShiny: false })
            }
          })
          u.save()
        })
        client.send(Transfer.BOOSTER_CONTENT,boosterIndex)
      }
    })

    this.onMessage('map', (client, message) => {
      UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
        if (user) {
          const mapName = `${message.map}${message.index}`
          const map = message.map
          const index = message.index
          const mapWin = user.mapWin[map]
          let changeNeeded = false
          if (index == 0) {
            changeNeeded = true
          } else if (index == 1 && mapWin >= 5) {
            changeNeeded = true
          } else if (index == 2 && mapWin >= 10) {
            changeNeeded = true
          } else if (index == 3 && mapWin >= 20) {
            changeNeeded = true
          } else if (index == 4 && mapWin >= 40) {
            changeNeeded = true
          }
          if (changeNeeded && mapName != user.map[map]) {
            user.map[map] = mapName
            user.save()
          }
        }
      })
    })

    this.onMessage(Transfer.CHANGE_NAME, (client, message)=>{
        if(message.name.length > 4){
            this.state.users.get(client.auth.uid).name = message.name
            UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
              if (user) {
                user.displayName = message.name
                user.save()
              }
            })
        }
    })

    this.onMessage(Transfer.CHANGE_SELECTED_EMOTION, (client, message: {index: string, emotion:Emotion, shiny: boolean})=>{
        const user: LobbyUser = this.state.users.get(client.auth.uid)
        const pokemonConfig = user.pokemonCollection.get(message.index)
        if(pokemonConfig){
          const emotionsToCheck = message.shiny ? pokemonConfig.shinyEmotions: pokemonConfig.emotions
          if(emotionsToCheck.includes(message.emotion) && (message.emotion != pokemonConfig.selectedEmotion || message.shiny != pokemonConfig.selectedShiny)){
              pokemonConfig.selectedEmotion = message.emotion
              pokemonConfig.selectedShiny = message.shiny
              UserMetadata.findOne({'uid': client.auth.uid}, (err, u)=>{
                  if (u) {
                      if(u.pokemonCollection.get(message.index)){
                          u.pokemonCollection.get(message.index).selectedEmotion = message.emotion
                          u.pokemonCollection.get(message.index).selectedShiny = message.shiny
                          u.save()
                      }
                  }
              })
          }
        }
    })

    this.onMessage(Transfer.BUY_EMOTION, (client, message: {index: string, emotion:Emotion, shiny: boolean})=>{
        const user: LobbyUser = this.state.users.get(client.auth.uid)
        const pokemonConfig = user.pokemonCollection.get(message.index)
        if(pokemonConfig){
            const emotionsToCheck = message.shiny ? pokemonConfig.shinyEmotions: pokemonConfig.emotions
            const cost = message.shiny ? EmotionCost[message.emotion] * 3: EmotionCost[message.emotion]
            if(!emotionsToCheck.includes(message.emotion) && pokemonConfig.dust >= cost){
                emotionsToCheck.push(message.emotion)
                pokemonConfig.dust -= cost
                pokemonConfig.selectedEmotion = message.emotion
                pokemonConfig.selectedShiny = message.shiny
                UserMetadata.findOne({'uid': client.auth.uid}, (err, u)=>{
                    if (u) {
                        if(u.pokemonCollection.get(message.index)){
                            message.shiny ? u.pokemonCollection.get(message.index).shinyEmotions.push(message.emotion) : u.pokemonCollection.get(message.index).emotions.push(message.emotion)
                            u.pokemonCollection.get(message.index).dust -= cost
                            u.pokemonCollection.get(message.index).selectedEmotion = message.emotion
                            u.pokemonCollection.get(message.index).selectedShiny = message.shiny
                            u.save()
                        }
                    }
                })
            }
        }
    })

    this.onMessage(Transfer.SEARCH_BY_ID, (client, message)=>{
        UserMetadata.findOne({'uid': message}, (err, user) => {
            if (user) {
                DetailledStatistic.find({'playerId': user.uid}, ['pokemons', 'time', 'rank', 'elo'], {limit: 10, sort: {'time': -1}}, (err, stats)=>{
                  if (err) {
                    console.log(err)
                  } else {
                    client.send(Transfer.USER, new LobbyUser(
                        user.uid,
                        user.displayName,
                        user.elo,
                        user.avatar,
                        user.langage,
                        user.wins,
                        user.exp,
                        user.level,
                        user.donor,
                        stats.map(r=>{return new GameRecord(r.time, r.rank, r.elo, r.pokemons)}),
                        user.honors,
                        user.pokemonCollection,
                        user.booster))
                  }
                })
              } else {
                client.send(Transfer.USER, {})
              }
        })
    })

    this.onMessage(Transfer.SEARCH, (client, message)=>{
        if(message.name?.length >= 4){
            const regExp = new RegExp(`${message.name}`)
            UserMetadata.find({'displayName': { $regex: regExp, $options: 'i' } }, ['uid', 'elo', 'displayName', 'level', 'avatar'], {limit: 10, sort: {'level': -1}}, (err, users)=>{
                if(users){
                    const suggestions: Array<ISuggestionUser> = users.map(u=>{ return {
                        id: u.uid,
                        elo: u.elo,
                        name: u.displayName,
                        level: u.level,
                        avatar: u.avatar
                    }})
                    client.send(Transfer.SUGGESTIONS, suggestions)
                }
            })
        }
    })

    this.onMessage(Transfer.CHANGE_AVATAR, (client, message: {index: string, emotion: Emotion, shiny: boolean}) => {
      const user: LobbyUser = this.state.users.get(client.auth.uid)
      const config = user.pokemonCollection.get(message.index)
      if(config){
        const emotionsToCheck = message.shiny ? config.shinyEmotions: config.emotions
        if(emotionsToCheck.includes(message.emotion)){
          const shinyPad = message.shiny ? '0000/0001' : ''
          user.avatar = `${message.index}/${shinyPad}/${message.emotion}`
          UserMetadata.findOne({'uid': client.auth.uid}, (err: CallbackError, u: FilterQuery<IUserMetadata>)=>{
            u.avatar = `${message.index}/${shinyPad}/${message.emotion}`
            u.save()
          })
        }
      }
    })

    return new Promise((resolve) => {
      connect(process.env.MONGO_URI? process.env.MONGO_URI : 'Default Mongo URI', {}, () => {
        Chat.find({ 'time': { $gt: Date.now() - 86400000 } }, (err, messages) => {
          if (err) {
            console.log(err)
          } else {
            messages.forEach((message) => {
              this.state.addMessage(message.name, message.payload, message.avatar, message.time, false)
            })
          }
        })
        UserMetadata.find({}, ['displayName', 'avatar', 'elo'], { limit: 30, sort: { 'elo': -1 } }, (err, users) => {
          if (err) {
            console.log(err)
          } else {
            for (let i = 0; i < users.length; i++) {
              const user = users[i]
              this.state.leaderboard.push(new LeaderboardInfo(user.displayName, user.avatar, i + 1, user.elo))
            }
          }
        })
        BotV2.find({}, { _id: 0 }, { sort: { elo: -1 } }, (_err, bots) => {
          bots.forEach((bot, i) => {
            this.bots.set(bot.avatar, bot)
            // console.log(bot.avatar, bot.elo);
            this.state.botLeaderboard.push(new LeaderboardInfo(`${bot.name} by @${bot.author}`, bot.avatar, i + 1, bot.elo))
          })
        })
        Meta.find({}, (err, docs) => {
          if (err) {
            console.log(err)
          } else {
            docs.forEach((doc) => {
              this.meta.push(doc)
            })
          }
        })
        ItemsStatistic.find({}, (err, docs) => {
          if (err) {
            console.log(err)
          } else {
            docs.forEach((doc) => {
              this.metaItems.push(doc)
            })
          }
        })
        PokemonsStatistic.find({}, (err, docs) => {
          if (err) {
            console.log(err)
          } else {
            docs.forEach((doc) => {
              this.metaPokemons.push(doc)
            })
          }
        })
        
        BotMonitoring.find({}, (err, docs) => {
          if (err) {
            console.log(err)
          } else {
            docs.forEach((doc) => {
              this.botMonitor.push(doc)
            })
          }
        })
      })
      resolve()
    })
  }

  async onAuth(client :Client, options: any, request: any) {
    super.onAuth(client, options, request)
    const token = await admin.auth().verifyIdToken(options.idToken)
    const user = await admin.auth().getUser(token.uid)
    return user
  }

  onJoin(client: Client, options: any) {
    super.onJoin(client, options)
    console.log(`${client.auth.displayName} ${client.id} join lobby room`)
    // client.send(Transfer.REQUEST_BOT_DATA, this.bots);
    UserMetadata.findOne({'uid': client.auth.uid}, (err: any, user: IUserMetadata)=>{
      if (user) {
        DetailledStatistic.find({'playerId': client.auth.uid}, ['pokemons', 'time', 'rank', 'elo'], {limit: 10, sort: {'time': -1}}, (err, stats)=>{
          if (err) {
            console.log(err)
          } else {
            const records = new ArraySchema<GameRecord>()
            stats.forEach((record) =>{
              records.push(new GameRecord(record.time, record.rank, record.elo, record.pokemons))
            })

            this.state.users.set(client.auth.uid, new LobbyUser(
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
                user.booster))
          }
        })
      } else {
        const numberOfBoosters = 3
        UserMetadata.create({
          uid: client.auth.uid,
          displayName: client.auth.displayName,
          booster: numberOfBoosters,
          pokemonCollection: new Map<string,IPokemonConfig>()
        })
        this.state.users.set(client.auth.uid, new LobbyUser(
            client.auth.uid,
            client.auth.displayName,
            1000,
            '0019/Normal',
            'eng',
            0,
            0,
            0,
            false,
            [],
            [],
            new Map<string,IPokemonConfig>(),
            numberOfBoosters
        ))
      }
    })
  }

  onLeave(client :Client) {
    try {
      super.onLeave(client)
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} ${client.id} leave lobby`)
        this.state.users.delete(client.auth.uid)
      }
    } catch (error) {
      console.log(error)
    }
  }

  onDispose() {
    try {
      super.onDispose()
      console.log('dispose lobby')
    } catch (error) {
      console.log(error)
    }
  }
}