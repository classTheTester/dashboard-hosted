'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Edit, Plus } from 'lucide-react'

interface Graph {
  id: string
  name: string
  data: any[]
  createdAt: string
  status?: 'ready' | 'loading'
}

export default function GraphList() {
  const [graphs, setGraphs] = useState<Graph[]>([])

  useEffect(() => {
    const storedGraphs = JSON.parse(localStorage.getItem('graphs') || '[]')
    setGraphs(storedGraphs)
  }, [])

  const handleDelete = (id: string) => {
    const updatedGraphs = graphs.filter(graph => graph.id !== id)
    setGraphs(updatedGraphs)
    localStorage.setItem('graphs', JSON.stringify(updatedGraphs))
  }

  const handleRename = (id: string, newName: string) => {
    const updatedGraphs = graphs.map(graph => 
      graph.id === id ? { ...graph, name: newName } : graph
    )
    setGraphs(updatedGraphs)
    localStorage.setItem('graphs', JSON.stringify(updatedGraphs))
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* New Report Card */}
      <div className="bg-[#2C2C2C] rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
        <Link 
          href="/"
          className="flex flex-col items-center gap-4"
        >
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <Plus size={20} />
            New report
          </button>
        </Link>
      </div>

      {/* Loading Card Example */}
      <div className="bg-[#2C2C2C] rounded-xl overflow-hidden aspect-[4/3] p-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full">
            <div className="text-neutral-400 text-center mb-4">Queued up for enhancing...</div>
            <div className="w-full bg-neutral-700 rounded-full h-1">
              <div className="bg-purple-500 h-1 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Cards */}
      {graphs.map(graph => (
        <div key={graph.id} className="bg-white rounded-xl overflow-hidden aspect-[4/3]">
          <Link href={`/graphs/${graph.id}`} className="h-full flex flex-col">
            <div className="flex-1 bg-white">
              {/* Graph preview will go here */}
            </div>
            <div className="bg-neutral-100 p-4">
              <h3 className="text-neutral-900 font-medium truncate">{graph.name}</h3>
              <p className="text-sm text-neutral-500">
                {new Date(graph.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
