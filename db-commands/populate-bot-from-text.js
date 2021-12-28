require('dotenv').config();
const Mongoose = require('mongoose');
const Bot = require('../app/models/mongo-models/bot');

const data = `{
  "avatar": "tyrantrum",
  "author": "D L",
  "elo": 858,
  "steps": [
    {
      "board": [
        {
          "name": "caterpie",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "weedle",
          "x": 4,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 0
    },
    {
      "board": [
        {
          "name": "weedle",
          "x": 4,
          "y": 1,
          "items": []
        },
        {
          "name": "caterpie",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "anorith",
          "x": 4,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "kabuto",
          "x": 5,
          "y": 3,
          "items": []
        },
        {
          "name": "anorith",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "metapod",
          "x": 5,
          "y": 2,
          "items": []
        },
        {
          "name": "kakuna",
          "x": 4,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "butterfree",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrunt",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabuto",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "anorith",
          "x": 3,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "butterfree",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrunt",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabuto",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "cradily",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "anorith",
          "x": 3,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 4
    },
    {
      "board": [
        {
          "name": "butterfree",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrunt",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "cradily",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "anorith",
          "x": 3,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "butterfree",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrunt",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "omanyte",
          "x": 6,
          "y": 1,
          "items": []
        },
        {
          "name": "cradily",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "butterfree",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrunt",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "omanyte",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "lotad",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "lileep",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "butterfree",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "omanyte",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "lotad",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "lileep",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "butterfree",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omanyte",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "lombre",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "lileep",
          "x": 3,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "aerodactyl",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omanyte",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "lombre",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "lileep",
          "x": 3,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "amaura",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "tirtouga",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "lileep",
          "x": 3,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "dratini",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "tirtouga",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "aurorus",
          "x": 1,
          "y": 1,
          "items": []
        },
        {
          "name": "glalie",
          "x": 3,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "dragonair",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "armaldo",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "tirtouga",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "aurorus",
          "x": 1,
          "y": 1,
          "items": []
        },
        {
          "name": "glalie",
          "x": 3,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "dragonair",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "aurorus",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "carracosta",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "froslass",
          "x": 1,
          "y": 1,
          "items": []
        },
        {
          "name": "shieldon",
          "x": 3,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "dragonair",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "tyrantrum",
          "x": 3,
          "y": 2,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "kabutops",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "aurorus",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "carracosta",
          "x": 2,
          "y": 2,
          "items": []
        },
        {
          "name": "froslass",
          "x": 1,
          "y": 1,
          "items": []
        },
        {
          "name": "dialga",
          "x": 5,
          "y": 2,
          "items": []
        },
        {
          "name": "shieldon",
          "x": 1,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 4
    },
    {
      "board": [
        {
          "name": "carracosta",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "bastiodon",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "dragonair",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "aurorus",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "tyrantrum",
          "x": 2,
          "y": 2,
          "items": [
            "RAZOR_CLAW",
            "RAZOR_FANG"
          ]
        },
        {
          "name": "archeops",
          "x": 1,
          "y": 1,
          "items": []
        },
        {
          "name": "dialga",
          "x": 5,
          "y": 2,
          "items": []
        },
        {
          "name": "shelgon",
          "x": 5,
          "y": 3
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "aerodactyl",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "bastiodon",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "dragonair",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "aurorus",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "tyrantrum",
          "x": 2,
          "y": 2,
          "items": [
            "RAZOR_CLAW",
            "RAZOR_FANG"
          ]
        },
        {
          "name": "archeops",
          "x": 1,
          "y": 1,
          "items": []
        },
        {
          "name": "dialga",
          "x": 5,
          "y": 2,
          "items": []
        },
        {
          "name": "shelgon",
          "x": 5,
          "y": 3
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "aerodactyl",
          "x": 4,
          "y": 2,
          "items": []
        },
        {
          "name": "bastiodon",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "dragonite",
          "x": 4,
          "y": 3,
          "items": []
        },
        {
          "name": "aurorus",
          "x": 3,
          "y": 3,
          "items": [
            "BIG_ROOT"
          ]
        },
        {
          "name": "omastar",
          "x": 6,
          "y": 1,
          "items": [
            "RAZOR_FANG"
          ]
        },
        {
          "name": "tyrantrum",
          "x": 2,
          "y": 2,
          "items": [
            "RAZOR_CLAW",
            "RAZOR_FANG"
          ]
        },
        {
          "name": "archeops",
          "x": 1,
          "y": 1,
          "items": []
        },
        {
          "name": "dialga",
          "x": 5,
          "y": 2,
          "items": []
        },
        {
          "name": "salamence",
          "x": 5,
          "y": 3
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
        elo: 1200,
        author: json.author,
        steps: json.steps
      });
    });
  });
} catch (e) {
  console.error('Parsing error:', e);
}
