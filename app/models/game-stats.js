const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  gameStatsSchema  =  new Schema(
    {
        time: {
            type: Number
        }
    }
);

let  GameStats  =  mongoose.model("GameStats", gameStatsSchema);
module.exports  =  GameStats;
