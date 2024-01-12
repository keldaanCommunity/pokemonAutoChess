import React, { useEffect, useState } from "react"
import {
  IDpsStatistic,
  fetchMetaDps
} from "../../../../../models/mongo-models/dps-statistic"

export function DpsReport() {
  const [loading, setLoading] = useState<boolean>(true)

  const [metaPokemons, setMetaPokemons] = useState<IDpsStatistic[]>([])
  useEffect(() => {
    fetchMetaDps().then((res) => {
      setMetaPokemons(res)
      setLoading(false)
    })
  }, [])
  return (
    <div>
      {loading && (
        <div>
          {metaPokemons.map((stat) => (
            <DpsPokemon key={stat.name} stat={stat} />
          ))}
        </div>
      )}
    </div>
  )
}

function DpsPokemon(props: { stat: IDpsStatistic }) {
  return <div></div>
}
