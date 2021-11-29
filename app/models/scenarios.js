const PKM = require('./enum').PKM;

const SCENARIOS =
{
  'WATER1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.HOPPIP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHIKORITA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CATERPIE,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.HORSEA,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MUDKIP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.PIPLUP,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.HORSEA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MUDKIP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.HORSEA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.TOTODILE,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.TOTODILE,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.POLIWAG,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWAG,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SPHEAL,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.SWAMPERT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.SWAMPERT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LUDICOLO,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.SWAMPERT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLITOED,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LUDICOLO,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      }
    ]
  },
  'FIRE1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.IGGLYBUFF,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.IGGLYBUFF,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.IGGLYBUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.AZURILL,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CLEFFA,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CYNDAQUIL,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.CHARMANDER,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGBY,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGBY,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHAMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHAMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMORTAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHAMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMORTAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MEGACAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      }
    ]
  },
  'POISON1': {
    'steps': [
      {
         "roundsRequired":0,
         "board":[
            {
               "name":"PKM.ZUBAT",
               "x":3,
               "y":2
            },
            {
               "name":"PKM.GEODUDE",
               "x":4,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":1,
         "board":[
            {
               "name":"PKM.ZUBAT",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.GEODUDE",
               "x":3,
               "y":1
            },
            {
               "name":"PKM.WEEDLE",
               "x":4,
               "y":2
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.ZUBAT",
               "x":5,
               "y":1
            },
            {
               "name":"PKM.WEEDLE",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.NIDORANF",
               "x":4,
               "y":3
            },
            {
               "name":"PKM.NIDORANM",
               "x":5,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":2,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.WEEDLE",
               "x":5,
               "y":3
            },
            {
               "name":"PKM.NIDORANF",
               "x":4,
               "y":3
            },
            {
               "name":"PKM.NIDORANM",
               "x":3,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":2,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.WEEDLE",
               "x":5,
               "y":3
            },
            {
               "name":"PKM.NIDORANF",
               "x":4,
               "y":3
            },
            {
               "name":"PKM.NIDORANM",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.BULBASAUR",
               "x":2,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":2,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.WEEDLE",
               "x":5,
               "y":3
            },
            {
               "name":"PKM.NIDORANF",
               "x":4,
               "y":3
            },
            {
               "name":"PKM.NIDORANM",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":2,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":1,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.WEEDLE",
               "x":5,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":4,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":2,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.WEEDLE",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.GASTLY",
               "x":4,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":1,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.KAKUNA",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.GASTLY",
               "x":4,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":4,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.KAKUNA",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.GASTLY",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSKULL",
               "x":1,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":4,
         "board":[
            {
               "name":"PKM.GOLBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.KAKUNA",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.GASTLY",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":5,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.KAKUNA",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.KAKUNA",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.RALTS",
               "x":3,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":5,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.KAKUNA",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.KIRLIA",
               "x":3,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":4,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.BEEDRILL",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.IVYSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.GARDEVOIR",
               "x":3,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.BEEDRILL",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDORINA",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.VENUSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.GARDEVOIR",
               "x":3,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.BEEDRILL",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDOQUEEN",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.VENUSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.GARDEVOIR",
               "x":3,
               "y":1
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.BEEDRILL",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDOQUEEN",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDORINO",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.VENUSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.GARDEVOIR",
               "x":3,
               "y":1
            },
            {
               "name":"PKM.BAYLEEF",
               "x":5,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.BEEDRILL",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDOQUEEN",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDOKING",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.VENUSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.HAUNTER",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.GARDEVOIR",
               "x":3,
               "y":1
            },
            {
               "name":"PKM.BAYLEEF",
               "x":5,
               "y":3
            }
         ]
      },
      {
         "roundsRequired":3,
         "board":[
            {
               "name":"PKM.CROBAT",
               "x":2,
               "y":1
            },
            {
               "name":"PKM.BEEDRILL",
               "x":0,
               "y":3
            },
            {
               "name":"PKM.NIDOQUEEN",
               "x":1,
               "y":3
            },
            {
               "name":"PKM.NIDOKING",
               "x":2,
               "y":3
            },
            {
               "name":"PKM.VENUSAUR",
               "x":3,
               "y":3
            },
            {
               "name":"PKM.GENGAR",
               "x":4,
               "y":1
            },
            {
               "name":"PKM.DUSCLOPS",
               "x":1,
               "y":1
            },
            {
               "name":"PKM.GARDEVOIR",
               "x":3,
               "y":1
            },
            {
               "name":"PKM.MEGANIUM",
               "x":5,
               "y":3
            }
         ]
      }
   ]
  },
  'GROUND1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.MAREEP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.GEODUDE,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GEODUDE,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TURTWIG,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GEODUDE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.LARVITAR,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.SWAMPERT,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.SWAMPERT,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 7,
            'y': 3
          },
          {
            'name': PKM.ONIX,
            'x': 7,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.SWAMPERT,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 7,
            'y': 3
          },
          {
            'name': PKM.STEELIX,
            'x': 7,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYPERIOR,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.SWAMPERT,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 7,
            'y': 3
          },
          {
            'name': PKM.MEGASTEELIX,
            'x': 7,
            'y': 2
          }
        ]
      }
    ]
  },
  'NORMAL1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.IGGLYBUFF,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.CLEFFA,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CLEFFA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.AZURILL,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFFA,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARILL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.EEVEE,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARILL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.SYLVEON,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARILL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.SYLVEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TOGEPI,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TOGETIC,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TOGETIC,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.SLAKOTH,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGETIC,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKOTH,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGETIC,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.VIGOROTH,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.VIGOROTH,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELEKID,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.MUNCHLAX,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.SNORLAX,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.SNORLAX,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.AZUMARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.SNORLAX,
            'x': 1,
            'y': 1
          }
        ]
      }
    ]
  },
  'GRASS1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.HOPPIP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CATERPIE,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CATERPIE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.TREECKO,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.TREECKO,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIKORITA,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LOTAD,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LOMBRE,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LOMBRE,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SHIFTRY,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SHIFTRY,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SHIFTRY,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SHIFTRY,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.MEGANIUM,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SHIFTRY,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.MEGANIUM,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      }
    ]
  },
  'ELECTRIC1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CATERPIE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEMITE,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PICHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGNEMITE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PICHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEMITE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SHINX,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PICHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEMITE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SHINX,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEMITE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SHINX,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEMITE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SHINX,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELEKID,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNETON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SHINX,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELEKID,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNETON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SHINX,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELEKID,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNETON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELEKID,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.SCIZOR,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.AMPHAROS,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.PIKACHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.SCIZOR,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.AMPHAROS,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.RAICHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.SCIZOR,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.AMPHAROS,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.RAICHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.SCIZOR,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.AMPHAROS,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.RAICHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.SCIZOR,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.AMPHAROS,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.RAICHU,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.JOLTEON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MAGNEZONE,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.LUXIO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.SCIZOR,
            'x': 3,
            'y': 2
          }
        ]
      }
    ]
  },
  'MONSTER1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.SEEDOT,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CHARMANDER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TREECKO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARMANDER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TREECKO,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.RHYHORN,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CHARMELEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.RHYHORN,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CHARMELEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.RHYHORN,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CHARMELEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.RHYHORN,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CHARMELEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARMELEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.LARVITAR,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CHARMELEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.CHARMELEON,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SHELGON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.GROVYLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SHELGON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SHELGON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SHELGON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SHELGON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SHELGON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SHELGON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.VIBRAVA,
            'x': 5,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SALAMENCE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.VIBRAVA,
            'x': 5,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SALAMENCE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.VIBRAVA,
            'x': 5,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SALAMENCE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GARCHOMP,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.VIBRAVA,
            'x': 5,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CHARIZARD,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.SALAMENCE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GARCHOMP,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.FLYGON,
            'x': 5,
            'y': 2
          }
        ]
      }
    ]
  },
  'FIELD1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.MAREEP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.EEVEE,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.EEVEE,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDORANF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORANM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.EEVEE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDORANF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORANM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDORANF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORANM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDORANF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORINO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.NIDORINO,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDORINO,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.NIDORINO,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.JOLTEON,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.TYPHLOSION,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.JOLTEON,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.TYPHLOSION,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.MEGACAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.JOLTEON,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.TYPHLOSION,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.MEGACAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.JOLTEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.FLAFFY,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.TYPHLOSION,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.MEGACAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.JOLTEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AMPHAROS,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDOKING,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NIDOQUEEN,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.UMBREON,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.TYPHLOSION,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.ESPEON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.MEGACAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.WALREIN,
            'x': 0,
            'y': 2
          },
          {
            'name': PKM.JOLTEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AMPHAROS,
            'x': 2,
            'y': 2
          }
        ]
      }
    ]
  },
  'DRAGON1': {

    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.METAPOD,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.KAKUNA,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.NIDORANM,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYHORN,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.HORSEA,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BAGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRATINI,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRATINI,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GIBLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GABITE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GABITE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.LARVITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.ONIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.ONIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.STEELIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.STEELIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.STEELIX,
            'x': 2,
            'y': 2
          }
        ]
      }
    ]
  },
  'HUMAN1': {
	'steps': [
    {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAREEP,
            'x': 3,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.MACHOP,
            'x': 2,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.PICHU,
            'x': 3,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.MACHOP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.PICHU,
            'x': 3,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHOP,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.MACHOKE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ABRA,
            'x': 4,
            'y': 1
          }
        ]
      },
	  {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.PICHU,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ELEKID,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGBY,
            'x': 5,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHOP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.SHINX,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.MAGBY,
            'x': 5,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.MACHOKE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.KADABRA,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGBY,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.RIOLU,
            'x': 4,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ELECTABUZZ,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGBY,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.ABRA,
            'x': 4,
            'y': 1
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHOP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.SHINX,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.MAGMAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.MEDITITE,
            'x': 3,
            'y': 1
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.MACHOKE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGNETON,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.KADABRA,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGBY,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.LUCARIO,
            'x': 4,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.QUILAVA,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ELECTABUZZ,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGBY,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.KADABRA,
            'x': 4,
            'y': 1
          }
		  ,
		  {
            'name': PKM.SLAKOTH,
            'x': 1,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHOKE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.LUXIO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.MAGMAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.MEDICHAM,
            'x': 1,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.MACHAMP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGNETON,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGMAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.LUCARIO,
            'x': 4,
            'y': 2
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.QUILAVA,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGMAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.KADABRA,
            'x': 4,
            'y': 1
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHOKE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.LUXIO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.MAGMORTAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.MEDICHAM,
            'x': 1,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MONFERNO,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.MACHAMP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGNETON,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGMAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.LUCARIO,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.QUILAVA,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.CHARMANDER,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.MAGMAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.KADABRA,
            'x': 4,
            'y': 1
          }
		  ,
		  {
            'name': PKM.SLAKOTH,
            'x': 1,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHOKE,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.LUXIO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.MAGNEMITE,
            'x': 3,
            'y': 2
          },
		  {
            'name': PKM.MAGMORTAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.MEDICHAM,
            'x': 1,
            'y': 3
          }
		  ,
		  {
            'name': PKM.LUCARIO,
            'x': 1,
            'y': 1
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHAMP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGMAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.LUCARIO,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.MEDICHAM,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.BELDUM,
            'x': 6,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHAMP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGMORTAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.LUCARIO,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.MEDICHAM,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.METANG,
            'x': 6,
            'y': 3
          }
        ]
      },	  
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHAMP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGMORTAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.MEGALUCARIO,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.MEDICHAM,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.METANG,
            'x': 6,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHAMP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGMORTAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.MEGALUCARIO,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.MEGAMEDICHAM,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.METANG,
            'x': 6,
            'y': 3
          }
        ]
      },
	  {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BLAZIKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.MACHAMP,
            'x': 2,
            'y': 3
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 4,
            'y': 1
          },
		  {
            'name': PKM.MAGMORTAR,
            'x': 5,
            'y': 2
          },
		  {
            'name': PKM.MEGALUCARIO,
            'x': 4,
            'y': 2
          },
		  {
            'name': PKM.ELECTIVIRE,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.MEGAMEDICHAM,
            'x': 5,
            'y': 3
          },
		  {
            'name': PKM.METAGROSS,
            'x': 6,
            'y': 3
          }
        ]
      }
	]
  },
  'DARK': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.ZUBAT,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.GOLBAT,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SEEDOT,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.METAPOD,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.KAKUNA,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.GOLBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.NUZLEAF,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.KAKUNA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.GOLBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.NUZLEAF,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.KAKUNA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.GOLBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.NUZLEAF,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.DUSKULL,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
            {
              'name': PKM.KAKUNA,
              'x': 4,
              'y': 1
            },
            {
              'name': PKM.METAPOD,
              'x': 4,
              'y': 2
            },
            {
              'name': PKM.GOLBAT,
              'x': 4,
              'y': 3
            },
            {
              'name': PKM.NUZLEAF,
              'x': 3,
              'y': 2
            },
            {
              'name': PKM.DUSKULL,
              'x': 3,
              'y': 3
            },
            {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
            }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.LARVITAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.NUZLEAF,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.DUSKULL,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SPIRITOMB,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
        {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
            },
            {
            'name': PKM.PUPITAR,
            'x': 4,
            'y': 2
            },
            {
            'name': PKM.CROBAT,
            'x': 4,
            'y': 3
            },
            {
            'name': PKM.SHIFTRY,
            'x': 3,
            'y': 2
            },
            {
            'name': PKM.DUSCLOPS,
            'x': 3,
            'y': 3
            },
            {
            'name': PKM.SPIRITOMB,
            'x': 3,
            'y': 1
            },
          {
            'name': PKM.GASTLY,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
            {
                'name': PKM.BEEDRILL,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.PUPITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSCLOPS,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.HAUNTER,
                'x': 0,
                'y': 3
            }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
            {
                'name': PKM.BEEDRILL,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.PUPITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.HAUNTER,
                'x': 0,
                'y': 3
            }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
            {
                'name': PKM.BEEDRILL,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.PUPITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.HAUNTER,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.ARON,
                'x': 1,
                'y': 1
                }

        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
            {
                'name': PKM.BEEDRILL,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.PUPITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.HAUNTER,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.LAIRON,
                'x': 1,
                'y': 1
                }

        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
            {
                'name': PKM.BEEDRILL,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.PUPITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.LAIRON,
                'x': 1,
                'y': 1
                }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
            {
                'name': PKM.BEEDRILL,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.TYRANITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.LAIRON,
                'x': 1,
                'y': 1
                }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
            {
                'name': PKM.DARKRAI,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.TYRANITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.LAIRON,
                'x': 1,
                'y': 1
                }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
            {
                'name': PKM.DARKRAI,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.TYRANITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.CROBAT,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.LAIRON,
                'x': 1,
                'y': 1
                },
                {
                'name': PKM.METANG,
                'x': 2,
                'y': 2
                }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
            {
                'name': PKM.DARKRAI,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.TYRANITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.KIRLIA,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.LAIRON,
                'x': 1,
                'y': 1
                },
                {
                'name': PKM.METANG,
                'x': 2,
                'y': 2
                }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
            {
                'name': PKM.DARKRAI,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.TYRANITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.KIRLIA,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.SHIFTRY,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.AGGRON,
                'x': 1,
                'y': 1
                },
                {
                'name': PKM.METANG,
                'x': 2,
                'y': 2
                }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
            {
                'name': PKM.DARKRAI,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.TYRANITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.GARDEVOIR,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.STEELIX,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.AGGRON,
                'x': 1,
                'y': 1
                },
                {
                'name': PKM.METAGROSS,
                'x': 2,
                'y': 2
                }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
            {
                'name': PKM.DARKRAI,
                'x': 4,
                'y': 1
                },
                {
                'name': PKM.TYRANITAR,
                'x': 4,
                'y': 2
                },
                {
                'name': PKM.GARDEVOIR,
                'x': 4,
                'y': 3
                },
                {
                'name': PKM.MEGASTEELIX,
                'x': 3,
                'y': 2
                },
                {
                'name': PKM.DUSKNOIR,
                'x': 3,
                'y': 3
                },
                {
                'name': PKM.SPIRITOMB,
                'x': 3,
                'y': 1
                },
                {
                'name': PKM.GENGAR,
                'x': 0,
                'y': 3
                },
                {
                'name': PKM.AGGRON,
                'x': 1,
                'y': 1
                },
                {
                'name': PKM.METAGROSS,
                'x': 2,
                'y': 2
                }
        ]
      }
    ]
  },
  'GRASS2': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.HOPPIP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CATERPIE,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CATERPIE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.TREECKO,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.TREECKO,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIKORITA,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LOTAD,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CELEBI,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LOMBRE,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CELEBI,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LOMBRE,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.METAPOD,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CELEBI,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CELEBI,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GROVYLE,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CELEBI,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.CELEBI,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.MESPRIT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.CELEBI,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SCEPTILE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.LEAFEON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LUDICOLO,
            'x': 0,
            'y': 2
          }
        ]
      }
    ]
  },
  'GROUND2': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.MAREEP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.GEODUDE,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.MAREEP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GEODUDE,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TURTWIG,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GEODUDE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TURTWIG,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MUDKIP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GIBLE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.LARVITAR,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.GROTLE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GROUDON,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GROUDON,
            'x': 7,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GROUDON,
            'x': 7,
            'y': 3
          },
          {
            'name': PKM.ONIX,
            'x': 7,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GROUDON,
            'x': 7,
            'y': 3
          },
          {
            'name': PKM.STEELIX,
            'x': 7,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.RHYPERIOR,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.REGIROCK,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.GOLEM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORTERRA,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GABITE,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.GROUDON,
            'x': 7,
            'y': 3
          },
          {
            'name': PKM.MEGASTEELIX,
            'x': 7,
            'y': 2
          }
        ]
      }
    ]
  },
  'WATER2': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.HOPPIP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHIKORITA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CATERPIE,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.HORSEA,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MUDKIP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.PIPLUP,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.HORSEA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MUDKIP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.HORSEA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.SQUIRTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARSHTOMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.TOTODILE,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.TOTODILE,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.POLIWAG,
            'x': 5,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWAG,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SPHEAL,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WARTORTLE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.PRINPLUP,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CROCONAW,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LOMBRE,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.KYOGRE,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.LAPRAS,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLIWHIRL,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LUDICOLO,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SEADRA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BLASTOISE,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.LAPRAS,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.KYOGRE,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.POLITOED,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FERALIGATR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.LUDICOLO,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.EMPOLEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEALEO,
            'x': 0,
            'y': 2
          }
        ]
      }
    ]
  },
  'ELECTRIC2': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.IGGLYBUFF,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.CLEFFA,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CLEFFA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.AZURILL,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFFA,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARILL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.EEVEE,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARILL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.SYLVEON,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.MARILL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.SYLVEON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MARILL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TOGEPI,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TOGETIC,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PICHU,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TOGETIC,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.SLAKOTH,
            'x': 4,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.JIGGLYPUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGETIC,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKOTH,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.PIKACHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGETIC,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.VIGOROTH,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.VIGOROTH,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXIO,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELEKID,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.RAIKOU,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.RAIKOU,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.RAIKOU,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.RAIKOU,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.RAIKOU,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CLEFAIRY,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.WIGGLYTUFF,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SYLVEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.THUNDURUS,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAICHU,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.TOGEKISS,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.SLAKING,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUXRAY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.ELECTABUZZ,
            'x': 1,
            'y': 2
          },
          {
            'name': PKM.RAIKOU,
            'x': 1,
            'y': 1
          }
        ]
      }
    ]
  },
  'DRAGON2': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.METAPOD,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.KAKUNA,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.NIDORANM,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TRAPINCH,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYHORN,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.ZUBAT,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.HORSEA,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BAGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRATINI,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRATINI,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GIBLE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYDON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GABITE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GABITE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.LARVITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONAIR,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.ONIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.ONIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.STEELIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.STEELIX,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GARCHOMP,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.RAYQUAZA,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.DRAGONITE,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.STEELIX,
            'x': 2,
            'y': 2
          }
        ]
      }
    ]
  },
  'FIRE2': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.IGGLYBUFF,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.IGGLYBUFF,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.IGGLYBUFF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.AZURILL,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CLEFFA,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CYNDAQUIL,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.CHARMANDER,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.CYNDAQUIL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.CHIMCHAR,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 2,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGBY,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGBY,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 2,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARMELEON,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.NUMEL,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.INFERNAPE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.QUILAVA,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMORTAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.CAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.TYPHLOSION,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.CHARIZARD,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MOLTRES,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAREON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ENTEI,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGMORTAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MEGACAMERUPT,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 2,
            'y': 1
          }
        ]
      }
    ]
  },
  'DRAGON3': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.GOLBAT,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.METAPOD,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.KAKUNA,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.NUZLEAF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.LEAFEON,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LEAFEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.NUZLEAF,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LEAFEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.NUZLEAF,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LEAFEON,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VIBRAVA,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.NUZLEAF,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.HORSEA,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SHELGON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LAIRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.SEADRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.BELDUM,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.LAIRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SHELGON,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.ONIX,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.KINGDRA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.STEELIX,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.PUPITAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.STEELIX,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.STEELIX,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.STEELIX,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.SCIZOR,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.STEELIX,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.MEGASCIZOR,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.SALAMENCE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.KYUREM,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.LATIOS,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.FLYGON,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TYRANITAR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MEGASTEELIX,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.MEGASCIZOR,
            'x': 2,
            'y': 2
          }
        ]
      }
    ]
  },
  'ICE1': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.WEEDLE,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.CATERPIE,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.METAPOD,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.KAKUNA,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BELLSPROUT,
            'x': 5,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.HOPPIP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.BULBASAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.SKIPLOOM,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.SNOVER,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.SNOVER,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.SNOVER,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.SNOVER,
            'x': 0,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.BAYLEEF,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MEGANIUM,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.SUICUNE,
            'x': 1,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.SUICUNE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.SNORUNT,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.ABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.SUICUNE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.GLALIE,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MEGAABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.SUICUNE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.GLALIE,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.BEEDRILL,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BUTTERFREE,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.JUMPLUFF,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.VICTREEBEL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.VENUSAUR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARTICUNO,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MEGAABOMASNOW,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.SUICUNE,
            'x': 1,
            'y': 1
          },
          {
            'name': PKM.FROSLASS,
            'x': 2,
            'y': 2
          }
        ]
      }
    ]
  },
  'FIGHT1':{
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.GRAVELER,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.BELLSPROUT,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.BELLSPROUT,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.BULBASAUR,
            'x': 4,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDORANF,
            'x': 5,
            'y': 1
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.BULBASAUR,
            'x': 5,
            'y': 3
          }
        ]
      }, 
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDORANF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDORANF,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.IVYSAUR,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDORINA,
            'x': 4,
            'y': 1
          },
          {
            'name': PKM.GRAVELER,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYHORN,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.TERRAKION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 3,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDORINA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NIDORINA,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.WEEPINBELL,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYHORN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.ARON,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.GIBLE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.GRAVELER,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.GIBLE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.BELDUM,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.GIBLE,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYDON,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NUMEL,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.NUMEL,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.LAIRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.RIOLU,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.REGIGIGAS,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.REGIGIGAS,
            'x': 6,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHOKE,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.REGIGIGAS,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.MEDITITE,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.CAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHAMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.REGIGIGAS,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.MEGACAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHAMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.LUCARIO,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.REGIGIGAS,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.MEGACAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHAMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MEGALUCARIO,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.REGIGIGAS,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.MEGACAMERUPT,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.METAGROSS,
            'x': 0,
            'y': 3
          },
          {
            'name': PKM.MACHAMP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RHYPERIOR,
            'x': 1,
            'y': 3
          },
          {
            'name': PKM.TERRAKION,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.AGGRON,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.MEGALUCARIO,
            'x': 6,
            'y': 2
          },
          {
            'name': PKM.REGIGIGAS,
            'x': 6,
            'y': 3
          },
          {
            'name': PKM.MEGAMEDICHAM,
            'x': 3,
            'y': 2
          }
        ]
      }
    ]
  },
  'DEOXYS': {
    'steps': [
      {
        'roundsRequired': 0,
        'board': [
          {
            'name': PKM.CLEFFA,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.IGGLYBUFF,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CLEFFA,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.IGGLYBUFF,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.MAREEP,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CHIMCHAR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MAREEP,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CHIMCHAR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.TORCHIC,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MAREEP,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.SEEDOT,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 1,
        'board':
        [
          {
            'name': PKM.CHIMCHAR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.FLAFFY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.CYNDAQUIL,
            'x': 3,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.CHIMCHAR,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.CYNDAQUIL,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.MAGBY,
            'x': 2,
            'y': 2
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.MONFERNO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.QUILAVA,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.MAGBY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.MONFERNO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.MAGBY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BELDUM,
            'x': 1,
            'y': 3
          }
        ]
      },{
        'roundsRequired': 2,
        'board':
        [
          {
            'name': PKM.MONFERNO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MACHOP,
            'x': 4,
            'y': 3
          },
          {
            'name': PKM.RALTS,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGBY,
            'x': 2,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BELDUM,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.MONFERNO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MEDITITE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.KIRLIA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGMAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.BELDUM,
            'x': 1,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 5,
        'board':
        [
          {
            'name': PKM.MONFERNO,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MEDITITE,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.KIRLIA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGMAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.DEOXYS,
            'x': 4,
            'y': 3
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.INFERNAPE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.COMBUSKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.KIRLIA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGMAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.DEOXYS,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.ABRA,
            'x': 0,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 3,
        'board':
        [
          {
            'name': PKM.INFERNAPE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.KIRLIA,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGMAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.DEOXYS,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.KADABRA,
            'x': 0,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.INFERNAPE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.GARDEVOIR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGMAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.METANG,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.DEOXYS,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.KADABRA,
            'x': 0,
            'y': 1
          }
        ]
      },
      {
        'roundsRequired': 4,
        'board':
        [
          {
            'name': PKM.INFERNAPE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.GARDEVOIR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGMAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.METAGROSS,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.DEOXYS,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.KADABRA,
            'x': 0,
            'y': 1
          }
        ]
      },{
        'roundsRequired': 6,
        'board':
        [
          {
            'name': PKM.INFERNAPE,
            'x': 5,
            'y': 3
          },
          {
            'name': PKM.BLAZIKEN,
            'x': 2,
            'y': 3
          },
          {
            'name': PKM.MEDICHAM,
            'x': 3,
            'y': 2
          },
          {
            'name': PKM.GARDEVOIR,
            'x': 3,
            'y': 1
          },
          {
            'name': PKM.MAGMORTAR,
            'x': 4,
            'y': 2
          },
          {
            'name': PKM.COBALION,
            'x': 3,
            'y': 3
          },
          {
            'name': PKM.METAGROSS,
            'x': 1,
            'y': 3
          },
		  {
            'name': PKM.DEOXYS,
            'x': 4,
            'y': 3
          },
		  {
            'name': PKM.ALAKAZAM,
            'x': 0,
            'y': 1
          }
        ]
      }
    ]
  }
};


module.exports = SCENARIOS;
