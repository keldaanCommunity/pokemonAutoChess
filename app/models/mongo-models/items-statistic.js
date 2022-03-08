const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ITEM, PKM} = require('../enum');


const itemsStatistic = new Schema(
    {
      rank: {
        type: Number
      },
      count: {
        type: Number
      },
      name: {
        type: String,
        enum: Object.keys(ITEM)
      },
      pokemons: [
        {
          type: String,
          enum: Object.values(PKM)
        }
      ]
    }
);

const ItemsStatistic = mongoose.model('ItemsStatistic', itemsStatistic, 'items-statistic');
module.exports = ItemsStatistic;
