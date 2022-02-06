const {MAP} = require('../app/models/enum');
const Design = require('../app/core/design');
const fs = require('fs');

Object.keys(MAP).forEach((m)=>{
  const d = new Design(m, 5, 0.1);
  const file = fs.createWriteStream(`samples/${d.id}.json`);
  file.on('error', function(err) {/* error handling */});
  file.write(JSON.stringify(d.exportToTiled()));
  file.end();
});
