import { ApexOptions } from "apexcharts"
import React, { useState } from "react"
import Chart from "react-apexcharts"
import { IMeta } from "../../../../../models/mongo-models/meta"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

type xyz = {
  x: number
  y: number
  z: number
}

export default function Discover(props: { meta: IMeta[] }) {
  const typeStyle = useState<string>(
    '"display:flex; flex-flow:column;align-items:center"'
  )
  const options: ApexOptions = {
    grid: {
      show: false
    },
    yaxis: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      }
    },
    legend: {
      fontFamily: "Press Start 2P"
    },
    chart: {
      foreColor: "#ffffff",
      height: 350,
      type: "bubble"
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 0.8
    },
    colors: [
      "#e6194B",
      "#3cb44b",
      "#ffe119",
      "#4363d8",
      "#f58231",
      "#911eb4",
      "#42d4f4",
      "#f032e6",
      "#bfef45",
      "#fabed4",
      "#469990",
      "#dcbeff",
      "#9A6324",
      "#fffac8",
      "#800000",
      "#aaffc3",
      "#808000",
      "#ffd8b1",
      "#000075",
      "#a9a9a9",
      "#ffffff",
      "#000000"
    ],
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class='nes-container'
                    <div>
                    <p>Rank: ${
                      props.meta[seriesIndex].teams[dataPointIndex].rank
                    }</p>
                    <p>Cluster Size: ${props.meta[seriesIndex].count}</p>
                    <div style='display:flex'><p>Cluster</p> ${Object.keys(
                      props.meta[seriesIndex].types
                    ).reduce((prev, curr) => {
                      return (
                        prev +
                        "<div style=" +
                        typeStyle +
                        '><img src="assets/types/' +
                        curr.toUpperCase() +
                        '.png"/><p>' +
                        props.meta[seriesIndex].types[curr] +
                        "</p></div>"
                      )
                    }, "")}</div>
                    ${Object.keys(
                      props.meta[seriesIndex].teams[dataPointIndex].pokemons
                    ).reduce((prev, curr) => {
                      return (
                        prev +
                        "<img src=" +
                        getPortraitSrc(PkmIndex[curr]) +
                        "/>"
                      )
                    }, "")}
                    </div>
                </div>`
      }
    }
  }

  const series = new Array<{ name: string; data: xyz[] }>()
  props.meta.forEach((team) => {
    const data = new Array<xyz>()
    team.teams.forEach((t) => {
      data.push({
        x: t.x,
        y: t.y,
        z: 10
      })
    })

    let name = ""
    const types = Object.keys(team.types).sort((a, b) => {
      return team.types[b] - team.types[a]
    })
    if (types[0]) {
      name += capitalizeFirstLetter(types[0]) + " " + team.types[types[0]] + "/"
    }
    if (types[1]) {
      name += capitalizeFirstLetter(types[1]) + " " + team.types[types[1]]
    }
    series.push({
      name: name,
      data: data
    })
  })

  return (
    <div
      id="chart"
      style={{ backgroundColor: "rgb(84, 89, 107)", padding: "20px" }}
      className="nes-container"
    >
      <Chart options={options} series={series} type="bubble" height={700} />
    </div>
  )
}
