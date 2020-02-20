
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class LogElement extends Schema 
{
    constructor(time, description)
    {
        super();
        this.time = time;
        this.description = description;
    }
}

schema.defineTypes(LogElement,
{
  time: "number",
  description: "string"
});

module.exports = LogElement;