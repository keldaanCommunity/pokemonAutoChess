import {Schema, type} from '@colyseus/schema';

export default class LeaderboardInfo extends Schema {
  @type('string') name: string;
  @type('string') avatar: string;
  @type('uint16') rank: number;
  @type('uint16') value: number;

  constructor(name: string, avatar: string, rank: number, value: number) {
    super();
    if (!avatar) {
      this.avatar = 'rattata';
    }
    else{
      this.avatar = avatar;
    }
    this.name = name;
    this.avatar = avatar;
    this.rank = rank;
    this.value = value;
  }
}