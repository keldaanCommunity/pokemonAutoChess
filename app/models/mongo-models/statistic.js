const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statisticSchema = new Schema(
    {
      playerId:{
        type: String
      },
      elo:{
        type: Number
      },
      time:{
        type: Number
      },
      name: {
        type: String
      },
      rank:{
        type: Number
      },
      avatar:{
        type: String
      },
      pokemons:[
        {
          type: String
        }
      ]
    }
);

const Statistic = mongoose.model('Statistic', statisticSchema);
module.exports = Statistic;
