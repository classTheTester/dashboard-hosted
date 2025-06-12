"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import dynamic from "next/dynamic"

const XLSX = dynamic(() => import("xlsx"), { ssr: false })

interface ChartData {
  name: string
  value: number
}

interface Graph {
  id: string
  name: string
  createdAt: string
  data: ChartData[]
  type: "column" | "bar" | "line" | "combo" | "pie" | "heatmap" | "funnel"
  colors: {
    background: string
    border: string
  }
  image?: {
    url: string
    position: { x: number; y: number }
  }
  xAxis?: string
  yAxis?: string
}

const GraphCard = dynamic(() => import("../components/GraphCard"), {
  loading: () => <div className="aspect-[4/3] bg-[#2C2C2C] rounded-xl animate-pulse"></div>,
})

export default function Home() {
  const [graphs, setGraphs] = useState<Graph[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedGraphs = JSON.parse(localStorage.getItem("graphs") || "[]")
    setGraphs(storedGraphs)
    setIsLoading(false)
  }, [])

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const data = await parseFile(file)
      const newGraph: Graph = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        createdAt: new Date().toISOString(),
        data: data,
        type: "line",
        colors: {
          background: "#36a2eb",
          border: "#36a2eb",
        },
        xAxis: "Data Points", // Add default X-axis label
        yAxis: "Values", // Add default Y-axis label
      }

      const updatedGraphs = [...graphs, newGraph]
      setGraphs(updatedGraphs)
      localStorage.setItem("graphs", JSON.stringify(updatedGraphs))
      window.location.href = `/excel-graph-viewer/graphs/${newGraph.id}`
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Error processing file. Please try again.")
    }
  }

  const parseFile = async (file: File): Promise<ChartData[]> => {
    if (file.name.endsWith(".csv")) {
      const text = await file.text()
      const rows = text.split("\n").map((row) => row.split(","))
      const headers = rows[0]
      return rows.slice(1).map((row) => ({
        name: row[0] || "",
        value: Number.parseFloat(row[1]) || 0,
      }))
    } else {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      const headers = Object.keys(json[0])
      return json.map((row: any) => ({
        name: String(row[headers[0]]) || "",
        value: Number(row[headers[1]]) || 0,
      }))
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#1A1A1A] text-white p-8 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">My Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Report Card */}
          <div className="aspect-[4/3] bg-[#2C2C2C] rounded-xl overflow-hidden flex items-center justify-center">
            <button
              className="bg-[#0066FF] text-white px-6 py-2 rounded-md hover:bg-[#0052CC] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              New report
            </button>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" onChange={handleFileSelect} />

          {/* Graph Cards */}
          <Suspense fallback={<div className="aspect-[4/3] bg-[#2C2C2C] rounded-xl animate-pulse"></div>}>
            {graphs.map((graph) => (
              <GraphCard key={graph.id} graph={graph} />
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

