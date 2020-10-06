const schema = require('@colyseus/schema');

class Dps extends schema.Schema{
    constructor(id, name){
        super();
        this.assign(
            {
                id: id,
                name: name,
                damage: 0
            }
        )
    }
    
    changeDamage(damage){
        if(this.damage != damage){
            this.damage = damage;
        }
    }
}

schema.defineTypes(Dps,{
    id:'string',
    name:'string',
    damage:'uint16'
});

module.exports = Dps;