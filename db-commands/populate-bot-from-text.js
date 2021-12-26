require('dotenv').config();
const Mongoose = require('mongoose');
const Bot = require('../app/models/mongo-models/bot');

const data = `{
  "avatar": "croconaw",
  "elo": 711,
  "author": "Thud",
  "steps": [
    {
      "board": [
        {
          "items": [],
          "name": "caterpie",
          "x": 3,
          "y": 2
        },
        {
          "items": [],
          "name": "weedle",
          "x": 4,
          "y": 3
        }
      ],
      "roundsRequired": 0
    },
    {
      "board": [
        {
          "items": [],
          "name": "metapod",
          "x": 3,
          "y": 1
        },
        {
          "name": "kakuna",
          "x": 3,
          "y": 3
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "items": [],
          "name": "metapod",
          "x": 5,
          "y": 1
        },
        {
          "items": [],
          "name": "kakuna",
          "x": 4,
          "y": 2
        },
        {
          "name": "totodile",
          "x": 5,
          "y": 2,
          "items": [
            "SHELL_BELL"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "totodile",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "beedrill",
          "x": 5,
          "y": 3
        },
        {
          "name": "slowpoke",
          "x": 6,
          "y": 3
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "slowpoke",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "beedrill",
          "x": 5,
          "y": 3
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "slowpoke",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "beedrill",
          "x": 5,
          "y": 3
        },
        {
          "name": "spheal",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "slowpoke",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "vibrava",
          "x": 5,
          "y": 3
        },
        {
          "name": "spheal",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dratini",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "vibrava",
          "x": 5,
          "y": 3
        },
        {
          "name": "spheal",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dratini",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "sealeo",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dratini",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "sealeo",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "lapras",
          "x": 4,
          "y": 2
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dratini",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "sealeo",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "lapras",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "butterfree",
          "x": 5,
          "y": 2
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "sealeo",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "lapras",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "horsea",
          "x": 3,
          "y": 2
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "croconaw",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "sealeo",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "lapras",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "seadra",
          "x": 3,
          "y": 2
        },
        {
          "name": "gible",
          "x": 2,
          "y": 3
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "feraligatr",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "sealeo",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "lapras",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "seadra",
          "x": 3,
          "y": 2
        },
        {
          "name": "gabite",
          "x": 2,
          "y": 3
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "feraligatr",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "sealeo",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "kyogre",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "seadra",
          "x": 3,
          "y": 2
        },
        {
          "name": "gabite",
          "x": 2,
          "y": 3
        },
        {
          "name": "lapras",
          "x": 1,
          "y": 3
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "feraligatr",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "walrein",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "kyogre",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "seadra",
          "x": 3,
          "y": 2
        },
        {
          "name": "gabite",
          "x": 2,
          "y": 3
        },
        {
          "name": "lapras",
          "x": 1,
          "y": 3,
          "items": [
            "ASSAULT_VEST"
          ]
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "feraligatr",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "walrein",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "kyogre",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "kingdra",
          "x": 3,
          "y": 2
        },
        {
          "name": "gabite",
          "x": 2,
          "y": 3
        },
        {
          "name": "lapras",
          "x": 1,
          "y": 3,
          "items": [
            "ASSAULT_VEST"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "feraligatr",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "walrein",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "kyogre",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "kingdra",
          "x": 3,
          "y": 2
        },
        {
          "name": "gabite",
          "x": 2,
          "y": 3
        },
        {
          "name": "lapras",
          "x": 1,
          "y": 3,
          "items": [
            "ASSAULT_VEST",
            "ICY_ROCK"
          ]
        },
        {
          "name": "deino",
          "x": 2,
          "y": 2
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "feraligatr",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonair",
          "x": 6,
          "y": 3
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "walrein",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "kyogre",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "kingdra",
          "x": 3,
          "y": 2
        },
        {
          "name": "garchomp",
          "x": 2,
          "y": 3
        },
        {
          "name": "lapras",
          "x": 1,
          "y": 3,
          "items": [
            "ASSAULT_VEST",
            "ICY_ROCK"
          ]
        },
        {
          "name": "zweilous",
          "x": 2,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "feraligatr",
          "x": 4,
          "y": 3,
          "items": [
            "SHELL_BELL"
          ]
        },
        {
          "name": "dragonite",
          "x": 6,
          "y": 3,
          "items": [
            "METRONOME"
          ]
        },
        {
          "name": "flygon",
          "x": 5,
          "y": 3
        },
        {
          "name": "walrein",
          "x": 3,
          "y": 3,
          "items": [
            "ICY_ROCK"
          ]
        },
        {
          "name": "kyogre",
          "x": 4,
          "y": 2,
          "items": [
            "BLUE_ORB"
          ]
        },
        {
          "name": "kingdra",
          "x": 3,
          "y": 2
        },
        {
          "name": "garchomp",
          "x": 2,
          "y": 3
        },
        {
          "name": "lapras",
          "x": 1,
          "y": 3,
          "items": [
            "ASSAULT_VEST",
            "ICY_ROCK"
          ]
        },
        {
          "name": "zweilous",
          "x": 2,
          "y": 2
        }
      ],
      "roundsRequired": 3
    }
  ]
}`;

try {
  const json = JSON.parse(data);
  console.log(`connect to db ...`);
  Mongoose.connect(process.env.MONGO_URI, (err) => {
    Bot.deleteMany({'avatar': json.avatar}, (err, result)=>{
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
      console.log(`creating bot ${json.avatar}...`);
      Bot.create({
        avatar: json.avatar,
        elo: 1000,
        author: json.author,
        steps: json.steps
      });
    });
  });
} catch (e) {
  console.error('Parsing error:', e);
}
