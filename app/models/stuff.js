const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Stuff extends Schema{
    constructor(){
        super();
        this.item0 = '';
        this.item1 = '';
        this.item2 = '';
        this.item3 = '';
        this.item4 = '';
        this.item5 = '';
        this.item6 = '';
        this.item7 = '';
        this.item8 = '';
        this.length = 0;
    }

    getAllItems(){
        let stuffs = [];
        if(this.item0 != ''){
            stuffs.push(this.item0);
        }
        if(this.item1 != ''){
            stuffs.push(this.item1);
        }
        if(this.item2 != ''){
            stuffs.push(this.item2);
        }
        if(this.item3 != ''){
            stuffs.push(this.item3);
        }
        if(this.item4 != ''){
            stuffs.push(this.item4);
        }
        if(this.item5 != ''){
            stuffs.push(this.item5);
        }
        if(this.item6 != ''){
            stuffs.push(this.item6);
        }
        if(this.item7 != ''){
            stuffs.push(this.item7);
        }
        if(this.item8 != ''){
            stuffs.push(this.item8);
        }
        return stuffs;
    }

    remove(itemToRemove){
        if(this.item1 == itemToRemove){
            this.item1 = '';
            this.length --;
        }
        else if(this.item2 == itemToRemove){
            this.item2 = '';
            this.length --;
        }
        else if(this.item0 == itemToRemove){
            this.item0 = '';
            this.length --;
        }
    }

    add(itemToAdd){
        let field = '';
        if(this.item0 == ''){
            this.item0 = itemToAdd;
            this.length ++;
        }
        else if(this.item1 == ''){
            this.item1 = itemToAdd;
            this.length ++;
        }
        else if(this.item2 == ''){
            this.item2 = itemToAdd;
            this.length ++;
        }
        else if(this.item3 == ''){
            this.item3 = itemToAdd;
            this.length ++;
        }
        else if(this.item4 == ''){
            this.item4 = itemToAdd;
            this.length ++;
        }
        else if(this.item5 == ''){
            this.item5 = itemToAdd;
            this.length ++;
        }
        else if(this.item6 == ''){
            this.item6 = itemToAdd;
            this.length ++;
        }
        else if(this.item7 == ''){
            this.item7 = itemToAdd;
            this.length ++;
        }
        else if(this.item8 == ''){
            this.item8 = itemToAdd;
            this.length ++;
        }
    }

}

schema.defineTypes(Stuff, {
    item0: 'string',
    item1: 'string',
    item2: 'string',
    item3: 'string',
    item4: 'string',
    item5: 'string',
    item6: 'string',
    item7: 'string',
    item8: 'string'

}); 

module.exports = Stuff;