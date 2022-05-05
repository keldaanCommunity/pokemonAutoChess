import { Synergy } from "../enum/Synergy";

export const SynergyName = {
    [Synergy.NORMAL] : {
        'eng' : 'Normal',
        'esp' : 'Normal',
        'fra' : 'Normal' },
    [Synergy.GRASS] : {
        'eng' : 'Grass',
        'esp' : 'Planta',
        'fra' : 'Feuille' },
    [Synergy.FIRE] : {
        'eng' : 'Fire',
        'esp' : 'Fuego',
        'fra' : 'Feu' },
    [Synergy.WATER] : {
        'eng' : 'Water',
        'esp' : 'Agua',
        'fra' : 'Eau' },
    [Synergy.ELECTRIC] : {
        'eng' : 'Elec',
        'esp' : 'Elec',
        'fra' : 'Elec' },
    [Synergy.FIGHTING] : {
        'eng' : 'Fighting',
        'esp' : 'Lucha',
        'fra' : 'Combat' },
    [Synergy.PSYCHIC] : {
        'eng' : 'Psychic',
        'esp' : 'Psiquico',
        'fra' : 'Psy' },
    [Synergy.DARK] : {
        'eng' : 'Dark',
        'esp' : 'Siniestro',
        'fra' : 'Ténèbres' },
    [Synergy.METAL] : {
        'eng' : 'Steel',
        'esp' : 'Acero',
        'fra' : 'Acier' },
    [Synergy.GROUND] : {
        'eng' : 'Ground',
        'esp' : 'Tierra',
        'fra' : 'Sol' },
    [Synergy.POISON] : {
        'eng' : 'Poison',
        'esp' : 'Veneno',
        'fra' : 'Poison' },
    [Synergy.DRAGON] : {
        'eng' : 'Dragon',
        'esp' : 'Dragón',
        'fra' : 'Dragon' },
    [Synergy.FIELD] : {
        'eng' : 'Field',
        'esp' : 'Campo',
        'fra' : 'Terrestre' },
    [Synergy.MONSTER] : {
        'eng' : 'Monster',
        'esp' : 'Monstruo',
        'fra' : 'Monstre' },
    [Synergy.HUMAN] : {
        'eng' : 'Human',
        'esp' : 'Humanoide',
        'fra' : 'Humain' },
    [Synergy.AQUATIC] : {
        'eng' : 'Aquatic',
        'esp' : 'Acuático',
        'fra' : 'Aquatique' },
    [Synergy.BUG] : {
        'eng' : 'Bug',
        'esp' : 'Bicho',
        'fra' : 'Insecte' },
    [Synergy.FLYING] : {
        'eng' : 'Flying',
        'esp' : 'Volador',
        'fra' : 'Vol' },
    [Synergy.FLORA] : {
        'eng' : 'Flora',
        'esp' : 'Flor',
        'fra' : 'Fleur' },
    [Synergy.MINERAL] : {
        'eng' : 'Rock',
        'esp' : 'Roca',
        'fra' : 'Minéral' },
    [Synergy.GHOST] : {
        'eng' : 'Ghost',
        'esp' : 'Fantasma',
        'fra' : 'Fantome' },
    [Synergy.FAIRY] : {
        'eng' : 'Fairy',
        'esp' : 'Hada',
        'fra' : 'Fée' },
    [Synergy.ICE] : {
        'eng' : 'Ice',
        'esp' : 'Hielo',
        'fra' : 'Glace' },
    [Synergy.FOSSIL] : {
        'eng' : 'Fossil',
        'esp' : 'Fossil',
        'fra' : 'Fossile' },
    [Synergy.SOUND] : {
        'eng' : 'Sound',
        'esp' : 'Sound',
        'fra' : 'Sound' }
}

export const SynergyDetail = Object.freeze({
    [Synergy.NORMAL]: {
      description: {
        eng: [
          {
            trigger: 3,
            title: `(3) Stamina`,
            text: `All allies adjacent to your Normal pokemon have +20 HP.`
          },
          {
            trigger: 6,
            title: `(6) Strength`,
            text: `All allies adjacent to your Normal pokemon have +40 HP.`
          },
          {
            trigger: 9,
            title: `(9) Pure power`,
            text: `All allies adjacent to your Normal pokemon have +80 HP.`
          }
        ],
        esp: [
          {
            title: `(3) Resistencia`,
            text: `+20 HP por cada pokemon que esté cerca`
          },
          {
            title: `(6) Fuerza`,
            text: `+30 HP por cada pokemon que esté cerca`
          },
          {
            title: `(9) Poder Puro`,
            text: `+50 HP por cada pokemon que esté cerca`
          }
        ],
        fra: [
          {
            title: `(3) Force`,
            text: `+20 HP pour tous les pokémons autours`
          },
          {
            title: `(6) Stockage`,
            text: `+30 HP pour tous les pokémons autours`
          },
          {
            title: `(9) Concentration`,
            text: `+50 HP pour tous les pokémons autours`
          }
        ]
      }
    },
    [Synergy.GRASS]: {
      description: {
        eng: [
          {
            trigger: 3,
            title: `(3) Ingrain`,
            text: `Grass allies restore 4 HP per second`
          },
          {
            trigger: 5,
            title: `(5) Growth`,
            text: `Grass allies restore 8 HP per second`
          },
          {
            trigger: 7,
            title: `(7) Tree of life`,
            text: `Grass allies restore 16 HP per second`
          }
        ],
        esp: [
          {
            title: `(3) Ingrediente`,
            text: `+5% HP/s para los tipos de Planta`
          },
          {
            title: `(5) Crecimiento`,
            text: `+10% HP/s para los tipos de Planta`
          },
          {
            title: `(7) Espora aturdidora`,
            text: `Los ennemigos que no son de Planta tienen un 30% ATK speed`
          }
        ],
        fra: [
          {
            title: `(3) Racine`,
            text: `+5% HP/s pour tous les alliés plante`
          },
          {
            title: `(5) Croissance`,
            text: `+10% HP/s pour tous les alliés plante`
          },
          {
            title: `(7) Para Spore`,
            text: `-30% ATK speed pour tous les ennemis`
          }
        ]
      }
    },
    [Synergy.FIRE]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Blaze`,
            text: `Your Fire pokemon gain +1 Attack after every hit and 10% chance to burn for 2s.`
          },
          {
            trigger: 4,
            title: `(4) Drought`,
            text: `Your Fire pokemon gain +2 Attack after every hit  and 20% chance to burn for 2s. (Sunlight)`
          },
          {
            trigger: 6,
            title: `(6) Desolate Land`,
            text: `Your Fire pokemon gain +3 Attack after every hit and 30% chance to burn for 2s. (Sunlight)`
          }
        ],
        esp: [
          {
            trigger: 3,
            title: `(3) Blaze`,
            text: `Fire pkm gana un 5% de dano en cada ataque`
          },
          {
            trigger: 6,
            title: `(6) Sequia`,
            text: `El so se intensifica, los pkm de fuego gana +50% ATK`
          }
        ],
        fra: [
          {
            title: `(3) Torche`,
            text: `Les pkm feu gagnent 5% d'ATK à chaque attaque`
          },
          {
            title: `(6) Zénith`,
            text: `Le soleil s'intensifie, augmentant l'ATK des pkm feu de 50%`
          }
        ]
      }
    },
    [Synergy.WATER]: {
      description: {
        eng: [
          {
            trigger: 3,
            title: `(3) Rain dance`,
            text: `Water pokemons gain 25% chance to dodge enemy attacks & spells`
          },
          {
            trigger: 6,
            title: `(6) Drizzle`,
            text: `Water pokemons gain 50% chance to dodge enemy attacks & spells`
          },
          {
            trigger: 9,
            title: `(9) Primordial sea`,
            text: `Water pokemons gain 75% chance to dodge enemy attacks & spells`
          }
        ],
        esp: [
          {
            title: `(3) Danza de la lluvia`,
            text: `Cae la lluvia, 30% de ATK para los aliados del agua`
          },
          {
            title: `(6) Crachin`,
            text: `La lluvia es cada vez más intensa, un 30% más de ATK.`
          },
          {
            title: `(9) Mar Primordial`,
            text: `Invoca a Kyogre, el rey de los océanos`
          }
        ],
        fra: [
          {
            title: `(3) Danse pluie`,
            text: `La pluie tombe, 30% d'ATK pour les alliés eau`
          },
          {
            title: `(6) Crachin`,
            text: `La pluie s'intensifie, 30% d'ATK en plus`
          },
          {
            title: `(9) Mer primordiale`,
            text: `Invoque Kyogre, le roi des océans`
          }
        ]
      }
    },
    [Synergy.ELECTRIC]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Eerie Impulse`,
            text: `Electric' Basic Attacks have a 20% chance to trigger two additional attacks against their target.`
          },
          {
            trigger: 4,
            title: `(4) Rising Voltage`,
            text: `Electric' Basic Attacks have a 40% chance to trigger two additional attacks against their target.`
          },
          {
            trigger: 6,
            title: `(6) Overdrive`,
            text: `Electric' Basic Attacks have a 60% chance to trigger two additional attacks against their target.`
          }
        ],
        esp: [
          {
            title: `(-) Agilidad`,
            text: `+10% de velocidad ATK por cada aliado eléctrico del equipo`
          }
        ],
        fra: [
          {
            title: `(-) Agilité`,
            text: `+10% ATK speed pour chaque allié elec dans l'équipe`
          }
        ]
      }
    },
    [Synergy.FIGHTING]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Revenge`,
            text: `+5 Mana per hit.`
          },
          {
            trigger: 4,
            title: `(4) Punishment`,
            text: `+15 extra Mana per hit.`
          }
        ],
        esp: [
          {
            title: `(2) Venganza`,
            text: `+5 maná/ataque para todos los pkm`
          },
          {
            title: `(4) Castigo`,
            text: `+10 maná/ataque para todos los pkm`
          }
        ],
        fra: [
          {
            title: `(2) Vengeance`,
            text: `+5 mana / attaque pour tous les pkm`
          },
          {
            title: `(4) Punition`,
            text: `+10 mana / attaque pour tous les pkm`
          }
        ]
      }
    },
    [Synergy.PSYCHIC]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Amnesia`,
            text: `All your pokemon have +5 Special Defense.`
          },
          {
            trigger: 4,
            title: `(4) Light Screen`,
            text: `All your pokemon have +10 Special Defense.`
          },
          {
            trigger: 6,
            title: `(6) Eerie Spell`,
            text: `All your pokemon have +20 Special Defense.`
          }
        ],
        esp: [
          {
            title: `(2) Amnesia`,
            text: `Ally gana +5 SPEDEF`
          },
          {
            title: `(4) Pantalla de luz`,
            text: `Ally gana +10 SPEDEF adicionales`
          },
          {
            title: `(6) Hechizo espeluznante`,
            text: `Ally gana +20 SPEDEF adicionales`
          }
        ],
        fra: [
          {
            title: `(2) Amnésie`,
            text: `Les alliés gagnent +5 SPEDEF`
          },
          {
            title: `(4) Mur lumière`,
            text: `Les alliés gagnent un additionel +10 SPEDEF`
          },
          {
            title: `(6) Sort Sinistre`,
            text: `Les alliés gagnent un additionel +20 SPEDEF`
          }
        ]
      }
    },
    [Synergy.DARK]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Hone Claws`,
            text: `Dark pokemons gains +4 damage/+20 shield for each held items`
          },
          {
            trigger: 4,
            title: `(4) Assurance`,
            text: `Dark pokemons gains +7 damage/+30 shield for each held items`
          },
          {
            trigger: 6,
            title: `(6) Beat up`,
            text: `Dark pokemons gains +10 damage/+50 shield for each held items`
          }
        ],
        esp: [
          {
            trigger: 2,
            title: `(2) Hone Claws`,
            text: `Dark pokemons gains +4 attack/+20 shield for each held items`
          },
          {
            trigger: 4,
            title: `(4) Assurance`,
            text: `Dark pokemons gains +7 attack/+30 shield for each held items`
          },
          {
            trigger: 6,
            title: `(6) Beat up`,
            text: `Dark pokemons gains +10 attack/+50 shield for each held items`
          }
        ],
        fra: [
          {
            trigger: 2,
            title: `(2) Hone Claws`,
            text: `Dark pokemons gains +4 attack/+20 shield for each held items`
          },
          {
            trigger: 4,
            title: `(4) Assurance`,
            text: `Dark pokemons gains +7 attack/+30 shield for each held items`
          },
          {
            trigger: 6,
            title: `(6) Beat up`,
            text: `Dark pokemons gains +10 attack/+50 shield for each held items`
          }
        ]
      }
    },
    [Synergy.METAL]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Shift Gear`,
            text: `One of your steel gains double attack damage`
          },
          {
            trigger: 4,
            title: `(4) Lightening`,
            text: `All of your steel gains double attack damage`
          }
        ]
      }
    },
    [Synergy.GROUND]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Shore Up`,
            text: `Every three seconds all ground pokemons gains 1 defense/special defense and 1 attack bonus stats. This effect stacks up to four times`
          },
          {
            trigger: 4,
            title: `(4) Rototiller`,
            text: `Every three seconds all ground pokemons gains 2 defense/special defense and 2 attack bonus stats. This effect stacks up to four times`
          },
          {
            trigger: 6,
            title: `(6) Sandstorm`,
            text: `Every three seconds all ground pokemons gains 3 defense/special defense and 3 attack bonus stats. This effect stacks up to four times`
          }
        ],
        esp: [
          {
            title: `(2) Picotas`,
            text: `-10% de HP para los enemigos al comienzo del combate`
          },
          {
            title: `(4) Trampa de rocas`,
            text: `-10% de HP para los enemigos al comienzo del combate`
          },
          {
            title: `(6) Tormenta de arena`,
            text: `Se desata una tormenta de arena que produce un 10% de HP/s por pkm de tierra/acero/mineral`
          }
        ],
        fra: [
          {
            title: `(2) Picots`,
            text: `-10% HP pour les ennemis au début du combat`
          },
          {
            title: `(4) Piège de roc`,
            text: `-10% HP pour les ennemis au début du combat`
          },
          {
            title: `(6) Tempête de sable`,
            text: `Une tempête de sable fait rage, faisant 10% HP/s aux pkm non sol/acier/mineral`
          }
        ]
      }
    },
    [Synergy.POISON]: {
      description: {
        eng: [
          {
            trigger: 3,
            title: `(3) Toxik Gas`,
            text: `Your Poison pokemon have a 10% chance to poison the target for 2 seconds. (15% HP per second)`
          },
          {
            trigger: 6,
            title: `(6) Toxik`,
            text: `Your Poison pokemon have an extra 30% chance to poison the target for 2 seconds. (15% HP per second)`
          }
        ],
        esp: [
          {
            title: `(3) Toxik gas`,
            text: `+20% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`
          },
          {
            title: `(6) Fuerza`,
            text: `+30% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`
          }
        ],
        fra: [
          {
            title: `(3) Gaz Toxik`,
            text: `+20% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
          },
          {
            title: `(6) Toxik`,
            text: `+30% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
          }
        ]
      }
    },
    [Synergy.DRAGON]: {
      description: {
        eng: [
          {
            trigger: 3,
            title: `(3) Dragon Energy`,
            text: `Your Dragon pokemon gain +3% attack Speed after every hit.`
          },
          {
            trigger: 4,
            title: `(5) Dragon Dance`,
            text: `Your Dragon pokemon gain +6% attack Speed after every hit.`
          }
        ],
        esp: [
          {
            title: `(2) Intimidación`,
            text: `-30% ATK para el equipo enemigo`
          },
          {
            title: `(4) Fuerza`,
            text: `+5% velocidad de ataque para dragones pkm en cada ataque`
          }
        ],
        fra: [
          {
            title: `(2) Intimidation`,
            text: `-30% ATK pour l'équipe ennemie`
          },
          {
            title: `(4) Danse Draco`,
            text: `+5% vitesse d'attaque pour les pkm dragons à chaque attaque`
          }
        ]
      }
    },
    [Synergy.FIELD]: {
      description: {
        eng: [
          {
            trigger: 3,
            title: `(3) Bulk up`,
            text: `When a field pokemon dies, all other field pokemons gain 20% Attack Speed and are healed for 30% of their Maximum Health`
          },
          {
            trigger: 6,
            title: `(6) Rage`,
            text: `When a field pokemon dies, all other field pokemons gain 30% Attack Speed and are healed for 40% of their Maximum Health`
          },
          {
            trigger: 9,
            title: `(9) Sword Dance`,
            text: `When a field pokemon dies, all other field pokemons gain 50% Attack Speed and are healed for 60% of their Maximum Health`
          }
        ]
      }
    },
    [Synergy.MONSTER]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Pursuit`,
            text: `Monster pokemons shield themselves for 20% max health 4 seconds whenever they cast a spell. This shield doesn't stack.`
          },
          {
            trigger: 4,
            title: `(4) Pride`,
            text: `Monster pokemons shield themselves for 30% max health 4 seconds whenever they cast a spell. This shield doesn't stack.`
          },
          {
            trigger: 6,
            title: `(6) Berserk`,
            text: `Monster pokemons shield themselves for 40% max health 4 seconds whenever they cast a spell. This shield doesn't stack.`
          }
        ]
      }
    },
    [Synergy.HUMAN]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Meditation`,
            text: `All allies heals for 15% of the damage they deal with spells and attacks`
          },
          {
            trigger: 4,
            title: `(4) Helping Hands`,
            text: `All allies heals for 30% of the damage they deal with spells and attacks`
          },
          {
            trigger: 6,
            title: `(6) Calm Mind`,
            text: `All allies heals for 60% of the damage they deal with spells and attacks`
          }
        ]
      }
    },
    [Synergy.AQUATIC]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Swift swim`,
            text: `Revive aquatic pokemons at first death with 40% health and 30% increased damage.`
          },
          {
            trigger: 4,
            title: `(4) Hydro pump`,
            text: `Revive aquatic pokemons at first death with 80% health and 60% increased damage.`
          }
        ],
        esp: [
          {
            title: `(3) Resbalón`,
            text: `+30% de velocidad ATK por pkm de agua`
          },
          {
            title: `(6) Cañón hidráulico`,
            text: `+30% ATK para pkm acuáticos`
          }
        ],
        fra: [
          {
            title: `(3) Glissade`,
            text: `+30% ATK speed pour les pkm aquatiques`
          },
          {
            title: `(6) Hydro cannon`,
            text: `+30% ATK pour les pkm aquatiques`
          }
        ]
      }
    },
    [Synergy.BUG]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Fisrt Impression`,
            text: `At the start of combat, creates a copy of one bug pokemon`
          },
          {
            trigger: 5,
            title: `(5) Swarm`,
            text: `At the start of combat, creates a copy of all bug pokemon`
          }
        ]
      }
    },
    [Synergy.FLYING]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Tailwind`,
            text: `Give a protection effect for 1sec when the pokemon fell under 20% hp`
          },
          {
            trigger: 4,
            title: `(4) Feather Dance`,
            text: `Give a protection effect for 2sec when the pokemon fell under 40% hp`
          },
          {
            trigger: 6,
            title: `(6) Max Airstream`,
            text: `Give a protection effect for 3sec when the pokemon fell under 50% hp`
          },
          {
            trigger: 8,
            title: `(8) Max Guard`,
            text: `Give a protection effect for 4sec when the pokemon fell under 50% hp`
          }
        ],
        esp: [
          {
            trigger: 2,
            title: `(2) Tailwind`,
            text: `Give a protection effect for 1sec when the pokemon fell under 20% hp`
          },
          {
            trigger: 4,
            title: `(4) Feather Dance`,
            text: `Give a protection effect for 1sec when the pokemon fell under 40% hp`
          },
          {
            trigger: 6,
            title: `(6) Max Airstream`,
            text: `Give a protection effect for 2sec when the pokemon fell under 50% hp`
          },
          {
            trigger: 8,
            title: `(8) Max Guard`,
            text: `Add a second protection effect at 30%`
          }
        ],
        fra: [
          {
            trigger: 2,
            title: `(2) Tailwind`,
            text: `Give a protection effect for 1sec when the pokemon fell under 20% hp`
          },
          {
            trigger: 4,
            title: `(4) Feather Dance`,
            text: `Give a protection effect for 1sec when the pokemon fell under 40% hp`
          },
          {
            trigger: 6,
            title: `(6) Max Airstream`,
            text: `Give a protection effect for 2sec when the pokemon fell under 50% hp`
          },
          {
            trigger: 8,
            title: `(8) Max Guard`,
            text: `Add a second protection effect at 30%`
          }
        ]
      }
    },
    [Synergy.FLORA]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Odd Flower`,
            text: `When the first flora pokemon is dead, the odd flower will rise from its grave..`
          },
          {
            trigger: 3,
            title: `(3) Gloom Flower`,
            text: `When the first flora pokemon is dead, the gloom flower will rise from its grave..`
          },
          {
            trigger: 4,
            title: `(4) Vile Flower`,
            text: `When the first flora pokemon is dead, the vile flower will rise from its grave..`
          },
          {
            trigger: 5,
            title: `(5) Sun Flower`,
            text: `When the first flora pokemon is dead, the sun flower will rise from its grave..`
          }
        ]
      }
    },
    [Synergy.MINERAL]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Harden`,
            text: `Mineral pokemons gains 60 bonus maximum health`
          },
          {
            trigger: 4,
            title: `(4) Solid Rock`,
            text: `Mineral pokemons gains 130 bonus maximum health`
          },
          {
            trigger: 6,
            title: `(6) Diamond Storm`,
            text: `Mineral pokemons gains 240 bonus maximum health`
          }
        ]
      }
    },
    [Synergy.GHOST]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Phantom force`,
            text: `One of your ghost pokemons deals true damage and silence his target`
          },
          {
            trigger: 4,
            title: `(4) Curse`,
            text: `All of your ghost pokemons deals true damage and silence his target`
          }
        ],
        esp: [
          {
            title: `(2) Fuerza fantasma`,
            text: `Los fantasmas ganan un 15% de velocidad ATK y hacen daño verdadero`
          },
          {
            title: `(4) Maldición`,
            text: `Los ataques fantasma silencian sus objetivos`
          }
        ],
        fra: [
          {
            title: `(2) Revenant`,
            text: `Les fantômes gagnent 15% d'ATK speed et font des dégats bruts`
          },
          {
            title: `(4) Malédiction`,
            text: `Les attaques des fantomes réduisent aux silences leurs cibles`
          }
        ]
      }
    },
    [Synergy.FAIRY]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Aromatic Mist`,
            text: `Fairy pokemons shock nearby enemies for 15 special damages whenever they deal or receive a critical strike`
          },
          {
            trigger: 4,
            title: `(4) Fairy Wind`,
            text: `Fairy pokemons shock nearby enemies for 30 special damages whenever they deal or receive a critical strike`
          },
          {
            trigger: 6,
            title: `(6) Strange Steam`,
            text: `Fairy pokemons shock nearby enemies for 60 special damages whenever they deal or receive a critical strike`
          }
        ]
      }
    },
    [Synergy.ICE]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Snow alert`,
            text: `All allies have a 10% chance to freeze an enemy for 2 seconds after a hit.`
          },
          {
            trigger: 4,
            title: `(4) Sheer cold`,
            text: `All allies pokemon have a 30% chance to freeze an enemy for 2 seconds after a hit.`
          }
        ],
        esp: [
          {
            title: `(2) Alerta de nieve`,
            text: `+10% de probabilidad de congelar al enemigo durante un ataque`
          },
          {
            title: `(4) Frío Polar`,
            text: `+30% de probabilidad de congelar al enemigo durante un ataque`
          }
        ],
        fra: [
          {
            title: `(2) Alerte neige`,
            text: `+10% de chance de geler l'ennemi lors d'une attaque`
          },
          {
            title: `(4) Glaciation`,
            text: `+30% de chance de geler l'ennemi lors d'une attaque`
          }
        ]
      }
    },
    [Synergy.FOSSIL]: {
      description: {
        eng: [
          {
            trigger: 2,
            title: `(2) Ancient Power`,
            text: `+40% Crit Chance and +80% Crit Damage`
          }, {
            trigger: 4,
            title: `(4) Elder Power`,
            text: `+70% Crit Chance and +140% Crit Damage`
          }, {
            trigger: 6,
            title: `(6) Unown Gatherings`,
            text: `+100% Crit Chance and +250% Crit Damage`
          }
        ],
        esp: [
          {
            trigger: 2,
            title: `(2) Historic Power`,
            text: `+10% Crit Chance and +20% Crit Damage.`
          }, {
            trigger: 4,
            title: `(4) Ancient Power`,
            text: `+30% Crit Chance and +40% Crit Damage`
          }, {
            trigger: 6,
            title: `(6) Elder Power`,
            text: `+50% Crit Chance and +60% Crit Damage`
          }, {
            trigger: 8,
            title: `(8) Unown Gatherings`,
            text: `+80% Crit Chance and +100% Crit Damage`
          }
        ],
        fra: [
          {
            trigger: 2,
            title: `(2) Historic Power`,
            text: `+10% Crit Chance and +20% Crit Damage.`
          }, {
            trigger: 4,
            title: `(4) Ancient Power`,
            text: `+30% Crit Chance and +40% Crit Damage`
          }, {
            trigger: 6,
            title: `(6) Elder Power`,
            text: `+50% Crit Chance and +60% Crit Damage`
          }, {
            trigger: 8,
            title: `(8) Unown Gatherings`,
            text: `+80% Crit Chance and +100% Crit Damage`
          }
        ]
      }
    },
    [Synergy.SOUND]: {
      description: {
        eng: [
          {
            trigger: 3,
            title: `(3) Largo`,
            text: `+3 attack each time a sound pokemon use its ability`
          }, {
            trigger: 5,
            title: `(5) Allegro`,
            text: `+5 attack each time a sound pokemon use its ability`
          }, {
            trigger: 7,
            title: `(7) Presto`,
            text: `+7 attack each time a sound pokemon use its ability`
          }
        ]
      }
    }
  });
  