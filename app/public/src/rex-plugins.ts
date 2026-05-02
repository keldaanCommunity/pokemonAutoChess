import Phaser from "phaser"

window.Phaser = Phaser // rex plugins expect Phaser to be on the window object

export async function loadMoveToPlugin() {
  return (await import("phaser4-rex-plugins/plugins/moveto-plugin")).default
}

export async function loadOutlinePlugin() {
  return (await import("phaser4-rex-plugins/plugins/outlinefilter-plugin.js")).default
}
