import { useMemo } from "react";

import { IDps } from "../../../../../types";

import "./game-dps-status.css";

export const GameDpsStatus = ({
  myMeter,
  opponentMeter,
  attributes,
  icon,
  title,
  alt,
}: {
  myMeter: IDps[];
  opponentMeter: IDps[];
  attributes: (keyof IDps)[];
  icon: string;
  title: string;
  alt: string;
}) => {
  const myValue = useMemo(() => getValue(myMeter, attributes), [myMeter]);
  const opponentValue = useMemo(
    () => getValue(opponentMeter, attributes),
    [opponentMeter]
  );

  const totalValue = myValue + opponentValue;
  const myValuePercent = totalValue === 0 ? 50 : (myValue / totalValue) * 100;
  const opponentValuePercent =
    totalValue === 0 ? 50 : (opponentValue / totalValue) * 100;

  return (
    <div className='game-dps-status'>
      <img src={icon} title={title} alt={alt} />
      <div className='game-dps-status-bar'>
        <div
          className='game-dps-status-bar-my'
          style={{ width: `${myValuePercent}%` }}
          title={`My ${title}: ${myValue}`}
        >
          {myValue > 0 && (
            <span className='game-dps-status-bar-value'>{myValue}</span>
          )}
        </div>
        <div
          className='game-dps-status-bar-opponent'
          style={{ width: `${opponentValuePercent}%` }}
          title={`Opponent ${title}: ${opponentValue}`}
        >
          {opponentValue > 0 && (
            <span className='game-dps-status-bar-value'>{opponentValue}</span>
          )}
        </div>
      </div>
    </div>
  );
};

function getValue(meter: IDps[], attributes: (keyof IDps)[]) {
  return meter.reduce(
    (acc, curr) =>
      acc +
      attributes
        .filter((attribute) => curr[attribute])
        .reduce((a, c) => a + Number(curr[c]), 0),
    0
  );
}
