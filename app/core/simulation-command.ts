export abstract class SimulationCommand {
  delay: number
  executed = false

  constructor(delay: number) {
    this.delay = delay
  }
  execute() {}
  update(dt: number) {
    this.delay -= dt
    if (this.delay < 0) {
      this.execute()
      this.afterExecute()
    }
  }
  afterExecute() {
    this.executed = true
  }
}

export class AbilityCommand extends SimulationCommand {
  delayedFunction: () => void
  constructor(delayedFunction: () => void, delay: number) {
    super(delay)
    this.delayedFunction = delayedFunction
  }
  execute() {
    super.execute()
    this.delayedFunction()
  }
}
