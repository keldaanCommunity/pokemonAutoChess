import { SimulationCommand } from "../simulation-command"

export class DarkAuraCooldownCommand extends SimulationCommand {
  constructor() {
    super(500)
  }

  override update(dt: number) {
    this.delay -= dt
    if (this.delay <= 0) {
      this.executed = true
    }
  }
}
