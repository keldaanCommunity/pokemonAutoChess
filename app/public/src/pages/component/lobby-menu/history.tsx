import React from "react";
import {
  IGameRecord,
  IPokemonRecord,
} from "../../../../../models/colyseus-models/game-record";
import Elo from "../elo";
import Team from "../after/team";
import SynergyIcon from "../icons/synergy-icon";
import { formatDate } from "../../utils/date";
import { Synergy } from "../../../../../types/enum/Synergy";
import PokemonFactory from "../../../../../models/pokemon-factory";
import { Pkm, PkmFamily } from "../../../../../types/enum/Pokemon";
import { addSynergiesFromStones } from "../../../../../models/colyseus-models/synergies";
import "./history.css";

export default function History(props: { history: IGameRecord[] }) {
  return (
    <article className="game-history-list">
      <h2>Game History</h2>
      {(!props.history || props.history.length === 0) && (
        <p>No history found</p>
      )}
      {props.history &&
        props.history.map((r) => (
          <div key={r.time} className="nes-container game-history">
            <span className="top">Top {r.rank}</span>
            <Elo elo={r.elo} />
            <ul className="synergies">
              {getTopSynergies(r.pokemons).map(([type, value]) => (
                <li>
                  <SynergyIcon type={type} />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
            <p className="date">{formatDate(r.time)}</p>
            <Team team={r.pokemons}></Team>
          </div>
        ))}
    </article>
  );
}

function getTopSynergies(team: IPokemonRecord[]): [Synergy, number][] {
  const synergies = new Map<Synergy, number>();
  const typesPerFamily = new Map<Pkm, Set<Synergy>>();

  team.forEach((pkmRecord: IPokemonRecord) => {
    const pkm = PokemonFactory.createPokemonFromName(pkmRecord.name);
    pkmRecord.items.forEach((item) => {
      pkm.items.add(item);
    });
    addSynergiesFromStones(pkm);
    const family = PkmFamily[pkm.name];
    if (!typesPerFamily.has(family)) typesPerFamily.set(family, new Set());
    const types: Set<Synergy> = typesPerFamily.get(family)!;
    pkm.types.forEach((type) => types.add(type));
  });

  typesPerFamily.forEach((types) => {
    types.forEach((type) => {
      synergies.set(type, (synergies.get(type) ?? 0) + 1);
    });
  });

  const topSynergies = [...synergies.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return topSynergies;
}
