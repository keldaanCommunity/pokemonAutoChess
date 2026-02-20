import React, { CSSProperties, ReactElement } from "react"
import { List } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import {
  ILeaderboardBotInfo,
  ILeaderboardInfo
} from "../../../../../types/interfaces/LeaderboardInfo"
import LeaderboardItem from "./leaderboard-item"

const ROW_HEIGHT = 58

type LeaderboardRowProps = {
  infos: (ILeaderboardInfo | ILeaderboardBotInfo)[]
  isBot: boolean
  noElo: boolean | undefined
}

function LeaderboardRow({
  index,
  style,
  infos,
  isBot,
  noElo
}: {
  ariaAttributes: object
  index: number
  style: CSSProperties
} & LeaderboardRowProps): ReactElement | null {
  return (
    <div style={{ ...style, paddingBottom: 4 }}>
      <LeaderboardItem item={infos[index]} isBot={isBot} noElo={noElo} />
    </div>
  )
}

export default function Leaderboard(props: {
  isBot: boolean
  infos: ILeaderboardInfo[] | ILeaderboardBotInfo[]
  noElo: boolean | undefined
}) {
  return (
    <div style={{ flex: 1, minHeight: 0 }}>
      <AutoSizer
        renderProp={({ height, width }) => {
          if (height === undefined || width === undefined) return null
          return (
            <List<LeaderboardRowProps>
              style={{ height, width }}
              rowCount={props.infos.length}
              rowHeight={ROW_HEIGHT}
              rowComponent={LeaderboardRow}
              rowProps={{
                infos: props.infos as (
                  | ILeaderboardInfo
                  | ILeaderboardBotInfo
                )[],
                isBot: props.isBot,
                noElo: props.noElo
              }}
            />
          )
        }}
      />
    </div>
  )
}
