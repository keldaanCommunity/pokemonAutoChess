const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ITEM, PKM} = require('./../enum');

const pokemon = new Schema({
  name: {
    type: String,
    enum: Object.values(PKM)
  },
  items: [
    {
      type: String,
      enum: Object.keys(ITEM)
    }
  ]
});

const statisticSchema = new Schema(
    {
      playerId: {
        type: String
      },
      elo: {
        type: Number
      },
      time: {
        type: Number
      },
      name: {
        type: String
      },
      rank: {
        type: Number
      },
      avatar: {
        type: String
      },
      pokemons: [pokemon]
    }
);

const DetailledStatistic = mongoose.model('DetailledStatistic', statisticSchema);
module.exports = DetailledStatistic;
