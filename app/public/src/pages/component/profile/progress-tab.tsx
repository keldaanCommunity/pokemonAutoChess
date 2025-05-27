import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from "../../../hooks"
import { precomputedPokemons } from "../../../../../../gen/precomputed-pokemons"
import { Title } from '../../../../../types';
import { GADGETS } from '../../../../../core/gadgets';
import "./progress-tab.css"

export function ProgressTab() {
    const { t } = useTranslation()

    const pokemonCollection = useAppSelector(
        (state) => [...state.network.profile?.pokemonCollection?.values() ?? []]
    )
    const user = useAppSelector((state) => state.network.profile)
    const nbAvatarsUnlocked = pokemonCollection.filter((item) => item.emotions.length > 0 || item.shinyEmotions.length > 0).length
    const nbPokemonsPlayed = pokemonCollection.filter((item) => item.played > 0).length
    const nbPokemonsTotal = precomputedPokemons.length
    const nbTitlesUnlocked = user?.titles.length ?? 0
    const nbTitlesTotal = Object.keys(Title).length;
    const level = user?.level ?? 0
    const gadgets = Object.values(GADGETS).filter((g) => !g.disabled)
    const nbGadgetsUnlocked = gadgets.filter(
        (g) => g.levelRequired <= level
    ).length

    return <div>
        <div className="progress-grid">
            <ProgessBox label={t("avatars_unlocked", { count: nbAvatarsUnlocked, total: nbPokemonsTotal })} count={nbAvatarsUnlocked} total={nbPokemonsTotal} />
            <ProgessBox label={t("pokemons_played", { count: nbPokemonsPlayed, total: nbPokemonsTotal })} count={nbPokemonsPlayed} total={nbPokemonsTotal} />
            <ProgessBox label={t("titles_unlocked", { count: nbTitlesUnlocked, total: nbTitlesTotal })} count={nbTitlesUnlocked} total={nbTitlesTotal} />
            <ProgessBox label={t("gadgets_unlocked", { count: nbGadgetsUnlocked, total: gadgets.length })} count={nbGadgetsUnlocked} total={gadgets.length} />
            {/*<ProgessBox label={"Max rank reached: 5/11"} count={5} total={11} />*/}
        </div>
    </div>
}

export function ProgessBox(props: { label: string, count: number, total: number }) {
    const { label, count, total } = props;

    return (
        <div className="progress-box" style={{ "--pc": `${(100 * count / total).toFixed(3)}%` } as React.CSSProperties}>
            {label}
        </div>
    );
}