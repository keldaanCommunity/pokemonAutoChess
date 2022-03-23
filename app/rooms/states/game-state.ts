import Player from '../../models/colyseus-models/player';
import Shop from '../../models/shop';
import Design from '../../core/design';
import BotManager from '../../core/bot-manager';
import {MAP, STATE} from '../../models/enum';
import {Schema, MapSchema, type} from '@colyseus/schema';

export default class GameState extends Schema {

  @type('string') afterGameId: string;
  @type('uint8') roundTime = 30;
  @type('string') phase = STATE.PICK;
  @type({map: Player}) players = new MapSchema<Player>();
  @type('uint8') stageLevel = 0;
  @type('string') mapName: string;
  time = 30000;
  botManager: BotManager = new BotManager();
  shop: Shop = new Shop();
  elligibleToXP: boolean;
  id: string;
  design: Design;
  tilemap: any;
  gameFinished: boolean;

  constructor() {
    super();
    const keys = Object.keys(MAP);
    this.id = keys[Math.floor(Math.random() * keys.length)];
    this.mapName = MAP[this.id].name;
    this.design = new Design(this.id, 5, 0.1);
    this.design.create().then(()=>{
      this.tilemap = this.design.exportToTiled();
    });
  }
}