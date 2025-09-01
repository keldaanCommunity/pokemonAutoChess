import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from "react"
import { useTranslation } from "react-i18next"
import { precomputedPokemons } from "../../../../../../gen/precomputed-pokemons"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import { Ability } from "../../../../../types/enum/Ability"
import { Stat } from "../../../../../types/enum/Game"
import { Passive } from "../../../../../types/enum/Passive"
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { clamp } from "../../../../../utils/number"
import { pickRandomIn } from "../../../../../utils/random"
import { values } from "../../../../../utils/schemas"
import { cc } from "../../utils/jsx"
import SynergyIcon from "../icons/synergy-icon"
import { Modal } from "../modal/modal"
import PokemonPortrait from "../pokemon-portrait"
import "./pokeguesser.css"

const listPokemonsToGuess = precomputedPokemons
    .filter((p) => p.passive !== Passive.INANIMATE && p.skill !== Ability.DEFAULT)
    .filter(
        (p) =>
            !(
                PkmFamily[p.name] === Pkm.MILCERY &&
                p.stars === 3 &&
                p.name !== Pkm.ALCREMIE_VANILLA
            )
    )
    .filter((p) => !(PkmFamily[p.name] === Pkm.UNOWN_A && p.name !== Pkm.UNOWN_A))
    .sort(
        (a, b) => parseInt(a.index.split("-")[0]) - parseInt(b.index.split("-")[0])
    )

export default function Pokeguesser(props: {
    show: boolean
    handleClose: Dispatch<SetStateAction<void>>
}) {
    const { t } = useTranslation()

    const [pokemonToGuess, setPokemonToGuess] = useState<Pokemon>(
        pickRandomIn(listPokemonsToGuess)
    )
    const [attempts, setAttempts] = useState<Pokemon[]>([])
    const [value, setValue] = useState<Pkm | "">("")
    const [found, setFound] = useState(false)
    const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">(
        "normal"
    )

    const submitGuess = (pokemonName: Pkm) => {
        const pokemon = listPokemonsToGuess.find((p) => p.name === pokemonName)
        if (!pokemon) return null
        setAttempts([...attempts, pokemon])
        setValue("")
        if (pokemon.name === pokemonToGuess.name) {
            setFound(true)
        }
    }

    const resetGame = () => {
        setPokemonToGuess(pickRandomIn(listPokemonsToGuess))
        setAttempts([])
        setValue("")
        setFound(false)
    }

    useEffect(() => {
        resetGame()
    }, [difficulty])

    return (
        <Modal
            show={props.show}
            onClose={props.handleClose}
            className="game-pokeguesser-modal"
            header={t("gadget.pokeguesser")}
        >
            <fieldset className="pokeguesser-options">
                <label htmlFor="difficulty-select" style={{ marginRight: 8 }}>
                    {t("pokeguessr.difficulty") || "Difficulty"}:
                </label>
                <select
                    id="difficulty-select"
                    style={{ marginRight: 16 }}
                    value={difficulty}
                    onChange={(e) =>
                        setDifficulty(e.target.value as "easy" | "normal" | "hard")
                    }
                >
                    <option value="easy">{t("pokeguessr.easy")}</option>
                    <option value="normal">{t("pokeguessr.normal")}</option>
                    <option value="hard">{t("pokeguessr.hard")}</option>
                </select>
            </fieldset>
            <h2>
                {found
                    ? t("pokeguessr.itssolution", { pokemon: pokemonToGuess.name })
                    : t("pokeguessr.whosthatpokemon")}
            </h2>
            {difficulty === "hard" && !found ? (
                <img
                    src="assets/ui/missing-portrait.png"
                    className="pokemon-portrait"
                />
            ) : (
                <PokemonPortrait
                    portrait={{ index: pokemonToGuess.index }}
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                        filter: found
                            ? ""
                            : difficulty === "easy"
                                ? `blur(${16 - clamp(attempts.length, 0, 15)}px)`
                                : `blur(${16 - clamp(attempts.length, 0, 15)}px) grayscale(${100 - clamp(attempts.length, 0, 10) * 10}%)`
                    }}
                />
            )}

            {found ? (
                <p>
                    <button className="bubbly blue" onClick={resetGame}>
                        {t("pokeguessr.reset")}
                    </button>
                </p>
            ) : (
                <PokemonSelect
                    value={value}
                    setValue={setValue}
                    onSubmit={submitGuess}
                />
            )}

            <div className="attempts">
                <h3>{t("pokeguessr.attempts", { count: attempts.length })}</h3>
                <ul>
                    {attempts.map((pkm, i) => (
                        <PokemonAttempt
                            key={i}
                            index={i}
                            pokemon={pkm}
                            solution={pokemonToGuess}
                            difficulty={difficulty}
                        />
                    ))}
                </ul>
            </div>
        </Modal>
    )
}

type PokemonSelectProps = {
    value: Pkm | ""
    setValue: (v: Pkm | "") => void
    onSubmit?: (p: Pkm) => void
}

export function PokemonSelect({
    value,
    setValue,
    onSubmit
}: PokemonSelectProps) {
    const { t } = useTranslation()

    const [showDropdown, setShowDropdown] = useState(false)
    const [filtered, setFiltered] = useState(listPokemonsToGuess)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setFiltered(
            listPokemonsToGuess.filter((p) =>
                p.name.toLowerCase().startsWith(value.toLowerCase())
            )
        )
    }, [value])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (name: Pkm) => {
        setValue(name)
        setShowDropdown(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSubmit) {
            onSubmit(value as Pkm)
        }
    }

    return (
        <form onSubmit={handleSubmit} id="pokemon-select-form">
            <div>
                {value &&
                    (() => {
                        const selected = listPokemonsToGuess.find((p) => p.name === value)
                        if (!selected) return null
                        return (
                            <img
                                src={getPortraitSrc(selected.index)}
                                alt={selected.name}
                                style={{ width: 32, height: 32 }}
                            />
                        )
                    })()}
                <input
                    ref={inputRef}
                    name="pokemon"
                    id="pokemon-custom-input"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value as Pkm | "")
                        setShowDropdown(true)
                    }}
                    autoComplete="off"
                    placeholder="Select a Pokémon..."
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && filtered.length === 1) {
                            e.preventDefault()
                            setShowDropdown(false)
                            if (onSubmit) {
                                onSubmit(filtered[0].name)
                            }
                        } else if (e.key === "Escape") {
                            setShowDropdown(false)
                            e.stopPropagation()
                        }
                    }}
                />
                {showDropdown && filtered.length > 0 && (
                    <div ref={dropdownRef} className="dropdown">
                        {filtered.map((p) => (
                            <div
                                key={p.name}
                                className="dropdown-item"
                                onMouseDown={() => handleSelect(p.name)}
                            >
                                <span className="portrait">
                                    <img
                                        src={getPortraitSrc(p.index)}
                                        alt={p.name}
                                        style={{ width: 32, height: 32, marginRight: 8 }}
                                    />
                                </span>
                                <span className="name">{t(`pkm.${p.name}`)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button className="bubbly blue" type="submit">
                {t("pokeguessr.guess")}
            </button>
        </form>
    )
}

export function PokemonAttempt({
    pokemon,
    solution,
    index,
    difficulty
}: {
    pokemon: Pokemon
    solution: Pokemon
    index: number
    difficulty: "easy" | "normal" | "hard"
}) {
    const { t } = useTranslation()
    const statsHints = [
        Stat.HP,
        Stat.ATK,
        Stat.DEF,
        Stat.SPEED,
        Stat.SPE_DEF,
        Stat.RANGE,
        Stat.PP
    ] as const
    const randomStat = statsHints[(index + parseInt(solution.index)) % 7]
    const statMapping: Record<(typeof statsHints)[number], string> = {
        [Stat.HP]: "hp",
        [Stat.ATK]: "atk",
        [Stat.DEF]: "def",
        [Stat.SPEED]: "speed",
        [Stat.SPE_DEF]: "speDef",
        [Stat.RANGE]: "range",
        [Stat.PP]: "maxPP"
    }
    const pokemonStat = pokemon[statMapping[randomStat]]
    const solutionStat = solution[statMapping[randomStat]]

    return (
        <li className="pokemon-attempt">
            <span className={cc("name", { valid: pokemon.name === solution.name })}>
                <img
                    className="pokemon-portrait"
                    src={getPortraitSrc(pokemon.index)}
                    alt={pokemon.name}
                    style={{
                        width: 32,
                        height: 32,
                        marginRight: 8
                    }}
                />
                {t(`pkm.${pokemon.name}`)}
            </span>
            <span
                className={cc("rarity", { valid: pokemon.rarity === solution.rarity })}
            >
                {t(`rarity.${pokemon.rarity}`)}
            </span>
            <span
                className={cc("stars", { valid: pokemon.stars === solution.stars })}
            >
                {" "}
                {Array.from({ length: pokemon.stars }, (_, i) => (
                    <img src="assets/ui/star.svg" height="24" key={"star" + i}></img>
                ))}
            </span>
            {(difficulty === "easy" || index >= 8) && (
                <span
                    className={cc("pool", {
                        valid:
                            pokemon.regional === solution.regional &&
                            pokemon.additional === solution.additional
                    })}
                >
                    {t(
                        `pool.${pokemon.regional ? "regional" : pokemon.additional ? "additional" : "regular"}`
                    )}
                </span>
            )}
            {values(pokemon.types).map((type, i) => (
                <span
                    key={i}
                    className={cc("type", type, { valid: solution.types.has(type) })}
                >
                    <SynergyIcon type={type} /> {t(`synergy.${type}`)}
                </span>
            ))}
            <span className={cc("stat", { valid: pokemonStat === solutionStat })}>
                <img
                    src={`assets/icons/${randomStat.toUpperCase()}.png`}
                    alt={t(`stat.${randomStat}`)}
                    title={t(`stat.${randomStat}`)}
                    height="32"
                />{" "}
                {pokemonStat}
                {solutionStat > pokemonStat
                    ? " ⏶"
                    : solutionStat < pokemonStat
                        ? " ⏷"
                        : ""}
            </span>
        </li>
    )
}
