import LoadingManager from "../components/loading-manager"

export class PreloadingScene extends Phaser.Scene {
  loadingManager: LoadingManager
  onProgress: (value: number) => void
  onComplete: () => void

  constructor(onProgress: (value: number) => void, onComplete: () => void) {
    super()
    this.onProgress = onProgress
    this.onComplete = onComplete
  }

  preload() {
    this.loadingManager = new LoadingManager(this)

    this.load.on("progress", (value: number) => {
      this.onProgress(value)
    })
    this.load.on("complete", () => {
      this.onComplete()
    })
  }

  create() {}
}
