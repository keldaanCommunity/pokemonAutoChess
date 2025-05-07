import { useMemo } from "react";
import { IDps } from "../../../../../types";
import GameDps from "./game-dps";

type GamePlayerDpsMeterInput = {
  dpsMeter: IDps[];
};

export default function GamePlayerDpsMeter({
  dpsMeter = [],
}: GamePlayerDpsMeterInput) {
  const sortedDps = useMemo(
    () =>
      [...dpsMeter].sort((a, b) => {
        return (
          b.physicalDamage +
          b.specialDamage +
          b.trueDamage -
          (a.physicalDamage + a.specialDamage + a.trueDamage)
        );
      }),
    [dpsMeter]
  );

  const maxDamage = useMemo(() => {
    const firstDps = sortedDps.at(0);
    if (!firstDps) {
      return 0;
    }
    return (
      firstDps.physicalDamage + firstDps.specialDamage + firstDps.trueDamage
    );
  }, [sortedDps]);

  return (
    <div>
      {sortedDps.map((p) => {
        return <GameDps key={p.id} dps={p} maxDamage={maxDamage} />;
      })}
    </div>
  );
}
