"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChartData {
  name: string
  value: number
}

interface Graph {
  id: string
  name: string
  data: ChartData[]
  type: "line" | "bar" | "pie" | "radar"
  colors: {
    background: string
    border: string
  }
  xAxis: string
  yAxis: string
}

export default function DataTable() {
  const [graph, setGraph] = useState<Graph | null>(null)
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [newDataPoint, setNewDataPoint] = useState<ChartData>({ name: "", value: 0 })
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  useEffect(() => {
    const fetchGraph = () => {
      const graphs = JSON.parse(localStorage.getItem("graphs") || "[]")
      const currentGraph = graphs.find((g: Graph) => g.id === id)
      if (currentGraph) {
        setGraph(currentGraph)
        setXAxis(currentGraph.xAxis || "X Axis")
        setYAxis(currentGraph.yAxis || "Y Axis")
      } else {
        router.push("/")
      }
    }

    fetchGraph()
  }, [id, router])

  const handleValueChange = (index: number, newValue: string) => {
    if (!graph) return

    const updatedData = [...graph.data]
    updatedData[index] = { ...updatedData[index], value: Number.parseFloat(newValue) || 0 }

    const updatedGraph = { ...graph, data: updatedData }
    setGraph(updatedGraph)

    // Update localStorage
    updateLocalStorage(updatedGraph)
  }

  const handleAxisChange = () => {
    if (!graph) return

    const updatedGraph = { ...graph, xAxis, yAxis }
    setGraph(updatedGraph)

    // Update localStorage
    updateLocalStorage(updatedGraph)
  }

  const handleAddDataPoint = () => {
    if (!graph || !newDataPoint.name) return

    const updatedData = [...graph.data, newDataPoint]
    const updatedGraph = { ...graph, data: updatedData }
    setGraph(updatedGraph)

    // Update localStorage
    updateLocalStorage(updatedGraph)

    // Reset new data point input
    setNewDataPoint({ name: "", value: 0 })
  }

  const handleDeleteDataPoint = (index: number) => {
    if (!graph) return

    const updatedData = graph.data.filter((_, i) => i !== index)
    const updatedGraph = { ...graph, data: updatedData }
    setGraph(updatedGraph)

    // Update localStorage
    updateLocalStorage(updatedGraph)
  }

  const updateLocalStorage = (updatedGraph: Graph) => {
    const graphs = JSON.parse(localStorage.getItem("graphs") || "[]")
    const updatedGraphs = graphs.map((g: Graph) => (g.id === updatedGraph.id ? updatedGraph : g))
    localStorage.setItem("graphs", JSON.stringify(updatedGraphs))
  }

  if (!graph) {
    return <div className="flex items-center justify-center h-screen bg-[#1A1A1A] text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href={`/graphs/${id}`} className="inline-flex items-center text-white mb-6 hover:text-gray-300">
          <ArrowLeft className="mr-2" size={20} />
          Back to Graph
        </Link>
        <h1 className="text-2xl font-semibold mb-6">{graph.name} - Data Table</h1>
        <div className="mb-6 flex space-x-4">
          <div>
            <label htmlFor="xAxis" className="block text-sm font-medium text-gray-300 mb-1">
              X Axis Name
            </label>
            <Input
              id="xAxis"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="bg-[#2C2C2C] text-white"
            />
          </div>
          <div>
            <label htmlFor="yAxis" className="block text-sm font-medium text-gray-300 mb-1">
              Y Axis Name
            </label>
            <Input
              id="yAxis"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="bg-[#2C2C2C] text-white"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAxisChange} className="bg-blue-500 hover:bg-blue-600 text-white">
              Update Axis Names
            </Button>
          </div>
        </div>
        <div className="bg-[#2C2C2C] rounded-xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">{xAxis}</th>
                <th className="text-left p-2">{yAxis}</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {graph.data.map((point, index) => (
                <tr key={index}>
                  <td className="p-2">{point.name}</td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={point.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      className="w-full bg-[#3C3C3C] text-white"
                    />
                  </td>
                  <td className="p-2">
                    <Button
                      onClick={() => handleDeleteDataPoint(index)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-2">
                  <Input
                    value={newDataPoint.name}
                    onChange={(e) => setNewDataPoint({ ...newDataPoint, name: e.target.value })}
                    placeholder="New data point name"
                    className="w-full bg-[#3C3C3C] text-white"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    value={newDataPoint.value}
                    onChange={(e) => setNewDataPoint({ ...newDataPoint, value: Number(e.target.value) || 0 })}
                    placeholder="New data point value"
                    className="w-full bg-[#3C3C3C] text-white"
                  />
                </td>
                <td className="p-2">
                  <Button onClick={handleAddDataPoint} className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

