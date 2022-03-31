import {Client, Room} from 'colyseus';
import {Dispatcher} from '@colyseus/command';
import PreparationState from './states/preparation-state';
import admin from 'firebase-admin';
import {
  OnGameStartCommand,
  OnJoinCommand,
  OnLeaveCommand,
  OnToggleReadyCommand,
  OnMessageCommand,
  OnAddBotCommand,
  OnRemoveBotCommand,
  InitializeBotsCommand
} from './commands/preparation-commands';
import { BOT_DIFFICULTY } from '../models/enum';

export default class PreparationRoom extends Room {
  dispatcher: Dispatcher<this>;
  elos: Map<any, any>;

  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
    this.elos = new Map();
  }

  onCreate(options: any) {
    console.log('create preparation room');
    // console.log(options);
    const self = this;
    this.setState(new PreparationState(options.ownerId));
    this.maxClients = 8;

    self.dispatcher.dispatch(new InitializeBotsCommand(), options.ownerId);

    this.onMessage('game-start', (client, message) => {
      console.log(message);
      try {
        this.dispatcher.dispatch(new OnGameStartCommand(), {client, message});
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('toggle-ready', (c, message) => {
      try {
        this.dispatcher.dispatch(new OnToggleReadyCommand(), {client: c});
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('new-message', (client, message) => {
      try {
        this.dispatcher.dispatch(new OnMessageCommand(), {
          client: client, 
          message: {
          name: this.state.users.get(client.auth.uid).name,
          avatar: this.state.users.get(client.auth.uid).avatar,
          payload: message.payload,
          time: Date.now()
        }});
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('addBot', (client: Client, d: string) => {
      try {
        this.dispatcher.dispatch(new OnAddBotCommand(), {difficulty: BOT_DIFFICULTY[d]});
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('removeBot', (client: Client, t: string) => {
      try {
        this.dispatcher.dispatch(new OnRemoveBotCommand(), {target: t});
      } catch (error) {
        console.log(error);
      }
    });
  }

  async onAuth(client: Client, options: any, request: any) {
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client: Client, options: any, auth: any) {
    if (client && client.auth && client.auth.displayName) {
      console.log(`${client.auth.displayName} ${client.id} join preparation room`);
      this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
    }
  }

  async onLeave(client: Client, consented: boolean) {
    if (client && client.auth && client.auth.displayName) {
      console.log(`${client.auth.displayName} ${client.id} is leaving preparation room`);
    }
    try {
      if (consented) {
        throw new Error('consented leave');
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 2);
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} ${client.id} leave preparation room`);
      }
      this.dispatcher.dispatch(new OnLeaveCommand(), {client, consented});
    }
  }

  onDispose() {
    console.log('Dispose preparation room');
    this.dispatcher.stop();
  }
}