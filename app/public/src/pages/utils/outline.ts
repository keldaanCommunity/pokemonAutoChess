export function addOutlineOnHover(
  sprite: Phaser.GameObjects.Sprite,
  thickness = 2,
  outlineColor = 0xffffff
) {
  sprite.setInteractive()
  sprite.enableFilters()

  sprite
    .on("pointerover", () => {
      const existingOutline = sprite.getData("rexOutlineController") as
        | Phaser.Filters.Controller
        | undefined
      existingOutline?.destroy()

      const outline = sprite.filters!.internal.addRexOutline({
        thickness,
        outlineColor
      })
      sprite.setData("rexOutlineController", outline)
    })
    .on("pointerout", () => {
      const outline = sprite.getData("rexOutlineController") as
        | Phaser.Filters.Controller
        | undefined
      outline?.destroy()
      sprite.setData("rexOutlineController", null)
    })
}
