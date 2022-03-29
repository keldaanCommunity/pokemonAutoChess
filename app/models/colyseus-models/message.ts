import {Schema, type} from '@colyseus/schema';
import {IMessage} from '../../types/index';

export default class Message extends Schema implements IMessage{
  @type('string') name: string;
  @type('string') payload: string;
  @type('string') avatar: string;
  @type('uint64') time: number;

  constructor(name: string, payload: string, avatar: string, time: number) {
    super();
    this.name = name;
    this.payload = payload;
    this.avatar = avatar;
    this.time = time;
  }
}