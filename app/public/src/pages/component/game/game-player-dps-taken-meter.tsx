import { useMemo } from "react";
import { IDps } from "../../../../../types";
import GameDpsTaken from "./game-dps-taken";

export default function GamePlayerDpsTakenMeter({
  dpsMeter = [],
}: {
  dpsMeter: IDps[];
}) {
  const sortedDamageTaken = useMemo(
    () =>
      [...dpsMeter].sort((a, b) => {
        return (
          b.physicalDamageReduced +
          b.specialDamageReduced +
          b.shieldDamageTaken -
          (a.physicalDamageReduced +
            a.specialDamageReduced +
            a.shieldDamageTaken)
        );
      }),
    [dpsMeter]
  );

  const maxDamageTaken = useMemo(() => {
    const firstDps = sortedDamageTaken.at(0);
    if (!firstDps) {
      return 0;
    }
    return (
      firstDps.physicalDamageReduced +
      firstDps.specialDamageReduced +
      firstDps.shieldDamageTaken
    );
  }, [sortedDamageTaken]);

  return (
    <div>
      {sortedDamageTaken.map((p) => {
        return (
          <GameDpsTaken key={p.id} dps={p} maxDamageTaken={maxDamageTaken} />
        );
      })}
    </div>
  );
}
