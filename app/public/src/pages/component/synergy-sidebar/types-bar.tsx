import React from "react";
import { Synergy } from "../../../../../types/enum/Synergy";
import SynergyIcon from "../icons/synergy-icon";
import "./synergy-sidebar.css";

export default function TypesBar({ selectedSynergies, setSelectedSynergies }) {
  const onSynergyClick = (type: Synergy) => {
    if (selectedSynergies.length === 0) {
      setSelectedSynergies([type]);
    } else if (selectedSynergies.length === 1) {
      if (selectedSynergies.includes(type)) {
        setSelectedSynergies([]);
      } else {
        const newValue = [...selectedSynergies, type];
        setSelectedSynergies(newValue);
      }
    } else {
      setSelectedSynergies([type]);
    }
  };
  return (
    <div id="synergy-sidebar">
      {(Object.keys(Synergy) as Synergy[]).map((type) => {
        return (
          <button
            key={type}
            onClick={() => onSynergyClick(type)}
            className={`synergy-cta ${
              selectedSynergies.includes(type) ? "selected" : ""
            }`}
          >
            <SynergyIcon type={type} />
          </button>
        );
      })}
    </div>
  );
}
