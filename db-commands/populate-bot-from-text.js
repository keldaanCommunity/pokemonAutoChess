require('dotenv').config();
const Mongoose = require('mongoose');
const Bot = require('../app/models/mongo-models/bot');

const data = `{
  "avatar": "deoxys",
  "author": "D L",
  "elo": 1167,
  "steps": [
    {
      "board": [
        {
          "name": "geodude",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "mareep",
          "x": 6,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 0
    },
    {
      "board": [
        {
          "name": "geodude",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "mareep",
          "x": 6,
          "y": 2,
          "items": []
        },
        {
          "name": "shieldon",
          "x": 3,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "shieldon",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magnemite",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "geodude",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "mareep",
          "x": 6,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "shieldon",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magnemite",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "flaffy",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "geodude",
          "x": 7,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "shieldon",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magnemite",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "flaffy",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "bastiodon",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magneton",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "flaffy",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "bastiodon",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magneton",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "flaffy",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "duskull",
          "x": 5,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "bastiodon",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magneton",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "flaffy",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "dusclops",
          "x": 5,
          "y": 2,
          "items": []
        },
        {
          "name": "cubone",
          "x": 4,
          "y": 2
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "magneton",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "flaffy",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "dusclops",
          "x": 5,
          "y": 2,
          "items": []
        },
        {
          "name": "bastiodon",
          "x": 4,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "magneton",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magby",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "bastiodon",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "dusclops",
          "x": 5,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "magneton",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magby",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "honedge",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "dusclops",
          "x": 5,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "kadabra",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magby",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "doublade",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "dusclops",
          "x": 3,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "kadabra",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "riolu",
          "x": 5,
          "y": 1,
          "items": []
        },
        {
          "name": "magby",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "doublade",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "graveler",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "onix",
          "x": 3,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "onix",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "kadabra",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "magmar",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "doublade",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "meditite",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "riolu",
          "x": 5,
          "y": 1,
          "items": []
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "name": "steelix",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "kadabra",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "riolu",
          "x": 5,
          "y": 1,
          "items": []
        },
        {
          "name": "magmar",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "alolan-marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "doublade",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "meditite",
          "x": 7,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "steelix",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "kadabra",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "riolu",
          "x": 5,
          "y": 1,
          "items": []
        },
        {
          "name": "magmar",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "alolan-marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "doublade",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "meditite",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "deoxys",
          "x": 0,
          "y": 2,
          "items": []
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "name": "steelix",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "alakazam",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "lucario",
          "x": 5,
          "y": 1,
          "items": []
        },
        {
          "name": "magmar",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "alolan-marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "doublade",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "medicham",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "deoxys",
          "x": 0,
          "y": 2,
          "items": [
            "SHELL_BELL",
            "SALAC_BERRY"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "steelix",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "alakazam",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "mega-lucario",
          "x": 5,
          "y": 1,
          "items": []
        },
        {
          "name": "magmar",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "alolan-marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "doublade",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "medicham",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "deoxys",
          "x": 0,
          "y": 2,
          "items": [
            "SHELL_BELL",
            "SALAC_BERRY"
          ]
        }
      ],
      "roundsRequired": 4
    },
    {
      "board": [
        {
          "name": "mega-steelix",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "alakazam",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "mega-lucario",
          "x": 5,
          "y": 1,
          "items": []
        },
        {
          "name": "magmar",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "alolan-marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "aegislash",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "medicham",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "deoxys",
          "x": 0,
          "y": 2,
          "items": [
            "SHELL_BELL",
            "SALAC_BERRY"
          ]
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "name": "mega-steelix",
          "x": 3,
          "y": 2,
          "items": []
        },
        {
          "name": "registeel",
          "x": 5,
          "y": 2,
          "items": [
            "METAL_SKIN"
          ]
        },
        {
          "name": "alakazam",
          "x": 0,
          "y": 1,
          "items": [
            "RAZOR_CLAW"
          ]
        },
        {
          "name": "mega-lucario",
          "x": 5,
          "y": 1,
          "items": []
        },
        {
          "name": "magmortar",
          "x": 3,
          "y": 1,
          "items": []
        },
        {
          "name": "alolan-marowak",
          "x": 6,
          "y": 2,
          "items": [
            "WONDER_BOX"
          ]
        },
        {
          "name": "aegislash",
          "x": 4,
          "y": 2,
          "items": [
            "ORAN_BERRY"
          ]
        },
        {
          "name": "mega-medicham",
          "x": 7,
          "y": 2,
          "items": []
        },
        {
          "name": "deoxys",
          "x": 0,
          "y": 2,
          "items": [
            "SHELL_BELL",
            "SALAC_BERRY"
          ]
        }
      ],
      "roundsRequired": 5
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
