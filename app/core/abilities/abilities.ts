import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  DEFAULT_SPEED,
  getBaseAltForm,
  MaxTroopersPerPkm
} from "../../config"
import { giveRandomEgg } from "../../core/eggs"
import { PokemonClasses } from "../../models/colyseus-models/pokemon"
import PokemonFactory from "../../models/pokemon-factory"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../models/precomputed/precomputed-rarity"
import { IStatus, Transfer } from "../../types"
import {
  ABSORB_ABILITY_PARAMS,
  ACCELEROCK_ABILITY_PARAMS,
  ACID_ARMOR_ABILITY_PARAMS,
  ACID_SPRAY_ABILITY_PARAMS,
  ACROBATICS_ABILITY_PARAMS,
  AERIAL_ACE_ABILITY_PARAMS,
  AFTER_YOU_ABILITY_PARAMS,
  AGILITY_ABILITY_PARAMS,
  AIR_SLASH_ABILITY_PARAMS,
  ANCHOR_SHOT_ABILITY_PARAMS,
  ANCIENT_POWER_ABILITY_PARAMS,
  APPLE_ACID_ABILITY_PARAMS,
  AQUA_JET_ABILITY_PARAMS,
  AQUA_RING_ABILITY_PARAMS,
  AQUA_TAIL_ABILITY_PARAMS,
  ARM_THRUST_ABILITY_PARAMS,
  ARMOR_CANNON_ABILITY_PARAMS,
  AROMATHERAPY_ABILITY_PARAMS,
  ASSURANCE_ABILITY_PARAMS,
  ASTRAL_BARRAGE_ABILITY_PARAMS,
  ATTRACT_ABILITY_PARAMS,
  AURA_WHEEL_ABILITY_PARAMS,
  AURASPHERE_ABILITY_PARAMS,
  AURORA_BEAM_ABILITY_PARAMS,
  AURORA_VEIL_ABILITY_PARAMS,
  AXE_KICK_ABILITY_PARAMS,
  BANEFUL_BUNKER_ABILITY_PARAMS,
  BARB_BARRAGE_ABILITY_PARAMS,
  BARED_FANGS_ABILITY_PARAMS,
  BEAT_UP_ABILITY_PARAMS,
  BEHEMOTH_BLADE_ABILITY_PARAMS,
  BIDE_ABILITY_PARAMS,
  BITE_ABILITY_PARAMS,
  BITTER_BLADE_ABILITY_PARAMS,
  BLAST_BURN_ABILITY_PARAMS,
  BLAZE_KICK_ABILITY_PARAMS,
  BLEAKWIND_STORM_ABILITY_PARAMS,
  BLIZZARD_ABILITY_PARAMS,
  BLOOD_MOON_ABILITY_PARAMS,
  BLUE_FLARE_ABILITY_PARAMS,
  BODY_SLAM_ABILITY_PARAMS,
  BOLT_BEAK_ABILITY_PARAMS,
  BONE_ARMOR_ABILITY_PARAMS,
  BONEMERANG_ABILITY_PARAMS,
  BOOMBURST_ABILITY_PARAMS,
  BOUNCE_ABILITY_PARAMS,
  BRAVE_BIRD_ABILITY_PARAMS,
  BRICK_BREAK_ABILITY_PARAMS,
  BUG_BUZZ_ABILITY_PARAMS,
  BULK_UP_ABILITY_PARAMS,
  BULLDOZE_ABILITY_PARAMS,
  BULLET_PUNCH_ABILITY_PARAMS,
  BURN_UP_ABILITY_PARAMS,
  BURNING_JEALOUSY_ABILITY_PARAMS,
  CAVERNOUS_CHOMP_ABILITY_PARAMS,
  CEASELESS_EDGE_ABILITY_PARAMS,
  CHAIN_CRAZED_ABILITY_PARAMS,
  CHARGE_BEAM_ABILITY_PARAMS,
  CHARM_ABILITY_PARAMS,
  CHATTER_ABILITY_PARAMS,
  CHLOROBLAST_ABILITY_PARAMS,
  CITY_SHUTTLE_ABILITY_PARAMS,
  CLANGOROUS_SOUL_ABILITY_PARAMS,
  CLOSE_COMBAT_ABILITY_PARAMS,
  COLUMN_CRUSH_ABILITY_PARAMS,
  CONFUSING_MIND_ABILITY_PARAMS,
  CONFUSION_ABILITY_PARAMS,
  CORE_ENFORCER_ABILITY_PARAMS,
  COSMIC_POWER_MOON_ABILITY_PARAMS,
  COSMIC_POWER_SUN_ABILITY_PARAMS,
  COTTON_GUARD_ABILITY_PARAMS,
  COTTON_SPORE_ABILITY_PARAMS,
  COUNTER_ABILITY_PARAMS,
  CRAB_HAMMER_ABILITY_PARAMS,
  CROSS_POISON_ABILITY_PARAMS,
  CRUNCH_ABILITY_PARAMS,
  CRUSH_CLAW_ABILITY_PARAMS,
  CRUSH_GRIP_ABILITY_PARAMS,
  CURSE_ABILITY_PARAMS,
  CUT_ABILITY_PARAMS,
  DARK_HARVEST_ABILITY_PARAMS,
  DARK_LARIAT_ABILITY_PARAMS,
  DARK_VOID_ABILITY_PARAMS,
  DEATH_WING_ABILITY_PARAMS,
  DECORATE_ABILITY_PARAMS,
  DEEP_FREEZE_ABILITY_PARAMS,
  DEFENSE_CURL_ABILITY_PARAMS,
  DETECT_ABILITY_PARAMS,
  DIAMOND_STORM_ABILITY_PARAMS,
  DIG_ABILITY_PARAMS,
  DIRE_CLAW_ABILITY_PARAMS,
  DISABLE_ABILITY_PARAMS,
  DISARMING_VOICE_ABILITY_PARAMS,
  DISCHARGE_ABILITY_PARAMS,
  DIVE_ABILITY_PARAMS,
  DIZZY_PUNCH_ABILITY_PARAMS,
  DOOM_DESIRE_ABILITY_PARAMS,
  DOUBLE_EDGE_ABILITY_PARAMS,
  DOUBLE_IRON_BASH_ABILITY_PARAMS,
  DOUBLE_SHOCK_ABILITY_PARAMS,
  DRACO_METEOR_ABILITY_PARAMS,
  DRAGON_BREATH_ABILITY_PARAMS,
  DRAGON_CLAW_ABILITY_PARAMS,
  DRAGON_DARTS_ABILITY_PARAMS,
  DRAGON_PULSE_ABILITY_PARAMS,
  DRAGON_TAIL_ABILITY_PARAMS,
  DRAIN_PUNCH_ABILITY_PARAMS,
  DREAM_EATER_ABILITY_PARAMS,
  DRILL_PECK_ABILITY_PARAMS,
  DRILL_RUN_ABILITY_PARAMS,
  DRUM_BEATING_ABILITY_PARAMS,
  DYNAMAX_CANNON_ABILITY_PARAMS,
  DYNAMIC_PUNCH_ABILITY_PARAMS,
  EAR_DIG_ABILITY_PARAMS,
  ECHO_ABILITY_PARAMS,
  EERIE_SPELL_ABILITY_PARAMS,
  EGG_BOMB_ABILITY_PARAMS,
  ELECTRIC_SURGE_ABILITY_PARAMS,
  ELECTRIFY_ABILITY_PARAMS,
  ELECTRO_BALL_ABILITY_PARAMS,
  ELECTRO_BOOST_ABILITY_PARAMS,
  ELECTRO_SHOT_ABILITY_PARAMS,
  ELECTRO_WEB_ABILITY_PARAMS,
  ENTANGLING_THREAD_ABILITY_PARAMS,
  ENTRAINMENT_ABILITY_PARAMS,
  ERUPTION_ABILITY_PARAMS,
  EXPANDING_FORCE_ABILITY_PARAMS,
  EXPLOSION_ABILITY_PARAMS,
  EXTREME_SPEED_ABILITY_PARAMS,
  FACADE_ABILITY_PARAMS,
  FAIRY_LOCK_ABILITY_PARAMS,
  FAIRY_WIND_ABILITY_PARAMS,
  FAKE_OUT_ABILITY_PARAMS,
  FAKE_TEARS_ABILITY_PARAMS,
  FEATHER_DANCE_ABILITY_PARAMS,
  FELL_STINGER_ABILITY_PARAMS,
  FICKLE_BEAM_ABILITY_PARAMS,
  FIERY_DANCE_ABILITY_PARAMS,
  FIERY_WRATH_ABILITY_PARAMS,
  FILLET_AWAY_ABILITY_PARAMS,
  FIRE_BLAST_ABILITY_PARAMS,
  FIRE_FANG_ABILITY_PARAMS,
  FIRE_LASH_ABILITY_PARAMS,
  FIRE_SPIN_ABILITY_PARAMS,
  FIRESTARTER_ABILITY_PARAMS,
  FIRST_IMPRESSION_ABILITY_PARAMS,
  FISHIOUS_REND_ABILITY_PARAMS,
  FISSURE_ABILITY_PARAMS,
  FLAME_CHARGE_ABILITY_PARAMS,
  FLAMETHROWER_ABILITY_PARAMS,
  FLASH_ABILITY_PARAMS,
  FLEUR_CANNON_ABILITY_PARAMS,
  FLOWER_TRICK_ABILITY_PARAMS,
  FLY_ABILITY_PARAMS,
  FLYING_PRESS_ABILITY_PARAMS,
  FOCUS_PUNCH_ABILITY_PARAMS,
  FOLLOW_ME_ABILITY_PARAMS,
  FORCE_PALM_ABILITY_PARAMS,
  FORECAST_ABILITY_PARAMS,
  FOUL_PLAY_ABILITY_PARAMS,
  FREEZE_DRY_ABILITY_PARAMS,
  FREEZING_GLARE_ABILITY_PARAMS,
  FROST_BREATH_ABILITY_PARAMS,
  FURY_SWIPES_ABILITY_PARAMS,
  FUSION_BOLT_ABILITY_PARAMS,
  FUTURE_SIGHT_ABILITY_PARAMS,
  GEAR_GRIND_ABILITY_PARAMS,
  GEOMANCY_ABILITY_PARAMS,
  GIGATON_HAMMER_ABILITY_PARAMS,
  GLACIAL_LANCE_ABILITY_PARAMS,
  GLACIATE_ABILITY_PARAMS,
  GLAIVE_RUSH_ABILITY_PARAMS,
  GOLD_RUSH_ABILITY_PARAMS,
  GRASS_WHISTLE_ABILITY_PARAMS,
  GRASSY_SURGE_ABILITY_PARAMS,
  GRAV_APPLE_ABILITY_PARAMS,
  GRAVITY_ABILITY_PARAMS,
  GROWL_ABILITY_PARAMS,
  GROWTH_ABILITY_PARAMS,
  GRUDGE_ABILITY_PARAMS,
  GRUDGE_DIVE_ABILITY_PARAMS,
  GUILLOTINE_ABILITY_PARAMS,
  GULP_MISSILE_ABILITY_PARAMS,
  GUNK_SHOT_ABILITY_PARAMS,
  HAIL_ABILITY_PARAMS,
  HAPPY_HOUR_ABILITY_PARAMS,
  HARDEN_ABILITY_PARAMS,
  HEAD_SMASH_ABILITY_PARAMS,
  HEADBUTT_ABILITY_PARAMS,
  HEADLONG_RUSH_ABILITY_PARAMS,
  HEAL_BLOCK_ABILITY_PARAMS,
  HEAL_ORDER_ABILITY_PARAMS,
  HEART_SWAP_ABILITY_PARAMS,
  HEAT_CRASH_ABILITY_PARAMS,
  HEAT_WAVE_ABILITY_PARAMS,
  HEAVY_SLAM_ABILITY_PARAMS,
  HELPING_HAND_ABILITY_PARAMS,
  HEX_ABILITY_PARAMS,
  HIGH_HORSEPOWER_ABILITY_PARAMS,
  HIGH_JUMP_KICK_ABILITY_PARAMS,
  HORN_ATTACK_ABILITY_PARAMS,
  HORN_DRILL_ABILITY_PARAMS,
  HORN_LEECH_ABILITY_PARAMS,
  HURRICANE_ABILITY_PARAMS,
  HYDRO_PUMP_ABILITY_PARAMS,
  HYDRO_STEAM_ABILITY_PARAMS,
  HYPER_BEAM_ABILITY_PARAMS,
  HYPER_DRILL_ABILITY_PARAMS,
  HYPER_VOICE_ABILITY_PARAMS,
  HYPERSPACE_FURY_ABILITY_PARAMS,
  HYPNOSIS_ABILITY_PARAMS,
  ICE_BALL_ABILITY_PARAMS,
  ICE_FANG_ABILITY_PARAMS,
  ICE_HAMMER_ABILITY_PARAMS,
  ICE_SPINNER_ABILITY_PARAMS,
  ICICLE_CRASH_ABILITY_PARAMS,
  ICICLE_MISSILE_ABILITY_PARAMS,
  ICY_WIND_ABILITY_PARAMS,
  ILLUSION_ABILITY_PARAMS,
  INFERNAL_PARADE_ABILITY_PARAMS,
  INFESTATION_ABILITY_PARAMS,
  INGRAIN_ABILITY_PARAMS,
  IRON_DEFENSE_ABILITY_PARAMS,
  IRON_HEAD_ABILITY_PARAMS,
  IRON_TAIL_ABILITY_PARAMS,
  IVY_CUDGEL_ABILITY_PARAMS,
  JAW_LOCK_ABILITY_PARAMS,
  JET_PUNCH_ABILITY_PARAMS,
  JUDGEMENT_ABILITY_PARAMS,
  KING_SHIELD_ABILITY_PARAMS,
  KNOCK_OFF_ABILITY_PARAMS,
  KNOWLEDGE_THIEF_ABILITY_PARAMS,
  KOWTOW_CLEAVE_ABILITY_PARAMS,
  LANDS_WRATH_ABILITY_PARAMS,
  LASER_BLADE_ABILITY_PARAMS,
  LAST_RESPECTS_ABILITY_PARAMS,
  LAVA_PLUME_ABILITY_PARAMS,
  LEAF_BLADE_ABILITY_PARAMS,
  LEECH_LIFE_ABILITY_PARAMS,
  LEECH_SEED_ABILITY_PARAMS,
  LICK_ABILITY_PARAMS,
  LINGERING_AROMA_ABILITY_PARAMS,
  LINK_CABLE_ABILITY_PARAMS,
  LIQUIDATION_ABILITY_PARAMS,
  LOCK_ON_ABILITY_PARAMS,
  LOVELY_KISS_ABILITY_PARAMS,
  LUNAR_BLESSING_ABILITY_PARAMS,
  LUNGE_ABILITY_PARAMS,
  LUSTER_PURGE_ABILITY_PARAMS,
  MACH_PUNCH_ABILITY_PARAMS,
  MAGIC_BOUNCE_ABILITY_PARAMS,
  MAGIC_POWDER_ABILITY_PARAMS,
  MAGICAL_LEAF_ABILITY_PARAMS,
  MAGMA_STORM_ABILITY_PARAMS,
  MAGNET_BOMB_ABILITY_PARAMS,
  MAGNET_PULL_ABILITY_PARAMS,
  MAGNET_RISE_ABILITY_PARAMS,
  MAKE_IT_RAIN_ABILITY_PARAMS,
  MALIGNANT_CHAIN_ABILITY_PARAMS,
  MANTIS_BLADES_ABILITY_PARAMS,
  MAWASHI_GERI_ABILITY_PARAMS,
  MEDITATE_ABILITY_PARAMS,
  MEGA_PUNCH_ABILITY_PARAMS,
  METAL_BURST_ABILITY_PARAMS,
  METAL_CLAW_ABILITY_PARAMS,
  METEOR_MASH_ABILITY_PARAMS,
  METRONOME_ABILITY_PARAMS,
  MIMIC_ABILITY_PARAMS,
  MIND_BEND_ABILITY_PARAMS,
  MIND_BLOWN_ABILITY_PARAMS,
  MIST_BALL_ABILITY_PARAMS,
  MISTY_SURGE_ABILITY_PARAMS,
  MOON_DREAM_ABILITY_PARAMS,
  MOONBLAST_ABILITY_PARAMS,
  MOONGEIST_BEAM_ABILITY_PARAMS,
  MORTAL_SPIN_ABILITY_PARAMS,
  MOUNTAIN_GALE_ABILITY_PARAMS,
  MUD_BUBBLE_ABILITY_PARAMS,
  MUD_SHOT_ABILITY_PARAMS,
  MUDDY_WATER_ABILITY_PARAMS,
  MULTI_ATTACK_ABILITY_PARAMS,
  MYSTICAL_FIRE_ABILITY_PARAMS,
  NASTY_PLOT_ABILITY_PARAMS,
  NATURAL_GIFT_ABILITY_PARAMS,
  NIGHT_SHADE_ABILITY_PARAMS,
  NIGHT_SLASH_ABILITY_PARAMS,
  NIGHTMARE_ABILITY_PARAMS,
  NO_RETREAT_ABILITY_PARAMS,
  NUTRIENTS_ABILITY_PARAMS,
  NUZZLE_ABILITY_PARAMS,
  OBSTRUCT_ABILITY_PARAMS,
  OCTAZOOKA_ABILITY_PARAMS,
  OCTOLOCK_ABILITY_PARAMS,
  ORDER_UP_ABILITY_PARAMS,
  ORIGIN_PULSE_ABILITY_PARAMS,
  OUTRAGE_ABILITY_PARAMS,
  OVERDRIVE_ABILITY_PARAMS,
  OVERHEAT_ABILITY_PARAMS,
  PARABOLIC_CHARGE_ABILITY_PARAMS,
  PASTEL_VEIL_ABILITY_PARAMS,
  PAYDAY_ABILITY_PARAMS,
  PECK_ABILITY_PARAMS,
  PETAL_BLIZZARD_ABILITY_PARAMS,
  PETAL_DANCE_ABILITY_PARAMS,
  PICKUP_ABILITY_PARAMS,
  PLASMA_FISSION_ABILITY_PARAMS,
  PLASMA_FIST_ABILITY_PARAMS,
  PLASMA_FLASH_ABILITY_PARAMS,
  PLASMA_TEMPEST_ABILITY_PARAMS,
  PLAY_ROUGH_ABILITY_PARAMS,
  POISON_GAS_ABILITY_PARAMS,
  POISON_JAB_ABILITY_PARAMS,
  POISON_POWDER_ABILITY_PARAMS,
  POISON_STING_ABILITY_PARAMS,
  POLLEN_PUFF_ABILITY_PARAMS,
  POLTERGEIST_ABILITY_PARAMS,
  POPULATION_BOMB_ABILITY_PARAMS,
  POWDER_ABILITY_PARAMS,
  POWDER_SNOW_ABILITY_PARAMS,
  POWER_HUG_ABILITY_PARAMS,
  POWER_WASH_ABILITY_PARAMS,
  POWER_WHIP_ABILITY_PARAMS,
  PRECIPICE_BLADES_ABILITY_PARAMS,
  PRESENT_ABILITY_PARAMS,
  PRISMATIC_LASER_ABILITY_PARAMS,
  PROTECT_ABILITY_PARAMS,
  PSYBEAM_ABILITY_PARAMS,
  PSYCHIC_ABILITY_PARAMS,
  PSYCHIC_FANGS_ABILITY_PARAMS,
  PSYCHIC_SURGE_ABILITY_PARAMS,
  PSYCHO_BOOST_ABILITY_PARAMS,
  PSYCHO_CUT_ABILITY_PARAMS,
  PSYCHO_SHIFT_ABILITY_PARAMS,
  PSYSHIELD_BASH_ABILITY_PARAMS,
  PSYSHOCK_ABILITY_PARAMS,
  PSYSTRIKE_ABILITY_PARAMS,
  PUMMELING_PAYBACK_ABILITY_PARAMS,
  PURIFY_ABILITY_PARAMS,
  PYRO_BALL_ABILITY_PARAMS,
  QUIVER_DANCE_ABILITY_PARAMS,
  RAGE_ABILITY_PARAMS,
  RAGING_BULL_ABILITY_PARAMS,
  RAPID_SPIN_ABILITY_PARAMS,
  RAZOR_LEAF_ABILITY_PARAMS,
  RAZOR_WIND_ABILITY_PARAMS,
  RECOVER_ABILITY_PARAMS,
  REFLECT_ABILITY_PARAMS,
  RELIC_SONG_ABILITY_PARAMS,
  RETALIATE_ABILITY_PARAMS,
  RETURN_ABILITY_PARAMS,
  ROAR_ABILITY_PARAMS,
  ROAR_OF_TIME_ABILITY_PARAMS,
  ROCK_ARTILLERY_ABILITY_PARAMS,
  ROCK_HEAD_ABILITY_PARAMS,
  ROCK_SLIDE_ABILITY_PARAMS,
  ROCK_SMASH_ABILITY_PARAMS,
  ROCK_TOMB_ABILITY_PARAMS,
  ROCK_WRECKER_ABILITY_PARAMS,
  ROLLOUT_ABILITY_PARAMS,
  ROOST_ABILITY_PARAMS,
  SACRED_SWORD_CAVERN_ABILITY_PARAMS,
  SACRED_SWORD_GRASS_ABILITY_PARAMS,
  SACRED_SWORD_IRON_ABILITY_PARAMS,
  SALT_CURE_ABILITY_PARAMS,
  SAND_SPIT_ABILITY_PARAMS,
  SAND_TOMB_ABILITY_PARAMS,
  SANDSEAR_STORM_ABILITY_PARAMS,
  SCALE_SHOT_ABILITY_PARAMS,
  SCHOOLING_ABILITY_PARAMS,
  SCREECH_ABILITY_PARAMS,
  SEARING_SHOT_ABILITY_PARAMS,
  SECRET_SWORD_ABILITY_PARAMS,
  SEED_FLARE_ABILITY_PARAMS,
  SEISMIC_TOSS_ABILITY_PARAMS,
  SHADOW_BALL_ABILITY_PARAMS,
  SHADOW_BONE_ABILITY_PARAMS,
  SHADOW_CLAW_ABILITY_PARAMS,
  SHADOW_CLONE_ABILITY_PARAMS,
  SHADOW_FORCE_ABILITY_PARAMS,
  SHADOW_SNEAK_ABILITY_PARAMS,
  SHED_TAIL_ABILITY_PARAMS,
  SHEER_COLD_ABILITY_PARAMS,
  SHELL_SIDE_ARM_ABILITY_PARAMS,
  SHELL_SMASH_ABILITY_PARAMS,
  SHELL_TRAP_ABILITY_PARAMS,
  SHELTER_ABILITY_PARAMS,
  SHIELDS_DOWN_ABILITY_PARAMS,
  SHIELDS_UP_ABILITY_PARAMS,
  SHOCKWAVE_ABILITY_PARAMS,
  SHORE_UP_ABILITY_PARAMS,
  SILVER_WIND_ABILITY_PARAMS,
  SING_ABILITY_PARAMS,
  SKETCH_ABILITY_PARAMS,
  SKILL_SWAP_ABILITY_PARAMS,
  SKY_ATTACK_ABILITY_PARAMS,
  SKY_ATTACK_SHADOW_ABILITY_PARAMS,
  SLACK_OFF_ABILITY_PARAMS,
  SLASH_ABILITY_PARAMS,
  SLASHING_CLAW_ABILITY_PARAMS,
  SLUDGE_ABILITY_PARAMS,
  SLUDGE_WAVE_ABILITY_PARAMS,
  SMOG_ABILITY_PARAMS,
  SMOKE_SCREEN_ABILITY_PARAMS,
  SNIPE_SHOT_ABILITY_PARAMS,
  SOAK_ABILITY_PARAMS,
  SOFT_BOILED_ABILITY_PARAMS,
  SOLAR_BEAM_ABILITY_PARAMS,
  SOLAR_BLADE_ABILITY_PARAMS,
  SONG_OF_DESIRE_ABILITY_PARAMS,
  SOUL_TRAP_ABILITY_PARAMS,
  SPACIAL_REND_ABILITY_PARAMS,
  SPARK_ABILITY_PARAMS,
  SPARKLING_ARIA_ABILITY_PARAMS,
  SPECTRAL_THIEF_ABILITY_PARAMS,
  SPICY_EXTRACT_ABILITY_PARAMS,
  SPIKES_ABILITY_PARAMS,
  SPIKY_SHIELD_ABILITY_PARAMS,
  SPIN_OUT_ABILITY_PARAMS,
  SPIRIT_BREAK_ABILITY_PARAMS,
  SPIRIT_SHACKLE_ABILITY_PARAMS,
  SPITE_ABILITY_PARAMS,
  SPRINGTIDE_STORM_ABILITY_PARAMS,
  STATIC_SHOCK_ABILITY_PARAMS,
  STEALTH_ROCKS_ABILITY_PARAMS,
  STEAM_ERUPTION_ABILITY_PARAMS,
  STEAMROLLER_ABILITY_PARAMS,
  STEEL_WING_ABILITY_PARAMS,
  STICKY_WEB_ABILITY_PARAMS,
  STOCKPILE_ABILITY_PARAMS,
  STOMP_ABILITY_PARAMS,
  STONE_AXE_ABILITY_PARAMS,
  STONE_EDGE_ABILITY_PARAMS,
  STORED_POWER_ABILITY_PARAMS,
  STRANGE_STEAM_ABILITY_PARAMS,
  STRENGTH_ABILITY_PARAMS,
  STRING_SHOT_ABILITY_PARAMS,
  STRUGGLE_BUG_ABILITY_PARAMS,
  STUN_SPORE_ABILITY_PARAMS,
  SUCTION_HEAL_ABILITY_PARAMS,
  SUNSTEEL_STRIKE_ABILITY_PARAMS,
  SUPER_FANG_ABILITY_PARAMS,
  SUPER_HEAT_ABILITY_PARAMS,
  SUPERCELL_SLAM_ABILITY_PARAMS,
  SURF_ABILITY_PARAMS,
  SURGING_STRIKES_ABILITY_PARAMS,
  SWAGGER_ABILITY_PARAMS,
  SWALLOW_ABILITY_PARAMS,
  SWEET_SCENT_ABILITY_PARAMS,
  SYRUP_BOMB_ABILITY_PARAMS,
  TACKLE_ABILITY_PARAMS,
  TAIL_GLOW_ABILITY_PARAMS,
  TAIL_WHIP_ABILITY_PARAMS,
  TAILWIND_ABILITY_PARAMS,
  TAKE_HEART_ABILITY_PARAMS,
  TAUNT_ABILITY_PARAMS,
  TEA_TIME_ABILITY_PARAMS,
  TEETER_DANCE_ABILITY_PARAMS,
  TERRAIN_PULSE_ABILITY_PARAMS,
  THIEF_ABILITY_PARAMS,
  THOUSAND_ARROWS_ABILITY_PARAMS,
  THRASH_ABILITY_PARAMS,
  THUNDER_ABILITY_PARAMS,
  THUNDER_CAGE_ABILITY_PARAMS,
  THUNDER_FANG_ABILITY_PARAMS,
  THUNDER_SHOCK_ABILITY_PARAMS,
  THUNDEROUS_KICK_ABILITY_PARAMS,
  TICKLE_ABILITY_PARAMS,
  TIME_TRAVEL_ABILITY_PARAMS,
  TOPSY_TURVY_ABILITY_PARAMS,
  TORCH_SONG_ABILITY_PARAMS,
  TORMENT_ABILITY_PARAMS,
  TOXIC_ABILITY_PARAMS,
  TRANSE_ABILITY_PARAMS,
  TRI_ATTACK_ABILITY_PARAMS,
  TRICK_OR_TREAT_ABILITY_PARAMS,
  TRIMMING_MOWER_ABILITY_PARAMS,
  TRIPLE_DIVE_ABILITY_PARAMS,
  TRIPLE_KICK_ABILITY_PARAMS,
  TROP_KICK_ABILITY_PARAMS,
  TWIN_BEAM_ABILITY_PARAMS,
  TWINEEDLE_ABILITY_PARAMS,
  TWISTER_ABILITY_PARAMS,
  U_TURN_ABILITY_PARAMS,
  ULTRA_THRUSTERS_ABILITY_PARAMS,
  UNBOUND_ABILITY_PARAMS,
  UPROAR_ABILITY_PARAMS,
  VENOSHOCK_ABILITY_PARAMS,
  VICTORY_DANCE_ABILITY_PARAMS,
  VINE_WHIP_ABILITY_PARAMS,
  VISE_GRIP_ABILITY_PARAMS,
  VOLT_SURGE_ABILITY_PARAMS,
  VOLT_SWITCH_ABILITY_PARAMS,
  WATER_PULSE_ABILITY_PARAMS,
  WATER_SHURIKEN_ABILITY_PARAMS,
  WATERFALL_ABILITY_PARAMS,
  WAVE_SPLASH_ABILITY_PARAMS,
  WHEEL_OF_FIRE_ABILITY_PARAMS,
  WHIRLPOOL_ABILITY_PARAMS,
  WHIRLWIND_ABILITY_PARAMS,
  WICKED_BLOW_ABILITY_PARAMS,
  WILDBOLT_STORM_ABILITY_PARAMS,
  WISE_YAWN_ABILITY_PARAMS,
  WISH_ABILITY_PARAMS,
  WONDER_GUARD_ABILITY_PARAMS,
  WONDER_ROOM_ABILITY_PARAMS,
  WOOD_HAMMER_ABILITY_PARAMS,
  X_SCISSOR_ABILITY_PARAMS,
  YAWN_ABILITY_PARAMS,
  ZAP_CANNON_ABILITY_PARAMS,
  ZING_ZAP_ABILITY_PARAMS
} from "../../types/ability-params"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, Rarity, Team } from "../../types/enum/Game"
import { Berries, Item, Tools } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm, PkmByIndex, PkmIndex } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { WandererBehavior, WandererType } from "../../types/enum/Wanderer"
import { Weather } from "../../types/enum/Weather"
import { isIn } from "../../utils/array"
import { isOnBench } from "../../utils/board"
import { distanceC, distanceE, distanceM } from "../../utils/distance"
import { logger } from "../../utils/logger"
import { calcAngleDegrees, clamp, max, min } from "../../utils/number"
import {
  effectInLine,
  effectInOrientation,
  OrientationArray,
  OrientationVector
} from "../../utils/orientation"
import {
  chance,
  pickNRandomIn,
  pickRandomIn,
  randomBetween,
  shuffleArray
} from "../../utils/random"
import { values } from "../../utils/schemas"
import type { Board, Cell } from "../board"
import {
  OnAbilityCastEffect,
  OnAttackEffect,
  OnAttackReceivedEffect,
  OnDamageReceivedEffect,
  OnShieldDepletedEffect,
  PeriodicEffect
} from "../effects/effect"
import {
  AccelerationEffect,
  BergmiteOnBackEffect,
  FalinksFormationEffect
} from "../effects/passives"
import {
  getMoveSpeed,
  getStrongestUnit,
  PokemonEntity
} from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"
import {
  HiddenPowerAStrategy,
  HiddenPowerBStrategy,
  HiddenPowerCStrategy,
  HiddenPowerDStrategy,
  HiddenPowerEMStrategy,
  HiddenPowerEStrategy,
  HiddenPowerFStrategy,
  HiddenPowerGStrategy,
  HiddenPowerHStrategy,
  HiddenPowerIStrategy,
  HiddenPowerJStrategy,
  HiddenPowerKStrategy,
  HiddenPowerLStrategy,
  HiddenPowerMStrategy,
  HiddenPowerNStrategy,
  HiddenPowerOStrategy,
  HiddenPowerPStrategy,
  HiddenPowerQMStrategy,
  HiddenPowerQStrategy,
  HiddenPowerRStrategy,
  HiddenPowerSStrategy,
  HiddenPowerTStrategy,
  HiddenPowerUStrategy,
  HiddenPowerVStrategy,
  HiddenPowerWStrategy,
  HiddenPowerXStrategy,
  HiddenPowerYStrategy,
  HiddenPowerZStrategy
} from "./hidden-power"

export class BlueFlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const fireLevel = pokemon.player?.synergies.get(Synergy.FIRE)
    const { baseDamage, synergyMultiplier, delayMs } = BLUE_FLARE_ABILITY_PARAMS
    const damage = baseDamage + (fireLevel ?? 0) * synergyMultiplier

    pokemon.commands.push(
      new DelayedCommand(() => {
        const cells = board.getAdjacentCells(
          target.positionX,
          target.positionY,
          true
        )
        cells.forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
      }, delayMs)
    )
  }
}

export class FusionBoltStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const electricLevel = pokemon.player?.synergies.get(Synergy.ELECTRIC)
    const { baseDamage, synergyMultiplier, delayMs } =
      FUSION_BOLT_ABILITY_PARAMS
    const damage = baseDamage + (electricLevel ?? 0) * synergyMultiplier
    pokemon.commands.push(
      new DelayedCommand(() => {
        const cells = board.getAdjacentCells(
          target.positionX,
          target.positionY,
          true
        )
        cells.forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
      }, delayMs)
    )
  }
}

export class GlaciateStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const iceSynergyLevel = pokemon.player?.synergies.get(Synergy.ICE) ?? 0
    const { baseDamage, synergyMultiplier, delayMs } = GLACIATE_ABILITY_PARAMS
    const damage = baseDamage + iceSynergyLevel * synergyMultiplier
    pokemon.commands.push(
      new DelayedCommand(() => {
        const cells = board.getAdjacentCells(
          target.positionX,
          target.positionY,
          true
        )
        cells.forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
      }, delayMs)
    )
  }
}

export class BeatUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const summonCount =
      BEAT_UP_ABILITY_PARAMS.summonCountByStar[pokemon.stars - 1] ??
      BEAT_UP_ABILITY_PARAMS.summonCountByStar.at(-1)!
    for (let i = 0; i < summonCount; i++) {
      const houndour = PokemonFactory.createPokemonFromName(
        BEAT_UP_ABILITY_PARAMS.summonPokemon,
        pokemon.player
      )
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(pokemon)
      if (coord) {
        const entity = pokemon.simulation.addPokemon(
          houndour,
          coord.x,
          coord.y,
          pokemon.team,
          true
        )
        const scale = (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
        entity.maxHP = min(1)(Math.round(entity.maxHP * scale))
        entity.hp = entity.maxHP
      }
    }
  }
}

export class PaydayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.floor(
      (PAYDAY_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
        PAYDAY_ABILITY_PARAMS.baseDamageByStar.at(-1)!) *
        (1 + (PAYDAY_ABILITY_PARAMS.apScalingFactor * pokemon.ap) / 100)
    )

    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
    if (death && pokemon.player) {
      const moneyGain: number =
        PAYDAY_ABILITY_PARAMS.moneyGainByStar[pokemon.stars - 1] ??
        PAYDAY_ABILITY_PARAMS.moneyGainByStar.at(-1)!
      pokemon.player.addMoney(moneyGain, true, pokemon)
      pokemon.count.moneyCount += moneyGain
    }
  }
}

export class PickupStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      PICKUP_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PICKUP_ABILITY_PARAMS.damageByStar.at(-1)!

    if (target.items.size > 0 && pokemon.items.size < 3) {
      const item = target.items.values().next().value
      if (item) {
        target.removeItem(item)
        pokemon.addItem(item)
      }
    } else {
      if (target.player) {
        const maxGoldStolen =
          PICKUP_ABILITY_PARAMS.goldByStar[pokemon.stars - 1] ??
          PICKUP_ABILITY_PARAMS.goldByStar.at(-1)!
        const moneyStolen = max(target.player.money)(maxGoldStolen)
        target.player.addMoney(-moneyStolen, false, target)
        if (pokemon.player) {
          pokemon.player.addMoney(moneyStolen, true, pokemon)
          pokemon.count.moneyCount += moneyStolen
        }
      }
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MindBlownStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const FIREWORK_COLORS = ["pink", "blue", "yellow", "white"]
    const {
      fireworkDamage,
      statusDurationMs,
      initialFireworkCount,
      firstDelayMs,
      delayIncrementMs,
      explosionRadius
    } = MIND_BLOWN_ABILITY_PARAMS
    const nbFireworks = Math.floor(
      initialFireworkCount * (1 + pokemon.ap / 100)
    )
    // Throws its head in the air, which then explodes into 5 fireworks.
    for (let i = 0; i < nbFireworks; i++) {
      const color = pickRandomIn(FIREWORK_COLORS)
      const randomTarget =
        pickRandomIn(board.cells.filter((e) => e && e.team !== pokemon.team)) ??
        target
      const x = i === 0 ? target.positionX : randomTarget?.positionX
      const y = i === 0 ? target.positionY : randomTarget?.positionY

      /*
        Fireworks hit in a 2 tile radius above random enemies, with effect depending on their color:
        - Pink: Deal [20,SP] PHYSICAL and BURN for 5 seconds
        - Blue: Deal [20,SP] SPECIAL and FATIGUE for 5 seconds.
        - Yellow: Deal [20,SP] TRUE and FLINCH for 5 seconds.
        - White: Give [20,SP] SHIELD and cure status afflictions for allies.
      */
      pokemon.simulation.room.clock.setTimeout(
        () => {
          if (
            !pokemon.simulation ||
            !pokemon.simulation.room ||
            pokemon.simulation.finished
          ) {
            return
          }
          const cellsHit = board.getCellsInRadius(x, y, explosionRadius, true)
          cellsHit.forEach((cell) => {
            switch (color) {
              case "pink":
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    fireworkDamage,
                    board,
                    AttackType.PHYSICAL,
                    pokemon,
                    crit,
                    false
                  )
                  cell.value.status.triggerBurn(
                    statusDurationMs,
                    cell.value,
                    pokemon
                  )
                }
                break
              case "blue":
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    fireworkDamage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit,
                    false
                  )
                  cell.value.status.triggerFatigue(statusDurationMs, cell.value)
                }
                break
              case "yellow":
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    fireworkDamage,
                    board,
                    AttackType.TRUE,
                    pokemon,
                    crit,
                    false
                  )
                }
                break
              case "white":
                if (cell.value && cell.value.team === pokemon.team) {
                  cell.value.addShield(fireworkDamage, pokemon, 0, crit)
                  cell.value.status.clearNegativeStatus(cell.value, pokemon)
                }
                break
            }
          })
          pokemon.broadcastAbility({
            targetX: x,
            targetY: y,
            skill: "MIND_BLOWN_FIREWORK",
            delay: FIREWORK_COLORS.indexOf(color)
          })
        },
        firstDelayMs + delayIncrementMs * i
      )
    }

    // The user loses 50% of its max HP in the process
    pokemon.handleSpecialDamage(
      pokemon.maxHP * MIND_BLOWN_ABILITY_PARAMS.hpLossRatio,
      board,
      AttackType.TRUE,
      pokemon,
      false,
      false
    )
  }
}

export class SoftBoiledStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const shield =
      SOFT_BOILED_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      SOFT_BOILED_ABILITY_PARAMS.shieldByStar.at(-1)!
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.broadcastAbility({ positionX: x, positionY: y })
        tg.addShield(shield, pokemon, 1, crit)
        tg.status.clearNegativeStatus(tg, pokemon)
      }
    })
  }
}

export class TeaTimeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal =
      TEA_TIME_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      TEA_TIME_ABILITY_PARAMS.healByStar.at(-1)!
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team == tg.team) {
        pokemon.broadcastAbility({ positionX: x, positionY: y })
        tg.handleHeal(heal, pokemon, 1, crit)
        const berry = values(tg.items).find((item) => Berries.includes(item))
        if (berry) {
          tg.eatBerry(berry)
        }
      }
    })
  }
}

export class PrecipiceBladesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = PRECIPICE_BLADES_ABILITY_PARAMS.damage
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (
        (tg && pokemon.team !== tg.team && pokemon.positionY === y) ||
        (tg && pokemon.team !== tg.team && pokemon.positionX === x)
      ) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        pokemon.broadcastAbility({ positionX: x, positionY: y })
      }
    })
  }
}

export class SongOfDesireStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)

    const rank = new Array<PokemonEntity>()
    board.forEach((x, y, tg) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })

    const { durationMs, targetCount, attackDebuff } =
      SONG_OF_DESIRE_ABILITY_PARAMS
    for (let i = 0; i < targetCount; i++) {
      const targetCharmed = rank[i]
      if (targetCharmed) {
        targetCharmed.status.triggerCharm(
          durationMs,
          targetCharmed,
          pokemon,
          false
        )
        targetCharmed.addAttack(attackDebuff, pokemon, 1, crit)
      }
    }
  }
}

export class SlackOffStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
    const healFactor = SLACK_OFF_ABILITY_PARAMS.healRatio
    pokemon.handleHeal(pokemon.maxHP * healFactor, pokemon, 1, crit)
    pokemon.status.triggerSleep(
      SLACK_OFF_ABILITY_PARAMS.sleepDurationMs,
      pokemon
    )
  }
}

export class ConfusingMindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const rank = new Array<PokemonEntity>()
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })

    const { durationMs, targetCount } = CONFUSING_MIND_ABILITY_PARAMS
    for (let i = 0; i < targetCount; i++) {
      const targetConfused = rank[i]
      if (targetConfused) {
        targetConfused.status.triggerConfusion(
          durationMs,
          targetConfused,
          pokemon,
          true
        )
      }
    }
  }
}

export class KnowledgeThiefStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (AbilityStrategies[target.skill].copyable) {
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
    if (pokemon.player && !pokemon.isGhostOpponent) {
      pokemon.player.addExperience(
        KNOWLEDGE_THIEF_ABILITY_PARAMS.experienceGain
      )
    }
  }
}

export class WonderGuardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const damage =
      WONDER_GUARD_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      WONDER_GUARD_ABILITY_PARAMS.damageByStar.at(-1)!

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerParalysis(
          WONDER_GUARD_ABILITY_PARAMS.paralysisDurationMs,
          cell.value,
          pokemon
        )
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class IllusionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal =
      ILLUSION_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      ILLUSION_ABILITY_PARAMS.healByStar.at(-1)!
    pokemon.handleHeal(heal, pokemon, ILLUSION_ABILITY_PARAMS.healScale, crit)
    if (target && target.canBeCopied) {
      pokemon.index = target.index
      pokemon.atk = Math.max(pokemon.atk, target.atk)
      pokemon.range = target.range
      pokemon.def = Math.max(pokemon.def, target.def)
      pokemon.speDef = Math.max(pokemon.speDef, target.speDef)
    }
  }
}

export class JudgementStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let synergyLevelsCount = 0
    const synergies = pokemon.player?.synergies
    if (synergies) {
      pokemon.types.forEach((type) => {
        synergyLevelsCount += synergies.get(type) ?? 0
      })
    }
    const damage =
      JUDGEMENT_ABILITY_PARAMS.damagePerSynergyLevel * synergyLevelsCount
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ElectricSurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.ELECTRIC)
      ) {
        ally.addSpeed(ELECTRIC_SURGE_ABILITY_PARAMS.speedBuff, pokemon, 1, crit)
      }
    })
  }
}

export class PsychicSurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.PSYCHIC)
      ) {
        ally.addShield(
          PSYCHIC_SURGE_ABILITY_PARAMS.shieldBuff,
          pokemon,
          1,
          crit
        )
      }
    })
  }
}

export class MistySurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const { ppGain, hpGain } = MISTY_SURGE_ABILITY_PARAMS
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.FAIRY)
      ) {
        ally.addPP(ppGain, pokemon, 1, crit)
        ally.handleHeal(hpGain, pokemon, 1, crit)
      }
    })
  }
}

export class GrassySurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (
        ally &&
        ally.id !== pokemon.id &&
        pokemon.team === ally.team &&
        ally.types.has(Synergy.GRASS)
      ) {
        ally.addAttack(GRASSY_SURGE_ABILITY_PARAMS.attackBuff, pokemon, 1, crit)
      }
    })
  }
}

export class PsychicStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      PSYCHIC_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PSYCHIC_ABILITY_PARAMS.damageByStar.at(-1) ??
      160
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addPP(PSYCHIC_ABILITY_PARAMS.ppBurn, pokemon, 0, false)
        cell.value.count.manaBurnCount++
      }
    })
  }
}

export class ChatterStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const { damage, confusionChance, confusionDurationMs, radiusTiles } =
      CHATTER_ABILITY_PARAMS

    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        radiusTiles,
        false
      )
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (chance(confusionChance, pokemon)) {
            cell.value.status.triggerConfusion(
              confusionDurationMs,
              cell.value,
              pokemon
            )
          }
        }
      })
  }
}

export class CrabHammerStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    let damage: number =
      CRAB_HAMMER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      CRAB_HAMMER_ABILITY_PARAMS.damageByStar.at(-1)!
    crit = chance(
      (pokemon.critChance + CRAB_HAMMER_ABILITY_PARAMS.critBonus) / 100,
      pokemon
    )
    super.process(pokemon, board, target, crit)
    let attackType = AttackType.SPECIAL
    if (target.hp / target.maxHP < CRAB_HAMMER_ABILITY_PARAMS.hpThreshold) {
      damage = CRAB_HAMMER_ABILITY_PARAMS.executeDamage
      attackType = AttackType.TRUE
    }
    target.handleSpecialDamage(damage, board, attackType, pokemon, crit)
  }
}

export class DiamondStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.def * DIAMOND_STORM_ABILITY_PARAMS.defenseDamageRatio
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class DracoEnergyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(
      pokemon.hp,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class DynamaxCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          Math.ceil(
            cell.value.maxHP * DYNAMAX_CANNON_ABILITY_PARAMS.hpDamageRatio
          ),
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class DynamicPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration =
      DYNAMIC_PUNCH_ABILITY_PARAMS.durationByStar[pokemon.stars - 1] ??
      DYNAMIC_PUNCH_ABILITY_PARAMS.durationByStar.at(-1)!
    const damage =
      DYNAMIC_PUNCH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DYNAMIC_PUNCH_ABILITY_PARAMS.damageByStar.at(-1)!
    target.status.triggerConfusion(duration, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ElectroBoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board.forEach((x, y, tg) => {
      if (tg && pokemon.team == tg.team && tg.types.has(Synergy.ELECTRIC)) {
        tg.status.triggerRuneProtect(
          ELECTRO_BOOST_ABILITY_PARAMS.runeProtectDurationMs,
          tg,
          pokemon
        )
      }
    })
  }
}

export class AuroraVeilStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const runeProtectDuration = AURORA_VEIL_ABILITY_PARAMS.runeProtectDurationMs
    const shield =
      AURORA_VEIL_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      AURORA_VEIL_ABILITY_PARAMS.shieldByStar.at(-1)!

    board.forEach((x, y, tg) => {
      if (tg && pokemon.team == tg.team) {
        tg.addShield(shield, pokemon, 1, crit)
        tg.status.triggerRuneProtect(runeProtectDuration, tg, pokemon)
      }
    })
  }
}

export class TimeTravelStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x, y, ally) => {
      if (ally && pokemon.team == ally.team) {
        ally.handleHeal(TIME_TRAVEL_ABILITY_PARAMS.allyHeal, pokemon, 1, crit)
        ally.status.clearNegativeStatus(ally, pokemon)
      }
    })

    if (
      pokemon.player &&
      !pokemon.isGhostOpponent &&
      pokemon.player.life < 100
    ) {
      pokemon.player.life += TIME_TRAVEL_ABILITY_PARAMS.playerLifeGain
    }
  }
}

export class AquaJetStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      AQUA_JET_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      AQUA_JET_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit

    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class SchoolingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SCHOOLING_ABILITY_PARAMS.hpDamageRatio * pokemon.maxHP

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    if (pokemon.player && !pokemon.isGhostOpponent) {
      pokemon.player.board.forEach((ally, id) => {
        if (ally && ally.name === Pkm.WISHIWASHI && isOnBench(ally)) {
          pokemon.addMaxHP(
            SCHOOLING_ABILITY_PARAMS.wishiwashiHpBonus,
            pokemon,
            0,
            false,
            true
          )
          pokemon.player!.board.delete(id)
        }
      })
    }
  }
}

export class ElectroWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const steal =
      ELECTRO_WEB_ABILITY_PARAMS.stealByStar[pokemon.stars - 1] ??
      ELECTRO_WEB_ABILITY_PARAMS.stealByStar.at(-1)!
    const damage =
      ELECTRO_WEB_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ELECTRO_WEB_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (cell.value.items.has(Item.TWIST_BAND) === false) {
            cell.value.addSpeed(-steal, pokemon, 1, crit)
            pokemon.addSpeed(steal, pokemon, 1, crit)
          }
        }
      })
  }
}

export class MysticalFireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      MYSTICAL_FIRE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MYSTICAL_FIRE_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addAbilityPower(
      MYSTICAL_FIRE_ABILITY_PARAMS.abilityPowerDebuff,
      pokemon,
      1,
      crit
    )
  }
}

export class FlameChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage =
      FLAME_CHARGE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FLAME_CHARGE_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit

    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class LeechSeedStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration =
      LEECH_SEED_ABILITY_PARAMS.durationByStarMs[pokemon.stars - 1] ??
      LEECH_SEED_ABILITY_PARAMS.durationByStarMs.at(-1)!
    const heal =
      LEECH_SEED_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      LEECH_SEED_ABILITY_PARAMS.healByStar.at(-1)!
    pokemon.handleHeal(heal, pokemon, 1, crit)
    target.status.triggerPoison(duration, target, pokemon)
  }
}

export class LockOnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (LOCK_ON_ABILITY_PARAMS) {
      pokemon.effects.add(EffectEnum.LOCK_ON)
    }
  }
}

export class DisableStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DISABLE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DISABLE_ABILITY_PARAMS.damageByStar.at(-1)!
    const duration =
      DISABLE_ABILITY_PARAMS.silenceDurationByStarMs[pokemon.stars - 1] ??
      DISABLE_ABILITY_PARAMS.silenceDurationByStarMs.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSilence(duration, cell.value, pokemon)
      }
    })
  }
}

export class RazorWindStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      RAZOR_WIND_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      RAZOR_WIND_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class DarkVoidStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = DARK_VOID_ABILITY_PARAMS.damage
    board
      .getCellsInRadius(
        target.positionX,
        target.positionY,
        DARK_VOID_ABILITY_PARAMS.radiusTiles,
        true
      )
      .forEach((cell) => {
        const enemy = cell.value
        if (enemy && pokemon.team !== enemy.team) {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (chance(DARK_VOID_ABILITY_PARAMS.sleepChance, pokemon)) {
            enemy.status.triggerSleep(
              DARK_VOID_ABILITY_PARAMS.sleepDurationMs,
              enemy
            )
          }
        }
      })
  }
}

export class OverheatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getCellsInRadius(
        target.positionX,
        target.positionY,
        OVERHEAT_ABILITY_PARAMS.radius,
        true
      )
      .forEach((cell) => {
        const unit = cell.value
        if (unit && pokemon.team !== unit.team) {
          let damage: number = OVERHEAT_ABILITY_PARAMS.baseDamage
          if (unit.status.burn) {
            damage = Math.round(damage * OVERHEAT_ABILITY_PARAMS.burnMultiplier)
          }
          unit.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        if (unit && unit.status.freeze) {
          unit.status.freezeCooldown = 0
        }
      })
  }
}

export class HypnosisStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    if (farthestTarget) {
      const factor = HYPNOSIS_ABILITY_PARAMS.scaleFactor
      const duration = Math.round(
        (HYPNOSIS_ABILITY_PARAMS.sleepDurationByStar[pokemon.stars - 1] ??
          HYPNOSIS_ABILITY_PARAMS.sleepDurationByStar.at(-1)!) *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      farthestTarget.status.triggerSleep(duration, farthestTarget)
    }
  }
}

export class KingShieldStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield: number =
      KING_SHIELD_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      KING_SHIELD_ABILITY_PARAMS.shieldByStar.at(-1)!
    pokemon.status.triggerProtect(KING_SHIELD_ABILITY_PARAMS.durationMs)
    pokemon.addShield(shield, pokemon, 1, crit)
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (farthestTarget) {
      pokemon.moveTo(
        farthestTarget.positionX,
        farthestTarget.positionY,
        board,
        true
      )
    }
    if (pokemon.name === Pkm.AEGISLASH) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addAttack(
            KING_SHIELD_ABILITY_PARAMS.bladeAttackDelta,
            pokemon,
            1,
            crit
          )
          pokemon.addDefense(
            KING_SHIELD_ABILITY_PARAMS.bladeDefenseDelta,
            pokemon,
            1,
            crit
          )
          pokemon.addSpecialDefense(
            KING_SHIELD_ABILITY_PARAMS.bladeSpeDefenseDelta,
            pokemon,
            1,
            crit
          )
          pokemon.name = Pkm.AEGISLASH_BLADE
          pokemon.index = PkmIndex[Pkm.AEGISLASH_BLADE]
          if (pokemon.player) {
            pokemon.player.pokemonsPlayed.add(Pkm.AEGISLASH_BLADE)
          }
        }, KING_SHIELD_ABILITY_PARAMS.durationMs)
      )
    } else if (pokemon.name === Pkm.AEGISLASH_BLADE) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addAttack(
            -KING_SHIELD_ABILITY_PARAMS.bladeAttackDelta,
            pokemon,
            1,
            crit
          )
          pokemon.addDefense(
            -KING_SHIELD_ABILITY_PARAMS.bladeDefenseDelta,
            pokemon,
            1,
            crit
          )
          pokemon.addSpecialDefense(
            -KING_SHIELD_ABILITY_PARAMS.bladeSpeDefenseDelta,
            pokemon,
            1,
            crit
          )
          pokemon.name = Pkm.AEGISLASH
          pokemon.index = PkmIndex[Pkm.AEGISLASH]
        }, KING_SHIELD_ABILITY_PARAMS.durationMs)
      )
    }
  }
}

export class UTurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield =
      U_TURN_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      U_TURN_ABILITY_PARAMS.shieldByStar.at(-1)!
    pokemon.moveTo(target.positionX, target.positionY, board, true)
    pokemon.addShield(shield, pokemon, 1, crit)
    target.status.triggerCharm(
      U_TURN_ABILITY_PARAMS.charmDurationMs,
      target,
      pokemon,
      false
    )
  }
}

export class PoisonJabStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage: number =
      POISON_JAB_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      POISON_JAB_ABILITY_PARAMS.damageByStar.at(-1)!
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerPoison(
      POISON_JAB_ABILITY_PARAMS.poisonDurationMs,
      target,
      pokemon
    )
    pokemon.status.triggerPoison(
      POISON_JAB_ABILITY_PARAMS.poisonDurationMs,
      pokemon,
      pokemon
    )
    pokemon.moveTo(target.positionX, target.positionY, board, true)
  }
}

export class ExplosionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      EXPLOSION_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      EXPLOSION_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    if (!pokemon.items.has(Item.PROTECTIVE_PADS)) {
      pokemon.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class ChloroblastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      CHLOROBLAST_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      CHLOROBLAST_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })

    if (!pokemon.items.has(Item.PROTECTIVE_PADS)) {
      pokemon.handleSpecialDamage(
        CHLOROBLAST_ABILITY_PARAMS.selfDamageHpRatio * pokemon.maxHP,
        board,
        AttackType.TRUE,
        pokemon,
        crit
      )
    }
  }
}

export class ClangorousSoulStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff =
      CLANGOROUS_SOUL_ABILITY_PARAMS.statBuffByStar[pokemon.stars - 1] ??
      CLANGOROUS_SOUL_ABILITY_PARAMS.statBuffByStar.at(-1)!

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.addAttack(buff, pokemon, 1, crit)
        cell.value.addDefense(buff, pokemon, 1, crit)
        cell.value.addSpecialDefense(buff, pokemon, 1, crit)
      }
    })
  }
}

export class LiquidationStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      LIQUIDATION_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      LIQUIDATION_ABILITY_PARAMS.damageByStar.at(-1)!
    const defReduction =
      LIQUIDATION_ABILITY_PARAMS.defenseReductionByStar[pokemon.stars - 1] ??
      LIQUIDATION_ABILITY_PARAMS.defenseReductionByStar.at(-1)!

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addDefense(-defReduction, pokemon, 1, crit)
  }
}

export class BonemerangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      BONEMERANG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BONEMERANG_ABILITY_PARAMS.damageByStar.at(-1)!

    const hit = () =>
      effectInLine(board, pokemon, target, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })

    hit()
    pokemon.commands.push(
      new DelayedCommand(hit, BONEMERANG_ABILITY_PARAMS.returnDelayMs)
    )
  }
}

export class ShadowBoneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SHADOW_BONE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SHADOW_BONE_ABILITY_PARAMS.damageByStar.at(-1)!

    const hit = () =>
      effectInLine(board, pokemon, target, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          if (chance(SHADOW_BONE_ABILITY_PARAMS.defenseBreakChance, pokemon)) {
            cell.value.addDefense(
              -SHADOW_BONE_ABILITY_PARAMS.defenseReduction,
              pokemon,
              1,
              crit
            )
          }
        }
      })

    hit()
  }
}

export class AuroraBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      AURORA_BEAM_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      AURORA_BEAM_ABILITY_PARAMS.damageByStar.at(-1)!
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(AURORA_BEAM_ABILITY_PARAMS.freezeChance, pokemon)) {
          cell.value.status.triggerFreeze(
            AURORA_BEAM_ABILITY_PARAMS.freezeDurationMs,
            target,
            pokemon
          )
        }
      }
    })
  }
}

export class GrowlStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const atkDebuff =
      GROWL_ABILITY_PARAMS.attackDebuffByStar[pokemon.stars - 1] ??
      GROWL_ABILITY_PARAMS.attackDebuffByStar.at(-1)!
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerFlinch(
            GROWL_ABILITY_PARAMS.flinchDurationMs,
            cell.value,
            pokemon
          )
          cell.value.addAttack(-atkDebuff, pokemon, 1, crit)
        }
      })
  }
}

export class RelicSongStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    if (pokemon.count.ult % RELIC_SONG_ABILITY_PARAMS.effectCycleLength === 0) {
      const factor = RELIC_SONG_ABILITY_PARAMS.sleepScalingFactor
      const duration = Math.round(
        RELIC_SONG_ABILITY_PARAMS.sleepBaseDurationMs *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team != tg.team) {
          tg.status.triggerSleep(duration, tg)
        }
      })
    } else {
      board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
        if (tg && pokemon.team === tg.team) {
          tg.addShield(RELIC_SONG_ABILITY_PARAMS.allyShield, pokemon, 1, crit)
        }
      })
    }
  }
}

export class FairyWindStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const ppGain =
      FAIRY_WIND_ABILITY_PARAMS.ppGainByStar[pokemon.stars - 1] ??
      FAIRY_WIND_ABILITY_PARAMS.ppGainByStar.at(-1)!
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team === tg.team && tg.id !== pokemon.id) {
        tg.addPP(ppGain, pokemon, 0.5, crit)
      }
    })
  }
}

export class DisarmingVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const radius =
      DISARMING_VOICE_ABILITY_PARAMS.radiusByStar[pokemon.stars - 1] ??
      DISARMING_VOICE_ABILITY_PARAMS.radiusByStar.at(-1)!
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      radius,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerCharm(
          DISARMING_VOICE_ABILITY_PARAMS.charmDurationMs,
          target,
          pokemon,
          true
        )
      }
    })
  }
}

export class HighJumpKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      HIGH_JUMP_KICK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HIGH_JUMP_KICK_ABILITY_PARAMS.damageByStar.at(-1)!
    const ppStolen = max(HIGH_JUMP_KICK_ABILITY_PARAMS.maxPpStolen)(target.pp)
    if (target.items.has(Item.TWIST_BAND) === false) {
      pokemon.addPP(ppStolen, pokemon, 0, false)
      target.addPP(-ppStolen, pokemon, 0, false)
      target.count.manaBurnCount++
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class TropKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      TROP_KICK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TROP_KICK_ABILITY_PARAMS.damageByStar.at(-1)!
    const atkDebuff =
      TROP_KICK_ABILITY_PARAMS.atkDebuffByStar[pokemon.stars - 1] ??
      TROP_KICK_ABILITY_PARAMS.atkDebuffByStar.at(-1)!
    target.addAttack(-atkDebuff, pokemon, 1, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GrassWhistleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let n: number =
      GRASS_WHISTLE_ABILITY_PARAMS.targetCountByStar[pokemon.stars - 1] ??
      GRASS_WHISTLE_ABILITY_PARAMS.targetCountByStar.at(-1)!
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && n > 0) {
        tg.status.triggerSleep(GRASS_WHISTLE_ABILITY_PARAMS.sleepDurationMs, tg)
        n--
      }
    })
  }
}

export class TriAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const effect = randomBetween(1, 3)
    switch (effect) {
      case 1:
        target.status.triggerFreeze(
          TRI_ATTACK_ABILITY_PARAMS.freezeDurationMs,
          target,
          pokemon
        )
        break
      case 2:
        target.status.triggerBurn(
          TRI_ATTACK_ABILITY_PARAMS.burnDurationMs,
          target,
          pokemon
        )
        break
      case 3:
        target.status.triggerParalysis(
          TRI_ATTACK_ABILITY_PARAMS.paralysisDurationMs,
          target,
          pokemon
        )
        break
    }
    const damage =
      TRI_ATTACK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TRI_ATTACK_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EchoStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage =
      ECHO_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ECHO_ABILITY_PARAMS.damageByStar.at(-1)!
    const range = 2 + pokemon.count.ult
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, range, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            pokemon.count.ult * damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class UproarStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Deal [5,10,20,SP] SPECIAL every second for 3 seconds to all enemies at attack range; during this time, allies in the area are immune to SLEEP.

    board
      .getCellsInRange(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.range,
        true
      )
      .forEach((cell) => {
        if (
          cell.value &&
          pokemon.team === cell.value.team &&
          !cell.value.effects.has(EffectEnum.IMMUNITY_SLEEP)
        ) {
          cell.value.effects.add(EffectEnum.IMMUNITY_SLEEP)
          cell.value.commands.push(
            new DelayedCommand(() => {
              cell.value?.effects.delete(EffectEnum.IMMUNITY_SLEEP)
            }, UPROAR_ABILITY_PARAMS.immuneDurationMs)
          )
        }
      })

    for (let i = 1; i <= UPROAR_ABILITY_PARAMS.tickCount; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const damage =
            UPROAR_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
            UPROAR_ABILITY_PARAMS.damageByStar.at(-1)!
          pokemon.broadcastAbility()
          board
            .getCellsInRange(
              pokemon.positionX,
              pokemon.positionY,
              pokemon.range,
              false
            )
            .forEach((cell) => {
              if (cell.value && pokemon.team != cell.value.team) {
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            })
        }, i * UPROAR_ABILITY_PARAMS.tickIntervalMs)
      )
    }
  }
}

export class FutureSightStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      FUTURE_SIGHT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FUTURE_SIGHT_ABILITY_PARAMS.damageByStar.at(-1)!
    const count = FUTURE_SIGHT_ABILITY_PARAMS.maxTargets
    const targets: PokemonEntity[] = board.cells
      .filter<PokemonEntity>(
        (p): p is PokemonEntity => p !== undefined && p.team !== pokemon.team
      )
      .slice(0, count)

    for (const tg of targets) {
      pokemon.broadcastAbility({
        positionX: tg.positionX,
        positionY: tg.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        for (const tg of targets) {
          if (tg.hp > 0) {
            tg.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }, FUTURE_SIGHT_ABILITY_PARAMS.delayMs)
    )
  }
}

export class PetalDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const damage: number =
      PETAL_DANCE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PETAL_DANCE_ABILITY_PARAMS.damageByStar.at(-1)!
    const count: number =
      PETAL_DANCE_ABILITY_PARAMS.targetCountByStar[pokemon.stars - 1] ??
      PETAL_DANCE_ABILITY_PARAMS.targetCountByStar.at(-1)!

    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team
    ) as PokemonEntity[]
    const enemiesHit = enemies
      .sort(
        (a, b) =>
          distanceM(
            a.positionX,
            a.positionY,
            pokemon.positionX,
            pokemon.positionY
          ) -
          distanceM(
            b.positionX,
            b.positionY,
            pokemon.positionX,
            pokemon.positionY
          )
      )
      .slice(0, count)

    enemiesHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      pokemon.broadcastAbility({
        positionX: enemy.positionX,
        positionY: enemy.positionY
      })
    })
  }
}

export class HyperVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage: number =
      HYPER_VOICE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HYPER_VOICE_ABILITY_PARAMS.damageByStar.at(-1)!
    const confusionDuration: number =
      HYPER_VOICE_ABILITY_PARAMS.confusionDurationByStar[pokemon.stars - 1] ??
      HYPER_VOICE_ABILITY_PARAMS.confusionDurationByStar.at(-1)!

    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
        if (chance(HYPER_VOICE_ABILITY_PARAMS.confusionChance, pokemon)) {
          tg.status.triggerConfusion(confusionDuration, tg, pokemon)
        }
      }
    })
  }
}
export class ShadowCloneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const spawnPosition = board.getClosestAvailablePlace(
      pokemon.positionX,
      pokemon.positionY
    )

    if (spawnPosition) {
      const p = PokemonFactory.createPokemonFromName(pokemon.name, {
        emotion: pokemon.emotion,
        shiny: pokemon.shiny
      })
      let itemStolen: Item | null = null
      if (target.items.size > 0) {
        itemStolen = pickRandomIn(values(target.items))
        target.removeItem(itemStolen)
      }

      const clone = pokemon.simulation.addPokemon(
        p,
        spawnPosition.x,
        spawnPosition.y,
        pokemon.team,
        true
      )
      clone.maxHP = min(1)(
        Math.ceil(
          SHADOW_CLONE_ABILITY_PARAMS.hpRatio *
            pokemon.maxHP *
            (1 + pokemon.ap / 100) *
            (crit ? pokemon.critPower : 1)
        )
      )
      clone.hp = clone.maxHP
      if (itemStolen) clone.addItem(itemStolen)
    }
  }
}

export class VoltSwitchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      VOLT_SWITCH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      VOLT_SWITCH_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class AccelerockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    target = destination?.target ?? target
    super.process(pokemon, board, target, crit)
    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board, false)
      pokemon.setTarget(destination.target)
    }
    target.handleSpecialDamage(
      pokemon.atk,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    const nbEffects = max(Math.floor(pokemon.def / 2))(
      Math.round(
        ACCELEROCK_ABILITY_PARAMS.nbEffectsBaseline *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
    )
    pokemon.addDefense(
      -ACCELEROCK_ABILITY_PARAMS.defReductionPerEffect * nbEffects,
      pokemon,
      0,
      false
    )
    pokemon.addSpeed(
      nbEffects * ACCELEROCK_ABILITY_PARAMS.speedBonusPerEffect,
      pokemon,
      0,
      false
    )
  }
}

export class NuzzleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    target = destination?.target ?? target
    super.process(pokemon, board, target, crit)

    const damage: number =
      NUZZLE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      NUZZLE_ABILITY_PARAMS.damageByStar.at(-1)!

    if (destination) {
      pokemon.setTarget(destination.target)
      pokemon.moveTo(destination.x, destination.y, board, false)
    }

    target.status.triggerParalysis(
      NUZZLE_ABILITY_PARAMS.paralysisDurationMs,
      target,
      pokemon
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class HeadSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage: number =
      HEAD_SMASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEAD_SMASH_ABILITY_PARAMS.damageByStar.at(-1)!
    const recoil: number =
      HEAD_SMASH_ABILITY_PARAMS.recoilByStar[pokemon.stars - 1] ??
      HEAD_SMASH_ABILITY_PARAMS.recoilByStar.at(-1)!

    if (target.status.sleep || target.status.freeze) {
      target.handleSpecialDamage(9999, board, AttackType.TRUE, pokemon, crit)
    } else {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
    if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}

export class DoubleEdgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage =
      DOUBLE_EDGE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DOUBLE_EDGE_ABILITY_PARAMS.damageByStar.at(-1)!
    const recoil =
      DOUBLE_EDGE_ABILITY_PARAMS.recoilByStar[pokemon.stars - 1] ??
      DOUBLE_EDGE_ABILITY_PARAMS.recoilByStar.at(-1)!
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}

export class RockSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      ROCK_SMASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ROCK_SMASH_ABILITY_PARAMS.damageByStar.at(-1)!
    const armorBreakDuration =
      ROCK_SMASH_ABILITY_PARAMS.armorBreakDurationByStar[pokemon.stars - 1] ??
      ROCK_SMASH_ABILITY_PARAMS.armorBreakDurationByStar.at(-1)!

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerArmorReduction(armorBreakDuration, target)
  }
}

export class RockTombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage =
      ROCK_TOMB_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ROCK_TOMB_ABILITY_PARAMS.damageByStar.at(-1)!
    const debuff =
      ROCK_TOMB_ABILITY_PARAMS.speedReductionByStar[pokemon.stars - 1] ??
      ROCK_TOMB_ABILITY_PARAMS.speedReductionByStar.at(-1)!

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addSpeed(-debuff, pokemon, 0, false)
  }
}

export class RoarOfTimeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const candidates = board.cells.filter(
      (cell) => cell && cell.team === pokemon.team && !cell.status.resurrection
    ) as PokemonEntity[]
    const strongest = getStrongestUnit(candidates)
    if (strongest) {
      strongest.status.addResurrection(strongest)
      strongest.addSpeed(
        ROAR_OF_TIME_ABILITY_PARAMS.speedBoost,
        pokemon,
        1,
        crit
      )
    }
  }
}

export class HealBlockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage: number =
      HEAL_BLOCK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEAL_BLOCK_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
        cell.value.status.triggerWound(
          HEAL_BLOCK_ABILITY_PARAMS.woundDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class SpikeArmorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const shouldTriggerSpikeAnimation = pokemon.status.spikeArmor
    super.process(pokemon, board, target, crit, !shouldTriggerSpikeAnimation)
    if (pokemon.status.spikeArmor) {
      const damage = SPIKY_SHIELD_ABILITY_PARAMS.spikeDamage
      OrientationArray.forEach((orientation) => {
        effectInOrientation(board, pokemon, orientation, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
      })
    }
    const duration =
      SPIKY_SHIELD_ABILITY_PARAMS.durationByStarMs[pokemon.stars - 1] ??
      SPIKY_SHIELD_ABILITY_PARAMS.durationByStarMs.at(-1)!
    pokemon.status.triggerSpikeArmor(duration)
  }
}

export class OriginPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = ORIGIN_PULSE_ABILITY_PARAMS.damage
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team && target.positionY == y) {
        tg.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
      }
    })
  }
}

export class SeedFlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SEED_FLARE_ABILITY_PARAMS.damage

    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        SEED_FLARE_ABILITY_PARAMS.radius,
        false
      )
      .forEach((cell) => {
        if (cell.value && pokemon.team !== cell.value.team) {
          cell.value.addSpecialDefense(
            -SEED_FLARE_ABILITY_PARAMS.specialDefenseReduction,
            pokemon,
            0,
            false
          )
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class NightmareStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const duration: number =
      NIGHTMARE_ABILITY_PARAMS.fatigueDurationByStar[pokemon.stars - 1] ??
      NIGHTMARE_ABILITY_PARAMS.fatigueDurationByStar.at(-1)!
    const damage: number =
      NIGHTMARE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      NIGHTMARE_ABILITY_PARAMS.damageByStar.at(-1)!

    board.forEach((x: number, y: number, enemy: PokemonEntity | undefined) => {
      if (enemy && pokemon.team != enemy.team) {
        if (
          enemy.status.curseFate ||
          enemy.status.curseTorment ||
          enemy.status.curseVulnerability ||
          enemy.status.curseWeakness
        ) {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
        enemy.status.triggerFatigue(duration, enemy)
      }
    })
  }
}

export class ToxicStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = TOXIC_ABILITY_PARAMS.scalingFactor
    const duration = Math.round(
      TOXIC_ABILITY_PARAMS.durationByIndexMs[pokemon.stars] ??
        TOXIC_ABILITY_PARAMS.defaultDurationMs *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    const count = pokemon.stars

    const closestEnemies = board.getClosestEnemies(
      pokemon.positionX,
      pokemon.positionY,
      target.team
    )

    for (let i = 0; i < count; i++) {
      const enemy = closestEnemies[i]
      if (enemy) {
        enemy.status.triggerPoison(duration, enemy, pokemon)
      }
    }
  }
}

export class BlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const freezeDuration = BLIZZARD_ABILITY_PARAMS.freezeDurationMs
    const damage =
      BLIZZARD_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BLIZZARD_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        BLIZZARD_ABILITY_PARAMS.radiusTiles,
        false
      )
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          const enemy = cell.value
          enemy.handleSpecialDamage(
            enemy.status.freeze
              ? damage * BLIZZARD_ABILITY_PARAMS.frozenMultiplier
              : damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          enemy.status.triggerFreeze(freezeDuration, enemy, pokemon)
        }
      })
  }
}

export class ProtectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = PROTECT_ABILITY_PARAMS.scalingFactor
    const duration = Math.round(
      (PROTECT_ABILITY_PARAMS.durationByStarMs[pokemon.stars - 1] ??
        PROTECT_ABILITY_PARAMS.durationByStarMs.at(-1)!) *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    pokemon.status.triggerProtect(duration)
  }
}

export class ObstructStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const factor = OBSTRUCT_ABILITY_PARAMS.scalingFactor
    const duration = Math.round(
      OBSTRUCT_ABILITY_PARAMS.baseDurationMs *
        (1 + (pokemon.ap / 100) * factor) *
        (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
    )
    pokemon.status.triggerProtect(duration)
    pokemon.effects.add(EffectEnum.OBSTRUCT)
    pokemon.commands.push(
      new DelayedCommand(
        () => pokemon.effects.delete(EffectEnum.OBSTRUCT),
        duration
      )
    )
  }
}

export class SingStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const timer = Math.round(
      SING_ABILITY_PARAMS.baseSleepDurationMs *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    const count =
      SING_ABILITY_PARAMS.targetCountByStar[pokemon.stars - 1] ??
      SING_ABILITY_PARAMS.targetCountByStar.at(-1)!
    const rank = new Array<PokemonEntity>()
    board.forEach((x, y, tg) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })
    for (let i = 0; i < count; i++) {
      const tg = rank[i]
      if (tg) {
        tg.status.triggerSleep(timer, tg)
      }
    }
  }
}

export class IcicleMissileStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = ICICLE_MISSILE_ABILITY_PARAMS.damage
    const count =
      ICICLE_MISSILE_ABILITY_PARAMS.hitCountByStar[pokemon.stars - 1] ??
      ICICLE_MISSILE_ABILITY_PARAMS.hitCountByStar.at(-1)!
    const rank = new Array<PokemonEntity>()
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        rank.push(tg)
      }
    })
    rank.sort((a, b) => {
      if (a.team === Team.BLUE_TEAM) {
        return a.positionY - b.positionY
      } else {
        return b.positionY - a.positionY
      }
    })
    for (let i = 0; i < count; i++) {
      const tg = rank[i]
      if (tg) {
        const targetX = tg.positionX
        const targetY = tg.positionY
        pokemon.broadcastAbility({
          targetX,
          targetY,
          delay: i
        })

        pokemon.commands.push(
          new DelayedCommand(() => {
            const entityHit = board.getEntityOnCell(targetX, targetY)
            if (
              entityHit &&
              entityHit.hp > 0 &&
              entityHit.team !== pokemon.team
            ) {
              entityHit.status.triggerFreeze(
                ICICLE_MISSILE_ABILITY_PARAMS.freezeDurationMs,
                tg,
                pokemon
              )
              entityHit.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          }, ICICLE_MISSILE_ABILITY_PARAMS.hitDelayMs)
        )
      }
    }
  }
}

export class ConfusionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const timer =
      CONFUSION_ABILITY_PARAMS.durationByStarMs[pokemon.stars - 1] ??
      CONFUSION_ABILITY_PARAMS.durationByStarMs.at(-1)!
    const damage =
      CONFUSION_ABILITY_PARAMS.bonusDamageByStar[pokemon.stars - 1] ??
      CONFUSION_ABILITY_PARAMS.bonusDamageByStar.at(-1)!

    if (target.status.confusion) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      target.status.triggerSilence(timer, target, pokemon)
      target.status.triggerConfusion(timer, target, pokemon)
    }
  }
}

export class FireBlastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FIRE_BLAST_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FIRE_BLAST_ABILITY_PARAMS.damageByStar.at(-1)!
    const cellsHit = [
      { x: target.positionX, y: target.positionY },
      { x: target.positionX - 1, y: target.positionY },
      { x: target.positionX + 1, y: target.positionY },
      { x: target.positionX, y: target.positionY + 1 },
      { x: target.positionX - 1, y: target.positionY - 1 },
      { x: target.positionX + 1, y: target.positionY - 1 }
    ]
    for (const cell of cellsHit) {
      const entityOnCell = board.getEntityOnCell(cell.x, cell.y)
      if (entityOnCell && entityOnCell.team !== pokemon.team) {
        entityOnCell.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}

export class FieryDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FIERY_DANCE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FIERY_DANCE_ABILITY_PARAMS.damageByStar.at(-1)!
    pokemon.addAbilityPower(
      FIERY_DANCE_ABILITY_PARAMS.apBoost,
      pokemon,
      0,
      false
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SeismicTossStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SEISMIC_TOSS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SEISMIC_TOSS_ABILITY_PARAMS.damageByStar.at(-1)!
    const totalDamage =
      damage *
      (pokemon.player
        ? pokemon.player.experienceManager.level
        : SEISMIC_TOSS_ABILITY_PARAMS.fallbackPlayerLevel)
    target.handleSpecialDamage(
      totalDamage,
      board,
      AttackType.TRUE,
      pokemon,
      crit
    )
  }
}

export class GuillotineStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = pokemon.atk * GUILLOTINE_ABILITY_PARAMS.atkMultiplier
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death) {
      pokemon.addPP(
        pokemon.maxPP * GUILLOTINE_ABILITY_PARAMS.ppGainRatio,
        pokemon,
        0,
        false
      )
    }
  }
}

export class RockSlideStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage =
      ROCK_SLIDE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ROCK_SLIDE_ABILITY_PARAMS.damageByStar.at(-1)!

    if (target.types.has(Synergy.FLYING)) {
      damage = damage * ROCK_SLIDE_ABILITY_PARAMS.flyingMultiplier
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WheelOfFireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage =
      WHEEL_OF_FIRE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      WHEEL_OF_FIRE_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        pokemon.broadcastAbility({
          skill: "FLAME_HIT",
          positionX: cell.x,
          positionY: cell.y
        })
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      enemy.commands.push(
        new DelayedCommand(() => {
          enemy.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, WHEEL_OF_FIRE_ABILITY_PARAMS.secondHitDelayMs)
      )
    })
  }
}

export class InfernalParadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)

    const targetsHit = new Set<PokemonEntity>()
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
      pokemon.broadcastAbility({
        skill: "FLAME_HIT",
        positionX: cell.x,
        positionY: cell.y
      })
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      if (chance(INFERNAL_PARADE_ABILITY_PARAMS.burnChance, pokemon)) {
        enemy.status.triggerBurn(
          INFERNAL_PARADE_ABILITY_PARAMS.burnDurationMs,
          enemy,
          pokemon
        )
      }

      enemy.handleSpecialDamage(
        INFERNAL_PARADE_ABILITY_PARAMS.damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      enemy.commands.push(
        new DelayedCommand(() => {
          enemy.handleSpecialDamage(
            INFERNAL_PARADE_ABILITY_PARAMS.damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, INFERNAL_PARADE_ABILITY_PARAMS.hitDelayMs)
      )
    })
  }
}

export class HeatWaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      HEAT_WAVE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEAT_WAVE_ABILITY_PARAMS.damageByStar.at(-1)!

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.freezeCooldown = 0
        if (chance(HEAT_WAVE_ABILITY_PARAMS.burnChance, pokemon)) {
          value.status.triggerBurn(
            HEAT_WAVE_ABILITY_PARAMS.burnDurationMs,
            value,
            pokemon
          )
        }
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class FlameThrowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FLAMETHROWER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FLAMETHROWER_ABILITY_PARAMS.damageByStar.at(-1)!

    effectInOrientation(
      board,
      pokemon,
      target,
      (cell) => {
        if (cell.value != null && cell.value.team != pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerBurn(
            FLAMETHROWER_ABILITY_PARAMS.burnDurationMs,
            cell.value,
            pokemon
          )
        }
      },
      FLAMETHROWER_ABILITY_PARAMS.range
    )
  }
}

export class HydroPumpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      HYDRO_PUMP_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HYDRO_PUMP_ABILITY_PARAMS.damageByStar.at(-1)!
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class SolarBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      SOLAR_BEAM_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SOLAR_BEAM_ABILITY_PARAMS.damageByStar.at(-1)!
    if (pokemon.simulation.weather === Weather.ZENITH || pokemon.status.light) {
      damage = damage * SOLAR_BEAM_ABILITY_PARAMS.zenithOrLightDamageMultiplier
      pokemon.addPP(
        SOLAR_BEAM_ABILITY_PARAMS.ppRestoreOnBoost,
        pokemon,
        0,
        false
      )
    }
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.status.triggerBurn(
          SOLAR_BEAM_ABILITY_PARAMS.burnDurationMs,
          cell.value,
          pokemon
        )
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class ThunderShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      THUNDER_SHOCK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      THUNDER_SHOCK_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ThunderStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      THUNDER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      THUNDER_ABILITY_PARAMS.damageByStar.at(-1)!
    const enemies = board.cells.filter(
      (cell) => cell && cell.team !== pokemon.team
    ) as PokemonEntity[]
    const targets = pickNRandomIn(enemies, THUNDER_ABILITY_PARAMS.targetCount)
    targets.forEach((tg, index) => {
      tg.commands.push(
        new DelayedCommand(() => {
          if (chance(THUNDER_ABILITY_PARAMS.paralysisChance, pokemon)) {
            tg.status.triggerParalysis(
              THUNDER_ABILITY_PARAMS.paralysisDurationMs,
              tg,
              pokemon
            )
          }
          tg.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          tg.broadcastAbility({
            skill: Ability.THUNDER_SHOCK,
            targetX: tg.positionX,
            targetY: tg.positionY
          })
        }, index * THUNDER_ABILITY_PARAMS.delayBetweenTargetsMs)
      )
    })
  }
}

export class DracoMeteorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DRACO_METEOR_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DRACO_METEOR_ABILITY_PARAMS.damageByStar.at(-1)!
    const x = target.positionX
    const y = target.positionY
    pokemon.commands.push(
      new DelayedCommand(() => {
        board.getAdjacentCells(x, y, true).forEach((cell) => {
          if (cell.value && pokemon.team !== cell.value.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        pokemon.addAbilityPower(
          -DRACO_METEOR_ABILITY_PARAMS.apReduction,
          pokemon,
          0,
          false
        )
      }, DRACO_METEOR_ABILITY_PARAMS.delayMs)
    )
  }
}

export class BlazeKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      BLAZE_KICK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BLAZE_KICK_ABILITY_PARAMS.damageByStar.at(-1)!
    if (target.status.burn) {
      damage = Math.round(damage * BLAZE_KICK_ABILITY_PARAMS.burnMultiplier)
    }
    target.status.triggerBurn(
      BLAZE_KICK_ABILITY_PARAMS.burnDurationMs,
      target,
      pokemon
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WishStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    //  Grant 30/60/120 shield and 1 second Protect to the lowest % HP ally.
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]
    const shield =
      WISH_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      WISH_ABILITY_PARAMS.shieldByStar.at(-1)!
    lowestHealthAlly.addShield(shield, pokemon, 1, crit)
    lowestHealthAlly.status.triggerProtect(
      WISH_ABILITY_PARAMS.protectDurationMs
    )
  }
}

export class LunarBlessingStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && ally.hp < ally.maxHP) {
        ally.handleHeal(
          LUNAR_BLESSING_ABILITY_PARAMS.healRatio * ally.maxHP,
          pokemon,
          1,
          crit
        )
        ally.status.clearNegativeStatus(ally, pokemon)
      }
    })
  }
}

export class NaturalGiftStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]
    const heal: number =
      NATURAL_GIFT_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      NATURAL_GIFT_ABILITY_PARAMS.healByStar.at(-1)!

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      const runeProtectDurationMs: number =
        NATURAL_GIFT_ABILITY_PARAMS.runeProtectDurationByStarMs[
          pokemon.stars - 1
        ] ?? NATURAL_GIFT_ABILITY_PARAMS.runeProtectDurationByStarMs.at(-1)!
      lowestHealthAlly.status.triggerRuneProtect(
        runeProtectDurationMs,
        lowestHealthAlly,
        pokemon
      )
      pokemon.broadcastAbility({
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class MeditateStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff = MEDITATE_ABILITY_PARAMS.attackBuffRatio
    pokemon.addAttack(buff * pokemon.baseAtk, pokemon, 1, crit)
  }
}

export class CosmicPowerMoonStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const apGain = COSMIC_POWER_MOON_ABILITY_PARAMS.abilityPowerGain
    board.forEach((x, y, ally) => {
      if (ally && ally.id !== pokemon.id && ally.team === pokemon.team) {
        ally.addAbilityPower(apGain, pokemon, 1, crit)
      }
    })
  }
}

export class CosmicPowerSunStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const atkBuffMultiplier = COSMIC_POWER_SUN_ABILITY_PARAMS.attackRatio
    board.forEach((x, y, ally) => {
      if (ally && ally.id !== pokemon.id && ally.team === pokemon.team) {
        ally.addAttack(atkBuffMultiplier * ally.baseAtk, pokemon, 1, crit)
      }
    })
  }
}

export class DefenseCurlStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff =
      DEFENSE_CURL_ABILITY_PARAMS.defenseBuffByStar[pokemon.stars - 1] ??
      DEFENSE_CURL_ABILITY_PARAMS.defenseBuffByStar.at(-1)!
    pokemon.addDefense(buff, pokemon, 1, crit)
    pokemon.addSpecialDefense(buff, pokemon, 1, crit)
    pokemon.resetCooldown(DEFENSE_CURL_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class IronHeadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff: number =
      IRON_HEAD_ABILITY_PARAMS.defenseBuffByStar[pokemon.stars - 1] ??
      IRON_HEAD_ABILITY_PARAMS.defenseBuffByStar.at(-1)!
    pokemon.addDefense(buff, pokemon, 1, crit)
    pokemon.addSpecialDefense(buff, pokemon, 1, crit)
    target.handleSpecialDamage(
      pokemon.def + pokemon.speDef,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class IronDefenseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield: number =
      IRON_DEFENSE_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      IRON_DEFENSE_ABILITY_PARAMS.shieldByStar.at(-1)!
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team && y === pokemon.positionY) {
        ally.addShield(shield, pokemon, 1, crit)
      }
    })
  }
}

export class SoakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SOAK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SOAK_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addPP(SOAK_ABILITY_PARAMS.allyPpGain, pokemon, 0, false)
      }
    })
  }
}

export class IronTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(
      pokemon.def * IRON_TAIL_ABILITY_PARAMS.defenseDamageMultiplier
    )
    const cellsHit = board.getCellsInFront(pokemon, target, 1)

    for (const cell of cellsHit) {
      if (cell.value && cell.value.team !== pokemon.team) {
        const orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY,
          pokemon,
          undefined
        )
        const destination = board.getKnockBackPlace(
          cell.value.positionX,
          cell.value.positionY,
          orientation
        )

        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board, true)
          cell.value.cooldown = IRON_TAIL_ABILITY_PARAMS.knockbackCooldownMs
        }
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}

export class BlastBurnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      BLAST_BURN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BLAST_BURN_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class TwisterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      TWISTER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TWISTER_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const flyRange =
      TWISTER_ABILITY_PARAMS.flyRangeByStar[pokemon.stars - 1] ??
      TWISTER_ABILITY_PARAMS.flyRangeByStar.at(-1)!
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const freeCells = board
          .getCellsInRadius(cell.x, cell.y, flyRange, false)
          .filter((cell) => board.getEntityOnCell(cell.x, cell.y) === undefined)
        // filter the cells at max distance from cell
        const distances = freeCells.map((cell) =>
          distanceM(cell.x, cell.y, pokemon.positionX, pokemon.positionY)
        )
        const maxDistance = Math.max(...distances)
        const farthestCells = freeCells.filter(
          (cell, i) => distances[i] === maxDistance
        )
        const destination = pickRandomIn(farthestCells)
        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board, true)
        }
      } else if (
        cell.value &&
        pokemon.team === cell.value.team &&
        pokemon.id !== cell.value.id &&
        cell.value.hasSynergyEffect(Synergy.FLYING)
      ) {
        cell.value.flyAway(board)
      }
    })
  }
}

export class ChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.effects.add(EffectEnum.CHARGE)
  }
}

export class TailwindStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff =
      TAILWIND_ABILITY_PARAMS.speedBuffByStar[pokemon.stars - 1] ??
      TAILWIND_ABILITY_PARAMS.speedBuffByStar.at(-1)!
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addSpeed(buff, pokemon, 1, crit)
      }
    })
  }
}

export class SludgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbStacks =
      SLUDGE_ABILITY_PARAMS.stackCountByStar[pokemon.stars - 1] ??
      SLUDGE_ABILITY_PARAMS.stackCountByStar.at(-1)!
    const duration = Math.round(
      SLUDGE_ABILITY_PARAMS.poisonDurationBaseMs *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    const cells = board.getCellsInFront(pokemon, target)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        for (let i = 0; i < nbStacks; i++) {
          cell.value.status.triggerPoison(duration, cell.value, pokemon)
        }
      }
    })
  }
}

export class SludgeWaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = Math.round(
      (SLUDGE_WAVE_ABILITY_PARAMS.poisonDurationByStarMs[pokemon.stars - 1] ??
        SLUDGE_WAVE_ABILITY_PARAMS.poisonDurationByStarMs.at(-1)!) *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    const damage =
      SLUDGE_WAVE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SLUDGE_WAVE_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          cell.value.status.triggerPoison(duration, cell.value, pokemon)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class DischargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DISCHARGE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DISCHARGE_ABILITY_PARAMS.damageByStar.at(-1)!

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerParalysis(
          DISCHARGE_ABILITY_PARAMS.paralysisDurationMs,
          cell.value,
          pokemon
        )
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class ShockwaveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SHOCKWAVE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SHOCKWAVE_ABILITY_PARAMS.damageByStar.at(-1)!
    const range =
      SHOCKWAVE_ABILITY_PARAMS.baseRange +
      (pokemon.status.electricField
        ? SHOCKWAVE_ABILITY_PARAMS.electricFieldBonusRange
        : 0)
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, range, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          const distance = distanceC(
            pokemon.positionX,
            pokemon.positionY,
            cell.x,
            cell.y
          )
          const damageMultiplier =
            1 - SHOCKWAVE_ABILITY_PARAMS.damageDecayPerTile * distance
          cell.value.handleSpecialDamage(
            Math.round(damage * damageMultiplier),
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class DiveStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage =
      DIVE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DIVE_ABILITY_PARAMS.damageByStar.at(-1)!
    const shield =
      DIVE_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      DIVE_ABILITY_PARAMS.shieldByStar.at(-1)!
    const freezeDuration = DIVE_ABILITY_PARAMS.freezeDurationMs
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    pokemon.addShield(shield, pokemon, 0, false)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )

      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerFreeze(freezeDuration, cell.value, pokemon)
        }
      })
    }
  }
}

export class SmokeScreenStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      SMOKE_SCREEN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SMOKE_SCREEN_ABILITY_PARAMS.damageByStar.at(-1)!
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )

      const backRow = mostSurroundedCoordinate.y <= 2 ? 0 : 5
      const midRow = mostSurroundedCoordinate.y <= 2 ? 1 : 4
      const frontRow = mostSurroundedCoordinate.y <= 2 ? 2 : 3
      let chosenRowForSmoke = frontRow

      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          pokemon.broadcastAbility({
            targetX: cell.x,
            targetY: cell.y
          })

          if (cell.y === backRow) chosenRowForSmoke = backRow
          if (cell.y === midRow && chosenRowForSmoke !== backRow)
            chosenRowForSmoke = midRow
        }
      })

      const smokeCells = [
        [pokemon.positionX - 1, chosenRowForSmoke],
        [pokemon.positionX, chosenRowForSmoke],
        [pokemon.positionX + 1, chosenRowForSmoke]
      ].filter(
        ([x, y]) =>
          y >= 0 &&
          y < board.rows &&
          x >= 0 &&
          x < board.columns &&
          !(x === pokemon.positionX && y === pokemon.positionY)
      )

      smokeCells.forEach(([x, y]) => {
        board.addBoardEffect(x, y, EffectEnum.SMOKE, pokemon.simulation)
      })
    }
  }
}

export class StrangeSteamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.count.ult * STRANGE_STEAM_ABILITY_PARAMS.rangeGainPerCast,
        true
      )
      .forEach((cell) => {
        board.addBoardEffect(
          cell.x,
          cell.y,
          EffectEnum.STRANGE_STEAM_BOARD_EFFECT,
          pokemon.simulation
        )
        if (cell.value && cell.value.team !== pokemon.team) {
          if (chance(STRANGE_STEAM_ABILITY_PARAMS.confusionChance, pokemon)) {
            cell.value.status.triggerConfusion(
              STRANGE_STEAM_ABILITY_PARAMS.confusionDurationMs,
              cell.value,
              pokemon
            )
          }
        } else if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.addFairyField(cell.value)
        }
      })
  }
}

export class BiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      BITE_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
      BITE_ABILITY_PARAMS.baseDamageByStar.at(-1)!
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    pokemon.handleHeal(
      Math.ceil(BITE_ABILITY_PARAMS.healTakenDamageRatio * takenDamage),
      pokemon,
      0,
      false
    )
    if (takenDamage > 0)
      target.status.triggerFlinch(
        BITE_ABILITY_PARAMS.flinchDurationMs,
        target,
        pokemon
      )
  }
}

export class AppleAcidStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const { baseDamage, speDefZeroMultiplier } = APPLE_ACID_ABILITY_PARAMS
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          cell.value.speDef === 0
            ? baseDamage * speDefZeroMultiplier
            : baseDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
      }
    })
  }
}

export class GravAppleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const { baseDamage, defZeroMultiplier } = GRAV_APPLE_ABILITY_PARAMS
    target.handleSpecialDamage(
      target.def === 0 ? baseDamage * defZeroMultiplier : baseDamage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
  }
}

export class NutrientsStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const { heal, defenseBuff, specialDefenseBuff } = NUTRIENTS_ABILITY_PARAMS

    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      lowestHealthAlly.addDefense(defenseBuff, pokemon, 1, crit)
      lowestHealthAlly.addSpecialDefense(specialDefenseBuff, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class SyrupBombStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const { damage, speedDebuff } = SYRUP_BOMB_ABILITY_PARAMS

    const highestSpeedEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => b.speed - a.speed)[0]

    if (highestSpeedEnemy) {
      highestSpeedEnemy.addSpeed(-speedDebuff, pokemon, 1, crit)
      highestSpeedEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: highestSpeedEnemy.positionX,
        targetY: highestSpeedEnemy.positionY
      })
    }
  }
}

export class FickleBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const highestSpeedEnemies = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => b.speed - a.speed)

    let numberOfBeam = 0
    for (let i = 0; i < FICKLE_BEAM_ABILITY_PARAMS.beamCount; i++) {
      chance(FICKLE_BEAM_ABILITY_PARAMS.beamChance, pokemon) && numberOfBeam++
    }

    for (let i = 0; i < numberOfBeam; i++) {
      const enemy = highestSpeedEnemies[i % highestSpeedEnemies.length]
      if (enemy) {
        enemy.status.triggerParalysis(
          FICKLE_BEAM_ABILITY_PARAMS.paralysisDurationMs,
          enemy,
          pokemon,
          false
        )
        enemy.handleSpecialDamage(
          FICKLE_BEAM_ABILITY_PARAMS.damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: enemy.positionX,
          targetY: enemy.positionY
        })
      }
    }
  }
}

export class PsybeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      PSYBEAM_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
      PSYBEAM_ABILITY_PARAMS.baseDamageByStar.at(-1)!

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(PSYBEAM_ABILITY_PARAMS.confusionChance, pokemon)) {
          cell.value.status.triggerConfusion(
            PSYBEAM_ABILITY_PARAMS.confusionDurationMs,
            cell.value,
            pokemon
          )
        }
      }
    })
  }
}

export class HydroSteamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      HYDRO_STEAM_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
      HYDRO_STEAM_ABILITY_PARAMS.baseDamageByStar.at(-1)!

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    const cellsHit = [[pokemon.positionX + dx, pokemon.positionY + dy]]
    for (const o of orientations) {
      cellsHit.push([
        pokemon.positionX + dx + OrientationVector[o][0],
        pokemon.positionY + dy + +OrientationVector[o][1]
      ])
    }

    cellsHit.forEach((cell) => {
      const value = board.getEntityOnCell(cell[0], cell[1])
      if (value && value.team !== pokemon.team) {
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        value.status.triggerBurn(
          HYDRO_STEAM_ABILITY_PARAMS.burnDurationMs,
          value,
          pokemon
        )
      }
    })
  }
}

export class CavernousChompStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Deals 40/80/160 damage to the target. If the user is able to KO the target with its ability, it becomes Enraged for 1/2/3 seconds.
    const damage =
      CAVERNOUS_CHOMP_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      CAVERNOUS_CHOMP_ABILITY_PARAMS.damageByStar.at(-1)!
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death) {
      const enragedDuration =
        CAVERNOUS_CHOMP_ABILITY_PARAMS.enragedDurationByStar[
          pokemon.stars - 1
        ] ?? CAVERNOUS_CHOMP_ABILITY_PARAMS.enragedDurationByStar.at(-1)!
      pokemon.status.triggerRage(enragedDuration, pokemon)
    }
  }
}

export class PresentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const chance = Math.pow(Math.random(), 1 - pokemon.luck / 100)
    /* 80 damage: 40%
       150 damage: 30%
       300 damage: 20%
       heal 50HP: 10%
    */
    if (chance < PRESENT_ABILITY_PARAMS.healChance) {
      target.handleHeal(PRESENT_ABILITY_PARAMS.healAmount, pokemon, 0, false)
    } else if (chance < PRESENT_ABILITY_PARAMS.lowDamageChance) {
      target.handleSpecialDamage(
        PRESENT_ABILITY_PARAMS.lowDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else if (chance < PRESENT_ABILITY_PARAMS.mediumDamageChance) {
      target.handleSpecialDamage(
        PRESENT_ABILITY_PARAMS.mediumDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      target.handleSpecialDamage(
        PRESENT_ABILITY_PARAMS.highDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class SacredSwordGrassStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbRemainingAllies = board.cells.filter(
      (p) => p && p.team === pokemon.team
    ).length
    const damage =
      SACRED_SWORD_GRASS_ABILITY_PARAMS.baseTrueDamage +
      SACRED_SWORD_GRASS_ABILITY_PARAMS.bonusTrueDamagePerRemainingAlly *
        nbRemainingAllies
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class SacredSwordIronStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
    const damage =
      SACRED_SWORD_IRON_ABILITY_PARAMS.baseTrueDamage +
      SACRED_SWORD_IRON_ABILITY_PARAMS.bonusTrueDamagePerFallenAlly *
        nbFallenAllies
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class SacredSwordCavernStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const numberOfEnemiesInOurSide = board.cells.filter(
      (cell) =>
        cell &&
        cell.team !== pokemon.team &&
        (pokemon.team === Team.BLUE_TEAM
          ? cell.positionY < 3
          : cell.positionY > 2)
    ).length
    const damage =
      SACRED_SWORD_CAVERN_ABILITY_PARAMS.baseTrueDamage +
      SACRED_SWORD_CAVERN_ABILITY_PARAMS.bonusTrueDamagePerEnemyOnOwnSide *
        numberOfEnemiesInOurSide
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class SecretSwordStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SECRET_SWORD_ABILITY_PARAMS.damage
    const damageType =
      pokemon.count.fightingBlockCount >=
      SECRET_SWORD_ABILITY_PARAMS.fightingBlockThresholdForTrueDamage
        ? AttackType.TRUE
        : AttackType.SPECIAL
    target.handleSpecialDamage(damage, board, damageType, pokemon, crit)
  }
}

export class MetalBurstStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.floor(
      METAL_BURST_ABILITY_PARAMS.baseDamage +
        METAL_BURST_ABILITY_PARAMS.damagePerFightingBlock *
          pokemon.count.fightingBlockCount
    )
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class ThunderCageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerLocked(
            THUNDER_CAGE_ABILITY_PARAMS.lockDurationMs,
            cell.value
          )
          cell.value.status.triggerParalysis(
            THUNDER_CAGE_ABILITY_PARAMS.paralysisDurationMs,
            cell.value,
            pokemon
          )
          cell.value.handleSpecialDamage(
            THUNDER_CAGE_ABILITY_PARAMS.damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class LeafBladeStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, true)
    const damage = pokemon.atk * LEAF_BLADE_ABILITY_PARAMS.atkMultiplier
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, true)
  }
}

export class WaterfallStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const shield =
      WATERFALL_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      WATERFALL_ABILITY_PARAMS.shieldByStar.at(-1)!
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
    board.clearBoardEffect(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.simulation
    )
  }
}

export class XScissorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      X_SCISSOR_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      X_SCISSOR_ABILITY_PARAMS.damageByStar.at(-1)!
    for (let i = 0; i < X_SCISSOR_ABILITY_PARAMS.hitCount; i++) {
      target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    }
  }
}

export class DragonTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DRAGON_TAIL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DRAGON_TAIL_ABILITY_PARAMS.damageByStar.at(-1)!
    const defenseBuff =
      DRAGON_TAIL_ABILITY_PARAMS.defenseBuffByStar[pokemon.stars - 1] ??
      DRAGON_TAIL_ABILITY_PARAMS.defenseBuffByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addDefense(defenseBuff, pokemon, 1, crit)
    pokemon.addSpecialDefense(defenseBuff, pokemon, 1, crit)
  }
}

export class AquaTailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      AQUA_TAIL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      AQUA_TAIL_ABILITY_PARAMS.damageByStar.at(-1)!
    const shield =
      AQUA_TAIL_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      AQUA_TAIL_ABILITY_PARAMS.shieldByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addShield(shield, pokemon, 1, crit)
  }
}

export class DragonBreathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DRAGON_BREATH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DRAGON_BREATH_ABILITY_PARAMS.damageByStar.at(-1)!
    const maxRange = pokemon.range + 1

    effectInOrientation(
      board,
      pokemon,
      target,
      (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      },
      maxRange
    )
  }
}

export class IcicleCrashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      ICICLE_CRASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ICICLE_CRASH_ABILITY_PARAMS.damageByStar.at(-1)!

    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class SteamEruptionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = STEAM_ERUPTION_ABILITY_PARAMS.damage
    const burnDuration = STEAM_ERUPTION_ABILITY_PARAMS.burnDurationMs

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(burnDuration, cell.value, pokemon)
      }
    })
  }
}

export class IngrainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal =
      INGRAIN_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      INGRAIN_ABILITY_PARAMS.healByStar.at(-1)!
    const damage =
      INGRAIN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      INGRAIN_ABILITY_PARAMS.damageByStar.at(-1)!
    const lockedDuration = INGRAIN_ABILITY_PARAMS.lockedDurationMs

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team == cell.value.team) {
        cell.value.handleHeal(heal, pokemon, 1, crit)
      } else if (cell.value && pokemon.team !== cell.value.team) {
        cell.value.status.triggerLocked(lockedDuration, cell.value)
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class TormentStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const boost =
      TORMENT_ABILITY_PARAMS.speedBoostByStar[pokemon.stars - 1] ??
      TORMENT_ABILITY_PARAMS.speedBoostByStar.at(-1)!
    pokemon.addSpeed(boost, pokemon, 1, crit)
    pokemon.resetCooldown(TORMENT_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class StompStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageFactor =
      STOMP_ABILITY_PARAMS.damageFactorByStar[pokemon.stars - 1] ??
      STOMP_ABILITY_PARAMS.damageFactorByStar.at(-1)!
    const damage = pokemon.atk * damageFactor
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class HornDrillStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damageFactor: number =
      HORN_DRILL_ABILITY_PARAMS.atkMultiplierByStar[pokemon.stars - 1] ??
      HORN_DRILL_ABILITY_PARAMS.atkMultiplierByStar.at(-1)!
    let damage = pokemon.atk * damageFactor
    const executeChance =
      HORN_DRILL_ABILITY_PARAMS.baseExecuteChance *
      (1 + min(0)((pokemon.atk - target.atk) / target.atk))
    if (chance(executeChance, pokemon)) {
      damage = HORN_DRILL_ABILITY_PARAMS.executeDamage
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ShadowBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SHADOW_BALL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SHADOW_BALL_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    board.forEach((x: number, y: number, v: PokemonEntity | undefined) => {
      if (v && pokemon.team != v.team) {
        v.addSpecialDefense(
          -SHADOW_BALL_ABILITY_PARAMS.specialDefenseReduction,
          pokemon,
          0,
          false
        )
      }
    })
  }
}

export class BugBuzzStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage =
      BUG_BUZZ_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BUG_BUZZ_ABILITY_PARAMS.damageByStar.at(-1)!

    if (target.status.paralysis) {
      damage *= BUG_BUZZ_ABILITY_PARAMS.paralyzedMultiplier
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class StringShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      STRING_SHOT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      STRING_SHOT_ABILITY_PARAMS.damageByStar.at(-1)!

    target.status.triggerParalysis(
      STRING_SHOT_ABILITY_PARAMS.paralysisDurationMs,
      target,
      pokemon
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EntanglingThreadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      ENTANGLING_THREAD_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ENTANGLING_THREAD_ABILITY_PARAMS.damageByStar.at(-1)!

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team !== cell.value.team) {
        cell.value.status.triggerParalysis(
          ENTANGLING_THREAD_ABILITY_PARAMS.paralysisDurationMs,
          cell.value,
          pokemon
        )
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class VenoshockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage =
      VENOSHOCK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      VENOSHOCK_ABILITY_PARAMS.damageByStar.at(-1)!

    if (pokemon.status.poisonStacks > 0) {
      damage = damage * VENOSHOCK_ABILITY_PARAMS.poisonDamageMultiplier
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class LeechLifeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      LEECH_LIFE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      LEECH_LIFE_ABILITY_PARAMS.damageByStar.at(-1)!
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    pokemon.handleHeal(takenDamage, pokemon, 0, false)
  }
}

export class HappyHourStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff: number =
      HAPPY_HOUR_ABILITY_PARAMS.atkBuffByStar[pokemon.stars - 1] ??
      HAPPY_HOUR_ABILITY_PARAMS.atkBuffByStar.at(-1)!
    board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
      if (ally && pokemon.team == ally.team) {
        ally.addAttack(buff, pokemon, 1, crit)
      }
    })
  }
}

export class TeleportStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, false) // crit is handled with TELEPORT_NEXT_ATTACK effect

    const potentialCells = [
      [0, 0],
      [0, board.rows - 1],
      [board.columns - 1, board.rows - 1],
      [board.columns - 1, 0]
    ]
    shuffleArray(potentialCells)

    for (let i = 0; i < potentialCells.length; i++) {
      const entity = board.getEntityOnCell(
        potentialCells[i][0],
        potentialCells[i][1]
      )
      if (entity === undefined) {
        pokemon.moveTo(potentialCells[i][0], potentialCells[i][1], board, false)
        pokemon.effects.add(EffectEnum.TELEPORT_NEXT_ATTACK)
        break
      }
    }
  }
}

export class NastyPlotStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff = NASTY_PLOT_ABILITY_PARAMS.attackBuff
    pokemon.addAttack(buff, pokemon, 1, crit)
    pokemon.resetCooldown(NASTY_PLOT_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class TakeHeartStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(TAKE_HEART_ABILITY_PARAMS.attackBuff, pokemon, 1, crit)
    pokemon.addSpecialDefense(
      TAKE_HEART_ABILITY_PARAMS.specialDefenseBuff,
      pokemon,
      1,
      crit
    )
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
    pokemon.resetCooldown(TAKE_HEART_ABILITY_PARAMS.cooldownReductionPercent)
  }
}

export class HeartSwapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
    const boostAP = target.ap
    const speDefLost = target.speDef - target.baseSpeDef
    const apLost = target.ap

    target.handleSpecialDamage(
      HEART_SWAP_ABILITY_PARAMS.damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    if (target.items.has(Item.TWIST_BAND) === false) {
      target.addSpecialDefense(-speDefLost, pokemon, 0, false)
      target.addAbilityPower(-apLost, pokemon, 0, false)
      pokemon.addSpecialDefense(boostSpeDef, pokemon, 0, false)
      pokemon.addAbilityPower(boostAP, pokemon, 0, false)
    }

    pokemon.status.transferNegativeStatus(pokemon, target)
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
  }
}

export class SpectralThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const damage = SPECTRAL_THIEF_ABILITY_PARAMS.damage
    if (farthestCoordinate) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
      const PkmClass = PokemonClasses[PkmByIndex[target.index]]
      if (!PkmClass)
        return logger.error(
          `Spectral Thief: No class found for ${target.name} [index ${target.index}]`
        )

      if (target.items.has(Item.TWIST_BAND) === false) {
        const base = new PkmClass(target.name)
        const boostAtk = min(0)(target.atk - target.baseAtk)
        const boostSpeed = min(0)(target.speed - base.speed)
        const boostDef = min(0)(target.def - target.baseDef)
        const boostSpeDef = min(0)(target.speDef - target.baseSpeDef)
        const boostAP = target.ap
        const boostHP = min(0)(target.maxHP - base.hp)
        const boostCritChance = min(0)(target.critChance - base.critChance)
        const boostCritPower = min(0)(target.critPower - base.critPower)
        const boostLuck = min(0)(target.luck - base.luck)

        target.addAttack(-boostAtk, pokemon, 0, false)
        target.addSpeed(-boostSpeed, pokemon, 0, false)
        target.addDefense(-boostDef, pokemon, 0, false)
        target.addSpecialDefense(-boostSpeDef, pokemon, 0, false)
        target.addAbilityPower(-boostAP, pokemon, 0, false)
        target.addMaxHP(-boostHP, pokemon, 0, false)
        target.addCritChance(-boostCritChance, pokemon, 0, false)
        target.addCritPower(-boostCritPower, pokemon, 0, false)
        target.addLuck(-boostLuck, pokemon, 0, false)

        pokemon.addAttack(boostAtk, pokemon, 0, false)
        pokemon.addDefense(boostDef, pokemon, 0, false)
        pokemon.addSpecialDefense(boostSpeDef, pokemon, 0, false)
        pokemon.addAbilityPower(boostAP, pokemon, 0, false)
        pokemon.addSpeed(boostSpeed, pokemon, 0, false)
        pokemon.addMaxHP(boostHP, pokemon, 0, false)
        pokemon.addCritChance(boostCritChance, pokemon, 0, false)
        pokemon.addCritPower(boostCritPower, pokemon, 0, false)
        pokemon.addLuck(boostLuck, pokemon, 0, false)
      }
    }
  }
}

export class StoredPowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const PkmClass = PokemonClasses[PkmByIndex[target.index]]
    const baseSpeed = PkmClass ? new PkmClass(target.name).speed : DEFAULT_SPEED
    const boostSpeed = min(0)(pokemon.speed / baseSpeed - 1)
    const boostAtk = min(0)(pokemon.atk / pokemon.baseAtk - 1)
    const boostDef = min(0)(pokemon.def / pokemon.baseDef - 1)
    const boostSpeDef = min(0)(pokemon.speDef / pokemon.baseSpeDef - 1)
    const boostAP = min(0)(pokemon.ap / 100 - 1)

    const damage = Math.round(
      STORED_POWER_ABILITY_PARAMS.baseDamage *
        (STORED_POWER_ABILITY_PARAMS.baseMultiplier +
          boostAtk +
          boostDef +
          boostSpeDef +
          boostSpeed +
          boostAP)
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      THIEF_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      THIEF_ABILITY_PARAMS.damageByStar.at(-1)!

    target.items.forEach((item) => {
      pokemon.addItem(item)
      target.removeItem(item)
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class KnockOffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      KNOCK_OFF_ABILITY_PARAMS.baseDamage +
      target.items.size * KNOCK_OFF_ABILITY_PARAMS.damagePerTargetItem

    target.items.forEach((item) => {
      target.removeItem(item)
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class StunSporeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      STUN_SPORE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      STUN_SPORE_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerParalysis(
            STUN_SPORE_ABILITY_PARAMS.paralysisDurationMs,
            cell.value,
            pokemon
          )
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class MeteorMashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbHits =
      METEOR_MASH_ABILITY_PARAMS.baseHits +
      (pokemon.status.psychicField
        ? METEOR_MASH_ABILITY_PARAMS.bonusHitsInPsychicField
        : 0)
    const damage = pokemon.atk * METEOR_MASH_ABILITY_PARAMS.atkDamageRatio
    for (let n = 0; n < nbHits; n++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      pokemon.addAttack(
        METEOR_MASH_ABILITY_PARAMS.atkBuffPerHit,
        pokemon,
        0,
        false
      )
    }
  }
}

export class HurricaneStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      HURRICANE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HURRICANE_ABILITY_PARAMS.damageByStar.at(-1)!

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(
          HURRICANE_ABILITY_PARAMS.paralysisDurationMs,
          cell.value,
          pokemon
        )
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class FleurCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = FLEUR_CANNON_ABILITY_PARAMS.damage
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
    pokemon.addAbilityPower(
      -FLEUR_CANNON_ABILITY_PARAMS.apReduction,
      pokemon,
      0,
      false
    )
  }
}

export class SandsearStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SANDSEAR_STORM_ABILITY_PARAMS.damage

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(
          SANDSEAR_STORM_ABILITY_PARAMS.burnDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class WildboltStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = WILDBOLT_STORM_ABILITY_PARAMS.damage

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.status.triggerParalysis(
          WILDBOLT_STORM_ABILITY_PARAMS.paralysisDurationMs,
          cell.value,
          pokemon
        )
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class BleakwindStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = BLEAKWIND_STORM_ABILITY_PARAMS.damage

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerFreeze(
          BLEAKWIND_STORM_ABILITY_PARAMS.freezeDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class SpringtideStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SPRINGTIDE_STORM_ABILITY_PARAMS.damage

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerCharm(
          SPRINGTIDE_STORM_ABILITY_PARAMS.charmDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class FakeTearsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FAKE_TEARS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FAKE_TEARS_ABILITY_PARAMS.damageByStar.at(-1)!

    board.forEach((x: number, y: number, value: PokemonEntity | undefined) => {
      if (value && pokemon.team != value.team) {
        value.status.triggerArmorReduction(
          FAKE_TEARS_ABILITY_PARAMS.armorReductionDurationMs,
          value
        )
        pokemon.broadcastAbility({ positionX: x, positionY: y })
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class SparklingAriaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SPARKLING_ARIA_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SPARKLING_ARIA_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    cells.forEach((cell) => {
      const entity = cell.value
      if (entity && entity.team !== pokemon.team) {
        entity.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      } else if (entity && entity.team === pokemon.team && entity.status.burn) {
        entity.status.healBurn(entity)
        entity.effects.add(EffectEnum.IMMUNITY_BURN)
        entity.commands.push(
          new DelayedCommand(() => {
            entity.effects.delete(EffectEnum.IMMUNITY_BURN)
          }, SPARKLING_ARIA_ABILITY_PARAMS.burnImmunityDurationMs)
        )
      }
    })
  }
}

export class DragonDartsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DRAGON_DARTS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DRAGON_DARTS_ABILITY_PARAMS.damageByStar.at(-1)!

    for (let n = 0; n < DRAGON_DARTS_ABILITY_PARAMS.hitCount; n++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
    if (target.hp <= 0) {
      pokemon.addPP(DRAGON_DARTS_ABILITY_PARAMS.ppGainOnKill, pokemon, 0, false)
    }
  }
}

export class MetronomeStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const threshold = Math.pow(Math.random(), 1 + pokemon.luck / 100)
    let rarity = Rarity.COMMON
    if (threshold < METRONOME_ABILITY_PARAMS.ultraThreshold) {
      rarity = Rarity.ULTRA
    } else if (threshold < METRONOME_ABILITY_PARAMS.legendaryThreshold) {
      rarity = Rarity.LEGENDARY
    } else if (threshold < METRONOME_ABILITY_PARAMS.epicThreshold) {
      rarity = Rarity.EPIC
    } else if (threshold < METRONOME_ABILITY_PARAMS.uniqueThreshold) {
      rarity = Rarity.UNIQUE
    } else if (threshold < METRONOME_ABILITY_PARAMS.rareThreshold) {
      rarity = Rarity.RARE
    } else if (threshold < METRONOME_ABILITY_PARAMS.specialThreshold) {
      rarity = Rarity.SPECIAL
    } else if (threshold < METRONOME_ABILITY_PARAMS.uncommonThreshold) {
      rarity = Rarity.UNCOMMON
    } else {
      rarity = Rarity.COMMON
    }

    const pokemonOptions = PRECOMPUTED_POKEMONS_PER_RARITY[rarity]
    if (rarity === Rarity.SPECIAL) {
      pokemonOptions.push(...PRECOMPUTED_POKEMONS_PER_RARITY[Rarity.HATCH])
    }

    const skillOptions = [
      ...new Set(pokemonOptions.map((p) => getPokemonData(p).skill))
    ]

    const skill = pickRandomIn(
      skillOptions.filter((s) => AbilityStrategies[s].copyable)
    )

    pokemon.broadcastAbility({ skill })
    AbilityStrategies[skill].process(pokemon, board, target, crit)

    pokemon.simulation.broadcastToSpectators(Transfer.DISPLAY_TEXT, {
      id: pokemon.simulation.id,
      text: `ability.${skill}`,
      x: pokemon.positionX,
      y: pokemon.positionY
    })
  }
}

export class SkyAttackStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            skill: Ability.SKY_ATTACK,
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, SKY_ATTACK_ABILITY_PARAMS.castDelayMs / 2)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target?.hp > 0) {
            const damage = SKY_ATTACK_ABILITY_PARAMS.damage
            destination.target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, SKY_ATTACK_ABILITY_PARAMS.castDelayMs)
      )
    }
  }
}

export class SkyAttackShadowStrategy extends AbilityStrategy {
  requiresTarget = false
  canCritByDefault = true
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            skill: Ability.SKY_ATTACK,
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, SKY_ATTACK_SHADOW_ABILITY_PARAMS.castDelayMs / 2)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target?.hp > 0) {
            const damage = SKY_ATTACK_SHADOW_ABILITY_PARAMS.damage
            destination.target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, SKY_ATTACK_SHADOW_ABILITY_PARAMS.castDelayMs)
      )
    }
  }
}

export class FlyingPressStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, FLYING_PRESS_ABILITY_PARAMS.broadcastDelayMs)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target && destination.target.hp > 0) {
            const damage =
              FLYING_PRESS_ABILITY_PARAMS.maxHpRatio * pokemon.maxHP
            destination.target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, FLYING_PRESS_ABILITY_PARAMS.delayMs)
      )
    }
  }
}

export class AgilityStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const boost =
      AGILITY_ABILITY_PARAMS.speedBoostByStar[pokemon.stars - 1] ??
      AGILITY_ABILITY_PARAMS.speedBoostByStar.at(-1)!
    pokemon.addSpeed(boost, pokemon, 1, crit)
  }
}

export class SpiritShackleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SPIRIT_SHACKLE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SPIRIT_SHACKLE_ABILITY_PARAMS.damageByStar.at(-1)!

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerWound(
          SPIRIT_SHACKLE_ABILITY_PARAMS.woundDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class WaterShurikenStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      WATER_SHURIKEN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      WATER_SHURIKEN_ABILITY_PARAMS.damageByStar.at(-1)!
    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    orientations.forEach((orientation) => {
      effectInOrientation(board, pokemon, orientation, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
    })
  }
}

export class RazorLeafStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      RAZOR_LEAF_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      RAZOR_LEAF_ABILITY_PARAMS.damageByStar.at(-1)!
    effectInOrientation(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class PsychoCutStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      PSYCHO_CUT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PSYCHO_CUT_ABILITY_PARAMS.damageByStar.at(-1)!
    effectInOrientation(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        for (let i = 0; i < PSYCHO_CUT_ABILITY_PARAMS.hitCount; i++) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }
    })
  }
}

export class ShadowSneakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SHADOW_SNEAK_ABILITY_PARAMS.damage
    const damageType = target.status.silence
      ? AttackType.TRUE
      : AttackType.SPECIAL
    target.handleSpecialDamage(damage, board, damageType, pokemon, crit)
  }
}

export class PlasmaFistStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = PLASMA_FIST_ABILITY_PARAMS.damage
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (takenDamage > 0) {
      pokemon.handleHeal(
        Math.round(takenDamage * PLASMA_FIST_ABILITY_PARAMS.healRatio),
        pokemon,
        0,
        false
      )
    }
  }
}

export class ForecastStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board.forEach((x: number, y: number, p: PokemonEntity | undefined) => {
      if (p && pokemon.team === p.team) {
        p.addShield(FORECAST_ABILITY_PARAMS.shield, pokemon, 1, crit)
        if (pokemon.name === Pkm.CASTFORM_SUN) {
          p.addAttack(FORECAST_ABILITY_PARAMS.atkBuff, pokemon, 1, crit)
        }
        if (pokemon.name === Pkm.CASTFORM_RAIN) {
          p.addPP(FORECAST_ABILITY_PARAMS.ppBuff, pokemon, 1, crit)
        }
        if (pokemon.name === Pkm.CASTFORM_HAIL) {
          p.addDefense(FORECAST_ABILITY_PARAMS.defBuff, pokemon, 1, crit)
          p.addSpecialDefense(
            FORECAST_ABILITY_PARAMS.speDefBuff,
            pokemon,
            1,
            crit
          )
        }
      }
    })
  }
}

export class MachPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      MACH_PUNCH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MACH_PUNCH_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.resetCooldown(MACH_PUNCH_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class MegaPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = MEGA_PUNCH_ABILITY_PARAMS.baseDamage
    if (pokemon.def > target.def) {
      damage *= MEGA_PUNCH_ABILITY_PARAMS.defAdvantageMultiplier
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MawashiGeriStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = MAWASHI_GERI_ABILITY_PARAMS.baseDamage
    if (pokemon.atk > target.atk) {
      damage *= MAWASHI_GERI_ABILITY_PARAMS.atkAdvantageMultiplier
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    let farthestEmptyCell: Cell | null = null
    effectInOrientation(board, pokemon, target, (cell) => {
      if (!cell.value) {
        farthestEmptyCell = cell
      }
    })
    if (farthestEmptyCell != null) {
      const { x, y } = farthestEmptyCell as Cell
      target.moveTo(x, y, board, true)
    }
  }
}

export class HeadbuttStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      HEADBUTT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEADBUTT_ABILITY_PARAMS.damageByStar.at(-1)!
    if (pokemon.passive === Passive.EISCUE_ICE_FACE) {
      damage += pokemon.shield
      pokemon.addShield(-pokemon.shield, pokemon, 0, false)
    }
    if (target.shield > 0) {
      damage *= 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(
      HEADBUTT_ABILITY_PARAMS.flinchDurationMs,
      target,
      pokemon
    )
  }
}

export class DizzyPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      DIZZY_PUNCH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DIZZY_PUNCH_ABILITY_PARAMS.damageByStar.at(-1)!
    if (target.shield > 0) {
      damage *= 2
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerConfusion(
      DIZZY_PUNCH_ABILITY_PARAMS.confusionDurationMs,
      target,
      pokemon
    )
  }
}

export class TripleKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = TRIPLE_KICK_ABILITY_PARAMS.damage

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    let count = 0
    cells.forEach((cell) => {
      if (cell.value && pokemon.team !== cell.value.team) {
        count++
        if (count <= TRIPLE_KICK_ABILITY_PARAMS.maxTargets) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        }
      }
    })
  }
}

export class GeomancyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(GEOMANCY_ABILITY_PARAMS.atkBuff, pokemon, 1, crit)
    pokemon.addSpecialDefense(
      GEOMANCY_ABILITY_PARAMS.speDefBuff,
      pokemon,
      1,
      crit
    )
    pokemon.addSpeed(GEOMANCY_ABILITY_PARAMS.speedBuff, pokemon, 0, false)
  }
}

export class DeathWingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = DEATH_WING_ABILITY_PARAMS.damage
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (takenDamage > 0) {
      pokemon.handleHeal(
        Math.round(DEATH_WING_ABILITY_PARAMS.healRatio * takenDamage),
        pokemon,
        0,
        false
      )
    }
  }
}

export class MimicStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (MIMIC_ABILITY_PARAMS && AbilityStrategies[target.skill].copyable) {
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}

export class HexStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      HEX_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEX_ABILITY_PARAMS.damageByStar.at(-1)!
    if (target.status.hasNegativeStatus()) {
      damage = damage * HEX_ABILITY_PARAMS.negativeStatusMultiplier
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class GrowthStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)

    let attackBuff =
      GROWTH_ABILITY_PARAMS.attackBuffByStar[pokemon.stars - 1] ??
      GROWTH_ABILITY_PARAMS.attackBuffByStar.at(-1)!
    let hpBuff =
      GROWTH_ABILITY_PARAMS.hpBuffByStar[pokemon.stars - 1] ??
      GROWTH_ABILITY_PARAMS.hpBuffByStar.at(-1)!
    if (pokemon.simulation.weather === Weather.ZENITH) {
      attackBuff *= GROWTH_ABILITY_PARAMS.zenithMultiplier // grows twice as fast if zenith weather
      hpBuff *= GROWTH_ABILITY_PARAMS.zenithMultiplier
    }
    pokemon.addAttack(attackBuff, pokemon, 1, crit)
    pokemon.addMaxHP(hpBuff, pokemon, 1, crit)
    pokemon.resetCooldown(GROWTH_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class HealOrderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    const damage: number =
      HEAL_ORDER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEAL_ORDER_ABILITY_PARAMS.damageByStar.at(-1)!

    cells.forEach((cell) => {
      if (cell.value) {
        if (cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          pokemon.broadcastAbility({
            skill: "ATTACK_ORDER",
            positionX: cell.x,
            positionY: cell.y
          })
        } else {
          cell.value.handleHeal(damage, pokemon, 1, crit)
          pokemon.broadcastAbility({
            skill: "HEAL_ORDER",
            positionX: cell.x,
            positionY: cell.y
          })
        }
      }
    })
  }
}

export class ShellTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.shield > 0) {
      const damage = SHELL_TRAP_ABILITY_PARAMS.baseDamage + pokemon.shield
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
        .forEach((cell) => {
          if (cell.value && pokemon.team != cell.value.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
      pokemon.shield = 0
      pokemon.getEffects(OnShieldDepletedEffect).forEach((effect) => {
        effect.apply({
          pokemon,
          board: pokemon.simulation.board,
          attacker: pokemon as PokemonEntity,
          damage
        })
      })
    } else {
      const shield = SHELL_TRAP_ABILITY_PARAMS.shieldGain
      pokemon.addShield(shield, pokemon, 1, crit)
    }
  }
}

export class DigStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      DIG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DIG_ABILITY_PARAMS.damageByStar.at(-1)!

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit

    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class FireSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FIRE_SPIN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FIRE_SPIN_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(
          FIRE_SPIN_ABILITY_PARAMS.burnDurationMs,
          target,
          pokemon
        )
      }
    })
  }
}

export class SearingShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SEARING_SHOT_ABILITY_PARAMS.damage
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      SEARING_SHOT_ABILITY_PARAMS.radius,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBurn(
          SEARING_SHOT_ABILITY_PARAMS.burnDurationMs,
          target,
          pokemon
        )
      }
    })
  }
}

export class PeckStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      PECK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PECK_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SplashStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // does nothing, intentionally
  }
}

export class CounterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.max(
      COUNTER_ABILITY_PARAMS.minDamage,
      Math.round(
        (pokemon.maxHP - pokemon.hp) * COUNTER_ABILITY_PARAMS.missingHpRatio
      )
    )
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class PoisonPowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      POISON_POWDER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      POISON_POWDER_ABILITY_PARAMS.damageByStar.at(-1)!

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.status.triggerPoison(
        POISON_POWDER_ABILITY_PARAMS.poisonDurationMs,
        target,
        pokemon
      )
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class SilverWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage =
      SILVER_WIND_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SILVER_WIND_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    pokemon.addAttack(SILVER_WIND_ABILITY_PARAMS.attackBuff, pokemon, 0, false)
    pokemon.addDefense(
      SILVER_WIND_ABILITY_PARAMS.defenseBuff,
      pokemon,
      0,
      false
    )
    pokemon.addSpecialDefense(
      SILVER_WIND_ABILITY_PARAMS.specialDefenseBuff,
      pokemon,
      0,
      false
    )
    pokemon.addSpeed(SILVER_WIND_ABILITY_PARAMS.speedBuff, pokemon, 0, false)
    pokemon.addAbilityPower(
      SILVER_WIND_ABILITY_PARAMS.abilityPowerBuff,
      pokemon,
      0,
      false
    )

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class IcyWindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      ICY_WIND_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ICY_WIND_ABILITY_PARAMS.damageByStar.at(-1)!
    const speedDebuff: number =
      ICY_WIND_ABILITY_PARAMS.speedDebuffByStar[pokemon.stars - 1] ??
      ICY_WIND_ABILITY_PARAMS.speedDebuffByStar.at(-1)!

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addSpeed(-speedDebuff, pokemon, 0, false)
      }
    })
  }
}

export class PowderSnowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      POWDER_SNOW_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      POWDER_SNOW_ABILITY_PARAMS.damageByStar.at(-1)!
    const freezeChance: number =
      POWDER_SNOW_ABILITY_PARAMS.freezeChanceByStar[pokemon.stars - 1] ??
      POWDER_SNOW_ABILITY_PARAMS.freezeChanceByStar.at(-1)!

    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )

        if (chance(freezeChance, pokemon)) {
          cell.value.status.triggerFreeze(
            POWDER_SNOW_ABILITY_PARAMS.freezeDurationMs,
            cell.value,
            pokemon
          )
        }
      }
    })
  }
}

export class GigatonHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      GIGATON_HAMMER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      GIGATON_HAMMER_ABILITY_PARAMS.damageByStar.at(-1)!
    pokemon.status.triggerFatigue(
      GIGATON_HAMMER_ABILITY_PARAMS.fatigueDurationMs,
      pokemon
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AcrobaticsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      ACROBATICS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ACROBATICS_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const travelDistance =
      ACROBATICS_ABILITY_PARAMS.baseTravelDistance - pokemon.items.size
    const candidateDestinationCells = board
      .getCellsInRadius(pokemon.targetX, pokemon.targetY, pokemon.range, false)
      .filter((cell) => cell.value === undefined)
      .sort(
        (a, b) =>
          Math.abs(
            travelDistance -
              distanceM(a.x, a.y, pokemon.positionX, pokemon.positionY)
          ) -
          Math.abs(
            travelDistance -
              distanceM(b.x, b.y, pokemon.positionX, pokemon.positionY)
          )
      )
    if (candidateDestinationCells.length > 0) {
      const destination = candidateDestinationCells[0]
      pokemon.moveTo(destination.x, destination.y, board, false)
    }
  }
}

export class AbsorbStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      ABSORB_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ABSORB_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team === pokemon.team) {
        cell.value.handleHeal(
          damage * ABSORB_ABILITY_PARAMS.allyHealRatio,
          pokemon,
          1,
          crit
        )
      }
    })
  }
}

export class RolloutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const multiplier = ROLLOUT_ABILITY_PARAMS.damageDefenseMultiplier
    const defenseBoost =
      ROLLOUT_ABILITY_PARAMS.defenseGainByStar[pokemon.stars - 1] ??
      ROLLOUT_ABILITY_PARAMS.defenseGainByStar.at(-1)!

    pokemon.addDefense(defenseBoost, pokemon, 1, crit)
    target.handleSpecialDamage(
      multiplier * pokemon.def,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class IceBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const baseDamage: number =
      ICE_BALL_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
      ICE_BALL_ABILITY_PARAMS.baseDamageByStar.at(-1)!
    const multiplier: number =
      ICE_BALL_ABILITY_PARAMS.multiplierByStar[pokemon.stars - 1] ??
      ICE_BALL_ABILITY_PARAMS.multiplierByStar.at(-1)!

    pokemon.addSpecialDefense(
      ICE_BALL_ABILITY_PARAMS.speDefBoost,
      pokemon,
      0,
      false
    )
    target.handleSpecialDamage(
      baseDamage + multiplier * pokemon.speDef,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class ThrashStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(pokemon.baseAtk, pokemon, 1, crit)
    pokemon.status.triggerConfusion(
      THRASH_ABILITY_PARAMS.confusionDurationMs,
      pokemon,
      pokemon
    )
  }
}

export class MagmaStormStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const targetsHit = new Set<string>()
    const baseDamage = MAGMA_STORM_ABILITY_PARAMS.baseDamage
    let power = MAGMA_STORM_ABILITY_PARAMS.initialPower

    const propagate = (currentTarget: PokemonEntity, depth = 0) => {
      if (depth >= MAGMA_STORM_ABILITY_PARAMS.maxDepth) return

      targetsHit.add(currentTarget.id)
      pokemon.broadcastAbility({
        skill: Ability.MAGMA_STORM,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY,
        ap: Math.round(pokemon.ap * power)
      })
      currentTarget.handleSpecialDamage(
        baseDamage * power,
        board,
        AttackType.SPECIAL,
        pokemon,
        false
      )

      power -= MAGMA_STORM_ABILITY_PARAMS.powerDecayPerJump
      if (power <= 0) return
      pokemon.commands.push(
        new DelayedCommand(() => {
          const board = pokemon.simulation.board
          const nextEnemies = board
            .getAdjacentCells(currentTarget.positionX, currentTarget.positionY)
            .filter(
              (cell) =>
                cell.value &&
                cell.value.team === currentTarget.team &&
                !targetsHit.has(cell.value.id)
            )
          nextEnemies.forEach((enemy) => {
            if (
              enemy &&
              enemy.value &&
              enemy.value.hp > 0 &&
              !pokemon.simulation.finished
            ) {
              propagate(enemy.value, depth + 1)
            }
          })
        }, MAGMA_STORM_ABILITY_PARAMS.propagationDelayMs)
      )
    }

    propagate(target)
  }
}

export class SlashingClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      SLASHING_CLAW_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SLASHING_CLAW_ABILITY_PARAMS.damageByStar.at(-1)!
    if (target.status.wound) {
      damage = Math.ceil(
        damage * SLASHING_CLAW_ABILITY_PARAMS.woundDamageMultiplier
      )
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerWound(
      SLASHING_CLAW_ABILITY_PARAMS.woundDurationMs,
      target,
      pokemon
    )
  }
}

export class DireClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const { statusDurationMs } = DIRE_CLAW_ABILITY_PARAMS
    const status = pickRandomIn(["poison", "sleep", "paralysis"])
    switch (status) {
      case "poison":
        target.status.triggerPoison(statusDurationMs, target, pokemon)
        break
      case "sleep":
        target.status.triggerSleep(statusDurationMs, target)
        break
      case "paralysis":
        target.status.triggerParalysis(statusDurationMs, target, pokemon)
        break
    }

    const damage =
      DIRE_CLAW_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DIRE_CLAW_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class FakeOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FAKE_OUT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FAKE_OUT_ABILITY_PARAMS.damageByStar.at(-1)!
    if (pokemon.ap >= 0)
      target.status.triggerFlinch(
        FAKE_OUT_ABILITY_PARAMS.flinchDurationMs,
        target
      )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(
      -FAKE_OUT_ABILITY_PARAMS.apReduction,
      pokemon,
      0,
      false
    )
  }
}

export class FellStingerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = FELL_STINGER_ABILITY_PARAMS.atkMultiplier * pokemon.baseAtk
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (death && !pokemon.isSpawn) {
      pokemon.addAttack(
        FELL_STINGER_ABILITY_PARAMS.deathAtkBoostRatio * pokemon.baseAtk,
        pokemon,
        0,
        false
      )
    }
  }
}

export class EruptionStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage =
      ERUPTION_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ERUPTION_ABILITY_PARAMS.damageByStar.at(-1)!
    const numberOfProjectiles =
      ERUPTION_ABILITY_PARAMS.projectileCountByStar[pokemon.stars - 1] ??
      ERUPTION_ABILITY_PARAMS.projectileCountByStar.at(-1)!

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const value = board.getEntityOnCell(x, y)
          if (value && value.team !== pokemon.team) {
            value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            value.status.triggerBurn(
              ERUPTION_ABILITY_PARAMS.burnDurationMs,
              value,
              pokemon
            )
          }
          pokemon.broadcastAbility({ targetX: x, targetY: y })
        }, i * ERUPTION_ABILITY_PARAMS.projectileIntervalMs)
      )
    }
  }
}

export class HailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = HAIL_ABILITY_PARAMS.damage
    const numberOfProjectiles =
      HAIL_ABILITY_PARAMS.projectileCountByStar[pokemon.stars - 1] ??
      HAIL_ABILITY_PARAMS.projectileCountByStar.at(-1)!

    for (let i = 0; i < numberOfProjectiles; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y =
        target.positionY >= 3
          ? randomBetween(3, BOARD_HEIGHT - 1)
          : randomBetween(0, 3)
      const enemyHit = board.getEntityOnCell(x, y)
      if (enemyHit && enemyHit.team !== pokemon.team) {
        enemyHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        enemyHit.effects.add(EffectEnum.HAIL)
        enemyHit.status.triggerFreeze(
          HAIL_ABILITY_PARAMS.freezeDurationMs,
          enemyHit,
          pokemon
        )
      }
      pokemon.broadcastAbility({
        skill: "HAIL_PROJECTILE",
        targetX: x,
        targetY: y
      })
      board.addBoardEffect(x, y, EffectEnum.HAIL, pokemon.simulation)
    }
  }
}

export class MistBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = MIST_BALL_ABILITY_PARAMS.damage

    effectInLine(board, pokemon, target, (cell) => {
      if (
        cell.value != null &&
        cell.value.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY
        ) <= MIST_BALL_ABILITY_PARAMS.firstHitMaxRange
      ) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addAbilityPower(
          -MIST_BALL_ABILITY_PARAMS.abilityPowerReduction,
          pokemon,
          0,
          false
        )
      }
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        effectInLine(board, pokemon, target, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.addAbilityPower(
              -MIST_BALL_ABILITY_PARAMS.abilityPowerReduction,
              pokemon,
              0,
              false
            )
          }
        })
      }, MIST_BALL_ABILITY_PARAMS.secondHitDelayMs)
    )
  }
}

export class LusterPurgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = LUSTER_PURGE_ABILITY_PARAMS.damage

    effectInLine(board, pokemon, target, (cell) => {
      if (
        cell.value != null &&
        cell.value.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY
        ) <= LUSTER_PURGE_ABILITY_PARAMS.firstHitMaxRange
      ) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.addSpecialDefense(
          -LUSTER_PURGE_ABILITY_PARAMS.specialDefenseReduction,
          pokemon,
          0,
          false
        )
      }
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        effectInLine(board, pokemon, target, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.addSpecialDefense(
              -LUSTER_PURGE_ABILITY_PARAMS.specialDefenseReduction,
              pokemon,
              0,
              false
            )
          }
        })
      }, LUSTER_PURGE_ABILITY_PARAMS.secondHitDelayMs)
    )
  }
}

export class MudBubbleStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal: number =
      MUD_BUBBLE_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      MUD_BUBBLE_ABILITY_PARAMS.healByStar.at(-1)!
    pokemon.handleHeal(heal, pokemon, 1, crit)
    pokemon.resetCooldown(
      MUD_BUBBLE_ABILITY_PARAMS.cooldownResetMs,
      pokemon.speed
    )
  }
}

export class LinkCableStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    if (farthestCoordinate && farthestTarget) {
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
      pokemon.setTarget(farthestTarget)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (pokemon.hp <= 0) return
        const partner = board.find(
          (x, y, entity) =>
            entity.skill === Ability.LINK_CABLE &&
            entity.id !== pokemon.id &&
            entity.team === pokemon.team
        )
        if (partner) {
          const damage = LINK_CABLE_ABILITY_PARAMS.partnerDamage
          const targetsHit = new Set<PokemonEntity>()
          effectInLine(board, pokemon, partner, (cell) => {
            if (cell.value != null && cell.value.team !== pokemon.team) {
              targetsHit.add(cell.value)
            }
          })
          board
            .getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                targetsHit.add(cell.value)
              }
            })
          board
            .getAdjacentCells(partner.positionX, partner.positionY)
            .forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                targetsHit.add(cell.value)
              }
            })

          targetsHit.forEach((target) => {
            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_link",
            targetX: partner.positionX,
            targetY: partner.positionY
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_discharge",
            positionX: pokemon.positionX,
            positionY: pokemon.positionY
          })
          pokemon.broadcastAbility({
            skill: "LINK_CABLE_discharge",
            positionX: partner.positionX,
            positionY: partner.positionY,
            delay: LINK_CABLE_ABILITY_PARAMS.partnerDischargeDelayMs
          })
        } else {
          const damage = LINK_CABLE_ABILITY_PARAMS.soloDamage
          const cells = board.getAdjacentCells(
            pokemon.positionX,
            pokemon.positionY
          )
          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
          pokemon.broadcastAbility({ skill: "LINK_CABLE_discharge" })
        }
      }, LINK_CABLE_ABILITY_PARAMS.pulseDelayMs)
    )
  }
}

export class MagicBounceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.status.triggerMagicBounce(MAGIC_BOUNCE_ABILITY_PARAMS.durationMs)
  }
}

export class ReflectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.status.triggerReflect(REFLECT_ABILITY_PARAMS.durationMs)
  }
}
export class ShellSmashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SHELL_SMASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SHELL_SMASH_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
    pokemon.addAbilityPower(
      SHELL_SMASH_ABILITY_PARAMS.abilityPowerBuff,
      pokemon,
      0,
      false
    )
    pokemon.addAttack(SHELL_SMASH_ABILITY_PARAMS.attackBuff, pokemon, 0, false)
    pokemon.addSpeed(SHELL_SMASH_ABILITY_PARAMS.speedBuff, pokemon, 0, false)
    pokemon.addDefense(
      -SHELL_SMASH_ABILITY_PARAMS.defenseDebuff,
      pokemon,
      0,
      false
    )
    pokemon.addSpecialDefense(
      -SHELL_SMASH_ABILITY_PARAMS.specialDefenseDebuff,
      pokemon,
      0,
      false
    )
  }
}

export class HelpingHandStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const nbAlliesBuffed = HELPING_HAND_ABILITY_PARAMS.nbAlliesBuffed
    const shield =
      HELPING_HAND_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      HELPING_HAND_ABILITY_PARAMS.shieldByStar.at(-1)!
    const allies = new Array<{ pkm: PokemonEntity; distance: number }>()
    board.forEach((x, y, cell) => {
      if (cell && cell.team === pokemon.team && pokemon.id !== cell.id) {
        allies.push({
          pkm: cell,
          distance: distanceM(
            pokemon.positionX,
            pokemon.positionY,
            cell.positionX,
            cell.positionY
          )
        })
      }
    })
    allies.sort((a, b) => a.distance - b.distance)
    for (let i = 0; i < nbAlliesBuffed; i++) {
      const ally = allies[i]?.pkm
      if (ally) {
        ally.effects.add(EffectEnum.DOUBLE_DAMAGE)
        ally.addShield(shield, pokemon, 1, crit)
        pokemon.broadcastAbility({
          positionX: ally.positionX,
          positionY: ally.positionY
        })
      }
    }
  }
}

export class AstralBarrageStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board, false)
    }

    const damagePerGhost = ASTRAL_BARRAGE_ABILITY_PARAMS.damagePerGhost

    const enemies: PokemonEntity[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        enemies.push(tg)
      }
    })

    const nbGhosts =
      ASTRAL_BARRAGE_ABILITY_PARAMS.nbGhosts * (1 + pokemon.ap / 100)
    const delay =
      Math.round(
        ASTRAL_BARRAGE_ABILITY_PARAMS.projectileDelayBaseMs /
          getMoveSpeed(pokemon)
      ) /
      (nbGhosts + 1)

    for (let i = 0; i < nbGhosts; i++) {
      const randomTarget = pickRandomIn(enemies)
      pokemon.commands.push(
        new DelayedCommand(
          () => {
            pokemon.broadcastAbility({
              targetX: randomTarget.positionX,
              targetY: randomTarget.positionY
            })
            if (randomTarget?.hp > 0) {
              randomTarget.handleSpecialDamage(
                damagePerGhost,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                false
              )
            }
          },
          delay * (i + 1)
        )
      )
    }
  }
}

export class PyroBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage: number =
      PYRO_BALL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PYRO_BALL_ABILITY_PARAMS.damageByStar.at(-1)!

    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    const targetsHit: Set<PokemonEntity> = new Set()

    pokemon.broadcastAbility({
      targetX: farthestTarget.positionX,
      targetY: farthestTarget.positionY
    })

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.status.triggerBurn(
        PYRO_BALL_ABILITY_PARAMS.burnDurationMs,
        enemy,
        pokemon
      )
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class WhirlpoolStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit, true)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i]
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        targetsHit.add(cell.value)
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
        break // only first enemy in the line is hit
      }
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      const damage =
        pokemon.atk * WHIRLPOOL_ABILITY_PARAMS.attackMultiplierPerHit
      for (let i = 0; i < WHIRLPOOL_ABILITY_PARAMS.hitCount; i++) {
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class AnchorShotStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    const damage =
      ANCHOR_SHOT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ANCHOR_SHOT_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (!farthestTarget) return
    super.process(pokemon, board, farthestTarget, crit, true)
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY
    )
    const emptyCellsAround = shuffleArray(
      adjacentCells
        .filter((v) => v.value === undefined)
        .map((v) => ({ x: v.x, y: v.y }))
    )
    if (emptyCellsAround.length > 0) {
      const destination = emptyCellsAround[0]
      pokemon.broadcastAbility({
        targetX: farthestTarget.positionX,
        targetY: farthestTarget.positionY
      })
      farthestTarget.moveTo(destination.x, destination.y, board, true)
      farthestTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      farthestTarget.cooldown = min(ANCHOR_SHOT_ABILITY_PARAMS.cooldownCapMs)(
        farthestTarget.cooldown
      )
    }
  }
}

export class SmogStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target)
    const damage =
      SMOG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SMOG_ABILITY_PARAMS.damageByStar.at(-1)!

    cells.forEach((cell) => {
      board.addBoardEffect(cell.x, cell.y, EffectEnum.SMOKE, pokemon.simulation)
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class CottonGuardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(pokemon, target)
    const shield =
      COTTON_GUARD_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      COTTON_GUARD_ABILITY_PARAMS.shieldByStar.at(-1)!
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.addDefense(
      COTTON_GUARD_ABILITY_PARAMS.defenseBuff,
      pokemon,
      1,
      crit
    )
    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.COTTON_BALL,
        pokemon.simulation
      )
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSleep(
          COTTON_GUARD_ABILITY_PARAMS.sleepDurationMs,
          cell.value
        )
      }
    })
  }
}

export class LavaPlumeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const damage: number =
      LAVA_PLUME_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      LAVA_PLUME_ABILITY_PARAMS.damageByStar.at(-1)!

    cells.forEach((cell) => {
      board.addBoardEffect(cell.x, cell.y, EffectEnum.EMBER, pokemon.simulation)
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      }
    })
  }
}

export class AcidArmorStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defGain =
      ACID_ARMOR_ABILITY_PARAMS.defenseByStar[pokemon.stars - 1] ??
      ACID_ARMOR_ABILITY_PARAMS.defenseByStar.at(-1)!
    pokemon.addDefense(defGain, pokemon, 1, crit)
    let count = ACID_ARMOR_ABILITY_PARAMS.meleeHitCount
    const acidHitEffect = new OnDamageReceivedEffect(
      ({ pokemon, attacker }) => {
        if (attacker?.range === 1) {
          attacker.addDefense(
            -ACID_ARMOR_ABILITY_PARAMS.attackerDefenseReduction,
            pokemon,
            0,
            false
          )
        }
        count--
        if (count <= 0) {
          pokemon.effectsSet.delete(acidHitEffect)
        }
      }
    )
    pokemon.effectsSet.add(acidHitEffect)
  }
}

export class ShelterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defGain =
      SHELTER_ABILITY_PARAMS.defenseBuffByStar[pokemon.stars - 1] ??
      SHELTER_ABILITY_PARAMS.defenseBuffByStar.at(-1)!
    pokemon.addDefense(defGain, pokemon, 1, crit)
    board.addBoardEffect(
      pokemon.targetX,
      pokemon.targetY,
      EffectEnum.SMOKE,
      pokemon.simulation
    )
  }
}

export class MagnetRiseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbAlliesBuffed: number =
      MAGNET_RISE_ABILITY_PARAMS.alliesBuffedByStar[pokemon.stars - 1] ??
      MAGNET_RISE_ABILITY_PARAMS.alliesBuffedByStar.at(-1)!
    const alliesBuffed = (
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY)
        .map((cell) => cell.value)
        .filter((mon) => mon && mon.team === pokemon.team) as PokemonEntity[]
    )
      .sort((a, b) => a.hp - b.hp)
      .slice(0, nbAlliesBuffed)

    alliesBuffed.push(pokemon)
    alliesBuffed.forEach((ally) => {
      ally.status.triggerProtect(MAGNET_RISE_ABILITY_PARAMS.protectDurationMs)
      ally.addDodgeChance(
        MAGNET_RISE_ABILITY_PARAMS.dodgeChance,
        pokemon,
        1,
        crit
      )
      pokemon.broadcastAbility({
        positionX: ally.positionX,
        positionY: ally.positionY
      })
    })
  }
}

export class AttractStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const targetCount =
      ATTRACT_ABILITY_PARAMS.targetCountByStar[pokemon.stars - 1] ??
      ATTRACT_ABILITY_PARAMS.targetCountByStar.at(-1)!
    const targets = pickNRandomIn(
      board.cells.filter((v) => v && v.team !== pokemon.team),
      targetCount
    )
    targets?.forEach((t) => {
      if (t) {
        pokemon.broadcastAbility({
          targetX: t.positionX,
          targetY: t.positionY
        })
        t?.status.triggerCharm(
          ATTRACT_ABILITY_PARAMS.charmDurationMs,
          t,
          pokemon,
          true
        )
      }
    })
  }
}

export class WaterPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      WATER_PULSE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      WATER_PULSE_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .concat(target)
      .forEach((v) => {
        if (v) {
          v.status.triggerConfusion(
            WATER_PULSE_ABILITY_PARAMS.confusionDurationMs,
            v,
            pokemon
          )
          v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class PlayRoughStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerCharm(
      PLAY_ROUGH_ABILITY_PARAMS.charmDurationMs,
      target,
      pokemon,
      false
    )
    const damage: number =
      PLAY_ROUGH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PLAY_ROUGH_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AerialAceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      AERIAL_ACE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      AERIAL_ACE_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
  }
}

export class ParabolicChargeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal: number =
      PARABOLIC_CHARGE_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      PARABOLIC_CHARGE_ABILITY_PARAMS.healByStar.at(-1)!
    const overHeal = Math.max(0, heal + pokemon.hp - pokemon.maxHP)
    pokemon.handleHeal(heal, pokemon, 0, false)
    const baseDamage: number =
      PARABOLIC_CHARGE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PARABOLIC_CHARGE_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(
      baseDamage + overHeal,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class TeeterDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addSpeed(TEETER_DANCE_ABILITY_PARAMS.speedBuff, pokemon, 1, crit)
    board.cells
      .filter((v) => v !== undefined)
      .forEach(
        (v) =>
          v &&
          v.status.triggerConfusion(
            TEETER_DANCE_ABILITY_PARAMS.confusionDurationMs,
            v,
            pokemon
          )
      )
  }
}

export class CloseCombatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addDefense(
      -CLOSE_COMBAT_ABILITY_PARAMS.defenseReduction,
      pokemon,
      0,
      false
    )
    pokemon.addSpecialDefense(
      -CLOSE_COMBAT_ABILITY_PARAMS.specialDefenseReduction,
      pokemon,
      0,
      false
    )
    target.handleSpecialDamage(
      CLOSE_COMBAT_ABILITY_PARAMS.damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class AssistStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const skill = pickRandomIn(
      board.cells
        .filter(
          (v) =>
            v &&
            v.team === pokemon.team &&
            v.skill &&
            AbilityStrategies[v.skill].copyable
        )
        .map((v) => v?.skill)
    )
    if (skill) {
      pokemon.broadcastAbility({ skill })
      AbilityStrategies[skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}

export class FissureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const numberOfRifts =
      FISSURE_ABILITY_PARAMS.numberOfRiftsByStar[pokemon.stars - 1] ??
      FISSURE_ABILITY_PARAMS.numberOfRiftsByStar.at(-1)!
    const damage =
      FISSURE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FISSURE_ABILITY_PARAMS.damageByStar.at(-1)!
    for (let i = 0; i < numberOfRifts; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y = randomBetween(0, BOARD_HEIGHT - 1)
      const cells = board.getAdjacentCells(x, y)
      cells.push({ x, y, value: board.getEntityOnCell(x, y) })

      cells.forEach((cell) => {
        if (cell && cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      })
    }
  }
}

export class AssuranceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      ASSURANCE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ASSURANCE_ABILITY_PARAMS.damageByStar.at(-1)!

    target.handleSpecialDamage(
      pokemon.hp / pokemon.maxHP < ASSURANCE_ABILITY_PARAMS.hpThreshold
        ? damage * ASSURANCE_ABILITY_PARAMS.lowHpMultiplier
        : damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class AquaRingStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal =
      AQUA_RING_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      AQUA_RING_ABILITY_PARAMS.healByStar.at(-1)!
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        pokemon.team,
        board
      )
    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )

      const cells = board.getAdjacentCells(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y
      )
      cells.push({
        x: mostSurroundedCoordinate.x,
        y: mostSurroundedCoordinate.y,
        value: board.getEntityOnCell(
          mostSurroundedCoordinate.x,
          mostSurroundedCoordinate.y
        )
      })

      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus(cell.value, pokemon)
          cell.value.handleHeal(heal, pokemon, 1, crit)
        }
      })
    }
  }
}

export class LungeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const enemiesSortedByAttack = board.cells
      .filter((enemy) => enemy && enemy.team !== pokemon.team)
      .sort((a, b) => b!.atk - a!.atk) as PokemonEntity[]

    let cellToGo: Cell | undefined
    let enemy: PokemonEntity | undefined
    while (cellToGo == null && enemiesSortedByAttack.length > 0) {
      enemy = enemiesSortedByAttack.shift()
      if (enemy) {
        cellToGo = board
          .getAdjacentCells(enemy.positionX, enemy.positionY)
          .find((cell) => cell.value == null)
      }
    }

    if (cellToGo) {
      pokemon.moveTo(cellToGo.x, cellToGo.y, board, false)
      if (enemy) {
        enemy.addAttack(-LUNGE_ABILITY_PARAMS.attackReduction, pokemon, 1, crit)
        enemy.handleSpecialDamage(
          LUNGE_ABILITY_PARAMS.damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
      }
    }
  }
}

export class PoisonGasStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      POISON_GAS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      POISON_GAS_ABILITY_PARAMS.damageByStar.at(-1)!

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.POISON_GAS,
        pokemon.simulation
      )

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerPoison(
          POISON_GAS_ABILITY_PARAMS.poisonDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class BraveBirdStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const flyAwayCell = board.getSafePlaceAwayFrom(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (flyAwayCell) {
      pokemon.moveTo(flyAwayCell.x, flyAwayCell.y, board, false)
      const adjacentEmptyCells = board
        .getAdjacentCells(flyAwayCell.x, flyAwayCell.y)
        .filter((v) => v.value === undefined)
      if (adjacentEmptyCells.length > 0) {
        const cell = adjacentEmptyCells[0]
        target.moveTo(cell.x, cell.y, board, true)
        target.handleSpecialDamage(
          BRAVE_BIRD_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
            BRAVE_BIRD_ABILITY_PARAMS.damageByStar.at(-1)!,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}

export class MagicalLeafStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage: number =
      MAGICAL_LEAF_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MAGICAL_LEAF_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      farthestTarget.positionX,
      farthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.status.triggerArmorReduction(
        MAGICAL_LEAF_ABILITY_PARAMS.armorReductionDurationMs,
        enemy
      )
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class StealthRocksStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const coneTiles =
      STEALTH_ROCKS_ABILITY_PARAMS.coneTilesByStar[pokemon.stars - 1] ??
      STEALTH_ROCKS_ABILITY_PARAMS.coneTilesByStar.at(-1)!
    const cells = board.getCellsInFront(pokemon, target, coneTiles)
    const damage = STEALTH_ROCKS_ABILITY_PARAMS.damage

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.STEALTH_ROCKS,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class SpikesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbSpikes = Math.round(
      SPIKES_ABILITY_PARAMS.baseSpikeCount *
        (1 + pokemon.ap / SPIKES_ABILITY_PARAMS.apScalingDivisor)
    )
    const cells = pickNRandomIn(
      board.getCellsInFront(pokemon, target, SPIKES_ABILITY_PARAMS.coneDepth),
      nbSpikes
    )
    const damage =
      SPIKES_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SPIKES_ABILITY_PARAMS.damageByStar.at(-1)!

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.SPIKES,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class CeaselessEdgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      CEASELESS_EDGE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      CEASELESS_EDGE_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getCellsInFront(pokemon, target, 1)
    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.SPIKES,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })

      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class StickyWebStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInFront(
      pokemon,
      target,
      STICKY_WEB_ABILITY_PARAMS.coneDepth
    )
    const damage =
      STICKY_WEB_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      STICKY_WEB_ABILITY_PARAMS.damageByStar.at(-1)!

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.STICKY_WEB,
        pokemon.simulation
      )
      pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class CottonSporeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const NB_MAX_TARGETS = COTTON_SPORE_ABILITY_PARAMS.maxTargets
    const speedDebuff =
      COTTON_SPORE_ABILITY_PARAMS.speedDebuffByStar[pokemon.stars - 1] ??
      COTTON_SPORE_ABILITY_PARAMS.speedDebuffByStar.at(-1)!
    const enemies = board.cells
      .filter<PokemonEntity>(
        (v): v is PokemonEntity => v != null && v.team !== pokemon.team
      )
      .sort((a, b) => {
        const distanceA = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          a.positionX,
          a.positionY
        )
        const distanceB = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          b.positionX,
          b.positionY
        )
        return distanceA - distanceB
      })
    const nearestEnemies = enemies.slice(0, NB_MAX_TARGETS)

    nearestEnemies.forEach((enemy) => {
      enemy.addSpeed(-speedDebuff, pokemon, 1, crit)
      board.addBoardEffect(
        enemy.positionX,
        enemy.positionY,
        EffectEnum.COTTON_BALL,
        pokemon.simulation
      )
      pokemon.broadcastAbility({
        targetX: enemy.positionX,
        targetY: enemy.positionY
      })
    })
  }
}

export class StruggleBugStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addAbilityPower(
          -STRUGGLE_BUG_ABILITY_PARAMS.abilityPowerReduction,
          pokemon,
          0,
          false
        )
        cell.value.handleSpecialDamage(
          STRUGGLE_BUG_ABILITY_PARAMS.damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class QuiverDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack(QUIVER_DANCE_ABILITY_PARAMS.attackBuff, pokemon, 1, crit)
    pokemon.addSpecialDefense(
      QUIVER_DANCE_ABILITY_PARAMS.specialDefenseBuff,
      pokemon,
      1,
      crit
    )
    pokemon.addSpeed(QUIVER_DANCE_ABILITY_PARAMS.speedBuff, pokemon, 1, crit)
    pokemon.addAbilityPower(
      QUIVER_DANCE_ABILITY_PARAMS.abilityPowerBuff,
      pokemon,
      0,
      false
    )
  }
}

export class TailGlowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

    pokemon.addAbilityPower(
      TAIL_GLOW_ABILITY_PARAMS.abilityPowerBuff,
      pokemon,
      0,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          TAIL_GLOW_ABILITY_PARAMS.adjacentDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    })
  }
}

export class PrismaticLaserStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const flip = pokemon.team === Team.RED_TEAM
    for (
      let dx = -PRISMATIC_LASER_ABILITY_PARAMS.spreadRadius;
      dx <= PRISMATIC_LASER_ABILITY_PARAMS.spreadRadius;
      dx++
    ) {
      const x = target.positionX + dx
      if (x < 0 || x >= board.columns) continue
      for (
        let y = flip ? 0 : board.rows - 1;
        flip ? y < board.rows : y >= 0;
        y += flip ? 1 : -1
      ) {
        const entityOnCell = board.getEntityOnCell(x, y)
        if (entityOnCell && entityOnCell.team !== pokemon.team) {
          entityOnCell.handleSpecialDamage(
            PRISMATIC_LASER_ABILITY_PARAMS.damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // move the entity to the next cell in the direction of the laser
          const newY =
            y +
            (flip
              ? -PRISMATIC_LASER_ABILITY_PARAMS.pushDistance
              : PRISMATIC_LASER_ABILITY_PARAMS.pushDistance)
          if (
            newY >= 0 &&
            newY < board.rows &&
            board.getEntityOnCell(x, newY) == null
          ) {
            entityOnCell.moveTo(x, newY, board, true)
          }
        }
      }
    }
  }
}

export class NightShadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const ratio: number =
      NIGHT_SHADE_ABILITY_PARAMS.hpRatioByStar[pokemon.stars - 1] ??
      NIGHT_SHADE_ABILITY_PARAMS.hpRatioByStar.at(-1)!
    const damage = Math.ceil(
      ratio *
        target.maxHP *
        (1 + (NIGHT_SHADE_ABILITY_PARAMS.apScalingFactor * pokemon.ap) / 100)
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      false
    )
  }
}

export class SuperFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.ceil(
      SUPER_FANG_ABILITY_PARAMS.maxHpDamagePercent *
        target.maxHP *
        (1 + (SUPER_FANG_ABILITY_PARAMS.apMultiplier * pokemon.ap) / 100)
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      false
    )
  }
}

export class ChargeBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, false)
    const chain = [target]
    const NB_MAX_TARGETS = CHARGE_BEAM_ABILITY_PARAMS.maxTargets
    for (
      let n = 1, x = target.positionX, y = target.positionY;
      n < NB_MAX_TARGETS;
      n++
    ) {
      const nextCell = board
        .getAdjacentCells(x, y)
        .find(
          (cell) =>
            cell.value &&
            cell.value.team === target.team &&
            !chain.includes(cell.value)
        )
      if (nextCell) {
        chain.push(nextCell.value!)
        x = nextCell.x
        y = nextCell.y
      }
    }

    for (let i = 0; i < chain.length; i++) {
      const damage =
        CHARGE_BEAM_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
        CHARGE_BEAM_ABILITY_PARAMS.damageByStar.at(-1)!
      chain[i].handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      const previous = i === 0 ? pokemon : chain[i - 1]
      pokemon.broadcastAbility({
        skill: "LINK_CABLE_link",
        positionX: previous.positionX,
        positionY: previous.positionY,
        targetX: chain[i].positionX,
        targetY: chain[i].positionY
      })
    }
  }
}

export class PopulationBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = POPULATION_BOMB_ABILITY_PARAMS.damagePerHit
    const numberOfAttacks = Math.round(
      (POPULATION_BOMB_ABILITY_PARAMS.hitsByStar[pokemon.stars - 1] ??
        POPULATION_BOMB_ABILITY_PARAMS.hitsByStar.at(-1)!) *
        (1 + pokemon.ap / POPULATION_BOMB_ABILITY_PARAMS.apScalingDivisor)
    )
    for (let i = 0; i < numberOfAttacks; i++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        false
      )
    }
  }
}

export class ScreechStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const debuff = -(
      SCREECH_ABILITY_PARAMS.defenseReductionByStar[pokemon.stars - 1] ??
      SCREECH_ABILITY_PARAMS.defenseReductionByStar.at(-1)!
    )
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      SCREECH_ABILITY_PARAMS.radius,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addDefense(debuff, pokemon, 1, crit)
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      }
    })
  }
}

export class SandTombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const statusDuration =
      SAND_TOMB_ABILITY_PARAMS.statusDurationByStar[pokemon.stars - 1] ??
      SAND_TOMB_ABILITY_PARAMS.statusDurationByStar.at(-1)!
    const damage =
      SAND_TOMB_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SAND_TOMB_ABILITY_PARAMS.damageByStar.at(-1)!

    target.status.triggerParalysis(statusDuration, target, pokemon)
    target.status.triggerSilence(statusDuration, target, pokemon)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class WhirlwindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const x = target.positionX
    const y = target.positionY
    const damage =
      WHIRLWIND_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      WHIRLWIND_ABILITY_PARAMS.damageByStar.at(-1)!
    target.flyAway(board, false, false)
    pokemon.broadcastAbility({
      positionX: x,
      positionY: y,
      targetX: target.positionX,
      targetY: target.positionY
    })
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class AcidSprayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    let tg: PokemonEntity | undefined = target
    const affectedTargetsIds = new Array<string>()
    for (let i = 0; i < ACID_SPRAY_ABILITY_PARAMS.maxBounces; i++) {
      if (tg) {
        pokemon.broadcastAbility({
          targetX: tg.positionX,
          targetY: tg.positionY
        })
        tg.addSpecialDefense(
          -ACID_SPRAY_ABILITY_PARAMS.speDefReduction,
          pokemon,
          0,
          false
        )
        tg.handleSpecialDamage(
          ACID_SPRAY_ABILITY_PARAMS.damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        affectedTargetsIds.push(tg.id)
        const cells = board.getAdjacentCells(tg.positionX, tg.positionY)
        tg = cells
          .filter(
            (v) =>
              v.value &&
              v.value.team !== pokemon.team &&
              !affectedTargetsIds.includes(v.value.id)
          )
          .map((v) => v.value)[0]
      } else {
        break
      }
    }
  }
}

export class UnboundStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.index = PkmIndex[Pkm.HOOPA_UNBOUND]
    pokemon.skill = Ability.HYPERSPACE_FURY
    pokemon.addAttack(UNBOUND_ABILITY_PARAMS.atkBuff, pokemon, 0, false)
    pokemon.addMaxHP(UNBOUND_ABILITY_PARAMS.hpBuff, pokemon, 0, false)
    pokemon.toMovingState()
    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(Pkm.HOOPA_UNBOUND)
    }
  }
}

export class HyperspaceFuryStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    crit = chance(pokemon.critChance / 100, pokemon) // can crit by default with increased crit chance
    super.process(pokemon, board, target, crit, true)
    const nbHits = Math.round(
      HYPERSPACE_FURY_ABILITY_PARAMS.baseHits *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    for (let i = 0; i < nbHits; i++) {
      target.addDefense(
        -HYPERSPACE_FURY_ABILITY_PARAMS.defenseReduction,
        pokemon,
        0,
        false
      )
      target.addSpecialDefense(
        -HYPERSPACE_FURY_ABILITY_PARAMS.defenseReduction,
        pokemon,
        0,
        false
      )
      target.handleSpecialDamage(
        HYPERSPACE_FURY_ABILITY_PARAMS.damagePerHit,
        board,
        AttackType.SPECIAL,
        pokemon,
        false,
        false
      )
    }
    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      orientation: nbHits // use orientation field for the number of hits
    })
  }
}

export class SnipeShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage =
      SNIPE_SHOT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SNIPE_SHOT_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    super.process(pokemon, board, farthestTarget, crit)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestTarget) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestTarget.positionX,
        farthestTarget.positionY
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class AirSlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      AIR_SLASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      AIR_SLASH_ABILITY_PARAMS.damageByStar.at(-1)!
    target.status.triggerFlinch(
      AIR_SLASH_ABILITY_PARAMS.flinchDurationMs,
      target,
      pokemon
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class EggBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      EGG_BOMB_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      EGG_BOMB_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team)
      .forEach((v) => {
        if (v) {
          const kill = v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          if (
            kill.death &&
            !pokemon.isGhostOpponent &&
            pokemon.player &&
            chance(EGG_BOMB_ABILITY_PARAMS.eggChance, pokemon)
          ) {
            giveRandomEgg(pokemon.player, false)
          }
          v.status.triggerArmorReduction(
            EGG_BOMB_ABILITY_PARAMS.armorReductionDurationMs,
            v
          )
        }
      })
  }
}

export class BodySlamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(
      BODY_SLAM_ABILITY_PARAMS.hpRatio * pokemon.maxHP * (1 + pokemon.ap / 100)
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
  }
}

export class VineWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      VINE_WHIP_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      VINE_WHIP_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(target.positionX, target.positionY)
      .map((cell) => cell.value)
      .filter((entity) => entity?.team === target.team)
      .concat(target)
      .forEach((enemy) => {
        if (enemy) {
          enemy.status.triggerParalysis(
            VINE_WHIP_ABILITY_PARAMS.paralysisDurationMs,
            enemy,
            pokemon
          )
        }
      })
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class BarbBarrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      BARB_BARRAGE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BARB_BARRAGE_ABILITY_PARAMS.damageByStar.at(-1)!
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )
      board
        .getAdjacentCells(target.positionX, target.positionY)
        .map((v) => v.value)
        .filter((v) => v?.team === target.team)
        .concat(target)
        .forEach((v) => {
          if (v) {
            v.status.triggerPoison(
              BARB_BARRAGE_ABILITY_PARAMS.poisonDurationMs,
              v,
              pokemon
            )
            v.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            pokemon.broadcastAbility({
              targetX: v.positionX,
              targetY: v.positionY,
              orientation: v.orientation
            })
          }
        })
    } else {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class FloralHealingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (pokemon.items.has(Item.COMFEY) === false) {
      // if comfey is hold item, we explicitely not trigger super.process() so that the pokemon doesn't get call the oncast effects in an infinite loop
      super.process(pokemon, board, target, crit)
    }
    pokemon.handleHeal(pokemon.maxPP, pokemon, 0, false)
  }
}

export class MagicPowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield: number =
      MAGIC_POWDER_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      MAGIC_POWDER_ABILITY_PARAMS.shieldByStar.at(-1)!
    const silenceDuration: number =
      MAGIC_POWDER_ABILITY_PARAMS.silenceDurationByStar[pokemon.stars - 1] ??
      MAGIC_POWDER_ABILITY_PARAMS.silenceDurationByStar.at(-1)!
    pokemon.addShield(shield, pokemon, 1, crit)
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerSilence(silenceDuration, cell.value, pokemon)
        }
      })
  }
}

export class RetaliateStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
    const damage = pokemon.atk * RETALIATE_ABILITY_PARAMS.attackDamageRatio

    for (
      let i = 0;
      i < nbFallenAllies + RETALIATE_ABILITY_PARAMS.baseHitCount;
      i++
    ) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class SlashStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const damage =
      SLASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SLASH_ABILITY_PARAMS.damageByStar.at(-1)!
    const increasedCrit =
      SLASH_ABILITY_PARAMS.critChanceBonusByStar[pokemon.stars - 1] ??
      SLASH_ABILITY_PARAMS.critChanceBonusByStar.at(-1)!
    crit = chance((pokemon.critChance + increasedCrit) / 100, pokemon) // can crit by default with increased crit chance
    super.process(pokemon, board, target, crit)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class OutrageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.status.triggerConfusion(
      OUTRAGE_ABILITY_PARAMS.confusionDurationMs,
      pokemon,
      pokemon
    )
    const damage = Math.round(
      OUTRAGE_ABILITY_PARAMS.atkMultiplier * pokemon.atk
    )
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .map((v) => v.value)
      .filter((v) => v?.team === target.team && v?.id !== target.id)
      .concat(target)
      .forEach((v) => {
        if (v) {
          pokemon.broadcastAbility({
            targetX: v.positionX,
            targetY: v.positionY
          })
          v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class FishiousRendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // deals 80 special damage. Double damage if attacker got more atk speed than target.
    const damage =
      FISHIOUS_REND_ABILITY_PARAMS.damage *
      (pokemon.speed > target.speed ? 2 : 1)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class GoldRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const goldDamage = pokemon.player?.money
      ? Math.round(
          (pokemon.player.money * GOLD_RUSH_ABILITY_PARAMS.goldDamagePercent) /
            100
        )
      : 0
    const damage = GOLD_RUSH_ABILITY_PARAMS.baseDamage + goldDamage
    if (pokemon.player) {
      pokemon.player.addMoney(GOLD_RUSH_ABILITY_PARAMS.moneyGain, true, pokemon)
    }
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class MakeItRainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const goldDamage = pokemon.player?.money
      ? Math.round(
          (pokemon.player.money *
            MAKE_IT_RAIN_ABILITY_PARAMS.goldDamagePercent) /
            100
        )
      : 0
    const damage = MAKE_IT_RAIN_ABILITY_PARAMS.baseDamage + goldDamage

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class RecoverStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.handleHeal(
      RECOVER_ABILITY_PARAMS.healRatio * pokemon.maxHP,
      pokemon,
      1,
      crit
    )
  }
}

export class TranseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.skill = Ability.HEADBUTT
    if (pokemon.name === Pkm.GALARIAN_DARMANITAN_ZEN) {
      pokemon.index = PkmIndex[Pkm.GALARIAN_DARMANITAN]
      pokemon.name = Pkm.GALARIAN_DARMANITAN
      pokemon.changePassive(Passive.GALARIAN_DARMANITAN)
      pokemon.status.tree = false
      pokemon.status.untargettable = false
      pokemon.addAttack(-6, pokemon, 0, false)
      pokemon.addSpeed(60, pokemon, 0, false)
    } else {
      pokemon.index = PkmIndex[Pkm.DARMANITAN]
      pokemon.name = Pkm.DARMANITAN
      pokemon.changePassive(Passive.DARMANITAN)
      pokemon.addAttack(10, pokemon, 0, false)
      pokemon.addSpeed(20, pokemon, 0, false)
      pokemon.addDefense(-6, pokemon, 0, false)
      pokemon.addSpecialDefense(-6, pokemon, 0, false)
      pokemon.range = min(1)(pokemon.range - 4)
      pokemon.effects.delete(EffectEnum.SPECIAL_ATTACKS)
    }
    pokemon.skill = Ability.HEADBUTT
    pokemon.handleHeal(
      Math.round(TRANSE_ABILITY_PARAMS.healPercent * pokemon.maxHP),
      pokemon,
      0,
      false
    )
    pokemon.toMovingState()
    pokemon.cooldown = 0
  }
}

export class CurseStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team
    ) as PokemonEntity[]
    const highestHp = Math.max(...enemies.map((p) => p.maxHP))
    const enemiesWithHighestHP = enemies.filter((p) => p.maxHP === highestHp)
    const cursedEnemy = pickRandomIn(enemiesWithHighestHP)
    if (cursedEnemy) {
      const factor = CURSE_ABILITY_PARAMS.apCritScalingFactor
      const curseDelay = min(0)(
        (CURSE_ABILITY_PARAMS.baseDelayByStarMs[pokemon.stars - 1] ??
          CURSE_ABILITY_PARAMS.baseDelayByStarMs.at(-1)!) *
          (1 - (factor * pokemon.ap) / 100) *
          (crit ? 1 - (pokemon.critPower - 1) * factor : 1)
      )
      cursedEnemy.status.triggerCurse(curseDelay, cursedEnemy)
    }
  }
}

export class DoomDesireStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          pokemon.broadcastAbility({
            targetX: target.positionX,
            targetY: target.positionY
          })
          target.handleSpecialDamage(
            DOOM_DESIRE_ABILITY_PARAMS.damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
        } else {
          pokemon.pp = pokemon.maxPP // cast again immediately if target is dead
        }
      }, DOOM_DESIRE_ABILITY_PARAMS.delayMs)
    )
    pokemon.resetCooldown(DOOM_DESIRE_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class PoltergeistStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      POLTERGEIST_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
      POLTERGEIST_ABILITY_PARAMS.baseDamageByStar.at(-1)!
    target.items.forEach(
      (item) =>
        (damage += isIn(Tools, item)
          ? POLTERGEIST_ABILITY_PARAMS.toolDamageBonus
          : POLTERGEIST_ABILITY_PARAMS.itemDamageBonus)
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class CrushGripStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(
      CRUSH_GRIP_ABILITY_PARAMS.baseDamage +
        (target.hp / target.maxHP) *
          CRUSH_GRIP_ABILITY_PARAMS.hpRatioDamageBonus
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class AuraSphereStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      AURASPHERE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      AURASPHERE_ABILITY_PARAMS.damageByStar.at(-1)!
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerSilence(
          AURASPHERE_ABILITY_PARAMS.silenceDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class SketchStrategy extends AbilityStrategy {
  copyable = SKETCH_ABILITY_PARAMS.copyable
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
  }
}

export class LovelyKissStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    if (target.status.sleep) {
      const damage: number =
        LOVELY_KISS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
        LOVELY_KISS_ABILITY_PARAMS.damageByStar.at(-1)!
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      const duration = Math.round(
        (LOVELY_KISS_ABILITY_PARAMS.sleepDurationByStar[pokemon.stars - 1] ??
          LOVELY_KISS_ABILITY_PARAMS.sleepDurationByStar.at(-1)!) *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
      target.status.triggerSleep(duration, target)
    }
  }
}

export class OverdriveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getCellsInRadius(
      target.positionX,
      target.positionY,
      OVERDRIVE_ABILITY_PARAMS.radius,
      false
    )
    cells.forEach((cell) => {
      if (cell && cell.value && cell.value.team !== pokemon.team) {
        const distance = distanceC(
          cell.x,
          cell.y,
          pokemon.positionX,
          pokemon.positionY
        )
        const damage =
          pokemon.atk *
          (OVERDRIVE_ABILITY_PARAMS.baseAtkMultiplier -
            OVERDRIVE_ABILITY_PARAMS.decayPerDistance * (distance - 1))
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
      }
    })
  }
}

export class TransformStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (target && target.canBeCopied) {
      pokemon.index = target.index
      pokemon.rarity = target.rarity
      pokemon.stars = target.stars
      pokemon.skill = target.skill
      pokemon.changePassive(target.passive)
      pokemon.baseAtk = target.atk
      pokemon.baseDef = target.def
      pokemon.baseSpeDef = target.speDef
      pokemon.baseRange = target.baseRange
      pokemon.atk = target.atk
      pokemon.speed = target.speed
      pokemon.def = target.def
      pokemon.speDef = target.speDef
      pokemon.ap = target.ap
      pokemon.maxPP = target.maxPP
      pokemon.speed = target.speed
      pokemon.critChance = target.critChance
      pokemon.critPower = target.critPower
      pokemon.range = target.range
      pokemon.shiny = target.shiny
      pokemon.emotion = target.emotion
      pokemon.dodge = target.dodge
    }
  }
}

export class PsychicFangsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.atk = Math.min(target.atk, target.baseAtk)
    target.def = Math.min(target.def, target.baseDef)
    target.speDef = Math.min(target.speDef, target.baseSpeDef)
    target.handleSpecialDamage(
      PSYCHIC_FANGS_ABILITY_PARAMS.damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class ShedTailStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const x = pokemon.positionX
    const y = pokemon.positionY
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthAlly) {
      lowestHealthAlly.addShield(
        SHED_TAIL_ABILITY_PARAMS.shieldAmount,
        pokemon,
        1,
        crit
      )
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(lowestHealthAlly)
      if (coord) {
        const substitute = PokemonFactory.createPokemonFromName(
          Pkm.SUBSTITUTE,
          pokemon.player
        )
        pokemon.moveTo(coord.x, coord.y, board, false)
        pokemon.simulation.addPokemon(substitute, x, y, pokemon.team, true)
        for (const pokemonTargetingCaster of board.cells.filter(
          (p) => p?.targetEntityId === pokemon.id
        )) {
          pokemonTargetingCaster!.targetEntityId = substitute.id
        }
      }
    }
  }
}

export class ShadowPunchStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      if (coord) {
        pokemon.orientation = board.orientation(
          coord.x,
          coord.y,
          pokemon.positionX,
          pokemon.positionY,
          pokemon,
          lowestHealthEnemy
        )
        pokemon.moveTo(coord.x, coord.y, board, false)
      }
      pokemon.effects.add(EffectEnum.SHADOW_PUNCH_NEXT_ATTACK)
    }
  }
}

export class MagnetBombStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      MAGNET_BOMB_ABILITY_PARAMS.splashDamageByStar[pokemon.stars - 1] ??
      MAGNET_BOMB_ABILITY_PARAMS.splashDamageByStar.at(-1)!
    const centerDamage: number =
      MAGNET_BOMB_ABILITY_PARAMS.centerDamageByStar[pokemon.stars - 1] ??
      MAGNET_BOMB_ABILITY_PARAMS.centerDamageByStar.at(-1)!
    const lockDuration = MAGNET_BOMB_ABILITY_PARAMS.lockDurationMs

    target.handleSpecialDamage(
      centerDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    target.status.triggerLocked(lockDuration, target)

    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerLocked(lockDuration, cell.value)
      }
    })

    const mappingAttractCell = [
      {
        to: [target.positionX - 1, target.positionY],
        from: [[target.positionX - 2, target.positionY]]
      },
      {
        to: [target.positionX + 1, target.positionY],
        from: [[target.positionX + 2, target.positionY]]
      },
      {
        to: [target.positionX, target.positionY - 1],
        from: [[target.positionX, target.positionY - 2]]
      },
      {
        to: [target.positionX, target.positionY + 1],
        from: [[target.positionX, target.positionY + 2]]
      },
      {
        to: [target.positionX - 1, target.positionY - 1],
        from: [
          [target.positionX - 2, target.positionY - 1],
          [target.positionX - 2, target.positionY - 2],
          [target.positionX - 1, target.positionY - 2]
        ]
      },
      {
        to: [target.positionX + 1, target.positionY - 1],
        from: [
          [target.positionX + 2, target.positionY - 1],
          [target.positionX + 2, target.positionY - 2],
          [target.positionX + 1, target.positionY - 2]
        ]
      },
      {
        to: [target.positionX - 1, target.positionY + 1],
        from: [
          [target.positionX - 2, target.positionY + 1],
          [target.positionX - 2, target.positionY + 2],
          [target.positionX - 1, target.positionY + 2]
        ]
      },
      {
        to: [target.positionX + 1, target.positionY + 1],
        from: [
          [target.positionX + 2, target.positionY + 1],
          [target.positionX + 2, target.positionY + 2],
          [target.positionX + 1, target.positionY + 2]
        ]
      }
    ]

    mappingAttractCell.forEach((cell) => {
      const attractedEnemies = cell.from
        .map(([x, y]) => board.getEntityOnCell(x, y))
        .filter((enemy) => enemy && enemy.team === target.team)
      const [destX, destY] = cell.to
      if (
        attractedEnemies.length > 0 &&
        board.getEntityOnCell(destX, destY) === undefined
      ) {
        const attractedEnemy = pickRandomIn(attractedEnemies)!
        attractedEnemy.moveTo(destX, destY, board, true)
        attractedEnemy.status.triggerLocked(lockDuration, attractedEnemy)
      }
    })
  }
}

export class NightSlashStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      NIGHT_SLASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      NIGHT_SLASH_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class KowtowCleaveStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)
    const damage = Math.round(
      pokemon.atk *
        (KOWTOW_CLEAVE_ABILITY_PARAMS.baseAtkMultiplier +
          nbFallenAllies *
            KOWTOW_CLEAVE_ABILITY_PARAMS.fallenAlliesBonusPerUnit *
            (1 + pokemon.ap / 100))
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.TRUE,
      pokemon,
      crit,
      false
    )
  }
}

export class ShieldsDownStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    pokemon.broadcastAbility({
      skill: SHIELDS_DOWN_ABILITY_PARAMS.broadcastSkill
    })
    const pkm = pickRandomIn(SHIELDS_DOWN_ABILITY_PARAMS.coreForms)
    pokemon.index = PkmIndex[pkm]
    pokemon.name = pkm
    pokemon.skill = SHIELDS_DOWN_ABILITY_PARAMS.transformedSkill
    pokemon.cooldown = SHIELDS_DOWN_ABILITY_PARAMS.cooldownResetMs
    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(pkm)
    }
  }
}

export class ShieldsUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    pokemon.broadcastAbility({
      skill: SHIELDS_UP_ABILITY_PARAMS.broadcastSkill
    })
    pokemon.index = PkmIndex[SHIELDS_UP_ABILITY_PARAMS.meteorForm]
    pokemon.name = SHIELDS_UP_ABILITY_PARAMS.meteorForm
    pokemon.skill = SHIELDS_UP_ABILITY_PARAMS.transformedSkill
    pokemon.cooldown = SHIELDS_UP_ABILITY_PARAMS.cooldownResetMs
  }
}

export class AuraWheelStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.name === Pkm.MORPEKO) {
      pokemon.name = Pkm.MORPEKO_HANGRY
      pokemon.index = PkmIndex[Pkm.MORPEKO_HANGRY]
      if (pokemon.player) {
        pokemon.player.pokemonsPlayed.add(Pkm.MORPEKO_HANGRY)
      }
    } else {
      pokemon.name = Pkm.MORPEKO
      pokemon.index = PkmIndex[Pkm.MORPEKO]
    }
    pokemon.addSpeed(AURA_WHEEL_ABILITY_PARAMS.speedBuff, pokemon, 0, false)

    target.handleSpecialDamage(
      AURA_WHEEL_ABILITY_PARAMS.damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    pokemon.resetCooldown(AURA_WHEEL_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class LickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerConfusion(
      LICK_ABILITY_PARAMS.confusionDurationMs,
      target,
      pokemon
    )
    target.status.triggerParalysis(
      LICK_ABILITY_PARAMS.paralysisDurationMs,
      target,
      pokemon
    )
    const damage: number =
      LICK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      LICK_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class FurySwipesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const scale = 1 + pokemon.ap / 100
    const nbAttacks = Math.round(
      FURY_SWIPES_ABILITY_PARAMS.baseAttackCount * scale
    )
    const hitPerSecond = Math.round(1000 / nbAttacks)

    for (let n = 0; n < nbAttacks; n++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (target && target.hp > 0) {
            target.handleSpecialDamage(
              Math.ceil(pokemon.atk),
              board,
              AttackType.PHYSICAL,
              pokemon,
              crit,
              false
            )
          } else {
            pokemon.addPP(
              FURY_SWIPES_ABILITY_PARAMS.ppPerRemainingHit,
              pokemon,
              0,
              false
            ) // regain 20 PP per remaining hit
          }
        }, n * hitPerSecond)
      )
    }

    pokemon.cooldown += FURY_SWIPES_ABILITY_PARAMS.cooldownExtensionMs
  }
}

export class TickleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const attackLost = TICKLE_ABILITY_PARAMS.attackReduction
    const defLost = TICKLE_ABILITY_PARAMS.defenseReduction
    const nbMaxEnemiesHit =
      TICKLE_ABILITY_PARAMS.maxTargetsByStar[pokemon.stars - 1] ??
      TICKLE_ABILITY_PARAMS.maxTargetsByStar.at(-1)!
    let nbEnemiesHit = 0
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (
          cell.value &&
          cell.value.team !== pokemon.team &&
          nbEnemiesHit < nbMaxEnemiesHit
        ) {
          nbEnemiesHit++
          cell.value.addAttack(-attackLost, pokemon, 1, crit)
          cell.value.addDefense(-defLost, pokemon, 1, crit)
        }
      })
  }
}

export class AromatherapyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal =
      AROMATHERAPY_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      AROMATHERAPY_ABILITY_PARAMS.healByStar.at(-1)!
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus(cell.value, pokemon)
          cell.value.handleHeal(heal, pokemon, 1, crit)
        }
      })
  }
}

export class DetectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const adjacentAllies: PokemonEntity[] = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter<Cell & { value: PokemonEntity }>(
        (cell): cell is Cell & { value: PokemonEntity } =>
          cell.value != null && cell.value.team === pokemon.team
      )
      .map((cell) => cell.value)
    const nbEnemiesDetected = board
      .getCellsInRange(
        pokemon.positionX,
        pokemon.positionY,
        DETECT_ABILITY_PARAMS.enemyDetectionRangeTiles,
        false
      )
      .filter((cell) => cell.value && cell.value.team !== pokemon.team).length

    const protectDuration = Math.round(
      DETECT_ABILITY_PARAMS.protectDurationPerEnemyMs *
        nbEnemiesDetected *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    adjacentAllies.forEach((ally) => {
      ally.status.triggerProtect(protectDuration)
    })
  }
}

export class SpacialRendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = SPACIAL_REND_ABILITY_PARAMS.damage
    const rowToTarget = target.positionY
    const enemies = board.cells.filter(
      (p) => p && p.team !== pokemon.team && p.canBeMoved
    )
    const n = enemies.length
    for (let i = 0; i < Math.floor(n / 2); i++) {
      enemies[i]!.toMovingState()
      enemies[n - 1 - i]!.toMovingState()
      board.swapCells(
        enemies[i]!.positionX,
        enemies[i]!.positionY,
        enemies[n - 1 - i]!.positionX,
        enemies[n - 1 - i]!.positionY
      )
    }

    for (let x = 0; x < BOARD_WIDTH; x++) {
      const targetHit = board.getEntityOnCell(x, rowToTarget)
      if (targetHit && targetHit.team !== pokemon.team) {
        targetHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}

export class MultiAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let synergyLevelsCount = 0
    const synergies = pokemon.player?.synergies
    if (synergies) {
      pokemon.types.forEach((type) => {
        synergyLevelsCount += synergies.get(type) ?? 0
      })
    }

    const damage =
      MULTI_ATTACK_ABILITY_PARAMS.damagePerSynergyLevel * synergyLevelsCount
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .map((v) => v.value)
      .forEach((v) => {
        if (v && v.team !== pokemon.team) {
          v.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class PetalBlizzardStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            PETAL_BLIZZARD_ABILITY_PARAMS.damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
    pokemon.addAbilityPower(
      PETAL_BLIZZARD_ABILITY_PARAMS.apGain,
      pokemon,
      0,
      false
    )
  }
}

export class SunsteelStrikeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    if (mostSurroundedCoordinate) {
      pokemon.skydiveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            positionX: mostSurroundedCoordinate.x,
            positionY: mostSurroundedCoordinate.y,
            targetX: mostSurroundedCoordinate.x,
            targetY: mostSurroundedCoordinate.y
          })
        }, SUNSTEEL_STRIKE_ABILITY_PARAMS.animationDelayMs)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          const cells = board.getAdjacentCells(
            mostSurroundedCoordinate.x,
            mostSurroundedCoordinate.y
          )
          pokemon.broadcastAbility({
            skill: Ability.SEARING_SHOT,
            positionX: mostSurroundedCoordinate.x,
            positionY: mostSurroundedCoordinate.y,
            targetX: mostSurroundedCoordinate.x,
            targetY: mostSurroundedCoordinate.y
          })

          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                SUNSTEEL_STRIKE_ABILITY_PARAMS.damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
        }, SUNSTEEL_STRIKE_ABILITY_PARAMS.impactDelayMs)
      )
    }
  }
}

export class MoongeistBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null) {
        if (cell.value.team !== pokemon.team) {
          cell.value.status.triggerParalysis(
            MOONGEIST_BEAM_ABILITY_PARAMS.paralysisDurationMs,
            cell.value,
            pokemon
          )
          cell.value.handleSpecialDamage(
            MOONGEIST_BEAM_ABILITY_PARAMS.enemyDamage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else if (cell.value.id !== pokemon.id) {
          cell.value.addShield(
            MOONGEIST_BEAM_ABILITY_PARAMS.allyShield,
            pokemon,
            1,
            crit
          )
        }
      }
    })
  }
}

export class BloodMoonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(
      BLOOD_MOON_ABILITY_PARAMS.atkMultiplier * pokemon.atk
    )
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerWound(
          BLOOD_MOON_ABILITY_PARAMS.woundDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class MantisBladesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      MANTIS_BLADES_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MANTIS_BLADES_ABILITY_PARAMS.damageByStar.at(-1)!

    for (const damageType of [
      AttackType.PHYSICAL,
      AttackType.SPECIAL,
      AttackType.TRUE
    ]) {
      target.handleSpecialDamage(damage, board, damageType, pokemon, crit, true)
    }
  }
}

export class SpiritBreakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SPIRIT_BREAK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SPIRIT_BREAK_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    const apDebuff = -SPIRIT_BREAK_ABILITY_PARAMS.abilityPowerReduction
    target.addAbilityPower(apDebuff, pokemon, 1, crit)
  }
}

export class SheerColdStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let executeChance =
      ((SHEER_COLD_ABILITY_PARAMS.executeChanceByStar[pokemon.stars - 1] ??
        SHEER_COLD_ABILITY_PARAMS.executeChanceByStar.at(-1)!) /
        100) *
      (1 + min(0)((pokemon.hp - target.hp) / target.hp))
    if (target.types.has(Synergy.ICE)) executeChance = 0
    else if (target.status.freeze) executeChance = 1

    let damage: number =
      SHEER_COLD_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SHEER_COLD_ABILITY_PARAMS.damageByStar.at(-1)!
    if (chance(executeChance, pokemon))
      damage = SHEER_COLD_ABILITY_PARAMS.executeDamage
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class ZapCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      ZAP_CANNON_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ZAP_CANNON_ABILITY_PARAMS.damageByStar.at(-1)!
    const duration =
      ZAP_CANNON_ABILITY_PARAMS.statusDurationByStarMs[pokemon.stars - 1] ??
      ZAP_CANNON_ABILITY_PARAMS.statusDurationByStarMs.at(-1)!
    target.status.triggerArmorReduction(duration, target)
    target.status.triggerParalysis(duration, target, pokemon)
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class IceHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerFreeze(
      ICE_HAMMER_ABILITY_PARAMS.freezeDurationMs,
      target,
      pokemon
    )
    pokemon.status.triggerParalysis(
      ICE_HAMMER_ABILITY_PARAMS.paralysisDurationMs,
      pokemon,
      pokemon
    )
    const damage: number =
      ICE_HAMMER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ICE_HAMMER_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class FacadeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      FACADE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FACADE_ABILITY_PARAMS.damageByStar.at(-1)!

    if (pokemon.status.hasNegativeStatus()) {
      damage *= FACADE_ABILITY_PARAMS.negativeStatusMultiplier
    }
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class ExtremeSpeedStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = EXTREME_SPEED_ABILITY_PARAMS.damage
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class PsychoBoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = PSYCHO_BOOST_ABILITY_PARAMS.damage
    for (const offsetX of PSYCHO_BOOST_ABILITY_PARAMS.targetOffsetsX) {
      const positionX = target.positionX + offsetX
      const tg = board.getEntityOnCell(positionX, target.positionY)
      if (tg && tg.team !== pokemon.team) {
        pokemon.broadcastAbility({
          positionX: tg.positionX,
          positionY: tg.positionY
        })
        tg.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
        pokemon.addAbilityPower(
          -PSYCHO_BOOST_ABILITY_PARAMS.abilityPowerReductionPerHit,
          pokemon,
          0,
          false
        )
      }
    }
  }
}

export class PollenPuffStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp - b.hp)[0]

    if (lowestHealthAlly) {
      const heal: number =
        POLLEN_PUFF_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
        POLLEN_PUFF_ABILITY_PARAMS.healByStar.at(-1)!
      lowestHealthAlly.handleHeal(heal, pokemon, 1, crit)
      pokemon.broadcastAbility({
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class PsystrikeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const furthestTarget =
      pokemon.state.getFarthestTarget(pokemon, board) ?? target
    const targetsHit: Set<PokemonEntity> = new Set()
    pokemon.broadcastAbility({
      targetX: furthestTarget.positionX,
      targetY: furthestTarget.positionY
    })
    const cells = board.getCellsBetween(
      pokemon.positionX,
      pokemon.positionY,
      furthestTarget.positionX,
      furthestTarget.positionY
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team != pokemon.team) {
        targetsHit.add(cell.value)
      }
    })

    if (targetsHit.size === 0) {
      targetsHit.add(furthestTarget) // guarantee at least the furthest target is hit
    }
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        PSYSTRIKE_ABILITY_PARAMS.damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      const teleportationCell = board.getTeleportationCell(
        enemy.positionX,
        enemy.positionY,
        enemy.team
      )
      if (teleportationCell) {
        enemy.moveTo(teleportationCell.x, teleportationCell.y, board, true)
      }
    })
  }
}

export class DreamEaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const sleepingTarget = board.find(
      (x, y, entity) => entity.status.sleep && entity.team !== pokemon.team
    )

    if (sleepingTarget) {
      pokemon.broadcastAbility({
        targetX: sleepingTarget.positionX,
        targetY: sleepingTarget.positionY
      })
      const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
        sleepingTarget,
        board,
        1
      )
      if (coord) {
        pokemon.moveTo(coord.x, coord.y, board, false)
      }
      const damage =
        DREAM_EATER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
        DREAM_EATER_ABILITY_PARAMS.damageByStar.at(-1)!
      const { takenDamage } = sleepingTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        true
      )
      pokemon.handleHeal(takenDamage, pokemon, 0, false)
    } else {
      const duration = Math.round(
        (DREAM_EATER_ABILITY_PARAMS.sleepDurationByStar[pokemon.stars - 1] ??
          DREAM_EATER_ABILITY_PARAMS.sleepDurationByStar.at(-1)!) *
          (1 + pokemon.ap / 100)
      )
      target.status.triggerSleep(duration, target)
      pokemon.broadcastAbility({
        targetX: target.positionX,
        targetY: target.positionY
      })
      pokemon.pp = pokemon.maxPP
    }
  }
}

export class SparkStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SPARK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SPARK_ABILITY_PARAMS.damageByStar.at(-1)!
    const enemiesHit = new Set<string>()

    const propagate = (currentTarget: PokemonEntity, nbBounce = 1) => {
      const newTarget = board
        .getAdjacentCells(currentTarget.positionX, currentTarget.positionY)
        .find(
          (cell) =>
            cell.value &&
            cell.value.team === target.team &&
            !enemiesHit.has(cell.value.id)
        )?.value

      if (newTarget) {
        enemiesHit.add(newTarget.id)
        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.broadcastAbility({
              targetX: newTarget.positionX,
              targetY: newTarget.positionY,
              positionX: currentTarget.positionX,
              positionY: currentTarget.positionY,
              ap: min(-100)(pokemon.ap - nbBounce * 20)
            })
            const reducedDamage = Math.ceil(damage / Math.pow(2, nbBounce))
            newTarget.handleSpecialDamage(
              reducedDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit,
              true
            )
            if (nbBounce < SPARK_ABILITY_PARAMS.maxBounces) {
              // safety to avoid infinite loops
              propagate(newTarget, nbBounce + 1)
            }
          }, SPARK_ABILITY_PARAMS.bounceDelayMs)
        )
      }
    }

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )

    propagate(target)
  }
}

export class CrunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      CRUNCH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      CRUNCH_ABILITY_PARAMS.damageByStar.at(-1)!
    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    if (death) {
      pokemon.handleHeal(
        Math.ceil(CRUNCH_ABILITY_PARAMS.healOnKillHpRatio * target.maxHP),
        pokemon,
        0,
        false
      )
    }
  }
}

export class CrossPoisonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      CROSS_POISON_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      CROSS_POISON_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            true
          )
          cell.value.status.triggerPoison(
            CROSS_POISON_ABILITY_PARAMS.poisonDurationMs,
            cell.value,
            pokemon
          )
        }
      })
  }
}

export class FireFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FIRE_FANG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FIRE_FANG_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerBurn(
      FIRE_FANG_ABILITY_PARAMS.burnDurationMs,
      target,
      pokemon
    )
  }
}

export class IceFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      ICE_FANG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ICE_FANG_ABILITY_PARAMS.damageByStar.at(-1)!
    const freezeDuration: number =
      ICE_FANG_ABILITY_PARAMS.freezeDurationByStar[pokemon.stars - 1] ??
      ICE_FANG_ABILITY_PARAMS.freezeDurationByStar.at(-1)!
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    target.status.triggerFreeze(freezeDuration, target, pokemon)
  }
}

export class ThunderFangStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      THUNDER_FANG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      THUNDER_FANG_ABILITY_PARAMS.damageByStar.at(-1)!
    target.status.triggerParalysis(
      THUNDER_FANG_ABILITY_PARAMS.paralysisDurationMs,
      target,
      pokemon
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class TailWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defLoss =
      -TAIL_WHIP_ABILITY_PARAMS.defenseReductionPercent * target.def
    target.addDefense(defLoss, pokemon, 1, crit)
  }
}

export class PsyshieldBashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      PSYSHIELD_BASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      PSYSHIELD_BASH_ABILITY_PARAMS.damageByStar.at(-1)!

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })

      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    pokemon.status.triggerProtect(
      PSYSHIELD_BASH_ABILITY_PARAMS.protectDurationMs
    )

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class TorchSongStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    // Blow out [4,SP] raging flames to random opponents. Each flame deals 50% of ATK as SPECIAL, with [30,LK]% chance to BURN for 2 seconds, and buff the user AP by [1,2,3].
    const damagePerFlame =
      TORCH_SONG_ABILITY_PARAMS.damagePercentOfAtk * pokemon.atk
    const apGainPerFlame =
      TORCH_SONG_ABILITY_PARAMS.apGainPerFlameByStar[pokemon.stars - 1] ??
      TORCH_SONG_ABILITY_PARAMS.apGainPerFlameByStar.at(-1)!

    const enemies: PokemonEntity[] = []
    board.forEach((x: number, y: number, tg: PokemonEntity | undefined) => {
      if (tg && pokemon.team != tg.team) {
        enemies.push(tg)
      }
    })

    const nbFlames = Math.round(
      TORCH_SONG_ABILITY_PARAMS.baseFlameCount *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    for (let i = 0; i < nbFlames; i++) {
      const randomTarget = pickRandomIn(enemies)
      if (randomTarget) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.broadcastAbility({
              targetX: randomTarget.positionX,
              targetY: randomTarget.positionY
            })
            pokemon.addAbilityPower(apGainPerFlame, pokemon, 0, false)
            if (randomTarget.hp > 0) {
              randomTarget.handleSpecialDamage(
                damagePerFlame,
                board,
                AttackType.SPECIAL,
                pokemon,
                false,
                false
              )
              if (chance(TORCH_SONG_ABILITY_PARAMS.burnChance, pokemon)) {
                randomTarget.status.triggerBurn(
                  TORCH_SONG_ABILITY_PARAMS.burnDurationMs,
                  randomTarget,
                  pokemon
                )
              }
            }
          }, TORCH_SONG_ABILITY_PARAMS.flameDelayMs * i)
        )
      }
    }
  }
}

export class PowerWhipStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      (POWER_WHIP_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
        POWER_WHIP_ABILITY_PARAMS.baseDamageByStar.at(-1)!) +
      POWER_WHIP_ABILITY_PARAMS.hpDamageRatio * pokemon.hp
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

class DarkHarvestEffect extends PeriodicEffect {
  duration: number
  constructor(duration: number, pokemon: PokemonEntity) {
    super(
      (pokemon) => {
        if (
          pokemon.status.resurrecting ||
          pokemon.status.freeze ||
          pokemon.status.sleep
        ) {
          return // temporary disable during resurrection, freeze or sleep
        }
        pokemon.broadcastAbility({ skill: Ability.DARK_HARVEST })
        const board = pokemon.simulation.board
        const crit = pokemon.effects.has(EffectEnum.ABILITY_CRIT)
          ? chance(pokemon.critChance / 100, pokemon)
          : false
        const darkHarvestDamage =
          DARK_HARVEST_ABILITY_PARAMS.tickDamageByStar[pokemon.stars - 1] ??
          DARK_HARVEST_ABILITY_PARAMS.tickDamageByStar.at(-1)!
        const healFactor = DARK_HARVEST_ABILITY_PARAMS.healRatio
        board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              const { takenDamage } = cell.value.handleSpecialDamage(
                darkHarvestDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit,
                true
              )
              pokemon.handleHeal(
                Math.round(takenDamage * healFactor),
                pokemon,
                0,
                false
              )
            }
          })

        if (this.duration <= 0) {
          pokemon.effectsSet.delete(this)
          pokemon.effects.delete(EffectEnum.DARK_HARVEST)
        } else {
          this.duration -= this.intervalMs
        }
      },
      EffectEnum.DARK_HARVEST,
      1000
    )

    this.timer = 0 // delay the first tick
    this.duration = duration + this.intervalMs

    if (pokemon.effects.has(EffectEnum.DARK_HARVEST)) {
      // merge with existing effect if not finished before the next cast
      pokemon.effectsSet.delete(this)
      for (const effect of pokemon.effectsSet) {
        if (effect instanceof DarkHarvestEffect) {
          effect.duration = Math.max(this.duration, effect.duration)
          effect.timer = this.timer
          break
        }
      }
    } else {
      pokemon.effects.add(EffectEnum.DARK_HARVEST)
    }
  }
}

export class DarkHarvestStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )
      pokemon.effectsSet.add(
        new DarkHarvestEffect(
          DARK_HARVEST_ABILITY_PARAMS.effectDurationMs,
          pokemon
        )
      )
      pokemon.status.triggerSilence(
        DARK_HARVEST_ABILITY_PARAMS.effectDurationMs,
        pokemon,
        pokemon
      )
    }
  }
}

export class StoneEdgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const duration =
      STONE_EDGE_ABILITY_PARAMS.silenceDurationByStarMs[pokemon.stars - 1] ??
      STONE_EDGE_ABILITY_PARAMS.silenceDurationByStarMs.at(-1)!
    if (pokemon.effects.has(EffectEnum.STONE_EDGE)) return // ignore if already active

    pokemon.status.triggerSilence(duration, pokemon, pokemon)
    pokemon.effects.add(EffectEnum.STONE_EDGE)
    pokemon.addCritChance(
      STONE_EDGE_ABILITY_PARAMS.critChanceBonus,
      pokemon,
      1,
      false
    )
    pokemon.range += STONE_EDGE_ABILITY_PARAMS.rangeBonus
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addCritChance(
          -STONE_EDGE_ABILITY_PARAMS.critChanceBonus,
          pokemon,
          1,
          false
        )
        pokemon.range = min(pokemon.baseRange)(
          pokemon.range - STONE_EDGE_ABILITY_PARAMS.rangeBonus
        )
        pokemon.effects.delete(EffectEnum.STONE_EDGE)
      }, duration)
    )
  }
}

export class PsyShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const ppBurn =
      (PSYSHOCK_ABILITY_PARAMS.ppBurnByStar[pokemon.stars - 1] ??
        PSYSHOCK_ABILITY_PARAMS.ppBurnByStar.at(-1)!) *
      (1 + pokemon.ap / PSYSHOCK_ABILITY_PARAMS.apScalingDivisor)
    const ppStolen = max(target.pp)(ppBurn)
    const extraPP = ppBurn - ppStolen

    target.addPP(-ppStolen, pokemon, 0, false)
    pokemon.addShield(ppBurn, pokemon, 0, false)
    if (extraPP > 0) {
      target.handleSpecialDamage(
        extraPP,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit,
        false
      )
    }
  }
}

export class HeavySlamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage: number =
      HEAVY_SLAM_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEAVY_SLAM_ABILITY_PARAMS.damageByStar.at(-1)!
    if (pokemon.maxHP > target.maxHP) {
      damage = Math.round(
        damage *
          (1 +
            (HEAVY_SLAM_ABILITY_PARAMS.bonusMultiplierFactor *
              (pokemon.maxHP - target.maxHP)) /
              target.maxHP)
      )
    }
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class BulldozeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      BULLDOZE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BULLDOZE_ABILITY_PARAMS.damageByStar.at(-1)!
    const speedReduction = BULLDOZE_ABILITY_PARAMS.speedReduction
    const adjacentsCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )

    for (const cell of adjacentsCells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        const orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY,
          pokemon,
          undefined
        )
        const destination = board.getKnockBackPlace(
          cell.value.positionX,
          cell.value.positionY,
          orientation
        )

        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board, true)
          cell.value.resetCooldown(
            BULLDOZE_ABILITY_PARAMS.knockbackCooldownResetMs
          )
        }

        cell.value.addSpeed(-speedReduction, pokemon, 0, false)

        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}

export class RapidSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      RAPID_SPIN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      RAPID_SPIN_ABILITY_PARAMS.damageByStar.at(-1)!
    const buffAmount = Math.round(
      RAPID_SPIN_ABILITY_PARAMS.defenseBuffAtkRatio * pokemon.atk
    )

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    pokemon.addDefense(buffAmount, pokemon, 1, crit)
    pokemon.addSpecialDefense(buffAmount, pokemon, 1, crit)
  }
}

export class BounceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const nbBounces =
      BOUNCE_ABILITY_PARAMS.nbBouncesByStar[pokemon.stars - 1] ??
      BOUNCE_ABILITY_PARAMS.nbBouncesByStar.at(-1)!
    for (let i = 0; i < nbBounces; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const destination =
            board.getFarthestTargetCoordinateAvailablePlace(pokemon)
          if (destination && pokemon.maxHP > 0) {
            pokemon.broadcastAbility({})
            pokemon.moveTo(destination.x, destination.y, board, false)
            const adjacentCells = board.getAdjacentCells(
              destination.x,
              destination.y
            )
            adjacentCells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                const damage =
                  BOUNCE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
                  BOUNCE_ABILITY_PARAMS.damageByStar.at(-1)!
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            })
          }
        }, i * BOUNCE_ABILITY_PARAMS.bounceIntervalMs)
      )
    }
  }
}

export class GunkShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      GUNK_SHOT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      GUNK_SHOT_ABILITY_PARAMS.damageByStar.at(-1)!
    const baseDuration: number =
      GUNK_SHOT_ABILITY_PARAMS.poisonDurationByStar[pokemon.stars - 1] ??
      GUNK_SHOT_ABILITY_PARAMS.poisonDurationByStar.at(-1)!
    const duration = Math.round(
      baseDuration * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerPoison(duration, target, pokemon)
  }
}

export class AncientPowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      ANCIENT_POWER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ANCIENT_POWER_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(
      ANCIENT_POWER_ABILITY_PARAMS.apBoost,
      pokemon,
      0,
      false
    )
  }
}

export class MuddyWaterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const cells = board.getCellsInFront(pokemon, target)
    const damage: number =
      MUDDY_WATER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MUDDY_WATER_ABILITY_PARAMS.damageByStar.at(-1)!
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerArmorReduction(
          MUDDY_WATER_ABILITY_PARAMS.armorReductionDurationMs,
          cell.value
        )
        cell.value.status.triggerWound(
          MUDDY_WATER_ABILITY_PARAMS.woundDurationMs,
          cell.value,
          pokemon
        )
      }
    })
  }
}

export class MoonDreamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const duration: number =
      MOON_DREAM_ABILITY_PARAMS.sleepDurationByStar[pokemon.stars - 1] ??
      MOON_DREAM_ABILITY_PARAMS.sleepDurationByStar.at(-1)!

    const shield: number =
      MOON_DREAM_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      MOON_DREAM_ABILITY_PARAMS.shieldByStar.at(-1)!
    const count = MOON_DREAM_ABILITY_PARAMS.allyCount

    const allies = board.cells.filter(
      (p) => p && p.team === pokemon.team && p.id !== pokemon.id
    ) as PokemonEntity[]
    const alliesHit = allies
      .sort(
        (a, b) =>
          distanceM(
            a.positionX,
            a.positionY,
            pokemon.targetX,
            pokemon.targetY
          ) -
          distanceM(b.positionX, b.positionY, pokemon.targetX, pokemon.targetY)
      )
      .slice(0, count)

    alliesHit.forEach((ally) => {
      ally.addShield(shield, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: ally.positionX,
        positionY: ally.positionY
      })
    })

    target.status.triggerSleep(duration, target)
  }
}

export class StoneAxeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const cells = board.getAdjacentCells(target.positionX, target.positionY)
    const damage = STONE_AXE_ABILITY_PARAMS.damage
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)

    cells.forEach((cell) => {
      board.addBoardEffect(
        cell.x,
        cell.y,
        EffectEnum.STEALTH_ROCKS,
        pokemon.simulation
      )

      pokemon.broadcastAbility({
        skill: Ability.STEALTH_ROCKS,
        positionX: cell.x,
        positionY: cell.y
      })
    })
  }
}

export class FlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const duration =
      (FLASH_ABILITY_PARAMS.durationByStar[pokemon.stars - 1] ??
        FLASH_ABILITY_PARAMS.durationByStar.at(-1)!) *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)
    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        FLASH_ABILITY_PARAMS.radius,
        false
      )
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerBlinded(duration, cell.value)
        }
      })
  }
}

export class RockHeadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(
      (ROCK_HEAD_ABILITY_PARAMS.damagePercentAtkPlusDef / 100) *
        (pokemon.atk + pokemon.def)
    )

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class CrushClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const defLoss =
      CRUSH_CLAW_ABILITY_PARAMS.defenseReductionByStar[pokemon.stars - 1] ??
      CRUSH_CLAW_ABILITY_PARAMS.defenseReductionByStar.at(-1)!
    target.addDefense(-defLoss, pokemon, 0, false)
    for (let i = 0; i < CRUSH_CLAW_ABILITY_PARAMS.hitCount; i++) {
      target.handleSpecialDamage(
        pokemon.atk * CRUSH_CLAW_ABILITY_PARAMS.attackDamageRatio,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit,
        true
      )
    }
  }
}

export class FireLashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FIRE_LASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FIRE_LASH_ABILITY_PARAMS.damageByStar.at(-1)!
    target.status.triggerArmorReduction(
      FIRE_LASH_ABILITY_PARAMS.armorReductionDurationMs,
      target
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}

export class DrainPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const result = target.handleSpecialDamage(
      pokemon.atk * DRAIN_PUNCH_ABILITY_PARAMS.atkMultiplier,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
    pokemon.handleHeal(
      result.takenDamage * DRAIN_PUNCH_ABILITY_PARAMS.healRatio,
      pokemon,
      0,
      false
    )
  }
}

export class FairyLockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.status.triggerLocked(
      FAIRY_LOCK_ABILITY_PARAMS.lockDurationMs,
      target
    )

    const cells = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell && cell.value && cell.value.team !== pokemon.team)

    cells.forEach((cell) => {
      pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      cell.value?.handleSpecialDamage(
        Math.round(FAIRY_LOCK_ABILITY_PARAMS.totalDamage / cells.length),
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class GravityStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const lockDuration = Math.round(
      GRAVITY_ABILITY_PARAMS.baseLockDurationMs *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    board.forEach((x, y, unitOnCell) => {
      if (unitOnCell && unitOnCell.team !== pokemon.team) {
        unitOnCell.status.triggerLocked(lockDuration, unitOnCell)
      }
    })
  }
}

export class InfestationStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const numberOfBugAllies = board.cells.filter(
      (entity) =>
        entity && entity.team === pokemon.team && entity.types.has(Synergy.BUG)
    ).length
    const damage =
      numberOfBugAllies * INFESTATION_ABILITY_PARAMS.damagePerBugAlly
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    if (pokemon.player && pokemon.count.ult === 1) {
      const bugsOnBench = values(pokemon.player?.board).filter(
        (p) => p && p.types.has(Synergy.BUG) && isOnBench(p)
      )
      const mostPowerfulBug = getStrongestUnit(bugsOnBench)
      if (mostPowerfulBug) {
        pokemon.broadcastAbility({
          positionX: mostPowerfulBug.positionX,
          positionY: pokemon.team === Team.RED_TEAM ? 8 : 0,
          targetX: pokemon.positionX,
          targetY: pokemon.positionY
        })
        pokemon.commands.push(
          new DelayedCommand(
            () => {
              const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
                pokemon,
                board
              )
              if (coord) {
                pokemon.simulation.addPokemon(
                  mostPowerfulBug,
                  coord.x,
                  coord.y,
                  pokemon.team,
                  true
                )
              }
            },
            distanceM(
              pokemon.positionX,
              pokemon.positionY,
              mostPowerfulBug.positionX,
              mostPowerfulBug.positionY
            ) *
              INFESTATION_ABILITY_PARAMS.benchMoveDelayDistanceMs -
              INFESTATION_ABILITY_PARAMS.benchMoveDelayOffsetMs
          )
        )
      }
    }
  }
}

export class GulpMissileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    let missilePkm = Pkm.ARROKUDA
    let missilePkmString = "arrokuda"

    const damage = GULP_MISSILE_ABILITY_PARAMS.damage

    if (chance(GULP_MISSILE_ABILITY_PARAMS.pikachuChance, pokemon)) {
      missilePkm = Pkm.PIKACHU
      missilePkmString = "pikachu"
    }

    pokemon.broadcastAbility({
      skill: `GULP_MISSILE/${missilePkmString}`
    })

    const missile = PokemonFactory.createPokemonFromName(
      missilePkm,
      pokemon.player
    )
    if (pokemon.player) pokemon.player.pokemonsPlayed.add(missilePkm)

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const coord = pokemon.state.getNearestAvailablePlaceCoordinates(
            target,
            board
          )
          if (coord) {
            const entity = pokemon.simulation.addPokemon(
              missile,
              coord.x,
              coord.y,
              pokemon.team,
              true
            )

            entity.pp = entity.maxPP

            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        },
        distanceM(
          target.positionX,
          target.positionY,
          pokemon.positionX,
          pokemon.positionY
        ) *
          150 -
          30
      )
    )
  }
}

export class DoubleShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.status.triggerParalysis(
      DOUBLE_SHOCK_ABILITY_PARAMS.selfParalysisDurationMs,
      pokemon,
      pokemon
    )
    const damage =
      DOUBLE_SHOCK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DOUBLE_SHOCK_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class PurifyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal: number =
      PURIFY_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      PURIFY_ABILITY_PARAMS.healByStar.at(-1)!
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
    pokemon.handleHeal(heal, pokemon, 1, crit)
  }
}

export class PastelVeilStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const shield: number =
      PASTEL_VEIL_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      PASTEL_VEIL_ABILITY_PARAMS.shieldByStar.at(-1)!
    const farthestCoordinate = board.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      true
    )
    const alliesHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          alliesHit.add(cell.value)
        }
      })

      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (alliesHit.size === 0) alliesHit.add(pokemon) // guarantee at least the user is hit
    alliesHit.forEach((ally) => {
      ally.status.clearNegativeStatus(ally, pokemon)
      ally.addShield(shield, pokemon, 1, crit)
    })
  }
}

export class CharmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const attackReduce =
      CHARM_ABILITY_PARAMS.attackReductionByStar[pokemon.stars - 1] ??
      CHARM_ABILITY_PARAMS.attackReductionByStar.at(-1)!
    target.addAttack(-attackReduce, pokemon, 1, crit)
    target.status.triggerCharm(
      CHARM_ABILITY_PARAMS.charmDurationMs,
      target,
      pokemon,
      false
    )
  }
}

export class EntrainmentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.addPP(ENTRAINMENT_ABILITY_PARAMS.ppGained, pokemon, 1, crit)
    if (target.skill !== Ability.ENTRAINMENT) {
      target.skill = Ability.ENTRAINMENT
    } else {
      const potentialTargets: { x: number; y: number; value: PokemonEntity }[] =
        []
      board.forEach(
        (x: number, y: number, value: PokemonEntity | undefined) => {
          if (value && value.team !== pokemon.team && value.hp > 0) {
            potentialTargets.push({ x, y, value })
          }
        }
      )
      potentialTargets.sort(
        (a, b) =>
          distanceC(pokemon.positionX, pokemon.positionY, a.x, a.y) -
          distanceC(pokemon.positionX, pokemon.positionY, b.x, b.y)
      )
      if (potentialTargets.length > 0) {
        potentialTargets[0].value.skill = Ability.ENTRAINMENT
      }
    }
  }
}

export class OctazookaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.ceil(
      pokemon.atk * OCTAZOOKA_ABILITY_PARAMS.atkMultiplier
    )

    pokemon.count.attackCount++ // trigger attack animation
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    target.status.triggerBlinded(
      OCTAZOOKA_ABILITY_PARAMS.blindDurationMs,
      target
    )
  }
}

export class PsychoShiftStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const farthestEnemy = pokemon.state.getFarthestTarget(pokemon, board)
    pokemon.broadcastAbility({
      positionX: target.positionX,
      positionY: target.positionY,
      targetX: farthestEnemy?.positionX,
      targetY: farthestEnemy?.positionY
    })

    if (farthestEnemy && farthestEnemy.id !== target.id) {
      farthestEnemy.moveTo(target.positionX, target.positionY, board, true)
      farthestEnemy.handleSpecialDamage(
        PSYCHO_SHIFT_ABILITY_PARAMS.damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }

    target.handleSpecialDamage(
      PSYCHO_SHIFT_ABILITY_PARAMS.damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}

export class GlaiveRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage: number =
      GLAIVE_RUSH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      GLAIVE_RUSH_ABILITY_PARAMS.damageByStar.at(-1)!
    pokemon.status.triggerArmorReduction(
      GLAIVE_RUSH_ABILITY_PARAMS.armorReductionDurationMs,
      pokemon
    )
    const destinationRow =
      pokemon.team === Team.RED_TEAM
        ? pokemon.positionY <= 1
          ? BOARD_HEIGHT - 1
          : 0
        : pokemon.positionY >= BOARD_HEIGHT - 2
          ? 0
          : BOARD_HEIGHT - 1

    const destination = board.getClosestAvailablePlace(
      pokemon.positionX,
      destinationRow
    )
    const enemiesHit = new Set<PokemonEntity>()
    if (destination) {
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: destination.x,
        targetY: destination.y
      })
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        destination.x,
        destination.y
      )
      pokemon.moveTo(destination.x, destination.y, board, false)

      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          enemiesHit.add(cell.value)
        }
      })
    }

    if (enemiesHit.size === 0) enemiesHit.add(target) // ensure to at least hit the target
    enemiesHit.forEach((enemy) => {
      enemy.status.triggerArmorReduction(
        GLAIVE_RUSH_ABILITY_PARAMS.armorReductionDurationMs,
        pokemon
      )
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

export class FoulPlayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      pokemon.stars === 3
        ? target.atk * FOUL_PLAY_ABILITY_PARAMS.atkMultiplierByStar[2]
        : pokemon.stars === 2
          ? target.atk * FOUL_PLAY_ABILITY_PARAMS.atkMultiplierByStar[1]
          : target.atk * FOUL_PLAY_ABILITY_PARAMS.atkMultiplierByStar[0]
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class DoubleIronBashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(
      pokemon.atk * DOUBLE_IRON_BASH_ABILITY_PARAMS.atkRatio
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.PHYSICAL,
      pokemon,
      crit
    )
    target.status.triggerFlinch(
      DOUBLE_IRON_BASH_ABILITY_PARAMS.flinchDurationMs,
      pokemon
    )
  }
}

export class RoarStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      ROAR_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ROAR_ABILITY_PARAMS.damageByStar.at(-1)!

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    let farthestEmptyCell: Cell | null = null
    effectInOrientation(board, pokemon, target, (cell) => {
      if (cell.value != null && target.id !== cell.value.id) {
        if (cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        board.swapCells(
          target.positionX,
          target.positionY,
          cell.value.positionX,
          cell.value.positionY
        )
      }
      if (!cell.value) {
        farthestEmptyCell = cell
      }
    })

    if (farthestEmptyCell) {
      const { x, y } = farthestEmptyCell as Cell
      board.swapCells(target.positionX, target.positionY, x, y)
    }
  }
}

export class IvyCudgelStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = IVY_CUDGEL_ABILITY_PARAMS.damage
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (pokemon.passive === Passive.OGERPON_TEAL) {
      const nbAdjacentEnemies = board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
        .filter((cell) => cell.value && cell.value.team !== pokemon.team).length
      pokemon.addAttack(
        IVY_CUDGEL_ABILITY_PARAMS.tealAttackPerAdjacentEnemy *
          nbAdjacentEnemies,
        pokemon,
        1,
        crit
      )
    } else if (pokemon.passive === Passive.OGERPON_WELLSPRING) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team === pokemon.team) {
            cell.value.addPP(
              IVY_CUDGEL_ABILITY_PARAMS.wellspringAllyPpGain,
              pokemon,
              1,
              crit
            )
            cell.value.handleHeal(
              IVY_CUDGEL_ABILITY_PARAMS.wellspringAllyHeal,
              pokemon,
              1,
              crit
            )
          }
        })
    } else if (pokemon.passive === Passive.OGERPON_HEARTHFLAME) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              IVY_CUDGEL_ABILITY_PARAMS.hearthflameAdjacentDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            cell.value.status.triggerBurn(
              IVY_CUDGEL_ABILITY_PARAMS.hearthflameBurnDurationMs,
              pokemon,
              cell.value
            )
          }
        })
    } else if (pokemon.passive === Passive.OGERPON_CORNERSTONE) {
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .forEach((cell) => {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.status.triggerFlinch(
              IVY_CUDGEL_ABILITY_PARAMS.cornerstoneFlinchDurationMs,
              pokemon,
              cell.value
            )
          }
        })
      const factor = 0.5
      const protectDuration = Math.round(
        2000 *
          (1 + (pokemon.ap / 100) * factor) *
          (crit ? 1 + (pokemon.critPower - 1) * factor : 1)
      )
      pokemon.status.triggerProtect(protectDuration)
    }
  }
}

export class ForcePalmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const additionalDamage = target.status.paralysis
      ? FORCE_PALM_ABILITY_PARAMS.paralysisBonus
      : 0
    const damage = Math.round(
      FORCE_PALM_ABILITY_PARAMS.baseDamage +
        target.maxHP * FORCE_PALM_ABILITY_PARAMS.maxHpRatio +
        additionalDamage
    )
    if (target.status.paralysis) {
      let farthestEmptyCell: Cell | null = null
      effectInOrientation(board, pokemon, target, (cell) => {
        if (!cell.value) {
          farthestEmptyCell = cell
        }
      })
      if (farthestEmptyCell != null) {
        const { x, y } = farthestEmptyCell as Cell
        target.moveTo(x, y, board, true)
      }
    } else {
      target.status.triggerParalysis(
        FORCE_PALM_ABILITY_PARAMS.paralysisDurationMs,
        target,
        pokemon
      )
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class SteelWingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const baseDamage =
      STEEL_WING_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
      STEEL_WING_ABILITY_PARAMS.baseDamageByStar.at(-1)!
    const damage =
      baseDamage +
      STEEL_WING_ABILITY_PARAMS.defenseDamageMultiplier * pokemon.def
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          pokemon.broadcastAbility({ positionX: cell.x, positionY: cell.y })
          targetsHit.add(cell.value)
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // ensure to at least hit the target
    targetsHit.forEach((enemy) => {
      if (enemy.items.has(Item.TWIST_BAND) === false) {
        pokemon.addDefense(
          STEEL_WING_ABILITY_PARAMS.defenseSteal,
          pokemon,
          0,
          false
        )
        enemy.addDefense(
          -STEEL_WING_ABILITY_PARAMS.defenseSteal,
          pokemon,
          0,
          false
        )
      }
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}

class BideEffect extends PeriodicEffect {
  duration: number
  damageReceived: number = 0
  constructor(
    pokemon: PokemonEntity,
    duration: number,
    board: Board,
    crit: boolean
  ) {
    super(
      (pokemon) => {
        if (this.duration <= 0) {
          this.procDamage(pokemon, board, crit)
          pokemon.effectsSet.delete(this)
          pokemon.effectsSet.delete(damageMonitor)
        } else {
          this.duration -= this.intervalMs
        }
      },
      Ability.BIDE,
      1000
    )
    this.duration = duration
    const damageMonitor = new OnDamageReceivedEffect(({ damage }) => {
      this.damageReceived += damage
    }, Ability.BIDE)
    pokemon.effectsSet.add(damageMonitor)
  }
  procDamage(pokemon: PokemonEntity, board: Board, crit: boolean) {
    pokemon.broadcastAbility({ skill: Ability.BIDE })
    const damage = 2 * this.damageReceived
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value && pokemon.team != cell.value.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class BideStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.effectsSet.add(
      new BideEffect(pokemon, BIDE_ABILITY_PARAMS.durationMs, board, crit)
    )
  }
}

export class YawnStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const opponentsTargetingMe = board.cells.filter<PokemonEntity>(
      (entity): entity is PokemonEntity =>
        entity != null &&
        entity.team !== pokemon.team &&
        entity.targetEntityId === pokemon.id
    )

    opponentsTargetingMe.forEach((opponent) => {
      opponent.status.triggerFatigue(
        YAWN_ABILITY_PARAMS.fatigueDurationMs,
        pokemon
      )
      opponent.addAbilityPower(
        -YAWN_ABILITY_PARAMS.abilityPowerReduction,
        pokemon,
        0,
        false
      )
    })

    const shield =
      YAWN_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      YAWN_ABILITY_PARAMS.shieldByStar.at(-1)!
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.resetCooldown(YAWN_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class WiseYawnStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    // Find ally with lowest current health
    const lowestHealthAlly = (
      board.cells.filter(
        (cell) => cell && cell.team === pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp - b.hp)[0]

    if (lowestHealthAlly) {
      // Find enemies targeting the lowest health ally
      const opponentsTargetingLowestHealthAlly =
        board.cells.filter<PokemonEntity>(
          (entity): entity is PokemonEntity =>
            entity != null &&
            entity.team !== lowestHealthAlly.team &&
            entity.targetEntityId === lowestHealthAlly.id
        )

      // Apply fatigue and AP reduction to attackers
      opponentsTargetingLowestHealthAlly.forEach((opponent) => {
        opponent.status.triggerFatigue(
          WISE_YAWN_ABILITY_PARAMS.fatigueDurationMs,
          pokemon
        )
        opponent.addAbilityPower(
          -WISE_YAWN_ABILITY_PARAMS.abilityPowerReduction,
          pokemon,
          0,
          false
        )
      })

      // Shield the lowest health ally
      const shield =
        WISE_YAWN_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
        WISE_YAWN_ABILITY_PARAMS.shieldByStar.at(-1)!
      lowestHealthAlly.addShield(shield, pokemon, 1, crit)
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: lowestHealthAlly.positionX,
        targetY: lowestHealthAlly.positionY
      })
    }
  }
}

export class ShoreUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    let healFactor =
      SHORE_UP_ABILITY_PARAMS.healRatioByStar[pokemon.stars - 1] ??
      SHORE_UP_ABILITY_PARAMS.healRatioByStar.at(-1)!
    if (pokemon.simulation.weather === Weather.SANDSTORM) {
      healFactor += SHORE_UP_ABILITY_PARAMS.sandstormBonusHealRatio
    }
    pokemon.handleHeal(healFactor * pokemon.maxHP, pokemon, 1, crit)
  }
}

export class PoisonStingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let maxStacks: number = POISON_STING_ABILITY_PARAMS.baseMaxPoisonStacks
    if (pokemon.effects.has(EffectEnum.VENOMOUS)) {
      maxStacks = POISON_STING_ABILITY_PARAMS.venomousMaxPoisonStacks
    }
    if (pokemon.effects.has(EffectEnum.TOXIC)) {
      maxStacks = POISON_STING_ABILITY_PARAMS.toxicMaxPoisonStacks
    }

    const nbStacksToApply: number =
      POISON_STING_ABILITY_PARAMS.stacksToApplyByStar[pokemon.stars - 1] ??
      POISON_STING_ABILITY_PARAMS.stacksToApplyByStar.at(-1)!
    const currentStacks = target.status.poisonStacks
    const extraDamage =
      currentStacks + nbStacksToApply > maxStacks
        ? (currentStacks + nbStacksToApply - maxStacks) *
          (POISON_STING_ABILITY_PARAMS.excessDamageByStar[pokemon.stars - 1] ??
            POISON_STING_ABILITY_PARAMS.excessDamageByStar.at(-1)!)
        : 0
    for (let i = 0; i < nbStacksToApply; i++) {
      target.status.triggerPoison(
        POISON_STING_ABILITY_PARAMS.poisonDurationMs,
        target,
        pokemon
      )
    }
    if (extraDamage > 0) {
      target.handleSpecialDamage(
        extraDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class WoodHammerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = WOOD_HAMMER_ABILITY_PARAMS.damageMultiplier * pokemon.atk
    const recoil = WOOD_HAMMER_ABILITY_PARAMS.recoilMultiplier * pokemon.atk

    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )

        if (pokemon.items.has(Item.PROTECTIVE_PADS) === false) {
          pokemon.handleSpecialDamage(
            recoil,
            board,
            AttackType.PHYSICAL,
            pokemon,
            false,
            false
          )
        }
      }, WOOD_HAMMER_ABILITY_PARAMS.delayMs)
    )
  }
}

export class TrickOrTreatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    if (target.items.size > 0) {
      const item = values(target.items)[0]!
      target.removeItem(item)
      pokemon.addItem(item)
    } else {
      // transforms the unit into magikarp for X seconds, replacing its ability with splash
      const originalAbility = target.skill
      const originalAttack = target.atk
      const originalDefense = target.def
      const originalSpecialDefense = target.speDef
      const originalIndex = target.index
      const duration = Math.round(
        TRICK_OR_TREAT_ABILITY_PARAMS.magikarpDurationMs *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
      target.index = PkmIndex[Pkm.MAGIKARP]
      target.skill = Ability.SPLASH
      target.atk = 1
      target.def = 1
      target.speDef = 1
      target.commands.push(
        new DelayedCommand(() => {
          target.skill = originalAbility
          target.atk = originalAttack
          target.def = originalDefense
          target.speDef = originalSpecialDefense
          target.index = originalIndex
        }, duration)
      )
    }
  }
}

export class FreezingGlareStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    effectInLine(board, pokemon, target, (cell) => {
      if (cell.value != null && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          FREEZING_GLARE_ABILITY_PARAMS.damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(FREEZING_GLARE_ABILITY_PARAMS.freezeChance, pokemon)) {
          cell.value.status.triggerFreeze(
            FREEZING_GLARE_ABILITY_PARAMS.freezeDurationMs,
            cell.value,
            pokemon
          )
        }
      }
    })
  }
}

export class ThunderousKickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      THUNDEROUS_KICK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      THUNDEROUS_KICK_ABILITY_PARAMS.damageByStar.at(-1)!
    const defenseDebuff = THUNDEROUS_KICK_ABILITY_PARAMS.defenseDebuff

    let isBlocked = !target.canBeMoved
    let farthestReached: { x: number; y: number } = {
      x: target.positionX,
      y: target.positionY
    }
    const enemiesHit = new Set<PokemonEntity>()
    enemiesHit.add(target)
    effectInOrientation(board, pokemon, target, (cell) => {
      if (isBlocked) return
      if (
        cell.value &&
        cell.value.team !== pokemon.team &&
        cell.value.id !== target.id
      ) {
        enemiesHit.add(cell.value)
        if (
          board.isOnBoard(cell.x - 1, cell.y) &&
          board.getEntityOnCell(cell.x - 1, cell.y) === undefined &&
          cell.value.canBeMoved
        ) {
          // unit in the path is moved to the left
          cell.value.moveTo(cell.x - 1, cell.y, board, true)
          cell.value.cooldown =
            THUNDEROUS_KICK_ABILITY_PARAMS.knockbackCooldownMs
        } else if (
          board.isOnBoard(cell.x + 1, cell.y) &&
          board.getEntityOnCell(cell.x + 1, cell.y) === undefined &&
          cell.value.canBeMoved
        ) {
          // unit in the path is moved to the right
          cell.value.moveTo(cell.x + 1, cell.y, board, true)
          cell.value.cooldown =
            THUNDEROUS_KICK_ABILITY_PARAMS.knockbackCooldownMs
        } else {
          // the path is blocked, stop the effect
          isBlocked = true
        }
      }

      if (!isBlocked) {
        farthestReached = cell
      }
    })

    if (
      farthestReached &&
      (farthestReached.x !== target.positionX ||
        farthestReached.y !== target.positionY)
    ) {
      board.swapCells(
        target.positionX,
        target.positionY,
        farthestReached.x,
        farthestReached.y
      )
    }

    enemiesHit.forEach((enemy) => {
      enemy.status.triggerFlinch(
        THUNDEROUS_KICK_ABILITY_PARAMS.flinchDurationMs,
        pokemon
      )
      enemy.addDefense(-defenseDebuff, pokemon, 1, crit)
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    })
  }
}

export class FieryWrathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = FIERY_WRATH_ABILITY_PARAMS.damage

    board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        FIERY_WRATH_ABILITY_PARAMS.radius,
        false
      )
      .forEach((cell) => {
        const unit = cell.value
        if (unit && pokemon.team !== unit.team) {
          if (chance(FIERY_WRATH_ABILITY_PARAMS.flinchChance, pokemon)) {
            unit.status.triggerFlinch(
              FIERY_WRATH_ABILITY_PARAMS.flinchDurationMs,
              unit,
              pokemon
            )
          }
          unit.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
  }
}

export class ViseGripStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      VISE_GRIP_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      VISE_GRIP_ABILITY_PARAMS.damageByStar.at(-1)!
    target.status.triggerLocked(VISE_GRIP_ABILITY_PARAMS.lockDurationMs, target)
    pokemon.status.triggerLocked(
      VISE_GRIP_ABILITY_PARAMS.lockDurationMs,
      pokemon
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const defGain = target.def * VISE_GRIP_ABILITY_PARAMS.defAbsorptionRatio
    const spedefGain =
      target.speDef * VISE_GRIP_ABILITY_PARAMS.defAbsorptionRatio
    pokemon.addDefense(defGain, pokemon, 1, crit)
    pokemon.addSpecialDefense(spedefGain, pokemon, 1, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addDefense(-defGain, pokemon, 1, crit)
        pokemon.addSpecialDefense(-spedefGain, pokemon, 1, crit)
      }, VISE_GRIP_ABILITY_PARAMS.lockDurationMs)
    )
  }
}

export class LandsWrathStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const atkDamage = Math.round(
      pokemon.atk *
        LANDS_WRATH_ABILITY_PARAMS.atkMultiplier *
        (1 + pokemon.ap / 100)
    )
    const cells = board.getAdjacentCells(
      target.positionX,
      target.positionY,
      true
    )

    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          LANDS_WRATH_ABILITY_PARAMS.baseDamage + atkDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          false
        )
        cell.value.addDefense(
          -LANDS_WRATH_ABILITY_PARAMS.defenseReduction,
          pokemon,
          1,
          crit
        )
        cell.value.addSpecialDefense(
          -LANDS_WRATH_ABILITY_PARAMS.defenseReduction,
          pokemon,
          1,
          crit
        )
        pokemon.broadcastAbility({
          skill: "LANDS_WRATH/hit",
          positionX: cell.x,
          positionY: cell.y
        })
      }
    })
  }
}

export class ThousandArrowsStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage = THOUSAND_ARROWS_ABILITY_PARAMS.damage
    const numberOfProjectiles = THOUSAND_ARROWS_ABILITY_PARAMS.projectileCount

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const value = board.getEntityOnCell(x, y)
          if (value && value.team !== pokemon.team) {
            value.status.triggerLocked(
              THOUSAND_ARROWS_ABILITY_PARAMS.lockDurationMs,
              value
            )
            value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
          pokemon.broadcastAbility({
            skill: Ability.THOUSAND_ARROWS,
            positionX: x,
            positionY: BOARD_HEIGHT - 1,
            targetX: x,
            targetY: y
          })
        }, i * THOUSAND_ARROWS_ABILITY_PARAMS.delayBetweenProjectilesMs)
      )
    }
  }
}

export class CoreEnforcerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const cellsHit = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter(
        (cell) => cell.y !== target.positionY || cell.x === target.positionX
      ) // Z shape

    cellsHit.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.status.triggerSilence(
          CORE_ENFORCER_ABILITY_PARAMS.silenceDurationMs,
          cell.value
        )
        cell.value.handleSpecialDamage(
          CORE_ENFORCER_ABILITY_PARAMS.damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
      }
    })
  }
}

export class BurnUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      BURN_UP_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      BURN_UP_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.status.triggerBurn(
      BURN_UP_ABILITY_PARAMS.selfBurnDurationMs,
      pokemon,
      pokemon
    )
  }
}

export class PowerHugStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      POWER_HUG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      POWER_HUG_ABILITY_PARAMS.damageByStar.at(-1)!
    target.status.triggerLocked(
      POWER_HUG_ABILITY_PARAMS.lockedDurationMs,
      target
    )
    target.status.triggerParalysis(
      POWER_HUG_ABILITY_PARAMS.paralysisDurationMs,
      target,
      pokemon
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class MortalSpinStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      MORTAL_SPIN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MORTAL_SPIN_ABILITY_PARAMS.damageByStar.at(-1)!

    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )

    // Find all enemies targeting this unit
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        const abilityTarget = cell.value

        const enemyTarget = board.getEntityOnCell(
          abilityTarget.targetX,
          abilityTarget.targetY
        )

        if (enemyTarget === pokemon) {
          abilityTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          abilityTarget.status.triggerPoison(
            MORTAL_SPIN_ABILITY_PARAMS.poisonDurationMs,
            abilityTarget,
            pokemon
          )

          // Push targets back 1 tile
          let newY = -1
          if (
            pokemon.team === Team.BLUE_TEAM &&
            abilityTarget.positionY + 1 < BOARD_HEIGHT
          ) {
            newY = abilityTarget.positionY + 1
          } else if (abilityTarget.positionY - 1 > 0) {
            newY = abilityTarget.positionY - 1
          }

          if (
            newY !== -1 &&
            board.getEntityOnCell(
              abilityTarget.positionX,
              abilityTarget.positionY + 1
            ) === undefined
          ) {
            abilityTarget.moveTo(abilityTarget.positionX, newY, board, true)
            abilityTarget.cooldown =
              MORTAL_SPIN_ABILITY_PARAMS.knockbackCooldownMs
          }
        }
      }
    })
  }
}

export class MetalClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      METAL_CLAW_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      METAL_CLAW_ABILITY_PARAMS.damageByStar.at(-1)!
    const atkBuff: number =
      METAL_CLAW_ABILITY_PARAMS.atkBuffByStar[pokemon.stars - 1] ??
      METAL_CLAW_ABILITY_PARAMS.atkBuffByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    pokemon.addAttack(atkBuff, pokemon, 1, crit)
  }
}

export class FirestarterStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      FIRESTARTER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FIRESTARTER_ABILITY_PARAMS.damageByStar.at(-1)!
    const speedBuff =
      FIRESTARTER_ABILITY_PARAMS.speedBuffByStar[pokemon.stars - 1] ??
      FIRESTARTER_ABILITY_PARAMS.speedBuffByStar.at(-1)!

    const flyAwayCell = pokemon.flyAway(board, false)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (flyAwayCell) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        flyAwayCell.x,
        flyAwayCell.y
      )
      cells.forEach((cell, i) => {
        if (cell.x === flyAwayCell.x && cell.y === flyAwayCell.y) {
          pokemon.commands.push(
            new DelayedCommand(() => {
              pokemon.addSpeed(speedBuff, pokemon, 1, crit)
            }, FIRESTARTER_ABILITY_PARAMS.speedBuffDelayMs)
          )
        } else {
          pokemon.commands.push(
            new DelayedCommand(() => {
              board.addBoardEffect(
                cell.x,
                cell.y,
                EffectEnum.EMBER,
                pokemon.simulation
              )
              pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })

              if (cell.value && cell.value.team != pokemon.team) {
                targetsHit.add(cell.value)
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }, i * FIRESTARTER_ABILITY_PARAMS.emberStepDelayMs)
          )
          pokemon.commands.push(
            new DelayedCommand(
              () => {
                board.addBoardEffect(
                  cell.x,
                  cell.y,
                  EffectEnum.EMBER,
                  pokemon.simulation
                )
              },
              FIRESTARTER_ABILITY_PARAMS.emberPersistBaseDelayMs +
                i * FIRESTARTER_ABILITY_PARAMS.emberStepDelayMs
            )
          )
        }
      })
    }

    if (targetsHit.size === 0) {
      // ensure to at least hit the target
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class BoneArmorStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const lowestHealthEnemy = (
      board.cells.filter(
        (cell) => cell && cell.team !== pokemon.team
      ) as PokemonEntity[]
    ).sort((a, b) => a.hp / a.maxHP - b.hp / b.maxHP)[0]

    if (lowestHealthEnemy) {
      const coord = pokemon.simulation.getClosestFreeCellToPokemonEntity(
        lowestHealthEnemy,
        (lowestHealthEnemy.team + 1) % 2
      )
      if (coord) {
        pokemon.moveTo(coord.x, coord.y, board, false)
      }
      const damage =
        BONE_ARMOR_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
        BONE_ARMOR_ABILITY_PARAMS.damageByStar.at(-1)!
      const defBuff =
        BONE_ARMOR_ABILITY_PARAMS.defBuffByStar[pokemon.stars - 1] ??
        BONE_ARMOR_ABILITY_PARAMS.defBuffByStar.at(-1)!
      const attack = lowestHealthEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      if (attack.takenDamage > 0) {
        pokemon.handleHeal(attack.takenDamage, pokemon, 0, false)
      }
      if (attack.death) {
        pokemon.addDefense(defBuff, pokemon, 0, false)
        pokemon.addSpecialDefense(defBuff, pokemon, 0, false)
      }
    }
  }
}

export class TopsyTurvyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      TOPSY_TURVY_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TOPSY_TURVY_ABILITY_PARAMS.damageByStar.at(-1)!
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (target.atk !== target.baseAtk) {
          const d = target.atk - target.baseAtk
          target.addAttack(-2 * d, pokemon, 0, false)
        }
        if (target.ap !== 0) {
          target.addAbilityPower(-2 * target.ap, pokemon, 0, false)
        }
        if (target.def !== target.baseDef) {
          const d = target.def - target.baseDef
          target.addDefense(-2 * d, pokemon, 0, false)
        }
        if (target.speDef !== target.baseSpeDef) {
          const d = target.speDef - target.baseSpeDef
          target.addSpecialDefense(-2 * d, pokemon, 0, false)
        }
      }, TOPSY_TURVY_ABILITY_PARAMS.delayMs)
    )
  }
}

export class RageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const rageDuration = RAGE_ABILITY_PARAMS.rageDurationMs
    pokemon.status.triggerRage(rageDuration, pokemon)

    //gain 1 attack for each 10% of max HP missing
    const missingHp = pokemon.maxHP - pokemon.hp
    const atkBoost =
      pokemon.baseAtk *
      RAGE_ABILITY_PARAMS.attackBoostPerStepRatio *
      Math.floor(
        missingHp / (pokemon.maxHP * RAGE_ABILITY_PARAMS.missingHpStepRatio)
      )
    pokemon.addAttack(atkBoost, pokemon, 1, crit)
    pokemon.resetCooldown(RAGE_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class BrickBreakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = BRICK_BREAK_ABILITY_PARAMS.atkMultiplier * pokemon.atk
    if (target.status.protect) {
      target.status.protect = false
      target.status.protectCooldown = 0
    }
    if (target.status.reflect) {
      target.status.reflect = false
      target.status.reflectCooldown = 0
    }
    if (target.status.magicBounce) {
      target.status.magicBounce = false
      target.status.magicBounceCooldown = 0
    }
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    target.status.triggerArmorReduction(
      BRICK_BREAK_ABILITY_PARAMS.armorReductionDurationMs,
      target
    )
  }
}

export class ReturnStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      RETURN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      RETURN_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.addAbilityPower(
      RETURN_ABILITY_PARAMS.abilityPowerGain,
      pokemon,
      0,
      false,
      true
    )
  }
}

export class TauntStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Gain 25% (AP scaling=0.5) of max HP as shield, and force adjacent enemies to choose you as target
    const shield = TAUNT_ABILITY_PARAMS.shieldMaxHpPercent * pokemon.maxHP
    pokemon.addShield(
      shield,
      pokemon,
      TAUNT_ABILITY_PARAMS.shieldApScaling,
      crit
    )
    const enemiesTaunted = board.cells.filter(
      (enemy): enemy is PokemonEntity =>
        enemy != null &&
        enemy.team !== pokemon.team &&
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          target.positionX,
          target.positionY
        ) <= enemy.range
    )
    enemiesTaunted.forEach((enemy) => {
      enemy.setTarget(pokemon)
      pokemon.broadcastAbility({
        skill: "TAUNT_HIT",
        targetX: enemy.positionX,
        targetY: enemy.positionY
      })
    })
  }
}

export class BanefulBunkerStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const duration = BANEFUL_BUNKER_ABILITY_PARAMS.protectDurationMs
    pokemon.status.triggerProtect(duration)
    pokemon.effects.add(EffectEnum.BANEFUL_BUNKER)
    pokemon.commands.push(
      new DelayedCommand(
        () => pokemon.effects.delete(EffectEnum.BANEFUL_BUNKER),
        duration
      )
    )

    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.setTarget(pokemon)
        pokemon.broadcastAbility({
          skill: "TAUNT_HIT",
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
      }
    })
  }
}

export class BulkUpStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Increase base Attack and base Defense
    const atkBoost = Math.ceil(
      BULK_UP_ABILITY_PARAMS.atkRatio * pokemon.baseAtk
    )
    const defBoost = Math.ceil(
      BULK_UP_ABILITY_PARAMS.defRatio * pokemon.baseDef
    )
    pokemon.addAttack(atkBoost, pokemon, 1, crit)
    pokemon.addDefense(defBoost, pokemon, 1, crit)
    pokemon.resetCooldown(BULK_UP_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class CutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Deal [40,SP]% of target max HP as special damage. Inflicts WOUND for 5 seconds
    const damage = CUT_ABILITY_PARAMS.targetMaxHpDamageRatio * target.maxHP
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerWound(
      CUT_ABILITY_PARAMS.woundDurationMs,
      target,
      pokemon
    )
  }
}

export class FlyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const destination = board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    if (destination) {
      pokemon.status.triggerProtect(FLY_ABILITY_PARAMS.protectDurationMs)
      pokemon.broadcastAbility({
        skill: "FLYING_TAKEOFF",
        targetX: destination.target.positionX,
        targetY: destination.target.positionY
      })
      pokemon.skydiveTo(destination.x, destination.y, board)
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            skill: "FLYING_SKYDIVE",
            positionX: destination.x,
            positionY: destination.y,
            targetX: destination.target.positionX,
            targetY: destination.target.positionY
          })
        }, FLY_ABILITY_PARAMS.takeoffAnimationDelayMs)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          if (destination.target && destination.target.hp > 0) {
            const damage = FLY_ABILITY_PARAMS.atkMultiplier * pokemon.atk
            destination.target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, FLY_ABILITY_PARAMS.impactDelayMs)
      )
    }
  }
}

export class SurfStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: null,
    crit: boolean,
    preventDefaultAnim?: boolean,
    tierLevel = pokemon.stars
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      SURF_ABILITY_PARAMS.damageByStar[tierLevel - 1] ??
      SURF_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // Push targets back 1 tile horizontally
          const surfAngle = calcAngleDegrees(
            farthestCoordinate.x - pokemon.positionX,
            farthestCoordinate.y - pokemon.positionY
          )
          const targetAngle = calcAngleDegrees(
            cell.value.positionX - pokemon.positionX,
            cell.value.positionY - pokemon.positionY
          )

          const dx =
            (surfAngle > 180 ? -1 : 1) * (targetAngle < surfAngle ? +1 : -1)

          const newX = cell.x + dx
          if (
            board.isOnBoard(newX, cell.y) &&
            board.getEntityOnCell(newX, cell.y) === undefined
          ) {
            cell.value.moveTo(newX, cell.y, board, true)
            cell.value.cooldown = 500
          }
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0 && farthestCoordinate?.target) {
      // ensure to at least hit the farthest target
      farthestCoordinate.target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class HeadlongRushStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const finalTargetDamage: number =
      HEADLONG_RUSH_ABILITY_PARAMS.finalTargetDamageByStar[pokemon.stars - 1] ??
      HEADLONG_RUSH_ABILITY_PARAMS.finalTargetDamageByStar.at(-1)!
    const damageOnThePath: number =
      HEADLONG_RUSH_ABILITY_PARAMS.pathDamageByStar[pokemon.stars - 1] ??
      HEADLONG_RUSH_ABILITY_PARAMS.pathDamageByStar.at(-1)!
    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
          cell.value.handleSpecialDamage(
            cell.value.id === farthestCoordinate.target.id
              ? finalTargetDamage
              : damageOnThePath,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )

          // Lose 1 def and spe def per enemy hit
          pokemon.addDefense(-1, pokemon, 0, false)
          pokemon.addSpecialDefense(-1, pokemon, 0, false)

          // Push targets back 1 tile horizontally
          const rushAngle = calcAngleDegrees(
            farthestCoordinate.x - pokemon.positionX,
            farthestCoordinate.y - pokemon.positionY
          )
          const targetAngle = calcAngleDegrees(
            cell.value.positionX - pokemon.positionX,
            cell.value.positionY - pokemon.positionY
          )

          const dx =
            (rushAngle > 180 ? -1 : 1) * (targetAngle < rushAngle ? +1 : -1)

          const newX = cell.x + dx
          if (
            board.isOnBoard(newX, cell.y) &&
            board.getEntityOnCell(newX, cell.y) === undefined
          ) {
            cell.value.moveTo(newX, cell.y, board, true)
            cell.value.cooldown =
              HEADLONG_RUSH_ABILITY_PARAMS.knockbackCooldownMs
          }
        }
      })

      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) {
      // ensure to at least hit the target
      target.handleSpecialDamage(
        finalTargetDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class StrengthStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      STRENGTH_ABILITY_PARAMS.statsSumMultiplier *
        (pokemon.atk + pokemon.def + pokemon.speDef) +
      STRENGTH_ABILITY_PARAMS.abilityPowerMultiplier * pokemon.ap
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
  }
}

export class HardenStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const defGain: number =
      HARDEN_ABILITY_PARAMS.defGainByStar[pokemon.stars - 1] ??
      HARDEN_ABILITY_PARAMS.defGainByStar.at(-1)!
    pokemon.addDefense(defGain, pokemon, 1, crit)
  }
}

export class ColumnCrushStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const pillar = board.cells.find(
      (entity) =>
        entity &&
        entity.team === pokemon.team &&
        [Pkm.PILLAR_WOOD, Pkm.PILLAR_IRON, Pkm.PILLAR_CONCRETE].includes(
          entity.name
        )
    )
    if (pillar) {
      // If a pillar is already on the board, jumps to it and throw the pillar at the closest target, dealing [50,100,150,SP] + the remaining HP of the pillar as SPECIAL
      const pillarX = pillar.positionX
      const pillarY = pillar.positionY
      const remainingHp = pillar.hp
      const pillarType = pillar.name
      pillar.shield = 0
      pillar.handleSpecialDamage(
        COLUMN_CRUSH_ABILITY_PARAMS.pillarSuicideDamage,
        board,
        AttackType.TRUE,
        null,
        false
      )
      pokemon.moveTo(pillarX, pillarY, board, false)
      pokemon.resetCooldown(COLUMN_CRUSH_ABILITY_PARAMS.cooldownResetMs)

      pokemon.commands.push(
        new DelayedCommand(() => {
          const damage =
            (COLUMN_CRUSH_ABILITY_PARAMS.pillarThrowDamageByStar[
              pokemon.stars - 1
            ] ?? COLUMN_CRUSH_ABILITY_PARAMS.pillarThrowDamageByStar.at(-1)!) +
            remainingHp

          let enemyHit
          const targetCoordinate = pokemon.state.getNearestTargetAtSight(
            pokemon,
            board
          )
          if (targetCoordinate) {
            enemyHit = targetCoordinate.target
          }
          if (!enemyHit) {
            enemyHit = board.cells.find(
              (entity) => entity && entity.team !== pokemon.team
            )
          }
          if (enemyHit) {
            pokemon.setTarget(enemyHit)
            const landingX = enemyHit.positionX
            const landingY = enemyHit.positionY
            const travelTime =
              distanceE(
                pillarX,
                pillarY,
                enemyHit.positionX,
                enemyHit.positionY
              ) * 160

            pokemon.broadcastAbility({
              positionX: pillar.positionX,
              positionY: pillar.positionY,
              targetX: enemyHit.positionX,
              targetY: enemyHit.positionY,
              orientation: [
                Pkm.PILLAR_WOOD,
                Pkm.PILLAR_IRON,
                Pkm.PILLAR_CONCRETE
              ].indexOf(pillarType)
            })

            pokemon.commands.push(
              new DelayedCommand(() => {
                pokemon.broadcastAbility({
                  skill: Ability.ROCK_SMASH,
                  positionX: landingX,
                  positionY: landingY,
                  targetX: landingX,
                  targetY: landingY
                })

                if (enemyHit && enemyHit.hp > 0) {
                  enemyHit.handleSpecialDamage(
                    damage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              }, travelTime)
            )
          }
        }, COLUMN_CRUSH_ABILITY_PARAMS.throwPreparationDelayMs)
      )
    } else {
      //Builds a pillar of 100/200/300 HP and 1/3/5 DEF and SPE_DEF on the closest empty spot.
      const coord =
        pokemon.simulation.getClosestFreeCellToPokemonEntity(pokemon)
      if (!coord) return
      const pillarType =
        [Pkm.PILLAR_WOOD, Pkm.PILLAR_IRON, Pkm.PILLAR_CONCRETE][
          pokemon.stars - 1
        ] ?? Pkm.PILLAR_CONCRETE
      const pillar = PokemonFactory.createPokemonFromName(
        pillarType,
        pokemon.player
      )

      pokemon.simulation.addPokemon(
        pillar,
        coord.x,
        coord.y,
        pokemon.team,
        true
      )
    }
  }
}

export class WonderRoomStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .forEach((cell) => {
        const enemy = cell.value
        if (enemy && enemy.team !== pokemon.team) {
          enemy.effects.add(EffectEnum.WONDER_ROOM)
          enemy.commands.push(
            new DelayedCommand(() => {
              enemy.effects.delete(EffectEnum.WONDER_ROOM)
            }, WONDER_ROOM_ABILITY_PARAMS.durationMs)
          )
        }
      })
  }
}

export class DarkLariatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    //The user swings both arms and hits the target several times while moving behind them. Each hit deals [100,SP]% ATK as SPECIAL. Number of hits increase with SPEED. Target is FLINCH during the attack.
    const hits = Math.round(
      (DARK_LARIAT_ABILITY_PARAMS.hitBase +
        DARK_LARIAT_ABILITY_PARAMS.speedToHitsRatio * pokemon.speed) *
        DARK_LARIAT_ABILITY_PARAMS.hitCountMultiplier
    )
    target.status.triggerFlinch(
      DARK_LARIAT_ABILITY_PARAMS.flinchDurationMs,
      target,
      pokemon
    )
    for (let i = 0; i < hits; i++) {
      pokemon.commands.push(
        new DelayedCommand(
          () => {
            if (target.hp > 0) {
              const damage = pokemon.atk
              target.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              if (pokemon.effects.has(EffectEnum.WILDFIRE)) {
                pokemon.addAttack(
                  DARK_LARIAT_ABILITY_PARAMS.wildfireAttackGain,
                  pokemon,
                  0,
                  false
                )
              } else if (pokemon.effects.has(EffectEnum.BLAZE)) {
                pokemon.addAttack(
                  DARK_LARIAT_ABILITY_PARAMS.blazeAttackGain,
                  pokemon,
                  0,
                  false
                )
              } else if (pokemon.effects.has(EffectEnum.DESOLATE_LAND)) {
                pokemon.addAttack(
                  DARK_LARIAT_ABILITY_PARAMS.desolateLandAttackGain,
                  pokemon,
                  0,
                  false
                )
              }
            }
          },
          Math.round((i * DARK_LARIAT_ABILITY_PARAMS.animationWindowMs) / hits)
        )
      )
    }
    const dx = target.positionX - pokemon.positionX
    const dy = target.positionY - pokemon.positionY
    const freeCellBehind = board.getClosestAvailablePlace(
      target.positionX + dx,
      target.positionY + dy
    )
    pokemon.broadcastAbility({
      targetX: freeCellBehind?.x ?? pokemon.positionX,
      targetY: freeCellBehind?.y ?? pokemon.positionY
    })

    if (freeCellBehind) {
      pokemon.moveTo(freeCellBehind.x, freeCellBehind.y, board, false)
      pokemon.resetCooldown(DARK_LARIAT_ABILITY_PARAMS.cooldownResetMs)
    }
  }
}

export class BoltBeakStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          target.handleSpecialDamage(
            target.pp > BOLT_BEAK_ABILITY_PARAMS.ppThreshold
              ? BOLT_BEAK_ABILITY_PARAMS.highDamage
              : BOLT_BEAK_ABILITY_PARAMS.lowDamage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }, 250)
    )
  }
}

export class FreezeDryStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          const damage =
            FREEZE_DRY_ABILITY_PARAMS.baseDamage * (1 + pokemon.ap / 100) +
            pokemon.speDef
          const killDamage =
            FREEZE_DRY_ABILITY_PARAMS.killSplashDamage *
              (1 + pokemon.ap / 100) +
            pokemon.speDef * 0.5
          const x = target.positionX
          const y = target.positionY
          const attackResult = target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit,
            false // ap boost already computed
          )
          if (attackResult.death) {
            const cells = board.getAdjacentCells(x, y, false)
            cells.forEach((cell) => {
              if (cell.value && cell.value.team !== pokemon.team) {
                pokemon.broadcastAbility({
                  positionX: x,
                  positionY: y,
                  targetX: cell.x,
                  targetY: cell.y
                })
                cell.value.handleSpecialDamage(
                  killDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit,
                  false // ap boost already computed
                )
              }
            })
          }
        }
      }, FREEZE_DRY_ABILITY_PARAMS.attackDelayMs)
    )
  }
}

export class DragonPulseStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = DRAGON_PULSE_ABILITY_PARAMS.damage

    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target && target.hp > 0) {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          board
            .getAdjacentCells(target.positionX, target.positionY, false)
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .forEach((cell) => {
              if (cell.value) {
                pokemon.broadcastAbility({
                  positionX: target.positionX,
                  positionY: target.positionY,
                  targetX: cell.x,
                  targetY: cell.y
                })
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
                pokemon.commands.push(
                  new DelayedCommand(() => {
                    if (pokemon && cell.value) {
                      board
                        .getAdjacentCells(
                          cell.value.positionX,
                          cell.value.positionY,
                          false
                        )
                        .filter((c) => c.value && c.value.team !== pokemon.team)
                        .forEach((c) => {
                          pokemon.broadcastAbility({
                            positionX: cell.x,
                            positionY: cell.y,
                            targetX: c.x,
                            targetY: c.y
                          })
                          c.value?.handleSpecialDamage(
                            damage,
                            board,
                            AttackType.SPECIAL,
                            pokemon,
                            crit
                          )
                        })
                    }
                  }, DRAGON_PULSE_ABILITY_PARAMS.chainDelayMs)
                )
              }
            })
        }
      }, DRAGON_PULSE_ABILITY_PARAMS.chainDelayMs)
    )
  }
}

export class FrostBreathStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      FROST_BREATH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FROST_BREATH_ABILITY_PARAMS.damageByStar.at(-1)!

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const orientations = [
      pokemon.orientation,
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 1) % 8],
      OrientationArray[(OrientationArray.indexOf(pokemon.orientation) + 7) % 8]
    ]

    const cellsHit = [[pokemon.positionX + dx, pokemon.positionY + dy]]
    for (const o of orientations) {
      cellsHit.push([
        pokemon.positionX + dx + OrientationVector[o][0],
        pokemon.positionY + dy + +OrientationVector[o][1]
      ])
    }

    cellsHit.forEach((cell) => {
      const value = board.getEntityOnCell(cell[0], cell[1])
      if (value && value.team !== pokemon.team) {
        value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(FROST_BREATH_ABILITY_PARAMS.freezeChance, pokemon)) {
          value.status.triggerFreeze(
            FROST_BREATH_ABILITY_PARAMS.freezeDurationMs,
            value,
            pokemon
          )
        }
      }
    })
  }
}

export class DrillRunStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DRILL_RUN_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DRILL_RUN_ABILITY_PARAMS.damageByStar.at(-1)!

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const nextX = target.positionX + dx
    const nextY = target.positionY + dy

    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    pokemon.moveTo(target.positionX, target.positionY, board, false)

    if (board.isOnBoard(nextX, nextY)) {
      const nextEntity = board.getEntityOnCell(nextX, nextY)
      if (nextEntity?.team === target.team) {
        pokemon.targetX = nextX
        pokemon.targetY = nextY
        pokemon.targetEntityId = nextEntity.id
        pokemon.pp = pokemon.maxPP
      }
    }
  }
}

export class DrillPeckStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      DRILL_PECK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DRILL_PECK_ABILITY_PARAMS.damageByStar.at(-1)!

    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const [dx, dy] = OrientationVector[pokemon.orientation]

    const nextX = target.positionX + dx
    const nextY = target.positionY + dy

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.moveTo(target.positionX, target.positionY, board, false)

    if (board.isOnBoard(nextX, nextY)) {
      const nextEntity = board.getEntityOnCell(nextX, nextY)
      if (nextEntity?.team === target.team) {
        pokemon.targetX = nextX
        pokemon.targetY = nextY
        pokemon.targetEntityId = nextEntity.id
        pokemon.pp = pokemon.maxPP
      }
    }
  }
}

export class SaltCureStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Adjacent allies gain [10,20,40,SP] SHIELD and their status afflictions cured. Adjacent WATER, STEEL or GHOST enemies suffer from BURN for 5 seconds.
    const shield =
      SALT_CURE_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      SALT_CURE_ABILITY_PARAMS.shieldByStar.at(-1)!
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      SALT_CURE_ABILITY_PARAMS.radius,
      false
    )
    cells.forEach((cell) => {
      if (cell.value) {
        if (cell.value.team === pokemon.team) {
          cell.value.addShield(shield, pokemon, 1, crit)
          cell.value.status.clearNegativeStatus(cell.value, pokemon)
        } else {
          if (
            cell.value.types.has(Synergy.WATER) ||
            cell.value.types.has(Synergy.STEEL) ||
            cell.value.types.has(Synergy.GHOST)
          ) {
            cell.value.status.triggerBurn(
              SALT_CURE_ABILITY_PARAMS.burnDurationMs,
              cell.value,
              pokemon
            )
          }
        }
      }
    })
  }
}

export class SpicyExtractStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    //Make 1/2/3 closest allies RAGE for [2,SP] seconds
    const nbAllies =
      SPICY_EXTRACT_ABILITY_PARAMS.targetCountByStar[pokemon.stars - 1] ??
      SPICY_EXTRACT_ABILITY_PARAMS.targetCountByStar.at(-1)!
    const rageDuration =
      SPICY_EXTRACT_ABILITY_PARAMS.baseRageDurationMs *
      (1 + pokemon.ap / 100) *
      (crit ? 1 + (pokemon.critPower - 1) : 1)
    const allies = board.cells
      .filter<PokemonEntity>(
        (cell): cell is PokemonEntity =>
          cell !== undefined &&
          cell !== pokemon &&
          cell.team === pokemon.team &&
          cell.hp > 0
      )
      .sort(
        (a, b) =>
          distanceE(
            a.positionX,
            a.positionY,
            pokemon.positionX,
            pokemon.positionY
          ) -
          distanceE(
            b.positionX,
            b.positionY,
            pokemon.positionX,
            pokemon.positionY
          )
      )
      .slice(0, nbAllies)
    allies.forEach((ally) => {
      ally.status.triggerRage(rageDuration, ally)
    })
  }
}

export class SweetScentStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Enemies in a 3-range radius can no longer dodge attacks, lose [3,SP] SPE_DEF and have [30,LK]% chance to be CHARM for 1 second
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      SWEET_SCENT_ABILITY_PARAMS.radius,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        if (chance(SWEET_SCENT_ABILITY_PARAMS.charmChance, pokemon)) {
          cell.value.status.triggerCharm(
            SWEET_SCENT_ABILITY_PARAMS.charmDurationMs,
            cell.value,
            pokemon,
            false
          )
        }
        cell.value.addSpecialDefense(
          -SWEET_SCENT_ABILITY_PARAMS.specialDefenseReduction,
          pokemon,
          1,
          crit
        )
        cell.value.addSpeed(
          -SWEET_SCENT_ABILITY_PARAMS.speedReduction,
          pokemon,
          1,
          crit
        )
        cell.value.addDodgeChance(-cell.value.dodge, pokemon, 0, false)
      }
    })
  }
}

export class SwallowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Store power and boosts its DEF and SPE_DEF by 1 up to 3 times.
    // If below 25% HP, swallow instead, restoring [20,SP]% of max HP per stack.
    // If over 3 stacks, spit up, dealing [40,80,150,SP] SPECIAL to the 3 cells in front
    if (
      pokemon.hp <
        pokemon.maxHP * SWALLOW_ABILITY_PARAMS.hpThresholdForSwallow &&
      pokemon.count.ult > 0
    ) {
      const heal =
        ((SWALLOW_ABILITY_PARAMS.healPercentPerStack[pokemon.count.ult] ??
          SWALLOW_ABILITY_PARAMS.healPercentPerStack.at(-1)!) *
          pokemon.maxHP) /
        100
      pokemon.handleHeal(heal, pokemon, 1, crit)
      pokemon.count.ult = 0
      pokemon.broadcastAbility({ skill: Ability.RECOVER })
    } else if (
      pokemon.count.ult >= SWALLOW_ABILITY_PARAMS.maxStacksBeforeSpiUp
    ) {
      const damage =
        SWALLOW_ABILITY_PARAMS.spitUpDamageByStar[pokemon.stars - 1] ??
        SWALLOW_ABILITY_PARAMS.spitUpDamageByStar.at(-1)!
      const cells = board.getCellsInFront(pokemon, target, 1)
      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
      pokemon.broadcastAbility({ skill: Ability.SWALLOW })
      pokemon.count.ult = 0
    } else {
      pokemon.addDefense(
        SWALLOW_ABILITY_PARAMS.defenseBuffPerStack,
        pokemon,
        0,
        false
      )
      pokemon.addSpecialDefense(
        SWALLOW_ABILITY_PARAMS.specialDefenseBuffPerStack,
        pokemon,
        0,
        false
      )
    }
  }
}

export class StockpileStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (
      pokemon.count.ult %
        (STOCKPILE_ABILITY_PARAMS.maxStacksBeforeSpitUp + 1) ===
      0
    ) {
      // If over 3 stacks, spit up, propelling the user to the backline and dealing 50% of max HP as SPECIAL to the target
      const damage = Math.ceil(
        STOCKPILE_ABILITY_PARAMS.spitUpDamageRatio * pokemon.maxHP
      )
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      // move to backline
      const corner = board.getTeleportationCell(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )
      if (corner) {
        pokemon.broadcastAbility({
          skill: Ability.STOCKPILE,
          targetX: corner.x,
          targetY: corner.y
        })
        pokemon.moveTo(corner.x, corner.y, board, false)
      }
      // retrieve base stats
      pokemon.maxHP = pokemon.baseHP
      pokemon.hp = Math.min(pokemon.hp, pokemon.maxHP)
      pokemon.addSpeed(
        STOCKPILE_ABILITY_PARAMS.speedRestoreAfterSpitUp,
        pokemon,
        0,
        false
      )
    } else {
      pokemon.addMaxHP(
        STOCKPILE_ABILITY_PARAMS.maxHpGainPerCast,
        pokemon,
        1,
        crit
      )
      pokemon.addSpeed(
        -STOCKPILE_ABILITY_PARAMS.speedLossPerCast,
        pokemon,
        0,
        false
      )
    }
  }
}

export class DecorateStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const atkBoost =
      DECORATE_ABILITY_PARAMS.attackBoostByStar[pokemon.stars - 1] ??
      DECORATE_ABILITY_PARAMS.attackBoostByStar.at(-1)!
    const apBoost =
      DECORATE_ABILITY_PARAMS.abilityPowerBoostByStar[pokemon.stars - 1] ??
      DECORATE_ABILITY_PARAMS.abilityPowerBoostByStar.at(-1)!
    const nearestAllies = pokemon.state.getNearestAllies(pokemon, board)
    const strongestNearestAlly = getStrongestUnit(nearestAllies)
    if (strongestNearestAlly) {
      pokemon.broadcastAbility({
        targetX: strongestNearestAlly.positionX,
        targetY: strongestNearestAlly.positionY
      })
      strongestNearestAlly.addAttack(atkBoost, pokemon, 1, crit)
      strongestNearestAlly.addAbilityPower(apBoost, pokemon, 1, crit)

      if (pokemon.name === Pkm.ALCREMIE_VANILLA) {
        strongestNearestAlly.addShield(
          DECORATE_ABILITY_PARAMS.vanillaShield,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_RUBY) {
        strongestNearestAlly.addSpeed(
          DECORATE_ABILITY_PARAMS.rubySpeed,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_MATCHA) {
        strongestNearestAlly.addMaxHP(
          DECORATE_ABILITY_PARAMS.matchaHp,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_MINT) {
        strongestNearestAlly.handleHeal(
          DECORATE_ABILITY_PARAMS.mintHeal,
          pokemon,
          1,
          crit
        )
        strongestNearestAlly.addSpecialDefense(
          DECORATE_ABILITY_PARAMS.mintSpecialDefense,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_LEMON) {
        strongestNearestAlly.addCritChance(
          DECORATE_ABILITY_PARAMS.lemonCritChance,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_SALTED) {
        strongestNearestAlly.handleHeal(
          DECORATE_ABILITY_PARAMS.saltedHeal,
          pokemon,
          1,
          crit
        )
        strongestNearestAlly.addDefense(
          DECORATE_ABILITY_PARAMS.saltedDefense,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_RUBY_SWIRL) {
        strongestNearestAlly.addAttack(
          DECORATE_ABILITY_PARAMS.rubySwirlAttack,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_CARAMEL_SWIRL) {
        strongestNearestAlly.addCritPower(
          DECORATE_ABILITY_PARAMS.caramelSwirlCritPower,
          pokemon,
          1,
          crit
        )
      } else if (pokemon.name === Pkm.ALCREMIE_RAINBOW_SWIRL) {
        strongestNearestAlly.addPP(
          DECORATE_ABILITY_PARAMS.rainbowSwirlPp,
          pokemon,
          1,
          crit
        )
      }
    }
  }
}

export class DragonClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    //Deal 30/60/120 special damage to the lowest health adjacent enemy and Wound them for 4 seconds.
    super.process(pokemon, board, target, crit)
    const damage =
      DRAGON_CLAW_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      DRAGON_CLAW_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    let lowestHp = 9999
    let lowestHpTarget: PokemonEntity | undefined
    for (const cell of cells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        if (cell.value.maxHP < lowestHp) {
          lowestHp = cell.value.maxHP
          lowestHpTarget = cell.value
        }
      }
    }
    if (!lowestHpTarget) {
      lowestHpTarget = target
    }
    lowestHpTarget.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    lowestHpTarget.status.triggerWound(
      DRAGON_CLAW_ABILITY_PARAMS.woundDurationMs,
      lowestHpTarget,
      pokemon
    )
    pokemon.setTarget(lowestHpTarget)
  }
}

export class HornAttackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      HORN_ATTACK_ABILITY_PARAMS.atkMultiplierByStar[pokemon.stars - 1] ??
      HORN_ATTACK_ABILITY_PARAMS.atkMultiplierByStar.at(-1)!
    target.handleSpecialDamage(
      damage * pokemon.atk,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    target.status.triggerArmorReduction(
      HORN_ATTACK_ABILITY_PARAMS.armorReductionDurationMs,
      target
    )
  }
}

export class HornLeechStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = HORN_LEECH_ABILITY_PARAMS.atkMultiplier * pokemon.atk
    const { takenDamage } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    // heal for 50% of the damage dealt
    const heal = Math.round(takenDamage * HORN_LEECH_ABILITY_PARAMS.healRatio)
    const overheal = min(0)(heal - (pokemon.maxHP - pokemon.hp))
    pokemon.handleHeal(heal, pokemon, 0, false)
    if (overheal > 0) {
      pokemon.addShield(
        Math.round(overheal * HORN_LEECH_ABILITY_PARAMS.overhealShieldRatio),
        pokemon,
        0,
        false
      )
    }
  }
}

export class MudShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // The user hurls mud at the target, dealing 25/50/75 damage and reducing their attack speed by 10/20/30%.
    const damage: number =
      MUD_SHOT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MUD_SHOT_ABILITY_PARAMS.damageByStar.at(-1)!
    const speedDebuff: number =
      MUD_SHOT_ABILITY_PARAMS.speedDebuffByStar[pokemon.stars - 1] ??
      MUD_SHOT_ABILITY_PARAMS.speedDebuffByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.addSpeed(-speedDebuff, pokemon, 1, crit)
  }
}

export class MalignantChainStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const duration = Math.round(
      MALIGNANT_CHAIN_ABILITY_PARAMS.baseDurationMs *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    target.status.triggerPossessed(duration, target, pokemon)
    const nbStacks = MALIGNANT_CHAIN_ABILITY_PARAMS.poisonStacks
    for (let i = 0; i < nbStacks; i++) {
      target.status.triggerPoison(duration, target, pokemon)
    }
  }
}

export class FilletAwayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // lose 50% of max HP and gain 10 attack and 20 speed
    const lostMaxHP = Math.floor(
      pokemon.maxHP * FILLET_AWAY_ABILITY_PARAMS.maxHpLossRatio
    )
    pokemon.addMaxHP(-lostMaxHP, pokemon, 0, false)

    pokemon.addAttack(FILLET_AWAY_ABILITY_PARAMS.atkBoost, pokemon, 1, crit)
    pokemon.addSpeed(FILLET_AWAY_ABILITY_PARAMS.speedBoost, pokemon, 1, crit)
    pokemon.status.triggerProtect(FILLET_AWAY_ABILITY_PARAMS.protectDurationMs)
    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board, false)
    }
  }
}

export class RoostStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const shield =
      ROOST_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      ROOST_ABILITY_PARAMS.shieldByStar.at(-1)!
    pokemon.flyAway(board, false)
    pokemon.status.triggerSleep(ROOST_ABILITY_PARAMS.sleepDurationMs, pokemon)
    pokemon.addShield(shield, pokemon, 1, crit)
  }
}

export class UltraThrustersStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      ULTRA_THRUSTERS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ULTRA_THRUSTERS_ABILITY_PARAMS.damageByStar.at(-1)!
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerBurn(
            ULTRA_THRUSTERS_ABILITY_PARAMS.burnDurationMs,
            cell.value,
            pokemon
          )
        }
      })

    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )

    pokemon.broadcastAbility({
      skill: Ability.ULTRA_THRUSTERS,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: corner?.x ?? pokemon.targetX,
      targetY: corner?.y ?? pokemon.targetY,
      orientation: pokemon.orientation
    })

    if (corner) {
      pokemon.orientation = board.orientation(
        corner.x,
        corner.y,
        pokemon.positionX,
        pokemon.positionY,
        pokemon,
        target
      )
      pokemon.moveTo(corner.x, corner.y, board, false)
      pokemon.resetCooldown(ULTRA_THRUSTERS_ABILITY_PARAMS.cooldownMs)
    }
  }
}

export class ElectroBallStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    let projectileSpeedRemaining = pokemon.speed
    const delay = Math.round(
      ELECTRO_BALL_ABILITY_PARAMS.baseDelayMs *
        (ELECTRO_BALL_ABILITY_PARAMS.speedNormalization / pokemon.speed)
    )
    const targetsHit = new Set<PokemonEntity>()
    const bounce = (
      currentTarget: PokemonEntity,
      prevTarget: PokemonEntity
    ) => {
      const distance = distanceM(
        prevTarget.positionX,
        prevTarget.positionY,
        currentTarget.positionX,
        currentTarget.positionY
      )
      pokemon.broadcastAbility({
        positionX: prevTarget.positionX,
        positionY: prevTarget.positionY,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY,
        delay: delay * distance
      })

      const damage =
        ELECTRO_BALL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
        ELECTRO_BALL_ABILITY_PARAMS.damageByStar.at(-1)!
      currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      targetsHit.add(currentTarget)
      const possibleTargets = board.cells.filter<PokemonEntity>(
        (cell): cell is PokemonEntity =>
          cell !== undefined &&
          cell.team !== pokemon.team &&
          !targetsHit.has(cell)
      )
      if (possibleTargets.length === 0) return
      const distances = possibleTargets.map((cell) =>
        distanceM(
          cell.positionX,
          cell.positionY,
          currentTarget.positionX,
          currentTarget.positionY
        )
      )
      const minDistance = Math.min(...distances)
      const closestTarget = possibleTargets[distances.indexOf(minDistance)]

      if (closestTarget && projectileSpeedRemaining > 0) {
        const nextTarget = possibleTargets[0]
        projectileSpeedRemaining -= ELECTRO_BALL_ABILITY_PARAMS.speedDecrement
        pokemon.commands.push(
          new DelayedCommand(
            () => bounce(nextTarget, currentTarget),
            delay * minDistance
          )
        )
      }
    }

    bounce(target, pokemon)
  }
}

export class ElectroShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (pokemon.simulation.weather !== Weather.STORM) {
      pokemon.cooldown = ELECTRO_SHOT_ABILITY_PARAMS.chargeDelayMs
      pokemon.broadcastAbility({
        skill: "ELECTRO_SHOT_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage =
            ELECTRO_SHOT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
            ELECTRO_SHOT_ABILITY_PARAMS.damageByStar.at(-1)!
          pokemon.addAbilityPower(
            ELECTRO_SHOT_ABILITY_PARAMS.apBoost,
            pokemon,
            0,
            false
          )
          pokemon.broadcastAbility({
            skill: Ability.ELECTRO_SHOT,
            targetX: target.positionX,
            targetY: target.positionY
          })
          effectInLine(board, pokemon, target, (cell) => {
            if (cell.value != null && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
        },
        pokemon.simulation.weather === Weather.STORM
          ? 0
          : ELECTRO_SHOT_ABILITY_PARAMS.chargeDelayMs
      )
    )
  }
}

export class FlowerTrickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FLOWER_TRICK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FLOWER_TRICK_ABILITY_PARAMS.damageByStar.at(-1)!
    const startingCritCount = target.count.crit
    pokemon.commands.push(
      new DelayedCommand(() => {
        const currentCritCount = target.count.crit
        const numberOfCrits = currentCritCount - startingCritCount
        const cells = board.getAdjacentCells(
          target.positionX,
          target.positionY,
          true
        )
        for (const cell of cells) {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.broadcastAbility({
              skill: "FLOWER_TRICK_EXPLOSION",
              positionX: cell.value.positionX,
              positionY: cell.value.positionY
            })
            cell.value.handleSpecialDamage(
              damage +
                FLOWER_TRICK_ABILITY_PARAMS.critBonusDamage * numberOfCrits,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }, FLOWER_TRICK_ABILITY_PARAMS.explosionDelayMs)
    )
  }
}

export class SolarBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    if (!pokemon.status.light) {
      pokemon.cooldown = SOLAR_BLADE_ABILITY_PARAMS.chargeDelayMs
      pokemon.broadcastAbility({
        skill: "SOLAR_BLADE_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })
    }

    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage =
            SOLAR_BLADE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
            SOLAR_BLADE_ABILITY_PARAMS.damageByStar.at(-1)!
          pokemon.broadcastAbility({
            skill: Ability.SOLAR_BLADE,
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            orientation: pokemon.orientation
          })
          const cells = board.getCellsInFront(
            pokemon,
            target,
            SOLAR_BLADE_ABILITY_PARAMS.coneDepth
          )
          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.TRUE,
                pokemon,
                crit
              )
            }
          })
        },
        pokemon.status.light ? 0 : SOLAR_BLADE_ABILITY_PARAMS.chargeDelayMs
      )
    )
  }
}

export class ScaleShotStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.status.triggerArmorReduction(
      SCALE_SHOT_ABILITY_PARAMS.armorBreakDurationMs,
      pokemon
    )
    const scalePositions = new Array<{ x: number; y: number; delay: number }>()

    const adjacentCells = [
      [pokemon.positionX, pokemon.positionY - 1],
      [pokemon.positionX, pokemon.positionY + 1],
      [pokemon.positionX - 1, pokemon.positionY],
      [pokemon.positionX + 1, pokemon.positionY],
      [pokemon.positionX - 1, pokemon.positionY - 1],
      [pokemon.positionX + 1, pokemon.positionY - 1],
      [pokemon.positionX - 1, pokemon.positionY + 1],
      [pokemon.positionX + 1, pokemon.positionY + 1]
    ]

    let inc = 0
    for (const cell of adjacentCells) {
      const [x, y] = cell
      const delay = SCALE_SHOT_ABILITY_PARAMS.scaleLaunchStartDelayMs + inc
      scalePositions.push({
        x,
        y,
        delay
      })
      inc += SCALE_SHOT_ABILITY_PARAMS.launchIntervalMs
      pokemon.broadcastAbility({
        skill: "SCALE_SHOT_CHARGE",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: x,
        targetY: y,
        delay: delay
      })
      const entityOnCell = board.getEntityOnCell(x, y)
      if (entityOnCell && entityOnCell.team !== pokemon.team) {
        entityOnCell.status.triggerArmorReduction(
          SCALE_SHOT_ABILITY_PARAMS.armorBreakDurationMs,
          entityOnCell
        )
        entityOnCell.handleSpecialDamage(
          SCALE_SHOT_ABILITY_PARAMS.initialDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }

    for (const { x, y, delay } of scalePositions) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (
            pokemon.status.freeze ||
            pokemon.status.sleep ||
            pokemon.status.resurrecting
          )
            return
          const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
          if (farthestTarget) {
            pokemon.broadcastAbility({
              positionX: x,
              positionY: y,
              targetX: farthestTarget.positionX,
              targetY: farthestTarget.positionY
            })
            const cellsBetween = board.getCellsBetween(
              x,
              y,
              farthestTarget.positionX,
              farthestTarget.positionY
            )
            for (const cell of cellsBetween) {
              if (cell.value && cell.value.team !== pokemon.team) {
                cell.value.handleSpecialDamage(
                  cell.value.id === farthestTarget.id
                    ? SCALE_SHOT_ABILITY_PARAMS.mainShotDamage
                    : SCALE_SHOT_ABILITY_PARAMS.pathDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
              }
            }
          }
        }, delay)
      )
    }
  }
}

export class BitterBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = BITTER_BLADE_ABILITY_PARAMS.damage
    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )
    let nbEnemiesHit = 0
    for (const cell of adjacentCells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        nbEnemiesHit++
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
    pokemon.handleHeal(
      pokemon.maxHP *
        BITTER_BLADE_ABILITY_PARAMS.healRatioPerEnemy *
        nbEnemiesHit,
      pokemon,
      0,
      false
    )
  }
}

export class ArmorCannonStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const mainDamage = ARMOR_CANNON_ABILITY_PARAMS.mainDamage
    const secondaryDamage = ARMOR_CANNON_ABILITY_PARAMS.secondaryDamage
    const finalDamage = ARMOR_CANNON_ABILITY_PARAMS.finalDamage
    const numberOfTargets = ARMOR_CANNON_ABILITY_PARAMS.bounceTargets

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          mainDamage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        const possibleTargets = new Array<PokemonEntity>()
        board.forEach((x, y, entity) => {
          if (entity && entity.team !== pokemon.team && entity !== target) {
            possibleTargets.push(entity)
          }
        })
        possibleTargets.sort(
          (a, b) =>
            distanceM(
              a.positionX,
              a.positionY,
              pokemon.positionX,
              pokemon.positionY
            ) -
            distanceM(
              b.positionX,
              b.positionY,
              pokemon.positionX,
              pokemon.positionY
            )
        )
        const targets = possibleTargets.slice(0, numberOfTargets)
        targets.forEach((tg) => {
          pokemon.broadcastAbility({
            positionX: target.positionX,
            positionY: target.positionY,
            targetX: tg.positionX,
            targetY: tg.positionY,
            delay: 1
          })
          pokemon.commands.push(
            new DelayedCommand(() => {
              tg.handleSpecialDamage(
                secondaryDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              pokemon.broadcastAbility({
                positionX: tg.positionX,
                positionY: tg.positionY,
                targetX: target.positionX,
                targetY: target.positionY,
                delay: 2
              })
              pokemon.commands.push(
                new DelayedCommand(() => {
                  target.handleSpecialDamage(
                    finalDamage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }, 300)
              )
            }, 300)
          )
        })
      }, 300)
    )
  }
}

export class SuctionHealStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      SUCTION_HEAL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SUCTION_HEAL_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getCellsInFront(
      pokemon,
      target,
      SUCTION_HEAL_ABILITY_PARAMS.coneDepth
    )

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        const attack = cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: cell.value.positionX,
          targetY: cell.value.positionY
        })
        pokemon.handleHeal(
          attack.takenDamage * SUCTION_HEAL_ABILITY_PARAMS.healTakenDamageRatio,
          pokemon,
          0,
          false
        )
      }
    })
  }
}

export class BehemothBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = BEHEMOTH_BLADE_ABILITY_PARAMS.atkBonus + pokemon.atk
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      undefined
    )

    const destination = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      orientation
    )

    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board, false)
    }
  }
}

export class HeatCrashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Crashes into the target, knocking it back and dealing [40,60,80,SP] SPECIAL. Does more damage the more ATK the user has compared to the target.
    let damage: number =
      HEAT_CRASH_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HEAT_CRASH_ABILITY_PARAMS.damageByStar.at(-1)!
    const attackDifference = pokemon.atk - target.atk
    damage += attackDifference * HEAT_CRASH_ABILITY_PARAMS.attackDiffMultiplier
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    const knockbackCell = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      pokemon.orientation
    )
    if (knockbackCell) {
      target.moveTo(knockbackCell.x, knockbackCell.y, board, true)
      target.cooldown = HEAT_CRASH_ABILITY_PARAMS.knockbackCooldownMs
    }
  }
}

export class LaserBladeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (pokemon.count.ult % 2 === 1) {
      // Spins laser blade around, moving behind their target, gaining [30,SP] SHIELD and dealing [30,SP] SPECIAL to target and adjacent enemies on the path.
      const damage = LASER_BLADE_ABILITY_PARAMS.alternateSpinDamage
      const shield = LASER_BLADE_ABILITY_PARAMS.alternateSpinShield
      const enemiesHit = new Set<PokemonEntity>()
      board
        .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
        .concat(
          board.getAdjacentCells(target.positionX, target.positionY, false)
        )
        .map((cell) => cell.value)
        .filter(
          (entity): entity is PokemonEntity =>
            entity != null && entity.team !== pokemon.team
        )
        .forEach((enemy) => enemiesHit.add(enemy))
      pokemon.moveTo(target.positionX, target.positionY, board, true)
      pokemon.addShield(shield, pokemon, 1, crit)
      enemiesHit.forEach((enemy) => {
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      })
    } else {
      // Spins laser blade in front of them, dealing 2 times [30,SP] + ATK as SPECIAL
      const damage =
        LASER_BLADE_ABILITY_PARAMS.frontSpinBaseDamage + pokemon.atk
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, LASER_BLADE_ABILITY_PARAMS.frontSpinSecondHitDelayMs)
      )
    }
  }
}

export class ArmThrustStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deal 2 to 5 hits (luck based increasing with AP) each dealing 100% of the user's ATK as physical damage. Each hit has the same individual crit chance.
    const damage = pokemon.atk
    const nbHits = clamp(
      Math.floor(
        ARM_THRUST_ABILITY_PARAMS.minHits +
          Math.random() *
            (ARM_THRUST_ABILITY_PARAMS.maxHits -
              ARM_THRUST_ABILITY_PARAMS.minHits +
              1) *
            (1 + pokemon.luck / 100)
      ),
      ARM_THRUST_ABILITY_PARAMS.minHits,
      ARM_THRUST_ABILITY_PARAMS.maxHits
    )
    pokemon.broadcastAbility({
      skill: Ability.ARM_THRUST,
      delay: nbHits
    })
    for (let i = 0; i < nbHits; i++) {
      target.handleSpecialDamage(
        damage,
        board,
        AttackType.PHYSICAL,
        pokemon,
        chance(pokemon.critChance / 100, pokemon)
      )
    }
  }
}

export class DrumBeatingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    switch (pokemon.count.ult % 3) {
      case 0: {
        // give 10/20/40 speed to the entire team
        const speed =
          DRUM_BEATING_ABILITY_PARAMS.buffByStar[pokemon.stars - 1] ??
          DRUM_BEATING_ABILITY_PARAMS.buffByStar.at(-1)!
        board.forEach((x, y, entity) => {
          if (entity && entity.team === pokemon.team) {
            entity.addSpeed(speed, pokemon, 1, crit)
          }
        })
        break
      }
      case 1: {
        // give 10/20/40 shield to the entire team
        const shield =
          DRUM_BEATING_ABILITY_PARAMS.buffByStar[pokemon.stars - 1] ??
          DRUM_BEATING_ABILITY_PARAMS.buffByStar.at(-1)!
        board.forEach((x, y, entity) => {
          if (entity && entity.team === pokemon.team) {
            entity.addShield(shield, pokemon, 1, crit)
          }
        })
        break
      }
      case 2:
      default: {
        // deal 10/20/40 special damage to the opponent team
        const damage =
          DRUM_BEATING_ABILITY_PARAMS.buffByStar[pokemon.stars - 1] ??
          DRUM_BEATING_ABILITY_PARAMS.buffByStar.at(-1)!
        board.forEach((x, y, entity) => {
          if (entity && entity.team !== pokemon.team) {
            entity.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        break
      }
    }
  }
}

export class SurgingStrikesStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // strikes the target with a flowing motion three times in a row, dealing [100,SP]% of ATK each as SPECIAL. Always deal critical hits.
    super.process(pokemon, board, target, true)
    const damage =
      pokemon.atk * SURGING_STRIKES_ABILITY_PARAMS.damagePercentOfAtk
    const nbHits = SURGING_STRIKES_ABILITY_PARAMS.hitCount
    for (let i = 0; i < nbHits; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            true
          )
        }, i * SURGING_STRIKES_ABILITY_PARAMS.delayBetweenHitsMs)
      )
    }
    pokemon.cooldown +=
      SURGING_STRIKES_ABILITY_PARAMS.delayBetweenHitsMs * nbHits
  }
}

export class WickedBlowStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Deal 80AP true damage to the target. Always deal a critical hit.
    super.process(pokemon, board, target, true)
    const damage = WICKED_BLOW_ABILITY_PARAMS.damage
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, true)
  }
}

export class VictoryDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, true)
    // gain 3 Attack, 3 Defense and 10 Speed.
    pokemon.addAttack(VICTORY_DANCE_ABILITY_PARAMS.atkBuff, pokemon, 1, crit)
    pokemon.addDefense(VICTORY_DANCE_ABILITY_PARAMS.defBuff, pokemon, 1, crit)
    pokemon.addSpeed(VICTORY_DANCE_ABILITY_PARAMS.speedBuff, pokemon, 1, crit)
  }
}

export class BoomBurstStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Deal 60 special damage to all adjacent units including allies
    super.process(pokemon, board, target, crit)
    const damage = BOOMBURST_ABILITY_PARAMS.damage
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .forEach((cell) => {
        if (cell.value) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          cell.value.status.triggerFlinch(
            BOOMBURST_ABILITY_PARAMS.flinchDurationMs,
            cell.value,
            pokemon
          )
        }
      })
  }
}

export class FollowMeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Jump to a free cell far away and gain [40,SP] SHIELD. Enemies that were targeting the user are CHARM for 3 seconds.
    const cellToJump = board.getSafePlaceAwayFrom(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (cellToJump) {
      const enemiesTargetingPokemon = board.cells.filter<PokemonEntity>(
        (entity): entity is PokemonEntity =>
          entity != null &&
          entity.targetEntityId === pokemon.id &&
          entity.team !== pokemon.team
      )
      enemiesTargetingPokemon.forEach((enemy) => {
        enemy.status.triggerCharm(
          FOLLOW_ME_ABILITY_PARAMS.charmDurationMs,
          enemy,
          pokemon,
          false
        )
      })
      pokemon.moveTo(cellToJump.x, cellToJump.y, board, false)
      pokemon.addShield(FOLLOW_ME_ABILITY_PARAMS.shield, pokemon, 1, crit)
    }
  }
}

export class AfterYouStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Gives [15,SP] PP and [10,SP] SPEED buff to the strongest closest ally.
    const nearestAllies = pokemon.state.getNearestAllies(pokemon, board)
    const strongestNearestAlly = getStrongestUnit(nearestAllies)
    if (strongestNearestAlly) {
      strongestNearestAlly.addPP(
        AFTER_YOU_ABILITY_PARAMS.ppGain,
        pokemon,
        1,
        crit
      )
      strongestNearestAlly.addSpeed(
        AFTER_YOU_ABILITY_PARAMS.speedBuff,
        pokemon,
        1,
        crit
      )
    }
  }
}

export class TwinBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Fires out two beams that hit the furthest enemies, dealing 30/60 special damage to all enemies in a line.
    const damage =
      TWIN_BEAM_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TWIN_BEAM_ABILITY_PARAMS.damageByStar.at(-1)!
    const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
    if (farthestTarget) {
      effectInLine(board, pokemon, farthestTarget, (cell) => {
        if (cell.value != null && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
      pokemon.broadcastAbility({
        skill: Ability.TWIN_BEAM,
        targetX: farthestTarget.positionX,
        targetY: farthestTarget.positionY
      })

      const oppositeFarthestTarget = pokemon.state.getFarthestTarget(
        farthestTarget,
        board,
        pokemon
      )
      if (oppositeFarthestTarget) {
        effectInLine(board, pokemon, oppositeFarthestTarget, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        pokemon.broadcastAbility({
          skill: Ability.TWIN_BEAM,
          targetX: oppositeFarthestTarget.positionX,
          targetY: oppositeFarthestTarget.positionY
        })
      }
    }
  }
}

export class SwaggerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Confuses and enrage the target for 2 seconds
    const duration = Math.round(
      SWAGGER_ABILITY_PARAMS.baseDurationMs *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    target.status.triggerConfusion(duration, target, pokemon)
    target.status.triggerRage(duration, target)
  }
}

export class EncoreStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const abilitiesCast =
      pokemon.team === Team.BLUE_TEAM
        ? pokemon.simulation.blueAbilitiesCast
        : pokemon.simulation.redAbilitiesCast
    const lastAbilityUsed = abilitiesCast?.findLast(
      (ability) =>
        ability !== Ability.ENCORE && AbilityStrategies[ability]?.copyable
    )
    if (lastAbilityUsed) {
      AbilityStrategies[lastAbilityUsed].process(pokemon, board, target, crit)
    }
  }
}

export class ChainCrazedStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Self inflict poison and gain speed, attack and defense
    pokemon.status.triggerPoison(
      CHAIN_CRAZED_ABILITY_PARAMS.poisonDurationMs,
      pokemon,
      pokemon
    )
    pokemon.addSpeed(CHAIN_CRAZED_ABILITY_PARAMS.speedBoost, pokemon, 0, false)
    pokemon.addAttack(CHAIN_CRAZED_ABILITY_PARAMS.atkBoost, pokemon, 1, crit)
    pokemon.addDefense(CHAIN_CRAZED_ABILITY_PARAMS.defBoost, pokemon, 1, crit)
  }
}

export class MindBendStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Target is Possessed for 2 seconds. If Rune Protect or already possessed, takes 100 special damage instead.
    if (target.status.runeProtect || target.status.possessed) {
      target.handleSpecialDamage(
        MIND_BEND_ABILITY_PARAMS.fallbackDamage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    } else {
      const duration = Math.round(
        MIND_BEND_ABILITY_PARAMS.baseDurationMs *
          (1 + pokemon.ap / 100) *
          (crit ? pokemon.critPower : 1)
      )
      target.status.triggerPossessed(duration, target, pokemon)
    }
  }
}

export class SteamrollerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const speedDamageMultiplier =
      STEAMROLLER_ABILITY_PARAMS.speedDamageMultiplierByStar[
        pokemon.stars - 1
      ] ?? STEAMROLLER_ABILITY_PARAMS.speedDamageMultiplierByStar.at(-1)!
    const damage = Math.round(speedDamageMultiplier * pokemon.speed)

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)
    const targetsHit = new Set<PokemonEntity>()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit
    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      if (chance(STEAMROLLER_ABILITY_PARAMS.flinchChance, pokemon)) {
        enemy.status.triggerFlinch(
          STEAMROLLER_ABILITY_PARAMS.flinchDurationMs,
          enemy,
          pokemon
        )
      }
    })
  }
}
export class MagnetPullStrategy extends AbilityStrategy {
  copyable = false
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    if (!MAGNET_PULL_ABILITY_PARAMS) return
    if (pokemon.player) {
      const randomSteelPkm = pokemon.simulation.room.state.shop.magnetPull(
        pokemon,
        pokemon.player
      )
      pokemon.player.spawnWanderingPokemon({
        pkm: randomSteelPkm,
        behavior: WandererBehavior.SPECTATE,
        type: WandererType.CATCHABLE
      })
    }
  }
}

export class SpinOutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const speedMultiplier =
      SPIN_OUT_ABILITY_PARAMS.speedMultiplierByStar[pokemon.stars - 1] ??
      SPIN_OUT_ABILITY_PARAMS.speedMultiplierByStar.at(-1)!
    const damage = Math.round(speedMultiplier * pokemon.speed)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerBlinded(
      SPIN_OUT_ABILITY_PARAMS.blindDurationMs,
      target
    )

    // move back to your own backline
    // move to backline
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.moveTo(corner.x, corner.y, board, false)
        }, SPIN_OUT_ABILITY_PARAMS.teleportDelayMs)
      )
    }

    const accelerationEffect = [...pokemon.effectsSet.values()].find(
      (effect) => effect instanceof AccelerationEffect
    )
    if (accelerationEffect) {
      pokemon.addSpeed(
        -accelerationEffect.accelerationStacks *
          SPIN_OUT_ABILITY_PARAMS.speedLossPerAccelerationStack,
        pokemon,
        0,
        false
      )
      accelerationEffect.accelerationStacks = 0
    }
  }
}

export class RockArtilleryStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const numberOfRocks =
      ROCK_ARTILLERY_ABILITY_PARAMS.rockCountByStar[pokemon.stars - 1] ??
      ROCK_ARTILLERY_ABILITY_PARAMS.rockCountByStar.at(-1)!
    const damage =
      ROCK_ARTILLERY_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ROCK_ARTILLERY_ABILITY_PARAMS.damageByStar.at(-1)!

    const enemies = board.cells.filter(
      (cell) => cell && cell.team !== pokemon.team
    ) as PokemonEntity[]

    for (let i = 0; i < numberOfRocks; i++) {
      const randomEnemy = pickRandomIn(enemies)
      if (randomEnemy) {
        const adjacentCells = board.getAdjacentCells(
          randomEnemy.positionX,
          randomEnemy.positionY,
          true
        )
        const targetCell = pickRandomIn(adjacentCells)

        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.broadcastAbility({
              targetX: targetCell.x,
              targetY: targetCell.y
            })
            if (targetCell.value && targetCell.value.team !== pokemon.team) {
              targetCell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          }, i * ROCK_ARTILLERY_ABILITY_PARAMS.impactDelayMs)
        )
      }
    }
  }
}

export class ZingZapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = ZING_ZAP_ABILITY_PARAMS.damage
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(
      ZING_ZAP_ABILITY_PARAMS.flinchDurationMs,
      target,
      pokemon
    )

    if (target.status.paralysis) {
      pokemon.addShield(
        ZING_ZAP_ABILITY_PARAMS.shieldIfParalyzed,
        pokemon,
        1,
        crit
      )
    }

    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      undefined
    )

    const destination = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      orientation
    )

    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board, false)
    }
  }
}

export class TackleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      TACKLE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TACKLE_ABILITY_PARAMS.damageByStar[2]
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class NoRetreatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbFalinks =
      [...pokemon.effectsSet.values()].find(
        (e) => e instanceof FalinksFormationEffect
      )?.stacks ?? 0
    if (nbFalinks > 0) {
      //Gain 1 ATK, 1 DEF, 1 SPE_DEF and 5 SPEED per Falinks on your team. Troopers tackle target for [20,SP] SPECIAL each.
      pokemon.addAttack(
        nbFalinks * NO_RETREAT_ABILITY_PARAMS.statBuffPerFalinks,
        pokemon,
        0,
        false
      )
      pokemon.addDefense(
        nbFalinks * NO_RETREAT_ABILITY_PARAMS.statBuffPerFalinks,
        pokemon,
        0,
        false
      )
      pokemon.addSpecialDefense(
        nbFalinks * NO_RETREAT_ABILITY_PARAMS.statBuffPerFalinks,
        pokemon,
        0,
        false
      )
      pokemon.addSpeed(
        nbFalinks * NO_RETREAT_ABILITY_PARAMS.speedBuffPerFalinks,
        pokemon,
        0,
        false
      )

      for (let i = 0; i < nbFalinks; i++) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            target.handleSpecialDamage(
              NO_RETREAT_ABILITY_PARAMS.troopDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }, i * NO_RETREAT_ABILITY_PARAMS.troopHitDelayMs)
        )
      }
    }
  }
}

export class StaticShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = STATIC_SHOCK_ABILITY_PARAMS.damage

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    const adjacentCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY
    )
    const fairyCount = adjacentCells.filter(
      (cell) => cell.value && cell.value.types.has(Synergy.FAIRY)
    ).length

    if (fairyCount > 0) {
      pokemon.handleHeal(
        STATIC_SHOCK_ABILITY_PARAMS.healPerAdjacentFairy * fairyCount,
        pokemon,
        1,
        crit
      )
    }

    const electricCount = adjacentCells.filter(
      (cell) => cell.value && cell.value.types.has(Synergy.ELECTRIC)
    ).length

    if (electricCount > 0) {
      pokemon.addShield(
        STATIC_SHOCK_ABILITY_PARAMS.shieldPerAdjacentElectric * electricCount,
        pokemon,
        1,
        crit
      )
    }
  }
}

export class SandSpitStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      SAND_SPIT_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SAND_SPIT_ABILITY_PARAMS.damageByStar.at(-1)!
    const cellsHit = board.getCellsInFront(
      pokemon,
      target,
      SAND_SPIT_ABILITY_PARAMS.coneDepth
    )

    for (const cell of cellsHit) {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        cell.value.status.triggerBlinded(
          SAND_SPIT_ABILITY_PARAMS.blindDurationMs,
          cell.value
        )
      }
    }
  }
}

export class HyperDrillStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage: number =
      HYPER_DRILL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HYPER_DRILL_ABILITY_PARAMS.damageByStar.at(-1)!
    const boardPlayer = target.simulation.bluePlayer
    let doubleDamage = false
    if (boardPlayer) {
      const index = target.positionY * BOARD_WIDTH + target.positionX
      if (boardPlayer.groundHoles[index] === 5) {
        doubleDamage = true
      } else {
        boardPlayer.groundHoles[index] =
          (boardPlayer.groundHoles[index] ?? 0) + 1
      }
      pokemon.broadcastAbility({
        targetX: target.positionX,
        targetY: target.positionY,
        delay: boardPlayer.groundHoles[index] // delay will hold the ground hole depth info
      })
    }

    if (target.status.protect) {
      target.status.protect = false
      target.status.protectCooldown = 0
    }
    target.handleSpecialDamage(
      damage *
        (doubleDamage ? HYPER_DRILL_ABILITY_PARAMS.doubleDamageMultiplier : 1),
      board,
      AttackType.TRUE,
      pokemon,
      crit
    )
  }
}

export class EarDigStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deal [30,60,120,SP] SPECIAL + [5,10,20,SP] per depth level of the hole the target is in. If the target is not in a hole, also dig a hole under them.
    const boardPlayer = target.simulation.bluePlayer
    const index = target.positionY * BOARD_WIDTH + target.positionX
    let holeLevel = boardPlayer?.groundHoles[index] ?? 0
    const damage =
      (EAR_DIG_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
        EAR_DIG_ABILITY_PARAMS.damageByStar.at(-1)!) +
      holeLevel *
        (EAR_DIG_ABILITY_PARAMS.perHoleLevelDamageByStar[pokemon.stars - 1] ??
          EAR_DIG_ABILITY_PARAMS.perHoleLevelDamageByStar.at(-1)!)
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (boardPlayer && holeLevel === 0) {
      boardPlayer.groundHoles[index] = 1
      holeLevel = 1
    }
    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      delay: holeLevel // delay will hold the ground hole depth info
    })
  }
}

export class TerrainPulseStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const fieldEffects: (keyof IStatus)[] = [
      "fairyField",
      "electricField",
      "grassField",
      "psychicField"
    ] as const
    type FieldEffect = (typeof fieldEffects)[number]
    const getFieldEffect = (pkm: PokemonEntity): FieldEffect | null =>
      fieldEffects.find((field) => pkm.status[field] === true) ?? null

    const userField = getFieldEffect(pokemon)
    if (userField === null) pokemon.status.grassField = true

    const adjacentFieldsByPkm: Map<PokemonEntity, Set<FieldEffect>> = new Map()
    const pokemonsWithField: Map<PokemonEntity, FieldEffect> = new Map()

    // 1. collect adjacent fields
    board.forEach((x, y, entity) => {
      if (!entity) return
      const activeField = getFieldEffect(entity)
      if (activeField) {
        pokemonsWithField.set(entity, activeField)
        const adjacentAlliesWithoutField = board
          .getAdjacentCells(x, y)
          .map((cell) => cell.value)
          .filter(
            (e): e is PokemonEntity =>
              e != null && e.team === entity.team && getFieldEffect(e) === null
          )
        for (const ally of adjacentAlliesWithoutField) {
          const adjacentFields =
            adjacentFieldsByPkm.get(ally) ?? new Set<FieldEffect>()
          adjacentFields.add(activeField)
          adjacentFieldsByPkm.set(ally, adjacentFields)
        }
      }
    })

    // 2. propagate fields
    adjacentFieldsByPkm.forEach((fields, pkm) => {
      const field = pickRandomIn([...fields])
      switch (field) {
        case "fairyField":
          pkm.status.addFairyField(pkm)
          break
        case "electricField":
          pkm.status.addElectricField(pkm)
          break
        case "grassField":
          pkm.status.addGrassField(pkm)
          break
        case "psychicField":
          pkm.status.addPsychicField(pkm)
          break
      }
      pokemonsWithField.set(pkm, getFieldEffect(pkm)!)
    })

    // 3. trigger additional field effects
    /*
    Grass field: heal 5/7/10% of max HP
    Electric Field: gain 10/12/15 Speed
    Psychic Field: gain 10/12/15 PP
    Fairy Field: gain 5/7/10% of max HP as Shield
    */
    pokemonsWithField.forEach((field, pkm) => {
      switch (field) {
        case "grassField": {
          const heal =
            TERRAIN_PULSE_ABILITY_PARAMS.grassFieldHealPercentByStar[
              pokemon.stars - 1
            ] ??
            TERRAIN_PULSE_ABILITY_PARAMS.grassFieldHealPercentByStar.at(-1)!
          pkm.handleHeal(heal * pkm.maxHP, pokemon, 1, crit)
          break
        }
        case "electricField": {
          const speedBuff =
            TERRAIN_PULSE_ABILITY_PARAMS.electricFieldSpeedBuffByStar[
              pokemon.stars - 1
            ] ??
            TERRAIN_PULSE_ABILITY_PARAMS.electricFieldSpeedBuffByStar.at(-1)!
          pkm.addSpeed(speedBuff, pokemon, 1, crit)
          break
        }
        case "psychicField": {
          const ppGain =
            TERRAIN_PULSE_ABILITY_PARAMS.psychicFieldPpGainByStar[
              pokemon.stars - 1
            ] ?? TERRAIN_PULSE_ABILITY_PARAMS.psychicFieldPpGainByStar.at(-1)!
          pkm.addPP(ppGain, pokemon, 1, crit)
          break
        }
        case "fairyField": {
          const shieldPercent =
            TERRAIN_PULSE_ABILITY_PARAMS.fairyFieldShieldPercentByStar[
              pokemon.stars - 1
            ] ??
            TERRAIN_PULSE_ABILITY_PARAMS.fairyFieldShieldPercentByStar.at(-1)!
          pkm.addShield(shieldPercent * pkm.maxHP, pokemon, 1, crit)
          break
        }
      }
    })
  }
}

export class AxeKickStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // Leap to the enemy with the highest PP then deal [30,60,100,SP] SPECIAL and burn [15,SP] PP. Has [30,LK]% chance to inflict CONFUSION for 3 seconds
    const highestPPEnemies = board.cells
      .filter(
        (e): e is PokemonEntity => e !== undefined && e.team !== pokemon.team
      )
      .sort((a, b) => b!.pp - a!.pp)
    let highestPPEnemy: PokemonEntity | null = null
    let freeSpot: { x: number; y: number } | null = null
    do {
      highestPPEnemy = highestPPEnemies.shift() ?? null
      freeSpot = highestPPEnemy
        ? board.getClosestAvailablePlace(
            highestPPEnemy.positionX,
            highestPPEnemy.positionY
          )
        : null
    } while (highestPPEnemies.length > 0 && (!highestPPEnemy || !freeSpot))

    if (highestPPEnemy && freeSpot) {
      pokemon.moveTo(freeSpot.x, freeSpot.y, board, false)
      const damage =
        AXE_KICK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
        AXE_KICK_ABILITY_PARAMS.damageByStar.at(-1)!
      highestPPEnemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      highestPPEnemy.addPP(-AXE_KICK_ABILITY_PARAMS.ppBurn, pokemon, 1, crit)
      if (chance(AXE_KICK_ABILITY_PARAMS.confusionChance, pokemon)) {
        highestPPEnemy.status.triggerConfusion(
          AXE_KICK_ABILITY_PARAMS.confusionDurationMs,
          highestPPEnemy,
          pokemon
        )
      }
    }
  }
}

export class ExpandingForceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    // User gains PSYCHIC_FIELD, or spreads it to a nearby ally.
    if (!pokemon.status.psychicField) {
      pokemon.status.addPsychicField(pokemon)
    } else {
      // Find nearby ally without PSYCHIC_FIELD and give it to them
      const nearbyAllies = board.cells
        .filter(
          (ally): ally is PokemonEntity =>
            !!ally && ally.team === pokemon.team && !ally.status.psychicField
        )
        .sort(
          (a, b) =>
            distanceM(
              a.positionX,
              a.positionY,
              pokemon.positionX,
              pokemon.positionY
            ) -
            distanceM(
              b.positionX,
              b.positionY,
              pokemon.positionX,
              pokemon.positionY
            )
        )

      if (nearbyAllies.length > 0) {
        const chosen = nearbyAllies[0]
        chosen.status.addPsychicField(chosen)
      }
    }

    // All allies in a PSYCHIC_FIELD: deal [10,20,40,SP] SPECIAL to adjacent enemies
    const damage =
      EXPANDING_FORCE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      EXPANDING_FORCE_ABILITY_PARAMS.damageByStar.at(-1)!
    board.cells
      .filter(
        (ally): ally is PokemonEntity =>
          !!ally && ally.team === pokemon.team && ally.status.psychicField
      )
      .forEach((ally) => {
        ally.broadcastAbility({ skill: Ability.EXPANDING_FORCE })
        board
          .getAdjacentCells(ally.positionX, ally.positionY)
          .forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
      })
  }
}

export class SpiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const ppDrain =
      SPITE_ABILITY_PARAMS.ppDrainByStar[pokemon.stars - 1] ??
      SPITE_ABILITY_PARAMS.ppDrainByStar.at(-1)!

    pokemon.broadcastAbility({
      targetX: target.positionX,
      targetY: target.positionY,
      skill: Ability.PSYCHIC_FANGS
    })

    // Drain PP from target
    target.addPP(-ppDrain, pokemon, 1, crit) //addPP handles pp underflow, ap, crit

    const adjacentAllies = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter((cell) => cell.value && cell.value.team === pokemon.team)
      .map((cell) => cell.value)

    // Redistribute PP to adjacent allies
    if (adjacentAllies.length > 0) {
      for (const ally of adjacentAllies) {
        if (ally) {
          pokemon.broadcastAbility({
            targetX: ally.positionX,
            targetY: ally.positionY
          })
          ally.addPP(ppDrain / adjacentAllies.length, pokemon, 1, crit) //divide by number of allies to redistribute
        }
      }
    }
  }
}

export class GrudgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const duration = GRUDGE_ABILITY_PARAMS.silenceDurationMs
    const damage =
      GRUDGE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      GRUDGE_ABILITY_PARAMS.damageByStar.at(-1)!

    // Apply SILENCE status to the target
    target.status.triggerSilence(duration, target, pokemon)

    // Deal damage to all enemies affected by SILENCE
    board.cells
      .filter(
        (enemy): enemy is PokemonEntity =>
          !!enemy && enemy.team !== pokemon.team && enemy.status.silence
      )
      .forEach((enemy) => {
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY,
          targetX: enemy.positionX,
          targetY: enemy.positionY
        })
        enemy.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      })
  }
}

export class OctolockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage: number =
      OCTOLOCK_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      OCTOLOCK_ABILITY_PARAMS.damageByStar.at(-1)!

    // Deal SPECIAL damage
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    // Apply LOCKED status for 3 seconds
    target.status.triggerLocked(OCTOLOCK_ABILITY_PARAMS.lockDurationMs, target)

    // Apply ARMOR_BREAK status for 3 seconds
    target.status.triggerArmorReduction(
      OCTOLOCK_ABILITY_PARAMS.armorReductionDurationMs,
      target
    )
  }
}

export class JawLockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const baseDamage = Math.round(
      pokemon.atk * JAW_LOCK_ABILITY_PARAMS.atkMultiplier
    )
    const bonusDamage =
      JAW_LOCK_ABILITY_PARAMS.bonusDamageByStar[pokemon.stars - 1] ??
      JAW_LOCK_ABILITY_PARAMS.bonusDamageByStar.at(-1)!
    const totalDamage = baseDamage + bonusDamage
    const heal =
      JAW_LOCK_ABILITY_PARAMS.healOnBittenByStar[pokemon.stars - 1] ??
      JAW_LOCK_ABILITY_PARAMS.healOnBittenByStar.at(-1)!

    // Check if target is already locked (already bitten)
    const alreadyBitten = target.effects.has(EffectEnum.JAW_LOCK)

    // Apply LOCKED status for 3 seconds
    target.status.triggerLocked(JAW_LOCK_ABILITY_PARAMS.lockDurationMs, target)
    target.effects.add(EffectEnum.JAW_LOCK)

    // Deal damage
    target.handleSpecialDamage(
      totalDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    // If target was already bitten, heal the user
    if (alreadyBitten) {
      pokemon.handleHeal(heal, pokemon, 1, crit)
    }
  }
}

export class LastRespectsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Reduction factor for curse delay based on AP and crit
    const factor = LAST_RESPECTS_ABILITY_PARAMS.apCritScaleFactor

    // Base damage scales with star level: 1★=30, 2★=60, 3★=90
    const damage =
      LAST_RESPECTS_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      LAST_RESPECTS_ABILITY_PARAMS.damageByStar.at(-1)!

    // Calculate curse delay with AP and crit scaling
    // Base delays: 1★=8s, 2★=5s, 3★=3s, reduced by AP and crit power
    const curseDelay = min(0)(
      (LAST_RESPECTS_ABILITY_PARAMS.baseCurseDelayByStarMs[pokemon.stars - 1] ??
        LAST_RESPECTS_ABILITY_PARAMS.baseCurseDelayByStarMs.at(-1)!) *
        (1 - (factor * pokemon.ap) / 100) *
        (crit ? 1 - (pokemon.critPower - 1) * factor : 1)
    )

    // Find all adjacent enemies that aren't already cursed
    const cells = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter((c) => c.value?.team === target.team && !c.value?.status.curse)
      .map((c) => c.value)

    // Pick a random uncursed ally to curse, fallback to original target
    const curseTarget = pickRandomIn(cells)
    const damageTarget = curseTarget || target

    // Broadcast ability animation
    pokemon.broadcastAbility({
      targetX: damageTarget.positionX,
      targetY: damageTarget.positionY,
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })

    // Deal immediate damage to the target
    damageTarget.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Apply curse status that will KO after the calculated delay
    curseTarget?.status.triggerCurse(curseDelay, curseTarget)
  }
}

export class BurningJealousyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = BURNING_JEALOUSY_ABILITY_PARAMS.damage
    const burnDuration = BURNING_JEALOUSY_ABILITY_PARAMS.burnDurationMs

    // Get target and adjacent enemies
    const targets = board
      .getAdjacentCells(target.positionX, target.positionY, true)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value!)

    targets.forEach((enemy) => {
      // Deal SPECIAL damage to all targets
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      pokemon.broadcastAbility({
        targetX: enemy.positionX,
        targetY: enemy.positionY,
        positionX: pokemon.positionX,
        positionY: pokemon.positionY
      })

      // Only enemies with ATK buffs lose them and get burned
      if (enemy.atk > enemy.baseAtk) {
        // Remove ATK buffs (subtract the buff amount)
        enemy.addAttack(-(enemy.atk - enemy.baseAtk), enemy, 0, false)

        // Inflict BURN for 5 seconds
        enemy.status.triggerBurn(burnDuration, enemy, pokemon)
      }
    })
  }
}

export class FirstImpressionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage =
      FIRST_IMPRESSION_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      FIRST_IMPRESSION_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    target.status.triggerFlinch(
      FIRST_IMPRESSION_ABILITY_PARAMS.flinchDurationMs,
      target,
      pokemon
    )

    if (pokemon.count.ult === 1) {
      // On first cast, find a cell to jump away to after the attack
      const newCell = board.getSafePlaceAwayFrom(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )

      // Store original position before moving
      const x = pokemon.positionX
      const y = pokemon.positionY

      if (newCell) {
        // Move pokemon to the fly away position
        pokemon.moveTo(newCell.x, newCell.y, board, false)

        // If original position is now empty, spawn a random bug pokemon
        if (board.getEntityOnCell(x, y) === undefined) {
          // Get all 1-star bug pokemon from common/uncommon rarities with abilities
          const possibleBugsPkm = (
            [
              PRECOMPUTED_POKEMONS_PER_RARITY.COMMON,
              PRECOMPUTED_POKEMONS_PER_RARITY.UNCOMMON,
              PRECOMPUTED_POKEMONS_PER_RARITY.RARE
            ][pokemon.stars - 1] ?? PRECOMPUTED_POKEMONS_PER_RARITY.RARE
          ).filter((pkm) => {
            const data = getPokemonData(pkm)
            return (
              data.stars === 1 &&
              data.skill !== Ability.DEFAULT &&
              data.types.includes(Synergy.BUG)
            )
          })

          // Pick a random bug pokemon from the filtered list
          const randomBugPkm = pickRandomIn<Pkm>(possibleBugsPkm)

          // Create the bug pokemon instance
          const randomBug = PokemonFactory.createPokemonFromName(
            randomBugPkm,
            pokemon.player
          )

          // Add the bug pokemon to the original position
          pokemon.simulation.addPokemon(randomBug, x, y, pokemon.team, true)
        }
      }
    }
  }
}

export class BaredFangsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    // Deal 160% of ATK as SPECIAL damage
    const damage = Math.round(
      pokemon.atk * BARED_FANGS_ABILITY_PARAMS.damageMultiplier
    )
    const speedSteal = BARED_FANGS_ABILITY_PARAMS.speedSteal

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    // Steal 10 SPEED from target and give it to attacker
    if (target.items.has(Item.TWIST_BAND) === false) {
      target.addSpeed(-speedSteal, pokemon, 1, crit)
      pokemon.addSpeed(speedSteal, pokemon, 1, crit)
    }
  }
}

export class GrudgeDiveStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Base damage scales with stars: 1★=30, 2★=60, 3★=90, 4★=120
    const damage =
      GRUDGE_DIVE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      GRUDGE_DIVE_ABILITY_PARAMS.damageByStar.at(-1)!

    // Recoil damage is 20% of base HP
    const recoil = Math.round(
      pokemon.maxHP * GRUDGE_DIVE_ABILITY_PARAMS.recoilRatio
    )

    // Bonus damage per fallen ally scales with stars: 1★=5, 2★=10, 3★=15, 4★=20
    const damagePerFallenAlly =
      GRUDGE_DIVE_ABILITY_PARAMS.damagePerFallenAllyByStar[pokemon.stars - 1] ??
      GRUDGE_DIVE_ABILITY_PARAMS.damagePerFallenAllyByStar.at(-1)!
    const nbFallenAllies = board.getFallenAlliesCount(pokemon)

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      targetX: target.positionX,
      targetY: target.positionY
    })

    // Deal damage increased by fallen allies
    target.handleSpecialDamage(
      damage + nbFallenAllies * damagePerFallenAlly,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    // Take recoil damage unless protected by Protective Pads
    if (!pokemon.items.has(Item.PROTECTIVE_PADS)) {
      pokemon.handleSpecialDamage(
        recoil,
        board,
        AttackType.PHYSICAL,
        pokemon,
        crit
      )
    }
  }
}

export class SoulTrapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shieldAmount =
      SOUL_TRAP_ABILITY_PARAMS.shieldAmountByStar[pokemon.stars - 1] ??
      SOUL_TRAP_ABILITY_PARAMS.shieldAmountByStar.at(-1)!
    const fatigueDuration = Math.round(
      SOUL_TRAP_ABILITY_PARAMS.baseFatigueDurationMs *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    pokemon.addShield(shieldAmount, pokemon, 0, false)
    const enemies = board
      .getCellsInRadius(
        pokemon.positionX,
        pokemon.positionY,
        SOUL_TRAP_ABILITY_PARAMS.radius,
        false
      )
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
    enemies.forEach((cell) => {
      const enemy = cell.value!
      enemy.addPP(-SOUL_TRAP_ABILITY_PARAMS.ppLoss, pokemon, 1, crit)
      enemy.status.triggerFatigue(fatigueDuration, enemy)
    })
  }
}

export class EerieSpellStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage =
      EERIE_SPELL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      EERIE_SPELL_ABILITY_PARAMS.damageByStar.at(-1)!
    const healAmount =
      EERIE_SPELL_ABILITY_PARAMS.healByStar[pokemon.stars - 1] ??
      EERIE_SPELL_ABILITY_PARAMS.healByStar.at(-1)!
    const visited = new Set<string>()
    let currentTarget: PokemonEntity | undefined = target
    let lastTarget: PokemonEntity = pokemon

    // Queue bounces with configured delays
    for (let i = 0; i < EERIE_SPELL_ABILITY_PARAMS.bounceCount; i++) {
      if (currentTarget) {
        visited.add(currentTarget.id)

        // Animate wave from last position to current target
        pokemon.broadcastAbility({
          positionX: lastTarget.positionX,
          positionY: lastTarget.positionY,
          targetX: currentTarget.positionX,
          targetY: currentTarget.positionY,
          delay: EERIE_SPELL_ABILITY_PARAMS.bounceDelayMs * i
        })

        lastTarget = currentTarget

        // Heal allies, damage enemies
        if (currentTarget.team === pokemon.team) {
          currentTarget.handleHeal(healAmount, pokemon, 1, crit)
        } else {
          currentTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }

      // Find next target with lowest HP
      currentTarget = board.cells
        .filter((c) => c instanceof PokemonEntity)
        .filter((c) => !visited.has(c.id))
        .sort((a, b) => a.hp - b.hp)[0]
    }
  }
}

export class ShellSideArmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const poisonDuration =
      (SHELL_SIDE_ARM_ABILITY_PARAMS.poisonDurationByStarMs[
        pokemon.stars - 1
      ] ?? SHELL_SIDE_ARM_ABILITY_PARAMS.poisonDurationByStarMs.at(-1)!) *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)

    const apBoost =
      SHELL_SIDE_ARM_ABILITY_PARAMS.abilityPowerGainByStar[pokemon.stars - 1] ??
      SHELL_SIDE_ARM_ABILITY_PARAMS.abilityPowerGainByStar.at(-1)!
    const visited = new Set<string>()
    let currentTarget: PokemonEntity | undefined = target
    let lastTarget: PokemonEntity = pokemon

    // Queue 4 bounces with 300ms delays, prioritizing high HP targets
    for (let i = 0; i < SHELL_SIDE_ARM_ABILITY_PARAMS.maxBounces; i++) {
      if (currentTarget) {
        visited.add(currentTarget.id)

        // Animate wave from last position to current target
        pokemon.broadcastAbility({
          positionX: lastTarget.positionX,
          positionY: lastTarget.positionY,
          targetX: currentTarget.positionX,
          targetY: currentTarget.positionY,
          delay: SHELL_SIDE_ARM_ABILITY_PARAMS.bounceDelayMs * i,
          orientation: lastTarget.orientation
        })

        lastTarget = currentTarget

        // Poison enemies, boost allies' AP
        if (currentTarget.team === pokemon.team) {
          currentTarget.addAbilityPower(apBoost, pokemon, 0, false)
        } else {
          currentTarget.status.triggerPoison(
            poisonDuration,
            currentTarget,
            pokemon
          )
        }
      }

      // Find next target with highest HP
      currentTarget = board.cells
        .filter((c) => c instanceof PokemonEntity)
        .filter((c) => !visited.has(c.id))
        .sort((a, b) => b.hp - a.hp)[0]
    }
  }
}

export class TripleDiveStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)

    const damage =
      TRIPLE_DIVE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TRIPLE_DIVE_ABILITY_PARAMS.damageByStar.at(-1)!

    // Find 3 lowest HP enemies
    const enemies = board.cells
      .filter(
        (entity): entity is PokemonEntity =>
          entity instanceof PokemonEntity && entity.team !== pokemon.team
      )
      .sort((a, b) => a.hp - b.hp)
      .slice(0, TRIPLE_DIVE_ABILITY_PARAMS.maxTargets)

    // Perform triple dive with 400ms delays
    enemies.forEach((enemy, i) => {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (enemy) {
            const availableAdjacentPlace = board.getClosestAvailablePlace(
              enemy.positionX,
              enemy.positionY
            )

            if (availableAdjacentPlace) {
              pokemon.moveTo(
                availableAdjacentPlace.x,
                availableAdjacentPlace.y,
                board,
                false
              )
            }

            pokemon.broadcastAbility({
              positionX: pokemon.positionX,
              positionY: pokemon.positionY,
              targetX: enemy.positionX,
              targetY: enemy.positionY
            })

            enemy.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, TRIPLE_DIVE_ABILITY_PARAMS.delayBetweenDivesMs * i)
      )
    })
  }
}

export class MoonblastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = MOONBLAST_ABILITY_PARAMS.damage
    let currentTarget: PokemonEntity | undefined = target
    let moonsRemaining = MOONBLAST_ABILITY_PARAMS.initialMoonCount
    let moonIndex = 0

    function sendMoon() {
      if (!currentTarget) return
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY
      })

      moonIndex++

      const { death } = currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      moonsRemaining--

      // If target died, find closest enemy and gain bonus moon
      if (death) {
        const closestEnemy = board.getClosestEnemy(
          currentTarget.positionX,
          currentTarget.positionY,
          currentTarget.team
        )
        if (closestEnemy) {
          currentTarget = closestEnemy
          moonsRemaining += MOONBLAST_ABILITY_PARAMS.bonusMoonsOnKill
        } else {
          currentTarget = undefined
        }
      }

      if (
        moonsRemaining > 0 &&
        currentTarget &&
        currentTarget.hp > 0 &&
        moonIndex < MOONBLAST_ABILITY_PARAMS.maxMoonJumps
      ) {
        // safety check to prevent infinite loops
        pokemon.commands.push(
          new DelayedCommand(() => {
            sendMoon()
          }, MOONBLAST_ABILITY_PARAMS.moonDelayMs)
        )
      }
    }
    sendMoon()
  }
}

export class PlasmaFissionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Base damage for Plasma Fission
    const damage = PLASMA_FISSION_ABILITY_PARAMS.baseDamage
    // Identify enemies between the user and the target
    const enemiesOnThePathEntities = board
      .getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        target.positionX,
        target.positionY
      )
      .filter((c) => c.value && c.value.team !== pokemon.team)
      .map((c) => c.value)
      .sort(
        (a, b) =>
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            a?.positionX || 0,
            a?.positionY || 0
          ) -
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            b?.positionX || 0,
            b?.positionY || 0
          )
      )
    // Determine primary target: first enemy on path or original target if no enemies on path
    const primaryTarget =
      enemiesOnThePathEntities.length > 0 ? enemiesOnThePathEntities[0] : target

    if (primaryTarget) {
      // Initiate ability animation
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: primaryTarget.positionX,
        targetY: primaryTarget.positionY
      })
      // Schedule main ability execution
      pokemon.commands.push(
        new DelayedCommand(() => {
          // Inflict damage on primary target
          primaryTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // Determine vector from user to primary target
          const vector: { x: number; y: number } = {
            x: primaryTarget.positionX - pokemon.positionX,
            y: primaryTarget.positionY - pokemon.positionY
          }

          // Generate two perpendicular split beams
          for (const v of [
            { x: -vector.y, y: vector.x },
            { x: vector.y, y: -vector.x }
          ]) {
            // Calculate how many steps until hitting board edge
            const stepsX =
              v.x > 0
                ? BOARD_WIDTH - primaryTarget.positionX
                : v.x < 0
                  ? primaryTarget.positionX + 1
                  : BOARD_WIDTH + BOARD_HEIGHT
            const stepsY =
              v.y > 0
                ? BOARD_HEIGHT - primaryTarget.positionY
                : v.y < 0
                  ? primaryTarget.positionY + 1
                  : BOARD_WIDTH + BOARD_HEIGHT
            const steps = Math.min(stepsX, stepsY)
            if (steps === BOARD_WIDTH + BOARD_HEIGHT) {
              logger.error(
                "PlasmaFission: Perpendicular vector has no movement",
                { v, vector }
              )
            }

            const splitDestination = {
              positionX: primaryTarget.positionX + v.x * steps,
              positionY: primaryTarget.positionY + v.y * steps
            }
            // Animate split beam
            pokemon.broadcastAbility({
              positionX: primaryTarget.positionX,
              positionY: primaryTarget.positionY,
              targetX: splitDestination.positionX,
              targetY: splitDestination.positionY
            })
            let residualDamage: number = damage
            // Locate enemies along split beam trajectory
            const enemiesOnThePathEntities = board
              .getCellsBetween(
                primaryTarget.positionX,
                primaryTarget.positionY,
                splitDestination.positionX,
                splitDestination.positionY
              )
              .filter(
                (c) =>
                  c.value &&
                  c.value.team !== pokemon.team &&
                  c.value.id !== primaryTarget.id
              )
              .map((c) => c.value)
              .sort(
                (a, b) =>
                  distanceC(
                    primaryTarget.positionX,
                    primaryTarget.positionY,
                    a?.positionX || 0,
                    a?.positionY || 0
                  ) -
                  distanceC(
                    primaryTarget.positionX,
                    primaryTarget.positionY,
                    b?.positionX || 0,
                    b?.positionY || 0
                  )
              )
            // Apply diminishing damage to enemies along split beam path
            for (const enemy of enemiesOnThePathEntities) {
              if (enemy) {
                enemy.handleSpecialDamage(
                  residualDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
                residualDamage = Math.max(
                  PLASMA_FISSION_ABILITY_PARAMS.minSplitDamage,
                  Math.round(
                    residualDamage *
                      PLASMA_FISSION_ABILITY_PARAMS.splitDamageDecayRatio
                  )
                )
              }
            }
          }
        }, PLASMA_FISSION_ABILITY_PARAMS.splitDelayMs)
      )
    }
  }
}

export class SuperHeatStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Perform the ability multiple times in short bursts.
    for (let i = 0; i < SUPER_HEAT_ABILITY_PARAMS.tickCount; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          if (
            pokemon.status.resurrecting ||
            pokemon.status.freeze ||
            pokemon.status.sleep
          ) {
            return
          }
          pokemon.broadcastAbility({
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: target.positionX,
            targetY: target.positionY
          })
          const coneCells = board
            .getCellsInFront(
              pokemon,
              target,
              SUPER_HEAT_ABILITY_PARAMS.coneDepth
            )
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .map((cell) => cell.value)

          for (const enemy of coneCells) {
            if (enemy) {
              enemy.handleSpecialDamage(
                SUPER_HEAT_ABILITY_PARAMS.damagePerTick,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              enemy.status.triggerArmorReduction(
                SUPER_HEAT_ABILITY_PARAMS.armorBreakDurationMs,
                enemy
              )
            }
          }
        }, SUPER_HEAT_ABILITY_PARAMS.tickIntervalMs * i)
      )
    }
  }
}

export class PowerWashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = POWER_WASH_ABILITY_PARAMS.totalDamage

    // Create a map to store enemy HP totals for each row
    const hpEnemiesByRow: Map<
      number,
      { y: number; hp: number; enemyCount: number }
    > = new Map()
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      board.getCellsInRow(y).forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          if (!hpEnemiesByRow.has(y)) {
            hpEnemiesByRow.set(y, { y: y, hp: cell.value.hp, enemyCount: 1 })
          } else {
            const entry = hpEnemiesByRow.get(y)!
            entry.hp += cell.value.hp
            entry.enemyCount++
          }
        }
      })
    }
    // Order rows by descending total enemy HP
    const sortedRows = Array.from(hpEnemiesByRow.values()).sort(
      (a, b) => b.hp - a.hp
    )

    // Terminate if no enemy rows are found
    if (sortedRows.length === 0) {
      return
    }
    // Select the row with the highest cumulative enemy HP
    const targetRow = sortedRows[0].y
    // Calculate damage per drop, dividing total damage among enemies in the row
    const dropDamage =
      sortedRows[0].enemyCount > 0
        ? Math.ceil(damage / sortedRows[0].enemyCount) /
          POWER_WASH_ABILITY_PARAMS.damageSplitDivisor
        : 0

    // Helper function to dispatch a water drop to a specific board position
    const sendDrop = (x: number, y: number, delay: number) => {
      pokemon.commands.push(
        new DelayedCommand(() => {
          // Initiate the ability's visual effect
          pokemon.broadcastAbility({
            targetX: x,
            targetY: y
          })
          // Inflict damage on enemy entities in the target cell
          const entity = board.getEntityOnCell(x, y)
          if (entity && entity.team !== pokemon.team) {
            entity.handleSpecialDamage(
              dropDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, delay)
      )
    }

    // Dispatch water drops along the chosen row in both directions
    for (let x = 0; x < BOARD_WIDTH; x++) {
      sendDrop(x, targetRow, POWER_WASH_ABILITY_PARAMS.dropDelayMs * x)
      sendDrop(
        BOARD_WIDTH - 1 - x,
        targetRow,
        POWER_WASH_ABILITY_PARAMS.dropDelayMs * x
      )
    }
  }
}

export class DeepFreezeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Ability constants
    const damage = DEEP_FREEZE_ABILITY_PARAMS.damagePerBolt // Damage per ice bolt
    const armorReduction =
      -DEEP_FREEZE_ABILITY_PARAMS.specialDefenseReductionPerBolt // Special defense reduction per hit
    const totalBolts = DEEP_FREEZE_ABILITY_PARAMS.boltCount // Total number of ice bolts to fire
    const boltDelay = DEEP_FREEZE_ABILITY_PARAMS.boltIntervalMs // Delay between bolts in milliseconds

    // Tracking variables
    let currentTarget: PokemonEntity | undefined = target
    let startingProjectileCoordinates = {
      x: pokemon.positionX,
      y: pokemon.positionY
    }
    let boltsRemaining = totalBolts

    // Recursive function to fire ice bolts that chain between enemies
    const fireBolt = () => {
      // Stop if no target or no bolts remaining
      if (!currentTarget || boltsRemaining <= 0) return

      // Animate ice bolt from current position to target
      pokemon.broadcastAbility({
        positionX: startingProjectileCoordinates.x,
        positionY: startingProjectileCoordinates.y,
        targetX: currentTarget.positionX,
        targetY: currentTarget.positionY
      })

      // Reduce target's special defense permanently
      currentTarget.addSpecialDefense(armorReduction, pokemon, 0, false)

      // Deal ice damage to current target
      const { death } = currentTarget.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )

      // Consume one bolt
      boltsRemaining--

      // If target dies, chain to closest enemy from the death position
      if (death) {
        const oldPositionX = currentTarget.positionX
        const oldPositionY = currentTarget.positionY
        const nextTarget = board.getClosestEnemy(
          currentTarget.positionX,
          currentTarget.positionY,
          currentTarget.team
        )
        if (nextTarget) {
          startingProjectileCoordinates = {
            x: oldPositionX,
            y: oldPositionY
          }
        }
        currentTarget = nextTarget
      }

      // Schedule next bolt if more remain and target exists
      if (boltsRemaining > 0 && currentTarget) {
        pokemon.commands.push(
          new DelayedCommand(() => {
            fireBolt()
          }, boltDelay)
        )
      }
    }

    // Start the ice bolt chain
    fireBolt()
  }
}

export class PlasmaTempestStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = PLASMA_TEMPEST_ABILITY_PARAMS.baseDamage

    // Make the Pokemon fly away
    pokemon.flyAway(board, false)

    pokemon.commands.push(
      new DelayedCommand(() => {
        // Find the 3 closest enemy Pokemon
        const enemies = board
          .getClosestEnemies(pokemon.positionX, pokemon.positionY, target.team)
          .slice(0, PLASMA_TEMPEST_ABILITY_PARAMS.targetCount)

        // Process each of the 3 closest enemies
        enemies.forEach((enemy) => {
          // Calculate the direction vector from the Pokemon to the enemy
          const vector = {
            x: enemy.positionX - pokemon.positionX,
            y: enemy.positionY - pokemon.positionY
          }

          // Calculate steps to reach board edges
          const stepsX =
            vector.x > 0
              ? (BOARD_WIDTH - 1 - enemy.positionX) / vector.x
              : vector.x < 0
                ? -enemy.positionX / vector.x
                : BOARD_WIDTH + BOARD_HEIGHT
          const stepsY =
            vector.y > 0
              ? (BOARD_HEIGHT - 1 - enemy.positionY) / vector.y
              : vector.y < 0
                ? -enemy.positionY / vector.y
                : BOARD_WIDTH + BOARD_HEIGHT
          const steps = Math.min(stepsX, stepsY)
          if (steps === BOARD_WIDTH + BOARD_HEIGHT) {
            logger.error("PlasmaTempestStrategy: vector has no movement", {
              vector
            })
          }
          const endX = enemy.positionX + vector.x * steps
          const endY = enemy.positionY + vector.y * steps

          // Broadcast the ability animation
          pokemon.broadcastAbility({
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: endX,
            targetY: endY
          })

          // Get all cells between the Pokemon and the end of the beam
          const cellsBetween = board.getCellsBetween(
            pokemon.positionX,
            pokemon.positionY,
            endX,
            endY
          )

          // Initialize damage for this beam
          let reducedDamage: number = damage

          // Apply damage to all enemy Pokemon in the beam's path
          for (const cell of cellsBetween) {
            if (cell.value && cell.value.team !== pokemon.team) {
              // Deal special damage to the enemy
              cell.value.handleSpecialDamage(
                reducedDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              // Reduce damage for subsequent hits
              reducedDamage = max(PLASMA_TEMPEST_ABILITY_PARAMS.minDamage)(
                Math.round(
                  reducedDamage * PLASMA_TEMPEST_ABILITY_PARAMS.damageDecayRatio
                )
              )
            }
          }
        })
      }, PLASMA_TEMPEST_ABILITY_PARAMS.castDelayMs)
    )
  }
}

export class TrimmingMowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage = TRIMMING_MOWER_ABILITY_PARAMS.damage
    const healAmount = TRIMMING_MOWER_ABILITY_PARAMS.healAmount

    // Identify potential dash locations within a 2-hex radius
    const dashDestinations = board
      .getCellsInRange(
        pokemon.positionX,
        pokemon.positionY,
        TRIMMING_MOWER_ABILITY_PARAMS.dashRange,
        false
      )
      .filter((cell) => !cell.value)

    // Determine optimal dash location based on maximum enemy coverage
    let bestDestination = { x: pokemon.positionX, y: pokemon.positionY }
    let maxEnemiesHit = 0

    for (const cell of dashDestinations) {
      const enemiesHit = board
        .getAdjacentCells(cell.x, cell.y)
        .filter((c) => c.value && c.value.team !== pokemon.team).length

      if (enemiesHit > maxEnemiesHit) {
        maxEnemiesHit = enemiesHit
        bestDestination = { x: cell.x, y: cell.y }
      }
    }

    if (
      pokemon.positionX !== bestDestination.x ||
      pokemon.positionY !== bestDestination.y
    ) {
      // Execute dash movement to optimal location
      pokemon.moveTo(bestDestination.x, bestDestination.y, board, false)
    }

    // Apply self-healing effect
    const healingResult = pokemon.handleHeal(healAmount, pokemon, 1, crit) || {
      overheal: 0
    }

    if (healingResult.overheal) {
      // Convert excess healing to shield
      pokemon.addShield(healingResult.overheal, pokemon, 0, false)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        // Initiate ability visual effect
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY
        })
        // Identify and damage adjacent enemy targets
        const adjacentEnemies = board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .filter((c) => c.value && c.value.team !== pokemon.team)
          .map((c) => c.value)

        for (const enemy of adjacentEnemies) {
          enemy?.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }, TRIMMING_MOWER_ABILITY_PARAMS.damageDelayMs)
    )
  }
}

export class PlasmaFlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const damage = PLASMA_FLASH_ABILITY_PARAMS.damage

    const flashCount =
      PLASMA_FLASH_ABILITY_PARAMS.baseFlashCount + pokemon.count.ult

    // Loop through each flash
    for (let i = 0; i < flashCount; i++) {
      // Add a delayed command for each flash
      pokemon.commands.push(
        new DelayedCommand(() => {
          // Animate the flash ability
          pokemon.broadcastAbility({
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: target.positionX,
            targetY: target.positionY
          })

          // Deal special damage to the target
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, PLASMA_FLASH_ABILITY_PARAMS.flashDelayMs * i)
      )
    }
  }
}

export class GearGrindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    // Launches two gears at the target, each dealing [25,50,100,SP]% of SPEED as SPECIAL
    super.process(pokemon, board, target, crit)
    const speedFactor: number =
      GEAR_GRIND_ABILITY_PARAMS.speedFactorByStar[pokemon.stars - 1] ??
      GEAR_GRIND_ABILITY_PARAMS.speedFactorByStar.at(-1)!
    const damage = Math.round(pokemon.speed * speedFactor)
    for (let i = 0; i < GEAR_GRIND_ABILITY_PARAMS.hitCount; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          target.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }, i * GEAR_GRIND_ABILITY_PARAMS.hitDelayMs)
      )
    }
  }
}

export class PummelingPaybackStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const healAmount = PUMMELING_PAYBACK_ABILITY_PARAMS.healAmount
    const baseDamage = PUMMELING_PAYBACK_ABILITY_PARAMS.baseDamage
    const adBonus = PUMMELING_PAYBACK_ABILITY_PARAMS.attackScaling * pokemon.atk
    const totalDamage = baseDamage + adBonus

    target.handleSpecialDamage(
      totalDamage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )

    pokemon.handleHeal(healAmount, pokemon, 1, crit)
  }
}

// Define an effect that triggers on attack
const voltSurgeEffect = new OnAttackEffect(({ pokemon, target, board }) => {
  // Check if it's every third attack
  if (
    pokemon.count.attackCount %
      VOLT_SURGE_ABILITY_PARAMS.triggerEveryAttacks ===
    0
  ) {
    const nbBounces = VOLT_SURGE_ABILITY_PARAMS.chainTargetCount
    const damage = VOLT_SURGE_ABILITY_PARAMS.chainDamage
    const closestEnemies = board.getClosestEnemies(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team === Team.RED_TEAM ? Team.BLUE_TEAM : Team.RED_TEAM
    )

    let previousTg: PokemonEntity = pokemon
    let secondaryTargetHit: PokemonEntity | null = target

    // Loop through bounces
    for (let i = 0; i < nbBounces; i++) {
      secondaryTargetHit = closestEnemies[i]
      if (secondaryTargetHit) {
        // Broadcast the ability animation
        pokemon.broadcastAbility({
          skill: "LINK_CABLE_link",
          positionX: previousTg.positionX,
          positionY: previousTg.positionY,
          targetX: secondaryTargetHit.positionX,
          targetY: secondaryTargetHit.positionY
        })
        // Deal damage to the secondary target
        secondaryTargetHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          false
        )
        previousTg = secondaryTargetHit
      } else {
        break
      }
    }
  }
})

export class VoltSurgeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addMaxHP(VOLT_SURGE_ABILITY_PARAMS.hpBuff, pokemon, 1, crit, false)
    pokemon.addSpeed(VOLT_SURGE_ABILITY_PARAMS.speedBuff, pokemon, 0, false)
    if (pokemon.status.electricField === false) {
      pokemon.status.electricField = true
      pokemon.broadcastAbility({ skill: "SUPERCHARGE" })
    }

    // Add the volt surge effect if it's the first ultimate
    if (pokemon.count.ult === 1) {
      pokemon.effectsSet.add(voltSurgeEffect)
    } else {
      pokemon.cooldown = 0 // no cooldown for subsequent ultimates
    }
  }
}

export class SupercellSlamStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage =
      SUPERCELL_SLAM_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      SUPERCELL_SLAM_ABILITY_PARAMS.damageByStar.at(-1)!
    const shield =
      SUPERCELL_SLAM_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      SUPERCELL_SLAM_ABILITY_PARAMS.shieldByStar.at(-1)!
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    pokemon.addShield(shield, pokemon, 1, crit)

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )

      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      })
    }
  }
}

export class HighHorsepowerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Determine base damage based on pokemon's star level
    const damage: number =
      HIGH_HORSEPOWER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      HIGH_HORSEPOWER_ABILITY_PARAMS.damageByStar.at(-1)!

    // Calculate direction from pokemon to target
    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      undefined
    )

    // Find potential knockback position for target
    const destination = board.getKnockBackPlace(
      target.positionX,
      target.positionY,
      orientation
    )

    // Move pokemon to knockback position if available
    if (destination) {
      pokemon.moveTo(destination.x, destination.y, board, false)
    }

    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.broadcastAbility({
          positionX: pokemon.positionX,
          positionY: pokemon.positionY
        })

        // Identify enemy pokemon adjacent to the pokemon after movement
        const adjacentEnemies = board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
          .filter((cell) => cell.value && cell.value.team !== pokemon.team)

        // Apply damage based on number of adjacent enemies
        if (adjacentEnemies.length === 1) {
          // Double damage if only one adjacent enemy
          adjacentEnemies[0]?.value?.handleSpecialDamage(
            damage * 2,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        } else if (adjacentEnemies.length > 1) {
          // Normal damage to all adjacent enemies if more than one
          for (const cell of adjacentEnemies) {
            cell.value?.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }, 300)
    )
  }
}

export class CityShuttleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const damage =
      CITY_SHUTTLE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      CITY_SHUTTLE_ABILITY_PARAMS.damageByStar.at(-1)!
    const shield =
      CITY_SHUTTLE_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      CITY_SHUTTLE_ABILITY_PARAMS.shieldByStar.at(-1)!

    // Step 1: Find the closest ally to carry as a passenger (excluding Gogoat itself)
    const passenger = board.getClosestAlly(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team,
      pokemon.id
    )

    // Store the passenger's ATK to add to damage calculation
    const carriedAllyAttack = passenger ? passenger.atk : 0

    // Step 2: If a passenger exists, move Gogoat adjacent to them first (to saddle them)
    if (passenger) {
      const availablePlaceNearAlly = board.getClosestAvailablePlace(
        passenger.positionX,
        passenger.positionY
      )

      if (availablePlaceNearAlly) {
        pokemon.moveTo(
          availablePlaceNearAlly.x,
          availablePlaceNearAlly.y,
          board,
          false
        )
      }
    }

    // Step 3: Schedule the dash to the farthest enemy position with damage phase
    pokemon.commands.push(
      new DelayedCommand(() => {
        const farthestCoordinate =
          board.getFarthestTargetCoordinateAvailablePlace(pokemon)

        if (farthestCoordinate) {
          // Get all cells in the path from current position to destination
          const cells = board.getCellsBetween(
            pokemon.positionX,
            pokemon.positionY,
            farthestCoordinate.x,
            farthestCoordinate.y
          )

          // Store the starting position before movement to calculate distance traveled
          const startX = pokemon.positionX
          const startY = pokemon.positionY

          const totalDistance = distanceC(
            pokemon.positionX,
            pokemon.positionY,
            farthestCoordinate.x,
            farthestCoordinate.y
          )

          // Step 4: Move Gogoat to the farthest position while carrying the passenger
          pokemon.moveTo(
            farthestCoordinate.x,
            farthestCoordinate.y,
            board,
            false
          )

          // Step 5: Drop the passenger at the closest available space near the destination
          if (passenger) {
            const closestAvailablePlace = board.getClosestAvailablePlace(
              farthestCoordinate.x,
              farthestCoordinate.y
            )
            if (closestAvailablePlace) {
              passenger.moveTo(
                closestAvailablePlace.x,
                closestAvailablePlace.y,
                board,
                false
              )
            }
          }

          // Step 6: Deal damage to all enemies in the path
          // Damage = base damage + 100% of passenger's ATK

          for (const cell of cells) {
            const totalDamage =
              damage +
              carriedAllyAttack *
                CITY_SHUTTLE_ABILITY_PARAMS.carriedAllyAttackRatio
            const distance = distanceC(startX, startY, cell.x, cell.y)

            pokemon.commands.push(
              new DelayedCommand(
                () => {
                  pokemon.broadcastAbility({
                    positionX: cell.x,
                    positionY: cell.y
                  })
                  // Only damage enemy team Pokemon
                  cell.value?.team === target.team &&
                    cell.value.handleSpecialDamage(
                      totalDamage,
                      board,
                      AttackType.SPECIAL,
                      pokemon,
                      crit
                    )
                },
                (distance / totalDistance) *
                  CITY_SHUTTLE_ABILITY_PARAMS.pathDamageWindowMs
              )
            )
          }
        }

        // Step 7: Grant shields to both Gogoat and the passenger
        pokemon.addShield(shield, pokemon, 1, crit)
        passenger?.addShield(shield, pokemon, 1, crit)
      }, CITY_SHUTTLE_ABILITY_PARAMS.dashDelayMs)
    )
  }
}

export class BulletPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deal [40,SP] TRUE to the target, then gain [40,SP] SPEED for 2 seconds.
    const damage = BULLET_PUNCH_ABILITY_PARAMS.damage
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, crit)
    const speedBuff =
      BULLET_PUNCH_ABILITY_PARAMS.speedBuff *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)
    pokemon.addSpeed(speedBuff, pokemon, 0, false)
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.addSpeed(-speedBuff, pokemon, 0, false)
      }, BULLET_PUNCH_ABILITY_PARAMS.buffDurationMs)
    )
    pokemon.resetCooldown(BULLET_PUNCH_ABILITY_PARAMS.cooldownResetMs)
  }
}

export class FeatherDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const feathers = [
      "HEALTH_FEATHER",
      "MUSCLE_FEATHER",
      "RESIST_FEATHER",
      "GENIUS_FEATHER",
      "CLEVER_FEATHER",
      "SWIFT_FEATHER",
      "PRETTY_FEATHER"
    ] as const

    const featherCount =
      FEATHER_DANCE_ABILITY_PARAMS.featherCountByStar[pokemon.stars - 1] ??
      FEATHER_DANCE_ABILITY_PARAMS.featherCountByStar.at(-1)!
    const landingPlace =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon, true) ||
      board.getSafePlaceAwayFrom(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )

    if (landingPlace) {
      const pathCells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        landingPlace.x,
        landingPlace.y
      )

      pokemon.moveTo(landingPlace.x, landingPlace.y, board, false)

      // Distribute feathers to allies on the identified cells
      for (let i = 0; i < featherCount; i++) {
        const feather = pickRandomIn(feathers)
        const cell = pickRandomIn(pathCells)

        // Find entity on this cell to apply the effect
        const featherTarget = cell.value
        if (featherTarget) {
          pokemon.broadcastAbility({
            positionX: cell.x,
            positionY: cell.y,
            skill: feather
          })

          pokemon.commands.push(
            new DelayedCommand(() => {
              const sign = featherTarget.team === pokemon.team ? 1 : -1
              if (feather === "HEALTH_FEATHER") {
                if (sign === 1) {
                  featherTarget.handleHeal(sign * 20, featherTarget, 1, crit)
                } else {
                  featherTarget.handleSpecialDamage(
                    20,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              } else if (feather === "MUSCLE_FEATHER") {
                featherTarget.addAttack(sign * 4, featherTarget, 1, crit)
              } else if (feather === "RESIST_FEATHER") {
                featherTarget.addDefense(sign * 4, featherTarget, 1, crit)
              } else if (feather === "GENIUS_FEATHER") {
                featherTarget.addAbilityPower(sign * 10, featherTarget, 1, crit)
              } else if (feather === "CLEVER_FEATHER") {
                featherTarget.addSpecialDefense(
                  sign * 4,
                  featherTarget,
                  1,
                  crit
                )
              } else if (feather === "SWIFT_FEATHER") {
                featherTarget.addSpeed(sign * 10, featherTarget, 1, crit)
              } else if (feather === "PRETTY_FEATHER") {
                featherTarget.addLuck(sign * 10, featherTarget, 1, crit)
              }
            }, 1000)
          )
        } else {
          // No entity on cell, just show animation
          pokemon.broadcastAbility({
            positionX: cell.x,
            positionY: cell.y,
            skill: feather
          })
        }
      }
    }
  }
}

export class PowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const speedFactor: number =
      POWDER_ABILITY_PARAMS.speedReductionByStar[pokemon.stars - 1] ??
      POWDER_ABILITY_PARAMS.speedReductionByStar.at(-1)!
    const damage: number =
      POWDER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      POWDER_ABILITY_PARAMS.damageByStar.at(-1)!

    // Find the enemy with the highest SPEED
    const enemies = board
      .getCellsInRange(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.range,
        false
      )
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)
      .sort((a, b) => b.speed - a.speed)

    const enemyWithHighestSpeed = enemies[0] ?? target
    if (enemyWithHighestSpeed) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        enemyWithHighestSpeed.positionX,
        enemyWithHighestSpeed.positionY
      )
      for (const cell of cells) {
        pokemon.broadcastAbility({
          positionX: cell.x,
          positionY: cell.y
        })
        if (cell.value) {
          if (cell.value.team !== pokemon.team) {
            // Enemy: take damage and reduce SPEED
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            const speedNerf = max(cell.value.speed)(
              speedFactor *
                (1 + pokemon.ap / POWDER_ABILITY_PARAMS.apScalingDivisor) *
                (crit ? pokemon.critPower : 1)
            )
            cell.value.addSpeed(-speedNerf, pokemon, 0, false)
            cell.value.commands.push(
              new DelayedCommand(() => {
                cell.value?.addSpeed(speedNerf, pokemon, 0, false)
              }, POWDER_ABILITY_PARAMS.speedDebuffDurationMs)
            )
          }
        }
      }
    }
  }
}

export class LingeringAromaStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // For the next 5 seconds, every melee attack received by the user makes the attacker receive [10,20,SP] special damage (scales with AP) and lose 5 PP
    const duration = LINGERING_AROMA_ABILITY_PARAMS.durationMs
    const damage: number =
      LINGERING_AROMA_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      LINGERING_AROMA_ABILITY_PARAMS.damageByStar.at(-1)!
    const lingeringAromaEffect = new OnAttackReceivedEffect(
      ({ attacker, pokemon }) => {
        // Deal special damage to the attacker
        attacker.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
        // Reduce attacker's PP by 5
        attacker.addPP(
          -LINGERING_AROMA_ABILITY_PARAMS.ppLoss,
          pokemon,
          0,
          false
        )
      }
    )

    pokemon.effectsSet.add(lingeringAromaEffect)
    // Remove the effect after the duration
    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.effectsSet.delete(lingeringAromaEffect)
      }, duration)
    )
  }
}

export class RagingBullStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //Destroy barriers like PROTECT, REFLECT, MAGIC_BOUNCE while inflicting ARMOR_BREAK for 3 seconds, then deal [20,40,80,SP] SPECIAL to the target
    target.status.triggerArmorReduction(
      RAGING_BULL_ABILITY_PARAMS.armorReductionDurationMs,
      pokemon
    )
    target.status.reflectCooldown = 0
    target.status.reflect = false
    target.status.protectCooldown = 0
    target.status.protect = false
    target.status.magicBounce = false
    target.status.magicBounceCooldown = 0
    const damage: number =
      RAGING_BULL_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      RAGING_BULL_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ElectrifyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    // Give to your STRONGEST non-ELECTRIC ally ELECTRIC_FIELD and all the effects of active ELECTRIC synergy + [15,30,60,SP] SHIELD.
    super.process(pokemon, board, target, crit)
    const nonElectricAllies = board.cells.filter(
      (entity) =>
        entity &&
        entity.team === pokemon.team &&
        entity.id !== pokemon.id &&
        entity.types.has(Synergy.ELECTRIC) === false &&
        entity.status.electricField !== true
    ) as PokemonEntity[]
    const strongestAlly = getStrongestUnit(nonElectricAllies)
    const buffedUnit = strongestAlly ?? pokemon //  If no ally is found, self-cast instead.
    const shield =
      ELECTRIFY_ABILITY_PARAMS.shieldByStar[pokemon.stars - 1] ??
      ELECTRIFY_ABILITY_PARAMS.shieldByStar.at(-1)!
    buffedUnit.status.addElectricField(buffedUnit)
    buffedUnit.addShield(shield, pokemon, 1, crit)
    if (buffedUnit.types.has(Synergy.ELECTRIC) === false) {
      buffedUnit.types.add(Synergy.ELECTRIC)
      pokemon.simulation.applySynergyEffects(buffedUnit, Synergy.ELECTRIC)
      if (pokemon.player) {
        const nbCellBatteries = values(pokemon.player.items).filter(
          (item) => item === Item.CELL_BATTERY
        ).length
        if (nbCellBatteries > 0) {
          buffedUnit.addSpeed(2 * nbCellBatteries, pokemon, 0, false)
        }
      }
    }
  }
}

export class WaveSplashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // User shrouds itself in water, gaining [20,SP]% of its max HP as SHIELD, then slams into the target with its whole body to inflict [20,SP]% of its max HP as SPECIAL
    const shieldAmount = Math.round(
      pokemon.maxHP * WAVE_SPLASH_ABILITY_PARAMS.shieldRatio
    )
    pokemon.addShield(shieldAmount, pokemon, 1, crit)
    const damage = Math.round(
      pokemon.maxHP * WAVE_SPLASH_ABILITY_PARAMS.damageRatio
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class FocusPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.cooldown = FOCUS_PUNCH_ABILITY_PARAMS.cooldownMs
    pokemon.broadcastAbility({
      skill: "FOCUS_PUNCH_CHARGE",
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })
    pokemon.commands.push(
      new DelayedCommand(() => {
        if (target.hp <= 0) {
          pokemon.pp = pokemon.maxPP
          return
        }
        let farthestEmptyCell: Cell | null = null
        let blocked = false
        effectInOrientation(board, pokemon, target, (cell) => {
          if (cell.value && cell.value.id !== target.id) {
            blocked = true
          } else {
            farthestEmptyCell = cell
          }
        })
        pokemon.broadcastAbility({ skill: "FOCUS_PUNCH" })
        if (farthestEmptyCell != null && target.canBeMoved) {
          const targetX = target.positionX
          const targetY = target.positionY
          const willEject =
            !blocked &&
            !target.status.resurrection &&
            !target.status.magicBounce &&
            !target.status.protect
          if (willEject) {
            // eject from the board
            pokemon.broadcastAbility({ skill: "FOCUS_PUNCH_EJECT" })
            target.cooldown = 9999
            target.handleSpecialDamage(
              9999,
              board,
              AttackType.TRUE,
              pokemon,
              crit
            )
          } else {
            const { x, y } = farthestEmptyCell as Cell
            target.moveTo(x, y, board, true)
            const damage =
              FOCUS_PUNCH_ABILITY_PARAMS.atkMultiplier * pokemon.atk
            target.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
          pokemon.moveTo(targetX, targetY, board, true)
        }
      }, FOCUS_PUNCH_ABILITY_PARAMS.chargeDelayMs)
    )
  }
}

export class HyperBeamStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    pokemon.cooldown = HYPER_BEAM_ABILITY_PARAMS.cooldownMs
    pokemon.broadcastAbility({
      skill: "HYPER_BEAM_CHARGE",
      positionX: pokemon.positionX,
      positionY: pokemon.positionY
    })

    pokemon.commands.push(
      new DelayedCommand(() => {
        pokemon.broadcastAbility({ skill: "HYPER_BEAM" })
        const damage: number =
          HYPER_BEAM_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
          HYPER_BEAM_ABILITY_PARAMS.damageByStar.at(-1)!
        pokemon.broadcastAbility({
          skill: Ability.HYPER_BEAM,
          targetX: target.positionX,
          targetY: target.positionY
        })
        effectInLine(board, pokemon, target, (cell) => {
          if (cell.value != null && cell.value.team !== pokemon.team) {
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        })
        pokemon.status.triggerFatigue(
          HYPER_BEAM_ABILITY_PARAMS.fatigueDurationMs,
          pokemon
        )
      }, HYPER_BEAM_ABILITY_PARAMS.chargeDelayMs)
    )
  }
}

export class SkillSwapStrategy extends AbilityStrategy {
  copyable = SKILL_SWAP_ABILITY_PARAMS.copyable
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (AbilityStrategies[target.skill].copyable) {
      pokemon.skill = target.skill
      pokemon.maxPP = target.refToBoardPokemon
        ? target.refToBoardPokemon.maxPP
        : target.maxPP
      if (pokemon.refToBoardPokemon) {
        pokemon.refToBoardPokemon.skill = target.skill
      }
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    }
  }
}

export class JetPunchStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = JET_PUNCH_ABILITY_PARAMS.speedMultiplier * pokemon.speed
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export class ShadowForceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = SHADOW_FORCE_ABILITY_PARAMS.damage
    pokemon.index = PkmIndex[Pkm.ORIGIN_GIRATINA]
    pokemon.skill = Ability.SHADOW_CLAW
    pokemon.toMovingState()
    if (pokemon.player) {
      pokemon.player.pokemonsPlayed.add(Pkm.ORIGIN_GIRATINA)
    }

    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )
    }

    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      skill: Ability.SHADOW_FORCE
    })

    const adjacentEnemies = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)

    for (const enemy of adjacentEnemies) {
      if (enemy.status.protect) {
        enemy.status.protect = false
        enemy.status.protectCooldown = 0
      }
      if (enemy.status.reflect) {
        enemy.status.reflect = false
        enemy.status.reflectCooldown = 0
      }
      if (enemy.status.magicBounce) {
        enemy.status.magicBounce = false
        enemy.status.magicBounceCooldown = 0
      }
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    }
  }
}

export class ShadowClawStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const baseDamage =
      SHADOW_CLAW_ABILITY_PARAMS.baseDamageByStar[pokemon.stars - 1] ??
      SHADOW_CLAW_ABILITY_PARAMS.baseDamageByStar.at(-1)!
    const enemies = board
      .getCellsInFront(pokemon, target)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)
    const orientation = board.orientation(
      pokemon.positionX,
      pokemon.positionY,
      target.positionX,
      target.positionY,
      pokemon,
      target
    )
    pokemon.broadcastAbility({
      positionX: pokemon.positionX,
      positionY: pokemon.positionY,
      orientation: orientation
    })
    const damage =
      enemies.length === 1
        ? baseDamage * SHADOW_CLAW_ABILITY_PARAMS.singleTargetMultiplier
        : baseDamage
    let damageDone = 0
    for (const enemy of enemies) {
      const report = enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
      damageDone += report.takenDamage
    }
    pokemon.handleHeal(
      damageDone * SHADOW_CLAW_ABILITY_PARAMS.healRatio,
      pokemon,
      0,
      false
    )
  }
}

export class GlacialLanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const corner = board.getTeleportationCell(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.team
    )
    if (corner) {
      pokemon.moveTo(corner.x, corner.y, board, false)
    }
    pokemon.commands.push(
      new DelayedCommand(
        () => {
          const damage =
            GLACIAL_LANCE_ABILITY_PARAMS.atkMultiplier * pokemon.atk
          const farthestTarget =
            pokemon.state.getFarthestTarget(pokemon, board) ?? target
          let targetHit: PokemonEntity = farthestTarget

          const cells = board.getCellsBetween(
            pokemon.positionX,
            pokemon.positionY,
            farthestTarget.positionX,
            farthestTarget.positionY
          )
          for (const cell of cells) {
            if (cell.value && cell.value.team != pokemon.team) {
              targetHit = cell.value
              break
            }
          }

          pokemon.broadcastAbility({
            targetX: targetHit.positionX,
            targetY: targetHit.positionY
          })

          pokemon.commands.push(
            new DelayedCommand(() => {
              targetHit.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )

              board
                .getAdjacentCells(targetHit.positionX, targetHit.positionY)
                .forEach((cell) => {
                  if (cell.value && cell.value.team !== pokemon.team) {
                    cell.value.handleSpecialDamage(
                      damage * GLACIAL_LANCE_ABILITY_PARAMS.splashDamageRatio,
                      board,
                      AttackType.SPECIAL,
                      pokemon,
                      crit
                    )
                  }
                })
            }, GLACIAL_LANCE_ABILITY_PARAMS.impactDelayMs)
          )
        },
        corner
          ? Math.round(
              GLACIAL_LANCE_ABILITY_PARAMS.travelBaseMs / getMoveSpeed(pokemon)
            )
          : 0
      )
    )
  }
}

export class OrderUpStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = ORDER_UP_ABILITY_PARAMS.damage
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    if (pokemon.player) {
      const tatsugiriOnBoard = values(pokemon.player.board).find(
        (e) => e && getBaseAltForm(e.name) === Pkm.TATSUGIRI_CURLY
      )
      if (!tatsugiriOnBoard) {
        const form = [
          Pkm.TATSUGIRI_CURLY,
          Pkm.TATSUGIRI_DROOPY,
          Pkm.TATSUGIRI_STRETCHY
        ][pokemon.simulation.stageLevel % 3]
        pokemon.simulation.room.spawnOnBench(pokemon.player, form, "fishing")
      } else if (tatsugiriOnBoard.name === Pkm.TATSUGIRI_CURLY) {
        pokemon.addAttack(
          ORDER_UP_ABILITY_PARAMS.curlyAttackBuff,
          pokemon,
          1,
          crit
        )
      } else if (tatsugiriOnBoard.name === Pkm.TATSUGIRI_DROOPY) {
        pokemon.addDefense(
          ORDER_UP_ABILITY_PARAMS.droopyDefenseBuff,
          pokemon,
          1,
          crit
        )
      } else if (tatsugiriOnBoard.name === Pkm.TATSUGIRI_STRETCHY) {
        pokemon.addSpeed(
          ORDER_UP_ABILITY_PARAMS.stretchySpeedBuff,
          pokemon,
          1,
          crit
        )
      }
    }
  }
}

export class IceSpinnerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage: number =
      ICE_SPINNER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ICE_SPINNER_ABILITY_PARAMS.damageByStar.at(-1)!
    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )

    let delay = 0
    for (const cell of cells) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            targetX: cell.x,
            targetY: cell.y
          })
          board.clearBoardEffect(cell.x, cell.y, pokemon.simulation)
          if (cell.value && cell.value.team !== pokemon.team) {
            const orientation = board.orientation(
              pokemon.positionX,
              pokemon.positionY,
              cell.value.positionX,
              cell.value.positionY,
              pokemon,
              undefined
            )
            const knockbackCell = board.getKnockBackPlace(
              cell.value.positionX,
              cell.value.positionY,
              orientation
            )
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            if (knockbackCell) {
              cell.value.moveTo(knockbackCell.x, knockbackCell.y, board, true)
              cell.value.cooldown =
                ICE_SPINNER_ABILITY_PARAMS.knockbackCooldownMs
            }
          }
        }, delay)
      )
      delay += ICE_SPINNER_ABILITY_PARAMS.hitDelayMs
    }
  }
}

export class MountainGaleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage: number =
      MOUNTAIN_GALE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      MOUNTAIN_GALE_ABILITY_PARAMS.damageByStar.at(-1)!
    const targets: PokemonEntity[] = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team)
      .map((cell) => cell.value as PokemonEntity)
    if (targets.length === 0 || !targets.some((t) => t.id === target.id)) {
      targets.push(target)
    }

    const nbHits: number =
      MOUNTAIN_GALE_ABILITY_PARAMS.hitsByStar[pokemon.stars - 1] ??
      MOUNTAIN_GALE_ABILITY_PARAMS.hitsByStar.at(-1)!
    const nbBergmites =
      pokemon.count.ult === 0
        ? max(MaxTroopersPerPkm[pokemon.name] ?? 0)(
            [...pokemon.effectsSet.values()].find(
              (e) => e instanceof BergmiteOnBackEffect
            )?.stacks ?? 0
          )
        : 0
    for (let i = 0; i < nbHits + nbBergmites; i++) {
      const t = pickRandomIn(targets)
      pokemon.commands.push(
        new DelayedCommand(() => {
          t.status.triggerFlinch(
            MOUNTAIN_GALE_ABILITY_PARAMS.flinchDurationMs,
            pokemon
          )
          t.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          pokemon.broadcastAbility({
            targetX: t.positionX,
            targetY: t.positionY,
            delay: i >= nbHits ? i - nbHits : undefined
          })
        }, MOUNTAIN_GALE_ABILITY_PARAMS.hitDelayMs * i)
      )
    }
  }
}

export class TwineedleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Deals [25,50,80,SP] SPECIAL to the target twice. The first hit can crit by default, and the second hit has [50,LK]% chance to apply POISONNED for 4 seconds.
    const damage =
      TWINEEDLE_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      TWINEEDLE_ABILITY_PARAMS.damageByStar.at(-1)!
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      chance(pokemon.critChance / 100, pokemon)
    )
    pokemon.commands.push(
      new DelayedCommand(() => {
        target.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        if (chance(TWINEEDLE_ABILITY_PARAMS.poisonChance, pokemon)) {
          target.status.triggerPoison(
            TWINEEDLE_ABILITY_PARAMS.poisonDurationMs,
            target,
            pokemon
          )
        }
      }, TWINEEDLE_ABILITY_PARAMS.secondHitDelayMs)
    )
  }
}

export class RockWreckerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // inflict FLINCH for 2 seconds then [80,160,SP] SPECIAL. Then user gets FATIGUE for 4 seconds
    const damage =
      ROCK_WRECKER_ABILITY_PARAMS.damageByStar[pokemon.stars - 1] ??
      ROCK_WRECKER_ABILITY_PARAMS.damageByStar.at(-1)!
    target.status.triggerFlinch(
      ROCK_WRECKER_ABILITY_PARAMS.flinchDurationMs,
      pokemon
    )
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    pokemon.status.triggerFatigue(
      ROCK_WRECKER_ABILITY_PARAMS.fatigueDurationMs,
      pokemon
    )
  }
}

export * from "./hidden-power"

export const AbilityStrategies: { [key in Ability]: AbilityStrategy } = {
  [Ability.SONG_OF_DESIRE]: new SongOfDesireStrategy(),
  [Ability.CONFUSING_MIND]: new ConfusingMindStrategy(),
  [Ability.KNOWLEDGE_THIEF]: new KnowledgeThiefStrategy(),
  [Ability.WONDER_GUARD]: new WonderGuardStrategy(),
  [Ability.CRABHAMMER]: new CrabHammerStrategy(),
  [Ability.KING_SHIELD]: new KingShieldStrategy(),
  [Ability.U_TURN]: new UTurnStrategy(),
  [Ability.EXPLOSION]: new ExplosionStrategy(),
  [Ability.CHLOROBLAST]: new ChloroblastStrategy(),
  [Ability.NIGHTMARE]: new NightmareStrategy(),
  [Ability.CLANGOROUS_SOUL]: new ClangorousSoulStrategy(),
  [Ability.BONEMERANG]: new BonemerangStrategy(),
  [Ability.SHADOW_BONE]: new ShadowBoneStrategy(),
  [Ability.GROWL]: new GrowlStrategy(),
  [Ability.RELIC_SONG]: new RelicSongStrategy(),
  [Ability.FAIRY_WIND]: new FairyWindStrategy(),
  [Ability.DISARMING_VOICE]: new DisarmingVoiceStrategy(),
  [Ability.HIGH_JUMP_KICK]: new HighJumpKickStrategy(),
  [Ability.TROP_KICK]: new TropKickStrategy(),
  [Ability.GRASS_WHISTLE]: new GrassWhistleStrategy(),
  [Ability.TRI_ATTACK]: new TriAttackStrategy(),
  [Ability.ECHO]: new EchoStrategy(),
  [Ability.UPROAR]: new UproarStrategy(),
  [Ability.PETAL_DANCE]: new PetalDanceStrategy(),
  [Ability.HYPER_VOICE]: new HyperVoiceStrategy(),
  [Ability.SHADOW_CLONE]: new ShadowCloneStrategy(),
  [Ability.VOLT_SWITCH]: new VoltSwitchStrategy(),
  [Ability.NUZZLE]: new NuzzleStrategy(),
  [Ability.FIRE_BLAST]: new FireBlastStrategy(),
  [Ability.WHEEL_OF_FIRE]: new WheelOfFireStrategy(),
  [Ability.SEISMIC_TOSS]: new SeismicTossStrategy(),
  [Ability.GUILLOTINE]: new GuillotineStrategy(),
  [Ability.ROCK_SLIDE]: new RockSlideStrategy(),
  [Ability.FLAMETHROWER]: new FlameThrowerStrategy(),
  [Ability.THUNDER_SHOCK]: new ThunderShockStrategy(),
  [Ability.THUNDER]: new ThunderStrategy(),
  [Ability.HYDRO_PUMP]: new HydroPumpStrategy(),
  [Ability.DRACO_METEOR]: new DracoMeteorStrategy(),
  [Ability.BLAZE_KICK]: new BlazeKickStrategy(),
  [Ability.WISH]: new WishStrategy(),
  [Ability.LUNAR_BLESSING]: new LunarBlessingStrategy(),
  [Ability.MEDITATE]: new MeditateStrategy(),
  [Ability.IRON_DEFENSE]: new IronDefenseStrategy(),
  [Ability.DEFENSE_CURL]: new DefenseCurlStrategy(),
  [Ability.IRON_HEAD]: new IronHeadStrategy(),
  [Ability.METRONOME]: new MetronomeStrategy(),
  [Ability.SOAK]: new SoakStrategy(),
  [Ability.IRON_TAIL]: new IronTailStrategy(),
  [Ability.BLAST_BURN]: new BlastBurnStrategy(),
  [Ability.CHARGE]: new ChargeStrategy(),
  [Ability.DISCHARGE]: new DischargeStrategy(),
  [Ability.SHOCKWAVE]: new ShockwaveStrategy(),
  [Ability.BITE]: new BiteStrategy(),
  [Ability.DRAGON_TAIL]: new DragonTailStrategy(),
  [Ability.DRAGON_BREATH]: new DragonBreathStrategy(),
  [Ability.ICICLE_CRASH]: new IcicleCrashStrategy(),
  [Ability.INGRAIN]: new IngrainStrategy(),
  [Ability.TORMENT]: new TormentStrategy(),
  [Ability.STOMP]: new StompStrategy(),
  [Ability.HORN_DRILL]: new HornDrillStrategy(),
  [Ability.NIGHT_SLASH]: new NightSlashStrategy(),
  [Ability.KOWTOW_CLEAVE]: new KowtowCleaveStrategy(),
  [Ability.BUG_BUZZ]: new BugBuzzStrategy(),
  [Ability.STRING_SHOT]: new StringShotStrategy(),
  [Ability.ENTANGLING_THREAD]: new EntanglingThreadStrategy(),
  [Ability.VENOSHOCK]: new VenoshockStrategy(),
  [Ability.LEECH_LIFE]: new LeechLifeStrategy(),
  [Ability.HAPPY_HOUR]: new HappyHourStrategy(),
  [Ability.TELEPORT]: new TeleportStrategy(),
  [Ability.NASTY_PLOT]: new NastyPlotStrategy(),
  [Ability.THIEF]: new ThiefStrategy(),
  [Ability.STUN_SPORE]: new StunSporeStrategy(),
  [Ability.METEOR_MASH]: new MeteorMashStrategy(),
  [Ability.HURRICANE]: new HurricaneStrategy(),
  [Ability.SING]: new SingStrategy(),
  [Ability.CONFUSION]: new ConfusionStrategy(),
  [Ability.BLIZZARD]: new BlizzardStrategy(),
  [Ability.PROTECT]: new ProtectStrategy(),
  [Ability.OBSTRUCT]: new ObstructStrategy(),
  [Ability.TOXIC]: new ToxicStrategy(),
  [Ability.ORIGIN_PULSE]: new OriginPulseStrategy(),
  [Ability.SEED_FLARE]: new SeedFlareStrategy(),
  [Ability.HEAL_BLOCK]: new HealBlockStrategy(),
  [Ability.ROAR_OF_TIME]: new RoarOfTimeStrategy(),
  [Ability.ROCK_TOMB]: new RockTombStrategy(),
  [Ability.ROCK_SMASH]: new RockSmashStrategy(),
  [Ability.HEAD_SMASH]: new HeadSmashStrategy(),
  [Ability.DOUBLE_EDGE]: new DoubleEdgeStrategy(),
  [Ability.DEFAULT]: new AbilityStrategy(),
  [Ability.DIAMOND_STORM]: new DiamondStormStrategy(),
  [Ability.DRACO_ENERGY]: new DracoEnergyStrategy(),
  [Ability.DYNAMAX_CANNON]: new DynamaxCannonStrategy(),
  [Ability.DYNAMIC_PUNCH]: new DynamicPunchStrategy(),
  [Ability.ELECTRO_BOOST]: new ElectroBoostStrategy(),
  [Ability.ELECTRO_WEB]: new ElectroWebStrategy(),
  [Ability.MYSTICAL_FIRE]: new MysticalFireStrategy(),
  [Ability.FLAME_CHARGE]: new FlameChargeStrategy(),
  [Ability.LEECH_SEED]: new LeechSeedStrategy(),
  [Ability.LOCK_ON]: new LockOnStrategy(),
  [Ability.DISABLE]: new DisableStrategy(),
  [Ability.RAZOR_WIND]: new RazorWindStrategy(),
  [Ability.PRECIPICE_BLADES]: new PrecipiceBladesStrategy(),
  [Ability.SOFT_BOILED]: new SoftBoiledStrategy(),
  [Ability.ELECTRIC_SURGE]: new ElectricSurgeStrategy(),
  [Ability.PSYCHIC_SURGE]: new PsychicSurgeStrategy(),
  [Ability.MIND_BLOWN]: new MindBlownStrategy(),
  [Ability.PAYDAY]: new PaydayStrategy(),
  [Ability.PICKUP]: new PickupStrategy(),
  [Ability.BEAT_UP]: new BeatUpStrategy(),
  [Ability.BLUE_FLARE]: new BlueFlareStrategy(),
  [Ability.FUSION_BOLT]: new FusionBoltStrategy(),
  [Ability.AURORA_VEIL]: new AuroraVeilStrategy(),
  [Ability.AQUA_JET]: new AquaJetStrategy(),
  [Ability.JUDGEMENT]: new JudgementStrategy(),
  [Ability.CHATTER]: new ChatterStrategy(),
  [Ability.LIQUIDATION]: new LiquidationStrategy(),
  [Ability.STEAM_ERUPTION]: new SteamEruptionStrategy(),
  [Ability.APPLE_ACID]: new AppleAcidStrategy(),
  [Ability.SHADOW_BALL]: new ShadowBallStrategy(),
  [Ability.DIVE]: new DiveStrategy(),
  [Ability.SPIKY_SHIELD]: new SpikeArmorStrategy(),
  [Ability.FUTURE_SIGHT]: new FutureSightStrategy(),
  [Ability.FAKE_TEARS]: new FakeTearsStrategy(),
  [Ability.SPARKLING_ARIA]: new SparklingAriaStrategy(),
  [Ability.DRAGON_DARTS]: new DragonDartsStrategy(),
  [Ability.GRASSY_SURGE]: new GrassySurgeStrategy(),
  [Ability.MISTY_SURGE]: new MistySurgeStrategy(),
  [Ability.SKY_ATTACK]: new SkyAttackStrategy(),
  [Ability.SKY_ATTACK_SHADOW]: new SkyAttackShadowStrategy(),
  [Ability.ILLUSION]: new IllusionStrategy(),
  [Ability.SLUDGE]: new SludgeStrategy(),
  [Ability.SLUDGE_WAVE]: new SludgeWaveStrategy(),
  [Ability.AURORA_BEAM]: new AuroraBeamStrategy(),
  [Ability.AGILITY]: new AgilityStrategy(),
  [Ability.SPIRIT_SHACKLE]: new SpiritShackleStrategy(),
  [Ability.WATER_SHURIKEN]: new WaterShurikenStrategy(),
  [Ability.SHADOW_SNEAK]: new ShadowSneakStrategy(),
  [Ability.MACH_PUNCH]: new MachPunchStrategy(),
  [Ability.MEGA_PUNCH]: new MegaPunchStrategy(),
  [Ability.TRIPLE_KICK]: new TripleKickStrategy(),
  [Ability.MAWASHI_GERI]: new MawashiGeriStrategy(),
  [Ability.FORECAST]: new ForecastStrategy(),
  [Ability.SACRED_SWORD_GRASS]: new SacredSwordGrassStrategy(),
  [Ability.SACRED_SWORD_CAVERN]: new SacredSwordCavernStrategy(),
  [Ability.SACRED_SWORD_IRON]: new SacredSwordIronStrategy(),
  [Ability.SECRET_SWORD]: new SecretSwordStrategy(),
  [Ability.X_SCISSOR]: new XScissorStrategy(),
  [Ability.PLASMA_FIST]: new PlasmaFistStrategy(),
  [Ability.SPECTRAL_THIEF]: new SpectralThiefStrategy(),
  [Ability.GEOMANCY]: new GeomancyStrategy(),
  [Ability.DEATH_WING]: new DeathWingStrategy(),
  [Ability.SLACK_OFF]: new SlackOffStrategy(),
  [Ability.DARK_VOID]: new DarkVoidStrategy(),
  [Ability.OVERHEAT]: new OverheatStrategy(),
  [Ability.HYPNOSIS]: new HypnosisStrategy(),
  [Ability.MIMIC]: new MimicStrategy(),
  [Ability.HEX]: new HexStrategy(),
  [Ability.GROWTH]: new GrowthStrategy(),
  [Ability.HEAL_ORDER]: new HealOrderStrategy(),
  [Ability.SHELL_TRAP]: new ShellTrapStrategy(),
  [Ability.DIG]: new DigStrategy(),
  [Ability.FIRE_SPIN]: new FireSpinStrategy(),
  [Ability.SEARING_SHOT]: new SearingShotStrategy(),
  [Ability.PECK]: new PeckStrategy(),
  [Ability.SPLASH]: new SplashStrategy(),
  [Ability.COUNTER]: new CounterStrategy(),
  [Ability.COSMIC_POWER_MOON]: new CosmicPowerMoonStrategy(),
  [Ability.COSMIC_POWER_SUN]: new CosmicPowerSunStrategy(),
  [Ability.POISON_POWDER]: new PoisonPowderStrategy(),
  [Ability.SILVER_WIND]: new SilverWindStrategy(),
  [Ability.ICY_WIND]: new IcyWindStrategy(),
  [Ability.GIGATON_HAMMER]: new GigatonHammerStrategy(),
  [Ability.ACROBATICS]: new AcrobaticsStrategy(),
  [Ability.ABSORB]: new AbsorbStrategy(),
  [Ability.ROLLOUT]: new RolloutStrategy(),
  [Ability.ICE_BALL]: new IceBallStrategy(),
  [Ability.THRASH]: new ThrashStrategy(),
  [Ability.SOLAR_BEAM]: new SolarBeamStrategy(),
  [Ability.MAGMA_STORM]: new MagmaStormStrategy(),
  [Ability.SLASHING_CLAW]: new SlashingClawStrategy(),
  [Ability.ERUPTION]: new EruptionStrategy(),
  [Ability.MIST_BALL]: new MistBallStrategy(),
  [Ability.LUSTER_PURGE]: new LusterPurgeStrategy(),
  [Ability.MUD_BUBBLE]: new MudBubbleStrategy(),
  [Ability.LINK_CABLE]: new LinkCableStrategy(),
  [Ability.MAGIC_BOUNCE]: new MagicBounceStrategy(),
  [Ability.HIDDEN_POWER_A]: new HiddenPowerAStrategy(),
  [Ability.HIDDEN_POWER_B]: new HiddenPowerBStrategy(),
  [Ability.HIDDEN_POWER_C]: new HiddenPowerCStrategy(),
  [Ability.HIDDEN_POWER_D]: new HiddenPowerDStrategy(),
  [Ability.HIDDEN_POWER_E]: new HiddenPowerEStrategy(),
  [Ability.HIDDEN_POWER_F]: new HiddenPowerFStrategy(),
  [Ability.HIDDEN_POWER_G]: new HiddenPowerGStrategy(),
  [Ability.HIDDEN_POWER_H]: new HiddenPowerHStrategy(),
  [Ability.HIDDEN_POWER_I]: new HiddenPowerIStrategy(),
  [Ability.HIDDEN_POWER_J]: new HiddenPowerJStrategy(),
  [Ability.HIDDEN_POWER_K]: new HiddenPowerKStrategy(),
  [Ability.HIDDEN_POWER_L]: new HiddenPowerLStrategy(),
  [Ability.HIDDEN_POWER_M]: new HiddenPowerMStrategy(),
  [Ability.HIDDEN_POWER_N]: new HiddenPowerNStrategy(),
  [Ability.HIDDEN_POWER_O]: new HiddenPowerOStrategy(),
  [Ability.HIDDEN_POWER_P]: new HiddenPowerPStrategy(),
  [Ability.HIDDEN_POWER_Q]: new HiddenPowerQStrategy(),
  [Ability.HIDDEN_POWER_R]: new HiddenPowerRStrategy(),
  [Ability.HIDDEN_POWER_S]: new HiddenPowerSStrategy(),
  [Ability.HIDDEN_POWER_T]: new HiddenPowerTStrategy(),
  [Ability.HIDDEN_POWER_U]: new HiddenPowerUStrategy(),
  [Ability.HIDDEN_POWER_V]: new HiddenPowerVStrategy(),
  [Ability.HIDDEN_POWER_W]: new HiddenPowerWStrategy(),
  [Ability.HIDDEN_POWER_X]: new HiddenPowerXStrategy(),
  [Ability.HIDDEN_POWER_Y]: new HiddenPowerYStrategy(),
  [Ability.HIDDEN_POWER_Z]: new HiddenPowerZStrategy(),
  [Ability.HIDDEN_POWER_QM]: new HiddenPowerQMStrategy(),
  [Ability.HIDDEN_POWER_EM]: new HiddenPowerEMStrategy(),
  [Ability.POISON_JAB]: new PoisonJabStrategy(),
  [Ability.SHELL_SMASH]: new ShellSmashStrategy(),
  [Ability.HELPING_HAND]: new HelpingHandStrategy(),
  [Ability.ASTRAL_BARRAGE]: new AstralBarrageStrategy(),
  [Ability.WATERFALL]: new WaterfallStrategy(),
  [Ability.PYRO_BALL]: new PyroBallStrategy(),
  [Ability.WHIRLPOOL]: new WhirlpoolStrategy(),
  [Ability.SMOKE_SCREEN]: new SmokeScreenStrategy(),
  [Ability.PRESENT]: new PresentStrategy(),
  [Ability.LEAF_BLADE]: new LeafBladeStrategy(),
  [Ability.ANCHOR_SHOT]: new AnchorShotStrategy(),
  [Ability.SMOG]: new SmogStrategy(),
  [Ability.PSYCHIC]: new PsychicStrategy(),
  [Ability.PSYBEAM]: new PsybeamStrategy(),
  [Ability.MAGNET_RISE]: new MagnetRiseStrategy(),
  [Ability.ATTRACT]: new AttractStrategy(),
  [Ability.WATER_PULSE]: new WaterPulseStrategy(),
  [Ability.PLAY_ROUGH]: new PlayRoughStrategy(),
  [Ability.AERIAL_ACE]: new AerialAceStrategy(),
  [Ability.PARABOLIC_CHARGE]: new ParabolicChargeStrategy(),
  [Ability.SUPER_FANG]: new SuperFangStrategy(),
  [Ability.TEETER_DANCE]: new TeeterDanceStrategy(),
  [Ability.CLOSE_COMBAT]: new CloseCombatStrategy(),
  [Ability.ASSIST]: new AssistStrategy(),
  [Ability.FISSURE]: new FissureStrategy(),
  [Ability.ASSURANCE]: new AssuranceStrategy(),
  [Ability.AQUA_RING]: new AquaRingStrategy(),
  [Ability.POISON_GAS]: new PoisonGasStrategy(),
  [Ability.STRANGE_STEAM]: new StrangeSteamStrategy(),
  [Ability.BRAVE_BIRD]: new BraveBirdStrategy(),
  [Ability.MAGICAL_LEAF]: new MagicalLeafStrategy(),
  [Ability.STEALTH_ROCKS]: new StealthRocksStrategy(),
  [Ability.TAIL_GLOW]: new TailGlowStrategy(),
  [Ability.STRUGGLE_BUG]: new StruggleBugStrategy(),
  [Ability.PRISMATIC_LASER]: new PrismaticLaserStrategy(),
  [Ability.NATURAL_GIFT]: new NaturalGiftStrategy(),
  [Ability.NIGHT_SHADE]: new NightShadeStrategy(),
  [Ability.CHARGE_BEAM]: new ChargeBeamStrategy(),
  [Ability.POPULATION_BOMB]: new PopulationBombStrategy(),
  [Ability.SCREECH]: new ScreechStrategy(),
  [Ability.SAND_TOMB]: new SandTombStrategy(),
  [Ability.WHIRLWIND]: new WhirlwindStrategy(),
  [Ability.ACID_SPRAY]: new AcidSprayStrategy(),
  [Ability.UNBOUND]: new UnboundStrategy(),
  [Ability.HYPERSPACE_FURY]: new HyperspaceFuryStrategy(),
  [Ability.SNIPE_SHOT]: new SnipeShotStrategy(),
  [Ability.AIR_SLASH]: new AirSlashStrategy(),
  [Ability.EGG_BOMB]: new EggBombStrategy(),
  [Ability.BODY_SLAM]: new BodySlamStrategy(),
  [Ability.FLORAL_HEALING]: new FloralHealingStrategy(),
  [Ability.VINE_WHIP]: new VineWhipStrategy(),
  [Ability.BARB_BARRAGE]: new BarbBarrageStrategy(),
  [Ability.INFERNAL_PARADE]: new InfernalParadeStrategy(),
  [Ability.MAGIC_POWDER]: new MagicPowderStrategy(),
  [Ability.RETALIATE]: new RetaliateStrategy(),
  [Ability.SLASH]: new SlashStrategy(),
  [Ability.OUTRAGE]: new OutrageStrategy(),
  [Ability.LUNGE]: new LungeStrategy(),
  [Ability.KNOCK_OFF]: new KnockOffStrategy(),
  [Ability.FISHIOUS_REND]: new FishiousRendStrategy(),
  [Ability.RECOVER]: new RecoverStrategy(),
  [Ability.CURSE]: new CurseStrategy(),
  [Ability.GOLD_RUSH]: new GoldRushStrategy(),
  [Ability.MAKE_IT_RAIN]: new MakeItRainStrategy(),
  [Ability.TIME_TRAVEL]: new TimeTravelStrategy(),
  [Ability.POLTERGEIST]: new PoltergeistStrategy(),
  [Ability.CRUSH_GRIP]: new CrushGripStrategy(),
  [Ability.AURASPHERE]: new AuraSphereStrategy(),
  [Ability.SKETCH]: new SketchStrategy(),
  [Ability.OVERDRIVE]: new OverdriveStrategy(),
  [Ability.LOVELY_KISS]: new LovelyKissStrategy(),
  [Ability.TRANSFORM]: new TransformStrategy(),
  [Ability.PSYCHIC_FANGS]: new PsychicFangsStrategy(),
  [Ability.SHED_TAIL]: new ShedTailStrategy(),
  [Ability.SHIELDS_DOWN]: new ShieldsDownStrategy(),
  [Ability.SHIELDS_UP]: new ShieldsUpStrategy(),
  [Ability.SANDSEAR_STORM]: new SandsearStormStrategy(),
  [Ability.WILDBOLT_STORM]: new WildboltStormStrategy(),
  [Ability.BLEAKWIND_STORM]: new BleakwindStormStrategy(),
  [Ability.SPRINGTIDE_STORM]: new SpringtideStormStrategy(),
  [Ability.AURA_WHEEL]: new AuraWheelStrategy(),
  [Ability.LICK]: new LickStrategy(),
  [Ability.FURY_SWIPES]: new FurySwipesStrategy(),
  [Ability.TICKLE]: new TickleStrategy(),
  [Ability.AROMATHERAPY]: new AromatherapyStrategy(),
  [Ability.DETECT]: new DetectStrategy(),
  [Ability.SPACIAL_REND]: new SpacialRendStrategy(),
  [Ability.MULTI_ATTACK]: new MultiAttackStrategy(),
  [Ability.STICKY_WEB]: new StickyWebStrategy(),
  [Ability.ACCELEROCK]: new AccelerockStrategy(),
  [Ability.PETAL_BLIZZARD]: new PetalBlizzardStrategy(),
  [Ability.SUNSTEEL_STRIKE]: new SunsteelStrikeStrategy(),
  [Ability.MOONGEIST_BEAM]: new MoongeistBeamStrategy(),
  [Ability.MANTIS_BLADES]: new MantisBladesStrategy(),
  [Ability.FLEUR_CANNON]: new FleurCannonStrategy(),
  [Ability.DOOM_DESIRE]: new DoomDesireStrategy(),
  [Ability.SPIRIT_BREAK]: new SpiritBreakStrategy(),
  [Ability.SHEER_COLD]: new SheerColdStrategy(),
  [Ability.PSYCHO_BOOST]: new PsychoBoostStrategy(),
  [Ability.ZAP_CANNON]: new ZapCannonStrategy(),
  [Ability.EXTREME_SPEED]: new ExtremeSpeedStrategy(),
  [Ability.ICE_HAMMER]: new IceHammerStrategy(),
  [Ability.POLLEN_PUFF]: new PollenPuffStrategy(),
  [Ability.PSYSTRIKE]: new PsystrikeStrategy(),
  [Ability.FACADE]: new FacadeStrategy(),
  [Ability.DREAM_EATER]: new DreamEaterStrategy(),
  [Ability.SPARK]: new SparkStrategy(),
  [Ability.CRUNCH]: new CrunchStrategy(),
  [Ability.CROSS_POISON]: new CrossPoisonStrategy(),
  [Ability.SHELTER]: new ShelterStrategy(),
  [Ability.ACID_ARMOR]: new AcidArmorStrategy(),
  [Ability.FIRE_FANG]: new FireFangStrategy(),
  [Ability.ICE_FANG]: new IceFangStrategy(),
  [Ability.THUNDER_FANG]: new ThunderFangStrategy(),
  [Ability.TAIL_WHIP]: new TailWhipStrategy(),
  [Ability.PSYSHIELD_BASH]: new PsyshieldBashStrategy(),
  [Ability.QUIVER_DANCE]: new QuiverDanceStrategy(),
  [Ability.TORCH_SONG]: new TorchSongStrategy(),
  [Ability.POWER_WHIP]: new PowerWhipStrategy(),
  [Ability.DARK_HARVEST]: new DarkHarvestStrategy(),
  [Ability.PSYSHOCK]: new PsyShockStrategy(),
  [Ability.HEAVY_SLAM]: new HeavySlamStrategy(),
  [Ability.AQUA_TAIL]: new AquaTailStrategy(),
  [Ability.HAIL]: new HailStrategy(),
  [Ability.RAPID_SPIN]: new RapidSpinStrategy(),
  [Ability.BOUNCE]: new BounceStrategy(),
  [Ability.GUNK_SHOT]: new GunkShotStrategy(),
  [Ability.BLOOD_MOON]: new BloodMoonStrategy(),
  [Ability.TEA_TIME]: new TeaTimeStrategy(),
  [Ability.SPIKES]: new SpikesStrategy(),
  [Ability.SHADOW_PUNCH]: new ShadowPunchStrategy(),
  [Ability.MAGNET_BOMB]: new MagnetBombStrategy(),
  [Ability.MUDDY_WATER]: new MuddyWaterStrategy(),
  [Ability.ANCIENT_POWER]: new AncientPowerStrategy(),
  [Ability.MOON_DREAM]: new MoonDreamStrategy(),
  [Ability.STONE_AXE]: new StoneAxeStrategy(),
  [Ability.FLASH]: new FlashStrategy(),
  [Ability.ROCK_HEAD]: new RockHeadStrategy(),
  [Ability.TAKE_HEART]: new TakeHeartStrategy(),
  [Ability.HEART_SWAP]: new HeartSwapStrategy(),
  [Ability.CRUSH_CLAW]: new CrushClawStrategy(),
  [Ability.FIRE_LASH]: new FireLashStrategy(),
  [Ability.FAIRY_LOCK]: new FairyLockStrategy(),
  [Ability.FLYING_PRESS]: new FlyingPressStrategy(),
  [Ability.DRAIN_PUNCH]: new DrainPunchStrategy(),
  [Ability.GRAVITY]: new GravityStrategy(),
  [Ability.DIRE_CLAW]: new DireClawStrategy(),
  [Ability.FAKE_OUT]: new FakeOutStrategy(),
  [Ability.PURIFY]: new PurifyStrategy(),
  [Ability.FELL_STINGER]: new FellStingerStrategy(),
  [Ability.GULP_MISSILE]: new GulpMissileStrategy(),
  [Ability.SCHOOLING]: new SchoolingStrategy(),
  [Ability.DOUBLE_SHOCK]: new DoubleShockStrategy(),
  [Ability.PASTEL_VEIL]: new PastelVeilStrategy(),
  [Ability.CHARM]: new CharmStrategy(),
  [Ability.ENTRAINMENT]: new EntrainmentStrategy(),
  [Ability.OCTAZOOKA]: new OctazookaStrategy(),
  [Ability.PSYCHO_SHIFT]: new PsychoShiftStrategy(),
  [Ability.GLAIVE_RUSH]: new GlaiveRushStrategy(),
  [Ability.FOUL_PLAY]: new FoulPlayStrategy(),
  [Ability.DOUBLE_IRON_BASH]: new DoubleIronBashStrategy(),
  [Ability.STONE_EDGE]: new StoneEdgeStrategy(),
  [Ability.ROAR]: new RoarStrategy(),
  [Ability.INFESTATION]: new InfestationStrategy(),
  [Ability.IVY_CUDGEL]: new IvyCudgelStrategy(),
  [Ability.FORCE_PALM]: new ForcePalmStrategy(),
  [Ability.METAL_BURST]: new MetalBurstStrategy(),
  [Ability.THUNDER_CAGE]: new ThunderCageStrategy(),
  [Ability.HEADBUTT]: new HeadbuttStrategy(),
  [Ability.DIZZY_PUNCH]: new DizzyPunchStrategy(),
  [Ability.STEEL_WING]: new SteelWingStrategy(),
  [Ability.YAWN]: new YawnStrategy(),
  [Ability.FIERY_DANCE]: new FieryDanceStrategy(),
  [Ability.BIDE]: new BideStrategy(),
  [Ability.SHORE_UP]: new ShoreUpStrategy(),
  [Ability.POISON_STING]: new PoisonStingStrategy(),
  [Ability.TRANSE]: new TranseStrategy(),
  [Ability.GLACIATE]: new GlaciateStrategy(),
  [Ability.WOOD_HAMMER]: new WoodHammerStrategy(),
  [Ability.TRICK_OR_TREAT]: new TrickOrTreatStrategy(),
  [Ability.FREEZING_GLARE]: new FreezingGlareStrategy(),
  [Ability.THUNDEROUS_KICK]: new ThunderousKickStrategy(),
  [Ability.FIERY_WRATH]: new FieryWrathStrategy(),
  [Ability.VISE_GRIP]: new ViseGripStrategy(),
  [Ability.LAVA_PLUME]: new LavaPlumeStrategy(),
  [Ability.LANDS_WRATH]: new LandsWrathStrategy(),
  [Ability.THOUSAND_ARROWS]: new ThousandArrowsStrategy(),
  [Ability.CORE_ENFORCER]: new CoreEnforcerStrategy(),
  [Ability.BURN_UP]: new BurnUpStrategy(),
  [Ability.POWER_HUG]: new PowerHugStrategy(),
  [Ability.MORTAL_SPIN]: new MortalSpinStrategy(),
  [Ability.METAL_CLAW]: new MetalClawStrategy(),
  [Ability.FIRESTARTER]: new FirestarterStrategy(),
  [Ability.BONE_ARMOR]: new BoneArmorStrategy(),
  [Ability.TOPSY_TURVY]: new TopsyTurvyStrategy(),
  [Ability.RAGE]: new RageStrategy(),
  [Ability.BRICK_BREAK]: new BrickBreakStrategy(),
  [Ability.RETURN]: new ReturnStrategy(),
  [Ability.TAUNT]: new TauntStrategy(),
  [Ability.BULK_UP]: new BulkUpStrategy(),
  [Ability.CUT]: new CutStrategy(),
  [Ability.FLY]: new FlyStrategy(),
  [Ability.SURF]: new SurfStrategy(),
  [Ability.STRENGTH]: new StrengthStrategy(),
  [Ability.HARDEN]: new HardenStrategy(),
  [Ability.COLUMN_CRUSH]: new ColumnCrushStrategy(),
  [Ability.WONDER_ROOM]: new WonderRoomStrategy(),
  [Ability.DARK_LARIAT]: new DarkLariatStrategy(),
  [Ability.BOLT_BEAK]: new BoltBeakStrategy(),
  [Ability.FREEZE_DRY]: new FreezeDryStrategy(),
  [Ability.DRAGON_PULSE]: new DragonPulseStrategy(),
  [Ability.FROST_BREATH]: new FrostBreathStrategy(),
  [Ability.SALT_CURE]: new SaltCureStrategy(),
  [Ability.SPICY_EXTRACT]: new SpicyExtractStrategy(),
  [Ability.SWEET_SCENT]: new SweetScentStrategy(),
  [Ability.SWALLOW]: new SwallowStrategy(),
  [Ability.NUTRIENTS]: new NutrientsStrategy(),
  [Ability.SYRUP_BOMB]: new SyrupBombStrategy(),
  [Ability.GRAV_APPLE]: new GravAppleStrategy(),
  [Ability.FICKLE_BEAM]: new FickleBeamStrategy(),
  [Ability.DECORATE]: new DecorateStrategy(),
  [Ability.DRAGON_CLAW]: new DragonClawStrategy(),
  [Ability.TAILWIND]: new TailwindStrategy(),
  [Ability.HORN_ATTACK]: new HornAttackStrategy(),
  [Ability.RAZOR_LEAF]: new RazorLeafStrategy(),
  [Ability.MUD_SHOT]: new MudShotStrategy(),
  [Ability.MALIGNANT_CHAIN]: new MalignantChainStrategy(),
  [Ability.FILLET_AWAY]: new FilletAwayStrategy(),
  [Ability.ELECTRO_SHOT]: new ElectroShotStrategy(),
  [Ability.FLOWER_TRICK]: new FlowerTrickStrategy(),
  [Ability.SOLAR_BLADE]: new SolarBladeStrategy(),
  [Ability.SCALE_SHOT]: new ScaleShotStrategy(),
  [Ability.BULLDOZE]: new BulldozeStrategy(),
  [Ability.BITTER_BLADE]: new BitterBladeStrategy(),
  [Ability.ARMOR_CANNON]: new ArmorCannonStrategy(),
  [Ability.SUCTION_HEAL]: new SuctionHealStrategy(),
  [Ability.ROOST]: new RoostStrategy(),
  [Ability.BEHEMOTH_BLADE]: new BehemothBladeStrategy(),
  [Ability.HEAT_CRASH]: new HeatCrashStrategy(),
  [Ability.LASER_BLADE]: new LaserBladeStrategy(),
  [Ability.ICICLE_MISSILE]: new IcicleMissileStrategy(),
  [Ability.ARM_THRUST]: new ArmThrustStrategy(),
  [Ability.DRUM_BEATING]: new DrumBeatingStrategy(),
  [Ability.PSYCHO_CUT]: new PsychoCutStrategy(),
  [Ability.SURGING_STRIKES]: new SurgingStrikesStrategy(),
  [Ability.WICKED_BLOW]: new WickedBlowStrategy(),
  [Ability.VICTORY_DANCE]: new VictoryDanceStrategy(),
  [Ability.BOOMBURST]: new BoomBurstStrategy(),
  [Ability.FOLLOW_ME]: new FollowMeStrategy(),
  [Ability.AFTER_YOU]: new AfterYouStrategy(),
  [Ability.COTTON_SPORE]: new CottonSporeStrategy(),
  [Ability.TWIN_BEAM]: new TwinBeamStrategy(),
  [Ability.SWAGGER]: new SwaggerStrategy(),
  [Ability.ENCORE]: new EncoreStrategy(),
  [Ability.REFLECT]: new ReflectStrategy(),
  [Ability.STORED_POWER]: new StoredPowerStrategy(),
  [Ability.CHAIN_CRAZED]: new ChainCrazedStrategy(),
  [Ability.MIND_BEND]: new MindBendStrategy(),
  [Ability.COTTON_GUARD]: new CottonGuardStrategy(),
  [Ability.STEAMROLLER]: new SteamrollerStrategy(),
  [Ability.MAGNET_PULL]: new MagnetPullStrategy(),
  [Ability.SPIN_OUT]: new SpinOutStrategy(),
  [Ability.ULTRA_THRUSTERS]: new UltraThrustersStrategy(),
  [Ability.ELECTRO_BALL]: new ElectroBallStrategy(),
  [Ability.HORN_LEECH]: new HornLeechStrategy(),
  [Ability.DRILL_RUN]: new DrillRunStrategy(),
  [Ability.DRILL_PECK]: new DrillPeckStrategy(),
  [Ability.ROCK_ARTILLERY]: new RockArtilleryStrategy(),
  [Ability.ZING_ZAP]: new ZingZapStrategy(),
  [Ability.NO_RETREAT]: new NoRetreatStrategy(),
  [Ability.TACKLE]: new TackleStrategy(),
  [Ability.STATIC_SHOCK]: new StaticShockStrategy(),
  [Ability.SAND_SPIT]: new SandSpitStrategy(),
  [Ability.HYPER_DRILL]: new HyperDrillStrategy(),
  [Ability.TERRAIN_PULSE]: new TerrainPulseStrategy(),
  [Ability.AXE_KICK]: new AxeKickStrategy(),
  [Ability.EXPANDING_FORCE]: new ExpandingForceStrategy(),
  [Ability.STOCKPILE]: new StockpileStrategy(),
  [Ability.SPITE]: new SpiteStrategy(),
  [Ability.GRUDGE]: new GrudgeStrategy(),
  [Ability.JAW_LOCK]: new JawLockStrategy(),
  [Ability.LAST_RESPECTS]: new LastRespectsStrategy(),
  [Ability.OCTOLOCK]: new OctolockStrategy(),
  [Ability.BURNING_JEALOUSY]: new BurningJealousyStrategy(),
  [Ability.FIRST_IMPRESSION]: new FirstImpressionStrategy(),
  [Ability.BARED_FANGS]: new BaredFangsStrategy(),
  [Ability.GRUDGE_DIVE]: new GrudgeDiveStrategy(),
  [Ability.GEAR_GRIND]: new GearGrindStrategy(),
  [Ability.SOUL_TRAP]: new SoulTrapStrategy(),
  [Ability.WISE_YAWN]: new WiseYawnStrategy(),
  [Ability.EERIE_SPELL]: new EerieSpellStrategy(),
  [Ability.SHELL_SIDE_ARM]: new ShellSideArmStrategy(),
  [Ability.TRIPLE_DIVE]: new TripleDiveStrategy(),
  [Ability.MOONBLAST]: new MoonblastStrategy(),
  [Ability.HYDRO_STEAM]: new HydroSteamStrategy(),
  [Ability.CAVERNOUS_CHOMP]: new CavernousChompStrategy(),
  [Ability.PLASMA_FISSION]: new PlasmaFissionStrategy(),
  [Ability.SUPER_HEAT]: new SuperHeatStrategy(),
  [Ability.POWER_WASH]: new PowerWashStrategy(),
  [Ability.DEEP_FREEZE]: new DeepFreezeStrategy(),
  [Ability.PLASMA_TEMPEST]: new PlasmaTempestStrategy(),
  [Ability.TRIMMING_MOWER]: new TrimmingMowerStrategy(),
  [Ability.PLASMA_FLASH]: new PlasmaFlashStrategy(),
  [Ability.PUMMELING_PAYBACK]: new PummelingPaybackStrategy(),
  [Ability.VOLT_SURGE]: new VoltSurgeStrategy(),
  [Ability.SUPERCELL_SLAM]: new SupercellSlamStrategy(),
  [Ability.HIGH_HORSEPOWER]: new HighHorsepowerStrategy(),
  [Ability.CITY_SHUTTLE]: new CityShuttleStrategy(),
  [Ability.BULLET_PUNCH]: new BulletPunchStrategy(),
  [Ability.EAR_DIG]: new EarDigStrategy(),
  [Ability.POWDER_SNOW]: new PowderSnowStrategy(),
  [Ability.POWDER]: new PowderStrategy(),
  [Ability.LINGERING_AROMA]: new LingeringAromaStrategy(),
  [Ability.RAGING_BULL]: new RagingBullStrategy(),
  [Ability.ELECTRIFY]: new ElectrifyStrategy(),
  [Ability.HEADLONG_RUSH]: new HeadlongRushStrategy(),
  [Ability.WAVE_SPLASH]: new WaveSplashStrategy(),
  [Ability.TWISTER]: new TwisterStrategy(),
  [Ability.FOCUS_PUNCH]: new FocusPunchStrategy(),
  [Ability.HYPER_BEAM]: new HyperBeamStrategy(),
  [Ability.SKILL_SWAP]: new SkillSwapStrategy(),
  [Ability.JET_PUNCH]: new JetPunchStrategy(),
  [Ability.BANEFUL_BUNKER]: new BanefulBunkerStrategy(),
  [Ability.SHADOW_CLAW]: new ShadowClawStrategy(),
  [Ability.SHADOW_FORCE]: new ShadowForceStrategy(),
  [Ability.FEATHER_DANCE]: new FeatherDanceStrategy(),
  [Ability.GLACIAL_LANCE]: new GlacialLanceStrategy(),
  [Ability.ORDER_UP]: new OrderUpStrategy(),
  [Ability.ICE_SPINNER]: new IceSpinnerStrategy(),
  [Ability.CEASELESS_EDGE]: new CeaselessEdgeStrategy(),
  [Ability.MOUNTAIN_GALE]: new MountainGaleStrategy(),
  [Ability.TWINEEDLE]: new TwineedleStrategy(),
  [Ability.ROCK_WRECKER]: new RockWreckerStrategy()
}

export function castAbility(
  ability: Ability,
  pokemon: PokemonEntity,
  board: Board,
  target: PokemonEntity | null,
  canCrit = true,
  preventDefaultAnim = false
) {
  if (pokemon.canCast === false) return

  let crit = false
  const abilityStrategy = AbilityStrategies[ability]
  if (
    canCrit &&
    (pokemon.effects.has(EffectEnum.ABILITY_CRIT) ||
      abilityStrategy.canCritByDefault)
  ) {
    crit = chance(pokemon.critChance / 100, pokemon)
  }
  abilityStrategy.process(pokemon, board, target, crit, preventDefaultAnim)

  pokemon.getEffects(OnAbilityCastEffect).forEach((effect) => {
    effect.apply(pokemon, board, target, crit)
  })
}
