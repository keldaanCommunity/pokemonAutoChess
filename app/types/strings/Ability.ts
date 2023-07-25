import { Ability } from "../enum/Ability"
import { Damage, Stat } from "../enum/Game"
import { Status } from "../enum/Status"
import { Synergy } from "../enum/Synergy"

export const AbilityDescription: { [key in Ability]: string } = {
  [Ability.DEFAULT]: ``,

  [Ability.SOFT_BOILED]: `Cures every status effects and grants [20,40,80,SP] ${Stat.SHIELD} for every ally`,

  [Ability.EARTHQUAKE]: `Deals damage [30,60,120,SP] ${Damage.SPECIAL} to all enemy units in the same column/line of the attacker`,

  [Ability.SONG_OF_DESIRE]: `The target is ${Status.CONFUSION} for [6,SP] seconds`,

  [Ability.CONFUSING_MIND]: `Deals [40,SP] ${Damage.SPECIAL} to the target and its adjacent pokemons, making them ${Status.CONFUSION} for 3 seconds`,

  [Ability.KNOWLEDGE_THIEF]: `Launch the ultimate of the target`,

  [Ability.KING_SHIELD]: `${Status.PROTECT} the user for [1,2,3] seconds and swap his position with the farthest enemy`,

  [Ability.EXPLOSION]: `Deals [50,100,200,SP] ${Damage.SPECIAL} to all adjacent enemies. Also damage the user.`,

  [Ability.NIGHTMARE]: `${Status.POISON} the whole enemy team for [2,4,8,SP=0.5] seconds`,

  [Ability.CLANGOROUS_SOUL]: `Buff the adjacent allies with [2,4,8] ${Stat.ATK} and [1,2,4] ${Stat.DEF} / ${Stat.SPE_DEF}`,

  [Ability.BONEMERANG]: `Throw a boomerang bone through the enemy team, dealing [30,60,120,SP] ${Damage.SPECIAL} on its way`,

  [Ability.GROWL]: `Apply ${Status.WOUND} status on the entire enemy team for [3,6,9] seconds`,

  [Ability.RELIC_SONG]: `Put ${Status.SLEEP} the whole enemy team for [2,SP=0.5] seconds`,

  [Ability.DISARMING_VOICE]: `Gives [10,20,40,SP=0.5] ${Stat.MANA} to all allies except the caster`,

  [Ability.HIGH_JUMP_KICK]: `Deals [50,100,200,SP] ${Damage.SPECIAL} and steal all ${Stat.MANA} from its target`,

  [Ability.GRASS_WHISTLE]: `Put ${Status.SLEEP} [1,2,4] enemies for 2 seconds`,

  [Ability.TRI_ATTACK]: `Deals [25,50,100,SP] special damage. ${Status.BURN}, ${Status.FREEZE} and ${Status.WOUND} the target for [2,3,5] seconds`,

  [Ability.ECHO]: `Deals [3,6,9,SP] ${Damage.SPECIAL} to the enemy team, increasing by [3,6,9,SP] every time the pokemon uses its ability`,

  [Ability.PETAL_DANCE]: `Deals [15,30,60,SP] ${Damage.SPECIAL} to [2,4,6] enemies`,

  [Ability.HYPER_VOICE]: `Deals [50,100,200,SP] ${Damage.SPECIAL} on a row and make all targets hit ${Status.CONFUSION} for [1,2,3] seconds`,

  [Ability.SHADOW_CLONE]: `The pokemon creates an identical clone of himself next to his target. This clone inherits from the pokemon items and stats, 80% of its max ${Stat.HP} and [30,SP] ${Stat.SHIELD}`,

  [Ability.VOLT_SWITCH]: `Dash into the enemy backline, dealing [30,60,120,SP] ${Damage.SPECIAL}`,

  [Ability.LIQUIDATION]: `Deals [20,40,80,SP] ${Damage.SPECIAL} and remove [1,2,4] ${Stat.DEF} from the target`,

  [Ability.BURN]: `${Status.BURN} the whole enemy team for [5,10,20] seconds`,

  [Ability.POISON]: `Apply ${Status.POISON} to [1,2,3] closest opponents for [3,6,9,SP=0.5] seconds`,

  [Ability.SLEEP]: `Put ${Status.SLEEP} 2 enemies in the back lines for [1.5,3,4.5] seconds`,

  [Ability.SILENCE]: `${Status.SILENCE} the whole enemy team for [2,4,8] seconds`,

  [Ability.PROTECT]: `${Status.PROTECT} the user, becoming invulnerable for [5,SP=0.5] seconds.`,

  [Ability.FREEZE]: `${Status.FREEZE} the whole enemy team for [1,2,3] seconds`,

  [Ability.CONFUSION]: `Makes the target ${Status.CONFUSION} for [3,5,7] seconds. If the target is already ${Status.CONFUSION}, deals [75,150,300,SP] ${Damage.SPECIAL} instead`,

  [Ability.FIRE_BLAST]: `Throw a fire blast for [30,60,120,SP] ${Damage.SPECIAL}`,

  [Ability.WHEEL_OF_FIRE]: `Sends a fire wheel that makes a round trip doing [20,40,80,SP] ${Damage.SPECIAL}`,

  [Ability.SEISMIC_TOSS]: `Mono target attack that deals [7,14,28,SP] ${Damage.TRUE} multiplied by the number of Pokemon in your team`,

  [Ability.GUILLOTINE]: `Mono target attack that deals [1,2,3,SP] x ${Stat.ATK} ${Damage.SPECIAL}. Restores half ${Stat.MANA} if target is KO`,

  [Ability.ROCK_SLIDE]: `Mono target attack that deals [30,60,120,SP] ${Damage.SPECIAL}. Doubles damage if target is type flying.`,

  [Ability.HEAT_WAVE]: `Area of effect attack that deals [20,40,80,SP] ${Damage.SPECIAL} to all enemies in a line behind the target.`,

  [Ability.THUNDER]: `Mono target damage that deals [30,60,120,SP] ${Damage.SPECIAL}.`,

  [Ability.HYDRO_PUMP]: `Area of effect attack that deals [25,50,100,SP] ${Damage.SPECIAL} to all enemies in a line behind the target.`,

  [Ability.DRACO_METEOR]: `Area of effect attack that deals [50,SP] ${Damage.SPECIAL} to all enemies`,

  [Ability.BLAZE_KICK]: `Mono target that deals [30,60,120,SP] ${Damage.SPECIAL}.`,

  [Ability.WISH]: `Restores [50,SP] ${Stat.HP} to [1,2,3] ally pokemon`,

  [Ability.CALM_MIND]: `Buff pokemon ${Stat.ATK} by [100,SP]%`,

  [Ability.IRON_DEFENSE]: `Buff ${Stat.DEF} and ${Stat.SPE_DEF} by [3,6,12,SP] points`,

  [Ability.METRONOME]: `Shoot a random capacity`,

  [Ability.SOAK]: `Deals [20,40,80,SP] ${Damage.SPECIAL} and restores 10 ${Stat.MANA} to friendly pokemons`,

  [Ability.ORIGIN_PULSE]: `A wave travels horizontally across the battlefield doing [120,SP] ${Damage.SPECIAL}`,

  [Ability.SEED_FLARE]: `Shaymins body emits a shock wave, dealing [30,SP] ${Damage.SPECIAL} to all enemies, and decreasing their ${Stat.SPE_DEF} by 2`,

  [Ability.IRON_TAIL]: `Mono target damage attack that deals [20,40,80,SP] ${Damage.SPECIAL}. Buff ${Stat.DEF} by [1,3,5] points`,
  [Ability.BLAST_BURN]: `Area of effect attack that deals [30,60,120,SP] ${Damage.SPECIAL}`,

  [Ability.CHARGE]: `Buff all electric ally pokemons ${Stat.ATK} by [20,SP] %`,

  [Ability.DISCHARGE]: `Shock nearby enemies for [25,50,75,SP] ${Damage.SPECIAL} and make them ${Status.PARALYSIS} for 5 seconds`,

  [Ability.BITE]: `Deals [40,80,120,SP] ${Damage.SPECIAL} damage to the target and heals for 30% of the damage`,
  [Ability.DRAGON_TAIL]: `Mono target attack that deals [30,60,120,SP] ${Damage.SPECIAL} and buff ${Stat.DEF} and ${Stat.SPE_DEF} by [1,2,3,SP]`,
  [Ability.DRAGON_BREATH]: `Area of effect attack that deals [30,60,120,SP] ${Damage.TRUE} in a line behind the target`,

  [Ability.ICICLE_CRASH]: `Area of effect attack that deals [20,40,80,SP] ${Damage.SPECIAL} around the target`,

  [Ability.ROOT]: `Heal all nearby ally pokemons by [20,40,80,SP] ${Stat.HP}`,

  [Ability.TORMENT]: `Increase ${Stat.ATK_SPEED} by [20,40,60,SP] %`,

  [Ability.STOMP]: `Mono target that deals [3,4,5,SP] x ${Stat.ATK} ${Damage.SPECIAL}`,
  [Ability.PAYBACK]: `Life drain target attack that deals [20,40,80,SP] ${Damage.SPECIAL}`,

  [Ability.NIGHT_SLASH]: `Mono-target attack that does [40,60,100,SP] ${Damage.SPECIAL}. Decreases the ${Stat.DEF} of all enemies by 1 point`,

  [Ability.BUG_BUZZ]: `Mono target attack that does [20,40,80,SP] ${Damage.SPECIAL}. Double damage if target is ${Status.PARALYSIS}`,

  [Ability.STRING_SHOT]: `Mono target attack that does [10,20,50,SP] ${Damage.SPECIAL} and make ${Status.PARALYSIS} for 5 seconds`,

  [Ability.VENOSHOCK]: `Mono target damage that deals [30,60,120,SP] ${Damage.SPECIAL}. Doubles damage if target is ${Status.POISON}`,

  [Ability.LEECH_LIFE]: `Area of effect life steal attack that deals [15,30,60,SP] ${Damage.SPECIAL}`,
  [Ability.HAPPY_HOUR]: `Buff all ally ${Stat.ATK} by [2,5,8,SP] points`,

  [Ability.TELEPORT]: `Teleport the pokemon on one edge of the map. Next attack deals [15,30,60,SP] ${Damage.SPECIAL}`,

  [Ability.NASTY_PLOT]: `Buff pokemon ${Stat.ATK} by [10,SP] points`,

  [Ability.THIEF]: `Steals all the target's items the holder can carry and deals [15,30,60,SP] ${Damage.SPECIAL}`,
  [Ability.STUN_SPORE]: `Decrease target ${Stat.ATK_SPEED} by [10,20,40] % and deals [5,10,20,SP] ${Damage.SPECIAL}`,
  [Ability.METEOR_MASH]: `Area of effect around the target that deals [30,50,70,SP] ${Damage.SPECIAL}. Buff pokemon ${Stat.ATK} by [5,SP].`,
  [Ability.HURRICANE]: `Area of effect attack that deals [25,50,100,SP] ${Damage.SPECIAL} in a line behind the target and make ${Status.PARALYSIS} for 4 seconds`,

  [Ability.HEAL_BLOCK]: `Apply ${Status.WOUND} to all adjacent enemies for [5,10,15] seconds`,

  [Ability.ROAR_OF_TIME]: `Give ${Status.RESURECTION} to the pokemon that has the most items in your team.`,

  [Ability.ROCK_TOMB]: `Mono target attack that deals [30,60,120,SP] ${Damage.SPECIAL} and decrease target ${Stat.ATK_SPEED} by [10,20,40] %`,

  [Ability.ROCK_SMASH]: `Mono target attack that deals [20,40,80,SP] ${Damage.SPECIAL} and ${Status.SILENCE} target for [3,6,9] seconds`,

  [Ability.HEAD_SMASH]: `The pokemon hurts itself for [5,10,15,SP] ${Stat.HP} and deals [40,80,150,SP] ${Damage.SPECIAL}. Execute if the target is ${Status.SLEEP} or ${Status.FREEZE}`,

  CORRUPTED_NATURE: `${Status.WOUND} adjacent enemies for 5 seconds and deals [20,40,80,SP] life steal ${Damage.SPECIAL}`,
  CRABHAMMER: `Deals [40,80,120,SP] ${Damage.SPECIAL}. High chance of crit. Execute the target if below 30%`,

  DIAMOND_STORM: `Deals [200,SP]% of current ${Stat.DEF} as special damage to surrounding enemies`,

  DRACO_ENERGY: `Deals [100,SP] % of regidraco ${Stat.HP} as ${Damage.SPECIAL}`,

  DYNAMAX_CANNON: `Shoot a dynamax beam on a straight line, dealing to every pokemon hit [80,SP] % of their ${Stat.HP} as ${Damage.SPECIAL}`,

  DYNAMIC_PUNCH: `Deals [20,40,80,SP] ${Damage.SPECIAL} and make the target ${Status.CONFUSION} for [1.5,3,6] seconds`,

  ELECTRO_BOOST: `All electric allies receive ${Status.RUNE_PROTECT} and are immune to special damage and status alterations for 5s`,

  ELECTRO_WEB: `Steal [15,30,60] % of adjacent enemies ${Stat.ATK_SPEED}`,

  FIRE_TRICK: `Deals [20,40,80,SP] ${Damage.SPECIAL} and teleports the target to a corner of the map`,

  FLAME_CHARGE: `Dash into the enemy backline, dealing [30,60,120,SP] ${Damage.SPECIAL}`,

  LEECH_SEED: `${Status.POISON} the target for [3,6,12] seconds, healing for [20,40,80,SP] ${Stat.HP}`,

  LOCK_ON: `Lock the target and give it ${Status.ARMOR_REDUCTION} for 8s. Genesect now deals ${Damage.TRUE} to it`,

  PSYCH_UP: `Deal [10,20,40,SP] ${Damage.SPECIAL} and ${Status.SILENCE} the target and its adjacent enemies`,

  RAZOR_WIND: `Deals [20,40,80,SP] ${Damage.SPECIAL} to the target and make surounding enemies ${Status.PARALYSIS}`,

  TWISTING_NETHER: `Deals [80,SP] ${Damage.SPECIAL} to adjacent enemies. Every pokemon hit is teleported somewhere.`,

  WONDER_GUARD: `Deals [30,60,120,SP] ${Damage.SPECIAL} and make all adjacent enemies ${Status.PARALYSIS} for [5,SP] seconds`,

  ELECTRIC_SURGE: `Increase ${Stat.ATK_SPEED} of all Electric pokemons by [10,SP]%`,

  PSYCHIC_SURGE: `Increase ${Stat.AP} of all Psychic pokemons by [5,SP]%, except the caster`,

  MIND_BLOWN: `Deals [50,SP] % of target current ${Stat.HP} as ${Damage.SPECIAL}`,

  PAYDAY: `Deals [30,60,120,SP] ${Damage.SPECIAL}. If the target is KO, the player receive [1,2,3] gold`,

  BEAT_UP: `Summon [1,2,3] Houndour (no items)`,

  [Ability.BLUE_FLARE]: `Inflicts [50,SP] ${Damage.SPECIAL} + 20 per stage of fire synergy`,

  [Ability.FUSION_BOLT]: `Inflicts [50,SP] ${Damage.SPECIAL} + 40 per stage of electric synergy`,

  [Ability.AURORA_VEIL]: `All allies receive ${Status.RUNE_PROTECT} and are immune to special damage and status alterations for [1.5,2.5,3.5] seconds`,

  [Ability.AQUA_JET]: `Dash into the enemy backline, dealing [30,60,120,SP] ${Damage.SPECIAL}`,

  [Ability.JUDGEMENT]: `Inflicts [10,SP] special damage to the target, multiplied by the sum of Arceus synergy levels`,

  [Ability.CHATTER]: `Deal [10,SP] ${Damage.SPECIAL} to all enemies. Every enemy has [30,SP]% chance to be ${Status.CONFUSION} for 1 second`,

  [Ability.STEAM_ERUPTION]: `Deals [80,SP] ${Damage.SPECIAL} to the target and all enemies adjacent, and ${Status.BURN} them for 3 seconds`,

  [Ability.APPLE_ACID]: `Deals [30,60,120,SP] ${Damage.SPECIAL} to the target, and lower its ${Stat.SPE_DEF} by 3 points`,

  [Ability.SACRED_SWORD]: `Deals [90,SP] ${Damage.TRUE} to the target`,

  [Ability.SHADOW_BALL]: `Deals [45,90,180,SP] ${Damage.SPECIAL} and burn 15 ${Stat.MANA} to the target and adjacent enemies`,

  [Ability.DIVE]: `Dives underwater and reappears in the middle of the enemy team, dealing [15,30,60,SP] ${Damage.SPECIAL} and ${Status.FREEZE} all adjacent units for 1.5 second`,

  [Ability.SPIKE_ARMOR]: `For [3,5,10] seconds, targets that melee attack this Pokémon receive ${Status.WOUND} and take ${Damage.SPECIAL} equal to [100,SP]% of current ${Stat.DEF}`,

  [Ability.FUTURE_SIGHT]: `Deals [15,30,60,SP] ${Damage.SPECIAL} to 5 enemies`,

  [Ability.FAKE_TEARS]: `Deals [3,6,9,SP] ${Damage.SPECIAL} to the whole enemy team and trigger ${Status.ARMOR_REDUCTION} for 3s`,

  [Ability.SPARKLING_ARIA]: `Deals [15,30,60,SP] ${Damage.SPECIAL} to the target and adjacent enemies. If adjacent allies are ${Status.BURN}, the burn is healed.`,

  [Ability.DRAGON_DARTS]: `Throws 3 darts that deals [10,25,50,SP] ${Damage.SPECIAL} each to the target. If the target dies, regain 40 ${Stat.MANA}.`,

  [Ability.GRASSY_SURGE]: `Increase ${Stat.ATK} of all Grass pokemons by [5,SP]`,

  [Ability.MISTY_SURGE]: `Increase ${Stat.SPE_DEF} of all Fairy pokemons by [5,SP]`,

  [Ability.SKY_ATTACK]: `Rises in the air and fall on the farthest target, ${Status.PROTECT} the attacker for .5 second and deals [120,SP] ${Damage.SPECIAL}`,

  [Ability.ILLUSION]: `User recovers [30,50,70,SP=0.5] ${Stat.HP} points and copies the form as well as the ${Stat.ATK}, ${Stat.DEF}, ${Stat.SPE_DEF}, and ${Stat.RANGE} of the targeted Pokemon`,

  [Ability.SMOG]: `Buff ${Stat.DEF} by [1,2,4,SP] and poison adjacent enemies for 3s`,

  [Ability.AURORA_BEAM]: `Fires a beam in a line. All targets hit take [30,60,120,SP] ${Damage.SPECIAL} and can be ${Status.FREEZE} (chance based on current ice synergy)`,

  [Ability.AGILITY]: `Increase ${Stat.ATK_SPEED} by [10,20,30,SP] % (stacks)`,

  [Ability.SPIRIT_SHACKLE]: `Shoots a Piercing Arrow that deals [30,60,90,SP] ${Damage.SPECIAL} in a line behind the target and applies ${Status.WOUND} for 4 seconds to everyone hit`,

  [Ability.WATER_SHURIKEN]: `Throws 3 shuriken in 3 directions that pass through enemies and inflict [20,40,60,SP] ${Damage.SPECIAL}`,

  [Ability.SHADOW_SNEAK]: `Deals [60,SP] ${Damage.SPECIAL}. If the target is ${Status.SILENCE}, deals ${Damage.TRUE}`,

  [Ability.MACH_PUNCH]: `Deals [50,SP] ${Damage.SPECIAL} and attacks immediately after`,

  [Ability.UPPERCUT]: `Deals [80,SP] ${Damage.SPECIAL}. Double damage if attacker has a better ${Stat.DEF} than target`,

  [Ability.TRIPLE_KICK]: `Deals [50,SP] ${Damage.SPECIAL} to up to 3 adjacent enemies`,

  [Ability.MAWASHI_GERI]: `Deals [80,SP] ${Damage.SPECIAL}. Double damage if attacker has a better ${Stat.ATK} than target`,

  [Ability.FORECAST]: `Gives [10,SP] ${Stat.SHIELD} to your team, plus additional bonus depending on the weather`,
  [Ability.X_SCISSOR]: `Deals [20,40,80,SP] ${Damage.TRUE} twice`,

  [Ability.PLASMA_FIST]: `Deals [120, SP] ${Damage.SPECIAL} with 25% lifesteal`,

  [Ability.SPECTRAL_THIEF]: `Disappears and reappears dealing [50, SP] ${Damage.SPECIAL}, stealing all the statistic boost of the target`,

  [Ability.GEOMANCY]: `Gain [15,SP] ${Stat.ATK}, [5,SP] ${Stat.SPE_DEF} and 30% ${Stat.ATK_SPEED}`,

  [Ability.DEATH_WING]: `Deals [150,SP] ${Damage.SPECIAL} and heals for 75% of the damage taken by the target`,

  [Ability.SLACK_OFF]: `Clear all negative status, heal [30,40,50,SP=0.5] % of max ${Stat.HP} and put the caster ${Status.SLEEP} for 5 seconds`,

  [Ability.DARK_VOID]: `Deals [30, SP] ${Damage.SPECIAL} to all enemies. If any affected target was ${Status.SILENCE}, they are put ${Status.SLEEP} for 2 seconds`,

  [Ability.OVERHEAT]: `Deals [30, SP] ${Damage.SPECIAL} to all enemies. Double damage if target is ${Status.BURN}`,

  [Ability.HYPNOSIS]: `Put ${Status.SLEEP} 1 enemy in the back lines for [2,3.5,6,SP=0.5] seconds`,

  [Ability.MIMIC]: `Copies the ability of the current target`,

  [Ability.HEX]: `Deals [20,40,80,SP] ${Damage.SPECIAL} to the target. Doubles damage if target is ${Status.BURN}, ${Status.CONFUSION}, ${Status.FREEZE}, ${Status.PARALYSIS}, ${Status.POISON}, ${Status.SILENCE}, ${Status.SLEEP} or ${Status.WOUND}`,

  [Ability.GROWTH]: `Increase body size and ${Stat.ATK} by [10,SP]. Grows twice as fast if weather is sunny`,

  [Ability.HEAL_ORDER]: `Deals [25,45,65,SP] ${Damage.SPECIAL} to adjacent enemies and heal [25,45,65,SP] to adjacent allies`,

  [Ability.SHELL_TRAP]: `${Status.SILENCE} target for 3 seconds and removes 40 ${Stat.MANA} from target and enemies around it`,

  [Ability.DIG]: `Digs underground and reappears next to the farthest enemy, dealing [10,20,40,SP] special damage to all enemies on the way`,

  [Ability.FIRE_SPIN]: `Area of effect attack that deals [20,40,100,SP] ${Damage.SPECIAL} around the target and ${Status.BURN} all enemies hit for 3 seconds`,

  [Ability.SEARING_SHOT]: `An inferno of scarlet flames torches everything around the user. Deals [30,SP] ${Damage.SPECIAL} and ${Status.BURN} for 3 seconds all enemies within 2 tiles of Victini.`,

  [Ability.SPLASH]: `Just flops and splashes around to no effect at all...`,

  [Ability.PECK]: `Deals [10,20,30,SP] ${Damage.SPECIAL} to the target`,

  [Ability.COUNTER]: `Pokemon lashes out at adjacent enemies dealing ${Damage.SPECIAL} equal its missing ${Stat.HP} (Scale with ${Stat.AP})`,

  [Ability.COSMIC_POWER]: `Buff adjacent pokemons ${Stat.AP} by [10,20,30]`,

  [Ability.STICKY_WEB]: `Deals [10,20,40,SP] ${Damage.SPECIAL} and ${Status.PARALYSIS} the target and adjacent enemies for 4 seconds`,

  [Ability.SILVER_WIND]: `Dash into the enemy backline, dealing [30,60,120,SP] ${Damage.SPECIAL} to every enemy on the path. Then gain 1 ${Stat.ATK}, 1 ${Stat.DEF}, 1 ${Stat.SPE_DEF}, 10% ${Stat.AP} and 10% ${Stat.ATK_SPEED}`,

  [Ability.POISON_POWDER]: `Dash into the enemy backline, dealing [30,60,120,SP] and applying ${Status.POISON} for 5 seconds to every enemy on the path`,

  [Ability.ICY_WIND]: `Deals [30,60,120,SP] ${Damage.SPECIAL} and decrease target ${Stat.ATK_SPEED} by [10,20,40]%`,

  [Ability.GIGATON_HAMMER]: `Deals [100,200,400,SP] ${Damage.SPECIAL} but ${Status.SILENCE} itself for 6 seconds`,

  [Ability.ACROBATICS]: `Deals [20,40,80,SP] ${Damage.SPECIAL}. Double damage if caster has no held items.`,

  [Ability.ABSORB]: `Deals [30,60,120,SP] ${Damage.SPECIAL} and heals [3,6,12,SP] to adjacent allies`,

  [Ability.ROLLOUT]: `Buff the ${Stat.DEF} by [5,SP] and deals 6x the ${Stat.DEF} as ${Damage.SPECIAL}`,

  [Ability.THRASH]: `Buff ${Stat.ATK} by 110% and become ${Status.CONFUSION} for 3s`,

  [Ability.SOLAR_BEAM]: `Deals [30,60,120,SP] ${Damage.SPECIAL} in a straight line behind the target. If the weather is sunny, targets are ${Status.BURN} for 3s and restores 40 ${Stat.MANA}`,

  [Ability.MAGMA_STORM]: `The target becomes trapped within a maelstrom of fire that deals [80,SP] ${Damage.SPECIAL} before moving to an adjacent target`,

  [Ability.SLASHING_CLAW]: `Deals [15,30,60,SP] to the target and ${Status.WOUND} it for 5 seconds. If the target is already ${Status.WOUND}, deals 30% bonus ${Damage.SPECIAL}`,

  [Ability.ERUPTION]: `Fires [20,30,40] projectiles in the air. Every projectile deals [30,60,120,SP] ${Damage.SPECIAL} and ${Status.BURN} for 5 seconds`,

  [Ability.LUSTER_PURGE]: `Launches a ball of light in a straight line that deals [25,SP] ${Damage.SPECIAL} twice and lowers twice the ${Stat.SPE_DEF} of all enemies hit by 1`,

  [Ability.MIST_BALL]: `Launches a mist bubble in a straight line that deals [25,SP] ${Damage.SPECIAL} twice and lowers twice the ${Stat.AP} of all enemies hit by 10%`,

  [Ability.MUD_BUBBLE]: `Heals the caster for [10,20,40,SP]`,

  [Ability.LINK_CABLE]: `Dash into a new spot, then triggers an electric arc between Plusle and Minun that deals [50,SP] ${Damage.SPECIAL}. If Plusle or Minun are alone, deals this damage to adjacent enemies instead.`,

  [Ability.MAGIC_BOUNCE]: `For [3,6,12] seconds, whenever this pokemon is hit by an ability, the caster is ${Status.SILENCE} for 4 seconds and take ${Damage.SPECIAL} equal to this pokemon current ${Stat.SPE_DEF}`,

  [Ability.HIDDEN_POWER_A]: `Spawn 4 Abra at every corner of the board`,

  [Ability.HIDDEN_POWER_B]: `Burn the opponent team for 30 seconds`,

  [Ability.HIDDEN_POWER_C]: `Give Amulet Coin to your whole team. The item is removed at the end of the fight.`,

  [Ability.HIDDEN_POWER_D]: `Get a Ditto on your bench`,

  [Ability.HIDDEN_POWER_E]: `Get a Pokemon Egg on your bench. It hatches in the next stage`,

  [Ability.HIDDEN_POWER_F]: `Fish 2 random ${Synergy.WATER} Pokemon at max fishing level`,

  [Ability.HIDDEN_POWER_G]: `Gain 5 Gold`,

  [Ability.HIDDEN_POWER_H]: `Heal your team to Max ${Stat.HP}`,

  [Ability.HIDDEN_POWER_I]: `Get a random item component`,

  [Ability.HIDDEN_POWER_J]: `Spawn 2 Sharpedo with Razor Claws`,

  [Ability.HIDDEN_POWER_K]: `Spawn Hitmonlee with a Red Orb and max ${Stat.MANA}`,

  [Ability.HIDDEN_POWER_L]: `Give Max Revive to your whole team. The item is removed at the end of the fight.`,

  [Ability.HIDDEN_POWER_M]: `Your whole team gets max ${Stat.MANA}`,

  [Ability.HIDDEN_POWER_N]: `Your whole team cast 
    $t(EXPLOSION)`,
  [Ability.HIDDEN_POWER_O]: `Give Oran Berry to your whole team. The item is removed at the end of the fight.`,

  [Ability.HIDDEN_POWER_P]: `Spawn 5 random ${Synergy.BUG} pokemon at their first stage of evolution`,

  [Ability.HIDDEN_POWER_Q]: `Immediately ends the fight with a draw`,

  [Ability.HIDDEN_POWER_R]: `Spawn Geodude, Graveler and Golem with Rocky Helmets`,

  [Ability.HIDDEN_POWER_S]: `${Status.FREEZE} the opponent team for 4 seconds`,

  [Ability.HIDDEN_POWER_T]: `Spawn Tapu-Lele with Choice Specs and max ${Stat.MANA}`,

  [Ability.HIDDEN_POWER_U]: `Spawn Uxie with Aqua Egg and max ${Stat.MANA}`,

  [Ability.HIDDEN_POWER_V]: `Cast $t(THUNDER) on all the enemy team`,

  [Ability.HIDDEN_POWER_W]: `Get a high rarity pokemon matching your top synergy`,

  [Ability.HIDDEN_POWER_X]: `Gives XRay Vision to your whole team. The item is removed at the end of the fight.`,

  [Ability.HIDDEN_POWER_Y]: `Spawn 2 Meditite with a Soul Dew`,

  [Ability.HIDDEN_POWER_Z]: `Put the enemy team ${Status.SLEEP} for 5 seconds`,

  [Ability.HIDDEN_POWER_QM]: `Get 4 random Unown on your bench`,

  [Ability.HIDDEN_POWER_EM]: `Spawn 4 random Unown at every corner of the board`
}
