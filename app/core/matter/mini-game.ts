import { PokemonAvatar } from "../../models/colyseus-models/pokemon-avatar"
import { FloatingItem } from "../../models/colyseus-models/floating-item"
import { Schema, MapSchema, type } from "@colyseus/schema"
import { Bodies, Composite, Engine, Body, Vector } from "matter-js"
import Player from "../../models/colyseus-models/player"

export class MiniGame {
  avatars: MapSchema<PokemonAvatar> | undefined
  items: MapSchema<FloatingItem> | undefined
  bodies: Map<string, Body>
  engine: Engine

  constructor() {
    this.engine = Engine.create({ gravity: { x: 0, y: 0 } })
    this.bodies = new Map<string, Body>()
  }

  create(avatars: MapSchema<PokemonAvatar>, items: MapSchema<FloatingItem>) {
    this.avatars = avatars
    this.items = items
  }

  initialize(players: MapSchema<Player>) {
    let i = 0
    players.forEach((player) => {
      const x = i * 50
      const y = 200
      const avatar = new PokemonAvatar(player.id, player.avatar, x, y)
      this.avatars!.set(avatar.id, avatar)
      const body = Bodies.circle(x, y, 20)
      this.bodies.set(avatar.id, body)
      Composite.add(this.engine.world, body)
      i++
    })
  }

  update(dt: number) {
    Engine.update(this.engine, dt)
    this.bodies.forEach((body, key) => {
      const avatar = this.avatars?.get(key)
      if (avatar) {
        avatar.x = body.position.x
        avatar.y = body.position.y
      }
    })
  }

  applyVector(id: string, x: number, y: number) {
    const norm = Math.sqrt(x ** 2 + y ** 2)
    const normX = x / norm
    const normY = y / norm
    const body = this.bodies.get(id)
    if (body) {
      Body.applyForce(
        body,
        body.position,
        Vector.create(normX / 1000, normY / 1000)
      )
    }
  }

  stop() {
    this.bodies.forEach((body, key) => {
      Composite.remove(this.engine.world, body)
      this.bodies.delete(key)
    })
    this.avatars!.forEach((avatar) => {
      this.avatars!.delete(avatar.id)
    })
    this.items!.forEach((item) => {
      this.items!.delete(item.id)
    })
  }
}
