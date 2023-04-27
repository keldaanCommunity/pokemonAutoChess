export const logger = require("tracer").colorConsole({
    format: [
      '{{timestamp}} <{{title}}> {{message}} (in {{method}} - {{file}}:{{line}})', //default format
      {
        error:
          '{{timestamp}} <{{title}}> {{message}} (in {{method}} - {{file}}:{{line}})\Stack:\n{{stack}}' // error format
      }
    ],
    preprocess: function(data) {
        data.title = data.title.toUpperCase()
    }
})