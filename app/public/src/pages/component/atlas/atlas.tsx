import type { SetSchema } from "@colyseus/schema"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import {
  TransformComponent,
  TransformWrapper,
  useControls
} from "react-zoom-pan-pinch"
import {
  ATLAS_INITIAL_SCALE,
  ATLAS_MAX_SCALE,
  ATLAS_MIN_SCALE,
  type AtlasNodeId,
  AtlasTree
} from "../../../../../config/game/atlas"
import {
  type AtlasNode,
  type Emera,
  isLegendaryNode
} from "../../../../../types/atlas"
import {
  isPkmDuo,
  type Pkm,
  PkmDuos,
  PkmIndex
} from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { entries } from "../../../../../utils/object"
import { ItemDetailTooltipContent } from "../../../game/components/item-detail"
import { useAppSelector } from "../../../hooks"
import { pickAtlasNode } from "../../../network"
import { playSound, SOUNDS } from "../../utils/audio"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import PokemonPortrait from "../pokemon-portrait"
import "./atlas.css"

const ROOT_POSITION = AtlasTree.nodes.root.position
const LEGENDARY_POSITIONS = entries(AtlasTree.nodes)
  .filter(([, node]) => node.type === "legendary")
  .map(([, node]) => node.position)
const REVEAL_ORBIT_RADIUS = 120

export function Atlas({ origin = "game" }: { origin?: "game" | "wiki" }) {
  const [demoUnlockedNodes, setDemoUnlockedNodes] = useState<Set<AtlasNodeId>>(
    new Set(["root"])
  )
  const atlasVisible = useAppSelector((state) => state.game.atlasVisible)
  const atlasManager = useAppSelector((state) => state.game.atlasManager)

  const unlockedNodes =
    origin === "game" && atlasManager
      ? atlasManager.unlockedNodes
      : demoUnlockedNodes

  const emera = origin === "game" && atlasManager ? atlasManager.emera : 0
  const legendaries = atlasManager.legendaries
  const symbols = atlasManager.symbols
  const [isLegendariesRevealed, setIsRevealed] = useState<boolean>(false)

  useEffect(() => {
    if (
      !isLegendariesRevealed &&
      legendaries.length > 0 &&
      symbols.length > 0 &&
      atlasVisible
    ) {
      setIsRevealed(true)
      playSound(SOUNDS.LEGENDARY_REVEAL, 0.7)
    } else if (isLegendariesRevealed && legendaries.length === 0) {
      setIsRevealed(false)
    }
  }, [symbols, legendaries, isLegendariesRevealed, atlasVisible])

  const canRemoveNodes = origin === "wiki"

  const handleNodeClick = (nodeId: AtlasNodeId) => {
    if (unlockedNodes.has(nodeId)) {
      if (canRemoveNodes && nodeId !== "root") {
        setDemoUnlockedNodes((prev) => {
          const newSet = new Set(prev)
          newSet.delete(nodeId)
          return newSet
        })
      }
    } else if (isConnectedAndUnlockable(nodeId, unlockedNodes)) {
      if (emera <= 0 && origin !== "wiki") {
        playSound(SOUNDS.EMERA_ERROR, 0.8)
        const orb = document.getElementById("game-connection-orb")
        orb?.classList.add("unaffordable-flash")
        orb?.addEventListener(
          "animationend",
          () => {
            orb?.classList.remove("unaffordable-flash")
          },
          { once: true }
        )
        return
      }
      const node = AtlasTree.nodes[nodeId]
      playSound(
        node.type === "keystone" || node.type === "item"
          ? SOUNDS.EMERA_KEYSTONE
          : SOUNDS.EMERA
      )
      if (origin === "wiki") {
        setDemoUnlockedNodes((prev) => new Set([...prev, nodeId]))
      } else {
        pickAtlasNode(nodeId)
      }
    }
  }

  const COLOR_GLOW = "#ffffff"

  return (
    <div
      id="atlas-container"
      className={cc({
        "has-legendaries": legendaries.length > 0,
        revealing: isLegendariesRevealed
      })}
    >
      <div className="atlas-mask">
        <TransformWrapper
          initialScale={
            origin === "wiki" ? ATLAS_MIN_SCALE : ATLAS_INITIAL_SCALE
          }
          minScale={ATLAS_MIN_SCALE}
          maxScale={ATLAS_MAX_SCALE}
          smooth={true}
          centerOnInit={true}
          centerZoomedOut={true}
          wheel={{ step: 0.005 }}
        >
          <video
            autoPlay
            loop
            muted
            src="/assets/atlas/atlasbg.webm"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: -1
            }}
          ></video>
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <svg
              width="100%"
              height="100%"
              viewBox="-1000 -1000 2000 2000" // Centers the (0,0) coordinate
            >
              {/* DEFINE ASSETS (Background patterns, borders) */}
              <defs>
                <radialGradient id="unlockedGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={COLOR_GLOW} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={COLOR_GLOW} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 1. RENDER CONNECTIONS */}
              <g id="connections">
                {AtlasTree.connections.map((conn, index) => {
                  const fromNode = AtlasTree.nodes[conn.from]
                  const toNode = AtlasTree.nodes[conn.to]
                  const isUnlocked =
                    unlockedNodes.has(conn.from) && unlockedNodes.has(conn.to)
                  if (!fromNode || !toNode) {
                    console.error(
                      `Connection references non-existent node: ${conn.from} or ${conn.to}`
                    )
                    return null // Safety check
                  }

                  return (
                    <line
                      key={index}
                      x1={fromNode.position[0]}
                      y1={fromNode.position[1]}
                      x2={toNode.position[0]}
                      y2={toNode.position[1]}
                      stroke={COLOR_GLOW}
                      strokeWidth={isUnlocked ? 8 : 2}
                    />
                  )
                })}
              </g>

              {/* 2. RENDER NODES */}
              <g id="nodes">
                {entries(AtlasTree.nodes).map(
                  ([nodeId, node]: [AtlasNodeId, AtlasNode]) => {
                    const isUnlocked = unlockedNodes.has(nodeId)
                    const isUnlockable = isConnectedAndUnlockable(
                      nodeId,
                      unlockedNodes
                    )
                    const isAffordable = emera > 0 || origin === "wiki"
                    if (node.type === "legendary" && legendaries.length > 0) {
                      const index = Number(nodeId.at(-1)) - 1
                      node = { ...node, pokemon: legendaries[index] }
                    }

                    return (
                      <Node
                        key={nodeId}
                        node={node}
                        nodeId={nodeId}
                        isUnlocked={isUnlocked}
                        isUnlockable={isUnlockable}
                        isAffordable={isAffordable}
                        onClick={handleNodeClick}
                      />
                    )
                  }
                )}
              </g>

              {/* 3. LEGENDARY REVEAL ANIMATION */}
              {isLegendariesRevealed && (
                <g id="atlas-reveal">
                  {[...symbols].map((symbol, index) => {
                    const target = LEGENDARY_POSITIONS[index] ?? ROOT_POSITION
                    const angle =
                      (Math.atan2(target[1], target[0]) * 180) / Math.PI
                    const targetRadius = Math.hypot(target[0], target[1])
                    return (
                      <g
                        key={`${symbol}-${index}`}
                        className="atlas-reveal-symbol"
                        style={
                          {
                            "--origin-x": `${ROOT_POSITION[0]}px`,
                            "--origin-y": `${ROOT_POSITION[1]}px`,
                            "--angle": `${angle}deg`,
                            "--orbit-radius": `${REVEAL_ORBIT_RADIUS}px`,
                            "--target-radius": `${targetRadius}px`
                          } as React.CSSProperties
                        }
                      >
                        <g className="atlas-reveal-orbit">
                          <g className="atlas-reveal-fly">
                            <image
                              className="atlas-reveal-icon"
                              href={`assets/types/${symbol}.svg`}
                              width={64}
                              height={64}
                            />
                          </g>
                        </g>
                      </g>
                    )
                  })}
                </g>
              )}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>
      <Tooltip
        id="atlas-node-detail-tooltip"
        className="custom-theme-tooltip"
        float
        render={({ content }) => (
          <AtlasNodeDetail nodeId={content as AtlasNodeId} origin={origin} />
        )}
      />
    </div>
  )
}

function Node({
  node,
  nodeId,
  isUnlocked,
  isUnlockable,
  isAffordable,
  onClick
}: {
  node: AtlasNode
  nodeId: AtlasNodeId
  isUnlocked: boolean
  isUnlockable: boolean
  isAffordable: boolean
  onClick: (nodeId: AtlasNodeId) => any
}) {
  const size = NodeSizes[node.type] || 12
  const shouldShowTooltip = node.type !== "step"
  const { zoomToElement } = useControls()

  const legendaries = useAppSelector(
    (state) => state.game.atlasManager.legendaries
  )
  if (node.type === "legendary" && legendaries.length > 0) {
    const index = Number(nodeId.at(-1)) - 1
    node = { ...node, pokemon: legendaries[index] }
  }

  function handleClick(e: React.MouseEvent<SVGGElement, MouseEvent>) {
    e.preventDefault()
    zoomToElement(e.target as HTMLElement, 5, 200, "easeOutCubic")
    onClick(nodeId)
  }

  return (
    <g
      className={cc("atlas-node", node.type, {
        unlockable: isUnlockable,
        unlocked: isUnlocked,
        affordable: isAffordable
      })}
      transform={`translate(${node.position[0]}, ${node.position[1]})`}
      onClick={(e) => handleClick(e)}
      data-tooltip-id={shouldShowTooltip ? "atlas-node-detail-tooltip" : null}
      data-tooltip-content={nodeId}
    >
      {/* Glow Effect if Active */}
      {isUnlocked && (
        <circle r={size * 2} fill="url(#unlockedGlow)" pointerEvents="none" />
      )}

      {/* Node background & inactive border */}
      <circle className="atlas-node-border" r={size} strokeWidth={2} />
      <circle className="atlas-node-bg" r={size - 4} />

      {/* Encounter Icon */}
      {node.type === "encounter" && (
        <image
          href={getPortraitSrc(PkmIndex[node.encounter])}
          height="40"
          width="40"
          transform="translate(-20 -20)"
          style={{ clipPath: "circle(20px)" }}
        />
      )}

      {/* Start Icon */}
      {node.type === "start" && (
        <image
          href={"/assets/atlas/CONNECTION_ORB.png"}
          height="100"
          width="100"
          transform="translate(-50 -50)"
        />
      )}

      {/* Node for Legendary */}
      {node.type === "legendary" &&
        (node.pokemon && isPkmDuo(node.pokemon) ? (
          <>
            <image
              className="atlas-legendary-pokemon"
              href={getPortraitSrc(PkmIndex[PkmDuos[node.pokemon][0]])}
              height="80"
              width="80"
              transform="translate(-40 -40)"
              style={{
                borderRadius: "50%",
                clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)"
              }}
            />
            <image
              className="atlas-legendary-pokemon"
              href={getPortraitSrc(PkmIndex[PkmDuos[node.pokemon][1]])}
              height="80"
              width="80"
              transform="translate(-40 -40)"
              style={{
                borderRadius: "50%",
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%)"
              }}
            />
          </>
        ) : node.pokemon ? (
          <image
            className="atlas-legendary-pokemon"
            href={getPortraitSrc(PkmIndex[node.pokemon])}
            height="80"
            width="80"
            transform="translate(-40 -40)"
            style={{ clipPath: "circle(40px)" }}
          />
        ) : (
          <image
            href={EmeraIcons["legendary"]}
            height="60"
            width="60"
            transform="translate(-30 -30)"
            opacity={isUnlocked ? 1 : 0.5}
          />
        ))}

      {/* Node Emera Icon */}
      {node.type === "keystone" && (
        <image
          href={EmeraIcons[node.emera]}
          height="60"
          width="60"
          transform="translate(-30 -30)"
          opacity={isUnlocked ? 1 : 0.5}
        />
      )}

      {/* Node Item Icon */}
      {node.type === "item" && (
        <image
          href={`assets/item/${node.item}.png`}
          height="60"
          width="60"
          transform="translate(-30 -30)"
          opacity={isUnlocked ? 1 : 0.5}
        />
      )}

      {/* Node Step Icon */}
      {node.type === "step" && isUnlocked && (
        <image
          href={EmeraIcons["blank"]}
          height="30"
          width="30"
          transform="translate(-15 -15)"
        />
      )}

      {/* Node Buff Icon */}
      {node.type === "buff" && (
        <image
          href={EmeraIcons[node.buff]}
          height="30"
          width="30"
          transform="translate(-15 -15)"
          opacity={isUnlocked ? 1 : 0.5}
        />
      )}

      {/* Node active border frame */}
      {isUnlocked && (
        <image
          href={"/assets/atlas/unlocked.png"}
          height={size * 2}
          width={size * 2}
          transform={`translate(-${size} -${size})`}
        />
      )}

      {/* Locked Icon */}
      {node.type === "condition" && (
        <image
          href="/assets/atlas/locked.png"
          height="32"
          width="32"
          transform="translate(-16 -16)"
        />
      )}
    </g>
  )
}

function AtlasNodeDetail({
  nodeId,
  origin
}: {
  nodeId: AtlasNodeId
  origin?: "game" | "wiki"
}) {
  const { t } = useTranslation()
  const node = AtlasTree.nodes[nodeId]
  const legendaries = useAppSelector(
    (state) => state.game.atlasManager.legendaries
  )

  if (!node) return null
  if (node.type === "item") {
    return <ItemDetailTooltipContent item={node.item} />
  }

  if (isLegendaryNode(node) && origin === "game") {
    const index = Number(nodeId.at(-1)) - 1
    const pokemon = legendaries[index]

    if (pokemon && isPkmDuo(pokemon)) {
      const duo: Pkm[] = PkmDuos[pokemon]
      return (
        <>
          <GamePokemonDetail
            origin="atlas"
            pokemon={duo[0]}
          ></GamePokemonDetail>
          <GamePokemonDetail
            origin="atlas"
            pokemon={duo[1]}
          ></GamePokemonDetail>
        </>
      )
    } else if (pokemon != null) {
      return (
        <GamePokemonDetail origin="atlas" pokemon={pokemon}></GamePokemonDetail>
      )
    }
  }

  let portrait,
    title,
    description: string = node.type
  if (node.type === "encounter") {
    portrait = { index: PkmIndex[node.encounter] }
    title = t(`pkm.${node.encounter}`)
    description = t(`atlas.encounter.${node.encounter}`)
  } else if (node.type === "start") {
    title = t(`atlas.connection_orb`)
    description = t(`atlas.connection_orb_description`)
  } else if (node.type === "keystone") {
    title = t(`atlas.keystone.${node.emera}`)
    description = t(`atlas.keystone_description.${node.emera}`)
  } else if (node.type === "legendary") {
    title = t(`atlas.keystone.${node.type}`)
    description = t(`atlas.keystone_description.${node.type}`)
  } else if (node.type === "condition") {
    description = t(`atlas.condition.${node.condition}`)
  } else if (node.type === "buff") {
    description = t(`atlas.buff.${node.buff}`)
  }
  return (
    <div className="atlas-node-detail">
      {portrait && (
        <div className="atlas-node-detail-portrait">
          <PokemonPortrait portrait={portrait} />
        </div>
      )}
      {title && (
        <div className="atlas-node-detail-title">
          <p>{title}</p>
        </div>
      )}
      <div className="atlas-node-detail-description">
        {addIconsToDescription(description)}
      </div>
    </div>
  )
}

const NodeSizes: Record<AtlasNode["type"], number> = {
  start: 50,
  keystone: 45,
  legendary: 45,
  item: 45,
  encounter: 24,
  condition: 20,
  step: 20,
  buff: 20
}

const EmeraIcons: Record<Emera, string> = {
  blank: "/assets/atlas/BLANK_EMERA.png",
  pink: "/assets/atlas/PINK_EMERA.png",
  red: "/assets/atlas/RED_EMERA.png",
  yellow: "/assets/atlas/YELLOW_EMERA.png",
  green: "/assets/atlas/GREEN_EMERA.png",
  blue: "/assets/atlas/BLUE_EMERA.png",
  gigantamax: "/assets/atlas/MAX_EMERA.png",
  legendary: "/assets/atlas/LEGENDARY_EMERA.png",
  awakening: "/assets/atlas/AWAKENING_EMERA.png"
}

function isConnectedAndUnlockable(
  nodeId: AtlasNodeId,
  unlockedNodes: Set<AtlasNodeId> | SetSchema<AtlasNodeId>
) {
  // Logic to check if adjacent node is unlocked
  return (
    unlockedNodes.has(nodeId) === false &&
    AtlasTree.connections.some(
      (conn) =>
        (conn.from === nodeId && unlockedNodes.has(conn.to)) ||
        (conn.to === nodeId && unlockedNodes.has(conn.from))
    )
  )
}
