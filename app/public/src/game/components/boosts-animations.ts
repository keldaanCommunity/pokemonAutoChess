import { Stat } from "../../../../types/enum/Game"
import { DEPTH } from "../depths"
import { DebugScene } from "../scenes/debug-scene"
import GameScene from "../scenes/game-scene"

export function displayBoost(
  scene: GameScene | DebugScene,
  x: number,
  y: number,
  stat: Stat
) {
  const tint =
    {
      [Stat.AP]: 0xff00aa,
      [Stat.SPEED]: 0xffaa44,
      [Stat.ATK]: 0xff6633,
      [Stat.DEF]: 0xffaa66,
      [Stat.SPE_DEF]: 0xff99cc,
      [Stat.SHIELD]: 0xffcc99
    }[stat] ?? 0xffffff
  const boost = scene.add
    .sprite(x, y - 10, "abilities", `BOOST/000.png`)
    .setDepth(DEPTH.BOOST_BACK)
    .setScale(2)
    .setTint(tint)
  boost.anims.play({
    key: "BOOST",
    repeat: scene instanceof GameScene ? 0 : 5
  })
  boost.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    boost.destroy()
  })
}
