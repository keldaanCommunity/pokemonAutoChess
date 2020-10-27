const schema = require('@colyseus/schema');

class SpecialCell extends schema.Schema{
    constructor(x,y){
        super();
        this.positionX = x;
        this.positionY = y;
    }
}

schema.defineTypes(SpecialCell, {
    positionX:'uint8',
    positionY:'uint8'
  });
  
  module.exports = SpecialCell;