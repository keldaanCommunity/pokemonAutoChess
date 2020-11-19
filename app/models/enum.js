const WORDS = Object.freeze({
  GAME_LOBBY:{
    'eng':'Game Lobby',
    'esp':'Lobby del juego'
  },
  HOME:{
    'eng':'Home',
    'esp':'Inicio'
  },
  CHANGE_LANGAGE:{
    'eng':'Change Langage',
    'esp':'Cambiar idioma'
  },
  AVAILABLE_ROOM_IDS:{
    'eng':'Available room ids',
    'esp':'Sala disponible'
  },
  CREATE_NEW_ROOM:{
    'eng':'Create new room',
    'esp':'Crear una nueva sala'
  },
  TYPE_HERE:{
    'eng':'Type here',
    'esp':'Escriba aquí'
  },
  SEND:{
    'eng':'Send',
    'esp':'Envía'
  },
  ROOM_ID:{
    'eng':'Room identifier',
    'esp':'Identificador de la sala'
  },
  PLAYERS_IN_ROOM:{
    'eng':'Players in room',
    'esp':'Los jugadores en la sala'
  },
  PLAYER:{
    'eng':'Player',
    'esp':'Jugador'
  },
  READY:{
    'eng':'Ready',
    'esp':'listo'
  },
  START_GAME:{
    'eng':'Start Game',
    'esp':'Empieza el juego'
  },
  QUIT_ROOM:{
    'eng':'Quit Room',
    'esp':'Salga de la sala'
  },
  ADD_BOT:{
    'eng':'Add bot',
    'esp':'Añade el bot'
  },
  REMOVE_BOT:{
   'eng':'Remove bot',
   'esp':'Quitar el bot' 
  },
  REFRESH:{
    'eng':'Refresh',
    'esp':'Actualizar'
  },
  BUY_XP:{
    'eng':'Buy exp',
    'esp':'Comprar xp'
  },
  TURN:{
    'eng':'Turn',
    'esp':'Gira'
  },
  MONEY:{
    'eng':'Money',
    'esp':'Dinero'
  },
  BASE:{
    'eng':'Base',
    'esp':'Base'
  },
  STREAK:{
    'eng':'Streak',
    'esp':'Raya'
  },
  INTEREST:{
    'eng':'Interest',
    'esp':'Interes'
  },
  WIN:{
    'eng':'Win',
    'esp':'Victoria'
  },
  CLOSE:{
    'eng':'Close',
    'esp':'Cerrar'
  },
  SAVE:{
    'eng':'Save Changes',
    'esp':'Guardar cambios'
  },
  UNLOCK:{
    'eng':'Unlock at lvl',
    'esp':'Desbloquear en el nivel'
  },
  UNLOCK_AFTER:{
    'eng':'Unlock after',
    'esp':'Desbloquear después de'
  },
  WINS_IN:{
    'eng':'wins in',
    'esp':'victorias en'
  }
});

const CLIMATE = Object.freeze({
  NEUTRAL: 'NEUTRAL',
  RAIN: 'RAIN',
  SUN: 'SUN',
  SANDSTORM: 'SANDSTORM'
});

const ITEMS = Object.freeze({
  WHITE_GLASSES: 'WHITE_GLASSES'
  , MUSCLE_BAND: 'MUSCLE_BAND'
  , LIFE_ORB: 'LIFE_ORB'
  , COIN_AMULET: 'COIN_AMULET'
  , ROCKY_HELMET: 'ROCKY_HELMET'
  , SHELL_BELL: 'SHELL_BELL'
  , BIG_ROOT: 'BIG_ROOT'
  , APRICOT_BERRY: 'APRICOT_BERRY'
  , LIECHI_BERRY: 'LIECHI_BERRY'
  , GANLON_BERRY: 'GANLON_BERRY'
  , PETAYA_BERRY: 'PETAYA_BERRY'
  , SALAC_BERRY: 'SALAC_BERRY'
  , ORAN_BERRY: 'ORAN_BERRY'
  , SOFT_SAND: 'SOFT_SAND'
  , MOON_STONE: 'MOON_STONE'
  , NIGHT_STONE: 'NIGHT_STONE'
  , POISON_BARB: 'POISON_BARB'
  , DRAGON_FANG: 'DRAGON_FANG'
  , THUNDER_STONE: 'THUNDER_STONE'
  , METAL_SKIN: 'METAL_SKIN'
  , METRONOME: 'METRONOME'
  , WATER_STONE: 'WATER_STONE'
  , FIRE_STONE: 'FIRE_STONE'
  , LEAF_STONE: 'LEAF_STONE'
  , BLACK_BELT: 'BLACK_BELT'
  , SILK_SCARF: 'SILK_SCARF'
  , DAWN_STONE:'DAWN_STONE'
});

const ITEM_NAME = Object.freeze({
  WHITE_GLASSES:{
    'eng':'White Glasses',
    'esp':'Gafas blancas'
  }
  , MUSCLE_BAND:{
    eng:'Muscle Band',
    esp:'Banda Muscular'
  } 
  , LIFE_ORB:{
    eng:'Life Orb',
    esp:'Orbe de la Vida'
  } 
  , COIN_AMULET:{
    eng:'Coin Amulet',
    esp:'Amuleto de monedas'
  } 
  , ROCKY_HELMET:{
    eng:'Rocky Helmet',
    esp:'Casco rocoso'
  } 
  , SHELL_BELL:{
    eng:'Shell Bell',
    esp:'Casco Campana'
  } 
  , BIG_ROOT:{
    eng:'Big Root',
    esp:'Raíz Grande'
  } 
  , APRICOT_BERRY:{
    eng:'Apricot Berry',
    esp:'Apricot Baya'
  } 
  , LIECHI_BERRY:{
    eng:'Liechi Berry',
    esp:'Liechi Baya'
  } 
  , GANLON_BERRY:{
    eng:'Ganlon Berry',
    esp:'Ganlon Baya'
  } 
  , PETAYA_BERRY:{
    eng:'Petaya Berry',
    esp:'Petaya Baya'
  } 
  , SALAC_BERRY:{
    eng:'Salac Berry',
    esp:'Salac Baya'
  } 
  , ORAN_BERRY:{
    eng:'Oran Berry',
    esp:'Oran Baya'
  } 
  , SOFT_SAND:{
    eng:'Soft Sand',
    esp:'Arena Blanda'
  } 
  , MOON_STONE:{
    eng:'Moon Stone',
    esp:'Piedra lunar'
  } 
  , NIGHT_STONE:{
    eng:'Night Stone',
    esp:'Piedra Nocturna'
  } 
  , POISON_BARB:{
    eng:'Poison Barb',
    esp:'Barra de veneno'
  }
  , DRAGON_FANG:{
    eng:'Dragon Fang',
    esp:'Colmillo de Dragón'
  } 
  , THUNDER_STONE:{
    eng:'Thunder Stone',
    esp:'Piedra del Trueno'
  } 
  , METAL_SKIN:{
    eng:'Metal Skin',
    esp:'Piel de metal'
  } 
  , METRONOME:{
    eng:'Metronome',
    esp:'Metrónomo'
  } 
  , WATER_STONE:{
    eng:'Water Stone',
    esp:'Piedra de agua'
  } 
  , FIRE_STONE:{
    eng:'Fire Stone',
    esp:'Piedra de fuego'
  } 
  , LEAF_STONE:{
    eng:'Leaf Stone',
    esp:'Piedra de la hoja'
  } 
  , BLACK_BELT:{
    eng:'Cinturón negro',
    esp:'Black Belt'
  } 
  , SILK_SCARF:{
    eng:'Silk Scarf',
    esp:'Bufanda de Seda'
  } 
  , DAWN_STONE:{
    eng:'Dawn Stone',
    esp:'Piedra del amanecer'
  }
});


const ITEM_DESCRIPTION = Object.freeze({
  WHITE_GLASSES:
  {
    eng:'+10% special attack',
    esp:'+10% de ataque especial'
  } 
  , MUSCLE_BAND:{
    eng:'+10% attack',
    esp:'+10% de ataque'
  }  
  , LIFE_ORB:{
    eng:'+100% damage, cost 5% life for each attack',
    esp:'100% de daño, cuesta un 5% de vida por cada ataque'
  }  
  , COIN_AMULET:{
    eng:'Chance to drop between 1 and 5 gold at each round',
    esp:'Oportunidad de dejar caer entre 1 y 5 monedas de oro en cada ronda'
  }  
  , ROCKY_HELMET:{
    eng:'When user is attacked, the attacker take 12% max health damage',
    esp:'Cuando el usuario es atacado, el atacante recibe un 12% de daño máximo de salud.'
  }  
  , SHELL_BELL:{
    eng: '10% life steal on each attack',
    esp:'10% de robo de vida en cada ataque'
  } 
  , BIG_ROOT:{
    eng:'+ 5% health / attack restored',
    esp:'+ 5% de salud / atacado restaurado'
  }  
  , APRICOT_BERRY:{
    eng: '+50% spe def when below 50% health',
    esp:'+50% de defensa cuando está por debajo del 50% de salud'
  } 
  , LIECHI_BERRY:{
    eng:'+50% attack when health below 50%',
    esp:'+50% de ataque cuando la salud está por debajo del 50%'
  }  
  , GANLON_BERRY:{
    eng:'+50% def when health below 50%',
    esp:'+50% def cuando la salud está por debajo del 50%'
  }  
  , PETAYA_BERRY:{
    eng:'+50% attack special when health below 50%',
    esp:'+50% de ataque especial cuando la salud está por debajo del 50%'
  }  
  , SALAC_BERRY:{
    eng:'+50 % attack speed when health below 50%',
    esp:'+50% de velocidad de ataque cuando la salud está por debajo del 50%'
  }  
  , ORAN_BERRY:{
    eng:'Restore 25% health when below 25% health',
    esp:'Restaurar el 25% de la salud cuando está por debajo del 25% de la salud'
  }  
  , SOFT_SAND:{
    eng:'+10% atk speed. +50% damage if pokemon has type ground.',
    esp:'+10% de velocidad de la tinta. +50% de daño si el pokemon tiene el tipo de tierra.'
  }  
  , MOON_STONE:{
    eng:'+10% atk speed. +50% damage if type Fairy. Will evolve  Eevee into Sylveon.',
    esp:'+10% de velocidad. +50% de daño si es del tipo Hada. '
  }  
  , NIGHT_STONE:{
    eng:'+10% atk speed. +50% damage if type Dark. Will evolve Eevee into Umbreon.',
    esp:'10% de velocidad. +50% de daño si es del tipo Oscuridad. Convertirá a Eevee en Umbreón'
  }  
  , POISON_BARB:{
    eng:'+10% atk speed. +50% damage if type poison.',
    esp:'10% de velocidad. +50% de daño si es veneno.'
  }  
  , DRAGON_FANG:{
    eng:'+10% atk speed. +50% damage if type dragon.',
    esp:'+10% a la velocidad de la tinta. +50% de daño si es un dragón.'
  }  
  , THUNDER_STONE:{
    eng:'+10% atk speed. +50% damage if type electric. Will evolve Eevee into Jolteon.',
    esp:'+10% a velocidad de corteza". +50% de daño si es de tipo eléctrico. Evolucionará Eevee a Jolteon.'
  }  
  , METAL_SKIN:{
    eng:'+10% atk speed. +50% damage if type metal.',
    esp:'10% a la velocidad de la luz. +50% de daño si es de tipo metálico.'
  }  
  , METRONOME:{
    eng:'+5% damage each time the pokemon attack.',
    esp:'5% de daño cada vez que el pokemon ataca.'
  }  
  , WATER_STONE:{
    eng:'+10% atk speed. +50% damage if type water. Will evolve Eeve into Vaporeon.',
    esp:'+10% a la velocidad de ataque. +50% de daño si es de agua. Convertirá a Eeve en Vaporeon".'
  }  
  , FIRE_STONE:{
    eng:'+10% atk speed. +50% damage if type fire. Will evolve Eevee into Flareon',
    esp:'+10% a la velocidad de ataque. +50% de daño si se escribe "fuego". Convertirá a Eevee en Flareon'
  }  
  , LEAF_STONE:{
    eng:'+10% atk speed. +50% damage if type grass. Will evolve Eevee into Leafon ',
    esp:'+10% a la velocidad de la tinta. +50% de daño si se trata de hierba. Evolucionará Eevee en Leafon'
  }  
  , BLACK_BELT:{
    eng:'+10% atk speed. +50% damage if type fighting.',
    esp:'+10% a la velocidad de la tinta. +50% de daño si el tipo es luchador.'
  }  
  , SILK_SCARF:{
    eng:'+10% atk speed. +50% damage if type normal.',
    esp:'+10% de velocidad de corte. +50% de daño si el tipo es normal.'
  }  
  , DAWN_STONE:{
    eng:'+10% atk speed. +50% damage if type psychic. Will evolve Eevee into Espeon.',
    esp:'+10% de velocidad de corte. +50% de daño si es del tipo psíquico. Evolucionará Eevee a Espeon.'
  }  
});

const EFFECTS = Object.freeze({
  INGRAIN: 'INGRAIN',
  GROWTH: 'GROWTH',
  SPORE: 'SPORE',
  BLAZE: 'BLAZE',
  DROUGHT: 'DROUGHT',
  DRIZZLE: 'DRIZZLE',
  RAIN_DANCE: 'RAIN_DANCE',
  PRIMORDIAL_SEA: 'PRIMORDIAL_SEA',
  STAMINA: 'STAMINA',
  STRENGTH: 'STRENGTH',
  PURE_POWER: 'PURE_POWER',
  AGILITY: 'AGILITY',
  REVENGE: 'REVENGE',
  PUNISHMENT: 'PUNISHMENT',
  PSYWAVE: 'PSYWAVE',
  MAGIC_ROOM: 'MAGIC_ROOM',
  MEAN_LOOK: 'MEAN_LOOK',
  SCARY_FACE: 'SCARY_FACE',
  IRON_DEFENSE: 'IRON_DEFENSE',
  AUTOTOMIZE: 'AUTOTOMIZE',
  SPIKES: 'SPIKES',
  STEALTH_ROCK: 'STEALTH_ROCK',
  SANDSTORM: 'SANDSTORM',
  POISON_GAS: 'POISON_GAS',
  TOXIC: 'TOXIC',
  INTIMIDATE: 'INTIMIDATE',
  DRAGON_DANCE: 'DRAGON_DANCE',
  WORK_UP: 'WORK_UP',
  RAGE: 'RAGE',
  ANGER_POINT: 'ANGER_POINT',
  PURSUIT: 'PURSUIT',
  BRUTAL_SWING: 'BRUTAL_SWING',
  POWER_TRIP: 'POWER_TRIP',
  MEDITATE: 'MEDITATE',
  FOCUS_ENERGY: 'FOCUS_ENERGY',
  CALM_MIND: 'CALM_MIND',
  SWARM: 'SWARM',
  STICKY_WEB: 'STICKY_WEB',
  SWIFT_SWIM: 'SWIFT_SWIM',
  HYDO_CANNON: 'HYDRO_CANNON',
  RAZOR_WIND: 'RAZOR_WIND',
  HURRICANE: 'HURRICANE',
  RAIN_DISH: 'RAIN_DISH',
  FLOWER_SHIELD: 'FLOWER_SHIELD',
  BATTLE_ARMOR: 'BATTLE_ARMOR',
  MOUTAIN_RESISTANCE:'MOUTAIN_RESISTANCE',
  PHANTOM_FORCE: 'PHANTOM_FORCE',
  ATTRACT: 'ATTRACT',
  BABY_DOLL_EYES: 'BABY_DOLL_EYES',
  ROCK:'ROCK',
  GRASS:'GRASS',
  FIRE:'FIRE',
  WATER:'WATER',
  NORMAL:'NORMAL',
  ICE:'ICE'
});

const SPECIAL_SKILL = Object.freeze({
  DEFAULT:'DEFAULT',
  FIRE_BLAST:'FIRE_BLAST',
  WHEEL_OF_FIRE:'WHEEL_OF_FIRE',
  SEISMIC_TOSS:'SEISMIC_TOSS',
  GUILLOTINE:'GUILLOTINE',
  ROCK_SLIDE:'ROCK_SLIDE',
  HEAT_WAVE:'HEAT_WAVE',
  THUNDER:'THUNDER',
  HYDRO_PUMP:'HYDRO_PUMP',
  DRACO_METEOR:'DRACO_METEOR',
  BLAZE_KICK:'BLAZE_KICK',
  WISH:'WISH',
  CALM_MIND:'CALM_MIND',
  IRON_DEFENSE:'IRON_DEFENSE',
  METRONOME:'METRONOME',
  SOAK:'SOAK',
  IRON_TAIL:'IRON_TAIL',
  BLAST_BURN:'BLAST_BURN',
  CHARGE:'CHARGE',
  DISCHARGE:'DISCHARGE',
  BITE:'BITE',
  DRAGON_TAIL:'DRAGON_TAIL',
  DRAGON_BREATH:'DRAGON_BREATH',
  ICICLE_CRASH:'ICICLE_CRASH',
  ROOT:'ROOT',
  TORMENT:'TORMENT',
  STOMP:'STOMP',
  DARK_PULSE:'DARK_PULSE',
  NIGHT_SLASH:'NIGHT_SLASH',
  BUG_BUZZ:'BUG_BUZZ',
  POISON_STING:'POISON_STING',
  LEECH_LIFE:'LEECH_LIFE',
  HAPPY_HOUR:'HAPPY_HOUR',
  TELEPORT:'TELEPORT',
  NASTY_PLOT:'NASTY_PLOT',
  THIEF:'THIEF',
  STUN_SPORE:'STUN_SPORE',
  METEOR_MASH:'METEOR_MASH',
  HURRICANE:'HURRICANE'
});

const SPECIAL_SKILL_DESCRIPTION = Object.freeze({
  DEFAULT:{
    eng:'',
    esp:''
  },
  FIRE_BLAST:{
    eng:'Throw a fire blast for 30/50/100 special damage',
    esp:'Lanza una ráfaga de fuego para 30/50/100 de daño especial'
  },
  WHEEL_OF_FIRE:{
    eng:'Sends a fire wheel that makes a round trip doing 30/40/50 special damages.',
    esp:'Envía una rueda de fuego que hace un viaje de ida y vuelta haciendo 30/40/50 de daño especial.'
  },
  SEISMIC_TOSS:{
    eng:'Mono target attack that deals true damage function of how big is your team',
    esp:'Ataque de objetivo mono que inflige daño real en función de lo grande que sea tu equipo.'
  },
  GUILLOTINE:{
    eng:'Mono target attack that deals physical damage. Restores half mana if target killed',
    esp:'Ataque de objetivo mono que causa daño físico. Restaura la mitad de maná si el objetivo muere'
  },
  ROCK_SLIDE:{
    eng:'Mono target attack that deals physical damage. Doubles damage if target is type flying.',
    esp:'Ataque de objetivo mono que causa daño físico. Duplica el daño si el objetivo es de tipo volador.'
  },
  HEAT_WAVE:{
    eng:'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
    esp:'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.'
  },
  THUNDER:{
     eng:'Mono target damage that deals 30/50/70 true damage.',
    esp:'Daño de objetivo mono que inflige 30/50/70 de daño verdadero.'
  },
  HYDRO_PUMP:{
    eng:'Area of effect attack that deals 30/40/50 special damage in all ennemies in a line behind the target.',
    esp:'Ataque de área de efecto que inflige 30/40/50 de daño especial a todos los enemigos en una línea detrás del objetivo.'
  },
  DRACO_METEOR:{
    eng:'Area of effect attack that deals 10/20/40 special damages to all ennemies',
    esp:'Ataque de área de efecto que causa 10/20/40 de daño especial a todos los enemigos'
  },
  BLAZE_KICK:{
    eng:'Mono target that deals 30/60/90 physical damage.',
    esp:'Objetivo mono que causa 30/60/90 de daño físico'
  },
  WISH:{
    eng:'Restores 50 hp to 1/2/3 ally pokemon',
    esp:'Restaura 50 hp a 1/2/3 de pokemon aliado'
  },
  CALM_MIND:{
    eng:'Buff pokemon attack by 50/100/150%',
    esp:'Ataque de pokemón de la Buff en un 50/100/150%.'
  },
  IRON_DEFENSE:{
    eng:'Buff pokemon defense / special defense by 4/6/8 points',
    esp:'Defensa pokemon buff / defensa especial por 4/6/8 puntos'
  },
  METRONOME:{
    eng:'Shoot a random capacity',
    esp:'Disparar una capacidad aleatoria'
  },
  SOAK:{
    eng:'Deals 20/30/40 special damage and restores 10 mana to friendly pokemons',
    esp:'Hace 20/30/40 de daño especial y devuelve 10 de maná a los pokemons amistosos.'
  },
  IRON_TAIL:{
    eng:'Mono target damage attack that deals 20/30/40. Buff defense by 1/3/5 points.',
    esp:'Ataque de daño al objetivo mono que reparte 20/30/40. Pulveriza la defensa por 1/3/5 puntos.'
  },
  BLAST_BURN:{
    eng:'Area of effect attack that deals 50/100/150 special damages.',
    esp:'Ataque en el área de efecto que causa 50/100/150 daños especiales.'
  },
  CHARGE:{
    eng:'Buff all electric ally pokemons attack by 10/20/30 %',
    esp:'Pulir todos los pokemones aliados eléctricos atacan en un 10/20/30 %.'
  },
  DISCHARGE:{
    eng:'Area of effect attack that deals 40/60/80 special damages.',
    esp:'Ataque en el área de efecto que causa 40/60/80 daños especiales.'
  },
  BITE:{
    eng:'50% Life steal mono target physical attack that deals 30/50/70 damage.',
    esp:'50% Vida robar mono objetivo de ataque físico que inflige 30/50/70 de daño.'
  },
  DRAGON_TAIL:{
    eng:'Mono target physical attack that deals 30/40/50 damage and buff defenses by 1/2/3 points',
    esp:'El ataque físico de un monoobjetivo que inflige 30/40/50 de daño y mejora las defensas en 1/2/3 puntos'
  },
  DRAGON_BREATH:{
    eng:'Area of effect attack that deals 30/40/50 special damage in a line behind the target',
    esp:'Ataque de área de efecto que inflige 30/40/50 de daño especial en una línea detrás del objetivo'
  },
  ICICLE_CRASH:{
    eng:'Area of effect attack that deals 30/40/50 physical damage around the target',
    esp:'Ataque de área de efecto que causa 30/40/50 de daño físico alrededor del objetivo'
  },
  ROOT:{
    eng:'Heal all nearby ally pokemons by 20/30/40 hp.',
    esp:'Curar a todos los pokemons aliados cercanos con 20/30/40 hp.'
  },
  TORMENT:{
    eng:'Increase attack speed by 20/30/40 %',
    esp:'Aumenta la velocidad de ataque en un 20/30/40 %.'
  },
  STOMP:{
    eng:'Mono target physical damage (2*atk*stars)',
    esp:'Daño físico del objetivo mono (2*atk*stars)'
  },
  DARK_PULSE:{
    eng:'Life drain target attack that deals 30/50/70 special damage',
    esp:'Ataque al objetivo de drenaje de vida que causa 30/50/70 de daño especial'
  },
  NIGHT_SLASH:{
    eng:'Mono target special attack that does 40/60/80. Decreases all ennemies defense by 1 point.',
    esp:'Ataque especial de objetivo mono que hace 40/60/80. Disminuye la defensa de todos los enemigos en 1 punto.'
  },
  BUG_BUZZ:{
    eng:'Mono target true damage attack that does 20/30/40.',
    esp:'Ataque de daño verdadero de un mono objetivo que hace 20/30/40.'
  },
  POISON_STING:{
    eng:'Physical mono target damage that deals 30/40/50. Doubles damage if target is poisoned.',
    esp:'Daño físico de un solo objetivo que reparte 30/40/50. Duplica el daño si el objetivo está envenenado.'
  },
  LEECH_LIFE:{
    eng:'Area of effect life steal special damage attack 10/20/30 around the target',
    esp:'Área de efecto robo de vida daño especial ataque 10/20/30 alrededor del objetivo'
  },
  HAPPY_HOUR:{
    eng:'Buff all ally attacks by 5/10/15 points.',
    esp:'Pulir todos los ataques de los aliados por 5/10/15 puntos.'
  },
  TELEPORT:{
    eng:'Teleport the pokemon on one edge of the map',
    esp:'Teletransportar el pokemon en un borde del mapa'
  },
  NASTY_PLOT:{
    eng:'Buff pokemon attack by 5/10/20 points',
    esp:'Buff pokemon ataque por 5/10/20 puntos'
  },
  THIEF:{
    eng:'Steal ennemy target item and deals 5/10/20 physical damage',
    esp:'Roba el objeto del enemigo e inflige 5/10/20 de daño físico'
  },
  STUN_SPORE:{
    eng:'Decrease target attack speed by 50/100/200%',
    esp:'Disminuir la velocidad de ataque del objetivo en un 50/100/200%'
  },
  METEOR_MASH:{
    eng:'Area of effect around the target that deals 30/50/70 damages. Buff pokemon attack by 5 points.',
    esp:'Área de efecto alrededor del objetivo que produce 30/50/70 daños. Buff pokemon ataque por 5 puntos.'
  },
  HURRICANE:{
    eng:'Area of effect attack that deals 10/20/30 damages in a line behind the target',
    esp:'Ataque de área de efecto que causa 10/20/30 de daño en una línea detrás del objetivo'
  }
});

const TYPE_ITEM = Object.freeze({
  NORMAL: 'SILK_SCARF',
  GRASS: 'LEAF_STONE',
  FIRE: 'FIRE_STONE',
  WATER: 'WATER_STONE',
  ELECTRIC: 'THUNDER_STONE',
  FIGHTING: 'BLACK_BELT',
  PSYCHIC: 'DAWN_STONE',
  DARK: 'NIGHT_STONE',
  METAL: 'METAL_SKIN',
  GROUND: 'SOFT_SAND',
  POISON: 'POISON_BARB',
  DRAGON: 'DRAGON_FANG',
  FAIRY: 'MOON_STONE'
});

const ITEM_TYPE = Object.freeze({
  SILK_SCARF: 'SILK_SCARF',
  LEAF_STONE: 'LEAF_STONE',
  FIRE_STONE: 'FIRE_STONE',
  WATER_STONE: 'WATER_STONE',
  THUNDER_STONE: 'THUNDER_STONE',
  BLACK_BELT: 'BLACK_BELT',
  DAWN_STONE: 'DAWN_STONE',
  NIGHT_STONE: 'NIGHT_STONE',
  METAL_SKIN: 'METAL_SKIN',
  SOFT_SAND: 'SOFT_SAND',
  POISON_BARB: 'POISON_BARB',
  DRAGON_FANG: 'DRAGON_FANG',
  MOON_STONE: 'MOON_STONE'
});

const LAST_BATTLE_RESULT_TRADUCTION = Object.freeze({
  Win:{
    eng:'Win',
    esp:'Gana'
  },
  Defeat:{
    eng:'Defeat',
    esp:'Derrota'
  },
  Draw:{
    eng:'Draw',
    esp:'Empate'
  }
});

const PHASE_TRADUCTION = Object.freeze({
  PICK:{
    eng:'Pick',
    esp:'Escoge'
  },
  FIGHT:{
    eng:'Fight',
    esp:'Luchar'
  }
});

const TYPE_TRADUCTION = Object.freeze({
  NORMAL: {
    eng:'Normal',
    esp:'Normal'
  },
  GRASS: {
    eng:'Grass',
    esp:'Hierba'
  },
  FIRE: {
    eng:'Fire',
    esp:'Fuego'
  },
  WATER: {
    eng:'Water',
    esp:'Agua'
  },
  ELECTRIC: {
    eng:'Electric',
    esp:'Electrico'
  },
  FIGHTING: {
    eng:'Fighting',
    esp:'Luchando'
  },
  PSYCHIC: {
    eng:'Psychic',
    esp:'Psiquico'
  },
  DARK: {
    eng:'Dark',
    esp:'Oscuro'
  },
  METAL: {
    eng:'Metal',
    esp:'Metal'
  },
  GROUND: {
    eng:'Ground',
    esp:'Tierra'
  },
  POISON: {
    eng:'Poison',
    esp:'Veneno'
  },
  DRAGON: {
    eng:'Dragon',
    esp:'Dragón'
  },
  FIELD: {
    eng:'Field',
    esp:'Campo'
  },
  MONSTER: {
    eng:'Monster',
    esp:'Monstruo'
  },
  HUMAN: {
    eng:'Human',
    esp:'Humano'
  },
  AQUATIC: {
    eng:'Aquatic',
    esp:'Acuático'
  },
  BUG: {
    eng:'Bug',
    esp:'Insecto'
  },
  FLYING: {
    eng:'Flying',
    esp:'Volando'
  },
  FLORA: {
    eng:'Flora',
    esp:'Flor'
  },
  MINERAL: {
    eng:'Mineral',
    esp:'Mineral'
  },
  AMORPH: {
    eng:'Amorph',
    esp:'Fantasma'
  },
  FAIRY: {
    eng:'Fairy',
    esp:'Feria'
  }
});

const TYPE = Object.freeze({
  NORMAL: 'NORMAL',
  GRASS: 'GRASS',
  FIRE: 'FIRE',
  WATER: 'WATER',
  ELECTRIC: 'ELECTRIC',
  FIGHTING: 'FIGHTING',
  PSYCHIC: 'PSYCHIC',
  DARK: 'DARK',
  METAL: 'METAL',
  GROUND: 'GROUND',
  POISON: 'POISON',
  DRAGON: 'DRAGON',
  FIELD: 'FIELD',
  MONSTER: 'MONSTER',
  HUMAN: 'HUMAN',
  AQUATIC: 'AQUATIC',
  BUG: 'BUG',
  FLYING: 'FLYING',
  FLORA: 'FLORA',
  MINERAL: 'MINERAL',
  AMORPH: 'AMORPH',
  FAIRY: 'FAIRY'
});

const RARITY = Object.freeze({
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  NEUTRAL: 'NEUTRAL'
});

const RARITY_HP_COST= Object.freeze({
  COMMON: 1,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 2,
  LEGENDARY: 3,
  NEUTRAL: 3
});

const COST = Object.freeze({
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5
});

const BOT_AVATAR = Object.freeze({
  WATER1:'squirtle',
  FIRE1:'charmander',
  POISON1:'zubat',
  GRASS1:'bulbasaur',
  GROUND1:'geodude',
  NORMAL1:'jigglypuff',
  ELECTRIC1:'pikachu',
  MONSTER1:'larvitar',
  FIELD1:'nidoqueen',
  DRAGON1:'dratini'
});

const POKEMON_BOT = Object.freeze({
  squirtle:'WATER1',
  charmander:'FIRE1',
  zubat:'POISON1',
  bulbasaur:'GRASS1',
  geodude:'GROUND1',
  jigglypuff:'NORMAL1',
  pikachu:'ELECTRIC1',
  larvitar:'MONSTER1',
  nidoqueen:'FIELD1',
  dratini:'DRAGON1'
});

const EXP_TABLE = Object.freeze({
  1: 0,
  2: 2,
  3: 6,
  4: 10,
  5: 20,
  6: 32,
  7: 50,
  8: 70
});

const STATE = Object.freeze({
  FIGHT: 'FIGHT',
  PICK: 'PICK'
});

const STATE_TYPE = Object.freeze({
  MOVING: 'MOVING',
  ATTACKING: 'ATTACKING'
});

const ORIENTATION = Object.freeze({
  DOWNLEFT: 'DOWNLEFT',
  LEFT: 'LEFT',
  UPLEFT: 'UPLEFT',
  UP: 'UP',
  UPRIGHT: 'UPRIGHT',
  RIGHT: 'RIGHT',
  DOWNRIGHT: 'DOWNRIGHT',
  DOWN: 'DOWN'
});

const ATTACK_TYPE = Object.freeze({
  PHYSICAL: 'PHYSICAL',
  SPECIAL: 'SPECIAL',
  TRUE:'TRUE'
});

const MAP_TYPE = Object.freeze({
  WATER:'WATER',
  NORMAL:'NORMAL',
  FIRE:'FIRE',
  GRASS:'GRASS',
  ICE:'ICE',
  ROCK:'ROCK'
});

const MAP_TYPE_NAME = Object.freeze({
  WATER:'Stormy Sea',
  NORMAL:'Tiny Woods',
  FIRE:'Magma Cavern',
  GRASS:'Hidden Highland',
  ICE:'Frosty Forest',
  ROCK:'Glimmer Desert'
});

const XP_TABLE = [1000,1500,2000,2500,2500,2500,2500,2500,2500,2500,3000,3000,3000,3000,3000,3000,3000,3000,3000,3000];

const XP_PLACE = [700,500,400,300,200,150,100,100];

module.exports = {SPECIAL_SKILL_DESCRIPTION, SPECIAL_SKILL, XP_PLACE, XP_TABLE, MAP_TYPE_NAME, LAST_BATTLE_RESULT_TRADUCTION, PHASE_TRADUCTION, TYPE_TRADUCTION, WORDS, MAP_TYPE, ITEM_TYPE, TYPE_ITEM, POKEMON_BOT, BOT_AVATAR, TYPE, RARITY,RARITY_HP_COST, COST, EXP_TABLE, STATE, STATE_TYPE, ORIENTATION, EFFECTS, CLIMATE, ATTACK_TYPE, ITEMS, ITEM_NAME, ITEM_DESCRIPTION};
