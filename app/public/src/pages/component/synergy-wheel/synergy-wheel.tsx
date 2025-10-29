import { Dispatch, SetStateAction, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Synergy } from "../../../../../types/enum/Synergy"
import SynergyIcon from "../icons/synergy-icon"
import { Modal } from "../modal/modal"
import "./synergy-wheel.css"

const SYNERGIES = Object.values(Synergy)

export default function SynergyWheelModal(props: {
  show: boolean
  handleClose: Dispatch<SetStateAction<void>>
}) {
  const { t } = useTranslation()
  const [numSynergies, setNumSynergies] = useState(1)
  const [results, setResults] = useState<Synergy[]>([])
  const [spinning, setSpinning] = useState(false)
  const [reelSequences, setReelSequences] = useState<Synergy[][]>([])
  const reelRefs = useRef<(HTMLDivElement | null)[]>([])
  const slotMachineRef = useRef<HTMLDivElement>(null)

  const drawSynergies = () => {
    if (spinning) return

    setSpinning(true)
    setResults([])
    setReelSequences([]) // Reset sequences

    // Generate random results first - ensuring no duplicates
    const newResults: Synergy[] = []
    const availableSynergies = [...SYNERGIES] // Create a copy to avoid modifying the original

    for (let i = 0; i < numSynergies; i++) {
      if (availableSynergies.length === 0) break // Safety check

      const randomIndex = Math.floor(Math.random() * availableSynergies.length)
      const selectedSynergy = availableSynergies[randomIndex]
      newResults.push(selectedSynergy)

      // Remove the selected synergy from available options
      availableSynergies.splice(randomIndex, 1)
    }

    // Create sequences for each reel that end with the desired result at position 3
    const sequences: Synergy[][] = []
    for (let reelIndex = 0; reelIndex < numSynergies; reelIndex++) {
      const targetSynergy = newResults[reelIndex]
      const sequence: Synergy[] = []

      // Create a sequence where the target synergy appears at index 3 (4th position)
      // This means when we stop at -240px (3 * 80px), it will show the target
      for (let i = 0; i < 20; i++) {
        if (i === 3) {
          sequence.push(targetSynergy)
        } else {
          // Fill other positions with random synergies
          const randomIndex = Math.floor(Math.random() * SYNERGIES.length)
          sequence.push(SYNERGIES[randomIndex])
        }
      }
      sequences.push(sequence)
    }

    setReelSequences(sequences)

    // Each reel stops at different times for more realistic effect
    const baseDuration = 1500
    const slowDownDuration = 500 // Duration of the slow-down animation

    reelRefs.current.forEach((reel, index) => {
      if (reel) {
        const reelDuration = baseDuration + index * 500 + Math.random() * 500
        setTimeout(() => {
          reel.classList.remove("spinning")
          reel.classList.add("stopping")
        }, reelDuration)
      }
    })

    // All results shown after last reel stops + slow-down animation completes
    const totalDuration =
      baseDuration + (numSynergies - 1) * 500 + 500 + slowDownDuration
    setTimeout(() => {
      setResults(newResults)
      setSpinning(false)
      // Reset reel classes and sequences
      reelRefs.current.forEach((reel) => {
        if (reel) {
          reel.classList.remove("stopping")
        }
      })
      setReelSequences([]) // Clear sequences after results are shown
    }, totalDuration)
  }

  return (
    <Modal
      show={props.show}
      onClose={props.handleClose}
      className="game-synergy-wheel-modal"
      header={t("gadget.synergy_wheel")}
    >
      <div className="synergy-wheel-content">
        <div className="synergy-wheel-controls">
          <label>
            {t("synergy_wheel.number_to_draw")}:
            <select
              value={numSynergies}
              onChange={(e) => setNumSynergies(Number(e.target.value))}
              disabled={spinning}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
        </div>

        <div className="slot-machine" ref={slotMachineRef}>
          {Array.from({ length: numSynergies }, (_, index) => (
            <div
              key={index}
              className={`slot-reel ${spinning ? "spinning" : ""}`}
              ref={(el) => {
                reelRefs.current[index] = el
              }}
            >
              <div className="reel-symbols">
                {spinning ? (
                  // Show the sequence for this specific reel
                  reelSequences[index]?.map((synergy, symbolIndex) => (
                    <div key={`${synergy}-${symbolIndex}`} className="symbol">
                      <SynergyIcon type={synergy} size="60px" />
                    </div>
                  )) ||
                  // Fallback for when sequences aren't ready yet
                  [...Array(20)].map((_, symbolIndex) => {
                    const synergy = SYNERGIES[symbolIndex % SYNERGIES.length]
                    return (
                      <div key={`${synergy}-${symbolIndex}`} className="symbol">
                        <SynergyIcon type={synergy} size="60px" />
                      </div>
                    )
                  })
                ) : (
                  // Show result or placeholder
                  <div className="symbol result">
                    {results[index] ? (
                      <SynergyIcon type={results[index]} size="60px" />
                    ) : (
                      <div className="placeholder">?</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          className="spin-button bubbly blue"
          onClick={drawSynergies}
          disabled={spinning}
        >
          {spinning ? t("synergy_wheel.spinning") : t("synergy_wheel.spin")}
        </button>

        {results.length > 0 && !spinning && (
          <div className="results">
            <h3>{t("synergy_wheel.results")}:</h3>
            <div className="result-synergies">
              {results.map((synergy, index) => (
                <div key={index} className="result-synergy">
                  <SynergyIcon type={synergy} size="40px" />
                  <span>{t(`synergy.${synergy}`)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
