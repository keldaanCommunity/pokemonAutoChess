require('dotenv').config();
const Mongoose = require('mongoose');
const Bot = require('../app/models/mongo-models/bot');

let data = `{
  "avatar": "cresselia",
  "elo": 1000,
  "author": "D L",
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
          "name": "weedle",
          "x": 4,
          "y": 1
        },
        {
          "items": [],
          "name": "caterpie",
          "x": 3,
          "y": 1
        },
        {
          "items": [],
          "name": "eevee",
          "x": 4,
          "y": 2
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "items": [],
          "name": "bellsprout",
          "x": 5,
          "y": 3
        },
        {
          "items": [],
          "name": "eevee",
          "x": 4,
          "y": 2
        },
        {
          "items": [],
          "name": "metapod",
          "x": 5,
          "y": 2
        },
        {
          "items": [],
          "name": "kakuna",
          "x": 4,
          "y": 3
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "butterfree",
          "x": 4,
          "y": 2
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [],
          "name": "kakuna",
          "x": 4,
          "y": 3
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowpoke",
          "x": 3,
          "y": 3
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "butterfree",
          "x": 4,
          "y": 2
        },
        {
          "items": [],
          "name": "espeon",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "abra",
          "x": 3,
          "y": 3
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowpoke",
          "x": 2,
          "y": 3
        },
        {
          "items": [],
          "name": "kakuna",
          "x": 4,
          "y": 3
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "butterfree",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "abra",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowbro",
          "x": 2,
          "y": 3
        },
        {
          "name": "ralts",
          "x": 1,
          "y": 1
        }
      ],
      "roundsRequired": 1
    },
    {
      "board": [
        {
          "items": [],
          "name": "butterfree",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "abra",
          "x": 3,
          "y": 3
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowbro",
          "x": 1,
          "y": 2
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "name": "kirlia",
          "x": 5,
          "y": 1
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "items": [],
          "name": "butterfree",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "abra",
          "x": 3,
          "y": 3
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowbro",
          "x": 1,
          "y": 2
        },
        {
          "items": [],
          "name": "beldum",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "name": "cresselia",
          "x": 2,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "butterfree",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "kadabra",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowbro",
          "x": 1,
          "y": 2
        },
        {
          "items": [
            "ROCKY_HELMET"
          ],
          "name": "beldum",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        },
        {
          "items": [],
          "name": "cresselia",
          "x": 2,
          "y": 2
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "items": [],
          "name": "magnemite",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "kadabra",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowbro",
          "x": 1,
          "y": 2
        },
        {
          "items": [
            "ROCKY_HELMET"
          ],
          "name": "beldum",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "magneton",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "kadabra",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "ROCKY_HELMET"
          ],
          "name": "beldum",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowbro",
          "x": 1,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "magneton",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "kadabra",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowbro",
          "x": 1,
          "y": 2
        },
        {
          "items": [
            "ROCKY_HELMET"
          ],
          "name": "metang",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        }
      ],
      "roundsRequired": 4
    },
    {
      "board": [
        {
          "items": [],
          "name": "magneton",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "kadabra",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowking",
          "x": 1,
          "y": 2
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        },
        {
          "items": [
            "ROCKY_HELMET",
            "ASSAULT_VEST"
          ],
          "name": "metang",
          "x": 4,
          "y": 3
        },
        {
          "name": "solosis",
          "x": 4,
          "y": 1
        }
      ],
      "roundsRequired": 2
    },
    {
      "board": [
        {
          "items": [],
          "name": "magneton",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "kadabra",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowking",
          "x": 1,
          "y": 2
        },
        {
          "items": [
            "ROCKY_HELMET",
            "ASSAULT_VEST"
          ],
          "name": "metang",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        },
        {
          "items": [],
          "name": "solosis",
          "x": 4,
          "y": 1
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "magneton",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "alakazam",
          "x": 3,
          "y": 3
        },
        {
          "items": [],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowking",
          "x": 1,
          "y": 2
        },
        {
          "items": [
            "ROCKY_HELMET",
            "ASSAULT_VEST"
          ],
          "name": "metang",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "duosion",
          "x": 4,
          "y": 1
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "magnezone",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "alakazam",
          "x": 3,
          "y": 3
        },
        {
          "items": [
            "ORAN_BERRY"
          ],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowking",
          "x": 1,
          "y": 2
        },
        {
          "items": [],
          "name": "onix",
          "x": 2,
          "y": 3
        },
        {
          "items": [
            "ROCKY_HELMET",
            "ASSAULT_VEST"
          ],
          "name": "metang",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "duosion",
          "x": 4,
          "y": 1
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 5,
          "y": 2
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "magnezone",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "alakazam",
          "x": 3,
          "y": 3
        },
        {
          "items": [
            "ORAN_BERRY"
          ],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowking",
          "x": 1,
          "y": 2
        },
        {
          "items": [],
          "name": "steelix",
          "x": 2,
          "y": 3
        },
        {
          "items": [
            "ROCKY_HELMET",
            "ASSAULT_VEST"
          ],
          "name": "metang",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "duosion",
          "x": 4,
          "y": 1
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 2,
          "y": 1
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "magnezone",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "alakazam",
          "x": 3,
          "y": 3
        },
        {
          "items": [
            "ORAN_BERRY"
          ],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowking",
          "x": 1,
          "y": 2
        },
        {
          "items": [],
          "name": "steelix",
          "x": 2,
          "y": 3
        },
        {
          "items": [
            "ROCKY_HELMET",
            "ASSAULT_VEST"
          ],
          "name": "metagross",
          "x": 4,
          "y": 3
        },
        {
          "items": [],
          "name": "duosion",
          "x": 4,
          "y": 1
        },
        {
          "items": [],
          "name": "kirlia",
          "x": 2,
          "y": 1
        },
        {
          "items": [],
          "name": "jirachi",
          "x": 1,
          "y": 1
        }
      ],
      "roundsRequired": 3
    },
    {
      "board": [
        {
          "items": [],
          "name": "magnezone",
          "x": 4,
          "y": 2
        },
        {
          "items": [
            "METRONOME"
          ],
          "name": "alakazam",
          "x": 3,
          "y": 3
        },
        {
          "items": [
            "ORAN_BERRY"
          ],
          "name": "espeon",
          "x": 3,
          "y": 2
        },
        {
          "items": [
            "DAWN_STONE"
          ],
          "name": "cresselia",
          "x": 2,
          "y": 2
        },
        {
          "items": [
            "BIG_ROOT"
          ],
          "name": "slowking",
          "x": 1,
          "y": 2
        },
        {
          "items": [],
          "name": "steelix",
          "x": 2,
          "y": 3
        },
        {
          "items": [
            "ROCKY_HELMET",
            "ASSAULT_VEST"
          ],
          "name": "metagross",
          "x": 4,
          "y": 3
        },
        {
          "items": [
            "WONDER_BOX",
            "RAZOR_CLAW"
          ],
          "name": "jirachi",
          "x": 1,
          "y": 1
        },
        {
          "items": [],
          "name": "gardevoir",
          "x": 2,
          "y": 1
        },
        {
          "items": [],
          "name": "duosion",
          "x": 4,
          "y": 1
        }
      ],
      "roundsRequired": 3
    }
  ]
}`;

try {
    let json = JSON.parse(data);
    console.log(`connect to db ...`);
    Mongoose.connect(process.env.MONGO_URI, (err) => {
        Bot.deleteMany({'avatar':json.avatar}, (err, result)=>{
          if(err){
            console.log(err);
          }
          else{
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
    console.error("Parsing error:", e);
}