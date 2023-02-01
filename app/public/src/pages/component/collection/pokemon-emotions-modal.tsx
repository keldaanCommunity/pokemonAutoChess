import React from "react"
import Modal from "react-bootstrap/esm/Modal"
import { useAppSelector } from "../../../hooks"
import PokemonEmotion from "./pokemon-emotion"
import { getPortraitSrc } from "../../../utils"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { Emotion } from "../../../../../types"
import { ITracker } from "../../../../../types/ITracker"
import tracker from "../../../../dist/client/assets/pokemons/tracker.json"
import { cc } from "../../utils/jsx"
import "./pokemon-emotions-modal.css";

export default function PokemonEmotionsModal(props: {
    pokemon: Pkm,
    onHide: () => any
}) {
    const pokemonCollection = useAppSelector((state) => state.lobby.pokemonCollection)
    const metadata = tracker as unknown as { [key: string]: ITracker }

    let p: Pokemon
    let pMetadata: ITracker | undefined = undefined
  
    const availableEmotions: Emotion[] = []

    p = PokemonFactory.createPokemonFromName(props.pokemon)
    
    const pathIndex = p.index.split("-")
    if (pathIndex.length == 1) {
      pMetadata = metadata[p.index]
    } else if (pathIndex.length == 2) {
      pMetadata = metadata[pathIndex[0]].subgroups[pathIndex[1]]
    }

    if (pMetadata) {
      Object.keys(pMetadata.portrait_files).forEach((k) => {
        const possibleEmotion = k as Emotion
        if (Object.values(Emotion).includes(possibleEmotion)) {
          availableEmotions.push(possibleEmotion)
        }
      })
    }
    
    const pConfig = pokemonCollection.find((c) => c.id == p.index)

    return (
        <Modal
          show={true}
          onHide={props.onHide}
          dialogClassName="pokemon-emotions-modal is-dark is-large"
        >
          <Modal.Header>
            <Modal.Title>
              <img src={getPortraitSrc(p.index, pConfig?.selectedShiny, pConfig?.selectedEmotion)}
                   className={cc({ unlocked: pConfig != null })}
              />
              <h1>{props.pokemon}</h1>
              <div className="spacer"/>
              <p className="dust">
                {pConfig ? pConfig.dust : 0} <img src={getPortraitSrc(p.index)} alt="dust" />                
              </p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <section>
              <p>Normal Emotions</p>
              <div>
                {availableEmotions.map((e) => {
                  return (
                    <PokemonEmotion
                      key={e}
                      index={p.index}
                      shiny={false}
                      unlocked={pConfig && pConfig.emotions.includes(e)}
                      path={p.index.replace("-", "/")}
                      emotion={e}
                      dust={pConfig?.dust ?? 0}
                    />
                  )
                })}
              </div>
            </section>
            <section>
              <p>Shiny Emotions</p>
              <div>
                {availableEmotions.map((e) => {
                  return (
                    <PokemonEmotion
                      key={e}
                      index={p.index}
                      shiny={true}
                      unlocked={pConfig && pConfig.shinyEmotions.includes(e)}
                      path={`${p.index.replace("-", "/")}/0000/0001`}
                      emotion={e}
                      dust={pConfig?.dust ?? 0}
                    />
                  )
                })}
              </div>
            </section>
          </Modal.Body>
          <Modal.Footer>
            <button className="bubbly red" onClick={props.onHide}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )
}