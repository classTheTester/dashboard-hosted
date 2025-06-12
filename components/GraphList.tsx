"use client"

import type React from "react"

interface GraphListProps {
  graphs: string[]
  onAddGraph: () => void
}

const GraphList: React.FC<GraphListProps> = ({ graphs, onAddGraph }) => {
  return (
    <div>
      <h2>Graphs</h2>
      <ul>
        {graphs.map((graph, index) => (
          <li key={index}>{graph}</li>
        ))}
      </ul>
      <button onClick={onAddGraph}>New graph</button>
    </div>
  )
}

export default GraphList
