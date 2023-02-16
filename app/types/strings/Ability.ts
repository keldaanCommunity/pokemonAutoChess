import { Langage } from ".."
import { Ability } from "../enum/Ability"
import { Damage, Stat } from "../enum/Game"

export const AbilityName: { [key in Ability]: Langage } = {
  [Ability.SOFT_BOILED]: {
    eng: `Soft Boiled`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.EARTHQUAKE]: {
    eng: `Earthquake`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.SONG_OF_DESIRE]: {
    eng: `Song of Desire`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.CONFUSING_MIND]: {
    eng: `Confusing Mind`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.KNOWLEDGE_THIEF]: {
    eng: `Knowledge Thief`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.KING_SHIELD]: {
    eng: `King Shield`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.EXPLOSION]: {
    eng: `Explosion`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.NIGHTMARE]: {
    eng: `Nightmare`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.CLANGOROUS_SOUL]: {
    eng: `Clangorous Soul`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.BONEMERANG]: {
    eng: `Bonemerang`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.GROWL]: {
    eng: `Growl`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.RELIC_SONG]: {
    eng: `Relic Song`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.DISARMING_VOICE]: {
    eng: `Disarming Voice`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.HIGH_JUMP_KICK]: {
    eng: `High Jump Kick`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.GRASS_WHISTLE]: {
    eng: `Grass Whistle`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.TRI_ATTACK]: {
    eng: `Tri Attack`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.ECHO]: {
    eng: `Echo`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.PETAL_DANCE]: {
    eng: `Petal Dance`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.HYPER_VOICE]: {
    eng: `Hyper Voice`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.SHADOW_CLONE]: {
    eng: `Shadow Clone`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.VOLT_SWITCH]: {
    eng: `Volt Switch`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.LIQUIDATION]: {
    eng: `Liquidation`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.DEFAULT]: {
    eng: ``,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.BURN]: {
    eng: `Burn`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.POISON]: {
    eng: `Poison`,
    esp: `Veneno`,
    fra: `Poison`,
    prt: ``
  },
  [Ability.SLEEP]: {
    eng: `Sleep`,
    esp: `Duerme`,
    fra: `Dormir`,
    prt: ``
  },
  [Ability.SILENCE]: {
    eng: `Silence`,
    esp: `Silencio`,
    fra: `Silence`,
    prt: ``
  },
  [Ability.PROTECT]: {
    eng: `Protect`,
    esp: `Proteja`,
    fra: `Abri`,
    prt: ``
  },
  [Ability.FREEZE]: {
    eng: `Freeze`,
    esp: `Congelar`,
    fra: `Gelé`,
    prt: ``
  },
  [Ability.CONFUSION]: {
    eng: `Confusion`,
    esp: `Confusión`,
    fra: `Confusion`,
    prt: ``
  },
  [Ability.FIRE_BLAST]: {
    eng: `Fire Blast`,
    esp: `Ráfaga de fuego`,
    fra: `Déflagration`,
    prt: ``
  },
  [Ability.WHEEL_OF_FIRE]: {
    eng: `Flame Wheel`,
    esp: `Rueda de fuego`,
    fra: `Roue de feu`,
    prt: ``
  },
  [Ability.SEISMIC_TOSS]: {
    eng: `Seismic toss`,
    esp: `Lanzamiento sísmico`,
    fra: `Frappe Atlas`,
    prt: ``
  },
  [Ability.GUILLOTINE]: {
    eng: `Guillotine`,
    esp: `Guillotina`,
    fra: `Guillotine`,
    prt: ``
  },
  [Ability.ROCK_SLIDE]: {
    eng: `Rock Slide`,
    esp: `Deslizamiento de rocas`,
    fra: `Eboulement`,
    prt: ``
  },
  [Ability.HEAT_WAVE]: {
    eng: `Heat wave`,
    esp: `Ola de calor`,
    fra: `Canicule`,
    prt: ``
  },
  [Ability.THUNDER]: {
    eng: `Thunder`,
    esp: `Trueno`,
    fra: `Fatal-Foudre`,
    prt: ``
  },
  [Ability.HYDRO_PUMP]: {
    eng: `Hydro Cannon`,
    esp: `Hidrobomba`,
    fra: `Hydrocanon`,
    prt: ``
  },
  [Ability.DRACO_METEOR]: {
    eng: `Draco meteor`,
    esp: `Meteoro Draco`,
    fra: `Draco meteor`,
    prt: ``
  },
  [Ability.BLAZE_KICK]: {
    eng: `Blaze kick`,
    esp: `Patada de fuego`,
    fra: `Pied de feu`,
    prt: ``
  },
  [Ability.WISH]: {
    eng: `Wish`,
    esp: `Deseo`,
    fra: `Voeu`,
    prt: ``
  },
  [Ability.CALM_MIND]: {
    eng: `Calm mind`,
    esp: `Mente tranquila`,
    fra: `Plénitude`,
    prt: ``
  },
  [Ability.IRON_DEFENSE]: {
    eng: `Defense Curl`,
    esp: `Defensa del hierro`,
    fra: `Mur de fer`,
    prt: ``
  },
  [Ability.METRONOME]: {
    eng: `Metronome`,
    esp: `Métrónomo`,
    fra: `Metronome`,
    prt: ``
  },
  [Ability.SOAK]: {
    eng: `Soak`,
    esp: `Empápate`,
    fra: `Lessivage`,
    prt: ``
  },
  [Ability.ORIGIN_PULSE]: {
    eng: `Origin Pulse`,
    esp: `Fogonazo`,
    fra: `Onde Originelle`,
    prt: ``
  },
  [Ability.SEED_FLARE]: {
    eng: `Seed Flare`,
    esp: `Pulso Primigenio`,
    fra: `Fulmigraine`,
    prt: ``
  },
  [Ability.IRON_TAIL]: {
    eng: `Iron tail`,
    esp: `Cola de hierro`,
    fra: `Queue de fer`,
    prt: ``
  },
  [Ability.BLAST_BURN]: {
    eng: `Blast Burn`,
    esp: `Quemadura por ráfaga`,
    fra: `Aire de feu`,
    prt: ``
  },
  [Ability.CHARGE]: {
    eng: `Charge`,
    esp: `Carga`,
    fra: `Chargeur`,
    prt: ``
  },
  [Ability.DISCHARGE]: {
    eng: `Discharge`,
    esp: `Descarga`,
    fra: `Coud Jus`,
    prt: ``
  },
  [Ability.BITE]: {
    eng: `Bite`,
    esp: `Mordida`,
    fra: `Morsure`,
    prt: ``
  },
  [Ability.DRAGON_TAIL]: {
    eng: `Dragon Tail`,
    esp: `Cola de Dragón`,
    fra: `Draco Queue`,
    prt: ``
  },
  [Ability.DRAGON_BREATH]: {
    eng: `Dragon Breath`,
    esp: `Aliento de Dragón`,
    fra: `Draco Souffle`,
    prt: ``
  },
  [Ability.ICICLE_CRASH]: {
    eng: `Icicle Crash`,
    esp: `Choque de carámbanos`,
    fra: `Chute glace`,
    prt: ``
  },
  [Ability.ROOT]: {
    eng: `Root`,
    esp: `Raíz`,
    fra: `Racine`,
    prt: ``
  },
  [Ability.TORMENT]: {
    eng: `Torment`,
    esp: `Viaje`,
    fra: `Tourment`,
    prt: ``
  },
  [Ability.STOMP]: {
    eng: `Stomp`,
    esp: `Pisotón`,
    fra: `Ecrasement`,
    prt: ``
  },
  [Ability.DARK_PULSE]: {
    eng: `Dark Pulse`,
    esp: `Pulso oscuro`,
    fra: `Vibrobscur`,
    prt: ``
  },
  [Ability.NIGHT_SLASH]: {
    eng: `Night Slash`,
    esp: `Tajo nocturno`,
    fra: `Tranche Nuit`,
    prt: ``
  },
  [Ability.BUG_BUZZ]: {
    eng: `Bug Buzz`,
    esp: `Bichos`,
    fra: `Bourdon`,
    prt: ``
  },
  [Ability.POISON_STING]: {
    eng: `Poison Sting`,
    esp: `Picadura de veneno`,
    fra: `Dard Venin`,
    prt: ``
  },
  [Ability.LEECH_LIFE]: {
    eng: `Leech Life`,
    esp: `Vampirismo`,
    fra: `Vampirisme`,
    prt: ``
  },
  [Ability.HAPPY_HOUR]: {
    eng: `Happy hour`,
    esp: `La hora feliz`,
    fra: `Happy hour`,
    prt: ``
  },
  [Ability.TELEPORT]: {
    eng: `Teleport`,
    esp: `Teletransporte`,
    fra: `Teleport`,
    prt: ``
  },
  [Ability.NASTY_PLOT]: {
    eng: `Nasty Plot`,
    esp: `Trama desagradable`,
    fra: `Machination`,
    prt: ``
  },
  [Ability.THIEF]: {
    eng: `Thief`,
    esp: `Ladrón`,
    fra: `Larcin`,
    prt: ``
  },
  [Ability.STUN_SPORE]: {
    eng: `Stun Spore`,
    esp: `Espora de aturdimiento`,
    fra: `Poudre para`,
    prt: ``
  },
  [Ability.METEOR_MASH]: {
    eng: `Meteor mash`,
    esp: `Puré de meteoritos`,
    fra: `Poing Meteor`,
    prt: ``
  },
  [Ability.HURRICANE]: {
    eng: `Hurricane`,
    esp: `Huracán`,
    fra: `Vent Violent`,
    prt: ``
  },
  [Ability.HEAL_BLOCK]: {
    eng: `Heal Block`,
    esp: `Heal Block`,
    fra: `Heal Block`,
    prt: ``
  },
  [Ability.ROAR_OF_TIME]: {
    eng: `Roar of time`,
    esp: `Roar of time`,
    fra: `Roar of time`,
    prt: ``
  },
  [Ability.ROCK_TOMB]: {
    eng: `Rock Tomb`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.ROCK_SMASH]: {
    eng: `Rock Smash`,
    esp: `Rock Smash`,
    fra: `Rock Smash`,
    prt: ``
  },
  [Ability.HEAD_SMASH]: {
    eng: `Head Smash`,
    esp: `Head Smash`,
    fra: `Head Smash`,
    prt: ``
  },
  CORRUPTED_NATURE: {
    eng: `Corrupted Nature`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  CRABHAMMER: {
    eng: `Crabhammer`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DIAMOND_STORM: {
    eng: `Diamond Storm`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DRACO_ENERGY: {
    eng: `Draco Energy`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DYNAMAX_CANNON: {
    eng: `Dynamax Cannon`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DYNAMIC_PUNCH: {
    eng: `Dynamic Punch`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  ELECTRO_BOOST: {
    eng: `Electro Boost`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  ELECTRO_WEB: {
    eng: `Electro Web`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  FIRE_TRICK: {
    eng: `Fire Trick`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  FLAME_CHARGE: {
    eng: `Flame Charge`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  LEECH_SEED: {
    eng: `Leech Seed`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  LOCK_ON: {
    eng: `Lock On`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  PSYCH_UP: {
    eng: `Psych Up`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  RAZOR_WIND: {
    eng: `Razor Wind`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  TWISTING_NEITHER: {
    eng: `Twisting Neither`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  WONDER_GUARD: {
    eng: `Wonder Guard`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  ELECTRIC_SURGE: {
    eng: `Electric Surge`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  PSYCHIC_SURGE: {
    eng: `Psychic Surge`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  MIND_BLOWN: {
    eng: `Mind Blown`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  PAYDAY: {
    eng: `Pay Day`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  BEAT_UP: {
    eng: `Beat up`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.BLUE_FLARE]: {
    eng: `Blue Flare`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.FUSION_BOLT]: {
    eng: `Fusion Bolt`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.AURORA_VEIL]: {
    eng: `Aurora Veil`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.AQUA_JET]: {
    eng: `Aqua Jet`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.PROTEAN]: {
    eng: `Protean`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.CHATTER]: {
    eng: `Chatter`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.SYNCHRO]: {
    eng: `Synchro`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.STEAM_ERUPTION]: {
    eng: `Steam Eruption`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.APPLE_ACID]: {
    eng: `Apple Acid`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.SHADOW_BALL]: {
    eng: `Shadow Ball`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.DIVE]: {
    eng: `Dive`,
    esp: ``,
    prt: ``,
    fra: ``
  }
}

export const AbilityDescription: { [key in Ability]: Langage } = {
  [Ability.SOFT_BOILED]: {
    eng: `Cures every status effects and grants [20,40,80] ${Stat.SHIELD} for every ally`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.EARTHQUAKE]: {
    eng: `Deals damage [30,60,120] ${Damage.SPECIAL} to all ennemy units in the same column/line`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.SONG_OF_DESIRE]: {
    eng: `The target is confused for [3,6,12]s`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.CONFUSING_MIND]: {
    eng: `Deals [20,40,80] ${Damage.SPECIAL} to the target and confuse adjcacent pokemons for [1.5,3,6]s`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.KNOWLEDGE_THIEF]: {
    eng: `Launch the ultimate of the target`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.KING_SHIELD]: {
    eng: `Protect the user for [1,2,4]s and swap his position with the farthest enemy`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.EXPLOSION]: {
    eng: `Deals [50,100,200] ${Damage.SPECIAL}. Damage also the user.`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.NIGHTMARE]: {
    eng: `Poison the ennemy team for [2,4,8]s`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.CLANGOROUS_SOUL]: {
    eng: `Buff the adjacent allies with [2,4,8] ${Stat.ATK} and [1,2,4] ${Stat.DEF} / ${Stat.SPE_DEF}`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.BONEMERANG]: {
    eng: `Throw a boomerang bone through the enemy team, dealing [30,60,120] ${Damage.SPECIAL} on its way`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.GROWL]: {
    eng: `Apply wound status on the ennemy team for [3,6,9]s`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.RELIC_SONG]: {
    eng: `Put asleep the ennemy team for [1,2,4]s`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.DISARMING_VOICE]: {
    eng: `Gives [10,20,40] ${Stat.MANA} (affected by ${Stat.SPELL_POWER}) to all allies`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.HIGH_JUMP_KICK]: {
    eng: `Deals [50,100,200] ${Damage.SPECIAL} and steal ${Stat.MANA} from its target`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.GRASS_WHISTLE]: {
    eng: `Put asleep [1,2,4] ennemies for 2 seconds`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.TRI_ATTACK]: {
    eng: `Burn, freeze and wound the target for [2,4,8]s`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.ECHO]: {
    eng: `Deals [3,6,9] ${Damage.SPECIAL}, +[1,2,4] each time the pokemon uses its ability`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.PETAL_DANCE]: {
    eng: `Deals [25,50,100] ${Damage.SPECIAL} to [2,4,6] ennemies`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.HYPER_VOICE]: {
    eng: `Deals [50,100,200] special damage on a row, confuse for [1,2,3] seconds`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.SHADOW_CLONE]: {
    eng: `The pokemon creates an identical clone of himself next to his target. This clone inherits from the pokemon items and stats`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.VOLT_SWITCH]: {
    eng: `Dash into the ennemy backline, dealing [30,60,120] ${Damage.SPECIAL}`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.LIQUIDATION]: {
    eng: `Deals [20,40,80] ${Damage.SPECIAL} and remove [1,2,4] ${Stat.DEF} from the target`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.DEFAULT]: {
    eng: ``,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.BURN]: {
    eng: `Burn the whole team for [5,10,20] seconds`,
    esp: `Quemar todo el equipo durante 2,4,8 segundos, repartiendo el 5% de hp,segundos`,
    fra: `Brule la cible pour 2,4,8 secondes, lui faisant perdre 5% hp,secondes`,
    prt: ``
  },
  [Ability.POISON]: {
    eng: `Poison the target for [4,8,16] seconds`,
    esp: `Envenenar el objetivo durante 5,10,20 segundos, repartiendo 15% hp,segundos`,
    fra: `Empoisonne la cible durant 5,10,20 secondes, faisant 15% hp,secondes`,
    prt: ``
  },
  [Ability.SLEEP]: {
    eng: `Sleeps 2 back lines for [1.5,3,4.5] seconds`,
    esp: `Duerme el objetivo durante 3,5,7 segundos`,
    fra: `Endors la cible durant 3,5,7 secondes`,
    prt: ``
  },
  [Ability.SILENCE]: {
    eng: `Silence the whole team for [2,4,8] seconds`,
    esp: `Silenciar todo el equipo durante 2,4,8 segundos`,
    fra: `Silence toute l équipe ennemie durant 2,4,8 secondes`,
    prt: ``
  },
  [Ability.PROTECT]: {
    eng: `Makes the pokemon invulnerable for [3,5,7] seconds.`,
    esp: `Hace que el pokemon sea invulnerable durante 3,5,7 segundos.`,
    fra: `Rend le pokémon invulnérable durant 3,5,7 secondes`,
    prt: ``
  },
  [Ability.FREEZE]: {
    eng: `Freeze the whole ennemy team for [1,2,4] seconds`,
    esp: `Congela todo el equipo durante 1,2,4 segundos`,
    fra: `Gèle la cible durant 1,2,4 secondes`,
    prt: ``
  },
  [Ability.CONFUSION]: {
    eng: `Makes the target confused for [3,6,12] seconds`,
    esp: `Hace que todo el equipo se confunda durante 1,2,4 segundos`,
    fra: `Rend toute la team ennemie confus pendant 1, 2 4 secondes`,
    prt: ``
  },
  [Ability.FIRE_BLAST]: {
    eng: `Throw a fire blast for [30,60,120] ${Damage.SPECIAL}`,
    esp: `Lanza una ráfaga de fuego para 30,50,100 de daño especial`,
    fra: `Lance une déflagration infligeant 30,50,100 dégats spéciaux`,
    prt: ``
  },
  [Ability.WHEEL_OF_FIRE]: {
    eng: `Sends a fire wheel that makes a round trip doing [20,40,80] ${Damage.SPECIAL}.`,
    esp: `Envía una rueda de fuego que hace un viaje de ida y vuelta haciendo 30,40,50 de daño especial.`,
    fra: `Envoie une boule de feu faisant un aller retour, endommageant les pokémons pour 30,40,50 dégats spéciaux`,
    prt: ``
  },
  [Ability.SEISMIC_TOSS]: {
    eng: `Mono target attack that deals [7,14,28] ${Damage.TRUE} multiplied by the number of Pokemon in your team`,
    esp: `Ataque de objetivo mono que inflige daño real en función de lo grande que sea tu equipo.`,
    fra: `Attaque mono cible dont les dégats varient en fonction de la taille de l équipe.`,
    prt: ``
  },
  [Ability.GUILLOTINE]: {
    eng: `Mono target attack that deals [1,2,3] x ${Stat.ATK} ${Damage.SPECIAL}. Restores half ${Stat.MANA} if target killed`,
    esp: `Ataque de objetivo mono que causa daño físico. Restaura la mitad de maná si el objetivo muere`,
    fra: `Attaque mono cible qui fait des dégats physiques. Restaure la moitié du mana si la cible est tué.`,
    prt: ``
  },
  [Ability.ROCK_SLIDE]: {
    eng: `Mono target attack that deals [30,60,120] ${Damage.SPECIAL}. Doubles damage if target is type flying.`,
    esp: `Ataque de objetivo mono que causa daño físico. Duplica el daño si el objetivo es de tipo volador.`,
    fra: `Attaque mono cible qui fait des dégats physiques. Double les dégats si type vol.`,
    prt: ``
  },
  [Ability.HEAT_WAVE]: {
    eng: `Area of effect attack that deals [20,40,80] ${Damage.SPECIAL} in all ennemies in a line behind the target.`,
    esp: `Ataque de área de efecto que inflige 30,40,50 de daño especial a todos los enemigos en una línea detrás del objetivo.`,
    fra: `Attaque AoE qui infique 30,40,50 dégats spéciaux dans une ligne derrière la cible.`,
    prt: ``
  },
  [Ability.THUNDER]: {
    eng: `Mono target damage that deals [30,60,120] ${Damage.SPECIAL}.`,
    esp: `Daño de objetivo mono que inflige 30,50,70 de daño especial.`,
    fra: `Attaque monocibe infligeant 30,50,70 dégats spéciaux.`,
    prt: ``
  },
  [Ability.HYDRO_PUMP]: {
    eng: `Area of effect attack that deals [25,50,100] ${Damage.SPECIAL} in all ennemies in a line behind the target.`,
    esp: `Ataque de área de efecto que inflige 30,40,50 de daño especial a todos los enemigos en una línea detrás del objetivo.`,
    fra: `Attaque AoE qui infique 30,40,50 dégats spéciaux dans une ligne derrière la cible.`,
    prt: ``
  },
  [Ability.DRACO_METEOR]: {
    eng: `Area of effect attack that deals [10,20,40] ${Damage.SPECIAL} to all ennemies`,
    esp: `Ataque de área de efecto que causa 10,20,40 de daño especial a todos los enemigos`,
    fra: `Inflige 10,20,40 dégats spéciaux à tous les pokémons ennemis.`,
    prt: ``
  },
  [Ability.BLAZE_KICK]: {
    eng: `Mono target that deals [30,60,120] ${Damage.SPECIAL}.`,
    esp: `Objetivo mono que causa 30,60,90 de daño físico`,
    fra: `Attaque monocinle faisant 30,60,90 dégats physiques`,
    prt: ``
  },
  [Ability.WISH]: {
    eng: `Restores 50 ${Stat.HP} to [1,2,3] ally pokemon`,
    esp: `Restaura 50 hp a 1,2,3 de pokemon aliado`,
    fra: `Soigne 50 hp à 1,2,3 pokémons alliés`,
    prt: ``
  },
  [Ability.CALM_MIND]: {
    eng: `Buff pokemon ${Stat.ATK} by [50,100,200]%`,
    esp: `Ataque de pokemón de la Buff en un 50,100,150%.`,
    fra: `Augmente l attaque du pokémon de 50,100,150%.`,
    prt: ``
  },
  [Ability.IRON_DEFENSE]: {
    eng: `Buff ${Stat.DEF} , ${Stat.SPE_DEF} by [3,6,12] points`,
    esp: `Defensa pokemon buff , defensa especial por 4,6,8 puntos`,
    fra: `Augmente la défense du pokémon de 4,6,8 points`,
    prt: ``
  },
  [Ability.METRONOME]: {
    eng: `Shoot a random capacity`,
    esp: `Disparar una capacidad aleatoria`,
    fra: `Execute une capacité au hasard`,
    prt: ``
  },
  [Ability.SOAK]: {
    eng: `Deals [20,40,80] ${Damage.SPECIAL} and restores 10 mana to friendly pokemons`,
    esp: `Hace 20,30,40 de daño especial y devuelve 10 de maná a los pokemons amistosos.`,
    fra: `Fait 20,30,40 dégats spéciaux et restaure 10 mana à chaque pokémon allié.`,
    prt: ``
  },
  [Ability.ORIGIN_PULSE]: {
    eng: `A wave travels horizontally across the battlefield doing [30,60,120] ${Damage.SPECIAL}`,
    esp: `Una ola viaja horizontalmente por el campo de batalla haciendo 60 de daño mágico.`,
    fra: `Une vague parcourt horizontalement le champ de bataille faisant 60 dégats magiques`,
    prt: ``
  },
  [Ability.SEED_FLARE]: {
    eng: `Shaymins body emits a shock wave, dealing 30 ${Damage.SPECIAL} to all ennemies, and decreasing their ${Stat.SPE_DEF} by 2.`,
    esp: `El cuerpo de Shaymin emite una onda de choque que inflige 30 de daño mágico a todos los enemigos y reduce su velocidad en 2.`,
    fra: `Le corps de Shaymin émet une onde de choc, infligeant 30 dégâts magiques à tous les ennemis et réduisant leur vitesse de 2.`,
    prt: ``
  },
  [Ability.IRON_TAIL]: {
    eng: `Mono target damage attack that deals [20,40,80] ${Damage.SPECIAL}. Buff ${Stat.DEF} by [1,3,5] points.`,
    esp: `Ataque de daño al objetivo mono que reparte 20,30,40. Pulveriza la defensa por 1,3,5 puntos.`,
    fra: `Attaque monocible faisant 20,30,40 dégats physique. Booste la défense de 1,3,5 points.`,
    prt: ``
  },
  [Ability.BLAST_BURN]: {
    eng: `Area of effect attack that deals [30,60,120] ${Damage.SPECIAL}.`,
    esp: `Ataque en el área de efecto que causa 30,50,80 daños especiales.`,
    fra: `Attaque AoE en cercle faisant 30,50,80 dégats spéciaux.`,
    prt: ``
  },
  [Ability.CHARGE]: {
    eng: `Buff all electric ally pokemons ${Stat.ATK} by [10,20,40]%`,
    esp: `Pulir todos los pokemones aliados eléctricos atacan en un 10,20,30 %.`,
    fra: `Augmente l attaque des alliés electrique de 10,20,30%`,
    prt: ``
  },
  [Ability.DISCHARGE]: {
    eng: `Area of effect attack that deals [40,80,160] ${Damage.SPECIAL}`,
    esp: `Ataque en el área de efecto que causa 40,60,80 daños especiales.`,
    fra: `Attaque AoE en cercle faisant 40,60,80 dégats spéciaux.`,
    prt: ``
  },
  [Ability.BITE]: {
    eng: `30% Life steal mono target ${Damage.PHYSICAL} that deals [30,60,120] ${Damage.SPECIAL}.`,
    esp: `50% Vida robar mono objetivo de ataque físico que inflige 30,50,70 de daño.`,
    fra: `Attaque monocible avec 50% de vol de vie faisant 30,50,70 dégats spéciaux.`,
    prt: ``
  },
  [Ability.DRAGON_TAIL]: {
    eng: `Mono target attack that deals [30,60,120] ${Damage.SPECIAL} and buff ${Stat.DEF},${Stat.SPE_DEF} by [1,2,3] points`,
    esp: `El ataque físico de un monoobjetivo que inflige 30,40,50 de daño y mejora las defensas en 1,2,3 puntos`,
    fra: `Attaque mono-cible faisant 30,40,50 dégats physique et boostant les défenses de 1,2,3 points.`,
    prt: ``
  },
  [Ability.DRAGON_BREATH]: {
    eng: `Area of effect attack that deals [30,60,120] ${Damage.TRUE} in a line behind the target`,
    esp: `Ataque de área de efecto que inflige 30,40,50 de daño especial en una línea detrás del objetivo`,
    fra: `Attaque AoE faisant 30,40,50 dégats spéciaux dans une ligne derrière la cible`,
    prt: ``
  },
  [Ability.ICICLE_CRASH]: {
    eng: `Area of effect attack that deals [20,40,80] ${Damage.SPECIAL} around the target`,
    esp: `Ataque de área de efecto que causa 30,40,50 de daño físico alrededor del objetivo`,
    fra: `Attaque AoE en cercle faisant 30,40,50 dégats physiques`,
    prt: ``
  },
  [Ability.ROOT]: {
    eng: `Heal all nearby ally pokemons by [20,40,80] ${Stat.HP}.`,
    esp: `Curar a todos los pokemons aliados cercanos con 20,30,40 hp.`,
    fra: `Soigne les alliés autour de 20,30,40 hp.`,
    prt: ``
  },
  [Ability.TORMENT]: {
    eng: `Increase ${Stat.ATK_SPEED} by [20,40,60]%`,
    esp: `Aumenta la velocidad de ataque en un 20,30,40 %.`,
    fra: `Augmente la vitesse d attaque de 20,30,40%`,
    prt: ``
  },
  [Ability.STOMP]: {
    eng: `Mono target that deals [2,4,6] x ${Stat.ATK} ${Damage.SPECIAL}`,
    esp: `Daño físico del objetivo mono [2,4,6] x ${Stat.ATK} ${Damage.SPECIAL}`,
    fra: `Attaque mono cible faisant [2,4,6] x ${Stat.ATK} ${Damage.SPECIAL} dégats physiques`,
    prt: ``
  },
  [Ability.DARK_PULSE]: {
    eng: `Life drain target attack that deals [30,60,120] ${Damage.SPECIAL}`,
    esp: `Ataque al objetivo de drenaje de vida que causa 30,50,70 de daño especial`,
    fra: `Attaque vol de vie faisant 30,50,70 dégats spéciaux.`,
    prt: ``
  },
  [Ability.NIGHT_SLASH]: {
    eng: `One-target attack that does [40,60,100] ${Damage.SPECIAL}. Decreases the ${Stat.DEF} of all enemies by 1 point`,
    esp: `Ataque especial de objetivo mono que hace 40,60,80. Disminuye la defensa de todos los enemigos en 1 punto.`,
    fra: `Attaque spéciale faisant 40,60,80 points de dégats. Diminue la défense de toute la team ennemie de 1 point.`,
    prt: ``
  },
  [Ability.BUG_BUZZ]: {
    eng: `Mono target attack that does [15,30,60] ${Damage.TRUE}.`,
    esp: `Ataque de daño especial de un mono objetivo que hace 20,30,40.`,
    fra: `Attaque mono cible faisant 20,30,40 dégats spéciaux`,
    prt: ``
  },
  [Ability.POISON_STING]: {
    eng: `Mono target damage that deals [30,60,120] ${Damage.SPECIAL}. Doubles damage if target is poisoned.`,
    esp: `Daño físico de un solo objetivo que reparte 30,40,50. Duplica el daño si el objetivo está envenenado.`,
    fra: `Attaque physique mono cible faisant 30,40,50 dégats. Double les dégats si la cible est empoisonné.`,
    prt: ``
  },
  [Ability.LEECH_LIFE]: {
    eng: `Area of effect life steal attack that deals [15,30,60] ${Damage.SPECIAL} around the target`,
    esp: `Área de efecto robo de vida daño especial ataque 10,20,30 alrededor del objetivo`,
    fra: `Attaque vol de vie en AoE faisant 10,20,30 points de dégats.`,
    prt: ``
  },
  [Ability.HAPPY_HOUR]: {
    eng: `Buff all ally ${Stat.ATK} by [3,6,9] points.`,
    esp: `Pulir todos los ataques de los aliados por 3,6,9 puntos.`,
    fra: `Augmente l attaque de toute l équipe de 3,6,9 points.`,
    prt: ``
  },
  [Ability.TELEPORT]: {
    eng: `Buff ${Stat.ATK} by [1,2,3] points and teleport the pokemon on one edge of the map`,
    esp: `Teletransportar el pokemon en un borde del mapa`,
    fra: `Téléporte le pokémon sur un coin de la carte.`,
    prt: ``
  },
  [Ability.NASTY_PLOT]: {
    eng: `Buff pokemon ${Stat.ATK} by [5,10,20] points`,
    esp: `Buff pokemon ataque por 5,10,20 puntos`,
    fra: `Booste l attaque du pokémon de 5,10,20 points`,
    prt: ``
  },
  [Ability.THIEF]: {
    eng: `Steals all the target's items the holder can carry and deals [15,30,60] ${Damage.SPECIAL}`,
    esp: `Roba el objeto del enemigo e inflige 5,10,20 de daño físico`,
    fra: `Vole l item du pokémon ennemi et inflige 5,10,20 dégats physiques`,
    prt: ``
  },
  [Ability.STUN_SPORE]: {
    eng: `Decrease target ${Stat.ATK_SPEED} by [50,100,200]% and deals [5,10,20] ${Damage.SPECIAL}`,
    esp: `Disminuir la velocidad de ataque del objetivo en un 50,100,200% e inflige 5,10,20 de daño físico`,
    fra: `Diminue la vitesse d attaque du pokémon de 50,100,200% et inflige 5,10,20 dégats physiques`,
    prt: ``
  },
  [Ability.METEOR_MASH]: {
    eng: `Area of effect around the target that deals [30,50,70] ${Damage.SPECIAL}. Buff pokemon ${Stat.ATK} by 5 points.`,
    esp: `Área de efecto alrededor del objetivo que produce 30,50,70 daños. Buff pokemon ataque por 5 puntos.`,
    fra: `Attaque en AoE faisant 30,50,40 dégats spéciaux. Booste l attaque du pokémon de 5 points.`,
    prt: ``
  },
  [Ability.HURRICANE]: {
    eng: `Area of effect attack that deals [10,20,30] ${Damage.SPECIAL} in a line behind the target`,
    esp: `Ataque de área de efecto que causa 10,20,30 de daño en una línea detrás del objetivo`,
    fra: `Attaque AoE faisant 10,20,30 dégats spéciaux dans une ligne derrière la cible`,
    prt: ``
  },
  [Ability.HEAL_BLOCK]: {
    eng: `Apply wound status (target cannot heal) to all adjacent ennemies for [5,10,15]s.`,
    esp: `Ataque de área de efecto que causa 10,20,30 de daño en una línea detrás del objetivo`,
    fra: `Attaque AoE faisant 10,20,30 dégats spéciaux dans une ligne derrière la cible`,
    prt: ``
  },
  [Ability.ROAR_OF_TIME]: {
    eng: `Add a second life to the pokemon that has the most items.`,
    esp: `Ataque de área de efecto que causa 10,20,30 de daño en una línea detrás del objetivo`,
    fra: `Attaque AoE faisant 10,20,30 dégats spéciaux dans une ligne derrière la cible`,
    prt: ``
  },
  [Ability.ROCK_TOMB]: {
    eng: `Mono target attack that deals [30,60,120] ${Damage.SPECIAL} and decrease target ${Stat.ATK_SPEED} by [20,40,60]%`,
    esp: ``,
    fra: ``,
    prt: ``
  },
  [Ability.ROCK_SMASH]: {
    eng: `Mono target attack that deals [20,40,80] ${Damage.SPECIAL} and silence target for [3,6,9]s.`,
    esp: `Ataque de área de efecto que causa 10,20,30 de daño en una línea detrás del objetivo`,
    fra: `Attaque AoE faisant 10,20,30 dégats spéciaux dans une ligne derrière la cible`,
    prt: ``
  },
  [Ability.HEAD_SMASH]: {
    eng: `The pokemon hurt itself for [5,10,15] ${Stat.HP}, and deals [40,80,150] ${Damage.SPECIAL}. Execute if the target is asleep,frozen.`,
    esp: `Ataque de área de efecto que causa 10,20,30 de daño en una línea detrás del objetivo`,
    fra: `Attaque AoE faisant 10,20,30 dégats spéciaux dans une ligne derrière la cible`,
    prt: ``
  },
  CORRUPTED_NATURE: {
    eng: `Wound adjacent ennemies for 4 seconds and deals [25,50,100] life steal ${Damage.SPECIAL}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  CRABHAMMER: {
    eng: `Deals [30,60,120] ${Damage.SPECIAL}. Execute the target if below 30%`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DIAMOND_STORM: {
    eng: `+5 ${Stat.DEF} to adjacent allies`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DRACO_ENERGY: {
    eng: `Deals 100% regidraco ${Stat.HP} as ${Damage.SPECIAL}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DYNAMAX_CANNON: {
    eng: `Shoot a dynamax beam on a straight line, dealing 80% ${Stat.HP} to every pokemon as ${Damage.SPECIAL}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  DYNAMIC_PUNCH: {
    eng: `Deals [20,40,80] ${Damage.SPECIAL} and confuse the target for [1.5,3,6]s`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  ELECTRO_BOOST: {
    eng: `All electric allies are immune to spells for 5s`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  ELECTRO_WEB: {
    eng: `Steal [15,30,60]% ${Stat.ATK_SPEED} to adjacent ennemies`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  FIRE_TRICK: {
    eng: `Deals [20,40,80] ${Damage.SPECIAL} and teleports the target to a corner of the map`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  FLAME_CHARGE: {
    eng: `Dash into the ennemy backline, dealing [30,60,120] ${Damage.SPECIAL}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  LEECH_SEED: {
    eng: `Poison the target for [3,6,12]s, healing for [20,40,80] ${Stat.HP}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  LOCK_ON: {
    eng: `Lock the target and shred its ${Stat.DEF}/${Stat.SPE_DEF} for 8s. Genesect deals ${Damage.TRUE} to it`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  PSYCH_UP: {
    eng: `Silence the target and every ennemies around for [2,4,8]s, dealing [10,20,40] ${Damage.SPECIAL}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  RAZOR_WIND: {
    eng: `Apply Smoke effect (-50% ${Stat.ATK_SPEED}) on the target and around it`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  TWISTING_NEITHER: {
    eng: `Deals 80 ${Damage.SPECIAL} to around ennemies. Every affected pokemons is teleported somewhere`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  WONDER_GUARD: {
    eng: `Passive: Reduce received damage to 1.`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  ELECTRIC_SURGE: {
    eng: `Passive: Electric-type damage are boosted by 30%`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  PSYCHIC_SURGE: {
    eng: `Passive: Psychic-type damage are boosted by 30%`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  MIND_BLOWN: {
    eng: `Deals 50% of target life as ${Damage.SPECIAL}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  PAYDAY: {
    eng: `Deals 30,60,120 ${Damage.SPECIAL}. If the target is killed, the player receive [1,2,3] gold`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  BEAT_UP: {
    eng: `Summon [1,2,3] Houndour (no items)`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.BLUE_FLARE]: {
    eng: `Inflicts 50 ${Damage.SPECIAL} + 20 additional points per stage of active fire synergies`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.FUSION_BOLT]: {
    eng: `Inflicts 50 ${Damage.SPECIAL} + 25 additional points per stage of active electric synergies`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.AURORA_VEIL]: {
    eng: `All allies are immune to spells for [1.5,2.5,3.5]s`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.AQUA_JET]: {
    eng: `Dash into the ennemy backline, dealing [30,60,120] ${Damage.SPECIAL}`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.PROTEAN]: {
    eng: `The pokemon acquires the typing of the [1,2,3] highest synergies on the team.`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.CHATTER]: {
    eng: `Deal [5,10,15] ${Damage.SPECIAL} to all enemies with each target hit having a [20,30,40]% chance to be confused 1s`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.SYNCHRO]: {
    eng: `If the pokemon is affected by poison,burn/wound/silence, the ennemy team will suffer the same negative status`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.STEAM_ERUPTION]: {
    eng: `Deals [20,40,80] ${Damage.SPECIAL} around the target, and burning everything for 3s`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.APPLE_ACID]: {
    eng: `Deals [30,60,120] ${Damage.SPECIAL} to the target, and lower its ${Stat.SPE_DEF} by 3 points`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.SHADOW_BALL]: {
    eng: `Deals [45,90,180] ${Damage.SPECIAL} and burn 15 ${Stat.MANA} to the target and adjacent ennemies`,
    esp: ``,
    prt: ``,
    fra: ``
  },
  [Ability.DIVE]: {
    eng: `Dives underwater and reappears in the middle of the enemy team, dealing [10,20,40] ${Damage.SPECIAL} and freezing all adjacent units for [1.5,3,6] seconds`,
    esp: ``,
    prt: ``,
    fra: ``
  }
}
