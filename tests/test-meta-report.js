require('dotenv').config();
const Mongoose = require('mongoose');
const Meta = require('../app/models/mongo-models/meta');

Mongoose.connect(process.env.MONGO_URI, (err) => {
  Meta.find({}, (err, docs)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(docs);
    }
  });
});
