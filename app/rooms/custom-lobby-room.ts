import { Client, LobbyRoom } from "colyseus";
import LobbyState from './states/lobby-state';
import {connect, FilterQuery} from 'mongoose';
import Chat from '../models/mongo-models/chat';
import UserMetadata, { IPokemonConfig, IUserMetadata } from '../models/mongo-models/user-metadata';
import LeaderboardInfo from '../models/colyseus-models/leaderboard-info';
import {ArraySchema} from '@colyseus/schema';
import LobbyUser from '../models/colyseus-models/lobby-user';
import admin from 'firebase-admin';
import {GameRecord} from '../models/colyseus-models/game-record';
import {MessageEmbed, WebhookClient} from 'discord.js';
import DetailledStatistic from '../models/mongo-models/detailled-statistic-v2';
import BotV2, { IBot } from '../models/mongo-models/bot-v2';
import Meta, { IMeta } from '../models/mongo-models/meta';
import ItemsStatistic, { IItemsStatistic } from '../models/mongo-models/items-statistic';
import { PastebinAPI } from 'pastebin-ts/dist/api';
import { Emotion, EmotionCost } from "../types";
import {Pkm} from '../types/enum/Pokemon';
import { CDN_PORTRAIT_URL } from "../models/enum";
import PokemonFactory from "../models/pokemon-factory";
import PokemonConfig from "../models/colyseus-models/pokemon-config";

const pastebin = new PastebinAPI({
  'api_dev_key': process.env.PASTEBIN_API_DEV_KEY,
  'api_user_name': process.env.PASTEBIN_API_USERNAME,
  'api_user_password': process.env.PASTEBIN_API_PASSWORD
});

export default class CustomLobbyRoom<ICustomLobbyState> extends LobbyRoom{
  discordWebhook: WebhookClient;
  bots: Map<string, IBot>;
  meta: IMeta[];
  metaItems: IItemsStatistic[];

  onCreate(options: any): Promise<void>{
    console.log(`create lobby`, this.roomId);
    super.onCreate(options);
    this.discordWebhook = new WebhookClient({url: process.env.WEBHOOK_URL});
    this.bots = new Map();
    this.meta = [];
    this.metaItems = [];
    this.setState(new LobbyState());
    this.autoDispose = false;

    this.onMessage('new-message', (client, message) => {
      if (message.payload != '') {
        this.state.addMessage(this.state.users.get(client.auth.uid).name, message.payload, this.state.users.get(client.auth.uid).avatar, Date.now(), true);
      }
    });

    this.onMessage('bot-creation', (client, message)=>{
      try {
        const bot = message.bot;
        const user = this.state.users.get(client.auth.uid);
        pastebin.createPaste({text: JSON.stringify(bot), title: `${user.name} has uploaded BOT ${bot.name}`, format: 'json'}).then((data: any) => {
          const dsEmbed = new MessageEmbed()
              .setTitle(`BOT ${bot.name} created by ${bot.author}`)
              .setURL(data)
              .setAuthor(user.name, `${CDN_PORTRAIT_URL}${user.avatar}.png`)
              .setDescription(`A new bot has been created by ${user.name}, You can import the data in the Pokemon Auto Chess Bot Builder (url: ${data} ).`)
              .setThumbnail(`${CDN_PORTRAIT_URL}${bot.avatar}.png`);
          client.send('pastebin-url', {url: data});
          try {
            this.discordWebhook.send({
              embeds: [dsEmbed]
            });
          } catch (error) {
            console.log(error);
          }
        })
            .catch((err) => {
              console.log(err);
            });
      } catch (error) {
        console.log(error);
      }
    });

    this.onMessage('bot-list-request', (client, message)=>{
      const botList = [];

      this.bots.forEach(b=>{
        botList.push({name: b.name, avatar: b.avatar});
      });

      client.send('bot-list', botList);
    });

    this.onMessage('bot-data-request', (client, bot)=>{
      const botData = this.bots.get(bot);
      client.send('bot-data', botData);
    });

    this.onMessage('meta', (client, message)=>{
      client.send('meta', this.meta);
      client.send('metaItems', this.metaItems);
    });

    this.onMessage('open-booster', (client, message)=>{
      const user: LobbyUser = this.state.users.get(client.auth.uid);
      if(user.booster && user.booster > 0) {
        user.booster -= 1;
        const keys = Object.keys(Pkm);
        const boosterIndex: string[] = [];
        let i = 5;
        while(i > 0){
          const k = keys[Math.floor(Math.random() * keys.length)];
          const p = PokemonFactory.createPokemonFromName(Pkm[k]);
          if(p.name != Pkm.MAGIKARP){
            boosterIndex.push(p.index);     
            i--;
          }
        }

        boosterIndex.forEach(i=>{
          if(user.pokemonCollection.has(i)){
            user.pokemonCollection.get(i).dust += 40;
          }
          else{
            user.pokemonCollection.set(i, new PokemonConfig(i));
            user.pokemonCollection.get(i).dust += 40;
          }
        });

        UserMetadata.findOne({'uid': client.auth.uid}, (err, u: FilterQuery<IUserMetadata>)=>{
          u.booster = user.booster;
          boosterIndex.forEach(i=>{
            if(u.pokemonCollection.has(i)){
              u.pokemonCollection.get(i).dust += 40;
            }
            else{
              u.pokemonCollection.set(i, {id: i, emotions:[], shinyEmotions:[], dust: 0, selectedEmotion: Emotion.NORMAL, selectedShiny: false });
              u.pokemonCollection.get(i).dust += 40;
            }
          });
          u.save();
        });
        client.send('booster-content',boosterIndex);
      }
    });

    this.onMessage('map', (client, message) => {
      UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
        if (user) {
          const mapName = `${message.map}${message.index}`;
          const map = message.map;
          const index = message.index;
          const mapWin = user.mapWin[map];
          let changeNeeded = false;
          if (index == 0) {
            changeNeeded = true;
          } else if (index == 1 && mapWin >= 5) {
            changeNeeded = true;
          } else if (index == 2 && mapWin >= 10) {
            changeNeeded = true;
          } else if (index == 3 && mapWin >= 20) {
            changeNeeded = true;
          } else if (index == 4 && mapWin >= 40) {
            changeNeeded = true;
          }
          if (changeNeeded && mapName != user.map[map]) {
            user.map[map] = mapName;
            user.save();
          }
        }
      });
    });

    this.onMessage('name', (client, message)=>{
      this.state.users.get(client.auth.uid).name = message.name;
      UserMetadata.findOne({'uid': client.auth.uid}, (err, user)=>{
        if (user) {
          user.displayName = message.name;
          user.save();
        }
      });
    });

    this.onMessage('change-selected-emotion', (client, message: {index: string, emotion:Emotion, shiny: boolean})=>{
        const user: LobbyUser = this.state.users.get(client.auth.uid);
        if(user.pokemonCollection.has(message.index)){
            const pokemonConfig = user.pokemonCollection.get(message.index);
            const emotionsToCheck = message.shiny ? pokemonConfig.shinyEmotions: pokemonConfig.emotions;
            if(emotionsToCheck.includes(message.emotion) && message.emotion != pokemonConfig.selectedEmotion){
                pokemonConfig.selectedEmotion = message.emotion;
                pokemonConfig.selectedShiny = message.shiny;
                UserMetadata.findOne({'uid': client.auth.uid}, (err, u)=>{
                    if (u) {
                        if(u.pokemonCollection.get(message.index)){
                            u.pokemonCollection.get(message.index).selectedEmotion = message.emotion;
                            u.pokemonCollection.get(message.index).selectedShiny = message.shiny;
                            u.save();
                        }
                    }
                });
            }
        }
    });

    this.onMessage('buy-emotion', (client, message: {index: string, emotion:Emotion, shiny: boolean})=>{
        const user: LobbyUser = this.state.users.get(client.auth.uid);
        if(user.pokemonCollection.has(message.index)){
            const pokemonConfig = user.pokemonCollection.get(message.index);
            const emotionsToCheck = message.shiny ? pokemonConfig.shinyEmotions: pokemonConfig.emotions;
            const cost = message.shiny ? EmotionCost[message.emotion] * 3: EmotionCost[message.emotion];
            if(!emotionsToCheck.includes(message.emotion) && pokemonConfig.dust >= cost){
                emotionsToCheck.push(message.emotion);
                pokemonConfig.dust -= cost;
                pokemonConfig.selectedEmotion = message.emotion;
                pokemonConfig.selectedShiny = message.shiny;
                UserMetadata.findOne({'uid': client.auth.uid}, (err, u)=>{
                    if (u) {
                        if(u.pokemonCollection.get(message.index)){
                            message.shiny ? u.pokemonCollection.get(message.index).shinyEmotions.push(message.emotion) : u.pokemonCollection.get(message.index).emotions.push(message.emotion);
                            u.pokemonCollection.get(message.index).dust -= cost;
                            u.pokemonCollection.get(message.index).selectedEmotion = message.emotion;
                            u.pokemonCollection.get(message.index).selectedShiny = message.shiny;
                            u.save();
                        }
                    }
                });
            }
        }
    });

    this.onMessage('search', (client, message)=>{
      UserMetadata.findOne({'displayName': message.name}, (err: any, user: IUserMetadata)=>{
        if (user) {
          DetailledStatistic.find({'playerId': user.uid}, ['pokemons', 'time', 'rank', 'elo'], {limit: 10, sort: {'time': -1}}, (err, stats)=>{
            if (err) {
              console.log(err);
            } else {
              client.send('user', new LobbyUser(
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
                  user.booster));
            }
          });
        } else {
          client.send('user', {});
        }
      });
    });

    this.onMessage('avatar', (client, message: {index: string, emotion: Emotion, shiny: boolean}) => {
      const user: LobbyUser = this.state.users.get(client.auth.uid);
      const config = user.pokemonCollection.get(message.index);
      if(config){
        const emotionsToCheck = message.shiny ? config.shinyEmotions: config.emotions;
        if(emotionsToCheck.includes(message.emotion)){
          const shinyPad = message.shiny ? '0000/0001' : '';
          user.avatar = `${message.index}/${shinyPad}/${message.emotion}`;
          UserMetadata.findOne({'uid': client.auth.uid}, (err: any, u: FilterQuery<IUserMetadata>)=>{
            u.avatar = `${message.index}/${shinyPad}/${message.emotion}`;
            u.save();
          });
        }
      }
    });

    return new Promise((resolve, reject) => {
      connect(process.env.MONGO_URI, {}, () => {
        Chat.find({ 'time': { $gt: Date.now() - 86400000 } }, (err, messages) => {
          if (err) {
            console.log(err);
          } else {
            messages.forEach((message) => {
              this.state.addMessage(message.name, message.payload, message.avatar, message.time, false);
            });
          }
        });
        UserMetadata.find({}, ['displayName', 'avatar', 'elo'], { limit: 30, sort: { 'elo': -1 } }, (err, users) => {
          if (err) {
            console.log(err);
          } else {
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              this.state.leaderboard.push(new LeaderboardInfo(user.displayName, user.avatar, i + 1, user.elo));
            }
          }
        });
        BotV2.find({}, { _id: 0 }, { sort: { elo: -1 } }, (_err, bots) => {
          bots.forEach((bot, i) => {
            this.bots.set(bot.avatar, bot);
            // console.log(bot.avatar, bot.elo);
            this.state.botLeaderboard.push(new LeaderboardInfo(`${bot.name} by @${bot.author}`, bot.avatar, i + 1, bot.elo));
          });
        });
        Meta.find({}, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            docs.forEach((doc) => {
              this.meta.push(doc);
            });
          }
        });
        ItemsStatistic.find({}, (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            docs.forEach((doc) => {
              this.metaItems.push(doc);
            });
          }
        });
      });
      resolve();
    });
  }

  async onAuth(client :Client, options: any, request: any) {
    super.onAuth(client, options, request);
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client: Client, options: any) {
    super.onJoin(client, options);
    console.log(`${client.auth.displayName} ${client.id} join lobby room`);
    // client.send('bot-data', this.bots);
    UserMetadata.findOne({'uid': client.auth.uid}, (err: any, user: IUserMetadata)=>{
      if (user) {
        DetailledStatistic.find({'playerId': client.auth.uid}, ['pokemons', 'time', 'rank', 'elo'], {limit: 10, sort: {'time': -1}}, (err, stats)=>{
          if (err) {
            console.log(err);
          } else {
            const records = new ArraySchema<GameRecord>();
            stats.forEach((record) =>{
              records.push(new GameRecord(record.time, record.rank, record.elo, record.pokemons));
            });

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
                user.booster));
          }
        });
      } else {
        const numberOfBoosters = 3;
        UserMetadata.create({
          uid: client.auth.uid,
          displayName: client.auth.displayName,
          booster: numberOfBoosters,
          pokemonCollection: new Map<string,IPokemonConfig>()
        });
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
        ));
      }
    });
  }

  onLeave(client :Client) {
    try {
      super.onLeave(client);
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} ${client.id} leave lobby`);
        this.state.users.delete(client.auth.uid);
      }
    } catch (error) {
      console.log(error);
    }
  }

  onDispose() {
    try {
      super.onDispose();
      console.log(`dispose lobby`);
    } catch (error) {
      console.log(error);
    }
  }
}