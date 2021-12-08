const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {PKM, ITEMS} = require('../enum');


const pkm = new Schema(
    {
        name:{
            type: String,
            enum: Object.values(PKM),
            required: true
        },
        x:{
            type: Number,
            min: 0,
            max: 7,
            required: true
        },
        y:{
            type: Number,
            min: 0,
            max: 3,
            required: true
        },
        items:[{
            type: String,
            enum: Object.keys(ITEMS)
        }]
    }
);

const step = new Schema(
    {
        board:[pkm],
        roundsRequired:{
            type: Number,
            required: true
        }
    }
);

const bot = new Schema(
    {
      avatar: {
        type: String,
        required: true
      },
      author:{
        type: String,
        required: true
      },
      elo: {
        type: Number,
        required: true
      },
      steps:[step]
    }
);

const Bot = mongoose.model('Bot', bot);
module.exports = Bot;
