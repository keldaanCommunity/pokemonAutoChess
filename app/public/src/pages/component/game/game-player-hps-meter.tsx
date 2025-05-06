import { useMemo } from "react";
import { IDps } from "../../../../../types";
import GameDpsHeal from "./game-dps-heal";

export default function GamePlayerHpsMeter({
  dpsMeter = [],
}: {
  dpsMeter: IDps[];
}) {
  const sortedHps = useMemo(
    () =>
      [...dpsMeter].sort((a, b) => {
        return b.shield + b.heal - (a.shield + a.heal);
      }),
    [dpsMeter]
  );

  const maxHealAmount = useMemo(() => {
    const topHeal = sortedHps.at(0);
    if (!topHeal) {
      return 0;
    }
    return topHeal.shield + topHeal.heal;
  }, [sortedHps]);

  return (
    <div>
      {sortedHps.map((p) => (
        <GameDpsHeal key={p.id} dpsMeter={p} maxHeal={maxHealAmount} />
      ))}
    </div>
  );
}
