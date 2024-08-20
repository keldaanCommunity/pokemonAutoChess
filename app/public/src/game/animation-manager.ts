import { IPokemonEntity } from "../../../types";
import { AnimationComplete, AnimationType } from "../../../types/Animation";
import { PROJECTILE_SPEED } from "../../../types/Config";
import delays from "../../../types/delays.json";
import {
  Orientation,
  OrientationFlip,
  PokemonActionState,
  PokemonTint,
  SpriteType,
} from "../../../types/enum/Game";
import { Berries } from "../../../types/enum/Item";
import { AnimationConfig, Pkm, PkmIndex } from "../../../types/enum/Pokemon";
import { distanceC } from "../../../utils/distance";
import { logger } from "../../../utils/logger";
import { fpsToDuration, max } from "../../../utils/number";
import atlas from "../assets/atlas.json";
import durations from "../assets/pokemons/durations.json";
import indexList from "../assets/pokemons/indexList.json";
import PokemonSprite from "./components/pokemon";

const FPS_EFFECTS = 20;
const FPS_POKEMON_ANIMS = 36;

export default class AnimationManager {
  game: Phaser.Scene;

  constructor(game: Phaser.Scene) {
    this.game = game;

    this.initializeAnimations();
    this.initializeAtlasAnimations();
    this.createMinigameAnimations();
    this.createEnvironmentAnimations();
  }

  private initializeAnimations() {
    indexList.forEach((index) => {
      const tints = Object.values(PokemonTint);
      tints.forEach((shiny) => {
        const actions = this.getActionsForPokemon(index, shiny);

        actions.forEach((action) => {
          this.createAnimationsForAction(index, shiny, action);
        });
      });
    });
  }

  private getActionsForPokemon(index: string, shiny: PokemonTint): AnimationType[] {
    const actions: AnimationType[] = [
      AnimationType.Idle,
      AnimationType.Walk,
      AnimationType.Sleep,
      AnimationType.Hop,
      AnimationType.Hurt,
    ];

    const conf = (Object.keys(PkmIndex) as Pkm[]).find(
      (p) => index === PkmIndex[p]
    );

    if (conf && AnimationConfig[conf]) {
      const config = AnimationConfig[conf as Pkm];
      if (config.shinyUnavailable && shiny === PokemonTint.SHINY) return actions;

      if (!actions.includes(config.attack)) {
        actions.push(config.attack);
      }
      if (!actions.includes(config.ability)) {
        actions.push(config.ability);
      }
      if (!actions.includes(config.emote)) {
        actions.push(config.emote);
      }
    } else {
      actions.push(AnimationType.Attack);
    }

    return actions;
  }

  private createAnimationsForAction(index: string, shiny: PokemonTint, action: AnimationType) {
    const modes = Object.values(SpriteType);

    modes.forEach((mode) => {
      const directions = AnimationComplete[action] === false
        ? [Orientation.DOWN]
        : Object.values(Orientation);

      directions.forEach((direction) => {
        const durationArray: number[] = durations[`${index}/${shiny}/${action}/${mode}`];
        if (durationArray) {
          const frameArray = this.generateFrameArray(index, shiny, action, mode, direction, durationArray);

          this.game.anims.create({
            key: `${index}/${shiny}/${action}/${mode}/${direction}`,
            frames: frameArray,
            repeat: this.shouldLoop(action) ? -1 : 0,
          });
        } else {
          logger.warn("Duration array missing for", `${index}/${shiny}/${action}/${mode}`);
        }
      });
    });
  }

  private generateFrameArray(
    index: string,
    shiny: PokemonTint,
    action: AnimationType,
    mode: SpriteType,
    direction: Orientation,
    durationArray: number[]
  ) {
    const frameArray = this.game.anims.generateFrameNames(index, {
      start: 0,
      end: durationArray.length - 1,
      zeroPad: 4,
      prefix: `${shiny}/${action}/${mode}/${direction}/`,
    });

    return frameArray.map((frame, i) => ({
      ...frame,
      duration: durationArray[i] * (1000 / FPS_POKEMON_ANIMS),
    }));
  }

  private shouldLoop(action: AnimationType): boolean {
    return [
      AnimationType.Idle,
      AnimationType.Sleep,
      AnimationType.Hop,
    ].includes(action);
  }

  private initializeAtlasAnimations() {
    Object.entries(atlas.packs).forEach(([pack, packData]) => {
      if (packData.anims) {
        const hasMultipleAnims = Object.keys(packData.anims).length > 1;

        Object.entries(packData.anims).forEach(([anim, animConfig]) => {
          this.createAnimation({
            key: anim,
            atlas: packData.name,
            prefix: hasMultipleAnims ? `${anim}/` : "",
            ...animConfig,
          });
        });
      }
    });
  }

  createAnimation({
    key,
    atlas,
    prefix = "",
    frames,
    repeat = 0,
    fps = FPS_EFFECTS,
    yoyo = false,
  }: {
    key: string;
    atlas?: string;
    prefix?: string;
    frames: number;
    repeat?: number;
    fps?: number;
    yoyo?: boolean;
  }) {
    this.game.anims.create({
      key,
      frames: this.game.anims.generateFrameNames(atlas ?? key, {
        start: 0,
        end: frames - 1,
        zeroPad: 3,
        prefix,
        suffix: ".png",
      }),
      duration: fpsToDuration(fps)(frames),
      repeat,
      yoyo,
    });
  }

  createMinigameAnimations() {
    this.createSimpleAnimation("portal", "portal", 0, 7, 600, -1);
    this.createSimpleAnimation("open_chest", "chest", 1, 4, 600, 0);
    this.createSimpleAnimation("shine", "shine", 0, 47, 1000, -1);
  }

  private createSimpleAnimation(
    key: string,
    atlas: string,
    startFrame: number,
    endFrame: number,
    duration: number,
    repeat: number
  ) {
    this.game.anims.create({
      key,
      frames: this.game.anims.generateFrameNames(atlas, {
        start: startFrame,
        end: endFrame,
        suffix: ".png",
      }),
      duration,
      repeat,
    });
  }

  createEnvironmentAnimations() {
    Berries.forEach((berryName) => {
      for (let step = 1; step <= 3; step++) {
        this.createEnvironmentStepAnimation(berryName, step);
      }
    });

    this.createEnvironmentStepAnimation("CROP", 1, "CROP_", 600);
  }

  private createEnvironmentStepAnimation(
    berryName: string,
    step: number,
    prefix = `${berryName}_`,
    duration = 600
  ) {
    this.game.anims.create({
      key: `${berryName}_TREE_STEP_${step}`,
      frames: this.game.anims.generateFrameNames("berry_trees", {
        start: step * 2 - 1,
        end: step * 2,
        prefix,
      }),
      duration,
      repeat: -1,
    });
  }

  convertPokemonActionStateToAnimationType(
    state: PokemonActionState,
    entity: PokemonSprite
  ): AnimationType {
    switch (state) {
      case PokemonActionState.HOP:
      case PokemonActionState.FISH:
        return AnimationType.Hop;
      case PokemonActionState.HURT:
        return AnimationType.Hurt;
      case PokemonActionState.SLEEP:
        return AnimationType.Sleep;
      case PokemonActionState.WALK:
        return AnimationType.Walk;
      case PokemonActionState.ATTACK:
        return AnimationConfig[entity.name as Pkm].attack;
      case PokemonActionState.EMOTE:
        return AnimationConfig[entity.name as Pkm].emote;
      case PokemonActionState.IDLE:
      default:
        return AnimationType.Idle;
    }
  }

  animatePokemon(
    entity: PokemonSprite,
    action: PokemonActionState,
    flip: boolean,
    loop = true
  ) {
    const animation = this.convertPokemonActionStateToAnimationType(action, entity);
    const shouldLock = [PokemonActionState.HOP, PokemonActionState.HURT, PokemonActionState.EMOTE].includes(action);
    const timeScale = action === PokemonActionState.ATTACK
      ? getAttackAnimTimeScale(entity.index, entity.atkSpeed)
      : 1;

    try {
      this.play(entity, animation, { flip, lock: shouldLock, repeat: loop ? -1 : 0, timeScale });
    } catch (err) {
      logger.warn(`Can't play animation ${animation} for ${entity?.name}`, err);
    }
  }

  play(
    entity: PokemonSprite,
    animation: AnimationType,
    config: {
      flip?: boolean;
      repeat?: number;
      lock?: boolean;
      timeScale?: number;
    } = {}
  ) {
    if (entity.animationLocked || !entity.sprite?.anims) return;

    const orientation = config.flip
      ? OrientationFlip[entity.orientation]
      : entity.orientation;

    const orientationCorrected = AnimationComplete[animation] ? orientation : Orientation.DOWN;
    const textureIndex = entity.scene?.textures.exists(entity.index) ? entity.index : "0000";
    const tint = entity.shiny && !AnimationConfig[entity.name].shinyUnavailable
      ? PokemonTint.SHINY
      : PokemonTint.NORMAL;
    const animKey = `${textureIndex}/${tint}/${animation}/${SpriteType.ANIM}/${orientationCorrected}`;
    const shadowKey = `${textureIndex}/${tint}/${animation}/${SpriteType.SHADOW}/${orientationCorrected}`;

    if (entity.sprite.anims.currentAnim?.key === animKey && entity.sprite.anims.currentAnim?.repeat === -1) return;

    entity.sprite.anims.play({ key: animKey, repeat: config.repeat, timeScale: config.timeScale });
    entity.shadow.anims.play({ key: shadowKey, repeat: config.repeat, timeScale: config.timeScale });

    if (config.lock) {
      entity.animationLocked = true;
    }
  }
}

export function getAttackTimings(pokemon: IPokemonEntity): {
  delayBeforeShoot: number;
  travelTime: number;
  attackDuration: number;
} {
  const attackDuration = 1000 / pokemon.atkSpeed;
  const d = delays[pokemon.index]?.d || 18;
  const t = delays[pokemon.index]?.t || 36;

  const delayBeforeShoot = max(attackDuration / 2, (attackDuration * d) / t);
  const distance = distanceC(pokemon.targetX, pokemon.targetY, pokemon.positionX, pokemon.positionY);
  const travelTime = (distance * 1000) / PROJECTILE_SPEED;

  return { delayBeforeShoot, travelTime, attackDuration };
}

export function getAttackAnimTimeScale(pokemonIndex: string, atkSpeed: number) {
  const t = delays[pokemonIndex]?.t || 36;
  return (t * atkSpeed) / FPS_POKEMON_ANIMS;
}
