import { useTranslation } from "react-i18next";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { PVEStages } from "../../../../../models/pve-stages";
import { IDps, IPlayer } from "../../../../../types";
import { GamePhaseState, Team } from "../../../../../types/enum/Game";
import { selectCurrentPlayer, useAppSelector } from "../../../hooks";
import { usePreference } from "../../../preferences";
import PokemonPortrait from "../pokemon-portrait";
import "./game-dps-meter.css";
import { GameDpsStatus } from "./game-dps-status";
import GamePlayerDpsMeter from "./game-player-dps-meter";
import GamePlayerDpsTakenMeter from "./game-player-dps-taken-meter";
import GamePlayerHpsMeter from "./game-player-hps-meter";

export default function GameDpsMeter() {
  const currentPlayer = useAppSelector(selectCurrentPlayer);
  const team = useAppSelector((state) => state.game.currentTeam);
  const stageLevel = useAppSelector((state) => state.game.stageLevel);
  const phase = useAppSelector((state) => state.game.phase);

  const blueDpsMeter = useAppSelector((state) => state.game.blueDpsMeter);
  const redDpsMeter = useAppSelector((state) => state.game.redDpsMeter);
  const myDpsMeter = team === Team.BLUE_TEAM ? blueDpsMeter : redDpsMeter;
  const opponentDpsMeter = team === Team.BLUE_TEAM ? redDpsMeter : blueDpsMeter;

  const [isOpen, setOpen] = usePreference("showDpsMeter");

  if (!currentPlayer) return null;

  return (
    <GameDpsMeterBase
      phase={phase}
      stageLevel={stageLevel}
      currentPlayer={currentPlayer}
      myDpsMeter={myDpsMeter}
      opponentDpsMeter={opponentDpsMeter}
      isOpen={isOpen}
      setOpen={setOpen}
    />
  );
}

export function GameDpsMeterBase({
  phase,
  stageLevel,
  currentPlayer,
  myDpsMeter,
  opponentDpsMeter,
  isOpen,
  setOpen,
}: {
  phase: GamePhaseState;
  stageLevel: number;
  currentPlayer: Pick<
    IPlayer,
    "name" | "avatar" | "opponentName" | "opponentAvatar"
  >;
  myDpsMeter: IDps[];
  opponentDpsMeter: IDps[];
  isOpen: boolean;
  setOpen: (set: boolean | ((old: boolean) => boolean)) => void;
}) {
  const { t } = useTranslation();

  const isPVE =
    phase === GamePhaseState.FIGHT
      ? stageLevel in PVEStages
      : stageLevel - 1 in PVEStages;

  const name = currentPlayer.name;
  const avatar = currentPlayer.avatar;
  const opponentName = currentPlayer.opponentName;
  const opponentAvatar = currentPlayer.opponentAvatar;

  function toggleOpen() {
    setOpen((old) => !old);
  }

  if (opponentAvatar == "") {
    return null;
  }

  return (
    <>
      <div
        id='game-dps-icon'
        className='my-box clickable'
        title={`${isOpen ? "Hide" : "Show"} battle stats`}
        onClick={toggleOpen}
      >
        <img src='/assets/ui/dpsmeter.svg' />
      </div>
      {isOpen && (
        <div className='my-container hidden-scrollable game-dps-meter'>
          <header>
            <div>
              <PokemonPortrait avatar={avatar} />
              <p>{name}</p>
            </div>
            <h2>vs</h2>
            <div>
              <PokemonPortrait avatar={opponentAvatar} />
              <p>{isPVE ? t(opponentName) : opponentName}</p>
            </div>
          </header>
          <Tabs>
            <TabList className='game-dps-meter-tab-list'>
              <Tab
                key='damage_dealt'
                selectedClassName='game-dps-meter-tab-list-selected'
              >
                <GameDpsStatus
                  myMeter={myDpsMeter}
                  opponentMeter={opponentDpsMeter}
                  attributes={["physicalDamage", "specialDamage", "trueDamage"]}
                  icon='assets/icons/ATK.png'
                  title={t("damage_dealt")}
                  alt={t("damage_dealt")}
                />
              </Tab>
              <Tab key='damage_blocked'>
                <GameDpsStatus
                  myMeter={myDpsMeter}
                  opponentMeter={opponentDpsMeter}
                  attributes={[
                    "physicalDamageReduced",
                    "specialDamageReduced",
                    "shieldDamageTaken",
                  ]}
                  icon='assets/icons/SHIELD.png'
                  title={t("damage_blocked")}
                  alt={t("damage_blocked")}
                />
              </Tab>
              <Tab key='heal'>
                <GameDpsStatus
                  myMeter={myDpsMeter}
                  opponentMeter={opponentDpsMeter}
                  attributes={["heal", "shield"]}
                  icon='assets/icons/HP.png'
                  title={t("heal_shield")}
                  alt={t("heal_shield")}
                />
              </Tab>
            </TabList>

            <TabPanel>
              <p>{t("damage_dealt")}</p>
              <GamePlayerDpsMeter dpsMeter={myDpsMeter} />
              <GamePlayerDpsMeter dpsMeter={opponentDpsMeter} />
            </TabPanel>

            <TabPanel>
              <p>{t("damage_blocked")}</p>
              <GamePlayerDpsTakenMeter dpsMeter={myDpsMeter} />
              <GamePlayerDpsTakenMeter dpsMeter={opponentDpsMeter} />
            </TabPanel>

            <TabPanel>
              <p>{t("heal_shield")}</p>
              <GamePlayerHpsMeter dpsMeter={myDpsMeter} />
              <GamePlayerHpsMeter dpsMeter={opponentDpsMeter} />
            </TabPanel>
          </Tabs>
        </div>
      )}
    </>
  );
}
