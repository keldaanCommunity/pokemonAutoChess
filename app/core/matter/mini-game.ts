import { PokemonAvatarModel } from "../../models/colyseus-models/pokemon-avatar"
import { FloatingItem } from "../../models/colyseus-models/floating-item"
import { Portal } from "../../models/colyseus-models/portal"
import { MapSchema } from "@colyseus/schema"
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
import { clamp } from "../../utils/number"
import { ItemCarouselStages, MythicalPicksStages } from "../../types/Config"

const PLAYER_VELOCITY = 2
const ITEM_ROTATION_SPEED = 0.0004
const PORTAL_ROTATION_SPEED = 0.0003
const CAROUSEL_RADIUS = 140

export class MiniGame {
  avatars: MapSchema<PokemonAvatarModel> | undefined
  items: MapSchema<FloatingItem> | undefined
  portals: MapSchema<Portal> | undefined
  bodies: Map<string, Body>
  alivePlayers: Player[]
  engine: Engine
  centerX: number = 325
  centerY: number = 250

  constructor() {
    this.engine = Engine.create({ gravity: { x: 0, y: 0 } })
    this.bodies = new Map<string, Body>()
    this.alivePlayers = []
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
            const t = this.engine.timing.timestamp * ITEM_ROTATION_SPEED
            const x =
              this.centerX +
              Math.cos(t + (Math.PI * 2 * item.index) / this.items!.size) *
                CAROUSEL_RADIUS
            const y =
              this.centerY +
              Math.sin(t + (Math.PI * 2 * item.index) / this.items!.size) *
                CAROUSEL_RADIUS
            Body.setPosition(itemBody, { x, y })
          }
        }
      })

      this.portals?.forEach((portal) => {
        if (portal.avatarId === "") {
          const portalBody = this.bodies.get(portal.id)
          if (portalBody) {
            const t = this.engine.timing.timestamp * PORTAL_ROTATION_SPEED
            const x =
              this.centerX +
              Math.cos(t + (Math.PI * 2 * portal.index) / this.portals!.size) *
                CAROUSEL_RADIUS
            const y =
              this.centerY +
              Math.sin(t + (Math.PI * 2 * portal.index) / this.portals!.size) *
                CAROUSEL_RADIUS
            Body.setPosition(portalBody, { x, y })
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
        let avatar: PokemonAvatarModel | undefined,
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

          itemBody.collisionFilter.mask = 0 // item no longer collide
          avatarBody.collisionFilter.mask = 0 // player no longer collide after taking an item

          const player = this.alivePlayers.find((p) => p.id === avatar!.id)
          if (player && player.isBot) {
            // make bots return to outer circle
            const i = this.alivePlayers.indexOf(player)
            avatar.targetX =
              this.centerX +
              Math.cos((2 * Math.PI * i) / this.alivePlayers.length) * 300
            avatar.targetY =
              this.centerY +
              Math.sin((2 * Math.PI * i) / this.alivePlayers.length) * 250
          }
        }
      }

      if (
        (this.portals?.has(pairs[0].bodyA.label) ||
          this.portals?.has(pairs[0].bodyB.label)) &&
        (this.avatars?.has(pairs[0].bodyA.label) ||
          this.avatars?.has(pairs[0].bodyB.label))
      ) {
      }
    })
  }

  create(
    avatars: MapSchema<PokemonAvatarModel>,
    items: MapSchema<FloatingItem>,
    portals: MapSchema<Portal>
  ) {
    this.avatars = avatars
    this.items = items
    this.portals = portals
  }

  initialize(players: MapSchema<Player>, stageLevel: number) {
    this.alivePlayers = new Array<Player>()
    players.forEach((p) => {
      if (p.alive) {
        this.alivePlayers.push(p)
      }
    })
    this.alivePlayers.forEach((player, i) => {
      const x =
        this.centerX +
        Math.cos((2 * Math.PI * i) / this.alivePlayers.length) * 300
      const y =
        this.centerY +
        Math.sin((2 * Math.PI * i) / this.alivePlayers.length) * 250
      let retentionDelay =
        4000 + (this.alivePlayers.length - player.rank) * 2000
      if (stageLevel < 5) {
        retentionDelay = 5000
      }

      const avatar = new PokemonAvatarModel(
        player.id,
        player.avatar,
        x,
        y,
        retentionDelay
      )

      if (player.isBot) {
        avatar.targetX =
          this.centerX +
          Math.cos((2 * Math.PI * i) / this.alivePlayers.length) *
            CAROUSEL_RADIUS
        avatar.targetY =
          this.centerY +
          Math.sin((2 * Math.PI * i) / this.alivePlayers.length) *
            CAROUSEL_RADIUS
      }

      this.avatars!.set(avatar.id, avatar)
      const body = Bodies.circle(x, y, 25)
      body.label = avatar.id
      this.bodies.set(avatar.id, body)
      Composite.add(this.engine.world, body)
    })

    if (MythicalPicksStages.includes(stageLevel)) {
      this.initializePortalCarousel()
    } else if (ItemCarouselStages.includes(stageLevel)) {
      this.initializeItemsCarousel()
    }
  }

  initializeItemsCarousel() {
    const nbItemsToPick = clamp(this.alivePlayers.length + 3, 5, 9)
    const items = this.pickRandomItems(nbItemsToPick)

    for (let j = 0; j < nbItemsToPick; j++) {
      const x = this.centerX + Math.cos((Math.PI * 2 * j) / nbItemsToPick) * 100
      const y = this.centerY + Math.sin((Math.PI * 2 * j) / nbItemsToPick) * 90
      const name = items[j]
      const floatingItem = new FloatingItem(name, x, y, j)
      this.items?.set(floatingItem.id, floatingItem)
      const body = Bodies.circle(x, y, 15)
      body.label = floatingItem.id
      this.bodies.set(floatingItem.id, body)
      Composite.add(this.engine.world, body)
    }
  }

  initializePortalCarousel() {
    const nbPortals = clamp(this.alivePlayers.length + 1, 3, 9)
    for (let i = 0; i < nbPortals; i++) {
      const x = this.centerX + Math.cos((Math.PI * 2 * i) / nbPortals) * 110
      const y = this.centerY + Math.sin((Math.PI * 2 * i) / nbPortals) * 100
      const portal = new Portal(x, y, i)
      this.portals?.set(portal.id, portal)
      const body = Bodies.circle(x, y, 35)
      body.label = portal.id
      this.bodies.set(portal.id, body)
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
    this.bodies.forEach((body, id) => {
      if (this.avatars?.has(id)) {
        const avatar = this.avatars.get(id)!
        avatar.x = body.position.x
        avatar.y = body.position.y
        this.updatePlayerVector(id)
      } else if (this.items?.has(id)) {
        const item = this.items.get(id)!
        item.x = body.position.x
        item.y = body.position.y
      } else if (this.portals?.has(id)) {
        const portal = this.portals.get(id)!
        portal.x = body.position.x
        portal.y = body.position.y
      }
    })
  }

  pickRandomItems(nbItemsToPick: number): Item[] {
    const items: Item[] = []
    for (let j = 0; j < nbItemsToPick; j++) {
      let item, count
      do {
        item = pickRandomIn(BasicItems)
        count = items.filter((i) => i === item).length
      } while (count >= 2) // maximum 2 copies of each item
      items.push(item)
    }
    return items
  }

  applyVector(id: string, x: number, y: number) {
    const avatar = this.avatars?.get(id)
    if (avatar && avatar.timer <= 0) {
      avatar.targetX = avatar.x + x
      avatar.targetY = avatar.y - y
      this.updatePlayerVector(id)
    }
  }

  updatePlayerVector(id: string) {
    const avatar = this.avatars?.get(id)
    const body = this.bodies.get(id)
    if (body && avatar && avatar.timer <= 0) {
      const distanceToTarget = Math.sqrt(
        (avatar.targetX - avatar.x) ** 2 + (avatar.targetY - avatar.y) ** 2
      )
      if (distanceToTarget > PLAYER_VELOCITY) {
        avatar.action = PokemonActionState.WALK
        let moveVector = Vector.sub(
          Vector.create(avatar.targetX, avatar.targetY),
          Vector.create(avatar.x, avatar.y)
        )
        avatar.orientation = getOrientation(
          0,
          0,
          moveVector.x,
          -1 * moveVector.y
        )
        moveVector = Vector.normalise(moveVector)
        moveVector = Vector.mult(moveVector, PLAYER_VELOCITY)
        Body.setVelocity(body, moveVector)
      } else {
        avatar.action = PokemonActionState.IDLE
        Body.setVelocity(body, Vector.create(0, 0))
      }
    }
  }

  stop(players: MapSchema<Player>) {
    this.bodies.forEach((body, key) => {
      Composite.remove(this.engine.world, body)
      this.bodies.delete(key)
    })
    this.avatars!.forEach((avatar) => {
      const player = players.get(avatar.id)
      if (avatar.itemId === "" && player && !player.isBot) {
        if (this.items) {
          // give a random item if none was taken
          const remainingItems = [...this.items.entries()].filter(
            ([itemId, item]) => item.avatarId == ""
          )
          if (remainingItems.length > 0) {
            avatar.itemId = pickRandomIn(remainingItems)[0]
          }
        }

        if (this.portals) {
          // send to random portal if none was taken
          const remainingPortals = [...this.portals.entries()].filter(
            ([portalId, portal]) => portal.avatarId == ""
          )
          if (remainingPortals.length > 0) {
            avatar.portalId = pickRandomIn(remainingPortals)[0]
          }
        }
      }

      if (avatar.itemId) {
        const item = this.items?.get(avatar.itemId)

        if (item && player && !player.isBot) {
          player.items.add(item.name)
        }
        this.avatars!.delete(avatar.id)
      }

      if (avatar.portalId) {
        //TODO: assign mythical propositions
      }
    })

    if (this.items) {
      this.items.forEach((item) => {
        this.items!.delete(item.id)
      })
    }

    if (this.portals) {
      this.portals.forEach((item) => {
        this.portals!.delete(item.id)
      })
    }
  }
}
