import { PokemonAvatar } from "../../models/colyseus-models/pokemon-avatar"
import { FloatingItem } from "../../models/colyseus-models/floating-item"
import { Schema, MapSchema, type } from "@colyseus/schema"
import {
  Bodies,
  Composite,
  Engine,
  Body,
  Vector,
  Events,
  Constraint
} from "matter-js"
import Player from "../../models/colyseus-models/player"
import { getOrientation } from "../../public/src/pages/utils/utils"
import { PokemonActionState } from "../../types/enum/Game"
import { BasicItems, Item } from "../../types/enum/Item"
import { pickRandomIn } from "../../utils/random"

export class MiniGame {
  avatars: MapSchema<PokemonAvatar> | undefined
  items: MapSchema<FloatingItem> | undefined
  bodies: Map<string, Body>
  engine: Engine
  centerX: number = 325
  centerY: number = 250

  constructor() {
    this.engine = Engine.create({ gravity: { x: 0, y: 0 } })
    this.bodies = new Map<string, Body>()
    Composite.add(
      this.engine.world,
      Bodies.rectangle(0, -70, 2000, 40, { isStatic: true, restitution: 1 })
    )
    Composite.add(
      this.engine.world,
      Bodies.rectangle(-70, 0, 40, 2000, { isStatic: true, restitution: 1 })
    )
    Composite.add(
      this.engine.world,
      Bodies.rectangle(740, 0, 40, 2000, { isStatic: true, restitution: 1 })
    )
    Composite.add(
      this.engine.world,
      Bodies.rectangle(0, 610, 2000, 40, { isStatic: true, restitution: 1 })
    )
    Events.on(this.engine, "beforeUpdate", (event) => {
      this.items?.forEach((item) => {
        if (item.avatarId === "") {
          const itemBody = this.bodies.get(item.id)
          if (itemBody) {
            const x =
              this.centerX +
              Math.cos(
                this.engine.timing.timestamp * 0.0005 +
                  (Math.PI * item.index) / 4.5
              ) *
                100
            const y =
              this.centerY +
              Math.sin(
                this.engine.timing.timestamp * 0.0005 +
                  (Math.PI * item.index) / 4.5
              ) *
                90
            Body.setPosition(itemBody, { x: x, y: y })
          }
        }
      })
    })

    Events.on(this.engine, "collisionStart", (event) => {
      const pairs = event.pairs
      if (
        (this.items?.has(pairs[0].bodyA.label) ||
          this.items?.has(pairs[0].bodyB.label)) &&
        (this.avatars?.has(pairs[0].bodyA.label) ||
          this.avatars?.has(pairs[0].bodyB.label))
      ) {
        let avatar: PokemonAvatar | undefined,
          avatarBody: Body | undefined,
          item: FloatingItem | undefined,
          itemBody: Body | undefined

        if (this.avatars?.has(pairs[0].bodyA.label)) {
          avatar = this.avatars.get(pairs[0].bodyA.label)
          avatarBody = pairs[0].bodyA
          item = this.items.get(pairs[0].bodyB.label)
          itemBody = pairs[0].bodyB
        } else {
          avatar = this.avatars.get(pairs[0].bodyB.label)
          avatarBody = pairs[0].bodyB
          item = this.items.get(pairs[0].bodyA.label)
          itemBody = pairs[0].bodyA
        }

        if (
          itemBody &&
          avatarBody &&
          avatar &&
          item &&
          avatar.itemId === "" &&
          item.avatarId === ""
        ) {
          const constraint = Constraint.create({
            bodyA: avatarBody,
            bodyB: itemBody
          })
          Composite.add(this.engine.world, constraint)
          avatar.itemId = item.id
          item.avatarId = avatar.id
        }
      }
    })
  }

  create(avatars: MapSchema<PokemonAvatar>, items: MapSchema<FloatingItem>) {
    this.avatars = avatars
    this.items = items
  }

  initialize(players: MapSchema<Player>) {
    let i = 0
    let alivePlayers = 0
    players.forEach((p) => {
      if (p.alive) {
        alivePlayers++
      }
    })
    players.forEach((player) => {
      const x = this.centerX + Math.cos((2 * Math.PI * i) / alivePlayers) * 300
      const y = this.centerY + Math.sin((2 * Math.PI * i) / alivePlayers) * 250
      const avatar = new PokemonAvatar(
        player.id,
        player.avatar,
        x,
        y,
        11000 - player.rank * 1000
      )

      this.avatars!.set(avatar.id, avatar)
      const body = Bodies.circle(x, y, 25)
      body.label = avatar.id
      this.bodies.set(avatar.id, body)
      Composite.add(this.engine.world, body)
      i++
    })
    for (let j = 0; j < 9; j++) {
      const x = this.centerX + Math.cos((Math.PI * j) / 4.5) * 100
      const y = this.centerY + Math.sin((Math.PI * j) / 4.5) * 90
      const name = pickRandomIn(BasicItems)
      const floatingItem = new FloatingItem(name, x, y, j)
      this.items?.set(floatingItem.id, floatingItem)
      const body = Bodies.circle(x, y, 15)
      body.label = floatingItem.id
      this.bodies.set(floatingItem.id, body)
      Composite.add(this.engine.world, body)
    }
  }

  update(dt: number) {
    Engine.update(this.engine, dt)
    this.avatars?.forEach((a) => {
      if (a.timer > 0) {
        a.timer = a.timer - dt
      }
    })
    this.bodies.forEach((body, key) => {
      const avatar = this.avatars?.get(key)
      if (avatar) {
        if (
          avatar.action === PokemonActionState.IDLE &&
          (Math.abs(body.velocity.x) > 0.1 || Math.abs(body.velocity.y) > 0.1)
        ) {
          avatar.action = PokemonActionState.WALK
        } else if (
          avatar.action === PokemonActionState.WALK &&
          Math.abs(body.velocity.x) < 0.1 &&
          Math.abs(body.velocity.y) < 0.1
        ) {
          avatar.action = PokemonActionState.IDLE
        }
        avatar.x = body.position.x
        avatar.y = body.position.y
      }
      const item = this.items?.get(key)
      if (item) {
        item.x = body.position.x
        item.y = body.position.y
      }
    })
  }

  applyVector(id: string, x: number, y: number) {
    const avatar = this.avatars?.get(id)
    if (avatar && avatar.timer <= 0) {
      const norm = Math.sqrt(x ** 2 + y ** 2)
      const normX = x / norm
      const normY = y / norm
      const body = this.bodies.get(id)

      avatar.orientation = getOrientation(0, 0, x, y)
      if (body) {
        Body.applyForce(
          body,
          body.position,
          Vector.create(normX / 700, -normY / 700)
        )
      }
    }
  }

  stop(players: MapSchema<Player>) {
    this.bodies.forEach((body, key) => {
      Composite.remove(this.engine.world, body)
      this.bodies.delete(key)
    })
    this.avatars!.forEach((avatar) => {
      if (avatar.itemId !== "") {
        const item = this.items?.get(avatar.itemId)
        const player = players.get(avatar.id)
        if (item && player) {
          player.items.add(item.name)
        }
      }
      this.avatars!.delete(avatar.id)
    })
    this.items!.forEach((item) => {
      this.items!.delete(item.id)
    })
  }
}
