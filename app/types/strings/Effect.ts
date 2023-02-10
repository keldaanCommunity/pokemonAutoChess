import { Effect } from "../enum/Effect"
import { Damage, Stat } from "../enum/Game"

export const EffectName: { [key in Effect]: string } = {
  [Effect.INGRAIN]: `Ingrain`,
  [Effect.GROWTH]: `Growth`,
  [Effect.SPORE]: `Spore`,
  [Effect.BLAZE]: `Blaze`,
  [Effect.VICTORY_STAR]: `Victory Star`,
  [Effect.DROUGHT]: `Drought`,
  [Effect.DESOLATE_LAND]: `Desolate Land`,
  [Effect.DRIZZLE]: `Drizzle`,
  [Effect.RAIN_DANCE]: `Rain Dance`,
  [Effect.PRIMORDIAL_SEA]: `Primordial Sea`,
  [Effect.STAMINA]: `Stamina`,
  [Effect.STRENGTH]: `Strength`,
  [Effect.PURE_POWER]: `Pure Power`,
  [Effect.ROCK_SMASH]: `Rock Smash`,
  [Effect.EERIE_IMPULSE]: `Eerie Impulse`,
  [Effect.RISING_VOLTAGE]: `Rising Voltage`,
  [Effect.OVERDRIVE]: `Overdrive`,
  [Effect.GUTS]: `Guts`,
  [Effect.DEFIANT]: `Defiant`,
  [Effect.JUSTIFIED]: `Justified`,
  [Effect.AMNESIA]: `Amnesia`,
  [Effect.LIGHT_SCREEN]: `Light Screen`,
  [Effect.EERIE_SPELL]: `Eerie Spell`,
  [Effect.HONE_CLAWS]: `Hone Claws`,
  [Effect.ASSURANCE]: `Assurance`,
  [Effect.BEAT_UP]: `Beat Up`,
  [Effect.IRON_DEFENSE]: `Iron Defense`,
  [Effect.AUTOTOMIZE]: `Autotomize`,
  [Effect.SHORE_UP]: `Shore Up`,
  [Effect.ROTOTILLER]: `Rototiller`,
  [Effect.SANDSTORM]: `Sandstorm`,
  [Effect.POISON_GAS]: `Poison Gas`,
  [Effect.TOXIC]: `Toxic`,
  [Effect.DRAGON_ENERGY]: `Dragon Energy`,
  [Effect.DRAGON_DANCE]: `Dragon Dance`,
  [Effect.BULK_UP]: `Bulk Up`,
  [Effect.RAGE]: `Rage`,
  [Effect.ANGER_POINT]: `Anger Point`,
  [Effect.PURSUIT]: `Pursuit`,
  [Effect.BRUTAL_SWING]: `Brutal Swing`,
  [Effect.POWER_TRIP]: `Power Trip`,
  [Effect.MEDITATE]: `Meditate`,
  [Effect.FOCUS_ENERGY]: `Focus Energy`,
  [Effect.CALM_MIND]: `Calm Mind`,
  [Effect.INFESTATION]: `Infestation`,
  [Effect.HORDE]: `Horde`,
  [Effect.HEART_OF_THE_SWARM]: `Heart Of The Swarm`,
  [Effect.SWIFT_SWIM]: `Swift Swim`,
  [Effect.HYDRO_CANNON]: `Hydro Cannon`,
  [Effect.TAILWIND]: `Tailwind`,
  [Effect.FEATHER_DANCE]: `Feather Dance`,
  [Effect.MAX_AIRSTREAM]: `Max Airstream`,
  [Effect.MAX_GUARD]: `Max Guard`,
  [Effect.ODD_FLOWER]: `Odd Flower`,
  [Effect.GLOOM_FLOWER]: `Gloom Flower`,
  [Effect.VILE_FLOWER]: `Vile Flower`,
  [Effect.SUN_FLOWER]: `Sun Flower`,
  [Effect.BATTLE_ARMOR]: `Battle Armor`,
  [Effect.MOUTAIN_RESISTANCE]: `Moutain Resistance`,
  [Effect.DIAMOND_STORM]: `Diamond Storm`,
  [Effect.PHANTOM_FORCE]: `Phantom Force`,
  [Effect.CURSE]: `Curse`,
  [Effect.SHADOW_TAG]: `Shadow Tag`,
  [Effect.WANDERING_SPIRIT]: `Wandering Spirit`,
  [Effect.AROMATIC_MIST]: `Aromatic Mist`,
  [Effect.FAIRY_WIND]: `Fairy Wind`,
  [Effect.STRANGE_STEAM]: `Strange Steam`,
  [Effect.SNOW]: `Snow`,
  [Effect.SHEER_COLD]: `Sheer Cold`,
  [Effect.ANCIENT_POWER]: `Ancient Power`,
  [Effect.ELDER_POWER]: `Elder Power`,
  [Effect.UNOWN_GATHERINGS]: `Unown Gatherings`,
  [Effect.LARGO]: `Largo`,
  [Effect.ALLEGRO]: `Allegro`,
  [Effect.PRESTO]: `Presto`,
  [Effect.DUBIOUS_DISC]: `Dubious Disc`,
  [Effect.LINK_CABLE]: `Link Cable`,
  [Effect.GOOGLE_SPECS]: `Google Specs`
}

export const EffectDescription: {
  [key in Effect]: { eng: string; esp: string; fra: string }
} = {
  [Effect.STAMINA]: {
    eng: `All allies adjacent to your Normal pokemon have +20 ${Stat.SHIELD}`,
    esp: `+20 HP por cada pokemon que esté cerca`,
    fra: `+20 HP pour tous les pokémons autours`
  },
  [Effect.STRENGTH]: {
    eng: `All allies adjacent to your Normal pokemon have +30 ${Stat.SHIELD}`,
    esp: `+30 HP por cada pokemon que esté cerca`,
    fra: `+30 HP pour tous les pokémons autours`
  },
  [Effect.ROCK_SMASH]: {
    eng: `All allies adjacent to your Normal pokemon have +40 ${Stat.SHIELD}`,
    esp: `+50 HP por cada pokemon que esté cerca`,
    fra: `+50 HP pour tous les pokémons autours`
  },
  [Effect.PURE_POWER]: {
    eng: `All allies adjacent to your Normal pokemon have +50 ${Stat.SHIELD}`,
    esp: `+50 HP por cada pokemon que esté cerca`,
    fra: `+50 HP pour tous les pokémons autours`
  },
  [Effect.INGRAIN]: {
    eng: `Grass allies restore 5 ${Stat.HP} per second`,
    esp: `+5% HP/s para los tipos de Planta`,
    fra: `+5% HP/s pour tous les alliés plante`
  },
  [Effect.GROWTH]: {
    eng: `Grass allies restore 10 ${Stat.HP} per second`,
    esp: `+10% HP/s para los tipos de Planta`,
    fra: `+10% HP/s pour tous les alliés plante`
  },
  [Effect.SPORE]: {
    eng: `Grass allies restore 18 ${Stat.HP} per second`,
    esp: `Los ennemigos que no son de Planta tienen un 30% ATK speed`,
    fra: `-30% ATK speed pour tous les ennemis`
  },
  [Effect.BLAZE]: {
    eng: `Your Fire pokemon have 20% chance to burn ennemy for 2s`,
    esp: `Fire pkm gana un 5% de dano en cada ataque`,
    fra: `Les pkm feu gagnent 5% d'ATK à chaque attaque`
  },
  [Effect.VICTORY_STAR]: {
    eng: `Your Fire pokemon have 20% chance to burn ennemy for 2s and gain +1 ${Stat.ATK} after every hit (Sunlight)`,
    esp: `Fire pkm gana un 5% de dano en cada ataque`,
    fra: `Les pkm feu gagnent 5% d'ATK à chaque attaque`
  },
  [Effect.DROUGHT]: {
    eng: `Your Fire pokemon have 30% chance to burn ennemy for 2s and gain +2 ${Stat.ATK} after every hit (Sunlight)`,
    esp: `El so se intensifica, los pkm de fuego gana +50% ATK`,
    fra: `Le soleil s'intensifie, augmentant l'ATK des pkm feu de 50%`
  },
  [Effect.DESOLATE_LAND]: {
    eng: `Your Fire pokemon have 40% chance to burn ennemy for 2s and gain +3 ${Stat.ATK} after every hit (Sunlight)`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.RAIN_DANCE]: {
    eng: `Water pokemons gain 25% chance to dodge enemy attacks`,
    esp: `Cae la lluvia, 30% de ATK para los aliados del agua`,
    fra: `La pluie tombe, 30% d'ATK pour les alliés eau`
  },
  [Effect.DRIZZLE]: {
    eng: `Water pokemons gain 50% chance to dodge enemy attacks`,
    esp: `La lluvia es cada vez más intensa, un 30% más de ATK.`,
    fra: `La pluie s'intensifie, 30% d'ATK en plus`
  },
  [Effect.PRIMORDIAL_SEA]: {
    eng: `Water pokemons gain 75% chance to dodge enemy attacks`,
    esp: `Invoca a Kyogre, el rey de los océanos`,
    fra: `Invoque Kyogre, le roi des océans`
  },
  [Effect.EERIE_IMPULSE]: {
    eng: `Electric' Basic Attacks have a 30% chance to trigger two additional attacks against their target.`,
    esp: `+10% de velocidad ATK por cada aliado eléctrico del equipo`,
    fra: `+10% ATK speed pour chaque allié elec dans l'équipe`
  },
  [Effect.RISING_VOLTAGE]: {
    eng: `Electric' Basic Attacks have a 50% chance to trigger two additional attacks against their target.`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.OVERDRIVE]: {
    eng: `Electric' Basic Attacks have a 70% chance to trigger two additional attacks against their target.`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.GUTS]: {
    eng: `All allies block 3 damage`,
    esp: `+5 maná/ataque para todos los pkm`,
    fra: `+5 mana / attaque pour tous les pkm`
  },
  [Effect.DEFIANT]: {
    eng: `All allies block 6 damage`,
    esp: `+10 maná/ataque para todos los pkm`,
    fra: `+10 mana / attaque pour tous les pkm`
  },
  [Effect.JUSTIFIED]: {
    eng: `All allies block 9 damage`,
    esp: `+10 maná/ataque para todos los pkm`,
    fra: `+10 mana / attaque pour tous les pkm`
  },
  [Effect.AMNESIA]: {
    eng: `Psychic pokemons gains +50% ${Stat.SPELL_POWER}`,
    esp: `Ally gana +5 SPEDEF`,
    fra: `Les alliés gagnent +5 SPEDEF`
  },
  [Effect.LIGHT_SCREEN]: {
    eng: `Psychic pokemons gains +100% ${Stat.SPELL_POWER}`,
    esp: `Ally gana +10 SPEDEF adicionales`,
    fra: `Les alliés gagnent un additionel +10 SPEDEF`
  },
  [Effect.EERIE_SPELL]: {
    eng: `Psychic pokemons gains +150% ${Stat.SPELL_POWER}`,
    esp: `Ally gana +20 SPEDEF adicionales`,
    fra: `Les alliés gagnent un additionel +20 SPEDEF`
  },
  [Effect.HONE_CLAWS]: {
    eng: `Dark pokemons gains +4 ${Stat.ATK}/+20 ${Stat.SHIELD} for each held items`,
    esp: `Dark pokemons gains +4 ${Stat.ATK}/+20 ${Stat.SHIELD} for each held items`,
    fra: `Dark pokemons gains +4 ${Stat.ATK}/+20 ${Stat.SHIELD} for each held items`
  },
  [Effect.ASSURANCE]: {
    eng: `Dark pokemons gains +7 ${Stat.ATK}/+30 ${Stat.SHIELD} for each held items`,
    esp: `Dark pokemons gains +7 ${Stat.ATK}/+30 ${Stat.SHIELD} for each held items`,
    fra: `Dark pokemons gains +7 ${Stat.ATK}/+30 ${Stat.SHIELD} for each held items`
  },
  [Effect.BEAT_UP]: {
    eng: `Dark pokemons gains +10 ${Stat.ATK}/+50 ${Stat.SHIELD} for each held items`,
    esp: `Dark pokemons gains +10 ${Stat.ATK}/+50 ${Stat.SHIELD} for each held items`,
    fra: `Dark pokemons gains +10 ${Stat.ATK}/+50 ${Stat.SHIELD} for each held items`
  },
  [Effect.IRON_DEFENSE]: {
    eng: `One of your steel gains double ${Stat.ATK}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.AUTOTOMIZE]: {
    eng: `All of your steel gains double ${Stat.ATK}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.SHORE_UP]: {
    eng: `Every three seconds all ground pokemons gains 1 ${Stat.DEF}/${Stat.SPE_DEF} and 1 ${Stat.ATK} bonus stats. This effect stacks up to four times`,
    esp: `-10% de HP para los enemigos al comienzo del combate`,
    fra: `-10% HP pour les ennemis au début du combat`
  },
  [Effect.ROTOTILLER]: {
    eng: `Every three seconds all ground pokemons gains 2 ${Stat.DEF}/${Stat.SPE_DEF} and 2 ${Stat.ATK} bonus stats. This effect stacks up to four times`,
    esp: `-10% de HP para los enemigos al comienzo del combate`,
    fra: `-10% HP pour les ennemis au début du combat`
  },
  [Effect.SANDSTORM]: {
    eng: `Every three seconds all ground pokemons gains 3 ${Stat.DEF}/${Stat.SPE_DEF} and 3 ${Stat.ATK} bonus stats. This effect stacks up to four times`,
    esp: `Se desata una tormenta de arena que produce un 10% de HP/s por pkm de tierra/acero/mineral`,
    fra: `Une tempête de sable fait rage, faisant 10% HP/s aux pkm non sol/acier/mineral`
  },
  [Effect.POISON_GAS]: {
    eng: `Your Poison pokemon have a 30% chance to poison the target for 4 seconds. (13% ${Stat.HP} per second as ${Damage.TRUE})`,
    esp: `+20% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`,
    fra: `+20% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
  },
  [Effect.TOXIC]: {
    eng: `Your Poison pokemon have 70% chance to poison the target for 4 seconds. (13% ${Stat.HP} per second as ${Damage.TRUE})`,
    esp: `+30% de probabilidad de envenenar al objetivo durante 2 segundos, infligiendo un 15% de CV/segundo`,
    fra: `+30% de chances d'empoisonner la cible pendant 2 secondes, lui infligeant 15% PV/secondes`
  },
  [Effect.DRAGON_ENERGY]: {
    eng: `Your Dragon pokemon gain +5% ${Stat.ATK_SPEED} after every hit.`,
    esp: `-30% ATK para el equipo enemigo`,
    fra: `-30% ATK pour l'équipe ennemie`
  },
  [Effect.DRAGON_DANCE]: {
    eng: `Your Dragon pokemon gain +10%  ${Stat.ATK_SPEED} after every hit.`,
    esp: `+5% velocidad de ataque para dragones pkm en cada ataque`,
    fra: `+5% vitesse d'attaque pour les pkm dragons à chaque attaque`
  },
  [Effect.BULK_UP]: {
    eng: `When a field pokemon dies, all other field pokemons gain 20% ${Stat.ATK_SPEED} and are healed for 30% ${Stat.HP} of their Maximum Health`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.RAGE]: {
    eng: `When a field pokemon dies, all other field pokemons gain 30% ${Stat.ATK_SPEED} and are healed for 40% ${Stat.HP} of their Maximum Health`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.ANGER_POINT]: {
    eng: `When a field pokemon dies, all other field pokemons gain 50% ${Stat.ATK_SPEED} and are healed for 60% ${Stat.HP} of their Maximum Health`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.PURSUIT]: {
    eng: `Upon kill, grants 2 ${Stat.DEF}, 2 ${Stat.SPE_DEF}, heal 30 ${Stat.HP} and 3 ${Stat.ATK}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.BRUTAL_SWING]: {
    eng: `Upon kill, grants 4 ${Stat.DEF}, 4 ${Stat.SPE_DEF}, heal 60 ${Stat.HP} and 6 ${Stat.ATK}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.POWER_TRIP]: {
    eng: `Upon kill, grants 6 ${Stat.DEF}, 6 s${Stat.SPE_DEF}, heal 120 ${Stat.HP} and 12 ${Stat.ATK}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.MEDITATE]: {
    eng: `All allies heals for 15% ${Stat.HP} of the damage they deal with spells and attacks`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.FOCUS_ENERGY]: {
    eng: `All allies heals for 30% ${Stat.HP} of the damage they deal with spells and attacks`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.CALM_MIND]: {
    eng: `All allies heals for 60% ${Stat.HP} of the damage they deal with spells and attacks`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.SWIFT_SWIM]: {
    eng: `Revive aquatic pokemons at first death with 40% ${Stat.HP} and 30% increased ${Stat.ATK}`,
    esp: `+30% de velocidad ATK por pkm de agua`,
    fra: `+30% ATK speed pour les pkm aquatiques`
  },
  [Effect.HYDRO_CANNON]: {
    eng: `Revive aquatic pokemons at first death with 80% ${Stat.HP} and 60% increased ${Stat.ATK}.`,
    esp: `+30% ATK para pkm acuáticos`,
    fra: `+30% ATK pour les pkm aquatiques`
  },
  [Effect.INFESTATION]: {
    eng: `At the start of combat, creates a copy of a bug pokemon (ranked by ${Stat.HP})`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.HORDE]: {
    eng: `At the start of combat, creates a copy of two bug pokemons (ranked by ${Stat.HP})`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.HEART_OF_THE_SWARM]: {
    eng: `At the start of combat, creates a copy of four bug pokemons (ranked by ${Stat.HP})`,
    esp: ``,
    fra: ``
  },
  [Effect.TAILWIND]: {
    eng: `Give a protection effect for 1sec when the pokemon fell under 20% ${Stat.HP}`,
    esp: `Give a protection effect for 1sec when the pokemon fell under 20% ${Stat.HP}`,
    fra: `Give a protection effect for 1sec when the pokemon fell under 20% ${Stat.HP}`
  },
  [Effect.FEATHER_DANCE]: {
    eng: `Give a protection effect for 2sec when the pokemon fell under 40% ${Stat.HP}`,
    esp: `Give a protection effect for 1sec when the pokemon fell under 40% ${Stat.HP}`,
    fra: `Give a protection effect for 1sec when the pokemon fell under 40% ${Stat.HP}`
  },
  [Effect.MAX_AIRSTREAM]: {
    eng: `Give a protection effect for 3sec when the pokemon fell under 50% ${Stat.HP}`,
    esp: `Give a protection effect for 2sec when the pokemon fell under 50% ${Stat.HP}`,
    fra: `Give a protection effect for 2sec when the pokemon fell under 50% ${Stat.HP}`
  },
  [Effect.MAX_GUARD]: {
    eng: `Give a protection effect for 4sec when the pokemon fell under 50% ${Stat.HP}`,
    esp: `Add a second protection effect at 30%`,
    fra: `Add a second protection effect at 30%`
  },
  [Effect.ODD_FLOWER]: {
    eng: `When the first flora pokemon is dead, the odd flower will rise from its grave..`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.GLOOM_FLOWER]: {
    eng: `When the first flora pokemon is dead, the gloom flower will rise from its grave..`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.VILE_FLOWER]: {
    eng: `When the first flora pokemon is dead, the vile flower will rise from its grave..`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.SUN_FLOWER]: {
    eng: `When the first flora pokemon is dead, the sun flower will rise from its grave..`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.BATTLE_ARMOR]: {
    eng: `Mineral pokemons gains 50 ${Stat.SHIELD}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.MOUTAIN_RESISTANCE]: {
    eng: `Mineral pokemons gains 100 ${Stat.SHIELD}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.DIAMOND_STORM]: {
    eng: `Mineral pokemons gains 200 ${Stat.SHIELD}`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.PHANTOM_FORCE]: {
    eng: `Yours ghost deals 20% of ${Stat.ATK} as ${Damage.TRUE} + 50% chance silence on hit`,
    esp: `Los fantasmas ganan un 15% de velocidad ATK y hacen daño verdadero`,
    fra: `Les fantômes gagnent 15% d'ATK speed et font des dégats bruts`
  },
  [Effect.CURSE]: {
    eng: `Yours ghost deals 40% of ${Stat.ATK} as ${Damage.TRUE} + 50% chance silence on hit`,
    esp: `Los ataques fantasma silencian sus objetivos`,
    fra: `Les attaques des fantomes réduisent aux silences leurs cibles`
  },
  [Effect.SHADOW_TAG]: {
    eng: `Yours ghost deals 70% of ${Stat.ATK} as ${Damage.TRUE} + 50% chance silence on hit`,
    esp: `Los ataques fantasma silencian sus objetivos`,
    fra: `Les attaques des fantomes réduisent aux silences leurs cibles`
  },
  [Effect.WANDERING_SPIRIT]: {
    eng: `Yours ghost deals 100% of ${Stat.ATK} as ${Damage.TRUE} + 50% chance silence on hit`,
    esp: `Los ataques fantasma silencian sus objetivos`,
    fra: `Les attaques des fantomes réduisent aux silences leurs cibles`
  },
  [Effect.AROMATIC_MIST]: {
    eng: `Fairy pokemons shock nearby enemies for 10 ${Damage.SPECIAL} whenever they deal or receive a critical strike`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.FAIRY_WIND]: {
    eng: `Fairy pokemons shock nearby enemies for 25 ${Damage.SPECIAL} whenever they deal or receive a critical strike`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.STRANGE_STEAM]: {
    eng: `Fairy pokemons shock nearby enemies for 50 ${Damage.SPECIAL} whenever they deal or receive a critical strike`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.SNOW]: {
    eng: `All allies have a 10% chance to freeze an enemy for 2 seconds after a hit.`,
    esp: `+10% de probabilidad de congelar al enemigo durante un ataque`,
    fra: `+10% de chance de geler l'ennemi lors d'une attaque`
  },
  [Effect.SHEER_COLD]: {
    eng: `All allies pokemon have a 30% chance to freeze an enemy for 2 seconds after a hit.`,
    esp: `+30% de probabilidad de congelar al enemigo durante un ataque`,
    fra: `+30% de chance de geler l'ennemi lors d'une attaque`
  },
  [Effect.ANCIENT_POWER]: {
    eng: `+40% ${Stat.CRIT_CHANCE} and +80% ${Stat.CRIT_DAMAGE}`,
    esp: `+10% Crit Chance and +20% Crit Damage.`,
    fra: `+10% Crit Chance and +20% Crit Damage.`
  },
  [Effect.ELDER_POWER]: {
    eng: `+70% ${Stat.CRIT_CHANCE} and +140% ${Stat.CRIT_DAMAGE}`,
    esp: `+30% Crit Chance and +40% Crit Damage`,
    fra: `+30% Crit Chance and +40% Crit Damage`
  },
  [Effect.UNOWN_GATHERINGS]: {
    eng: `+100% ${Stat.CRIT_CHANCE} and +250% ${Stat.CRIT_DAMAGE}`,
    esp: `+50% Crit Chance and +60% Crit Damage`,
    fra: `+50% Crit Chance and +60% Crit Damage`
  },
  [Effect.LARGO]: {
    eng: `+3 ${Stat.ATK} each time a sound pokemon use its ability`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.ALLEGRO]: {
    eng: `+5 ${Stat.ATK} each time a sound pokemon use its ability`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.PRESTO]: {
    eng: `+7 ${Stat.ATK} each time a sound pokemon use its ability`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.DUBIOUS_DISC]: {
    eng: `Artificial pokemons have a 35% chance to burn 20 ${Stat.MANA} from their target and return 15 ${Stat.MANA} to the attacker`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.LINK_CABLE]: {
    eng: `Artificial pokemons have a 45% chance to burn 20 ${Stat.MANA} from their target and return 30 ${Stat.MANA} to the attacker`,
    esp: `?NONE?`,
    fra: `?NONE?`
  },
  [Effect.GOOGLE_SPECS]: {
    eng: `Artificial pokemons have a 55% chance to burn 20 ${Stat.MANA} from their target and return 45 ${Stat.MANA} to the attacker`,
    esp: `?NONE?`,
    fra: `?NONE?`
  }
}
