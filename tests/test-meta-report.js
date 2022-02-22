require('dotenv').config();
const Mongoose = require('mongoose');
const DetailledStatistic = require('../app/models/mongo-models/detailled-statistic');
const fs = require('fs');

Mongoose.connect(process.env.MONGO_URI, (err) => {
  DetailledStatistic.find({}, undefined,{limit: 1000, sort: {'time': -1}}, (err, stats)=>{
    if (err) {
      console.log(err);
    } else {
      const file = fs.createWriteStream(`tests/export.json`);
      file.on('error', function(err) {
        console.log(err);
      });
      file.write(JSON.stringify(stats));
      file.end();
    }
  });
});
