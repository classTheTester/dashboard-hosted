"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import DynamicChart from "@/components/dynamic-chart"
import { Sidebar } from "@/components/sidebar"

interface Graph {
  id: string
  name: string
  data: Array<{ name: string; value: number }>
  type: "column" | "bar" | "line" | "combo" | "pie" | "heatmap" | "funnel"
  colors: {
    background: string
    border: string
  }
}

function SharedDeckContent() {
  const [graph, setGraph] = useState<Graph | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    // In a real app, you'd fetch the shared graph data from an API
    const fetchSharedGraph = () => {
      if (!id) {
        router.push("/")
        return
      }
      
      if (typeof window === 'undefined') return
      
      const sharedGraphs = JSON.parse(localStorage.getItem("sharedGraphs") || "[]")
      const sharedGraph = sharedGraphs.find((g: Graph) => g.id === id)
      if (sharedGraph) {
        setGraph(sharedGraph)
      } else {
        router.push("/")
      }
    }

    fetchSharedGraph()
  }, [id, router])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (graph && typeof window !== 'undefined') {
      // In a real app, you'd send the updated graph data to an API
      const graphs = JSON.parse(localStorage.getItem("graphs") || "[]")
      const updatedGraphs = [...graphs, graph]
      localStorage.setItem("graphs", JSON.stringify(updatedGraphs))
      router.push(`/graph?id=${graph.id}`)
    }
  }

  const updateGraph = (updatedGraph: Partial<Graph>) => {
    setGraph((prevGraph) => {
      if (!prevGraph) return null
      return { ...prevGraph, ...updatedGraph }
    })
  }

  if (!graph) {
    return <div className="flex items-center justify-center h-screen bg-[#1A1A1A] text-white">Loading...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#1e1e2f]">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-[#2C2C2C]">
          <h1 className="text-2xl font-semibold text-white">{graph.name} (Shared)</h1>
          {isEditing ? <Button onClick={handleSave}>Save Changes</Button> : <Button onClick={handleEdit}>Edit</Button>}
        </div>
        <div className="flex-1 p-4">
          <DynamicChart data={graph.data} type={graph.type} colors={graph.colors} />
        </div>
      </div>
      {isEditing && <Sidebar graph={graph} updateGraph={updateGraph} />}
    </div>
  )
}

export default function SharedDeck() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#1A1A1A] text-white">Loading...</div>}>
      <SharedDeckContent />
    </Suspense>
  )
}