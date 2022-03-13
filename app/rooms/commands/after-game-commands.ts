import {Command} from '@colyseus/command';
import {GameUser} from '../../models/colyseus-models/game-user';
import UserMetadata from '../../models/mongo-models/user-metadata';

export class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    UserMetadata.findOne({'uid': auth.uid}, (err, user)=>{
      if (user) {
        this.state.users.set(client.auth.uid, new GameUser(user.uid,
            user.displayName,
            user.elo,
            user.avatar,
            false,
            false));

        this.room.broadcast('messages', {
          'name': 'Server',
          'payload': `${ user.displayName } joined.`,
          'avatar': user.avatar,
          'time': Date.now()
        });
      }
    });
  }
}

export class OnMessageCommand extends Command {
  execute({client, message}) {
    this.room.broadcast('messages', message);
  }
}

export class OnLeaveCommand extends Command {
  execute({client, consented}) {
    this.room.broadcast('messages', {
      'name': 'Server',
      'payload': `${ this.state.users.get(client.auth.uid).name } left.`,
      'avatar': 'magnemite',
      'time': Date.now()
    });
    this.state.users.delete(client.auth.uid);
  }
}