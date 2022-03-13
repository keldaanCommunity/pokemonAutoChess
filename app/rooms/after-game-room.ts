import {Client, Room} from 'colyseus';
import SimplePlayer from '../models/colyseus-models/simple-player';
import {Dispatcher} from '@colyseus/command';
import AfterGameState from './states/after-game-state';
import admin from'firebase-admin';
import {
  OnJoinCommand,
  OnLeaveCommand,
  OnMessageCommand
} from './commands/preparation-commands';

export default class AfterGameRoom extends Room {
  dispatcher: Dispatcher<this>;
  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
  }

  onCreate(options: any) {
    console.log(`create after game`);
    this.setState(new AfterGameState());
    this.maxClients = 8;
    // console.log('before', this.state.players);
    if (options.players) {
      options.players.forEach((plyr: SimplePlayer) => {
        const player = new SimplePlayer(plyr.id, plyr.name, plyr.avatar, plyr.rank, plyr.pokemons, plyr.exp);
        this.state.players.set(player.id, player);
      });
    }
    // console.log('after', this.state.players);
    this.onMessage('messages', (client, message) => {
      this.dispatcher.dispatch(new OnMessageCommand(), {client, message});
    });
  }

  async onAuth(client: Client, options: any, request: any) {
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client: Client, options: any, auth: any) {
    console.log(`${client.auth.email} join after game`);
    if (options.players) {
      this.state.players.forEach((value: SimplePlayer, key: string)=> {
        this.state.players.delete(key);
      });

      options.players.forEach((plyr: SimplePlayer) => {
        const player = new SimplePlayer(plyr.id, plyr.name, plyr.avatar, plyr.rank, plyr.pokemons, plyr.exp);
        const pokemons = [];
        player.pokemons.forEach((pkm) =>{
          pokemons.push(pkm);
        });
        this.state.players.set(player.id, player);
      });
    }
    this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
  }

  async onLeave(client: Client, consented: boolean) {
    try {
      if (consented) {
        throw new Error('consented leave');
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 60);
    } catch (e) {
      this.state.users.delete(client.auth.uid);
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} leave after game room`);
        this.dispatcher.dispatch(new OnLeaveCommand(), {client, consented});
      }
    }
  }

  onDispose() {
    console.log(`dispose after game`);
    this.dispatcher.stop();
  }
}

module.exports = AfterGameRoom;
