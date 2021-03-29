const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statisticSchema = new Schema(
    {
      time:{
        type: Number
      },
      name: {
        type: String
      },
      rank:{
        type: Number
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
