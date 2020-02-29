const schema = require("@colyseus/schema");

class LogElement extends schema.Schema {
  constructor(time, description) {
    super();
    this.time = time;
    this.description = description;
  }
}

schema.defineTypes(LogElement, {
  time: "number",
  description: "string"
});

module.exports = LogElement;