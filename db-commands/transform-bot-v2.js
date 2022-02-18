require('dotenv').config();
const Mongoose = require('mongoose');
const BotV2 = require('../app/models/mongo-models/bot-v2');
const Bot = require('../app/models/mongo-models/bot');
const I = require('../app/models/enum').ITEM;

const conversion = {
  WHITE_GLASSES: I.CHOICE_SPECS,
  MUSCLE_BAND: I.FIRE_GEM,
  LIFE_ORB: I.REAPER_CLOTH,
  COIN_AMULET: I.FLUFFY_TAIL,
  ROCKY_HELMET: I.ROCKY_HELMET,
  SHELL_BELL: I.SHELL_BELL,
  BIG_ROOT: I.LEFTOVERS,
  APRICOT_BERRY: I.ORAN_BERRY,
  LIECHI_BERRY: I.ORAN_BERRY,
  GANLON_BERRY: I.ORAN_BERRY,
  PETAYA_BERRY: I.ORAN_BERRY,
  SALAC_BERRY: I.ORAN_BERRY,
  ORAN_BERRY: I.ORAN_BERRY,
  SOFT_SAND: I.BRIGHT_POWDER,
  MOON_STONE: I.MOON_STONE,
  NIGHT_STONE: I.DUSK_STONE,
  POISON_BARB: I.KINGS_ROCK,
  DRAGON_FANG: I.FOCUS_BAND,
  THUNDER_STONE: I.THUNDER_STONE,
  METAL_SKIN: I.SMOKE_BALL,
  METRONOME: I.UPGRADE,
  WATER_STONE: I.WATER_STONE,
  FIRE_STONE: I.FIRE_STONE,
  LEAF_STONE: I.LEAF_STONE,
  BLACK_BELT: I.ZOOM_LENS,
  SILK_SCARF: I.POKE_DOLL,
  DAWN_STONE: I.DAWN_STONE,
  ICY_ROCK: I.ICY_ROCK,
  RAZOR_FANG: I.RAZOR_FANG,
  RAZOR_CLAW: I.RAZOR_CLAW,
  SCOPE_LENS: I.WIDE_LENS,
  REVIVER_SEED: I.MAX_REVIVE,
  ASSAULT_VEST: I.ASSAULT_VEST,
  BLUE_ORB: I.BLUE_ORB,
  RED_ORB: I.RED_ORB,
  DELTA_ORB: I.DELTA_ORB,
  WONDER_BOX: I.WONDER_BOX,
  ARMOR_FOSSIL: I.FOSSIL_STONE,
  CLAW_FOSSIL: I.FOSSIL_STONE,
  COVER_FOSSIL: I.FOSSIL_STONE,
  DOME_FOSSIL: I.FOSSIL_STONE,
  HELIX_FOSSIL: I.FOSSIL_STONE,
  JAW_FOSSIL: I.FOSSIL_STONE,
  OLD_AMBER: I.OLD_AMBER,
  PLUME_FOSSIL: I.FOSSIL_STONE,
  ROOT_FOSSIL: I.FOSSIL_STONE,
  SAIL_FOSSIL: I.FOSSIL_STONE,
  SKULL_FOSSIL: I.FOSSIL_STONE
};


Mongoose.connect(process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
      Bot.find({}, ['avatar', 'author', 'elo', 'steps'], {}, (err, bots)=>{
        bots.forEach((bot)=>{
          const newBot = {
            avatar: bot.avatar,
            author: bot.author,
            elo: bot.elo,
            steps: []
          };
          bot.steps.forEach((s)=>{
            const newStep = {
              board: [],
              roundsRequired: s.roundsRequired
            };
            s.board.forEach((p)=>{
              const newPokemon = {
                name: p.name,
                x: p.x,
                y: p.y,
                items: []
              };
              p.items.forEach((i)=>{
                newPokemon.items.push(conversion[i]);
              });
              console.log(newPokemon);
              newStep.board.push(newPokemon);
            });
            newBot.steps.push(newStep);
          });
          BotV2.create(newBot);
        });
      });
    }
);
