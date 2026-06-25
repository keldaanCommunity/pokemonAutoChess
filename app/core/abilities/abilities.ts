import { InimitableAbilities } from "../../config/game/abilities"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { PRECOMPUTED_POKEMONS_PER_RARITY } from "../../models/precomputed/precomputed-rarity"
import { Transfer } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { Rarity, Team } from "../../types/enum/Game"
import type { DisplayText } from "../../types/strings/DisplayText"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"
import { AbsorbStrategy } from "./absorb"
import { AccelerockStrategy } from "./accelerock"
import { AcidArmorStrategy } from "./acid-armor"
import { AcidSprayStrategy } from "./acid-spray"
import { AcrobaticsStrategy } from "./acrobatics"
import { AerialAceStrategy } from "./aerial-ace"
import { AfterYouStrategy } from "./after-you"
import { AgilityStrategy } from "./agility"
import { AirSlashStrategy } from "./air-slash"
import { AnchorShotStrategy } from "./anchor-shot"
import { AncientPowerStrategy } from "./ancient-power"
import { AppleAcidStrategy } from "./apple-acid"
import { AquaJetStrategy } from "./aqua-jet"
import { AquaRingStrategy } from "./aqua-ring"
import { AquaStepStrategy } from "./aqua-step"
import { AquaTailStrategy } from "./aqua-tail"
import { ArmThrustStrategy } from "./arm-thrust"
import { ArmorCannonStrategy } from "./armor-cannon"
import { AromatherapyStrategy } from "./aroma-therapy"
import { AssuranceStrategy } from "./assurance"
import { AstralBarrageStrategy } from "./astral-barrage"
import { AttackOrderStrategy } from "./attack-order"
import { AttractStrategy } from "./attract"
import { AuraSphereStrategy } from "./aura-sphere"
import { AuraWheelStrategy } from "./aura-wheel"
import { AuroraBeamStrategy } from "./aurora-beam"
import { AuroraVeilStrategy } from "./aurora-veil"
import { AxeKickStrategy } from "./axe-kick"
import { BanefulBunkerStrategy } from "./baneful-bunker"
import { BarbBarrageStrategy } from "./barb-barrage"
import { BaredFangsStrategy } from "./bared-fangs"
import { BeatUpStrategy } from "./beat-up"
import { BehemothBladeStrategy } from "./behemoth-blade"
import { BideStrategy } from "./bide"
import { BiteStrategy } from "./bite"
import { BitterBladeStrategy } from "./bitter-blade"
import { BlastBurnStrategy } from "./blast-burn"
import { BlazeKickStrategy } from "./blaze-kick"
import { BleakwindStormStrategy } from "./bleakwind-storm"
import { BlizzardStrategy } from "./blizzard"
import { BloodMoonStrategy } from "./blood-moon"
import { BlueFlareStrategy } from "./blue-flare"
import { BodySlamStrategy } from "./body-slam"
import { BoltBeakStrategy } from "./bolt-beak"
import { BoneArmorStrategy } from "./bone-armor"
import { BonemerangStrategy } from "./bonemerang"
import { BoomBurstStrategy } from "./boomburst"
import { BounceStrategy } from "./bounce"
import { BraveBirdStrategy } from "./brave-bird"
import { BrickBreakStrategy } from "./brick-break"
import { BugBiteStrategy } from "./bug-bite"
import { BugBuzzStrategy } from "./bug-buzz"
import { BulkUpStrategy } from "./bulk-up"
import { BulldozeStrategy } from "./bulldoze"
import { BulletPunchStrategy } from "./bullet-punch"
import { BurnUpStrategy } from "./burn-up"
import { BurningJealousyStrategy } from "./burning-jealousy"
import { CavernousChompStrategy } from "./cavernous-chomp"
import { CeaselessEdgeStrategy } from "./ceaseless-edge"
import { ChainCrazedStrategy } from "./chain-crazed"
import { ChargeStrategy } from "./charge"
import { ChargeBeamStrategy } from "./charge-beam"
import { CharmStrategy } from "./charm"
import { ChatterStrategy } from "./chatter"
import { ChloroblastStrategy } from "./chloroblast"
import { CityShuttleStrategy } from "./city-shuttle"
import { ClangorousSoulStrategy } from "./clangorous-soul"
import { CloseCombatStrategy } from "./close-combat"
import { CoilStrategy } from "./coil"
import { ColumnCrushStrategy } from "./column-crush"
import { ConfusingMindStrategy } from "./confusing-mind"
import { ConfusionStrategy } from "./confusion"
import { CoreEnforcerStrategy } from "./core-enforcer"
import { CosmicPowerMoonStrategy } from "./cosmic-power-moon"
import { CosmicPowerSunStrategy } from "./cosmic-power-sun"
import { CottonGuardStrategy } from "./cotton-guard"
import { CottonSporeStrategy } from "./cotton-spore"
import { CounterStrategy } from "./counter"
import { CrabHammerStrategy } from "./crab-hammer"
import { CrossPoisonStrategy } from "./cross-poison"
import { CrunchStrategy } from "./crunch"
import { CrushClawStrategy } from "./crush-claw"
import { CrushGripStrategy } from "./crush-grip"
import { CurseStrategy } from "./curse"
import { CutStrategy } from "./cut"
import { DarkHarvestStrategy } from "./dark-harvest"
import { DarkVoidStrategy } from "./dark-void"
import { DarkestLariatStrategy } from "./darkest-lariat"
import { DecorateStrategy } from "./decorate"
import { DeepFreezeStrategy } from "./deep-freeze"
import { DefendOrderStrategy } from "./defend-order"
import { DefenseCurlStrategy } from "./defense-curl"
import { DetectStrategy } from "./detect"
import { DiamondStormStrategy } from "./diamond-storm"
import { DigStrategy } from "./dig"
import { DireClawStrategy } from "./dire-claw"
import { DisableStrategy } from "./disable"
import { DisarmingVoiceStrategy } from "./disarming-voice"
import { DischargeStrategy } from "./discharge"
import { DiveStrategy } from "./dive"
import { DizzyPunchStrategy } from "./dizzy-punch"
import { DoomDesireStrategy } from "./doom-desire"
import { DoubleEdgeStrategy } from "./double-edge"
import { DoubleIronBashStrategy } from "./double-iron-bash"
import { DoubleShockStrategy } from "./double-shock"
import { DracoMeteorStrategy } from "./draco-meteor"
import { DragonBreathStrategy } from "./dragon-breath"
import { DragonClawStrategy } from "./dragon-claw"
import { DragonDartsStrategy } from "./dragon-darts"
import { DragonEnergyStrategy } from "./dragon-energy"
import { DragonPulseStrategy } from "./dragon-pulse"
import { DragonTailStrategy } from "./dragon-tail"
import { DrainPunchStrategy } from "./drain-punch"
import { DreamEaterStrategy } from "./dream-eater"
import { DrillPeckStrategy } from "./drill-peck"
import { DrillRunStrategy } from "./drill-run"
import { DrumBeatingStrategy } from "./drum-beating"
import { DynamaxCannonStrategy } from "./dynamax-cannon"
import { DynamicPunchStrategy } from "./dynamic-punch"
import { EarDigStrategy } from "./ear-dig"
import { EchoStrategy } from "./echo"
import { EerieSpellStrategy } from "./eerie-spell"
import { EggBombStrategy } from "./egg-bomb"
import { ElectricSurgeStrategy } from "./electric-surge"
import { ElectrifyStrategy } from "./electrify"
import { ElectroBallStrategy } from "./electro-ball"
import { ElectroShotStrategy } from "./electro-shot"
import { ElectroWebStrategy } from "./electro-web"
import { EntanglingThreadStrategy } from "./entangling-thread"
import { EntrainmentStrategy } from "./entrainment"
import { EruptionStrategy } from "./eruption"
import { ExpandingForceStrategy } from "./expanding-force"
import { explosionStrategy } from "./explosion"
import { ExtremeSpeedStrategy } from "./extreme-speed"
import { FacadeStrategy } from "./facade"
import { FairyLockStrategy } from "./fairy-lock"
import { FairyWindStrategy } from "./fairy-wind"
import { FakeOutStrategy } from "./fake-out"
import { FakeTearsStrategy } from "./fake-tears"
import { FeatherDanceStrategy } from "./feather-dance"
import { FellStingerStrategy } from "./fell-stinger"
import { FickleBeamStrategy } from "./fickle-beam"
import { FieryDanceStrategy } from "./fiery-dance"
import { FieryWrathStrategy } from "./fiery-wrath"
import { FilletAwayStrategy } from "./fillet-away"
import { FireBlastStrategy } from "./fire-blast"
import { FireFangStrategy } from "./fire-fang"
import { FireLashStrategy } from "./fire-lash"
import { FireSpinStrategy } from "./fire-spin"
import { FirestarterStrategy } from "./firestarter"
import { FirstImpressionStrategy } from "./first-impression"
import { FishiousRendStrategy } from "./fishious-rend"
import { FissureStrategy } from "./fissure"
import { FlameChargeStrategy } from "./flame-charge"
import { FlameThrowerStrategy } from "./flame-thrower"
import { FlashStrategy } from "./flash"
import { FleurCannonStrategy } from "./fleur-cannon"
import { FloralHealingStrategy } from "./floral-healing"
import { FlowerTrickStrategy } from "./flower-trick"
import { FlyStrategy } from "./fly"
import { FlyingPressStrategy } from "./flying-press"
import { FocusPunchStrategy } from "./focus-punch"
import { FollowMeStrategy } from "./follow-me"
import { ForcePalmStrategy } from "./force-palm"
import { ForecastStrategy } from "./forecast"
import { FoulPlayStrategy } from "./foul-play"
import { FreezeDryStrategy } from "./freeze-dry"
import { FreezingGlareStrategy } from "./freezing-glare"
import { FrostBreathStrategy } from "./frost-breath"
import { FurySwipesStrategy } from "./fury-swipes"
import { FusionBoltStrategy } from "./fusion-bolt"
import { FutureSightStrategy } from "./future-sight"
import { GearGrindStrategy } from "./gear-grind"
import { GeomancyStrategy } from "./geomancy"
import { GigatonHammerStrategy } from "./gigaton-hammer"
import { GlacialLanceStrategy } from "./glacial-lance"
import { GlaciateStrategy } from "./glaciate"
import { GlaiveRushStrategy } from "./glaive-rush"
import { GoldRushStrategy } from "./gold-rush"
import { GrassWhistleStrategy } from "./grass-whistle"
import { GrassySurgeStrategy } from "./grassy-surge"
import { GravAppleStrategy } from "./grav-apple"
import { GravityStrategy } from "./gravity"
import { GrowlStrategy } from "./growl"
import { GrowthStrategy } from "./growth"
import { GrudgeStrategy } from "./grudge"
import { GrudgeDiveStrategy } from "./grudge-dive"
import { GuillotineStrategy } from "./guillotine"
import { GulpMissileStrategy } from "./gulp-missile"
import { GunkShotStrategy } from "./gunk-shot"
import { HailStrategy } from "./hail"
import { HappyHourStrategy } from "./happy-hour"
import { HardenStrategy } from "./harden"
import { HeadSmashStrategy } from "./head-smash"
import { HeadbuttStrategy } from "./headbutt"
import { HeadlongRushStrategy } from "./headlong-rush"
import { HealBlockStrategy } from "./heal-block"
import { HealOrderStrategy } from "./heal-order"
import { HeartSwapStrategy } from "./heart-swap"
import { HeatCrashStrategy } from "./heat-crash"
import { HeavySlamStrategy } from "./heavy-slam"
import { HelpingHandStrategy } from "./helping-hand"
import { HexStrategy } from "./hex"
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
import { HighHorsepowerStrategy } from "./high-horsepower"
import { HighJumpKickStrategy } from "./high-jump-kick"
import { HornAttackStrategy } from "./horn-attack"
import { HornDrillStrategy } from "./horn-drill"
import { HornLeechStrategy } from "./horn-leech"
import { HurricaneStrategy } from "./hurricane"
import { HydroPumpStrategy } from "./hydro-pump"
import { HydroSteamStrategy } from "./hydro-steam"
import { HyperBeamStrategy } from "./hyper-beam"
import { HyperDrillStrategy } from "./hyper-drill"
import { HyperVoiceStrategy } from "./hyper-voice"
import { HyperspaceFuryStrategy } from "./hyperspace-fury"
import { HypnosisStrategy } from "./hypnosis"
import { IceBallStrategy } from "./ice-ball"
import { IceFangStrategy } from "./ice-fang"
import { IceHammerStrategy } from "./ice-hammer"
import { IceSpinnerStrategy } from "./ice-spinner"
import { IcicleCrashStrategy } from "./icicle-crash"
import { IcicleMissileStrategy } from "./icicle-missile"
import { IcyWindStrategy } from "./icy-wind"
import { IllusionStrategy } from "./illusion"
import { InfernalParadeStrategy } from "./infernal-parade"
import { InfestationStrategy } from "./infestation"
import { IngrainStrategy } from "./ingrain"
import { IronDefenseStrategy } from "./iron-defense"
import { IronHeadStrategy } from "./iron-head"
import { IronTailStrategy } from "./iron-tail"
import { IvyCudgelStrategy } from "./ivy-cudgel"
import { JawLockStrategy } from "./jaw-lock"
import { JetPunchStrategy } from "./jet-punch"
import { JudgementStrategy } from "./judgement"
import { KingShieldStrategy } from "./king-shield"
import { KnockOffStrategy } from "./knock-off"
import { KowtowCleaveStrategy } from "./kowtow-cleave"
import { LandsWrathStrategy } from "./lands-wrath"
import { LaserBladeStrategy } from "./laser-blade"
import { LastRespectsStrategy } from "./last-respects"
import { LavaPlumeStrategy } from "./lava-plume"
import { LeafBladeStrategy } from "./leaf-blade"
import { LeechLifeStrategy } from "./leech-life"
import { LeechSeedStrategy } from "./leech-seed"
import { LickStrategy } from "./lick"
import { LingeringAromaStrategy } from "./lingering-aroma"
import { LinkCableStrategy } from "./link-cable"
import { LiquidationStrategy } from "./liquidation"
import { LockOnStrategy } from "./lock-on"
import { LovelyKissStrategy } from "./lovely-kiss"
import { LunarBlessingStrategy } from "./lunar-blessing"
import { LungeStrategy } from "./lunge"
import { LusterPurgeStrategy } from "./luster-purge"
import { MachPunchStrategy } from "./mach-punch"
import { MagicBounceStrategy } from "./magic-bounce"
import { MagicPowderStrategy } from "./magic-powder"
import { MagicalLeafStrategy } from "./magical-leaf"
import { MagmaStormStrategy } from "./magma-storm"
import { MagnetBombStrategy } from "./magnet-bomb"
import { MagnetPullStrategy } from "./magnet-pull"
import { MagnetRiseStrategy } from "./magnet-rise"
import { MakeItRainStrategy } from "./make-it-rain"
import { MalignantChainStrategy } from "./malignant-chain"
import { MantisBladesStrategy } from "./mantis-blades"
import { MawashiGeriStrategy } from "./mawashi-geri"
import { meditateStrategy } from "./meditate"
import { MegaPunchStrategy } from "./mega-punch"
import { MetalBurstStrategy } from "./metal-burst"
import { MetalClawStrategy } from "./metal-claw"
import { MeteorMashStrategy } from "./meteor-mash"
import { MindBendStrategy } from "./mind-bend"
import { MindBlownStrategy } from "./mind-blown"
import { MistBallStrategy } from "./mist-ball"
import { MistySurgeStrategy } from "./misty-surge"
import { MoonDreamStrategy } from "./moon-dream"
import { MoonblastStrategy } from "./moonblast"
import { MoongeistBeamStrategy } from "./moongeist-beam"
import { MortalSpinStrategy } from "./mortal-spin"
import { MountainGaleStrategy } from "./mountain-gale"
import { MudBubbleStrategy } from "./mud-bubble"
import { MudShotStrategy } from "./mud-shot"
import { MuddyWaterStrategy } from "./muddy-water"
import { MultiAttackStrategy } from "./multi-attack"
import { MysticalFireStrategy } from "./mystical-fire"
import { NastyPlotStrategy } from "./nasty-plot"
import { NaturalGiftStrategy } from "./natural-gift"
import { NightShadeStrategy } from "./night-shade"
import { NightSlashStrategy } from "./night-slash"
import { NightmareStrategy } from "./nightmare"
import { NoRetreatStrategy } from "./no-retreat"
import { NutrientsStrategy } from "./nutrients"
import { NuzzleStrategy } from "./nuzzle"
import { OblivionWingStrategy } from "./oblivion-wing"
import { ObstructStrategy } from "./obstruct"
import { OctazookaStrategy } from "./octazooka"
import { OctolockStrategy } from "./octolock"
import { OrderUpStrategy } from "./order-up"
import { OriginPulseStrategy } from "./origin-pulse"
import { OutrageStrategy } from "./outrage"
import { OverdriveStrategy } from "./overdrive"
import { OverheatStrategy } from "./overheat"
import { ParabolicChargeStrategy } from "./parabolic-charge"
import { PastelVeilStrategy } from "./pastel-veil"
import { PaydayStrategy } from "./payday"
import { PeckStrategy } from "./peck"
import { PetalBlizzardStrategy } from "./petal-blizzard"
import { PetalDanceStrategy } from "./petal-dance"
import { PickupStrategy } from "./pickup"
import { PlasmaFissionStrategy } from "./plasma-fission"
import { PlasmaFistStrategy } from "./plasma-fist"
import { PlasmaFlashStrategy } from "./plasma-flash"
import { PlasmaTempestStrategy } from "./plasma-tempest"
import { PlayRoughStrategy } from "./play-rough"
import { PoisonGasStrategy } from "./poison-gas"
import { PoisonJabStrategy } from "./poison-jab"
import { PoisonPowderStrategy } from "./poison-powder"
import { PoisonStingStrategy } from "./poison-sting"
import { PollenPuffStrategy } from "./pollen-puff"
import { PoltergeistStrategy } from "./poltergeist"
import { PopulationBombStrategy } from "./population-bomb"
import { PowderStrategy } from "./powder"
import { PowderSnowStrategy } from "./powder-snow"
import { PowerHugStrategy } from "./power-hug"
import { PowerWashStrategy } from "./power-wash"
import { PowerWhipStrategy } from "./power-whip"
import { PrecipiceBladesStrategy } from "./precipice-blades"
import { PresentStrategy } from "./present"
import { PrismaticLaserStrategy } from "./prismatic-laser"
import { ProtectStrategy } from "./protect"
import { PsyShockStrategy } from "./psy-shock"
import { PsybeamStrategy } from "./psybeam"
import { PsychicStrategy } from "./psychic"
import { PsychicFangsStrategy } from "./psychic-fangs"
import { PsychicSurgeStrategy } from "./psychic-surge"
import { PsychoBoostStrategy } from "./psycho-boost"
import { PsychoCutStrategy } from "./psycho-cut"
import { PsychoShiftStrategy } from "./psycho-shift"
import { PsyshieldBashStrategy } from "./psyshield-bash"
import { PsystrikeStrategy } from "./psystrike"
import { PummelingPaybackStrategy } from "./pummeling-payback"
import { PurifyStrategy } from "./purify"
import { PyroBallStrategy } from "./pyro-ball"
import { QuiverDanceStrategy } from "./quiver-dance"
import { RageStrategy } from "./rage"
import { RagingBullStrategy } from "./raging-bull"
import { RapidSpinStrategy } from "./rapid-spin"
import { RazorLeafStrategy } from "./razor-leaf"
import { RazorWindStrategy } from "./razor-wind"
import { RecoverStrategy } from "./recover"
import { ReflectStrategy } from "./reflect"
import { RelicSongStrategy } from "./relic-song"
import { RetaliateStrategy } from "./retaliate"
import { ReturnStrategy } from "./return"
import { RoarStrategy } from "./roar"
import { RoarOfTimeStrategy } from "./roar-of-time"
import { RockArtilleryStrategy } from "./rock-artillery"
import { RockHeadStrategy } from "./rock-head"
import { RockSlideStrategy } from "./rock-slide"
import { RockSmashStrategy } from "./rock-smash"
import { RockTombStrategy } from "./rock-tomb"
import { RockWreckerStrategy } from "./rock-wrecker"
import { RolloutStrategy } from "./rollout"
import { RoostStrategy } from "./roost"
import { SacredSwordCavernStrategy } from "./sacred-sword-cavern"
import { SacredSwordGrassStrategy } from "./sacred-sword-grass"
import { SacredSwordIronStrategy } from "./sacred-sword-iron"
import { SaltCureStrategy } from "./salt-cure"
import { SandSpitStrategy } from "./sand-spit"
import { SandTombStrategy } from "./sand-tomb"
import { SandsearStormStrategy } from "./sandsear-storm"
import { ScaleShotStrategy } from "./scale-shot"
import { SchoolingStrategy } from "./schooling"
import { ScreechStrategy } from "./screech"
import { SearingShotStrategy } from "./searing-shot"
import { SecretSwordStrategy } from "./secret-sword"
import { SeedFlareStrategy } from "./seed-flare"
import { SeismicTossStrategy } from "./seismic-toss"
import { ShadowBallStrategy } from "./shadow-ball"
import { ShadowBoneStrategy } from "./shadow-bone"
import { ShadowClawStrategy } from "./shadow-claw"
import { ShadowCloneStrategy } from "./shadow-clone"
import { ShadowForceStrategy } from "./shadow-force"
import { ShadowPunchStrategy } from "./shadow-punch"
import { ShadowSneakStrategy } from "./shadow-sneak"
import { ShedTailStrategy } from "./shed-tail"
import { SheerColdStrategy } from "./sheer-cold"
import { ShellSideArmStrategy } from "./shell-side-arm"
import { ShellSmashStrategy } from "./shell-smash"
import { ShellTrapStrategy } from "./shell-trap"
import { ShelterStrategy } from "./shelter"
import { ShieldsDownStrategy } from "./shields-down"
import { ShieldsUpStrategy } from "./shields-up"
import { ShockwaveStrategy } from "./shockwave"
import { ShoreUpStrategy } from "./shore-up"
import { SilkTrapStrategy } from "./silk-trap"
import { SilverWindStrategy } from "./silver-wind"
import { SingStrategy } from "./sing"
import { SketchStrategy } from "./sketch"
import { SkitterSmackStrategy } from "./skitter-smack"
import { SkyAttackStrategy } from "./sky-attack"
import { SkyAttackShadowStrategy } from "./sky-attack-shadow"
import { SlackOffStrategy } from "./slack-off"
import { SlashStrategy } from "./slash"
import { SlashingClawStrategy } from "./slashing-claw"
import { SludgeStrategy } from "./sludge"
import { SludgeWaveStrategy } from "./sludge-wave"
import { SmogStrategy } from "./smog"
import { SmokeScreenStrategy } from "./smoke-screen"
import { SnipeShotStrategy } from "./snipe-shot"
import { SnoreStrategy } from "./snore"
import { SoakStrategy } from "./soak"
import { SoftBoiledStrategy } from "./soft-boiled"
import { SolarBeamStrategy } from "./solar-beam"
import { SolarBladeStrategy } from "./solar-blade"
import { SongOfDesireStrategy } from "./song-of-desire"
import { SoulTrapStrategy } from "./soul-trap"
import { SpacialRendStrategy } from "./spacial-rend"
import { SparkStrategy } from "./spark"
import { SparklingAriaStrategy } from "./sparkling-aria"
import { SpectralThiefStrategy } from "./spectral-thief"
import { SpicyExtractStrategy } from "./spicy-extract"
import { SpikesStrategy } from "./spikes"
import { SpikyShieldStrategy } from "./spiky-shield"
import { SpinOutStrategy } from "./spin-out"
import { SpiritBreakStrategy } from "./spirit-break"
import { SpiritShackleStrategy } from "./spirit-shackle"
import { SpiteStrategy } from "./spite"
import { SplashStrategy } from "./splash"
import { SpringtideStormStrategy } from "./springtide-storm"
import { StaticShockStrategy } from "./static-shock"
import { StealthRocksStrategy } from "./stealth-rocks"
import { SteamEruptionStrategy } from "./steam-eruption"
import { SteamrollerStrategy } from "./steamroller"
import { SteelWingStrategy } from "./steel-wing"
import { StickyWebStrategy } from "./sticky-web"
import { StockpileStrategy } from "./stockpile"
import { StompStrategy } from "./stomp"
import { StoneAxeStrategy } from "./stone-axe"
import { StoneEdgeStrategy } from "./stone-edge"
import { StoredPowerStrategy } from "./stored-power"
import { StrangeSteamStrategy } from "./strange-steam"
import { StrengthStrategy } from "./strength"
import { StringShotStrategy } from "./string-shot"
import { StruggleBugStrategy } from "./struggle-bug"
import { StuffCheeksStrategy } from "./stuff-cheeks"
import { StunSporeStrategy } from "./stun-spore"
import { SuctionHealStrategy } from "./suction-heal"
import { SunsteelStrikeStrategy } from "./sunsteel-strike"
import { SuperFangStrategy } from "./super-fang"
import { SuperHeatStrategy } from "./super-heat"
import { SupercellSlamStrategy } from "./supercell-slam"
import { SurfStrategy } from "./surf"
import { SurgingStrikesStrategy } from "./surging-strikes"
import { SwaggerStrategy } from "./swagger"
import { SwallowStrategy } from "./swallow"
import { SweetScentStrategy } from "./sweet-scent"
import { SyrupBombStrategy } from "./syrup-bomb"
import { TackleStrategy } from "./tackle"
import { TailGlowStrategy } from "./tail-glow"
import { TailWhipStrategy } from "./tail-whip"
import { TailwindStrategy } from "./tailwind"
import { TakeHeartStrategy } from "./take-heart"
import { TauntStrategy } from "./taunt"
import { TeaTimeStrategy } from "./tea-time"
import { TeeterDanceStrategy } from "./teeter-dance"
import { TeleportStrategy } from "./teleport"
import { TerrainPulseStrategy } from "./terrain-pulse"
import { ThiefStrategy } from "./thief"
import { ThousandArrowsStrategy } from "./thousand-arrows"
import { ThrashStrategy } from "./thrash"
import { ThunderStrategy } from "./thunder"
import { ThunderCageStrategy } from "./thunder-cage"
import { ThunderFangStrategy } from "./thunder-fang"
import { thunderShockStrategy } from "./thunder-shock"
import { ThunderousKickStrategy } from "./thunderous-kick"
import { TickleStrategy } from "./tickle"
import { TimeTravelStrategy } from "./time-travel"
import { TopsyTurvyStrategy } from "./topsy-turvy"
import { TorchSongStrategy } from "./torch-song"
import { TormentStrategy } from "./torment"
import { ToxicStrategy } from "./toxic"
import { TranseStrategy } from "./transe"
import { TransformStrategy } from "./transform"
import { TriAttackStrategy } from "./tri-attack"
import { TrickOrTreatStrategy } from "./trick-or-treat"
import { TrimmingMowerStrategy } from "./trimming-mower"
import { TripleDiveStrategy } from "./triple-dive"
import { TripleKickStrategy } from "./triple-kick"
import { TropKickStrategy } from "./trop-kick"
import { TwinBeamStrategy } from "./twin-beam"
import { TwineedleStrategy } from "./twineedle"
import { TwisterStrategy } from "./twister"
import { UTurnStrategy } from "./u-turn"
import { UltraThrustersStrategy } from "./ultra-thrusters"
import { UnboundStrategy } from "./unbound"
import { UproarStrategy } from "./uproar"
import { VenoshockStrategy } from "./venoshock"
import { VictoryDanceStrategy } from "./victory-dance"
import { VineWhipStrategy } from "./vine-whip"
import { ViseGripStrategy } from "./vise-grip"
import { VoltSurgeStrategy } from "./volt-surge"
import { VoltSwitchStrategy } from "./volt-switch"
import { WaterPulseStrategy } from "./water-pulse"
import { WaterShurikenStrategy } from "./water-shuriken"
import { WaterfallStrategy } from "./waterfall"
import { WaveSplashStrategy } from "./wave-splash"
import { WheelOfFireStrategy } from "./wheel-of-fire"
import { WhirlpoolStrategy } from "./whirlpool"
import { WhirlwindStrategy } from "./whirlwind"
import { WickedBlowStrategy } from "./wicked-blow"
import { WildboltStormStrategy } from "./wildbolt-storm"
import { WiseYawnStrategy } from "./wise-yawn"
import { WishStrategy } from "./wish"
import { WonderGuardStrategy } from "./wonder-guard"
import { WonderRoomStrategy } from "./wonder-room"
import { WoodHammerStrategy } from "./wood-hammer"
import { XScissorStrategy } from "./x-scissor"
import { YawnStrategy } from "./yawn"
import { ZapCannonStrategy } from "./zap-cannon"
import { ZingZapStrategy } from "./zing-zap"

export class AssistStrategy extends AbilityStrategy {
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
            !InimitableAbilities.includes(v.skill)
        )
        .map((v) => v?.skill)
    )
    if (skill) {
      pokemon.broadcastAbility({ skill })
      AbilityStrategies[skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}

export class EncoreStrategy extends AbilityStrategy {
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
      (ability) => InimitableAbilities.includes(ability) === false
    )
    if (lastAbilityUsed) {
      AbilityStrategies[lastAbilityUsed].process(pokemon, board, target, crit)
    }
  }
}

export class KnowledgeThiefStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (InimitableAbilities.includes(target.skill) === false) {
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
    if (pokemon.player && !pokemon.isGhostOpponent) {
      const xpGain = [1, 1, 1, 2, 3][pokemon.stars - 1] ?? 3
      pokemon.player.addExperience(xpGain)
    }
  }
}

export class MetronomeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const threshold = Math.pow(Math.random(), 1 + pokemon.luck / 100)
    let rarity = Rarity.COMMON
    if (threshold < 1 / 8) {
      rarity = Rarity.ULTRA
    } else if (threshold < 2 / 8) {
      rarity = Rarity.LEGENDARY
    } else if (threshold < 3 / 8) {
      rarity = Rarity.EPIC
    } else if (threshold < 4 / 8) {
      rarity = Rarity.UNIQUE
    } else if (threshold < 5 / 8) {
      rarity = Rarity.RARE
    } else if (threshold < 6 / 8) {
      rarity = Rarity.SPECIAL
    } else if (threshold < 7 / 8) {
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
      skillOptions.filter((s) => InimitableAbilities.includes(s) === false)
    )

    pokemon.broadcastAbility({ skill })
    AbilityStrategies[skill].process(pokemon, board, target, crit)

    pokemon.simulation.broadcastToSpectators(Transfer.DISPLAY_TEXT, {
      id: pokemon.simulation.id,
      text: `ability.${skill}` as DisplayText,
      x: pokemon.positionX,
      y: pokemon.positionY
    })
  }
}

export class MimicStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (InimitableAbilities.includes(target.skill) === false) {
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}

export class SkillSwapStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (InimitableAbilities.includes(target.skill) === false) {
      pokemon.skill = target.skill
      pokemon.maxPP = target.refToBoardPokemon
        ? target.refToBoardPokemon.maxPP
        : target.maxPP
      if (
        pokemon.refToBoardPokemon &&
        !(
          pokemon.refToBoardPokemon.skill === Ability.SKETCH &&
          pokemon.refToBoardPokemon.tm === Ability.DEFAULT
        )
      ) {
        pokemon.refToBoardPokemon.skill = target.skill
      }
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    }
  }
}

export const AbilityStrategies: { [key in Ability]: AbilityStrategy } = {
  [Ability.ABSORB]: new AbsorbStrategy(),
  [Ability.ACCELEROCK]: new AccelerockStrategy(),
  [Ability.ACID_ARMOR]: new AcidArmorStrategy(),
  [Ability.ACID_SPRAY]: new AcidSprayStrategy(),
  [Ability.ACROBATICS]: new AcrobaticsStrategy(),
  [Ability.AERIAL_ACE]: new AerialAceStrategy(),
  [Ability.AFTER_YOU]: new AfterYouStrategy(),
  [Ability.AGILITY]: new AgilityStrategy(),
  [Ability.AIR_SLASH]: new AirSlashStrategy(),
  [Ability.ANCHOR_SHOT]: new AnchorShotStrategy(),
  [Ability.ANCIENT_POWER]: new AncientPowerStrategy(),
  [Ability.APPLE_ACID]: new AppleAcidStrategy(),
  [Ability.AQUA_JET]: new AquaJetStrategy(),
  [Ability.AQUA_RING]: new AquaRingStrategy(),
  [Ability.AQUA_STEP]: new AquaStepStrategy(),
  [Ability.AQUA_TAIL]: new AquaTailStrategy(),
  [Ability.ARM_THRUST]: new ArmThrustStrategy(),
  [Ability.ARMOR_CANNON]: new ArmorCannonStrategy(),
  [Ability.AROMATHERAPY]: new AromatherapyStrategy(),
  [Ability.ASSIST]: new AssistStrategy(),
  [Ability.ASSURANCE]: new AssuranceStrategy(),
  [Ability.ASTRAL_BARRAGE]: new AstralBarrageStrategy(),
  [Ability.ATTACK_ORDER]: new AttackOrderStrategy(),
  [Ability.ATTRACT]: new AttractStrategy(),
  [Ability.AURA_WHEEL]: new AuraWheelStrategy(),
  [Ability.AURASPHERE]: new AuraSphereStrategy(),
  [Ability.AURORA_BEAM]: new AuroraBeamStrategy(),
  [Ability.AURORA_VEIL]: new AuroraVeilStrategy(),
  [Ability.AXE_KICK]: new AxeKickStrategy(),
  [Ability.BANEFUL_BUNKER]: new BanefulBunkerStrategy(),
  [Ability.BARB_BARRAGE]: new BarbBarrageStrategy(),
  [Ability.BARED_FANGS]: new BaredFangsStrategy(),
  [Ability.BEAT_UP]: new BeatUpStrategy(),
  [Ability.BEHEMOTH_BLADE]: new BehemothBladeStrategy(),
  [Ability.BIDE]: new BideStrategy(),
  [Ability.BITE]: new BiteStrategy(),
  [Ability.BITTER_BLADE]: new BitterBladeStrategy(),
  [Ability.BLAST_BURN]: new BlastBurnStrategy(),
  [Ability.BLAZE_KICK]: new BlazeKickStrategy(),
  [Ability.BLEAKWIND_STORM]: new BleakwindStormStrategy(),
  [Ability.BLIZZARD]: new BlizzardStrategy(),
  [Ability.BLOOD_MOON]: new BloodMoonStrategy(),
  [Ability.BLUE_FLARE]: new BlueFlareStrategy(),
  [Ability.BODY_SLAM]: new BodySlamStrategy(),
  [Ability.BOLT_BEAK]: new BoltBeakStrategy(),
  [Ability.BONE_ARMOR]: new BoneArmorStrategy(),
  [Ability.BONEMERANG]: new BonemerangStrategy(),
  [Ability.BOOMBURST]: new BoomBurstStrategy(),
  [Ability.BOUNCE]: new BounceStrategy(),
  [Ability.BRAVE_BIRD]: new BraveBirdStrategy(),
  [Ability.BRICK_BREAK]: new BrickBreakStrategy(),
  [Ability.BUG_BITE]: new BugBiteStrategy(),
  [Ability.BUG_BUZZ]: new BugBuzzStrategy(),
  [Ability.BULK_UP]: new BulkUpStrategy(),
  [Ability.BULLDOZE]: new BulldozeStrategy(),
  [Ability.BULLET_PUNCH]: new BulletPunchStrategy(),
  [Ability.BURN_UP]: new BurnUpStrategy(),
  [Ability.BURNING_JEALOUSY]: new BurningJealousyStrategy(),
  [Ability.CAVERNOUS_CHOMP]: new CavernousChompStrategy(),
  [Ability.CEASELESS_EDGE]: new CeaselessEdgeStrategy(),
  [Ability.CHAIN_CRAZED]: new ChainCrazedStrategy(),
  [Ability.CHARGE]: new ChargeStrategy(),
  [Ability.CHARGE_BEAM]: new ChargeBeamStrategy(),
  [Ability.CHARM]: new CharmStrategy(),
  [Ability.CHATTER]: new ChatterStrategy(),
  [Ability.CHLOROBLAST]: new ChloroblastStrategy(),
  [Ability.CITY_SHUTTLE]: new CityShuttleStrategy(),
  [Ability.CLANGOROUS_SOUL]: new ClangorousSoulStrategy(),
  [Ability.CLOSE_COMBAT]: new CloseCombatStrategy(),
  [Ability.COIL]: new CoilStrategy(),
  [Ability.COLUMN_CRUSH]: new ColumnCrushStrategy(),
  [Ability.CONFUSING_MIND]: new ConfusingMindStrategy(),
  [Ability.CONFUSION]: new ConfusionStrategy(),
  [Ability.CORE_ENFORCER]: new CoreEnforcerStrategy(),
  [Ability.COSMIC_POWER_MOON]: new CosmicPowerMoonStrategy(),
  [Ability.COSMIC_POWER_SUN]: new CosmicPowerSunStrategy(),
  [Ability.COTTON_GUARD]: new CottonGuardStrategy(),
  [Ability.COTTON_SPORE]: new CottonSporeStrategy(),
  [Ability.COUNTER]: new CounterStrategy(),
  [Ability.CRABHAMMER]: new CrabHammerStrategy(),
  [Ability.CROSS_POISON]: new CrossPoisonStrategy(),
  [Ability.CRUNCH]: new CrunchStrategy(),
  [Ability.CRUSH_CLAW]: new CrushClawStrategy(),
  [Ability.CRUSH_GRIP]: new CrushGripStrategy(),
  [Ability.CURSE]: new CurseStrategy(),
  [Ability.CUT]: new CutStrategy(),
  [Ability.DARK_HARVEST]: new DarkHarvestStrategy(),
  [Ability.DARKEST_LARIAT]: new DarkestLariatStrategy(),
  [Ability.DARK_VOID]: new DarkVoidStrategy(),
  [Ability.DECORATE]: new DecorateStrategy(),
  [Ability.DEEP_FREEZE]: new DeepFreezeStrategy(),
  [Ability.DEFAULT]: new AbilityStrategy(),
  [Ability.DEFEND_ORDER]: new DefendOrderStrategy(),
  [Ability.DEFENSE_CURL]: new DefenseCurlStrategy(),
  [Ability.DETECT]: new DetectStrategy(),
  [Ability.DIAMOND_STORM]: new DiamondStormStrategy(),
  [Ability.DIG]: new DigStrategy(),
  [Ability.DIRE_CLAW]: new DireClawStrategy(),
  [Ability.DISABLE]: new DisableStrategy(),
  [Ability.DISARMING_VOICE]: new DisarmingVoiceStrategy(),
  [Ability.DISCHARGE]: new DischargeStrategy(),
  [Ability.DIVE]: new DiveStrategy(),
  [Ability.DIZZY_PUNCH]: new DizzyPunchStrategy(),
  [Ability.DOOM_DESIRE]: new DoomDesireStrategy(),
  [Ability.DOUBLE_EDGE]: new DoubleEdgeStrategy(),
  [Ability.DOUBLE_IRON_BASH]: new DoubleIronBashStrategy(),
  [Ability.DOUBLE_SHOCK]: new DoubleShockStrategy(),
  [Ability.DRACO_METEOR]: new DracoMeteorStrategy(),
  [Ability.DRAGON_BREATH]: new DragonBreathStrategy(),
  [Ability.DRAGON_CLAW]: new DragonClawStrategy(),
  [Ability.DRAGON_DARTS]: new DragonDartsStrategy(),
  [Ability.DRAGON_ENERGY]: new DragonEnergyStrategy(),
  [Ability.DRAGON_PULSE]: new DragonPulseStrategy(),
  [Ability.DRAGON_TAIL]: new DragonTailStrategy(),
  [Ability.DRAIN_PUNCH]: new DrainPunchStrategy(),
  [Ability.DREAM_EATER]: new DreamEaterStrategy(),
  [Ability.DRILL_PECK]: new DrillPeckStrategy(),
  [Ability.DRILL_RUN]: new DrillRunStrategy(),
  [Ability.DRUM_BEATING]: new DrumBeatingStrategy(),
  [Ability.DYNAMAX_CANNON]: new DynamaxCannonStrategy(),
  [Ability.DYNAMIC_PUNCH]: new DynamicPunchStrategy(),
  [Ability.EAR_DIG]: new EarDigStrategy(),
  [Ability.ECHO]: new EchoStrategy(),
  [Ability.EERIE_SPELL]: new EerieSpellStrategy(),
  [Ability.EGG_BOMB]: new EggBombStrategy(),
  [Ability.ELECTRIC_SURGE]: new ElectricSurgeStrategy(),
  [Ability.ELECTRIFY]: new ElectrifyStrategy(),
  [Ability.ELECTRO_BALL]: new ElectroBallStrategy(),
  [Ability.ELECTRO_SHOT]: new ElectroShotStrategy(),
  [Ability.ELECTRO_WEB]: new ElectroWebStrategy(),
  [Ability.ENCORE]: new EncoreStrategy(),
  [Ability.ENTANGLING_THREAD]: new EntanglingThreadStrategy(),
  [Ability.ENTRAINMENT]: new EntrainmentStrategy(),
  [Ability.ERUPTION]: new EruptionStrategy(),
  [Ability.EXPANDING_FORCE]: new ExpandingForceStrategy(),
  [Ability.EXPLOSION]: explosionStrategy,
  [Ability.EXTREME_SPEED]: new ExtremeSpeedStrategy(),
  [Ability.FACADE]: new FacadeStrategy(),
  [Ability.FAIRY_LOCK]: new FairyLockStrategy(),
  [Ability.FAIRY_WIND]: new FairyWindStrategy(),
  [Ability.FAKE_OUT]: new FakeOutStrategy(),
  [Ability.FAKE_TEARS]: new FakeTearsStrategy(),
  [Ability.FEATHER_DANCE]: new FeatherDanceStrategy(),
  [Ability.FELL_STINGER]: new FellStingerStrategy(),
  [Ability.FICKLE_BEAM]: new FickleBeamStrategy(),
  [Ability.FIERY_DANCE]: new FieryDanceStrategy(),
  [Ability.FIERY_WRATH]: new FieryWrathStrategy(),
  [Ability.FILLET_AWAY]: new FilletAwayStrategy(),
  [Ability.FIRE_BLAST]: new FireBlastStrategy(),
  [Ability.FIRE_FANG]: new FireFangStrategy(),
  [Ability.FIRE_LASH]: new FireLashStrategy(),
  [Ability.FIRE_SPIN]: new FireSpinStrategy(),
  [Ability.FIRESTARTER]: new FirestarterStrategy(),
  [Ability.FIRST_IMPRESSION]: new FirstImpressionStrategy(),
  [Ability.FISHIOUS_REND]: new FishiousRendStrategy(),
  [Ability.FISSURE]: new FissureStrategy(),
  [Ability.FLAME_CHARGE]: new FlameChargeStrategy(),
  [Ability.FLAMETHROWER]: new FlameThrowerStrategy(),
  [Ability.FLASH]: new FlashStrategy(),
  [Ability.FLEUR_CANNON]: new FleurCannonStrategy(),
  [Ability.FLORAL_HEALING]: new FloralHealingStrategy(),
  [Ability.FLOWER_TRICK]: new FlowerTrickStrategy(),
  [Ability.FLY]: new FlyStrategy(),
  [Ability.FLYING_PRESS]: new FlyingPressStrategy(),
  [Ability.FOCUS_PUNCH]: new FocusPunchStrategy(),
  [Ability.FOLLOW_ME]: new FollowMeStrategy(),
  [Ability.FORCE_PALM]: new ForcePalmStrategy(),
  [Ability.FORECAST]: new ForecastStrategy(),
  [Ability.FOUL_PLAY]: new FoulPlayStrategy(),
  [Ability.FREEZE_DRY]: new FreezeDryStrategy(),
  [Ability.FREEZING_GLARE]: new FreezingGlareStrategy(),
  [Ability.FROST_BREATH]: new FrostBreathStrategy(),
  [Ability.FURY_SWIPES]: new FurySwipesStrategy(),
  [Ability.FUSION_BOLT]: new FusionBoltStrategy(),
  [Ability.FUTURE_SIGHT]: new FutureSightStrategy(),
  [Ability.GEAR_GRIND]: new GearGrindStrategy(),
  [Ability.GEOMANCY]: new GeomancyStrategy(),
  [Ability.GIGATON_HAMMER]: new GigatonHammerStrategy(),
  [Ability.GLACIAL_LANCE]: new GlacialLanceStrategy(),
  [Ability.GLACIATE]: new GlaciateStrategy(),
  [Ability.GLAIVE_RUSH]: new GlaiveRushStrategy(),
  [Ability.GOLD_RUSH]: new GoldRushStrategy(),
  [Ability.GRASS_WHISTLE]: new GrassWhistleStrategy(),
  [Ability.GRASSY_SURGE]: new GrassySurgeStrategy(),
  [Ability.GRAV_APPLE]: new GravAppleStrategy(),
  [Ability.GRAVITY]: new GravityStrategy(),
  [Ability.GROWL]: new GrowlStrategy(),
  [Ability.GROWTH]: new GrowthStrategy(),
  [Ability.GRUDGE]: new GrudgeStrategy(),
  [Ability.GRUDGE_DIVE]: new GrudgeDiveStrategy(),
  [Ability.GUILLOTINE]: new GuillotineStrategy(),
  [Ability.GULP_MISSILE]: new GulpMissileStrategy(),
  [Ability.GUNK_SHOT]: new GunkShotStrategy(),
  [Ability.HAIL]: new HailStrategy(),
  [Ability.HAPPY_HOUR]: new HappyHourStrategy(),
  [Ability.HARDEN]: new HardenStrategy(),
  [Ability.HEAD_SMASH]: new HeadSmashStrategy(),
  [Ability.HEADBUTT]: new HeadbuttStrategy(),
  [Ability.HEADLONG_RUSH]: new HeadlongRushStrategy(),
  [Ability.HEAL_BLOCK]: new HealBlockStrategy(),
  [Ability.HEAL_ORDER]: new HealOrderStrategy(),
  [Ability.HEART_SWAP]: new HeartSwapStrategy(),
  [Ability.HEAT_CRASH]: new HeatCrashStrategy(),
  [Ability.HEAVY_SLAM]: new HeavySlamStrategy(),
  [Ability.HELPING_HAND]: new HelpingHandStrategy(),
  [Ability.HEX]: new HexStrategy(),
  [Ability.HIDDEN_POWER_A]: new HiddenPowerAStrategy(),
  [Ability.HIDDEN_POWER_B]: new HiddenPowerBStrategy(),
  [Ability.HIDDEN_POWER_C]: new HiddenPowerCStrategy(),
  [Ability.HIDDEN_POWER_D]: new HiddenPowerDStrategy(),
  [Ability.HIDDEN_POWER_E]: new HiddenPowerEStrategy(),
  [Ability.HIDDEN_POWER_EM]: new HiddenPowerEMStrategy(),
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
  [Ability.HIDDEN_POWER_QM]: new HiddenPowerQMStrategy(),
  [Ability.HIDDEN_POWER_R]: new HiddenPowerRStrategy(),
  [Ability.HIDDEN_POWER_S]: new HiddenPowerSStrategy(),
  [Ability.HIDDEN_POWER_T]: new HiddenPowerTStrategy(),
  [Ability.HIDDEN_POWER_U]: new HiddenPowerUStrategy(),
  [Ability.HIDDEN_POWER_V]: new HiddenPowerVStrategy(),
  [Ability.HIDDEN_POWER_W]: new HiddenPowerWStrategy(),
  [Ability.HIDDEN_POWER_X]: new HiddenPowerXStrategy(),
  [Ability.HIDDEN_POWER_Y]: new HiddenPowerYStrategy(),
  [Ability.HIDDEN_POWER_Z]: new HiddenPowerZStrategy(),
  [Ability.HIGH_HORSEPOWER]: new HighHorsepowerStrategy(),
  [Ability.HIGH_JUMP_KICK]: new HighJumpKickStrategy(),
  [Ability.HORN_ATTACK]: new HornAttackStrategy(),
  [Ability.HORN_DRILL]: new HornDrillStrategy(),
  [Ability.HORN_LEECH]: new HornLeechStrategy(),
  [Ability.HURRICANE]: new HurricaneStrategy(),
  [Ability.HYDRO_PUMP]: new HydroPumpStrategy(),
  [Ability.HYDRO_STEAM]: new HydroSteamStrategy(),
  [Ability.HYPER_BEAM]: new HyperBeamStrategy(),
  [Ability.HYPER_DRILL]: new HyperDrillStrategy(),
  [Ability.HYPER_VOICE]: new HyperVoiceStrategy(),
  [Ability.HYPERSPACE_FURY]: new HyperspaceFuryStrategy(),
  [Ability.HYPNOSIS]: new HypnosisStrategy(),
  [Ability.ICE_BALL]: new IceBallStrategy(),
  [Ability.ICE_FANG]: new IceFangStrategy(),
  [Ability.ICE_HAMMER]: new IceHammerStrategy(),
  [Ability.ICE_SPINNER]: new IceSpinnerStrategy(),
  [Ability.ICICLE_CRASH]: new IcicleCrashStrategy(),
  [Ability.ICICLE_MISSILE]: new IcicleMissileStrategy(),
  [Ability.ICY_WIND]: new IcyWindStrategy(),
  [Ability.ILLUSION]: new IllusionStrategy(),
  [Ability.INFERNAL_PARADE]: new InfernalParadeStrategy(),
  [Ability.INFESTATION]: new InfestationStrategy(),
  [Ability.INGRAIN]: new IngrainStrategy(),
  [Ability.IRON_DEFENSE]: new IronDefenseStrategy(),
  [Ability.IRON_HEAD]: new IronHeadStrategy(),
  [Ability.IRON_TAIL]: new IronTailStrategy(),
  [Ability.IVY_CUDGEL]: new IvyCudgelStrategy(),
  [Ability.JAW_LOCK]: new JawLockStrategy(),
  [Ability.JET_PUNCH]: new JetPunchStrategy(),
  [Ability.JUDGEMENT]: new JudgementStrategy(),
  [Ability.KING_SHIELD]: new KingShieldStrategy(),
  [Ability.KNOCK_OFF]: new KnockOffStrategy(),
  [Ability.KNOWLEDGE_THIEF]: new KnowledgeThiefStrategy(),
  [Ability.KOWTOW_CLEAVE]: new KowtowCleaveStrategy(),
  [Ability.LANDS_WRATH]: new LandsWrathStrategy(),
  [Ability.LASER_BLADE]: new LaserBladeStrategy(),
  [Ability.LAST_RESPECTS]: new LastRespectsStrategy(),
  [Ability.LAVA_PLUME]: new LavaPlumeStrategy(),
  [Ability.LEAF_BLADE]: new LeafBladeStrategy(),
  [Ability.LEECH_LIFE]: new LeechLifeStrategy(),
  [Ability.LEECH_SEED]: new LeechSeedStrategy(),
  [Ability.LICK]: new LickStrategy(),
  [Ability.LINGERING_AROMA]: new LingeringAromaStrategy(),
  [Ability.LINK_CABLE]: new LinkCableStrategy(),
  [Ability.LIQUIDATION]: new LiquidationStrategy(),
  [Ability.LOCK_ON]: new LockOnStrategy(),
  [Ability.LOVELY_KISS]: new LovelyKissStrategy(),
  [Ability.LUNAR_BLESSING]: new LunarBlessingStrategy(),
  [Ability.LUNGE]: new LungeStrategy(),
  [Ability.LUSTER_PURGE]: new LusterPurgeStrategy(),
  [Ability.MACH_PUNCH]: new MachPunchStrategy(),
  [Ability.MAGIC_BOUNCE]: new MagicBounceStrategy(),
  [Ability.MAGIC_POWDER]: new MagicPowderStrategy(),
  [Ability.MAGICAL_LEAF]: new MagicalLeafStrategy(),
  [Ability.MAGMA_STORM]: new MagmaStormStrategy(),
  [Ability.MAGNET_BOMB]: new MagnetBombStrategy(),
  [Ability.MAGNET_PULL]: new MagnetPullStrategy(),
  [Ability.MAGNET_RISE]: new MagnetRiseStrategy(),
  [Ability.MAKE_IT_RAIN]: new MakeItRainStrategy(),
  [Ability.MALIGNANT_CHAIN]: new MalignantChainStrategy(),
  [Ability.MANTIS_BLADES]: new MantisBladesStrategy(),
  [Ability.MAWASHI_GERI]: new MawashiGeriStrategy(),
  [Ability.MEDITATE]: meditateStrategy,
  [Ability.MEGA_PUNCH]: new MegaPunchStrategy(),
  [Ability.METAL_BURST]: new MetalBurstStrategy(),
  [Ability.METAL_CLAW]: new MetalClawStrategy(),
  [Ability.METEOR_MASH]: new MeteorMashStrategy(),
  [Ability.METRONOME]: new MetronomeStrategy(),
  [Ability.MIMIC]: new MimicStrategy(),
  [Ability.MIND_BEND]: new MindBendStrategy(),
  [Ability.MIND_BLOWN]: new MindBlownStrategy(),
  [Ability.MIST_BALL]: new MistBallStrategy(),
  [Ability.MISTY_SURGE]: new MistySurgeStrategy(),
  [Ability.MOON_DREAM]: new MoonDreamStrategy(),
  [Ability.MOONBLAST]: new MoonblastStrategy(),
  [Ability.MOONGEIST_BEAM]: new MoongeistBeamStrategy(),
  [Ability.MORTAL_SPIN]: new MortalSpinStrategy(),
  [Ability.MOUNTAIN_GALE]: new MountainGaleStrategy(),
  [Ability.MUD_BUBBLE]: new MudBubbleStrategy(),
  [Ability.MUD_SHOT]: new MudShotStrategy(),
  [Ability.MUDDY_WATER]: new MuddyWaterStrategy(),
  [Ability.MULTI_ATTACK]: new MultiAttackStrategy(),
  [Ability.MYSTICAL_FIRE]: new MysticalFireStrategy(),
  [Ability.NASTY_PLOT]: new NastyPlotStrategy(),
  [Ability.NATURAL_GIFT]: new NaturalGiftStrategy(),
  [Ability.NIGHT_SHADE]: new NightShadeStrategy(),
  [Ability.NIGHT_SLASH]: new NightSlashStrategy(),
  [Ability.NIGHTMARE]: new NightmareStrategy(),
  [Ability.NO_RETREAT]: new NoRetreatStrategy(),
  [Ability.NUTRIENTS]: new NutrientsStrategy(),
  [Ability.NUZZLE]: new NuzzleStrategy(),
  [Ability.OBLIVION_WING]: new OblivionWingStrategy(),
  [Ability.OBSTRUCT]: new ObstructStrategy(),
  [Ability.OCTAZOOKA]: new OctazookaStrategy(),
  [Ability.OCTOLOCK]: new OctolockStrategy(),
  [Ability.ORDER_UP]: new OrderUpStrategy(),
  [Ability.ORIGIN_PULSE]: new OriginPulseStrategy(),
  [Ability.OUTRAGE]: new OutrageStrategy(),
  [Ability.OVERDRIVE]: new OverdriveStrategy(),
  [Ability.OVERHEAT]: new OverheatStrategy(),
  [Ability.PARABOLIC_CHARGE]: new ParabolicChargeStrategy(),
  [Ability.PASTEL_VEIL]: new PastelVeilStrategy(),
  [Ability.PAYDAY]: new PaydayStrategy(),
  [Ability.PECK]: new PeckStrategy(),
  [Ability.PETAL_BLIZZARD]: new PetalBlizzardStrategy(),
  [Ability.PETAL_DANCE]: new PetalDanceStrategy(),
  [Ability.PICKUP]: new PickupStrategy(),
  [Ability.PLASMA_FISSION]: new PlasmaFissionStrategy(),
  [Ability.PLASMA_FIST]: new PlasmaFistStrategy(),
  [Ability.PLASMA_FLASH]: new PlasmaFlashStrategy(),
  [Ability.PLASMA_TEMPEST]: new PlasmaTempestStrategy(),
  [Ability.PLAY_ROUGH]: new PlayRoughStrategy(),
  [Ability.POISON_GAS]: new PoisonGasStrategy(),
  [Ability.POISON_JAB]: new PoisonJabStrategy(),
  [Ability.POISON_POWDER]: new PoisonPowderStrategy(),
  [Ability.POISON_STING]: new PoisonStingStrategy(),
  [Ability.POLLEN_PUFF]: new PollenPuffStrategy(),
  [Ability.POLTERGEIST]: new PoltergeistStrategy(),
  [Ability.POPULATION_BOMB]: new PopulationBombStrategy(),
  [Ability.POWDER]: new PowderStrategy(),
  [Ability.POWDER_SNOW]: new PowderSnowStrategy(),
  [Ability.POWER_HUG]: new PowerHugStrategy(),
  [Ability.POWER_WASH]: new PowerWashStrategy(),
  [Ability.POWER_WHIP]: new PowerWhipStrategy(),
  [Ability.PRECIPICE_BLADES]: new PrecipiceBladesStrategy(),
  [Ability.PRESENT]: new PresentStrategy(),
  [Ability.PRISMATIC_LASER]: new PrismaticLaserStrategy(),
  [Ability.PROTECT]: new ProtectStrategy(),
  [Ability.PSYBEAM]: new PsybeamStrategy(),
  [Ability.PSYCHIC]: new PsychicStrategy(),
  [Ability.PSYCHIC_FANGS]: new PsychicFangsStrategy(),
  [Ability.PSYCHIC_SURGE]: new PsychicSurgeStrategy(),
  [Ability.PSYCHO_BOOST]: new PsychoBoostStrategy(),
  [Ability.PSYCHO_CUT]: new PsychoCutStrategy(),
  [Ability.PSYCHO_SHIFT]: new PsychoShiftStrategy(),
  [Ability.PSYSHIELD_BASH]: new PsyshieldBashStrategy(),
  [Ability.PSYSHOCK]: new PsyShockStrategy(),
  [Ability.PSYSTRIKE]: new PsystrikeStrategy(),
  [Ability.PUMMELING_PAYBACK]: new PummelingPaybackStrategy(),
  [Ability.PURIFY]: new PurifyStrategy(),
  [Ability.PYRO_BALL]: new PyroBallStrategy(),
  [Ability.QUIVER_DANCE]: new QuiverDanceStrategy(),
  [Ability.RAGE]: new RageStrategy(),
  [Ability.RAGING_BULL]: new RagingBullStrategy(),
  [Ability.RAPID_SPIN]: new RapidSpinStrategy(),
  [Ability.RAZOR_LEAF]: new RazorLeafStrategy(),
  [Ability.RAZOR_WIND]: new RazorWindStrategy(),
  [Ability.RECOVER]: new RecoverStrategy(),
  [Ability.REFLECT]: new ReflectStrategy(),
  [Ability.RELIC_SONG]: new RelicSongStrategy(),
  [Ability.RETALIATE]: new RetaliateStrategy(),
  [Ability.RETURN]: new ReturnStrategy(),
  [Ability.ROAR]: new RoarStrategy(),
  [Ability.ROAR_OF_TIME]: new RoarOfTimeStrategy(),
  [Ability.ROCK_ARTILLERY]: new RockArtilleryStrategy(),
  [Ability.ROCK_HEAD]: new RockHeadStrategy(),
  [Ability.ROCK_SLIDE]: new RockSlideStrategy(),
  [Ability.ROCK_SMASH]: new RockSmashStrategy(),
  [Ability.ROCK_TOMB]: new RockTombStrategy(),
  [Ability.ROCK_WRECKER]: new RockWreckerStrategy(),
  [Ability.ROLLOUT]: new RolloutStrategy(),
  [Ability.ROOST]: new RoostStrategy(),
  [Ability.SACRED_SWORD_CAVERN]: new SacredSwordCavernStrategy(),
  [Ability.SACRED_SWORD_GRASS]: new SacredSwordGrassStrategy(),
  [Ability.SACRED_SWORD_IRON]: new SacredSwordIronStrategy(),
  [Ability.SALT_CURE]: new SaltCureStrategy(),
  [Ability.SAND_SPIT]: new SandSpitStrategy(),
  [Ability.SAND_TOMB]: new SandTombStrategy(),
  [Ability.SANDSEAR_STORM]: new SandsearStormStrategy(),
  [Ability.SCALE_SHOT]: new ScaleShotStrategy(),
  [Ability.SCHOOLING]: new SchoolingStrategy(),
  [Ability.SCREECH]: new ScreechStrategy(),
  [Ability.SEARING_SHOT]: new SearingShotStrategy(),
  [Ability.SECRET_SWORD]: new SecretSwordStrategy(),
  [Ability.SEED_FLARE]: new SeedFlareStrategy(),
  [Ability.SEISMIC_TOSS]: new SeismicTossStrategy(),
  [Ability.SHADOW_BALL]: new ShadowBallStrategy(),
  [Ability.SHADOW_BONE]: new ShadowBoneStrategy(),
  [Ability.SHADOW_CLAW]: new ShadowClawStrategy(),
  [Ability.SHADOW_CLONE]: new ShadowCloneStrategy(),
  [Ability.SHADOW_FORCE]: new ShadowForceStrategy(),
  [Ability.SHADOW_PUNCH]: new ShadowPunchStrategy(),
  [Ability.SHADOW_SNEAK]: new ShadowSneakStrategy(),
  [Ability.SHED_TAIL]: new ShedTailStrategy(),
  [Ability.SHEER_COLD]: new SheerColdStrategy(),
  [Ability.SHELL_SIDE_ARM]: new ShellSideArmStrategy(),
  [Ability.SHELL_SMASH]: new ShellSmashStrategy(),
  [Ability.SHELL_TRAP]: new ShellTrapStrategy(),
  [Ability.SHELTER]: new ShelterStrategy(),
  [Ability.SHIELDS_DOWN]: new ShieldsDownStrategy(),
  [Ability.SHIELDS_UP]: new ShieldsUpStrategy(),
  [Ability.SHOCKWAVE]: new ShockwaveStrategy(),
  [Ability.SHORE_UP]: new ShoreUpStrategy(),
  [Ability.SILK_TRAP]: new SilkTrapStrategy(),
  [Ability.SILVER_WIND]: new SilverWindStrategy(),
  [Ability.SING]: new SingStrategy(),
  [Ability.SKETCH]: new SketchStrategy(),
  [Ability.SKILL_SWAP]: new SkillSwapStrategy(),
  [Ability.SKITTER_SMACK]: new SkitterSmackStrategy(),
  [Ability.SKY_ATTACK]: new SkyAttackStrategy(),
  [Ability.SKY_ATTACK_SHADOW]: new SkyAttackShadowStrategy(),
  [Ability.SLACK_OFF]: new SlackOffStrategy(),
  [Ability.SLASH]: new SlashStrategy(),
  [Ability.SLASHING_CLAW]: new SlashingClawStrategy(),
  [Ability.SLUDGE]: new SludgeStrategy(),
  [Ability.SLUDGE_WAVE]: new SludgeWaveStrategy(),
  [Ability.SMOG]: new SmogStrategy(),
  [Ability.SMOKE_SCREEN]: new SmokeScreenStrategy(),
  [Ability.SNIPE_SHOT]: new SnipeShotStrategy(),
  [Ability.SNORE]: new SnoreStrategy(),
  [Ability.SOAK]: new SoakStrategy(),
  [Ability.SOFT_BOILED]: new SoftBoiledStrategy(),
  [Ability.SOLAR_BEAM]: new SolarBeamStrategy(),
  [Ability.SOLAR_BLADE]: new SolarBladeStrategy(),
  [Ability.SONG_OF_DESIRE]: new SongOfDesireStrategy(),
  [Ability.SOUL_TRAP]: new SoulTrapStrategy(),
  [Ability.SPACIAL_REND]: new SpacialRendStrategy(),
  [Ability.SPARK]: new SparkStrategy(),
  [Ability.SPARKLING_ARIA]: new SparklingAriaStrategy(),
  [Ability.SPECTRAL_THIEF]: new SpectralThiefStrategy(),
  [Ability.SPICY_EXTRACT]: new SpicyExtractStrategy(),
  [Ability.SPIKES]: new SpikesStrategy(),
  [Ability.SPIKY_SHIELD]: new SpikyShieldStrategy(),
  [Ability.SPIN_OUT]: new SpinOutStrategy(),
  [Ability.SPIRIT_BREAK]: new SpiritBreakStrategy(),
  [Ability.SPIRIT_SHACKLE]: new SpiritShackleStrategy(),
  [Ability.SPITE]: new SpiteStrategy(),
  [Ability.SPLASH]: new SplashStrategy(),
  [Ability.SPRINGTIDE_STORM]: new SpringtideStormStrategy(),
  [Ability.STATIC_SHOCK]: new StaticShockStrategy(),
  [Ability.STEALTH_ROCKS]: new StealthRocksStrategy(),
  [Ability.STEAM_ERUPTION]: new SteamEruptionStrategy(),
  [Ability.STEAMROLLER]: new SteamrollerStrategy(),
  [Ability.STEEL_WING]: new SteelWingStrategy(),
  [Ability.STICKY_WEB]: new StickyWebStrategy(),
  [Ability.STOCKPILE]: new StockpileStrategy(),
  [Ability.STOMP]: new StompStrategy(),
  [Ability.STONE_AXE]: new StoneAxeStrategy(),
  [Ability.STONE_EDGE]: new StoneEdgeStrategy(),
  [Ability.STORED_POWER]: new StoredPowerStrategy(),
  [Ability.STRANGE_STEAM]: new StrangeSteamStrategy(),
  [Ability.STRENGTH]: new StrengthStrategy(),
  [Ability.STRING_SHOT]: new StringShotStrategy(),
  [Ability.STRUGGLE_BUG]: new StruggleBugStrategy(),
  [Ability.STUFF_CHEEKS]: new StuffCheeksStrategy(),
  [Ability.STUN_SPORE]: new StunSporeStrategy(),
  [Ability.SUCTION_HEAL]: new SuctionHealStrategy(),
  [Ability.SUNSTEEL_STRIKE]: new SunsteelStrikeStrategy(),
  [Ability.SUPER_FANG]: new SuperFangStrategy(),
  [Ability.SUPER_HEAT]: new SuperHeatStrategy(),
  [Ability.SUPERCELL_SLAM]: new SupercellSlamStrategy(),
  [Ability.SURF]: new SurfStrategy(),
  [Ability.SURGING_STRIKES]: new SurgingStrikesStrategy(),
  [Ability.SWAGGER]: new SwaggerStrategy(),
  [Ability.SWALLOW]: new SwallowStrategy(),
  [Ability.SWEET_SCENT]: new SweetScentStrategy(),
  [Ability.SYRUP_BOMB]: new SyrupBombStrategy(),
  [Ability.TACKLE]: new TackleStrategy(),
  [Ability.TAIL_GLOW]: new TailGlowStrategy(),
  [Ability.TAIL_WHIP]: new TailWhipStrategy(),
  [Ability.TAILWIND]: new TailwindStrategy(),
  [Ability.TAKE_HEART]: new TakeHeartStrategy(),
  [Ability.TAUNT]: new TauntStrategy(),
  [Ability.TEA_TIME]: new TeaTimeStrategy(),
  [Ability.TEETER_DANCE]: new TeeterDanceStrategy(),
  [Ability.TELEPORT]: new TeleportStrategy(),
  [Ability.TERRAIN_PULSE]: new TerrainPulseStrategy(),
  [Ability.THIEF]: new ThiefStrategy(),
  [Ability.THOUSAND_ARROWS]: new ThousandArrowsStrategy(),
  [Ability.THRASH]: new ThrashStrategy(),
  [Ability.THUNDER]: new ThunderStrategy(),
  [Ability.THUNDER_CAGE]: new ThunderCageStrategy(),
  [Ability.THUNDER_FANG]: new ThunderFangStrategy(),
  [Ability.THUNDER_SHOCK]: thunderShockStrategy,
  [Ability.THUNDEROUS_KICK]: new ThunderousKickStrategy(),
  [Ability.TICKLE]: new TickleStrategy(),
  [Ability.TIME_TRAVEL]: new TimeTravelStrategy(),
  [Ability.TOPSY_TURVY]: new TopsyTurvyStrategy(),
  [Ability.TORCH_SONG]: new TorchSongStrategy(),
  [Ability.TORMENT]: new TormentStrategy(),
  [Ability.TOXIC]: new ToxicStrategy(),
  [Ability.TRANSE]: new TranseStrategy(),
  [Ability.TRANSFORM]: new TransformStrategy(),
  [Ability.TRI_ATTACK]: new TriAttackStrategy(),
  [Ability.TRICK_OR_TREAT]: new TrickOrTreatStrategy(),
  [Ability.TRIMMING_MOWER]: new TrimmingMowerStrategy(),
  [Ability.TRIPLE_DIVE]: new TripleDiveStrategy(),
  [Ability.TRIPLE_KICK]: new TripleKickStrategy(),
  [Ability.TROP_KICK]: new TropKickStrategy(),
  [Ability.TWIN_BEAM]: new TwinBeamStrategy(),
  [Ability.TWINEEDLE]: new TwineedleStrategy(),
  [Ability.TWISTER]: new TwisterStrategy(),
  [Ability.U_TURN]: new UTurnStrategy(),
  [Ability.ULTRA_THRUSTERS]: new UltraThrustersStrategy(),
  [Ability.UNBOUND]: new UnboundStrategy(),
  [Ability.UPROAR]: new UproarStrategy(),
  [Ability.VENOSHOCK]: new VenoshockStrategy(),
  [Ability.VESPIQUEN_ORDERS]: new AbilityStrategy(),
  [Ability.VICTORY_DANCE]: new VictoryDanceStrategy(),
  [Ability.VINE_WHIP]: new VineWhipStrategy(),
  [Ability.VISE_GRIP]: new ViseGripStrategy(),
  [Ability.VOLT_SURGE]: new VoltSurgeStrategy(),
  [Ability.VOLT_SWITCH]: new VoltSwitchStrategy(),
  [Ability.WATER_PULSE]: new WaterPulseStrategy(),
  [Ability.WATER_SHURIKEN]: new WaterShurikenStrategy(),
  [Ability.WATERFALL]: new WaterfallStrategy(),
  [Ability.WAVE_SPLASH]: new WaveSplashStrategy(),
  [Ability.WHEEL_OF_FIRE]: new WheelOfFireStrategy(),
  [Ability.WHIRLPOOL]: new WhirlpoolStrategy(),
  [Ability.WHIRLWIND]: new WhirlwindStrategy(),
  [Ability.WICKED_BLOW]: new WickedBlowStrategy(),
  [Ability.WILDBOLT_STORM]: new WildboltStormStrategy(),
  [Ability.WISE_YAWN]: new WiseYawnStrategy(),
  [Ability.WISH]: new WishStrategy(),
  [Ability.WONDER_GUARD]: new WonderGuardStrategy(),
  [Ability.WONDER_ROOM]: new WonderRoomStrategy(),
  [Ability.WOOD_HAMMER]: new WoodHammerStrategy(),
  [Ability.X_SCISSOR]: new XScissorStrategy(),
  [Ability.YAWN]: new YawnStrategy(),
  [Ability.ZAP_CANNON]: new ZapCannonStrategy(),
  [Ability.ZING_ZAP]: new ZingZapStrategy()
}
