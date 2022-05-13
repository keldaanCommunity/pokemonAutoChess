const apiDoc = {
    "openapi": "3.0.0",
    "info": {
      "title": "Pokemon Auto Chess API",
      "description": "Pokemon Auto Chess API is free. Don't abuse it. Theres also rate limits that you can't exceed.",
      "version": "0.1.0"
    },
    "servers": [
      {
        "url": "https://pokemon-auto-chess.com/v1",
        "description": "Main server"
      },
      {
        "url": "http://localhost:9000/v1",
        "description": "Local server"
      }
    ],
    "paths": {},
    "components": {
      "schemas": {
        "Pokemon": {
          "type": "object",
          "properties": {
            "name": {
              "description": "the name of the pokemon",
              "type": "string"
            },
            "avatar": {
              "description": "the avatar of the pokemon (path including emotes/shiny user configuration)",
              "type": "string"
            },
            "inventory": {
              "description": "All the items of the pokemons",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "GameHistory": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "the game id (same as you sent)"
            },
            "name": {
              "type": "string",
              "description": "the game name (Name is specified by owner of preparation room)"
            },
            "startTime": {
              "type": "number",
              "description": "the start time of the game (in UNIX Epoch)"
            },
            "endTime": {
              "type": "number",
              "description": "the end time of the game (in UNIX Epoch)"
            },
            "players": {
              "type": "array",
              "description": "All the game informations related to players",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "The player id"
                  },
                  "avatar": {
                    "type": "string",
                    "description": "The player avatar when the game was played"
                  },
                  "name": {
                    "type": "string",
                    "description": "The player name when the game was played"
                  },
                  "elo": {
                    "type": "number",
                    "description": "The elo of the player at the end of the game"
                  },
                  "rank": {
                    "type": "number",
                    "description": "The rank of the player at the end of the game"
                  },
                  "pokemons": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/Pokemon"
                    }
                  }
                }
              }
            }
          }
        },
        "Player": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "The player id"
            },
            "avatar": {
              "type": "string",
              "description": "The player avatar"
            },
            "name": {
              "type": "string",
              "description": "The player name"
            },
            "elo": {
              "type": "number",
              "description": "The player elo"
            }
          }
        }
      }
    }
}

export default apiDoc;