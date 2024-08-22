Aqui está o código otimizado, mantendo o mesmo padrão de funcionamento e aplicando algumas práticas recomendadas como early returns, simplificação de expressões e uso de funções auxiliares para evitar repetições:

```typescript
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

    indexList.forEach((index) => {
      const tints = Object.values(PokemonTint) as PokemonTint[];
      tints.forEach((shiny) => {
        const actions: AnimationType[] = this.getPokemonActions(index, shiny);

        actions.forEach((action) => {
          const modes = Object.values(SpriteType) as SpriteType[];
          modes.forEach((mode) => {
            const directions = AnimationComplete[action]
              ? Object.values(Orientation)
              : [Orientation.DOWN];

            directions.forEach((direction) => {
              this.createPokemonAnimation(index, shiny, action, mode, direction);
            });
          });
        });
      });
    });

    this.createAtlasAnimations();
    this.createMinigameAnimations();
    this.createEnvironmentAnimations();
  }

  getPokemonActions(index: string, shiny: PokemonTint): AnimationType[] {
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
      if (AnimationConfig[conf].shinyUnavailable && shiny === PokemonTint.SHINY)
        return actions;

      const addUniqueAction = (action: AnimationType) => {
        if (!actions.includes(action)) {
          actions.push(action);
        }
      };

      addUniqueAction(AnimationConfig[conf as Pkm].attack);
      addUniqueAction(AnimationConfig[conf as Pkm].ability);
      addUniqueAction(AnimationConfig[conf as Pkm].emote);
    } else {
      actions.push(AnimationType.Attack);
    }

    return actions;
  }

  createPokemonAnimation(
    index: string,
    shiny: PokemonTint,
    action: AnimationType,
    mode: SpriteType,
    direction: Orientation
  ) {
    const durationArray: number[] =
      durations[`${index}/${shiny}/${action}/${mode}`];

    if (!durationArray) {
      logger.warn(
        `duration array missing for ${index}/${shiny}/${action}/${mode}`
      );
      return;
    }

    const frameArray = this.game.anims.generateFrameNames(index, {
      start: 0,
      end: durationArray.length - 1,
      zeroPad: 4,
      prefix: `${shiny}/${action}/${mode}/${direction}/`,
    });

    frameArray.forEach((frame, i) => {
      frame["duration"] = durationArray[i] * (1000 / FPS_POKEMON_ANIMS);
    });

    const shouldLoop = [
      AnimationType.Idle,
      AnimationType.Sleep,
      AnimationType.Hop,
    ].includes(action);

    this.game.anims.create({
      key: `${index}/${shiny}/${action}/${mode}/${direction}`,
      frames: frameArray,
      repeat: shouldLoop ? -1 : 0,
    });
  }

  createAtlasAnimations() {
    for (const pack in atlas.packs) {
      const anims = atlas.packs[pack].anims;
      if (!anims) continue;

      const multipleAnims = Object.keys(anims).length > 1;

      Object.keys(anims).forEach((anim) => {
        this.createAnimation({
          key: anim,
          atlas: atlas.packs[pack].name,
          prefix: multipleAnims ? anim + "/" : "",
          ...anims[anim],
        });
      });
    }
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
    this.game.anims.create({
      key: "portal",
      frames: this.game.anims.generateFrameNames("portal", {
        start: 0,
        end: 7,
        zeroPad: 3,
      }),
      duration: 600,
      repeat: -1,
    });

    this.game.anims.create({
      key: "open_chest",
      frames: this.game.anims.generateFrameNames("chest", {
        start: 1,
        end: 4,
        suffix: ".png",
      }),
      duration: 600,
      repeat: 0,
    });

    this.game.anims.create({
      key: "shine",
      frames: this.game.anims.generateFrameNames("shine", {
        start: 0,
        end: 47,
        suffix: ".png",
      }),
      duration: 1000,
      repeat: -1,
    });
  }

  createEnvironmentAnimations() {
    Berries.forEach((berryName) => {
      for (let step = 1; step <= 3; step++) {
        this.createEnvironmentAnimation(berryName, step);
      }
    });

    this.createEnvironmentAnimation("CROP", 1);
  }

  createEnvironmentAnimation(berryName: string, step: number) {
    this.game.anims.create({
      key: `${berryName}_TREE_STEP_${step}`,
      frames: this.game.anims.generateFrameNames("berry_trees", {
        start: step * 2 - 1,
        end: step * 2,
        prefix: `${berryName}_`,
      }),
      duration: 600,
      repeat: -1,
    });
  }

  convertPokemonActionStateToAnimationType(
    state: PokemonActionState,
    entity: PokemonSprite
  ): AnimationType {
    const actionMap = {
      [PokemonActionState.HOP]: AnimationType.Hop,
      [PokemonActionState.FISH]: AnimationType.Hop,
      [PokemonActionState.HURT]: AnimationType.Hurt,
      [PokemonActionState.SLEEP]: AnimationType.Sleep,
      [PokemonActionState.WALK]: AnimationType.Walk,
      [PokemonActionState.ATTACK]: AnimationConfig[entity.name as Pkm].attack,
      [PokemonActionState.EMOTE]: AnimationConfig[entity.name as Pkm].emote,
    };

    return actionMap[state] || AnimationType.Idle;
  }

  animatePokemon(
    entity: PokemonSprite,
    action: PokemonActionState,
    flip: boolean,
    loop: boolean = true
  ) {
    const animation = this.convertPokemonActionStateToAnimationType(
      action,
      entity
    );

    const shouldLock = [PokemonActionState.HOP, PokemonActionState.HURT, PokemonActionState.EMOTE].includes(action);

    const timeScale =
      action === PokemonActionState.ATTACK
        ? getAttackAnimTimeScale(entity.index, entity.atkSpeed)
        : 1;

    this.play(entity, animation, { flip, lock: shouldLock, repeat: loop ? -1 : 0, timeScale });
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

    const orientationCorrected = AnimationComplete[animation]
      ? orientation
      : Orientation.DOWN;

    const textureIndex =
      entity.scene?.textures.exists(entity.index) ? entity.index : "0000";
    const tint =
      entity.shiny && !AnimationConfig[entity.name].shinyUnavailable
        ? PokemonTint.SHINY
        : PokemonTint.NORMAL;

    const animKey = `${textureIndex}/${tint}/${animation}/${SpriteType.ANIM}/${orientationCorrected}`;
    const shadowKey = `${textureIndex}/${tint}/${animation}/${SpriteType.SHADOW}/${orientationCorrected}`;

    if (
      entity.sprite
